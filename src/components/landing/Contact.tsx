import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { MapPin, Mail, Phone, User } from "lucide-react";
import { Facebook, Youtube } from "react-feather";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete (
  L.Icon.Default.prototype as typeof L.Icon.Default.prototype & {
    _getIconUrl: unknown;
  }
)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const Contact = () => {
  const { t, i18n } = useTranslation();

  const position: [number, number] = [9.044837, 38.759845];

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
              {i18n.language === "am"
                ? "አዲስ አበባ 6 ኪሎ | ቅዱስ ማርቆስ ቤተ-ክርስቲያን በስተጀርባ"
                : "Addis Ababa 6 Kilo | St. Mark's Cathedral Behind"}
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
                kilogbigubae@gmail.com
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
                +251 96 909 1028
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
            <p className="text-gray-700">+251 951 21 911</p>
          </div>

          <div>
            <h3
              className={`text-xl font-semibold mb-4 text-liturgical-blue flex items-center gap-2 ${
                i18n.language === "am" ? "amharic" : ""
              }`}
            >
              <Facebook size={20} className="text-gold" />
              Social media
            </h3>
            <p className="text-gray-700">
              <a target="_blank" href="https://youtube.com/@6kilogbigubae">
                <Youtube className="text-red-500 mr-2" />
                <span>SidistKiloGibiGubae</span>
              </a>
            </p>
          </div>
        </motion.div>

        <motion.div
          className="h-96 rounded-lg shadow-md overflow-hidden"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <MapContainer
            center={position}
            zoom={16}
            scrollWheelZoom={true}
            className="w-full h-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position}>
              <Popup>
                {i18n.language === "am"
                  ? "አዲስ አበባ 6 ኪሎ | ቅዱስ ማርቆስ ቤተ-ክርስቲያን በስተጀርባ"
                  : "Addis Ababa 6 Kilo | St. Mark's Cathedral Behind"}
              </Popup>
            </Marker>
          </MapContainer>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
