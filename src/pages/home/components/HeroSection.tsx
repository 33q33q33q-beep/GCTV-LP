export default function HeroSection() {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0">
        <iframe
          src="https://www.youtube.com/embed/VAW_xQtJQsA?autoplay=1&mute=1&controls=0&loop=1&playlist=VAW_xQtJQsA&start=0&rel=0&showinfo=0&modestbranding=1"
          title="ロードレースゴールスプリント"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
          style={{ border: "none" }}
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
        <div className="mb-8">
          <img
            src="https://static.readdy.ai/image/7c6e09d6014ba4e8528d2ee81745709e/757effa5c29c28ccf2ee64f4af8f45ca.png"
            alt="Gachinko Cycle TV"
            className="mx-auto h-24 w-auto md:h-32"
          />
        </div>

        <h1 className="mb-4 text-3xl font-black leading-tight text-white md:text-5xl lg:text-6xl">
          自転車を<span className="text-red-400">"本気"</span>で楽しむ人のための<br />
          <span className="text-red-400">WEBメディア</span>
        </h1>

        <p className="mb-6 text-lg font-bold text-red-400 md:text-xl lg:text-2xl">Gachinko Cycle TV</p>

        <p className="mb-12 max-w-3xl text-base leading-relaxed text-gray-200 md:text-lg lg:text-xl">
          応援する興奮も、自分で走る楽しさも。<br />
          トッププロの素顔から週末の絶景ルートまで、<br />
          あなたのサイクルライフを豊かにする総合サイクルメディア
        </p>

        <div className="flex w-full max-w-2xl flex-col gap-4 px-4 sm:flex-row">
          <a
            href="https://www.youtube.com/@GachinkoCycleTV"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 transform cursor-pointer items-center justify-center gap-3 whitespace-nowrap rounded-full bg-red-600 px-8 py-4 text-lg font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-red-700 hover:shadow-2xl"
          >
            <i className="ri-youtube-fill text-2xl" />
            メインチャンネルを登録
          </a>
          <a
            href="https://www.youtube.com/@GachinkoCycleTV-TOKUHAIN"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 transform cursor-pointer items-center justify-center gap-3 whitespace-nowrap rounded-full bg-white px-8 py-4 text-lg font-bold text-gray-900 shadow-lg transition-all duration-300 hover:scale-105 hover:bg-gray-100 hover:shadow-2xl"
          >
            <i className="ri-youtube-fill text-2xl text-red-600" />
            特派員チャンネルを登録
          </a>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <i className="ri-arrow-down-line text-3xl text-red-400" />
        </div>
      </div>
    </section>
  );
}
