import Image from "next/image";

export default function GameSelection() {
  return (
    <div className="min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-2xl font-bold text-center mb-8">Pilih Game</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {/* Tabel untuk game Tetris */}
        <div className="border rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-center">Tetris</h2>
          <p className="text-sm mb-4 text-center">
            Game klasik untuk menyusun balok dan mencetak skor tertinggi.
          </p>
          <div className="flex justify-center">
            <a
              className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
              href="/tetris"
            >
              Mainkan Tetris
            </a>
          </div>
        </div>

        {/* Tabel untuk game Tower */}
        <div className="border rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-center">Tower</h2>
          <p className="text-sm mb-4 text-center">
            Bangun menara setinggi mungkin tanpa menjatuhkan balok.
          </p>
          <div className="flex justify-center">
            <a
              className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
              href="/tower"
            >
              Mainkan Tower
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
