// Six introductory comparisons, not an exhaustive biome classification or range model.
// Camera coordinates and audio beat indexes are copied from existing representative placements.
export const LEARNING_INTRO = {
  title:'跟着地球，读懂植物为什么长在这里',
  summary:'用六站认识水、热、季节与生境，再从植物的叶、茎和根找到线索。先建立规律，再进入完整植物图鉴自由探索。',
  goals:['看出主要植物景观的差异','把植物形态与环境联系起来','分清原生、栽培与潜在适生环境'],
  scope:'这六站是入门对照，不是地球全部生物群系；苔原、高山、地中海灌丛等还可继续学习。湿地与水域横跨多个气候区。',
  principle:'先问这里的水和热怎样，再看季节、土壤与人类活动。气候提供线索，不能单独决定每一种植物的分布。',
  terms:[
    {title:'原生',text:'在当地自然出现，并非由人类引入。原生范围不等于物种最初的起源中心。'},
    {title:'引入',text:'人类有意或无意将植物带到原生范围之外；不表示它已经归化，也不等于入侵。'},
    {title:'栽培',text:'人为种植和管理。栽培可以发生在原生范围内，也可以在范围外。'},
    {title:'潜在适生',text:'依据特定数据、模型和管理假设推测可能适宜的环境；不等于已有分布，也不是种植保证。'},
    {title:'代表地点',text:'为学习而选的地区定位，不是实测个体、完整分布边界、数量密度或面积。'}
  ]
};

export const LEARNING_STOPS = [
  {
    id:'rainforest', title:'热带雨林', kicker:'第一站 · 水热较充足，还要争取光',
    lon:114, lat:2, landscape:'婆罗洲湿热森林', focusPlantId:'birdsnestfern', beatIndex:1,
    summary:'许多赤道附近地区常年暖湿，森林层次丰富。即使雨水充足，林下与树冠上的光照、根区通气也很不一样。',
    climate:[{label:'热量',value:'全年温暖，少霜'},{label:'水分',value:'多雨，仍有局地差异'},{label:'关键位置',value:'林下、树枝与地面不同'}],
    chain:[
      {title:'环境',text:'森林中光照被树冠分配，树枝上也有潮湿的小环境。'},
      {title:'形态',text:'巢蕨的叶片围成巢状，能承接落叶与水分；附生根把植株固定在支撑物上。'},
      {title:'生长结果',text:'它可以利用树上的位置，但湿润空气不等于让根长时间泡水；附生也不是吸取宿主养分的寄生。'}
    ],
    plants:[
      {id:'birdsnestfern',role:'巢蕨：用叶丛和附生位置认识森林小生境'},
      {id:'orchid',role:'白花蝴蝶兰：附生根需要水分，也需要空气'},
      {id:'rubber',role:'橡胶树：热带栽培对照；胶园不是天然雨林'}
    ],
    contrast:{title:'同样暖湿，也不等于同一种森林',text:'橡胶树原生于南美，今天在亚洲多地栽培。环境允许生长、人类选择种植与天然群落组成，是三个不同问题。'},
    question:{prompt:'看到巢蕨长在树上，哪种解释更合理？',options:['它一定从树体吸取养分','树提供支撑，水分和腐解落叶也能供给它','只要潮湿，根一直浸水会更好'],correctIndex:1,explanation:'附生植物借用位置和支撑，不等于寄生。辨认生境还要观察光照、空气湿度与根区通气。'},
    sourceLinks:[
      {title:'NASA · 热带雨林的水热与植被',url:'https://science.nasa.gov/kids/earth/mission-biomes/biorainforest/'},
      {title:'NParks · 巢蕨的附生结构',url:'https://biodiversitysg.nparks.gov.sg/our-biodiversity/ferns/bird-s-nest-fern/'},
      {title:'Kew · 巢蕨当前原生范围',url:'https://powo.science.kew.org/taxon/17048040-1'},
      {title:'Kew · 橡胶树与栽培',url:'https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A349913-1/general-information'}
    ],
    mapNote:'定位婆罗洲的巢蕨原生地区示例。三种植物用于比较，各有自己的代表地点，不表示它们在这个点共同出现。',
    climateCodes:['Af','Am'], climateMapLabel:'高亮湿热气候线索（Af、Am，1951–2000）；不是雨林现状、巢蕨范围或森林边界。'
  },
  {
    id:'savanna', title:'热带草原与疏林', kicker:'第二站 · 雨季长，干季省',
    lon:30, lat:-22.5, landscape:'南非林波波的干燥疏林', focusPlantId:'baobab', beatIndex:1,
    summary:'暖热地区如果雨水集中在一部分季节，植物就要度过明显的干季。草、灌木和树木的比例还受火、取食、土壤及土地利用影响。',
    climate:[{label:'热量',value:'暖热，部分地区有冷季风险'},{label:'水分',value:'雨季与干季交替'},{label:'关键节律',value:'水什么时候到，比总量也重要'}],
    chain:[
      {title:'环境',text:'雨季可以生长，干季持续缺水，幼苗能否建立也与降雨时机有关。'},
      {title:'形态',text:'非洲猴面包树有粗大储水组织，干季会落叶，减少水分消耗。'},
      {title:'生长结果',text:'这些特点帮助它渡过干季，但幼苗仍需雨季水分，霜冻和长期湿涝仍会限制生存。'}
    ],
    plants:[
      {id:'baobab',role:'非洲猴面包树：认识干季落叶与储水'},
      {id:'sorghum',role:'高粱：较耐旱的暖季栽培作物，仍需有效供水'},
      {id:'pearl',role:'珍珠粟：旱地农业对照，播种期要与雨季衔接'}
    ],
    contrast:{title:'天然草原与农田要分开看',text:'高粱、珍珠粟是帮助比较季节性缺水的作物例子，不是天然草原的完整组成。田间品种、播期与管理会改变它们能在哪里生产。'},
    question:{prompt:'两地年降雨总量相近，就能判断植物景观相同吗？',options:['不能，还要看雨季时机、干季长度、土壤与扰动','能，年总量决定全部植被','只需比较纬度'],correctIndex:0,explanation:'植物要面对每一天可用的水，而不是一个年总数。雨水是否与生长季重合、根区能否储水，都会改变结果。'},
    sourceLinks:[
      {title:'SANBI · 非洲猴面包树的生境与落叶',url:'https://pza.sanbi.org/adansonia-digitata'},
      {title:'南非政府 · 稀树草原与林波波植物',url:'https://www.gov.za/about-sa/forestry-fisheries-and-environment'},
      {title:'SANBI · 稀树草原生态系统指南',url:'https://www.sanbi.org/wp-content/uploads/2024/06/2021_Ecosystem-Guidelines-for-the-Savanna-Biome.pdf'}
    ],
    mapNote:'定位非洲猴面包树的林波波原生地区示例。草原、疏林与农田的实际边界不能从该点或气候分类推出。',
    climateCodes:['Aw','As'], climateMapLabel:'高亮有明显干季的热带气候线索（Aw、As，1951–2000）；不包含全部草原，也不等于猴面包树范围。'
  },
  {
    id:'desert', title:'荒漠', kicker:'第三站 · 水来时抓住，水少时慢用',
    lon:-111, lat:32.4, landscape:'北美索诺兰沙漠', focusPlantId:'saguaro', beatIndex:1,
    summary:'荒漠首先意味着长期水分紧缺，并不都炎热。这里选索诺兰的巨人柱，看储水茎、降雨时机与幼苗庇护怎样一起作用。',
    climate:[{label:'水分',value:'少雨，降雨常有间歇'},{label:'热量',value:'荒漠也有冷、热之分'},{label:'关键阶段',value:'幼苗与成年株耐性不同'}],
    chain:[
      {title:'环境',text:'两次降雨之间可能持续干燥，植物必须补水并降低消耗。'},
      {title:'形态',text:'巨人柱的绿色茎能储水和光合，纵肋随水量变化伸缩，浅而广的根系接收降雨。'},
      {title:'生长结果',text:'它仍需要适时降雨；幼苗常借助灌木或岩石遮护。越干、越晒或越冷，并不越适合它。'}
    ],
    plants:[
      {id:'saguaro',role:'巨人柱：观察储水茎与纵肋'},
      {id:'agave',role:'美洲龙舌兰：肉质叶是另一种储水形式'},
      {id:'date',role:'椰枣：绿洲栽培要把地下水或灌溉算进去'}
    ],
    contrast:{title:'沙漠中有果园，不代表只靠雨水',text:'巨人柱是索诺兰的原生植物例子；椰枣果园则常依赖灌溉或地下水。看见一种植物在当地出现，要继续问它的水从哪里来。'},
    question:{prompt:'在少雨地区看到椰枣果园，最应该继续查什么？',options:['那里一定其实不干旱','所有沙漠植物都完全不需要水','果园是否有地下水或灌溉，以及供水是否可靠'],correctIndex:2,explanation:'栽培会改变植物获得水的方式。当地气候、根区供水与人类管理必须一起看，才能解释果园的存在。'},
    sourceLinks:[
      {title:'NPS · 仙人掌的根、刺与储水茎',url:'https://www.nps.gov/sagu/learn/nature/cacti-and-desert-succulents.htm'},
      {title:'NPS · 巨人柱纵肋的作用',url:'https://www.nps.gov/tont/learn/nature/saguaro.htm'},
      {title:'FAO · 椰枣灌溉与供水',url:'https://www.fao.org/4/y4360e/y4360e0b.htm'}
    ],
    mapNote:'定位索诺兰沙漠的巨人柱原生地区示例。全球热、冷荒漠都被高亮时，也不能据此把巨人柱放到所有荒漠。',
    climateCodes:['BWh','BWk'], climateMapLabel:'高亮热、冷荒漠气候线索（BWh、BWk，1951–2000）；不是巨人柱适生图，也不是现实沙地范围。'
  },
  {
    id:'temperate', title:'温带季节性森林', kicker:'第四站 · 生长有季节，落叶有原因',
    lon:-1.5, lat:52, landscape:'英国低地林地', focusPlantId:'englishoak', beatIndex:1,
    summary:'中纬度许多地区有明显冷暖季节。夏栎、糖枫等落叶树把展叶生长集中在较有利的季节，林下、土层和更新空间仍然重要。',
    climate:[{label:'热量',value:'冷暖随季节变化'},{label:'水分',value:'土层要有可用水'},{label:'关键节律',value:'展叶、生长、落叶与休眠'}],
    chain:[
      {title:'环境',text:'冷季的低温与光照限制生长，暖季又可能遇到干旱。'},
      {title:'形态',text:'夏栎有圆裂叶与长柄橡实；落叶休眠让它不必整年维持同一片树冠。'},
      {title:'生长结果',text:'暖季展叶仍依赖根区供水；成熟大树存在，不等于阴暗或被啃食的林下总有幼树更新。'}
    ],
    plants:[
      {id:'englishoak',role:'夏栎：认识裂叶、橡实与季节性落叶'},
      {id:'sugarmaple',role:'糖枫：北美东部的对照，幼树可在林下等待光隙'},
      {id:'apple',role:'苹果：果园还要考虑品种需冷、晚霜与成熟热量'}
    ],
    contrast:{title:'森林树与果园树，问题不完全相同',text:'糖枫的生长条件不能只用枫糖采集季节概括；苹果能存活也不等于稳定结果。季节如何衔接，比一个年均温更有解释力。'},
    question:{prompt:'冬季看到夏栎落叶，哪种理解更合适？',options:['没有叶子就说明树已经死亡','这是季节性休眠的一部分，还要观察芽、枝和来春展叶','所有温带树木冬季都会落叶'],correctIndex:1,explanation:'落叶是这类树的季节节律，不等于死亡；常绿树、不同物种及不同地点的节律也有区别。'},
    sourceLinks:[
      {title:'NASA · 温带落叶森林与四季',url:'https://science.nasa.gov/kids/earth/mission-biomes/biotemperate/'},
      {title:'SANBI · 夏栎形态与湿润土层',url:'https://pza.sanbi.org/quercus-robur'},
      {title:'美国林务局 · 糖枫生态',url:'https://research.fs.usda.gov/feis/species-reviews/acesac'}
    ],
    mapNote:'定位英国低地的夏栎原生地区示例；糖枫与苹果分别使用自己的地区案例，不表示三者在此组成天然群落。',
    climateCodes:['Cfa','Cfb','Cwa','Cwb','Dfa','Dfb','Dwa','Dwb'], climateMapLabel:'高亮温带与部分大陆性气候线索（1951–2000）；其中也有草地、农田和城市，不能当作落叶森林现状。'
  },
  {
    id:'boreal', title:'北方针叶林', kicker:'第五站 · 冬长夏短，常绿也会慢下来',
    lon:26, lat:63, landscape:'芬兰森林', focusPlantId:'scotspine', beatIndex:2,
    summary:'北半球高纬度的许多森林面对漫长寒冬与较短生长季。松、云杉常见，也有落叶桦树；同一片森林里并非只有针叶树。',
    climate:[{label:'热量',value:'冬季长，生长季较短'},{label:'水分',value:'水多不等于根可利用'},{label:'关键区别',value:'针叶、落叶与耐寒不能画等号'}],
    chain:[
      {title:'环境',text:'寒冷季节限制根的吸水和地上生长，林地还存在干湿、土壤和光隙差异。'},
      {title:'形态',text:'欧洲赤松通常两针一束、上部树皮橙红；欧洲云杉针叶单生、成熟球果下垂。'},
      {title:'生长结果',text:'保留针叶不代表冬季仍旺盛生长。赤松喜光，云杉更要留意浅层根区失水，不能只按“针叶树”统一判断。'}
    ],
    plants:[
      {id:'scotspine',role:'欧洲赤松：两针成束，认识北方原生林与光照'},
      {id:'norwayspruce',role:'欧洲云杉：单生针叶与下垂球果，根区条件不同'},
      {id:'silverbirch',role:'垂枝桦：北方也有落叶阔叶树，林隙有利更新'}
    ],
    contrast:{title:'针叶树不只生长在北方',text:'欧洲赤松原生范围从欧洲延伸到亚洲，也超出本次高亮的寒冷气候。山地会提供冷凉环境，而森林组成还受种源、土壤与管理影响。'},
    question:{prompt:'冬天针叶仍是绿色，可以推出什么？',options:['树仍像夏天一样快速生长','所有常绿树都适合严寒地区','它保留叶片，但生长仍受温度、光照和可用水限制'],correctIndex:2,explanation:'常绿描述换叶方式，耐寒和生长速率是另外的特征。热带也有常绿树，北方也有落叶树。'},
    sourceLinks:[
      {title:'NASA · 针叶森林的季节与植被',url:'https://science.nasa.gov/kids/earth/mission-biomes/bioconiferous/'},
      {title:'Forest Research · 欧洲赤松的范围与需光性',url:'https://www.forestresearch.gov.uk/tools-and-resources/tree-species-database/131589-scots-pine-sp-2/'},
      {title:'NC State · 欧洲云杉生态与形态',url:'https://plants.ces.ncsu.edu/plants/picea-abies/'},
      {title:'NC State · 垂枝桦',url:'https://plants.ces.ncsu.edu/plants/betula-pendula/'}
    ],
    mapNote:'定位芬兰的欧洲赤松原生地区示例；坐标不是林分调查，也不表示这里是纯赤松林。',
    climateCodes:['Dfc','Dfd','Dwc','Dwd'], climateMapLabel:'高亮部分长冬短夏的历史气候线索（1951–2000）；不是全部北方森林，赤松和其他针叶树也生长在高亮区之外。'
  },
  {
    id:'wetland', title:'湿地与水域', kicker:'第六站 · 不只问有水，还要问什么水',
    lon:117, lat:30.5, landscape:'中国东部浅水湿地', focusPlantId:'lotus', beatIndex:1,
    summary:'湿地横跨寒冷到热带，并不是一条纬度带。莲、海草和泥炭藓都与水有关，却分别面对淡水、海水或湿润陆地微环境。',
    climate:[{label:'水体',value:'淡水、海水与湿润地表有别'},{label:'位置',value:'水深、流速、水位很关键'},{label:'光照',value:'水下也需要足够光'}],
    chain:[
      {title:'环境',text:'浅水、底泥与充足光照，提供莲的生长空间；深水、急流或长期遮阴不是同一种生境。'},
      {title:'形态',text:'莲的根茎生长在泥中，叶柄把完整盾状叶托向水面上；泥里的藕是根茎，不是根。'},
      {title:'生长结果',text:'环境相近要具体到水深和根区。大叶藻生活在有光的近岸海水，泥炭藓则依赖稳定湿润的小生境，三者不能互换。'}
    ],
    plants:[
      {id:'lotus',role:'莲：浅淡水与泥质根区，有野生也有栽培'},
      {id:'eelgrass',role:'大叶藻：近岸海水中的开花植物，不是海藻'},
      {id:'sphagnum',role:'泥炭藓：小尺度水位与湿度的重要性'}
    ],
    contrast:{title:'有水不能替代生境判断',text:'海水盐度、水体透明度、淹水时长与底质都能改变植物选择。地图上的蓝色只表示水面时，仍不足以判断水下会长哪种植物。'},
    question:{prompt:'把莲移到近岸海草床，理由是“都有水”，这个判断缺了什么？',options:['还缺盐度、水深、光照、底质和水流条件','只缺植物名称的翻译','只要增加水量即可'],correctIndex:0,explanation:'淡水莲与海水大叶藻的生境不同。温暖与有水只是部分线索，必须进一步看水体性质与生长位置。'},
    sourceLinks:[
      {title:'Kew · 莲的结构与生境',url:'https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A605422-1/general-information'},
      {title:'NOAA资料库 · 大叶藻的近岸光照与底质',url:'https://repository.library.noaa.gov/view/noaa/41974/noaa_41974_DS1.pdf'},
      {title:'英国苔藓学会 · Sphagnum palustre生境',url:'https://www.britishbryologicalsociety.org.uk/wp-content/uploads/2020/12/Atlas-of-British-and-Irish-Bryophytes-V1-364.pdf'}
    ],
    mapNote:'定位中国东部的莲原生地区示例，也存在长期栽培；不能把这里每片水体都判成野生莲。湿地位置需水文或实测资料，不能用气候网格代替。',
    climateCodes:[], climateMapLabel:'本站不按气候高亮湿地。湿地与水域跨越多个气候区，需另看水文、盐度、底质与光照。'
  }
];
