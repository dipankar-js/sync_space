import Image from 'next/image'
import React from 'react'

import { CreateOrganization } from '@clerk/nextjs'

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

const EmptyFavorites = () => {
    return (
        <div className="h-full flex flex-col items-center justify-center">
            <Image
                src="/empty_favorites.svg"
                alt="Empty Board"
                height={250}
                width={250}
            />
            <h2 className="text-2xl font-semibold mt-6">
                No favorites boards found!
            </h2>
            <p className="text-muted-foreground text-sm mt-2">
                Try favoriting a board
            </p>
        </div>
    )
}

export default EmptyFavorites
