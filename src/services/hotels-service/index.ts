import { Hotel } from '@prisma/client';
import { notFoundError } from '@/errors';
import { hotelsRepository } from '@/repositories/hotels-repository';
import { CreateTicketParams } from '@/protocols';

async function getHotels(): Promise<Hotel[]> {
  const hotels: Hotel[] = await hotelsRepository.findHotels();
  if (!hotels) throw notFoundError();

  const rooms = await hotelsRepository.findRooms();
  if (!rooms) throw notFoundError();

  let hotelsTable = {};
  for (let i=0; i < hotels.length; i++){
    hotelsTable += {
        id: .id,
        name: .name,
        image: .image,
        createdAt: .createdAt.toISOString(),
        updatedAt: .updatedAt.toISOString(),
        Rooms: [
          {
            id: .Rooms[0].id,
            name: Rooms[0].name,
            capacity: .Rooms[0].capacity,
            hotelId: .Rooms[0].hotelId,
            createdAt: .Rooms[0].createdAt.toISOString(),
            updatedAt: .Rooms[0].updatedAt.toISOString(),
        }]
    }
  }
  return hotels;
}

async function getHotelId(hotelId: number): Promise<Hotel> {
  const hotel = await hotelsRepository.findHotelId(hotelId);
  if (!hotel) throw notFoundError();

  const rooms = await hotelsRepository.findRoomsId(hotelId);
  if (!rooms) throw notFoundError();

  return rooms;
}

/* //retorno de Rooms com Hotel (include Rooms em Hotel)
{
  id: hotelWithRooms.id,
  name: hotelWithRooms.name,
  image: hotelWithRooms.image,
  createdAt: hotelWithRooms.createdAt.toISOString(),
  updatedAt: hotelWithRooms.updatedAt.toISOString(),
  Rooms: [
    {
      id: hotelWithRooms.Rooms[0].id,
      name: hotelWithRooms.Rooms[0].name,
      capacity: hotelWithRooms.Rooms[0].capacity,
      hotelId: hotelWithRooms.Rooms[0].hotelId,
      createdAt: hotelWithRooms.Rooms[0].createdAt.toISOString(),
      updatedAt: hotelWithRooms.Rooms[0].updatedAt.toISOString(),
    }
  ]
} */

const hotelsService = {
    getHotels,
    getHotelId,
  };
  
  export default hotelsService;