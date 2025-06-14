import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Users, Book, Mic, Heart, Check } from 'lucide-react';

const Structure = () => {
  const { t, i18n } = useTranslation();
  
  const groups = t('structure.groups', { returnObjects: true }) as {
    name: string;
    amharic: string;
    description: string;
  }[];
  
  const responsibilities = t('structure.responsibilities', { returnObjects: true }) as string[];
  
  const groupIcons = [Users, Book, Mic, Heart];
  
  return (
    <section id="structure" className="section-container holy-cross-bg">
      <motion.h2 
        className={`section-heading text-liturgical-blue ${i18n.language === 'am' ? 'amharic' : ''}`}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {t('structure.title')}
      </motion.h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {groups.map((group, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <div className="w-16 h-16 rounded-full bg-liturgical-blue/10 flex items-center justify-center text-liturgical-blue mb-4">
                  {React.createElement(groupIcons[index % groupIcons.length], { size: 28 })}
                </div>
                
                <h3 className="text-lg font-semibold text-liturgical-blue mb-1">
                  {group.name}
                </h3>
                
                <p className={`text-gold font-medium mb-3 amharic`}>
                  {group.amharic}
                </p>
                
                <p className="text-sm text-gray-600">
                  {group.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
        
        <motion.div
          className="bg-white rounded-lg shadow-md p-6"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h3 className={`text-xl font-semibold mb-4 text-liturgical-blue ${i18n.language === 'am' ? 'amharic' : ''}`}>
            {i18n.language === 'am' ? 'ኃላፊነቶች' : 'Responsibilities'}
          </h3>
          
          <ul className="space-y-3">
            {responsibilities.map((responsibility, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="mt-1 text-gold">
                  <Check size={18} />
                </div>
                <span className={`${i18n.language === 'am' ? 'amharic' : ''}`}>
                  {responsibility}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
};

export default Structure;