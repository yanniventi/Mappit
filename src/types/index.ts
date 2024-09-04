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

export interface User {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}
