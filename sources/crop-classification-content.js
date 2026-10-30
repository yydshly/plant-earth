// Use-based teaching paths. These are not formal plant taxonomy or new commodity statistics.
const deepFreeze=value=>{if(value&&typeof value==='object'){Object.values(value).forEach(deepFreeze);Object.freeze(value);}return value;};
const S={
  "rice": {
    "title": "FAO EcoCrop：水稻",
    "url": "https://ecocrop.apps.fao.org/ecocrop/srv/en/dataSheet?id=1574",
    "supports": "物种层面的环境范围参考；不代表每个品种或地点的最适条件",
    "cropId": "rice"
  },
  "wheat": {
    "title": "南非农业研究委员会：小麦气候适应",
    "url": "https://www.arc.agric.za/arc-iscw/CSA-Toolbox/CSA%20Small%20Grains%20Production/Manual/5-Wheat%20production.pdf",
    "supports": "冬春性、春化、干旱及灌浆期热害",
    "cropId": "wheat"
  },
  "maize": {
    "title": "明尼苏达大学：玉米授粉期干旱",
    "url": "https://extension.umn.edu/agriculture/crop-production/corn/dry-conditions-during-corn-pollination",
    "supports": "抽雄授粉期水分与热胁迫",
    "cropId": "maize"
  },
  "quinoa": {
    "title": "FAO：藜麦生态型与多样性",
    "url": "https://www.fao.org/in-action/quinoa-platform/quinua/biodiversidad-de-la-quinua/en/",
    "supports": "高原、盐湖、谷地、海岸及湿热山地类型，播种水分与土壤保护",
    "cropId": "quinoa"
  },
  "soybean": {
    "title": "FAO EcoCrop：大豆",
    "url": "https://ecocrop.apps.fao.org/ecocrop/srv/en/dataSheet?id=1150",
    "supports": "物种层面的环境范围参考；不代表每个品种或地点的最适条件",
    "cropId": "soybean"
  },
  "chickpea": {
    "title": "萨斯喀彻温省：鹰嘴豆适应与品种",
    "url": "https://www.saskatchewan.ca/business/agriculture-natural-resources-and-industry/agribusiness-farmers-and-ranchers/crops-and-irrigation/field-crops/pulse-crop-bean-chickpea-faba-bean-lentils/chickpea/adaptation-and-varieties",
    "supports": "深根、涝害、成熟与湿润地区病害限制",
    "cropId": "chickpea"
  },
  "pea": {
    "title": "NDSU：大田豌豆生产",
    "url": "https://www.ndsu.edu/agriculture/sites/default/files/2021-12/a1166.pdf",
    "supports": "凉季、株型、播期、热害及根瘤固氮",
    "cropId": "pea"
  },
  "potato": {
    "title": "FAO EcoCrop：马铃薯",
    "url": "https://ecocrop.apps.fao.org/ecocrop/srv/en/dataSheet?id=1971",
    "supports": "物种层面的环境范围参考；不代表每个品种或地点的最适条件",
    "cropId": "potato"
  },
  "sweetpotato": {
    "title": "国际马铃薯中心：甘薯生产与管理",
    "url": "https://www.sweetpotatoknowledge.org/wp-content/uploads/2018/12/xCIP_SP_T6_SweetpotatoProductionAndManagement_v40.pdf",
    "supports": "甘薯建苗、储藏根、土壤与水分",
    "cropId": "sweetpotato"
  },
  "taro": {
    "title": "夏威夷大学CTAHR：Taro Varieties",
    "url": "https://www3.ctahr.hawaii.edu/site/Taro.aspx",
    "supports": "芋的栽培类型与形态识别资料",
    "cropId": "taro"
  },
  "tomato": {
    "title": "UC ANR：加工番茄生产",
    "url": "https://anrcatalog.ucanr.edu/pdf/7228.pdf",
    "supports": "暖季生长、霜冻和坐果温度限制、加州产区",
    "cropId": "tomato"
  },
  "carrot": {
    "title": "TNAU：胡萝卜栽培",
    "url": "https://agritech.tnau.ac.in/horticulture/horti_vegetables_carrot.html",
    "supports": "凉季、根部品质、土壤及尼尔吉里产区",
    "cropId": "carrot"
  },
  "broccoli": {
    "title": "爱荷华州立大学：Growing Broccoli in the Home Garden",
    "url": "https://yardandgarden.extension.iastate.edu/how-to/growing-broccoli-home-garden",
    "supports": "甘蓝同种栽培群、冷凉季、湿润排水土壤、春秋安排与花蕾采收",
    "cropId": "broccoli"
  },
  "apple": {
    "title": "爱荷华州立大学：苹果栽培",
    "url": "https://yardandgarden.extension.iastate.edu/how-to/growing-apples-home-garden",
    "supports": "光照、土壤与空气排水、品种、砧木和授粉",
    "cropId": "apple"
  },
  "banana": {
    "title": "佛罗里达大学：香蕉种植",
    "url": "https://ask.ifas.ufl.edu/publication/MG040/pdf",
    "supports": "香蕉低温、缺水、水涝、风与土壤限制",
    "cropId": "banana"
  },
  "strawberry": {
    "title": "UMN Extension：草莓生长与结果类型",
    "url": "https://extension.umn.edu/garden-and-home/yard-and-garden/gardening-in-minnesota/growing-strawberries-in-the-home-garden",
    "supports": "日照、匍匐茎、六月结实型、四季型和日中性型；区域物候不能当全球统一日期",
    "cropId": "strawberry"
  },
  "almond": {
    "title": "USU Extension：扁桃栽培",
    "url": "https://extension.usu.edu/yardandgarden/research/almonds-in-the-home-garden",
    "supports": "扁桃的核果与种仁、日照、排水、花期霜冻、砧木及授粉；犹他州建议不能直接推广到全球",
    "cropId": "almond"
  },
  "chestnut": {
    "title": "欧盟JRC：欧洲栗树种档案",
    "url": "https://ies-ows.jrc.ec.europa.eu/efdac/download/Atlas/pdf/Castanea_sativa.pdf",
    "supports": "欧洲栗的树形、环境生态、分布与长期人为传播背景",
    "cropId": "chestnut"
  },
  "cashew": {
    "title": "UF/IFAS：腰果苹果与腰果树",
    "url": "https://ask.ifas.ufl.edu/publication/HS377",
    "supports": "季节性干燥的热带气候、无霜要求、坐果供水及排涝；果实结构",
    "cropId": "cashew"
  },
  "oilpalm": {
    "title": "马来西亚棕榈油局：农艺资料",
    "url": "https://isopa.mpob.gov.my/agro-info",
    "supports": "深土、排水、定植季节和可靠水源",
    "cropId": "oilpalm"
  },
  "sesame": {
    "title": "FAO EcoCrop：芝麻（历史条目）",
    "url": "https://ecocrop.apps.fao.org/ecocrop/srv/en/dataSheet?id=1937",
    "supports": "物种或条目所指栽培型的环境与形态参考，不用于新增全球适宜性推算",
    "cropId": "sesame"
  },
  "sugarcane": {
    "title": "Sugar Research Australia：甘蔗灌溉与能源",
    "url": "https://sugarresearch.com.au/growers/irrigation-and-energy/",
    "supports": "高日照旱区甘蔗依赖可靠灌溉",
    "cropId": "sugarcane"
  },
  "sugarbeet": {
    "title": "蒙大拿州立大学：糖用甜菜农艺",
    "url": "https://waterquality.montana.edu/farm-ranch/irrigation/other_crops/sugarbeet.html",
    "supports": "苗期水盐敏感与采收前过量灌溉",
    "cropId": "sugarbeet"
  },
  "tea": {
    "title": "泰米尔纳德农业大学：茶",
    "url": "https://agritech.tnau.ac.in/horticulture/horti_plantation%20crops_tea.html",
    "supports": "酸性土、排水、温暖生长条件；海拔范围为地区经验",
    "cropId": "tea"
  },
  "arabica": {
    "title": "泰米尔纳德农业大学：咖啡",
    "url": "https://www.agritech.tnau.ac.in/horticulture/horti_plantation%20crops_coffee.html",
    "supports": "两种咖啡的土壤、气候、遮阴与季节管理",
    "cropId": "arabica"
  },
  "cocoa": {
    "title": "国际可可组织：种植环境与常见问题",
    "url": "https://www.icco.org/faq/",
    "supports": "可可的热量、雨量、干季、土壤与遮阴",
    "cropId": "cocoa"
  },
  "blackpepper": {
    "title": "喀拉拉农业部：Farm Guide 2023",
    "url": "https://keralaagriculture.gov.in/wp-content/uploads/2023/02/Farmguide-2023.pdf",
    "supports": "胡椒气候、关键期供水、遮阴、支持树和排水要求。",
    "cropId": "blackpepper"
  },
  "cinnamon": {
    "title": "斯里兰卡肉桂发展部：环境条件",
    "url": "https://cinnamon.gov.lk/about-cinnamon/environmental-factors/",
    "supports": "常绿木本、采收形成多茎矮状、温湿、土层、排水与盐分条件。",
    "cropId": "cinnamon"
  },
  "clove": {
    "title": "印度香料局：丁香",
    "url": "https://www.indianspices.com/node/24.html",
    "supports": "丁香香料是未开放花蕾、湿润热带、全年土壤水分与排水；所列引种栽培地",
    "cropId": "clove"
  },
  "cotton": {
    "title": "澳大利亚政府：棉花生物学",
    "url": "https://www.ogtr.gov.au/sites/default/files/2024-02/the_biology_of_cotton_2024.pdf",
    "supports": "棉花热量、水分及水涝限制",
    "cropId": "cotton"
  },
  "flax": {
    "title": "OSU：春亚麻栽培与试验",
    "url": "https://extension.oregonstate.edu/catalog/em-9877-spring-flax-columbia-basin",
    "supports": "纤维与油用目标、幼苗霜害、杂草、水分与美国生产地区",
    "cropId": "flax"
  },
  "sisal": {
    "title": "World Agroforestry：半干旱区剑麻",
    "url": "https://apps.worldagroforestry.org/downloads/Publications/PDFS/B19034.pdf",
    "supports": "储水叶片、干旱适应、透水深土与叶纤维用途",
    "cropId": "sisal"
  },
  "rubber": {
    "title": "Kew：橡胶树形态与栽培",
    "url": "https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A349913-1/general-information",
    "supports": "三小叶、乳胶来源、温暖湿润与排水、马来西亚及斯里兰卡栽培、南美叶疫病。",
    "cropId": "rubber"
  },
  "rubberManual": {
    "title": "斯里兰卡橡胶研究所：橡胶栽培手册",
    "url": "https://www.rrisl.gov.lk/content/files/downDoc/Handbook_Volume_1.pdf",
    "supports": "本地橡胶栽培环境、建园与多年生管理；不外推为全球适生地图。",
    "cropId": "rubber"
  },
  "alfalfa": {
    "title": "UMN Extension：苜蓿干旱反应",
    "url": "https://extension.umn.edu/agriculture/crop-production/forages/alfalfa-during-drought",
    "supports": "深根、幼苗脆弱性、旱期休眠与恢复、缺水减产和水分利用",
    "cropId": "alfalfa"
  },
  "alfalfaSoil": {
    "title": "UC Davis：苜蓿土壤与选址",
    "url": "https://alfalfa.ucdavis.edu/sites/g/files/dgvnsk12586/files/media/documents/117595.pdf",
    "supports": "根系土层限制、活动生长期不耐湿土与高水位",
    "cropId": "alfalfa"
  },
  "fibres": {
    "title": "FAO：International Year of Natural Fibres",
    "url": "https://www.fao.org/docrep/pdf/012/i0987e/i0987e00.pdf",
    "supports": "棉为种子毛纤维、亚麻为茎韧皮纤维、剑麻为叶纤维。"
  },
  "almondStructure": {
    "title": "Purdue Plant ID：Almond",
    "url": "https://www.hort.purdue.edu/plant-id-pal/FruitNuts/almond.html",
    "supports": "扁桃为核果，可食种子位于硬壳内。"
  }
};

export const CROP_CLASS_METADATA=deepFreeze({version:1,checkedAt:'2026-10-29',basis:'按用途组织的编辑教学路线；不是正式植物分类，也不改写FAO商品口径。',scope:'现有100个农业条目，13个可重叠用途类。每类选1至3个真实代表，不按代表数量推定完整覆盖。',classificationSources:[{title:'FAO：农业普查作物分类',url:'https://www.fao.org/4/a0135e/A0135E10.htm',supports:'作物可以有多种产品；作物、产品与用途须区分。'},{title:'UNSD CPC：根与块茎',url:'https://unstats.un.org/unsd/classifications/Econ/Structure/Detail/EN/2100/015',supports:'食用根、块茎、根茎、球茎可按用途组织，不表示都属于根。'}],limits:'介绍用于定性比较；不建立同类统一的数值适生阈值，不据此补画全球种植范围。'});
export const CROP_LEARNING_PATHS=deepFreeze([
 {id:'staples',title:'先认识粮豆与薯类',question:'粮食、豆类和薯类有哪些共同点与差别？',intro:'从籽粒到地下储藏器官，认识餐桌基础食物的来源与不同利用方式。',classIds:['grains','pulses','roots']},
 {id:'diversity',title:'再认识餐桌的丰富',question:'蔬菜、水果和坚果是怎么分的？',intro:'从食用部位辨认差别，分开生活中的叫法与植物学上的器官名称。',classIds:['vegetables','fruits','nuts']},
 {id:'flavour',title:'理解油、糖与风味',question:'植物怎样变成油、糖、饮品和香料？',intro:'顺着原料找到器官，理解同一植物可以有不同用途，不能重复当成新物种。',classIds:['oils','sugars','beverages','spices']},
 {id:'materials',title:'走出餐桌看材料与农业',question:'植物还能给我们衣料、橡胶和饲草吗？',intro:'比较纤维、乳胶与整株饲料，认识作物用途如何超出人的直接食物。',classIds:['fibres','industrial','forage']}
]);
function make(id,pathId,group,{reps,refs,beats,crossCompareIds=[],...text}){return {id,pathId,group,...text,representativeIds:reps.map(r=>r[0]),representatives:reps.map(([id,note])=>({id,note})),crossCompareIds,sources:refs.map(key=>S[key]),introBeats:beats,spokenIntro:beats.join('')};}
export const CROP_CLASSES=deepFreeze([
 make('grains','staples','谷物与杂粮',{
  title:'谷物与杂粮：从籽粒认识主食',question:'同样做主食，为什么水稻和小麦的地图不同？',
  definition:'这里按主食用途组织：禾本科谷物与荞麦、藜麦等伪谷物，在植物分类上并不相同。',
  organ:'主要利用成熟籽粒；稻、麦、玉米的籽粒属于颖果，不能把所有杂粮都当作禾本科。',
  environment:'水稻重视暖季与供水，小麦常利用凉季，玉米利用暖季；品种、播期和灌排仍会改变范围。',
  distinguish:'先看籽粒长在穗、圆锥花序还是果穗上，再比较开花成熟需要的季节。',
  misconception:'能磨成粉或煮成饭，不代表同一植物类群，更不代表能在同一季节种。',
  compareQuestion:'同是主食，哪一种要重点看田间供水，哪一种要看凉季与播期？',
  reps:[['rice','暖季供水与稻田灌排是重要线索。'],['wheat','凉季生长与春、冬性品种帮助匹配季节。'],['maize','暖季热量与授粉期供水共同影响收成。']],refs:['rice','wheat','maize','quinoa'],
  beats:['先从谷物与杂粮认识主食。水稻、小麦和玉米主要利用成熟籽粒；荞麦和藜麦也常作主食，但属于不同植物类群。','水稻重视暖季供水，小麦常利用凉季，玉米利用暖季。同类用途并不表示需要同一温度或水分。','依次看这三种作物，比较籽粒长在哪里、生长季怎样安排，再回到地图看记录。']
 }),
 make('pulses','staples','豆类',{
  title:'豆类：同样结荚，收获目标不同',question:'吃干豆、鲜豌豆和榨豆油，是同一个用途吗？',
  definition:'这里把豆科食用作物放在一起认识；既有成熟干籽，也有鲜籽、嫩荚和榨油用途。',
  organ:'豆荚是果实，荚中的豆是种子；豌豆可采鲜籽或嫩荚，大豆成熟籽还可榨油。',
  environment:'大豆利用暖季，豌豆常利用凉季，鹰嘴豆还需避开涝害；并非所有豆类都耐旱。',
  distinguish:'分清豆科的亲缘关系、收获时的成熟程度与商品用途，三条线索可以同时成立。',
  misconception:'根瘤共生固氮有条件；豆科作物并不因此无需养分，也不自动适合贫瘠或积水地。',
  compareQuestion:'为什么大豆也能出现在油料类，豌豆也能出现在蔬菜类？',
  reps:[['soybean','成熟种子兼具食用和榨油用途。'],['chickpea','较凉生长季、土壤储水与排水值得比较。'],['pea','鲜荚、鲜籽和干籽对应不同采收目标。']],refs:['soybean','chickpea','pea'],
  beats:['豆类帮助我们理解一株植物的多个用途。豆荚是果实，里面的豆是种子；收鲜荚、鲜籽或成熟干籽，产品不同。','大豆常用暖季，豌豆常用凉季，鹰嘴豆需要注意排水。豆科能与合适微生物共生固氮，也不等于不需要养分。','依次看大豆、鹰嘴豆和豌豆，再解释大豆为何也属于油料，豌豆为何也属于蔬菜。']
 }),
 make('roots','staples','薯根作物',{
  title:'薯根作物：地下的不是同一种器官',question:'马铃薯和甘薯都叫薯，食用的都是根吗？',
  definition:'这里按地下储藏器官的食用用途组织，包含块茎、储藏根和球茎，不是单一植物类群。',
  organ:'马铃薯收地下茎形成的块茎，甘薯收储藏根，芋主要收球茎；埋在土里不等于都是根。',
  environment:'马铃薯偏凉爽生长季，甘薯需要暖季；芋有水田与旱地类型，供水方式不能一概而论。',
  distinguish:'用芽眼、根与叶柄的连接位置辨认器官，再比较热量、根区供水和通气条件。',
  misconception:'耐旱生存不等于能高产；地上叶子茂盛，也不能直接证明地下储藏器官已经长好。',
  compareQuestion:'哪些地下食物是茎，哪一种是根，三种作物的供水方式又有何不同？',
  reps:[['potato','带芽眼的地下块茎属于茎。'],['sweetpotato','收获储藏根，暖季与排水很重要。'],['taro','球茎连接长叶柄，有水田与旱地栽培类型。']],refs:['potato','sweetpotato','taro'],
  beats:['看地下收获的作物，先别把它们都叫作根。马铃薯的块茎属于茎，甘薯收储藏根，芋主要收球茎。','马铃薯偏凉爽生长季，甘薯需要暖季。芋有水田和旱地栽培类型，所以水分需求不能用一个规则概括。','依次观察芽眼、大叶和地下器官的连接，再比较当地季节、土壤通气与供水。叶子茂盛不一定意味着地下已经高产。']
 }),
 make('vegetables','diversity','蔬菜',{
  title:'蔬菜：从叶、根、花到果实',question:'为什么胡萝卜、西兰花和番茄都叫蔬菜？',
  definition:'蔬菜是日常食用与栽培用途的组织方式，不是一个植物分类单元，也不是同一种器官。',
  organ:'可以吃叶、膨大根、鳞茎、花球、嫩荚或果实；番茄在植物学上是果实，餐桌上仍是蔬菜。',
  environment:'番茄利用无霜暖季，胡萝卜与西兰花常利用较凉季节；坐果、根形与花球各有限制。',
  distinguish:'先问吃哪一部分、在哪个阶段采，再问植株是否属于同一种或同一栽培群。',
  misconception:'西兰花、花椰菜与结球甘蓝是甘蓝物种的不同栽培群，不是三份完全独立的物种范围。',
  compareQuestion:'给三种蔬菜标出食用器官，再解释番茄为何能同时是果实和蔬菜。',
  reps:[['tomato','吃成熟果实，坐果并不是越热越好。'],['carrot','吃膨大直根，土层与生长季影响根形。'],['broccoli','收花球，与结球甘蓝同属甘蓝物种的不同栽培群。']],refs:['tomato','carrot','broccoli'],
  beats:['蔬菜不是一个植物家族，而是餐桌和栽培用途的叫法。番茄吃果实，胡萝卜吃膨大根，西兰花收花球。','食用部位不同，采收目标也不同。番茄常利用暖季，胡萝卜和西兰花常利用较凉季节，不能把蔬菜画成一条统一气候带。','再看甘蓝的变化：西兰花、花椰菜和结球甘蓝属于同一物种的不同栽培群，物种范围不能直接当作每个栽培群的种植范围。']
 }),
 make('fruits','diversity','水果',{
  title:'水果：日常叫法与植物器官',question:'所有水果都长在木本树上吗？',
  definition:'这里按日常果品用途组织，兼有鲜食、饮品或加工用途；植物学果实与生活中的水果不是同一标准。',
  organ:'可食部分可含果肉或附属组织；草莓的红色部分主要是膨大花托，表面小颗粒才是瘦果。',
  environment:'苹果要看冬季休眠、春霜与品种，香蕉重视暖季无霜；草莓还受结果类型与栽培方式影响。',
  distinguish:'先比较乔木、大型草本和低矮草本，再看开花、授粉和成熟如何与当地季节相配。',
  misconception:'水果不都长在树上；看见枝叶能生长，也不等于当地一定能顺利开花并成熟结果。',
  compareQuestion:'同样卖作水果，苹果、香蕉和草莓的株形与完成结果的季节条件怎样不同？',
  reps:[['apple','落叶果树，需冷、春霜与授粉需分开判断。'],['banana','大型草本，假茎由叶鞘形成，需要足够暖季结果。'],['strawberry','低矮草本，可食花托与表面瘦果值得辨认。']],refs:['apple','banana','strawberry'],
  beats:['水果是生活中的食用分类，不代表都长在木本树上。苹果是落叶果树，香蕉是大型草本，草莓是低矮草本。','苹果需要看冬季休眠和春季霜冻，香蕉重视温暖无霜的生长季，草莓则有不同结果类型。','观察草莓，红色部分主要来自花托，表面小颗粒才是瘦果。把株形、食用部位和结果季节分开，就容易理解这些差异。']
 }),
 make('nuts','diversity','坚果',{
  title:'坚果：硬壳里装着什么？',question:'扁桃仁与栗子，植物学上是同一种果实吗？',
  definition:'这里按食用坚果的消费用途组织，成员在植物学上并不全是真正的坚果，食用部位也有差别。',
  organ:'扁桃主要吃核果硬核里的种仁，栗的果实属于坚果；腰果真果还连着膨大的果梗。',
  environment:'扁桃与欧洲栗是温带落叶树，腰果是热带常绿树；越冬、开花与果实成熟要分别判断。',
  distinguish:'把外果皮、硬壳、种仁与壳斗分开观察，再回到各树种与品种的季节要求。',
  misconception:'商品上都叫坚果，不说明有同一果实结构、同一亲缘关系或同一耐寒水平。',
  compareQuestion:'分别指出扁桃、欧洲栗与腰果的食用部分，再解释为什么不能共用一条耐寒规则。',
  reps:[['almond','核果里的种仁可食，早开花易受霜冻影响。'],['chestnut','坚果被多刺壳斗包围，本条是欧洲栗。'],['cashew','弯曲真果连着腰果苹果，属于热带常绿树。']],refs:['almond','chestnut','cashew','almondStructure'],
  beats:['食用坚果是一个生活用途类别，植物学上却不全是真正的坚果。扁桃主要吃硬核中的种仁，欧洲栗的果实才属于坚果。','腰果的弯曲真果连着膨大果梗形成的腰果苹果，结构又不同。','环境也要分开看：扁桃和欧洲栗是温带落叶树，腰果是热带常绿树。依次比较食用部位、冬季与开花条件，再看地图。']
 }),
 make('oils','flavour','油料',{
  title:'油料：油藏在种子还是果肉里？',question:'大豆、油棕和芝麻为什么可以放在一起？',
  definition:'油料按可提取油脂的用途组织；同一植物还可供食或供纤维，不因此成为新物种。',
  organ:'大豆和芝麻利用含油种子，油棕果肉可产棕榈油，棕榈仁又可产不同口径的油。',
  environment:'大豆和芝麻利用合适暖季，油棕更依赖长年暖热与稳定供水；不能把油料概括为同一气候。',
  distinguish:'先认原料来自种子还是果肉，再分清鲜原料、带壳产品、籽粒与成品油的统计单位。',
  misconception:'油棕果或葵花籽的重量，不是加工后同重量的油；同一商品也不能跨条目重复相加。',
  compareQuestion:'把三个原料画到植物器官上：油来自哪里？地图显示的是原料还是成品油？',
  reps:[['soybean','成熟种子既供食，也能作为榨油原料。'],['oilpalm','果肉与种仁可产不同的油，鲜果产量不等于油产量。'],['sesame','蒴果中有许多含油小种子，采收性状因品种而异。']],refs:['soybean','oilpalm','sesame'],
  beats:['油料按用途分，不是一个植物家族。大豆和芝麻利用含油种子，油棕的果肉与种仁能产出不同的油。','同样能榨油，环境并不相同：大豆和芝麻利用合适暖季，油棕更依赖长年暖热和稳定供水。','鲜果或籽粒重量，不等于加工后油的重量。大豆出现在豆类和油料中，也仍是同一条目，不能把两类数量直接相加。']
 }),
 make('sugars','flavour','糖料',{
  title:'糖料：茎里的糖与根里的糖',question:'同样生产糖，甘蔗和糖用甜菜为什么分布不同？',
  definition:'糖料按制糖用途组织，当前用甘蔗与糖用甜菜两个代表比较；不把所有味甜果蔬都列作糖料。',
  organ:'甘蔗茎积累糖，糖用甜菜利用含糖肉质根；它与食用甜菜根属于同种植物的不同用途类型。',
  environment:'甘蔗依赖长而暖的生长季，糖用甜菜能利用较凉生长季；二者仍需适当供水和根区条件。',
  distinguish:'把植物原料与制成糖分开，再比较生长期、采收时机及糖在不同器官中的积累。',
  misconception:'甜菜鲜根或甘蔗茎产量都不是成品糖产量；两种用途的甜菜也不能当两个独立物种。',
  compareQuestion:'只看成品白糖能知道原料吗？把甘蔗茎与甜菜根放回各自生长季比较。',
  reps:[['sugarcane','糖在茎中积累，生长与成熟积糖的条件不完全相同。'],['sugarbeet','较凉生长季形成含糖肉质根，需注意苗期与土壤。']],refs:['sugarcane','sugarbeet'],
  beats:['糖料按制糖用途分组。这里用两个代表认识差别：甘蔗主要利用茎中的糖，糖用甜菜利用含糖肉质根。','甘蔗需要长而温暖的生长季，糖用甜菜可以利用较凉季节，但供水、苗期与根区条件仍然重要。','地图显示甘蔗或甜菜原料时，不要读成成品糖重量。食用甜菜根与糖用甜菜是同一种植物的不同用途类型。']
 }),
 make('beverages','flavour','饮料与可可',{
  title:'饮料与可可：叶、种子与加工风味',question:'茶、咖啡与可可，我们利用的都是果实吗？',
  definition:'这里按饮品与可可原料用途组织，不是一个植物类群；栽培、采收与加工共同影响最终风味。',
  organ:'茶采嫩梢与叶，咖啡和可可常利用种子；商品咖啡豆和可可豆并不是豆科的豆。',
  environment:'茶常联系湿润酸性土，阿拉比卡偏好温和无霜环境，可可偏暖湿；海拔只是环境线索之一。',
  distinguish:'先看采收部位，再看温度、水分与遮阴；加工饮品的名称不能代替植物学名或原料统计。',
  misconception:'咖啡商品合计未必分开阿拉比卡和罗布斯塔；豆这个叫法也不说明与大豆有相同亲缘。',
  compareQuestion:'从茶叶、咖啡豆和可可豆反推采收器官，哪一种直接采叶，哪两种主要利用种子？',
  reps:[['tea','采收嫩梢与叶，萌发节律关系到采摘轮次。'],['arabica','主要利用种子，温和热带环境常有优势。'],['cocoa','利用果荚中的种子，水分分配与遮阴值得观察。']],refs:['tea','arabica','cocoa'],
  beats:['茶、咖啡和可可让我们认识用途与器官的区别。茶采嫩梢与叶，咖啡和可可主要利用种子，虽然商品常把它们叫作豆。','环境也不同：茶常联系湿润酸性土，阿拉比卡需要较温和的无霜条件，可可偏向暖湿环境。','依次看这三种植物，再把采收部位、当地条件和加工风味分开；商品叫法并不等于植物分类。']
 }),
 make('spices','flavour','香辛料',{
  title:'香辛料：香味从不同器官来',question:'胡椒、肉桂与丁香，香料各取哪里？',
  definition:'香辛料按调味用途组织；香气可以来自不同器官，不能由商品名称推断植物亲缘或生长条件。',
  organ:'胡椒取果实，肉桂取树皮，丁香取未开放花蕾；姜还利用地下根茎，香荚兰利用果实。',
  environment:'本组代表多与热带环境有关，但藤本、乔木和根茎作物在遮阴、排水与旱季管理上不同。',
  distinguish:'先沿着香料找到原植物的器官，再比较攀援、树皮萌发或开花采蕾的生长过程。',
  misconception:'胡椒不是辣椒；香料丁香与花园紫丁香也不是同一植物，桂皮商品可能包含不同肉桂种。',
  compareQuestion:'把胡椒粒、肉桂皮与丁香花蕾放回各自器官，再解释它们为何都叫香辛料。',
  reps:[['blackpepper','攀援藤本，香料来自果实，需要支撑与排水。'],['cinnamon','取树皮，反复萌发新枝关系到采收管理。'],['clove','香料来自常绿树未开放的花蕾。']],refs:['blackpepper','cinnamon','clove'],
  beats:['先把香料放回植物身上。胡椒是攀援藤本，取果实；肉桂主要取树皮；香料丁香取未开放的花蕾。','它们都能调味，却不是同一器官或同一植物类群。姜用地下根茎，香荚兰又利用果实。','比较这些代表时，继续看支撑、遮阴、排水和采收阶段。胡椒不等于辣椒，香料丁香也不等于花园里的紫丁香。']
 }),
 make('fibres','materials','纤维',{
  title:'纤维：从植物器官到衣料绳索',question:'棉花、亚麻和剑麻的纤维来自同一部位吗？',
  definition:'纤维作物按可利用长纤维的用途组织，来源可在种子表面、茎部或叶片，不是单一植物类群。',
  organ:'棉纤维是种子表面的毛，亚麻和黄麻取茎部韧皮纤维，剑麻取叶片中的纤维。',
  environment:'棉花需要较长暖季，亚麻常利用较温和季节，剑麻能应对季节缺水；生长与采收条件应分开。',
  distinguish:'比较纤维所在器官和收获方式；同是亚麻，取茎纤维与取含油种子的栽培目标也不同。',
  misconception:'名字带麻不表示近亲；原茎、沤麻、鲜叶或籽棉重量，也不是同一种加工产品重量。',
  compareQuestion:'分别在种子、茎和叶上标出纤维来源，为什么三种作物不能用同一采收规则？',
  reps:[['cotton','棉铃打开后露出种子表面的纤维毛。'],['flax','茎提供韧皮纤维，种子另有榨油用途。'],['sisal','多年生莲座植物，收叶片取纤维。']],refs:['cotton','flax','sisal','fibres'],
  beats:['植物纤维并不都来自茎。棉花的纤维是种子表面的毛，亚麻和黄麻取茎部韧皮纤维，剑麻取叶片纤维。','棉花利用较长暖季，亚麻常利用较温和季节，剑麻能应对季节性缺水；生长条件与采收条件还要分开看。','依次观察这三种植物，并记住带麻的名字不代表近亲。亚麻取纤维或取油用种子，也对应不同生产目标。']
 }),
 make('industrial','materials','工业原料',{
  title:'工业原料：认识树皮里的乳胶',question:'橡胶是从树脂或木材里熬出来的吗？',
  definition:'工业原料按主要产品用途组织；本目录先用橡胶树一例认识乳胶，尚未覆盖所有工业作物。',
  organ:'天然橡胶取自橡胶树的乳胶系统，割胶采集乳胶；它不是把木材熬化，也不等同树脂。',
  environment:'橡胶树需要温暖、有效供水与排水；原生区域与后来扩展的主要栽培区可以明显不同。',
  distinguish:'把乳胶、树脂、木材和纤维这几类材料分开，再看原产记录与实际生产各回答什么问题。',
  misconception:'同样是树木产品，不代表来自相同分泌组织；生产最多的地区也不一定是植物原生地。',
  compareQuestion:'与棉花跨类比较：一种收种子表面的纤维，一种取乳胶，它们怎样变成材料？',
  reps:[['rubber','割取树皮乳胶系统中的乳胶，原生与生产地区要分别看。']],refs:['rubber','rubberManual'],crossCompareIds:['cotton'],
  beats:['走出餐桌，先用橡胶树认识工业原料。天然橡胶取自乳胶，不是把木材熬化，也不能把乳胶与树脂混为一谈。','橡胶树的原生地区与后来主要栽培地区可以不同，生长仍需要温暖、有效供水与排水。','当前这个小类先有一个代表。你可以跨类比较棉花：一种收种子表面的纤维，另一种取乳胶，用途相近不等于器官相同。']
 }),
 make('forage','materials','饲草',{
  title:'饲草：为牲畜收获植株',question:'苜蓿和食用豆类有什么联系，又有什么不同？',
  definition:'饲草按饲喂牲畜的用途组织，常利用茎叶；本目录先用紫花苜蓿一例认识反复刈割与再生。',
  organ:'紫花苜蓿主要利用地上茎叶，根冠、再生芽与储藏物质支持刈割后的重新生长。',
  environment:'成株深根有助获取深层水，幼苗却较脆弱；耐旱生存与高产需水应分开，积水也会伤根。',
  distinguish:'与大豆比较：都是豆科，取成熟种子与取茎叶对应不同采收目标，也有不同管理节律。',
  misconception:'能与根瘤菌共生固氮，不等于自动耐贫瘠或无需肥水；反复刈割还会消耗植株储备。',
  compareQuestion:'与大豆跨类比较：取种子和取茎叶，会怎样改变收获时机与水分管理？',
  reps:[['alfalfa','豆科多年生饲草，重点观察茎叶利用、深根与刈割后的再生。']],refs:['alfalfa','alfalfaSoil'],crossCompareIds:['soybean'],
  beats:['饲草帮助我们理解植物还能怎样服务农业。紫花苜蓿属于豆科，主要利用地上茎叶，根冠与再生芽支持刈割后重新生长。','成株深根有助获取深层水，但幼苗较脆弱。能在干旱中生存，不代表高产时不需要水，也不表示能忍受积水。','这个小类先有苜蓿一个代表。与大豆比较，都是豆科，却分别取茎叶和种子；固氮也不等于无需养分。']
 })
]);
