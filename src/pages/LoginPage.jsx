import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ArrowLeft, Mail, Lock, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(credentials.email, credentials.password);
    if (!error) {
      toast({
        title: "¡Inicio de sesión exitoso!",
        description: `Bienvenido de nuevo.`
      });
      navigate('/admin');
    }
    setLoading(false);
  };

  return (
    <>
      <Helmet>
        <title>Iniciar Sesión - SalonFlow</title>
        <meta name="description" content="Accede a tu panel de administración de SalonFlow." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center py-8">
        <div className="container mx-auto px-4 max-w-md">
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
                  <LogIn className="w-12 h-12" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Panel Admin
                </h1>
                <p className="text-white/70">
                  Inicia sesión para gestionar tu salón
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="email" className="text-white font-medium">
                    <Mail className="w-4 h-4 inline mr-1" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={credentials.email}
                    onChange={handleInputChange}
                    placeholder="tu-email@ejemplo.com"
                    className="mt-2 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="password" className="text-white font-medium">
                    <Lock className="w-4 h-4 inline mr-1" />
                    Contraseña
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={credentials.password}
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
                    {loading ? 'Iniciando...' : <><LogIn className="w-5 h-5 mr-2" />Iniciar Sesión</>}
                  </Button>
                </div>
              </form>
              
              <p className="text-center text-white/60 mt-6 text-sm">
                ¿No tienes una cuenta?{' '}
                <span 
                  onClick={() => navigate('/create-salon')} 
                  className="font-semibold text-purple-300 hover:underline cursor-pointer"
                >
                  Crea tu salón
                </span>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;