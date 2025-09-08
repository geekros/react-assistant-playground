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
import { ChevronDownIcon, LoaderCircleIcon, MicIcon, MicOffIcon, PowerIcon } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/base/dropdown-menu";
import { useEffect, useRef, useState } from "react";
import { AssistantConnectVisualizer } from "./visualizer";
import { useMediaDevice } from "@/hooks/context/media";

// Props type for the AssistantConnect component
type AssistantConnectProps = {
    className?: string;
};

// Assistant Connect Component
export function AssistantConnect({ className }: AssistantConnectProps) {
    // Language context
    const { lang } = useLanguage();

    // Get media context
    const { device, microphone, update_microphone } = useMediaDevice();

    // Microphone state
    const [connected, setConnected] = useState<boolean>(false);

    // Heights for visualizer bars
    const [heights, setHeights] = useState<number[]>([50, 50, 50, 50, 50]);

    // Interval for remote updates
    const timerRef = useRef<any>(null);

    // Connect to the microphone
    function onConnect() {
        if (microphone.initialization) {
            microphone.loading = false;
            setConnected(true);
            update_microphone(microphone);
            return;
        }
        device.GetAudio(
            (media_stream: MediaStream, input_device_infos: InputDeviceInfo[], input_device_info: InputDeviceInfo, media_stream_track: MediaStreamTrack) => {
                setTimeout(() => {
                    const audio: any = document.getElementById("audio_connect_stream");
                    audio.srcObject = media_stream;
                    audio.onloadedmetadata = function (_e: any) {
                        audio.play();
                    };
                }, 500);
                microphone.stream = media_stream;
                microphone.devices = input_device_infos;
                microphone.active_device = input_device_info;
                microphone.active_device_track = media_stream_track;
                microphone.enabled = !media_stream_track.enabled;
                microphone.loading = false;
                setConnected(true);
                update_microphone(microphone);
            },
            (error: any) => {
                microphone.error = error.message;
                microphone.loading = false;
                setConnected(false);
                update_microphone(microphone);
            }
        );
    }

    // Toggle microphone enable/disable
    function onDeviceDisable() {
        if (microphone.active_device_track) {
            microphone.enabled = !microphone.enabled;
            microphone.active_device_track.enabled = !microphone.enabled;
            update_microphone(microphone);
        }
    }

    // Disconnect from the microphone
    function onDisconnect() {
        if (timerRef.current != null) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
        setConnected(false);
        update_microphone(microphone);
    }

    useEffect(() => {
        // Start interval to update visualizer heights
        timerRef.current = setInterval(() => {
            if (connected) {
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
    }, [connected]);

    // Cleanup on component unmount
    useEffect(() => {
        // Cleanup on component unmount
        return () => {
            if (timerRef.current != null) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        };
    }, []);

    // Render component
    return (
        <div className={"w-full h-[380px] " + className}>
            <div className="w-full h-full flex items-center justify-center">
                <div className="w-auto h-auto space-y-8">
                    <div className="w-full h-[100px] flex items-center justify-center space-x-3">
                        {Array.from({ length: 5 }).map((_, i) => {
                            const isCenter = i === 2;
                            const height = heights[i];
                            if (isCenter) {
                                return (
                                    <div
                                        key={i}
                                        className={`bg-muted-foreground/10 rounded-full transition-all duration-500 ease-in-out transform ${
                                            !connected ? "opacity-100 scale-100" : "opacity-100 scale-100"
                                        }`}
                                        style={{
                                            width: !connected ? "100px" : "50px",
                                            height: !connected ? "100px" : "50px",
                                            backgroundColor: "rgb(255, 255, 255)",
                                            backgroundImage: "radial-gradient(at 76% 31%, rgb(0, 208, 250) 0px, transparent 50%), radial-gradient(at 20% 81%, rgb(0, 216, 255) 0px, transparent 50%)",
                                            backgroundSize: "300% 300%",
                                            filter: "drop-shadow(rgba(255, 255, 255, 0.5) 0px 0px 45px)",
                                            animation: "20s ease 0s infinite normal none running gradient-animation, 2s ease-out 0s infinite alternate none running rotate-animation",
                                        }}
                                    ></div>
                                );
                            } else {
                                return (
                                    <div
                                        key={i}
                                        className={`w-[50px] h-[50px] bg-muted-foreground/10 rounded-full transition-all duration-500 ease-in-out transform ${
                                            !connected ? "opacity-0 scale-100" : "opacity-100 scale-100 animate-pulse"
                                        }`}
                                        style={{
                                            height: `${height}px`,
                                        }}
                                    ></div>
                                );
                            }
                        })}
                    </div>
                    <div className="w-full">
                        {!connected ? (
                            <div className="w-full flex items-center justify-center">
                                <Button onClick={onConnect} disabled={microphone.loading} className="w-auto" size="sm" variant="secondary">
                                    {microphone.loading ? <LoaderCircleIcon className="w-4 h-4 animate-spin" /> : <MicIcon className="w-4 h-4" />}
                                    <span className="text-xs">{lang(microphone.loading ? "common.connecting" : "common.connect")}</span>
                                </Button>
                            </div>
                        ) : (
                            <div className="w-full flex items-center justify-center space-x-2">
                                <div className="w-auto">
                                    <Button className="w-full" size="sm" variant="secondary">
                                        {microphone.enabled ? (
                                            <div onClick={onDeviceDisable}>
                                                <MicOffIcon className="w-4 h-4 mr-1" />
                                            </div>
                                        ) : (
                                            <div onClick={onDeviceDisable}>
                                                <MicIcon className="w-4 h-4 mr-1" />
                                            </div>
                                        )}
                                        <span className="text-xs mr-1">
                                            <AssistantConnectVisualizer stream={microphone.stream} bands={6} />
                                        </span>
                                        <div className="border-border border-l pl-2">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <span>
                                                        <ChevronDownIcon className="w-4 h-4" />
                                                    </span>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" side="top">
                                                    <DropdownMenuLabel className="uppercase">Microphone</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuRadioGroup value={microphone.active_device?.deviceId || ""}>
                                                        {microphone.devices.map((item: any) => {
                                                            return (
                                                                <DropdownMenuRadioItem className="text-xs text-muted-foreground" key={item.deviceId} value={item.deviceId}>
                                                                    {item.label}
                                                                </DropdownMenuRadioItem>
                                                            );
                                                        })}
                                                    </DropdownMenuRadioGroup>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </Button>
                                </div>
                                <div className="w-auto">
                                    <Button onClick={onDisconnect} disabled={microphone.loading} className="w-full" size="sm" variant="destructive">
                                        {microphone.loading ? <LoaderCircleIcon className="w-4 h-4 animate-spin" /> : <PowerIcon className="w-4 h-4" />}
                                        <span className="text-xs">{lang("common.disconnect")}</span>
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
