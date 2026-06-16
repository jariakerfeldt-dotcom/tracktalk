import { useState, useRef, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://lmohdksyqxwmcdomogcz.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxtb2hka3N5cXh3bWNkb21vZ2N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2MDU2OTgsImV4cCI6MjA5NzE4MTY5OH0.TEUNmKOQLLM02B-6Y2yJN-JXGGyOScYRy9iPEWEchgU";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);

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

function useIsMobile() {
  const [m, setM] = useState(window.innerWidth < 700);
  useEffect(() => { const h = () => setM(window.innerWidth < 700); window.addEventListener("resize",h); return () => window.removeEventListener("resize",h); },[]);
  return m;
}

function Toast({ msg, onDone, t }) {
  useEffect(()=>{ const x=setTimeout(onDone,2800); return ()=>clearTimeout(x); },[onDone]);
  return <div style={{ position:"fixed", bottom:80, left:"50%", transform:"translateX(-50%)", background:t.surface, border:`1px solid ${t.accent}66`, borderRadius:30, padding:"11px 22px", color:t.text, fontSize:14, fontWeight:600, zIndex:400, boxShadow:"0 8px 32px #0007", whiteSpace:"nowrap" }}>🐎 {msg}</div>;
}

function MediaGrid({ media, onExpand }) {
  if (!media?.length) return null;
  const n = media.length;
  const grid = n===1 ? {} : n===2 ? { display:"grid", gridTemplateColumns:"1fr 1fr", gap:3 } : { display:"grid", gridTemplateColumns:"1fr 1fr", gridTemplateRows:"1fr 1fr", gap:3 };
  return (
    <div style={{ ...grid, borderRadius:14, overflow:"hidden", marginBottom:10, maxHeight:340 }}>
      {media.slice(0,4).map((m,i) => (
        <div key={i} onClick={e=>{e.stopPropagation();onExpand&&onExpand(i);}} style={{ position:"relative", overflow:"hidden", cursor:"pointer", minHeight:n>1?100:undefined, maxHeight:n===1?320:undefined }}>
          {m.type==="video" ? <video src={m.url} controls style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} onClick={e=>e.stopPropagation()} />
          : <img src={m.url} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />}
          {m.type==="gif" && <div style={{ position:"absolute", top:6, left:6, background:"#000A", borderRadius:5, padding:"1px 7px", fontSize:10, color:"#C9A84C", fontWeight:800 }}>GIF</div>}
        </div>
      ))}
    </div>
  );
}

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

function Comments({ postId, currentUser, t }) {
  const [comments, setComments] = useState([]);
  const [txt, setTxt] = useState("");

  useEffect(()=>{
    supabase.from("comments").select("*").eq("post_id", postId).order("created_at").then(({data})=>{ if(data) setComments(data); });
  },[postId]);

  const submit = async () => {
    if(!txt.trim()||!currentUser) return;
    const { data } = await supabase.from("comments").insert({ post_id:postId, user_id:currentUser.id, author:currentUser.name, avatar:currentUser.avatar, content:txt }).select().single();
    if(data) setComments(c=>[...c, data]);
    setTxt("");
  };

  return (
    <div style={{ marginTop:10, borderTop:`1px solid ${t.border}`, paddingTop:10 }}>
      {comments.map(r=>(
        <div key={r.id} style={{ display:"flex", gap:8, marginBottom:8 }}>
          <div style={{ width:28, height:28, borderRadius:"50%", background:avatarColor(r.avatar), display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, color:"#0A1A0F", flexShrink:0 }}>{r.avatar}</div>
          <div style={{ background:t.surface2, borderRadius:12, padding:"7px 12px", flex:1 }}>
            <span style={{ fontWeight:700, fontSize:12, color:t.accent }}>{r.author}</span>
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

function ComposeBox({ onPost, currentUser, t }) {
  const [text, setText] = useState("");
  const [selCat, setSelCat] = useState("snack");
  const [catOpen, setCatOpen] = useState(false);
  const [gifOpen, setGifOpen] = useState(false);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const imageRef = useRef(); const videoRef = useRef();
  const cat = CATEGORIES.find(c=>c.id===selCat);

  const uploadFile = async (file, type) => {
    const ext = file.name.split(".").pop();
    const path = `${currentUser.id}/${Date.now()}.${ext}`;
    const { data, error } = await supabase.storage.from("media").upload(path, file);
    if(error) return null;
    const { data: { publicUrl } } = supabase.storage.from("media").getPublicUrl(path);
    return { type, url: publicUrl };
  };

  const handleFiles = async (files, type) => {
    setUploading(true);
    for(const file of Array.from(files)) {
      const result = await uploadFile(file, type);
      if(result) setMediaFiles(p=>[...p, result]);
    }
    setUploading(false);
  };

  const addGif = url => { setMediaFiles(p=>[...p,{ type:"gif", url }]); setGifOpen(false); };
  const removeMedia = i => setMediaFiles(p=>p.filter((_,idx)=>idx!==i));

  const handlePost = async () => {
    if(!text.trim()&&!mediaFiles.length) return;
    await onPost({ text, category:selCat, media:mediaFiles });
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
                  <button onClick={()=>removeMedia(i)} style={{ position:"absolute", top:2, right:2, background:"#000C", border:"none", color:"#fff", borderRadius:"50%", width:16, height:16, cursor:"pointer", fontSize:9 }}>✕</button>
                </div>
              ))}
            </div>
          )}
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
            <button onClick={handlePost} disabled={(!text.trim()&&!mediaFiles.length)||uploading} style={{ background:`linear-gradient(135deg,${t.accent},#E8C96A)`, border:"none", color:"#0A1A0F", fontWeight:700, padding:"8px 18px", borderRadius:20, cursor:"pointer", fontSize:14, opacity:(!text.trim()&&!mediaFiles.length)||uploading?0.5:1 }}>
              {uploading?"Laddar upp…":"Publicera"}
            </button>
          </div>
        </div>
      </div>
      {gifOpen && <GifPicker onSelect={addGif} onClose={()=>setGifOpen(false)} t={t} />}
    </div>
  );
}

function Post({ post, currentUser, t, onProfile }) {
  const cat = CATEGORIES.find(c=>c.id===post.category);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes||0);
  const [showComments, setShowComments] = useState(false);
  const [lightbox, setLightbox] = useState(null);
  const media = Array.isArray(post.media) ? post.media : [];
  const timeStr = post.created_at ? new Date(post.created_at).toLocaleString("sv-SE",{ hour:"2-digit", minute:"2-digit", day:"numeric", month:"short" }) : "Just nu";

  const handleLike = async () => {
    const newLiked = !liked;
    setLiked(newLiked);
    const newCount = newLiked ? likeCount+1 : likeCount-1;
    setLikeCount(newCount);
    await supabase.from("posts").update({ likes: newCount }).eq("id", post.id);
  };

  return (
    <div style={{ borderBottom:`1px solid ${t.border}`, padding:"14px 16px", background:t.bg, transition:"background 0.1s" }}
      onMouseEnter={e=>e.currentTarget.style.background=t.surface2} onMouseLeave={e=>e.currentTarget.style.background=t.bg}>
      <div style={{ display:"flex", gap:10 }}>
        <div onClick={()=>onProfile&&onProfile(post.author)} style={{ width:40, height:40, borderRadius:"50%", background:avatarColor(post.avatar), display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, color:"#0A1A0F", flexShrink:0, cursor:"pointer" }}>{post.avatar}</div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:5, flexWrap:"wrap", marginBottom:4 }}>
            <span onClick={()=>onProfile&&onProfile(post.author)} style={{ fontWeight:700, fontSize:14, cursor:"pointer", color:t.text }}>{post.author}</span>
            <span style={{ color:t.text3, fontSize:12 }}>· {timeStr}</span>
          </div>
          <div style={{ marginBottom:6 }}>
            <span style={{ background:`${cat?.color||t.accent}22`, color:cat?.color||t.accent, border:`1px solid ${cat?.color||t.accent}44`, borderRadius:20, padding:"2px 9px", fontSize:11, fontWeight:600 }}>{cat?.icon} {cat?.label}</span>
          </div>
          {post.content && <p style={{ margin:"0 0 10px", fontSize:14, lineHeight:1.55, color:t.text, wordBreak:"break-word" }}>{post.content}</p>}
          <MediaGrid media={media} onExpand={i=>setLightbox(i)} />
          <div style={{ display:"flex", gap:0, marginTop:4 }}>
            <button onClick={e=>{e.stopPropagation();setShowComments(s=>!s);}} style={{ background:"none", border:"none", color:t.text3, cursor:"pointer", display:"flex", alignItems:"center", gap:4, fontSize:13, padding:"4px 10px", borderRadius:20, flex:1, justifyContent:"center" }}>💬</button>
            <button onClick={handleLike} style={{ background:"none", border:"none", color:liked?t.accent:t.text3, cursor:"pointer", display:"flex", alignItems:"center", gap:4, fontSize:13, padding:"4px 10px", borderRadius:20, flex:1, justifyContent:"center" }}>{liked?"❤️":"🤍"} {likeCount}</button>
            <button style={{ background:"none", border:"none", color:t.text3, cursor:"pointer", display:"flex", alignItems:"center", gap:4, fontSize:13, padding:"4px 10px", borderRadius:20, flex:1, justifyContent:"center" }}>🔁</button>
            <button style={{ background:"none", border:"none", color:t.text3, cursor:"pointer", display:"flex", alignItems:"center", gap:4, fontSize:13, padding:"4px 10px", borderRadius:20, flex:1, justifyContent:"center" }}>🔖</button>
          </div>
          {showComments && <Comments postId={post.id} currentUser={currentUser} t={t} />}
        </div>
      </div>
      {lightbox!==null && <Lightbox media={media} startIndex={lightbox} onClose={()=>setLightbox(null)} />}
    </div>
  );
}

function SearchView({ t, currentUser, onProfile }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  useEffect(()=>{
    if(query.length < 2){ setResults([]); return; }
    const timer = setTimeout(async ()=>{
      const { data } = await supabase.from("posts").select("*").or(`content.ilike.%${query}%,author.ilike.%${query}%,category.ilike.%${query}%`).order("created_at", { ascending:false }).limit(20);
      if(data) setResults(data);
    }, 400);
    return ()=>clearTimeout(timer);
  },[query]);
  return (
    <div>
      <div style={{ padding:"14px 16px", background:t.surface, borderBottom:`1px solid ${t.border}`, position:"sticky", top:56, zIndex:40 }}>
        <div style={{ display:"flex", alignItems:"center", background:t.input, border:`1px solid ${t.border2}`, borderRadius:24, padding:"9px 14px", gap:10 }}>
          <span style={{ color:t.text3, fontSize:16 }}>🔍</span>
          <input autoFocus value={query} onChange={e=>setQuery(e.target.value)} placeholder="Sök inlägg, användare, ämne…" style={{ flex:1, background:"none", border:"none", outline:"none", color:t.text, fontSize:15 }} />
          {query && <button onClick={()=>setQuery("")} style={{ background:"none", border:"none", color:t.text3, cursor:"pointer", fontSize:16 }}>✕</button>}
        </div>
      </div>
      {query.length < 2 && (
        <div style={{ padding:20 }}>
          <div style={{ fontSize:13, fontWeight:700, color:t.text3, marginBottom:12, textTransform:"uppercase", letterSpacing:1 }}>Populära ämnen</div>
          {["#V75Solvalla","#ATGLive","#Elitloppet","#Andelspel","#GaloppSolvalla"].map(tag=>(
            <div key={tag} onClick={()=>setQuery(tag.slice(1))} style={{ padding:"10px 0", borderBottom:`1px solid ${t.border}`, cursor:"pointer", color:t.accent, fontWeight:600, fontSize:15 }}>{tag}</div>
          ))}
        </div>
      )}
      {query.length >= 2 && results.length === 0 && <div style={{ padding:40, textAlign:"center", color:t.text3 }}><div style={{ fontSize:40 }}>🔍</div><p>Inga resultat för "{query}"</p></div>}
      {results.map(p=><Post key={p.id} post={p} currentUser={currentUser} t={t} onProfile={onProfile} />)}
    </div>
  );
}

function ProfileView({ username, currentUser, t, onBack }) {
  const [posts, setPosts] = useState([]);
  const [profile, setProfile] = useState(null);
  const [following, setFollowing] = useState(false);

  useEffect(()=>{
    supabase.from("profiles").select("*").eq("name", username).single().then(({data})=>{ if(data) setProfile(data); });
    supabase.from("posts").select("*").eq("author", username).order("created_at",{ascending:false}).then(({data})=>{ if(data) setPosts(data); });
  },[username]);

  const avatar = profile?.avatar || username.slice(0,2).toUpperCase();
  return (
    <div>
      <div style={{ padding:"12px 16px", borderBottom:`1px solid ${t.border}`, display:"flex", alignItems:"center", gap:12, background:t.surface, position:"sticky", top:56, zIndex:40 }}>
        <button onClick={onBack} style={{ background:"none", border:"none", color:t.text, cursor:"pointer", fontSize:20 }}>←</button>
        <span style={{ fontWeight:700, fontSize:16, color:t.text }}>{username}</span>
      </div>
      <div style={{ background:`linear-gradient(135deg, #0D3020, #1A4A2A)`, height:90 }} />
      <div style={{ padding:"0 16px 16px", background:t.surface, borderBottom:`1px solid ${t.border}` }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginTop:-24 }}>
          <div style={{ width:64, height:64, borderRadius:"50%", background:avatarColor(avatar), display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, fontWeight:800, color:"#0A1A0F", border:`3px solid ${t.surface}` }}>{avatar}</div>
          {username !== currentUser?.name && (
            <button onClick={()=>setFollowing(f=>!f)} style={{ background:following?t.accentBg:t.accent, border:`1px solid ${t.accent}`, color:following?t.accent:"#0A1A0F", fontWeight:700, padding:"8px 20px", borderRadius:20, cursor:"pointer", fontSize:14 }}>{following?"Följer ✓":"Följ"}</button>
          )}
        </div>
        <div style={{ marginTop:10 }}>
          <div style={{ fontWeight:800, fontSize:18, color:t.text }}>{username}</div>
          {profile?.bio && <p style={{ margin:"6px 0 10px", fontSize:14, color:t.text2, lineHeight:1.5 }}>{profile.bio}</p>}
          <div style={{ display:"flex", gap:20 }}>
            <span style={{ fontSize:13, color:t.text2 }}><strong style={{ color:t.text }}>{profile?.followers||0}</strong> följare</span>
            <span style={{ fontSize:13, color:t.text2 }}><strong style={{ color:t.text }}>{posts.length}</strong> inlägg</span>
          </div>
        </div>
      </div>
      {posts.length===0 ? <div style={{ padding:40, textAlign:"center", color:t.text3 }}><div style={{ fontSize:40 }}>📝</div><p>Inga inlägg ännu</p></div>
      : posts.map(p=><Post key={p.id} post={p} currentUser={currentUser} t={t} />)}
    </div>
  );
}

function DMView({ currentUser, t }) {
  const [convs, setConvs] = useState([]);
  const [active, setActive] = useState(null);
  const [msgs, setMsgs] = useState([]);
  const [txt, setTxt] = useState("");
  const [newName, setNewName] = useState("");
  const [newOpen, setNewOpen] = useState(false);
  const endRef = useRef();

  useEffect(()=>{
    if(!currentUser) return;
    supabase.from("messages").select("*").or(`from_user.eq.${currentUser.id},to_user.eq.${currentUser.id}`).order("created_at").then(({data})=>{
      if(!data) return;
      const map = {};
      data.forEach(m=>{
        const other = m.from_user===currentUser.id ? m.to_user : m.from_user;
        if(!map[other]) map[other]={ with:other, msgs:[] };
        map[other].msgs.push(m);
      });
      setConvs(Object.values(map));
    });
  },[currentUser]);

  useEffect(()=>{ if(active) { supabase.from("messages").select("*").or(`from_user.eq.${currentUser.id},to_user.eq.${currentUser.id}`).order("created_at").then(({data})=>{ if(data) setMsgs(data.filter(m=>m.from_user===active||m.to_user===active)); }); } },[active, currentUser]);
  useEffect(()=>{ endRef.current?.scrollIntoView({ behavior:"smooth" }); },[msgs.length]);

  const send = async () => {
    if(!txt.trim()||!active) return;
    const { data } = await supabase.from("messages").insert({ from_user:currentUser.id, to_user:active, content:txt }).select().single();
    if(data) setMsgs(m=>[...m, data]);
    setTxt("");
  };

  if(active) return (
    <div style={{ display:"flex", flexDirection:"column", height:"calc(100vh - 116px)" }}>
      <div style={{ padding:"12px 16px", borderBottom:`1px solid ${t.border}`, display:"flex", alignItems:"center", gap:12, background:t.surface }}>
        <button onClick={()=>setActive(null)} style={{ background:"none", border:"none", color:t.text, cursor:"pointer", fontSize:20 }}>←</button>
        <span style={{ fontWeight:700, color:t.text }}>Konversation</span>
      </div>
      <div style={{ flex:1, overflowY:"auto", padding:"14px 16px", display:"flex", flexDirection:"column", gap:10, background:t.bg }}>
        {msgs.map((m,i)=>(
          <div key={i} style={{ display:"flex", justifyContent:m.from_user===currentUser.id?"flex-end":"flex-start" }}>
            <div style={{ maxWidth:"75%", background:m.from_user===currentUser.id?t.accent:t.surface, color:m.from_user===currentUser.id?"#0A1A0F":t.text, borderRadius:m.from_user===currentUser.id?"18px 18px 4px 18px":"18px 18px 18px 4px", padding:"9px 14px", fontSize:14 }}>
              <p style={{ margin:0, wordBreak:"break-word" }}>{m.content}</p>
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
      <div style={{ padding:"12px 16px", borderBottom:`1px solid ${t.border}`, display:"flex", alignItems:"center", justifyContent:"space-between", background:t.surface }}>
        <span style={{ fontWeight:700, fontSize:16, color:t.text }}>Direktmeddelanden</span>
        <button onClick={()=>setNewOpen(true)} style={{ background:t.accent, border:"none", color:"#0A1A0F", borderRadius:20, padding:"6px 14px", cursor:"pointer", fontWeight:700, fontSize:13 }}>+ Nytt</button>
      </div>
      {newOpen && (
        <div style={{ padding:"12px 16px", borderBottom:`1px solid ${t.border}`, background:t.surface2, display:"flex", gap:8 }}>
          <input value={newName} onChange={e=>setNewName(e.target.value)} placeholder="Användar-ID…" style={{ flex:1, background:t.input, border:`1px solid ${t.border2}`, borderRadius:20, padding:"8px 14px", color:t.text, fontSize:14, outline:"none" }} />
          <button onClick={()=>{setActive(newName);setNewOpen(false);setNewName("");}} style={{ background:t.accent, border:"none", color:"#0A1A0F", borderRadius:20, padding:"8px 14px", cursor:"pointer", fontWeight:700, fontSize:13 }}>Starta</button>
          <button onClick={()=>setNewOpen(false)} style={{ background:"none", border:`1px solid ${t.border2}`, color:t.text3, borderRadius:20, padding:"8px 12px", cursor:"pointer", fontSize:13 }}>✕</button>
        </div>
      )}
      {convs.length===0 && <div style={{ padding:40, textAlign:"center", color:t.text3 }}><div style={{ fontSize:40 }}>💬</div><p>Inga meddelanden ännu</p></div>}
      {convs.map((c,i)=>(
        <div key={i} onClick={()=>setActive(c.with)} style={{ padding:"14px 16px", borderBottom:`1px solid ${t.border}`, display:"flex", gap:12, cursor:"pointer", background:t.bg, alignItems:"center" }} onMouseEnter={e=>e.currentTarget.style.background=t.surface2} onMouseLeave={e=>e.currentTarget.style.background=t.bg}>
          <div style={{ width:44, height:44, borderRadius:"50%", background:avatarColor(c.with.slice(0,2)), display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:700, color:"#0A1A0F" }}>{c.with.slice(0,2).toUpperCase()}</div>
          <div style={{ flex:1 }}><div style={{ fontWeight:700, fontSize:14, color:t.text }}>Konversation</div><div style={{ fontSize:13, color:t.text3 }}>{c.msgs[c.msgs.length-1]?.content||""}</div></div>
        </div>
      ))}
    </div>
  );
}

// ─── AUTH ────────────────────────────────────────────────────────────────────
function RegisterModal({ onDone }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name:"", email:"", pass:"", cats:[] });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const steps = ["Konto","Verifiera e-post","Intressen"];
  const t = DARK;

  const next = async () => {
    setErr("");
    if(step===1) {
      if(!form.name||!form.email||!form.pass){setErr("Fyll i alla fält.");return;}
      if(!form.email.includes("@")){setErr("Ogiltig e-post.");return;}
      if(form.pass.length<6){setErr("Lösenord måste vara minst 6 tecken.");return;}
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({ email:form.email, password:form.pass, options:{ data:{ name:form.name } } });
      setLoading(false);
      if(error){setErr(error.message);return;}
      setStep(2);
      return;
    }
    if(step===2){setStep(3);return;}
    if(step===3&&!form.cats.length){setErr("Välj minst en kategori.");return;}
    onDone(form);
  };

  const toggleCat = id => set("cats", form.cats.includes(id)?form.cats.filter(c=>c!==id):[...form.cats,id]);

  return (
    <div style={{ position:"fixed", inset:0, background:"#000B", display:"flex", alignItems:"center", justifyContent:"center", zIndex:200, padding:16 }}>
      <div style={{ background:t.surface, border:`1px solid ${t.accent}44`, borderRadius:20, padding:"28px 24px", width:"100%", maxWidth:420, boxShadow:"0 20px 60px #000C", maxHeight:"90vh", overflowY:"auto" }}>
        <div style={{ display:"flex", justifyContent:"center", gap:6, marginBottom:24 }}>
          {steps.map((s,i)=>(
            <div key={i} style={{ display:"flex", flexDirection:"column", alignItems:"center", flex:1 }}>
              <div style={{ width:26, height:26, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", background:i+1<step?t.accent:i+1===step?`${t.accent}33`:"#1A3020", border:i+1<=step?`2px solid ${t.accent}`:"2px solid #2A4030", color:i+1<step?"#0A1A0F":i+1===step?t.accent:"#4A6A50", fontSize:11, fontWeight:700, marginBottom:3 }}>{i+1<step?"✓":i+1}</div>
              <span style={{ fontSize:9, color:i+1===step?t.accent:"#4A6A50", textAlign:"center" }}>{s}</span>
            </div>
          ))}
        </div>

        {step===1&&<>
          <div style={{ textAlign:"center", marginBottom:16 }}><div style={{ fontSize:36 }}>🏇</div><h2 style={{ margin:"6px 0 2px", color:t.accent, fontWeight:800 }}>Skapa konto</h2><p style={{ color:t.text3, fontSize:13, margin:0 }}>Gå med i Sveriges travgemenskap</p></div>
          {[["name","Namn / användarnamn","Ditt namn","text"],["email","E-postadress","din@email.se","email"],["pass","Lösenord","Minst 6 tecken","password"]].map(([k,lbl,ph,type])=>(
            <div key={k}><label style={{ fontSize:12, color:t.text3, marginBottom:4, display:"block", fontWeight:600 }}>{lbl}</label><input type={type} style={{ width:"100%", background:t.input, border:`1px solid ${t.border2}`, borderRadius:10, padding:"10px 12px", color:t.text, fontSize:15, outline:"none", boxSizing:"border-box", marginBottom:12 }} placeholder={ph} value={form[k]} onChange={e=>set(k,e.target.value)} /></div>
          ))}
        </>}

        {step===2&&<>
          <div style={{ textAlign:"center", marginBottom:16 }}><div style={{ fontSize:44 }}>📧</div><h2 style={{ margin:"8px 0 4px", color:t.accent, fontWeight:800 }}>Verifiera e-post</h2><p style={{ color:t.text3, fontSize:13 }}>Vi har skickat en länk till <strong style={{ color:t.text }}>{form.email}</strong></p><p style={{ color:t.text3, fontSize:13 }}>Klicka på länken i mailet och kom sedan tillbaka hit.</p></div>
        </>}

        {step===3&&<>
          <div style={{ textAlign:"center", marginBottom:14 }}><div style={{ fontSize:36 }}>🏷️</div><h2 style={{ margin:"6px 0 2px", color:t.accent, fontWeight:800 }}>Välj intressen</h2></div>
          <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"center", gap:6 }}>
            {CATEGORIES.filter(c=>c.id!=="all").map(c=>(
              <span key={c.id} onClick={()=>toggleCat(c.id)} style={{ padding:"7px 14px", borderRadius:20, fontSize:13, fontWeight:600, cursor:"pointer", background:form.cats.includes(c.id)?t.accent:"#1A3020", color:form.cats.includes(c.id)?"#0A1A0F":t.text3, border:form.cats.includes(c.id)?`1px solid ${t.accent}`:"1px solid #2A4030" }}>{c.icon} {c.label}</span>
            ))}
          </div>
        </>}

        {err&&<div style={{ color:"#E53935", fontSize:13, margin:"8px 0 0", textAlign:"center" }}>{err}</div>}
        <button onClick={next} disabled={loading} style={{ width:"100%", marginTop:16, background:`linear-gradient(135deg,${t.accent},#E8C96A)`, border:"none", color:"#0A1A0F", fontWeight:800, padding:"13px", borderRadius:20, cursor:"pointer", fontSize:15, opacity:loading?0.7:1 }}>
          {loading?"Skapar konto…":step<3?"Fortsätt →":"🏇 Kom igång!"}
        </button>
        {step>1&&<div style={{ textAlign:"center", marginTop:10 }}><span onClick={()=>setStep(s=>s-1)} style={{ color:t.text3, fontSize:13, cursor:"pointer" }}>← Tillbaka</span></div>}
      </div>
    </div>
  );
}

function LoginModal({ onLogin, onSwitch }) {
  const [email,setEmail]=useState(""); const [pass,setPass]=useState(""); const [err,setErr]=useState(""); const [loading,setLoading]=useState(false); const t=DARK;
  const login = async () => {
    setLoading(true); setErr("");
    const { data, error } = await supabase.auth.signInWithPassword({ email, password:pass });
    setLoading(false);
    if(error){setErr("Fel e-post eller lösenord.");return;}
    onLogin(data.user);
  };
  return (
    <div style={{ position:"fixed", inset:0, background:t.bg, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
      <div style={{ background:t.surface, border:`1px solid ${t.accent}44`, borderRadius:24, padding:"32px 24px", width:"100%", maxWidth:380, boxShadow:"0 20px 60px #000C" }}>
        <div style={{ textAlign:"center", marginBottom:24 }}><div style={{ fontSize:52 }}>🏇</div><h1 style={{ margin:"8px 0 4px", color:t.accent, fontWeight:900, fontSize:28, letterSpacing:"-1px" }}>TrackTalk</h1><p style={{ color:t.text3, fontSize:14, margin:0 }}>Sveriges forum för trav & galopp</p></div>
        <label style={{ fontSize:12, color:t.text3, marginBottom:4, display:"block", fontWeight:600 }}>E-postadress</label>
        <input style={{ width:"100%", background:t.input, border:`1px solid ${t.border2}`, borderRadius:12, padding:"12px 14px", color:t.text, fontSize:15, outline:"none", boxSizing:"border-box", marginBottom:14 }} placeholder="din@email.se" value={email} onChange={e=>setEmail(e.target.value)} />
        <label style={{ fontSize:12, color:t.text3, marginBottom:4, display:"block", fontWeight:600 }}>Lösenord</label>
        <input type="password" style={{ width:"100%", background:t.input, border:`1px solid ${t.border2}`, borderRadius:12, padding:"12px 14px", color:t.text, fontSize:15, outline:"none", boxSizing:"border-box", marginBottom:8 }} placeholder="Ditt lösenord" value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&login()} />
        {err&&<div style={{ color:"#E53935", fontSize:13, marginBottom:10, textAlign:"center" }}>{err}</div>}
        <button onClick={login} disabled={loading} style={{ width:"100%", marginTop:8, background:`linear-gradient(135deg,${t.accent},#E8C96A)`, border:"none", color:"#0A1A0F", fontWeight:800, padding:"14px", borderRadius:20, cursor:"pointer", fontSize:16, opacity:loading?0.7:1 }}>{loading?"Loggar in…":"Logga in"}</button>
        <div style={{ textAlign:"center", marginTop:14, color:t.text3, fontSize:13 }}>Inget konto? <span onClick={onSwitch} style={{ color:t.accent, cursor:"pointer", fontWeight:700 }}>Registrera dig gratis</span></div>
      </div>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function TrackTalk() {
  const [auth, setAuth] = useState(null);
  const [profile, setProfile] = useState(null);
  const [showLogin, setShowLogin] = useState(true);
  const [isDark, setIsDark] = useState(true);
  const [tab, setTab] = useState("feed");
  const [activeCat, setActiveCat] = useState("all");
  const [posts, setPosts] = useState([]);
  const [toast, setToast] = useState(null);
  const [profileUser, setProfileUser] = useState(null);
  const [showNotifs, setShowNotifs] = useState(false);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const isMobile = useIsMobile();
  const t = isDark ? DARK : LIGHT;

  // Check session on load
  useEffect(()=>{
    supabase.auth.getSession().then(({ data:{ session } })=>{ if(session) setAuth(session.user); });
    supabase.auth.onAuthStateChange((_,session)=>{ setAuth(session?.user||null); });
  },[]);

  // Load profile when auth changes
  useEffect(()=>{
    if(!auth) return;
    supabase.from("profiles").select("*").eq("id", auth.id).single().then(({data})=>{
      if(data) setProfile(data);
      else {
        const name = auth.user_metadata?.name || auth.email.split("@")[0];
        const avatar = name.slice(0,2).toUpperCase();
        supabase.from("profiles").insert({ id:auth.id, name, avatar, handle:`@${name.toLowerCase().replace(/\s/g,"_")}` }).then(()=>{
          setProfile({ id:auth.id, name, avatar });
        });
      }
    });
  },[auth]);

  // Load posts
  useEffect(()=>{
    setLoadingPosts(true);
    const query = activeCat==="all"
      ? supabase.from("posts").select("*").order("created_at",{ascending:false}).limit(50)
      : supabase.from("posts").select("*").eq("category",activeCat).order("created_at",{ascending:false}).limit(50);
    query.then(({data})=>{ if(data) setPosts(data); setLoadingPosts(false); });
  },[activeCat]);

  const handlePost = async ({ text, category, media }) => {
    if(!profile) return;
    const { data } = await supabase.from("posts").insert({ user_id:auth.id, author:profile.name, avatar:profile.avatar, category, content:text, media, likes:0 }).select().single();
    if(data){ setPosts(p=>[data,...p]); setToast("Inlägg publicerat! 🎉"); }
  };

  const handleProfile = (name) => { setProfileUser(name); setTab("profile"); };
  const currentUser = profile ? { ...profile, id:auth?.id } : null;
  const activeCatObj = CATEGORIES.find(c=>c.id===activeCat);

  const NAV = [
    { id:"feed",   icon:"🏠", label:"Hem" },
    { id:"search", icon:"🔍", label:"Sök" },
    { id:"dm",     icon:"💬", label:"DM" },
    { id:"me",     icon:"👤", label:"Profil" },
  ];

  if(!auth) {
    if(showLogin) return <LoginModal onLogin={u=>setAuth(u)} onSwitch={()=>setShowLogin(false)} />;
    return <RegisterModal onDone={()=>setShowLogin(true)} />;
  }

  const renderFeed = () => (
    <div>
      {isMobile && (
        <div style={{ display:"flex", overflowX:"auto", gap:8, padding:"10px 12px", borderBottom:`1px solid ${t.border}`, background:t.surface, WebkitOverflowScrolling:"touch" }}>
          {CATEGORIES.map(c=>(
            <button key={c.id} onClick={()=>setActiveCat(c.id)} style={{ flexShrink:0, background:activeCat===c.id?`${c.color}22`:"transparent", border:activeCat===c.id?`1px solid ${c.color}66`:`1px solid ${t.border}`, color:activeCat===c.id?c.color:t.text3, borderRadius:20, padding:"5px 12px", fontSize:13, fontWeight:activeCat===c.id?700:400, cursor:"pointer", whiteSpace:"nowrap" }}>{c.icon} {c.label}</button>
          ))}
        </div>
      )}
      <div style={{ padding:"12px 16px", borderBottom:`1px solid ${t.border}`, display:"flex", alignItems:"center", justifyContent:"space-between", background:t.surface, position:"sticky", top:56, zIndex:40 }}>
        <span style={{ fontWeight:700, fontSize:15, color:t.text }}>{activeCatObj?.icon} {activeCatObj?.label}</span>
        <span style={{ fontSize:12, color:t.text3 }}>{posts.length} inlägg</span>
      </div>
      <ComposeBox onPost={handlePost} currentUser={currentUser} t={t} />
      {loadingPosts && <div style={{ padding:30, textAlign:"center", color:t.text3 }}>Laddar inlägg…</div>}
      {!loadingPosts && posts.length===0 && <div style={{ padding:48, textAlign:"center", color:t.text3 }}><div style={{ fontSize:48 }}>🐎</div><p>Inga inlägg ännu — var den första!</p></div>}
      {posts.map(p=><Post key={p.id} post={p} currentUser={currentUser} t={t} onProfile={handleProfile} />)}
    </div>
  );

  return (
    <div style={{ background:t.bg, minHeight:"100vh", color:t.text, fontFamily:"'Segoe UI',system-ui,sans-serif", display:"flex", flexDirection:"column" }}>
      <header style={{ background:t.surface, borderBottom:`1px solid ${t.border}`, padding:"0 16px", display:"flex", alignItems:"center", justifyContent:"space-between", height:56, position:"sticky", top:0, zIndex:100 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, fontSize:20, fontWeight:900, color:t.accent, letterSpacing:"-0.5px", cursor:"pointer" }} onClick={()=>setTab("feed")}>
          <span>🏇</span> <span>TrackTalk</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:8, position:"relative" }}>
          <button onClick={()=>setIsDark(d=>!d)} style={{ background:"none", border:`1px solid ${t.border2}`, borderRadius:20, padding:"5px 10px", cursor:"pointer", fontSize:16, color:t.text3 }}>{isDark?"☀️":"🌙"}</button>
          <div onClick={()=>{setProfileUser(profile?.name);setTab("me");}} style={{ width:32, height:32, borderRadius:"50%", background:avatarColor(profile?.avatar||"ME"), display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:"#0A1A0F", cursor:"pointer" }}>{profile?.avatar||"ME"}</div>
          <button onClick={async()=>{ await supabase.auth.signOut(); setAuth(null); setProfile(null); }} style={{ background:"none", border:`1px solid ${t.border2}`, color:t.text3, borderRadius:8, padding:"5px 10px", cursor:"pointer", fontSize:12 }}>Logga ut</button>
        </div>
      </header>

      {!isMobile ? (
        <div style={{ display:"flex", maxWidth:1100, margin:"0 auto", width:"100%", padding:"0 12px", flex:1 }}>
          <aside style={{ width:200, flexShrink:0, paddingTop:16, position:"sticky", top:56, height:"calc(100vh - 56px)", overflowY:"auto" }}>
            {[{id:"feed",icon:"🏠",label:"Flöde"},{id:"search",icon:"🔍",label:"Sök"},{id:"dm",icon:"💬",label:"DM"},{id:"me",icon:"👤",label:"Min profil"}].map(n=>(
              <button key={n.id} onClick={()=>{if(n.id==="me")setProfileUser(profile?.name);setTab(n.id);}} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 14px", borderRadius:12, cursor:"pointer", background:tab===n.id?t.accentBg:"transparent", border:tab===n.id?`1px solid ${t.accent}66`:"1px solid transparent", color:tab===n.id?t.accent:t.text3, fontSize:14, fontWeight:tab===n.id?700:400, marginBottom:4, width:"100%", textAlign:"left" }}>{n.icon} {n.label}</button>
            ))}
            <div style={{ borderTop:`1px solid ${t.border}`, marginTop:12, paddingTop:12 }}>
              <div style={{ fontSize:11, fontWeight:700, color:t.text3, marginBottom:8, letterSpacing:1, textTransform:"uppercase" }}>Kategorier</div>
              {CATEGORIES.map(c=>(
                <button key={c.id} onClick={()=>{setActiveCat(c.id);setTab("feed");}} style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 12px", borderRadius:10, cursor:"pointer", background:activeCat===c.id&&tab==="feed"?`${c.color}22`:"transparent", border:"1px solid transparent", color:activeCat===c.id&&tab==="feed"?c.color:t.text3, fontSize:13, fontWeight:activeCat===c.id&&tab==="feed"?700:400, marginBottom:2, width:"100%", textAlign:"left" }}>{c.icon} {c.label}</button>
              ))}
            </div>
          </aside>
          <main style={{ flex:1, minWidth:0, borderLeft:`1px solid ${t.border}`, borderRight:`1px solid ${t.border}` }}>
            {tab==="feed" && renderFeed()}
            {tab==="search" && <SearchView t={t} currentUser={currentUser} onProfile={handleProfile} />}
            {tab==="dm" && <DMView currentUser={currentUser} t={t} />}
            {(tab==="me"||tab==="profile") && <ProfileView username={profileUser||profile?.name} currentUser={currentUser} t={t} onBack={()=>setTab("feed")} />}
          </main>
          <aside style={{ width:260, flexShrink:0, paddingTop:16, paddingLeft:16, position:"sticky", top:56, height:"calc(100vh - 56px)", overflowY:"auto" }}>
            <div style={{ fontSize:12, fontWeight:700, color:t.text3, marginBottom:10, letterSpacing:1, textTransform:"uppercase" }}>Trendande 🔥</div>
            {posts.slice(0,5).map((p,i)=>{
              const cat = CATEGORIES.find(c=>c.id===p.ca                <div key={tag} onClick={()=>setTab("search")} style={{ padding:"8px 0", borderBottom:`1px solid ${t.border}`, cursor:"pointer" }}>
                <div style={{ fontWeight:700, fontSize:14, color:t.accent }}>{tag}</div>
                <div style={{ fontSize:11, color:t.text3 }}>{[2341,1892,984,451,312][i].toLocaleString()} inlägg</div>
              </div>
            ))}
          </aside>
        </div>
      ) : (
        <div style={{ flex:1, paddingBottom:64 }}>
          {tab==="feed" && renderFeed()}
          {tab==="search" && <SearchView t={t} currentUser={currentUser} onProfile={handleProfile} />}
          {tab==="dm" && <DMView currentUser={currentUser} t={t} />}
          {(tab==="me"||tab==="profile") && <ProfileView username={profileUser||profile?.name} currentUser={currentUser} t={t} onBack={()=>setTab("feed")} />}
        </div>
      )}

      {isMobile && (
        <nav style={{ position:"fixed", bottom:0, left:0, right:0, background:t.surface, borderTop:`1px solid ${t.border}`, display:"flex", zIndex:90, height:58 }}>
          {NAV.map(n=>(
            <button key={n.id} onClick={()=>{if(n.id==="me")setProfileUser(profile?.name);setTab(n.id);}} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:2, background:"none", border:"none", cursor:"pointer", color:tab===n.id?t.accent:t.text3, fontSize:10, fontWeight:tab===n.id?700:400 }}>
              <span style={{ fontSize:20 }}>{n.icon}</span>
              <span>{n.label}</span>
            </button>
          ))}
        </nav>
      )}

      {toast && <Toast msg={toast} onDone={()=>setToast(null)} t={t} />}
    </div>
  );
}