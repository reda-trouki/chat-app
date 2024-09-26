"use client"

import ConversationContainer from '@/components/shared/conversation/ConversationContainer'
import { useConversation } from '@/hooks/useConversation'
import { useQuery } from 'convex/react'
import React, { useState } from 'react'
import { api } from '../../../../../convex/_generated/api'
import { Id } from '../../../../../convex/_generated/dataModel'
import { Loader2 } from 'lucide-react'
import Header from './_components/Header'
import Body from './_components/body/Body'
import ChatInput from './_components/input/ChatInput'
import RemoveFriendDialog from './_components/dialogs/RemoveFriendDialog'
import DeleteGroupDialog from './_components/dialogs/DeleteGroupDialog'
import LeaveGroupDialog from './_components/dialogs/LeaveGroupDialog'

type Props = {
  params: {
    conversationId: Id<"conversations">
  }
}

const ConversationPage = ({params: {conversationId}}: Props) => {

  const conversation = useQuery(api.conversation.get, {id: conversationId})
  const [removeFriedDialogOpen, setRemoveFriedDialogOpen ] = useState(false);
  const [deleteGroupDialogOpen, setDeleteGroupDialogOpen] = useState(false);
  const [leaveGroupDialogOpen, setLeaveGroupDialogOpen] = useState(false);
  const [callType, setCallType] = useState<"audio" | "video" | null>(null);

  return conversation === undefined ? <div className='w-full h-full flex items-center justify-center'>
    <Loader2 className='w-8 h-8' />
  </div> : conversation === null ?
    <p className='w-full h-full flex items-center justify-center'>Conversation Not found</p>
  : <ConversationContainer>
    <RemoveFriendDialog conversationId={conversationId} open={removeFriedDialogOpen} setOpen={setRemoveFriedDialogOpen} />
    <DeleteGroupDialog conversationId={conversationId} open={deleteGroupDialogOpen} setOpen={setDeleteGroupDialogOpen} />
    <LeaveGroupDialog conversationId={conversationId} open={leaveGroupDialogOpen} setOpen={setLeaveGroupDialogOpen} />
    <Header
      name={(conversation.isGroup ? conversation.name : conversation.otherMember?.username ) || ""}
      imageUrl={conversation.isGroup ? undefined: conversation.otherMember?.imageUrl }
      options={conversation.isGroup ? [
        {
          label: "Leave Group",
          desctructive: false,
          onClick: () => setLeaveGroupDialogOpen(true)
        },
        {
          label: "Delete Group",
          desctructive: true,
          onClick: () => setDeleteGroupDialogOpen(true)
        },
      ] : [
        {
          label: "Remove Friend",
          desctructive: true,
          onClick: () => setRemoveFriedDialogOpen(true)
        }
      ]}
    />
    <Body members={conversation.isGroup
    ? conversation.otherMembers ? conversation.otherMembers : []
    : conversation.otherMember? [conversation.otherMember] : []} />
    <ChatInput/>
  </ConversationContainer>
}

export default ConversationPage