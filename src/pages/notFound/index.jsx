export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-800">404</h1>
        <p className="text-2xl font-semibold text-gray-600 mt-4">
          Oops! Page not found
        </p>
        <p className="text-gray-500 mt-2">
          The page you are looking for doesn't exist or has been moved.
        </p>

        <img
          src="https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif"
          alt="404 Illustration"
          className="w-80 mx-auto mt-6"
        />

        <a
          href="/"
          className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white text-lg font-medium rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          Go Back Home
        </a>
      </div>
    </div>
  );
}
