import React from 'react';
import { Card } from '@/components/ui/card';
import { Users } from 'lucide-react';

const ClientsTab = ({ salonData }) => {
  const clients = salonData?.clients || [];

  const getTimeSinceLastVisit = (lastVisit) => {
    if (!lastVisit) return "Nuevo cliente";
    const diff = new Date() - new Date(lastVisit);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return "Hoy";
    if (days === 1) return "Ayer";
    return `Hace ${days} días`;
  };

  return (
    <Card className="salon-card p-6">
      <h3 className="text-xl font-bold text-white mb-4">Base de Clientes</h3>
      {clients.length === 0 ? (
        <div className="text-center py-8 text-white/70"><Users className="w-12 h-12 mx-auto mb-4 opacity-50" /><p>No hay clientes registrados</p></div>
      ) : (
        <div className="space-y-4">
          {clients.map((client) => (
            <div key={client.id} className="bg-white/5 p-4 rounded-lg border border-white/10 flex justify-between items-center">
              <div>
                <h4 className="font-semibold text-white">{client.name}</h4>
                <p className="text-white/70">{client.phone}</p>
              </div>
              <div className="text-right">
                <p className="text-white/70 text-sm">Última visita: {getTimeSinceLastVisit(client.last_visit)}</p>
                <p className="text-white/50 text-sm">{client.total_bookings || 0} reservas</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default ClientsTab;