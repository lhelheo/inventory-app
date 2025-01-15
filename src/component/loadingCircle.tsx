export const LoadingCircle = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-[#181818] bg-opacity-90">
      <svg
        className="animate-spin"
        width="32"
        height="32"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        {/* Círculo de fundo (cinza claro) */}
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="#c4c4c4" /* Cinza claro */
          strokeWidth="4"
        ></circle>

        {/* Barra de carregamento (cinza escuro) */}
        <circle
          className="opacity-100"
          cx="12"
          cy="12"
          r="10"
          stroke="#6b6b6b" /* Cinza escuro */
          strokeWidth="4"
          strokeDasharray="80"
          strokeDashoffset="60"
        ></circle>
      </svg>
    </div>
  )
}
