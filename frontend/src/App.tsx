import "./App.css";
import { Routes, Route } from "react-router-dom";
import CreateRoute from "./screens/Create";
import NewScreen from "./screens/New";
import { Box } from "@mui/material";

const App: React.FC = () => {
  return (
    <Box sx={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <Routes>
        <Route path="/" element={<NewScreen />} />
        <Route path="/create" element={<CreateRoute />} />
      </Routes>
    </Box>
  );
};

export default App;
