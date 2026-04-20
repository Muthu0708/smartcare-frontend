import { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

export const DoctorProfile = () => {
  const navigate=useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    specialization: "",
    experience: "",
    about: "",
    fees: ""
  });

  const [loading, setLoading] = useState(false);

  //Fetch current doctor data
  const fetchProfile = async () => {
  try {
    const res = await API.get("/appointments/doctor/profile");

    setForm({
      name: res.data.name || "",
      email: res.data.email || "",
      specialization: res.data.specialization || "",
      experience: res.data.experience || "",
      about: "", 
      fees: res.data.fees?.toString() || ""
    });

  } catch (err) {
    console.log(err);
  }
};
  useEffect(() => {
    fetchProfile();
  }, []);

  // handle input change
  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  //  update profile
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      setLoading(true);

      await API.patch("/appointments/doctor/profile", form);

      alert("Profile updated successfully ");
      setForm({name:"",email:"",specialization:"",experience:"",about:"",fees:""})

    } catch (err: any) {
      alert(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md mt-6">

      <h2 className="text-2xl font-semibold mb-4">Doctor Profile</h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          className="w-full border p-2 rounded"
        />

        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full border p-2 rounded"
        />

        <input
          name="specialization"
          value={form.specialization}
          onChange={handleChange}
          placeholder="Specialization"
          className="w-full border p-2 rounded"
        />

        <input
          name="experience"
          value={form.experience}
          onChange={handleChange}
          placeholder="Experience (e.g. 4 Years)"
          className="w-full border p-2 rounded"
        />

        <textarea
          name="about"
          value={form.about}
          onChange={handleChange}
          placeholder="About"
          className="w-full border p-2 rounded"
        />

        <input
          name="fees"
          type="number"
          value={form.fees}
          onChange={handleChange}
          placeholder="Fees"
          className="w-full border p-2 rounded"
        />

        <div className="flex justify-center gap-8 ">

        <button
          type="submit"
          disabled={loading}
          className="bg-primary text-white px-6 py-2 rounded"
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
        <button className="bg-primary text-white px-6 py-2 rounded" onClick={()=>navigate("/doctor-dashboard")} >Go to Dashboard</button>
        </div>

      </form>
    </div>
  );
};