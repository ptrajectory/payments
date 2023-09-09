

export type DTO<T> = {
    data: T,
    message: string,
    error: "success" | "error"
}


export const UNKNOWN_ERROR = "AN UNKNOWN ERROR OCCURED" as const
