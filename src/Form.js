import * as React from "react";
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
import api from "./data";
import dateNow from "./dateNow";

export default function Form() {
  const [busNumber, setBusNumber] = React.useState("");
  const [busRoute, setBusRoute] = React.useState("");
  const [station, setStation] = React.useState("");
  const [people, setPeople] = React.useState("");
  const [isDisabled, setIsDisabled] = React.useState(true);
  const [isErrorPeople, setIsErrorPeople] = React.useState(false);
  const data = api.bus_numbers;

  if (!data) {
    return <LinearProgress color="inherit" />;
  }

  const handleChangeBusNumber = (event) => {
    setBusNumber(event.target.value);
    setIsDisabled(false);
  };

  const handleChangeBusRoute = (event) => {
    setBusRoute(event.target.value);
  };

  const handleChangeStation = (event) => {
    setStation(event.target.value);
  };

  const handleChangePeople = (event) => {
    setPeople(event.target.value);
  };

  const handleSubmit = (event) => {
    if (!people) {
      setIsErrorPeople(true);
    } else {
      setIsErrorPeople(false);
    }

    // event.preventDefault();
    // fetch('/', {
    //  method: 'post',
    //  headers: {'Content-Type':'application/json'},
    //  body: {
    //   "bus_number": busNumber,
    //   "bus_route": busRoute,
    //   "station": station,
    //   "people": people,
    //   "date": dateNow
    //  }
    // });

    console.log(people);
    console.log(dateNow);
  };

  return (
    <Box sx={{ width: 1, maxWidth: 500 }}>
      <Typography variant="h3" gutterBottom align="center" m={[3, 5]}>
        Bus Sensus Brasov
      </Typography>
      <Typography variant="body1" align="justify" m={[2, 4]}>
        Choose the bus number, bus route and station and enter an aproximation
        of the no. of people in the bus, then hit submit.
      </Typography>
      <Box m={[2, 4]}>
        <Paper elevation={8} sx={{ mb: 3 }}>
          <FormControl fullWidth>
            <InputLabel id="bus-number-label">Bus number</InputLabel>
            <Select
              labelId="bus-number-label"
              id="bus-number"
              value={busNumber}
              label="Bus number"
              onChange={handleChangeBusNumber}
            >
              {data.map((item, i) => (
                <MenuItem key={i} value={item.bus_number}>
                  {item.bus_number}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Paper>
        <Paper elevation={8} sx={{ mb: 3 }}>
          <FormControl fullWidth>
            <InputLabel id="bus-route-label">Bus route</InputLabel>
            <Select
              disabled={isDisabled}
              labelId="bus-route-label"
              id="bus-route"
              value={busRoute}
              label="Bus route"
              onChange={handleChangeBusRoute}
            >
              {data
                .filter((item) => item.bus_number === busNumber)[0]
                ?.bus_routes.map((item, i) => (
                  <MenuItem key={i} value={item}>
                    {item}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Paper>
        <Paper elevation={8} sx={{ mb: 3 }}>
          <FormControl fullWidth>
            <InputLabel id="station-label">Station</InputLabel>
            <Select
              disabled={isDisabled}
              labelId="station-label"
              id="station"
              value={station}
              label="Station"
              onChange={handleChangeStation}
            >
              {data
                .filter((item) => item.bus_number === busNumber)[0]
                ?.stations.map((item, i) => (
                  <MenuItem key={i} value={item}>
                    {item}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Paper>
        <Paper elevation={8} sx={{ mb: 3 }}>
          <TextField
            error={isErrorPeople}
            required
            id="people"
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
          <Paper elevation={8} sx={{ width: 100 }}>
            <Button
              onClick={handleSubmit}
              variant="outlined"
              size="large"
              color="inherit"
              fullWidth
            >
              Submit
            </Button>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
