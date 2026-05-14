import { Link } from "react-router-dom";

function AdminDashboard() {

  return (

    <div className="p-8 min-h-screen bg-gray-100">

      <h1 className="text-4xl font-bold mb-8">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <Link
          to="/admin/add-product"
          className="bg-white shadow-lg rounded-2xl p-8 hover:scale-105 transition"
        >
          <h2 className="text-2xl font-bold">
            Add Product
          </h2>

          <p className="text-gray-600 mt-2">
            Create new products
          </p>
        </Link>

        <Link
          to="/products"
          className="bg-white shadow-lg rounded-2xl p-8 hover:scale-105 transition"
        >
          <h2 className="text-2xl font-bold">
            Manage Products
          </h2>

          <p className="text-gray-600 mt-2">
            View all products
          </p>
        </Link>

        <Link
          to="/orders"
          className="bg-white shadow-lg rounded-2xl p-8 hover:scale-105 transition"
        >
          <h2 className="text-2xl font-bold">
            Orders
          </h2>

          <p className="text-gray-600 mt-2">
            Track customer orders
          </p>
        </Link>

      </div>

    </div>
  );
}

export default AdminDashboard;