"use client";

import { Box, Typography, Divider } from "@mui/material";
import Image from "next/image";
import React from "react";
import BlurWrapper from '@/components/common/BlurWrapper';

interface AlertCardProps {
  title: string;
  value?: number | string;
  bgColor: string;
  iconSrc: string;
  onClick?: () => void;
}

const AlertCard = ({ title, value, bgColor, iconSrc, onClick }: AlertCardProps) => {
  const hasValue = typeof value === 'number' ? value > 0 : value !== undefined && value !== null && value !== "";

  return (
    <Box
      sx={{
        borderRadius: "8px",
        backgroundColor: "#fff",
        p: 1,
        gap: 2,
        display: "flex",
        alignItems: "center",
        minHeight: "4rem",
        width: "100%",
        flexShrink: 0,
        justifyContent: "space-between",
      }}
    >
      {/* Left side: Icon and Text */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        {/* Icon */}
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: "6px",
            backgroundColor: bgColor,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Image
            src={iconSrc}
            alt="icon"
            width={24}
            height={24}
            style={{ objectFit: "contain" }}
          />
        </Box>

        {/* Text */}
        <Box>
          <Typography
            sx={{
              fontSize: "0.75rem",
              textTransform: "uppercase",
              color: "rgba(0, 0, 0, 0.6)",
              fontWeight: 500,
              mb: 0.5,
              textAlign: "left",
            }}
          >
            {title}
          </Typography>
          {!hasValue && (
            <Typography
              sx={{
                fontSize: "0.725rem",
                color: "#000",
                textAlign: "left",
              }}
            >
              {title.includes("Alert") ? "No alerts found" : "No anomaly detected"}
            </Typography>
          )}
        </Box>
      </Box>

      {/* Right side: Value */}
      {hasValue && (
        <Typography
          onClick={onClick}
          sx={{
            fontSize: "16px",
            fontWeight: 400,
            color: "#FF5E00",
            textDecoration: 'underline',
            cursor: "pointer",
            lineHeight: "32px",
            wordWrap: 'break-word',
            padding: "4px 8px",
            borderRadius: "4px",
            "&:hover": {
              backgroundColor: "rgba(255, 94, 0, 0.08)",
            },
          }}
        >
          {value}
        </Typography>
      )}    
    </Box>
  );
};

interface AlertsAndAnomaliesProps {
  alertsAndAnomaliesData?: any;
  onMetricClick?: (metricType: string) => void;
  ai?: boolean;
}

const AlertsAndAnomalies: React.FC<AlertsAndAnomaliesProps> = ({
  alertsAndAnomaliesData,
  onMetricClick,
  ai = true,
}) => {
  const data = alertsAndAnomaliesData || {};

  const handleCardClick = (metricType: string) => {
    if (onMetricClick) {
      onMetricClick(metricType);
    }
  };

  // Using actual API data structure
  const cards = [
    {
      title: "Farm Level Anomalies",
      value: data.farmLevelAnomaliesCount,
      bgColor: "#eea92b",
      iconSrc: "/apps/dashboard/farmanomaly.svg",
      metricType: "farmLevelAnomalies",
    },
    {
      title: "Crop Level Anomalies",
      value: data.shelfLevelAnomaliesCount, // Using shelfLevel as cropLevel
      bgColor: "#eea92b",
      iconSrc: "/apps/dashboard/cropanomaly.svg",
      metricType: "cropLevelAnomalies",
    },
    {
      title: "Robotics Anomalies",
      value: data.roboticsAnomalies,
      bgColor: "#eea92b",
      iconSrc: "/apps/dashboard/roboticsanomaly.svg",
      metricType: "roboticsAnomalies",
    },
    {
      title: "Farm Level Alert",
      value: data.farmLevelAlertsCount,
      bgColor: "#ef5350",
      iconSrc: "/apps/dashboard/farmalert.svg",
      metricType: "farmLevelAlerts",
    },
    {
      title: "Crop Level Alert",
      value: data.shelfLevelAlertsCount, // Using shelfLevel as cropLevel
      bgColor: "#ef5350",
      iconSrc: "/apps/dashboard/cropalert.svg",
      metricType: "cropLevelAlerts",
    },
    {
      title: "Robotics Alert",
      value: data.roboticsAlerts,
      bgColor: "#ef5350",
      iconSrc: "/apps/dashboard/roboticsalert.svg",
      metricType: "roboticsAlerts",
    },
  ];

  return (
    <Box sx={{ width: "100%", backgroundColor: "#fff", borderRadius: 2, border: "1px solid rgba(0, 0, 0, 0.12)", boxSizing: "border-box", px: 3}}>
      <BlurWrapper isBlurred={!ai} messageType="ai">
      {cards.map((card, index) => (
        <React.Fragment key={index}>
          <AlertCard 
            {...card} 
            onClick={() => handleCardClick(card.metricType)}
          />
          {index !== cards.length - 1 && <Divider sx={{ mx: -3 }} />}
        </React.Fragment>
      ))}
      </BlurWrapper>
    </Box>
  );
};

export default AlertsAndAnomalies;