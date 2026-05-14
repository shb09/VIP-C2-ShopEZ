import { useEffect, useState } from "react";
import API from "../services/api";

function Products() {

  const [products, setProducts] = useState([]);

  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("");

  const fetchProducts = async () => {

    try {

      const res = await API.get(
        `/products?search=${search}&category=${category}`
      );

      setProducts(res.data.products);

    } catch (error) {

      console.log(error);

    }
  };

  useEffect(() => {

    fetchProducts();

  }, []);

  const addToCart = (product) => {

    const existingCart =
      JSON.parse(localStorage.getItem("cart")) || [];

    existingCart.push(product);

    localStorage.setItem(
      "cart",
      JSON.stringify(existingCart)
    );

    alert("Added To Cart");
  };

  return (

    <div className="p-6">

      <h1 className="text-4xl font-bold mb-8">
        Products
      </h1>

      {/* SEARCH + FILTER */}

      <div className="flex gap-4 mb-8">

        <input
          type="text"
          placeholder="Search products"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-3 rounded-lg"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-3 rounded-lg"
        >
          <option value="">
            All
          </option>

          <option value="Mobiles">
            Mobiles
          </option>

          <option value="Laptops">
            Laptops
          </option>

        </select>

        <button
          onClick={fetchProducts}
          className="bg-black text-white px-5 rounded-lg"
        >
          Apply
        </button>

      </div>

      {/* PRODUCTS */}

      <div className="flex flex-wrap gap-8">

        {
          products.map((product) => (

            <div
              key={product._id}
              className="w-72 border rounded-2xl shadow-lg p-4 hover:scale-105 transition"
            >

              <img
                src={product.images?.[0]}
                alt={product.name}
                className="w-full h-52 object-cover rounded-xl"
              />

              <h2 className="text-2xl font-bold mt-4">
                {product.name}
              </h2>

              <p className="text-gray-600 mt-2">
                {product.description}
              </p>

              <h3 className="text-xl font-semibold mt-3">
                ₹ {product.price}
              </h3>

              <button
                onClick={() => addToCart(product)}
                className="bg-black text-white px-4 py-2 rounded-lg mt-4 w-full hover:bg-gray-800"
              >
                Add To Cart
              </button>

            </div>
          ))
        }

      </div>

    </div>
  );
}

export default Products;