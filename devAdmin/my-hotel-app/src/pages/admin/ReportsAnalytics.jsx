import { useState, useEffect } from 'react'
import { 
  Calendar, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Bed,
  Download,
  Filter,
  BarChart,
  PieChart
} from 'lucide-react'

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
      { month: '2025-08', revenue: 25000000, bookings: 167 } // 현재까지
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
    switch(selectedPeriod) {
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
    <div className="reports">
      <div className="page-header">
        <h1 className="page-title">리포트</h1>
        <p className="page-subtitle">호텔 운영 성과와 분석 데이터를 확인하세요</p>
      </div>

      {/* 리포트 제어 */}
      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flex: 1 }}>
            <select
              className="form-input"
              style={{ minWidth: '150px' }}
              value={selectedReport}
              onChange={(e) => setSelectedReport(e.target.value)}
            >
              <option value="revenue">매출 분석</option>
              <option value="occupancy">객실 점유율</option>
              <option value="customer">고객 분석</option>
              <option value="performance">성과 지표</option>
            </select>
            <select
              className="form-input"
              style={{ minWidth: '120px' }}
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
            >
              <option value="week">최근 7일</option>
              <option value="month">이번 달</option>
              <option value="year">올해</option>
            </select>
          </div>
          <button className="btn btn-primary">
            <Download size={16} />
            리포트 다운로드
          </button>
        </div>
      </div>

      {/* 주요 지표 요약 */}
      <div className="dashboard-grid" style={{ marginBottom: '2rem' }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#3498db' }}>
            <DollarSign size={24} />
          </div>
          <div className="stat-content">
            <h3>₩{getTotalRevenue().toLocaleString()}</h3>
            <p>총 매출</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#27ae60' }}>
            <Calendar size={24} />
          </div>
          <div className="stat-content">
            <h3>{getTotalBookings()}</h3>
            <p>총 예약 건수</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#f39c12' }}>
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <h3>₩{Math.round(getAverageRevenue()).toLocaleString()}</h3>
            <p>일평균 매출</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#9b59b6' }}>
            <Bed size={24} />
          </div>
          <div className="stat-content">
            <h3>{Math.round(occupancyData.reduce((sum, room) => sum + room.rate, 0) / occupancyData.length)}%</h3>
            <p>평균 점유율</p>
          </div>
        </div>
      </div>

      {/* 매출 분석 리포트 */}
      {selectedReport === 'revenue' && (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">매출 추이</h2>
            </div>
            <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
              <div style={{ textAlign: 'center', color: '#7f8c8d' }}>
                <BarChart size={48} style={{ marginBottom: '1rem' }} />
                <p>차트 컴포넌트 영역</p>
                <p style={{ fontSize: '0.9rem' }}>실제 구현시 Chart.js 또는 Recharts 등의 라이브러리 사용</p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">매출 상세</h2>
            </div>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>날짜</th>
                    <th>매출</th>
                    <th>예약</th>
                  </tr>
                </thead>
                <tbody>
                  {getCurrentData().slice(-5).map((item, index) => (
                    <tr key={index}>
                      <td>{selectedPeriod === 'year' ? item.month : item.date}</td>
                      <td>₩{item.revenue.toLocaleString()}</td>
                      <td>{item.bookings}건</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 객실 점유율 리포트 */}
      {selectedReport === 'occupancy' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">객실 타입별 점유율</h2>
            </div>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>객실 타입</th>
                    <th>전체</th>
                    <th>점유</th>
                    <th>점유율</th>
                  </tr>
                </thead>
                <tbody>
                  {occupancyData.map((room, index) => (
                    <tr key={index}>
                      <td><strong>{room.roomType}</strong></td>
                      <td>{room.total}</td>
                      <td>{room.occupied}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span>{room.rate}%</span>
                          <div style={{ 
                            width: '60px', 
                            height: '8px', 
                            backgroundColor: '#ecf0f1', 
                            borderRadius: '4px',
                            overflow: 'hidden'
                          }}>
                            <div style={{ 
                              width: `${room.rate}%`, 
                              height: '100%', 
                              backgroundColor: room.rate > 85 ? '#e74c3c' : room.rate > 70 ? '#f39c12' : '#27ae60'
                            }} />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">점유율 차트</h2>
            </div>
            <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
              <div style={{ textAlign: 'center', color: '#7f8c8d' }}>
                <PieChart size={48} style={{ marginBottom: '1rem' }} />
                <p>파이 차트 영역</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 고객 분석 리포트 */}
      {selectedReport === 'customer' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">VIP 등급별 분포</h2>
            </div>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>VIP 등급</th>
                    <th>고객 수</th>
                    <th>비율</th>
                  </tr>
                </thead>
                <tbody>
                  {customerData.vipDistribution.map((vip, index) => (
                    <tr key={index}>
                      <td><strong>{vip.level}</strong></td>
                      <td>{vip.count}명</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span>{vip.percentage}%</span>
                          <div style={{ 
                            width: '60px', 
                            height: '8px', 
                            backgroundColor: '#ecf0f1', 
                            borderRadius: '4px',
                            overflow: 'hidden'
                          }}>
                            <div style={{ 
                              width: `${vip.percentage}%`, 
                              height: '100%', 
                              backgroundColor: '#3498db'
                            }} />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">국적별 분포</h2>
            </div>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>국적</th>
                    <th>고객 수</th>
                    <th>비율</th>
                  </tr>
                </thead>
                <tbody>
                  {customerData.nationalityDistribution.map((nation, index) => (
                    <tr key={index}>
                      <td><strong>{nation.country}</strong></td>
                      <td>{nation.count}명</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span>{nation.percentage}%</span>
                          <div style={{ 
                            width: '60px', 
                            height: '8px', 
                            backgroundColor: '#ecf0f1', 
                            borderRadius: '4px',
                            overflow: 'hidden'
                          }}>
                            <div style={{ 
                              width: `${nation.percentage}%`, 
                              height: '100%', 
                              backgroundColor: '#27ae60'
                            }} />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 성과 지표 리포트 */}
      {selectedReport === 'performance' && (
        <div className="dashboard-grid" style={{ marginBottom: '2rem' }}>
          <div className="stat-card">
            <div className="stat-content">
              <h3>₩{performanceMetrics.averageDailyRate.toLocaleString()}</h3>
              <p>평균 일일 요금 (ADR)</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-content">
              <h3>₩{performanceMetrics.revenuePAR.toLocaleString()}</h3>
              <p>객실당 매출 (RevPAR)</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-content">
              <h3>{performanceMetrics.averageStayLength}박</h3>
              <p>평균 투숙 기간</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-content">
              <h3>{performanceMetrics.customerSatisfaction}/5.0</h3>
              <p>고객 만족도</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-content">
              <h3>{performanceMetrics.repeatCustomerRate}%</h3>
              <p>재방문 고객 비율</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-content">
              <h3>{performanceMetrics.noShowRate}%</h3>
              <p>노쇼 비율</p>
            </div>
          </div>
        </div>
      )}

      {/* 요약 인사이트 */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">핵심 인사이트</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: '#e8f4fd', borderRadius: '8px', borderLeft: '4px solid #3498db' }}>
            <h4 style={{ margin: 0, marginBottom: '0.5rem', color: '#2c3e50' }}>매출 성장</h4>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#7f8c8d' }}>
              이번 달 매출이 전월 대비 12% 증가했습니다. 스위트룸의 높은 점유율이 주요 요인입니다.
            </p>
          </div>
          <div style={{ padding: '1rem', backgroundColor: '#eafaf1', borderRadius: '8px', borderLeft: '4px solid #27ae60' }}>
            <h4 style={{ margin: 0, marginBottom: '0.5rem', color: '#2c3e50' }}>고객 만족도</h4>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#7f8c8d' }}>
              평균 고객 만족도 4.7점으로 우수한 서비스 품질을 유지하고 있습니다.
            </p>
          </div>
          <div style={{ padding: '1rem', backgroundColor: '#fef9e7', borderRadius: '8px', borderLeft: '4px solid #f39c12' }}>
            <h4 style={{ margin: 0, marginBottom: '0.5rem', color: '#2c3e50' }}>개선 포인트</h4>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#7f8c8d' }}>
              스탠다드 룸의 점유율이 다소 낮아 마케팅 전략 개선이 필요합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reports
