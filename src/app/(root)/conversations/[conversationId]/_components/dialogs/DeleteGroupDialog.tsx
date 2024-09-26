'use client'

import React, { Dispatch, SetStateAction } from 'react'
import { Id } from '../../../../../../../convex/_generated/dataModel'
import { api } from '../../../../../../../convex/_generated/api'
import { useMutationState } from '@/hooks/useMutationState'
import { toast } from 'sonner'
import { ConvexError } from 'convex/values'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'

type Props = {
    conversationId: Id<"conversations">,
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>
}

const DeleteGroupDialog = ({ conversationId, open, setOpen }: Props) => {
    const { mutate: deleteGroup, pending } = useMutationState(api.conversation.deleteGroup)
    const handledeleteGroup = async () => {
        deleteGroup({ conversationId })
            .then(() => {
                toast.success("Group deleted")
            })
            .catch((error) => {
                toast.error(error instanceof ConvexError ? error.data : "Unexpected error occured")
            })
    }
    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure ?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This Action cannot be undone. All Messages will be deleted and you will not be able
                        to message this group.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={pending} >Cancel</AlertDialogCancel>
                    <AlertDialogAction disabled={pending} onClick={handledeleteGroup} >Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeleteGroupDialog;