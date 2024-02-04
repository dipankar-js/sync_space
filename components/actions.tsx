'use client'

import { DropdownMenuContentProps } from '@radix-ui/react-dropdown-menu'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Link2, Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import useApiMutation from '@/hooks/useApiMutation'
import { api } from '@/convex/_generated/api'
import ConfirmModal from './confirm-modal'
import { Button } from './ui/button'
import useRenameModal from '@/store/useRenameModal'

interface ActionsProps {
    children: React.ReactNode
    side?: DropdownMenuContentProps['side']
    sideOffset?: DropdownMenuContentProps['sideOffset']
    id: string
    title: string
}

const Actions = ({ children, side, sideOffset, id, title }: ActionsProps) => {
    const { onOpen } = useRenameModal()

    const { mutate, isLoading } = useApiMutation(api.board.remove)

    const onCopyLink = () => {
        navigator.clipboard
            .writeText(`${window.location.origin}/board/${id}`)
            .then(() => toast.success('Link copied'))
            .catch(() => toast.error('Failed to copy link'))
    }

    const onDelete = () => {
        mutate({ id })
            .then(() => toast.success('Board deleted'))
            .catch((e) => toast.error('Failed to delete board'))
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-60"
                onClick={(e) => e.stopPropagation()}
                side={side}
                sideOffset={sideOffset}
            >
                <DropdownMenuItem
                    onClick={onCopyLink}
                    className="p-3 cursor-pointer"
                >
                    <Link2 className="h-4 w-4 mr-2" />
                    Copy board link
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => onOpen(id, title)}
                    className="p-3 cursor-pointer"
                >
                    <Pencil className="h-4 w-4 mr-2" />
                    Rename
                </DropdownMenuItem>
                <ConfirmModal
                    header="Delete board ?"
                    description="This will delete the board and all of ots contents"
                    disabled={isLoading}
                    onConfirm={onDelete}
                >
                    <Button
                        variant="ghost"
                        className="p-3 cursor-pointer text-sm w-full justify-start font-normal"
                    >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                    </Button>
                </ConfirmModal>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default Actions
