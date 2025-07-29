export default function MobileMenu({
  menuOpen,
  setMenuOpen,
  authToken,
  username,
  onLoginClick,
  onSignupClick,
  onLogoutClick,
  navigate,
  gradientBtn,
}) {
  if (!menuOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-40 z-40"
        onClick={() => setMenuOpen(false)}
      />

      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out translate-x-0`}
      >
        <div className="flex flex-col h-full p-6 space-y-6">
          <button
            className="self-end text-gray-500 hover:text-gray-800 text-3xl font-bold"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            &times;
          </button>

          {authToken ? (
            <>
              <span className="font-bold text-lg text-black truncate max-w-full">
                Hello, {username}
              </span>
              <button
                onClick={() => {
                  navigate("/");
                  setMenuOpen(false);
                }}
                className="text-white px-4 py-2 rounded-xl shadow-md font-semibold text-base transition bg-black hover:bg-gray-950"
              >
                Profile
              </button>
              <button
                onClick={onLogoutClick}
                className={`text-black px-4 py-2 rounded-xl shadow-md font-semibold text-base transition ${gradientBtn}`}
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onLoginClick}
                className="font-semibold text-base text-black transition hover:opacity-80 text-left"
              >
                Log In
              </button>
              <button
                onClick={onSignupClick}
                className={`text-black px-4 py-2 rounded-xl shadow-md font-semibold text-base transition ${gradientBtn} text-left`}
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
