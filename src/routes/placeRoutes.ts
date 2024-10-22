// routes/placeRoutes.ts
import express, { Request, Response, NextFunction } from 'express';
import {
  searchPlacesByText,
  getPlacePhoto,
  getDirections
} from './../controllers/placeController';

const router = express.Router();

// Route to get detailed place information including reviews through textsearch
router.get('/places', (req: Request, res: Response, next: NextFunction) => {
  searchPlacesByText(req, res, next);
});

// Route to get photo of place (photo_reference from textsearch)
router.get('/place-details', (req: Request, res: Response, next: NextFunction) => {
  getPlacePhoto(req, res, next);
});

// Route to get directions between two locations
router.get('/directions', (req: Request, res: Response, next: NextFunction) => {
  getDirections(req, res, next);
});

export default router;
