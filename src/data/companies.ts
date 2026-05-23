import type { Company } from "../types";

// =================================================================
// 公司資料總表
//
// 原則：
//  1. 所有「事實型」欄位（whatTheyDo、coreProducts、competitors）皆基於公開資料
//     （公司官網、年報、產品頁、SEC 10-K / TWSE 公開資訊觀測站）。
//  2. 「analystView」、「serdesAngle」明確標示為主觀分析，請讀者自行判斷。
//  3. 「marketData」一律標示 "requires live API"，避免使用過時數字。
//  4. 對於不確定的客戶關係、市占率，使用「公認」/「依產業共識」並降低信心等級。
//  5. lastUpdated 為資料整理時間（2026-05-24）；股票價格、估值請以即時 API 為準。
// =================================================================

const STD_DATE = "2026-05-24";

// 標準 marketData 佔位
const MD_USD = {
  marketCap: "requires live API",
  peRatio: "requires live API",
  revenueGrowth: "requires live API",
  grossMargin: "requires live API",
  stockPrice: "requires live API",
  ytdReturn: "requires live API",
  currency: "USD" as const,
  note: "市場資料需透過即時 API（例如 Yahoo Finance、Bloomberg）取得。",
};

const MD_TWD = {
  marketCap: "requires live API",
  peRatio: "requires live API",
  revenueGrowth: "requires live API",
  grossMargin: "requires live API",
  stockPrice: "requires live API",
  ytdReturn: "requires live API",
  currency: "TWD" as const,
  note: "市場資料需透過即時 API（例如 TWSE、CMoney、Goodinfo）取得。",
};

export const companies: Company[] = [
  // ============================================================
  // AI 運算晶片
  // ============================================================
  {
    id: "nvidia",
    name: "輝達 Nvidia",
    nameEn: "NVIDIA Corporation",
    ticker: "NASDAQ: NVDA",
    market: "US",
    category: ["ai-compute", "network-chips", "high-speed-interface"],
    aiImportanceScore: 5,
    supplyChainPosition: "Upstream",
    coreProducts: [
      "Hopper / Blackwell GPU（H100、H200、B100、B200、GB200）",
      "NVLink / NVSwitch 高速互連",
      "ConnectX 系列 NIC、BlueField DPU",
      "Spectrum / Quantum 交換器（Ethernet / InfiniBand）",
      "CUDA、cuDNN、TensorRT、NIM 軟體生態",
    ],
    whatTheyDo:
      "全球領先的 GPU 設計公司，旗下 Hopper 與 Blackwell 系列幾乎是當前 LLM 訓練與推論的事實標準；以 Mellanox 併購為基礎建立 InfiniBand / Ethernet / NIC / DPU 完整網路產品線，並以 CUDA 軟體護城河鎖定生態。",
    aiRelevance:
      "AI 模型訓練與大型推論幾乎都採用 Nvidia GPU；其 NVLink、Spectrum-X Ethernet、Quantum InfiniBand 為 GPU cluster 提供必要的高頻寬互連。",
    competitiveAdvantage:
      "CUDA 軟體生態系與 NVLink/NVSwitch 系統級整合構成深層護城河；十年以上的開發者社群與 ML framework 支援使遷移成本極高。",
    competitors: ["AMD", "Intel", "Broadcom（custom ASIC）", "Google TPU", "AWS Trainium"],
    risks: [
      "客戶過度集中於少數 hyperscaler（MSFT、META、GOOGL、AMZN）",
      "Hyperscaler 自研 ASIC（TPU、Trainium、MTIA）擴大採用",
      "中國出口管制限制高階 GPU 銷售",
      "CoWoS 與 HBM 產能瓶頸壓抑出貨",
      "估值已反映高成長期望，任何下修都會放大波動",
    ],
    keyCustomersOrEcosystem:
      "主要 hyperscaler 與企業客戶均使用其 GPU；伺服器多由台灣 ODM（鴻海、廣達、緯穎、緯創、英業達）整合出貨。",
    technicalKeywords: [
      "GPU",
      "CUDA",
      "Tensor Core",
      "NVLink",
      "InfiniBand",
      "Spectrum-X",
      "DGX",
      "HGX",
      "GB200 NVL72",
    ],
    tags: ["GPU", "NIC", "DPU", "Switch", "NVLink", "CPO"],
    valuationSensitivity: ["nvidiaCycle", "hyperscalerDemand", "capexCycle"],
    moat: { process: 4, ipDesign: 5, ecosystem: 5, customer: 5, manufacturing: 3, switching: 5 },
    risk: {
      nvidiaDependency: 0,
      memoryCycle: 2,
      chinaExport: 4,
      customerConc: 4,
      capexCycle: 4,
      valuation: 4,
      techTransition: 2,
    },
    analystView:
      "在 CUDA 生態與系統整合（NVLink、NVSwitch、Spectrum-X、DGX/HGX）尚未被替代前，仍是 AI 算力標準；但 hyperscaler 自研 ASIC 的長期分流是最大的結構性風險。",
    serdesAngle:
      "Blackwell 世代 NVLink 已使用 224 Gb/s class SerDes，每 GPU 對外頻寬達 1.8 TB/s 級；Spectrum-X / Quantum-X800 switch 推動 800G/1.6T 光通訊與高密度 SerDes 設計需求。",
    sourceUrls: [
      "https://www.nvidia.com/en-us/data-center/",
      "https://investor.nvidia.com/",
      "https://www.nvidia.com/en-us/data-center/gb200-nvl72/",
    ],
    confidenceLevel: "High",
    lastUpdated: STD_DATE,
    marketData: MD_USD,
  },

  {
    id: "amd",
    name: "超微 AMD",
    nameEn: "Advanced Micro Devices, Inc.",
    ticker: "NASDAQ: AMD",
    market: "US",
    category: ["ai-compute"],
    aiImportanceScore: 4,
    supplyChainPosition: "Upstream",
    coreProducts: [
      "Instinct MI300X / MI325X / MI350 系列 AI GPU",
      "EPYC 伺服器 CPU（Zen 4 / Zen 5）",
      "Ryzen / Threadripper 桌上型與工作站 CPU",
      "Xilinx FPGA 與 Adaptive SoC（Versal AI Edge）",
      "Pensando DPU",
    ],
    whatTheyDo:
      "全球第二大 x86 CPU 設計公司，並以 Instinct GPU 進入 AI 加速器市場；透過併購 Xilinx（FPGA）、Pensando（DPU）建立完整資料中心算力 / 互連產品線。",
    aiRelevance:
      "Instinct MI300X 是目前少數能與 Nvidia H100/H200 競爭推論市場的替代方案，獲多家 hyperscaler 採用；EPYC CPU 在 AI 伺服器搭配 GPU 作為 host CPU。",
    competitiveAdvantage:
      "EPYC 在 x86 server CPU 已取得長期市占成長；MI300 採用 chiplet + HBM3 設計，HBM 容量與頻寬規格在推論場景具吸引力。",
    competitors: ["Nvidia", "Intel", "Broadcom 客製 ASIC", "AWS Trainium", "Google TPU"],
    risks: [
      "AI GPU 軟體生態（ROCm）仍落後 CUDA",
      "Hyperscaler 自研 ASIC 同樣是分流壓力",
      "CoWoS / HBM 產能受 Nvidia 排擠",
      "EPYC 受 Intel Sierra Forest / Granite Rapids 反攻",
    ],
    keyCustomersOrEcosystem:
      "MI300X 已宣布客戶包含 Microsoft、Meta、Oracle 等；EPYC 廣泛用於主流雲端與企業伺服器。",
    technicalKeywords: ["GPU", "EPYC", "Instinct", "MI300", "ROCm", "Chiplet", "Infinity Fabric"],
    tags: ["GPU", "CPU", "Chiplet", "HBM"],
    valuationSensitivity: ["hyperscalerDemand", "capexCycle", "pcCycle", "serverDemand"],
    moat: { process: 4, ipDesign: 4, ecosystem: 3, customer: 4, manufacturing: 3, switching: 3 },
    risk: {
      nvidiaDependency: 0,
      memoryCycle: 2,
      chinaExport: 3,
      customerConc: 3,
      capexCycle: 4,
      valuation: 3,
      techTransition: 3,
    },
    analystView:
      "EPYC 結構性成長確定，Instinct 則是「Nvidia 替代」題材，但軟體護城河差距仍大；中短期取決於 ROCm 成熟度與 hyperscaler 二供策略。",
    serdesAngle:
      "MI300 採用 Infinity Fabric / chiplet 架構，內部 die-to-die 介面對 SerDes IP 與封裝走線品質敏感；外部 PCIe Gen5、未來 Gen6 是雲端伺服器 retimer 需求驅動力。",
    sourceUrls: [
      "https://www.amd.com/en/products/accelerators/instinct/mi300.html",
      "https://ir.amd.com/",
      "https://www.amd.com/en/products/processors/server.html",
    ],
    confidenceLevel: "High",
    lastUpdated: STD_DATE,
    marketData: MD_USD,
  },

  {
    id: "intel",
    name: "英特爾 Intel",
    nameEn: "Intel Corporation",
    ticker: "NASDAQ: INTC",
    market: "US",
    category: ["ai-compute", "foundry-equipment"],
    aiImportanceScore: 3,
    supplyChainPosition: "Upstream",
    coreProducts: [
      "Xeon 伺服器 CPU（Sapphire Rapids、Emerald Rapids、Sierra Forest、Granite Rapids）",
      "Gaudi 系列 AI 加速器（Habana）",
      "Core 客戶端 CPU 與整合顯卡",
      "Intel Foundry Services（IFS）— 18A、20A 製程",
    ],
    whatTheyDo:
      "傳統 x86 CPU 領導者，目前同時推進 (a) 資料中心 CPU 反攻、(b) Gaudi AI 加速器、(c) IFS 晶圓代工三條主軸的轉型。",
    aiRelevance:
      "Xeon 為 AI 伺服器主流 host CPU 之一；Gaudi 提供 Nvidia GPU 替代方案；IFS 試圖在 2nm 級節點挑戰 TSMC 與 Samsung。",
    competitiveAdvantage:
      "x86 安裝基礎龐大；少數同時擁有設計與先進製程能力的整合元件製造商（IDM）。",
    competitors: ["AMD", "Nvidia", "TSMC（代工）", "Samsung Foundry", "ARM 陣營 CPU"],
    risks: [
      "資料中心 CPU 市占持續被 AMD EPYC 與 ARM CPU 蠶食",
      "Gaudi 軟體生態與市場接受度有限",
      "18A 量產時程與良率不確定",
      "資本支出沉重，現金流壓力大",
    ],
    keyCustomersOrEcosystem:
      "全球主要伺服器 OEM/ODM 與企業客戶；IFS 已宣布 Microsoft 等客戶採用其先進製程。",
    technicalKeywords: ["Xeon", "Gaudi", "18A", "RibbonFET", "PowerVia", "AMX"],
    tags: ["CPU", "AI Accelerator", "Foundry"],
    valuationSensitivity: ["serverDemand", "pcCycle", "capexCycle"],
    moat: { process: 3, ipDesign: 4, ecosystem: 4, customer: 4, manufacturing: 4, switching: 4 },
    risk: {
      nvidiaDependency: 0,
      memoryCycle: 1,
      chinaExport: 3,
      customerConc: 2,
      capexCycle: 5,
      valuation: 3,
      techTransition: 5,
    },
    analystView:
      "短期是「製程追趕 + 產品線整理」的痛苦轉型期；18A 是否能穩定量產、IFS 是否能拿到實質第三方客戶，將決定中長期估值方向。",
    serdesAngle:
      "Granite Rapids 採用 CXL 2.0 與 PCIe Gen5，未來 Diamond Rapids 預期 PCIe Gen6 + CXL 3.0 — Intel 自家 SerDes 表現與 retimer 搭配是 server 平台選型重要變數。",
    sourceUrls: [
      "https://www.intel.com/content/www/us/en/products/details/processors/xeon.html",
      "https://www.intel.com/content/www/us/en/products/details/processors/data-center-gpu.html",
      "https://www.intc.com/",
    ],
    confidenceLevel: "High",
    lastUpdated: STD_DATE,
    marketData: MD_USD,
  },

  {
    id: "broadcom",
    name: "博通 Broadcom",
    nameEn: "Broadcom Inc.",
    ticker: "NASDAQ: AVGO",
    market: "US",
    category: [
      "ai-compute",
      "network-chips",
      "optical-communication",
      "high-speed-interface",
    ],
    aiImportanceScore: 5,
    supplyChainPosition: "Midstream",
    coreProducts: [
      "Tomahawk 系列 Ethernet switch ASIC（含 51.2T Tomahawk 5）",
      "Jericho 系列大容量交換器 ASIC",
      "客製化 AI ASIC（XPU）與 SerDes IP",
      "光通訊 DSP、VCSEL/EML driver",
      "PCIe / NVLink retimer、CXL switch",
      "VMware / 企業軟體",
    ],
    whatTheyDo:
      "在資料中心 switch ASIC 市占居領先地位（Tomahawk / Jericho），同時是 hyperscaler 客製化 AI 加速器的主要設計合作夥伴之一，並擁有業界最完整的 high-speed SerDes IP 組合。",
    aiRelevance:
      "Tomahawk 5 / Tomahawk 6 是 800G/1.6T Ethernet AI fabric 主流引擎；其與 Google 等 hyperscaler 共同設計 TPU 等客製化 AI ASIC，是「Nvidia 以外」最關鍵的 AI 算力供應者。",
    competitiveAdvantage:
      "全球領先的高速 SerDes（含 224G PAM4）IP；switch ASIC 高市占帶來規模經濟；客製化 ASIC 業務與多家 hyperscaler 深度綁定。",
    competitors: [
      "Nvidia（switch / NIC）",
      "Marvell（switch / 客製 ASIC）",
      "Cisco Silicon One",
      "Alchip / GUC（在亞洲客製 ASIC）",
    ],
    risks: [
      "客製 AI ASIC 業務集中於少數 hyperscaler 客戶",
      "AI 收入受單一客戶（市場推測為 Google）週期影響大",
      "估值偏高，對成長預期下修敏感",
      "VMware 整合與軟體業務轉型風險",
    ],
    keyCustomersOrEcosystem:
      "已公開承認與三家 hyperscaler 共同設計客製 ASIC（管理層揭露口徑）；Arista、Cisco 等網通系統大量採用其 switch ASIC。",
    technicalKeywords: [
      "Tomahawk",
      "Jericho",
      "224G PAM4",
      "SerDes",
      "Custom XPU",
      "DSP",
      "Silicon Photonics",
    ],
    tags: ["Switch ASIC", "Custom ASIC", "SerDes", "Optical DSP", "Retimer", "CPO", "Silicon Photonics"],
    valuationSensitivity: ["hyperscalerDemand", "capexCycle", "nvidiaCycle"],
    moat: { process: 4, ipDesign: 5, ecosystem: 4, customer: 5, manufacturing: 3, switching: 4 },
    risk: {
      nvidiaDependency: 1,
      memoryCycle: 1,
      chinaExport: 3,
      customerConc: 4,
      capexCycle: 4,
      valuation: 5,
      techTransition: 2,
    },
    analystView:
      "AI 收入結構是「switch ASIC + 客製 XPU + 光通訊 DSP」三引擎；只要 hyperscaler 維持資本支出擴張，仍是 Nvidia 以外最受惠的單一公司。",
    serdesAngle:
      "Broadcom 是 224G PAM4 SerDes 量產領導者；51.2T Tomahawk 5 / 102.4T Tomahawk 6 上每 lane 速率推進是整個高速介面業最重要的單一指標。",
    sourceUrls: [
      "https://www.broadcom.com/products/ethernet-connectivity/switching",
      "https://investors.broadcom.com/",
      "https://www.broadcom.com/products/custom-asics",
    ],
    confidenceLevel: "High",
    lastUpdated: STD_DATE,
    marketData: MD_USD,
  },

  {
    id: "marvell",
    name: "邁威爾 Marvell",
    nameEn: "Marvell Technology, Inc.",
    ticker: "NASDAQ: MRVL",
    market: "US",
    category: [
      "ai-compute",
      "network-chips",
      "optical-communication",
      "high-speed-interface",
    ],
    aiImportanceScore: 4,
    supplyChainPosition: "Midstream",
    coreProducts: [
      "客製化雲端 AI ASIC（XPU）與 SerDes IP",
      "光通訊 DSP（800G、1.6T 用 PAM4 DSP）",
      "Innovium Teralynx 系列 switch ASIC",
      "PAM4 retimer、PCIe retimer",
      "OCTEON DPU、儲存控制器",
    ],
    whatTheyDo:
      "提供雲端基礎建設用的客製化 ASIC、高速光通訊 DSP、switch ASIC、retimer，是少數同時擁有 SerDes IP、客製化設計能力與光通訊 DSP 的 IC 設計公司。",
    aiRelevance:
      "為 hyperscaler 設計客製化 AI 加速器（含 AWS Trainium 等公開合作）；其 PAM4 DSP 是 800G/1.6T 光模組關鍵元件。",
    competitiveAdvantage:
      "在 PAM4 DSP 與電光介面整合具優勢；客製 ASIC 業務鎖定特定 hyperscaler。",
    competitors: ["Broadcom", "Nvidia（光通訊）", "Cisco（光通訊 DSP）"],
    risks: [
      "AI ASIC 業務集中於少數客戶",
      "傳統儲存、企業網路業務週期性疲弱",
      "與 Broadcom 競爭最高階 SerDes 與 switch ASIC",
    ],
    keyCustomersOrEcosystem:
      "已公開合作客戶包含 AWS（Trainium 2）；光通訊 DSP 廣泛應用於 800G 光模組市場。",
    technicalKeywords: ["PAM4 DSP", "Teralynx", "Custom XPU", "Trainium", "OCTEON"],
    tags: ["Custom ASIC", "Optical DSP", "Switch ASIC", "Retimer", "DPU", "CPO"],
    valuationSensitivity: ["hyperscalerDemand", "capexCycle", "telecomCycle"],
    moat: { process: 4, ipDesign: 4, ecosystem: 3, customer: 4, manufacturing: 3, switching: 3 },
    risk: {
      nvidiaDependency: 1,
      memoryCycle: 1,
      chinaExport: 3,
      customerConc: 4,
      capexCycle: 4,
      valuation: 4,
      techTransition: 3,
    },
    analystView:
      "AI 收入仰賴客製 ASIC ramp（特別是 Trainium 2 / 3）；DSP 端對 800G→1.6T 光模組升級高度受惠，但需注意 LPO/CPO 等架構轉換對 DSP 需求的長期影響。",
    serdesAngle:
      "Marvell 是 PAM4 DSP 與 retimer 領域與 Broadcom 並列的雙巨頭；在 1.6T 模組與 CPO 過渡期，DSP/SerDes 設計差異會直接影響市占。",
    sourceUrls: [
      "https://www.marvell.com/products/networking/teralynx.html",
      "https://www.marvell.com/products/networking/ai-and-cloud-infrastructure.html",
      "https://investor.marvell.com/",
    ],
    confidenceLevel: "High",
    lastUpdated: STD_DATE,
    marketData: MD_USD,
  },

  {
    id: "alchip",
    name: "世芯-KY Alchip",
    nameEn: "Alchip Technologies, Limited",
    ticker: "TWSE: 3661",
    market: "Taiwan",
    category: ["ai-compute", "advanced-packaging"],
    aiImportanceScore: 4,
    supplyChainPosition: "Midstream",
    coreProducts: [
      "客製化 AI ASIC 設計服務（high-performance computing）",
      "先進製程（N5、N4P、N3）SoC 實體設計",
      "Chiplet / HBM 整合設計",
    ],
    whatTheyDo:
      "提供高效能運算客製化 ASIC 的設計服務（design services），協助系統公司 / hyperscaler 在 TSMC 先進製程上實作晶片，涵蓋前端、後端、封裝整合與量產管理。",
    aiRelevance:
      "公司公開表示 AI/HPC 是主要成長動能；多家公開研究認為其客製化 ASIC 客戶含北美 hyperscaler 與日系公司，受惠於 AI ASIC 委外設計趨勢。",
    competitiveAdvantage:
      "在 TSMC 高階製程（N5、N3）與 CoWoS / HBM 整合的執行經驗豐富；接案規模大、能消化 hyperscaler 等級專案。",
    competitors: ["Global Unichip 創意", "Broadcom（內部設計團隊）", "MediaTek 客製業務", "Marvell 客製業務"],
    risks: [
      "客戶極度集中於少數大型 ASIC 專案",
      "單一專案延遲或取消對營收衝擊大",
      "與客戶 in-house 設計團隊（如 Broadcom、Marvell）競爭",
      "高估值反映成長預期，下修敏感",
    ],
    keyCustomersOrEcosystem:
      "未公開所有客戶身分；產業共識認為其 AI ASIC 業務與北美雲端業者及日本 AI 加速器公司合作 — 需個別查證。",
    technicalKeywords: ["Custom ASIC", "Design service", "N3", "CoWoS", "HBM integration"],
    tags: ["Custom ASIC", "Design Service", "CoWoS", "HBM"],
    valuationSensitivity: ["hyperscalerDemand", "capexCycle"],
    moat: { process: 4, ipDesign: 4, ecosystem: 2, customer: 3, manufacturing: 0, switching: 3 },
    risk: {
      nvidiaDependency: 1,
      memoryCycle: 1,
      chinaExport: 3,
      customerConc: 5,
      capexCycle: 4,
      valuation: 5,
      techTransition: 2,
    },
    analystView:
      "是台灣最大「AI ASIC 委外設計」純題材股，但客戶集中風險高 — 任何單一專案進度都會放大股價波動。",
    serdesAngle:
      "AI ASIC 上的高速 I/O（PCIe Gen5/6、112G/224G SerDes、UCIe）IP 多採購自第三方（Synopsys、Alphawave 等），Alchip 主要負責整合與後端 — 設計能力的差異化在於 PI/SI 與封裝管理。",
    sourceUrls: [
      "https://www.alchip.com/",
      "https://mops.twse.com.tw/mops/web/t146sb05?TYPEK=sii&step=1&CO_ID=3661",
    ],
    confidenceLevel: "Medium",
    lastUpdated: STD_DATE,
    marketData: MD_TWD,
  },

  {
    id: "guc",
    name: "創意電子 Global Unichip",
    nameEn: "Global Unichip Corp.",
    ticker: "TWSE: 3443",
    market: "Taiwan",
    category: ["ai-compute", "advanced-packaging"],
    aiImportanceScore: 4,
    supplyChainPosition: "Midstream",
    coreProducts: [
      "ASIC 設計服務（design / NRE / turnkey）",
      "高速介面 IP（SerDes、HBM PHY、UCIe）",
      "Chiplet / CoWoS 設計整合",
    ],
    whatTheyDo:
      "台積電轉投資的 ASIC 設計服務公司，提供從前端 RTL、SerDes IP、實體設計到量產的 turnkey 服務，是台積電生態系內最緊密的「設計服務 + 製造」整合方之一。",
    aiRelevance:
      "AI 與 HPC 已是其主要營收動能；身處台積電 N5/N3 與 CoWoS 產能體系內，承接 hyperscaler 與大型客戶的客製 ASIC 專案。",
    competitiveAdvantage:
      "與台積電在製程、CoWoS、HBM 整合上的緊密合作；自有完整 SerDes、HBM PHY、UCIe 等高速介面 IP。",
    competitors: ["Alchip", "Broadcom / Marvell（in-house）", "GUC 與 Alchip 為台股最直接對手"],
    risks: [
      "客戶集中度高，單一專案影響大",
      "與 Alchip 競爭使毛利率承壓",
      "受 CoWoS 與 HBM 產能配額限制",
    ],
    keyCustomersOrEcosystem:
      "客戶身分多數未公開；產業共識認為包含北美 hyperscaler、AI ASIC 新創與日系廠商，需個別查證。",
    technicalKeywords: ["ASIC design service", "SerDes IP", "HBM PHY", "UCIe", "CoWoS"],
    tags: ["Custom ASIC", "Design Service", "SerDes IP", "HBM"],
    valuationSensitivity: ["hyperscalerDemand", "capexCycle"],
    moat: { process: 4, ipDesign: 4, ecosystem: 4, customer: 3, manufacturing: 0, switching: 3 },
    risk: {
      nvidiaDependency: 1,
      memoryCycle: 1,
      chinaExport: 3,
      customerConc: 5,
      capexCycle: 4,
      valuation: 4,
      techTransition: 2,
    },
    analystView:
      "與台積電的綁定是雙面刃：穩定的製程 / CoWoS 配額是優勢，但也意味受台積電業務策略牽制；AI ASIC 委外趨勢長期受惠。",
    serdesAngle:
      "GUC 自有 56G/112G PAM4 SerDes、HBM3/HBM3E PHY、UCIe 等 IP，並能在 N5/N3 矽驗證 — 對需要快速導入高速介面的 ASIC 客戶極具吸引力。",
    sourceUrls: [
      "https://www.guc-asic.com/",
      "https://mops.twse.com.tw/mops/web/t146sb05?TYPEK=sii&step=1&CO_ID=3443",
    ],
    confidenceLevel: "Medium",
    lastUpdated: STD_DATE,
    marketData: MD_TWD,
  },

  {
    id: "mediatek",
    name: "聯發科 MediaTek",
    nameEn: "MediaTek Inc.",
    ticker: "TWSE: 2454",
    market: "Taiwan",
    category: ["ai-compute"],
    aiImportanceScore: 3,
    supplyChainPosition: "Midstream",
    coreProducts: [
      "Dimensity 系列手機 SoC（含 NPU）",
      "Genio 系列邊緣 AI / IoT SoC",
      "電視、Wi-Fi、Chromebook SoC",
      "ASIC 設計服務（含與 Nvidia 合作的 GB10 / N1）",
    ],
    whatTheyDo:
      "全球出貨量最大手機 SoC 設計公司之一，擁有完整 SoC 平台能力；公司公開揭露積極投入車用、AI ASIC 設計服務與邊緣 AI 加速器市場。",
    aiRelevance:
      "邊緣 AI（手機、PC、車用、家用裝置）的 NPU 整合方；公司公開與 Nvidia 合作開發桌上型 AI 平台與 ARM SoC（GB10/N1），切入桌上型 AI PC 與工作站 SoC 設計。",
    competitiveAdvantage:
      "全 SoC 整合能力（CPU、GPU、ISP、modem、NPU）；在 TSMC 先進製程量產經驗豐富；雙品牌（自有 Dimensity + 為他人設計）策略。",
    competitors: ["Qualcomm", "Apple（內部）", "Samsung LSI", "Unisoc"],
    risks: [
      "智慧型手機週期",
      "AI PC / 邊緣 AI 進展不如預期",
      "與 Qualcomm 競爭加劇",
      "中國品牌客戶受出口管制影響",
    ],
    keyCustomersOrEcosystem:
      "手機端客戶含小米、Oppo、Vivo、Samsung 中階機等；AI ASIC 業務已公開與 Nvidia 合作開發桌上型 AI 平台（GB10）。",
    technicalKeywords: ["SoC", "NPU", "Dimensity", "GB10", "Edge AI"],
    tags: ["SoC", "NPU", "Edge AI", "ASIC"],
    valuationSensitivity: ["smartphoneCycle", "pcCycle", "capexCycle"],
    moat: { process: 4, ipDesign: 5, ecosystem: 4, customer: 4, manufacturing: 0, switching: 3 },
    risk: {
      nvidiaDependency: 1,
      memoryCycle: 1,
      chinaExport: 3,
      customerConc: 3,
      capexCycle: 2,
      valuation: 3,
      techTransition: 3,
    },
    analystView:
      "短期 AI 純度比 Nvidia / Broadcom / 世芯 / 創意 低，但在邊緣 AI、AI PC、車用、與 Nvidia 合作的桌上型平台是長期選擇權。",
    serdesAngle:
      "Dimensity SoC 內含高速 DDR/LPDDR PHY、PCIe、UFS PHY；GB10 等 ARM-based platform 預期需要 high-speed I/O 與 chiplet 介面 — 是長期 SerDes 含量題材。",
    sourceUrls: [
      "https://www.mediatek.com/",
      "https://corp.mediatek.com/",
      "https://mops.twse.com.tw/mops/web/t146sb05?TYPEK=sii&step=1&CO_ID=2454",
    ],
    confidenceLevel: "Medium",
    lastUpdated: STD_DATE,
    marketData: MD_TWD,
  },

  // ============================================================
  // 記憶體與 HBM
  // ============================================================
  {
    id: "micron",
    name: "美光 Micron",
    nameEn: "Micron Technology, Inc.",
    ticker: "NASDAQ: MU",
    market: "US",
    category: ["memory-hbm"],
    aiImportanceScore: 5,
    supplyChainPosition: "Upstream",
    coreProducts: [
      "HBM3E（8-Hi、12-Hi）",
      "伺服器 DDR5 / MRDIMM",
      "LPDDR5X（含資料中心應用）",
      "企業級 NAND / SSD",
    ],
    whatTheyDo:
      "全球三大 DRAM 廠之一（與 Samsung、SK Hynix 鼎立），同時生產 NAND；公司公開揭露 HBM3E 已於 Nvidia H200 量產出貨，並積極擴張 HBM 產能。",
    aiRelevance:
      "AI 加速器幾乎完全依賴 HBM；Micron 是 HBM 三大供應商之一，並以 HBM3E 強化在 Nvidia 平台的份額。",
    competitiveAdvantage:
      "美國本土製造（受地緣政治偏好），1-beta、1-gamma 製程在 power efficiency 上有競爭力。",
    competitors: ["SK Hynix", "Samsung Electronics"],
    risks: [
      "記憶體價格週期性（cyclical）",
      "HBM 供需失衡風險（產能擴張過快）",
      "中國 CXMT 進入低階 DRAM 帶來價格壓力",
      "資本支出沉重",
    ],
    keyCustomersOrEcosystem:
      "公司公開揭露 HBM3E 已通過 Nvidia 認證並出貨；伺服器 DDR5 廣泛供應 hyperscaler。",
    technicalKeywords: ["HBM3E", "HBM4", "DDR5", "MRDIMM", "1-beta", "1-gamma"],
    tags: ["HBM", "DRAM", "NAND"],
    valuationSensitivity: ["memoryCycle", "hyperscalerDemand", "capexCycle"],
    moat: { process: 4, ipDesign: 4, ecosystem: 4, customer: 4, manufacturing: 4, switching: 3 },
    risk: {
      nvidiaDependency: 3,
      memoryCycle: 5,
      chinaExport: 3,
      customerConc: 3,
      capexCycle: 5,
      valuation: 3,
      techTransition: 3,
    },
    analystView:
      "AI 拉動的 HBM 與資料中心 DRAM 結構性成長已明確，但仍是 commodity-like 商品，週期性沒有消失；HBM4 良率、TSV 封裝產能是下一個觀察重點。",
    serdesAngle:
      "HBM 不是 SerDes，是寬 parallel 介面（1024-bit/stack）；但 HBM4 加入 base die（含 SoC-like 邏輯）後，未來 HBM 訊號完整性與 base die 設計能力會成為 HBM 廠分水嶺。",
    sourceUrls: [
      "https://www.micron.com/products/memory/hbm",
      "https://investors.micron.com/",
    ],
    confidenceLevel: "High",
    lastUpdated: STD_DATE,
    marketData: MD_USD,
  },

  {
    id: "skhynix",
    name: "SK 海力士 SK Hynix",
    nameEn: "SK hynix Inc.",
    ticker: "KRX: 000660",
    market: "Private",
    category: ["memory-hbm"],
    aiImportanceScore: 5,
    supplyChainPosition: "Upstream",
    coreProducts: [
      "HBM3 / HBM3E（業界共識為市占領先者）",
      "DDR5 伺服器 DRAM",
      "LPDDR5X",
      "Solidigm 企業 NAND（併購）",
    ],
    whatTheyDo:
      "韓國第二大 DRAM 廠，多家市場研究指其在 HBM 市場（特別是供應 Nvidia）市占率領先；同時生產 NAND 並透過 Solidigm 進入企業級 SSD。",
    aiRelevance:
      "公認的 Nvidia HBM 主力供應商，是 AI 加速器供應鏈中最直接受惠的記憶體公司之一。",
    competitiveAdvantage:
      "HBM 量產經驗最久；與 Nvidia 在 HBM 規格制定上深度合作。",
    competitors: ["Samsung", "Micron"],
    risks: [
      "記憶體週期",
      "HBM 競爭者擴產，市占可能被分食",
      "中國 CXMT 對中低階 DRAM 衝擊",
    ],
    keyCustomersOrEcosystem:
      "公認的 Nvidia HBM 主要供應商；DRAM/NAND 廣泛供應全球 hyperscaler。",
    technicalKeywords: ["HBM3", "HBM3E", "HBM4", "1a/1b nm", "TSV"],
    tags: ["HBM", "DRAM"],
    valuationSensitivity: ["memoryCycle", "hyperscalerDemand"],
    moat: { process: 4, ipDesign: 4, ecosystem: 5, customer: 5, manufacturing: 5, switching: 3 },
    risk: {
      nvidiaDependency: 4,
      memoryCycle: 5,
      chinaExport: 3,
      customerConc: 3,
      capexCycle: 5,
      valuation: 3,
      techTransition: 3,
    },
    analystView:
      "HBM 領導地位明確，但因非台股 / 美股，台灣投資人不易直接投資；列入此網站僅作為產業參考。",
    serdesAngle: "（同 Micron 條目對 HBM 訊號的說明）",
    sourceUrls: ["https://www.skhynix.com/", "https://news.skhynix.com/"],
    confidenceLevel: "Medium",
    lastUpdated: STD_DATE,
  },

  {
    id: "samsung",
    name: "三星電子 Samsung Electronics",
    nameEn: "Samsung Electronics Co., Ltd.",
    ticker: "KRX: 005930",
    market: "Private",
    category: ["memory-hbm", "foundry-equipment", "advanced-packaging"],
    aiImportanceScore: 4,
    supplyChainPosition: "Upstream",
    coreProducts: [
      "HBM3 / HBM3E（追趕中）",
      "DDR5 / LPDDR5X 伺服器 DRAM",
      "NAND",
      "Samsung Foundry 先進製程（2/3nm）",
      "OLED 面板（非 AI）",
    ],
    whatTheyDo:
      "全球最大 DRAM、NAND、OLED 製造商之一；亦同時擁有先進製程晶圓代工業務（與台積電競爭）。",
    aiRelevance:
      "DRAM/NAND 是 AI 伺服器 BOM 重要部分；HBM 為其爭取 AI 客戶（Nvidia、AMD）認證的關鍵戰場；Samsung Foundry 試圖搶下部分 AI ASIC 代工訂單。",
    competitiveAdvantage:
      "唯一同時擁有 IDM、Foundry、面板與終端裝置的完整體系；製造規模龐大。",
    competitors: ["Micron", "SK Hynix", "TSMC（foundry）", "Intel IFS"],
    risks: [
      "HBM3E 認證進度落後競爭對手",
      "Foundry 良率與客戶獲取仍有挑戰",
      "記憶體價格週期",
    ],
    keyCustomersOrEcosystem:
      "DRAM/NAND 為主流伺服器與終端裝置供應商；Foundry 客戶含 Qualcomm、Nvidia（部分產品線）等。",
    technicalKeywords: ["HBM3E", "GAA", "SF2", "SAINT", "1b/1c nm DRAM"],
    tags: ["HBM", "DRAM", "Foundry", "Packaging"],
    valuationSensitivity: ["memoryCycle", "smartphoneCycle", "hyperscalerDemand"],
    moat: { process: 4, ipDesign: 4, ecosystem: 4, customer: 4, manufacturing: 5, switching: 3 },
    risk: {
      nvidiaDependency: 3,
      memoryCycle: 5,
      chinaExport: 3,
      customerConc: 2,
      capexCycle: 5,
      valuation: 2,
      techTransition: 4,
    },
    analystView:
      "AI 純度被多元事業稀釋；HBM 認證進度與 Foundry 競爭力是兩大關鍵變數。",
    sourceUrls: ["https://www.samsung.com/semiconductor/", "https://news.samsung.com/"],
    confidenceLevel: "Medium",
    lastUpdated: STD_DATE,
  },

  {
    id: "nanya",
    name: "南亞科 Nanya Technology",
    nameEn: "Nanya Technology Corporation",
    ticker: "TWSE: 2408",
    market: "Taiwan",
    category: ["memory-hbm"],
    aiImportanceScore: 2,
    supplyChainPosition: "Upstream",
    coreProducts: [
      "PC / consumer DDR4、DDR5 DRAM",
      "標準型 DRAM、利基型 DRAM",
    ],
    whatTheyDo:
      "台灣最大 DRAM 設計與製造商，產品線以標準型 DRAM 為主；公司公開揭露推進自有 10nm 級製程節點。",
    aiRelevance:
      "與 HBM 主流陣營距離較大；主要受惠路徑是「commodity DRAM 整體價格回升 + 利基記憶體需求」。",
    competitiveAdvantage:
      "台灣本地 DRAM IDM、產能規模較小但聚焦利基市場。",
    competitors: ["Micron", "Samsung", "SK Hynix", "CXMT"],
    risks: [
      "缺乏 HBM 量產能力",
      "標準型 DRAM 受 CXMT 競爭",
      "資本支出沉重 vs. 規模較小",
    ],
    keyCustomersOrEcosystem:
      "PC、consumer、車用、工控與通訊客戶；未直接參與 AI HBM 主流供應鏈。",
    technicalKeywords: ["DDR4", "DDR5", "Niche DRAM", "10nm class"],
    tags: ["DRAM"],
    valuationSensitivity: ["memoryCycle", "pcCycle"],
    moat: { process: 2, ipDesign: 2, ecosystem: 2, customer: 2, manufacturing: 3, switching: 2 },
    risk: {
      nvidiaDependency: 0,
      memoryCycle: 5,
      chinaExport: 4,
      customerConc: 2,
      capexCycle: 5,
      valuation: 2,
      techTransition: 4,
    },
    analystView:
      "AI 純度低，主要是「DRAM 週期回升」題材；若 HBM 排擠效應使標準 DRAM 供給變緊，間接受惠。",
    sourceUrls: ["https://www.nanya.com/", "https://mops.twse.com.tw/"],
    confidenceLevel: "Medium",
    lastUpdated: STD_DATE,
    marketData: MD_TWD,
  },

  {
    id: "winbond",
    name: "華邦電 Winbond",
    nameEn: "Winbond Electronics Corporation",
    ticker: "TWSE: 2344",
    market: "Taiwan",
    category: ["memory-hbm"],
    aiImportanceScore: 2,
    supplyChainPosition: "Upstream",
    coreProducts: [
      "利基型 DRAM、行動 DRAM",
      "Serial NOR Flash、SLC NAND",
      "CUBE™ 高頻寬記憶體（堆疊式利基 DRAM）",
    ],
    whatTheyDo:
      "台灣記憶體 IDM，產品涵蓋利基 DRAM、NOR Flash、SLC NAND；公司公開推廣自有 CUBE 堆疊式記憶體架構，試圖切入邊緣 AI 場景。",
    aiRelevance:
      "主要參與「邊緣 AI / 裝置端 AI」記憶體市場，與 HBM 戰場不同；CUBE 是公司主打的差異化方案。",
    competitiveAdvantage:
      "在 NOR Flash 全球領先；具備中小容量、低延遲、低成本 DRAM 利基。",
    competitors: ["Macronix", "GigaDevice", "Micron（NOR）"],
    risks: [
      "與 HBM 主戰場無直接關聯",
      "中國 NOR / DRAM 廠價格競爭",
    ],
    keyCustomersOrEcosystem:
      "手機、IoT、汽車、工控、消費性電子。",
    technicalKeywords: ["Niche DRAM", "NOR", "SLC NAND", "CUBE"],
    tags: ["DRAM", "NOR Flash"],
    valuationSensitivity: ["memoryCycle", "smartphoneCycle"],
    moat: { process: 2, ipDesign: 3, ecosystem: 2, customer: 3, manufacturing: 3, switching: 2 },
    risk: {
      nvidiaDependency: 0,
      memoryCycle: 4,
      chinaExport: 4,
      customerConc: 2,
      capexCycle: 4,
      valuation: 2,
      techTransition: 3,
    },
    analystView:
      "與資料中心 AI 距離較遠；CUBE 是長期選擇權，但短期 AI 含量低。",
    sourceUrls: ["https://www.winbond.com/", "https://mops.twse.com.tw/"],
    confidenceLevel: "Medium",
    lastUpdated: STD_DATE,
    marketData: MD_TWD,
  },

  // ============================================================
  // 晶圓代工與半導體設備
  // ============================================================
  {
    id: "tsmc",
    name: "台積電 TSMC",
    nameEn: "Taiwan Semiconductor Manufacturing Company",
    ticker: "TWSE: 2330 / NYSE: TSM",
    market: "Taiwan",
    category: ["foundry-equipment", "advanced-packaging"],
    aiImportanceScore: 5,
    supplyChainPosition: "Upstream",
    coreProducts: [
      "先進製程晶圓代工（N5、N4P、N3E、N3P、N2）",
      "成熟製程（N7、N12、N16、N28）",
      "CoWoS、SoIC、InFO 先進封裝",
      "3DFabric 整合封裝平台",
    ],
    whatTheyDo:
      "全球最大晶圓代工廠，在 7nm 以下先進製程市占居絕對領先；同時是 2.5D / 3D 先進封裝（CoWoS / SoIC）的主要供應方。",
    aiRelevance:
      "Nvidia、AMD、Broadcom、Marvell、Alchip、GUC 等幾乎所有 AI 加速器晶片皆委由台積電代工，並在 CoWoS 上做封裝 — 是整個 AI 供應鏈最關鍵的單一節點。",
    competitiveAdvantage:
      "領先 2 個世代以上的先進製程；CoWoS 產能事實上的近獨家供應；客戶服務與良率管理體系成熟；長期信任關係。",
    competitors: ["Samsung Foundry", "Intel IFS"],
    risks: [
      "地緣政治（兩岸局勢、美中科技戰）",
      "CoWoS 擴產速度限制全球 AI 加速器出貨",
      "高 capex 與 N2 / A16 量產風險",
      "客戶集中（Nvidia + Apple 占大量晶圓量）",
    ],
    keyCustomersOrEcosystem:
      "Nvidia、AMD、Broadcom、Marvell、Apple、Qualcomm、MediaTek、Alchip、GUC 等皆為其客戶。",
    technicalKeywords: ["N5", "N4P", "N3E", "N2", "CoWoS-S", "CoWoS-L", "SoIC", "InFO"],
    tags: ["Foundry", "CoWoS", "SoIC", "Advanced Process", "Silicon Photonics", "CPO"],
    valuationSensitivity: ["nvidiaCycle", "smartphoneCycle", "hyperscalerDemand", "capexCycle"],
    moat: { process: 5, ipDesign: 4, ecosystem: 5, customer: 5, manufacturing: 5, switching: 5 },
    risk: {
      nvidiaDependency: 3,
      memoryCycle: 1,
      chinaExport: 4,
      customerConc: 3,
      capexCycle: 5,
      valuation: 3,
      techTransition: 3,
    },
    analystView:
      "AI 供應鏈中最具壟斷性的單一公司；CoWoS 與 N3/N2 是兩個最關鍵的瓶頸；地緣政治是無法消除的折價因子。",
    serdesAngle:
      "Nvidia / Broadcom 之 SerDes IP 多在台積電 N5/N3 矽驗證；台積電的 BEOL、interposer、CoWoS-L 設計直接影響高速訊號完整性。",
    sourceUrls: [
      "https://www.tsmc.com/",
      "https://investor.tsmc.com/",
      "https://3dfabric.tsmc.com/english/dedicatedFoundry/technology/CoWoS.htm",
    ],
    confidenceLevel: "High",
    lastUpdated: STD_DATE,
    marketData: MD_TWD,
  },

  {
    id: "asml",
    name: "艾司摩爾 ASML",
    nameEn: "ASML Holding N.V.",
    ticker: "NASDAQ: ASML",
    market: "US",
    category: ["foundry-equipment"],
    aiImportanceScore: 5,
    supplyChainPosition: "Upstream",
    coreProducts: [
      "EUV 曝光機（NXE 系列）",
      "High-NA EUV（EXE:5000 系列）",
      "DUV 曝光機（NXT 系列）",
      "Metrology 與相關服務",
    ],
    whatTheyDo:
      "全球唯一 EUV 微影機供應商（包含先進的 High-NA EUV），同時是 DUV 微影機主要供應商；先進製程晶片若無 EUV 幾乎無法量產。",
    aiRelevance:
      "AI 晶片需要 N5 以下先進製程，這些製程依賴 EUV；ASML 是整條 AI 供應鏈最上游的單一壟斷節點之一。",
    competitiveAdvantage:
      "EUV 全球獨家；High-NA EUV 領先；長期專利與系統整合護城河。",
    competitors: ["Nikon（DUV）", "Canon（DUV / nanoimprint）"],
    risks: [
      "中國市場出口管制",
      "客戶（TSMC、Intel、Samsung）資本支出週期",
      "High-NA EUV 導入時程",
    ],
    keyCustomersOrEcosystem:
      "客戶高度集中於 TSMC、Samsung、Intel、SK Hynix、Micron 等少數先進晶圓 / 記憶體廠。",
    technicalKeywords: ["EUV", "High-NA EUV", "DUV", "DPP", "LPP"],
    tags: ["Lithography", "EUV", "Equipment"],
    valuationSensitivity: ["capexCycle", "hyperscalerDemand", "memoryCycle"],
    moat: { process: 5, ipDesign: 5, ecosystem: 5, customer: 5, manufacturing: 5, switching: 5 },
    risk: {
      nvidiaDependency: 1,
      memoryCycle: 3,
      chinaExport: 4,
      customerConc: 4,
      capexCycle: 5,
      valuation: 3,
      techTransition: 2,
    },
    analystView:
      "獨佔 EUV 是長期 thesis；短中期受客戶 capex 節奏與中國出口管制影響，股價波動較預期高。",
    sourceUrls: ["https://www.asml.com/", "https://www.asml.com/en/investors"],
    confidenceLevel: "High",
    lastUpdated: STD_DATE,
    marketData: MD_USD,
  },

  {
    id: "amat",
    name: "應用材料 Applied Materials",
    nameEn: "Applied Materials, Inc.",
    ticker: "NASDAQ: AMAT",
    market: "US",
    category: ["foundry-equipment"],
    aiImportanceScore: 4,
    supplyChainPosition: "Upstream",
    coreProducts: [
      "沉積（CVD / PVD / ALD）",
      "蝕刻、CMP",
      "離子植入",
      "Metrology / Inspection",
      "Display 設備（部分）",
    ],
    whatTheyDo:
      "全球最大半導體設備公司之一，產品線涵蓋大多數前道製程模組，是先進邏輯、記憶體、先進封裝設備的關鍵供應商。",
    aiRelevance:
      "AI 晶片量產所需的 GAA、HBM TSV、CoWoS 流程都需要其設備；hyperscaler capex 上升直接帶動全球 wafer fab 設備需求。",
    competitiveAdvantage:
      "產品線最廣、客戶服務體系最完整；對先進製程材料與整合設備理解最深。",
    competitors: ["Lam Research", "Tokyo Electron（TEL）", "KLA", "ASML（部分）"],
    risks: [
      "中國市場出口管制衝擊",
      "客戶 capex 週期",
      "與 TEL、Lam 競爭加劇",
    ],
    keyCustomersOrEcosystem:
      "客戶包含 TSMC、Samsung、Intel、Micron、SK Hynix 等全球主要晶圓 / 記憶體廠。",
    technicalKeywords: ["GAA", "ALD", "CVD", "Etch", "CMP", "Implant"],
    tags: ["Equipment", "Deposition", "Etch"],
    valuationSensitivity: ["capexCycle", "memoryCycle", "hyperscalerDemand"],
    moat: { process: 5, ipDesign: 4, ecosystem: 5, customer: 5, manufacturing: 4, switching: 4 },
    risk: {
      nvidiaDependency: 1,
      memoryCycle: 4,
      chinaExport: 4,
      customerConc: 3,
      capexCycle: 5,
      valuation: 3,
      techTransition: 2,
    },
    analystView:
      "AI capex 結構性受惠者；中國業務占比仍是估值折價因素。",
    sourceUrls: ["https://www.appliedmaterials.com/", "https://ir.appliedmaterials.com/"],
    confidenceLevel: "High",
    lastUpdated: STD_DATE,
    marketData: MD_USD,
  },

  {
    id: "lam",
    name: "科林研發 Lam Research",
    nameEn: "Lam Research Corporation",
    ticker: "NASDAQ: LRCX",
    market: "US",
    category: ["foundry-equipment"],
    aiImportanceScore: 4,
    supplyChainPosition: "Upstream",
    coreProducts: [
      "蝕刻設備（Kiyo、Flex 系列）",
      "沉積設備（ALD、CVD）",
      "電鍍、CMP、清洗",
      "Wafer 級 metrology",
    ],
    whatTheyDo:
      "全球領先的半導體蝕刻與沉積設備供應商；在記憶體（DRAM、NAND）與先進邏輯製程設備上市占居前。",
    aiRelevance:
      "HBM TSV、3D NAND、GAA 結構等都需要其高深寬比蝕刻與 ALD 沉積；AI 推升 HBM 與 advanced node 需求皆有利。",
    competitiveAdvantage:
      "在原子層級蝕刻 / 沉積技術領先；在 3D NAND 蝕刻深度比例領先。",
    competitors: ["Applied Materials", "TEL", "KLA"],
    risks: [
      "中國出口管制影響顯著（NAND 客戶集中）",
      "記憶體 capex 週期",
    ],
    keyCustomersOrEcosystem:
      "DRAM 廠（Micron、SK Hynix、Samsung）、NAND 廠（Kioxia、WDC、Micron）與邏輯廠（TSMC、Intel）。",
    technicalKeywords: ["ALD", "Etch", "3D NAND", "HBM TSV", "GAA"],
    tags: ["Equipment", "Etch", "Deposition"],
    valuationSensitivity: ["memoryCycle", "capexCycle", "hyperscalerDemand"],
    moat: { process: 5, ipDesign: 4, ecosystem: 5, customer: 5, manufacturing: 4, switching: 4 },
    risk: {
      nvidiaDependency: 1,
      memoryCycle: 5,
      chinaExport: 5,
      customerConc: 3,
      capexCycle: 5,
      valuation: 3,
      techTransition: 2,
    },
    analystView:
      "受惠 HBM TSV 與 3D NAND 層數提升；中國 NAND 客戶受限是最大風險。",
    sourceUrls: ["https://www.lamresearch.com/", "https://investor.lamresearch.com/"],
    confidenceLevel: "High",
    lastUpdated: STD_DATE,
    marketData: MD_USD,
  },

  {
    id: "kla",
    name: "科磊 KLA",
    nameEn: "KLA Corporation",
    ticker: "NASDAQ: KLAC",
    market: "US",
    category: ["foundry-equipment"],
    aiImportanceScore: 4,
    supplyChainPosition: "Upstream",
    coreProducts: [
      "Wafer / reticle 檢測（inspection）",
      "Metrology（量測）",
      "Process Control software",
      "Specialty Semi（PCB、display）",
    ],
    whatTheyDo:
      "全球最大製程控制（process control）設備公司，提供 wafer / reticle inspection 與 metrology 系統，是先進製程良率管理的關鍵供應商。",
    aiRelevance:
      "先進製程節點越小，良率管理越關鍵；HBM TSV、CoWoS interposer、advanced packaging 也帶動 inspection / metrology 需求。",
    competitiveAdvantage:
      "Inspection / metrology 市占龍頭，與客戶研發過程深度綁定，難以替代。",
    competitors: ["Applied Materials（部分）", "Hitachi High-Tech", "ASML（部分）"],
    risks: [
      "中國市場限制",
      "客戶 capex 週期",
    ],
    keyCustomersOrEcosystem:
      "TSMC、Samsung、Intel、Micron、SK Hynix 等。",
    technicalKeywords: ["Inspection", "Metrology", "Process Control", "EUV mask"],
    tags: ["Equipment", "Inspection", "Metrology"],
    valuationSensitivity: ["capexCycle", "memoryCycle"],
    moat: { process: 5, ipDesign: 4, ecosystem: 5, customer: 5, manufacturing: 4, switching: 5 },
    risk: {
      nvidiaDependency: 1,
      memoryCycle: 4,
      chinaExport: 4,
      customerConc: 3,
      capexCycle: 5,
      valuation: 3,
      techTransition: 2,
    },
    analystView:
      "壟斷型 inspection / metrology 業務質地最好；先進製程節點越多 EUV 層、越多檢測需求。",
    sourceUrls: ["https://www.kla.com/", "https://ir.kla.com/"],
    confidenceLevel: "High",
    lastUpdated: STD_DATE,
    marketData: MD_USD,
  },

  // ============================================================
  // 先進封裝與載板
  // ============================================================
  {
    id: "ase",
    name: "日月光投控 ASE Technology",
    nameEn: "ASE Technology Holding",
    ticker: "TWSE: 3711 / NYSE: ASX",
    market: "Taiwan",
    category: ["advanced-packaging"],
    aiImportanceScore: 4,
    supplyChainPosition: "Midstream",
    coreProducts: [
      "傳統 IC 封裝（QFN、BGA 等）",
      "Flip-Chip、Wire-Bond 高階封裝",
      "FOCoS、VIPack 先進封裝平台",
      "電子製造服務（EMS — 環旭電子）",
    ],
    whatTheyDo:
      "全球最大委外封測（OSAT）公司，封測產能規模居領先；同時擁有電子製造服務（EMS）子公司環旭電子；公司公開推廣 VIPack 先進封裝平台。",
    aiRelevance:
      "AI ASIC、HBM、chiplet 帶動先進封裝需求；ASE 在非 CoWoS 封裝（如 FOCoS、SiP）方面有自有產品線，並接續部分 AI 晶片後段製程。",
    competitiveAdvantage:
      "規模最大、跨製程種類最完整的封測服務；EMS 業務形成多元收入。",
    competitors: ["Amkor", "JCET", "Powertech 力成"],
    risks: [
      "傳統封裝週期性需求疲弱",
      "CoWoS 等高階封裝由 TSMC 主導，ASE 參與度有限",
      "EMS 業務毛利偏低",
    ],
    keyCustomersOrEcosystem:
      "客戶涵蓋多數 IC 設計與 IDM 公司；EMS 客戶含蘋果、Sonos 等公開揭露之品牌。",
    technicalKeywords: ["OSAT", "FOCoS", "VIPack", "SiP", "Flip-Chip"],
    tags: ["OSAT", "Advanced Packaging", "SiP"],
    valuationSensitivity: ["serverDemand", "smartphoneCycle", "capexCycle"],
    moat: { process: 3, ipDesign: 3, ecosystem: 4, customer: 4, manufacturing: 5, switching: 3 },
    risk: {
      nvidiaDependency: 1,
      memoryCycle: 2,
      chinaExport: 3,
      customerConc: 2,
      capexCycle: 4,
      valuation: 2,
      techTransition: 3,
    },
    analystView:
      "AI 純度比 KYEC / 欣興 低；主要受惠路徑是「整體 IC 出貨復甦 + AI ASIC 後段非 CoWoS 部分」。",
    sourceUrls: [
      "https://www.aseglobal.com/",
      "https://mops.twse.com.tw/mops/web/t146sb05?TYPEK=sii&step=1&CO_ID=3711",
    ],
    confidenceLevel: "High",
    lastUpdated: STD_DATE,
    marketData: MD_TWD,
  },

  {
    id: "kyec",
    name: "京元電子 KYEC",
    nameEn: "King Yuan Electronics Co., Ltd.",
    ticker: "TWSE: 2449",
    market: "Taiwan",
    category: ["advanced-packaging"],
    aiImportanceScore: 4,
    supplyChainPosition: "Midstream",
    coreProducts: [
      "Wafer test、Final test 等專業測試服務",
      "邏輯 IC、HPC、AI 晶片測試",
    ],
    whatTheyDo:
      "全球領先的專業測試服務（test house）廠商，提供 wafer probing、final test 等服務；公司公開揭露 HPC / AI 為其主要成長動能之一。",
    aiRelevance:
      "AI ASIC 與 GPU 對 burn-in、SLT、system-level test 等高階測試需求極高，KYEC 是台灣最重要的測試承接者之一。",
    competitiveAdvantage:
      "測試機台規模、工程能力與客戶關係深；專業測試廠的進入障礙在資本與工程經驗。",
    competitors: ["ASE（測試部門）", "Powertech 力成（部分）", "Sigurd 矽格"],
    risks: [
      "客戶集中度高（單一 AI 客戶可影響業績）",
      "中國市場業務變動",
      "測試機投資週期",
    ],
    keyCustomersOrEcosystem:
      "公司未完整揭露所有客戶；產業共識認為 HPC / AI 客戶包含主要 GPU 供應商與多家 ASIC 設計服務客戶，需個別查證。",
    technicalKeywords: ["Wafer test", "Burn-in", "SLT", "HPC test"],
    tags: ["Testing", "HPC", "OSAT"],
    valuationSensitivity: ["nvidiaCycle", "hyperscalerDemand"],
    moat: { process: 3, ipDesign: 2, ecosystem: 3, customer: 4, manufacturing: 4, switching: 3 },
    risk: {
      nvidiaDependency: 3,
      memoryCycle: 1,
      chinaExport: 4,
      customerConc: 4,
      capexCycle: 4,
      valuation: 3,
      techTransition: 2,
    },
    analystView:
      "AI 測試需求是中期主軸；客戶集中於少數 GPU/ASIC 業者，所以業績與 Nvidia 出貨密切相關。",
    sourceUrls: [
      "https://www.kyec.com.tw/",
      "https://mops.twse.com.tw/mops/web/t146sb05?TYPEK=sii&step=1&CO_ID=2449",
    ],
    confidenceLevel: "Medium",
    lastUpdated: STD_DATE,
    marketData: MD_TWD,
  },

  {
    id: "unimicron",
    name: "欣興電子 Unimicron",
    nameEn: "Unimicron Technology Corp.",
    ticker: "TWSE: 3037",
    market: "Taiwan",
    category: ["advanced-packaging"],
    aiImportanceScore: 4,
    supplyChainPosition: "Upstream",
    coreProducts: [
      "ABF 載板（IC substrate）",
      "BT 載板",
      "HDI PCB、Flex PCB",
    ],
    whatTheyDo:
      "全球前三大 ABF 載板供應商之一（與 Ibiden、Shinko 並列），是 CPU、GPU、ASIC 等高階晶片必需的封裝載板提供者。",
    aiRelevance:
      "Nvidia / AMD / Broadcom 等 AI 加速器都需要大尺寸、高層數 ABF 載板；隨 GPU 尺寸變大、I/O 增加、CoWoS 普及，ABF 載板需求結構性上升。",
    competitiveAdvantage:
      "ABF 載板全球前三大供應商；在大尺寸、高層數載板的良率與產能。",
    competitors: ["Ibiden（日本）", "Shinko（日本）", "Nan Ya PCB 南電", "Kinsus 景碩"],
    risks: [
      "ABF 載板過去 2 年產能擴張過快，價格壓力浮現",
      "客戶集中於少數 AI / CPU 客戶",
      "PC / Server 傳統市場疲弱",
    ],
    keyCustomersOrEcosystem:
      "公司未完整揭露；產業共識為主要 CPU / GPU / AI ASIC 業者皆有採用其載板。",
    technicalKeywords: ["ABF substrate", "BT substrate", "HDI", "Large body BGA"],
    tags: ["ABF", "Substrate", "PCB"],
    valuationSensitivity: ["serverDemand", "pcCycle", "hyperscalerDemand"],
    moat: { process: 3, ipDesign: 2, ecosystem: 4, customer: 4, manufacturing: 4, switching: 3 },
    risk: {
      nvidiaDependency: 3,
      memoryCycle: 1,
      chinaExport: 2,
      customerConc: 3,
      capexCycle: 5,
      valuation: 3,
      techTransition: 3,
    },
    analystView:
      "AI 拉貨對大尺寸 ABF 載板需求結構性正面，但 2022-2023 過度擴產的庫存仍在消化；客戶結構往 AI 集中過程中，獲利率有重新評價空間。",
    sourceUrls: [
      "https://www.unimicron.com/",
      "https://mops.twse.com.tw/mops/web/t146sb05?TYPEK=sii&step=1&CO_ID=3037",
    ],
    confidenceLevel: "Medium",
    lastUpdated: STD_DATE,
    marketData: MD_TWD,
  },

  {
    id: "nanyapcb",
    name: "南電 Nan Ya PCB",
    nameEn: "Nan Ya Printed Circuit Board Corp.",
    ticker: "TWSE: 8046",
    market: "Taiwan",
    category: ["advanced-packaging"],
    aiImportanceScore: 3,
    supplyChainPosition: "Upstream",
    coreProducts: ["ABF 載板", "BT 載板", "HDI PCB"],
    whatTheyDo:
      "台塑集團旗下載板與 PCB 供應商，產品涵蓋 ABF、BT 載板與 HDI PCB，主要服務 IC 封裝與消費性電子市場。",
    aiRelevance:
      "ABF 載板用於 AI / HPC 晶片封裝；公司在大尺寸 ABF 載板領域投入較多。",
    competitiveAdvantage: "台塑集團資源支持、規模相對完整。",
    competitors: ["Unimicron", "Ibiden", "Shinko", "Kinsus"],
    risks: [
      "ABF 價格仍承壓",
      "客戶集中於少數高階 IC 客戶",
      "PC、smartphone 弱化拖累載板需求",
    ],
    keyCustomersOrEcosystem:
      "客戶未完整揭露；公開資訊指其供應多家主要 CPU / GPU 客戶之載板，需個別查證。",
    technicalKeywords: ["ABF", "BT", "HDI", "Large body BGA"],
    tags: ["ABF", "Substrate", "PCB"],
    valuationSensitivity: ["pcCycle", "serverDemand", "hyperscalerDemand"],
    moat: { process: 2, ipDesign: 2, ecosystem: 3, customer: 3, manufacturing: 3, switching: 3 },
    risk: {
      nvidiaDependency: 2,
      memoryCycle: 1,
      chinaExport: 2,
      customerConc: 3,
      capexCycle: 4,
      valuation: 2,
      techTransition: 3,
    },
    analystView:
      "AI 純度低於欣興，且傳統 PC 載板比重較高；ABF 高階產品線是觀察重點。",
    sourceUrls: [
      "https://www.npc.com.tw/",
      "https://mops.twse.com.tw/mops/web/t146sb05?TYPEK=sii&step=1&CO_ID=8046",
    ],
    confidenceLevel: "Medium",
    lastUpdated: STD_DATE,
    marketData: MD_TWD,
  },

  {
    id: "amkor",
    name: "艾克爾 Amkor",
    nameEn: "Amkor Technology, Inc.",
    ticker: "NASDAQ: AMKR",
    market: "US",
    category: ["advanced-packaging"],
    aiImportanceScore: 3,
    supplyChainPosition: "Midstream",
    coreProducts: [
      "傳統 IC 封裝、test",
      "Flip-Chip、SiP 先進封裝",
      "車用、5G、HPC 封裝",
    ],
    whatTheyDo:
      "全球第二大委外封測（OSAT）公司之一（僅次於 ASE），客戶涵蓋大型 IDM 與 fabless 業者；亦提供 advanced SiP 封裝。",
    aiRelevance:
      "HPC / AI 客戶有部分封裝與測試需求外包至 Amkor；公司正在美國亞利桑那建廠以對應 TSMC 美國產能。",
    competitiveAdvantage: "客戶高度多元、北美據點完整。",
    competitors: ["ASE", "JCET", "Powertech 力成"],
    risks: ["週期性需求", "中國工廠地緣風險"],
    keyCustomersOrEcosystem:
      "客戶涵蓋多家 IDM 與 fabless；具體 AI 客戶身分需個別查證。",
    technicalKeywords: ["OSAT", "SiP", "Flip-Chip", "Advanced packaging"],
    tags: ["OSAT", "Packaging"],
    valuationSensitivity: ["smartphoneCycle", "serverDemand"],
    moat: { process: 3, ipDesign: 3, ecosystem: 4, customer: 4, manufacturing: 4, switching: 3 },
    risk: {
      nvidiaDependency: 1,
      memoryCycle: 2,
      chinaExport: 3,
      customerConc: 3,
      capexCycle: 4,
      valuation: 2,
      techTransition: 3,
    },
    analystView:
      "AI 純度中等；長期受惠美國本土封裝產能政策。",
    sourceUrls: ["https://www.amkor.com/", "https://ir.amkor.com/"],
    confidenceLevel: "High",
    lastUpdated: STD_DATE,
    marketData: MD_USD,
  },

  // ============================================================
  // 高速網路晶片
  // ============================================================
  {
    id: "cisco",
    name: "思科 Cisco",
    nameEn: "Cisco Systems, Inc.",
    ticker: "NASDAQ: CSCO",
    market: "US",
    category: ["network-chips", "ai-server-odm"],
    aiImportanceScore: 3,
    supplyChainPosition: "Downstream",
    coreProducts: [
      "Silicon One 系列 switch / router ASIC",
      "Nexus 資料中心交換器",
      "Catalyst 企業交換器",
      "Webex、安全與軟體",
      "光通訊（含 Acacia 併購）",
    ],
    whatTheyDo:
      "全球最大網路設備系統公司之一；自有 Silicon One 晶片與系統級交換器，並透過併購 Acacia 切入 coherent 光通訊。",
    aiRelevance:
      "Silicon One 直接競爭 Broadcom Tomahawk / Jericho；公司公開推廣 AI 資料中心解決方案，並與 Nvidia 等合作 GPU cluster 網路。",
    competitiveAdvantage: "企業 / 電信網路裝置裝機量龐大；系統 + 軟體 + 安全整合。",
    competitors: ["Arista Networks", "Juniper", "Nvidia（Spectrum）", "Broadcom"],
    risks: [
      "Hyperscaler 不採用 Cisco，主要採用 Arista / 白牌 + Broadcom",
      "企業網路升級週期",
      "AI 資料中心成長中市占未必能擴大",
    ],
    keyCustomersOrEcosystem:
      "企業、電信、政府為主；超大型雲端業者並非 Cisco 主要客戶。",
    technicalKeywords: ["Silicon One", "Nexus", "Acacia", "ZR/ZR+"],
    tags: ["Switch ASIC", "Switch System", "Optical"],
    valuationSensitivity: ["serverDemand", "telecomCycle"],
    moat: { process: 3, ipDesign: 4, ecosystem: 5, customer: 5, manufacturing: 3, switching: 5 },
    risk: {
      nvidiaDependency: 1,
      memoryCycle: 1,
      chinaExport: 2,
      customerConc: 2,
      capexCycle: 3,
      valuation: 2,
      techTransition: 3,
    },
    analystView:
      "AI 純度比 Arista 低；但企業 + 政府 + 電信穩定現金流是防禦性投資題材。",
    sourceUrls: ["https://www.cisco.com/c/en/us/solutions/data-center/index.html", "https://investor.cisco.com/"],
    confidenceLevel: "High",
    lastUpdated: STD_DATE,
    marketData: MD_USD,
  },

  {
    id: "arista",
    name: "Arista Networks",
    nameEn: "Arista Networks, Inc.",
    ticker: "NYSE: ANET",
    market: "US",
    category: ["network-chips", "ai-server-odm"],
    aiImportanceScore: 4,
    supplyChainPosition: "Downstream",
    coreProducts: [
      "7000 / 7800 系列資料中心交換器",
      "EOS 網路作業系統",
      "AI Spine / Leaf 解決方案",
      "Cognitive Campus 等企業產品",
    ],
    whatTheyDo:
      "資料中心交換器系統廠，主要採用 Broadcom Tomahawk / Jericho 等 switch ASIC，搭配自家 EOS 軟體，成為 hyperscaler 與雲端業者主要的交換器系統供應商之一。",
    aiRelevance:
      "公司公開表示 AI back-end network 是重要成長動能；其 Etherlink 平台針對 GPU cluster 提供高 fan-out、低延遲方案。",
    competitiveAdvantage:
      "EOS 軟體穩定性與可程式化能力高，客戶轉換成本高；hyperscaler 信任度強。",
    competitors: ["Cisco", "Nvidia Spectrum", "白牌（Accton/Quanta + Broadcom）"],
    risks: [
      "Hyperscaler 改採白牌交換器",
      "Nvidia Spectrum-X 在 AI back-end 競爭",
      "客戶集中於少數 hyperscaler",
    ],
    keyCustomersOrEcosystem:
      "公司公開揭露 Meta、Microsoft 為大客戶。",
    technicalKeywords: ["EOS", "Etherlink", "Spine-leaf", "RoCE"],
    tags: ["Switch System", "AI Network", "Whitebox alternative"],
    valuationSensitivity: ["hyperscalerDemand", "capexCycle"],
    moat: { process: 0, ipDesign: 4, ecosystem: 4, customer: 5, manufacturing: 0, switching: 5 },
    risk: {
      nvidiaDependency: 2,
      memoryCycle: 1,
      chinaExport: 2,
      customerConc: 5,
      capexCycle: 4,
      valuation: 4,
      techTransition: 3,
    },
    analystView:
      "AI back-end Ethernet 是長期 thesis；Meta + Microsoft 大客戶結構也是雙面刃。",
    sourceUrls: ["https://www.arista.com/en/solutions/ai-networking", "https://investors.arista.com/"],
    confidenceLevel: "High",
    lastUpdated: STD_DATE,
    marketData: MD_USD,
  },

  {
    id: "accton",
    name: "智邦 Accton",
    nameEn: "Accton Technology Corporation",
    ticker: "TWSE: 2345",
    market: "Taiwan",
    category: ["network-chips", "ai-server-odm"],
    aiImportanceScore: 4,
    supplyChainPosition: "Downstream",
    coreProducts: [
      "白牌資料中心交換器（含 400G、800G）",
      "Edge-Core 自有品牌",
      "ODM/JDM 給多家系統業者",
    ],
    whatTheyDo:
      "全球最大白牌資料中心交換器 ODM 之一，採用 Broadcom Tomahawk / Jericho、Marvell 等 switch ASIC，為 hyperscaler 與系統廠（包含部分品牌業者）製造高速交換器。",
    aiRelevance:
      "AI cluster 對 400G / 800G 高速交換器的需求暴增，智邦是少數能跟上規格、量產經驗豐富的 ODM；公司公開揭露 AI / 雲端為主要成長動能。",
    competitiveAdvantage:
      "交換器設計、PCB 高速 layout、SI 模擬與量產能力深厚；hyperscaler 信任度高。",
    competitors: ["Quanta Cloud Technology", "Celestica", "Wistron NeWeb（部分）"],
    risks: [
      "客戶集中於少數 hyperscaler",
      "白牌與品牌（如 Arista）競合關係複雜",
      "800G → 1.6T 設計挑戰加大",
    ],
    keyCustomersOrEcosystem:
      "公開市場資訊指其客戶包含 Meta、Microsoft 與其他 hyperscaler，需個別查證。",
    technicalKeywords: ["Whitebox switch", "Tomahawk", "Jericho", "800G", "ONIE/SONiC"],
    tags: ["Switch", "Whitebox", "ODM"],
    valuationSensitivity: ["hyperscalerDemand", "capexCycle"],
    moat: { process: 0, ipDesign: 3, ecosystem: 3, customer: 4, manufacturing: 4, switching: 3 },
    risk: {
      nvidiaDependency: 2,
      memoryCycle: 1,
      chinaExport: 2,
      customerConc: 4,
      capexCycle: 4,
      valuation: 3,
      techTransition: 3,
    },
    analystView:
      "「白牌 800G 交換器」是台股最直接受惠 AI 網路升級的題材之一；對 1.6T 平台的設計能力是下一個分水嶺。",
    serdesAngle:
      "112G PAM4 ×64 port 的 51.2T 設計極度考驗 PCB 走線與 connector / cable 設計；1.6T（224G PAM4 ×64）對 PCB 材料、retimer 配置進一步挑戰 — 是 Accton 設計力護城河。",
    sourceUrls: [
      "https://www.accton.com/",
      "https://mops.twse.com.tw/mops/web/t146sb05?TYPEK=sii&step=1&CO_ID=2345",
    ],
    confidenceLevel: "Medium",
    lastUpdated: STD_DATE,
    marketData: MD_TWD,
  },

  // ============================================================
  // 高速介面與 SerDes
  // ============================================================
  {
    id: "astera",
    name: "Astera Labs",
    nameEn: "Astera Labs, Inc.",
    ticker: "NASDAQ: ALAB",
    market: "US",
    category: ["high-speed-interface"],
    aiImportanceScore: 4,
    supplyChainPosition: "Midstream",
    coreProducts: [
      "Aries PCIe / CXL retimer（Gen5、Gen6）",
      "Taurus Ethernet smart cable module",
      "Leo CXL Memory Connectivity",
      "Scorpio Fabric switch",
    ],
    whatTheyDo:
      "專注 AI 資料中心高速連結（PCIe、CXL、Ethernet smart cable、Fabric switch）的純 IC 設計公司，提供完整的 connectivity solution 給 hyperscaler 與系統業者。",
    aiRelevance:
      "GPU 與 host CPU 之間透過 PCIe Gen5 / Gen6 連接，距離一拉長就需要 retimer；Astera Aries 是 AI server 中事實標準之一。",
    competitiveAdvantage:
      "AI server 早期投入 PCIe retimer 市場，產品成熟度與客戶綁定領先；單一公司專注 AI connectivity。",
    competitors: ["Broadcom", "Marvell", "Microchip", "Parade（PCIe redriver 部分）"],
    risks: [
      "客戶集中於少數 hyperscaler",
      "競爭者（Broadcom 等）切入 retimer 市場",
      "估值偏高",
    ],
    keyCustomersOrEcosystem:
      "公司公開揭露其產品已廣泛被 hyperscaler 與 AI server OEM 採用；具體客戶身分需個別查證。",
    technicalKeywords: ["PCIe Gen5/Gen6", "CXL", "Retimer", "Smart Cable", "Fabric switch"],
    tags: ["Retimer", "CXL", "PCIe", "AI Connectivity"],
    valuationSensitivity: ["hyperscalerDemand", "capexCycle", "nvidiaCycle"],
    moat: { process: 4, ipDesign: 4, ecosystem: 4, customer: 4, manufacturing: 0, switching: 4 },
    risk: {
      nvidiaDependency: 3,
      memoryCycle: 1,
      chinaExport: 3,
      customerConc: 4,
      capexCycle: 4,
      valuation: 5,
      techTransition: 3,
    },
    analystView:
      "「AI 資料中心 connectivity」純題材股，含金量高；估值已反映多年成長預期。",
    serdesAngle:
      "PCIe Gen6 採 64 GT/s PAM4，插入損耗預算大幅變緊，沒有 retimer 幾乎跑不到任何實用距離 — 是高速介面工程師最直接的「需求驅動」案例。",
    sourceUrls: [
      "https://www.asteralabs.com/",
      "https://investors.asteralabs.com/",
    ],
    confidenceLevel: "High",
    lastUpdated: STD_DATE,
    marketData: MD_USD,
  },

  {
    id: "credo",
    name: "Credo Technology",
    nameEn: "Credo Technology Group Holding Ltd",
    ticker: "NASDAQ: CRDO",
    market: "US",
    category: ["high-speed-interface", "copper-interconnect"],
    aiImportanceScore: 4,
    supplyChainPosition: "Midstream",
    coreProducts: [
      "AEC（Active Electrical Cable）含 retimer",
      "獨立 SerDes / PHY / Retimer IC",
      "光通訊 DSP",
      "Optical DSP for 800G",
    ],
    whatTheyDo:
      "聚焦超高速 SerDes 與 connectivity solution，主推 AEC（內含 retimer 的銅纜）做為機櫃內 / 跨機櫃 GPU 互連方案。",
    aiRelevance:
      "AEC 在 AI rack 內取代部分光模組與被動 DAC，延長 224G/112G PAM4 銅纜距離 — 為 AI 互連帶來成本與功耗優勢。",
    competitiveAdvantage:
      "AEC 為 Credo 領先推廣的產品形式；SerDes IP / IC 在 224G PAM4 上具量產經驗。",
    competitors: ["Marvell（retimer / DSP）", "Broadcom（DSP / retimer）", "Macom（部分）"],
    risks: [
      "客戶集中度高",
      "光模組 / LPO / CPO 對銅纜 / AEC 的長期替代風險",
      "與 Marvell、Broadcom 在 DSP 競爭",
    ],
    keyCustomersOrEcosystem:
      "公司公開揭露大客戶集中於 hyperscaler；具體客戶身分需個別查證。",
    technicalKeywords: ["AEC", "224G PAM4", "Retimer", "Optical DSP", "SerDes"],
    tags: ["AEC", "Retimer", "Optical DSP", "SerDes"],
    valuationSensitivity: ["hyperscalerDemand", "capexCycle"],
    moat: { process: 4, ipDesign: 4, ecosystem: 3, customer: 4, manufacturing: 0, switching: 3 },
    risk: {
      nvidiaDependency: 2,
      memoryCycle: 1,
      chinaExport: 3,
      customerConc: 5,
      capexCycle: 4,
      valuation: 4,
      techTransition: 4,
    },
    analystView:
      "AEC 是真實的 AI rack 痛點解；但客戶集中、光通訊技術轉換是中長期關鍵變數。",
    serdesAngle:
      "AEC 把 retimer 放進 cable 兩端，等於把 SerDes 含量「sneak」進銅纜 — 從 SI 角度看，這是 PCB 損耗無法再頂的 224G PAM4 的必然解。",
    sourceUrls: [
      "https://www.credosemi.com/",
      "https://investors.credosemi.com/",
    ],
    confidenceLevel: "High",
    lastUpdated: STD_DATE,
    marketData: MD_USD,
  },

  {
    id: "synopsys",
    name: "新思科技 Synopsys",
    nameEn: "Synopsys, Inc.",
    ticker: "NASDAQ: SNPS",
    market: "US",
    category: ["high-speed-interface", "ai-compute"],
    aiImportanceScore: 4,
    supplyChainPosition: "Upstream",
    coreProducts: [
      "EDA 工具（IC Compiler、PrimeTime、VCS、Fusion Design Platform）",
      "高速介面 IP（PCIe、CXL、DDR/HBM、224G Ethernet PHY、UCIe、USB）",
      "晶片驗證與 emulation",
      "Software Integrity（軟體安全，將分拆）",
    ],
    whatTheyDo:
      "全球 EDA 雙雄之一，同時是業界最大的 silicon IP 供應商，特別在高速介面 IP（PCIe、CXL、HBM、Ethernet PHY）市占居領先。",
    aiRelevance:
      "幾乎所有 AI 晶片設計都使用 Synopsys 工具與 IP；其 224G Ethernet PHY、HBM3E PHY、UCIe 等 IP 是 AI ASIC 客製化專案的關鍵元件。",
    competitiveAdvantage:
      "EDA + IP 雙引擎，產品線完整；多代工廠（TSMC、Samsung、Intel）製程矽驗證最完整。",
    competitors: ["Cadence", "Siemens EDA", "Alphawave（IP）", "Rambus（部分 IP）"],
    risks: [
      "EDA 是訂閱模式，但 IP 收入受客戶 ASIC 專案進度影響",
      "中國市場業務限制",
    ],
    keyCustomersOrEcosystem:
      "所有主要 IC 設計公司、IDM、ASIC 設計服務業者皆為客戶。",
    technicalKeywords: ["EDA", "IP", "224G PHY", "PCIe", "CXL", "HBM", "UCIe"],
    tags: ["EDA", "SerDes IP", "HBM PHY"],
    valuationSensitivity: ["capexCycle", "hyperscalerDemand"],
    moat: { process: 4, ipDesign: 5, ecosystem: 5, customer: 5, manufacturing: 0, switching: 5 },
    risk: {
      nvidiaDependency: 1,
      memoryCycle: 1,
      chinaExport: 4,
      customerConc: 2,
      capexCycle: 2,
      valuation: 3,
      techTransition: 2,
    },
    analystView:
      "AI 投入越多、ASIC 越多元，Synopsys 的 IP/EDA 越受惠；屬於「賣鏟子」的高品質模型。",
    serdesAngle:
      "Synopsys 224G PHY、HBM3E PHY 已在 TSMC N3 矽驗證並有公開技術論文 — 對於不想自研 SerDes 的 ASIC 客戶幾乎是唯一選擇。",
    sourceUrls: [
      "https://www.synopsys.com/dw/ipdir.php",
      "https://investor.synopsys.com/",
    ],
    confidenceLevel: "High",
    lastUpdated: STD_DATE,
    marketData: MD_USD,
  },

  {
    id: "parade",
    name: "譜瑞-KY Parade",
    nameEn: "Parade Technologies, Ltd.",
    ticker: "TWSE: 4966",
    market: "Taiwan",
    category: ["high-speed-interface"],
    aiImportanceScore: 2,
    supplyChainPosition: "Midstream",
    coreProducts: [
      "DisplayPort / HDMI 訊號處理 IC",
      "USB / Thunderbolt 訊號 IC",
      "PCIe redriver / retimer",
      "Touch & display drivers",
    ],
    whatTheyDo:
      "高速訊號 IC 設計公司，產品以顯示介面（DP/HDMI）、USB、PCIe 訊號完整性產品為主；PCIe redriver/retimer 是其資料中心 AI 相關產品線。",
    aiRelevance:
      "PCIe redriver/retimer 用於 server、SSD 端的高速連結補償；AI 純度比 Astera 低。",
    competitiveAdvantage:
      "在 PC 顯示介面 IC 市占居領先；訊號完整性 IC 設計能力穩定。",
    competitors: ["Astera Labs（PCIe retimer）", "MaxLinear", "Synaptics"],
    risks: ["PC 與 notebook 週期", "在 AI server retimer 上份額有限"],
    keyCustomersOrEcosystem:
      "大客戶含 Apple 與 PC OEM；資料中心 retimer 業務客戶身分需個別查證。",
    technicalKeywords: ["DisplayPort", "PCIe redriver", "Thunderbolt", "USB-C"],
    tags: ["Retimer", "Display IC", "Signal Integrity"],
    valuationSensitivity: ["pcCycle", "smartphoneCycle"],
    moat: { process: 3, ipDesign: 3, ecosystem: 3, customer: 4, manufacturing: 0, switching: 3 },
    risk: {
      nvidiaDependency: 1,
      memoryCycle: 1,
      chinaExport: 3,
      customerConc: 4,
      capexCycle: 2,
      valuation: 2,
      techTransition: 3,
    },
    analystView:
      "AI 純度較低，主業仍是 PC 顯示介面；資料中心 PCIe retimer 是長期選擇權。",
    sourceUrls: [
      "https://www.paradetech.com/",
      "https://mops.twse.com.tw/mops/web/t146sb05?TYPEK=sii&step=1&CO_ID=4966",
    ],
    confidenceLevel: "Medium",
    lastUpdated: STD_DATE,
    marketData: MD_TWD,
  },

  {
    id: "m31",
    name: "M31 Technology 力旺旗下記憶體 IP",
    nameEn: "M31 Technology Corporation",
    ticker: "TPEx: 6643",
    market: "Taiwan",
    category: ["high-speed-interface"],
    aiImportanceScore: 2,
    supplyChainPosition: "Upstream",
    coreProducts: [
      "Foundation IP（standard cell、memory compiler）",
      "Interface PHY IP（USB、MIPI、PCIe）",
      "多家代工廠製程矽驗證 IP",
    ],
    whatTheyDo:
      "矽智財（IP）公司，提供包含 Foundation IP 與部分 interface PHY IP；主要授權對象為 IC 設計公司在多家代工廠製程上實作。",
    aiRelevance:
      "AI ASIC 客製化專案會需要大量 IP（含 SerDes、PHY、memory compiler）；M31 在低中速 PHY 與 foundation IP 上有份額。",
    competitiveAdvantage:
      "在亞洲代工廠（含成熟製程）的 IP 矽驗證經驗豐富；客戶分散度高。",
    competitors: ["Synopsys", "Cadence（IP 部分）", "Faraday 智原", "eMemory 力旺"],
    risks: [
      "高速 SerDes（112G/224G）市場由 Synopsys/Cadence 等大廠主導",
      "AI 高階 ASIC 客戶較少採用",
    ],
    keyCustomersOrEcosystem:
      "客戶分散於亞洲多家 IC 設計公司；具體 AI 客戶比重需查證。",
    technicalKeywords: ["Foundation IP", "Memory compiler", "PHY IP"],
    tags: ["IP", "PHY"],
    valuationSensitivity: ["capexCycle", "smartphoneCycle"],
    moat: { process: 3, ipDesign: 3, ecosystem: 3, customer: 3, manufacturing: 0, switching: 3 },
    risk: {
      nvidiaDependency: 1,
      memoryCycle: 1,
      chinaExport: 3,
      customerConc: 3,
      capexCycle: 3,
      valuation: 3,
      techTransition: 3,
    },
    analystView:
      "AI 純度低；主要受惠路徑是「整體 IC 設計外包 + 成熟製程 IP 需求」，AI 是次要動能。",
    sourceUrls: ["https://www.m31tech.com/", "https://mops.twse.com.tw/"],
    confidenceLevel: "Low",
    lastUpdated: STD_DATE,
    marketData: MD_TWD,
  },

  // ============================================================
  // 銅纜與連接器
  // ============================================================
  {
    id: "amphenol",
    name: "安費諾 Amphenol",
    nameEn: "Amphenol Corporation",
    ticker: "NYSE: APH",
    market: "US",
    category: ["copper-interconnect"],
    aiImportanceScore: 4,
    supplyChainPosition: "Midstream",
    coreProducts: [
      "高速連接器、cable assembly",
      "QSFP-DD / OSFP 連接器",
      "DAC / AEC 銅纜 assembly",
      "車用、軍工、商用連接器",
    ],
    whatTheyDo:
      "全球前三大連接器公司之一，涵蓋資料中心、車用、軍工等多項應用；在資料中心高速連接器與 cable assembly 領域市占居前。",
    aiRelevance:
      "AI 機櫃內 GPU↔switch、front-end / back-end 網路皆使用 QSFP-DD / OSFP 連接器與 DAC / AEC 銅纜，Amphenol 是主要供應商之一。",
    competitiveAdvantage:
      "規模、製程、客戶廣度全球領先；併購整合能力強。",
    competitors: ["TE Connectivity", "Molex（私人）", "BizLink"],
    risks: ["AI 機櫃設計變化快、競爭加劇", "原物料成本波動"],
    keyCustomersOrEcosystem:
      "客戶涵蓋所有主要 OEM / ODM 與 hyperscaler。",
    technicalKeywords: ["QSFP-DD", "OSFP", "DAC", "AEC", "Backplane"],
    tags: ["Connector", "DAC", "AEC", "Cable"],
    valuationSensitivity: ["hyperscalerDemand", "serverDemand", "capexCycle"],
    moat: { process: 3, ipDesign: 3, ecosystem: 4, customer: 4, manufacturing: 4, switching: 3 },
    risk: {
      nvidiaDependency: 2,
      memoryCycle: 1,
      chinaExport: 2,
      customerConc: 2,
      capexCycle: 3,
      valuation: 3,
      techTransition: 3,
    },
    analystView:
      "AI 之外的多元產品線使其防禦性強；AI 是錦上添花而非單一驅動力。",
    sourceUrls: ["https://www.amphenol.com/", "https://investors.amphenol.com/"],
    confidenceLevel: "High",
    lastUpdated: STD_DATE,
    marketData: MD_USD,
  },

  {
    id: "te",
    name: "TE Connectivity",
    nameEn: "TE Connectivity Ltd.",
    ticker: "NYSE: TEL",
    market: "US",
    category: ["copper-interconnect"],
    aiImportanceScore: 3,
    supplyChainPosition: "Midstream",
    coreProducts: [
      "車用、工業、家電連接器",
      "資料與裝置連接器（QSFP、OSFP）",
      "Sensors",
    ],
    whatTheyDo:
      "全球大型連接器與感測器公司，產品涵蓋車用、工業、通訊、消費性電子。",
    aiRelevance:
      "資料中心連接器是業務一部分；AI 是次要驅動力，主要動能仍在車用與工業。",
    competitiveAdvantage: "車用 + 工業客戶基礎深；產品線完整。",
    competitors: ["Amphenol", "Molex", "Aptiv"],
    risks: ["車用週期", "工業疲弱"],
    keyCustomersOrEcosystem: "車廠、工業客戶、資料中心客戶。",
    technicalKeywords: ["Automotive connector", "Industrial connector", "QSFP-DD"],
    tags: ["Connector", "Cable"],
    valuationSensitivity: ["serverDemand", "smartphoneCycle"],
    moat: { process: 3, ipDesign: 3, ecosystem: 4, customer: 4, manufacturing: 4, switching: 3 },
    risk: {
      nvidiaDependency: 1,
      memoryCycle: 1,
      chinaExport: 2,
      customerConc: 2,
      capexCycle: 3,
      valuation: 2,
      techTransition: 3,
    },
    analystView: "AI 純度比 Amphenol 低，但業務分散度高，防禦性強。",
    sourceUrls: ["https://www.te.com/", "https://investors.te.com/"],
    confidenceLevel: "High",
    lastUpdated: STD_DATE,
    marketData: MD_USD,
  },

  {
    id: "lotes",
    name: "嘉澤 Lotes",
    nameEn: "Lotes Co., Ltd.",
    ticker: "TWSE: 3533",
    market: "Taiwan",
    category: ["copper-interconnect"],
    aiImportanceScore: 4,
    supplyChainPosition: "Midstream",
    coreProducts: [
      "CPU socket（LGA）",
      "GPU / accelerator socket",
      "高速連接器、NVLink 相關連接器",
    ],
    whatTheyDo:
      "台灣高階連接器公司，以 Intel/AMD CPU socket 出貨見長；公司公開揭露已切入 AI server 高速 socket 與 NVLink 連接器市場。",
    aiRelevance:
      "Nvidia GB200 NVL72 / HGX 等架構大量使用高速 socket 與 NVLink connector，公司被視為主要受惠廠商之一。",
    competitiveAdvantage:
      "Socket 機構 / 接點設計能力深，能對應高速 / 高 pin count 應用。",
    competitors: ["Foxconn FIT（鴻騰）", "Lots Asia Pacific", "Amphenol"],
    risks: [
      "客戶集中於少數 CPU/GPU 業者",
      "設計變更或產品轉換影響大",
    ],
    keyCustomersOrEcosystem:
      "公司公開揭露其為 Intel、AMD CPU socket 主要供應商，並切入 AI GPU / NVLink 連接器。",
    technicalKeywords: ["LGA socket", "NVLink connector", "High-speed connector"],
    tags: ["Connector", "Socket", "NVLink"],
    valuationSensitivity: ["nvidiaCycle", "serverDemand", "pcCycle"],
    moat: { process: 3, ipDesign: 3, ecosystem: 4, customer: 4, manufacturing: 4, switching: 3 },
    risk: {
      nvidiaDependency: 3,
      memoryCycle: 1,
      chinaExport: 2,
      customerConc: 4,
      capexCycle: 3,
      valuation: 3,
      techTransition: 3,
    },
    analystView:
      "AI rack 中「機構件 + 高速接點」題材的代表股之一；NVLink 連接器訂單擴張是關鍵變數。",
    serdesAngle:
      "高 pin count、低 insertion loss、低 crosstalk 的 socket 對 SerDes 訊號完整性影響直接，是 PCB layout 之外的「最後一吋」。",
    sourceUrls: [
      "https://www.lotes.com.tw/",
      "https://mops.twse.com.tw/mops/web/t146sb05?TYPEK=sii&step=1&CO_ID=3533",
    ],
    confidenceLevel: "Medium",
    lastUpdated: STD_DATE,
    marketData: MD_TWD,
  },

  {
    id: "bizlink",
    name: "貿聯-KY BizLink",
    nameEn: "BizLink Holding Inc.",
    ticker: "TWSE: 3665",
    market: "Taiwan",
    category: ["copper-interconnect", "ai-server-odm"],
    aiImportanceScore: 4,
    supplyChainPosition: "Midstream",
    coreProducts: [
      "高速 cable assembly（伺服器、儲存）",
      "車用、工業 cable",
      "資料中心線材",
    ],
    whatTheyDo:
      "高速線材與 cable assembly 製造商；公司公開揭露 AI server cable、儲存與電動車為主要成長動能。",
    aiRelevance:
      "AI server rack 內大量使用高速 cable / harness，BizLink 是主要供應商之一。",
    competitiveAdvantage: "高速線材設計與量產經驗、客戶結構分散。",
    competitors: ["Amphenol", "Foxconn FIT", "Volex"],
    risks: ["車用循環", "客戶集中於部分大型雲端業者"],
    keyCustomersOrEcosystem:
      "公司公開揭露 AI / 高速 cable 為主軸；具體客戶身分需個別查證。",
    technicalKeywords: ["Cable assembly", "DAC", "Harness", "High-speed cable"],
    tags: ["Cable", "DAC", "Connector"],
    valuationSensitivity: ["serverDemand", "hyperscalerDemand"],
    moat: { process: 3, ipDesign: 2, ecosystem: 3, customer: 3, manufacturing: 4, switching: 3 },
    risk: {
      nvidiaDependency: 2,
      memoryCycle: 1,
      chinaExport: 2,
      customerConc: 3,
      capexCycle: 3,
      valuation: 3,
      techTransition: 3,
    },
    analystView:
      "AI 拉貨對高速 cable 需求結構性正面；對 ODM 客戶關係影響營收節奏。",
    sourceUrls: [
      "https://www.bizlinktech.com/",
      "https://mops.twse.com.tw/mops/web/t146sb05?TYPEK=sii&step=1&CO_ID=3665",
    ],
    confidenceLevel: "Medium",
    lastUpdated: STD_DATE,
    marketData: MD_TWD,
  },

  // ============================================================
  // 光通訊
  // ============================================================
  {
    id: "coherent",
    name: "高意 Coherent",
    nameEn: "Coherent Corp.",
    ticker: "NYSE: COHR",
    market: "US",
    category: ["optical-communication"],
    aiImportanceScore: 4,
    supplyChainPosition: "Midstream",
    coreProducts: [
      "資料中心光收發器（800G / 1.6T）",
      "EML、VCSEL 雷射",
      "光纖元件",
      "工業雷射、SiC 基板",
    ],
    whatTheyDo:
      "全球大型光通訊與雷射元件公司（前身為 II-VI），併購 Finisar 後成為資料中心光模組與雷射晶片主要供應商之一。",
    aiRelevance:
      "AI cluster 跨機櫃連結需大量 400G/800G 光模組，並逐步走向 1.6T；公司公開將 AI / 資料中心列為核心成長動能。",
    competitiveAdvantage:
      "整合上游雷射 + 下游模組，垂直整合度高；產品線完整。",
    competitors: ["Lumentum", "Cisco/Acacia", "Innolight（CN）", "Eoptolink（CN）", "Fabrinet（contract）"],
    risks: [
      "CPO / LPO 對可插拔光模組長期替代風險",
      "中國光模組業者價格競爭",
      "客戶集中於少數 hyperscaler",
    ],
    keyCustomersOrEcosystem:
      "資料中心客戶包含主要 hyperscaler 與系統業者，具體比重需查證。",
    technicalKeywords: ["EML", "DML", "VCSEL", "800G DR8", "1.6T", "SiC"],
    tags: ["Optical Module", "Laser", "EML", "VCSEL", "Silicon Photonics", "CPO"],
    valuationSensitivity: ["hyperscalerDemand", "capexCycle"],
    moat: { process: 4, ipDesign: 3, ecosystem: 4, customer: 4, manufacturing: 4, switching: 3 },
    risk: {
      nvidiaDependency: 3,
      memoryCycle: 1,
      chinaExport: 3,
      customerConc: 3,
      capexCycle: 4,
      valuation: 3,
      techTransition: 4,
    },
    analystView:
      "AI 光通訊是中期主軸；CPO 是否在 1.6T 世代取代可插拔光模組將決定長期成長曲線。",
    serdesAngle:
      "EML / DML 是光模組「電轉光」的核心；CPO 把這些東西搬進 switch package — 對 SerDes / packaging / thermal 都是巨大設計挑戰。",
    sourceUrls: ["https://www.coherent.com/", "https://investors.coherent.com/"],
    confidenceLevel: "High",
    lastUpdated: STD_DATE,
    marketData: MD_USD,
  },

  {
    id: "lumentum",
    name: "Lumentum",
    nameEn: "Lumentum Holdings Inc.",
    ticker: "NASDAQ: LITE",
    market: "US",
    category: ["optical-communication"],
    aiImportanceScore: 4,
    supplyChainPosition: "Midstream",
    coreProducts: [
      "資料中心光收發器（含 800G）",
      "Coherent ZR/ZR+ 光元件",
      "EML、VCSEL、PIC（光積體電路）",
      "3D sensing（消費性）",
    ],
    whatTheyDo:
      "全球大型光通訊元件廠，併購 Cloud Light 後強化資料中心光模組布局；同時供應雷射元件、3D sensing 模組（用於 iPhone 等）。",
    aiRelevance:
      "AI 資料中心對 800G / 1.6T 光模組需求暴增，Lumentum 是主要受惠者之一。",
    competitiveAdvantage:
      "在 EML 等核心雷射晶片擁有自有產能；ZR/ZR+ 等 coherent 領先。",
    competitors: ["Coherent", "Cisco/Acacia", "中國光模組廠"],
    risks: [
      "3D sensing 業務週期下行",
      "CPO 替代風險",
      "中國光模組價格競爭",
    ],
    keyCustomersOrEcosystem:
      "公司公開揭露主要 hyperscaler 為其 800G/1.6T 客戶；具體比重需個別查證。",
    technicalKeywords: ["EML", "DML", "VCSEL", "800G DR8", "1.6T", "Coherent ZR"],
    tags: ["Optical Module", "Laser", "Coherent", "Silicon Photonics", "CPO"],
    valuationSensitivity: ["hyperscalerDemand", "smartphoneCycle", "capexCycle"],
    moat: { process: 4, ipDesign: 3, ecosystem: 4, customer: 4, manufacturing: 4, switching: 3 },
    risk: {
      nvidiaDependency: 3,
      memoryCycle: 1,
      chinaExport: 3,
      customerConc: 4,
      capexCycle: 4,
      valuation: 3,
      techTransition: 4,
    },
    analystView:
      "AI 光通訊純度高於 Coherent，但 3D sensing 業務拖累整體成長曲線。",
    sourceUrls: ["https://www.lumentum.com/", "https://investor.lumentum.com/"],
    confidenceLevel: "High",
    lastUpdated: STD_DATE,
    marketData: MD_USD,
  },

  {
    id: "fabrinet",
    name: "Fabrinet",
    nameEn: "Fabrinet",
    ticker: "NYSE: FN",
    market: "US",
    category: ["optical-communication"],
    aiImportanceScore: 4,
    supplyChainPosition: "Midstream",
    coreProducts: [
      "光學產品代工（contract manufacturing）",
      "雷射、感測、汽車相關精密製造",
      "光收發器代工",
    ],
    whatTheyDo:
      "全球大型光學與精密製造代工廠，總部新加坡、產能位於泰國；客戶涵蓋多家光通訊與雷射公司，是「光通訊圈的台積電」角色。",
    aiRelevance:
      "代工 800G / 1.6T 光模組與 Nvidia 等客戶相關光元件，AI 客戶是公司公開揭露的主要成長動能。",
    competitiveAdvantage:
      "光模組代工規模、製程經驗、客戶信任度領先；產能與工程能力是進入障礙。",
    competitors: ["Sanmina（部分）", "Lumentum（自製）", "Coherent（自製）"],
    risks: [
      "客戶集中於少數光通訊客戶",
      "客戶 in-house 製造比例變化",
      "汽車雷射業務週期",
    ],
    keyCustomersOrEcosystem:
      "公司公開揭露大客戶包含 Nvidia（透過光元件 / 模組代工）、Cisco 等；具體比重需查證。",
    technicalKeywords: ["Optical contract manufacturing", "Precision optics"],
    tags: ["Optical CM", "Contract Manufacturing", "CPO"],
    valuationSensitivity: ["hyperscalerDemand", "nvidiaCycle"],
    moat: { process: 4, ipDesign: 2, ecosystem: 4, customer: 5, manufacturing: 5, switching: 4 },
    risk: {
      nvidiaDependency: 4,
      memoryCycle: 1,
      chinaExport: 3,
      customerConc: 4,
      capexCycle: 3,
      valuation: 3,
      techTransition: 3,
    },
    analystView:
      "光通訊代工的純度極高；Nvidia / hyperscaler 業務 ramp 直接帶動營收。",
    sourceUrls: ["https://www.fabrinet.com/", "https://investor.fabrinet.com/"],
    confidenceLevel: "High",
    lastUpdated: STD_DATE,
    marketData: MD_USD,
  },

  {
    id: "aaoi",
    name: "Applied Optoelectronics",
    nameEn: "Applied Optoelectronics, Inc.",
    ticker: "NASDAQ: AAOI",
    market: "US",
    category: ["optical-communication"],
    aiImportanceScore: 3,
    supplyChainPosition: "Midstream",
    coreProducts: [
      "資料中心光收發器（400G、800G）",
      "CATV 接取產品",
      "電信光元件",
    ],
    whatTheyDo:
      "美國光通訊元件與光收發器設計與製造公司，提供資料中心、有線寬頻接取、電信用光元件；近期將部分產能與業務轉向 800G 資料中心。",
    aiRelevance:
      "切入 hyperscaler 800G 光模組市場是公司公開揭露的核心策略；AI 純度由 0 開始走向中等。",
    competitiveAdvantage: "美國本土生產 + 垂直整合（自有雷射晶片）。",
    competitors: ["Coherent", "Lumentum", "中國光模組廠"],
    risks: [
      "規模小於主要競爭者",
      "客戶集中度高",
      "歷史財務波動大",
    ],
    keyCustomersOrEcosystem:
      "歷史大客戶包含 Microsoft、Amazon 等（依公司過往揭露），近年積極爭取 Nvidia 生態系；具體比重請查證最新財報。",
    technicalKeywords: ["800G", "EML", "Datacenter optics"],
    tags: ["Optical Module", "EML"],
    valuationSensitivity: ["hyperscalerDemand", "telecomCycle"],
    moat: { process: 3, ipDesign: 3, ecosystem: 3, customer: 3, manufacturing: 3, switching: 3 },
    risk: {
      nvidiaDependency: 2,
      memoryCycle: 1,
      chinaExport: 2,
      customerConc: 5,
      capexCycle: 4,
      valuation: 4,
      techTransition: 4,
    },
    analystView:
      "高 beta 的光通訊轉型題材；單一客戶或大單能帶來巨大營收波動。",
    sourceUrls: ["https://ao-inc.com/", "https://investors.ao-inc.com/"],
    confidenceLevel: "Medium",
    lastUpdated: STD_DATE,
    marketData: MD_USD,
  },

  // ============================================================
  // AI 伺服器與 ODM
  // ============================================================
  {
    id: "supermicro",
    name: "美超微 Super Micro",
    nameEn: "Super Micro Computer, Inc.",
    ticker: "NASDAQ: SMCI",
    market: "US",
    category: ["ai-server-odm", "thermal-cooling"],
    aiImportanceScore: 4,
    supplyChainPosition: "Downstream",
    coreProducts: [
      "AI server（HGX、MGX、GB200 NVL72 機櫃方案）",
      "邊緣 / 一般 enterprise server",
      "液冷整合機櫃",
    ],
    whatTheyDo:
      "美國伺服器系統業者，與 Nvidia 合作密切，是 HGX / MGX / GB200 等 AI server 主要系統整合商之一；公司公開推廣 rack-scale 液冷方案。",
    aiRelevance:
      "公開市場最直接的 AI server pure-play 之一；與 Nvidia 共同推出多代 AI server 平台。",
    competitiveAdvantage:
      "對 Nvidia 平台早期支援快、產品線廣、客製化彈性大；液冷整合能力。",
    competitors: ["Dell", "HPE", "台廠 ODM（Wistron、Quanta、Wiwynn 等）"],
    risks: [
      "毛利率偏低且波動大",
      "會計與內部控制爭議的歷史包袱",
      "與大型 OEM / hyperscaler 直購（ODM Direct）競爭",
    ],
    keyCustomersOrEcosystem:
      "客戶涵蓋多家雲端業者、新型 AI 新創與企業；具體比重請參閱最新揭露。",
    technicalKeywords: ["HGX", "MGX", "GB200 NVL72", "Liquid cooling", "Rack-scale"],
    tags: ["AI Server", "ODM Direct", "Liquid Cooling"],
    valuationSensitivity: ["nvidiaCycle", "hyperscalerDemand", "capexCycle"],
    moat: { process: 0, ipDesign: 3, ecosystem: 4, customer: 4, manufacturing: 3, switching: 2 },
    risk: {
      nvidiaDependency: 5,
      memoryCycle: 1,
      chinaExport: 3,
      customerConc: 4,
      capexCycle: 4,
      valuation: 4,
      techTransition: 3,
    },
    analystView:
      "幾乎 100% 跟 Nvidia 出貨節奏綁定；公司治理風險是估值折價因素。",
    sourceUrls: ["https://www.supermicro.com/en/", "https://ir.supermicro.com/"],
    confidenceLevel: "High",
    lastUpdated: STD_DATE,
    marketData: MD_USD,
  },

  {
    id: "wistron",
    name: "緯創資通 Wistron",
    nameEn: "Wistron Corporation",
    ticker: "TWSE: 3231",
    market: "Taiwan",
    category: ["ai-server-odm"],
    aiImportanceScore: 4,
    supplyChainPosition: "Downstream",
    coreProducts: [
      "AI server（HGX baseboard、整機）",
      "通用 server、NB",
      "醫療、車用、display 解決方案",
    ],
    whatTheyDo:
      "台灣大型 ODM，是 Nvidia HGX baseboard 主要組裝商之一；公司公開揭露 AI server 為主要成長動能。",
    aiRelevance:
      "Nvidia HGX baseboard 設計與組裝主要供應商之一；同時為多家美國品牌 / hyperscaler 提供 AI server 製造。",
    competitiveAdvantage:
      "與 Nvidia 多年合作經驗、HGX 平台量產體系成熟。",
    competitors: ["Foxconn", "Quanta", "Inventec"],
    risks: [
      "AI server 毛利率偏低",
      "客戶集中於 Nvidia 與少數品牌",
      "緯穎分拆後集團 AI 純度被稀釋",
    ],
    keyCustomersOrEcosystem:
      "Nvidia 為公開揭露之合作夥伴；其他系統客戶身分需個別查證。",
    technicalKeywords: ["HGX baseboard", "AI server", "ODM"],
    tags: ["AI Server", "ODM", "HGX"],
    valuationSensitivity: ["nvidiaCycle", "hyperscalerDemand", "capexCycle"],
    moat: { process: 0, ipDesign: 3, ecosystem: 4, customer: 4, manufacturing: 4, switching: 3 },
    risk: {
      nvidiaDependency: 5,
      memoryCycle: 1,
      chinaExport: 3,
      customerConc: 4,
      capexCycle: 4,
      valuation: 3,
      techTransition: 3,
    },
    analystView:
      "AI server ODM 直接受惠 GPU 出貨；毛利率與 ODM 競爭分流是估值關鍵。",
    sourceUrls: [
      "https://www.wistron.com/",
      "https://mops.twse.com.tw/mops/web/t146sb05?TYPEK=sii&step=1&CO_ID=3231",
    ],
    confidenceLevel: "High",
    lastUpdated: STD_DATE,
    marketData: MD_TWD,
  },

  {
    id: "wiwynn",
    name: "緯穎科技 Wiwynn",
    nameEn: "Wiwynn Corporation",
    ticker: "TWSE: 6669",
    market: "Taiwan",
    category: ["ai-server-odm"],
    aiImportanceScore: 5,
    supplyChainPosition: "Downstream",
    coreProducts: [
      "Hyperscale server（一般、AI）",
      "Rack 解決方案、儲存節點",
      "客製化 server",
    ],
    whatTheyDo:
      "由 Wistron 分拆專注於 hyperscale 客戶的 ODM Direct 業者，以 Meta / Microsoft 等大客戶聞名；公司公開揭露 AI server 為主要成長引擎。",
    aiRelevance:
      "目前台股最高純度 AI server ODM Direct 之一，承接多家 hyperscaler 的 AI server 訂單。",
    competitiveAdvantage:
      "與少數 hyperscaler 深度綁定的設計能力與量產彈性；Open Compute 設計經驗豐富。",
    competitors: ["Quanta Cloud Technology", "Foxconn (Hon Hai)", "Inventec", "Celestica"],
    risks: [
      "客戶極度集中於 2-3 家 hyperscaler",
      "毛利率偏低",
      "單一客戶設計變動或砍單衝擊大",
    ],
    keyCustomersOrEcosystem:
      "公司公開揭露主要客戶為大型 hyperscaler（特別是 Meta、Microsoft）；單一客戶比重請查最新揭露。",
    technicalKeywords: ["Open Compute", "Hyperscale server", "AI server"],
    tags: ["AI Server", "ODM Direct", "Hyperscale"],
    valuationSensitivity: ["hyperscalerDemand", "capexCycle"],
    moat: { process: 0, ipDesign: 3, ecosystem: 4, customer: 5, manufacturing: 4, switching: 3 },
    risk: {
      nvidiaDependency: 3,
      memoryCycle: 1,
      chinaExport: 2,
      customerConc: 5,
      capexCycle: 4,
      valuation: 4,
      techTransition: 3,
    },
    analystView:
      "AI server 高純度題材；hyperscaler capex 是直接 driver，但客戶集中是雙面刃。",
    sourceUrls: [
      "https://www.wiwynn.com/",
      "https://mops.twse.com.tw/mops/web/t146sb05?TYPEK=sii&step=1&CO_ID=6669",
    ],
    confidenceLevel: "High",
    lastUpdated: STD_DATE,
    marketData: MD_TWD,
  },

  {
    id: "quanta",
    name: "廣達電腦 Quanta",
    nameEn: "Quanta Computer Inc.",
    ticker: "TWSE: 2382",
    market: "Taiwan",
    category: ["ai-server-odm"],
    aiImportanceScore: 4,
    supplyChainPosition: "Downstream",
    coreProducts: [
      "Notebook（仍是公司主要營收來源之一）",
      "AI server（HGX、MGX、自有平台）",
      "Cloud server（QCT 子公司）",
      "車用、智慧醫療等多角化",
    ],
    whatTheyDo:
      "全球最大 NB ODM 之一，並透過 QCT（Quanta Cloud Technology）切入雲端 / AI server；公司公開揭露 AI server 為核心成長動能。",
    aiRelevance:
      "Nvidia HGX / GB200 系列主要 ODM 之一；QCT 提供白牌 server 與 rack 解決方案。",
    competitiveAdvantage:
      "規模、量產經驗、QCT 對 hyperscaler 直供經驗。",
    competitors: ["Foxconn", "Wistron", "Inventec", "Wiwynn"],
    risks: [
      "NB 業務週期",
      "AI server 毛利率",
      "客戶集中度",
    ],
    keyCustomersOrEcosystem:
      "AI server 客戶涵蓋多家美系品牌與 hyperscaler；具體比重請查最新揭露。",
    technicalKeywords: ["HGX", "MGX", "QCT", "AI server"],
    tags: ["AI Server", "ODM", "NB"],
    valuationSensitivity: ["nvidiaCycle", "hyperscalerDemand", "pcCycle"],
    moat: { process: 0, ipDesign: 3, ecosystem: 4, customer: 4, manufacturing: 5, switching: 3 },
    risk: {
      nvidiaDependency: 4,
      memoryCycle: 1,
      chinaExport: 3,
      customerConc: 3,
      capexCycle: 4,
      valuation: 3,
      techTransition: 3,
    },
    analystView:
      "AI server ramp + NB 緩升 + QCT 雲端業務三個動能；AI 比重提升將重新評價。",
    sourceUrls: [
      "https://www.quantatw.com/",
      "https://www.qct.io/",
      "https://mops.twse.com.tw/mops/web/t146sb05?TYPEK=sii&step=1&CO_ID=2382",
    ],
    confidenceLevel: "High",
    lastUpdated: STD_DATE,
    marketData: MD_TWD,
  },

  {
    id: "inventec",
    name: "英業達 Inventec",
    nameEn: "Inventec Corporation",
    ticker: "TWSE: 2356",
    market: "Taiwan",
    category: ["ai-server-odm"],
    aiImportanceScore: 4,
    supplyChainPosition: "Downstream",
    coreProducts: [
      "Notebook、消費性電子",
      "AI server（含 HGX baseboard 組裝、整機）",
      "智慧裝置、無人機等",
    ],
    whatTheyDo:
      "台灣大型 ODM，傳統業務以 NB 與通用 server 為主，近年公開揭露 AI server 為主要成長動能。",
    aiRelevance:
      "Nvidia HGX baseboard 主要組裝廠之一；同時為多家系統與品牌客戶供應 AI server。",
    competitiveAdvantage:
      "量產經驗、客戶廣度、價格競爭力。",
    competitors: ["Wistron", "Foxconn", "Quanta"],
    risks: [
      "AI server 毛利率",
      "客戶集中度",
    ],
    keyCustomersOrEcosystem:
      "客戶涵蓋多家品牌與雲端業者；具體比重需查最新揭露。",
    technicalKeywords: ["HGX baseboard", "AI server"],
    tags: ["AI Server", "ODM", "NB"],
    valuationSensitivity: ["nvidiaCycle", "pcCycle", "hyperscalerDemand"],
    moat: { process: 0, ipDesign: 3, ecosystem: 4, customer: 4, manufacturing: 4, switching: 3 },
    risk: {
      nvidiaDependency: 4,
      memoryCycle: 1,
      chinaExport: 3,
      customerConc: 3,
      capexCycle: 4,
      valuation: 3,
      techTransition: 3,
    },
    analystView:
      "傳統 ODM 中 AI server 比重相對高的選擇；毛利率與客戶結構是觀察重點。",
    sourceUrls: [
      "https://www.inventec.com/",
      "https://mops.twse.com.tw/mops/web/t146sb05?TYPEK=sii&step=1&CO_ID=2356",
    ],
    confidenceLevel: "High",
    lastUpdated: STD_DATE,
    marketData: MD_TWD,
  },

  {
    id: "foxconn",
    name: "鴻海精密 Foxconn",
    nameEn: "Hon Hai Precision Industry Co., Ltd.",
    ticker: "TWSE: 2317",
    market: "Taiwan",
    category: ["ai-server-odm"],
    aiImportanceScore: 5,
    supplyChainPosition: "Downstream",
    coreProducts: [
      "iPhone / 消費性電子代工",
      "AI server（含 GB200 NVL72 機櫃整合）",
      "雲端 / 網通設備",
      "車用、半導體、3+3 新領域",
    ],
    whatTheyDo:
      "全球最大電子製造服務（EMS）業者；公司公開將 AI server 列為三大新事業中的關鍵動能，並參與 Nvidia GB200 NVL72 機櫃整合與大量出貨。",
    aiRelevance:
      "GB200 NVL72 等 rack-scale 系統整合主要承接者之一；CW (cable + 機櫃 + 液冷 + 電源) 整合能力是其區隔。",
    competitiveAdvantage:
      "規模、跨產品線整合能力、全球佈局；機構件 + EMS + 電源 + 散熱垂直整合。",
    competitors: ["Wistron", "Quanta", "Inventec", "Wiwynn", "Pegatron"],
    risks: [
      "iPhone 週期",
      "中國產能地緣風險",
      "AI server 毛利率受競爭壓制",
    ],
    keyCustomersOrEcosystem:
      "公司公開揭露為 Nvidia GB200 NVL72 主要組裝夥伴之一；其他 hyperscaler 客戶身分需查證。",
    technicalKeywords: ["GB200 NVL72", "Rack-scale", "Liquid cooling", "EMS"],
    tags: ["AI Server", "EMS", "Rack-scale", "GB200"],
    valuationSensitivity: ["nvidiaCycle", "smartphoneCycle", "hyperscalerDemand"],
    moat: { process: 0, ipDesign: 3, ecosystem: 5, customer: 5, manufacturing: 5, switching: 3 },
    risk: {
      nvidiaDependency: 3,
      memoryCycle: 1,
      chinaExport: 4,
      customerConc: 3,
      capexCycle: 4,
      valuation: 3,
      techTransition: 3,
    },
    analystView:
      "AI server 是新成長故事；iPhone 仍是現金流基礎；rack-scale 整合能力是與其他 ODM 差異化關鍵。",
    sourceUrls: [
      "https://www.honhai.com/",
      "https://mops.twse.com.tw/mops/web/t146sb05?TYPEK=sii&step=1&CO_ID=2317",
    ],
    confidenceLevel: "High",
    lastUpdated: STD_DATE,
    marketData: MD_TWD,
  },

  // ============================================================
  // 電源管理與供電系統
  // ============================================================
  {
    id: "vertiv",
    name: "Vertiv",
    nameEn: "Vertiv Holdings Co.",
    ticker: "NYSE: VRT",
    market: "US",
    category: ["power-management", "thermal-cooling", "data-center-infra"],
    aiImportanceScore: 4,
    supplyChainPosition: "Downstream",
    coreProducts: [
      "Liebert UPS、PDU",
      "資料中心熱管理（CDU、in-row cooling）",
      "Power Bus、Switchgear",
      "Rack PDU、整機櫃方案",
    ],
    whatTheyDo:
      "全球大型資料中心電源與熱管理系統業者；公司公開揭露與 Nvidia 等合作 reference design，為 AI 資料中心提供整合方案。",
    aiRelevance:
      "AI rack 從 ~20kW 走向 120kW+，UPS、PDU、CDU、in-row cooling 都需要重做；Vertiv 是少數能提供 end-to-end 解決方案的公司。",
    competitiveAdvantage:
      "全球服務據點、品牌（Liebert）信任度、整合解決方案能力。",
    competitors: ["Schneider Electric", "Eaton", "Stulz", "Rittal"],
    risks: [
      "AI 資料中心建設時程波動",
      "競爭者擴張 AI 產品線",
      "估值偏高",
    ],
    keyCustomersOrEcosystem:
      "客戶涵蓋多數 hyperscaler 與 colocation 業者；公司亦公開與 Nvidia 合作 reference design。",
    technicalKeywords: ["UPS", "PDU", "CDU", "Liquid cooling", "In-row cooling"],
    tags: ["Power", "Cooling", "Data Center"],
    valuationSensitivity: ["hyperscalerDemand", "capexCycle"],
    moat: { process: 0, ipDesign: 3, ecosystem: 4, customer: 5, manufacturing: 4, switching: 4 },
    risk: {
      nvidiaDependency: 2,
      memoryCycle: 1,
      chinaExport: 2,
      customerConc: 3,
      capexCycle: 4,
      valuation: 5,
      techTransition: 3,
    },
    analystView:
      "AI 資料中心 capex 的「彎道」受惠者；高估值反映成長預期，需追蹤訂單能見度。",
    sourceUrls: ["https://www.vertiv.com/", "https://investors.vertiv.com/"],
    confidenceLevel: "High",
    lastUpdated: STD_DATE,
    marketData: MD_USD,
  },

  {
    id: "mps",
    name: "Monolithic Power Systems",
    nameEn: "Monolithic Power Systems, Inc.",
    ticker: "NASDAQ: MPWR",
    market: "US",
    category: ["power-management"],
    aiImportanceScore: 4,
    supplyChainPosition: "Midstream",
    coreProducts: [
      "高效率 DC-DC 與多相 buck 控制器",
      "Power Module、Power Stage",
      "車用、工業、消費 PMIC",
    ],
    whatTheyDo:
      "美國電源 IC 公司，產品涵蓋 PoL（point-of-load）電源、車用 PMIC、伺服器 VRM 等；公司公開揭露 AI / 資料中心為主要成長動能。",
    aiRelevance:
      "GPU/ASIC 高電流需求推動高密度 VRM / power stage 採用，MPS 是少數能滿足 800A+ GPU core rail 的公司之一。",
    competitiveAdvantage:
      "高度整合的 process 與 packaging（自有 BCD process）；產品線完整、上市時程快。",
    competitors: ["Infineon", "Texas Instruments", "Renesas", "Maxim/ADI"],
    risks: [
      "AI 客戶集中於少數 GPU 與 ASIC 業者",
      "與 Infineon 等競爭加劇",
      "估值偏高",
    ],
    keyCustomersOrEcosystem:
      "公司未完整揭露所有客戶；產業共識認為 Nvidia 平台是其重要 AI 客戶之一，需個別查證。",
    technicalKeywords: ["VRM", "Power stage", "DrMOS", "Multi-phase buck", "BCD process"],
    tags: ["Power IC", "VRM", "Power Stage"],
    valuationSensitivity: ["nvidiaCycle", "hyperscalerDemand", "capexCycle"],
    moat: { process: 4, ipDesign: 4, ecosystem: 3, customer: 4, manufacturing: 3, switching: 3 },
    risk: {
      nvidiaDependency: 3,
      memoryCycle: 1,
      chinaExport: 3,
      customerConc: 3,
      capexCycle: 4,
      valuation: 5,
      techTransition: 3,
    },
    analystView:
      "AI GPU 電源密度題材的純度最高的純電源 IC 公司之一；估值反映高期望。",
    serdesAngle:
      "GPU rail 電壓品質直接影響周邊 SerDes 抖動（jitter）；高頻寬 PI 設計越來越關鍵 — MPS 等供應商的 power integrity 表現是 SerDes 工程師關心的隱性變數。",
    sourceUrls: ["https://www.monolithicpower.com/", "https://ir.monolithicpower.com/"],
    confidenceLevel: "High",
    lastUpdated: STD_DATE,
    marketData: MD_USD,
  },

  {
    id: "eaton",
    name: "Eaton",
    nameEn: "Eaton Corporation plc",
    ticker: "NYSE: ETN",
    market: "US",
    category: ["power-management", "data-center-infra"],
    aiImportanceScore: 3,
    supplyChainPosition: "Downstream",
    coreProducts: [
      "資料中心 UPS、PDU、配電",
      "工業 / 商用 / 住宅電力",
      "航太、車用",
    ],
    whatTheyDo:
      "全球大型電力管理公司，產品涵蓋資料中心 UPS、PDU、開關設備（switchgear）；公司公開揭露 AI 資料中心建設為主要成長動能。",
    aiRelevance:
      "AI 資料中心新建潮帶動 medium voltage 開關、UPS、PDU、轉換器需求。",
    competitiveAdvantage:
      "規模、品牌、安裝基礎、跨產業多元化。",
    competitors: ["Schneider Electric", "Vertiv", "ABB"],
    risks: ["工業循環", "資料中心建設節奏波動"],
    keyCustomersOrEcosystem: "資料中心、工業、車用、航太多元客戶。",
    technicalKeywords: ["UPS", "Switchgear", "Power management"],
    tags: ["Power", "Data Center", "Switchgear"],
    valuationSensitivity: ["hyperscalerDemand", "capexCycle"],
    moat: { process: 0, ipDesign: 3, ecosystem: 4, customer: 5, manufacturing: 4, switching: 4 },
    risk: {
      nvidiaDependency: 1,
      memoryCycle: 1,
      chinaExport: 2,
      customerConc: 2,
      capexCycle: 4,
      valuation: 3,
      techTransition: 2,
    },
    analystView:
      "AI 是錦上添花，非主驅動力；多元客戶結構防禦性強。",
    sourceUrls: ["https://www.eaton.com/", "https://www.eaton.com/us/en-us/company/investor-relations.html"],
    confidenceLevel: "High",
    lastUpdated: STD_DATE,
    marketData: MD_USD,
  },

  {
    id: "delta",
    name: "台達電子 Delta",
    nameEn: "Delta Electronics, Inc.",
    ticker: "TWSE: 2308",
    market: "Taiwan",
    category: ["power-management", "thermal-cooling", "data-center-infra"],
    aiImportanceScore: 5,
    supplyChainPosition: "Midstream",
    coreProducts: [
      "伺服器電源（PSU、Power Shelf、BBU）",
      "資料中心 UPS、PDU、busway",
      "電源管理 IC（部分）與電源模組",
      "電動車充電、工業自動化",
      "風扇、散熱模組（含液冷）",
    ],
    whatTheyDo:
      "全球大型電源管理與被動元件業者；公司公開揭露 AI server 電源、資料中心、電動車為三大主要成長動能。",
    aiRelevance:
      "AI server 高效率電源（800V 直流、48V rack power）公認的主要供應商之一；亦布局液冷 CDU、manifold。",
    competitiveAdvantage:
      "電源效率（titanium、80+ ultra）長期領先；產品線涵蓋電源、散熱、機構件、被動元件；垂直整合度高。",
    competitors: ["Lite-On", "Flex / Salcomp", "AcBel", "Chicony Power", "Vertiv（系統）"],
    risks: [
      "PC 電源價格競爭",
      "電動車事業投入沉重",
      "客戶集中於少數 hyperscaler / GPU 業者",
    ],
    keyCustomersOrEcosystem:
      "公司公開揭露主要 AI server 電源客戶涵蓋 Nvidia 平台與多家系統業者；EV 客戶含特斯拉等。",
    technicalKeywords: ["PSU", "BBU", "Power Shelf", "48V rack", "Titanium efficiency"],
    tags: ["Power", "Cooling", "PSU", "BBU"],
    valuationSensitivity: ["nvidiaCycle", "hyperscalerDemand", "capexCycle"],
    moat: { process: 3, ipDesign: 4, ecosystem: 5, customer: 5, manufacturing: 5, switching: 4 },
    risk: {
      nvidiaDependency: 3,
      memoryCycle: 1,
      chinaExport: 2,
      customerConc: 3,
      capexCycle: 4,
      valuation: 3,
      techTransition: 3,
    },
    analystView:
      "台股 AI 電源 / 散熱第一名選擇；公司結構性受惠 AI rack power density 上升。",
    serdesAngle:
      "Power Shelf + 48V/800V 架構提供更乾淨的 GPU 電壓 → 周邊 SerDes 訊號品質更穩定 — Delta 的電源拓樸選擇對 PI/SI 設計影響大。",
    sourceUrls: [
      "https://www.deltaww.com/",
      "https://mops.twse.com.tw/mops/web/t146sb05?TYPEK=sii&step=1&CO_ID=2308",
    ],
    confidenceLevel: "High",
    lastUpdated: STD_DATE,
    marketData: MD_TWD,
  },

  {
    id: "liteon",
    name: "光寶科技 Lite-On",
    nameEn: "Lite-On Technology Corporation",
    ticker: "TWSE: 2301",
    market: "Taiwan",
    category: ["power-management"],
    aiImportanceScore: 4,
    supplyChainPosition: "Midstream",
    coreProducts: [
      "伺服器、雲端電源（PSU、Power Shelf）",
      "光電元件、LED",
      "汽車電子、機構件",
    ],
    whatTheyDo:
      "台灣大型電源 / 機構 / 光電業者，雲端與伺服器電源為主要 AI 相關業務；公司公開揭露 AI server 電源為主要成長動能。",
    aiRelevance:
      "公開資訊指其為 hyperscaler AI server 電源主要供應商之一，與 Delta、AcBel 競爭。",
    competitiveAdvantage: "電源量產規模、客戶廣度。",
    competitors: ["Delta", "AcBel", "Chicony Power"],
    risks: [
      "電源毛利率壓力",
      "客戶集中度",
    ],
    keyCustomersOrEcosystem:
      "公司公開揭露為多家 hyperscaler 與 server OEM 之電源供應商；具體比重需查最新揭露。",
    technicalKeywords: ["PSU", "Power Shelf", "AI server power"],
    tags: ["Power", "PSU"],
    valuationSensitivity: ["hyperscalerDemand", "capexCycle"],
    moat: { process: 2, ipDesign: 3, ecosystem: 4, customer: 4, manufacturing: 4, switching: 3 },
    risk: {
      nvidiaDependency: 2,
      memoryCycle: 1,
      chinaExport: 2,
      customerConc: 3,
      capexCycle: 4,
      valuation: 3,
      techTransition: 3,
    },
    analystView:
      "與 Delta、AcBel 共同分食 AI server 電源大餅；毛利率改善是估值重點。",
    sourceUrls: [
      "https://www.liteon.com/",
      "https://mops.twse.com.tw/mops/web/t146sb05?TYPEK=sii&step=1&CO_ID=2301",
    ],
    confidenceLevel: "High",
    lastUpdated: STD_DATE,
    marketData: MD_TWD,
  },

  {
    id: "acbel",
    name: "康舒科技 AcBel",
    nameEn: "AcBel Polytech Inc.",
    ticker: "TWSE: 6282",
    market: "Taiwan",
    category: ["power-management"],
    aiImportanceScore: 4,
    supplyChainPosition: "Midstream",
    coreProducts: [
      "伺服器電源（PSU、Power Shelf）",
      "工業、車用電源",
      "BBU、UPS 模組",
    ],
    whatTheyDo:
      "鴻海集團旗下電源廠，產品涵蓋 server PSU、Power Shelf、BBU；公司公開揭露 AI server 電源為主要成長動能。",
    aiRelevance:
      "AI server 電源主要供應商之一，並透過鴻海生態系切入 GB200 等 rack-scale 電源。",
    competitiveAdvantage: "鴻海集團整合資源；server 電源量產經驗。",
    competitors: ["Delta", "Lite-On", "Chicony Power"],
    risks: [
      "毛利率壓力",
      "客戶與鴻海整合策略影響",
    ],
    keyCustomersOrEcosystem:
      "公開資訊指其為部分 hyperscaler 與 GB200 平台之電源供應商；具體比重需查最新揭露。",
    technicalKeywords: ["PSU", "Power Shelf", "BBU"],
    tags: ["Power", "PSU", "BBU"],
    valuationSensitivity: ["hyperscalerDemand", "nvidiaCycle"],
    moat: { process: 2, ipDesign: 3, ecosystem: 4, customer: 4, manufacturing: 4, switching: 3 },
    risk: {
      nvidiaDependency: 3,
      memoryCycle: 1,
      chinaExport: 2,
      customerConc: 3,
      capexCycle: 4,
      valuation: 3,
      techTransition: 3,
    },
    analystView:
      "鴻海集團 AI server 整合中的電源拼圖；GB200 rack-scale 電源是觀察重點。",
    sourceUrls: [
      "https://www.acbel.com/",
      "https://mops.twse.com.tw/mops/web/t146sb05?TYPEK=sii&step=1&CO_ID=6282",
    ],
    confidenceLevel: "Medium",
    lastUpdated: STD_DATE,
    marketData: MD_TWD,
  },

  {
    id: "chicony",
    name: "群光電能 Chicony Power",
    nameEn: "Chicony Power Technology Co., Ltd.",
    ticker: "TWSE: 6412",
    market: "Taiwan",
    category: ["power-management"],
    aiImportanceScore: 3,
    supplyChainPosition: "Midstream",
    coreProducts: [
      "NB / consumer 電源",
      "伺服器電源",
      "車用電源、LED 電源",
    ],
    whatTheyDo:
      "群光集團旗下電源公司，產品涵蓋 NB / consumer / server 電源；近年公開揭露積極布局 server 與 AI 相關電源。",
    aiRelevance:
      "AI server 電源是新的成長動能，但純度低於 Delta / Lite-On / AcBel。",
    competitiveAdvantage:
      "群光集團通路與客戶基礎；NB 電源規模大。",
    competitors: ["Delta", "Lite-On", "AcBel"],
    risks: [
      "NB 電源週期",
      "AI server 電源市占仍待提升",
    ],
    keyCustomersOrEcosystem:
      "NB 與 consumer 電源客戶廣泛；server 電源客戶具體比重需查最新揭露。",
    technicalKeywords: ["PSU", "Adapter", "AI server PSU"],
    tags: ["Power", "PSU"],
    valuationSensitivity: ["pcCycle", "serverDemand"],
    moat: { process: 2, ipDesign: 2, ecosystem: 3, customer: 3, manufacturing: 4, switching: 2 },
    risk: {
      nvidiaDependency: 2,
      memoryCycle: 1,
      chinaExport: 2,
      customerConc: 2,
      capexCycle: 4,
      valuation: 2,
      techTransition: 3,
    },
    analystView:
      "AI 純度較低，是電源族群中比較邊緣的選擇；server 電源市占擴張是關鍵變數。",
    sourceUrls: [
      "https://www.chiconypower.com/",
      "https://mops.twse.com.tw/mops/web/t146sb05?TYPEK=sii&step=1&CO_ID=6412",
    ],
    confidenceLevel: "Medium",
    lastUpdated: STD_DATE,
    marketData: MD_TWD,
  },

  {
    id: "chroma",
    name: "致茂電子 Chroma ATE",
    nameEn: "Chroma ATE Inc.",
    ticker: "TWSE: 2360",
    market: "Taiwan",
    category: ["power-management", "foundry-equipment"],
    aiImportanceScore: 3,
    supplyChainPosition: "Upstream",
    coreProducts: [
      "電源測試系統（高電流、高功率）",
      "半導體測試介面、IC 測試（SoC）",
      "EV battery 測試、能源測試",
    ],
    whatTheyDo:
      "全球領先的電源測試與量測設備公司，產品涵蓋電源 supply 測試、SoC 測試、EV battery 測試；公司公開揭露 AI / EV 為主要成長動能。",
    aiRelevance:
      "AI 伺服器電源測試需求隨 rack power 上升而增加；SoC 測試介面與 burn-in 設備也受惠 AI ASIC ramp。",
    competitiveAdvantage:
      "電源量測產品線完整、客戶分散度高、跨業多元。",
    competitors: ["Keysight（量測）", "Advantest（IC 測試）", "Teradyne（IC 測試）"],
    risks: ["EV 業務週期", "客戶集中於部分大客戶"],
    keyCustomersOrEcosystem:
      "客戶涵蓋全球主要電源、IC、battery 業者；具體 AI 比重需查最新揭露。",
    technicalKeywords: ["Power testing", "ATE", "Burn-in", "EV battery test"],
    tags: ["Power Test", "ATE", "Equipment"],
    valuationSensitivity: ["capexCycle", "serverDemand"],
    moat: { process: 3, ipDesign: 4, ecosystem: 4, customer: 4, manufacturing: 3, switching: 4 },
    risk: {
      nvidiaDependency: 1,
      memoryCycle: 1,
      chinaExport: 2,
      customerConc: 2,
      capexCycle: 4,
      valuation: 3,
      techTransition: 2,
    },
    analystView:
      "AI 是間接題材（電源測試 + IC 測試介面）；產品線分散使其週期波動小於純設備廠。",
    sourceUrls: [
      "https://www.chromaate.com/",
      "https://mops.twse.com.tw/mops/web/t146sb05?TYPEK=sii&step=1&CO_ID=2360",
    ],
    confidenceLevel: "Medium",
    lastUpdated: STD_DATE,
    marketData: MD_TWD,
  },

  // ============================================================
  // 散熱與液冷
  // ============================================================
  {
    id: "avc",
    name: "雙鴻科技 Asia Vital Components (AVC)",
    nameEn: "Asia Vital Components Co., Ltd.",
    ticker: "TWSE: 3017",
    market: "Taiwan",
    category: ["thermal-cooling"],
    aiImportanceScore: 5,
    supplyChainPosition: "Midstream",
    coreProducts: [
      "Heat pipe、Vapor chamber",
      "Cold plate、CDU、manifold",
      "風扇、heatsink",
      "AI server 液冷整合方案",
    ],
    whatTheyDo:
      "台灣領先散熱模組廠之一，產品涵蓋 heat pipe、VC、cold plate 與液冷 CDU；公司公開揭露 AI server 液冷為核心成長動能。",
    aiRelevance:
      "GPU TDP 上升使液冷需求大增，AVC 是 Nvidia / hyperscaler AI server 液冷主要供應商之一。",
    competitiveAdvantage:
      "液冷產品線完整、量產 ramp 經驗領先；和多家 AI server ODM 緊密合作。",
    competitors: ["奇鋐 Auras", "建準 Sunon", "力致 Forcecon", "Vertiv（系統）"],
    risks: [
      "液冷滲透率短期變動",
      "客戶集中於少數 GPU 與系統業者",
      "與奇鋐市占競爭加劇",
    ],
    keyCustomersOrEcosystem:
      "公司公開揭露為 AI server 液冷主要供應商之一；具體客戶 / 比重需查最新揭露。",
    technicalKeywords: ["Cold plate", "CDU", "Manifold", "Vapor chamber", "Liquid cooling"],
    tags: ["Liquid Cooling", "Cold Plate", "CDU"],
    valuationSensitivity: ["nvidiaCycle", "hyperscalerDemand"],
    moat: { process: 3, ipDesign: 4, ecosystem: 4, customer: 4, manufacturing: 4, switching: 3 },
    risk: {
      nvidiaDependency: 4,
      memoryCycle: 1,
      chinaExport: 2,
      customerConc: 4,
      capexCycle: 4,
      valuation: 4,
      techTransition: 3,
    },
    analystView:
      "台股 AI 液冷雙雄之一；GB200 / B200 ramp 是直接 driver。",
    sourceUrls: [
      "https://www.avc.com.tw/",
      "https://mops.twse.com.tw/mops/web/t146sb05?TYPEK=sii&step=1&CO_ID=3017",
    ],
    confidenceLevel: "High",
    lastUpdated: STD_DATE,
    marketData: MD_TWD,
  },

  {
    id: "auras",
    name: "奇鋐科技 Auras",
    nameEn: "Auras Technology Co., Ltd.",
    ticker: "TWSE: 3324",
    market: "Taiwan",
    category: ["thermal-cooling"],
    aiImportanceScore: 5,
    supplyChainPosition: "Midstream",
    coreProducts: [
      "Heat pipe、Vapor chamber",
      "Cold plate、CDU、manifold",
      "風扇、heatsink",
      "AI server 液冷模組",
    ],
    whatTheyDo:
      "台灣領先散熱業者，產品涵蓋 heat pipe、VC、cold plate 與液冷整合；公司公開揭露 AI server 為主要成長動能。",
    aiRelevance:
      "AI GPU 液冷需求暴增，奇鋐與雙鴻共同分食大客戶訂單，是 AI server 液冷供應鏈關鍵。",
    competitiveAdvantage:
      "與多家 ODM / hyperscaler 緊密合作；產能擴張快、工程量產能力強。",
    competitors: ["雙鴻 AVC", "建準 Sunon", "Vertiv（系統級）"],
    risks: [
      "液冷滲透率波動",
      "客戶集中",
      "新進業者價格競爭",
    ],
    keyCustomersOrEcosystem:
      "公司公開揭露為 AI server 液冷主要供應商之一；具體客戶 / 比重需查最新揭露。",
    technicalKeywords: ["Cold plate", "CDU", "Vapor chamber", "Liquid cooling"],
    tags: ["Liquid Cooling", "Cold Plate", "CDU"],
    valuationSensitivity: ["nvidiaCycle", "hyperscalerDemand"],
    moat: { process: 3, ipDesign: 4, ecosystem: 4, customer: 4, manufacturing: 4, switching: 3 },
    risk: {
      nvidiaDependency: 4,
      memoryCycle: 1,
      chinaExport: 2,
      customerConc: 4,
      capexCycle: 4,
      valuation: 4,
      techTransition: 3,
    },
    analystView:
      "與雙鴻並列 AI 液冷雙雄；客戶 / 產品線分布略不同，是觀察的重要對照組。",
    sourceUrls: [
      "https://www.auras.com.tw/",
      "https://mops.twse.com.tw/mops/web/t146sb05?TYPEK=sii&step=1&CO_ID=3324",
    ],
    confidenceLevel: "High",
    lastUpdated: STD_DATE,
    marketData: MD_TWD,
  },

  {
    id: "sunon",
    name: "建準電機 Sunon",
    nameEn: "Sunonwealth Electric Machine Industry Co., Ltd.",
    ticker: "TWSE: 8008",
    market: "Taiwan",
    category: ["thermal-cooling"],
    aiImportanceScore: 3,
    supplyChainPosition: "Midstream",
    coreProducts: [
      "風扇（軸流、離心、磁浮）",
      "散熱模組",
      "車用、消費、家用風扇",
    ],
    whatTheyDo:
      "台灣大型風扇與散熱模組業者，產品涵蓋伺服器、車用、消費性電子；公司公開揭露 AI server 高速風扇為新成長動能。",
    aiRelevance:
      "AI server 即使導入液冷仍需要高靜壓 / 高 CFM 風扇配合，建準是主要風扇供應商之一。",
    competitiveAdvantage:
      "磁浮 / 高效率風扇技術；產品線完整。",
    competitors: ["Delta", "Nidec", "AVC（風扇）"],
    risks: [
      "風扇毛利率壓力",
      "客戶集中度",
    ],
    keyCustomersOrEcosystem:
      "客戶涵蓋 server OEM / ODM、car、家電；AI server 具體比重需查最新揭露。",
    technicalKeywords: ["Magnetic levitation fan", "Server fan", "High static pressure"],
    tags: ["Fan", "Cooling"],
    valuationSensitivity: ["serverDemand", "smartphoneCycle"],
    moat: { process: 2, ipDesign: 3, ecosystem: 3, customer: 3, manufacturing: 3, switching: 2 },
    risk: {
      nvidiaDependency: 2,
      memoryCycle: 1,
      chinaExport: 2,
      customerConc: 2,
      capexCycle: 3,
      valuation: 3,
      techTransition: 3,
    },
    analystView:
      "風扇族群的代表之一；AI 純度比 AVC/Auras 低，但風扇仍是必需品。",
    sourceUrls: [
      "https://www.sunon.com/",
      "https://mops.twse.com.tw/mops/web/t146sb05?TYPEK=sii&step=1&CO_ID=8008",
    ],
    confidenceLevel: "Medium",
    lastUpdated: STD_DATE,
    marketData: MD_TWD,
  },

  {
    id: "forcecon",
    name: "力致科技 Forcecon",
    nameEn: "Forcecon Technology Co., Ltd.",
    ticker: "TWSE: 3483",
    market: "Taiwan",
    category: ["thermal-cooling"],
    aiImportanceScore: 3,
    supplyChainPosition: "Midstream",
    coreProducts: ["Heat pipe", "Vapor chamber", "Heatsink", "Cold plate"],
    whatTheyDo:
      "中型散熱模組業者，產品線以 heat pipe、VC、heatsink、cold plate 為主；公司公開揭露 AI server 為新成長動能。",
    aiRelevance:
      "AI server 散熱模組（VC、cold plate）次級供應商，受惠液冷與風冷需求成長。",
    competitiveAdvantage: "中小型訂單彈性高、新產品開發速度快。",
    competitors: ["AVC", "Auras", "建準", "尼得科"],
    risks: ["客戶集中度", "與龍頭規模差距"],
    keyCustomersOrEcosystem:
      "客戶含 NB、server、consumer；AI server 具體比重需查最新揭露。",
    technicalKeywords: ["VC", "Heat pipe", "Cold plate"],
    tags: ["Cooling", "Cold Plate"],
    valuationSensitivity: ["serverDemand", "pcCycle"],
    moat: { process: 2, ipDesign: 2, ecosystem: 2, customer: 3, manufacturing: 3, switching: 2 },
    risk: {
      nvidiaDependency: 2,
      memoryCycle: 1,
      chinaExport: 2,
      customerConc: 3,
      capexCycle: 3,
      valuation: 3,
      techTransition: 3,
    },
    analystView:
      "散熱族群中相對小型的 player，是「龍頭外的二線供應商」題材。",
    sourceUrls: [
      "https://www.forcecon.com.tw/",
      "https://mops.twse.com.tw/mops/web/t146sb05?TYPEK=sii&step=1&CO_ID=3483",
    ],
    confidenceLevel: "Low",
    lastUpdated: STD_DATE,
    marketData: MD_TWD,
  },

  {
    id: "jentech",
    name: "健策精密 Jentech",
    nameEn: "Jentech Precision Industrial Co., Ltd.",
    ticker: "TWSE: 3653",
    market: "Taiwan",
    category: ["thermal-cooling", "power-management"],
    aiImportanceScore: 4,
    supplyChainPosition: "Midstream",
    coreProducts: [
      "金屬熱介面材料（heat spreader、IHS）",
      "Cold plate、liquid cooling 機構件",
      "電源 IC heat slug",
    ],
    whatTheyDo:
      "精密金屬機構件業者，產品涵蓋熱介面金屬件、heat spreader、cold plate 與電源 IC 散熱基板；公司公開揭露 AI / 電源相關金屬件為主要成長動能。",
    aiRelevance:
      "AI GPU / ASIC 大尺寸 IHS、Cold plate、Power IC heat slug 都是其產品；公開資訊指其供應多家 AI 加速器晶片業者。",
    competitiveAdvantage:
      "精密金屬加工 + 鍍層 + 量產能力；與晶片業者深度合作。",
    competitors: ["其他金屬熱機構件廠（如部分日系業者）"],
    risks: [
      "客戶集中度高",
      "單一晶片設計變更影響大",
    ],
    keyCustomersOrEcosystem:
      "公開資訊指其客戶包含 AI GPU / ASIC 業者；具體比重需查最新揭露。",
    technicalKeywords: ["IHS", "Heat spreader", "Cold plate", "Power IC heat slug"],
    tags: ["Heat Spreader", "Cooling", "Power"],
    valuationSensitivity: ["nvidiaCycle", "hyperscalerDemand"],
    moat: { process: 3, ipDesign: 3, ecosystem: 4, customer: 4, manufacturing: 4, switching: 3 },
    risk: {
      nvidiaDependency: 3,
      memoryCycle: 1,
      chinaExport: 2,
      customerConc: 4,
      capexCycle: 4,
      valuation: 4,
      techTransition: 3,
    },
    analystView:
      "「散熱 + 電源金屬件」雙重題材；公司規模較小但 AI 純度高。",
    sourceUrls: [
      "https://www.jentech.com.tw/",
      "https://mops.twse.com.tw/mops/web/t146sb05?TYPEK=sii&step=1&CO_ID=3653",
    ],
    confidenceLevel: "Medium",
    lastUpdated: STD_DATE,
    marketData: MD_TWD,
  },

  // ============================================================
  // 資料中心基礎建設（其他）
  // ============================================================
  {
    id: "ti",
    name: "德州儀器 Texas Instruments",
    nameEn: "Texas Instruments Incorporated",
    ticker: "NASDAQ: TXN",
    market: "US",
    category: ["power-management"],
    aiImportanceScore: 2,
    supplyChainPosition: "Midstream",
    coreProducts: [
      "類比 IC（電源管理、訊號鏈）",
      "嵌入式處理器",
      "PMIC for industrial / auto / data center",
    ],
    whatTheyDo:
      "全球最大類比 IC 公司之一，產品涵蓋電源管理、訊號鏈、嵌入式處理器，客戶分散度極高。",
    aiRelevance:
      "AI server 內有大量類比 / 電源 IC，TI 為次要受惠者；AI 純度低於 MPS。",
    competitiveAdvantage:
      "自有 12 吋類比晶圓廠規模、產品線最廣、長期客戶關係。",
    competitors: ["Analog Devices", "Infineon", "MPS", "ON Semi"],
    risks: ["車用、工業景氣循環", "AI 純度低"],
    keyCustomersOrEcosystem:
      "客戶涵蓋幾乎所有電子業者；具體 AI server 比重不易拆解。",
    technicalKeywords: ["PMIC", "Buck", "LDO", "Analog"],
    tags: ["Power IC", "Analog"],
    valuationSensitivity: ["smartphoneCycle", "serverDemand", "pcCycle"],
    moat: { process: 4, ipDesign: 4, ecosystem: 5, customer: 5, manufacturing: 5, switching: 3 },
    risk: {
      nvidiaDependency: 1,
      memoryCycle: 1,
      chinaExport: 2,
      customerConc: 2,
      capexCycle: 3,
      valuation: 3,
      techTransition: 2,
    },
    analystView:
      "AI 純度低；買的是長期防禦性類比 IC 故事。",
    sourceUrls: ["https://www.ti.com/", "https://investor.ti.com/"],
    confidenceLevel: "High",
    lastUpdated: STD_DATE,
    marketData: MD_USD,
  },

  {
    id: "schneider",
    name: "施耐德電氣 Schneider Electric",
    nameEn: "Schneider Electric SE",
    ticker: "EPA: SU",
    market: "Private",
    category: ["power-management", "data-center-infra"],
    aiImportanceScore: 4,
    supplyChainPosition: "Downstream",
    coreProducts: [
      "資料中心 UPS、PDU、冷卻、整機櫃方案（APC、EcoStruxure）",
      "建築、能源管理",
      "工業自動化",
    ],
    whatTheyDo:
      "全球大型電力與工業自動化集團，旗下 APC 是資料中心 UPS 主要品牌之一；公司公開揭露 AI 資料中心為主要成長動能。",
    aiRelevance:
      "AI 資料中心建設浪潮直接帶動 UPS、配電、冷卻、整機櫃需求；與 Vertiv、Eaton 構成三大供應商之一。",
    competitiveAdvantage:
      "品牌、全球服務、整合解決方案。",
    competitors: ["Vertiv", "Eaton", "ABB"],
    risks: ["建設節奏波動", "歐元匯率"],
    keyCustomersOrEcosystem: "全球 hyperscaler 與 colocation 客戶。",
    technicalKeywords: ["APC", "UPS", "PDU", "EcoStruxure"],
    tags: ["Power", "Data Center", "Cooling"],
    valuationSensitivity: ["hyperscalerDemand", "capexCycle"],
    moat: { process: 0, ipDesign: 3, ecosystem: 5, customer: 5, manufacturing: 4, switching: 4 },
    risk: {
      nvidiaDependency: 2,
      memoryCycle: 1,
      chinaExport: 2,
      customerConc: 3,
      capexCycle: 4,
      valuation: 3,
      techTransition: 3,
    },
    analystView:
      "在歐洲上市，非台股 / 美股投資人主流選擇；列入此網站作為產業比較參考。",
    sourceUrls: ["https://www.se.com/", "https://www.se.com/ww/en/about-us/investor-relations/"],
    confidenceLevel: "Medium",
    lastUpdated: STD_DATE,
  },

  // ============================================================
  // 補加：第一波被遺漏但很關鍵的公司
  // ============================================================
  {
    id: "aspeed",
    name: "信驊科技 Aspeed",
    nameEn: "ASPEED Technology Inc.",
    ticker: "TWSE: 5274",
    market: "Taiwan",
    category: ["ai-server-odm"],
    aiImportanceScore: 4,
    supplyChainPosition: "Midstream",
    coreProducts: [
      "BMC（Baseboard Management Controller）系列 SoC",
      "AST2600、AST2700 server BMC",
      "Cupola360 全景視訊處理器",
    ],
    whatTheyDo:
      "全球 server BMC 晶片市占第一的設計公司，幾乎所有 Intel Xeon / AMD EPYC 平台 + AI server 都需要其 BMC SoC 進行遠端管理與監控。",
    aiRelevance:
      "每張 AI server 主機板都需要一顆 BMC；AI server 出貨增加直接帶動 ASIC 出貨，且高階 AI server BMC 規格（含 PCIe Gen5、DDR5 介面）會升級。",
    competitiveAdvantage:
      "Server BMC 市占接近獨佔（市場估約 70%+），與 Intel / AMD CPU 平台深度綁定；切換成本極高。",
    competitors: ["Nuvoton（部分）", "OpenBMC 開源方案", "客戶 in-house（少數 hyperscaler）"],
    risks: [
      "客戶集中於少數 server OEM/ODM",
      "Hyperscaler 自研 BMC 風險",
      "估值偏高",
    ],
    keyCustomersOrEcosystem:
      "幾乎所有伺服器 OEM/ODM（Dell、HPE、Lenovo、鴻海、廣達、緯創、Wiwynn）皆採用；公開資訊指 hyperscaler 亦廣泛採用。",
    technicalKeywords: ["BMC", "AST2600", "AST2700", "Server management", "IPMI", "Redfish"],
    tags: ["BMC", "Server SoC", "AI Server"],
    valuationSensitivity: ["serverDemand", "hyperscalerDemand", "nvidiaCycle"],
    moat: { process: 3, ipDesign: 4, ecosystem: 5, customer: 5, manufacturing: 0, switching: 5 },
    risk: {
      nvidiaDependency: 2,
      memoryCycle: 1,
      chinaExport: 2,
      customerConc: 3,
      capexCycle: 3,
      valuation: 4,
      techTransition: 2,
    },
    analystView:
      "AI server 出貨直接受惠的「沉默王者」；近乎獨佔的 server BMC 是高品質的純題材，但估值已反映此優勢。",
    serdesAngle:
      "AST2700 開始支援 PCIe Gen5、DDR5、USB 3.2 等高速介面，是 SerDes IP 在 server 周邊管理晶片的具體應用。",
    sourceUrls: [
      "https://www.aspeedtech.com/",
      "https://mops.twse.com.tw/mops/web/t146sb05?TYPEK=sii&step=1&CO_ID=5274",
    ],
    confidenceLevel: "High",
    lastUpdated: STD_DATE,
    marketData: MD_TWD,
  },

  {
    id: "ibiden",
    name: "Ibiden 揖斐電",
    nameEn: "Ibiden Co., Ltd.",
    ticker: "TYO: 4062",
    market: "Private",
    category: ["advanced-packaging"],
    aiImportanceScore: 5,
    supplyChainPosition: "Upstream",
    coreProducts: [
      "ABF 載板（IC substrate）— 公認的世界第一",
      "FC-BGA 大尺寸載板",
      "陶瓷基板、廢氣處理元件（非半導體）",
    ],
    whatTheyDo:
      "日本電子材料公司，是全球最大 ABF 載板供應商，公認的台積電 CoWoS 與 Nvidia / Intel 高階 CPU/GPU 載板的關鍵供應方。",
    aiRelevance:
      "Nvidia AI GPU、Intel CPU 都仰賴 ABF 載板；Ibiden 為 TSMC CoWoS-S/L 大尺寸 interposer 載板的核心供應方。",
    competitiveAdvantage:
      "ABF 載板良率、可靠度長期領先；與台積電與大客戶綁定深；大尺寸載板技術獨佔性高。",
    competitors: ["Shinko Electric", "欣興 Unimicron", "南電 Nan Ya PCB"],
    risks: [
      "ABF 產能 2022-2023 擴張過快，價格曾承壓",
      "客戶集中於少數高階 CPU/GPU",
      "日股市場流動性、匯率波動",
    ],
    keyCustomersOrEcosystem:
      "Intel、Nvidia、AMD 等高階載板長期供應方；TSMC CoWoS 大尺寸載板核心夥伴。",
    technicalKeywords: ["ABF substrate", "FC-BGA", "Large body BGA", "CoWoS substrate"],
    tags: ["ABF", "Substrate", "CoWoS"],
    valuationSensitivity: ["serverDemand", "pcCycle", "hyperscalerDemand"],
    moat: { process: 4, ipDesign: 4, ecosystem: 5, customer: 5, manufacturing: 5, switching: 4 },
    risk: {
      nvidiaDependency: 3,
      memoryCycle: 1,
      chinaExport: 2,
      customerConc: 3,
      capexCycle: 5,
      valuation: 3,
      techTransition: 3,
    },
    analystView:
      "ABF 全球龍頭、CoWoS 載板關鍵節點；非台美投資人主流標的（日股），但供應鏈不可或缺。",
    sourceUrls: ["https://www.ibiden.com/", "https://www.ibiden.com/ir/"],
    confidenceLevel: "Medium",
    lastUpdated: STD_DATE,
  },

  {
    id: "advantest",
    name: "Advantest 愛德萬",
    nameEn: "Advantest Corporation",
    ticker: "TYO: 6857",
    market: "Private",
    category: ["foundry-equipment", "memory-hbm"],
    aiImportanceScore: 5,
    supplyChainPosition: "Upstream",
    coreProducts: [
      "SoC ATE（測試機）— V93000 系列",
      "Memory ATE — T5503HS（HBM 專用）等",
      "光學 / inspection 設備",
    ],
    whatTheyDo:
      "全球領先的半導體測試機（ATE）供應商；公認的 HBM 測試與 AI ASIC（如 Nvidia GPU）測試機主要供應方，與 Teradyne 並列雙巨頭。",
    aiRelevance:
      "AI ASIC、HBM 測試需求暴增，Advantest 在 HBM3E / HBM4 stack test 的 V93000 / T5503 是事實標準；Nvidia / TSMC / SK Hynix / Samsung 都採購其設備。",
    competitiveAdvantage:
      "HBM 測試機近獨佔；SoC ATE 與 Teradyne 雙寡占；客戶切換成本極高。",
    competitors: ["Teradyne", "Cohu"],
    risks: [
      "客戶 capex 週期",
      "中國市場限制",
      "韓國 / 台灣記憶體大廠擴產節奏",
    ],
    keyCustomersOrEcosystem:
      "Nvidia、TSMC、京元電子、SK Hynix、Samsung、Micron 為公開揭露之主要客戶族群。",
    technicalKeywords: ["ATE", "SoC test", "Memory test", "HBM test", "V93000"],
    tags: ["ATE", "HBM Test", "Equipment"],
    valuationSensitivity: ["nvidiaCycle", "memoryCycle", "hyperscalerDemand"],
    moat: { process: 4, ipDesign: 5, ecosystem: 5, customer: 5, manufacturing: 4, switching: 5 },
    risk: {
      nvidiaDependency: 3,
      memoryCycle: 4,
      chinaExport: 3,
      customerConc: 3,
      capexCycle: 4,
      valuation: 4,
      techTransition: 2,
    },
    analystView:
      "HBM 與 AI ASIC 測試的關鍵節點；測試機需求隨 HBM stack 層數與 die 複雜度上升而結構性擴張。日股流動性需注意。",
    sourceUrls: ["https://www.advantest.com/", "https://www.advantest.com/ir"],
    confidenceLevel: "High",
    lastUpdated: STD_DATE,
  },

  {
    id: "tel",
    name: "Tokyo Electron 東京威力科創",
    nameEn: "Tokyo Electron Ltd.",
    ticker: "TYO: 8035",
    market: "Private",
    category: ["foundry-equipment"],
    aiImportanceScore: 4,
    supplyChainPosition: "Upstream",
    coreProducts: [
      "塗佈 / 顯影設備（Coater / Developer）— EUV 配套近獨佔",
      "蝕刻、沉積（CVD / ALD）",
      "清洗、wafer bonder",
    ],
    whatTheyDo:
      "全球第三大半導體設備公司，與 ASML、AMAT、Lam、KLA 並列五大；在 EUV 配套的塗佈/顯影設備市占近獨佔。",
    aiRelevance:
      "AI 晶片需要先進製程，先進製程需要 EUV，EUV 需要 TEL 的 coater/developer。間接但關鍵的瓶頸。",
    competitiveAdvantage:
      "EUV 塗佈/顯影設備近獨佔；wafer bonder（hybrid bonding）在 3D 封裝技術領先。",
    competitors: ["Applied Materials", "Lam Research", "Screen", "Hitachi High-Tech"],
    risks: [
      "中國市場限制",
      "客戶 capex 週期",
    ],
    keyCustomersOrEcosystem:
      "TSMC、Samsung、Intel、SK Hynix、Micron、Kioxia 為主要客戶。",
    technicalKeywords: ["EUV coater", "Developer", "Etch", "ALD", "Hybrid bonding"],
    tags: ["Equipment", "EUV", "Hybrid Bonding"],
    valuationSensitivity: ["capexCycle", "memoryCycle", "hyperscalerDemand"],
    moat: { process: 5, ipDesign: 4, ecosystem: 5, customer: 5, manufacturing: 4, switching: 4 },
    risk: {
      nvidiaDependency: 1,
      memoryCycle: 4,
      chinaExport: 4,
      customerConc: 3,
      capexCycle: 5,
      valuation: 3,
      techTransition: 2,
    },
    analystView:
      "AI capex 結構性受惠；hybrid bonding 設備是長期 3D 封裝題材。日股流動性需注意。",
    sourceUrls: ["https://www.tel.com/", "https://www.tel.com/ir/"],
    confidenceLevel: "High",
    lastUpdated: STD_DATE,
  },

  {
    id: "disco",
    name: "Disco 迪斯科",
    nameEn: "Disco Corporation",
    ticker: "TYO: 6146",
    market: "Private",
    category: ["foundry-equipment", "advanced-packaging"],
    aiImportanceScore: 4,
    supplyChainPosition: "Upstream",
    coreProducts: [
      "Precision dicing 切割設備（near-monopoly）",
      "Grinding 研磨設備",
      "Polishing 拋光設備",
    ],
    whatTheyDo:
      "全球精密切割 / 研磨設備市占接近獨佔的日本公司；HBM TSV、chiplet 切割、晶圓薄化等先進封裝製程的關鍵設備供應商。",
    aiRelevance:
      "HBM 堆疊需要極薄 die（透過 grinding），且 chiplet / 2.5D 封裝需要精密切割 — Disco 設備是隱性瓶頸。",
    competitiveAdvantage:
      "Dicing / grinding 市占近獨佔；客戶切換成本高（製程整合深）。",
    competitors: ["Accretech", "Lapmaster"],
    risks: [
      "客戶 capex 週期",
      "中國市場限制",
    ],
    keyCustomersOrEcosystem:
      "全球主要 IDM / foundry / OSAT 皆使用其設備。",
    technicalKeywords: ["Dicing", "Grinding", "Wafer thinning", "HBM stack"],
    tags: ["Equipment", "Dicing", "Wafer Thinning"],
    valuationSensitivity: ["memoryCycle", "capexCycle"],
    moat: { process: 5, ipDesign: 4, ecosystem: 5, customer: 5, manufacturing: 4, switching: 5 },
    risk: {
      nvidiaDependency: 2,
      memoryCycle: 4,
      chinaExport: 3,
      customerConc: 3,
      capexCycle: 5,
      valuation: 3,
      techTransition: 2,
    },
    analystView:
      "HBM 堆疊與 chiplet 趨勢的隱性受惠者；日股流動性需注意。",
    sourceUrls: ["https://www.disco.co.jp/eg/", "https://www.disco.co.jp/eg/ir/"],
    confidenceLevel: "Medium",
    lastUpdated: STD_DATE,
  },

  {
    id: "shinko",
    name: "Shinko Electric 新光電工",
    nameEn: "Shinko Electric Industries Co., Ltd.",
    ticker: "TYO: 6967",
    market: "Private",
    category: ["advanced-packaging"],
    aiImportanceScore: 4,
    supplyChainPosition: "Upstream",
    coreProducts: [
      "ABF 載板 — 與 Ibiden、欣興 並列全球前三",
      "BGA、CSP、Leadframe",
    ],
    whatTheyDo:
      "日本大型 IC 載板與封裝材料公司，是全球前三大 ABF 載板供應商，與 Ibiden、欣興分食高階 AI / HPC 載板市場。",
    aiRelevance:
      "與 Ibiden 共同供應 AI GPU / HPC CPU 之高階 ABF 載板。",
    competitiveAdvantage: "ABF 技術成熟、客戶結構分散。",
    competitors: ["Ibiden", "欣興", "南電"],
    risks: ["ABF 價格週期", "客戶集中"],
    keyCustomersOrEcosystem: "Intel、Nvidia、AMD 等高階客戶；具體比重需查證。",
    technicalKeywords: ["ABF substrate", "FC-BGA", "Leadframe"],
    tags: ["ABF", "Substrate"],
    valuationSensitivity: ["serverDemand", "pcCycle"],
    moat: { process: 4, ipDesign: 4, ecosystem: 5, customer: 4, manufacturing: 4, switching: 4 },
    risk: {
      nvidiaDependency: 2,
      memoryCycle: 1,
      chinaExport: 2,
      customerConc: 3,
      capexCycle: 5,
      valuation: 2,
      techTransition: 3,
    },
    analystView:
      "ABF 三巨頭之一；日股流動性需注意，2024 年 JIC 收購案後上市狀態變動，需獨立查證最新交易狀態。",
    sourceUrls: ["https://www.shinko.co.jp/", "https://www.shinko.co.jp/english/ir/"],
    confidenceLevel: "Low",
    lastUpdated: STD_DATE,
  },

  {
    id: "cadence",
    name: "Cadence Design Systems",
    nameEn: "Cadence Design Systems, Inc.",
    ticker: "NASDAQ: CDNS",
    market: "US",
    category: ["high-speed-interface", "ai-compute"],
    aiImportanceScore: 4,
    supplyChainPosition: "Upstream",
    coreProducts: [
      "EDA 工具（Innovus、Genus、Virtuoso、Xcelium、JasperGold）",
      "高速介面 IP（PCIe、CXL、DDR/HBM、112G/224G PHY、UCIe）",
      "Palladium / Protium emulation 與 prototyping",
      "Tensilica AI / DSP IP",
    ],
    whatTheyDo:
      "全球 EDA 雙雄之一（與 Synopsys 並列），同時擁有完整 silicon IP 組合，是 AI ASIC、GPU、CPU 設計的關鍵工具與 IP 供應商。",
    aiRelevance:
      "AI ASIC 委外設計潮（如 Alchip、GUC 等）、hyperscaler 自研晶片皆使用 Cadence 工具與 IP；其 emulation 平台（Palladium）是大型 SoC 驗證的事實標準之一。",
    competitiveAdvantage:
      "EDA + IP + Emulation 三引擎；客戶切換成本極高。",
    competitors: ["Synopsys", "Siemens EDA"],
    risks: ["中國市場業務限制", "客戶 capex 週期", "估值偏高"],
    keyCustomersOrEcosystem:
      "所有主要 IC 設計公司、IDM、ASIC 設計服務業者皆為客戶。",
    technicalKeywords: ["EDA", "IP", "224G PHY", "PCIe", "CXL", "HBM", "UCIe", "Palladium"],
    tags: ["EDA", "SerDes IP", "HBM PHY", "Emulation"],
    valuationSensitivity: ["capexCycle", "hyperscalerDemand"],
    moat: { process: 4, ipDesign: 5, ecosystem: 5, customer: 5, manufacturing: 0, switching: 5 },
    risk: {
      nvidiaDependency: 1,
      memoryCycle: 1,
      chinaExport: 4,
      customerConc: 2,
      capexCycle: 2,
      valuation: 4,
      techTransition: 2,
    },
    analystView:
      "與 Synopsys 並列「賣鏟子」雙雄；AI ASIC 投入越多越受惠。",
    serdesAngle:
      "Cadence 224G PHY 也已在 TSMC N3 矽驗證；與 Synopsys 競爭最高階 SerDes IP 授權。",
    sourceUrls: ["https://www.cadence.com/", "https://investor.cadence.com/"],
    confidenceLevel: "High",
    lastUpdated: STD_DATE,
    marketData: MD_USD,
  },

  {
    id: "camtek",
    name: "Camtek",
    nameEn: "Camtek Ltd.",
    ticker: "NASDAQ: CAMT",
    market: "US",
    category: ["foundry-equipment", "advanced-packaging"],
    aiImportanceScore: 4,
    supplyChainPosition: "Upstream",
    coreProducts: [
      "Eagle 系列 inspection / metrology 設備",
      "HBM bump / TSV inspection",
      "Advanced packaging 量測",
    ],
    whatTheyDo:
      "以色列檢測設備公司，聚焦先進封裝與 HBM 的 bump / TSV / interposer inspection；公認的 HBM stack 檢測關鍵設備供應商。",
    aiRelevance:
      "HBM3E / HBM4 stack 對 bump 與 TSV 檢測需求暴增；Camtek 是少數能對應的供應商。",
    competitiveAdvantage:
      "HBM bump inspection 領先；公司公開揭露 HPC / AI 為主要成長動能。",
    competitors: ["Onto Innovation", "Rudolph", "KLA（部分重疊）"],
    risks: [
      "客戶高度集中於少數記憶體 + OSAT 業者",
      "ASML / KLA 等大廠跨入先進封裝檢測競爭",
    ],
    keyCustomersOrEcosystem:
      "公司公開揭露 HBM 三巨頭與主要 OSAT 為客戶；具體比重請查最新揭露。",
    technicalKeywords: ["Bump inspection", "TSV", "Advanced packaging metrology", "HBM"],
    tags: ["Inspection", "HBM", "Advanced Packaging"],
    valuationSensitivity: ["memoryCycle", "capexCycle", "hyperscalerDemand"],
    moat: { process: 4, ipDesign: 4, ecosystem: 4, customer: 4, manufacturing: 3, switching: 4 },
    risk: {
      nvidiaDependency: 3,
      memoryCycle: 4,
      chinaExport: 3,
      customerConc: 4,
      capexCycle: 5,
      valuation: 4,
      techTransition: 3,
    },
    analystView:
      "HBM + 先進封裝 inspection 純題材；客戶集中度與估值是觀察重點。",
    sourceUrls: ["https://www.camtek.com/", "https://www.camtek.com/investors"],
    confidenceLevel: "High",
    lastUpdated: STD_DATE,
    marketData: MD_USD,
  },

  // ============================================================
  // 第二波補加：HBM 量測、PAM4 DSP、SiC 電源、光元件 epi、storage、IP
  // ============================================================
  {
    id: "onto",
    name: "Onto Innovation",
    nameEn: "Onto Innovation Inc.",
    ticker: "NYSE: ONTO",
    market: "US",
    category: ["foundry-equipment", "advanced-packaging"],
    aiImportanceScore: 4,
    supplyChainPosition: "Upstream",
    coreProducts: [
      "光學檢測（macro/micro inspection）",
      "HBM bump / TSV inspection",
      "Lithography 量測（套刻、薄膜厚度）",
      "Process control software",
    ],
    whatTheyDo:
      "美國半導體製程控制 / 檢測設備公司，與 Camtek 並列 HBM bump + advanced packaging inspection 領先供應商；2019 由 Rudolph + Nanometrics 合併而成。",
    aiRelevance:
      "HBM3E / HBM4 與 chiplet 封裝對 bump、TSV、interposer 檢測需求暴增，Onto 為主要受惠者；公司公開揭露 HPC / AI 為核心成長動能。",
    competitiveAdvantage:
      "HBM + advanced packaging inspection 雙寡占之一；與大客戶（記憶體 + OSAT）長期合作。",
    competitors: ["Camtek", "KLA（部分）", "Hitachi High-Tech"],
    risks: [
      "客戶集中於少數 HBM + OSAT 業者",
      "Camtek 競爭加劇",
      "估值偏高",
    ],
    keyCustomersOrEcosystem:
      "HBM 三巨頭 + 主要 OSAT 與 logic foundry 為公開揭露之客戶群。",
    technicalKeywords: ["Bump inspection", "TSV", "Macro inspection", "Process control", "HBM"],
    tags: ["Inspection", "HBM", "Advanced Packaging"],
    valuationSensitivity: ["memoryCycle", "capexCycle", "hyperscalerDemand"],
    moat: { process: 4, ipDesign: 4, ecosystem: 4, customer: 4, manufacturing: 3, switching: 4 },
    risk: {
      nvidiaDependency: 3,
      memoryCycle: 4,
      chinaExport: 3,
      customerConc: 4,
      capexCycle: 5,
      valuation: 4,
      techTransition: 3,
    },
    analystView: "與 Camtek 雙寡占 HBM bump 檢測；同樣是 HBM 量擴題材的直接受惠者。",
    sourceUrls: ["https://ontoinnovation.com/", "https://investors.ontoinnovation.com/"],
    confidenceLevel: "High",
    lastUpdated: STD_DATE,
    marketData: MD_USD,
  },

  {
    id: "maxlinear",
    name: "MaxLinear",
    nameEn: "MaxLinear, Inc.",
    ticker: "NASDAQ: MXL",
    market: "US",
    category: ["high-speed-interface", "optical-communication"],
    aiImportanceScore: 3,
    supplyChainPosition: "Midstream",
    coreProducts: [
      "高速 SerDes IC（含 PAM4）",
      "光通訊 DSP",
      "Ethernet PHY / 廣播解調 IC",
      "電源管理 IC",
    ],
    whatTheyDo:
      "美國中型 mixed-signal IC 設計公司，產品涵蓋光通訊 PAM4 DSP、Ethernet PHY、廣播解調 IC；近年積極轉型至資料中心應用。",
    aiRelevance:
      "PAM4 DSP 與 Ethernet PHY 是 800G 升級的次級競爭者；產品已用於部分光模組與 AEC。",
    competitiveAdvantage: "Mixed-signal 設計能力多元、價格較具競爭性。",
    competitors: ["Marvell", "Broadcom", "Credo"],
    risks: [
      "在 PAM4 主戰場與 Marvell / Broadcom 競爭吃力",
      "廣播 / 通訊業務週期下行",
      "規模偏小、毛利率壓力",
    ],
    keyCustomersOrEcosystem:
      "光模組製造商、企業網路設備客戶；具體 AI 比重需個別查證。",
    technicalKeywords: ["PAM4 DSP", "Ethernet PHY", "SerDes", "Mixed-signal"],
    tags: ["Optical DSP", "PHY", "SerDes"],
    valuationSensitivity: ["hyperscalerDemand", "telecomCycle"],
    moat: { process: 3, ipDesign: 4, ecosystem: 3, customer: 3, manufacturing: 0, switching: 3 },
    risk: {
      nvidiaDependency: 2,
      memoryCycle: 1,
      chinaExport: 3,
      customerConc: 3,
      capexCycle: 3,
      valuation: 3,
      techTransition: 4,
    },
    analystView:
      "在 PAM4 DSP 與 Marvell、Broadcom 同台競爭較吃力；近年股價疲弱，是 turnaround 型題材。",
    serdesAngle: "光模組客戶採用 MaxLinear DSP 主要是價格與替代來源考量；技術領先未及 Marvell。",
    sourceUrls: ["https://www.maxlinear.com/", "https://investors.maxlinear.com/"],
    confidenceLevel: "Medium",
    lastUpdated: STD_DATE,
    marketData: MD_USD,
  },

  {
    id: "wolfspeed",
    name: "Wolfspeed",
    nameEn: "Wolfspeed, Inc.",
    ticker: "NYSE: WOLF",
    market: "US",
    category: ["power-management", "foundry-equipment"],
    aiImportanceScore: 3,
    supplyChainPosition: "Upstream",
    coreProducts: [
      "SiC（碳化矽）晶圓",
      "SiC MOSFET 元件",
      "SiC 模組（電動車、工業、資料中心）",
    ],
    whatTheyDo:
      "全球 SiC 材料與元件領導者（前身為 Cree LED）；2024-2025 經歷財務重整，但 SiC 對下一代資料中心高效率電源（800V DC）仍是關鍵材料。",
    aiRelevance:
      "AI rack 800V/HVDC 電源轉換需要高效率 power semis，SiC 是其中關鍵；但短期 AI 受惠不如 GaN / Si 直接，需 3-5 年才能看到主流採用。",
    competitiveAdvantage:
      "SiC 晶圓 / 元件垂直整合度高；長期專利與技術積累。",
    competitors: ["Infineon（SiC）", "STMicro（SiC）", "Onsemi（SiC）", "Coherent（SiC 晶圓）"],
    risks: [
      "電動車需求下修導致主業疲弱",
      "財務狀況疲軟（2024 大幅虧損）",
      "AI 資料中心 SiC 採用時程仍長",
    ],
    keyCustomersOrEcosystem:
      "汽車（電動車）為主要客戶；資料中心 SiC 業務仍在初期。",
    technicalKeywords: ["SiC", "MOSFET", "HVDC", "Power semiconductor"],
    tags: ["SiC", "Power", "Wide Bandgap"],
    valuationSensitivity: ["capexCycle", "smartphoneCycle"],
    moat: { process: 4, ipDesign: 4, ecosystem: 3, customer: 3, manufacturing: 4, switching: 3 },
    risk: {
      nvidiaDependency: 1,
      memoryCycle: 1,
      chinaExport: 3,
      customerConc: 3,
      capexCycle: 5,
      valuation: 5,
      techTransition: 4,
    },
    analystView:
      "高 beta turnaround 題材；AI 是長期 optionality，短期主要看電動車 SiC 需求與財務改善。",
    sourceUrls: ["https://www.wolfspeed.com/", "https://investor.wolfspeed.com/"],
    confidenceLevel: "Medium",
    lastUpdated: STD_DATE,
    marketData: MD_USD,
  },

  {
    id: "landmark",
    name: "聯亞光電 LandMark Optoelectronics",
    nameEn: "LandMark Optoelectronics Corp.",
    ticker: "TWSE: 3081",
    market: "Taiwan",
    category: ["optical-communication"],
    aiImportanceScore: 4,
    supplyChainPosition: "Upstream",
    coreProducts: [
      "InP / GaAs epi wafer（VCSEL / EML / PIN diode 用基板）",
      "資料中心光通訊用 epi",
      "PD / APD 元件",
    ],
    whatTheyDo:
      "台灣化合物半導體 epi wafer 領先廠商；產品供應給雷射 / 光元件廠用於 100G、400G、800G 光模組。",
    aiRelevance:
      "800G / 1.6T 光模組需求暴增直接帶動 EML / VCSEL epi 需求；聯亞為 EML epi 主要供應商之一。",
    competitiveAdvantage:
      "InP / GaAs epi 製程 know-how；與光元件大廠長期合作。",
    competitors: ["Sumitomo（日）", "IQE（英）", "Allos Semi（德）"],
    risks: [
      "客戶集中於少數光元件業者",
      "規模較小",
      "光通訊技術典範轉換（CPO / 矽光子）長期影響需觀察",
    ],
    keyCustomersOrEcosystem:
      "公司公開揭露主要客戶為光元件與光模組製造商；具體比重需查證。",
    technicalKeywords: ["InP", "GaAs", "EML epi", "VCSEL epi", "PIN diode"],
    tags: ["Epi Wafer", "EML", "VCSEL", "Silicon Photonics"],
    valuationSensitivity: ["hyperscalerDemand", "capexCycle"],
    moat: { process: 4, ipDesign: 3, ecosystem: 3, customer: 4, manufacturing: 3, switching: 3 },
    risk: {
      nvidiaDependency: 3,
      memoryCycle: 1,
      chinaExport: 3,
      customerConc: 4,
      capexCycle: 4,
      valuation: 4,
      techTransition: 4,
    },
    analystView:
      "AI 光通訊「上游 epi」純題材；客戶集中度與光通訊技術轉換是兩大變數。",
    serdesAngle: "EML epi 品質直接影響光模組 BER 與 reach；對 800G/1.6T 模組良率影響大。",
    sourceUrls: ["https://www.lmoc.com.tw/", "https://mops.twse.com.tw/"],
    confidenceLevel: "Medium",
    lastUpdated: STD_DATE,
    marketData: MD_TWD,
  },

  {
    id: "winsemi",
    name: "穩懋 WIN Semiconductors",
    nameEn: "WIN Semiconductors Corp.",
    ticker: "TPEx: 3105",
    market: "Taiwan",
    category: ["optical-communication", "foundry-equipment"],
    aiImportanceScore: 3,
    supplyChainPosition: "Upstream",
    coreProducts: [
      "GaAs 化合物半導體晶圓代工",
      "RF PA、switch、VCSEL 代工",
      "光通訊 / 5G / Wi-Fi 6E 元件代工",
    ],
    whatTheyDo:
      "全球最大 GaAs 化合物半導體晶圓代工廠；主力為手機 RF PA，但同時為光通訊 VCSEL / DML 提供代工服務。",
    aiRelevance:
      "光通訊雷射元件代工是 AI 相關業務（VCSEL for 短距、DML 部分），但主力仍是手機 PA，AI 純度中等。",
    competitiveAdvantage:
      "GaAs 代工全球市占第一，技術成熟、規模大。",
    competitors: ["AWSC 全新光電", "Sumitomo Electric"],
    risks: [
      "手機 PA 週期下行",
      "中國 GaAs 自製比例上升",
      "AI 光通訊代工比重仍低",
    ],
    keyCustomersOrEcosystem:
      "客戶涵蓋 Skyworks、Qorvo、博通、光元件業者等；具體 AI 比重需查證。",
    technicalKeywords: ["GaAs", "VCSEL", "DML", "PA", "Compound semi foundry"],
    tags: ["GaAs", "VCSEL", "Compound Semi"],
    valuationSensitivity: ["smartphoneCycle", "telecomCycle", "hyperscalerDemand"],
    moat: { process: 4, ipDesign: 3, ecosystem: 4, customer: 4, manufacturing: 4, switching: 4 },
    risk: {
      nvidiaDependency: 1,
      memoryCycle: 1,
      chinaExport: 4,
      customerConc: 3,
      capexCycle: 4,
      valuation: 3,
      techTransition: 3,
    },
    analystView:
      "AI 純度低，主業為手機 PA；光通訊代工是新成長動能但比重仍小。",
    sourceUrls: ["https://www.winfoundry.com/", "https://mops.twse.com.tw/"],
    confidenceLevel: "Medium",
    lastUpdated: STD_DATE,
    marketData: MD_TWD,
  },

  {
    id: "andes",
    name: "晶心科 Andes Technology",
    nameEn: "Andes Technology Corporation",
    ticker: "TPEx: 6533",
    market: "Taiwan",
    category: ["ai-compute", "high-speed-interface"],
    aiImportanceScore: 3,
    supplyChainPosition: "Upstream",
    coreProducts: [
      "RISC-V CPU IP（V5 系列）",
      "AI 加速器 IP（含 vector extension）",
      "Audio / 信號處理 DSP IP",
    ],
    whatTheyDo:
      "亞洲最大 RISC-V CPU IP 公司，提供 RISC-V 核心 + 工具鏈授權給 IoT / SoC / AI 加速器設計商；近年積極推出 AI 加速 IP。",
    aiRelevance:
      "RISC-V 是 AI ASIC 自研時的開源替代方案；Andes IP 已被多家 AI 新創與汽車晶片公司採用。",
    competitiveAdvantage:
      "亞洲 RISC-V IP 領先廠商；中文文件 + 在地支援是中國 / 台灣客戶優勢。",
    competitors: ["ARM", "SiFive（美國 RISC-V IP）", "MIPS（Imagination）"],
    risks: [
      "與 ARM 競爭龐大",
      "RISC-V 生態仍在發展",
      "客戶 ramp-up 慢",
    ],
    keyCustomersOrEcosystem:
      "客戶分布廣，包含台、中、日 IC 設計與 AI 新創；具體 AI 客戶身分需查證。",
    technicalKeywords: ["RISC-V", "CPU IP", "Vector extension", "AI accelerator IP"],
    tags: ["RISC-V", "IP", "AI Accelerator IP"],
    valuationSensitivity: ["capexCycle", "smartphoneCycle"],
    moat: { process: 0, ipDesign: 4, ecosystem: 3, customer: 3, manufacturing: 0, switching: 3 },
    risk: {
      nvidiaDependency: 1,
      memoryCycle: 1,
      chinaExport: 4,
      customerConc: 3,
      capexCycle: 3,
      valuation: 3,
      techTransition: 3,
    },
    analystView:
      "AI ASIC 自研潮的長期受惠者，但與 ARM 規模差距大；中國市場是雙面刃。",
    sourceUrls: ["https://www.andestech.com/", "https://mops.twse.com.tw/"],
    confidenceLevel: "Medium",
    lastUpdated: STD_DATE,
    marketData: MD_TWD,
  },

  {
    id: "ememory",
    name: "力旺 eMemory",
    nameEn: "eMemory Technology Inc.",
    ticker: "TPEx: 3529",
    market: "Taiwan",
    category: ["high-speed-interface", "foundry-equipment"],
    aiImportanceScore: 3,
    supplyChainPosition: "Upstream",
    coreProducts: [
      "NeoBit、NeoFuse、NeoPUF 嵌入式非揮發記憶體 IP",
      "Logic NVM IP（在 logic 製程中內嵌記憶體）",
      "安全與認證 IP（PUF-based）",
    ],
    whatTheyDo:
      "全球領先 logic-process NVM IP 公司，IP 授權收入 + 量產權利金為主要營收；幾乎所有 logic 製程晶片需要安全認證或一次性編程記憶體都會用到。",
    aiRelevance:
      "AI ASIC 與 SoC 在生產期需要 NVM 用於 chip ID、authentication、trim；力旺在所有 foundry（含 TSMC）的 logic 製程都有矽驗證。",
    competitiveAdvantage:
      "全球 logic NVM IP 市占第一，與 TSMC、UMC、Samsung 等代工廠長期合作；切換成本高。",
    competitors: ["Synopsys（NVM IP 部分）", "Sidense（被 Synopsys 併購）"],
    risks: [
      "市場較小、成長受 IC 出貨量限制",
      "權利金收入波動",
    ],
    keyCustomersOrEcosystem:
      "客戶為 IC 設計公司（fabless），含 AI ASIC、SoC、MCU 業者。",
    technicalKeywords: ["NVM IP", "PUF", "OTP", "Logic process NVM"],
    tags: ["NVM IP", "Security IP", "Logic NVM"],
    valuationSensitivity: ["smartphoneCycle", "serverDemand"],
    moat: { process: 0, ipDesign: 4, ecosystem: 4, customer: 5, manufacturing: 0, switching: 5 },
    risk: {
      nvidiaDependency: 1,
      memoryCycle: 1,
      chinaExport: 3,
      customerConc: 2,
      capexCycle: 2,
      valuation: 3,
      techTransition: 2,
    },
    analystView:
      "穩定的 IP 授權商業模式；AI 純度非極高，但 IC 出貨成長間接受惠。",
    sourceUrls: ["https://www.ememory.com.tw/", "https://mops.twse.com.tw/"],
    confidenceLevel: "Medium",
    lastUpdated: STD_DATE,
    marketData: MD_TWD,
  },

  {
    id: "phison",
    name: "群聯 Phison",
    nameEn: "Phison Electronics Corp.",
    ticker: "TPEx: 8299",
    market: "Taiwan",
    category: ["memory-hbm", "ai-server-odm"],
    aiImportanceScore: 3,
    supplyChainPosition: "Midstream",
    coreProducts: [
      "SSD controller（消費、企業）",
      "USB 隨身碟、SD card controller",
      "aiDAPTIV+（SSD-based 大模型 KV cache 解決方案）",
    ],
    whatTheyDo:
      "全球主要 SSD / 儲存裝置控制 IC 設計公司；近年公開推廣 aiDAPTIV+ — 用 SSD 擴展 GPU 記憶體容量的軟硬整合方案。",
    aiRelevance:
      "AI server 對企業級 SSD 容量需求暴增；aiDAPTIV+ 是少數針對「HBM 不夠用」場景的創新解。",
    competitiveAdvantage:
      "SSD controller 設計力深；與 Kioxia、Micron、SK Hynix 等 NAND 廠合作緊密。",
    competitors: ["Silicon Motion 慧榮", "Marvell（部分）", "Samsung in-house"],
    risks: [
      "NAND 價格週期",
      "aiDAPTIV+ 商用化進度",
      "與品牌客戶議價能力有限",
    ],
    keyCustomersOrEcosystem:
      "客戶涵蓋多家 SSD 品牌與 NAND 廠；aiDAPTIV+ 已有公開合作案例。",
    technicalKeywords: ["SSD controller", "NAND", "aiDAPTIV+", "Storage"],
    tags: ["SSD Controller", "Storage", "AI Memory Extension"],
    valuationSensitivity: ["memoryCycle", "pcCycle", "hyperscalerDemand"],
    moat: { process: 3, ipDesign: 4, ecosystem: 4, customer: 4, manufacturing: 0, switching: 3 },
    risk: {
      nvidiaDependency: 2,
      memoryCycle: 4,
      chinaExport: 3,
      customerConc: 3,
      capexCycle: 3,
      valuation: 2,
      techTransition: 3,
    },
    analystView:
      "傳統 SSD controller 是基本盤；aiDAPTIV+ 是 AI 題材的「優先選擇權」 — 若 hyperscaler 認可可大幅 rerate。",
    sourceUrls: ["https://www.phison.com/", "https://mops.twse.com.tw/"],
    confidenceLevel: "Medium",
    lastUpdated: STD_DATE,
    marketData: MD_TWD,
  },

  {
    id: "onsemi",
    name: "安森美 onsemi",
    nameEn: "ON Semiconductor Corp.",
    ticker: "NASDAQ: ON",
    market: "US",
    category: ["power-management"],
    aiImportanceScore: 3,
    supplyChainPosition: "Midstream",
    coreProducts: [
      "SiC MOSFET、SiC 模組",
      "電源管理 IC",
      "影像感測器（CIS for auto）",
      "類比 / 混合訊號 IC",
    ],
    whatTheyDo:
      "美國中大型功率半導體 + 類比 IC 公司；近年聚焦汽車與工業，是 SiC 全球前 3 大供應商。",
    aiRelevance:
      "AI 資料中心 800V/HVDC 升級長期需要 SiC，onsemi 是潛在受惠者；但短期 AI 純度低，主力仍為汽車。",
    competitiveAdvantage:
      "SiC 垂直整合（自有晶圓 + 模組）；汽車 CIS 領先。",
    competitors: ["Infineon", "STMicro", "Wolfspeed", "Texas Instruments"],
    risks: [
      "汽車週期下行",
      "中國 SiC 競爭加劇",
      "AI 資料中心 SiC 採用時程不確定",
    ],
    keyCustomersOrEcosystem:
      "Tesla、福特、現代、福斯等車廠為公開揭露之 SiC 大客戶；資料中心比重仍低。",
    technicalKeywords: ["SiC", "MOSFET", "CIS", "PMIC"],
    tags: ["SiC", "Power IC", "Image Sensor"],
    valuationSensitivity: ["smartphoneCycle", "capexCycle"],
    moat: { process: 4, ipDesign: 4, ecosystem: 4, customer: 4, manufacturing: 4, switching: 4 },
    risk: {
      nvidiaDependency: 1,
      memoryCycle: 1,
      chinaExport: 3,
      customerConc: 3,
      capexCycle: 4,
      valuation: 3,
      techTransition: 3,
    },
    analystView:
      "AI 是長期 optionality；主軸仍是電動車與 SiC 競爭。",
    sourceUrls: ["https://www.onsemi.com/", "https://www.onsemi.com/company/investor-relations"],
    confidenceLevel: "High",
    lastUpdated: STD_DATE,
    marketData: MD_USD,
  },

  {
    id: "infineon",
    name: "英飛凌 Infineon",
    nameEn: "Infineon Technologies AG",
    ticker: "ETR: IFX",
    market: "Private",
    category: ["power-management"],
    aiImportanceScore: 4,
    supplyChainPosition: "Midstream",
    coreProducts: [
      "電源管理 IC（含資料中心 VRM）",
      "汽車 MCU、SiC、IGBT",
      "工業 / 消費電源 IC",
      "資料中心 HVDC（400/800V）解決方案",
    ],
    whatTheyDo:
      "歐洲最大功率半導體公司，全球功率半導體市占第一；公司公開將「資料中心電源」列為主要成長動能之一。",
    aiRelevance:
      "AI rack 從 12V 走向 48V → 進而 800V HVDC，Infineon 在 VRM、power stage、SiC、隔離元件全線布局；是少數能跟 MPS 競爭的數據中心電源供應商。",
    competitiveAdvantage:
      "功率半導體市占第一，垂直整合度高（自有晶圓 + 設計）；歐洲總部地緣中立。",
    competitors: ["MPS", "STMicro", "onsemi", "Texas Instruments", "Renesas"],
    risks: [
      "汽車週期下行",
      "中國市場降溫",
      "歐元波動",
    ],
    keyCustomersOrEcosystem:
      "汽車（含 Tesla、福斯）、資料中心（Nvidia 平台合作）、工業客戶廣泛。",
    technicalKeywords: ["VRM", "SiC", "HVDC", "48V", "Power stage"],
    tags: ["Power IC", "SiC", "VRM", "HVDC"],
    valuationSensitivity: ["smartphoneCycle", "capexCycle", "hyperscalerDemand"],
    moat: { process: 4, ipDesign: 4, ecosystem: 5, customer: 5, manufacturing: 5, switching: 4 },
    risk: {
      nvidiaDependency: 2,
      memoryCycle: 1,
      chinaExport: 4,
      customerConc: 2,
      capexCycle: 4,
      valuation: 3,
      techTransition: 3,
    },
    analystView:
      "歐股流動性需注意；AI 資料中心電源題材日益清晰，與 MPS 形成兩大選擇。",
    sourceUrls: ["https://www.infineon.com/", "https://www.infineon.com/cms/en/about-infineon/investor/"],
    confidenceLevel: "High",
    lastUpdated: STD_DATE,
  },

  {
    id: "rambus",
    name: "Rambus",
    nameEn: "Rambus Inc.",
    ticker: "NASDAQ: RMBS",
    market: "US",
    category: ["memory-hbm", "high-speed-interface"],
    aiImportanceScore: 3,
    supplyChainPosition: "Upstream",
    coreProducts: [
      "DDR5、HBM、CXL controller IC",
      "Memory IP（DDR、HBM、GDDR PHY）",
      "Security IP",
      "PCIe / CXL 介面 IP",
    ],
    whatTheyDo:
      "美國記憶體 IP + IC 公司，提供 server DRAM 上的 RCD（Registering Clock Driver）、DDR/HBM PHY IP、CXL controller；資料中心 DDR5 + CXL 是核心成長動能。",
    aiRelevance:
      "AI server 大量採用 DDR5 RDIMM / MRDIMM，每條都需要 Rambus 等 RCD IC；HBM PHY IP 與 CXL controller 也直接受惠。",
    competitiveAdvantage:
      "Server 記憶體 buffer IC 寡占之一；HBM/CXL/DDR PHY IP 矽驗證完整。",
    competitors: ["Renesas（前 IDT）", "Montage Technology（中）", "Synopsys（IP）"],
    risks: [
      "Montage（中）競爭",
      "客戶集中於少數記憶體 + IC 設計業者",
      "歷史授權糾紛背景",
    ],
    keyCustomersOrEcosystem:
      "DRAM 廠（Micron、SK Hynix、Samsung）以及大型伺服器 OEM 為主要客戶。",
    technicalKeywords: ["RCD", "DDR5", "HBM", "CXL", "Memory IP"],
    tags: ["Memory Controller", "IP", "CXL", "DDR5"],
    valuationSensitivity: ["serverDemand", "memoryCycle", "hyperscalerDemand"],
    moat: { process: 3, ipDesign: 5, ecosystem: 4, customer: 4, manufacturing: 0, switching: 4 },
    risk: {
      nvidiaDependency: 2,
      memoryCycle: 3,
      chinaExport: 3,
      customerConc: 3,
      capexCycle: 3,
      valuation: 3,
      techTransition: 3,
    },
    analystView:
      "AI server 記憶體子系統的隱性受惠者；MRDIMM 與 CXL 是中期成長題材。",
    serdesAngle: "DDR5 → DDR6 與 HBM3E → HBM4 都需要 Rambus 級 PHY 設計能力，是 SerDes 在記憶體介面的代表公司之一。",
    sourceUrls: ["https://www.rambus.com/", "https://investor.rambus.com/"],
    confidenceLevel: "High",
    lastUpdated: STD_DATE,
    marketData: MD_USD,
  },
];

// 依 id 快速查表
export const companyById = Object.fromEntries(
  companies.map((c) => [c.id, c]),
) as Record<string, Company>;

// 依 ticker 查表
export const companyByTicker = Object.fromEntries(
  companies.map((c) => [c.ticker, c]),
) as Record<string, Company>;
