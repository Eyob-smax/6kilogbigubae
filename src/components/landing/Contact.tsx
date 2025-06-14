import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { MapPin, Mail, Phone, User } from "lucide-react";

const Contact = () => {
  const { t, i18n } = useTranslation();

  return (
    <section id="contact" className="section-container holy-cross-bg">
      <motion.h2
        className={`section-heading text-liturgical-blue ${
          i18n.language === "am" ? "amharic" : ""
        }`}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {t("contact.title")}
      </motion.h2>

      <div className="grid md:grid-cols-2 gap-8">
        <motion.div
          className="bg-white rounded-lg shadow-md p-6 space-y-6"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h3
              className={`text-xl font-semibold mb-4 text-liturgical-blue flex items-center gap-2 ${
                i18n.language === "am" ? "amharic" : ""
              }`}
            >
              <MapPin size={20} className="text-gold" />
              {t("contact.location_title")}
            </h3>

            <p
              className={`text-gray-700 ${
                i18n.language === "am" ? "amharic" : ""
              }`}
            >
              {t("contact.location")}
            </p>
          </div>

          <div>
            <h3
              className={`text-xl font-semibold mb-4 text-liturgical-blue flex items-center gap-2 ${
                i18n.language === "am" ? "amharic" : ""
              }`}
            >
              <Mail size={20} className="text-gold" />
              {t("contact.email")}
            </h3>

            <p className="text-gray-700">
              <a
                href="mailto:contact@6kilogibi.org"
                className="hover:text-liturgical-blue transition-colors"
              >
                contact@6kilogibi.org
              </a>
            </p>
          </div>

          <div>
            <h3
              className={`text-xl font-semibold mb-4 text-liturgical-blue flex items-center gap-2 ${
                i18n.language === "am" ? "amharic" : ""
              }`}
            >
              <Phone size={20} className="text-gold" />
              {t("contact.phone")}
            </h3>

            <p className="text-gray-700">
              <a
                href="tel:+251912345678"
                className="hover:text-liturgical-blue transition-colors"
              >
                +251 91 234 5678
              </a>
            </p>
          </div>

          <div>
            <h3
              className={`text-xl font-semibold mb-4 text-liturgical-blue flex items-center gap-2 ${
                i18n.language === "am" ? "amharic" : ""
              }`}
            >
              <User size={20} className="text-gold" />
              {t("contact.admin")}
            </h3>

            <p className="text-gray-700">{t("contact.admin_contact")}</p>
          </div>
        </motion.div>

        <motion.div
          className="h-96 rounded-lg shadow-md overflow-hidden"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Placeholder for a map - would be replaced with actual map */}
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <div className="text-center p-4">
              <MapPin size={48} className="mx-auto text-liturgical-blue mb-4" />
              <h3
                className={`text-xl font-semibold mb-2 ${
                  i18n.language === "am" ? "amharic" : ""
                }`}
              >
                {i18n.language === "am" ? "አድራሻችን" : "Our Location"}
              </h3>
              <p className={`${i18n.language === "am" ? "amharic" : ""}`}>
                {i18n.language === "am"
                  ? "አዲስ አበባ ዩኒቨርሲቲ፣ ፮ኪሎ ግቢ፣ ሕንፃ 12"
                  : "Addis Ababa University, 6 Kilo Campus, Building 12"}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
