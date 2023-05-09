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
  const [report, setReport] = useState([]);
  const [busNumber, setBusNumber] = useState("");
  const [route, setRoute] = useState("");
  const [station, setStation] = useState("");
  const [isDisabledRoute, setIsDisabledRoute] = useState(true);
  const [isDisabledStation, setIsDisabledStation] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await fetch("http://localhost:8080/bussensus/reports");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const report = await response.json();

        const fetchBuses = await fetch("http://localhost:8080/bussensus/buses");
        const buses = await fetchBuses.json();

        const fetchRoutes = await fetch(
          `http://localhost:8080/bussensus/routes`
        );
        const routes = await fetchRoutes.json();

        const fetchStations = await fetch(
          `http://localhost:8080/bussensus/stations`
        );
        const stations = await fetchStations.json();

        const reportWithNames = report.map((report) => {
          const bus = buses.find((bus) => bus.busId === report.busId);
          const route = routes.find(
            (route) => route.routeId === report.routeId
          );
          const station = stations.find(
            (station) => station.stationId === report.stationId
          );

          return {
            ...report,
            busName: bus ? bus.name : "",
            routeName: route ? route.name : "",
            stationName: station ? station.name : "",
          };
        });

        setReport(reportWithNames);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchReport();
  }, []);

  if (error) {
    return (
      <Typography variant="h5" color="#d32f2f" align="center" m={[3, 5]}>
        Error: {error}
      </Typography>
    );
  }

  if (!report.length) {
    return (
      <Box sx={{ width: 1 }}>
        <LinearProgress color="inherit" />
      </Box>
    );
  }

  const handleChangeBusNumber = async (event) => {
    setBusNumber(event.target.value);
    setRoute("");
    setIsDisabledRoute(false);
    setStation("");
    setIsDisabledStation(true);
  };

  const handleChangeRoute = async (event) => {
    setRoute(event.target.value);
    setStation("");
    setIsDisabledStation(false);
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
                report.reduce((acc, report) => {
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
              disabled={isDisabledRoute}
              labelId="bus-route-label"
              value={route}
              label="Bus route"
              onChange={handleChangeRoute}
            >
              {Object.values(
                report
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
              disabled={isDisabledStation}
              labelId="station-label"
              value={station}
              label="Station"
              onChange={handleChangeStation}
            >
              {Object.values(
                report
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
          report={report}
          busNumber={busNumber}
          route={route}
          station={station}
        />
      )}
    </>
  );
}
