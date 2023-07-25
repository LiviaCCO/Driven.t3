import { Hotel } from '@prisma/client';
import { notFoundError} from '@/errors';
import hotelsRepository  from '@/repositories/hotels-repository';
import ticketService from '../tickets-service';
import ticketsRepository from '@/repositories/tickets-repository';
import {paymentRequiredError} from '@/errors/payment-error';
import { requestError } from '@/errors/request-error';


async function getHotels(userId: number): Promise<Hotel[]> {
    const ticket = await ticketService.getTicketByUserId(userId);
    //- Não existe (inscrição, ticket ou hotel): `404 (not found)`
    if (!ticket || !ticket.enrollmentId) throw notFoundError(); //404
    //- Ticket não foi pago, é remoto ou não inclui hotel: `402 (payment required)`
    const ticket2 = await ticketsRepository.findTicketByEnrollmentId(ticket.enrollmentId);
    if (ticket2.status === "RESERVED" || ticket2.TicketType.isRemote === true || ticket2.TicketType.includesHotel === false) throw paymentRequiredError(); //402
    //- Outros erros: `400 (bad request)`
    const hotels: Hotel[] = await hotelsRepository.findHotels();
    if (!hotels) throw requestError(400);
    return hotels;
}

async function getHotelId(userId: number, hotelId: number) {
    console.log("userId", userId, "hotelId", hotelId)
    const ticket = await ticketService.getTicketByUserId(userId);
    //- Não existe (inscrição, ticket ou hotel): `404 (not found)`
    if (!ticket || !ticket.enrollmentId || !hotelId) throw notFoundError(); //404
    //- Ticket não foi pago, é remoto ou não inclui hotel: `402 (payment required)`
    const ticket2 = await ticketsRepository.findTicketByEnrollmentId(ticket.enrollmentId);
    if (ticket2.status === "RESERVED" || ticket2.TicketType.isRemote === true || ticket2.TicketType.includesHotel === false) throw paymentRequiredError(); //402
    
    const hotel = await hotelsRepository.findHotelId(hotelId);
    console.log("o hotel", hotel)
    if (!hotel) throw notFoundError();
    
    return hotel;
}

const hotelsService = {
    getHotels,
    getHotelId,
  };
  
  export default hotelsService;