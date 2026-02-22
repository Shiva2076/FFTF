'use client';

import { Box, Grid, Typography } from "@mui/material";
import {
  PieChart,
  Pie,
  ResponsiveContainer,
} from "recharts";
import { roundOff } from '@/utils/roundoff';
import BlurWrapper from '@/components/common/BlurWrapper';

interface RacksUsage {
  totalShelves: number;
  shelvesInUse: number;
  shelfUsePercentage: number;
  totalRacks: number;
  racksInUse: number;
  rackUsePercentage: number;
}

interface WaterUsage {
  tankCapacity: number;
  consumableCapacity: number;
  cropWaterUsage: number;
}

interface EnergyConsumption {
  totalPowerConsumption: number;
}

interface FarmResourcesData {
  racksUsage?: RacksUsage;
  waterUsage?: WaterUsage;
  energyConsumption?: EnergyConsumption;
}

interface Props {
  farmResourcesData: FarmResourcesData;
  iot?: boolean;
}

const ResourcesCharts = ({ farmResourcesData, iot = true }: Props) => {
  const renderPie = (used: number, total: number, color: string) => [
    { value: used, fill: color },
    { value: total - used, fill: "#e0e0e0" },
  ];

  const renderEmptyPie = () => [
    { value: 1, fill: "#f0f0f0" },
    { value: 0, fill: "#f0f0f0" },
  ];

  const charts = [
    {
      title: "Rack Usage",
      isAvailable:
        farmResourcesData?.racksUsage?.totalRacks != null &&
        farmResourcesData?.racksUsage?.totalShelves != null,
      outerRing: {
        used: farmResourcesData?.racksUsage?.racksInUse ?? 0,
        total: farmResourcesData?.racksUsage?.totalRacks ?? 1,
        color: "#008756",
        label: "Total Racks Occupied",
        value: `${farmResourcesData?.racksUsage?.racksInUse ?? 0} of ${farmResourcesData?.racksUsage?.totalRacks ?? 0} racks`,
      },
      innerRing: {
        used: farmResourcesData?.racksUsage?.shelvesInUse ?? 0,
        total: farmResourcesData?.racksUsage?.totalShelves ?? 1,
        color: "#c8d04f",
        label: "Total Shelves Occupied",
        value: `${farmResourcesData?.racksUsage?.shelvesInUse ?? 0} of ${farmResourcesData?.racksUsage?.totalShelves ?? 0} shelves`,
      },
      customRender: null,
    },
    {
      title: "Water Usage",
      isAvailable:
        farmResourcesData?.waterUsage?.tankCapacity != null &&
        farmResourcesData?.waterUsage?.consumableCapacity != null &&
        farmResourcesData?.waterUsage?.cropWaterUsage != null,
      outerRing: {
        color: "#03a9f4",
        label: "Consumable Capacity",
        value: `${roundOff(farmResourcesData?.waterUsage?.consumableCapacity ?? 0)}L of ${roundOff(farmResourcesData?.waterUsage?.tankCapacity ?? 0)}L`,
      },
      innerRing: {
        used: farmResourcesData?.waterUsage?.cropWaterUsage ?? 0,
        total: farmResourcesData?.waterUsage?.consumableCapacity ?? 1,
        color: "#01579b",
        label: "Crop Water Usage",
        value: `${roundOff(farmResourcesData?.waterUsage?.cropWaterUsage ?? 0)}L of ${roundOff(farmResourcesData?.waterUsage?.consumableCapacity ?? 0)}L`,
      },
      customRender: () => {
        const tank = roundOff(farmResourcesData?.waterUsage?.tankCapacity ?? 1);
        const consumable = roundOff(farmResourcesData?.waterUsage?.consumableCapacity ?? 0);
        const used = roundOff(farmResourcesData?.waterUsage?.cropWaterUsage ?? 0);

        const outerPie = [
          { value: consumable, fill: "#03a9f4" },
          { value: tank - consumable, fill: "#e0e0e0" },
        ];

        const innerPie = [
          { value: used, fill: "#01579b" },
          { value: consumable - used, fill: "#03a9f4" },
        ];

        return (
          <PieChart>
            <Pie data={outerPie} dataKey="value" cx="50%" cy="50%" innerRadius={45} outerRadius={60} stroke="none" />
            <Pie data={innerPie} dataKey="value" cx="50%" cy="50%" innerRadius={25} outerRadius={42} stroke="none" />
          </PieChart>
        );
      },
    },
    {
      title: "Energy Consumption",
      isAvailable:
        farmResourcesData?.energyConsumption?.totalPowerConsumption != null,
      outerRing: {
        used: 1,
        total: 1,
        color: "#ff5e00",
        label: "Total Power Consumption",
        value: `${roundOff(farmResourcesData?.energyConsumption?.totalPowerConsumption ?? 0)} KWh`,
      },
      innerRing: null,
      customRender: null,
    },
  ];

  return (
    <Box sx={{ backgroundColor: "#fff", border: "1px solid rgba(0,0,0,0.12)", borderRadius: "8px", overflow: "hidden" }}>
      <Box sx={{ px: 3, py: 2, borderBottom: "1px solid #e0e0e0" }}>
        <Box fontWeight={600} fontSize="1rem">Farm Resources</Box>
        <Box fontSize="0.75rem" color="rgba(0, 18, 25, 0.6)">
          Tracks crop allocation within the selected farm
        </Box>
      </Box>

      <Box sx={{ px: 5, pb: 3, pt: 2 }}>
        <Grid container spacing={2}>
          {charts.map((chart, idx) => {
            // Water Usage and Energy Consumption are IOT cards
            const isIOTCard = chart.title === "Water Usage" || chart.title === "Energy Consumption";
            const shouldBlur = isIOTCard && !iot;
            
            return (
              <Grid item xs={12} sm={4} key={idx}>
                <Box sx={{ textAlign: "center", position: "relative" }}>
                  <Box fontWeight={600} mb={1}>{chart.title}</Box>
                  <Box sx={{ position: "relative", height: "280px" }}>
                    <BlurWrapper isBlurred={shouldBlur} messageType="iot">
                      <Box sx={{ width: 160, height: 160, mx: "auto", mb: 2 }}>
                        <ResponsiveContainer width="90%" height="90%">
                          {chart.customRender ? (
                            chart.customRender()
                          ) : (
                            <PieChart>
                              <Pie
                                data={chart.isAvailable ? renderPie(chart.outerRing.used ?? 0, chart.outerRing.total ?? 1, chart.outerRing.color) : renderEmptyPie()}
                                dataKey="value"
                                cx="50%"
                                cy="50%"
                                innerRadius={45}
                                outerRadius={60}
                                stroke="none"
                              />
                              {chart.innerRing && chart.title === "Rack Usage" && (
                                <Pie
                                  data={chart.isAvailable ? renderPie(chart.innerRing.used ?? 0, chart.innerRing.total ?? 1, chart.innerRing.color) : renderEmptyPie()}
                                  dataKey="value"
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={25}
                                  outerRadius={42}
                                  stroke="none"
                                />
                              )}
                            </PieChart>
                          )}
                        </ResponsiveContainer>
                      </Box>

                      <Box sx={{ textAlign: "left", px: 2, display: "flex", flexDirection: "column", gap: 1, minHeight: "80px" }}>
                        {[chart.outerRing, ...(chart.innerRing ? [chart.innerRing] : [])]
                          .filter(Boolean)
                          .map((item: any, i) => (
                            <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <Box sx={{ width: "1rem", height: "1rem", backgroundColor: item.color ?? "#ccc", borderRadius: "3px" }} />
                              <Box>
                                <Box sx={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px", color: "rgba(0,0,0,0.6)" }}>
                                  {item.label}
                                </Box>
                                <Box sx={{ fontWeight: 500, fontSize: "0.875rem", color: "rgba(0,0,0,0.87)" }}>
                                  {item.value}
                                </Box>
                              </Box>
                            </Box>
                          ))}
                        {/* Add spacer for cards with only one legend item to match height */}
                        {!chart.innerRing && chart.title !== "Rack Usage" && (
                          <Box sx={{ height: "40px" }} />
                        )}
                      </Box>
                    </BlurWrapper>
                  </Box>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Box>
  );
};

export default ResourcesCharts;
