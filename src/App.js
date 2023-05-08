import Form from "./Form";
import { Box, Typography } from "@mui/material";

function App() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Box sx={{ maxWidth: 500 }}>
        <Typography variant="h3" gutterBottom align="center" m={[3, 5]}>
          Bus Sensus Brasov
        </Typography>
        <Form />
      </Box>
    </Box>
  );
}

export default App;
