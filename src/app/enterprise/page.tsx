// src/app/enterprise/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, CircularProgress } from "@mui/material";

export default function EnterprisePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to activation (Intelligence Suite) by default
    router.replace("/enterprise/activation");
  }, [router]);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <CircularProgress />
    </Box>
  );
}
