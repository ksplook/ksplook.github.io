# GPU 机柜与官方资料索引

核实日期：2026-10-15。链接为厂商官网/官方文档，页面可能更新。以项目实际供货 BOM、铭牌及厂家设施条件为准。

| 选项 | 官方可核实的功率口径 | 在本工具中的使用 |
| --- | --- | --- |
| GB300 NVL72 | NVIDIA Enterprise RA 的完整机柜最高需求 142 kW | 可点击采用参考值；负载率、液冷热捕获比例另填 |
| Vera Rubin NVL72 | NVIDIA DSX 设施参考设计的柜级 TDP 330 kW | 可点击采用参考值；不用于 Rubin Ultra / CPX |
| H800 | Lenovo 官方手册列 H800 80GB PCIe 最大 350 W/卡、H800 NVL 94GB PCIe 最大 400 W/卡 | 仅说明 GPU 层级；不自动换算成整柜 |
| NET 机柜 | 由交换机型号、数量、光模块与负载决定 | 手动输入完整机柜功率；默认 8 kW 为演示占位值 |

## GB300 NVL72

- [NVIDIA 产品页](https://www.nvidia.com/en-us/data-center/gb300-nvl72/)
- [官方参考架构：System Hardware & Components](https://docs.nvidia.com/enterprise-reference-architectures/nvl72-ai-factory/latest/components.html)，见机柜概要部分。
- 数值为该参考架构口径，不能把冗余电源架容量相加当作热负荷；也不能将 142 kW 全部自动分配给房间空气。

## Vera Rubin NVL72

- [NVIDIA 产品页](https://www.nvidia.com/en-us/data-center/vera-rubin-nvl72/)
- [DSX 设施参考设计](https://docs.nvidia.com/dsx/facilities-infra/reference-design-overview)，见 Compute Data Hall 的 Cabinet TDP。
- [DGX Vera Rubin 硬件手册](https://docs.nvidia.com/dgx/dgxvr-user-guide/hardware.html)
- [官方 Datasheet 入口](https://resources.nvidia.com/en-us-dgx-systems/dgx-vera-rubin-nvl72-datasheet)，在线查看器可能需要浏览器加载；本次功率依据是 DSX 文档，不是此 PDF。
- 330 kW 为柜级 TDP 参考值。手册中的电源架额定容量不是该机柜恒定功耗。

## H800

- [Lenovo 官方产品手册 LP1814](https://lenovopress.lenovo.com/lp1814)
- [官方 PDF](https://lenovopress.lenovo.com/lp1814.pdf)
- 两个 PCIe 型号的功率见 Technical specifications。该手册已标记为 withdrawn product；用于识别已有设备规格，不代表当前供货状态。
- SXM 是不同版本。本次未取得可核实的 NVIDIA 官网 SXM 产品手册，因此不预填网上常见的 700 W 数值，也不借用 H100 规格。
- 整柜输入优先采用厂家整机设计功率 × 台数；需确认是否包含机柜内网络、管理节点和配电损耗，避免重复计算。

## 使用方式

产品选项提供来源和口径，不会静默改写项目功率。点击“采用参考整柜功率”后仍需核实机柜尺寸、液冷热量比例、风量及负载率。所有资料通过链接附带；未将第三方完整手册重新发布到仓库。
