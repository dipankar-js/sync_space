'use client'

import Image from 'next/image'
import React from 'react'
import { useRouter } from 'next/navigation'

import { api } from '@/convex/_generated/api'

import { Button } from '@/components/ui/button'
import { useOrganization } from '@clerk/nextjs'
import useApiMutation from '@/hooks/useApiMutation'
import { toast } from 'sonner'

const EmptyBoards = () => {
    const router = useRouter()
    const { organization } = useOrganization()
    const { mutate, isLoading } = useApiMutation(api.board.create)

    const onClick = () => {
        if (!organization) return
        mutate({
            orgId: organization.id,
            title: 'Untitled',
        })
            .then((id) => {
                toast.success('Board Created')
                router.push(`/board/${id}`)
            })
            .catch(() => toast.error('Failed to create board'))
    }

    return (
        <div className="h-full flex flex-col items-center justify-center">
            <Image
                src="/empty_note.svg"
                alt="Empty Board"
                height={200}
                width={200}
            />
            <h2 className="text-2xl font-semibold mt-6">
                Create your first board!
            </h2>
            <p className="text-muted-foreground text-sm mt-2">
                Start by creating a board for your organisation
            </p>
            <div className="mt-6" onClick={onClick}>
                <Button disabled={isLoading} size="lg">
                    Create Board
                </Button>
            </div>
        </div>
    )
}

export default EmptyBoards
