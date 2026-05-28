function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-orange-50 dark:bg-gray-950 border-t border-stone-200 dark:border-white/10 py-16 px-8 md:px-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">Andreas Wenra Alfa</div>
            <p className="text-stone-500 dark:text-gray-500 text-sm leading-relaxed max-w-xs">
              Software Developer with 13+ years of experience delivering
              enterprise web solutions across government, banking, and finance sectors.
            </p>
            <div className="flex gap-4 pt-2">
              {[
                { label: "LinkedIn", href: "https://linkedin.com/in/andreaswenra" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-stone-500 dark:text-gray-500 hover:text-teal-600 dark:hover:text-teal-400 text-sm transition-colors"
                >
                  {s.label} ↗
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-stone-900 dark:text-white font-semibold mb-5">Navigation</h4>
            <ul className="space-y-3">
              {["About", "Experience", "Projects", "Contact"].map((link) => (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase()}`}
                    className="text-stone-500 dark:text-gray-500 hover:text-teal-600 dark:hover:text-teal-400 transition-colors text-sm"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-stone-900 dark:text-white font-semibold mb-5">Connect</h4>
            <ul className="space-y-3">
              {[
                { label: "LinkedIn", href: "https://linkedin.com/in/andreaswenra" },
                { label: "Email", href: "mailto:andreaswenra@gmail.com" },
              ].map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-stone-500 dark:text-gray-500 hover:text-teal-600 dark:hover:text-teal-400 transition-colors text-sm"
                  >
                    {item.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
          <div className="border-t border-stone-200 dark:border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-stone-400 dark:text-gray-600">
          <span>© {year} Andreas Wenra Alfa Septiaji. All rights reserved.</span>
          <span>Built with React · TypeScript · Tailwind CSS</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
