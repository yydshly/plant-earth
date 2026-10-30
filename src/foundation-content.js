// A geography-and-ecology prelude for readers with no assumed vocabulary.
// Locations guide the camera only. Process illustrations are simplified models,
// not observations, forecasts, measured weather or complete vegetation ranges.
export const FOUNDATION_INTRO = {
  title:'先认识地球，再理解雨林',
  summary:'不用先懂地理。从陆地与海洋开始，沿着阳光、水和植物的关系，一步一步看懂。',
  scope:'先导中的光束、水汽与森林结构是原理示意；地图位置只是帮助定位。'
};

export const FOUNDATION_STEPS = [
  {
    id:'landsea', title:'这个球上，哪里是陆地和海洋？', kicker:'先认识地图 · 1 / 7',
    lon:105, lat:28, mode:'landsea',
    summary:'先找“中国”，再看它所在的亚洲。地球转过去，还会看到其他大块陆地和相连的海洋。',
    why:'植物不能只按国家名字理解：一片森林可能跨过国界，同一个国家也可能同时有森林、草原和荒漠。先认清位置，再问环境。',
    action:'点“中国”找熟悉的位置，再点一个洲名，看看它在地球的哪一面。',
    keyTerms:[
      {term:'陆地',meaning:'露出水面的地表；大块陆地与周围岛屿帮助我们辨认地图。'},
      {term:'海洋',meaning:'地球上相互连通的大面积咸水，是重要的水汽来源。'},
      {term:'洲',meaning:'认识世界时使用的大区名称。中国位于亚洲，洲不是一种气候。'}
    ],
    sourceLinks:[
      {title:'NOAA · 地球海洋与相互连接的海盆',url:'https://oceanservice.noaa.gov/facts/howmanyoceans.html'},
      {title:'Met Office · 海陆位置如何影响气候',url:'https://weather.metoffice.gov.uk/climate/climate-explained/climate-zones'}
    ],
    narration:[
      '先把地球当成一张可以转动的地图。认出陆地和海洋，再找中国。中国所在的大区叫亚洲，海洋则把许多陆地隔开，又彼此相连。',
      '转动地球，你会看到非洲、欧洲、美洲和其他地区。洲名帮我们找位置，国家边界帮我们认识国家，但这些线不会替植物挡住阳光或雨水。',
      '所以，同一个国家里可能既有森林，也有草原或荒漠。一片森林也可能跨过国界。接下来我们先学会定位，再看植物生活的条件。'
    ]
  },
  {
    id:'equator', title:'赤道和“南北”是什么意思？', kicker:'学会定位 · 2 / 7',
    lon:105, lat:8, mode:'equator',
    summary:'赤道把地球分成北半球和南半球。它是一条定位用的假想线，地面上没有绕地球一圈的绳子。',
    why:'知道一个地方靠近赤道还是靠近两极，就有了理解阳光差异的第一条线索；但位置本身还不能告诉我们那里一定长什么植物。',
    action:'沿赤道找一圈：它既经过海洋，也经过陆地。再找中国位于它的哪一侧。',
    keyTerms:[
      {term:'赤道',meaning:'把地球分成南北两半的假想圆线，记作纬度零度。'},
      {term:'北半球 / 南半球',meaning:'赤道以北的一半 / 赤道以南的一半。'},
      {term:'纬度',meaning:'用角度说明地点在赤道以北或以南的位置；这里先不用背数字。'}
    ],
    question:{prompt:'赤道是一条什么线？',options:['地面上真实存在的一圈道路','帮助我们定位、区分南北半球的假想线','把所有雨林围起来的边界'],correctIndex:1,explanation:'赤道是位置参照，不是道路，也不是植物分布的边界。'},
    sourceLinks:[
      {title:'NOAA · 纬度、赤道与南北半球',url:'https://oceanservice.noaa.gov/facts/latitude.html'}
    ],
    narration:[
      '现在看地球中间标出的赤道。它把地球分成北半球和南半球，是帮助定位的假想线，不是地面上真实存在的一圈绳子。',
      '中国位于北半球，婆罗洲靠近赤道。沿着赤道转一圈，会经过海洋，也会经过陆地。纬度用角度说明一个地点在赤道以北或以南的位置。',
      '你暂时不必记住这些数字。先分清靠近赤道、远离赤道和接近两极，就能开始比较阳光。赤道不是雨林边界，更不能单独决定植物分布。'
    ]
  },
  {
    id:'sunlight', title:'同样的阳光，为什么有的地方更暖？', kicker:'看见能量差异 · 3 / 7',
    lon:25, lat:0, mode:'sunlight',
    summary:'同一束光，照得较直时集中在较小面积；斜着照时摊得更开。每小块地面分到的能量就不同。',
    why:'从一年平均看，赤道附近通常得到较多太阳能，两极较少。这是理解地球冷暖格局的起点；云、海洋、海拔和季节还会继续改变结果。',
    action:'切换“照得较直”和“斜着照”，比较同一束光铺开的面积，不比较太阳到地球表面那一点点距离。',
    keyTerms:[
      {term:'太阳能',meaning:'阳光带来的能量，能加热地面并推动蒸发。'},
      {term:'热带',meaning:'赤道两侧的一片纬度区域，通常全年较暖；并不是每处都湿润。'},
      {term:'季节',meaning:'地轴倾斜、地球绕太阳运行，使日照角度和白昼长短在一年中变化。自转主要造成昼夜。'}
    ],
    question:{prompt:'图中斜着照时，为什么每小块地面分到的光能变少？',options:['同一束光分摊到了更大面积','因为地面突然离太阳远了很多','因为阳光变成了冷气'],correctIndex:0,explanation:'这里比较相同光束的几何效果。斜照把能量摊开；现实气温还受大气、海洋和季节等影响。'},
    sourceLinks:[
      {title:'NASA · 阳光入射角、面积与地球能量收支',url:'https://science.nasa.gov/earth/earth-observatory/climate-and-earths-energy-budget/'},
      {title:'NOAA · 热带接受的太阳能与大气运动',url:'https://www.noaa.gov/jetstream/tropical'}
    ],
    narration:[
      '想象用同一束光照地面。照得较直，光集中在较小面积；斜着照，光就铺得更开，每小块地面分到的能量较少。',
      '从一年平均看，赤道附近通常得到较多太阳能，两极较少。这主要与地球形状和日照方式有关，不是因为赤道比两极离太阳近很多。',
      '图里是简化比较，不能拿来算今天的气温。云、海洋和海拔都会影响冷暖。地球自转造成昼夜，地轴倾斜并绕太阳运行，才让日照和季节随一年变化。'
    ]
  },
  {
    id:'water-cycle', title:'雨水从哪里来？', kicker:'把水的过程接起来 · 4 / 7',
    lon:114, lat:2, mode:'watercycle',
    summary:'水先变成水汽进入空气。含水汽的空气上升、冷却，一部分水汽凝成小水滴；水滴长大后，才可能落成雨。',
    why:'太阳提供蒸发所需的能量，但有热量还不够：也要有水汽，并有合适的上升和冷却过程。并不是所有热空气都会下雨。',
    action:'依次观察“水变水汽 → 空气上升冷却 → 云滴长大下雨”。水一直在循环，没有凭空增加。',
    keyTerms:[
      {term:'蒸发',meaning:'液态水变成看不见的水汽，进入空气。'},
      {term:'蒸腾',meaning:'植物吸收的水，一部分经叶片回到空气里。'},
      {term:'凝结与降雨',meaning:'水汽冷却到合适条件后形成小水滴；云滴或冰粒长大，才可能落到地面。'}
    ],
    sourceLinks:[
      {title:'NOAA · 蒸发、蒸腾、凝结与降水',url:'https://www.noaa.gov/jetstream/atmosphere/hydro'},
      {title:'NASA · 热带降雨与暖湿空气上升',url:'https://gpm.nasa.gov/resourcse/faq/why-do-tropics-have-more-precipitation-other-locations'},
      {title:'USGS · 水循环中的蒸发与蒸腾',url:'https://www.usgs.gov/glossary/glossary-water-cycle-terms'}
    ],
    narration:[
      '雨不是天空凭空制造的水。海面、河流和潮湿地面的水会蒸发，变成看不见的水汽。植物也会把吸收的一部分水，经叶片送回空气。',
      '当含有水汽的空气上升，它会膨胀并冷却。冷却到合适条件，一部分水汽凝成小水滴，形成云。云里的水滴或冰粒继续长大，才可能落成雨。',
      '所以不能只说热了就会下雨。还要问水汽从哪里来，空气能不能上升和冷却。水落回地面，再流动、蒸发和被植物利用，接着循环。'
    ]
  },
  {
    id:'forest', title:'有了水和热，森林怎样长起来？', kicker:'从天气过程走向植物生活 · 5 / 7',
    lon:114, lat:2, mode:'forest',
    summary:'如果许多年里常有温暖条件和可用水，许多树木能持续生长。树冠形成后，又把森林分出明亮的上层和较暗的林下。',
    why:'植物利用光制造生长所需的物质，还需要水、养分和适合根系的条件。森林长起来后，也会改变光照、湿度和水的循环。',
    action:'在“树冠”和“林下”之间切换：同一片森林里，每株植物得到的光和根部条件并不一样。',
    keyTerms:[
      {term:'气候',meaning:'一个地方许多年里常见的天气特点，不是今天这一场雨。'},
      {term:'树冠 / 林下',meaning:'树上枝叶组成的上层 / 树冠下面的空间。它们的光照和湿度可能很不同。'},
      {term:'生态',meaning:'生物和周围环境怎样相互影响，例如树遮阴、根吸水、叶片把水送回空气。'}
    ],
    sourceLinks:[
      {title:'NASA · 雨林的森林层次、光照与分解',url:'https://science.nasa.gov/kids/earth/mission-biomes/biorainforest/'},
      {title:'NASA · 水循环中的植物作用',url:'https://science.nasa.gov/earth/earth-observatory/the-water-cycle/'},
      {title:'Met Office · 气候区与多年环境',url:'https://weather.metoffice.gov.uk/climate/climate-explained/climate-zones'}
    ],
    narration:[
      '把时间拉长来看。如果许多年里常有温暖条件和可用水，许多树木就有机会持续生长。我们把一个地方多年常见的天气特点，叫作气候。',
      '树木用光制造生长所需的有机物，也需要水、养分和适合根系的条件。树长高后，枝叶组成树冠，挡住一部分阳光，下面的林下就比较暗。',
      '因此，同一片森林也有不同的小环境。树木改变光照和湿度，植物又把水送回空气。生物与环境这样相互影响，就是我们正在认识的生态关系。'
    ]
  },
  {
    id:'rainforest', title:'现在把原因连起来：雨林为什么在这里？', kicker:'来到亚洲的婆罗洲 · 6 / 7',
    lon:114, lat:2, mode:'rainforest',
    summary:'婆罗洲靠近赤道，周围有温暖海洋。较充足的太阳能、水汽供应和经常发生的降雨，共同帮助许多地方维持暖湿森林。',
    why:'“热带雨林”不是一句神秘的地理名词：热带说的是大致纬度区域，雨林说的是一种多雨环境下形成的森林。形成它需要长期配合的条件。',
    action:'沿着“亚洲 → 东南亚 → 婆罗洲”定位，再把阳光、水汽、上升降雨和森林生长接成一条因果链。',
    keyTerms:[
      {term:'东南亚',meaning:'亚洲东南部的一大片地区；婆罗洲是其中一座靠近赤道的大岛。'},
      {term:'雨林',meaning:'在长期多雨条件下形成的森林；热带之外也有温带雨林。'},
      {term:'持续配合',meaning:'暖和与可用水要在较长时间里配合，不是仅有一次高温或一次暴雨。'}
    ],
    sourceLinks:[
      {title:'NASA · 雨林的环境、位置与结构',url:'https://science.nasa.gov/kids/earth/mission-biomes/biorainforest/'},
      {title:'NASA · 热带水汽、上升与降雨',url:'https://gpm.nasa.gov/resourcse/faq/why-do-tropics-have-more-precipitation-other-locations'},
      {title:'Met Office · 热带雨林、季风与干湿季差异',url:'https://weather.metoffice.gov.uk/climate/climate-explained/climate-zones'}
    ],
    narration:[
      '现在来到婆罗洲。先在亚洲找到东南亚，再找到这座靠近赤道的大岛。这里的许多地方，长期具备温暖条件，周围海洋又能提供水汽。',
      '较充足的太阳能帮助加热和蒸发，含水汽的空气上升冷却，形成云雨。水和热在较长时间里配合，帮助树木生长，逐渐形成层次丰富的暖湿森林。',
      '这就是理解热带雨林的一条起点，而不是万能公式。风向、季风、山地和海洋还会改变各地的降雨，土地利用也会改变森林。靠近赤道，不等于每处都有雨林。'
    ]
  },
  {
    id:'check-pattern', title:'很热，就一定会长雨林吗？', kicker:'带着规律走进六站 · 7 / 7',
    lon:20, lat:12, mode:'contrast',
    summary:'热量相近，植物景观也可能不同。干季太长、水汽少、山地遮挡或人类改变土地，都可能让结果发生变化。',
    why:'理解分布，要连续问：在哪里？阳光与季节怎样？水从哪来、何时可用？地形和人类又改变了什么？',
    action:'先做一个判断，再进入六种环境：把同一套问题用到雨林、草原、荒漠、森林和水域。',
    keyTerms:[
      {term:'干季',meaning:'一年中持续较少雨的一段时期，植物可能要靠储水、落叶或休眠度过。'},
      {term:'地形',meaning:'山地、平原等地表起伏，会影响温度、风和降雨。'},
      {term:'人为管理',meaning:'灌溉、种植和采伐等活动会改变植物获得的条件与景观。'}
    ],
    question:{prompt:'两处都很暖，为什么一处可能是雨林，另一处却很干？',options:['因为在同一个洲，植物应该完全一样','只看今天是否下雨，就能确定长期森林类型','还要比较水汽、降雨季节、地形及人类活动'],correctIndex:2,explanation:'热量只是条件之一。要看许多年里的水热配合，并了解当地地形和土地利用，不能仅凭一个洲名或一天的天气判断。'},
    sourceLinks:[
      {title:'Met Office · 风、海洋与不同气候区',url:'https://weather.metoffice.gov.uk/climate/climate-explained/climate-zones'},
      {title:'Met Office · 山地如何增强降雨',url:'https://weather.metoffice.gov.uk/learn-about/weather/types-of-weather/rain/how-much-does-it-rain-in-the-uk'},
      {title:'NASA · 从环境条件理解雨林植物',url:'https://science.nasa.gov/kids/earth/mission-biomes/teacherresource/'}
    ],
    narration:[
      '最后做个比较。两处都很暖，也不一定长出相同的森林。如果空气缺少水汽，或一年有很长的少雨时期，植物就要面对不同的缺水压力。',
      '山地会让空气被迫抬升，也能改变不同方向的降雨；海洋和风向会影响水汽输送。灌溉、采伐与种植，又可能改变眼前的植物景观。',
      '所以先问在哪里，再问阳光、水和季节，最后加上地形与人类活动。带着这套问题，接下来走进六种典型环境，看植物的叶、茎和根怎样回应这些条件。'
    ]
  }
];
