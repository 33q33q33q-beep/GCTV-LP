import GachinekoSticker from "../../../components/GachinekoSticker";

export default function AboutSection() {
  const experiences = [
    {
      icon: 'ri-fire-fill',
      emoji: '🔥',
      title: '「観る」',
      description: 'レースの熱狂を最前線で体験する',
      gradient: 'from-red-600 to-red-700'
    },
    {
      icon: 'ri-brain-fill',
      emoji: '🧠',
      title: '「知る」',
      description: '選手やチームのリアルな姿と魅力に触れる',
      gradient: 'from-red-400 to-rose-500'
    },
    {
      icon: 'ri-bike-fill',
      emoji: '🚲',
      title: '「はじめる」',
      description: '自分にぴったりの自転車ライフをみつける',
      gradient: 'from-rose-500 to-red-500'
    }
  ];

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 relative">
          <div className="absolute -top-6 right-0 md:right-4 lg:right-12 w-36 md:w-44 lg:w-48 opacity-95 pointer-events-none">
            <GachinekoSticker variant="nyaruhodo" className="w-full h-auto" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            GCTVが届ける<span className="text-red-600">3つの体験</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-rose-500 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {experiences.map((exp, index) => (
            <a
              key={index}
              href={index === 0 ? '#race-interview' : index === 1 ? '#news-information' : '#variety-beginner'}
              className="bg-gray-50 rounded-2xl p-8 text-center transform hover:scale-105 transition-all duration-300 hover:shadow-2xl border border-gray-200 hover:border-red-400 cursor-pointer group block no-underline"
            >
              <div className={`w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br ${exp.gradient} flex items-center justify-center text-5xl group-hover:rotate-12 transition-transform duration-300`}>
                {exp.emoji}
              </div>
              <h3 className="text-3xl font-black text-gray-900 mb-4 group-hover:text-red-600 transition-colors">
                {exp.title}
              </h3>
              <p className="text-gray-600 text-base whitespace-nowrap">
                {exp.description}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
