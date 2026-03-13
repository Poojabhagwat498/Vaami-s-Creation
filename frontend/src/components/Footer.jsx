const Footer = () => {
 
  return (
    <footer className="bg-[#2b0040] text-purple-200 py-14">

      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center">

        {/* Brand Name */}
        <h2 className="text-3xl font-bold text-yellow-400 mb-4">
          Vaami's Creations
        </h2>

        {/* Tagline */}
        <p className="text-lg text-purple-300 mb-8">
          Handcrafted Jewellery Designed With Love 💜
        </p>

        {/* Quick Links */}
        <div className="flex flex-wrap justify-center items-center gap-8 text-lg mb-8">
          <a href="/" className="hover:text-yellow-400 transition">Home</a>
          <a href="/menu" className="hover:text-yellow-400 transition">Collection</a>
          <a href="/wishlist" className="hover:text-yellow-400 transition">Wishlist</a>
          <a href="/contact" className="hover:text-yellow-400 transition">Contact</a>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col items-center gap-2 text-purple-300 mb-8">
          <p>Email: vaamiscreations@gmail.com</p>
          <p>Phone: +91 98765 43210</p>
          <p>Pune, India</p>
        </div>

        {/* Social Icons */}
        <div className="flex justify-center items-center gap-6 text-2xl mb-8">
          <a href="#" className="hover:text-yellow-400 transition">📷</a>
          <a href="#" className="hover:text-yellow-400 transition">👍</a>
          <a href="#" className="hover:text-yellow-400 transition">🐦</a>
        </div>

        {/* Copyright */}
        <p className="text-sm text-purple-400 border-t border-purple-700 pt-6 w-full text-center">
          © 2026 Vaami's Creations. All Rights Reserved.
        </p>

      </div>

    </footer>
  );
};

export default Footer;