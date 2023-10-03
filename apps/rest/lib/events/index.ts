import EventEmitter from "events";
import { PAYMENT } from "zodiac";


export type APP_EVENTS = "payment.success" |
"payment.failed"

type EVENT_HANDLER_TYPINGS = {
    "payment.success": PAYMENT | null
    "payment.failed": PAYMENT | null
}

class APP_EVENT_HANDLER extends EventEmitter {

    constructor(...args: any[]){
        super()
    }

    public emit = <K extends keyof EVENT_HANDLER_TYPINGS>(event: K, data: EVENT_HANDLER_TYPINGS[K]) => super.emit(event, data)

    public on = <K extends keyof EVENT_HANDLER_TYPINGS>(event: K, listener:(data: EVENT_HANDLER_TYPINGS[K]) => void) => super.on(event, listener) 

}

export default new APP_EVENT_HANDLER()