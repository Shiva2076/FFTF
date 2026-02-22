'use client';

import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Divider,
  MenuItem,
  Select,
  SelectChangeEvent,
  Grid,
  Tooltip as MuiTooltip,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import BlurWrapper from '@/components/common/BlurWrapper';

const CustomTooltip = ({ active, payload, label, metric }: any) => {
  if (active && payload && payload.length) {
    const getUnit = (metricType: string) => {
      switch (metricType) {
        case 'EC Sensor': return 'mS/cm';
        case 'PH Sensor': return 'pH';
        case 'DO Sensor': return 'mg/L';
        case 'Water Temperature Sensor': return '°C';
        default: return '';
      }
    };

    return (
      <Box
        sx={{
          backgroundColor: '#fff',
          border: '1px solid #d1d9e2',
          borderRadius: 1,
          boxShadow:
            '0px 1px 5px rgba(0, 0, 0, 0.12), 0px 2px 2px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.2)',
          px: 1,
          py: 0.5,
        }}
      >
        <Typography variant="body2" fontWeight={500}>
          {new Date(payload[0].payload.fullTime).toLocaleDateString()}
        </Typography>
        <Typography variant="body2">
          {new Date(payload[0].payload.fullTime).toLocaleTimeString()}
        </Typography>
        <Typography variant="body2" color="warning.main">
          {payload[0].value} {getUnit(metric)}
        </Typography>
      </Box>
    );
  }

  return null;
};

interface SensorReading {
  enqueuedTime: string;
  value: number;
}

interface SensorData {
  asset_name: string;
  farm_id: number;
  rack_id: number;
  shelf_id: number;
  device_id: string;
  events: SensorReading[];
}

interface ShelfConfig {
  rack_id: number;
  shelves: number[];
}

interface CropMetricsGraphProps {
  rackAndShelfData: ShelfConfig[];
  sensorData: SensorData[];
  iot?: boolean;
}

const CropMetricsGraph: React.FC<CropMetricsGraphProps> = ({
  rackAndShelfData = [],
  sensorData = [],
  iot = true,
}) => {
  const [metric, setMetric] = React.useState('EC Sensor');
  const [selectedRack, setSelectedRack] = React.useState<number | null>(null);
  const [selectedShelf, setSelectedShelf] = React.useState<number | null>(null);

  // Initialize rack and shelf from props when component mounts or data changes
  React.useEffect(() => {
    if (rackAndShelfData.length > 0) {
      const firstRack = rackAndShelfData[0].rack_id;
      const firstShelf = rackAndShelfData[0].shelves[0];
      
      setSelectedRack(prev => prev ?? firstRack);
      setSelectedShelf(prev => prev ?? firstShelf);
    }
  }, [rackAndShelfData]);

  const availableRacks = rackAndShelfData.map(config => config.rack_id);

  const availableShelves = React.useMemo(() => {
    if (!selectedRack) return [];
    const rackConfig = rackAndShelfData.find(config => config.rack_id === selectedRack);
    return rackConfig ? rackConfig.shelves : [];
  }, [selectedRack, rackAndShelfData]);

  React.useEffect(() => {
    if (availableShelves.length > 0) {
      // First time (selectedShelf is still null) → pick the first
      if (selectedShelf === null) {
        setSelectedShelf(availableShelves[0]);
      }
      // If rack changed such that current shelf isn't in the list → reset
      else if (!availableShelves.includes(selectedShelf)) {
        setSelectedShelf(availableShelves[0]);
      }
    }
  }, [availableShelves, selectedShelf]);

  const chartData = React.useMemo(() => {
    if (!selectedRack || !selectedShelf) return [];
    
    const sensorDataItem = sensorData.find(
      item =>
        item.asset_name === metric &&
        item.rack_id === selectedRack &&
        item.shelf_id === selectedShelf
    );

    return sensorDataItem
      ? sensorDataItem.events
          .map(event => ({
            time: '',
            fullTime: event.enqueuedTime, 
            value: event.value
          }))
          .sort((a, b) => new Date(a.fullTime).getTime() - new Date(b.fullTime).getTime())
      : [];
  }, [metric, selectedRack, selectedShelf, sensorData]);

  const handleMetricChange = (event: SelectChangeEvent) => {
    setMetric(event.target.value);
  };

  const handleRackChange = (event: SelectChangeEvent) => {
    setSelectedRack(Number(event.target.value));
  };

  const handleShelfChange = (event: SelectChangeEvent) => {
    setSelectedShelf(Number(event.target.value));
  };

  const getYAxisDomain = (metricType: string) => {
    switch (metricType) {
      case 'EC Sensor': return [0, 3];
      case 'PH Sensor': return [0, 14];
      case 'DO Sensor': return [0, 15];
      case 'Water Temperature Sensor': return [0, 50];
      default: return [0, 50];
    }
  };

  const getYAxisLabel = (metricType: string) => {
    switch (metricType) {
      case 'EC Sensor': return '(mS/cm)';
      case 'PH Sensor': return '(pH)';
      case 'DO Sensor': return '(mg/L)';
      case 'Water Temperature Sensor': return '(°C)';
      default: return '';
    }
  };

  return (
    <Paper variant="outlined" sx={{ borderRadius: 1, width: '100%' }}>
      <Box display="flex" justifyContent="space-between" p={3}>
        <Box>
          <Typography fontWeight={600}>Crop Metrics</Typography>
          <Typography variant="body2" color="text.secondary">
            Tracks realtime nutrient strength & availability.
          </Typography>
        </Box>
        <Select
          value={metric}
          onChange={handleMetricChange}
          variant="outlined"
          size="small"
          sx={{
            height: '2.5rem',
            borderRadius: 1,
            fontSize: '0.875rem',
            fontWeight: 500,
            color: '#001219',
            minWidth: '150px',
          }}
          IconComponent={ArrowDropDownIcon}
        >
          <MenuItem value="EC Sensor">EC Sensor</MenuItem>
          <MenuItem value="PH Sensor">PH Sensor</MenuItem>
          <MenuItem value="DO Sensor">DO Sensor</MenuItem>
          <MenuItem value="Water Temperature Sensor">Water Temperature Sensor</MenuItem>
        </Select>
      </Box>

      <Box px={3} pb={2}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Select
              value={selectedRack?.toString() || ''}
              onChange={handleRackChange}
              variant="outlined"
              size="small"
              fullWidth
              sx={{
                height: '2.5rem',
                borderRadius: 1,
                fontSize: '0.875rem',
              }}
              IconComponent={ArrowDropDownIcon}
              disabled={availableRacks.length === 0}
            >
              {availableRacks.map((rackId) => (
                <MenuItem key={rackId} value={rackId.toString()}>
                  Rack {rackId}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={6}>
            <Select
              value={selectedShelf?.toString() || ''}
              onChange={handleShelfChange}
              variant="outlined"
              size="small"
              fullWidth
              sx={{
                height: '2.5rem',
                borderRadius: 1,
                fontSize: '0.875rem',
              }}
              IconComponent={ArrowDropDownIcon}
              disabled={availableShelves.length === 0}
            >
              {availableShelves.map((shelfId) => (
                <MenuItem key={shelfId} value={shelfId.toString()}>
                  Shelf {shelfId}
                </MenuItem>
              ))}
            </Select>
          </Grid>
        </Grid>
      </Box>

      <Divider sx={{ borderColor: 'rgba(0,0,0,0.12)' }} />

      <Box px={3} py={3} height="250px">
        {chartData.length > 0 ? (
          <>
            <Typography variant="caption" sx={{ mb: 1 }}>
              {getYAxisLabel(metric)}
            </Typography>
            <BlurWrapper isBlurred={!iot} messageType="iot">
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f9a825" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="#f9a825" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="time" tickLine={false} axisLine={false} />
                  <YAxis domain={getYAxisDomain(metric)} />
                  <Tooltip content={<CustomTooltip metric={metric} />} />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#f9a825"
                    fillOpacity={1}
                    fill="url(#colorValue)"
                    activeDot={{ r: 5 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </BlurWrapper>
          </>
        ) : (
          <BlurWrapper isBlurred={!iot} messageType="iot">
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                height: '220px',
              }}
            >
              <Typography
                sx={{
                  fontSize: 12,
                  fontFamily: 'Poppins',
                  whiteSpace: 'nowrap',
                  color: 'rgba(0, 18, 25, 0.87)',
                }}
              >
                {!selectedRack || !selectedShelf 
                  ? "Please select a rack and shelf"
                  : `Will be available post transplantation`}
              </Typography>
            </Box>
          </BlurWrapper>
        )}
      </Box>
    </Paper>
  );
};

export default CropMetricsGraph;