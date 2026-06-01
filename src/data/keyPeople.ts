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
      leadershipReasons: {
        talentOrganization: "公司高速擴張，跨層級留才壓力高；文化偏精英主義，部分中階員工流失",
        integrityGovernance: "與 OEM / foundry 議價權力差距顯著；個人發言偶有市場影響引發監管關注",
      },
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
      leadershipReasons: {
        strategicJudgement: "AI GPU 戰略反應較 Nvidia 晚一拍，2023 才全力進入推 MI300",
        capitalAllocation: "Xilinx 490 億美元併購整合可，但 ROIC 提升尚待證明",
        customerEcosystem: "hyperscaler GPU 訂單上仍被 Nvidia CUDA 生態系阻隔，軟體棧落差大",
        financialDiscipline: "折舊與庫存週期波動敏感，GPU 毛利率與 Nvidia 仍有 20pp+ 差距",
      },
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
      leadershipReasons: {
        strategicJudgement: "任期僅數月，18A / IFS 戰略仍待驗證；繼承前任複雜局面",
        execution: "上任太短，主要工作仍是穩定組織與量產 ramp，無實質執行紀錄",
        capitalAllocation: "大型 capex（IFS 廠房）由前任啟動；新任資本紀律待證明",
        technicalProductInsight: "Cadence 背景偏 EDA，半導體製造技術深度仰賴 Intel 既有團隊",
        talentOrganization: "Intel 大規模裁員後留才挑戰高；組織重整尚在進行",
        integrityGovernance: "公司治理重整中，董事會結構仍在優化",
        customerEcosystem: "IFS 大客戶（Microsoft、Amazon）取得仍是上任後最大挑戰",
        resilience: "任期短，未經歷完整循環考驗",
        financialDiscipline: "公司負債壓力高，紀律需 ROIC 提升證明",
        communication: "公開風格直率但策略前瞻指引仍模糊",
      },
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
      leadershipReasons: {
        technicalProductInsight: "工程背景偏 IC，軟體（VMware）技術深度仰賴 CTO 與被併公司主管",
        talentOrganization: "以激進裁員與成本壓縮聞名，併購後常大規模裁員，留才文化偏負面",
        integrityGovernance: "Symantec 整合與 VMware 收購後的價格策略引發部分客戶與監管質疑",
        customerEcosystem: "軟體收購後對部分客戶價格上漲，訂閱模式轉換引發客戶反彈",
        communication: "法說會風格簡短直接，對股東透明但媒體與客戶溝通較少",
      },
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
      leadershipReasons: {
        strategicJudgement: "靠連續併購（Cavium / Inphi / Innovium）拼出當前格局，自主前瞻判斷較弱",
        execution: "各 BU 整合進度尚可，但 ASIC 訂單依賴單一大客戶，執行集中度高",
        capitalAllocation: "連續大型併購讓公司負債高，去槓桿進度緩慢",
        technicalProductInsight: "業務背景出身，技術深度仰賴 BU 技術主管",
        talentOrganization: "多次併購整合後組織文化仍在融合",
        integrityGovernance: "治理結構標準，無重大瑕疵但無突出之處",
        customerEcosystem: "大訂單集中於 Amazon Trainium，hyperscaler 客戶集中度風險",
        resilience: "公司歷經多次併購整合，相對穩定但無突出抗壓表現",
        financialDiscipline: "毛利率受 ASIC 業務 ramp 影響，紀律佳但波動大",
        communication: "法說會風格中規中矩，前瞻指引保守",
      },
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
      leadershipReasons: {
        strategicJudgement: "靠台積電生態系與 hyperscaler ASIC 訂單成長，自主戰略空間有限",
        execution: "專案 ramp 控制良好但毛利率隨客戶議價波動",
        capitalAllocation: "公司主要靠 NRE + 量產費，無大型併購紀錄；資金多用於擴充設計能量",
        talentOrganization: "公司規模快速擴張，留才壓力高",
        integrityGovernance: "治理結構標準，無重大瑕疵但無突出",
        customerEcosystem: "客戶極度集中於少數北美 hyperscaler，分散度低",
        resilience: "公司規模仍小，景氣大循環下抗壓性尚待證明",
        financialDiscipline: "高度仰賴單一專案 ramp-up，現金流隨客戶 milestone 波動",
        communication: "法說會多以技術導向回應，市場期望溝通較不主動",
      },
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
      leadershipReasons: {
        strategicJudgement: "策略路線高度跟隨台積電節奏，自主前瞻判斷空間有限",
        execution: "與台積電節奏同步，執行紀律佳但缺自主性",
        capitalAllocation: "資本配置多由母公司台積電牽動，獨立投資決策能見度低",
        technicalProductInsight: "技術深度仰賴台積電製程節點，自主 IP 投入相對有限",
        talentOrganization: "公司規模穩定，組織擴張節奏謹慎",
        integrityGovernance: "治理結構標準，無重大瑕疵",
        resilience: "經歷多次景氣循環尚穩，抗壓性受制於母公司",
        financialDiscipline: "毛利受客戶價格議價影響大，紀律雖佳但缺差異化",
        communication: "與台積電綁定使對外溝通內容受限，較少獨立指引",
      },
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
      leadershipReasons: {
        capitalAllocation: "規模化後現金充裕但無大型併購；資本多以股息回饋股東",
        financialDiscipline: "高階手機 SoC ASP 持續壓力，毛利率與 Qualcomm 仍有差距",
        communication: "創辦人風格低調，公開發言不多；對外溝通仰賴經營層",
      },
      leadershipConfidence: "High",
    },
    {
      role: "CEO",
      name: "Rick Tsai",
      nameZh: "蔡力行",
      since: 2018,
      bio: "前台積電 CEO，2017 加入聯發科任 CEO；執行力嚴謹；主導 Dimensity 高階線突破與 Nvidia GB10 合作。",
      leadership: L(4, 5, 4, 5, 5, 5, 4, 5, 4, 4),
      leadershipReasons: {
        strategicJudgement: "接班執行良好但策略基調仍由創辦人定調",
        capitalAllocation: "資本配置謹慎，與 Tsai Ming-Kai 風格一致；無大型併購足跡",
        customerEcosystem: "高階手機 SoC 客戶集中於中國品牌，hyperscaler GB10 為新嘗試",
        financialDiscipline: "毛利率受 ASP 競爭壓力，紀律佳但成長放緩",
        communication: "工程背景，對外溝通實務但不華麗",
      },
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
      leadershipReasons: {
        strategicJudgement: "HBM 起步較 SK Hynix 晚但成功切入，前瞻性中上而非最強",
        execution: "良率與 ramp 紀律佳，但 HBM3E 12-Hi 認證進度落後 SK Hynix",
        capitalAllocation: "美國本土廠擴產（Idaho、紐約）capex 龐大、補貼依賴度高，ROIC 待證明",
        talentOrganization: "美國 + 亞洲多廠體系下，跨區人才整合仍有摩擦",
        customerEcosystem: "Nvidia HBM 取得認證但份額落後 SK Hynix；hyperscaler 直供仍在擴張",
        financialDiscipline: "記憶體循環使單季毛利率劇烈波動，紀律佳但結構性限制",
        communication: "法說會中規中矩，前瞻產業循環指引保守",
      },
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
      leadershipReasons: {
        strategicJudgement: "HBM 戰略由前任奠定，新任策略獨立性尚待表現",
        execution: "任期僅 1 年餘，HBM 主導地位由前任打下基礎",
        capitalAllocation: "韓國總部與 SK Group 主導大型 capex 決策，CEO 自主性受限",
        technicalProductInsight: "管理背景，技術細節仰賴 R&D 副總",
        talentOrganization: "新上任，組織重整效果尚未顯現",
        integrityGovernance: "SK Group 集團治理結構標準，無重大個人瑕疵但透明度一般",
        customerEcosystem: "HBM 與 hyperscaler 綁定深，但客戶關係多由前任建立",
        resilience: "任期短，未經完整循環考驗",
        financialDiscipline: "記憶體循環使毛利劇烈波動，新任紀律待證明",
        communication: "韓國企業文化封閉，本人英文公開發言罕見",
      },
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
      leadershipReasons: {
        strategicJudgement: "AI 戰略反應較競爭對手慢但近期積極追趕，前瞻性中等",
        execution: "HBM 與 Foundry 接連落後台積電 / SK Hynix，執行節奏被質疑",
        capitalAllocation: "三星集團整體 capex 規模龐大但 HBM / Foundry 投資 ROIC 落後",
        technicalProductInsight: "本身是法商背景，技術細節仰賴下屬高階主管",
        talentOrganization: "三星半導體部門近年高階主管離職傳聞不少",
        integrityGovernance: "2017 賄賂案被定罪後特赦；治理透明度長期被批評",
        customerEcosystem: "與 hyperscaler 之 HBM 認證進度落後，生態系話語權削弱",
        resilience: "三星集團韌性高但半導體部門 2024 利潤承壓",
        financialDiscipline: "DS 部門毛利率波動大，紀律佳但落後 SK Hynix",
        communication: "韓國企業文化封閉，對外溝通仰賴 IR；本人公開發言罕見",
      },
      leadershipConfidence: "Medium",
    },
    {
      role: "DS Division Head",
      name: "Jun Young-hyun",
      nameZh: "全永鉉",
      bio: "2024 接任半導體部門負責人，主要任務是追上 SK Hynix 在 HBM 的領先。",
      leadership: L(4, 3, 3, 4, 3, 4, 3, 4, 3, 3),
      leadershipReasons: {
        strategicJudgement: "HBM 追趕戰略由集團定調，個人前瞻判斷空間有限",
        execution: "任期僅 1 年多，HBM 追趕進度仍待證明",
        capitalAllocation: "重大投資決策多由集團層級決定，自主性有限",
        technicalProductInsight: "DRAM 製程出身但 HBM 封裝整合涉及跨部門協作，個人主導力受限",
        talentOrganization: "新上任，組織重整效果尚未顯現",
        integrityGovernance: "集團治理結構標準，無重大個人瑕疵但獨立性受限",
        customerEcosystem: "Nvidia 對 Samsung HBM3E 認證仍未拿下 12-Hi 主流訂單",
        resilience: "新任，未經歷完整循環考驗",
        financialDiscipline: "三星 DS 部門 2024 利潤承壓，紀律有待觀察",
        communication: "新任，市場熟悉度低",
      },
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
      leadershipReasons: {
        strategicJudgement: "在 HBM 主戰場未布局，戰略仍困在標準型 DRAM 紅海",
        execution: "南科本身執行紀律佳但缺市場領先 ramp 機會",
        capitalAllocation: "DRAM 設備折舊高，資本配置自由度受限",
        technicalProductInsight: "技術深度集中於利基 DRAM；前瞻技術投入受規模限制",
        talentOrganization: "公司規模穩定但留才面對國際大廠競爭壓力",
        integrityGovernance: "治理結構符合台灣上市規範，無突出之處",
        customerEcosystem: "客戶為 PC / consumer 通路，無 hyperscaler 直接綁定",
        financialDiscipline: "毛利率受 DRAM 循環影響大，紀律佳但結構壓力高",
        communication: "法說會穩定但前瞻產業景氣指引保守",
      },
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
      leadershipReasons: {
        strategicJudgement: "聚焦利基 DRAM/NOR Flash，避開主流戰場是穩健但無突破",
        execution: "利基產品執行紀律佳，但 ramp 規模受市場限制",
        capitalAllocation: "新廠投資（高雄 25 廠）後折舊壓力高，資本紀律受質疑",
        technicalProductInsight: "NOR Flash 技術領先利基，但 DRAM 前瞻投入有限",
        talentOrganization: "華新麗華集團文化下，人才吸引力受限於規模",
        integrityGovernance: "集團治理結構標準，無重大瑕疵",
        customerEcosystem: "客戶分散於 IoT / 工控 / 汽車，無 hyperscaler 級綁定",
        financialDiscipline: "新廠折舊壓力使近年毛利率承壓，紀律有待恢復",
        communication: "法說會頻率穩定但策略前瞻溝通較少",
      },
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
      leadershipReasons: {
        strategicJudgement: "策略基調仍延續創辦人張忠謀框架，自主前瞻判斷穩健但無革命性突破",
        capitalAllocation: "海外擴廠（亞利桑那、熊本）成本與生產效率挑戰使整體 ROIC 待證明",
        communication: "工程背景，法說會技術紮實但對市場期望管理風格保守",
      },
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
      leadershipReasons: {
        strategicJudgement: "戰略延續前任既有框架，新任獨立前瞻判斷尚待表現",
        execution: "EUV / High-NA ramp 由前任奠定，新任任期短",
        capitalAllocation: "ASML 主要靠 R&D 與大型訂單 ramp，無大型併購足跡",
        talentOrganization: "公司文化穩定但全球擴張使跨地域人才整合挑戰升高",
        integrityGovernance: "出口管制（對中國）成為治理新挑戰，平衡多方壓力",
        resilience: "新任，未經完整景氣循環考驗",
        financialDiscipline: "訂單能見度好但客戶 push-out 風險顯現於 2024",
        communication: "公開風格較前任低調，市場熟悉度仍在建立",
      },
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
      leadershipReasons: {
        strategicJudgement: "多元化策略穩健但前瞻押注（如 ICAPS）成效中等",
        execution: "執行紀律佳但 KLA / ASML 在特定領域仍維持領先",
        capitalAllocation: "R&D 比重高、回購紀律佳；無大型轉型併購",
        technicalProductInsight: "業務 + 工程混合背景，技術深度仰賴 BU 主管",
        talentOrganization: "公司規模穩定但與 ASML 之高階人才競爭激烈",
        integrityGovernance: "治理結構標準，無重大爭議",
        customerEcosystem: "客戶集中於前三大代工 / 記憶體廠，hyperscaler 無直接綁定",
        financialDiscipline: "毛利率受設備循環影響波動，紀律佳但結構性限制",
        communication: "法說會中規中矩，前瞻指引保守",
      },
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
      leadershipReasons: {
        strategicJudgement: "蝕刻 / 沉積專精穩定，但在新領域（先進封裝）跟進為主",
        execution: "中國出口管制下執行紀律佳但市場結構性壓力大",
        capitalAllocation: "R&D + 回購紀律佳，無大型併購足跡",
        technicalProductInsight: "技術背景出身，產品深度紮實但前瞻判斷中等",
        talentOrganization: "公司規模穩定但與 ASML / AMAT 高階人才競爭壓力",
        integrityGovernance: "治理結構標準，無重大爭議",
        customerEcosystem: "客戶集中於記憶體廠，hyperscaler 無直接綁定",
        resilience: "經歷中國管制衝擊仍維持成長，但 2022-23 記憶體下行週期承壓",
        financialDiscipline: "毛利率穩定但受記憶體 capex 影響波動",
        communication: "法說會風格謹慎，前瞻指引保守",
      },
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
      leadershipReasons: {
        strategicJudgement: "檢測獨佔策略穩固但 EDA / 軟體擴張前瞻判斷較被動",
        talentOrganization: "公司規模相對小、文化保守，跨國人才吸引力略遜大廠",
        customerEcosystem: "客戶高度集中於前三大代工，分散度有限",
        communication: "創辦級長期 CEO 但對外發言不多，依賴 CFO 與 IR",
      },
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
      leadershipReasons: {
        strategicJudgement: "任期短，尚無公開戰略前瞻可評",
        execution: "尚未經歷完整循環，執行紀錄待累積",
        capitalAllocation: "新任，無重大資本配置決策可佐證",
        technicalProductInsight: "非工程出身，技術深度仰賴日本團隊",
        talentOrganization: "外部空降，與日本總部文化整合尚在過程中",
        integrityGovernance: "日本上市公司治理標準，無重大爭議但獨立性受限",
        customerEcosystem: "新任，與大客戶直接關係待建立",
        resilience: "尚未經歷大循環",
        financialDiscipline: "新任，紀律待證明",
        communication: "市場熟悉度低，公開發言不多",
      },
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
      leadershipReasons: {
        strategicJudgement: "蝕刻 / 沉積與 EUV 配套穩固，但對先進封裝前瞻押注較被動",
        execution: "執行紀律佳但中國市場波動使單季 ramp 受外部限制",
        capitalAllocation: "R&D 投入穩定但無大型併購；現金多以股息回饋",
        technicalProductInsight: "技術背景出身，產品深度紮實但前瞻判斷中等",
        talentOrganization: "日本總部文化使國際人才吸引力受限",
        customerEcosystem: "客戶集中於前段製程廠，hyperscaler 無直接綁定",
        resilience: "經歷多次景氣循環尚穩，但對中國依賴度高",
        financialDiscipline: "毛利率受設備循環影響波動",
        communication: "日系 IR 風格保守，對外英文溝通較少；策略指引內斂",
      },
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
      leadershipReasons: {
        strategicJudgement: "切割 / 研磨主導但新領域擴張較被動",
        capitalAllocation: "公司規模小、現金多以股息回饋，無大型併購",
        integrityGovernance: "創辦家族治理結構標準，無重大爭議但獨立董事比例較低",
        customerEcosystem: "客戶集中於封裝廠，hyperscaler 無直接綁定",
        resilience: "受半導體景氣循環影響大，但市占維持領先",
        financialDiscipline: "毛利率受設備循環影響波動，紀律佳但結構性限制",
        communication: "日系小型企業，IR 訊息頻率低，市場關注主要來自設備數據",
      },
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
      leadershipReasons: {
        strategicJudgement: "連續併購建立 OSAT 規模，前瞻性中上但近期 CoWoS 角色仍跟隨台積電",
        capitalAllocation: "矽品併購整合長達數年，去槓桿進度可但 ROIC 仍待提升",
        technicalProductInsight: "業務背景，先進封裝技術細節仰賴弟弟張洪本與工程主管",
        talentOrganization: "家族企業文化下，外部高階人才吸引力受限",
        integrityGovernance: "家族控股結構使治理透明度被質疑；早期併購過程有股權爭議",
        customerEcosystem: "OSAT 龍頭但 hyperscaler 直接綁定弱於 TSMC CoWoS",
        financialDiscipline: "毛利率受 OSAT 競爭壓力，紀律佳但結構性限制",
        communication: "本人公開發言罕見，集團溝通仰賴 CFO 與 IR；風格低調",
      },
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
      leadershipReasons: {
        strategicJudgement: "客戶集中於 Nvidia 鏈，缺乏主動戰略多元化判斷",
        execution: "測試 ramp 紀律佳但 AI 訂單 ramp 速度受設備瓶頸限制",
        capitalAllocation: "中國蘇州廠出脫後資本配置策略仍在重整",
        technicalProductInsight: "測試專精但對前段製程趨勢仰賴客戶引導",
        talentOrganization: "公司規模穩定但與大型 OSAT 相比留才挑戰",
        integrityGovernance: "上市公司治理結構標準，無重大爭議",
        customerEcosystem: "AI 客戶集中度過高，hyperscaler 直接綁定弱",
        resilience: "經歷消費電子與 AI 兩次循環尚穩，但中國業務調整使財報波動",
        financialDiscipline: "毛利率受 AI 客戶議價影響，紀律佳但波動大",
        communication: "法說會頻率穩定但策略前瞻溝通較少",
      },
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
      leadershipReasons: {
        strategicJudgement: "ABF 載板長期領先但 AI 時點押注稍嫌被動",
        execution: "AI 訂單 ramp 紀律佳但 capex 擴張時點不順",
        capitalAllocation: "2021-2022 ABF 大幅擴產後遭遇庫存週期，配置時點被質疑",
        technicalProductInsight: "PCB 技術深度紮實但業務背景使前瞻押注仰賴 R&D 主管",
        talentOrganization: "公司規模穩定但與南電 / Ibiden 高階人才競爭",
        integrityGovernance: "上市公司治理結構標準，無重大爭議",
        customerEcosystem: "AI hyperscaler 直供關係建立中但仍經 OEM 中介",
        financialDiscipline: "毛利率受 ABF 庫存與 ramp 影響大幅波動",
        communication: "法說會風格穩健但策略前瞻指引保守",
      },
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
      leadershipReasons: {
        strategicJudgement: "ABF 戰略跟隨欣興，自主前瞻判斷較少；公開資訊有限",
        execution: "AI 訂單比重低於欣興，執行節奏被質疑",
        capitalAllocation: "台塑集團決策層級高，資本配置自由度受限",
        technicalProductInsight: "化工背景，半導體載板技術深度仰賴下屬",
        talentOrganization: "傳統台塑集團文化，吸引外部人才較難",
        integrityGovernance: "台塑集團治理結構標準，無重大爭議但獨立性受限",
        customerEcosystem: "客戶為傳統 CPU 廠，hyperscaler 直接綁定弱於欣興",
        resilience: "歷經 PCB 多次循環尚穩，但 AI 浪潮中相對掉隊",
        financialDiscipline: "高 capex 投資後折舊壓力大，紀律有待證明",
        communication: "台塑集團發言保守，市場前瞻指引少",
      },
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
      leadershipReasons: {
        strategicJudgement: "ABF 載板長期領先但 AI ramp 押注節奏較欣興保守",
        execution: "ramp 紀律佳但日本本土產能擴張速度受人力限制",
        capitalAllocation: "新廠擴產 capex 龐大，ROIC 提升待 AI 訂單兌現",
        technicalProductInsight: "技術專精但業務背景使前瞻押注仰賴下屬",
        talentOrganization: "日本總部文化使國際人才吸引力受限",
        customerEcosystem: "Intel / Apple 大客戶綁定深但 hyperscaler 直接綁定弱",
        resilience: "經歷多次 PCB 循環尚穩，但日圓貶值使財報波動",
        financialDiscipline: "毛利率受庫存週期影響大幅波動",
        communication: "日系企業 IR 風格保守，英文溝通與市場前瞻指引較少",
      },
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
      leadershipReasons: {
        strategicJudgement: "hyperscaler 市場長期被 Arista / 白牌吃下，轉型雲端安全節奏被批落後",
        execution: "Splunk 整合與 SaaS 轉型執行進度可，但市占恢復未見實質突破",
        capitalAllocation: "Splunk 280 億美元收購規模大，整合成效尚待證明",
        technicalProductInsight: "業務背景，技術前瞻仰賴 CTO 與工程主管",
        talentOrganization: "公司規模大但近年高階人才流失與重組頻繁",
        integrityGovernance: "上市公司治理結構標準，無重大爭議",
        customerEcosystem: "傳統企業客戶綁定深但 hyperscaler 直接綁定弱",
        resilience: "歷經多次科技循環尚穩但近期成長動能受質疑",
        financialDiscipline: "毛利率穩定但訂閱轉型使短期現金流承壓",
        communication: "法說會風格中規中矩，前瞻指引保守",
      },
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
      leadershipReasons: {
        capitalAllocation: "公司現金充裕但無大型併購；多以股票回購回饋股東，ROIC 提升空間有限",
      },
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
      leadershipReasons: {
        strategicJudgement: "AI connectivity 切入時點掌握佳但戰略全面性仍在建立",
        execution: "PCIe / CXL 產品 ramp 紀律佳但客戶 push-out 偶有發生",
        capitalAllocation: "上市未久（2024 IPO），尚無大型併購或紀律性買回紀錄",
        talentOrganization: "公司規模快速擴張，留才壓力上升",
        integrityGovernance: "新上市公司，治理透明度建立中",
        customerEcosystem: "Nvidia / hyperscaler 綁定深但客戶集中度高",
        resilience: "公司規模小，未經完整景氣循環考驗",
        financialDiscipline: "高估值（PE > 200）下毛利率與成長預期需持續驗證",
        communication: "新公司、新 CEO，IR 風格務實但市場熟悉度仍在建立",
      },
      leadershipConfidence: "Medium",
    },
  ],
  credo: [
    {
      role: "CEO",
      name: "Bill Brennan",
      bio: "Credo Technology CEO，主導 AEC 與高速 SerDes 產品線。",
      leadership: L(4, 4, 3, 5, 4, 4, 4, 4, 3, 4),
      leadershipReasons: {
        strategicJudgement: "AEC 押注時點掌握佳但長期 802.3 標準競爭加劇",
        execution: "AEC ramp 紀律佳但毛利率因競爭壓力承壓",
        capitalAllocation: "公司規模仍小，無大型併購；資金多用於 R&D 與產能擴張",
        talentOrganization: "公司規模小，與大廠人才競爭吃力",
        integrityGovernance: "上市公司治理結構標準，無重大爭議",
        customerEcosystem: "客戶極度集中（單一大客戶占大半營收），分散度低",
        resilience: "公司規模小，未經完整景氣循環考驗",
        financialDiscipline: "客戶極度集中（單一大客戶占大半營收），波動風險高",
        communication: "公司規模小，IR 頻率與深度有限",
      },
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
      leadershipReasons: {
        strategicJudgement: "戰略由前任 Aart de Geus 奠定，新任獨立判斷尚待表現",
        execution: "EDA 業務 ramp 穩定但 Ansys 整合進度待證明",
        capitalAllocation: "Ansys 350 億美元收購為公司史上最大案，整合與綜效尚待證明",
        talentOrganization: "Ansys 整合下跨組織文化融合挑戰高",
        integrityGovernance: "上市公司治理結構標準，無重大爭議",
        resilience: "新任，未經完整循環考驗",
        financialDiscipline: "Ansys 收購負債高，去槓桿與 ROIC 提升待 1-2 年觀察",
        communication: "新任 CEO，公開風格延續前任務實作風，但市場期望管理仍在建立",
      },
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
      leadershipReasons: {
        strategicJudgement: "三引擎策略清晰但相較 Synopsys + Ansys 跨域整合稍嫌保守",
        execution: "EDA + IP 業務 ramp 穩定但無突破性執行突破",
        capitalAllocation: "持續中小型併購（Beta CAE 等）紀律佳但無轉型級交易",
        talentOrganization: "公司規模穩定但與 Synopsys 高階人才競爭",
        integrityGovernance: "上市公司治理結構標準，無重大爭議",
        resilience: "經歷多次半導體循環尚穩，但客戶 EDA 預算偶有波動",
        financialDiscipline: "毛利率穩定但訂閱轉型使短期現金流承壓",
        communication: "法說會風格務實但前瞻指引保守",
      },
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
      leadershipReasons: {
        strategicJudgement: "分散併購策略穩健但前瞻押注（如 AI 高速連接器）跟隨為主",
        technicalProductInsight: "業務背景，產品技術深度仰賴 BU 主管",
        communication: "法說會風格務實但前瞻指引保守，創辦人風格低調",
      },
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
      leadershipReasons: {
        strategicJudgement: "車用與工業為主軸，AI 資料中心比重低於 Amphenol；前瞻押注較被動",
        execution: "BU 整合執行紀律佳但成長動能落後 Amphenol",
        capitalAllocation: "中型併購紀律穩定但無大型轉型交易",
        technicalProductInsight: "業務背景，技術深度仰賴 BU 主管",
        talentOrganization: "公司規模穩定但與 Amphenol 高階人才競爭",
        integrityGovernance: "上市公司治理結構標準，無重大爭議",
        customerEcosystem: "車用 / 工業客戶綁定深但 hyperscaler 直接綁定弱",
        resilience: "歷經多次景氣循環尚穩但車用景氣下行壓力大",
        financialDiscipline: "毛利率受車用 / 工業景氣影響波動",
        communication: "法說會風格中規中矩，前瞻指引保守",
      },
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
      leadershipReasons: {
        strategicJudgement: "AI 光通訊聚焦方向正確但戰略獨立性受併購結構限制",
        execution: "II-VI / Finisar 整合執行紀律佳但 ramp 仍受庫存週期影響",
        capitalAllocation: "前任 II-VI / Finisar 大型併購後負債高，新任 CEO 正在去槓桿，自由度有限",
        technicalProductInsight: "業務 + 軟體背景，光通訊技術細節仰賴 R&D 主管",
        talentOrganization: "併購整合後組織文化仍在融合",
        integrityGovernance: "上市公司治理結構標準，無重大爭議",
        customerEcosystem: "hyperscaler 訂單 ramp 但與競爭對手 Lumentum 拉鋸",
        resilience: "公司歷經多次併購整合，新 CEO 任期下抗壓性待證明",
        financialDiscipline: "高負債下毛利率復甦緩慢，紀律有待 1-2 年驗證",
        communication: "新 CEO 任期短，市場熟悉度仍在建立",
      },
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
      leadershipReasons: {
        strategicJudgement: "聚焦資料中心方向正確但 3D sensing 退場節奏需謹慎",
        execution: "Cloud Light 整合執行進度可但毛利率回升緩慢",
        capitalAllocation: "Cloud Light 收購後現金水位較緊；3D sensing 業務拖累需處理",
        technicalProductInsight: "前 Synaptics 背景偏 IC 系統，光通訊技術細節仰賴 R&D 主管",
        talentOrganization: "新 CEO 帶來重組，組織穩定性下降",
        integrityGovernance: "上市公司治理結構標準，無重大爭議",
        customerEcosystem: "hyperscaler 訂單 ramp 但與 Coherent 拉鋸",
        resilience: "新任 CEO，未經完整循環考驗",
        financialDiscipline: "Cloud Light 整合與 3D sensing 拖累使紀律有待證明",
        communication: "新 CEO 任期短，市場期望管理仍在建立",
      },
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
      leadershipReasons: {
        strategicJudgement: "代工業務專精穩定但前瞻押注（垂直整合）較保守",
        capitalAllocation: "現金累積快但無大型併購，多以股票回購回饋",
        technicalProductInsight: "代工服務角色，技術前瞻仰賴客戶（Nvidia / Coherent）引導",
        resilience: "客戶集中於 Nvidia 鏈，AI 訂單下行週期未經考驗",
        communication: "公司低調，法說會穩定但前瞻指引保守",
      },
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
      leadershipReasons: {
        strategicJudgement: "業務在資料中心 / CATV / 電信間多次搖擺，戰略一致性低",
        execution: "多次下修財測與目標延遲，執行可預測性不佳",
        capitalAllocation: "頻繁增資稀釋股東；2024 多次發新股引發投資人不滿",
        technicalProductInsight: "雷射 / 光收發器技術專精但多次架構轉型使深度被稀釋",
        talentOrganization: "高階主管異動頻繁，組織穩定度低",
        integrityGovernance: "曾被 SEC 調查（後撤銷），治理結構簡單但有過爭議",
        customerEcosystem: "與 Microsoft / Amazon 等大客戶關係波動，訂單能見度低",
        resilience: "歷經多次大客戶取消、財報下修，但公司未倒；韌性中等而非卓越",
        financialDiscipline: "毛利率持續壓力，自由現金流多年為負",
        communication: "預測屢屢失準，市場信任度低",
      },
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
      leadershipReasons: {
        strategicJudgement: "早期支援 Nvidia 平台戰略眼光佳但近年治理問題稀釋判斷力評價",
        execution: "AI server 量產 ramp 速度業界領先但會計與供應鏈紀律不足",
        capitalAllocation: "資本支出激進、存貨大幅膨脹後又需減記，配置紀律不佳",
        talentOrganization: "公司高速擴張下高階主管離職傳聞不少，CFO 換手頻繁",
        integrityGovernance: "2024 延遲提交 10-K 引發 Hindenburg 做空報告與 DOJ 調查，治理重大瑕疵",
        customerEcosystem: "Nvidia / 大客戶綁定深但 hyperscaler 直供關係受治理疑慮影響",
        financialDiscipline: "毛利率劇烈波動、現金流不穩；應收帳款與存貨佔比高",
        communication: "對交易市場資訊揭露屢有延遲與更正，市場信任度低",
      },
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
      leadershipReasons: {
        strategicJudgement: "ODM 主業穩健但 AI server 押注時點較廣達晚",
        execution: "緯穎分拆執行漂亮但本體緯創 AI 業務 ramp 跟隨為主",
        capitalAllocation: "分拆緯穎是漂亮的資本配置，但本體後續 capex 紀律一般",
        technicalProductInsight: "業務 / 集團背景，技術深度仰賴緯穎與工程主管",
        talentOrganization: "公司規模穩定但高階人才與廣達 / 鴻海競爭壓力",
        customerEcosystem: "NB / Server 客戶綁定深但 hyperscaler 直供透過緯穎",
        financialDiscipline: "毛利率受 ODM 競爭壓力，紀律佳但結構性限制",
        communication: "法說會風格務實但前瞻指引保守",
      },
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
      leadershipReasons: {
        strategicJudgement: "hyperscaler 直供策略執行漂亮但客戶集中度高（Meta / Microsoft 為主）",
        capitalAllocation: "ODM Direct 模式下 capex 自由度有限，資本多隨客戶訂單擴張",
        technicalProductInsight: "業務背景，rack-scale 整合技術細節仰賴工程主管",
        talentOrganization: "公司快速擴張下留才壓力高",
        integrityGovernance: "上市公司治理結構標準，無重大爭議但與緯創關聯人交易需關注",
        resilience: "公司歷史短，未經完整景氣循環考驗",
        financialDiscipline: "毛利率受 hyperscaler 議價壓力，紀律佳但結構性限制",
        communication: "法說會穩定但與客戶相關訊息受限於 NDA",
      },
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
      leadershipReasons: {
        technicalProductInsight: "業務 / 美學背景出身，技術深度仰賴工程主管（如總經理楊麒令）",
        communication: "創辦人風格優雅但對外發言不多，前瞻指引仰賴經營層",
      },
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
      leadershipReasons: {
        strategicJudgement: "AI server 跟進但非領先佈局，多年無突破性戰略動作",
        execution: "ODM 執行紀律佳但毛利率受競爭壓力",
        capitalAllocation: "ODM 模式資本配置自由度低，多隨客戶訂單擴張",
        technicalProductInsight: "業務背景，rack-scale 技術細節仰賴工程主管",
        talentOrganization: "公司規模穩定但高階人才與廣達 / 鴻海競爭壓力",
        integrityGovernance: "上市公司治理結構標準，無重大爭議",
        customerEcosystem: "NB / Server 客戶綁定深但 hyperscaler 直供弱於緯穎",
        resilience: "經歷多次景氣循環尚穩，但 AI 浪潮中相對掉隊",
        financialDiscipline: "毛利率受 ODM 競爭壓力，紀律佳但結構性限制",
        communication: "法說會中規中矩，前瞻指引相對保守",
      },
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
      leadershipReasons: {
        strategicJudgement: "EMS 規模化戰略卓越但近年「3+3」新事業（EV / 半導體）成效中等",
        capitalAllocation: "全球擴廠紀律佳但近年電動車 / 半導體投資 ROIC 未顯現",
        technicalProductInsight: "業務 / 製造背景，技術細節仰賴各 BU 主管",
        talentOrganization: "公司規模龐大但高階人才循環頻繁",
        integrityGovernance: "鴻海在中國勞工待遇與 iPhone 廠勞動爭議多次受監督；個人 2024 政治介入引發爭議",
        customerEcosystem: "Apple / 大客戶綁定深但對單一客戶依賴度高",
        financialDiscipline: "毛利率受 EMS 競爭壓力長期偏低，但週轉率管理優",
        communication: "個性直率，發言常引發股價波動；近年退出後溝通仍偶爾影響市場",
      },
      leadershipConfidence: "High",
    },
    {
      role: "Chairman / CEO",
      name: "Young Liu",
      nameZh: "劉揚偉",
      since: 2019,
      bio: "郭台銘接班人，2019 起執掌；主導「3+3」新事業；在 GB200 rack-scale 整合中扮演核心角色。",
      leadership: L(4, 4, 4, 4, 4, 4, 4, 4, 4, 4),
      leadershipReasons: {
        strategicJudgement: "「3+3」新事業策略清晰但成效尚未全面顯現",
        execution: "GB200 ramp 執行漂亮但 EV / 半導體 ramp 進度落後",
        capitalAllocation: "EV / 半導體 capex 龐大，ROIC 提升尚待 2-3 年驗證",
        technicalProductInsight: "業務 / 工程混合背景，跨域技術深度仰賴 BU 主管",
        talentOrganization: "公司規模龐大但高階人才循環持續",
        integrityGovernance: "上市公司治理結構標準，但仍受集團創辦人風格影響",
        customerEcosystem: "Apple / Nvidia 大客戶綁定深但對單一客戶依賴度仍高",
        resilience: "公司歷經多次景氣循環尚穩，但 EV / 半導體新事業未經考驗",
        financialDiscipline: "毛利率受 EMS 競爭壓力長期偏低",
        communication: "法說會風格務實但前瞻指引保守",
      },
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
      leadershipReasons: {
        strategicJudgement: "BMC 獨佔戰略漂亮但新領域擴張較被動",
        capitalAllocation: "公司規模仍小且現金充裕但無大型併購；資金多以股息回饋股東",
        talentOrganization: "公司規模小但留才壓力高（與大廠人才競爭）",
        integrityGovernance: "上市公司治理結構標準，無重大爭議",
        resilience: "經歷多次景氣循環尚穩但客戶集中度高",
        financialDiscipline: "毛利率高但客戶集中於 Nvidia / 大廠，波動風險高",
        communication: "創辦人風格低調，法說會風格穩定但前瞻指引保守",
      },
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
      leadershipReasons: {
        strategicJudgement: "AI 資料中心 thermal / power 押注時點佳但策略獨立性待表現",
        capitalAllocation: "現金充裕但無大型併購；資金多用於 R&D 與股票回購",
        technicalProductInsight: "業務 / 服務背景，產品技術深度仰賴 R&D 主管",
        talentOrganization: "公司規模穩定但快速擴張下高階人才整合挑戰",
        integrityGovernance: "上市公司治理結構標準，無重大爭議",
        resilience: "AI 訂單熱潮下未經完整景氣循環考驗",
        financialDiscipline: "毛利率穩定但訂單能見度依賴單一週期",
        communication: "法說會風格務實但前瞻指引保守",
      },
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
      leadershipReasons: {
        capitalAllocation: "公司現金充裕但無大型併購；資金多以股票回購與股息回饋",
        talentOrganization: "公司規模穩定但與 ADI / TI 高階人才競爭激烈",
        customerEcosystem: "Nvidia GPU VRM 綁定深但客戶集中度高（單一大客戶占比高）",
        communication: "創辦人風格低調，法說會穩定但前瞻指引保守",
      },
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
      leadershipReasons: {
        strategicJudgement: "資料中心電力轉型方向正確但前瞻押注（電網儲能）成效中等",
        execution: "BU 整合執行紀律佳但多元事業使焦點稍嫌分散",
        capitalAllocation: "多次中型併購紀律穩定但無轉型級交易",
        technicalProductInsight: "業務 / 集團背景，電力工程細節仰賴 BU 主管",
        talentOrganization: "公司規模穩定但與 Schneider / ABB 高階人才競爭",
        customerEcosystem: "資料中心客戶綁定深但工業客戶分散度高",
        communication: "法說會風格務實但前瞻指引保守",
      },
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
      leadershipReasons: {
        communication: "創辦人風格低調溫和，本人公開發言不多，前瞻指引仰賴專業經理人",
      },
      leadershipConfidence: "High",
    },
    {
      role: "Chairman",
      name: "Yancey Hai",
      nameZh: "海英俊",
      bio: "台達電董事長，金融背景出身；任內主導國際化與電動車事業布局。",
      leadership: L(4, 4, 4, 3, 4, 5, 4, 4, 5, 4),
      leadershipReasons: {
        strategicJudgement: "AI 電源與 EV 押注時點佳但整體策略基調仍由鄭崇華定調",
        execution: "BU 整合執行紀律佳但 EV 業務 ramp 速度受市場限制",
        capitalAllocation: "中型併購紀律穩定但無轉型級交易",
        technicalProductInsight: "金融背景，產品與技術深度仰賴工程團隊與創辦人鄭崇華",
        talentOrganization: "公司規模穩定但與國際大廠高階人才競爭",
        customerEcosystem: "Nvidia / hyperscaler 直接綁定建立中但仍經 ODM 中介",
        resilience: "經歷多次景氣循環尚穩但 EV 業務未經考驗",
        communication: "法說會風格務實但前瞻指引保守",
      },
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
      leadershipReasons: {
        strategicJudgement: "集團整併與聚焦戰略漂亮但 AI 電源押注時點較台達晚",
        execution: "BU 整合執行紀律佳但 hyperscaler ramp 速度落後台達",
        capitalAllocation: "多次集團分拆 / 整併紀律穩定但無轉型級交易",
        technicalProductInsight: "業務 / 集團背景，產品技術深度仰賴 BU 主管",
        talentOrganization: "公司規模穩定但與台達 / 群光高階人才競爭",
        integrityGovernance: "集團治理結構標準，無重大爭議",
        customerEcosystem: "NB / Server OEM 客戶綁定深但 hyperscaler 直接綁定弱於台達",
        financialDiscipline: "毛利率受 ODM 競爭壓力，紀律佳但結構性限制",
        communication: "創辦人風格低調，本人公開發言少；溝通仰賴 IR 與專業經理人",
      },
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
      leadershipReasons: {
        strategicJudgement: "AI server 電源戰略跟進為主，無前瞻獨立判斷",
        execution: "電源代工執行紀律佳但 hyperscaler ramp 速度落後台達",
        capitalAllocation: "集團資本配置紀律穩定但無轉型級交易",
        technicalProductInsight: "管理風格偏業務 / 集團整合，產品技術仰賴下屬",
        talentOrganization: "金仁寶集團文化下，外部高階人才吸引力受限",
        integrityGovernance: "集團治理結構標準，無重大爭議但獨立性受限",
        customerEcosystem: "客戶結構仍多元，hyperscaler 直接綁定弱於台達 / Lite-On",
        resilience: "經歷多次景氣循環尚穩但 AI 浪潮中相對掉隊",
        financialDiscipline: "毛利率受競爭壓力，紀律佳但結構性限制",
        communication: "集團發言保守，前瞻指引較少",
      },
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
      leadershipReasons: {
        strategicJudgement: "NB 電源為基本盤，AI server 電源切入較晚",
        execution: "ramp 紀律佳但毛利率受 NB OEM 競爭壓力",
        capitalAllocation: "集團多元事業使配置自由度受限",
        technicalProductInsight: "業務 / 集團背景，產品深度仰賴技術主管",
        talentOrganization: "集團文化下，外部高階人才吸引力受限",
        integrityGovernance: "集團治理結構標準，無重大爭議但獨立性受限",
        customerEcosystem: "NB OEM 客戶為主，hyperscaler 直接綁定弱",
        resilience: "經歷多次景氣循環尚穩但 AI 浪潮中切入較晚",
        financialDiscipline: "毛利率受 NB 競爭壓力，紀律佳但結構性限制",
        communication: "集團風格低調，前瞻指引較少",
      },
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
      leadershipReasons: {
        strategicJudgement: "電源量測與 SLT 押注時點佳但戰略獨立性中等",
        execution: "BU 整合執行紀律佳但毛利率受設備循環影響",
        capitalAllocation: "公司規模中等，無大型併購；資本多投入 R&D 與產能",
        talentOrganization: "公司規模穩定但與 Advantest / Cohu 高階人才競爭",
        integrityGovernance: "上市公司治理結構標準，無重大爭議",
        customerEcosystem: "客戶分散於半導體 / EV / 太陽能，hyperscaler 直接綁定弱",
        resilience: "經歷多次半導體循環尚穩但 EV 業務波動大",
        financialDiscipline: "毛利率穩定但訂單能見度受設備循環影響",
        communication: "創辦人風格務實，法說會穩定但前瞻指引保守",
      },
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
      leadershipReasons: {
        strategicJudgement: "繼承前任 Rich Templeton 大規模 12 吋投資策略，自主前瞻判斷未明",
        execution: "12 吋 ramp 執行紀律佳但 ROIC 提升尚未顯現",
        capitalAllocation: "巨額 capex 計畫已啟動，紀律有待 ROIC 驗證；近期下修股息成長",
        technicalProductInsight: "工程背景紮實但業務面前瞻押注仰賴 BU 主管",
        talentOrganization: "公司規模穩定但與 ADI / 中國競爭對手高階人才競爭",
        integrityGovernance: "上市公司治理結構標準，無重大爭議",
        customerEcosystem: "車用 / 工業客戶綁定深但 hyperscaler 直接綁定弱",
        resilience: "新任，未經完整循環考驗（12 吋投資週期長）",
        financialDiscipline: "巨額 capex 與股息壓力使自由現金流承壓",
        communication: "法說會風格務實但前瞻指引保守",
      },
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
      leadershipReasons: {
        strategicJudgement: "從 NB 散熱跨入 AI 液冷時點佳但戰略獨立性仍待表現",
        capitalAllocation: "公司規模快速擴張，無大型併購；多次現金增資擴產引發稀釋",
        technicalProductInsight: "業務背景，液冷工程細節仰賴 R&D 主管",
        talentOrganization: "公司規模快速擴張下留才壓力高",
        integrityGovernance: "上市公司治理結構標準，無重大爭議",
        customerEcosystem: "Nvidia / hyperscaler 訂單綁定深但客戶集中度高",
        resilience: "公司歷史短，未經完整景氣循環考驗",
        financialDiscipline: "毛利率受液冷競爭壓力，紀律佳但波動大",
        communication: "法說會穩定但前瞻指引保守",
      },
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
      leadershipReasons: {
        strategicJudgement: "AI 液冷切入時點佳但戰略獨立性仍待表現",
        capitalAllocation: "公司規模快速擴張，多次增資擴產；資本配置紀律待驗證",
        technicalProductInsight: "業務背景，液冷工程細節仰賴 R&D 主管",
        talentOrganization: "公司規模快速擴張下留才壓力高",
        integrityGovernance: "上市公司治理結構標準，無重大爭議",
        customerEcosystem: "Nvidia / hyperscaler 訂單綁定深但與雙鴻拉鋸",
        resilience: "公司歷史短，未經完整景氣循環考驗",
        financialDiscipline: "毛利率受液冷競爭壓力，紀律佳但波動大",
        communication: "法說會穩定但前瞻指引保守",
      },
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
      leadershipReasons: {
        strategicJudgement: "HBM bump 檢測切入時點佳但戰略獨立性中等",
        execution: "AI 訂單 ramp 紀律佳但 ramp 速度受 OEM 設備整合限制",
        capitalAllocation: "公司規模小，現金多用於 R&D，無大型併購紀錄",
        talentOrganization: "公司規模小，與大廠人才競爭吃力",
        integrityGovernance: "上市公司治理結構標準，無重大爭議",
        customerEcosystem: "客戶集中於記憶體廠（SK Hynix / Micron），分散度低",
        resilience: "公司歷經 HBM 浪潮成長但未經完整循環考驗",
        financialDiscipline: "毛利率穩定但訂單能見度受 HBM 循環影響",
        communication: "以色列總部，市場溝通頻率與深度低於美系公司",
      },
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
      leadershipReasons: {
        technicalProductInsight: "工程出身但具產品戰略思維；對 silicon / 基建細節仰賴 CVP 級工程主管（如 Scott Guthrie / Rajesh Jha）",
      },
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
      leadershipReasons: {
        strategicJudgement: "AI 戰略雖有 TPU 與 Gemini 但反應節奏不及 OpenAI / Microsoft，前瞻判斷被質疑",
        execution: "ChatGPT 推出後 Bard 倉促應戰、Gemini 影像生成事件引發品牌信任問題",
        capitalAllocation: "持續大型 capex 投入但 Other Bets 累計虧損龐大；資本紀律中等",
        technicalProductInsight: "工程背景但近年對核心搜尋 AI 整合節奏被批判",
        talentOrganization: "DeepMind / Google Brain 合併後高階 AI 人才流失（如 Demis 級被約束）",
        integrityGovernance: "歐盟 / 美國反托拉斯訴訟與罰款多次；2024 搜尋壟斷案被判敗訴",
        customerEcosystem: "搜尋與廣告綁定深但 AI 雲端與 Anthropic / OpenAI 競爭吃力",
        resilience: "公司獲利能力穩定但 AI 競爭壓力下未經完整考驗",
        financialDiscipline: "毛利率穩定但 Other Bets / Cloud 紀律有待改善",
        communication: "重大產品 launch 多次出現公關危機（Gemini 翻車事件），公開溝通有待加強",
      },
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
      leadershipReasons: {
        talentOrganization: "2022-2024 大規模裁員（超過 27,000 人）使留才文化受質疑",
        integrityGovernance: "歐盟 / 美國反托拉斯調查持續；倉儲員工待遇爭議長期被監督",
        communication: "公開風格務實但對股東溝通較 Bezos 時代少；重大策略指引仰賴年報",
      },
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
      leadershipReasons: {
        capitalAllocation: "Reality Labs 累計虧損超過 600 億美元，metaverse 押注報酬尚未顯現",
        talentOrganization: "AI 人才挖角戰激進（如 ScaleAI / Anthropic 跳槽事件）但內部組織重整頻繁",
        integrityGovernance: "Cambridge Analytica 隱私事件 + 多國反托拉斯訴訟；超級投票權結構長期被批評",
        customerEcosystem: "廣告主綁定深但開發者與隱私倡議者長期不信任",
        financialDiscipline: "廣告業務紀律佳但 Reality Labs 持續燒錢使整體紀律被稀釋",
        communication: "公開風格務實但對重大押注（metaverse / Llama）的市場期望管理偶爾不一致",
      },
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
      leadershipReasons: {
        execution: "OCI / AI 戰略視野卓越但執行落地節奏受傳統 Oracle 文化拖累",
        technicalProductInsight: "資深技術背景但近 80 歲對最新 AI / silicon 技術深度仰賴 CTO 團隊",
        talentOrganization: "強人風格使高階人才依附他個人決策；組織獨立性中等",
        integrityGovernance: "長期高薪酬爭議、與 Larry Page / Trump 的政商關係常引話題；Oracle 數次被指軟體稽核策略過於激進",
        communication: "公開風格直率甚至挑釁，發言常引發股價波動",
      },
      leadershipConfidence: "High",
    },
    {
      role: "CEO",
      name: "Safra Catz",
      since: 2014,
      bio: "10+ 年穩定執掌 Oracle 營運；以財務紀律與成本管控聞名。",
      leadership: L(4, 5, 5, 3, 4, 4, 4, 5, 5, 4),
      leadershipReasons: {
        strategicJudgement: "策略基調仍由 Larry Ellison 定調，自主前瞻判斷空間有限",
        technicalProductInsight: "法律 + 財務背景，技術細節仰賴 Larry Ellison 與 CTO",
        talentOrganization: "執行紀律佳但組織文化偏成本管控，創新人才吸引力受限",
        integrityGovernance: "稽核策略激進使 Oracle 與客戶關係偶有摩擦",
        customerEcosystem: "傳統企業客戶綁定深但開發者生態系吸引力弱",
        communication: "法說會風格務實但對市場期望管理較保守",
      },
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
      leadershipReasons: {
        technicalProductInsight: "業務 / 創辦人背景，server 與 storage 技術細節仰賴 Jeff Clarke 與 CTO",
        talentOrganization: "公司規模龐大但近年裁員傳聞使留才文化受質疑",
        integrityGovernance: "VMware 分拆與 EMC 收購過程治理複雜但無重大瑕疵",
        communication: "個人風格務實但公開發言不多，前瞻指引仰賴 COO 與 CFO",
      },
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
      leadershipReasons: {
        strategicJudgement: "GreenLake 雲端轉型方向正確但 ramp 速度落後 AWS / Azure",
        execution: "Juniper 140 億美元收購整合進度可但綜效未顯現",
        capitalAllocation: "Juniper 收購使負債高，去槓桿進度受市場關注",
        technicalProductInsight: "工程背景但近年混合雲技術前瞻押注仰賴 CTO",
        talentOrganization: "公司規模龐大但與 Dell / 雲端大廠高階人才競爭吃力",
        integrityGovernance: "上市公司治理結構標準，無重大爭議",
        customerEcosystem: "傳統企業客戶綁定深但 hyperscaler 直接綁定弱",
        resilience: "經歷多次科技循環尚穩但 AI server 浪潮中相對掉隊",
        financialDiscipline: "毛利率受 server 競爭壓力，紀律佳但結構性限制",
        communication: "法說會風格務實但前瞻指引保守",
      },
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
      leadershipReasons: {
        strategicJudgement: "Cloud ONTAP 策略漂亮但 AI / vector storage 押注時點較被動",
        execution: "hyperscaler 整合執行紀律佳但 ramp 速度受競爭限制",
        capitalAllocation: "現金充裕但無大型併購；資金多以股票回購與股息回饋",
        technicalProductInsight: "工程背景但近年 AI 技術前瞻仰賴 CTO",
        talentOrganization: "公司規模穩定但與 Pure / Vast 高階人才競爭",
        integrityGovernance: "上市公司治理結構標準，無重大爭議",
        customerEcosystem: "傳統企業客戶綁定深但 hyperscaler 直接綁定中等",
        resilience: "經歷多次儲存循環尚穩但 AI 浪潮中差異化挑戰",
        financialDiscipline: "毛利率穩定但訂閱轉型使短期現金流承壓",
        communication: "法說會風格務實但前瞻指引保守",
      },
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
      leadershipReasons: {
        strategicJudgement: "Evergreen 訂閱與 hyperscaler 押注時點佳但戰略執行集中度高",
        execution: "hyperscaler 訂單 ramp 紀律佳但 Meta 大單時間表多次延後",
        capitalAllocation: "公司規模中等，無大型併購；資金多用於 R&D 與股票回購",
        technicalProductInsight: "Cisco 業務背景，技術細節仰賴 CTO",
        talentOrganization: "公司規模穩定但與 NetApp / Vast 高階人才競爭",
        integrityGovernance: "上市公司治理結構標準，無重大爭議",
        customerEcosystem: "AI / hyperscaler 訂單綁定深但客戶集中度高",
        resilience: "經歷多次科技循環尚穩但 AI 浪潮中未經完整考驗",
        financialDiscipline: "毛利率穩定但 Evergreen 模式使短期現金流承壓",
        communication: "法說會風格務實但前瞻指引保守",
      },
      leadershipConfidence: "High",
    },
  ],
  wdc: [
    {
      role: "CEO",
      name: "Irving Tan",
      bio: "Western Digital CEO，主導 2025 分拆 NAND（SanDisk）後的純 HDD 業務聚焦。",
      leadership: L(3, 4, 3, 4, 4, 4, 4, 4, 4, 3),
      leadershipReasons: {
        strategicJudgement: "上任未久，分拆後純 HDD 策略仍待驗證",
        execution: "HDD 業務 ramp 紀律佳但 HAMR 進度落後 Seagate",
        capitalAllocation: "公司負債仍高，分拆 SanDisk 後資本紀律有待觀察",
        technicalProductInsight: "工程背景紮實但 HAMR 前瞻押注仰賴 R&D 主管",
        talentOrganization: "分拆後新 CEO，組織整合仍在進行",
        integrityGovernance: "上市公司治理結構標準，無重大爭議",
        customerEcosystem: "hyperscaler 客戶綁定深但與 Seagate 拉鋸",
        resilience: "新任，未經完整循環考驗",
        financialDiscipline: "公司負債高使紀律有待 ROIC 提升證明",
        communication: "新任，市場熟悉度尚在建立",
      },
      leadershipConfidence: "Medium",
    },
  ],
  stx: [
    {
      role: "CEO",
      name: "Dave Mosley",
      bio: "Seagate CEO，工程背景；主導 HAMR 技術領先量產。",
      leadership: L(4, 4, 4, 5, 4, 4, 4, 5, 4, 3),
      leadershipReasons: {
        strategicJudgement: "HAMR 押注時點佳但戰略獨立性仍受 HDD 結構限制",
        execution: "HAMR 量產 ramp 紀律可但時程多次延後",
        capitalAllocation: "現金累積但無大型併購；資金多以股票回購與股息回饋",
        talentOrganization: "公司規模穩定但與 WDC 高階人才競爭",
        integrityGovernance: "上市公司治理結構標準，無重大爭議",
        customerEcosystem: "hyperscaler 客戶綁定深但與 WDC 拉鋸",
        financialDiscipline: "毛利率穩定但訂單能見度受 HDD 循環影響",
        communication: "技術背景，公開發言較少；HAMR 量產時程多次延後溝通不夠透明",
      },
      leadershipConfidence: "Medium",
    },
  ],
  sndk: [
    {
      role: "CEO",
      name: "David Goeckeler",
      bio: "SanDisk 2025 分拆後 CEO；前 WDC CEO。",
      leadership: L(3, 4, 3, 4, 4, 4, 4, 4, 4, 3),
      leadershipReasons: {
        strategicJudgement: "新獨立公司戰略尚在建構；前 WDC 時期 NAND 業務曾承擔大幅虧損",
        execution: "NAND ramp 紀律可但毛利率受循環壓力",
        capitalAllocation: "分拆後新公司負債結構與資本配置仍在重整",
        technicalProductInsight: "前 Cisco 背景，NAND 技術深度仰賴 R&D 主管",
        talentOrganization: "分拆後新組織，留才挑戰高",
        integrityGovernance: "上市公司治理結構標準，無重大爭議",
        customerEcosystem: "hyperscaler 客戶綁定建立中但與 Samsung / SK Hynix 競爭吃力",
        resilience: "新任、新公司，未經完整循環考驗",
        financialDiscipline: "新公司負債結構與成本紀律待證明",
        communication: "新公司、新組織，市場溝通管道與信任仍在建立",
      },
      leadershipConfidence: "Medium",
    },
  ],

  // REIT / Power / Construction
  eqix: [
    {
      role: "President / CEO",
      name: "Adaire Fox-Martin",
      since: 2024,
      bio: "2024 接任 Equinix CEO；前 Oracle 高階主管。",
      leadership: L(4, 4, 4, 3, 4, 4, 5, 4, 4, 4),
      leadershipReasons: {
        technicalProductInsight: "業務 / SaaS 背景，資料中心工程技術細節仰賴 COO 與運營團隊",
      },
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
      leadershipReasons: {
        technicalProductInsight: "財務背景，資料中心工程細節仰賴專業團隊",
      },
      leadershipConfidence: "Medium",
    },
  ],
  emr: [
    { role: "President / CEO", name: "Lal Karsanbhai", since: 2021, leadership: L(4, 4, 4, 4, 4, 5, 4, 4, 4, 4), leadershipConfidence: "Medium" },
  ],
  eme: [
    {
      role: "CEO",
      name: "Tony Guzzi",
      since: 2011,
      bio: "EMCOR CEO 多年；資本配置紀律出色。",
      leadership: L(4, 5, 5, 3, 4, 5, 5, 5, 5, 4),
      leadershipReasons: {
        technicalProductInsight: "工程承包業務本質非單一產品，CEO 對細部技術仰賴專案團隊",
      },
      leadershipConfidence: "High",
    },
  ],
  pwr: [
    { role: "President / CEO", name: "Duke Austin", since: 2016, bio: "Quanta Services CEO；任內公司股價大漲。", leadership: L(4, 5, 4, 4, 4, 5, 5, 5, 5, 4), leadershipConfidence: "High" },
  ],
  mtz: [
    {
      role: "CEO",
      name: "Jose Mas",
      since: 2007,
      bio: "MasTec 創辦家族 CEO，超過 15 年執掌。",
      leadership: L(4, 4, 4, 3, 4, 4, 4, 4, 4, 4),
      leadershipReasons: {
        technicalProductInsight: "業務 / 家族背景，技術細節仰賴專案經理",
      },
      leadershipConfidence: "Medium",
    },
  ],
  gev: [
    { role: "CEO", name: "Scott Strazik", since: 2024, bio: "GE Vernova 分拆後首任 CEO；前 GE 電力 CEO。", leadership: L(5, 4, 4, 5, 4, 4, 5, 4, 4, 4), leadershipConfidence: "High" },
  ],
  abb: [
    { role: "CEO", name: "Morten Wierod", since: 2024, bio: "ABB 內部出身，2024 接任 CEO。", leadership: L(4, 4, 4, 4, 4, 5, 4, 4, 4, 4), leadershipConfidence: "Medium" },
  ],
  hubb: [
    {
      role: "CEO",
      name: "Gerben Bakker",
      since: 2020,
      leadership: L(4, 4, 4, 3, 4, 4, 4, 4, 4, 4),
      leadershipReasons: {
        technicalProductInsight: "電力產品線分散，CEO 對單一技術深度仰賴部門主管",
      },
      leadershipConfidence: "Medium",
    },
  ],
  cat: [
    { role: "Chairman / CEO", name: "Jim Umpleby", since: 2017, bio: "Caterpillar 內部出身 30+ 年；資本配置紀律佳。", leadership: L(4, 5, 5, 4, 4, 5, 4, 5, 5, 4), leadershipConfidence: "High" },
  ],
  cmi: [
    { role: "Chair / CEO", name: "Jennifer Rumsey", since: 2022, bio: "Cummins 工程背景 CEO；任內加強氫能策略。", leadership: L(4, 4, 4, 5, 4, 5, 4, 5, 4, 4), leadershipConfidence: "Medium" },
  ],
  gnrc: [
    {
      role: "President / CEO",
      name: "Aaron Jagdfeld",
      since: 2008,
      leadership: L(4, 4, 4, 3, 4, 4, 4, 4, 4, 4),
      leadershipReasons: {
        technicalProductInsight: "業務背景，發電機機械工程細節仰賴工程主管",
      },
      leadershipConfidence: "Medium",
    },
  ],
  rok: [
    { role: "Chair / CEO", name: "Blake Moret", since: 2016, leadership: L(4, 4, 4, 4, 4, 5, 4, 4, 4, 4), leadershipConfidence: "High" },
  ],
  flnc: [
    {
      role: "CEO",
      name: "Julian Nebreda",
      since: 2022,
      leadership: L(3, 3, 3, 4, 4, 4, 3, 4, 3, 3),
      leadershipReasons: {
        strategicJudgement: "AES 與 Siemens 合資結構限制戰略獨立性",
        execution: "公司獲利波動大，多次下修財測",
        capitalAllocation: "現金水位緊，多次發股稀釋；中國電池廠價格戰使其資本配置困難",
        customerEcosystem: "客戶集中於少數電力公司，談判槓桿有限",
        financialDiscipline: "毛利率受成本壓力，紀律受市場質疑",
        communication: "市場期望管理不佳，盈餘多次失預期",
      },
      leadershipConfidence: "Low",
    },
  ],

  // Networking
  cien: [
    { role: "CEO", name: "Gary Smith", since: 2001, bio: "Ciena CEO 超過 20 年；coherent 光通訊技術領先。", leadership: L(4, 4, 4, 5, 4, 5, 4, 5, 4, 4), leadershipConfidence: "High" },
  ],
  net: [
    {
      role: "Co-founder / CEO",
      name: "Matthew Prince",
      since: 2009,
      bio: "Cloudflare 共同創辦人；以技術 + 開發者社群驅動成長。",
      leadership: L(5, 4, 4, 5, 4, 5, 5, 4, 3, 5),
      leadershipReasons: {
        financialDiscipline: "公司至今 GAAP 仍接近損益兩平，成長為先導致紀律相對寬鬆",
      },
      leadershipConfidence: "High",
    },
  ],

  // 半導體
  adi: [
    { role: "Chair / CEO", name: "Vincent Roche", since: 2013, bio: "Analog Devices 長期 CEO；併購 Maxim 後鞏固類比霸主。", leadership: L(4, 4, 4, 5, 4, 5, 4, 5, 5, 4), leadershipConfidence: "High" },
  ],
  stm: [
    { role: "President / CEO", name: "Jean-Marc Chery", since: 2018, leadership: L(4, 4, 4, 4, 4, 4, 4, 4, 4, 4), leadershipConfidence: "High" },
  ],
  amba: [
    {
      role: "President / CEO",
      name: "Fermi Wang",
      bio: "Ambarella 創辦人，工程背景。",
      leadership: L(4, 4, 3, 5, 3, 4, 3, 3, 3, 3),
      leadershipReasons: {
        capitalAllocation: "公司規模小、現金有限；R&D 比重高但無大型併購",
        talentOrganization: "公司規模小，吸引一流人才能力受限於股價波動",
        customerEcosystem: "車載 ADAS 客戶 ramp 慢，與 Mobileye / Qualcomm 競爭吃力",
        resilience: "公司歷經多次車載 / 安防業務轉型，仍處 ramp-up 階段",
        financialDiscipline: "車載業務 ramp 慢，自由現金流多季為負",
        communication: "公司規模小，IR 頻率有限；市場熟悉度低",
      },
      leadershipConfidence: "Medium",
    },
  ],
  form: [
    { role: "CEO", name: "Mike Slessor", since: 2014, leadership: L(4, 4, 4, 5, 4, 4, 4, 4, 4, 4), leadershipConfidence: "Medium" },
  ],
  ter: [
    { role: "President / CEO", name: "Gregory Smith", since: 2024, leadership: L(4, 4, 4, 4, 4, 4, 4, 4, 4, 4), leadershipConfidence: "Medium" },
  ],
  klic: [
    {
      role: "President / CEO",
      name: "Fusen Chen",
      since: 2020,
      leadership: L(4, 4, 3, 4, 4, 4, 4, 4, 4, 4),
      leadershipReasons: {
        capitalAllocation: "公司規模中等，capex 受設備循環影響，無大型併購紀錄",
      },
      leadershipConfidence: "Medium",
    },
  ],
  glw: [
    { role: "Chair / CEO", name: "Wendell Weeks", since: 2005, bio: "Corning CEO 20 年；長期 R&D 投資文化。", leadership: L(5, 4, 4, 5, 5, 5, 5, 5, 4, 4), leadershipConfidence: "High" },
  ],

  // 軟體
  snow: [
    {
      role: "CEO",
      name: "Sridhar Ramaswamy",
      since: 2024,
      bio: "前 Google 廣告主管，2024 接任 Snowflake CEO；推動 AI 平台 Cortex。",
      leadership: L(4, 4, 3, 4, 4, 4, 4, 4, 3, 4),
      leadershipReasons: {
        capitalAllocation: "公司估值高（PS > 15），股票回購 + 收購並行；資本紀律待證明",
        financialDiscipline: "高估值下成長放緩議題使財務紀律壓力上升；GAAP 仍虧損",
      },
      leadershipConfidence: "Medium",
    },
  ],
  mdb: [
    {
      role: "President / CEO",
      name: "Dev Ittycheria",
      since: 2014,
      leadership: L(4, 4, 3, 4, 4, 4, 4, 4, 4, 4),
      leadershipReasons: {
        capitalAllocation: "公司規模中等，無大型併購；資本多投入 R&D 與業務擴張",
      },
      leadershipConfidence: "High",
    },
  ],
  ddog: [
    { role: "Co-founder / CEO", name: "Olivier Pomel", since: 2010, bio: "Datadog 共同創辦人；以開發者導向設計建立 observability 平台。", leadership: L(4, 5, 4, 5, 4, 5, 4, 4, 4, 4), leadershipConfidence: "High" },
  ],
  pltr: [
    {
      role: "Co-founder / CEO",
      name: "Alex Karp",
      since: 2003,
      bio: "Palantir 共同創辦人；風格強烈、對政府客戶經營深；AIP 銷售模式創新。",
      leadership: L(5, 4, 4, 5, 4, 3, 5, 5, 3, 4),
      leadershipReasons: {
        integrityGovernance: "雙重股權結構讓創辦人擁有過大控制權；對國防業務多次發表爭議性公開言論",
        financialDiscipline: "高估值（PE > 200）下毛利率與成長預期需持續驗證；員工股票薪酬比重高",
      },
      leadershipConfidence: "High",
    },
  ],

  // 網安
  crwd: [
    {
      role: "Co-founder / CEO",
      name: "George Kurtz",
      since: 2011,
      bio: "CrowdStrike 共同創辦人；2024 outage 後信任修復是觀察重點。",
      leadership: L(5, 4, 4, 5, 4, 3, 4, 4, 4, 3),
      leadershipReasons: {
        integrityGovernance: "2024 全球 outage 影響 850 萬台 Windows、引發航空 / 醫療 / 金融大規模中斷",
        communication: "outage 後初期溝通被批反應過慢；後期客戶補償方案被部分客戶質疑不足",
      },
      leadershipConfidence: "High",
    },
  ],
  panw: [
    { role: "CEO", name: "Nikesh Arora", since: 2018, bio: "前 Google + SoftBank 主管，加入 Palo Alto 後主導平台化轉型。", leadership: L(5, 5, 5, 4, 5, 4, 5, 4, 5, 5), leadershipConfidence: "High" },
  ],
  zs: [
    {
      role: "Founder / CEO",
      name: "Jay Chaudhry",
      since: 2008,
      bio: "Zscaler 創辦人；連續創業家，主導 Zero Trust 雲端安全。",
      leadership: L(5, 4, 4, 5, 4, 4, 4, 4, 3, 4),
      leadershipReasons: {
        financialDiscipline: "成長為先的純 SaaS 模式下 GAAP 仍虧損，紀律壓力較高",
      },
      leadershipConfidence: "High",
    },
  ],
  okta: [
    {
      role: "Co-founder / CEO",
      name: "Todd McKinnon",
      since: 2009,
      bio: "前 Salesforce engineering，2009 共同創辦 Okta。",
      leadership: L(4, 4, 3, 4, 4, 4, 4, 4, 4, 4),
      leadershipReasons: {
        capitalAllocation: "Auth0 65 億美元收購整合後仍未充分綜效，資本配置成效一般",
      },
      leadershipConfidence: "High",
    },
  ],
  cybr: [
    {
      role: "CEO",
      name: "Matt Cohen",
      since: 2023,
      leadership: L(4, 4, 3, 4, 4, 4, 4, 4, 4, 4),
      leadershipReasons: {
        capitalAllocation: "Venafi 15 億美元收購整合進度待觀察",
      },
      leadershipConfidence: "Medium",
    },
  ],

  // 其他
  tsla: [
    {
      role: "CEO / Founder",
      name: "Elon Musk",
      since: 2008,
      bio: "Tesla CEO 兼控股股東；FSD、Dojo、Optimus 全押注 AI 與自動化。風格極端、執行極快但充滿政治與管治爭議。",
      leadership: L(5, 5, 3, 5, 4, 2, 4, 5, 2, 3),
      leadershipReasons: {
        capitalAllocation: "資金分散於 Tesla / SpaceX / xAI / X 等多個事業；55 億美元 xAI 認購 Tesla 案具關係人交易爭議",
        integrityGovernance: "2018 「funding secured」案被 SEC 罰款 + 強制 tweet 預審；公司治理被多次股東訴訟挑戰",
        financialDiscipline: "車廠毛利率隨價格戰急縮；FSD / Robotaxi 商業化推遲多次",
        communication: "公開承諾（Robotaxi、$25K 車款）多次延期；個人推文影響股價導致監管糾紛",
      },
      leadershipConfidence: "High",
    },
  ],
  sym: [
    {
      role: "CEO",
      name: "Rick Cohen",
      bio: "Symbotic CEO，亦為 C&S Wholesale 創辦人。",
      leadership: L(4, 4, 3, 4, 4, 4, 4, 4, 3, 3),
      leadershipReasons: {
        capitalAllocation: "C&S 既是 CEO 創辦的公司也是主要客戶，存在關聯人交易疑慮",
        financialDiscipline: "高 R&D 與佣金支出使 GAAP 仍虧損，毛利率波動大",
        communication: "對 Walmart 訂單時程多次調整，市場信心波動",
      },
      leadershipConfidence: "Medium",
    },
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
