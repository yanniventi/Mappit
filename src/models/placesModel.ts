import { QueryResult } from "pg";
import { sqlToDB } from "./../utils/dbUtil";
import { Places } from "../types";
import { logger } from "./../utils/logger";
import pool from "../config/db";

// Function to get all places  by user ID
export const getPlacesinTripsByUserId = async (
  userId: string
): Promise<Places[]> => {
  const getTripsSql = `SELECT * FROM placesintrip WHERE user_id = $1;`;

  try {
    const result: QueryResult = await sqlToDB(getTripsSql, [userId]);
    return result.rows;
  } catch (error) {
    logger.error(`getPlacesinTripsByUserId error: ${getErrorMessage(error)}`);
    throw new Error(
      `Failed to fetch placesInTrip for user: ${getErrorMessage(error)}`
    );
  }
};

// Function to add a new trip
export const addPlacesInTrip = async (
  userId: string,
  tripData: Places
): Promise<Places> => {
  const { trips_id, places_id } = tripData;
  const addPlaceSql = `
        INSERT INTO placesintrip (user_id, trips_id, places_id)
        VALUES ($1, $2, $3)
        RETURNING *;
    `;

  try {
    const result: QueryResult = await sqlToDB(addPlaceSql, [
      userId,
      trips_id,
      places_id,
    ]);
    return result.rows[0];
  } catch (error) {
    logger.error(`addPlacesInTrip error: ${getErrorMessage(error)}`);
    throw new Error(`Failed to add place to trip: ${getErrorMessage(error)}`);
  }
};

// Function to get a places by Places ID
export const getPlacesInTripId = async (
  placesId: string
): Promise<Places | null> => {
  const getPlaceSql = `SELECT * FROM placesintrip WHERE places_id = $1;`;

  try {
    const result: QueryResult = await sqlToDB(getPlaceSql, [placesId]);
    return result.rows.length ? result.rows[0] : null;
  } catch (error) {
    logger.error(`getPlacesInTripId error: ${getErrorMessage(error)}`);
    throw new Error(`Failed to fetch Places : ${getErrorMessage(error)}`);
  }
};

// Helper function to extract error messages
function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "An unknown error occurred";
}

// Function to delete a place in trip by PlacesId
export const deletePlaceById = async (
  placesId: string
): Promise<QueryResult> => {
  const query = "DELETE FROM placesintrip WHERE id = $1";
  const values = [placesId];
  return pool.query(query, values);
};
