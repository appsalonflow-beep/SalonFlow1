import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { Plus, Trash2, Edit, Save, X, Scissors } from 'lucide-react';

const ServicesTab = ({ salonId, initialServices, onDataChange }) => {
  const { toast } = useToast();
  const [services, setServices] = useState(initialServices || []);
  const [newService, setNewService] = useState({ name: '', price: '', duration: '' });
  const [editingService, setEditingService] = useState(null);

  const handleAddNewService = async () => {
    if (!newService.name || !newService.price || !newService.duration) {
      toast({ title: "Error", description: "Completa todos los campos del servicio.", variant: "destructive" });
      return;
    }
    const { data, error } = await supabase
      .from('services')
      .insert([{ ...newService, salon_id: salonId }])
      .select()
      .single();

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setServices(prev => [...prev, data]);
      setNewService({ name: '', price: '', duration: '' });
      toast({ title: "Éxito", description: "Nuevo servicio agregado." });
      onDataChange();
    }
  };

  const handleDeleteService = async (serviceId) => {
    const { error } = await supabase.from('services').delete().eq('id', serviceId);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setServices(prev => prev.filter(s => s.id !== serviceId));
      toast({ title: "Éxito", description: "Servicio eliminado." });
      onDataChange();
    }
  };

  const handleUpdateService = async () => {
    if (!editingService.name || !editingService.price || !editingService.duration) {
      toast({ title: "Error", description: "Completa todos los campos del servicio.", variant: "destructive" });
      return;
    }
    const { data, error } = await supabase
      .from('services')
      .update({ name: editingService.name, price: editingService.price, duration: editingService.duration })
      .eq('id', editingService.id)
      .select()
      .single();

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setServices(prev => prev.map(s => s.id === data.id ? data : s));
      setEditingService(null);
      toast({ title: "Éxito", description: "Servicio actualizado." });
      onDataChange();
    }
  };

  return (
    <Card className="salon-card p-6">
      <h3 className="text-xl font-bold text-white mb-4">Gestionar Servicios</h3>
      <div className="space-y-4">
        {services.map((service) => (
          <div key={service.id} className="bg-white/5 p-4 rounded-lg border border-white/10">
            {editingService?.id === service.id ? (
              <div className="space-y-2">
                <Input value={editingService.name} onChange={(e) => setEditingService(prev => ({ ...prev, name: e.target.value }))} className="bg-white/10 border-white/20 text-white" />
                <div className="flex gap-2">
                  <Input type="number" placeholder="Precio" value={editingService.price} onChange={(e) => setEditingService(prev => ({ ...prev, price: e.target.value }))} className="bg-white/10 border-white/20 text-white" />
                  <Input type="number" placeholder="Duración (min)" value={editingService.duration} onChange={(e) => setEditingService(prev => ({ ...prev, duration: e.target.value }))} className="bg-white/10 border-white/20 text-white" />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleUpdateService} size="icon" variant="ghost" className="text-green-400 hover:text-green-300"><Save className="w-5 h-5" /></Button>
                  <Button onClick={() => setEditingService(null)} size="icon" variant="ghost" className="text-red-400 hover:text-red-300"><X className="w-5 h-5" /></Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Scissors className="w-5 h-5 text-purple-300 mr-3" />
                  <div>
                    <span className="text-white font-medium">{service.name}</span>
                    <p className="text-white/70 text-sm">${service.price} - {service.duration} min</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button onClick={() => setEditingService(service)} size="icon" variant="ghost" className="text-yellow-400 hover:text-yellow-300"><Edit className="w-5 h-5" /></Button>
                  <Button onClick={() => handleDeleteService(service.id)} size="icon" variant="ghost" className="text-red-400 hover:text-red-300"><Trash2 className="w-5 h-5" /></Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-6 space-y-3 p-4 border-t border-white/10">
        <h4 className="text-lg font-semibold text-white">Agregar Nuevo Servicio</h4>
        <Input value={newService.name} onChange={(e) => setNewService(prev => ({ ...prev, name: e.target.value }))} placeholder="Nombre del servicio" className="bg-white/10 border-white/20 text-white" />
        <div className="flex gap-2">
          <Input type="number" value={newService.price} onChange={(e) => setNewService(prev => ({ ...prev, price: e.target.value }))} placeholder="Precio" className="bg-white/10 border-white/20 text-white" />
          <Input type="number" value={newService.duration} onChange={(e) => setNewService(prev => ({ ...prev, duration: e.target.value }))} placeholder="Duración (min)" className="bg-white/10 border-white/20 text-white" />
        </div>
        <Button onClick={handleAddNewService} variant="gradient" className="w-full"><Plus className="w-5 h-5 mr-2" />Agregar</Button>
      </div>
    </Card>
  );
};

export default ServicesTab;