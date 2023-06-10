// src/events/express.ts
import EventEmitter from "events";

// src/lib/schemas.ts
import z from "zod";
var payout_request_callback_body_schema = z.object({
  Result: z.object({
    ResultType: z.number().optional(),
    ResultCode: z.number().optional(),
    ResultDesc: z.string().optional(),
    OriginatorConversationID: z.string().optional(),
    ConversationID: z.string().optional(),
    TransactionID: z.string().optional(),
    ReferenceData: z.object({
      ReferenceItem: z.object({
        Key: z.string().optional(),
        Value: z.string().optional()
      }).optional()
    }).optional()
  }).optional()
});
var payment_request_callback_body_schema = z.object({
  Body: z.object({
    stkCallback: z.object({
      MerchantRequestID: z.string(),
      CheckoutRequestID: z.string(),
      ResultCode: z.number().optional(),
      ResultDesc: z.string().optional(),
      CallbackMetadata: z.object({
        Item: z.array(z.object({
          Name: z.string(),
          Value: z.string()
        })).optional()
      }).array().optional()
    })
  })
});
var payment_request_body = z.object({
  amount: z.number().min(0, {
    message: "Amount cann't be 0 or less"
  }),
  phone_number: z.number(),
  transaction_desc: z.string().optional(),
  transaction_type: z.enum(["CustomerPayBillOnline", "CustomerBuyGoodsOnline"])
});
var payout_request_body = z.object({
  amount: z.number().min(0, {
    message: "Amount cann't be 0 or less"
  }),
  phone_number: z.number(),
  transaction_desc: z.string().optional(),
  transaction_type: z.enum(["BusinessPayment", "SalaryPayment", "PromotionPayment"])
});

// src/events/express.ts
import "dotenv/config";

// src/client.ts
import axios, { AxiosError } from "axios";

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
  _callback_url = "";
  _base_url = "https://sandbox.safaricom.co.ke";
  _b2c = {};
  _c2b = {};
  constructor(props) {
    this._env = props.env || "sandbox";
    this._base_url = props.env === "sandbox" || props.env === void 0 ? "https://sandbox.safaricom.co.ke" : "https://api.safaricom.co.ke";
    this._b2c = props.b2c || {};
    this._c2b = props.c2b || {};
    this._callback_url = props.callback_url || "";
  }
  /**
   * @name generate_access_token 
   * @description Generates an access token for the mpesa api 
   * @returns 
   */
  async _generate_access_token(type = "c2b") {
    const username = type === "b2c" ? this._b2c.consumer_key : this._c2b.consumer_key;
    const password = type === "b2c" ? this._b2c.consumer_secret : this._c2b.consumer_secret;
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
          error: res.statusText
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
  async _generate_password(type = "c2b") {
    const timestamp = format_mpesa_date(/* @__PURE__ */ new Date());
    const short_code = type === "b2c" ? this._b2c.short_code : this._c2b.short_code;
    const pass_key = type === "b2c" ? this._b2c.pass_key : this._c2b.pass_key;
    const pre = `${short_code}${pass_key}${timestamp}`;
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
      const access_token = await this._generate_access_token("c2b");
      const {
        password,
        timestamp
      } = await this._generate_password("c2b");
      const response = await axios.post(url, {
        BusinessShortCode: this._c2b.short_code,
        Password: password,
        AccountReference: this._c2b.business_name,
        Amount: amount,
        CallBackURL: `${this._callback_url}/c2b/callback`,
        PartyA: phone_number,
        PartyB: this._c2b.short_code,
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
      if (e instanceof AxiosError) {
        return Promise.reject({
          message: "Error sending payment request",
          error: e.response?.data
        });
      }
      return Promise.reject({
        message: "Error sending payment request",
        error: e
      });
    }
  }
  async send_payout_request(props) {
    const { amount, transaction_type, phone_number, transaction_desc } = props;
    const base_url = this._base_url;
    const url = `${base_url}/mpesa/b2c/v1/paymentrequest`;
    try {
      const access_token = await this._generate_access_token("b2c");
      const response = await axios.post(url, {
        InitiatorPassword: this._b2c.security_credential,
        InitiatorName: this._b2c.business_name,
        SecurityCredential: this._b2c.security_credential,
        CommandID: transaction_type,
        Amount: amount,
        Occassion: "occassion",
        PartyA: this._b2c.short_code,
        PartyB: phone_number,
        QueueTimeOutURL: `${this._callback_url}/b2c/timeout`,
        ResultURL: `${this._callback_url}/b2c/result`,
        Remarks: transaction_desc
      }, {
        headers: {
          "Authorization": `Bearer ${access_token}`
        }
      });
      return response.data;
    } catch (e) {
      if (e instanceof AxiosError) {
        return Promise.reject({
          message: "Error initiating payout",
          error: e.response?.data
        });
      }
      return Promise.reject({
        message: "Error initiating payout",
        error: e
      });
    }
  }
  /**
   * @name set_callback_url
   * @description for testing purposes, i.e when you need to dynamically change the callback url
   * @param url 
   */
  set_callback_url(url) {
    this._callback_url = url;
  }
  /**
   * @name set_client 
   * !!! INTERNAL USE ONLY !!!
   * @description this is for any clients e.g the express client, that rely on this client to set the env
   * @param props 
   */
  set_client(props) {
    this._env = props.env || "sandbox";
    this._b2c.business_name = props.b2c_business_name || "";
    this._c2b.business_name = props.c2b_business_name || "";
  }
};
var client_default = MpesaClient;

// src/events/express.ts
var ExpressMpesaEvents = class extends EventEmitter {
  client;
  constructor() {
    super();
    this.paymentsCallbackHandler = this.paymentsCallbackHandler.bind(this);
    this.payoutsCallbackHandler = this.payoutsCallbackHandler.bind(this);
    this.paymentRequestHandler = this.paymentRequestHandler.bind(this);
    this.payoutRequestHandler = this.payoutRequestHandler.bind(this);
    this.client = new client_default({
      b2c: {
        consumer_key: process.env.B2C_MPESA_CONSUMER_KEY,
        consumer_secret: process.env.B2C_MPESA_CONSUMER_SECRET,
        pass_key: process.env.B2C_MPESA_PASSKEY,
        password: process.env.B2C_PASSWORD,
        security_credential: process.env.B2C_SECURITY_CREDENTIAL,
        short_code: Number(process.env.B2C_MPESA_SHORTCODE)
      },
      c2b: {
        consumer_key: process.env.C2B_MPESA_CONSUMER_KEY,
        consumer_secret: process.env.C2B_MPESA_CONSUMER_SECRET,
        pass_key: process.env.C2B_MPESA_PASSKEY,
        short_code: Number(process.env.C2B_MPESA_SHORTCODE)
      }
    });
  }
  /**
   * Emits an event.
   * 
   * @param event The event to emit.
   * @param data The data to pass to the event listeners.
   */
  emit = (event, data) => super.emit(event, data);
  /**
   * Registers an event listener.
   * 
   * @param event The event to listen for.
   * @param listener The callback function to run when the event is emitted.
   */
  on = (event, listener) => super.on(event, listener);
  /**
   * @description Handles the callback from the mpesa api for payouts
   * @param req 
   * @param res 
   */
  async payoutsCallbackHandler(req, res) {
    res.status(200).send("OK");
    const parsed = payout_request_callback_body_schema.safeParse(req.body);
    if (!parsed.success) {
      this.emit("payout:invalid", {
        received: req.body,
        error: parsed.error.formErrors
      });
    } else {
      const data = parsed.data;
      try {
        switch (data.Result?.ResultCode?.toString()) {
          case "0": {
            this.emit("payout:success", data);
            break;
          }
          default: {
            this.emit("payout:error", data);
          }
        }
      } catch (e) {
        this.emit("uncaughtException", e);
      }
    }
  }
  /**
   * @description Handles the callback from the mpesa api for payments
   * @param req 
   * @param res 
   */
  async paymentsCallbackHandler(req, res) {
    res.status(200).send("OK");
    const parsed = payment_request_callback_body_schema.safeParse(req.body);
    if (!parsed.success) {
      this.emit("payment:invalid", {
        received: req.body,
        error: parsed.error.formErrors
      });
    } else {
      const data = parsed.data;
      try {
        switch (data.Body?.stkCallback?.ResultCode?.toString()) {
          case "0": {
            this.emit("payment:success", data);
            break;
          }
          default: {
            this.emit("payment:error", data);
          }
        }
      } catch (e) {
        this.emit("uncaughtException", e);
      }
    }
  }
  /**
   * @name payoutRequestHandler
   * @description Handles the payment request from the client
   * @param req 
   * @param res 
   */
  async paymentRequestHandler(req, res) {
    const body = req.body;
    const parsed = payment_request_body.safeParse(body);
    if (!parsed.success) {
      this.emit("payment-request:error", {
        type: "body-error",
        error: parsed.error.formErrors
      });
      res.status(400).send(parsed.error.formErrors);
      return;
    }
    const data = parsed.data;
    try {
      const daraja_response = await this.client.send_payment_request(data);
      const code = daraja_response?.ResponseCode;
      switch (code) {
        case "0":
          {
            res.status(200).send(daraja_response);
            this.emit("payment-request:success", daraja_response);
            break;
          }
          ;
        default: {
          res.status(500).send({
            message: "Wrong result code returned",
            error: daraja_response
          });
          this.emit("payment-request:error", {
            type: "code",
            error: daraja_response
          });
          return;
        }
      }
    } catch (e) {
      res.status(500).send({
        message: "Something went wrong",
        error: e
      });
      this.emit("payment-request:error", {
        type: "unknown",
        error: e
      });
      return;
    }
  }
  async payoutRequestHandler(req, res) {
    const body = req.body;
    const parsed = payout_request_body.safeParse(body);
    if (!parsed.success) {
      this.emit("payout-request:error", {
        type: "body-error",
        error: parsed.error.formErrors
      });
      res.status(400).send(parsed.error.formErrors);
      return;
    }
    const data = parsed.data;
    try {
      const daraja_response = await this.client.send_payout_request(data);
      const code = daraja_response?.ResponseCode;
      switch (code) {
        case "0":
          {
            res.status(200).send(daraja_response);
            this.emit("payout-request:success", daraja_response);
            break;
          }
          ;
        default: {
          res.status(500).send({
            message: "Wrong result code returned",
            error: daraja_response
          });
          this.emit("payout-request:error", {
            type: "code",
            error: daraja_response
          });
          return;
        }
      }
    } catch (e) {
      res.status(500).send({
        message: "Something went wrong",
        error: e
      });
      this.emit("payout-request:error", {
        type: "unknown",
        error: e
      });
      return;
    }
  }
  /**
   * @name setTestUrl
   * @description Sets the test url for the client, this is for when your callback url will probably change dynamically e.g when testing with ngrok
   * @param url 
   */
  setTestUrl(url) {
    this.client.set_callback_url(url);
  }
  /**
   * @name init
   * @description Initializes the client with details, that cannot be automatically set using environment variables 
   *              - **Note** be sure to call this at the start of your application or before you start using the client
   * 
   * @param props 
   */
  init(props) {
    this.client.set_client({
      env: props.env,
      b2c_business_name: props.b2c_business_name,
      c2b_business_name: props.c2b_business_name
    });
  }
};
var express_default = new ExpressMpesaEvents();
export {
  ExpressMpesaEvents,
  express_default as default
};
//# sourceMappingURL=express.js.map