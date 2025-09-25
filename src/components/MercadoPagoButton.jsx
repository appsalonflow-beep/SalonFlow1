import React from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Crown } from 'lucide-react';

const MercadoPagoButton = () => {
  const { toast } = useToast();

  const handleProPlanClick = () => {
    toast({
      title: "🚧 ¡Función en camino!",
      description: "La integración de pagos está casi lista. Puedes solicitarla en tu próximo prompt para que la implementemos de forma segura. 🚀",
      duration: 5000,
    });
  };

  return (
    <Button
      onClick={handleProPlanClick}
      className="w-full py-3 rounded-full font-semibold transition-all duration-300 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
    >
      <Crown className="w-5 h-5 mr-2" />
      Contratar Plan Pro
    </Button>
  );
};

export default MercadoPagoButton;