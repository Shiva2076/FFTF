import { Box, Typography } from "@mui/material";
import Image from "next/image";
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import BlurWrapper from '@/components/common/BlurWrapper';

interface SummaryCardProps {
  title: string;
  value: string;
  bgColor: string;
  icon?: string;
  isBlurred?: boolean;
  messageType?: 'iot' | 'ai';
}

interface TopCardsData {
  overallEnvironment: string;
  resourceEfficiency: string;
  cropPerformance: string;
  predictedProfit: string;
}

interface FarmSummaryCardsProps {
  topCardsFarmSummary: TopCardsData;
  iot?: boolean;
  ai?: boolean;
}

const FarmSummaryCards = ({ topCardsFarmSummary, iot = true, ai = true }: FarmSummaryCardsProps) => {
  const { currency } = useSelector((state: RootState) => state.farmLocationMeta);
  const cards: SummaryCardProps[] = [
    {
      title: "Overall Environment",
      value: topCardsFarmSummary?.overallEnvironment || "N/A",
      bgColor: "#008756",
      icon: "/apps/dashboard/environment.svg",
      isBlurred: !iot, // IOT card
      messageType: 'iot',
    },
    {
      title: "Resource Efficiency",
      value: topCardsFarmSummary?.resourceEfficiency || "75 %",
      bgColor: "#c8d04f",
      icon: "/apps/dashboard/resource.svg",
      isBlurred: !iot, // IOT card
      messageType: 'iot',
    },
    {
      title: "Crop Performance",
      value: topCardsFarmSummary?.cropPerformance || "N/A",
      bgColor: "#eea92b",
      icon: "/apps/dashboard/cropperformance.svg",
      isBlurred: !ai, // AI card
      messageType: 'ai',
    },
    {
      title: "Predicted Profit",
      value:"N/A",
      // value: topCardsFarmSummary?.predictedProfit ? `${currency} ${topCardsFarmSummary.predictedProfit}`: "N/A",
      bgColor: "#ff5e00",
      icon: "/apps/dashboard/predicatedprofit.svg",
      isBlurred: !iot, // IOT card
      messageType: 'iot',
    },
  ];

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "row",
        gap: "1rem",
        flexWrap: "wrap", // optional for responsiveness
      }}
    >
      {cards.map((card) => (
        <SummaryCard key={card.title} {...card} />
      ))}
    </Box>
  );
};

const SummaryCard = ({ title, value, bgColor, icon, isBlurred = false, messageType = 'iot' }: SummaryCardProps) => {
  return (
    <Box
      sx={{
        flex: 1,
        borderRadius: "0.5rem",
        backgroundColor: "#fff",
        border: "1px solid rgba(0, 0, 0, 0.12)",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        p: "1rem 1.25rem",
        minHeight: "90px",
        position: "relative",
        gap: "0.75rem",
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", flex: 1, gap: "0.75rem" }}>
        <Typography
          sx={{
            fontSize: "0.7rem",
            fontWeight: 500,
            color: "rgba(0,0,0,0.6)",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          {title}
        </Typography>
        <BlurWrapper isBlurred={isBlurred} messageType={messageType}>
          <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "0.75rem", width: "100%" }}>
            <Typography
              sx={{
                fontSize: "1.25rem",
                fontWeight: 700,
                color: "#001219",
                lineHeight: 1.5,
              }}
            >
              {value}
            </Typography>
            {icon && (
              <Box
                sx={{
                  width: "2.5rem",
                  height: "2.5rem",
                  backgroundColor: bgColor,
                  borderRadius: "6px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image
                  src={icon}
                  alt={`${title} icon`}
                  width={20}
                  height={20}
                  style={{ objectFit: "contain" }}
                />
              </Box>
            )}
          </Box>
        </BlurWrapper>
      </Box>
    </Box>
  );
};

export default FarmSummaryCards;
