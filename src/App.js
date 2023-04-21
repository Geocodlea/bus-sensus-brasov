import "./App.css";
import Form from "./Form";
import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";

function App() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box sx={{ width: 1, maxWidth: 500 }}>
        <Typography variant="h3" gutterBottom align="center" m={[3, 5]}>
          Bus Sensus Brasov
        </Typography>
        <Typography variant="body1" align="justify" m={[2, 4]}>
          Choose the bus number, bus route and station and enter an aproximation
          of the no. of people in the bus, then hit submit.
        </Typography>
        <Form />
      </Box>
    </Box>
  );
}

export default App;
