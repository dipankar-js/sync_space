'use client'
import React, { useState, useEffect, FormEvent, FormEventHandler } from 'react'

import useRenameModal from '@/store/useRenameModal'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '../ui/dialog'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import useApiMutation from '@/hooks/useApiMutation'
import { api } from '@/convex/_generated/api'
import { toast } from 'sonner'

const RenameModal = () => {
    const { mutate, isLoading } = useApiMutation(api.board.update)
    const { isOpen, onClose, initialValues } = useRenameModal()

    const [title, setTitle] = useState(initialValues.title)

    useEffect(() => {
        setTitle(initialValues.title)
    }, [initialValues])

    const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault()
        mutate({
            id: initialValues.id,
            title,
        })
            .then(() => {
                toast.success('Board title updated')
                onClose()
            })
            .catch(() => toast('Board rename failed'))
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit board title</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    Enter a new title for this
                </DialogDescription>
                <form onSubmit={onSubmit} className="space-y-6">
                    <Input
                        disabled={isLoading}
                        required
                        maxLength={60}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Board title"
                    />
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={isLoading}>
                            Save
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default RenameModal
