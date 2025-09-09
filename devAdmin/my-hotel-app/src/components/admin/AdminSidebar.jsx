import { NavLink } from 'react-router-dom'
import {
  Home,
  Calendar,
  Bed,
  Users,
  BarChart3
} from 'lucide-react'

const Sidebar = () => {
  const navItems = [
    { path: '/admin/dashboard', label: '대시보드', icon: Home },
    { path: '/admin/reservations', label: '예약 관리', icon: Calendar },
    { path: '/admin/rooms', label: '객실 관리', icon: Bed },
    { path: '/admin/guests', label: '고객 관리', icon: Users },
    { path: '/admin/reports', label: '리포트', icon: BarChart3 },
  ]

  return (
    <aside className="sidebar">
      <nav>
        {navItems.map((item) => {
          const IconComponent = item.icon
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `nav-item ${isActive ? 'active' : ''}`
              }
            >
              <IconComponent size={20} />
              {item.label}
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}

export default Sidebar
