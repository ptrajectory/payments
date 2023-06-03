// src/client.ts
import axios from "axios";

// src/lib/utils.ts
var format_mpesa_date = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  let string_month = month.toString();
  if (string_month.length === 1) {
    string_month = `0${string_month}`;
  }
  const day = date.getDate();
  let string_day = day.toString();
  if (string_day.length === 1) {
    string_day = `0${string_day}`;
  }
  const hours = date.getHours();
  let string_hours = hours.toString();
  if (string_hours.length === 1) {
    string_hours = `0${string_hours}`;
  }
  const minutes = date.getMinutes();
  let string_minutes = minutes.toString();
  if (string_minutes.length === 1) {
    string_minutes = `0${string_minutes}`;
  }
  const seconds = date.getSeconds();
  let string_seconds = seconds.toString();
  if (string_seconds.length === 1) {
    string_seconds = `0${string_seconds}`;
  }
  return `${year}${string_month}${string_day}${string_hours}${string_minutes}${string_seconds}`;
};

// src/client.ts
import fetch from "node-fetch";
var MpesaClient = class {
  _env = "sandbox";
  _consumer_key = "";
  _consumer_secret = "";
  _pass_key = "";
  _business_short_code;
  _callback_url = "";
  _base_url = "https://sandbox.safaricom.co.ke";
  _password = "";
  _security_credential = "";
  constructor(props) {
    this._env = props.env || "sandbox";
    this._consumer_key = props.consumer_key || "";
    this._consumer_secret = props.consumer_secret || "";
    this._pass_key = props.pass_key || "";
    this._business_short_code = props.business_short_code || 0;
    this._callback_url = props.callback_url || "";
    this._password = props.b2c?.password || "";
    this._security_credential = props.b2c?.security_credential || "";
    this._base_url = props.env === "sandbox" ? "https://sandbox.safaricom.co.ke" : "https://api.safaricom.co.ke";
  }
  /**
   * @name generate_access_token 
   * @description Generates an access token for the mpesa api 
   * @returns 
   */
  async _generate_access_token() {
    const username = this._consumer_key;
    const password = this._consumer_secret;
    const basic_auth = Buffer.from(username + ":" + password).toString("base64");
    const url = `${this._base_url}/oauth/v1/generate`;
    try {
      const res = await fetch(`${url}?grant_type=client_credentials`, {
        method: "GET",
        headers: {
          "Authorization": "Basic " + basic_auth,
          "Content-Type": "application/json"
        }
      });
      let access_token = "";
      if (res.status === 200) {
        const data = await res.json();
        access_token = data.access_token;
      } else {
        return Promise.reject({
          message: "Error generating access token",
          error: await res.json()
        });
      }
      return access_token;
    } catch (e) {
      return Promise.reject({
        message: "Error generating access token",
        error: e?.response?.data
      });
    }
  }
  async _generate_password() {
    const timestamp = format_mpesa_date(/* @__PURE__ */ new Date());
    const pre = `${this._business_short_code}${this._pass_key}${timestamp}`;
    const password = Buffer.from(pre).toString("base64");
    return {
      password,
      timestamp
    };
  }
  /**
   * @name send_payment_request 
   * @description Sends a payment request to the mpesa api 
   * @example 
   * ```ts
   * const client = new MpesaClient({
   *   env: 'sandbox',
   *   consumer_key: process.env.MPESA_CONSUMER_KEY,
   *   consumer_secret: process.env.MPESA_CONSUMER_SECRET,
   *   pass_key: process.env.MPESA_PASSKEY,
   *   business_short_code: process.env.MPESA_SHORTCODE,
   *   callback_url: ''
   * })
   * @param props 
   * @returns 
   */
  async send_payment_request(props) {
    const { transaction_desc, phone_number, transaction_type, amount } = props;
    const base_url = this._base_url;
    const url = `${base_url}/mpesa/stkpush/v1/processrequest`;
    try {
      const access_token = await this._generate_access_token();
      const {
        password,
        timestamp
      } = await this._generate_password();
      const response = await axios.post(url, {
        BusinessShortCode: this._business_short_code,
        Password: password,
        AccountReference: "account",
        Amount: amount,
        CallBackURL: this._callback_url,
        PartyA: phone_number,
        PartyB: this._business_short_code,
        PhoneNumber: phone_number,
        Timestamp: timestamp,
        TransactionDesc: transaction_desc,
        TransactionType: transaction_type
      }, {
        headers: {
          "Authorization": `Bearer ${access_token}`
        }
      });
      return response.data;
    } catch (e) {
      return Promise.reject({
        message: "Error generating sending payment request",
        error: e?.response?.data
      });
    }
  }
  async send_payout_request(props) {
    const { amount, transaction_type, phone_number, description } = props;
    const base_url = this._base_url;
    const url = `${base_url}/mpesa/b2c/v1/paymentrequest`;
    try {
      const access_token = await this._generate_access_token();
      const response = await axios.post(url, {
        InitiatorName: this._password,
        SecurityCredential: this._security_credential,
        CommandID: transaction_type,
        Amount: amount,
        Occassion: "occassion",
        PartyA: this._business_short_code,
        PartyB: phone_number,
        QueueTimeOutURL: this._callback_url,
        ResultURL: this._callback_url,
        Remarks: description
      }, {
        headers: {
          "Authorization": `Bearer ${access_token}`
        }
      });
      return response.data;
    } catch (e) {
      return Promise.reject({
        message: "Error initiating payout",
        error: e?.response?.data
      });
    }
  }
};
var client_default = MpesaClient;
export {
  client_default as default
};
//# sourceMappingURL=client.js.map