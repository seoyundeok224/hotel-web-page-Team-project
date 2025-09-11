import { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Chip,
  Paper,
  Avatar,
  Divider
} from '@mui/material'
import {
  People as UsersIcon,
  Bed as BedIcon,
  Event as CalendarIcon,
  TrendingUp as TrendingUpIcon,
  Schedule as ClockIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material'
import { dashboardService } from '../../services/hotelService'

const Dashboard = () => {
  const [stats, setStats] = useState({})
  const [todayActivities, setTodayActivities] = useState({ checkIns: [], checkOuts: [] })
  const [roomStatusSummary, setRoomStatusSummary] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const [statsRes, activitiesRes, roomStatusRes] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getTodayActivities(),
        dashboardService.getRoomStatusSummary()
      ])

      setStats(statsRes.data)
      setTodayActivities(activitiesRes.data)
      setRoomStatusSummary(roomStatusRes.data)
    } catch (error) {
      console.error('대시보드 데이터 로드 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  const StatCard = ({ title, value, icon: Icon, color = '#212121' }) => (
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
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: color }}>
              {value}
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

  const getRoomStatusColor = (status) => {
    switch (status) {
      case 'AVAILABLE': return { color: '#2e7d32', bgColor: '#e8f5e8' }
      case 'OCCUPIED': return { color: '#d32f2f', bgColor: '#ffebee' }
      case 'MAINTENANCE': return { color: '#ed6c02', bgColor: '#fff3e0' }
      case 'CLEANING': return { color: '#1976d2', bgColor: '#e3f2fd' }
      default: return { color: '#757575', bgColor: '#f5f5f5' }
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case 'AVAILABLE': return '이용가능'
      case 'OCCUPIED': return '투숙중'
      case 'MAINTENANCE': return '정비중'
      case 'CLEANING': return '청소중'
      default: return status
    }
  }

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f5f5f5'
        }}
      >
        <Typography variant="h6" color="text.secondary">
          로딩 중...
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5', py: 4 }}>
      <Container maxWidth="xl">
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: 'bold',
            color: '#212121',
            mb: 4,
            textAlign: 'center'
          }}
        >
          Dev Hotel 관리 대시보드
        </Typography>

        {/* 주요 통계 카드 */}
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#212121', mb: 3 }}>
          객실 현황
        </Typography>
        <Grid container spacing={3} sx={{ mb: 5 }}>
          <Grid item xs={12} sm={6} lg={3}>
            <StatCard
              title="전체 객실"
              value={stats.totalRooms || 0}
              icon={BedIcon}
              color="#1976d2"
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <StatCard
              title="이용가능 객실"
              value={stats.availableRooms || 0}
              icon={CheckCircleIcon}
              color="#2e7d32"
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <StatCard
              title="투숙중 객실"
              value={stats.occupiedRooms || 0}
              icon={UsersIcon}
              color="#d32f2f"
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <StatCard
              title="객실 점유율"
              value={`${stats.occupancyRate || 0}%`}
              icon={TrendingUpIcon}
              color="#7b1fa2"
            />
          </Grid>
        </Grid>

        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#212121', mb: 3 }}>
          예약 및 고객 현황
        </Typography>
        <Grid container spacing={3} sx={{ mb: 5 }}>
          <Grid item xs={12} sm={4}>
            <StatCard
              title="총 고객 수"
              value={stats.totalGuests || 0}
              icon={UsersIcon}
              color="#3f51b5"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <StatCard
              title="총 예약 수"
              value={stats.totalReservations || 0}
              icon={CalendarIcon}
              color="#1976d2"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <StatCard
              title="확정 예약"
              value={stats.confirmedReservations || 0}
              icon={CheckCircleIcon}
              color="#2e7d32"
            />
          </Grid>
        </Grid>

        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#212121', mb: 3 }}>
          실시간 정보
        </Typography>

        <Grid container spacing={3}>
          {/* 오늘의 활동 */}
          <Grid item xs={12} lg={6}>
            <Card
              sx={{
                height: 'fit-content',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                borderRadius: 2
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <ClockIcon sx={{ mr: 1, color: '#212121' }} />
                  <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                    오늘의 활동
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'medium', mb: 2, color: '#212121' }}>
                    체크인 예정 ({todayActivities.checkIns?.length || 0}건)
                  </Typography>
                  {todayActivities.checkIns?.length > 0 ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {todayActivities.checkIns.map((reservation, index) => (
                        <Paper
                          key={index}
                          sx={{
                            p: 2,
                            backgroundColor: '#e8f5e8',
                            borderLeft: '4px solid #2e7d32',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}
                        >
                          <Typography sx={{ fontWeight: 'medium' }}>
                            {reservation.guest?.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            객실 {reservation.room?.roomNumber}
                          </Typography>
                        </Paper>
                      ))}
                    </Box>
                  ) : (
                    <Typography color="text.secondary">체크인 예정이 없습니다.</Typography>
                  )}
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'medium', mb: 2, color: '#212121' }}>
                    체크아웃 예정 ({todayActivities.checkOuts?.length || 0}건)
                  </Typography>
                  {todayActivities.checkOuts?.length > 0 ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {todayActivities.checkOuts.map((reservation, index) => (
                        <Paper
                          key={index}
                          sx={{
                            p: 2,
                            backgroundColor: '#e3f2fd',
                            borderLeft: '4px solid #1976d2',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}
                        >
                          <Typography sx={{ fontWeight: 'medium' }}>
                            {reservation.guest?.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            객실 {reservation.room?.roomNumber}
                          </Typography>
                        </Paper>
                      ))}
                    </Box>
                  ) : (
                    <Typography color="text.secondary">체크아웃 예정이 없습니다.</Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* 객실 상태 요약 */}
          <Grid item xs={12} lg={6}>
            <Card
              sx={{
                height: 'fit-content',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                borderRadius: 2
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <BedIcon sx={{ mr: 1, color: '#212121' }} />
                  <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                    객실 상태 요약
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {Object.entries(roomStatusSummary).map(([status, count]) => {
                    const colors = getRoomStatusColor(status);
                    return (
                      <Box key={status} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Chip
                          label={getStatusLabel(status)}
                          sx={{
                            backgroundColor: colors.bgColor,
                            color: colors.color,
                            fontWeight: 'medium'
                          }}
                        />
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#212121' }}>
                          {count}개
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>

                {stats.totalRooms > 0 && (
                  <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid #e0e0e0' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">점유율</Typography>
                      <Typography variant="body2" color="text.secondary">{stats.occupancyRate}%</Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={stats.occupancyRate}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: '#e0e0e0',
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 4,
                          backgroundColor: '#1976d2'
                        }
                      }}
                    />
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default Dashboard
