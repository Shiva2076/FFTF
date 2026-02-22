import { Box, Typography } from "@mui/material";
import BlurWrapper from '@/components/common/BlurWrapper';

interface FarmDetailsProps {
  farmDetails: any;
  ai?: boolean;
}

const FarmDetails: React.FC<FarmDetailsProps> = ({ farmDetails, ai = true }) => {
  const details = farmDetails || {};

  const {
    farmName = "-",
    farmLocation = "-",
    farmCountry = "-",
    farmArea,
    totalRacks,
    totalShelvesPerRack,
    activeCropVarieties,
    activeCycles,
  } = details;

  const formatMetric = (value: any, suffix: string = "") =>
    value != null && value !== "" ? `${value}${suffix}` : "-";

  const rows = [
    ["Farm Area", farmArea != null ? `${farmArea.toLocaleString()} sq. ft.` : "-"],
    [
      "Total Racks",
      totalRacks != null
        ? `${totalRacks}`
        : "-",
    ],
    [
      "Shelves Per Rack",
      totalShelvesPerRack != null
        ? `${totalShelvesPerRack}`
        : "-",
    ],
    [
      "Active Crop Varieties",
      formatMetric(activeCropVarieties, " types"),
    ],
    ["Active Cycle", formatMetric(activeCycles)],
  ];

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        minHeight: "400px",
        borderRadius: "8px",
        overflow: "hidden",
        border: "1px solid #E0E0E0",
        backgroundColor: "#fff",
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          px: "1.5rem",
          py: "1.35rem",
          height: "60px",
          borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <Typography
            sx={{
              fontSize: "1rem",
              letterSpacing: "0.15px",
              lineHeight: "160%",
              fontWeight: 600,
            }}
          >
            {farmName}
          </Typography>
          <Typography
            sx={{
              fontSize: "0.75rem",
              color: "rgba(0, 18, 25, 0.6)",
              letterSpacing: "0.4px",
            }}
          >
            {farmLocation !== "-" && farmCountry !== "-"
              ? `${farmLocation}, ${farmCountry}`
              : "-"}
          </Typography>
        </Box>
      </Box>

      {/* Table Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#F4F6F8",
          height: "40px",
          px: 2,
        }}
      >
        <Typography
          sx={{ width: "50%", fontWeight: 600, fontSize: "0.875rem" }}
        >
          Metric
        </Typography>
        <Typography
          sx={{
            width: "50%",
            fontWeight: 600,
            fontSize: "0.875rem",
            textAlign: "center",
          }}
        >
          Value
        </Typography>
      </Box>

      {/* Data Rows */}
      <BlurWrapper isBlurred={!ai} messageType="ai">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          flexGrow: 1,
        }}
      >
        {rows.map(([metric, value]) => (
          <Box
            key={metric}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              px: 2,
              borderTop: "1px solid #E0E0E0",
              fontSize: "0.875rem",
              color: "#333",
              height: "100%",
            }}
          >
            <Typography sx={{ width: "50%" }}>{metric}</Typography>
            <Typography sx={{ width: "50%", textAlign: "center" }}>
              {value}
            </Typography>
          </Box>
        ))}
      </Box>
      </BlurWrapper>
    </Box>
  );
};

export default FarmDetails;