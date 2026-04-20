import { useEffect, useState } from "react";
import API from "../api/axios";
import {
  FaUser,
  FaEnvelope,
  FaUserTag,
  FaCalendarCheck,
} from "react-icons/fa";
import { HiOutlineHand, HiOutlineUser } from "react-icons/hi";

type UserType = {
  id?: number;
  name?: string;
  email?: string;
  role?: string;
};

export const MyProfile = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [totalAppointments, setTotalAppointments] = useState<number>(0);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    setUser(storedUser ? JSON.parse(storedUser) : null);

    fetchCount();
  }, []);

  const fetchCount = async () => {
    try {
      const res = await API.get("/appointments/my/count");
      setTotalAppointments(res.data.totalAppointments);
    } catch (err) {
      console.log("Count fetch error", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-4xl rounded-3xl bg-white p-6 shadow-md sm:p-8">

        {/* Top Section */}
        <div className="flex flex-col items-center gap-4 border-b border-gray-200 pb-8 text-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-100">
            <FaUser className="text-4xl text-blue-600" />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex gap-1 justify-center items-center">
              Welcome, <span className="text-primary">{user?.name || "Patient"}</span> <HiOutlineHand color="green"/>
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Manage your profile and appointments easily
            </p>
          </div>
        </div>

        {/* Info Cards */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2">

          {/* Name */}
          <div className="rounded-2xl border bg-gray-50 p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-3">
              <FaUser className="text-blue-600" />
              <p className="text-sm text-gray-500">Full Name</p>
            </div>
            <p className="text-lg font-semibold text-gray-800">
              {user?.name || "-"}
            </p>
          </div>

          {/* Email */}
          <div className="rounded-2xl border bg-gray-50 p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-3">
              <FaEnvelope className="text-green-600" />
              <p className="text-sm text-gray-500">Email</p>
            </div>
            <p className="text-lg font-semibold text-gray-800 break-all">
              {user?.email || "-"}
            </p>
          </div>

          {/* Role */}
          <div className="rounded-2xl border bg-gray-50 p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-3">
              <FaUserTag className="text-purple-600" />
              <p className="text-sm text-gray-500">Role</p>
            </div>
            <p className="text-lg font-semibold capitalize text-gray-800">
              {user?.role || "-"}
            </p>
          </div>

          {/* Appointment Count (REPLACED USER ID) */}
          <div className="rounded-2xl border bg-gray-50 p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-3">
              <FaCalendarCheck className="text-red-500" />
              <p className="text-sm text-gray-500">
                Total Appointments
              </p>
            </div>
            <p className="text-lg font-semibold text-gray-800">
              {totalAppointments}
            </p>
          </div>
        </div>

        {/* Extra Section */}
        <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Account Summary
          </h2>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-white p-4 shadow-sm">
              <p className="text-sm text-gray-500">Account Status</p>
              <p className="mt-1 font-semibold text-green-600">Active</p>
            </div>

            <div className="rounded-xl bg-white p-4 shadow-sm">
              <p className="text-sm text-gray-500">Profile Type</p>
              <p className="mt-1 font-semibold text-gray-800">
                Patient
              </p>
            </div>

            <div className="rounded-xl bg-white p-4 shadow-sm">
              <p className="text-sm text-gray-500">Appointments</p>
              <p className="mt-1 font-semibold text-blue-600">
                {totalAppointments}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};