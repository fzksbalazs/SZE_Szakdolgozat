import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import "../css/Navbar.css";
import { Logout } from "../redux/apiCalls";
import { Badge } from "@material-ui/core";
import { ShoppingCartOutlined } from "@material-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import logos from "../img/logo.png";

const Navbar = ({
  sharedBackground = false,
  logo = logos,
  logoAlt = "Logo",
  className = "",
  ease = "power3.easeOut",
  baseColor = "#fff",
  pillColor = "#060010",
  hoveredPillTextColor = "#060010",
  activeHref,
  pillTextColor,
  onMobileMenuClick,
  initialLoadAnimation = true,
}) => {
  const resolvedPillTextColor = pillTextColor ?? baseColor;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const circleRefs = useRef([]);
  const tlRefs = useRef([]);
  const activeTweenRefs = useRef([]);
  const logoImgRef = useRef(null);
  const logoTweenRef = useRef(null);
  const hamburgerRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const navItemsRef = useRef(null);
  const logoRef = useRef(null);

  const quantity = useSelector((state) => state.cart.quantity);
  const user = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.clear();
    Logout(dispatch);
    window.location.href = "/";
  };

  useEffect(() => {
    const layout = () => {
      circleRefs.current.forEach((circle) => {
        if (!circle?.parentElement) return;
        const pill = circle.parentElement;
        const rect = pill.getBoundingClientRect();
        const { width: w, height: h } = rect;
        const R = ((w * w) / 4 + h * h) / (2 * h);
        const D = Math.ceil(2 * R) + 2;
        const delta =
          Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
        const originY = D - delta;

        circle.style.width = `${D}px`;
        circle.style.height = `${D}px`;
        circle.style.bottom = `-${delta}px`;

        gsap.set(circle, {
          xPercent: -50,
          scale: 0,
          transformOrigin: `50% ${originY}px`,
        });

        const label = pill.querySelector(".pill-label");
        const white = pill.querySelector(".pill-label-hover");
        if (label) gsap.set(label, { y: 0 });
        if (white) gsap.set(white, { y: h + 12, opacity: 0 });

        const index = circleRefs.current.indexOf(circle);
        if (index === -1) return;

        tlRefs.current[index]?.kill();
        const tl = gsap.timeline({ paused: true });
        tl.to(
          circle,
          { scale: 1.2, xPercent: -50, duration: 2, ease, overwrite: "auto" },
          0,
        );
        if (label) {
          tl.to(
            label,
            { y: -(h + 8), duration: 2, ease, overwrite: "auto" },
            0,
          );
        }
        if (white) {
          gsap.set(white, { y: Math.ceil(h + 100), opacity: 0 });
          tl.to(
            white,
            { y: 0, opacity: 1, duration: 2, ease, overwrite: "auto" },
            0,
          );
        }
        tlRefs.current[index] = tl;
      });
    };

    layout();
    window.addEventListener("resize", layout);
    if (document.fonts?.ready) {
      document.fonts.ready.then(layout).catch(() => {});
    }

    const menu = mobileMenuRef.current;
    if (menu) {
      gsap.set(menu, { visibility: "hidden", opacity: 0, scaleY: 1 });
    }

    if (initialLoadAnimation) {
      const logo = logoRef.current;
      const navItems = navItemsRef.current;
      if (logo) {
        gsap.set(logo, { scale: 0 });
        gsap.to(logo, { scale: 1, duration: 0.6, ease });
      }
      if (navItems) {
        gsap.set(navItems, { width: 0, overflow: "hidden" });
        gsap.to(navItems, { width: "auto", duration: 0.6, ease });
      }
    }

    return () => window.removeEventListener("resize", layout);
  }, [ease, initialLoadAnimation]);

  const handleEnter = (i) => {
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(tl.duration(), {
      duration: 0.3,
      ease,
      overwrite: "auto",
    });
  };

  const handleLeave = (i) => {
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(0, {
      duration: 0.2,
      ease,
      overwrite: "auto",
    });
  };

const handleLogoEnter = () => {
  const img = logoImgRef.current;
  if (!img) return;

  logoTweenRef.current?.kill();

  gsap.set(img, { scale: 1, opacity: 0.8 });

  logoTweenRef.current = gsap.to(img, {
    scale: 1.2, // A logó megnövekedése
    opacity: 1, // Teljes láthatóság
    duration: 0.6, // Rövid animáció
    ease: "power2.out", // Lassan lelassuló mozgás
    onComplete: () => {
      gsap.to(img, {
        scale: 1,  // Vissza a normál méretbe
        opacity: 0.8, // Vissza az áttetszőséghez
        duration: 0.4, // Gyors visszaállás
        ease: "power2.in", // Simább visszaállás
      });
    },
  });
};













  const toggleMobileMenu = () => {
    const newState = !isMobileMenuOpen;
    setIsMobileMenuOpen(newState);
    const menu = mobileMenuRef.current;
    if (menu) {
      if (newState) {
        gsap.set(menu, { visibility: "visible" });
        gsap.fromTo(
          menu,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.3, ease },
        );
      } else {
        gsap.to(menu, {
          opacity: 0,
          y: 10,
          duration: 0.2,
          ease,
          onComplete: () => {
            gsap.set(menu, { visibility: "hidden" });
          },
        });
      }
    }
    onMobileMenuClick?.();
  };

  const cssVars = {
    ["--base"]: baseColor,
    ["--pill-bg"]: pillColor,
    ["--hover-text"]: hoveredPillTextColor,
    ["--pill-text"]: resolvedPillTextColor,
  };

  // Menü összeállítása user alapján
  const guestItems = [
    { label: "KEZDŐLAP", href: "/" },

    { label: "BEJELENTKEZÉS", href: "/login" },
  ];

  const userItems = [
    { label: "KEZDŐLAP", href: "/" },
   
    { label: "KOSÁR", href: "/cart", isCart: true },
    { label: "KIJELENTKEZÉS", href: "#logout", isLogout: true },
  ];

  const items = user ? userItems : guestItems;

  return (
    <div className={`nav-wrapper ${sharedBackground ? "shared-bg" : ""}`}>
      <div className="pill-nav-container">
        <nav
          className={`pill-nav ${className}`}
          aria-label="Primary"
          style={cssVars}
        >
          <Link
            to="/"
            className="pill-logo"
            aria-label="KEZDŐLAP"
            onMouseEnter={handleLogoEnter}
            ref={logoRef}
          >
            <img src={logo} alt={logoAlt} ref={logoImgRef} />
          </Link>

          <div className="pill-nav-items desktop-only" ref={navItemsRef}>
            <ul className="pill-list" role="menubar">
              {items.map((item, i) => (
                <li key={item.href || `item-${i}`} role="none">
                  {item.isLogout ? (
                    <span
                      role="menuitem"
                      className="pill"
                      onClick={handleLogout}
                      onMouseEnter={() => handleEnter(i)}
                      onMouseLeave={() => handleLeave(i)}
                    >
                      <span
                        className="hover-circle"
                        aria-hidden="true"
                        ref={(el) => {
                          circleRefs.current[i] = el;
                        }}
                      />
                      <span className="label-stack">
                        <span className="pill-label">{item.label}</span>
                        <span className="pill-label-hover">{item.label}</span>
                      </span>
                    </span>
                  ) : item.isCart ? (
                    <Link
                      to={item.href}
                      role="menuitem"
                      className="pill"
                      onMouseEnter={() => handleEnter(i)}
                      onMouseLeave={() => handleLeave(i)}
                    >
                      <span
                        className="hover-circle"
                        aria-hidden="true"
                        ref={(el) => {
                          circleRefs.current[i] = el;
                        }}
                      />
                      <span className="label-stack">
                        <span className="pill-label">
                          <Badge badgeContent={quantity} color="secondary">
                            <ShoppingCartOutlined />
                          </Badge>
                        </span>
                        <span className="pill-label-hover">
                          <Badge badgeContent={quantity} color="secondary">
                            <ShoppingCartOutlined />
                          </Badge>
                        </span>
                      </span>
                    </Link>
                  ) : (
                    <Link
                      role="menuitem"
                      to={item.href}
                      className={`pill${activeHref === item.href ? " is-active" : ""}`}
                      aria-label={item.ariaLabel || item.label}
                      onMouseEnter={() => handleEnter(i)}
                      onMouseLeave={() => handleLeave(i)}
                    >
                      <span
                        className="hover-circle"
                        aria-hidden="true"
                        ref={(el) => {
                          circleRefs.current[i] = el;
                        }}
                      />
                      <span className="label-stack">
                        <span className="pill-label">{item.label}</span>
                        <span className="pill-label-hover">{item.label}</span>
                      </span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <button
            className="mobile-menu-button mobile-only"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
            ref={hamburgerRef}
          >
            <span className="hamburger-line" />
            <span className="hamburger-line" />
          </button>
        </nav>
        <div
          className="mobile-menu-popover mobile-only"
          ref={mobileMenuRef}
          style={cssVars}
        >
          <ul className="mobile-menu-list">
            {items.map((item, i) => (
              <li key={item.href || `mobile-item-${i}`}>
                {item.isLogout ? (
                  <span className="mobile-menu-link" onClick={handleLogout}>
                    {item.label}
                  </span>
                ) : item.isCart ? (
                  <Link
                    to={item.href}
                    className="mobile-menu-link"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Badge badgeContent={quantity} color="secondary">
                      <ShoppingCartOutlined />
                    </Badge>
                  </Link>
                ) : (
                  <Link
                    to={item.href}
                    className="mobile-menu-link"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
