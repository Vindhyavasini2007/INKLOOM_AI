(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const i of s)if(i.type==="childList")for(const p of i.addedNodes)p.tagName==="LINK"&&p.rel==="modulepreload"&&n(p)}).observe(document,{childList:!0,subtree:!0});function a(s){const i={};return s.integrity&&(i.integrity=s.integrity),s.referrerPolicy&&(i.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?i.credentials="include":s.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function n(s){if(s.ep)return;s.ep=!0;const i=a(s);fetch(s.href,i)}})();const ge=Math.PI*2,T=24,C=(t,e,a)=>Math.min(a,Math.max(e,t)),H=t=>(t%1+1)%1,ne=t=>t*t*(3-2*t),ie=new Map;let N;function X(t,e){let a=ie.get(t);if(!a){if(N??=document.createElement("canvas").getContext("2d",{willReadFrequently:!0}),!N)return`rgba(255, 255, 255, ${e})`;N.fillStyle=t,N.fillRect(0,0,1,1);const[n,s,i]=N.getImageData(0,0,1,1).data;a=[n,s,i],ie.set(t,a)}return`rgba(${a.join(", ")}, ${e})`}function ve(t,e,a,n,s,i){t.beginPath(),t.roundRect(e,a,n,s,i)}function he(t){const e=[...t.querySelectorAll("[data-landing-register]")],a=[];for(const s of e){if(s.querySelector(".specular-button__light"))continue;s.classList.add("specular-button"),s.style.position="relative",s.style.isolation="isolate";const i=document.createElement("canvas");i.className="specular-button__light",i.setAttribute("aria-hidden","true"),i.style.position="absolute",i.style.top="50%",i.style.left="50%",i.style.transform="translate(-50%, -50%)",i.style.pointerEvents="none";const p=document.createElement("span");for(p.className="specular-button__label";s.firstChild;)p.append(s.firstChild);s.append(p,i);const c=i.getContext("2d",{alpha:!0});if(!c)continue;const u=window.matchMedia("(prefers-reduced-motion: reduce)").matches,d={spot:.125,level:.35,pointerX:0,pointerY:0,known:!1},g={lineColor:s.dataset.lineColor||"#ffffff",baseColor:s.dataset.baseColor||"#ffffff",intensity:Math.max(0,Number(s.dataset.intensity??1)),idleIntensity:C(Number(s.dataset.idleIntensity??.35),0,1),shineSize:Math.max(0,Number(s.dataset.shineSize??10)),shineFade:Math.max(0,Number(s.dataset.shineFade??34)),thickness:Math.max(0,Number(s.dataset.thickness??1.2)),glow:Math.max(0,Number(s.dataset.glow??1)),proximity:Math.max(1,Number(s.dataset.proximity??250))};let h=0,y=0,w=0,k=1;const E=()=>{const b=Math.min(parseFloat(getComputedStyle(s).borderTopLeftRadius)||18,y/2,w/2),$=y/2,x=w/2;c.clearRect(0,0,i.width,i.height),c.save(),c.scale(k,k),c.translate(T,T),ve(c,.6,.6,y-1.2,w-1.2,b),c.strokeStyle=X(g.baseColor,.45),c.lineWidth=1.2,c.stroke();const B=c.createConicGradient(0,$,x),Y=g.shineSize/720,te=g.shineFade/360;for(let z=0;z<=64;z+=1){const ae=z/64,ue=K=>Math.abs(H(ae-K+.5)-.5),se=K=>1-ne(C((ue(K)-Y)/Math.max(te,1e-4),0,1)),me=C(se(d.spot)+se(H(d.spot+.5))*.45,0,1);B.addColorStop(ae,X(g.lineColor,me*d.level*g.intensity))}c.strokeStyle=B,c.lineWidth=Math.max(.7,g.thickness*2),c.shadowBlur=12*g.glow*d.level,c.shadowColor=X(g.lineColor,.8),c.stroke(),c.restore()},A=()=>{if(!d.known)return{spot:.125,level:g.idleIntensity};const b=s.getBoundingClientRect(),$=C(d.pointerX,b.left,b.right)-b.left,x=C(d.pointerY,b.top,b.bottom)-b.top,B=Math.hypot(d.pointerX-(b.left+$),d.pointerY-(b.top+x)),Y=C(1-B/g.proximity,0,1);return{spot:H(Math.atan2($-y/2,w/2-x)/ge),level:g.idleIntensity+(1-g.idleIntensity)*ne(Y)}},D=()=>{h=0;const b=A();if(u){d.spot=b.spot,d.level=b.level,E();return}const $=b.spot-d.spot,x=$-Math.round($);d.spot=H(d.spot+x*.3),d.level+=(b.level-d.level)*.3,E(),(Math.abs(x)>5e-4||Math.abs(b.level-d.level)>.002)&&(h=requestAnimationFrame(D))},P=()=>{h||(h=requestAnimationFrame(D))},q=b=>{d.pointerX=b.clientX,d.pointerY=b.clientY,d.known=!0,P()},J=()=>{d.known=!1,P()},Z=()=>{const b=Math.max(1,s.offsetWidth),$=Math.max(1,s.offsetHeight),x=Math.min(window.devicePixelRatio||1,3);b===y&&$===w&&x===k||(y=b,w=$,k=x,i.width=Math.round((y+T*2)*k),i.height=Math.round((w+T*2)*k),i.style.width=`${y+T*2}px`,i.style.height=`${w+T*2}px`,E())},ee=new ResizeObserver(Z);ee.observe(s),window.addEventListener("pointermove",q,{passive:!0}),s.addEventListener("pointerleave",J),Z(),a.push(()=>{cancelAnimationFrame(h),ee.disconnect(),window.removeEventListener("pointermove",q),s.removeEventListener("pointerleave",J)})}for(const s of t.querySelectorAll(".workflow-steps article, .check-card")){const i=c=>{const u=s.getBoundingClientRect();s.style.setProperty("--pointer-x",`${c.clientX-u.left}px`),s.style.setProperty("--pointer-y",`${c.clientY-u.top}px`)},p=()=>{s.style.removeProperty("--pointer-x"),s.style.removeProperty("--pointer-y")};s.addEventListener("pointermove",i,{passive:!0}),s.addEventListener("pointerleave",p),a.push(()=>{s.removeEventListener("pointermove",i),s.removeEventListener("pointerleave",p)})}const n=t.querySelector("[data-flip-word]");if(n){const s=["true to your brand.","backed by approved facts.","consistent everywhere.","clear, verified & trusted."];let i=0;const p=setInterval(()=>{n.classList.add("flip-out"),setTimeout(()=>{i=(i+1)%s.length,n.textContent=s[i],n.classList.remove("flip-out"),n.classList.add("flip-in"),setTimeout(()=>{n.classList.remove("flip-in")},450)},400)},3200);a.push(()=>clearInterval(p))}return()=>a.forEach(s=>s())}const be=()=>"/api",oe=be().replace(/\/$/,""),U=document.querySelector("#app");let W=null;const l={token:localStorage.getItem("inkloom_token"),user:null,page:"overview",content:[],detail:null,analytics:null,brandKit:{guidelines:[],facts:[],assets:[]},attachedMedia:null,detailWorkbenchTab:"highlights"},o=(t="")=>String(t).replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e]),F=(t="Inkloom")=>(t||"Inkloom").trim().split(/\s+/).slice(0,2).map(e=>e[0]||"").join("").toUpperCase()||"I",L=t=>t?new Intl.DateTimeFormat("en",{month:"short",day:"numeric",year:"numeric"}).format(new Date(t)):"—",f=(t="")=>t.replaceAll("_"," ").replace(/\b\w/g,e=>e.toUpperCase()),r=t=>{const e={grid:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',file:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h8"/>',check:'<path d="m5 12 4 4L19 6"/>',book:'<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',chart:'<path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-5 5"/>',users:'<path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="10" cy="7" r="4"/><path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',plus:'<path d="M12 5v14M5 12h14"/>',arrow:'<path d="M5 12h14M12 5l7 7-7 7"/>',search:'<circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>',lock:'<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',spark:'<path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3z"/><path d="m19 14 1.3 2.7L23 18l-2.7 1.3L19 22l-1.3-2.7L15 18l2.7-1.3L19 14z"/>',clock:'<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',warning:'<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4m0 4h.01"/>',close:'<path d="m18 6-12 12M6 6l12 12"/>',diff:'<circle cx="12" cy="12" r="9"/><path d="M9 12h6M12 9v6"/>',image:'<rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>',palette:'<circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.563-2.512 5.563-5.563C22 6.5 17.5 2 12 2z"/>',printer:'<polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/>',shield:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',info:'<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>'};return`<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${e[t]||e.file}</svg>`};async function v(t,e={}){const a={...e.body?{"Content-Type":"application/json"}:{},...l.token?{Authorization:`Bearer ${l.token}`}:{},...e.headers};let n,s;const i=new AbortController,p=window.setTimeout(()=>i.abort(),2e4);try{if(n=await fetch(`${oe}${t}`,{...e,headers:a,signal:i.signal,body:e.body&&typeof e.body!="string"?JSON.stringify(e.body):e.body}),!(n.headers.get("content-type")||"").toLowerCase().includes("application/json")){const u=new Error(`Inkloom's API route ${t} returned a web page instead of JSON (HTTP ${n.status}). Check the deployment's /api routing.`);throw u.name="ApiResponseError",u}s=await n.json()}catch(c){throw c.name==="AbortError"?new Error("Inkloom's server took too long to respond. Please try again."):c.name==="ApiResponseError"?c:c instanceof SyntaxError?new Error(`Inkloom's API route ${t} returned invalid JSON. Please try again or contact the workspace admin.`):new Error(`Could not connect to Inkloom's API at ${oe}. Verify your server is running.`)}finally{window.clearTimeout(p)}if(n.status===401&&l.token)throw de(),new Error(s.error||"Your session expired. Please sign in again.");if(!n.ok)throw new Error(s.error||"Something went wrong. Please try again.");return s}function m(t,e="success"){document.querySelector(".toast")?.remove();const a=document.createElement("div");a.className=`toast ${e}`,a.setAttribute("role","status"),a.textContent=t,document.body.append(a),window.setTimeout(()=>a.remove(),4200)}function de(){localStorage.removeItem("inkloom_token"),l.token=null,l.user=null,l.detail=null,l.content=[],V()}async function fe(t){const e={admin:{email:"admin@demo.test",name:"Alex Admin"},creator:{email:"creator@demo.test",name:"Cara Creator"},reviewer:{email:"reviewer@demo.test",name:"Rae Reviewer"}}[t];if(e)try{m(`Switching persona to ${e.name}…`,"info");const a=await v("/auth/login",{method:"POST",body:{email:e.email,password:"Passw0rd!demo"}});l.token=a.token,l.user=a.user,localStorage.setItem("inkloom_token",a.token),await S(),m(`Active as ${a.user.name} (${f(a.user.role)})`,"success")}catch(a){m(`Could not switch persona: ${a.message}`,"error")}}function ye(t="",e=""){if(t===e)return[{type:"same",value:t}];const a=t.split(/(\s+)/),n=e.split(/(\s+)/),s=a.length,i=n.length;if(s===0)return n.map(g=>({type:"added",value:g}));if(i===0)return a.map(g=>({type:"removed",value:g}));const p=Array.from({length:s+1},()=>new Uint16Array(i+1));for(let g=0;g<s;g++)for(let h=0;h<i;h++)a[g]===n[h]?p[g+1][h+1]=p[g][h]+1:p[g+1][h+1]=Math.max(p[g+1][h],p[g][h+1]);let c=s,u=i;const d=[];for(;c>0||u>0;)c>0&&u>0&&a[c-1]===n[u-1]?(d.unshift({type:"same",value:a[c-1]}),c--,u--):u>0&&(c===0||p[c][u-1]>=p[c-1][u])?(d.unshift({type:"added",value:n[u-1]}),u--):c>0&&(u===0||p[c][u-1]<p[c-1][u])&&(d.unshift({type:"removed",value:a[c-1]}),c--);return d}function we(t="",e=[]){if(!e||!e.length)return`<div class="draft-text-content">${o(t)}</div>`;const a=e.filter(i=>i.start!=null&&i.end!=null&&i.end>i.start&&i.status==="open").sort((i,p)=>i.start-p.start);let n="",s=0;for(const i of a){if(i.start<s)continue;n+=o(t.slice(s,i.start));const p=i.severity||"medium",c=i.category||"general";n+=`<mark class="highlight-mark highlight-${o(p)} highlight-${o(c)}" data-highlight-fid="${o(i.fid)}" title="${o(i.explanation)}" tabindex="0"><span>${o(t.slice(i.start,i.end))}</span><span class="highlight-tag">${o(p.toUpperCase())}</span></mark>`,s=i.end}return n+=o(t.slice(s)),`<div class="draft-text-content highlighted-draft">${n}</div>`}function ke(t,e=[],a=[]){if(!t.trim())return{score:100,findings:[]};const n=[];for(const u of e.filter(d=>d.active!==!1))try{const d=new RegExp(u.pattern,"gi");for(const g of t.matchAll(d))g[0]&&n.push({category:u.category,severity:u.severity||"medium",excerpt:g[0],explanation:u.rule,suggestion:u.replacement||null,sourceLabel:`Guideline v${u.version||1}: ${u.rule}`})}catch{}for(const u of a.filter(d=>d.status==="active"))if(!(!u.match?.regex||u.match.expected==null))try{const d=new RegExp(u.match.regex,"gi");for(const g of t.matchAll(d)){const h=g.slice(1).find(y=>y!==void 0);h===void 0||String(h)===String(u.match.expected)||n.push({category:"factual",severity:"critical",excerpt:g[0],explanation:`Says “${h}” but approved fact is “${u.match.expected}”.`,suggestion:g[0].replace(h,u.match.expected),sourceLabel:`Approved Fact v${u.version||1}: ${u.statement}`})}}catch{}const s=[{pattern:/<img\b(?![^>]*\balt\s*=)[^>]*>/gi,category:"accessibility",severity:"medium",explanation:"Image missing alternative text."},{pattern:/\[(?:click here|here|read more|learn more)\]\([^)]+\)/gi,category:"accessibility",severity:"medium",explanation:"Use descriptive link destination text."},{pattern:/\b(?:TODO|LOREM IPSUM|TBD|REPLACE[ _-]ME)\b/gi,category:"messaging",severity:"high",explanation:"Unfinished draft placeholder detected."},{pattern:/(?:logo[-_]?(?:old|draft|v1|temp)\.(?:png|jpg|svg|webp))/gi,category:"visual",severity:"high",explanation:"Deprecated or unofficial logo asset reference."}];for(const u of s)for(const d of t.matchAll(u.pattern))n.push({category:u.category,severity:u.severity,excerpt:d[0],explanation:u.explanation,suggestion:null,sourceLabel:"Built-in Governance Check"});const i={critical:25,high:12,medium:6,low:2},p=n.reduce((u,d)=>u+(i[d.severity]||0),0);return{score:Math.max(0,100-p),findings:n}}function $e(t,e){const a=new FileReader;a.onload=n=>{const s=n.target.result,i=new Image;i.onload=()=>{const p=i.naturalWidth,c=i.naturalHeight,u=(p/c).toFixed(2),d=Math.abs(p/c-16/9)<.15,g=Math.abs(p/c-1)<.1,h=Math.abs(p/c-4/5)<.1,y=document.createElement("canvas");y.width=10,y.height=10;const w=y.getContext("2d");w.drawImage(i,0,0,10,10);const k=w.getImageData(0,0,10,10).data,E=[];for(let A=0;A<k.length;A+=40){const D=k[A].toString(16).padStart(2,"0"),P=k[A+1].toString(16).padStart(2,"0"),q=k[A+2].toString(16).padStart(2,"0");E.push(`#${D}${P}${q}`.toUpperCase())}e({name:t.name,dataUrl:s,width:p,height:c,ratio:u,fileSizeMB:(t.size/(1024*1024)).toFixed(2),standardRatio:d?"16:9 (Landscape Web)":g?"1:1 (Square Feed)":h?"4:5 (Portrait Social)":"Custom Dimension",isRatioStandard:d||g||h,isSizeOptimized:t.size<2*1024*1024,colors:[...new Set(E)].slice(0,4)})},i.src=s},a.readAsDataURL(t)}function V(){W?.(),U.innerHTML=`<a class="skip-link" href="#landing-main">Skip to content</a>
    <div class="landing-page" id="landing-top">
      <header class="landing-header">
        <a class="brand landing-brand" href="#landing-top" aria-label="Inkloom home"><span class="brand-mark">i.</span><span>inkloom ai</span></a>
        <nav class="landing-nav" aria-label="Main navigation"><a href="#what-we-check">Capabilities</a><a href="#how-it-works">How it works</a><a href="#for-teams">For teams</a><a href="#faq">FAQ</a></nav>
        <div class="landing-actions"><button class="landing-login" data-landing-login>Sign in</button><button class="button button-primary" data-landing-register>Get started ${r("arrow")}</button></div>
      </header>
      <main id="landing-main">
        <section class="landing-hero">
          <div class="hero-copy">
            <div class="animated-kicker"><span class="kicker-badge">NEW</span><span class="kicker-pulse"></span><span>Brand governance for every content team</span><span class="kicker-spark">✦</span></div>
            <h1>Keep every voice<br><span class="flip-words-container"><span class="flip-word" data-flip-word>true to your brand.</span></span></h1>
            <p class="hero-paragraph">When many people and tools publish content, small inconsistencies can erode trust. Inkloom checks drafts against your <span class="highlight-text">approved facts</span> and <span class="highlight-text">guidelines</span>, explains what needs attention, and keeps <span class="highlight-text bold">people in control</span>.</p>
            <div class="hero-ctas"><button class="button button-primary button-large" data-landing-register>Create your workspace ${r("arrow")}</button><a class="hero-secondary" href="#how-it-works">See how reviews work <span>↓</span></a></div>
            <div class="hero-assurance"><span class="assurance-icon">${r("shield")}</span><span><strong>Human decisions stay central</strong><small>Rules-based checks work without AI. AI review is optional.</small></span></div>
          </div>
          <div class="hero-visual" aria-label="Illustration of an explainable brand review">
            <div class="visual-orbit orbit-a"></div><div class="visual-orbit orbit-b"></div>
            <div class="review-preview">
              <div class="preview-top"><span class="preview-doc">${r("file")}</span><span><strong>Draft review</strong><small>Example finding · Claims guideline</small></span><span class="preview-live"><i></i> Needs review</span></div>
              <div class="preview-rule"><span>APPROVED GUIDELINE</span><strong>Claims must be supported by approved evidence.</strong></div>
              <div class="preview-excerpt"><span>IN THE DRAFT</span><p>“The <mark>best platform in the world</mark> for modern marketing.”</p></div>
              <div class="preview-finding"><span class="preview-alert">${r("warning")}</span><div><div class="preview-finding-title"><strong>Evidence needed</strong><span>CLAIMS · HIGH</span></div><p>“Best platform” is an unsupported superlative. No approved comparison source was found.</p></div></div>
              <div class="preview-suggestion"><span>${r("spark")} Suggested direction</span><p>“A platform designed to help teams do their best work.”</p></div>
              <div class="preview-footer"><span>Suggestion for the creator to consider</span><span>Reviewer makes the final decision</span></div>
            </div>
            <div class="hero-caption"><span class="caption-spark">✳</span> Clear reasons. Approved sources. People in control.</div>
          </div>
        </section>
        <section class="trust-strip" aria-label="Inkloom review principles">
          <div class="trust-strip-label">
            <span class="trust-dot"></span>
            <span>BUILT FOR TRUSTWORTHY CONTENT</span>
          </div>
          <div class="marquee-wrapper">
            <div class="marquee-track">
              <!-- Set 1 -->
              <span class="trust-pill trust-pill-emerald">${r("book")} <strong>Approved facts &amp; guidance</strong></span>
              <span class="trust-pill trust-pill-indigo">${r("info")} <strong>Clear, explainable findings</strong></span>
              <span class="trust-pill trust-pill-amber">${r("users")} <strong>Human-led approvals</strong></span>
              <span class="trust-pill trust-pill-rose">${r("lock")} <strong>Workspace privacy</strong></span>
              <!-- Set 2 -->
              <span class="trust-pill trust-pill-emerald" aria-hidden="true">${r("book")} <strong>Approved facts &amp; guidance</strong></span>
              <span class="trust-pill trust-pill-indigo" aria-hidden="true">${r("info")} <strong>Clear, explainable findings</strong></span>
              <span class="trust-pill trust-pill-amber" aria-hidden="true">${r("users")} <strong>Human-led approvals</strong></span>
              <span class="trust-pill trust-pill-rose" aria-hidden="true">${r("lock")} <strong>Workspace privacy</strong></span>
              <!-- Set 3 -->
              <span class="trust-pill trust-pill-emerald" aria-hidden="true">${r("book")} <strong>Approved facts &amp; guidance</strong></span>
              <span class="trust-pill trust-pill-indigo" aria-hidden="true">${r("info")} <strong>Clear, explainable findings</strong></span>
              <span class="trust-pill trust-pill-amber" aria-hidden="true">${r("users")} <strong>Human-led approvals</strong></span>
              <span class="trust-pill trust-pill-rose" aria-hidden="true">${r("lock")} <strong>Workspace privacy</strong></span>
            </div>
          </div>
        </section>
        <section class="landing-section checks-section" id="what-we-check"><div class="landing-section-heading"><span class="landing-kicker">ONE REVIEW, WITH THE REASONS INCLUDED</span><h2>Catch the drift.<br><em>Keep the creator’s intent.</em></h2><p>Use approved brand knowledge to check drafts before publication. Every finding gives your team useful context for what to do next.</p></div><div class="check-grid">
          <article class="check-card"><span class="check-badge">1</span><h3>Approved facts &amp; guidelines</h3><p>Keep versioned facts, terminology, tone, and claims guidance together as your team’s reference point.</p><span class="check-tag">YOUR BRAND KNOWLEDGE</span></article>
          <article class="check-card"><span class="check-badge">2</span><h3>Consistent language &amp; claims</h3><p>Flag outdated details, off-brand wording, terminology mismatches, and unsupported promotional claims.</p><span class="check-tag">FACTS · TONE · MESSAGING</span></article>
          <article class="check-card"><span class="check-badge">3</span><h3>Accessible draft content</h3><p>Check HTML and Markdown drafts for missing image alt text and vague link labels before they go out.</p><span class="check-tag">BUILT-IN ACCESSIBILITY CHECKS</span></article>
          <article class="check-card"><span class="check-badge">4</span><h3>Findings people can understand</h3><p>See the excerpt, why it was flagged, the supporting source when available, and a possible revision.</p><span class="check-tag">EXPLAINABLE &amp; SOURCE-AWARE</span></article>
          <article class="check-card"><span class="check-badge">5</span><h3>Human review &amp; accountability</h3><p>Creators revise, reviewers decide, and version history keeps the discussion and outcome traceable.</p><span class="check-tag">ROLES · APPROVALS · AUDIT</span></article>
          <article class="check-card"><span class="check-badge">6</span><h3>Governance insights</h3><p>See repeated issues, review activity, and guidance people often reject so your process can improve.</p><span class="check-tag">LEARN FROM REVIEW HISTORY</span></article>
        </div></section>
        <section class="workflow-section" id="how-it-works"><div class="workflow-intro"><span class="landing-kicker">FROM FIRST DRAFT TO HUMAN APPROVAL</span><h2>A clear path to on-brand publishing</h2><p>Automation helps your team spot issues early. People keep control of edits and decisions.</p></div><div class="workflow-steps"><article><span>1</span><h3>Set your brand guidance</h3><p>Add approved facts, claims, terminology, and tone guidelines to your workspace.</p><small>ADMIN-MAINTAINED KNOWLEDGE</small></article><article><span>2</span><h3>Review a draft</h3><p>Paste content or import a text file. Run rules-based checks, with optional AI review.</p><small>AI OPTIONAL · RULES ALWAYS AVAILABLE</small></article><article><span>3</span><h3>Revise with context</h3><p>Inspect excerpts, reasons, sources, and suggested fixes. Choose what to accept or reject.</p><small>CREATOR STAYS IN CONTROL</small></article><article><span>4</span><h3>Approve and learn</h3><p>Submit for teammate review, track the decision, and use governance insights to improve guidance.</p><small>HUMAN SIGN-OFF · HISTORY</small></article></div></section>
        <section class="teams-section" id="for-teams"><div><span class="landing-kicker teams-kicker">SHARED OWNERSHIP, CLEAR RESPONSIBILITY</span><h2>Creators, reviewers,<br><em>one trusted process.</em></h2><p>Give creators room to write, reviewers the evidence to make a decision, and admins the tools to keep approved guidance current.</p><button class="button teams-cta-button" data-landing-register>Start with your team ${r("arrow")}</button></div><div class="teams-card"><div class="team-row creator-row"><span class="team-step creator-step">C</span><div><strong>Creator</strong><small>Drafts, considers findings, and submits for review</small></div><span class="team-check">01</span></div><div class="team-row reviewer-row"><span class="team-step reviewer-step">R</span><div><strong>Reviewer</strong><small>Checks evidence, leaves feedback, records a decision</small></div><span class="team-check">02</span></div><div class="team-row admin-row"><span class="team-step admin-step">A</span><div><strong>Admin</strong><small>Maintains approved facts, guidelines, and team roles</small></div><span class="team-check">03</span></div><div class="teams-card-note">${r("lock")} AI review is optional. Only the text needed for review is sent to the configured provider.</div></div></section>
        <section class="landing-cta" id="governance-trust"><span class="cta-mark">i.</span><div><span class="landing-kicker">RESPONSIBLE AUTOMATION, WITH PEOPLE IN CONTROL</span><h2>Make better decisions<br><em>before content goes live.</em></h2><p>Rules-based checks work without AI. When AI is enabled, your team can review its findings and keep the final say.</p></div><button class="button button-light button-large" data-landing-register>Create your workspace ${r("arrow")}</button></section>
        <section class="faq-section" id="faq"><div class="faq-intro"><span class="landing-kicker">GOOD TO KNOW</span><h2>Clear answers before your first review.</h2><p>Inkloom is designed to make brand reviews understandable, useful, and accountable.</p></div><div class="faq-list">
          <details><summary>What can Inkloom review today?</summary><p>Teams can review pasted drafts and import text files. Built-in accessibility checks can flag missing image alt text and vague links in HTML and Markdown. PDF and DOCX uploads and visual image analysis are not supported yet.</p></details>
          <details><summary>Do we need to use AI?</summary><p>No. Rules and approved-fact checks run without AI. If an AI provider is configured, AI review is optional and the rules-based review remains available if the provider fails.</p></details>
          <details><summary>How does Inkloom keep people in control?</summary><p>Suggestions are choices for the creator. Teammates review submitted content, record decisions, and can request changes or reject content. Critical findings block approval unless an authorised reviewer records an override reason.</p></details>
          <details><summary>What happens to content sent for AI review?</summary><p>Only the text needed for a review is sent to the configured AI provider. Check that provider’s retention policy and tell your team when AI review is enabled.</p></details>
        </div></section>
      </main>
      <section class="newsletter-section" aria-labelledby="newsletter-heading"><span class="newsletter-icon">${r("mail")}</span><h2 id="newsletter-heading">Stay informed on brand governance best practices.</h2><p>Occasional practical notes on brand safety, explainable AI reviews, and content workflows.</p><form id="newsletter-form"><label class="sr-only" for="newsletter-email">Your email address</label><input id="newsletter-email" name="email" type="email" autocomplete="email" required maxlength="254" placeholder="you@company.com"><button class="button newsletter-submit" type="submit">Stay in the loop</button></form><small class="newsletter-disclaimer">Your email stays private. <button type="button" data-newsletter-mode="unsubscribe">Already subscribed? Unsubscribe</button></small></section>
      <footer class="landing-footer"><div class="footer-main"><div class="footer-brand-column"><a class="brand brand-light" href="#landing-top"><span class="brand-mark">i.</span><span>inkloom ai</span></a><p>Brand governance that helps teams publish consistent, trustworthy content.</p><span class="footer-security">${r("shield")} Explainable checks · Human oversight · AI optional</span></div><div class="footer-column"><strong>PRODUCT</strong><a href="#what-we-check">What we check</a><a href="#how-it-works">How it works</a><a href="#faq">Frequently asked questions</a></div><div class="footer-column"><strong>YOUR TEAM</strong><a href="#for-teams">Roles &amp; approvals</a><button data-landing-login>Sign in</button></div><div class="footer-column"><strong>TRANSPARENCY</strong><span>Rules-based checks work without AI</span><span>Text review only for supported formats</span><span>Human approval stays in the loop</span></div></div><div class="footer-bottom"><span>© ${new Date().getFullYear()} Inkloom AI</span><span>Consistent content. Clear reasons. Human decisions.</span></div></footer>
    </div>`,W=he(U)}function O(t=!1){W?.(),W=null,U.innerHTML=`<main class="auth-screen">
    <section class="auth-aside">
      <div class="auth-aside-inner"></div>
      <a class="brand brand-light" href="#" aria-label="Inkloom home"><span class="brand-mark">i.</span><span>inkloom ai</span></a>
      <div class="auth-story">
        <span class="eyebrow light">INTELLIGENT BRAND GOVERNANCE</span>
        <h1>Ensure every<br>word feels like <em>you.</em></h1>
        <p>Deterministic brand rules, verified company facts, and human approval workflows before any draft goes live.</p>
        <div class="auth-features">
          <div class="auth-feature-pill"><span class="auth-feature-pill-icon">${r("book")}</span>Approved facts</div>
          <div class="auth-feature-pill"><span class="auth-feature-pill-icon">${r("info")}</span>Clear findings</div>
          <div class="auth-feature-pill"><span class="auth-feature-pill-icon">${r("users")}</span>Human approvals</div>
          <div class="auth-feature-pill"><span class="auth-feature-pill-icon">${r("lock")}</span>Workspace privacy</div>
        </div>
      </div>
      <div class="demo-card">
        <span class="demo-icon">${r("users")}</span>
        <div>
          <strong>Evaluation Demo Logins (Password: <code>Passw0rd!demo</code>)</strong>
          <p>
            • Admin: <button type="button" class="text-button" data-demo="admin">admin@demo.test</button><br>
            • Creator: <button type="button" class="text-button" data-demo="creator">creator@demo.test</button><br>
            • Reviewer: <button type="button" class="text-button" data-demo="reviewer">reviewer@demo.test</button>
          </p>
        </div>
      </div>
      <span class="auth-foot">Confidential workspace · Isolated tenant storage</span>
    </section>
    <section class="auth-panel"><div class="auth-form-wrap">
      <span class="eyebrow">WORKSPACE ACCESS</span>
      <h2>${t?'Create your <span class="auth-heading-accent">brand workspace</span>':'Welcome back to <span class="auth-heading-accent">Inkloom</span>'}</h2>
      <p class="muted">${t?"Establish a private brand kit and invite your review team.":"Sign in to review content and inspect governance insights."}</p>
      <form id="auth-form" class="form-stack">
        ${t?'<label>Full name<input name="name" autocomplete="name" placeholder="Alex Morgan" required maxlength="100"></label><label>Organization name<input name="organisationName" placeholder="Acme Studio" required maxlength="120"></label>':""}
        <label>Work email<input name="email" type="email" autocomplete="email" placeholder="you@company.com" required></label>
        <label>Password<input name="password" type="password" autocomplete="${t?"new-password":"current-password"}" placeholder="${t?"At least 8 characters":"Your password"}" required minlength="${t?8:1}"></label>
        <button class="button button-primary button-wide" type="submit">${t?"Create workspace":"Sign in"} ${r("arrow")}</button>
      </form>
      <p class="auth-switch">${t?"Already have an account?":"New to Inkloom?"} <button type="button" class="text-button" data-auth-toggle>${t?"Sign in":"Create a workspace"}</button><br><button type="button" class="auth-home-link" data-auth-home>← Back to Inkloom home</button></p>
      <p class="privacy-note">${r("lock")} Private by design. Rule engine runs locally on your server. Confidential materials are protected.</p>
    </div></section>
  </main>`,document.querySelector("#auth-form").addEventListener("submit",async e=>{e.preventDefault();const a=Object.fromEntries(new FormData(e.currentTarget)),n=e.currentTarget.querySelector("button[type=submit]");n.disabled=!0,n.innerHTML='<span class="spinner"></span> Authenticating…';try{const s=await v(t?"/auth/register":"/auth/login",{method:"POST",body:a});if(!s?.token||!s?.user?.id)throw new Error("Inkloom did not return a valid sign-in session. Check the API deployment and try again.");l.token=s.token,l.user=s.user,l.page="overview",localStorage.setItem("inkloom_token",s.token),await S()}catch(s){m(s.message,"error"),n.disabled=!1,n.innerHTML=`${t?"Create workspace":"Sign in"} ${r("arrow")}`}})}function R(t,e,a,n=""){return`<button class="nav-link ${l.page===t?"active":""}" data-page="${t}">${r(a)}<span>${e}</span>${n?`<span class="nav-count">${n}</span>`:""}</button>`}function xe(t){const e=l.user,a=l.content.filter(n=>n.status==="in_review").length;U.innerHTML=`
  <div class="print-only-header">
    <h2>INKLOOM AI — BRAND GOVERNANCE AUDIT SUMMARY</h2>
    <p>Organization: <strong>${o(e?.organisationName||"Demo Co")}</strong> | Export Date: ${L(new Date)} | User: ${o(e?.name)}</p>
  </div>
  <div class="app-shell">
    <aside class="sidebar">
      <a href="#" class="brand"><span class="brand-mark">i.</span><span>inkloom ai</span></a>
      <div class="workspace-switch"><span class="workspace-avatar">${o(F(e?.organisationName||"Demo"))}</span><span class="workspace-name">${o(e?.organisationName||"Demo Co")}<small>${o(e?.role?.toUpperCase())} WORKSPACE</small></span><span class="switch-caret">✓</span></div>
      <div class="nav-section"><span class="nav-label">WORKSPACE</span>${R("overview","Overview","grid")}${R("content","All Content","file")}${R("approvals","Approvals Queue","check",a||"")}</div>
      <div class="nav-section"><span class="nav-label">BRAND GOVERNANCE</span>${R("guidelines","Brand Kit & Assets","book")}${R("analytics","Governance Insights","chart")}${R("team","Team & Roles","users")}</div>
      <div class="sidebar-bottom">
        <div class="privacy-card"><span class="privacy-icon">${r("shield")}</span><strong>Responsible AI review</strong><p>Rules-based checks run without AI. Optional AI sends only review text to your configured provider.</p><button data-page="guidelines">View Brand Kit ${r("arrow")}</button></div>
        <button class="profile" data-logout><span class="avatar">${o(F(e?.name))}</span><span class="profile-info">${o(e?.name)}<small>${o(e?.role)} · Sign out</small></span><span class="logout-symbol">↗</span></button>
      </div>
    </aside>
    <main class="main-content">
      <header class="topbar">
        <div class="breadcrumbs"><span>Workspace</span><span class="crumb-slash">/</span><strong>${o(f(l.page))}</strong></div>
        <div class="topbar-right">
          <div class="persona-switcher" aria-label="Demo Persona Switcher">
            <span class="persona-label">Persona:</span>
            <button class="persona-chip ${e?.role==="admin"?"active":""}" data-switch-role="admin" title="Full brand kit admin">👑 Admin</button>
            <button class="persona-chip ${e?.role==="creator"?"active":""}" data-switch-role="creator" title="Drafts & submits content">✏️ Creator</button>
            <button class="persona-chip ${e?.role==="reviewer"?"active":""}" data-switch-role="reviewer" title="Reviews & approves drafts">🧐 Reviewer</button>
          </div>
          <span class="secure-label">${r("shield")} Secure Tenant</span>
          <button class="avatar avatar-small" aria-label="Account">${o(F(e?.name))}</button>
        </div>
      </header>
      <div class="page-body">${t}</div>
    </main>
  </div>
  <dialog id="app-modal"></dialog>`}const Q=t=>`<span class="status-badge status-${o(t)}"><i></i>${o(f(t))}</span>`,G=t=>t>=90?"score-good":t>=70?"score-mid":"score-low",_=t=>t.length?t.map(e=>`<button class="content-row" data-open="${o(e._id)}">
    <span class="content-type-icon">${r(e.type==="email"?"mail":e.type==="social"?"spark":"file")}</span>
    <span class="row-title"><strong>${o(e.title)}</strong><small>${o(f(e.type))} · By ${o(e.createdByName||"Team member")}</small></span>
    <span class="row-score ${e.score==null?"score-na":G(e.score)}">${e.score==null?"—":`${e.score}<small>/100</small>`}</span>
    ${Q(e.status)}
    <span class="row-date">${L(e.updatedAt)}</span>
    ${r("arrow")}
  </button>`).join(""):'<div class="empty-state"><span class="empty-illustration">✳</span><strong>No content here yet.</strong><p>Bring in a draft to run an explainable brand governance review.</p><button class="button button-primary" data-page="new-content">Create your first review</button></div>';function re(){const t=l.content.slice(0,5),e=l.analytics||{},a=l.content.filter(p=>p.status==="in_review").length,n=l.content.filter(p=>p.score!=null).length,s=e.avgScore;return`
    <div class="page-heading">
      <div><span class="eyebrow">🗓 ${new Intl.DateTimeFormat("en",{weekday:"long",month:"long",day:"numeric"}).format(new Date).toUpperCase()}</span><h1>Brand Governance <em>Dashboard</em></h1><p class="muted">Real-time status of brand alignment, active approvals, and governance findings.</p></div>
      <div class="heading-actions">
        <button class="button button-outline" data-action="print-report">${r("printer")} Export Report</button>
        <button class="button button-primary" data-page="new-content">${r("plus")} New Content Review</button>
      </div>
    </div>
    <section class="welcome-banner">
      <div class="welcome-text"><span class="welcome-mark">✳</span><div><span class="eyebrow light">✦ INTELLIGENT BRAND SAFEGUARDS</span><h2>Consistent brand voice <em>across every channel.</em></h2><p>Deterministic factual verification, tone alignment, accessibility checks, and approved asset standards.</p></div></div>
      <button class="button button-light" data-page="new-content">Review a new draft ${r("arrow")}</button>
      <span class="banner-orbit orbit-one"></span><span class="banner-orbit orbit-two"></span>
    </section>
    <section class="metric-grid">
      <article class="metric-card"><span class="metric-icon metric-lavender">${r("file")}</span><span class="metric-label">Content Reviewed</span><strong>${n}<small> drafts</small></strong><span class="metric-foot">Across ${l.content.length} total workspace items</span></article>
      <article class="metric-card"><span class="metric-icon metric-mint">${r("spark")}</span><span class="metric-label">Brand Alignment Score</span><strong>${s==null?"—":`${s}`}<small>${s==null?"":"/100"}</small></strong><span class="metric-foot">${s==null?"Run reviews to establish score":"Workspace average quality"}</span></article>
      <article class="metric-card"><span class="metric-icon metric-peach">${r("clock")}</span><span class="metric-label">Pending Approvals</span><strong>${a}<small> items</small></strong><span class="metric-foot">${a?"Awaiting reviewer sign-off":"All caught up"}</span></article>
      <article class="metric-card"><span class="metric-icon metric-rose">${r("warning")}</span><span class="metric-label">Open Critical Issues</span><strong>${e.criticalOpen??0}<small> issues</small></strong><span class="metric-foot">Require resolution or written override</span></article>
    </section>
    <section class="section-block">
      <div class="section-heading"><div><span class="eyebrow">📋 ACTIVITY PIPELINE</span><h2>Recently Touched <em>Content</em></h2></div><button class="button button-quiet" data-page="content">View all ${r("arrow")}</button></div>
      <div class="content-list">${_(t)}</div>
    </section>`}function Se(){const e=new URLSearchParams(location.hash.split("?")[1]||"").get("status")||"all",a=e==="all"?l.content:l.content.filter(n=>n.status===e);return`
    <div class="page-heading"><div><span class="eyebrow">📁 ORGANIZATION CONTENT</span><h1>All Content <em>Drafts</em></h1><p class="muted">All marketing, social, email, and web copy across the review lifecycle.</p></div><button class="button button-primary" data-page="new-content">${r("plus")} New Review</button></div>
    <div class="filter-tabs">
      ${[["all","Everything"],["draft","Drafts"],["in_review","In Review"],["approved","Approved"],["changes_requested","Changes Requested"]].map(([n,s])=>`<button class="filter-tab ${e===n?"selected":""}" data-filter="${n}">${s}</button>`).join("")}
    </div>
    <div class="content-list">${_(a)}</div>`}function Ae(){return`
    <div class="page-heading"><div><button class="back-link" data-page="content">← Back to content</button><span class="eyebrow">✏️ NEW REVIEW WORKFLOW</span><h1>Create &amp; Review <em>Content</em></h1><p class="muted">Check copy, visual assets, and links against approved brand guidelines before publication.</p></div></div>
    <form id="new-content-form" class="editor-layout">
      <section class="editor-card">
        <div class="editor-topline"><span class="step-number">01</span><div><strong>Content Details</strong><small>Paste text or import Markdown / HTML / TXT / CSV.</small></div>
          <label class="upload-button">${r("file")} Import text file<input type="file" id="draft-file" accept=".txt,.md,.html,.csv,.json,text/plain,text/markdown,text/html"></label>
        </div>
        <label>Draft Title<input name="title" maxlength="200" required placeholder="e.g. Q4 Product Launch Announcement"></label>
        <label>Content Format<select name="type"><option value="marketing">Marketing copy</option><option value="social">Social media post</option><option value="email">Email newsletter</option><option value="web">Website landing page</option><option value="press">Press release</option></select></label>
        <label>Draft Content<textarea name="text" id="draft-text" maxlength="20000" required rows="12" placeholder="Paste your draft copy here. Include links, images or text. Inkloom will evaluate it against your brand kit..."></textarea></label>
        
        <!-- Visual Asset Inspector Section -->
        <div class="media-inspector-card">
          <div class="editor-topline"><span class="step-number">02</span><div><strong>Visual &amp; Media Asset Inspector (Optional)</strong><small>Upload an image to check dimensions, aspect ratio, alt text, and color harmony.</small></div>
            <label class="upload-button">${r("image")} Attach image<input type="file" id="media-file-input" accept="image/png,image/jpeg,image/webp,image/svg+xml"></label>
          </div>
          <div id="media-preview-container" class="hidden"></div>
        </div>

        <div class="editor-footer"><span><span id="word-count">0 words</span> · Up to 20,000 characters</span><button class="button button-primary" type="submit">${r("spark")} Save &amp; Run Brand Review</button></div>
      </section>
      <aside class="editor-aside">
        <div class="soft-card"><span class="soft-card-icon">${r("book")}</span><span class="eyebrow">BRAND KIT SOURCES</span><h3>Multi-Dimensional Governance</h3><p>Every finding links back to an approved fact, terminology rule, or accessibility standard.</p><button type="button" class="text-button" data-page="guidelines">Explore brand kit ${r("arrow")}</button></div>
        <div class="soft-card soft-card-light"><span class="soft-card-icon">${r("shield")}</span><strong>Explainable &amp; Safe</strong><p>Suggestions are strictly optional. Human creators retain final creative authority.</p></div>
      </aside>
    </form>`}function Ie(t,e){return`<article class="finding-card finding-${o(t.severity)}" data-finding-fid="${o(t.fid)}">
    <div class="finding-head"><span class="finding-number">${String(e+1).padStart(2,"0")}</span><span class="finding-category">${o(f(t.category))}</span><span class="severity severity-${o(t.severity)}">${o(f(t.severity))}</span><span class="finding-status">${o(f(t.status))}</span></div>
    <blockquote>“${o(t.excerpt)}”</blockquote>
    <p class="finding-explanation">${o(t.explanation)}</p>
    <div class="finding-source"><span class="source-dot ${t.evidenceMissing?"source-missing":""}">${t.evidenceMissing?"?":"↗"}</span><span><small>${t.evidenceMissing?"NO SUPPORTING SOURCE":t.sourceType==="accessibility"?"ACCESSIBILITY CHECK":t.sourceType==="governance"?"GOVERNANCE STANDARD":"APPROVED BRAND SOURCE"}</small><strong>${o(t.sourceLabel||"No supporting source found")}</strong></span></div>
    ${t.suggestion?`<div class="suggestion"><span class="suggestion-label">${r("spark")} Suggested On-Brand Correction</span><p>${o(t.suggestion)}</p></div>`:""}
    ${t.status==="open"&&t.suggestion&&pe()?`<div class="finding-actions"><button class="button button-outline" data-suggestion="${o(t.fid)}" data-action="accept">Apply Suggestion</button><button class="button button-quiet" data-suggestion="${o(t.fid)}" data-action="reject">Dismiss</button></div>`:""}
  </article>`}function pe(){const t=l.detail?.content;return t&&["draft","changes_requested"].includes(t.status)&&(l.user.role==="admin"||String(t.createdBy)===l.user.id)}function Ee(){const{content:t,review:e,approvals:a,audit:n}=l.detail,s=t.versions.at(-1),i=pe(),p=["admin","reviewer"].includes(l.user.role),c=t.status==="in_review"&&p&&String(t.createdBy)!==l.user.id,u=t.versions.length>1;return`
    <div class="page-heading detail-heading">
      <div>
        <button class="back-link" data-page="content">← All Content</button>
        <span class="eyebrow">${o(f(t.type))} · VERSION ${s.n}</span>
        <h1>${o(t.title)}</h1>
        <div class="detail-meta">${Q(t.status)} <span>Author: <strong>${o(t.createdByName||"Teammate")}</strong></span><span>Updated: ${L(t.updatedAt)}</span></div>
      </div>
      <div class="heading-actions">
        ${u?`<button class="button button-outline" data-action="show-diff">${r("diff")} Compare Version Diff</button>`:""}
        ${i?`<button class="button button-outline" data-action="run-review" data-id="${o(t._id)}">${r("spark")} ${e?.version===s.n?"Re-run Brand Review":"Run Brand Review"}</button>${e?.version===s.n?`<button class="button button-primary" data-action="submit" data-id="${o(t._id)}">${r("arrow")} Submit for Approval</button>`:""}`:""}
      </div>
    </div>
    ${t.status==="in_review"?`<div class="review-banner">${r("clock")} <span><strong>Under Formal Review.</strong> ${c?"You are an authorized reviewer. Inspect findings and submit your decision below.":"This draft is locked for review. You will be notified once decided."}</span></div>`:""}
    <div class="detail-grid">
      <section class="detail-main">
        <div class="workbench-tabs">
          <button class="workbench-tab ${l.detailWorkbenchTab==="highlights"?"selected":""}" data-workbench-tab="highlights">${r("file")} Interactive Highlights</button>
          ${i?`<button class="workbench-tab ${l.detailWorkbenchTab==="edit"?"selected":""}" data-workbench-tab="edit">${r("plus")} Edit Version Text</button>`:""}
        </div>
        ${l.detailWorkbenchTab==="highlights"?`<div class="section-heading compact"><div><span class="eyebrow">DRAFT PREVIEW</span><h2>In-Text Findings Inspector</h2></div><span class="version-pill">v${s.n}</span></div>${we(s.text,e?.findings)}`:i?`<form id="edit-content-form" class="editor-card detail-editor"><textarea aria-label="Draft content" name="text" maxlength="20000" rows="10">${o(s.text)}</textarea><div class="editor-footer"><span>${s.text.trim().split(/\s+/).filter(Boolean).length} words</span><button class="button button-outline" type="submit">Save As New Version</button></div></form>`:`<div class="draft-preview">${o(s.text)}</div>`}

        <div class="section-heading compact findings-title" style="margin-top: 28px;">
          <div><span class="eyebrow">EXPLAINABLE FINDINGS</span><h2>Review Results <span class="title-count">${e?.findings?.length||0}</span></h2></div>
          ${e?`<div class="score-chip ${G(e.score)}">${e.score}<small>/100</small></div>`:""}
        </div>
        ${e?`<p class="muted review-summary">${e.modelInfo?.aiUsed?`AI-assisted review (${o(e.modelInfo.model||"gpt-4o-mini")})`:"Deterministic rule engine review"}${e.modelInfo?.note?` · ${o(e.modelInfo.note)}`:""}. Suggestions never override human judgment.</p>
               ${e.findings.length?`<div class="findings-list">${e.findings.map(Ie).join("")}</div>`:'<div class="success-card"><span>✓</span><div><strong>100% Brand Compliant.</strong><p>No guideline violations, claim inaccuracies, or accessibility issues detected in this version.</p></div></div>'}`:`<div class="empty-state compact-empty"><span class="empty-illustration">${r("spark")}</span><strong>No review run on this version yet.</strong><p>Trigger a brand review to verify facts, tone, and visual guidelines.</p>${i?`<button class="button button-primary" data-action="run-review" data-id="${o(t._id)}">${r("spark")} Run Review</button>`:""}</div>`}

        ${c?`<section class="decision-card" style="margin-top: 32px;"><span class="eyebrow">HUMAN SIGN-OFF GATE</span><h2>Authorized Review Decision</h2><p class="muted">Leave constructive context for the creator. Approving with unresolved critical findings requires a formal written override.</p>
                 <form id="decision-form">
                   <label>Reviewer Decision Context<textarea name="comment" rows="3" placeholder="Explain your feedback or approval reason…" ${e?.findings?.some(d=>d.severity==="critical"&&d.status==="open")?'required minlength="5"':""}></textarea></label>
                   ${e?.findings?.some(d=>d.severity==="critical"&&d.status==="open")?'<label class="checkbox-row" style="margin-top: 8px;"><input type="checkbox" name="override" required> <strong>Document Override:</strong> I acknowledge critical findings are open and confirm this publication is approved under exception policy.</label>':""}
                   <div class="decision-actions" style="margin-top: 16px;">
                     <button class="button button-primary" type="submit" name="decision" value="approved">Approve Content</button>
                     <button class="button button-outline" type="submit" name="decision" value="changes_requested">Request Changes</button>
                     <button class="button button-danger" type="submit" name="decision" value="rejected">Reject Draft</button>
                   </div>
                 </form>
               </section>`:""}
      </section>
      <aside class="detail-side">
        <div class="side-card">
          <span class="eyebrow">ALIGNMENT SCORE</span>
          <div class="score-large ${e?G(e.score):""}">${e?e.score:"—"}<small>/100</small></div>
          <p>Brand Integrity Index</p>
          <div class="side-stat"><span>Open Findings</span><strong>${e?e.findings.filter(d=>d.status==="open").length:"—"}</strong></div>
          <div class="side-stat"><span>Version Count</span><strong>${t.versions.length} ${t.versions.length===1?"version":"versions"}</strong></div>
        </div>
        <div class="side-card">
          <span class="eyebrow">DECISION HISTORY</span>
          ${a.length?a.map(d=>`<div class="approval-history">${Q(d.decision)}<p>${o(d.comment||"No comment added")}</p><small>${o(d.reviewerName||"Reviewer")} · ${L(d.decidedAt)}${d.override?" · [Override Documented]":""}</small></div>`).join(""):'<p class="muted side-empty">No formal decisions recorded yet.</p>'}
        </div>
        <div class="side-card">
          <span class="eyebrow">AUDIT TRAIL</span>
          ${n.length?`<div class="timeline">${n.slice(0,8).map(d=>`<div class="timeline-item"><span class="timeline-dot"></span><span><strong>${o(f(d.action.replace("content.","").replace("review.","review ")))}</strong><small>${o(d.actorName||"Teammate")} · ${L(d.timestamp)}</small></span></div>`).join("")}</div>`:'<p class="muted side-empty">Audit events will appear here.</p>'}
        </div>
      </aside>
    </div>`}function Te(){const t=l.content.filter(e=>e.status==="in_review");return`
    <div class="page-heading"><div><span class="eyebrow">👥 HUMAN REVIEW PIPELINE</span><h1>Pending Approvals <em>Queue</em></h1><p class="muted">Drafts awaiting review and authorization before publication.</p></div><span class="approval-count">${t.length} waiting</span></div>
    <div class="content-list">${t.length?_(t):'<div class="empty-state"><span class="empty-illustration">✓</span><strong>Queue is clear.</strong><p>No content is waiting for review. Excellent work!</p><button class="button button-outline" data-page="content">Explore All Content</button></div>'}</div>`}function Ce(){const t=l.user.role==="admin";return`
    <div class="page-heading">
      <div><span class="eyebrow">📚 CANONICAL BRAND REPOSITORY</span><h1>Brand Kit &amp; <em>Asset Library</em></h1><p class="muted">Centrally manage brand guidelines, verified facts, visual design tokens, and test copy in real-time.</p></div>
    </div>
    <div class="kit-tabs">
      <button class="kit-tab selected" data-kit-tab="guidelines">Guidelines <span id="guideline-count">—</span></button>
      <button class="kit-tab" data-kit-tab="facts">Approved Facts <span id="fact-count">—</span></button>
      <button class="kit-tab" data-kit-tab="assets">Brand Assets &amp; Palette <span id="asset-count">—</span></button>
      <button class="kit-tab" data-kit-tab="sandbox">Interactive Rule Sandbox ${r("spark")}</button>
    </div>

    <!-- Tab 1: Guidelines -->
    <section id="kit-guidelines" class="kit-section">
      <div class="section-heading"><div><span class="eyebrow">VOICE &amp; TONE STANDARDS</span><h2>Brand Guidelines</h2><p class="muted">Terminology, claims, tone, and accessibility rules with explicit severity.</p></div>${t?`<button class="button button-primary" data-action="show-guideline-form">${r("plus")} Add Guideline</button>`:""}</div>
      <form class="inline-form hidden" id="guideline-form">
        <label>Category<select name="category"><option value="terminology">Terminology</option><option value="claims">Claims &amp; Promises</option><option value="tone">Tone of Voice</option></select></label>
        <label>Pattern (Regex or Words)<input name="pattern" required maxlength="200" placeholder="e.g. \\bcheap\\b or best in the world"></label>
        <label>Approved Alternative<input name="replacement" maxlength="300" placeholder="e.g. affordable"></label>
        <label>Guideline Rationale &amp; Source<input name="rule" required minlength="3" maxlength="500" placeholder="Explain why this rule exists and cite company policy"></label>
        <label>Severity<select name="severity"><option value="low">Low</option><option value="medium" selected>Medium</option><option value="high">High</option><option value="critical">Critical</option></select></label>
        <button class="button button-primary" type="submit">Save Guideline</button>
      </form>
      <div id="guideline-list" class="kit-list"><div class="loading-state">Loading guidelines…</div></div>
    </section>

    <!-- Tab 2: Facts -->
    <section id="kit-facts" class="kit-section hidden">
      <div class="section-heading"><div><span class="eyebrow">CANONICAL TRUTH</span><h2>Approved Facts &amp; Data</h2><p class="muted">Verified facts, product metrics, and pricing claims cited during reviews.</p></div>${t?`<button class="button button-primary" data-action="show-fact-form">${r("plus")} Add Approved Fact</button>`:""}</div>
      <form class="inline-form hidden" id="fact-form">
        <label>Topic<input name="topic" required maxlength="120" placeholder="e.g. Free Trial Duration"></label>
        <label>Approved Statement<input name="statement" required minlength="3" maxlength="500" placeholder="Our product provides a 14-day free trial."></label>
        <label>Source Document<input name="source" maxlength="300" placeholder="Pricing page, approved Oct 2026"></label>
        <label>Keywords <small>(comma-separated)</small><input name="keywords" placeholder="free, trial, days, tier"></label>
        <div class="form-divider">Optional Exact Claim Regex Check</div>
        <label>Pattern to Extract Claim<input name="regex" maxlength="200" placeholder="free for (\\d+) days"></label>
        <label>Expected Value<input name="expected" maxlength="100" placeholder="14"></label>
        <button class="button button-primary" type="submit">Save Approved Fact</button>
      </form>
      <div id="fact-list" class="kit-list"><div class="loading-state">Loading approved facts…</div></div>
    </section>

    <!-- Tab 3: Brand Assets & Visual Palette -->
    <section id="kit-assets" class="kit-section hidden">
      <div class="section-heading"><div><span class="eyebrow">VISUAL IDENTITY &amp; DESIGN SYSTEM</span><h2>Reusable Brand Assets &amp; Palette</h2><p class="muted">Official colors, typography, logos, and photography standards.</p></div>${t?`<button class="button button-primary" data-action="show-asset-form">${r("plus")} Add Brand Asset</button>`:""}</div>
      <form class="inline-form hidden" id="asset-form">
        <label>Asset Name<input name="name" required maxlength="120" placeholder="e.g. Iris Primary Brand Color"></label>
        <label>Asset Type<select name="type"><option value="color">Color Token</option><option value="logo">Official Logo</option><option value="typography">Typography Spec</option><option value="imagery">Imagery Standard</option><option value="badge">Brand Badge</option></select></label>
        <label>Value / Hex / URL / Spec<input name="value" required maxlength="1000" placeholder="#4F46E5 or font family name or asset URL"></label>
        <label>Description &amp; Purpose<input name="description" maxlength="500" placeholder="Primary CTA and link color"></label>
        <label>Usage Rules &amp; Restrictions<textarea name="usageRules" rows="2" placeholder="Maintain 4.5:1 contrast against background; do not stretch"></textarea></label>
        <label>Tags <small>(comma-separated)</small><input name="tags" placeholder="core, primary, dark-mode"></label>
        <button class="button button-primary" type="submit">Save Brand Asset</button>
      </form>
      <div id="asset-list" class="asset-grid"><div class="loading-state">Loading brand assets…</div></div>
    </section>

    <!-- Tab 4: Interactive Rule Sandbox -->
    <section id="kit-sandbox" class="kit-section hidden">
      <div class="sandbox-card">
        <div class="sandbox-header">
          <div><span class="eyebrow">TEST BEFORE PUBLISHING</span><h2>Interactive Brand Rule Sandbox</h2><p class="muted">Type or paste test copy to observe real-time brand rule evaluation and instant score calculations.</p></div>
          <div class="sandbox-score-row"><span class="eyebrow">Real-time Score:</span><div id="sandbox-score-badge" class="score-chip score-good" style="margin-left: 10px;">100<small>/100</small></div></div>
        </div>
        <div class="sandbox-presets">
          <span class="preset-label" style="font-size: 13px; font-weight: 700; color: #475569; align-self: center;">Try sample copy:</span>
          <button type="button" class="preset-pill" data-sandbox-preset="trial">Wrong Trial &amp; Superlative Claim</button>
          <button type="button" class="preset-pill" data-sandbox-preset="a11y">A11y Link &amp; Deprecated Logo</button>
          <button type="button" class="preset-pill" data-sandbox-preset="clean">Clean On-Brand Copy</button>
        </div>
        <textarea id="sandbox-input" class="sandbox-textarea" placeholder="Start typing copy to test against all active brand guidelines and facts..."></textarea>
        <div class="sandbox-live-results">
          <div class="section-heading compact"><div><span class="eyebrow">INSTANT DETECTIONS</span><h3>Real-Time Findings (<span id="sandbox-findings-count">0</span>)</h3></div></div>
          <div id="sandbox-findings-list" class="findings-list">
            <p class="muted" style="font-size: 14px;">No findings triggered. The copy is 100% compliant with active rules.</p>
          </div>
        </div>
      </div>
    </section>

    <p class="kit-footnote" style="margin-top: 24px;">${r("lock")} Only workspace administrators can modify canonical brand kit entries. History is preserved so prior reviews stay explainable.</p>`}function Re(){const t=l.analytics||{},e=t.byCategory||[],a=Math.max(1,...e.map(s=>s.value)),n=t.topSources||[];return`
    <div class="page-heading">
      <div><span class="eyebrow">📊 ORGANIZATIONAL GOVERNANCE</span><h1>Governance Insights &amp; <em>Analytics</em></h1><p class="muted">Identify recurring brand mistakes, turnaround metrics, and guidelines that may need clarification.</p></div>
      <button class="button button-outline" data-action="print-report">${r("printer")} Print Audit Report</button>
    </div>
    <section class="metric-grid metric-grid-three">
      <article class="metric-card"><span class="metric-icon metric-lavender">${r("file")}</span><span class="metric-label">Total Drafts</span><strong>${t.totalContent||0}<small> pieces</small></strong></article>
      <article class="metric-card"><span class="metric-icon metric-mint">${r("spark")}</span><span class="metric-label">Workspace Health</span><strong>${t.avgScore??"—"}<small>/100</small></strong></article>
      <article class="metric-card"><span class="metric-icon metric-peach">${r("clock")}</span><span class="metric-label">Average Approval Time</span><strong>${t.avgHoursToApproval??"—"}<small> hours</small></strong></article>
    </section>
    <div class="insight-grid">
      <section class="insight-card">
        <div class="section-heading compact"><div><span class="eyebrow">FINDINGS DISTRIBUTION</span><h2>Violations by Category</h2></div></div>
        ${e.length?`<div class="bar-list">${e.map(s=>`<div class="bar-row"><span>${o(f(s.name))}</span><div class="bar-track"><i style="width:${Math.max(4,s.value/a*100)}%"></i></div><strong>${s.value}</strong></div>`).join("")}</div>`:'<div class="chart-empty">Category distribution will appear after your first review.</div>'}
      </section>
      <section class="insight-card">
        <div class="section-heading compact"><div><span class="eyebrow">FREQUENTLY CITED RULES</span><h2>Most-Triggered Guidance</h2></div></div>
        ${n.length?`<div class="source-list">${n.map(s=>`<div><span class="source-dot">↗</span><span class="source-text"><strong>${o(s.label)}</strong><small>${s.count} findings · ${s.accepted} suggestions accepted · ${s.rejected} rejected</small></span></div>`).join("")}</div>`:'<div class="chart-empty">Source citations will appear after reviews are run.</div>'}
      </section>
    </div>
    <section class="clarity-card" style="margin-top: 24px;">
      <span class="clarity-icon">${r("spark")}</span>
      <div>
        <span class="eyebrow">GUIDELINES UNDER REVIEW</span>
        <h2>Guidelines With High Rejection Rates</h2>
        <p>When creators repeatedly reject suggestions for a specific rule, the guideline may be ambiguous or overly rigid. Consider reviewing these policies with your creative team.</p>
        ${t.needsClarification?.length?`<div class="clarity-items">${t.needsClarification.map(s=>`<span><strong>${s.rejectionRate}%</strong> rejected · ${o(s.label)}</span>`).join("")}</div>`:'<span class="clarity-empty">No guideline ambiguity detected yet. Great clarity in your brand kit!</span>'}
      </div>
    </section>`}function Le(){const t=l.user.role==="admin";return`
    <div class="page-heading">
      <div><span class="eyebrow">🤝 COLLABORATIVE GOVERNANCE</span><h1>Team Roles &amp; <em>Permissions</em></h1><p class="muted">Role-based access control ensuring authors can draft and designated reviewers can approve.</p></div>
      ${t?`<button class="button button-primary" data-action="show-team-form">${r("plus")} Invite Teammate</button>`:""}
    </div>
    ${t?`
      <form id="team-form" class="inline-form hidden">
        <label>Name<input name="name" required maxlength="100" placeholder="Jordan Lee"></label>
        <label>Work email<input name="email" type="email" required placeholder="jordan@company.com"></label>
        <label>Temporary Password<input name="password" type="password" minlength="8" maxlength="100" required placeholder="At least 8 characters"></label>
        <label>Role<select name="role"><option value="creator">Creator (Drafts &amp; Revises)</option><option value="reviewer">Reviewer (Approves &amp; Requests Changes)</option><option value="admin">Admin (Brand Kit &amp; Team Manager)</option></select></label>
        <button class="button button-primary" type="submit">Add Teammate</button>
      </form>`:""}
    <div id="team-list" class="team-grid"><div class="loading-state">Loading team members…</div></div>
    <div class="roles-note" style="margin-top: 24px;">
      <span class="soft-card-icon">${r("users")}</span>
      <div>
        <strong>Three Distinct Governance Roles</strong>
        <p><b>Creators</b> write copy, attach media, and consider suggested corrections · <b>Reviewers</b> inspect word-level diffs and make human approval decisions · <b>Admins</b> manage canonical brand kit rules, assets, and workspace policies.</p>
      </div>
    </div>`}function j(){l.page=l.page||"overview",l.page==="detail"&&!l.detail&&(l.page="content"),xe(({overview:re,content:Se,"new-content":Ae,detail:Ee,approvals:Te,guidelines:Ce,analytics:Re,team:Le}[l.page]||re)()),Me()}async function S(){if(!l.token){V();return}if(!l.user){const n=await v("/auth/me");if(!n?.user?.id)throw new Error("Inkloom could not verify your workspace session. Please sign in again.");l.user=n.user}const[t,e]=await Promise.allSettled([v("/content"),v("/analytics/overview")]);if(!l.token||!l.user)throw new Error("Inkloom could not verify your workspace session. Please sign in again.");const a=[];t.status==="fulfilled"&&Array.isArray(t.value)?l.content=t.value:(l.content=[],a.push("content")),e.status==="fulfilled"&&e.value?l.analytics=e.value:(l.analytics=null,a.push("analytics")),j(),a.length&&m("Your workspace opened, but some dashboard data could not load. Refresh to try again.","info")}async function I(t){try{l.detail=await v(`/content/${encodeURIComponent(t)}`),l.page="detail",l.detailWorkbenchTab="highlights",j()}catch(e){m(e.message,"error")}}function le(t,e){const a=document.querySelector(`#${e}-list`),n=l.user.role==="admin";if(a){if(!t.length){a.innerHTML=`<div class="empty-kit"><span>${r(e==="guideline"?"book":"check")}</span><strong>No ${e==="guideline"?"guidelines":"approved facts"} recorded yet.</strong><p>${n?"Add your first approved entry to guide reviewers.":"An administrator can add entries here."}</p></div>`;return}a.innerHTML=t.map(s=>`
    <article class="kit-item">
      <div class="kit-item-icon">${r(e==="guideline"?"book":"check")}</div>
      <div class="kit-item-copy">
        <div class="kit-item-title">
          <strong>${o(e==="guideline"?s.rule:s.topic)}</strong>
          ${e==="guideline"?`<span class="category-tag">${o(f(s.category))}</span>`:""}
          <span class="version-pill">v${s.version}</span>
          ${s.active===!1||s.status==="retired"?'<span class="retired-tag">Retired</span>':""}
        </div>
        <p>${o(e==="guideline"?`Match: ${s.pattern}${s.replacement?` · Suggest: ${s.replacement}`:""}`:s.statement)}</p>
        <small>${o(s.source||`${f(s.severity||"approved")} · Added ${L(s.createdAt)}`)}</small>
      </div>
      ${n&&s.active!==!1&&s.status!=="retired"?`<button class="button button-quiet" data-retire="${o(s._id)}" data-kind="${e}" aria-label="Deactivate ${o(e)}">Deactivate</button>`:""}
    </article>`).join("")}}function Ne(t){const e=document.querySelector("#asset-list");if(e){if(!t.length){e.innerHTML=`<div class="empty-kit" style="grid-column: 1/-1;"><span>${r("palette")}</span><strong>No brand assets yet.</strong><p>Admins can add color tokens, official logos, and typography rules.</p></div>`;return}e.innerHTML=t.filter(a=>a.active!==!1).map(a=>`
      <article class="asset-card">
        <div class="asset-card-top">
          ${a.type==="color"?`<div class="color-swatch-box" style="background-color: ${o(a.value)};"></div>`:`<div class="color-swatch-box" style="display:grid;place-items:center;background:#f1f5f9;color:#4f46e5;">${r(a.type==="logo"?"image":"palette")}</div>`}
          <div class="asset-details">
            <h4>${o(a.name)}</h4>
            <p>${o(a.description||f(a.type))}</p>
          </div>
        </div>
        <div class="asset-value-row">
          <span>${o(a.value)}</span>
          <button class="copy-badge" data-copy-val="${o(a.value)}">Copy</button>
        </div>
        ${a.usageRules?`<div class="asset-rules-box"><strong>Usage Rule:</strong> ${o(a.usageRules)}</div>`:""}
        <div class="asset-tags">
          <span class="asset-tag">${o(a.type)}</span>
          ${(a.tags||[]).map(s=>`<span class="asset-tag">${o(s)}</span>`).join("")}
        </div>
      </article>`).join("")}}async function M(){const[t,e,a]=await Promise.all([v("/brand/guidelines"),v("/brand/facts"),v("/brand/assets").catch(()=>[])]);l.brandKit={guidelines:t,facts:e,assets:a},document.querySelector("#guideline-count").textContent=t.filter(n=>n.active).length,document.querySelector("#fact-count").textContent=e.filter(n=>n.status==="active").length,document.querySelector("#asset-count").textContent=a.filter(n=>n.active!==!1).length,le(t,"guideline"),le(e,"fact"),Ne(a)}async function ce(){const t=await v("/team"),e=document.querySelector("#team-list");e&&(e.innerHTML=t.map(a=>`
    <article class="team-card">
      <span class="team-avatar">${o(F(a.name))}</span>
      <div>
        <strong>${o(a.name)}</strong>
        <p>${o(a.email)}</p>
        <span class="role-tag role-${o(a.role)}">${o(f(a.role))}</span>
      </div>
    </article>`).join(""))}function Oe(){const t=l.detail?.content;if(!t||t.versions.length<2)return m("Multiple versions are required to compare diffs.","info");const e=document.querySelector("#app-modal"),a=t.versions.at(-2),n=t.versions.at(-1),i=ye(a.text,n.text).map(p=>p.type==="added"?`<span class="diff-token-added">${o(p.value)}</span>`:p.type==="removed"?`<span class="diff-token-removed">${o(p.value)}</span>`:`<span class="diff-token-same">${o(p.value)}</span>`).join("");e.innerHTML=`
    <div class="modal-header">
      <h3>Version Diff: v${a.n} → v${n.n}</h3>
      <button class="modal-close" data-modal-close aria-label="Close dialog">✕</button>
    </div>
    <div class="modal-body">
      <div class="diff-legend">
        <span><b class="diff-token-added">+ Added words</b></span>
        <span><b class="diff-token-removed">- Removed words</b></span>
        <span><b>Unchanged copy</b></span>
      </div>
      <div class="diff-container">${i}</div>
    </div>
    <div class="modal-footer">
      <button class="button button-outline" data-modal-close>Close</button>
    </div>`,e.showModal()}function Me(){l.page==="guidelines"&&M().catch(e=>m(e.message,"error")),l.page==="team"&&ce().catch(e=>m(e.message,"error")),document.querySelector("#draft-file")?.addEventListener("change",async e=>{const a=e.target.files?.[0];if(!a)return;document.querySelector("#draft-text").value=await a.text(),document.querySelector('[name="title"]').value||(document.querySelector('[name="title"]').value=a.name.replace(/\.[^.]+$/,""));const n=document.querySelector("#draft-text").value.trim().split(/\s+/).filter(Boolean).length;document.querySelector("#word-count").textContent=`${n} words`}),document.querySelector("#media-file-input")?.addEventListener("change",e=>{const a=e.target.files?.[0];a&&$e(a,n=>{l.attachedMedia=n;const s=document.querySelector("#media-preview-container");s&&(s.classList.remove("hidden"),s.innerHTML=`
          <div class="media-preview-row">
            <div class="media-preview-box"><img src="${n.dataUrl}" alt="${o(n.name)}"></div>
            <div class="media-checks-list">
              <div class="media-check-item">
                <span class="media-check-status ${n.isRatioStandard?"status-ok":"status-warn"}">${n.isRatioStandard?"✓":"!"}</span>
                <span>Aspect Ratio: <strong>${n.ratio} (${n.standardRatio})</strong></span>
              </div>
              <div class="media-check-item">
                <span class="media-check-status ${n.isSizeOptimized?"status-ok":"status-warn"}">${n.isSizeOptimized?"✓":"!"}</span>
                <span>Dimensions: <strong>${n.width}×${n.height}px (${n.fileSizeMB} MB)</strong></span>
              </div>
              <div class="media-check-item">
                <span class="media-check-status status-ok">✓</span>
                <span>Extracted Colors: 
                  ${n.colors.map(i=>`<span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:${i};margin:0 2px;vertical-align:middle;border:1px solid #0002;"></span>`).join("")}
                </span>
              </div>
            </div>
          </div>`)})}),document.querySelector("#draft-text")?.addEventListener("input",e=>{const a=e.target.value.trim().split(/\s+/).filter(Boolean).length;document.querySelector("#word-count").textContent=`${a} words`});const t=document.querySelector("#sandbox-input");if(t){const e=()=>{const a=t.value,{score:n,findings:s}=ke(a,l.brandKit.guidelines,l.brandKit.facts),i=document.querySelector("#sandbox-score-badge");i&&(i.textContent=`${n}/100`,i.className=`score-chip ${G(n)}`),document.querySelector("#sandbox-findings-count").textContent=s.length;const p=document.querySelector("#sandbox-findings-list");p&&(s.length?p.innerHTML=s.map((c,u)=>`
            <article class="finding-card finding-${o(c.severity)}" style="margin-bottom: 10px;">
              <div class="finding-head"><span class="finding-number">${String(u+1).padStart(2,"0")}</span><span class="finding-category">${o(f(c.category))}</span><span class="severity severity-${o(c.severity)}">${o(f(c.severity))}</span></div>
              <blockquote>“${o(c.excerpt)}”</blockquote>
              <p class="finding-explanation">${o(c.explanation)}</p>
              <div class="finding-source"><span class="source-dot">↗</span><span><strong>${o(c.sourceLabel)}</strong></span></div>
              ${c.suggestion?`<div class="suggestion"><span class="suggestion-label">${r("spark")} Suggested Fix</span><p>${o(c.suggestion)}</p></div>`:""}
            </article>`).join(""):p.innerHTML='<p class="muted" style="font-size: 13px;">No issues flagged. Copy complies with all active brand standards.</p>')};t.addEventListener("input",e)}document.querySelector("#new-content-form")?.addEventListener("submit",async e=>{e.preventDefault();const a=e.currentTarget.querySelector('[type="submit"]');a.disabled=!0;try{const n=Object.fromEntries(new FormData(e.currentTarget)),s=await v("/content",{method:"POST",body:n});await v("/reviews",{method:"POST",body:{contentId:s._id}}),m("Draft created & brand review completed."),await S(),await I(s._id)}catch(n){m(n.message,"error"),a.disabled=!1}}),document.querySelector("#edit-content-form")?.addEventListener("submit",async e=>{e.preventDefault();try{await v(`/content/${l.detail.content._id}`,{method:"PUT",body:{text:new FormData(e.currentTarget).get("text"),note:"Edited in Inkloom workbench"}}),m("New version saved. Running fresh review…"),await v("/reviews",{method:"POST",body:{contentId:l.detail.content._id}}),await I(l.detail.content._id),await S()}catch(a){m(a.message,"error")}}),document.querySelector("#decision-form")?.addEventListener("submit",async e=>{e.preventDefault();const a=e.submitter;if(a)try{const n=new FormData(e.currentTarget),s={approved:"approve",changes_requested:"request-changes",rejected:"reject"}[a.value];await v(`/content/${l.detail.content._id}/${s}`,{method:"POST",body:{comment:n.get("comment"),override:n.get("override")==="on"}}),m(`Decision recorded: ${f(a.value)}.`),await S(),await I(l.detail.content._id)}catch(n){m(n.message,"error")}}),document.querySelector("#guideline-form")?.addEventListener("submit",async e=>{e.preventDefault();const a=Object.fromEntries(new FormData(e.currentTarget));a.replacement||delete a.replacement;try{await v("/brand/guidelines",{method:"POST",body:a}),m("Guideline added to brand kit."),await M(),e.currentTarget.reset(),e.currentTarget.classList.add("hidden")}catch(n){m(n.message,"error")}}),document.querySelector("#fact-form")?.addEventListener("submit",async e=>{e.preventDefault();const a=Object.fromEntries(new FormData(e.currentTarget));a.keywords=(a.keywords||"").split(",").map(n=>n.trim()).filter(Boolean),a.source===""&&delete a.source,a.regex&&a.expected&&(a.match={regex:a.regex,expected:a.expected}),delete a.regex,delete a.expected;try{await v("/brand/facts",{method:"POST",body:a}),m("Approved fact added to brand kit."),await M(),e.currentTarget.reset(),e.currentTarget.classList.add("hidden")}catch(n){m(n.message,"error")}}),document.querySelector("#asset-form")?.addEventListener("submit",async e=>{e.preventDefault();const a=Object.fromEntries(new FormData(e.currentTarget));a.tags=(a.tags||"").split(",").map(n=>n.trim()).filter(Boolean);try{await v("/brand/assets",{method:"POST",body:a}),m("Brand asset added to library."),await M(),e.currentTarget.reset(),e.currentTarget.classList.add("hidden")}catch(n){m(n.message,"error")}}),document.querySelector("#team-form")?.addEventListener("submit",async e=>{e.preventDefault();try{await v("/team",{method:"POST",body:Object.fromEntries(new FormData(e.currentTarget))}),m("Teammate added successfully."),await ce(),e.currentTarget.reset(),e.currentTarget.classList.add("hidden")}catch(a){m(a.message,"error")}})}document.addEventListener("click",t=>{const e=document.querySelector("#app-modal");e&&t.target===e&&e.close()});document.addEventListener("submit",async t=>{if(t.target.matches("#newsletter-form")){t.preventDefault();const e=t.target,a=e.querySelector('[type="submit"]');a.disabled=!0;const n=a.dataset.mode||"subscribe";a.textContent=n==="unsubscribe"?"Removing…":"Subscribing…";try{await v(`/newsletter/${n}`,{method:"POST",body:{email:new FormData(e).get("email")}}),e.reset(),m(n==="unsubscribe"?"Your email has been removed.":"Subscribed! Newsletter interest recorded."),a.textContent=n==="unsubscribe"?"Unsubscribed":"Subscribed"}catch(s){m(s.message,"error"),a.disabled=!1,a.textContent=n==="unsubscribe"?"Unsubscribe":"Stay in the loop"}}});document.addEventListener("click",async t=>{const e=t.target.closest("button, a, mark");if(e){if(e.matches("[data-modal-close]")){document.querySelector("#app-modal")?.close();return}if(e.matches("[data-logout]"))return de();if(e.matches("[data-landing-register]"))return O(!0);if(e.matches("[data-landing-login]"))return O(!1);if(e.matches("[data-auth-home]"))return V();if(e.matches("[data-switch-role]"))return fe(e.dataset.switchRole);if(e.matches("[data-action=print-report]")){window.print();return}if(e.matches("[data-action=show-diff]"))return Oe();if(e.matches("[data-copy-val]")){navigator.clipboard?.writeText(e.dataset.copyVal),m(`Copied ${e.dataset.copyVal} to clipboard!`);return}if(e.matches("[data-highlight-fid]")){const a=e.dataset.highlightFid,n=document.querySelector(`[data-finding-fid="${a}"]`);n&&(n.scrollIntoView({behavior:"smooth",block:"center"}),n.style.outline="2px solid #4f46e5",setTimeout(()=>n.style.outline="",1500));return}if(e.matches("[data-sandbox-preset]")){const a={trial:"Enjoy our brand new platform free for 60 days! It is simply the best platform in the world, and we guarantee 100% success for all users.",a11y:'Check out our pricing page: [click here](https://example.com/pricing). We have cheap plans. <img src="logo-old.png">',clean:"Our product provides a 14-day free trial. Read [the launch documentation](https://example.com/guide) to learn about our affordable team tiers."},n=document.querySelector("#sandbox-input");n&&(n.value=a[e.dataset.sandboxPreset]||"",n.dispatchEvent(new Event("input")));return}if(e.matches("[data-workbench-tab]")){l.detailWorkbenchTab=e.dataset.workbenchTab,j();return}if(e.matches("[data-newsletter-mode]")){const a=document.querySelector("#newsletter-form");if(!a)return;const n=a.querySelector('[type="submit"]'),s=e.dataset.newsletterMode==="unsubscribe";n.dataset.mode=s?"unsubscribe":"subscribe",n.textContent=s?"Unsubscribe":"Stay in the loop",n.disabled=!1,e.dataset.newsletterMode=s?"subscribe":"unsubscribe",e.textContent=s?"Never mind — stay subscribed":"Already subscribed? Unsubscribe",document.querySelector("#newsletter-email").placeholder=s?"Email address to remove":"you@company.com",document.querySelector("#newsletter-heading").textContent=s?"Update your email preferences.":"A little more clarity, in your inbox.";return}if(e.matches("[data-auth-toggle]"))return O(!document.querySelector("#auth-form [name=organisationName]"));if(e.matches("[data-demo]")){const a={admin:"admin@demo.test",creator:"creator@demo.test",reviewer:"reviewer@demo.test"}[e.dataset.demo];document.querySelector("#auth-form [name=organisationName]")&&O(!1);const n=document.querySelector("#auth-form [name=email]"),s=document.querySelector("#auth-form [name=password]");n&&s&&(n.value=a,s.value="Passw0rd!demo",document.querySelector("#auth-form")?.requestSubmit());return}if(e.matches("[data-page]")){if(t.preventDefault(),l.page=e.dataset.page,l.detail=null,["overview","content","approvals","analytics"].includes(l.page))try{await S()}catch(a){m(a.message,"error")}else j();return}if(e.matches("[data-open]"))return I(e.dataset.open);if(e.matches("[data-filter]")){document.querySelectorAll(".filter-tab").forEach(s=>s.classList.toggle("selected",s===e));const a=e.dataset.filter,n=a==="all"?l.content:l.content.filter(s=>s.status===a);document.querySelector(".content-list").innerHTML=_(n);return}if(e.matches("[data-kit-tab]")){document.querySelectorAll(".kit-tab").forEach(n=>n.classList.toggle("selected",n===e));const a=e.dataset.kitTab;document.querySelector("#kit-guidelines")?.classList.toggle("hidden",a!=="guidelines"),document.querySelector("#kit-facts")?.classList.toggle("hidden",a!=="facts"),document.querySelector("#kit-assets")?.classList.toggle("hidden",a!=="assets"),document.querySelector("#kit-sandbox")?.classList.toggle("hidden",a!=="sandbox"),a==="sandbox"&&document.querySelector("#sandbox-input")?.dispatchEvent(new Event("input"));return}if(e.matches("[data-action=show-guideline-form]"))return document.querySelector("#guideline-form").classList.toggle("hidden");if(e.matches("[data-action=show-fact-form]"))return document.querySelector("#fact-form").classList.toggle("hidden");if(e.matches("[data-action=show-asset-form]"))return document.querySelector("#asset-form").classList.toggle("hidden");if(e.matches("[data-action=show-team-form]"))return document.querySelector("#team-form").classList.toggle("hidden");if(e.matches("[data-retire]")){if(!window.confirm("Deactivate this source? It will remain in history for existing reviews."))return;const a=e.dataset.kind==="guideline"?"guidelines":"facts";try{await v(`/brand/${a}/${e.dataset.retire}`,{method:"DELETE"}),m("Source deactivated. Previous review history is preserved."),await M()}catch(n){m(n.message,"error")}return}if(e.matches("[data-action=run-review]")){e.disabled=!0,e.innerHTML='<span class="spinner"></span> Reviewing…';try{await v("/reviews",{method:"POST",body:{contentId:e.dataset.id}}),m("Brand review complete. Inspect findings."),await I(e.dataset.id),await S()}catch(a){m(a.message,"error"),e.disabled=!1,e.innerHTML=`${r("spark")} Run brand review`}return}if(e.matches("[data-action=submit]")){try{await v(`/content/${e.dataset.id}/submit`,{method:"POST",body:{}}),m("Submitted for human reviewer sign-off."),await S(),await I(e.dataset.id)}catch(a){m(a.message,"error")}return}if(e.matches("[data-suggestion]"))try{await v(`/reviews/${l.detail.review._id}/suggestions/${e.dataset.suggestion}`,{method:"POST",body:{action:e.dataset.action}}),m(e.dataset.action==="accept"?"Suggestion applied as a new version. Fresh review ready.":"Suggestion dismissed. Your wording remains."),await I(l.detail.content._id),await S()}catch(a){m(a.message,"error")}}});async function De(){if(!l.token)return V();try{await S()}catch(t){if(!l.token)return;O(),m(t.message,"error")}}De();
