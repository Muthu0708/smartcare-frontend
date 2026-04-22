import { useEffect, useState } from "react";
import API from "../api/axios";

type Appointment = {
  id: number;
  doctorId: number;
  patientId: number;
  date: string;
  time: string;
  status: "Pending" | "Accepted" | "Rejected" | "Completed";
  Doctor?: {
    name: string;
    image?: string;
    specialization?: string;
    address?: string;
  };
};

export const MyAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchAppointments = async () => {
    try {
      const res = await API.get("/appointments");
      console.log("Appointments:", res.data);
      setAppointments(res.data || []);
      console.log(res.data);
      console.log(res.data[0]?.Doctor?.image);
    } catch (error: any) {
      showToast(
        error.response?.data?.message || "Failed to load appointments",
        "error"
      );
    }
  };

  const cancelAppointment = async (id: number) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to cancel this appointment?"
    );

    if (!isConfirmed) return;

    try {
      await API.delete(`/appointments/${id}`);
      showToast("Appointment cancelled successfully", "success");
      fetchAppointments();
    } catch (error: any) {
      showToast(
        error.response?.data?.message || "Failed to cancel appointment",
        "error"
      );
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <div>
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

      <p className="mt-12 border-b pb-3 font-medium text-zinc-700">
        My Appointments
      </p>

      {appointments.length === 0 && (
        <p className="mt-5 text-center text-gray-500">No appointments found</p>
      )}

      <div>
        {appointments.map((item) => (
          <div
            className="grid grid-cols-[1fr_2fr] gap-4 border-b py-4 sm:flex sm:gap-6"
            key={item.id}
          >
            <div>
              <img
                className="w-32 rounded bg-indigo-50 object-cover"
                src={
                  item.Doctor?.image
                    ? item.Doctor.image.startsWith("http")
                      ? item.Doctor.image
                      : `${import.meta.env.VITE_API_URL}${item.Doctor.image}`
                    : "/default-doctor.png"
                }
                alt="doctor"
              />
            </div>


            <div className="flex-1 text-sm text-zinc-600">
              <p className="font-semibold text-neutral-800">
                {item.Doctor?.name || "Doctor"}
              </p>

              <p>{item.Doctor?.specialization || "-"}</p>

              <p className="mt-1 text-xs">
                <span className="text-sm font-medium text-neutral-700">
                  Date & Time:
                </span>{" "}
                {new Date(item.date).toLocaleDateString()} | {item.time}
              </p>
            </div>
            <div>
              <p className={`mt-5 font-medium ${item.status === "Pending"
                ? "text-yellow-500" : item.status === "Accepted"
                  ? "text-blue-500"
                  : item.status === "Completed"
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {item.status}
              </p>
            </div>

            {/* CANCEL */}
            <div>
              {item.status === "Pending" && (
                <button
                  onClick={() => cancelAppointment(item.id)}
                  className="mt-3 rounded-lg bg-red-500 px-6 py-2 text-white hover:bg-red-600"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};