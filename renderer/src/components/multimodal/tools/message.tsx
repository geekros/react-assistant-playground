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
import { PlaygroundProps } from "@/pages/playground";
import { MessageSquareTextIcon } from "lucide-react";

// Props type for the Message component
type AssistantMultimodalToolsMessageProps = {
    className?: string;
    playground: PlaygroundProps;
};

// Message component definition
export function AssistantMultimodalToolsMessage({ className, playground }: AssistantMultimodalToolsMessageProps) {
    // Language context
    const { lang } = useLanguage();

    // Render the component
    return (
        <div className={"w-auto " + className}>
            <Button disabled={!playground.connected} variant="secondary" size="icon" data-hide={playground.message.hidden} className="rounded-[18px] data-[hide=false]:bg-blue-50">
                <MessageSquareTextIcon data-hide={playground.message.hidden} className="size-4 data-[hide=false]:text-blue-500" />
            </Button>
        </div>
    );
}
