import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { BookOpen, Heart, Users, Calendar } from "lucide-react";

const About = () => {
  const { t, i18n } = useTranslation();

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.1 * i,
        duration: 0.5,
      },
    }),
  };

  const goalItems = t("about.goals_list", { returnObjects: true }) as string[];
  return (
    <section id="about" className="section-container parchment-bg">
      <motion.h2
        className={`section-heading text-liturgical-blue ${
          i18n.language === "am" ? "amharic" : ""
        }`}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {t("about.title")}
      </motion.h2>

      <div className="grid md:grid-cols-2 gap-8 md:gap-12">
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p
            className={`text-lg leading-relaxed ${
              i18n.language === "am" ? "amharic" : ""
            }`}
          >
            {t("about.history")}
          </p>

          <p
            className={`text-lg leading-relaxed ${
              i18n.language === "am" ? "amharic" : ""
            }`}
          >
            {t("about.tradition")}
          </p>
        </motion.div>

        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3
            className={`text-xl font-semibold mb-4 text-liturgical-blue ${
              i18n.language === "am" ? "amharic" : ""
            }`}
          >
            {t("about.goals")}
          </h3>

          <ul className="space-y-4">
            {goalItems.map((goal, index) => (
              <motion.li
                key={goal}
                className="flex items-start gap-3"
                custom={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
              >
                <div className="mt-1 text-gold">
                  {React.createElement(
                    [BookOpen, Heart, Users, Calendar][index % 4],
                    { size: 20 }
                  )}
                </div>
                <span className={`${i18n.language === "am" ? "amharic" : ""}`}>
                  {goal}
                </span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
