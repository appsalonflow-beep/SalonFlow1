import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { XCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PaymentFailurePage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Pago Fallido - SalonFlow</title>
        <meta name="description" content="Hubo un problema al procesar tu pago." />
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
              <XCircle className="w-20 h-20 text-red-400 mx-auto mb-6" />
            </motion.div>
            
            <h1 className="text-3xl font-bold text-white mb-4">
              Pago Fallido
            </h1>
            
            <p className="text-white/80 mb-8">
              Lo sentimos, no pudimos procesar tu pago. Por favor, verifica tus datos e inténtalo de nuevo.
            </p>

            <Button
              onClick={() => navigate('/')}
              variant="gradient"
              className="w-full py-3 rounded-full font-semibold text-lg"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Intentar de Nuevo
            </Button>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default PaymentFailurePage;