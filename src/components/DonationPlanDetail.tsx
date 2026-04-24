import React, { useState } from 'react';

interface DonationPlanDetailProps {
  planId: number;
}

const PLAN_DATA = [
  { 
    id: 1, 
    title: '【新生的甘霖】復活草生命禮盒', 
    imageUrl: 'https://media.ct.org.tw/upload/dedication_article/2026/03/23/69c0dc0e9dc17.jpg',
    description: `Revival亞洲論壇影響力中心2026年隆重獻禮\n\n生命未曾止息，只是正等待\n【新生的甘霖】\n\n在乾旱與沉默之中，我們有時蜷縮著，看似枯黃、停滯，彷彿失去了盼望；在不如預期的現實裡，我們會懷疑、會疲乏，也會問：神在哪裡？\n\n不是祂不在，祂從未離開，祂悄然等待；\n\n直到那一刻，甘霖沛降—也許是一個念頭、是一句話、是一個願意伸出的手，看似微小，這是恩典，也是信心，卻足以讓生命再次展開、再次甦醒。\n\n「我 們 有 這 寶 貝 放 在 瓦 器 裡 ， 要 顯 明 這 莫 大 的 能 力 是 出 於 神 ， 不 是 出 於 我 們 。」哥林多後書4：7\n\n亞洲影響力中心特別推出【復活草生命禮盒】\n復活草 — 象徵生命的重生與復興\n透明花盤 — 見證復活草在水中重新展開的奇妙過程\n迷你小羊 — 訴說神兒女在祂的愛中安然生活\n\n2026年是每個神兒女復活的一年\n也為亞洲影響力中心繼續向亞洲各國推展、連結募資\n凡奉獻2000元，贈1組 \n凡奉獻3000元，贈2組\n/限量50套\n\n★有一種植物，它可以在最惡劣的氣候條件下茁壯成長。\n\n在沙漠長期乾旱期間，它會捲成一個緊密的棕色球，盡量減少其表面積，以大幅減少水分流失。這種乾燥狀態可以持續數月，甚至數年。當雨水終於到來時，它就會展開葉子，展現繁茂生長的能力，充滿活力。\n\n它是復活草。\n\n**奉獻請註明 「新生的甘霖」\n\n註：復活草為自然植物，其生長狀況會受到環境、溫度與照顧方式影響。本活動僅提供體驗與分享，後續養護需由參與者自行負責，恕無法提供保證或補發，敬請見諒。`
  },
  { 
    id: 2, 
    title: '在沙漠中匯聚活水，將影響力推向地極', 
    imageUrl: 'https://media.ct.org.tw/upload/dedication_article/2026/03/13/69b3d20573950.jpg',
    description: `這是一個充滿挑戰的時代，卻也是神正在全地興起領袖的時刻。\n\n2026 年 10 月，我們將在美國亞利桑那州的鳳凰城，舉辦為期四天三夜的【亞洲論壇影響力國際年會】。\n\n這不只是一場聚集，更是一座連結全球屬靈資源的祭壇！我們正廣邀世界各地、在各領域深具影響力的基督徒領袖來到這座沙漠之城，透過深度的對話、敬拜與分享，共同尋求神在下一個世代的國度心意。\n\n當全世界的影響力匯聚於此，我們相信，聖靈的火將在這裡點燃，如同在曠野中開道路，在沙漠裡開江河！\n\n建造這座國際祭壇，我們需要您的同工：\n一場跨越國界的屬靈盛宴，需要龐大的後勤與資源托住。我們誠摯邀請您，透過禱告與財務的奉獻，成為這次年會的【國度影響力夥伴】。您的每一分奉獻，都將化作串聯全球基督徒的關鍵力量：\n\n2026影響力國際年會：https://www.impactasiacenter.com/2026\n點燃微光 (NT$3,000)：\u00A0支持年會在地後勤與場地行政\n跨越藩籬 (NT$15,000)：\u00A0贊助大會影音系統，讓信息傳遞無國界\n國度基石 (NT$60,000+)：\u00A0支持海外事工，投資國度人才\n\u00A0\n(機構/企業若有意參與奉獻贊助，歡迎直接與我們聯繫)\n\n「看哪，我要做一件新事；如今要發現，你們豈不知道嗎？我必在曠野開道路，在沙漠開江河。」\u00A0 (以賽亞書 43:19)\n\n在社群網絡與實體世界皆快速變遷的今日，讓我們一起用行動回應呼召，將福音的 Impact 從鳳凰城發送至世界的每一個角落。`
  },
  { 
    id: 3, 
    title: 'The Greatest Gift from God｜神的愛最美的禮物', 
    imageUrl: 'https://media.ct.org.tw/upload/dedication_article/2026/03/11/69b10d270667f.png',
    description: `你是神所愛的孩子 \n You are God's Beloved Child \n\n神的愛 是一生最美的祝福\n送出一份禮品 傳遞一份祝福\n誠摯邀請您參與這份愛的行動\n\n兼具實用與耐用的隨身包\n可輕鬆融入各種穿搭風格\n適合通勤、上課或休閒旅行使用\n可放置日常用品、A4 文件、筆電或筆記本\n\n家庭是信仰根基 也是愛的起點\n在神的愛中 建造合一的家庭\n讓家庭成為神所祝福的禮物\n\n方 案 １ \n奉獻 1,000 元 即贈 1 + 1 好禮\nGod's Beloved Child 手提袋 +\nFamily is Love 智高積木 共2套\n1套給自己，1套送祝福\n(1套寄給您，另1套可寄至指定收件者)\n\n方 案 ２ \n奉獻 2,000 元 即贈 2 + 2 好禮\nGod's Beloved Child 手提袋 +\nFamily is Love 智高積木 共4套\n2套給自己，2套送祝福\n(2套寄給您，另2套可寄至指定收件者)\n\n方 案３ \n奉獻 5,000 元 為您贈送 10 套祝福\nGod's Beloved Child 手提袋 +\nFamily is Love 智高積木 共10套\n(全數寄給您，或為您寄至指定收件者)\n\n方 案 ４ \n奉獻 8,000 元\n為您贈送50組積木給指定教會或團體\nFamily is Love 智高積木 共50組\n(全數寄給您，或為您寄至指定收件者)\n \n\nheart如需將祝福送至特定收件者mail\n歡迎來信告訴我們：\nlealin@ct.org.tw\n\n\n透過奉獻支持福音事工\n不僅是回應信仰 更是分享愛\n讓祝福不只停留在自己手中\n也流向你所愛的人\n\n願上帝的愛\n成為您與全家最美的祝福\n\n▋產品規格\n\n論壇限定特製帆布包\n尺寸：34 x 38 cm\n\nFamily is Love 智高積木\n尺寸：10 x 6 x 14 cm\n\n▋相關洽詢\nlealin@ct.org.tw\n02-23961010 林姊妹\n服務時間｜週一至週五 08:30 - 17:30`
  },
  { 
    id: 4, 
    title: '乘著愛的風出發吧！', 
    imageUrl: 'https://media.ct.org.tw/upload/dedication_article/2026/02/10/698ae5872cae3.png',
    description: `一份捐款，為孩子帶來生命中的驚喜\n在偏鄉，許多孩子來自低收入、單親或隔代教養家庭。\n\n對他們而言，生活已經很吃力，更遑論穩定的學習資源與成長陪伴。\n\n也許他們不是不愛學習，\n只是，從未有人為他們打開那扇門。\n\n我們看過許多孩子，\n雖然貧困，卻依然努力向上、不輕言放棄。\n\n為什麼？\n\n因為他們曾被「愛」接住。\n\n今天，我想邀請您一起做一件小小卻有力量的事。\n\n我們不求改變一切，\n只想讓孩子感受到——\n「有人在乎你。」\n「有人記得你。」\n透過一塊塊小小的積木，\n讓偏鄉的孩子也能擁有歡笑、創造與學習的時刻，\n為他們的成長添上一抹色彩，也送上一份祝福。\n\n你捐款，我來送。\n\n我們將把積木親手送進偏鄉孩子的手中。\n\n奉獻方案\n• 奉獻 8,000 元｜贈「讓家偉大 Family is Love」積木 1 箱（50 組）\n• 奉獻 15,000 元｜贈「讓家偉大 Family is Love」積木 2 箱\n• 奉獻 20,000 元｜贈「讓家偉大 Family is Love」積木 3 箱\n\n玩具我們已經準備好，\n只差您的一份愛。\n\n我們將把您的奉獻化為翅膀，\n親自送到偏鄉教會，\n讓孩子收到的不只是一份禮物，\n而是一份「被記得的溫暖」。`
  },
  { 
    id: 5, 
    title: '在你所在之處綻放', 
    imageUrl: 'https://media.ct.org.tw/upload/dedication_article/2025/12/08/69366c6361bfd.png',
    description: `Bloom in 2026 \n在你所在之處綻放\n\n在這劇烈搖晃、不確定的時代裡，\n我們不是感傷時光流逝，\n而是充滿信心、期待望向未來神要做的事。\n你呢？\n或許您去年精彩又轟轟烈烈，\n也或許是平淡如常的日子，\n無論如何，\n神絕對是超乎我們所想像的，\n\n「若 有 人 在 基 督 裡 ， 他 就 是 新 造 的 人 ， 舊 事 已 過 ， 都 變 成 新 的 了 。」\n在一年的開始，\n讓我們再次獻上，\n向神表明：\n我的思想、情感、意志，全然向祂，\n我要盡心盡心盡力，愛主我的神，\n全心跟隨他！\n論壇小同工\n \n用行動為2026年的自己祝福`
  },
  { 
    id: 6, 
    title: 'Impact Asia Alliance（IAA）—— 從亞洲開始，影響世界', 
    imageUrl: 'https://media.ct.org.tw/upload/dedication_article/2026/04/14/69ddb83f810ff.jpg',
    description: `身在「台灣」的你是非常關鍵的！\n\n神使用我們牽動全世界，神對福音、宣教的計畫亦然。\n\n掀起亞洲宣教旋風，不是我們單獨可以完成的，這是一個互相成全，互相扶持一起完成大使命的時代，教會也不再是關起門來做事工，所有人、所有教會都被邀請參與這場復興的運動中，讓我們一起回應神「去！使萬民作我的門徒」\n\n亞洲正站在全球轉變的中心。科技、文化、信仰與下一代的浪潮，都正在向亞洲匯聚。在這關鍵時刻，IAA 被呼召興起——成為亞洲教會的屬靈引擎與影響力平台。\n\nIAA 是什麼？\nIAA 不只是年會，而是一場以基督為中心的影響力運動。我們致力於打造一個新的「使命晶片」——啟動全球教會在媒體、領導力、跨國連結與文化影響力上的新模式。從馬來西亞、印尼、台灣，到震動日本的 2025 東京年會，亞洲正在被喚醒，而這只是開始。\n\n為什麼需要你的奉獻？\n因為影響力需要投入，需要願意看見未來的人。\n\n你的奉獻將支持：\n1. 亞洲領袖復興 — 裝備關鍵領袖，帶動城市改變。\n2. 新媒體宣教平台 — 建置多語影音中心，將福音傳向列國。\n3. 下一代興起 — 培育青年領袖、創意與AI媒體人才。\n4. 跨國年會與宣教行動 — 推動亞洲各地的連結與復興。\n\n每一分奉獻都會成為：\n一段改變生命的內容、一位被啟動的領袖、一個被點燃的城市。\n\n你的奉獻，是參與神在亞洲的故事\n這不是贊助活動，而是加入一場神國運動。當你奉獻，你就是與神一起建造亞洲、影響世界。亞洲興起，影響世界。\n\n讓我們一起，用奉獻啟動亞洲的未來。\n\n🎁 感恩回饋：\n奉獻 1,000 元(含)以上 致贈 紀念帆布袋 1 個+濃醇濾掛咖啡1組/ 5 包\n奉獻 3,000元(含)以上，即贈來自巴基斯坦的感恩禮「珍鹽Luminous禮盒(內含玫瑰鹽+黑鹽+小木匙一只)」\n奉獻 5,000元 成為IAA 亞洲論壇影響力 代禱勇士\n奉獻 50,000元 致贈 專屬黑卡 + IMPACT報紙五年\n奉獻 150,000元 致贈 專屬黑卡 + IMPACT報紙終身\n奉獻 50萬元 成為終身「亞洲影響力 親善大使」致贈 專屬黑卡 + IMPACT報紙終身 及 亞洲影響力國際年會貴賓席與免報名費 適用夫妻`
  }
];

export default function DonationPlanDetail({ planId }: DonationPlanDetailProps) {
  const plan = PLAN_DATA.find(p => p.id === planId) || PLAN_DATA[0];

  const [paymentType, setPaymentType] = useState<'one-time' | 'installment'>('one-time');
  const [selectedPreset, setSelectedPreset] = useState<string>('1000');
  const [customAmount, setCustomAmount] = useState<string>('');
  const [installmentPeriod, setInstallmentPeriod] = useState<string>('6');
  const [paymentMethod, setPaymentMethod] = useState<'credit-card' | 'line-pay'>('credit-card');
  const [address, setAddress] = useState('');
  const [receiptAddress, setReceiptAddress] = useState('');
  const [giftAddress, setGiftAddress] = useState('');
  const [receiptOption, setReceiptOption] = useState('年度匯開');

  const inputClassName = "w-full bg-theme-text/5 border border-theme-text/20 rounded-sm py-3 px-4 text-base text-theme-text focus:outline-none focus:border-brand-red focus:bg-transparent transition-colors placeholder-theme-text/30";

  const presetAmounts = ['1000', '3000', '5000', '10000', '50000'];

  return (
    <div className="w-full min-h-[100dvh] md:h-[100dvh] md:overflow-hidden flex flex-col md:flex-row pt-[90px] md:pt-0 bg-theme-bg transition-colors duration-500">
      
      {/* Left Area - Main Image & Copywriting */}
      <div className="w-full md:w-[45%] h-auto md:h-full flex flex-col bg-theme-bg md:border-r border-theme-text/10 overflow-y-auto scrollbar-hide md:pt-[130px]">
        <div className="w-full md:min-h-[40vh] md:max-h-[55vh] relative flex-shrink-0 bg-theme-bg flex items-center justify-center overflow-hidden">
          <img 
            src={plan.imageUrl} 
            alt={plan.title} 
            className="w-full h-auto md:h-full object-cover" 
          />
        </div>
        <div className="p-8 md:p-12 lg:p-16 flex flex-col bg-theme-bg text-theme-text flex-grow">
          <span className="font-display text-brand-red text-xs md:text-sm tracking-[0.4em] uppercase mb-4 block font-bold">Support Plan</span>
          <h1 className="text-3xl md:text-4xl lg:text-[40px] font-serif font-black leading-[1.2] text-theme-text mb-8">
            {plan.title.split('——').map((part, i) => <React.Fragment key={i}>{part}{i === 0 && '——'}<br className="hidden md:block"/></React.Fragment>)}
          </h1>
          <div className="text-theme-text/80 font-light text-base md:text-lg leading-relaxed md:leading-loose space-y-6 max-w-2xl">
            {plan.description.split('\n').map((line, idx) => (
              line.trim() !== '' ? <p key={idx}>{line}</p> : null
            ))}
          </div>
        </div>
      </div>
      
      {/* Right Area - Form Form  */}
      <div className="w-full md:w-[55%] h-auto md:h-full flex flex-col p-6 pb-24 md:px-16 md:pb-16 md:pt-[130px] lg:px-24 lg:pb-24 lg:pt-[130px] overflow-y-auto overflow-x-hidden relative scrollbar-hide">
        <div className="w-full max-w-xl mx-auto md:mx-0 xl:mr-auto space-y-10 md:space-y-12 pb-10">
          
          {/* Header */}
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-black text-theme-text mb-2 transition-colors">奉獻方案支持</h2>
            <p className="text-theme-text/60 font-light transition-colors">請選擇您的奉獻方式與金額，支持我們的事工發展。</p>
          </div>

          <form className="space-y-10" onSubmit={(e) => e.preventDefault()}>
            
            {/* Step 1: Payment Type (單次/分期) */}
            <div className="space-y-4">
              <label className="flex items-center gap-2 font-display text-xs md:text-sm font-bold uppercase tracking-[0.2em] mb-4 text-theme-text/60 transition-colors">
                <span className="w-6 h-6 rounded-full bg-brand-red text-white flex items-center justify-center text-[10px]">1</span>
                捐款頻率
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  type="button"
                  onClick={() => { setPaymentType('one-time'); setCustomAmount(''); }}
                  className={`py-4 md:py-6 border rounded-sm font-serif font-black text-xl transition-all duration-300 relative overflow-hidden ${paymentType === 'one-time' ? 'border-brand-red bg-brand-red text-white shadow-md transform -translate-y-0.5' : 'border-theme-text/20 bg-theme-text/5 text-theme-text hover:bg-theme-text hover:text-theme-bg'}`}
                >
                  單次奉獻
                </button>
                <button 
                  type="button"
                  onClick={() => { setPaymentType('installment'); setCustomAmount(''); }}
                  className={`py-4 md:py-6 border rounded-sm font-serif font-black text-xl transition-all duration-300 relative overflow-hidden ${paymentType === 'installment' ? 'border-brand-red bg-brand-red text-white shadow-md transform -translate-y-0.5' : 'border-theme-text/20 bg-theme-text/5 text-theme-text hover:bg-theme-text hover:text-theme-bg'}`}
                >
                   定期定額
                </button>
              </div>
            </div>

            {/* Step 2: Amount */}
            <div className="space-y-4">
              <label className="flex items-center gap-2 font-display text-xs md:text-sm font-bold uppercase tracking-[0.2em] mb-4 text-theme-text/60 transition-colors">
                <span className="w-6 h-6 rounded-full bg-brand-red text-white flex items-center justify-center text-[10px]">2</span>
                選擇金額
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
                {presetAmounts.map((amt) => (
                  <button 
                    key={amt}
                    type="button" 
                    onClick={() => { setSelectedPreset(amt); setCustomAmount(''); }}
                    className={`py-3 md:py-4 border font-display font-bold text-lg md:text-xl transition-all duration-300 rounded-sm ${selectedPreset === amt && customAmount === '' ? 'border-brand-red bg-brand-red text-white shadow-md transform -translate-y-0.5' : 'border-theme-text/20 bg-theme-text/5 text-theme-text hover:bg-theme-text hover:text-theme-bg'}`}
                  >
                    {amt}
                  </button>
                ))}
              </div>

              {/* Custom Amount for Both Types */}
              <div className={`mt-4 pt-4 border-t border-theme-text/10 transition-all duration-500 overflow-hidden`}>
                <p className="text-theme-text/60 text-sm mb-3">或自行輸入金額 (至少 NT$ 100)</p>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-display font-bold text-theme-text/40 group-focus-within:text-brand-red transition-colors">NT$</span>
                  <input 
                    type="number" 
                    placeholder="自訂金額" 
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setSelectedPreset('');
                    }}
                    className="w-full bg-theme-text/5 border border-theme-text/20 rounded-sm py-4 pl-14 pr-4 text-lg font-display text-theme-text focus:outline-none focus:border-brand-red focus:bg-transparent transition-colors disabled:opacity-50" 
                    min="100"
                  />
                </div>
              </div>

              {/* Installment Period Selector */}
              {paymentType === 'installment' && (
                <div className="mt-8 pt-4 border-t border-theme-text/10">
                  <p className="flex items-center gap-2 font-display text-xs md:text-sm font-bold uppercase tracking-[0.2em] mb-4 text-theme-text/60 transition-colors">
                    <span className="w-6 h-6 rounded-full bg-brand-red text-white flex items-center justify-center text-[10px]">2.1</span>
                    選擇分期期數
                  </p>
                  <div className="grid grid-cols-3 gap-3 md:gap-4">
                    {['6', '12', '18'].map((period) => (
                      <button 
                        key={period}
                        type="button" 
                        onClick={() => setInstallmentPeriod(period)}
                        className={`py-3 md:py-4 border font-display font-bold text-lg transition-all duration-300 rounded-sm ${installmentPeriod === period ? 'border-brand-red bg-brand-red text-white shadow-md transform -translate-y-0.5' : 'border-theme-text/20 bg-theme-text/5 text-theme-text hover:bg-theme-text hover:text-theme-bg'}`}
                      >
                        {period} 期
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Step 3: Payment Method */}
            <div className="space-y-4">
              <label className="flex items-center gap-2 font-display text-xs md:text-sm font-bold uppercase tracking-[0.2em] mb-4 text-theme-text/60 transition-colors">
                <span className="w-6 h-6 rounded-full bg-brand-red text-white flex items-center justify-center text-[10px]">3</span>
                付款方式
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div 
                  onClick={() => setPaymentMethod('credit-card')}
                  className={`border p-4 cursor-pointer rounded-sm flex items-center gap-4 transition-all duration-300 ${paymentMethod === 'credit-card' ? 'border-brand-red bg-brand-red text-white shadow-md transform -translate-y-0.5' : 'border-theme-text/20 bg-theme-text/5 hover:bg-theme-text/10'}`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex flex-shrink-0 items-center justify-center transition-colors ${paymentMethod === 'credit-card' ? 'border-white' : 'border-theme-text/40'}`}>
                    <div className={`w-2.5 h-2.5 rounded-full bg-white transition-transform duration-300 ${paymentMethod === 'credit-card' ? 'scale-100' : 'scale-0'}`}></div>
                  </div>
                  <div className="flex flex-col">
                    <span className={`font-bold transition-colors ${paymentMethod === 'credit-card' ? 'text-white' : 'text-theme-text'}`}>信用卡付款</span>
                    <span className={`text-xs transition-colors ${paymentMethod === 'credit-card' ? 'text-white/70' : 'text-theme-text/50'}`}>Credit Card</span>
                  </div>
                  <i className={`fas fa-credit-card ml-auto text-xl transition-colors ${paymentMethod === 'credit-card' ? 'text-white' : 'text-theme-text/30'}`}></i>
                </div>
                
                <div 
                  onClick={() => setPaymentMethod('line-pay')}
                  className={`border p-4 cursor-pointer rounded-sm flex items-center gap-4 transition-all duration-300 ${paymentMethod === 'line-pay' ? 'border-brand-red bg-brand-red text-white shadow-md transform -translate-y-0.5' : 'border-theme-text/20 bg-theme-text/5 hover:bg-theme-text/10'}`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex flex-shrink-0 items-center justify-center transition-colors ${paymentMethod === 'line-pay' ? 'border-white' : 'border-theme-text/40'}`}>
                    <div className={`w-2.5 h-2.5 rounded-full bg-white transition-transform duration-300 ${paymentMethod === 'line-pay' ? 'scale-100' : 'scale-0'}`}></div>
                  </div>
                  <div className="flex flex-col">
                    <span className={`font-bold transition-colors ${paymentMethod === 'line-pay' ? 'text-white' : 'text-theme-text'}`}>Line Pay</span>
                    <span className={`text-xs transition-colors ${paymentMethod === 'line-pay' ? 'text-white/70' : 'text-theme-text/50'}`}>Mobile Payment</span>
                  </div>
                  <div className="ml-auto flex items-center justify-center w-8 h-8 rounded-full bg-[#00B900] text-white">
                    <i className="fab fa-line text-lg"></i>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4: Donor Info  */}
            <div className="space-y-6 pt-8 border-t border-theme-text/10">
              <label className="flex items-center gap-2 font-display text-xs md:text-sm font-bold uppercase tracking-[0.2em] mb-4 text-theme-text/60 transition-colors">
                <span className="w-6 h-6 rounded-full bg-brand-red text-white flex items-center justify-center text-[10px]">4</span>
                填寫資料
              </label>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-theme-text/80">姓名 <span className="text-brand-red">*</span></label>
                    <input type="text" placeholder="真實姓名" className={inputClassName} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-theme-text/80">電話 <span className="text-brand-red">*</span></label>
                    <input type="tel" placeholder="聯絡電話" className={inputClassName} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-theme-text/80">Email <span className="text-brand-red">*</span></label>
                  <input type="email" placeholder="電子信箱" className={inputClassName} />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-theme-text/80">聯絡地址 <span className="text-brand-red">*</span></label>
                  <input type="text" placeholder="聯絡地址" value={address} onChange={(e) => setAddress(e.target.value)} className={inputClassName} />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-end">
                    <label className="text-sm font-bold text-theme-text/80">奉獻收據地址 <span className="text-brand-red">*</span></label>
                    <button type="button" onClick={() => setReceiptAddress(address)} className="text-[12px] font-bold text-brand-red hover:bg-brand-red hover:text-white transition-colors border border-brand-red/30 px-3 py-1 rounded-sm">同聯絡地址</button>
                  </div>
                  <input type="text" placeholder="收據寄送地址" value={receiptAddress} onChange={(e) => setReceiptAddress(e.target.value)} className={inputClassName} />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-end">
                    <label className="text-sm font-bold text-theme-text/80">奉獻贈禮寄送地址 <span className="text-brand-red">*</span></label>
                    <button type="button" onClick={() => setGiftAddress(address)} className="text-[12px] font-bold text-brand-red hover:bg-brand-red hover:text-white transition-colors border border-brand-red/30 px-3 py-1 rounded-sm">同聯絡地址</button>
                  </div>
                  <input type="text" placeholder="贈禮寄送地址" value={giftAddress} onChange={(e) => setGiftAddress(e.target.value)} className={inputClassName} />
                </div>

                <div className="space-y-3 pt-4 border-t border-theme-text/10">
                  <label className="text-sm font-bold text-theme-text/80">收據寄送選項 <span className="text-brand-red">*</span></label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {['年度匯開', '按月寄送', '不需收據'].map(opt => (
                      <button 
                        key={opt}
                        type="button"
                        onClick={() => setReceiptOption(opt)}
                        className={`py-3 border text-sm md:text-base font-bold transition-all duration-300 rounded-sm ${receiptOption === opt ? 'border-brand-red bg-brand-red text-white' : 'border-theme-text/20 bg-theme-text/5 text-theme-text hover:bg-theme-text/10'}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-theme-text/80">收據抬頭 <span className="text-xs opacity-60 ml-2 font-normal">(選填)</span></label>
                    <input type="text" placeholder="收據抬頭" className={inputClassName} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-theme-text/80">統一編號 <span className="text-xs opacity-60 ml-2 font-normal">(選填)</span></label>
                    <input type="text" placeholder="統一編號" className={inputClassName} />
                  </div>
                </div>

              </div>
            </div>

            {/* Submit */}
            <button type="submit" className="w-full py-5 md:py-6 bg-theme-text text-theme-bg font-display font-black text-xl uppercase tracking-[0.2em] hover:bg-brand-red hover:text-white transition-all transform hover:-translate-y-1 hover:shadow-xl mt-8 rounded-sm flex items-center justify-center gap-3">
                前往結帳 
                <span className="font-sans font-light text-sm opacity-80">(NT$ {customAmount || selectedPreset})</span>
                <i className="fas fa-arrow-right ml-2"></i>
            </button>
            <p className="text-center text-xs text-theme-text/40 mt-4">
              點擊結帳即表示您同意我們的服務條款與隱私權政策。
            </p>

            {/* Other Payment Methods Section */}
            <div className="mt-16 pt-12 border-t border-theme-text/10 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 fill-mode-both">
              <h3 className="text-2xl md:text-3xl font-serif font-black text-theme-text/90 transition-colors">
                其他付款方式
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Postal Transfer */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-6 bg-brand-red/30 rounded-full"></div>
                    <h4 className="text-lg font-bold text-theme-text">郵政劃撥</h4>
                  </div>
                  <div className="text-theme-text/70 space-y-2 text-base md:text-lg pl-4">
                    <p className="flex items-center gap-2">
                      <span className="text-theme-text/40 text-sm font-display font-bold">帳號</span> 
                      00064331
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="text-theme-text/40 text-sm font-display font-bold whitespace-nowrap mt-1">戶名</span> 
                      財團法人基督教論壇基金會
                    </p>
                  </div>
                </div>

                {/* ATM Transfer */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-6 bg-brand-red/30 rounded-full"></div>
                    <h4 className="text-lg font-bold text-theme-text">ATM轉帳</h4>
                  </div>
                  <div className="text-theme-text/70 space-y-2 text-base md:text-lg pl-4">
                    <div className="flex flex-col md:gap-1">
                      <p className="flex flex-wrap items-center gap-x-2 md:gap-x-3">
                        <span className="text-theme-text/40 text-sm font-display font-bold whitespace-nowrap">銀行代碼</span> 
                        <span className="text-theme-text/90 font-bold">008</span>
                        <span className="md:hidden text-theme-text/50 text-sm font-medium">華南商業銀行新生分行</span>
                      </p>
                      <p className="hidden md:block text-theme-text/50 text-sm md:text-base font-medium pl-[4.2rem]">
                        華南商業銀行新生分行
                      </p>
                    </div>
                    <p className="flex items-center gap-2">
                      <span className="text-theme-text/40 text-sm font-display font-bold">帳號</span> 
                      113-20-0391766
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="text-theme-text/40 text-sm font-display font-bold whitespace-nowrap mt-1">戶名</span> 
                      財團法人基督教論壇基金會
                    </p>
                  </div>
                </div>
              </div>

              {/* Red Notice Section */}
              <div className="bg-brand-red/[0.03] border border-brand-red/10 p-8 rounded-sm space-y-4 transition-all hover:bg-brand-red/[0.05]">
                <p className="text-brand-red font-black text-lg flex items-center gap-2">
                  <i className="fas fa-exclamation-circle text-base"></i>
                  匯款後請來電告知帳號末五碼
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-brand-red/80 text-base md:text-lg font-medium">
                  <div className="flex items-center gap-3">
                    <i className="fas fa-phone-alt text-sm opacity-60"></i>
                    <p>Tel: (02) 2396-1010</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <i className="fas fa-fax text-sm opacity-60"></i>
                    <p>Fax: (02) 2396-1309</p>
                  </div>
                </div>
                <p className="text-brand-red/80 text-base md:text-lg font-medium flex items-center gap-3">
                  <i className="fas fa-envelope text-sm opacity-60"></i>
                  <span>或來信告知後五碼：<a href="mailto:service@ct.org.tw" className="underline hover:text-brand-red transition-colors font-bold">service@ct.org.tw</a></span>
                </p>
                <div className="pt-4 mt-4 border-t border-brand-red/10">
                  <p className="text-brand-red font-black text-xl flex items-center gap-2">
                    <i className="fas fa-check-circle text-base"></i>
                    並請註明奉獻方案
                  </p>
                </div>
              </div>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}
