import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const styles = {
  container: {
    maxWidth: "600px",
    position: "relative",
    margin: "60px auto",
    padding: "30px",
    background: "#faf7ff",
    borderRadius: "14px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    fontFamily: "Segoe UI, sans-serif",
  },
  avatar: {
    width: "110px",
    height: "110px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "4px solid #7c3aed",
    margin: "0 auto 15px",
    display: "block",
  },
  center: { textAlign: "center" },
  name: { fontSize: "24px", fontWeight: "600", color: "#4c1d95" },
  email: { color: "#666", marginBottom: "25px" },
  label: { fontSize: "19px", color: "#111", fontWeight: "600" },
  value: { fontSize: "17px", marginBottom: "16px" },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #c4b5fd",
    marginBottom: "16px",
  },
  btn: {
    width: "100%",
    padding: "12px",
    background: "linear-gradient(135deg, #7c3aed, #9333ea)",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontWeight: "600",
    cursor: "pointer",
  },
  menuBtn: {
    position: "absolute",
    top: "16px",
    right: "16px",
    fontSize: "22px",
    cursor: "pointer",
    background: "transparent",
    border: "none",
    color: "#4c1d95",
  },
  dropdown: {
    position: "absolute",
    top: "45px",
    right: "16px",
    background: "#fff",
    borderRadius: "8px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
    overflow: "hidden",
    zIndex: 10,
  },
  dropdownItem: {
    padding: "10px 14px",
    cursor: "pointer",
    fontSize: "14px",
  },
};

const Me = () => {
 const { user, logout } = useAuth();
 const navigate = useNavigate();

  const [profile, setProfile] = useState({
    name: "",
    phone: "",
    address: "",
    image: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!user) return;

    const key = `profile_${user.email}`;
    const saved = JSON.parse(localStorage.getItem(key));

    if (saved) {
      setProfile(saved);
      setIsEditing(false);
    } else {
      setProfile((p) => ({ ...p, name: user.name }));
      setIsEditing(true); // first time user
    }
  }, [user]);

  if (!user) return <p style={{ textAlign: "center" }}>Please login</p>;

  const handleChange = (e) =>
    setProfile({ ...profile, [e.target.name]: e.target.value });

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () =>
      setProfile({ ...profile, image: reader.result });
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    localStorage.setItem(
      `profile_${user.email}`,
      JSON.stringify(profile)
    );
    setIsEditing(false);
  };

  const hiddenUpload = (
    <input
      type="file"
      accept="image/*"
      id="dpUpload"
      style={{ display: "none" }}
      onChange={handleImage}
    />
  );

  return (
    <div style={styles.container}>
      {!isEditing && (
        <>
          {/* 3 DOT MENU */}
          <button
            style={styles.menuBtn}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ⋮
          </button>

   {menuOpen && (
  <div style={styles.dropdown}>
    {/* Edit */}
    <div
      style={styles.dropdownItem}
      onClick={() => {
        setIsEditing(true);
        setMenuOpen(false);
      }}
    >
      ✏️ Edit Profile
    </div>
<div
  style={{
    ...styles.dropdownItem,
    color: "#dc2626",
    borderTop: "1px solid #eee",
  }}
  onClick={() => {
    logout();            
    setMenuOpen(false);  
    navigate("/login");  
  }}
>
  🚪 Logout
</div>

    {/* Logout */}
  
  </div>
)}

        </>
      )}

      {!isEditing ? (
        <>
         <>
            {hiddenUpload}

            <img
              src={
                profile.image ||
                `https://ui-avatars.com/api/?name=${profile.name}`
              }
              style={{ ...styles.avatar, cursor: isEditing ? "pointer" : "default" }}
              onClick={() =>
                isEditing && document.getElementById("dpUpload").click()
              }
              title={isEditing ? "Click to change profile picture" : ""}
            />
          </>


          <div style={styles.center}>
            <h2 style={styles.name}>{profile.name}</h2>
            <p style={styles.email}>{user.email}</p>
          </div>

          <p style={styles.label}>Phone</p>
          <p style={styles.value}>{profile.phone || "Not added"}</p>

          <p style={styles.label}>Address</p>
          <p style={styles.value}>{profile.address || "Not added"}</p>
        </>
      ) : (
        <>
          <img
            src={
              profile.image ||
              `https://ui-avatars.com/api/?name=${profile.name}`
            }
            style={styles.avatar}
          />

          <input type="file" accept="image/*" onChange={handleImage} />

          <input
            name="name"
            value={profile.name}
            onChange={handleChange}
            placeholder="Full Name"
            style={styles.input}
          />

          <input
            name="phone"
            value={profile.phone}
            onChange={handleChange}
            placeholder="Phone"
            style={styles.input}
          />

          <textarea
            name="address"
            value={profile.address}
            onChange={handleChange}
            placeholder="Address"
            style={{ ...styles.input, height: "80px" }}
          />

          <button style={styles.btn} onClick={handleSave}>
            Save Profile
          </button>
        </>
      )}
    </div>
  );
};

export default Me;
