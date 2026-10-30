import {WAVE3_PATH,WAVE3_COURSES} from './biodiversity-wave3.js';
// Observation paths are teaching perspectives, not taxonomic ranks.
const freeze=value=>{if(value&&typeof value==='object'){Object.values(value).forEach(freeze);Object.freeze(value);}return value;};
export const BIODIVERSITY_PATHS=freeze([WAVE3_PATH,
  {
    "id": "seasonal-woods",
    "title": "看落叶林怎样过四季",
    "intro": "从叶片、果实和更新方式认识林地。四种成员并非同科，季节相近也不表示根区要求相同。",
    "courseIds": [
      "englishoak",
      "silverbirch",
      "sugarmaple",
      "dogrose"
    ]
  },
  {
    "id": "forest-layers",
    "title": "从林冠走到林下",
    "intro": "比较高大乔木、禾草、树蕨与附生植物。把树上、林下和地表分开看，不把森林的年雨量等同每种植物的用水。",
    "courseIds": [
      "eucalyptus",
      "bamboo",
      "orchid",
      "treefern",
      "birdsnestfern",
      "maidenhair"
    ]
  },
  {
    "id": "dryland-strategies",
    "title": "看干旱中的不同办法",
    "intro": "乔木、仙人掌、肉质叶、裸子植物和卷柏都能出现在干旱地区，储水、减少消耗与忍受失水却是不同策略。",
    "courseIds": [
      "baobab",
      "saguaro",
      "pricklypear",
      "agave",
      "aloe",
      "welwitschia",
      "resurrection"
    ]
  },
  {
    "id": "water-habitats",
    "title": "把水分成五种生境",
    "intro": "依次区分潮间带、挺水、浮叶、沉水海草和自由漂浮植物。都有水，不等于盐度、水深、底质和光照相同。",
    "courseIds": [
      "redmangrove",
      "lotus",
      "waterlily",
      "eelgrass",
      "duckweed"
    ]
  },
  {
    "id": "aromatics-seasons",
    "title": "香草与鳞茎怎样安排季节",
    "intro": "比较木质香草和地下鳞茎。芳香、观赏用途是生活中的组织方式，不能替代亲缘与器官名称。",
    "courseIds": [
      "lavender",
      "rosemary",
      "tulip"
    ]
  },
  {
    "id": "carnivorous-wetlands",
    "title": "贫营养湿地为什么有食虫植物",
    "intro": "捕虫叶补充矿质营养，光合作用仍然不可缺少；湿地水位、营养和开放光照必须一起理解。",
    "courseIds": [
      "venusflytrap",
      "sundew"
    ]
  },
  {
    "id": "cool-mountains",
    "title": "凉爽与山地不是一个标签",
    "intro": "从针叶、球果和高山草本比较温度、地形与根区水分。同在凉爽地区，也有不同的光照、排水和耐旱要求。",
    "courseIds": [
      "scotspine",
      "norwayspruce",
      "cedar",
      "edelweiss"
    ]
  },
  {
    "id": "seed-lineages",
    "title": "分清几种常被混淆的裸子植物",
    "intro": "比较银杏、海岸红杉、水杉与苏铁的种子、叶和季节。它们属于不同谱系，不能用“古老植物”概括其生境。",
    "courseIds": [
      "ginkgo",
      "coastredwood",
      "dawnredwood",
      "cycad"
    ]
  },
  {
    "id": "spores-microhabitats",
    "title": "走近孢子植物的小生境",
    "intro": "辨认问荆、石松、藓、苔与角苔，比较有无维管组织和不同繁殖结构。大尺度气候不能代替几厘米范围的湿度与裸土。",
    "courseIds": [
      "horsetail",
      "clubmoss",
      "sphagnum",
      "liverwort",
      "hornwort"
    ]
  }
]);
export const BIODIVERSITY_COURSES=freeze([...WAVE3_COURSES,
  {
    "id": "englishoak",
    "cropId": "englishoak",
    "name": "夏栎",
    "latin": "Quercus robur",
    "pathId": "seasonal-woods",
    "group": "温带森林",
    "definition": "长柄橡实与圆裂叶辨认夏栎；它是温带落叶阔叶林的代表。",
    "organs": "圆裂的阔叶、较长果柄上的橡实，以及落叶乔木的树冠是组合线索；橡实是真正果实。",
    "adaptations": "落叶使生长集中在有利季节，橡实供动物取食。",
    "environment": "把冬季休眠、暖季展叶与根区储水放在一起看。短时河水上涨和全年缺氧不是同一种环境。 温带季节、稳定根区水分与有更新空间的林地。 冬季落叶休眠，暖季形成树冠；热旱与土层储水须一起看。 偏好有稳定水分的根区。 允许季节性湿润，仍需根区通气。",
    "misconception": "橡树不是一种植物；这里专指夏栎，不能把所有栎属的环境要求合并。",
    "regionId": "uk-lowland",
    "region": {
      "id": "uk-lowland",
      "name": "英国低地林地与淡水环境",
      "lon": -1,
      "lat": 52,
      "pointMeaning": "地区教学采样点，不是物种观测点、植物精确位置或全地区平均。"
    },
    "rootzone": "soil",
    "evidenceChecks": {
      "climate": "先比较十二个月的温度与降水率，区分生长季、冷季和干湿季。空气格点气温不是水温或叶面温度。",
      "soil": "可生于较重而湿润的土壤。 允许季节性湿润，仍需根区通气。 土壤栅格是区域背景，不是根旁取样；酸碱度不能单独证明排水或养分足够。",
      "water": "偏好有稳定水分的根区。 能耐周期洪水，不等于全年缺氧也合适。 降雨与可用水不同，需结合供水位置、季节和排水。"
    },
    "caseText": "以英国低地林地与淡水环境作为地区案例。NASA POWER 2001–2025格点：最冷月1月，月均温3.7°C；最暖月7月，月均温17.1°C。这是气候格点背景；把冬季休眠、暖季展叶与根区储水放在一起看。短时河水上涨和全年缺氧不是同一种环境。地图采样点不证明该处有这一物种。",
    "question": {
      "id": "bio-check-englishoak",
      "title": "夏栎 · 想一想",
      "prompt": "英国低地同时有林地和湿地，解释夏栎生长时最该保留哪种区别？",
      "options": [
        "比较生长季供水与根区通气，不把所有湿地都当作栎林。",
        "只要英国有降雨，任何长期泡水地点都一样适合。",
        "橡树都长橡实，因此所有栎属植物需要相同环境。"
      ],
      "correctIndex": 0,
      "feedback": [
        "温带气候提供季节背景；根区能否储水而又有氧，以及林下更新空间，仍影响夏栎。",
        "这个判断忽略了器官、出现方式或水热条件中的关键差别。温带气候提供季节背景；根区能否储水而又有氧，以及林下更新空间，仍影响夏栎。",
        "不能从名称、外观或一次记录跳到这个结论。温带气候提供季节背景；根区能否储水而又有氧，以及林下更新空间，仍影响夏栎。"
      ],
      "explanation": "温带气候提供季节背景；根区能否储水而又有氧，以及林下更新空间，仍影响夏栎。",
      "nextHint": "回到器官图和地区证据，分别说出一条已知事实与一条还需要当地核对的信息。",
      "sources": [
        {
          "title": "Kew · 夏栎",
          "url": "https://powo.science.kew.org/taxon/urn:lsid:ipni.org:names:304293-2/general-information",
          "supports": "接受学名、欧洲至伊朗的原生范围、裂叶及长柄橡实。"
        },
        {
          "title": "SANBI · Quercus robur",
          "url": "https://pza.sanbi.org/quercus-robur",
          "supports": "低地湿润土壤、周期洪水、落叶树形与生态作用。"
        },
        {
          "title": "Kew：Oak tree",
          "url": "https://www.kew.org/plants/oak-tree",
          "supports": "夏栎器官、原生语境与林地生态"
        },
        {
          "title": "NASA POWER：英国低地林地与淡水环境气候格点，2001–2025",
          "url": "https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M%2CPRECTOTCORR&community=AG&longitude=-1&latitude=52&format=JSON",
          "supports": "该采样格点十二个月的气温与平均日降水率；不是树旁、林内、水下或整地区实测。"
        }
      ]
    },
    "sources": [
      {
        "title": "Kew · 夏栎",
        "url": "https://powo.science.kew.org/taxon/urn:lsid:ipni.org:names:304293-2/general-information",
        "supports": "接受学名、欧洲至伊朗的原生范围、裂叶及长柄橡实。"
      },
      {
        "title": "SANBI · Quercus robur",
        "url": "https://pza.sanbi.org/quercus-robur",
        "supports": "低地湿润土壤、周期洪水、落叶树形与生态作用。"
      },
      {
        "title": "Kew：Oak tree",
        "url": "https://www.kew.org/plants/oak-tree",
        "supports": "夏栎器官、原生语境与林地生态"
      },
      {
        "title": "NASA POWER：英国低地林地与淡水环境气候格点，2001–2025",
        "url": "https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M%2CPRECTOTCORR&community=AG&longitude=-1&latitude=52&format=JSON",
        "supports": "该采样格点十二个月的气温与平均日降水率；不是树旁、林内、水下或整地区实测。"
      }
    ],
    "steps": [
      {
        "title": "认识形态",
        "text": "长柄橡实与圆裂叶辨认夏栎；它是温带落叶阔叶林的代表。 圆裂的阔叶、较长果柄上的橡实，以及落叶乔木的树冠是组合线索；橡实是真正果实。",
        "action": {
          "kind": "morphology",
          "regionId": "uk-lowland"
        }
      },
      {
        "title": "环境机制",
        "text": "落叶使生长集中在有利季节，橡实供动物取食。 把冬季休眠、暖季展叶与根区储水放在一起看。短时河水上涨和全年缺氧不是同一种环境。 温带季节、稳定根区水分与有更新空间的林地。 冬季落叶休眠，暖季形成树冠；热旱与土层储水须一起看。 偏好有稳定水分的根区。 允许季节性湿润，仍需根区通气。 橡树不是一种植物；这里专指夏栎，不能把所有栎属的环境要求合并。",
        "action": {
          "kind": "environment",
          "regionId": "uk-lowland"
        }
      },
      {
        "title": "地区证据",
        "text": "以英国低地林地与淡水环境作为地区案例。NASA POWER 2001–2025格点：最冷月1月，月均温3.7°C；最暖月7月，月均温17.1°C。这是气候格点背景；把冬季休眠、暖季展叶与根区储水放在一起看。短时河水上涨和全年缺氧不是同一种环境。地图采样点不证明该处有这一物种。",
        "action": {
          "kind": "region",
          "regionId": "uk-lowland"
        }
      }
    ],
    "regionRole": "regional-context",
    "substrateKind": "terrestrial",
    "substrateNote": "可生于较重而湿润的土壤。 允许季节性湿润，仍需根区通气。 土壤栅格是区域背景，不是根旁取样；酸碱度不能单独证明排水或养分足够。",
    "soilCaution": "可生于较重而湿润的土壤。 允许季节性湿润，仍需根区通气。 土壤栅格是区域背景，不是根旁取样；酸碱度不能单独证明排水或养分足够。"
  },
  {
    "id": "silverbirch",
    "cropId": "silverbirch",
    "name": "垂枝桦",
    "latin": "Betula pendula",
    "pathId": "seasonal-woods",
    "group": "温带森林",
    "definition": "白树皮和下垂细枝醒目，垂枝桦常在开阔地或林隙率先生长。",
    "organs": "纸状剥落的白树皮、下垂细枝和带翅小种子帮助辨认；花集中在柔荑花序中。",
    "adaptations": "细小带翅种子有助扩散到空地。",
    "environment": "开阔光照有利于建立，但夏季热与根区失水仍可能造成胁迫；扩散快不等于到处都能长期生长。 凉爽夏季、明亮林隙、疏松而适度湿润的根区。 偏好凉爽夏季；耐冬寒不表示耐夏季热旱。 根区宜保持适度水分。 长时间积水不利根系。",
    "misconception": "白色树皮不代表所有白桦同种；垂枝桦与其他桦树的耐湿、耐热性有差别。",
    "regionId": "finland-forest",
    "region": {
      "id": "finland-forest",
      "name": "芬兰南部森林",
      "lon": 25,
      "lat": 61,
      "pointMeaning": "地区教学采样点，不是物种观测点、植物精确位置或全地区平均。"
    },
    "rootzone": "soil",
    "evidenceChecks": {
      "climate": "先比较十二个月的温度与降水率，区分生长季、冷季和干湿季。空气格点气温不是水温或叶面温度。",
      "soil": "偏好轻质、疏松的壤土或砂质土。 长时间积水不利根系。 土壤栅格是区域背景，不是根旁取样；酸碱度不能单独证明排水或养分足够。",
      "water": "根区宜保持适度水分。 轻质土易排水，也容易失水。 降雨与可用水不同，需结合供水位置、季节和排水。"
    },
    "caseText": "以芬兰南部森林作为地区案例。NASA POWER 2001–2025格点：最冷月1月，月均温-7.8°C；最暖月7月，月均温17.5°C。这是气候格点背景；开阔光照有利于建立，但夏季热与根区失水仍可能造成胁迫；扩散快不等于到处都能长期生长。地图采样点不证明该处有这一物种。",
    "question": {
      "id": "bio-check-silverbirch",
      "title": "垂枝桦 · 想一想",
      "prompt": "垂枝桦的种子能飘到一片空地，能否据此判定那里适合它？",
      "options": [
        "白树皮能替根供水，不必查看干旱。",
        "还要核对凉爽程度、根区水分与后续竞争。",
        "种子到达就保证幼树存活并形成森林。"
      ],
      "correctIndex": 1,
      "feedback": [
        "不能从名称、外观或一次记录跳到这个结论。带翅种子解释到达机会，气候、土壤和竞争共同影响能否定居；传播与适生是两步。",
        "带翅种子解释到达机会，气候、土壤和竞争共同影响能否定居；传播与适生是两步。",
        "这个判断忽略了器官、出现方式或水热条件中的关键差别。带翅种子解释到达机会，气候、土壤和竞争共同影响能否定居；传播与适生是两步。"
      ],
      "explanation": "带翅种子解释到达机会，气候、土壤和竞争共同影响能否定居；传播与适生是两步。",
      "nextHint": "回到器官图和地区证据，分别说出一条已知事实与一条还需要当地核对的信息。",
      "sources": [
        {
          "title": "Kew · Betula pendula",
          "url": "https://powo.science.kew.org/taxon/urn:lsid:ipni.org:names:295174-1",
          "supports": "接受学名、科及温带欧亚等原生范围。"
        },
        {
          "title": "NC State · 垂枝桦",
          "url": "https://plants.ces.ncsu.edu/plants/betula-pendula/",
          "supports": "白色树皮、下垂枝、先锋树种、凉夏和根区水分。"
        },
        {
          "title": "Forest Research / Reading · 树种指南",
          "url": "https://cdn.forestresearch.gov.uk/2024/02/Agroforestry-Tree-Species-Guide-v5.pdf",
          "supports": "银桦对高温、干旱和积水的敏感性及轻质酸性土。"
        },
        {
          "title": "NASA POWER：芬兰南部森林气候格点，2001–2025",
          "url": "https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M%2CPRECTOTCORR&community=AG&longitude=25&latitude=61&format=JSON",
          "supports": "该采样格点十二个月的气温与平均日降水率；不是树旁、林内、水下或整地区实测。"
        }
      ]
    },
    "sources": [
      {
        "title": "Kew · Betula pendula",
        "url": "https://powo.science.kew.org/taxon/urn:lsid:ipni.org:names:295174-1",
        "supports": "接受学名、科及温带欧亚等原生范围。"
      },
      {
        "title": "NC State · 垂枝桦",
        "url": "https://plants.ces.ncsu.edu/plants/betula-pendula/",
        "supports": "白色树皮、下垂枝、先锋树种、凉夏和根区水分。"
      },
      {
        "title": "Forest Research / Reading · 树种指南",
        "url": "https://cdn.forestresearch.gov.uk/2024/02/Agroforestry-Tree-Species-Guide-v5.pdf",
        "supports": "银桦对高温、干旱和积水的敏感性及轻质酸性土。"
      },
      {
        "title": "NASA POWER：芬兰南部森林气候格点，2001–2025",
        "url": "https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M%2CPRECTOTCORR&community=AG&longitude=25&latitude=61&format=JSON",
        "supports": "该采样格点十二个月的气温与平均日降水率；不是树旁、林内、水下或整地区实测。"
      }
    ],
    "steps": [
      {
        "title": "认识形态",
        "text": "白树皮和下垂细枝醒目，垂枝桦常在开阔地或林隙率先生长。 纸状剥落的白树皮、下垂细枝和带翅小种子帮助辨认；花集中在柔荑花序中。",
        "action": {
          "kind": "morphology",
          "regionId": "finland-forest"
        }
      },
      {
        "title": "环境机制",
        "text": "细小带翅种子有助扩散到空地。 开阔光照有利于建立，但夏季热与根区失水仍可能造成胁迫；扩散快不等于到处都能长期生长。 凉爽夏季、明亮林隙、疏松而适度湿润的根区。 偏好凉爽夏季；耐冬寒不表示耐夏季热旱。 根区宜保持适度水分。 长时间积水不利根系。 白色树皮不代表所有白桦同种；垂枝桦与其他桦树的耐湿、耐热性有差别。",
        "action": {
          "kind": "environment",
          "regionId": "finland-forest"
        }
      },
      {
        "title": "地区证据",
        "text": "以芬兰南部森林作为地区案例。NASA POWER 2001–2025格点：最冷月1月，月均温-7.8°C；最暖月7月，月均温17.5°C。这是气候格点背景；开阔光照有利于建立，但夏季热与根区失水仍可能造成胁迫；扩散快不等于到处都能长期生长。地图采样点不证明该处有这一物种。",
        "action": {
          "kind": "region",
          "regionId": "finland-forest"
        }
      }
    ],
    "regionRole": "regional-context",
    "substrateKind": "terrestrial",
    "substrateNote": "偏好轻质、疏松的壤土或砂质土。 长时间积水不利根系。 土壤栅格是区域背景，不是根旁取样；酸碱度不能单独证明排水或养分足够。",
    "soilCaution": "偏好轻质、疏松的壤土或砂质土。 长时间积水不利根系。 土壤栅格是区域背景，不是根旁取样；酸碱度不能单独证明排水或养分足够。"
  },
  {
    "id": "sugarmaple",
    "cropId": "sugarmaple",
    "name": "糖枫",
    "latin": "Acer saccharum",
    "pathId": "seasonal-woods",
    "group": "温带森林",
    "definition": "糖枫以掌状叶和成对翅果识别，是北美东部落叶林及枫糖文化的代表。",
    "organs": "掌状叶和成对翅果便于观察；糖枫的树液、花果和幼树是不同的生长部分。",
    "adaptations": "幼树耐荫，使它能在林冠下等待光隙。",
    "environment": "幼树能在较阴的林下生活，但耐荫不表示耐干热；较深、湿润而排水的根区有利于生长。 温带湿润林地，深厚肥沃且排水良好的土壤；幼树耐荫。 适应明显季节变化；树液采集所需天气与全年生长需求是两回事。 喜欢湿润而不闷水的林地。 湿润与良好排水需并存。",
    "misconception": "枫糖不是把任意枫树种在寒冷地方就能稳定生产；物种、季节和树势都重要。",
    "regionId": "quebec-forest",
    "region": {
      "id": "quebec-forest",
      "name": "加拿大魁北克南部阔叶林",
      "lon": -72.5,
      "lat": 46.5,
      "pointMeaning": "地区教学采样点，不是物种观测点、植物精确位置或全地区平均。"
    },
    "rootzone": "soil",
    "evidenceChecks": {
      "climate": "先比较十二个月的温度与降水率，区分生长季、冷季和干湿季。空气格点气温不是水温或叶面温度。",
      "soil": "偏好肥沃、腐殖质较多的深土。 湿润与良好排水需并存。 土壤栅格是区域背景，不是根旁取样；酸碱度不能单独证明排水或养分足够。",
      "water": "喜欢湿润而不闷水的林地。 不能用采汁多少代替树木健康判断。 降雨与可用水不同，需结合供水位置、季节和排水。"
    },
    "caseText": "以加拿大魁北克南部阔叶林作为地区案例。NASA POWER 2001–2025格点：最冷月1月，月均温-13.4°C；最暖月7月，月均温19.8°C。这是气候格点背景；幼树能在较阴的林下生活，但耐荫不表示耐干热；较深、湿润而排水的根区有利于生长。地图采样点不证明该处有这一物种。",
    "question": {
      "id": "bio-check-sugarmaple",
      "title": "糖枫 · 想一想",
      "prompt": "糖枫幼树可以耐荫，能推断它也不怕根区长期干热吗？",
      "options": [
        "耐荫就表示对光、水和温度都没有要求。",
        "所有枫树在寒冷国家都能同样稳定产糖。",
        "不能；光照耐受与水分、温度限制要分别核对。"
      ],
      "correctIndex": 2,
      "feedback": [
        "这个判断忽略了器官、出现方式或水热条件中的关键差别。耐荫描述光环境，不能代替根的水分条件；树种、季节和树势也影响树液利用。",
        "不能从名称、外观或一次记录跳到这个结论。耐荫描述光环境，不能代替根的水分条件；树种、季节和树势也影响树液利用。",
        "耐荫描述光环境，不能代替根的水分条件；树种、季节和树势也影响树液利用。"
      ],
      "explanation": "耐荫描述光环境，不能代替根的水分条件；树种、季节和树势也影响树液利用。",
      "nextHint": "回到器官图和地区证据，分别说出一条已知事实与一条还需要当地核对的信息。",
      "sources": [
        {
          "title": "Kew POWO · Acer saccharum",
          "url": "https://powo.science.kew.org/taxon/urn:lsid:ipni.org:names:56795-1",
          "supports": "接受学名、现代无患子科归属，以及魁北克和佛蒙特原生范围。"
        },
        {
          "title": "US Forest Service · 糖枫",
          "url": "https://research.fs.usda.gov/feis/species-reviews/acesac",
          "supports": "北美东部原生范围、林地生态与更新；旧文的槭树科不用于现代分类。"
        },
        {
          "title": "Ohio State University · Acer saccharum",
          "url": "https://u.osu.edu/plants/acer-saccharum/",
          "supports": "掌状叶、双翅果、湿润肥沃偏酸土和耐荫性。"
        },
        {
          "title": "NASA POWER：加拿大魁北克南部阔叶林气候格点，2001–2025",
          "url": "https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M%2CPRECTOTCORR&community=AG&longitude=-72.5&latitude=46.5&format=JSON",
          "supports": "该采样格点十二个月的气温与平均日降水率；不是树旁、林内、水下或整地区实测。"
        }
      ]
    },
    "sources": [
      {
        "title": "Kew POWO · Acer saccharum",
        "url": "https://powo.science.kew.org/taxon/urn:lsid:ipni.org:names:56795-1",
        "supports": "接受学名、现代无患子科归属，以及魁北克和佛蒙特原生范围。"
      },
      {
        "title": "US Forest Service · 糖枫",
        "url": "https://research.fs.usda.gov/feis/species-reviews/acesac",
        "supports": "北美东部原生范围、林地生态与更新；旧文的槭树科不用于现代分类。"
      },
      {
        "title": "Ohio State University · Acer saccharum",
        "url": "https://u.osu.edu/plants/acer-saccharum/",
        "supports": "掌状叶、双翅果、湿润肥沃偏酸土和耐荫性。"
      },
      {
        "title": "NASA POWER：加拿大魁北克南部阔叶林气候格点，2001–2025",
        "url": "https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M%2CPRECTOTCORR&community=AG&longitude=-72.5&latitude=46.5&format=JSON",
        "supports": "该采样格点十二个月的气温与平均日降水率；不是树旁、林内、水下或整地区实测。"
      }
    ],
    "steps": [
      {
        "title": "认识形态",
        "text": "糖枫以掌状叶和成对翅果识别，是北美东部落叶林及枫糖文化的代表。 掌状叶和成对翅果便于观察；糖枫的树液、花果和幼树是不同的生长部分。",
        "action": {
          "kind": "morphology",
          "regionId": "quebec-forest"
        }
      },
      {
        "title": "环境机制",
        "text": "幼树耐荫，使它能在林冠下等待光隙。 幼树能在较阴的林下生活，但耐荫不表示耐干热；较深、湿润而排水的根区有利于生长。 温带湿润林地，深厚肥沃且排水良好的土壤；幼树耐荫。 适应明显季节变化；树液采集所需天气与全年生长需求是两回事。 喜欢湿润而不闷水的林地。 湿润与良好排水需并存。 枫糖不是把任意枫树种在寒冷地方就能稳定生产；物种、季节和树势都重要。",
        "action": {
          "kind": "environment",
          "regionId": "quebec-forest"
        }
      },
      {
        "title": "地区证据",
        "text": "以加拿大魁北克南部阔叶林作为地区案例。NASA POWER 2001–2025格点：最冷月1月，月均温-13.4°C；最暖月7月，月均温19.8°C。这是气候格点背景；幼树能在较阴的林下生活，但耐荫不表示耐干热；较深、湿润而排水的根区有利于生长。地图采样点不证明该处有这一物种。",
        "action": {
          "kind": "region",
          "regionId": "quebec-forest"
        }
      }
    ],
    "regionRole": "regional-context",
    "substrateKind": "terrestrial",
    "substrateNote": "偏好肥沃、腐殖质较多的深土。 湿润与良好排水需并存。 土壤栅格是区域背景，不是根旁取样；酸碱度不能单独证明排水或养分足够。",
    "soilCaution": "偏好肥沃、腐殖质较多的深土。 湿润与良好排水需并存。 土壤栅格是区域背景，不是根旁取样；酸碱度不能单独证明排水或养分足够。"
  },
  {
    "id": "baobab",
    "cropId": "baobab",
    "name": "非洲猴面包树",
    "latin": "Adansonia digitata",
    "pathId": "dryland-strategies",
    "group": "热带森林与稀树草原",
    "definition": "膨大的树干、掌状复叶与下垂大花，构成非洲干季落叶乔木的鲜明形态。",
    "organs": "膨大的主干、掌状复叶和下垂花是识别线索；本课专指非洲猴面包树。",
    "adaptations": "粗大组织储水，落叶减少干季消耗。",
    "environment": "树体储水与干季落叶有助于应对季节性缺水，补充水分和幼树建立仍依靠有利的雨季与土层。 暖热少霜、干湿季明显且排水良好的林地。 需要暖热而少霜的环境；严寒不是它的强项。 适应有明显干季的林地。 持续涝湿容易出问题。",
    "misconception": "猴面包树有多个物种；这里是非洲的 Adansonia digitata，不是马达加斯加全部种类。",
    "regionId": "limpopo",
    "region": {
      "id": "limpopo",
      "name": "南非林波波暖干林地",
      "lon": 30.1,
      "lat": -22.7,
      "pointMeaning": "地区教学采样点，不是物种观测点、植物精确位置或全地区平均。"
    },
    "rootzone": "soil",
    "evidenceChecks": {
      "climate": "先比较十二个月的温度与降水率，区分生长季、冷季和干湿季。空气格点气温不是水温或叶面温度。",
      "soil": "常见于石质而排水良好的地面。 持续涝湿容易出问题。 土壤栅格是区域背景，不是根旁取样；酸碱度不能单独证明排水或养分足够。",
      "water": "适应有明显干季的林地。 耐旱不等于完全不需水。 降雨与可用水不同，需结合供水位置、季节和排水。"
    },
    "caseText": "以南非林波波暖干林地作为地区案例。NASA POWER 2001–2025格点：最冷月7月，月均温17.4°C；最暖月12月，月均温27.1°C。这是气候格点背景；树体储水与干季落叶有助于应对季节性缺水，补充水分和幼树建立仍依靠有利的雨季与土层。地图采样点不证明该处有这一物种。",
    "question": {
      "id": "bio-check-baobab",
      "title": "非洲猴面包树 · 想一想",
      "prompt": "猴面包树主干粗大并能储水，最合理的理解是什么？",
      "options": [
        "储水缓冲缺水，仍需要补水机会和幼苗建立条件。",
        "粗树干说明它一生不必吸水。",
        "所有非洲干旱地都能形成同样的猴面包树林。"
      ],
      "correctIndex": 0,
      "feedback": [
        "储水是已有水分的利用策略，不能创造水；寒冷、积水和干旱强度仍然限制生长。",
        "这个判断忽略了器官、出现方式或水热条件中的关键差别。储水是已有水分的利用策略，不能创造水；寒冷、积水和干旱强度仍然限制生长。",
        "不能从名称、外观或一次记录跳到这个结论。储水是已有水分的利用策略，不能创造水；寒冷、积水和干旱强度仍然限制生长。"
      ],
      "explanation": "储水是已有水分的利用策略，不能创造水；寒冷、积水和干旱强度仍然限制生长。",
      "nextHint": "回到器官图和地区证据，分别说出一条已知事实与一条还需要当地核对的信息。",
      "sources": [
        {
          "title": "SANBI · 非洲猴面包树",
          "url": "https://pza.sanbi.org/adansonia-digitata",
          "supports": "学名科、非洲原生分布、暖干林地、霜冻和排水限制。"
        },
        {
          "title": "Kew · Wild Plants for a Sustainable Future",
          "url": "https://www.kew.org/sites/default/files/2019-04/Sustainable%20wild%20plants.pdf",
          "supports": "粗大树干、掌状复叶、下垂花及果实的器官特征。"
        },
        {
          "title": "Kew POWO：Adansonia digitata",
          "url": "https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A558628-1/general-information",
          "supports": "非洲干旱季节背景与落叶乔木形态"
        },
        {
          "title": "NASA POWER：南非林波波暖干林地气候格点，2001–2025",
          "url": "https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M%2CPRECTOTCORR&community=AG&longitude=30.1&latitude=-22.7&format=JSON",
          "supports": "该采样格点十二个月的气温与平均日降水率；不是树旁、林内、水下或整地区实测。"
        }
      ]
    },
    "sources": [
      {
        "title": "SANBI · 非洲猴面包树",
        "url": "https://pza.sanbi.org/adansonia-digitata",
        "supports": "学名科、非洲原生分布、暖干林地、霜冻和排水限制。"
      },
      {
        "title": "Kew · Wild Plants for a Sustainable Future",
        "url": "https://www.kew.org/sites/default/files/2019-04/Sustainable%20wild%20plants.pdf",
        "supports": "粗大树干、掌状复叶、下垂花及果实的器官特征。"
      },
      {
        "title": "Kew POWO：Adansonia digitata",
        "url": "https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A558628-1/general-information",
        "supports": "非洲干旱季节背景与落叶乔木形态"
      },
      {
        "title": "NASA POWER：南非林波波暖干林地气候格点，2001–2025",
        "url": "https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M%2CPRECTOTCORR&community=AG&longitude=30.1&latitude=-22.7&format=JSON",
        "supports": "该采样格点十二个月的气温与平均日降水率；不是树旁、林内、水下或整地区实测。"
      }
    ],
    "steps": [
      {
        "title": "认识形态",
        "text": "膨大的树干、掌状复叶与下垂大花，构成非洲干季落叶乔木的鲜明形态。 膨大的主干、掌状复叶和下垂花是识别线索；本课专指非洲猴面包树。",
        "action": {
          "kind": "morphology",
          "regionId": "limpopo"
        }
      },
      {
        "title": "环境机制",
        "text": "粗大组织储水，落叶减少干季消耗。 树体储水与干季落叶有助于应对季节性缺水，补充水分和幼树建立仍依靠有利的雨季与土层。 暖热少霜、干湿季明显且排水良好的林地。 需要暖热而少霜的环境；严寒不是它的强项。 适应有明显干季的林地。 持续涝湿容易出问题。 猴面包树有多个物种；这里是非洲的 Adansonia digitata，不是马达加斯加全部种类。",
        "action": {
          "kind": "environment",
          "regionId": "limpopo"
        }
      },
      {
        "title": "地区证据",
        "text": "以南非林波波暖干林地作为地区案例。NASA POWER 2001–2025格点：最冷月7月，月均温17.4°C；最暖月12月，月均温27.1°C。这是气候格点背景；树体储水与干季落叶有助于应对季节性缺水，补充水分和幼树建立仍依靠有利的雨季与土层。地图采样点不证明该处有这一物种。",
        "action": {
          "kind": "region",
          "regionId": "limpopo"
        }
      }
    ],
    "regionRole": "regional-context",
    "substrateKind": "terrestrial",
    "substrateNote": "常见于石质而排水良好的地面。 持续涝湿容易出问题。 土壤栅格是区域背景，不是根旁取样；酸碱度不能单独证明排水或养分足够。",
    "soilCaution": "常见于石质而排水良好的地面。 持续涝湿容易出问题。 土壤栅格是区域背景，不是根旁取样；酸碱度不能单独证明排水或养分足够。"
  },
  {
    "id": "eucalyptus",
    "cropId": "eucalyptus",
    "name": "蓝桉",
    "latin": "Eucalyptus globulus",
    "pathId": "forest-layers",
    "group": "温带森林",
    "definition": "蓝桉的幼叶与成熟叶形不同；它是澳大利亚温带地区的高大常绿被子植物。",
    "organs": "蓝桉幼叶与成年叶形不同，木质蒴果、常绿树冠和长势可一起观察；它是被子植物。",
    "adaptations": "常绿叶与旺盛生长使其成为重要林木。",
    "environment": "它原生于澳大利亚东南部及塔斯马尼亚一带。温和气候、根区深度、排水和供水都值得查看。 温和气候、较深土层及良好排水，生长季有可用水。 适应温和气候；霜冻、夏旱与土层水分共同限制生长。 深土储水可缓冲季节性缺雨。 良好排水和低盐分重要。",
    "misconception": "桉树并非都来自热带，也不能把蓝桉的要求套给整个桉属。",
    "regionId": "tasmania",
    "region": {
      "id": "tasmania",
      "name": "澳大利亚塔斯马尼亚林谷",
      "lon": 146.5,
      "lat": -42.5,
      "pointMeaning": "地区教学采样点，不是物种观测点、植物精确位置或全地区平均。"
    },
    "rootzone": "soil",
    "evidenceChecks": {
      "climate": "先比较十二个月的温度与降水率，区分生长季、冷季和干湿季。空气格点气温不是水温或叶面温度。",
      "soil": "可适应多种土质，深厚土更能缓冲旱期。 良好排水和低盐分重要。 土壤栅格是区域背景，不是根旁取样；酸碱度不能单独证明排水或养分足够。",
      "water": "深土储水可缓冲季节性缺雨。 长得快不等于耗水影响可以忽略。 降雨与可用水不同，需结合供水位置、季节和排水。"
    },
    "caseText": "以澳大利亚塔斯马尼亚林谷作为地区案例。NASA POWER 2001–2025格点：最冷月7月，月均温4.8°C；最暖月2月，月均温13.4°C。这是气候格点背景；它原生于澳大利亚东南部及塔斯马尼亚一带。温和气候、根区深度、排水和供水都值得查看。地图采样点不证明该处有这一物种。",
    "question": {
      "id": "bio-check-eucalyptus",
      "title": "蓝桉 · 想一想",
      "prompt": "看到“澳大利亚桉树”，应该直接把蓝桉归为热带雨林树吗？",
      "options": [
        "长得高就证明土壤和可用水都不再限制它。",
        "不应该；要按蓝桉具体物种和温带原生地区核对。",
        "澳大利亚的树都生长在相同热带环境。"
      ],
      "correctIndex": 1,
      "feedback": [
        "不能从名称、外观或一次记录跳到这个结论。蓝桉不能代表整个桉属；温带地区也有常绿高大被子植物，生长仍受根区条件影响。",
        "蓝桉不能代表整个桉属；温带地区也有常绿高大被子植物，生长仍受根区条件影响。",
        "这个判断忽略了器官、出现方式或水热条件中的关键差别。蓝桉不能代表整个桉属；温带地区也有常绿高大被子植物，生长仍受根区条件影响。"
      ],
      "explanation": "蓝桉不能代表整个桉属；温带地区也有常绿高大被子植物，生长仍受根区条件影响。",
      "nextHint": "回到器官图和地区证据，分别说出一条已知事实与一条还需要当地核对的信息。",
      "sources": [
        {
          "title": "Kew · 蓝桉",
          "url": "https://powo.science.kew.org/taxon/urn:lsid:ipni.org:names:592965-1",
          "supports": "接受学名、桃金娘科、维多利亚南部及塔斯马尼亚原生范围。"
        },
        {
          "title": "US Forest Service · Bluegum",
          "url": "https://www.srs.fs.usda.gov/pubs/misc/ag_654/volume_2/eucalyptus/globulus.htm",
          "supports": "原生地、引种林、幼成年叶、土层排水和季节供水。"
        },
        {
          "title": "USDA Forest Service：Tasmanian bluegum",
          "url": "https://research.fs.usda.gov/feis/species-reviews/eucglo",
          "supports": "塔斯马尼亚原生语境、排水与水分"
        },
        {
          "title": "NASA POWER：澳大利亚塔斯马尼亚林谷气候格点，2001–2025",
          "url": "https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M%2CPRECTOTCORR&community=AG&longitude=146.5&latitude=-42.5&format=JSON",
          "supports": "该采样格点十二个月的气温与平均日降水率；不是树旁、林内、水下或整地区实测。"
        }
      ]
    },
    "sources": [
      {
        "title": "Kew · 蓝桉",
        "url": "https://powo.science.kew.org/taxon/urn:lsid:ipni.org:names:592965-1",
        "supports": "接受学名、桃金娘科、维多利亚南部及塔斯马尼亚原生范围。"
      },
      {
        "title": "US Forest Service · Bluegum",
        "url": "https://www.srs.fs.usda.gov/pubs/misc/ag_654/volume_2/eucalyptus/globulus.htm",
        "supports": "原生地、引种林、幼成年叶、土层排水和季节供水。"
      },
      {
        "title": "USDA Forest Service：Tasmanian bluegum",
        "url": "https://research.fs.usda.gov/feis/species-reviews/eucglo",
        "supports": "塔斯马尼亚原生语境、排水与水分"
      },
      {
        "title": "NASA POWER：澳大利亚塔斯马尼亚林谷气候格点，2001–2025",
        "url": "https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M%2CPRECTOTCORR&community=AG&longitude=146.5&latitude=-42.5&format=JSON",
        "supports": "该采样格点十二个月的气温与平均日降水率；不是树旁、林内、水下或整地区实测。"
      }
    ],
    "steps": [
      {
        "title": "认识形态",
        "text": "蓝桉的幼叶与成熟叶形不同；它是澳大利亚温带地区的高大常绿被子植物。 蓝桉幼叶与成年叶形不同，木质蒴果、常绿树冠和长势可一起观察；它是被子植物。",
        "action": {
          "kind": "morphology",
          "regionId": "tasmania"
        }
      },
      {
        "title": "环境机制",
        "text": "常绿叶与旺盛生长使其成为重要林木。 它原生于澳大利亚东南部及塔斯马尼亚一带。温和气候、根区深度、排水和供水都值得查看。 温和气候、较深土层及良好排水，生长季有可用水。 适应温和气候；霜冻、夏旱与土层水分共同限制生长。 深土储水可缓冲季节性缺雨。 良好排水和低盐分重要。 桉树并非都来自热带，也不能把蓝桉的要求套给整个桉属。",
        "action": {
          "kind": "environment",
          "regionId": "tasmania"
        }
      },
      {
        "title": "地区证据",
        "text": "以澳大利亚塔斯马尼亚林谷作为地区案例。NASA POWER 2001–2025格点：最冷月7月，月均温4.8°C；最暖月2月，月均温13.4°C。这是气候格点背景；它原生于澳大利亚东南部及塔斯马尼亚一带。温和气候、根区深度、排水和供水都值得查看。地图采样点不证明该处有这一物种。",
        "action": {
          "kind": "region",
          "regionId": "tasmania"
        }
      }
    ],
    "regionRole": "regional-context",
    "substrateKind": "terrestrial",
    "substrateNote": "可适应多种土质，深厚土更能缓冲旱期。 良好排水和低盐分重要。 土壤栅格是区域背景，不是根旁取样；酸碱度不能单独证明排水或养分足够。",
    "soilCaution": "可适应多种土质，深厚土更能缓冲旱期。 良好排水和低盐分重要。 土壤栅格是区域背景，不是根旁取样；酸碱度不能单独证明排水或养分足够。"
  },
  {
    "id": "redmangrove",
    "cropId": "redmangrove",
    "name": "美洲红树",
    "latin": "Rhizophora mangle",
    "pathId": "water-habitats",
    "group": "海岸与湿地",
    "definition": "支柱根托住树体，长条繁殖体可随水传播；这是红树林中的一个具体物种。",
    "organs": "拱起的支柱根、对生叶和长条繁殖体很显眼；繁殖体可在母树上发育后随水传播。",
    "adaptations": "支柱根支撑并参与气体交换，胎生繁殖利于潮间带。",
    "environment": "潮间带既有盐又可能缺氧。根系支撑、气体交换和繁殖方式有助生活，但潮位、盐度与寒冷仍是限制。 温暖潮间带，合适潮位、根区水分和稳定沉积物。 适应温暖海岸，向寒冷地区扩展会受到低温限制。 潮汐和根区水分比年降雨更直接。 水湿环境是生境，仍需匹配潮汐交换。",
    "misconception": "红树林是生境群落，不是一种树；不同红树植物的根系和潮位偏好不同。",
    "regionId": "florida-coast",
    "region": {
      "id": "florida-coast",
      "name": "美国佛罗里达南部海岸",
      "lon": -80.8,
      "lat": 25.3,
      "pointMeaning": "地区教学采样点，不是物种观测点、植物精确位置或全地区平均。"
    },
    "rootzone": "soil",
    "evidenceChecks": {
      "climate": "先比较十二个月的温度与降水率，区分生长季、冷季和干湿季。空气格点气温不是水温或叶面温度。",
      "soil": "能扎根于沙、壤或泥质海岸沉积物。 水湿环境是生境，仍需匹配潮汐交换。 土壤栅格是区域背景，不是根旁取样；酸碱度不能单独证明排水或养分足够。",
      "water": "潮汐和根区水分比年降雨更直接。 不是越咸、越深的海水越适合。 降雨与可用水不同，需结合供水位置、季节和排水。"
    },
    "caseText": "以美国佛罗里达南部海岸作为地区案例。NASA POWER 2001–2025格点：最冷月1月，月均温20.2°C；最暖月8月，月均温29.3°C。这是气候格点背景；潮间带既有盐又可能缺氧。根系支撑、气体交换和繁殖方式有助生活，但潮位、盐度与寒冷仍是限制。地图采样点不证明该处有这一物种。",
    "question": {
      "id": "bio-check-redmangrove",
      "title": "美洲红树 · 想一想",
      "prompt": "美洲红树在海边生长，哪种环境判断更完整？",
      "options": [
        "只需年降雨量，海水与淡水没有区别。",
        "支柱根表示海岸任何深度都能长红树林。",
        "同时核对潮汐淹水、盐度、底质稳定性与低温。"
      ],
      "correctIndex": 2,
      "feedback": [
        "这个判断忽略了器官、出现方式或水热条件中的关键差别。红树林是多个物种组成的生境群落；本种能耐盐，不表示无限耐盐、无限耐淹或不怕寒冷。",
        "不能从名称、外观或一次记录跳到这个结论。红树林是多个物种组成的生境群落；本种能耐盐，不表示无限耐盐、无限耐淹或不怕寒冷。",
        "红树林是多个物种组成的生境群落；本种能耐盐，不表示无限耐盐、无限耐淹或不怕寒冷。"
      ],
      "explanation": "红树林是多个物种组成的生境群落；本种能耐盐，不表示无限耐盐、无限耐淹或不怕寒冷。",
      "nextHint": "回到器官图和地区证据，分别说出一条已知事实与一条还需要当地核对的信息。",
      "sources": [
        {
          "title": "Kew · Rhizophora mangle",
          "url": "https://powo.science.kew.org/taxon/urn:lsid:ipni.org:names:30061148-2/general-information",
          "supports": "接受名、红树科及佛罗里达到热带美洲和西非原生范围。"
        },
        {
          "title": "UF/IFAS · Red Mangrove",
          "url": "https://edis.ifas.ufl.edu/publication/FR460",
          "supports": "支柱根、胎生繁殖体、叶形与滨海生境。"
        },
        {
          "title": "UF/IFAS · 园艺环境",
          "url": "https://edis.ifas.ufl.edu/publication/FP502",
          "supports": "喜光、湿润至水湿土壤、耐盐而不耐旱。"
        },
        {
          "title": "NASA POWER：美国佛罗里达南部海岸气候格点，2001–2025",
          "url": "https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M%2CPRECTOTCORR&community=AG&longitude=-80.8&latitude=25.3&format=JSON",
          "supports": "该采样格点十二个月的气温与平均日降水率；不是树旁、林内、水下或整地区实测。"
        }
      ]
    },
    "sources": [
      {
        "title": "Kew · Rhizophora mangle",
        "url": "https://powo.science.kew.org/taxon/urn:lsid:ipni.org:names:30061148-2/general-information",
        "supports": "接受名、红树科及佛罗里达到热带美洲和西非原生范围。"
      },
      {
        "title": "UF/IFAS · Red Mangrove",
        "url": "https://edis.ifas.ufl.edu/publication/FR460",
        "supports": "支柱根、胎生繁殖体、叶形与滨海生境。"
      },
      {
        "title": "UF/IFAS · 园艺环境",
        "url": "https://edis.ifas.ufl.edu/publication/FP502",
        "supports": "喜光、湿润至水湿土壤、耐盐而不耐旱。"
      },
      {
        "title": "NASA POWER：美国佛罗里达南部海岸气候格点，2001–2025",
        "url": "https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M%2CPRECTOTCORR&community=AG&longitude=-80.8&latitude=25.3&format=JSON",
        "supports": "该采样格点十二个月的气温与平均日降水率；不是树旁、林内、水下或整地区实测。"
      }
    ],
    "steps": [
      {
        "title": "认识形态",
        "text": "支柱根托住树体，长条繁殖体可随水传播；这是红树林中的一个具体物种。 拱起的支柱根、对生叶和长条繁殖体很显眼；繁殖体可在母树上发育后随水传播。",
        "action": {
          "kind": "morphology",
          "regionId": "florida-coast"
        }
      },
      {
        "title": "环境机制",
        "text": "支柱根支撑并参与气体交换，胎生繁殖利于潮间带。 潮间带既有盐又可能缺氧。根系支撑、气体交换和繁殖方式有助生活，但潮位、盐度与寒冷仍是限制。 温暖潮间带，合适潮位、根区水分和稳定沉积物。 适应温暖海岸，向寒冷地区扩展会受到低温限制。 潮汐和根区水分比年降雨更直接。 水湿环境是生境，仍需匹配潮汐交换。 红树林是生境群落，不是一种树；不同红树植物的根系和潮位偏好不同。",
        "action": {
          "kind": "environment",
          "regionId": "florida-coast"
        }
      },
      {
        "title": "地区证据",
        "text": "以美国佛罗里达南部海岸作为地区案例。NASA POWER 2001–2025格点：最冷月1月，月均温20.2°C；最暖月8月，月均温29.3°C。这是气候格点背景；潮间带既有盐又可能缺氧。根系支撑、气体交换和繁殖方式有助生活，但潮位、盐度与寒冷仍是限制。地图采样点不证明该处有这一物种。",
        "action": {
          "kind": "region",
          "regionId": "florida-coast"
        }
      }
    ],
    "regionRole": "regional-context",
    "substrateKind": "terrestrial",
    "substrateNote": "能扎根于沙、壤或泥质海岸沉积物。 水湿环境是生境，仍需匹配潮汐交换。 土壤栅格是区域背景，不是根旁取样；酸碱度不能单独证明排水或养分足够。",
    "soilCaution": "能扎根于沙、壤或泥质海岸沉积物。 水湿环境是生境，仍需匹配潮汐交换。 土壤栅格是区域背景，不是根旁取样；酸碱度不能单独证明排水或养分足够。"
  },
  {
    "id": "bamboo",
    "cropId": "bamboo",
    "name": "毛竹",
    "latin": "Phyllostachys edulis",
    "pathId": "forest-layers",
    "group": "竹类与草本",
    "definition": "毛竹是禾本科的木质化大型草本，竹秆有节，地下竹鞭连接新笋。",
    "organs": "竹秆有节，地下横向根茎连接新笋。毛竹虽可高大木质化，分类上仍属禾本科开花植物。",
    "adaptations": "地下根茎储藏并横向扩展。",
    "environment": "地下根茎储藏并扩展，新笋和竹叶生长都需要水分；温暖湿润并不意味着根区长期泡水。 温暖湿润生长季，肥沃而能排水的土层。 喜欢温暖生长季和较凉冬季；严重低温会损伤叶和秆。 偏好稳定湿润的土层。 保持湿润而能排水。",
    "misconception": "竹子虽高大且坚硬，分类上仍是禾本科被子植物，不是裸子树或棕榈。",
    "regionId": "zhejiang",
    "region": {
      "id": "zhejiang",
      "name": "中国浙江东部丘陵与湿地",
      "lon": 119.9,
      "lat": 30.2,
      "pointMeaning": "地区教学采样点，不是物种观测点、植物精确位置或全地区平均。"
    },
    "rootzone": "soil",
    "evidenceChecks": {
      "climate": "先比较十二个月的温度与降水率，区分生长季、冷季和干湿季。空气格点气温不是水温或叶面温度。",
      "soil": "肥沃、富腐殖质土有利生长。 保持湿润而能排水。 土壤栅格是区域背景，不是根旁取样；酸碱度不能单独证明排水或养分足够。",
      "water": "偏好稳定湿润的土层。 湿润不等于根茎长期缺氧。 降雨与可用水不同，需结合供水位置、季节和排水。"
    },
    "caseText": "以中国浙江东部丘陵与湿地作为地区案例。NASA POWER 2001–2025格点：最冷月1月，月均温3.5°C；最暖月7月，月均温27.8°C。这是气候格点背景；地下根茎储藏并扩展，新笋和竹叶生长都需要水分；温暖湿润并不意味着根区长期泡水。地图采样点不证明该处有这一物种。",
    "question": {
      "id": "bio-check-bamboo",
      "title": "毛竹 · 想一想",
      "prompt": "毛竹长得高又坚硬，应该如何理解它？",
      "options": [
        "它是禾本科植物，地下根茎参与储藏和扩展。",
        "它一定是裸子植物，因为竹秆像树干。",
        "竹鞭就是吸水根，和地下茎完全没有区别。"
      ],
      "correctIndex": 0,
      "feedback": [
        "外形高大不能代替分类；根茎具有节、芽和储藏功能，新竹也会受旱和根区通气限制。",
        "这个判断忽略了器官、出现方式或水热条件中的关键差别。外形高大不能代替分类；根茎具有节、芽和储藏功能，新竹也会受旱和根区通气限制。",
        "不能从名称、外观或一次记录跳到这个结论。外形高大不能代替分类；根茎具有节、芽和储藏功能，新竹也会受旱和根区通气限制。"
      ],
      "explanation": "外形高大不能代替分类；根茎具有节、芽和储藏功能，新竹也会受旱和根区通气限制。",
      "nextHint": "回到器官图和地区证据，分别说出一条已知事实与一条还需要当地核对的信息。",
      "sources": [
        {
          "title": "Kew · 毛竹",
          "url": "https://powo.science.kew.org/taxon/urn:lsid:ipni.org:names:415998-1",
          "supports": "接受名、禾本科、中国与台湾原生范围及日本引入。"
        },
        {
          "title": "Missouri Botanical Garden · Moso bamboo",
          "url": "https://plantfinder.mobot.org/PlantFinderDetails.aspx?isprofile=0&taxonid=285363",
          "supports": "地下根茎、竹秆、土壤水分、光照及扩展生长。"
        },
        {
          "title": "Flora of China：Phyllostachys edulis",
          "url": "https://efloras.org/florataxon.aspx?flora_id=2&taxon_id=242445237",
          "supports": "毛竹的竹秆、新笋、禾本科身份与浙江地区语境"
        },
        {
          "title": "NASA POWER：中国浙江东部丘陵与湿地气候格点，2001–2025",
          "url": "https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M%2CPRECTOTCORR&community=AG&longitude=119.9&latitude=30.2&format=JSON",
          "supports": "该采样格点十二个月的气温与平均日降水率；不是树旁、林内、水下或整地区实测。"
        }
      ]
    },
    "sources": [
      {
        "title": "Kew · 毛竹",
        "url": "https://powo.science.kew.org/taxon/urn:lsid:ipni.org:names:415998-1",
        "supports": "接受名、禾本科、中国与台湾原生范围及日本引入。"
      },
      {
        "title": "Missouri Botanical Garden · Moso bamboo",
        "url": "https://plantfinder.mobot.org/PlantFinderDetails.aspx?isprofile=0&taxonid=285363",
        "supports": "地下根茎、竹秆、土壤水分、光照及扩展生长。"
      },
      {
        "title": "Flora of China：Phyllostachys edulis",
        "url": "https://efloras.org/florataxon.aspx?flora_id=2&taxon_id=242445237",
        "supports": "毛竹的竹秆、新笋、禾本科身份与浙江地区语境"
      },
      {
        "title": "NASA POWER：中国浙江东部丘陵与湿地气候格点，2001–2025",
        "url": "https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M%2CPRECTOTCORR&community=AG&longitude=119.9&latitude=30.2&format=JSON",
        "supports": "该采样格点十二个月的气温与平均日降水率；不是树旁、林内、水下或整地区实测。"
      }
    ],
    "steps": [
      {
        "title": "认识形态",
        "text": "毛竹是禾本科的木质化大型草本，竹秆有节，地下竹鞭连接新笋。 竹秆有节，地下横向根茎连接新笋。毛竹虽可高大木质化，分类上仍属禾本科开花植物。",
        "action": {
          "kind": "morphology",
          "regionId": "zhejiang"
        }
      },
      {
        "title": "环境机制",
        "text": "地下根茎储藏并横向扩展。 地下根茎储藏并扩展，新笋和竹叶生长都需要水分；温暖湿润并不意味着根区长期泡水。 温暖湿润生长季，肥沃而能排水的土层。 喜欢温暖生长季和较凉冬季；严重低温会损伤叶和秆。 偏好稳定湿润的土层。 保持湿润而能排水。 竹子虽高大且坚硬，分类上仍是禾本科被子植物，不是裸子树或棕榈。",
        "action": {
          "kind": "environment",
          "regionId": "zhejiang"
        }
      },
      {
        "title": "地区证据",
        "text": "以中国浙江东部丘陵与湿地作为地区案例。NASA POWER 2001–2025格点：最冷月1月，月均温3.5°C；最暖月7月，月均温27.8°C。这是气候格点背景；地下根茎储藏并扩展，新笋和竹叶生长都需要水分；温暖湿润并不意味着根区长期泡水。地图采样点不证明该处有这一物种。",
        "action": {
          "kind": "region",
          "regionId": "zhejiang"
        }
      }
    ],
    "regionRole": "regional-context",
    "substrateKind": "terrestrial",
    "substrateNote": "肥沃、富腐殖质土有利生长。 保持湿润而能排水。 土壤栅格是区域背景，不是根旁取样；酸碱度不能单独证明排水或养分足够。",
    "soilCaution": "肥沃、富腐殖质土有利生长。 保持湿润而能排水。 土壤栅格是区域背景，不是根旁取样；酸碱度不能单独证明排水或养分足够。"
  },
  {
    "id": "saguaro",
    "cropId": "saguaro",
    "name": "巨人柱",
    "latin": "Carnegiea gigantea",
    "pathId": "dryland-strategies",
    "group": "荒漠与多肉",
    "definition": "巨人柱以带纵肋的储水茎和成年侧臂识别，是索诺兰沙漠的代表仙人掌。",
    "organs": "带纵肋的肉质茎是主要储水和光合器官，侧臂随个体成熟可能出现，不能用侧臂数量直接判年龄。",
    "adaptations": "茎储水，纵肋允许体积变化。",
    "environment": "索诺兰荒漠的降水季节与低温共同影响生存。幼苗常需要遮护结构与有利湿润时段，成株耐旱不能代表幼苗。 暖热且有季节降水的索诺兰沙漠，排水土与幼苗庇护。 暖热环境适合成年株，但低温限制其范围，幼苗又怕暴晒失水。 雨季脉冲对补水与更新重要。 持续湿闷不适合肉质根茎系统。",
    "misconception": "“仙人掌耐旱”不能推出所有沙漠都适合巨人柱；索诺兰的水热组合很特别。",
    "regionId": "sonoran",
    "region": {
      "id": "sonoran",
      "name": "美国亚利桑那索诺兰荒漠",
      "lon": -111.1,
      "lat": 32.2,
      "pointMeaning": "地区教学采样点，不是物种观测点、植物精确位置或全地区平均。"
    },
    "rootzone": "soil",
    "evidenceChecks": {
      "climate": "先比较十二个月的温度与降水率，区分生长季、冷季和干湿季。空气格点气温不是水温或叶面温度。",
      "soil": "常在岩坡和排水良好的粗质土上。 持续湿闷不适合肉质根茎系统。 土壤栅格是区域背景，不是根旁取样；酸碱度不能单独证明排水或养分足够。",
      "water": "雨季脉冲对补水与更新重要。 最干的荒漠区域未必适合它。 降雨与可用水不同，需结合供水位置、季节和排水。"
    },
    "caseText": "以美国亚利桑那索诺兰荒漠作为地区案例。NASA POWER 2001–2025格点：最冷月12月，月均温9.7°C；最暖月7月，月均温29.4°C。这是气候格点背景；索诺兰荒漠的降水季节与低温共同影响生存。幼苗常需要遮护结构与有利湿润时段，成株耐旱不能代表幼苗。地图采样点不证明该处有这一物种。",
    "question": {
      "id": "bio-check-saguaro",
      "title": "巨人柱 · 想一想",
      "prompt": "巨人柱耐旱，为什么仍要看月度降水与幼苗遮护？",
      "options": [
        "有刺就表示所有冷沙漠也适合巨人柱。",
        "建立期和补水时机仍受水热条件与微生境影响。",
        "耐旱表示种子在任何干沙里都会成活。"
      ],
      "correctIndex": 1,
      "feedback": [
        "不能从名称、外观或一次记录跳到这个结论。储水茎有助成株缓冲缺水，但原生范围并非所有沙漠；严寒、夏季干旱和幼苗建立仍重要。",
        "储水茎有助成株缓冲缺水，但原生范围并非所有沙漠；严寒、夏季干旱和幼苗建立仍重要。",
        "这个判断忽略了器官、出现方式或水热条件中的关键差别。储水茎有助成株缓冲缺水，但原生范围并非所有沙漠；严寒、夏季干旱和幼苗建立仍重要。"
      ],
      "explanation": "储水茎有助成株缓冲缺水，但原生范围并非所有沙漠；严寒、夏季干旱和幼苗建立仍重要。",
      "nextHint": "回到器官图和地区证据，分别说出一条已知事实与一条还需要当地核对的信息。",
      "sources": [
        {
          "title": "US Forest Service · Saguaro",
          "url": "https://research.fs.usda.gov/feis/species-reviews/cargig",
          "supports": "仙人掌科、索诺兰沙漠原生范围、降水季节、幼苗更新和寒冷限制。"
        },
        {
          "title": "Oregon State University · 巨人柱",
          "url": "https://landscapeplants.oregonstate.edu/plants/carnegiea-gigantea",
          "supports": "柱状肋、刺、花果、排水和原生地。"
        },
        {
          "title": "NASA POWER：美国亚利桑那索诺兰荒漠气候格点，2001–2025",
          "url": "https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M%2CPRECTOTCORR&community=AG&longitude=-111.1&latitude=32.2&format=JSON",
          "supports": "该采样格点十二个月的气温与平均日降水率；不是树旁、林内、水下或整地区实测。"
        }
      ]
    },
    "sources": [
      {
        "title": "US Forest Service · Saguaro",
        "url": "https://research.fs.usda.gov/feis/species-reviews/cargig",
        "supports": "仙人掌科、索诺兰沙漠原生范围、降水季节、幼苗更新和寒冷限制。"
      },
      {
        "title": "Oregon State University · 巨人柱",
        "url": "https://landscapeplants.oregonstate.edu/plants/carnegiea-gigantea",
        "supports": "柱状肋、刺、花果、排水和原生地。"
      },
      {
        "title": "NASA POWER：美国亚利桑那索诺兰荒漠气候格点，2001–2025",
        "url": "https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M%2CPRECTOTCORR&community=AG&longitude=-111.1&latitude=32.2&format=JSON",
        "supports": "该采样格点十二个月的气温与平均日降水率；不是树旁、林内、水下或整地区实测。"
      }
    ],
    "steps": [
      {
        "title": "认识形态",
        "text": "巨人柱以带纵肋的储水茎和成年侧臂识别，是索诺兰沙漠的代表仙人掌。 带纵肋的肉质茎是主要储水和光合器官，侧臂随个体成熟可能出现，不能用侧臂数量直接判年龄。",
        "action": {
          "kind": "morphology",
          "regionId": "sonoran"
        }
      },
      {
        "title": "环境机制",
        "text": "茎储水，纵肋允许体积变化。 索诺兰荒漠的降水季节与低温共同影响生存。幼苗常需要遮护结构与有利湿润时段，成株耐旱不能代表幼苗。 暖热且有季节降水的索诺兰沙漠，排水土与幼苗庇护。 暖热环境适合成年株，但低温限制其范围，幼苗又怕暴晒失水。 雨季脉冲对补水与更新重要。 持续湿闷不适合肉质根茎系统。 “仙人掌耐旱”不能推出所有沙漠都适合巨人柱；索诺兰的水热组合很特别。",
        "action": {
          "kind": "environment",
          "regionId": "sonoran"
        }
      },
      {
        "title": "地区证据",
        "text": "以美国亚利桑那索诺兰荒漠作为地区案例。NASA POWER 2001–2025格点：最冷月12月，月均温9.7°C；最暖月7月，月均温29.4°C。这是气候格点背景；索诺兰荒漠的降水季节与低温共同影响生存。幼苗常需要遮护结构与有利湿润时段，成株耐旱不能代表幼苗。地图采样点不证明该处有这一物种。",
        "action": {
          "kind": "region",
          "regionId": "sonoran"
        }
      }
    ],
    "regionRole": "regional-context",
    "substrateKind": "terrestrial",
    "substrateNote": "常在岩坡和排水良好的粗质土上。 持续湿闷不适合肉质根茎系统。 土壤栅格是区域背景，不是根旁取样；酸碱度不能单独证明排水或养分足够。",
    "soilCaution": "常在岩坡和排水良好的粗质土上。 持续湿闷不适合肉质根茎系统。 土壤栅格是区域背景，不是根旁取样；酸碱度不能单独证明排水或养分足够。"
  },
  {
    "id": "pricklypear",
    "cropId": "pricklypear",
    "name": "梨果仙人掌",
    "latin": "Opuntia ficus-indica",
    "pathId": "dryland-strategies",
    "group": "荒漠与多肉",
    "definition": "扁平的掌片是茎而非大叶；花与肉质果实长在茎节上。",
    "organs": "扁平掌片是茎节，花和肉质果长在茎节上；它不是长着巨大扁叶的普通灌木。",
    "adaptations": "扁平茎兼顾光合与储水。",
    "environment": "光合茎兼顾储水，生长和结果仍需要供水；长期栽培与传播使原生来源解释必须保持谨慎。 暖热、日照充足、排水良好；形成花果仍需供水。 适应暖热环境，寒冷冬季会限制一些栽培地区。 能利用储水承受干期。 对长期积水和根区缺氧敏感。",
    "misconception": "梨果仙人掌原生地受长期驯化历史影响；本页用栽培点，不把所有出现处都叫原生。",
    "regionId": "mexico-plateau",
    "region": {
      "id": "mexico-plateau",
      "name": "墨西哥中部高原",
      "lon": -100.9,
      "lat": 22.1,
      "pointMeaning": "地区教学采样点，不是物种观测点、植物精确位置或全地区平均。"
    },
    "rootzone": "soil",
    "evidenceChecks": {
      "climate": "先比较十二个月的温度与降水率，区分生长季、冷季和干湿季。空气格点气温不是水温或叶面温度。",
      "soil": "适合根区通气良好的砂质或深土。 对长期积水和根区缺氧敏感。 土壤栅格是区域背景，不是根旁取样；酸碱度不能单独证明排水或养分足够。",
      "water": "能利用储水承受干期。 耐旱存活不能直接等于稳定产果。 降雨与可用水不同，需结合供水位置、季节和排水。"
    },
    "caseText": "以墨西哥中部高原作为地区案例。NASA POWER 2001–2025格点：最冷月1月，月均温12.5°C；最暖月5月，月均温21.9°C。这是气候格点背景；光合茎兼顾储水，生长和结果仍需要供水；长期栽培与传播使原生来源解释必须保持谨慎。地图采样点不证明该处有这一物种。",
    "question": {
      "id": "bio-check-pricklypear",
      "title": "梨果仙人掌 · 想一想",
      "prompt": "墨西哥栽培的梨果仙人掌，哪种读法更可靠？",
      "options": [
        "扁平掌片一定是普通叶片。",
        "任何有栽培的国家都属于它确定的原生范围。",
        "分清掌片是茎，并把栽培地点与原生范围区分。"
      ],
      "correctIndex": 2,
      "feedback": [
        "这个判断忽略了器官、出现方式或水热条件中的关键差别。茎节的结构能说明器官功能；人类种植、引入野生和原生记录则是不同证据。",
        "不能从名称、外观或一次记录跳到这个结论。茎节的结构能说明器官功能；人类种植、引入野生和原生记录则是不同证据。",
        "茎节的结构能说明器官功能；人类种植、引入野生和原生记录则是不同证据。"
      ],
      "explanation": "茎节的结构能说明器官功能；人类种植、引入野生和原生记录则是不同证据。",
      "nextHint": "回到器官图和地区证据，分别说出一条已知事实与一条还需要当地核对的信息。",
      "sources": [
        {
          "title": "Kew · Opuntia ficus-indica",
          "url": "https://powo.science.kew.org/taxon/1151735-2",
          "supports": "接受名、仙人掌科、墨西哥西南部及广泛引入区域。"
        },
        {
          "title": "World Agroforestry · 仙人掌梨",
          "url": "https://apps.worldagroforestry.org/treedb/AFTPDFS/Opuntia_ficus-indica.pdf",
          "supports": "亚热带高地、排水、栽培国家及耐旱边界。"
        },
        {
          "title": "Smithsonian · 夏威夷植物志",
          "url": "https://naturalhistory2.si.edu/botany/hawaiianflora/speciesdescr.cfm?genus=Opuntia&species=ficus-indica",
          "supports": "扁平茎节、花果；长期栽培使精确原生地存在不确定性。"
        },
        {
          "title": "NASA POWER：墨西哥中部高原气候格点，2001–2025",
          "url": "https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M%2CPRECTOTCORR&community=AG&longitude=-100.9&latitude=22.1&format=JSON",
          "supports": "该采样格点十二个月的气温与平均日降水率；不是树旁、林内、水下或整地区实测。"
        }
      ]
    },
    "sources": [
      {
        "title": "Kew · Opuntia ficus-indica",
        "url": "https://powo.science.kew.org/taxon/1151735-2",
        "supports": "接受名、仙人掌科、墨西哥西南部及广泛引入区域。"
      },
      {
        "title": "World Agroforestry · 仙人掌梨",
        "url": "https://apps.worldagroforestry.org/treedb/AFTPDFS/Opuntia_ficus-indica.pdf",
        "supports": "亚热带高地、排水、栽培国家及耐旱边界。"
      },
      {
        "title": "Smithsonian · 夏威夷植物志",
        "url": "https://naturalhistory2.si.edu/botany/hawaiianflora/speciesdescr.cfm?genus=Opuntia&species=ficus-indica",
        "supports": "扁平茎节、花果；长期栽培使精确原生地存在不确定性。"
      },
      {
        "title": "NASA POWER：墨西哥中部高原气候格点，2001–2025",
        "url": "https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M%2CPRECTOTCORR&community=AG&longitude=-100.9&latitude=22.1&format=JSON",
        "supports": "该采样格点十二个月的气温与平均日降水率；不是树旁、林内、水下或整地区实测。"
      }
    ],
    "steps": [
      {
        "title": "认识形态",
        "text": "扁平的掌片是茎而非大叶；花与肉质果实长在茎节上。 扁平掌片是茎节，花和肉质果长在茎节上；它不是长着巨大扁叶的普通灌木。",
        "action": {
          "kind": "morphology",
          "regionId": "mexico-plateau"
        }
      },
      {
        "title": "环境机制",
        "text": "扁平茎兼顾光合与储水。 光合茎兼顾储水，生长和结果仍需要供水；长期栽培与传播使原生来源解释必须保持谨慎。 暖热、日照充足、排水良好；形成花果仍需供水。 适应暖热环境，寒冷冬季会限制一些栽培地区。 能利用储水承受干期。 对长期积水和根区缺氧敏感。 梨果仙人掌原生地受长期驯化历史影响；本页用栽培点，不把所有出现处都叫原生。",
        "action": {
          "kind": "environment",
          "regionId": "mexico-plateau"
        }
      },
      {
        "title": "地区证据",
        "text": "以墨西哥中部高原作为地区案例。NASA POWER 2001–2025格点：最冷月1月，月均温12.5°C；最暖月5月，月均温21.9°C。这是气候格点背景；光合茎兼顾储水，生长和结果仍需要供水；长期栽培与传播使原生来源解释必须保持谨慎。地图采样点不证明该处有这一物种。",
        "action": {
          "kind": "region",
          "regionId": "mexico-plateau"
        }
      }
    ],
    "regionRole": "cultivation-context",
    "substrateKind": "terrestrial",
    "substrateNote": "适合根区通气良好的砂质或深土。 对长期积水和根区缺氧敏感。 土壤栅格是区域背景，不是根旁取样；酸碱度不能单独证明排水或养分足够。",
    "soilCaution": "适合根区通气良好的砂质或深土。 对长期积水和根区缺氧敏感。 土壤栅格是区域背景，不是根旁取样；酸碱度不能单独证明排水或养分足够。"
  },
  {
    "id": "agave",
    "cropId": "agave",
    "name": "美洲龙舌兰",
    "latin": "Agave americana",
    "pathId": "dryland-strategies",
    "group": "荒漠与多肉",
    "definition": "肉质叶形成大型莲座，成熟后抽出高花轴；它与芦荟属于不同科。",
    "organs": "肉质叶排列成大型莲座，叶缘和叶尖有明显结构；美洲龙舌兰成熟后可抽出高大的花轴。",
    "adaptations": "莲座肉质叶储水，长期积累支持开花。",
    "environment": "肉质叶储水帮助应对间歇性干旱，根区仍需通气；长期湿冷与积水可能伤根。 暖热晴朗环境和通气良好的砂质或其他排水土。 偏好暖热晴朗环境；栽培耐寒性受水分和个体影响。 成年莲座能承受一定干期。 排水是栽培关键。",
    "misconception": "美洲龙舌兰并非芦荟，也不是所有龙舌兰酒原料的通用名称。",
    "regionId": "mexico-plateau",
    "region": {
      "id": "mexico-plateau",
      "name": "墨西哥中部高原",
      "lon": -100.9,
      "lat": 22.1,
      "pointMeaning": "地区教学采样点，不是物种观测点、植物精确位置或全地区平均。"
    },
    "rootzone": "soil",
    "evidenceChecks": {
      "climate": "先比较十二个月的温度与降水率，区分生长季、冷季和干湿季。空气格点气温不是水温或叶面温度。",
      "soil": "偏好砂质或其他排水良好基质。 排水是栽培关键。 土壤栅格是区域背景，不是根旁取样；酸碱度不能单独证明排水或养分足够。",
      "water": "成年莲座能承受一定干期。 长期多水反而易导致根腐。 降雨与可用水不同，需结合供水位置、季节和排水。"
    },
    "caseText": "以墨西哥中部高原作为地区案例。NASA POWER 2001–2025格点：最冷月1月，月均温12.5°C；最暖月5月，月均温21.9°C。这是气候格点背景；肉质叶储水帮助应对间歇性干旱，根区仍需通气；长期湿冷与积水可能伤根。地图采样点不证明该处有这一物种。",
    "question": {
      "id": "bio-check-agave",
      "title": "美洲龙舌兰 · 想一想",
      "prompt": "美洲龙舌兰和芦荟都长肉质莲座叶，能因此当成同一种植物吗？",
      "options": [
        "不能；要分别看分类、叶和花序，并核对根区要求。",
        "可以；储水外形相似就表示同科同种。",
        "储水叶表示根泡在水中也不会缺氧。"
      ],
      "correctIndex": 0,
      "feedback": [
        "相似生活型可能由不同谱系形成；耐旱与耐涝是不同能力，花序和叶等结构可帮助比较。",
        "这个判断忽略了器官、出现方式或水热条件中的关键差别。相似生活型可能由不同谱系形成；耐旱与耐涝是不同能力，花序和叶等结构可帮助比较。",
        "不能从名称、外观或一次记录跳到这个结论。相似生活型可能由不同谱系形成；耐旱与耐涝是不同能力，花序和叶等结构可帮助比较。"
      ],
      "explanation": "相似生活型可能由不同谱系形成；耐旱与耐涝是不同能力，花序和叶等结构可帮助比较。",
      "nextHint": "回到器官图和地区证据，分别说出一条已知事实与一条还需要当地核对的信息。",
      "sources": [
        {
          "title": "Kew · Agave americana",
          "url": "https://powo.science.kew.org/taxon/urn:lsid:ipni.org:names:319063-2/general-information",
          "supports": "接受名、天门冬科及美国南部至墨西哥原生范围。"
        },
        {
          "title": "NC State · 美洲龙舌兰",
          "url": "https://plants.ces.ncsu.edu/plants/agave-americana/",
          "supports": "肉质莲座、开花后主莲座衰亡、偏好阳光和排水土。"
        },
        {
          "title": "NASA POWER：墨西哥中部高原气候格点，2001–2025",
          "url": "https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M%2CPRECTOTCORR&community=AG&longitude=-100.9&latitude=22.1&format=JSON",
          "supports": "该采样格点十二个月的气温与平均日降水率；不是树旁、林内、水下或整地区实测。"
        }
      ]
    },
    "sources": [
      {
        "title": "Kew · Agave americana",
        "url": "https://powo.science.kew.org/taxon/urn:lsid:ipni.org:names:319063-2/general-information",
        "supports": "接受名、天门冬科及美国南部至墨西哥原生范围。"
      },
      {
        "title": "NC State · 美洲龙舌兰",
        "url": "https://plants.ces.ncsu.edu/plants/agave-americana/",
        "supports": "肉质莲座、开花后主莲座衰亡、偏好阳光和排水土。"
      },
      {
        "title": "NASA POWER：墨西哥中部高原气候格点，2001–2025",
        "url": "https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M%2CPRECTOTCORR&community=AG&longitude=-100.9&latitude=22.1&format=JSON",
        "supports": "该采样格点十二个月的气温与平均日降水率；不是树旁、林内、水下或整地区实测。"
      }
    ],
    "steps": [
      {
        "title": "认识形态",
        "text": "肉质叶形成大型莲座，成熟后抽出高花轴；它与芦荟属于不同科。 肉质叶排列成大型莲座，叶缘和叶尖有明显结构；美洲龙舌兰成熟后可抽出高大的花轴。",
        "action": {
          "kind": "morphology",
          "regionId": "mexico-plateau"
        }
      },
      {
        "title": "环境机制",
        "text": "莲座肉质叶储水，长期积累支持开花。 肉质叶储水帮助应对间歇性干旱，根区仍需通气；长期湿冷与积水可能伤根。 暖热晴朗环境和通气良好的砂质或其他排水土。 偏好暖热晴朗环境；栽培耐寒性受水分和个体影响。 成年莲座能承受一定干期。 排水是栽培关键。 美洲龙舌兰并非芦荟，也不是所有龙舌兰酒原料的通用名称。",
        "action": {
          "kind": "environment",
          "regionId": "mexico-plateau"
        }
      },
      {
        "title": "地区证据",
        "text": "以墨西哥中部高原作为地区案例。NASA POWER 2001–2025格点：最冷月1月，月均温12.5°C；最暖月5月，月均温21.9°C。这是气候格点背景；肉质叶储水帮助应对间歇性干旱，根区仍需通气；长期湿冷与积水可能伤根。地图采样点不证明该处有这一物种。",
        "action": {
          "kind": "region",
          "regionId": "mexico-plateau"
        }
      }
    ],
    "regionRole": "regional-context",
    "substrateKind": "terrestrial",
    "substrateNote": "偏好砂质或其他排水良好基质。 排水是栽培关键。 土壤栅格是区域背景，不是根旁取样；酸碱度不能单独证明排水或养分足够。",
    "soilCaution": "偏好砂质或其他排水良好基质。 排水是栽培关键。 土壤栅格是区域背景，不是根旁取样；酸碱度不能单独证明排水或养分足够。"
  },
  {
    "id": "aloe",
    "cropId": "aloe",
    "name": "库拉索芦荟",
    "latin": "Aloe vera",
    "pathId": "dryland-strategies",
    "group": "荒漠与多肉",
    "definition": "莲座状肉质叶储水，根区需要通气；温室展示与原生干燥岩坡是不同证据。",
    "organs": "厚实叶片围成莲座，叶肉组织储水；本条讨论库拉索芦荟，不把全部芦荟混为一类。",
    "adaptations": "叶内薄壁组织储存水分。",
    "environment": "储水叶缓冲干旱，但根需空气；阳光、温度与干湿交替共同影响生长，盆栽基质不能由大陆土壤图代替。 温暖明亮、粗颗粒通气基质，浇水后允许重新干燥。 偏好温暖环境；英国展示依赖保护设施，不据此推断露地耐寒。 储水叶帮助缓冲干期。 浇后必须能排去多余水。",
    "misconception": "芦荟并非龙舌兰；本页不把所有芦荟种类或商业产品的特征混为一谈。",
    "regionId": "oman",
    "region": {
      "id": "oman",
      "name": "阿曼北部岩坡",
      "lon": 57.5,
      "lat": 23.2,
      "pointMeaning": "地区教学采样点，不是物种观测点、植物精确位置或全地区平均。"
    },
    "rootzone": "soil",
    "evidenceChecks": {
      "climate": "先比较十二个月的温度与降水率，区分生长季、冷季和干湿季。空气格点气温不是水温或叶面温度。",
      "soil": "适合疏松、含粗颗粒的基质。 浇后必须能排去多余水。 土壤栅格是区域背景，不是根旁取样；酸碱度不能单独证明排水或养分足够。",
      "water": "储水叶帮助缓冲干期。 持续湿闷比短暂干燥更易损伤根部。 降雨与可用水不同，需结合供水位置、季节和排水。"
    },
    "caseText": "以阿曼北部岩坡作为地区案例。NASA POWER 2001–2025格点：最冷月1月，月均温17.6°C；最暖月7月，月均温35.1°C。这是气候格点背景；储水叶缓冲干旱，但根需空气；阳光、温度与干湿交替共同影响生长，盆栽基质不能由大陆土壤图代替。地图采样点不证明该处有这一物种。",
    "question": {
      "id": "bio-check-aloe",
      "title": "库拉索芦荟 · 想一想",
      "prompt": "芦荟叶片有很多水，是否说明盆土越湿越好？",
      "options": [
        "温室里有盆栽就证明该地是它的原生地。",
        "不是；叶片储水与根区排水通气需要分开理解。",
        "是；叶肉含水说明根可以一直完全浸泡。"
      ],
      "correctIndex": 1,
      "feedback": [
        "不能从名称、外观或一次记录跳到这个结论。储水组织并不能消除根缺氧；温室、栽培与野生范围也必须分别说明。",
        "储水组织并不能消除根缺氧；温室、栽培与野生范围也必须分别说明。",
        "这个判断忽略了器官、出现方式或水热条件中的关键差别。储水组织并不能消除根缺氧；温室、栽培与野生范围也必须分别说明。"
      ],
      "explanation": "储水组织并不能消除根缺氧；温室、栽培与野生范围也必须分别说明。",
      "nextHint": "回到器官图和地区证据，分别说出一条已知事实与一条还需要当地核对的信息。",
      "sources": [
        {
          "title": "Kew POWO · Aloe vera",
          "url": "https://powo.science.kew.org/taxon/urn:lsid:ipni.org:names:530017-1/general-information",
          "supports": "接受名、阿福花科、阿曼北部哈杰尔山原生范围。"
        },
        {
          "title": "Kew · 芦荟",
          "url": "https://www.kew.org/plants/aloe-vera",
          "supports": "肉质储水叶、黄色管状花、排水栽培和邱园温室展示。"
        },
        {
          "title": "NASA POWER：阿曼北部岩坡气候格点，2001–2025",
          "url": "https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M%2CPRECTOTCORR&community=AG&longitude=57.5&latitude=23.2&format=JSON",
          "supports": "该采样格点十二个月的气温与平均日降水率；不是树旁、林内、水下或整地区实测。"
        }
      ]
    },
    "sources": [
      {
        "title": "Kew POWO · Aloe vera",
        "url": "https://powo.science.kew.org/taxon/urn:lsid:ipni.org:names:530017-1/general-information",
        "supports": "接受名、阿福花科、阿曼北部哈杰尔山原生范围。"
      },
      {
        "title": "Kew · 芦荟",
        "url": "https://www.kew.org/plants/aloe-vera",
        "supports": "肉质储水叶、黄色管状花、排水栽培和邱园温室展示。"
      },
      {
        "title": "NASA POWER：阿曼北部岩坡气候格点，2001–2025",
        "url": "https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M%2CPRECTOTCORR&community=AG&longitude=57.5&latitude=23.2&format=JSON",
        "supports": "该采样格点十二个月的气温与平均日降水率；不是树旁、林内、水下或整地区实测。"
      }
    ],
    "steps": [
      {
        "title": "认识形态",
        "text": "莲座状肉质叶储水，根区需要通气；温室展示与原生干燥岩坡是不同证据。 厚实叶片围成莲座，叶肉组织储水；本条讨论库拉索芦荟，不把全部芦荟混为一类。",
        "action": {
          "kind": "morphology",
          "regionId": "oman"
        }
      },
      {
        "title": "环境机制",
        "text": "叶内薄壁组织储存水分。 储水叶缓冲干旱，但根需空气；阳光、温度与干湿交替共同影响生长，盆栽基质不能由大陆土壤图代替。 温暖明亮、粗颗粒通气基质，浇水后允许重新干燥。 偏好温暖环境；英国展示依赖保护设施，不据此推断露地耐寒。 储水叶帮助缓冲干期。 浇后必须能排去多余水。 芦荟并非龙舌兰；本页不把所有芦荟种类或商业产品的特征混为一谈。",
        "action": {
          "kind": "environment",
          "regionId": "oman"
        }
      },
      {
        "title": "地区证据",
        "text": "以阿曼北部岩坡作为地区案例。NASA POWER 2001–2025格点：最冷月1月，月均温17.6°C；最暖月7月，月均温35.1°C。这是气候格点背景；储水叶缓冲干旱，但根需空气；阳光、温度与干湿交替共同影响生长，盆栽基质不能由大陆土壤图代替。地图采样点不证明该处有这一物种。",
        "action": {
          "kind": "region",
          "regionId": "oman"
        }
      }
    ],
    "regionRole": "regional-context",
    "substrateKind": "terrestrial",
    "substrateNote": "适合疏松、含粗颗粒的基质。 浇后必须能排去多余水。 土壤栅格是区域背景，不是根旁取样；酸碱度不能单独证明排水或养分足够。",
    "soilCaution": "适合疏松、含粗颗粒的基质。 浇后必须能排去多余水。 土壤栅格是区域背景，不是根旁取样；酸碱度不能单独证明排水或养分足够。"
  },
  {
    "id": "lotus",
    "cropId": "lotus",
    "name": "莲",
    "latin": "Nelumbo nucifera",
    "pathId": "water-habitats",
    "group": "海岸与湿地",
    "definition": "地下根茎扎在泥中，盾状叶与莲蓬高出水面；它与睡莲分属不同科。",
    "organs": "藕是生于底泥的水平根茎，叶柄托起盾状叶；莲蓬主要由花托发育，莲和睡莲分属不同科。",
    "adaptations": "根茎储藏并扩展，叶柄把叶片举向光。",
    "environment": "底泥中的根茎储藏资源，叶片伸向光；水位、光照、底质和季节要结合看，不能只看总雨量。 有光照的温暖生长季，浅水和可扎根的泥质底层。 温暖生长季促进展叶开花，冷季表现随地点和材料变化。 适应浅水湿地、池塘与洪泛环境。 水下泥质根区是其生境，不能套用旱地排水规则。",
    "misconception": "藕是根茎，莲蓬是花托发育的结构；莲与睡莲不是同一植物的两种叫法。",
    "regionId": "zhejiang",
    "region": {
      "id": "zhejiang",
      "name": "中国浙江东部丘陵与湿地",
      "lon": 119.9,
      "lat": 30.2,
      "pointMeaning": "地区教学采样点，不是物种观测点、植物精确位置或全地区平均。"
    },
    "rootzone": "water",
    "evidenceChecks": {
      "climate": "先比较十二个月的温度与降水率，区分生长季、冷季和干湿季。空气格点气温不是水温或叶面温度。",
      "soil": "水生案例要查看水体或底质；附近陆地表层土壤值不能当作海床、湖泥或水体实测。",
      "water": "适应浅水湿地、池塘与洪泛环境。 急流、过深水与完全遮阴不能视为同等条件。 降雨与可用水不同，需结合供水位置、季节和排水。"
    },
    "caseText": "以中国浙江东部丘陵与湿地作为地区案例。NASA POWER 2001–2025格点：最冷月1月，月均温3.5°C；最暖月7月，月均温27.8°C。这是气候格点背景；底泥中的根茎储藏资源，叶片伸向光；水位、光照、底质和季节要结合看，不能只看总雨量。地图采样点不证明该处有这一物种。",
    "question": {
      "id": "bio-check-lotus",
      "title": "莲 · 想一想",
      "prompt": "浙江一个水体有水，足以说明那里可以长莲吗？",
      "options": [
        "足以；所有深水和急流水体都相同。",
        "藕是吸收根，所以水下所有根都叫藕。",
        "还要核对水深、光照、流速与可供扎根的底质。"
      ],
      "correctIndex": 2,
      "feedback": [
        "这个判断忽略了器官、出现方式或水热条件中的关键差别。莲的根茎需要合适底质，而叶要到达有光处；水体存在只是线索，不是适生结论。",
        "不能从名称、外观或一次记录跳到这个结论。莲的根茎需要合适底质，而叶要到达有光处；水体存在只是线索，不是适生结论。",
        "莲的根茎需要合适底质，而叶要到达有光处；水体存在只是线索，不是适生结论。"
      ],
      "explanation": "莲的根茎需要合适底质，而叶要到达有光处；水体存在只是线索，不是适生结论。",
      "nextHint": "回到器官图和地区证据，分别说出一条已知事实与一条还需要当地核对的信息。",
      "sources": [
        {
          "title": "Kew POWO · Nelumbo nucifera",
          "url": "https://powo.science.kew.org/taxon/urn:lsid:ipni.org:names:605422-1/general-information",
          "supports": "接受名、莲科与包括中国、印度在内的原生范围。"
        },
        {
          "title": "Kew · Sacred lotus",
          "url": "https://www.kew.org/plants/sacred-lotus",
          "supports": "浅水湿地、根茎、荷叶与莲蓬结构，长期利用。"
        },
        {
          "title": "NParks：Nelumbo nucifera",
          "url": "https://www.nparks.gov.sg/florafaunaweb/flora/2/2/2257",
          "supports": "根茎、挺水叶、浅水生境"
        },
        {
          "title": "NASA POWER：中国浙江东部丘陵与湿地气候格点，2001–2025",
          "url": "https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M%2CPRECTOTCORR&community=AG&longitude=119.9&latitude=30.2&format=JSON",
          "supports": "该采样格点十二个月的气温与平均日降水率；不是树旁、林内、水下或整地区实测。"
        }
      ]
    },
    "sources": [
      {
        "title": "Kew POWO · Nelumbo nucifera",
        "url": "https://powo.science.kew.org/taxon/urn:lsid:ipni.org:names:605422-1/general-information",
        "supports": "接受名、莲科与包括中国、印度在内的原生范围。"
      },
      {
        "title": "Kew · Sacred lotus",
        "url": "https://www.kew.org/plants/sacred-lotus",
        "supports": "浅水湿地、根茎、荷叶与莲蓬结构，长期利用。"
      },
      {
        "title": "NParks：Nelumbo nucifera",
        "url": "https://www.nparks.gov.sg/florafaunaweb/flora/2/2/2257",
        "supports": "根茎、挺水叶、浅水生境"
      },
      {
        "title": "NASA POWER：中国浙江东部丘陵与湿地气候格点，2001–2025",
        "url": "https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M%2CPRECTOTCORR&community=AG&longitude=119.9&latitude=30.2&format=JSON",
        "supports": "该采样格点十二个月的气温与平均日降水率；不是树旁、林内、水下或整地区实测。"
      }
    ],
    "steps": [
      {
        "title": "认识形态",
        "text": "地下根茎扎在泥中，盾状叶与莲蓬高出水面；它与睡莲分属不同科。 藕是生于底泥的水平根茎，叶柄托起盾状叶；莲蓬主要由花托发育，莲和睡莲分属不同科。",
        "action": {
          "kind": "morphology",
          "regionId": "zhejiang"
        }
      },
      {
        "title": "环境机制",
        "text": "根茎储藏并扩展，叶柄把叶片举向光。 底泥中的根茎储藏资源，叶片伸向光；水位、光照、底质和季节要结合看，不能只看总雨量。 有光照的温暖生长季，浅水和可扎根的泥质底层。 温暖生长季促进展叶开花，冷季表现随地点和材料变化。 适应浅水湿地、池塘与洪泛环境。 水下泥质根区是其生境，不能套用旱地排水规则。 藕是根茎，莲蓬是花托发育的结构；莲与睡莲不是同一植物的两种叫法。",
        "action": {
          "kind": "environment",
          "regionId": "zhejiang"
        }
      },
      {
        "title": "地区证据",
        "text": "以中国浙江东部丘陵与湿地作为地区案例。NASA POWER 2001–2025格点：最冷月1月，月均温3.5°C；最暖月7月，月均温27.8°C。这是气候格点背景；底泥中的根茎储藏资源，叶片伸向光；水位、光照、底质和季节要结合看，不能只看总雨量。地图采样点不证明该处有这一物种。",
        "action": {
          "kind": "region",
          "regionId": "zhejiang"
        }
      }
    ],
    "regionRole": "regional-context",
    "substrateKind": "aquatic",
    "substrateNote": "水生案例要查看水体或底质；附近陆地表层土壤值不能当作海床、湖泥或水体实测。",
    "soilCaution": "水生案例要查看水体或底质；附近陆地表层土壤值不能当作海床、湖泥或水体实测。"
  },
  {
    "id": "waterlily",
    "cropId": "waterlily",
    "name": "欧洲白睡莲",
    "latin": "Nymphaea alba",
    "pathId": "water-habitats",
    "group": "海岸与湿地",
    "definition": "有缺口的浮水圆叶与白花连接水下根茎；平静淡水和光照十分重要。",
    "organs": "欧洲白睡莲的浮叶常有明显缺口，叶柄连接水下根茎；其器官位置与叶片挺出水面的莲不同。",
    "adaptations": "长叶柄连接底泥根茎和水面光合叶。",
    "environment": "浮叶利用水面光照，扎根植物仍受水深、底泥、浪流与水位稳定性影响；淡水不能替换为海水。 有阳光的温带静水或缓流水，水下底泥与适合水深。 适应温带季节变化，冷季地上叶片减少，地下根茎保留。 静水或流动很缓的淡水更符合其生境。 作为水生植物，要求不能套成旱地快速排水。",
    "misconception": "欧洲白睡莲是一个物种；不能把热带睡莲或全部园艺杂交种的耐寒性套给它。",
    "regionId": "uk-lowland",
    "region": {
      "id": "uk-lowland",
      "name": "英国低地林地与淡水环境",
      "lon": -1,
      "lat": 52,
      "pointMeaning": "地区教学采样点，不是物种观测点、植物精确位置或全地区平均。"
    },
    "rootzone": "water",
    "evidenceChecks": {
      "climate": "先比较十二个月的温度与降水率，区分生长季、冷季和干湿季。空气格点气温不是水温或叶面温度。",
      "soil": "水生案例要查看水体或底质；附近陆地表层土壤值不能当作海床、湖泥或水体实测。",
      "water": "静水或流动很缓的淡水更符合其生境。 水深和波浪会改变叶片到达水面的条件。 降雨与可用水不同，需结合供水位置、季节和排水。"
    },
    "caseText": "以英国低地林地与淡水环境作为地区案例。NASA POWER 2001–2025格点：最冷月1月，月均温3.7°C；最暖月7月，月均温17.1°C。这是气候格点背景；浮叶利用水面光照，扎根植物仍受水深、底泥、浪流与水位稳定性影响；淡水不能替换为海水。地图采样点不证明该处有这一物种。",
    "question": {
      "id": "bio-check-waterlily",
      "title": "欧洲白睡莲 · 想一想",
      "prompt": "欧洲白睡莲与莲都在水里，观察时应先分清什么？",
      "options": [
        "浮叶或挺水的器官位置，并核对淡水、水深与底质。",
        "只要花在水上，它们就是同一物种。",
        "水下有根意味着河口海水也完全等同淡水池塘。"
      ],
      "correctIndex": 0,
      "feedback": [
        "相近景观不表示相同器官或相同盐度耐受；浮叶、挺水和沉水是不同的生活位置。",
        "这个判断忽略了器官、出现方式或水热条件中的关键差别。相近景观不表示相同器官或相同盐度耐受；浮叶、挺水和沉水是不同的生活位置。",
        "不能从名称、外观或一次记录跳到这个结论。相近景观不表示相同器官或相同盐度耐受；浮叶、挺水和沉水是不同的生活位置。"
      ],
      "explanation": "相近景观不表示相同器官或相同盐度耐受；浮叶、挺水和沉水是不同的生活位置。",
      "nextHint": "回到器官图和地区证据，分别说出一条已知事实与一条还需要当地核对的信息。",
      "sources": [
        {
          "title": "Kew POWO · Nymphaea alba",
          "url": "https://powo.science.kew.org/taxon/urn:lsid:ipni.org:names:171158-2/general-information",
          "supports": "接受名、睡莲科和欧洲等原生范围。"
        },
        {
          "title": "RHS · 欧洲白睡莲",
          "url": "https://www.rhs.org.uk/plants/11623/nymphaea-alba-h/details",
          "supports": "浮叶、白花、根茎，阳光和不受扰动的水体条件。"
        },
        {
          "title": "NASA POWER：英国低地林地与淡水环境气候格点，2001–2025",
          "url": "https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M%2CPRECTOTCORR&community=AG&longitude=-1&latitude=52&format=JSON",
          "supports": "该采样格点十二个月的气温与平均日降水率；不是树旁、林内、水下或整地区实测。"
        }
      ]
    },
    "sources": [
      {
        "title": "Kew POWO · Nymphaea alba",
        "url": "https://powo.science.kew.org/taxon/urn:lsid:ipni.org:names:171158-2/general-information",
        "supports": "接受名、睡莲科和欧洲等原生范围。"
      },
      {
        "title": "RHS · 欧洲白睡莲",
        "url": "https://www.rhs.org.uk/plants/11623/nymphaea-alba-h/details",
        "supports": "浮叶、白花、根茎，阳光和不受扰动的水体条件。"
      },
      {
        "title": "NASA POWER：英国低地林地与淡水环境气候格点，2001–2025",
        "url": "https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M%2CPRECTOTCORR&community=AG&longitude=-1&latitude=52&format=JSON",
        "supports": "该采样格点十二个月的气温与平均日降水率；不是树旁、林内、水下或整地区实测。"
      }
    ],
    "steps": [
      {
        "title": "认识形态",
        "text": "有缺口的浮水圆叶与白花连接水下根茎；平静淡水和光照十分重要。 欧洲白睡莲的浮叶常有明显缺口，叶柄连接水下根茎；其器官位置与叶片挺出水面的莲不同。",
        "action": {
          "kind": "morphology",
          "regionId": "uk-lowland"
        }
      },
      {
        "title": "环境机制",
        "text": "长叶柄连接底泥根茎和水面光合叶。 浮叶利用水面光照，扎根植物仍受水深、底泥、浪流与水位稳定性影响；淡水不能替换为海水。 有阳光的温带静水或缓流水，水下底泥与适合水深。 适应温带季节变化，冷季地上叶片减少，地下根茎保留。 静水或流动很缓的淡水更符合其生境。 作为水生植物，要求不能套成旱地快速排水。 欧洲白睡莲是一个物种；不能把热带睡莲或全部园艺杂交种的耐寒性套给它。",
        "action": {
          "kind": "environment",
          "regionId": "uk-lowland"
        }
      },
      {
        "title": "地区证据",
        "text": "以英国低地林地与淡水环境作为地区案例。NASA POWER 2001–2025格点：最冷月1月，月均温3.7°C；最暖月7月，月均温17.1°C。这是气候格点背景；浮叶利用水面光照，扎根植物仍受水深、底泥、浪流与水位稳定性影响；淡水不能替换为海水。地图采样点不证明该处有这一物种。",
        "action": {
          "kind": "region",
          "regionId": "uk-lowland"
        }
      }
    ],
    "regionRole": "regional-context",
    "substrateKind": "aquatic",
    "substrateNote": "水生案例要查看水体或底质；附近陆地表层土壤值不能当作海床、湖泥或水体实测。",
    "soilCaution": "水生案例要查看水体或底质；附近陆地表层土壤值不能当作海床、湖泥或水体实测。"
  },
  {
    "id": "eelgrass",
    "cropId": "eelgrass",
    "name": "大叶藻",
    "latin": "Zostera marina",
    "pathId": "water-habitats",
    "group": "海岸与湿地",
    "definition": "大叶藻是海洋开花植物，带状叶接受水下光，根茎固定并储藏于海床。",
    "organs": "大叶藻有带状叶、根和根茎，也会开花并形成种子；它是海草，不是海藻。",
    "adaptations": "大叶藻的叶片在水下进行光合作用。水越深，或泥沙、藻类使水越浑，传到叶面的光通常越少；有水不等于有足够的光。根和根茎固定在海床，海床扰动会破坏扎根环境；盐度和水温也要另查当地监测。",
    "environment": "大叶藻的叶片在水下进行光合作用。水越深，或泥沙、藻类使水越浑，传到叶面的光通常越少；有水不等于有足够的光。根和根茎固定在海床，海床扰动会破坏扎根环境；盐度和水温也要另查当地监测。",
    "misconception": "海草是有花、有种子和根茎的植物，海藻并不是同一类；展示不是产量或适生栅格。",
    "regionId": "tomales-bay",
    "region": {
      "id": "tomales-bay",
      "name": "美国加州托马莱斯湾",
      "lon": -122.9,
      "lat": 38.15,
      "pointMeaning": "地区教学采样点，不是物种观测点、植物精确位置或全地区平均。"
    },
    "rootzone": "water",
    "evidenceChecks": {
      "climate": "主线先看水下光与水温；空气气象网格只作周边背景，本点缺少水温实测。",
      "soil": "大叶藻根和根茎固定于海床；陆地0–5 cm表土不能代表海床，缺少本点底质实测。",
      "water": "潮汐、水深、透明度与盐度共同影响生境；卫星开阔水面记录不能代替这些条件。"
    },
    "caseText": "托马莱斯湾有NOAA记录的海草床。先观察浅海湾，再问水下光、水深、海床稳定性与潮汐；NASA陆地空气温度和降雨仅作周边背景，不能代替水温、盐度或透明度。教学坐标是区域定位，并非一株大叶藻的观测点。",
    "question": {
      "id": "bio-check-eelgrass",
      "title": "大叶藻 · 想一想",
      "prompt": "托马莱斯湾有水，解释大叶藻时还必须特别看什么？",
      "options": [
        "把海草当作海藻，只需要看天空降雨。",
        "水下光、盐度、水温和底质；它是海洋开花植物。",
        "把附近陆地的土壤酸碱度当作海床测量。"
      ],
      "correctIndex": 1,
      "feedback": [
        "不能从名称、外观或一次记录跳到这个结论。海草生活在海床与水体之间；陆地格点只能提供背景，不能替代海水与沉积物资料。",
        "海草生活在海床与水体之间；陆地格点只能提供背景，不能替代海水与沉积物资料。",
        "这个判断忽略了器官、出现方式或水热条件中的关键差别。海草生活在海床与水体之间；陆地格点只能提供背景，不能替代海水与沉积物资料。"
      ],
      "explanation": "海草生活在海床与水体之间；陆地格点只能提供背景，不能替代海水与沉积物资料。",
      "nextHint": "回到器官图和地区证据，分别说出一条已知事实与一条还需要当地核对的信息。",
      "sources": [
        {
          "title": "Kew POWO · Zostera marina",
          "url": "https://powo.science.kew.org/taxon/urn:lsid:ipni.org:names:603618-1",
          "supports": "接受名、大叶藻科、北半球温带至亚热带原生范围，包括加州和弗吉尼亚。"
        },
        {
          "title": "USDA · Eelgrass factsheet",
          "url": "https://plants.usda.gov/DocumentLibrary/factsheet/pdf/fs_zoma.pdf",
          "supports": "北美两岸原生分布、形态、根茎生长和水质限制。"
        },
        {
          "title": "NOAA · Tomales Bay seagrass",
          "url": "https://farallones.noaa.gov/eco/tomales/seagrass.html",
          "supports": "托马莱斯湾大叶藻草床与海岸环境。"
        },
        {
          "title": "VIMS · Eelgrass",
          "url": "https://www.vims.edu/research/units/programs/sav/species/eelgrass.php",
          "supports": "切萨皮克湾南部、形态繁殖、遮光及夏季热胁迫。"
        },
        {
          "title": "NASA POWER：美国加州托马莱斯湾气候格点，2001–2025",
          "url": "https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M%2CPRECTOTCORR&community=AG&longitude=-122.9&latitude=38.15&format=JSON",
          "supports": "该采样格点十二个月的气温与平均日降水率；不是树旁、林内、水下或整地区实测。"
        }
      ]
    },
    "sources": [
      {
        "title": "Kew POWO · Zostera marina",
        "url": "https://powo.science.kew.org/taxon/urn:lsid:ipni.org:names:603618-1",
        "supports": "接受名、大叶藻科、北半球温带至亚热带原生范围，包括加州和弗吉尼亚。"
      },
      {
        "title": "USDA · Eelgrass factsheet",
        "url": "https://plants.usda.gov/DocumentLibrary/factsheet/pdf/fs_zoma.pdf",
        "supports": "北美两岸原生分布、形态、根茎生长和水质限制。"
      },
      {
        "title": "NOAA · Tomales Bay seagrass",
        "url": "https://farallones.noaa.gov/eco/tomales/seagrass.html",
        "supports": "托马莱斯湾大叶藻草床与海岸环境。"
      },
      {
        "title": "VIMS · Eelgrass",
        "url": "https://www.vims.edu/research/units/programs/sav/species/eelgrass.php",
        "supports": "切萨皮克湾南部、形态繁殖、遮光及夏季热胁迫。"
      },
      {
        "title": "NASA POWER：美国加州托马莱斯湾气候格点，2001–2025",
        "url": "https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M%2CPRECTOTCORR&community=AG&longitude=-122.9&latitude=38.15&format=JSON",
        "supports": "该采样格点十二个月的气温与平均日降水率；不是树旁、林内、水下或整地区实测。"
      },
      {
        "title": "NOAA Fisheries：美国西岸海草",
        "url": "https://www.fisheries.noaa.gov/west-coast/habitat-conservation/seagrass-west-coast",
        "supports": "大叶藻常受水下光限制；减少光照可损害生境。"
      },
      {
        "title": "NOAA：托马莱斯湾海草保护",
        "url": "https://farallones.noaa.gov/eco/tomales/seagrass.html",
        "supports": "当地海草床与锚泊对海床的扰动。"
      }
    ],
    "steps": [
      {
        "title": "认识形态",
        "text": "大叶藻是海洋开花植物，带状叶接受水下光，根茎固定并储藏于海床。 大叶藻有带状叶、根和根茎，也会开花并形成种子；它是海草，不是海藻。",
        "action": {
          "kind": "morphology",
          "regionId": "tomales-bay"
        }
      },
      {
        "title": "环境机制",
        "text": "大叶藻的叶片在水下进行光合作用。水越深，或泥沙、藻类使水越浑，传到叶面的光通常越少；有水不等于有足够的光。根和根茎固定在海床，海床扰动会破坏扎根环境；盐度和水温也要另查当地监测。 海草是有花、有种子和根茎的植物，海藻并不是同一类；展示不是产量或适生栅格。",
        "action": {
          "kind": "environment",
          "regionId": "tomales-bay"
        }
      },
      {
        "title": "地区证据",
        "text": "托马莱斯湾有NOAA记录的海草床。先观察浅海湾，再问水下光、水深、海床稳定性与潮汐；NASA陆地空气温度和降雨仅作周边背景，不能代替水温、盐度或透明度。教学坐标是区域定位，并非一株大叶藻的观测点。",
        "action": {
          "kind": "region",
          "regionId": "tomales-bay"
        }
      }
    ],
    "regionRole": "regional-context",
    "substrateKind": "marine",
    "substrateNote": "水生案例要查看水体或底质；附近陆地表层土壤值不能当作海床、湖泥或水体实测。",
    "soilCaution": "水生案例要查看水体或底质；附近陆地表层土壤值不能当作海床、湖泥或水体实测。"
  },
  {
    "id": "duckweed",
    "cropId": "duckweed",
    "name": "浮萍",
    "latin": "Lemna minor",
    "pathId": "water-habitats",
    "group": "海岸与湿地",
    "definition": "浮水叶状体通常各带一根，主要靠出芽扩增；体型很小却仍属于开花植物。",
    "organs": "微小浮水叶状体融合了茎叶特征，通常各有一条根；小型和漂浮不表示它是藻类。",
    "adaptations": "叶状体内气隙利于浮起，出芽迅速占据水面。",
    "environment": "气隙有助漂浮，出芽可快速扩增；平静水面、营养、光照和水温很重要，水面覆盖过密也会遮光。 平静或缓流水面，有光与可利用的水中营养。 温暖有利时期可迅速增殖，实际速度取决于水温、光和营养。 适合平静或缓慢流动的水面。 无需旱地土壤排水评价，需观察水流与水质。",
    "misconception": "浮萍不是藻类；用一个绿色浮层也不能直接鉴定为 Lemna minor。",
    "regionId": "uk-lowland",
    "region": {
      "id": "uk-lowland",
      "name": "英国低地林地与淡水环境",
      "lon": -1,
      "lat": 52,
      "pointMeaning": "地区教学采样点，不是物种观测点、植物精确位置或全地区平均。"
    },
    "rootzone": "water",
    "evidenceChecks": {
      "climate": "先比较十二个月的温度与降水率，区分生长季、冷季和干湿季。空气格点气温不是水温或叶面温度。",
      "soil": "水生案例要查看水体或底质；附近陆地表层土壤值不能当作海床、湖泥或水体实测。",
      "water": "适合平静或缓慢流动的水面。 营养过多时密集覆盖可能使水下缺光。 降雨与可用水不同，需结合供水位置、季节和排水。"
    },
    "caseText": "以英国低地林地与淡水环境作为地区案例。NASA POWER 2001–2025格点：最冷月1月，月均温3.7°C；最暖月7月，月均温17.1°C。这是气候格点背景；气隙有助漂浮，出芽可快速扩增；平静水面、营养、光照和水温很重要，水面覆盖过密也会遮光。地图采样点不证明该处有这一物种。",
    "question": {
      "id": "bio-check-duckweed",
      "title": "浮萍 · 想一想",
      "prompt": "浮萍漂在水上，应该直接用岸边土壤图解释它的根区吗？",
      "options": [
        "应该；任何岸边土壤值都等于水中的营养测量。",
        "不需要光，因为它的叶状体很小。",
        "不应；优先看水体条件和水面光照，岸土只是背景。"
      ],
      "correctIndex": 2,
      "feedback": [
        "这个判断忽略了器官、出现方式或水热条件中的关键差别。浮萍直接处在水体中；营养与水面变化不能由陆地表层土壤值或年降雨代替。",
        "不能从名称、外观或一次记录跳到这个结论。浮萍直接处在水体中；营养与水面变化不能由陆地表层土壤值或年降雨代替。",
        "浮萍直接处在水体中；营养与水面变化不能由陆地表层土壤值或年降雨代替。"
      ],
      "explanation": "浮萍直接处在水体中；营养与水面变化不能由陆地表层土壤值或年降雨代替。",
      "nextHint": "回到器官图和地区证据，分别说出一条已知事实与一条还需要当地核对的信息。",
      "sources": [
        {
          "title": "Kew POWO · Lemna minor",
          "url": "https://powo.science.kew.org/taxon/urn:lsid:ipni.org:names:526194-1",
          "supports": "接受名、天南星科及英国、中国中南部等原生范围。"
        },
        {
          "title": "NParks · Lemna minor",
          "url": "https://www.nparks.gov.sg/florafaunaweb/flora/5/6/5686",
          "supports": "漂浮叶状体、单根、出芽，静水和营养条件。"
        },
        {
          "title": "NASA POWER：英国低地林地与淡水环境气候格点，2001–2025",
          "url": "https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M%2CPRECTOTCORR&community=AG&longitude=-1&latitude=52&format=JSON",
          "supports": "该采样格点十二个月的气温与平均日降水率；不是树旁、林内、水下或整地区实测。"
        }
      ]
    },
    "sources": [
      {
        "title": "Kew POWO · Lemna minor",
        "url": "https://powo.science.kew.org/taxon/urn:lsid:ipni.org:names:526194-1",
        "supports": "接受名、天南星科及英国、中国中南部等原生范围。"
      },
      {
        "title": "NParks · Lemna minor",
        "url": "https://www.nparks.gov.sg/florafaunaweb/flora/5/6/5686",
        "supports": "漂浮叶状体、单根、出芽，静水和营养条件。"
      },
      {
        "title": "NASA POWER：英国低地林地与淡水环境气候格点，2001–2025",
        "url": "https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M%2CPRECTOTCORR&community=AG&longitude=-1&latitude=52&format=JSON",
        "supports": "该采样格点十二个月的气温与平均日降水率；不是树旁、林内、水下或整地区实测。"
      }
    ],
    "steps": [
      {
        "title": "认识形态",
        "text": "浮水叶状体通常各带一根，主要靠出芽扩增；体型很小却仍属于开花植物。 微小浮水叶状体融合了茎叶特征，通常各有一条根；小型和漂浮不表示它是藻类。",
        "action": {
          "kind": "morphology",
          "regionId": "uk-lowland"
        }
      },
      {
        "title": "环境机制",
        "text": "叶状体内气隙利于浮起，出芽迅速占据水面。 气隙有助漂浮，出芽可快速扩增；平静水面、营养、光照和水温很重要，水面覆盖过密也会遮光。 平静或缓流水面，有光与可利用的水中营养。 温暖有利时期可迅速增殖，实际速度取决于水温、光和营养。 适合平静或缓慢流动的水面。 无需旱地土壤排水评价，需观察水流与水质。 浮萍不是藻类；用一个绿色浮层也不能直接鉴定为 Lemna minor。",
        "action": {
          "kind": "environment",
          "regionId": "uk-lowland"
        }
      },
      {
        "title": "地区证据",
        "text": "以英国低地林地与淡水环境作为地区案例。NASA POWER 2001–2025格点：最冷月1月，月均温3.7°C；最暖月7月，月均温17.1°C。这是气候格点背景；气隙有助漂浮，出芽可快速扩增；平静水面、营养、光照和水温很重要，水面覆盖过密也会遮光。地图采样点不证明该处有这一物种。",
        "action": {
          "kind": "region",
          "regionId": "uk-lowland"
        }
      }
    ],
    "regionRole": "regional-context",
    "substrateKind": "aquatic",
    "substrateNote": "水生案例要查看水体或底质；附近陆地表层土壤值不能当作海床、湖泥或水体实测。",
    "soilCaution": "水生案例要查看水体或底质；附近陆地表层土壤值不能当作海床、湖泥或水体实测。"
  },
  {
    "id": "lavender",
    "cropId": "lavender",
    "name": "狭叶薰衣草",
    "latin": "Lavandula angustifolia",
    "pathId": "aromatics-seasons",
    "group": "芳香与观赏",
    "definition": "基部木质化、狭窄芳香叶和紫色花穗显著；光照、通风与排水共同决定表现。",
    "organs": "基部木质化，狭窄芳香叶和紫色花穗可帮助辨认；本条专指狭叶薰衣草，不代表所有杂交薰衣草。",
    "adaptations": "细叶和芳香木质枝适应开阔环境。",
    "environment": "开阔日照与根区通气十分重要；狭叶并不能消除积水、闷湿与夏季热湿带来的问题。 充足日照、通风与严格排水；成株可耐一定干期。 温带到地中海条件可生长，夏季湿热与冬季湿闷要分别看。 成株可承受一定干期。 排水不良的重黏土风险高。",
    "misconception": "薰衣草田也可能种杂交薰衣草；本页只讨论狭叶薰衣草。",
    "regionId": "liguria",
    "region": {
      "id": "liguria",
      "name": "意大利西北部利古里亚丘陵",
      "lon": 9.3,
      "lat": 44.4,
      "pointMeaning": "地区教学采样点，不是物种观测点、植物精确位置或全地区平均。"
    },
    "rootzone": "soil",
    "evidenceChecks": {
      "climate": "先比较十二个月的温度与降水率，区分生长季、冷季和干湿季。空气格点气温不是水温或叶面温度。",
      "soil": "疏松砂质或砾质土较易提供通气。 排水不良的重黏土风险高。 土壤栅格是区域背景，不是根旁取样；酸碱度不能单独证明排水或养分足够。",
      "water": "成株可承受一定干期。 过量浇水和长时间潮湿易导致根部问题。 降雨与可用水不同，需结合供水位置、季节和排水。"
    },
    "caseText": "以意大利西北部利古里亚丘陵作为地区案例。NASA POWER 2001–2025格点：最冷月1月，月均温3.6°C；最暖月7月，月均温22.7°C。这是气候格点背景；开阔日照与根区通气十分重要；狭叶并不能消除积水、闷湿与夏季热湿带来的问题。地图采样点不证明该处有这一物种。",
    "question": {
      "id": "bio-check-lavender",
      "title": "狭叶薰衣草 · 想一想",
      "prompt": "一个地方的年雨量看起来合适，就能解释薰衣草长得好吗？",
      "options": [
        "还要看降雨季节、日照以及土壤排水与通气。",
        "能；土壤长期积水也没有关系。",
        "紫色花穗表示所有薰衣草具有完全相同的耐寒性。"
      ],
      "correctIndex": 0,
      "feedback": [
        "年总量掩盖雨季分配；根区的空气与水分要同时考虑，用途和花色也不能替代物种识别。",
        "这个判断忽略了器官、出现方式或水热条件中的关键差别。年总量掩盖雨季分配；根区的空气与水分要同时考虑，用途和花色也不能替代物种识别。",
        "不能从名称、外观或一次记录跳到这个结论。年总量掩盖雨季分配；根区的空气与水分要同时考虑，用途和花色也不能替代物种识别。"
      ],
      "explanation": "年总量掩盖雨季分配；根区的空气与水分要同时考虑，用途和花色也不能替代物种识别。",
      "nextHint": "回到器官图和地区证据，分别说出一条已知事实与一条还需要当地核对的信息。",
      "sources": [
        {
          "title": "Kew POWO · Lavandula angustifolia",
          "url": "https://powo.science.kew.org/taxon/449008-1",
          "supports": "接受名、唇形科、西班牙东北部至意大利的原生范围。"
        },
        {
          "title": "NC State · 狭叶薰衣草",
          "url": "https://plants.ces.ncsu.edu/plants/lavandula-angustifolia/",
          "supports": "木质基部、花叶、全日照、通风和严格排水条件。"
        },
        {
          "title": "NASA POWER：意大利西北部利古里亚丘陵气候格点，2001–2025",
          "url": "https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M%2CPRECTOTCORR&community=AG&longitude=9.3&latitude=44.4&format=JSON",
          "supports": "该采样格点十二个月的气温与平均日降水率；不是树旁、林内、水下或整地区实测。"
        }
      ]
    },
    "sources": [
      {
        "title": "Kew POWO · Lavandula angustifolia",
        "url": "https://powo.science.kew.org/taxon/449008-1",
        "supports": "接受名、唇形科、西班牙东北部至意大利的原生范围。"
      },
      {
        "title": "NC State · 狭叶薰衣草",
        "url": "https://plants.ces.ncsu.edu/plants/lavandula-angustifolia/",
        "supports": "木质基部、花叶、全日照、通风和严格排水条件。"
      },
      {
        "title": "NASA POWER：意大利西北部利古里亚丘陵气候格点，2001–2025",
        "url": "https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M%2CPRECTOTCORR&community=AG&longitude=9.3&latitude=44.4&format=JSON",
        "supports": "该采样格点十二个月的气温与平均日降水率；不是树旁、林内、水下或整地区实测。"
      }
    ],
    "steps": [
      {
        "title": "认识形态",
        "text": "基部木质化、狭窄芳香叶和紫色花穗显著；光照、通风与排水共同决定表现。 基部木质化，狭窄芳香叶和紫色花穗可帮助辨认；本条专指狭叶薰衣草，不代表所有杂交薰衣草。",
        "action": {
          "kind": "morphology",
          "regionId": "liguria"
        }
      },
      {
        "title": "环境机制",
        "text": "细叶和芳香木质枝适应开阔环境。 开阔日照与根区通气十分重要；狭叶并不能消除积水、闷湿与夏季热湿带来的问题。 充足日照、通风与严格排水；成株可耐一定干期。 温带到地中海条件可生长，夏季湿热与冬季湿闷要分别看。 成株可承受一定干期。 排水不良的重黏土风险高。 薰衣草田也可能种杂交薰衣草；本页只讨论狭叶薰衣草。",
        "action": {
          "kind": "environment",
          "regionId": "liguria"
        }
      },
      {
        "title": "地区证据",
        "text": "以意大利西北部利古里亚丘陵作为地区案例。NASA POWER 2001–2025格点：最冷月1月，月均温3.6°C；最暖月7月，月均温22.7°C。这是气候格点背景；开阔日照与根区通气十分重要；狭叶并不能消除积水、闷湿与夏季热湿带来的问题。地图采样点不证明该处有这一物种。",
        "action": {
          "kind": "region",
          "regionId": "liguria"
        }
      }
    ],
    "regionRole": "regional-context",
    "substrateKind": "terrestrial",
    "substrateNote": "疏松砂质或砾质土较易提供通气。 排水不良的重黏土风险高。 土壤栅格是区域背景，不是根旁取样；酸碱度不能单独证明排水或养分足够。",
    "soilCaution": "疏松砂质或砾质土较易提供通气。 排水不良的重黏土风险高。 土壤栅格是区域背景，不是根旁取样；酸碱度不能单独证明排水或养分足够。"
  },
  {
    "id": "rosemary",
    "cropId": "rosemary",
    "name": "迷迭香",
    "latin": "Salvia rosmarinus",
    "pathId": "aromatics-seasons",
    "group": "芳香与观赏",
    "definition": "窄叶卷边、木质枝和唇形花是线索；接受名转入鼠尾草属，旧名仍广泛使用。",
    "organs": "木质枝上有窄而边缘下卷的叶，具唇形花。迷迭香的接受名转入鼠尾草属，旧名仍常见。",
    "adaptations": "窄叶及下卷叶缘与干燥环境相适应。",
    "environment": "窄叶与卷边是干燥环境的形态线索，但不能单靠叶形估算需水；根区排水与冬季湿冷也重要。 晴朗、温暖生长季，轻质排水土和适度水分。 偏好阳光和温暖生长季，冬季寒冷与湿土的组合须注意。 成株可承受季节性干期。 根区必须能够排水。",
    "misconception": "迷迭香仍是同一种植物；学名由 Rosmarinus officinalis 转用 Salvia rosmarinus 不表示出现了新作物。",
    "regionId": "liguria",
    "region": {
      "id": "liguria",
      "name": "意大利西北部利古里亚丘陵",
      "lon": 9.3,
      "lat": 44.4,
      "pointMeaning": "地区教学采样点，不是物种观测点、植物精确位置或全地区平均。"
    },
    "rootzone": "soil",
    "evidenceChecks": {
      "climate": "先比较十二个月的温度与降水率，区分生长季、冷季和干湿季。空气格点气温不是水温或叶面温度。",
      "soil": "轻质、疏松土壤适合栽培。 根区必须能够排水。 土壤栅格是区域背景，不是根旁取样；酸碱度不能单独证明排水或养分足够。",
      "water": "成株可承受季节性干期。 长期浇湿根区不符合原生旱季环境。 降雨与可用水不同，需结合供水位置、季节和排水。"
    },
    "caseText": "以意大利西北部利古里亚丘陵作为地区案例。NASA POWER 2001–2025格点：最冷月1月，月均温3.6°C；最暖月7月，月均温22.7°C。这是气候格点背景；窄叶与卷边是干燥环境的形态线索，但不能单靠叶形估算需水；根区排水与冬季湿冷也重要。地图采样点不证明该处有这一物种。",
    "question": {
      "id": "bio-check-rosemary",
      "title": "迷迭香 · 想一想",
      "prompt": "资料使用Salvia rosmarinus而旧书写Rosmarinus officinalis，应该怎样理解？",
      "options": [
        "名字带鼠尾草就说明所有鼠尾草需要相同环境。",
        "先核对同物异名，再看同一物种的环境资料。",
        "学名不同就必然是两个没有关系的新作物。"
      ],
      "correctIndex": 1,
      "feedback": [
        "不能从名称、外观或一次记录跳到这个结论。名称修订不等于换了一种植物；同属也不意味着拥有完全相同的耐寒、耐湿与用水条件。",
        "名称修订不等于换了一种植物；同属也不意味着拥有完全相同的耐寒、耐湿与用水条件。",
        "这个判断忽略了器官、出现方式或水热条件中的关键差别。名称修订不等于换了一种植物；同属也不意味着拥有完全相同的耐寒、耐湿与用水条件。"
      ],
      "explanation": "名称修订不等于换了一种植物；同属也不意味着拥有完全相同的耐寒、耐湿与用水条件。",
      "nextHint": "回到器官图和地区证据，分别说出一条已知事实与一条还需要当地核对的信息。",
      "sources": [
        {
          "title": "Kew POWO · Salvia rosmarinus",
          "url": "https://powo.science.kew.org/taxon/457138-1",
          "supports": "接受名、唇形科及地中海原生范围；Rosmarinus officinalis 为异名。"
        },
        {
          "title": "Kew · Rosemary species profile",
          "url": "https://powo.science.kew.org/taxon/urn:lsid:ipni.org:names:457138-1/general-information",
          "supports": "木质枝、卷边窄叶、唇形花与轻质排水土和日照。"
        },
        {
          "title": "NASA POWER：意大利西北部利古里亚丘陵气候格点，2001–2025",
          "url": "https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M%2CPRECTOTCORR&community=AG&longitude=9.3&latitude=44.4&format=JSON",
          "supports": "该采样格点十二个月的气温与平均日降水率；不是树旁、林内、水下或整地区实测。"
        }
      ]
    },
    "sources": [
      {
        "title": "Kew POWO · Salvia rosmarinus",
        "url": "https://powo.science.kew.org/taxon/457138-1",
        "supports": "接受名、唇形科及地中海原生范围；Rosmarinus officinalis 为异名。"
      },
      {
        "title": "Kew · Rosemary species profile",
        "url": "https://powo.science.kew.org/taxon/urn:lsid:ipni.org:names:457138-1/general-information",
        "supports": "木质枝、卷边窄叶、唇形花与轻质排水土和日照。"
      },
      {
        "title": "NASA POWER：意大利西北部利古里亚丘陵气候格点，2001–2025",
        "url": "https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M%2CPRECTOTCORR&community=AG&longitude=9.3&latitude=44.4&format=JSON",
        "supports": "该采样格点十二个月的气温与平均日降水率；不是树旁、林内、水下或整地区实测。"
      }
    ],
    "steps": [
      {
        "title": "认识形态",
        "text": "窄叶卷边、木质枝和唇形花是线索；接受名转入鼠尾草属，旧名仍广泛使用。 木质枝上有窄而边缘下卷的叶，具唇形花。迷迭香的接受名转入鼠尾草属，旧名仍常见。",
        "action": {
          "kind": "morphology",
          "regionId": "liguria"
        }
      },
      {
        "title": "环境机制",
        "text": "窄叶及下卷叶缘与干燥环境相适应。 窄叶与卷边是干燥环境的形态线索，但不能单靠叶形估算需水；根区排水与冬季湿冷也重要。 晴朗、温暖生长季，轻质排水土和适度水分。 偏好阳光和温暖生长季，冬季寒冷与湿土的组合须注意。 成株可承受季节性干期。 根区必须能够排水。 迷迭香仍是同一种植物；学名由 Rosmarinus officinalis 转用 Salvia rosmarinus 不表示出现了新作物。",
        "action": {
          "kind": "environment",
          "regionId": "liguria"
        }
      },
      {
        "title": "地区证据",
        "text": "以意大利西北部利古里亚丘陵作为地区案例。NASA POWER 2001–2025格点：最冷月1月，月均温3.6°C；最暖月7月，月均温22.7°C。这是气候格点背景；窄叶与卷边是干燥环境的形态线索，但不能单靠叶形估算需水；根区排水与冬季湿冷也重要。地图采样点不证明该处有这一物种。",
        "action": {
          "kind": "region",
          "regionId": "liguria"
        }
      }
    ],
    "regionRole": "regional-context",
    "substrateKind": "terrestrial",
    "substrateNote": "轻质、疏松土壤适合栽培。 根区必须能够排水。 土壤栅格是区域背景，不是根旁取样；酸碱度不能单独证明排水或养分足够。",
    "soilCaution": "轻质、疏松土壤适合栽培。 根区必须能够排水。 土壤栅格是区域背景，不是根旁取样；酸碱度不能单独证明排水或养分足够。"
  },
  {
    "id": "dogrose",
    "cropId": "dogrose",
    "name": "犬蔷薇",
    "latin": "Rosa canina",
    "pathId": "seasonal-woods",
    "group": "芳香与观赏",
    "definition": "弯刺枝条攀倚灌丛，单瓣花之后形成红色蔷薇果，是野生蔷薇的一种。",
    "organs": "弯刺枝条可攀倚灌丛，单瓣花之后形成蔷薇果；红色外部主要不是一整颗普通浆果。",
    "adaptations": "弯刺帮助枝条攀倚，灌丛提供野生动物资源。",
    "environment": "林缘和灌丛提供光照与攀倚空间；土壤水分与植被竞争会影响表现，它不是所有园艺月季的总称。 有光的温带林缘或篱地，湿润而能排水的土层。 适应温带季节，落叶与生长随当地气候变化。 土层湿润而通气有利生长。 保持排水，不让根区长时间缺氧。",
    "misconception": "犬蔷薇是野生物种，不是全部现代月季、重瓣玫瑰或花店切花的总称。",
    "regionId": "uk-lowland",
    "region": {
      "id": "uk-lowland",
      "name": "英国低地林地与淡水环境",
      "lon": -1,
      "lat": 52,
      "pointMeaning": "地区教学采样点，不是物种观测点、植物精确位置或全地区平均。"
    },
    "rootzone": "soil",
    "evidenceChecks": {
      "climate": "先比较十二个月的温度与降水率，区分生长季、冷季和干湿季。空气格点气温不是水温或叶面温度。",
      "soil": "多种壤土、砂土或黏土均有园艺适应记录。 保持排水，不让根区长时间缺氧。 土壤栅格是区域背景，不是根旁取样；酸碱度不能单独证明排水或养分足够。",
      "water": "土层湿润而通气有利生长。 不是越潮湿越有利。 降雨与可用水不同，需结合供水位置、季节和排水。"
    },
    "caseText": "以英国低地林地与淡水环境作为地区案例。NASA POWER 2001–2025格点：最冷月1月，月均温3.7°C；最暖月7月，月均温17.1°C。这是气候格点背景；林缘和灌丛提供光照与攀倚空间；土壤水分与植被竞争会影响表现，它不是所有园艺月季的总称。地图采样点不证明该处有这一物种。",
    "question": {
      "id": "bio-check-dogrose",
      "title": "犬蔷薇 · 想一想",
      "prompt": "用犬蔷薇解释英国灌丛时，哪种说法更可靠？",
      "options": [
        "把所有花店切花与现代月季都当作犬蔷薇。",
        "有弯刺就证明它可以在完全无光的林下正常开花。",
        "把具体物种的光照、土壤水分和灌丛结构联系起来。"
      ],
      "correctIndex": 2,
      "feedback": [
        "这个判断忽略了器官、出现方式或水热条件中的关键差别。犬蔷薇的攀倚结构与林缘光照可以联系，但不能由一个野生物种概括所有现代玫瑰。",
        "不能从名称、外观或一次记录跳到这个结论。犬蔷薇的攀倚结构与林缘光照可以联系，但不能由一个野生物种概括所有现代玫瑰。",
        "犬蔷薇的攀倚结构与林缘光照可以联系，但不能由一个野生物种概括所有现代玫瑰。"
      ],
      "explanation": "犬蔷薇的攀倚结构与林缘光照可以联系，但不能由一个野生物种概括所有现代玫瑰。",
      "nextHint": "回到器官图和地区证据，分别说出一条已知事实与一条还需要当地核对的信息。",
      "sources": [
        {
          "title": "University of Michigan · Rosa canina",
          "url": "https://climbers.lsa.umich.edu/rosa-canina/",
          "supports": "学名、蔷薇科、欧洲至西亚北非原生范围、弯刺和单瓣花果。"
        },
        {
          "title": "RHS · 犬蔷薇",
          "url": "https://www.rhs.org.uk/plants/16017/rosa-canina-s/details",
          "supports": "英国原生、林缘式灌木生长、湿润排水土及日照。"
        },
        {
          "title": "South Australia government · GRIN taxonomy",
          "url": "https://apg.pir.sa.gov.au/gringlobal/taxon/taxonomydetail?id=5309",
          "supports": "英国、法国等原生分布国家。"
        },
        {
          "title": "NASA POWER：英国低地林地与淡水环境气候格点，2001–2025",
          "url": "https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M%2CPRECTOTCORR&community=AG&longitude=-1&latitude=52&format=JSON",
          "supports": "该采样格点十二个月的气温与平均日降水率；不是树旁、林内、水下或整地区实测。"
        }
      ]
    },
    "sources": [
      {
        "title": "University of Michigan · Rosa canina",
        "url": "https://climbers.lsa.umich.edu/rosa-canina/",
        "supports": "学名、蔷薇科、欧洲至西亚北非原生范围、弯刺和单瓣花果。"
      },
      {
        "title": "RHS · 犬蔷薇",
        "url": "https://www.rhs.org.uk/plants/16017/rosa-canina-s/details",
        "supports": "英国原生、林缘式灌木生长、湿润排水土及日照。"
      },
      {
        "title": "South Australia government · GRIN taxonomy",
        "url": "https://apg.pir.sa.gov.au/gringlobal/taxon/taxonomydetail?id=5309",
        "supports": "英国、法国等原生分布国家。"
      },
      {
        "title": "NASA POWER：英国低地林地与淡水环境气候格点，2001–2025",
        "url": "https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M%2CPRECTOTCORR&community=AG&longitude=-1&latitude=52&format=JSON",
        "supports": "该采样格点十二个月的气温与平均日降水率；不是树旁、林内、水下或整地区实测。"
      }
    ],
    "steps": [
      {
        "title": "认识形态",
        "text": "弯刺枝条攀倚灌丛，单瓣花之后形成红色蔷薇果，是野生蔷薇的一种。 弯刺枝条可攀倚灌丛，单瓣花之后形成蔷薇果；红色外部主要不是一整颗普通浆果。",
        "action": {
          "kind": "morphology",
          "regionId": "uk-lowland"
        }
      },
      {
        "title": "环境机制",
        "text": "弯刺帮助枝条攀倚，灌丛提供野生动物资源。 林缘和灌丛提供光照与攀倚空间；土壤水分与植被竞争会影响表现，它不是所有园艺月季的总称。 有光的温带林缘或篱地，湿润而能排水的土层。 适应温带季节，落叶与生长随当地气候变化。 土层湿润而通气有利生长。 保持排水，不让根区长时间缺氧。 犬蔷薇是野生物种，不是全部现代月季、重瓣玫瑰或花店切花的总称。",
        "action": {
          "kind": "environment",
          "regionId": "uk-lowland"
        }
      },
      {
        "title": "地区证据",
        "text": "以英国低地林地与淡水环境作为地区案例。NASA POWER 2001–2025格点：最冷月1月，月均温3.7°C；最暖月7月，月均温17.1°C。这是气候格点背景；林缘和灌丛提供光照与攀倚空间；土壤水分与植被竞争会影响表现，它不是所有园艺月季的总称。地图采样点不证明该处有这一物种。",
        "action": {
          "kind": "region",
          "regionId": "uk-lowland"
        }
      }
    ],
    "regionRole": "regional-context",
    "substrateKind": "terrestrial",
    "substrateNote": "多种壤土、砂土或黏土均有园艺适应记录。 保持排水，不让根区长时间缺氧。 土壤栅格是区域背景，不是根旁取样；酸碱度不能单独证明排水或养分足够。",
    "soilCaution": "多种壤土、砂土或黏土均有园艺适应记录。 保持排水，不让根区长时间缺氧。 土壤栅格是区域背景，不是根旁取样；酸碱度不能单独证明排水或养分足够。"
  },
  {
    "id": "tulip",
    "cropId": "tulip",
    "name": "园艺郁金香",
    "latin": "Tulipa gesneriana",
    "pathId": "aromatics-seasons",
    "group": "芳香与观赏",
    "definition": "鳞茎储藏资源，春季生长开花；名称被接受，但材料带有复杂的栽培和杂交背景。",
    "organs": "地下鳞茎储藏养分，春季长叶开花；园艺郁金香材料常有复杂杂交背景，来源不能简单画成单一野生点。",
    "adaptations": "地下鳞茎在不利季节保存养分。",
    "environment": "把凉季生长、开花与鳞茎休眠分开看；温室处理和园艺管理也可能改变开花时间，积水会影响鳞茎。 温带季节节律、阳光和肥沃排水土；生长与休眠分开供水。 温带季节节律重要，不以一年平均温度代替鳞茎的季节过程。 生长季需要水分，休眠与生长不能同等浇水。 尤其要避免休眠鳞茎周围长时间积水。",
    "misconception": "这不是可无争议定位的野生郁金香原生地图；学名、栽培来源与园艺杂交品种须区分。",
    "regionId": "netherlands",
    "region": {
      "id": "netherlands",
      "name": "荷兰植物园栽培环境",
      "lon": 4.49,
      "lat": 52.16,
      "pointMeaning": "地区教学采样点，不是物种观测点、植物精确位置或全地区平均。"
    },
    "rootzone": "soil",
    "evidenceChecks": {
      "climate": "先比较十二个月的温度与降水率，区分生长季、冷季和干湿季。空气格点气温不是水温或叶面温度。",
      "soil": "肥沃、疏松的壤土或砂质土适合栽培。 尤其要避免休眠鳞茎周围长时间积水。 土壤栅格是区域背景，不是根旁取样；酸碱度不能单独证明排水或养分足够。",
      "water": "生长季需要水分，休眠与生长不能同等浇水。 持续冬湿会使鳞茎受损。 降雨与可用水不同，需结合供水位置、季节和排水。"
    },
    "caseText": "以荷兰植物园栽培环境作为地区案例。NASA POWER 2001–2025格点：最冷月1月，月均温3.8°C；最暖月8月，月均温18.3°C。这是气候格点背景；把凉季生长、开花与鳞茎休眠分开看；温室处理和园艺管理也可能改变开花时间，积水会影响鳞茎。地图采样点不证明该处有这一物种。",
    "question": {
      "id": "bio-check-tulip",
      "title": "园艺郁金香 · 想一想",
      "prompt": "荷兰植物园的郁金香案例能直接证明什么？",
      "options": [
        "说明当地有园艺栽培语境，不能据此确定野生原生地。",
        "证明全世界郁金香都原生于这座植物园。",
        "证明地下鳞茎在休眠期始终浸水也没有问题。"
      ],
      "correctIndex": 0,
      "feedback": [
        "园艺展示需要结合人工管理理解；野生范围、杂交材料与栽培环境回答不同的问题。",
        "这个判断忽略了器官、出现方式或水热条件中的关键差别。园艺展示需要结合人工管理理解；野生范围、杂交材料与栽培环境回答不同的问题。",
        "不能从名称、外观或一次记录跳到这个结论。园艺展示需要结合人工管理理解；野生范围、杂交材料与栽培环境回答不同的问题。"
      ],
      "explanation": "园艺展示需要结合人工管理理解；野生范围、杂交材料与栽培环境回答不同的问题。",
      "nextHint": "回到器官图和地区证据，分别说出一条已知事实与一条还需要当地核对的信息。",
      "sources": [
        {
          "title": "Kew POWO · Tulipa gesneriana",
          "url": "https://powo.science.kew.org/taxon/urn:lsid:ipni.org:names:542923-1",
          "supports": "Kew 接受该学名并描述为来自土耳其的栽培起源植物。"
        },
        {
          "title": "RHS · Tulipa gesneriana",
          "url": "https://www.rhs.org.uk/plants/18512/tulipa-gesneriana/details",
          "supports": "鳞茎、叶花、春季开花与秋植、日照和避免冬湿；同名材料可能为杂交。"
        },
        {
          "title": "Hortus Botanicus Amsterdam · 活植物名录",
          "url": "https://dehortus.gardenexplorer.org/taxon.aspx?t=8003",
          "supports": "荷兰植物园收录该名的栽培材料；馆藏页面可能跳转到检索页。"
        },
        {
          "title": "NASA POWER：荷兰植物园栽培环境气候格点，2001–2025",
          "url": "https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M%2CPRECTOTCORR&community=AG&longitude=4.49&latitude=52.16&format=JSON",
          "supports": "该采样格点十二个月的气温与平均日降水率；不是树旁、林内、水下或整地区实测。"
        }
      ]
    },
    "sources": [
      {
        "title": "Kew POWO · Tulipa gesneriana",
        "url": "https://powo.science.kew.org/taxon/urn:lsid:ipni.org:names:542923-1",
        "supports": "Kew 接受该学名并描述为来自土耳其的栽培起源植物。"
      },
      {
        "title": "RHS · Tulipa gesneriana",
        "url": "https://www.rhs.org.uk/plants/18512/tulipa-gesneriana/details",
        "supports": "鳞茎、叶花、春季开花与秋植、日照和避免冬湿；同名材料可能为杂交。"
      },
      {
        "title": "Hortus Botanicus Amsterdam · 活植物名录",
        "url": "https://dehortus.gardenexplorer.org/taxon.aspx?t=8003",
        "supports": "荷兰植物园收录该名的栽培材料；馆藏页面可能跳转到检索页。"
      },
      {
        "title": "NASA POWER：荷兰植物园栽培环境气候格点，2001–2025",
        "url": "https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M%2CPRECTOTCORR&community=AG&longitude=4.49&latitude=52.16&format=JSON",
        "supports": "该采样格点十二个月的气温与平均日降水率；不是树旁、林内、水下或整地区实测。"
      }
    ],
    "steps": [
      {
        "title": "认识形态",
        "text": "鳞茎储藏资源，春季生长开花；名称被接受，但材料带有复杂的栽培和杂交背景。 地下鳞茎储藏养分，春季长叶开花；园艺郁金香材料常有复杂杂交背景，来源不能简单画成单一野生点。",
        "action": {
          "kind": "morphology",
          "regionId": "netherlands"
        }
      },
      {
        "title": "环境机制",
        "text": "地下鳞茎在不利季节保存养分。 把凉季生长、开花与鳞茎休眠分开看；温室处理和园艺管理也可能改变开花时间，积水会影响鳞茎。 温带季节节律、阳光和肥沃排水土；生长与休眠分开供水。 温带季节节律重要，不以一年平均温度代替鳞茎的季节过程。 生长季需要水分，休眠与生长不能同等浇水。 尤其要避免休眠鳞茎周围长时间积水。 这不是可无争议定位的野生郁金香原生地图；学名、栽培来源与园艺杂交品种须区分。",
        "action": {
          "kind": "environment",
          "regionId": "netherlands"
        }
      },
      {
        "title": "地区证据",
        "text": "以荷兰植物园栽培环境作为地区案例。NASA POWER 2001–2025格点：最冷月1月，月均温3.8°C；最暖月8月，月均温18.3°C。这是气候格点背景；把凉季生长、开花与鳞茎休眠分开看；温室处理和园艺管理也可能改变开花时间，积水会影响鳞茎。地图采样点不证明该处有这一物种。",
        "action": {
          "kind": "region",
          "regionId": "netherlands"
        }
      }
    ],
    "regionRole": "cultivation-context",
    "substrateKind": "terrestrial",
    "substrateNote": "肥沃、疏松的壤土或砂质土适合栽培。 尤其要避免休眠鳞茎周围长时间积水。 土壤栅格是区域背景，不是根旁取样；酸碱度不能单独证明排水或养分足够。",
    "soilCaution": "肥沃、疏松的壤土或砂质土适合栽培。 尤其要避免休眠鳞茎周围长时间积水。 土壤栅格是区域背景，不是根旁取样；酸碱度不能单独证明排水或养分足够。"
  },
  {
    "id": "orchid",
    "cropId": "orchid",
    "name": "白花蝴蝶兰",
    "latin": "Phalaenopsis amabilis",
    "pathId": "forest-layers",
    "group": "芳香与观赏",
    "definition": "白花具唇瓣，厚叶与根生于短茎；通常附生而非寄生，根需要空气。",
    "organs": "白花具特别形状的唇瓣，厚叶与短茎、气生根组成植株；附着树干不等于从树体吸取食物。",
    "adaptations": "附生位置获取散射光，根兼顾吸水与固定。",
    "environment": "附生位置提供散射光与通风，降雨和湿润空气可提供水分；根表干湿变化不能由地面土壤图代替。 温暖湿润、散射光和能恢复通气的附生根环境。 温暖湿润森林条件有利，寒冷与干燥环境不应由室内栽培外推。 湿润空气和适度补水有利。 栽培介质应疏松透气。",
    "misconception": "商业蝴蝶兰多为杂交材料；这里是白花蝴蝶兰这一具体物种，附生也不等于寄生。",
    "regionId": "java",
    "region": {
      "id": "java",
      "name": "印度尼西亚爪哇热带森林",
      "lon": 110.4,
      "lat": -7.5,
      "pointMeaning": "地区教学采样点，不是物种观测点、植物精确位置或全地区平均。"
    },
    "rootzone": "epiphyte",
    "evidenceChecks": {
      "climate": "先比较十二个月的温度与降水率，区分生长季、冷季和干湿季。空气格点气温不是水温或叶面温度。",
      "soil": "附生根表的树皮、腐殖质与通气不同于地表土层；陆地土壤模型只提供周围背景。",
      "water": "湿润空气和适度补水有利。 将根长期闷在稠密泥土中不等同自然湿度。 降雨与可用水不同，需结合供水位置、季节和排水。"
    },
    "caseText": "以印度尼西亚爪哇热带森林作为地区案例。NASA POWER 2001–2025格点：最少雨月8月，月平均日降水率1.03mm/day；最多雨月2月，12.24mm/day；不是月总量。这是气候格点背景；附生位置提供散射光与通风，降雨和湿润空气可提供水分；根表干湿变化不能由地面土壤图代替。地图采样点不证明该处有这一物种。",
    "question": {
      "id": "bio-check-orchid",
      "title": "白花蝴蝶兰 · 想一想",
      "prompt": "白花蝴蝶兰附在树上，最关键的区别是什么？",
      "options": [
        "它靠树体提供全部有机物，所以不需要光合作用。",
        "附生不等于寄生；根需要吸水也需要空气。",
        "树干只是盆土的同义词，应把根埋入密实泥里。"
      ],
      "correctIndex": 1,
      "feedback": [
        "不能从名称、外观或一次记录跳到这个结论。附生利用支撑与位置，植株仍自己光合作用；林冠根表的小环境不同于陆地表层土壤。",
        "附生利用支撑与位置，植株仍自己光合作用；林冠根表的小环境不同于陆地表层土壤。",
        "这个判断忽略了器官、出现方式或水热条件中的关键差别。附生利用支撑与位置，植株仍自己光合作用；林冠根表的小环境不同于陆地表层土壤。"
      ],
      "explanation": "附生利用支撑与位置，植株仍自己光合作用；林冠根表的小环境不同于陆地表层土壤。",
      "nextHint": "回到器官图和地区证据，分别说出一条已知事实与一条还需要当地核对的信息。",
      "sources": [
        {
          "title": "NParks · Phalaenopsis amabilis",
          "url": "https://www.nparks.gov.sg/florafaunaweb/flora/5/8/5881",
          "supports": "兰科、接受名、爪哇至昆士兰等原生范围；附生根、厚叶与花形。"
        },
        {
          "title": "American Orchid Society · Phalaenopsis genus",
          "url": "https://www.aos.org/phalaenopsis-the-genus",
          "supports": "蝴蝶兰属及 P. amabilis 的范围、形态与近似种区别。"
        },
        {
          "title": "NASA POWER：印度尼西亚爪哇热带森林气候格点，2001–2025",
          "url": "https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M%2CPRECTOTCORR&community=AG&longitude=110.4&latitude=-7.5&format=JSON",
          "supports": "该采样格点十二个月的气温与平均日降水率；不是树旁、林内、水下或整地区实测。"
        }
      ]
    },
    "sources": [
      {
        "title": "NParks · Phalaenopsis amabilis",
        "url": "https://www.nparks.gov.sg/florafaunaweb/flora/5/8/5881",
        "supports": "兰科、接受名、爪哇至昆士兰等原生范围；附生根、厚叶与花形。"
      },
      {
        "title": "American Orchid Society · Phalaenopsis genus",
        "url": "https://www.aos.org/phalaenopsis-the-genus",
        "supports": "蝴蝶兰属及 P. amabilis 的范围、形态与近似种区别。"
      },
      {
        "title": "NASA POWER：印度尼西亚爪哇热带森林气候格点，2001–2025",
        "url": "https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M%2CPRECTOTCORR&community=AG&longitude=110.4&latitude=-7.5&format=JSON",
        "supports": "该采样格点十二个月的气温与平均日降水率；不是树旁、林内、水下或整地区实测。"
      }
    ],
    "steps": [
      {
        "title": "认识形态",
        "text": "白花具唇瓣，厚叶与根生于短茎；通常附生而非寄生，根需要空气。 白花具特别形状的唇瓣，厚叶与短茎、气生根组成植株；附着树干不等于从树体吸取食物。",
        "action": {
          "kind": "morphology",
          "regionId": "java"
        }
      },
      {
        "title": "环境机制",
        "text": "附生位置获取散射光，根兼顾吸水与固定。 附生位置提供散射光与通风，降雨和湿润空气可提供水分；根表干湿变化不能由地面土壤图代替。 温暖湿润、散射光和能恢复通气的附生根环境。 温暖湿润森林条件有利，寒冷与干燥环境不应由室内栽培外推。 湿润空气和适度补水有利。 栽培介质应疏松透气。 商业蝴蝶兰多为杂交材料；这里是白花蝴蝶兰这一具体物种，附生也不等于寄生。",
        "action": {
          "kind": "environment",
          "regionId": "java"
        }
      },
      {
        "title": "地区证据",
        "text": "以印度尼西亚爪哇热带森林作为地区案例。NASA POWER 2001–2025格点：最少雨月8月，月平均日降水率1.03mm/day；最多雨月2月，12.24mm/day；不是月总量。这是气候格点背景；附生位置提供散射光与通风，降雨和湿润空气可提供水分；根表干湿变化不能由地面土壤图代替。地图采样点不证明该处有这一物种。",
        "action": {
          "kind": "region",
          "regionId": "java"
        }
      }
    ],
    "regionRole": "regional-context",
    "substrateKind": "epiphytic",
    "substrateNote": "附生根表的树皮、腐殖质与通气不同于地表土层；陆地土壤模型只提供周围背景。",
    "soilCaution": "附生根表的树皮、腐殖质与通气不同于地表土层；陆地土壤模型只提供周围背景。"
  },
  {
    "id": "venusflytrap",
    "cropId": "venusflytrap",
    "name": "捕蝇草",
    "latin": "Dionaea muscipula",
    "pathId": "carnivorous-wetlands",
    "group": "食虫植物",
    "definition": "夹状捕虫叶和触发毛用于获取动物营养；仍以光合作用制造有机物。",
    "organs": "捕虫夹是变形叶，触发毛与夹合动作参与捕获；根、普通叶片和花也有各自功能。",
    "adaptations": "变形叶捕获昆虫，补充贫营养环境缺少的元素。",
    "environment": "捕虫补充贫营养湿地中不足的矿质营养，不能替代阳光；稳定湿润、低矿物质水与季节也重要。 有光的贫营养湿地、低矿物质水与正常季节休眠。 具有温带季节休眠节律，不能当作全年恒热、永不休眠的盆栽。 根区常湿，水中矿物质含量要低。 湿地水文不能改写成普通花土频繁施肥。",
    "misconception": "食虫不取代光合作用；全球流行盆栽不表示捕蝇草野生分布广泛。",
    "regionId": "carolina-wetland",
    "region": {
      "id": "carolina-wetland",
      "name": "美国北卡罗来纳沿海湿地",
      "lon": -78.1,
      "lat": 34.1,
      "pointMeaning": "地区教学采样点，不是物种观测点、植物精确位置或全地区平均。"
    },
    "rootzone": "soil",
    "evidenceChecks": {
      "climate": "先比较十二个月的温度与降水率，区分生长季、冷季和干湿季。空气格点气温不是水温或叶面温度。",
      "soil": "天然生境多为湿润、贫营养的砂质或泥炭背景。 湿地水文不能改写成普通花土频繁施肥。 土壤栅格是区域背景，不是根旁取样；酸碱度不能单独证明排水或养分足够。",
      "water": "根区常湿，水中矿物质含量要低。 硬水、浓肥或长期脏水可能伤害植株。 降雨与可用水不同，需结合供水位置、季节和排水。"
    },
    "caseText": "以美国北卡罗来纳沿海湿地作为地区案例。NASA POWER 2001–2025格点：最冷月1月，月均温8.9°C；最暖月7月，月均温27.3°C。这是气候格点背景；捕虫补充贫营养湿地中不足的矿质营养，不能替代阳光；稳定湿润、低矿物质水与季节也重要。地图采样点不证明该处有这一物种。",
    "question": {
      "id": "bio-check-venusflytrap",
      "title": "捕蝇草 · 想一想",
      "prompt": "捕蝇草能抓虫，是否因此不需要阳光？",
      "options": [
        "不需要；只要不断喂虫就能完全替代光。",
        "它在全球被盆栽，所以野生原生范围遍布全球。",
        "仍需要；捕虫补充营养，光合作用制造有机物。"
      ],
      "correctIndex": 2,
      "feedback": [
        "这个判断忽略了器官、出现方式或水热条件中的关键差别。食虫与光合作用解决不同需要；温室与盆栽记录也不能代替狭窄的野生原生范围。",
        "不能从名称、外观或一次记录跳到这个结论。食虫与光合作用解决不同需要；温室与盆栽记录也不能代替狭窄的野生原生范围。",
        "食虫与光合作用解决不同需要；温室与盆栽记录也不能代替狭窄的野生原生范围。"
      ],
      "explanation": "食虫与光合作用解决不同需要；温室与盆栽记录也不能代替狭窄的野生原生范围。",
      "nextHint": "回到器官图和地区证据，分别说出一条已知事实与一条还需要当地核对的信息。",
      "sources": [
        {
          "title": "Kew POWO · Dionaea muscipula",
          "url": "https://powo.science.kew.org/taxon/urn:lsid:ipni.org:names:275898-2",
          "supports": "接受名、茅膏菜科和美国两卡罗来纳沿海狭窄原生范围。"
        },
        {
          "title": "NC State · 捕蝇草",
          "url": "https://plants.ces.ncsu.edu/plants/dionaea-muscipula/",
          "supports": "夹状叶、感应毛、光照、贫营养湿地、低矿物质水和肥害。"
        },
        {
          "title": "NASA POWER：美国北卡罗来纳沿海湿地气候格点，2001–2025",
          "url": "https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M%2CPRECTOTCORR&community=AG&longitude=-78.1&latitude=34.1&format=JSON",
          "supports": "该采样格点十二个月的气温与平均日降水率；不是树旁、林内、水下或整地区实测。"
        }
      ]
    },
    "sources": [
      {
        "title": "Kew POWO · Dionaea muscipula",
        "url": "https://powo.science.kew.org/taxon/urn:lsid:ipni.org:names:275898-2",
        "supports": "接受名、茅膏菜科和美国两卡罗来纳沿海狭窄原生范围。"
      },
      {
        "title": "NC State · 捕蝇草",
        "url": "https://plants.ces.ncsu.edu/plants/dionaea-muscipula/",
        "supports": "夹状叶、感应毛、光照、贫营养湿地、低矿物质水和肥害。"
      },
      {
        "title": "NASA POWER：美国北卡罗来纳沿海湿地气候格点，2001–2025",
        "url": "https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M%2CPRECTOTCORR&community=AG&longitude=-78.1&latitude=34.1&format=JSON",
        "supports": "该采样格点十二个月的气温与平均日降水率；不是树旁、林内、水下或整地区实测。"
      }
    ],
    "steps": [
      {
        "title": "认识形态",
        "text": "夹状捕虫叶和触发毛用于获取动物营养；仍以光合作用制造有机物。 捕虫夹是变形叶，触发毛与夹合动作参与捕获；根、普通叶片和花也有各自功能。",
        "action": {
          "kind": "morphology",
          "regionId": "carolina-wetland"
        }
      },
      {
        "title": "环境机制",
        "text": "变形叶捕获昆虫，补充贫营养环境缺少的元素。 捕虫补充贫营养湿地中不足的矿质营养，不能替代阳光；稳定湿润、低矿物质水与季节也重要。 有光的贫营养湿地、低矿物质水与正常季节休眠。 具有温带季节休眠节律，不能当作全年恒热、永不休眠的盆栽。 根区常湿，水中矿物质含量要低。 湿地水文不能改写成普通花土频繁施肥。 食虫不取代光合作用；全球流行盆栽不表示捕蝇草野生分布广泛。",
        "action": {
          "kind": "environment",
          "regionId": "carolina-wetland"
        }
      },
      {
        "title": "地区证据",
        "text": "以美国北卡罗来纳沿海湿地作为地区案例。NASA POWER 2001–2025格点：最冷月1月，月均温8.9°C；最暖月7月，月均温27.3°C。这是气候格点背景；捕虫补充贫营养湿地中不足的矿质营养，不能替代阳光；稳定湿润、低矿物质水与季节也重要。地图采样点不证明该处有这一物种。",
        "action": {
          "kind": "region",
          "regionId": "carolina-wetland"
        }
      }
    ],
    "regionRole": "regional-context",
    "substrateKind": "terrestrial",
    "substrateNote": "天然生境多为湿润、贫营养的砂质或泥炭背景。 湿地水文不能改写成普通花土频繁施肥。 土壤栅格是区域背景，不是根旁取样；酸碱度不能单独证明排水或养分足够。",
    "soilCaution": "天然生境多为湿润、贫营养的砂质或泥炭背景。 湿地水文不能改写成普通花土频繁施肥。 土壤栅格是区域背景，不是根旁取样；酸碱度不能单独证明排水或养分足够。"
  },
  {
    "id": "sundew",
    "cropId": "sundew",
    "name": "圆叶茅膏菜",
    "latin": "Drosera rotundifolia",
    "pathId": "carnivorous-wetlands",
    "group": "食虫植物",
    "definition": "圆叶上的腺毛分泌黏液捕虫，紧缩越冬芽帮助度过寒季。",
    "organs": "圆叶上有分泌黏液的腺毛，可以黏住小动物；寒季形成紧缩越冬芽是另一种生活阶段。",
    "adaptations": "黏液捕虫补充矿质营养，叶片仍进行光合作用。",
    "environment": "湿润、贫营养且有光的生境利于理解捕虫策略；施入大量肥料或排水干化都可能改变植物竞争。 湿润、偏酸且贫营养的湿地；冷季可形成越冬芽。 适应明显冷暖季节，低温时期与生长季叶丛不同。 常见于持续湿润的沼泽与泥炭地。 湿地微地形决定湿度，不按农田排水栽培。",
    "misconception": "“贫营养”不是完全没有养分；圆叶茅膏菜也不是只靠吃虫就能离开阳光生活。",
    "regionId": "scotland-wetland",
    "region": {
      "id": "scotland-wetland",
      "name": "英国苏格兰湿地",
      "lon": -4.2,
      "lat": 57.2,
      "pointMeaning": "地区教学采样点，不是物种观测点、植物精确位置或全地区平均。"
    },
    "rootzone": "soil",
    "evidenceChecks": {
      "climate": "先比较十二个月的温度与降水率，区分生长季、冷季和干湿季。空气格点气温不是水温或叶面温度。",
      "soil": "酸性、低营养基质是常见背景。 湿地微地形决定湿度，不按农田排水栽培。 土壤栅格是区域背景，不是根旁取样；酸碱度不能单独证明排水或养分足够。",
      "water": "常见于持续湿润的沼泽与泥炭地。 排水干化和富营养化都会改变竞争条件。 降雨与可用水不同，需结合供水位置、季节和排水。"
    },
    "caseText": "以英国苏格兰湿地作为地区案例。NASA POWER 2001–2025格点：最冷月2月，月均温0.5°C；最暖月7月，月均温11.8°C。这是气候格点背景；湿润、贫营养且有光的生境利于理解捕虫策略；施入大量肥料或排水干化都可能改变植物竞争。地图采样点不证明该处有这一物种。",
    "question": {
      "id": "bio-check-sundew",
      "title": "圆叶茅膏菜 · 想一想",
      "prompt": "圆叶茅膏菜的黏液叶与贫营养湿地有什么联系？",
      "options": [
        "捕虫补充矿质营养，但仍需光、水和适合的季节。",
        "捕虫表示它喜欢任意浓度的肥水。",
        "贫营养表示环境完全没有元素，只要吃虫即可。"
      ],
      "correctIndex": 0,
      "feedback": [
        "贫营养是相对供给条件，捕虫并不能解除失水、光照和越冬等限制。",
        "这个判断忽略了器官、出现方式或水热条件中的关键差别。贫营养是相对供给条件，捕虫并不能解除失水、光照和越冬等限制。",
        "不能从名称、外观或一次记录跳到这个结论。贫营养是相对供给条件，捕虫并不能解除失水、光照和越冬等限制。"
      ],
      "explanation": "贫营养是相对供给条件，捕虫并不能解除失水、光照和越冬等限制。",
      "nextHint": "回到器官图和地区证据，分别说出一条已知事实与一条还需要当地核对的信息。",
      "sources": [
        {
          "title": "Kew · Round-leafed sundew",
          "url": "https://www.kew.org/plants/round-leafed-sundew",
          "supports": "接受名、圆叶腺毛、北半球原生范围，包括英国和加拿大东部；酸性贫营养湿地。"
        },
        {
          "title": "US Forest Service · Drosera rotundifolia",
          "url": "https://research.fs.usda.gov/feis/species-reviews/drorot",
          "supports": "自然生境、生活史和紧缩越冬芽。"
        },
        {
          "title": "NASA POWER：英国苏格兰湿地气候格点，2001–2025",
          "url": "https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M%2CPRECTOTCORR&community=AG&longitude=-4.2&latitude=57.2&format=JSON",
          "supports": "该采样格点十二个月的气温与平均日降水率；不是树旁、林内、水下或整地区实测。"
        }
      ]
    },
    "sources": [
      {
        "title": "Kew · Round-leafed sundew",
        "url": "https://www.kew.org/plants/round-leafed-sundew",
        "supports": "接受名、圆叶腺毛、北半球原生范围，包括英国和加拿大东部；酸性贫营养湿地。"
      },
      {
        "title": "US Forest Service · Drosera rotundifolia",
        "url": "https://research.fs.usda.gov/feis/species-reviews/drorot",
        "supports": "自然生境、生活史和紧缩越冬芽。"
      },
      {
        "title": "NASA POWER：英国苏格兰湿地气候格点，2001–2025",
        "url": "https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M%2CPRECTOTCORR&community=AG&longitude=-4.2&latitude=57.2&format=JSON",
        "supports": "该采样格点十二个月的气温与平均日降水率；不是树旁、林内、水下或整地区实测。"
      }
    ],
    "steps": [
      {
        "title": "认识形态",
        "text": "圆叶上的腺毛分泌黏液捕虫，紧缩越冬芽帮助度过寒季。 圆叶上有分泌黏液的腺毛，可以黏住小动物；寒季形成紧缩越冬芽是另一种生活阶段。",
        "action": {
          "kind": "morphology",
          "regionId": "scotland-wetland"
        }
      },
      {
        "title": "环境机制",
        "text": "黏液捕虫补充矿质营养，叶片仍进行光合作用。 湿润、贫营养且有光的生境利于理解捕虫策略；施入大量肥料或排水干化都可能改变植物竞争。 湿润、偏酸且贫营养的湿地；冷季可形成越冬芽。 适应明显冷暖季节，低温时期与生长季叶丛不同。 常见于持续湿润的沼泽与泥炭地。 湿地微地形决定湿度，不按农田排水栽培。 “贫营养”不是完全没有养分；圆叶茅膏菜也不是只靠吃虫就能离开阳光生活。",
        "action": {
          "kind": "environment",
          "regionId": "scotland-wetland"
        }
      },
      {
        "title": "地区证据",
        "text": "以英国苏格兰湿地作为地区案例。NASA POWER 2001–2025格点：最冷月2月，月均温0.5°C；最暖月7月，月均温11.8°C。这是气候格点背景；湿润、贫营养且有光的生境利于理解捕虫策略；施入大量肥料或排水干化都可能改变植物竞争。地图采样点不证明该处有这一物种。",
        "action": {
          "kind": "region",
          "regionId": "scotland-wetland"
        }
      }
    ],
    "regionRole": "regional-context",
    "substrateKind": "peat",
    "substrateNote": "酸性、低营养基质是常见背景。 湿地微地形决定湿度，不按农田排水栽培。 土壤栅格是区域背景，不是根旁取样；酸碱度不能单独证明排水或养分足够。",
    "soilCaution": "酸性、低营养基质是常见背景。 湿地微地形决定湿度，不按农田排水栽培。 土壤栅格是区域背景，不是根旁取样；酸碱度不能单独证明排水或养分足够。"
  },
  {
    "id": "edelweiss",
    "cropId": "edelweiss",
    "name": "高山火绒草",
    "latin": "Leontopodium nivale",
    "pathId": "cool-mountains",
    "group": "高山植物",
    "definition": "白色星状部分主要是有毛苞片，中央才是花序；以阿尔卑斯代表亚种讲解环境。",
    "organs": "白色星状外观主要来自有毛苞片，中央聚集小花序；本课环境解释以阿尔卑斯代表亚种为语境。",
    "adaptations": "低矮株形和毛被构成山地生活的形态线索。",
    "environment": "低矮株形与毛被是山地形态线索，但坡向、积雪、石灰性基质和排水不能只用纬度说明。 凉爽开阔的山地、阳光和排水良好基质，以高山亚种说明。 凉爽、开阔山地适合，耐寒与耐冬湿是不同能力。 需要有水可用但根区不能持续闷湿。 快速排走多余水很重要。",
    "misconception": "白色星形不是单朵花的所有花瓣；本页环境细节主要依据阿尔卑斯高山亚种。",
    "regionId": "alps",
    "region": {
      "id": "alps",
      "name": "瑞士阿尔卑斯山",
      "lon": 9.8,
      "lat": 46.6,
      "pointMeaning": "地区教学采样点，不是物种观测点、植物精确位置或全地区平均。"
    },
    "rootzone": "soil",
    "evidenceChecks": {
      "climate": "先比较十二个月的温度与降水率，区分生长季、冷季和干湿季。空气格点气温不是水温或叶面温度。",
      "soil": "砂砾或石质、通气良好的土适合代表亚种。 快速排走多余水很重要。 土壤栅格是区域背景，不是根旁取样；酸碱度不能单独证明排水或养分足够。",
      "water": "需要有水可用但根区不能持续闷湿。 冬季湿冷比单纯低温更值得区别。 降雨与可用水不同，需结合供水位置、季节和排水。"
    },
    "caseText": "以瑞士阿尔卑斯山作为地区案例。NASA POWER 2001–2025格点：最冷月1月，月均温-10.3°C；最暖月7月，月均温10.9°C。这是气候格点背景；低矮株形与毛被是山地形态线索，但坡向、积雪、石灰性基质和排水不能只用纬度说明。地图采样点不证明该处有这一物种。",
    "question": {
      "id": "bio-check-edelweiss",
      "title": "高山火绒草 · 想一想",
      "prompt": "阿尔卑斯山的高山火绒草，应该怎样读附近气候格点？",
      "options": [
        "白色部分一定是单朵花的全部花瓣。",
        "作为山地背景，再核对海拔、坡向、积雪与基质。",
        "把格点气温当成每一处山崖的实测温度。"
      ],
      "correctIndex": 1,
      "feedback": [
        "不能从名称、外观或一次记录跳到这个结论。山地同一格点可混合山谷和高坡；器官识别与微地形证据都不能省略。",
        "山地同一格点可混合山谷和高坡；器官识别与微地形证据都不能省略。",
        "这个判断忽略了器官、出现方式或水热条件中的关键差别。山地同一格点可混合山谷和高坡；器官识别与微地形证据都不能省略。"
      ],
      "explanation": "山地同一格点可混合山谷和高坡；器官识别与微地形证据都不能省略。",
      "nextHint": "回到器官图和地区证据，分别说出一条已知事实与一条还需要当地核对的信息。",
      "sources": [
        {
          "title": "Kew POWO · Leontopodium nivale",
          "url": "https://powo.science.kew.org/taxon/urn:lsid:ipni.org:names:229640-1",
          "supports": "接受名、菊科、欧洲山地及瑞士、奥地利原生范围；含高山亚种。"
        },
        {
          "title": "RHS · Leontopodium nivale subsp. alpinum",
          "url": "https://www.rhs.org.uk/plants/353775/leontopodium-nivale-subsp-alpinum/details/",
          "supports": "阿尔卑斯代表亚种的毛被苞片、头状花序、阳光和排水及冬湿限制。"
        },
        {
          "title": "密苏里植物园：Alpine edelweiss",
          "url": "https://www.missouribotanicalgarden.org/PlantFinder/PlantFinderDetails.aspx?cv=5&isprofile=0&lo=1&taxonid=277339",
          "supports": "白色苞片、中央小花序、凉爽及排水基质"
        },
        {
          "title": "NASA POWER：瑞士阿尔卑斯山气候格点，2001–2025",
          "url": "https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M%2CPRECTOTCORR&community=AG&longitude=9.8&latitude=46.6&format=JSON",
          "supports": "该采样格点十二个月的气温与平均日降水率；不是树旁、林内、水下或整地区实测。"
        }
      ]
    },
    "sources": [
      {
        "title": "Kew POWO · Leontopodium nivale",
        "url": "https://powo.science.kew.org/taxon/urn:lsid:ipni.org:names:229640-1",
        "supports": "接受名、菊科、欧洲山地及瑞士、奥地利原生范围；含高山亚种。"
      },
      {
        "title": "RHS · Leontopodium nivale subsp. alpinum",
        "url": "https://www.rhs.org.uk/plants/353775/leontopodium-nivale-subsp-alpinum/details/",
        "supports": "阿尔卑斯代表亚种的毛被苞片、头状花序、阳光和排水及冬湿限制。"
      },
      {
        "title": "密苏里植物园：Alpine edelweiss",
        "url": "https://www.missouribotanicalgarden.org/PlantFinder/PlantFinderDetails.aspx?cv=5&isprofile=0&lo=1&taxonid=277339",
        "supports": "白色苞片、中央小花序、凉爽及排水基质"
      },
      {
        "title": "NASA POWER：瑞士阿尔卑斯山气候格点，2001–2025",
        "url": "https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M%2CPRECTOTCORR&community=AG&longitude=9.8&latitude=46.6&format=JSON",
        "supports": "该采样格点十二个月的气温与平均日降水率；不是树旁、林内、水下或整地区实测。"
      }
    ],
    "steps": [
      {
        "title": "认识形态",
        "text": "白色星状部分主要是有毛苞片，中央才是花序；以阿尔卑斯代表亚种讲解环境。 白色星状外观主要来自有毛苞片，中央聚集小花序；本课环境解释以阿尔卑斯代表亚种为语境。",
        "action": {
          "kind": "morphology",
          "regionId": "alps"
        }
      },
      {
        "title": "环境机制",
        "text": "低矮株形和毛被构成山地生活的形态线索。 低矮株形与毛被是山地形态线索，但坡向、积雪、石灰性基质和排水不能只用纬度说明。 凉爽开阔的山地、阳光和排水良好基质，以高山亚种说明。 凉爽、开阔山地适合，耐寒与耐冬湿是不同能力。 需要有水可用但根区不能持续闷湿。 快速排走多余水很重要。 白色星形不是单朵花的所有花瓣；本页环境细节主要依据阿尔卑斯高山亚种。",
        "action": {
          "kind": "environment",
          "regionId": "alps"
        }
      },
      {
        "title": "地区证据",
        "text": "以瑞士阿尔卑斯山作为地区案例。NASA POWER 2001–2025格点：最冷月1月，月均温-10.3°C；最暖月7月，月均温10.9°C。这是气候格点背景；低矮株形与毛被是山地形态线索，但坡向、积雪、石灰性基质和排水不能只用纬度说明。地图采样点不证明该处有这一物种。",
        "action": {
          "kind": "region",
          "regionId": "alps"
        }
      }
    ],
    "regionRole": "regional-context",
    "substrateKind": "terrestrial",
    "substrateNote": "砂砾或石质、通气良好的土适合代表亚种。 快速排走多余水很重要。 土壤栅格是区域背景，不是根旁取样；酸碱度不能单独证明排水或养分足够。",
    "soilCaution": "砂砾或石质、通气良好的土适合代表亚种。 快速排走多余水很重要。 土壤栅格是区域背景，不是根旁取样；酸碱度不能单独证明排水或养分足够。"
  },
  {
    "id": "ginkgo",
    "cropId": "ginkgo",
    "name": "银杏",
    "latin": "Ginkgo biloba",
    "pathId": "seed-lineages",
    "group": "裸子植物",
    "definition": "银杏是落叶裸子乔木，扇形叶与肉质种皮便于辨认。长期栽培使一些古老群体的野生身份难以判定；应分开查看邱园的原生与引入资料，以及人工栽培的地区依据。",
    "organs": "扇形叶着生于长短枝，雌株的种子外有肉质种皮；银杏是裸子植物，没有真正果实。",
    "adaptations": "银杏是落叶乔木：暖季展叶生长，冷季落叶休眠，不能把冬季月均温直接当成全年生长温度。根既要有水，也要有空气；排水不良造成的缺氧，与短期干旱是不同限制。耐旱并不等于新栽幼树不需要供水。",
    "environment": "银杏是落叶乔木：暖季展叶生长，冷季落叶休眠，不能把冬季月均温直接当成全年生长温度。根既要有水，也要有空气；排水不良造成的缺氧，与短期干旱是不同限制。耐旱并不等于新栽幼树不需要供水。",
    "misconception": "白果是种子而非果实；古树或寺庙旁的树也不能仅凭树龄认定为野生。",
    "regionId": "zhejiang",
    "region": {
      "id": "zhejiang",
      "name": "中国浙江东部丘陵与湿地",
      "lon": 119.9,
      "lat": 30.2,
      "pointMeaning": "地区教学采样点，不是物种观测点、植物精确位置或全地区平均。"
    },
    "rootzone": "soil",
    "evidenceChecks": {
      "climate": "比较暖季展叶与冷季休眠；月均温不等于极端温度或耐寒阈值。",
      "soil": "可适应沙土、壤土和黏土，深厚土便于根系展开。 需要良好排水，低洼积水地不理想。 土壤栅格是区域背景，不是根旁取样；酸碱度不能单独证明排水或养分足够。",
      "water": "建株时保持有效供水，成熟树有一定耐旱能力。 耐城市环境不等于能在长期饱和土中正常生长。 降雨与可用水不同，需结合供水位置、季节和排水。"
    },
    "caseText": "浙江案例先比较季节：NASA POWER 2001–2025格点最冷月约5°C、最暖月约29°C，说明全年温度有明显变化，不能据此判断极端低温或单株存活。再区分自然环境与人类栽培：寺庙、村落和街道古树的出现还受种植历史影响，树龄不能证明野生身份。",
    "question": {
      "id": "bio-check-ginkgo",
      "title": "银杏 · 想一想",
      "prompt": "在浙江古村看到银杏，哪种记录最稳妥？",
      "options": [
        "树龄越大就越能确定它从未被人栽过。",
        "白果有肉质外层，因此一定是真正果实。",
        "先标明栽培或身份未定的语境，不把树龄当野生证明。"
      ],
      "correctIndex": 2,
      "feedback": [
        "这个判断忽略了器官、出现方式或水热条件中的关键差别。古树可以有栽培历史；肉质种皮不等于果皮，物种身份与出现方式要分开。",
        "不能从名称、外观或一次记录跳到这个结论。古树可以有栽培历史；肉质种皮不等于果皮，物种身份与出现方式要分开。",
        "古树可以有栽培历史；肉质种皮不等于果皮，物种身份与出现方式要分开。"
      ],
      "explanation": "古树可以有栽培历史；肉质种皮不等于果皮，物种身份与出现方式要分开。",
      "nextHint": "回到器官图和地区证据，分别说出一条已知事实与一条还需要当地核对的信息。",
      "sources": [
        {
          "title": "Kew POWO：银杏分类与历史分布",
          "url": "https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A262125-1/general-information",
          "supports": "接受学名、银杏科、落叶扇形叶、长期中国栽培与野生身份不确定性。"
        },
        {
          "title": "Kew：邱园银杏",
          "url": "https://www.kew.org/read-and-watch/ginkgo-biloba-maidenhair-tree-kew-gardens",
          "supports": "园内栽培树的历史、扇形叶与秋色。"
        },
        {
          "title": "北卡罗来纳州立大学推广：银杏",
          "url": "https://plants.ces.ncsu.edu/plants/ginkgo-biloba/",
          "supports": "光照、土质、排水、成熟耐旱性、雌株种子和城市园林适应。"
        },
        {
          "title": "NASA POWER：中国浙江东部丘陵与湿地气候格点，2001–2025",
          "url": "https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M%2CPRECTOTCORR&community=AG&longitude=119.9&latitude=30.2&format=JSON",
          "supports": "该采样格点十二个月的气温与平均日降水率；不是树旁、林内、水下或整地区实测。"
        }
      ]
    },
    "sources": [
      {
        "title": "Kew POWO：银杏分类与历史分布",
        "url": "https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A262125-1/general-information",
        "supports": "接受学名、银杏科、落叶扇形叶、长期中国栽培与野生身份不确定性。"
      },
      {
        "title": "Kew：邱园银杏",
        "url": "https://www.kew.org/read-and-watch/ginkgo-biloba-maidenhair-tree-kew-gardens",
        "supports": "园内栽培树的历史、扇形叶与秋色。"
      },
      {
        "title": "北卡罗来纳州立大学推广：银杏",
        "url": "https://plants.ces.ncsu.edu/plants/ginkgo-biloba/",
        "supports": "光照、土质、排水、成熟耐旱性、雌株种子和城市园林适应。"
      },
      {
        "title": "NASA POWER：中国浙江东部丘陵与湿地气候格点，2001–2025",
        "url": "https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M%2CPRECTOTCORR&community=AG&longitude=119.9&latitude=30.2&format=JSON",
        "supports": "该采样格点十二个月的气温与平均日降水率；不是树旁、林内、水下或整地区实测。"
      },
      {
        "title": "NC State Extension：银杏",
        "url": "https://plants.ces.ncsu.edu/plants/ginkgo-biloba/",
        "supports": "落叶习性、阳光、排水与耐旱性；耐受不能等同任意条件都适宜。"
      }
    ],
    "steps": [
      {
        "title": "认识形态",
        "text": "银杏是落叶裸子乔木，扇形叶与肉质种皮便于辨认。长期栽培使一些古老群体的野生身份难以判定；应分开查看邱园的原生与引入资料，以及人工栽培的地区依据。 扇形叶着生于长短枝，雌株的种子外有肉质种皮；银杏是裸子植物，没有真正果实。",
        "action": {
          "kind": "morphology",
          "regionId": "zhejiang"
        }
      },
      {
        "title": "环境机制",
        "text": "银杏是落叶乔木：暖季展叶生长，冷季落叶休眠，不能把冬季月均温直接当成全年生长温度。根既要有水，也要有空气；排水不良造成的缺氧，与短期干旱是不同限制。耐旱并不等于新栽幼树不需要供水。 白果是种子而非果实；古树或寺庙旁的树也不能仅凭树龄认定为野生。",
        "action": {
          "kind": "environment",
          "regionId": "zhejiang"
        }
      },
      {
        "title": "地区证据",
        "text": "浙江案例先比较季节：NASA POWER 2001–2025格点最冷月约5°C、最暖月约29°C，说明全年温度有明显变化，不能据此判断极端低温或单株存活。再区分自然环境与人类栽培：寺庙、村落和街道古树的出现还受种植历史影响，树龄不能证明野生身份。",
        "action": {
          "kind": "region",
          "regionId": "zhejiang"
        }
      }
    ],
    "regionRole": "cultivation-context",
    "substrateKind": "terrestrial",
    "substrateNote": "可适应沙土、壤土和黏土，深厚土便于根系展开。 需要良好排水，低洼积水地不理想。 土壤栅格是区域背景，不是根旁取样；酸碱度不能单独证明排水或养分足够。",
    "soilCaution": "可适应沙土、壤土和黏土，深厚土便于根系展开。 需要良好排水，低洼积水地不理想。 土壤栅格是区域背景，不是根旁取样；酸碱度不能单独证明排水或养分足够。"
  },
  {
    "id": "scotspine",
    "cropId": "scotspine",
    "name": "欧洲赤松",
    "latin": "Pinus sylvestris",
    "pathId": "cool-mountains",
    "group": "裸子植物",
    "definition": "欧洲赤松是常绿针叶乔木，通常两针一束，上部树皮橙红。它在欧洲与亚洲有广泛原生范围，也能在贫瘠土上成为先锋树种。",
    "organs": "通常两针一束，上部树皮常橙红，木质球果与树冠变化提供组合识别线索。",
    "adaptations": "成束针叶、木质球果和随年龄变化的树冠有助识别，不应只凭松树外形认种。",
    "environment": "它能在较贫瘠环境成为先锋，仍需要种子到达、光照和适宜根区；耐贫瘠并不表示贫瘠总能使它长得最好。 凉爽夏季、充分日照与能排水的土壤 凉爽夏季有利，冬季耐寒不等于耐炎热潮湿。 较干土也可生长，但幼树建株仍需有效供水。 排水良好的根区很重要。",
    "misconception": "芬兰森林有欧洲赤松，不表示所有森林都由这一种树组成；耐贫瘠也不等于贫瘠最有利。",
    "regionId": "finland-forest",
    "region": {
      "id": "finland-forest",
      "name": "芬兰南部森林",
      "lon": 25,
      "lat": 61,
      "pointMeaning": "地区教学采样点，不是物种观测点、植物精确位置或全地区平均。"
    },
    "rootzone": "soil",
    "evidenceChecks": {
      "climate": "先比较十二个月的温度与降水率，区分生长季、冷季和干湿季。空气格点气温不是水温或叶面温度。",
      "soil": "可利用贫瘠、沙质或多种其他土壤。 排水良好的根区很重要。 土壤栅格是区域背景，不是根旁取样；酸碱度不能单独证明排水或养分足够。",
      "water": "较干土也可生长，但幼树建株仍需有效供水。 耐旱不等于没有水分需求，也不代表耐积水。 降雨与可用水不同，需结合供水位置、季节和排水。"
    },
    "caseText": "以芬兰南部森林作为地区案例。NASA POWER 2001–2025格点：最冷月1月，月均温-7.8°C；最暖月7月，月均温17.5°C。这是气候格点背景；它能在较贫瘠环境成为先锋，仍需要种子到达、光照和适宜根区；耐贫瘠并不表示贫瘠总能使它长得最好。地图采样点不证明该处有这一物种。",
    "question": {
      "id": "bio-check-scotspine",
      "title": "欧洲赤松 · 想一想",
      "prompt": "芬兰有欧洲赤松，能把当地所有针叶林都认作这一种吗？",
      "options": [
        "不能；先看针束、树皮与球果，再比较群落和土壤。",
        "能；只要国家纬度高，针叶树就都相同。",
        "耐贫瘠表示土壤水分完全不会限制它。"
      ],
      "correctIndex": 0,
      "feedback": [
        "一个地区有多种树；耐受范围也不同于最有利条件，针叶外形不能替代具体鉴定。",
        "这个判断忽略了器官、出现方式或水热条件中的关键差别。一个地区有多种树；耐受范围也不同于最有利条件，针叶外形不能替代具体鉴定。",
        "不能从名称、外观或一次记录跳到这个结论。一个地区有多种树；耐受范围也不同于最有利条件，针叶外形不能替代具体鉴定。"
      ],
      "explanation": "一个地区有多种树；耐受范围也不同于最有利条件，针叶外形不能替代具体鉴定。",
      "nextHint": "回到器官图和地区证据，分别说出一条已知事实与一条还需要当地核对的信息。",
      "sources": [
        {
          "title": "Kew POWO：欧洲赤松分类",
          "url": "https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A263353-1",
          "supports": "接受学名、松科及原生地理范围。"
        },
        {
          "title": "苏格兰林业与土地管理机构：欧洲赤松",
          "url": "https://forestryandland.gov.scot/living-and-working/learning-and-education/trees/scots-pine",
          "supports": "苏格兰原生松林、两针成束、橙色树皮和贫瘠地先锋习性。"
        },
        {
          "title": "北卡罗来纳州立大学推广：欧洲赤松",
          "url": "https://plants.ces.ncsu.edu/plants/pinus-sylvestris/",
          "supports": "芬兰原生分布、凉爽夏季、日照、土壤与排水，热湿地区限制。"
        },
        {
          "title": "NASA POWER：芬兰南部森林气候格点，2001–2025",
          "url": "https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M%2CPRECTOTCORR&community=AG&longitude=25&latitude=61&format=JSON",
          "supports": "该采样格点十二个月的气温与平均日降水率；不是树旁、林内、水下或整地区实测。"
        }
      ]
    },
    "sources": [
      {
        "title": "Kew POWO：欧洲赤松分类",
        "url": "https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A263353-1",
        "supports": "接受学名、松科及原生地理范围。"
      },
      {
        "title": "苏格兰林业与土地管理机构：欧洲赤松",
        "url": "https://forestryandland.gov.scot/living-and-working/learning-and-education/trees/scots-pine",
        "supports": "苏格兰原生松林、两针成束、橙色树皮和贫瘠地先锋习性。"
      },
      {
        "title": "北卡罗来纳州立大学推广：欧洲赤松",
        "url": "https://plants.ces.ncsu.edu/plants/pinus-sylvestris/",
        "supports": "芬兰原生分布、凉爽夏季、日照、土壤与排水，热湿地区限制。"
      },
      {
        "title": "NASA POWER：芬兰南部森林气候格点，2001–2025",
        "url": "https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M%2CPRECTOTCORR&community=AG&longitude=25&latitude=61&format=JSON",
        "supports": "该采样格点十二个月的气温与平均日降水率；不是树旁、林内、水下或整地区实测。"
      }
    ],
    "steps": [
      {
        "title": "认识形态",
        "text": "欧洲赤松是常绿针叶乔木，通常两针一束，上部树皮橙红。它在欧洲与亚洲有广泛原生范围，也能在贫瘠土上成为先锋树种。 通常两针一束，上部树皮常橙红，木质球果与树冠变化提供组合识别线索。",
        "action": {
          "kind": "morphology",
          "regionId": "finland-forest"
        }
      },
      {
        "title": "环境机制",
        "text": "成束针叶、木质球果和随年龄变化的树冠有助识别，不应只凭松树外形认种。 它能在较贫瘠环境成为先锋，仍需要种子到达、光照和适宜根区；耐贫瘠并不表示贫瘠总能使它长得最好。 凉爽夏季、充分日照与能排水的土壤 凉爽夏季有利，冬季耐寒不等于耐炎热潮湿。 较干土也可生长，但幼树建株仍需有效供水。 排水良好的根区很重要。 芬兰森林有欧洲赤松，不表示所有森林都由这一种树组成；耐贫瘠也不等于贫瘠最有利。",
        "action": {
          "kind": "environment",
          "regionId": "finland-forest"
        }
      },
      {
        "title": "地区证据",
        "text": "以芬兰南部森林作为地区案例。NASA POWER 2001–2025格点：最冷月1月，月均温-7.8°C；最暖月7月，月均温17.5°C。这是气候格点背景；它能在较贫瘠环境成为先锋，仍需要种子到达、光照和适宜根区；耐贫瘠并不表示贫瘠总能使它长得最好。地图采样点不证明该处有这一物种。",
        "action": {
          "kind": "region",
          "regionId": "finland-forest"
        }
      }
    ],
    "regionRole": "regional-context",
    "substrateKind": "terrestrial",
    "substrateNote": "可利用贫瘠、沙质或多种其他土壤。 排水良好的根区很重要。 土壤栅格是区域背景，不是根旁取样；酸碱度不能单独证明排水或养分足够。",
    "soilCaution": "可利用贫瘠、沙质或多种其他土壤。 排水良好的根区很重要。 土壤栅格是区域背景，不是根旁取样；酸碱度不能单独证明排水或养分足够。"
  },
  {
    "id": "norwayspruce",
    "cropId": "norwayspruce",
    "name": "欧洲云杉",
    "latin": "Picea abies",
    "pathId": "cool-mountains",
    "group": "裸子植物",
    "definition": "欧洲云杉为常绿乔木，针叶单枚着生，成熟球果下垂。它与欧洲赤松同属松科，但更需要注意凉爽夏季与浅层根区的水分条件。",
    "organs": "针叶单枚着生，成熟球果下垂，树冠常呈塔形；它与两针一束的欧洲赤松不同。",
    "adaptations": "单生针叶、塔形树冠与下垂球果提供识别线索，浅根使表层土状态很重要。",
    "environment": "较浅的根区使表层水分和通气重要；凉爽背景下也会遇到夏季干旱，不能用耐寒替代耐热耐旱判断。 凉爽生长季、适度湿润与通气根区 冷凉生长季较适宜，温暖低地不一定合适。 需要适度而稳定的有效水分。 需要良好排水，不宜让根长期泡水。",
    "misconception": "云杉不是所有针叶树的通称；同属松科也不代表与赤松具有相同耐旱与耐热能力。",
    "regionId": "finland-forest",
    "region": {
      "id": "finland-forest",
      "name": "芬兰南部森林",
      "lon": 25,
      "lat": 61,
      "pointMeaning": "地区教学采样点，不是物种观测点、植物精确位置或全地区平均。"
    },
    "rootzone": "soil",
    "evidenceChecks": {
      "climate": "先比较十二个月的温度与降水率，区分生长季、冷季和干湿季。空气格点气温不是水温或叶面温度。",
      "soil": "较喜有机质适宜的沙质土或壤土。 需要良好排水，不宜让根长期泡水。 土壤栅格是区域背景，不是根旁取样；酸碱度不能单独证明排水或养分足够。",
      "water": "需要适度而稳定的有效水分。 湿润土与长期缺氧的积水地不同。 降雨与可用水不同，需结合供水位置、季节和排水。"
    },
    "caseText": "以芬兰南部森林作为地区案例。NASA POWER 2001–2025格点：最冷月1月，月均温-7.8°C；最暖月7月，月均温17.5°C。这是气候格点背景；较浅的根区使表层水分和通气重要；凉爽背景下也会遇到夏季干旱，不能用耐寒替代耐热耐旱判断。地图采样点不证明该处有这一物种。",
    "question": {
      "id": "bio-check-norwayspruce",
      "title": "欧洲云杉 · 想一想",
      "prompt": "欧洲云杉和欧洲赤松同属松科，能使用同一条耐旱规则吗？",
      "options": [
        "云杉常绿，所以不受季节影响。",
        "不能；要分别看根系、表层水分和夏季热旱。",
        "能；同科意味着根系和水分限制完全相同。"
      ],
      "correctIndex": 1,
      "feedback": [
        "不能从名称、外观或一次记录跳到这个结论。亲缘分类和生态限制是两种信息；云杉的根区位置与热旱风险仍需单独解释。",
        "亲缘分类和生态限制是两种信息；云杉的根区位置与热旱风险仍需单独解释。",
        "这个判断忽略了器官、出现方式或水热条件中的关键差别。亲缘分类和生态限制是两种信息；云杉的根区位置与热旱风险仍需单独解释。"
      ],
      "explanation": "亲缘分类和生态限制是两种信息；云杉的根区位置与热旱风险仍需单独解释。",
      "nextHint": "回到器官图和地区证据，分别说出一条已知事实与一条还需要当地核对的信息。",
      "sources": [
        {
          "title": "Kew POWO：欧洲云杉分类",
          "url": "https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A262609-1",
          "supports": "接受学名、松科与原生范围。"
        },
        {
          "title": "北卡罗来纳州立大学推广：欧洲云杉",
          "url": "https://plants.ces.ncsu.edu/plants/picea-abies/",
          "supports": "挪威和奥地利原生范围、针叶与球果、浅根、冷凉夏季及土壤水分限制。"
        },
        {
          "title": "NASA POWER：芬兰南部森林气候格点，2001–2025",
          "url": "https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M%2CPRECTOTCORR&community=AG&longitude=25&latitude=61&format=JSON",
          "supports": "该采样格点十二个月的气温与平均日降水率；不是树旁、林内、水下或整地区实测。"
        }
      ]
    },
    "sources": [
      {
        "title": "Kew POWO：欧洲云杉分类",
        "url": "https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A262609-1",
        "supports": "接受学名、松科与原生范围。"
      },
      {
        "title": "北卡罗来纳州立大学推广：欧洲云杉",
        "url": "https://plants.ces.ncsu.edu/plants/picea-abies/",
        "supports": "挪威和奥地利原生范围、针叶与球果、浅根、冷凉夏季及土壤水分限制。"
      },
      {
        "title": "NASA POWER：芬兰南部森林气候格点，2001–2025",
        "url": "https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M%2CPRECTOTCORR&community=AG&longitude=25&latitude=61&format=JSON",
        "supports": "该采样格点十二个月的气温与平均日降水率；不是树旁、林内、水下或整地区实测。"
      }
    ],
    "steps": [
      {
        "title": "认识形态",
        "text": "欧洲云杉为常绿乔木，针叶单枚着生，成熟球果下垂。它与欧洲赤松同属松科，但更需要注意凉爽夏季与浅层根区的水分条件。 针叶单枚着生，成熟球果下垂，树冠常呈塔形；它与两针一束的欧洲赤松不同。",
        "action": {
          "kind": "morphology",
          "regionId": "finland-forest"
        }
      },
      {
        "title": "环境机制",
        "text": "单生针叶、塔形树冠与下垂球果提供识别线索，浅根使表层土状态很重要。 较浅的根区使表层水分和通气重要；凉爽背景下也会遇到夏季干旱，不能用耐寒替代耐热耐旱判断。 凉爽生长季、适度湿润与通气根区 冷凉生长季较适宜，温暖低地不一定合适。 需要适度而稳定的有效水分。 需要良好排水，不宜让根长期泡水。 云杉不是所有针叶树的通称；同属松科也不代表与赤松具有相同耐旱与耐热能力。",
        "action": {
          "kind": "environment",
          "regionId": "finland-forest"
        }
      },
      {
        "title": "地区证据",
        "text": "以芬兰南部森林作为地区案例。NASA POWER 2001–2025格点：最冷月1月，月均温-7.8°C；最暖月7月，月均温17.5°C。这是气候格点背景；较浅的根区使表层水分和通气重要；凉爽背景下也会遇到夏季干旱，不能用耐寒替代耐热耐旱判断。地图采样点不证明该处有这一物种。",
        "action": {
          "kind": "region",
          "regionId": "finland-forest"
        }
      }
    ],
    "regionRole": "regional-context",
    "substrateKind": "terrestrial",
    "substrateNote": "较喜有机质适宜的沙质土或壤土。 需要良好排水，不宜让根长期泡水。 土壤栅格是区域背景，不是根旁取样；酸碱度不能单独证明排水或养分足够。",
    "soilCaution": "较喜有机质适宜的沙质土或壤土。 需要良好排水，不宜让根长期泡水。 土壤栅格是区域背景，不是根旁取样；酸碱度不能单独证明排水或养分足够。"
  },
  {
    "id": "coastredwood",
    "cropId": "coastredwood",
    "name": "北美红杉",
    "latin": "Sequoia sempervirens",
    "pathId": "seed-lineages",
    "group": "裸子植物",
    "definition": "北美红杉又称海岸红杉，是现代柏科的高大常绿乔木。天然分布沿北美太平洋狭长海岸延伸，树体巨大却形成较小球果。",
    "organs": "海岸红杉有扁平叶和小型球果，常绿而高大；它既不是巨杉，也不是冬季落叶的水杉。",
    "adaptations": "扁平叶与小型球果帮助识别，树冠和森林微气候共同参与水分循环。",
    "environment": "沿海温和湿润背景、雾和土壤供水共同参与森林水分条件；降雨曲线不能单独测出雾滴、根区储水或树冠湿度。 海岸凉湿环境、冬雨夏雾与深厚湿润土壤 海洋调节的温和凉湿条件很重要。 冬季降雨、夏季雾与土壤储水共同影响水分平衡。 应区分河谷湿润环境与根区长期缺氧。",
    "misconception": "海岸红杉不是巨杉，也不是落叶的水杉；模型统一高度不能用来比较真实树高。",
    "regionId": "california-coast",
    "region": {
      "id": "california-coast",
      "name": "美国加州北部海岸",
      "lon": -124,
      "lat": 41.3,
      "pointMeaning": "地区教学采样点，不是物种观测点、植物精确位置或全地区平均。"
    },
    "rootzone": "soil",
    "evidenceChecks": {
      "climate": "先比较十二个月的温度与降水率，区分生长季、冷季和干湿季。空气格点气温不是水温或叶面温度。",
      "soil": "深厚、湿润而可通气的土壤有利生长。 应区分河谷湿润环境与根区长期缺氧。 土壤栅格是区域背景，不是根旁取样；酸碱度不能单独证明排水或养分足够。",
      "water": "冬季降雨、夏季雾与土壤储水共同影响水分平衡。 近海不意味着可以忍受海水或强盐雾。 降雨与可用水不同，需结合供水位置、季节和排水。"
    },
    "caseText": "以美国加州北部海岸作为地区案例。NASA POWER 2001–2025格点：最冷月12月，月均温4.6°C；最暖月7月，月均温19.9°C。这是气候格点背景；沿海温和湿润背景、雾和土壤供水共同参与森林水分条件；降雨曲线不能单独测出雾滴、根区储水或树冠湿度。地图采样点不证明该处有这一物种。",
    "question": {
      "id": "bio-check-coastredwood",
      "title": "北美红杉 · 想一想",
      "prompt": "加州北部海岸的红杉，哪种解释避免遗漏水分来源？",
      "options": [
        "只看年雨量，就声称已经量到了树冠全部用水。",
        "海岸有雾就说明红杉完全不需要根吸水。",
        "把降雨、海雾与土壤储水区分，并说明各自证据。"
      ],
      "correctIndex": 2,
      "feedback": [
        "这个判断忽略了器官、出现方式或水热条件中的关键差别。森林水分循环包含多个过程；空气湿润、雾滴和降雨也不是同一项观测。",
        "不能从名称、外观或一次记录跳到这个结论。森林水分循环包含多个过程；空气湿润、雾滴和降雨也不是同一项观测。",
        "森林水分循环包含多个过程；空气湿润、雾滴和降雨也不是同一项观测。"
      ],
      "explanation": "森林水分循环包含多个过程；空气湿润、雾滴和降雨也不是同一项观测。",
      "nextHint": "回到器官图和地区证据，分别说出一条已知事实与一条还需要当地核对的信息。",
      "sources": [
        {
          "title": "俄勒冈州立大学：北美红杉",
          "url": "https://landscapeplants.oregonstate.edu/plants/sequoia-sempervirens",
          "supports": "接受学名与现代柏科分类、常绿叶与小球果、土壤及沿海原生范围。"
        },
        {
          "title": "美国国家公园管理局：海岸红杉林生态",
          "url": "https://home.nps.gov/pore/learn/nature/wildlandfire_fireecology_vegtypes_redwoods.htm",
          "supports": "北加州至蒙特雷原生分布、海雾作用及对盐雾敏感。"
        },
        {
          "title": "美国林务局：北美红杉造林生态",
          "url": "https://www.srs.fs.usda.gov/pubs/misc/ag_654/volume_1/sequoia/sempervirens.htm",
          "supports": "天然海岸带、季节降水和雾、土壤水分；历史杉科分类未沿用。"
        },
        {
          "title": "NASA POWER：美国加州北部海岸气候格点，2001–2025",
          "url": "https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M%2CPRECTOTCORR&community=AG&longitude=-124&latitude=41.3&format=JSON",
          "supports": "该采样格点十二个月的气温与平均日降水率；不是树旁、林内、水下或整地区实测。"
        }
      ]
    },
    "sources": [
      {
        "title": "俄勒冈州立大学：北美红杉",
        "url": "https://landscapeplants.oregonstate.edu/plants/sequoia-sempervirens",
        "supports": "接受学名与现代柏科分类、常绿叶与小球果、土壤及沿海原生范围。"
      },
      {
        "title": "美国国家公园管理局：海岸红杉林生态",
        "url": "https://home.nps.gov/pore/learn/nature/wildlandfire_fireecology_vegtypes_redwoods.htm",
        "supports": "北加州至蒙特雷原生分布、海雾作用及对盐雾敏感。"
      },
      {
        "title": "美国林务局：北美红杉造林生态",
        "url": "https://www.srs.fs.usda.gov/pubs/misc/ag_654/volume_1/sequoia/sempervirens.htm",
        "supports": "天然海岸带、季节降水和雾、土壤水分；历史杉科分类未沿用。"
      },
      {
        "title": "NASA POWER：美国加州北部海岸气候格点，2001–2025",
        "url": "https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M%2CPRECTOTCORR&community=AG&longitude=-124&latitude=41.3&format=JSON",
        "supports": "该采样格点十二个月的气温与平均日降水率；不是树旁、林内、水下或整地区实测。"
      }
    ],
    "steps": [
      {
        "title": "认识形态",
        "text": "北美红杉又称海岸红杉，是现代柏科的高大常绿乔木。天然分布沿北美太平洋狭长海岸延伸，树体巨大却形成较小球果。 海岸红杉有扁平叶和小型球果，常绿而高大；它既不是巨杉，也不是冬季落叶的水杉。",
        "action": {
          "kind": "morphology",
          "regionId": "california-coast"
        }
      },
      {
        "title": "环境机制",
        "text": "扁平叶与小型球果帮助识别，树冠和森林微气候共同参与水分循环。 沿海温和湿润背景、雾和土壤供水共同参与森林水分条件；降雨曲线不能单独测出雾滴、根区储水或树冠湿度。 海岸凉湿环境、冬雨夏雾与深厚湿润土壤 海洋调节的温和凉湿条件很重要。 冬季降雨、夏季雾与土壤储水共同影响水分平衡。 应区分河谷湿润环境与根区长期缺氧。 海岸红杉不是巨杉，也不是落叶的水杉；模型统一高度不能用来比较真实树高。",
        "action": {
          "kind": "environment",
          "regionId": "california-coast"
        }
      },
      {
        "title": "地区证据",
        "text": "以美国加州北部海岸作为地区案例。NASA POWER 2001–2025格点：最冷月12月，月均温4.6°C；最暖月7月，月均温19.9°C。这是气候格点背景；沿海温和湿润背景、雾和土壤供水共同参与森林水分条件；降雨曲线不能单独测出雾滴、根区储水或树冠湿度。地图采样点不证明该处有这一物种。",
        "action": {
          "kind": "region",
          "regionId": "california-coast"
        }
      }
    ],
    "regionRole": "regional-context",
    "substrateKind": "terrestrial",
    "substrateNote": "深厚、湿润而可通气的土壤有利生长。 应区分河谷湿润环境与根区长期缺氧。 土壤栅格是区域背景，不是根旁取样；酸碱度不能单独证明排水或养分足够。",
    "soilCaution": "深厚、湿润而可通气的土壤有利生长。 应区分河谷湿润环境与根区长期缺氧。 土壤栅格是区域背景，不是根旁取样；酸碱度不能单独证明排水或养分足够。"
  },
  {
    "id": "dawnredwood",
    "cropId": "dawnredwood",
    "name": "水杉",
    "latin": "Metasequoia glyptostroboides",
    "pathId": "seed-lineages",
    "group": "裸子植物",
    "definition": "水杉是落叶裸子乔木，对生扁平叶和会脱落的小枝很有识别度。中国狭窄的原生河谷与全球广泛园林栽培，应分开呈现。",
    "organs": "扁平叶与小枝对生，秋冬可一同脱落；球果显示它是裸子植物，不是开花阔叶树。",
    "adaptations": "对生叶和小枝便于区别其他红杉，湿润河谷提供种子萌发与幼苗建立条件。",
    "environment": "湿润河谷有利于理解其根区供水与更新，但河谷地形、土地利用及原生生境保存不能由公园栽培代替。 季节分明、河谷湿润土壤与幼苗更新生境 适应季节分明环境，暖湿生长季有利表现。 天然生境包括湿润河谷、溪岸与渗水坡地。 栽培宜保水又通气，结合场地水文判断。",
    "misconception": "公园里常见水杉，不表示中国原生生境已恢复；水杉也不是全年常绿的海岸红杉。",
    "regionId": "hubei-valley",
    "region": {
      "id": "hubei-valley",
      "name": "中国湖北利川河谷",
      "lon": 108.9,
      "lat": 30.3,
      "pointMeaning": "地区教学采样点，不是物种观测点、植物精确位置或全地区平均。"
    },
    "rootzone": "soil",
    "evidenceChecks": {
      "climate": "先比较十二个月的温度与降水率，区分生长季、冷季和干湿季。空气格点气温不是水温或叶面温度。",
      "soil": "原生地可见砂岩形成的沙质或黏质土。 栽培宜保水又通气，结合场地水文判断。 土壤栅格是区域背景，不是根旁取样；酸碱度不能单独证明排水或养分足够。",
      "water": "天然生境包括湿润河谷、溪岸与渗水坡地。 不能把天然水位波动简化成全年深水淹没。 降雨与可用水不同，需结合供水位置、季节和排水。"
    },
    "caseText": "以中国湖北利川河谷作为地区案例。NASA POWER 2001–2025格点：最冷月1月，月均温2.2°C；最暖月7月，月均温24.0°C。这是气候格点背景；湿润河谷有利于理解其根区供水与更新，但河谷地形、土地利用及原生生境保存不能由公园栽培代替。地图采样点不证明该处有这一物种。",
    "question": {
      "id": "bio-check-dawnredwood",
      "title": "水杉 · 想一想",
      "prompt": "水杉在世界很多公园常见，能据此判断湖北原生河谷已恢复吗？",
      "options": [
        "不能；原生生境和人工栽培要分别调查。",
        "可以；公园数量直接等于原生种群数量。",
        "名字带水就说明永久深水完全不影响根区。"
      ],
      "correctIndex": 0,
      "feedback": [
        "全球园林推广反映人工栽培，不能证明野外更新、河谷水文或生境保护状况。",
        "这个判断忽略了器官、出现方式或水热条件中的关键差别。全球园林推广反映人工栽培，不能证明野外更新、河谷水文或生境保护状况。",
        "不能从名称、外观或一次记录跳到这个结论。全球园林推广反映人工栽培，不能证明野外更新、河谷水文或生境保护状况。"
      ],
      "explanation": "全球园林推广反映人工栽培，不能证明野外更新、河谷水文或生境保护状况。",
      "nextHint": "回到器官图和地区证据，分别说出一条已知事实与一条还需要当地核对的信息。",
      "sources": [
        {
          "title": "爱丁堡皇家植物园：水杉",
          "url": "https://threatenedconifers.rbge.org.uk/conifers/metasequoia-glyptostroboides",
          "supports": "现代柏科、湖北利川原生范围与河谷水文、自然更新限制、雷丁校园栽培图片说明。"
        },
        {
          "title": "俄勒冈州立大学：水杉",
          "url": "https://landscapeplants.oregonstate.edu/plants/metasequoia-glyptostroboides",
          "supports": "对生扁平叶、落叶小枝、球果与湿润园林土壤条件。"
        },
        {
          "title": "NASA POWER：中国湖北利川河谷气候格点，2001–2025",
          "url": "https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M%2CPRECTOTCORR&community=AG&longitude=108.9&latitude=30.3&format=JSON",
          "supports": "该采样格点十二个月的气温与平均日降水率；不是树旁、林内、水下或整地区实测。"
        }
      ]
    },
    "sources": [
      {
        "title": "爱丁堡皇家植物园：水杉",
        "url": "https://threatenedconifers.rbge.org.uk/conifers/metasequoia-glyptostroboides",
        "supports": "现代柏科、湖北利川原生范围与河谷水文、自然更新限制、雷丁校园栽培图片说明。"
      },
      {
        "title": "俄勒冈州立大学：水杉",
        "url": "https://landscapeplants.oregonstate.edu/plants/metasequoia-glyptostroboides",
        "supports": "对生扁平叶、落叶小枝、球果与湿润园林土壤条件。"
      },
      {
        "title": "NASA POWER：中国湖北利川河谷气候格点，2001–2025",
        "url": "https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M%2CPRECTOTCORR&community=AG&longitude=108.9&latitude=30.3&format=JSON",
        "supports": "该采样格点十二个月的气温与平均日降水率；不是树旁、林内、水下或整地区实测。"
      }
    ],
    "steps": [
      {
        "title": "认识形态",
        "text": "水杉是落叶裸子乔木，对生扁平叶和会脱落的小枝很有识别度。中国狭窄的原生河谷与全球广泛园林栽培，应分开呈现。 扁平叶与小枝对生，秋冬可一同脱落；球果显示它是裸子植物，不是开花阔叶树。",
        "action": {
          "kind": "morphology",
          "regionId": "hubei-valley"
        }
      },
      {
        "title": "环境机制",
        "text": "对生叶和小枝便于区别其他红杉，湿润河谷提供种子萌发与幼苗建立条件。 湿润河谷有利于理解其根区供水与更新，但河谷地形、土地利用及原生生境保存不能由公园栽培代替。 季节分明、河谷湿润土壤与幼苗更新生境 适应季节分明环境，暖湿生长季有利表现。 天然生境包括湿润河谷、溪岸与渗水坡地。 栽培宜保水又通气，结合场地水文判断。 公园里常见水杉，不表示中国原生生境已恢复；水杉也不是全年常绿的海岸红杉。",
        "action": {
          "kind": "environment",
          "regionId": "hubei-valley"
        }
      },
      {
        "title": "地区证据",
        "text": "以中国湖北利川河谷作为地区案例。NASA POWER 2001–2025格点：最冷月1月，月均温2.2°C；最暖月7月，月均温24.0°C。这是气候格点背景；湿润河谷有利于理解其根区供水与更新，但河谷地形、土地利用及原生生境保存不能由公园栽培代替。地图采样点不证明该处有这一物种。",
        "action": {
          "kind": "region",
          "regionId": "hubei-valley"
        }
      }
    ],
    "regionRole": "regional-context",
    "substrateKind": "terrestrial",
    "substrateNote": "原生地可见砂岩形成的沙质或黏质土。 栽培宜保水又通气，结合场地水文判断。 土壤栅格是区域背景，不是根旁取样；酸碱度不能单独证明排水或养分足够。",
    "soilCaution": "原生地可见砂岩形成的沙质或黏质土。 栽培宜保水又通气，结合场地水文判断。 土壤栅格是区域背景，不是根旁取样；酸碱度不能单独证明排水或养分足够。"
  },
  {
    "id": "cedar",
    "cropId": "cedar",
    "name": "黎巴嫩雪松",
    "latin": "Cedrus libani",
    "pathId": "cool-mountains",
    "group": "裸子植物",
    "definition": "黎巴嫩雪松是松科常绿乔木，成熟树有展开的水平枝，短枝上针叶成簇，种子球果直立。这里专指Cedrus libani，不包含所有俗称雪松的树。",
    "organs": "针叶在短枝上成簇，成熟枝条可水平展开，种子球果直立；本条专指黎巴嫩雪松。",
    "adaptations": "水平枝、短枝簇生针叶与直立球果构成识别组合，树形会随年龄变化。",
    "environment": "地中海山地的冷湿季与暖干季不同；海拔、坡向、土层和积雪都会影响根区供水与幼树建立。 凉湿冬季、日照与排水良好的山坡土壤 原生山地冬季凉湿，高处有积雪。 冬季降水与生长季土壤储水共同影响供水。 需要良好排水，忌长期根区饱和。",
    "misconception": "名字带雪松不等于所有雪松类都适合相同气候；地中海地区也有冷湿山地。",
    "regionId": "lebanon-mountains",
    "region": {
      "id": "lebanon-mountains",
      "name": "黎巴嫩山地",
      "lon": 36,
      "lat": 34.2,
      "pointMeaning": "地区教学采样点，不是物种观测点、植物精确位置或全地区平均。"
    },
    "rootzone": "soil",
    "evidenceChecks": {
      "climate": "先比较十二个月的温度与降水率，区分生长季、冷季和干湿季。空气格点气温不是水温或叶面温度。",
      "soil": "可见于石灰质山地，也有砂岩形成的土壤。 需要良好排水，忌长期根区饱和。 土壤栅格是区域背景，不是根旁取样；酸碱度不能单独证明排水或养分足够。",
      "water": "冬季降水与生长季土壤储水共同影响供水。 夏季较干并不表示根系可长期缺水。 降雨与可用水不同，需结合供水位置、季节和排水。"
    },
    "caseText": "以黎巴嫩山地作为地区案例。NASA POWER 2001–2025格点：最冷月1月，月均温2.8°C；最暖月8月，月均温23.6°C。这是气候格点背景；地中海山地的冷湿季与暖干季不同；海拔、坡向、土层和积雪都会影响根区供水与幼树建立。地图采样点不证明该处有这一物种。",
    "question": {
      "id": "bio-check-cedar",
      "title": "黎巴嫩雪松 · 想一想",
      "prompt": "黎巴嫩雪松案例为什么不能只用“地中海很热”解释？",
      "options": [
        "地中海的所有山坡与海岸都拥有相同温度。",
        "要比较山地高度、季节和根区水分，而非沿海印象。",
        "因为名字带雪，所以完全不需要水分。"
      ],
      "correctIndex": 1,
      "feedback": [
        "不能从名称、外观或一次记录跳到这个结论。区域名称掩盖垂直与季节差异；耐寒和耐旱也不能由俗名推出。",
        "区域名称掩盖垂直与季节差异；耐寒和耐旱也不能由俗名推出。",
        "这个判断忽略了器官、出现方式或水热条件中的关键差别。区域名称掩盖垂直与季节差异；耐寒和耐旱也不能由俗名推出。"
      ],
      "explanation": "区域名称掩盖垂直与季节差异；耐寒和耐旱也不能由俗名推出。",
      "nextHint": "回到器官图和地区证据，分别说出一条已知事实与一条还需要当地核对的信息。",
      "sources": [
        {
          "title": "爱丁堡皇家植物园：黎巴嫩雪松",
          "url": "https://threatenedconifers.rbge.org.uk/conifers/cedrus-libani",
          "supports": "接受学名和松科、黎巴嫩与托罗斯原生分布、山地冬季气候、土壤与森林压力。"
        },
        {
          "title": "北卡罗来纳州立大学推广：黎巴嫩雪松",
          "url": "https://plants.ces.ncsu.edu/plants/cedrus-libani/",
          "supports": "水平枝、针叶簇和直立球果、日照、排水、土壤适应及成熟耐旱性。"
        },
        {
          "title": "NASA POWER：黎巴嫩山地气候格点，2001–2025",
          "url": "https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M%2CPRECTOTCORR&community=AG&longitude=36&latitude=34.2&format=JSON",
          "supports": "该采样格点十二个月的气温与平均日降水率；不是树旁、林内、水下或整地区实测。"
        }
      ]
    },
    "sources": [
      {
        "title": "爱丁堡皇家植物园：黎巴嫩雪松",
        "url": "https://threatenedconifers.rbge.org.uk/conifers/cedrus-libani",
        "supports": "接受学名和松科、黎巴嫩与托罗斯原生分布、山地冬季气候、土壤与森林压力。"
      },
      {
        "title": "北卡罗来纳州立大学推广：黎巴嫩雪松",
        "url": "https://plants.ces.ncsu.edu/plants/cedrus-libani/",
        "supports": "水平枝、针叶簇和直立球果、日照、排水、土壤适应及成熟耐旱性。"
      },
      {
        "title": "NASA POWER：黎巴嫩山地气候格点，2001–2025",
        "url": "https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M%2CPRECTOTCORR&community=AG&longitude=36&latitude=34.2&format=JSON",
        "supports": "该采样格点十二个月的气温与平均日降水率；不是树旁、林内、水下或整地区实测。"
      }
    ],
    "steps": [
      {
        "title": "认识形态",
        "text": "黎巴嫩雪松是松科常绿乔木，成熟树有展开的水平枝，短枝上针叶成簇，种子球果直立。这里专指Cedrus libani，不包含所有俗称雪松的树。 针叶在短枝上成簇，成熟枝条可水平展开，种子球果直立；本条专指黎巴嫩雪松。",
        "action": {
          "kind": "morphology",
          "regionId": "lebanon-mountains"
        }
      },
      {
        "title": "环境机制",
        "text": "水平枝、短枝簇生针叶与直立球果构成识别组合，树形会随年龄变化。 地中海山地的冷湿季与暖干季不同；海拔、坡向、土层和积雪都会影响根区供水与幼树建立。 凉湿冬季、日照与排水良好的山坡土壤 原生山地冬季凉湿，高处有积雪。 冬季降水与生长季土壤储水共同影响供水。 需要良好排水，忌长期根区饱和。 名字带雪松不等于所有雪松类都适合相同气候；地中海地区也有冷湿山地。",
        "action": {
          "kind": "environment",
          "regionId": "lebanon-mountains"
        }
      },
      {
        "title": "地区证据",
        "text": "以黎巴嫩山地作为地区案例。NASA POWER 2001–2025格点：最冷月1月，月均温2.8°C；最暖月8月，月均温23.6°C。这是气候格点背景；地中海山地的冷湿季与暖干季不同；海拔、坡向、土层和积雪都会影响根区供水与幼树建立。地图采样点不证明该处有这一物种。",
        "action": {
          "kind": "region",
          "regionId": "lebanon-mountains"
        }
      }
    ],
    "regionRole": "regional-context",
    "substrateKind": "terrestrial",
    "substrateNote": "可见于石灰质山地，也有砂岩形成的土壤。 需要良好排水，忌长期根区饱和。 土壤栅格是区域背景，不是根旁取样；酸碱度不能单独证明排水或养分足够。",
    "soilCaution": "可见于石灰质山地，也有砂岩形成的土壤。 需要良好排水，忌长期根区饱和。 土壤栅格是区域背景，不是根旁取样；酸碱度不能单独证明排水或养分足够。"
  },
  {
    "id": "cycad",
    "cropId": "cycad",
    "name": "苏铁",
    "latin": "Cycas revoluta",
    "pathId": "seed-lineages",
    "group": "裸子植物",
    "definition": "苏铁是生长缓慢的裸子木本，粗短茎顶部有坚硬的羽状复叶。它外形像棕榈，却不属于棕榈科，也不形成普通被子植物的花果。",
    "organs": "坚硬羽状复叶长在粗短茎顶端，苏铁是裸子植物；外形像棕榈却不属于棕榈科。",
    "adaptations": "硬质羽状叶和短茎形成显著外形，雌雄生殖结构不同。",
    "environment": "温暖与根区排水有助理解苏铁生活，霜冻、积水和幼苗阶段仍重要；不能把一种苏铁代表全部苏铁类。 温暖环境、明亮光照与排水通气的根区 温暖环境适宜，霜冻可能伤叶。 根系建立后可耐一定干期，幼株仍需适宜水分。 排水是重要前提，湿滞可导致根部问题。",
    "misconception": "苏铁不是棕榈；种子等部位有毒，不因中文名称或裸子植物身份就可食用。",
    "regionId": "ryukyu",
    "region": {
      "id": "ryukyu",
      "name": "日本琉球群岛",
      "lon": 128,
      "lat": 26.6,
      "pointMeaning": "地区教学采样点，不是物种观测点、植物精确位置或全地区平均。"
    },
    "rootzone": "soil",
    "evidenceChecks": {
      "climate": "先比较十二个月的温度与降水率，区分生长季、冷季和干湿季。空气格点气温不是水温或叶面温度。",
      "soil": "沙壤土或其他疏松通气基质有利。 排水是重要前提，湿滞可导致根部问题。 土壤栅格是区域背景，不是根旁取样；酸碱度不能单独证明排水或养分足够。",
      "water": "根系建立后可耐一定干期，幼株仍需适宜水分。 耐旱不表示应长期干透，更不表示耐根区积水。 降雨与可用水不同，需结合供水位置、季节和排水。"
    },
    "caseText": "以日本琉球群岛作为地区案例。NASA POWER 2001–2025格点：最冷月1月，月均温18.1°C；最暖月8月，月均温28.9°C。这是气候格点背景；温暖与根区排水有助理解苏铁生活，霜冻、积水和幼苗阶段仍重要；不能把一种苏铁代表全部苏铁类。地图采样点不证明该处有这一物种。",
    "question": {
      "id": "bio-check-cycad",
      "title": "苏铁 · 想一想",
      "prompt": "苏铁叶形像棕榈，最该怎样判断其类群？",
      "options": [
        "所有羽状叶加粗干的植物都是棕榈。",
        "苏铁是古老类群，所以不再受气候限制。",
        "看生殖结构和分类资料，不能只凭树形。"
      ],
      "correctIndex": 2,
      "feedback": [
        "这个判断忽略了器官、出现方式或水热条件中的关键差别。相似外形不保证相同亲缘；裸子植物仍具有具体温度、水分和根区限制。",
        "不能从名称、外观或一次记录跳到这个结论。相似外形不保证相同亲缘；裸子植物仍具有具体温度、水分和根区限制。",
        "相似外形不保证相同亲缘；裸子植物仍具有具体温度、水分和根区限制。"
      ],
      "explanation": "相似外形不保证相同亲缘；裸子植物仍具有具体温度、水分和根区限制。",
      "nextHint": "回到器官图和地区证据，分别说出一条已知事实与一条还需要当地核对的信息。",
      "sources": [
        {
          "title": "Kew POWO：苏铁分类",
          "url": "https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A328823-2",
          "supports": "接受学名、苏铁科与日本原生范围。"
        },
        {
          "title": "北卡罗来纳州立大学推广：苏铁",
          "url": "https://plants.ces.ncsu.edu/plants/cycas-revoluta/",
          "supports": "九州和琉球原生地区、硬叶与慢生、光照、排水、耐旱性及毒性；页面俗称花果不用于植物学分类。"
        },
        {
          "title": "NASA POWER：日本琉球群岛气候格点，2001–2025",
          "url": "https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M%2CPRECTOTCORR&community=AG&longitude=128&latitude=26.6&format=JSON",
          "supports": "该采样格点十二个月的气温与平均日降水率；不是树旁、林内、水下或整地区实测。"
        }
      ]
    },
    "sources": [
      {
        "title": "Kew POWO：苏铁分类",
        "url": "https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A328823-2",
        "supports": "接受学名、苏铁科与日本原生范围。"
      },
      {
        "title": "北卡罗来纳州立大学推广：苏铁",
        "url": "https://plants.ces.ncsu.edu/plants/cycas-revoluta/",
        "supports": "九州和琉球原生地区、硬叶与慢生、光照、排水、耐旱性及毒性；页面俗称花果不用于植物学分类。"
      },
      {
        "title": "NASA POWER：日本琉球群岛气候格点，2001–2025",
        "url": "https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M%2CPRECTOTCORR&community=AG&longitude=128&latitude=26.6&format=JSON",
        "supports": "该采样格点十二个月的气温与平均日降水率；不是树旁、林内、水下或整地区实测。"
      }
    ],
    "steps": [
      {
        "title": "认识形态",
        "text": "苏铁是生长缓慢的裸子木本，粗短茎顶部有坚硬的羽状复叶。它外形像棕榈，却不属于棕榈科，也不形成普通被子植物的花果。 坚硬羽状复叶长在粗短茎顶端，苏铁是裸子植物；外形像棕榈却不属于棕榈科。",
        "action": {
          "kind": "morphology",
          "regionId": "ryukyu"
        }
      },
      {
        "title": "环境机制",
        "text": "硬质羽状叶和短茎形成显著外形，雌雄生殖结构不同。 温暖与根区排水有助理解苏铁生活，霜冻、积水和幼苗阶段仍重要；不能把一种苏铁代表全部苏铁类。 温暖环境、明亮光照与排水通气的根区 温暖环境适宜，霜冻可能伤叶。 根系建立后可耐一定干期，幼株仍需适宜水分。 排水是重要前提，湿滞可导致根部问题。 苏铁不是棕榈；种子等部位有毒，不因中文名称或裸子植物身份就可食用。",
        "action": {
          "kind": "environment",
          "regionId": "ryukyu"
        }
      },
      {
        "title": "地区证据",
        "text": "以日本琉球群岛作为地区案例。NASA POWER 2001–2025格点：最冷月1月，月均温18.1°C；最暖月8月，月均温28.9°C。这是气候格点背景；温暖与根区排水有助理解苏铁生活，霜冻、积水和幼苗阶段仍重要；不能把一种苏铁代表全部苏铁类。地图采样点不证明该处有这一物种。",
        "action": {
          "kind": "region",
          "regionId": "ryukyu"
        }
      }
    ],
    "regionRole": "regional-context",
    "substrateKind": "terrestrial",
    "substrateNote": "沙壤土或其他疏松通气基质有利。 排水是重要前提，湿滞可导致根部问题。 土壤栅格是区域背景，不是根旁取样；酸碱度不能单独证明排水或养分足够。",
    "soilCaution": "沙壤土或其他疏松通气基质有利。 排水是重要前提，湿滞可导致根部问题。 土壤栅格是区域背景，不是根旁取样；酸碱度不能单独证明排水或养分足够。"
  },
  {
    "id": "welwitschia",
    "cropId": "welwitschia",
    "name": "百岁兰",
    "latin": "Welwitschia mirabilis",
    "pathId": "dryland-strategies",
    "group": "裸子植物",
    "definition": "百岁兰是矮生裸子木本，终生持续生长的两片主要叶会撕裂成带，外观容易误认为有许多叶。它并非兰科，也不是真正的多肉植物。",
    "organs": "百岁兰有持续生长的两片主要叶，叶片撕裂后看似多条；它是裸子植物，不是兰科。",
    "adaptations": "持久叶持续更新叶基，发达根系获取水分；适应不能归结为单一雾水机制。",
    "environment": "持久叶和根系参与获取、利用水分；纳米布的雨、雾和土层水分各需证据，不能概括成只靠雾或完全不要水。 沿海沙漠微环境、根区可用水与良好排水 生于纳米布沙漠，沿海影响和微地形共同塑造环境。 雾、偶发降雨与根系可获得的水共同重要。 栽培需通气排水，避免长期湿滞。",
    "misconception": "百岁兰不是兰花；看似多条的叶带来自两片主要叶，不能把它当成无需水的仙人掌。",
    "regionId": "namib",
    "region": {
      "id": "namib",
      "name": "纳米比亚西部纳米布荒漠",
      "lon": 14.8,
      "lat": -22.7,
      "pointMeaning": "地区教学采样点，不是物种观测点、植物精确位置或全地区平均。"
    },
    "rootzone": "soil",
    "evidenceChecks": {
      "climate": "先比较十二个月的温度与降水率，区分生长季、冷季和干湿季。空气格点气温不是水温或叶面温度。",
      "soil": "天然地可见沙砾土、石质地和干河道附近环境。 栽培需通气排水，避免长期湿滞。 土壤栅格是区域背景，不是根旁取样；酸碱度不能单独证明排水或养分足够。",
      "water": "雾、偶发降雨与根系可获得的水共同重要。 不能认为只靠雾存活，或已证明经气孔直接吸收全部雾水。 降雨与可用水不同，需结合供水位置、季节和排水。"
    },
    "caseText": "以纳米比亚西部纳米布荒漠作为地区案例。NASA POWER 2001–2025格点：最少雨月6月，月平均日降水率0.01mm/day；最多雨月2月，1.18mm/day；不是月总量。这是气候格点背景；持久叶和根系参与获取、利用水分；纳米布的雨、雾和土层水分各需证据，不能概括成只靠雾或完全不要水。地图采样点不证明该处有这一物种。",
    "question": {
      "id": "bio-check-welwitschia",
      "title": "百岁兰 · 想一想",
      "prompt": "百岁兰生活在纳米布荒漠，最合适的水分解释是什么？",
      "options": [
        "分清雨、雾与根区水，并检查不同来源的证据。",
        "只有雾是唯一水源，不需研究土层和降水。",
        "叶片撕裂越多，就说明长出了越多片新主叶。"
      ],
      "correctIndex": 0,
      "feedback": [
        "水源比例随地点与时期变化；长期叶片也不表示无限耐旱，外形与水文不能互相替代。",
        "这个判断忽略了器官、出现方式或水热条件中的关键差别。水源比例随地点与时期变化；长期叶片也不表示无限耐旱，外形与水文不能互相替代。",
        "不能从名称、外观或一次记录跳到这个结论。水源比例随地点与时期变化；长期叶片也不表示无限耐旱，外形与水文不能互相替代。"
      ],
      "explanation": "水源比例随地点与时期变化；长期叶片也不表示无限耐旱，外形与水文不能互相替代。",
      "nextHint": "回到器官图和地区证据，分别说出一条已知事实与一条还需要当地核对的信息。",
      "sources": [
        {
          "title": "Kew POWO：百岁兰分类",
          "url": "https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A383591-1",
          "supports": "接受学名、百岁兰科与纳米比亚和安哥拉原生范围。"
        },
        {
          "title": "Kew：百岁兰形态",
          "url": "https://www.kew.org/plants/welwitschia-mirabilis",
          "supports": "两片持久叶、矮茎与裸子植物身份。"
        },
        {
          "title": "SANBI PlantZAfrica：百岁兰",
          "url": "https://pza.sanbi.org/welwitschia-mirabilis",
          "supports": "纳米布至安哥拉南部原生范围、两片叶、雌雄异株、根系与雾和水分关系、非真正多肉及保育栽培限制。"
        },
        {
          "title": "Henschel 2019：Roots point to water sources of Welwitschia mirabilis",
          "url": "https://onlinelibrary.wiley.com/doi/10.1002/eco.2039",
          "supports": "原始水源研究：雨、雾与根区水需分开，不以雾频率推断主要吸水来源"
        },
        {
          "title": "NASA POWER：纳米比亚西部纳米布荒漠气候格点，2001–2025",
          "url": "https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M%2CPRECTOTCORR&community=AG&longitude=14.8&latitude=-22.7&format=JSON",
          "supports": "该采样格点十二个月的气温与平均日降水率；不是树旁、林内、水下或整地区实测。"
        }
      ]
    },
    "sources": [
      {
        "title": "Kew POWO：百岁兰分类",
        "url": "https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A383591-1",
        "supports": "接受学名、百岁兰科与纳米比亚和安哥拉原生范围。"
      },
      {
        "title": "Kew：百岁兰形态",
        "url": "https://www.kew.org/plants/welwitschia-mirabilis",
        "supports": "两片持久叶、矮茎与裸子植物身份。"
      },
      {
        "title": "SANBI PlantZAfrica：百岁兰",
        "url": "https://pza.sanbi.org/welwitschia-mirabilis",
        "supports": "纳米布至安哥拉南部原生范围、两片叶、雌雄异株、根系与雾和水分关系、非真正多肉及保育栽培限制。"
      },
      {
        "title": "Henschel 2019：Roots point to water sources of Welwitschia mirabilis",
        "url": "https://onlinelibrary.wiley.com/doi/10.1002/eco.2039",
        "supports": "原始水源研究：雨、雾与根区水需分开，不以雾频率推断主要吸水来源"
      },
      {
        "title": "NASA POWER：纳米比亚西部纳米布荒漠气候格点，2001–2025",
        "url": "https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M%2CPRECTOTCORR&community=AG&longitude=14.8&latitude=-22.7&format=JSON",
        "supports": "该采样格点十二个月的气温与平均日降水率；不是树旁、林内、水下或整地区实测。"
      }
    ],
    "steps": [
      {
        "title": "认识形态",
        "text": "百岁兰是矮生裸子木本，终生持续生长的两片主要叶会撕裂成带，外观容易误认为有许多叶。它并非兰科，也不是真正的多肉植物。 百岁兰有持续生长的两片主要叶，叶片撕裂后看似多条；它是裸子植物，不是兰科。",
        "action": {
          "kind": "morphology",
          "regionId": "namib"
        }
      },
      {
        "title": "环境机制",
        "text": "持久叶持续更新叶基，发达根系获取水分；适应不能归结为单一雾水机制。 持久叶和根系参与获取、利用水分；纳米布的雨、雾和土层水分各需证据，不能概括成只靠雾或完全不要水。 沿海沙漠微环境、根区可用水与良好排水 生于纳米布沙漠，沿海影响和微地形共同塑造环境。 雾、偶发降雨与根系可获得的水共同重要。 栽培需通气排水，避免长期湿滞。 百岁兰不是兰花；看似多条的叶带来自两片主要叶，不能把它当成无需水的仙人掌。",
        "action": {
          "kind": "environment",
          "regionId": "namib"
        }
      },
      {
        "title": "地区证据",
        "text": "以纳米比亚西部纳米布荒漠作为地区案例。NASA POWER 2001–2025格点：最少雨月6月，月平均日降水率0.01mm/day；最多雨月2月，1.18mm/day；不是月总量。这是气候格点背景；持久叶和根系参与获取、利用水分；纳米布的雨、雾和土层水分各需证据，不能概括成只靠雾或完全不要水。地图采样点不证明该处有这一物种。",
        "action": {
          "kind": "region",
          "regionId": "namib"
        }
      }
    ],
    "regionRole": "regional-context",
    "substrateKind": "terrestrial",
    "substrateNote": "天然地可见沙砾土、石质地和干河道附近环境。 栽培需通气排水，避免长期湿滞。 土壤栅格是区域背景，不是根旁取样；酸碱度不能单独证明排水或养分足够。",
    "soilCaution": "天然地可见沙砾土、石质地和干河道附近环境。 栽培需通气排水，避免长期湿滞。 土壤栅格是区域背景，不是根旁取样；酸碱度不能单独证明排水或养分足够。"
  },
  {
    "id": "treefern",
    "cropId": "treefern",
    "name": "软树蕨",
    "latin": "Dicksonia antarctica",
    "pathId": "forest-layers",
    "group": "蕨类与石松",
    "definition": "软树蕨把大型羽状叶举到高处，常见于澳大利亚较凉湿的林谷。它属于蕨类，繁殖依靠孢子而非种子。",
    "organs": "大型羽状叶由直立根茎举高，外覆根层参与支撑和保水；叶背可形成孢子囊群。",
    "adaptations": "直立根茎与外覆根层支持叶冠并保持水分。",
    "environment": "较凉湿的林谷、庇荫与周围空气湿润有助生长；根茎与叶冠失水风险不能只由地面年雨量判断。 凉湿林谷与遮蔽环境 凉爽湿润利于生长；寒冷条件下可落叶，不能只按年均温判断越冬。 根区与纤维状根茎需要持续水分。 湿润同时保持排水与根区通气。",
    "misconception": "软树蕨长得像树，却没有松树的球果，也不开花结果。",
    "regionId": "tasmania",
    "region": {
      "id": "tasmania",
      "name": "澳大利亚塔斯马尼亚林谷",
      "lon": 146.5,
      "lat": -42.5,
      "pointMeaning": "地区教学采样点，不是物种观测点、植物精确位置或全地区平均。"
    },
    "rootzone": "soil",
    "evidenceChecks": {
      "climate": "先比较十二个月的温度与降水率，区分生长季、冷季和干湿季。空气格点气温不是水温或叶面温度。",
      "soil": "含腐殖质、能保水的土壤适合栽培。 湿润同时保持排水与根区通气。 土壤栅格是区域背景，不是根旁取样；酸碱度不能单独证明排水或养分足够。",
      "water": "根区与纤维状根茎需要持续水分。 保持湿润不等于把顶芽长期泡在水中。 降雨与可用水不同，需结合供水位置、季节和排水。"
    },
    "caseText": "以澳大利亚塔斯马尼亚林谷作为地区案例。NASA POWER 2001–2025格点：最冷月7月，月均温4.8°C；最暖月2月，月均温13.4°C。这是气候格点背景；较凉湿的林谷、庇荫与周围空气湿润有助生长；根茎与叶冠失水风险不能只由地面年雨量判断。地图采样点不证明该处有这一物种。",
    "question": {
      "id": "bio-check-treefern",
      "title": "软树蕨 · 想一想",
      "prompt": "软树蕨长得像小树，应怎样理解其繁殖？",
      "options": [
        "蕨类喜欢湿润，所以根茎无论多久缺水都不会受影响。",
        "它是蕨类，依靠孢子，不形成种子球果或花果。",
        "树形意味着它一定有松树一样的球果。"
      ],
      "correctIndex": 1,
      "feedback": [
        "不能从名称、外观或一次记录跳到这个结论。生活型像树不等于亲缘相同；蕨类的生殖结构与局部湿度仍需分别观察。",
        "生活型像树不等于亲缘相同；蕨类的生殖结构与局部湿度仍需分别观察。",
        "这个判断忽略了器官、出现方式或水热条件中的关键差别。生活型像树不等于亲缘相同；蕨类的生殖结构与局部湿度仍需分别观察。"
      ],
      "explanation": "生活型像树不等于亲缘相同；蕨类的生殖结构与局部湿度仍需分别观察。",
      "nextHint": "回到器官图和地区证据，分别说出一条已知事实与一条还需要当地核对的信息。",
      "sources": [
        {
          "title": "澳大利亚植物志：软树蕨",
          "url": "https://plantnet.rbgsyd.nsw.gov.au/cgi-bin/NSWfl.pl?lvl=sp&name=Dicksonia~antarctica&page=nswfl",
          "supports": "分类、根茎与羽叶结构，以及澳大利亚各州和山沟生境。"
        },
        {
          "title": "Kew：软树蕨形态与环境",
          "url": "https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A17082540-1/general-information",
          "supports": "接受名、腐殖质与湿润条件、寒冷时落叶及园艺背景。"
        },
        {
          "title": "RHS：软树蕨",
          "url": "https://www.rhs.org.uk/plants/5794/dicksonia-antarctica/details/",
          "supports": "湿润排水土壤与季节性园艺管理。"
        },
        {
          "title": "NASA POWER：澳大利亚塔斯马尼亚林谷气候格点，2001–2025",
          "url": "https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M%2CPRECTOTCORR&community=AG&longitude=146.5&latitude=-42.5&format=JSON",
          "supports": "该采样格点十二个月的气温与平均日降水率；不是树旁、林内、水下或整地区实测。"
        }
      ]
    },
    "sources": [
      {
        "title": "澳大利亚植物志：软树蕨",
        "url": "https://plantnet.rbgsyd.nsw.gov.au/cgi-bin/NSWfl.pl?lvl=sp&name=Dicksonia~antarctica&page=nswfl",
        "supports": "分类、根茎与羽叶结构，以及澳大利亚各州和山沟生境。"
      },
      {
        "title": "Kew：软树蕨形态与环境",
        "url": "https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A17082540-1/general-information",
        "supports": "接受名、腐殖质与湿润条件、寒冷时落叶及园艺背景。"
      },
      {
        "title": "RHS：软树蕨",
        "url": "https://www.rhs.org.uk/plants/5794/dicksonia-antarctica/details/",
        "supports": "湿润排水土壤与季节性园艺管理。"
      },
      {
        "title": "NASA POWER：澳大利亚塔斯马尼亚林谷气候格点，2001–2025",
        "url": "https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M%2CPRECTOTCORR&community=AG&longitude=146.5&latitude=-42.5&format=JSON",
        "supports": "该采样格点十二个月的气温与平均日降水率；不是树旁、林内、水下或整地区实测。"
      }
    ],
    "steps": [
      {
        "title": "认识形态",
        "text": "软树蕨把大型羽状叶举到高处，常见于澳大利亚较凉湿的林谷。它属于蕨类，繁殖依靠孢子而非种子。 大型羽状叶由直立根茎举高，外覆根层参与支撑和保水；叶背可形成孢子囊群。",
        "action": {
          "kind": "morphology",
          "regionId": "tasmania"
        }
      },
      {
        "title": "环境机制",
        "text": "直立根茎与外覆根层支持叶冠并保持水分。 较凉湿的林谷、庇荫与周围空气湿润有助生长；根茎与叶冠失水风险不能只由地面年雨量判断。 凉湿林谷与遮蔽环境 凉爽湿润利于生长；寒冷条件下可落叶，不能只按年均温判断越冬。 根区与纤维状根茎需要持续水分。 湿润同时保持排水与根区通气。 软树蕨长得像树，却没有松树的球果，也不开花结果。",
        "action": {
          "kind": "environment",
          "regionId": "tasmania"
        }
      },
      {
        "title": "地区证据",
        "text": "以澳大利亚塔斯马尼亚林谷作为地区案例。NASA POWER 2001–2025格点：最冷月7月，月均温4.8°C；最暖月2月，月均温13.4°C。这是气候格点背景；较凉湿的林谷、庇荫与周围空气湿润有助生长；根茎与叶冠失水风险不能只由地面年雨量判断。地图采样点不证明该处有这一物种。",
        "action": {
          "kind": "region",
          "regionId": "tasmania"
        }
      }
    ],
    "regionRole": "regional-context",
    "substrateKind": "terrestrial",
    "substrateNote": "含腐殖质、能保水的土壤适合栽培。 湿润同时保持排水与根区通气。 土壤栅格是区域背景，不是根旁取样；酸碱度不能单独证明排水或养分足够。",
    "soilCaution": "含腐殖质、能保水的土壤适合栽培。 湿润同时保持排水与根区通气。 土壤栅格是区域背景，不是根旁取样；酸碱度不能单独证明排水或养分足够。"
  },
  {
    "id": "birdsnestfern",
    "cropId": "birdsnestfern",
    "name": "巢蕨",
    "latin": "Asplenium nidus",
    "pathId": "forest-layers",
    "group": "蕨类与石松",
    "definition": "巢蕨以整片带状叶组成巢状叶丛，可附生或生于岩面。资料中的广义巢蕨范围常包含近缘种，本条按Kew当前范围表达。",
    "organs": "整片带状叶围成巢状叶丛，叶背有成行孢子囊群；可附生或生于岩面，不必都有羽状小叶。",
    "adaptations": "巢状叶丛形成与树枝、岩面相接的小生境。",
    "environment": "附生位置的光、水与基质积累不同于地面，暖湿森林仍有干燥间隙；林冠高度和通风会改变根表状态。 暖湿环境与明亮散射光 需要温暖湿润条件；园艺越冬不能照搬温带蕨类。 植株周围湿度与基质水分都重要。 栽培基质需保水而通气。",
    "misconception": "附生不是寄生，巢蕨也并非所有蕨类都具有的羽状叶形。",
    "regionId": "borneo",
    "region": {
      "id": "borneo",
      "name": "婆罗洲低地森林",
      "lon": 117,
      "lat": 5.3,
      "pointMeaning": "地区教学采样点，不是物种观测点、植物精确位置或全地区平均。"
    },
    "rootzone": "epiphyte",
    "evidenceChecks": {
      "climate": "先比较十二个月的温度与降水率，区分生长季、冷季和干湿季。空气格点气温不是水温或叶面温度。",
      "soil": "附生根表的树皮、腐殖质与通气不同于地表土层；陆地土壤模型只提供周围背景。",
      "water": "植株周围湿度与基质水分都重要。 空气湿润和根区积水是不同条件。 降雨与可用水不同，需结合供水位置、季节和排水。"
    },
    "caseText": "以婆罗洲低地森林作为地区案例。NASA POWER 2001–2025格点：最少雨月4月，月平均日降水率4.88mm/day；最多雨月10月，10.22mm/day；不是月总量。这是气候格点背景；附生位置的光、水与基质积累不同于地面，暖湿森林仍有干燥间隙；林冠高度和通风会改变根表状态。地图采样点不证明该处有这一物种。",
    "question": {
      "id": "bio-check-birdsnestfern",
      "title": "巢蕨 · 想一想",
      "prompt": "巢蕨附着在树干上，能用地表土壤格点当成根表实测吗？",
      "options": [
        "能；凡在同一气候格点内，所有根区都相同。",
        "巢蕨叶片不羽裂，所以它不可能是蕨类。",
        "不能；树干附生基质与地面土层要分别说明。"
      ],
      "correctIndex": 2,
      "feedback": [
        "这个判断忽略了器官、出现方式或水热条件中的关键差别。叶形与亲缘不是一一对应；大尺度土壤图也不覆盖树皮、附生腐殖质与局部持水。",
        "不能从名称、外观或一次记录跳到这个结论。叶形与亲缘不是一一对应；大尺度土壤图也不覆盖树皮、附生腐殖质与局部持水。",
        "叶形与亲缘不是一一对应；大尺度土壤图也不覆盖树皮、附生腐殖质与局部持水。"
      ],
      "explanation": "叶形与亲缘不是一一对应；大尺度土壤图也不覆盖树皮、附生腐殖质与局部持水。",
      "nextHint": "回到器官图和地区证据，分别说出一条已知事实与一条还需要当地核对的信息。",
      "sources": [
        {
          "title": "Kew：巢蕨",
          "url": "https://powo.science.kew.org/taxon/17048040-1",
          "supports": "当前接受名、附生或岩生习性、马来群岛至昆士兰的原生范围。"
        },
        {
          "title": "RHS：巢蕨",
          "url": "https://www.rhs.org.uk/plants/1728/asplenium-nidus/details",
          "supports": "明亮间接光、湿润但不积水的栽培环境与蕨叶结构。"
        },
        {
          "title": "NASA POWER：婆罗洲低地森林气候格点，2001–2025",
          "url": "https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M%2CPRECTOTCORR&community=AG&longitude=117&latitude=5.3&format=JSON",
          "supports": "该采样格点十二个月的气温与平均日降水率；不是树旁、林内、水下或整地区实测。"
        }
      ]
    },
    "sources": [
      {
        "title": "Kew：巢蕨",
        "url": "https://powo.science.kew.org/taxon/17048040-1",
        "supports": "当前接受名、附生或岩生习性、马来群岛至昆士兰的原生范围。"
      },
      {
        "title": "RHS：巢蕨",
        "url": "https://www.rhs.org.uk/plants/1728/asplenium-nidus/details",
        "supports": "明亮间接光、湿润但不积水的栽培环境与蕨叶结构。"
      },
      {
        "title": "NASA POWER：婆罗洲低地森林气候格点，2001–2025",
        "url": "https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M%2CPRECTOTCORR&community=AG&longitude=117&latitude=5.3&format=JSON",
        "supports": "该采样格点十二个月的气温与平均日降水率；不是树旁、林内、水下或整地区实测。"
      }
    ],
    "steps": [
      {
        "title": "认识形态",
        "text": "巢蕨以整片带状叶组成巢状叶丛，可附生或生于岩面。资料中的广义巢蕨范围常包含近缘种，本条按Kew当前范围表达。 整片带状叶围成巢状叶丛，叶背有成行孢子囊群；可附生或生于岩面，不必都有羽状小叶。",
        "action": {
          "kind": "morphology",
          "regionId": "borneo"
        }
      },
      {
        "title": "环境机制",
        "text": "巢状叶丛形成与树枝、岩面相接的小生境。 附生位置的光、水与基质积累不同于地面，暖湿森林仍有干燥间隙；林冠高度和通风会改变根表状态。 暖湿环境与明亮散射光 需要温暖湿润条件；园艺越冬不能照搬温带蕨类。 植株周围湿度与基质水分都重要。 栽培基质需保水而通气。 附生不是寄生，巢蕨也并非所有蕨类都具有的羽状叶形。",
        "action": {
          "kind": "environment",
          "regionId": "borneo"
        }
      },
      {
        "title": "地区证据",
        "text": "以婆罗洲低地森林作为地区案例。NASA POWER 2001–2025格点：最少雨月4月，月平均日降水率4.88mm/day；最多雨月10月，10.22mm/day；不是月总量。这是气候格点背景；附生位置的光、水与基质积累不同于地面，暖湿森林仍有干燥间隙；林冠高度和通风会改变根表状态。地图采样点不证明该处有这一物种。",
        "action": {
          "kind": "region",
          "regionId": "borneo"
        }
      }
    ],
    "regionRole": "regional-context",
    "substrateKind": "epiphytic",
    "substrateNote": "附生根表的树皮、腐殖质与通气不同于地表土层；陆地土壤模型只提供周围背景。",
    "soilCaution": "附生根表的树皮、腐殖质与通气不同于地表土层；陆地土壤模型只提供周围背景。"
  },
  {
    "id": "maidenhair",
    "cropId": "maidenhair",
    "name": "铁线蕨",
    "latin": "Adiantum capillus-veneris",
    "pathId": "forest-layers",
    "group": "蕨类与石松",
    "definition": "铁线蕨的细而深色叶柄承托扇状小羽片，可见于潮湿岩面与半阴环境。广泛分布不等于每块土地都能满足其微环境。",
    "organs": "深色细叶柄托着扇状小羽片，孢子囊群与叶缘相关；它不是靠花和种子繁殖。",
    "adaptations": "细分叶片和岩隙生长体现其局部生境特点。",
    "environment": "潮湿岩面与半阴能形成很小的有利空间；裂隙渗水与地形遮蔽可能比附近地区年雨量更能解释一片叶丛。 湿润岩隙与半阴环境 本种分布跨多种气候区，实际表现取决于局部温湿条件。 基质需要维持水分，薄叶不适合持续干燥。 栽培强调湿润但排水良好。",
    "misconception": "铁线蕨分布广，不能因此推断世界各地的阳台都一样适合。",
    "regionId": "liguria",
    "region": {
      "id": "liguria",
      "name": "意大利西北部利古里亚丘陵",
      "lon": 9.3,
      "lat": 44.4,
      "pointMeaning": "地区教学采样点，不是物种观测点、植物精确位置或全地区平均。"
    },
    "rootzone": "microhabitat",
    "evidenceChecks": {
      "climate": "先比较十二个月的温度与降水率，区分生长季、冷季和干湿季。空气格点气温不是水温或叶面温度。",
      "soil": "岩隙、浅薄基质也可提供附着空间。 栽培强调湿润但排水良好。 土壤栅格是区域背景，不是根旁取样；酸碱度不能单独证明排水或养分足够。 岩缝、苔藓垫和裸土表面的微生境需另行调查。",
      "water": "基质需要维持水分，薄叶不适合持续干燥。 湿岩壁有水分来源，不等于整株浸在深水。 降雨与可用水不同，需结合供水位置、季节和排水。"
    },
    "caseText": "以意大利西北部利古里亚丘陵作为地区案例。NASA POWER 2001–2025格点：最冷月1月，月均温3.6°C；最暖月7月，月均温22.7°C。这是气候格点背景；潮湿岩面与半阴能形成很小的有利空间；裂隙渗水与地形遮蔽可能比附近地区年雨量更能解释一片叶丛。地图采样点不证明该处有这一物种。",
    "question": {
      "id": "bio-check-maidenhair",
      "title": "铁线蕨 · 想一想",
      "prompt": "同一片利古里亚丘陵有干坡也有湿岩，铁线蕨案例提示什么？",
      "options": [
        "地区气候相同仍有渗水和遮阴造成的微生境差异。",
        "年雨量相同就证明每个岩缝的湿度相同。",
        "分布广说明它在任何阳台都能不浇水生长。"
      ],
      "correctIndex": 0,
      "feedback": [
        "微地形和渗水改变局部可用水；分布广并不消除对小尺度湿润生境的要求。",
        "这个判断忽略了器官、出现方式或水热条件中的关键差别。微地形和渗水改变局部可用水；分布广并不消除对小尺度湿润生境的要求。",
        "不能从名称、外观或一次记录跳到这个结论。微地形和渗水改变局部可用水；分布广并不消除对小尺度湿润生境的要求。"
      ],
      "explanation": "微地形和渗水改变局部可用水；分布广并不消除对小尺度湿润生境的要求。",
      "nextHint": "回到器官图和地区证据，分别说出一条已知事实与一条还需要当地核对的信息。",
      "sources": [
        {
          "title": "Kew：铁线蕨",
          "url": "https://powo.science.kew.org/taxon/325030-2",
          "supports": "接受名、凤尾蕨科，以及意大利与中国中南部原生分布。"
        },
        {
          "title": "RHS：铁线蕨",
          "url": "https://www.rhs.org.uk/plants/23998/adiantum-capillus-veneris/details",
          "supports": "深色叶柄、叶缘孢子囊与半阴、湿润排水环境。"
        },
        {
          "title": "NASA POWER：意大利西北部利古里亚丘陵气候格点，2001–2025",
          "url": "https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M%2CPRECTOTCORR&community=AG&longitude=9.3&latitude=44.4&format=JSON",
          "supports": "该采样格点十二个月的气温与平均日降水率；不是树旁、林内、水下或整地区实测。"
        }
      ]
    },
    "sources": [
      {
        "title": "Kew：铁线蕨",
        "url": "https://powo.science.kew.org/taxon/325030-2",
        "supports": "接受名、凤尾蕨科，以及意大利与中国中南部原生分布。"
      },
      {
        "title": "RHS：铁线蕨",
        "url": "https://www.rhs.org.uk/plants/23998/adiantum-capillus-veneris/details",
        "supports": "深色叶柄、叶缘孢子囊与半阴、湿润排水环境。"
      },
      {
        "title": "NASA POWER：意大利西北部利古里亚丘陵气候格点，2001–2025",
        "url": "https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M%2CPRECTOTCORR&community=AG&longitude=9.3&latitude=44.4&format=JSON",
        "supports": "该采样格点十二个月的气温与平均日降水率；不是树旁、林内、水下或整地区实测。"
      }
    ],
    "steps": [
      {
        "title": "认识形态",
        "text": "铁线蕨的细而深色叶柄承托扇状小羽片，可见于潮湿岩面与半阴环境。广泛分布不等于每块土地都能满足其微环境。 深色细叶柄托着扇状小羽片，孢子囊群与叶缘相关；它不是靠花和种子繁殖。",
        "action": {
          "kind": "morphology",
          "regionId": "liguria"
        }
      },
      {
        "title": "环境机制",
        "text": "细分叶片和岩隙生长体现其局部生境特点。 潮湿岩面与半阴能形成很小的有利空间；裂隙渗水与地形遮蔽可能比附近地区年雨量更能解释一片叶丛。 湿润岩隙与半阴环境 本种分布跨多种气候区，实际表现取决于局部温湿条件。 基质需要维持水分，薄叶不适合持续干燥。 栽培强调湿润但排水良好。 铁线蕨分布广，不能因此推断世界各地的阳台都一样适合。",
        "action": {
          "kind": "environment",
          "regionId": "liguria"
        }
      },
      {
        "title": "地区证据",
        "text": "以意大利西北部利古里亚丘陵作为地区案例。NASA POWER 2001–2025格点：最冷月1月，月均温3.6°C；最暖月7月，月均温22.7°C。这是气候格点背景；潮湿岩面与半阴能形成很小的有利空间；裂隙渗水与地形遮蔽可能比附近地区年雨量更能解释一片叶丛。地图采样点不证明该处有这一物种。",
        "action": {
          "kind": "region",
          "regionId": "liguria"
        }
      }
    ],
    "regionRole": "regional-context",
    "substrateKind": "terrestrial",
    "substrateNote": "岩隙、浅薄基质也可提供附着空间。 栽培强调湿润但排水良好。 土壤栅格是区域背景，不是根旁取样；酸碱度不能单独证明排水或养分足够。 岩缝、苔藓垫和裸土表面的微生境需另行调查。",
    "soilCaution": "岩隙、浅薄基质也可提供附着空间。 栽培强调湿润但排水良好。 土壤栅格是区域背景，不是根旁取样；酸碱度不能单独证明排水或养分足够。 岩缝、苔藓垫和裸土表面的微生境需另行调查。"
  },
  {
    "id": "horsetail",
    "cropId": "horsetail",
    "name": "问荆",
    "latin": "Equisetum arvense",
    "pathId": "spores-microhabitats",
    "group": "蕨类与石松",
    "definition": "问荆有分节茎和强大的地下根茎系统，浅褐色繁殖茎与绿色营养茎形态不同。它能进入湿地边缘，也可能成为难控制的引入植物。",
    "organs": "分节茎与地下根茎发达，繁殖茎顶端的孢子囊穗不是花；营养茎和繁殖茎形态不同。",
    "adaptations": "地下根茎支持扩展，碎片随土砂移动可能传播。",
    "environment": "湿润土壤与根茎扩展可解释其出现，土砂搬动也可能传播碎段；有物种记录不代表它一定适合被引入。 湿润地面与地下根茎空间 原生范围覆盖北半球温带及亚寒带，地上生长有季节性。 湿润河岸、沟边和砂泥地是常见生境。 水位与地表扰动共同影响扩展空间。",
    "misconception": "问荆顶端的孢子囊穗不是花，也不是小松树的球果。",
    "regionId": "uk-lowland",
    "region": {
      "id": "uk-lowland",
      "name": "英国低地林地与淡水环境",
      "lon": -1,
      "lat": 52,
      "pointMeaning": "地区教学采样点，不是物种观测点、植物精确位置或全地区平均。"
    },
    "rootzone": "soil",
    "evidenceChecks": {
      "climate": "先比较十二个月的温度与降水率，区分生长季、冷季和干湿季。空气格点气温不是水温或叶面温度。",
      "soil": "可生于砂质、泥质与受扰动土壤。 水位与地表扰动共同影响扩展空间。 土壤栅格是区域背景，不是根旁取样；酸碱度不能单独证明排水或养分足够。",
      "water": "湿润河岸、沟边和砂泥地是常见生境。 能在湿地边生长不表示每种深水条件都合适。 降雨与可用水不同，需结合供水位置、季节和排水。"
    },
    "caseText": "以英国低地林地与淡水环境作为地区案例。NASA POWER 2001–2025格点：最冷月1月，月均温3.7°C；最暖月7月，月均温17.1°C。这是气候格点背景；湿润土壤与根茎扩展可解释其出现，土砂搬动也可能传播碎段；有物种记录不代表它一定适合被引入。地图采样点不证明该处有这一物种。",
    "question": {
      "id": "bio-check-horsetail",
      "title": "问荆 · 想一想",
      "prompt": "问荆顶端像小穗的结构应该怎样辨认？",
      "options": [
        "根茎容易扩展表示所有出现都是天然原生。",
        "它是孢子囊穗，要和花序及松树球果分开。",
        "它是小松树的球果，所以问荆属于松科。"
      ],
      "correctIndex": 1,
      "feedback": [
        "不能从名称、外观或一次记录跳到这个结论。器官与传播途径是两件事；根茎碎片可随土砂移动，原生和引入仍须查记录。",
        "器官与传播途径是两件事；根茎碎片可随土砂移动，原生和引入仍须查记录。",
        "这个判断忽略了器官、出现方式或水热条件中的关键差别。器官与传播途径是两件事；根茎碎片可随土砂移动，原生和引入仍须查记录。"
      ],
      "explanation": "器官与传播途径是两件事；根茎碎片可随土砂移动，原生和引入仍须查记录。",
      "nextHint": "回到器官图和地区证据，分别说出一条已知事实与一条还需要当地核对的信息。",
      "sources": [
        {
          "title": "Kew：问荆",
          "url": "https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A300073-2",
          "supports": "接受名、木贼科与北半球原生范围。"
        },
        {
          "title": "新西兰植物志：问荆",
          "url": "https://www.nzflora.info/factsheet/Taxon/Equisetum-arvense.html",
          "supports": "两类地上茎、湿润生境、根茎扩展及马纳瓦图归化分布。"
        },
        {
          "title": "NASA POWER：英国低地林地与淡水环境气候格点，2001–2025",
          "url": "https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M%2CPRECTOTCORR&community=AG&longitude=-1&latitude=52&format=JSON",
          "supports": "该采样格点十二个月的气温与平均日降水率；不是树旁、林内、水下或整地区实测。"
        }
      ]
    },
    "sources": [
      {
        "title": "Kew：问荆",
        "url": "https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A300073-2",
        "supports": "接受名、木贼科与北半球原生范围。"
      },
      {
        "title": "新西兰植物志：问荆",
        "url": "https://www.nzflora.info/factsheet/Taxon/Equisetum-arvense.html",
        "supports": "两类地上茎、湿润生境、根茎扩展及马纳瓦图归化分布。"
      },
      {
        "title": "NASA POWER：英国低地林地与淡水环境气候格点，2001–2025",
        "url": "https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M%2CPRECTOTCORR&community=AG&longitude=-1&latitude=52&format=JSON",
        "supports": "该采样格点十二个月的气温与平均日降水率；不是树旁、林内、水下或整地区实测。"
      }
    ],
    "steps": [
      {
        "title": "认识形态",
        "text": "问荆有分节茎和强大的地下根茎系统，浅褐色繁殖茎与绿色营养茎形态不同。它能进入湿地边缘，也可能成为难控制的引入植物。 分节茎与地下根茎发达，繁殖茎顶端的孢子囊穗不是花；营养茎和繁殖茎形态不同。",
        "action": {
          "kind": "morphology",
          "regionId": "uk-lowland"
        }
      },
      {
        "title": "环境机制",
        "text": "地下根茎支持扩展，碎片随土砂移动可能传播。 湿润土壤与根茎扩展可解释其出现，土砂搬动也可能传播碎段；有物种记录不代表它一定适合被引入。 湿润地面与地下根茎空间 原生范围覆盖北半球温带及亚寒带，地上生长有季节性。 湿润河岸、沟边和砂泥地是常见生境。 水位与地表扰动共同影响扩展空间。 问荆顶端的孢子囊穗不是花，也不是小松树的球果。",
        "action": {
          "kind": "environment",
          "regionId": "uk-lowland"
        }
      },
      {
        "title": "地区证据",
        "text": "以英国低地林地与淡水环境作为地区案例。NASA POWER 2001–2025格点：最冷月1月，月均温3.7°C；最暖月7月，月均温17.1°C。这是气候格点背景；湿润土壤与根茎扩展可解释其出现，土砂搬动也可能传播碎段；有物种记录不代表它一定适合被引入。地图采样点不证明该处有这一物种。",
        "action": {
          "kind": "region",
          "regionId": "uk-lowland"
        }
      }
    ],
    "regionRole": "regional-context",
    "substrateKind": "terrestrial",
    "substrateNote": "可生于砂质、泥质与受扰动土壤。 水位与地表扰动共同影响扩展空间。 土壤栅格是区域背景，不是根旁取样；酸碱度不能单独证明排水或养分足够。",
    "soilCaution": "可生于砂质、泥质与受扰动土壤。 水位与地表扰动共同影响扩展空间。 土壤栅格是区域背景，不是根旁取样；酸碱度不能单独证明排水或养分足够。"
  },
  {
    "id": "clubmoss",
    "cropId": "clubmoss",
    "name": "石松",
    "latin": "Lycopodium clavatum",
    "pathId": "spores-microhabitats",
    "group": "蕨类与石松",
    "definition": "石松以匍匐枝和密集小叶铺展，部分直立枝上形成孢子囊穗。它是有维管组织的石松类，形态小却不能当成苔藓。",
    "organs": "匍匐枝上有密集小叶，直立枝可托起孢子囊穗；石松具有维管组织，不是小松树或藓类。",
    "adaptations": "匍匐茎延展，小叶和孢子囊穗形成可识别结构。",
    "environment": "湿润林缘与山地的光、表土和竞争影响其建立，孢子传播到达与长期形成群体并非同一步。 湿润林缘与山地环境 分布涉及温带与热带山地，不能据此给出单一温度最适值。 湿润林缘及山地小生境是理解重点。 微地形和地表水流影响局部生境。",
    "misconception": "名字含“松”和英文“moss”，都不意味着它属于松树或藓类。",
    "regionId": "yunnan",
    "region": {
      "id": "yunnan",
      "name": "中国云南山地",
      "lon": 100.2,
      "lat": 25.7,
      "pointMeaning": "地区教学采样点，不是物种观测点、植物精确位置或全地区平均。"
    },
    "rootzone": "soil",
    "evidenceChecks": {
      "climate": "先比较十二个月的温度与降水率，区分生长季、冷季和干湿季。空气格点气温不是水温或叶面温度。",
      "soil": "可见于林缘、坡面或道路旁的林地基质。 微地形和地表水流影响局部生境。 土壤栅格是区域背景，不是根旁取样；酸碱度不能单独证明排水或养分足够。",
      "water": "湿润林缘及山地小生境是理解重点。 年降水总量不能反映林地表层的干湿变化。 降雨与可用水不同，需结合供水位置、季节和排水。"
    },
    "caseText": "以中国云南山地作为地区案例。NASA POWER 2001–2025格点：最冷月1月，月均温6.8°C；最暖月6月，月均温19.8°C。这是气候格点背景；湿润林缘与山地的光、表土和竞争影响其建立，孢子传播到达与长期形成群体并非同一步。地图采样点不证明该处有这一物种。",
    "question": {
      "id": "bio-check-clubmoss",
      "title": "石松 · 想一想",
      "prompt": "石松名字带“松”，英文又含moss，最可靠的判断依据是什么？",
      "options": [
        "名字有松，就属于会结球果的松树。",
        "个体小就表示它一定没有维管组织，是苔藓。",
        "以维管组织、小叶和孢子结构核对石松类身份。"
      ],
      "correctIndex": 2,
      "feedback": [
        "这个判断忽略了器官、出现方式或水热条件中的关键差别。常用名跨语言可能误导；植物类群需看结构和生殖证据，而不是依大小或名称判定。",
        "不能从名称、外观或一次记录跳到这个结论。常用名跨语言可能误导；植物类群需看结构和生殖证据，而不是依大小或名称判定。",
        "常用名跨语言可能误导；植物类群需看结构和生殖证据，而不是依大小或名称判定。"
      ],
      "explanation": "常用名跨语言可能误导；植物类群需看结构和生殖证据，而不是依大小或名称判定。",
      "nextHint": "回到器官图和地区证据，分别说出一条已知事实与一条还需要当地核对的信息。",
      "sources": [
        {
          "title": "Kew：石松",
          "url": "https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A304307-2/general-information",
          "supports": "接受名、石松类归属与温带至热带山地总体分布。"
        },
        {
          "title": "USDA GRIN：石松",
          "url": "https://npgsweb.ars-grin.gov/gringlobal/taxon/taxonomydetail?id=431024",
          "supports": "日本本州与中国云南的原生地区。"
        },
        {
          "title": "CNPS与加州自然多样性数据库",
          "url": "https://rareplants.cnps.org/documents/LycopodiumClavatum_20080708_StsRevChg.pdf",
          "supports": "多年生根茎习性、湿润针叶林与林缘环境；环境例子来自加州，不当作全球阈值。"
        },
        {
          "title": "NASA POWER：中国云南山地气候格点，2001–2025",
          "url": "https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M%2CPRECTOTCORR&community=AG&longitude=100.2&latitude=25.7&format=JSON",
          "supports": "该采样格点十二个月的气温与平均日降水率；不是树旁、林内、水下或整地区实测。"
        }
      ]
    },
    "sources": [
      {
        "title": "Kew：石松",
        "url": "https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A304307-2/general-information",
        "supports": "接受名、石松类归属与温带至热带山地总体分布。"
      },
      {
        "title": "USDA GRIN：石松",
        "url": "https://npgsweb.ars-grin.gov/gringlobal/taxon/taxonomydetail?id=431024",
        "supports": "日本本州与中国云南的原生地区。"
      },
      {
        "title": "CNPS与加州自然多样性数据库",
        "url": "https://rareplants.cnps.org/documents/LycopodiumClavatum_20080708_StsRevChg.pdf",
        "supports": "多年生根茎习性、湿润针叶林与林缘环境；环境例子来自加州，不当作全球阈值。"
      },
      {
        "title": "NASA POWER：中国云南山地气候格点，2001–2025",
        "url": "https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M%2CPRECTOTCORR&community=AG&longitude=100.2&latitude=25.7&format=JSON",
        "supports": "该采样格点十二个月的气温与平均日降水率；不是树旁、林内、水下或整地区实测。"
      }
    ],
    "steps": [
      {
        "title": "认识形态",
        "text": "石松以匍匐枝和密集小叶铺展，部分直立枝上形成孢子囊穗。它是有维管组织的石松类，形态小却不能当成苔藓。 匍匐枝上有密集小叶，直立枝可托起孢子囊穗；石松具有维管组织，不是小松树或藓类。",
        "action": {
          "kind": "morphology",
          "regionId": "yunnan"
        }
      },
      {
        "title": "环境机制",
        "text": "匍匐茎延展，小叶和孢子囊穗形成可识别结构。 湿润林缘与山地的光、表土和竞争影响其建立，孢子传播到达与长期形成群体并非同一步。 湿润林缘与山地环境 分布涉及温带与热带山地，不能据此给出单一温度最适值。 湿润林缘及山地小生境是理解重点。 微地形和地表水流影响局部生境。 名字含“松”和英文“moss”，都不意味着它属于松树或藓类。",
        "action": {
          "kind": "environment",
          "regionId": "yunnan"
        }
      },
      {
        "title": "地区证据",
        "text": "以中国云南山地作为地区案例。NASA POWER 2001–2025格点：最冷月1月，月均温6.8°C；最暖月6月，月均温19.8°C。这是气候格点背景；湿润林缘与山地的光、表土和竞争影响其建立，孢子传播到达与长期形成群体并非同一步。地图采样点不证明该处有这一物种。",
        "action": {
          "kind": "region",
          "regionId": "yunnan"
        }
      }
    ],
    "regionRole": "regional-context",
    "substrateKind": "terrestrial",
    "substrateNote": "可见于林缘、坡面或道路旁的林地基质。 微地形和地表水流影响局部生境。 土壤栅格是区域背景，不是根旁取样；酸碱度不能单独证明排水或养分足够。",
    "soilCaution": "可见于林缘、坡面或道路旁的林地基质。 微地形和地表水流影响局部生境。 土壤栅格是区域背景，不是根旁取样；酸碱度不能单独证明排水或养分足够。"
  },
  {
    "id": "resurrection",
    "cropId": "resurrection",
    "name": "鳞叶卷柏",
    "latin": "Selaginella lepidophylla",
    "pathId": "dryland-strategies",
    "group": "蕨类与石松",
    "definition": "鳞叶卷柏是少数适应干旱环境的卷柏类植物。枝条随失水卷曲，复水可舒展；机械展开与生命活动恢复应分开观察。",
    "organs": "鳞叶卷柏失水时枝条卷曲，复水时可舒展；这是有维管组织的石松类植物，不是会开花的玫瑰。",
    "adaptations": "内外枝条水分响应差异形成卷曲运动。",
    "environment": "忍受一定失水与避免失水是两种策略；机械舒展也不自动证明全部细胞恢复、长出新组织或能无限循环。 干湿交替的岩石环境 环境温度与干湿过程共同作用，不从荒漠分布推导耐热极限。 活跃生长仍需要水分。 排水与干湿变化不能替换为长期浸泡。",
    "misconception": "“复活草”是俗名；它不是永远不死，也不是会开花的玫瑰。",
    "regionId": "chihuahua",
    "region": {
      "id": "chihuahua",
      "name": "墨西哥奇瓦瓦荒漠",
      "lon": -104,
      "lat": 29,
      "pointMeaning": "地区教学采样点，不是物种观测点、植物精确位置或全地区平均。"
    },
    "rootzone": "soil",
    "evidenceChecks": {
      "climate": "先比较十二个月的温度与降水率，区分生长季、冷季和干湿季。空气格点气温不是水温或叶面温度。",
      "soil": "原生生境常关联干旱岩石表面与缝隙。 排水与干湿变化不能替换为长期浸泡。 土壤栅格是区域背景，不是根旁取样；酸碱度不能单独证明排水或养分足够。",
      "water": "活跃生长仍需要水分。 耐脱水不意味着持续缺水也能积累生物量。 降雨与可用水不同，需结合供水位置、季节和排水。"
    },
    "caseText": "以墨西哥奇瓦瓦荒漠作为地区案例。NASA POWER 2001–2025格点：最冷月1月，月均温9.9°C；最暖月6月，月均温28.7°C。这是气候格点背景；忍受一定失水与避免失水是两种策略；机械舒展也不自动证明全部细胞恢复、长出新组织或能无限循环。地图采样点不证明该处有这一物种。",
    "question": {
      "id": "bio-check-resurrection",
      "title": "鳞叶卷柏 · 想一想",
      "prompt": "干卷柏遇水展开后，能立刻证明整株已恢复并能永远不死吗？",
      "options": [
        "不能；展开动作与生理恢复、后续生长要分开验证。",
        "能；枝条打开就足以证明整株所有组织健康。",
        "能；耐失水表示生长完全不需要水。"
      ],
      "correctIndex": 0,
      "feedback": [
        "形态运动可能由组织吸水驱动；存活与持续生长需要另外的证据和合适的湿润窗口。",
        "这个判断忽略了器官、出现方式或水热条件中的关键差别。形态运动可能由组织吸水驱动；存活与持续生长需要另外的证据和合适的湿润窗口。",
        "不能从名称、外观或一次记录跳到这个结论。形态运动可能由组织吸水驱动；存活与持续生长需要另外的证据和合适的湿润窗口。"
      ],
      "explanation": "形态运动可能由组织吸水驱动；存活与持续生长需要另外的证据和合适的湿润窗口。",
      "nextHint": "回到器官图和地区证据，分别说出一条已知事实与一条还需要当地核对的信息。",
      "sources": [
        {
          "title": "WFO：鳞叶卷柏",
          "url": "https://www.worldfloraonline.org/taxon/wfo-0001109651",
          "supports": "学名与包括墨西哥、得克萨斯在内的地区分布。"
        },
        {
          "title": "牛津大学：卷柏类",
          "url": "https://herbaria.plants.ox.ac.uk/bol/plants400/Profiles/st/selaginella",
          "supports": "石松类背景与鳞叶卷柏在奇瓦瓦荒漠的特殊生态。"
        },
        {
          "title": "研究论文：鳞叶卷柏的水响应卷曲",
          "url": "https://arxiv.org/abs/1703.01052",
          "supports": "干湿响应和枝条卷曲的生物力学；不当作所有个体存活保证。"
        },
        {
          "title": "NASA POWER：墨西哥奇瓦瓦荒漠气候格点，2001–2025",
          "url": "https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M%2CPRECTOTCORR&community=AG&longitude=-104&latitude=29&format=JSON",
          "supports": "该采样格点十二个月的气温与平均日降水率；不是树旁、林内、水下或整地区实测。"
        }
      ]
    },
    "sources": [
      {
        "title": "WFO：鳞叶卷柏",
        "url": "https://www.worldfloraonline.org/taxon/wfo-0001109651",
        "supports": "学名与包括墨西哥、得克萨斯在内的地区分布。"
      },
      {
        "title": "牛津大学：卷柏类",
        "url": "https://herbaria.plants.ox.ac.uk/bol/plants400/Profiles/st/selaginella",
        "supports": "石松类背景与鳞叶卷柏在奇瓦瓦荒漠的特殊生态。"
      },
      {
        "title": "研究论文：鳞叶卷柏的水响应卷曲",
        "url": "https://arxiv.org/abs/1703.01052",
        "supports": "干湿响应和枝条卷曲的生物力学；不当作所有个体存活保证。"
      },
      {
        "title": "NASA POWER：墨西哥奇瓦瓦荒漠气候格点，2001–2025",
        "url": "https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M%2CPRECTOTCORR&community=AG&longitude=-104&latitude=29&format=JSON",
        "supports": "该采样格点十二个月的气温与平均日降水率；不是树旁、林内、水下或整地区实测。"
      }
    ],
    "steps": [
      {
        "title": "认识形态",
        "text": "鳞叶卷柏是少数适应干旱环境的卷柏类植物。枝条随失水卷曲，复水可舒展；机械展开与生命活动恢复应分开观察。 鳞叶卷柏失水时枝条卷曲，复水时可舒展；这是有维管组织的石松类植物，不是会开花的玫瑰。",
        "action": {
          "kind": "morphology",
          "regionId": "chihuahua"
        }
      },
      {
        "title": "环境机制",
        "text": "内外枝条水分响应差异形成卷曲运动。 忍受一定失水与避免失水是两种策略；机械舒展也不自动证明全部细胞恢复、长出新组织或能无限循环。 干湿交替的岩石环境 环境温度与干湿过程共同作用，不从荒漠分布推导耐热极限。 活跃生长仍需要水分。 排水与干湿变化不能替换为长期浸泡。 “复活草”是俗名；它不是永远不死，也不是会开花的玫瑰。",
        "action": {
          "kind": "environment",
          "regionId": "chihuahua"
        }
      },
      {
        "title": "地区证据",
        "text": "以墨西哥奇瓦瓦荒漠作为地区案例。NASA POWER 2001–2025格点：最冷月1月，月均温9.9°C；最暖月6月，月均温28.7°C。这是气候格点背景；忍受一定失水与避免失水是两种策略；机械舒展也不自动证明全部细胞恢复、长出新组织或能无限循环。地图采样点不证明该处有这一物种。",
        "action": {
          "kind": "region",
          "regionId": "chihuahua"
        }
      }
    ],
    "regionRole": "regional-context",
    "substrateKind": "terrestrial",
    "substrateNote": "原生生境常关联干旱岩石表面与缝隙。 排水与干湿变化不能替换为长期浸泡。 土壤栅格是区域背景，不是根旁取样；酸碱度不能单独证明排水或养分足够。",
    "soilCaution": "原生生境常关联干旱岩石表面与缝隙。 排水与干湿变化不能替换为长期浸泡。 土壤栅格是区域背景，不是根旁取样；酸碱度不能单独证明排水或养分足够。"
  },
  {
    "id": "sphagnum",
    "cropId": "sphagnum",
    "name": "泥炭藓",
    "latin": "Sphagnum palustre",
    "pathId": "spores-microhabitats",
    "group": "苔藓植物",
    "definition": "本种泥炭藓可形成疏松垫状群落，见于湿林、沟缘和湿草地。它较耐遮阴，并非所有泥炭藓都只适合极酸、极贫营养的开阔泥炭地。",
    "organs": "枝叶形成疏松垫状群落；泥炭藓属的蓄水透明细胞与绿色活细胞分工不同，识种常需显微特征。",
    "adaptations": "泥炭藓属的透明蓄水细胞与绿色活细胞分工不同。",
    "environment": "持续湿润和排水状况十分重要；本种可见于湿林与沟缘，不应把全部泥炭藓都归为同一种极酸泥炭沼。 湿林、沟缘与稳定湿润微环境 近地表湿度与水位比一个年均温数字更能解释该生境。 植株与群落结构能够储存水分。 人为排水会改变原来的水分联系。",
    "misconception": "看到泥炭藓不能仅凭颜色确定种，许多近缘种需要显微特征。",
    "regionId": "scotland-wetland",
    "region": {
      "id": "scotland-wetland",
      "name": "英国苏格兰湿地",
      "lon": -4.2,
      "lat": 57.2,
      "pointMeaning": "地区教学采样点，不是物种观测点、植物精确位置或全地区平均。"
    },
    "rootzone": "microhabitat",
    "evidenceChecks": {
      "climate": "先比较十二个月的温度与降水率，区分生长季、冷季和干湿季。空气格点气温不是水温或叶面温度。",
      "soil": "湿润泥炭质坡岸和林地基质均有记录。 人为排水会改变原来的水分联系。 土壤栅格是区域背景，不是根旁取样；酸碱度不能单独证明排水或养分足够。 岩缝、苔藓垫和裸土表面的微生境需另行调查。",
      "water": "植株与群落结构能够储存水分。 能够保水不等于可长期离开水分补给。 降雨与可用水不同，需结合供水位置、季节和排水。"
    },
    "caseText": "以英国苏格兰湿地作为地区案例。NASA POWER 2001–2025格点：最冷月2月，月均温0.5°C；最暖月7月，月均温11.8°C。这是气候格点背景；持续湿润和排水状况十分重要；本种可见于湿林与沟缘，不应把全部泥炭藓都归为同一种极酸泥炭沼。地图采样点不证明该处有这一物种。",
    "question": {
      "id": "bio-check-sphagnum",
      "title": "泥炭藓 · 想一想",
      "prompt": "看到绿色泥炭藓垫，能直接认定是本种且水文都相同吗？",
      "options": [
        "泥炭藓能蓄水，所以湿地被排干后也不会受影响。",
        "不能；识种需特征，生境还要看水位、遮阴和排水。",
        "能；颜色相近就能准确鉴定所有泥炭藓。"
      ],
      "correctIndex": 1,
      "feedback": [
        "不能从名称、外观或一次记录跳到这个结论。蓄水结构不意味着能抵消持续排水；物种鉴定、土壤碳储量与湿地水位也不是同一证据。",
        "蓄水结构不意味着能抵消持续排水；物种鉴定、土壤碳储量与湿地水位也不是同一证据。",
        "这个判断忽略了器官、出现方式或水热条件中的关键差别。蓄水结构不意味着能抵消持续排水；物种鉴定、土壤碳储量与湿地水位也不是同一证据。"
      ],
      "explanation": "蓄水结构不意味着能抵消持续排水；物种鉴定、土壤碳储量与湿地水位也不是同一证据。",
      "nextHint": "回到器官图和地区证据，分别说出一条已知事实与一条还需要当地核对的信息。",
      "sources": [
        {
          "title": "BBS图谱：Sphagnum palustre",
          "url": "https://www.britishbryologicalsociety.org.uk/wp-content/uploads/2020/12/Atlas-of-British-and-Irish-Bryophytes-V1-364.pdf",
          "supports": "英国、爱尔兰记录及湿林、沟缘、遮阴和相对酸度生态。"
        },
        {
          "title": "BBS野外手册：泥炭藓",
          "url": "https://www.britishbryologicalsociety.org.uk/wp-content/uploads/2020/12/Sphagnum-palustre.pdf",
          "supports": "本种外形、近缘种比较及需显微鉴别的限制。"
        },
        {
          "title": "奥克兰大学：泥炭藓属结构",
          "url": "https://www.nzplants.auckland.ac.nz/en/about/mosses/native-species/sphagnaceae/sphagnum-species.html",
          "supports": "属级枝簇与透明蓄水细胞；不用于推算本种全球气候阈值。"
        },
        {
          "title": "NASA POWER：英国苏格兰湿地气候格点，2001–2025",
          "url": "https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M%2CPRECTOTCORR&community=AG&longitude=-4.2&latitude=57.2&format=JSON",
          "supports": "该采样格点十二个月的气温与平均日降水率；不是树旁、林内、水下或整地区实测。"
        }
      ]
    },
    "sources": [
      {
        "title": "BBS图谱：Sphagnum palustre",
        "url": "https://www.britishbryologicalsociety.org.uk/wp-content/uploads/2020/12/Atlas-of-British-and-Irish-Bryophytes-V1-364.pdf",
        "supports": "英国、爱尔兰记录及湿林、沟缘、遮阴和相对酸度生态。"
      },
      {
        "title": "BBS野外手册：泥炭藓",
        "url": "https://www.britishbryologicalsociety.org.uk/wp-content/uploads/2020/12/Sphagnum-palustre.pdf",
        "supports": "本种外形、近缘种比较及需显微鉴别的限制。"
      },
      {
        "title": "奥克兰大学：泥炭藓属结构",
        "url": "https://www.nzplants.auckland.ac.nz/en/about/mosses/native-species/sphagnaceae/sphagnum-species.html",
        "supports": "属级枝簇与透明蓄水细胞；不用于推算本种全球气候阈值。"
      },
      {
        "title": "NASA POWER：英国苏格兰湿地气候格点，2001–2025",
        "url": "https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M%2CPRECTOTCORR&community=AG&longitude=-4.2&latitude=57.2&format=JSON",
        "supports": "该采样格点十二个月的气温与平均日降水率；不是树旁、林内、水下或整地区实测。"
      }
    ],
    "steps": [
      {
        "title": "认识形态",
        "text": "本种泥炭藓可形成疏松垫状群落，见于湿林、沟缘和湿草地。它较耐遮阴，并非所有泥炭藓都只适合极酸、极贫营养的开阔泥炭地。 枝叶形成疏松垫状群落；泥炭藓属的蓄水透明细胞与绿色活细胞分工不同，识种常需显微特征。",
        "action": {
          "kind": "morphology",
          "regionId": "scotland-wetland"
        }
      },
      {
        "title": "环境机制",
        "text": "泥炭藓属的透明蓄水细胞与绿色活细胞分工不同。 持续湿润和排水状况十分重要；本种可见于湿林与沟缘，不应把全部泥炭藓都归为同一种极酸泥炭沼。 湿林、沟缘与稳定湿润微环境 近地表湿度与水位比一个年均温数字更能解释该生境。 植株与群落结构能够储存水分。 人为排水会改变原来的水分联系。 看到泥炭藓不能仅凭颜色确定种，许多近缘种需要显微特征。",
        "action": {
          "kind": "environment",
          "regionId": "scotland-wetland"
        }
      },
      {
        "title": "地区证据",
        "text": "以英国苏格兰湿地作为地区案例。NASA POWER 2001–2025格点：最冷月2月，月均温0.5°C；最暖月7月，月均温11.8°C。这是气候格点背景；持续湿润和排水状况十分重要；本种可见于湿林与沟缘，不应把全部泥炭藓都归为同一种极酸泥炭沼。地图采样点不证明该处有这一物种。",
        "action": {
          "kind": "region",
          "regionId": "scotland-wetland"
        }
      }
    ],
    "regionRole": "regional-context",
    "substrateKind": "peat",
    "substrateNote": "湿润泥炭质坡岸和林地基质均有记录。 人为排水会改变原来的水分联系。 土壤栅格是区域背景，不是根旁取样；酸碱度不能单独证明排水或养分足够。 岩缝、苔藓垫和裸土表面的微生境需另行调查。",
    "soilCaution": "湿润泥炭质坡岸和林地基质均有记录。 人为排水会改变原来的水分联系。 土壤栅格是区域背景，不是根旁取样；酸碱度不能单独证明排水或养分足够。 岩缝、苔藓垫和裸土表面的微生境需另行调查。"
  },
  {
    "id": "liverwort",
    "cropId": "liverwort",
    "name": "地钱",
    "latin": "Marchantia polymorpha",
    "pathId": "spores-microhabitats",
    "group": "苔藓植物",
    "definition": "地钱是扁平叶状体的苔类，常见胞芽杯与伞状生殖托。种内不同亚种分别偏向人类扰动地、水道岩面或山地，不能只用一张环境标签概括。",
    "organs": "扁平叶状体上可有胞芽杯和伞状生殖托；小伞不是花，叶状体也不是普通维管植物的一片叶。",
    "adaptations": "胞芽杯与生殖托让小型叶状体有多种繁殖途径。",
    "environment": "湿润裸地、沟旁或人工扰动面可提供空间，种内亚种偏好不同；表面湿润的持续时长仍需观察。 湿润裸地与岩面 广泛分布不提供统一温度最适范围，应结合亚种与微环境。 表面水分对叶状体状态十分重要。 不同亚种对周期淹水与排水的关系不同。",
    "misconception": "地钱的小伞不是花，扁平叶状体也不是普通植物的一片叶。",
    "regionId": "uk-lowland",
    "region": {
      "id": "uk-lowland",
      "name": "英国低地林地与淡水环境",
      "lon": -1,
      "lat": 52,
      "pointMeaning": "地区教学采样点，不是物种观测点、植物精确位置或全地区平均。"
    },
    "rootzone": "microhabitat",
    "evidenceChecks": {
      "climate": "先比较十二个月的温度与降水率，区分生长季、冷季和干湿季。空气格点气温不是水温或叶面温度。",
      "soil": "可生于湿土、岩面和其他适宜附着面。 不同亚种对周期淹水与排水的关系不同。 土壤栅格是区域背景，不是根旁取样；酸碱度不能单独证明排水或养分足够。 岩缝、苔藓垫和裸土表面的微生境需另行调查。",
      "water": "表面水分对叶状体状态十分重要。 干后复水不一定能完整恢复原有状态。 降雨与可用水不同，需结合供水位置、季节和排水。"
    },
    "caseText": "以英国低地林地与淡水环境作为地区案例。NASA POWER 2001–2025格点：最冷月1月，月均温3.7°C；最暖月7月，月均温17.1°C。这是气候格点背景；湿润裸地、沟旁或人工扰动面可提供空间，种内亚种偏好不同；表面湿润的持续时长仍需观察。地图采样点不证明该处有这一物种。",
    "question": {
      "id": "bio-check-liverwort",
      "title": "地钱 · 想一想",
      "prompt": "地钱的小伞和胞芽杯说明什么？",
      "options": [
        "小伞是花，所以地钱是一株缩小的开花植物。",
        "出现过地钱就证明裸土全年同样湿润。",
        "它有不同繁殖结构，不能把小伞当花或把叶状体当单叶。"
      ],
      "correctIndex": 2,
      "feedback": [
        "这个判断忽略了器官、出现方式或水热条件中的关键差别。结构帮助区分苔类；一次出现或地区降雨不能确定基质表面在全年都保持相同状态。",
        "不能从名称、外观或一次记录跳到这个结论。结构帮助区分苔类；一次出现或地区降雨不能确定基质表面在全年都保持相同状态。",
        "结构帮助区分苔类；一次出现或地区降雨不能确定基质表面在全年都保持相同状态。"
      ],
      "explanation": "结构帮助区分苔类；一次出现或地区降雨不能确定基质表面在全年都保持相同状态。",
      "nextHint": "回到器官图和地区证据，分别说出一条已知事实与一条还需要当地核对的信息。",
      "sources": [
        {
          "title": "BBS：地钱",
          "url": "https://www.bibsbryology.org/learning/species-finder/marchantia-polymorpha/",
          "supports": "苔类分类、英国亚种、分布与微环境差异、干燥恢复限制。"
        },
        {
          "title": "奥克兰大学：地钱",
          "url": "https://www.nzplants.auckland.ac.nz/en/about/liverworts/some-non-leafy-liverworts/Marchantiaceae/Marchantia-polymorpha.html",
          "supports": "地钱科、胞芽杯和生殖托结构，以及新西兰湿土与岩面分布。"
        },
        {
          "title": "NASA POWER：英国低地林地与淡水环境气候格点，2001–2025",
          "url": "https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M%2CPRECTOTCORR&community=AG&longitude=-1&latitude=52&format=JSON",
          "supports": "该采样格点十二个月的气温与平均日降水率；不是树旁、林内、水下或整地区实测。"
        }
      ]
    },
    "sources": [
      {
        "title": "BBS：地钱",
        "url": "https://www.bibsbryology.org/learning/species-finder/marchantia-polymorpha/",
        "supports": "苔类分类、英国亚种、分布与微环境差异、干燥恢复限制。"
      },
      {
        "title": "奥克兰大学：地钱",
        "url": "https://www.nzplants.auckland.ac.nz/en/about/liverworts/some-non-leafy-liverworts/Marchantiaceae/Marchantia-polymorpha.html",
        "supports": "地钱科、胞芽杯和生殖托结构，以及新西兰湿土与岩面分布。"
      },
      {
        "title": "NASA POWER：英国低地林地与淡水环境气候格点，2001–2025",
        "url": "https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M%2CPRECTOTCORR&community=AG&longitude=-1&latitude=52&format=JSON",
        "supports": "该采样格点十二个月的气温与平均日降水率；不是树旁、林内、水下或整地区实测。"
      }
    ],
    "steps": [
      {
        "title": "认识形态",
        "text": "地钱是扁平叶状体的苔类，常见胞芽杯与伞状生殖托。种内不同亚种分别偏向人类扰动地、水道岩面或山地，不能只用一张环境标签概括。 扁平叶状体上可有胞芽杯和伞状生殖托；小伞不是花，叶状体也不是普通维管植物的一片叶。",
        "action": {
          "kind": "morphology",
          "regionId": "uk-lowland"
        }
      },
      {
        "title": "环境机制",
        "text": "胞芽杯与生殖托让小型叶状体有多种繁殖途径。 湿润裸地、沟旁或人工扰动面可提供空间，种内亚种偏好不同；表面湿润的持续时长仍需观察。 湿润裸地与岩面 广泛分布不提供统一温度最适范围，应结合亚种与微环境。 表面水分对叶状体状态十分重要。 不同亚种对周期淹水与排水的关系不同。 地钱的小伞不是花，扁平叶状体也不是普通植物的一片叶。",
        "action": {
          "kind": "environment",
          "regionId": "uk-lowland"
        }
      },
      {
        "title": "地区证据",
        "text": "以英国低地林地与淡水环境作为地区案例。NASA POWER 2001–2025格点：最冷月1月，月均温3.7°C；最暖月7月，月均温17.1°C。这是气候格点背景；湿润裸地、沟旁或人工扰动面可提供空间，种内亚种偏好不同；表面湿润的持续时长仍需观察。地图采样点不证明该处有这一物种。",
        "action": {
          "kind": "region",
          "regionId": "uk-lowland"
        }
      }
    ],
    "regionRole": "regional-context",
    "substrateKind": "terrestrial",
    "substrateNote": "可生于湿土、岩面和其他适宜附着面。 不同亚种对周期淹水与排水的关系不同。 土壤栅格是区域背景，不是根旁取样；酸碱度不能单独证明排水或养分足够。 岩缝、苔藓垫和裸土表面的微生境需另行调查。",
    "soilCaution": "可生于湿土、岩面和其他适宜附着面。 不同亚种对周期淹水与排水的关系不同。 土壤栅格是区域背景，不是根旁取样；酸碱度不能单独证明排水或养分足够。 岩缝、苔藓垫和裸土表面的微生境需另行调查。"
  },
  {
    "id": "hornwort",
    "cropId": "hornwort",
    "name": "田野角苔",
    "latin": "Anthoceros agrestis",
    "pathId": "spores-microhabitats",
    "group": "苔藓植物",
    "definition": "田野角苔在湿润裸土上形成小型叶状体，向上长出的角是孢子体。它与苔类、藓类是不同类群，和近似角苔的区分常需显微观察。",
    "organs": "小型叶状体上长出的细角是孢子体；角苔、苔类与藓类是不同类群，精确识种往往需显微观察。",
    "adaptations": "孢子库可能使其在合适年份重新出现。",
    "environment": "适时湿润而又保持裸露的土面有利于出现；孢子库和扰动时间使可见植株随季节与年份变化。 湿润裸露壤土与足够生长窗口 英国资料描述为夏季一年生，不能据此给全世界统一播期。 保水的壤土或黏土维持短生命周期的水分条件。 裸地与水分联系重要，不是永久水生植物。",
    "misconception": "有角状孢子体可认出角苔类，却不能仅凭肉眼可靠定到这个种。",
    "regionId": "uk-lowland",
    "region": {
      "id": "uk-lowland",
      "name": "英国低地林地与淡水环境",
      "lon": -1,
      "lat": 52,
      "pointMeaning": "地区教学采样点，不是物种观测点、植物精确位置或全地区平均。"
    },
    "rootzone": "microhabitat",
    "evidenceChecks": {
      "climate": "先比较十二个月的温度与降水率，区分生长季、冷季和干湿季。空气格点气温不是水温或叶面温度。",
      "soil": "偏向湿润裸露且保水的细质地土面。 裸地与水分联系重要，不是永久水生植物。 土壤栅格是区域背景，不是根旁取样；酸碱度不能单独证明排水或养分足够。 岩缝、苔藓垫和裸土表面的微生境需另行调查。",
      "water": "保水的壤土或黏土维持短生命周期的水分条件。 一场降雨不保证能完成整个繁殖过程。 降雨与可用水不同，需结合供水位置、季节和排水。"
    },
    "caseText": "以英国低地林地与淡水环境作为地区案例。NASA POWER 2001–2025格点：最冷月1月，月均温3.7°C；最暖月7月，月均温17.1°C。这是气候格点背景；适时湿润而又保持裸露的土面有利于出现；孢子库和扰动时间使可见植株随季节与年份变化。地图采样点不证明该处有这一物种。",
    "question": {
      "id": "bio-check-hornwort",
      "title": "田野角苔 · 想一想",
      "prompt": "田野角苔某年没有被看到，能直接断定当地从来没有吗？",
      "options": [
        "不能；还需结合季节、孢子库、裸土与调查方法。",
        "能；任何一次未看到都等于长期缺失。",
        "角状结构一定是花，能像花色一样直接定种。"
      ],
      "correctIndex": 0,
      "feedback": [
        "短暂出现与隐存孢子使调查时机重要；粗气候格点不能替代裸土地表的连续观察。",
        "这个判断忽略了器官、出现方式或水热条件中的关键差别。短暂出现与隐存孢子使调查时机重要；粗气候格点不能替代裸土地表的连续观察。",
        "不能从名称、外观或一次记录跳到这个结论。短暂出现与隐存孢子使调查时机重要；粗气候格点不能替代裸土地表的连续观察。"
      ],
      "explanation": "短暂出现与隐存孢子使调查时机重要；粗气候格点不能替代裸土地表的连续观察。",
      "nextHint": "回到器官图和地区证据，分别说出一条已知事实与一条还需要当地核对的信息。",
      "sources": [
        {
          "title": "BBS：田野角苔",
          "url": "https://www.bibsbryology.org/learning/species-finder/anthoceros-agrestis/",
          "supports": "角苔类归属、短生命周期、湿润耕地与鉴别要求。"
        },
        {
          "title": "BBS图谱：Anthoceros agrestis",
          "url": "https://www.britishbryologicalsociety.org.uk/wp-content/uploads/2020/12/Atlas-of-British-and-Irish-Bryophytes-V1-55.pdf",
          "supports": "英国与瑞士资料、细质地土壤、繁殖季节和翻耕影响。"
        },
        {
          "title": "BBS角苔鉴别页",
          "url": "https://www.britishbryologicalsociety.org.uk/wp-content/uploads/2020/12/Anthoceros-punctatus-agrestis.pdf",
          "supports": "角状孢子体、相似种及显微鉴别边界。"
        },
        {
          "title": "北爱尔兰博物馆 HABITAS：Field hornwort",
          "url": "https://www.habitas.org.uk/priority/species.asp?item=36062",
          "supports": "裸土、湿润、短生活史和可能长寿的孢子库；非单次调查即可判缺失"
        },
        {
          "title": "NASA POWER：英国低地林地与淡水环境气候格点，2001–2025",
          "url": "https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M%2CPRECTOTCORR&community=AG&longitude=-1&latitude=52&format=JSON",
          "supports": "该采样格点十二个月的气温与平均日降水率；不是树旁、林内、水下或整地区实测。"
        }
      ]
    },
    "sources": [
      {
        "title": "BBS：田野角苔",
        "url": "https://www.bibsbryology.org/learning/species-finder/anthoceros-agrestis/",
        "supports": "角苔类归属、短生命周期、湿润耕地与鉴别要求。"
      },
      {
        "title": "BBS图谱：Anthoceros agrestis",
        "url": "https://www.britishbryologicalsociety.org.uk/wp-content/uploads/2020/12/Atlas-of-British-and-Irish-Bryophytes-V1-55.pdf",
        "supports": "英国与瑞士资料、细质地土壤、繁殖季节和翻耕影响。"
      },
      {
        "title": "BBS角苔鉴别页",
        "url": "https://www.britishbryologicalsociety.org.uk/wp-content/uploads/2020/12/Anthoceros-punctatus-agrestis.pdf",
        "supports": "角状孢子体、相似种及显微鉴别边界。"
      },
      {
        "title": "北爱尔兰博物馆 HABITAS：Field hornwort",
        "url": "https://www.habitas.org.uk/priority/species.asp?item=36062",
        "supports": "裸土、湿润、短生活史和可能长寿的孢子库；非单次调查即可判缺失"
      },
      {
        "title": "NASA POWER：英国低地林地与淡水环境气候格点，2001–2025",
        "url": "https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M%2CPRECTOTCORR&community=AG&longitude=-1&latitude=52&format=JSON",
        "supports": "该采样格点十二个月的气温与平均日降水率；不是树旁、林内、水下或整地区实测。"
      }
    ],
    "steps": [
      {
        "title": "认识形态",
        "text": "田野角苔在湿润裸土上形成小型叶状体，向上长出的角是孢子体。它与苔类、藓类是不同类群，和近似角苔的区分常需显微观察。 小型叶状体上长出的细角是孢子体；角苔、苔类与藓类是不同类群，精确识种往往需显微观察。",
        "action": {
          "kind": "morphology",
          "regionId": "uk-lowland"
        }
      },
      {
        "title": "环境机制",
        "text": "孢子库可能使其在合适年份重新出现。 适时湿润而又保持裸露的土面有利于出现；孢子库和扰动时间使可见植株随季节与年份变化。 湿润裸露壤土与足够生长窗口 英国资料描述为夏季一年生，不能据此给全世界统一播期。 保水的壤土或黏土维持短生命周期的水分条件。 裸地与水分联系重要，不是永久水生植物。 有角状孢子体可认出角苔类，却不能仅凭肉眼可靠定到这个种。",
        "action": {
          "kind": "environment",
          "regionId": "uk-lowland"
        }
      },
      {
        "title": "地区证据",
        "text": "以英国低地林地与淡水环境作为地区案例。NASA POWER 2001–2025格点：最冷月1月，月均温3.7°C；最暖月7月，月均温17.1°C。这是气候格点背景；适时湿润而又保持裸露的土面有利于出现；孢子库和扰动时间使可见植株随季节与年份变化。地图采样点不证明该处有这一物种。",
        "action": {
          "kind": "region",
          "regionId": "uk-lowland"
        }
      }
    ],
    "regionRole": "regional-context",
    "substrateKind": "terrestrial",
    "substrateNote": "偏向湿润裸露且保水的细质地土面。 裸地与水分联系重要，不是永久水生植物。 土壤栅格是区域背景，不是根旁取样；酸碱度不能单独证明排水或养分足够。 岩缝、苔藓垫和裸土表面的微生境需另行调查。",
    "soilCaution": "偏向湿润裸露且保水的细质地土面。 裸地与水分联系重要，不是永久水生植物。 土壤栅格是区域背景，不是根旁取样；酸碱度不能单独证明排水或养分足够。 岩缝、苔藓垫和裸土表面的微生境需另行调查。"
  }
]);
export const biodiversityCourseFor=id=>BIODIVERSITY_COURSES.find(c=>c.id===id)||null;
