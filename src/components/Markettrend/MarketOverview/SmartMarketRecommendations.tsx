'use client';

import React, { useState } from 'react';
import { Box, Typography, Card, Button } from '@mui/material';
import Image from 'next/image';
import ProtectedBlurWrapper from '@/components/Markettrend/ProtectedBlurWrapper';

interface Recommendation {
  title: string;
  description: string;
}

interface SmartMarketRecommendationsData {
  title: string;
  description: string;
  duration: string;
  data: Recommendation[];
}

interface Props {
  data: SmartMarketRecommendationsData;
}

const ITEMS_PER_PAGE = 4;

/** Fixed height for every card on the page (in pixels). Adjust as needed. */
const CARD_HEIGHT = 225;

const highlightText = (text: string) => {
  const patterns: { regex: RegExp; sx: any }[] = [
    {
      regex: /\b\d+\.?\d*\s?%/g,
      sx: { fontWeight: 600, color: '#1d4ed8' },
    },
    {
      regex: /%/g,
      sx: { fontWeight: 600, color: '#1d4ed8' },
    },
    {
      regex: /\b\d+(?:,\d{3})*(?:\.\d+)?\b/g,
      sx: { fontWeight: 600, color: '#1d4ed8' },
    },
    {
      regex: /\b20\d{2}\b/g,
      sx: { fontWeight: 600, color: '#1d4ed8' },
    },
    {
      regex: /\b\d+\s?(months?|years?)\b/gi,
      sx: { fontWeight: 600, color: '#1d4ed8' },
    },
    {
      regex: /\bAbu Dhabi|Al Ain\b/g,
      sx: { fontWeight: 600, color: '#1d4ed8' },
    },
    {
      regex: /\bAI-powered|NFT|Qatah|Sharjah|Dubai|Al Emarat|hydroponic|hydroponics|precision agriculture\b/gi,
      sx: { fontWeight: 600, color: '#1d4ed8' },
    },
  ];

  let parts: (string | React.JSX.Element)[] = [text];

  patterns.forEach(({ regex, sx }) => {
    parts = parts.flatMap(part => {
      if (typeof part !== 'string') return part;

      const matches = [...part.matchAll(regex)];
      if (!matches.length) return part;

      const result: (string | React.JSX.Element)[] = [];
      let lastIndex = 0;

      matches.forEach((match, i) => {
        const start = match.index!;
        const end = start + match[0].length;

        if (start > lastIndex) {
          result.push(part.slice(lastIndex, start));
        }

        result.push(
          <Box key={`${match[0]}-${i}`} component="span" sx={sx}>
            {match[0]}
          </Box>
        );

        lastIndex = end;
      });

      if (lastIndex < part.length) {
        result.push(part.slice(lastIndex));
      }

      return result;
    });
  });

  return parts;
};

const SmartMarketRecommendations: React.FC<Props> = ({ data }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const recommendations = data?.data || [];

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(prev - ITEMS_PER_PAGE, 0));
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      Math.min(
        prev + ITEMS_PER_PAGE,
        recommendations.length -
          (recommendations.length % ITEMS_PER_PAGE || ITEMS_PER_PAGE)
      )
    );
  };

  const visibleItems = recommendations.slice(
    currentIndex,
    currentIndex + ITEMS_PER_PAGE
  );
  const itemCount = visibleItems.length;

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        backdropFilter: 'blur(8px)',
        backgroundColor: 'rgba(255, 255, 255, 0.72)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Card
        sx={{
          width: '95.5%',
          boxShadow: 'none',
          border: '1px solid rgba(0, 0, 0, 0.12)',
          borderRadius: '8px',
          fontFamily: 'Poppins',
          padding: '1.5rem',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem',
            flexWrap: 'wrap',
            gap: 1,
          }}
        >
          <Box>
            <Typography variant="h6" fontWeight={600}>
              {data?.title || "Smart Market Recommendations"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {data?.description || ""}
            </Typography>
          </Box>

          {/* Paging Buttons */}
          <Box sx={{ display: 'flex', gap: '0.5rem' }}>
            <Button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              variant="contained"
              sx={{
                minWidth: '2rem',
                borderRadius: '100px',
                backgroundColor: '#ff5e00',
                transform: 'rotate(180deg)',
                boxShadow: 'none',
                '&:hover': { backgroundColor: '#e65100' },
                opacity: currentIndex === 0 ? 0.5 : 1,
                pointerEvents: currentIndex === 0 ? 'none' : 'auto',
              }}
            >
              <Image
                src="/apps/leftarrow.svg"
                alt="Previous"
                width={12}
                height={12}
                style={{ transform: 'rotate(-180deg)' }}
              />
            </Button>
            <Button
              onClick={handleNext}
              disabled={currentIndex + ITEMS_PER_PAGE >= recommendations.length}
              variant="contained"
              sx={{
                minWidth: '2rem',
                borderRadius: '100px',
                backgroundColor: '#ff5e00',
                boxShadow: 'none',
                '&:hover': { backgroundColor: '#e65100' },
                opacity: currentIndex + ITEMS_PER_PAGE >= recommendations.length ? 0.5 : 1,
                pointerEvents: currentIndex + ITEMS_PER_PAGE >= recommendations.length ? 'none' : 'auto',
              }}
            >
              <Image src="/apps/rightarrow.svg" alt="Next" width={12} height={12} />
            </Button>
          </Box>
        </Box>

        {/* Insights – Dynamic Grid with Fixed‐Height Cards */}
        <ProtectedBlurWrapper>
          <Box
            sx={{
              display: 'grid',
              gap: '1.5rem',
              padding: '1.5rem 0',
              transition: '0.3s ease-in-out',

              // Dynamically create exactly itemCount columns, each 1fr (equal width).
              gridTemplateColumns: `repeat(${itemCount}, minmax(0, 1fr))`,

              // Responsive breakpoints:
              '@media (max-width: 1200px)': {
                // If the container's width drops below 1200px, switch to 2 columns.
                gridTemplateColumns: `repeat(${Math.min(itemCount, 2)}, minmax(0, 1fr))`,
              },
              '@media (max-width: 600px)': {
                // On very small screens, stack them in one column.
                gridTemplateColumns: '1fr',
              },
            }}
          >
            {visibleItems.map((item, index) => (
              <Box
                key={index}
                sx={{
                  borderRadius: '4px',
                  backgroundColor: 'rgba(0, 135, 86, 0.08)',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                    // Enforce a constant height on every card:
                  height: `${CARD_HEIGHT}px`,
                  boxSizing: 'border-box',
                }}
              >
                <Typography
                  variant="subtitle1"
                  fontWeight={700}
                >
                  {item.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'rgba(0, 18, 25, 0.6)',
                  }}
                >
                  {highlightText(item.description)}
                </Typography>
              </Box>
            ))}
          </Box>
        </ProtectedBlurWrapper>
      </Card>
    </Box>
  );
};

export default SmartMarketRecommendations;
