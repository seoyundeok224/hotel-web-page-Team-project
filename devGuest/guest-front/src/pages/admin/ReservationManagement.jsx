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
  Chip,
  Paper,
  IconButton,
  InputAdornment,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material'
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  CalendarToday as CalendarTodayIcon,
  Person as PersonIcon,
  AccessTime as AccessTimeIcon,
  AttachMoney as AttachMoneyIcon
} from '@mui/icons-material'

const Reservations = () => {
  const [reservations, setReservations] = useState([
    {
      id: 1,
      reservationNumber: 'RSV-001',
      guestName: '김철수',
      guestPhone: '010-1234-5678',
      roomNumber: '101',
      roomType: '스탠다드',
      checkIn: '2025-08-20',
      checkOut: '2025-08-22',
      nights: 2,
      guests: 2,
      totalAmount: 240000,
      status: 'confirmed',
      createdAt: '2025-08-18'
    },
    {
      id: 2,
      reservationNumber: 'RSV-002',
      guestName: '이영희',
      guestPhone: '010-2345-6789',
      roomNumber: '205',
      roomType: '디럭스',
      checkIn: '2025-08-20',
      checkOut: '2025-08-23',
      nights: 3,
      guests: 3,
      totalAmount: 450000,
      status: 'pending',
      createdAt: '2025-08-19'
    },
    {
      id: 3,
      reservationNumber: 'RSV-003',
      guestName: '박민수',
      guestPhone: '010-3456-7890',
      roomNumber: '312',
      roomType: '스위트',
      checkIn: '2025-08-21',
      checkOut: '2025-08-24',
      nights: 3,
      guests: 4,
      totalAmount: 750000,
      status: 'confirmed',
      createdAt: '2025-08-20'
    },
    {
      id: 4,
      reservationNumber: 'RSV-004',
      guestName: '정수진',
      guestPhone: '010-4567-8901',
      roomNumber: '408',
      roomType: '디럭스',
      checkIn: '2025-08-25',
      checkOut: '2025-08-27',
      nights: 2,
      guests: 2,
      totalAmount: 300000,
      status: 'cancelled',
      createdAt: '2025-08-19'
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showNewReservationModal, setShowNewReservationModal] = useState(false)

  const filteredReservations = reservations.filter(reservation => {
    const matchesSearch = reservation.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.reservationNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || reservation.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed': return '확정'
      case 'pending': return '대기'
      case 'cancelled': return '취소'
      case 'checked-in': return '체크인'
      case 'checked-out': return '체크아웃'
      default: return status
    }
  }

  const handleNewReservation = () => {
    setShowNewReservationModal(true)
  }

  const handleEditReservation = (id) => {
    console.log('Edit reservation:', id)
  }

  const handleDeleteReservation = (id) => {
    if (window.confirm('정말로 이 예약을 삭제하시겠습니까?')) {
      setReservations(reservations.filter(r => r.id !== id))
    }
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          예약 관리
        </Typography>
        <Typography variant="body1" color="text.secondary">
          호텔 예약을 관리하고 추적하세요
        </Typography>
      </Box>

      {/* 액션 바 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <TextField
              placeholder="고객명 또는 예약번호로 검색..."
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 300, flex: 1 }}
            />
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>상태</InputLabel>
              <Select
                value={statusFilter}
                label="상태"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">전체 상태</MenuItem>
                <MenuItem value="confirmed">확정</MenuItem>
                <MenuItem value="pending">대기</MenuItem>
                <MenuItem value="cancelled">취소</MenuItem>
                <MenuItem value="checked-in">체크인</MenuItem>
                <MenuItem value="checked-out">체크아웃</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleNewReservation}
              sx={{ ml: 'auto' }}
            >
              새 예약
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* 예약 통계 */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: '#3498db', mr: 2 }}>
                  <CalendarTodayIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                    {reservations.filter(r => r.status === 'confirmed').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    확정된 예약
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: '#f39c12', mr: 2 }}>
                  <AccessTimeIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                    {reservations.filter(r => r.status === 'pending').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    대기 중인 예약
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: '#27ae60', mr: 2 }}>
                  <PersonIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                    {reservations.reduce((sum, r) => sum + r.guests, 0)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    총 투숙객 수
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: '#9b59b6', mr: 2 }}>
                  <AttachMoneyIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                    ₩{reservations.reduce((sum, r) => sum + r.totalAmount, 0).toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    총 예약 금액
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 예약 목록 */}
      <Card>
        <CardContent>
          <Typography variant="h6" component="h2" gutterBottom>
            예약 목록 ({filteredReservations.length}건)
          </Typography>
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell>예약번호</TableCell>
                  <TableCell>고객정보</TableCell>
                  <TableCell>객실정보</TableCell>
                  <TableCell>체크인/아웃</TableCell>
                  <TableCell>투숙객/박수</TableCell>
                  <TableCell>금액</TableCell>
                  <TableCell>상태</TableCell>
                  <TableCell align="center">액션</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredReservations.map((reservation) => (
                  <TableRow key={reservation.id} hover>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {reservation.reservationNumber}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {reservation.createdAt}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {reservation.guestName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {reservation.guestPhone}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          객실 {reservation.roomNumber}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {reservation.roomType}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {reservation.checkIn}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {reservation.checkOut}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {reservation.guests}명
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {reservation.nights}박
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        ₩{reservation.totalAmount.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={getStatusText(reservation.status)}
                        color={
                          reservation.status === 'confirmed' ? 'success' :
                          reservation.status === 'pending' ? 'warning' :
                          reservation.status === 'cancelled' ? 'error' :
                          'default'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                        <IconButton size="small" color="primary" title="상세보기">
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          color="warning" 
                          title="수정"
                          onClick={() => handleEditReservation(reservation.id)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          color="error" 
                          title="삭제"
                          onClick={() => handleDeleteReservation(reservation.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Container>
  )
}

export default Reservations
