import axios from 'axios'


/**
 * @name generateAccessToken 
 * @description Generates an access token for interacting with the API 
 * @example 
 * const access_token = await generateAccessToken()
 * @returns 
 */
export const generateAccessToken = async () => {

    const base_url = ''
    const username = ''
    const password = ''


    const url = `${base_url}/oauth/v1/generate`
    try {
        const response = await axios.get<AccessTokenResponse>(url, {
            params: {
                grant_type: 'client_credentials'
            },
            headers: {
                'Authorization': 'Basic ' + Buffer.from(username + ':' + password).toString('base64'),
            }
        })

        const access_token = response.data.access_token 

        return access_token
    } catch (e) 
    {   
        return Promise.reject({
            message: 'Error generating access token',
            error: e
        })
    }
}




/**
 * @name send_payment_request
 * @description Sends a payment request to the API
 * @example
 * const response = await send_payment_request()
 * console.log(response)
 * @returns 
 */
export const send_payment_request = async () => {
    const base_url = '' 
    const access_token = await generateAccessToken() 

    const url = `${base_url}/mpesa/stkpush/v1/processrequest`

    try {
        const access_token = await generateAccessToken()

        const response = await axios.post<SendPaymentResponse>(url, {
            BusinessShortCode: 174379,
            Password: 'password',
            AccountReference: 'account',
            Amount: 100,
            CallBackURL: 'https://example.com',
            PartyA: 254712345678,
            PartyB: 174379,
            PhoneNumber: 254712345678,
            Timestamp: '20210101000000',
            TransactionDesc: 'description',
            TransactionType: 'CustomerPayBillOnline'
        } as SendPaymentRequestBody, {
            headers: {
                "Authorization": `Bearer ${access_token}`
            }
        })  


        return response.data

    } 
    catch (e)
    {
        return Promise.reject({
            message: 'Error generating access token',
            error: e
        })
    }

}



export const send_payout_request = async () => {
    const base_url = ''
    const url = `${base_url}/mpesa/b2c/v1/paymentrequest`
    try {
        const access_token = await generateAccessToken()


        const response = await axios.post<SendPayoutResponse>(url, {

        } as SendPayoutRequest, {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        })

        return response.data
    }
    catch (e)
    {
        return Promise.reject({
            message: 'Error initiating payout',
            error: e
        })
    }
}


export const capture_payment_request_callback = async (data: any) => {
    try {

    } catch (e) 
    {

    }
}