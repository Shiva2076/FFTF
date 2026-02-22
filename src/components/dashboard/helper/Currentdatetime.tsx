'use client';
import { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import { Typography } from '@mui/material';

const Currentdatetime: NextPage = () => {
  const [currentDateTime, setCurrentDateTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      };
      const formatted = now.toLocaleString('en-US', options);
      setCurrentDateTime(formatted);
    };
    updateTime();  
    const interval = setInterval(updateTime, 60000);  
    return () => clearInterval(interval);  
  }, []);

  return (
    <Typography
      style={{
        width: "100%",
        position: "relative",
        fontSize: "1rem",
        letterSpacing: "0.15px",
        lineHeight: "200%",
        fontFamily: "Poppins",
        color: "rgba(0, 18, 25, 0.6)",
        textAlign: "left",
        display: "inline-block",
      }}
    >
      Today is {currentDateTime}
    </Typography>
  );
};

export default Currentdatetime;
