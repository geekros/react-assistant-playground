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

import { Slider } from "@/components/base/slider";
import { useLanguage } from "@/hooks/context/language";
import { useMediaDevice } from "@/hooks/context/media";
import { useEffect } from "react";

// Props type for the Drawboard component
type AssistantMultimodalModuleDrawSliderProps = {
    className?: string;
};

export function AssistantMultimodalModuleDrawSlider({ className }: AssistantMultimodalModuleDrawSliderProps) {
    // Get language context
    const { lang } = useLanguage();

    // Get media device context
    const { drawboard, update_drawboard } = useMediaDevice();

    // Handle slider value change
    function onChange(value: any) {
        drawboard.size = value[0];
        update_drawboard(drawboard);
    }

    // Side effect to log when the component is mounted
    useEffect(() => {}, []);

    // Render the slider component
    return (
        <div className={"w-auto h-9 px-3 space-x-1 flex items-center bg-secondary/50 rounded-[25px] " + className}>
            <Slider onValueChange={onChange} defaultValue={[drawboard.size]} min={1} max={20} step={1} className="w-[200px]" />
        </div>
    );
}
