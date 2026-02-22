"use client";
import React, { useState, useMemo } from "react";
import { Box, Typography, Select, MenuItem, Tooltip as MuiTooltip } from "@mui/material";
import LockIcon from '@mui/icons-material/Lock';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import BlurWrapper from '@/components/common/BlurWrapper';

interface EnvironmentalMonitoringProps {
  environmentalMonitoringData: Array<{
    device: string;
    deviceId: string;
    redisKey: string;
    events: Array<{
      sensor_type: string;
      value: number;
      unit: string;
      EventProcessedUtcTime: string;
      [key: string]: any;
    }>;
  }>;
  iot?: boolean;
}

const EnvironmentalMonitoring: React.FC<EnvironmentalMonitoringProps> = ({ 
  environmentalMonitoringData,
  iot = true,
}) => {
  const [selectedSensor, setSelectedSensor] = useState<'Etemp' | 'Humidity' | 'CO2'>('Etemp');
  
  const sensorOptions = {
    Etemp: "Temperature",
    Humidity: "Humidity",
    CO2: "CO₂",
  };

  // Transform the data structure to match what the component expects
  const transformedData = useMemo(() => {
    if (!environmentalMonitoringData || !Array.isArray(environmentalMonitoringData)) {
      return { Etemp: [], Humidity: [], CO2: [] };
    }

    const result: { [key: string]: any[] } = {
      Etemp: [],
      Humidity: [],
      CO2: []
    };

    environmentalMonitoringData.forEach(deviceData => {
      if (deviceData.events && Array.isArray(deviceData.events)) {
        deviceData.events.forEach(event => {
          const sensorType = event.sensor_type;
          if (result[sensorType]) {
            result[sensorType].push({
              ...event,
              EventProcessedUtcTime: event.EventProcessedUtcTime
            });
          }
        });
      }
    });

    // Sort each sensor type by timestamp (descending - newest first) and take top 30
   Object.keys(result).forEach(key => {
  const readings = result[key]
    .sort((a, b) => 
      new Date(a.EventProcessedUtcTime).getTime() - new Date(b.EventProcessedUtcTime).getTime() // oldest to newest
    );

  const changedOnly: any[] = [];
  let lastValue: number | null = null;

  readings.forEach(reading => {
    if (reading.value !== lastValue) {
      changedOnly.push({
        ...reading,
        timeIST: new Date(reading.EventProcessedUtcTime).toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
          day: "2-digit",
          month: "short",
          year: "numeric"
        })
      });
      lastValue = reading.value;
    }
  });

  // Save only the last 30 changed readings (most recent first)
  result[key] = changedOnly.slice(-30).reverse();
});

    return result;
  }, [environmentalMonitoringData]);

  const formatSensorValue = (value: number) => {
    if (selectedSensor === "Etemp") return `${value}°C`;
    if (selectedSensor === "Humidity") return `${value}%RH`;
    if (selectedSensor === "CO2") return `${value} ppm`;
    return value;
  };

  const chartData = transformedData[selectedSensor]
    ?.map((item) => ({
      time: new Date(item.EventProcessedUtcTime).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }),
      date: new Date(item.EventProcessedUtcTime).toLocaleDateString("en-IN", {
        timeZone: "Asia/Kolkata",
        day: "2-digit",
        month: "short",
        year: "numeric"
      }),
      value: item.value,
      timestamp: new Date(item.EventProcessedUtcTime).getTime(),
      fullDateTime: item.EventProcessedUtcTime,
    }))
    .reverse() || []; // Reverse to show oldest to newest on chart for better visualization

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Box
          sx={{
            bgcolor: "white",
            border: "1px solid #ccc",
            borderRadius: 1,
            p: 1.5,
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            fontSize: "12px"
          }}
        >
          <Typography variant="body2" sx={{ fontFamily: "Poppins", fontWeight: 600, mb: 0.5 }}>
            {data.date}
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: "Poppins", mb: 0.5 }}>
            Time: {data.time}
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: "Poppins", color: "#ff5e00", fontWeight: 600 }}>
            Value: {formatSensorValue(data.value)}
          </Typography>
        </Box>
      );
    }
    return null;
  };

  return (
    <Box
      sx={{
        p: 2.5,
        bgcolor: "white",
        border: "1px solid rgba(0, 0, 0, 0.12)",
        borderRadius: 2,
        // maxWidth: "800px", // Made the box smaller
      }}
    >
      {/* Title and Sensor Selector */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Box>
          <Typography variant="h6" sx={{ fontFamily: "Poppins", fontWeight: 600 }}>
            Environmental Monitoring
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: "Poppins", color: "rgba(0,18,25,0.60)" }}>
            Tracks climate and energy trends.
          </Typography>
        </Box>
        <Select
          value={selectedSensor}
          onChange={(e) => setSelectedSensor(e.target.value as any)}
          size="small"
          sx={{
            minWidth: 140,
            bgcolor: "#f5fdf8",
            border: "1px solid #008756",
            color: "#008756",
            fontWeight: 600,
            fontFamily: "Poppins",
            borderRadius: 2,
            "& .MuiSelect-icon": {
              color: "#008756",
            },
            "& fieldset": { border: "none" },
          }}
        >
          {Object.entries(sensorOptions).map(([key, label]) => (
            <MenuItem key={key} value={key}>
              {label}
            </MenuItem>
          ))}
        </Select>
      </Box>

      {/* Chart */}
      <BlurWrapper isBlurred={!iot} messageType="iot">
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorSensor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ff5e00" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#ff5e00" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="time"
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: "#ccc" }}
            interval="preserveStartEnd"
          />
          <YAxis
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: "#ccc" }}
            width={50}
            domain={[0, "dataMax + 10"]}
            tickFormatter={(val) => `${val}`}
          />
          <CartesianGrid stroke="#eee" strokeDasharray="3 3" />
          <Tooltip content={<CustomTooltip />}
          labelStyle={{ fontFamily: "Poppins", padding:1 ,fontSize: 50 }} />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#ff5e00"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorSensor)"
            activeDot={{ r: 6 }}
          />
        </AreaChart>
      </ResponsiveContainer>
      </BlurWrapper>
    </Box>
  );
};

export default EnvironmentalMonitoring;