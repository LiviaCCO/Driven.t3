import { Hotel } from '@prisma/client';
import { notFoundError, badRequestError, paymentRequiredError } from '@/errors';
import hotelsRepository  from '@/repositories/hotels-repository';
import ticketService from '../tickets-service';
import { CreateTicketParams } from '@/protocols';

async function getHotels(userId: number): Promise<Hotel[]> {
    const ticket = await ticketService.getTicketByUserId(userId)
    if (!ticket || !ticket.enrollmentId) throw notFoundError(); //404
    //- Não existe (inscrição, ticket ou hotel): `404 (not found)`
    //- Ticket não foi pago, é remoto ou não inclui hotel: `402 (payment required)`
    ///if (ticket.status !== "PAID" || ticket.TicketType.isRemote !== false || ticket.TicketType.includesHotel !== true) throw paymentRequiredError(); //402
   
    //- Outros erros: `400 (bad request)`
    const hotels: Hotel[] = await hotelsRepository.findHotels();
    if (!hotels) throw notFoundError();

    const rooms = await hotelsRepository.findRooms();
  
    return hotels;
}

async function getHotelId(userId: number, hotelId: number) {
    const ticket = await ticketService.getTicketByUserId(userId)
    if (!ticket || !ticket.enrollmentId) throw notFoundError(); //404
    //- Não existe (inscrição, ticket ou hotel): `404 (not found)`
    //- Ticket não foi pago, é remoto ou não inclui hotel: `402 (payment required)`
    ///if (ticket.status !== "PAID" || ticket.TicketType.isRemote !== false || ticket.TicketType.includesHotel !== true) throw paymentRequiredError(); //402
   
    //- Outros erros: `400 (bad request)`
    const hotel = await hotelsRepository.findHotelId(hotelId);
    if (!hotel) throw notFoundError();

    return hotel;
}

const hotelsService = {
    getHotels,
    getHotelId,
  };
  
  export default hotelsService;