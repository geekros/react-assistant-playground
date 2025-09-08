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

// Props type for the Drawboard component
type AssistantMultimodalModuleChatProps = {
    className?: string;
};

export function AssistantMultimodalModuleChat({ className }: AssistantMultimodalModuleChatProps) {
    // Get language context
    const { lang } = useLanguage();

    useEffect(() => {}, []);

    // Handle the message input event
    return (
        <div className={"w-full h-full overflow-y-auto no-scrollbar " + className}>
            <div className="w-full min-h-full flex flex-col justify-end mx-auto max-w-2xl pt-[48px] pb-[140px]">
                <div className="w-full space-y-3 whitespace-pre-wrap">
                    <div className="flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm bg-muted">Hi, how can I help you today?</div>
                    <div className="flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm bg-primary text-primary-foreground ml-auto">Hey, I'm having trouble with my account.</div>
                </div>
            </div>
        </div>
    );
}
