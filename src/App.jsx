import Header from "./components/Header";
import FrontPages from "./pages/FrontPages";
import Footer from "./components/Footer";
import "./index.css";
import { Route, Routes } from "react-router-dom";
import StatisticsPage from "./pages/StatisticsPage";
function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path='/' element={<FrontPages />} />
        <Route path='/' element={<StatisticsPage />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
