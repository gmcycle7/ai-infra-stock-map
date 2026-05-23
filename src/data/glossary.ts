import type { GlossaryTerm } from "../types";

// 技術名詞解釋 — 給 Taiwan-based 半導體 / SerDes 工程師為主要讀者
export const glossary: GlossaryTerm[] = [
  // ---- AI 算力 ----
  {
    term: "GPU",
    termZh: "圖形處理器 / AI 加速器核心",
    category: "ai-compute",
    shortDef: "大量平行運算單元的處理器，是當前 AI 訓練與推論主流算力來源。",
    longDef:
      "GPU 原為圖形處理而生，擁有上千個 CUDA / SM 核心與 Tensor Core，能高效執行矩陣乘法（GEMM）。Nvidia Hopper、Blackwell、AMD MI300 系列為當前 AI 主流。",
    related: ["CPU", "ASIC", "NPU", "TPU", "LPU"],
  },
  {
    term: "CPU",
    termZh: "中央處理器",
    category: "ai-compute",
    shortDef: "通用處理器，AI 伺服器中擔任 host／資料前處理與調度角色。",
    longDef:
      "AI 伺服器中 CPU 主要負責 OS、I/O、資料前處理、模型 router 等工作；x86（Intel Xeon、AMD EPYC）為主流，ARM-based（Nvidia Grace、Ampere）逐漸增加。",
    related: ["GPU", "DPU"],
  },
  {
    term: "DPU",
    termZh: "資料處理器 / 智慧網卡",
    category: "network-chips",
    shortDef: "卸載網路、儲存、安全等功能的專用處理器，常與 NIC 整合。",
    longDef:
      "DPU（Data Processing Unit）將傳統由 CPU 處理的網路 / 儲存 / 安全工作卸載到專用矽，代表產品為 Nvidia BlueField、AMD Pensando、Marvell OCTEON。",
    related: ["NIC", "SmartNIC", "CPU"],
  },
  {
    term: "LPU",
    termZh: "語言處理器 / 推論加速器",
    category: "ai-compute",
    shortDef: "針對序列推論最佳化的 ASIC，例如 Groq LPU。",
    longDef:
      "LPU 是部分新創（Groq）對其推論 ASIC 的稱呼，特色是極低延遲、確定性執行；屬於 ASIC 的一種。",
    related: ["ASIC", "GPU"],
  },
  {
    term: "NPU",
    termZh: "神經網路處理器",
    category: "ai-compute",
    shortDef: "整合於 SoC 內的 AI 加速器，常見於手機、PC。",
    longDef:
      "NPU 通常為手機 / PC SoC 內的 INT8 / FP16 矩陣加速器，用於本機推論（如人像、ASR）。MediaTek Dimensity、Qualcomm Hexagon、Apple Neural Engine 為代表。",
    related: ["ASIC", "GPU", "Edge AI"],
  },
  {
    term: "TPU",
    termZh: "張量處理器（Google 自研 ASIC）",
    category: "ai-compute",
    shortDef: "Google 自研 AI 加速 ASIC，多代產品已用於內部與 Google Cloud。",
    longDef:
      "TPU（Tensor Processing Unit）為 Google 自研 ASIC，包含矩陣乘法陣列、HBM、ICI 互連；其設計與量產與 Broadcom 等業者合作。",
    related: ["ASIC", "Custom Silicon"],
  },
  {
    term: "ASIC",
    termZh: "客製化晶片",
    category: "ai-compute",
    shortDef: "針對特定應用設計的專用晶片；AI 領域指 hyperscaler 自研加速器。",
    longDef:
      "AI ASIC 是 hyperscaler 為自身工作負載量身打造的加速器，例如 Google TPU、AWS Trainium、Meta MTIA；通常透過 Broadcom / Marvell / Alchip / GUC 等設計服務商實作。",
    related: ["GPU", "TPU", "Custom Silicon"],
  },

  // ---- 記憶體 ----
  {
    term: "HBM",
    termZh: "高頻寬記憶體",
    category: "memory-hbm",
    shortDef: "透過 TSV 堆疊的 DRAM，使用 1024-bit 寬介面達成極高頻寬。",
    longDef:
      "HBM 將多顆 DRAM die 透過 TSV 垂直堆疊於 base die 上，並以 1024-bit 寬介面短距離與 GPU 連接，常見頻寬達數 TB/s。HBM3E 為當前主流，HBM4 預計加入更複雜的 base die。",
    related: ["TSV", "CoWoS", "DDR5", "CXL"],
  },
  {
    term: "DDR5",
    termZh: "第五代雙倍資料率記憶體",
    category: "memory-hbm",
    shortDef: "目前主流伺服器 DRAM；AI 伺服器 host 端記憶體基礎。",
    longDef:
      "DDR5 提供 4800-6400 MT/s 速率，支援 on-die ECC、Sub-channel 等新功能；AI 伺服器中與 GPU HBM 互補，CPU 端的 DDR5 容量影響 KV cache、推論吞吐量。",
    related: ["DDR4", "LPDDR5X", "MRDIMM"],
  },
  {
    term: "CXL",
    termZh: "Compute Express Link",
    category: "memory-hbm",
    shortDef: "建立在 PCIe PHY 上的快取一致性互連，支援記憶體擴張 / 池化。",
    longDef:
      "CXL（Compute Express Link）以 PCIe Gen5/6 PHY 為基底，提供 cache-coherent 通訊與 memory pooling；CXL 2.0 支援 switch、3.0 支援 fabric。Astera Leo、Marvell 等是主要 controller 提供者。",
    related: ["PCIe", "HBM", "DDR5"],
  },

  // ---- 製程 / 封裝 ----
  {
    term: "CoWoS",
    termZh: "TSMC 先進封裝技術（Chip-on-Wafer-on-Substrate）",
    category: "advanced-packaging",
    shortDef: "TSMC 的 2.5D 封裝平台，將 GPU 與 HBM 安裝於矽中介層上。",
    longDef:
      "CoWoS-S 使用矽中介層（silicon interposer），CoWoS-L 使用 RDL + local Si bridge；目前所有 Nvidia / AMD AI 加速器幾乎都採用 CoWoS。產能擴張速度直接決定 AI 加速器出貨量。",
    related: ["SoIC", "InFO", "HBM", "TSV"],
  },
  {
    term: "SoIC",
    termZh: "TSMC 系統整合晶片（System on Integrated Chips）",
    category: "advanced-packaging",
    shortDef: "TSMC 的 3D 堆疊封裝，能將 chiplet 垂直疊在一起。",
    longDef:
      "SoIC 是 TSMC 的 3D 整合方案，採用直接銅銅 bonding（hybrid bonding）達到比 CoWoS 更短的 die-to-die 互連；AMD MI300、未來 AI ASIC 是其代表性應用。",
    related: ["CoWoS", "Chiplet", "Hybrid bonding"],
  },
  {
    term: "Chiplet",
    termZh: "晶片小單元",
    category: "advanced-packaging",
    shortDef: "把大晶片拆成多個小 die 再透過封裝整合，以提升良率與彈性。",
    longDef:
      "Chiplet 架構透過先進封裝（CoWoS、SoIC、EMIB）連結多個小 die，可組合不同製程節點、IP（CPU、GPU、HBM PHY）；AMD EPYC、Intel Meteor Lake、Nvidia Blackwell 皆使用。",
    related: ["UCIe", "CoWoS", "SoIC"],
  },
  {
    term: "UCIe",
    termZh: "Universal Chiplet Interconnect Express",
    category: "advanced-packaging",
    shortDef: "業界標準的 chiplet die-to-die 介面規格。",
    longDef:
      "UCIe 是由 Intel、TSMC、Samsung、ARM、AMD 等共同推動的 chiplet 介面標準，定義從 PHY 到 protocol 的層級；速率可達 16-32 GT/s/lane，密度極高。",
    related: ["Chiplet", "SerDes", "Advanced Packaging"],
  },
  {
    term: "ABF",
    termZh: "Ajinomoto Build-up Film（IC 載板絕緣材料）",
    category: "advanced-packaging",
    shortDef: "高階 IC 載板的關鍵絕緣層材料，用於 CPU / GPU / ASIC 封裝。",
    longDef:
      "ABF 是味之素開發的 build-up film，是製造 flip-chip BGA 載板的關鍵；Unimicron、Ibiden、Shinko、Nan Ya PCB 為主要載板廠。",
    related: ["Substrate", "Flip-Chip", "BGA"],
  },
  {
    term: "TSV",
    termZh: "矽穿孔（Through-Silicon Via）",
    category: "advanced-packaging",
    shortDef: "穿過矽 die 的垂直電氣連結，用於 3D 堆疊封裝。",
    longDef:
      "TSV 是 HBM、3D NAND、SoIC 等 3D 堆疊技術的關鍵製程；蝕刻、填充、CMP 都需特殊設備與材料。",
    related: ["HBM", "SoIC", "3D NAND"],
  },

  // ---- 高速介面 / SerDes ----
  {
    term: "SerDes",
    termZh: "高速序列收發器（Serializer / Deserializer）",
    category: "high-speed-interface",
    shortDef: "把並列資料序列化成單對 differential pair 高速傳輸的電路。",
    longDef:
      "SerDes 是所有高速介面（PCIe、Ethernet、NVLink、CXL、UCIe）的底層；其速率（NRZ→PAM4→PAM6）、jitter、equalization 能力決定能跑多遠、多乾淨。",
    related: ["PAM4", "PCIe", "Retimer", "CDR"],
  },
  {
    term: "PAM4",
    termZh: "4 階脈波振幅調變",
    category: "high-speed-interface",
    shortDef: "一個 symbol 攜帶 2 bits 資料的調變方式，提升頻寬密度。",
    longDef:
      "PAM4 把 NRZ 的 1 bit/symbol 提升到 2 bit/symbol，達到一倍頻寬密度但 SNR 下降約 9.5 dB；目前 112G、224G Ethernet/PCIe 都採用。",
    related: ["NRZ", "PAM6", "SerDes"],
  },
  {
    term: "Retimer",
    termZh: "訊號重整晶片",
    category: "high-speed-interface",
    shortDef: "完整接收、重整、再傳送的高速訊號 IC，能延長距離並重設 BER。",
    longDef:
      "Retimer 與 redriver 不同：retimer 含 CDR + DSP equalizer，會完全恢復訊號；redriver 只做類比補償。AI server 中 PCIe Gen5/6、800G AEC 高度仰賴 retimer。",
    related: ["Redriver", "CDR", "Equalization", "AEC"],
  },
  {
    term: "CDR",
    termZh: "時脈與資料復原（Clock and Data Recovery）",
    category: "high-speed-interface",
    shortDef: "從輸入資料中萃取時脈，再以時脈取樣資料。",
    longDef:
      "CDR 是高速 SerDes 接收端核心，須在 jitter、ISI、CTLE 殘餘下找到最佳 sample point；PLL/DLL 結構、bandwidth、loop filter 設計都會影響 jitter tolerance。",
    related: ["Jitter", "SerDes", "PLL"],
  },
  {
    term: "Insertion Loss",
    termZh: "插入損耗",
    category: "high-speed-interface",
    shortDef: "訊號通過通道後的能量損失（dB），決定 SI 預算上限。",
    longDef:
      "224G PAM4 的 Nyquist 在 ~56 GHz，PCB 在 36-inch 走線可能損耗 30-40dB；需仰賴 retimer、低損耗材料（Megtron 8、Tachyon）、AEC 等對抗。",
    related: ["Jitter", "Equalization", "Retimer"],
  },
  {
    term: "Equalization",
    termZh: "等化",
    category: "high-speed-interface",
    shortDef: "在 TX/RX 補償通道頻率響應，恢復眼圖。",
    longDef:
      "常見方案：TX FFE（feed-forward）、RX CTLE（連續時間線性）、DFE（決策反饋）；PAM4 對 DFE 殘餘錯誤更敏感，需設計更佳的 FFE/CTLE 平衡。",
    related: ["FFE", "CTLE", "DFE", "SerDes"],
  },
  {
    term: "Jitter",
    termZh: "時脈抖動",
    category: "high-speed-interface",
    shortDef: "時脈邊緣的隨機 / 確定性偏移，是 SerDes 性能殺手。",
    longDef:
      "Jitter 分為 RJ（random）、DJ（deterministic，含 DDJ、PJ、BUJ）；TX 端來自 PLL 與電源雜訊，RX 端則靠 CDR jitter tracking 與 jitter tolerance 對抗。",
    related: ["CDR", "PLL", "Phase noise"],
  },

  // ---- 網路 / 連接 ----
  {
    term: "NIC",
    termZh: "網路介面卡",
    category: "network-chips",
    shortDef: "把伺服器連到網路的硬體，提供 Ethernet/InfiniBand 介面。",
    longDef:
      "AI server 常用 200G/400G/800G NIC（如 Nvidia ConnectX-7/8、BlueField）；NIC + RDMA 是 GPU cluster 通訊基礎。",
    related: ["DPU", "SmartNIC", "RoCEv2"],
  },
  {
    term: "Switch ASIC",
    termZh: "交換器晶片",
    category: "network-chips",
    shortDef: "資料中心交換器的核心晶片，提供大量高速 SerDes I/O。",
    longDef:
      "代表產品為 Broadcom Tomahawk / Jericho、Nvidia Spectrum、Cisco Silicon One；51.2T → 102.4T 的演進來自更多 lane 與更高 lane 速率。",
    related: ["SerDes", "Tomahawk", "Spectrum-X"],
  },
  {
    term: "DAC",
    termZh: "Direct Attach Copper（被動銅纜）",
    category: "copper-interconnect",
    shortDef: "兩端直接焊死於連接器的被動銅纜，成本最低但距離短。",
    longDef:
      "DAC 不含主動電路，成本與功耗最低；隨速率上升（112G、224G PAM4）有效距離下降至 1-2m，是 rack 內最短距離連結方案。",
    related: ["AEC", "ACC", "QSFP-DD"],
  },
  {
    term: "ACC",
    termZh: "Active Copper Cable（含 redriver 銅纜）",
    category: "copper-interconnect",
    shortDef: "含 redriver 的銅纜，提供類比補償。",
    longDef:
      "ACC 在兩端加入 redriver 做頻寬補償（不含 CDR），中等成本，距離與 BER 略優於 DAC，但仍不如 AEC。",
    related: ["DAC", "AEC", "Redriver"],
  },
  {
    term: "AEC",
    termZh: "Active Electrical Cable（含 retimer 銅纜）",
    category: "copper-interconnect",
    shortDef: "內含 retimer 的主動銅纜，距離與 BER 接近光模組。",
    longDef:
      "AEC 兩端含完整 retimer，能延長 112G/224G PAM4 銅纜至 3-7m；功耗低於光模組、成本中等，是 AI rack 與 row 內連結熱門選擇。Credo 為主要供應商之一。",
    related: ["DAC", "ACC", "Retimer", "Credo"],
  },
  {
    term: "QSFP-DD / OSFP",
    termZh: "高速可插拔光模組規格",
    category: "optical-communication",
    shortDef: "資料中心常見的 8-lane 可插拔光模組規格。",
    longDef:
      "QSFP-DD 與 OSFP 都支援 8 lane（200G/400G/800G/1.6T），OSFP 散熱與功率上限略高，較適合 1.6T；連接器與插拔機構由 Amphenol、TE 等提供。",
    related: ["DAC", "AEC", "Optical Module"],
  },
  {
    term: "Optical Module",
    termZh: "光收發模組",
    category: "optical-communication",
    shortDef: "電光轉換的可插拔模組，包含 DSP、driver、TIA、雷射等。",
    longDef:
      "資料中心光模組以 PAM4 為主流；800G DR8 / 2xFR4 / SR8、1.6T 為下一代；內部 DSP 多由 Broadcom、Marvell 供應，雷射來自 Coherent、Lumentum。",
    related: ["DSP", "EML", "VCSEL", "CPO"],
  },
  {
    term: "Silicon Photonics",
    termZh: "矽光子",
    category: "optical-communication",
    shortDef: "用 CMOS 製程整合 modulator / detector 的光元件。",
    longDef:
      "矽光子可以把 modulator、detector 與部分光被動元件以 CMOS / SiN 製程整合，搭配 InP 雷射；CPO（共同封裝光學）的主要實作方式之一。",
    related: ["CPO", "InP", "EML"],
  },
  {
    term: "CPO",
    termZh: "共同封裝光學（Co-Packaged Optics）",
    category: "optical-communication",
    shortDef: "把光引擎搬到 switch ASIC 旁邊，省功耗與訊號路徑。",
    longDef:
      "CPO 把光學引擎與 switch ASIC 共同封裝，縮短電氣 SerDes 路徑、降低功耗；但會增加封裝、熱管理、可維修性挑戰。Nvidia、Broadcom 都有 CPO 路線圖。",
    related: ["LPO", "Silicon Photonics", "Optical Module"],
  },
  {
    term: "LPO",
    termZh: "線性可插拔光學（Linear Pluggable Optics）",
    category: "optical-communication",
    shortDef: "去掉光模組內 DSP 的可插拔光學，省功耗與成本。",
    longDef:
      "LPO 把光模組做成「線性」（不含 DSP），靠 switch ASIC SerDes 直接驅動光元件；對 SerDes 與通道預算要求更高，但功耗節省可觀。",
    related: ["CPO", "DSP", "SerDes"],
  },

  // ---- 伺服器 / ODM / EMS ----
  {
    term: "ODM",
    termZh: "原廠設計製造商",
    category: "ai-server-odm",
    shortDef: "替品牌或 hyperscaler 設計與製造伺服器、NB、網通設備的廠商。",
    longDef:
      "ODM 提供「設計 + 製造」一條龍服務；台灣 ODM（廣達、緯創、英業達、緯穎、鴻海）幾乎承接全球大部分 AI server 製造。",
    related: ["EMS", "ODM Direct", "Hyperscaler"],
  },
  {
    term: "EMS",
    termZh: "電子製造服務",
    category: "ai-server-odm",
    shortDef: "純代工製造服務，設計由客戶自行負責。",
    longDef:
      "EMS 提供 PCBA、組裝、測試等製造服務；鴻海、Jabil、Flex 是代表。AI server 多採 ODM 模式（含設計），但部分 hyperscaler 對 EMS 直接下單。",
    related: ["ODM", "ODM Direct"],
  },
  {
    term: "AI Server",
    termZh: "AI 伺服器",
    category: "ai-server-odm",
    shortDef: "搭載 GPU/ASIC 的高密度、高功耗伺服器，分訓練與推論用。",
    longDef:
      "AI server 規範多元（HGX baseboard、MGX 平台、GB200 NVL72 機櫃方案）；rack 功耗從 ~20kW 走向 120kW+，迫使液冷、48V power、機構件全面升級。",
    related: ["HGX", "MGX", "Rack-scale"],
  },

  // ---- 電源 / 散熱 ----
  {
    term: "VRM",
    termZh: "電壓調節模組",
    category: "power-management",
    shortDef: "把 12V/48V 降壓到 GPU/CPU core 電壓的多相 buck 電源。",
    longDef:
      "AI GPU core 電流可達 800-1500A，需要 10+ 相 multi-phase buck，每相用 DrMOS / power stage；控制器須有極佳 transient 響應與 telemetry。",
    related: ["Power Stage", "DrMOS", "PMIC"],
  },
  {
    term: "PSU",
    termZh: "電源供應器",
    category: "power-management",
    shortDef: "把 AC 轉成 DC 12V/48V 給 server / rack 的電源模組。",
    longDef:
      "AI server PSU 容量已上看 5-10kW；80+ Titanium、80+ Ruby 效率規格 + 高功因設計成為標準；CRPS、ORv3 / Sidecar 等規格各有定位。",
    related: ["Power Shelf", "BBU"],
  },
  {
    term: "BBU",
    termZh: "備援電池模組（Battery Backup Unit）",
    category: "power-management",
    shortDef: "rack-scale 內建電池備援，補上 UPS 與 PSU 之間的瞬斷。",
    longDef:
      "AI rack 採 Power Shelf + BBU 架構，BBU 在電網波動時提供短時間（秒級）保護；化學以 LFP / 鋰電為主。",
    related: ["UPS", "Power Shelf"],
  },
  {
    term: "Liquid Cooling",
    termZh: "液冷散熱",
    category: "thermal-cooling",
    shortDef: "用液體（水 / glycol）取代空氣帶走熱量。",
    longDef:
      "AI server 主流為 Direct Liquid Cooling（DLC）：GPU 上方 cold plate → manifold → CDU → 二次水循環 → 室外冷凝；GPU TDP > 700W 後幾乎必備。",
    related: ["Cold Plate", "CDU", "Immersion Cooling"],
  },
  {
    term: "CDU",
    termZh: "Cooling Distribution Unit",
    category: "thermal-cooling",
    shortDef: "資料中心液冷分配單元，作為 facility water 與 IT loop 的中介。",
    longDef:
      "CDU 提供熱交換、流量控制、洩漏偵測；in-row CDU 與 in-rack CDU 為兩大形式。AVC、Auras、Vertiv 為主要供應商。",
    related: ["Manifold", "Cold Plate", "Liquid Cooling"],
  },
  {
    term: "Vapor Chamber",
    termZh: "均熱板",
    category: "thermal-cooling",
    shortDef: "扁平 heat pipe 的延伸，提供大面積均勻散熱。",
    longDef:
      "VC 內部含工作流體與毛細結構，能在大面積上提供高有效熱導；GPU、ASIC、手機 SoC 都會使用。",
    related: ["Heat Pipe", "Cold Plate"],
  },
  {
    term: "Immersion Cooling",
    termZh: "浸沒式冷卻",
    category: "thermal-cooling",
    shortDef: "把伺服器整個泡進絕緣液體中散熱的方式。",
    longDef:
      "可分為單相（single-phase）與雙相（two-phase）；散熱效率高、PUE 佳，但維護、密封、流體成本是挑戰。目前仍是少數試點階段。",
    related: ["DLC", "Liquid Cooling"],
  },

  // ---- 資料中心 ----
  {
    term: "Hyperscaler",
    termZh: "超大型雲端業者",
    category: "ai-server-odm",
    shortDef: "Microsoft、Google、Meta、Amazon、Oracle 等大型雲端 / 平台業者。",
    longDef:
      "Hyperscaler 是 AI 基礎建設最大需求方；其 capex 規模、自研 ASIC、ODM Direct 策略決定整個供應鏈節奏。",
    related: ["AI Server", "Capex"],
  },
  {
    term: "UPS",
    termZh: "不斷電系統",
    category: "data-center-infra",
    shortDef: "資料中心電源切換時的瞬時保護裝置。",
    longDef:
      "傳統 UPS 為集中式（room-level），AI 資料中心則往 rack-level BBU 與 medium voltage 配電靠攏；Vertiv、Eaton、Schneider 是主要品牌。",
    related: ["BBU", "PDU"],
  },
  {
    term: "PDU",
    termZh: "電源分配單元",
    category: "data-center-infra",
    shortDef: "把幹線電源分配到 rack 中各裝置的設備。",
    longDef:
      "Rack PDU 提供電流監控、遠端控制、過載保護；AI rack PDU 因 100kW+ 功率，電流密度與接點設計成為挑戰。",
    related: ["UPS", "Rack"],
  },
];

export const glossaryByTerm = Object.fromEntries(
  glossary.map((g) => [g.term.toLowerCase(), g]),
) as Record<string, GlossaryTerm>;
