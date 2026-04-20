import { useEffect, useState } from "react";
import API from "../api/axios";
import { FaUserMd } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";
import { FaTimes } from "react-icons/fa";



type AppointmentItem = {
  id: number;
  patientId: number | string;
  date: string;
  time: string;
  status: "Pending" | "Accepted" | "Rejected" | "Completed";
  Patient?:{
    name:string;
    email:string
  }
};

type DashboardData = {
  stats: {
    pending: number;
    completed: number;
    rejected: number;
    earnings: number;
    patients?: number;
    appointments?: number;
  };
  appointments: AppointmentItem[];
};

export const DoctorDashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await API.get("/appointments/doctor/dashboard");
      setData(res.data);
    } catch (error: any) {
      showToast(
        error.response?.data?.message || "Failed to load dashboard",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      setActionLoadingId(id);
      await API.patch(`/appointments/${id}/status`, { status });
      showToast(`Appointment ${status.toLowerCase()} successfully`, "success");
      await fetchDashboard();
    } catch (error: any) {
      showToast(
        error.response?.data?.message || "Failed to update appointment",
        "error"
      );
    } finally {
      setActionLoadingId(null);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const getStatusBadge = (status: AppointmentItem["status"]) => {
    switch (status) {
      case "Pending":
        return (
          <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
            Pending
          </span>
        );
      case "Accepted":
        return (
          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
            Accepted
          </span>
        );
      case "Rejected":
        return (
          <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
            Rejected
          </span>
        );
      case "Completed":
        return (
          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
            Completed
          </span>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <p className="text-lg font-medium text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <p className="text-lg font-medium text-red-500">No dashboard data found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f7fb] p-4 sm:p-6 mt-5 rounded-lg">
      {toast && (
        <div className="fixed left-1/2 top-6 z-50 -translate-x-1/2">
          <div
            className={`rounded-lg px-5 py-3 text-sm font-medium text-white shadow-lg ${toast.type === "success" ? "bg-green-500" : "bg-red-500"
              }`}
          >
            {toast.message}
          </div>
        </div>
      )}

      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Doctor Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage appointments and track your activity
          </p>
        </div>

        {/* Top cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-400 text-2xl">
                <FaUserMd/>
              </div>
              <div>
                <p className="text-2xl font-bold ml-5 text-yellow-500">
                  {data.stats.pending}
                </p>
                <p className="text-sm font-medium text-yellow-500">Pending</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-2xl">
                <FaCheck color="green"/>
              </div>
              <div>
                <p className="text-2xl font-bold ml-5 text-green-500">
                  {data.stats.completed}
                </p>
                <p className="text-sm font-medium text-green-500">Completed</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 text-2xl">
                <FaTimes color="red"/>
              </div>
              <div>
                <p className="text-2xl font-bold ml-4  text-red-500">
                  {data.stats.rejected}
                </p>
                <p className="text-sm font-medium text-red-500">Rejected</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-2xl">
                ₹
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">
                  ₹{data.stats.earnings}
                </p>
                <p className="text-sm font-medium text-primary">Earnings</p>
              </div>
            </div>
          </div>
        </div>

        {/* Latest appointments */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-5 py-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Latest Appointments
            </h2>
          </div>

          <div className="p-4 sm:p-5">
            {data.appointments.length === 0 ? (
              <p className="py-8 text-center text-sm text-gray-500">
                No appointments found
              </p>
            ) : (
              <div className="space-y-4">
                {data.appointments.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-600">
                        P
                      </div>

                      <div>
                        <p className=" text-sm text-gray-500">
                          <span className="text-sm text-gray-800 font-medium">Patient ID:</span> {item.patientId}
                        </p>
                         <p className="text-sm text-gray-500">
                           <span className="text-sm text-gray-800 font-medium">Patient Name:</span> {item.Patient?.name}
                        </p>
                         <p className="text-sm text-gray-500">
                          <span className="text-sm text-gray-800 font-medium">Patient Email:</span> {item.Patient?.email}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          Booking on {item.date} at {item.time}
                        </p>
                        <div className="mt-2">{getStatusBadge(item.status)}</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {item.status === "Pending" ? (
                        <>
                          <button
                            onClick={() => updateStatus(item.id, "Accepted")}
                            disabled={actionLoadingId === item.id}
                            className="rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {actionLoadingId === item.id ? "Please wait..." : "Accept"}
                          </button>

                          <button
                            onClick={() => updateStatus(item.id, "Rejected")}
                            disabled={actionLoadingId === item.id}
                            className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {actionLoadingId === item.id ? "Please wait..." : "Reject"}
                          </button>
                        </>
                      ) : item.status === "Accepted" ? (
                        <button
                          onClick={() => updateStatus(item.id, "Completed")}
                          disabled={actionLoadingId === item.id}
                          className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {actionLoadingId === item.id ? "Please wait..." : "Mark Completed"}
                        </button>
                      ) : (
                        <p className="text-sm font-medium text-gray-500">
                          No action available
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};