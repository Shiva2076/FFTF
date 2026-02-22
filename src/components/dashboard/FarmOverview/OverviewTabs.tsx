import { Box, Typography } from "@mui/material";
import {  Chip } from "@mui/material";
const OverviewTabs = () => {
  return (
    <Box
      sx={{
        width: "100%",
        borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
        }}
      >
        {/* Active Tab: Farm Overview */}
        <Box
          sx={{
            position: "relative",
            color: "#ff5e00",
            "&:after": {
              content: '""',
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              borderTop: "2px solid #ff5e00",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              p: "0.562rem 1rem",
            }}
          >
            <Typography
              sx={{
                letterSpacing: "0.4px",
                lineHeight: "1.5rem",
                textTransform: "uppercase",
                fontWeight: 500,
              }}
            >
              Farm Overview
            </Typography>
          </Box>
        </Box>

        {/* Other Tabs */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            p: "0.562rem 1rem",
          }}
        >
          <Typography
            sx={{
              letterSpacing: "0.4px",
              lineHeight: "1.5rem",
              textTransform: "uppercase",
              fontWeight: 500,
            }}
          >
            Grow Cycle
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            p: "0.562rem 1rem",
          }}
        >
          <Typography
            sx={{
              letterSpacing: "0.4px",
              lineHeight: "1.5rem",
              textTransform: "uppercase",
              fontWeight: 500,
            }}
          >
            Active Crop Insights
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            p: "0.562rem 1rem",
          }}
        >
          <Typography
            sx={{
              letterSpacing: "0.4px",
              lineHeight: "1.5rem",
              textTransform: "uppercase",
              fontWeight: 500,
            }}
          >
            Smart Robotics
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

const PerformanceFilters = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        gap: "0.5rem",
      }}
    >
      <Chip
        label="Performance"
        sx={{
          borderRadius: "4px",
          backgroundColor: "rgba(0, 135, 86, 0.08)",
          color: "#008756",
          fontWeight: 500,
        }}
      />
      <Chip
        label="Crop Growth & Yield"
        sx={{
          borderRadius: "4px",
          backgroundColor: "rgba(0, 0, 0, 0.04)",
          fontWeight: 500,
        }}
      />
      <Chip
        label="Monitor & Control"
        sx={{
          borderRadius: "4px",
          backgroundColor: "rgba(0, 0, 0, 0.04)",
          fontWeight: 500,
        }}
      />
    </Box>
  );
};

export default{PerformanceFilters,OverviewTabs} ;
