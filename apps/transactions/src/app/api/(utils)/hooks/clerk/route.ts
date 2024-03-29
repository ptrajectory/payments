import { WebhookEvent } from "@clerk/nextjs/server"
import { SELLER } from "db/schema"
import db from "db"
import { generate_unique_id } from "generators"
import { NextResponse } from "next/server"




export const POST = async (request: Request) => {

    
    const event: WebhookEvent = await request.json()
    
    
    try {
        
        switch(event.type) {
            
            case "user.created": {
              const user = event.data;
              const email_id = user?.primary_email_address_id;
              const email = user?.email_addresses?.find(
                ({ id }) => id === email_id
              )?.email_address;

              if (!email) {
                return NextResponse.json(null, {
                  status: 400,
                });
              } //TODO: add logger

              const result = await db
                .insert(SELLER)
                .values({
                  id: generate_unique_id("sll"),
                  email: email,
                  avatar: user?.image_url,
                  first_name: user?.first_name,
                  last_name: user?.last_name,
                  uid: user.id,
                })
                .returning();

              return NextResponse.json(
                {},
                {
                  status: 200,
                }
              );
            };
            default:{
                //TODO: don't know what to do here
                // TODO: will figure out later

            }
            
        }
        
    }
    catch (e)
    {   

        // TODO: send this error somewhere
        
    }
    
    return NextResponse.json(
      {},
      {
        status: 200,
      }
    );
}