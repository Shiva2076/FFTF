"use client";

import type { FC } from "react";
import Image from "next/image";
import { Popover } from "@mui/material";
import { useMemo, useState } from "react";

type StatField = { value: string; tooltip: string };

type MarketOverviewData = {
  currentMarketSize?: StatField;
  annualGrowthRate?: StatField;
  supplyGap?: StatField;
  profitability?: StatField;
};

type Props = {
  data: {
    title: string;
    description: string;
    duration: string;
    data: MarketOverviewData | MarketOverviewData[] | undefined;
  };
};

type CardItem = {
  title: string;
  value: string;
  tooltip: string;
  bgColor: string;
  icon: string;
};

const MarketOverviewTopCard: FC<Props> = ({ data }) => {
  const { title, description, duration } = data;
  const normalized: MarketOverviewData | undefined = useMemo(() => {
    const d = data?.data;
    if (Array.isArray(d)) return d[0];
    return d;
  }, [data]);

  const cards: CardItem[] = useMemo(
    () => [
      {
        title: "Market Value",
        value: normalized?.currentMarketSize?.value ?? "",
        tooltip: normalized?.currentMarketSize?.tooltip ?? "",
        bgColor: "#008756",
        icon: "/apps/markettrendhomemarketvalue.svg",
      },
      {
        title: "Growth Rate",
        value: normalized?.annualGrowthRate?.value ?? "",
        tooltip: normalized?.annualGrowthRate?.tooltip ?? "",
        bgColor: "#c8d04f",
        icon: "/apps/markettrendhomegrowthrate.svg",
      },
      {
        title: "Supply Gap",
        value: normalized?.supplyGap?.value ?? "",
        tooltip: normalized?.supplyGap?.tooltip ?? "",
        bgColor: "#eea92b",
        icon: "/apps/markettrendhomesupplygap.svg",
      },
      {
        title: "Profitability",
        value: normalized?.profitability?.value ?? "",
        tooltip: normalized?.profitability?.tooltip ?? "",
        bgColor: "#ff5e00",
        icon: "/apps/markettrendhomeoperationalcost.svg",
      },
    ],
    [normalized]
  );

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [tooltipContent, setTooltipContent] = useState("");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap: "1rem",
        width: "100%",
        flexWrap: "wrap",
        fontSize: "0.75rem",
        color: "rgba(0, 18, 25, 0.6)",
      }}
    >
      {cards.map((card, index) => (
        <div
          key={index}
          style={{
            flex: "1",
            width: "100%",
            position: "relative",
            borderRadius: "4px",
            backgroundColor: "#fff",
            border: "1px solid rgba(0, 0, 0, 0.12)",
            boxSizing: "border-box",
            overflow: "hidden",
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            padding: "1rem 1.25rem",
            textAlign: "left",
            fontFamily: "Poppins, Arial,Sans-serif",
          }}
        >
          <div
            style={{
              alignSelf: "stretch",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
              gap: "0.75rem",
            }}
          >
            {/* Left Section */}
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: "5.5rem",
                gap: "0.75rem",
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: '0.5rem',
                  paddingTop: '0.25rem',
                }}
              >
                <div
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    position: "relative",
                    letterSpacing: "1px",
                    lineHeight: "normal",
                    textTransform: "uppercase",
                    paddingTop:
                      index === 0
                        ? '0.25rem'
                        : index === 1
                          ? '0rem'
                          : index === 2
                            ? '0rem'
                            : index === 3
                              ? '0.25rem'
                              : '0',
                  }}
                >
                  {card.title}
                </div>
                <Image
                  style={{
                    width: "0.75rem",
                    position: "relative",
                    maxHeight: "100%",
                  }}
                  width={12}
                  height={12}
                  alt="info icon"
                  src="/apps/markettrendhomemarketoverview.svg"
                  onMouseEnter={(e) => {
                    setAnchorEl(e.currentTarget);
                    setTooltipContent(card.tooltip);
                  }}
                  onMouseLeave={() => {
                    // Delay hiding so the user can hover the popover
                    setTimeout(() => setAnchorEl(null), 200);
                  }}
                />
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  minHeight: '3rem',
                }}
              >
                <div
                  style={{
                    fontSize: '1rem',
                    letterSpacing: '0.15px',
                    lineHeight: '160%',
                    fontWeight: 600,
                    color: 'rgba(0, 18, 25, 0.87)',
                  }}
                >
                  {card.value.split("(")[0].trim()}
                </div>
                {card.value.includes("(") && (
                  <div
                    style={{
                      fontSize: "0.8125rem",
                      fontWeight: 500,
                      color: "rgba(0, 18, 25, 0.7)",
                      lineHeight: "140%",
                      paddingTop: "0.125rem",
                    }}
                  >
                    (
                    {card.value
                      .split("(")[1]
                      .replace(")", "")
                      .trim()}
                    )
                  </div>
                )}
              </div>
            </div>

            {/* Right Icon */}
            <div
              style={{
                width: "2rem",
                borderRadius: "4px",
                backgroundColor: card.bgColor,
                height: "2rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                style={{
                  width: "1.5rem",
                  position: "relative",
                  maxHeight: "100%",
                }}
                width={24}
                height={24}
                alt={card.title}
                src={card.icon}
              />
            </div>
          </div>
        </div>
      ))}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        sx={{ pointerEvents: "none" }} // so it behaves more like a tooltip
        disableRestoreFocus
      >
        <div
          style={{
            padding: "0.75rem 1rem",
            maxWidth: "250px",
            fontSize: "0.875rem",
            color: "#001219",
          }}
        >
          {tooltipContent}
        </div>
      </Popover>
    </div>
  );
};

export default MarketOverviewTopCard;