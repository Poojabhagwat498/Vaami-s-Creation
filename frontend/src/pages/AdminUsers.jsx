import { useEffect, useState } from "react";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load users", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const filtered = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const getInitials = (name = "") =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const avatarColors = [
    "#2c1a0e", "#3b1f2b", "#1a1a2e", "#1e3a2f",
    "#2e2416", "#1c2340", "#2a1a35", "#1e2a1a",
  ];

  const getColor = (name = "") => {
    const idx = name.charCodeAt(0) % avatarColors.length;
    return avatarColors[idx];
  };

  return (
    <>
      <style>{css}</style>

      {/* ── HERO BANNER — matches "My Bag" exactly ── */}
      <div className="au-hero">
        <p className="au-hero-eyebrow">Vaami's Creations</p>
        <h1 className="au-hero-title">Admin Panel</h1>
        <div className="au-hero-divider">
          <span className="au-hero-line" />
          <span className="au-hero-dot" />
          <span className="au-hero-line" />
        </div>
      </div>

      {/* ── PAGE BODY ── */}
      <div className="au-page">

        {/* ── TOP BAR ── */}
        <div className="au-topbar">
          <div className="au-topbar-left">
            <h2 className="au-section-title">Registered Users</h2>
            <span className="au-count-tag">{users.length} total</span>
          </div>

          {/* Search */}
          <div className="au-search-wrap">
            <svg className="au-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              className="au-search"
              type="text"
              placeholder="Search users…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button className="au-search-clear" onClick={() => setSearch("")}>✕</button>
            )}
          </div>
        </div>

        {/* ── TABLE CARD ── */}
        <div className="au-card">

          {/* Table head */}
          <div className="au-table-head">
            <span className="au-th">User</span>
            <span className="au-th">Email</span>
            <span className="au-th">Role</span>
            <span className="au-th">Joined</span>
          </div>

          {/* Loading skeleton */}
          {loading ? (
            <div className="au-skeleton-list">
              {[...Array(6)].map((_, i) => (
                <div className="au-skeleton-row" key={i}>
                  <div className="au-sk-cell">
                    <div className="au-sk au-sk-avatar" />
                    <div className="au-sk-texts">
                      <div className="au-sk au-sk-name" />
                      <div className="au-sk au-sk-sub" />
                    </div>
                  </div>
                  <div className="au-sk au-sk-email" />
                  <div className="au-sk au-sk-badge" />
                  <div className="au-sk au-sk-date" />
                </div>
              ))}
            </div>

          /* Empty state */
          ) : filtered.length === 0 ? (
            <div className="au-empty">
              <div className="au-empty-icon-wrap">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <p className="au-empty-title">No Users Found</p>
              <p className="au-empty-sub">
                {search ? "Try adjusting your search query" : "No registered users yet"}
              </p>
            </div>

          /* Rows */
          ) : (
            <div className="au-rows">
              {filtered.map((user, i) => (
                <div
                  className="au-row"
                  key={user._id}
                  style={{ animationDelay: `${i * 0.04}s` }}
                >
                  {/* Avatar + Name */}
                  <div className="au-user-cell">
                    {user.avatar ? (
                      <img
                        src={`http://localhost:5000${user.avatar}`}
                        alt={user.name}
                        className="au-avatar-img"
                      />
                    ) : (
                      <div
                        className="au-avatar-initials"
                        style={{ background: getColor(user.name) }}
                      >
                        {getInitials(user.name)}
                      </div>
                    )}
                    <div className="au-user-info">
                      <span className="au-user-name">{user.name}</span>
                      <span className="au-user-id">#{user._id?.slice(-6)}</span>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="au-td">
                    <span className="au-email">{user.email}</span>
                  </div>

                  {/* Role */}
                  <div className="au-td">
                    <span className={`au-role-badge ${user.role?.toLowerCase() === "admin" ? "au-role-admin" : "au-role-user"}`}>
                      {user.role?.toLowerCase() === "admin" ? "Admin" : "Customer"}
                    </span>
                  </div>

                  {/* Joined */}
                  <div className="au-td">
                    <span className="au-joined">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric", month: "short", year: "numeric",
                          })
                        : "—"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Footer */}
          {!loading && filtered.length > 0 && (
            <div className="au-footer">
              Showing <strong>{filtered.length}</strong> of <strong>{users.length}</strong> users
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminUsers;

/* ─── STYLES ─────────────────────────────────────────────── */

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&family=Jost:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  /* ── HERO — exact match to screenshot ── */
  .au-hero {
    background: #0f0c29;
    background-image:
      radial-gradient(ellipse at 30% 50%, rgba(255,255,255,0.025) 0%, transparent 60%),
      radial-gradient(ellipse at 70% 50%, rgba(255,255,255,0.015) 0%, transparent 60%);
    padding: 64px 24px 56px;
    text-align: center;
    font-family: 'Cormorant Garamond', serif;
  }

  .au-hero-eyebrow {
    font-size: 11px;
    letter-spacing: 4px;
    text-transform: uppercase;
    color: rgba(255,255,255,0.35);
    font-family: 'Jost', sans-serif;
    font-weight: 400;
    margin-bottom: 14px;
  }

  .au-hero-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(44px, 7vw, 72px);
    font-weight: 400;
    font-style: italic;
    color: #fff;
    letter-spacing: -0.5px;
    line-height: 1;
    margin-bottom: 20px;
  }

  .au-hero-divider {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }

  .au-hero-line {
    width: 60px;
    height: 1px;
    background: rgba(255,255,255,0.2);
  }

  .au-hero-dot {
    width: 5px; height: 5px;
    background: rgba(255,255,255,0.4);
    border-radius: 50%;
  }

  /* ── PAGE BODY — cream background ── */
  .au-page {
    background: #f5f2ec;
    min-height: calc(100vh - 320px);
    padding: 44px 40px 80px;
    font-family: 'Jost', sans-serif;
  }

  /* ── TOP BAR ── */
  .au-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
    flex-wrap: wrap;
    gap: 14px;
    animation: auFade 0.5s ease both;
  }

  @keyframes auFade {
    from { opacity: 0; transform: translateY(-10px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .au-topbar-left {
    display: flex;
    align-items: baseline;
    gap: 14px;
  }

  .au-section-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px;
    font-weight: 600;
    color: #2c1a0e;
    letter-spacing: 0.3px;
  }

  .au-count-tag {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: #a89070;
  }

  /* Search */
  .au-search-wrap {
    position: relative;
    width: 280px;
  }

  .au-search-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: #b0a090;
    pointer-events: none;
  }

  .au-search {
    width: 100%;
    padding: 11px 36px 11px 38px;
    background: #fff;
    border: 1px solid #e8e2d9;
    border-radius: 3px;
    font-family: 'Jost', sans-serif;
    font-size: 13px;
    color: #2c1a0e;
    outline: none;
    transition: border-color 0.2s;
  }

  .au-search::placeholder { color: #c8bfb0; }
  .au-search:focus { border-color: #a89070; }

  .au-search-clear {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: #b0a090;
    cursor: pointer;
    font-size: 12px;
    line-height: 1;
    padding: 2px;
    transition: color 0.2s;
  }
  .au-search-clear:hover { color: #2c1a0e; }

  /* ── TABLE CARD — white card like screenshot ── */
  .au-card {
    background: #fff;
    border: 1px solid #e8e2d9;
    border-radius: 4px;
    overflow: hidden;
    animation: auFadeUp 0.55s ease both;
    animation-delay: 0.08s;
  }

  @keyframes auFadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* Table head */
  .au-table-head {
    display: grid;
    grid-template-columns: 2.2fr 2fr 1fr 1.1fr;
    padding: 12px 28px;
    background: #faf7f2;
    border-bottom: 1px solid #e8e2d9;
  }

  .au-th {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #a89070;
  }

  /* Rows */
  .au-rows { display: flex; flex-direction: column; }

  .au-row {
    display: grid;
    grid-template-columns: 2.2fr 2fr 1fr 1.1fr;
    padding: 16px 28px;
    align-items: center;
    border-bottom: 1px solid #f0ece4;
    transition: background 0.15s ease;
    opacity: 0;
    animation: auRowIn 0.4s ease forwards;
  }

  @keyframes auRowIn {
    from { opacity: 0; transform: translateX(-6px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  .au-row:last-child { border-bottom: none; }
  .au-row:hover { background: #faf7f2; }

  /* Avatar */
  .au-user-cell {
    display: flex;
    align-items: center;
    gap: 13px;
  }

  .au-avatar-img {
    width: 38px; height: 38px;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
    border: 1px solid #e8e2d9;
  }

  .au-avatar-initials {
    width: 38px; height: 38px;
    border-radius: 50%;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.3px;
  }

  .au-user-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .au-user-name {
    font-size: 14px;
    font-weight: 500;
    color: #2c1a0e;
    letter-spacing: 0.1px;
  }

  .au-user-id {
    font-size: 11px;
    color: #c8bfb0;
    font-weight: 400;
  }

  /* Cells */
  .au-td { display: flex; align-items: center; }

  .au-email {
    font-size: 13px;
    color: #7a6a55;
    font-weight: 400;
  }

  /* Role badges */
  .au-role-badge {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 2px;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 1.5px;
    text-transform: uppercase;
  }

  .au-role-admin {
    background: #2c1a0e;
    color: #fff;
  }

  .au-role-user {
    background: #f0ece4;
    color: #7a6a55;
    border: 1px solid #e0d8cc;
  }

  .au-joined {
    font-size: 12.5px;
    color: #b0a090;
    font-weight: 400;
  }

  /* ── SKELETON ── */
  .au-skeleton-list { display: flex; flex-direction: column; }

  .au-skeleton-row {
    display: grid;
    grid-template-columns: 2.2fr 2fr 1fr 1.1fr;
    padding: 18px 28px;
    align-items: center;
    border-bottom: 1px solid #f0ece4;
    gap: 0;
  }

  .au-sk-cell {
    display: flex;
    align-items: center;
    gap: 13px;
  }

  .au-sk-texts {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .au-sk {
    background: linear-gradient(90deg, #f0ece4 25%, #e8e2d8 50%, #f0ece4 75%);
    background-size: 200% 100%;
    animation: auShimmer 1.4s infinite;
    border-radius: 3px;
  }

  @keyframes auShimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  .au-sk-avatar { width: 38px; height: 38px; border-radius: 50%; flex-shrink: 0; }
  .au-sk-name   { height: 13px; width: 110px; }
  .au-sk-sub    { height: 11px; width: 70px; }
  .au-sk-email  { height: 12px; width: 150px; }
  .au-sk-badge  { height: 22px; width: 64px; }
  .au-sk-date   { height: 12px; width: 80px; }

  /* ── EMPTY ── */
  .au-empty {
    padding: 80px 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    text-align: center;
  }

  .au-empty-icon-wrap {
    width: 52px; height: 52px;
    border: 1px solid #e8e2d9;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #c8bfb0;
    margin-bottom: 4px;
  }

  .au-empty-title {
    font-family: 'Jost', sans-serif;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #7a6a55;
  }

  .au-empty-sub {
    font-family: 'Cormorant Garamond', serif;
    font-style: italic;
    font-size: 15px;
    color: #b0a090;
  }

  /* ── FOOTER ── */
  .au-footer {
    padding: 12px 28px;
    font-size: 12px;
    color: #b0a090;
    font-weight: 400;
    border-top: 1px solid #f0ece4;
    background: #faf7f2;
    letter-spacing: 0.3px;
  }

  .au-footer strong { color: #7a6a55; font-weight: 600; }

  /* ── RESPONSIVE ── */
  @media (max-width: 768px) {
    .au-page { padding: 32px 16px 60px; }
    .au-hero { padding: 48px 16px 40px; }
    .au-topbar { flex-direction: column; align-items: flex-start; }
    .au-search-wrap { width: 100%; }
    .au-table-head { display: none; }
    .au-row {
      grid-template-columns: 1fr;
      gap: 10px;
      padding: 18px 20px;
      border: 1px solid #e8e2d9;
      border-radius: 4px;
      margin: 6px 0;
    }
    .au-rows { gap: 0; }
    .au-skeleton-row { grid-template-columns: auto 1fr; }
  }
`;
