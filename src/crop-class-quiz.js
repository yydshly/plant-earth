import {classCheckFor,REVIEW_CHECKS,evaluateClassCheck,sanitizeClassCheckAnswers} from './crop-class-checks.js';

const mounts=new WeakMap();let nextMount=0;
const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text!=null)n.textContent=text;if(cls)n.className=cls;return n;};

// The caller owns persistence and merges one answer into its existing state.
// No storage key is written and no prior reading or route progress is cleared.
export function mountClassQuiz(container,{classId,answers={},onAnswer}={}){
  const token=Symbol('class-quiz'),prefix='class-quiz-'+(++nextMount);
  mounts.set(container,token);let currentClassId=classId,currentAnswers={...answers};
  const questions=()=>currentClassId==='review'?REVIEW_CHECKS:[classCheckFor(currentClassId)].filter(Boolean);
  function render({focusTarget,revealFeedback=false}={}){
    if(mounts.get(container)!==token)return;
    const active=document.activeElement;
    if(!focusTarget&&container.contains(active)&&active?.dataset.answerIndex!=null){
      const previous=active.closest('[data-check-id]');
      if(previous)focusTarget={questionId:previous.dataset.checkId,index:active.dataset.answerIndex};
    }
    container.replaceChildren();container.classList.add('classroom-checks');
    const rows=questions(),safe=sanitizeClassCheckAnswers(currentAnswers);
    if(!rows.length){container.append(el('p','本类理解题尚未提供，可继续查看类别介绍。','classroom-check-note'));return;}
    rows.forEach(q=>{
      const section=el('section',null,'classroom-check');section.dataset.checkId=q.id;
      section.append(el('p',q.title+' · 可以改选','classroom-check-eyebrow'));
      if(q.scenario)section.append(el('p',q.scenario,'classroom-check-scenario'));
      const heading=el('h4',q.prompt);heading.id=prefix+'-'+q.id;section.setAttribute('aria-labelledby',heading.id);section.append(heading);
      const options=el('div',null,'classroom-check-options');options.setAttribute('role','group');options.setAttribute('aria-labelledby',heading.id);
      q.options.forEach((text,index)=>{
        const selected=safe[q.id]===index,b=el('button',String.fromCharCode(65+index)+' · '+text,'classroom-check-option'+(selected?' is-selected':''));b.type='button';b.dataset.answerIndex=String(index);b.setAttribute('aria-pressed',String(selected));
        b.onclick=()=>{
          currentAnswers={...currentAnswers,[q.id]:index};
          const evaluation=evaluateClassCheck(q.id,index);onAnswer?.(q.id,index,evaluation);
          // A parent may replace this whole view in onAnswer. Do not repaint or
          // steal focus from a newer mount or a detached lesson container.
          if(mounts.get(container)!==token||!container.isConnected)return;
          render({focusTarget:{questionId:q.id,index},revealFeedback:true});
        };options.append(b);
      });section.append(options);
      const evaluation=evaluateClassCheck(q.id,safe[q.id]);
      if(evaluation.answered){
        const feedback=el('div',null,'classroom-check-feedback '+(evaluation.correct?'is-correct':'needs-review'));feedback.setAttribute('role','status');feedback.setAttribute('aria-live','polite');
        feedback.append(el('strong',evaluation.correct?'这个判断与资料相符':'再比较一下这些线索'),el('p',evaluation.feedback),el('p',evaluation.explanation),el('p',evaluation.nextHint,'classroom-check-hint'));
        section.append(feedback,el('p','这里只记录本题当前答案；答对一题不等于已掌握整类植物。','classroom-check-note'));
      }else section.append(el('p','先选一个判断，再看解释；也可以暂跳，之后回来。','classroom-check-note'));
      const sources=el('details',null,'classroom-check-sources');sources.append(el('summary','本题依据'));
      for(const source of q.sources){const a=el('a',source.title);a.href=source.url;a.target='_blank';a.rel='noopener noreferrer';sources.append(a);}section.append(sources);container.append(section);
    });
    if(focusTarget){
      const own=container.querySelector('[data-check-id="'+focusTarget.questionId+'"]');
      own?.querySelector('[data-answer-index="'+focusTarget.index+'"]')?.focus({preventScroll:true});
      if(revealFeedback)own?.querySelector('.classroom-check-feedback')?.scrollIntoView({block:'nearest'});
    }
  }
  render();
  return {update(next={}){if(Object.hasOwn(next,'classId'))currentClassId=next.classId;if(Object.hasOwn(next,'answers'))currentAnswers={...next.answers};render();},destroy(){if(mounts.get(container)===token){mounts.delete(container);container.replaceChildren();}}};
}
