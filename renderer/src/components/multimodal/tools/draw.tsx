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
import { PlaygroundProps } from "@/pages/playground";
import { BrushIcon } from "lucide-react";

// Props type for the Drawboard component
type AssistantMultimodalToolsDrawProps = {
    className?: string;
    playground: PlaygroundProps;
};

// Drawboard component definition
export function AssistantMultimodalToolsDraw({ className, playground }: AssistantMultimodalToolsDrawProps) {
    return (
        <div className={"w-auto " + className}>
            <Button disabled={!playground.connected} variant="secondary" size="icon" data-hide={playground.draw.hidden} className="rounded-[18px] data-[hide=false]:bg-blue-50">
                <BrushIcon data-hide={playground.draw.hidden} className="size-4 data-[hide=false]:text-blue-500" />
            </Button>
        </div>
    );
}
