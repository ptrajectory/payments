declare namespace NodeJS {
    interface ProcessEnv {
        // the neon database url
        DATABASE_URL: string;
        APP_PORT: string;
        APP_ENV: 'development' | 'production' | 'testing' | 'staging';
    }
}