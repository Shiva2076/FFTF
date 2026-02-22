"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
} from "@mui/material";
import Image from "next/image";
import { TbLayoutSidebarLeftCollapse, TbLayoutSidebarLeftExpand } from "react-icons/tb";

interface SidebarProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Sidebar({ open, setOpen }: SidebarProps) {
  const currentPath = usePathname();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? 20: 20,
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

        {/* Market Trend Link */}
        <SidebarItem
          href="/markettrend"
          iconSrc="/apps/innomarkettrendsidebar.svg"
          label="INNOMarketTrend"
          active={currentPath?.startsWith("/markettrend") || false}
          open={open}
        />

        {/* Dashboard Link */}
        <SidebarItem
          href="/farmsxos"
          iconSrc="/apps/farmsxossidebar.svg"
          label="INNOFarmsXOS"
          active={currentPath?.startsWith("/farmsxos") || false}
          open={open}
        />
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

// SidebarItem component for reuse
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
        // Prevent any event propagation that might affect sidebar state
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