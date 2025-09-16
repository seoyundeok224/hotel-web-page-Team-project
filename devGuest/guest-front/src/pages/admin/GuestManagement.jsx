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
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination
} from '@mui/material'
import {
  Add as PlusIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as TrashIcon,
  Visibility as EyeIcon,
  Phone as PhoneIcon,
  Email as MailIcon,
  LocationOn as MapPinIcon,
  Event as CalendarIcon,
  Person as UserIcon,
  CreditCard as CreditCardIcon
} from '@mui/icons-material'

const Guests = () => {
  const [guests, setGuests] = useState([
    {
      id: 1,
      name: '김철수',
      email: 'kim.cs@email.com',
      phone: '010-1234-5678',
      address: '서울시 강남구 테헤란로 123',
      birthDate: '1985-03-15',
      nationality: '한국',
      idNumber: '850315-1******',
      vipLevel: 'Gold',
      totalStays: 8,
      totalSpent: 2400000,
      lastVisit: '2025-08-20',
      currentReservation: {
        roomNumber: '102',
        checkIn: '2025-08-20',
        checkOut: '2025-08-22'
      },
      preferences: ['금연객실', '높은층 선호', '늦은 체크아웃'],
      notes: '호텔 단골 고객, 특별 서비스 제공',
      registeredDate: '2023-05-12'
    },
    {
      id: 2,
      name: '이영희',
      email: 'lee.yh@email.com',
      phone: '010-2345-6789',
      address: '부산시 해운대구 해운대해변로 456',
      birthDate: '1990-07-22',
      nationality: '한국',
      idNumber: '900722-2******',
      vipLevel: 'Silver',
      totalStays: 4,
      totalSpent: 1200000,
      lastVisit: '2025-08-20',
      currentReservation: {
        roomNumber: '205',
        checkIn: '2025-08-20',
        checkOut: '2025-08-23'
      },
      preferences: ['오션뷰', '미니바 서비스'],
      notes: '해변가 객실 선호',
      registeredDate: '2024-02-18'
    },
    {
      id: 3,
      name: '박민수',
      email: 'park.ms@email.com',
      phone: '010-3456-7890',
      address: '대구시 중구 동성로 789',
      birthDate: '1978-11-08',
      nationality: '한국',
      idNumber: '781108-1******',
      vipLevel: 'Platinum',
      totalStays: 15,
      totalSpent: 4500000,
      lastVisit: '2025-08-21',
      currentReservation: {
        roomNumber: '312',
        checkIn: '2025-08-21',
        checkOut: '2025-08-24'
      },
      preferences: ['스위트룸', '컨시어지 서비스', '룸서비스'],
      notes: 'VIP 고객, 최고급 서비스 제공',
      registeredDate: '2022-11-05'
    },
    {
      id: 4,
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+1-555-123-4567',
      address: '123 Main St, New York, NY 10001, USA',
      birthDate: '1982-05-14',
      nationality: '미국',
      idNumber: 'P123456789',
      vipLevel: 'Bronze',
      totalStays: 2,
      totalSpent: 800000,
      lastVisit: '2025-07-15',
      currentReservation: null,
      preferences: ['영어 서비스', '서양식 조식'],
      notes: '외국인 고객, 영어 서비스 필요',
      registeredDate: '2025-06-20'
    },
    {
      id: 5,
      name: '정수진',
      email: 'jung.sj@email.com',
      phone: '010-4567-8901',
      address: '인천시 연수구 송도대로 321',
      birthDate: '1995-09-30',
      nationality: '한국',
      idNumber: '950930-2******',
      vipLevel: 'Bronze',
      totalStays: 1,
      totalSpent: 300000,
      lastVisit: '2025-06-10',
      currentReservation: null,
      preferences: ['조용한 객실', 'wi-fi'],
      notes: '신규 고객',
      registeredDate: '2025-06-08'
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [vipFilter, setVipFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredGuests = guests.filter(guest => {
    const matchesSearch = guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.phone.includes(searchTerm)
    const matchesVip = vipFilter === 'all' || guest.vipLevel === vipFilter
    const matchesStatus = statusFilter === 'all' ||
      (statusFilter === 'current' && guest.currentReservation) ||
      (statusFilter === 'past' && !guest.currentReservation)

    return matchesSearch && matchesVip && matchesStatus
  })

  const getVipLevelColor = (level) => {
    switch (level) {
      case 'Platinum': return '#9b59b6'
      case 'Gold': return '#f39c12'
      case 'Silver': return '#95a5a6'
      case 'Bronze': return '#d35400'
      default: return '#7f8c8d'
    }
  }

  const guestStats = {
    total: guests.length,
    current: guests.filter(g => g.currentReservation).length,
    vip: guests.filter(g => ['Platinum', 'Gold'].includes(g.vipLevel)).length,
    totalRevenue: guests.reduce((sum, g) => sum + g.totalSpent, 0)
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5', py: 4 }}>
      <Container maxWidth="xl">
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', color: '#212121', mb: 1 }}>
            고객 관리
          </Typography>
          <Typography variant="body1" color="text.secondary">
            호텔 고객 정보를 관리하고 서비스를 제공하세요
          </Typography>
        </Box>

        {/* 고객 통계 */}
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#212121', mb: 3 }}>
          고객 현황 통계
        </Typography>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
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
                      총 고객 수
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#3498db' }}>
                      {guestStats.total}
                    </Typography>
                  </Box>
                  <Avatar
                    sx={{
                      bgcolor: '#3498db20',
                      width: 56,
                      height: 56,
                      '& .MuiSvgIcon-root': { color: '#3498db', fontSize: '1.8rem' }
                    }}
                  >
                    <UserIcon />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
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
                      현재 투숙 고객
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#27ae60' }}>
                      {guestStats.current}
                    </Typography>
                  </Box>
                  <Avatar
                    sx={{
                      bgcolor: '#27ae6020',
                      width: 56,
                      height: 56,
                      '& .MuiSvgIcon-root': { color: '#27ae60', fontSize: '1.8rem' }
                    }}
                  >
                    <CalendarIcon />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
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
                      VIP 고객
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#f39c12' }}>
                      {guestStats.vip}
                    </Typography>
                  </Box>
                  <Avatar
                    sx={{
                      bgcolor: '#f39c1220',
                      width: 56,
                      height: 56,
                      '& .MuiSvgIcon-root': { color: '#f39c12', fontSize: '1.8rem' }
                    }}
                  >
                    <CreditCardIcon />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
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
                      총 매출
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#9b59b6' }}>
                      ₩{guestStats.totalRevenue.toLocaleString()}
                    </Typography>
                  </Box>
                  <Avatar
                    sx={{
                      bgcolor: '#9b59b620',
                      width: 56,
                      height: 56,
                      '& .MuiSvgIcon-root': { color: '#9b59b6', fontSize: '1.8rem' }
                    }}
                  >
                    <CreditCardIcon />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* 검색 및 필터 */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
              <TextField
                placeholder="이름, 이메일, 전화번호로 검색..."
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
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>VIP 등급</InputLabel>
                <Select
                  value={vipFilter}
                  label="VIP 등급"
                  onChange={(e) => setVipFilter(e.target.value)}
                >
                  <MenuItem value="all">전체 등급</MenuItem>
                  <MenuItem value="Platinum">Platinum</MenuItem>
                  <MenuItem value="Gold">Gold</MenuItem>
                  <MenuItem value="Silver">Silver</MenuItem>
                  <MenuItem value="Bronze">Bronze</MenuItem>
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>상태</InputLabel>
                <Select
                  value={statusFilter}
                  label="상태"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="all">전체 상태</MenuItem>
                  <MenuItem value="current">현재 투숙</MenuItem>
                  <MenuItem value="past">과거 고객</MenuItem>
                </Select>
              </FormControl>
              <Button
                variant="contained"
                startIcon={<PlusIcon />}
                sx={{ ml: 'auto' }}
              >
                고객 추가
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* 고객 목록 */}
        <Card>
          <CardContent>
            <Typography variant="h6" component="h2" gutterBottom>
              고객 목록 ({filteredGuests.length}명)
            </Typography>
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>고객정보</TableCell>
                    <TableCell>연락처</TableCell>
                    <TableCell>VIP등급</TableCell>
                    <TableCell>투숙이력</TableCell>
                    <TableCell>현재예약</TableCell>
                    <TableCell>최근방문</TableCell>
                    <TableCell align="center">액션</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredGuests.map((guest) => (
                    <TableRow key={guest.id} hover>
                      <TableCell>
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                              {guest.name}
                            </Typography>
                            {guest.currentReservation && (
                              <Chip
                                label="투숙중"
                                size="small"
                                color="success"
                                sx={{ fontSize: '0.75rem', height: '20px' }}
                              />
                            )}
                          </Box>
                          <Typography variant="caption" color="text.secondary">
                            {guest.nationality} • {guest.birthDate}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ fontSize: '0.9rem' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.25 }}>
                            <PhoneIcon sx={{ fontSize: 14 }} />
                            <Typography variant="caption">{guest.phone}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.25 }}>
                            <MailIcon sx={{ fontSize: 14 }} />
                            <Typography variant="caption">{guest.email}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <MapPinIcon sx={{ fontSize: 14 }} />
                            <Typography variant="caption">
                              {guest.address.substring(0, 20)}...
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={guest.vipLevel}
                          size="small"
                          sx={{
                            backgroundColor: getVipLevelColor(guest.vipLevel) + '20',
                            color: getVipLevelColor(guest.vipLevel),
                            border: `1px solid ${getVipLevelColor(guest.vipLevel)}40`,
                            fontWeight: 'bold'
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {guest.totalStays}회 투숙
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ₩{guest.totalSpent.toLocaleString()}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {guest.currentReservation ? (
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                              객실 {guest.currentReservation.roomNumber}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {guest.currentReservation.checkIn} ~ {guest.currentReservation.checkOut}
                            </Typography>
                          </Box>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            없음
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {guest.lastVisit}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                          <IconButton size="small" color="primary" title="상세보기">
                            <EyeIcon />
                          </IconButton>
                          <IconButton size="small" color="warning" title="수정">
                            <EditIcon />
                          </IconButton>
                          <IconButton size="small" color="error" title="삭제">
                            <TrashIcon />
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

        {/* VIP 고객 현황 */}
        <Card>
          <CardContent>
            <Typography variant="h6" component="h2" gutterBottom>
              VIP 등급별 현황
            </Typography>
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>VIP 등급</TableCell>
                    <TableCell>고객 수</TableCell>
                    <TableCell>총 투숙</TableCell>
                    <TableCell>총 매출</TableCell>
                    <TableCell>평균 매출</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {['Platinum', 'Gold', 'Silver', 'Bronze'].map(level => {
                    const levelGuests = guests.filter(g => g.vipLevel === level)
                    const totalStays = levelGuests.reduce((sum, g) => sum + g.totalStays, 0)
                    const totalSpent = levelGuests.reduce((sum, g) => sum + g.totalSpent, 0)
                    const avgSpent = levelGuests.length > 0 ? totalSpent / levelGuests.length : 0

                    return (
                      <TableRow key={level}>
                        <TableCell>
                          <Chip
                            label={level}
                            size="small"
                            sx={{
                              backgroundColor: getVipLevelColor(level) + '20',
                              color: getVipLevelColor(level),
                              border: `1px solid ${getVipLevelColor(level)}40`,
                              fontWeight: 'bold'
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {levelGuests.length}명
                          </Typography>
                        </TableCell>
                        <TableCell>{totalStays}회</TableCell>
                        <TableCell>₩{totalSpent.toLocaleString()}</TableCell>
                        <TableCell>₩{Math.round(avgSpent).toLocaleString()}</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Container>
    </Box>
  )
}

export default Guests
