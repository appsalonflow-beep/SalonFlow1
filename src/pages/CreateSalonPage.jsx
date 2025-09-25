import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ArrowLeft, Scissors, MapPin, Phone, Mail, Clock, User, Lock, Image as ImageIcon, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const CreateSalonPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signUp } = useAuth();
  const [loading, setLoading] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
    email: '',
    openTime: '09:00',
    closeTime: '18:00',
    password: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.address || !formData.phone || !formData.email || !formData.password) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos obligatorios",
        variant: "destructive"
      });
      return;
    }
    setLoading(true);

    try {
      const { error: signUpError, data: signUpData } = await signUp(formData.email, formData.password);

if (signUpError || !signUpData.user) {
  throw signUpError || new Error("No se pudo crear el usuario.");
}

// Iniciar sesión para que auth.uid() funcione
await supabase.auth.signInWithPassword({
  email: formData.email,
  password: formData.password
});

const { data: salon, error: salonInsertError } = await supabase
  .from('salons')
  .insert([{ 
    name: formData.name,
    description: formData.description,
    address: formData.address,
    phone: formData.phone,
    email: formData.email,
    open_time: formData.openTime,
    close_time: formData.closeTime,
  }])
  .select()
  .single();


      if (salonInsertError) {
        throw salonInsertError;
      }

      if (logoFile) {
        const filePath = `${salon.id}/${Date.now()}-${logoFile.name}`;
        const { error: uploadError } = await supabase.storage
          .from('logos')
          .upload(filePath, logoFile);

        if (uploadError) {
          toast({ title: "Advertencia", description: `El salón se creó, pero hubo un error subiendo el logo: ${uploadError.message}`, variant: "destructive" });
        } else {
          const { data: urlData } = supabase.storage.from('logos').getPublicUrl(filePath);
          await supabase.from('salons').update({ logo_url: urlData.publicUrl }).eq('id', salon.id);
        }
      }

      toast({
        title: "¡Salón creado exitosamente!",
        description: `Tu salón ${formData.name} está listo. Revisa tu email para confirmar tu cuenta.`
      });
      navigate('/login');

    } catch (error) {
      toast({
        title: "Error al crear el salón",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Crear Salón - SalonFlow</title>
        <meta name="description" content="Crea tu salón de belleza en SalonFlow y comienza a gestionar reservas online." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Button
              onClick={() => navigate('/')}
              variant="gradientOutline"
              className="mb-8"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al inicio
            </Button>

            <div className="salon-card p-8 rounded-2xl">
              <div className="text-center mb-8">
                <div className="text-purple-300 mb-4 flex justify-center">
                  <Scissors className="w-12 h-12" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Crear Tu Salón
                </h1>
                <p className="text-white/70">
                  Configura tu salón y comienza a recibir reservas
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <h2 className="text-xl font-semibold text-white border-b border-white/20 pb-2">Datos del Salón</h2>
                
                <div className="flex items-center gap-6">
                  <Avatar className="w-24 h-24 border-2 border-purple-400">
                    <AvatarImage src={logoPreview} alt="Logo preview" />
                    <AvatarFallback className="bg-white/10 text-purple-300">
                      <ImageIcon className="w-10 h-10" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Label htmlFor="logo-upload" className="text-white font-medium">
                      Logo del Salón
                    </Label>
                    <p className="text-sm text-white/60 mb-2">Sube una imagen para tu salón.</p>
                    <Button asChild variant="gradientOutline" size="sm">
                      <label htmlFor="logo-upload" className="cursor-pointer">
                        <Upload className="w-4 h-4 mr-2" />
                        Subir Imagen
                      </label>
                    </Button>
                    <Input id="logo-upload" type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="name" className="text-white font-medium">
                    Nombre del Salón *
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Ej: Bella Vista Salon"
                    className="mt-2 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="text-white font-medium">
                    Descripción
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe tu salón y servicios..."
                    className="mt-2 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="address" className="text-white font-medium">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Dirección *
                  </Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Calle Principal 123, Ciudad"
                    className="mt-2 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="text-white font-medium">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Teléfono *
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+34 123 456 789"
                    className="mt-2 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="openTime" className="text-white font-medium">
                      <Clock className="w-4 h-4 inline mr-1" />
                      Hora de Apertura
                    </Label>
                    <Input
                      id="openTime"
                      name="openTime"
                      type="time"
                      value={formData.openTime}
                      onChange={handleInputChange}
                      className="mt-2 bg-white/10 border-white/20 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="closeTime" className="text-white font-medium">
                      <Clock className="w-4 h-4 inline mr-1" />
                      Hora de Cierre
                    </Label>
                    <Input
                      id="closeTime"
                      name="closeTime"
                      type="time"
                      value={formData.closeTime}
                      onChange={handleInputChange}
                      className="mt-2 bg-white/10 border-white/20 text-white"
                    />
                  </div>
                </div>

                <h2 className="text-xl font-semibold text-white border-b border-white/20 pb-2 pt-4">Credenciales de Acceso</h2>
                
                <div>
                  <Label htmlFor="email" className="text-white font-medium">
                    <Mail className="w-4 h-4 inline mr-1" />
                    Email de Acceso *
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="tu-email@ejemplo.com"
                    className="mt-2 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="password" className="text-white font-medium">
                    <Lock className="w-4 h-4 inline mr-1" />
                    Contraseña *
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="mt-2 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    required
                  />
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    variant="gradient"
                    className="w-full py-3 rounded-full font-semibold text-lg"
                    disabled={loading}
                  >
                    {loading ? 'Creando...' : <><Scissors className="w-5 h-5 mr-2" />Crear Mi Salón</>}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default CreateSalonPage;