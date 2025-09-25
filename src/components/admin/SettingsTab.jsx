import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { Save, Upload, Image as ImageIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const SettingsTab = ({ salonData, onDataChange }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: salonData.name || '',
    description: salonData.description || '',
    address: salonData.address || '',
    phone: salonData.phone || '',
    open_time: salonData.open_time || '09:00',
    close_time: salonData.close_time || '18:00',
  });
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(salonData.logo_url || '');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSaveChanges = async () => {
    setLoading(true);

    let logoUrl = salonData.logo_url;
    if (logoFile) {
      const filePath = `${salonData.id}/${Date.now()}-${logoFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from('logos')
        .upload(filePath, logoFile);

      if (uploadError) {
        toast({ title: "Error subiendo el logo", description: uploadError.message, variant: "destructive" });
        setLoading(false);
        return;
      }
      const { data: urlData } = supabase.storage.from('logos').getPublicUrl(filePath);
      logoUrl = urlData.publicUrl;
    }

    const { error } = await supabase
      .from('salons')
      .update({ ...formData, logo_url: logoUrl })
      .eq('id', salonData.id);

    if (error) {
      toast({ title: "Error", description: "No se pudieron guardar los cambios.", variant: "destructive" });
    } else {
      toast({ title: "Éxito", description: "La información de tu salón ha sido actualizada." });
      onDataChange();
    }
    setLoading(false);
  };

  return (
    <Card className="salon-card p-6">
      <h3 className="text-xl font-bold text-white mb-6">Configuración del Salón</h3>
      <div className="space-y-6">
        <div className="flex items-center gap-6">
          <Avatar className="w-24 h-24 border-2 border-purple-400">
            <AvatarImage src={logoPreview} alt="Logo preview" />
            <AvatarFallback className="bg-white/10 text-purple-300">
              <ImageIcon className="w-10 h-10" />
            </AvatarFallback>
          </Avatar>
          <div>
            <Label htmlFor="logo-upload-settings" className="text-white font-medium">
              Logo del Salón
            </Label>
            <p className="text-sm text-white/60 mb-2">Sube o cambia la imagen de tu salón.</p>
            <Button asChild variant="gradientOutline" size="sm">
              <label htmlFor="logo-upload-settings" className="cursor-pointer">
                <Upload className="w-4 h-4 mr-2" />
                Cambiar Imagen
              </label>
            </Button>
            <Input id="logo-upload-settings" type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
          </div>
        </div>

        <div>
          <Label htmlFor="name" className="text-white">Nombre del Salón</Label>
          <Input id="name" name="name" value={formData.name} onChange={handleInputChange} className="mt-2 bg-white/10 border-white/20 text-white" />
        </div>
        <div>
          <Label htmlFor="description" className="text-white">Descripción</Label>
          <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} className="mt-2 bg-white/10 border-white/20 text-white" />
        </div>
        <div>
          <Label htmlFor="address" className="text-white">Dirección</Label>
          <Input id="address" name="address" value={formData.address} onChange={handleInputChange} className="mt-2 bg-white/10 border-white/20 text-white" />
        </div>
        <div>
          <Label htmlFor="phone" className="text-white">Teléfono</Label>
          <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} className="mt-2 bg-white/10 border-white/20 text-white" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="open_time" className="text-white">Hora de Apertura</Label>
            <Input id="open_time" name="open_time" type="time" value={formData.open_time} onChange={handleInputChange} className="mt-2 bg-white/10 border-white/20 text-white" />
          </div>
          <div>
            <Label htmlFor="close_time" className="text-white">Hora de Cierre</Label>
            <Input id="close_time" name="close_time" type="time" value={formData.close_time} onChange={handleInputChange} className="mt-2 bg-white/10 border-white/20 text-white" />
          </div>
        </div>
        <Button onClick={handleSaveChanges} disabled={loading} variant="gradient" className="w-full">
          <Save className="w-4 h-4 mr-2" />
          {loading ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </div>
    </Card>
  );
};

export default SettingsTab;