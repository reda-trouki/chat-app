import { ConvexError, v } from "convex/values";
import { query } from "./_generated/server";
import { getUserByClerkId } from "./_utils";

export const get = query({
    args: {
        conversationId: v.id('conversations')
    },
    handler: async (ctx, args) =>{
       const identity = await ctx.auth.getUserIdentity();
       if(!identity) throw new ConvexError("Unauthorized");

        const currentUser = await getUserByClerkId({ctx, clerkId: identity.subject});
        if(!currentUser) throw new ConvexError("User not found");

        const membership = await ctx.db.query("conversationsMembers")
        .withIndex("by_meberId_conversationsId", q=> q.eq("memberId", currentUser._id).eq("conversationId", args.conversationId)).unique();
        if(!membership) throw new ConvexError("You are not a member of this conversation");

       const messages = ctx.db.query("messages")
       .withIndex("by_conversationId", q => q.eq("conversationId", args.conversationId))
       .order("desc").collect();

       const messagesWithUsers = Promise.all((await messages).map(async (message) =>{
        const messageSender  = await ctx.db.get(message.senderId);
        if(!messageSender) throw new ConvexError("Message sender not found");

        return {
            message,
            senderImage: messageSender.imageUrl,
            senderName: messageSender.username,
            isCurrentUser: messageSender._id === currentUser._id
        }
       }))

       return messagesWithUsers;
    }
})