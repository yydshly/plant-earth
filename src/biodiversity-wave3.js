// Four reviewed ecosystem contrasts; public evidence is in sources/expansion-wave3.json.
export const WAVE3_PATH={"id": "ecosystem-contrasts", "title": "从草原到雨林、苔原与城市", "intro": "沿四个真实地区，比较草丛、高大乔木、贴地灌木和园林树木。把季节、根区、水源与干扰连成解释，而不是只给植物贴一个气候标签。", "courseIds": ["themeda", "wangtianshu", "arcticwillow", "camphor"]};
export const WAVE3_COURSES=[
  {
    "id": "themeda",
    "name": "红草（Themeda triandra）",
    "latin": "Themeda triandra",
    "group": "草原与稀树草原",
    "definition": "一种多年生丛生禾草，叶丛与疏展、带长芒的小穗构成识别线索。它能成为草地的重要成员，放牧与火后的恢复会改变当地优势程度。",
    "organs": "叶片集中成丛，细长花秆上有成组、常下垂的小穗和弯折长芒；成熟草丛可转红褐色。模型放大了小穗和芒，不是现场草地密度。",
    "environment": "草地的形成不只取决于雨量。生长季供水支持抽叶，季节转冷或转干会改变活跃生长；火能移除积累的枯草，但火后需要恢复时间。反复过度采食会减少植株恢复的机会。",
    "adaptations": "丛生的多年生结构允许植株在合适条件下再次抽叶；这种再生能力有条件，不能抵消连续强度过高的放牧。比较火、季节和休养时间，比把它简单称为耐旱草更有解释力。",
    "misconception": "看到火后返青，不能推出燃烧越频繁越好，也不能推出可以连续重度放牧。",
    "regionRole": "documented-habitat",
    "evidenceChecks": {
      "climate": "比较高地暖季与冷季，月均温不等于霜冻日数。",
      "soil": "质地和酸碱度是表层模型背景，不测量草丛根区的实时水分。",
      "water": "草地根系主要利用土壤水；火与放牧还会改变恢复过程。"
    },
    "cropId": "themeda",
    "pathId": "ecosystem-contrasts",
    "regionId": "golden-gate",
    "region": {
      "id": "golden-gate",
      "name": "南非金门高地草原",
      "lon": 28.63,
      "lat": -28.51,
      "pointMeaning": "编辑选择的地区环境教学位置，不是单株、样方或完整生境边界。"
    },
    "rootzone": "soil",
    "caseText": "南非金门高地草原气候格点（2001–2025）：最冷月7月均温5.5°C，最暖月1月均温17.8°C。南非国家公园资料明确记载金门高地的这种草。我们用教学点查看当地格点气候，并不把整个公园看成同一块草地。再对照澳大利亚的记录，会发现同一种草分布很广，具体花期与管理背景仍然不同。",
    "question": {
      "id": "bio-check-themeda",
      "title": "红草（Themeda triandra） · 想一想",
      "prompt": "看到红草在火后重新变绿，哪种解释更稳妥？",
      "options": [
        "说明火越频繁越好，还可以持续重度放牧。",
        "还要核对季节水分、火后休养与采食强度。",
        "只要土表没有蓝色水面，就说明根系没有水。"
      ],
      "correctIndex": 1,
      "explanation": "返青说明一次恢复过程；恢复是否持续仍受季节、水分和采食强度影响。土壤水与开阔地表水不是同一指标。",
      "feedback": [
        "请把形态、环境证据和记录范围分开。返青说明一次恢复过程；恢复是否持续仍受季节、水分和采食强度影响。土壤水与开阔地表水不是同一指标。",
        "返青说明一次恢复过程；恢复是否持续仍受季节、水分和采食强度影响。土壤水与开阔地表水不是同一指标。",
        "请把形态、环境证据和记录范围分开。返青说明一次恢复过程；恢复是否持续仍受季节、水分和采食强度影响。土壤水与开阔地表水不是同一指标。"
      ],
      "nextHint": "指出一条已知证据，再说明一项需要当地核对的条件。",
      "sources": [
        {
          "title": "Kew WCVP第16版：红草（Themeda triandra）",
          "url": "https://powo.science.kew.org/taxon/urn:lsid:ipni.org:names:424213-1",
          "supports": "接受学名、生活型及粗植物地理区记录；不是连续覆盖或田块适生预测。"
        },
        {
          "title": "SANBI：Themeda triandra",
          "url": "https://pza.sanbi.org/themeda-triandra",
          "supports": "多年生丛生形态、小穗和芒；生境、放牧及火后休养条件。"
        },
        {
          "title": "SANParks：金门高地草原",
          "url": "https://www.sanparks.org/parks/golden-gate-highlands/explore/fauna-flora/vegetation/grasses",
          "supports": "公园内的红草、草地季节外观，以及火和过度放牧的影响。"
        },
        {
          "title": "澳大利亚新南威尔士州：Kangaroo grass",
          "url": "https://www.dpird.nsw.gov.au/agriculture/pastures-and-rangelands/rangelands/publications-and-information/grassedup/species/kangaroo-grass",
          "supports": "澳大利亚形态、生境与持续放牧限制；不将当地花期视为全球统一花期。"
        },
        {
          "title": "NASA POWER：南非金门高地草原气候格点，2001–2025",
          "url": "https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M%2CPRECTOTCORR&community=AG&longitude=28.63&latitude=-28.51&format=JSON",
          "supports": "十二个月的平均空气温度与降水率；地区背景，不是林内、树冠或单株观测。"
        }
      ]
    },
    "sources": [
      {
        "title": "Kew WCVP第16版：红草（Themeda triandra）",
        "url": "https://powo.science.kew.org/taxon/urn:lsid:ipni.org:names:424213-1",
        "supports": "接受学名、生活型及粗植物地理区记录；不是连续覆盖或田块适生预测。"
      },
      {
        "title": "SANBI：Themeda triandra",
        "url": "https://pza.sanbi.org/themeda-triandra",
        "supports": "多年生丛生形态、小穗和芒；生境、放牧及火后休养条件。"
      },
      {
        "title": "SANParks：金门高地草原",
        "url": "https://www.sanparks.org/parks/golden-gate-highlands/explore/fauna-flora/vegetation/grasses",
        "supports": "公园内的红草、草地季节外观，以及火和过度放牧的影响。"
      },
      {
        "title": "澳大利亚新南威尔士州：Kangaroo grass",
        "url": "https://www.dpird.nsw.gov.au/agriculture/pastures-and-rangelands/rangelands/publications-and-information/grassedup/species/kangaroo-grass",
        "supports": "澳大利亚形态、生境与持续放牧限制；不将当地花期视为全球统一花期。"
      },
      {
        "title": "NASA POWER：南非金门高地草原气候格点，2001–2025",
        "url": "https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M%2CPRECTOTCORR&community=AG&longitude=28.63&latitude=-28.51&format=JSON",
        "supports": "十二个月的平均空气温度与降水率；地区背景，不是林内、树冠或单株观测。"
      }
    ],
    "steps": [
      {
        "title": "认识形态",
        "text": "先把地球转到南非金门高地，认识红草。它不是一株树，而是多年生丛生禾草。看基部的叶丛，再看细长花秆上成组的小穗与弯折长芒。长芒是结构线索；模型把它放大，便于与麦穗比较。草丛成熟时可以转成红褐色。",
        "action": {
          "kind": "morphology",
          "regionId": "golden-gate"
        }
      },
      {
        "title": "环境机制",
        "text": "同样有雨，为什么这里形成草地，还会出现不同草种的优势？水分首先要进入土壤，并在生长季被根系利用。接着看干扰：火能移除枯草，植株在适当条件下重新抽叶，但火后需要恢复。连续重度放牧会压缩恢复机会。当地草地的样子，是季节、水分、火和采食共同作用的结果。",
        "action": {
          "kind": "environment",
          "regionId": "golden-gate"
        }
      },
      {
        "title": "地区证据",
        "text": "NASA二〇〇一年至二〇二五年格点资料中，最冷月平均约五点五摄氏度，最暖月约十七点八摄氏度。南非国家公园资料明确记载金门高地的这种草。我们用教学点查看当地格点气候，并不把整个公园看成同一块草地。再对照澳大利亚的记录，会发现同一种草分布很广，具体花期与管理背景仍然不同。",
        "action": {
          "kind": "region",
          "regionId": "golden-gate"
        }
      }
    ],
    "substrateKind": "terrestrial",
    "substrateNote": "南非国家公园资料描述金门高地的酸性草地背景；当前教学点的表土pH、砂粒和黏粒数值尚缺，不能把地区描述换算成数值。",
    "soilCaution": "南非国家公园资料描述金门高地的酸性草地背景；当前教学点的表土pH、砂粒和黏粒数值尚缺，不能把地区描述换算成数值。"
  },
  {
    "id": "wangtianshu",
    "name": "望天树",
    "latin": "Parashorea chinensis",
    "group": "雨林林冠乔木",
    "definition": "龙脑香科的高大常绿乔木，可以形成雨林上层林冠。看通直树干、高处树冠和树基板根，再区分高处成树与林下幼苗所处的环境。",
    "organs": "高处展开的树冠连接长而通直的主干，树基有板状根；板根、主干和冠层在模型中分别强调，不是按真实树高缩尺重建。",
    "environment": "勐腊的望天树林受季风影响，雨量在一年中分配不均。雨季供水支持生长，干季仍有水分压力；高处成树与林下幼苗的光、风和湿度条件并不相同。把季节与森林层次一起看，才能解释这种雨林。",
    "adaptations": "通直主干把树冠送到森林上层，板根形成树基支撑结构。结构有多重作用，不能仅凭看到板根，就推定整片土壤的肥力、根深或排水状况。",
    "misconception": "热带雨林不等于每天同样下雨，成年树高大也不代表所有幼苗都能顺利更新。",
    "regionRole": "documented-habitat",
    "evidenceChecks": {
      "climate": "比较逐月降水的分配，雨林也可以有季节水分压力。",
      "soil": "板根是植物结构，模型表土属性是另一类证据，二者不能直接互相替代。",
      "water": "雨季、干季、林冠截留与土壤水联系起来；雾水与树体用水并未在本点实测。"
    },
    "cropId": "wangtianshu",
    "pathId": "ecosystem-contrasts",
    "regionId": "mengla-canopy",
    "region": {
      "id": "mengla-canopy",
      "name": "中国西双版纳勐腊望天树林",
      "lon": 101.58,
      "lat": 21.62,
      "pointMeaning": "编辑选择的地区环境教学位置，不是单株、样方或完整生境边界。"
    },
    "rootzone": "soil",
    "caseText": "中国西双版纳勐腊望天树林气候格点（2001–2025）：最冷月12月均温15.1°C，最暖月5月均温24.8°C。中国科学院的群落研究记载了当地望天树上层林冠、板根和复杂森林层次。这里的气候点是地区背景，不能替代林下或树冠观测。邱园的主要生物群区是较粗的标签，具体望天树林的雨林性质，需要结合当地群落研究来理解。",
    "question": {
      "id": "bio-check-wangtianshu",
      "title": "望天树 · 想一想",
      "prompt": "怎样解释勐腊有高大的望天树林？",
      "options": [
        "雨林这个名字已经证明每天雨量都相同。",
        "只要看到板根，就能确定整片土壤的肥力与根深。",
        "把热量、干湿季、根区条件和森林层次共同考虑。"
      ],
      "correctIndex": 2,
      "explanation": "林冠结构与季节性供水共同提供解释；森林名称和单个器官都不能代替当地环境证据。",
      "feedback": [
        "请把形态、环境证据和记录范围分开。林冠结构与季节性供水共同提供解释；森林名称和单个器官都不能代替当地环境证据。",
        "请把形态、环境证据和记录范围分开。林冠结构与季节性供水共同提供解释；森林名称和单个器官都不能代替当地环境证据。",
        "林冠结构与季节性供水共同提供解释；森林名称和单个器官都不能代替当地环境证据。"
      ],
      "nextHint": "指出一条已知证据，再说明一项需要当地核对的条件。",
      "sources": [
        {
          "title": "Kew WCVP第16版：望天树",
          "url": "https://powo.science.kew.org/taxon/urn:lsid:ipni.org:names:321134-1",
          "supports": "接受学名、生活型及粗植物地理区记录；不是连续覆盖或田块适生预测。"
        },
        {
          "title": "植物生态学报：西双版纳望天树林群落研究",
          "url": "https://www.plant-ecology.com/CN/abstract/abstract31319.shtml",
          "supports": "勐腊望天树上层优势、复杂森林层次与板根等群落特征。"
        },
        {
          "title": "中科院西双版纳热带植物园：望天树更新与保护研究",
          "url": "https://ir.xtbg.ac.cn/bitstream/353005/2840/1/热带雨林濒危树种望天树的致危原因及保护策略.pdf",
          "supports": "干湿季与雾季、望天树形态和幼苗更新；论文中的历史站点值不替代本课NASA格点值。"
        },
        {
          "title": "中科院西双版纳热带植物园：雨林中的望天树",
          "url": "https://xtbg.cas.cn/2018/bwbd/202105/t20210521_6035616.html",
          "supports": "当地高大林冠乔木的背景资料。"
        },
        {
          "title": "NASA POWER：中国西双版纳勐腊望天树林气候格点，2001–2025",
          "url": "https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M%2CPRECTOTCORR&community=AG&longitude=101.58&latitude=21.62&format=JSON",
          "supports": "十二个月的平均空气温度与降水率；地区背景，不是林内、树冠或单株观测。"
        }
      ]
    },
    "sources": [
      {
        "title": "Kew WCVP第16版：望天树",
        "url": "https://powo.science.kew.org/taxon/urn:lsid:ipni.org:names:321134-1",
        "supports": "接受学名、生活型及粗植物地理区记录；不是连续覆盖或田块适生预测。"
      },
      {
        "title": "植物生态学报：西双版纳望天树林群落研究",
        "url": "https://www.plant-ecology.com/CN/abstract/abstract31319.shtml",
        "supports": "勐腊望天树上层优势、复杂森林层次与板根等群落特征。"
      },
      {
        "title": "中科院西双版纳热带植物园：望天树更新与保护研究",
        "url": "https://ir.xtbg.ac.cn/bitstream/353005/2840/1/热带雨林濒危树种望天树的致危原因及保护策略.pdf",
        "supports": "干湿季与雾季、望天树形态和幼苗更新；论文中的历史站点值不替代本课NASA格点值。"
      },
      {
        "title": "中科院西双版纳热带植物园：雨林中的望天树",
        "url": "https://xtbg.cas.cn/2018/bwbd/202105/t20210521_6035616.html",
        "supports": "当地高大林冠乔木的背景资料。"
      },
      {
        "title": "NASA POWER：中国西双版纳勐腊望天树林气候格点，2001–2025",
        "url": "https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M%2CPRECTOTCORR&community=AG&longitude=101.58&latitude=21.62&format=JSON",
        "supports": "十二个月的平均空气温度与降水率；地区背景，不是林内、树冠或单株观测。"
      }
    ],
    "steps": [
      {
        "title": "认识形态",
        "text": "来到中国西双版纳勐腊，抬头看望天树。它是龙脑香科的高大常绿乔木。先看长而通直的主干，再看高处展开的树冠，最后看树基向外伸展的板根。成树在森林上层，幼苗却生活在林下；同一种植物的两个阶段，面对的光和水并不完全一样。",
        "action": {
          "kind": "morphology",
          "regionId": "mengla-canopy"
        }
      },
      {
        "title": "环境机制",
        "text": "这里的雨林受到季风影响，并不是每天都以同样强度下雨。雨季带来补给，干季仍可能限制幼苗。树冠获得的光、风和水分条件，也不同于林下。板根帮助我们观察树基结构，却不能单独证明整片土壤肥沃、根系都很浅或没有排水问题。理解望天树，要把森林层次与一年中的水分分配连起来。",
        "action": {
          "kind": "environment",
          "regionId": "mengla-canopy"
        }
      },
      {
        "title": "地区证据",
        "text": "NASA二〇〇一年至二〇二五年格点资料中，最冷月平均约十五点一摄氏度，最暖月约二十四点八摄氏度。中国科学院的群落研究记载了当地望天树上层林冠、板根和复杂森林层次。这里的气候点是地区背景，不能替代林下或树冠观测。邱园的主要生物群区是较粗的标签，具体望天树林的雨林性质，需要结合当地群落研究来理解。",
        "action": {
          "kind": "region",
          "regionId": "mengla-canopy"
        }
      }
    ],
    "substrateKind": "terrestrial",
    "substrateNote": "地区研究记载部分低海拔森林的砖红壤背景；本点的表土pH与质地数值尚缺，文献地区描述不是本点土样。",
    "soilCaution": "地区研究记载部分低海拔森林的砖红壤背景；本点的表土pH与质地数值尚缺，文献地区描述不是本点土样。"
  },
  {
    "id": "arcticwillow",
    "name": "北极柳",
    "latin": "Salix arctica",
    "group": "极地与苔原植物",
    "definition": "一种落叶的低矮木本灌木，枝条可贴地伸展，圆卵形叶片和直立柔荑花序有助观察。低矮并不等于草本。",
    "organs": "木质枝条沿地面延伸，短枝上有叶片与柔荑花序。雌雄异株；模型只示意一种花序形态，不把雌雄花放在同株上。",
    "environment": "寒冷地区不只要问温度低不低，还要问一年有多久能够生长。积雪融化时间改变可利用的季节与水分，地形又影响水分积聚或排走。贴地枝条使植株处于近地微环境，但不能据此得出所有苔原都适合它。",
    "adaptations": "低矮、贴地伸展的木本结构与高大树木不同。近地条件、雪被和根区湿度共同影响生长；株高变化很大，形态示意不代表所有种群的统一尺寸。",
    "misconception": "北极柳虽然矮小，仍是木本灌木；白色冰雪或蓝色水面也不能直接表示根区已有可用液态水。",
    "regionRole": "regional-context",
    "evidenceChecks": {
      "climate": "比较暖季窗口与寒季，空气月均温不是叶片温度或冻土温度。",
      "soil": "公开表土模型不能代替苔原有机层、岩隙和冻土活动层调查。",
      "water": "区分冰雪、融雪补给与实际根区液态水，地表水面指标不能互相替代。"
    },
    "cropId": "arcticwillow",
    "pathId": "ecosystem-contrasts",
    "regionId": "disko-tundra",
    "region": {
      "id": "disko-tundra",
      "name": "格陵兰迪斯科岛南部苔原",
      "lon": -53.52,
      "lat": 69.26,
      "pointMeaning": "编辑选择的地区环境教学位置，不是单株、样方或完整生境边界。"
    },
    "rootzone": "soil",
    "caseText": "格陵兰迪斯科岛南部苔原气候格点（2001–2025）：最冷月2月均温-18.4°C，最暖月7月均温7.3°C。迪斯科岛的研究记载了北极柳和不同植被、地表条件的组合。本点只定位地区气候背景，不冒充论文样方或一株柳的坐标。接着比较望天树：同是木本植物，高度、季节窗口和供水过程可以非常不同。",
    "question": {
      "id": "bio-check-arcticwillow",
      "title": "北极柳 · 想一想",
      "prompt": "北极柳低矮，能据此得出什么判断？",
      "options": [
        "它有木质枝条，仍可属于灌木；株高与是否木本要分别判断。",
        "只要低于膝盖，就一定是草本植物。",
        "只要旁边有积雪，全年就没有供水限制。"
      ],
      "correctIndex": 0,
      "explanation": "木本性质来自组织与枝条结构，不能由株高代替。可用水还取决于冻结、融雪、季节和根区状况。",
      "feedback": [
        "木本性质来自组织与枝条结构，不能由株高代替。可用水还取决于冻结、融雪、季节和根区状况。",
        "请把形态、环境证据和记录范围分开。木本性质来自组织与枝条结构，不能由株高代替。可用水还取决于冻结、融雪、季节和根区状况。",
        "请把形态、环境证据和记录范围分开。木本性质来自组织与枝条结构，不能由株高代替。可用水还取决于冻结、融雪、季节和根区状况。"
      ],
      "nextHint": "指出一条已知证据，再说明一项需要当地核对的条件。",
      "sources": [
        {
          "title": "Kew WCVP第16版：北极柳",
          "url": "https://powo.science.kew.org/taxon/urn:lsid:ipni.org:names:777076-1",
          "supports": "接受学名、生活型及粗植物地理区记录；不是连续覆盖或田块适生预测。"
        },
        {
          "title": "加拿大自然博物馆：北极柳",
          "url": "https://nature.ca/en/learn-explore/activities/arctic-willow/",
          "supports": "低矮木本灌木、横向枝条与柔荑花序。"
        },
        {
          "title": "加拿大北极群岛植物志：Salix arctica",
          "url": "https://nature.ca/aaflora/data/www/wlsaar.htm",
          "supports": "物种形态、矮灌木与多种北极生境，不把示意图当精确鉴定。"
        },
        {
          "title": "诺丁汉大学：迪斯科岛湖泊流域植被调查",
          "url": "https://eprints.nottingham.ac.uk/46579/1/Mark%20Stevenson_Thesis_2017_FINAL_SEPT.pdf",
          "supports": "流域调查中的Salix arctica及植被、地表覆盖差异；本课教学点不冒充论文样方。"
        },
        {
          "title": "美国林务局：北极柳物种资料",
          "url": "https://www.fs.usda.gov/rm/pubs_series/iitf/iitf_gtr026.pdf",
          "supports": "落叶、匍匐木本、株形变异及雌雄异株。"
        },
        {
          "title": "NASA POWER：格陵兰迪斯科岛南部苔原气候格点，2001–2025",
          "url": "https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M%2CPRECTOTCORR&community=AG&longitude=-53.52&latitude=69.26&format=JSON",
          "supports": "十二个月的平均空气温度与降水率；地区背景，不是林内、树冠或单株观测。"
        }
      ]
    },
    "sources": [
      {
        "title": "Kew WCVP第16版：北极柳",
        "url": "https://powo.science.kew.org/taxon/urn:lsid:ipni.org:names:777076-1",
        "supports": "接受学名、生活型及粗植物地理区记录；不是连续覆盖或田块适生预测。"
      },
      {
        "title": "加拿大自然博物馆：北极柳",
        "url": "https://nature.ca/en/learn-explore/activities/arctic-willow/",
        "supports": "低矮木本灌木、横向枝条与柔荑花序。"
      },
      {
        "title": "加拿大北极群岛植物志：Salix arctica",
        "url": "https://nature.ca/aaflora/data/www/wlsaar.htm",
        "supports": "物种形态、矮灌木与多种北极生境，不把示意图当精确鉴定。"
      },
      {
        "title": "诺丁汉大学：迪斯科岛湖泊流域植被调查",
        "url": "https://eprints.nottingham.ac.uk/46579/1/Mark%20Stevenson_Thesis_2017_FINAL_SEPT.pdf",
        "supports": "流域调查中的Salix arctica及植被、地表覆盖差异；本课教学点不冒充论文样方。"
      },
      {
        "title": "美国林务局：北极柳物种资料",
        "url": "https://www.fs.usda.gov/rm/pubs_series/iitf/iitf_gtr026.pdf",
        "supports": "落叶、匍匐木本、株形变异及雌雄异株。"
      },
      {
        "title": "NASA POWER：格陵兰迪斯科岛南部苔原气候格点，2001–2025",
        "url": "https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M%2CPRECTOTCORR&community=AG&longitude=-53.52&latitude=69.26&format=JSON",
        "supports": "十二个月的平均空气温度与降水率；地区背景，不是林内、树冠或单株观测。"
      }
    ],
    "steps": [
      {
        "title": "认识形态",
        "text": "把地球转到格陵兰，认识一种很低的木本植物：北极柳。看贴地伸展的枝条，再看短枝上的叶片与直立花序。虽然它看起来像一小片草，它有木质枝条，属于灌木。模型放大了这些结构，不能用屏幕上的尺寸判断它和望天树的真实高度比例。",
        "action": {
          "kind": "morphology",
          "regionId": "disko-tundra"
        }
      },
      {
        "title": "环境机制",
        "text": "寒冷地区的关键，不只是一个低温数字。植物要利用短暂的暖季完成展叶和繁殖，融雪时间也会改变这个窗口。冰雪中有水，却不等于根已经能吸收液态水。再看地形：有些地方积水，有些地方排水快。近地面的风、温度和雪被又与较高处不同，所以同一片苔原内部也会出现不同生境。",
        "action": {
          "kind": "environment",
          "regionId": "disko-tundra"
        }
      },
      {
        "title": "地区证据",
        "text": "NASA二〇〇一年至二〇二五年格点资料中，最冷月平均约负十八点四摄氏度，最暖月约七点三摄氏度。迪斯科岛的研究记载了北极柳和不同植被、地表条件的组合。本点只定位地区气候背景，不冒充论文样方或一株柳的坐标。接着比较望天树：同是木本植物，高度、季节窗口和供水过程可以非常不同。",
        "action": {
          "kind": "region",
          "regionId": "disko-tundra"
        }
      }
    ],
    "substrateKind": "terrestrial",
    "substrateNote": "迪斯科岛流域调查记录裸岩、砾石及有机土等地表差异；本点的pH、质地和冻土活动层厚度均未取得。",
    "soilCaution": "迪斯科岛流域调查记录裸岩、砾石及有机土等地表差异；本点的pH、质地和冻土活动层厚度均未取得。"
  },
  {
    "id": "camphor",
    "name": "樟树",
    "latin": "Camphora officinarum",
    "group": "城市与常绿阔叶树木",
    "definition": "一种常绿阔叶乔木，叶片的离基三出脉与成熟紫黑色核果是观察线索。城市公园中的生长表现还受到树穴空间、土壤压实、排水和养护影响。",
    "organs": "看广展树冠、互生单叶和接近叶基处分出的三条明显主脉；模型中少量紫黑色小果表示核果，不代表全年同时开花结果。",
    "environment": "城市树木的分布不能只用气候解释。道路铺装与压实会改变入渗、通气和根系空间；浇灌、排水和修剪又改变实际条件。常绿表示全年保有叶片，并不表示每片叶子永久不脱落。",
    "adaptations": "广展的常绿树冠提供叶片与遮阴空间，根系仍需要水和空气。园林环境中，合适的树穴与长期养护会影响表现，不能由一棵长得好的树推出全城所有地点都一样。",
    "misconception": "公园存在一棵樟树能证明园林记录，不能单独证明整个地区的原生身份或每块地的适生性。",
    "regionRole": "cultivation-context",
    "evidenceChecks": {
      "climate": "气候格点只给地区热量与降水背景，不测量城市街谷和树冠微环境。",
      "soil": "园林树穴、填土与压实需要现场资料，不能直接由天然表土模型替代。",
      "water": "区分降雨入渗与人工浇灌，没有实测时不生成灌溉量。"
    },
    "cropId": "camphor",
    "pathId": "ecosystem-contrasts",
    "regionId": "hongkong-garden",
    "region": {
      "id": "hongkong-garden",
      "name": "中国香港动植物公园周边绿地",
      "lon": 114.155,
      "lat": 22.278,
      "pointMeaning": "编辑选择的地区环境教学位置，不是单株、样方或完整生境边界。"
    },
    "rootzone": "soil",
    "caseText": "中国香港动植物公园周边绿地气候格点（2001–2025）：最冷月1月均温16.0°C，最暖月7月均温28.5°C。香港动植物公园有明确的樟树记录。还要分清名称和分布来源：本项目采用邱园接受名，香港资料常用旧属名。对原生身份，两份资料的口径并不一致；地图保留邱园记录，公园案例按园林情境说明。把事实、来源与解释分开，比给整个地区贴一个绝对标签更可靠。",
    "question": {
      "id": "bio-check-camphor",
      "title": "樟树 · 想一想",
      "prompt": "公园里有一棵樟树，最稳妥的结论是什么？",
      "options": [
        "说明全城所有树穴都适合樟树。",
        "可以记录园林情境，再核对根区管理与不同来源的分布认定。",
        "既然叶片常绿，就不会发生换叶。"
      ],
      "correctIndex": 1,
      "explanation": "园林出现记录、具体地点的生长条件与区域原生身份是不同问题。树穴和养护要查当地资料，来源分歧应明确保留。",
      "feedback": [
        "请把形态、环境证据和记录范围分开。园林出现记录、具体地点的生长条件与区域原生身份是不同问题。树穴和养护要查当地资料，来源分歧应明确保留。",
        "园林出现记录、具体地点的生长条件与区域原生身份是不同问题。树穴和养护要查当地资料，来源分歧应明确保留。",
        "请把形态、环境证据和记录范围分开。园林出现记录、具体地点的生长条件与区域原生身份是不同问题。树穴和养护要查当地资料，来源分歧应明确保留。"
      ],
      "nextHint": "指出一条已知证据，再说明一项需要当地核对的条件。",
      "sources": [
        {
          "title": "Kew WCVP第16版：樟树",
          "url": "https://powo.science.kew.org/taxon/urn:lsid:ipni.org:names:77328940-1",
          "supports": "接受学名、生活型及粗植物地理区记录；不是连续覆盖或田块适生预测。"
        },
        {
          "title": "香港动植物公园：樟树记录",
          "url": "https://www.hkzbg.gov.hk/en/plants/tree/lcsdcw68.html",
          "supports": "园内公开树木记录、常绿乔木与基本形态；不把公园树木推成全地区分布。"
        },
        {
          "title": "香港绿化：樟树识别与本地分布口径",
          "url": "https://www.greening.gov.hk/sc/community-outreach/qrcode-tree-labels/index_id_12.html",
          "supports": "叶片离基三出脉、成熟核果、常绿换叶特征及当地原生认定；后者与WCVP口径有差异。"
        },
        {
          "title": "新加坡国家公园局：樟树根区与栽培条件",
          "url": "https://www.nparks.gov.sg/FloraFaunaWeb/Flora/2/8/2805",
          "supports": "常绿形态、日照、水分和排水背景；不是香港树穴实测。"
        },
        {
          "title": "香港绿化：种植环境与根区限制",
          "url": "https://www.greening.gov.hk/tc/tree-care/common-tree-problems/index.html",
          "supports": "种植场地的土壤容积、地下空间、排水、微气候和日照共同限制树木；不是本公园树穴检测。"
        },
        {
          "title": "NASA POWER：中国香港动植物公园周边绿地气候格点，2001–2025",
          "url": "https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M%2CPRECTOTCORR&community=AG&longitude=114.155&latitude=22.278&format=JSON",
          "supports": "十二个月的平均空气温度与降水率；地区背景，不是林内、树冠或单株观测。"
        }
      ]
    },
    "sources": [
      {
        "title": "Kew WCVP第16版：樟树",
        "url": "https://powo.science.kew.org/taxon/urn:lsid:ipni.org:names:77328940-1",
        "supports": "接受学名、生活型及粗植物地理区记录；不是连续覆盖或田块适生预测。"
      },
      {
        "title": "香港动植物公园：樟树记录",
        "url": "https://www.hkzbg.gov.hk/en/plants/tree/lcsdcw68.html",
        "supports": "园内公开树木记录、常绿乔木与基本形态；不把公园树木推成全地区分布。"
      },
      {
        "title": "香港绿化：樟树识别与本地分布口径",
        "url": "https://www.greening.gov.hk/sc/community-outreach/qrcode-tree-labels/index_id_12.html",
        "supports": "叶片离基三出脉、成熟核果、常绿换叶特征及当地原生认定；后者与WCVP口径有差异。"
      },
      {
        "title": "新加坡国家公园局：樟树根区与栽培条件",
        "url": "https://www.nparks.gov.sg/FloraFaunaWeb/Flora/2/8/2805",
        "supports": "常绿形态、日照、水分和排水背景；不是香港树穴实测。"
      },
      {
        "title": "香港绿化：种植环境与根区限制",
        "url": "https://www.greening.gov.hk/tc/tree-care/common-tree-problems/index.html",
        "supports": "种植场地的土壤容积、地下空间、排水、微气候和日照共同限制树木；不是本公园树穴检测。"
      },
      {
        "title": "NASA POWER：中国香港动植物公园周边绿地气候格点，2001–2025",
        "url": "https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M%2CPRECTOTCORR&community=AG&longitude=114.155&latitude=22.278&format=JSON",
        "supports": "十二个月的平均空气温度与降水率；地区背景，不是林内、树冠或单株观测。"
      }
    ],
    "steps": [
      {
        "title": "认识形态",
        "text": "最后来到中国香港的城市绿地，看一棵身边常见的樟树。先看展开的常绿树冠，再看卵状叶片上从接近叶基部分出的三条明显主脉。成熟小果可呈紫黑色。常绿并不是叶片永远不脱落；屏幕同时强调叶和果，是为了观察结构，并不表示全年都这样。",
        "action": {
          "kind": "morphology",
          "regionId": "hongkong-garden"
        }
      },
      {
        "title": "环境机制",
        "text": "为什么同一座城市，有的樟树长得好，有的却受限制？气候只是第一层。再看脚下：铺装和压实会改变雨水入渗、土壤通气与根系空间。浇灌和排水又改变实际供水。城市植物的出现，既有自然条件，也有人为种植和管理；不能由一棵树的表现推出全城每块地方都适合。",
        "action": {
          "kind": "environment",
          "regionId": "hongkong-garden"
        }
      },
      {
        "title": "地区证据",
        "text": "NASA二〇〇一年至二〇二五年格点资料中，最冷月平均约十六摄氏度，最暖月约二十八点五摄氏度。香港动植物公园有明确的樟树记录。还要分清名称和分布来源：本项目采用邱园接受名，香港资料常用旧属名。对原生身份，两份资料的口径并不一致；地图保留邱园记录，公园案例按园林情境说明。把事实、来源与解释分开，比给整个地区贴一个绝对标签更可靠。",
        "action": {
          "kind": "region",
          "regionId": "hongkong-garden"
        }
      }
    ],
    "substrateKind": "terrestrial",
    "substrateNote": "城市树木养护资料强调树穴空间、压实、通气和排水；本公园树旁的填土pH、质地和含水率仍待现场调查。",
    "soilCaution": "城市树木养护资料强调树穴空间、压实、通气和排水；本公园树旁的填土pH、质地和含水率仍待现场调查。",
    "sourceDisagreement": {
      "topic": "原生身份与资料口径",
      "summary": "香港绿化资料将樟树列为本地原生物种；本项目使用的WCVP第16版将中国东南部列为引入记录区。两份资料尺度和历史认定不同，本图保持WCVP口径；公园案例只陈述已记载的园林树木。",
      "sources": [
        "https://www.greening.gov.hk/sc/community-outreach/qrcode-tree-labels/index_id_12.html",
        "https://powo.science.kew.org/taxon/urn:lsid:ipni.org:names:77328940-1"
      ]
    }
  }
];
