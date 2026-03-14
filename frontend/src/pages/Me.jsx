import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const fonts = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Cinzel:wght@400;500&display=swap');

@keyframes fadeUp {
from { opacity:0; transform:translateY(20px); }
to { opacity:1; transform:translateY(0); }
}

@keyframes slideDown {
from { opacity:0; transform:translateY(-8px); }
to { opacity:1; transform:translateY(0); }
}

.me-page { animation: fadeUp 0.6s ease both; }

.me-input:focus {
outline: none;
border-color: #7c3aed !important;
box-shadow: 0 0 0 3px rgba(124,58,237,0.08);
}

.me-save-btn:hover {
background:#3d1a80 !important;
letter-spacing:0.24em !important;
}

.me-dropdown-item:hover { background:#faf8f5 !important; }
.me-logout-item:hover { background:#FEF2F2 !important; }

.me-avatar-wrap:hover .me-avatar-overlay {
opacity:1 !important;
}
`;

const Me = () => {

const { user, logout } = useAuth();
const navigate = useNavigate();

const [profile,setProfile] = useState({
name:"",
phone:"",
address:"",
image:""
});

const [isEditing,setIsEditing] = useState(false);
const [menuOpen,setMenuOpen] = useState(false);

useEffect(()=>{

if(!user) return;

const key = `profile_${user.email}`;
const saved = JSON.parse(localStorage.getItem(key));

if(saved){
setProfile(saved);
setIsEditing(false);
}else{
setProfile(p=>({...p,name:user.name||""}));
setIsEditing(true);
}

},[user]);

if(!user){
return(
<>
<style>{fonts}</style>
<div style={s.notLoggedIn}>
<p style={s.notLoggedInText}>◈ Please login to view your profile</p>
</div>
</>
);
}

const handleChange = (e)=>{
setProfile({...profile,[e.target.name]:e.target.value});
};

const handleImage = (e)=>{

const file = e.target.files[0];
if(!file) return;

const reader = new FileReader();

reader.onloadend = ()=>{
setProfile({...profile,image:reader.result});
};

reader.readAsDataURL(file);

};

const handleSave = ()=>{
localStorage.setItem(`profile_${user.email}`,JSON.stringify(profile));
setIsEditing(false);
};

const initials = (profile.name || user.email || "U")
.split(" ")
.map(w=>w[0])
.join("")
.toUpperCase()
.slice(0,2);

return(
<>

<style>{fonts}</style>

<div style={s.page}>

{/* Banner */}

<div style={s.banner}>
<div style={s.bannerInner}>
<p style={s.bannerEyebrow}>VAAMI'S CREATIONS</p>
<h1 style={s.bannerTitle}>My Profile</h1>

<div style={s.divider}>
<div style={s.dividerLine}/>
<span style={s.dividerGem}>◆</span>
<div style={s.dividerLine}/>
</div>

</div>
</div>

{/* Card */}

<div style={s.cardWrap}>

<div className="me-page" style={s.card}>

{/* Menu */}

{!isEditing && (

<div style={s.menuWrap}>

<button
style={s.menuBtn}
onClick={()=>setMenuOpen(!menuOpen)}
>
⋮
</button>

{menuOpen && (

<div style={s.dropdown}>

<div
className="me-dropdown-item"
style={s.dropdownItem}
onClick={()=>{
setIsEditing(true);
setMenuOpen(false);
}}
>
✏ Edit Profile
</div>

<div style={s.dropdownDivider}/>

<div
className="me-dropdown-item me-logout-item"
style={{...s.dropdownItem,color:"#dc2626"}}
onClick={()=>{
logout();
setMenuOpen(false);
navigate("/login");
}}
>
◁ Logout
</div>

</div>

)}

</div>

)}

{/* Avatar */}

<div style={s.avatarSection}>

<div
className="me-avatar-wrap"
style={s.avatarWrap}
onClick={()=>isEditing && document.getElementById("dpUpload").click()}
>

{profile.image ? (
<img src={profile.image} alt="avatar" style={s.avatarImg}/>
) : (
<div style={s.avatarInitials}>{initials}</div>
)}

{isEditing && (
<div className="me-avatar-overlay" style={s.avatarOverlay}>
<span style={s.avatarOverlayText}>Change</span>
</div>
)}

</div>

<input
type="file"
accept="image/*"
id="dpUpload"
style={{display:"none"}}
onChange={handleImage}
/>

{!isEditing && (
<>
<h2 style={s.profileName}>{profile.name || user.name}</h2>
<p style={s.profileEmail}>{user.email}</p>
</>
)}

</div>

{/* View */}

{!isEditing ? (

<div style={s.infoSection}>

{[
{label:"FULL NAME",value:profile.name || "Not added"},
{label:"EMAIL ADDRESS",value:user.email},
{label:"PHONE NUMBER",value:profile.phone || "Not added"},
{label:"ADDRESS",value:profile.address || "Not added"}
].map(row=>(
<div key={row.label} style={s.infoRow}>
<p style={s.infoLabel}>{row.label}</p>
<p style={s.infoValue}>{row.value}</p>
</div>
))}

</div>

) : (

<div style={s.editSection}>

{[
{name:"name",label:"FULL NAME"},
{name:"phone",label:"PHONE NUMBER"}
].map(f=>(
<div key={f.name} style={s.fieldGroup}>

<label style={s.fieldLabel}>{f.label}</label>

<input
className="me-input"
type="text"
name={f.name}
value={profile[f.name] || ""}
onChange={handleChange}
style={s.input}
/>

</div>
))}

<div style={s.fieldGroup}>

<label style={s.fieldLabel}>ADDRESS</label>

<textarea
className="me-input"
name="address"
value={profile.address || ""}
onChange={handleChange}
style={{...s.input,height:"90px"}}
/>

</div>

<button
className="me-save-btn"
style={s.saveBtn}
onClick={handleSave}
>
SAVE PROFILE
</button>

<button
style={s.cancelBtn}
onClick={()=>setIsEditing(false)}
>
CANCEL
</button>

</div>

)}

</div>
</div>

</div>

</>
);
};

export default Me;

/* STYLES */

const s = {

page:{
width:"100%",
background:"#faf8f5",
minHeight:"100vh",
fontFamily:"Cormorant Garamond, serif"
},

banner:{
background:"#0f0018",
padding:"80px 40px",
textAlign:"center"
},

bannerInner:{
maxWidth:"600px",
margin:"0 auto"
},

bannerEyebrow:{
fontFamily:"Cinzel",
fontSize:"12px",
letterSpacing:"0.35em",
color:"rgba(255,214,255,0.4)",
marginBottom:"16px"
},

bannerTitle:{
fontFamily:"Cormorant Garamond",
fontSize:"56px",
fontStyle:"italic",
color:"#ffd6ff",
marginBottom:"20px"
},

divider:{
display:"flex",
alignItems:"center",
gap:"12px",
maxWidth:"160px",
margin:"0 auto"
},

dividerLine:{flex:1,height:"1px",background:"rgba(255,214,255,0.2)"},
dividerGem:{fontSize:"12px",color:"rgba(255,214,255,0.4)"},

cardWrap:{
maxWidth:"620px",
margin:"0 auto",
padding:"50px 24px 80px"
},

card:{
background:"#fff",
border:"1px solid #e8e2d9",
position:"relative"
},

menuWrap:{position:"absolute",top:"18px",right:"18px"},

menuBtn:{
background:"transparent",
border:"none",
fontSize:"26px",
cursor:"pointer"
},

dropdown:{
position:"absolute",
top:"40px",
right:0,
background:"#fff",
border:"1px solid #e8e2d9",
minWidth:"170px"
},

dropdownItem:{
padding:"14px 18px",
fontSize:"15px",
cursor:"pointer"
},

dropdownDivider:{height:"1px",background:"#eee"},

avatarSection:{
background:"#0f0018",
padding:"45px 24px",
textAlign:"center"
},

avatarWrap:{
width:"120px",
height:"120px",
borderRadius:"50%",
overflow:"hidden",
margin:"0 auto 20px"
},

avatarImg:{
width:"100%",
height:"100%",
objectFit:"cover"
},

avatarInitials:{
width:"100%",
height:"100%",
display:"flex",
alignItems:"center",
justifyContent:"center",
fontFamily:"Cinzel",
fontSize:"36px",
color:"#ffd6ff"
},

profileName:{
fontSize:"28px",
color:"#ffd6ff"
},

profileEmail:{
fontSize:"14px",
color:"rgba(255,214,255,0.6)"
},

infoSection:{padding:"10px 0"},

infoRow:{
display:"flex",
justifyContent:"space-between",
padding:"20px 28px",
borderBottom:"1px solid #f5f1ee"
},

infoLabel:{
fontFamily:"Cinzel",
fontSize:"12px",
letterSpacing:"0.25em",
color:"#9c8fa0"
},

infoValue:{
fontSize:"18px",
color:"#1a1020"
},

editSection:{padding:"30px"},

fieldGroup:{marginBottom:"20px"},

fieldLabel:{
fontFamily:"Cinzel",
fontSize:"12px",
letterSpacing:"0.25em",
marginBottom:"8px",
display:"block"
},

input:{
width:"100%",
padding:"14px",
fontSize:"17px",
border:"1px solid #ddd"
},

saveBtn:{
width:"100%",
padding:"14px",
background:"#2e1065",
color:"#ffd6ff",
fontFamily:"Cinzel",
fontSize:"14px",
letterSpacing:"0.2em",
border:"none",
cursor:"pointer",
marginBottom:"10px"
},

cancelBtn:{
width:"100%",
padding:"12px",
border:"1px solid #ddd",
background:"transparent",
fontSize:"13px",
cursor:"pointer"
},

notLoggedIn:{
display:"flex",
alignItems:"center",
justifyContent:"center",
minHeight:"60vh"
},

notLoggedInText:{
fontFamily:"Cinzel",
fontSize:"16px",
color:"#9c8fa0"
}

};