import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import API from "../api/axios";

type Doctor = {
  id: number;
  name: string;
  image: string;
  speciality: string;
  degree: string;
  experience: string;
  about: string;
  fees: number;
  address: {
    line1: string;
    line2: string;
  };
};

type Slot = {
  time: string;
};

export const Appointments = () => {
  const { docName } = useParams();
  const { doctors } = useContext(AppContext);

  const daysOfWeeks = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const [docInfo, setDocInfo] = useState<Doctor | null>(null);
  const [docSlots, setDocSlots] = useState<Slot[][]>([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [days, setDays] = useState<any[]>([]);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const location = useLocation();
  const navigate=useNavigate();

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => 
      navigate("/my-appointments")
      , 3000);
  };

  useEffect(() => {
    if (location.state?.message) {
      showToast(location.state.message, "error");
    }
  }, [location.state]);


  const getNext7Days = () => {
    const daysArr = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);

      daysArr.push({
        fullDate: date,
        day: daysOfWeeks[date.getDay()],
        date: date.getDate(),
        iso: date.toISOString().split("T")[0],
      });
    }

    return daysArr;
  };

  useEffect(() => {
    setDays(getNext7Days());
  }, []);

  // Fetch doctor
  useEffect(() => {
    const doc = doctors.find(
      (d) =>
        d.name.toLowerCase().trim() === docName?.toLowerCase().trim()
    );

    setDocInfo(doc ?? null);
  }, [docName, doctors]);

  // Fetch slots
  useEffect(() => {
    const fetchSlots = async () => {
      if (!docInfo) return;

      try {
        const res = await API.get(
          `/appointments/doctor/${docInfo.id}/slots`
        );

        setDocSlots(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchSlots();
  }, [docInfo]);

  // Reset slot index
  useEffect(() => {
    if (docSlots.length > 0) {
      setSlotIndex(0);
    }
  }, [docSlots]);

  // Book Appointment
  const bookAppointment = async () => {
    if (!slotTime || !selectedDate) {
      showToast("Select Data & Time", "error");
      return;
    }

    const formattedTime =
      /^\d{1,2}:\d{2}$/.test(slotTime) ? `${slotTime}:00` : slotTime;

    try {
      await API.post("/appointments", {
        doctorId: docInfo?.id,
        date: selectedDate,
        time: formattedTime,
      });

      showToast("Booked Successfully", "success");
    } catch (err: any) {
      showToast("Booking failed", "error");
    }
  };

  if (!docInfo) return <p>Doctor not found</p>;



  return (
    <div>
       {toast && (
        <div className="fixed top-[100px] left-1/2 -translate-x-1/2 z-[9999]">
          <div className={`relative px-6 py-3 rounded-md shadow-lg text-white overflow-hidden ${toast.type === "success" ? "bg-green-500" : "bg-red-500"} animate-slideDown`}>
            {toast.message}
            <div className={`absolute bottom-0 left-0 h-[3px] w-full ${toast.type === "success" ? "bg-green-200" : "bg-red-200"} animate-progress`}></div>
          </div>
        </div>
      )}
      {/* Doctor Info */}
      <div className="flex flex-col sm:flex-row gap-4 mt-5">
        <img
          className="w-full sm:max-w-72 rounded-lg bg-primary"
          src={docInfo.image}
        />

        <div className="flex-1 border p-6 rounded-lg bg-white">
          <p className="text-2xl font-medium flex items-center gap-2">
            {docInfo.name}
            <img className="w-5" src={assets.verified_icon} />
          </p>

          <p className="text-sm text-gray-600 mt-1">
            {docInfo.degree} - {docInfo.speciality}
            <button className="px-4 ml-3 py-1 rounded-full border text-sm">
              {docInfo.experience}
            </button>
          </p>

          <p className="mt-3 text-sm">{docInfo.about}</p>

          <p className="mt-3 font-medium">Fee: ${docInfo.fees}</p>
        </div>
      </div>

      {/* Slots */}
      <div className="mt-6">
        <p className="font-medium ml-[300px]">Booking Slots</p>

        {/* Dates */}
        <div className="flex gap-3 mt-3 ml-[100px] justify-center">
          {days.map((item, i) => (
            <button
              key={i}
              onClick={() => {
                setSlotIndex(i);
                setSelectedDate(item.iso);
                setSlotTime("");
              }}
              className={`px-4 py-2 rounded-lg border ${slotIndex === i ? "bg-blue-500 text-white" : ""
                }`}
            >
              <p>{item.day}</p>
              <p>{item.date}</p>
            </button>
          ))}
        </div>

        {/* Time Slots */}
        <div className="flex gap-3 justify-center ml-[120px] mt-5 flex-wrap">
          {docSlots[slotIndex]?.map((slot, i) => (

            <button
              key={i}
              onClick={() => setSlotTime(slot.time)}
              className={`px-4 py-2 rounded-full border ${slotTime === slot.time
                  ? "bg-primary text-white"
                  : "border-gray-300"
                }`}
            >
              {slot.time}
            </button>
          ))}
        </div>

        {/* Button */}
        <button
          onClick={bookAppointment}
          className="bg-primary ml-[300px] text-white px-10 py-3 rounded-full mt-5"
        >
          Book Appointment
        </button>
      </div>
    </div>
  );
};