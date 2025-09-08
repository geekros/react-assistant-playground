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
import { PlaygroundProps } from "@/pages/playground";
import { LoaderCircleIcon, MonitorUpIcon } from "lucide-react";

// Props type for the Screenshare component
type AssistantMultimodalToolsScreenshareProps = {
    className?: string;
    playground: PlaygroundProps;
};

// Screenshare component definition
export function AssistantMultimodalToolsScreenshare({ className, playground }: AssistantMultimodalToolsScreenshareProps) {
    // Language context
    const { lang } = useLanguage();

    // Media context
    const { screenshare } = useMediaDevice();

    // Render the component
    return (
        <div className={"w-auto " + className}>
            <Button disabled={!playground.connected} variant="secondary" size="icon" data-status={screenshare.initialization} className="rounded-[18px] data-[status=true]:bg-blue-50">
                {screenshare.loading ? (
                    <LoaderCircleIcon className="size-4 animate-spin" />
                ) : (
                    <MonitorUpIcon data-status={screenshare.initialization} className="size-4 data-[status=true]:text-blue-500" />
                )}
            </Button>
        </div>
    );
}
