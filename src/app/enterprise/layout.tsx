// src/app/enterprise/layout.tsx
"use client";

import React, { useState } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import EnterpriseSidebar from "@/components/EnterpriseSidebar";
import Header from "@/components/Header";

export default function EnterpriseLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const sidebarWidth = sidebarOpen ? 240 : 80;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        width: "100%",
        maxWidth: "100vw",
        overflowX: "hidden",
        boxSizing: "border-box",
      }}
    >
      <EnterpriseSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      <Box
        component="main"
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          width: { xs: "100%", md: `calc(100% - ${sidebarWidth}px)` },
          marginLeft: { xs: 0, md: `${sidebarWidth}px` },
          pl: { xs: 0, md: 2 },
          transition: "margin-left 0.3s ease, width 0.3s ease",
          overflowX: "hidden",
          boxSizing: "border-box",
        }}
      >
        {!isMobile && <Header />}

        <Box
          sx={{
            flex: 1,
            width: "100%",
            minWidth: 0,
            overflowX: "hidden",
            boxSizing: "border-box",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}