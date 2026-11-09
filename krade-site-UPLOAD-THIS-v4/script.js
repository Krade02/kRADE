/* ---- SETTINGS ----
   formEndpoint: leave empty to keep the email-draft flow. To receive messages in an inbox,
   create a form at formspree.io (or similar), paste its URL here, then TEST a real submission. */
const SITE={email:'pradippandey723@gmail.com',formEndpoint:''};
const $ = (s) => document.querySelector(s);
const data = JSON.parse($('#survey-data').textContent);
const { visits, dayparts, themes, rows } = data;
// each row: [week, visit, daypart, rating, recommend, theme]
const QUEUE_WEEK = 8; // the imaginary cafe changed its queue system in week 8
const state = { visit: -1, time: -1 };

function makeChips(host, labels, key) {
  const all = ['All', ...labels];
  all.forEach((label, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'chip';
    b.textContent = label;
    b.setAttribute('aria-pressed', String(i - 1 === state[key]));
    b.addEventListener('click', () => {
      state[key] = i - 1;
      host.querySelectorAll('.chip').forEach((c, j) => c.setAttribute('aria-pressed', String(j === i)));
      render();
    });
    host.appendChild(b);
  });
}
makeChips($('#chips-visit'), visits, 'visit');
makeChips($('#chips-time'), dayparts, 'time');

const pctSatisfied = (rs) => (rs.length ? Math.round((rs.filter((r) => r[3] >= 4).length / rs.length) * 100) : null);
const nps = (rs) => {
  if (!rs.length) return null;
  const promoters = rs.filter((r) => r[4] >= 9).length;
  const detractors = rs.filter((r) => r[4] <= 6).length;
  return Math.round(((promoters - detractors) / rs.length) * 100);
};

function render() {
  const view = rows.filter((r) => (state.visit < 0 || r[1] === state.visit) && (state.time < 0 || r[2] === state.time));
  const n = view.length;
  const sat = pctSatisfied(view);
  const score = nps(view);

  $('#n-csat').textContent = sat === null ? '–' : sat + '%';
  $('#n-nps').textContent = score === null ? '–' : (score < 0 ? '−' + Math.abs(score) : String(score));
  $('#n-count').textContent = String(n);
  const satN = view.filter((r) => r[3] >= 4).length;
  const pro = view.filter((r) => r[4] >= 9).length, det = view.filter((r) => r[4] <= 6).length;
  $('#calc').textContent = n ? `${satN} of ${n} answers rated 4 or 5 = ${(satN / n * 100).toFixed(1)}% satisfied. NPS = (${pro} promoters − ${det} detractors) ÷ ${n} = ${score < 0 ? '−' + Math.abs(score) : score}.` : '';

  // themes, most mentioned first
  const counts = themes.map((t, i) => ({ t, c: view.filter((r) => r[5] === i).length })).sort((a, b) => b.c - a.c);
  const max = Math.max(1, counts[0].c);
  $('#themes').innerHTML = counts.map((x) =>
    `<div class="theme"><span>${x.t}</span><span class="theme__bar" data-w="${Math.round((x.c / max) * 100)}"></span><span class="theme__n">${x.c}</span></div>`
  ).join('');
  // set widths through the style API (allowed by a strict CSP, unlike style="" in markup)
  $('#themes').querySelectorAll('.theme__bar').forEach((el) => { el.style.width = el.dataset.w + '%'; });

  // weekly satisfied share
  const X = (w) => 46 + ((w - 1) / 11) * 570;
  const Y = (p) => 165 - (p / 100) * 135;
  let path = '', dots = '', pen = false;
  for (let w = 1; w <= 12; w++) {
    const wk = view.filter((r) => r[0] === w);
    if (wk.length < 3) { pen = false; continue; }
    const p = pctSatisfied(wk);
    path += (pen ? 'L' : 'M') + X(w).toFixed(1) + ' ' + Y(p).toFixed(1) + ' ';
    dots += `<circle class="trend__dot" cx="${X(w).toFixed(1)}" cy="${Y(p).toFixed(1)}" r="6"/>`;
    pen = true;
  }
  const qx = X(QUEUE_WEEK);
  $('#trend').innerHTML =
    `<path class="trend__mark" d="M${qx - 9} 196 L${qx + 9} 196 L${qx} 178 Z"/>` +
    `<text class="trend__text" x="${qx}" y="172" text-anchor="middle" dy="-4">new queue system</text>` +
    `<text class="trend__text" x="0" y="${Y(100) + 5}">100%</text><text class="trend__text" x="0" y="${Y(0) + 5}">0%</text>` +
    `<text class="trend__text" x="${X(1)}" y="196" text-anchor="middle" dy="2">wk 1</text><text class="trend__text" x="${X(12)}" y="196" text-anchor="middle" dy="2">wk 12</text>` +
    (path ? `<path class="trend__path" d="${path}"/>${dots}` : '');

  // one finding, in a sentence
  const before = view.filter((r) => r[0] < QUEUE_WEEK);
  const after = view.filter((r) => r[0] >= QUEUE_WEEK);
  let text;
  if (n < 12) {
    text = 'Too few answers in this view to say anything fair. Try a wider filter.';
  } else {
    text = `Of ${n} answers, ${sat}% rated 4 or 5. The most mentioned theme was ${counts[0].t.toLowerCase()}.`;
    if (before.length >= 8 && after.length >= 8) {
      text += ` Before the new queue system, ${pctSatisfied(before)}% were satisfied; after it, ${pctSatisfied(after)}%.`;
    }
  }
  $('#finding').textContent = text;
}
render();

const motionQuery=matchMedia('(prefers-reduced-motion: reduce)');
let paused=motionQuery.matches;
const motion=$('#motion');
function syncMotion(){document.documentElement.classList.toggle('paused',paused);motion.setAttribute('aria-pressed',String(paused));motion.innerHTML=paused?'▶ <span>Motion off</span>':'Ⅱ <span>Motion on</span>';motion.title=paused?'Resume animations':'Pause animations';}
motion.addEventListener('click',()=>{paused=!paused;syncMotion();draw();});motionQuery.addEventListener('change',e=>{paused=e.matches;syncMotion();draw()});syncMotion();
$('#copy').addEventListener('click',async()=>{try{await navigator.clipboard.writeText('pradippandey723@gmail.com');$('#copy-status').textContent='Copied!'}catch{$('#copy-status').textContent='Select the email above to copy.'}});
const canvas=$('#orb'),ctx=canvas.getContext('2d');let width,height,angle=0,raf=0,pointer={x:0,y:0};
const points=Array.from({length:620},(_,i)=>{const y=1-2*i/619,r=Math.sqrt(1-y*y),a=i*2.399963;return {x:Math.cos(a)*r,y,z:Math.sin(a)*r};});
function resize(){const box=canvas.getBoundingClientRect();width=box.width;height=box.height;const d=Math.min(devicePixelRatio||1,2);canvas.width=width*d;canvas.height=height*d;ctx.setTransform(d,0,0,d,0,0);draw()}
canvas.addEventListener('pointermove',e=>{const b=canvas.getBoundingClientRect();pointer.x=(e.clientX-b.left)/width-.5;pointer.y=(e.clientY-b.top)/height-.5});canvas.addEventListener('pointerleave',()=>pointer={x:0,y:0});
function draw(){cancelAnimationFrame(raf);ctx.clearRect(0,0,width,height);if(!paused)angle+=.0025;const radius=Math.min(width*.36,height*.36),cx=width*.52,cy=height*.48;ctx.strokeStyle='#8c9d3d16';ctx.lineWidth=1;for(let i=0;i<width;i+=42){ctx.beginPath();ctx.moveTo(i,0);ctx.lineTo(i,height);ctx.stroke()}for(let i=0;i<height;i+=42){ctx.beginPath();ctx.moveTo(0,i);ctx.lineTo(width,i);ctx.stroke()}
const a=angle+pointer.x*.25,b=-.3+pointer.y*.15;const transformed=points.map(p=>{const x=p.x*Math.cos(a)+p.z*Math.sin(a),z=-p.x*Math.sin(a)+p.z*Math.cos(a);return{x,y:p.y*Math.cos(b)-z*Math.sin(b),z:p.y*Math.sin(b)+z*Math.cos(b)}}).sort((a,b)=>a.z-b.z);
for(const p of transformed){const scale=1+p.z*.14;ctx.fillStyle=`rgba(213,246,91,${.15+(p.z+1)*.36})`;ctx.beginPath();ctx.arc(cx+p.x*radius*scale,cy+p.y*radius*scale,(p.z+1)*.85+.6,0,Math.PI*2);ctx.fill()}
ctx.save();ctx.translate(cx,cy);ctx.rotate(-.42);ctx.strokeStyle='#d5f65b55';ctx.beginPath();ctx.ellipse(0,0,radius*1.36,radius*.41,0,0,Math.PI*2);ctx.stroke();const ox=Math.cos(angle*2)*radius*1.36,oy=Math.sin(angle*2)*radius*.41;ctx.fillStyle='#e0ff85';ctx.shadowColor='#ddff6c';ctx.shadowBlur=20;ctx.beginPath();ctx.arc(ox,oy,5,0,Math.PI*2);ctx.fill();ctx.restore();
ctx.strokeStyle='#cedd8a24';ctx.beginPath();ctx.arc(cx,cy,radius*1.22,0,Math.PI*2);ctx.stroke();if(!paused&&!document.hidden)raf=requestAnimationFrame(draw)}
new ResizeObserver(resize).observe(canvas);document.addEventListener('visibilitychange',()=>{if(document.hidden)cancelAnimationFrame(raf);else draw()});
const questionForm=$('#question-form'),messageField=$('#question-message'),questionStatus=$('#question-status');
messageField.addEventListener('input',()=>{$('#message-count').textContent=messageField.value.length+' / 2500';messageField.setCustomValidity('')});
$('#question-name').addEventListener('input',()=>$('#question-name').setCustomValidity(''));
function prepareQuestion(){
 const name=$('#question-name'),email=$('#question-email');
 name.setCustomValidity(name.value.trim()?'':'Please enter your name.');
 messageField.setCustomValidity(messageField.value.trim().length>=10?'':'Please write at least 10 characters about your question.');
 if(!questionForm.reportValidity())return null;
 const subject='KRADE — '+$('#question-topic').value;
 const body=messageField.value.trim()+'\n\nFrom: '+name.value.trim()+'\nReply to: '+email.value.trim();
 const full='To: pradippandey723@gmail.com\nSubject: '+subject+'\n\n'+body;
 $('#draft-text').value=full;$('#email-draft').hidden=false;
 return {subject,body,full};
}
async function sendToEndpoint(){const btn=questionForm.querySelector('.prepare-email');btn.disabled=true;questionStatus.textContent='Sending…';try{if($('#question-gotcha').value){questionStatus.textContent='Message sent. Thank you!';return}const res=await fetch(SITE.formEndpoint,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify({topic:$('#question-topic').value,name:$('#question-name').value.trim(),email:$('#question-email').value.trim(),message:messageField.value.trim()})});if(!res.ok)throw new Error('HTTP '+res.status);questionForm.reset();$('#message-count').textContent='0 / 2500';$('#email-draft').hidden=true;questionStatus.textContent='Message sent. Thank you! Pradip will reply by email.'}catch(err){questionStatus.textContent='That did not go through. Use Copy message below and email '+SITE.email+' instead.';$('#email-draft').hidden=false}finally{btn.disabled=false}}
if(SITE.formEndpoint){const n=$('#contact-note');if(n)n.textContent='Your message is sent to Pradip, who replies by email. Your name, email and message are used only to reply.';const b=questionForm.querySelector('.prepare-email');if(b)b.firstChild.textContent='Send message ';$('#question-status').textContent='Press Send message when you are ready.'}
questionForm.addEventListener('submit',e=>{e.preventDefault();const draft=prepareQuestion();if(!draft)return;if(SITE.formEndpoint){sendToEndpoint();return}const link='mailto:pradippandey723@gmail.com?subject='+encodeURIComponent(draft.subject)+'&body='+encodeURIComponent(draft.body);if(link.length>1900){questionStatus.textContent='Your draft is ready below. This message is long, so copy it into your email app to send.';$('#draft-text').focus();return;}questionStatus.textContent='Email draft prepared. If your email app opened, review it and press Send. Otherwise, use Copy message below. Nothing has been sent yet.';window.location.href=link;});
$('#copy-message').addEventListener('click',async()=>{const draft=prepareQuestion();if(!draft)return;try{await navigator.clipboard.writeText(draft.full);questionStatus.textContent='Message copied. Paste it into your email app and send it to pradippandey723@gmail.com.';}catch{const field=$('#draft-text');field.focus();field.select();questionStatus.textContent='Your message is selected below. Use your device’s Copy command, then paste it into your email app.';}});
