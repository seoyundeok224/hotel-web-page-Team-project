import { useState, useEffect } from 'react'
import {
    Box, Container, Typography, Card, CardContent, Grid, Button,
    TextField, Select, MenuItem, FormControl, InputLabel, Dialog,
    DialogTitle, DialogContent, DialogActions, Chip, Avatar, IconButton,
    InputAdornment
} from '@mui/material'
import {
    Add as PlusIcon, Search as SearchIcon, Edit as EditIcon,
    People as UsersIcon, Home as HomeIcon, BarChart as BarChartIcon
} from '@mui/icons-material'
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { apiGet } from '../../services/api';
import { roomService } from '../../services/roomService'

const ROOM_TYPES = [
    { value: 'SINGLE', label: '싱글' },
    { value: 'DOUBLE', label: '더블' },
    { value: 'FAMILY', label: '패밀리' },
    { value: 'DELUXE', label: '디럭스' },
    { value: 'SUITE', label: '스위트' },
    { value: 'CONFERENCE', label: '컨퍼런스' },
];

const getRoomTypeLabel = (type) => {
    if (typeof type !== 'string') return type;
    const foundType = ROOM_TYPES.find(t => t.value.toUpperCase() === type.toUpperCase());
    return foundType ? foundType.label : type;
};

const RoomCard = ({ room, reservationsByDate, onStatusChange, onEdit }) => {
    const getStatusInfo = (room) => {
        const hasReservation = reservationsByDate?.some(r => r.roomId === room.id)
        const status = hasReservation ? 'BOOKED' : room.status

        switch (status) {
            case 'AVAILABLE': return { label: '이용가능', color: '#2e7d32', bgColor: '#e8f5e8' }
            case 'BOOKED':    return { label: '예약됨', color: '#1976d2', bgColor: '#e3f2fd' }
            case 'OCCUPIED':  return { label: '투숙중', color: '#d32f2f', bgColor: '#ffebee' }
            case 'MAINTENANCE': return { label: '정비중', color: '#ed6c02', bgColor: '#fff3e0' }
            default: return { label: status, color: '#757575', bgColor: '#f5f5f5' }
        }
    }

    const statusInfo = getStatusInfo(room)

    const handleStatusToggle = () => {
        const statuses = ['AVAILABLE', 'BOOKED', 'OCCUPIED', 'MAINTENANCE']
        const currentIndex = statuses.indexOf(room.status)
        const nextIndex = (currentIndex + 1) % statuses.length
        onStatusChange(room.id, statuses[nextIndex])
    }

    return (
        <Card sx={{ height: '100%', backgroundColor: statusInfo.bgColor, border: `2px solid ${statusInfo.color}20`, cursor: 'pointer' }}>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <div>
                        <Typography variant="h6">{room.roomNumber}</Typography>
                        <Typography variant="body2" color="text.secondary">{getRoomTypeLabel(room.roomType)}</Typography>
                    </div>
                    <IconButton size="small" onClick={(e) => { e.stopPropagation(); onEdit(room) }}>
                        <EditIcon fontSize="small" />
                    </IconButton>
                </Box>
                <Button fullWidth variant="contained" sx={{ backgroundColor: statusInfo.color }} onClick={(e) => { e.stopPropagation(); handleStatusToggle() }}>
                    {statusInfo.label}
                </Button>
                <Box sx={{ mt: 1 }}>
                    <Typography variant="caption">💰 {room.price?.toLocaleString()}원</Typography>
                </Box>
            </CardContent>
        </Card>
    )
}

const FloorSection = ({ floor, rooms, reservationsByDate, onStatusChange, onEdit }) => (
    <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, borderBottom: '1px solid #e0e0e0' }}>
            <HomeIcon />
            <Typography variant="h6">{floor}층</Typography>
            <Chip label={`${rooms.length}개 객실`} size="small" />
        </Box>
        <Grid container spacing={2}>
            {rooms.map(room => (
                <Grid xs={12} sm={6} md={4} lg={3} key={room.id}>
                    <RoomCard room={room} reservationsByDate={reservationsByDate} onStatusChange={onStatusChange} onEdit={onEdit} />
                </Grid>
            ))}
        </Grid>
    </Box>
)

const StatCard = ({ title, count, total, color, icon: Icon }) => {
    const percentage = total > 0 ? Math.round((count / total) * 100) : 0
    return (
        <Card sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box>
                    <Typography variant="body2">{title}</Typography>
                    <Typography variant="h5">{count}</Typography>
                    <Typography variant="caption">{percentage}%</Typography>
                </Box>
                <Avatar sx={{ bgcolor: color + '20' }}><Icon sx={{ color }} /></Avatar>
            </Box>
        </Card>
    )
}

const RoomManagement = () => {
    const [rooms, setRooms] = useState([])
    const [filteredRooms, setFilteredRooms] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('ALL')
    const [typeFilter, setTypeFilter] = useState('ALL')
    const [showModal, setShowModal] = useState(false)
    const [editingRoom, setEditingRoom] = useState(null)
    const [formData, setFormData] = useState({
        roomNumber: '',
        roomType: 'SINGLE',
        price: '',
        capacity: '',
        status: 'AVAILABLE',
        description: ''
    })
    const [selectedDate, setSelectedDate] = useState(dayjs())
    const [reservationsByDate, setReservationsByDate] = useState([])

    useEffect(() => {
        if (editingRoom) {
            setFormData({
                roomNumber: editingRoom.roomNumber || '',
                roomType: editingRoom.roomType ? editingRoom.roomType.toUpperCase() : 'SINGLE',
                price: editingRoom.price || '',
                capacity: editingRoom.capacity || '',
                status: editingRoom.status || 'AVAILABLE',
                description: editingRoom.description || ''
            });
        } else {
            setFormData({
                roomNumber: '',
                roomType: 'SINGLE',
                price: '',
                capacity: '',
                status: 'AVAILABLE',
                description: ''
            });
        }
    }, [editingRoom]);

    useEffect(() => { loadRooms() }, [])
    useEffect(() => { filterRooms() }, [rooms, searchTerm, statusFilter, typeFilter, reservationsByDate])

    useEffect(() => {
        if (!selectedDate) return;
        const fetchReservations = async () => {
            try {
                const data = await apiGet(`/reservations/date?date=${selectedDate.format('YYYY-MM-DD')}`);
                setReservationsByDate(data || []);
            } catch (err) {
                console.error('날짜별 예약 조회 실패', err);
                setReservationsByDate([]);
            }
        }
        fetchReservations();
    }, [selectedDate])

    const loadRooms = async () => {
        try {
            setLoading(true);
            let roomsArray;
            try {
                roomsArray = await roomService.getAllRoomsList();
            } catch (error) {
                console.error("Error loading rooms, falling back to dummy data", error);
                roomsArray = generateDummyRooms();
            }

            if (Array.isArray(roomsArray)) {
                const roomsWithFloor = roomsArray.map(room => ({
                    ...room,
                    floor: room.roomNumber ? parseInt(room.roomNumber.substring(0, 1), 10) : 0
                }));
                setRooms(roomsWithFloor);
            } else {
                setRooms([]);
            }

        } catch (error) {
            console.error("Error in loadRooms, falling back to dummy data", error);
            setRooms(generateDummyRooms());
        } finally {
            setLoading(false);
        }
    };

    const generateDummyRooms = () => {
        const rooms = []
        const statuses = ['AVAILABLE', 'OCCUPIED', 'MAINTENANCE']
        const randomStatus = () => statuses[Math.floor(Math.random() * statuses.length)]
        for (let f = 3; f <= 6; f++) {
            let count = f === 6 ? 5 : 20
            for (let i = 1; i <= count; i++) {
                rooms.push({ id: `${f}_${i}`, roomNumber: `${f}${String(i).padStart(2, '0')}`, roomType: 'SINGLE', price: 100000 + f*10000, capacity: f, status: randomStatus(), floor: f })
            }
        }
        return rooms
    }

    const filterRooms = () => {
        let filtered = rooms;
        if (searchTerm) {
            filtered = filtered.filter(r => r.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()));
        }
        if (statusFilter !== 'ALL') {
            filtered = filtered.filter(r => {
                const hasReservation = reservationsByDate?.some(res => res.roomId === r.id);
                const currentStatus = hasReservation ? 'BOOKED' : r.status;
                return currentStatus === statusFilter;
            });
        }
        if (typeFilter !== 'ALL') {
            filtered = filtered.filter(r => r.roomType === typeFilter);
        }
        setFilteredRooms(filtered);
    };

    const handleStatusChange = async (roomId, newStatus) => {
        try {
            await roomService.updateRoomStatus(roomId, newStatus)
            setRooms(prev => prev.map(r => r.id === roomId ? { ...r, status: newStatus } : r))
        } catch { alert('상태 변경 실패') }
    }

    const groupRoomsByFloor = (roomsArray) => {
        const grouped = {}
        roomsArray.forEach(room => {
            if (!grouped[room.floor]) grouped[room.floor] = []
            grouped[room.floor].push(room)
        })
        return Object.keys(grouped).sort((a,b)=>b-a).map(floor=>({floor: parseInt(floor), rooms: grouped[floor]}))
    }

    if (loading) return <Box sx={{ minHeight:'100vh', display:'flex', justifyContent:'center', alignItems:'center' }}><Typography>로딩중...</Typography></Box>

    const floorGroups = groupRoomsByFloor(filteredRooms)
    const stats = filteredRooms.reduce((acc, r) => {
        const hasReservation = reservationsByDate?.some(res => res.roomId === r.id)
        const status = hasReservation ? 'BOOKED' : r.status
        acc[status] = (acc[status] || 0) + 1
        return acc
    }, {})

    return (
        <Box sx={{ minHeight:'100vh', py:4, backgroundColor:'#f5f5f5' }}>
            <Container maxWidth="xl">
                <Box sx={{ display:'flex', justifyContent:'space-between', mb:4, flexWrap:'wrap', gap:2 }}>
                    <Typography variant="h3">객실 관리</Typography>
                    <Button variant="contained" startIcon={<PlusIcon />} onClick={() => setShowModal(true)}>객실 추가</Button>
                </Box>

                {/* 상단: 달력 + 통계 카드 */}
                <Box sx={{ display:'flex', alignItems:'center', justifyContent:'space-between', mb:4, flexWrap:'wrap', gap:2 }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="날짜 선택"
                            value={selectedDate}
                            onChange={(newValue) => setSelectedDate(newValue)}
                            renderInput={(params) => <TextField {...params} size="small" />}
                        />
                    </LocalizationProvider>

                    <Box sx={{ display:'flex', gap:2, flexWrap:'wrap' }}>
                        <StatCard title="이용가능" count={stats['AVAILABLE'] || 0} total={filteredRooms.length} color="#2e7d32" icon={HomeIcon} />
                        <StatCard title="예약됨" count={stats['BOOKED'] || 0} total={filteredRooms.length} color="#1976d2" icon={UsersIcon} />
                        <StatCard title="투숙중" count={stats['OCCUPIED'] || 0} total={filteredRooms.length} color="#d32f2f" icon={UsersIcon} />
                        <StatCard title="정비중" count={stats['MAINTENANCE'] || 0} total={filteredRooms.length} color="#ed6c02" icon={BarChartIcon} />
                    </Box>
                </Box>

                {/* 검색 & 필터 */}
                <Box sx={{ display:'flex', gap:2, mb:4 }}>
                    <TextField
                        label="검색"
                        value={searchTerm}
                        onChange={(e)=>setSearchTerm(e.target.value)}
                        InputProps={{ endAdornment: <InputAdornment position="end"><SearchIcon /></InputAdornment> }}
                    />
                    <FormControl>
                        <InputLabel>상태</InputLabel>
                        <Select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} label="상태">
                            <MenuItem value="ALL">전체</MenuItem>
                            <MenuItem value="AVAILABLE">이용가능</MenuItem>
                            <MenuItem value="BOOKED">예약됨</MenuItem>
                            <MenuItem value="OCCUPIED">투숙중</MenuItem>
                            <MenuItem value="MAINTENANCE">정비중</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl>
                        <InputLabel>타입</InputLabel>
                        <Select value={typeFilter} onChange={e=>setTypeFilter(e.target.value)} label="타입">
                            <MenuItem value="ALL">전체</MenuItem>
                            {ROOM_TYPES.map(type => (
                                <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                {/* 객실 그룹 */}
                {floorGroups.map(group => <FloorSection key={group.floor} floor={group.floor} rooms={group.rooms} reservationsByDate={reservationsByDate} onStatusChange={handleStatusChange} onEdit={(room)=>{ setEditingRoom(room); setShowModal(true)}} />)}

                {/* 모달 */}
                <Dialog open={showModal} onClose={()=>{ setShowModal(false); setEditingRoom(null)}} maxWidth="sm" fullWidth>
                    <DialogTitle>{editingRoom ? '객실 수정' : '객실 추가'}</DialogTitle>
                    <DialogContent sx={{ display:'flex', flexDirection:'column', gap: 3, pt: '10px' }}>
                        <TextField label="객실 번호" value={formData.roomNumber} onChange={e=>setFormData({...formData, roomNumber:e.target.value})} />
                        <FormControl>
                            <InputLabel>타입</InputLabel>
                            <Select value={formData.roomType} onChange={e=>setFormData({...formData, roomType:e.target.value})} label="타입">
                                {ROOM_TYPES.map(type => (
                                    <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField label="가격" type="number" value={formData.price} onChange={e=>setFormData({...formData, price:parseInt(e.target.value)})} />
                        <TextField label="수용 인원" type="number" value={formData.capacity} onChange={e=>setFormData({...formData, capacity:parseInt(e.target.value)})} />
                        <FormControl>
                            <InputLabel>상태</InputLabel>
                            <Select value={formData.status} onChange={e=>setFormData({...formData, status:e.target.value})} label="상태">
                                <MenuItem value="AVAILABLE">이용가능</MenuItem>
                                <MenuItem value="BOOKED">예약됨</MenuItem>
                                <MenuItem value="OCCUPIED">투숙중</MenuItem>
                                <MenuItem value="MAINTENANCE">정비중</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField label="설명" multiline rows={3} value={formData.description} onChange={e=>setFormData({...formData, description:e.target.value})} />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={()=>{ setShowModal(false); setEditingRoom(null)}}>취소</Button>
                        <Button variant="contained" onClick={async ()=>{
                            try {
                                if(editingRoom){
                                    await roomService.updateRoom(editingRoom.id, formData)
                                } else {
                                    await roomService.createRoom(formData)
                                }
                                setFormData({ roomNumber:'', roomType:'SINGLE', price:'', capacity:'', status:'AVAILABLE', description:''})
                                setShowModal(false)
                                setEditingRoom(null)
                                await loadRooms()
                            } catch { alert('객실 저장 실패') }
                        }}>{editingRoom ? '저장' : '추가'}</Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box>
    )
}

export default RoomManagement
