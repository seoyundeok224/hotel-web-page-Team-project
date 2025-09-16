import { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert
} from '@mui/material'
import {
  Event as CalendarIcon,
  TrendingUp as TrendingUpIcon,
  AttachMoney as DollarSignIcon,
  People as UsersIcon,
  Bed as BedIcon,
  Download as DownloadIcon,
  BarChart as BarChartIcon,
  DonutLarge as DonutLargeIcon
} from '@mui/icons-material'

const Reports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [selectedReport, setSelectedReport] = useState('revenue')

  // 샘플 데이터
  const revenueData = {
    daily: [
      { date: '2025-08-14', revenue: 890000, bookings: 7 },
      { date: '2025-08-15', revenue: 1200000, bookings: 10 },
      { date: '2025-08-16', revenue: 950000, bookings: 8 },
      { date: '2025-08-17', revenue: 1100000, bookings: 9 },
      { date: '2025-08-18', revenue: 1350000, bookings: 11 },
      { date: '2025-08-19', revenue: 1050000, bookings: 8 },
      { date: '2025-08-20', revenue: 1250000, bookings: 12 }
    ],
    monthly: [
      { month: '2025-02', revenue: 28500000, bookings: 190 },
      { month: '2025-03', revenue: 31200000, bookings: 205 },
      { month: '2025-04', revenue: 29800000, bookings: 198 },
      { month: '2025-05', revenue: 33100000, bookings: 220 },
      { month: '2025-06', revenue: 35400000, bookings: 235 },
      { month: '2025-07', revenue: 38700000, bookings: 258 },
      { month: '2025-08', revenue: 25000000, bookings: 167 }
    ]
  }

  const occupancyData = [
    { roomType: '스탠다드', total: 60, occupied: 45, rate: 75 },
    { roomType: '디럭스', total: 40, occupied: 32, rate: 80 },
    { roomType: '스위트', total: 20, occupied: 18, rate: 90 }
  ]

  const customerData = {
    vipDistribution: [
      { level: 'Platinum', count: 45, percentage: 15 },
      { level: 'Gold', count: 90, percentage: 30 },
      { level: 'Silver', count: 105, percentage: 35 },
      { level: 'Bronze', count: 60, percentage: 20 }
    ],
    nationalityDistribution: [
      { country: '한국', count: 240, percentage: 80 },
      { country: '일본', count: 30, percentage: 10 },
      { country: '중국', count: 18, percentage: 6 },
      { country: '미국', count: 9, percentage: 3 },
      { country: '기타', count: 3, percentage: 1 }
    ]
  }

  const performanceMetrics = {
    averageDailyRate: 185000,
    revenuePAR: 142000,
    averageStayLength: 2.3,
    customerSatisfaction: 4.7,
    repeatCustomerRate: 68,
    noShowRate: 3.2
  }

  const getCurrentData = () => {
    switch (selectedPeriod) {
      case 'week':
        return revenueData.daily
      case 'month':
        return revenueData.daily
      case 'year':
        return revenueData.monthly
      default:
        return revenueData.daily
    }
  }

  const getTotalRevenue = () => {
    return getCurrentData().reduce((sum, item) => sum + item.revenue, 0)
  }

  const getTotalBookings = () => {
    return getCurrentData().reduce((sum, item) => sum + item.bookings, 0)
  }

  const getAverageRevenue = () => {
    const data = getCurrentData()
    return data.length > 0 ? getTotalRevenue() / data.length : 0
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          리포트
        </Typography>
        <Typography variant="body1" color="text.secondary">
          호텔 운영 성과와 분석 데이터를 확인하세요
        </Typography>
      </Box>

      {/* 리포트 제어 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>리포트 타입</InputLabel>
              <Select
                value={selectedReport}
                label="리포트 타입"
                onChange={(e) => setSelectedReport(e.target.value)}
              >
                <MenuItem value="revenue">매출 분석</MenuItem>
                <MenuItem value="occupancy">객실 점유율</MenuItem>
                <MenuItem value="customer">고객 분석</MenuItem>
                <MenuItem value="performance">성과 지표</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>기간</InputLabel>
              <Select
                value={selectedPeriod}
                label="기간"
                onChange={(e) => setSelectedPeriod(e.target.value)}
              >
                <MenuItem value="week">최근 7일</MenuItem>
                <MenuItem value="month">이번 달</MenuItem>
                <MenuItem value="year">올해</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              sx={{ ml: 'auto' }}
            >
              리포트 다운로드
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* 주요 지표 요약 */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box
                  sx={{
                    backgroundColor: '#3498db',
                    borderRadius: '50%',
                    width: 48,
                    height: 48,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2
                  }}
                >
                  <DollarSignIcon sx={{ color: 'white' }} />
                </Box>
                <Box>
                  <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
                    ₩{getTotalRevenue().toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    총 매출
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
                <Box
                  sx={{
                    backgroundColor: '#27ae60',
                    borderRadius: '50%',
                    width: 48,
                    height: 48,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2
                  }}
                >
                  <CalendarIcon sx={{ color: 'white' }} />
                </Box>
                <Box>
                  <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
                    {getTotalBookings()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    총 예약 건수
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
                <Box
                  sx={{
                    backgroundColor: '#f39c12',
                    borderRadius: '50%',
                    width: 48,
                    height: 48,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2
                  }}
                >
                  <TrendingUpIcon sx={{ color: 'white' }} />
                </Box>
                <Box>
                  <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
                    ₩{Math.round(getAverageRevenue()).toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    일평균 매출
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
                <Box
                  sx={{
                    backgroundColor: '#9b59b6',
                    borderRadius: '50%',
                    width: 48,
                    height: 48,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2
                  }}
                >
                  <BedIcon sx={{ color: 'white' }} />
                </Box>
                <Box>
                  <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
                    {Math.round(occupancyData.reduce((sum, room) => sum + room.rate, 0) / occupancyData.length)}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    평균 점유율
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 매출 분석 리포트 */}
      {selectedReport === 'revenue' && (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="h2" gutterBottom>
                  매출 추이
                </Typography>
                <Box
                  sx={{
                    height: 300,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#f8f9fa',
                    borderRadius: 2
                  }}
                >
                  <Box sx={{ textAlign: 'center', color: 'text.secondary' }}>
                    <BarChartIcon sx={{ fontSize: 48, mb: 2 }} />
                    <Typography variant="body1">차트 컴포넌트 영역</Typography>
                    <Typography variant="body2">
                      실제 구현시 Chart.js 또는 Recharts 등의 라이브러리 사용
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="h2" gutterBottom>
                  매출 상세
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>날짜</TableCell>
                        <TableCell>매출</TableCell>
                        <TableCell>예약</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {getCurrentData().slice(-5).map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{selectedPeriod === 'year' ? item.month : item.date}</TableCell>
                          <TableCell>₩{item.revenue.toLocaleString()}</TableCell>
                          <TableCell>{item.bookings}건</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* 객실 점유율 리포트 */}
      {selectedReport === 'occupancy' && (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="h2" gutterBottom>
                  객실 타입별 점유율
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>객실 타입</TableCell>
                        <TableCell>전체</TableCell>
                        <TableCell>점유</TableCell>
                        <TableCell>점유율</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {occupancyData.map((room, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                              {room.roomType}
                            </Typography>
                          </TableCell>
                          <TableCell>{room.total}</TableCell>
                          <TableCell>{room.occupied}</TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="body2" sx={{ minWidth: 40 }}>
                                {room.rate}%
                              </Typography>
                              <Box sx={{ flexGrow: 1 }}>
                                <LinearProgress
                                  variant="determinate"
                                  value={room.rate}
                                  sx={{
                                    height: 8,
                                    borderRadius: 4,
                                    backgroundColor: '#ecf0f1',
                                    '& .MuiLinearProgress-bar': {
                                      backgroundColor: room.rate > 85 ? '#e74c3c' : room.rate > 70 ? '#f39c12' : '#27ae60',
                                      borderRadius: 4
                                    }
                                  }}
                                />
                              </Box>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="h2" gutterBottom>
                  점유율 차트
                </Typography>
                <Box
                  sx={{
                    height: 200,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#f8f9fa',
                    borderRadius: 2
                  }}
                >
                  <Box sx={{ textAlign: 'center', color: 'text.secondary' }}>
                    <DonutLargeIcon sx={{ fontSize: 48, mb: 2 }} />
                    <Typography variant="body1">파이 차트 영역</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* 고객 분석 리포트 */}
      {selectedReport === 'customer' && (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="h2" gutterBottom>
                  VIP 등급별 분포
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>VIP 등급</TableCell>
                        <TableCell>고객 수</TableCell>
                        <TableCell>비율</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {customerData.vipDistribution.map((vip, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                              {vip.level}
                            </Typography>
                          </TableCell>
                          <TableCell>{vip.count}명</TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="body2" sx={{ minWidth: 40 }}>
                                {vip.percentage}%
                              </Typography>
                              <Box sx={{ flexGrow: 1 }}>
                                <LinearProgress
                                  variant="determinate"
                                  value={vip.percentage}
                                  sx={{
                                    height: 8,
                                    borderRadius: 4,
                                    backgroundColor: '#ecf0f1',
                                    '& .MuiLinearProgress-bar': {
                                      backgroundColor: '#3498db',
                                      borderRadius: 4
                                    }
                                  }}
                                />
                              </Box>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="h2" gutterBottom>
                  국적별 분포
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>국적</TableCell>
                        <TableCell>고객 수</TableCell>
                        <TableCell>비율</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {customerData.nationalityDistribution.map((nation, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                              {nation.country}
                            </Typography>
                          </TableCell>
                          <TableCell>{nation.count}명</TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="body2" sx={{ minWidth: 40 }}>
                                {nation.percentage}%
                              </Typography>
                              <Box sx={{ flexGrow: 1 }}>
                                <LinearProgress
                                  variant="determinate"
                                  value={nation.percentage}
                                  sx={{
                                    height: 8,
                                    borderRadius: 4,
                                    backgroundColor: '#ecf0f1',
                                    '& .MuiLinearProgress-bar': {
                                      backgroundColor: '#27ae60',
                                      borderRadius: 4
                                    }
                                  }}
                                />
                              </Box>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* 성과 지표 리포트 */}
      {selectedReport === 'performance' && (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  ₩{performanceMetrics.averageDailyRate.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  평균 일일 요금 (ADR)
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  ₩{performanceMetrics.revenuePAR.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  객실당 매출 (RevPAR)
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  {performanceMetrics.averageStayLength}박
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  평균 투숙 기간
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  {performanceMetrics.customerSatisfaction}/5.0
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  고객 만족도
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  {performanceMetrics.repeatCustomerRate}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  재방문 고객 비율
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  {performanceMetrics.noShowRate}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  노쇼 비율
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* 요약 인사이트 */}
      <Card>
        <CardContent>
          <Typography variant="h6" component="h2" gutterBottom>
            핵심 인사이트
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Alert severity="info" sx={{ height: '100%' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                  매출 성장
                </Typography>
                <Typography variant="body2">
                  이번 달 매출이 전월 대비 12% 증가했습니다. 스위트룸의 높은 점유율이 주요 요인입니다.
                </Typography>
              </Alert>
            </Grid>
            <Grid item xs={12} md={4}>
              <Alert severity="success" sx={{ height: '100%' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                  고객 만족도
                </Typography>
                <Typography variant="body2">
                  평균 고객 만족도 4.7점으로 우수한 서비스 품질을 유지하고 있습니다.
                </Typography>
              </Alert>
            </Grid>
            <Grid item xs={12} md={4}>
              <Alert severity="warning" sx={{ height: '100%' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                  개선 포인트
                </Typography>
                <Typography variant="body2">
                  스탠다드 룸의 점유율이 다소 낮아 마케팅 전략 개선이 필요합니다.
                </Typography>
              </Alert>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  )
}

export default Reports