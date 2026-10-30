# 全球植物分布记录：真实数据提取说明

本文件夹的 `distribution-global.json` 可由前端直接读取。它覆盖项目现有的 140 个代表条目，不代表地球全部植物物种。

## 数据来源和版本

- 名称及区域分布：英国皇家植物园邱园（Royal Botanic Gardens, Kew）的 **World Checklist of Vascular Plants（WCVP）第 16 版**。
- 官方批量下载：[wcvp.zip](https://sftp.kew.org/pub/data-repositories/WCVP/wcvp.zip)。访问与下载日期：2026-10-29。
- 数据实际提取日期：**2026-06-04**，来自官方包中的 `README_WCVP.xlsx`（版本“16”、Extracted: 04/06/2026）；不能标成 2026-10-29 实时分布。
- 压缩包 SHA-256：`d32ea2b3a85e489b14e83bcc9eae7274532e1d113753f7be290d4b2dfde573fa`。
- 官方 README 许可：**CC BY 3.0**，<https://creativecommons.org/licenses/by/3.0/>。
- 引用：Govaerts R (ed.). 2026. WCVP: World Checklist of Vascular Plants. Facilitated by the Royal Botanic Gardens, Kew. <https://doi.org/10.34885/egs6-cp24>. Version 16, extracted 04 Jun 2026.
- 方法与语义：[Kew About WCVP](https://powo.science.kew.org/about-wcvp)、[Kew About POWO](https://powo.science.kew.org/about)、[WCVP 方法论文](https://doi.org/10.1038/s41597-021-00997-6)。
- 地区几何：[TDWG WGSRPD Level 3 官方 GeoJSON](https://github.com/tdwg/wgsrpd/blob/master/geojson/level3.geojson)。原始文件保存在 `distribution-level3.geojson`；原 L2 文件保存在 `distribution-level2.geojson`。

## 能说明什么

WCVP 的原生和引入记录采用 WGSRPD 第三级（TDWG Level 3）植物地理区。它通常接近国家级，但中国、美国、俄罗斯等分成多个区，也有横跨现代政治边界的历史区域。因此：

1. 填色表示“这个植物地理区在资料中有这一类分布记录”，**不是该区域处处生长，更不是连续植被覆盖**。
2. `nativeCodes` 表示来源归类为原生的现存、非存疑区域。
3. `introducedCodes` 表示来源归类为引入的现存、非存疑区域。Kew 的“引入”包括归化、外来等野外分布，**不等于全部人工栽培面积、产量或种植适宜性**。
4. 有些农业植物的来源描述明确标注 `as a cultigen from …`。`cultivatedOriginContext` 从该原文识别，提示其驯化来源语境，不能把这些来源区域讲成现今野生农田。
5. 海草的区域记录表示有关沿海区域有记录；以陆地植物地理区为底图不表示它生长在陆地上。需要地图图例与讲解同时说明。
6. 未记录、超范围或无法匹配均不表示植物不存在；保留明确的状态和缺失原因。

## 提取结果

- 项目条目：140（农业100、其他代表植物40；不是140个独立物种）。
- 精确名称解析并有区域分布：137。
- 133 个按接受名匹配；4 个按完全相同的学名先匹配异名，再沿官方 `accepted_plant_name_id` 解析接受名。
- 3 个苔藓类超出 WCVP 维管植物范围：`sphagnum`、`liverwort`、`hornwort`，状态 `unsupported`；未为其猜测范围。
- 真实区域记录：11,754；其中原生 2,853、引入 8,901。4 条原生记录标注灭绝，主展示数组排除，原始状态仍保留。此提取中无存疑记录。
- 可用于主展示的现存非存疑记录：原生 2,849，引入 8,901。
- 地区几何：369；全部区域编码有对应几何，无失配编码。
- 369 区都有中文显示名；中文名为编辑翻译，原英文名和官方编码同时保留。

异名解析：

| 项目名称 | WCVP 接受名称 |
|---|---|
| Pennisetum glaucum | Cenchrus americanus |
| Lens culinaris | Vicia lens |
| Citrus sinensis | Citrus × aurantium f. aurantium |
| Raphanus sativus | Raphanus raphanistrum subsp. sativus |

## 前端 schema

```js
{
  metadata: { version, sourceExtractedAt, retrievedAt, citation, sourceUrl, license, geometry, ... },
  plants: [{
    cropId, scientificName, taxonId, sourceUrl,
    status, // available | unsupported | unmatched | unresolved | no-distribution
    nameMatch, // exact-accepted | exact-synonym-to-accepted | unmatched
    acceptedScientificName, family, geographicDescription,
    climateDescription, climateDescriptionZh, lifeForm, lifeFormZh,
    cultivatedOriginContext,
    nativeCodes, introducedCodes, extinctCodes, doubtfulCodes,
    records: [{ code, name, native, introduced, extinct, doubtful, sourceRecordId }],
    missingReason // only when unavailable
  }],
  regions: { type: 'FeatureCollection', features: [{
    type: 'Feature',
    properties: {
      code, name, nameZh, continentCode, continent, continentZh,
      regionCode, region, labelLon, labelLat, labelMeaning
    },
    geometry // Polygon or MultiPolygon, longitude/latitude
  }]}
}
```

`labelLon` / `labelLat` 是几何内部的制图文字位置，**不是植物观测点**。`climateDescriptionZh` 是 Kew 主生物群系的中文翻译，不是基于当地气象站计算的气候，也不应解释成独占的生存边界。

## 几何处理及验证

原 TDWG 粗尺度 GeoJSON 有 19 个 `MultiPolygon` 包含嵌套重叠外壳。构建脚本用 polygon union 去除冗余重叠外壳，保持这些多边形填充并集；没有添加缓冲点或人为扩展分布。原始几何文件另行保留，修复地区和原问题记录在 `distribution-verification.json` 中。输出 369 个几何均通过有效性检查。

复现：在含 `shapely` 的 Python 环境运行 `python distribution-build.py`。脚本从官方压缩包流式筛选项目学名，按官方接受名关联分布，检查 100 个 ID、主状态互斥、全部编码几何匹配、369 个中文显示名，并输出数据与检查结果。

本数据没有使用原有 200 个教学锚点来推导任何范围，也没有由气候类别推测原生或引入分布。

## 第二批农业扩展的范围说明

新增40条目的学名与地区仍使用同一WCVP官方快照。西兰花、花椰菜采用甘蓝物种级资料，食用甜菜根采用甜菜物种级资料，不能说成这些栽培群本身的种植范围。扁桃采用接受名Prunus amygdalus，避免Prunus dulcis的同名异物歧义。

栽培草莓的geographic_area是“as a naturalised artificial hybrid”，即“归化的人工杂交种”。来源CSV仍把4个区域列在native状态，原始标记保留；artificialHybridContext与cultivatedOriginContext提示不能据此声称人工杂交种在这些地区自然起源。

两个新数据包、精确范围译文、逐条引用与锚点记录证据在 ../expansion/agriculture-wave2-*.json。教学中心不是标本或农田位置。
