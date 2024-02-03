'use client'

import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import OverLay from './OverLay'
import { useAuth } from '@clerk/nextjs'
import { formatDistanceToNow } from 'date-fns'
import Footer from './Footer'
import { Skeleton } from '@/components/ui/skeleton'

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

    const authorLabel = userId === authorId ? 'You' : authorName
    const createdAtLabel = formatDistanceToNow(createdAt, { addSuffix: true })

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
                </div>
                <Footer
                    isFavourite={isFavourite}
                    title={title}
                    authorLabel={authorLabel}
                    createdAtLabel={createdAtLabel}
                    onClick={() => {}}
                    disabled={false}
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
