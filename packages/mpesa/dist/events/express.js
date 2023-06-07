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

// src/events/express.ts
var ExpressMpesaEvents = class extends EventEmitter {
  constructor() {
    super();
    this.paymentsCallbackHandler = this.paymentsCallbackHandler.bind(this);
    this.payoutsCallbackHandler = this.payoutsCallbackHandler.bind(this);
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
};
var express_default = new ExpressMpesaEvents();
export {
  ExpressMpesaEvents,
  express_default as default
};
//# sourceMappingURL=express.js.map