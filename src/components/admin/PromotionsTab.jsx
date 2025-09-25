import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { Tag, Trash2 } from 'lucide-react';

const PromotionsTab = ({ salonId, initialPromotions, services, onDataChange }) => {
  const { toast } = useToast();
  const [promotions, setPromotions] = useState(initialPromotions || []);
  const [newPromotion, setNewPromotion] = useState({ name: '', type: 'service', discount: '', target: '' });

  const handleAddNewPromotion = async () => {
    if (!newPromotion.name || !newPromotion.discount || !newPromotion.target) {
      toast({ title: "Error", description: "Completa todos los campos de la promoción.", variant: "destructive" });
      return;
    }
    const { data, error } = await supabase
      .from('promotions')
      .insert([{ ...newPromotion, salon_id: salonId, active: true }])
      .select()
      .single();

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setPromotions(prev => [...prev, data]);
      setNewPromotion({ name: '', type: 'service', discount: '', target: '' });
      toast({ title: "Éxito", description: "Promoción creada." });
      onDataChange();
    }
  };

  const handleDeletePromotion = async (promoId) => {
    const { error } = await supabase.from('promotions').delete().eq('id', promoId);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setPromotions(prev => prev.filter(p => p.id !== promoId));
      toast({ title: "Éxito", description: "Promoción eliminada." });
      onDataChange();
    }
  };

  return (
    <Card className="salon-card p-6">
      <h3 className="text-xl font-bold text-white mb-4">Gestionar Promociones</h3>
      <div className="space-y-3 mb-6">
        {promotions.map(promo => (
          <div key={promo.id} className="bg-white/5 p-3 rounded-lg border border-white/10">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-white font-semibold">{promo.name} ({promo.discount}%)</p>
                <p className="text-white/70 text-sm">
                  {promo.type === 'day' ? `Día: ${['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'][promo.target]}` : `Servicio: ${services.find(s => s.name === promo.target)?.name || promo.target}`}
                </p>
              </div>
              <Button onClick={() => handleDeletePromotion(promo.id)} size="icon" variant="ghost" className="text-red-400 hover:text-red-300"><Trash2 className="w-5 h-5" /></Button>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-white/10 space-y-4">
        <h4 className="text-lg font-semibold text-white">Crear Promoción</h4>
        <Input value={newPromotion.name} onChange={(e) => setNewPromotion(p => ({ ...p, name: e.target.value }))} placeholder="Nombre (ej: Martes Loco)" className="bg-white/10 border-white/20 text-white" />
        <div className="grid grid-cols-2 gap-4">
          <Input type="number" value={newPromotion.discount} onChange={(e) => setNewPromotion(p => ({ ...p, discount: e.target.value }))} placeholder="Descuento %" className="bg-white/10 border-white/20 text-white" />
          <Select onValueChange={(value) => setNewPromotion(p => ({ ...p, type: value, target: '' }))} value={newPromotion.type}>
            <SelectTrigger className="bg-white/10 border-white/20 text-white"><SelectValue placeholder="Tipo" /></SelectTrigger>
            <SelectContent><SelectItem value="service">Por Servicio</SelectItem><SelectItem value="day">Por Día</SelectItem></SelectContent>
          </Select>
        </div>
        {newPromotion.type === 'service' && (
          <Select onValueChange={(value) => setNewPromotion(p => ({ ...p, target: value }))}>
            <SelectTrigger className="bg-white/10 border-white/20 text-white"><SelectValue placeholder="Seleccionar servicio" /></SelectTrigger>
            <SelectContent>{services?.map(s => <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>)}</SelectContent>
          </Select>
        )}
        {newPromotion.type === 'day' && (
          <Select onValueChange={(value) => setNewPromotion(p => ({ ...p, target: value }))}>
            <SelectTrigger className="bg-white/10 border-white/20 text-white"><SelectValue placeholder="Seleccionar día" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Lunes</SelectItem><SelectItem value="2">Martes</SelectItem><SelectItem value="3">Miércoles</SelectItem>
              <SelectItem value="4">Jueves</SelectItem><SelectItem value="5">Viernes</SelectItem><SelectItem value="6">Sábado</SelectItem>
              <SelectItem value="0">Domingo</SelectItem>
            </SelectContent>
          </Select>
        )}
        <Button onClick={handleAddNewPromotion} variant="gradient" className="w-full"><Tag className="w-5 h-5 mr-2" />Crear</Button>
      </div>
    </Card>
  );
};

export default PromotionsTab;