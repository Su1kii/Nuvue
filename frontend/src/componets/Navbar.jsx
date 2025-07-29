import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DesktopMenu from "./DesktopMenu";
import LoginModal from "./LoginModal";
import Logo from "./Logo";
import MobileMenu from "./MobileMenu";
import SignupModal from "./SignupModal";

const gradientBtn =
  "bg-gradient-to-r from-yellow-400 via-orange-500 to-rose-500 hover:from-yellow-500 hover:via-orange-600 hover:to-rose-600";

export default function Navbar({
  authToken,
  username,
  signIn,
  signUp,
  logout,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const navigate = useNavigate();

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-md border-b border-gray-200 z-50 px-4 sm:px-8 py-3 flex items-center justify-between">
        <Logo
          onClick={() => {
            navigate("/");
            setMenuOpen(false);
          }}
        />

        <DesktopMenu
          authToken={authToken}
          username={username}
          onLoginClick={() => setShowLogin(true)}
          onSignupClick={() => setShowSignup(true)}
          onLogoutClick={() => {
            logout();
            setMenuOpen(false);
          }}
          gradientBtn={gradientBtn}
        />

        <button
          className="md:hidden flex items-center justify-center p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg
            className="h-7 w-7 text-black"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </nav>

      <MobileMenu
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        authToken={authToken}
        username={username}
        onLoginClick={() => {
          setShowLogin(true);
          setMenuOpen(false);
        }}
        onSignupClick={() => {
          setShowSignup(true);
          setMenuOpen(false);
        }}
        onLogoutClick={() => {
          logout();
          setMenuOpen(false);
        }}
        navigate={navigate}
        gradientBtn={gradientBtn}
      />

      <div className="h-16 md:h-20" />

      {showLogin && (
        <LoginModal onClose={() => setShowLogin(false)} signIn={signIn} />
      )}

      {showSignup && (
        <SignupModal onClose={() => setShowSignup(false)} signUp={signUp} />
      )}
    </>
  );
}
