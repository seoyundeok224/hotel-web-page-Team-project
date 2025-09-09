import { useState, useEffect } from 'react'
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  Phone,
  Mail,
  MapPin,
  Calendar,
  User,
  CreditCard
} from 'lucide-react'

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
    switch(level) {
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
    <div className="guests">
      <div className="page-header">
        <h1 className="page-title">고객 관리</h1>
        <p className="page-subtitle">호텔 고객 정보를 관리하고 서비스를 제공하세요</p>
      </div>

      {/* 고객 통계 */}
      <div className="dashboard-grid" style={{ marginBottom: '2rem' }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#3498db' }}>
            <User size={24} />
          </div>
          <div className="stat-content">
            <h3>{guestStats.total}</h3>
            <p>총 고객 수</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#27ae60' }}>
            <Calendar size={24} />
          </div>
          <div className="stat-content">
            <h3>{guestStats.current}</h3>
            <p>현재 투숙 고객</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#f39c12' }}>
            <CreditCard size={24} />
          </div>
          <div className="stat-content">
            <h3>{guestStats.vip}</h3>
            <p>VIP 고객</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#9b59b6' }}>
            <CreditCard size={24} />
          </div>
          <div className="stat-content">
            <h3>₩{guestStats.totalRevenue.toLocaleString()}</h3>
            <p>총 매출</p>
          </div>
        </div>
      </div>

      {/* 검색 및 필터 */}
      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flex: 1, flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', minWidth: '300px' }}>
              <Search size={20} style={{ 
                position: 'absolute', 
                left: '12px', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                color: '#7f8c8d' 
              }} />
              <input
                type="text"
                placeholder="이름, 이메일, 전화번호로 검색..."
                className="form-input"
                style={{ paddingLeft: '40px' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="form-input"
              style={{ minWidth: '120px' }}
              value={vipFilter}
              onChange={(e) => setVipFilter(e.target.value)}
            >
              <option value="all">전체 등급</option>
              <option value="Platinum">Platinum</option>
              <option value="Gold">Gold</option>
              <option value="Silver">Silver</option>
              <option value="Bronze">Bronze</option>
            </select>
            <select
              className="form-input"
              style={{ minWidth: '120px' }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">전체 상태</option>
              <option value="current">현재 투숙</option>
              <option value="past">과거 고객</option>
            </select>
          </div>
          <button className="btn btn-primary">
            <Plus size={16} />
            고객 추가
          </button>
        </div>
      </div>

      {/* 고객 목록 */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">고객 목록 ({filteredGuests.length}명)</h2>
        </div>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>고객정보</th>
                <th>연락처</th>
                <th>VIP등급</th>
                <th>투숙이력</th>
                <th>현재예약</th>
                <th>최근방문</th>
                <th>액션</th>
              </tr>
            </thead>
            <tbody>
              {filteredGuests.map((guest) => (
                <tr key={guest.id}>
                  <td>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <strong>{guest.name}</strong>
                        {guest.currentReservation && (
                          <span style={{ 
                            backgroundColor: '#d4edda', 
                            color: '#155724', 
                            padding: '0.25rem 0.5rem', 
                            borderRadius: '12px', 
                            fontSize: '0.75rem' 
                          }}>
                            투숙중
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.9rem', color: '#7f8c8d' }}>
                        {guest.nationality} • {guest.birthDate}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.9rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <Phone size={14} />
                        {guest.phone}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <Mail size={14} />
                        {guest.email}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <MapPin size={14} />
                        <span style={{ fontSize: '0.8rem' }}>{guest.address.substring(0, 20)}...</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span 
                      className="status-badge"
                      style={{ 
                        backgroundColor: getVipLevelColor(guest.vipLevel) + '20',
                        color: getVipLevelColor(guest.vipLevel),
                        border: `1px solid ${getVipLevelColor(guest.vipLevel)}40`
                      }}
                    >
                      {guest.vipLevel}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.9rem' }}>
                      <div><strong>{guest.totalStays}회</strong> 투숙</div>
                      <div style={{ color: '#7f8c8d' }}>₩{guest.totalSpent.toLocaleString()}</div>
                    </div>
                  </td>
                  <td>
                    {guest.currentReservation ? (
                      <div style={{ fontSize: '0.9rem' }}>
                        <div><strong>객실 {guest.currentReservation.roomNumber}</strong></div>
                        <div style={{ color: '#7f8c8d' }}>
                          {guest.currentReservation.checkIn} ~ {guest.currentReservation.checkOut}
                        </div>
                      </div>
                    ) : (
                      <span style={{ color: '#7f8c8d' }}>없음</span>
                    )}
                  </td>
                  <td>
                    <div style={{ fontSize: '0.9rem' }}>
                      {guest.lastVisit}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        className="btn btn-primary"
                        style={{ padding: '0.25rem 0.5rem' }}
                        title="상세보기"
                      >
                        <Eye size={14} />
                      </button>
                      <button 
                        className="btn btn-warning"
                        style={{ padding: '0.25rem 0.5rem' }}
                        title="수정"
                      >
                        <Edit size={14} />
                      </button>
                      <button 
                        className="btn btn-danger"
                        style={{ padding: '0.25rem 0.5rem' }}
                        title="삭제"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* VIP 고객 현황 */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">VIP 등급별 현황</h2>
        </div>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>VIP 등급</th>
                <th>고객 수</th>
                <th>총 투숙</th>
                <th>총 매출</th>
                <th>평균 매출</th>
              </tr>
            </thead>
            <tbody>
              {['Platinum', 'Gold', 'Silver', 'Bronze'].map(level => {
                const levelGuests = guests.filter(g => g.vipLevel === level)
                const totalStays = levelGuests.reduce((sum, g) => sum + g.totalStays, 0)
                const totalSpent = levelGuests.reduce((sum, g) => sum + g.totalSpent, 0)
                const avgSpent = levelGuests.length > 0 ? totalSpent / levelGuests.length : 0

                return (
                  <tr key={level}>
                    <td>
                      <span 
                        className="status-badge"
                        style={{ 
                          backgroundColor: getVipLevelColor(level) + '20',
                          color: getVipLevelColor(level),
                          border: `1px solid ${getVipLevelColor(level)}40`
                        }}
                      >
                        {level}
                      </span>
                    </td>
                    <td><strong>{levelGuests.length}명</strong></td>
                    <td>{totalStays}회</td>
                    <td>₩{totalSpent.toLocaleString()}</td>
                    <td>₩{Math.round(avgSpent).toLocaleString()}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Guests
