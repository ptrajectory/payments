

export type DTO<T> = {
    data: T,
    message: string,
    error: "success" | "error"
}