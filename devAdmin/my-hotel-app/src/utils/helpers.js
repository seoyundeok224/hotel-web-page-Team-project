// 날짜 포맷팅 유틸리티
export const formatDate = (date, format = 'YYYY-MM-DD') => {
  if (!date) return ''
  
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  
  switch (format) {
    case 'YYYY-MM-DD':
      return `${year}-${month}-${day}`
    case 'MM/DD/YYYY':
      return `${month}/${day}/${year}`
    case 'DD/MM/YYYY':
      return `${day}/${month}/${year}`
    case 'YYYY년 MM월 DD일':
      return `${year}년 ${month}월 ${day}일`
    default:
      return `${year}-${month}-${day}`
  }
}

// 날짜 범위 계산
export const getDateRange = (startDate, endDate) => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const timeDiff = end.getTime() - start.getTime()
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))
  return daysDiff
}

// 오늘 날짜 반환
export const getToday = () => {
  return formatDate(new Date())
}

// 내일 날짜 반환
export const getTomorrow = () => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return formatDate(tomorrow)
}

// 숫자를 통화 형식으로 포맷팅
export const formatCurrency = (amount, currency = 'KRW') => {
  if (typeof amount !== 'number') return '₩0'
  
  switch (currency) {
    case 'KRW':
      return `₩${amount.toLocaleString('ko-KR')}`
    case 'USD':
      return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
    case 'EUR':
      return `€${amount.toLocaleString('de-DE', { minimumFractionDigits: 2 })}`
    default:
      return `₩${amount.toLocaleString('ko-KR')}`
  }
}

// 퍼센테이지 포맷팅
export const formatPercentage = (value, decimals = 1) => {
  if (typeof value !== 'number') return '0%'
  return `${value.toFixed(decimals)}%`
}

// 전화번호 포맷팅
export const formatPhoneNumber = (phone) => {
  if (!phone) return ''
  
  // 한국 전화번호 포맷 (010-1234-5678)
  const cleaned = phone.replace(/\D/g, '')
  
  if (cleaned.length === 11 && cleaned.startsWith('010')) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`
  }
  
  // 국제 번호는 그대로 반환
  return phone
}

// 문자열 자르기 (말줄임표 추가)
export const truncateString = (str, maxLength = 50) => {
  if (!str || str.length <= maxLength) return str
  return str.substring(0, maxLength) + '...'
}

// 예약 상태 텍스트 반환
export const getReservationStatusText = (status) => {
  const statusMap = {
    'pending': '대기',
    'confirmed': '확정',
    'checked-in': '체크인',
    'checked-out': '체크아웃',
    'cancelled': '취소',
    'no-show': '노쇼'
  }
  return statusMap[status] || status
}

// 객실 상태 텍스트 반환
export const getRoomStatusText = (status) => {
  const statusMap = {
    'available': '이용가능',
    'occupied': '점유중',
    'cleaning': '청소중',
    'maintenance': '정비중',
    'out-of-order': '사용불가'
  }
  return statusMap[status] || status
}

// VIP 등급 색상 반환
export const getVipLevelColor = (level) => {
  const colorMap = {
    'Platinum': '#9b59b6',
    'Gold': '#f39c12',
    'Silver': '#95a5a6',
    'Bronze': '#d35400'
  }
  return colorMap[level] || '#7f8c8d'
}

// 상태별 색상 반환
export const getStatusColor = (status, type = 'reservation') => {
  if (type === 'reservation') {
    const colorMap = {
      'pending': '#f39c12',
      'confirmed': '#27ae60',
      'checked-in': '#3498db',
      'checked-out': '#95a5a6',
      'cancelled': '#e74c3c',
      'no-show': '#e74c3c'
    }
    return colorMap[status] || '#7f8c8d'
  }
  
  if (type === 'room') {
    const colorMap = {
      'available': '#27ae60',
      'occupied': '#e74c3c',
      'cleaning': '#f39c12',
      'maintenance': '#9b59b6',
      'out-of-order': '#95a5a6'
    }
    return colorMap[status] || '#7f8c8d'
  }
  
  return '#7f8c8d'
}

// 로컬 스토리지 유틸리티
export const storage = {
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('Error saving to localStorage:', error)
    }
  },
  
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.error('Error reading from localStorage:', error)
      return defaultValue
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error('Error removing from localStorage:', error)
    }
  },
  
  clear: () => {
    try {
      localStorage.clear()
    } catch (error) {
      console.error('Error clearing localStorage:', error)
    }
  }
}

// 이메일 유효성 검사
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// 전화번호 유효성 검사 (한국 번호)
export const isValidKoreanPhone = (phone) => {
  const phoneRegex = /^010-?\d{4}-?\d{4}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

// 파일 크기 포맷팅
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 랜덤 ID 생성
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// 배열을 청크로 나누기
export const chunkArray = (array, size) => {
  const chunks = []
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return chunks
}

// 디바운스 함수
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}
