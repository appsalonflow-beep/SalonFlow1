import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PaymentSuccessPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Pago Exitoso - SalonFlow</title>
        <meta name="description" content="Tu pago para el Plan Pro ha sido procesado exitosamente." />
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
              <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-6" />
            </motion.div>
            
            <h1 className="text-3xl font-bold text-white mb-4">
              ¡Pago Exitoso!
            </h1>
            
            <p className="text-white/80 mb-8">
              ¡Felicitaciones! Has activado el Plan Pro. Ahora tienes acceso a todas las funciones premium de SalonFlow.
            </p>

            <Button
              onClick={() => navigate('/create-salon')}
              variant="gradient"
              className="w-full py-3 rounded-full font-semibold text-lg"
            >
              Crear mi Salón Pro
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default PaymentSuccessPage;