import { useLocation } from 'react-router-dom';

function NotFound() {
    const location = useLocation();

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-5xl font-bold text-gray-800 mb-4">404</h1>
            <p className="text-xl text-gray-600 mb-6">Page Not Found</p>
            <p className="text-gray-500">
                The page you are looking for at <code>{location.pathname}</code> does not exist.
            </p>
            <a href="/" className="mt-4 px-6 py-3 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded">
                Go Home
            </a>
        </div>
    );
}

export default NotFound;