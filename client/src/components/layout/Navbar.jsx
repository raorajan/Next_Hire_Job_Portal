import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FiMenu, FiX } from "react-icons/fi";
import { FaBell, FaBriefcase } from "react-icons/fa";
import { toast } from "react-toastify";
import { RiMenu2Fill } from "react-icons/ri";
import { getProfilePic, getToken } from "@/utils/constant";
import { FaUser, FaCog, FaShieldAlt, FaSignOutAlt, FaBook, FaStar } from "react-icons/fa";
import { logoutUser } from "@/redux/slices/user.slice";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const Navbar = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { user } = useSelector((state) => state.user);
  const isActive = (path) => location.pathname === path;
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const token = getToken();
  const profilePic = getProfilePic();
  const navigate = useNavigate();

  // Toggle dropdown visibility
  const toggleDropdown = () => setIsDropDownOpen((prev) => !prev);

  // Toggle mobile menu visibility
  const toggleMenu = () => setIsOpen((prev) => !prev);

  // Close dropdown if click is outside
  const closeDropdown = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsDropDownOpen(false);
    }
  };

  // Close mobile menu if click is outside
  const closeMobileMenu = (e) => {
    if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", closeDropdown);
    if (isOpen) {
      document.addEventListener("mousedown", closeMobileMenu);
    }
    return () => {
      document.removeEventListener("mousedown", closeDropdown);
      document.removeEventListener("mousedown", closeMobileMenu);
    };
  }, [isOpen]);

  // Logout logic
  const handleLogOut = async () => {
    setIsLoading(true);
    try {
      const res = await dispatch(logoutUser());
      if (res?.payload?.status === 200) {
        toast.success("Successfully logged out!");
        navigate("/login");
      } else {
        toast.error(
          `Logout failed: ${res?.payload?.message || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error(`Error during logout: ${error?.message || "Unknown error"}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Close dropdown when navigating
  const handleLinkClick = () => {
    setIsDropDownOpen(false);
    setIsOpen(false);
  };

  return (
    <div className='bg-background/90 backdrop-blur-md shadow-lg border-b border-border w-full fixed top-0 left-0 z-50 transition-all duration-300'>
      <div className='bg-transparent w-11/12 m-auto'>
        <div className='flex items-center justify-between mx-auto max-w-7xl h-16 px-4 lg:px-0'>
          <h1 className='text-2xl font-bold text-foreground flex items-center group'>
            <Link to='/' className='flex items-center group-hover:scale-105 transition-transform duration-200'>
              <img
                src='/favicon.svg'
                alt='NextHire Logo'
                className='h-8 mr-2 drop-shadow-sm'
              />
              <span className='bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent'>
                Next<span className='text-primary font-extrabold'>Hire</span>
              </span>
            </Link>
          </h1>

          {/* Hamburger Menu for Mobile */}
          <div className='md:hidden'>
            <button 
              onClick={toggleMenu} 
              className='text-2xl text-foreground hover:text-primary transition-colors duration-200 p-2 rounded-lg hover:bg-muted'
            >
              {isOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>

          {/* Desktop Menu */}
          <div className='hidden md:flex items-center gap-12'>
            <ul className='flex items-center gap-8 font-medium text-muted-foreground'>
              {user?.role === "recruiter" ? (
                <>
                  <li>
                    <Link
                      to='/'
                      className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                        isActive("/")
                          ? "bg-primary/10 text-primary font-semibold shadow-sm shadow-neon"
                          : "hover:text-primary hover:bg-muted"
                      }`}
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      to='/profile/admin/companies'
                      className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                        isActive("/profile/admin/companies")
                          ? "bg-primary/10 text-primary font-semibold shadow-sm shadow-neon"
                          : "hover:text-primary hover:bg-muted"
                      }`}
                    >
                      Active Registry
                    </Link>
                  </li>
                  <li>
                    <Link
                      to='/profile/admin/candidates'
                      className={`px-4 py-2 rounded-lg transition-all duration-200 font-extrabold ${
                        isActive("/profile/admin/candidates")
                          ? "bg-[#00C8FF]/10 text-[#00C8FF] shadow-sm shadow-[0_0_15px_rgba(0,200,255,0.25)]"
                          : "hover:text-[#00C8FF] hover:bg-[#00C8FF]/5"
                      }`}
                    >
                      Talent Radar
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link
                      to='/'
                      className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                        isActive("/")
                          ? "bg-primary/10 text-primary font-semibold shadow-sm shadow-neon"
                          : "hover:text-primary hover:bg-muted"
                      }`}
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      to='/jobs'
                      className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                        isActive("/jobs")
                          ? "bg-primary/10 text-primary font-semibold shadow-sm shadow-neon"
                          : "hover:text-primary hover:bg-muted"
                      }`}
                    >
                      Jobs
                    </Link>
                  </li>
                  <li>
                    <Link
                      to='/resources'
                      className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                        isActive("/resources")
                          ? "bg-primary/10 text-primary font-semibold shadow-sm shadow-neon"
                          : "hover:text-primary hover:bg-muted"
                      }`}
                    >
                      Resources
                    </Link>
                  </li>
                  <li>
                    <Link
                      to='/other-jobs'
                      className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                        isActive("/other-jobs")
                          ? "bg-primary/10 text-primary font-semibold shadow-sm shadow-neon"
                          : "hover:text-primary hover:bg-muted"
                      }`}
                    >
                      Other Jobs
                    </Link>
                  </li>
                </>
              )}
            </ul>

            {/* Post Job Button for Recruiters */}
            {token && user?.role === "recruiter" && (
              <Link to="/profile/admin/jobs/create">
                <Button className='bg-primary hover:bg-primary/80 text-primary-foreground transition-all duration-200 shadow-md shadow-neon transform hover:scale-105'>
                  <FaBriefcase className='mr-2' />
                  Post Job
                </Button>
              </Link>
            )}

            {/* User Profile Dropdown */}
            {token ? (
              <div className='relative inline-block' ref={dropdownRef}>
                <div
                  className='py-2 flex items-center px-3 border border-white/10 rounded-full cursor-pointer hover:bg-white/5 hover:border-[#00C8FF]/30 transition-all duration-200 shadow-sm'
                  onClick={toggleDropdown}
                >
                  <RiMenu2Fill className='text-white/60' />
                  <Avatar className='w-7 h-7 ring-2 ring-white/10 shadow-sm ml-3'>
                    <AvatarImage src={profilePic} alt='Profile' />
                    <AvatarFallback className="bg-gradient-to-br from-[#6A38C2]/20 to-[#F83002]/20 text-[#6A38C2] text-xs font-bold">
                      {user?.fullname ? user.fullname.charAt(0).toUpperCase() : "U"}
                    </AvatarFallback>
                  </Avatar>
                </div>

                {/* Dropdown Menu */}
                {isDropDownOpen && (
                  <div className='absolute right-0 mt-3 w-56 bg-background/95 backdrop-blur-md border border-border rounded-xl shadow-xl z-10 animate-in slide-in-from-top-2 duration-200'>
                    {/* User Info */}
                    {user && (
                      <div className='px-4 py-3 border-b border-border'>
                        <p className='font-semibold text-foreground truncate'>{user.fullname}</p>
                        <p className='text-xs text-muted-foreground truncate'>{user.email}</p>
                      </div>
                    )}
                    <ul className='py-2'>
                      <li className='flex items-center w-11/12 m-auto rounded-lg px-4 py-3 hover:bg-muted cursor-pointer transition-colors duration-150'>
                        <Link
                          to='/profile'
                          onClick={handleLinkClick}
                          className='flex items-center w-full text-foreground hover:text-primary'
                        >
                          <FaUser className='mr-3 text-sm text-muted-foreground' /> Profile
                        </Link>
                      </li>
                      {user?.role === "recruiter" && (
                        <li className='flex items-center w-11/12 m-auto rounded-lg px-4 py-3 hover:bg-muted cursor-pointer transition-colors duration-150'>
                          <Link
                            to='/profile/admin/candidates'
                            onClick={handleLinkClick}
                            className='flex items-center w-full text-[#00C8FF] hover:text-[#00E5FF] font-black'
                          >
                            <FaStar className='mr-3 text-sm text-[#00C8FF]' /> Talent Radar
                          </Link>
                        </li>
                      )}
                      <li className='flex items-center w-11/12 m-auto rounded-lg px-4 py-3 hover:bg-muted cursor-pointer transition-colors duration-150'>
                        <Link
                          to='/settings?page=settings'
                          onClick={handleLinkClick}
                          className='flex items-center w-full text-foreground hover:text-primary'
                        >
                          <FaCog className='mr-3 text-sm text-muted-foreground' /> Settings
                        </Link>
                      </li>
                      <li className='flex items-center w-11/12 m-auto rounded-lg px-4 py-3 hover:bg-muted cursor-pointer transition-colors duration-150'>
                        <Link
                          to='/settings?page=privacy'
                          onClick={handleLinkClick}
                          className='flex items-center w-full text-foreground hover:text-primary'
                        >
                          <FaShieldAlt className='mr-3 text-sm text-muted-foreground' /> Privacy
                        </Link>
                      </li>
                      <li className='flex items-center w-11/12 m-auto rounded-lg px-4 py-3 hover:bg-muted cursor-pointer transition-colors duration-150'>
                        <Link
                          to='/settings?page=notifications'
                          onClick={handleLinkClick}
                          className='flex items-center w-full text-foreground hover:text-primary'
                        >
                          <FaBell className='mr-3 text-sm text-muted-foreground' /> Notifications
                        </Link>
                      </li>
                      <div className='border-t border-border my-2'></div>
                      <li
                        onClick={handleLogOut}
                        className='flex items-center w-11/12 m-auto rounded-lg px-4 py-3 hover:bg-destructive/10 cursor-pointer transition-colors duration-150'
                      >
                        <div className='flex items-center w-full text-foreground hover:text-destructive'>
                          <FaSignOutAlt className='mr-3 text-sm text-muted-foreground' /> Logout
                        </div>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className='flex items-center gap-3'>
                <Link to='/login'>
                  <Button
                    variant='outline'
                    className='text-foreground hover:text-primary hover:bg-primary/10 border-border hover:border-primary transition-all duration-200 shadow-sm'
                  >
                    Login
                  </Button>
                </Link>
                <Link to='/signup'>
                  <Button className='bg-primary hover:bg-primary/80 text-primary-foreground transition-all duration-200 shadow-neon transform hover:scale-105'>
                    Signup
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu (Slide out) */}
        {isOpen && (
          <div ref={mobileMenuRef} className='md:hidden bg-background/95 backdrop-blur-md shadow-lg border-t border-border animate-in slide-in-from-top-2 duration-300'>
            <ul className='flex flex-col gap-2 p-6'>
              {user?.role === "recruiter" ? (
                <>
                  <li>
                    <Link
                      to='/'
                      onClick={handleLinkClick}
                      className={`block px-4 py-2 rounded-lg transition-all duration-200 font-medium ${
                        isActive("/")
                          ? "bg-primary/10 text-primary font-bold shadow-neon"
                          : "text-foreground hover:text-primary hover:bg-muted"
                      }`}
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      to='/profile/admin/companies'
                      onClick={handleLinkClick}
                      className={`block px-4 py-2 rounded-lg transition-all duration-200 font-medium ${
                        isActive("/profile/admin/companies")
                          ? "bg-primary/10 text-primary font-bold shadow-neon"
                          : "text-foreground hover:text-primary hover:bg-muted"
                      }`}
                    >
                      Active Registry
                    </Link>
                  </li>
                  <li>
                    <Link
                      to='/profile/admin/candidates'
                      onClick={handleLinkClick}
                      className={`block px-4 py-2 rounded-lg transition-all duration-200 font-extrabold ${
                        isActive("/profile/admin/candidates")
                          ? "bg-[#00C8FF]/10 text-[#00C8FF] shadow-[0_0_15px_rgba(0,200,255,0.25)]"
                          : "text-[#00C8FF] hover:text-[#00E5FF] hover:bg-[#00C8FF]/5"
                      }`}
                    >
                      Talent Radar
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link
                      to='/'
                      onClick={handleLinkClick}
                      className={`block px-4 py-2 rounded-lg transition-all duration-200 font-medium ${
                        isActive("/")
                          ? "bg-primary/10 text-primary"
                          : "text-foreground hover:text-primary hover:bg-muted"
                      }`}
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      to='/jobs'
                      onClick={handleLinkClick}
                      className={`block px-4 py-2 rounded-lg transition-all duration-200 font-medium ${
                        isActive("/jobs")
                          ? "bg-primary/10 text-primary"
                          : "text-foreground hover:text-primary hover:bg-muted"
                      }`}
                    >
                      Jobs
                    </Link>
                  </li>
                  <li>
                    <Link
                      to='/resources'
                      onClick={handleLinkClick}
                      className={`block px-4 py-2 rounded-lg transition-all duration-200 font-medium ${
                        isActive("/resources")
                          ? "bg-primary/10 text-primary"
                          : "text-foreground hover:text-primary hover:bg-muted"
                      }`}
                    >
                      Resources
                    </Link>
                  </li>
                  <li>
                    <Link
                      to='/other-jobs'
                      onClick={handleLinkClick}
                      className={`block px-4 py-2 rounded-lg transition-all duration-200 font-medium ${
                        isActive("/other-jobs")
                          ? "bg-primary/10 text-primary"
                          : "text-foreground hover:text-primary hover:bg-muted"
                      }`}
                    >
                      Other Jobs
                    </Link>
                  </li>
                </>
              )}

              {/* User Section for Mobile */}
              {token ? (
                <>
                  <div className='border-t border-border w-full my-2'></div>
                  {user && (
                    <li className='px-4 py-2'>
                      <div className='flex items-center gap-3'>
                        <Avatar className='w-10 h-10 ring-2 ring-white shadow-sm'>
                          <AvatarImage src={profilePic} alt='Profile' />
                          <AvatarFallback className="bg-gradient-to-br from-[#6A38C2]/20 to-[#F83002]/20 text-[#6A38C2] font-bold">
                            {user?.fullname ? user.fullname.charAt(0).toUpperCase() : "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className='flex-1 min-w-0'>
                          <p className='font-semibold text-foreground truncate text-sm'>{user.fullname}</p>
                          <p className='text-xs text-muted-foreground truncate'>{user.email}</p>
                        </div>
                      </div>
                    </li>
                  )}
                  {user?.role === "recruiter" && (
                    <>
                      <li>
                        <Link
                          to="/profile/admin/jobs/create"
                          onClick={handleLinkClick}
                          className='block px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/80 transition-all duration-200 text-center shadow-neon'
                        >
                          <FaBriefcase className='inline mr-2' />
                          Post Job
                        </Link>
                      </li>
                      <div className='border-t border-border w-full my-2'></div>
                      <li className='text-xs font-semibold text-muted-foreground px-4 py-2 uppercase'>
                        Admin Panel
                      </li>
                      <li>
                        <Link
                          to="/profile/admin/candidates"
                          onClick={handleLinkClick}
                          className='flex items-center text-[#00C8FF] hover:text-[#00E5FF] px-4 py-2 rounded-lg hover:bg-muted transition-all duration-200 font-extrabold'
                        >
                          <FaStar className='mr-3 text-sm text-[#00C8FF]' /> Talent Radar
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/profile/admin/prep-resources"
                          onClick={handleLinkClick}
                          className='flex items-center text-foreground hover:text-primary px-4 py-2 rounded-lg hover:bg-muted transition-all duration-200 font-medium'
                        >
                          <FaBook className='mr-3 text-sm text-muted-foreground' /> Prep Resources
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/profile/admin/highlights"
                          onClick={handleLinkClick}
                          className='flex items-center text-foreground hover:text-primary px-4 py-2 rounded-lg hover:bg-muted transition-all duration-200 font-medium'
                        >
                          <FaStar className='mr-3 text-sm text-muted-foreground' /> Highlights
                        </Link>
                      </li>
                      <div className='border-t border-border w-full my-2'></div>
                    </>
                  )}
                  <li>
                    <Link
                      to='/profile'
                      onClick={handleLinkClick}
                      className='flex items-center text-foreground hover:text-primary px-4 py-2 rounded-lg hover:bg-muted transition-all duration-200 font-medium'
                    >
                      <FaUser className='mr-3 text-sm text-muted-foreground' /> Profile
                    </Link>
                  </li>
                  <li>
                    <Link
                      to='/settings?page=settings'
                      onClick={handleLinkClick}
                      className='flex items-center text-foreground hover:text-primary px-4 py-2 rounded-lg hover:bg-muted transition-all duration-200 font-medium'
                    >
                      <FaCog className='mr-3 text-sm text-muted-foreground' /> Settings
                    </Link>
                  </li>
                  <div className='border-t border-border w-full my-2'></div>
                  <li
                    onClick={handleLogOut}
                    className='flex items-center text-foreground hover:text-destructive px-4 py-2 rounded-lg hover:bg-destructive/10 transition-all duration-200 font-medium cursor-pointer'
                  >
                    <FaSignOutAlt className='mr-3 text-sm text-muted-foreground' /> Logout
                  </li>
                </>
              ) : (
                <>
                  <div className='border-t border-border w-full my-2'></div>
                  <li>
                    <Link
                      to='/login'
                      onClick={handleLinkClick}
                      className='block text-foreground border border-border hover:border-primary hover:text-primary px-4 py-2 rounded-lg hover:bg-primary/10 transition-all duration-200 font-medium text-center'
                    >
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link
                      to='/signup'
                      onClick={handleLinkClick}
                      className='block bg-primary text-primary-foreground font-medium hover:bg-primary/80 px-4 py-2 rounded-lg transition-all duration-200 text-center shadow-neon'
                    >
                      Signup
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
