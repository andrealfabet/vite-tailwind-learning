import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./component/Navbar";
import Hero from "./component/Hero";
import About from "./component/About";
import Experience from "./component/Experience";
import Projects from "./component/Projects";
import Contact from "./component/Contact";
import Footer from "./component/Footer";
import BackToTop from "./component/BackToTop";
import "./App.css";

function App() {
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

export default App;
