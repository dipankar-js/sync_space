"use client";

import { memo } from "react";
import { BringToFront, SendToBack, Trash2 } from "lucide-react";

import { Camera, Color } from "@/types/canvas";
import { Button } from "@/components/ui/button";
import { useMutation, useSelf } from "@/liveblocks.config";

import Hint from "@/components/hint";

// Hooks
import useDeleteLayers  from "@/hooks/useDeleteLayers";
import {useSelectionBounds} from "@/hooks/useSelectionBounds";

import  ColorPicker  from "./color-picker";

interface SelectionToolsProps {
  camera: Camera;
  setLastUsedColor: (color: Color) => void;
};

const SelectionTools = memo(({
  camera,
  setLastUsedColor,
}: SelectionToolsProps) => {
  const selection = useSelf((me) => me.presence.selection);

  const setFill = useMutation((
    { storage },
    fill: Color,
  ) => {
    const liveLayers = storage.get("layers");
    setLastUsedColor(fill);

    selection.forEach((id) => {
      liveLayers.get(id)?.set("fill", fill);
    })
  }, [selection, setLastUsedColor]);

  const deleteLayers = useDeleteLayers();

  const selectionBounds = useSelectionBounds();

  if (!selectionBounds) {
    return null;
  }

  const x = selectionBounds.width / 2 + selectionBounds.x + camera.x;
  const y = selectionBounds.y + camera.y;

  return (
    <div
      className="absolute p-3 rounded-xl bg-white shadow-sm border flex select-none"
      style={{
        transform: `translate(
          calc(${x}px - 50%),
          calc(${y - 16}px - 100%)
        )`
      }}
    >
      <ColorPicker
        onChange={setFill}
      />  
      <div className="flex items-center">
        <Hint label="Delete">
          <Button
            variant="board"
            size="icon"
            onClick={deleteLayers}
          >
            <Trash2 />
          </Button>
        </Hint>
      </div>
    </div>
  );
});

SelectionTools.displayName = "SelectionTools";
export default SelectionTools;