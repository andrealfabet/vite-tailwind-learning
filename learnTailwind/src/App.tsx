import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./component/Navbar";
import Hero from "./component/Hero";
import About from "./component/About";
import Experience from "./component/Experience";
import Projects from "./component/Projects";
import Contact from "./component/Contact";
import Footer from "./component/Footer";
import BackToTop from "./component/BackToTop";
import Maps from "./pages/Maps";
import "./App.css";

function Portfolio() {
  return (
    <ThemeProvider>
      <Navbar />
      <Hero />
      <About />
      <Experience />
      <Projects />
      <Contact />
      <Footer />
      <BackToTop />
    </ThemeProvider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route path="/maps" element={<Maps />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
