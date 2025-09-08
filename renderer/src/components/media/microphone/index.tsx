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
import { Loading } from "@/components/base/loading";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/base/select";
import { MicIcon, MicOffIcon } from "lucide-react";
import { useEffect } from "react";
import { DeviceMicrophoneVisualizer } from "./visualizer";
import { useLanguage } from "@/hooks/context/language";
import { useMediaDevice } from "@/hooks/context/media";

// DeviceMicrophone component props
type DeviceMicrophoneProps = {
    className?: string;
    auto?: boolean;
};

// DeviceMicrophone component definition
export function DeviceMicrophone({ className, auto = false }: DeviceMicrophoneProps) {
    // Get language context
    const { lang } = useLanguage();

    // Get media context
    const { device, microphone, update_microphone } = useMediaDevice();

    // Function to get audio devices and stream
    function onGetDevice() {
        if (microphone.initialization) {
            microphone.loading = false;
            update_microphone(microphone);
            return;
        }
        device.GetAudio(
            (media_stream: MediaStream, input_device_infos: InputDeviceInfo[], input_device_info: InputDeviceInfo, media_stream_track: MediaStreamTrack) => {
                setTimeout(() => {
                    const audio: any = document.getElementById("audio_stream");
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
                microphone.initialization = true;
                update_microphone(microphone);
            },
            (error: any) => {
                microphone.error = error.message;
                microphone.loading = false;
                update_microphone(microphone);
            }
        );
    }

    // Function to enable/disable the microphone
    function onDeviceDisable() {
        if (microphone.active_device_track) {
            microphone.enabled = !microphone.enabled;
            microphone.active_device_track.enabled = !microphone.enabled;
            update_microphone(microphone);
        }
    }

    // Effect to handle changes in the selected audio device
    useEffect(() => {
        if (auto) {
            onGetDevice();
        }
    }, []);

    // Effect to handle changes in the selected audio device
    return (
        <div className={"w-full space-y-2 " + className}>
            <div className="w-full">
                <span className="flex flex-row gap-2">
                    <Button className="rounded-md border border-border/80" variant="secondary" disabled={device.audios.length === 0} onClick={onDeviceDisable}>
                        {microphone.enabled ? <MicOffIcon className="w-4 h-4" /> : <MicIcon className="w-4 h-4" />}
                    </Button>
                    <Select disabled={microphone.devices.length === 0 || microphone.enabled} value={microphone.active_device?.deviceId || ""} defaultValue={microphone.active_device?.deviceId || ""}>
                        <SelectTrigger className="placeholder-item h-8 w-full border-border focus:ring-0">
                            <span className="w-full mr-2 text-xs line-clamp-1">
                                <SelectValue placeholder={lang("common.choose_microphone")} />
                            </span>
                        </SelectTrigger>
                        <SelectContent side="bottom" className="border-border">
                            {microphone.devices.map((item: any) => {
                                return (
                                    <SelectItem className="text-xs" key={item.deviceId} value={item.deviceId}>
                                        {item.label}
                                    </SelectItem>
                                );
                            })}
                        </SelectContent>
                    </Select>
                </span>
            </div>
            <div className="text-xs leading-normal">
                <div className="relative">
                    {microphone.error !== "" ? (
                        <div className="w-full flex h-[100px] md:h-[207px] items-center justify-center border border-border rounded-md uppercase">{microphone.error}</div>
                    ) : (
                        <div className="w-full flex h-[100px] md:h-[207px] items-center justify-center border border-border rounded-md">
                            {microphone.active_device_track && !microphone.loading ? (
                                <div className="w-full h-full">{microphone.stream ? <DeviceMicrophoneVisualizer stream={microphone.stream} bands={12} /> : null}</div>
                            ) : (
                                <Loading />
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
