import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center">
      <h1 className="text-8xl font-bold">404</h1>
      <p className="text-xl text-gray-500 mt-4">Page not found</p>
      <Link
        to="/"
        className="mt-6 px-5 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
      >
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;