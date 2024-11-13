import { Request, Response } from "express";
import {
  getPlacesinTripsByUserId,
  addPlacesInTrip,
  getPlacesInTripId,
  deletePlaceById,
} from "../models/placesModel";
import { logger } from "./../utils/logger";

// Controller to get all places by user ID
export const getPlaces = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;

  try {
    const places = await getPlacesinTripsByUserId(userId);
    res.status(200).json(places);
  } catch (error) {
    logger.error(
      `getPlaces error: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
    res
      .status(500)
      .json({ error: "Failed to fetch places in trips for the user" });
  }
};

// Controller to add a new place to a trip
export const createPlaceInTrip = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.params;
  const tripData = req.body;

  try {
    const newPlace = await addPlacesInTrip(userId, tripData);
    res.status(201).json(newPlace);
  } catch (error) {
    logger.error(
      `createPlaceInTrip error: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
    res.status(500).json({ error: "Failed to add place to trip" });
  }
};

// Controller to get a specific place in a trip by place ID
export const getPlaceInTrip = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { tripId } = req.params;

  try {
    const place = await getPlacesInTripId(tripId);
    if (place) {
      res.status(200).json(place);
    } else {
      res.status(404).json({ error: "Place in trip not found" });
    }
  } catch (error) {
    logger.error(
      `getPlaceInTrip error: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
    res.status(500).json({ error: "Failed to fetch place in trip" });
  }
};

// Controller to delete a place in trip by placesId
export const deletePlaceInTrip = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { placesId } = req.params;

  try {
    const deleteResult = await deletePlaceById(placesId);

    if (deleteResult.rowCount === 0) {
      res.status(404).json({
        status: "error",
        message: "PlaceInTrip not found or not deleted",
        statusCode: 404,
      });
    } else {
      res.status(200).json({
        status: "ok",
        message: "PlaceInTrip deleted successfully",
        statusCode: 200,
      });
    }
  } catch (error) {
    const errMsg =
      error instanceof Error ? error.message : "Unknown error occurred";
    logger.error(`deleteTrip error: ${errMsg}`);
    res.status(500).json({
      status: "error",
      message: "Failed to delete placeInTrip",
      statusCode: 500,
    });
  }
};
