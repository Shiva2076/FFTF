"use client";
import React, { FC, useState, useRef, useEffect } from 'react';
import { Box, Typography, Select, MenuItem, FormControl, SelectChangeEvent } from '@mui/material';
import PaginationArrowButtons from '@/utils/PaginationArrowButtons';
import { formatUnderscoreString } from "@/utils/Capitalize";
import BlurWrapper from '@/components/common/BlurWrapper';

type Stage = { startDate: string; endDate: string };
type CropStage = {
  cycleId: number;
  growthCycle: number;
  cropName: string;
  cropVariety: string;
  cropType: string;
  status?: string;
  seeding: Stage;
  transplant: Stage;
  vegetative: Stage;
  harvest: Stage;
};

type CycleFilterType = 'all' | 'active' | 'queued';

interface CropGrowthTimelineProps {
  cropGrowthStagesTimelineData?: {
    timeline: CropStage[];
    lowestDate: string;
    highestDate: string;
    timePeriod: number;
  };
  onCycleSelect?: (info: {
    growthCycle: number;
    cycleId: number;
    cropName: string;
    cropVariety: string;
  }) => void;
  onFilterChange?: (filter: CycleFilterType) => void;
  ai?: boolean;
}

const STAGE_COLORS: Record<string, string> = {
  seeding: '#008756',
  transplant: '#81B462',
  vegetative: '#C8D04F',
  harvest: '#EEA92B',
};

const ACTIVE_STATUSES = ['INITIALIZED', 'SEEDING', 'TRANSPLANT', 'VEGETATIVE', 'HARVEST'];
const QUEUED_STATUSES = ['PENDING'];

const parseDate = (str: string) => new Date(str);
const formatMonthYear = (date: Date) =>
  date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
const getDateRange = (start: string, days: number) => {
  const range = [];
  const startDate = parseDate(start);
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    range.push(date);
  }
  return range;
};

const CropGrowthTimeline: FC<CropGrowthTimelineProps> = ({ 
  cropGrowthStagesTimelineData, 
  onCycleSelect,
  onFilterChange,
  ai = true,
}) => {
  const [cycleFilter, setCycleFilter] = useState<CycleFilterType>('all');
  const [currentPage, setCurrentPage] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const cropsPerPage = 5;

  // Reset to first page when filter changes
  useEffect(() => {
    setCurrentPage(0);
  }, [cycleFilter]);

  // Filter timeline based on selected filter
  const getFilteredTimeline = () => {
    if (!cropGrowthStagesTimelineData?.timeline) return [];
    
    const timeline = cropGrowthStagesTimelineData.timeline;
    
    switch (cycleFilter) {
      case 'active':
        return timeline.filter(crop => ACTIVE_STATUSES.includes(crop.status?.toUpperCase() || ''));
      case 'queued':
        return timeline.filter(crop => QUEUED_STATUSES.includes(crop.status?.toUpperCase() || ''));
      case 'all':
      default:
        return timeline;
    }
  };

  const filteredTimeline = getFilteredTimeline();
  const paginatedTimeline = filteredTimeline.slice(
    currentPage * cropsPerPage,
    (currentPage + 1) * cropsPerPage
  );

  // Calculate date range for visible crops
  const visibleDates = paginatedTimeline.length > 0 
    ? paginatedTimeline.flatMap((crop) => [
        crop.seeding.startDate, crop.seeding.endDate,
        crop.transplant.startDate, crop.transplant.endDate,
        crop.vegetative.startDate, crop.vegetative.endDate,
        crop.harvest.startDate, crop.harvest.endDate,
      ])
    : [];

  const lowestDate = visibleDates.length > 0 
    ? visibleDates.reduce((min, date) => new Date(date) < new Date(min) ? date : min, visibleDates[0])
    : new Date().toISOString();
  
  const highestDate = visibleDates.length > 0
    ? visibleDates.reduce((max, date) => new Date(date) > new Date(max) ? date : max, visibleDates[0])
    : new Date().toISOString();

  const timePeriod = Math.ceil((new Date(highestDate).getTime() - new Date(lowestDate).getTime()) / (1000 * 60 * 60 * 24)) + 1;
  const daysRange = getDateRange(lowestDate, Math.max(timePeriod, 1));
  const today = new Date();
  const todayIndex = daysRange.findIndex((d) => d.toDateString() === today.toDateString());
  const maxPage = Math.max(0, Math.ceil(filteredTimeline.length / cropsPerPage) - 1);

  // Scroll to today effect
  useEffect(() => {
    if (scrollRef.current && todayIndex !== -1) {
      scrollRef.current.scrollTo({
        left: todayIndex * 28 - 100,
        behavior: 'smooth',
      });
    }
  }, [todayIndex, currentPage, cycleFilter]);

  const handleFilterChange = (event: SelectChangeEvent<CycleFilterType>) => {
    const newFilter = event.target.value as CycleFilterType;
    setCycleFilter(newFilter);
    onFilterChange?.(newFilter);
  };

  const getBarStyle = (start: string, end: string, stage: string) => {
    const startIndex = daysRange.findIndex(d => d.toDateString() === parseDate(start).toDateString());
    const endIndex = daysRange.findIndex(d => d.toDateString() === parseDate(end).toDateString());
    if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) {
      return { display: "none" };
    }
    const width = (endIndex - startIndex + 1) * 28;
    const left = startIndex * 28;
    return {
      position: "absolute" as const,
      left,
      width: width - 2,
      height: 20,
      backgroundColor: STAGE_COLORS[stage],
      top: 6,
    };
  };

  if (
    !cropGrowthStagesTimelineData ||
    !cropGrowthStagesTimelineData.timeline ||
    cropGrowthStagesTimelineData.timeline.length === 0
  ) {
    return (
      <Box sx={{
        p: 3,
        bgcolor: '#fff',
        borderRadius: 2,
        border: '1px solid rgba(0,0,0,0.12)',
        minHeight: 300,
        display: 'flex',
        flexDirection: 'column',
      }}>
        <Box>
          <Typography fontWeight={600} fontSize={18}>
            Crop Growth Stages Timeline
          </Typography>
          <Typography fontSize={12} color="text.secondary">
            Visualizes crop progress through various growth stages.
          </Typography>
        </Box>
        <Box sx={{
          flexGrow: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'text.secondary',
          fontSize: 14
        }}>
          No active crop cycle timeline data available.
        </Box>
      </Box>
    );
  }

  // Empty state - filter returns no results
  if (filteredTimeline.length === 0) {
    return (
      <Box sx={{ border: "1px solid #E0E0E0", borderRadius: 2, bgcolor: "#fff" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            borderBottom: '1px solid #e9ecef',
            pb: 1,
            mb: 1,
          }}
        >
          <Box sx={{ p: 1, ml: 2 }}>
            <Typography fontWeight={600} fontSize={18}>
              Crop Growth Stages Timeline
            </Typography>
            <Typography fontSize={12} color="text.secondary">
              Visualizes crop progress through various growth stages.
            </Typography>
          </Box>
          <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <Select
                value={cycleFilter}
                onChange={handleFilterChange}
                sx={{
                  fontSize: 14,
                  height: 36,
                  bgcolor: '#f5f5f5',
                  '& .MuiSelect-select': { py: 1 }
                }}
              >
                <MenuItem value="all">All Crop Cycles</MenuItem>
                <MenuItem value="active">All Active Cycles</MenuItem>
                <MenuItem value="queued">All Queue Cycles</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
        <Box sx={{
          p: 4,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'text.secondary',
          fontSize: 14,
          minHeight: 200
        }}>
          No {cycleFilter === 'active' ? 'active' : cycleFilter === 'queued' ? 'queued' : ''} crop cycles found.
        </Box>
      </Box>
    );
  }


  return (
    <Box sx={{ border: "1px solid #E0E0E0", borderRadius: 2, bgcolor: "#fff" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          borderBottom: '1px solid #e9ecef',
          pb: 1,
          mb: 1,
        }}
      >
        <Box sx={{p:1 , ml:2}}>
          <Typography fontWeight={600} fontSize={18}>
            Crop Growth Stages Timeline
          </Typography>
          <Typography fontSize={12} color="text.secondary">
            Visualizes crop progress through various growth stages.
          </Typography>
        </Box>
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Cycle Filter Dropdown */}
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <Select
              value={cycleFilter}
              onChange={handleFilterChange}
              sx={{
                fontSize: 14,
                height: 36,
                bgcolor: '#f5f5f5',
                borderRadius: 1,
                '& .MuiSelect-select': { py: 1, pr: 4 },
                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e0e0e0' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#bdbdbd' },
              }}
            >
              <MenuItem value="all">All Crop Cycles</MenuItem>
              <MenuItem value="active">All Active Cycles</MenuItem>
              <MenuItem value="queued">All Queue Cycles</MenuItem>
            </Select>
          </FormControl>
          
          {/* Pagination Arrows */}
          <PaginationArrowButtons
            page={currentPage}
            totalPages={maxPage + 1}
            handlePrev={() => setCurrentPage(p => Math.max(0, p - 1))}
            handleNext={() => setCurrentPage(p => Math.min(maxPage, p + 1))}
          />
        </Box>
      </Box>

      <Box display="flex" justifyContent="flex-end" gap={2} sx={{ borderBottom: '1px solid #e9ecef' }}>
        {Object.entries(STAGE_COLORS).map(([key, color]) => (
          <Box key={key} display="flex" alignItems="center" gap={0.5} sx={{ mr: 2, mb: 1 }}>
            <Box sx={{ width: 10, height: 10, bgcolor: color, borderRadius: 1 }} />
            <Typography variant="body2" sx={{ fontSize: 13 }}>
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </Typography>
          </Box>
        ))}
      </Box>

      <BlurWrapper isBlurred={!ai} messageType="ai">
      <Box sx={{ display: "flex", bgcolor: '#fafafa', borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ width: 220, bgcolor: 'white', borderRight: '2px solid #f0f0f0', pt: 1.2 }}>
          <Box sx={{
            height: 50,
            fontWeight: 600,
            fontSize: 14,
            px: 2,
            color: '#333',
            borderBottom: '1px solid #e9ecef',
            display: 'flex',
            alignItems: 'center'
          }}>
            Cycle ID - Crop
          </Box>
          {paginatedTimeline.map((item, idx) => (
            <Box key={idx} sx={{
              height: 48,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              px: 2,
              borderBottom: '1px solid #f0f0f0',
              transition: 'background-color 0.2s ease',
              '&:hover': { bgcolor: '#f8f9fa' }
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" fontWeight={500} sx={{ color: '#1a1a1a', fontSize: 14, lineHeight: 1.2 }}>
                  {`${formatUnderscoreString(item.cropName)} - ${formatUnderscoreString(item.cropVariety)}`}
                  {item.cropType === "Microgreens" && ` | ${formatUnderscoreString(item.cropType)}`}
                </Typography>
                {item.status?.toUpperCase() === 'PENDING' && (
                  <Box sx={{
                    px: 0.8,
                    py: 0.2,
                    bgcolor: '#fff3e0',
                    color: '#e65100',
                    fontSize: 10,
                    fontWeight: 600,
                    borderRadius: 0.5,
                    textTransform: 'uppercase'
                  }}>
                    Queued
                  </Box>
                )}
              </Box>
              <Typography variant="caption" sx={{
                fontWeight: 600,
                fontSize: "0.75rem",
                color: "#ff5e00",
                mt: 0.2,
                letterSpacing: '0.5px',
                textDecoration: 'underline',
                cursor: 'pointer',
              }}
                onClick={() =>
                  onCycleSelect?.({
                    growthCycle: item.growthCycle,
                    cycleId: item.cycleId,
                    cropName: item.cropName,
                    cropVariety: item.cropVariety,
                  })
                }>
                {item.cycleId}
              </Typography>
            </Box>
          ))}
          {Array.from({ length: Math.max(0, cropsPerPage - paginatedTimeline.length) }).map((_, idx) => (
            <Box key={`placeholder-${idx}`} sx={{ height: 48, borderBottom: "1px solid #f0f0f0", bgcolor: 'white' }} />
          ))}
        </Box>

        <Box ref={scrollRef} sx={{ flex: 1, overflowX: "auto", position: "relative", bgcolor: 'white' }}>
          <Box sx={{ width: timePeriod * 28, position: "relative", minWidth: '100%' }}>
            {todayIndex !== -1 && (
              <Box
                sx={{
                  position: "absolute",
                  top: "18.5%",
                  left: todayIndex * 28,
                  width: 28,
                  height: "81.5%",
                  bgcolor: '#E0E0E0',
                  opacity: 0.5,
                  zIndex: 1,
                }}
              />
            )}
            <Box sx={{ display: "flex", borderBottom: '1px solid #f0f0f0', overflowX: 'hidden' }}>
              {(() => {
                const monthSegments: { label: string; days: Date[] }[] = [];
                daysRange.forEach(date => {
                  const label = formatMonthYear(date);
                  const last = monthSegments[monthSegments.length - 1];
                  if (!last || last.label !== label) {
                    monthSegments.push({ label, days: [date] });
                  } else {
                    last.days.push(date);
                  }
                });
                return monthSegments.map((segment, idx) => (
                  <Box key={idx} sx={{
                    width: segment.days.length * 28,
                    textAlign: "center",
                    fontWeight: 600,
                    fontSize: 13,
                    color: '#444',
                    py: 1,
                    borderRadius: 1,
                    mx: 0.5,
                    height: 10,
                  }}>
                    {segment.label}
                  </Box>
                ));
              })()}
            </Box>

            <Box sx={{ display: "flex", py: 0.6 }}>
              {daysRange.map((d, i) => {
                const currentLabel = formatMonthYear(d);
                const nextLabel = formatMonthYear(daysRange[i + 1] || d);
                const isMonthEnd = currentLabel !== nextLabel;
                return (
                  <Box
                    key={i}
                    sx={{
                      width: 28,
                      fontSize: 11,
                      textAlign: "center",
                      color: i === todayIndex ? "white" : "black",
                      fontWeight: 500,
                      py: 0.5,
                      bgcolor: i === todayIndex ? "#616161" : "transparent",
                      borderRight: isMonthEnd ? "2px solid #333" : "1px solid #e0e0e0",
                    }}
                  >
                    {d.getDate()}
                  </Box>
                );
              })}
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              {paginatedTimeline.map((item, idx) => (
                <Box key={idx} sx={{
                  display: 'flex',
                  alignItems: 'center',
                  minHeight: 48,
                  background: '#fff',
                }}>
                  <Box sx={{ flex: 1, position: 'relative', height: 32, display: 'flex', alignItems: 'center' }}>
                    {(["seeding", "transplant", "vegetative", "harvest"] as const).map((stage) => {
                      const barStyle = getBarStyle(item[stage].startDate, item[stage].endDate, stage);
                      return <Box key={stage} sx={barStyle} />;
                    })}
                    {todayIndex !== -1 && (
                      <Box sx={{
                        position: 'absolute',
                        left: todayIndex * 28,
                        width: 28,
                        height: '100%',
                        opacity: 0.12,
                        zIndex: 1,
                        borderRadius: '0 0 4px 4px',
                        pointerEvents: 'none'
                      }} />
                    )}
                  </Box>
                </Box>
              ))}
              {Array.from({ length: Math.max(0, cropsPerPage - paginatedTimeline.length) }).map((_, idx) => (
                <Box key={`placeholder-${idx}`} sx={{
                  display: 'flex',
                  alignItems: 'center',
                  minHeight: 48,
                  bgcolor: '#fff',
                }}>
                  <Box sx={{ width: 220 }} />
                  <Box sx={{ flex: 1 }} />
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
      </BlurWrapper>
    </Box>
  );
};

export default CropGrowthTimeline;