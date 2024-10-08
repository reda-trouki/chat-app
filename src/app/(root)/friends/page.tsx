'use client'

import ConversationFallBack from '@/components/shared/conversation/ConversationFallBack'
import ItemList from '@/components/shared/item-list/ItemList'
import AddFriendDialog from './_components/AddFriendDialog'
import { useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { Loader2 } from 'lucide-react'
import Request from './_components/Request'

type Props = {}

const FriendsPage = (props: Props) => {

  const requests = useQuery(api.requests.get);

  return (
    <>
      <ItemList title='Friends' action={<AddFriendDialog />} >
        {requests
          ? requests.length === 0
          ? <p className='w-full h-full flex items-center justify-center' >No friends request found</p>
          : requests.map((request: any) => (
            <Request
              key={request.request._id}
              id={request.request._id}
              imageUrl={request.sender.imageUrl}
              username={request.sender.username}
              email={request.sender.email}
             />
          ))
        : <Loader2 className='h-8 w-8' /> }
      </ItemList>
      <ConversationFallBack />
    </>
  )
}

export default FriendsPage