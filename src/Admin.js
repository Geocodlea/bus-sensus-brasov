import * as React from "react";
import { useState, useEffect } from "react";
import {
  Box,
  InputLabel,
  Paper,
  Select,
  FormControl,
  MenuItem,
  LinearProgress,
  Typography,
} from "@mui/material";
import Chart from "./Chart";

export default function Admin() {
  const [reports, setReports] = useState([]);
  const [busNumber, setBusNumber] = useState("");
  const [route, setRoute] = useState("");
  const [station, setStation] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch("http://localhost:8080/bussensus/reports");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const reports = await response.json();
        setReports(reports);
        setLoading(false);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchReports();
  }, []);

  if (error) {
    return (
      <Typography variant="h5" color="#d32f2f" align="center" m={[3, 5]}>
        Error: {error}
      </Typography>
    );
  }

  if (loading) {
    return (
      <Box sx={{ width: 1 }}>
        <LinearProgress color="inherit" />
      </Box>
    );
  }

  const handleChangeBusNumber = async (event) => {
    setBusNumber(event.target.value);
    setRoute("");
    setStation("");
  };

  const handleChangeRoute = async (event) => {
    setRoute(event.target.value);
    setStation("");
  };

  const handleChangeStation = (event) => {
    setStation(event.target.value);
  };

  return (
    <>
      <Typography variant="body1" align="justify" m={[2, 4]}>
        Choose the bus number, bus route and station to get an average of the
        no. of passengers in that bus on that station by hours.
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
          maxWidth: 400,
          margin: "0 auto 30px auto",
        }}
      >
        <Paper elevation={8}>
          <FormControl fullWidth>
            <InputLabel id="bus-number-label">Bus number</InputLabel>
            <Select
              labelId="bus-number-label"
              value={busNumber}
              label="Bus number"
              onChange={handleChangeBusNumber}
            >
              {Object.values(
                reports.reduce((acc, report) => {
                  if (!acc[report.busId]) {
                    acc[report.busId] = report;
                  }
                  return acc;
                }, {})
              ).map((item) => (
                <MenuItem key={item.reportId} value={item.busId}>
                  {item.busName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Paper>
        <Paper elevation={8}>
          <FormControl fullWidth>
            <InputLabel id="bus-route-label">Bus route</InputLabel>
            <Select
              disabled={!busNumber}
              labelId="bus-route-label"
              value={route}
              label="Bus route"
              onChange={handleChangeRoute}
            >
              {Object.values(
                reports
                  .filter((item) => item.busId === busNumber)
                  .reduce((acc, report) => {
                    if (!acc[report.routeId]) {
                      acc[report.routeId] = report;
                    }
                    return acc;
                  }, {})
              ).map((item) => (
                <MenuItem key={item.reportId} value={item.routeId}>
                  {item.routeName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Paper>
        <Paper elevation={8}>
          <FormControl fullWidth>
            <InputLabel id="station-label">Station</InputLabel>
            <Select
              disabled={!busNumber || !route}
              labelId="station-label"
              value={station}
              label="Station"
              onChange={handleChangeStation}
            >
              {Object.values(
                reports
                  .filter((item) => item.routeId === route)
                  .reduce((acc, report) => {
                    if (!acc[report.stationId]) {
                      acc[report.stationId] = report;
                    }
                    return acc;
                  }, {})
              ).map((item) => (
                <MenuItem key={item.reportId} value={item.stationId}>
                  {item.stationName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Paper>
      </Box>
      {busNumber && route && station && (
        <Chart
          reports={reports}
          busNumber={busNumber}
          route={route}
          station={station}
        />
      )}
    </>
  );
}
