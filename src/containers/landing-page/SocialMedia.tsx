function SocialMedia() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4 bg-gray-60">
      <h1 className="text-2xl sm:text-3xl font-semibold text-indigo-900 mb-4">
        Manage Social Media Accounts
      </h1>

      <p className="text-gray-600 max-w-xl mb-8 text-sm sm:text-base">
        A new social platform that helps you share moments, connect with
        friends,
        <br />
        and explore the world in a whole new way.
      </p>

      <div className="flex gap-4 mb-10">
        <button className="bg-indigo-900 text-white font-medium py-2 px-6 rounded-md hover:bg-indigo-700 transition">
          Get Start
        </button>
        <button className="bg-gray-100 text-indigo-900 font-medium py-2 px-6 rounded-md hover:bg-indigo-200 transition">
          Contact
        </button>
      </div>

      <img
        src="./assets/landing-page.webp"
        alt="Social Media UI"
        className="max-w-6xl w-full shadow-lg"
      />
    </div>
  );
}

export default SocialMedia;
