import { useState, useEffect } from 'react'
import { Users, Bed, Calendar, TrendingUp, Clock, CheckCircle } from 'lucide-react'
import { dashboardService } from '../../services/hotelService'
import '../../styles/Grid.css'

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

  const StatCard = ({ title, value, icon: Icon, color = 'blue' }) => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-3xl font-bold text-${color}-600`}>{value}</p>
        </div>
        <Icon className={`h-12 w-12 text-${color}-600`} />
      </div>
    </div>
  )

  const getRoomStatusColor = (status) => {
    switch (status) {
      case 'AVAILABLE': return 'text-green-600 bg-green-100'
      case 'OCCUPIED': return 'text-red-600 bg-red-100'
      case 'MAINTENANCE': return 'text-yellow-600 bg-yellow-100'
      case 'CLEANING': return 'text-blue-600 bg-blue-100'
      default: return 'text-gray-600 bg-gray-100'
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">로딩 중...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">DEV호텔 관리 대시보드</h1>

        {/* 통계 카드 */}
        <div className="dashboard-stats-grid">
          <StatCard
            title="전체 객실"
            value={stats.totalRooms || 0}
            icon={Bed}
            color="blue"
          />
          <StatCard
            title="이용가능 객실"
            value={stats.availableRooms || 0}
            icon={CheckCircle}
            color="green"
          />
          <StatCard
            title="투숙중 객실"
            value={stats.occupiedRooms || 0}
            icon={Users}
            color="red"
          />
          <StatCard
            title="객실 점유율"
            value={`${stats.occupancyRate || 0}%`}
            icon={TrendingUp}
            color="purple"
          />
        </div>

        <div className="dashboard-secondary-grid">
          <StatCard
            title="총 고객 수"
            value={stats.totalGuests || 0}
            icon={Users}
            color="indigo"
          />
          <StatCard
            title="총 예약 수"
            value={stats.totalReservations || 0}
            icon={Calendar}
            color="blue"
          />
          <StatCard
            title="확정 예약"
            value={stats.confirmedReservations || 0}
            icon={CheckCircle}
            color="green"
          />
        </div>

        <div className="dashboard-content-grid">
          {/* 오늘의 활동 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Clock className="mr-2" />
              오늘의 활동
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  체크인 예정 ({todayActivities.checkIns?.length || 0}건)
                </h3>
                {todayActivities.checkIns?.length > 0 ? (
                  <div className="space-y-2">
                    {todayActivities.checkIns.map((reservation, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-green-50 rounded">
                        <span className="font-medium">{reservation.guest?.name}</span>
                        <span className="text-sm text-gray-600">객실 {reservation.room?.roomNumber}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">체크인 예정이 없습니다.</p>
                )}
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  체크아웃 예정 ({todayActivities.checkOuts?.length || 0}건)
                </h3>
                {todayActivities.checkOuts?.length > 0 ? (
                  <div className="space-y-2">
                    {todayActivities.checkOuts.map((reservation, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-blue-50 rounded">
                        <span className="font-medium">{reservation.guest?.name}</span>
                        <span className="text-sm text-gray-600">객실 {reservation.room?.roomNumber}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">체크아웃 예정이 없습니다.</p>
                )}
              </div>
            </div>
          </div>

          {/* 객실 상태 요약 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Bed className="mr-2" />
              객실 상태 요약
            </h2>

            <div className="space-y-3">
              {Object.entries(roomStatusSummary).map(([status, count]) => (
                <div key={status} className="flex justify-between items-center">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoomStatusColor(status)}`}>
                    {getStatusLabel(status)}
                  </span>
                  <span className="text-lg font-semibold text-gray-900">{count}개</span>
                </div>
              ))}
            </div>

            {stats.totalRooms > 0 && (
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>점유율</span>
                  <span>{stats.occupancyRate}%</span>
                </div>
                <div className="mt-2 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${stats.occupancyRate}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
