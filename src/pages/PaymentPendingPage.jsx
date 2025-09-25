import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Clock, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PaymentPendingPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Pago Pendiente - SalonFlow</title>
        <meta name="description" content="Tu pago está siendo procesado." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center py-8">
        <div className="container mx-auto px-4 max-w-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="salon-card p-8 rounded-2xl text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            >
              <Clock className="w-20 h-20 text-yellow-400 mx-auto mb-6" />
            </motion.div>
            
            <h1 className="text-3xl font-bold text-white mb-4">
              Pago Pendiente
            </h1>
            
            <p className="text-white/80 mb-8">
              Tu pago está siendo procesado. Te notificaremos una vez que se complete. Esto puede tardar unos minutos.
            </p>

            <Button
              onClick={() => navigate('/')}
              variant="gradient"
              className="w-full py-3 rounded-full font-semibold text-lg"
            >
              <Home className="w-5 h-5 mr-2" />
              Volver al Inicio
            </Button>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default PaymentPendingPage;