import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Login() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const res = await API.post("/auth/login", formData);

      console.log(res.data);

      // Store token in localStorage
      localStorage.setItem("token", res.data.token);

      // Store user info
      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      alert("Login Successful");

if (res.data.user.userType === "Admin") {

  navigate("/admin");

} else {

  navigate("/");

}

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data?.message || "Login Failed"
      );
    }
  };

  return (

  <div className="flex justify-center items-center h-screen bg-gray-100">

    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-2xl shadow-xl w-96"
    >

      <h1 className="text-3xl font-bold text-center mb-6">
        Login
      </h1>

      <input
        type="email"
        name="email"
        placeholder="Enter email"
        onChange={handleChange}
        className="border w-full p-3 rounded-lg mb-4"
      />

      <input
        type="password"
        name="password"
        placeholder="Enter password"
        onChange={handleChange}
        className="border w-full p-3 rounded-lg mb-4"
      />

      <button
        type="submit"
        className="bg-black text-white w-full py-3 rounded-lg hover:bg-gray-800"
      >
        Login
      </button>

    </form>

  </div>
);
}
export default Login;