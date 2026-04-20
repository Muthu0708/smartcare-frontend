import { NavLink, useNavigate } from "react-router-dom";
import logo from "../../assets/Logo.png";
import dropdown from "../../assets/dropdown_icon.svg";
import { useEffect, useState } from "react";
import { logoutUser } from "../../api/auth";
import { FaUser } from "react-icons/fa";

type UserType = {
  id?: number;
  name?: string;
  email?: string;
  role?: string;
  image?: string;
};

export const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    const loadUser = () => {
      const storedUser = localStorage.getItem("user");
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };

    loadUser();
    window.addEventListener("storage", loadUser);

    return () => {
      window.removeEventListener("storage", loadUser);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.log("Logout failed");
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    window.dispatchEvent(new Event("storage"));
    navigate("/login");
  };

  const isDoctor = user?.role?.toLowerCase() === "doctor";

  const profileImage =
    isDoctor && user?.image
      ? user.image.startsWith("http")
        ? user.image
        : `${import.meta.env.VITE_API_URL.replace("/api", "")}${user.image}`
      : "";

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `relative py-1 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:transition-all after:duration-300 ${
      isActive
        ? "after:w-full after:bg-primary"
        : "after:w-0 after:bg-primary hover:after:w-full"
    }`;

  return (
    <div className="flex items-center justify-between border-b border-gray-300 py-3 text-sm">
      <img
        onClick={() => {
          if (!user) {
            navigate("/login");
          } else if (isDoctor) {
            navigate("/doctor-dashboard");
          } else {
            navigate("/");
          }
        }}
        src={logo}
        alt="logo"
        className="w-[120px] cursor-pointer"
      />

      {!isDoctor && (
        <ul className="hidden items-start gap-5 font-semibold md:flex">
          <NavLink to="/" className={linkClass}>HOME</NavLink>
          <NavLink to="/doctors" className={linkClass}>ALL DOCTORS</NavLink>
          <NavLink to="/about" className={linkClass}>ABOUT</NavLink>
          <NavLink to="/contact" className={linkClass}>CONTACT</NavLink>
          <NavLink to="/my-appointments" className={linkClass}>
            MY APPOINTMENTS
          </NavLink>
        </ul>
      )}

      <div className="flex items-center gap-4">
        {user ? (
          <div className="group relative cursor-pointer">
            <div className="flex items-center gap-2">
              {profileImage ? (
                <img
                  className="h-10 w-10 rounded-full border border-gray-200 object-cover"
                  src={profileImage}
                  alt="profile"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
                  <FaUser className="text-gray-600" size={18} />
                </div>
              )}

              <img className="w-2.5" src={dropdown} alt="dropdown" />
            </div>

            <div className="absolute right-0 top-0 z-20 hidden pt-14 group-hover:block">
              <div className="flex min-w-56 flex-col gap-3 rounded-xl bg-white p-4 text-gray-600 shadow-lg">
                <div className="border-b pb-2">
                  <p className="font-semibold text-gray-800">
                    {user.name || "User"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user.email || "No email"}
                  </p>
                </div>

                <p
                  onClick={() =>
                    isDoctor
                      ? navigate("/doctor-profile")
                      : navigate("/my-profile")
                  }
                  className="cursor-pointer hover:text-black"
                >
                  My Profile
                </p>

                <p
                  onClick={handleLogout}
                  className="cursor-pointer hover:text-red-500"
                >
                  Logout
                </p>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="hidden rounded-full bg-primary px-8 py-2 text-white md:block"
          >
            Create Account
          </button>
        )}
      </div>
    </div>
  );
};