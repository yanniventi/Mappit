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
    firstName: string;
    lastName: string;
    password: string;
    email: string;
    age: number;
    phoneNumber: string;
}
