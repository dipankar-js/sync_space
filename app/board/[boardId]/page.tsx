'use client'

import Room from '@/components/room'
import Canvas from './_components/canvas'
import CanvasLoading from './_components/canvas-loading'

interface BoardContainerProps {
    params: {
        boardId: string
    }
}
const BoardContainer = ({ params }: BoardContainerProps) => {
    return (
        <Room roomId={params.boardId} fallback={<CanvasLoading />}>
            <Canvas boardId={params.boardId} />
        </Room>
    )
}

export default BoardContainer
