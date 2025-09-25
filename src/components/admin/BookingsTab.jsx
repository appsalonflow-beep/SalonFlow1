import React from 'react';
import { Card } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

const BookingsTab = ({ salonData }) => {
  const bookings = salonData?.bookings || [];
  const services = salonData?.services || [];
  const stylists = salonData?.stylists || [];

  const getBookingDetails = (booking) => {
    const service = services.find(s => s.id === booking.service_id);
    const stylist = stylists.find(s => s.id === booking.stylist_id);
    return {
      serviceName: service?.name || 'Servicio eliminado',
      stylistName: stylist?.name || 'Estilista eliminado',
    };
  };

  return (
    <Card className="salon-card p-6">
      <h3 className="text-xl font-bold text-white mb-4">Reservas Recientes</h3>
      {bookings.length === 0 ? (
        <div className="text-center py-8 text-white/70"><Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" /><p>No hay reservas aún</p></div>
      ) : (
        <div className="space-y-4">
          {bookings.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).map((booking) => {
            const { serviceName, stylistName } = getBookingDetails(booking);
            const client = salonData.clients.find(c => c.id === booking.client_id);
            return (
              <div key={booking.id} className="bg-white/5 p-4 rounded-lg border border-white/10 flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-white">{client?.name || 'Cliente desconocido'}</h4>
                  <p className="text-white/70">{serviceName} con {stylistName}</p>
                  <p className="text-white/50 text-sm">{new Date(booking.booking_date).toLocaleDateString('es-ES', {timeZone: 'UTC'})} - {booking.booking_time}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-white">${booking.final_price}</p>
                  <p className="text-white/70">{client?.phone}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};

export default BookingsTab;