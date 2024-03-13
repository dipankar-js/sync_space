'use client'

import React, { memo } from 'react'

import { useOthersConnectionIds } from '@/liveblocks.config'
import Cursor from './cursor'

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

const CursorsPresense = memo(() => {
    return (
        <>
            <Cursors />
        </>
    )
})

CursorsPresense.displayName = 'CursorsPresense'
export default CursorsPresense
