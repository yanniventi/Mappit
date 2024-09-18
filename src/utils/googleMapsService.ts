import { Client } from "@googlemaps/google-maps-services-js";

const client = new Client({});

export const getPlaceDensity = async (lat: number, lng: number): Promise<string> => {
    if (!process.env.GOOGLE_MAPS_API_KEY) {
        throw new Error("Google Maps API key is undefined");
    }

    const params = {
        key: process.env.GOOGLE_MAPS_API_KEY,
        location: { lat, lng },
        radius: 500, // Smaller radius for higher density relevance
        type: 'restaurant'  // Example type to filter more crowded spots like restaurants
    };

    try {
        const response = await client.placesNearby({ params });
        const placesCount = response.data.results.length;
        // Simple logic to determine if an area is 'crowded'
        const isCrowded = placesCount > 10 ? 'Crowded' : 'Not Crowded';
        return isCrowded;
    } catch (error) {
        console.error('Failed to fetch places data:', error);
        throw error;
    }
};
