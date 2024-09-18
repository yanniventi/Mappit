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
}

// for weather API
export interface User {
    firstName: string;
    lastName: string;
    password: string;
    email: string;
    age: number;
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