"use client";

import { Card } from '@/components/ui/card'
import { useConversation } from '@/hooks/useConversation'
import { useMutationState } from '@/hooks/useMutationState';
import React, { useRef } from 'react'
import { z } from 'zod'
import { api } from '../../../../../../../convex/_generated/api';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { ConvexError } from 'convex/values';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import TextAreaAutoSize from 'react-textarea-autosize';
import { Button } from '@/components/ui/button';
import { SendHorizonal } from 'lucide-react';


const chatMessageSchema = z.object({
  content : z.string().min(1, {message: "This field can't be empty"})
})

const ChatInput = () => {
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  const { conversationId } = useConversation();
  const { mutate:createMessage, pending } = useMutationState(api.message.create)
  const form = useForm<z.infer<typeof chatMessageSchema>>({
    resolver: zodResolver(chatMessageSchema),
    defaultValues: {
      content: "",
    },
  });
  const handleMessageSubmit = async (values: z.infer<typeof chatMessageSchema>) =>{
    createMessage({
      conversationId,
      type: "text",
      content: [values.content]
    }).then(() => {
      form.reset();
    }).catch((error) => {
      toast.error(error instanceof ConvexError ? error.data : "Unexpected error occured")
    })
  }
  const handleInputChange = (event: any) =>{
    const {value, selectionStart} = event.target;
    if(selectionStart !== null ){
      form.setValue("content", value);
    }
  }
  return (
    <Card className='w-full p-2 rounded-lg relative'>
      <div className='flex gap-2 items-end w-full' >
        <Form {...form} >
          <form className='w-full flex gap-2 items-end' onSubmit={form.handleSubmit(handleMessageSubmit)}>
            <FormField
              control={form.control}
              name='content'
              render={({ field }) => {
                return <FormItem className='w-full h-full'>
                  <FormControl>
                    <TextAreaAutoSize
                      onKeyDown={async e => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          await form.handleSubmit(handleMessageSubmit)();
                        }
                      }}
                      rows={1}
                      maxRows={3}
                      {...field}
                      onChange={handleInputChange}
                      onClick={handleInputChange}
                      placeholder='Type a message'
                      className='min-h-full w-full resize-none border-0 outline-0 bg-card text-card-foreground placeholder:text-muted-foreground p-1.5'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>;
              }}
            />
            <Button disabled={pending} size={'icon'} type='submit' >
              <SendHorizonal />
            </Button>
          </form>
        </Form>
      </div>
    </Card>
  )
}

export default ChatInput