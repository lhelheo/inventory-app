export const LoadingCircle = () => {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-[#181818] bg-opacity-90 z-50">
      <svg
        className="animate-spin h-8 w-8 text-[#e3e3e3]"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C4.477 0 0 4.477 0 12h4z"
        ></path>
      </svg>
    </div>
  )
}
