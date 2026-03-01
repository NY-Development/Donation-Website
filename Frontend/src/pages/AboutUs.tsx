import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

export default function AboutUs() {
  return (
    <div className="bg-background text-surface-body overflow-hidden transition-colors duration-500">

      {/* ================= HERO SECTION ================= */}
      <section
        className="relative min-h-screen flex items-center justify-center px-6 text-center text-surface-heading"
        style={{ backgroundImage: "var(--background-image-primary-gradient)" }}
      >
        <div className="absolute inset-0 bg-black/20 dark:bg-black/40 transition-colors duration-500"></div>

        <div className="relative z-10 max-w-4xl animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Building Trust.
            <span className="block text-accent-glow">
              Empowering Lives.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-white max-w-2xl mx-auto">
            We connect verified individuals in medical and hardship situations
            with compassionate donors worldwide — securely, transparently, and ethically.
          </p>
        </div>
      </section>

      {/* ================= MISSION SECTION ================= */}
      <section className="py-24 px-6 bg-background transition-colors duration-500">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeInUp}
          >
            <img
              src="https://images.unsplash.com/photo-1573497491208-6b1acb260507"
              alt="Helping hands"
              className="rounded-2xl shadow-glass hover:scale-105 transition duration-700"
            />
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl font-bold mb-6 text-surface-heading">
              Our Mission
            </h2>
            <p className="mb-4 text-surface-body">
              Our platform was built to solve a fundamental problem in online
              donations: lack of trust. We ensure every beneficiary is verified
              before receiving public support.
            </p>
            <p className="text-surface-body">
              Through secure authentication, document validation, and AI-powered
              fraud detection, we create a safe ecosystem where generosity meets
              accountability.
            </p>
          </motion.div>

        </div>
      </section>

      {/* ================= VALUES SECTION ================= */}
      <section className="py-24 bg-background-light dark:bg-[#181028] px-6 transition-colors duration-500">
        <motion.div
          className="max-w-6xl mx-auto text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInUp}
        >
          <h2 className="text-3xl font-bold text-surface-heading mb-4">
            Our Core Values
          </h2>
          <p className="max-w-2xl mx-auto text-surface-body">
            We believe technology should protect generosity — not exploit it.
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Security",
              desc: "Advanced encryption and verification systems protect both donors and beneficiaries.",
            },
            {
              title: "Transparency",
              desc: "Clear tracking, real-time updates, and responsible fund handling.",
            },
            {
              title: "Compassion",
              desc: "We prioritize human dignity, especially in health-related and hardship cases.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeInUp}
              whileHover={{ y: -8 }}
              className="bg-background dark:border border-purple-400 rounded-2xl p-8 shadow-glass hover:shadow-glow-purple transition-all duration-300"
            >
              <h3 className="text-xl font-semibold mb-4 text-primary">
                {item.title}
              </h3>
              <p className="text-surface-body">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="py-24 px-6 bg-background transition-colors duration-500">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl font-bold mb-6 text-surface-heading">
              How We Keep Donors Safe
            </h2>
            <ul className="space-y-4 text-surface-body">
              <li>✔ Identity verification for beneficiaries</li>
              <li>✔ Medical document validation</li>
              <li>✔ AI-based fraud detection</li>
              <li>✔ Secure payment processing</li>
              <li>✔ Transparent campaign tracking</li>
            </ul>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeInUp}
          >
            <img
              src="https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=2070&auto=format&fit=crop"
              alt="Security and trust"
              className="rounded-2xl shadow-glass hover:scale-105 transition duration-700"
            />
          </motion.div>

        </div>
      </section>

      {/* ================= CALL TO ACTION ================= */}
      <section
        className="py-24 text-center px-6 text-surface-heading"
        style={{ backgroundImage: "var(--background-image-primary-gradient)" }}
      >
        <motion.div
          className="max-w-3xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInUp}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Join a Global Community of Verified Giving
          </h2>
          <p className="mb-8 text-surface-body">
            Whether you need help or want to help others, our platform ensures
            every donation is protected and every story is authentic.
          </p>
          <Link
            to="/explore"
            className="px-8 py-3 bg-background text-primary font-semibold rounded-full hover:scale-105 transition duration-300 shadow-md shadow-primary/30"
          >
            Get Started
          </Link>
        </motion.div>
      </section>

    </div>
  );
}