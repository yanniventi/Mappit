// config
export interface Config {
    serviceName: string;
    port: number;
    loggerLevel: string;
    db: PgConfig;
}

// dbUtils
export interface PgConfig {
    user: string;
    database: string;
    password: string;
    host: string;
    port: number;
    max: number;
    idleTimeoutMillis: number;
    googleMapsApiKey: string;
}

export interface User {
    id: number;
    firstName: string;
    lastName: string;
    password: string;
    email: string;
    gender: string;
    dob: string;
    phoneNumber: string;
}

export interface UpdateProfileData {
    firstName: string;
    lastName: string;
    dob: string;
    gender: string;
    phoneNumber: string;
}

// for weather API
export interface LabelLocation {
    latitude: number;
    longitude: number;
}

export interface AreaMetadata {
    name: string;
    label_location: LabelLocation;
}

// Define the structure of the JWT payload
export interface JWTpayload {
    email: string;
}

export interface Location {
    id: number;
    location_name: string;
}

declare module 'express' {
    export interface Request {
        user?: any; // Replace 'User' with the appropriate user type from your app
    }
}