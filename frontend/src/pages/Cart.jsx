import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Cart() {

  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {

    const items =
      JSON.parse(localStorage.getItem("cart")) || [];

    setCartItems(items);

  }, []);

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price,
    0
  );

  const removeFromCart = (indexToRemove) => {

    const updatedCart = cartItems.filter(
      (_, index) => index !== indexToRemove
    );

    setCartItems(updatedCart);

    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );
  };

  const placeOrder = async () => {

    try {

      const user =
        JSON.parse(localStorage.getItem("user"));

      const orderProducts = cartItems.map((item) => ({
        product: item._id,
        quantity: 1,
      }));

      const orderData = {

        user: user.id,

        products: orderProducts,

        totalPrice,

        paymentMethod: "COD",

        shippingAddress: "Hyderabad",
      };

      const res = await API.post(
        "/orders/place",
        orderData
      );

      alert(res.data.message);

      localStorage.removeItem("cart");

      setCartItems([]);

      navigate("/orders");

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data?.message ||
        "Order Failed"
      );
    }
  };

  return (

    <div className="p-8">

      <h1 className="text-4xl font-bold mb-4">
        Cart Page
      </h1>

      <h2 className="text-2xl font-semibold mb-8">
        Total: ₹ {totalPrice}
      </h2>

      <div className="flex flex-wrap gap-6">

        {
          cartItems.map((item, index) => (

            <div
              key={index}
              className="border rounded-2xl shadow-lg p-4 w-72 bg-white"
            >

              <img
                src={item.images?.[0]}
                alt={item.name}
                className="w-full h-48 object-cover rounded-xl"
              />

              <h2 className="text-2xl font-bold mt-4">
                {item.name}
              </h2>

              <p className="text-gray-600 mt-2">
                {item.description}
              </p>

              <h3 className="text-xl font-semibold mt-3">
                ₹ {item.price}
              </h3>

              <button
                onClick={() => removeFromCart(index)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg mt-4 w-full hover:bg-red-600"
              >
                Remove
              </button>

            </div>
          ))
        }

      </div>

      {
        cartItems.length > 0 && (

          <button
            onClick={placeOrder}
            className="bg-black text-white px-8 py-3 rounded-xl mt-10 hover:bg-gray-800"
          >
            Checkout
          </button>
        )
      }

    </div>
  );
}

export default Cart;