import { useState, useEffect } from 'react'
import {
  Box, Container, Typography, Card, CardContent, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper, Button,
  IconButton, TextField, Dialog, DialogTitle, DialogContent, DialogActions,
  FormControl, InputLabel, Select, MenuItem, Avatar, Chip, Grid
} from '@mui/material'
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Home as HomeIcon, People as UsersIcon, BarChart as BarChartIcon } from '@mui/icons-material'

import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

import { getAllReservations, deleteReservation, createReservation, updateReservation } from '../../services/reservationService'
import { roomService } from '../../services/roomService'
import { useAuth } from '../../contexts/AuthContext'

const StatCard = ({ title, count, total, color, icon: Icon }) => {
  const percentage = total > 0 ? Math.round((count / total) * 100) : 0
  return (
    <Card sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems:'center' }}>
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

const Reservations = () => {
  const [reservations, setReservations] = useState([])
  const [rooms, setRooms] = useState([])
  const [openModal, setOpenModal] = useState(false)
  const [editingReservation, setEditingReservation] = useState(null)
  const [formData, setFormData] = useState({ guestName: '', guestPhone: '', roomId: '', checkIn: null, checkOut: null, people: 1 })
  const [selectedRange, setSelectedRange] = useState({ checkIn: null, checkOut: null })
  const { user } = useAuth()

  // 초기 데이터 로딩
  const fetchReservations = async () => {
    try {
      const data = await getAllReservations()
      setReservations(data)
    } catch (e) {
      console.error('예약 불러오기 실패', e)
    }
  }

  const fetchRooms = async () => {
    try {
      const data = await roomService.getAllRoomsList()
      setRooms(data)
    } catch (e) {
      console.error('객실 불러오기 실패', e)
      setRooms([])
    }
  }

  useEffect(() => {
    fetchReservations()
    fetchRooms()
  }, [])

  // 선택된 기간 기준 예약 상태 통계
  const getRoomStats = () => {
    const stats = { AVAILABLE: 0, BOOKED: 0, OCCUPIED: 0, MAINTENANCE: 0 }
    rooms.forEach(r => {
      const hasReservation = reservations.some(res =>
        res.room?.id === r.id &&
        selectedRange.checkIn && selectedRange.checkOut &&
        (
          dayjs(selectedRange.checkIn).isBetween(dayjs(res.checkIn), dayjs(res.checkOut), null, '[)') ||
          dayjs(selectedRange.checkOut).isBetween(dayjs(res.checkIn), dayjs(res.checkOut), null, '(]') ||
          dayjs(res.checkIn).isBetween(dayjs(selectedRange.checkIn), dayjs(selectedRange.checkOut), null, '[)')
        )
      )
      const status = hasReservation ? 'BOOKED' : r.status
      stats[status] = (stats[status] || 0) + 1
    })
    return stats
  }

  const handleFormChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleOpenModal = (reservation = null) => {
    if (reservation) {
      setEditingReservation(reservation)
      setFormData({
        guestName: reservation.guestName,
        guestPhone: reservation.guestPhone,
        roomId: reservation.room?.id || '',
        checkIn: dayjs(reservation.checkIn),
        checkOut: dayjs(reservation.checkOut),
        people: reservation.people
      })
    } else {
      setEditingReservation(null)
      setFormData({ guestName: '', guestPhone: '', roomId: '', checkIn: null, checkOut: null, people: 1 })
    }
    setOpenModal(true)
  }

  const handleSubmit = async () => {
    if (!formData.roomId || !formData.checkIn || !formData.checkOut) {
      alert('객실, 체크인/체크아웃을 선택해주세요.')
      return
    }

    if (dayjs(formData.checkIn).isAfter(dayjs(formData.checkOut))) {
      alert('체크인 날짜가 체크아웃 이후일 수 없습니다.')
      return
    }

    // 예약 겹침 체크
    const overlap = reservations.some(r =>
      r.room?.id === formData.roomId &&
      (
        dayjs(formData.checkIn).isBetween(dayjs(r.checkIn), dayjs(r.checkOut), null, '[)') ||
        dayjs(formData.checkOut).isBetween(dayjs(r.checkIn), dayjs(r.checkOut), null, '(]') ||
        dayjs(r.checkIn).isBetween(dayjs(formData.checkIn), dayjs(formData.checkOut), null, '[)')
      ) &&
      (!editingReservation || r.id !== editingReservation.id)
    )
    if (overlap) {
      alert('선택한 객실은 해당 기간에 이미 예약이 있습니다.')
      return
    }

    const selectedRoom = rooms.find(r => r.id === formData.roomId);
    if (!selectedRoom) {
        alert('객실을 선택해주세요.');
        return;
    }

    try {
        const payload = {
            username: user.username,
            roomNumber: selectedRoom.roomNumber,
            checkIn: formData.checkIn,
            checkOut: formData.checkOut,
            people: formData.people
        };

        if (editingReservation) {
            await updateReservation(editingReservation.id, payload)
        } else {
            await createReservation(payload)
        }

      fetchReservations()
      setOpenModal(false)
    } catch (e) {
      alert('예약 저장 실패: ' + e.message)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('정말 삭제하시겠습니까?')) return
    await deleteReservation(id)
    fetchReservations()
  }

  // 예약 불가 기간 제외 객실 리스트
  const availableRooms = rooms.filter(r => {
    if (!formData.checkIn || !formData.checkOut) return true
    return !reservations.some(res =>
      res.room?.id === r.id &&
      (
        dayjs(formData.checkIn).isBetween(dayjs(res.checkIn), dayjs(res.checkOut), null, '[)') ||
        dayjs(formData.checkOut).isBetween(dayjs(res.checkIn), dayjs(res.checkOut), null, '(]') ||
        dayjs(res.checkIn).isBetween(dayjs(formData.checkIn), dayjs(formData.checkOut), null, '[)')
      ) &&
      (!editingReservation || res.id !== editingReservation.id)
    )
  })

  const stats = getRoomStats()

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>예약 관리</Typography>
      </Box>

      {/* 예약 통계 */}
      <Box sx={{ display:'flex', gap:2, mb:4 }}>
        <StatCard title="이용가능" count={stats['AVAILABLE']} total={rooms.length} color="#2e7d32" icon={HomeIcon} />
        <StatCard title="예약됨" count={stats['BOOKED']} total={rooms.length} color="#1976d2" icon={UsersIcon} />
        <StatCard title="투숙중" count={stats['OCCUPIED']} total={rooms.length} color="#d32f2f" icon={UsersIcon} />
        <StatCard title="정비중" count={stats['MAINTENANCE']} total={rooms.length} color="#ed6c02" icon={BarChartIcon} />
      </Box>

      <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenModal()}>새 예약</Button>

      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>예약번호</TableCell>
              <TableCell>고객명</TableCell>
              <TableCell>객실</TableCell>
              <TableCell>체크인/체크아웃</TableCell>
              <TableCell>투숙객 수</TableCell>
              <TableCell>액션</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reservations.map(r => (
              <TableRow key={r.id}>
                <TableCell>{r.reservationNumber}</TableCell>
                <TableCell>{r.guestName}</TableCell>
                <TableCell>{r.room?.roomNumber} ({r.room?.roomType})</TableCell>
                <TableCell>{r.checkIn} ~ {r.checkOut}</TableCell>
                <TableCell>{r.people}명</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleOpenModal(r)}><EditIcon /></IconButton>
                  <IconButton color="error" onClick={() => handleDelete(r.id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingReservation ? '예약 수정' : '새 예약'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="고객명"
            value={formData.guestName}
            onChange={e => handleFormChange('guestName', e.target.value)}
          />
          <TextField
            label="연락처"
            value={formData.guestPhone}
            onChange={e => handleFormChange('guestPhone', e.target.value)}
          />
          <FormControl>
            <InputLabel>객실</InputLabel>
            <Select
              value={formData.roomId}
              onChange={e => handleFormChange('roomId', e.target.value)}
              label="객실"
            >
              {availableRooms.map(room => (
                <MenuItem key={room.id} value={room.id}>
                  {room.roomNumber} ({room.roomType})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="체크인"
              value={formData.checkIn}
              onChange={newValue => { handleFormChange('checkIn', newValue); setSelectedRange(prev => ({ ...prev, checkIn: newValue })) }}
              renderInput={(params) => <TextField {...params} />}
            />
            <DatePicker
              label="체크아웃"
              value={formData.checkOut}
              onChange={newValue => { handleFormChange('checkOut', newValue); setSelectedRange(prev => ({ ...prev, checkOut: newValue })) }}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
          <TextField
            label="투숙객 수"
            type="number"
            value={formData.people}
            onChange={e => handleFormChange('people', parseInt(e.target.value))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>취소</Button>
          <Button variant="contained" onClick={handleSubmit}>저장</Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default Reservations
