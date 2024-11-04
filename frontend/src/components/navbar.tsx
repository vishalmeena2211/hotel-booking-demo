import { NavLink, useLocation } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Hotel, LogIn, LogOut, UserPlus } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '@/redux/Slices/authSlice'
import { RootState } from '@/redux/Store'

export default function Navbar() {

  const { isLoggedIn } = useSelector((state: RootState) => state.auth)
  const { user } = useSelector((state: RootState) => state.profile)
  const dispatch = useDispatch();
  const location = useLocation();
  const pathname = location.pathname
  console.log(pathname)


  return (
    <header className="sticky md:px-10 px-2 top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <NavLink to="/" className="mr-6 flex items-center space-x-2">
          <Hotel className="h-6 w-6" />
          <span className="hidden font-bold sm:inline-block">Hotel Booking</span>
        </NavLink>
        <div className="flex flex-1 items-center justify-end space-x-2">
          {isLoggedIn ? (
            <>

              {user.user.role === "USER" && <NavLink to={pathname === "/hotel-booking" ? "/get-booking" : "/hotel-booking"}>
                <Button variant="ghost">
                  {pathname !== "/hotel-booking" ? "Book Hotel" : "Hotel Bookings"}
                </Button>
              </NavLink>}
              <Button variant="ghost" onClick={() => {
                dispatch(logout());
              }}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <NavLink to="/login">
                <Button variant="ghost" >
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </Button>
              </NavLink>
              <NavLink to="/signup" >
                <Button>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Sign Up
                </Button>
              </NavLink>
            </>
          )}
        </div>
      </div>
    </header >
  )
}
