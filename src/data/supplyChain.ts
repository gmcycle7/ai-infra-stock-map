import type { SupplyChainNode, SupplyChainEdge } from "../types";

// 供應鏈節點與邊
// 用於 Home 頁面與「供應鏈總覽」的依賴關係圖
export const supplyChainNodes: SupplyChainNode[] = [
  { id: "ai-model", labelZh: "AI 模型訓練 / 推論", labelEn: "AI Model", category: "demand", domain: "Demand" },
  {
    id: "compute",
    labelZh: "GPU / ASIC / CPU",
    labelEn: "Compute Silicon",
    category: "ai-compute",
    domain: "Compute",
  },
  {
    id: "memory",
    labelZh: "HBM / DDR5 / SSD",
    labelEn: "Memory",
    category: "memory-hbm",
    domain: "Memory",
  },
  {
    id: "foundry",
    labelZh: "晶圓代工 / 半導體設備",
    labelEn: "Foundry & Equipment",
    category: "foundry-equipment",
    domain: "Manufacturing",
  },
  {
    id: "packaging",
    labelZh: "先進封裝 / ABF 載板",
    labelEn: "Advanced Packaging & Substrate",
    category: "advanced-packaging",
    domain: "Manufacturing",
  },
  {
    id: "interface",
    labelZh: "SerDes / Retimer / PCIe",
    labelEn: "SerDes & High-Speed Interface",
    category: "high-speed-interface",
    domain: "Networking",
  },
  {
    id: "switch-nic",
    labelZh: "Switch / NIC / DPU",
    labelEn: "Switch / NIC / DPU",
    category: "network-chips",
    domain: "Networking",
  },
  {
    id: "copper",
    labelZh: "DAC / AEC / 連接器",
    labelEn: "Copper Interconnect",
    category: "copper-interconnect",
    domain: "Networking",
  },
  {
    id: "optics",
    labelZh: "光模組 / CPO",
    labelEn: "Optical Communication",
    category: "optical-communication",
    domain: "Networking",
  },
  {
    id: "server",
    labelZh: "AI 伺服器 / ODM",
    labelEn: "AI Server / ODM",
    category: "ai-server-odm",
    domain: "Server",
  },
  {
    id: "power",
    labelZh: "電源 / VRM / PSU / BBU",
    labelEn: "Power & Delivery",
    category: "power-management",
    domain: "Infrastructure",
  },
  {
    id: "cooling",
    labelZh: "散熱 / 液冷",
    labelEn: "Thermal & Cooling",
    category: "thermal-cooling",
    domain: "Infrastructure",
  },
  {
    id: "infra",
    labelZh: "資料中心：UPS / PDU / 冷水機",
    labelEn: "Data Center Infrastructure",
    category: "data-center-infra",
    domain: "Infrastructure",
  },
];

export const supplyChainEdges: SupplyChainEdge[] = [
  // 需求往下推
  { from: "ai-model", to: "compute", label: "驅動算力需求" },
  { from: "compute", to: "memory", label: "驅動 HBM / DRAM 需求" },
  { from: "compute", to: "foundry", label: "需要先進製程" },
  { from: "compute", to: "packaging", label: "需要 CoWoS / ABF" },
  { from: "memory", to: "foundry", label: "DRAM / NAND 設備" },
  { from: "memory", to: "packaging", label: "HBM TSV / 封裝" },
  { from: "compute", to: "interface", label: "PCIe / NVLink / SerDes" },
  { from: "compute", to: "switch-nic", label: "GPU↔Switch 連結" },
  { from: "switch-nic", to: "copper", label: "rack 內銅纜 / 連接器" },
  { from: "switch-nic", to: "optics", label: "跨 rack 光通訊" },
  { from: "switch-nic", to: "interface", label: "需要 retimer / SerDes IP" },
  { from: "compute", to: "server", label: "整合進 AI server" },
  { from: "switch-nic", to: "server", label: "整合進 server" },
  { from: "memory", to: "server", label: "整合進 server" },
  { from: "server", to: "power", label: "驅動高功率電源" },
  { from: "server", to: "cooling", label: "驅動液冷 / 散熱" },
  { from: "server", to: "infra", label: "驅動 UPS / PDU / 配電" },
  { from: "power", to: "infra", label: "rack 級到 facility 級" },
  { from: "cooling", to: "infra", label: "rack 級到 facility 級" },
];
