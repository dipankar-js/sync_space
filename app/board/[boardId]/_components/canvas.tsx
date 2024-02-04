'use client'

import { useState } from 'react'

import {
    useCanRedo,
    useCanUndo,
    useHistory,
    useSelf,
} from '@/liveblocks.config'
import Info from './info'
import Participants from './participants'
import Toolbar from './toolbar'
import { CanvasMode, CanvasState } from '@/types/canvas'

interface CanvasProps {
    boardId: string
}

const Canvas = ({ boardId }: CanvasProps) => {
    const info = useSelf((me) => me.info)
    const history = useHistory()
    const canUndo = useCanUndo()
    const canRedo = useCanRedo()

    const [canvasState, setCanvasState] = useState<CanvasState>({
        mode: CanvasMode.None,
    })

    return (
        <div className="h-full w-full relative bg-natural-500 touch-none">
            <Info boardId={boardId} />
            <Participants />
            <Toolbar
                canvasState={canvasState}
                setCanvasState={setCanvasState}
                canRedo={canRedo}
                canUndo={canUndo}
                undo={history.undo}
                redo={history.redo}
            />
        </div>
    )
}

export default Canvas
