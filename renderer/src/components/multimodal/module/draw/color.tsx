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

import { useLanguage } from "@/hooks/context/language";
import { useMediaDevice } from "@/hooks/context/media";
import { useEffect } from "react";

// Props type for the Drawboard component
type AssistantMultimodalModuleDrawColorProps = {
    className?: string;
};

export function AssistantMultimodalModuleDrawColor({ className }: AssistantMultimodalModuleDrawColorProps) {
    // Get language context
    const { lang } = useLanguage();

    // Get media device context
    const { drawboard, update_drawboard } = useMediaDevice();

    // Handle color selection
    function selectColor(color: string) {
        drawboard.color = color;
        update_drawboard(drawboard);
    }

    // Side effect to log when the component is mounted
    useEffect(() => {}, []);

    // Render the color selection component
    return (
        <div className={"w-auto h-9 px-2 space-x-1 flex items-center bg-secondary rounded-[25px] " + className}>
            {drawboard.colors.map((color: string) => (
                <div
                    key={color}
                    onClick={() => {
                        selectColor(color);
                    }}
                    data-current={drawboard.color === color}
                    className="w-[22px] h-[22px] rounded-[11px] opacity-20 data-[current=true]:opacity-100 cursor-pointer"
                    style={{ backgroundColor: color }}
                ></div>
            ))}
        </div>
    );
}
