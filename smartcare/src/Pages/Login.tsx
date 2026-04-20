import { useState, useEffect } from "react";
import { registerUser, loginUser } from "../api/auth";
import { useNavigate, useLocation } from "react-router-dom";

export const Login = () => {
  const [state, setState] = useState<"Sign up" | "Login">("Sign up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  useEffect(() => {
    if (location.state?.message) {
      showToast(location.state.message, "error");
    }
  }, [location.state]);

  const onSubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password || (state === "Sign up" && !name)) {
      return showToast("All fields are required", "error");
    }

    try {
      setLoading(true);

      if (state === "Sign up") {
        await registerUser({ name, email, password });

        setName("");
        setEmail("");
        setPassword("");
        setState("Login");

        showToast("Registered successfully!", "success");
      } else {
        const res = await loginUser({ email, password });

        console.log("LOGIN RESPONSE:", res.data);

        const role = res.data?.user?.role?.toLowerCase();

        if (!role) {
          showToast("Role not found in login response", "error");
          return;
        }

        localStorage.setItem("token", res.data.accessToken);

        localStorage.setItem(
          "user",
          JSON.stringify({
            id: res.data.user.id,
            name: res.data.user.name,
            email: res.data.user.email,
            role,
          })
        );

        window.dispatchEvent(new Event("storage"));

        showToast("Login successful!", "success");

        setTimeout(() => {
          if (role === "doctor") {
            navigate("/doctor-dashboard");
          } else {
            navigate("/");
          }
        }, 1000);
      }
    } catch (error: any) {
      showToast(
        error.response?.data?.message || "Something went wrong",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {toast && (
        <div className="fixed top-[100px] left-1/2 -translate-x-1/2 z-[9999]">
          <div className={`relative px-6 py-3 rounded-md shadow-lg text-white overflow-hidden ${toast.type === "success" ? "bg-green-500" : "bg-red-500"} animate-slideDown`}>
            {toast.message}
            <div className={`absolute bottom-0 left-0 h-[3px] w-full ${toast.type === "success" ? "bg-green-200" : "bg-red-200"} animate-progress`}></div>
          </div>
        </div>
      )}

      <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center">
        <div className="flex flex-col gap-3 m-auto p-8 min-w-[340px] sm:min-w-96 border rounded-xl shadow-lg">
          <p className="text-2xl font-semibold">
            {state === "Sign up" ? "Create Account" : "Login"}
          </p>

          {state === "Sign up" && ( <input type="text" placeholder="Full Name" className="border p-2 rounded" value={name}
                                           onChange={(e) => setName(e.target.value)}/>
          )}

          <input
            type="email"
            placeholder="Email"
            className="border p-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="border p-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            disabled={loading}
            className="bg-primary text-white py-2 rounded disabled:opacity-50"
          >
            {loading
              ? "Please wait..."
              : state === "Sign up"
              ? "Create Account"
              : "Login"}
          </button>

          <p>
            {state === "Sign up"
              ? "Already have an account?"
              : "Create new account?"}
            <span
              onClick={() => setState(state === "Sign up" ? "Login" : "Sign up")}
              className="text-primary cursor-pointer ml-1"
            >
              Click here
            </span>
          </p>
        </div>
      </form>
    </>
  );
};