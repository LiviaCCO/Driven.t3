import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import hotelsService from '@/services/hotels-service';

export async function getHotels(req: AuthenticatedRequest, res: Response) {
    const userId = req;
    console.log(userId)
    const hotels = await hotelsService.getHotels(userId: number);
    return res.status(httpStatus.OK).send(hotels);
}

export async function getHotelId(req: AuthenticatedRequest, res: Response) {
    const {userId, hotelId} = req.body;
    const hotel = await hotelsService.getHotelId(userId: number, hotelId: number);
    return res.status(httpStatus.OK).send(hotel);
}