import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import hotelsService from '@/services/hotels-service';

export async function getHotels(req: AuthenticatedRequest, res: Response) {
    const {userId} = req;
    console.log("userID", userId)
    const hotels = await hotelsService.getHotels(userId);
    console.log("hotels", hotels)
    return res.status(httpStatus.OK).send(hotels);
}

export async function getHotelId(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;
    const { hotelId } = req.params;
    console.log("userID", userId, "hotelID", hotelId)
    const hotId = Number(hotelId);
    const hotel = await hotelsService.getHotelId(userId, hotId);
    console.log("hotel", hotel)
    return res.status(httpStatus.OK).send(hotel);
}