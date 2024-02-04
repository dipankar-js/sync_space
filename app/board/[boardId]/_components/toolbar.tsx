"use client"

import { Circle, MousePointer2, Pen, Redo2, Square, StickyNote, Type, Undo2 } from 'lucide-react'

import ToolButton from './tool-button'

const Toolbar = () => {
    return (
        <div className="absolute top-[50%] -translate-y-[50%] left-2 flex flex-col gap-y-4">
            <div className="bg-white rounded-md p-1.5 flex gap-y-1 flex-col items-center shadow-md">
               <ToolButton label="Select"  icon={MousePointer2} onClick={()=> {}} isActive={false} />
               <ToolButton label="Text"  icon={Type} onClick={()=> {}} isActive={false} />
               <ToolButton label="Sticky Note"  icon={StickyNote} onClick={()=> {}} isActive={false} />
               <ToolButton label="Rectangle"  icon={Square} onClick={()=> {}} isActive={false} />
               <ToolButton label="Ellipse"  icon={Circle} onClick={()=> {}} isActive={false} />
               <ToolButton label="Pen"  icon={Pen} onClick={()=> {}} isActive={false} />
            </div>
            <div className="bg-white rounded-md p-1.5 flex flex-col items-center shadow-md">
            <ToolButton label="Undo"  icon={Undo2} onClick={()=> {}} isActive={false} isDisabled={true} />
            <ToolButton label="REDO"  icon={Redo2} onClick={()=> {}} isActive={false}  isDisabled={true} />
            </div>
        </div>
    )
}

Toolbar.Skeleton = function ToolbarSkeletion() {
    return (
        <div className="absolute top-[50%] -translate-y-[50%] left-2 flex flex-col gap-y-4 bg-white h-[360px] w-[52px] shadow-md rounded-md" />
    )
}

export default Toolbar