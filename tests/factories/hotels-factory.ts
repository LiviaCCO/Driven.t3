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

export async function createRoom(hotelId: number) {
  return prisma.room.create({
    data: {
        name: 'Hotel Driven',
        capacity: 100,
        hotelId: hotelId,
    },
  });
}