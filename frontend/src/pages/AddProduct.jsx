import { useState } from "react";
import API from "../services/api";

function AddProduct() {

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    images: "",
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

      const productData = {
        ...formData,
        images: [formData.images],
      };

      const res = await API.post(
        "/products/add",
        productData
      );

      alert(res.data.message);

    } catch (error) {

      console.log(error);

      alert("Failed To Add Product");
    }
  };

  return (

    <div className="flex justify-center items-center min-h-screen bg-gray-100">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl w-[500px]"
      >

        <h1 className="text-3xl font-bold text-center mb-6">
          Add Product
        </h1>

        <input
          type="text"
          name="name"
          placeholder="Product Name"
          onChange={handleChange}
          className="border w-full p-3 rounded-lg mb-4"
        />

        <textarea
          name="description"
          placeholder="Description"
          onChange={handleChange}
          className="border w-full p-3 rounded-lg mb-4"
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          onChange={handleChange}
          className="border w-full p-3 rounded-lg mb-4"
        />

        <input
          type="text"
          name="category"
          placeholder="Category"
          onChange={handleChange}
          className="border w-full p-3 rounded-lg mb-4"
        />

        <input
          type="text"
          name="images"
          placeholder="Image URL"
          onChange={handleChange}
          className="border w-full p-3 rounded-lg mb-4"
        />

        <button
          type="submit"
          className="bg-black text-white w-full py-3 rounded-lg hover:bg-gray-800"
        >
          Add Product
        </button>

      </form>

    </div>
  );
}

export default AddProduct;