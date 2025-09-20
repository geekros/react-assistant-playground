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
import { PlaygroundProps } from "@/pages/playground";
import { useEffect, useRef, useState } from "react";

// Props type for the Drawboard component
type AssistantMultimodalModuleAssistantProps = {
    className?: string;
    playground: PlaygroundProps;
};

export function AssistantMultimodalModuleAssistant({ className, playground }: AssistantMultimodalModuleAssistantProps) {
    // Get language context
    const { lang } = useLanguage();

    // Get media context
    const { camera, screenshare } = useMediaDevice();

    // Heights for visualizer bars
    const [heights, setHeights] = useState<number[]>([50, 50, 50, 50, 50]);

    // Interval for remote updates
    const timerRef = useRef<any>(null);

    useEffect(() => {
        // Start interval to update visualizer heights
        timerRef.current = setInterval(() => {
            if (playground.connected) {
                setHeights((prev) => prev.map((h, i) => (i === 2 ? h : Math.floor(50 + Math.random() * 30))));
            } else {
                setHeights((prev) => prev.map((h, i) => (i === 2 ? h : 50)));
            }
        }, 500);

        // Cleanup on component unmount
        return () => {
            if (timerRef.current != null) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        };
    }, [playground.connected]);

    // Handle the message input event
    return (
        <div className={"w-full h-full flex items-center justify-center " + className}>
            <audio id="agent_audio_stream" className="hidden"></audio>
            <div className="w-full h-[100px] flex items-center justify-center space-x-3">
                {Array.from({ length: 5 }).map((_, i) => {
                    const isCenter = i === 2;
                    const height = heights[i];
                    if (isCenter) {
                        return (
                            <div
                                key={i}
                                className={`bg-muted-foreground/10 rounded-full transition-all duration-500 ease-in-out transform ${
                                    !playground.connected ? "opacity-100 scale-100" : "opacity-100 scale-100"
                                }`}
                                style={{
                                    width: (!playground.connected ? "100px" : camera.enabled && screenshare.enabled && playground.draw.hidden && playground.message.hidden ? "50px" : "25px") as string,
                                    height: (!playground.connected
                                        ? "100px"
                                        : camera.enabled && screenshare.enabled && playground.draw.hidden && playground.message.hidden
                                        ? "50px"
                                        : "25px") as string,
                                    backgroundColor: "rgb(255, 255, 255)",
                                    backgroundImage: "radial-gradient(at 76% 31%, rgb(0, 208, 250) 0px, transparent 50%), radial-gradient(at 20% 81%, rgb(0, 216, 255) 0px, transparent 50%)",
                                    backgroundSize: "300% 300%",
                                    filter: "drop-shadow(rgba(255, 255, 255, 0.5) 0px 0px 45px)",
                                    animation: "20s ease 0s infinite normal none running gradient-animation, 2s ease-out 0s infinite alternate none running rotate-animation",
                                }}
                                data-screenshare={screenshare.enabled}
                                data-camera={camera.enabled}
                            ></div>
                        );
                    } else {
                        return (
                            <div
                                key={i}
                                className={`w-[50px] h-[50px] bg-muted-foreground/10 rounded-full transition-all duration-500 ease-in-out transform ${
                                    !playground.connected ? "opacity-0 scale-100" : "opacity-100 scale-100 animate-pulse"
                                }`}
                                style={{
                                    width: `${camera.enabled && screenshare.enabled && playground.draw.hidden && playground.message.hidden ? 50 : 25}px`,
                                    height: `${camera.enabled && screenshare.enabled && playground.draw.hidden && playground.message.hidden ? height : height / 2}px`,
                                }}
                            ></div>
                        );
                    }
                })}
            </div>
        </div>
    );
}
