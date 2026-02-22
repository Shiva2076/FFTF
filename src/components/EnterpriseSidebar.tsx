// src/components/EnterpriseSidebar.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/app/store";
import { logout } from "@/app/slices/authSlice";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  IconButton,
  Box,
  AppBar,
  Toolbar,
  useMediaQuery,
  useTheme,
  SwipeableDrawer,
  Divider,
  Typography,
  Avatar,
  Button,
  Menu,
  MenuItem,
} from "@mui/material";
import Image from "next/image";
import { TbLayoutSidebarLeftCollapse, TbLayoutSidebarLeftExpand } from "react-icons/tb";
import { FaBars, FaTimes, FaWhatsapp, FaUser, FaSignOutAlt } from "react-icons/fa";
import Register from "./Auth/Register";
import Login from "./Auth/Signin";

interface EnterpriseSidebarProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function EnterpriseSidebar({ open, setOpen }: EnterpriseSidebarProps) {
  const currentPath = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Auth state
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState<null | HTMLElement>(null);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    setProfileMenuAnchor(null);
    setMobileDrawerOpen(false);
    router.push('/enterprise/innomarkettrend');
  };

  const menuItems = [
    {
      href: "/enterprise/innomarkettrend",
      iconSrc: "/apps/innomarkettrendsidebar.svg",
      label: "INNOMarketTrend",
      active: currentPath?.startsWith("/enterprise/innomarkettrend") || false,
    },
    {
      href: "/enterprise/activation",
      iconSrc: "/apps/farmsxossidebar.svg",
      label: "Enterprise Intelligence",
      active: currentPath?.startsWith("/enterprise/activation") || currentPath === "/enterprise" || false,
    },
  ];

  // Mobile Top Navbar
  if (isMobile) {
    return (
      <>
        {/* Fixed Top AppBar for Mobile */}
        <AppBar
          position="fixed"
          sx={{
            backgroundColor: "#008756",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            zIndex: theme.zIndex.drawer + 1,
          }}
        >
          <Toolbar sx={{ justifyContent: "space-between", minHeight: { xs: 56 } }}>
            {/* Hamburger Menu Button */}
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={() => setMobileDrawerOpen(true)}
              sx={{ mr: 1 }}
            >
              <FaBars size={22} />
            </IconButton>

            {/* Logo */}
            <Box sx={{ display: "flex", alignItems: "center", flex: 1, justifyContent: "center" }}>
              <Image src="/apps/LogoWhiteHorizontal.svg" alt="Logo" width={140} height={36} />
            </Box>

            {/* WhatsApp Button */}
            <IconButton
              color="inherit"
              onClick={() => window.open("https://wa.me/971542195288?text=Hi%20Braj%2C%20we%20met%20at%20Gulfood.%20Interested%20in%20learning%20more%20about%20INNOFarms.AI%20AI%20SaaS%20intelligence%20Platform", "_blank")}
              sx={{ ml: 1 }}
            >
              <FaWhatsapp size={22} />
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* Spacer to push content below fixed AppBar */}
        <Box sx={{ height: 56 }} />

        {/* Mobile Drawer */}
        <SwipeableDrawer
          anchor="left"
          open={mobileDrawerOpen}
          onClose={() => setMobileDrawerOpen(false)}
          onOpen={() => setMobileDrawerOpen(true)}
          sx={{
            "& .MuiDrawer-paper": {
              width: 280,
              backgroundColor: "#008756",
              pt: 2,
              display: "flex",
              flexDirection: "column",
            },
          }}
        >
          {/* Drawer Header */}
          <Box sx={{ px: 2, pb: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Image src="/apps/LogoWhiteHorizontal.svg" alt="Logo" width={150} height={40} />
            <IconButton onClick={() => setMobileDrawerOpen(false)} sx={{ color: "white" }}>
              <FaTimes size={20} />
            </IconButton>
          </Box>

          {/* User Auth Section - Right below hamburger header */}
          {userInfo ? (
            // Logged in - Show user profile
            <Box sx={{ px: 2, pb: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  p: 1.5,
                  borderRadius: 2,
                  backgroundColor: "rgba(255,255,255,0.1)",
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: "#ff5e00",
                    width: 40,
                    height: 40,
                    fontSize: "1rem",
                  }}
                >
                  {userInfo.username?.charAt(0)?.toUpperCase() || "U"}
                </Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    sx={{
                      color: "white",
                      fontWeight: 600,
                      fontSize: "0.95rem",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {userInfo.username || "User"}
                  </Typography>
                  <Typography
                    sx={{
                      color: "rgba(255,255,255,0.7)",
                      fontSize: "0.75rem",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {userInfo.email}
                  </Typography>
                </Box>
                <IconButton
                  onClick={handleLogout}
                  sx={{
                    color: "white",
                    "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
                  }}
                  title="Logout"
                >
                  <FaSignOutAlt size={18} />
                </IconButton>
              </Box>
            </Box>
          ) : (
            // Not logged in - Show Sign In and Register buttons
            <Box sx={{ px: 2, pb: 2, display: "flex", gap: 1 }}>
              <Button
                variant="contained"
                fullWidth
                onClick={() => {
                  setMobileDrawerOpen(false);
                  setShowLogin(true);
                }}
                sx={{
                  backgroundColor: "#ff5e00",
                  color: "white",
                  fontWeight: 600,
                  py: 1,
                  "&:hover": { backgroundColor: "#e65300" },
                }}
              >
                Sign In
              </Button>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => {
                  setMobileDrawerOpen(false);
                  setShowRegister(true);
                }}
                sx={{
                  borderColor: "white",
                  color: "white",
                  fontWeight: 600,
                  py: 1,
                  "&:hover": {
                    borderColor: "white",
                    backgroundColor: "rgba(255,255,255,0.1)",
                  },
                }}
              >
                Register
              </Button>
            </Box>
          )}

          <Divider sx={{ borderColor: "rgba(255,255,255,0.2)", mb: 2 }} />

          {/* Menu Items */}
          <List sx={{ px: 1, flex: 1 }}>
            {menuItems.map((item) => (
              <ListItem key={item.href} disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  component={Link}
                  href={item.href}
                  onClick={() => setMobileDrawerOpen(false)}
                  sx={{
                    borderRadius: 2,
                    py: 1.5,
                    backgroundColor: item.active ? "rgba(255,255,255,0.15)" : "transparent",
                    "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <Image src={item.iconSrc} alt="Icon" width={24} height={24} />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    sx={{
                      "& .MuiTypography-root": {
                        color: "white",
                        fontWeight: item.active ? 600 : 400,
                        fontSize: "0.95rem",
                      },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          {/* WhatsApp Help at Bottom */}
          <Box sx={{ mt: "auto", p: 2 }}>
            <Divider sx={{ borderColor: "rgba(255,255,255,0.2)", mb: 2 }} />
            <ListItemButton
              onClick={() => {
                window.open("https://wa.me/971542195288?text=Hi%20Braj%2C%20we%20met%20at%20Gulfood.%20Interested%20in%20learning%20more%20about%20INNOFarms.AI%20AI%20SaaS%20intelligence%20Platform", "_blank");
                setMobileDrawerOpen(false);
              }}
              sx={{
                borderRadius: 2,
                py: 1.5,
                backgroundColor: "rgba(255,255,255,0.1)",
                "&:hover": { backgroundColor: "rgba(255,255,255,0.15)" },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <FaWhatsapp size={24} color="white" />
              </ListItemIcon>
              <ListItemText
                primary="Connect on WhatsApp"
                sx={{
                  "& .MuiTypography-root": { color: "white", fontWeight: 500 },
                }}
              />
            </ListItemButton>
          </Box>
        </SwipeableDrawer>

        {/* Auth Modals */}
        <Register
          open={showRegister}
          onClose={() => setShowRegister(false)}
          onSwitch={() => {
            setShowRegister(false);
            setShowLogin(true);
          }}
        />
        {showLogin && (
          <Box
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              zIndex: theme.zIndex.modal,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              p: 2,
            }}
            onClick={() => setShowLogin(false)}
          >
            <Box
              onClick={(e) => e.stopPropagation()}
              sx={{
                position: "relative",
                width: "100%",
                maxWidth: 400,
                maxHeight: "90vh",
                overflow: "auto",
                borderRadius: 2,
              }}
            >
              <IconButton
                onClick={() => setShowLogin(false)}
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  zIndex: 1,
                  color: "grey.500",
                }}
              >
                <FaTimes />
              </IconButton>
              <Login
                onClose={() => setShowLogin(false)}
                onSwitch={() => {
                  setShowLogin(false);
                  setShowRegister(true);
                }}
              />
            </Box>
          </Box>
        )}
      </>
    );
  }

  // Desktop Sidebar (Original)
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? 20 : 20,
        flexShrink: 0,
        transition: "all 0.3s ease",
        "& .MuiDrawer-paper": {
          width: open ? 240 : 80,
          backgroundColor: "#008756",
          borderRight: "1px solid #d1d9e2",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "0.3rem 1rem 1.5rem",
          overflowX: "hidden",
          transition: "all 0.3s ease",
        },
        "& + .MuiContainer-root": {
          marginLeft: open ? "30px" : "8.5px",
          transition: "margin-left 0.3s ease",
        },
      }}
    >
      <List
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        {/* Logo and Toggle Button */}
        <ListItem
          sx={{
            display: "flex",
            flexDirection: open ? "row" : "column",
            alignItems: "center",
            justifyContent: open ? "space-between" : "center",
            width: "100%",
            padding: "0.5rem 0",
            mb: 1,
            gap: open ? 1 : 0,
            transition: "all 0.3s ease",
          }}
        >
          {/* Logo */}
          <Box
            sx={{
              display: "flex",
              justifyContent: open ? "flex-start" : "center",
              alignItems: "center",
              order: open ? 1 : 2,
            }}
          >
            <Collapse in={open} timeout={300} orientation="horizontal">
              <Image src="/apps/LogoWhiteHorizontal.svg" alt="Logo" width={170} height={45} />
            </Collapse>
            {!open && (
              <Image src="/apps/LogomarkWhite.svg" alt="Logo" width={60} height={60} />
            )}
          </Box>

          {/* Toggle Button */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              order: open ? 2 : 1,
            }}
          >
            <IconButton
              onClick={() => setOpen(!open)}
              sx={{
                color: "white",
                "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
              }}
              aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
            >
              {open ? (
                <TbLayoutSidebarLeftCollapse size={24} />
              ) : (
                <TbLayoutSidebarLeftExpand size={24} />
              )}
            </IconButton>
          </Box>
        </ListItem>

        {/* Menu Items */}
        {menuItems.map((item) => (
          <SidebarItem
            key={item.href}
            href={item.href}
            iconSrc={item.iconSrc}
            label={item.label}
            active={item.active}
            open={open}
          />
        ))}

        {/* Help Link at Bottom */}
        <ListItem disablePadding sx={{ width: "100%", mt: "auto" }}>
          <ListItemButton
            onClick={() => window.open("https://wa.me/+919220346184", "_blank")}
            sx={{
              borderRadius: "5px",
              height: "3rem",
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: open ? "flex-start" : "center",
              px: open ? 2 : 0,
              color: "white",
              transition: "all 0.3s ease",
              "&:hover": { backgroundColor: "#00532c" },
            }}
          >
            <ListItemIcon sx={{ minWidth: "unset", color: "white", cursor: "pointer" }}>
              <Image src="/apps/help.svg" alt="Help" width={24} height={24} />
            </ListItemIcon>
            {open && <ListItemText primary="Help" sx={{ color: "white", ml: 1 }} />}
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
}

// SidebarItem component for reuse (desktop only)
const SidebarItem = ({
  href,
  iconSrc,
  label,
  active,
  open,
}: {
  href: string;
  iconSrc: string;
  label: string;
  active: boolean;
  open: boolean;
}) => (
  <ListItem disablePadding>
    <ListItemButton
      component={Link}
      href={href}
      onClick={(e) => {
        e.stopPropagation();
      }}
      sx={{
        width: "100%",
        borderRadius: "5px",
        height: "3rem",
        display: "flex",
        alignItems: "center",
        justifyContent: open ? "flex-start" : "center",
        px: open ? 2 : 0,
        backgroundColor: active ? "#00673f" : "transparent",
        color: "white",
        transition: "all 0.3s ease",
        "&:hover": { backgroundColor: "#00532c" },
      }}
    >
      <ListItemIcon sx={{ minWidth: "unset", color: "white" }}>
        <Image src={iconSrc} alt="Icon" width={24} height={24} />
      </ListItemIcon>
      {open && (
        <ListItemText
          primary={label}
          sx={{
            color: "white",
            ml: 1,
            opacity: open ? 1 : 0,
            transition: "opacity 0.3s ease",
          }}
        />
      )}
    </ListItemButton>
  </ListItem>
);
