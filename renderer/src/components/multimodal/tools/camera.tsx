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
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/base/dropdown-menu";
import { useLanguage } from "@/hooks/context/language";
import { useMediaDevice } from "@/hooks/context/media";
import { PlaygroundProps } from "@/pages/playground";
import { ChevronDownIcon, VideoIcon, VideoOffIcon } from "lucide-react";

// Props type for the DeviceCamera component
type AssistantMultimodalToolsCameraProps = {
    className?: string;
    playground: PlaygroundProps;
};

// DeviceCamera component definition
export function AssistantMultimodalToolsCamera({ className, playground }: AssistantMultimodalToolsCameraProps) {
    // Language context
    const { lang } = useLanguage();

    // Get media context
    const { device, camera, update_camera } = useMediaDevice();

    // Switch camera device
    function onSwitch(item: any) {
        const deviceId = item.deviceId;
        if (deviceId === camera.active_device?.deviceId) {
            return;
        }
        device.SwitchAudio(
            deviceId,
            (media_stream: MediaStream, audios: InputDeviceInfo[], active_audio: InputDeviceInfo, active_audio_track: MediaStreamTrack) => {
                camera.stream = media_stream;
                camera.devices = audios;
                camera.active_device = active_audio;
                camera.active_device_track = active_audio_track;
                camera.enabled = !active_audio_track.enabled;
                camera.loading = false;
                camera.initialization = true;
                update_camera(camera);
            },
            (error: any) => {
                console.error("Switch camera error", error);
                camera.error = error.message;
                camera.loading = false;
                update_camera(camera);
            }
        );
    }

    // Toggle camera enable/disable
    function onDeviceDisable() {
        if (camera.active_device_track) {
            // Toggle camera state
            camera.enabled = !camera.enabled;
            camera.active_device_track.enabled = !camera.enabled;
            update_camera(camera);

            // If enabling, set the video source
            if (camera.enabled) return;
            setTimeout(() => {
                const video: any = document.getElementById("multimodal_video_stream");
                if (video) {
                    video.srcObject = camera.stream;
                    video.onloadedmetadata = function (_e: any) {
                        video.play();
                    };
                }
            }, 500);
        }
    }

    // Render component
    return (
        <div className={"w-full " + className}>
            <Button disabled={!camera.initialization || !playground.connected} className="w-full rounded-[25px]" size="sm" variant="secondary">
                {camera.enabled ? (
                    <div onClick={onDeviceDisable}>
                        <VideoOffIcon className="w-4 h-4 mr-1" />
                    </div>
                ) : (
                    <div onClick={onDeviceDisable}>
                        <VideoIcon className="w-4 h-4 mr-1" />
                    </div>
                )}
                <div className="border-border border-l pl-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <span>
                                <ChevronDownIcon className="w-4 h-4" />
                            </span>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" side="top" className="z-60000">
                            <DropdownMenuLabel className="uppercase text-xs">Camera</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuRadioGroup value={camera.active_device?.deviceId || ""}>
                                {camera.devices.map((item: any) => {
                                    return (
                                        <DropdownMenuRadioItem
                                            className="text-xs text-muted-foreground data-[current=true]:text-primary"
                                            onClick={() => {
                                                onSwitch(item);
                                            }}
                                            key={item.deviceId}
                                            value={item.deviceId}
                                            data-current={item.deviceId === camera.active_device?.deviceId}
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
