export const AboutUs = () => {
    return (
      <div className="px-6 py-12 max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-indigo-900 mb-6">About Rentpy</h1>
        <p className="text-lg text-gray-700 mb-6">
          Rentpy is your go-to platform for finding the perfect rental space — whether it’s for a few nights or a few months. Built with flexibility and convenience in mind, Rentpy bridges the gap between travelers, students, and homeowners.
        </p>
  
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Our Mission</h2>
        <p className="text-gray-600 mb-6">
          To simplify the renting experience by offering seamless, reliable, and flexible rental options for every lifestyle.
        </p>
  
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Why Choose Rentpy?</h2>
        <ul className="list-disc list-inside text-gray-600 mb-6">
          <li>Verified listings for peace of mind</li>
          <li>Short-term and long-term rental flexibility</li>
          <li>Modern UI with intuitive search features</li>
          <li>Focused on student and traveler needs</li>
        </ul>
  
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Our Vision</h2>
        <p className="text-gray-600 mb-10">
          To become India's most trusted rental platform for students, digital nomads, and explorers by providing value, transparency, and ease.
        </p>
  
        <div className="text-center">
          <a href="/property/all-rooms">
          <button className="bg-gradient-to-r from-blue-600 to-purple-700 text-white rounded-full px-6 py-3 shadow-lg hover:scale-105 transition">
  Start Exploring
</button>
          </a>
        </div>
      </div>
    );
  };
  