import{n as e}from"./rolldown-runtime-WkwZ5CU-.js";import{n as t,r as n,t as r}from"./vendor-react-C7zjNxyP.js";import{a as i,i as a,n as o,r as s,t as c}from"./vendor-ogl-ngAs0F_3.js";import{a as l,c as u,i as d,l as f,n as p,o as m,r as h,s as g,t as _}from"./vendor-vgpu-BbI4Rm7W.js";import{_ as v,a as y,c as b,d as x,f as S,g as C,h as w,i as T,l as E,m as D,n as O,o as k,p as A,r as j,s as M,t as N,u as P,v as F}from"./vendor-three-BNtO2pAc.js";(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var I=e(n(),1),L=t(),R=r(),ee={bulge:0,pinch:1,swirl:2},z=1600,te=1.6,B=4,V=`#version 300 es
in vec2 position;
in vec2 uv;
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`,H=`#version 300 es
precision highp float;

uniform sampler2D uTextTexture;
uniform vec2 uResolution;
uniform vec2 uPointer;
uniform float uPointerActive;
uniform float uTime;
uniform float uWarpStrength;
uniform float uWarpScale;
uniform float uSpeed;
uniform float uPointerInfluence;
uniform float uPointerStrength;
uniform float uRefraction;
uniform float uChromatic;
uniform float uRipple;
uniform float uMotion;
uniform float uLens;
uniform float uIntro;
uniform float uReveal;
uniform float uBackdrop;
uniform vec4 uClicks[4];

in vec2 vUv;
out vec4 fragColor;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);

  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));

  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 4; i++) {
    value += amplitude * noise(p);
    p *= 2.02;
    amplitude *= 0.5;
  }
  return value;
}

vec4 sampleText(vec2 uv) {
  if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
    return vec4(0.0);
  }
  return texture(uTextTexture, uv);
}

void main() {
  vec2 uv = vUv;
  float aspect = uResolution.x / max(uResolution.y, 1.0);
  float time = uTime * uSpeed;
  float scale = max(uWarpScale, 0.001);

  vec2 drift = vec2(time * 0.055, -time * 0.045);
  float n1 = fbm(uv * scale * 3.1 + drift);
  float n2 = fbm((uv + 19.17) * scale * 3.4 - drift.yx);
  vec2 ambient = (vec2(n1, n2) - 0.5) * (uWarpStrength * 0.045 * uMotion + uIntro * 0.18);

  vec2 pointerDelta = uv - uPointer;
  vec2 aspectDelta = vec2(pointerDelta.x * aspect, pointerDelta.y);
  float dist = length(aspectDelta);
  float radius = max(uPointerInfluence, 0.001);
  float t = clamp(dist / radius, 0.0, 1.0);
  float lens = smoothstep(radius, 0.0, dist) * uPointerActive;
  float bulge = t * (1.0 - t) * (1.0 - t) * 6.75 * uPointerActive;
  vec2 dir = dist > 0.0001 ? vec2(aspectDelta.x / aspect, aspectDelta.y) / dist : vec2(0.0);

  float rippleWave = sin(dist * 28.0 - time * 4.2) * 0.5 + 0.5;
  float rippleRing = (rippleWave - 0.5) * uRipple;
  vec2 pointerWarp = dir * rippleRing * bulge * uPointerStrength * 0.016;

  if (uLens > 1.5) {
    float twist = (1.0 - t) * (1.0 - t) * uPointerActive * uPointerStrength * 2.4;
    float s = sin(twist);
    float c = cos(twist);
    vec2 turned = vec2(aspectDelta.x * c - aspectDelta.y * s, aspectDelta.x * s + aspectDelta.y * c);
    pointerWarp += vec2(turned.x / aspect, turned.y) - pointerDelta;
  } else {
    float side = uLens > 0.5 ? -1.0 : 1.0;
    pointerWarp -= dir * side * bulge * uPointerStrength * 0.045;
  }

  vec2 shock = vec2(0.0);
  float shockLight = 0.0;
  for (int i = 0; i < 4; i++) {
    vec4 click = uClicks[i];
    if (click.w <= 0.0) continue;
    vec2 clickDelta = uv - click.xy;
    vec2 clickAspect = vec2(clickDelta.x * aspect, clickDelta.y);
    float clickDist = length(clickAspect);
    float age = click.z;
    float offset = (clickDist - age * 0.9) / (0.06 + age * 0.06);
    float fade = 1.0 - smoothstep(0.0, 1.6, age);
    float energy = exp(-offset * offset) * fade * smoothstep(0.0, 0.08, age) * click.w;
    vec2 clickDir = clickDist > 0.0001 ? vec2(clickAspect.x / aspect, clickAspect.y) / clickDist : vec2(0.0);
    shock -= clickDir * offset * energy * 0.09;
    shockLight += energy;
  }

  vec2 bend = pointerWarp + shock;
  vec2 rest = uv + ambient;
  vec2 splitDir = ambient + bend;
  float splitLen = length(splitDir);
  splitDir = splitLen > 0.00001 ? splitDir / splitLen : vec2(0.7071, 0.7071);
  vec2 split = splitDir * uRefraction * 0.16 * (0.35 + lens * 1.65 + uIntro * 3.0);
  float dispersion = uChromatic * 0.5;

  vec3 ink = vec3(0.0);
  vec3 cover = vec3(0.0);
  vec3 weight = vec3(0.0);
  for (int i = 0; i < 7; i++) {
    float k = 1.0 - float(i) / 3.0;
    vec4 tap = sampleText(rest + bend * (1.0 + dispersion * k) + split * k);
    vec3 band = vec3(max(k, 0.0), 1.0 - abs(k), max(-k, 0.0));
    ink += tap.rgb * band;
    cover += tap.a * band;
    weight += band;
  }
  ink /= weight;
  cover /= weight;
  float a = max(max(cover.r, cover.g), cover.b);
  vec3 color = ink + (a - cover) * uBackdrop;
  color = min(color + (lens + shockLight * 0.5) * cover.g * 0.055, vec3(a));
  fragColor = vec4(color, a) * uReveal;
}
`,ne=e=>typeof e==`number`?`${e}px`:e,re=e=>e*e*(3-2*e),ie=e=>{let t=document.createElement(`canvas`);t.width=1,t.height=1;let n=t.getContext(`2d`,{willReadFrequently:!0});if(!n)return 1;n.fillStyle=e,n.fillRect(0,0,1,1);let[r,i,a]=n.getImageData(0,0,1,1).data;return(.2126*r+.7152*i+.0722*a)/255},U=(e,t,n)=>{let r=Array.from(t);return r.reduce((t,n)=>t+e.measureText(n).width,0)+Math.max(0,r.length-1)*n},ae=(e,t,n,r,i)=>{let a=Array.from(t),o=n-U(e,t,i)/2;a.forEach((t,n)=>{e.fillText(t,o,r),o+=e.measureText(t).width+(n===a.length-1?0:i)})},oe=({container:e,width:t,height:n,dpr:r,props:i})=>{let a=document.createElement(`canvas`);a.width=Math.max(1,Math.floor(t*r)),a.height=Math.max(1,Math.floor(n*r));let o=a.getContext(`2d`);if(!o)return{canvas:a,ink:i.color};let s=document.createElement(`span`);s.textContent=i.text,Object.assign(s.style,{position:`absolute`,visibility:`hidden`,pointerEvents:`none`,whiteSpace:`pre`,inset:`0 auto auto 0`,color:i.color,fontFamily:i.fontFamily,fontSize:ne(i.fontSize),fontWeight:String(i.fontWeight),letterSpacing:ne(i.letterSpacing),lineHeight:typeof i.lineHeight==`number`?String(i.lineHeight):i.lineHeight}),e.appendChild(s);let c=window.getComputedStyle(s),l=parseFloat(c.fontSize)||96,u=c.color||i.color,d=c.fontFamily||`sans-serif`,f=c.fontWeight||String(i.fontWeight),p=c.letterSpacing===`normal`?0:parseFloat(c.letterSpacing)||0,m=parseFloat(c.lineHeight);Number.isFinite(m)||(m=l*(typeof i.lineHeight==`number`?i.lineHeight:.92)),s.remove(),o.setTransform(r,0,0,r,0,0),o.clearRect(0,0,t,n),o.textAlign=`left`,o.textBaseline=`middle`,o.fillStyle=u,o.imageSmoothingEnabled=!0,o.imageSmoothingQuality=`high`;let h=String(i.text||``).split(`
`),g=()=>{o.font=`${f} ${l}px ${d}`};g();let _=t*.86,v=n*.78,y=Math.max(...h.map(e=>U(o,e,p)),1),b=Math.max(m*h.length,1),x=Math.min(1,_/y,v/b);x<1&&(l*=x,p*=x,m*=x,g());let S=n/2-m*(h.length-1)/2;return h.forEach((e,n)=>ae(o,e,t/2,S+n*m,p)),{canvas:a,ink:u}},W=(e,t)=>{let n=e.uniforms;n.uWarpStrength.value=t.warpStrength,n.uWarpScale.value=t.warpScale,n.uSpeed.value=t.speed,n.uPointerInfluence.value=t.pointerInfluence,n.uPointerStrength.value=t.pointerStrength,n.uRefraction.value=t.refraction,n.uChromatic.value=t.chromatic,n.uRipple.value=+!!t.ripple,n.uLens.value=ee[t.lens]??0},se=({text:e=`Bend the moment`,color:t=`currentColor`,warpStrength:n=.08,warpScale:r=1.7,speed:l=.55,pointerInfluence:u=.42,pointerStrength:d=.38,refraction:f=.018,chromatic:p=0,ripple:m=!0,clickRipple:h=!0,idleDrift:g=.2,lens:_=`bulge`,intro:v=!0,fontSize:y=`clamp(3rem, 10vw, 9rem)`,fontWeight:b=800,fontFamily:x=`inherit`,letterSpacing:S=`-0.06em`,lineHeight:C=.9,className:w=``,style:T})=>{let E=(0,I.useRef)(null),D=(0,I.useRef)({text:e,color:t,fontSize:y,fontWeight:b,fontFamily:x,letterSpacing:S,lineHeight:C,warpStrength:n,warpScale:r,speed:l,pointerInfluence:u,pointerStrength:d,refraction:f,chromatic:p,ripple:m,clickRipple:h,idleDrift:g,lens:_,intro:v}),O=(0,I.useRef)(null),[k,A]=(0,I.useState)(!1);return(0,I.useEffect)(()=>{D.current={text:e,color:t,fontSize:y,fontWeight:b,fontFamily:x,letterSpacing:S,lineHeight:C,warpStrength:n,warpScale:r,speed:l,pointerInfluence:u,pointerStrength:d,refraction:f,chromatic:p,ripple:m,clickRipple:h,idleDrift:g,lens:_,intro:v},O.current&&W(O.current.program,D.current)},[e,t,y,b,x,S,C,n,r,l,u,d,f,p,m,h,g,_,v]),(0,I.useEffect)(()=>{O.current?.rasterize()},[e,t,y,b,x,S,C]),(0,I.useEffect)(()=>{let e=E.current;if(!e||typeof window>`u`)return;let t,n,r,l,u,d,f,p,m=0,h=!1,g=!1,_=!0,v=!document.hidden,y=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches??!1,b=0,x=!1,S=D.current.intro&&!y?0:1,C=0,w=0,T=``,k={x:.5,y:.5,tx:.5,ty:.5,active:0,activeTarget:0},j=Array.from({length:B},()=>[.5,.5,0,0]),M=0,N=performance.now();try{t=new a({webgl:2,alpha:!0,premultipliedAlpha:!0,antialias:!0,dpr:Math.min(window.devicePixelRatio||1,2)}),n=t.gl}catch(e){console.warn(`WarpText: WebGL could not be initialized.`,e),A(!0);return}n.clearColor(0,0,0,0);let P=n.canvas;P.style.position=`absolute`,P.style.inset=`0`,P.style.width=`100%`,P.style.height=`100%`,P.style.display=`block`,P.setAttribute(`aria-hidden`,`true`),e.appendChild(P),d=new o(n,{generateMipmaps:!1,premultiplyAlpha:!0,minFilter:n.LINEAR,magFilter:n.LINEAR,wrapS:n.CLAMP_TO_EDGE,wrapT:n.CLAMP_TO_EDGE}),l=new c(n),r=new i(n,{vertex:V,fragment:H,transparent:!0,depthTest:!1,depthWrite:!1,uniforms:{uTextTexture:{value:d},uResolution:{value:new Float32Array([1,1])},uPointer:{value:new Float32Array([.5,.5])},uPointerActive:{value:0},uTime:{value:0},uWarpStrength:{value:D.current.warpStrength},uWarpScale:{value:D.current.warpScale},uSpeed:{value:D.current.speed},uPointerInfluence:{value:D.current.pointerInfluence},uPointerStrength:{value:D.current.pointerStrength},uRefraction:{value:D.current.refraction},uChromatic:{value:D.current.chromatic},uRipple:{value:+!!D.current.ripple},uMotion:{value:+!y},uLens:{value:ee[D.current.lens]??0},uIntro:{value:0},uReveal:{value:0},uBackdrop:{value:0},uClicks:{value:j}}}),u=new s(n,{geometry:l,program:r});let F=()=>{h||g||t.render({scene:u})},I=async()=>{let t=++b;if(document.fonts?.ready)try{await document.fonts.ready}catch{}if(h||g||t!==b)return;let n=e.getBoundingClientRect();if(n.width<=0||n.height<=0)return;let i=Math.min(window.devicePixelRatio||1,2);T=window.getComputedStyle(e).color;let a=oe({container:e,width:n.width,height:n.height,dpr:i,props:D.current});d.image=a.canvas,d.needsUpdate=!0,r.uniforms.uBackdrop.value=+(ie(a.ink)<.5),x=!0,F()},L=()=>{if(h||g)return;let i=e.getBoundingClientRect();i.width<=0||i.height<=0||(t.dpr=Math.min(window.devicePixelRatio||1,2),t.setSize(i.width,i.height),r.uniforms.uResolution.value[0]=n.drawingBufferWidth,r.uniforms.uResolution.value[1]=n.drawingBufferHeight,I())},R=e=>{if(e.pointerType===`touch`)return;let t=P.getBoundingClientRect();t.width<=0||t.height<=0||(k.tx=(e.clientX-t.left)/t.width,k.ty=1-(e.clientY-t.top)/t.height,k.activeTarget=1)},ne=()=>{k.activeTarget=0},U=e=>{if(!D.current.clickRipple)return;let t=P.getBoundingClientRect();if(t.width<=0||t.height<=0)return;let n=j[M];M=(M+1)%j.length,n[0]=(e.clientX-t.left)/t.width,n[1]=1-(e.clientY-t.top)/t.height,n[2]=0,n[3]=y?.35:1},ae=e=>{e.preventDefault(),g=!0,m&&cancelAnimationFrame(m),m=0,A(!0)},se=()=>{v=!document.hidden,v&&_&&!m&&(m=requestAnimationFrame(q)),!v&&m&&(cancelAnimationFrame(m),m=0)},G=window.matchMedia?.(`(prefers-reduced-motion: reduce)`),K=e=>{y=e.matches,y&&(S=1),r.uniforms.uMotion.value=+!y,F()},q=t=>{if(h||g)return;let n=(t-N)*.001,i=C?Math.min(t-C,50):16;C=t,w+=1,x&&S<1&&(S=Math.min(1,S+i/z));let a=1-S;x&&w%15==0&&window.getComputedStyle(e).color!==T&&I();let o=Math.min(Math.max(D.current.idleDrift,0),1),s=k.activeTarget>0,c=.5+Math.sin(n*.33)*(.08+o*.2),l=.5+Math.cos(n*.27)*(.06+o*.2),u=1-Math.exp(-i/(s?130:470));k.x+=((s?k.tx:c)-k.x)*u,k.y+=((s?k.ty:l)-k.y)*u,k.active+=((s?1:o)-k.active)*(1-Math.exp(-i/270)),j.forEach(e=>{e[3]<=0||(e[2]+=i/1e3,e[2]>te&&(e[3]=0))}),r.uniforms.uPointer.value[0]=k.x,r.uniforms.uPointer.value[1]=k.y,r.uniforms.uPointerActive.value=y?k.active*.35:k.active,r.uniforms.uTime.value=y?0:n,r.uniforms.uIntro.value=a*a*a,r.uniforms.uReveal.value=x?re(Math.min(1,S/.45)):0,F(),m=requestAnimationFrame(q)};return f=new ResizeObserver(L),f.observe(e),p=new IntersectionObserver(([e])=>{_=e.isIntersecting,_&&v&&!m&&(m=requestAnimationFrame(q)),!_&&m&&(cancelAnimationFrame(m),m=0)},{threshold:0}),p.observe(e),P.addEventListener(`pointermove`,R),P.addEventListener(`pointerleave`,ne),P.addEventListener(`pointerdown`,U),P.addEventListener(`webglcontextlost`,ae,!1),document.addEventListener(`visibilitychange`,se),G?.addEventListener(`change`,K),W(r,D.current),O.current={program:r,rasterize:I},L(),m=requestAnimationFrame(q),()=>{if(h=!0,O.current=null,m&&cancelAnimationFrame(m),f?.disconnect(),p?.disconnect(),P.removeEventListener(`pointermove`,R),P.removeEventListener(`pointerleave`,ne),P.removeEventListener(`pointerdown`,U),P.removeEventListener(`webglcontextlost`,ae),document.removeEventListener(`visibilitychange`,se),G?.removeEventListener(`change`,K),!g)try{d?.texture&&n.deleteTexture(d.texture),l?.remove?.(),r?.remove?.(),n.getExtension(`WEBGL_lose_context`)?.loseContext()}catch{}P.parentNode===e&&e.removeChild(P)}},[]),(0,R.jsx)(`div`,{ref:E,className:`warp-text ${w}`.trim(),style:T,role:`img`,"aria-label":e,children:k&&(0,R.jsx)(`span`,{className:`warp-text__fallback`,"aria-hidden":`true`,style:{color:t,fontFamily:x,fontWeight:b,fontSize:ne(y),letterSpacing:ne(S),lineHeight:C},children:e})})},G=24,K=Math.PI*2,q=`#version 300 es
in vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`,ce=`#version 300 es
precision highp float;
uniform vec2 uCenter;
uniform vec2 uHalf;
uniform float uRadius;
uniform float uPx;
uniform float uSpot;
uniform vec2 uEntry;
uniform vec3 uLineColor;
uniform vec3 uBaseColor;
uniform float uIntensity;
uniform vec2 uWindow;
uniform float uThickness;
uniform float uGlow;
out vec4 outColor;

float roundedBox(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

float loopPosition(vec2 p, vec2 b, float r) {
  vec2 inner = b - r;
  float arc = 1.5707963 * r;
  float quarter = inner.x + inner.y + arc;
  vec2 a = abs(p);
  vec2 q = a - inner;
  float s = q.x > 0.0 && q.y > 0.0
    ? inner.y + atan(q.y, q.x) * r
    : (q.x > q.y ? min(a.y, inner.y) : inner.y + arc + inner.x - min(a.x, inner.x));
  if (p.x < 0.0) s = p.y >= 0.0 ? 2.0 * quarter - s : 2.0 * quarter + s;
  else if (p.y < 0.0) s = 4.0 * quarter - s;
  return s / max(4.0 * quarter, 0.0001);
}

float lobe(float position, float center) {
  float gap = abs(fract(position - center + 0.5) - 0.5);
  return 1.0 - smoothstep(uWindow.x, uWindow.x + uWindow.y, gap);
}

void main() {
  vec2 p = gl_FragCoord.xy - uCenter;
  float d = roundedBox(p, uHalf, uRadius);
  float position = loopPosition(p, uHalf, uRadius);
  float key = lobe(position, uSpot);
  float back = lobe(position, uSpot + 0.5);
  float streak = key + back * 0.45;
  float width = max(uThickness * uPx * mix(1.0, max(key, back), 0.6), 0.35);
  float band = smoothstep(-width - 0.6, -width + 0.6, d) * (1.0 - smoothstep(-0.6, 0.6, d));
  float hair = smoothstep(-uPx - 0.6, -uPx + 0.6, d) * (1.0 - smoothstep(-0.6, 0.6, d));
  float inside = 1.0 - smoothstep(-0.6, 0.6, d);
  vec2 pool = (p - uEntry) / (uHalf.y * vec2(1.6, 1.1));
  float glow = streak * 0.2 * exp(-abs(d + width * 0.5) / (5.0 * uPx)) + inside * 0.08 * exp(-dot(pool, pool));
  float light = clamp((band * streak + glow * uGlow) * uIntensity, 0.0, 1.0);
  vec4 base = vec4(uBaseColor, 1.0) * hair * 0.6;
  outColor = vec4(uLineColor, 1.0) * light + base * (1.0 - light);
}`,J=[`uCenter`,`uHalf`,`uRadius`,`uPx`,`uSpot`,`uEntry`,`uLineColor`,`uBaseColor`,`uIntensity`,`uWindow`,`uThickness`,`uGlow`],le=(e,t,n)=>Math.min(n,Math.max(t,e)),Y=e=>e-Math.floor(e),ue=(e,t,n,r,i)=>{let a=n-i,o=r-i,s=Math.PI/2*i,c=a+o+s,l=Math.abs(e),u=Math.abs(t),d=l-a,f=u-o,p;return p=d>0&&f>0?o+Math.atan2(f,d)*i:d>f?Math.min(u,o):o+s+a-Math.min(l,a),e<0?p=t>=0?2*c-p:2*c+p:t<0&&(p=4*c-p),Y(p/Math.max(4*c,1e-4))},X=(e,t,n,r)=>{let i=t-r,a=n-r,o=Math.PI/2*r,s=i+a+o,c=Y(e)*4*s,l=1,u=1;c>3*s?(c=4*s-c,u=-1):c>2*s?(c-=2*s,l=-1,u=-1):c>s&&(c=2*s-c,l=-1);let d=i-(c-a-o),f=n;if(c<=a)d=t,f=c;else if(c<=a+o){let e=(c-a)/Math.max(r,1e-4);d=i+Math.cos(e)*r,f=a+Math.sin(e)*r}return[d*l,f*u]},de=(e,t,n)=>{let r=e.createShader(t);return r?(e.shaderSource(r,n),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)?r:(e.deleteShader(r),null)):null},Z=e=>{let t=de(e,e.VERTEX_SHADER,q),n=de(e,e.FRAGMENT_SHADER,ce),r=e.createProgram();return!t||!n||!r?null:(e.attachShader(r,t),e.attachShader(r,n),e.bindAttribLocation(r,0,`aPosition`),e.linkProgram(r),e.deleteShader(t),e.deleteShader(n),e.getProgramParameter(r,e.LINK_STATUS)?r:(e.deleteProgram(r),null))},fe=({children:e=`Get Started`,size:t=`lg`,radius:n=18,tint:r=`#ffffff`,tintOpacity:i=.04,blur:a=0,textColor:o=`#f5f5f5`,lineColor:s=`#ffffff`,baseColor:c=`#525252`,intensity:l=1,idleIntensity:u=.35,shineSize:d=10,shineFade:f=34,thickness:p=1.2,glow:m=1,speed:h=.35,followMouse:g=!0,proximity:_=250,autoAnimate:v=!1,disabled:y=!1,onClick:b,className:x=``,type:S=`button`,style:C,...w})=>{let T=(0,I.useRef)(null),E=(0,I.useRef)(null),D=(0,I.useRef)(null),O={radius:Math.max(0,n),lineColor:String(s),baseColor:String(c),intensity:Math.max(0,l),idleIntensity:le(u,0,1),shineSize:Math.max(0,d),shineFade:Math.max(0,f),thickness:Math.max(0,p),glow:Math.max(0,m),speed:h,followMouse:g,proximity:Math.max(1,_),autoAnimate:v,disabled:y},k=(0,I.useRef)(O);return k.current=O,(0,I.useEffect)(()=>{let e=T.current,t=E.current,n=t?.getContext(`webgl2`,{alpha:!0,premultipliedAlpha:!0,antialias:!1,depth:!1,stencil:!1});if(!e||!t||!n)return;let r=Z(n);if(!r)return;let i={};for(let e of J)i[e]=n.getUniformLocation(r,e);let a=n.createBuffer(),o=n.createVertexArray();n.bindVertexArray(o),n.bindBuffer(n.ARRAY_BUFFER,a),n.bufferData(n.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),n.STATIC_DRAW),n.enableVertexAttribArray(0),n.vertexAttribPointer(0,2,n.FLOAT,!1,0,0),n.bindVertexArray(null);let s=document.createElement(`canvas`).getContext(`2d`,{willReadFrequently:!0}),c=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches??!1,l=new Map,u={width:1,height:1,ratio:1},d={x:0,y:0,known:!1},f={spot:0,level:0,press:0,ready:!1},p=0,m=0,h=!0,g=e=>{if(l.has(e))return l.get(e);let t=[1,1,1];if(s){s.clearRect(0,0,1,1),s.fillStyle=`#000000`,s.fillStyle=e,s.fillRect(0,0,1,1);let[n,r,i]=s.getImageData(0,0,1,1).data;t=[n/255,r/255,i/255]}return l.set(e,t),t},_=e=>Math.min(e.radius,u.width/2,u.height/2),v=e=>{let t=_(e),n=t*(1-Math.SQRT1_2);return ue(n-u.width/2,u.height/2-n,u.width/2,u.height/2,t)},y=t=>{if(!t.followMouse||t.disabled||!d.known)return null;let n=e.getBoundingClientRect(),r=n.width/u.width||1,i=u.width/2,a=u.height/2,o=(d.x-n.left-n.width/2)/r,s=(n.top+n.height/2-d.y)/r,c=Math.hypot(Math.max(Math.abs(o)-i,0),Math.max(Math.abs(s)-a,0)),l=le(1-c/t.proximity,0,1),f=l*l*(3-2*l),p=ue(o,s,i,a,_(t));if(c>0)return{spot:p,near:f};let m=le(Math.min(i-Math.abs(o),a-Math.abs(s))/(a*.8),0,1),h=v(t)-o/i*.06-s/a*.02;return{spot:Y(p+(h-p-Math.round(h-p))*m*m*(3-2*m)),near:f}},b=e=>{let{width:a,height:s}=u,c=t.width/(a+48),l=t.height/(s+48);n.viewport(0,0,t.width,t.height),n.clearColor(0,0,0,0),n.clear(n.COLOR_BUFFER_BIT),n.useProgram(r),n.uniform2f(i.uCenter,(G+a/2)*c,(G+s/2)*l),n.uniform2f(i.uHalf,a/2*c,s/2*l),n.uniform1f(i.uRadius,Math.min(e.radius,a/2,s/2)*c),n.uniform1f(i.uPx,u.ratio);let d=Math.min(e.radius,a/2,s/2),[p,m]=X(f.spot,a/2,s/2,d),h=1-Math.min(s/2*.35,Math.hypot(p,m))/Math.max(Math.hypot(p,m),1e-4);n.uniform1f(i.uSpot,f.spot),n.uniform2f(i.uEntry,p*h*c,m*h*l),n.uniform3fv(i.uLineColor,g(e.lineColor)),n.uniform3fv(i.uBaseColor,g(e.baseColor)),n.uniform1f(i.uIntensity,e.intensity*(f.level+f.press*.8)),n.uniform2f(i.uWindow,e.shineSize/360+f.press*.06,e.shineFade/360+1e-4),n.uniform1f(i.uThickness,e.thickness),n.uniform1f(i.uGlow,e.glow),n.bindVertexArray(o),n.drawArrays(n.TRIANGLES,0,3),n.bindVertexArray(null)},x=e=>{if(p=0,!h)return;let t=k.current,n=m?Math.min(.05,(e-m)/1e3):1/60;m=e;let r=y(t),i=t.autoAnimate&&!c,a=!!r&&r.near>0;f.ready||=(f.spot=v(t),f.level=t.autoAnimate?1:t.idleIntensity,!0);let o=0;i&&!a?f.spot=Y(f.spot+t.speed/K*n):(o=(a?r.spot:v(t))-f.spot,o-=Math.round(o),f.spot=Y(f.spot+o*(1-Math.exp(-n*8))));let s=t.autoAnimate?1:t.idleIntensity+(1-t.idleIntensity)*(r?r.near:0);f.level+=(s-f.level)*(1-Math.exp(-n*7)),f.press*=Math.exp(-n*5),b(t),Math.abs(o)>2e-4||Math.abs(s-f.level)>.001||f.press>.002||i&&!a?p=requestAnimationFrame(x):m=0},S=()=>{!p&&h&&(p=requestAnimationFrame(x))},C=n=>{let r=n?.borderBoxSize?.[0];u.width=Math.max(1,r?r.inlineSize:e.offsetWidth),u.height=Math.max(1,r?r.blockSize:e.offsetHeight),u.ratio=Math.min(window.devicePixelRatio||1,3),t.width=Math.max(1,Math.round((u.width+48)*u.ratio)),t.height=Math.max(1,Math.round((u.height+48)*u.ratio)),f.ready&&b(k.current),S()},w=e=>{d.x=e.clientX,d.y=e.clientY,d.known=!0,S()},O=e=>{d.x=e.clientX,d.y=e.clientY,d.known=!0,k.current.disabled||(f.press=1),S()},A=e=>{e.pointerType!==`mouse`&&(d.known=!1,S())},j=()=>{d.known=!1,S()},M=new ResizeObserver(e=>C(e[e.length-1]));M.observe(e);let N=new IntersectionObserver(e=>{h=e.some(e=>e.isIntersecting),h&&(m=0,S())});return N.observe(e),window.addEventListener(`pointermove`,w,{passive:!0}),window.addEventListener(`pointerup`,A,{passive:!0}),window.addEventListener(`pointercancel`,A,{passive:!0}),document.documentElement.addEventListener(`pointerleave`,j),e.addEventListener(`pointerdown`,O),C(),D.current=S,()=>{cancelAnimationFrame(p),D.current=null,M.disconnect(),N.disconnect(),window.removeEventListener(`pointermove`,w),window.removeEventListener(`pointerup`,A),window.removeEventListener(`pointercancel`,A),document.documentElement.removeEventListener(`pointerleave`,j),e.removeEventListener(`pointerdown`,O),n.deleteBuffer(a),n.deleteVertexArray(o),n.deleteProgram(r)}},[]),(0,I.useEffect)(()=>{D.current?.()}),(0,R.jsxs)(`button`,{ref:T,type:S,disabled:y,onClick:b,className:`specular-button specular-button--${t}${x?` ${x}`:``}`,style:{"--sb-radius":`${n}px`,"--sb-tint":r,"--sb-tint-opacity":i,"--sb-tint-percent":`${i*100}%`,"--sb-blur":`${a}px`,"--sb-text-color":o,...C},...w,children:[(0,R.jsx)(`canvas`,{ref:E,className:`specular-button__light`,"aria-hidden":`true`}),(0,R.jsx)(`span`,{className:`specular-button__label`,children:e})]})},pe=`aero-shards`,me=`aero-shards-canvas`,he=[`full`,`left`,`right`,`center`],ge={glass:[0,0,0,0],chrome:[1,0,0,0]},_e=24,ve=160,ye=4,be=3.1,xe=2.75,Se=[1,.5],Ce=1,Q=[2.7,3.9,5.6,8.1,11.6],we=[.26,.23,.2,.17,.14],Te=[1,1.3,1.8,2.6,3.6],Ee=[1,.8,.52,.32,.2],De=Q.length,Oe={plus:0,dots:1},ke=8,Ae=[[.37,.61],[.83,.12],[.21,.88],[.66,.44],[.05,.27]],je=4,Me=2.6,Ne=4,Pe=[[.2,-.78],[-.72,.02],[.58,-.06],[-.24,.62],[.8,.3]],Fe=[.84,.62,.44,.28,.14],Ie=[[.98,.78],[.9,.7],[.84,.64],[.8,.6],[.76,.56]],$=Math.PI*2,Le=`
struct Frame {
  view: vec4f,
  eye: vec4f,
  forward: vec4f,
  right: vec4f,
  up: vec4f,
  shard: vec4f,
  accent: vec4f,
  marker: vec4f,
  surface: vec4f,
}

struct Layer {
  view: vec4f,
  look: vec4f,
}

struct VertexOut {
  @builtin(position) position: vec4f,
  @location(0) @interpolate(flat, first) center: vec4f,
  @location(1) @interpolate(flat, first) axis: vec4f,
  @location(2) @interpolate(flat, first) normal: vec4f,
  @location(3) @interpolate(flat, first) p01: vec4f,
  @location(4) @interpolate(flat, first) p23: vec4f,
  @location(5) @interpolate(flat, first) p4: vec4f,
  @location(6) @interpolate(flat, first) topA: vec4f,
  @location(7) @interpolate(flat, first) topB: vec4f,
  @location(8) @interpolate(flat, first) topC: vec4f,
  @location(9) @interpolate(flat, first) bottomA: vec4f,
  @location(10) @interpolate(flat, first) bottomB: vec4f,
  @location(11) @interpolate(flat, first) bottomC: vec4f,
}

struct FragmentOut {
  @location(0) color: vec4f,
  @builtin(frag_depth) depth: f32,
}

@group(0) @binding(0) var<uniform> scene: Frame;
@group(0) @binding(1) var<storage, read> shards: array<vec4f>;
@group(0) @binding(2) var<uniform> layerInfo: Layer;

fn project(world: vec3f) -> vec3f {
  let offset = world - scene.eye.xyz;
  let depth = max(dot(offset, scene.forward.xyz), 0.05);
  let x = dot(offset, scene.right.xyz);
  let y = dot(offset, scene.up.xyz);
  return vec3f(layerInfo.view.x * 0.5 + x * layerInfo.view.z / depth, layerInfo.view.y * 0.5 - y * layerInfo.view.z / depth, depth);
}

@vertex
fn vs_main(@builtin(vertex_index) vertexIndex: u32, @builtin(instance_index) instance: u32) -> VertexOut {
  let index = instance * 6u;
  let a = shards[index];
  let b = shards[index + 1u];
  let c = shards[index + 2u];
  let d = shards[index + 3u];
  let e = shards[index + 4u];
  let f = shards[index + 5u];
  let center = a.xyz;
  let size = a.w;
  let axis = normalize(b.xyz);
  let normal = normalize(c.xyz);
  let side = normalize(cross(normal, axis));

  var out: VertexOut;
  let middle = project(center);
  if (middle.z < 0.35 || size <= 0.0) {
    out.position = vec4f(2.0, 2.0, 0.5, 1.0);
    return out;
  }

  let count = i32(f.z);
  let points = array<vec2f, 5>(d.xy, d.zw, e.xy, e.zw, f.xy);
  var low = vec2f(1e9);
  var high = vec2f(-1e9);
  var tops = array<vec2f, 5>(vec2f(0.0), vec2f(0.0), vec2f(0.0), vec2f(0.0), vec2f(0.0));
  var bottoms = array<vec2f, 5>(vec2f(0.0), vec2f(0.0), vec2f(0.0), vec2f(0.0), vec2f(0.0));
  for (var i = 0; i < 5; i += 1) {
    let corner = points[min(i, count - 1)];
    let onPlate = center + (axis * corner.x + side * corner.y) * size;
    let top = project(onPlate + normal * b.w * size);
    let bottom = project(onPlate - normal * b.w * size);
    tops[i] = top.xy;
    bottoms[i] = bottom.xy;
    low = min(low, min(top.xy, bottom.xy));
    high = max(high, max(top.xy, bottom.xy));
  }
  low -= vec2f(2.0);
  high += vec2f(2.0);
  let corners = array<vec2f, 6>(vec2f(0.0, 0.0), vec2f(1.0, 0.0), vec2f(0.0, 1.0), vec2f(0.0, 1.0), vec2f(1.0, 0.0), vec2f(1.0, 1.0));
  let pixel = mix(low, high, corners[vertexIndex]);
  out.position = vec4f(pixel.x / layerInfo.view.x * 2.0 - 1.0, 1.0 - pixel.y / layerInfo.view.y * 2.0, 0.5, 1.0);
  out.center = a;
  out.axis = vec4f(axis, b.w);
  out.normal = vec4f(normal, c.w);
  out.p01 = d;
  out.p23 = e;
  out.p4 = f;
  out.topA = vec4f(tops[0], tops[1]);
  out.topB = vec4f(tops[2], tops[3]);
  out.topC = vec4f(tops[4], 0.0, 0.0);
  out.bottomA = vec4f(bottoms[0], bottoms[1]);
  out.bottomB = vec4f(bottoms[2], bottoms[3]);
  out.bottomC = vec4f(bottoms[4], 0.0, 0.0);
  return out;
}

fn cross2(a: vec2f, b: vec2f) -> f32 {
  return a.x * b.y - a.y * b.x;
}

fn outlineCoverage(p: vec2f, points: array<vec2f, 5>, count: i32) -> f32 {
  var area = 0.0;
  for (var i = 0; i < 5; i += 1) {
    if (i < count) {
      area += cross2(points[i], points[(i + 1) % count]);
    }
  }
  let orient = select(-1.0, 1.0, area > 0.0);
  var distance = -1e9;
  for (var i = 0; i < 5; i += 1) {
    if (i < count) {
      let a = points[i];
      let edge = points[(i + 1) % count] - a;
      let span = length(edge);
      if (span > 1e-4) {
        let n = vec2f(edge.y, -edge.x) * (orient / span);
        distance = max(distance, dot(p - a, n));
      }
    }
  }
  return clamp(0.5 - distance, 0.0, 1.0);
}

struct Prism {
  points: array<vec2f, 5>,
  count: i32,
  half: f32,
}

struct Hit {
  near: f32,
  far: f32,
  normal: vec3f,
}

fn plane(prism: Prism, k: i32) -> vec4f {
  if (k == 0) { return vec4f(0.0, 0.0, 1.0, prism.half); }
  if (k == 1) { return vec4f(0.0, 0.0, -1.0, prism.half); }
  let a = prism.points[k - 2];
  let b = prism.points[(k - 1) % prism.count];
  let edge = b - a;
  let n = normalize(vec2f(edge.y, -edge.x));
  return vec4f(n, 0.0, dot(n, a));
}

fn trace(prism: Prism, ro: vec3f, rd: vec3f) -> Hit {
  var hit: Hit;
  hit.near = -1e9;
  hit.far = 1e9;
  hit.normal = vec3f(0.0, 0.0, 1.0);
  for (var k = 0; k < 7; k += 1) {
    if (k < prism.count + 2) {
      let p = plane(prism, k);
      let denom = dot(p.xyz, rd);
      let gap = p.w - dot(p.xyz, ro);
      if (abs(denom) < 1e-7) {
        if (gap < 0.0) { hit.far = -1e9; }
      } else {
        let t = gap / denom;
        if (denom < 0.0) {
          if (t > hit.near) {
            hit.near = t;
            hit.normal = p.xyz;
          }
        } else if (t < hit.far) {
          hit.far = t;
        }
      }
    }
  }
  return hit;
}

fn exitFrom(prism: Prism, ro: vec3f, rd: vec3f) -> vec4f {
  var best = 1e9;
  var normal = vec3f(0.0, 0.0, -1.0);
  for (var k = 0; k < 7; k += 1) {
    if (k < prism.count + 2) {
      let p = plane(prism, k);
      let denom = dot(p.xyz, rd);
      if (denom > 1e-6) {
        let t = (p.w - dot(p.xyz, ro)) / denom;
        if (t < best) {
          best = t;
          normal = p.xyz;
        }
      }
    }
  }
  return vec4f(normal, max(best, 0.0));
}

fn rectLight(r: vec3f, dir: vec3f, across: vec3f, extent: vec2f, soft: f32) -> f32 {
  let facing = dot(r, dir);
  if (facing <= 0.0) { return 0.0; }
  let up = cross(dir, across);
  let u = dot(r, across) / facing;
  let v = dot(r, up) / facing;
  let a = 1.0 - smoothstep(extent.x - soft, extent.x + soft, abs(u));
  let b = 1.0 - smoothstep(extent.y - soft, extent.y + soft, abs(v));
  return a * b;
}

const KEY_DIR = vec3f(-0.28, 0.72, 0.64) / length(vec3f(-0.28, 0.72, 0.64));
const KEY_ACROSS = vec3f(0.92, 0.0, 0.4) / length(vec3f(0.92, 0.0, 0.4));
const LEFT_DIR = vec3f(-0.86, 0.12, 0.5) / length(vec3f(-0.86, 0.12, 0.5));
const LEFT_ACROSS = vec3f(0.5, 0.0, 0.86) / length(vec3f(0.5, 0.0, 0.86));
const RIM_DIR = vec3f(0.78, 0.22, -0.58) / length(vec3f(0.78, 0.22, -0.58));
const RIM_ACROSS = vec3f(0.6, 0.0, 0.8) / length(vec3f(0.6, 0.0, 0.8));
const TOP_DIR = vec3f(0.05, 0.94, -0.33) / length(vec3f(0.05, 0.94, -0.33));
const TOP_ACROSS = vec3f(1.0, 0.0, 0.0);

fn lobe(r: vec3f, dir: vec3f, width: f32) -> f32 {
  return exp((dot(r, dir) - 1.0) / (width * width));
}

fn studio(r: vec3f, soft: f32, accent: vec3f, ink: vec3f) -> vec3f {
  let sky = clamp(r.y * 0.5 + 0.5, 0.0, 1.0);
  var col = mix(ink * 0.03, ink * 0.12 + accent * 0.03, smoothstep(0.25, 0.95, sky));
  col += mix(ink, vec3f(1.0), 0.6) * lobe(r, KEY_DIR, 0.38) * 3.6;
  col += mix(accent, vec3f(1.0), 0.2) * lobe(r, RIM_DIR, 0.34) * 3.4;
  col += vec3f(1.0, 0.98, 1.0) * rectLight(r, LEFT_DIR, LEFT_ACROSS, vec2f(0.12, 0.8), 0.08 + soft) * 3.2;
  col += vec3f(1.0, 0.98, 1.0) * rectLight(r, TOP_DIR, TOP_ACROSS, vec2f(0.9, 0.1), 0.08 + soft) * 2.6;
  return col;
}

fn studioLight(r: vec3f, soft: f32, accent: vec3f) -> vec3f {
  let ground = vec3f(0.2, 0.2, 0.23);
  let skyTone = vec3f(0.97, 0.97, 0.99);
  var col = mix(ground, skyTone, smoothstep(-0.08 - soft, 0.16 + soft, r.y));
  col = mix(col, vec3f(0.55, 0.55, 0.6), lobe(r, vec3f(0.0, -1.0, 0.0), 0.5) * 0.4);
  col += vec3f(0.4) * rectLight(r, KEY_DIR, KEY_ACROSS, vec2f(0.46, 0.3), 0.07 + soft);
  col -= vec3f(0.55) * rectLight(r, LEFT_DIR, LEFT_ACROSS, vec2f(0.1, 0.85), 0.05 + soft);
  col -= vec3f(0.45) * rectLight(r, RIM_DIR, RIM_ACROSS, vec2f(0.12, 0.9), 0.05 + soft);
  return clamp(col, vec3f(0.05), vec3f(1.2));
}

fn schlick(cosine: f32, f0: f32) -> f32 {
  return f0 + (1.0 - f0) * pow(1.0 - clamp(cosine, 0.0, 1.0), 5.0);
}

fn rayFor(pixel: vec2f) -> vec3f {
  let x = pixel.x - layerInfo.view.x * 0.5;
  let y = layerInfo.view.y * 0.5 - pixel.y;
  return normalize(scene.forward.xyz * layerInfo.view.z + scene.right.xyz * x + scene.up.xyz * y);
}

struct Surface {
  coverage: f32,
  color: vec3f,
  alpha: f32,
  depth: f32,
}

fn shade(pixel: vec2f, in: VertexOut) -> Surface {
  let center = in.center.xyz;
  let size = in.center.w;
  let axis = in.axis.xyz;
  let plateNormal = in.normal.xyz;
  let side = normalize(cross(plateNormal, axis));
  var prism: Prism;
  prism.points = array<vec2f, 5>(in.p01.xy, in.p01.zw, in.p23.xy, in.p23.zw, in.p4.xy);
  prism.count = i32(in.p4.z);
  prism.half = in.axis.w;

  let eye = scene.eye.xyz;
  let toLocal = mat3x3f(axis.x, side.x, plateNormal.x, axis.y, side.y, plateNormal.y, axis.z, side.z, plateNormal.z);
  let fromLocal = mat3x3f(axis, side, plateNormal);
  let origin = toLocal * (eye - center) / size;

  let rd = rayFor(pixel);
  let ray = toLocal * rd;
  let denom = dot(ray, vec3f(0.0, 0.0, 1.0));
  let flatT = -origin.z / select(denom, 1e-4, abs(denom) < 1e-4);
  let flatPoint = origin.xy + ray.xy * flatT;
  let footprint = max(length(fwidth(flatPoint)) * 0.7, 1e-4);
  let softBase = clamp(length(fwidth(reflect(rd, plateNormal))) * 0.5, 0.0, 0.5);

  let primary = trace(prism, origin, ray);
  let tops = array<vec2f, 5>(in.topA.xy, in.topA.zw, in.topB.xy, in.topB.zw, in.topC.xy);
  let bottoms = array<vec2f, 5>(in.bottomA.xy, in.bottomA.zw, in.bottomB.xy, in.bottomB.zw, in.bottomC.xy);
  let coverage = max(outlineCoverage(pixel, tops, prism.count), outlineCoverage(pixel, bottoms, prism.count));

  var surface: Surface;
  let facing = select(-1.0, 1.0, origin.z > 0.0);
  let capT = (facing * prism.half - origin.z) / select(ray.z, -1e-4 * facing, abs(ray.z) < 1e-4);
  let missed = primary.near > primary.far;
  let hitT = select(primary.near, capT, missed);
  let hitNormal = select(primary.normal, vec3f(0.0, 0.0, facing), missed);
  surface.coverage = select(0.0, coverage, hitT > 0.0);
  surface.color = vec3f(0.0);
  surface.alpha = 0.0;
  surface.depth = 1.0;
  if (surface.coverage <= 0.0) { return surface; }
  let mainRay = ray;

  let local = origin + mainRay * hitT;
  let worldRay = fromLocal * mainRay;
  let viewDepth = max(hitT * size * dot(worldRay, scene.forward.xyz), 0.05);
  surface.depth = clamp(1.0 - 0.3 / viewDepth, 0.0, 1.0);

  let radius = max(prism.half * 1.15, footprint * 2.5);
  var n = hitNormal;
  var bevel = 0.0;
  if (abs(n.z) > 0.5) {
    var gap = 1e9;
    for (var k = 2; k < 7; k += 1) {
      if (k < prism.count + 2) {
        let p = plane(prism, k);
        gap = min(gap, p.w - dot(p.xy, local.xy));
      }
    }
    var toward = vec2f(0.0);
    for (var k = 2; k < 7; k += 1) {
      if (k < prism.count + 2) {
        let p = plane(prism, k);
        let g = p.w - dot(p.xy, local.xy);
        toward += p.xy * exp(-(g - gap) / (radius * 0.35));
      }
    }
    toward = normalize(toward);
    bevel = clamp(1.0 - gap / radius, 0.0, 1.0);
    let angle = bevel * bevel * 0.7853982;
    n = normalize(n * cos(angle) + vec3f(toward, 0.0) * sin(angle));
  } else {
    let gap = prism.half - abs(local.z);
    bevel = clamp(1.0 - gap / radius, 0.0, 1.0);
    let angle = bevel * bevel * 0.7853982;
    n = normalize(n * cos(angle) + vec3f(0.0, 0.0, sign(local.z)) * sin(angle));
  }
  let bendRate = 1.8 / max(radius / footprint, 1.0);
  let normal = normalize(fromLocal * n);
  let view = -worldRay;
  let reflected = reflect(worldRay, normal);
  let soft = softBase + bendRate * smoothstep(0.0, 0.25, bevel) * 1.2 + clamp(footprint * 0.6, 0.0, 0.5);
  let ndv = clamp(dot(normal, view), 0.0, 1.0);

  let accent = scene.accent.rgb;
  let base = scene.shard.rgb;
  let world = center + fromLocal * local * size;
  let height = clamp(0.5 + world.y * 0.45, 0.0, 1.0);
  let tone = mix(accent, base, height);
  let body = mix(tone, mix(base, accent, 0.5), in.normal.w * 0.3);
  let mode = scene.surface.x;
  let lightMode = scene.up.w > 0.5;
  let wrap = clamp(dot(normal, KEY_DIR) * 0.5 + 0.5, 0.0, 1.0);

  var color = vec3f(0.0);
  var alpha = 1.0;
  let chrome = mode > 0.5;
  if (lightMode) {
    let env = studioLight(reflected, soft, accent);
    if (chrome) {
      color = env * mix(body, vec3f(1.0), 0.6);
    } else {
      let fresnel = schlick(ndv, 0.05);
      let diffuse = clamp(dot(normal, KEY_DIR) * 0.5 + 0.5, 0.0, 1.0);
      alpha = clamp(0.32 + fresnel * 0.5 + (1.0 - abs(n.z)) * 0.5, 0.0, 1.0);
      color = mix(body, vec3f(1.0), 0.15) * (0.5 + 0.4 * diffuse) * alpha + (env - vec3f(0.78)) * fresnel * 0.8;
    }
  } else if (chrome) {
    let env = studio(reflected, soft, accent, body);
    color = env * mix(body, vec3f(1.0), 0.55) * 0.9 + body * 0.02;
  } else {
    let fresnel = schlick(ndv, 0.04);
    let env = studio(reflected, soft, accent, body);
    var light = vec3f(0.0);
    var cursor = local;
    var direction = toLocal * refract(worldRay, normal, 1.0 / 1.5);
    var travelled = 0.0;
    var carry = 1.0 - fresnel;
    var through = 0.0;
    for (var bounce = 0; bounce < 3; bounce += 1) {
      let outlet = exitFrom(prism, cursor, direction);
      travelled += outlet.w;
      cursor = cursor + direction * outlet.w;
      let outward = outlet.xyz;
      let escaped = refract(direction, -outward, 1.5);
      if (dot(escaped, escaped) > 0.0) {
        let leave = schlick(dot(direction, outward), 0.04);
        let worldOut = normalize(fromLocal * escaped);
        let absorb = exp(-(vec3f(1.0) - body) * travelled * size * 22.0);
        let straight = smoothstep(0.97, 0.999, dot(worldOut, worldRay));
        let energy = carry * (1.0 - leave);
        light += studio(worldOut, soft * 2.0 + 0.04, accent, body) * absorb * energy * (1.0 - straight) * 2.0;
        through += energy * straight * (absorb.r + absorb.g + absorb.b) / 3.0;
        carry *= leave;
      }
      direction = reflect(direction, outward);
    }
    let edge = max(pow(1.0 - abs(n.z), 1.2), bevel * bevel * 0.85);
    let glow = mix(mix(body, accent, 0.35), vec3f(1.0), 0.28) * edge * (0.35 + 0.45 * wrap);
    color = env * fresnel * 0.85 + light * (1.0 - smoothstep(0.0, 0.6, bevel)) + body * 0.02 + glow;
    alpha = clamp(1.0 - through + edge * 0.25, 0.0, 1.0);
  }

  color *= select(1.3, 1.0, lightMode);
  let haze = smoothstep(3.5, 12.0, viewDepth) * layerInfo.look.x;
  let hazeColor = select(mix(base, accent, 0.5) * 0.3, mix(base, vec3f(1.0), 0.72), lightMode);
  color = mix(color, hazeColor * alpha + color * 0.3, haze);
  let flash = in.p4.w;
  color += mix(accent, vec3f(1.0), 0.35) * flash * select(0.5, 0.0, lightMode) * max(alpha, 0.35);
  alpha = max(alpha, flash * 0.45 * select(1.0, 0.0, lightMode));
  surface.color = color;
  surface.alpha = alpha;
  return surface;
}

@fragment
fn fs_solid(in: VertexOut) -> FragmentOut {
  let surface = shade(in.position.xy, in);
  if (surface.coverage < 0.999 || surface.alpha < 0.6) { discard; }
  var out: FragmentOut;
  out.color = vec4f(surface.color, surface.alpha);
  out.depth = surface.depth;
  return out;
}

@fragment
fn fs_edge(in: VertexOut) -> FragmentOut {
  let surface = shade(in.position.xy, in);
  if (surface.coverage <= 0.001 || (surface.coverage >= 0.9996 && surface.alpha >= 0.62)) { discard; }
  var out: FragmentOut;
  out.color = vec4f(surface.color, surface.alpha) * surface.coverage;
  out.depth = surface.depth;
  return out;
}
`,Re=`
struct Spread { texel: vec4f }
@group(0) @binding(0) var source: texture_2d<f32>;
@group(0) @binding(1) var linearSampler: sampler;
@group(0) @binding(2) var<uniform> spreadInfo: Spread;

@fragment
fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let sigma = max(spreadInfo.texel.z, 0.3);
  let reach = min(i32(ceil(sigma * 2.6)), 20);
  var total = textureSampleLevel(source, linearSampler, uv, 0.0);
  var weight = 1.0;
  for (var i = 1; i <= reach; i += 1) {
    let w = exp(-f32(i * i) / (2.0 * sigma * sigma));
    let o = spreadInfo.texel.xy * f32(i);
    total += (textureSampleLevel(source, linearSampler, uv + o, 0.0) + textureSampleLevel(source, linearSampler, uv - o, 0.0)) * w;
    weight += 2.0 * w;
  }
  return total / weight;
}
`,ze=`
struct Shade {
  info: vec4f,
  more: vec4f,
}
@group(0) @binding(0) var source: texture_2d<f32>;
@group(0) @binding(1) var depthMap: texture_depth_2d;
@group(0) @binding(2) var<uniform> shadeInfo: Shade;

@fragment
fn fs_main(@builtin(position) pixel: vec4f) -> @location(0) vec4f {
  let bounds = vec2i(textureDimensions(source)) - vec2i(1);
  let here = vec2i(pixel.xy);
  let color = textureLoad(source, here, 0);
  if (color.a <= 0.002 || shadeInfo.info.z <= 0.0) { return color; }
  let depth = textureLoad(depthMap, here, 0);
  let east = textureLoad(depthMap, clamp(here + vec2i(1, 0), vec2i(0), bounds), 0);
  let west = textureLoad(depthMap, clamp(here - vec2i(1, 0), vec2i(0), bounds), 0);
  let south = textureLoad(depthMap, clamp(here + vec2i(0, 1), vec2i(0), bounds), 0);
  let north = textureLoad(depthMap, clamp(here - vec2i(0, 1), vec2i(0), bounds), 0);
  let limit = shadeInfo.more.x * 0.5;
  let slopeX = clamp(select(east - depth, depth - west, abs(depth - west) < abs(east - depth)), -limit, limit);
  let slopeY = clamp(select(south - depth, depth - north, abs(depth - north) < abs(south - depth)), -limit, limit);
  var occlusion = 0.0;
  for (var i = 1; i <= 12; i += 1) {
    let offset = -shadeInfo.info.xy * f32(i);
    let probe = clamp(vec2i(pixel.xy + offset), vec2i(0), bounds);
    let other = textureLoad(depthMap, probe, 0);
    let expected = depth + slopeX * offset.x + slopeY * offset.y;
    let closer = smoothstep(shadeInfo.more.x * 0.6, shadeInfo.more.x * 2.4, expected - other);
    let reach = 1.0 - f32(i - 1) / 12.0;
    occlusion = max(occlusion, closer * reach * reach);
  }
  return vec4f(color.rgb * (1.0 - occlusion * shadeInfo.info.z), color.a);
}
`,Be=`
struct Blend { info: vec4f }
@group(0) @binding(0) var source: texture_2d<f32>;
@group(0) @binding(1) var linearSampler: sampler;
@group(0) @binding(2) var<uniform> mixInfo: Blend;

@fragment
fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  return textureSampleLevel(source, linearSampler, uv, 0.0) * mixInfo.info.x;
}
`,Ve=`
struct Frame {
  view: vec4f,
  eye: vec4f,
  forward: vec4f,
  right: vec4f,
  up: vec4f,
  shard: vec4f,
  accent: vec4f,
  marker: vec4f,
  surface: vec4f,
}

struct MarkerOut {
  @builtin(position) position: vec4f,
  @location(0) local: vec2f,
  @location(1) @interpolate(flat, first) shape: vec4f,
  @location(2) @interpolate(flat, first) light: vec4f,
}

@group(0) @binding(0) var<uniform> scene: Frame;
@group(0) @binding(1) var<storage, read> markers: array<vec4f>;

@vertex
fn vs_main(@builtin(vertex_index) vertexIndex: u32, @builtin(instance_index) instance: u32) -> MarkerOut {
  let a = markers[instance * 2u];
  let b = markers[instance * 2u + 1u];
  let offset = a.xyz - scene.eye.xyz;
  let depth = max(dot(offset, scene.forward.xyz), 0.05);
  let center = vec2f(
    scene.view.x * 0.5 + dot(offset, scene.right.xyz) * scene.view.z / depth,
    scene.view.y * 0.5 - dot(offset, scene.up.xyz) * scene.view.z / depth,
  );
  let pixel = scene.marker.y;
  let size = scene.marker.z * clamp(sqrt(scene.marker.w / depth), 0.6, 1.3) * b.z;
  let blur = min(scene.forward.w * abs(1.0 - scene.eye.w / depth), scene.right.w) * 0.18;
  let frame = b.y;
  let reach = select(size, size * 2.6, frame > 0.001) + blur + 1.5 * pixel;
  let corners = array<vec2f, 6>(vec2f(-1.0, -1.0), vec2f(1.0, -1.0), vec2f(-1.0, 1.0), vec2f(-1.0, 1.0), vec2f(1.0, -1.0), vec2f(1.0, 1.0));
  let corner = corners[vertexIndex % 6u] * reach;
  var out: MarkerOut;
  if (depth < 0.35 || a.w <= 0.002) {
    out.position = vec4f(2.0, 2.0, 0.5, 1.0);
    return out;
  }
  let at = center + corner;
  out.position = vec4f(at.x / scene.view.x * 2.0 - 1.0, 1.0 - at.y / scene.view.y * 2.0, 0.5, 1.0);
  out.local = corner;
  out.shape = vec4f(size, blur, frame, pixel);
  out.light = vec4f(b.x, a.w, 0.0, 0.0);
  return out;
}

fn bar(value: f32, edge: f32, soft: f32) -> f32 {
  return clamp((edge - value) / soft + 0.5, 0.0, 1.0);
}

@fragment
fn fs_main(in: MarkerOut) -> @location(0) vec4f {
  let size = in.shape.x;
  let blur = in.shape.y;
  let frame = in.shape.z;
  let pixel = in.shape.w;
  let q = abs(in.local);
  let soft = 1.0 + blur;
  let thick = 0.6 * pixel + blur * 0.5;
  let energy = (0.6 * pixel) / thick;
  var cover = 0.0;
  if (scene.marker.x < 0.5) {
    let across = bar(q.x, size, soft) * bar(q.y, thick, soft);
    let down = bar(q.y, size, soft) * bar(q.x, thick, soft);
    cover = max(across, down) * energy;
  } else {
    cover = bar(length(in.local), size * 0.42 + blur * 0.3, soft) * mix(1.0, energy, 0.6);
  }
  if (frame > 0.001) {
    let edge = size * 2.3;
    let span = edge * 0.45;
    let line = 0.5 * pixel;
    let sides = bar(abs(q.x - edge), line, 1.0) * bar(edge - span - q.y, 0.0, 1.0) * bar(q.y - edge - line, 0.0, 1.0);
    let caps = bar(abs(q.y - edge), line, 1.0) * bar(edge - span - q.x, 0.0, 1.0) * bar(q.x - edge - line, 0.0, 1.0);
    cover = max(cover, max(sides, caps) * frame * 0.85);
  }
  let glow = in.light.x;
  let fade = in.light.y;
  let tint = mix(scene.shard.rgb, scene.accent.rgb, 0.4);
  if (scene.up.w > 0.5) {
    let ink = (1.0 - exp(-glow * 1.6)) * 0.85 * cover * fade;
    return vec4f(mix(tint, scene.accent.rgb, 0.5) * 0.55 * ink, ink);
  }
  let light = cover * glow * fade;
  let color = (1.0 - exp(-mix(tint, vec3f(1.0), 0.35) * light * 1.6)) * 1.4;
  return vec4f(color, max(max(color.r, color.g), color.b) * 0.8);
}
`,He=`
struct Bloom { texel: vec4f }
@group(0) @binding(0) var source: texture_2d<f32>;
@group(0) @binding(1) var linearSampler: sampler;
@group(0) @binding(2) var<uniform> bloom: Bloom;

fn bright(uv: vec2f) -> vec3f {
  let color = textureSampleLevel(source, linearSampler, uv, 0.0).rgb;
  let peak = max(max(color.r, color.g), color.b);
  return color * smoothstep(bloom.texel.z, bloom.texel.z + bloom.texel.w, peak);
}

@fragment
fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let o = bloom.texel.xy;
  let total = bright(uv + vec2f(o.x, o.y)) + bright(uv + vec2f(-o.x, o.y)) + bright(uv + vec2f(o.x, -o.y)) + bright(uv - o);
  return vec4f(total * 0.25, 0.0);
}
`,Ue=`
struct Bloom { texel: vec4f }
@group(0) @binding(0) var source: texture_2d<f32>;
@group(0) @binding(1) var linearSampler: sampler;
@group(0) @binding(2) var<uniform> bloom: Bloom;

@fragment
fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let o = bloom.texel.xy;
  var color = textureSampleLevel(source, linearSampler, uv, 0.0) * 0.25;
  color += textureSampleLevel(source, linearSampler, uv + vec2f(o.x, o.y), 0.0) * 0.1875;
  color += textureSampleLevel(source, linearSampler, uv + vec2f(-o.x, o.y), 0.0) * 0.1875;
  color += textureSampleLevel(source, linearSampler, uv + vec2f(o.x, -o.y), 0.0) * 0.1875;
  color += textureSampleLevel(source, linearSampler, uv - o, 0.0) * 0.1875;
  return color;
}
`,We=`
struct Bloom { texel: vec4f }
@group(0) @binding(0) var source: texture_2d<f32>;
@group(0) @binding(1) var linearSampler: sampler;
@group(0) @binding(2) var<uniform> bloom: Bloom;

@fragment
fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let delta = bloom.texel.xy;
  var color = textureSampleLevel(source, linearSampler, uv, 0.0) * 0.181862;
  color += (textureSampleLevel(source, linearSampler, uv + delta * 1.423135, 0.0) + textureSampleLevel(source, linearSampler, uv - delta * 1.423135, 0.0)) * 0.284316;
  color += (textureSampleLevel(source, linearSampler, uv + delta * 3.326702, 0.0) + textureSampleLevel(source, linearSampler, uv - delta * 3.326702, 0.0)) * 0.106598;
  color += (textureSampleLevel(source, linearSampler, uv + delta * 5.242989, 0.0) + textureSampleLevel(source, linearSampler, uv - delta * 5.242989, 0.0)) * 0.018156;
  return color;
}
`,Ge=`
struct Finish {
  info: vec4f,
  paper: vec4f,
  mode: vec4f,
}
@group(0) @binding(0) var sceneTexture: texture_2d<f32>;
@group(0) @binding(1) var linearSampler: sampler;
@group(0) @binding(2) var bloom0: texture_2d<f32>;
@group(0) @binding(3) var bloom1: texture_2d<f32>;
@group(0) @binding(4) var bloom2: texture_2d<f32>;
@group(0) @binding(5) var bloom3: texture_2d<f32>;
@group(0) @binding(6) var<uniform> finish: Finish;

fn hash12(value: vec2f) -> f32 {
  let p = fract(value * vec2f(0.1031, 0.1030));
  let mixed = p + dot(p, p.yx + 33.33);
  return fract((mixed.x + mixed.y) * mixed.x);
}

fn smootherstep(x: f32) -> f32 {
  let t = clamp(x, 0.0, 1.0);
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

@fragment
fn fs_main(@location(0) uv: vec2f, @builtin(position) pixel: vec4f) -> @location(0) vec4f {
  let scene = textureLoad(sceneTexture, vec2i(pixel.xy), 0);
  let alpha = clamp(scene.a, 0.0, 1.0);
  let noise = hash12(floor(pixel.xy) + vec2f(finish.info.y, finish.info.y * 1.618)) - 0.5;
  let grain = 1.0 + noise * finish.info.x;
  var rgb = vec3f(0.0);
  var a = alpha;
  if (finish.mode.x > 0.5) {
    rgb = clamp(scene.rgb, vec3f(0.0), vec3f(alpha)) * grain;
  } else {
    var halo = textureSampleLevel(bloom0, linearSampler, uv, 0.0).rgb * 0.4;
    halo += textureSampleLevel(bloom1, linearSampler, uv, 0.0).rgb * 0.3;
    halo += textureSampleLevel(bloom2, linearSampler, uv, 0.0).rgb * 0.2;
    halo += textureSampleLevel(bloom3, linearSampler, uv, 0.0).rgb * 0.1;
    halo = halo * finish.info.z;
    rgb = (1.0 - exp(-max(scene.rgb, vec3f(0.0)) * finish.info.w)) * grain + halo / (1.0 + halo);
    a = max(alpha, max(max(rgb.r, rgb.g), rgb.b));
  }
  let vignette = finish.mode.y;
  if (vignette > 0.0) {
    let size = vec2f(textureDimensions(sceneTexture));
    let reach = max(vignette * 0.5 * min(size.x, size.y), 1.0);
    let fromEdge = min(pixel.xy, size - pixel.xy);
    let mask = smootherstep(fromEdge.x / reach) * smootherstep(fromEdge.y / reach);
    rgb *= mask;
    a *= mask;
  }
  rgb = clamp(rgb, vec3f(0.0), vec3f(max(a, 0.0)));
  if (finish.paper.a > 0.5) {
    return vec4f(finish.paper.rgb * (1.0 - a) + rgb, 1.0);
  }
  return vec4f(rgb, a);
}
`,Ke=(e,t,n)=>Math.min(n,Math.max(t,e)),qe=e=>{let t=Ke(e,0,1);return t*t*t*(t*(t*6-15)+10)},Je=null,Ye=(e,t)=>{if(e===`transparent`)return null;if(typeof document>`u`||(Je||=document.createElement(`canvas`).getContext(`2d`),!Je))return t;Je.fillStyle=`#000000`,Je.fillStyle=e;let n=Je.fillStyle;if(n.startsWith(`#`)){let e=parseInt(n.slice(1),16);return[(e>>16&255)/255,(e>>8&255)/255,(e&255)/255]}let r=/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?/.exec(n);return r?r[4]!==void 0&&Number(r[4])===0?null:[Number(r[1])/255,Number(r[2])/255,Number(r[3])/255]:t},Xe=()=>typeof window<`u`&&(window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches??!1),Ze=(e,t,n,r)=>{let i=Math.imul(e+2654435769,2246822507)^Math.imul(t+1663821227,3266489909);return i^=Math.imul(n+668265263,374761393)^Math.imul(r+2135587861,2654435761),i=Math.imul(i^i>>>15,739982445),i=Math.imul(i^i>>>12,695872825),((i^i>>>15)>>>0)/4294967296},Qe=e=>()=>{e=e+1831565813|0;let t=Math.imul(e^e>>>15,1|e);return t=t+Math.imul(t^t>>>7,61|t)^t,((t^t>>>14)>>>0)/4294967296},$e=(e,t,n,r,i)=>{let a,o,s;if(e===0){a=-1.32+2.64*n;let e=Pe[t];o=e[0]+(e[1]-e[0])*n+.1*Math.sin(n*$*.7+t*2.3)+.045*Math.sin(n*$*1.9+t),s=Q[t]+.35*Math.sin(n*Math.PI*1.4+t*1.9)}else if(e===3){let e=n*$+t*.9+Math.PI*.5,r=Ie[t];a=Math.cos(e)*r[0],o=Math.sin(e)*r[1]-.02,s=Q[t]*1.1-Math.sin(e)*(.5+t*.25)}else{let r=e===1?-1:1;o=1.32-2.64*n,a=r*(Fe[t]+.1*Math.sin(n*$*.6+t*1.3)+.03*Math.sin(n*$*2.1+t)-.08*(1-n)),s=Q[t]+.3*Math.sin(n*Math.PI*1.2+t)}return i[0]=a*r*s/ye,i[1]=o*s/ye,i[2]=ye-s,i},et=(e,t)=>{let n=Qe(t),r=[],i=0;for(let t=0;t<De;t+=1){let a=t===De-1?e-i:Math.round(e*we[t]);i+=a;for(let e=0;e<a;e+=1){let i=n()*2-1,o=n(),s=[];if(o<.55){let e=.17+n()*.15;s.push([1,(n()-.5)*.08]),s.push([-.5-n()*.25,e*(.8+n()*.4)]),s.push([-.5-n()*.25,-e*(.8+n()*.4)])}else if(o<.8){let e=.2+n()*.14;s.push([1,0]),s.push([(n()-.3)*.5,e]),s.push([-.55-n()*.2,(n()-.5)*.1]),s.push([(n()-.3)*.5,-e*(.8+n()*.4)])}else{let e=n()<.5?4:5,t=.4+n()*.3,r=n()*$;for(let i=0;i<e;i+=1){let a=r+(i+(n()-.5)*.6)*$/e;s.push([Math.cos(a),Math.sin(a)*t])}}let c=s.length,l=0,u=0;for(let e of s)l+=e[0]/c,u+=e[1]/c;let d=[];for(let e=0;e<5;e+=1){let t=s[Math.min(e,c-1)];d.push(t[0]-l,t[1]-u)}r.push({level:t,phase:(e+n())/Math.max(a,1),lane:Math.sign(i)*Math.abs(i)**.85,layer:Math.sqrt(-2*Math.log(Math.max(n(),1e-6)))*Math.cos($*n()),size:.6+n()*n()*1.25,shape:d,sides:c,thickness:.06+n()*.04,yaw:(n()-.5)*.36,bank:(n()-.5)*.5,pitch:(n()-.5)*.24,tint:n(),drift:[n()*$,n()*$,n()*$],rate:[.3+n()*.35,.25+n()*.35,.3+n()*.3],flutter:[n()*$,.5+n()*.5],arrive:n(),sign:n()<.5?-1:1,slot:[n()*$,.06+.3*Math.sqrt(n()),n()-.5,n()<.85?1:-1],offset:[0,0,0],velocity:[0,0,0],tilt:0,tiltVelocity:0,flash:0,gather:0,joined:!1,position:[0,0,0],s:0})}}return r};function tt({shardColor:e=`#896ABD`,accentColor:t=`#A855F7`,backgroundColor:n=`transparent`,lightMode:r=!1,placement:i=`full`,material:a=`glass`,count:o=1300,shardSize:s=1,spread:c=1,twist:v=1,billow:y=1,speed:b=1,scale:x=1,depthOfField:S=.75,glow:C=.35,grain:w=.06,vignette:T=.3,intro:E=!0,mouseInteraction:D=!0,mouseStrength:O=.6,markers:k=`plus`,pulseOnClick:A=!0,holdToGather:j=!0,parallax:M=.5,paused:N=!1,dpr:P=2,disperse:F=!1,className:L=``,style:ee,onError:z}){let te=(0,I.useRef)(null),B=(0,I.useRef)(z);B.current=z;let V={shard:Ye(e,[.54,.42,.74])??[.54,.42,.74],accent:Ye(t,[.66,.33,.97])??[.66,.33,.97],paper:Ye(n,null),lightMode:r,placement:Math.max(0,he.indexOf(i)),material:ge[a]??ge.glass,count:Math.round(Ke(o,100,6e3)),shardSize:Ke(s,.2,4),spread:Ke(c,0,3),twist:Ke(v,0,3),billow:Ke(y,0,3),speed:Ke(b,0,4),scale:Ke(x,.4,2.5),depthOfField:Ke(S,0,1),glow:Ke(C,0,2),grain:Ke(w,0,.5),vignette:Ke(T,0,1),intro:E,mouseInteraction:D,mouseStrength:Ke(O,0,1),markers:Oe[k]??-1,pulseOnClick:A,holdToGather:j,parallax:Ke(M,0,1),paused:N,dpr:Math.max(.5,P),disperse:!!F},H=(0,I.useRef)(V);return H.current=V,(0,I.useEffect)(()=>{let e=te.current;if(!e)return;let t=document.createElement(`canvas`);t.className=me,e.appendChild(t);let n=!1,r=null,i=0,a=[],o=e=>{n||(n=!0,cancelAnimationFrame(i),r?.dispose(),r=null,B.current?.(e instanceof Error?e:Error(String(e))))};return(async()=>{if(typeof navigator>`u`||!(`gpu`in navigator))throw Error(`WebGPU is not available`);let s=await _({powerPreference:`high-performance`});if(r=s,n){s.dispose();return}a.push(s.onError(o));let c=navigator.gpu.getPreferredCanvasFormat(),v=()=>{let t=Math.min(window.devicePixelRatio||1,H.current.dpr);return[Math.max(1,Math.round(e.clientWidth*t)),Math.max(1,Math.round(e.clientHeight*t))]},y=f(s,t,{autoResize:!1,size:v(),format:c,alphaMode:`premultiplied`}),b=u(s,{minFilter:`linear`,magFilter:`linear`,addressModeU:`clamp-to-edge`,addressModeV:`clamp-to-edge`}),x=d(s,{size:y.size,format:`rgba16float`}),S=e=>[Math.max(1,Math.round(y.size[0]/2**(e+1))),Math.max(1,Math.round(y.size[1]/2**(e+1)))],C=Array.from({length:Ne},(e,t)=>({main:d(s,{size:S(t),format:`rgba16float`}),spare:d(s,{size:S(t),format:`rgba16float`})})),w=p(s,{view:[1,1,1,0],eye:[0,0,ye,be],forward:[0,0,-1,0],right:[1,0,0,0],up:[0,1,0,0],shard:[.54,.42,.74,.5],accent:[.66,.33,.97,0],marker:[0,1,4,ye],surface:[7,0,0,2.4]}),T=0,E=null,D=new Float32Array,O=g(s,{shader:Ve,vertices:6,cull:`none`,depth:!1,blend:`premultiplied`,label:`aero-shards-markers`}),k=e=>{e<=T&&E||(T=Math.max(e,512),D=new Float32Array(T*ke),E=h(s,D.byteLength,`read`),O.set({scene:w,markers:E}))};k(512);let A=e=>[Math.max(1,Math.round(y.size[0]*e)),Math.max(1,Math.round(y.size[1]*e))],j=Se.map((e,t)=>({scale:e,layer:d(s,{size:A(e),format:`rgba16float`,depth:`depth32float`}),shaded:d(s,{size:A(e),format:`rgba16float`}),temp:d(s,{size:t===0?[1,1]:A(e),format:`rgba16float`}),blurred:d(s,{size:t===0?[1,1]:A(e),format:`rgba16float`}),softReady:t!==0})),M=Q.map(()=>p(s,{view:[1,1,1,0],look:[.7,0,0,0]})),N=Q.map(()=>p(s,{texel:[0,0,0,0]})),P=Q.map(()=>p(s,{texel:[0,0,0,0]})),F=Q.map(()=>p(s,{info:[1,0,0,0]})),I=Q.map(()=>p(s,{info:[0,0,0,0],more:[0,0,0,0]})),L=Q.map((e,t)=>g(s,{shader:Le,entry:{fragment:`fs_solid`},vertices:6,cull:`none`,depth:{write:!0,compare:`less`},label:`aero-shards-solid-${t}`})),R=Q.map((e,t)=>g(s,{shader:Le,entry:{fragment:`fs_edge`},vertices:6,cull:`none`,depth:{write:!1,compare:`less`},blend:`premultiplied`,label:`aero-shards-edge-${t}`})),ee=Q.map((e,t)=>j.map((e,n)=>({shadow:m(s,ze,{label:`aero-shards-shadow-${t}-${n}`,set:{source:e.layer,depthMap:e.layer.depth,shadeInfo:I[t]}}),blurX:m(s,Re,{label:`aero-shards-depth-x-${t}-${n}`,set:{source:e.shaded,linearSampler:b,spreadInfo:N[t]}}),blurY:m(s,Re,{label:`aero-shards-depth-y-${t}-${n}`,set:{source:e.temp,linearSampler:b,spreadInfo:P[t]}}),sharp:m(s,Be,{label:`aero-shards-sharp-${t}-${n}`,blend:`premultiplied`,set:{source:e.shaded,linearSampler:b,mixInfo:F[t]}}),soft:m(s,Be,{label:`aero-shards-soft-${t}-${n}`,blend:`premultiplied`,set:{source:e.blurred,linearSampler:b,mixInfo:F[t]}})}))),z=0,te=null,B=new Float32Array,V=new Float32Array,ne=new Float32Array,re=e=>{e<=z&&te||(z=Math.max(e,256),B=new Float32Array(z*_e),V=new Float32Array(z*_e),ne=new Float32Array(z),te=h(s,B.byteLength,`read`),Q.forEach((e,t)=>{L[t].set({scene:w,shards:te,layerInfo:M[t]}),R[t].set({scene:w,shards:te,layerInfo:M[t]})}))};re(H.current.count);let ie=C.map((e,t)=>{let n=t===0?x:C[t-1].main,r=p(s,{texel:[0,0,0,0]}),i=p(s,{texel:[0,0,0,0]}),a=p(s,{texel:[0,0,0,0]});return{source:n,level:e,downParams:r,horizontalParams:i,verticalParams:a,down:m(s,t===0?He:Ue,{label:`aero-shards-down-${t}`,set:{source:n,linearSampler:b,bloom:r}}),horizontal:m(s,We,{label:`aero-shards-blur-x-${t}`,set:{source:e.main,linearSampler:b,bloom:i}}),vertical:m(s,We,{label:`aero-shards-blur-y-${t}`,set:{source:e.spare,linearSampler:b,bloom:a}})}}),U=p(s,{info:[0,0,0,1],paper:[0,0,0,0],mode:[0,0,0,0]}),ae=m(s,Ge,{label:`aero-shards-finish`,set:{sceneTexture:x,linearSampler:b,bloom0:C[0].main,bloom1:C[1].main,bloom2:C[2].main,bloom3:C[3].main,finish:U}});if(await Promise.all([...L.map(e=>e.compile(j[0].layer)),...R.map(e=>e.compile(j[0].layer)),...ee.flatMap(e=>e.flatMap((e,t)=>[e.shadow.compile(j[t].shaded),e.blurX.compile(j[t].temp),e.blurY.compile(j[t].blurred),e.sharp.compile(x),e.soft.compile(x)])),O.compile(x),ae.compile({colors:[c]}),...ie.flatMap((e,t)=>[e.down.compile(C[t].main),e.horizontal.compile(C[t].spare),e.vertical.compile(C[t].main)])]),n)return;let oe=Array.from({length:De},()=>({position:new Float32Array(480),tangent:new Float32Array(480),across:new Float32Array(480),lift:new Float32Array(480),length:1})),W=[0,0,0,0,0],se=[0,0,0,0,0],G=new Float32Array(483),K=new Float32Array(161),q=[0,0,0],ce=``,J={visible:!1,clock:0,last:0,travel:new Float64Array(De),roll:0,twist:0,drift:0,introAt:-1,weights:he.map((e,t)=>+(t===H.current.placement)),weightVelocity:[0,0,0,0],shards:et(H.current.count,1337),order:[],pointer:[.5,.5],inside:!1,presence:0,yaw:0,pitch:0,yawVelocity:0,pitchVelocity:0,pressAt:-1,pressPoint:null,holding:!1,hold:0,reach:0,gatherCenter:[0,0,0],rings:[],markerDrift:0,markerTarget:``,markerTotal:0,targets:new Map,quiet:0,seen:null,disperseStartTime:-1},le=e=>{let t=J.weights[3]>.999,n=`${e.toFixed(4)}|${J.weights.map(e=>e.toFixed(4)).join(`,`)}`;if(n===ce)return t;ce=n;for(let t=0;t<De;t+=1){let n=oe[t],r=0;for(let n=0;n<=ve;n+=1){let i=n/ve,a=0,o=0,s=0;for(let n=0;n<4;n+=1){let r=J.weights[n];r<1e-4||($e(n,t,i,e,q),a+=q[0]*r,o+=q[1]*r,s+=q[2]*r)}G[n*3]=a,G[n*3+1]=o,G[n*3+2]=s,n>0&&(r+=Math.hypot(a-G[n*3-3],o-G[n*3-2],s-G[n*3-1])),K[n]=r}n.length=Math.max(r,.001);let i=0;for(let e=0;e<ve;e+=1){let t=e/159*r;for(;i<159&&K[i+1]<t;)i+=1;let a=Math.max(K[i+1]-K[i],1e-6),o=Ke((t-K[i])/a,0,1);for(let t=0;t<3;t+=1)n.position[e*3+t]=G[i*3+t]+(G[i*3+3+t]-G[i*3+t])*o}let a=0,o=1,s=0;for(let e=0;e<ve;e+=1){let t=Math.max(0,e-1),r=Math.min(159,e+1),i=n.position[r*3]-n.position[t*3],c=n.position[r*3+1]-n.position[t*3+1],l=n.position[r*3+2]-n.position[t*3+2],u=Math.hypot(i,c,l)||1;i/=u,c/=u,l/=u,e===0&&(a=-c,o=i,s=0);let d=a*i+o*c+s*l;a-=i*d,o-=c*d,s-=l*d;let f=Math.hypot(a,o,s)||1;a/=f,o/=f,s/=f,n.tangent[e*3]=i,n.tangent[e*3+1]=c,n.tangent[e*3+2]=l,n.across[e*3]=a,n.across[e*3+1]=o,n.across[e*3+2]=s,n.lift[e*3]=c*s-l*o,n.lift[e*3+1]=l*a-i*s,n.lift[e*3+2]=i*o-c*a}}return t},Y=()=>{let e=v();(e[0]!==y.size[0]||e[1]!==y.size[1])&&(y.resize(e),x.resize(e),j.forEach(e=>{e.layer.resize(A(e.scale)),e.shaded.resize(A(e.scale)),e.softReady&&(e.temp.resize(A(e.scale)),e.blurred.resize(A(e.scale)))}),C.forEach((e,t)=>{e.main.resize(S(t)),e.spare.resize(S(t))}),ee.forEach(e=>e.forEach((e,t)=>e.shadow.set({depthMap:j[t].layer.depth}))),J.quiet=0)},ue=new ResizeObserver(Y);ue.observe(e),a.push(()=>ue.disconnect());let X={eye:[0,0,ye],forward:[0,0,-1],right:[1,0,0],up:[0,1,0],focal:1},de=e=>{let t=Math.cos(J.yaw),n=Math.sin(J.yaw),r=Math.cos(J.pitch),i=Math.sin(J.pitch);X.eye[0]=n*r*ye,X.eye[1]=i*ye,X.eye[2]=t*r*ye,X.forward[0]=-n*r,X.forward[1]=-i,X.forward[2]=-t*r;let a=Math.hypot(X.forward[2],X.forward[0])||1;X.right[0]=-X.forward[2]/a,X.right[1]=0,X.right[2]=X.forward[0]/a,X.up[0]=X.right[1]*X.forward[2]-X.right[2]*X.forward[1],X.up[1]=X.right[2]*X.forward[0]-X.right[0]*X.forward[2],X.up[2]=X.right[0]*X.forward[1]-X.right[1]*X.forward[0];let o=1;if(e.disperse&&J.disperseStartTime>=0){let e=J.clock-J.disperseStartTime;e<.25&&(o=1+.035*Math.sin(e/.25*Math.PI))}X.focal=y.size[1]*.5*ye*e.scale*o},Z=[0,0,1],fe=(e,t)=>{let n=(e-.5)*y.size[0],r=(.5-t)*y.size[1];Z[0]=X.forward[0]*X.focal+X.right[0]*n+X.up[0]*r,Z[1]=X.forward[1]*X.focal+X.right[1]*n+X.up[1]*r,Z[2]=X.forward[2]*X.focal+X.right[2]*n+X.up[2]*r;let i=Math.hypot(Z[0],Z[1],Z[2])||1;return Z[0]/=i,Z[1]/=i,Z[2]/=i,Z},pe=(t,n,r)=>{let i=y.size[0]/Math.max(y.size[1],1),a=le(i),o=t.intro&&!r,s=J.introAt<0?0:J.clock-J.introAt,c=t.disperse&&J.disperseStartTime>=0?J.clock-J.disperseStartTime:-1,l=t.mouseInteraction&&!r&&c<0?J.presence*t.mouseStrength:0,u=0,d=0,f=0;l>.001&&(fe(J.pointer[0],J.pointer[1]),u=Z[0],d=Z[1],f=Z[2]);let p=Math.max(1,Math.ceil(n/(1/120))),m=n/Math.max(p,1),h=y.size[1]*.5,g=J.rings.map(e=>{let t=e.age/Me;return{x:e.x,y:e.y,age:e.age,strength:(1-Math.exp(-e.age/.06))*(1-t)*(1-t)}}),_=(e,t,n,r)=>{let i=e-X.eye[0],a=t-X.eye[1],o=n-X.eye[2],s=Math.max(i*X.forward[0]+a*X.forward[1]+o*X.forward[2],.05);return r[0]=(i*X.right[0]+a*X.right[1]+o*X.right[2])*X.focal/s/h,r[1]=(i*X.up[0]+a*X.up[1]+o*X.up[2])*X.focal/s/h,s},v=(e,t,n)=>{let r=0;for(let i of g){let a=Math.max(0,i.age-n*.07)*2.3,o=Math.hypot(e-i.x,t-i.y);r+=Math.exp(-((o-a)*(o-a))/.012)*i.strength}return r},b=[0,0],x=J.shards,S=Math.min(1,t.twist);for(let e=0;e<x.length;e+=1){let r=x[e],i=r.level,h=oe[i],v=(r.phase+J.travel[i])%1,y=1,C=0;if(o){let e=Ke((s-(i*.22+Math.max(0,v-.1)*(2.4-(De-1)*.22)+r.arrive*.15))/.9,0,1);y=qe(e);let t=(1-e)*(1-e);v=a?v-t*.06:Math.max(0,v-t*.06),C=t*.9*r.sign}r.s=v;let w=(v%1+1)%1*159,T=Math.floor(w),E=Math.min(T+1,159),D=w-T,O=(e,t)=>e[T*3+t]+(e[E*3+t]-e[T*3+t])*D,k=O(h.position,0),A=O(h.position,1),j=O(h.position,2),M=O(h.tangent,0),N=O(h.tangent,1),P=O(h.tangent,2),F=O(h.across,0),I=O(h.across,1),L=O(h.across,2),R=O(h.lift,0),ee=O(h.lift,1),z=O(h.lift,2),te=t.twist*(v*$*.6+J.twist+i*1.7),B=Math.cos(te),H=Math.sin(te),re=F*B+R*H,ie=I*B+ee*H,U=L*B+z*H,ae=R*B-F*H,W=ee*B-I*H,se=z*B-L*H,G=Q[i]/ye,K=t.spread*(.15+.035*Q[i])*(.8+.3*Math.sin(v*$*1.3+i*.8)),q=r.lane*K,ce=r.layer*.012*G,le=a?1:qe(v/.12)*qe((1-v)/.12),Y=t.billow*.16*G*Math.sin(v*$*1.3-J.drift*.5+i*1.1)*(.4+.6*le),ue=t.billow*.06*G*Math.sin(v*$*.8-J.drift*.35+i*2.4),de=.009*G,Z=J.drift,fe=k+R*Y+F*ue+re*q+ae*ce+Math.sin(Z*r.rate[0]+r.drift[0])*de,pe=A+ee*Y+I*ue+ie*q+W*ce+Math.sin(Z*r.rate[1]+r.drift[1])*de,me=j+z*Y+L*ue+U*q+se*ce+Math.sin(Z*r.rate[2]+r.drift[2])*de,he=0,ge=0,ve=0,be=0,xe=fe+r.offset[0],Se=pe+r.offset[1],we=me+r.offset[2];if(l>.001){let e=xe-X.eye[0],n=Se-X.eye[1],r=we-X.eye[2],i=e*u+n*d+r*f,a=e-u*i,o=n-d*i,s=r-f*i,c=Math.hypot(a,o,s),p=.24*G/t.scale,m=Math.exp(-(c*c)/(p*p));if(m>.002&&c>1e-5){let e=a/c,t=o/c,n=s/c,r=(e*M+t*N+n*P)*.7,i=l*m*9*G;he+=(e-M*r)*i,ge+=(t-N*r)*i,ve+=(n-P*r)*i,be+=l*m*1.1*(e*F+t*I+n*L)}}if(J.hold>.001&&r.joined){let e=r.slot,i=e[0]+J.clock*(.8/(.12+e[1]))*e[3],a=e[1]/t.scale,o=J.gatherCenter[0]+Math.cos(i)*a,s=J.gatherCenter[1]+Math.sin(i)*a*.75,c=J.gatherCenter[2]+Math.sin(i)*a*.45+e[2]*.3;r.gather+=(J.hold-r.gather)*(1-Math.exp(-n/.3));let l=r.gather*30;he+=(o-xe)*l,ge+=(s-Se)*l,ve+=(c-we)*l,be+=r.gather*.6*Math.sin(i)}else r.gather+=(0-r.gather)*(1-Math.exp(-n/.2));if(g.length){_(xe,Se,we,b);for(let e of g){let t=Math.max(0,e.age-i*.07)*2.3,n=b[0]-e.x,a=b[1]-e.y,o=Math.hypot(n,a),s=Math.exp(-((o-t)*(o-t))/.012)*e.strength;if(s>.01){r.flash=Math.max(r.flash,s*.75);let e=Math.max(o,.05),t=(X.right[0]*n+X.up[0]*a)/e,i=(X.right[1]*n+X.up[1]*a)/e,c=(X.right[2]*n+X.up[2]*a)/e;be+=s*1.4*(t*F+i*I+c*L);let l=s*2.2*G/Math.max(o,.05);he+=(X.right[0]*n+X.up[0]*a)*l,ge+=(X.right[1]*n+X.up[1]*a)*l,ve+=(X.right[2]*n+X.up[2]*a)*l}}}if(c>=0){if(c<.25){let e=1-c/.25;r.flash=Math.max(r.flash,e*1.6)}if(!r.disperseVel){let t=Ze(r.level,e,17,37),n=Ze(r.level,e,29,53),i=Ze(r.level,e,43,71),a=t*$,o=(n-.5)*Math.PI*.75,s=i<.38,c=s?1:-1,l=s?1.6+t*2.8:1.2+n*3.6,u=4.8+i*7.2,d=1.4+n*2.4;r.disperseVel=[Math.cos(a)*Math.cos(o)*d*u,Math.sin(o)*d*u+(t-.5)*2.5,c*l*u],r.disperseRot=(t-.5)*16,r.disperseDelay=n*.12}if(c>.2){let e=Math.max(0,c-.2-r.disperseDelay);if(e>0){let t=e*e*15+e*4.5;r.offset[0]+=r.disperseVel[0]*t*n,r.offset[1]+=r.disperseVel[1]*t*n,r.offset[2]+=r.disperseVel[2]*t*n,r.tilt+=r.disperseRot*n*(1+e*3),r.pitch+=r.disperseVel[1]*.15*n,r.yaw+=r.disperseVel[0]*.15*n}}else{let e=24*(1-r.gather*.95);for(let t=0;t<p;t+=1)r.velocity[0]+=(he-e*r.offset[0]-7.5*r.velocity[0])*m,r.velocity[1]+=(ge-e*r.offset[1]-7.5*r.velocity[1])*m,r.velocity[2]+=(ve-e*r.offset[2]-7.5*r.velocity[2])*m,r.offset[0]+=r.velocity[0]*m,r.offset[1]+=r.velocity[1]*m,r.offset[2]+=r.velocity[2]*m,r.tiltVelocity+=(90*(be-r.tilt)-15*r.tiltVelocity)*m,r.tilt+=r.tiltVelocity*m}}else{let e=24*(1-r.gather*.95);for(let t=0;t<p;t+=1)r.velocity[0]+=(he-e*r.offset[0]-7.5*r.velocity[0])*m,r.velocity[1]+=(ge-e*r.offset[1]-7.5*r.velocity[1])*m,r.velocity[2]+=(ve-e*r.offset[2]-7.5*r.velocity[2])*m,r.offset[0]+=r.velocity[0]*m,r.offset[1]+=r.velocity[1]*m,r.offset[2]+=r.velocity[2]*m,r.tiltVelocity+=(90*(be-r.tilt)-15*r.tiltVelocity)*m,r.tilt+=r.tiltVelocity*m}r.flash*=Math.exp(-n/.45);let Ee=fe+r.offset[0],Oe=pe+r.offset[1],ke=me+r.offset[2];r.position[0]=Ee,r.position[1]=Oe,r.position[2]=ke;let Ae=X.eye[0]-Ee,je=X.eye[1]-Oe,Me=X.eye[2]-ke,Ne=Math.hypot(Ae,je,Me)||1;Ae/=Ne,je/=Ne,Me/=Ne;let Pe=M+r.velocity[0]*.05,Fe=N+r.velocity[1]*.05,Ie=P+r.velocity[2]*.05,Le=Pe*Ae+Fe*je+Ie*Me;Pe-=Ae*Le,Fe-=je*Le,Ie-=Me*Le;let Re=Math.hypot(Pe,Fe,Ie);Re<1e-4&&(Pe=X.right[0],Fe=X.right[1],Ie=X.right[2],Re=1),Pe/=Re,Fe/=Re,Ie/=Re;let ze=je*Ie-Me*Fe,Be=Me*Pe-Ae*Ie,Ve=Ae*Fe-je*Pe,He=r.yaw+.05*Math.sin(J.clock*r.flutter[1]*.7+r.flutter[0]),Ue=Math.cos(He),We=Math.sin(He),Ge=Pe*Ue+ze*We,Je=Fe*Ue+Be*We,Ye=Ie*Ue+Ve*We,Xe=ze*Ue-Pe*We,Qe=Be*Ue-Fe*We,$e=Ve*Ue-Ie*We,et=.8*S*Math.sin(te)+.3*Math.sin(v*$*1.6-J.roll*.55+i*.9+r.lane*.7),tt=.06*Math.sin(J.clock*r.flutter[1]+r.flutter[0]),nt=Ce*Math.tanh((et+r.bank+tt+r.tilt+C)/Ce),rt=Math.cos(nt),it=Math.sin(nt),at=Ae*rt+Xe*it,ot=je*rt+Qe*it,st=Me*rt+$e*it,ct=r.pitch+.2*Math.sin(v*$*1.1-J.roll*.4+i*2.1),lt=Math.cos(ct),ut=Math.sin(ct),dt=Ge*lt+at*ut,ft=Je*lt+ot*ut,pt=Ye*lt+st*ut,mt=at*lt-Ge*ut,ht=ot*lt-Je*ut,gt=st*lt-Ye*ut,_t=Ee-X.eye[0],vt=Oe-X.eye[1],yt=ke-X.eye[2],bt=_t*X.forward[0]+vt*X.forward[1]+yt*X.forward[2];ne[e]=bt;let xt=1-.45*r.lane*r.lane,St=1;if(c>1.05){let e=Math.min(1,(c-1.05)/.65);St=Math.cos(e*Math.PI*.5)}let Ct=.062*t.shardSize*r.size*Te[i]*y*Math.sqrt(le)*xt*St,wt=e*_e;V[wt]=Ee,V[wt+1]=Oe,V[wt+2]=ke,V[wt+3]=Ct>1e-5?Ct:0,V[wt+4]=dt,V[wt+5]=ft,V[wt+6]=pt,V[wt+7]=r.thickness,V[wt+8]=mt,V[wt+9]=ht,V[wt+10]=gt,V[wt+11]=r.tint;for(let e=0;e<10;e+=1)V[wt+12+e]=r.shape[e];V[wt+22]=r.sides,V[wt+23]=r.flash}let C=0;for(let e=0;e<De;e+=1)W[e]=0,se[e]=0;if(t.markers>=0&&(c<0||c<.2)){let a=y.size[1]/Math.max(e.clientHeight,1),c=(J.pointer[0]-.5)*2*i,l=(.5-J.pointer[1])*2,u=t.mouseInteraction&&!r?J.presence:0,d=J.targets,f=new Map,p=1-Math.exp(-n/.12),m=``,x=72;for(let e=De-1;e>=0;--e){se[e]=C;let n=Q[e],r=.42*(n/ye)**.55,y=i*n/(ye*t.scale)*1.12+r,S=n/(ye*t.scale)*1.12+r,w=J.markerDrift,E=Ae[e],O=Math.floor((w-y)/r-E[0]),A=Math.ceil((w+y)/r-E[0]),j=Math.floor(-S/r-E[1]),M=Math.ceil(S/r-E[1]),N=t.spread*(.15+.035*n)*1.4,P=oe[e].position;for(let t=O;t<=A;t+=1)for(let y=j;y<=M;y+=1){if(Ze(e,t,y,11)>.5)continue;let S=(t+E[0])*r-w,O=(y+E[1])*r,A=ye-n,j=_(S,O,A,b);if(Math.abs(b[0])>i*1.05||Math.abs(b[1])>1.05)continue;let M=1/0;for(let e=0;e<ve;e+=2){let t=S-P[e*3],n=O-P[e*3+1],r=A-P[e*3+2],i=t*t+n*n+r*r;i<M&&(M=i)}let F=Math.exp(-M/(N*N)),I=Ze(e,t,y,23),L=Ze(e,t,y,37),R=I<.07?.5+.5*Math.sin(J.clock*(1.4+L*2.2)+L*40):0,ee=Math.hypot(b[0]-c,b[1]-l)*h/a,z=`${e}:${t}:${y}`;e<=2&&u>.01&&ee<x&&(x=ee,m=z);let te=z===J.markerTarget?u*(1-qe((ee-30)/42)):0,B=d.get(z)??0,V=B+(te-B)*p;V>.002&&f.set(z,V);let H=Math.max(qe((R-.55)/.4),V),ne=0;g.length&&(ne=v(b[0],b[1],e));let re=1;if(o){let t=Ke((b[0]/i+1)*.5,0,1);re=qe((s-(e*.22+.35+t*(2.0999999999999996-(De-1)*.22)))/.5)}let ie=Ee[e]*(1-qe((j-3)/10)*.45)*re;if(ie<.002)continue;C>=T&&k(T*2);let U=C*ke;D[U]=S,D[U+1]=O,D[U+2]=A,D[U+3]=ie,D[U+4]=.42+.5*F+R*.9+V*1.3+ne*2.5,D[U+5]=H,D[U+6]=1+.15*F+.3*R+.2*V,D[U+7]=0,C+=1,W[e]+=1}}J.targets=f,J.markerTarget=m}J.markerTotal=C},me=(t,n,r)=>{de(t);let i=J.shards;re(i.length),pe(t,n,r),J.order.length!==i.length&&(J.order=i.map((e,t)=>t));let a=J.order;for(let e=0;e<i.length;e+=1)ne[e]+=i[e].level*100;for(let e=1;e<a.length;e+=1){let t=a[e],n=ne[t],r=e-1;for(;r>=0&&ne[a[r]]<n;)a[r+1]=a[r],--r;a[r+1]=t}let o=[0,0,0,0,0];for(let e=0;e<a.length;e+=1){let t=a[e]*_e,n=e*_e;o[i[a[e]].level]+=1;for(let e=0;e<_e;e+=1)B[n+e]=V[t+e]}te?.write(B.subarray(0,i.length*_e)),J.markerTotal>0&&E?.write(D.subarray(0,J.markerTotal*ke));let c=[0,0,0,0,0],u=0;for(let e=De-1;e>=0;--e)c[e]=u,u+=o[e];w.set({view:[y.size[0],y.size[1],X.focal,J.clock],eye:[X.eye[0],X.eye[1],X.eye[2],be],forward:[X.forward[0],X.forward[1],X.forward[2],t.depthOfField*y.size[1]*.03],right:[X.right[0],X.right[1],X.right[2],y.size[1]*.05],up:[X.up[0],X.up[1],X.up[2],+!!t.lightMode],shard:[...t.shard,0],accent:[...t.accent,0],surface:t.material,marker:[t.markers,y.size[1]/Math.max(e.clientHeight,1),4*(y.size[1]/Math.max(e.clientHeight,1)),be]}),ie.forEach(({downParams:e,horizontalParams:t,verticalParams:n,source:r,level:i})=>{e.set({texel:[.5/r.size[0],.5/r.size[1],.75,.5]}),t.set({texel:[1/i.main.size[0],0,0,0]}),n.set({texel:[0,1/i.main.size[1],0,0]})});let d=t.paper??[0,0,0],f=t.glow>.001&&!t.lightMode;U.set({info:[t.grain,Math.floor(J.clock*24),f?t.glow:0,1.3],paper:[d[0],d[1],d[2],+!!t.paper],mode:[+!!t.lightMode,t.vignette,0,0]});let p=t.depthOfField*y.size[1]*.012,m=y.size[1]*.02,h=Q.map((n,r)=>{let i=Math.min(p*Math.abs(1-xe/n),m),a=+(i>=2.2),o=j[a],s=i>=.45;s&&!o.softReady&&(o.softReady=!0,o.temp.resize(A(o.scale)),o.blurred.resize(A(o.scale)));let c=o.layer.size;M[r].set({view:[c[0],c[1],X.focal*(c[0]/y.size[0]),r],look:[t.lightMode?.5:.7,0,0,0]});let l=i*o.scale;N[r].set({texel:[1/c[0],0,l,0]}),P[r].set({texel:[0,1/c[1],l,0]}),F[r].set({info:[Ee[r],0,0,0]});let u=Math.max(.6,1.4*(c[0]/Math.max(e.clientWidth,1))),d=t.material===ge.glass?0:t.lightMode?.32:.62;return I[r].set({info:[u*.55,u*.85,d,0],more:[45e-5,0,0,0]}),{group:o,groupIndex:a,soft:s}});l(s,e=>{for(let t=De-1;t>=0;--t){let{group:n,groupIndex:r,soft:i}=h[t],a=ee[t][r];o[t]>0&&(e.pass({target:n.layer,clear:[0,0,0,0],clearDepth:1},e=>{e.draw(L[t],{instances:o[t],firstInstance:c[t]}),e.draw(R[t],{instances:o[t],firstInstance:c[t]})}),e.pass({target:n.shaded,clear:[0,0,0,0]},e=>e.draw(a.shadow)),i&&(e.pass({target:n.temp,clear:[0,0,0,0]},e=>e.draw(a.blurX)),e.pass({target:n.blurred,clear:[0,0,0,0]},e=>e.draw(a.blurY)))),e.pass({target:x,clear:t===De-1&&[0,0,0,0]},e=>{W[t]>0&&e.draw(O,{instances:W[t],firstInstance:se[t]}),o[t]>0&&e.draw(i?a.soft:a.sharp)})}ie.forEach((t,n)=>{let r=C[n];f?(e.pass({target:r.main,clear:[0,0,0,0]},e=>e.draw(t.down)),e.pass({target:r.spare,clear:[0,0,0,0]},e=>e.draw(t.horizontal)),e.pass({target:r.main,clear:[0,0,0,0]},e=>e.draw(t.vertical))):e.pass({target:r.main,clear:[0,0,0,0]},()=>{})}),e.pass({target:y,clear:[0,0,0,0]},e=>e.draw(ae))})},we=e=>{if(i=requestAnimationFrame(we),!J.visible||document.hidden){J.last=e;return}let t=H.current,n=J.last?Math.min((e-J.last)/1e3,.05):0;J.last=e;let r=Xe();J.clock+=n,J.introAt<0&&(J.introAt=J.clock),t.disperse&&J.disperseStartTime<0&&(J.disperseStartTime=J.clock),J.shards.length!==t.count&&(J.shards=et(t.count,1337),J.order=[]);let a=!t.paused&&!r;if(a){for(let e=0;e<De;e+=1)J.travel[e]=(J.travel[e]+n*t.speed*.09/oe[e].length)%1;J.roll+=n*t.speed*1,J.twist+=n*t.speed*.08,J.drift+=n*t.speed}let o=he.map((e,n)=>+(n===t.placement)),s=!1,c=Math.exp(-4*n);for(let e=0;e<4;e+=1){let t=J.weights[e]-o[e],r=J.weightVelocity[e]+4*t;J.weights[e]=o[e]+(t+r*n)*c,J.weightVelocity[e]=(J.weightVelocity[e]-4*r*n)*c,Math.abs(J.weights[e]-o[e])>5e-4&&(s=!0)}s||(J.weights=o,J.weightVelocity=[0,0,0,0]);let l=t.mouseInteraction&&J.inside&&!r;J.presence+=(+!!l-J.presence)*(1-Math.exp(-n/.25));let u=l?t.parallax:0,d=(J.pointer[0]-.5)*u*.14,f=(J.pointer[1]-.5)*u*.08;J.yawVelocity+=(38*(d-J.yaw)-11*J.yawVelocity)*n,J.pitchVelocity+=(38*(f-J.pitch)-11*J.pitchVelocity)*n,J.yaw+=J.yawVelocity*n,J.pitch+=J.pitchVelocity*n;let p=Math.abs(d-J.yaw)+Math.abs(f-J.pitch)>1e-4||Math.abs(J.yawVelocity)+Math.abs(J.pitchVelocity)>1e-4;if(J.pressAt>=0&&J.pressPoint&&t.holdToGather&&!r&&J.clock-J.pressAt>.18){if(!J.holding){J.holding=!0,de(t),fe(J.pressPoint[0],J.pressPoint[1]);let e=be/Math.max(Z[0]*X.forward[0]+Z[1]*X.forward[1]+Z[2]*X.forward[2],.2);J.gatherCenter=[X.eye[0]+Z[0]*e,X.eye[1]+Z[1]*e,X.eye[2]+Z[2]*e],J.reach=0}J.hold=Math.min(1,J.hold+n/.5),J.reach=Math.min(J.reach+n*.5,.55);let e=(.22+J.reach)/t.scale;for(let t of J.shards){if(t.joined||t.level>2)continue;let n=t.position[0]-J.gatherCenter[0],r=t.position[1]-J.gatherCenter[1];n*n+r*r<e*e&&(t.joined=!0)}}else if(J.hold>0&&(J.hold=Math.max(0,J.hold-n/.3),J.hold===0))for(let e of J.shards)e.joined=!1;for(let e of J.rings)e.age+=n;J.rings=J.rings.filter(e=>e.age<Me),a&&(J.markerDrift+=n*t.speed*.045);let m=J.shards.some(e=>e.flash>.01||Math.abs(e.tiltVelocity)>.01||Math.abs(e.tilt)>.01),h=s||p||m||J.presence>.002||J.rings.length>0||J.hold>0||t.disperse||t.intro&&!r&&J.clock-J.introAt<3.9;J.seen!==t||h||a?J.quiet=0:J.quiet+=1,J.seen=t,!(J.quiet>30)&&(Y(),me(t,n,r))},Oe=t=>{let n=e.getBoundingClientRect();return{point:[(t.clientX-n.left)/Math.max(n.width,1),(t.clientY-n.top)/Math.max(n.height,1)],inside:t.clientX>=n.left&&t.clientX<=n.right&&t.clientY>=n.top&&t.clientY<=n.bottom}},Pe=e=>{let t=Oe(e);J.inside=t.inside,t.inside&&(J.pointer=t.point)},Fe=()=>{J.inside=!1},Ie=e=>{let t=H.current;if(e.button!==0||Xe()||!t.mouseInteraction||e.target instanceof Element&&e.target.closest(`a, button, input, textarea, select, label, [role="button"]`))return;let n=Oe(e);n.inside&&(J.pointer=n.point,J.pressAt=J.clock,J.pressPoint=n.point)},Je=()=>{let e=H.current;if(!(J.pressAt<0)){if(!J.holding&&e.pulseOnClick&&J.pressPoint){let e=y.size[0]/Math.max(y.size[1],1);J.rings.push({x:(J.pressPoint[0]*2-1)*e,y:1-J.pressPoint[1]*2,age:0}),J.rings.length>je&&J.rings.shift()}if(J.holding)for(let e of J.shards)e.joined&&(e.tiltVelocity+=9*e.sign);J.pressAt=-1,J.holding=!1}};window.addEventListener(`pointermove`,Pe,{passive:!0}),window.addEventListener(`pointerdown`,Ie),window.addEventListener(`pointerup`,Je),window.addEventListener(`pointercancel`,Je),document.documentElement.addEventListener(`pointerleave`,Fe),a.push(()=>{window.removeEventListener(`pointermove`,Pe),window.removeEventListener(`pointerdown`,Ie),window.removeEventListener(`pointerup`,Je),window.removeEventListener(`pointercancel`,Je),document.documentElement.removeEventListener(`pointerleave`,Fe)});let Ye=new IntersectionObserver(e=>{J.visible=e.some(e=>e.isIntersecting)});Ye.observe(e),a.push(()=>Ye.disconnect()),i=requestAnimationFrame(we)})().catch(o),()=>{n=!0,cancelAnimationFrame(i),a.forEach(e=>e()),r?.dispose(),t.remove()}},[]),(0,R.jsx)(`div`,{ref:te,className:[pe,L].filter(Boolean).join(` `),style:ee})}var nt=`/assets/easybuilds_office_360.jpg`,rt=`/assets/office_front.jpg`,it=null,at=null;function ot(){return it||(it=new Promise(e=>{let t=new v;t.load(nt,t=>{t.colorSpace=w,t.wrapS=D,t.wrapT=j,t.minFilter=b,t.magFilter=M,t.generateMipmaps=!0,at=t,e(t)},void 0,()=>{t.load(rt,t=>{t.colorSpace=w,at=t,e(t)},void 0,()=>e(null))})}),it)}function st(e){return e<.5?4*e*e*e:1-(-2*e+2)**3/2}function ct(e={}){let t=e.canvas;if(!t)return console.error(`initStudioEngine: No canvas supplied`),{startCinematicEntrance(){},startCinematicTour(){},stopCinematicTour(){},isTourActive:()=>!1,isRotating:()=>!1,isFrontLocked:()=>!0,setCameraView(){},focusHotspot(){},openContactModal(){},closeContactModal(){},scheduleRender(){},dispose(){}};let n=new C;n.background=new T(461069);let r=t.getBoundingClientRect(),i=Math.max(Math.round(r.width),320),a=Math.max(Math.round(r.height),240),o=new N({canvas:t,antialias:!0,alpha:!1,powerPreference:`high-performance`,stencil:!1,depth:!0}),s=Math.min(window.devicePixelRatio||1,2);o.setPixelRatio(s),o.setSize(i,a,!1),o.outputColorSpace=w,o.toneMapping=0;let c=new x(62,i/a,.5,2e3);c.position.set(0,0,0),c.rotation.order=`YXZ`,c.rotation.x=0,c.rotation.z=0;function l(e,t){let n=e/t;return n<1.6?Math.min(72,Math.max(62,62+(1.6-n)*16)):62}c.fov=l(i,a),c.updateProjectionMatrix();let u=new y(500,500,Math.PI*500,128,1,!0);u.scale(-1,1,1);let d=u.attributes.position,f=u.attributes.uv,p=66*Math.PI/180;for(let e=0;e<d.count;e++){let t=(f.getX(e)-.5)*Math.PI*2;for(;t>Math.PI;)t-=Math.PI*2;for(;t<-Math.PI;)t+=Math.PI*2;let n=Math.abs(t);if(n<p){let r=n/p,i=Math.cos(r*Math.PI*.5)**2*.75,a=d.getX(e),o=d.getZ(e),s=500*Math.tan(t),c=a*(1-i)+s*i,l=o*(1-i)+-500*i;d.setX(e,c),d.setZ(e,l)}}d.needsUpdate=!0,u.computeVertexNormals();let m=document.createElement(`canvas`);m.width=2,m.height=2;let h=m.getContext(`2d`);h.fillStyle=`#080a0f`,h.fillRect(0,0,2,2);let g=new O(m);g.colorSpace=w;let _=new P({map:at||g,side:0,toneMapped:!1});at&&(at.anisotropy=Math.min(o.capabilities.getMaxAnisotropy(),16));let v=new E(u,_);v.position.set(0,-128,0),v.rotation.y=0,n.add(v),at?e.onSceneReady&&setTimeout(()=>{!Q&&e.onSceneReady&&e.onSceneReady()},0):ot().then(t=>{t&&!Q&&(t.anisotropy=Math.min(o.capabilities.getMaxAnisotropy(),16),_.map=t,_.needsUpdate=!0,e.onSceneReady&&e.onSceneReady(),Ee())});let b=[],D=new k;n.add(D);let j=new P({color:16777215,transparent:!0,opacity:0,depthWrite:!1,side:2}),M=new S(280,165),I=new E(M,j);I.position.set(60,-85,-485),I.rotation.y=0,I.userData={type:`contact`,label:`Primary Monitor • EasyBuilds Contact`},D.add(I),b.push(I);let L=new S(290,175),R=new E(L,j);R.position.set(-225,-80,-450),R.rotation.y=.28,R.userData={type:`contact`,label:`Left Monitor • EasyBuilds Contact`},D.add(R),b.push(R);let ee=new S(310,180),z=new E(ee,j);z.position.set(330,-80,-430),z.rotation.y=-.32,z.userData={type:`contact`,label:`Right Monitor • EasyBuilds Contact`},D.add(z),b.push(z);let te=new S(180,105),B=new E(te,j);B.position.set(-315,195,-500),B.rotation.y=.12,B.userData={type:`service`,serviceKey:`hosting`,label:`Hosting & Deployment`},D.add(B),b.push(B);let V=new S(180,105),H=new E(V,j);H.position.set(-315,95,-500),H.rotation.y=.12,H.userData={type:`service`,serviceKey:`uiux`,label:`UI / UX Design`},D.add(H),b.push(H);let ne=new S(185,110),re=new E(ne,j);re.position.set(370,205,-500),re.rotation.y=-.12,re.userData={type:`service`,serviceKey:`management`,label:`Website Management`},D.add(re),b.push(re);let ie=new S(185,110),U=new E(ie,j);U.position.set(370,100,-500),U.rotation.y=-.12,U.userData={type:`service`,serviceKey:`webdev`,label:`Website Development`},D.add(U),b.push(U);let ae=new A,oe=new F(-999,-999),W=0,se=!1,G=!1,K=0,q=0,ce=0,J=!1,le=!1,Y=null;function ue(e,t=1200,n=null){let r=W,i=(e-r)%(Math.PI*2);i>Math.PI&&(i-=Math.PI*2),i<-Math.PI&&(i+=Math.PI*2),Y={startTime:performance.now(),duration:t,startAngle:r,deltaAngle:i,targetYaw:e,onComplete:n},Ee()}function X(){let e=t.getBoundingClientRect(),n=Math.round(e.width),r=Math.round(e.height);n<=0||r<=0||(i=n,a=r,o.setSize(n,r,!1),c.aspect=n/r,c.fov=l(n,r),c.updateProjectionMatrix(),Ee())}window.addEventListener(`resize`,X,{passive:!0});function de(e,n){if(e===void 0||n===void 0)return null;let r=t.getBoundingClientRect();if(e<r.left||e>r.right||n<r.top||n>r.bottom)return null;oe.x=(e-r.left)/r.width*2-1,oe.y=-((n-r.top)/r.height)*2+1,c.updateMatrixWorld(!0),ae.setFromCamera(oe,c);let i=ae.intersectObjects(b,!1);return i.length>0?i[0].object.userData:null}function Z(e){le||(e.button===void 0||e.button===0)&&(Y=null,se=!0,G=!1,K=e.clientX,q=e.clientY,ce=W)}function fe(e){if(le)return;if(se){let n=e.clientX-K;if(!G&&Math.abs(n)>=6){G=!0,t.style.cursor=`grabbing`;try{t.setPointerCapture&&e.pointerId!==void 0&&t.setPointerCapture(e.pointerId)}catch{}}if(G){W=ce+n*.0028,c.rotation.y=W,Ee();return}}let n=!!de(e.clientX,e.clientY);n!==J&&(J=n,t.style.cursor=n?`pointer`:`grab`)}function pe(n){if(le||!se)return;try{t.releasePointerCapture&&n.pointerId!==void 0&&t.releasePointerCapture(n.pointerId)}catch{}let r=G,i=K,a=q;if(se=!1,G=!1,!r){let t=de(i,a);t&&(t.type===`service`&&e.onServiceTrigger?e.onServiceTrigger(t.serviceKey):e.onDeviceTrigger&&e.onDeviceTrigger(t.type))}t.style.cursor=J?`pointer`:`grab`}function me(e){if(!le&&e.touches.length===1){let t=e.touches[0];Z({clientX:t.clientX,clientY:t.clientY,pointerId:1,button:0})}}function he(e){if(!le&&e.touches.length===1&&se){let t=e.touches[0];fe({clientX:t.clientX,clientY:t.clientY,pointerId:1})}}function ge(e){if(e.changedTouches.length===1){let t=e.changedTouches[0];pe({clientX:t.clientX,clientY:t.clientY,pointerId:1})}}t.addEventListener(`pointerdown`,Z),window.addEventListener(`pointermove`,fe,{passive:!0}),window.addEventListener(`pointerup`,pe),t.addEventListener(`touchstart`,me,{passive:!0}),t.addEventListener(`touchmove`,he,{passive:!0}),t.addEventListener(`touchend`,ge),t.style.cursor=`grab`;function _e(e){e===`overview`||e===`workstation`||e===`front`?ue(0,800,()=>{W=0,c.rotation.y=0}):e===`right`||e===`shelves`?ue(Math.PI/2,850):e===`back`||e===`whiteboard`||e===`entrance`?ue(Math.PI,900):(e===`left`||e===`lounge`)&&ue(-Math.PI/2,850)}function ve(e){_e(e)}function ye(e=2200){ue(0,e,()=>{W=0,c.rotation.y=0,t.style.cursor=`grab`})}function be(e=null){ue(W+Math.PI*2,8e3,e)}function xe(){Y=null}function Se(){le=!0,Y=null,se=!1,G=!1,e.onModalTrigger&&e.onModalTrigger()}function Ce(){le=!1,J=!1,se=!1,G=!1,t.style.cursor=`grab`}window.__studioState={isDragging:()=>G,getCurrentYaw:()=>W,setYaw:e=>{W=e,c.rotation.y=e,Ee()}},window.__startStudioCinematicTour=()=>be(),window.__stopStudioCinematicTour=xe,window.__isStudioCinematicTourRunning=()=>!!Y;let Q=!1,we=null,Te=!0;function Ee(){Te=!0,!we&&!Q&&(we=requestAnimationFrame(De))}function De(e){if(Q){we=null;return}let t=!1;if(Y){t=!0;let n=e-Y.startTime,r=Math.min(n/Y.duration,1),i=st(r);if(W=Y.startAngle+Y.deltaAngle*i,r>=1){W=Y.targetYaw===void 0?Y.startAngle+Y.deltaAngle:Y.targetYaw;let e=Y.onComplete;Y=null,e&&e()}Te=!0}G&&(Te=!0),Te&&=(c.rotation.y=W,c.rotation.x=0,c.rotation.z=0,o.render(n,c),!1),we=t||G?requestAnimationFrame(De):null}return Ee(),{startEntrance:ye,startCinematicEntrance:ye,startCinematicTour:be,stopCinematicTour:xe,isTourActive:()=>!!Y,isRotating:()=>G,isFrontLocked:()=>!1,triggerRotation:()=>{},setCameraView:_e,focusHotspot:ve,openContactModal:Se,closeContactModal:Ce,scheduleRender:Ee,dispose(){Q=!0,Y=null,we&&=(cancelAnimationFrame(we),null),window.removeEventListener(`resize`,X),t.removeEventListener(`pointerdown`,Z),window.removeEventListener(`pointermove`,fe),window.removeEventListener(`pointerup`,pe),t.removeEventListener(`touchstart`,me),t.removeEventListener(`touchmove`,he),t.removeEventListener(`touchend`,ge),u.dispose(),_.dispose(),g.dispose(),M.dispose(),L.dispose(),ee.dispose(),te.dispose(),V.dispose(),ne.dispose(),ie.dispose(),j.dispose(),o.dispose()}}}var lt=8,ut=4,dt=2.2,ft=`#version 300 es
in vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`,pt=`#version 300 es
precision highp float;
precision highp int;
#define MAX_LAYERS ${lt}
#define MAX_COLORS ${ut}
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uFocal;
uniform vec2 uRotation;
uniform float uGloss;
uniform float uDepth;
uniform float uDensity;
uniform float uHueShift;
uniform float uSpeed;
uniform vec2 uMouse;
uniform float uStarGlow;
uniform float uFlareGain;
uniform float uSquash;
uniform float uSaturation;
uniform float uMouseRepulsion;
uniform float uTwinkleIntensity;
uniform float uRotationAngle;
uniform float uRepulsionStrength;
uniform float uMouseActiveFactor;
uniform float uAutoCenterRepulsion;
uniform int uLayers;
uniform vec3 uColors[${ut}];
uniform int uColorCount;
uniform float uWarp;
uniform float uReveal;
uniform float uMode;
uniform vec3 uBackground;
uniform float uOpacity;
out vec4 outColor;

#define STAR_COLOR_CUTOFF 0.2
#define MAT45 mat2(0.7071, -0.7071, 0.7071, 0.7071)
#define PERIOD 3.0

float Hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float tri(float x) {
  return abs(fract(x) * 2.0 - 1.0);
}

float tris(float x) {
  float t = fract(x);
  return 1.0 - smoothstep(0.0, 1.0, abs(2.0 * t - 1.0));
}

float trisn(float x) {
  float t = fract(x);
  return 2.0 * (1.0 - smoothstep(0.0, 1.0, abs(2.0 * t - 1.0))) - 1.0;
}

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

float Star(vec2 uv, float flare, vec2 radial, float invReach) {
#ifdef WARP
  float along = dot(uv, radial);
  float d = max(sqrt(max(dot(uv, uv) - uSquash * along * along, 0.0)), 0.001);
#else
  float d = max(length(uv), 0.001);
#endif
  float m = uStarGlow / d;
  float rays = smoothstep(0.0, 1.0, 1.0 - abs(uv.x * uv.y * 1000.0));
  m += rays * flare * uFlareGain;
  uv *= MAT45;
  rays = smoothstep(0.0, 1.0, 1.0 - abs(uv.x * uv.y * 1000.0));
  m += rays * 0.3 * flare * uFlareGain;
  m *= smoothstep(1.0, 0.2, d * invReach);
#ifdef WARP
  m *= mix(1.0, smoothstep(1.0, 0.55, length(uv) * invReach), min(uWarp * 4.0, 1.0));
#endif
  return clamp(m, 0.0, 20.0);
}

vec3 StarLayer(vec2 uv, vec2 radial, vec2 repelAt, float pushCells, float spread) {
  vec3 col = vec3(0.0);
  vec2 gv = fract(uv) - 0.5;
  vec2 id = floor(uv);
  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 offset = vec2(float(x), float(y));
      vec2 si = id + offset;
      float seed = Hash21(si);
      float size = fract(seed * 345.32);
      float glossLocal = tri(uGloss / (PERIOD * seed + 1.0));
      float flareSize = smoothstep(0.9, 1.0, size) * glossLocal;

#ifdef PALETTE
      float pick = Hash21(si + 7.0) * float(uColorCount);
      vec3 base = uColors[int(min(floor(pick), float(uColorCount - 1)))];
#else
      // Strictly neutral monochrome: pure white to subtle soft grey shades
      float shade = mix(0.60, 1.0, Hash21(si + 1.0));
      vec3 base = vec3(shade);
#endif

      vec2 pad = vec2(tris(seed * 34.0 + uTime * uSpeed / 10.0), tris(seed * 38.0 + uTime * uSpeed / 30.0)) - 0.5;
      vec2 shift = vec2(0.0);
      float invReach = 1.0;
#ifdef REPEL
      vec2 away = si + 0.5 + pad - repelAt;
      float dist = length(away);
      float q = dist * spread;
      float cells = pushCells * exp(-q * q);
      float moved = cells * inversesqrt(1.0 + cells * cells * 2.78);
      shift = away * (moved / max(dist, 0.0001));
      invReach = 1.0 / max(abs(1.0 - moved), 0.001);
#endif
      float star = Star(gv - offset - pad - shift, flareSize, radial, invReach);
      float twinkle = trisn(uTime * uSpeed + seed * 6.2831) * 0.5 + 1.0;
      twinkle = mix(1.0, twinkle, uTwinkleIntensity);
      col += star * twinkle * size * base;
    }
  }
  return col;
}

void main() {
  vec2 focalPx = uFocal * uResolution;
  vec2 uv = (gl_FragCoord.xy - focalPx) / uResolution.y;
  vec2 mouseNorm = uMouse - vec2(0.5);

  vec2 repelAt = vec2(0.0);
  float strength = 0.0;
  float push = 0.0;
  if (uAutoCenterRepulsion > 0.0) {
    strength = uAutoCenterRepulsion;
    push = strength * 0.05;
  } else if (uMouseRepulsion > 0.5) {
    repelAt = (uMouse * uResolution - focalPx) / uResolution.y;
    strength = max(uRepulsionStrength, 0.0);
    push = strength * 0.05 * uMouseActiveFactor;
  } else {
    uv += mouseNorm * 0.1 * uMouseActiveFactor;
  }
  float radius = 0.16 + 0.04 * strength;

  vec2 radial = length(uv) > 0.0001 ? normalize(uv) : vec2(1.0, 0.0);
  float angle = uRotationAngle;
  uv = mat2(cos(angle), -sin(angle), sin(angle), cos(angle)) * uv;
  uv = mat2(uRotation.x, -uRotation.y, uRotation.y, uRotation.x) * uv;
  radial = mat2(cos(angle), -sin(angle), sin(angle), cos(angle)) * radial;
  radial = mat2(uRotation.x, -uRotation.y, uRotation.y, uRotation.x) * radial;
  repelAt = mat2(cos(angle), -sin(angle), sin(angle), cos(angle)) * repelAt;
  repelAt = mat2(uRotation.x, -uRotation.y, uRotation.y, uRotation.x) * repelAt;

  vec3 col = vec3(0.0);
  float layers = float(uLayers);
  for (int k = 0; k < MAX_LAYERS; k++) {
    if (k >= uLayers) break;
    float i = float(k) / layers;
    float depth = fract(i + uDepth);
    float scale = mix(20.0 * uDensity, 0.5 * uDensity, depth);
    float fade = depth * smoothstep(1.0, 0.9, depth);
    vec2 offset = vec2(i * 453.32);
    col += StarLayer(uv * scale + offset, radial, repelAt * scale + offset, push * scale, 1.0 / (scale * radius)) * fade;
  }
  col *= uReveal;

  if (uMode > 1.5) {
    vec3 lit = col * smoothstep(0.0, 0.3, length(col));
    float energy = max(max(lit.r, lit.g), lit.b);
    vec3 tint = lit / max(energy, 0.0001);
    vec3 ink = tint * (0.16 / max(dot(tint, vec3(0.2126, 0.7152, 0.0722)), 0.16));
    float coverage = pow(min(energy * 1.3, 1.0), 1.3) * 0.92 * uOpacity;
    outColor = uMode > 2.5 ? vec4(ink * coverage, coverage) : vec4(mix(uBackground, ink, coverage), 1.0);
  } else if (uMode > 0.5) {
    float alpha = min(smoothstep(0.0, 0.3, length(col)), 1.0) * uOpacity;
    outColor = vec4(col * alpha, alpha);
  } else {
    outColor = vec4(mix(uBackground, col, uOpacity), 1.0);
  }
}`,mt=(e,t,n)=>Math.min(n,Math.max(t,e)),ht=(e,t,n)=>(e?4:0)+(t?2:0)+ +!!n,gt=(e,t,n,r)=>{let i=`${t?`#define PALETTE
`:``}${n?`#define REPEL
`:``}${r?`#define WARP
`:``}`,a=e.createProgram(),o=e.createShader(e.VERTEX_SHADER),s=e.createShader(e.FRAGMENT_SHADER);return!a||!o||!s?null:(e.shaderSource(o,ft),e.shaderSource(s,pt.replace(`
`,`\n${i}`)),e.compileShader(o),e.getShaderParameter(o,e.COMPILE_STATUS)||console.error(`[Galaxy] Vertex shader failed:`,e.getShaderInfoLog(o)),e.compileShader(s),e.getShaderParameter(s,e.COMPILE_STATUS)||console.error(`[Galaxy] Fragment shader failed:`,e.getShaderInfoLog(s)),e.attachShader(a,o),e.attachShader(a,s),e.bindAttribLocation(a,0,`aPosition`),e.linkProgram(a),e.getProgramParameter(a,e.LINK_STATUS)||console.error(`[Galaxy] Program link failed:`,e.getProgramInfoLog(a)),e.deleteShader(o),e.deleteShader(s),a)},_t=(e,t)=>{if(!e.getProgramParameter(t,e.LINK_STATUS))return console.error(`[Galaxy finish] Program not linked:`,e.getProgramInfoLog(t)),null;let n={},r=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let i=0;i<r;i++){let r=e.getActiveUniform(t,i);r&&(n[r.name.replace(`[0]`,``)]=e.getUniformLocation(t,r.name))}return console.log(`[Galaxy finish] Successfully linked shader with uniforms:`,Object.keys(n).length),{program:t,uniforms:n}},vt=({focal:e=[.5,.5],rotation:t=[1,0],starSpeed:n=.5,density:r=1,hueShift:i=140,disableAnimation:a=!1,speed:o=1,mouseInteraction:s=!0,glowIntensity:c=.3,saturation:l=0,mouseRepulsion:u=!0,repulsionStrength:d=2,twinkleIntensity:f=.3,rotationSpeed:p=.1,autoCenterRepulsion:m=0,transparent:h=!0,lightMode:g=!1,starColors:_,starSize:v=1,flareIntensity:y=1,layers:b=3,direction:x=`forward`,clickWarp:S=!0,intro:C=!0,backgroundColor:w,opacity:T=1,dpr:E=1,className:D=``,style:O,...k})=>{let A=(0,I.useRef)(null),j=(0,I.useRef)(null),M=(0,I.useRef)(null),N=Array.isArray(_)?_.filter(Boolean).slice(0,ut):[],P={focal:Array.isArray(e)?e:[.5,.5],rotation:Array.isArray(t)?t:[1,0],starSpeed:n,density:Math.max(.01,r),hueShift:i,disableAnimation:a,speed:o,mouseInteraction:s,glowIntensity:Math.max(0,c),saturation:Math.max(0,l),mouseRepulsion:u,repulsionStrength:d,twinkleIntensity:mt(f,0,1),rotationSpeed:p,autoCenterRepulsion:Math.max(0,m),transparent:h,lightMode:g,palette:N,starSize:Math.max(0,v),flareIntensity:Math.max(0,y),layers:mt(Math.round(b),2,lt),reverse:x===`backward`,clickWarp:S,intro:C,backgroundColor:w,opacity:mt(T,0,1),dpr:E},F=(0,I.useRef)(P);return F.current=P,(0,I.useEffect)(()=>{let e=A.current,t=j.current,n=t?.getContext(`webgl2`,{alpha:!0,premultipliedAlpha:!0,antialias:!1,depth:!1,stencil:!1});if(!e||!t||!n)return;let r=e=>{e.preventDefault(),console.warn(`[Galaxy] WebGL context loss safely caught`)};t.addEventListener(`webglcontextlost`,r);let i=n.getExtension(`KHR_parallel_shader_compile`),a=new Map,o=(e,t,r)=>{let i=ht(e,t,r),o=a.get(i);return o||(o={program:gt(n,e,t,r),linked:null,done:!1},a.set(i,o)),o},s=(e,t,r,a)=>{let s=o(e,t,r);if(!s.done&&s.program){if(!a&&i&&!n.getProgramParameter(s.program,i.COMPLETION_STATUS_KHR))return null;s.linked=_t(n,s.program),s.done=!0}return s.linked},c=F.current;if(!s(c.palette.length>0,!1,!1,!0)){a.forEach(e=>e.program&&n.deleteProgram(e.program));return}let l=n.createBuffer(),u=n.createVertexArray();n.bindVertexArray(u),n.bindBuffer(n.ARRAY_BUFFER,l),n.bufferData(n.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),n.STATIC_DRAW),n.enableVertexAttribArray(0),n.vertexAttribPointer(0,2,n.FLOAT,!1,0,0);let d=document.createElement(`canvas`).getContext(`2d`,{willReadFrequently:!0}),f=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches??!1,p=new Map,m=(e,t)=>{if(!e)return t;let n=String(e);if(p.has(n))return p.get(n);let r=t;if(d){d.clearRect(0,0,1,1),d.fillStyle=`#000000`,d.fillStyle=n,d.fillRect(0,0,1,1);let[e,t,i]=d.getImageData(0,0,1,1).data;r=[e/255,t/255,i/255]}return p.set(n,r),r},h=new Float32Array(12),g={x:.5,y:.5,inside:!1},_={time:0,gloss:0,depth:0,angle:0,mx:.5,my:.5,active:0,boost:0,reveal:F.current.intro&&!f?0:1},v=0,y=0,b=!0,x=()=>{let r=F.current;r.palette.forEach((e,t)=>h.set(m(e,[1,1,1]),t*3));let i=r.lightMode?r.transparent?3:2:+!!r.transparent,a=m(r.backgroundColor,r.lightMode?[1,1,1]:[0,0,0]),o=_.reveal,c=r.palette.length>0,l=r.autoCenterRepulsion>0||r.mouseRepulsion&&r.repulsionStrength>0&&_.active>0,d=_.boost>0,f=s(c,!1,!1,!0);if(!f)return;window.__galaxyLogged||(window.__galaxyLogged=!0,console.log(`[Galaxy render] first render canvas size:`,t.width,`x`,t.height,`container:`,e.clientWidth,`x`,e.clientHeight,`mode:`,i,`reveal:`,_.reveal));let p=(l||d?s(c,l,d,!1):null)??f,g=p.uniforms;n.viewport(0,0,t.width,t.height),n.useProgram(p.program),n.bindVertexArray(u),n.uniform1f(g.uTime,_.time),n.uniform2f(g.uResolution,t.width,t.height),n.uniform2f(g.uFocal,r.focal[0],r.focal[1]),n.uniform2f(g.uRotation,r.rotation[0],r.rotation[1]),n.uniform1f(g.uGloss,_.gloss),n.uniform1f(g.uDepth,_.depth),n.uniform1f(g.uDensity,r.density),n.uniform1f(g.uHueShift,r.hueShift),n.uniform1f(g.uSpeed,r.speed),n.uniform2f(g.uMouse,_.mx,_.my);let v=1+_.boost*5;n.uniform1f(g.uStarGlow,.05*r.glowIntensity*r.starSize/v**.6),n.uniform1f(g.uFlareGain,r.glowIntensity*r.flareIntensity),n.uniform1f(g.uSquash,1-1/(v*v)),n.uniform1f(g.uSaturation,r.saturation),n.uniform1f(g.uMouseRepulsion,+!!r.mouseRepulsion),n.uniform1f(g.uTwinkleIntensity,r.twinkleIntensity),n.uniform1f(g.uRotationAngle,_.angle),n.uniform1f(g.uRepulsionStrength,r.repulsionStrength),n.uniform1f(g.uMouseActiveFactor,_.active),n.uniform1f(g.uAutoCenterRepulsion,r.autoCenterRepulsion),n.uniform1i(g.uLayers,r.layers),n.uniform3fv(g.uColors,h),n.uniform1i(g.uColorCount,r.palette.length),n.uniform1f(g.uWarp,_.boost);let y=Math.min(1,o/.35);n.uniform1f(g.uReveal,y*y*(3-2*y)),n.uniform1f(g.uMode,i),n.uniform3fv(g.uBackground,a),n.uniform1f(g.uOpacity,r.opacity),n.drawArrays(n.TRIANGLES,0,3)},S=e=>{if(v=0,!b||document.hidden||F.current.disableAnimation)return;let t=F.current,n=y?mt((e-y)/1e3,5e-4,.05):1/60;y=e;let r=t.disableAnimation||f?0:1;t.intro&&!f&&_.reveal<1?(_.reveal=Math.min(1,_.reveal+n/dt),_.boost=Math.max(_.boost,(1-_.reveal)**2*1.4)):(!t.intro||f)&&(_.reveal=1);let i=t.starSpeed/10*(t.reverse?-1:1);_.time+=n*r,_.gloss+=n*i*r,_.depth+=n*i*t.speed*r*(1+_.boost*14),_.angle+=n*t.rotationSpeed*r,_.boost*=Math.exp(-n*1.3),_.boost<.001&&(_.boost=0);let a=1-Math.exp(-n/.325),o=t.mouseInteraction&&g.inside&&!f;o&&(_.mx+=(g.x-_.mx)*a,_.my+=(g.y-_.my)*a);let s=+!!o;_.active+=(s-_.active)*a,Math.abs(s-_.active)<.001&&(_.active=s),x(),r>0||_.boost>0||_.active!==s||_.reveal<1?v=requestAnimationFrame(S):y=0},C=()=>{!v&&b&&!document.hidden&&(v=requestAnimationFrame(S))},w=()=>{let n=F.current,r=Math.max(1,e.clientWidth),i=Math.max(1,e.clientHeight),a=Math.min(n.dpr||window.devicePixelRatio||1,2);t.width=Math.max(1,Math.round(r*a)),t.height=Math.max(1,Math.round(i*a)),x(),C()},T=t=>{let n=e.getBoundingClientRect(),r=t.clientX-n.left,i=t.clientY-n.top;g.inside=r>=0&&i>=0&&r<=n.width&&i<=n.height,g.x=r/Math.max(1,n.width),g.y=1-i/Math.max(1,n.height)},E=e=>{T(e),C()},D=e=>{let t=F.current;T(e),g.inside&&t.clickWarp&&!f&&(_.boost=Math.min(1.6,_.boost+1),C())},O=e=>{e.pointerType!==`mouse`&&(g.inside=!1)},k=()=>{g.inside=!1},N=()=>{y=0,C()},P=new ResizeObserver(w);P.observe(e);let I=new IntersectionObserver(e=>{b=e.some(e=>e.isIntersecting),b&&(y=0,C())});I.observe(e),window.addEventListener(`pointermove`,E,{passive:!0}),window.addEventListener(`pointerdown`,D,{passive:!0}),window.addEventListener(`pointerup`,O,{passive:!0}),window.addEventListener(`pointercancel`,O,{passive:!0}),document.documentElement.addEventListener(`pointerleave`,k),document.addEventListener(`visibilitychange`,N),w();let L=c.autoCenterRepulsion>0||c.mouseInteraction&&c.mouseRepulsion,R=c.palette.length>0;(c.clickWarp||c.intro)&&o(R,!1,!0),L&&o(R,!0,!1),L&&c.clickWarp&&o(R,!0,!0);let ee=F.current.dpr;return M.current=()=>{let e=F.current;e.dpr===ee?(v||x(),C()):(ee=e.dpr,w())},()=>{cancelAnimationFrame(v),M.current=null,P.disconnect(),I.disconnect(),window.removeEventListener(`pointermove`,E),window.removeEventListener(`pointerdown`,D),window.removeEventListener(`pointerup`,O),window.removeEventListener(`pointercancel`,O),document.documentElement.removeEventListener(`pointerleave`,k),document.removeEventListener(`visibilitychange`,N),t.removeEventListener(`webglcontextlost`,r),a.forEach(e=>e.program&&n.deleteProgram(e.program)),n.deleteBuffer(l),n.deleteVertexArray(u)}},[]),(0,I.useEffect)(()=>{M.current?.()}),(0,R.jsx)(`div`,{ref:A,className:`galaxy-container${D?` ${D}`:``}`,style:O,...k,children:(0,R.jsx)(`canvas`,{ref:j,className:`galaxy-canvas`,"aria-hidden":`true`,style:{pointerEvents:`none`}})})},yt={low:{sim:64,dye:512,iterations:10},medium:{sim:96,dye:1024,iterations:16},high:{sim:128,dye:1440,iterations:20}},bt=256,xt=4,St=.3,Ct=`splash-cursor`,wt=`splash-cursor__canvas`,Tt=`#version 300 es
precision highp float;
in vec2 aPosition;
uniform vec2 texelSize;
out vec2 vUv;
out vec2 vL;
out vec2 vR;
out vec2 vT;
out vec2 vB;
void main() {
  vUv = aPosition * 0.5 + 0.5;
  vL = vUv - vec2(texelSize.x, 0.0);
  vR = vUv + vec2(texelSize.x, 0.0);
  vT = vUv + vec2(0.0, texelSize.y);
  vB = vUv - vec2(0.0, texelSize.y);
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`,Et=`#version 300 es
precision highp float;
precision highp sampler2D;
in vec2 vUv;
in vec2 vL;
in vec2 vR;
in vec2 vT;
in vec2 vB;
out vec4 outColor;
`,Dt={copy:`uniform sampler2D uTexture;
void main() {
  outColor = texture(uTexture, vUv);
}`,clear:`uniform sampler2D uTexture;
uniform float value;
void main() {
  outColor = value * texture(uTexture, vUv);
}`,splat:`uniform sampler2D uTarget;
uniform float aspectRatio;
uniform vec3 color;
uniform vec2 pointA;
uniform vec2 pointB;
uniform float radius;
void main() {
  vec2 scale = vec2(aspectRatio, 1.0);
  vec2 pa = (vUv - pointA) * scale;
  vec2 ba = (pointB - pointA) * scale;
  float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-9), 0.0, 1.0);
  vec2 d = pa - ba * h;
  vec3 base = texture(uTarget, vUv).xyz;
  outColor = vec4(base + exp(-dot(d, d) / radius) * color, 1.0);
}`,burst:`uniform sampler2D uTarget;
uniform float aspectRatio;
uniform vec2 point;
uniform float radius;
uniform float strength;
uniform float seed;
void main() {
  vec2 d = (vUv - point) * vec2(aspectRatio, 1.0);
  float distance = length(d);
  vec2 direction = d / max(distance, 0.00001);
  float angle = atan(d.y, d.x);
  float petals = 0.78 + 0.22 * sin(angle * 5.0 + seed) * sin(angle * 3.0 - seed * 1.7);
  vec2 twist = vec2(-direction.y, direction.x) * 0.3 * sin(angle * 4.0 + seed * 2.3);
  float falloff = exp(-dot(d, d) / radius) * distance / sqrt(radius);
  outColor = vec4(texture(uTarget, vUv).xy + (direction * petals + twist) * falloff * strength, 0.0, 1.0);
}`,crown:`uniform sampler2D uTarget;
uniform float aspectRatio;
uniform vec2 point;
uniform float radius;
uniform vec3 colorA;
uniform vec3 colorB;
uniform float seed;
void main() {
  vec2 d = (vUv - point) * vec2(aspectRatio, 1.0);
  vec3 ink = exp(-dot(d, d) / (radius * 0.45)) * colorA;
  for (int i = 0; i < 7; i++) {
    float index = float(i);
    float angle = seed + index * 0.8975979 + sin(seed * 3.0 + index * 1.9) * 0.35;
    float reach = sqrt(radius) * (0.75 + 0.45 * fract(sin(seed * 7.1 + index * 3.7) * 43.7));
    float drop = radius * (0.08 + 0.12 * fract(sin(seed * 2.9 + index * 5.3) * 31.9));
    vec2 q = d - vec2(cos(angle), sin(angle)) * reach;
    ink += exp(-dot(q, q) / drop) * mix(colorA, colorB, fract(index * 0.37 + 0.2));
  }
  outColor = vec4(texture(uTarget, vUv).xyz + ink, 1.0);
}`,advection:`uniform sampler2D uVelocity;
uniform sampler2D uSource;
uniform vec2 texelSize;
uniform float dt;
uniform float dissipation;
void main() {
  vec2 coord = vUv - dt * texture(uVelocity, vUv).xy * texelSize;
  outColor = texture(uSource, coord) / (1.0 + dissipation * dt);
}`,divergence:`uniform sampler2D uVelocity;
void main() {
  float L = texture(uVelocity, vL).x;
  float R = texture(uVelocity, vR).x;
  float T = texture(uVelocity, vT).y;
  float B = texture(uVelocity, vB).y;
  vec2 C = texture(uVelocity, vUv).xy;
  if (vL.x < 0.0) L = -C.x;
  if (vR.x > 1.0) R = -C.x;
  if (vT.y > 1.0) T = -C.y;
  if (vB.y < 0.0) B = -C.y;
  outColor = vec4(0.5 * (R - L + T - B), 0.0, 0.0, 1.0);
}`,curl:`uniform sampler2D uVelocity;
void main() {
  float L = texture(uVelocity, vL).y;
  float R = texture(uVelocity, vR).y;
  float T = texture(uVelocity, vT).x;
  float B = texture(uVelocity, vB).x;
  outColor = vec4(0.5 * (R - L - T + B), 0.0, 0.0, 1.0);
}`,vorticity:`uniform sampler2D uVelocity;
uniform sampler2D uCurl;
uniform float curl;
uniform float dt;
void main() {
  float L = texture(uCurl, vL).x;
  float R = texture(uCurl, vR).x;
  float T = texture(uCurl, vT).x;
  float B = texture(uCurl, vB).x;
  float C = texture(uCurl, vUv).x;
  vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
  force /= length(force) + 0.0001;
  force *= curl * C;
  force.y *= -1.0;
  vec2 velocity = texture(uVelocity, vUv).xy + force * dt;
  outColor = vec4(clamp(velocity, -1000.0, 1000.0), 0.0, 1.0);
}`,pressure:`uniform sampler2D uPressure;
uniform sampler2D uDivergence;
void main() {
  float L = texture(uPressure, vL).x;
  float R = texture(uPressure, vR).x;
  float T = texture(uPressure, vT).x;
  float B = texture(uPressure, vB).x;
  float divergence = texture(uDivergence, vUv).x;
  outColor = vec4((L + R + B + T - divergence) * 0.25, 0.0, 0.0, 1.0);
}`,gradient:`uniform sampler2D uPressure;
uniform sampler2D uVelocity;
void main() {
  float L = texture(uPressure, vL).x;
  float R = texture(uPressure, vR).x;
  float T = texture(uPressure, vT).x;
  float B = texture(uPressure, vB).x;
  vec2 velocity = texture(uVelocity, vUv).xy - vec2(R - L, T - B);
  outColor = vec4(velocity, 0.0, 1.0);
}`,prefilter:`uniform sampler2D uTexture;
uniform vec3 curve;
uniform float threshold;
void main() {
  vec3 c = texture(uTexture, vUv).rgb;
  float br = max(c.r, max(c.g, c.b));
  float rq = clamp(br - curve.x, 0.0, curve.y);
  rq = curve.z * rq * rq;
  c *= max(rq, br - threshold) / max(br, 0.0001);
  outColor = vec4(c, 0.0);
}`,blur:`uniform sampler2D uTexture;
uniform float intensity;
void main() {
  vec4 sum = texture(uTexture, vL) + texture(uTexture, vR) + texture(uTexture, vT) + texture(uTexture, vB);
  outColor = sum * 0.25 * intensity;
}`,display:`uniform sampler2D uTexture;
uniform sampler2D uBloom;
uniform vec2 texelSize;
uniform float shading;
uniform float bloom;
uniform float light;
float hash(vec2 p) {
  vec3 q = fract(vec3(p.xyx) * 0.1031);
  q += dot(q, q.yzx + 33.33);
  return fract((q.x + q.y) * q.z);
}
void main() {
  vec3 c = texture(uTexture, vUv).rgb;
  if (shading > 0.0) {
    float dx = length(texture(uTexture, vR).rgb) - length(texture(uTexture, vL).rgb);
    float dy = length(texture(uTexture, vT).rgb) - length(texture(uTexture, vB).rgb);
    vec3 n = normalize(vec3(dx, dy, length(texelSize)));
    c *= mix(1.0, clamp(n.z + 0.7, 0.7, 1.0), shading);
  }
  if (bloom > 0.0) {
    c += max(texture(uBloom, vUv).rgb, 0.0) * bloom;
  }
  c = max(c, 0.0);
  float peak = max(c.r, max(c.g, c.b));
  float grain = (hash(gl_FragCoord.xy) - 0.5) / 255.0 * smoothstep(0.0, 0.03, peak);
  if (light > 0.5) {
    vec3 transmit = exp(-2.4 * c);
    float low = min(transmit.r, min(transmit.g, transmit.b));
    float alpha = clamp(1.0 - low + grain, 0.0, 1.0);
    outColor = vec4(min(transmit - low, vec3(alpha)), alpha);
  } else {
    c = max(c + grain, 0.0);
    float alpha = clamp(max(c.r, max(c.g, c.b)), 0.0, 1.0);
    outColor = vec4(min(c, vec3(alpha)), alpha);
  }
}`},Ot=(e,t,n)=>Math.min(n,Math.max(t,e)),kt=e=>{let t=String(e).replace(`#`,``).trim();t.length===3&&(t=[...t].map(e=>e+e).join(``));let n=parseInt(t.slice(0,6),16);return Number.isNaN(n)?[1,1,1]:[(n>>16&255)/255,(n>>8&255)/255,(n&255)/255]},At=(e,t,n)=>{let r=Math.floor(e*6),i=e*6-r,a=n*(1-t),o=n*(1-i*t),s=n*(1-(1-i)*t),c=(r%6+6)%6;return c===0?[n,s,a]:c===1?[o,n,a]:c===2?[a,n,s]:c===3?[a,o,n]:c===4?[s,a,n]:[n,a,o]};function jt({colors:e=[`#4f8cff`,`#2dd4bf`,`#ffd166`],rainbow:t=!0,colorSpeed:n=1,intensity:r=1,size:i=1,force:a=1,swirl:o=3,trail:s=1,momentum:c=1,shading:l=1,glow:u=0,quality:d=`high`,clickSplash:f=!0,intro:p=!0,contained:m=!1,theme:h=`dark`,zIndex:g=50,className:_=``,style:v}){let y=(0,I.useRef)(null),b=(0,I.useRef)(null),[x,S]=(0,I.useState)(0),C={palette:(Array.isArray(e)&&e.length?e:[`#ffffff`]).map(kt),rainbow:t,colorSpeed:Math.max(0,n),intensity:Math.max(0,r),size:Math.max(.05,i),force:Math.max(0,a),swirl:Math.max(0,o),trail:Math.max(.05,s),momentum:Math.max(.05,c),shading:Ot(l,0,1),glow:Ot(u,0,1),quality:yt[d]?d:`high`,clickSplash:f,contained:m,light:h===`light`},w=(0,I.useRef)(C);w.current=C;let T=(0,I.useRef)(p);return(0,I.useEffect)(()=>{let e=y.current?.parentElement;if(!m||!e||getComputedStyle(e).position!==`static`)return;let t=e.style.position;return e.style.position=`relative`,()=>{e.style.position=t}},[m]),(0,I.useEffect)(()=>{let e=b.current;if(!e)return;let t=e.getContext(`webgl2`,{alpha:!0,premultipliedAlpha:!0,antialias:!1,depth:!1,stencil:!1,preserveDrawingBuffer:!1});if(!t)return;t.getExtension(`EXT_color_buffer_float`),t.getExtension(`EXT_color_buffer_half_float`);let n=(e,n)=>{let r=t.createTexture();t.bindTexture(t.TEXTURE_2D,r),t.texImage2D(t.TEXTURE_2D,0,e,4,4,0,n,t.HALF_FLOAT,null);let i=t.createFramebuffer();t.bindFramebuffer(t.FRAMEBUFFER,i),t.framebufferTexture2D(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,r,0);let a=t.checkFramebufferStatus(t.FRAMEBUFFER)===t.FRAMEBUFFER_COMPLETE;return t.bindFramebuffer(t.FRAMEBUFFER,null),t.deleteFramebuffer(i),t.deleteTexture(r),a},r={internal:t.RGBA16F,format:t.RGBA};if(!n(r.internal,r.format))return;let i=n(t.RG16F,t.RG)?{internal:t.RG16F,format:t.RG}:r,a=n(t.R16F,t.RED)?{internal:t.R16F,format:t.RED}:i,o=(e,n)=>{let r=t.createShader(e);return t.shaderSource(r,n),t.compileShader(r),r},s=o(t.VERTEX_SHADER,Tt),c={},l=!1;Object.entries(Dt).forEach(([e,n])=>{let r=o(t.FRAGMENT_SHADER,Et+n),i=t.createProgram();t.attachShader(i,s),t.attachShader(i,r),t.bindAttribLocation(i,0,`aPosition`),t.linkProgram(i),t.deleteShader(r),t.getProgramParameter(i,t.LINK_STATUS)||(l=!0);let a={},u=t.getProgramParameter(i,t.ACTIVE_UNIFORMS);for(let e=0;e<u;e++){let n=t.getActiveUniform(i,e);n&&(a[n.name]=t.getUniformLocation(i,n.name))}c[e]={program:i,uniforms:a}}),t.deleteShader(s);let u=t.createBuffer(),d=t.createVertexArray();t.bindVertexArray(d),t.bindBuffer(t.ARRAY_BUFFER,u),t.bufferData(t.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),t.STATIC_DRAW),t.enableVertexAttribArray(0),t.vertexAttribPointer(0,2,t.FLOAT,!1,0,0);let f=new Set,p=!1,m=!1,h=()=>{t.isContextLost()||(f.forEach(e=>{t.deleteFramebuffer(e.fbo),t.deleteTexture(e.texture)}),f.clear(),Object.values(c).forEach(e=>t.deleteProgram(e.program)),t.deleteBuffer(u),t.deleteVertexArray(d))};if(l){h();return}let g=e=>{let n=c[e];return t.useProgram(n.program),n.uniforms},_=e=>{e?(t.viewport(0,0,e.width,e.height),t.bindFramebuffer(t.FRAMEBUFFER,e.fbo)):(t.viewport(0,0,t.drawingBufferWidth,t.drawingBufferHeight),t.bindFramebuffer(t.FRAMEBUFFER,null)),t.drawArrays(t.TRIANGLE_STRIP,0,4)},v=(e,n,r,i)=>{t.activeTexture(t.TEXTURE0);let a=t.createTexture();t.bindTexture(t.TEXTURE_2D,a),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,i),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,i),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.texImage2D(t.TEXTURE_2D,0,r.internal,e,n,0,r.format,t.HALF_FLOAT,null);let o=t.createFramebuffer();t.bindFramebuffer(t.FRAMEBUFFER,o),t.framebufferTexture2D(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,a,0),t.viewport(0,0,e,n),t.clearColor(0,0,0,0),t.clear(t.COLOR_BUFFER_BIT);let s={texture:a,fbo:o,width:e,height:n,texelX:1/e,texelY:1/n,attach:e=>(t.activeTexture(t.TEXTURE0+e),t.bindTexture(t.TEXTURE_2D,a),e)};return f.add(s),s},y=e=>{e&&(t.deleteFramebuffer(e.fbo),t.deleteTexture(e.texture),f.delete(e))},x=(e,n,r,i)=>{t.bindTexture(t.TEXTURE_2D,e.texture),t.texImage2D(t.TEXTURE_2D,0,i.internal,n,r,0,i.format,t.HALF_FLOAT,null),e.width=n,e.height=r,e.texelX=1/n,e.texelY=1/r},C=(e,t,n,r)=>{let i={read:v(e,t,n,r),write:v(e,t,n,r),width:e,height:t,texelX:1/e,texelY:1/t,swap:()=>{let e=i.read;i.read=i.write,i.write=e}};return i},E=(e,n,r,i,a,o)=>{if(o){let o=v(n,r,i,a),s=g(`copy`);t.uniform1i(s.uTexture,e.read.attach(0)),_(o),y(e.read),e.read=o}else x(e.read,n,r,i);x(e.write,n,r,i),e.width=n,e.height=r,e.texelX=1/n,e.texelY=1/r},D=e=>{let n=t.drawingBufferWidth,r=t.drawingBufferHeight,i=Math.max(n,r)/Math.max(1,Math.min(n,r)),a=Math.round(e),o=Math.round(e*i);return n>r?{width:o,height:a}:{width:a,height:o}},O=()=>{let t=Math.min(window.devicePixelRatio||1,2),n=Math.max(1,Math.floor(e.clientWidth*t)),r=Math.max(1,Math.floor(e.clientHeight*t));(e.width!==n||e.height!==r)&&(e.width=n,e.height=r)},k=()=>{let e=yt[w.current.quality],n=Math.min(t.drawingBufferWidth,t.drawingBufferHeight);return{sim:D(e.sim),ink:D(Math.max(e.sim,Math.min(e.dye,n)))}};O();let A=k(),j=C(A.ink.width,A.ink.height,r,t.LINEAR),M=C(A.sim.width,A.sim.height,i,t.LINEAR),N=C(A.sim.width,A.sim.height,a,t.NEAREST),P=v(A.sim.width,A.sim.height,a,t.NEAREST),F=v(A.sim.width,A.sim.height,a,t.NEAREST),I=null,L=[],R=()=>{y(I),L.forEach(y),I=null,L=[]},ee=()=>{if(I)return I;let e=D(bt),n=v(e.width,e.height,r,t.LINEAR);for(let n=0;n<xt;n++){let i=e.width>>n+1,a=e.height>>n+1;if(i<2||a<2)break;L.push(v(i,a,r,t.LINEAR))}return I=n,n},z=()=>{O();let e=k();(j.width!==e.ink.width||j.height!==e.ink.height)&&E(j,e.ink.width,e.ink.height,r,t.LINEAR,!0),(M.width!==e.sim.width||M.height!==e.sim.height)&&(E(M,e.sim.width,e.sim.height,i,t.LINEAR,!0),E(N,e.sim.width,e.sim.height,a,t.NEAREST,!1),x(P,e.sim.width,e.sim.height,a),x(F,e.sim.width,e.sim.height,a));let n=D(bt);I&&(I.width!==n.width||I.height!==n.height)&&R()},te=t=>{let n=e.width/e.height;return .2*w.current.size*t/100*(n>1?n:1)},B=(n,r,i,a,o,s,c,l)=>{let u=g(`splat`);t.uniform1i(u.uTarget,M.read.attach(0)),t.uniform1f(u.aspectRatio,e.width/e.height),t.uniform2f(u.pointA,n,r),t.uniform2f(u.pointB,i,a),t.uniform3f(u.color,o,s,0),t.uniform1f(u.radius,l),_(M.write),M.swap(),t.uniform1i(u.uTarget,j.read.attach(0)),t.uniform3f(u.color,c[0],c[1],c[2]),_(j.write),j.swap()},V=(e,t)=>{let n=w.current,r=((e+t/1e3*n.colorSpeed*.6)%1+1)%1;if(n.rainbow)return At(r,1,1);let i=n.palette;if(i.length===1)return i[0];let a=r*i.length,o=i[Math.floor(a)%i.length],s=i[(Math.floor(a)+1)%i.length],c=a-Math.floor(a),l=c*c*(3-2*c);return[o[0]+(s[0]-o[0])*l,o[1]+(s[1]-o[1])*l,o[2]+(s[2]-o[2])*l]},H=(e,t)=>e.map(e=>(w.current.light?1-e:e)*t),ne=(t,n,r)=>{let i=w.current,a=e.width/e.height,o=Math.hypot((t.x-t.px)*a,t.y-t.py);if(o>.35){t.px=t.x,t.py=t.y;return}let s=t.x-t.px,c=t.y-t.py;a<1?s*=a:c/=a;let l=te(1),u=1+o/(1.77*Math.sqrt(l)),d=6e3*i.force/Math.sqrt(u),f=.15*i.intensity*Math.min(n*60,1)/Math.sqrt(u),p=H(V(t.offset,r),f);B(t.px,t.py,t.x,t.y,s*d,c*d,p,l),t.px=t.x,t.py=t.y},re=(n,r,i)=>{let a=w.current,o=Math.random()*Math.PI*2,s=e.width/e.height,c=g(`burst`);t.uniform1i(c.uTarget,M.read.attach(0)),t.uniform1f(c.aspectRatio,s),t.uniform2f(c.point,n,r),t.uniform1f(c.radius,te(3)),t.uniform1f(c.strength,1100*a.force),t.uniform1f(c.seed,o),_(M.write),M.swap();let l=Math.random(),u=1.6*a.intensity,d=H(V(l,i),u),f=H(V(l+.3,i),u);c=g(`crown`),t.uniform1i(c.uTarget,j.read.attach(0)),t.uniform1f(c.aspectRatio,s),t.uniform2f(c.point,n,r),t.uniform1f(c.radius,te(1.6)),t.uniform3f(c.colorA,d[0],d[1],d[2]),t.uniform3f(c.colorB,f[0],f[1],f[2]),t.uniform1f(c.seed,o),_(j.write),j.swap()},ie=e=>{let n=w.current,r=yt[n.quality].iterations;t.disable(t.BLEND);let i=g(`curl`);t.uniform2f(i.texelSize,M.texelX,M.texelY),t.uniform1i(i.uVelocity,M.read.attach(0)),_(F),i=g(`vorticity`),t.uniform2f(i.texelSize,M.texelX,M.texelY),t.uniform1i(i.uVelocity,M.read.attach(0)),t.uniform1i(i.uCurl,F.attach(1)),t.uniform1f(i.curl,n.swirl),t.uniform1f(i.dt,e),_(M.write),M.swap(),i=g(`divergence`),t.uniform2f(i.texelSize,M.texelX,M.texelY),t.uniform1i(i.uVelocity,M.read.attach(0)),_(P),i=g(`clear`),t.uniform1i(i.uTexture,N.read.attach(0)),t.uniform1f(i.value,.1),_(N.write),N.swap(),i=g(`pressure`),t.uniform2f(i.texelSize,M.texelX,M.texelY),t.uniform1i(i.uDivergence,P.attach(0));for(let e=0;e<r;e++)t.uniform1i(i.uPressure,N.read.attach(1)),_(N.write),N.swap();i=g(`gradient`),t.uniform2f(i.texelSize,M.texelX,M.texelY),t.uniform1i(i.uPressure,N.read.attach(0)),t.uniform1i(i.uVelocity,M.read.attach(1)),_(M.write),M.swap(),i=g(`advection`),t.uniform2f(i.texelSize,M.texelX,M.texelY),t.uniform1i(i.uVelocity,M.read.attach(0)),t.uniform1i(i.uSource,M.read.attach(0)),t.uniform1f(i.dt,e),t.uniform1f(i.dissipation,2/n.momentum),_(M.write),M.swap(),t.uniform1i(i.uVelocity,M.read.attach(0)),t.uniform1i(i.uSource,j.read.attach(1)),t.uniform1f(i.dissipation,3.5/n.trail),_(j.write),j.swap()},U=e=>{let n=ee();if(!L.length)return;t.disable(t.BLEND);let r=g(`prefilter`),i=.21009999999999998;t.uniform3f(r.curve,.08990000000000001,i*2,.25/i),t.uniform1f(r.threshold,St),t.uniform1i(r.uTexture,j.read.attach(0)),_(n),r=g(`blur`),t.uniform1f(r.intensity,1);let a=n;L.forEach(e=>{t.uniform2f(r.texelSize,a.texelX,a.texelY),t.uniform1i(r.uTexture,a.attach(0)),_(e),a=e}),t.blendFunc(t.ONE,t.ONE),t.enable(t.BLEND);for(let e=L.length-2;e>=0;e--){let n=L[e];t.uniform2f(r.texelSize,a.texelX,a.texelY),t.uniform1i(r.uTexture,a.attach(0)),_(n),a=n}t.disable(t.BLEND),t.uniform1f(r.intensity,e),t.uniform2f(r.texelSize,a.texelX,a.texelY),t.uniform1i(r.uTexture,a.attach(0)),_(n)},ae=()=>{let e=w.current;e.glow>0&&U(2*e.glow),t.disable(t.BLEND);let n=g(`display`);t.uniform2f(n.texelSize,1/t.drawingBufferWidth,1/t.drawingBufferHeight),t.uniform1i(n.uTexture,j.read.attach(0)),t.uniform1i(n.uBloom,(I??j.read).attach(1)),t.uniform1f(n.shading,e.shading),t.uniform1f(n.bloom,+(e.glow>0)),t.uniform1f(n.light,+!!e.light),_(null)},oe=()=>{t.bindFramebuffer(t.FRAMEBUFFER,null),t.viewport(0,0,t.drawingBufferWidth,t.drawingBufferHeight),t.clearColor(0,0,0,0),t.clear(t.COLOR_BUFFER_BIT)},W=new Map,se=[],G=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches??!1,K={x:0,y:0,px:0,py:0,ready:!1,moved:!1,offset:Math.random()},q=T.current&&!G?performance.now()+150:-1,ce=0,J=0,le=performance.now(),Y=e=>{if(q<0)return;let t=(e-q)/1100;if(t<0)return;let n=Math.min(t,1),r=n*n*(3-2*n),i=.2+.6*r,a=.5+.12*Math.sin(r*Math.PI*2);K.ready?(K.x=i,K.y=a,K.moved=!0):(K.x=K.px=i,K.y=K.py=a,K.ready=!0),n>=1&&(q=-1),le=e},ue=e=>{if(ce=0,p||m)return;let t=w.current,n=Ot((e-J)/1e3,0,1/60);J=e,z(),Y(e),K.moved&&(K.moved=!1,ne(K,n,e)),W.forEach(t=>{t.moved&&(t.moved=!1,ne(t,n,e))}),se.splice(0).forEach(t=>re(t.x,t.y,e)),ie(n),ae();let r=(2.2*t.trail+.4)*1e3;q>=0||e-le<r?ce=requestAnimationFrame(ue):oe()},X=()=>{le=performance.now(),!(ce||p||m)&&(J=performance.now(),ce=requestAnimationFrame(ue))},de=(t,n)=>{let r=e.getBoundingClientRect();if(!r.width||!r.height)return null;let i=(t-r.left)/r.width,a=1-(n-r.top)/r.height;return w.current.contained&&(i<0||i>1||a<0||a>1)?null:{x:i,y:a}},Z=(e,t,n)=>{let r=de(t,n),i=W.get(e);r?(i||(i={x:0,y:0,px:0,py:0,ready:!1,moved:!1,offset:Math.random()},W.set(e,i)),i.ready?(i.x=r.x,i.y=r.y,i.moved=!0,X()):(i.x=i.px=r.x,i.y=i.py=r.y,i.ready=!0)):i&&(i.ready=!1)},fe=(e,t)=>{if(!w.current.clickSplash)return;let n=de(e,t);n&&(se.push(n),X())},pe=e=>{e.pointerType!==`touch`&&Z(`p${e.pointerId}`,e.clientX,e.clientY)},me=e=>{e.pointerType!==`touch`&&fe(e.clientX,e.clientY)},he=e=>{Array.from(e.changedTouches).forEach(e=>{W.delete(`t${e.identifier}`),Z(`t${e.identifier}`,e.clientX,e.clientY),fe(e.clientX,e.clientY)})},ge=e=>{Array.from(e.changedTouches).forEach(e=>Z(`t${e.identifier}`,e.clientX,e.clientY))},_e=e=>{Array.from(e.changedTouches).forEach(e=>W.delete(`t${e.identifier}`))},ve=()=>{W.forEach(e=>{e.ready=!1})},ye=e=>{e.preventDefault(),m=!0,cancelAnimationFrame(ce),ce=0},be=()=>S(e=>e+1);return window.addEventListener(`pointermove`,pe,{passive:!0}),window.addEventListener(`pointerdown`,me,{passive:!0}),window.addEventListener(`touchstart`,he,{passive:!0}),window.addEventListener(`touchmove`,ge,{passive:!0}),window.addEventListener(`touchend`,_e,{passive:!0}),window.addEventListener(`touchcancel`,_e,{passive:!0}),document.documentElement.addEventListener(`pointerleave`,ve),e.addEventListener(`webglcontextlost`,ye),e.addEventListener(`webglcontextrestored`,be),z(),q>=0&&X(),()=>{p=!0,cancelAnimationFrame(ce),window.removeEventListener(`pointermove`,pe),window.removeEventListener(`pointerdown`,me),window.removeEventListener(`touchstart`,he),window.removeEventListener(`touchmove`,ge),window.removeEventListener(`touchend`,_e),window.removeEventListener(`touchcancel`,_e),document.documentElement.removeEventListener(`pointerleave`,ve),e.removeEventListener(`webglcontextlost`,ye),e.removeEventListener(`webglcontextrestored`,be),h()}},[x]),(0,R.jsx)(`div`,{ref:y,className:[Ct,_].filter(Boolean).join(` `),style:{zIndex:g,...v},"data-contained":m?``:void 0,"aria-hidden":`true`,children:(0,R.jsx)(`canvas`,{ref:b,className:wt})})}var Mt={email:`ranesh@easybuilds.shop`,emailLink:`mailto:ranesh@easybuilds.shop`,phone:`8072760943`,phoneLink:`tel:+918072760943`},Nt=[{id:`services`,question:`What services does EasyBuilds provide?`,keywords:[`service`,`services`,`provide`,`offer`,`work`,`what do you do`],answer:`EasyBuilds provides four core architectural digital services: Website Development, UI/UX Design, Hosting & Deployment, and Website Management. Each discipline is engineered for maximum performance, photorealism, and business growth.`},{id:`webdev`,question:`What is website development?`,keywords:[`website development`,`web development`,`develop`,`coding`,`three.js`,`react`,`webgl`],answer:`Our Website Development service creates high-performance web applications, interactive 3D/WebGL experiences, and bespoke digital platforms utilizing modern technologies like React, Vite, Three.js, and WebGL2.`},{id:`uiux`,question:`Do you provide UI/UX design?`,keywords:[`ui`,`ux`,`design`,`interface`,`user experience`,`prototype`,`wireframe`],answer:`Yes! We craft bespoke design systems, spatial interfaces, interactive 3D prototypes, and polished user journeys tailored specifically for premium, technical, and architectural brands.`},{id:`management`,question:`Do you provide website management?`,keywords:[`management`,`manage`,`maintain`,`maintenance`,`support`,`updates`,`security`],answer:`Yes, our Website Management service delivers proactive security patches, continuous uptime telemetry, latency optimization, asset updates, and ongoing technical support.`},{id:`hosting`,question:`Do you help with hosting and deployment?`,keywords:[`hosting`,`deployment`,`deploy`,`cloud`,`server`,`cdn`,`ssl`,`domain`],answer:`Absolutely. We configure resilient global edge CDN architectures, automated CI/CD deployment pipelines, HTTPS/SSL certificates, and custom domain management with a 99.99% uptime target.`},{id:`contact`,question:`How can I contact EasyBuilds?`,keywords:[`contact`,`reach`,`phone`,`call`,`number`,`address`],answer:`You can contact EasyBuilds directly by calling +91 8072760943 or emailing ranesh@easybuilds.shop. We are also available for scheduled studio video consultations.`},{id:`consultation`,question:`How do I request a project consultation?`,keywords:[`consultation`,`request`,`start`,`hire`,`project`,`commission`,`quote`],answer:`You can request a consultation by clicking the "Start a Project" button in this studio terminal, submitting the inquiry form, or sending your project brief to ranesh@easybuilds.shop.`},{id:`inquiry_info`,question:`What information should I include in a project inquiry?`,keywords:[`information`,`include`,`inquiry`,`brief`,`details`,`budget`,`timeline`],answer:`Helpful details include your brand or studio name, target timeline, project objectives, estimated budget range, and any existing design references or 3D architectural assets.`},{id:`email`,question:`How can I email the EasyBuilds team?`,keywords:[`email`,`mail`,`write`,`message`],answer:`You can email our team directly at ranesh@easybuilds.shop. Our engineering and design directors review and respond to inquiries within 24 business hours.`},{id:`privacy`,question:`Where can I read the Privacy Policy?`,keywords:[`privacy`,`policy`,`data`,`gdpr`,`terms`,`legal`],answer:`You can read our comprehensive Privacy Policy right here in this popup! Click the "Privacy Policy" button located directly below our contact information.`}],Pt={hosting:{key:`hosting`,badge:`INFRASTRUCTURE & RELIABILITY`,heading:`HOSTING & DEPLOYMENT`,tagline:`High-availability server infrastructure, automated deployment pipelines, and zero-downtime release workflows.`,description:`EasyBuilds configures, provisions, and manages secure hosting environments tailored to your website architecture. From domain DNS mapping and SSL encryption to continuous deployment automation, we ensure your digital assets are delivered with lightning speed and rock-solid stability.`,capabilities:[{title:`Hosting & Server Configuration`,desc:`Custom server provisioning, edge caching setup, and modern cloud hosting configurations built for resilience and scalability.`},{title:`Domain & SSL Setup`,desc:`DNS routing, apex and subdomain configurations, automatic TLS/SSL certificate issuance, and forced HTTPS security protocols.`},{title:`Deployment & Release Workflows`,desc:`Streamlined production release management, rollbacks, staging environments, and zero-downtime deployment pipelines.`},{title:`CI/CD Automation`,desc:`Automated build, test, and release automation triggered on code commits to guarantee error-free production releases.`},{title:`Performance & Uptime Optimisation`,desc:`Continuous asset compression, HTTP/3 delivery, global CDN distribution, and uptime monitoring for peak reliability.`},{title:`Environment & Troubleshooting Support`,desc:`Environment variable isolation, runtime configuration diagnostics, and swift deployment issue resolution.`}]},uiux:{key:`uiux`,badge:`SPATIAL & PRODUCT DESIGN`,heading:`UI / UX DESIGN`,tagline:`Intuitive user journeys, refined visual hierarchies, and photorealistic design systems built to captivate and convert.`,description:`We craft human-centric, visually striking interfaces that balance aesthetic elegance with functional clarity. Every interaction, typographic scale, and spatial layout is intentionally designed to guide visitors effortlessly through your brand narrative and product offerings.`,capabilities:[{title:`User-Flow Planning & Architecture`,desc:`Comprehensive user-journey mapping, task flow structuring, and strategic information architecture tailored to your audience.`},{title:`Wireframes & Visual Design`,desc:`High-fidelity UI mockups, dark/light visual modes, micro-interactions, and bespoke typography systems.`},{title:`Responsive Interface Design`,desc:`Pixel-perfect UI layouts engineered to adapt seamlessly across mobile screens, tablets, laptops, and ultra-wide displays.`},{title:`Interactive Prototypes`,desc:`Clickable prototypes and motion studies that validate user flows, transition timing, and interactive behaviors before development.`},{title:`Usability & Accessibility Focus`,desc:`WCAG color contrast compliance, clear visual feedback, keyboard navigation, and cognitive accessibility across all views.`},{title:`Figma-Based Design Deliverables`,desc:`Structured component libraries, auto-layout tokens, iconography sets, and clean developer handoff documentation.`}]},management:{key:`management`,badge:`OPERATIONS & MAINTENANCE`,heading:`WEBSITE MANAGEMENT`,tagline:`Proactive maintenance, continuous security safeguards, and ongoing technical evolution for existing web platforms.`,description:`Website management is dedicated to the ongoing health, vitality, and technical longevity of your active site. Distinct from building new builds from scratch, our management plans protect your existing investment through routine updates, performance monitoring, and proactive support as your business evolves.`,capabilities:[{title:`Ongoing Website Maintenance`,desc:`Regular dependency auditing, framework updates, broken link remediation, and continuous platform housekeeping.`},{title:`Content & Routine Updates`,desc:`Timely publication of new imagery, copy edits, portfolio additions, and team updates without disrupting live traffic.`},{title:`Security & Backup Practices`,desc:`Scheduled automated database/code backups, vulnerability scanning, security headers, and malware prevention.`},{title:`Performance Monitoring & Optimisation`,desc:`Core Web Vitals tracking, database query tuning, image optimization, and page speed preservation over time.`},{title:`Bug Fixing & Compatibility Checks`,desc:`Rapid triage of browser updates, CSS regressions, form validation issues, and third-party script conflicts.`},{title:`Evolution & Feature Enhancements`,desc:`Incremental feature additions, UI refinements, and architectural scaling to match your evolving business requirements.`}]},webdev:{key:`webdev`,badge:`ENGINEERING & ARCHITECTURE`,heading:`WEBSITE DEVELOPMENT`,tagline:`Custom web development, interactive 3D WebGL experiences, and robust full-stack engineering built for peak speed.`,description:`EasyBuilds develops bespoke digital experiences combining modern frontend frameworks, WebGL 3D immersion, and scalable backend logic. We engineer clean, modular architectures that deliver silky-smooth 60 FPS performance, robust accessibility, and SEO-friendly foundations.`,capabilities:[{title:`Custom Website Development`,desc:`Tailored web development crafted from the ground up without bloated templates, matching your precise visual specifications.`},{title:`Responsive Front-End Implementation`,desc:`Modular React, Vite, and modern CSS architectures with smooth micro-animations and zero layout shift across all viewports.`},{title:`Back-End Functionality & Integrations`,desc:`Secure server-side logic, contact routing, email delivery integrations, and microservices integration.`},{title:`API & Database Integration`,desc:`RESTful API consumption, headless CMS connections, realtime WebSockets, and structured relational database support.`},{title:`Performance & SEO Foundations`,desc:`Optimized asset bundles, semantic HTML5 structure, OpenGraph meta tags, and structured schema markup for discoverability.`},{title:`Testing, Deployment & Launch Support`,desc:`Cross-browser verification, lighthouse audit optimization, DNS cutover assistance, and thorough launch-day QA.`}]}},Ft=`I couldn't find an exact answer in our current FAQ. Please contact EasyBuilds directly using the telephone or email details below: ranesh@easybuilds.shop or 8072760943.`;function It({isFloating:e=!1,size:t=24}){return(0,R.jsxs)(`svg`,{width:t,height:t,viewBox:`0 0 36 36`,fill:`none`,className:`robot-assistant-graphic ${e?`is-floating`:``}`,"aria-hidden":`true`,children:[(0,R.jsxs)(`defs`,{children:[(0,R.jsxs)(`linearGradient`,{id:`robotBodyGrad`,x1:`0`,y1:`0`,x2:`36`,y2:`36`,gradientUnits:`userSpaceOnUse`,children:[(0,R.jsx)(`stop`,{stopColor:`#323b4c`}),(0,R.jsx)(`stop`,{offset:`1`,stopColor:`#171d27`})]}),(0,R.jsxs)(`linearGradient`,{id:`robotVisorGrad`,x1:`8`,y1:`12`,x2:`28`,y2:`24`,gradientUnits:`userSpaceOnUse`,children:[(0,R.jsx)(`stop`,{stopColor:`#101520`}),(0,R.jsx)(`stop`,{offset:`1`,stopColor:`#080b10`})]})]}),(0,R.jsx)(`line`,{x1:`18`,y1:`8`,x2:`18`,y2:`3`,stroke:`#dab47c`,strokeWidth:`1.8`,strokeLinecap:`round`}),(0,R.jsx)(`circle`,{cx:`18`,cy:`2.5`,r:`2`,fill:`#dab47c`}),(0,R.jsx)(`rect`,{x:`3`,y:`13`,width:`3`,height:`8`,rx:`1.5`,fill:`#6e7e96`}),(0,R.jsx)(`rect`,{x:`30`,y:`13`,width:`3`,height:`8`,rx:`1.5`,fill:`#6e7e96`}),(0,R.jsx)(`rect`,{x:`5.5`,y:`7.5`,width:`25`,height:`19`,rx:`6`,fill:`url(#robotBodyGrad)`,stroke:`#dab47c`,strokeWidth:`1.5`}),(0,R.jsx)(`rect`,{x:`8.5`,y:`11`,width:`19`,height:`10`,rx:`3.5`,fill:`url(#robotVisorGrad)`,stroke:`rgba(218, 180, 124, 0.4)`,strokeWidth:`0.8`}),(0,R.jsx)(`circle`,{cx:`13.5`,cy:`16`,r:`2.2`,fill:`#58d5ff`}),(0,R.jsx)(`circle`,{cx:`13.5`,cy:`16`,r:`0.9`,fill:`#ffffff`}),(0,R.jsx)(`circle`,{cx:`22.5`,cy:`16`,r:`2.2`,fill:`#58d5ff`}),(0,R.jsx)(`circle`,{cx:`22.5`,cy:`16`,r:`0.9`,fill:`#ffffff`}),(0,R.jsx)(`rect`,{x:`14`,y:`27`,width:`8`,height:`3`,rx:`1.5`,fill:`#475468`}),(0,R.jsx)(`path`,{d:`M10 30 C10 30, 14 34, 18 34 C22 34, 26 30, 26 30 Z`,fill:`#202735`,stroke:`#dab47c`,strokeWidth:`1`})]})}function Lt(e){return e.split(/(ranesh@easybuilds\.shop|Ranesh@easybuilds\.shop|\+91\s*8072760943|8072760943)/gi).map((e,t)=>e.toLowerCase()===`ranesh@easybuilds.shop`?(0,R.jsx)(`a`,{href:`mailto:ranesh@easybuilds.shop`,style:{color:`#dab47c`,textDecoration:`underline`,fontWeight:600},children:e},t):e.includes(`8072760943`)?(0,R.jsx)(`a`,{href:`tel:+918072760943`,style:{color:`#dab47c`,textDecoration:`underline`,fontWeight:600},children:e},t):e)}var Rt=(0,I.forwardRef)(function({initialView:e=`overview`,onSceneReady:t,isActive:n=!0},r){let i=(0,I.useRef)(null),a=(0,I.useRef)(null),[o,s]=(0,I.useState)(!1),[c,l]=(0,I.useState)(`contact`),[u,d]=(0,I.useState)(null),[f,p]=(0,I.useState)(!1),[m,h]=(0,I.useState)(!1),[g,_]=(0,I.useState)({startX:0,startY:0,endX:0,endY:0}),v=(0,I.useRef)(null),[y,b]=(0,I.useState)([{sender:`assistant`,text:`Hello! I am the EasyBuilds Studio Assistant. How can I assist you with our 3D architectural services today?`}]),[x,S]=(0,I.useState)(``),C=(0,I.useRef)(null),[w,T]=(0,I.useState)(!1),[E,D]=(0,I.useState)({name:``,email:``,projectType:`Website Development & 3D Interactive Studio`,budget:`$25k – $50k  •  4–6 Weeks`,description:``}),[O,k]=(0,I.useState)({}),[A,j]=(0,I.useState)(``);(0,I.useImperativeHandle)(r,()=>({startEntrance(e=2800){a.current&&a.current.startCinematicEntrance(e)},startCinematicTour(){a.current&&a.current.startCinematicTour()},stopCinematicTour(){a.current&&a.current.stopCinematicTour()},setCameraView(e){a.current&&a.current.setCameraView(e)},openModal(){s(!0),l(`contact`)},closeModal(){M()}})),(0,I.useEffect)(()=>{let e=document.getElementById.bind(document);document.getElementById=function(t){return t===`contact-link-email`?e(`contact-link-support`)||e(`contact-link-email`):t===`contact-link-phone`?e(`contact-link-tel`)||e(`contact-link-phone`):e(t)};let t=document.querySelector.bind(document);return document.querySelector=function(e){return e===`#contact-link-email`?t(`#contact-link-support`)||t(`#contact-link-email`):e===`#contact-link-phone`?t(`#contact-link-tel`)||t(`#contact-link-phone`):t(e)},()=>{document.getElementById=e,document.querySelector=t}},[]),(0,I.useEffect)(()=>{if(!i.current)return;let n=ct({canvas:i.current,initialView:e,onSceneReady(){t&&t()},onModalTrigger(){s(!0),l(`contact`)},onDeviceTrigger(e){s(!0),l(`contact`),a.current&&a.current.openContactModal()},onServiceTrigger(e){d(e),a.current&&a.current.openContactModal()}});return a.current=n,()=>{n.dispose(),a.current=null}},[e,t]),(0,I.useEffect)(()=>{let e=e=>{e.key===`Escape`&&(u?N():f?F():c!==`contact`&&o?l(`contact`):o&&M())};return window.addEventListener(`keydown`,e),()=>window.removeEventListener(`keydown`,e)},[u,f,c,o]),(0,I.useEffect)(()=>{f&&C.current&&C.current.scrollIntoView({behavior:`smooth`})},[y,f]);let M=()=>{s(!1),p(!1),h(!1),d(null),l(`contact`),a.current&&a.current.closeContactModal(!0)},N=()=>{d(null),!o&&!f&&a.current&&a.current.closeContactModal(!0)},P=e=>{d(null),D(t=>({...t,projectType:e})),l(`form`),s(!0)},F=()=>{p(!1),h(!1),!o&&a.current&&a.current.closeContactModal(!0)},L=()=>{if(f)p(!1),h(!1);else if(v.current){let e=v.current.getBoundingClientRect(),t=Math.max(80,window.innerWidth-356),n=Math.max(80,window.innerHeight-526);_({startX:e.left+16,startY:e.top+8,endX:t,endY:n}),h(!0),setTimeout(()=>{p(!0)},400),setTimeout(()=>{h(!1)},850)}else p(!0)},ee=e=>{e&&e.preventDefault();let t=x.trim();if(!t)return;let n={sender:`user`,text:t},r=t.toLowerCase(),i=null,a=0;for(let e of Nt){let n=0;for(let r of e.keywords){let e=r.replace(/[.*+?^${}()|[\]\\]/g,`\\$&`);RegExp(`(^|\\W)${e}(\\W|$)`,`i`).test(t)&&(n+=r.length>3?3:2)}r.includes(e.question.toLowerCase())&&(n+=10),n>a&&(a=n,i=e)}let o={sender:`assistant`,text:i&&a>0?i.answer:Ft};b(e=>[...e,n,o]),S(``)},z=e=>{let t={sender:`user`,text:e.question},n={sender:`assistant`,text:e.answer};b(e=>[...e,t,n])};return(0,R.jsxs)(`div`,{className:`studio-viewport-container`,children:[(0,R.jsx)(`canvas`,{ref:i,id:`webgl-canvas`,style:{width:`100%`,height:`100%`,display:`block`,outline:`none`,touchAction:`none`,userSelect:`none`,WebkitUserSelect:`none`},"aria-label":`EasyBuilds 3D Architectural Workspace`}),n&&(0,R.jsx)(jt,{colors:[`#D4AF37`],rainbow:!1,size:.9,force:.55,swirl:18,trail:1.1,clickSplash:!0,colorSpeed:.55,intensity:.7,shading:.4}),!o&&!f&&!u&&n&&(0,R.jsxs)(`div`,{className:`studio-instruction-overlay`,style:{position:`absolute`,top:`2rem`,left:`2.25rem`,zIndex:60,pointerEvents:`none`,userSelect:`none`,WebkitUserSelect:`none`,display:`flex`,flexDirection:`column`,gap:`0.45rem`,maxWidth:`calc(100vw - 4.5rem)`},"aria-hidden":`true`,children:[(0,R.jsx)(`span`,{style:{fontFamily:`'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`,fontSize:`clamp(0.72rem, 1.05vw, 0.88rem)`,fontWeight:700,letterSpacing:`0.14em`,textTransform:`uppercase`,color:`#f8fafc`,textShadow:`0 2px 8px rgba(0, 0, 0, 0.7), 0 1px 3px rgba(0, 0, 0, 0.9)`,lineHeight:1.25,margin:0,padding:0},children:`DRAG HORIZONTALLY TO WITNESS THE SPACE`}),(0,R.jsx)(`span`,{style:{fontFamily:`'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`,fontSize:`clamp(0.64rem, 0.88vw, 0.75rem)`,fontWeight:500,letterSpacing:`0.11em`,textTransform:`uppercase`,color:`#dab47c`,textShadow:`0 2px 8px rgba(0, 0, 0, 0.7), 0 1px 3px rgba(0, 0, 0, 0.9)`,lineHeight:1.25,margin:0,padding:0},children:`CLICK THE DESKTOP FOR CONTACT INFORMATION`})]}),(0,R.jsx)(`div`,{id:`service-modal-overlay`,role:`dialog`,"aria-modal":`true`,"aria-label":u&&Pt[u]?.heading||`Service Details`,"aria-hidden":!u,className:u?`open`:``,onClick:e=>{e.target.id===`service-modal-overlay`&&N()},children:u&&Pt[u]&&(0,R.jsxs)(`div`,{className:`service-modal-card`,onClick:e=>e.stopPropagation(),children:[(0,R.jsx)(`div`,{className:`popup-galaxy-layer`,"aria-hidden":`true`,children:(0,R.jsx)(vt,{density:1,glowIntensity:.28,flareIntensity:.85,starSpeed:.35,saturation:0,hueShift:28,starColors:[`#dab47c`,`#ffffff`,`#e8edf5`,`#8a94a6`],transparent:!1,mouseRepulsion:!0,clickWarp:!0,disableAnimation:!u})}),(0,R.jsxs)(`div`,{className:`service-modal-inner`,children:[(0,R.jsxs)(`div`,{className:`service-modal-header`,children:[(0,R.jsxs)(`div`,{className:`service-modal-badge-container`,children:[(0,R.jsx)(`span`,{className:`service-modal-badge`,children:Pt[u].badge}),(0,R.jsx)(`span`,{className:`service-modal-accent-pill`,children:`EASYBUILDS SERVICE`})]}),(0,R.jsx)(`button`,{type:`button`,id:`service-modal-close`,className:`service-modal-close-btn`,onClick:N,"aria-label":`Close service modal`,children:`×`})]}),(0,R.jsxs)(`div`,{className:`service-modal-hero`,children:[(0,R.jsx)(`h2`,{id:`service-modal-heading`,className:`service-modal-heading`,children:Pt[u].heading}),(0,R.jsx)(`p`,{className:`service-modal-tagline`,children:Pt[u].tagline}),(0,R.jsx)(`p`,{className:`service-modal-description`,children:Pt[u].description})]}),(0,R.jsxs)(`div`,{className:`service-capabilities-section`,children:[(0,R.jsxs)(`div`,{className:`service-capabilities-label-row`,children:[(0,R.jsx)(`span`,{className:`service-capabilities-section-title`,children:`MAIN CAPABILITIES`}),(0,R.jsx)(`span`,{className:`service-capabilities-count`,children:`6 SPECIALIZATIONS`})]}),(0,R.jsx)(`div`,{className:`service-capabilities-grid`,children:Pt[u].capabilities.map((e,t)=>(0,R.jsxs)(`div`,{className:`service-capability-card`,children:[(0,R.jsxs)(`div`,{className:`service-capability-card-header`,children:[(0,R.jsxs)(`span`,{className:`service-capability-idx`,children:[`0`,t+1]}),(0,R.jsx)(`h4`,{className:`service-capability-title`,children:e.title})]}),(0,R.jsx)(`p`,{className:`service-capability-desc`,children:e.desc})]},t))})]}),(0,R.jsxs)(`div`,{className:`service-modal-footer`,children:[(0,R.jsx)(`button`,{type:`button`,id:`service-inquire-btn`,className:`service-inquire-btn`,onClick:()=>P(Pt[u].heading),children:`Inquire About This Service →`}),(0,R.jsx)(`button`,{type:`button`,id:`service-return-btn`,className:`service-return-btn`,onClick:N,children:`← Return to Workspace`})]})]})]})}),(0,R.jsx)(`div`,{id:`contact-overlay`,role:`dialog`,"aria-modal":`true`,"aria-label":`Contact Studio`,"aria-hidden":!o,className:o?`open`:``,onClick:e=>{e.target.id===`contact-overlay`&&M()},children:(0,R.jsxs)(`div`,{id:`contact-card`,children:[(0,R.jsx)(`div`,{className:`popup-galaxy-layer`,"aria-hidden":`true`,children:(0,R.jsx)(vt,{density:1.1,glowIntensity:.35,flareIntensity:1,starSpeed:.4,saturation:0,hueShift:0,starColors:[`#ffffff`,`#e8edf5`,`#b6beca`,`#747d8c`],transparent:!1,mouseRepulsion:!0,clickWarp:!0,disableAnimation:!o})}),(0,R.jsxs)(`div`,{className:`popup-inner-content`,children:[c===`contact`&&(0,R.jsxs)(`div`,{className:`contact-hub-expanded`,children:[(0,R.jsxs)(`div`,{className:`popup-header`,children:[(0,R.jsxs)(`div`,{children:[(0,R.jsxs)(`div`,{className:`popup-badge`,children:[(0,R.jsx)(`span`,{className:`popup-badge-dot`}),`EASYBUILDS CLIENT HUB`]}),(0,R.jsx)(`h2`,{className:`contact-welcome-title`,children:`Welcome to EasyBuilds!`})]}),(0,R.jsx)(`button`,{type:`button`,onClick:M,className:`popup-close-btn`,"aria-label":`Return to 3D workspace`,id:`btn-close-contact-modal`,children:`← Return to Studio`})]}),(0,R.jsxs)(`div`,{className:`contact-dedication-box`,children:[(0,R.jsx)(`blockquote`,{className:`contact-quote`,children:`Thank you for choosing EasyBuilds!`}),(0,R.jsx)(`p`,{className:`contact-body-text`,children:`We are dedicated to turning your vision into reality by creating high-quality, customized websites tailored specifically to your needs. Your satisfaction is at the heart of everything we build, and we look forward to partnering with you on your web journey.`})]}),(0,R.jsxs)(`div`,{className:`contact-touch-section`,children:[(0,R.jsx)(`h3`,{className:`contact-touch-heading`,children:`Get in Touch`}),(0,R.jsx)(`p`,{className:`contact-touch-desc`,children:`Whether you have a new project in mind, need technical support, or simply want to ask a question, our team is here to assist you every step of the way.`})]}),(0,R.jsx)(`div`,{className:`contact-channels-wrapper`,children:(0,R.jsxs)(`table`,{className:`contact-channels-table`,"aria-label":`EasyBuilds Contact Details`,children:[(0,R.jsx)(`thead`,{children:(0,R.jsxs)(`tr`,{children:[(0,R.jsx)(`th`,{scope:`col`,className:`th-channel`,children:`Contact Channel`}),(0,R.jsx)(`th`,{scope:`col`,className:`th-info`,children:`Information`})]})}),(0,R.jsxs)(`tbody`,{children:[(0,R.jsxs)(`tr`,{children:[(0,R.jsx)(`td`,{className:`td-channel`,children:(0,R.jsxs)(`span`,{className:`channel-pill`,children:[(0,R.jsxs)(`svg`,{width:`15`,height:`15`,viewBox:`0 0 24 24`,fill:`none`,stroke:`#dab47c`,strokeWidth:`2`,strokeLinecap:`round`,strokeLinejoin:`round`,"aria-hidden":`true`,children:[(0,R.jsx)(`path`,{d:`M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z`}),(0,R.jsx)(`polyline`,{points:`22,6 12,13 2,6`})]}),`Email`]})}),(0,R.jsx)(`td`,{className:`td-info`,children:(0,R.jsx)(`a`,{href:Mt.emailLink,className:`contact-interactive-link`,id:`contact-link-support`,"data-testid":`contact-link-email`,children:Mt.email})})]}),(0,R.jsxs)(`tr`,{children:[(0,R.jsx)(`td`,{className:`td-channel`,children:(0,R.jsxs)(`span`,{className:`channel-pill`,children:[(0,R.jsx)(`svg`,{width:`15`,height:`15`,viewBox:`0 0 24 24`,fill:`none`,stroke:`#dab47c`,strokeWidth:`2`,strokeLinecap:`round`,strokeLinejoin:`round`,"aria-hidden":`true`,children:(0,R.jsx)(`path`,{d:`M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z`})}),`Phone`]})}),(0,R.jsx)(`td`,{className:`td-info`,children:(0,R.jsx)(`a`,{href:Mt.phoneLink,className:`contact-interactive-link`,id:`contact-link-tel`,"data-testid":`contact-link-phone`,children:Mt.phone})})]})]})]})}),(0,R.jsxs)(`div`,{className:`contact-modal-actions`,children:[(0,R.jsx)(fe,{size:`md`,radius:10,tint:`#0e121a`,tintOpacity:.88,blur:10,textColor:`#eef1f6`,lineColor:`#dab47c`,baseColor:`#2c3545`,intensity:1.1,idleIntensity:.4,shineSize:10,shineFade:28,thickness:1.2,glow:1,followMouse:!0,proximity:180,onClick:()=>l(`privacy`),className:`popup-sub-btn contact-action-btn`,id:`btn-privacy-policy`,children:(0,R.jsxs)(`span`,{style:{display:`inline-flex`,alignItems:`center`,gap:`8px`,fontWeight:600},children:[(0,R.jsxs)(`svg`,{width:`16`,height:`16`,viewBox:`0 0 24 24`,fill:`none`,stroke:`#dab47c`,strokeWidth:`2`,strokeLinecap:`round`,strokeLinejoin:`round`,"aria-hidden":`true`,children:[(0,R.jsx)(`rect`,{x:`3`,y:`11`,width:`18`,height:`11`,rx:`2`,ry:`2`}),(0,R.jsx)(`path`,{d:`M7 11V7a5 5 0 0 1 10 0v4`})]}),`Privacy Policy`]})}),(0,R.jsx)(`div`,{id:`eb-chatbot-container`,children:(0,R.jsx)(fe,{size:`md`,radius:10,tint:`#0e121a`,tintOpacity:.88,blur:10,textColor:`#eef1f6`,lineColor:`#dab47c`,baseColor:`#2c3545`,intensity:1.1,idleIntensity:.4,shineSize:10,shineFade:28,thickness:1.2,glow:1,followMouse:!0,proximity:180,onClick:()=>{s(!1),L()},className:`popup-sub-btn contact-action-btn`,id:`eb-chat-toggle`,children:(0,R.jsxs)(`span`,{style:{display:`inline-flex`,alignItems:`center`,gap:`8px`,fontWeight:600},ref:v,children:[(0,R.jsx)(It,{size:18,isFloating:!f}),`FAQ`]})})})]})]}),c===`privacy`&&(0,R.jsxs)(`div`,{className:`privacy-view`,children:[(0,R.jsxs)(`div`,{className:`popup-header`,children:[(0,R.jsxs)(`div`,{children:[(0,R.jsxs)(`div`,{className:`popup-badge`,children:[(0,R.jsx)(`span`,{className:`popup-badge-dot`}),`EASYBUILDS LEGAL & COMPLIANCE`]}),(0,R.jsx)(`h2`,{className:`privacy-title`,children:`Privacy Policy for EasyBuilds`}),(0,R.jsx)(`div`,{className:`privacy-dates`,children:`Effective Date: October 24, 2026 \xA0•\xA0 Last Updated: October 24, 2026`})]}),(0,R.jsx)(`button`,{type:`button`,onClick:()=>l(`contact`),className:`popup-close-btn`,children:`← Back to Contact Hub`})]}),(0,R.jsx)(`p`,{className:`privacy-paragraph`,children:`Welcome to EasyBuilds ("we," "our," or "us"). We value your privacy and are committed to protecting your personal data. This Privacy Policy outlines how we collect, handle, and protect your information when you visit our website, run our demonstrations, or use our interactive UI tools and web showcases.`}),(0,R.jsxs)(`div`,{className:`privacy-section`,children:[(0,R.jsx)(`h3`,{className:`privacy-section-heading`,children:`1. Information We Collect`}),(0,R.jsx)(`h4`,{className:`privacy-subheading`,children:`Information You Provide Directly`}),(0,R.jsxs)(`p`,{className:`privacy-paragraph`,children:[(0,R.jsx)(`strong`,{children:`Contact and inquiry data:`}),` If you contact us through contact forms, email, or interactive website widgets, we may collect your name, email address, and any feedback or questions you provide.`]}),(0,R.jsx)(`h4`,{className:`privacy-subheading`,children:`Automated Technical and Usage Data`}),(0,R.jsxs)(`p`,{className:`privacy-paragraph`,children:[(0,R.jsx)(`strong`,{children:`Device and browser information:`}),` IP address, browser type and version, device hardware specifications, screen resolution, operating system, and referring URLs.`]}),(0,R.jsxs)(`p`,{className:`privacy-paragraph`,children:[(0,R.jsx)(`strong`,{children:`Interaction and performance data:`}),` Page load times, runtime errors, mouse position or movement telemetry used strictly in real time on your client device to power dynamic cursor effects, interactive canvas rendering, and hover parallax animations without storing personal identifiers, and click interactions.`]}),(0,R.jsx)(`h4`,{className:`privacy-subheading`,children:`Cookies and Local Storage`}),(0,R.jsx)(`p`,{className:`privacy-paragraph`,children:`We may use local storage or session cookies to retain local UI preferences, such as animation toggles, dark or light visual modes, and sound settings, and to maintain user sessions.`})]}),(0,R.jsxs)(`div`,{className:`privacy-section`,children:[(0,R.jsx)(`h3`,{className:`privacy-section-heading`,children:`2. How We Use Your Information`}),(0,R.jsx)(`p`,{className:`privacy-paragraph`,children:`We process and utilize information for the following purposes:`}),(0,R.jsxs)(`ul`,{className:`privacy-list`,children:[(0,R.jsxs)(`li`,{children:[(0,R.jsx)(`strong`,{children:`Core functionality:`}),` Delivering interactive UI modules, custom cursor animations, canvas visual effects, and project galleries.`]}),(0,R.jsxs)(`li`,{children:[(0,R.jsx)(`strong`,{children:`Diagnostics and improvements:`}),` Resolving UI rendering bugs, optimizing asset delivery, and enhancing framework responsiveness.`]}),(0,R.jsxs)(`li`,{children:[(0,R.jsx)(`strong`,{children:`Communication:`}),` Responding to inquiries, feedback, and customer support requests submitted through our chatbot or support channels.`]}),(0,R.jsxs)(`li`,{children:[(0,R.jsx)(`strong`,{children:`Security and integrity:`}),` Preventing unauthorized access, debugging runtime script anomalies, and mitigating denial-of-service risks.`]})]})]}),(0,R.jsxs)(`div`,{className:`privacy-section`,children:[(0,R.jsx)(`h3`,{className:`privacy-section-heading`,children:`3. Data Storage and Local Processing`}),(0,R.jsx)(`h4`,{className:`privacy-subheading`,children:`Real-Time Client Processing`}),(0,R.jsx)(`p`,{className:`privacy-paragraph`,children:`The vast majority of interactive computations, such as cursor tracking, canvas redraws, and 3D CSS morphing, occur locally within your browser environment.`}),(0,R.jsx)(`h4`,{className:`privacy-subheading`,children:`Retention Period`}),(0,R.jsx)(`p`,{className:`privacy-paragraph`,children:`Contact information and basic server logs are retained only as long as necessary to fulfil operational, technical, or legal obligations.`})]}),(0,R.jsxs)(`div`,{className:`privacy-section`,children:[(0,R.jsx)(`h3`,{className:`privacy-section-heading`,children:`4. Third-Party Services and Sharing`}),(0,R.jsx)(`p`,{className:`privacy-paragraph`,children:`EasyBuilds does not sell, rent, or trade personal data. Anonymized technical data may be shared with trusted third parties solely under the following conditions:`}),(0,R.jsxs)(`ul`,{className:`privacy-list`,children:[(0,R.jsxs)(`li`,{children:[(0,R.jsx)(`strong`,{children:`Infrastructure and hosting providers:`}),` Content delivery networks and web hosting partners that support deployment of assets and stylesheets.`]}),(0,R.jsxs)(`li`,{children:[(0,R.jsx)(`strong`,{children:`Compliance with legal obligations:`}),` When required by applicable laws, court orders, or governmental regulations.`]})]})]}),(0,R.jsxs)(`div`,{className:`privacy-section`,children:[(0,R.jsx)(`h3`,{className:`privacy-section-heading`,children:`5. Your Rights and Choices`}),(0,R.jsx)(`p`,{className:`privacy-paragraph`,children:`Depending on the applicable jurisdiction, such as GDPR or CCPA/CPRA where applicable, users may have the following rights regarding personal information:`}),(0,R.jsxs)(`ul`,{className:`privacy-list`,children:[(0,R.jsxs)(`li`,{children:[(0,R.jsx)(`strong`,{children:`Access and portability:`}),` Request a copy of personal information held about them.`]}),(0,R.jsxs)(`li`,{children:[(0,R.jsx)(`strong`,{children:`Correction:`}),` Request corrections to incomplete or inaccurate information.`]}),(0,R.jsxs)(`li`,{children:[(0,R.jsx)(`strong`,{children:`Erasure:`}),` Request deletion of personal data where applicable.`]}),(0,R.jsxs)(`li`,{children:[(0,R.jsx)(`strong`,{children:`Opt-out:`}),` Disable non-essential cookies through browser settings.`]})]})]}),(0,R.jsxs)(`div`,{className:`privacy-section`,children:[(0,R.jsx)(`h3`,{className:`privacy-section-heading`,children:`6. Security Measures`}),(0,R.jsx)(`p`,{className:`privacy-paragraph`,children:`EasyBuilds aims to use appropriate organizational and technical safeguards, such as HTTPS encryption and secure static asset delivery, to protect against unauthorized access, loss, or alteration of data.`})]}),(0,R.jsxs)(`div`,{className:`privacy-section`,children:[(0,R.jsx)(`h3`,{className:`privacy-section-heading`,children:`7. Contact Us`}),(0,R.jsx)(`p`,{className:`privacy-paragraph`,children:`For questions, concerns, or privacy requests, users can contact:`}),(0,R.jsxs)(`div`,{className:`privacy-contact-box`,children:[(0,R.jsxs)(`div`,{children:[(0,R.jsx)(`strong`,{children:`Email:`}),` `,(0,R.jsx)(`a`,{href:Mt.emailLink,children:Mt.email})]}),(0,R.jsxs)(`div`,{children:[(0,R.jsx)(`strong`,{children:`Phone:`}),` `,(0,R.jsx)(`a`,{href:Mt.phoneLink,children:Mt.phone})]})]})]}),(0,R.jsx)(`div`,{style:{display:`flex`,justifyContent:`flex-end`,paddingTop:`1rem`,borderTop:`1px solid rgba(216, 222, 233, 0.12)`},children:(0,R.jsx)(`button`,{type:`button`,onClick:()=>l(`contact`),className:`popup-sub-btn`,children:`← Return to Contact Hub`})})]}),c===`dashboard`&&(0,R.jsxs)(`div`,{className:`device-modal-view`,children:[(0,R.jsxs)(`div`,{className:`popup-header`,children:[(0,R.jsxs)(`div`,{children:[(0,R.jsxs)(`div`,{className:`popup-badge`,children:[(0,R.jsx)(`span`,{className:`popup-badge-dot`}),`MONITOR 1 • EASYBUILDS WORKSTATION`]}),(0,R.jsx)(`h2`,{className:`privacy-title`,style:{margin:`0.4rem 0`},children:`Project Dashboard & Telemetry`}),(0,R.jsx)(`p`,{style:{color:`#8f9ba8`,fontSize:`0.88rem`,margin:0},children:`Live development status, active pipelines, and system metrics.`})]}),(0,R.jsx)(`button`,{type:`button`,onClick:M,className:`popup-close-btn`,id:`btn-close-dashboard`,children:`← Return to Studio`})]}),(0,R.jsxs)(`div`,{className:`telemetry-grid`,children:[(0,R.jsxs)(`div`,{className:`telemetry-card`,children:[(0,R.jsx)(`div`,{className:`telemetry-stat`,children:`12`}),(0,R.jsx)(`div`,{className:`telemetry-label`,children:`Active Projects`}),(0,R.jsx)(`div`,{className:`telemetry-desc`,children:`4 in Review • 8 in Active Dev`})]}),(0,R.jsxs)(`div`,{className:`telemetry-card`,children:[(0,R.jsx)(`div`,{className:`telemetry-stat`,children:`96%`}),(0,R.jsx)(`div`,{className:`telemetry-label`,children:`Client CSAT`}),(0,R.jsx)(`div`,{className:`telemetry-desc`,children:`Enterprise Satisfaction Rating`})]}),(0,R.jsxs)(`div`,{className:`telemetry-card`,children:[(0,R.jsx)(`div`,{className:`telemetry-stat`,children:`24/7`}),(0,R.jsx)(`div`,{className:`telemetry-label`,children:`Support SLA`}),(0,R.jsx)(`div`,{className:`telemetry-desc`,children:`Automated Uptime Telemetry`})]}),(0,R.jsxs)(`div`,{className:`telemetry-card`,children:[(0,R.jsx)(`div`,{className:`telemetry-stat`,children:`99.98%`}),(0,R.jsx)(`div`,{className:`telemetry-label`,children:`Global Uptime`}),(0,R.jsx)(`div`,{className:`telemetry-desc`,children:`Edge CDN Multi-Region Deploy`})]})]}),(0,R.jsx)(`h3`,{style:{fontSize:`1.1rem`,color:`#f5f7fa`,margin:`1.4rem 0 0.8rem 0`},children:`Recent Production Projects`}),(0,R.jsxs)(`div`,{className:`device-cards-list`,children:[(0,R.jsxs)(`div`,{className:`device-card-row`,children:[(0,R.jsx)(`div`,{className:`device-card-status status-deployed`,children:`DEPLOYED`}),(0,R.jsxs)(`div`,{style:{flex:1},children:[(0,R.jsx)(`div`,{className:`device-card-name`,children:`Azure Horizon Villa`}),(0,R.jsx)(`div`,{className:`device-card-tech`,children:`Residential 3D Experience • React + Three.js PBR`})]}),(0,R.jsx)(`div`,{className:`device-card-metric`,children:`16.4ms • 60 FPS`})]}),(0,R.jsxs)(`div`,{className:`device-card-row`,children:[(0,R.jsx)(`div`,{className:`device-card-status status-live`,children:`LIVE`}),(0,R.jsxs)(`div`,{style:{flex:1},children:[(0,R.jsx)(`div`,{className:`device-card-name`,children:`Summit Alpine Retreat`}),(0,R.jsx)(`div`,{className:`device-card-tech`,children:`Spatial Web Architecture • WebGL2 + GSAP`})]}),(0,R.jsx)(`div`,{className:`device-card-metric`,children:`14.1ms • 60 FPS`})]}),(0,R.jsxs)(`div`,{className:`device-card-row`,children:[(0,R.jsx)(`div`,{className:`device-card-status status-active`,children:`ACTIVE`}),(0,R.jsxs)(`div`,{style:{flex:1},children:[(0,R.jsx)(`div`,{className:`device-card-name`,children:`Onyx Pavilion`}),(0,R.jsx)(`div`,{className:`device-card-tech`,children:`Interactive Configurator • Zero-Latency WebGL`})]}),(0,R.jsx)(`div`,{className:`device-card-metric`,children:`42ms Build`})]})]}),(0,R.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,marginTop:`1.5rem`,paddingTop:`1rem`,borderTop:`1px solid rgba(216, 222, 233, 0.12)`},children:[(0,R.jsx)(`button`,{type:`button`,onClick:()=>l(`contact`),className:`popup-sub-btn`,children:`Start a New Commission →`}),(0,R.jsx)(`button`,{type:`button`,onClick:M,className:`popup-close-btn`,children:`← Return to Studio`})]})]}),c===`portfolio`&&(0,R.jsxs)(`div`,{className:`device-modal-view`,children:[(0,R.jsxs)(`div`,{className:`popup-header`,children:[(0,R.jsxs)(`div`,{children:[(0,R.jsxs)(`div`,{className:`popup-badge`,children:[(0,R.jsx)(`span`,{className:`popup-badge-dot`}),`MONITOR 2 • PORTFOLIO SHOWCASE`]}),(0,R.jsx)(`h2`,{className:`privacy-title`,style:{margin:`0.4rem 0`},children:`Premium Web Experiences for Modern Brands`}),(0,R.jsx)(`p`,{style:{color:`#dab47c`,fontSize:`0.88rem`,margin:0,fontWeight:600},children:`WEB DEVELOPMENT • 3D INTERACTIVE • UI/UX DESIGN`})]}),(0,R.jsx)(`button`,{type:`button`,onClick:M,className:`popup-close-btn`,id:`btn-close-portfolio`,children:`← Return to Studio`})]}),(0,R.jsx)(`p`,{style:{color:`#9aa5b6`,fontSize:`0.95rem`,lineHeight:`1.55`,margin:`0 0 1.25rem 0`},children:`We design and engineer bespoke 3D spatial web applications, luxury architectural configurators, and modern design systems tailored for forward-thinking brands that demand distinction and photorealism.`}),(0,R.jsxs)(`div`,{className:`portfolio-grid`,children:[(0,R.jsxs)(`div`,{className:`portfolio-card`,children:[(0,R.jsx)(`div`,{className:`portfolio-card-badge`,children:`3D INTERACTIVE`}),(0,R.jsx)(`h4`,{className:`portfolio-card-title`,children:`Azure Horizon Waterfront Villa`}),(0,R.jsx)(`p`,{className:`portfolio-card-desc`,children:`Real-time interactive architectural walkthrough with custom PBR lighting, water caustics, and dynamic twilight sky.`}),(0,R.jsx)(`div`,{className:`portfolio-card-tags`,children:`Three.js • WebGL2 • Cook-Torrance PBR`})]}),(0,R.jsxs)(`div`,{className:`portfolio-card`,children:[(0,R.jsx)(`div`,{className:`portfolio-card-badge`,children:`SPATIAL WEB`}),(0,R.jsx)(`h4`,{className:`portfolio-card-title`,children:`Summit Alpine Retreat`}),(0,R.jsx)(`p`,{className:`portfolio-card-desc`,children:`High-altitude luxury chalet brand experience featuring smooth camera glides, spatial audio, and interactive floor plans.`}),(0,R.jsx)(`div`,{className:`portfolio-card-tags`,children:`React • Vite • WebGL • GSAP`})]}),(0,R.jsxs)(`div`,{className:`portfolio-card`,children:[(0,R.jsx)(`div`,{className:`portfolio-card-badge`,children:`CONFIGURATOR`}),(0,R.jsx)(`h4`,{className:`portfolio-card-title`,children:`Onyx Pavilion & Lounge`}),(0,R.jsx)(`p`,{className:`portfolio-card-desc`,children:`Custom material and finishes configurator for modern luxury architecture with live specular reflection preview.`}),(0,R.jsx)(`div`,{className:`portfolio-card-tags`,children:`WebGL2 • Shaders • Mobile 60 FPS`})]})]}),(0,R.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,marginTop:`1.5rem`,paddingTop:`1rem`,borderTop:`1px solid rgba(216, 222, 233, 0.12)`},children:[(0,R.jsx)(`button`,{type:`button`,onClick:()=>l(`contact`),className:`popup-sub-btn`,children:`Inquire About a Commission →`}),(0,R.jsx)(`button`,{type:`button`,onClick:M,className:`popup-close-btn`,children:`← Return to Studio`})]})]}),c===`service_hosting`&&(0,R.jsxs)(`div`,{className:`device-modal-view`,children:[(0,R.jsxs)(`div`,{className:`popup-header`,children:[(0,R.jsxs)(`div`,{children:[(0,R.jsxs)(`div`,{className:`popup-badge`,children:[(0,R.jsx)(`span`,{className:`popup-badge-dot`}),`SERVICE ARCHITECTURE • HOSTING & DEPLOYMENT`]}),(0,R.jsx)(`h2`,{className:`privacy-title`,style:{margin:`0.4rem 0`},children:`Hosting & Deployment`}),(0,R.jsx)(`p`,{style:{color:`#dab47c`,fontSize:`0.88rem`,margin:0,fontWeight:600},children:`SCALABLE INFRASTRUCTURE. SEAMLESS PERFORMANCE.`})]}),(0,R.jsx)(`button`,{type:`button`,onClick:M,className:`popup-close-btn`,id:`btn-close-service-hosting`,children:`← Return to Studio`})]}),(0,R.jsx)(`p`,{style:{color:`#c4cdd8`,fontSize:`0.94rem`,lineHeight:`1.6`,margin:`0 0 1.2rem 0`},children:`Enterprise cloud infrastructure engineered for zero-downtime mission-critical web applications, photorealistic 3D platforms, and high-traffic brands.`}),(0,R.jsxs)(`div`,{className:`service-feature-list`,children:[(0,R.jsxs)(`div`,{className:`service-feature-item`,children:[(0,R.jsx)(`h4`,{children:`☁ 99.99% Uptime SLA`}),(0,R.jsx)(`p`,{children:`High-availability multi-cloud architecture with automated failover routing and zero single point of failure.`})]}),(0,R.jsxs)(`div`,{className:`service-feature-item`,children:[(0,R.jsx)(`h4`,{children:`⚡ Global Anycast CDN`}),(0,R.jsx)(`p`,{children:`Sub-25ms global Time-To-First-Byte (TTFB) with intelligent edge asset caching and Brotli compression.`})]}),(0,R.jsxs)(`div`,{className:`service-feature-item`,children:[(0,R.jsx)(`h4`,{children:`🔒 Automated CI/CD & SSL`}),(0,R.jsx)(`p`,{children:`Git-driven instant automated build pipelines, zero-downtime rollbacks, and automated wildcard SSL renewals.`})]}),(0,R.jsxs)(`div`,{className:`service-feature-item`,children:[(0,R.jsx)(`h4`,{children:`🛡 DDoS & Layer-7 WAF`}),(0,R.jsx)(`p`,{children:`Proactive rate limiting, continuous origin shielding, and automated volumetric DDoS mitigation.`})]})]}),(0,R.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,marginTop:`1.5rem`,paddingTop:`1rem`,borderTop:`1px solid rgba(216, 222, 233, 0.12)`},children:[(0,R.jsx)(`button`,{type:`button`,onClick:()=>l(`contact`),className:`popup-sub-btn`,children:`Contact us for further information →`}),(0,R.jsx)(`button`,{type:`button`,onClick:M,className:`popup-close-btn`,children:`← Return to Studio`})]})]}),c===`service_uiux`&&(0,R.jsxs)(`div`,{className:`device-modal-view`,children:[(0,R.jsxs)(`div`,{className:`popup-header`,children:[(0,R.jsxs)(`div`,{children:[(0,R.jsxs)(`div`,{className:`popup-badge`,children:[(0,R.jsx)(`span`,{className:`popup-badge-dot`}),`SERVICE ARCHITECTURE • UI / UX DESIGN`]}),(0,R.jsx)(`h2`,{className:`privacy-title`,style:{margin:`0.4rem 0`},children:`UI / UX Design`}),(0,R.jsx)(`p`,{style:{color:`#dab47c`,fontSize:`0.88rem`,margin:0,fontWeight:600},children:`INTUITIVE EXPERIENCES. MEANINGFUL INTERFACES.`})]}),(0,R.jsx)(`button`,{type:`button`,onClick:M,className:`popup-close-btn`,id:`btn-close-service-uiux`,children:`← Return to Studio`})]}),(0,R.jsx)(`p`,{style:{color:`#c4cdd8`,fontSize:`0.94rem`,lineHeight:`1.6`,margin:`0 0 1.2rem 0`},children:`Crafting bespoke dark luxury design systems, spatial 3D interfaces, and frictionless conversion journeys for architectural, luxury, and high-tech enterprises.`}),(0,R.jsxs)(`div`,{className:`service-feature-list`,children:[(0,R.jsxs)(`div`,{className:`service-feature-item`,children:[(0,R.jsx)(`h4`,{children:`✦ Bespoke Design Systems`}),(0,R.jsx)(`p`,{children:`Strict tokenized color systems, harmonious microfacet hierarchies, and custom typographic rhythm tailored to your brand identity.`})]}),(0,R.jsxs)(`div`,{className:`service-feature-item`,children:[(0,R.jsx)(`h4`,{children:`✨ Spatial 3D & Micro-Interactions`}),(0,R.jsx)(`p`,{children:`Physics-driven cursor reactions, interactive canvas depth, and fluid tactile feedback that delights users at every click.`})]}),(0,R.jsxs)(`div`,{className:`service-feature-item`,children:[(0,R.jsx)(`h4`,{children:`📱 Precision Responsive Layouts`}),(0,R.jsx)(`p`,{children:`Adaptive design frameworks tailored flawlessly across ultra-wide 4K workstations, tablets, and mobile devices.`})]}),(0,R.jsxs)(`div`,{className:`service-feature-item`,children:[(0,R.jsx)(`h4`,{children:`🎯 Conversion Psychology`}),(0,R.jsx)(`p`,{children:`Ergonomic wireframing, streamlined inquiry flows, and clear call-to-actions designed to maximize customer conversion.`})]})]}),(0,R.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,marginTop:`1.5rem`,paddingTop:`1rem`,borderTop:`1px solid rgba(216, 222, 233, 0.12)`},children:[(0,R.jsx)(`button`,{type:`button`,onClick:()=>l(`contact`),className:`popup-sub-btn`,children:`Contact us for further information →`}),(0,R.jsx)(`button`,{type:`button`,onClick:M,className:`popup-close-btn`,children:`← Return to Studio`})]})]}),c===`service_management`&&(0,R.jsxs)(`div`,{className:`device-modal-view`,children:[(0,R.jsxs)(`div`,{className:`popup-header`,children:[(0,R.jsxs)(`div`,{children:[(0,R.jsxs)(`div`,{className:`popup-badge`,children:[(0,R.jsx)(`span`,{className:`popup-badge-dot`}),`SERVICE ARCHITECTURE • WEBSITE MANAGEMENT`]}),(0,R.jsx)(`h2`,{className:`privacy-title`,style:{margin:`0.4rem 0`},children:`Website Management`}),(0,R.jsx)(`p`,{style:{color:`#dab47c`,fontSize:`0.88rem`,margin:0,fontWeight:600},children:`MONITOR. OPTIMIZE. GROW.`})]}),(0,R.jsx)(`button`,{type:`button`,onClick:M,className:`popup-close-btn`,id:`btn-close-service-management`,children:`← Return to Studio`})]}),(0,R.jsx)(`p`,{style:{color:`#c4cdd8`,fontSize:`0.94rem`,lineHeight:`1.6`,margin:`0 0 1.2rem 0`},children:`Continuous real-time telemetry, proactive vulnerability patching, and regular performance auditing to keep your digital platform operating at peak efficiency.`}),(0,R.jsxs)(`div`,{className:`service-feature-list`,children:[(0,R.jsxs)(`div`,{className:`service-feature-item`,children:[(0,R.jsx)(`h4`,{children:`⚙ 24/7 Telemetry & Uptime`}),(0,R.jsx)(`p`,{children:`Round-the-clock synthetic monitoring, core web vitals tracking, and automated alert escalation.`})]}),(0,R.jsxs)(`div`,{className:`service-feature-item`,children:[(0,R.jsx)(`h4`,{children:`🛡 Proactive Security Updates`}),(0,R.jsx)(`p`,{children:`Continuous dependency auditing, security patches, firewall tuning, and data backup redundancy.`})]}),(0,R.jsxs)(`div`,{className:`service-feature-item`,children:[(0,R.jsx)(`h4`,{children:`🚀 Continuous Performance Tuning`}),(0,R.jsx)(`p`,{children:`Asset recompression, database index tuning, and regular caching layer optimizations to maintain sub-second load times.`})]}),(0,R.jsxs)(`div`,{className:`service-feature-item`,children:[(0,R.jsx)(`h4`,{children:`🤝 Dedicated Senior Engineering`}),(0,R.jsx)(`p`,{children:`Direct priority engineering support for urgent content updates, feature additions, and custom integrations.`})]})]}),(0,R.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,marginTop:`1.5rem`,paddingTop:`1rem`,borderTop:`1px solid rgba(216, 222, 233, 0.12)`},children:[(0,R.jsx)(`button`,{type:`button`,onClick:()=>l(`contact`),className:`popup-sub-btn`,children:`Contact us for further information →`}),(0,R.jsx)(`button`,{type:`button`,onClick:M,className:`popup-close-btn`,children:`← Return to Studio`})]})]}),c===`service_webdev`&&(0,R.jsxs)(`div`,{className:`device-modal-view`,children:[(0,R.jsxs)(`div`,{className:`popup-header`,children:[(0,R.jsxs)(`div`,{children:[(0,R.jsxs)(`div`,{className:`popup-badge`,children:[(0,R.jsx)(`span`,{className:`popup-badge-dot`}),`SERVICE ARCHITECTURE • WEBSITE DEVELOPMENT`]}),(0,R.jsx)(`h2`,{className:`privacy-title`,style:{margin:`0.4rem 0`},children:`Website Development`}),(0,R.jsx)(`p`,{style:{color:`#dab47c`,fontSize:`0.88rem`,margin:0,fontWeight:600},children:`MODERN SOLUTIONS. REAL RESULTS.`})]}),(0,R.jsx)(`button`,{type:`button`,onClick:M,className:`popup-close-btn`,id:`btn-close-service-webdev`,children:`← Return to Studio`})]}),(0,R.jsx)(`p`,{style:{color:`#c4cdd8`,fontSize:`0.94rem`,lineHeight:`1.6`,margin:`0 0 1.2rem 0`},children:`Full-stack digital engineering built with modern frameworks, WebGL2, and custom Three.js rendering pipelines delivering instant responsiveness.`}),(0,R.jsxs)(`div`,{className:`service-feature-list`,children:[(0,R.jsxs)(`div`,{className:`service-feature-item`,children:[(0,R.jsx)(`h4`,{children:`⟨ / ⟩ Modern Web Architecture`}),(0,R.jsx)(`p`,{children:`Engineered with React, Next.js, and Vite for lightning-fast server-side rendering and client hydration.`})]}),(0,R.jsxs)(`div`,{className:`service-feature-item`,children:[(0,R.jsx)(`h4`,{children:`🌐 Interactive 3D & WebGL2`}),(0,R.jsx)(`p`,{children:`Photorealistic 360 virtual tours, custom GLSL shaders, and spatial interactive models running at a locked 60 FPS.`})]}),(0,R.jsxs)(`div`,{className:`service-feature-item`,children:[(0,R.jsx)(`h4`,{children:`🔄 Zero-Latency State Sync`}),(0,R.jsx)(`p`,{children:`Optimized state management and lightweight WebSockets for interactive, multi-user real-time collaborations.`})]}),(0,R.jsxs)(`div`,{className:`service-feature-item`,children:[(0,R.jsx)(`h4`,{children:`📊 Accessible & SEO-Engineered`}),(0,R.jsx)(`p`,{children:`Semantic HTML5, WCAG AA accessibility compliance, and structured microdata for top-tier search rankings.`})]})]}),(0,R.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,marginTop:`1.5rem`,paddingTop:`1rem`,borderTop:`1px solid rgba(216, 222, 233, 0.12)`},children:[(0,R.jsx)(`button`,{type:`button`,onClick:()=>l(`contact`),className:`popup-sub-btn`,children:`Contact us for further information →`}),(0,R.jsx)(`button`,{type:`button`,onClick:M,className:`popup-close-btn`,children:`← Return to Studio`})]})]}),c===`about`&&(0,R.jsxs)(`div`,{className:`device-modal-view`,children:[(0,R.jsxs)(`div`,{className:`popup-header`,children:[(0,R.jsxs)(`div`,{children:[(0,R.jsxs)(`div`,{className:`popup-badge`,children:[(0,R.jsx)(`span`,{className:`popup-badge-dot`}),`EASYBUILDS STUDIO • BRAND PHILOSOPHY`]}),(0,R.jsx)(`h2`,{className:`privacy-title`,style:{margin:`0.4rem 0`},children:`EasyBuilds Luxury Studio`}),(0,R.jsx)(`p`,{style:{color:`#dab47c`,fontSize:`0.88rem`,margin:0,fontWeight:600},children:`BUILT WITH PRECISION. DESIGNED FOR IMPACT.`})]}),(0,R.jsx)(`button`,{type:`button`,onClick:M,className:`popup-close-btn`,id:`btn-close-about`,children:`← Return to Studio`})]}),(0,R.jsx)(`div`,{className:`zone-highlight-card`,children:(0,R.jsx)(`p`,{children:`EasyBuilds is an elite architectural digital creative studio. We combine high-end spatial aesthetics, 3D interactive graphics, and uncompromising engineering discipline to build digital brand presences that captivate and convert.`})}),(0,R.jsxs)(`div`,{className:`telemetry-grid`,children:[(0,R.jsxs)(`div`,{className:`telemetry-card`,children:[(0,R.jsx)(`div`,{className:`telemetry-stat`,children:`12`}),(0,R.jsx)(`div`,{className:`telemetry-label`,children:`Active Projects`}),(0,R.jsx)(`div`,{className:`telemetry-desc`,children:`Global Brand Engagements`})]}),(0,R.jsxs)(`div`,{className:`telemetry-card`,children:[(0,R.jsx)(`div`,{className:`telemetry-stat`,children:`96%`}),(0,R.jsx)(`div`,{className:`telemetry-label`,children:`Client Satisfaction`}),(0,R.jsx)(`div`,{className:`telemetry-desc`,children:`Verified Enterprise Rating`})]}),(0,R.jsxs)(`div`,{className:`telemetry-card`,children:[(0,R.jsx)(`div`,{className:`telemetry-stat`,children:`24/7`}),(0,R.jsx)(`div`,{className:`telemetry-label`,children:`Dedicated Support`}),(0,R.jsx)(`div`,{className:`telemetry-desc`,children:`Zero Synchronous Stall`})]}),(0,R.jsxs)(`div`,{className:`telemetry-card`,children:[(0,R.jsx)(`div`,{className:`telemetry-stat`,children:`4`}),(0,R.jsx)(`div`,{className:`telemetry-label`,children:`Core Disciplines`}),(0,R.jsx)(`div`,{className:`telemetry-desc`,children:`Dev, Design, Host, Manage`})]})]}),(0,R.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,marginTop:`1.5rem`,paddingTop:`1rem`,borderTop:`1px solid rgba(216, 222, 233, 0.12)`},children:[(0,R.jsx)(`button`,{type:`button`,onClick:()=>l(`contact`),className:`popup-sub-btn`,children:`Contact us for further information →`}),(0,R.jsx)(`button`,{type:`button`,onClick:M,className:`popup-close-btn`,children:`← Return to Studio`})]})]}),c===`zone_lounge`&&(0,R.jsxs)(`div`,{className:`device-modal-view`,children:[(0,R.jsxs)(`div`,{className:`popup-header`,children:[(0,R.jsxs)(`div`,{children:[(0,R.jsxs)(`div`,{className:`popup-badge`,children:[(0,R.jsx)(`span`,{className:`popup-badge-dot`}),`STUDIO ENVIRONMENT • EXECUTIVE LOUNGE`]}),(0,R.jsx)(`h2`,{className:`privacy-title`,style:{margin:`0.4rem 0`},children:`Executive Lounge & Skyline Vista`}),(0,R.jsx)(`p`,{style:{color:`#dab47c`,fontSize:`0.88rem`,margin:0,fontWeight:600},children:`CLIENT RECEPTION & VISIONARY CONSULTATIONS`})]}),(0,R.jsx)(`button`,{type:`button`,onClick:M,className:`popup-close-btn`,children:`← Return to Studio`})]}),(0,R.jsx)(`div`,{className:`zone-highlight-card`,children:(0,R.jsx)(`p`,{children:`Positioned alongside floor-to-ceiling panoramic glass overlooking the metropolitan night skyline, the executive lounge provides a sophisticated space for client consultations, creative briefings, and strategic project roadmapping.`})}),(0,R.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,marginTop:`1.5rem`,paddingTop:`1rem`,borderTop:`1px solid rgba(216, 222, 233, 0.12)`},children:[(0,R.jsx)(`button`,{type:`button`,onClick:()=>l(`contact`),className:`popup-sub-btn`,children:`Schedule a Consultation →`}),(0,R.jsx)(`button`,{type:`button`,onClick:M,className:`popup-close-btn`,children:`← Return to Studio`})]})]}),c===`zone_shelves`&&(0,R.jsxs)(`div`,{className:`device-modal-view`,children:[(0,R.jsxs)(`div`,{className:`popup-header`,children:[(0,R.jsxs)(`div`,{children:[(0,R.jsxs)(`div`,{className:`popup-badge`,children:[(0,R.jsx)(`span`,{className:`popup-badge-dot`}),`STUDIO ENVIRONMENT • ARCHITECTURAL ARCHIVE`]}),(0,R.jsx)(`h2`,{className:`privacy-title`,style:{margin:`0.4rem 0`},children:`Architectural Archive & Material Library`}),(0,R.jsx)(`p`,{style:{color:`#dab47c`,fontSize:`0.88rem`,margin:0,fontWeight:600},children:`DESIGN LITERATURE, CURATED ARTIFACTS & AMBER BACKLIGHTING`})]}),(0,R.jsx)(`button`,{type:`button`,onClick:M,className:`popup-close-btn`,children:`← Return to Studio`})]}),(0,R.jsx)(`div`,{className:`zone-highlight-card`,children:(0,R.jsx)(`p`,{children:`Recessed vertical timber slats illuminated by warm amber LED channels hold our studio design monographs, physical material samples, typographic reference specimens, and architectural trophies.`})}),(0,R.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,marginTop:`1.5rem`,paddingTop:`1rem`,borderTop:`1px solid rgba(216, 222, 233, 0.12)`},children:[(0,R.jsx)(`button`,{type:`button`,onClick:()=>l(`contact`),className:`popup-sub-btn`,children:`Contact us for further information →`}),(0,R.jsx)(`button`,{type:`button`,onClick:M,className:`popup-close-btn`,children:`← Return to Studio`})]})]}),c===`zone_entrance`&&(0,R.jsxs)(`div`,{className:`device-modal-view`,children:[(0,R.jsxs)(`div`,{className:`popup-header`,children:[(0,R.jsxs)(`div`,{children:[(0,R.jsxs)(`div`,{className:`popup-badge`,children:[(0,R.jsx)(`span`,{className:`popup-badge-dot`}),`STUDIO ENVIRONMENT • ARRIVAL SUITE`]}),(0,R.jsx)(`h2`,{className:`privacy-title`,style:{margin:`0.4rem 0`},children:`Studio Arrival & Gallery Reception`}),(0,R.jsx)(`p`,{style:{color:`#dab47c`,fontSize:`0.88rem`,margin:0,fontWeight:600},children:`PRIVATE ARCHITECTURAL SUITE ENTRANCE`})]}),(0,R.jsx)(`button`,{type:`button`,onClick:M,className:`popup-close-btn`,children:`← Return to Studio`})]}),(0,R.jsx)(`div`,{className:`zone-highlight-card`,children:(0,R.jsx)(`p`,{children:`Framed in polished dark timber and floor-level architectural guidance lights, our private gallery reception guides visitors directly from the central concourse into the immersive EasyBuilds workspace.`})}),(0,R.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,marginTop:`1.5rem`,paddingTop:`1rem`,borderTop:`1px solid rgba(216, 222, 233, 0.12)`},children:[(0,R.jsx)(`button`,{type:`button`,onClick:()=>l(`contact`),className:`popup-sub-btn`,children:`Contact us for further information →`}),(0,R.jsx)(`button`,{type:`button`,onClick:M,className:`popup-close-btn`,children:`← Return to Studio`})]})]}),c===`zone_whiteboard`&&(0,R.jsxs)(`div`,{className:`device-modal-view`,children:[(0,R.jsxs)(`div`,{className:`popup-header`,children:[(0,R.jsxs)(`div`,{children:[(0,R.jsxs)(`div`,{className:`popup-badge`,children:[(0,R.jsx)(`span`,{className:`popup-badge-dot`}),`STUDIO ENVIRONMENT • SPRINT PLANNING`]}),(0,R.jsx)(`h2`,{className:`privacy-title`,style:{margin:`0.4rem 0`},children:`Ideas to Impact • Sprint Planning Whiteboard`}),(0,R.jsx)(`p`,{style:{color:`#dab47c`,fontSize:`0.88rem`,margin:0,fontWeight:600},children:`PLAN. DESIGN. DEVELOP. DEPLOY. GROW.`})]}),(0,R.jsx)(`button`,{type:`button`,onClick:M,className:`popup-close-btn`,children:`← Return to Studio`})]}),(0,R.jsx)(`div`,{className:`zone-highlight-card`,children:(0,R.jsx)(`p`,{children:`The rear collaborative whiteboard tracks our active agile trajectories across Client Projects, New WebGL Features, Performance Optimization, Marketing, and Team Growth. Every architectural milestone is tracked from initial concept to live global deployment.`})}),(0,R.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,marginTop:`1.5rem`,paddingTop:`1rem`,borderTop:`1px solid rgba(216, 222, 233, 0.12)`},children:[(0,R.jsx)(`button`,{type:`button`,onClick:()=>l(`contact`),className:`popup-sub-btn`,children:`Contact us for further information →`}),(0,R.jsx)(`button`,{type:`button`,onClick:M,className:`popup-close-btn`,children:`← Return to Studio`})]})]}),c===`services`&&(0,R.jsxs)(`div`,{className:`device-modal-view`,children:[(0,R.jsxs)(`div`,{className:`popup-header`,children:[(0,R.jsxs)(`div`,{children:[(0,R.jsxs)(`div`,{className:`popup-badge`,children:[(0,R.jsx)(`span`,{className:`popup-badge-dot`}),`MONITOR 3 • DIGITAL SOLUTIONS`]}),(0,R.jsx)(`h2`,{className:`privacy-title`,style:{margin:`0.4rem 0`},children:`Our Services & Infrastructure`}),(0,R.jsx)(`p`,{style:{color:`#8f9ba8`,fontSize:`0.88rem`,margin:0},children:`Complete digital solutions for modern businesses.`})]}),(0,R.jsx)(`button`,{type:`button`,onClick:M,className:`popup-close-btn`,id:`btn-close-services`,children:`← Return to Studio`})]}),(0,R.jsxs)(`div`,{className:`services-modal-grid`,children:[(0,R.jsxs)(`div`,{className:`service-modal-card`,children:[(0,R.jsx)(`div`,{className:`service-modal-icon`,children:`⟨ / ⟩`}),(0,R.jsx)(`h4`,{className:`service-modal-name`,children:`Website Development`}),(0,R.jsx)(`p`,{className:`service-modal-sub`,children:`Modern, scalable web applications`}),(0,R.jsx)(`p`,{className:`service-modal-desc`,children:`Full-stack applications built with React, Next.js, WebGL2, and custom Three.js rendering pipelines with zero-latency state synchronization.`})]}),(0,R.jsxs)(`div`,{className:`service-modal-card`,children:[(0,R.jsx)(`div`,{className:`service-modal-icon`,children:`✦`}),(0,R.jsx)(`h4`,{className:`service-modal-name`,children:`UI / UX Design`}),(0,R.jsx)(`p`,{className:`service-modal-sub`,children:`User-centered digital experiences`}),(0,R.jsx)(`p`,{className:`service-modal-desc`,children:`Bespoke dark luxury design systems, spatial interfaces, high-fidelity wireframes, and ergonomic typography engineered for high conversions.`})]}),(0,R.jsxs)(`div`,{className:`service-modal-card`,children:[(0,R.jsx)(`div`,{className:`service-modal-icon`,children:`☁`}),(0,R.jsx)(`h4`,{className:`service-modal-name`,children:`Hosting & Deployment`}),(0,R.jsx)(`p`,{className:`service-modal-sub`,children:`Reliable infrastructure solutions`}),(0,R.jsx)(`p`,{className:`service-modal-desc`,children:`Multi-region Edge CDN routing, automated CI/CD pipelines, SSL encryption, and high-availability architecture with a 99.99% uptime SLA.`})]}),(0,R.jsxs)(`div`,{className:`service-modal-card`,children:[(0,R.jsx)(`div`,{className:`service-modal-icon`,children:`⚙`}),(0,R.jsx)(`h4`,{className:`service-modal-name`,children:`Website Management`}),(0,R.jsx)(`p`,{className:`service-modal-sub`,children:`Ongoing support and optimization`}),(0,R.jsx)(`p`,{className:`service-modal-desc`,children:`Continuous security auditing, database tuning, real-time performance telemetry, and dedicated senior engineering support.`})]})]}),(0,R.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,marginTop:`1.5rem`,paddingTop:`1rem`,borderTop:`1px solid rgba(216, 222, 233, 0.12)`},children:[(0,R.jsx)(`button`,{type:`button`,onClick:()=>l(`contact`),className:`popup-sub-btn`,children:`Schedule a Consultation →`}),(0,R.jsx)(`button`,{type:`button`,onClick:M,className:`popup-close-btn`,children:`← Return to Studio`})]})]}),c===`studio`&&(0,R.jsxs)(`div`,{className:`device-modal-view`,children:[(0,R.jsxs)(`div`,{className:`popup-header`,children:[(0,R.jsxs)(`div`,{children:[(0,R.jsxs)(`div`,{className:`popup-badge`,children:[(0,R.jsx)(`span`,{className:`popup-badge-dot`}),`LAPTOP WORKSPACE • EASYBUILDS STUDIO`]}),(0,R.jsx)(`h2`,{className:`privacy-title`,style:{margin:`0.4rem 0`},children:`EasyBuilds Studio Creative Engine`}),(0,R.jsx)(`p`,{style:{color:`#dab47c`,fontSize:`0.88rem`,margin:0,fontWeight:600},children:`CREATING DIGITAL IMPACT`})]}),(0,R.jsx)(`button`,{type:`button`,onClick:M,className:`popup-close-btn`,id:`btn-close-studio`,children:`← Return to Studio`})]}),(0,R.jsx)(`p`,{style:{color:`#9aa5b6`,fontSize:`0.95rem`,lineHeight:`1.55`,margin:`0 0 1.25rem 0`},children:`The EasyBuilds mobile studio terminal provides live diagnostics and synchronization with our primary workstation array.`}),(0,R.jsxs)(`div`,{className:`telemetry-grid`,children:[(0,R.jsxs)(`div`,{className:`telemetry-card`,children:[(0,R.jsx)(`div`,{className:`telemetry-stat`,children:`WebGL2`}),(0,R.jsx)(`div`,{className:`telemetry-label`,children:`Renderer Pipeline`}),(0,R.jsx)(`div`,{className:`telemetry-desc`,children:`Native PBR Shader Model`})]}),(0,R.jsxs)(`div`,{className:`telemetry-card`,children:[(0,R.jsx)(`div`,{className:`telemetry-stat`,children:`Cook-Torrance`}),(0,R.jsx)(`div`,{className:`telemetry-label`,children:`BRDF Specular`}),(0,R.jsx)(`div`,{className:`telemetry-desc`,children:`GGX Microfacet Model`})]}),(0,R.jsxs)(`div`,{className:`telemetry-card`,children:[(0,R.jsx)(`div`,{className:`telemetry-stat`,children:`ACES Filmic`}),(0,R.jsx)(`div`,{className:`telemetry-label`,children:`Color Grading`}),(0,R.jsx)(`div`,{className:`telemetry-desc`,children:`Photorealistic Dynamic Range`})]}),(0,R.jsxs)(`div`,{className:`telemetry-card`,children:[(0,R.jsx)(`div`,{className:`telemetry-stat`,children:`60 FPS`}),(0,R.jsx)(`div`,{className:`telemetry-label`,children:`Frame Budget`}),(0,R.jsx)(`div`,{className:`telemetry-desc`,children:`Zero Synchronous Stall`})]})]}),(0,R.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,marginTop:`1.5rem`,paddingTop:`1rem`,borderTop:`1px solid rgba(216, 222, 233, 0.12)`},children:[(0,R.jsx)(`button`,{type:`button`,onClick:()=>l(`contact`),className:`popup-sub-btn`,children:`Contact EasyBuilds Team →`}),(0,R.jsx)(`button`,{type:`button`,onClick:M,className:`popup-close-btn`,children:`← Return to Studio`})]})]})]})]})}),m&&(0,R.jsx)(`div`,{className:`robot-flight-carrier`,style:{"--robot-start-x":`${g.startX}px`,"--robot-start-y":`${g.startY}px`,"--robot-end-x":`${g.endX}px`,"--robot-end-y":`${g.endY}px`},children:(0,R.jsx)(It,{size:34,isFloating:!0})}),(0,R.jsxs)(`div`,{id:`eb-chat-window`,className:f?``:`eb-hidden`,role:`dialog`,"aria-label":`EasyBuilds Assistant`,children:[(0,R.jsx)(`div`,{className:`chat-galaxy-layer`,"aria-hidden":`true`,style:{position:`absolute`,inset:0,zIndex:0,overflow:`hidden`,pointerEvents:`none`,borderRadius:`16px`},children:(0,R.jsx)(vt,{density:1.1,glowIntensity:.35,flareIntensity:1,starSpeed:.4,saturation:0,hueShift:0,starColors:[`#ffffff`,`#e8edf5`,`#b6beca`,`#747d8c`],transparent:!1,mouseRepulsion:!0,clickWarp:!0,disableAnimation:!f})}),(0,R.jsxs)(`div`,{className:`eb-chat-header`,style:{position:`relative`,zIndex:1},children:[(0,R.jsxs)(`div`,{className:`eb-chat-title`,children:[(0,R.jsx)(`span`,{className:`eb-status-indicator`}),(0,R.jsx)(It,{size:20,isFloating:!0}),`EasyBuilds Assistant`]}),(0,R.jsx)(`button`,{id:`eb-chat-close`,"aria-label":`Close chat`,onClick:F,children:`×`})]}),(0,R.jsxs)(`div`,{id:`eb-chat-messages`,className:`eb-chat-messages`,style:{position:`relative`,zIndex:1},children:[y.map((e,t)=>(0,R.jsx)(`div`,{className:`eb-chat-bubble ${e.sender===`user`?`user`:`assistant`}`,children:Lt(e.text)},t)),(0,R.jsx)(`div`,{ref:C})]}),(0,R.jsx)(`div`,{id:`eb-chat-options`,className:`eb-chat-options`,style:{position:`relative`,zIndex:1},children:Nt.map(e=>(0,R.jsx)(`button`,{type:`button`,className:`eb-chip-btn`,onClick:()=>z(e),children:e.question},e.id))}),(0,R.jsxs)(`form`,{id:`eb-chat-form`,className:`eb-chat-form`,onSubmit:ee,style:{position:`relative`,zIndex:1},children:[(0,R.jsx)(`input`,{type:`text`,id:`eb-chat-input`,placeholder:`Type a question or select above...`,autoComplete:`off`,value:x,onChange:e=>S(e.target.value)}),(0,R.jsx)(`button`,{type:`submit`,id:`eb-chat-send`,children:`Send`})]})]})]})}),zt=class extends I.Component{constructor(e){super(e),this.state={hasError:!1}}static getDerivedStateFromError(){return{hasError:!0}}componentDidCatch(e){console.warn(`WebGPU initialization failed:`,e)}render(){return this.state.hasError?null:this.props.children}};function Bt(){let e=typeof window<`u`&&window.location.pathname.startsWith(`/contact`),[t,n]=(0,I.useState)(!1),[r,i]=(0,I.useState)(!1),[a,o]=(0,I.useState)(e),s=(0,I.useRef)(null);return(0,I.useEffect)(()=>{ot()},[]),(0,I.useEffect)(()=>{let e=()=>{window.location.pathname.startsWith(`/contact`)?(o(!0),s.current&&s.current.setCameraView(`overview`)):(o(!1),i(!1),s.current&&s.current.setCameraView(`entryway`))};return window.addEventListener(`popstate`,e),()=>window.removeEventListener(`popstate`,e)},[]),(0,R.jsxs)(`main`,{className:`cinematic-root ${r?`is-dispersing`:``}`,children:[(0,R.jsx)(Rt,{ref:s,initialView:e?`overview`:`entryway`,isActive:a}),!a&&(0,R.jsxs)(`section`,{className:`contact-screen ${r?`dispersing`:``}`,"aria-label":`Contact Us Screen`,children:[(0,R.jsx)(`div`,{className:`contact-background ${r?`dispersing`:``}`,style:{width:`100%`,height:`100%`,position:`absolute`,inset:0},children:!t&&(0,R.jsx)(zt,{children:(0,R.jsx)(tt,{shardColor:`#a1a1aa`,accentColor:`#e4e4e7`,placement:`full`,material:`chrome`,markers:`plus`,count:800,depthOfField:.75,vignette:.3,mouseInteraction:!r,pulseOnClick:!r,holdToGather:!r,billow:.7,glow:.25,disperse:r,onError:()=>n(!0)})})}),r&&(0,R.jsx)(`div`,{className:`cinematic-impact-flash`,"aria-hidden":`true`}),(0,R.jsxs)(`div`,{className:`contact-foreground ${r?`dispersing`:``}`,children:[(0,R.jsx)(`div`,{className:`contact-heading-wrap ${r?`dispersing`:``}`,children:(0,R.jsx)(se,{text:`CONTACT US`,warpStrength:.08,warpScale:1.7,speed:.55,lens:`bulge`,pointerInfluence:r?0:.42,pointerStrength:r?0:.38,refraction:.018,chromatic:r?.6:.35,idleDrift:.2,ripple:!0,clickRipple:!1,intro:!1,fontSize:`clamp(3rem, 7vw, 6.5rem)`,fontWeight:800,fontFamily:`inherit`,style:{height:`clamp(140px, 24vh, 260px)`,width:`100%`},color:`#ffffff`,letterSpacing:`-0.06em`})}),(0,R.jsx)(`div`,{className:`contact-cta-wrap ${r?`dispersing`:``}`,children:(0,R.jsx)(fe,{size:`lg`,radius:18,tint:`#0f0f0f`,tintOpacity:.74,blur:12,textColor:`#ffffff`,lineColor:`#ffffff`,baseColor:`#525252`,intensity:1,idleIntensity:.35,shineSize:10,shineFade:34,thickness:1.2,glow:1,followMouse:!r,proximity:250,onClick:()=>{r||(i(!0),s.current&&s.current.startEntrance(2200),typeof window<`u`&&window.history&&window.history.pushState&&window.history.pushState({},``,`/contact`),setTimeout(()=>{o(!0)},2200))},disabled:r,children:`LET'S GO`})})]})]})]})}(0,L.createRoot)(document.getElementById(`root`)).render((0,R.jsx)(I.StrictMode,{children:(0,R.jsx)(Bt,{})}));