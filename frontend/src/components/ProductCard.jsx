import { Link, useNavigate } from "react-router-dom";
import { useBag } from "../context/BagContext";
import { useWishlist } from "../context/WishListContext.jsx";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { bagItems, addToBag, removeFromBag } = useBag();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const isAdded = bagItems.some((item) => item._id === product._id);
  const wishlisted = isWishlisted(product._id);

  const handleBagToggle = () => {
    isAdded ? removeFromBag(product._id) : addToBag(product);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Cinzel:wght@400;500;600&display=swap');

        .vaami-card {
          width: 300px;
          background: #ffffff;
          border: 1px solid #e8e2d9;
          border-radius: 6px;
          overflow: hidden;
          position: relative;
          transition: transform 0.35s ease, box-shadow 0.35s ease;
          font-family: 'Cormorant Garamond', Georgia, serif;
        }

        .vaami-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 28px 60px rgba(60, 20, 100, 0.18);
        }

        .vaami-img-wrap {
          position: relative;
          height: 260px;
          overflow: hidden;
          background: #f9f7f4;
          cursor: pointer;
        }

        .vaami-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.55s ease;
        }

        .vaami-card:hover .vaami-img-wrap img {
          transform: scale(1.06);
        }

        .vaami-badge {
          position: absolute;
          top: 16px;
          left: 16px;
          background: #2e1065;
          color: #ffd6ff;
          font-family: 'Cinzel', serif;
          font-size: 11px;
          letter-spacing: 0.25em;
          padding: 6px 12px;
          z-index: 2;
        }

        .vaami-wish {
          position: absolute;
          top: 14px;
          right: 14px;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: rgba(255,255,255,0.95);
          border: 1px solid #e8e2d9;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 18px;
          transition: all 0.25s;
          z-index: 2;
        }

        .vaami-wish:hover {
          background: #fff2f8;
          border-color: #d4537e;
          transform: scale(1.15);
        }

        .vaami-body {
          padding: 22px 24px 4px;
        }

        .vaami-category {
          font-family: 'Cinzel', serif;
          font-size: 11px;
          letter-spacing: 0.28em;
          color: #9c8fa0;
          margin-bottom: 10px;
          text-transform: uppercase;
        }

        .vaami-name {
          font-size: 22px;
          font-weight: 700;
          color: #1a1020;
          line-height: 1.3;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          text-transform: capitalize;
        }

        .vaami-divider {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 14px 0;
        }

        .vaami-divider-line {
          flex: 1;
          height: 1px;
          background: #ede8e4;
        }

        .vaami-divider-gem {
          font-size: 10px;
          color: #b0a0b8;
        }

        .vaami-price-row {
          display: flex;
          align-items: baseline;
          gap: 10px;
          margin-bottom: 18px;
        }

        .vaami-price {
          font-family: 'Cinzel', serif;
          font-size: 24px;
          font-weight: 600;
          color: #2e1065;
        }

        .vaami-price-label {
          font-size: 14px;
          color: #b0a8b4;
          font-style: italic;
        }

        .vaami-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          border-top: 1px solid #ede8e4;
        }

        .vaami-btn {
          padding: 16px 12px;
          border: none;
          cursor: pointer;
          font-family: 'Cinzel', serif;
          font-size: 13px;
          letter-spacing: 0.18em;
          font-weight: 600;
          transition: all 0.25s ease;
        }

        .vaami-btn-view {
          background: #fff;
          color: #534AB7;
          border-right: 1px solid #ede8e4;
          width: 100%;
          display: block;
          text-align: center;
          text-decoration: none;
        }

        .vaami-btn-view:hover {
          background: #EEEDFE;
          color: #3C3489;
        }

        .vaami-btn-bag {
          background: #2e1065;
          color: #ffd6ff;
          width: 100%;
        }

        .vaami-btn-bag:hover {
          background: #3d1a80;
        }

        .vaami-btn-bag.added {
          background: #1a0840;
          color: #c4b5e8;
        }

      `}</style>

      <div className="vaami-card">

        {/* Image */}
        <div
          className="vaami-img-wrap"
          onClick={() => navigate(`/product/${product._id}`)}
        >
          <img
            src={`http://localhost:5000${product.image}`}
            alt={product.name}
          />

          <div className="vaami-badge">NEW</div>

          <button
            className="vaami-wish"
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product);
            }}
          >
            {wishlisted ? "❤️" : "🤍"}
          </button>
        </div>

        {/* Body */}
        <div className="vaami-body">
          <div className="vaami-category">
            {product.category || "Jewellery"} · Handcrafted
          </div>

          <div className="vaami-name">{product.name}</div>

          <div className="vaami-divider">
            <div className="vaami-divider-line" />
            <span className="vaami-divider-gem">◆</span>
            <div className="vaami-divider-line" />
          </div>

          <div className="vaami-price-row">
            <span className="vaami-price">₹{product.price?.toLocaleString()}</span>
            <span className="vaami-price-label">free shipping</span>
          </div>
        </div>

        {/* Actions */}
        <div className="vaami-actions">
          <Link
            to={`/product/${product._id}`}
            className="vaami-btn vaami-btn-view"
          >
            VIEW
          </Link>

          <button
            onClick={handleBagToggle}
            className={`vaami-btn vaami-btn-bag ${isAdded ? "added" : ""}`}
          >
            {isAdded ? "ADDED ✔" : "ADD TO BAG"}
          </button>
        </div>

      </div>
    </>
  );
};

export default ProductCard;