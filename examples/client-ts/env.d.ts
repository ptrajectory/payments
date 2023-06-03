declare namespace NodeJS {
    interface ProcessEnv {
        MPESA_CONSUMER_KEY: string;
        MPESA_CONSUMER_SECRET: string;
        MPESA_PASSKEY: string;
        MPESA_SHORTCODE: number;
        PHONE_NUMBER: number;
        PASSWORD: string;
        SECURITY_CREDENTIAL: string;
    }
}