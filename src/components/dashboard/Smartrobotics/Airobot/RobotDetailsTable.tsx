// src/components/smart-robotics/DroneDetailsTable.tsx
import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

const RobotDetailsTable: React.FC = () => {
  const rows = [
    { id: 'DRT001', status: 'Active', type: 'AMR', battery: '85%', timeLeft: '2 hrs', picsTaken: '15', picsLeft: '30' },
    { id: 'DRT002', status: 'Docking', type: 'AMR', battery: '80%', timeLeft: '1.5 hrs', picsTaken: '12', picsLeft: '28' },
    { id: 'DRT003', status: 'Active', type: 'AMR', battery: '90%', timeLeft: '3 hrs', picsTaken: '18', picsLeft: '35' },
  ];
  return (
    <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: '4px', mt: 2 }}>
      <Table size="small">
        <TableHead sx={{ backgroundColor: 'rgba(0,18,25,0.08)' }}>
          <TableRow>
            <TableCell>Drone ID</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Battery Health</TableCell>
            <TableCell>Time Left</TableCell>
            <TableCell>Pictures Taken</TableCell>
            <TableCell>Pictures Left</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.id}</TableCell>
              <TableCell>{row.status}</TableCell>
              <TableCell>{row.type}</TableCell>
              <TableCell>{row.battery}</TableCell>
              <TableCell>{row.timeLeft}</TableCell>
              <TableCell>{row.picsTaken}</TableCell>
              <TableCell>{row.picsLeft}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RobotDetailsTable;