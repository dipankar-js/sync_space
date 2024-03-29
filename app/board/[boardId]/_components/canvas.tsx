'use client'

import { useState, useCallback, useMemo } from 'react'

import { nanoid } from 'nanoid'
import {
    useCanRedo,
    useCanUndo,
    useHistory,
    useMutation,
    useOthersMapped,
    useSelf,
    useStorage,
} from '@/liveblocks.config'
import Info from './info'
import Participants from './participants'
import Toolbar from './toolbar'
import {
    Camera,
    CanvasMode,
    CanvasState,
    Color,
    LayerType,
    Point,
    Side,
    XYWH,
} from '@/types/canvas'
import CursorsPresense from './cursors-presense'
import {
    connectionIdToColor,
    pointerEventToCanvasPoint,
    resizeBounds,
    penPointsToPathLayer,
    rgbToHexCode,
} from '@/lib/utils'
import { LiveObject } from '@liveblocks/client'
import LayerPreview from './layer-preview'
import SelectionBox from './selection-box'
import SelectionTools from './selection-tools'
import Path from './path'

const MAX_LAYERS = 100

interface CanvasProps {
    boardId: string
}

const Canvas = ({ boardId }: CanvasProps) => {
    const layerIds = useStorage((root: any) => root.layerIds)
    const info = useSelf((me) => me.info)

    const [camera, setCamera] = useState<Camera>({ x: 0, y: 0 })
    const [lastUsedColor, setLastUsedColor] = useState<Color>({
        r: 0,
        g: 0,
        b: 0,
    })

    const pencilDraft = useSelf((me) => me.presence.pencilDraft)
    const [canvasState, setCanvasState] = useState<CanvasState>({
        mode: CanvasMode.None,
    })

    const history = useHistory()
    const canUndo = useCanUndo()
    const canRedo = useCanRedo()

    const insertLayer = useMutation(
        (
            { storage, setMyPresence },
            layerType:
                | LayerType.Ellipse
                | LayerType.Rectangle
                | LayerType.Text
                | LayerType.Note,
            position: Point
        ) => {
            const liveLayers = storage.get('layers')

            if (liveLayers.size >= MAX_LAYERS) {
                return
            }

            const liveLayerIds = storage.get('layerIds')
            const layerId = nanoid()
            const layer: any = new LiveObject({
                type: layerType,
                x: position.x,
                y: position.y,
                height: 100,
                width: 100,
                fill: lastUsedColor,
            })

            liveLayerIds.push(layerId)
            liveLayers.set(layerId, layer)

            setMyPresence({ selection: [layerId] }, { addToHistory: true })
            setCanvasState({ mode: CanvasMode.None })
        },
        [lastUsedColor]
    )

    const onResizeHandlePointerDown = useCallback(
        (corner: Side, initialBounds: XYWH) => {
            history.pause()
            setCanvasState({
                mode: CanvasMode.Resizing,
                initialBounds,
                corner,
            })
        },
        [history]
    )

    const resizeSelectedLayer = useMutation(
        ({ storage, self }, point: Point) => {
            if (canvasState.mode !== CanvasMode.Resizing) {
                return
            }
            const bounds = resizeBounds(
                canvasState.initialBounds,
                canvasState.corner,
                point
            )

            const liveLayers = storage.get('layers')
            const layer = liveLayers.get(self.presence.selection[0])

            if (layer) {
                layer.update(bounds)
            }
        },
        [canvasState]
    )

    const translateSelectedLayer = useMutation(
        ({ storage, self }, point: Point) => {
            if (canvasState.mode !== CanvasMode.Translating) {
                return
            }

            const offset = {
                x: point.x - canvasState.current.x,
                y: point.y - canvasState.current.y,
            }

            const liveLayers = storage.get('layers')

            for (const id of self.presence.selection) {
                const layer = liveLayers.get(id)
                if (layer) {
                    layer.update({
                        x: (layer.get('x') as number) + offset.x,
                        y: layer.get('y') + offset.y,
                    })
                }
            }
            setCanvasState({ mode: CanvasMode.Translating, current: point })
        },
        [canvasState]
    )

    const unSelectLayers = useMutation(({ self, setMyPresence }) => {
        if (self.presence.selection.length > 0) {
            setMyPresence({ selection: [] }, { addToHistory: true })
        }
    }, [])

    const onWheel = useCallback((e: React.WheelEvent) => {
        setCamera((camera) => ({
            x: camera.x - e.deltaX,
            y: camera.y - e.deltaY,
        }))
    }, [])

    const continueDrawing = useMutation(
        ({ self, setMyPresence }, point: Point, e: React.PointerEvent) => {
            const { pencilDraft } = self.presence

            if (
                canvasState.mode !== CanvasMode.Pencil ||
                e.buttons !== 1 ||
                pencilDraft == null
            ) {
                return
            }

            setMyPresence({
                cursor: point,
                pencilDraft:
                    pencilDraft.length === 1 &&
                    pencilDraft[0][0] === point.x &&
                    pencilDraft[0][1] === point.y
                        ? pencilDraft
                        : [...pencilDraft, [point.x, point.y, e.pressure]],
            })
        },
        [canvasState.mode]
    )

    const insertPath = useMutation(
        ({ storage, self, setMyPresence }) => {
            const liveLayers = storage.get('layers')
            const { pencilDraft } = self.presence

            if (
                pencilDraft == null ||
                pencilDraft.length < 2 ||
                liveLayers.size >= MAX_LAYERS
            ) {
                setMyPresence({ pencilDraft: null })
                return
            }

            const id = nanoid()
            liveLayers.set(
                id,
                new LiveObject(
                    penPointsToPathLayer(pencilDraft, lastUsedColor) as any
                )
            )

            const liveLayerIds = storage.get('layerIds')
            liveLayerIds.push(id)

            setMyPresence({ pencilDraft: null })
            setCanvasState({ mode: CanvasMode.Pencil })
        },
        [lastUsedColor]
    )

    const startDrawing = useMutation(
        ({ setMyPresence }, point: Point, pressure: number) => {
            setMyPresence({
                pencilDraft: [[point.x, point.y, pressure]],
                pencilColor: lastUsedColor,
            })
        },
        []
    )

    const onPointerMove = useMutation(
        ({ setMyPresence }, e: React.PointerEvent) => {
            e.preventDefault()
            const current = pointerEventToCanvasPoint(e, camera)

            if (canvasState.mode === CanvasMode.Translating) {
                translateSelectedLayer(current)
            } else if (canvasState.mode === CanvasMode.Resizing) {
                resizeSelectedLayer(current)
            } else if (canvasState.mode === CanvasMode.Pencil) {
                continueDrawing(current, e)
            }

            setMyPresence({ cursor: current })
        },
        [
            canvasState,
            resizeSelectedLayer,
            camera,
            translateSelectedLayer,
            continueDrawing,
        ]
    )

    const onPointerUp = useMutation(
        ({}, e) => {
            const point = pointerEventToCanvasPoint(e, camera)

            if (
                canvasState.mode === CanvasMode.None ||
                canvasState.mode === CanvasMode.Pressing
            ) {
                unSelectLayers()
                setCanvasState({ mode: CanvasMode.None })
            } else if (canvasState.mode === CanvasMode.Pencil) {
                insertPath()
            } else if (canvasState.mode === CanvasMode.Inserting) {
                insertLayer(canvasState.layerType, point)
            } else {
                setCanvasState({
                    mode: CanvasMode.None,
                })
            }
            history.resume()
        },
        [camera, canvasState, history, insertLayer, unSelectLayers, insertPath]
    )

    const onPointerDown = useCallback(
        (e: React.PointerEvent) => {
            const point = pointerEventToCanvasPoint(e, camera)

            if (canvasState.mode === CanvasMode.Inserting) {
                return
            }

            if (canvasState.mode === CanvasMode.Pencil) {
                startDrawing(point, e.pressure)
                return
            }

            setCanvasState({ origin: point, mode: CanvasMode.Pressing })
        },
        [camera, canvasState.mode, setCanvasState, startDrawing]
    )

    const selections = useOthersMapped((other) => other.presence.selection)

    const onLayerPointerDown = useMutation(
        ({ self, setMyPresence }, e: React.PointerEvent, layerId: string) => {
            if (
                canvasState.mode === CanvasMode.Pencil ||
                canvasState.mode === CanvasMode.Inserting
            ) {
                return
            }

            history.pause()
            e.stopPropagation()

            const point = pointerEventToCanvasPoint(e, camera)

            if (!self.presence.selection.includes(layerId)) {
                setMyPresence({ selection: [layerId] }, { addToHistory: true })
            }

            setCanvasState({ mode: CanvasMode.Translating, current: point })
        },
        [setCanvasState, camera, history, canvasState.mode]
    )

    const layerIdsToColorSelection = useMemo(() => {
        const layerIdsToColorSelection: Record<string, string> = {}

        for (const user of selections) {
            const [connectionId, selection] = user

            for (const layerId of selection) {
                layerIdsToColorSelection[layerId] =
                    connectionIdToColor(connectionId)
            }
        }
        return layerIdsToColorSelection
    }, [selections])

    const onPointerLeave = useMutation(
        ({ setMyPresence }, e: React.PointerEvent) => {
            setMyPresence({ cursor: null })
        },
        []
    )

    return (
        <main className="h-full w-full relative bg-natural-500 touch-none">
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
            <SelectionTools
                camera={camera}
                setLastUsedColor={setLastUsedColor}
            />
            <svg
                onWheel={onWheel}
                onPointerMove={onPointerMove}
                onPointerLeave={onPointerLeave}
                onPointerUp={onPointerUp}
                onPointerDown={onPointerDown}
                className="h-[100vh] w-[100vw]"
            >
                <g
                    style={{
                        transform: `translate(${camera.x}px, ${camera.y}px)`,
                    }}
                >
                    {layerIds.map((layerId: any) => (
                        <LayerPreview
                            key={layerId}
                            id={layerId}
                            onLayerPointerDown={onLayerPointerDown}
                            selectionColor={layerIdsToColorSelection[layerId]}
                        />
                    ))}
                    <SelectionBox
                        onResizeHandlePointerDown={onResizeHandlePointerDown}
                    />
                    <CursorsPresense />
                    {pencilDraft != null && pencilDraft.length > 0 && (
                        <Path
                            points={pencilDraft}
                            fill={rgbToHexCode(lastUsedColor)}
                            x={0}
                            y={0}
                        />
                    )}
                </g>
            </svg>
        </main>
    )
}

export default Canvas
