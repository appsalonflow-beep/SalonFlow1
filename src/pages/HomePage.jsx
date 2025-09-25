import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Scissors, Calendar, Users, Star, Check, Crown, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MercadoPagoButton from '@/components/MercadoPagoButton';

const HomePage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Reservas Online",
      description: "Sistema de reservas 24/7 para tus clientes"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Gestión de Clientes",
      description: "Base de datos completa de todos tus clientes"
    },
    {
      icon: <Scissors className="w-8 h-8" />,
      title: "Servicios Personalizados",
      description: "Configura todos tus servicios y precios"
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "Panel Administrativo",
      description: "Control total de tu negocio desde un solo lugar"
    }
  ];

  const plans = [
    {
      name: "Plan Gratis",
      price: "$0",
      period: "/mes",
      description: "Perfecto para empezar",
      features: [
        "Hasta 10 reservas compartidas",
        "1 servicio básico",
        "Panel básico",
        "Link personalizado"
      ],
      icon: <Sparkles className="w-6 h-6" />,
      popular: false,
      action: () => navigate('/create-salon'),
      actionLabel: "Comenzar Ahora"
    },
    {
      name: "Plan Pro",
      price: "$49.000",
      period: "/mes",
      description: "Para salones profesionales",
      features: [
        "Reservas ilimitadas",
        "Servicios ilimitados",
        "Panel completo",
        "Estadísticas avanzadas",
        "Soporte prioritario",
        "Personalización completa"
      ],
      icon: <Crown className="w-6 h-6" />,
      popular: true,
      isMercadoPago: true
    }
  ];

  return (
    <>
      <Helmet>
        <title>SalonFlow - Gestión Moderna para Salones de Belleza</title>
        <meta name="description" content="La plataforma más moderna para gestionar tu salón de belleza y peluquería. Reservas online, panel administrativo y mucho más." />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative container mx-auto px-4 py-20">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-4xl mx-auto"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mb-8"
              >
                <img className="w-32 h-32 mx-auto rounded-full shadow-2xl" alt="SalonFlow Logo" src="https://images.unsplash.com/photo-1633681926019-03bd9325ec20" />
              </motion.div>
              
              <h1 className="text-6xl md:text-7xl font-black text-white mb-6 leading-tight">
                Salon<span className="gradient-text">Flow</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
                La plataforma más moderna para gestionar tu salón de belleza. 
                <br />
                <span className="text-purple-300 font-semibold">Reservas online, panel admin y mucho más.</span>
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  onClick={() => navigate('/create-salon')}
                  variant="gradient"
                  className="px-8 py-4 text-lg font-semibold rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  <Scissors className="w-5 h-5 mr-2" />
                  Crear Mi Salón
                </Button>
                
                <Button
                  variant="gradientOutline"
                  onClick={() => navigate('/login')}
                  className="px-8 py-4 text-lg font-semibold rounded-full backdrop-blur-sm"
                >
                  Panel Admin
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white/5 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Todo lo que necesitas
              </h2>
              <p className="text-xl text-white/80">
                Herramientas profesionales para hacer crecer tu negocio
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="salon-card p-8 rounded-2xl text-center hover:transform hover:scale-105 transition-all duration-300"
                >
                  <div className="text-purple-300 mb-4 flex justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-white/70">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Planes que se adaptan a ti
              </h2>
              <p className="text-xl text-white/80">
                Desde gratis hasta profesional
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {plans.map((plan, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className={`salon-card p-8 rounded-2xl relative ${
                    plan.popular ? 'ring-2 ring-purple-400 scale-105' : ''
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                        Más Popular
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center mb-6">
                    <div className="text-purple-300 mb-4 flex justify-center">
                      {plan.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-white/70 mb-4">
                      {plan.description}
                    </p>
                    <div className="text-4xl font-black text-white">
                      {plan.price}
                      <span className="text-lg font-normal text-white/70">
                        {plan.period}
                      </span>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-white/80">
                        <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {plan.isMercadoPago ? (
                    <MercadoPagoButton />
                  ) : (
                    <Button
                      onClick={plan.action}
                      variant="gradientOutline"
                      className="w-full py-3 rounded-full font-semibold transition-all duration-300"
                    >
                      {plan.actionLabel}
                    </Button>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-purple-800/50 to-pink-800/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                ¿Listo para revolucionar tu salón?
              </h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Únete a miles de salones que ya confían en SalonFlow para gestionar su negocio
              </p>
              <Button
                onClick={() => navigate('/create-salon')}
                variant="gradient"
                className="px-8 py-4 text-lg font-semibold rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Empezar Gratis
              </Button>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default HomePage;