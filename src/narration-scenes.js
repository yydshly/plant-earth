// Narration is the clock: anchors are literal UTF-16 offsets in chapter.text.
// These are observation tasks and process diagrams, never occurrence/range data.
// No DOM, timers, audio or rendering state is read here. The same offset always
// selects the same scene, including backwards seeking and replay.

const row=(anchor,title,lookAt,explain,effect,phase='default',extra={})=>({anchor,title,lookAt,explain,effect,phase,...extra});
const point=(lon,lat,label)=>({lon,lat,label});
const state=(key,value)=>({foundationState:{key,value}});
const demonstration=(kind,phase)=>({demonstration:{kind,phase}});
const SCENES={
  'foundation-landsea':[
    row('','先把球当成地图','先分清陆地与海洋，再找中国。','地球可以转动；眼前的位置只是看地图的起点。','location','locate',{guideLesson:'landsea'}),
    row('中国所在的大区叫亚洲','中国在亚洲','看中国与亚洲的名称，再看周围海洋。','洲帮助认识大片陆地区域，海洋相连并隔开许多陆地。','location','continent',{guideLesson:'landsea'}),
    row('海洋则把许多陆地隔开','海洋相连，陆地被水域分隔','看蓝色海面与陆地边缘，再沿水面寻找相连的方向。','地球上的海洋彼此连通；海岸线是海陆交界，不是国家边界。这里展示海陆关系，不是海流方向。','ocean','basins',{focus:point(76,-26,'印度洋 · 海洋位置参照'),guideLesson:'landsea',...demonstration('ocean','basins')}),
    row('转动地球','换一面找大洲','跟随地球转到非洲这一面。','旁白也提到欧洲、美洲等地区；洲名用于定位。','location','locate',{focus:point(20,4,'非洲 · 洲名定位示意'),guideLesson:'landsea'}),
    row('洲名帮我们找位置','边界不能挡住雨水','看洲名和国家边界，分清位置与环境。','国家边界是地理参照，并不替植物决定阳光和雨水。','compare','boundaries',{guideLesson:'landsea'}),
    row('所以，同一个国家里','一个国家也有多种景观','把森林、草原和荒漠当作待解释的问题。','同一国家内可有不同景观，森林也可能跨越国界。这里不是植被范围图。','compare','scope',{guideLesson:'landsea'})
  ],
  'foundation-equator':[
    row('','找到赤道，分清南北','沿赤道看一圈，再看线两侧的南北半球。','赤道是帮助定位的假想线，不是地面上的绳子，也不是植物边界。','equator','both',{focus:point(105,0,'赤道 · 0°纬线'),guideLesson:'equator',guideGroups:['equator','axis']}),
    row('中国位于北半球','从中国找到婆罗洲','看中国在赤道以北，婆罗洲靠近赤道。','这是位置对照，不表示两地环境完全相同。','location','locate',{focus:point(114,2,'婆罗洲 · 靠近赤道'),guideLesson:'equator',guideGroups:['equator']}),
    row('纬度用角度说明','纬度是在说位置','以赤道为零，观察向北或向南的纬度。','现在先理解方向；暂时不用背数字。','equator','latitude',{guideLesson:'equator',guideGroups:['equator','graticule']}),
    row('先分清靠近赤道','位置是第一条线索','比较赤道附近与两极的方向。','接下来才讨论阳光；赤道本身不是雨林边界。','compare','latitude',{guideLesson:'equator',guideGroups:['equator','axis']})
  ],
  'foundation-sunlight':[
    row('','同一束光，先看直照','看较直的光束落在较小面积。','同一束光的几何比较示意，不是今天的气温实测。','sunlight','direct',{guideLesson:'sunlight',...state('sunlight','direct')}),
    row('斜着照','再看斜照','看光束铺开的面积变大。','相同能量分摊到更大面积，每小块地面分到的能量较少。','sunlight','slant',{guideLesson:'sunlight',...state('sunlight','slant')}),
    row('从一年平均看','把原理放回地球','用赤道与两极作为位置参照。','赤道附近一年平均通常获得较多太阳能；不是因为离太阳近很多。','sunlight','latitude',{guideLesson:'sunlight',guideGroups:['equator','axis','zones']}),
    row('图里是简化比较','原理图的边界','把光照示意与实际天气分开。','云、海洋和海拔也影响冷暖，不能从这束光算出今天气温。','compare','scope',{guideLesson:'sunlight'}),
    row('地球自转造成昼夜','昼夜与季节是两件事','分清自转的昼夜，与倾斜地轴下的年内变化。','此处只示意原理，不把当前画面当成实时季节。','season','season',{guideLesson:'sunlight',guideGroups:['axis','equator']})
  ],
  'foundation-water-cycle':[
    row('','先看水怎样进入空气','看海面、河流和湿润地面，再沿向上箭头看蒸发。','液态水变成水汽进入空气。图中的移动符号用来追踪过程；水汽本身看不见。','evaporation','sea',{guideLesson:'water-cycle',...state('water-cycle','vapour'),...demonstration('water-cycle','evaporation')}),
    row('植物也会把吸收的一部分水','植物也把水送回空气','看根从地面吸水，再看叶片旁向上的箭头。','植物吸收的一部分水，经叶片蒸腾回到空气；海洋并不是唯一的水汽来源。','evaporation','transpiration',{guideLesson:'water-cycle',...state('water-cycle','vapour'),...demonstration('water-cycle','evaporation')}),
    row('当含有水汽的空气上升','湿空气上升、冷却','沿向上箭头看空气冷却，再看小云滴。','含水汽的空气上升、膨胀、冷却后，一部分水汽才可能凝结。','cloud','condense',{guideLesson:'water-cycle',...state('water-cycle','cloud'),...demonstration('water-cycle','cloud')}),
    row('云里的水滴或冰粒继续长大','云滴长大才可能下雨','看云里的小滴长大，再看落雨方向。','有云不一定下雨；这是简化降雨过程，不是天气预报。','rain','fall',{guideLesson:'water-cycle',...state('water-cycle','rain'),...demonstration('water-cycle','rain')}),
    row('所以不能只说热了就会下雨','把必要条件接起来','依次找水汽来源、上升冷却和返回地面的水。','热量不是充分条件；降雨还需要合适的水汽与空气过程。','compare','conditions',{guideLesson:'water-cycle',...demonstration('water-cycle','cycle')}),
    row('水落回地面','水回到地面，继续循环','沿降雨向下看，再沿地面水流和植物吸水的箭头观察。','水可以流动、渗入地面、被植物利用，也可以再次蒸发。示意线没有按真实距离或流量绘制。','water','cycle',{guideLesson:'water-cycle',...demonstration('water-cycle','cycle')})
  ],
  'foundation-forest':[
    row('','把时间拉长','看温暖条件与可用水长期配合。','讨论多年常见条件，即气候；不是下一次降雨预报。','forest','water-heat',{guideLesson:'forest',comparisonOnly:true,...state('forest','wet')}),
    row('树木用光制造','树木生长还需要什么','看光、水、养分与根区这几条线索。','森林生长原理示意，不能只从一种条件推出森林。','roots','root-zone',{guideLesson:'forest',comparisonOnly:true}),
    row('树长高后','先看上方树冠','看树木上方枝叶组成的树冠。','树冠先接触阳光，并挡住一部分照向下方的光；这是结构示意，不是该点群落调查。','canopy','canopy',{guideLesson:'forest',comparisonOnly:true,...state('forest-layer','canopy')}),
    row('下面的林下','再看下方林下','把注意力移到树冠下面。','同一片森林内，林下收到的光与上方不同；此处是层次示意。','understory','understory',{guideLesson:'forest',comparisonOnly:true,...state('forest-layer','understory')}),
    row('树木改变光照和湿度','森林也会改变环境','看植物与光、水之间的双向联系。','植物释放水分，改变光照与湿度；生物和环境相互影响。过程为示意。','forest','feedback',{guideLesson:'forest',comparisonOnly:true})
  ],
  'foundation-rainforest':[
    row('','先找到婆罗洲','亚洲 → 东南亚 → 靠近赤道的大岛。','先建立位置，地名本身还不能解释森林。','location','locate',{guideLesson:'rainforest',guideGroups:['equator','tropics']}),
    row('这里的许多地方','先认岛屿周围的海洋','看婆罗洲四周的海面，再回到赤道附近的位置。','海洋是重要水汽来源。这里先认识海陆关系，不能仅凭岛屿旁边有海就断定一定多雨。','ocean','coast',{guideLesson:'rainforest',comparisonOnly:true,...demonstration('ocean','coast')}),
    row('较充足的太阳能帮助加热和蒸发','海面的水进入空气','沿海面向上箭头看蒸发，再看含水汽的空气。','太阳能帮助加热与蒸发；水汽本身看不见，移动符号只是帮助追踪水分。','evaporation','sea',{guideLesson:'rainforest',comparisonOnly:true,...demonstration('water-cycle','evaporation')}),
    row('含水汽的空气上升冷却','把蒸发接到云雨','看上升、冷却和云雨的过程箭头。','太阳能帮助加热与蒸发；含水汽的空气还要经历适当过程才能形成云雨。','cloud','condense',{guideLesson:'rainforest',comparisonOnly:true,...demonstration('water-cycle','cloud')}),
    row('水和热在较长时间里配合','水热长期配合，树木生长','观察暖湿森林层次的示意。','森林形成需要时间，不能把一次下雨等同于一片雨林；造景仅说明层次，不是该点真实群落。','forest','water-heat',{guideLesson:'rainforest',comparisonOnly:true,...state('rainforest','wet')}),
    row('风向、季风、山地和海洋','风把水汽带向哪里？','沿箭头看空气移动；留意季节变化可能改变输送方向。','风能携带水汽，季风会随季节变化。图中箭头只示意输送过程，不是婆罗洲当前风向或风速实测。','wind','seasonal',{guideLesson:'rainforest',comparisonOnly:true,...demonstration('wind','seasonal')}),
    row('土地利用也会改变森林','同样的位置，还要看人类活动','保留海洋、风与山地的关系，再考虑土地如何使用。','靠近赤道不保证有雨林。山地可能改变抬升与降雨，土地利用也会改变森林；此图不是完整植被分布图。','terrain','limits',{guideLesson:'rainforest',comparisonOnly:true,...demonstration('terrain','limits')})
  ],
  'foundation-check-pattern':[
    row('','先比较相似，再找差别','两处都温暖，植物景观仍可能不同。','这里只比较条件，不把地球颜色当作实测森林边界。','compare','water',{guideLesson:'check-pattern'}),
    row('如果空气缺少水汽','热量不能替代水','看水汽不足和长时间少雨怎样成为限制。','这是缺水条件的比较示意，不是说眼前整个地区都同样干。','water','scarce',{guideLesson:'check-pattern'}),
    row('山地会让空气被迫抬升','空气遇到山地，会沿坡上升','先找来风方向，再沿山坡向上的箭头观察空气。','含水汽的空气被迫抬升时会膨胀、冷却；冷却到合适条件后，才可能凝结成云并降雨。山形与高度为原理示意。','terrain','uplift',{guideLesson:'check-pattern',comparisonOnly:true,...demonstration('terrain','uplift')}),
    row('也能改变不同方向的降雨','同一座山，两侧可能有差别','对照迎风侧的上升与背风侧的下降，不要把两侧当作东西方向。','迎风侧可能较多雨；越山下降的空气可增温、变干，使背风侧较干。差异取决于水汽、风向与大气条件，不是每座山都必然如此。','terrain','contrast',{guideLesson:'check-pattern',comparisonOnly:true,...demonstration('terrain','contrast')}),
    row('海洋和风向会影响水汽输送','海洋有水，还要看风往哪里吹','把海洋水汽来源与向陆地移动的空气连起来看。','箭头只表示示意空气的去向；不是地球此刻的风场。水汽输送、山地抬升与少雨季节需要组合判断。','wind','transport',{guideLesson:'check-pattern',comparisonOnly:true,...demonstration('wind','transport')}),
    row('灌溉、采伐与种植','人类也会改变景观','区分自然供水与管理带来的变化。','灌溉、采伐、种植是不同影响，不能把眼前景观全部归因于气候。','water','management',{guideLesson:'check-pattern'}),
    row('带着这套问题','带着问题进入植物世界','接下来观察叶、茎、根与具体环境。','先问位置，再问阳光、水和季节，最后看地形与人类活动。','plant','identify',{guideLesson:'check-pattern'})
  ],
  'learn-global':[
    row('','先认识地球上的案例','先看六种景观，再认植物的叶、茎和根。','六站是学习案例，不是地球全部生物群系。','location','locate',{guideLesson:'overview'}),
    row('这里的水和热怎样','先问环境','看水、热与雨水季节这几条线索。','理解分布需要比较条件；这里只提出观察问题。','water','seasonal',{guideLesson:'overview'}),
    row('还要分清三件事','分清三种不同问题','区分自然生长、现在种植与可能适合。','三者证据和含义不同，不能互相代替。','compare','region-types',{guideLesson:'overview'}),
    row('原生地区、栽培地区和潜在适生环境','名称相近，含义不同','看原生、栽培、潜在适生三个标签。','原生是自然分布；栽培涉及人为管理；潜在适生是有假设的推测。','compare','region-types',{guideLesson:'overview'}),
    row('接下来每一站','每站都跟着三步观察','看环境 → 认植物 → 自己判断。','声音会带你切换观察任务，可以暂停后回看。','plant','identify',{guideLesson:'overview'}),
    row('地球上的标记','最后看清标记的边界','把一个定位标记与完整分布范围分开。','标记是代表地区，不表示植物数量或完整分布。','location','scope',{guideLesson:'overview'})
  ],
  'learn-rainforest':[
    row('','先找到婆罗洲雨林案例','看婆罗洲与赤道的相对位置。','定位一个常年暖湿森林的地区案例，不等于完整雨林范围。','location','locate',{guideLesson:'rainforest',chainIndex:0}),
    row('树冠、林下和树枝上','同一森林也有不同位置','看上方树冠、下面林下与树枝位置。','雨水充足并不等于所有植物获得同样的光。结构为示意，不表示真实群落组成。','canopy','canopy',{guideLesson:'rainforest',chainIndex:0,comparisonOnly:true}),
    row('看巢蕨围成巢状的叶丛','观察巢蕨叶丛','看叶丛与固定位置的附生根。','旁白说明叶丛承接落叶与水分，附生不等于寄生。','plant','identify',{guideLesson:'rainforest',plantId:'birdsnestfern',focus:point(114,2,'婆罗洲 · 巢蕨原生地区示例'),chainIndex:1}),
    row('白花蝴蝶兰的附生根','根需要水，也需要空气','转到蝴蝶兰自己的爪哇代表地区，再看附生根示意。','爪哇位置沿用本图鉴有据地区资料；这里不是说它与巢蕨在婆罗洲同点出现。','roots','water-air',{guideLesson:'rainforest',plantId:'orchid',organ:'附生根',focus:point(110,-7,'印度尼西亚爪哇 · 蝴蝶兰原生地区示例'),chainIndex:2}),
    row('再想想橡胶树','原生与栽培分开看','比较南美原生与亚洲栽培的含义。','橡胶树案例用于说明人类种植；此处是概念比较，不把橡胶树标在蝴蝶兰点。','compare','region-types',{guideLesson:'rainforest',comparisonOnly:true,chainIndex:2}),
    row('地图定位的是巢蕨原生地区','回到地区标记的含义','回到婆罗洲的巢蕨代表地区定位。','不表示所有比较植物在同一点共同出现。','location','scope',{guideLesson:'rainforest',focus:point(114,2,'婆罗洲 · 巢蕨原生地区示例'),chainIndex:2})
  ],
  'learn-savanna':[
    row('','先找到南非林波波','看南半球的疏林案例位置。','这是猴面包树原生地区的代表位置，不是草原边界。','location','locate',{guideLesson:'savanna',chainIndex:0}),
    row('暖热地区如果雨水集中在雨季','雨季与干季交替','看一年中水分供应有多有少。','季节节律示意；草树比例还受火、取食、土壤和土地利用影响。','season','rain-dry',{guideLesson:'savanna',chainIndex:0}),
    row('非洲猴面包树有粗大的储水组织','看储水与干季落叶','观察粗大树干与落叶的作用示意。','旁白已说明储水、落叶减少消耗；不是所有树干粗大的植物都有同样原因。','plant','mechanism',{guideLesson:'savanna',plantId:'baobab',focus:point(30,-22.5,'南非林波波省 · 猴面包树原生地区示例'),chainIndex:1}),
    row('但耐旱不等于不需要水','耐旱也有边界','把成年树与幼苗、雨季供水分开。','幼苗仍需雨季，霜冻和长期湿涝也会限制它。','water','limits',{guideLesson:'savanna',chainIndex:2}),
    row('高粱和珍珠粟','把自然疏林与旱地农业分开','比较播种时机和有效供水。','作物帮助理解季节缺水，不是天然草原的完整组成。','compare','management',{guideLesson:'savanna',chainIndex:2}),
    row('地图只是猴面包树原生地区','定位不是范围','看代表位置，停止把它扩大成整片区域。','不能据一个点推出草原或农田边界。','location','scope',{guideLesson:'savanna',focus:point(30,-22.5,'南非林波波省 · 猴面包树原生地区示例'),chainIndex:2})
  ],
  'learn-desert':[
    row('','荒漠先看缺水','看北美索诺兰沙漠案例。','荒漠首先意味着长期水分紧缺，并不都炎热。','water','scarce',{guideLesson:'desert',chainIndex:0}),
    row('巨人柱的绿色茎','看绿色茎与纵肋','观察茎的储水结构和伸缩示意。','旁白说明绿色茎能储水、光合；纵肋随水量变化。','plant','mechanism',{guideLesson:'desert',plantId:'saguaro',focus:point(-111,32.4,'美国亚利桑那索诺兰沙漠 · 巨人柱原生地区示例'),chainIndex:1}),
    row('浅而广的根系接收降雨','水来了怎样接住','看浅而广的根区，并留意幼苗的庇护。','根系与幼苗阶段要一起看；模型不表示真实根系尺度。','roots','uptake',{guideLesson:'desert',chainIndex:2}),
    row('美洲龙舌兰则用肉质叶储水','另一种储水方式','转到龙舌兰自己的墨西哥代表地区，比较肉质叶与储水茎。','位置沿用本图鉴有据地区资料；不是把龙舌兰放在巨人柱点。','plant','identify',{guideLesson:'desert',plantId:'agave',focus:point(-102,23,'墨西哥 · 美洲龙舌兰原生地区示例'),chainIndex:1}),
    row('沙漠里的椰枣果园','果园的水从哪里来','看地下水或灌溉供水的示意。','不把椰枣放在巨人柱或龙舌兰的点；此处只比较供水机制。','water','management',{guideLesson:'desert',comparisonOnly:true,chainIndex:2}),
    row('地图定位的是巨人柱','一个原生地区，不是所有荒漠','回看索诺兰代表位置。','不能把所有荒漠都当成巨人柱的原生范围。','location','scope',{guideLesson:'desert',focus:point(-111,32.4,'美国亚利桑那索诺兰沙漠 · 巨人柱原生地区示例'),chainIndex:2})
  ],
  'learn-temperate':[
    row('','先找到英国低地林地','看中纬度案例位置。','这里用英国夏栎的原生地区举例，不表示整个温带只有这种森林。','location','locate',{guideLesson:'temperate',chainIndex:0}),
    row('许多中纬度地区冷暖季节明显','生长要放在合适的季节','比较暖季生长与冷季休眠。','季节变化示意；年平均温度不能替代整个生长过程。','season','season',{guideLesson:'temperate',chainIndex:0}),
    row('夏栎有圆裂叶与长柄橡实','先认夏栎，再看落叶','看圆裂叶和橡实；识别特征与季节节律分开。','落叶休眠不等于死亡，暖季展叶仍需根区供水。','plant','identify',{guideLesson:'temperate',plantId:'englishoak',focus:point(-1.5,52,'英国低地林地 · 夏栎原生地区示例'),chainIndex:1}),
    row('北美的糖枫','林下也在等待机会','看林下幼树与光隙关系的示意。','糖枫是北美比较案例，造景仅为原理示意，不表示与英国夏栎在此点共生。','understory','understory',{guideLesson:'temperate',comparisonOnly:true,chainIndex:2}),
    row('苹果果园还要看','能存活，还要能结果','把需冷、晚霜与成熟热量按季节连起来。','这里只比较苹果生产条件，不能从一棵树存活推出稳定结果。','season','limits',{guideLesson:'temperate',chainIndex:2}),
    row('地图举例定位英国夏栎','回到案例范围','看英国夏栎的地区定位。','糖枫与苹果各有自己的案例，三者不因此组成天然群落。','location','scope',{guideLesson:'temperate',focus:point(-1.5,52,'英国低地林地 · 夏栎原生地区示例'),chainIndex:2})
  ],
  'learn-boreal':[
    row('','先找到芬兰森林','看北半球高纬案例位置。','森林有松、云杉，也有落叶桦树，并不只有针叶树。','location','locate',{guideLesson:'boreal',chainIndex:0}),
    row('这里许多植物面对漫长寒冬','冬长、可生长时间较短','看高纬与季节参照，不把极圈当森林边界。','寒冷和生长季是环境条件；不是所有针叶树都只在这里生长。','cold','limits',{guideLesson:'boreal',chainIndex:0}),
    row('欧洲赤松通常两针一束','认赤松的针束','观察两针成束与上部树皮。','这些是旁白给出的识别线索，不把它们直接当成气候成因。','plant','identify',{guideLesson:'boreal',plantId:'scotspine',focus:point(26,63,'芬兰森林 · 欧洲赤松原生地区示例'),chainIndex:1}),
    row('欧洲云杉针叶单生','换看云杉的识别点','转到云杉自己的挪威代表地区，再看单生针叶与下垂球果。','挪威位置沿用本图鉴有据地区资料；不是把云杉画在芬兰赤松点。','plant','identify',{guideLesson:'boreal',plantId:'norwayspruce',focus:point(10,61,'挪威森林 · 欧洲云杉原生地区示例'),chainIndex:1}),
    row('保留针叶不代表冬天仍旺盛生长','常绿不等于冬季快长','把叶片保留与实际生长速度分开。','温度、光照和可用水仍会限制生长；赤松与云杉的根区和光照也要分别看。','cold','limits',{guideLesson:'boreal',comparisonOnly:true,chainIndex:2}),
    row('赤松喜光','同是针叶树，条件仍不同','看光照与浅层根区失水这两条不同线索。','此处比较旁白已说明的需求，不从针叶形状推导全部生长条件。','roots','root-zone',{guideLesson:'boreal',comparisonOnly:true,chainIndex:2}),
    row('地图定位的是芬兰赤松原生地区','案例不是全部针叶树范围','回到芬兰赤松定位，避免把高纬线当物种边界。','这不是林分调查，也不表示此处为纯赤松林。','location','scope',{guideLesson:'boreal',focus:point(26,63,'芬兰森林 · 欧洲赤松原生地区示例'),chainIndex:2})
  ],
  'learn-wetland':[
    row('','湿地不是一条纬度带','先找中国东部浅水湿地案例。','湿地与水域横跨多个气候区，不能仅由纬度判断。','location','locate',{guideLesson:'wetland',chainIndex:0}),
    row('现在看中国东部的莲','看浅淡水、泥与光','把水深、根区和光照放在一起看。','这些是莲的生境线索，不是所有水面的通用条件。','water','root-zone',{guideLesson:'wetland',plantId:'lotus',focus:point(117,30.5,'中国东部湿地 · 莲原生地区示例'),chainIndex:0}),
    row('莲的根茎生长在泥中','水下与水上的器官相连','看泥中根茎与托起叶片的叶柄。','藕是根茎，不是根；这是器官连接示意。','plant','identify',{guideLesson:'wetland',plantId:'lotus',focus:point(117,30.5,'中国东部湿地 · 莲原生地区示例'),chainIndex:1}),
    row('大叶藻则生活在有光的近岸海水','都与水有关，生境仍不同','看陆地与近岸海水的交界，再比较海水大叶藻与湿润小生境中的泥炭藓。','这里示意近岸海水生境，不把大叶藻放在莲的地图点。海水、浅淡水和湿润地面不能互相替代。','ocean','coast',{guideLesson:'wetland',comparisonOnly:true,chainIndex:2,...demonstration('ocean','coast')}),
    row('所以，有水还不够','把水的性质说清楚','继续追问盐度、水深、水流、底质与光照。','看见蓝色水面还不足以判断哪种植物能生活。','water','salinity',{guideLesson:'wetland',chainIndex:2}),
    row('地图只是莲的一个原生地区示例','地图点不能替代湿地调查','回看中国东部的莲地区示例。','当地也有栽培；不能把每片水判为野生莲生境，气候网格也不能替代调查。','location','scope',{guideLesson:'wetland',focus:point(117,30.5,'中国东部湿地 · 莲原生地区示例'),chainIndex:2})
  ],
  'plant-world-intro-v3':[
    row('','从熟悉植物进入地球','先看稻谷、森林和湿地是不同观察入口。','条目是代表案例，不是地球全部植物；栽培群也不等于独立物种。','location','locate'),
    row('这次我们用农业与自然生境中的代表条目','每个条目都问三个问题','看形态、代表地区与适应环境。','先认识结构，再解释条件，不把小模型当现场样本。','plant','identify'),
    row('农业是人类利用植物的方式','用途与分类分开','区分人类用途与植物类群。','农业并不是植物分类；蔬菜、果树和海草可属于同一大类。','compare','classification'),
    row('松柏属于裸子植物','还有不同结构和繁殖方式','对照裸子植物、蕨类、石松和苔藓。','这里建立类群入口，不根据一个模型推断所有近缘植物。','plant','identify'),
    row('打开植物图鉴','带着线索选择条目','按类群、形态、生境或用途筛选。','筛选结果还可以放回地球，进一步查看地区和资料。','location','scope'),
    row('每个小模型都连着','模型连接到什么资料','查看地区介绍、环境档案和来源。','模型是观察入口，不是分布或适生的独立证据。','compare','evidence')
  ],
  'plant-world-map':[
    row('','先读懂地图模型','把代表位置与精确采集点分开。','小模型用于区域定位，不代表完整范围。','location','scope'),
    row('原生地区说明','原生与栽培的意思不同','比较自然分布与人为种植。','两种地区身份不能互相替代。','compare','region-types'),
    row('有些植物在遥远的地方也能看到','在远方出现，仍需查来由','查看引种与园艺管理的可能性。','看见植物出现，不自动证明那里属于原生范围。','compare','region-types'),
    row('只知道某处有一棵树','一个点不能代表整个国家','避免把两个代表点连成一条分布带。','出现记录的空间含义有限，不能由此推出全部土地适宜。','location','scope'),
    row('原有作物保留历史气候候选图','候选气候与地区证据分开','区分历史气候候选图与来源支持的代表地区。','两者都不是完整的现实种植范围。','compare','evidence'),
    row('海草还需要光','回到具体生境','比较海草的光、水深、盐度与苔藓的局部湿度。','判断适生需要组合条件，不能只看某个颜色或国家名称。','water','habitat')
  ],
  'plant-world-comparison':[
    row('','把几种结构并排看','对照储水茎、针叶、支撑根与羽状叶。','这些结构来自不同案例，不是同一点的群落清单。','plant','identify'),
    row('结构提供环境线索','结构是线索，还需要证据','不要给每一种结构只配一个原因。','同一种结构可能有不止一种作用。','compare','evidence'),
    row('温度、水分、土壤和季节','陆地要组合多个条件','把水、热、土壤和季节一起比较。','不能凭单一条件判断植物会在哪里生长。','season','season'),
    row('潮汐、盐度与水下光照','水域还有另外的条件','看潮汐、盐度与水下光照。','湿地和海洋的生活条件不能照搬陆地解释。','water','salinity'),
    row('适应环境并不等于没有限制','适应也有边界','把耐旱与完全不需水区分开。','耐受某种压力，不等于所有环境都适合。','compare','limits'),
    row('这份图鉴只是认识植物多样性的起点','把观察变成自己的问题','比较三个条目，或同一植物在两处的条件。','带着地区差别继续探索，比只记国家名字更有解释力。','location','scope')
  ]
};

const cache=new WeakMap();
const finite=n=>typeof n==='number'&&Number.isFinite(n);
const textOf=chapter=>typeof chapter?.text==='string'?chapter.text:(chapter?.beats||[]).map(b=>b.text||'').join('');
function beatPositions(chapter,text){
  let cursor=0;
  return (chapter.beats||[]).map((beat,index)=>{
    const at=typeof beat.text==='string'&&beat.text?text.indexOf(beat.text,cursor):-1;
    const offset=at>=0?at:cursor;if(at>=0)cursor=at+beat.text.length;
    return {beat,index,offset};
  });
}
const LOCATION_LABELS={
  'foundation-landsea':'中国 · 亚洲','foundation-equator':'赤道与南北半球','foundation-sunlight':'赤道附近 · 日照原理示意',
  'foundation-water-cycle':'婆罗洲附近 · 水循环示意','foundation-forest':'婆罗洲附近 · 森林层次示意','foundation-rainforest':'婆罗洲 · 东南亚',
  'foundation-check-pattern':'非洲 · 环境条件对照示意','learn-global':'全球概览 · 六个环境案例',
  'learn-rainforest':'婆罗洲 · 暖湿森林案例','learn-savanna':'南非林波波 · 干燥疏林案例','learn-desert':'索诺兰 · 荒漠案例',
  'learn-temperate':'英国低地林地','learn-boreal':'芬兰森林','learn-wetland':'中国东部 · 浅水湿地'
};
function cleanFocus(candidate,chapter){
  return Object.freeze({lon:finite(candidate?.lon)?candidate.lon:finite(chapter.lon)?chapter.lon:0,lat:finite(candidate?.lat)?candidate.lat:finite(chapter.lat)?chapter.lat:0,label:candidate?.label||LOCATION_LABELS[chapter.id]||chapter.title||'教学定位'});
}
function sceneBeat(positions,offset){let current=positions[0];for(const p of positions){if(p.offset>offset)break;current=p;}return current;}
function buildCustom(chapter,text,positions){
  let focus=cleanFocus(null,chapter);
  return SCENES[chapter.id].flatMap(def=>{
    const offset=def.anchor?text.indexOf(def.anchor):0;if(offset<0)return [];
    const {anchor,...rest}=def;
    // Only expressly named places move the camera. Process diagrams stay at
    // chapter's teaching anchor; intro chapters also avoid unexplained tours.
    if(def.focus)focus=cleanFocus(def.focus,chapter);
    return [{...rest,anchorOffset:offset,focus}];
  });
}
function shortText(text,limit=105){
  const value=String(text||'');if(value.length<=limit)return value;
  const end=value.lastIndexOf('。',limit);return end>=18?value.slice(0,end+1):value.slice(0,limit)+'…';
}
function cropFor(crops,id){return crops?.get?.(id)||(Array.isArray(crops)?crops.find(c=>c.id===id):crops?.[id]);}
function buildPlant(chapter,text,positions,crops){
  const cropId=chapter.crop||chapter.id,crop=cropFor(crops,cropId),name=crop?.name||chapter.morphology?.label||chapter.title||cropId;
  const result=[];
  for(const {beat,index,offset} of positions){
    const morphology=beat.shapeMode==='morphology',focus=cleanFocus({...beat,label:morphology?name+' · 结构示意，非现场记录':beat.label},chapter);
    result.push({anchorOffset:offset,title:morphology?'先认识'+name+'的结构':'找到'+(beat.label||'讲解地区'),lookAt:morphology?'观察声音正在介绍的叶、茎、花果或其他结构。':'跟随地图找到'+(beat.label||'当前地区')+'，再比较旁白中的环境条件。',explain:morphology?'关键器官为简化示意；形态用于识别，不自动证明当地气候或完整分布。':shortText(beat.text),focus,effect:morphology?'plant':'location',phase:morphology?'identify':'region-'+index,plantId:cropId});
    if(!morphology)continue;
    // Subdivide only where an ORIGINAL morphology.parts label is literally
    // spoken in this beat. Do not guess a physiological role from a shape.
    const candidates=(chapter.morphology?.parts||[]).map(part=>({part,at:beat.text.indexOf(part)})).filter(p=>p.part&&p.at>=14&&p.at<=beat.text.length-12).sort((a,b)=>a.at-b.at);
    let previous=0,added=0;
    for(const {part,at} of candidates){if(at-previous<18)continue;previous=at;added++;result.push({anchorOffset:offset+at,title:'看清：'+part,lookAt:'在'+name+'结构示意里找“'+part+'”。',explain:'这是本章原文提到的识别点；图形比例经过简化，不据此推断气候适应原因。',focus,effect:'plant',phase:'identify',plantId:cropId,organ:part});if(added===2)break;}
  }
  if(!result.length)result.push({anchorOffset:0,title:chapter.title||'开始观察',lookAt:'跟随本章介绍，先找位置再看结构与条件。',explain:shortText(text),focus:cleanFocus(null,chapter),effect:'location',phase:'locate',...(crop?{plantId:cropId}:{})});
  return result;
}

/**
 * Complete immutable scene list, suitable for a clickable review strip.
 * stepIndex is zero-based. anchorOffset is a chapter.text UTF-16 offset.
 * effect is the renderer's broad visual; phase narrows it when supported.
 * foundationState and chainIndex optionally synchronize the learning card.
 * comparisonOnly means diagram/concept comparison, not a plant occurrence or
 * a surveyed community at focus. Renderers should not retain a previous
 * geographic plant marker when this scene has no plantId.
 */
export function getNarrationScenes(chapter,crops){
  if(!chapter||typeof chapter!=='object')return Object.freeze([]);
  const hit=cache.get(chapter);if(hit&&hit.crops===crops)return hit.scenes;
  const text=textOf(chapter),positions=beatPositions(chapter,text);
  const raw=SCENES[chapter.id]?buildCustom(chapter,text,positions):buildPlant(chapter,text,positions,crops);
  const unique=raw.sort((a,b)=>a.anchorOffset-b.anchorOffset).filter((scene,i,list)=>i===0||scene.anchorOffset!==list[i-1].anchorOffset);
  const scenes=Object.freeze(unique.map((scene,i)=>Object.freeze({...scene,id:(chapter.id||'chapter')+'-scene-'+(i+1),stepIndex:i,stepCount:unique.length,anchorOffset:Math.max(0,Math.min(text.length,scene.anchorOffset)),focus:Object.freeze({...scene.focus}),...(scene.guideGroups?{guideGroups:Object.freeze([...scene.guideGroups])}:{}),...(scene.foundationState?{foundationState:Object.freeze({...scene.foundationState})}:{}),...(scene.demonstration?{demonstration:Object.freeze({...scene.demonstration})}:{})})));
  cache.set(chapter,{crops,scenes});return scenes;
}

/** Select the nearest previous anchor, never a future observation task. */
export function getNarrationScene({chapter,characterOffset,beatIndex,crops}={}){
  const scenes=getNarrationScenes(chapter,crops);if(!scenes.length)return null;
  let offset=characterOffset;
  if(!finite(offset)){
    const positions=beatPositions(chapter,textOf(chapter));
    offset=Number.isInteger(beatIndex)&&beatIndex>=0?positions[Math.min(beatIndex,Math.max(0,positions.length-1))]?.offset||0:0;
  }
  let selected=scenes[0];for(const scene of scenes){if(scene.anchorOffset>offset)break;selected=scene;}return selected;
}
