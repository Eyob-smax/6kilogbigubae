import { motion } from 'framer-motion';
import { Cross } from 'lucide-react';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-liturgical-blue/90 flex flex-col items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          duration: 0.5,
          repeat: Infinity,
          repeatType: "reverse" 
        }}
        className="text-gold"
      >
        <Cross size={48} />
      </motion.div>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-4 text-parchment font-medium text-xl"
      >
        Loading...
      </motion.p>
    </div>
  );
};

export default LoadingScreen;