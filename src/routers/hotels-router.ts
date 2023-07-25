import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getHotels, getHotelId } from '@/controllers';

const hotelsRouter = Router();

hotelsRouter
  .all('/*', authenticateToken)
  .get('/hotels', getHotels)
  .get('/hotels/:hotelId', getHotelId)

export { hotelsRouter };