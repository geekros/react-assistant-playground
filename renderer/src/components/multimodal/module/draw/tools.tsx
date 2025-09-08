// Copyright 2025 GEEKROS, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { Button } from "@/components/base/button";
import { useLanguage } from "@/hooks/context/language";
import { useMediaDevice } from "@/hooks/context/media";
import { BrushCleaningIcon, RedoIcon, UndoIcon } from "lucide-react";
import { useEffect } from "react";

// Props type for the Drawboard component
type AssistantMultimodalModuleDrawToolsProps = {
    className?: string;
};

export function AssistantMultimodalModuleDrawTools({ className }: AssistantMultimodalModuleDrawToolsProps) {
    // Get language context
    const { lang } = useLanguage();

    // Get media device context
    const { draw, drawboard, update_drawboard } = useMediaDevice();

    // Undo the last drawing action
    function onUndo() {
        draw.onUndo();
    }

    // Redo the last undone drawing action
    function onRedo() {
        draw.onRedo();
    }

    // Clear the drawing board
    function onClear() {
        draw.onClear();
    }

    // Side effect to log when the component is mounted
    useEffect(() => {}, []);

    // Render the tools component
    return (
        <div className={"w-full h-9 flex items-center justify-end space-x-3 " + className}>
            <div className="w-auto">
                <Button onClick={onUndo} disabled={drawboard.history.length === 0} variant="secondary" className="cursor-pointer" size="icon">
                    <UndoIcon className="size-4" />
                </Button>
            </div>
            <div className="w-auto">
                <Button onClick={onRedo} disabled={drawboard.redoStack.length === 0} variant="secondary" className="cursor-pointer" size="icon">
                    <RedoIcon className="size-4" />
                </Button>
            </div>
            <div className="w-auto">
                <Button onClick={onClear} variant="secondary" className="w-full cursor-pointer">
                    <BrushCleaningIcon className="size-4" />
                    <span className="text-xs">{lang("common.clean")}</span>
                </Button>
            </div>
        </div>
    );
}
