export const NEWS_CATEGORIES = ['最新文章', '基督教論壇報', '人物見證', '專欄', '影響力聯盟', '生活情報', '信仰知識庫'];

export interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  imageUrl: string;
  content?: string;
}

export const MOCK_NEWS: NewsItem[] = [
  // Panel 1: 最新文章 (5 items)
  {
    id: 1,
    title: '從呼召辨識到AI時代神學院裝備：張宰金牧師談事奉者的關鍵能力',
    excerpt: '中台神學院副院長張宰金牧師指出，在 AI 快速崛起的背景下，未來事奉者除了扎實的神學裝備，更需具備屬靈深度與跨領域能力。',
    category: '專題報導',
    author: '陳秀雯',
    date: 'APR 11',
    imageUrl: 'hhttps://media.ct.org.tw/upload/news_article/2026/04/10/69d897e430ea7.jpg?wm=LB',
    content: `
      <p class="drop-cap">中台神學院副院長張宰金牧師指出，在 AI 快速崛起的背景下，未來事奉者除了扎實的神學裝備，更需具備屬靈深度與跨領域能力。他提出「三重印證」作為辨識呼召的原則，並建議將 AI 視為工具而非依賴。</p>

      <h2>呼召是逐步清晰的過程</h2>
      <p>張副院長提出「三重印證」原則：1. 內在負擔（長期對特定族群或議題的關注）；2. 恩賜能力（上帝的呼召伴隨相應能力）；3. 外在印證（教會牧者、屬靈長輩的觀察與肯定）。</p>

      <h2>五大事奉類型</h2>
      <p>歸納為：牧會型、宣教型、輔導關懷型、教導學術型、機構事奉型。事奉者可跨足不同領域，但應有一個主要方向。</p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 my-10 md:my-16">
          <div class="w-full aspect-[4/5] bg-theme-text/5 border border-theme-text/10 overflow-hidden transition-colors">
            <img src="https://ct.org.tw/upload/news_article_cms/2026/04/10/10368_4840_%E5%BC%B5%E5%AE%B0%E9%87%91%E7%89%A7%E5%B8%AB_2.jpg" onerror="this.src='https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800'" class="w-full h-full object-cover grayscale opacity-80 hover:grayscale-0 hover:opacity-100 hover:scale-105 transition-all duration-700" alt="張宰金牧師授課" />
          </div>
          <div class="w-full aspect-[4/5] bg-theme-text/5 border border-theme-text/10 overflow-hidden md:mt-12 transition-colors">
            <img src="https://ct.org.tw/upload/news_article_cms/2026/04/10/25585_4840_%E5%BC%B5%E5%AE%B0%E9%87%91%E7%89%A7%E5%B8%AB_3.jpg" onerror="this.src='https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=800'" class="w-full h-full object-cover grayscale opacity-80 hover:grayscale-0 hover:opacity-100 hover:scale-105 transition-all duration-700" alt="會心園諮商" />
          </div>
      </div>
      <p class="text-xs md:text-sm opacity-60 text-center -mt-6 md:-mt-10 mb-10 font-bold tracking-widest text-theme-text">圖：張宰金牧師授課時情景 / 會心園諮商中心 (神學院提供)</p>

      <div class="w-full my-12 md:my-24 py-12 md:py-24 border-y border-theme-text/10 bg-theme-text/5 relative flex justify-center overflow-hidden transition-colors">
          <div class="absolute -top-10 md:-top-16 text-[120px] md:text-[200px] font-serif text-theme-text/5 leading-none pointer-events-none">“</div>
          <h2 class="font-serif text-2xl sm:text-3xl md:text-4xl text-theme-text text-center max-w-4xl leading-[1.4] md:leading-[1.3] font-black px-4 md:px-6 z-10 mx-auto transition-colors" style="border: none; padding-left: 0; margin: 0;">
              AI 不會取代真正的牧者，<span class="text-brand-red">但會淘汰缺乏屬靈深度與思考能力的人</span>。
          </h2>
      </div>

      <h2>選擇神學院的評估標準</h2>
      <p>包含：課程取向（實務或學術）、實習制度（如中台神學院的週末實習）、神學立場、地域語言以及與教會的連結。</p>

      <h2>AI 浪潮下的轉型：淺層知識將被淘汰</h2>
      <p>AI 不會取代真正的牧者，但會淘汰缺乏屬靈深度與思考能力的人。張牧師強調不可直接複製 AI 生成的講章，也不可用 AI 取代靈修與默想。</p>

      <h2>未來事奉者的四大關鍵能力</h2>
      <p>1. 屬靈深度（力量來源）；2. 神學判斷力（資訊辨別）；3. 人際關係與陪伴能力（AI 難以取代）；4. 跨領域能力（涵蓋心理學、社會學與媒體科技）。</p>

      <p class="mt-8 text-sm text-theme-text/80 font-bold bg-theme-text/5 p-4 border-l-4 border-brand-red">聯絡資訊：中台神學院「會心園」諮商資源：04-23780510 #18 曾姊妹。</p>
    `
  },
  { id: 7, title: '青年世代的信仰覺醒：從數位原住民到真理追尋者', excerpt: '在充滿雜訊的網路世界中，新一代年輕人如何透過社群媒體找到心靈的歸屬與信仰的真實。', category: '最新文章', author: '青年事工', date: 'APR 10', imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953eb1b5ce?auto=format&fit=crop&q=80&w=1600' },
  { id: 8, title: '跨越國界的愛：醫療宣教團的非洲紀實', excerpt: '深入偏鄉，這群醫療人員不僅帶來了醫學的療癒，更帶來了超越語言與文化的愛與盼望。', category: '最新文章', author: '國際新聞', date: 'APR 11', imageUrl: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&q=80&w=1600' },
  { id: 9, title: '城市綠洲：教會空間改造的社區影響力', excerpt: '打破高牆，現代教會如何透過空間設計與開放態度，成為社區居民日常交流與心靈休憩的中心。', category: '最新文章', author: '社區發展', date: 'APR 12', imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1600' },
  { id: 10, title: 'AI 時代的牧養挑戰：科技與靈性的對話', excerpt: '當人工智慧逐漸取代日常工作，我們該如何重新定義人的價值，並在科技洪流中持守信仰的核心。', category: '最新文章', author: '科技與信仰', date: 'APR 13', imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1600' },

  // Panel 2: 專欄 (5 items)
  { id: 2, title: '科技與人性的失衡：社群媒體成癮案的反思', excerpt: '法官的判決不僅是法律裁定，更是一記警鐘，提醒我們在演算法的時代中，如何奪回靈魂的自主權。', category: '專欄', author: '主筆室', date: 'APR 08', imageUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=1600' },
  { id: 11, title: '孤獨經濟下的心靈解藥', excerpt: '在看似擁擠卻無比孤獨的現代社會，我們需要的不是更多的娛樂，而是真實而深刻的關係連結。', category: '專欄', author: '社會觀察', date: 'APR 07', imageUrl: 'https://images.unsplash.com/photo-1516302752625-fcc3c50ae61f?auto=format&fit=crop&q=80&w=1600' },
  { id: 12, title: '職場如戰場？重塑工作神學的新視角', excerpt: '工作不只是為了糊口，更是實踐呼召的場域。探討如何在競爭激烈的職場中活出信仰的價值。', category: '專欄', author: '職場論壇', date: 'APR 06', imageUrl: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=1600' },
  { id: 13, title: '後疫情時代的家庭重塑', excerpt: '疫情改變了我們的工作與生活型態，也迫使我們重新檢視家庭關係的脆弱與堅韌。', category: '專欄', author: '家庭事工', date: 'APR 05', imageUrl: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&q=80&w=1600' },
  { id: 14, title: '氣候變遷與管家職分：基督徒的環保責任', excerpt: '面對日益嚴峻的生態危機，我們不能再置身事外。探討信仰如何驅動我們成為地球更好的管家。', category: '專欄', author: '生態神學', date: 'APR 04', imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1600' },

  // Panel 3: 人物見證 (5 items)
  { id: 3, title: '從科技菁英到全職傳道：林牧師的翻轉人生', excerpt: '曾經是高階主管，經歷人生重大挫折後重新認識信仰，最終回應呼召的真實故事。', category: '人物見證', author: '人物誌', date: 'APR 07', imageUrl: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80&w=1600' },
  { id: 15, title: '破繭而出：一位前幫派份子的重生之路', excerpt: '在黑暗中徘徊多年，直到遇見那道不可思議的光，他的人生從此不再一樣。', category: '人物見證', author: '生命故事', date: 'APR 06', imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1600' },
  { id: 16, title: '音符中的醫治：盲人鋼琴家的奇異恩典', excerpt: '失去視力卻獲得了更敏銳的聽覺與心靈，她用音樂撫慰了無數受傷的靈魂。', category: '人物見證', author: '藝術與信仰', date: 'APR 05', imageUrl: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&q=80&w=1600' },
  { id: 17, title: '商場上的光與鹽：企業家的誠信考驗', excerpt: '在利益與道德的十字路口，他選擇了看似吃虧卻滿有平安的道路，最終贏得了真正的尊重。', category: '人物見證', author: '職場見證', date: 'APR 04', imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=1600' },
  { id: 18, title: '走過死蔭幽谷：抗癌鬥士的盼望之歌', excerpt: '面對疾病的無情打擊，她沒有選擇放棄，而是用堅定的信仰譜寫出生命的奇蹟。', category: '人物見證', author: '醫療見證', date: 'APR 03', imageUrl: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&q=80&w=1600' },

  // Panel 4: 生活情報 (5 items)
  { id: 4, title: '快節奏都市裡的「慢靈修」生活美學', excerpt: '在喧囂的城市中，我們如何為自己的心靈保留一片安靜的綠洲？這是一種需要刻意練習的生活方式。', category: '生活情報', author: '副刊編輯', date: 'APR 04', imageUrl: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&q=80&w=1600' },
  { id: 19, title: '週末提案：走訪五間隱身巷弄的特色書房', excerpt: '放下手機，走進這些充滿書香與咖啡香的空間，享受一個與文字和心靈對話的悠閒午後。', category: '生活情報', author: '藝文生活', date: 'APR 03', imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80&w=1600' },
  { id: 20, title: '餐桌上的信仰：用料理傳遞愛與溫暖', excerpt: '分享幾道簡單卻充滿故事的家常菜食譜，讓每一次的共餐都成為凝聚家人情感的美好時刻。', category: '生活情報', author: '家庭生活', date: 'APR 02', imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=1600' },
  { id: 21, title: '親子共讀指南：挑選優質的兒童信仰繪本', excerpt: '透過生動的故事與精美的插畫，將信仰的種子悄悄種在孩子的心田，陪伴他們健康成長。', category: '生活情報', author: '親子教育', date: 'APR 01', imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=1600' },
  { id: 22, title: '極簡生活實踐：從斷捨離到心靈的自由', excerpt: '減少物質的羈絆，不僅能讓生活空間更清爽，更能讓我們將焦點轉向真正重要的人事物。', category: '生活情報', author: '生活風格', date: 'MAR 31', imageUrl: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&q=80&w=1600' },

  // Panel 5: 信仰知識庫 (5 items)
  { id: 5, title: '當代藝術與古老信仰符號的跨界對話', excerpt: '專訪知名策展人，深入了解他們如何透過極簡的現代藝術手法，重新詮釋千年的信仰圖騰。', category: '信仰知識庫', author: '視覺藝術', date: 'APR 02', imageUrl: 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?auto=format&fit=crop&q=80&w=1600' },
  { id: 23, title: '聖經考古新發現：重塑我們對歷史的理解', excerpt: '最新的考古挖掘成果，為聖經記載的歷史事件提供了更豐富的背景與佐證，令人振奮。', category: '信仰知識庫', author: '歷史研究', date: 'APR 01', imageUrl: 'https://images.unsplash.com/photo-1535905557558-afc4877a26fc?auto=format&fit=crop&q=80&w=1600' },
  { id: 24, title: '神學入門：理解恩典與真理的平衡', excerpt: '以淺顯易懂的方式，探討基督教信仰中兩個最核心卻也最常被誤解的概念，幫助信徒建立穩固的根基。', category: '信仰知識庫', author: '神學教育', date: 'MAR 31', imageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=1600' },
  { id: 25, title: '早期教會的敬拜模式：從家庭聚會到大教堂', excerpt: '追溯基督教敬拜形式的演變，從初代教會的簡單樸素，到後來發展出的豐富儀式與傳統。', category: '信仰知識庫', author: '教會歷史', date: 'MAR 30', imageUrl: 'https://images.unsplash.com/photo-1548625361-f6dbcd00fa9e?auto=format&fit=crop&q=80&w=1600' },
  { id: 6, title: '影響力聯盟 2026 年度高峰會盛大展開', excerpt: '匯聚全球百位講員，共同探討未來社會、商業與信仰的深度結合。', category: '影響力聯盟', author: '活動中心', date: 'MAR 28', imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1600' },
  { id: 6, title: '影響力聯盟 2026 年度高峰會盛大展開', excerpt: '匯聚全球百位講員，共同探討未來社會、商業與信仰的深度結合。', category: '影響力聯盟', author: '活動中心', date: 'MAR 28', imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1600' },
];

export interface AdItem {
  id: string;
  sponsor: string;
  title: string;
  description: string;
  imageUrl: string;
  link: string;
}

export const MOCK_ADS: Record<string, AdItem> = {
  infeed: {
    id: 'ad-infeed-1',
    sponsor: '全球論壇',
    title: '重新定義信仰與工作：2026 職場特會開放報名',
    description: '匯集國內外領袖，為新世代信徒量身打造的實戰工作坊。',
    imageUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=800',
    link: '#',
  },
  inline: {
    id: 'ad-inline-1',
    sponsor: '質感好物選',
    title: '安靜靈修的最佳伴侶',
    description: '手工浸蠟與皮革書衣，讓專屬於你的靜謐時刻更有溫度。',
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800',
    link: '#',
  },
  sidebar: {
    id: 'ad-sidebar-1',
    sponsor: '影響力聯盟',
    title: 'IMPACT 會員招募中',
    description: '加入成為影響力領袖，獨家獲得最新雙週刊。',
    imageUrl: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&q=80&w=800',
    link: '#',
  },
  accordion: {
    id: 'ad-accordion-1',
    sponsor: '特別呈獻',
    title: '世界願景：看見孩童的需求',
    description: '從基礎醫療到教育資源，你的關注能改變生命。',
    imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=1600',
    link: '#',
  },
  header: {
    id: 'ad-header-1',
    sponsor: '獨家贊助',
    title: ' IMPACT 會員招募中',
    description: '享受無廣告閱讀與專屬內容。',
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800',
    link: '#',
  }
};

export const dummyContentPart1 = `
  <p class="drop-cap">在這個資訊爆炸的時代，我們每天被無數的訊息淹沒。然而，真正能觸動人心、改變生命的內容，往往隱藏在喧囂之外的安靜角落裡。這不是單純的資訊傳遞，而是一種靈魂的共振。</p>
  <p>根據最新的觀察顯示，那些願意主動擁抱改變、並將信仰落實於社區關懷的群體，其展現出的韌性與生命力都顯著高於平均值。我們看到許多年輕世代利用新媒體工具，創造出前所未有的連結方式。</p>
  <h2>在變動中尋找永恆的價值</h2>
  <p>科技不再只是冰冷的演算法，而是傳遞溫度的載體。這是一個極端的時代，極端的疏離，卻也孕育著極端渴望連結的心。面對這樣的世界，我們需要更多的聆聽與理解。</p>
`;

export const dummyContentPart2 = `
  <div class="w-full my-12 md:my-24 py-12 md:py-24 border-y border-theme-text/10 bg-theme-text/5 relative flex justify-center overflow-hidden transition-colors">
      <div class="absolute -top-10 md:-top-16 text-[120px] md:text-[200px] font-serif text-theme-text/5 leading-none pointer-events-none">“</div>
      <h2 class="font-serif text-2xl sm:text-3xl md:text-5xl text-theme-text text-center max-w-4xl leading-[1.4] md:leading-[1.3] font-black px-4 md:px-6 z-10 mx-auto transition-colors" style="border: none; padding-left: 0; margin: 0;">
          當世界越黑暗，<span class="text-brand-red">真理的光就越發明亮</span>。這不僅是一個時代的挑戰，更是我們覺醒的契機。
      </h2>
  </div>
  <p>未來的道路或許仍有波折，但憑藉著同心合一的行動與對價值的堅持，我們深信這股改變的火苗將持續燃燒，照亮每一個陰暗的角落。</p>
  <p>這是一場心靈的革命，從我們每一個人開始。拒絕被演算法綁架，重新奪回我們對生活與真理的詮釋權。當我們願意停下腳步，傾聽內在的聲音，生命將會展現出前所未有的深度與廣度。</p>
`;
