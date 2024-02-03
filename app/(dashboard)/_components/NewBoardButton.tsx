import { api } from '@/convex/_generated/api'
import useApiMutation from '@/hooks/useApiMutation'
import { cn } from '@/lib/utils'
import { Plus } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'

interface NewBoardButtonProps {
    orgId: string
    disabled?: boolean
}

const NewBoardButton = ({ orgId, disabled }: NewBoardButtonProps) => {
    const { mutate, isLoading } = useApiMutation(api.board.create)

    const handleCreateBoard = () => {
        mutate({
            orgId,
            title: 'Untitled',
        })
            .then((id) => {
                toast.success('Board created')
            })
            .catch(() => toast.error('Failed to create board'))
    }

    return (
        <button
            disabled={isLoading}
            onClick={handleCreateBoard}
            className={cn(
                'col-span-1 aspect-[100/127] bg-blue-600 rounded-lg hover:bg-blue-800 flex flex-col items-center justify-center py-6',
                (isLoading || disabled) &&
                    'opacity-75 hover:bg-blue-600 cursor-not-allowed'
            )}
        >
            <div />
            <Plus className="h-12 w-12 text-white stroke-1" />
            <p className="text-sm text-white font-light">New Board</p>
        </button>
    )
}

export default NewBoardButton
