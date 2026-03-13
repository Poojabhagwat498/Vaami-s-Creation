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
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Cinzel:wght@400;500&display=swap');

        .vaami-card {
          width: 280px;
          background: #ffffff;
          border: 1px solid #e8e2d9;
          border-radius: 4px;
          overflow: hidden;
          position: relative;
          transition: transform 0.35s ease, box-shadow 0.35s ease;
          font-family: 'Cormorant Garamond', Georgia, serif;
        }
        .vaami-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 24px 52px rgba(60, 20, 100, 0.13);
        }
        .vaami-img-wrap {
          position: relative;
          height: 240px;
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
          transform: scale(1.05);
        }
        .vaami-badge {
          position: absolute;
          top: 14px;
          left: 14px;
          background: #2e1065;
          color: #ffd6ff;
          font-family: 'Cinzel', serif;
          font-size: 9px;
          letter-spacing: 0.22em;
          padding: 5px 10px;
          border-radius: 0;
          z-index: 2;
        }
        .vaami-wish {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: rgba(255,255,255,0.92);
          border: 1px solid #e8e2d9;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 15px;
          transition: all 0.2s;
          z-index: 2;
        }
        .vaami-wish:hover {
          background: #fff2f8;
          border-color: #d4537e;
          transform: scale(1.1);
        }
        .vaami-body {
          padding: 18px 20px 0;
        }
        .vaami-category {
          font-family: 'Cinzel', serif;
          font-size: 9px;
          letter-spacing: 0.25em;
          color: #9c8fa0;
          margin-bottom: 7px;
          text-transform: uppercase;
        }
        .vaami-name {
          font-size: 18px;
          font-weight: 600;
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
          gap: 8px;
          margin: 10px 0;
        }
        .vaami-divider-line {
          flex: 1;
          height: 1px;
          background: #ede8e4;
        }
        .vaami-divider-gem {
          font-size: 8px;
          color: #b0a0b8;
        }
        .vaami-price-row {
          display: flex;
          align-items: baseline;
          gap: 8px;
          margin-bottom: 16px;
        }
        .vaami-price {
          font-family: 'Cinzel', serif;
          font-size: 20px;
          font-weight: 500;
          color: #2e1065;
        }
        .vaami-price-label {
          font-size: 12px;
          color: #b0a8b4;
          font-style: italic;
        }
        .vaami-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          border-top: 1px solid #ede8e4;
        }
        .vaami-btn {
          padding: 14px 10px;
          border: none;
          cursor: pointer;
          font-family: 'Cinzel', serif;
          font-size: 10px;
          letter-spacing: 0.15em;
          font-weight: 500;
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

          {/* New badge — show for recently added products */}
          <div className="vaami-badge">NEW</div>

          {/* Wishlist */}
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