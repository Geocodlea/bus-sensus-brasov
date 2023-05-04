import * as React from "react";
import { useState, useEffect } from "react";
import {
  Box,
  InputLabel,
  Button,
  TextField,
  Paper,
  Select,
  FormControl,
  MenuItem,
  LinearProgress,
  Typography,
} from "@mui/material";
import dateNow from "./dateNow";

export default function Form() {
  const [busNumber, setBusNumber] = useState("");
  const [route, setRoute] = useState("");
  const [station, setStation] = useState("");
  const [people, setPeople] = useState("");
  const [isDisabledRoute, setIsDisabledRoute] = useState(true);
  const [isDisabledStation, setIsDisabledStation] = useState(true);
  const [isErrorPeople, setIsErrorPeople] = useState(false);
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [stations, setStations] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBuses = async () => {
      try {
        const response = await fetch("http://localhost:3003/buses");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const buses = await response.json();
        setBuses(buses);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchBuses();
  }, []);

  if (error) {
    return (
      <Typography variant="h5" color="red" align="center" m={[3, 5]}>
        Error: {error}
      </Typography>
    );
  }

  if (!buses.length) {
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

    try {
      const fetchRoutes = await fetch(
        `http://localhost:3003/buses/${event.target.value}/routes`
      );
      if (!fetchRoutes.ok) {
        throw new Error("Network response was not ok");
      }
      const routes = await fetchRoutes.json();
      setRoutes(routes);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleChangeRoute = async (event) => {
    setRoute(event.target.value);
    setStation("");
    setIsDisabledStation(false);

    try {
      const fetchStations = await fetch(
        `http://localhost:3003/routes/${event.target.value}/stations`
      );
      if (!fetchStations.ok) {
        throw new Error("Network response was not ok");
      }
      const stations = await fetchStations.json();
      setStations(stations);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleChangeStation = (event) => {
    setStation(event.target.value);
  };

  const handleChangePeople = (event) => {
    setPeople(event.target.value);
  };

  const handleSubmit = (event) => {
    setIsErrorPeople(!people);

    event.preventDefault();

    fetch("http://localhost:3003/reports", {
      method: "POST",
      body: JSON.stringify({
        bus_number: busNumber,
        bus_route: route,
        station: station,
        people: people,
        date: dateNow,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((json) => console.log(json));
  };

  return (
    <Box sx={{ maxWidth: 500 }}>
      <Typography variant="h3" gutterBottom align="center" m={[3, 5]}>
        Bus Sensus Brasov
      </Typography>
      <Typography variant="body1" align="justify" m={[2, 4]}>
        Choose the bus number, bus route and station and enter an aproximation
        of the no. of people in the bus, then hit submit.
      </Typography>
      <Box m={3} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <Paper elevation={8}>
          <FormControl fullWidth>
            <InputLabel id="bus-number-label">Bus number</InputLabel>
            <Select
              labelId="bus-number-label"
              value={busNumber}
              label="Bus number"
              onChange={handleChangeBusNumber}
            >
              {buses.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.busNumber}
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
              {routes &&
                routes.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.route}
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
              {stations &&
                stations.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.station}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Paper>
        <Paper elevation={8}>
          <TextField
            error={isErrorPeople}
            required
            label="No. of people in the bus"
            type="number"
            value={people}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={handleChangePeople}
            fullWidth
          />
        </Paper>
        <Box align="right">
          <Paper elevation={8} sx={{ width: "fit-content" }}>
            <Button
              disabled={busNumber && route && station && people ? false : true}
              onClick={handleSubmit}
              variant="outlined"
              size="large"
              color="inherit"
            >
              Submit
            </Button>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
