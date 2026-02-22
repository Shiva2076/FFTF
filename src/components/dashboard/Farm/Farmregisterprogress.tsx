"use client";
import { FC, useMemo, useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
  Snackbar,
  Alert
} from "@mui/material";
import { api } from "@/constants";
import PriceModelFarmxos from "@/components/Markettrend/Email/PriceModelFarmxos";

const allSteps = [
  "SUBMITTED",
  "REPRESENTATIVE CALL",
  "PROPOSED FARM DETAILS",
  "PROPOSED SUBSCRIPTION DETAILS",
  "WORK IN PROGRESS",
  "SETUP DONE",
];

const getStepsWithStatus = (status: string) => {
  const currentIndex = allSteps.indexOf(status.toUpperCase());
  return allSteps.map((step, idx) => ({
    step,
    active: idx <= currentIndex,
  }));
};

interface FarmregisterprogressProps {
  response: {
    farm: any;
    showTimeline: boolean;
    timelineData: {
      status: string;
      type: string;
      details: string;
    };
  };
}

const Farmregisterprogress: FC<FarmregisterprogressProps> = ({ response }) => {
  const farm = response.farm;
  const timeline = response.timelineData;
  const [currentStatus, setCurrentStatus] = useState(timeline?.status || "SUBMITTED");

  const [farmDetails, setFarmDetails] = useState<any>(null);
  const [racks, setRacks] = useState("");
  const [shelves, setShelves] = useState("");
  const [channels, setChannels] = useState("");
  const [plugs, setPlugs] = useState("");

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState<"success" | "error">("success");

  const steps = useMemo(() => getStepsWithStatus(currentStatus), [currentStatus]);

  useEffect(() => {
    const fetchFarmDetails = async () => {
      try {
        if (["REPRESENTATIVE CALL", "PROPOSED FARM DETAILS", "PROPOSED SUBSCRIPTION DETAILS"].includes(currentStatus) && farm?.farm_id) {
          const res = await api.get(`/api/farm/get_farmdetails/${farm.farm_id}`);
          const data = res.data.data;
  
          setFarmDetails({
            farm_name: data.farm_name,
            country: data.country,
            state: data.state,
            city: data.city,
            location: data.location,
            racks: data.racks,
            shelves_per_rack: data.shelves_per_rack,
            channels_per_shelf: data.channels_per_shelf,
            plugs_per_channel: data.plugs_per_channel,
          });
  
          setRacks(data.racks?.toString() || "");
          setShelves(data.shelves_per_rack?.toString() || "");
          setChannels(data.channels_per_shelf?.toString() || "");
          setPlugs(data.plugs_per_channel?.toString() || "");
        }
      } catch (err) {
        console.error("Failed to fetch farm details:", err);
      }
    };
  
    fetchFarmDetails();
}, [currentStatus, farm?.farm_id]);

  const handleSubmit = async () => {
    try {
      const res = await api.put("/api/farm/update", {
        farm_id: farm?.farm_id,
        racks: parseInt(racks),
        shelves_per_rack: parseInt(shelves),
        channels_per_shelf: parseInt(channels),
        plugs_per_channel: parseInt(plugs),
        status: "PROPOSED FARM DETAILS",
      });
      const updatedStatus = res.data.data.farm.status;
      setFarmDetails(res.data.data.farm);
      setCurrentStatus(updatedStatus);

      setToastMessage("Farm configuration updated and status moved to PROPOSED FARM DETAILS.");
      setToastOpen(true);
      setToastSeverity("success");

    } catch (err) {
      console.error("Update failed", err);
      setToastMessage("Failed to update farm configuration.");
      setToastSeverity("error");
      setToastOpen(true);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: 1,
        fontFamily: "Poppins",
      }}
    >
      <Typography
        variant="h5"
        fontWeight="bold"
        color="#008756"
        mb={1}
        textAlign="center"
      >
        Your Farm Registration is in Progress
      </Typography>

      <Typography
        variant="body2"
        textAlign="center"
        color="rgba(0, 0, 0, 0.6)"
        mb={4}
      >
        Our team is reviewing your submission. You’ll be notified at each stage of the process.
      </Typography>

      {/* Stepper */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        mb={4}
        sx={{ width: "100%", maxWidth: 1100, overflowX: "auto" }}
      >
        {steps.map(({ step, active }, idx) => (
          <Box key={step} sx={{ display: "flex", alignItems: "center" }}>
            <Box textAlign="center" minWidth={120}>
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  border: `2px solid ${active ? "#FF5E00" : "#bbb"}`,
                  backgroundColor: "#fff",
                  mx: "auto",
                  mb: 1,
                  position: "relative",
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    backgroundColor: active ? "#FF5E00" : "#bbb",
                  },
                }}
              />
              <Typography
                variant="caption"
                textTransform="uppercase"
                fontWeight={600}
                color={active ? "#FF5E00" : "rgba(0, 0, 0, 0.4)"}
                fontSize="10px"
                lineHeight={1.3}
              >
                {step}
              </Typography>
            </Box>
            {idx < steps.length - 1 && (
              <Box
                sx={{
                  width: 30,
                  height: 2,
                  backgroundImage:
                    "repeating-linear-gradient(to right, rgba(0,0,0,0.3), rgba(0,0,0,0.3) 4px, transparent 4px, transparent 8px)",
                  backgroundRepeat: "repeat-x",
                  mx: 2,
                }}
              />
            )}
          </Box>
        ))}
      </Box>
      {currentStatus ==="SUBMITTED" &&(
      <Paper
        sx={{
          width: "26rem",
          borderRadius: 1,
          backgroundColor: "#f7f7f7",
          border: "1px solid rgba(0, 0, 0, 0.12)",
          p: 3,
          textAlign: "left",
          mb: 4,
        }}
      >
        <Typography variant="body2" color="rgba(0, 18, 25, 0.6)">
            We have received your form submission and will call you as soon as possible to assist you.
        </Typography>
      </Paper>
      )}
      {/* Farm Info & Config Form */}
      {currentStatus === "REPRESENTATIVE CALL" && (
        <Paper
          sx={{
            width: "26rem",
            borderRadius: 1,
            backgroundColor: "#f7f7f7",
            border: "1px solid rgba(0, 0, 0, 0.12)",
            p: 3,
            textAlign: "left",
            mb: 4,
          }}
        >
          <Typography variant="body2" color="rgba(0, 18, 25, 0.6)" mb={2}>
            Our representative has reviewed your request. Please fill in the proposed farm configuration below to proceed.
          </Typography>
        
          <Box component="form" noValidate autoComplete="off">
            <TextField
              fullWidth
              label="Racks"
              type="number"
              value={racks}
              onChange={(e) => setRacks(e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Shelves per Rack"
              type="number"
              value={shelves}
              onChange={(e) => setShelves(e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Channels per Shelf"
              type="number"
              value={channels}
              onChange={(e) => setChannels(e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Plugs per Channel"
              type="number"
              value={plugs}
              onChange={(e) => setPlugs(e.target.value)}
              margin="normal"
            />
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              fullWidth
              onClick={handleSubmit}
            >
              Submit Farm Details
            </Button>
          </Box>
        </Paper>
      )}
      {currentStatus === "PROPOSED FARM DETAILS" && farmDetails && (
        <Paper
          sx={{
            width: "26rem",
            borderRadius: 1,
            backgroundColor: "#f7f7f7",
            border: "1px solid rgba(0, 0, 0, 0.12)",
            p: 3,
            textAlign: "left",
            mb: 4,
          }}
        >
          <Typography variant="body2" color="rgba(0, 18, 25, 0.6)" mb={2}>
            Please review and confirm the farm configuration to proceed for subscription.
          </Typography>
      
          <Box component="form" noValidate autoComplete="off">
            <TextField
              fullWidth
              label="Farm Name"
              value={farmDetails.farm_name}
              disabled
              margin="normal"
            />
            <TextField
              fullWidth
              label="City"
              value={farmDetails.city}
              disabled
              margin="normal"
            />
            <TextField
              fullWidth
              label="State"
              value={farmDetails.state}
              disabled
              margin="normal"
            />
            <TextField
              fullWidth
              label="Country"
              value={farmDetails.country}
              disabled
              margin="normal"
            />
            <TextField
              fullWidth
              label="Racks"
              type="number"
              value={racks}
              onChange={(e) => setRacks(e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Shelves per Rack"
              type="number"
              value={shelves}
              onChange={(e) => setShelves(e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Channels per Shelf"
              type="number"
              value={channels}
              onChange={(e) => setChannels(e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Plugs per Channel"
              type="number"
              value={plugs}
              onChange={(e) => setPlugs(e.target.value)}
              margin="normal"
            />
      
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              fullWidth
              onClick={async () => {
                try {
                  const res = await api.put("/api/farm/update", {
                    farm_id: farm?.farm_id,
                    racks: parseInt(racks),
                    shelves_per_rack: parseInt(shelves),
                    channels_per_shelf: parseInt(channels),
                    plugs_per_channel: parseInt(plugs),
                    status: "PROPOSED SUBSCRIPTION DETAILS",
                  });
                  const updatedStatus = res.data.data.farm.status;
                  setFarmDetails(res.data.data.farm);
                  setCurrentStatus(updatedStatus);
      
                  setToastMessage("Farm details approved. Proceeding to Subscription Details.");
                  setToastOpen(true);
                  setToastSeverity("success");
                } catch (err) {
                  console.error("Update failed", err);
                  setToastMessage("Failed to approve farm configuration.");
                  setToastSeverity("error");
                  setToastOpen(true);
                }
              }}
            >
              Approve & Proceed
            </Button>
          </Box>
        </Paper>
      )}
      {currentStatus === "PROPOSED SUBSCRIPTION DETAILS" && (
        <Box
          sx={{
            width: "100%",
            maxWidth: 1100,
            mb: 4,
          }}
        >
          <PriceModelFarmxos
            onSubscribeSuccess={async () => {
              try {
                const res = await api.put("/api/farm/update", {
                  farm_id: farm?.farm_id,
                  status: "WORK IN PROGRESS",
                });
                const updatedStatus = res.data.data.farm.status;
                setCurrentStatus(updatedStatus);
                setToastMessage("Subscription successful. Farm setup will begin.");
                setToastSeverity("success");
                setToastOpen(true);
              } catch (err) {
                console.error("Status update failed", err);
                setToastMessage("Subscription succeeded but status update failed.");
                setToastSeverity("error");
                setToastOpen(true);
              }
            }}
          />
        </Box>
      )}
      {currentStatus === "WORK IN PROGRESS" && (
        <>
         <Paper
        sx={{
          width: "26rem",
          borderRadius: 1,
          backgroundColor: "#f7f7f7",
          border: "1px solid rgba(0, 0, 0, 0.12)",
          p: 3,
          textAlign: "left",
          mb: 4,
        }}
      >
        <Typography variant="body2" color="rgba(0, 18, 25, 0.6)">
            Your Farm setup is under progress , we will notify you when the setup is done.
        </Typography>
      </Paper> </>
      )}
      
      <Snackbar
        open={toastOpen}
        autoHideDuration={4000}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setToastOpen(false)}
          severity={toastSeverity}
          sx={{ width: "100%" }}
          variant="filled"
        >
          {toastMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Farmregisterprogress;
