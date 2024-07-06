import Header from "./components/Header";
import FrontPages from "./pages/FrontPages";
import Footer from "./components/Footer";
import "./index.css";
function App() {
  return (
    <div style={{ overflow: "hidden", backgroundColor: "#a89984" }}>
      <Header />
      <FrontPages />
      <Footer />
    </div>
  );
}

export default App;
