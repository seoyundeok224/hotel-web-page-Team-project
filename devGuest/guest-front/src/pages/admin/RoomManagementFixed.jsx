import { useState, useEffect } from 'react'
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    Grid,
    Button,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Chip,
    Paper,
    IconButton,
    InputAdornment,
    Avatar,
    Divider
} from '@mui/material'
import {
    Add as PlusIcon,
    Search as SearchIcon,
    Edit as EditIcon,
    People as UsersIcon,
    Home as HomeIcon,
    BarChart as BarChartIcon
} from '@mui/icons-material'
import { roomService } from '../../services/hotelService'

// 개별 객실 카드 컴포넌트
const RoomCard = ({ room, onStatusChange, onEdit }) => {
    const getStatusInfo = (status) => {
        switch (status) {
            case 'AVAILABLE':
                return { label: '이용가능', color: '#2e7d32', bgColor: '#e8f5e8' }
            case 'OCCUPIED':
                return { label: '투숙중', color: '#d32f2f', bgColor: '#ffebee' }
            case 'MAINTENANCE':
                return { label: '정비중', color: '#ed6c02', bgColor: '#fff3e0' }
            case 'CLEANING':
                return { label: '청소중', color: '#1976d2', bgColor: '#e3f2fd' }
            default:
                return { label: status, color: '#757575', bgColor: '#f5f5f5' }
        }
    }

    const getRoomTypeInfo = (type) => {
        switch (type) {
            case 'SINGLE': return { label: '싱글', icon: '🛏️' }
            case 'DOUBLE': return { label: '더블', icon: '🛏️🛏️' }
            case 'FAMILY': return { label: '패밀리', icon: '👨‍👩‍👧‍👦' }
            case 'DELUXE': return { label: '디럭스', icon: '✨' }
            case 'SUITE': return { label: '스위트', icon: '👑' }
            case 'CONFERENCE': return { label: '컨퍼런스', icon: '💼' }
            default: return { label: type, icon: '🏠' }
        }
    }

    const statusInfo = getStatusInfo(room.status)
    const typeInfo = getRoomTypeInfo(room.roomType)

    const handleStatusToggle = () => {
        const statuses = ['AVAILABLE', 'OCCUPIED', 'CLEANING', 'MAINTENANCE']
        const currentIndex = statuses.indexOf(room.status)
        const nextIndex = (currentIndex + 1) % statuses.length
        onStatusChange(room.id, statuses[nextIndex])
    }

    return (
        <Card
            sx={{
                height: '100%',
                backgroundColor: statusInfo.bgColor,
                border: `2px solid ${statusInfo.color}20`,
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                },
                cursor: 'pointer'
            }}
        >
            <CardContent sx={{ p: 2 }}>
                {/* 객실 번호 및 타입 */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#212121' }}>
                            {room.roomNumber}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                {typeInfo.icon} {typeInfo.label}
                            </Typography>
                        </Box>
                    </Box>
                    <IconButton
                        size="small"
                        onClick={(e) => {
                            e.stopPropagation()
                            onEdit(room)
                        }}
                        sx={{ color: 'text.secondary' }}
                    >
                        <EditIcon fontSize="small" />
                    </IconButton>
                </Box>

                {/* 상태 표시 및 토글 버튼 */}
                <Box sx={{ mb: 2 }}>
                    <Button
                        fullWidth
                        variant="contained"
                        onClick={(e) => {
                            e.stopPropagation()
                            handleStatusToggle()
                        }}
                        sx={{
                            backgroundColor: statusInfo.color,
                            '&:hover': {
                                backgroundColor: statusInfo.color,
                                opacity: 0.9
                            },
                            py: 1,
                            fontSize: '0.875rem'
                        }}
                    >
                        {statusInfo.label}
                    </Button>
                </Box>

                {/* 객실 정보 */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <UsersIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">
                            최대 {room.capacity}명
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="caption" sx={{ fontSize: 16 }}>💰</Typography>
                        <Typography variant="caption" color="text.secondary">
                            ₩{room.price?.toLocaleString()}
                        </Typography>
                    </Box>
                    {room.description && (
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                            {room.description}
                        </Typography>
                    )}
                </Box>
            </CardContent>
        </Card>
    )
}

// 층별 객실 그룹 컴포넌트
const FloorSection = ({ floor, rooms, onStatusChange, onEdit }) => {
    return (
        <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, pb: 2, borderBottom: '2px solid #e0e0e0' }}>
                <HomeIcon sx={{ color: 'text.secondary' }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#212121' }}>
                    {floor}층
                </Typography>
                <Chip
                    label={`${rooms.length}개 객실`}
                    size="small"
                    sx={{ backgroundColor: '#f5f5f5', color: 'text.secondary' }}
                />
            </Box>
            <Grid container spacing={2}>
                {rooms.map((room) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={room.id}>
                        <RoomCard
                            room={room}
                            onStatusChange={onStatusChange}
                            onEdit={onEdit}
                        />
                    </Grid>
                ))}
            </Grid>
        </Box>
    )
}

// 통계 카드 컴포넌트
const StatCard = ({ title, count, total, color, icon: Icon }) => {
    const percentage = total > 0 ? Math.round((count / total) * 100) : 0

    return (
        <Card
            sx={{
                height: '100%',
                background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                borderRadius: 2,
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.15)'
                }
            }}
        >
            <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {title}
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#212121' }}>
                            {count}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {percentage}%
                        </Typography>
                    </Box>
                    <Avatar
                        sx={{
                            bgcolor: color + '20',
                            width: 56,
                            height: 56,
                            '& .MuiSvgIcon-root': { color: color, fontSize: '1.8rem' }
                        }}
                    >
                        <Icon />
                    </Avatar>
                </Box>
            </CardContent>
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

    useEffect(() => {
        loadRooms()
    }, [])

    useEffect(() => {
        filterRooms()
    }, [rooms, searchTerm, statusFilter, typeFilter])

    const loadRooms = async () => {
        try {
            setLoading(true)
            // 실제 데이터가 없는 경우 더미 데이터 생성
            let response
            try {
                response = await roomService.getAllRoomsList()
            } catch (error) {
                // 더미 데이터 생성
                response = { data: generateDummyRooms() }
            }
            setRooms(response.data)
        } catch (error) {
            console.error('객실 목록 로드 실패:', error)
            // 에러 시에도 더미 데이터 사용
            setRooms(generateDummyRooms())
        } finally {
            setLoading(false)
        }
    }

    // 더미 데이터 생성 함수
    const generateDummyRooms = () => {
        const rooms = [];
        const statuses = ['AVAILABLE', 'OCCUPIED', 'CLEANING', 'MAINTENANCE'];
        const randomStatus = () => statuses[Math.floor(Math.random() * statuses.length)];

        // 3층 - 싱글 (20)
        for (let i = 1; i <= 20; i++) {
            rooms.push({
                id: `room_3${String(i).padStart(2, '0')}`,
                roomNumber: `3${String(i).padStart(2, '0')}`,
                roomType: 'SINGLE',
                price: 150000,
                capacity: 1,
                status: randomStatus(),
                description: '싱글 객실입니다.',
                floor: 3
            });
        }

        // 4층 - 더블(10), 패밀리(10)
        for (let i = 1; i <= 10; i++) {
            rooms.push({
                id: `room_4${String(i).padStart(2, '0')}`,
                roomNumber: `4${String(i).padStart(2, '0')}`,
                roomType: 'DOUBLE',
                price: 200000,
                capacity: 2,
                status: randomStatus(),
                description: '더블 객실입니다.',
                floor: 4
            });
        }
        for (let i = 11; i <= 20; i++) {
            rooms.push({
                id: `room_4${String(i).padStart(2, '0')}`,
                roomNumber: `4${String(i).padStart(2, '0')}`,
                roomType: 'FAMILY',
                price: 250000,
                capacity: 4,
                status: randomStatus(),
                description: '패밀리 객실입니다.',
                floor: 4
            });
        }

        // 5층 - 디럭스(10),스위트(10)
        for (let i = 1; i <= 10; i++) {
            rooms.push({
                id: `room_5${String(i).padStart(2, '0')}`,
                roomNumber: `5${String(i).padStart(2, '0')}`,
                roomType: 'DELUXE',
                price: 250000,
                capacity: 3,
                status: randomStatus(),
                description: '디럭스 객실입니다.',
                floor: 5
            });
        }
        for (let i = 11; i <= 20; i++) {
            rooms.push({
                id: `room_5${String(i).padStart(2, '0')}`,
                roomNumber: `5${String(i).padStart(2, '0')}`,
                roomType: 'SUITE',
                price: 300000,
                capacity: 4,
                status: randomStatus(),
                description: '스위트 객실입니다.',
                floor: 5
            });
        }

        // 6층 - 컨퍼런스(5)
        for (let i = 1; i <= 5; i++) {
            rooms.push({
                id: `room_6${String(i).padStart(2, '0')}`,
                roomNumber: `6${String(i).padStart(2, '0')}`,
                roomType: 'CONFERENCE',
                price: 400000,
                capacity: 20,
                status: randomStatus(),
                description: '컨퍼런스 룸입니다.',
                floor: 6
            });
        }
        return rooms;
    }

    const getTypeLabel = (type) => {
        switch (type) {
            case 'SINGLE': return '싱글'
            case 'DOUBLE': return '더블'
            case 'FAMILY': return '패밀리'
            case 'DELUXE': return '디럭스'
            case 'SUITE': return '스위트'
            case 'CONFERENCE': return '컨퍼런스'
            default: return type
        }
    }

    const filterRooms = () => {
        let filtered = rooms

        if (searchTerm) {
            filtered = filtered.filter(room =>
                room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                room.description?.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        if (statusFilter !== 'ALL') {
            filtered = filtered.filter(room => room.status === statusFilter)
        }

        if (typeFilter !== 'ALL') {
            filtered = filtered.filter(room => room.roomType === typeFilter)
        }

        setFilteredRooms(filtered)
    }

    const handleStatusChange = async (roomId, newStatus) => {
        try {
            // 실제 API 호출
            // await roomService.updateRoomStatus(roomId, newStatus)

            // 임시로 로컬 상태 업데이트
            setRooms(prevRooms =>
                prevRooms.map(room =>
                    room.id === roomId ? { ...room, status: newStatus } : room
                )
            )
        } catch (error) {
            console.error('객실 상태 변경 실패:', error)
            alert('객실 상태 변경에 실패했습니다.')
        }
    }

    const handleEdit = (room) => {
        setEditingRoom(room)
        setFormData({
            roomNumber: room.roomNumber,
            roomType: room.roomType,
            price: room.price.toString(),
            capacity: room.capacity.toString(),
            status: room.status,
            description: room.description || ''
        })
        setShowModal(true)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const roomData = {
                ...formData,
                price: parseFloat(formData.price),
                capacity: parseInt(formData.capacity)
            }

            if (editingRoom) {
                // 수정
                setRooms(prevRooms =>
                    prevRooms.map(room =>
                        room.id === editingRoom.id ? { ...room, ...roomData } : room
                    )
                )
            } else {
                // 추가
                const newRoom = {
                    id: `room_${Date.now()}`,
                    ...roomData,
                    floor: Math.floor(parseInt(formData.roomNumber) / 100)
                }
                setRooms(prevRooms => [...prevRooms, newRoom])
            }

            setShowModal(false)
            resetForm()
        } catch (error) {
            console.error('객실 저장 실패:', error)
            alert('객실 저장에 실패했습니다.')
        }
    }

    const resetForm = () => {
        setFormData({
            roomNumber: '',
            roomType: 'SINGLE',
            price: '',
            capacity: '',
            status: 'AVAILABLE',
            description: ''
        })
        setEditingRoom(null)
    }

    // 층별로 객실 그룹화
    const groupRoomsByFloor = (rooms) => {
        const grouped = {}
        rooms.forEach(room => {
            const floor = Math.floor(parseInt(room.roomNumber) / 100) || 1
            if (!grouped[floor]) {
                grouped[floor] = []
            }
            grouped[floor].push(room)
        })

        // 층 번호 순으로 정렬
        const sortedFloors = Object.keys(grouped).sort((a, b) => parseInt(b) - parseInt(a))
        return sortedFloors.map(floor => ({
            floor: parseInt(floor),
            rooms: grouped[floor].sort((a, b) => a.roomNumber.localeCompare(b.roomNumber))
        }))
    }

    // 상태별 통계
    const getStatusStats = () => {
        const stats = filteredRooms.reduce((acc, room) => {
            acc[room.status] = (acc[room.status] || 0) + 1
            return acc
        }, {})

        return {
            total: filteredRooms.length,
            available: stats.AVAILABLE || 0,
            occupied: stats.OCCUPIED || 0,
            cleaning: stats.CLEANING || 0,
            maintenance: stats.MAINTENANCE || 0
        }
    }

    if (loading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100vh',
                    backgroundColor: '#f5f5f5'
                }}
            >
                <Typography variant="h6" color="text.secondary">
                    로딩 중...
                </Typography>
            </Box>
        )
    }

    const floorGroups = groupRoomsByFloor(filteredRooms)
    const stats = getStatusStats()

    return (
        <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5', py: 4 }}>
            <Container maxWidth="xl">
                {/* 헤더 */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Box>
                        <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', color: '#212121', mb: 1 }}>
                            객실 관리
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            호텔 객실 현황을 한눈에 확인하고 관리하세요
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        startIcon={<PlusIcon />}
                        onClick={() => {
                            resetForm()
                            setEditingRoom(null)
                            setShowModal(true)
                        }}
                        sx={{
                            backgroundColor: '#1976d2',
                            '&:hover': { backgroundColor: '#1565c0' },
                            px: 3,
                            py: 1.5
                        }}
                    >
                        객실 추가
                    </Button>
                </Box>

                {/* 통계 카드 */}
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#212121', mb: 3 }}>
                    객실 현황 통계
                </Typography>
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={6} md={2.4}>
                        <StatCard
                            title="전체 객실"
                            count={stats.total}
                            total={stats.total}
                            color="#1976d2"
                            icon={HomeIcon}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={2.4}>
                        <StatCard
                            title="이용가능"
                            count={stats.available}
                            total={stats.total}
                            color="#2e7d32"
                            icon={BarChartIcon}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={2.4}>
                        <StatCard
                            title="투숙중"
                            count={stats.occupied}
                            total={stats.total}
                            color="#d32f2f"
                            icon={UsersIcon}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={2.4}>
                        <StatCard
                            title="청소중"
                            count={stats.cleaning}
                            total={stats.total}
                            color="#1976d2"
                            icon={BarChartIcon}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={2.4}>
                        <StatCard
                            title="정비중"
                            count={stats.maintenance}
                            total={stats.total}
                            color="#ed6c02"
                            icon={BarChartIcon}
                        />
                    </Grid>
                </Grid>

                {/* 필터 섹션 */}
                <Paper sx={{ p: 3, mb: 4 }}>
                    <Grid container spacing={3} alignItems="center">
                        <Grid item xs={12} md={3}>
                            <TextField
                                fullWidth
                                placeholder="객실 번호 검색..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '&:hover fieldset': { borderColor: '#1976d2' },
                                        '&.Mui-focused fieldset': { borderColor: '#1976d2' }
                                    }
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} md={3}>
                            <FormControl fullWidth>
                                <InputLabel>상태 필터</InputLabel>
                                <Select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    label="상태 필터"
                                >
                                    <MenuItem value="ALL">모든 상태</MenuItem>
                                    <MenuItem value="AVAILABLE">이용가능</MenuItem>
                                    <MenuItem value="OCCUPIED">투숙중</MenuItem>
                                    <MenuItem value="CLEANING">청소중</MenuItem>
                                    <MenuItem value="MAINTENANCE">정비중</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={3}>
                            <FormControl fullWidth>
                                <InputLabel>타입 필터</InputLabel>
                                <Select
                                    value={typeFilter}
                                    onChange={(e) => setTypeFilter(e.target.value)}
                                    label="타입 필터"
                                >
                                    <MenuItem value="ALL">모든 타입</MenuItem>
                                    <MenuItem value="SINGLE">싱글</MenuItem>
                                    <MenuItem value="DOUBLE">더블</MenuItem>
                                    <MenuItem value="DELUXE">디럭스</MenuItem>
                                    <MenuItem value="SUITE">스위트</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={3}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                                <Typography variant="body2" color="text.secondary">
                                    총 {stats.total}개 객실
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>

                {/* 객실 목록 - 층별 표시 */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {floorGroups.map(({ floor, rooms }) => (
                        <FloorSection
                            key={floor}
                            floor={floor}
                            rooms={rooms}
                            onStatusChange={handleStatusChange}
                            onEdit={handleEdit}
                        />
                    ))}
                </Box>

                {/* 객실 추가/편집 모달 */}
                <Dialog
                    open={showModal}
                    onClose={() => setShowModal(false)}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle sx={{ fontWeight: 'bold', color: '#212121' }}>
                        {editingRoom ? '객실 편집' : '객실 추가'}
                    </DialogTitle>
                    <form onSubmit={handleSubmit}>
                        <DialogContent>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
                                <TextField
                                    fullWidth
                                    label="객실 번호"
                                    value={formData.roomNumber}
                                    onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                                    required
                                />

                                <FormControl fullWidth>
                                    <InputLabel>객실 타입</InputLabel>
                                    <Select
                                        value={formData.roomType}
                                        onChange={(e) => setFormData({ ...formData, roomType: e.target.value })}
                                        label="객실 타입"
                                    >
                                        <MenuItem value="SINGLE">싱글</MenuItem>
                                        <MenuItem value="DOUBLE">더블</MenuItem>
                                        <MenuItem value="DELUXE">디럭스</MenuItem>
                                        <MenuItem value="SUITE">스위트</MenuItem>
                                    </Select>
                                </FormControl>

                                <TextField
                                    fullWidth
                                    label="가격 (원/박)"
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    required
                                />

                                <TextField
                                    fullWidth
                                    label="수용 인원"
                                    type="number"
                                    value={formData.capacity}
                                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                                    required
                                />

                                <FormControl fullWidth>
                                    <InputLabel>상태</InputLabel>
                                    <Select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        label="상태"
                                    >
                                        <MenuItem value="AVAILABLE">이용가능</MenuItem>
                                        <MenuItem value="OCCUPIED">투숙중</MenuItem>
                                        <MenuItem value="CLEANING">청소중</MenuItem>
                                        <MenuItem value="MAINTENANCE">정비중</MenuItem>
                                    </Select>
                                </FormControl>

                                <TextField
                                    fullWidth
                                    label="설명"
                                    multiline
                                    rows={3}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </Box>
                        </DialogContent>
                        <DialogActions sx={{ p: 3, pt: 2 }}>
                            <Button
                                onClick={() => setShowModal(false)}
                                variant="outlined"
                                sx={{ flex: 1 }}
                            >
                                취소
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                sx={{
                                    flex: 1,
                                    backgroundColor: '#1976d2',
                                    '&:hover': { backgroundColor: '#1565c0' }
                                }}
                            >
                                {editingRoom ? '수정' : '추가'}
                            </Button>
                        </DialogActions>
                    </form>
                </Dialog>
            </Container>
        </Box>
    )
}

export default RoomManagement
