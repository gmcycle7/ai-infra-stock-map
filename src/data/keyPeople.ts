import type { KeyPerson, LeadershipScores } from "../types";
import { LEADERSHIP_WEIGHTS } from "../types";

// =====================================================================
// 公司掌權者 / 創辦人對照 + 領導力評分（10 維度加權）
//
// 評分原則：
//  - 僅列出公開可查證之 CEO / Chairman / Founder
//  - 10 維度 × 0-5，加權合成 0-100；權重見 LEADERSHIP_WEIGHTS
//  - 任期短或公開資訊有限者，僅記姓名 + 職位，不打分
//  - 評分主觀，目的在「跨公司一致基準」，不代表預測
// =====================================================================

// 簡寫工具：依序列出 10 維度分數
function L(
  strategicJudgement: number,
  execution: number,
  capitalAllocation: number,
  technicalProductInsight: number,
  talentOrganization: number,
  integrityGovernance: number,
  customerEcosystem: number,
  resilience: number,
  financialDiscipline: number,
  communication: number,
): LeadershipScores {
  return {
    strategicJudgement,
    execution,
    capitalAllocation,
    technicalProductInsight,
    talentOrganization,
    integrityGovernance,
    customerEcosystem,
    resilience,
    financialDiscipline,
    communication,
  };
}

export const keyPeopleById: Record<string, KeyPerson[]> = {
  // --- AI 運算晶片 ---
  nvidia: [
    {
      role: "Co-founder / CEO",
      name: "Jensen Huang",
      nameZh: "黃仁勳",
      since: 1993,
      bio: "1993 共同創辦 Nvidia，從遊戲顯卡起家；CUDA 戰略前瞻性是當前 AI 算力霸權根本。多次大週期堅持並轉型；矽谷最有遠見的執行長之一。",
      // strat exe cap tech talent integ cust resil fin comm
      leadership: L(5, 5, 5, 5, 4, 4, 5, 5, 5, 5),
      leadershipConfidence: "High",
    },
  ],
  amd: [
    {
      role: "CEO / Chair",
      name: "Lisa Su",
      nameZh: "蘇姿丰",
      since: 2014,
      bio: "2014 接手瀕臨破產 AMD，以 Zen 架構 + chiplet 復興；EPYC 重建 server CPU 市占。工程背景 + 冷靜執行力著稱；公開承諾大致兌現。",
      leadership: L(4, 5, 4, 5, 5, 5, 4, 5, 4, 5),
      leadershipConfidence: "High",
    },
  ],
  intel: [
    {
      role: "CEO",
      name: "Lip-Bu Tan",
      nameZh: "陳立武",
      since: 2025,
      bio: "Cadence 前 CEO（2009-2021）期間股價成長 10 倍；2025 接任 Intel，主導 18A 量產與 IFS 轉型。任期尚短。",
      leadership: L(4, 4, 4, 4, 4, 4, 4, 4, 4, 4),
      leadershipConfidence: "Medium",
    },
  ],
  broadcom: [
    {
      role: "President / CEO",
      name: "Hock Tan",
      nameZh: "陳福陽",
      since: 2006,
      bio: "20 年穩定執掌 Broadcom（原 Avago）；以連環併購 + 嚴格成本控制建立半導體 + 軟體巨人。風格集權；併購整合手法被質疑壓榨被併公司文化。",
      leadership: L(5, 5, 5, 4, 3, 3, 4, 5, 5, 3),
      leadershipConfidence: "High",
    },
  ],
  marvell: [
    {
      role: "CEO",
      name: "Matt Murphy",
      since: 2016,
      bio: "2016 從 Maxim 接掌；主導 Cavium、Inphi、Innovium 等併購，轉型成資料中心 ASIC + 光通訊 DSP；近年 Trainium 訂單帶動成長。",
      leadership: L(4, 4, 4, 4, 4, 4, 4, 4, 4, 4),
      leadershipConfidence: "Medium",
    },
  ],
  alchip: [
    {
      role: "Founder / CEO",
      name: "Johnny Shen",
      nameZh: "沈翔霖",
      bio: "Alchip 創辦人，深耕高效能 ASIC 設計服務多年；與多家北美 hyperscaler 建立深度合作。",
      leadership: L(4, 4, 3, 5, 4, 4, 4, 4, 3, 3),
      leadershipConfidence: "Medium",
    },
  ],
  guc: [
    {
      role: "President / CEO",
      name: "Liang Tong",
      nameZh: "戴尚義",
      bio: "GUC 總經理，台積電生態系內 ASIC 設計服務龍頭；與台積電製程與封裝節奏深度同步。",
      leadership: L(3, 4, 3, 4, 4, 4, 5, 4, 3, 3),
      leadershipConfidence: "Medium",
    },
    { role: "Note", name: "TSMC 持股近 35%", note: "策略上與台積電緊密綁定" },
  ],
  mediatek: [
    {
      role: "Chairman / Founder",
      name: "Tsai Ming-Kai",
      nameZh: "蔡明介",
      since: 1997,
      bio: "1997 分割聯電通訊事業創辦聯發科，從中國低階手機起家走到全球第二大手機 SoC；被稱為「IC 設計教父」。",
      leadership: L(5, 5, 4, 5, 5, 5, 5, 5, 4, 4),
      leadershipConfidence: "High",
    },
    {
      role: "CEO",
      name: "Rick Tsai",
      nameZh: "蔡力行",
      since: 2018,
      bio: "前台積電 CEO，2017 加入聯發科任 CEO；執行力嚴謹；主導 Dimensity 高階線突破與 Nvidia GB10 合作。",
      leadership: L(4, 5, 4, 5, 5, 5, 4, 5, 4, 4),
      leadershipConfidence: "High",
    },
  ],

  // --- 記憶體 ---
  micron: [
    {
      role: "CEO",
      name: "Sanjay Mehrotra",
      since: 2017,
      bio: "SanDisk 共同創辦人，2017 接掌 Micron；帶領度過記憶體下行週期並切入 HBM3E 主流供應。",
      leadership: L(4, 4, 3, 5, 4, 5, 4, 5, 4, 4),
      leadershipConfidence: "High",
    },
  ],
  skhynix: [
    {
      role: "CEO",
      name: "Kwak Noh-Jung",
      nameZh: "郭魯廷",
      since: 2024,
      bio: "2024 接任 SK 海力士 CEO；任內 HBM 主導地位持續鞏固。任期尚短。",
      leadership: L(4, 4, 3, 4, 4, 4, 4, 4, 4, 3),
      leadershipConfidence: "Medium",
    },
  ],
  samsung: [
    {
      role: "Chairman",
      name: "Jay Y. Lee",
      nameZh: "李在鎔",
      bio: "三星集團實質掌權者；曾因賄賂案被判刑但後特赦；近年積極推進 HBM 認證與 Foundry 競爭力。",
      leadership: L(4, 3, 4, 3, 3, 2, 3, 4, 4, 2),
      leadershipConfidence: "Medium",
    },
    {
      role: "DS Division Head",
      name: "Jun Young-hyun",
      nameZh: "全永鉉",
      bio: "2024 接任半導體部門負責人，主要任務是追上 SK Hynix 在 HBM 的領先。",
      leadership: L(4, 3, 3, 4, 3, 4, 3, 4, 3, 3),
      leadershipConfidence: "Low",
    },
  ],
  nanya: [
    {
      role: "President",
      name: "Pei-Ing Lee",
      nameZh: "李培瑛",
      bio: "長期執掌南亞科，帶領公司走過多次記憶體大循環。",
      leadership: L(3, 4, 3, 4, 4, 4, 3, 5, 4, 4),
      leadershipConfidence: "Medium",
    },
  ],
  winbond: [
    {
      role: "Chairman",
      name: "Arthur Chiao",
      nameZh: "焦佑鈞",
      bio: "華邦電董事長，長期經營利基記憶體與 NOR Flash；華新麗華集團成員。",
      leadership: L(3, 4, 3, 4, 4, 4, 3, 5, 4, 3),
      leadershipConfidence: "Medium",
    },
  ],

  // --- 晶圓代工 / 設備 ---
  tsmc: [
    {
      role: "Founder",
      name: "Morris Chang",
      nameZh: "張忠謀",
      since: 1987,
      bio: "1987 創辦台積電，發明「純晶圓代工」商業模式，徹底改變全球半導體業；2018 退休但長期影響力延續。",
      leadership: L(5, 5, 5, 5, 5, 5, 5, 5, 5, 5),
      leadershipConfidence: "High",
    },
    {
      role: "Chairman / CEO",
      name: "CC Wei",
      nameZh: "魏哲家",
      bio: "張忠謀接班人，2018 起任 CEO、2024 兼任董事長；工程紀律與執行力著稱，N3/N2 量產與 CoWoS 擴產期間穩住公司。",
      leadership: L(4, 5, 4, 5, 5, 5, 5, 5, 5, 4),
      leadershipConfidence: "High",
    },
  ],
  asml: [
    {
      role: "President / CEO",
      name: "Christophe Fouquet",
      since: 2024,
      bio: "2024 接掌 ASML，前任 Peter Wennink 任內把公司推上 EUV 獨佔；內部出身，延續性高。",
      leadership: L(4, 4, 3, 5, 4, 4, 5, 4, 4, 4),
      leadershipConfidence: "Medium",
    },
  ],
  amat: [
    {
      role: "President / CEO",
      name: "Gary Dickerson",
      since: 2013,
      bio: "12+ 年穩定執掌應材，帶領公司走過記憶體 + 邏輯雙循環，營收規模翻倍。",
      leadership: L(4, 4, 4, 4, 4, 4, 4, 5, 4, 4),
      leadershipConfidence: "High",
    },
  ],
  lam: [
    {
      role: "President / CEO",
      name: "Tim Archer",
      since: 2018,
      bio: "Lam Research 內部出身，2018 接任 CEO；任內中國市場波動劇烈仍維持成長。",
      leadership: L(4, 4, 4, 4, 4, 4, 4, 4, 4, 4),
      leadershipConfidence: "Medium",
    },
  ],
  kla: [
    {
      role: "President / CEO",
      name: "Rick Wallace",
      since: 2006,
      bio: "近 20 年穩定執掌 KLA；以工程文化與技術領先為核心戰略，公司穩定獲利。",
      leadership: L(4, 5, 5, 5, 4, 5, 4, 5, 5, 4),
      leadershipConfidence: "High",
    },
  ],
  advantest: [
    {
      role: "President / CEO",
      name: "Douglas Lefever",
      since: 2024,
      bio: "前 Spectrum Brands、Cohu 主管，2024 接任 Advantest；任期尚短。",
      leadership: L(3, 3, 3, 3, 3, 4, 3, 3, 3, 3),
      leadershipConfidence: "Low",
    },
  ],
  tel: [
    {
      role: "President / CEO",
      name: "Toshiki Kawai",
      nameZh: "河合 利樹",
      since: 2016,
      bio: "10 年穩定執掌 Tokyo Electron；任內 EUV 配套設備市占持續鞏固。",
      leadership: L(4, 4, 4, 4, 4, 5, 4, 4, 4, 3),
      leadershipConfidence: "Medium",
    },
  ],
  disco: [
    {
      role: "President / CEO",
      name: "Kazuma Sekiya",
      nameZh: "関家 一馬",
      bio: "Disco 創辦家族成員；公司以高自由度文化與精密技術領先聞名。",
      leadership: L(4, 5, 4, 5, 5, 4, 4, 4, 4, 3),
      leadershipConfidence: "Medium",
    },
  ],

  // --- 先進封裝 ---
  ase: [
    {
      role: "Chairman",
      name: "Jason Chang",
      nameZh: "張虔生",
      note: "1984 創辦 ASE 集團",
      bio: "ASE 集團創辦人，把日月光從中小封裝廠帶到全球 OSAT 龍頭；連續多次併購（環電、矽品）建立規模。",
      leadership: L(4, 5, 4, 4, 4, 4, 4, 5, 4, 3),
      leadershipConfidence: "High",
    },
  ],
  kyec: [
    {
      role: "Chairman",
      name: "Lee Chin-Kung",
      nameZh: "李金恭",
      bio: "京元電子董事長，長期經營測試代工事業。",
      leadership: L(3, 4, 3, 4, 4, 4, 4, 4, 3, 3),
      leadershipConfidence: "Medium",
    },
  ],
  unimicron: [
    {
      role: "Chairman",
      name: "Tseng Tzu-Chang",
      nameZh: "曾子章",
      bio: "欣興電子董事長，聯電轉投資出身；長期經營 ABF 載板事業，AI 浪潮中受惠最深。",
      leadership: L(4, 4, 3, 4, 4, 4, 4, 5, 4, 4),
      leadershipConfidence: "High",
    },
  ],
  nanyapcb: [
    {
      role: "Chairman",
      name: "Wu Chia-Chao",
      nameZh: "吳嘉昭",
      bio: "南電董事長，台塑集團出身。",
      leadership: L(3, 3, 3, 3, 3, 4, 3, 4, 3, 3),
      leadershipConfidence: "Low",
    },
  ],
  amkor: [
    { role: "CEO", name: "Giel Rutten", since: 2020 },
  ],
  ibiden: [
    {
      role: "President",
      name: "Koji Kawashima",
      nameZh: "河島 浩二",
      bio: "Ibiden 總裁，主導 ABF 載板全球領先地位的維護與擴產投資。",
      leadership: L(4, 4, 4, 4, 4, 5, 4, 4, 4, 3),
      leadershipConfidence: "Low",
    },
  ],
  shinko: [
    { role: "President", name: "Yoshiyuki Funada", nameZh: "船田 義之" },
  ],

  // --- 高速網路 / SerDes ---
  cisco: [
    {
      role: "Chair / CEO",
      name: "Chuck Robbins",
      since: 2015,
      bio: "10 年執掌 Cisco；任內推動軟體與安全轉型，但在資料中心 switch 與 hyperscaler 競爭中市占受到 Arista、白牌挑戰。",
      leadership: L(3, 4, 3, 3, 4, 4, 4, 4, 4, 4),
      leadershipConfidence: "High",
    },
  ],
  arista: [
    {
      role: "CEO",
      name: "Jayshree Ullal",
      since: 2008,
      bio: "前 Cisco 主管，2008 加入 Arista；17 年穩定執掌將公司從新創帶到資料中心 switch 系統龍頭。",
      leadership: L(5, 5, 4, 5, 5, 5, 5, 5, 5, 5),
      leadershipConfidence: "High",
    },
  ],
  accton: [
    { role: "Chairman", name: "Kuo Yi-Chiu", nameZh: "鄒鼎熹" },
  ],
  astera: [
    {
      role: "Co-founder / CEO",
      name: "Jitendra Mohan",
      bio: "Astera Labs 共同創辦人，前 Texas Instruments connectivity 主管；專注 AI 資料中心 connectivity，公司上市後成長迅速。",
      leadership: L(4, 4, 3, 5, 4, 4, 4, 4, 3, 4),
      leadershipConfidence: "Medium",
    },
  ],
  credo: [
    {
      role: "CEO",
      name: "Bill Brennan",
      bio: "Credo Technology CEO，主導 AEC 與高速 SerDes 產品線。",
      leadership: L(4, 4, 3, 5, 4, 4, 4, 4, 3, 4),
      leadershipConfidence: "Medium",
    },
  ],
  synopsys: [
    {
      role: "CEO",
      name: "Sassine Ghazi",
      since: 2024,
      bio: "Synopsys 內部出身，2024 接任 CEO；任期尚短。",
      leadership: L(4, 4, 3, 5, 4, 4, 5, 4, 4, 4),
      leadershipConfidence: "Medium",
    },
  ],
  cadence: [
    {
      role: "President / CEO",
      name: "Anirudh Devgan",
      since: 2021,
      bio: "Cadence 內部出身，接續陳立武穩健發展；EDA + IP + emulation 三引擎清晰。",
      leadership: L(4, 4, 4, 5, 4, 4, 5, 4, 4, 4),
      leadershipConfidence: "Medium",
    },
  ],
  parade: [
    { role: "Founder / CEO", name: "Jack Zhao", nameZh: "周朝煌" },
  ],

  // --- 連接器 / 銅纜 ---
  amphenol: [
    {
      role: "President / CEO",
      name: "Adam Norwitt",
      since: 2009,
      bio: "16 年穩定執掌 Amphenol；以分散併購策略與全球佈局著稱。",
      leadership: L(4, 5, 5, 4, 5, 5, 5, 5, 5, 4),
      leadershipConfidence: "High",
    },
  ],
  te: [
    {
      role: "CEO",
      name: "Terrence Curtin",
      since: 2017,
      bio: "TE Connectivity CEO，內部出身，主導汽車與工業客戶結構。",
      leadership: L(3, 4, 4, 4, 4, 4, 4, 4, 4, 4),
      leadershipConfidence: "Medium",
    },
  ],
  lotes: [
    { role: "Chairman", name: "Wang Kuo-Chuan", nameZh: "王國銓" },
  ],
  bizlink: [
    { role: "Chairman / CEO", name: "Liang Hua-Cher", nameZh: "梁華哲" },
  ],

  // --- 光通訊 ---
  coherent: [
    {
      role: "CEO",
      name: "Jim Anderson",
      since: 2024,
      bio: "前 Lattice Semiconductor CEO，2024 接掌 Coherent；任務是整合 II-VI / Finisar 併購與聚焦 AI 光通訊。",
      leadership: L(4, 4, 3, 4, 4, 4, 4, 4, 4, 4),
      leadershipConfidence: "Medium",
    },
  ],
  lumentum: [
    {
      role: "President / CEO",
      name: "Michael Hurlston",
      since: 2024,
      bio: "前 Synaptics CEO，2024 接掌 Lumentum；任務是把公司聚焦在資料中心光通訊，淡化 3D sensing。",
      leadership: L(4, 4, 3, 4, 4, 4, 4, 4, 4, 4),
      leadershipConfidence: "Medium",
    },
  ],
  fabrinet: [
    {
      role: "CEO",
      name: "Seamus Grady",
      since: 2017,
      bio: "Fabrinet CEO，主導光通訊代工業務在 AI 浪潮中規模化。",
      leadership: L(4, 5, 4, 4, 5, 5, 5, 4, 5, 4),
      leadershipConfidence: "Medium",
    },
  ],
  aaoi: [
    {
      role: "Founder / CEO",
      name: "Thompson Lin",
      nameZh: "林威廷",
      bio: "Applied Optoelectronics 創辦人，長期經營光通訊；公司歷經多次轉型與財務波動。",
      leadership: L(3, 3, 2, 4, 3, 3, 3, 4, 2, 3),
      leadershipConfidence: "Medium",
    },
  ],

  // --- AI server / ODM ---
  supermicro: [
    {
      role: "Founder / CEO",
      name: "Charles Liang",
      nameZh: "梁見後",
      since: 1993,
      bio: "1993 創辦 Supermicro 至今；以早期支援 Nvidia 平台與客製化彈性聞名。2024 因會計揭露爭議引發股價劇烈波動，治理仍受質疑。",
      leadership: L(4, 4, 3, 5, 4, 2, 4, 5, 2, 2),
      leadershipConfidence: "High",
    },
  ],
  wistron: [
    {
      role: "Chairman",
      name: "Lin Hsien-Ming",
      nameZh: "林憲銘",
      bio: "宏碁集團出身，2001 分割成立緯創；長期穩定經營，後分割出緯穎切入 hyperscaler 直供。",
      leadership: L(4, 4, 4, 4, 4, 5, 4, 5, 4, 4),
      leadershipConfidence: "High",
    },
  ],
  wiwynn: [
    {
      role: "CEO",
      name: "Emily Hong",
      nameZh: "洪麗甯",
      bio: "緯穎科技 CEO，緯創分割後專注 hyperscaler 直供；公司在 AI server 浪潮中快速擴張。",
      leadership: L(4, 5, 3, 4, 4, 4, 5, 4, 4, 4),
      leadershipConfidence: "Medium",
    },
  ],
  quanta: [
    {
      role: "Founder / Chairman",
      name: "Barry Lam",
      nameZh: "林百里",
      since: 1988,
      bio: "1988 創辦廣達，從 NB ODM 龍頭轉型為 AI server 主力供應商；台灣科技業最受敬重的創辦人之一。",
      leadership: L(5, 5, 5, 4, 5, 5, 5, 5, 5, 4),
      leadershipConfidence: "High",
    },
  ],
  inventec: [
    {
      role: "Chairman",
      name: "Tom Cho",
      nameZh: "卓桐華",
      bio: "英業達董事長，長期經營伺服器與消費性電子代工。",
      leadership: L(3, 4, 3, 4, 4, 4, 4, 4, 4, 3),
      leadershipConfidence: "Medium",
    },
  ],
  foxconn: [
    {
      role: "Founder / Major shareholder",
      name: "Terry Gou",
      nameZh: "郭台銘",
      since: 1974,
      bio: "1974 創辦鴻海，從連接器小廠帶到全球最大 EMS；以強執行力與工廠管理聞名。2019 卸下董事長但仍是大股東與精神領袖。",
      leadership: L(4, 5, 4, 4, 4, 3, 4, 5, 4, 3),
      leadershipConfidence: "High",
    },
    {
      role: "Chairman / CEO",
      name: "Young Liu",
      nameZh: "劉揚偉",
      since: 2019,
      bio: "郭台銘接班人，2019 起執掌；主導「3+3」新事業；在 GB200 rack-scale 整合中扮演核心角色。",
      leadership: L(4, 4, 4, 4, 4, 4, 4, 4, 4, 4),
      leadershipConfidence: "High",
    },
  ],
  aspeed: [
    {
      role: "Chairman / CEO",
      name: "Chris Lin",
      nameZh: "林任韋",
      bio: "信驊科技創辦團隊成員，主導 server BMC 市占擴張到近獨佔。",
      leadership: L(4, 5, 3, 5, 4, 4, 5, 4, 4, 4),
      leadershipConfidence: "Medium",
    },
  ],

  // --- 電源 ---
  vertiv: [
    {
      role: "CEO",
      name: "Giordano Albertazzi",
      since: 2023,
      bio: "Vertiv CEO，內部出身；任內公司股價大漲，AI 資料中心訂單能見度高。",
      leadership: L(4, 5, 4, 4, 4, 4, 5, 4, 4, 4),
      leadershipConfidence: "Medium",
    },
  ],
  mps: [
    {
      role: "Founder / Chairman / CEO",
      name: "Michael Hsing",
      nameZh: "邢正人",
      since: 1997,
      bio: "1997 創辦 Monolithic Power Systems；長期以技術差異化（自有 BCD 製程）建立 GPU 旁高電流 VRM 領先地位。",
      leadership: L(5, 5, 4, 5, 4, 5, 4, 5, 5, 4),
      leadershipConfidence: "High",
    },
  ],
  eaton: [
    {
      role: "Chairman / CEO",
      name: "Craig Arnold",
      since: 2016,
      bio: "Eaton CEO，主導公司從多元工業集團聚焦電力管理；資料中心業務在 AI 浪潮下成為主要動能。",
      leadership: L(4, 4, 4, 4, 4, 5, 4, 5, 5, 4),
      leadershipConfidence: "High",
    },
  ],
  delta: [
    {
      role: "Founder",
      name: "Bruce Cheng",
      nameZh: "鄭崇華",
      since: 1971,
      bio: "1971 創辦台達電；以「環保節能」為長期使命，把電源公司帶到全球高效率領先地位。",
      leadership: L(5, 5, 5, 5, 5, 5, 5, 5, 5, 4),
      leadershipConfidence: "High",
    },
    {
      role: "Chairman",
      name: "Yancey Hai",
      nameZh: "海英俊",
      bio: "台達電董事長，金融背景出身；任內主導國際化與電動車事業布局。",
      leadership: L(4, 4, 4, 3, 4, 5, 4, 4, 5, 4),
      leadershipConfidence: "High",
    },
  ],
  liteon: [
    {
      role: "Founder / Chairman",
      name: "Raymond Soong",
      nameZh: "宋恭源",
      bio: "光寶集團創辦人，1975 創辦光寶；主導多次集團整併與聚焦。",
      leadership: L(4, 4, 4, 4, 4, 4, 4, 5, 4, 3),
      leadershipConfidence: "High",
    },
  ],
  acbel: [
    {
      role: "Chairman",
      name: "Shu Hsiung Hsu",
      nameZh: "許勝雄",
      note: "金仁寶集團",
      bio: "金仁寶集團總裁，長期經營電子組件與電源產品。",
      leadership: L(3, 4, 4, 3, 4, 4, 3, 4, 4, 3),
      leadershipConfidence: "Medium",
    },
  ],
  chicony: [
    {
      role: "Chairman",
      name: "Mao-Kuei Lin",
      nameZh: "林茂桂",
      note: "群光集團",
      bio: "群光集團董事長，長期經營電源與輸入裝置。",
      leadership: L(3, 4, 3, 3, 4, 4, 3, 4, 4, 3),
      leadershipConfidence: "Medium",
    },
  ],
  chroma: [
    {
      role: "Founder / Chairman",
      name: "Leo Huang",
      nameZh: "黃震智",
      bio: "致茂電子創辦人，長期經營電源量測與半導體測試介面設備。",
      leadership: L(4, 4, 4, 5, 4, 4, 4, 4, 4, 4),
      leadershipConfidence: "Medium",
    },
  ],
  ti: [
    {
      role: "President / CEO",
      name: "Haviv Ilan",
      since: 2023,
      bio: "TI 內部出身，2023 接任 CEO；任內持續類比 IC 自有 12 吋產能擴張。",
      leadership: L(3, 4, 3, 4, 4, 4, 4, 4, 4, 4),
      leadershipConfidence: "Medium",
    },
  ],
  schneider: [
    { role: "CEO", name: "Olivier Blum", since: 2025 },
  ],

  // --- 散熱 ---
  avc: [
    {
      role: "Chairman",
      name: "Lin Yu-Shen",
      nameZh: "林育申",
      bio: "雙鴻科技董事長，主導公司從筆電散熱轉型成 AI server 液冷主力供應商。",
      leadership: L(4, 5, 3, 4, 4, 4, 4, 4, 4, 4),
      leadershipConfidence: "Medium",
    },
  ],
  auras: [
    {
      role: "Chairman",
      name: "Shen Ching-Hsin",
      nameZh: "沈慶行",
      bio: "奇鋐科技董事長，與雙鴻分食 AI 液冷大單。",
      leadership: L(4, 5, 3, 4, 4, 4, 4, 4, 4, 4),
      leadershipConfidence: "Medium",
    },
  ],
  sunon: [
    { role: "Chairman", name: "Charles Hong", nameZh: "洪銀樹" },
  ],
  jentech: [
    { role: "Chairman", name: "Huang Kuo-Chun", nameZh: "黃國欽" },
  ],
  camtek: [
    {
      role: "CEO",
      name: "Rafi Amit",
      since: 2015,
      bio: "Camtek 共同創辦人之一；專注 HBM bump 與先進封裝檢測。",
      leadership: L(4, 4, 3, 5, 4, 4, 4, 4, 4, 3),
      leadershipConfidence: "Medium",
    },
  ],

  // ============================================
  // 第三波（新增公司，僅打分高知名度者）
  // ============================================

  // Hyperscalers
  msft: [
    {
      role: "Chairman / CEO",
      name: "Satya Nadella",
      since: 2014,
      bio: "2014 接任 Microsoft CEO，把公司從 Windows / Office 重塑為 Azure + AI 巨頭；OpenAI 戰略合作的推手。",
      leadership: L(5, 5, 5, 4, 5, 5, 5, 5, 5, 5),
      leadershipConfidence: "High",
    },
  ],
  googl: [
    {
      role: "CEO",
      name: "Sundar Pichai",
      since: 2015,
      bio: "2015 接任 Google CEO，2019 升任 Alphabet CEO；主導 TPU 與 Gemini 開發，但近年內部 AI 戰略執行被質疑。",
      leadership: L(4, 3, 4, 4, 4, 4, 4, 4, 4, 3),
      leadershipConfidence: "High",
    },
  ],
  amzn: [
    {
      role: "President / CEO",
      name: "Andy Jassy",
      since: 2021,
      bio: "AWS 創辦者，2021 接任 Amazon CEO；以 AWS 紀律經營電商業務，主導 AI（Anthropic + Trainium）布局。",
      leadership: L(5, 5, 5, 5, 4, 4, 5, 5, 5, 4),
      leadershipConfidence: "High",
    },
  ],
  meta: [
    {
      role: "Founder / CEO",
      name: "Mark Zuckerberg",
      since: 2004,
      bio: "2004 創辦 Facebook；近年大舉投入 AI（MTIA、Llama）與 Reality Labs。可控股權結構讓他高度自主。",
      leadership: L(5, 5, 3, 5, 4, 3, 4, 5, 4, 4),
      leadershipConfidence: "High",
    },
  ],
  oracle: [
    {
      role: "Chairman / CTO / Co-founder",
      name: "Larry Ellison",
      since: 1977,
      bio: "1977 共同創辦 Oracle，現仍主導戰略；近年積極推 OCI 與 Nvidia 戰略合作，承接 OpenAI / xAI 大訂單。",
      leadership: L(5, 4, 5, 4, 4, 3, 5, 5, 5, 4),
      leadershipConfidence: "High",
    },
    {
      role: "CEO",
      name: "Safra Catz",
      since: 2014,
      bio: "10+ 年穩定執掌 Oracle 營運；以財務紀律與成本管控聞名。",
      leadership: L(4, 5, 5, 3, 4, 4, 4, 5, 5, 4),
      leadershipConfidence: "High",
    },
  ],

  // Server / Storage
  dell: [
    {
      role: "Founder / Chairman / CEO",
      name: "Michael Dell",
      since: 1984,
      bio: "1984 創辦 Dell；2013 把公司私有化重整，2018 重新上市；AI server 浪潮中再次成為焦點。",
      leadership: L(5, 5, 5, 4, 4, 4, 5, 5, 5, 4),
      leadershipConfidence: "High",
    },
  ],
  hpe: [
    {
      role: "President / CEO",
      name: "Antonio Neri",
      since: 2018,
      bio: "HPE 內部出身，2018 接任 CEO；主導 GreenLake 雲端轉型與 Juniper 併購。",
      leadership: L(4, 4, 4, 4, 4, 4, 4, 4, 4, 4),
      leadershipConfidence: "High",
    },
  ],
  ntap: [
    {
      role: "CEO",
      name: "George Kurian",
      since: 2015,
      bio: "10 年穩定執掌 NetApp；推 Cloud ONTAP 並與 hyperscaler 整合。",
      leadership: L(4, 4, 4, 4, 4, 4, 4, 4, 4, 4),
      leadershipConfidence: "High",
    },
  ],
  pstg: [
    {
      role: "CEO",
      name: "Charles Giancarlo",
      since: 2017,
      bio: "前 Cisco 高階主管，2017 接任 Pure Storage CEO；引入 Evergreen 訂閱模式並爭取 hyperscaler 大單。",
      leadership: L(4, 4, 4, 4, 4, 4, 4, 4, 4, 4),
      leadershipConfidence: "High",
    },
  ],
  wdc: [
    {
      role: "CEO",
      name: "Irving Tan",
      bio: "Western Digital CEO，主導 2025 分拆 NAND（SanDisk）後的純 HDD 業務聚焦。",
      leadership: L(3, 4, 3, 4, 4, 4, 4, 4, 4, 3),
      leadershipConfidence: "Medium",
    },
  ],
  stx: [
    {
      role: "CEO",
      name: "Dave Mosley",
      bio: "Seagate CEO，工程背景；主導 HAMR 技術領先量產。",
      leadership: L(4, 4, 4, 5, 4, 4, 4, 5, 4, 3),
      leadershipConfidence: "Medium",
    },
  ],
  sndk: [
    { role: "CEO", name: "David Goeckeler", bio: "SanDisk 2025 分拆後 CEO；前 WDC CEO。", leadership: L(3, 4, 3, 4, 4, 4, 4, 4, 4, 3), leadershipConfidence: "Medium" },
  ],

  // REIT / Power / Construction
  eqix: [
    {
      role: "President / CEO",
      name: "Adaire Fox-Martin",
      since: 2024,
      bio: "2024 接任 Equinix CEO；前 Oracle 高階主管。",
      leadership: L(4, 4, 4, 3, 4, 4, 5, 4, 4, 4),
      leadershipConfidence: "Medium",
    },
  ],
  dlr: [
    {
      role: "CEO",
      name: "Andrew Power",
      since: 2022,
      bio: "Digital Realty CEO，前 CFO；主導擴張 wholesale AI 資料中心。",
      leadership: L(4, 4, 4, 3, 4, 4, 4, 4, 4, 4),
      leadershipConfidence: "Medium",
    },
  ],
  emr: [
    { role: "President / CEO", name: "Lal Karsanbhai", since: 2021, leadership: L(4, 4, 4, 4, 4, 5, 4, 4, 4, 4), leadershipConfidence: "Medium" },
  ],
  eme: [
    { role: "CEO", name: "Tony Guzzi", since: 2011, bio: "EMCOR CEO 多年；資本配置紀律出色。", leadership: L(4, 5, 5, 3, 4, 5, 5, 5, 5, 4), leadershipConfidence: "High" },
  ],
  pwr: [
    { role: "President / CEO", name: "Duke Austin", since: 2016, bio: "Quanta Services CEO；任內公司股價大漲。", leadership: L(4, 5, 4, 4, 4, 5, 5, 5, 5, 4), leadershipConfidence: "High" },
  ],
  mtz: [
    { role: "CEO", name: "Jose Mas", since: 2007, bio: "MasTec 創辦家族 CEO，超過 15 年執掌。", leadership: L(4, 4, 4, 3, 4, 4, 4, 4, 4, 4), leadershipConfidence: "Medium" },
  ],
  gev: [
    { role: "CEO", name: "Scott Strazik", since: 2024, bio: "GE Vernova 分拆後首任 CEO；前 GE 電力 CEO。", leadership: L(5, 4, 4, 5, 4, 4, 5, 4, 4, 4), leadershipConfidence: "High" },
  ],
  abb: [
    { role: "CEO", name: "Morten Wierod", since: 2024, bio: "ABB 內部出身，2024 接任 CEO。", leadership: L(4, 4, 4, 4, 4, 5, 4, 4, 4, 4), leadershipConfidence: "Medium" },
  ],
  hubb: [
    { role: "CEO", name: "Gerben Bakker", since: 2020, leadership: L(4, 4, 4, 3, 4, 4, 4, 4, 4, 4), leadershipConfidence: "Medium" },
  ],
  cat: [
    { role: "Chairman / CEO", name: "Jim Umpleby", since: 2017, bio: "Caterpillar 內部出身 30+ 年；資本配置紀律佳。", leadership: L(4, 5, 5, 4, 4, 5, 4, 5, 5, 4), leadershipConfidence: "High" },
  ],
  cmi: [
    { role: "Chair / CEO", name: "Jennifer Rumsey", since: 2022, bio: "Cummins 工程背景 CEO；任內加強氫能策略。", leadership: L(4, 4, 4, 5, 4, 5, 4, 5, 4, 4), leadershipConfidence: "Medium" },
  ],
  gnrc: [
    { role: "President / CEO", name: "Aaron Jagdfeld", since: 2008, leadership: L(4, 4, 4, 3, 4, 4, 4, 4, 4, 4), leadershipConfidence: "Medium" },
  ],
  rok: [
    { role: "Chair / CEO", name: "Blake Moret", since: 2016, leadership: L(4, 4, 4, 4, 4, 5, 4, 4, 4, 4), leadershipConfidence: "High" },
  ],
  flnc: [
    { role: "CEO", name: "Julian Nebreda", since: 2022, leadership: L(3, 3, 3, 4, 4, 4, 3, 4, 3, 3), leadershipConfidence: "Low" },
  ],

  // Networking
  cien: [
    { role: "CEO", name: "Gary Smith", since: 2001, bio: "Ciena CEO 超過 20 年；coherent 光通訊技術領先。", leadership: L(4, 4, 4, 5, 4, 5, 4, 5, 4, 4), leadershipConfidence: "High" },
  ],
  net: [
    { role: "Co-founder / CEO", name: "Matthew Prince", since: 2009, bio: "Cloudflare 共同創辦人；以技術 + 開發者社群驅動成長。", leadership: L(5, 4, 4, 5, 4, 5, 5, 4, 3, 5), leadershipConfidence: "High" },
  ],

  // 半導體
  adi: [
    { role: "Chair / CEO", name: "Vincent Roche", since: 2013, bio: "Analog Devices 長期 CEO；併購 Maxim 後鞏固類比霸主。", leadership: L(4, 4, 4, 5, 4, 5, 4, 5, 5, 4), leadershipConfidence: "High" },
  ],
  stm: [
    { role: "President / CEO", name: "Jean-Marc Chery", since: 2018, leadership: L(4, 4, 4, 4, 4, 4, 4, 4, 4, 4), leadershipConfidence: "High" },
  ],
  amba: [
    { role: "President / CEO", name: "Fermi Wang", bio: "Ambarella 創辦人，工程背景。", leadership: L(4, 4, 3, 5, 3, 4, 3, 3, 3, 3), leadershipConfidence: "Medium" },
  ],
  form: [
    { role: "CEO", name: "Mike Slessor", since: 2014, leadership: L(4, 4, 4, 5, 4, 4, 4, 4, 4, 4), leadershipConfidence: "Medium" },
  ],
  ter: [
    { role: "President / CEO", name: "Gregory Smith", since: 2024, leadership: L(4, 4, 4, 4, 4, 4, 4, 4, 4, 4), leadershipConfidence: "Medium" },
  ],
  klic: [
    { role: "President / CEO", name: "Fusen Chen", since: 2020, leadership: L(4, 4, 3, 4, 4, 4, 4, 4, 4, 4), leadershipConfidence: "Medium" },
  ],
  glw: [
    { role: "Chair / CEO", name: "Wendell Weeks", since: 2005, bio: "Corning CEO 20 年；長期 R&D 投資文化。", leadership: L(5, 4, 4, 5, 5, 5, 5, 5, 4, 4), leadershipConfidence: "High" },
  ],

  // 軟體
  snow: [
    { role: "CEO", name: "Sridhar Ramaswamy", since: 2024, bio: "前 Google 廣告主管，2024 接任 Snowflake CEO；推動 AI 平台 Cortex。", leadership: L(4, 4, 3, 4, 4, 4, 4, 4, 3, 4), leadershipConfidence: "Medium" },
  ],
  mdb: [
    { role: "President / CEO", name: "Dev Ittycheria", since: 2014, leadership: L(4, 4, 3, 4, 4, 4, 4, 4, 4, 4), leadershipConfidence: "High" },
  ],
  ddog: [
    { role: "Co-founder / CEO", name: "Olivier Pomel", since: 2010, bio: "Datadog 共同創辦人；以開發者導向設計建立 observability 平台。", leadership: L(4, 5, 4, 5, 4, 5, 4, 4, 4, 4), leadershipConfidence: "High" },
  ],
  pltr: [
    { role: "Co-founder / CEO", name: "Alex Karp", since: 2003, bio: "Palantir 共同創辦人；風格強烈、對政府客戶經營深；AIP 銷售模式創新。", leadership: L(5, 4, 4, 5, 4, 3, 5, 5, 3, 4), leadershipConfidence: "High" },
  ],

  // 網安
  crwd: [
    { role: "Co-founder / CEO", name: "George Kurtz", since: 2011, bio: "CrowdStrike 共同創辦人；2024 outage 後信任修復是觀察重點。", leadership: L(5, 4, 4, 5, 4, 3, 4, 4, 4, 3), leadershipConfidence: "High" },
  ],
  panw: [
    { role: "CEO", name: "Nikesh Arora", since: 2018, bio: "前 Google + SoftBank 主管，加入 Palo Alto 後主導平台化轉型。", leadership: L(5, 5, 5, 4, 5, 4, 5, 4, 5, 5), leadershipConfidence: "High" },
  ],
  zs: [
    { role: "Founder / CEO", name: "Jay Chaudhry", since: 2008, bio: "Zscaler 創辦人；連續創業家，主導 Zero Trust 雲端安全。", leadership: L(5, 4, 4, 5, 4, 4, 4, 4, 3, 4), leadershipConfidence: "High" },
  ],
  okta: [
    { role: "Co-founder / CEO", name: "Todd McKinnon", since: 2009, bio: "前 Salesforce engineering，2009 共同創辦 Okta。", leadership: L(4, 4, 3, 4, 4, 4, 4, 4, 4, 4), leadershipConfidence: "High" },
  ],
  cybr: [
    { role: "CEO", name: "Matt Cohen", since: 2023, leadership: L(4, 4, 3, 4, 4, 4, 4, 4, 4, 4), leadershipConfidence: "Medium" },
  ],

  // 其他
  tsla: [
    {
      role: "CEO / Founder",
      name: "Elon Musk",
      since: 2008,
      bio: "Tesla CEO 兼控股股東；FSD、Dojo、Optimus 全押注 AI 與自動化。風格極端、執行極快但充滿政治與管治爭議。",
      leadership: L(5, 5, 3, 5, 4, 2, 4, 5, 2, 3),
      leadershipConfidence: "High",
    },
  ],
  sym: [
    { role: "CEO", name: "Rick Cohen", bio: "Symbotic CEO，亦為 C&S Wholesale 創辦人。", leadership: L(4, 4, 3, 4, 4, 4, 4, 4, 3, 3), leadershipConfidence: "Medium" },
  ],
};

// =====================================================================
// 領導力分數合成 helper
// =====================================================================

/** 把單一領導者的 10 維度分數合成為 0-100 */
export function leaderCompositeScore(s: LeadershipScores): number {
  const sum =
    s.strategicJudgement * LEADERSHIP_WEIGHTS.strategicJudgement +
    s.execution * LEADERSHIP_WEIGHTS.execution +
    s.capitalAllocation * LEADERSHIP_WEIGHTS.capitalAllocation +
    s.technicalProductInsight * LEADERSHIP_WEIGHTS.technicalProductInsight +
    s.talentOrganization * LEADERSHIP_WEIGHTS.talentOrganization +
    s.integrityGovernance * LEADERSHIP_WEIGHTS.integrityGovernance +
    s.customerEcosystem * LEADERSHIP_WEIGHTS.customerEcosystem +
    s.resilience * LEADERSHIP_WEIGHTS.resilience +
    s.financialDiscipline * LEADERSHIP_WEIGHTS.financialDiscipline +
    s.communication * LEADERSHIP_WEIGHTS.communication;
  return Math.max(1, Math.min(100, Math.round(sum * 20))); // 0-5 × weights → 0-100
}

/** 公司層級的 leadership 平均（多位掌權人取平均） */
export function companyLeadershipScore(companyId: string): { score: number | null; n: number; notable: string } {
  const list = keyPeopleById[companyId] ?? [];
  const withScores = list.filter((p) => p.leadership);
  if (withScores.length === 0) return { score: null, n: 0, notable: "資料不足" };
  const total = withScores.reduce(
    (s, p) => s + leaderCompositeScore(p.leadership!),
    0,
  );
  const avg = Math.round(total / withScores.length);
  const top = withScores[0]; // 第一位通常是主 CEO / Founder
  return {
    score: avg,
    n: withScores.length,
    notable: top.nameZh ? `${top.nameZh}（${top.name}）` : top.name,
  };
}
