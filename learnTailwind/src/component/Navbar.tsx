import { useState, useEffect } from "react";
import ThemeToggle from "./ThemeToggle";
import DownloadCvButton from "./DownloadCvButton";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const linkClass =
    "text-stone-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors duration-200 text-sm font-medium";

  return (
    <nav
      className={`sticky top-0 left-0 w-full bg-amber-50/80 dark:bg-black/80 backdrop-blur-md border-b border-stone-200 dark:border-white/10 z-50 transition-all duration-300 ${
        scrolled ? "py-3" : "py-4"
      }`}
    >
      <div className="w-full px-8 md:px-12 flex items-center justify-between">

        {/* Logo */}
        <a
          href="#hero"
          className="text-xl font-bold text-teal-600 dark:text-teal-400 tracking-tight hover:text-teal-500 dark:hover:text-teal-300 transition-colors"
        >
          Andreas Wenra Alfa
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a key={link.label} href={link.href} className={linkClass}>
              {link.label}
            </a>
          ))}
          <ThemeToggle />
          <DownloadCvButton />
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-400 hover:text-teal-400 transition-colors text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle Menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden px-8 py-6 flex flex-col gap-5 bg-amber-50 dark:bg-black border-t border-stone-200 dark:border-white/10">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={linkClass}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <DownloadCvButton
            label="↓ Download CV"
            className="w-fit flex items-center gap-1.5 px-4 py-2 border border-teal-500/40 text-teal-600 dark:text-teal-400 text-sm font-medium rounded-lg hover:bg-teal-500/10 hover:border-teal-500 transition-all duration-200 disabled:opacity-50"
          />
          <a
            href="#contact"
            className="w-fit px-4 py-2 bg-teal-500 hover:bg-teal-400 text-black text-sm font-semibold rounded-lg transition-all duration-200"
            onClick={() => setMenuOpen(false)}
          >
            Hire Me
          </a>
        </div>
      )}
    </nav>
  );
}

export default Navbar;