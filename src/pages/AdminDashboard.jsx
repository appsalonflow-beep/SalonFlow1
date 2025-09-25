import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { 
  Crown, Clock, Phone, MapPin, Copy, ExternalLink, LogOut, Lock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import BookingsTab from '@/components/admin/BookingsTab';
import ClientsTab from '@/components/admin/ClientsTab';
import ServicesTab from '@/components/admin/ServicesTab';
import StylistsTab from '@/components/admin/StylistsTab';
import PromotionsTab from '@/components/admin/PromotionsTab';
import SettingsTab from '@/components/admin/SettingsTab';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const [salonData, setSalonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isTrialExpired, setIsTrialExpired] = useState(false);
  const [daysLeft, setDaysLeft] = useState(0);

  const fetchSalonData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('salons')
      .select(`
        *,
        services (*),
        stylists (*),
        promotions (*),
        clients (*),
        bookings (*)
      `)
      .eq('user_id', user.id)
      .single();

    if (error) {
      toast({ title: "Error", description: "No se pudo cargar la información del salón.", variant: "destructive" });
      console.error(error);
      setLoading(false);
      return;
    }
    
    setSalonData(data);

    if (data.plan === 'free') {
      const createdAt = new Date(data.created_at);
      const now = new Date();
      const diffTime = now - createdAt;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays > 15) {
        setIsTrialExpired(true);
      } else {
        setDaysLeft(15 - diffDays);
      }
    }
    setLoading(false);
  }, [user, toast]);

  useEffect(() => {
    fetchSalonData();
  }, [fetchSalonData]);

  const handleLogout = async () => {
    await signOut();
    toast({ title: "Sesión cerrada", description: "Has cerrado sesión correctamente." });
    navigate('/login');
  };

  const bookingLink = salonData ? `${window.location.origin}/book/${salonData.id}` : '';

  const copyLink = () => {
    navigator.clipboard.writeText(bookingLink);
    toast({ title: "¡Link copiado!", description: "El enlace de reservas ha sido copiado al portapapeles" });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Cargando panel de control...</p>
        </div>
      </div>
    );
  }

  if (isTrialExpired) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="salon-card p-8 rounded-2xl text-center max-w-md mx-4">
          <Lock className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-white mb-4">Tu prueba gratuita ha terminado</h1>
          <p className="text-white/80 mb-8">Actualiza al Plan Pro para seguir gestionando tu salón.</p>
          <Button onClick={() => toast({ title: "🚧 ¡Función en camino!" })} className="w-full py-3 rounded-full font-semibold text-lg bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white">
            <Crown className="w-5 h-5 mr-2" /> Actualizar a Plan Pro
          </Button>
          <Button onClick={handleLogout} variant="gradientOutline" className="mt-4 w-full">Cerrar Sesión</Button>
        </motion.div>
      </div>
    );
  }

  if (!salonData) {
     return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-center">
          <p>No se encontró información del salón. Por favor, intenta de nuevo.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`Panel Admin - ${salonData.name} | SalonFlow`}</title>
        <meta name="description" content={`Panel administrativo para ${salonData.name}.`} />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="container mx-auto px-4 py-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${salonData.plan === 'pro' ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white' : 'bg-white/20 text-white'}`}>
                  {salonData.plan === 'pro' ? <><Crown className="w-4 h-4 inline mr-1" />Plan Pro</> : 'Plan Gratis'}
                </div>
                {salonData.plan === 'free' && <div className="text-white/70 text-sm"><Clock className="w-4 h-4 inline mr-1" />Te quedan {daysLeft} días</div>}
              </div>
              <Button onClick={handleLogout} variant="gradientOutline" className="text-white hover:bg-purple-900/20"><LogOut className="w-4 h-4 mr-2" />Cerrar Sesión</Button>
            </div>

            <Card className="salon-card p-8 rounded-2xl mb-8">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <Avatar className="w-20 h-20 border-2 border-purple-400">
                    <AvatarImage src={salonData.logo_url} alt={`${salonData.name} logo`} />
                    <AvatarFallback className="bg-white/10 text-purple-300 text-3xl">
                      {salonData.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-2">{salonData.name}</h1>
                    <div className="space-y-2 text-white/70">
                      <p className="flex items-center"><MapPin className="w-4 h-4 mr-2" />{salonData.address}</p>
                      <p className="flex items-center"><Phone className="w-4 h-4 mr-2" />{salonData.phone}</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <Button onClick={copyLink} variant="gradient"><Copy className="w-4 h-4 mr-2" />Copiar Link</Button>
                  <Button onClick={() => window.open(bookingLink, '_blank')} variant="gradientOutline"><ExternalLink className="w-4 h-4 mr-2" />Ver Página</Button>
                </div>
              </div>
            </Card>

            <Tabs defaultValue="bookings" className="space-y-6">
              <TabsList className="bg-white/10 border-white/20 grid grid-cols-2 md:grid-cols-6">
                <TabsTrigger value="bookings" className="text-white data-[state=active]:bg-white/20">Reservas</TabsTrigger>
                <TabsTrigger value="clients" className="text-white data-[state=active]:bg-white/20">Clientes</TabsTrigger>
                <TabsTrigger value="services" className="text-white data-[state=active]:bg-white/20">Servicios</TabsTrigger>
                <TabsTrigger value="stylists" className="text-white data-[state=active]:bg-white/20">Estilistas</TabsTrigger>
                <TabsTrigger value="promotions" className="text-white data-[state=active]:bg-white/20">Promociones</TabsTrigger>
                <TabsTrigger value="settings" className="text-white data-[state=active]:bg-white/20">Configuración</TabsTrigger>
              </TabsList>

              <TabsContent value="bookings"><BookingsTab salonData={salonData} /></TabsContent>
              <TabsContent value="clients"><ClientsTab salonData={salonData} /></TabsContent>
              <TabsContent value="services"><ServicesTab salonId={salonData.id} initialServices={salonData.services} onDataChange={fetchSalonData} /></TabsContent>
              <TabsContent value="stylists"><StylistsTab salonId={salonData.id} initialStylists={salonData.stylists} onDataChange={fetchSalonData} /></TabsContent>
              <TabsContent value="promotions"><PromotionsTab salonId={salonData.id} initialPromotions={salonData.promotions} services={salonData.services} onDataChange={fetchSalonData} /></TabsContent>
              <TabsContent value="settings"><SettingsTab salonData={salonData} onDataChange={fetchSalonData} /></TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;