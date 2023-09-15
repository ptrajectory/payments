namespace NodeJS {
    interface ProcessEnv {
        /**
         * THE URL TO THE SERVER INSTANCE
         */
        URL: string
        /**
         * THE STORE SECRET KEY
         */
        SECRET_KEY: string
        /**
         * THE STORE PUBLISHABLE KEY
         */
        PUBLISHABLE_KEY: string
    }
}