'use client'

import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import OverLay from './OverLay'
import { useAuth } from '@clerk/nextjs'
import { formatDistanceToNow } from 'date-fns'
import Footer from './Footer'
import { Skeleton } from '@/components/ui/skeleton'
import { MoreHorizontal } from 'lucide-react'

import Actions from '@/components/actions'
import useApiMutation from '@/hooks/useApiMutation'
import { api } from '@/convex/_generated/api'
import { toast } from 'sonner'

interface BoardCardProps {
    id: string
    title: string
    authorId: string
    authorName: string
    createdAt: number
    imageUrl: string
    orgId: string
    isFavourite: boolean
}

const BoardCard = ({
    id,
    title,
    authorId,
    authorName,
    createdAt,
    imageUrl,
    orgId,
    isFavourite,
}: BoardCardProps) => {
    const { userId } = useAuth()
    const { mutate: onFavorite, isLoading: isFavoriteLoading } = useApiMutation(
        api.board.makeFavorite
    )
    const { mutate: onRemoveFavorite, isLoading: isRemoveFavoriteLoading } =
        useApiMutation(api.board.removeFavorite)

    const authorLabel = userId === authorId ? 'You' : authorName
    const createdAtLabel = formatDistanceToNow(createdAt, { addSuffix: true })

    const toggleFavorite = () => {
        if (isFavourite) {
            onRemoveFavorite({ id }).catch(() =>
                toast('Failed to remove favorite')
            )
        } else {
            onFavorite({ id, orgId }).catch(() => toast('Failed to favorite'))
        }
    }

    return (
        <Link href={`/board/${id}`}>
            <div className="group aspect-[100/127] border rounded-lg flex flex-col justify-between overflow-hidden">
                <div className="relative flex-1 bg-amber-50">
                    <Image
                        src={imageUrl}
                        alt="Doodle"
                        fill
                        className="object-fit"
                    />
                    <OverLay />
                    <Actions id={id} title={title} side="right">
                        <button className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity px-3 py-2 outline-none">
                            <MoreHorizontal className="text-white opacity-75 hover:opacity-100 translate-opacity" />
                        </button>
                    </Actions>
                </div>
                <Footer
                    isFavourite={isFavourite}
                    title={title}
                    authorLabel={authorLabel}
                    createdAtLabel={createdAtLabel}
                    toggleFavorite={toggleFavorite}
                    disabled={isFavoriteLoading || isRemoveFavoriteLoading}
                />
            </div>
        </Link>
    )
}

BoardCard.Skeleton = function BoardCardSkeleton() {
    return (
        <div className="group aspect-[100/127] rounded-lg flex flex-col justify-between overflow-hidden">
            <Skeleton className="h-full w-full" />
        </div>
    )
}

export default BoardCard
