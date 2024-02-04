'use client'

import { useSelf } from '@/liveblocks.config'
import Info from './info'
import Participants from './participants'
import Toolbar from './toolbar'

interface CanvasProps {
    boardId: string
}

const Canvas = ({ boardId }: CanvasProps) => {
    const info = useSelf((me) => me.info)

    return (
        <div className="h-full w-full relative bg-natural-100 touch-none">
            <Info boardId={boardId} />
            <Participants />
            <Toolbar />
        </div>
    )
}

export default Canvas