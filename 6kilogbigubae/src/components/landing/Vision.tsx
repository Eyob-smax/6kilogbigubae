import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

const Vision = () => {
  const { t, i18n } = useTranslation();
  
  const quotes = t('vision.quotes', { returnObjects: true }) as { quote: string; author: string }[];
  
  return (
    <section id="vision" className="section-container bg-liturgical-blue text-white">
      <motion.h2 
        className={`section-heading text-gold ${i18n.language === 'am' ? 'amharic' : ''}`}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {t('vision.title')}
      </motion.h2>
      
      <div className="grid md:grid-cols-2 gap-8 md:gap-12">
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="p-6 rounded-lg bg-white/10 backdrop-blur-sm">
            <h3 className={`text-xl font-semibold mb-3 text-gold ${i18n.language === 'am' ? 'amharic' : ''}`}>
              {i18n.language === 'am' ? 'ራዕያችን' : 'Our Vision'}
            </h3>
            <p className={`text-lg leading-relaxed ${i18n.language === 'am' ? 'amharic' : ''}`}>
              {t('vision.vision_statement')}
            </p>
          </div>
          
          <div className="p-6 rounded-lg bg-white/10 backdrop-blur-sm">
            <h3 className={`text-xl font-semibold mb-3 text-gold ${i18n.language === 'am' ? 'amharic' : ''}`}>
              {i18n.language === 'am' ? 'ተልዕኮአችን' : 'Our Mission'}
            </h3>
            <p className={`text-lg leading-relaxed ${i18n.language === 'am' ? 'amharic' : ''}`}>
              {t('vision.mission_statement')}
            </p>
          </div>
        </motion.div>
        
        <div className="space-y-6">
          {quotes.map((quote, index) => (
            <motion.div
              key={index}
              className="p-6 rounded-lg bg-white/10 backdrop-blur-sm relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
            >
              <Quote className="absolute top-6 right-6 text-gold/30" size={24} />
              
              <p className={`text-lg mb-4 italic ${i18n.language === 'am' ? 'amharic' : ''}`}>
                "{quote.quote}"
              </p>
              
              <p className={`text-right text-gold font-medium ${i18n.language === 'am' ? 'amharic' : ''}`}>
                — {quote.author}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Vision;