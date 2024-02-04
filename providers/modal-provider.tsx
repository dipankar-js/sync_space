'use client'

import { useState, useEffect } from 'react'

// Modals
import RenameModal from '@/components/modals/rename-modal'

const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) return null

    return (
        <>
            <RenameModal />
        </>
    )
}

export default ModalProvider
