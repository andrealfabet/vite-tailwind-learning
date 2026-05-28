import { useState } from "react";

const contactInfo = [
  {
    icon: "📧",
    label: "Email",
    value: "andreaswenra@gmail.com",
    href: "mailto:andreaswenra@gmail.com",
  },
  {
    icon: "📞",
    label: "Phone",
    value: "+62 822 1627 8089",
    href: "tel:+6282216278089",
  },
  {
    icon: "💼",
    label: "LinkedIn",
    value: "linkedin.com/in/andreaswenra",
    href: "https://linkedin.com/in/andreaswenra",
  },
];

function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const to = "andreaswenra@gmail.com";
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    const sub = encodeURIComponent(subject || "Message from Portfolio");
    const mailtoLink = `mailto:${to}?subject=${sub}&body=${body}`;
    globalThis.location.href = mailtoLink;
  };

  return (
    <section id="contact" className="py-24 bg-amber-50 dark:bg-black px-8 md:px-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <span className="text-teal-600 dark:text-teal-400 text-sm font-semibold uppercase tracking-widest">
            Contact
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-stone-900 dark:text-white">
            Let's work together
          </h2>
          <p className="text-stone-500 dark:text-gray-400 text-center">
            Have a project in mind or want to chat? I'd love to hear from you.
            Send me a message and I'll get back to you as soon as possible.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-16 items-start max-w-5xl mx-auto">
          {/* Left: Contact info */}
          <div className="space-y-4">
            {contactInfo.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-5 bg-white dark:bg-gray-950 border border-stone-200 dark:border-white/10 rounded-2xl hover:border-teal-500/30 hover:shadow-lg hover:shadow-teal-500/5 transition-all duration-300 group"
              >
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <div className="text-xs text-stone-400 dark:text-gray-500 uppercase tracking-widest mb-0.5">
                    {item.label}
                  </div>
                  <div className="text-stone-700 dark:text-gray-300 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                    {item.value}
                  </div>
                </div>
              </a>
            ))}

            {/* Availability badge */}
            <div className="mt-6 p-5 bg-teal-500/10 border border-teal-500/20 rounded-2xl">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 bg-teal-400 rounded-full animate-pulse" />
                <span className="text-teal-400 font-medium text-sm">
                  Open to new opportunities — based in Bandung, Indonesia
                </span>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                maxLength={100}
                autoComplete="name"
                className="col-span-2 sm:col-span-1 bg-white dark:bg-gray-950 border border-stone-200 dark:border-white/10 text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-gray-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-teal-500/50 transition-colors"
              />
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                maxLength={254}
                autoComplete="email"
                className="col-span-2 sm:col-span-1 bg-white dark:bg-gray-950 border border-stone-200 dark:border-white/10 text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-gray-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-teal-500/50 transition-colors"
              />
            </div>
            <input
              type="text"
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              maxLength={150}
              className="w-full bg-white dark:bg-gray-950 border border-stone-200 dark:border-white/10 text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-gray-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-teal-500/50 transition-colors"
            />
            <textarea
              rows={5}
              placeholder="Your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              maxLength={2000}
              className="w-full bg-white dark:bg-gray-950 border border-stone-200 dark:border-white/10 text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-gray-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-teal-500/50 transition-colors resize-none"
            />
            <button
              type="submit"
              className="w-full py-3.5 bg-teal-500 hover:bg-teal-400 text-black font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/25"
            >
              Send Message →
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Contact;
