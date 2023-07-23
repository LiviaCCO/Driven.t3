import { Hotel, Room } from '@prisma/client';
import { prisma } from '@/config';
import { CreateTicketParams } from '@/protocols';

async function findHotels(): Promise<Hotel[]> {
    return prisma.hotel.findMany();
}

async function findRooms(): Promise<Room[]> {
    return prisma.room.findMany();
}

async function findHotelId(hotelId: number) {
    const rooms = prisma.room.findFirst({
        where: {hotelId},
    });
    return prisma.hotel.findFirst({
      where: { id: hotelId },
      include: {
        Rooms: true
      },
    });
}

export default {
    findHotels,
    findRooms,
    findHotelId,
};
  