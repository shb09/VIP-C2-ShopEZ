import { Link, useNavigate } from "react-router-dom";

function Navbar() {

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const user =
    JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("cart");

    navigate("/login");
  };

  return (

    <div className="bg-black text-white px-6 py-4 flex justify-between items-center">

      <h1 className="text-3xl font-bold">
        ShopEZ
      </h1>

      <div className="flex gap-5 items-center">

        <Link to="/">Home</Link>

        <Link to="/products">
          Products
        </Link>

        <Link to="/cart">
          Cart
        </Link>

        {
          token && (
            <Link to="/orders">
              Orders
            </Link>
          )
        }

        {
          user?.userType === "Admin" && (
            <Link to="/admin">
              Dashboard
            </Link>
          )
        }

        {
          token ? (

            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-1 rounded-lg"
            >
              Logout
            </button>

          ) : (

            <>
              <Link to="/register">
                Register
              </Link>

              <Link to="/login">
                Login
              </Link>
            </>

          )
        }

      </div>

    </div>
  );
}

export default Navbar;