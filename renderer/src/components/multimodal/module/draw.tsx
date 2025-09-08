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
import { useEffect } from "react";
import { AssistantMultimodalModuleDrawColor } from "./draw/color";
import { AssistantMultimodalModuleDrawSlider } from "./draw/slider";
import { AssistantMultimodalModuleDrawTools } from "./draw/tools";
import { useMediaDevice } from "@/hooks/context/media";

// Props type for the Draw component
type AssistantMultimodalModuleDrawProps = {
    className?: string;
};

// Draw component
export function AssistantMultimodalModuleDraw({ className }: AssistantMultimodalModuleDrawProps) {
    // Get language context
    const { lang } = useLanguage();

    // Get media device context
    const { draw, update_draw } = useMediaDevice();

    // Initialize the canvas when the component is mounted
    useEffect(() => {
        setTimeout(() => {
            const canvas: any = document.getElementById("board");
            draw.canvas = canvas;
            update_draw(draw);
            draw.onInit();
        }, 500);
    }, []);

    return (
        <div className={"w-full h-auto rounded-t-[25px] overflow-y-auto no-scrollbar " + className}>
            <div className="w-full h-auto mx-auto rounded-t-[25px]">
                <div className="w-full h-[366px] relative rounded-t-[25px]">
                    <div className="w-full absolute top-0 left-0 right-0 flex items-center space-x-3 p-2">
                        <AssistantMultimodalModuleDrawColor />
                        <AssistantMultimodalModuleDrawSlider />
                        <AssistantMultimodalModuleDrawTools />
                    </div>
                    <div className="w-full h-full rounded-t-[25px]">
                        <canvas id="board" className="w-full h-full rounded-t-[25px] cursor-crosshair"></canvas>
                    </div>
                </div>
            </div>
        </div>
    );
}
