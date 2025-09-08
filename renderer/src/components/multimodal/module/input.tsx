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
import { Input } from "@/components/base/input";
import { useLanguage } from "@/hooks/context/language";
import { PlaygroundProps } from "@/pages/playground";
import { LoaderCircleIcon } from "lucide-react";

// Props type for the Drawboard component
type AssistantMultimodalModuleInputProps = {
    className?: string;
    playground: PlaygroundProps;
    playground_update: (playground: PlaygroundProps) => void;
};

export function AssistantMultimodalModuleInput({ className, playground, playground_update }: AssistantMultimodalModuleInputProps) {
    // Get language context
    const { lang } = useLanguage();

    // Handle message input change
    function onMessageEvent(event: any) {
        playground.message.input = event.target.value;
        playground_update(playground);
    }

    // Handle message send action
    function onSendMessage() {
        if (!playground.connected) return;
        playground.message.send_loading = true;
        playground_update(playground);
        setTimeout(() => {
            playground.message.input = "";
            playground.message.send_loading = false;
            playground_update(playground);
        }, 2000);
    }

    // Handle the message input event
    return (
        <form className={"w-auto px-[8px] py-[7px] rounded-b-[25px] " + className} action={onSendMessage}>
            <div className="w-full h-9 flex items-center justify-between space-x-1">
                <div className="w-full h-8">
                    <Input
                        id="message"
                        placeholder={lang("chat.input_placeholder")}
                        className="w-full px-2 shadow-none border-0 !bg-transparent outline-none placeholder:text-muted-foreground focus-visible:ring-0 focus:ring-0 focus:ring-offset-0"
                        autoComplete="off"
                        disabled={playground.message.send_loading}
                        value={playground.message.input}
                        onChange={onMessageEvent}
                    />
                </div>
                <div className="w-auto h-8">
                    <Button
                        type="submit"
                        disabled={playground.message.send_loading || playground.message.input.trim() == ""}
                        className="h-8 uppercase rounded-[25px] hover:cursor-pointer"
                        variant="secondary"
                    >
                        {playground.message.send_loading ? <LoaderCircleIcon className="w-3 h-3 animate-spin" /> : null}
                        <span className="text-xs">{lang("common.send")}</span>
                    </Button>
                </div>
            </div>
        </form>
    );
}
