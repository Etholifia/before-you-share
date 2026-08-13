// SPDX-License-Identifier: MPL-2.0
import { cases, accounts } from './cases.js';
const copy = {
  en: {
    brand:"MEDIA LITERACY SHIFT", navShift:"THE SHIFT", navCase:"TRY A CASE", navMil:"WHY MIL", navPlay:"DEMO",
    heroEyebrow:"AN INTERACTIVE MEDIA & INFORMATION LITERACY GAME",
    heroDeck:"A post lands on your desk. The clock is moving. The source is messy. What deserves another look before it travels any further?",
    heroTry:"TRY A 60-SECOND CASE", heroMil:"EXPLORE MIL", dragNote:"Drag the signals. Question the feed.",
    shiftKicker:"THE SHIFT", shiftTitle:"YOU ARE NOT THE TRUTH MACHINE.",
    shiftP1:"You are the person who decides whether a claim moves forward, slows down, or gets checked again.",
    shiftP2:"Before You Share turns media literacy into a workplace rhythm: review the post, investigate what is missing, then make a proportionate call.",
    workflowKicker:"THE WORKFLOW", reviewTitle:"Read what is actually claimed.", reviewText:"Not what the headline implies. Not what the comments assume.",
    investigateTitle:"Look sideways.", investigateText:"Who posted it? Where did it start? What context is missing?",
    decideTitle:"Make a proportionate call.", decideText:"Sometimes the responsible answer is not “false.” It is “not ready to share.”",
    caseKicker:"MINI CASE LAB", caseTitle:"DON'T TRUST THE CARD.<br>TOUCH THE EVIDENCE.",
    caseIntro:"This training case is fictional. Open the account, source, and image checks before you decide what happens to the post.",
    caseMeta:"posted 6 min ago · 12.8K shares", training:"FICTIONAL TRAINING POST",
    casePost:"“Night Bus Route 9 becomes free every Friday starting tomorrow. An internal memo confirms it — share this before the announcement.”",
    evidenceTitle:"EVIDENCE LOG", accountCheck:"CHECK ACCOUNT", accountHint:"Who is speaking?", sourceCheck:"TRACE SOURCE", sourceHint:"Where did it start?",
    imageCheck:"INSPECT IMAGE", imageHint:"Does the media match?", readoutDefault:"Choose a check. Evidence will appear here.",
    decisionPrompt:"YOUR CALL", hold:"HOLD & VERIFY", share:"SHARE", reset:"RESET CASE ↺",
    milKicker:"WHY MEDIA & INFORMATION LITERACY", milTitle:"THE FEED IS FAST.<br>YOUR JUDGMENT CAN BE SLOWER.",
    milIntro:"Media and Information Literacy helps people engage critically with information, navigate digital environments, and respond to misinformation and disinformation.",
    statCreators:"digital content creators do not systematically fact-check information before sharing it online.",
    statConcern:"of citizens are worried about the impact of online disinformation.",
    statSocial:"of internet users frequently use social media to stay informed about current events.",
    learnBeyond:"LEARN BEYOND THE GAME",
    unescoCopy:"Explore UNESCO's Media and Information Literacy resources, initiatives, publications, and learning materials.",
    unescoCta:"OPEN UNESCO MIL ↗", independent:"Before You Share is an independent project. It is not affiliated with or endorsed by UNESCO.",
    playEyebrow:"THE DESK IS OPEN", playTitle:"READY FOR<br>YOUR SHIFT?",
    playCopy:"The Windows demo is free. Review fictional posts, investigate clues, and see how your decisions shape the shift.",
    playButton:"PLAY THE DEMO ON ITCH.IO", itchNote:"Itch.io link placeholder — replace this with the final project URL.",
    footerTag:"An independent media literacy game.",
    footerLegal:"Website source code: MPL-2.0. Original game artwork, branding, screenshots, and narrative assets: © Etholifia, all rights reserved unless otherwise stated."
  },
  zh: {
    brand:"媒体素养值班中", navShift:"你的班次", navCase:"试试案例", navMil:"为什么是 MIL", navPlay:"试玩",
    heroEyebrow:"一款互动式媒体与信息素养游戏",
    heroDeck:"一条帖子落到你的桌面。时间在走，来源混乱。在它继续传播之前，什么值得你多看一眼？",
    heroTry:"60 秒迷你案例", heroMil:"了解 MIL", dragNote:"拖动这些信息。怀疑你的信息流。",
    shiftKicker:"你的班次", shiftTitle:"你不是一台“真相机器”。",
    shiftP1:"你要决定的，是一条信息应该继续前进、暂缓，还是需要再次核验。",
    shiftP2:"《转发之前》把媒体素养变成工作节奏：阅读帖子、调查缺失的信息，再作出适度的判断。",
    workflowKicker:"工作流程", reviewTitle:"先看它到底声称了什么。", reviewText:"不是标题暗示了什么，也不是评论区以为了什么。",
    investigateTitle:"向旁边看。", investigateText:"谁发布的？最初来源在哪里？缺失了什么语境？",
    decideTitle:"作出适度的判断。", decideText:"负责任的答案有时不是“假的”，而是“现在还不适合转发”。",
    caseKicker:"迷你案例实验室", caseTitle:"别只相信卡片。<br>去碰证据。",
    caseIntro:"这是一个完全虚构的训练案例。先检查账号、来源和图片，再决定怎么处理帖子。",
    caseMeta:"6 分钟前发布 · 1.28 万次转发", training:"虚构训练帖子",
    casePost:"“9 路夜班公交从明天起每周五免费。一份内部备忘录已经确认——趁正式公告前快转发。”",
    evidenceTitle:"证据记录", accountCheck:"检查账号", accountHint:"是谁在说？", sourceCheck:"追溯来源", sourceHint:"最初从哪里来？",
    imageCheck:"检查图片", imageHint:"媒体内容对得上吗？", readoutDefault:"选择一项检查，证据会显示在这里。",
    decisionPrompt:"你的决定", hold:"暂缓并核验", share:"转发", reset:"重置案例 ↺",
    milKicker:"为什么需要媒体与信息素养", milTitle:"信息流很快。<br>你的判断可以慢一点。",
    milIntro:"媒体与信息素养帮助人们批判性地接触信息、理解数字环境，并应对错误信息与虚假信息。",
    statCreators:"的数字内容创作者在分享网络信息前不会系统性地进行事实核查。",
    statConcern:"的公众担忧网络虚假信息带来的影响。",
    statSocial:"的互联网用户经常通过社交媒体了解时事。",
    learnBeyond:"在游戏之外继续学习", unescoCopy:"探索 UNESCO 的媒体与信息素养资源、倡议、出版物与学习材料。",
    unescoCta:"前往 UNESCO MIL ↗", independent:"《转发之前》是独立项目，与 UNESCO 不存在隶属、合作或官方背书关系。",
    playEyebrow:"工位已经亮起", playTitle:"准备开始<br>你的班次了吗？",
    playCopy:"Windows Demo 免费开放。审核虚构帖子、调查线索，看看你的判断如何改变这一天。",
    playButton:"前往 ITCH.IO 下载试玩", itchNote:"当前为 itch.io 占位链接，之后替换为游戏最终页面。",
    footerTag:"一款独立媒体素养游戏。",
    footerLegal:"网站源代码采用 MPL-2.0。原创游戏美术、品牌、截图与叙事素材除另有说明外 © Etholifia，保留全部权利。"
  }
};

let lang = localStorage.getItem("bys-lang") || "en";
const $ = (s,r=document)=>r.querySelector(s);
const $$ = (s,r=document)=>[...r.querySelectorAll(s)];

function applyLang(next){
  lang = next;
  document.documentElement.lang = lang === "en" ? "en" : "zh-CN";
  $$("[data-i18n]").forEach(el=>{
    const value = copy[lang][el.dataset.i18n];
    if(value !== undefined) el.innerHTML = value;
  });
  $("[data-lang]").textContent = lang === "en" ? "EN ↔ 中文" : "中文 ↔ EN";
  localStorage.setItem("bys-lang", lang);
  
  $$("[data-lang-en]").forEach(el => el.hidden = (lang === "zh"));
  $$("[data-lang-zh]").forEach(el => el.hidden = (lang === "en"));

  if(currentCase) {
    const dataLang = lang === "zh" ? "zh-CN" : "en";
    $(".post-copy").textContent = currentCase.post.body[dataLang];
    if($("[data-readout]").textContent !== copy[lang].readoutDefault) {
      // Re-trigger the active evidence button text
      const activeBtn = $(".evidence button.checked");
      if(activeBtn) $("[data-readout]").textContent = evidenceText[lang][activeBtn.dataset.evidence];
    }
  }
}
$("[data-lang]").addEventListener("click",()=>applyLang(lang==="en"?"zh":"en"));
// Wait to call applyLang until AFTER loadCase is defined. 
// We will call applyLang(lang) at the bottom of the file instead.

// Update CSS variables for radial gradients based on mouse
addEventListener("pointermove", e=>{
  document.documentElement.style.setProperty("--mx", e.clientX+"px");
  document.documentElement.style.setProperty("--my", e.clientY+"px");
});

function onScroll(){
  const max=document.documentElement.scrollHeight-innerHeight;
  $(".progress i").style.width=(max?scrollY/max*100:0)+"%";

  const hero=$(".hero"), r=hero.getBoundingClientRect();
  const p=Math.max(0,Math.min(1,-r.top/(hero.offsetHeight-innerHeight||1)));
  $(".w-before").style.transform=`translateX(${p*5}vw)`;
  $(".w-you").style.transform=`translateX(${-p*9}vw)`;
  $(".w-share").style.transform=`translateX(${p*7}vw)`;

  const wf=$(".workflow"), wr=wf.getBoundingClientRect();
  const wp=Math.max(0,Math.min(.999,-wr.top/(wf.offsetHeight-innerHeight||1)));
  const idx=Math.floor(wp*3);
  $$(".steps article").forEach((el,i)=>el.classList.toggle("active",i===idx));
  $$(".workflow-words span").forEach((el,i)=>{
    el.style.opacity=i===idx?".95":".14";
    el.style.transform=i===idx?"translateX(0)":"translateX(2vw)";
  });
}
addEventListener("scroll",onScroll,{passive:true}); onScroll();

const observer=new IntersectionObserver(entries=>entries.forEach(e=>{
  if(e.isIntersecting){
    e.target.classList.add("visible");
    if(e.target.matches(".stat")) animateCounter(e.target);
    observer.unobserve(e.target);
  }
}),{threshold:.18});
$$(".reveal").forEach(el=>observer.observe(el));

function animateCounter(card){
  const el=$("[data-counter]",card), target=+el.dataset.counter, start=performance.now(), dur=800;
  function tick(t){
    const p=Math.min(1,(t-start)/dur);
    el.textContent=Math.round(target*(1-Math.pow(1-p,3)));
    if(p<1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

$$(".drag").forEach(el=>{
  let down=false,sx=0,sy=0,ox=0,oy=0;
  el.addEventListener("pointerdown",e=>{
    down=true; sx=e.clientX; sy=e.clientY; ox=+(el.dataset.x||0); oy=+(el.dataset.y||0);
    el.setPointerCapture(e.pointerId);
  });
  el.addEventListener("pointermove",e=>{
    if(!down) return;
    const x=ox+e.clientX-sx, y=oy+e.clientY-sy;
    el.dataset.x=x; el.dataset.y=y; el.style.translate=`${x}px ${y}px`;
  });
  el.addEventListener("pointerup",()=>down=false);
  el.addEventListener("pointercancel",()=>down=false);
});

let currentCase = null;
let evidenceText = { en: {}, zh: {} };

function loadCase() {
  currentCase = cases[Math.floor(Math.random() * cases.length)];
  const author = accounts.find(a => a.id === currentCase.post.account_id);
  const dataLang = lang === "zh" ? "zh-CN" : "en";
  
  // Populate UI
  $(".avatar").textContent = (author.display_name["en"] || "?").charAt(0).toUpperCase();
  $(".post header strong").textContent = lang === "zh" ? author.handle : (author.handle_en || author.handle);
  $(".post-copy").textContent = currentCase.post.body[dataLang];
  
  // Set evidence text dynamically based on the case/author
  const feedbackEn = currentCase.feedback?.lock?.["en"] || "The post uses emotional language without direct links.";
  const feedbackZh = currentCase.feedback?.lock?.["zh-CN"] || "帖子使用了煽动性语言，没有提供直接链接。";

  evidenceText = {
    en: {
      account: `ACCOUNT CHECK — ${author.account_type["en"]}. ${author.verification["en"]}. Bio: ${author.bio["en"]}`,
      source: `SOURCE TRACE — ${feedbackEn}`,
      image: `IMAGE CHECK — ${currentCase.post.media_id ? "Media attached. Inspector flagged anomalies." : "No visual media attached to this claim."}`
    },
    zh: {
      account: `账号检查——${author.account_type["zh-CN"]}。${author.verification["zh-CN"]}。简介：${author.bio["zh-CN"]}`,
      source: `来源追溯——${feedbackZh}`,
      image: `图片检查——${currentCase.post.media_id ? "包含媒体文件。检测器发现了异常。" : "这条帖子没有附带图片或视频。"}`
    }
  };
}

let checked=new Set();
$$("[data-evidence]").forEach(btn=>btn.addEventListener("click",()=>{
  checked.add(btn.dataset.evidence);
  btn.classList.add("checked");
  btn.querySelector("em").textContent="✓";
  $("[data-count]").textContent=checked.size;
  $("[data-readout]").textContent=evidenceText[lang][btn.dataset.evidence];
}));

$$("[data-decision]").forEach(btn=>btn.addEventListener("click",()=>showResult(btn.dataset.decision)));
function showResult(choice){
  const box=$("[data-result]"), title=$("[data-result-title]"), body=$("[data-result-copy]"), n=checked.size;
  if(choice==="hold"){
    title.textContent=lang==="en"?"GOOD CALL: SLOW IT DOWN.":"不错：先让它慢下来。";
    body.textContent=lang==="en"
      ? (n<2?"Holding the post is proportionate. Next time, inspect more evidence before closing the case.":"The evidence does not support immediate sharing. You created time for verification without pretending you already know the whole truth.")
      : (n<2?"暂缓传播是适度的选择。下次可以多检查几项证据再结案。":"现有证据不足以支持立即转发。你为进一步核验留出了时间，也没有假装自己已经掌握全部真相。");
  }else{
    title.textContent=lang==="en"?"TOO FAST.":"太快了。";
    body.textContent=lang==="en"
      ? (n<2?"You shared before checking enough of the available evidence. High engagement is not a source.":"You found warning signs, but shared anyway. The evidence called for verification, not amplification.")
      : (n<2?"你还没充分检查现有证据就转发了。高热度本身不是来源。":"你已经发现了警示信号，却仍然转发。现有证据需要进一步核验，而不是扩大传播。");
  }
  box.hidden=false;
}
$("[data-reset]").addEventListener("click",()=>{
  checked.clear();
  $$("[data-evidence]").forEach(b=>{b.classList.remove("checked");b.querySelector("em").textContent="+"});
  $("[data-count]").textContent="0";
  $("[data-readout]").innerHTML=copy[lang].readoutDefault;
  $("[data-result]").hidden=true;
  loadCase();
});
loadCase(); // Initial load

$$(".magnetic").forEach(el=>{
  el.addEventListener("pointermove",e=>{
    if(matchMedia("(pointer:coarse)").matches) return;
    const r=el.getBoundingClientRect(), x=(e.clientX-r.left-r.width/2)*.08, y=(e.clientY-r.top-r.height/2)*.08;
    el.style.transform=`translate(${x}px,${y}px)`;
  });
  el.addEventListener("pointerleave",()=>el.style.transform="");
});

applyLang(lang); // Call this after all variables are defined
