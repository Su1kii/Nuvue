export default function DesktopMenu({
  authToken,
  username,
  onLoginClick,
  onSignupClick,
  onLogoutClick,
  gradientBtn,
}) {
  return (
    <div className="hidden md:flex items-center space-x-6">
      {authToken ? (
        <>
          <span className="font-bold text-lg text-black truncate max-w-xs">
            Hello, {username}
          </span>
          <button
            onClick={onLogoutClick}
            className={`text-black px-5 py-2 rounded-xl shadow-md font-semibold text-base transition ${gradientBtn}`}
          >
            Log Out
          </button>
        </>
      ) : (
        <>
          <button
            onClick={onLoginClick}
            className="font-semibold text-base text-black transition hover:opacity-80"
          >
            Log In
          </button>
          <button
            onClick={onSignupClick}
            className={`text-black px-5 py-2 rounded-xl shadow-md font-semibold text-base transition ${gradientBtn}`}
          >
            Sign Up
          </button>
        </>
      )}
    </div>
  );
}
