import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Register() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    userType: "customer",
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

      const res = await API.post(
        "/auth/register",
        formData
      );

      alert(res.data.message);

      navigate("/login");

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data?.message ||
        "Registration Failed"
      );
    }
  };

  return (

    <div className="flex justify-center items-center min-h-screen bg-gray-100">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl w-96"
      >

        <h1 className="text-3xl font-bold text-center mb-6">
          Register
        </h1>

        <input
          type="text"
          name="username"
          placeholder="Enter username"
          onChange={handleChange}
          className="border w-full p-3 rounded-lg mb-4"
        />

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

        <select
          name="userType"
          onChange={handleChange}
          className="border w-full p-3 rounded-lg mb-4"
        >

          <option value="Customer">
            Customer
          </option>

          <option value="Admin">
            Admin
          </option>

        </select>

        <button
          type="submit"
          className="bg-black text-white w-full py-3 rounded-lg hover:bg-gray-800"
        >
          Register
        </button>

      </form>

    </div>
  );
}

export default Register;