import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { UserPlus, Trash2 } from 'lucide-react';

const StylistsTab = ({ salonId, initialStylists, onDataChange }) => {
  const { toast } = useToast();
  const [stylists, setStylists] = useState(initialStylists || []);
  const [newStylist, setNewStylist] = useState('');

  const handleAddNewStylist = async () => {
    if (newStylist.trim() === '') return;
    const { data, error } = await supabase
      .from('stylists')
      .insert([{ name: newStylist.trim(), salon_id: salonId }])
      .select()
      .single();

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setStylists(prev => [...prev, data]);
      setNewStylist('');
      toast({ title: "Éxito", description: "Estilista agregado." });
      onDataChange();
    }
  };

  const handleDeleteStylist = async (stylistId) => {
    const { error } = await supabase.from('stylists').delete().eq('id', stylistId);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setStylists(prev => prev.filter(s => s.id !== stylistId));
      toast({ title: "Éxito", description: "Estilista eliminado." });
      onDataChange();
    }
  };

  return (
    <Card className="salon-card p-6">
      <h3 className="text-xl font-bold text-white mb-4">Gestionar Estilistas</h3>
      <div className="space-y-3 mb-6">
        {stylists.map(stylist => (
          <div key={stylist.id} className="bg-white/5 p-3 rounded-lg border border-white/10 flex justify-between items-center">
            <span className="text-white">{stylist.name}</span>
            <Button onClick={() => handleDeleteStylist(stylist.id)} size="icon" variant="ghost" className="text-red-400 hover:text-red-300"><Trash2 className="w-5 h-5" /></Button>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <Input value={newStylist} onChange={(e) => setNewStylist(e.target.value)} placeholder="Nombre del estilista" className="bg-white/10 border-white/20 text-white" />
        <Button onClick={handleAddNewStylist} variant="gradient"><UserPlus className="w-5 h-5 mr-2" />Agregar</Button>
      </div>
    </Card>
  );
};

export default StylistsTab;