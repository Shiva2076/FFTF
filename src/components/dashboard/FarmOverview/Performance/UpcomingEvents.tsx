'use client';
import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import Image from 'next/image';
import PaginationArrowButtons from '@/utils/PaginationArrowButtons';
import BlurWrapper from '@/components/common/BlurWrapper';
type EventItem = {
  event: 'SEEDING' | 'TRANSPLANT' | 'HARVEST';
  growth_cycle: string;
  number_of_cycles: number;
};

interface Props {
  upcomingEventsData: EventItem[];
  onGrowthCycleClick?: (growthCycle: number) => void;
  ai?: boolean;
}
const ITEMS_PER_PAGE = 6; 
const eventConfig: Record<
  EventItem['event'],
  { label: string; icon: string; bg: string }
> = {
  SEEDING: {
    label: 'Seeding',
    icon: '/apps/dashboard/seeding.svg',
    bg: '#008756',
  },
  TRANSPLANT: {
    label: 'Transplant',
    icon: '/apps/dashboard/transplant.svg',
    bg: '#81b462',
  },
  HARVEST: {
    label: 'Harvest',
    icon: '/apps/dashboard/harvest.svg',
    bg: '#ff5e00',
  },
};

const EventCard = ({ item, onGrowthCycleClick }: { item: EventItem; onGrowthCycleClick?: (id: number) => void }) => {
  const config = eventConfig[item.event];

  return (
    <Box
      sx={{
        borderRadius: '8px',
        backgroundColor: '#F9F9F9',
        border: '1px solid rgba(0, 0, 0, 0.12)',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: '1rem',
        p: '0.75rem',
      }}
    >
      {/* Icon Box */}
      <Box
        sx={{
          width: '3rem',
          height: '3rem',
          borderRadius: '4px',
          backgroundColor: config.bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Image width={24} height={24} alt={config.label} src={config.icon} />
      </Box>

      {/* Texts */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <Typography sx={{ fontWeight: 600, fontSize: "0.875rem" }}>
          {config.label}
        </Typography>
        <Typography
          sx={{
            fontSize: '0.75rem',
            letterSpacing: '0.4px',
            color: '#000',
          }}
        >
          <Typography
            component="span"
            sx={{ fontWeight: 500, color: config.bg, fontSize: '0.875rem', textDecoration: 'underline',cursor:'pointer' }}
            onClick={() => onGrowthCycleClick?.(Number(item.growth_cycle))}
          >
            Growth Cycle {item.growth_cycle}
          </Typography>{' '}
          has {item.number_of_cycles} cycle{item.number_of_cycles > 1 ? 's' : ''} ready for{' '}
          {config.label}
        </Typography>
      </Box>
    </Box>
  );
};

const UpcomingEvents: React.FC<Props> = ({ upcomingEventsData = [], onGrowthCycleClick, ai = true }) => {
  const [page, setPage] = useState(0);
    const totalPages = Math.ceil(upcomingEventsData.length / ITEMS_PER_PAGE);
  const handlePrev = () => setPage((prev) => Math.max(prev - 1, 0));
  const handleNext = () => setPage((prev) => Math.min(prev + 1, totalPages - 1));
const currentItems = upcomingEventsData.slice(
    page * ITEMS_PER_PAGE,
    (page + 1) * ITEMS_PER_PAGE
  );
  const hasData = upcomingEventsData.length > 0;

  return (
    <Box
      sx={{
        width: '100%',
        borderRadius: '8px',
        backgroundColor: '#fff',
        border: '1px solid rgba(0, 0, 0, 0.12)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        fontFamily: 'Poppins',
        flexGrow:"1",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: { xs: 2, sm: 3 },
          borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
        }}
      >
        <Typography sx={{ fontWeight: 600, fontSize: '1rem', letterSpacing: '0.15px' }}>
          Upcoming Events
        </Typography>
        <Typography
          sx={{
            fontSize: '0.75rem',
            color: 'rgba(0,0,0,0.6)',
            letterSpacing: '0.4px',
          }}
        >
          Lists upcoming farm tasks and activities.
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', mt: -6.5 }}>
          <PaginationArrowButtons
            page={page}
            totalPages={totalPages}
            handlePrev={handlePrev}
            handleNext={handleNext}
          />
          </Box>
      </Box>

      {/* Content */}
      <BlurWrapper isBlurred={!ai} messageType="ai">
      <Box
        sx={{
          p: { xs: 2, sm: 3 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: hasData ? 'stretch' : 'center',
          justifyContent: hasData ? 'flex-start' : 'center',
          gap: '0.75rem',
          minHeight: '300px',
          // flexGrow: 1,
        }}
      >
        {hasData ? (
          <>
            {currentItems.map((item, idx) => (
              <EventCard key={idx} item={item} onGrowthCycleClick={onGrowthCycleClick}/>
            ))}
          </>
        ) : (
          <Typography sx={{ mt: 2, fontSize: '0.875rem', color: 'rgba(0,0,0,0.6)' }}>
            No upcoming Events
          </Typography>
        )}
      </Box>
      </BlurWrapper>
    </Box>
  );
};

export default UpcomingEvents;
