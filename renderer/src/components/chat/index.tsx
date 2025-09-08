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

import { cn } from "@/libs/utils/utils";
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/base/input";
import { Button } from "@/components/base/button";
import { ArrowUpIcon } from "lucide-react";

type ChatProps = {
    className?: string;
};

export function Chat({ className }: ChatProps) {
    const [messages, setMessages] = useState([
        {
            role: "assistant",
            content: "Hi, how can I help you today?",
        },
        {
            role: "user",
            content: "Hey, I'm having trouble with my account.",
        },
        {
            role: "assistant",
            content: "What seems to be the problem?",
        },
        {
            role: "user",
            content: "I can't log in.",
        },
        {
            role: "assistant",
            content: "Hi, how can I help you today?",
        },
        {
            role: "user",
            content: "Hey, I'm having trouble with my account.",
        },
        {
            role: "assistant",
            content: "What seems to be the problem?",
        },
        {
            role: "user",
            content: "I can't log in.",
        },
        {
            role: "assistant",
            content: "What seems to be the problem?",
        },
        {
            role: "user",
            content: "I can't log in.",
        },
    ]);

    const [input, setInput] = useState("");
    const inputLength = input.trim().length;

    const scrollRef: any = useRef(null);

    useEffect(() => {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, []);

    useEffect(() => {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages]);

    return (
        <div className={"w-full h-[380px] " + className}>
            <div className="w-full h-[calc(100%-50px)]">
                <div ref={scrollRef} className="w-full h-full overflow-y-scroll scrollbar-hidden">
                    <div className="w-full flex flex-col gap-4 mb-[20px]">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={cn(
                                    "flex w-max max-w-[80%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
                                    message.role === "user" ? "bg-primary text-primary-foreground ml-auto" : "bg-muted"
                                )}
                            >
                                {message.content}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="w-full h-[50px] flex items-center justify-center">
                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        if (inputLength === 0) return;
                        setMessages([
                            ...messages,
                            {
                                role: "user",
                                content: input,
                            },
                        ]);
                        setInput("");
                    }}
                    className="relative w-full"
                >
                    <Input id="message" placeholder="Type your message..." className="flex-1 pr-10" autoComplete="off" value={input} onChange={(event) => setInput(event.target.value)} />
                    <Button type="submit" size="icon" className="absolute top-1/2 right-2 size-6 -translate-y-1/2 rounded-full" disabled={inputLength === 0}>
                        <ArrowUpIcon className="size-3.5" />
                        <span className="sr-only">Send</span>
                    </Button>
                </form>
            </div>
        </div>
    );
}
