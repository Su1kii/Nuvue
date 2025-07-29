export default function Logo({ onClick }) {
  return (
    <div
      className="flex items-center space-x-3 cursor-pointer select-none"
      onClick={onClick}
    >
      <img
        src="/Nuvue.png"
        alt="Nuvue Logo"
        className="w-12 h-12 sm:w-14 sm:h-14 rounded-md"
      />
      <h1 className="text-xl sm:text-2xl tracking-wide text-black font-bold">
        Nuvue
      </h1>
    </div>
  );
}
