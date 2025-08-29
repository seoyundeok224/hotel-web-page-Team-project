import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Building2 } from 'lucide-react'
import '../../styles/CustomerHomePage.css'

// 통합 달력 컴포넌트 (체크인/체크아웃 한번에 선택)
const DateRangeCalendar = ({ checkInDate, checkOutDate, onDateSelect, minDate }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date())
    const [selectingCheckOut, setSelectingCheckOut] = useState(false)

    const getDaysInMonth = (date) => {
        const year = date.getFullYear()
        const month = date.getMonth()
        const firstDay = new Date(year, month, 1)
        const lastDay = new Date(year, month + 1, 0)
        const daysInMonth = lastDay.getDate()
        const startingDayOfWeek = firstDay.getDay()

        const days = []

        // 이전 달의 빈 칸들
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null)
        }

        // 현재 달의 날짜들
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(new Date(year, month, day))
        }

        return days
    }

    const isDateInRange = (date) => {
        if (!checkInDate || !checkOutDate || !date) return false
        const checkIn = new Date(checkInDate)
        const checkOut = new Date(checkOutDate)
        return date > checkIn && date < checkOut
    }

    const isDateDisabled = (date) => {
        if (!date || !minDate) return false
        if (date < minDate) return true

        // 체크아웃 선택 중일 때는 체크인 날짜 이전은 비활성화
        if (selectingCheckOut && checkInDate) {
            return date <= new Date(checkInDate)
        }

        return false
    }

    const formatDateString = (date) => {
        return date.toISOString().split('T')[0]
    }

    const isCheckInDate = (date) => {
        if (!date || !checkInDate) return false
        return formatDateString(date) === checkInDate
    }

    const isCheckOutDate = (date) => {
        if (!date || !checkOutDate) return false
        return formatDateString(date) === checkOutDate
    }

    const handleDateClick = (date) => {
        if (isDateDisabled(date)) return

        const dateString = formatDateString(date)

        if (!selectingCheckOut) {
            // 체크인 날짜 선택
            onDateSelect(dateString, null)
            setSelectingCheckOut(true)
        } else {
            // 체크아웃 날짜 선택
            onDateSelect(checkInDate, dateString)
            setSelectingCheckOut(false)
        }
    }

    const resetSelection = () => {
        onDateSelect('', '')
        setSelectingCheckOut(false)
    }

    const navigateMonth = (direction) => {
        setCurrentMonth(prev => {
            const newDate = new Date(prev)
            newDate.setMonth(prev.getMonth() + direction)
            return newDate
        })
    }

    const days = getDaysInMonth(currentMonth)
    const monthNames = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"]
    const dayNames = ["일", "월", "화", "수", "목", "금", "토"]

    return (
        <div className="calendar">
            <div className="calendar-header">
                <button onClick={() => navigateMonth(-1)}>&lt;</button>
                <span>{currentMonth.getFullYear()}년 {monthNames[currentMonth.getMonth()]}</span>
                <button onClick={() => navigateMonth(1)}>&gt;</button>
            </div>
            <div className="calendar-status">
                {!checkInDate ? (
                    <p>체크인 날짜를 선택하세요</p>
                ) : !checkOutDate ? (
                    <p>체크아웃 날짜를 선택하세요</p>
                ) : (
                    <div className="date-range-display">
                        <p><strong>체크인:</strong> {new Date(checkInDate).toLocaleDateString('ko-KR')}</p>
                        <p><strong>체크아웃:</strong> {new Date(checkOutDate).toLocaleDateString('ko-KR')}</p>
                        <button className="reset-btn" onClick={resetSelection}>다시 선택</button>
                    </div>
                )}
            </div>
            <div className="calendar-grid">
                {dayNames.map(day => (
                    <div key={day} className="calendar-day-header">{day}</div>
                ))}
                {days.map((date, index) => (
                    <div
                        key={index}
                        className={`calendar-day ${date ? '' : 'empty'} ${isCheckInDate(date) ? 'checkin' : ''
                            } ${isCheckOutDate(date) ? 'checkout' : ''
                            } ${isDateInRange(date) ? 'in-range' : ''
                            } ${isDateDisabled(date) ? 'disabled' : ''
                            }`}
                        onClick={() => date && handleDateClick(date)}
                    >
                        {date ? date.getDate() : ''}
                    </div>
                ))}
            </div>
        </div>
    )
}

const CustomerHome = () => {
    const navigate = useNavigate()
    const [checkInDate, setCheckInDate] = useState('')
    const [checkOutDate, setCheckOutDate] = useState('')
    const [guests, setGuests] = useState(1)
    const [rooms, setRooms] = useState(1)

    const handleDateSelect = (checkIn, checkOut) => {
        setCheckInDate(checkIn || '')
        setCheckOutDate(checkOut || '')
    }

    const handleSearch = () => {
        if (!checkInDate || !checkOutDate) {
            alert('체크인/체크아웃 날짜를 선택해주세요.')
            return
        }

        if (new Date(checkInDate) >= new Date(checkOutDate)) {
            alert('체크아웃 날짜는 체크인 날짜보다 늦어야 합니다.')
            return
        }

        // 예약 검색 로직
        console.log('검색 조건:', {
            checkInDate,
            checkOutDate,
            guests,
            rooms
        })
    }

    return (
        <div className="customer-home">
            {/* 헤더 */}
            <header className="customer-header">
                <div className="header-content">
                    <div className="customer-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                        <Building2 size={24} />
                        DEV호텔
                    </div>
                    <nav className="customer-nav" style={{ writingMode: 'horizontal-tb', textOrientation: 'mixed' }}>
                        <a href="#rooms" style={{ writingMode: 'horizontal-tb', textOrientation: 'mixed', whiteSpace: 'nowrap' }}>객실</a>
                        <a href="#facilities" style={{ writingMode: 'horizontal-tb', textOrientation: 'mixed', whiteSpace: 'nowrap' }}>시설</a>
                        <a href="#dining" style={{ writingMode: 'horizontal-tb', textOrientation: 'mixed', whiteSpace: 'nowrap' }}>다이닝</a>
                        <a href="#contact" style={{ writingMode: 'horizontal-tb', textOrientation: 'mixed', whiteSpace: 'nowrap' }}>문의</a>
                        <button className="login-btn" onClick={() => window.location.href = '/login'} style={{ writingMode: 'horizontal-tb', textOrientation: 'mixed', whiteSpace: 'nowrap' }}>
                            관리자 로그인
                        </button>
                    </nav>
                </div>
            </header>

            {/* 메인 히어로 섹션 */}
            <section className="hero-section">
                <div className="hero-content">
                    {/* 예약 검색 폼 - 왼쪽에 배치 */}
                    <div className="booking-section">
                        <div className="booking-form">
                            <h3>예약 검색</h3>

                            {/* 통합 캘린더 */}
                            <div className="calendar-section">
                                <DateRangeCalendar
                                    checkInDate={checkInDate}
                                    checkOutDate={checkOutDate}
                                    onDateSelect={handleDateSelect}
                                    minDate={new Date()}
                                />
                            </div>

                            {/* 기본 옵션 */}
                            <div className="booking-options">
                                <div className="options-grid">
                                    <div className="form-group">
                                        <label htmlFor="guests">투숙객</label>
                                        <select
                                            id="guests"
                                            value={guests}
                                            onChange={(e) => setGuests(parseInt(e.target.value))}
                                        >
                                            {[1, 2, 3, 4, 5, 6].map(num => (
                                                <option key={num} value={num}>{num}명</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="rooms">객실</label>
                                        <select
                                            id="rooms"
                                            value={rooms}
                                            onChange={(e) => setRooms(parseInt(e.target.value))}
                                        >
                                            {[1, 2, 3, 4, 5].map(num => (
                                                <option key={num} value={num}>{num}개</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* 숙박기간 표시 */}
                                {checkInDate && checkOutDate && (
                                    <div className="stay-duration">
                                        <p><strong>숙박기간:</strong> {Math.ceil((new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24))}박</p>
                                    </div>
                                )}

                                <button className="search-btn" onClick={handleSearch}>
                                    예약 가능한 객실 검색
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* 히어로 텍스트 - 오른쪽에 배치 */}
                    <div className="hero-text">
                        <h2 className="hero-title">특별한 경험을 선사하는 DEV호텔</h2>
                        <p className="hero-subtitle">편안함과 럭셔리가 만나는 곳</p>
                        <div className="hero-features">
                            <div className="feature-item">
                                <h4>🏊‍♂️ 프리미엄 시설</h4>
                                <p>수영장, 스파, 피트니스 센터</p>
                            </div>
                            <div className="feature-item">
                                <h4>🍽️ 파인 다이닝</h4>
                                <p>미슐랭 스타 셰프의 특별한 요리</p>
                            </div>
                            <div className="feature-item">
                                <h4>🌟 최고의 서비스</h4>
                                <p>24시간 컨시어지 서비스</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 객실 소개 섹션 */}
            <section className="rooms-preview" id="rooms">
                <div className="section-content">
                    <h2>객실 안내</h2>
                    <div className="rooms-grid">
                        <div className="room-card">
                            <div className="room-image">
                                <div className="placeholder-image">스탠다드룸</div>
                            </div>
                            <div className="room-info">
                                <h3>스탠다드룸</h3>
                                <p>편안하고 아늑한 공간에서 휴식을 취하세요</p>
                                <div className="room-price">₩120,000 / 박</div>
                            </div>
                        </div>

                        <div className="room-card">
                            <div className="room-image">
                                <div className="placeholder-image">디럭스룸</div>
                            </div>
                            <div className="room-info">
                                <h3>디럭스룸</h3>
                                <p>넓은 공간과 고급스러운 인테리어를 자랑합니다</p>
                                <div className="room-price">₩180,000 / 박</div>
                            </div>
                        </div>

                        <div className="room-card">
                            <div className="room-image">
                                <div className="placeholder-image">스위트룸</div>
                            </div>
                            <div className="room-info">
                                <h3>스위트룸</h3>
                                <p>최고급 시설과 서비스를 경험하세요</p>
                                <div className="room-price">₩350,000 / 박</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 시설 안내 섹션 */}
            <section className="facilities-section" id="facilities">
                <div className="section-content">
                    <h2>호텔 시설</h2>
                    <div className="facilities-grid">
                        <div className="facility-card">
                            <h3>🏊‍♂️ 수영장</h3>
                            <p>옥상에 위치한 인피니티 풀에서 도시 전경을 감상하세요</p>
                        </div>
                        <div className="facility-card">
                            <h3>🏋️‍♂️ 피트니스 센터</h3>
                            <p>최신 운동기구가 구비된 24시간 운영 헬스장</p>
                        </div>
                        <div className="facility-card">
                            <h3>💆‍♀️ 스파</h3>
                            <p>전문 테라피스트가 제공하는 럭셔리 스파 서비스</p>
                        </div>
                        <div className="facility-card">
                            <h3>🍽️ 레스토랑</h3>
                            <p>미슐랭 스타 셰프의 특별한 요리를 맛보세요</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 푸터 */}
            <footer className="customer-footer">
                <div className="footer-content">
                    <div className="footer-section">
                        <h3>DEV호텔</h3>
                        <p>서울특별시 강남구 테헤란로 123</p>
                        <p>전화: 02-1234-5678</p>
                        <p>이메일: info@devhotel.com</p>
                    </div>
                    <div className="footer-section">
                        <h3>예약 문의</h3>
                        <p>24시간 예약 상담</p>
                        <p>02-1234-5679</p>
                    </div>
                    <div className="footer-section">
                        <h3>소셜 미디어</h3>
                        <p>Instagram | Facebook | Twitter</p>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; 2024 DEV호텔. All rights reserved.</p>
                </div>
            </footer>
        </div>
    )
}

export default CustomerHome
