import { motion } from "framer-motion";

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
    <div className="bg-background-light text-surface-body overflow-hidden">

      {/* ================= HERO SECTION ================= */}
      <section className="relative min-h-screen flex items-center justify-center px-6 text-center bg-gradient-to-br from-primary-dark via-primary to-primary-light">
        <div className="absolute inset-0 bg-black/20"></div>

        <div className="relative z-10 max-w-4xl text-white animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Building Trust.
            <span className="block text-accent-glow">
              Empowering Lives.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">
            We connect verified individuals in medical and hardship situations
            with compassionate donors worldwide — securely, transparently, and ethically.
          </p>
        </div>
      </section>

      {/* ================= MISSION SECTION ================= */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">

          {/* Image */}
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

          {/* Text */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl font-bold mb-6 text-surface-heading">
              Our Mission
            </h2>
            <p className="mb-4">
              Our platform was built to solve a fundamental problem in online
              donations: lack of trust. We ensure every beneficiary is verified
              before receiving public support.
            </p>
            <p>
              Through secure authentication, document validation, and AI-powered
              fraud detection, we create a safe ecosystem where generosity meets
              accountability.
            </p>
          </motion.div>

        </div>
      </section>

      {/* ================= VALUES SECTION ================= */}
      <section className="py-24 bg-gray-50 px-6">
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
          <p className="max-w-2xl mx-auto">
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
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="bg-white rounded-2xl p-8 shadow-glass hover:shadow-glow-purple transition-shadow duration-300"
            >
              <h3 className="text-xl font-semibold mb-4 text-primary">
                {item.title}
              </h3>
              <p>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="py-24 px-6">
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
            <ul className="space-y-4">
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
              src="https://images.unsplash.com/photo-1588776814546-ec7e9b1e4fdf"
              alt="Security and trust"
              className="rounded-2xl shadow-glass hover:scale-105 transition duration-700"
            />
          </motion.div>

        </div>
      </section>

      {/* ================= CALL TO ACTION ================= */}
      <section className="py-24 text-center bg-gradient-to-r from-primary to-primary-light text-white">
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
          <p className="mb-8">
            Whether you need help or want to help others, our platform ensures
            every donation is protected and every story is authentic.
          </p>
          <button className="px-8 py-3 bg-white text-primary font-semibold rounded-full hover:scale-105 transition duration-300 shadow-md">
            Get Started
          </button>
        </motion.div>
      </section>

    </div>
  );
}
