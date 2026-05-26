function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-950 border-t border-white/10 py-16 px-8 md:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="text-2xl font-bold text-teal-400">Fajar</div>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              Full Stack Developer building clean, performant, and
              user-friendly web experiences.
            </p>
            <div className="flex gap-4 pt-2">
              {[
                { label: "GitHub", href: "https://github.com" },
                { label: "LinkedIn", href: "https://linkedin.com" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-gray-500 hover:text-teal-400 text-sm transition-colors"
                >
                  {s.label} ↗
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white font-semibold mb-5">Navigation</h4>
            <ul className="space-y-3">
              {["About", "Experience", "Projects", "Contact"].map((link) => (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase()}`}
                    className="text-gray-500 hover:text-teal-400 transition-colors text-sm"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-white font-semibold mb-5">Connect</h4>
            <ul className="space-y-3">
              {[
                { label: "GitHub", href: "https://github.com" },
                { label: "LinkedIn", href: "https://linkedin.com" },
                { label: "Email", href: "mailto:fajar@email.com" },
              ].map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-gray-500 hover:text-teal-400 transition-colors text-sm"
                  >
                    {item.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-600">
          <span>© {year} Fajar. All rights reserved.</span>
          <span>Built with React · TypeScript · Tailwind CSS</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
