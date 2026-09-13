import { NavLink } from 'react-router-dom'

function Navbar() {
  return (
    <header className="navbar">

      <h1 className="logo">
        ServiceHub
      </h1>

      <nav>

        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive
              ? 'nav-link active'
              : 'nav-link'
          }
        >
          Home
        </NavLink>


        <NavLink
          to="/categories"
          className={({ isActive }) =>
            isActive
              ? 'nav-link active'
              : 'nav-link'
          }
        >
          Categories
        </NavLink>


        <NavLink
          to="/my-bookings"
          className={({ isActive }) =>
            isActive
              ? 'nav-link active'
              : 'nav-link'
          }
        >
          My Bookings
        </NavLink>


        <NavLink
          to="/merchant-dashboard"
          className={({ isActive }) =>
            isActive
              ? 'nav-link active'
              : 'nav-link'
          }
        >
          Merchant Dashboard
        </NavLink>


        <NavLink
          to="/admin-dashboard"
          className={({ isActive }) =>
            isActive
              ? 'nav-link active'
              : 'nav-link'
          }
        >
          Admin Dashboard
        </NavLink>


        <NavLink
          to="/login"
          className={({ isActive }) =>
            isActive
              ? 'nav-link active'
              : 'nav-link'
          }
        >
          Login
        </NavLink>


        <NavLink
          to="/register"
          className={({ isActive }) =>
            isActive
              ? 'nav-link active'
              : 'nav-link'
          }
        >
          Register
        </NavLink>

      </nav>

    </header>
  )
}

export default Navbar