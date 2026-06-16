import { useState, useRef, useEffect, useCallback } from "react";

// ─── CATEGORIES ───────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id:"all",         label:"Alla inlägg",     icon:"🏠", color:"#C9A84C" },
  { id:"spel",        label:"Spel & Tips",      icon:"🎯", color:"#4CAF50" },
  { id:"travpolitik", label:"Travpolitik",       icon:"🏛️", color:"#2196F3" },
  { id:"atg",         label:"ATG",              icon:"🟢", color:"#00897B" },
  { id:"atglive",     label:"ATG Live",          icon:"📺", color:"#E53935" },
  { id:"travtv",      label:"TravTV",            icon:"🎙️", color:"#8E24AA" },
  { id:"andelspel",   label:"Andelspel / Lag",   icon:"🤝", color:"#FB8C00" },
  { id:"snack",       label:"Allmänt travsnack", icon:"💬", color:"#607D8B" },
];

const GIF_LIST = [
  { id:1, url:"https://media.giphy.com/media/xT9IgFLBcm3Wi6LXVS/giphy.gif" },
  { id:2, url:"https://media.giphy.com/media/VFDeGtRSHswfe/giphy.gif" },
  { id:3, url:"https://media.giphy.com/media/3oz8xRF0v9WMAUVLNK/giphy.gif" },
  { id:4, url:"https://media.giphy.com/media/26BRBupa6nRXMGBni/giphy.gif" },
  { id:5, url:"https://media.giphy.com/media/xT1XGZy3fX47dYQo7e/giphy.gif" },
  { id:6, url:"https://media.giphy.com/media/l2Je31Gv9hMNMBhLW/giphy.gif" },
];

const avatarColors = ["#C9A84C","#4CAF50","#2196F3","#00897B","#E53935","#8E24AA","#FB8C00","#607D8B"];
const avatarColor = (s) => avatarColors[(s||"X").charCodeAt(0) % avatarColors.length];

const USERS = [
  { id:"u1", name:"TravarJohan", handle:"@travar_johan", avatar:"TJ", followers:1200, following:340, verified:true,  bio:"V75-spelare sedan 1998. Solvalla är mitt hem. 🐎", posts:142 },
  { id:"u2", name:"ATGfansen",   handle:"@atgfansen",   avatar:"AF", followers:834,  following:210, verified:false, bio:"ATG-entusiast och oddsnörd. Alltid på jakt efter systemet.", posts:89 },
  { id:"u3", name:"TravTV Offi", handle:"@travtv",      avatar:"TV", followers:12000,following:12,  verified:true,  bio:"Officiell TravTV. Sändningar varje torsdag & lördag.", posts:432 },
  { id:"u4", name:"AndelsMalin", handle:"@andelsmalin",  avatar:"AM", followers:290,  following:180, verified:false, bio:"Andelspelaren från Göteborg. Söker alltid lagkamrater!", posts:56 },
];

const MOCK_POSTS = [
  { id:1, category:"spel",        author:"TravarJohan", avatar:"TJ", time:"3 min sedan",  content:"V75 idag ser riktigt spännande ut! Har dubbelbankat Zet Bi i lopp 4 – vad tror ni? 🎯", likes:14, replies:[], verified:true,  following:false, media:[{ type:"image", url:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80" }] },
  { id:2, category:"atglive",     author:"LiveSandvik", avatar:"LS", time:"11 min sedan", content:"ATG Live sänder från Solvalla just nu 🔴 Lopp 2 kördes precis. Imponerande tid av Global Swift!", likes:32, replies:[{ id:201, author:"TravarJohan", avatar:"TJ", content:"Hur gick det i sista kurvan?", time:"8 min" },{ id:202, author:"ATGfansen", avatar:"AF", content:"Otrolig spurt! 👏", time:"5 min" }], verified:true, following:true, media:[] },
  { id:3, category:"andelspel",   author:"AndelsMalin", avatar:"AM", time:"22 min sedan", content:"Vi söker 2 till i andelslaget inför V86 nästa lördag. Budget: 500 kr/pers. Hör av er! 🤝", likes:7, replies:[], verified:false, following:false, media:[] },
  { id:4, category:"travpolitik", author:"TravsportNord",avatar:"TN", time:"45 min sedan", content:"Ny rapport: Antalet starter per häst minskar kraftigt. Är regelverket för strängt?", likes:28, replies:[], verified:true, following:false, media:[{ type:"gif", url:"https://media.giphy.com/media/xT9IgFLBcm3Wi6LXVS/giphy.gif" }] },
  { id:5, category:"travtv",      author:"KommentatorK", avatar:"KK", time:"1 tim sedan",  content:"TravTV-avsnittet med Örjan Kihlström var GULD. Hans analys av V75 höjer ribban! 🎙️", likes:55, replies:[], verified:true, following:true, media:[{ type:"image", url:"https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&q=80" },{ type:"image", url:"https://images.unsplash.com/photo-1504898770365-14faca6a7320?w=600&q=80" }] },
  { id:6, category:"snack",       author:"TravfaranLisa",avatar:"TL", time:"3 tim sedan",  content:"Vilket är ert bästa travminne? Mitt: Se Ulf Ohlsson vinna Elitloppet 2011 på Solvalla 🐎✨", likes:88, replies:[], verified:false, following:false, media:[] },
];

const INIT_DMS = [
  { id:"dm1", with:"TravarJohan", avatar:"TJ", msgs:[{ from:"TravarJohan", text:"Hej! Ska du spela V75 idag?", time:"10:22" },{ from:"me", text:"Ja! Har ett bra system klart 🎯", time:"10:24" }], unread:0 },
  { id:"dm2", with:"ATGfansen",   avatar:"AF", msgs:[{ from:"ATGfansen", text:"Kika på lopp 3, oddsen är galna!", time:"09:14" }], unread:1 },
];

// ─── THEME ────────────────────────────────────────────────────────────────────
const DARK = {
  bg:"#0A1A0F", surface:"#0D2818", surface2:"#0F2215", border:"#1E3A24",
  border2:"#2A4030", text:"#F5F0E8", text2:"#A0B8A5", text3:"#5A7A60",
  accent:"#C9A84C", accentBg:"#C9A84C22", input:"#071510",
};
const LIGHT = {
  bg:"#F0F7F2", surface:"#FFFFFF", surface2:"#EAF2EC", border:"#C8DDD0",
  border2:"#AACCB5", text:"#0D2818", text2:"#2A5A38", text3:"#5A8A65",
  accent:"#1A6B30", accentBg:"#1A6B3015", input:"#FFFFFF",
};

// ─── HOOKS ────────────────────────────────────────────────────────────────────
function useIsMobile() {
  const [m, setM] = useState(window.innerWidth < 700);
  useEffect(() => { const h = () => setM(window.innerWidth < 700); window.addEventListener("resize",h); return () => window.removeEventListener("resize",h); },[]);
  return m;
}

// ─── MEDIA GRID ───────────────────────────────────────────────────────────────
function MediaGrid({ media, onExpand }) {
  if (!media?.length) return null;
  const n = media.length;
  const grid = n===1 ? {} : n===2 ? { display:"grid", gridTemplateColumns:"1fr 1fr", gap:3 } : n===3 ? { display:"grid", gridTemplateColumns:"2fr 1fr", gridTemplateRows:"1fr 1fr", gap:3 } : { display:"grid", gridTemplateColumns:"1fr 1fr", gridTemplateRows:"1fr 1fr", gap:3 };
  return (
    <div style={{ ...grid, borderRadius:14, overflow:"hidden", marginBottom:10, maxHeight:340 }}>
      {media.slice(0,4).map((m,i) => (
        <div key={i} onClick={e=>{e.stopPropagation();onExpand&&onExpand(i);}} style={{ position:"relative", overflow:"hidden", cursor:"pointer", minHeight:n>1?100:undefined, maxHeight:n===1?320:undefined, gridRow:n===3&&i===0?"1/3":undefined }}>
          {m.type==="video" ? <video src={m.url} poster={m.thumb} controls style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} onClick={e=>e.stopPropagation()} />
          : <img src={m.url} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />}
          {m.type==="gif" && <div style={{ position:"absolute", top:6, left:6, background:"#000A", borderRadius:5, padding:"1px 7px", fontSize:10, color:"#C9A84C", fontWeight:800 }}>GIF</div>}
          {m.type==="video" && <div style={{ position:"absolute", top:6, left:6, background:"#000A", borderRadius:5, padding:"1px 7px", fontSize:10, color:"#fff", fontWeight:800 }}>▶ VIDEO</div>}
          {n>4&&i===3 && <div style={{ position:"absolute", inset:0, background:"#000A", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, fontWeight:800, color:"#fff" }}>+{n-4}</div>}
        </div>
      ))}
    </div>
  );
}

// ─── LIGHTBOX ────────────────────────────────────────────────────────────────
function Lightbox({ media, startIndex, onClose }) {
  const [idx, setIdx] = useState(startIndex||0);
  const m = media[idx];
  useEffect(()=>{
    const h = e => { if(e.key==="Escape")onClose(); if(e.key==="ArrowRight")setIdx(i=>Math.min(i+1,media.length-1)); if(e.key==="ArrowLeft")setIdx(i=>Math.max(i-1,0)); };
    window.addEventListener("keydown",h); return ()=>window.removeEventListener("keydown",h);
  },[media.length,onClose]);
  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, background:"#000D", zIndex:500, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column" }}>
      <button onClick={onClose} style={{ position:"absolute", top:16, right:20, background:"none", border:"none", color:"#fff", fontSize:30, cursor:"pointer" }}>✕</button>
      <div onClick={e=>e.stopPropagation()} style={{ maxWidth:"92vw", maxHeight:"82vh" }}>
        {m.type==="video" ? <video src={m.url} controls autoPlay style={{ maxWidth:"92vw", maxHeight:"82vh", borderRadius:12 }} />
        : <img src={m.url} alt="" style={{ maxWidth:"92vw", maxHeight:"82vh", borderRadius:12, objectFit:"contain" }} />}
      </div>
      {media.length>1 && <div style={{ display:"flex", gap:10, marginTop:14 }}>{media.map((_,i)=><div key={i} onClick={e=>{e.stopPropagation();setIdx(i);}} style={{ width:8, height:8, borderRadius:"50%", background:i===idx?"#C9A84C":"#fff4", cursor:"pointer" }} />)}</div>}
      {idx>0 && <button onClick={e=>{e.stopPropagation();setIdx(i=>i-1);}} style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", background:"#0008", border:"1px solid #fff3", color:"#fff", fontSize:22, borderRadius:"50%", width:42, height:42, cursor:"pointer" }}>‹</button>}
      {idx<media.length-1 && <button onClick={e=>{e.stopPropagation();setIdx(i=>i+1);}} style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"#0008", border:"1px solid #fff3", color:"#fff", fontSize:22, borderRadius:"50%", width:42, height:42, cursor:"pointer" }}>›</button>}
    </div>
  );
}

// ─── GIF PICKER ──────────────────────────────────────────────────────────────
function GifPicker({ onSelect, onClose, t }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"#000A", zIndex:300, display:"flex", alignItems:"flex-end", justifyContent:"center" }} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{ background:t.surface, borderRadius:"20px 20px 0 0", padding:20, width:"100%", maxWidth:480, maxHeight:"60vh", overflowY:"auto" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
          <span style={{ fontWeight:700, color:t.accent }}>Välj GIF 🎭</span>
          <button onClick={onClose} style={{ background:"none", border:"none", color:t.text3, cursor:"pointer", fontSize:20 }}>✕</button>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:6 }}>
          {GIF_LIST.map(g=>(
            <div key={g.id} onClick={()=>onSelect(g.url)} style={{ borderRadius:10, overflow:"hidden", cursor:"pointer", border:`2px solid ${t.border}` }}>
              <img src={g.url} alt="" style={{ width:"100%", height:72, objectFit:"cover", display:"block" }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── COMMENTS ────────────────────────────────────────────────────────────────
function Comments({ replies, postId, currentUser, onAddReply, t }) {
  const [txt, setTxt] = useState("");
  const submit = () => { if(!txt.trim())return; onAddReply(postId,{ id:Date.now(), author:currentUser.name, avatar:currentUser.avatar, content:txt, time:"Just nu" }); setTxt(""); };
  return (
    <div style={{ marginTop:10, borderTop:`1px solid ${t.border}`, paddingTop:10 }}>
      {replies.map(r=>(
        <div key={r.id} style={{ display:"flex", gap:8, marginBottom:8 }}>
          <div style={{ width:28, height:28, borderRadius:"50%", background:avatarColor(r.avatar), display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, color:"#0A1A0F", flexShrink:0 }}>{r.avatar}</div>
          <div style={{ background:t.surface2, borderRadius:12, padding:"7px 12px", flex:1 }}>
            <span style={{ fontWeight:700, fontSize:12, color:t.accent }}>{r.author}</span>
            <span style={{ fontSize:11, color:t.text3, marginLeft:6 }}>{r.time}</span>
            <p style={{ margin:"3px 0 0", fontSize:13, color:t.text2 }}>{r.content}</p>
          </div>
        </div>
      ))}
      <div style={{ display:"flex", gap:8, marginTop:8 }}>
        <div style={{ width:28, height:28, borderRadius:"50%", background:avatarColor(currentUser?.avatar||"ME"), display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, color:"#0A1A0F", flexShrink:0 }}>{currentUser?.avatar||"ME"}</div>
        <input value={txt} onChange={e=>setTxt(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()} placeholder="Skriv ett svar…" style={{ flex:1, background:t.input, border:`1px solid ${t.border2}`, borderRadius:20, padding:"7px 14px", color:t.text, fontSize:13, outline:"none" }} />
        <button onClick={submit} style={{ background:t.accent, border:"none", color:"#0A1A0F", borderRadius:20, padding:"7px 14px", cursor:"pointer", fontWeight:700, fontSize:13 }}>↑</button>
      </div>
    </div>
  );
}

// ─── TOAST ───────────────────────────────────────────────────────────────────
function Toast({ msg, onDone, t }) {
  useEffect(()=>{ const x=setTimeout(onDone,2800); return ()=>clearTimeout(x); },[onDone]);
  return <div style={{ position:"fixed", bottom:80, left:"50%", transform:"translateX(-50%)", background:t.surface, border:`1px solid ${t.accent}66`, borderRadius:30, padding:"11px 22px", color:t.text, fontSize:14, fontWeight:600, zIndex:400, boxShadow:"0 8px 32px #0007", whiteSpace:"nowrap" }}>🐎 {msg}</div>;
}

// ─── COMPOSE ────────────────────────────────────────────────────────────────
function ComposeBox({ onPost, currentUser, t }) {
  const [text, setText] = useState("");
  const [selCat, setSelCat] = useState("snack");
  const [catOpen, setCatOpen] = useState(false);
  const [gifOpen, setGifOpen] = useState(false);
  const [mediaFiles, setMediaFiles] = useState([]);
  const imageRef = useRef(); const videoRef = useRef();
  const cat = CATEGORIES.find(c=>c.id===selCat);

  const handleFiles = (files, type) => Array.from(files).forEach(f => setMediaFiles(p=>[...p,{ type, url:URL.createObjectURL(f), name:f.name }]));
  const removeMedia = i => setMediaFiles(p=>p.filter((_,idx)=>idx!==i));
  const addGif = url => { setMediaFiles(p=>[...p,{ type:"gif", url, name:"gif" }]); setGifOpen(false); };
  const handlePost = () => {
    if(!text.trim()&&!mediaFiles.length)return;
    onPost({ text, category:selCat, media:mediaFiles.map(m=>({ type:m.type, url:m.url })) });
    setText(""); setMediaFiles([]);
  };

  return (
    <div style={{ padding:"14px 16px", borderBottom:`1px solid ${t.border}`, background:t.surface }}>
      <div style={{ display:"flex", gap:10 }}>
        <div style={{ width:38, height:38, borderRadius:"50%", background:avatarColor(currentUser?.avatar||"ME"), display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, color:"#0A1A0F", flexShrink:0 }}>{currentUser?.avatar||"ME"}</div>
        <div style={{ flex:1, minWidth:0 }}>
          <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Vad händer i travvärlden?" style={{ width:"100%", background:t.input, border:`1px solid ${t.border2}`, borderRadius:12, padding:"10px 12px", color:t.text, fontSize:15, resize:"none", minHeight:70, outline:"none", boxSizing:"border-box", fontFamily:"inherit" }} />

          {mediaFiles.length>0 && (
            <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:8 }}>
              {mediaFiles.map((m,i)=>(
                <div key={i} style={{ position:"relative", borderRadius:8, overflow:"hidden", border:`1px solid ${t.border2}` }}>
                  {m.type==="video" ? <video src={m.url} style={{ width:64, height:64, objectFit:"cover", display:"block" }} /> : <img src={m.url} alt="" style={{ width:64, height:64, objectFit:"cover", display:"block" }} />}
                  {m.type==="gif" && <div style={{ position:"absolute", bottom:2, left:2, background:"#000A", borderRadius:4, padding:"1px 4px", fontSize:8, color:"#C9A84C", fontWeight:800 }}>GIF</div>}
                  <button onClick={()=>removeMedia(i)} style={{ position:"absolute", top:2, right:2, background:"#000C", border:"none", color:"#fff", borderRadius:"50%", width:16, height:16, cursor:"pointer", fontSize:9, display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
                </div>
              ))}
            </div>
          )}

          {/* Toolbar */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:6, flexWrap:"wrap" }}>
            <div style={{ display:"flex", gap:6 }}>
              <button onClick={()=>imageRef.current.click()} style={{ background:"none", border:`1px solid ${t.border2}`, color:t.text3, borderRadius:20, padding:"5px 10px", cursor:"pointer", fontSize:13 }}>🖼️</button>
              <input ref={imageRef} type="file" accept="image/*" multiple style={{ display:"none" }} onChange={e=>handleFiles(e.target.files,"image")} />
              <button onClick={()=>videoRef.current.click()} style={{ background:"none", border:`1px solid ${t.border2}`, color:t.text3, borderRadius:20, padding:"5px 10px", cursor:"pointer", fontSize:13 }}>🎬</button>
              <input ref={videoRef} type="file" accept="video/*" style={{ display:"none" }} onChange={e=>handleFiles(e.target.files,"video")} />
              <button onClick={()=>setGifOpen(true)} style={{ background:"none", border:`1px solid ${t.border2}`, color:t.text3, borderRadius:20, padding:"5px 10px", cursor:"pointer", fontSize:12, fontWeight:700 }}>GIF</button>
              <div style={{ position:"relative" }}>
                <button onClick={()=>setCatOpen(o=>!o)} style={{ background:catOpen?t.accentBg:"none", border:`1px solid ${catOpen?t.accent:t.border2}`, color:catOpen?t.accent:t.text3, borderRadius:20, padding:"5px 10px", cursor:"pointer", fontSize:12, fontWeight:600 }}>{cat?.icon} ▾</button>
                {catOpen && (
                  <div style={{ position:"absolute", bottom:"110%", left:0, background:t.surface, border:`1px solid ${t.border2}`, borderRadius:14, padding:8, zIndex:60, minWidth:180, boxShadow:"0 8px 24px #0007" }}>
                    {CATEGORIES.filter(c=>c.id!=="all").map(c=>(
                      <div key={c.id} onClick={()=>{setSelCat(c.id);setCatOpen(false);}} style={{ padding:"7px 12px", cursor:"pointer", color:selCat===c.id?c.color:t.text2, fontWeight:selCat===c.id?700:400, borderRadius:8, fontSize:13 }}>{c.icon} {c.label}</div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <button onClick={handlePost} disabled={!text.trim()&&!mediaFiles.length} style={{ background:`linear-gradient(135deg,${t.accent},#E8C96A)`, border:"none", color:"#0A1A0F", fontWeight:700, padding:"8px 18px", borderRadius:20, cursor:"pointer", fontSize:14, opacity:(!text.trim()&&!mediaFiles.length)?0.5:1 }}>Publicera</button>
          </div>
        </div>
      </div>
      {gifOpen && <GifPicker onSelect={addGif} onClose={()=>setGifOpen(false)} t={t} />}
    </div>
  );
}

// ─── POST ─────────────────────────────────────────────────────────────────────
function Post({ post, currentUser, onAddReply, t, onProfile }) {
  const cat = CATEGORIES.find(c=>c.id===post.category);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [showComments, setShowComments] = useState(false);
  const [lightbox, setLightbox] = useState(null);
  const [bookmarked, setBookmarked] = useState(false);

  return (
    <div style={{ borderBottom:`1px solid ${t.border}`, padding:"14px 16px", background:t.bg, transition:"background 0.1s" }}
      onMouseEnter={e=>e.currentTarget.style.background=t.surface2} onMouseLeave={e=>e.currentTarget.style.background=t.bg}>
      <div style={{ display:"flex", gap:10 }}>
        <div onClick={()=>onProfile&&onProfile(post.author)} style={{ width:40, height:40, borderRadius:"50%", background:avatarColor(post.avatar), display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, color:"#0A1A0F", flexShrink:0, cursor:"pointer" }}>{post.avatar}</div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:5, flexWrap:"wrap", marginBottom:4 }}>
            <span onClick={()=>onProfile&&onProfile(post.author)} style={{ fontWeight:700, fontSize:14, cursor:"pointer", color:t.text }}>{post.author}</span>
            {post.verified && <span style={{ color:t.accent, fontSize:12 }}>✓</span>}
            {post.following && <span style={{ background:t.accentBg, color:t.accent, fontSize:10, padding:"1px 6px", borderRadius:10, fontWeight:600 }}>Följer</span>}
            <span style={{ color:t.text3, fontSize:12 }}>· {post.time}</span>
          </div>
          <div style={{ marginBottom:6 }}>
            <span style={{ background:`${cat?.color||t.accent}22`, color:cat?.color||t.accent, border:`1px solid ${cat?.color||t.accent}44`, borderRadius:20, padding:"2px 9px", fontSize:11, fontWeight:600 }}>{cat?.icon} {cat?.label}</span>
          </div>
          {post.content && <p style={{ margin:"0 0 10px", fontSize:14, lineHeight:1.55, color:t.text, wordBreak:"break-word" }}>{post.content}</p>}
          <MediaGrid media={post.media} onExpand={i=>setLightbox(i)} />
          <div style={{ display:"flex", gap:0, marginTop:4 }}>
            {[
              { icon: showComments?"💬":"💬", count:post.replies.length, action:e=>{e.stopPropagation();setShowComments(s=>!s);} },
              { icon: liked?"❤️":"🤍", count:likeCount, action:e=>{e.stopPropagation();setLiked(l=>!l);setLikeCount(n=>liked?n-1:n+1);}, active:liked },
              { icon:"🔁", count:"", action:e=>e.stopPropagation() },
              { icon:bookmarked?"🔖":"🔖", count:"", action:e=>{e.stopPropagation();setBookmarked(b=>!b);} },
            ].map((btn,i)=>(
              <button key={i} onClick={btn.action} style={{ background:"none", border:"none", color:btn.active?t.accent:t.text3, cursor:"pointer", display:"flex", alignItems:"center", gap:4, fontSize:13, padding:"4px 10px", borderRadius:20, flex:1, justifyContent:"center" }}>
                {btn.icon}{btn.count!==""&&<span>{btn.count}</span>}
              </button>
            ))}
          </div>
          {showComments && <Comments replies={post.replies} postId={post.id} currentUser={currentUser} onAddReply={onAddReply} t={t} />}
        </div>
      </div>
      {lightbox!==null && <Lightbox media={post.media} startIndex={lightbox} onClose={()=>setLightbox(null)} />}
    </div>
  );
}

// ─── SEARCH ──────────────────────────────────────────────────────────────────
function SearchView({ posts, onProfile, t }) {
  const [query, setQuery] = useState("");
  const q = query.toLowerCase().trim();
  const results = q.length < 2 ? [] : posts.filter(p =>
    p.content.toLowerCase().includes(q) || p.author.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q) || CATEGORIES.find(c=>c.id===p.category)?.label.toLowerCase().includes(q)
  );
  return (
    <div>
      <div style={{ padding:"14px 16px", background:t.surface, borderBottom:`1px solid ${t.border}`, position:"sticky", top:60, zIndex:40 }}>
        <div style={{ display:"flex", alignItems:"center", background:t.input, border:`1px solid ${t.border2}`, borderRadius:24, padding:"9px 14px", gap:10 }}>
          <span style={{ color:t.text3, fontSize:16 }}>🔍</span>
          <input autoFocus value={query} onChange={e=>setQuery(e.target.value)} placeholder="Sök inlägg, användare, ämne…" style={{ flex:1, background:"none", border:"none", outline:"none", color:t.text, fontSize:15 }} />
          {query && <button onClick={()=>setQuery("")} style={{ background:"none", border:"none", color:t.text3, cursor:"pointer", fontSize:16 }}>✕</button>}
        </div>
      </div>
      {q.length < 2 && (
        <div style={{ padding:20 }}>
          <div style={{ fontSize:13, fontWeight:700, color:t.text3, marginBottom:12, textTransform:"uppercase", letterSpacing:1 }}>Populära ämnen</div>
          {["#V75Solvalla","#ATGLive","#Elitloppet","#Andelspel","#GaloppSolvalla"].map(tag=>(
            <div key={tag} onClick={()=>setQuery(tag.slice(1))} style={{ padding:"10px 0", borderBottom:`1px solid ${t.border}`, cursor:"pointer", color:t.accent, fontWeight:600, fontSize:15 }}>{tag}</div>
          ))}
        </div>
      )}
      {q.length >= 2 && results.length === 0 && (
        <div style={{ padding:40, textAlign:"center", color:t.text3 }}>
          <div style={{ fontSize:40 }}>🔍</div>
          <p>Inga resultat för "{query}"</p>
        </div>
      )}
      {results.map(p => {
        const cat = CATEGORIES.find(c=>c.id===p.category);
        return (
          <div key={p.id} style={{ padding:"12px 16px", borderBottom:`1px solid ${t.border}`, cursor:"pointer", background:t.bg }} onMouseEnter={e=>e.currentTarget.style.background=t.surface2} onMouseLeave={e=>e.currentTarget.style.background=t.bg}>
            <div style={{ display:"flex", gap:10 }}>
              <div style={{ width:36, height:36, borderRadius:"50%", background:avatarColor(p.avatar), display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, color:"#0A1A0F", flexShrink:0 }}>{p.avatar}</div>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:4, flexWrap:"wrap" }}>
                  <span style={{ fontWeight:700, fontSize:13, color:t.text }}>{p.author}</span>
                  <span style={{ background:`${cat?.color}22`, color:cat?.color, borderRadius:20, padding:"1px 8px", fontSize:10, fontWeight:600 }}>{cat?.icon} {cat?.label}</span>
                  <span style={{ color:t.text3, fontSize:11 }}>{p.time}</span>
                </div>
                <p style={{ margin:0, fontSize:13, color:t.text2, lineHeight:1.4 }}>{p.content}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── PROFILE ─────────────────────────────────────────────────────────────────
function ProfileView({ username, posts, currentUser, t, onBack, onAddReply }) {
  const user = USERS.find(u=>u.name===username) || { name:username, handle:`@${username.toLowerCase()}`, avatar:username.slice(0,2).toUpperCase(), followers:0, following:0, verified:false, bio:"", posts:0 };
  const userPosts = posts.filter(p=>p.author===username);
  const [following, setFollowing] = useState(false);
  return (
    <div>
      {/* Header */}
      <div style={{ padding:"12px 16px", borderBottom:`1px solid ${t.border}`, display:"flex", alignItems:"center", gap:12, background:t.surface, position:"sticky", top:60, zIndex:40 }}>
        <button onClick={onBack} style={{ background:"none", border:"none", color:t.text, cursor:"pointer", fontSize:20 }}>←</button>
        <span style={{ fontWeight:700, fontSize:16, color:t.text }}>{user.name}</span>
      </div>
      {/* Banner */}
      <div style={{ background:`linear-gradient(135deg, #0D3020, #1A4A2A)`, height:90 }} />
      {/* Info */}
      <div style={{ padding:"0 16px 16px", background:t.surface, borderBottom:`1px solid ${t.border}` }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginTop:-24 }}>
          <div style={{ width:64, height:64, borderRadius:"50%", background:avatarColor(user.avatar), display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, fontWeight:800, color:"#0A1A0F", border:`3px solid ${t.surface}` }}>{user.avatar}</div>
          {user.name !== currentUser?.name && (
            <button onClick={()=>setFollowing(f=>!f)} style={{ background:following?t.accentBg:t.accent, border:`1px solid ${t.accent}`, color:following?t.accent:"#0A1A0F", fontWeight:700, padding:"8px 20px", borderRadius:20, cursor:"pointer", fontSize:14 }}>{following?"Följer ✓":"Följ"}</button>
          )}
        </div>
        <div style={{ marginTop:10 }}>
          <div style={{ fontWeight:800, fontSize:18, color:t.text }}>{user.name} {user.verified && <span style={{ color:t.accent }}>✓</span>}</div>
          <div style={{ fontSize:13, color:t.text3, marginBottom:6 }}>{user.handle}</div>
          {user.bio && <p style={{ margin:"0 0 10px", fontSize:14, color:t.text2, lineHeight:1.5 }}>{user.bio}</p>}
          <div style={{ display:"flex", gap:20 }}>
            <span style={{ fontSize:13, color:t.text2 }}><strong style={{ color:t.text }}>{typeof user.followers==="number"?user.followers.toLocaleString():user.followers}</strong> följare</span>
            <span style={{ fontSize:13, color:t.text2 }}><strong style={{ color:t.text }}>{user.following}</strong> följer</span>
            <span style={{ fontSize:13, color:t.text2 }}><strong style={{ color:t.text }}>{userPosts.length}</strong> inlägg</span>
          </div>
        </div>
      </div>
      {userPosts.length===0 ? (
        <div style={{ padding:40, textAlign:"center", color:t.text3 }}><div style={{ fontSize:40 }}>📝</div><p>Inga inlägg ännu</p></div>
      ) : userPosts.map(p=><Post key={p.id} post={p} currentUser={currentUser} onAddReply={onAddReply} t={t} />)}
    </div>
  );
}

// ─── DM ──────────────────────────────────────────────────────────────────────
function DMView({ dms, setDms, currentUser, t }) {
  const [active, setActive] = useState(null);
  const [txt, setTxt] = useState("");
  const [newName, setNewName] = useState("");
  const [newOpen, setNewOpen] = useState(false);
  const endRef = useRef();

  const conv = dms.find(d=>d.id===active);
  useEffect(()=>{ endRef.current?.scrollIntoView({ behavior:"smooth" }); },[conv?.msgs.length]);

  const send = () => {
    if(!txt.trim())return;
    setDms(ds=>ds.map(d=>d.id===active?{...d,msgs:[...d.msgs,{ from:"me", text:txt, time:new Date().toLocaleTimeString("sv-SE",{ hour:"2-digit", minute:"2-digit" }) }]}:d));
    setTxt("");
  };

  const startNew = () => {
    if(!newName.trim())return;
    const id="dm"+Date.now();
    setDms(ds=>[...ds,{ id, with:newName, avatar:newName.slice(0,2).toUpperCase(), msgs:[], unread:0 }]);
    setActive(id); setNewOpen(false); setNewName("");
  };

  if(active && conv) return (
    <div style={{ display:"flex", flexDirection:"column", height:"calc(100vh - 116px)" }}>
      <div style={{ padding:"12px 16px", borderBottom:`1px solid ${t.border}`, display:"flex", alignItems:"center", gap:12, background:t.surface, position:"sticky", top:60, zIndex:40 }}>
        <button onClick={()=>setActive(null)} style={{ background:"none", border:"none", color:t.text, cursor:"pointer", fontSize:20 }}>←</button>
        <div style={{ width:34, height:34, borderRadius:"50%", background:avatarColor(conv.avatar), display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, color:"#0A1A0F" }}>{conv.avatar}</div>
        <span style={{ fontWeight:700, color:t.text }}>{conv.with}</span>
      </div>
      <div style={{ flex:1, overflowY:"auto", padding:"14px 16px", display:"flex", flexDirection:"column", gap:10, background:t.bg }}>
        {conv.msgs.map((m,i)=>(
          <div key={i} style={{ display:"flex", justifyContent:m.from==="me"?"flex-end":"flex-start" }}>
            <div style={{ maxWidth:"75%", background:m.from==="me"?t.accent:t.surface, color:m.from==="me"?"#0A1A0F":t.text, borderRadius:m.from==="me"?"18px 18px 4px 18px":"18px 18px 18px 4px", padding:"9px 14px", fontSize:14 }}>
              <p style={{ margin:0, wordBreak:"break-word" }}>{m.text}</p>
              <div style={{ fontSize:10, marginTop:4, opacity:0.6, textAlign:"right" }}>{m.time}</div>
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <div style={{ padding:"10px 14px", borderTop:`1px solid ${t.border}`, background:t.surface, display:"flex", gap:8 }}>
        <input value={txt} onChange={e=>setTxt(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Skriv ett meddelande…" style={{ flex:1, background:t.input, border:`1px solid ${t.border2}`, borderRadius:24, padding:"10px 16px", color:t.text, fontSize:14, outline:"none" }} />
        <button onClick={send} style={{ background:t.accent, border:"none", color:"#0A1A0F", borderRadius:"50%", width:42, height:42, cursor:"pointer", fontSize:18, fontWeight:700, flexShrink:0 }}>↑</button>
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ padding:"12px 16px", borderBottom:`1px solid ${t.border}`, display:"flex", alignItems:"center", justifyContent:"space-between", background:t.surface, position:"sticky", top:60, zIndex:40 }}>
        <span style={{ fontWeight:700, fontSize:16, color:t.text }}>Direktmeddelanden</span>
        <button onClick={()=>setNewOpen(true)} style={{ background:t.accent, border:"none", color:"#0A1A0F", borderRadius:20, padding:"6px 14px", cursor:"pointer", fontWeight:700, fontSize:13 }}>+ Nytt</button>
      </div>
      {newOpen && (
        <div style={{ padding:"12px 16px", borderBottom:`1px solid ${t.border}`, background:t.surface2 }}>
          <div style={{ display:"flex", gap:8 }}>
            <input value={newName} onChange={e=>setNewName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&startNew()} placeholder="Användarnamn…" style={{ flex:1, background:t.input, border:`1px solid ${t.border2}`, borderRadius:20, padding:"8px 14px", color:t.text, fontSize:14, outline:"none" }} />
            <button onClick={startNew} style={{ background:t.accent, border:"none", color:"#0A1A0F", borderRadius:20, padding:"8px 14px", cursor:"pointer", fontWeight:700, fontSize:13 }}>Starta</button>
            <button onClick={()=>setNewOpen(false)} style={{ background:"none", border:`1px solid ${t.border2}`, color:t.text3, borderRadius:20, padding:"8px 12px", cursor:"pointer", fontSize:13 }}>✕</button>
          </div>
        </div>
      )}
      {dms.length===0 && <div style={{ padding:40, textAlign:"center", color:t.text3 }}><div style={{ fontSize:40 }}>💬</div><p>Inga meddelanden ännu</p></div>}
      {dms.map(d=>(
        <div key={d.id} onClick={()=>setActive(d.id)} style={{ padding:"14px 16px", borderBottom:`1px solid ${t.border}`, display:"flex", gap:12, cursor:"pointer", background:t.bg, alignItems:"center" }} onMouseEnter={e=>e.currentTarget.style.background=t.surface2} onMouseLeave={e=>e.currentTarget.style.background=t.bg}>
          <div style={{ position:"relative" }}>
            <div style={{ width:44, height:44, borderRadius:"50%", background:avatarColor(d.avatar), display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:700, color:"#0A1A0F" }}>{d.avatar}</div>
            {d.unread>0 && <div style={{ position:"absolute", top:-2, right:-2, background:"#E53935", borderRadius:"50%", width:16, height:16, fontSize:9, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700 }}>{d.unread}</div>}
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontWeight:700, fontSize:15, color:t.text }}>{d.with}</div>
            <div style={{ fontSize:13, color:t.text3, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{d.msgs.length?d.msgs[d.msgs.length-1].text:"Starta konversationen"}</div>
          </div>
          {d.msgs.length>0 && <span style={{ fontSize:11, color:t.text3, flexShrink:0 }}>{d.msgs[d.msgs.length-1].time}</span>}
        </div>
      ))}
    </div>
  );
}

// ─── AUTH ────────────────────────────────────────────────────────────────────
function RegisterModal({ onDone }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name:"", email:"", phone:"", pass:"", emailCode:"", phoneCode:"", cats:[] });
  const [err, setErr] = useState("");
  const [followedUsers, setFollowedUsers] = useState([]);
  const set = (k,v) => setForm(f=>({ ...f,[k]:v }));
  const steps = ["Konto","E-post","Telefon","Intressen","Följ"];
  const t = DARK;
  const next = () => {
    if(step===1){ if(!form.name||!form.email||!form.phone||!form.pass){setErr("Fyll i alla fält.");return;} if(!form.email.includes("@")){setErr("Ogiltig e-post.");return;} if(form.phone.length<8){setErr("Ogiltigt telefonnummer.");return;} }
    if(step===2&&form.emailCode!=="1234"){setErr("Fel kod. (Testa: 1234)");return;}
    if(step===3&&form.phoneCode!=="5678"){setErr("Fel kod. (Testa: 5678)");return;}
    if(step===4&&!form.cats.length){setErr("Välj minst en kategori.");return;}
    setErr(""); if(step<5) setStep(s=>s+1); else onDone({...form, followedUsers, avatar:form.name.slice(0,2).toUpperCase()});
  };
  const toggleCat = id => set("cats", form.cats.includes(id)?form.cats.filter(c=>c!==id):[...form.cats,id]);
  const toggleUser = id => setFollowedUsers(u=>u.includes(id)?u.filter(x=>x!==id):[...u,id]);
  return (
    <div style={{ position:"fixed", inset:0, background:"#000B", display:"flex", alignItems:"center", justifyContent:"center", zIndex:200, padding:16 }}>
      <div style={{ background:t.surface, border:`1px solid ${t.accent}44`, borderRadius:20, padding:"28px 24px", width:"100%", maxWidth:420, boxShadow:"0 20px 60px #000C", maxHeight:"90vh", overflowY:"auto" }}>
        <div style={{ display:"flex", justifyContent:"center", gap:6, marginBottom:24 }}>
          {steps.map((s,i)=>(
            <div key={i} style={{ display:"flex", flexDirection:"column", alignItems:"center", flex:1 }}>
              <div style={{ width:24, height:24, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", background:i+1<step?t.accent:i+1===step?`${t.accent}33`:"#1A3020", border:i+1<=step?`2px solid ${t.accent}`:"2px solid #2A4030", color:i+1<step?"#0A1A0F":i+1===step?t.accent:"#4A6A50", fontSize:10, fontWeight:700, marginBottom:3 }}>{i+1<step?"✓":i+1}</div>
              <span style={{ fontSize:8, color:i+1===step?t.accent:"#4A6A50", textAlign:"center" }}>{s}</span>
            </div>
          ))}
        </div>
        {step===1&&<>
          <div style={{ textAlign:"center", marginBottom:16 }}><div style={{ fontSize:36 }}>🏇</div><h2 style={{ margin:"6px 0 2px", color:t.accent, fontWeight:800 }}>Skapa konto</h2><p style={{ color:t.text3, fontSize:13, margin:0 }}>Gå med i Sveriges travgemenskap</p></div>
          {[["name","Namn / användarnamn","Ditt namn"],["email","E-postadress","din@email.se"],["phone","Mobilnummer","+46 70 000 00 00"]].map(([k,lbl,ph])=>(
            <div key={k}><label style={{ fontSize:12, color:t.text3, marginBottom:4, display:"block", fontWeight:600 }}>{lbl}</label><input style={{ width:"100%", background:t.input, border:`1px solid ${t.border2}`, borderRadius:10, padding:"10px 12px", color:t.text, fontSize:15, outline:"none", boxSizing:"border-box", marginBottom:12 }} placeholder={ph} value={form[k]} onChange={e=>set(k,e.target.value)} /></div>
          ))}
          <label style={{ fontSize:12, color:t.text3, marginBottom:4, display:"block", fontWeight:600 }}>Lösenord</label>
          <input type="password" style={{ width:"100%", background:t.input, border:`1px solid ${t.border2}`, borderRadius:10, padding:"10px 12px", color:t.text, fontSize:15, outline:"none", boxSizing:"border-box", marginBottom:12 }} placeholder="Minst 8 tecken" value={form.pass} onChange={e=>set("pass",e.target.value)} />
        </>}
        {step===2&&<>
          <div style={{ textAlign:"center", marginBottom:16 }}><div style={{ fontSize:44 }}>📧</div><h2 style={{ margin:"8px 0 4px", color:t.accent, fontWeight:800 }}>Verifiera e-post</h2><p style={{ color:t.text3, fontSize:13 }}>Kod skickad till <strong style={{ color:t.text }}>{form.email}</strong></p></div>
          <input style={{ width:"100%", background:t.input, border:`1px solid ${t.border2}`, borderRadius:10, padding:"12px", color:t.text, fontSize:24, outline:"none", boxSizing:"border-box", letterSpacing:10, textAlign:"center", marginBottom:8 }} placeholder="••••••" maxLength={6} value={form.emailCode} onChange={e=>set("emailCode",e.target.value)} />
          <p style={{ fontSize:12, color:t.text3, textAlign:"center" }}>Ingen kod? <span style={{ color:t.accent, cursor:"pointer" }}>Skicka igen</span></p>
        </>}
        {step===3&&<>
          <div style={{ textAlign:"center", marginBottom:16 }}><div style={{ fontSize:44 }}>📱</div><h2 style={{ margin:"8px 0 4px", color:t.accent, fontWeight:800 }}>Verifiera telefon</h2><p style={{ color:t.text3, fontSize:13 }}>SMS till <strong style={{ color:t.text }}>{form.phone}</strong></p></div>
          <input style={{ width:"100%", background:t.input, border:`1px solid ${t.border2}`, borderRadius:10, padding:"12px", color:t.text, fontSize:24, outline:"none", boxSizing:"border-box", letterSpacing:10, textAlign:"center", marginBottom:8 }} placeholder="••••••" maxLength={6} value={form.phoneCode} onChange={e=>set("phoneCode",e.target.value)} />
          <p style={{ fontSize:12, color:t.text3, textAlign:"center" }}>Ingen SMS? <span style={{ color:t.accent, cursor:"pointer" }}>Skicka igen</span></p>
        </>}
        {step===4&&<>
          <div style={{ textAlign:"center", marginBottom:14 }}><div style={{ fontSize:36 }}>🏷️</div><h2 style={{ margin:"6px 0 2px", color:t.accent, fontWeight:800 }}>Välj intressen</h2><p style={{ color:t.text3, fontSize:13, margin:0 }}>Välj kategorier du vill följa</p></div>
          <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"center", gap:6 }}>
            {CATEGORIES.filter(c=>c.id!=="all").map(c=>(
              <span key={c.id} onClick={()=>toggleCat(c.id)} style={{ padding:"7px 14px", borderRadius:20, fontSize:13, fontWeight:600, cursor:"pointer", background:form.cats.includes(c.id)?t.accent:"#1A3020", color:form.cats.includes(c.id)?"#0A1A0F":t.text3, border:form.cats.includes(c.id)?`1px solid ${t.accent}`:"1px solid #2A4030" }}>{c.icon} {c.label}</span>
            ))}
          </div>
        </>}
        {step===5&&<>
          <div style={{ textAlign:"center", marginBottom:14 }}><div style={{ fontSize:36 }}>👥</div><h2 style={{ margin:"6px 0 2px", color:t.accent, fontWeight:800 }}>Följ användare</h2><p style={{ color:t.text3, fontSize:13, margin:0 }}>Valfritt</p></div>
          {USERS.map(u=>(
            <div key={u.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 0", borderBottom:`1px solid ${t.border}` }}>
              <div style={{ width:38, height:38, borderRadius:"50%", background:avatarColor(u.avatar), display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, color:"#0A1A0F" }}>{u.avatar}</div>
              <div style={{ flex:1 }}><div style={{ fontWeight:700, fontSize:13, color:t.text }}>{u.name} {u.verified&&<span style={{ color:t.accent }}>✓</span>}</div><div style={{ fontSize:11, color:t.text3 }}>{u.handle}</div></div>
              <button onClick={()=>toggleUser(u.id)} style={{ background:followedUsers.includes(u.id)?t.accentBg:"transparent", border:`1px solid ${followedUsers.includes(u.id)?t.accent:t.border2}`, color:followedUsers.includes(u.id)?t.accent:t.text3, borderRadius:20, padding:"5px 12px", cursor:"pointer", fontSize:12, fontWeight:600 }}>{followedUsers.includes(u.id)?"✓ Följer":"Följ"}</button>
            </div>
          ))}
        </>}
        {err&&<div style={{ color:"#E53935", fontSize:13, margin:"8px 0 0", textAlign:"center" }}>{err}</div>}
        <button onClick={next} style={{ width:"100%", marginTop:16, background:`linear-gradient(135deg,${t.accent},#E8C96A)`, border:"none", color:"#0A1A0F", fontWeight:800, padding:"13px", borderRadius:20, cursor:"pointer", fontSize:15 }}>{step<5?"Fortsätt →":"🏇 Kom igång!"}</button>
        {step>1&&<div style={{ textAlign:"center", marginTop:10 }}><span onClick={()=>setStep(s=>s-1)} style={{ color:t.text3, fontSize:13, cursor:"pointer" }}>← Tillbaka</span></div>}
      </div>
    </div>
  );
}

function LoginModal({ onLogin, onSwitch }) {
  const [email,setEmail]=useState(""); const [pass,setPass]=useState(""); const t=DARK;
  return (
    <div style={{ position:"fixed", inset:0, background:t.bg, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
      <div style={{ background:t.surface, border:`1px solid ${t.accent}44`, borderRadius:24, padding:"32px 24px", width:"100%", maxWidth:380, boxShadow:"0 20px 60px #000C" }}>
        <div style={{ textAlign:"center", marginBottom:24 }}>
          <div style={{ fontSize:52 }}>🏇</div>
          <h1 style={{ margin:"8px 0 4px", color:t.accent, fontWeight:900, fontSize:28, letterSpacing:"-1px" }}>TrackTalk</h1>
          <p style={{ color:t.text3, fontSize:14, margin:0 }}>Sveriges forum för trav & galopp</p>
        </div>
        <label style={{ fontSize:12, color:t.text3, marginBottom:4, display:"block", fontWeight:600 }}>E-postadress</label>
        <input style={{ width:"100%", background:t.input, border:`1px solid ${t.border2}`, borderRadius:12, padding:"12px 14px", color:t.text, fontSize:15, outline:"none", boxSizing:"border-box", marginBottom:14 }} placeholder="din@email.se" value={email} onChange={e=>setEmail(e.target.value)} />
        <label style={{ fontSize:12, color:t.text3, marginBottom:4, display:"block", fontWeight:600 }}>Lösenord</label>
        <input type="password" style={{ width:"100%", background:t.input, border:`1px solid ${t.border2}`, borderRadius:12, padding:"12px 14px", color:t.text, fontSize:15, outline:"none", boxSizing:"border-box", marginBottom:20 }} placeholder="Ditt lösenord" value={pass} onChange={e=>setPass(e.target.value)} />
        <button onClick={()=>onLogin({ email, avatar:email.slice(0,2).toUpperCase(), name:email.split("@")[0] })} style={{ width:"100%", background:`linear-gradient(135deg,${t.accent},#E8C96A)`, border:"none", color:"#0A1A0F", fontWeight:800, padding:"14px", borderRadius:20, cursor:"pointer", fontSize:16 }}>Logga in</button>
        <div style={{ textAlign:"center", marginTop:14, color:t.text3, fontSize:13 }}>Inget konto? <span onClick={onSwitch} style={{ color:t.accent, cursor:"pointer", fontWeight:700 }}>Registrera dig gratis</span></div>
      </div>
    </div>
  );
}

// ─── MAIN APP ────────────────────────────────────────────────────────────────
export default function TrackTalk() {
  const [auth, setAuth] = useState(null);
  const [showLogin, setShowLogin] = useState(true);
  const [isDark, setIsDark] = useState(true);
  const [tab, setTab] = useState("feed"); // feed | search | dm | profile
  const [activeCat, setActiveCat] = useState("all");
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [dms, setDms] = useState(INIT_DMS);
  const [toast, setToast] = useState(null);
  const [profileUser, setProfileUser] = useState(null);
  const [showCatMenu, setShowCatMenu] = useState(false);
  const [notifs] = useState([{ icon:"❤️", text:"TravarJohan gillade ditt inlägg", time:"2 min" },{ icon:"💬", text:"ATGfansen svarade", time:"5 min" },{ icon:"👥", text:"TravTV följer dig nu", time:"14 min" }]);
  const [showNotifs, setShowNotifs] = useState(false);
  const isMobile = useIsMobile();
  const t = isDark ? DARK : LIGHT;

  const handlePost = ({ text, category, media }) => {
    setPosts(p=>[{ id:Date.now(), category, author:auth.name, avatar:auth.avatar, time:"Just nu", content:text, likes:0, replies:[], verified:false, following:false, media:media||[] }, ...p]);
    setToast("Inlägg publicerat! 🎉");
  };
  const handleAddReply = (postId, reply) => setPosts(ps=>ps.map(p=>p.id===postId?{...p,replies:[...p.replies,reply]}:p));
  const handleProfile = (name) => { setProfileUser(name); setTab("profile"); setShowCatMenu(false); };
  const filteredPosts = activeCat==="all" ? posts : posts.filter(p=>p.category===activeCat);
  const activeCatObj = CATEGORIES.find(c=>c.id===activeCat);
  const dmUnread = dms.reduce((a,d)=>a+d.unread,0);

  if(!auth) {
    if(showLogin) return <LoginModal onLogin={setAuth} onSwitch={()=>setShowLogin(false)} />;
    return <RegisterModal onDone={u=>{setAuth(u);setShowLogin(true);}} />;
  }

  // ── Bottom nav tabs ──────────────────────────────────────────────────────
  const NAV = [
    { id:"feed",   icon:"🏠", label:"Hem" },
    { id:"search", icon:"🔍", label:"Sök" },
    { id:"dm",     icon:"💬", label:"DM", badge:dmUnread },
    { id:"me",     icon:"👤", label:"Profil" },
  ];

  const renderFeed = () => (
    <div>
      {/* Category strip on mobile */}
      {isMobile && (
        <div style={{ display:"flex", overflowX:"auto", gap:8, padding:"10px 12px", borderBottom:`1px solid ${t.border}`, background:t.surface, WebkitOverflowScrolling:"touch" }}>
          {CATEGORIES.map(c=>(
            <button key={c.id} onClick={()=>setActiveCat(c.id)} style={{ flexShrink:0, background:activeCat===c.id?`${c.color}22`:"transparent", border:activeCat===c.id?`1px solid ${c.color}66`:`1px solid ${t.border}`, color:activeCat===c.id?c.color:t.text3, borderRadius:20, padding:"5px 12px", fontSize:13, fontWeight:activeCat===c.id?700:400, cursor:"pointer", whiteSpace:"nowrap" }}>{c.icon} {c.label}</button>
          ))}
        </div>
      )}
      {/* Feed header */}
      <div style={{ padding:"12px 16px", borderBottom:`1px solid ${t.border}`, display:"flex", alignItems:"center", justifyContent:"space-between", background:t.surface, position:"sticky", top:56, zIndex:40 }}>
        <span style={{ fontWeight:700, fontSize:15, color:t.text }}>{activeCatObj?.icon} {activeCatObj?.label}</span>
        <span style={{ fontSize:12, color:t.text3 }}>{filteredPosts.length} inlägg</span>
      </div>
      <ComposeBox onPost={handlePost} currentUser={auth} t={t} />
      {filteredPosts.length===0 ? <div style={{ padding:48, textAlign:"center", color:t.text3 }}><div style={{ fontSize:48 }}>🐎</div><p>Inga inlägg – var den första!</p></div>
      : filteredPosts.map(p=><Post key={p.id} post={p} currentUser={auth} onAddReply={handleAddReply} t={t} onProfile={handleProfile} />)}
    </div>
  );

  return (
    <div style={{ background:t.bg, minHeight:"100vh", color:t.text, fontFamily:"'Segoe UI',system-ui,sans-serif", display:"flex", flexDirection:"column" }}>
      {/* HEADER */}
      <header style={{ background:t.surface, borderBottom:`1px solid ${t.border}`, padding:"0 16px", display:"flex", alignItems:"center", justifyContent:"space-between", height:56, position:"sticky", top:0, zIndex:100 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, fontSize:20, fontWeight:900, color:t.accent, letterSpacing:"-0.5px" }}>
          <span>🏇</span> <span>TrackTalk</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:8, position:"relative" }}>
          {/* Theme toggle */}
          <button onClick={()=>setIsDark(d=>!d)} style={{ background:"none", border:`1px solid ${t.border2}`, borderRadius:20, padding:"5px 10px", cursor:"pointer", fontSize:16, color:t.text3 }}>{isDark?"☀️":"🌙"}</button>
          {/* Notif bell */}
          <div style={{ position:"relative" }}>
            <button onClick={()=>setShowNotifs(o=>!o)} style={{ background:"none", border:`1px solid ${t.border2}`, borderRadius:20, padding:"5px 10px", cursor:"pointer", fontSize:15, color:t.text3, position:"relative" }}>
              🔔{notifs.length>0&&<span style={{ position:"absolute", top:-3, right:-3, background:"#E53935", borderRadius:"50%", width:14, height:14, fontSize:8, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700 }}>{notifs.length}</span>}
            </button>
            {showNotifs && (
              <div style={{ position:"absolute", right:0, top:46, background:t.surface, border:`1px solid ${t.border2}`, borderRadius:16, width:260, boxShadow:"0 12px 40px #0008", zIndex:150 }}>
                <div style={{ padding:"12px 14px", borderBottom:`1px solid ${t.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ fontWeight:700, color:t.accent, fontSize:14 }}>Notiser</span>
                  <button onClick={()=>setShowNotifs(false)} style={{ background:"none", border:"none", color:t.text3, cursor:"pointer", fontSize:16 }}>✕</button>
                </div>
                {notifs.map((n,i)=><div key={i} style={{ padding:"11px 14px", borderBottom:`1px solid ${t.border}`, display:"flex", gap:10 }}><span style={{ fontSize:18 }}>{n.icon}</span><div><div style={{ fontSize:13, color:t.text }}>{n.text}</div><div style={{ fontSize:11, color:t.text3 }}>{n.time}</div></div></div>)}
              </div>
            )}
          </div>
          {/* Avatar */}
          <div onClick={()=>{setProfileUser(auth.name);setTab("me");}} style={{ width:32, height:32, borderRadius:"50%", background:avatarColor(auth.avatar), display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:"#0A1A0F", cursor:"pointer" }}>{auth.avatar}</div>
        </div>
      </header>

      {/* DESKTOP LAYOUT */}
      {!isMobile ? (
        <div style={{ display:"flex", maxWidth:1100, margin:"0 auto", width:"100%", padding:"0 12px", flex:1 }}>
          {/* Left nav */}
          <aside style={{ width:200, flexShrink:0, paddingTop:16, position:"sticky", top:56, height:"calc(100vh - 56px)", overflowY:"auto" }}>
            {[{ id:"feed",icon:"🏠",label:"Flöde" },{ id:"search",icon:"🔍",label:"Sök" },{ id:"dm",icon:"💬",label:`DM${dmUnread>0?` (${dmUnread})`:""}`  },{ id:"me",icon:"👤",label:"Min profil" }].map(n=>(
              <button key={n.id} onClick={()=>{ if(n.id==="me"){setProfileUser(auth.name);} setTab(n.id); }} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 14px", borderRadius:12, cursor:"pointer", background:tab===n.id?t.accentBg:"transparent", border:tab===n.id?`1px solid ${t.accent}66`:"1px solid transparent", color:tab===n.id?t.accent:t.text3, fontSize:14, fontWeight:tab===n.id?700:400, marginBottom:4, width:"100%", textAlign:"left" }}>{n.icon} {n.label}</button>
            ))}
            <div style={{ borderTop:`1px solid ${t.border}`, marginTop:12, paddingTop:12 }}>
              <div style={{ fontSize:11, fontWeight:700, color:t.text3, marginBottom:8, letterSpacing:1, textTransform:"uppercase" }}>Kategorier</div>
              {CATEGORIES.map(c=>(
                <button key={c.id} onClick={()=>{setActiveCat(c.id);setTab("feed");}} style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 12px", borderRadius:10, cursor:"pointer", background:activeCat===c.id&&tab==="feed"?`${c.color}22`:"transparent", border:"1px solid transparent", color:activeCat===c.id&&tab==="feed"?c.color:t.text3, fontSize:13, fontWeight:activeCat===c.id&&tab==="feed"?700:400, marginBottom:2, width:"100%", textAlign:"left" }}>{c.icon} {c.label}</button>
              ))}
            </div>
            <button onClick={()=>setAuth(null)} style={{ width:"100%", marginTop:16, background:"none", border:`1px solid ${t.border2}`, color:t.text3, borderRadius:10, padding:"8px", cursor:"pointer", fontSize:13 }}>Logga ut</button>
          </aside>

          {/* Main */}
          <main style={{ flex:1, minWidth:0, borderLeft:`1px solid ${t.border}`, borderRight:`1px solid ${t.border}` }}>
            {tab==="feed" && renderFeed()}
            {tab==="search" && <SearchView posts={posts} onProfile={handleProfile} t={t} />}
            {tab==="dm" && <DMView dms={dms} setDms={setDms} currentUser={auth} t={t} />}
            {(tab==="me"||tab==="profile") && <ProfileView username={profileUser||auth.name} posts={posts} currentUser={auth} t={t} onBack={()=>setTab("feed")} onAddReply={handleAddReply} />}
          </main>

          {/* Right */}
          <aside style={{ width:260, flexShrink:0, paddingTop:16, paddingLeft:16, position:"sticky", top:56, height:"calc(100vh - 56px)", overflowY:"auto" }}>
            <div style={{ fontSize:12, fontWeight:700, color:t.text3, marginBottom:10, letterSpacing:1, textTransform:"uppercase" }}>Trendande 🔥</div>
            {["#V75Solvalla","#ATGLive","#Elitloppet","#Andelspel","#GaloppSolvalla"].map((tag,i)=>(
              <div key={tag} onClick={()=>{setTab("search");}} style={{ padding:"8px 0", borderBottom:`1px solid ${t.border}`, cursor:"pointer" }}>
                <div style={{ fontWeight:700, fontSize:14, color:t.accent }}>{tag}</div>
                <div style={{ fontSize:11, color:t.text3 }}>{[2341,1892,984,451,312][i].toLocaleString()} inlägg</div>
              </div>
            ))}
            <div style={{ fontSize:12, fontWeight:700, color:t.text3, margin:"16px 0 10px", letterSpacing:1, textTransform:"uppercase" }}>Följ fler</div>
            {USERS.slice(0,3).map(u=>(
              <div key={u.id} style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 0", borderBottom:`1px solid ${t.border}` }}>
                <div onClick={()=>handleProfile(u.name)} style={{ width:32, height:32, borderRadius:"50%", background:avatarColor(u.avatar), display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:"#0A1A0F", cursor:"pointer" }}>{u.avatar}</div>
                <div style={{ flex:1, minWidth:0 }}><div style={{ fontWeight:700, fontSize:13, color:t.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{u.name} {u.verified&&<span style={{ color:t.accent }}>✓</span>}</div><div style={{ fontSize:11, color:t.text3 }}>{u.followers.toLocaleString()} följare</div></div>
                <button style={{ background:"transparent", border:`1px solid ${t.accent}44`, color:t.accent, borderRadius:20, padding:"3px 10px", cursor:"pointer", fontSize:11, fontWeight:600 }}>Följ</button>
              </div>
            ))}
          </aside>
        </div>
      ) : (
        /* MOBILE LAYOUT */
        <div style={{ flex:1, paddingBottom:64 }}>
          {tab==="feed" && renderFeed()}
          {tab==="search" && <SearchView posts={posts} onProfile={handleProfile} t={t} />}
          {tab==="dm" && <DMView dms={dms} setDms={setDms} currentUser={auth} t={t} />}
          {(tab==="me"||tab==="profile") && <ProfileView username={profileUser||auth.name} posts={posts} currentUser={auth} t={t} onBack={()=>setTab("feed")} onAddReply={handleAddReply} />}
        </div>
      )}

      {/* MOBILE BOTTOM NAV */}
      {isMobile && (
        <nav style={{ position:"fixed", bottom:0, left:0, right:0, background:t.surface, borderTop:`1px solid ${t.border}`, display:"flex", zIndex:90, height:58 }}>
          {NAV.map(n=>(
            <button key={n.id} onClick={()=>{ if(n.id==="me"){setProfileUser(auth.name);} setTab(n.id); }} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:2, background:"none", border:"none", cursor:"pointer", color:tab===n.id?t.accent:t.text3, fontSize:10, fontWeight:tab===n.id?700:400, position:"relative" }}>
              <span style={{ fontSize:20 }}>{n.icon}</span>
              <span>{n.label}</span>
              {n.badge>0 && <div style={{ position:"absolute", top:4, right:"20%", background:"#E53935", borderRadius:"50%", width:14, height:14, fontSize:8, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700 }}>{n.badge}</div>}
            </button>
          ))}
        </nav>
      )}

      {toast && <Toast msg={toast} onDone={()=>setToast(null)} t={t} />}
    </div>
  );
}