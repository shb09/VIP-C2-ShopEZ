function Profile() {

  const user =
    JSON.parse(localStorage.getItem("user"));

  return (

    <div className="p-8">

      <h1 className="text-4xl font-bold mb-8">
        Profile
      </h1>

      <div className="bg-white shadow-lg rounded-2xl p-8 w-96">

        <p className="mb-4">
          <b>Name:</b> {user.name}
        </p>

        <p>
          <b>Email:</b> {user.email}
        </p>

      </div>

    </div>
  );
}

export default Profile;