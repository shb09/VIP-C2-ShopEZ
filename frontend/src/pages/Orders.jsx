import { useEffect, useState } from "react";
import API from "../services/api";

function Orders() {

  const [orders, setOrders] = useState([]);

  useEffect(() => {

    fetchOrders();

  }, []);

  const fetchOrders = async () => {

    try {

      const user =
        JSON.parse(localStorage.getItem("user"));

      const res = await API.get(
        `/orders/user/${user.id}`
      );

      setOrders(res.data);

    } catch (error) {

      console.log(error);

      alert("Failed to fetch orders");
    }
  };

  return (
    <div className="p-8">

  <h1 className="text-4xl font-bold mb-8">
    My Orders
  </h1>

  <div className="flex flex-col gap-6">

    {orders.map((order) => (

      <div
        key={order._id}
        className="border rounded-2xl shadow-lg p-6 bg-white"
      >

        <h2 className="text-2xl font-bold mb-3">
          Total: ₹ {order.totalPrice}
        </h2>

        <p className="text-lg">
          Status:
          <span className="text-green-600 font-semibold ml-2">
            {order.orderStatus}
          </span>
        </p>

        <p className="text-lg mt-2">
          Payment:
          <span className="font-semibold ml-2">
            {order.paymentMethod}
          </span>
        </p>

      </div>
    ))}

  </div>

</div>    
  );
}

export default Orders;