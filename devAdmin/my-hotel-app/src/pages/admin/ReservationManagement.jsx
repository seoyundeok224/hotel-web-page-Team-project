import { useState, useEffect } from 'react'
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  Calendar,
  User,
  Bed,
  Clock,
  DollarSign
} from 'lucide-react'

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
    switch(status) {
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
    <div className="reservations">
      <div className="page-header">
        <h1 className="page-title">예약 관리</h1>
        <p className="page-subtitle">호텔 예약을 관리하고 추적하세요</p>
      </div>

      {/* 액션 바 */}
      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flex: 1 }}>
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
                placeholder="고객명 또는 예약번호로 검색..."
                className="form-input"
                style={{ paddingLeft: '40px' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="form-input"
              style={{ minWidth: '150px' }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">전체 상태</option>
              <option value="confirmed">확정</option>
              <option value="pending">대기</option>
              <option value="cancelled">취소</option>
              <option value="checked-in">체크인</option>
              <option value="checked-out">체크아웃</option>
            </select>
          </div>
          <button className="btn btn-primary" onClick={handleNewReservation}>
            <Plus size={16} />
            새 예약
          </button>
        </div>
      </div>

      {/* 예약 통계 */}
      <div className="dashboard-grid" style={{ marginBottom: '2rem' }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#3498db' }}>
            <Calendar size={24} />
          </div>
          <div className="stat-content">
            <h3>{reservations.filter(r => r.status === 'confirmed').length}</h3>
            <p>확정된 예약</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#f39c12' }}>
            <Clock size={24} />
          </div>
          <div className="stat-content">
            <h3>{reservations.filter(r => r.status === 'pending').length}</h3>
            <p>대기 중인 예약</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#27ae60' }}>
            <User size={24} />
          </div>
          <div className="stat-content">
            <h3>{reservations.reduce((sum, r) => sum + r.guests, 0)}</h3>
            <p>총 투숙객 수</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#9b59b6' }}>
            <DollarSign size={24} />
          </div>
          <div className="stat-content">
            <h3>₩{reservations.reduce((sum, r) => sum + r.totalAmount, 0).toLocaleString()}</h3>
            <p>총 예약 금액</p>
          </div>
        </div>
      </div>

      {/* 예약 목록 */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">예약 목록 ({filteredReservations.length}건)</h2>
        </div>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>예약번호</th>
                <th>고객정보</th>
                <th>객실정보</th>
                <th>체크인/아웃</th>
                <th>투숙객/박수</th>
                <th>금액</th>
                <th>상태</th>
                <th>액션</th>
              </tr>
            </thead>
            <tbody>
              {filteredReservations.map((reservation) => (
                <tr key={reservation.id}>
                  <td>
                    <strong>{reservation.reservationNumber}</strong>
                    <br />
                    <small style={{ color: '#7f8c8d' }}>{reservation.createdAt}</small>
                  </td>
                  <td>
                    <div>
                      <strong>{reservation.guestName}</strong>
                      <br />
                      <small style={{ color: '#7f8c8d' }}>{reservation.guestPhone}</small>
                    </div>
                  </td>
                  <td>
                    <div>
                      <strong>객실 {reservation.roomNumber}</strong>
                      <br />
                      <small style={{ color: '#7f8c8d' }}>{reservation.roomType}</small>
                    </div>
                  </td>
                  <td>
                    <div>
                      <strong>{reservation.checkIn}</strong>
                      <br />
                      <small style={{ color: '#7f8c8d' }}>{reservation.checkOut}</small>
                    </div>
                  </td>
                  <td>
                    <div>
                      <strong>{reservation.guests}명</strong>
                      <br />
                      <small style={{ color: '#7f8c8d' }}>{reservation.nights}박</small>
                    </div>
                  </td>
                  <td>
                    <strong>₩{reservation.totalAmount.toLocaleString()}</strong>
                  </td>
                  <td>
                    <span className={`status-badge status-${reservation.status}`}>
                      {getStatusText(reservation.status)}
                    </span>
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
                        onClick={() => handleEditReservation(reservation.id)}
                      >
                        <Edit size={14} />
                      </button>
                      <button 
                        className="btn btn-danger"
                        style={{ padding: '0.25rem 0.5rem' }}
                        title="삭제"
                        onClick={() => handleDeleteReservation(reservation.id)}
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
    </div>
  )
}

export default Reservations
