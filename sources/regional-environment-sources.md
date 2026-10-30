# 地区环境证据包

现覆盖图鉴全部 **140 个代表条目**，通过 `cropToRegions` 关联 **85 个有名称的地区教学案例**。`regions.json` 是页面与离线构建使用的固定数据快照。原 `case-selection.json`、`cropToRegion` 的 40 个主映射与首批 25 个案例的原字段均保留；`baseline-25.json` 为逐字段核对基线，新增 60 个地点由 `expansion-selection.json` 说明，`all-case-selection.json` 列出完整选址。

## 2026-10-29 全球扩展

- 85 次真实 NASA POWER 响应、**1020 个月记录**，全部来自服务明确标出的 2001–2025 期，气温°C、降水mm/day。月总降水为带月天数算法的派生值。
- **81 处** SoilGrids 真实表土 pH、砂与黏粒预测；首批 **4 处** 海水、潮间带或附生根区继续明确不适用，没有用陆地土壤冒充。首批 4 处加新增 6 处采用透明的独立邻近陆地土壤点，坐标单独列出，不移动气候点。
- **85 处** JRC v1.5 实际30米像元，另保留2个独立水面对照。0与255无数据严格区分，频率不代表水深、地下水、盐度或灌溉量。
- 洲覆盖：亚洲29、非洲14、欧洲16、北美洲15、南美洲6、大洋洲5。南极洲没有加入不相关的农业案例；本轮没有新增苔藓或南极植物条目。
- 新增农业关系有 **193 个国家商品正值背景关联**、**13 个机制比较关联**。前者独立回查本项目FAOSTAT原始统计快照，只证明该国家对应商品有生产，不证明这个地区或点的种植位置；合并商品的映射边界继续保留。后者没有本点存在记录，只把植物需求与实际地区环境比较，页面须明确标注。
- 新增60地区的背景链接中，32个为地区／所属行政区农业、流域或原始研究资料，28个仅为明确标记的国家农业背景；不能将背景链接当作所有比较植物的地方分布普查。每处的NASA、ISRIC、JRC响应均独立保存原始来源。

通过 **5645 项** 原始数据独立核验：每月值、单位、坐标、土壤换算、国家正值关联、旧案例字段、原始图块哈希、独立双ZSTD解码与Pillow地理标签／像元寻址。验证报告的SHA256必须与当前 `regions.json` 一致。`regions-ready.json` 供配音冻结程序确认固定快照就绪。

新增土壤独立点为旁遮普、山东、埃塞俄比亚高原、马里锡卡索、华盛顿韦纳奇和巴西塞拉多。原点模型返回无预测值；邻近点仅代表单独标出的陆地表土格，不能冒充原点或整个地区根层。

### 扩展包复现

```powershell
python make-expansion-selection.py
python fetch-expansion.py climate
python fetch-expansion.py soil
python fetch-expansion.py water
python repair-expansion-soil.py
python repair-expansion-water.py
python build-expansion.py
python verify-data.py
```

请求优先复用原始响应缓存。修复脚本只重试失败或部分返回的请求；土壤邻近采样有独立ID和坐标。水面取样对精确图块边界的浮点误差容许小于百万分之一像元的整数吸附，独立核验同时核对原地理变换，不移动到另一个水体。没有用预期值、区域均值或相似地区替补原始值。

以下说明保留首批25案例的来源细节；数量以本节和当前验证报告为准。

## 三种不同尺度的真实数据

1. **气候**：25 次 NASA POWER Climatology API 真实响应，每处 12 个月，共 300 月。来源响应明确为 **2001–2025**，气象源为 MERRA-2，约 0.5° 纬向 × 0.625° 经向。T2M 为 °C，PRECTOTCORR 为 mm/day。月降水总量由 mm/day 乘该时期各月平均天数计算，不冒充来源独立发布的月总量。年降水总量为派生月值相加；来源独立年均气温另保留。
2. **土壤**：ISRIC SoilGrids 2.0，250 m、0–5 cm 表土模型均值。21 处陆地区域有真实 pH、砂粒及黏粒预测。pH 原始值除以 10；砂和黏粒原始 g/kg 除以 10，转换为质量百分数。4 个海水、潮间带或附生案例明确为不适用，不能将陆地表土套为海底底泥、红树林沉积物或附生根基质。
3. **地表水**：EC JRC/Google GSW **v1.5、1984–2024** 的原生 occurrence GeoTIFF。通过 HTTP 206 Range 只读取所需 TIFF 头与 ZSTD 图块，总计约 2 MB 缓存，未下载全部全球栅格。25 处教学点均取得真实像元值。原始 0 表示未检出开阔水面，255 表示无有效数据，两者严格分开。

气候格、土壤格和水面像元不是同一空间尺度，均不是地点传感器实测。模型均值没有在本包附带土壤 Q05/Q95 区间，不应因显示小数就视为精确的土样化验值。植株实际根层、水位、岩缝、林冠、盐度及地形仍需要当地资料。

## 独立采样与水文解释

墨西哥高原、利古里亚、荷兰及琉球的原区域点没有有效陆地表土值，因此选择邻近陆地土壤格点。每个点都单独保存 `soil.samplingPoint`、`sampleLat`、`sampleLon` 和说明；不移动冻结的气候点，也不把邻近格点称为花圃或岩缝实测。利古里亚教学点由岸外 44.3°N 调整到陆地 44.4°N；重新请求 NASA 后验证所有逐月及年度数值完全相同。

土壤模型不适用的固定案例为 `tomales-bay`、`florida-coast`、`java`、`borneo`，分别涉及海湾、潮间带及附生根区。

地表水出现频率不能替代植物的可用水源：它不测量土壤水、地下水、雾露、海水盐度或灌溉量。`water.type/summary` 结合明确来源解释地区水文过程，`water.metrics` 只展示有来源的实际数值，并保留来源与时间语境。

例如，佛罗里达红树林使用潮汐咸淡水环境；托马莱斯湾大叶藻需要讨论海湾水下光和盐度；北卡罗来纳捕蝇草依赖湿润土壤及适当扰动；红杉还涉及沿海雾水。百岁兰研究所述年雨量 31 mm、地下水深 57–75 m 是论文具体样地的资料，**不是本教学点、整个纳米布或 NASA 格点的均值**。同位素研究支持其研究群体主要利用入渗雨水、雾露补充，不能推断“常有雾，所以雾就是主要水源”。

## 正负控制与修正记录

`water-controls.json` 保存原参照点和修复依据。原英国水库参照点 (52.656, -0.666) 检出 0，不能称为开阔水面；在检查主库与半岛位置后改为独立东部主库参照点 (52.65, -0.63)，取得 **95%**。杭州西湖参照点为 **98%**，托马莱斯湾点为 **98%**；英国陆地教学点为 **0%**。这些是实际读取值，没有写成预期的 100%。参照水体点与区域教学点明确分开，不证明该湖泊给本区全部植物供水。

原 TIFF 的 Predictor=1，不需要横向反差分。`verify-data.py` 使用 pyzstd 与 python-zstandard 分别解压图块并逐字节比较，再用 Pillow 的 TIFF 标签解析和像元寻址独立核对来源的地理变换、块偏移与取值。Pillow 自带 libtiff 未配置 ZSTD，验证没有把它假称为原压缩解码器。

## 复现与核验

执行环境需要 requests、Pillow；ZSTD 读取依赖保存在本目录 `python-deps` 的 zstandard，独立验证另用 pyzstd。展示应用只使用构建后的 JSON，不调用这些网络 API。

```powershell
python fetch-data.py climate
python fetch-data.py soil
python fetch-surface-water.py
python build-regions.py
python verify-data.py
```

脚本优先复用原始响应缓存，服务故障时不补造值。NASA 服务若改变默认期，脚本会拒绝沿用旧月天数算法，要求复核。`verification.json` 为结构和范围验证，`raw-verification.json` 为原始响应、单位、坐标及独立图块核对。有效报告必须与 `regions.json` 的 SHA256 相符。

## 主要来源与使用范围

- [NASA POWER Climatology API](https://power.larc.nasa.gov/docs/services/api/temporal/climatology/)：本包实际响应期为 2001–2025。
- [ISRIC SoilGrids](https://docs.isric.org/globaldata/soilgrids/) 与 [单位说明](https://docs.isric.org/globaldata/soilgrids/SoilGrids_faqs_01.html)：CC BY 4.0；REST 暂停时使用仍提供值的 WMS GetFeatureInfo。HTML 模板的 Latitude/Longitude 标签次序有误，查询按 WMS 1.1.1 标准 lon,lat；通过英国陆地与印度洋的对照请求确认，不复制错误标签。
- [JRC GSW 数据入口](https://global-surface-water.appspot.com/download)：2026-10-15 版说明，v1.5 修正旧 occurrence；本包不用存在已知问题的 Monthly Recurrence。来源署名 **Source: EC JRC/Google**；Copernicus 开放数据。Collection 1/2 拼接仍可能有地理配准残差。
- [Anglian Water 官方水库图](https://anglianwaterparks.co.uk/sites/default/files/2025-02/rutland_1_1.pdf)：参照主库与半岛位置。
- [NPS 佛罗里达红树林](https://www.nps.gov/ever/learn/nature/mangroves.htm)、[NOAA 托马莱斯湾海草](https://farallones.noaa.gov/eco/tomales/seagrass.html)、[USFWS 捕蝇草](https://www.fws.gov/species/venus-fly-trap-dionaea-muscipula)、[苏格兰湿地](https://www.environment.gov.scot/our-environment/land/wetlands/)、[NPS 红杉与雾](https://www.nps.gov/articles/000/fog-redwoods-and-a-changing-climate.htm)。
- [百岁兰根系与水源研究](https://onlinelibrary.wiley.com/doi/10.1002/eco.2039)：具体研究样地及推断限制。

分布记录说明区域关系，环境数据提供解释线索。二者与植物生理之间的联系是有边界的教学推理，不是对分布原因的单独因果证明，也不用于建议野外采集或判断地块种植适宜性。
