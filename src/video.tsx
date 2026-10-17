import React from 'react';
import {
  AbsoluteFill, Audio, Easing, Img, Sequence, interpolate,
  spring, staticFile, useCurrentFrame,
} from 'remotion';
import {Trail} from '@remotion/motion-blur';
import {campaign as C} from './config';

const K = C.colors;
const ease = Easing.bezier(.22, 1, .36, 1);
const clamped = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const tween = (f: number, a: number, b: number, x = 0, y = 1) =>
  interpolate(f, [a, b], [x, y], {...clamped, easing: ease});
const linear = (f: number, a: number, b: number, x = 0, y = 1) =>
  interpolate(f, [a, b], [x, y], clamped);
const at = (left: number, top: number, more: React.CSSProperties = {}): React.CSSProperties =>
  ({position: 'absolute', left, top, ...more});

const Plus: React.FC<{x: number; y: number; color?: string; size?: number}> = ({x,y,color=K.black,size=24}) =>
  <svg style={at(x,y)} width={size} height={size} viewBox="0 0 24 24"><path d="M12 1v22M1 12h22" stroke={color} strokeWidth="2"/></svg>;

const ShirtArt: React.FC<{color?: string}> = ({color='#FBFAF5'}) => <svg width="100%" height="100%" viewBox="0 0 700 800">
  <defs>
    <linearGradient id="shirt-light" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor={color}/><stop offset=".53" stopColor={color}/><stop offset="1" stopColor="#D4D1C6"/>
    </linearGradient>
    <linearGradient id="shirt-fold"><stop stopColor="#BAB9AC" stopOpacity=".02"/><stop offset=".5" stopColor="#B5B4A8" stopOpacity=".4"/><stop offset="1" stopColor="#F5F3EA" stopOpacity="0"/></linearGradient>
    <filter id="shadow" x="-40%" y="-30%" width="180%" height="180%"><feDropShadow dx="12" dy="26" stdDeviation="20" floodColor="#171915" floodOpacity=".16"/></filter>
  </defs>
  <g filter="url(#shadow)">
    <path d="M222 93 282 68Q350 117 418 68L478 93 641 237 550 365 490 322 511 699Q350 727 189 699L210 322 150 365 59 237Z" fill="url(#shirt-light)" stroke="#D3D1C7" strokeWidth="2"/>
    <path d="M282 68Q350 145 418 68L407 61Q350 110 293 61Z" fill="#C8C5B9"/>
    <path d="M282 68Q350 145 418 68" fill="none" stroke="#F9F8F2" strokeWidth="9"/>
    <path d="m222 93-12 229m268-229 12 229M193 681q157 25 314 0M73 244l81 106m472-106-81 106" fill="none" stroke="#C4C2B7" strokeWidth="2" opacity=".72"/>
    <path d="m237 304 29 358 24-375zm202-56-28 423 36-26zM302 147l-17 183 38-170z" fill="url(#shirt-fold)"/>
    <path d="m218 326 35-28m227 28-35-28M267 650l-10-137m164 146 11-156" fill="none" stroke="#BBB8AC" strokeWidth="2" opacity=".28"/>
  </g>
</svg>;

// The mask reveals the model over type without rescaling or warping her body.
// Coordinates are tied to the supplied illustrative contact sheet only.
const silhouettes = [
  'polygon(40% 3%,55% 2%,66% 5%,69% 11%,65% 15%,76% 18%,82% 28%,77% 33%,71% 33%,75% 44%,75% 59%,79% 77%,89% 91%,87% 94%,75% 95%,61% 91%,52% 82%,48% 75%,46% 88%,40% 91%,31% 90%,31% 86%,31% 69%,31% 53%,32% 46%,24% 45%,23% 39%,26% 30%,29% 26%,31% 19%,40% 16%,36% 12%,35% 7%)',
  'polygon(42% 3%,58% 2%,69% 6%,70% 12%,65% 16%,78% 18%,84% 24%,80% 37%,76% 42%,77% 50%,74% 52%,74% 68%,78% 85%,87% 91%,85% 94%,73% 94%,62% 91%,53% 79%,48% 68%,48% 87%,45% 90%,34% 91%,29% 88%,32% 83%,30% 64%,31% 51%,27% 50%,22% 42%,22% 32%,27% 23%,33% 18%,41% 16%,37% 12%,37% 7%)',
  'polygon(40% 3%,57% 2%,67% 5%,70% 11%,64% 16%,80% 18%,85% 26%,85% 39%,81% 45%,83% 57%,91% 82%,94% 85%,80% 87%,75% 86%,72% 89%,62% 91%,55% 90%,49% 89%,42% 92%,30% 94%,24% 92%,30% 88%,34% 82%,25% 86%,9% 82%,16% 64%,24% 44%,23% 33%,26% 22%,34% 18%,41% 16%,36% 12%,35% 7%)',
];

const Photo: React.FC<{look: number; x: number; y: number; h: number; cutout?: boolean; zoom?: number; opacity?: number}> =
({look,x,y,h,cutout=false,zoom=1,opacity=1}) => {
  const data = C.looks[look];
  const w=h/2;
  return <div style={at(x,y,{width:w,height:h,overflow:'hidden',opacity,clipPath:cutout && data.panel!==null ? silhouettes[look] : undefined,transform:`scale(${zoom})`,transformOrigin:'50% 43%'})}>
    {data.panel===null ? <Img src={staticFile(data.src)} style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:data.objectPosition}}/> :
      <Img src={staticFile(data.src)} style={{position:'absolute',width:w*3,height:h,maxWidth:'none',left:-data.panel*w,top:0}}/>}
  </div>;
};

const Frame: React.FC<{dark?: boolean; chapter: string}> = ({dark=false,chapter}) => {
  const color=dark?K.cream:K.black;
  return <>
    <div className="micro" style={at(82,165,{fontSize:24,color,letterSpacing:'.08em'})}>{C.store}<span style={{fontWeight:500,opacity:.42,marginLeft:22}}>/</span></div>
    <div className="micro" style={at(622,169,{fontSize:17,color,width:365,textAlign:'right',letterSpacing:'.12em'})}>{chapter}</div>
    <div style={at(82,1598,{width:905,borderTop:`1px solid ${dark?'#ffffff40':'#17191540'}`})}/>
    <div className="micro" style={at(82,1623,{fontSize:18,color,letterSpacing:'.1em'})}>{C.copy.tagline}</div>
    <div className="body" style={at(82,1676,{fontSize:25,color:dark?'#B9BDB1':'#626659',letterSpacing:'-.015em'})}>{C.copy.referenceNotice}</div>
  </>;
};

const Lift: React.FC<{text: string; f: number; from: number; size: number; x: number; y: number; color?: string}> =
({text,f,from,size,x,y,color=K.black}) => <div style={at(x,y,{overflow:'hidden',paddingBottom:15,paddingRight:20})}>
  <div className="display" style={{fontSize:size,color,transform:`translateY(${tween(f,from,from+17,115,0)}%)`}}>{text}</div>
</div>;

const HookShirt: React.FC = () => {
  const f=useCurrentFrame();
  const x=tween(f,0,22,570,390)+tween(f,65,88,0,-1520);
  const y=tween(f,0,22,555,660);
  const s=tween(f,0,22,1.19,1)+tween(f,65,88,0,.8);
  const r=tween(f,0,22,-27,-13)+tween(f,65,88,0,-26);
  return <div style={at(x,y,{width:700,height:800,transform:`rotate(${r}deg) scale(${s})`,filter:`blur(${linear(f,67,80,0,1.5)}px)`})}><ShirtArt/></div>;
};

const Hook: React.FC = () => {
  const f=useCurrentFrame();
  const punch=1+tween(f,30,34,.025,0);
  return <AbsoluteFill style={{background:K.cream}}>
    <div style={{position:'absolute',inset:0,transform:`scale(${punch})`}}>
      <div style={at(82,287,{width:72,height:8,background:K.lime})}/>
      <Lift text={C.copy.hookLines[0]} f={f} from={-15} size={280} x={74} y={345}/>
      <Lift text={C.copy.hookLines[1]} f={f} from={-8} size={280} x={74} y={590}/>
      <Trail layers={3} lagInFrames={.35} trailOpacity={.12}><HookShirt/></Trail>
      <div style={at(82,1108,{background:K.lime,width:tween(f,28,39,0,727),height:123,transform:'rotate(-2deg)'})}/>
      <Lift text={C.copy.hookEndLines[0]} f={f} from={30} size={151} x={92} y={1104}/>
      <Lift text={C.copy.hookEndLines[1]} f={f} from={43} size={201} x={78} y={1264}/>
      <div className="micro" style={at(86,1490,{fontSize:19,letterSpacing:'.16em',opacity:tween(f,50,60)})}>{C.copy.strapline}</div>
    </div>
    <Plus x={933} y={317}/><Frame chapter={C.copy.chapters[0]}/>
  </AbsoluteFill>;
};

const Detail: React.FC<{look: number; f: number}> = ({look,f}) => <div style={at(746,1120,{width:230,height:335,overflow:'hidden',background:K.cream,border:`7px solid ${K.cream}`,boxShadow:'0 14px 38px #17191520',transform:`translateY(${tween(f,12,26,100,0)}px) rotate(6deg)`,opacity:tween(f,10,22)})}>
  <div style={{position:'absolute',left:-320,top:-400,width:550,height:1100,transform:'scale(1.55)',transformOrigin:'0 0'}}><Photo look={look} x={0} y={0} h={1100}/></div>
  <div className="micro" style={{position:'absolute',bottom:0,background:K.lime,padding:'12px 14px',fontSize:17,width:'100%',letterSpacing:'.08em'}}>{C.copy.detailLabel}</div>
</div>;

const Presentation: React.FC = () => {
  const f=useCurrentFrame();
  const look=f<45?0:f<90?1:2;
  const local=f-[0,45,90][look];
  const p=spring({frame:local,fps:30,config:{damping:23,stiffness:145,mass:.8}});
  const x=look===0?(1-p)*220:look===1?(1-p)*-130:0;
  const y=look===2?(1-p)*160:0;
  return <AbsoluteFill style={{background:K.cream}}>
    <div className="display" style={at(70,325,{fontSize:265,color:look===1?K.lime:K.black,opacity:.1,transform:`translateX(${linear(local,0,44,70,-20)}px)`})}>{C.copy.backgroundWord}</div>
    <div style={at(140+x,390+y,{width:700,height:1125,overflow:'hidden',clipPath:look===2?`inset(${(1-p)*100}% 0 0 0)`:undefined})}>
      <Photo look={look} x={65} y={0} h={1120} zoom={1.015+local*.00012}/>
    </div>
    <div className="display" style={at(77,985,{fontSize:145,color:K.black,opacity:.11,writingMode:'vertical-rl',transform:'rotate(180deg)'})}>0{look+1}</div>
    <div className="body" style={at(82,260,{fontSize:49,lineHeight:1.22,letterSpacing:'-.045em',whiteSpace:'pre-line'})}>{C.copy.introduction}</div>
    <div className="micro" style={at(82,1513,{fontSize:21,letterSpacing:'.12em'})}>{C.looks[look].label}</div>
    <div style={at(772,1510,{display:'flex',gap:12})}>{[0,1,2].map(i=><div key={i} style={{width:i===look?66:25,height:7,background:i===look?K.black:'#CFD0C5'}}/>)}</div>
    <Detail look={look} f={local}/>
    <Plus x={943} y={410}/><Frame chapter={C.copy.chapters[1]}/>
  </AbsoluteFill>;
};

const Transformation: React.FC = () => {
  const f=useCurrentFrame();
  const look=f<45?0:f<90?1:2;
  const local=f-[0,45,90][look];
  const word=C.copy.verbs[look];
  const size=[208,198,161][look];
  const shift=tween(local,0,19,85,0)+linear(local,20,59,0,-25);
  return <AbsoluteFill style={{background:K.cream}}>
    <div style={at(84,283,{width:916,height:1220,border:'1px solid #17191520'})}/>
    <Photo look={look} x={236} y={286} h={1230}/>
    <div className="display" style={at(64+shift,545,{fontSize:size,color:K.black,whiteSpace:'nowrap'})}>{word}</div>
    <div className="display" style={at(83-shift*.5,755,{fontSize:size,color:'transparent',WebkitTextStroke:`2px ${K.black}`,whiteSpace:'nowrap',opacity:.35})}>{word}</div>
    <Photo look={look} x={236} y={286} h={1230} cutout/>
    <div style={at(83,1402,{background:K.lime,width:162,height:101,display:'flex',alignItems:'center',justifyContent:'center'})}>
      <span className="display" style={{fontSize:76}}>0{look+1}</span>
    </div>
    <div className="micro" style={at(83,1520,{fontSize:29,letterSpacing:'.11em'})}>{word}.</div>
    <Plus x={948} y={307}/><Frame chapter={C.copy.chapters[2]}/>
  </AbsoluteFill>;
};

const Hero: React.FC = () => {
  const f=useCurrentFrame();
  const z=linear(f,0,119,1,1.055);
  return <AbsoluteFill style={{background:K.cream}}>
    <div style={at(535,282,{width:425,height:1115,background:K.lime,transform:`translateY(${tween(f,0,24,80,0)}px)`,opacity:tween(f,0,15)})}/>
    <div style={at(325,273,{width:665,height:1270,overflow:'hidden'})}>
      <Photo look={2} x={0} y={0} h={1270} zoom={z}/>
    </div>
    <div className="display" style={at(78,318,{fontSize:175,lineHeight:.9,width:350,whiteSpace:'pre-line'})}>{C.copy.desireTitle}</div>
    <div className="body" style={at(84,1164,{fontSize:52,lineHeight:1.22,letterSpacing:'-.05em',width:360,whiteSpace:'pre-line',transform:`translateY(${tween(f,13,32,36,0)}px)`,opacity:tween(f,13,28)})}>{C.copy.desireBody}</div>
    <div style={at(85,1370,{height:2,width:tween(f,23,48,0,255),background:K.black})}/>
    <div className="micro" style={at(84,1404,{fontSize:17,lineHeight:1.6,letterSpacing:'.12em',whiteSpace:'pre-line',opacity:tween(f,30,45)})}>{C.copy.heroCaption}</div>
    <div style={at(879,1419,{transform:`rotate(${tween(f,6,35,-45,0)}deg)`,opacity:tween(f,5,22)})}>
      <svg width="67" height="67" viewBox="0 0 67 67"><path d="M8 59 59 8M8 8h51v51" fill="none" stroke={K.black} strokeWidth="4"/></svg>
    </div>
    <Plus x={940} y={300}/><Frame chapter={C.copy.chapters[3]}/>
  </AbsoluteFill>;
};

const End: React.FC = () => {
  // All end-card properties stop changing by 17.8s: 2.2 seconds of clean hold.
  const f=Math.min(useCurrentFrame(),54);
  const reveal=tween(f,0,24);
  return <AbsoluteFill style={{background:K.black,color:K.cream}}>
    <div style={at(701,-240,{width:760,height:760,borderRadius:'50%',border:`1px solid #c6f34a30`,transform:`translateY(${tween(f,0,35,-150,0)}px)`})}/>
    <div style={at(736,-207,{width:690,height:690,borderRadius:'50%',border:`1px solid #c6f34a30`,transform:`translateY(${tween(f,0,35,-150,0)}px)`})}/>
    <div className="micro" style={at(84,305,{fontSize:21,color:K.lime,opacity:tween(f,6,24)})}>{C.copy.strapline}</div>
    <div style={at(73,430,{overflow:'hidden',width:920,paddingBottom:25})}>
      {C.logo ? <Img src={staticFile(C.logo)} style={{width:850,height:360,objectFit:'contain',objectPosition:'left',transform:`translateY(${(1-reveal)*430}px)`}}/> :
        <div className="display" style={{fontSize:493,letterSpacing:'-.045em',transform:`translateY(${(1-reveal)*430}px)`,color:K.cream,lineHeight:.9}}>{C.store}</div>}
    </div>
    <div className="body" style={at(84,952,{fontSize:76,lineHeight:1.15,letterSpacing:'-.05em',whiteSpace:'pre-line',transform:`translateY(${tween(f,10,33,50,0)}px)`,opacity:tween(f,10,28)})}>{C.copy.endHeadline}</div>
    <div style={at(84,1229,{width:902,height:118,background:K.lime,transform:`scaleX(${tween(f,20,40)})`,transformOrigin:'left'})}/>
    <div className="body" style={at(121,1260,{fontSize:39,color:K.black,letterSpacing:'-.025em',opacity:tween(f,29,44)})}>{C.copy.cta}</div>
    <svg style={at(897,1262,{opacity:tween(f,29,44)})} width="46" height="46" viewBox="0 0 46 46"><path d="M5 41 41 5M6 5h35v35" fill="none" stroke={K.black} strokeWidth="3"/></svg>
    <div className="body" style={at(84,1411,{fontSize:47,color:K.cream,letterSpacing:'-.025em',opacity:tween(f,30,49),transform:`translateY(${tween(f,30,49,25,0)}px)`})}>{C.contact}</div>
    <Plus x={943} y={834} color={K.lime}/><Frame dark chapter={C.copy.chapters[4]}/>
  </AbsoluteFill>;
};

const SweepingShirt: React.FC<{cut: number; reverse?: boolean}> = ({cut,reverse=false}) => {
  const f=useCurrentFrame();
  const p=linear(f,cut-10,cut+10);
  if(p<=0||p>=1) return null;
  const x=interpolate(p,[0,.5,1],[reverse?-2600:1700,-700,reverse?1700:-2600]);
  return <div style={at(x,-410,{width:2600,height:2900,transform:`rotate(${reverse?20:-20}deg)`,filter:`blur(${Math.sin(p*Math.PI)*3}px)`})}><ShirtArt color={cut===360?'#D5C2A2':'#F7F5EE'}/></div>;
};

const ClothWipe: React.FC = () => {
  const f=useCurrentFrame();
  const p=linear(f,469,493);
  if(p<=0||p>=1)return null;
  const x=interpolate(p,[0,.5,1],[1300,-100,-2600]);
  return <div style={at(x,-250,{width:2300,height:2450,transform:'rotate(-12deg)',background:K.lime,borderRadius:'40% 0 0 25%',filter:'blur(1px)'})}>
    <div style={{position:'absolute',inset:'0 0 0 230',borderLeft:'2px solid #17191526',transform:'skewX(5deg)'}}/>
    <div style={{position:'absolute',inset:'0 0 0 900',borderLeft:'2px solid #17191518',transform:'skewX(-6deg)'}}/>
  </div>;
};

export const Campaign: React.FC = () => <AbsoluteFill style={{background:K.cream,overflow:'hidden'}}>
  <Audio src={staticFile(C.music)} volume={C.musicVolume}/>
  <Sequence from={0} durationInFrames={90}><Hook/></Sequence>
  <Sequence from={90} durationInFrames={120}><Presentation/></Sequence>
  <Sequence from={210} durationInFrames={150}><Transformation/></Sequence>
  <Sequence from={360} durationInFrames={120}><Hero/></Sequence>
  <Sequence from={480} durationInFrames={120}><End/></Sequence>
  {[90,210,255,300,360].map(cut=><Trail key={cut} layers={2} lagInFrames={.25} trailOpacity={.07}><SweepingShirt cut={cut} reverse={cut===255}/></Trail>)}
  <ClothWipe/>
</AbsoluteFill>;
