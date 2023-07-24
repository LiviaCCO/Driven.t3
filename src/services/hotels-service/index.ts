import { Hotel } from '@prisma/client';
import { notFoundError, badRequestError, paymentRequiredError } from '@/errors';
import hotelsRepository  from '@/repositories/hotels-repository';
import ticketService from '../tickets-service';
import ticketsRepository from '@/repositories/tickets-repository';


async function getHotels(userId: number): Promise<Hotel[]> {
    const ticket = await ticketService.getTicketByUserId(userId);
    //- Não existe (inscrição, ticket ou hotel): `404 (not found)`
    if (!ticket || !ticket.enrollmentId) throw notFoundError(); //404
    //- Ticket não foi pago, é remoto ou não inclui hotel: `402 (payment required)`
    const ticket2 = await ticketsRepository.findTicketByEnrollmentId(ticket.enrollmentId);
    if (ticket2.status !== "PAID" || ticket2.TicketType.isRemote !== false || ticket2.TicketType.includesHotel !== true) throw paymentRequiredError(); //402
    //- Outros erros: `400 (bad request)`
    const hotels: Hotel[] = await hotelsRepository.findHotels();
    if (!hotels) throw notFoundError();
    return hotels;
}

async function getHotelId(userId: number, hotelId: number) {

    const ticket = await ticketService.getTicketByUserId(userId);
    //- Não existe (inscrição, ticket ou hotel): `404 (not found)`
    if (!ticket || !ticket.enrollmentId) throw notFoundError(); //404
    //- Ticket não foi pago, é remoto ou não inclui hotel: `402 (payment required)`
    const ticket2 = await ticketsRepository.findTicketByEnrollmentId(ticket.enrollmentId);
    if (ticket2.status !== "PAID" || ticket2.TicketType.isRemote !== false || ticket2.TicketType.includesHotel !== true) throw paymentRequiredError(); //402
    
    const hotel = await hotelsRepository.findHotelId(hotelId);
    if (!hotel) throw notFoundError();

    return hotel;
}

const hotelsService = {
    getHotels,
    getHotelId,
  };
  
  export default hotelsService;