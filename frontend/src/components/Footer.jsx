const Footer = () => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&family=Cinzel:wght@400;500&display=swap');

        .vaami-footer { background: #0f0018; width: 100%; font-family: 'Cormorant Garamond', Georgia, serif; }
        .vaami-footer-inner { max-width: 1100px; margin: 0 auto; padding: 64px 32px 0; }

        .footer-top { display: flex; flex-direction: column; align-items: center; text-align: center; padding-bottom: 48px; border-bottom: 1px solid rgba(255,214,255,0.12); }

        .footer-logo { font-family: 'Cinzel', serif; font-size: 28px; font-weight: 500; color: #ffd6ff; letter-spacing: 0.18em; margin-bottom: 10px; }
        .footer-tagline { font-size: 15px; font-style: italic; color: rgba(200,170,220,0.7); letter-spacing: 0.04em; margin-bottom: 32px; }

        .footer-divider { display: flex; align-items: center; gap: 12px; width: 100%; max-width: 320px; margin-bottom: 40px; }
        .footer-divider-line { flex: 1; height: 1px; background: rgba(255,214,255,0.18); }
        .footer-divider-gem { font-size: 8px; color: rgba(255,214,255,0.45); }

        .footer-mid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 48px; padding: 48px 0; border-bottom: 1px solid rgba(255,214,255,0.12); }

        .footer-col-title { font-family: 'Cinzel', serif; font-size: 10px; letter-spacing: 0.3em; color: rgba(255,214,255,0.5); margin-bottom: 20px; text-transform: uppercase; }

        .footer-links { display: flex; flex-direction: column; gap: 12px; }
        .footer-link { font-size: 15px; color: rgba(200,170,220,0.75); text-decoration: none; letter-spacing: 0.02em; transition: color 0.25s, letter-spacing 0.25s; }
        .footer-link:hover { color: #ffd6ff; letter-spacing: 0.06em; }

        .footer-contact-item { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 12px; }
        .footer-contact-icon { font-size: 13px; margin-top: 2px; opacity: 0.5; }
        .footer-contact-text { font-size: 14px; color: rgba(200,170,220,0.75); line-height: 1.5; }

        .footer-social { display: flex; gap: 14px; }
        .footer-social-btn { width: 40px; height: 40px; border: 1px solid rgba(255,214,255,0.2); display: flex; align-items: center; justify-content: center; font-size: 16px; color: rgba(200,170,220,0.7); text-decoration: none; transition: all 0.25s; border-radius: 0; }
        .footer-social-btn:hover { border-color: #ffd6ff; color: #ffd6ff; background: rgba(255,214,255,0.06); }

        .footer-bottom { padding: 22px 0; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
        .footer-copy { font-family: 'Cinzel', serif; font-size: 9px; letter-spacing: 0.2em; color: rgba(255,214,255,0.3); }
        .footer-bottom-links { display: flex; gap: 24px; }
        .footer-bottom-link { font-family: 'Cinzel', serif; font-size: 9px; letter-spacing: 0.18em; color: rgba(255,214,255,0.3); text-decoration: none; transition: color 0.2s; }
        .footer-bottom-link:hover { color: rgba(255,214,255,0.7); }

        .footer-ornament { font-size: 9px; color: rgba(255,214,255,0.25); letter-spacing: 0.15em; margin-bottom: 16px; }

        @media (max-width: 640px) {
          .footer-mid { grid-template-columns: 1fr; gap: 36px; text-align: center; }
          .footer-contact-item { justify-content: center; }
          .footer-social { justify-content: center; }
          .footer-bottom { justify-content: center; text-align: center; }
          .footer-bottom-links { justify-content: center; }
        }
      `}</style>

      <footer className="vaami-footer">
        <div className="vaami-footer-inner">

          {/* Top — Brand */}
          <div className="footer-top">
            <div className="footer-ornament">✦ &nbsp; ✦ &nbsp; ✦</div>
            <div className="footer-logo">VAAMI'S CREATIONS</div>
            <p className="footer-tagline">Where elegance meets craftsmanship</p>

            <div className="footer-divider">
              <div className="footer-divider-line" />
              <span className="footer-divider-gem">◆</span>
              <div className="footer-divider-line" />
            </div>

            <p style={{ fontFamily:"'Cinzel',serif", fontSize:"9px", letterSpacing:"0.28em", color:"rgba(255,214,255,0.35)", marginTop:"-24px" }}>
              HANDCRAFTED JEWELLERY · PUNE, INDIA
            </p>
          </div>

          {/* Mid — 3 columns */}
          <div className="footer-mid">

            {/* Quick Links */}
            <div>
              <div className="footer-col-title">Navigate</div>
              <div className="footer-links">
                {[
                  { label: "Home", href: "/" },
                  { label: "Collection", href: "/menu" },
                  { label: "Wishlist", href: "/wishlist" },
                  { label: "My Orders", href: "/orders" },
                  { label: "Contact", href: "/contact" },
                ].map((l) => (
                  <a key={l.label} href={l.href} className="footer-link">{l.label}</a>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div>
              <div className="footer-col-title">Contact Us</div>
              {[
                { icon: "✉", text: "vaamiscreations@gmail.com" },
                { icon: "✆", text: "+91 98765 43210" },
                { icon: "◎", text: "Pune, Maharashtra, India" },
              ].map((c) => (
                <div key={c.text} className="footer-contact-item">
                  <span className="footer-contact-icon">{c.icon}</span>
                  <span className="footer-contact-text">{c.text}</span>
                </div>
              ))}
            </div>

            {/* Social */}
            <div>
              <div className="footer-col-title">Follow Us</div>
              <div className="footer-social">
                {[
                  { icon: "📷", label: "Instagram" },
                  { icon: "👍", label: "Facebook" },
                  { icon: "🐦", label: "Twitter" },
                ].map((s) => (
                  <a key={s.label} href="#" className="footer-social-btn" title={s.label}>
                    {s.icon}
                  </a>
                ))}
              </div>
              <p style={{ fontSize:"13px", color:"rgba(200,170,220,0.45)", fontStyle:"italic", marginTop:"20px", lineHeight:1.7 }}>
                Follow our journey and discover new collections crafted with love.
              </p>
            </div>

          </div>

          {/* Bottom */}
          <div className="footer-bottom">
            <span className="footer-copy">© 2026 VAAMI'S CREATIONS · ALL RIGHTS RESERVED</span>
            <div className="footer-bottom-links">
              {["Privacy Policy", "Terms of Use", "Returns"].map((l) => (
                <a key={l} href="#" className="footer-bottom-link">{l}</a>
              ))}
            </div>
          </div>

        </div>
      </footer>
    </>
  );
};

export default Footer;