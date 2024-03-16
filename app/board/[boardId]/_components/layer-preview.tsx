'use client'
import { memo } from 'react'

import { useStorage } from '@/liveblocks.config'
import { LayerType } from '@/types/canvas'
import { rgbToHexCode } from '@/lib/utils'

import Rectangle from './Rectangle'
import Ellipse from './ellipse'
import TextLayer from './text-layer'
import NoteLayer from './note-layer'
import Path from './path'

interface LayerPreviewProps {
    id: string
    onLayerPointerDown: (e: React.PointerEvent, layerId: string) => void
    selectionColor?: string
}

const LayerPreview = ({
    id,
    onLayerPointerDown,
    selectionColor,
}: LayerPreviewProps) => {
    const layer = useStorage((root: any) => root.layers.get(id))

    if (!layer) {
        return null
    }

    switch (layer.type) {
        case LayerType.Path:
            return (
                <Path
                    key={id}
                    points={layer.points}
                    onPointerDown={(e) => onLayerPointerDown(e, id)}
                    x={layer.x}
                    y={layer.y}
                    fill={layer.fill ? rgbToHexCode(layer.fill) : '#000'}
                    stroke={selectionColor}
                />
            )
        case LayerType.Note:
            return (
                <NoteLayer
                    id={id}
                    onPointerDown={onLayerPointerDown}
                    selectionColor={selectionColor}
                    layer={layer}
                />
            )
        case LayerType.Text:
            return (
                <TextLayer
                    id={id}
                    onPointerDown={onLayerPointerDown}
                    selectionColor={selectionColor}
                    layer={layer}
                />
            )
        case LayerType.Ellipse:
            return (
                <Ellipse
                    id={id}
                    onPointerDown={onLayerPointerDown}
                    selectionColor={selectionColor}
                    layer={layer}
                />
            )
        case LayerType.Rectangle:
            return (
                <Rectangle
                    id={id}
                    onPointerDown={onLayerPointerDown}
                    selectionColor={selectionColor}
                    layer={layer}
                />
            )
        default:
            break
    }
}

LayerPreview.displayName = 'LayerPreview'
export default memo(LayerPreview)
