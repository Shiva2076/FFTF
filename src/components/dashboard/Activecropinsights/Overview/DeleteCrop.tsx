"use client";

import React from "react";
import {
  Dialog,
  Box,
  Typography,
  Button,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { api } from "@/constants";

interface DeleteCropModalProps {
  open: boolean;
  onClose: () => void;
  cropInfo?: {
    cropCycleId: string | number;
    cropName?: string;
    cropVariety?: string;
  };
  onDeleteSuccess?: (deletedCycleId: number) => void; // Now passes the deleted ID back
}

const DeleteCropModal: React.FC<DeleteCropModalProps> = ({
  open,
  onClose,
  cropInfo,
  onDeleteSuccess,
}) => {
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [snackbarError, setSnackbarError] = React.useState(false);

  const handleDelete = async () => {
    try {
      await api.delete("/api/cropcycle", {
        data: { cycle_ids: [cropInfo?.cropCycleId] },
      });

      setSnackbarMessage("Crop cycle deleted successfully.");
      setSnackbarError(false);
      setSnackbarOpen(true);

      if (onDeleteSuccess && cropInfo?.cropCycleId != null) {
        onDeleteSuccess(Number(cropInfo.cropCycleId));
      }
      onClose();
    } catch (err) {
      console.error("Delete failed:", err);
      setSnackbarMessage("Failed to delete crop cycle.");
      setSnackbarError(true);
      setSnackbarOpen(true);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
        <Box
          sx={{
            backgroundColor: "#fff",
            padding: "1.5rem",
            borderRadius: "8px",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          {/* Close icon */}
          <IconButton
            onClick={onClose}
            sx={{ position: "absolute", top: 8, right: 8 }}
          >
            <CloseIcon />
          </IconButton>

          {/* Title */}
          <Typography variant="h6" fontWeight={700} color="#008756">
            Delete Crop Cycle
          </Typography>

          {/* Message */}
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to delete{" "}
            <strong>Crop Cycle {cropInfo?.cropCycleId}</strong>? This action
            cannot be undone and all related data will be permanently removed.
          </Typography>

          {/* Action Buttons */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="outlined"
              fullWidth
              onClick={onClose}
              sx={{
                borderColor: "#333",
                color: "#333",
                fontWeight: 600,
                padding: "0.75rem",
              }}
            >
              CANCEL
            </Button>
            <Button
              variant="contained"
              fullWidth
              onClick={handleDelete}
              sx={{
                backgroundColor: "#D32F2F",
                color: "#fff",
                fontWeight: 600,
                padding: "0.75rem",
                "&:hover": { backgroundColor: "#B71C1C" },
              }}
            >
              DELETE
            </Button>
          </Box>
        </Box>
      </Dialog>

      {/* Snackbar for success or error */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbarError ? "error" : "success"}
          onClose={() => setSnackbarOpen(false)}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default DeleteCropModal;