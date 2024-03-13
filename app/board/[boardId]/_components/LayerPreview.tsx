'use client'

import { useStorage } from '@/liveblocks.config'
import { LayerType } from '@/types/canvas'
import { memo } from 'react'

interface LayerPreviewProps {
    id: string
    onLayerPointDown: (e: React.PointerEvent, layerId: string) => void
    selectionColor?: string
}

const LayerPreview = ({
    id,
    onLayerPointDown,
    selectionColor,
}: LayerPreviewProps) => {
    const layer = useStorage((root) => root.layers.get(id))

    if (!layer) {
        return null
    }

    switch (layer.type) {
        case LayerType.Rectangle:
            return <div>Rectangle</div>
        default:
            break
    }
}

LayerPreview.displayName = 'LayerPreview'
export default memo(LayerPreview)
