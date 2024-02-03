import Image from 'next/image'
import React from 'react'

import { CreateOrganization } from '@clerk/nextjs'

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

const EmptyOrganisation = () => {
    return (
        <div className="h-full flex flex-col items-center justify-center">
            <Image
                src="/empty_board.svg"
                alt="Empty Board"
                height={250}
                width={250}
            />
            <h2 className="text-2xl font-semibold mt-6">
                Welcome to SyncSpace
            </h2>
            <p className="text-muted-foreground text-sm mt-2">
                Create an organization to get started
            </p>
            <div className="mt-6">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button size="lg">Create Organization</Button>
                    </DialogTrigger>
                    <DialogContent className="p-0 bg-transparent border-none max-w-[480px]">
                        <CreateOrganization />
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}

export default EmptyOrganisation
