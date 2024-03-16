'use client'

import React, { memo } from 'react'
import { shallow } from '@liveblocks/client'

import { useOthersConnectionIds, useOthersMapped } from '@/liveblocks.config'

import { rgbToHexCode } from '@/lib/utils'

import Cursor from './cursor'
import Path from './path'

const Cursors = () => {
    const ids = useOthersConnectionIds()

    return (
        <>
            {ids.map((connectionId) => (
                <Cursor key={connectionId} connectionId={connectionId} />
            ))}
        </>
    )
}

const Drafts = () => {
    const others = useOthersMapped(
        (other: any) => ({
            pencilDraft: other.presence.pencilDraft,
            penColor: other.presence.penColor,
        }),
        shallow
    )

    return (
        <>
            {others.map(([key, other]) => {
                if (other.pencilDraft) {
                    return (
                        <Path
                            key={key}
                            x={0}
                            y={0}
                            points={other.pencilDraft}
                            fill={
                                other.penColor
                                    ? rgbToHexCode(other.penColor)
                                    : '#000'
                            }
                        />
                    )
                }

                return null
            })}
        </>
    )
}

const CursorsPresense = memo(() => {
    return (
        <>
            <Cursors />
        </>
    )
})

CursorsPresense.displayName = 'CursorsPresense'
export default CursorsPresense
