# 真实农业生产数据快照

`production-data.json` 为前端使用的紧凑数据，`production-build.py` 可从本目录官方源快照离线重建。`production-verify.py` 将所有出货国家数值、状态旗标和注释逐项与来源行比对。

## 来源、时间与口径

- FAO FAOSTAT **QCL: Crops and livestock products**，采用完整年度 **2024**，不是实时产量。检索于 2026-10-29；官方 bulk 文件 Last-Modified 为 2025-12-31 11:33:28 GMT。
- 官方数据：[QCL](https://www.fao.org/faostat/en/#data/QCL)、[目录与口径](https://data.fao.org/catalog/iso/d24a448b-3b62-4c09-8c1d-4a39bb599876)、[2024 数据发布说明](https://www.fao.org/statistics/highlights-archive/highlights-detail/agricultural-production-statistics-2010-2024)。原始 ZIP 为 `production-qcl-2024-official.zip`，33,921,825 字节，SHA-256 `c5835418c18f9322e7decbd6800f93a216eaae3cdfa31acb08f0518c0c6d6853`。
- 下载：[FAO official bulk ZIP](https://bulks-faostat.fao.org/production/Production_Crops_Livestock_E_All_Data_(Normalized).zip)。原始 CSV 不修改；为复核单独抽取当年所用商品的来源行 `production-selected-source-rows.csv`。
- `value` 是 element **5510 Production**，单位 **t（吨）**；`areaHa` 是 **5312 Area harvested**，单位 **ha（公顷）**。这是年度国家／统计地区总量，不能画成已知农田边界。
- 面积不是物理耕地面积；复种可重复计入。多年生作物部分地区可能报告总种植面积。详见 [FAO methodology](https://files-faostat.fao.org/production/QCL/QCL_methodology_e.pdf)。稻谷不是碾米后大米；谷物为收获干籽粒口径，鲜食、青饲和青贮另论。
- ISO3 与洲／次区域使用 [UNSD 官方 M49](https://unstats.un.org/unsd/methodology/m49/overview/) 表，已保存官方 HTML 与代码快照。FAO 台湾省 158 不在当前 UN 表中，保留来源地区名，显式连接地图代码 TWN。
- CC-BY-4.0。引用：FAO. 2025. FAOSTAT: Crops and livestock products. Accessed 29 October 2026. Licence: CC-BY-4.0.

## 可直接使用的结构

```text
metadata: sourceUrl, bulkUrl, retrievedAt, sourceUpdatedAt, year, unit, areaUnit,
          flags, meaning, missingPolicy, geographyPolicy, worldTotalPolicy
plants[]: cropId, itemCode, itemName, itemNameZh, mappingType, mappingNote,
          year, unit, areaUnit, worldTotal,
          countryProductionSum, countryProductionCoverageOfWorld,
          positiveCountryCount, missingProductionRecordCount,
          records[]
records[]: areaCode, m49, iso3, name (原 FAO 英文地区名), nameZh,
           regionCode, regionName, subregionCode,
           value, flag, note?, areaHa, areaFlag, areaNote?
```

共 92 个应用农业条目、85 个不同 FAO 商品、7,288 个国家或地区—商品记录。目录共100个农业条目；荸荠、画眉草、籽粒苋、雪莲果、菊芋、食用甜菜根、萝卜和苜蓿未强配过宽商品，保留生产统计未接入状态。38个条目采用更宽商品合计。共用商品有5组：谷子/珍珠粟/糜子、阿拉比卡/罗布斯塔、绿豆/赤小豆/菜豆、西兰花/花椰菜、芒果/番石榴。它们不是独立的统计值，不能跨条目重复加总。

新增映射保留带壳坚果、干豆、干木豆等原始产品口径。扁桃使用当前接受名 Prunus amygdalus，欧洲梨、欧洲栗、高丛蓝莓等条目的商品仍可能覆盖其他同类物种，必须阅读 mappingNote。商品含义参考[FAO豆类资料](https://openknowledge.fao.org/3/i7779en/i7779en.pdf)及[UNSD CPC干豆定义](https://unstats.un.org/unsd/classifications/Econ/Structure/Detail/en/1073/01701)。

## 前端必须保留的含义

1. **真实来源不等于逐项实测。** A 官方数值，E 估计值，I 接收机构插补值，X 外部机构数值，M 缺失值／数据无法存在；保留旗标及原注释。不要把全部数据标成“官方实测”。
2. **物种与商品分类不同。** `broader-commodity` 必须展示 `itemNameZh` 与 `mappingNote`，不能将 Millet、Coffee, green、芒果／番石榴／山竹合计等说成所选单种的全球分布。其他 `crop-commodity` 也描述商品，不是物种普查。
3. **空值不是零。** `null` 与没有该地区记录均不表示未种植；明确数值 0 才是来源报告的零。例：2024 年希腊油橄榄有收获面积 848,400 ha，却没有当年产量数值，本项目保留 `value: null`。
4. **世界总量独立保存。** `worldTotal` 直接来自 FAO World 5000，不强行凑等于公开国家记录之和。油橄榄两者约有 10.37% 差额，不用该差额反推出希腊或其他国家的“真实值”。排名应称“有数据地区排名”，而非完整普查排名。
5. **避免重复统计地区。** 国家记录排除 FAO China 351 聚合，保留 mainland 41、香港 96、澳门 128、台湾省 214，各名词按 FAO 来源口径。世界和洲聚合不进入国家记录。
6. **地图几何有自身粒度限制。** 现有 110m 世界地图缺少约 30 个小国／地区多边形，国家列表仍要保留这些真实记录。Natural Earth 的 South Sudan 代码为 SDS，真实 ISO3 为 SSD，需要显式显示连接。无多边形不等于无数据。
7. **国别着色不表示全国每处都在种植。** 只能表达“这个统计地区在当年有该商品生产／收获面积记录”。不能据此推断野生原生范围或适宜性。

## 重建与核验

```powershell
python .\production-build.py
python .\production-verify.py
```

构建需要 Python 标准库与已安装 pandas，用本地官方快照运行，不调用付费 API。
