// src/components/smart-robotics/AnomaliesTable.tsx
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

const RobotAnomaliesTable: React.FC = () => {
  const anomalies = [
    { id: 'DRT001', anomaly: 'Low EC detected', action: 'Adjust EC levels', status: 'Completed' },
    { id: 'DRT002', anomaly: 'High humidity detected', action: 'Increase ventilation', status: 'In Progress' },
    { id: 'DRT003', anomaly: 'Pest activity detected', action: 'Apply pest control measures', status: 'Pending' },
    { id: 'DRT004', anomaly: 'Nutrient imbalance', action: 'Recheck nutrient solution', status: 'Completed' },
    { id: 'DRT005', anomaly: 'Low light intensity', action: 'Adjust lighting settings', status: 'Completed' },
  ];
  return (
    <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: '4px', mt: 2 }}>
      <Table size="small">
        <TableHead sx={{ backgroundColor: 'rgba(0,18,25,0.08)' }}>
          <TableRow>
            <TableCell>Drone ID</TableCell>
            <TableCell>Detected Anomaly</TableCell>
            <TableCell>Required Action</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {anomalies.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.id}</TableCell>
              <TableCell>{row.anomaly}</TableCell>
              <TableCell>{row.action}</TableCell>
              <TableCell>{row.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RobotAnomaliesTable;
