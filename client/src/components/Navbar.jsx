import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";
import {
  ShoppingCart, Menu, X, User, Package,
  Heart, LogOut, LayoutDashboard,
  Home, Store, Grid, Compass, Info,
} from "lucide-react";

/* ─────────────────────────────────────────
   STYLES
───────────────────────────────────────── */
const NavStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap');

    .nb { font-family: 'DM Sans', sans-serif; -webkit-font-smoothing: antialiased; }

    /* ── Navbar bar ── */
    .nb-bar {
      background: rgba(12, 32, 12, 0.88);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border-bottom: 1px solid rgba(255,255,255,0.06);
      transition: background 0.35s ease, box-shadow 0.35s ease;
    }
    .nb-bar.scrolled {
      background: rgba(10, 26, 10, 0.97);
      box-shadow: 0 8px 40px rgba(0,0,0,0.40);
      border-bottom-color: rgba(255,255,255,0.08);
    }

    /* ── Logo wordmark ── */
    .nb-logo-wrap {
      display: flex;
      flex-direction: column;
      line-height: 1;
      text-decoration: none;
    }
    .nb-logo-top {
      font-family: 'Playfair Display', serif;
      font-weight: 900;
      font-size: clamp(17px, 4.5vw, 22px);
      letter-spacing: 0.06em;
      color: #ffffff;
      text-transform: uppercase;
    }
    .nb-logo-top em {
      font-style: italic;
      color: #fbbf24;
    }
    .nb-logo-sub {
      font-family: 'DM Sans', sans-serif;
      font-size: clamp(7.5px, 2vw, 9px);
      font-weight: 500;
      letter-spacing: 0.20em;
      color: rgba(251,191,36,0.65);
      text-transform: uppercase;
      margin-top: 3px;
    }

    /* Gold dot separator in logo */
    .nb-logo-dot {
      display: inline-block;
      width: 5px; height: 5px;
      border-radius: 50%;
      background: #fbbf24;
      margin: 0 7px;
      vertical-align: middle;
      position: relative;
      top: -1px;
      box-shadow: 0 0 6px rgba(251,191,36,0.60);
    }

    /* ── Desktop nav links ── */
    .nb-link {
      position: relative;
      color: rgba(255,255,255,0.72);
      font-size: 14.5px;
      font-weight: 500;
      letter-spacing: 0.02em;
      padding: 5px 0;
      text-decoration: none;
      transition: color 0.22s ease;
      white-space: nowrap;
    }
    .nb-link::after {
      content: '';
      position: absolute;
      bottom: 0; left: 0;
      width: 0; height: 1.5px;
      background: linear-gradient(90deg, #f59e0b, #fbbf24);
      border-radius: 2px;
      transition: width 0.28s cubic-bezier(0.34,1.56,0.64,1);
    }
    .nb-link:hover        { color: #fde68a; }
    .nb-link:hover::after { width: 100%; }
    .nb-link.active       { color: #fbbf24; }
    .nb-link.active::after{ width: 100%; }

    /* ── Cart icon button ── */
    .nb-cart-btn {
      position: relative;
      width: 38px; height: 38px;
      border-radius: 12px;
      background: rgba(255,255,255,0.07);
      border: 1px solid rgba(255,255,255,0.11);
      display: flex; align-items: center; justify-content: center;
      color: rgba(255,255,255,0.80);
      cursor: pointer;
      transition: all 0.22s ease;
      text-decoration: none;
    }
    .nb-cart-btn:hover {
      background: rgba(251,191,36,0.14);
      border-color: rgba(251,191,36,0.35);
      color: #fbbf24;
    }
    .nb-cart-badge {
      position: absolute;
      top: -5px; right: -5px;
      background: #f59e0b;
      color: #000;
      font-size: 8.5px;
      font-weight: 800;
      min-width: 17px; height: 17px;
      border-radius: 9px;
      display: flex; align-items: center; justify-content: center;
      padding: 0 3px;
      border: 1.5px solid rgba(10,26,10,0.95);
    }

    /* ── Login button ── */
    .nb-login-btn {
      background: linear-gradient(135deg, #d97706 0%, #f59e0b 50%, #fbbf24 100%);
      color: #1a0a00;
      font-weight: 700;
      font-size: 13.5px;
      padding: 9px 20px;
      border-radius: 10px;
      border: none;
      cursor: pointer;
      letter-spacing: 0.02em;
      box-shadow: 0 4px 14px rgba(245,158,11,0.32);
      transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1);
      white-space: nowrap;
    }
    .nb-login-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 22px rgba(245,158,11,0.44);
    }
    .nb-login-btn:active { transform: scale(0.97); }

    /* ── Avatar ── */
    .nb-avatar {
      width: 36px; height: 36px;
      border-radius: 10px;
      background: linear-gradient(135deg, #d97706, #fbbf24);
      color: #1a0a00;
      font-family: 'Playfair Display', serif;
      font-weight: 900;
      font-size: 15px;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer;
      border: 1.5px solid rgba(251,191,36,0.40);
      box-shadow: 0 4px 12px rgba(245,158,11,0.22);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      text-transform: uppercase;
      user-select: none;
    }
    .nb-avatar:hover {
      transform: scale(1.07);
      box-shadow: 0 6px 18px rgba(245,158,11,0.32);
    }

    /* ── Dropdown ── */
    .nb-dropdown {
      position: absolute;
      top: calc(100% + 12px);
      right: 0;
      width: 230px;
      background: #ffffff;
      border-radius: 18px;
      overflow: hidden;
      box-shadow: 0 24px 64px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.08);
      border: 1px solid rgba(0,0,0,0.05);
      z-index: 100;
    }
    .nb-drop-header {
      background: linear-gradient(135deg, #0f2410, #1a3d1f);
      padding: 18px 20px;
    }
    .nb-drop-item {
      display: flex; align-items: center; gap: 11px;
      padding: 11px 20px;
      color: #374151;
      font-size: 13.5px;
      font-weight: 500;
      transition: background 0.16s ease;
      text-decoration: none;
      cursor: pointer;
      background: transparent;
      border: none;
      width: 100%;
      text-align: left;
    }
    .nb-drop-item:hover { background: #f9fafb; }
    .nb-drop-item .dicon { color: #9ca3af; flex-shrink:0; }
    .nb-drop-item.red    { color: #ef4444; }
    .nb-drop-item.red:hover { background: #fff5f5; }
    .nb-drop-item.green  { color: #16a34a; font-weight:600; }
    .nb-drop-item.green:hover { background: #f0fdf4; }
    .nb-drop-sep { height: 1px; background: #f3f4f6; margin: 3px 0; }

    /* ── Hamburger ── */
    .nb-ham {
      width: 36px; height: 36px;
      border-radius: 10px;
      background: rgba(255,255,255,0.07);
      border: 1px solid rgba(255,255,255,0.11);
      display: flex; align-items: center; justify-content: center;
      color: rgba(255,255,255,0.85);
      cursor: pointer;
      transition: background 0.2s ease;
    }
    .nb-ham:hover { background: rgba(255,255,255,0.12); }

    /* ── Mobile Drawer ── */
    .nb-drawer {
      background: linear-gradient(180deg, #0d220d 0%, #122612 100%);
      border-top: 1px solid rgba(255,255,255,0.06);
      overflow: hidden;
    }

    .nb-mob-link {
      display: flex;
      align-items: center;
      gap: 13px;
      padding: 12px 14px;
      border-radius: 12px;
      color: rgba(255,255,255,0.78);
      font-size: 14.5px;
      font-weight: 500;
      text-decoration: none;
      transition: all 0.2s ease;
      background: transparent;
      border: none;
      width: 100%;
      cursor: pointer;
      text-align: left;
    }
    .nb-mob-link:hover, .nb-mob-link.active {
      background: rgba(251,191,36,0.09);
      color: #fde68a;
    }
    .nb-mob-icon {
      width: 34px; height: 34px;
      border-radius: 9px;
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.08);
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
      color: rgba(255,255,255,0.55);
    }
    .nb-mob-link:hover .nb-mob-icon,
    .nb-mob-link.active .nb-mob-icon {
      background: rgba(251,191,36,0.12);
      border-color: rgba(251,191,36,0.22);
      color: #fbbf24;
    }

    /* Account section inside drawer */
    .nb-mob-account {
      background: rgba(251,191,36,0.06);
      border: 1px solid rgba(251,191,36,0.14);
      border-radius: 14px;
      padding: 4px;
      margin-bottom: 10px;
    }
    .nb-mob-acct-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 12px 10px;
      border-bottom: 1px solid rgba(255,255,255,0.06);
      margin-bottom: 4px;
    }
    .nb-mob-acct-avatar {
      width: 38px; height: 38px;
      border-radius: 10px;
      background: linear-gradient(135deg, #d97706, #fbbf24);
      color: #1a0a00;
      font-family: 'Playfair Display', serif;
      font-weight: 900;
      font-size: 16px;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }

    /* Divider in drawer */
    .nb-mob-divider {
      height: 1px;
      background: rgba(255,255,255,0.07);
      margin: 8px 0;
    }

    /* Bottom tagline */
    .nb-tagline {
      text-align: center;
      color: rgba(255,255,255,0.22);
      font-size: 10px;
      letter-spacing: 0.16em;
      padding-bottom: 4px;
    }

    /* Mobile login */
    .nb-mob-login {
      width: 100%;
      background: linear-gradient(135deg, #d97706, #fbbf24);
      color: #1a0a00;
      font-weight: 700;
      font-size: 14.5px;
      padding: 13px;
      border-radius: 12px;
      border: none;
      cursor: pointer;
      letter-spacing: 0.02em;
      box-shadow: 0 4px 16px rgba(245,158,11,0.28);
      transition: opacity 0.2s;
    }
    .nb-mob-login:hover { opacity: 0.92; }
  `}</style>
);

/* ─── Config ─── */
const NAV_LINKS = [
  { to: "/",           label: "Home",       icon: Home      },
  { to: "/shop",       label: "Shop",       icon: Store     },
  { to: "/categories", label: "Categories", icon: Grid      },
  { to: "/explore",    label: "Explore",    icon: Compass   },
  { to: "/about",      label: "About",      icon: Info      },
];

/* ════════════════════════════════════════
   NAVBAR
════════════════════════════════════════ */
const Navbar = () => {
  const [menuOpen, setMenuOpen]   = useState(false);
  const [dropOpen, setDropOpen]   = useState(false);
  const [scrolled, setScrolled]   = useState(false);
  const dropRef                   = useRef(null);
  const location                  = useLocation();
  const { cartItems }             = useCart();

  const totalQty = cartItems.reduce((a, i) => a + i.qty, 0);
  const token    = localStorage.getItem("gavathi_token");

  let userInitial = "U";
  let userRole    = "";
  let userName    = "User";

  if (token) {
    try {
      const p = JSON.parse(atob(token.split(".")[1]));
      if (p?.name)  { userName = p.name; userInitial = p.name.charAt(0).toUpperCase(); }
      if (p?.role)    userRole = p.role;
    } catch {}
  }

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 18);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const fn = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  useEffect(() => { setMenuOpen(false); setDropOpen(false); }, [location]);

  const handleLogout = () => { localStorage.removeItem("gavathi_token"); window.location.reload(); };
  const isActive = (p) => p === "/" ? location.pathname === "/" : location.pathname.startsWith(p);

  return (
    <>
      <NavStyles />
      <nav className={`nb fixed top-0 left-0 w-full z-50 nb-bar ${scrolled ? "scrolled" : ""}`}>

        {/* ── Main bar ── */}
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-10"
          style={{ height: "clamp(58px, 9vw, 68px)" }}>

          {/* ── LOGO ── */}
          <Link to="/" className="nb-logo-wrap flex-shrink-0">
            <div className="nb-logo-top">
              Gavathi<em>Point</em>
            </div>
            <div className="nb-logo-sub">
              आपल्या माणसाचा <span className="nb-logo-dot" style={{display:"inline-block"}}/> आपला ब्रँड
            </div>
          </Link>

          {/* ── DESKTOP LINKS ── */}
          <div className="hidden md:flex items-center" style={{ gap: "clamp(18px, 3vw, 32px)" }}>
            {NAV_LINKS.map(({ to, label }) => (
              <Link key={to} to={to} className={`nb-link ${isActive(to) ? "active" : ""}`}>
                {label}
              </Link>
            ))}
          </div>

          {/* ── RIGHT SIDE ── */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Cart */}
            <Link to="/cart" className="nb-cart-btn">
              <ShoppingCart size={17} strokeWidth={2.2} />
              <AnimatePresence>
                {totalQty > 0 && (
                  <motion.span
                    key="badge"
                    className="nb-cart-badge"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  >
                    {totalQty > 9 ? "9+" : totalQty}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            {/* Desktop — logged in */}
            {token ? (
              <div className="relative hidden md:block" ref={dropRef}>
                <motion.button
                  className="nb-avatar"
                  onClick={() => setDropOpen(!dropOpen)}
                  whileTap={{ scale: 0.93 }}
                >
                  {userInitial}
                </motion.button>

                <AnimatePresence>
                  {dropOpen && (
                    <motion.div
                      className="nb-dropdown"
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                    >
                      <div className="nb-drop-header">
                        <p style={{ color: "rgba(187,247,208,0.75)", fontSize: 11, marginBottom: 3 }}>
                          Welcome back
                        </p>
                        <p style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>{userName}</p>
                      </div>
                      <div style={{ padding: "6px 0" }}>
                        <Link to="/profile" className="nb-drop-item">
                          <User size={14} className="dicon"/> My Profile
                        </Link>
                        <Link to="/orders" className="nb-drop-item">
                          <Package size={14} className="dicon"/> My Orders
                        </Link>
                        <Link to="/wishlist" className="nb-drop-item">
                          <Heart size={14} className="dicon"/> Wishlist
                        </Link>
                        {userRole === "seller" && (
                          <>
                            <div className="nb-drop-sep"/>
                            <Link to="/seller/dashboard" className="nb-drop-item green">
                              <LayoutDashboard size={14}/> Seller Dashboard
                            </Link>
                          </>
                        )}
                        <div className="nb-drop-sep"/>
                        <button className="nb-drop-item red" onClick={handleLogout}>
                          <LogOut size={14}/> Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/login" className="hidden md:block">
                <motion.button
                  className="nb-login-btn"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                >
                  Login
                </motion.button>
              </Link>
            )}

            {/* Hamburger */}
            <motion.button
              className="nb-ham md:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
              whileTap={{ scale: 0.88 }}
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                {menuOpen
                  ? <motion.span key="x"   initial={{rotate:-80,opacity:0}} animate={{rotate:0,opacity:1}} exit={{rotate:80,opacity:0}}  transition={{duration:0.16}}><X size={17}/></motion.span>
                  : <motion.span key="men" initial={{rotate:80,opacity:0}}  animate={{rotate:0,opacity:1}} exit={{rotate:-80,opacity:0}} transition={{duration:0.16}}><Menu size={17}/></motion.span>
                }
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* ══ MOBILE DRAWER ══ */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              className="nb-drawer md:hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.30, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div style={{ padding: "12px 14px 16px" }}>

                {/* Account block (logged in) */}
                {token && (
                  <div className="nb-mob-account">
                    <div className="nb-mob-acct-header">
                      <div className="nb-mob-acct-avatar">{userInitial}</div>
                      <div>
                        <p style={{ color: "#fde68a", fontWeight: 700, fontSize: 14 }}>{userName}</p>
                        <p style={{ color: "rgba(255,255,255,0.40)", fontSize: 11, marginTop: 1 }}>
                          {userRole === "seller" ? "Seller Account" : "Customer"}
                        </p>
                      </div>
                    </div>
                    <Link to="/profile" className="nb-mob-link" onClick={() => setMenuOpen(false)}>
                      <span className="nb-mob-icon"><User size={14}/></span> My Profile
                    </Link>
                    <Link to="/orders" className="nb-mob-link" onClick={() => setMenuOpen(false)}>
                      <span className="nb-mob-icon"><Package size={14}/></span> My Orders
                    </Link>
                    <Link to="/wishlist" className="nb-mob-link" onClick={() => setMenuOpen(false)}>
                      <span className="nb-mob-icon"><Heart size={14}/></span> Wishlist
                    </Link>
                    {userRole === "seller" && (
                      <Link to="/seller/dashboard" className="nb-mob-link" onClick={() => setMenuOpen(false)}
                        style={{ color: "#4ade80" }}>
                        <span className="nb-mob-icon"><LayoutDashboard size={14}/></span> Seller Dashboard
                      </Link>
                    )}
                    <button className="nb-mob-link" onClick={handleLogout} style={{ color: "#f87171" }}>
                      <span className="nb-mob-icon"><LogOut size={14}/></span> Logout
                    </button>
                  </div>
                )}

                {/* Navigation links */}
                <div style={{ marginBottom: 10 }}>
                  {NAV_LINKS.map(({ to, label, icon: Icon }, i) => (
                    <motion.div
                      key={to}
                      initial={{ opacity: 0, x: -14 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.045, duration: 0.20 }}
                    >
                      <Link
                        to={to}
                        className={`nb-mob-link ${isActive(to) ? "active" : ""}`}
                        onClick={() => setMenuOpen(false)}
                      >
                        <span className="nb-mob-icon"><Icon size={15}/></span>
                        {label}
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Login if not logged in */}
                {!token && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.22 }}
                    style={{ marginBottom: 12 }}
                  >
                    <Link to="/login" onClick={() => setMenuOpen(false)}>
                      <button className="nb-mob-login">Login / Sign Up</button>
                    </Link>
                  </motion.div>
                )}

                <div className="nb-mob-divider"/>
                <p className="nb-tagline">
                  आपल्या माणसाचा · आपला गावठी ब्रँड
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};

export default Navbar;