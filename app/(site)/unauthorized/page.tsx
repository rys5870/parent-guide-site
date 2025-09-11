export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 p-6 text-center">
      <div className="bg-red-100 border border-red-400 rounded-xl p-8 max-w-md w-full shadow-md">
        <div className="text-6xl mb-4">⛔</div>
        <h1 className="text-2xl md:text-3xl font-bold text-red-700 mb-2">
          אין לך הרשאה לגשת לעמוד זה
        </h1>
        <p className="text-gray-700 text-base md:text-lg">
          אם אתה חושב שזו טעות, פנה למנהל האתר.
        </p>
        <button
          className="mt-6 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          onClick={() => window.history.back()}
        >
          חזור לדף הקודם
        </button>
      </div>
    </div>
  );
}
