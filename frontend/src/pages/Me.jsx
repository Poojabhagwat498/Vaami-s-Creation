import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const fonts = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Cinzel:wght@400;500&display=swap');
  @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
  @keyframes slideDown { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
  .me-page { animation: fadeUp 0.6s ease both; }
  .me-input:focus { outline: none; border-color: #7c3aed !important; box-shadow: 0 0 0 3px rgba(124,58,237,0.08); }
  .me-save-btn:hover { background: #3d1a80 !important; letter-spacing: 0.24em !important; }
  .me-dropdown-item:hover { background: #faf8f5 !important; }
  .me-logout-item:hover { background: #FEF2F2 !important; }
  .me-avatar-wrap:hover .me-avatar-overlay { opacity: 1 !important; }
`;

const Me = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState({ name: "", phone: "", address: "", image: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    const key   = `profile_${user.email}`;
    const saved = JSON.parse(localStorage.getItem(key));
    if (saved) {
      setProfile(saved);
      setIsEditing(false);
    } else {
      setProfile((p) => ({ ...p, name: user.name || "" }));
      setIsEditing(true);
    }
  }, [user]);

  if (!user) {
    return (
      <>
        <style>{fonts}</style>
        <div style={s.notLoggedIn}>
          <p style={s.notLoggedInText}>◈ &nbsp; Please login to view your profile</p>
        </div>
      </>
    );
  }

  const handleChange = (e) => setProfile({ ...profile, [e.target.name]: e.target.value });

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setProfile({ ...profile, image: reader.result });
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    localStorage.setItem(`profile_${user.email}`, JSON.stringify(profile));
    setIsEditing(false);
  };

  const initials = (profile.name || user.email || "U")
    .split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

  return (
    <>
      <style>{fonts}</style>

      <div style={s.page}>

        {/* ── Banner ── */}
        <div style={s.banner}>
          <div style={s.bannerInner}>
            <p style={s.bannerEyebrow}>VAAMI'S CREATIONS</p>
            <h1 style={s.bannerTitle}>My Profile</h1>
            <div style={s.divider}>
              <div style={s.dividerLine} />
              <span style={s.dividerGem}>◆</span>
              <div style={s.dividerLine} />
            </div>
          </div>
        </div>

        {/* ── Card ── */}
        <div style={s.cardWrap}>
          <div className="me-page" style={s.card}>

            {/* ── Three-dot menu ── */}
            {!isEditing && (
              <div style={s.menuWrap}>
                <button
                  style={s.menuBtn}
                  onClick={() => setMenuOpen(!menuOpen)}
                >
                  ⋮
                </button>

                {menuOpen && (
                  <div style={s.dropdown}>
                    <div
                      className="me-dropdown-item"
                      style={s.dropdownItem}
                      onClick={() => { setIsEditing(true); setMenuOpen(false); }}
                    >
                      <span style={s.dropdownIcon}>✏</span> Edit Profile
                    </div>
                    <div style={s.dropdownDivider} />
                    <div
                      className="me-dropdown-item me-logout-item"
                      style={{ ...s.dropdownItem, color: "#dc2626" }}
                      onClick={() => { logout(); setMenuOpen(false); navigate("/login"); }}
                    >
                      <span style={s.dropdownIcon}>◁</span> Logout
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── Avatar ── */}
            <div style={s.avatarSection}>
              <div
                className="me-avatar-wrap"
                style={s.avatarWrap}
                onClick={() => isEditing && document.getElementById("dpUpload").click()}
              >
                {profile.image ? (
                  <img src={profile.image} alt="avatar" style={s.avatarImg} />
                ) : (
                  <div style={s.avatarInitials}>{initials}</div>
                )}

                {isEditing && (
                  <div className="me-avatar-overlay" style={s.avatarOverlay}>
                    <span style={s.avatarOverlayText}>◈ Change</span>
                  </div>
                )}
              </div>

              {/* Hidden file input */}
              <input
                type="file"
                accept="image/*"
                id="dpUpload"
                style={{ display: "none" }}
                onChange={handleImage}
              />

              {!isEditing && (
                <>
                  <h2 style={s.profileName}>{profile.name || user.name}</h2>
                  <p style={s.profileEmail}>{user.email}</p>
                  <div style={s.memberBadge}>
                    <span style={s.memberGem}>◈</span>
                    <span style={s.memberText}>VAAMI MEMBER</span>
                  </div>
                </>
              )}
            </div>

            {/* ── VIEW MODE ── */}
            {!isEditing ? (
              <div style={s.infoSection}>

                {[
                  { label: "FULL NAME",     value: profile.name    || "Not added" },
                  { label: "EMAIL ADDRESS", value: user.email },
                  { label: "PHONE NUMBER",  value: profile.phone   || "Not added" },
                  { label: "ADDRESS",       value: profile.address || "Not added" },
                ].map((row) => (
                  <div key={row.label} style={s.infoRow}>
                    <p style={s.infoLabel}>{row.label}</p>
                    <p style={s.infoValue}>{row.value}</p>
                  </div>
                ))}

              </div>
            ) : (

              /* ── EDIT MODE ── */
              <div style={s.editSection}>
                <p style={s.editHint}>◈ &nbsp; Fill in your details below</p>

                {[
                  { name: "name",    placeholder: "Full Name",     type: "text" },
                  { name: "phone",   placeholder: "Phone Number",  type: "tel"  },
                ].map((f) => (
                  <div key={f.name} style={s.fieldGroup}>
                    <label style={s.fieldLabel}>
                      {f.name === "name" ? "FULL NAME" : "PHONE NUMBER"}
                    </label>
                    <input
                      className="me-input"
                      type={f.type}
                      name={f.name}
                      value={profile[f.name] || ""}
                      onChange={handleChange}
                      placeholder={f.placeholder}
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
                    placeholder="Delivery address"
                    style={{ ...s.input, height: "80px", resize: "vertical" }}
                  />
                </div>

                <div style={s.fieldGroup}>
                  <label style={s.fieldLabel}>PROFILE PHOTO</label>
                  <label style={s.fileLabel}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImage}
                      style={{ display: "none" }}
                    />
                    <span style={s.fileText}>
                      ◈ &nbsp;
                      {profile.image ? "Change photo" : "Upload photo"}
                    </span>
                  </label>
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
                  onClick={() => setIsEditing(false)}
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

/* ══════════════ STYLES ══════════════ */
const s = {

  page: {
    width: "100%",
    background: "#faf8f5",
    minHeight: "100vh",
    fontFamily: "'Cormorant Garamond', Georgia, serif",
  },

  notLoggedIn: {
    minHeight: "60vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  notLoggedInText: {
    fontFamily: "'Cinzel', serif",
    fontSize: "12px",
    letterSpacing: "0.2em",
    color: "#9c8fa0",
  },

  /* Banner */
  banner: {
    background: "#0f0018",
    padding: "68px 40px 60px",
    textAlign: "center",
  },
  bannerInner: { maxWidth: "500px", margin: "0 auto" },
  bannerEyebrow: {
    fontFamily: "'Cinzel', serif",
    fontSize: "9px",
    letterSpacing: "0.32em",
    color: "rgba(255,214,255,0.4)",
    marginBottom: "14px",
  },
  bannerTitle: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "clamp(2.2rem, 5vw, 3.4rem)",
    fontWeight: 300,
    fontStyle: "italic",
    color: "#ffd6ff",
    margin: "0 0 20px",
    lineHeight: 1.1,
  },
  divider: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    maxWidth: "140px",
    margin: "0 auto",
  },
  dividerLine: { flex: 1, height: "1px", background: "rgba(255,214,255,0.2)" },
  dividerGem: { fontSize: "8px", color: "rgba(255,214,255,0.4)" },

  /* Card */
  cardWrap: {
    maxWidth: "580px",
    margin: "0 auto",
    padding: "48px 24px 80px",
  },
  card: {
    background: "#fff",
    border: "1px solid #e8e2d9",
    borderRadius: "0",
    overflow: "hidden",
    position: "relative",
  },

  /* Menu */
  menuWrap: { position: "absolute", top: "16px", right: "16px", zIndex: 10 },
  menuBtn: {
    background: "transparent",
    border: "none",
    fontSize: "22px",
    cursor: "pointer",
    color: "#4a3050",
    lineHeight: 1,
    padding: "4px 8px",
  },
  dropdown: {
    position: "absolute",
    top: "36px",
    right: 0,
    background: "#fff",
    border: "1px solid #e8e2d9",
    minWidth: "160px",
    zIndex: 20,
    animation: "slideDown 0.25s ease",
  },
  dropdownItem: {
    padding: "12px 16px",
    cursor: "pointer",
    fontSize: "13px",
    fontFamily: "'Cormorant Garamond', serif",
    color: "#1a1020",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    transition: "background 0.2s",
  },
  dropdownDivider: { height: "1px", background: "#f0ece8" },
  dropdownIcon: { fontSize: "12px", opacity: 0.6 },

  /* Avatar */
  avatarSection: {
    background: "#0f0018",
    padding: "40px 24px 32px",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatarWrap: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    overflow: "hidden",
    border: "2px solid rgba(255,214,255,0.3)",
    position: "relative",
    marginBottom: "16px",
    cursor: "default",
  },
  avatarImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  avatarInitials: {
    width: "100%",
    height: "100%",
    background: "rgba(255,214,255,0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Cinzel', serif",
    fontSize: "28px",
    fontWeight: 500,
    color: "#ffd6ff",
    letterSpacing: "0.08em",
  },
  avatarOverlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(15,0,24,0.65)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    opacity: 0,
    transition: "opacity 0.25s",
    cursor: "pointer",
  },
  avatarOverlayText: {
    fontFamily: "'Cinzel', serif",
    fontSize: "8px",
    letterSpacing: "0.18em",
    color: "#ffd6ff",
  },
  profileName: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "24px",
    fontWeight: 400,
    fontStyle: "italic",
    color: "#ffd6ff",
    margin: "0 0 4px",
  },
  profileEmail: {
    fontFamily: "'Cinzel', serif",
    fontSize: "9px",
    letterSpacing: "0.18em",
    color: "rgba(255,214,255,0.4)",
    marginBottom: "16px",
  },
  memberBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "7px",
    border: "1px solid rgba(255,214,255,0.2)",
    padding: "5px 14px",
  },
  memberGem: { fontSize: "10px", color: "rgba(255,214,255,0.45)" },
  memberText: {
    fontFamily: "'Cinzel', serif",
    fontSize: "8px",
    letterSpacing: "0.25em",
    color: "rgba(255,214,255,0.45)",
  },

  /* Info rows */
  infoSection: { padding: "8px 0" },
  infoRow: {
    padding: "18px 28px",
    borderBottom: "1px solid #f5f1ee",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "16px",
  },
  infoLabel: {
    fontFamily: "'Cinzel', serif",
    fontSize: "8px",
    letterSpacing: "0.22em",
    color: "#9c8fa0",
    margin: 0,
    flexShrink: 0,
    paddingTop: "2px",
  },
  infoValue: {
    fontSize: "15px",
    color: "#1a1020",
    margin: 0,
    textAlign: "right",
    lineHeight: 1.5,
  },

  /* Edit section */
  editSection: { padding: "28px" },
  editHint: {
    fontFamily: "'Cinzel', serif",
    fontSize: "8px",
    letterSpacing: "0.2em",
    color: "#9c8fa0",
    marginBottom: "24px",
    textAlign: "center",
  },
  fieldGroup: { marginBottom: "18px" },
  fieldLabel: {
    fontFamily: "'Cinzel', serif",
    fontSize: "8px",
    letterSpacing: "0.22em",
    color: "#6b5a75",
    display: "block",
    marginBottom: "7px",
  },
  input: {
    width: "100%",
    padding: "11px 14px",
    border: "1px solid #e0dbd8",
    borderRadius: "0",
    fontSize: "15px",
    fontFamily: "'Cormorant Garamond', serif",
    color: "#1a1020",
    background: "#faf8f5",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  },
  fileLabel: {
    display: "block",
    padding: "11px 14px",
    border: "1px dashed #c4b5c8",
    cursor: "pointer",
    background: "#faf8f5",
  },
  fileText: {
    fontFamily: "'Cinzel', serif",
    fontSize: "9px",
    letterSpacing: "0.14em",
    color: "#9c8fa0",
  },
  saveBtn: {
    width: "100%",
    padding: "13px",
    background: "#2e1065",
    color: "#ffd6ff",
    border: "none",
    fontFamily: "'Cinzel', serif",
    fontSize: "10px",
    letterSpacing: "0.18em",
    cursor: "pointer",
    transition: "background 0.3s ease, letter-spacing 0.3s ease",
    marginBottom: "10px",
    borderRadius: "0",
  },
  cancelBtn: {
    width: "100%",
    padding: "11px",
    background: "transparent",
    color: "#9c8fa0",
    border: "1px solid #e0dbd8",
    fontFamily: "'Cinzel', serif",
    fontSize: "9px",
    letterSpacing: "0.18em",
    cursor: "pointer",
    borderRadius: "0",
  },
};