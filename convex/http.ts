import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { WebhookEvent } from '@clerk/nextjs/server';
import { Webhook } from "svix";
import { internal } from './_generated/api';

const validatePayload = async (req:Request): Promise<WebhookEvent | undefined> =>{
    const payload = await req.text();
    const svixHeaders = {
        "svix-id": req.headers.get("svix-id")!,
        "svix-timestamp": req.headers.get("svix-timestamp")!,
        "svix-signature": req.headers.get("svix-signature")!,
    };

    const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET || "");
    try {
        const event = webhook.verify(payload, svixHeaders) as WebhookEvent;
        return event;
    } catch (error) {
        console.error("Clerk webhook could not be verified");
        return;
    }
}

const handleClerkWebhook = httpAction(async (ctx, req) =>{
    // const event = await validatePayload(req);

    // following code is from the clerk docs
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error(
      'Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local'
    )
  }

  // Get the headers
  const svix_id = req.headers.get('svix-id')
  const svix_timestamp = req.headers.get('svix-timestamp')
  const svix_signature = req.headers.get('svix-signature')

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occurred -- no svix headers', {
      status: 400
    })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET)

  let event: WebhookEvent

  // Verify the payload with the headers
  try {
    event = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error occurred', {
      status: 400
    })
  }
    if(!event){
        return new Response("Could not validate clerk Payload", {status: 400});
    }
    switch(event.type){
        case "user.created":
            const user = await ctx.runQuery(internal.user.get, {clerkId: event.data.id});
            if(user){
                console.log(`Updating user ${event.data.id} with ${event.data}`);
                break;
            }
        case "user.updated":
            console.log(`Creating/Updating user ${event.data.id}`);
            await ctx.runMutation(internal.user.create,{
                username: `${event.data.first_name} ${event.data.last_name}`,
                imageUrl: event.data.image_url,
                clerkId: event.data.id,
                email: event.data.email_addresses[0].email_address,
            })
            break;
        default:
            console.log("Clerk event webhook not supported", event.type);
    }
    return new Response(null, {status: 200});
});

const http = httpRouter();

http.route({
    path: "/clerk-users-webhook",
    method: "POST",
    handler: handleClerkWebhook
});

export default http;
