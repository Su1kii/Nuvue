import { useState } from "react";

const gradientBtn =
  "bg-gradient-to-r from-yellow-400 via-orange-500 to-rose-500 hover:from-yellow-500 hover:via-orange-600 hover:to-rose-600";
const gradientText =
  "bg-gradient-to-r from-yellow-400 via-orange-500 to-rose-500 bg-clip-text text-transparent font-extrabold";

export default function LoginModal({ onClose, signIn }) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const username = e.target.elements.username.value;
    const password = e.target.elements.password.value;

    const result = await signIn(username, password);

    setLoading(false);

    if (result.success) {
      onClose();
    } else {
      result.message || "Login failed";
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-10 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center mb-6">
          <img
            src="/Nuvue.png"
            alt="Nuvue"
            className="w-20 h-20 rounded-xl shadow-lg"
          />
        </div>
        <h2 className={`text-3xl text-center mb-8 ${gradientText}`}>
          Welcome Back
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              name="username"
              required
              placeholder="Your username"
              className="w-full px-5 py-3 border rounded-xl focus:ring-4 focus:ring-yellow-400"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              placeholder="Your password"
              className="w-full px-5 py-3 border rounded-xl focus:ring-4 focus:ring-yellow-400"
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            className={`w-full py-3 rounded-xl text-lg font-semibold ${gradientBtn}`}
            disabled={loading}
          >
            {loading ? "Logging In..." : "Log In"}
          </button>
        </form>
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 text-3xl"
        >
          &times;
        </button>
      </div>
    </div>
  );
}
