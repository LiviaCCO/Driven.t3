import { Hotel, Room } from '@prisma/client';
import { prisma } from '@/config';

async function findHotels(): Promise<Hotel[]> {
    return prisma.hotel.findMany();
}

async function findHotelId(hotelId: number) {
    /* const rooms = prisma.room.findFirst({
        where: {hotelId},
    }); */
    return prisma.hotel.findFirst({
      where: { id: hotelId },
      include: {
        Rooms: true
      },
    });
}

export default {
    findHotels,
    findHotelId,
};
  