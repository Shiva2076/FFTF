"use client";
import { FC, useMemo } from "react";
import { Box, Typography, Divider } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import Image from "next/image";

interface Props {
  cropName: string;
  cropVariety: string;
}

export const BreakEvenAnalysis: FC<Props> = ({ cropName, cropVariety }) => {
  const {title,description, duration} = useSelector((state:RootState)=>state.cropGrowingGuide.data?.cropBreakevenAnalysis || {title:"",description:""});
  const breakEvenData = useSelector(
    (state: RootState) => state.cropGrowingGuide.data?.cropBreakevenAnalysis.data
  );
  const { currency, weight } = useSelector((state: RootState) => state.locationMeta);
  const selectedCrop = useMemo(() => {
    return breakEvenData?.find((entry: any) => {
      return (
        entry.crop?.toLowerCase().trim() === cropName.toLowerCase().trim() &&
        entry.variety?.toLowerCase().trim() === cropVariety.toLowerCase().trim()
      );
    });
  }, [cropName, cropVariety, breakEvenData]);

  const formatINR = (amount: number) => `${currency} ${amount.toLocaleString("en-IN")}`;

 const rows = useMemo(() => {
  if (!selectedCrop) return [];

  const isMicrogreens = "total_investment_aed" in selectedCrop;

  if (isMicrogreens) {
    return [
      {
        metric: "Total Investment",
        value: formatINR(selectedCrop.total_investment_aed ?? 0),
        note: "Initial setup & operational costs",
      },
      {
        metric: "Profit per Month",
        value: formatINR(selectedCrop.profit_per_month_aed ?? 0),
        note: "Estimated monthly profit from sales",
      },
      {
        metric: "Break-Even Point",
        value: `${selectedCrop.break_even_point_months ?? 0} months`,
        note: "When total revenue surpasses investment",
      },
    ];
  } else {
    return [
      {
        metric: "Total Investment",
        value: formatINR(selectedCrop.total_investment ?? 0),
        note: "Initial setup & operational costs",
      },
      {
        metric: "Revenue per Month",
        value: formatINR(selectedCrop.revenue_per_month ?? 0),
        note: "Based on projected yield & market prices",
      },
      {
        metric: "Monthly Expenses",
        value: formatINR(selectedCrop.monthly_expenses ?? 0),
        note: "Labor, utilities, fertilizers, etc.",
      },
      {
        metric: "Break-Even Point",
        value: `${selectedCrop.break_even_point_months ?? 0} months`,
        note: "When total revenue surpasses investment",
      },
      {
        metric: "Profit After 1 Year",
        value: formatINR(selectedCrop.profit_after_1_year ?? 0),
        note: "Estimated based on revenue growth",
      },
    ];
  }
}, [selectedCrop]);


  return (
    <Box
      sx={{
        border: "1px solid rgba(0,0,0,0.12)",
        borderRadius: "4px",
        backgroundColor: "#fff",
        overflow: "hidden",
        fontSize: "0.875rem",
        height: "542px",
      }}
    >
      {/* Header */}
      <Box sx={{ px: "1.5rem", pt: "1.5rem", pb: "0.75rem" }}>
        <Typography sx={{ fontWeight: 600 }}>{title}</Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Typography sx={{ fontSize: "0.75rem", color: "rgba(0, 0, 0, 0.6)" }}>
            {description}
          </Typography>
          <Box sx={{ display: "inline-flex", alignItems: "center", gap: "4px", color: "rgba(0, 0, 0, 0.6)", fontSize: "0.75rem" }}>
            <Box component="span" sx={{ mx: 0.5 }}>•</Box>
            <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Image src="/apps/Vector.svg" alt="calendar" width={12} height={12} />
              <Typography variant="body2" sx={{ color: "rgba(0, 0, 0, 0.6)" }}>{duration}</Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {rows.length > 0 ? (
        <>
          {/* Table Headers */}
          <Box
            sx={{
              display: "flex",
              px: "1.5rem",
              py: "1.25rem",
              backgroundColor: "#f5f5f5",
              fontWeight: 500,
            }}
          >
            <Box sx={{ width: "40%" }}>Metric</Box>
            <Box sx={{ width: "20%" }}>Value</Box>
            <Box sx={{ flex: 1 }}>Notes</Box>
          </Box>

          <Divider sx={{ borderColor: "rgba(0,0,0,0.12)" }} />

          {/* Table Rows */}
          {rows.map((row, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                px: "1.5rem",
                py: "1.20rem",
                borderTop: index === 0 ? "none" : "1px solid rgba(0,0,0,0.06)",
              }}
            >
              <Box sx={{ width: "40%" }}>{row.metric}</Box>
              <Box sx={{ width: "20%" }}>{row.value}</Box>
              <Box sx={{ flex: 1, color: "rgba(0, 0, 0, 0.6)" }}>{row.note}</Box>
            </Box>
          ))}
        </>
      ) : (
        <Box
          sx={{
            flex: 1,
            display: "flex",
            width: "100%",
            height: 340,
            justifyContent: "center",
            alignItems: "center",
            fontSize: "0.875rem",
          }}
        >
          No data available for this crop.
        </Box>
      )}
    </Box>
  );
};
