import type { KeyPerson } from "../types";

// =====================================================================
// 公司掌權者 / 創辦人對照
//
// 嚴格原則：
//  - 僅列出公開可查證之 CEO / Chairman / Founder（公司官網、IR、上市文件）。
//  - 不確定者一律省略，不亂編。
//  - 任期可能變動，建議以最新公告為準。
// =====================================================================

export const keyPeopleById: Record<string, KeyPerson[]> = {
  // --- AI 運算晶片 ---
  nvidia: [
    { role: "Co-founder / CEO", name: "Jensen Huang", nameZh: "黃仁勳", since: 1993 },
  ],
  amd: [
    { role: "CEO / Chair", name: "Lisa Su", nameZh: "蘇姿丰", since: 2014 },
  ],
  intel: [
    { role: "CEO", name: "Lip-Bu Tan", nameZh: "陳立武", since: 2025 },
  ],
  broadcom: [
    { role: "President / CEO", name: "Hock Tan", nameZh: "陳福陽", since: 2006 },
  ],
  marvell: [
    { role: "CEO", name: "Matt Murphy", since: 2016 },
  ],
  alchip: [
    { role: "Founder / CEO", name: "Johnny Shen", nameZh: "沈翔霖" },
  ],
  guc: [
    { role: "CEO", name: "Liang Tong", nameZh: "戴尚義" },
    { role: "Note", name: "TSMC 持股近 35%", note: "策略上與台積電緊密綁定" },
  ],
  mediatek: [
    { role: "Chairman / Founder", name: "Tsai Ming-Kai", nameZh: "蔡明介", since: 1997 },
    { role: "CEO", name: "Rick Tsai", nameZh: "蔡力行", since: 2018 },
  ],

  // --- 記憶體 / HBM ---
  micron: [
    { role: "CEO", name: "Sanjay Mehrotra", since: 2017 },
  ],
  skhynix: [
    { role: "CEO", name: "Kwak Noh-Jung", nameZh: "郭魯廷", since: 2024 },
  ],
  samsung: [
    { role: "Chairman", name: "Jay Y. Lee", nameZh: "李在鎔" },
    { role: "DS Division Head", name: "Jun Young-hyun", nameZh: "全永鉉" },
  ],
  nanya: [
    { role: "President", name: "Pei-Ing Lee", nameZh: "李培瑛" },
  ],
  winbond: [
    { role: "Chairman", name: "Arthur Chiao", nameZh: "焦佑鈞" },
  ],

  // --- 晶圓代工 / 設備 ---
  tsmc: [
    { role: "Founder", name: "Morris Chang", nameZh: "張忠謀", since: 1987, note: "1987 創辦" },
    { role: "Chairman / CEO", name: "CC Wei", nameZh: "魏哲家" },
  ],
  asml: [
    { role: "President / CEO", name: "Christophe Fouquet", since: 2024 },
  ],
  amat: [
    { role: "President / CEO", name: "Gary Dickerson", since: 2013 },
  ],
  lam: [
    { role: "President / CEO", name: "Tim Archer", since: 2018 },
  ],
  kla: [
    { role: "President / CEO", name: "Rick Wallace", since: 2006 },
  ],

  // --- 先進封裝 ---
  ase: [
    { role: "Chairman", name: "Jason Chang", nameZh: "張虔生", note: "1984 創辦 ASE 集團" },
  ],
  kyec: [
    { role: "Chairman", name: "Lee Chin-Kung", nameZh: "李金恭" },
  ],
  unimicron: [
    { role: "Chairman", name: "Tseng Tzu-Chang", nameZh: "曾子章" },
  ],
  nanyapcb: [
    { role: "Chairman", name: "Wu Chia-Chao", nameZh: "吳嘉昭" },
  ],
  amkor: [
    { role: "CEO", name: "Giel Rutten", since: 2020 },
  ],
  ibiden: [
    { role: "President", name: "Koji Kawashima", nameZh: "河島 浩二" },
  ],
  shinko: [
    { role: "President", name: "Yoshiyuki Funada", nameZh: "船田 義之" },
  ],

  // --- 高速網路晶片 ---
  cisco: [
    { role: "Chair / CEO", name: "Chuck Robbins", since: 2015 },
  ],
  arista: [
    { role: "CEO", name: "Jayshree Ullal", since: 2008 },
  ],
  accton: [
    { role: "Chairman", name: "Kuo Yi-Chiu", nameZh: "鄒鼎熹" },
  ],

  // --- 高速介面 / SerDes ---
  astera: [
    { role: "Co-founder / CEO", name: "Jitendra Mohan" },
  ],
  credo: [
    { role: "CEO", name: "Bill Brennan" },
  ],
  synopsys: [
    { role: "CEO", name: "Sassine Ghazi", since: 2024 },
  ],
  cadence: [
    { role: "President / CEO", name: "Anirudh Devgan", since: 2021 },
  ],
  parade: [
    { role: "Founder / CEO", name: "Jack Zhao", nameZh: "周朝煌" },
  ],

  // --- 連接器 / 銅纜 ---
  amphenol: [
    { role: "President / CEO", name: "Adam Norwitt", since: 2009 },
  ],
  te: [
    { role: "CEO", name: "Terrence Curtin", since: 2017 },
  ],
  lotes: [
    { role: "Chairman", name: "Wang Kuo-Chuan", nameZh: "王國銓" },
  ],
  bizlink: [
    { role: "Chairman / CEO", name: "Liang Hua-Cher", nameZh: "梁華哲" },
  ],

  // --- 光通訊 ---
  coherent: [
    { role: "CEO", name: "Jim Anderson", since: 2024 },
  ],
  lumentum: [
    { role: "President / CEO", name: "Michael Hurlston", since: 2024 },
  ],
  fabrinet: [
    { role: "CEO", name: "Seamus Grady", since: 2017 },
  ],
  aaoi: [
    { role: "Founder / CEO", name: "Thompson Lin", nameZh: "林威廷" },
  ],

  // --- AI 伺服器 / ODM ---
  supermicro: [
    { role: "Founder / CEO", name: "Charles Liang", nameZh: "梁見後", since: 1993 },
  ],
  wistron: [
    { role: "Chairman", name: "Lin Hsien-Ming", nameZh: "林憲銘" },
  ],
  wiwynn: [
    { role: "CEO", name: "Emily Hong", nameZh: "洪麗甯" },
  ],
  quanta: [
    { role: "Founder / Chairman", name: "Barry Lam", nameZh: "林百里", since: 1988 },
  ],
  inventec: [
    { role: "Chairman", name: "Tom Cho", nameZh: "卓桐華" },
  ],
  foxconn: [
    { role: "Founder / Major shareholder", name: "Terry Gou", nameZh: "郭台銘", since: 1974 },
    { role: "Chairman / CEO", name: "Young Liu", nameZh: "劉揚偉", since: 2019 },
  ],
  aspeed: [
    { role: "Chairman / CEO", name: "Chris Lin", nameZh: "林任韋" },
  ],

  // --- 電源 ---
  vertiv: [
    { role: "CEO", name: "Giordano Albertazzi", since: 2023 },
  ],
  mps: [
    { role: "Founder / Chairman / CEO", name: "Michael Hsing", nameZh: "邢正人", since: 1997 },
  ],
  eaton: [
    { role: "Chairman / CEO", name: "Craig Arnold", since: 2016 },
  ],
  delta: [
    { role: "Founder", name: "Bruce Cheng", nameZh: "鄭崇華", since: 1971 },
    { role: "Chairman", name: "Yancey Hai", nameZh: "海英俊" },
  ],
  liteon: [
    { role: "Founder / Chairman", name: "Raymond Soong", nameZh: "宋恭源" },
  ],
  acbel: [
    { role: "Chairman", name: "Shu Hsiung Hsu", nameZh: "許勝雄", note: "金仁寶集團" },
  ],
  chicony: [
    { role: "Chairman", name: "Mao-Kuei Lin", nameZh: "林茂桂", note: "群光集團" },
  ],
  chroma: [
    { role: "Founder / Chairman", name: "Leo Huang", nameZh: "黃震智" },
  ],
  ti: [
    { role: "President / CEO", name: "Haviv Ilan", since: 2023 },
  ],
  schneider: [
    { role: "CEO", name: "Olivier Blum", since: 2025 },
  ],

  // --- 散熱 ---
  avc: [
    { role: "Chairman", name: "Lin Yu-Shen", nameZh: "林育申" },
  ],
  auras: [
    { role: "Chairman", name: "Shen Ching-Hsin", nameZh: "沈慶行" },
  ],
  sunon: [
    { role: "Chairman", name: "Charles Hong", nameZh: "洪銀樹" },
  ],
  jentech: [
    { role: "Chairman", name: "Huang Kuo-Chun", nameZh: "黃國欽" },
  ],

  // --- 日股設備/封裝 ---
  advantest: [
    { role: "President / CEO", name: "Douglas Lefever", since: 2024 },
  ],
  tel: [
    { role: "President / CEO", name: "Toshiki Kawai", nameZh: "河合 利樹", since: 2016 },
  ],
  disco: [
    { role: "President / CEO", name: "Kazuma Sekiya", nameZh: "関家 一馬" },
  ],

  // --- HBM / inspection ---
  camtek: [
    { role: "CEO", name: "Rafi Amit", since: 2015 },
  ],
};
