'use client'
import { memo } from 'react'

import { useStorage } from '@/liveblocks.config'
import { LayerType } from '@/types/canvas'

import Rectangle from './Rectangle'

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
    const layer = useStorage((root) => root.layers.get(id))

    if (!layer) {
        return null
    }

    switch (layer.type) {
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
