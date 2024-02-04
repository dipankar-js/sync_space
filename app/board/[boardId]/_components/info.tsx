'use client'

import Actions from '@/components/actions'
import Hint from '@/components/hint'
import { Button } from '@/components/ui/button'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { cn } from '@/lib/utils'
import { useQuery } from 'convex/react'
import { Menu } from 'lucide-react'
import { Poppins } from 'next/font/google'
import Image from 'next/image'
import Link from 'next/link'

const font = Poppins({
    subsets: ['latin'],
    weight: ['600'],
})

interface InfoProps {
    boardId: string
}

export const TabSeperator = () => {
    return <div className="text-neutral-300 px-1.5">|</div>
}

const Info = ({ boardId }: InfoProps) => {
    const data = useQuery(api.board.getBoard, {
        id: boardId as Id<'boards'>,
    })

    if (!data) return <Info.Skeleton />

    return (
        <div className="absolute top-2 left-2 bg-white rounded-md px-1.5 h-12 flex items-center shadow-md">
            <Hint label="Go to boards" side="bottom" sideOffset={10}>
                <Button asChild variant="board" className="px-2">
                    <Link href="/">
                        <Image
                            src="/logo.svg"
                            alt="Board Logo"
                            height={40}
                            width={40}
                        />
                        <span
                            className={cn(
                                'font-semibold text-xl ml-2 text-black',
                                font.className
                            )}
                        >
                            Board
                        </span>
                    </Link>
                </Button>
            </Hint>
            <TabSeperator />
            <p className="text-base font-normal px-2">{data.title}</p>
            <TabSeperator />
            <Actions
                id={data._id}
                title={data.title}
                side="bottom"
                sideOffset={10}
            >
                <div>
                    <Hint label="Main Menu" side="bottom" sideOffset={10}>
                        <Button size="icon" variant="board">
                            <Menu />
                        </Button>
                    </Hint>
                </div>
            </Actions>
        </div>
    )
}

Info.Skeleton = function InfoSkeletion() {
    return (
        <div className="absolute top-2 left-2 bg-white rounded-md px-1.5 h-12 flex items-center shadow-md w-[300px]" />
    )
}

export default Info
