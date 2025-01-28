import { Container, CssBaseline, ThemeProvider } from "@mui/material";
import { Route, Routes } from 'react-router-dom';
import HomePage from "./containers/HomePage";
import { theme } from "./ThemeProvider";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <header></header>
      <main>
        <Container maxWidth='xl'>
          <Routes>
            <Route path="/" element={<HomePage/>}/>
          </Routes>
        </Container>
      </main>
    </ThemeProvider>
   
  );
}

export default App;
