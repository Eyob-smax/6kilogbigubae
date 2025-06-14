import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Users, BookOpen, Fingerprint } from "lucide-react";

const Involvement = () => {
  const { t, i18n } = useTranslation();

  const activities = t("involvement.activities", { returnObjects: true }) as {
    name: string;
    amharic: string;
    description: string;
  }[];

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const childVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section
      id="involvement"
      className="section-container bg-liturgical-blue text-white"
    >
      <motion.h2
        className={`section-heading text-gold ${
          i18n.language === "am" ? "amharic" : ""
        }`}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {t("involvement.title")}
      </motion.h2>

      <div className="grid md:grid-cols-2 gap-8 md:gap-12">
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-start gap-4">
            <div className="bg-white/10 p-3 rounded-full text-gold mt-1">
              <Users size={24} />
            </div>
            <div>
              <h3
                className={`text-xl font-semibold mb-2 text-gold ${
                  i18n.language === "am" ? "amharic" : ""
                }`}
              >
                {i18n.language === "am" ? "ተሳትፎ" : "Participation"}
              </h3>
              <p className={`${i18n.language === "am" ? "amharic" : ""}`}>
                {t("involvement.participation")}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-white/10 p-3 rounded-full text-gold mt-1">
              <BookOpen size={24} />
            </div>
            <div>
              <h3
                className={`text-xl font-semibold mb-2 text-gold ${
                  i18n.language === "am" ? "amharic" : ""
                }`}
              >
                {i18n.language === "am" ? "ንስሐ" : "Confession"}
              </h3>
              <p className={`${i18n.language === "am" ? "amharic" : ""}`}>
                {t("involvement.confession")}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-white/10 p-3 rounded-full text-gold mt-1">
              <Fingerprint size={24} />
            </div>
            <div>
              <h3
                className={`text-xl font-semibold mb-2 text-gold ${
                  i18n.language === "am" ? "amharic" : ""
                }`}
              >
                {i18n.language === "am" ? "አማካሪዎች" : "Advisors"}
              </h3>
              <p className={`${i18n.language === "am" ? "amharic" : ""}`}>
                {t("involvement.advisors")}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="space-y-4"
          variants={staggerChildren}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h3
            className={`text-xl font-semibold mb-4 text-gold ${
              i18n.language === "am" ? "amharic" : ""
            }`}
          >
            {i18n.language === "am" ? "ሳምንታዊ እንቅስቃሴዎች" : "Weekly Activities"}
          </h3>

          {activities.map((activity, index) => (
            <motion.div
              key={index}
              className="bg-white/10 rounded-lg p-5 backdrop-blur-sm"
              variants={childVariant}
            >
              <h4 className="text-lg font-medium mb-1">{activity.name}</h4>

              <p className="text-gold mb-2 amharic">{activity.amharic}</p>

              <p className="text-sm text-white/80">{activity.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Involvement;
