import faker from '@faker-js/faker';
import { TicketStatus } from '@prisma/client';
import httpStatus from 'http-status';
import * as jwt from 'jsonwebtoken';
import supertest from 'supertest';
import { createEnrollmentWithAddress, createUser, createTicketType, createTicket, createHotels, createPayment, createSpecificTicketType, createRoom } from '../factories';
import { cleanDb, generateValidToken } from '../helpers';
import { prisma } from '@/config';
import app, { init } from '@/app';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe('GET /hotels', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/hotels');
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();
    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    // Dando tudo certo sem lista de hoteis
    it('should respond with status 200 and with hotels', async () => {
      //exigências
      const user = await createUser(); 
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);
      const token = await generateValidToken(user);

      const hotels = await createHotels();
      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual([]);
    });
    
    // Dando tudo certo com hoteis
    it('should respond with status 200 and with hotels', async () => {
      //exigências
      const user = await createUser(); 
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);
      const token = await generateValidToken(user);

      const hotels = await createHotels();
      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual([
        {
          id: hotels.id,
          name: hotels.name,
          image: hotels.image,
          createdAt: hotels.createdAt.toISOString(),
          updatedAt: hotels.updatedAt.toISOString(),
        },
      ]);
    });
    
    // Ticket é remoto: `402 (payment required)`
    it('should respond with 402 if the ticket is remote ', async () => {
      const user = await createUser();
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createSpecificTicketType(true, true)
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);

      const token = await generateValidToken(user);
      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    });
    // Ticket não foi pago: `402 (payment required)`
    it('should respond with 402 if the ticket is reserved ', async () => {
      const user = await createUser();
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType()
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
      await createPayment(ticket.id, ticketType.price);

      const token = await generateValidToken(user);
      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    });
    // Ticket não inclui hotel: `402 (payment required)`
    it('should respond with 402 if the ticket has not a hotel', async () => {
      const user = await createUser();
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createSpecificTicketType(false, false)
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);

      const token = await generateValidToken(user);
      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    });
    // Não existe (inscrição): `404 (not found)`
    it('should respond with 404 if has no enrollment ', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      await createSpecificTicketType(false, true);

      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });
    
    ////////////////////////////////////////////
    // Não existe (ticket): `404 (not found)`
    it('should respond with 404 if ticket doesnt exist', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createEnrollmentWithAddress(user);

      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });
    
    // Não existe (hotel): `404 (not found)`
    it('should respond with 404 if ticket doesnt exist', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createEnrollmentWithAddress(user);
      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });
    /////////////////////////////////////////////
  });
});

describe('GET /hotelId', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/hotels/10');
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();
    const response = await server.get('/hotels/10').set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    const response = await server.get('/hotels/10').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    // Dando tudo certo sem quartos
    it('should respond with status 200 and a specific hotel', async () => {
      //exigências
      const user = await createUser(); 
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);
      const token = await generateValidToken();
      const hotels = await createHotels();
      const response = await server.get(`/hotels/${hotels.id}`).set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual(
        {
          id: hotels.id,
          name: hotels.name,
          image: hotels.image,
          createdAt: hotels.createdAt.toISOString(),
          updatedAt: hotels.updatedAt.toISOString(),
          Rooms: [],
        }
      );
    });
    // Dando tudo certo com quartos
    it('should respond with status 200 and a specific hotel', async () => {
      //exigências
      const user = await createUser(); 
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);
      const token = await generateValidToken();
      const hotels = await createHotels();
      const rooms = await createRoom(hotels.id);
      const response = await server.get(`/hotels/${hotels.id}`).set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual(
        {
          id: hotels.id,
          name: hotels.name,
          image: hotels.image,
          createdAt: hotels.createdAt.toISOString(),
          updatedAt: hotels.updatedAt.toISOString(),
          Rooms: [
            {
              id: rooms.id,
              name: rooms.name,
              capacity: rooms.capacity,
              hotelId: hotels.id,
              createdAt: rooms.createdAt.toISOString(),
              updatedAt: rooms.updatedAt.toISOString(),
            },
          ],
        }
      );
    });

    // Ticket é remoto: `402 (payment required)`
    it('should respond with 402 if the ticket is remote ', async () => {
      const user = await createUser();
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createSpecificTicketType(true, true)
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);

      const token = await generateValidToken(user);
      const response = await server.get('/hotels/10').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    });
    // Ticket não foi pago: `402 (payment required)`
    it('should respond with 402 if the ticket is reserved ', async () => {
      const user = await createUser();
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType()
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
      await createPayment(ticket.id, ticketType.price);
      const token = await generateValidToken(user);
      const response = await server.get('/hotels/10').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    });
    // Ticket não inclui hotel: `402 (payment required)`
    it('should respond with 402 if the ticket has not a hotel', async () => {
      const user = await createUser();
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createSpecificTicketType(false, false)
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);
      const token = await generateValidToken(user);
      const response = await server.get('/hotels/10').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    });
    // Não existe (inscrição): `404 (not found)`
    it('should respond with 404 if has no enrollment ', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      await createSpecificTicketType(false, true);

      const response = await server.get('/hotels/10').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });
    // Hotel não encontrado: `404`
    it('should respond with 404 if the hotel not exist', async () => {
      const user = await createUser();
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createSpecificTicketType(false, true)
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
      await createPayment(ticket.id, ticketType.price);
      const token = await generateValidToken(user);
      const response = await server.get('/hotels/00000000').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
  });
    
  });
});

