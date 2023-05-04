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
  const [busRoute, setBusRoute] = useState("");
  const [station, setStation] = useState("");
  const [people, setPeople] = useState("");
  const [isDisabledRoute, setIsDisabledRoute] = useState(true);
  const [isDisabledStation, setIsDisabledStation] = useState(true);
  const [isErrorPeople, setIsErrorPeople] = useState(false);
  const [data, setData] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3003/busses");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setData(data);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchData();
  }, []);

  if (error) {
    return (
      <Typography variant="h5" color="red" align="center" m={[3, 5]}>
        Error: {error}
      </Typography>
    );
  }

  if (!data.length) {
    return (
      <Box sx={{ width: 1 }}>
        <LinearProgress color="inherit" />
      </Box>
    );
  }

  const handleChangeBusNumber = (event) => {
    setBusNumber(event.target.value);
    setIsDisabledRoute(false);
    setBusRoute("");
    setStation("");
    setIsDisabledStation(true);
  };

  const handleChangeBusRoute = (event) => {
    setBusRoute(event.target.value);
    setIsDisabledStation(false);
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

    fetch("http://localhost:3003/people", {
      method: "POST",
      body: JSON.stringify({
        bus_number: busNumber,
        bus_route: busRoute,
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
              {data.map((item, i) => (
                <MenuItem key={i} value={item.id}>
                  {item.id}
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
              value={busRoute}
              label="Bus route"
              onChange={handleChangeBusRoute}
            >
              {data
                .filter((item) => item.id === busNumber)[0]
                ?.bus_routes.map((item, i) => (
                  <MenuItem key={i} value={item}>
                    {item}
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
              {data
                .filter(
                  (item) =>
                    item.bus_routes[0] === busRoute ||
                    item.bus_routes[1] === busRoute
                )[0]
                ?.stations.map((item, i) => (
                  <MenuItem key={i} value={item}>
                    {item}
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
              disabled={
                busNumber && busRoute && station && people ? false : true
              }
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
