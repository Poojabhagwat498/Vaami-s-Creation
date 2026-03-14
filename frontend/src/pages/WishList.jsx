import { useWishlist } from "../context/WishListContext";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";

const WishlistPage = () => {
  const { wishlist } = useWishlist();
  const navigate = useNavigate();

  return (
    <>
      <style>{css}</style>

      {/* HERO SECTION */}
      <div className="wl-hero">
        <p className="wl-hero-eyebrow">VAAMI'S CREATIONS</p>

        <h1 className="wl-hero-title">My Wishlist</h1>

        <div className="wl-hero-rule">
          <span className="wl-rule-line"></span>
          <span className="wl-rule-dot"></span>
          <span className="wl-rule-line"></span>
        </div>
      </div>

      {/* BODY */}
      <div className="wl-body">
        <div className="wl-container">

          {wishlist.length === 0 ? (

            <div className="wl-empty-card">

              <div className="wl-empty-icon">
                <svg width="28" height="28" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="1.4"
                  strokeLinecap="round" strokeLinejoin="round">

                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 
                  5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 
                  7.78l1.06 1.06L12 21.23l7.78-7.78 
                  1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>

                </svg>
              </div>

              <p className="wl-empty-title">
                YOUR WISHLIST IS EMPTY
              </p>

              <p className="wl-empty-sub">
                Discover our handcrafted collection
              </p>

              <button
                className="wl-empty-btn"
                onClick={() => navigate("/home")}
              >
                SHOP COLLECTION
              </button>

            </div>

          ) : (

            <>
              <p className="wl-count">
                {wishlist.length} {wishlist.length === 1 ? "ITEM" : "ITEMS"} SAVED
              </p>

              <div className="wl-grid">
                {wishlist.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            </>

          )}

        </div>
      </div>
    </>
  );
};

export default WishlistPage;

const css = `

@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Jost:wght@300;400;500&display=swap');

*{
  margin:0;
  padding:0;
  box-sizing:border-box;
}

/* HERO */

.wl-hero{
  width:100%;
  background:#0f0c29;
  text-align:center;
  padding:60px 20px;
}

.wl-hero-eyebrow{
  font-family:'Jost',sans-serif;
  font-size:10px;
  letter-spacing:4px;
  color:rgba(255,255,255,0.35);
  margin-bottom:14px;
}

.wl-hero-title{
  font-family:'Cormorant Garamond',serif;
  font-size:56px;
  font-style:italic;
  color:white;
  margin-bottom:16px;
}

.wl-hero-rule{
  display:flex;
  align-items:center;
  justify-content:center;
  gap:10px;
}

.wl-rule-line{
  width:70px;
  height:1px;
  background:rgba(255,255,255,0.2);
}

.wl-rule-dot{
  width:6px;
  height:6px;
  border-radius:50%;
  background:rgba(255,255,255,0.3);
}

/* BODY */

.wl-body{
  background:#f5f1ea;
  padding:60px 20px 80px;
  min-height:60vh;
}

.wl-container{
  max-width:1100px;
  margin:auto;
}

/* EMPTY CARD */

.wl-empty-card{
  max-width:720px;
  margin:0 auto;
  background:white;
  border:1px solid #e7e1d8;
  padding:60px 40px;
  text-align:center;
}

.wl-empty-icon{
  color:#b8aa9c;
  margin-bottom:16px;
}

.wl-empty-title{
  font-family:'Jost',sans-serif;
  font-size:12px;
  letter-spacing:2px;
  font-weight:500;
  color:#3a2e28;
}

.wl-empty-sub{
  font-family:'Cormorant Garamond',serif;
  font-style:italic;
  color:#9c8e82;
  margin-top:6px;
  margin-bottom:24px;
  font-size:16px;
}

/* BUTTON */

.wl-empty-btn{
  background:#1c1410;
  color:white;
  border:none;
  padding:14px 32px;
  font-family:'Jost',sans-serif;
  font-size:10px;
  letter-spacing:2.5px;
  cursor:pointer;
  transition:0.2s;
}

.wl-empty-btn:hover{
  background:#2e1a40;
}

/* GRID */

.wl-count{
  font-family:'Jost',sans-serif;
  font-size:11px;
  letter-spacing:2px;
  margin-bottom:30px;
  color:#9c8e82;
}

.wl-grid{
  display:grid;
  grid-template-columns:repeat(auto-fill,minmax(250px,1fr));
  gap:24px;
}

/* MOBILE */

@media(max-width:600px){

.wl-hero-title{
  font-size:42px;
}

.wl-empty-card{
  padding:40px 20px;
}

.wl-grid{
  grid-template-columns:repeat(auto-fill,minmax(160px,1fr));
}

}

`;