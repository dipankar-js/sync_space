import Image from 'next/image'
import React from 'react'

import { CreateOrganization } from '@clerk/nextjs'

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

const EmptySearch = () => {
    return (
        <div className="h-full flex flex-col items-center justify-center">
            <Image
                src="/empty_search.svg"
                alt="Empty Board"
                height={250}
                width={250}
            />
            <h2 className="text-2xl font-semibold mt-6">No results found!</h2>
            <p className="text-muted-foreground text-sm mt-2">
                Try searching for something else
            </p>
        </div>
    )
}

export default EmptySearch
