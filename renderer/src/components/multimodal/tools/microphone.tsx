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
import { ChevronDownIcon, MicIcon, MicOffIcon } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/base/dropdown-menu";
import { PlaygroundProps } from "@/pages/playground";
import { AssistantMultimodalVisualizerMicrophone } from "../visualizer/microphone";

// Props type for the DeviceMicrophone component
type AssistantMultimodalToolsMicrophoneProps = {
    className?: string;
    playground: PlaygroundProps;
};

// DeviceMicrophone component definition
export function AssistantMultimodalToolsMicrophone({ className, playground }: AssistantMultimodalToolsMicrophoneProps) {
    // Language context
    const { lang } = useLanguage();

    // Get media context
    const { device, microphone, update_microphone } = useMediaDevice();

    // Switch microphone device
    function onSwitch(item: any) {
        const deviceId = item.deviceId;
        if (deviceId === microphone.active_device?.deviceId) {
            return;
        }
        device.SwitchAudio(
            deviceId,
            (media_stream: MediaStream, audios: InputDeviceInfo[], active_audio: InputDeviceInfo, active_audio_track: MediaStreamTrack) => {
                microphone.stream = media_stream;
                microphone.devices = audios;
                microphone.active_device = active_audio;
                microphone.active_device_track = active_audio_track;
                microphone.enabled = !active_audio_track.enabled;
                microphone.loading = false;
                microphone.initialization = true;
                update_microphone(microphone);
            },
            (error: any) => {
                console.error("Switch microphone error", error);
                microphone.error = error.message;
                microphone.loading = false;
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

    // Render component
    return (
        <div className={"w-full " + className}>
            <Button disabled={!microphone.initialization || !playground.connected} className="w-full rounded-[25px]" size="sm" variant="secondary">
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
                    <AssistantMultimodalVisualizerMicrophone stream={microphone.initialization ? microphone.stream : null} bands={3} />
                </span>
                <div className="border-border border-l pl-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <span>
                                <ChevronDownIcon className="w-4 h-4" />
                            </span>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" side="top" className="z-60000">
                            <DropdownMenuLabel className="uppercase text-xs">Microphone</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuRadioGroup value={microphone.active_device?.deviceId || ""}>
                                {microphone.devices.map((item: any) => {
                                    return (
                                        <DropdownMenuRadioItem
                                            onClick={() => {
                                                onSwitch(item);
                                            }}
                                            className="text-xs text-muted-foreground data-[current=true]:text-primary"
                                            key={item.deviceId}
                                            value={item.deviceId}
                                            data-current={item.deviceId === microphone.active_device?.deviceId}
                                        >
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
    );
}
