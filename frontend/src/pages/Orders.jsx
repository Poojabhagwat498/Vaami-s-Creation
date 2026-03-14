import { useEffect, useState } from "react";

const fonts = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Cinzel:wght@400;500;600&display=swap');

@keyframes spin { to { transform: rotate(360deg); } }
@keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }

.order-card { animation: fadeUp 0.5s ease both; transition: box-shadow 0.3s ease; }
.order-card:hover { box-shadow: 0 12px 36px rgba(15,0,24,0.10) !important; }

.details-btn:hover { color:#0f0018 !important; letter-spacing:0.2em !important; }

.stat-card:hover { transform: translateY(-3px); box-shadow:0 8px 24px rgba(15,0,24,0.08) !important; }
`;

const statusConfig = {
  Delivered:  { bg:"#EAF3DE", color:"#3B6D11", label:"Delivered"},
  delivered:  { bg:"#EAF3DE", color:"#3B6D11", label:"Delivered"},
  Shipped:    { bg:"#E6F1FB", color:"#185FA5", label:"Shipped"},
  shipped:    { bg:"#E6F1FB", color:"#185FA5", label:"Shipped"},
  Cancelled:  { bg:"#FCEBEB", color:"#A32D2D", label:"Cancelled"},
  cancelled:  { bg:"#FCEBEB", color:"#A32D2D", label:"Cancelled"},
  Processing: { bg:"#FAEEDA", color:"#854F0B", label:"Processing"},
  processing: { bg:"#FAEEDA", color:"#854F0B", label:"Processing"},
};

const Orders = () => {

const [orders,setOrders]=useState([]);
const [loading,setLoading]=useState(true);

const token = localStorage.getItem("token");

useEffect(()=>{

const fetchOrders = async()=>{

try{

const res = await fetch("http://localhost:5000/api/orders/my",{
headers:{Authorization:`Bearer ${token}`}
});

const data = await res.json();

if(Array.isArray(data)) setOrders(data);
else if(Array.isArray(data.orders)) setOrders(data.orders);
else setOrders([]);

}catch(err){
console.error(err);
setOrders([]);
}
finally{
setLoading(false);
}

};

if(token) fetchOrders();

},[token]);

const totalSpent = orders.reduce((sum,o)=>sum+(o.totalPrice||0),0);

const delivered = orders.filter(o=>o.status==="Delivered"||o.status==="delivered").length;


/* LOADING */

if(loading){
return(
<>
<style>{fonts}</style>

<div style={s.page}>

<div style={s.banner}>
<div style={s.bannerInner}>
<p style={s.eyebrow}>VAAMI'S CREATIONS</p>
<h1 style={s.bannerTitle}>My Orders</h1>
</div>
</div>

<div style={s.loadingScreen}>
<div style={s.spinner}/>
<p style={s.loadingText}>Fetching your orders...</p>
</div>

</div>
</>
);
}


/* PAGE */

return(
<>
<style>{fonts}</style>

<div style={s.page}>

{/* Banner */}

<div style={s.banner}>
<div style={s.bannerInner}>
<p style={s.eyebrow}>VAAMI'S CREATIONS</p>
<h1 style={s.bannerTitle}>My Orders</h1>
<p style={s.bannerSub}>Track and manage your purchases</p>
</div>
</div>

{/* Body */}

<div style={s.body}>

{/* Stats */}

<div style={s.statsRow}>

{[
{label:"TOTAL ORDERS",value:orders.length},
{label:"AMOUNT SPENT",value:`₹${totalSpent.toLocaleString()}`},
{label:"DELIVERED",value:delivered}
].map(st=>(
<div key={st.label} className="stat-card" style={s.statCard}>
<p style={s.statLabel}>{st.label}</p>
<p style={s.statValue}>{st.value}</p>
</div>
))}

</div>


{/* Orders */}

{orders.length===0?(
<div style={s.emptyState}>
<p style={s.emptyTitle}>No orders yet</p>
<p style={s.emptySubtitle}>Your orders will appear here once placed</p>
</div>
):(

<div style={s.ordersList}>

{orders.map(order=>{

const st=statusConfig[order.status]||{
bg:"#F1EFE8",
color:"#5F5E5A",
label:order.status
};

return(

<div key={order._id} className="order-card" style={s.orderCard}>

<div style={s.orderHeader}>

<div>
<p style={s.orderId}>
Order <span style={s.orderIdVal}>#{order._id?.slice(-8).toUpperCase()}</span>
</p>

<p style={s.orderDate}>
{order.createdAt
?new Date(order.createdAt).toLocaleDateString("en-IN")
:"—"}
</p>
</div>

<div style={s.orderHeaderRight}>

<span style={{...s.statusBadge,background:st.bg,color:st.color}}>
{st.label}
</span>

<span style={s.orderTotal}>
₹{order.totalPrice?.toLocaleString()}
</span>

</div>

</div>

{/* Items */}

<div>

{order.items?.map((item)=>(
<div key={item._id} style={s.itemRow}>

<img
src={`http://localhost:5000${item.image}`}
alt={item.name}
style={s.itemImg}
/>

<div style={s.itemInfo}>
<p style={s.itemCategory}>{item.category||"JEWELLERY"}</p>
<p style={s.itemName}>{item.name}</p>
<p style={s.itemQty}>Qty: {item.quantity}</p>
</div>

<p style={s.itemPrice}>
₹{item.price?.toLocaleString()}
</p>

</div>
))}

</div>

{/* Footer */}

<div style={s.orderFooter}>
<p style={s.orderStatus}>
{order.status==="Delivered"?"◈ Order completed":"◈ In progress"}
</p>

<button className="details-btn" style={s.detailsBtn}>
View Details →
</button>
</div>

</div>

);

})}

</div>

)}

</div>

</div>
</>
);
};

export default Orders;


/* STYLES */

const s = {

page:{
width:"100%",
background:"#faf8f5",
minHeight:"100vh",
fontFamily:"'Cormorant Garamond', Georgia, serif"
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

eyebrow:{
fontFamily:"'Cinzel', serif",
fontSize:"12px",
letterSpacing:"0.35em",
color:"rgba(255,214,255,0.4)",
marginBottom:"14px"
},

bannerTitle:{
fontFamily:"'Cormorant Garamond', serif",
fontSize:"60px",
color:"#ffd6ff",
marginBottom:"16px"
},

bannerSub:{
fontSize:"18px",
color:"rgba(255,214,255,0.4)"
},

body:{
maxWidth:"950px",
margin:"0 auto",
padding:"60px 40px"
},

statsRow:{
display:"grid",
gridTemplateColumns:"repeat(3,1fr)",
gap:"22px",
marginBottom:"48px"
},

statCard:{
background:"#fff",
border:"1px solid #e8e2d9",
borderTop:"3px solid #2e1065",
padding:"30px 20px",
textAlign:"center"
},

statLabel:{
fontFamily:"'Cinzel', serif",
fontSize:"12px",
letterSpacing:"0.28em",
color:"#9c8fa0"
},

statValue:{
fontFamily:"'Cinzel', serif",
fontSize:"36px",
fontWeight:600,
color:"#0f0018"
},

ordersList:{
display:"flex",
flexDirection:"column",
gap:"26px"
},

orderCard:{
background:"#fff",
border:"1px solid #e8e2d9"
},

orderHeader:{
padding:"22px 24px",
background:"#faf8f5",
display:"flex",
justifyContent:"space-between"
},

orderId:{
fontSize:"18px"
},

orderIdVal:{
fontFamily:"'Cinzel', serif",
fontSize:"17px",
fontWeight:600
},

orderDate:{
fontSize:"14px",
color:"#9c8fa0"
},

orderHeaderRight:{
display:"flex",
gap:"16px",
alignItems:"center"
},

statusBadge:{
fontFamily:"'Cinzel', serif",
fontSize:"12px",
padding:"6px 14px"
},

orderTotal:{
fontFamily:"'Cinzel', serif",
fontSize:"22px",
fontWeight:600
},

itemRow:{
display:"flex",
alignItems:"center",
gap:"18px",
padding:"20px 24px"
},

itemImg:{
width:"80px",
height:"80px",
objectFit:"cover"
},

itemInfo:{flex:1},

itemCategory:{
fontFamily:"'Cinzel', serif",
fontSize:"11px",
letterSpacing:"0.22em",
color:"#9c8fa0"
},

itemName:{
fontSize:"18px",
fontWeight:600
},

itemQty:{
fontSize:"14px",
color:"#9c8fa0"
},

itemPrice:{
fontFamily:"'Cinzel', serif",
fontSize:"18px",
fontWeight:600
},

orderFooter:{
padding:"18px 24px",
background:"#faf8f5",
display:"flex",
justifyContent:"space-between"
},

orderStatus:{
fontFamily:"'Cinzel', serif",
fontSize:"12px"
},

detailsBtn:{
fontFamily:"'Cinzel', serif",
fontSize:"13px",
color:"#2e1065",
background:"none",
border:"none",
cursor:"pointer"
},

loadingScreen:{
display:"flex",
flexDirection:"column",
alignItems:"center",
padding:"80px"
},

spinner:{
width:"36px",
height:"36px",
border:"3px solid #eee",
borderTop:"3px solid #2e1065",
borderRadius:"50%",
animation:"spin 1s linear infinite"
},

loadingText:{
fontSize:"16px"
},

emptyState:{
textAlign:"center",
padding:"80px"
},

emptyTitle:{
fontSize:"22px"
},

emptySubtitle:{
fontSize:"16px",
color:"#9c8fa0"
}

};