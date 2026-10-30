import {CROP_CLASSES} from './crop-class-content.js';

// These checks apply the reviewed class descriptions. They record a current
// answer, not mastery, independent research, or a local planting recommendation.
const freeze=value=>{if(value&&typeof value==='object'){Object.values(value).forEach(freeze);Object.freeze(value);}return value;};
const classes=new Map(CROP_CLASSES.map(c=>[c.id,c]));
const sourceRows=(...ids)=>[...new Map(ids.flatMap(id=>classes.get(id)?.sources||[]).map(s=>[s.url,s])).values()];
function make(classId,prompt,options,correctIndex,feedback,explanation,nextHint,evidenceFields){
  const c=classes.get(classId);
  if(!c)throw new Error('Unknown class check: '+classId);
  return {id:'class-check-'+classId,classId,title:c.group+' · 想一想',prompt,options,correctIndex,feedback,explanation,nextHint,
    sources:sourceRows(classId),evidence:{classId,fields:evidenceFields||['definition','organ','environment','misconception']}};
}

export const CLASS_CHECKS=freeze([
  make('grains','米饭、麦饼和藜麦饭都能作为食物。把它们放在粮食相关类别，最可靠的依据是什么？',[
    '它们一定属于同一个科，也适合完全相同的环境。',
    '主要按籽粒食用用途组织，并不表示都属禾本科。',
    '凡是用籽粒作主食，都要整季泡在水里。'
  ],1,[
    '把用途和亲缘混在一起了。藜麦等伪谷物可以与禾本科谷物一起作食物，却不是同一植物分类。',
    '这个依据符合本图鉴的用途分组。接着还要分别看水稻、小麦、玉米等成员的季节和供水条件。',
    '食用籽粒并不能推出水分管理。水稻、小麦和玉米的供水方式及生长季并不相同。'
  ],'用途分类帮助比较食物来源；判断亲缘与适应环境，还需要具体植物、品种和生长季资料。','回看“用途”和“环境”两页，找出用途相近但条件不同的成员。'),
  make('pulses','大豆同时出现在豆类和油料中，鲜豌豆还出现在蔬菜中。应怎样理解这些重复出现？',[
    '每出现一次，就代表一个不同的植物物种。',
    '只要属于豆类，播期、温度和供水要求就相同。',
    '同一植物可按用途和收获阶段，从多个类别认识。'
  ],2,[
    '条目或用途的重复不等于新物种。大豆的食用和榨油用途可以放在不同学习视角中。',
    '同属豆科也不能推出管理一致。大豆常利用暖季，豌豆常利用凉季，鹰嘴豆还需注意涝害等限制。',
    '对。成熟干籽、鲜籽、嫩荚和榨油是不同的利用目标，同一植物可以连接多个用途类别。'
  ],'豆荚是果实，荚中的豆是种子；用途、采收阶段与植物分类需要分别说明。','试着把“收什么”和“什么时候收”分开描述。'),
  make('roots','马铃薯、甘薯和芋的可食部分都在地下。哪种解释更准确？',[
    '地下食物可分别是块茎、储藏根或球茎，位置不能单独判定器官。',
    '只要埋在土里，可食部分就一定是根。',
    '名字里带“薯”，就属于同一种器官和同一植物类群。'
  ],0,[
    '对。马铃薯的块茎由地下茎形成，甘薯利用储藏根，芋主要利用球茎。',
    '地下也能有茎。先看器官来源和结构，再结合位置辨认，不能只用“在地下”判定为根。',
    '日常名称不能替代器官与亲缘判断。马铃薯和甘薯虽然都叫薯，可食器官并不相同。'
  ],'“薯根作物”是这里的用途组织方式，包含不止一种器官；成员的温度与供水要求也有差异。','回到器官示意，分别指出马铃薯、甘薯和芋利用的部分。'),
  make('vegetables','同是蔬菜，为什么还要分别比较番茄、胡萝卜和西兰花的器官及生长季？',[
    '蔬菜都只吃叶子，因此只需要一套通用条件。',
    '蔬菜按日常用途组织，果实、根和花球的形成要求可不同。',
    '番茄是果实，所以不能再按蔬菜用途介绍。'
  ],1,[
    '蔬菜的食用器官有叶、根、鳞茎、花球、嫩荚和果实等，不能统一看作叶片。',
    '对。番茄利用果实，胡萝卜利用膨大根，西兰花利用花球，形成这些器官的季节与限制需要分别看。',
    '这把两套标准当成互斥关系了。番茄在植物学上是果实，在日常栽培与食用中仍可归为蔬菜。'
  ],'用途名称和器官名称回答不同问题；同类蔬菜也可能分别利用暖季和较凉季节。','先说出采收部位，再判断哪段生长过程需要重点观察。'),
  make('fruits','看见苹果长在木本树上，可以据此推断香蕉和草莓也都是木本树上的同类果实吗？',[
    '可以，所有日常叫水果的植物都属于木本树。',
    '可以，只要成品有籽，株形与冬季要求就相同。',
    '不能；水果用途不决定株形，草莓的红色部分主要来自花托。'
  ],2,[
    '日常果品用途不决定株形。苹果、香蕉与草莓的生长类型和完成结果的条件应分别认识。',
    '有籽不能代替株形与季节资料。苹果的休眠和春霜、香蕉的无霜条件、草莓的结果类型都值得分别比较。',
    '对。日常水果不是一个植物分类单元，草莓还提示我们：可食部分可能包含果实之外的附属组织。'
  ],'草莓红色部分主要是膨大花托，表面小颗粒才是瘦果；果品用途不自动说明器官与植物亲缘。','把“卖作什么食物”“可食部分是什么”和“植株怎样生长”分成三个问题。'),
  make('nuts','扁桃、欧洲栗和腰果都放在食用坚果中。比较它们的种植环境时，先怎样做更可靠？',[
    '分清可食器官与具体树种，再分别看越冬、花期和水分要求。',
    '既然都叫坚果，就使用同一果实结构和耐寒规则。',
    '既然都有外壳，就认为它们都不需要根区供水。'
  ],0,[
    '对。扁桃主要食用种仁，欧洲栗的果实是坚果，腰果又有自己的果实结构；温带落叶树与热带常绿树不能共用一条耐寒规则。',
    '消费用途相近并不表示植物结构或耐寒要求相同。先辨器官，再回到各树种与品种的季节资料。',
    '外壳不是供水资料。根区有效供水、排水及开花结果阶段，仍需要按具体作物判断。'
  ],'食用坚果是消费用途类别；越冬、开花与果实成熟是不同过程，不能由商品名称统一推断。','回看扁桃与腰果的环境说明，比较它们面对寒冷季节时的差异。'),
  make('oils','生产图显示“油棕果”的产量，单位是吨。能直接把这个数字读成成品棕榈油的产量吗？',[
    '能，油料原料的重量就是成品油的重量。',
    '能，只要颜色较深，就不必再看商品名称。',
    '不能，要先区分油棕果、果肉油和棕榈仁油的统计口径。'
  ],2,[
    '原料重量和加工产品重量不是同一项统计；收获的油棕果不能直接当作制成油重量。',
    '颜色只比较当前选定商品与指标的数值。先看商品、年份、单位和来源，才能知道颜色在比较什么。',
    '对。油棕果肉和棕榈仁可对应不同油品，原料统计与加工后的油品统计必须分开读。'
  ],'油料是用途分类；地图显示哪种原料或产品，要由商品名称与来源口径判断，不由类别名称替代。','在地图侧栏找到商品口径，再说出图中数值究竟表示什么。',['organ','misconception']),
  make('sugars','只看到成品白糖，可以判断原料一定来自甘蔗吗？',[
    '可以，因为只有甘蔗才能按糖料用途栽培。',
    '不能；甘蔗利用茎中的糖，糖用甜菜利用根中的糖。',
    '可以；糖用甜菜和食用甜菜根是两个独立物种。'
  ],1,[
    '当前图鉴就有甘蔗和糖用甜菜两个制糖代表，不能把糖料用途限制为甘蔗。',
    '对。成品名称不能单独证明植物原料。还应把原料器官、生长季和加工产品分别认识。',
    '食用甜菜根与糖用甜菜属于同种植物的不同用途类型；这也不能证明一份白糖的实际原料来源。'
  ],'甘蔗茎与糖用甜菜根的收获重量也不是成品糖重量；两种作物的生长季仍需分别比较。','先把白糖放回植物原料，再比较糖积累在哪个器官。'),
  make('beverages','茶叶、咖啡豆和可可豆的叫法不同。哪种器官解释与资料相符？',[
    '茶主要采嫩梢与叶，咖啡和可可主要利用种子，“豆”不表示它们属于豆科。',
    '茶、咖啡和可可的原料都是豆科的成熟种子。',
    '只要叫“豆”，就和大豆有相同的亲缘与供水条件。'
  ],0,[
    '对。先辨采收器官，再比较各自温度、水分、遮阴与加工条件，才能把饮品名称和植物分开认识。',
    '茶采收嫩梢与叶；咖啡豆和可可豆主要指种子，但二者并不因此属于豆科。',
    '商品俗名不能证明亲缘或环境要求。咖啡与可可需要按具体植物的资料理解，不能套用大豆条件。'
  ],'饮料与可可是用途分组，叶与种子是器官名称，科属则说明植物亲缘；三者不能互相替代。','试着为茶、咖啡和可可各写一句“主要采收什么”。'),
  make('spices','把胡椒粒、肉桂皮和丁香放回原植物，哪组采收器官匹配正确？',[
    '三种香料都只利用成熟种子。',
    '胡椒利用树皮，肉桂利用果实，丁香利用根。',
    '胡椒利用果实，肉桂利用树皮，丁香利用未开放的花蕾。'
  ],2,[
    '调味用途相近，不说明采收器官相同。请分别回看果实、树皮与花蕾的采收位置。',
    '这组器官对应颠倒了。胡椒是果实香料，肉桂主要利用树皮，香料丁香采未开放花蕾。',
    '对。继续比较攀援、枝条萌发和开花阶段，就能理解不同香料为何有不同的栽培与采收方式。'
  ],'香辛料按调味用途组织；名字和用途不能替代器官、亲缘与具体环境条件的判断。','沿着一份香料找到原植物的器官，再看它在何时形成。',['organ','distinguish','misconception']),
  make('fibres','要在模型上标出棉花、亚麻和剑麻的纤维来源，哪组标注正确？',[
    '三种纤维全部来自茎，带“麻”的都属于同一植物。',
    '棉纤维在种子表面，亚麻取茎部韧皮纤维，剑麻取叶片纤维。',
    '棉花取根纤维，亚麻取果实纤维，剑麻取花纤维。'
  ],1,[
    '纤维用途相近也可能来自不同器官；“麻”的俗名同样不能证明植物亲缘。',
    '对。采收部位不同，会连接到不同的收获与加工方式；同是亚麻，取纤维与取油用种子也有不同目标。',
    '这些标注不符资料。请回到种子表面的毛、茎部和叶片这三种来源进行对照。'
  ],'比较纤维时，先找到器官，再看原料与加工产品；原茎、叶片和籽棉不是同一种产品重量。','把三个纤维原料分别连到种子、茎和叶上。',['organ','distinguish','misconception']),
  make('industrial','橡胶树的天然橡胶主要通过哪种来源获得？',[
    '割取乳胶系统中的乳胶，再进行加工。',
    '把树干木材熬化，直接得到橡胶。',
    '任何树的树脂都与橡胶树乳胶是同一种材料。'
  ],0,[
    '对。需要把乳胶、树脂、木材和纤维分清，再认识各自的采收与加工过程。',
    '这把木材与乳胶混在一起了。橡胶树的天然橡胶原料来自乳胶系统，不是熬化木材。',
    '树木产品并不来自同一组织，树脂与乳胶不能当作同一种材料，也不能据此把所有树都当作橡胶原料。'
  ],'工业原料是用途类别。目前先用橡胶树认识乳胶，不能把一个代表当成全部工业作物。','与棉花比较：一个利用乳胶，一个收种子表面的纤维。',['definition','organ','distinguish']),
  make('forage','苜蓿成株可以有深根，并能与根瘤菌共生固氮。这能推出建苗与反复刈割时都不需要肥水吗？',[
    '能，成株有深根，幼苗就一定具有同样的抗旱能力。',
    '能，能固氮就意味着所有养分与水分都不需要管理。',
    '不能；幼苗、刈割再生、高产需水和其他养分条件仍要分别判断。'
  ],2,[
    '不能把成株的根系特点直接套到幼苗。建苗阶段较脆弱，需要单独核对供水与根区条件。',
    '固氮不等于获得全部养分，更不能代替水分与排水。反复刈割也会消耗植株储备。',
    '对。耐旱生存、高产与反复再生是不同要求，不能只凭深根或固氮特征给出统一管理结论。'
  ],'饲草主要利用茎叶；刈割后的再生与取成熟种子的食用豆类有不同的采收目标和管理节律。','回看“成株”“幼苗”“刈割后”三个阶段，分别说出需要注意什么。',['organ','environment','misconception'])
]);

const FAO={title:'FAOSTAT QCL：农业生产统计与商品口径',url:'https://www.fao.org/faostat/en/#data/QCL',supports:'本项目国家商品记录的来源；必须保留年份、单位及原料/加工产品口径。'};
const KEW={title:'Kew：World Checklist of Vascular Plants',url:'https://powo.science.kew.org/about-wcvp',supports:'原生与引入的植物地理记录；不等于栽培范围、数量或地块适生性。'};
export const REVIEW_CHECKS=freeze([
  {id:'review-read-map',classId:null,title:'回顾一 · 把地图读准确',prompt:'地图上一个国家的颜色较深，旁边又有某植物的原生与引入图。哪种读法更可靠？',options:[
    '颜色较深说明全国每块土地都更适合种植这个单一物种。',
    '先读年份、商品、指标与记录类型；国家统计和植物区系回答不同问题。',
    '引入野生记录可以直接代替当地全部人工栽培和产量。'
  ],correctIndex:1,feedback:[
    '国家着色比较的是选定统计指标，不能定位每块田，也不一定单列一个物种；商品可能合计多个类型。',
    '对。农业商品产量、区系原生/引入记录与潜在适宜性是不同问题，读图时应先确认自己看的哪一种资料。',
    '引入野生记录不等于全部人工栽培。生产图还要单独看农业商品来源、时间和统计单位。'
  ],explanation:'国家或植物地理区是记录单元，不表示整片土地连续生长，也不表示密度。没有记录还应保留未知。',nextHint:'回到地图，先说出它的来源、年份、单位和填色含义。',sources:[FAO,KEW],evidence:{classIds:['oils','industrial'],fields:['misconception'],sourceFields:['globalEvidence.production.metadata.meaning','globalEvidence.distribution.metadata.meaning']}},
  {id:'review-environment',classId:null,title:'回顾二 · 用环境线索解释',scenario:'假设比较：两处都温暖，一处全年较湿润，另一处有较长旱季。这不是具体地点的实测资料。',prompt:'要解释这两处的植物差异，下一步哪种做法更可靠？',options:[
    '比较生长季水分、可用水源和根区条件，再结合植物、品种与管理。',
    '只要都温暖，就推断两处一定长相同的植物。',
    '只看某个国家产量高，就认定气候已经解释了所有差异。'
  ],correctIndex:0,feedback:[
    '对。温度只是一部分线索；水分怎样随季节分配、根区能否供水和排水，以及植物与管理差异都值得核对。',
    '温暖并不自动提供足够水分。旱季、土壤、供水以及具体植物的限制仍可能不同。',
    '产量还受面积、品种和管理等影响，国家总量本身不能单独证明当地为何适合。'
  ],explanation:'先找证据，再限定解释范围。缺少当地月度气候、土壤或水源资料时，应说明还需要什么，而不是把一般环境常识当作地块结论。',nextHint:'分别说出一条已知线索、一条还缺的证据，以及它可能影响的生长过程。',sources:[...sourceRows('grains','roots'),FAO],evidence:{classIds:['grains','roots'],fields:['environment','distinguish']}}
]);

export const ALL_CLASS_CHECKS=freeze([...CLASS_CHECKS,...REVIEW_CHECKS]);
const byQuestion=new Map(ALL_CLASS_CHECKS.map(q=>[q.id,q]));
const byClass=new Map(CLASS_CHECKS.map(q=>[q.classId,q]));
export const classCheckFor=classId=>byClass.get(classId)||null;
export const classCheckById=questionId=>byQuestion.get(questionId)||null;

export function sanitizeClassCheckAnswers(input){
  if(input===null||typeof input!=='object'||Array.isArray(input))return {};
  return Object.fromEntries(ALL_CLASS_CHECKS.filter(q=>Object.hasOwn(input,q.id)&&Number.isInteger(input[q.id])&&input[q.id]>=0&&input[q.id]<q.options.length).map(q=>[q.id,input[q.id]]));
}

export function evaluateClassCheck(questionId,index){
  const q=byQuestion.get(questionId);
  if(!q)return null;
  const answered=Number.isInteger(index)&&index>=0&&index<q.options.length;
  return {questionId:q.id,classId:q.classId,answered,correct:answered&&index===q.correctIndex,choiceIndex:answered?index:null,correctIndex:q.correctIndex,
    selectedText:answered?q.options[index]:null,correctText:q.options[q.correctIndex],feedback:answered?q.feedback[index]:'先选一个判断，再查看解释。',explanation:q.explanation,nextHint:q.nextHint};
}

export function getClassCheckProgress(input){
  const answers=sanitizeClassCheckAnswers(input);
  const results=ALL_CLASS_CHECKS.map(q=>evaluateClassCheck(q.id,answers[q.id]));
  const classResults=results.filter(r=>r.classId!==null),reviewResults=results.filter(r=>r.classId===null);
  return {total:ALL_CLASS_CHECKS.length,attempted:results.filter(r=>r.answered).length,correct:results.filter(r=>r.correct).length,
    classTotal:CLASS_CHECKS.length,classAttempted:classResults.filter(r=>r.answered).length,classCorrect:classResults.filter(r=>r.correct).length,
    reviewTotal:REVIEW_CHECKS.length,reviewAttempted:reviewResults.filter(r=>r.answered).length,reviewCorrect:reviewResults.filter(r=>r.correct).length,
    byClass:Object.fromEntries(classResults.map(r=>[r.classId,{questionId:r.questionId,answered:r.answered,correct:r.correct}])),
    unansweredClassIds:classResults.filter(r=>!r.answered).map(r=>r.classId),needsReviewClassIds:classResults.filter(r=>r.answered&&!r.correct).map(r=>r.classId),answers};
}
