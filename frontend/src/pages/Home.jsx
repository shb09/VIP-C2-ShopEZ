function Home() {

  return (

    <div className="min-h-screen bg-gray-100 flex items-center justify-center">

      <div className="text-center">

        <h1 className="text-6xl font-bold mb-6">
          Welcome to ShopEZ
        </h1>

        <p className="text-xl text-gray-600 mb-8">
          Best place to buy products online
        </p>

        <a
          href="/products"
          className="bg-black text-white px-6 py-3 rounded-xl text-lg hover:bg-gray-800"
        >
          Shop Now
        </a>

      </div>

    </div>
  );
}

export default Home;