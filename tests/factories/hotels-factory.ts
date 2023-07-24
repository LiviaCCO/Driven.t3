import faker from '@faker-js/faker';
import { prisma } from '@/config';

export async function createHotels() {
  return prisma.hotel.create({
    data: {
      name: faker.name.findName(),
      image: faker.image.abstract(),
    },
  });
}

export async function createRoom(enrollmentId: number, ticketTypeId: number, status: TicketStatus) {
  return prisma.room.create({
    data: {
        name: faker.name.findName(),
        capacity: faker.datatype.number(),
        hotelId: faker.datatype.number(),
    },
  });
}