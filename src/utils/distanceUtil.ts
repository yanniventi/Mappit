import { AreaMetadata } from '../types';
/**
 * Utility function to find the closest area based on latitude and longitude
 * @param { number } lat
 * @param { number } lon
 * @param { AreaMetadata[] } areas
 * @returns { AreaMetadata | null }
 */
export const findClosestArea = (lat: number, lon: number, areas: AreaMetadata[]): AreaMetadata | null => {
    let closestArea: AreaMetadata | null = null;
    let smallestDistance = Number.MAX_SAFE_INTEGER;

    areas.forEach(area => {
        const areaLat = area.label_location.latitude;
        const areaLon = area.label_location.longitude;

        const distance = getDistance(lat, lon, areaLat, areaLon);

        if (distance < smallestDistance) {
            smallestDistance = distance;
            closestArea = area;
        }
    });

    return closestArea;
};

/**
 * Utility function to calculate the distance between two coordinates using the Haversine formula
 * @param { number } lat1 (current)
 * @param { number } lon1 (current)
 * @param { number } lat2 (from API)
 * @param { number } lon2 (from API)
 * @returns { number }
 */
export const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return distance;
};

/**
 * Utility function to convert degrees to radians
 * @param { number } deg
 * @returns { number }
 */
export const deg2rad = (deg: number): number => {
    return deg * (Math.PI / 180);
};