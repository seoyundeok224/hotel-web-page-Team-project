import { useState, useEffect } from 'react'
import { Plus, Search, Edit, Users, Home, BarChart3 } from 'lucide-react'
import { roomService } from '../../services/hotelService'
import '../../styles/Grid.css'

// 개별 객실 카드 컴포넌트
const RoomCard = ({ room, onStatusChange, onEdit }) => {
    const getStatusInfo = (status) => {
        switch (status) {
            case 'AVAILABLE':
                return { label: '이용가능', color: 'bg-green-500', bgColor: 'bg-green-50 border-green-200' }
            case 'OCCUPIED':
                return { label: '투숙중', color: 'bg-red-500', bgColor: 'bg-red-50 border-red-200' }
            case 'MAINTENANCE':
                return { label: '정비중', color: 'bg-yellow-500', bgColor: 'bg-yellow-50 border-yellow-200' }
            case 'CLEANING':
                return { label: '청소중', color: 'bg-blue-500', bgColor: 'bg-blue-50 border-blue-200' }
            default:
                return { label: status, color: 'bg-gray-500', bgColor: 'bg-gray-50 border-gray-200' }
        }
    }

    const getRoomTypeInfo = (type) => {
        switch (type) {
            case 'SINGLE': return { label: '싱글', icon: '🛏️' }
            case 'DOUBLE': return { label: '더블', icon: '🛏️🛏️' }
            case 'DELUXE': return { label: '디럭스', icon: '✨' }
            case 'SUITE': return { label: '스위트', icon: '👑' }
            default: return { label: type, icon: '🏠' }
        }
    }

    const statusInfo = getStatusInfo(room.status)
    const typeInfo = getRoomTypeInfo(room.roomType)

    const handleStatusToggle = () => {
        const statuses = ['AVAILABLE', 'OCCUPIED', 'CLEANING', 'MAINTENANCE']
        const currentIndex = statuses.indexOf(room.status)
        const nextIndex = (currentIndex + 1) % statuses.length
        onStatusChange(room.id, statuses[nextIndex])
    }

    return (
        <div className={`border-2 rounded-lg p-3 transition-all duration-200 hover:shadow-lg cursor-pointer ${statusInfo.bgColor} min-w-0 max-w-xs`}>
            {/* 객실 번호 및 타입 */}
            <div className="flex justify-between items-start mb-2">
                <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-bold text-gray-800 truncate">{room.roomNumber}</h3>
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                        <span>{typeInfo.icon}</span>
                        <span className="truncate">{typeInfo.label}</span>
                    </div>
                </div>
                <button
                    onClick={(e) => {
                        e.stopPropagation()
                        onEdit(room)
                    }}
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                >
                    <Edit size={14} />
                </button>
            </div>

            {/* 상태 표시 및 토글 버튼 */}
            <div className="mb-2">
                <button
                    onClick={(e) => {
                        e.stopPropagation()
                        handleStatusToggle()
                    }}
                    className={`w-full py-1.5 px-2 rounded text-white text-sm font-medium transition-all duration-200 ${statusInfo.color} hover:opacity-90`}
                >
                    {statusInfo.label}
                </button>
            </div>

            {/* 객실 정보 */}
            <div className="space-y-1 text-xs text-gray-600">
                <div className="flex items-center gap-1">
                    <Users size={12} />
                    <span className="truncate">최대 {room.capacity}명</span>
                </div>
                <div className="flex items-center gap-1">
                    <span>💰</span>
                    <span className="truncate">₩{room.price?.toLocaleString()}</span>
                </div>
                {room.description && (
                    <div className="text-xs text-gray-500 mt-1 truncate">
                        {room.description}
                    </div>
                )}
            </div>
        </div>
    )
}

// 층별 객실 그룹 컴포넌트
const FloorSection = ({ floor, rooms, onStatusChange, onEdit }) => {
    return (
        <div className="mb-8">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-gray-200">
                <Home size={20} className="text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-800">{floor}층</h2>
                <span className="text-sm text-gray-500">({rooms.length}개 객실)</span>
            </div>
            <div className="room-grid">
                {rooms.map((room) => (
                    <RoomCard
                        key={room.id}
                        room={room}
                        onStatusChange={onStatusChange}
                        onEdit={onEdit}
                    />
                ))}
            </div>
        </div>
    )
}

// 통계 카드 컴포넌트
const StatCard = ({ title, count, total, color, icon: Icon }) => {
    const percentage = total > 0 ? Math.round((count / total) * 100) : 0

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-2xl font-bold text-gray-900">{count}</p>
                    <p className="text-xs text-gray-500">{percentage}%</p>
                </div>
                <Icon className={`h-8 w-8 ${color}`} />
            </div>
        </div>
    )
}

const RoomManagement = () => {
    const [rooms, setRooms] = useState([])
    const [filteredRooms, setFilteredRooms] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('ALL')
    const [typeFilter, setTypeFilter] = useState('ALL')
    const [showModal, setShowModal] = useState(false)
    const [editingRoom, setEditingRoom] = useState(null)
    const [formData, setFormData] = useState({
        roomNumber: '',
        roomType: 'SINGLE',
        price: '',
        capacity: '',
        status: 'AVAILABLE',
        description: ''
    })

    useEffect(() => {
        loadRooms()
    }, [])

    useEffect(() => {
        filterRooms()
    }, [rooms, searchTerm, statusFilter, typeFilter])

    const loadRooms = async () => {
        try {
            setLoading(true)
            // 실제 데이터가 없는 경우 더미 데이터 생성
            let response
            try {
                response = await roomService.getAllRoomsList()
            } catch (error) {
                // 더미 데이터 생성
                response = { data: generateDummyRooms() }
            }
            setRooms(response.data)
        } catch (error) {
            console.error('객실 목록 로드 실패:', error)
            // 에러 시에도 더미 데이터 사용
            setRooms(generateDummyRooms())
        } finally {
            setLoading(false)
        }
    }

    // 더미 데이터 생성 함수
    const generateDummyRooms = () => {
        const rooms = []
        const types = ['SINGLE', 'DOUBLE', 'DELUXE', 'SUITE']
        const statuses = ['AVAILABLE', 'OCCUPIED', 'CLEANING', 'MAINTENANCE']

        // 1~5층, 각 층마다 10개 객실
        for (let floor = 1; floor <= 5; floor++) {
            for (let roomNum = 1; roomNum <= 10; roomNum++) {
                const roomNumber = `${floor}${roomNum.toString().padStart(2, '0')}`
                const type = types[Math.floor(Math.random() * types.length)]
                const status = statuses[Math.floor(Math.random() * statuses.length)]

                rooms.push({
                    id: `room_${roomNumber}`,
                    roomNumber,
                    roomType: type,
                    price: type === 'SUITE' ? 300000 : type === 'DELUXE' ? 200000 : type === 'DOUBLE' ? 150000 : 100000,
                    capacity: type === 'SUITE' ? 4 : type === 'DELUXE' ? 3 : type === 'DOUBLE' ? 2 : 1,
                    status,
                    description: `${getTypeLabel(type)} 객실입니다.`,
                    floor
                })
            }
        }
        return rooms
    }

    const getTypeLabel = (type) => {
        switch (type) {
            case 'SINGLE': return '싱글'
            case 'DOUBLE': return '더블'
            case 'DELUXE': return '디럭스'
            case 'SUITE': return '스위트'
            default: return type
        }
    }

    const filterRooms = () => {
        let filtered = rooms

        if (searchTerm) {
            filtered = filtered.filter(room =>
                room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                room.description?.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        if (statusFilter !== 'ALL') {
            filtered = filtered.filter(room => room.status === statusFilter)
        }

        if (typeFilter !== 'ALL') {
            filtered = filtered.filter(room => room.roomType === typeFilter)
        }

        setFilteredRooms(filtered)
    }

    const handleStatusChange = async (roomId, newStatus) => {
        try {
            // 실제 API 호출
            // await roomService.updateRoomStatus(roomId, newStatus)

            // 임시로 로컬 상태 업데이트
            setRooms(prevRooms =>
                prevRooms.map(room =>
                    room.id === roomId ? { ...room, status: newStatus } : room
                )
            )
        } catch (error) {
            console.error('객실 상태 변경 실패:', error)
            alert('객실 상태 변경에 실패했습니다.')
        }
    }

    const handleEdit = (room) => {
        setEditingRoom(room)
        setFormData({
            roomNumber: room.roomNumber,
            roomType: room.roomType,
            price: room.price.toString(),
            capacity: room.capacity.toString(),
            status: room.status,
            description: room.description || ''
        })
        setShowModal(true)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const roomData = {
                ...formData,
                price: parseFloat(formData.price),
                capacity: parseInt(formData.capacity)
            }

            if (editingRoom) {
                // 수정
                setRooms(prevRooms =>
                    prevRooms.map(room =>
                        room.id === editingRoom.id ? { ...room, ...roomData } : room
                    )
                )
            } else {
                // 추가
                const newRoom = {
                    id: `room_${Date.now()}`,
                    ...roomData,
                    floor: Math.floor(parseInt(formData.roomNumber) / 100)
                }
                setRooms(prevRooms => [...prevRooms, newRoom])
            }

            setShowModal(false)
            resetForm()
        } catch (error) {
            console.error('객실 저장 실패:', error)
            alert('객실 저장에 실패했습니다.')
        }
    }

    const resetForm = () => {
        setFormData({
            roomNumber: '',
            roomType: 'SINGLE',
            price: '',
            capacity: '',
            status: 'AVAILABLE',
            description: ''
        })
        setEditingRoom(null)
    }

    // 층별로 객실 그룹화
    const groupRoomsByFloor = (rooms) => {
        const grouped = {}
        rooms.forEach(room => {
            const floor = Math.floor(parseInt(room.roomNumber) / 100) || 1
            if (!grouped[floor]) {
                grouped[floor] = []
            }
            grouped[floor].push(room)
        })

        // 층 번호 순으로 정렬
        const sortedFloors = Object.keys(grouped).sort((a, b) => parseInt(b) - parseInt(a))
        return sortedFloors.map(floor => ({
            floor: parseInt(floor),
            rooms: grouped[floor].sort((a, b) => a.roomNumber.localeCompare(b.roomNumber))
        }))
    }

    // 상태별 통계
    const getStatusStats = () => {
        const stats = filteredRooms.reduce((acc, room) => {
            acc[room.status] = (acc[room.status] || 0) + 1
            return acc
        }, {})

        return {
            total: filteredRooms.length,
            available: stats.AVAILABLE || 0,
            occupied: stats.OCCUPIED || 0,
            cleaning: stats.CLEANING || 0,
            maintenance: stats.MAINTENANCE || 0
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg text-gray-600">로딩 중...</div>
            </div>
        )
    }

    const floorGroups = groupRoomsByFloor(filteredRooms)
    const stats = getStatusStats()

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* 헤더 */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">객실 관리</h1>
                    <p className="text-gray-600 mt-1">호텔 객실 현황을 한눈에 확인하고 관리하세요</p>
                </div>
                <button
                    onClick={() => {
                        resetForm()
                        setEditingRoom(null)
                        setShowModal(true)
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
                >
                    <Plus size={20} />
                    객실 추가
                </button>
            </div>

            {/* 통계 카드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                <StatCard
                    title="전체 객실"
                    count={stats.total}
                    total={stats.total}
                    color="text-blue-600"
                    icon={Home}
                />
                <StatCard
                    title="이용가능"
                    count={stats.available}
                    total={stats.total}
                    color="text-green-600"
                    icon={BarChart3}
                />
                <StatCard
                    title="투숙중"
                    count={stats.occupied}
                    total={stats.total}
                    color="text-red-600"
                    icon={Users}
                />
                <StatCard
                    title="청소중"
                    count={stats.cleaning}
                    total={stats.total}
                    color="text-blue-600"
                    icon={BarChart3}
                />
                <StatCard
                    title="정비중"
                    count={stats.maintenance}
                    total={stats.total}
                    color="text-yellow-600"
                    icon={BarChart3}
                />
            </div>

            {/* 필터 섹션 */}
            <div className="bg-white p-4 rounded-lg shadow mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="객실 번호 검색..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="ALL">모든 상태</option>
                        <option value="AVAILABLE">이용가능</option>
                        <option value="OCCUPIED">투숙중</option>
                        <option value="CLEANING">청소중</option>
                        <option value="MAINTENANCE">정비중</option>
                    </select>

                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="ALL">모든 타입</option>
                        <option value="SINGLE">싱글</option>
                        <option value="DOUBLE">더블</option>
                        <option value="DELUXE">디럭스</option>
                        <option value="SUITE">스위트</option>
                    </select>

                    <div className="text-sm text-gray-600 flex items-center">
                        총 {stats.total}개 객실
                    </div>
                </div>
            </div>

            {/* 객실 목록 - 층별 표시 */}
            <div className="space-y-6">
                {floorGroups.map(({ floor, rooms }) => (
                    <FloorSection
                        key={floor}
                        floor={floor}
                        rooms={rooms}
                        onStatusChange={handleStatusChange}
                        onEdit={handleEdit}
                    />
                ))}
            </div>

            {/* 객실 추가/편집 모달 */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                        <h2 className="text-xl font-bold mb-4">
                            {editingRoom ? '객실 편집' : '객실 추가'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    객실 번호
                                </label>
                                <input
                                    type="text"
                                    value={formData.roomNumber}
                                    onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    객실 타입
                                </label>
                                <select
                                    value={formData.roomType}
                                    onChange={(e) => setFormData({ ...formData, roomType: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="SINGLE">싱글</option>
                                    <option value="DOUBLE">더블</option>
                                    <option value="DELUXE">디럭스</option>
                                    <option value="SUITE">스위트</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    가격 (원/박)
                                </label>
                                <input
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    수용 인원
                                </label>
                                <input
                                    type="number"
                                    value={formData.capacity}
                                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    상태
                                </label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="AVAILABLE">이용가능</option>
                                    <option value="OCCUPIED">투숙중</option>
                                    <option value="CLEANING">청소중</option>
                                    <option value="MAINTENANCE">정비중</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    설명
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    rows="3"
                                />
                            </div>

                            <div className="flex gap-2 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    {editingRoom ? '수정' : '추가'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
                                >
                                    취소
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default RoomManagement
