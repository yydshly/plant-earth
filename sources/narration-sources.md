# 全量34种作物语音导览说明

本稿共37章：总论、读图、34个作物章和比较结语。锁定正文共8441个字符；每章含3个同步节拍，每个节拍不超过80个字符。建议自然普通话讲解速度，实际总时长以MiniMax生成结果为准，不应只按字数宣称精确时长。

## 稿件及同步规则

- `segments.json` 每章的 `text` 严格等于 `beats` 中三个 `text` 顺序拼接，中间没有隐藏分隔符。
- 正文已通知音频代理锁定；后续修改正文必须先通知音频代理，避免已生成音频与文字不一致。
- 每个作物章的第一节拍是形态识别，`shapeMode=morphology`；第二、三节拍为地理与条件，`shapeMode=geography`。
- `morphology.type` 用于选择结构图；`parts` 为三个重点器官名称。形态图为教学结构示意，比例可以为识别而夸张，不代表所有品种外形相同。
- `group` 沿用34种作物原资料的六类分组。三个通论章节归入“导览说明”。

## 地理与科学边界

- 基础图使用Kottek等2006年发布、代表1951—2000年的0.5°历史气候分类。作物着色是人工归纳的气候候选，不是FAO原生逐格适宜度，不是实际耕地，不是当前气候或产量预测。
- 地理标注全部是代表点，不是精确农区范围、测量点或种植强度。不要把点、圆圈或连线画成真实农区边界。
- 已检查每个作物的两个地区节拍都落在现有数据所列的典型或条件候选类别内。油棕的沿海示例点已移到有分类资料的马来半岛内陆格点；甜橙的地中海示例移至Csa暖地，正文未改。
- 河谷、平原、高地、绿洲等以区域名称表达，不构造没有数据支持的精确地貌边界。若绘制河道或地形，应另接有来源的真实几何。
- 土壤、灌溉、品种、农时、病害与土地用途仍可能限制种植。候选重叠不意味着可在同一季节同时栽培。
- 不把“耐旱”说成无需水，不把“喜暖”说成越热越好，不把森林气候匹配当作可以开垦的许可。

## 形态特别注意

- 马铃薯：地下块茎是茎；甘薯和木薯：食用部分是块根，不应共用同一个器官标签。
- 花生：地上开花、果针入土、地下荚果；地下生长不代表是根。
- 水稻：分枝的圆锥花序；小麦和大麦：小穗沿穗轴排列。谷子、珍珠粟的穗形仅作外形识别，不将所有棒状花序都称为相同植物学类型。
- 玉米：顶部雄穗与侧生雌穗分开；玉米须与雌花结实有关。
- 向日葵：花盘由多朵小花组成；棉花：纤维附着于种子；甘蔗：主要利用茎内糖分。
- 糖用甜菜：通常画浅色储藏器官，不直接套用常见红色菜用甜菜形象。
- 香蕉：假茎由叶鞘包裹形成，不画成普通木质树干。
- 茶：采嫩芽嫩叶；咖啡、可可：利用果实内种子；油棕、椰子、椰枣虽同属棕榈类，但果实和用途不同。

## 已核对的一手资料

需求与限制主要沿用前轮已读取的34份FAO EcoCrop数据表。每章sources含该作物数据表及FAO描述页。EcoCrop约2015年停止更新，是基础知识来源，不能当作实时田块评估。地理安排为基于这些需求和现有历史气候网格的教学示例，而非FAO官方逐格作物推荐。

- [FAO/IIASA GAEZ](https://www.fao.org/gaez/en)：综合气候、土壤及管理条件的评估框架。
- [气候分类底图发布页](https://koeppen-geiger.vu-wien.ac.at/present.htm)：数据时期与来源。
- [FAO EcoCrop官方说明](https://www.fao.org/geospatial/data-and-tools/data-portals/ecocrop/en)：数据库属性与更新状态。
- [IRRI水分管理](https://ricetoday.irri.org/water-management-for-food-security-how-does-irri-contribute/)：水稻干湿交替灌溉。
- [IRRI灌溉稻手册](https://books.irri.org/9789712202193_content.pdf)：水分管理与生育阶段。
- [IRRI稻作手册](https://books.irri.org/9789712203008_content.pdf)：稻穗及小穗结构。
- [农业农村部农业遥感标准附件](https://www.moa.gov.cn/ztzl/zhnyzxd/bzgf/xb/202412/P020241220595012950353.pdf)：中国主要作物地区与一般农时；稿中没有把月份当成统一播期。
- [小麦农业气象条件](https://www.bamis.gov.bd/en/thresholds/1/all/9/)：较凉生长季、成熟期与供水。
- [USDA小麦概览](https://www.ers.usda.gov/topics/crops/wheat/wheat-sector-at-a-glance)：春麦冬麦与地区季节差异。
- [加拿大CFIA谷物形态](https://inspection.canada.ca/en/plant-health/seeds/seed-inspection-procedures/cereal-crops)：麦穗、小穗、芒与发育类型。
- [加拿大CFIA玉米生物学](https://inspection.canada.ca/en/plant-health/plant-varieties/novel-traits/applicants/directive-94-08/biology-documents/zea-mays-maize)：器官、授粉、霜冻和水分限制。
- [加拿大CFIA玉米检查资料](https://inspection.canada.ca/en/plant-health/seeds/seed-inspection-procedures/corn-seed-crop)：雄穗、雌穗、玉米须。
- [CIMMYT雨养玉米项目](https://www.cimmyt.org/projects/improving-rainfed-kharif-maize-productivity/)：不均匀降水引起干旱、热害和积水风险。
- [澳大利亚农业部作物报告](https://www.agriculture.gov.au/abares/research-topics/agricultural-outlook/australian-crop-report/december-2025)：西澳冬季作物及当季水分影响；未使用变化中的产量数值。
- [西澳DPIRD季节气候资料](https://www.dpird.wa.gov.au/siteassets/documents/newsletters/seasonal-climate-outlook/seasonal-climate-outlook-september-2024.pdf)：生长季降水和土壤储水。

## 逐作物FAO资料

- 水稻：[需求数据](https://ecocrop.apps.fao.org/ecocrop/srv/en/dataSheet?id=1574), [作物描述](https://ecocrop.apps.fao.org/ecocrop/srv/en/cropView?id=1574)
- 小麦：[需求数据](https://ecocrop.apps.fao.org/ecocrop/srv/en/dataSheet?id=2114), [作物描述](https://ecocrop.apps.fao.org/ecocrop/srv/en/cropView?id=2114)
- 玉米：[需求数据](https://ecocrop.apps.fao.org/ecocrop/srv/en/dataSheet?id=2175), [作物描述](https://ecocrop.apps.fao.org/ecocrop/srv/en/cropView?id=2175)
- 大麦：[需求数据](https://ecocrop.apps.fao.org/ecocrop/srv/en/dataSheet?id=1232), [作物描述](https://ecocrop.apps.fao.org/ecocrop/srv/en/cropView?id=1232)
- 燕麦：[需求数据](https://ecocrop.apps.fao.org/ecocrop/srv/en/dataSheet?id=481), [作物描述](https://ecocrop.apps.fao.org/ecocrop/srv/en/cropView?id=481)
- 黑麦：[需求数据](https://ecocrop.apps.fao.org/ecocrop/srv/en/dataSheet?id=1929), [作物描述](https://ecocrop.apps.fao.org/ecocrop/srv/en/cropView?id=1929)
- 高粱：[需求数据](https://ecocrop.apps.fao.org/ecocrop/srv/en/dataSheet?id=48747), [作物描述](https://ecocrop.apps.fao.org/ecocrop/srv/en/cropView?id=48747)
- 谷子（小米）：[需求数据](https://ecocrop.apps.fao.org/ecocrop/srv/en/dataSheet?id=9732), [作物描述](https://ecocrop.apps.fao.org/ecocrop/srv/en/cropView?id=9732)
- 珍珠粟：[需求数据](https://ecocrop.apps.fao.org/ecocrop/srv/en/dataSheet?id=8418), [作物描述](https://ecocrop.apps.fao.org/ecocrop/srv/en/cropView?id=8418)
- 马铃薯：[需求数据](https://ecocrop.apps.fao.org/ecocrop/srv/en/dataSheet?id=1971), [作物描述](https://ecocrop.apps.fao.org/ecocrop/srv/en/cropView?id=1971)
- 木薯：[需求数据](https://ecocrop.apps.fao.org/ecocrop/srv/en/dataSheet?id=1420), [作物描述](https://ecocrop.apps.fao.org/ecocrop/srv/en/cropView?id=1420)
- 甘薯：[需求数据](https://ecocrop.apps.fao.org/ecocrop/srv/en/dataSheet?id=1265), [作物描述](https://ecocrop.apps.fao.org/ecocrop/srv/en/cropView?id=1265)
- 大豆：[需求数据](https://ecocrop.apps.fao.org/ecocrop/srv/en/dataSheet?id=1150), [作物描述](https://ecocrop.apps.fao.org/ecocrop/srv/en/cropView?id=1150)
- 花生：[需求数据](https://ecocrop.apps.fao.org/ecocrop/srv/en/dataSheet?id=2199), [作物描述](https://ecocrop.apps.fao.org/ecocrop/srv/en/cropView?id=2199)
- 向日葵：[需求数据](https://ecocrop.apps.fao.org/ecocrop/srv/en/dataSheet?id=1191), [作物描述](https://ecocrop.apps.fao.org/ecocrop/srv/en/cropView?id=1191)
- 油菜：[需求数据](https://ecocrop.apps.fao.org/ecocrop/srv/en/dataSheet?id=549), [作物描述](https://ecocrop.apps.fao.org/ecocrop/srv/en/cropView?id=549)
- 鹰嘴豆：[需求数据](https://ecocrop.apps.fao.org/ecocrop/srv/en/dataSheet?id=2479), [作物描述](https://ecocrop.apps.fao.org/ecocrop/srv/en/cropView?id=2479)
- 小扁豆：[需求数据](https://ecocrop.apps.fao.org/ecocrop/srv/en/dataSheet?id=7209), [作物描述](https://ecocrop.apps.fao.org/ecocrop/srv/en/cropView?id=7209)
- 豇豆：[需求数据](https://ecocrop.apps.fao.org/ecocrop/srv/en/dataSheet?id=2153), [作物描述](https://ecocrop.apps.fao.org/ecocrop/srv/en/cropView?id=2153)
- 棉花：[需求数据](https://ecocrop.apps.fao.org/ecocrop/srv/en/dataSheet?id=1160), [作物描述](https://ecocrop.apps.fao.org/ecocrop/srv/en/cropView?id=1160)
- 甘蔗：[需求数据](https://ecocrop.apps.fao.org/ecocrop/srv/en/dataSheet?id=1884), [作物描述](https://ecocrop.apps.fao.org/ecocrop/srv/en/cropView?id=1884)
- 甜菜：[需求数据](https://ecocrop.apps.fao.org/ecocrop/srv/en/dataSheet?id=514), [作物描述](https://ecocrop.apps.fao.org/ecocrop/srv/en/cropView?id=514)
- 茶：[需求数据](https://ecocrop.apps.fao.org/ecocrop/srv/en/dataSheet?id=599), [作物描述](https://ecocrop.apps.fao.org/ecocrop/srv/en/cropView?id=599)
- 阿拉比卡咖啡：[需求数据](https://ecocrop.apps.fao.org/ecocrop/srv/en/dataSheet?id=749), [作物描述](https://ecocrop.apps.fao.org/ecocrop/srv/en/cropView?id=749)
- 罗布斯塔咖啡：[需求数据](https://ecocrop.apps.fao.org/ecocrop/srv/en/dataSheet?id=750), [作物描述](https://ecocrop.apps.fao.org/ecocrop/srv/en/cropView?id=750)
- 可可：[需求数据](https://ecocrop.apps.fao.org/ecocrop/srv/en/dataSheet?id=2074), [作物描述](https://ecocrop.apps.fao.org/ecocrop/srv/en/cropView?id=2074)
- 油棕：[需求数据](https://ecocrop.apps.fao.org/ecocrop/srv/en/dataSheet?id=972), [作物描述](https://ecocrop.apps.fao.org/ecocrop/srv/en/cropView?id=972)
- 香蕉：[需求数据](https://ecocrop.apps.fao.org/ecocrop/srv/en/dataSheet?id=7848), [作物描述](https://ecocrop.apps.fao.org/ecocrop/srv/en/cropView?id=7848)
- 椰子：[需求数据](https://ecocrop.apps.fao.org/ecocrop/srv/en/dataSheet?id=744), [作物描述](https://ecocrop.apps.fao.org/ecocrop/srv/en/cropView?id=744)
- 葡萄：[需求数据](https://ecocrop.apps.fao.org/ecocrop/srv/en/dataSheet?id=2160), [作物描述](https://ecocrop.apps.fao.org/ecocrop/srv/en/cropView?id=2160)
- 油橄榄：[需求数据](https://ecocrop.apps.fao.org/ecocrop/srv/en/dataSheet?id=1553), [作物描述](https://ecocrop.apps.fao.org/ecocrop/srv/en/cropView?id=1553)
- 甜橙：[需求数据](https://ecocrop.apps.fao.org/ecocrop/srv/en/dataSheet?id=720), [作物描述](https://ecocrop.apps.fao.org/ecocrop/srv/en/cropView?id=720)
- 苹果：[需求数据](https://ecocrop.apps.fao.org/ecocrop/srv/en/dataSheet?id=1407), [作物描述](https://ecocrop.apps.fao.org/ecocrop/srv/en/cropView?id=1407)
- 椰枣：[需求数据](https://ecocrop.apps.fao.org/ecocrop/srv/en/dataSheet?id=1673), [补充来源](https://www.fao.org/4/y4360e/y4360e08.htm), [补充来源](https://www.fao.org/4/y4360e/y4360e0b.htm), [作物描述](https://ecocrop.apps.fao.org/ecocrop/srv/en/cropView?id=1673)

## 发音建议

“分蘖”读fēn niè，“穗轴”读suì zhóu，“苞叶”读bāo yè，“灌排”读guàn pái，“豇豆”读jiāng dòu，“抽薹”读chōu tái。年份已采用中文读法；拉丁学名、Köppen代码和英文机构缩写不要求旁白机械读出。音色使用MiniMax现成普通话讲解音色，不模仿真实人物身份。
