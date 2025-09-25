import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { 
  Calendar, Clock, User, Phone, Mail, Scissors, MapPin, CheckCircle, Lock, Users2, Tag, ArrowRight, X, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/customSupabaseClient';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const PromotionsModal = ({ promotions, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="salon-card p-8 rounded-2xl max-w-md w-full mx-4"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center"><Sparkles className="w-6 h-6 mr-3 text-yellow-400" />¡Promociones Disponibles!</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-white/70 hover:text-white"><X /></Button>
        </div>
        <div className="space-y-4">
          {promotions.map(promo => (
            <div key={promo.id} className="bg-white/10 p-4 rounded-lg border border-white/20">
              <h3 className="font-bold text-white text-lg">{promo.name}</h3>
              <p className="text-white/80">¡Obtén un <span className="text-yellow-400 font-bold">{promo.discount}% de descuento</span>!</p>
            </div>
          ))}
        </div>
        <Button onClick={onClose} variant="gradient" className="w-full mt-8">Entendido</Button>
      </motion.div>
    </motion.div>
  );
};

const BookingPage = () => {
  const { salonId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [salonData, setSalonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [isBlocked, setIsBlocked] = useState(false);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [bookingData, setBookingData] = useState({
    service: null,
    stylist_id: '',
    booking_date: '',
    booking_time: '',
    clientName: '',
    phone: '',
    email: '',
    notes: ''
  });
  const [finalPrice, setFinalPrice] = useState(0);
  const [appliedPromotion, setAppliedPromotion] = useState(null);
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [availablePromos, setAvailablePromos] = useState([]);

  const fetchSalonData = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('salons')
      .select(`*, services(*), stylists(*), promotions(*), bookings(*)`)
      .eq('id', salonId)
      .single();

    if (error || !data) {
      toast({ title: "Salón no encontrado", variant: "destructive" });
      navigate('/');
      return;
    }
    
    setSalonData(data);
    if (data.plan === 'free') {
      const createdAt = new Date(data.created_at);
      const diffDays = Math.ceil((new Date() - createdAt) / (1000 * 60 * 60 * 24));
      if (diffDays > 15) {
        setIsBlocked(true);
        toast({ title: "Prueba finalizada", description: "No se pueden realizar reservas.", variant: "destructive" });
      }
    }
    setLoading(false);
  }, [salonId, toast, navigate]);

  useEffect(() => {
    fetchSalonData();
  }, [fetchSalonData]);

  useEffect(() => {
    if (salonData && bookingData.booking_date && bookingData.stylist_id) {
      const slots = salonData.bookings
        ?.filter(b => b.booking_date === bookingData.booking_date && b.stylist_id === bookingData.stylist_id)
        .map(b => b.booking_time) || [];
      setBookedSlots(slots);
    }
  }, [bookingData.booking_date, bookingData.stylist_id, salonData]);

  const checkAndShowPromotions = useCallback((service, date) => {
    if (!salonData?.promotions) return;
    
    const servicePromo = salonData.promotions.find(p => p.type === 'service' && p.target === service.name && p.active);
    const dayPromo = salonData.promotions.find(p => p.type === 'day' && date && new Date(date).getUTCDay() === parseInt(p.target) && p.active);
    
    const promos = [servicePromo, dayPromo].filter(Boolean);
    
    if (promos.length > 0) {
      setAvailablePromos(promos);
      setShowPromoModal(true);
    }
  }, [salonData]);

  useEffect(() => {
    if (!bookingData.service) return;

    let price = parseFloat(bookingData.service.price);
    let promotion = null;

    const servicePromo = salonData.promotions?.find(p => p.type === 'service' && p.target === bookingData.service.name && p.active);
    const dayPromo = salonData.promotions?.find(p => p.type === 'day' && bookingData.booking_date && new Date(bookingData.booking_date).getUTCDay() === parseInt(p.target) && p.active);

    if (dayPromo) {
      promotion = dayPromo;
    } else if (servicePromo) {
      promotion = servicePromo;
    }

    if (promotion) {
      price = price - (price * (parseFloat(promotion.discount) / 100));
      setAppliedPromotion(promotion);
    } else {
      setAppliedPromotion(null);
    }

    setFinalPrice(price);
  }, [bookingData.service, bookingData.booking_date, salonData]);

  const handleServiceSelection = (service) => {
    setBookingData(prev => ({ ...prev, service }));
    checkAndShowPromotions(service, bookingData.booking_date);
    setStep(2);
  };

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setBookingData(prev => ({ ...prev, booking_date: newDate }));
    if (bookingData.service) {
      checkAndShowPromotions(bookingData.service, newDate);
    }
  };

  const generateTimeSlots = () => {
    const slots = [];
    if (!salonData?.open_time || !salonData?.close_time) return slots;
    const start = parseInt(salonData.open_time.split(':')[0]);
    const end = parseInt(salonData.close_time.split(':')[0]);
    for (let hour = start; hour < end; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    return slots;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!bookingData.service || !bookingData.stylist_id || !bookingData.booking_date || !bookingData.booking_time || !bookingData.clientName || !bookingData.phone) {
      toast({ title: "Error", description: "Por favor completa todos los campos.", variant: "destructive" });
      return;
    }

    setLoading(true);

    // Upsert client
    const { data: clientData, error: clientError } = await supabase
      .from('clients')
      .upsert({
        salon_id: salonId,
        name: bookingData.clientName,
        phone: bookingData.phone,
        email: bookingData.email,
        last_visit: new Date().toISOString(),
      }, { onConflict: 'salon_id, phone' })
      .select()
      .single();

    if (clientError) {
      toast({ title: "Error al guardar cliente", description: clientError.message, variant: "destructive" });
      setLoading(false);
      return;
    }

    // Insert booking
    const { error: bookingError } = await supabase
      .from('bookings')
      .insert({
        salon_id: salonId,
        client_id: clientData.id,
        service_id: bookingData.service.id,
        stylist_id: bookingData.stylist_id,
        booking_date: bookingData.booking_date,
        booking_time: bookingData.booking_time,
        final_price: finalPrice,
        promotion_id: appliedPromotion?.id,
        notes: bookingData.notes,
      });

    if (bookingError) {
      toast({ title: "Error al crear la reserva", description: bookingError.message, variant: "destructive" });
      setLoading(false);
      return;
    }

    setLoading(false);
    setStep(4);
    toast({ title: "¡Reserva confirmada!", description: "Tu cita ha sido agendada." });
  };

  if (loading && step === 1) {
    return <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div></div>;
  }

  if (isBlocked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <Card className="salon-card p-8 text-center max-w-md"><Lock className="w-16 h-16 mx-auto text-red-400 mb-4" /><h2 className="text-2xl font-bold text-white mb-4">Reservas No Disponibles</h2><p className="text-white/70">Este salón no acepta reservas online en este momento.</p></Card>
      </div>
    );
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Card className="salon-card p-8">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">1. Selecciona tu Servicio</h2>
            <div className="grid gap-4">
              {salonData.services?.map((service) => (
                <motion.div key={service.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => handleServiceSelection(service)} className="p-4 rounded-lg border border-purple-600/50 bg-purple-900/20 hover:bg-purple-900/30 cursor-pointer">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center"><Scissors className="w-6 h-6 text-purple-300 mr-4" /><div><h3 className="font-semibold text-white">{service.name}</h3><p className="text-white/70 text-sm">{service.duration} min</p></div></div>
                    <p className="font-bold text-white">${service.price}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        );
      case 2:
        return (
          <Card className="salon-card p-8">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">2. Elige Estilista, Fecha y Hora</h2>
            <div className="space-y-6">
              <div>
                <Label className="text-white font-medium mb-2 block"><Users2 className="inline w-4 h-4 mr-2" />Estilista</Label>
                <Select onValueChange={(value) => setBookingData(p => ({ ...p, stylist_id: value }))}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white"><SelectValue placeholder="Cualquier estilista" /></SelectTrigger>
                  <SelectContent>{salonData.stylists?.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              {bookingData.stylist_id && (
                <div>
                  <Label htmlFor="date" className="text-white font-medium mb-2 block"><Calendar className="inline w-4 h-4 mr-2" />Fecha</Label>
                  <Input id="date" name="date" type="date" value={bookingData.booking_date} onChange={handleDateChange} min={new Date().toISOString().split('T')[0]} className="bg-white/10 border-white/20 text-white" required />
                </div>
              )}
              {bookingData.booking_date && (
                <div>
                  <Label className="text-white font-medium mb-4 block"><Clock className="inline w-4 h-4 mr-2" />Hora</Label>
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                    {generateTimeSlots().map(time => {
                      const isBooked = bookedSlots.includes(time);
                      return <Button key={time} onClick={() => !isBooked && setBookingData(prev => ({ ...prev, booking_time: time }))} disabled={isBooked} className={`transition-all ${isBooked ? 'bg-red-500/50 text-white/50 cursor-not-allowed' : bookingData.booking_time === time ? 'bg-gradient-to-r from-green-600 to-teal-600 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}>{time}</Button>;
                    })}
                  </div>
                </div>
              )}
              {bookingData.booking_time && <Button onClick={() => setStep(3)} variant="gradient" className="w-full py-3">Continuar <ArrowRight className="w-4 h-4 ml-2" /></Button>}
            </div>
          </Card>
        );
      case 3:
        return (
          <Card className="salon-card p-8">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">3. Confirma tus Datos</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input id="clientName" name="clientName" value={bookingData.clientName} onChange={(e) => setBookingData(p => ({...p, clientName: e.target.value}))} placeholder="Nombre completo *" className="bg-white/10 border-white/20 text-white" required />
              <Input id="phone" name="phone" value={bookingData.phone} onChange={(e) => setBookingData(p => ({...p, phone: e.target.value}))} placeholder="Teléfono *" className="bg-white/10 border-white/20 text-white" required />
              <Input id="email" name="email" type="email" value={bookingData.email} onChange={(e) => setBookingData(p => ({...p, email: e.target.value}))} placeholder="Email (opcional)" className="bg-white/10 border-white/20 text-white" />
              
              <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                <h3 className="font-semibold text-white mb-3">Resumen de tu reserva:</h3>
                <div className="space-y-2 text-white/70">
                  <p><strong>Servicio:</strong> {bookingData.service.name}</p>
                  <p><strong>Estilista:</strong> {salonData.stylists.find(s => s.id === bookingData.stylist_id)?.name}</p>
                  <p><strong>Fecha:</strong> {new Date(bookingData.booking_date).toLocaleDateString('es-ES', {timeZone: 'UTC'})} a las {bookingData.booking_time}</p>
                  {appliedPromotion && <p className="text-green-400 flex items-center"><Tag className="w-4 h-4 mr-2" />Promo "{appliedPromotion.name}" aplicada (-{appliedPromotion.discount}%)</p>}
                  <p className="text-xl font-bold text-white pt-2"><strong>Total: ${finalPrice.toFixed(2)}</strong></p>
                </div>
              </div>

              <Button type="submit" variant="gradient" className="w-full py-3 text-lg font-semibold bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700" disabled={loading}><CheckCircle className="w-5 h-5 mr-2" />{loading ? 'Confirmando...' : 'Confirmar Reserva'}</Button>
            </form>
          </Card>
        );
      case 4:
        return (
          <Card className="salon-card p-8 text-center">
            <CheckCircle className="w-16 h-16 mx-auto text-green-400 mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">¡Reserva Confirmada!</h2>
            <p className="text-white/70 mb-6">Tu cita ha sido agendada. ¡Te esperamos!</p>
            <div className="bg-white/5 p-6 rounded-lg border border-white/10 text-left">
              <p><strong>Servicio:</strong> {bookingData.service.name}</p>
              <p><strong>Estilista:</strong> {salonData.stylists.find(s => s.id === bookingData.stylist_id)?.name}</p>
              <p><strong>Fecha:</strong> {new Date(bookingData.booking_date).toLocaleDateString('es-ES', {timeZone: 'UTC'})} a las {bookingData.booking_time}</p>
              <p className="text-xl font-bold text-white pt-2"><strong>Total: ${finalPrice.toFixed(2)}</strong></p>
            </div>
          </Card>
        );
      default: return null;
    }
  };

  return (
    <>
      <Helmet>
        <title>{`Reservar Cita - ${salonData?.name || 'SalonFlow'}`}</title>
        <meta name="description" content={`Reserva tu cita en ${salonData?.name}.`} />
      </Helmet>
      <AnimatePresence>
        {showPromoModal && <PromotionsModal promotions={availablePromos} onClose={() => setShowPromoModal(false)} />}
      </AnimatePresence>
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            {salonData && (
              <Card className="salon-card p-8 mb-8 text-center flex flex-col items-center">
                <Avatar className="w-24 h-24 border-2 border-purple-400 mb-4 shadow-lg">
                  <AvatarImage src={salonData.logo_url} alt={`${salonData.name} logo`} />
                  <AvatarFallback className="bg-white/10 text-purple-300 text-4xl">
                    {salonData.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <h1 className="text-3xl font-bold text-white mb-2">{salonData.name}</h1>
                <p className="text-white/70 mb-4">{salonData.description}</p>
              </Card>
            )}
            {renderStep()}
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default BookingPage;