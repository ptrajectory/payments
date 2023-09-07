import { ZodError, z } from "zod"
import { isEmpty, isUndefined } from "../cjs/lodash"
type httpMethods = "POST" | "GET" | "PUT" | "DELETE" | "PATCH"

export class PaymentHttpResponse  {

    _statusCode: number 
    _headers: Record<string, string> 
    _res: Response

    constructor(response: Response) {
        this._statusCode = response.status 
        this._headers = response.status === 400 ? {} : PaymentHttpResponse._transformHeadersToObject(response.headers)
        this._res = response
    }

    static _transformHeadersToObject(headers: Headers): Record<string, string> {
        const headersObject: Record<string,string> = {} 

        for (const entry of headers) {
            if(!Array.isArray(entry) || entry.length !== 2) {
                throw new Error(
                    'The response headers produced by the fetch function do not have an iterable headers map. Response headers should be an iterable object.'
                )
            }

            headersObject[entry[0]] = entry[1]
        }


        return headersObject

    }

    async toJSON<T=any>() {

        try{
            const data = await this._res.json() as Promise<T>

    
            return data

        }
        catch (e)
        {
            return null
        }
    }

    getRawResponse(): Response {
        return this._res
    }

}

export type verbFunctionOptions = {
    params?: Record<string, string>
    query?: Record<string, string>
    headers?: Record<string, string>
    pathSegments?: Record<string, string>
    body?: Record<string, string | number | boolean>
}

export type verbFunction = (url: string, options: verbFunctionOptions) => Promise<PaymentHttpResponse>


export default class PaymentsHttpClient {


    private _HOST = "localhost"
    private _PORT = "8089"
    private _PROTOCOL = "http"
    private _SECRET_KEY = ""

    // Set the client url
    set url(new_url: string){
        const rl = new URL(new_url)
        this._HOST = rl.hostname
        this._PORT = rl.port 
        this._PROTOCOL = rl.protocol?.replaceAll(":", "")
    }

    // set the secret key
    set secretKey(secret_key: string){

        console.log("SECRET KEYLL", secret_key)

        if(typeof secret_key === "undefined") throw Error("Please Provide a valid secret key")

        if(secret_key.trim().length  == 0 ) throw Error("Secret Key is invalid")

        this._SECRET_KEY = secret_key
    }


    updatePath (path?: string, pathSegments: Record<string, string> | null | undefined = null) {

        
        if(isUndefined(path)) throw new Error("PATH CANNT BE EMPTY")

        if (isEmpty(pathSegments)) return path
    
        let _path = path
    
        const segments = Object.keys(pathSegments)
    
        for (const segment of segments) {
    
            _path = _path?.replaceAll(`{${segment}}`, pathSegments?.[segment])
    
        }
    
        return _path
    
    }

    async makeRequest(
        // with segments
        path: string,
        method: httpMethods, 
        data: {
            body: {[k: string]: any} | null,
            headers: Record<string, string> | undefined | null,
            params: Record<string, string> | undefined | null,
            pathSegments: Record<string, string> | undefined | null
        }
    ){
       
        const { body = null, headers = null, params = null, pathSegments = null } = data 

        const relative = this.updatePath(path, pathSegments)

        const endpoint = new URL(relative, `${this._PROTOCOL}://${this._HOST}` )

        endpoint.port = this._PORT 

        for (const param in params){
            endpoint.searchParams.append(param, params[param])
        } 

        let requestHeaders = new Headers()
        

        for (const header in headers){
            requestHeaders.append(header, headers?.[header])
        }

        requestHeaders.append("Content-Type", "application/json")
        requestHeaders.append("Authorization", `Bearer ${this._SECRET_KEY}`)

        console.log(requestHeaders)

        const fetchPromise = fetch(endpoint.toString(), {
            method,
            headers: requestHeaders,
            body: JSON.stringify(body)
        })

        const res = await fetchPromise
        return new PaymentHttpResponse(res)
        

    }

    post: verbFunction = (url, options) => {

        return this.makeRequest(url, "POST", {
            body: options.body ?? null,
            headers: options.headers ?? null,
            params: options.params ?? null,
            pathSegments: options.pathSegments ?? null
        })

    }

    get: verbFunction = (url, options) => {

        return this.makeRequest(url, "GET", {
            body: options.body ?? null,
            headers: options.headers ?? null,
            params: options.params ?? null,
            pathSegments: options.pathSegments ?? null
        })

    }

    put: verbFunction = (url, options) => {

        return this.makeRequest(url, "PUT", {
            body: options.body ?? null,
            headers: options.headers ?? null,
            params: options.params ?? null,
            pathSegments: options.pathSegments ?? null
        })

    }

    patch: verbFunction = (url, options) => {

        return this.makeRequest(url, "PATCH", {
            body: options.body ?? null,
            headers: options.headers ?? null,
            params: options.params ?? null,
            pathSegments: options.pathSegments ?? null
        })

    }

    delete: verbFunction = (url, options) => {

        return this.makeRequest(url, "DELETE", {
            body: options.body ?? null,
            headers: options.headers ?? null,
            params: options.params ?? null,
            pathSegments: options.pathSegments ?? null
        })

    } 

}


export class PaymentsClientHttpError extends Error {
    _tag = ""
    code = 0
    json = ""

    constructor (req: PaymentHttpResponse, resource: string){
        super("PaymentsClientHttpError")
        this._tag = resource
        this.code  = req._res.status 

        req.toJSON().then((json)=>{
            this.message = json?.message ?? "NO ERROR MESSAGE FROM SERVER"
            this.json = JSON?.stringify(json)
        })
        .catch((e)=>{
            this.message = "ERROR CATCHING ERROR"
        })
    }

}


export class PaymentsClientParseError extends Error {
    _tag = ""
    _entire_error: Zod.ZodError
    _flattend

    constructor(zodError: Zod.ZodError, resource: string) {
        super(`PaymentsClientParseError::${resource}`)
        this._entire_error = zodError 
        this._flattend = zodError.flatten().fieldErrors
    }




}


export class ParamsError extends Error {
    _tag = "INVALID PARAMETER ERROR"
    parameter
    constructor(message: string, parameter_name: string){
        super(message)
        this.parameter = parameter_name
    }
}


export type MethodSpec = {
    method: httpMethods, // GET
    headers?: Record<string,string>, // any custom headers
    pathSegments?: Record<string, string>, // { payment_method_id: pm_therestoftheid }
    path: string, // /path/{payment_method_id} // to be replaced with a matching pathSegment
    transformResponse?: <T = any>(response: PaymentHttpResponse) => T,
    validator?: z.ZodSchema<any>,
    onParseFail?: <T>(error: ZodError<T>) => void,
    params?: {
        size: string
        page: string
    }
}