import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useBag } from "../context/BagContext";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { bagItems, addToBag, removeFromBag } = useBag();

  const [product, setProduct] = useState(null);
  const [added, setAdded] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:5000/api/products/${id}`)
      .then((res) => res.json())
      .then(setProduct)
      .catch(console.error);
  }, [id]);

  const isAdded = product ? bagItems.some((item) => item.id === product.id) : false;

  const handleBagToggle = () => {
    if (isAdded) {
      removeFromBag(product.id);
    } else {
      addToBag(product);
      setAdded(true);
      setTimeout(() => navigate("/bag"), 800);
    }
  };

  if (!product) {
    return (
      <>
        <style>{skeletonCSS}</style>
        <div className="pd-page">
          <div className="pd-skeleton-wrapper">
            <div className="pd-skeleton pd-skeleton-img" />
            <div className="pd-skeleton-details">
              <div className="pd-skeleton pd-skeleton-tag" />
              <div className="pd-skeleton pd-skeleton-title" />
              <div className="pd-skeleton pd-skeleton-title short" />
              <div className="pd-skeleton pd-skeleton-desc" />
              <div className="pd-skeleton pd-skeleton-desc" />
              <div className="pd-skeleton pd-skeleton-desc short" />
              <div className="pd-skeleton pd-skeleton-price" />
              <div className="pd-skeleton pd-skeleton-btn" />
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{css}</style>
      <div className="pd-page">

        {/* BACKGROUND ORBS */}
        <div className="pd-orb pd-orb-1" />
        <div className="pd-orb pd-orb-2" />

        <div className="pd-wrapper">

          {/* LEFT — IMAGE */}
          <div className="pd-image-section">
            <div className="pd-image-frame">
              <div className={`pd-image-inner ${imgLoaded ? "loaded" : ""}`}>
                <img
                  src={`http://localhost:5000${product.image}`}
                  alt={product.name}
                  className="pd-img"
                  onLoad={() => setImgLoaded(true)}
                />
              </div>
              {/* Decorative corner accents */}
              <span className="pd-corner pd-corner-tl" />
              <span className="pd-corner pd-corner-br" />
            </div>

            {/* Floating badge */}
            <div className="pd-badge">
              <span className="pd-badge-dot" />
              In Stock
            </div>
          </div>

          {/* RIGHT — DETAILS */}
          <div className="pd-details">

            <div className="pd-eyebrow">
              <span className="pd-category-tag">Premium Collection</span>
              <span className="pd-id-tag">#{id}</span>
            </div>

            <h1 className="pd-title">{product.name}</h1>

            <div className="pd-divider" />

            <p className="pd-description">{product.description}</p>

            <div className="pd-price-row">
              <div className="pd-price">
                <span className="pd-price-symbol">₹</span>
                <span className="pd-price-amount">{product.price?.toLocaleString()}</span>
              </div>
              <span className="pd-price-note">Incl. of all taxes</span>
            </div>

            <div className="pd-actions">
              <button
                className={`pd-btn-primary ${isAdded || added ? "pd-btn-success" : ""}`}
                onClick={handleBagToggle}
                disabled={added}
              >
                <span className="pd-btn-inner">
                  {added ? (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Added to Bag
                    </>
                  ) : isAdded ? (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      In your Bag
                    </>
                  ) : (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <path d="M16 10a4 4 0 01-8 0" />
                      </svg>
                      Add to Bag
                    </>
                  )}
                </span>
              </button>

              <button
                className="pd-btn-secondary"
                onClick={() => navigate(-1)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
                Back
              </button>
            </div>

            {/* Trust badges */}
            <div className="pd-trust">
              {[
                { icon: "🚚", label: "Free Delivery", sub: "On orders above ₹499" },
                { icon: "↩️", label: "Easy Returns", sub: "7-day return policy" },
                { icon: "🔒", label: "Secure Payment", sub: "100% protected" },
              ].map((t) => (
                <div key={t.label} className="pd-trust-item">
                  <span className="pd-trust-icon">{t.icon}</span>
                  <div>
                    <div className="pd-trust-label">{t.label}</div>
                    <div className="pd-trust-sub">{t.sub}</div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetails;

/* ─── STYLES ─────────────────────────────────────────────── */

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Jost:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .pd-page {
    min-height: 100vh;
    background: #f8f5f0;
    background-image:
      radial-gradient(ellipse at 10% 20%, rgba(109, 40, 217, 0.04) 0%, transparent 50%),
      radial-gradient(ellipse at 90% 80%, rgba(245, 158, 11, 0.05) 0%, transparent 50%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 48px 24px;
    font-family: 'Jost', sans-serif;
    position: relative;
    overflow: hidden;
  }

  .pd-orb {
    position: fixed;
    border-radius: 50%;
    filter: blur(80px);
    pointer-events: none;
    z-index: 0;
  }

  .pd-orb-1 {
    width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(109,40,217,0.06), transparent 70%);
    top: -120px; left: -100px;
  }

  .pd-orb-2 {
    width: 400px; height: 400px;
    background: radial-gradient(circle, rgba(245,158,11,0.06), transparent 70%);
    bottom: -100px; right: -80px;
  }

  .pd-wrapper {
    display: flex;
    gap: 64px;
    max-width: 1000px;
    width: 100%;
    align-items: center;
    position: relative;
    z-index: 1;
    animation: pdFadeUp 0.65s cubic-bezier(0.22,1,0.36,1) both;
  }

  @keyframes pdFadeUp {
    from { opacity: 0; transform: translateY(30px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── IMAGE ── */
  .pd-image-section {
    flex: 0 0 44%;
    position: relative;
  }

  .pd-image-frame {
    position: relative;
    background: #fff;
    border-radius: 24px;
    overflow: hidden;
    box-shadow:
      0 2px 4px rgba(0,0,0,0.04),
      0 12px 40px rgba(0,0,0,0.08),
      0 40px 80px rgba(109,40,217,0.06);
    aspect-ratio: 4/5;
  }

  .pd-image-inner {
    width: 100%; height: 100%;
    opacity: 0;
    transition: opacity 0.5s ease;
  }

  .pd-image-inner.loaded {
    opacity: 1;
  }

  .pd-img {
    width: 100%; height: 100%;
    object-fit: contain;
    padding: 20px;
    transition: transform 0.6s cubic-bezier(0.22,1,0.36,1);
  }

  .pd-image-frame:hover .pd-img {
    transform: scale(1.04);
  }

  /* Corner accents */
  .pd-corner {
    position: absolute;
    width: 20px; height: 20px;
    pointer-events: none;
  }

  .pd-corner-tl {
    top: 12px; left: 12px;
    border-top: 2px solid rgba(109,40,217,0.3);
    border-left: 2px solid rgba(109,40,217,0.3);
    border-radius: 2px 0 0 0;
  }

  .pd-corner-br {
    bottom: 12px; right: 12px;
    border-bottom: 2px solid rgba(109,40,217,0.3);
    border-right: 2px solid rgba(109,40,217,0.3);
    border-radius: 0 0 2px 0;
  }

  /* Floating badge */
  .pd-badge {
    position: absolute;
    bottom: -14px;
    left: 24px;
    background: #fff;
    border: 1px solid rgba(0,0,0,0.07);
    border-radius: 100px;
    padding: 8px 16px;
    font-size: 12px;
    font-weight: 500;
    color: #333;
    display: flex;
    align-items: center;
    gap: 7px;
    box-shadow: 0 4px 16px rgba(0,0,0,0.08);
    letter-spacing: 0.3px;
  }

  .pd-badge-dot {
    width: 7px; height: 7px;
    background: #22c55e;
    border-radius: 50%;
    box-shadow: 0 0 0 3px rgba(34,197,94,0.2);
    animation: pdPulse 2s ease infinite;
  }

  @keyframes pdPulse {
    0%, 100% { box-shadow: 0 0 0 3px rgba(34,197,94,0.2); }
    50%       { box-shadow: 0 0 0 6px rgba(34,197,94,0.08); }
  }

  /* ── DETAILS ── */
  .pd-details {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .pd-eyebrow {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 16px;
  }

  .pd-category-tag {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #6d28d9;
    background: rgba(109,40,217,0.08);
    padding: 5px 12px;
    border-radius: 100px;
  }

  .pd-id-tag {
    font-size: 11px;
    color: #aaa;
    font-weight: 400;
    letter-spacing: 0.5px;
  }

  .pd-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(28px, 4vw, 42px);
    font-weight: 700;
    color: #1a1118;
    line-height: 1.15;
    letter-spacing: -0.5px;
    margin-bottom: 20px;
  }

  .pd-divider {
    width: 40px;
    height: 3px;
    background: linear-gradient(90deg, #6d28d9, #a855f7);
    border-radius: 2px;
    margin-bottom: 20px;
  }

  .pd-description {
    font-size: 15px;
    color: #6b6576;
    line-height: 1.75;
    font-weight: 300;
    margin-bottom: 28px;
  }

  .pd-price-row {
    display: flex;
    align-items: baseline;
    gap: 12px;
    margin-bottom: 32px;
  }

  .pd-price {
    display: flex;
    align-items: baseline;
    gap: 3px;
  }

  .pd-price-symbol {
    font-family: 'Jost', sans-serif;
    font-size: 22px;
    font-weight: 500;
    color: #1a1118;
    line-height: 1;
  }

  .pd-price-amount {
    font-family: 'Playfair Display', serif;
    font-size: 44px;
    font-weight: 700;
    color: #1a1118;
    line-height: 1;
    letter-spacing: -1px;
  }

  .pd-price-note {
    font-size: 12px;
    color: #aaa;
    font-weight: 400;
    letter-spacing: 0.3px;
  }

  /* ── ACTIONS ── */
  .pd-actions {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 36px;
  }

  .pd-btn-primary {
    flex: 1;
    max-width: 260px;
    padding: 16px 24px;
    background: #1a1118;
    border: none;
    border-radius: 14px;
    color: #fff;
    font-family: 'Jost', sans-serif;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.8px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.22,1,0.36,1);
    position: relative;
    overflow: hidden;
  }

  .pd-btn-primary::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, #6d28d9, #a855f7);
    opacity: 0;
    transition: opacity 0.3s;
  }

  .pd-btn-primary:hover:not(:disabled)::before {
    opacity: 1;
  }

  .pd-btn-primary:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(109,40,217,0.35);
  }

  .pd-btn-primary:active:not(:disabled) {
    transform: translateY(0);
  }

  .pd-btn-primary.pd-btn-success {
    background: #16a34a;
  }

  .pd-btn-primary.pd-btn-success::before {
    display: none;
  }

  .pd-btn-inner {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
  }

  .pd-btn-secondary {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 16px 20px;
    background: transparent;
    border: 1.5px solid rgba(0,0,0,0.12);
    border-radius: 14px;
    color: #555;
    font-family: 'Jost', sans-serif;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    letter-spacing: 0.3px;
  }

  .pd-btn-secondary:hover {
    border-color: #6d28d9;
    color: #6d28d9;
    background: rgba(109,40,217,0.04);
  }

  /* ── TRUST ── */
  .pd-trust {
    display: flex;
    flex-direction: column;
    gap: 14px;
    padding: 20px;
    background: rgba(255,255,255,0.7);
    border: 1px solid rgba(0,0,0,0.06);
    border-radius: 16px;
    backdrop-filter: blur(8px);
  }

  .pd-trust-item {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .pd-trust-icon {
    font-size: 18px;
    width: 36px;
    height: 36px;
    background: #f3f0ff;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .pd-trust-label {
    font-size: 13px;
    font-weight: 600;
    color: #1a1118;
    letter-spacing: 0.2px;
  }

  .pd-trust-sub {
    font-size: 11px;
    color: #aaa;
    margin-top: 1px;
  }

  /* ── RESPONSIVE ── */
  @media (max-width: 700px) {
    .pd-wrapper {
      flex-direction: column;
      gap: 40px;
    }

    .pd-image-section {
      flex: unset;
      width: 100%;
      max-width: 360px;
      margin: 0 auto;
    }

    .pd-btn-primary {
      max-width: unset;
    }
  }
`;

const skeletonCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500;600&display=swap');

  .pd-page {
    min-height: 100vh;
    background: #f8f5f0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 48px 24px;
    font-family: 'Jost', sans-serif;
  }

  .pd-skeleton-wrapper {
    display: flex;
    gap: 64px;
    max-width: 1000px;
    width: 100%;
    align-items: flex-start;
  }

  .pd-skeleton {
    background: linear-gradient(90deg, #ede9e3 25%, #e5e0d8 50%, #ede9e3 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
    border-radius: 12px;
  }

  @keyframes shimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  .pd-skeleton-img { flex: 0 0 44%; aspect-ratio: 4/5; border-radius: 24px; }
  .pd-skeleton-details { flex: 1; display: flex; flex-direction: column; gap: 14px; padding-top: 8px; }
  .pd-skeleton-tag  { height: 24px; width: 140px; border-radius: 100px; }
  .pd-skeleton-title { height: 40px; width: 100%; }
  .pd-skeleton-title.short { width: 65%; }
  .pd-skeleton-desc { height: 16px; width: 100%; }
  .pd-skeleton-desc.short { width: 75%; }
  .pd-skeleton-price { height: 54px; width: 160px; margin-top: 8px; }
  .pd-skeleton-btn { height: 52px; width: 220px; margin-top: 8px; border-radius: 14px; }
`;
