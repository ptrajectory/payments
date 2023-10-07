import PTTH from "ptth"
import {KEYS, STORE} from "../../zodiac";
interface AccessTokenResult {
    expires_in: number
    access_token: string
}

export interface IAuthClient {
    getPublicKey?: ()=> Promise<string>,
    generateStoreKeys?: (store: STORE)=>Promise<void>
    getStoreKeys?:()=>Promise<Array<KEYS>>
    getAuthToken(app_id?: string, app_secret?: string):Promise<AccessTokenResult>
}


export class FriendAuthClient implements IAuthClient {

    private readonly _ptth: PTTH;
    constructor(authServerUrl: string, FRIEND_KEY: string ) {
        const baseHeaders = new Headers()
        baseHeaders.append("Authorization", `Bearer ${FRIEND_KEY}`)
        this._ptth = new PTTH(authServerUrl,baseHeaders)
    }
    async generateStoreKeys(store: STORE): Promise<void> {
        await this._ptth.post("/store-keygen", {
            body: store
        })

        return Promise.resolve();
    }

    async getPublicKey(): Promise<string> {
        const response = await this._ptth.get("/well-known", {})
        return response.text();
    }

    async getStoreKeys(): Promise<Array<KEYS>> {
        const response = await this._ptth.get("/store-keys", {})

        return response.json()
    }

    async getAuthToken(app_id: string, app_secret: string): Promise<AccessTokenResult> {
        const headers = new Headers()
        headers.append("x-app-id", app_id)
        headers.append("x-app-secret", app_secret)

        const response= await this._ptth.get("/access-token", {
            headers
        })

        return response.json()
    }
}


export class AppClient implements IAuthClient {

    private readonly _ptth: PTTH;
    constructor(authServerUrl: string, appId: string, appSecret: string ) {

        const baseHeaders = new Headers()
        baseHeaders.append("x-app-id", appId)
        baseHeaders.append("x-app-secret", appSecret)

        this._ptth = new PTTH(authServerUrl,baseHeaders)
    }


    async getAuthToken(): Promise<AccessTokenResult> {
        const response= await this._ptth.get("/access-token", {
        })
        return response.json()
    }

}