import { Box, Typography } from "@mui/material";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Form from "./Form";
import Admin from "./Admin";

function App() {
  return (
    <BrowserRouter>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box sx={{ maxWidth: 700, width: 1 }}>
          <Typography variant="h3" gutterBottom align="center" m={[3, 5]}>
            Bus Sensus Brasov
          </Typography>
          <Routes>
            <Route exact path="/" element={<Form />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </Box>
      </Box>
    </BrowserRouter>
  );
}

export default App;
