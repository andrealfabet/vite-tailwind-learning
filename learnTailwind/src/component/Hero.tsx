import profileImg from "../assets/Photo.webp";

function Hero() {
  return (
    <section
      id="hero"
      className="min-h-screen bg-amber-50 dark:bg-black flex items-center px-8 md:px-16 py-24 transition-colors duration-300"
    >
      <div className="max-w-7xl w-full mx-auto grid md:grid-cols-2 gap-16 items-center">
        {/* Left: Text */}
        <div className="space-y-6">
          <h1 className="text-5xl md:text-7xl font-bold text-stone-900 dark:text-white leading-tight">
            Hi, I'm{" "}
            <span className="text-teal-400">Andreas</span>
          </h1>

          <p className="text-xl text-stone-600 dark:text-gray-400 leading-relaxed">
            Software developer with 13+ years of experience building enterprise web applications and government digital platforms. Skilled in .NET ecosystems, CMS technologies, and modern web frameworks — driven by a passion for problem-solving and delivering reliable, high-impact software.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <a
              href="#projects"
              className="px-6 py-3 bg-teal-500 hover:bg-teal-400 text-black font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/25"
            >
              View Projects →
            </a>
            <a
              href="#contact"
              className="px-6 py-3 border border-stone-300 dark:border-white/20 hover:border-teal-500/50 text-stone-800 dark:text-white rounded-lg transition-all duration-300 hover:bg-stone-100 dark:hover:bg-white/5"
            >
              Contact Me
            </a>
          </div>

          {/* Quick stats */}
          <div className="flex gap-8 pt-4 border-t border-stone-200 dark:border-white/10">
            {[
              { value: "13+", label: "Years Exp." },
              { value: "15+", label: "Projects" },
              { value: "5+", label: "Companies" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-bold text-teal-400">{stat.value}</div>
                <div className="text-gray-600 dark:text-gray-500 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Profile Visual */}
        <div className="flex justify-center">
          <div className="relative">
            {/* Profile photo */}
            <div className="w-72 h-72 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-teal-500/40 shadow-2xl shadow-teal-500/20 ring-4 ring-teal-500/10">
              <img
                src={profileImg}
                alt="Andreas"
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
