import type { BottleneckMapping } from "../types";

// 「誰受惠於什麼瓶頸」對照表
// — 用於分析師頁面與供應鏈推論
export const bottlenecks: BottleneckMapping[] = [
  {
    id: "hbm-shortage",
    nameZh: "HBM 產能短缺",
    nameEn: "HBM Capacity Shortage",
    description:
      "HBM3E / HBM4 是 AI 加速器吞吐量的決定因素；三大廠（SK Hynix、Samsung、Micron）擴產仍跟不上 GPU 與 ASIC 需求。產能緊缺時，HBM 供應商價格與毛利率有上行空間，並透過 TSV / 封裝設備擴產傳導至上游。",
    beneficiaries: [
      { companyId: "skhynix", reason: "HBM 主力供應商，公認市占領先" },
      { companyId: "samsung", reason: "HBM 第二大供應商，認證進度是關鍵變數" },
      { companyId: "micron", reason: "HBM3E 已量產供應 Nvidia H200" },
      { companyId: "lam", reason: "HBM TSV 蝕刻 / ALD 設備主要供應商" },
      { companyId: "amat", reason: "HBM 流程設備受惠" },
    ],
    sourceUrls: [
      "https://www.micron.com/products/memory/hbm",
      "https://news.skhynix.com/",
    ],
    confidenceLevel: "High",
    lastUpdated: "2026-05-24",
  },
  {
    id: "cowos-shortage",
    nameZh: "CoWoS 先進封裝產能短缺",
    nameEn: "CoWoS Capacity Shortage",
    description:
      "CoWoS 是 Nvidia / AMD / Broadcom AI 加速器的封裝瓶頸；TSMC 仍在快速擴產，但需求成長更快。延伸至 ABF 載板、interposer、Test 環節。",
    beneficiaries: [
      { companyId: "tsmc", reason: "CoWoS 事實上的近獨家供應方" },
      { companyId: "unimicron", reason: "ABF 載板 → 配合 CoWoS 出貨" },
      { companyId: "nanyapcb", reason: "ABF 載板供應方之一" },
      { companyId: "kyec", reason: "AI ASIC 後段測試需求" },
      { companyId: "amkor", reason: "部分後段封裝外溢承接" },
    ],
    sourceUrls: ["https://3dfabric.tsmc.com/english/dedicatedFoundry/technology/CoWoS.htm"],
    confidenceLevel: "High",
    lastUpdated: "2026-05-24",
  },
  {
    id: "800g-upgrade",
    nameZh: "800G Ethernet 升級",
    nameEn: "800G Ethernet Upgrade",
    description:
      "AI cluster 推動 400G→800G Ethernet 升級，single-lane 112G PAM4 普及；switch ASIC、800G optical module、AEC / DAC 全面更新；retimer 在 PCIe 與 Ethernet 同時受惠。",
    beneficiaries: [
      { companyId: "broadcom", reason: "Tomahawk 5 51.2T 領先量產" },
      { companyId: "marvell", reason: "PAM4 DSP、retimer、optical 全面布局" },
      { companyId: "coherent", reason: "800G 光模組 / EML 雷射出貨" },
      { companyId: "lumentum", reason: "800G 光模組 / EML 出貨" },
      { companyId: "fabrinet", reason: "光模組代工受惠" },
      { companyId: "accton", reason: "800G 白牌交換器設計 / 量產" },
      { companyId: "credo", reason: "AEC 與 DSP / SerDes IC 受惠" },
      { companyId: "amphenol", reason: "OSFP/QSFP-DD 連接器與 cable assembly" },
    ],
    sourceUrls: [
      "https://www.broadcom.com/products/ethernet-connectivity/switching/strataxgs/bcm78900",
    ],
    confidenceLevel: "High",
    lastUpdated: "2026-05-24",
  },
  {
    id: "1p6t-transition",
    nameZh: "1.6T Ethernet 轉換",
    nameEn: "1.6T Ethernet Transition",
    description:
      "下一代 102.4T switch 採 224G PAM4/PAM6 lane，每 port 跑 1.6T；光模組、AEC、retimer 設計困難度大幅上升，CPO / LPO 是否在此世代落地是關鍵。",
    beneficiaries: [
      { companyId: "broadcom", reason: "Tomahawk 6 102.4T 平台" },
      { companyId: "marvell", reason: "1.6T 光通訊 DSP + retimer" },
      { companyId: "astera", reason: "PCIe Gen6 retimer 與 224G connectivity" },
      { companyId: "credo", reason: "224G PAM4 SerDes / AEC" },
      { companyId: "synopsys", reason: "224G PHY IP 在多家 ASIC 客戶端授權" },
      { companyId: "fabrinet", reason: "1.6T 模組與 CPO 製造夥伴" },
    ],
    sourceUrls: [
      "https://www.broadcom.com/",
      "https://www.marvell.com/products/networking/ai-and-cloud-infrastructure.html",
    ],
    confidenceLevel: "Medium",
    lastUpdated: "2026-05-24",
  },
  {
    id: "rack-power",
    nameZh: "AI rack 功耗暴增",
    nameEn: "AI Rack Power Increase",
    description:
      "從 ~20kW rack 到 GB200 NVL72 的 120kW+，整個供電 / 散熱 / 機構件全部重做；48V/800V DC、Power Shelf、BBU、in-rack PDU 成為新標準。",
    beneficiaries: [
      { companyId: "delta", reason: "Power Shelf、BBU、48V 架構主要供應商" },
      { companyId: "liteon", reason: "Hyperscaler PSU 主要供應商" },
      { companyId: "acbel", reason: "鴻海集團整合，PSU / BBU" },
      { companyId: "vertiv", reason: "rack-level 整合方案" },
      { companyId: "mps", reason: "GPU 旁高電流 VRM / Power Stage" },
    ],
    sourceUrls: [
      "https://www.deltaww.com/",
      "https://www.opencompute.org/",
    ],
    confidenceLevel: "High",
    lastUpdated: "2026-05-24",
  },
  {
    id: "liquid-cooling",
    nameZh: "液冷導入",
    nameEn: "Liquid Cooling Adoption",
    description:
      "GPU TDP > 700W 後風冷困難，液冷（DLC）成為 AI rack 標配；cold plate、manifold、CDU 供應鏈快速擴張，並向 row-level / facility 滲透。",
    beneficiaries: [
      { companyId: "avc", reason: "Cold plate、CDU、manifold 領先供應商" },
      { companyId: "auras", reason: "與 AVC 雙雄分食大客戶訂單" },
      { companyId: "jentech", reason: "Heat spreader 與冷板金屬件" },
      { companyId: "delta", reason: "液冷整合與電源協同銷售" },
      { companyId: "vertiv", reason: "Facility-level CDU / 冷卻整合" },
    ],
    sourceUrls: [
      "https://www.avc.com.tw/",
      "https://www.auras.com.tw/",
    ],
    confidenceLevel: "High",
    lastUpdated: "2026-05-24",
  },
  {
    id: "hyperscaler-capex",
    nameZh: "Hyperscaler Capex 循環",
    nameEn: "Hyperscaler Capex Cycle",
    description:
      "Microsoft、Meta、Google、Amazon、Oracle 等 capex 計畫直接決定整條 AI 基礎建設供應鏈節奏；任何下修都會放大下游波動。",
    beneficiaries: [
      { companyId: "nvidia", reason: "最直接受惠者，GPU 與系統" },
      { companyId: "broadcom", reason: "客製 ASIC + Switch ASIC + 光通訊" },
      { companyId: "tsmc", reason: "代工最上游" },
      { companyId: "wiwynn", reason: "ODM Direct 的代表" },
      { companyId: "quanta", reason: "ODM 與 QCT 雲端業務" },
      { companyId: "foxconn", reason: "GB200 rack-scale 整合" },
      { companyId: "arista", reason: "Hyperscaler 網路升級" },
    ],
    sourceUrls: [],
    confidenceLevel: "High",
    lastUpdated: "2026-05-24",
  },
];
