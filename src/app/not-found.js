import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-50 via-red-50 to-pink-100 p-4">
      <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
        <div className="mb-4 text-6xl">💔</div>
        <h1 className="mb-2 text-4xl font-bold text-gray-900">404</h1>
        <h2 className="mb-4 text-2xl font-bold text-pink-600">
          Page Not Found
        </h2>
        <p className="mb-6 text-gray-700">
          Oops! The page you&apos;re looking for doesn&apos;t exist. 
          Maybe create a new Valentine page instead?
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="rounded-full bg-gradient-to-r from-pink-500 to-red-500 px-8 py-3 font-bold text-white transition-all hover:scale-105"
          >
            Go Home 🏠
          </Link>
          <Link
            href="/create"
            className="rounded-full border-2 border-pink-500 bg-white px-8 py-3 font-bold text-pink-600 transition-all hover:bg-pink-50"
          >
            Create Page 💘
          </Link>
        </div>
      </div>
    </div>
  );
}
