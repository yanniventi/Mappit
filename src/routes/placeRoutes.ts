// routes/placeRoutes.ts
import express, { Request, Response, NextFunction } from 'express';
import {
  searchPlacesByText,
  getPlacePhoto,
  getDirections
} from './../controllers/placeController';

const router = express.Router();

// Route to search for nearby places (e.g., restaurants, hotels)
router.get('/places', (req: Request, res: Response, next: NextFunction) => {
  searchPlacesByText(req, res, next);
});

// Route to get detailed place information including reviews
router.get('/place-details', (req: Request, res: Response, next: NextFunction) => {
  getPlacePhoto(req, res, next);
});

// Route to get directions between two locations
router.get('/directions', (req: Request, res: Response, next: NextFunction) => {
  getDirections(req, res, next);
});

export default router;
