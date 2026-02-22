"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Modal,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TextField,
} from "@mui/material";
import { api } from "@/constants";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { formatUnderscoreString } from "@/utils/Capitalize";

interface Cycle {
  cycle_id: number;
  crop_name: string;
  crop_variety: string;
  crop_type: string;
  status: string;
  shelf_occupancy?: string | { total_shelves?: number };
}

interface RackShelfAllocatorProps {
  open: boolean;
  onClose: () => void;
  selectedFarmId: number;
  totalShelves: number;
  allocationforfarm?: any;
  onSaveComplete?: () => void;
  allocationEndpoint?: string;
}

type Row = Cycle & { allocatedShelves: number; _original: number };

const ALLOWED_STATUSES = ["SEEDING", "INITIALIZED", "TRANSPLANT"];

const RackShelfAllocator: React.FC<RackShelfAllocatorProps> = ({
  open,
  onClose,
  selectedFarmId,
  totalShelves,
  allocationforfarm,
  onSaveComplete,
  allocationEndpoint = "/api/cropcycle",
}) => {
  const [rows, setRows] = useState<Row[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [feedback, setFeedback] = useState<null | {
    type: "success" | "error";
    message: string;
  }>(null);

  // Flatten only reallocatable cycles
  useEffect(() => {
    if (!open) {
      setHasChanges(false);
      return;
    }

    const cyclesFromApi: Cycle[] = [];

    if (Array.isArray(allocationforfarm?.cropcyclesByType)) {
      allocationforfarm.cropcyclesByType.forEach((ct: any) => {
        (ct.cropcycles || [])
          // .filter((c: any) => ALLOWED_STATUSES.includes(c.status))
          .forEach((c: any) => {
            cyclesFromApi.push({
              ...c,
              crop_type: ct.crop_type,
            });
          });
      });
    }

    const init: Row[] = cyclesFromApi.map((c) => {
      let count = 0;
      if (c.shelf_occupancy) {
        try {
          const parsed =
            typeof c.shelf_occupancy === "string"
              ? JSON.parse(c.shelf_occupancy)
              : c.shelf_occupancy;
          count = parsed?.total_shelves ?? 0;
        } catch {
          count = 0;
        }
      }
      const initialCount = Math.max(count, count > 0 ? 1 : 0);
      return { ...c, allocatedShelves: initialCount, _original: initialCount };
    });
    
    setRows(init);
  }, [open, allocationforfarm]);
  
// Summary per crop type
  const summaryByCropType = useMemo(() => {
    const grouped: Record<
      string,
      { allocated: number; available: number; totalShelvesBytype: number; canReallocate: boolean }
    > = {};
    if (Array.isArray(allocationforfarm?.cropcyclesByType)) {
      allocationforfarm.cropcyclesByType.forEach((ct: any) => {
        const cropType = ct.crop_type;
        const allocatedFromRows = rows
          .filter((r) => r.crop_type === cropType)
          .reduce((sum, r) => sum + r.allocatedShelves, 0);
        grouped[cropType] = {
          allocated: allocatedFromRows,
          available: ct.totalAvailableShelves ?? 0,
          totalShelvesBytype: ct.totalShelves ?? 0,
          canReallocate: ALLOWED_STATUSES.some((s) =>
            (ct.cropcycles || []).some((c: any) => c.status === s)
          ),
        };
      });
    }
    return grouped;
  }, [rows, allocationforfarm]);

  const setShelves = (cycleId: number, val: number) => {
    setRows((prev) => {
      const currentRow = prev.find((r) => r.cycle_id === cycleId);
      if (!currentRow) return prev;

      const newValue = Math.max(1, val);

      const newRows = prev.map((r) =>
        r.cycle_id === cycleId ? { ...r, allocatedShelves: newValue } : r
      );
      setHasChanges(newRows.some((r) => r.allocatedShelves !== r._original));
      return newRows;
    });
  };

  const handleSave = async () => {
    const changedAllocation = rows
      .filter((r) => r.allocatedShelves !== r._original)
      .map((r) => ({
        cycleId: r.cycle_id,
        newAllocation: r.allocatedShelves,
      }));

    if (changedAllocation.length === 0) {
      onClose();
      return;
    }

    // 🚨 Validate only reallocatable crop types
    for (const [cropType, stats] of Object.entries(summaryByCropType)) {
      if (stats.canReallocate && stats.allocated > stats.available) {
        setFeedback({
          type: "error",
          message: `Allocation exceeds available shelves for ${cropType}. Limit: ${stats.available}, Allocated: ${stats.allocated}.`,
        });
        return;
      }
    }

    try {
      const response = await api.put(allocationEndpoint, {
        farmId: selectedFarmId,
        changedAllocation,
      });
      const apiMessage =
        response?.data?.message || "Rack & shelf allocation updated.";
      setFeedback({ type: "success", message: apiMessage });
      onSaveComplete?.();
      onClose();
    } catch (err: any) {
      console.error("Allocation update failed:", err);

      const errorMessage =
        err?.response?.data?.message || "Server error – check console.";

      setFeedback({
        type: "error",
        message: errorMessage,
      });
      onClose();
    }
  };

  const isOverAllocated = Object.values(summaryByCropType).some(
    (s) => s.canReallocate && s.allocated > s.available
  );
  const isSaveDisabled = !hasChanges || isOverAllocated;

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: 2,
            p: 3,
            width: "95%",
            maxWidth: 800,
          }}
        >
          <Box sx={{ position: "absolute", top: 12, right: 12 }}>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Typography
            variant="h6"
            fontWeight={700}
            color="#008756"
            sx={{ mb: 2 }}
          >
            Rack & Shelves Allocation
          </Typography>

          {/* Table: only reallocatable crops */}
          <Box sx={{ maxHeight: "50vh", overflowY: "auto", mb: 2 }}>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Cycle ID</TableCell>
                    <TableCell>Crop</TableCell>
                    <TableCell>Variety</TableCell>
                    <TableCell>Stage</TableCell>
                    <TableCell align="center">Crop Type</TableCell>
                    <TableCell align="center">Shelves</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((r) => (
                    <TableRow key={r.cycle_id}>
                      <TableCell>{r.cycle_id}</TableCell>
                      <TableCell>
                        {formatUnderscoreString(r.crop_name)}
                      </TableCell>
                      <TableCell>
                        {formatUnderscoreString(r.crop_variety)}
                      </TableCell>
                      <TableCell>{r.status}</TableCell>
                      <TableCell align="center">{r.crop_type}</TableCell>
                      <TableCell align="center">
                        <TextField
                          type="number"
                          size="small"
                          value={r.allocatedShelves}
                          onChange={(e) =>
                            setShelves(r.cycle_id, Number(e.target.value))
                          }
                          onBlur={(e) => {
                            const numeric = Number(e.target.value);
                            if (numeric < 1) {
                              setShelves(r.cycle_id, 1);
                            }
                          }}
                          sx={{
                            width: 60,
                            "& input": {
                              textAlign: "center",
                              fontWeight: 600,
                            },
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          {/* Per crop type summary */}
          <Box mt={2} mb={1}>
            <Typography variant="body2" fontWeight={600}>
              Total Shelves in Farm: {totalShelves}
            </Typography>

            {Object.entries(summaryByCropType).map(([cropType, stats]) => {
              const empty = stats.canReallocate
                ? stats.available - stats.allocated
                : 0;
              return (
                <Typography key={cropType} variant="body2" sx={{ mt: 0.5 }}>
                  <strong>{cropType}:</strong>&nbsp;
                  Total: {stats.totalShelvesBytype} &nbsp;|&nbsp;
                  {/* Available: {stats.available} &nbsp;|&nbsp;            */}
                  Available: {stats.totalShelvesBytype - stats.allocated} &nbsp;|&nbsp;  
                  Allocated:{" "}
                  <span
                    style={{
                      color:
                        stats.canReallocate && stats.allocated > stats.available
                          ? "#d32f2f"
                          : "inherit",
                    }}
                  >
                    {stats.allocated}
                  </span>{" "}
                  {/* &nbsp;|&nbsp; */}
                  {/* Empty: {empty < 0 ? 0 : empty} */}
                </Typography>
              );
            })}
          </Box>

          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={isSaveDisabled}
              sx={{
                backgroundColor: "#ff5e00",
                "&:hover": { backgroundColor: "#e64a00" },
              }}
            >
              SAVE
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Feedback Modal */}
      <Modal open={!!feedback} onClose={() => setFeedback(null)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: 2,
            p: 4,
            width: 300,
            textAlign: "center",
          }}
        >
          <Typography variant="h6" fontWeight={600} mb={1}>
            {feedback?.type === "success" ? "Success" : "Error"}
          </Typography>
          <Typography variant="body1">{feedback?.message}</Typography>
          <Box mt={2}>
            <Button
              variant="contained"
              onClick={() => setFeedback(null)}
              sx={{
                backgroundColor: "#ff5e00",
                "&:hover": { backgroundColor: "#e64a00" },
              }}
            >
              Close
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default RackShelfAllocator;
