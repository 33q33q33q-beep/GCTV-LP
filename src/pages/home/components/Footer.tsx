import GachinekoSticker from "../../../components/GachinekoSticker";

export default function Footer() {
  const socialLinks = [
    {
      name: 'YouTube メイン',
      icon: 'ri-youtube-fill',
      url: 'https://www.youtube.com/@GachinkoCycleTV',
      color: 'hover:text-red-600'
    },
    {
      name: 'YouTube 特派員',
      icon: 'ri-youtube-fill',
      url: 'https://www.youtube.com/@GCTVtokuhain',
      color: 'hover:text-red-600'
    },
    {
      name: 'X (Twitter)',
      icon: 'ri-twitter-x-fill',
      url: 'https://twitter.com/GachinkoCycleTV',
      color: 'hover:text-gray-900'
    },
    {
      name: 'Instagram',
      icon: 'ri-instagram-fill',
      url: 'https://www.instagram.com/gachinkocycletv/',
      color: 'hover:text-pink-500'
    },
    {
      name: 'Facebook',
      icon: 'ri-facebook-fill',
      url: 'https://www.facebook.com/GachinkoCycleTV',
      color: 'hover:text-blue-600'
    }
  ];

  const quickLinks = [
    { name: 'レース配信', url: '#' },
    { name: '特派員チャンネル', url: '#' },
    { name: 'スケジュール', url: '#' },
    { name: 'コミュニティ', url: '#' }
  ];

  return (
    <footer className="bg-rose-50 text-gray-700 py-16 px-4 border-t border-red-100">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Logo & Description */}
          <div>
            <div className="flex flex-wrap items-end gap-4 mb-4">
              <img
                src="https://static.readdy.ai/image/7c6e09d6014ba4e8528d2ee81745709e/757effa5c29c28ccf2ee64f4af8f45ca.png"
                alt="Gachinko Cycle TV"
                className="h-16 w-auto"
              />
              <div className="w-28 sm:w-32 shrink-0 -mb-1">
                <GachinekoSticker variant="ganbaru" className="w-full h-auto" />
              </div>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              自転車を"本気"で楽しむ人のためのWEBメディア。<br />
              JBCFロードレースの配信から特派員の絶景ルート紹介まで、<br />
              サイクルライフを豊かにする情報をお届けします。
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-black text-red-600 mb-4">クイックリンク</h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.url}
                    className="text-gray-500 hover:text-red-600 transition-colors text-sm cursor-pointer"
                  >
                    <i className="ri-arrow-right-s-line mr-1"></i>
                    {link.name}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="https://jbcf.or.jp/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-red-600 transition-colors text-sm cursor-pointer"
                >
                  <i className="ri-external-link-line mr-1"></i>
                  JBCF公式サイト
                </a>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="text-xl font-black text-red-600 mb-4">フォローする</h4>
            <div className="space-y-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-3 text-gray-500 ${social.color} transition-colors text-sm cursor-pointer group`}
                >
                  <div className="w-10 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center group-hover:border-red-300 transition-colors shadow-sm">
                    <i className={`${social.icon} text-xl`}></i>
                  </div>
                  <span>{social.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-red-100 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-500 text-sm text-center md:text-left">
              <p className="mb-1">
                運営会社：<strong className="text-gray-800">サイクルネット株式会社</strong>
              </p>
              <p>住所：東京都渋谷区千駄ヶ谷1-5-1</p>
            </div>
            <div className="text-gray-400 text-sm text-center md:text-right">
              <p>&copy; 2024 Gachinko Cycle TV. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
