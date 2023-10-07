type HTTP_METHODS = "POST" | "GET" | "PUT" | "DELETE" | "PATCH"

export type NetRequestOptions = {
    body: Record<string,any>
    headers: Record<string,string>
    params: Record<string,any>
    query: Record<string,any>
}

export class NetResponse extends Response {
    data: any 

    constructor(resp: Response) {
        super(resp.body);

        (async()=>{
            try {
                this.data = await resp.json()
            }
            catch (e)
            {
                this.data = null
            }
        })()

    }



}

export class NetError extends Error {
    constructor(message: string){
        super(message)
    }
}


type MethodRequestOptions = {
    "POST": {
        body?: Record<string,any>,
        params?: Record<string,any>,
        headers?: Record<string, any>
    },
    "GET": {
        params?: Record<string, any>
        headers?: Record<string, any>
        query?: Record<string, any>
    },
    "DELETE": {
        params?: Record<string, any>
        headers?: Record<string, any>
        query?: Record<string, any>
    },
    "PUT": {
        body?: Record<string,any>,
        params?: Record<string,any>,
        headers?: Record<string, any>
    },
    "PATCH": {
        body?: Record<string,any>,
        params?: Record<string,any>,
        headers?: Record<string, any>
    },
}



export default class NetClient {
 
    protected base_url: URL | null = null 
    protected baseHeaders

    constructor(base_url?: string, baseHeaders?: Headers){
        this.base_url = base_url ? new URL(base_url) : null
        this.baseHeaders = baseHeaders
    }


    async makeRequest(options:{method?: HTTP_METHODS, url?: string,  body?: Record<string,any>, headers?: Headers, relativePath?: string, queries?: Record<string, string>}){
        const { method = "GET", url, body, relativePath, headers, queries } = options

        const request_url = url ? new URL(url) : this.base_url ? new URL(relativePath ?? "", this.base_url) : null

        if(request_url == null) throw new NetError("PROVIDE A VALID URL")

        for(const query in queries){
            request_url.searchParams.append(query, queries[query])
        }

        const request_headers = new Headers()

        
        if(headers){
            for(const val of headers.entries()){
                request_headers.append(val[0], val[1])
            }
        }

        if(this.baseHeaders){
            for(const val of this.baseHeaders.entries()){
                request_headers.append(val[0], val[1])
            }
        }
        
        return fetch(request_url.toString(), {
            method: method,
            body: typeof body === "object" ? JSON.stringify(body) : undefined,
            headers: request_headers
        }).then((res)=>new NetResponse(res))
    }


    async post(url: string, options: MethodRequestOptions["POST"]){
        let req_url = url
        if(options.params){
            for(const param in options.params){
                req_url.replace(`{${param}}`, options.params[param])
            }
        }

        let headers = new Headers()

        if(options.headers){
            for(const header in options.headers){
                headers.append(header, options.headers[header]) 
            }
        }

        return this.makeRequest({
            method: "POST",
            url: req_url?.includes("http") ? req_url : undefined,
            body: options.body,
            headers: options.headers ? headers : undefined,
            relativePath: req_url?.includes("http") ? undefined : req_url
        })

    }


    async get(url: string, options: MethodRequestOptions["GET"]){
        let req_url = url
        if(options.params){
            for(const param in options.params){
                req_url.replace(`{${param}}`, options.params[param])
            }
        }

        let headers = new Headers()

        if(options.headers){
            for(const header in options.headers){
                headers.append(header, options.headers[header]) 
            }
        }

        let queries = new Map()
        if(options.query){
            for(const query in options.query){
                queries.set(query, options.query[query])
            }
        }
        const queryObj = {}

        Object.assign(queryObj, queries)

        return this.makeRequest({
            method: "GET",
            url: req_url?.includes("http") ? req_url : undefined,
            headers: options.headers ? headers : undefined,
            relativePath: req_url?.includes("http") ? undefined : req_url,
            queries: options.query ? queryObj : undefined
        })

    }

    async put(url: string, options: MethodRequestOptions["PUT"]){
        let req_url = url
        if(options.params){
            for(const param in options.params){
                req_url.replace(`{${param}}`, options.params[param])
            }
        }

        let headers = new Headers()

        if(options.headers){
            for(const header in options.headers){
                headers.append(header, options.headers[header]) 
            }
        }

        return this.makeRequest({
            method: "PUT",
            url: req_url?.includes("http") ? req_url : undefined,
            body: options.body,
            headers: options.headers ? headers : undefined,
            relativePath: req_url?.includes("http") ? undefined : req_url
        })

    }


    async patch(url: string, options: MethodRequestOptions["PATCH"]){
        let req_url = url
        if(options.params){
            for(const param in options.params){
                req_url.replace(`{${param}}`, options.params[param])
            }
        }

        let headers = new Headers()

        if(options.headers){
            for(const header in options.headers){
                headers.append(header, options.headers[header]) 
            }
        }

        return this.makeRequest({
            method: "PATCH",
            url: req_url?.includes("http") ? req_url : undefined,
            body: options.body,
            headers: options.headers ? headers : undefined,
            relativePath: req_url?.includes("http") ? undefined : req_url
        })

    }

    async delete(url: string, options: MethodRequestOptions["DELETE"]){
        let req_url = url
        if(options.params){
            for(const param in options.params){
                req_url.replace(`{${param}}`, options.params[param])
            }
        }

        let headers = new Headers()

        if(options.headers){
            for(const header in options.headers){
                headers.append(header, options.headers[header]) 
            }
        }

        let queries = new Map()
        if(options.query){
            for(const query in options.query){
                queries.set(query, options.query[query])
            }
        }
        const queryObj = {}

        Object.assign(queryObj, queries)

        return this.makeRequest({
            method: "DELETE",
            url: req_url?.includes("http") ? req_url : undefined,
            headers: options.headers ? headers : undefined,
            relativePath: req_url?.includes("http") ? undefined : req_url,
            queries: options.query ? queryObj : undefined
        })

    }

    
}