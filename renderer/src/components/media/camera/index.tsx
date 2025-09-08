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
import { VideoIcon, VideoOffIcon } from "lucide-react";
import { useEffect } from "react";
import { DeviceCameraVisualizer } from "./visualizer";
import { useLanguage } from "@/hooks/context/language";
import { useMediaDevice } from "@/hooks/context/media";

// Props type for the DeviceCamera component
type DeviceCameraProps = {
    className?: string;
    auto?: boolean;
};

// Device Camera Component
export function DeviceCamera({ className, auto = false }: DeviceCameraProps) {
    // Language context
    const { lang } = useLanguage();

    const { device, camera, update_camera } = useMediaDevice();

    // Get video devices and stream
    function onGetDevice() {
        if (camera.initialization) {
            camera.loading = false;
            update_camera(camera);
            return;
        }
        device.GetVideo(
            (media_stream: MediaStream, input_device_infos: InputDeviceInfo[], input_device_info: InputDeviceInfo, media_stream_track: MediaStreamTrack) => {
                setTimeout(() => {
                    const video: any = document.getElementById("video_stream");
                    video.srcObject = media_stream;
                    video.onloadedmetadata = function (_e: any) {
                        video.play();
                    };
                }, 500);
                camera.stream = media_stream;
                camera.devices = input_device_infos;
                camera.active_device = input_device_info;
                camera.active_device_track = media_stream_track;
                camera.enabled = !media_stream_track.enabled;
                camera.loading = false;
                camera.initialization = true;
                update_camera(camera);
            },
            (error: any) => {
                camera.error = error.message;
                camera.loading = false;
                update_camera(camera);
            }
        );
    }

    // Enable or disable the camera
    function onDeviceDisable() {
        if (camera.active_device_track) {
            camera.enabled = !camera.enabled;
            camera.active_device_track.enabled = !camera.enabled;
            update_camera(camera);
        }
    }

    // Auto get device on component mount
    useEffect(() => {
        if (auto) {
            onGetDevice();
        }
    }, []);

    // Render component
    return (
        <div className={"w-full space-y-2 " + className}>
            <div className="w-full">
                <span className="flex flex-row gap-2">
                    <Button className="rounded-md border border-border/80" variant="secondary" disabled={device.videos.length === 0} onClick={onDeviceDisable}>
                        {camera.enabled ? <VideoOffIcon className="w-4 h-4" /> : <VideoIcon className="w-4 h-4" />}
                    </Button>
                    <Select disabled={camera.devices.length === 0 || camera.enabled} value={camera.active_device?.deviceId || ""} defaultValue={camera.active_device?.deviceId || ""}>
                        <SelectTrigger className="placeholder-item h-8 w-full border-border focus:ring-0">
                            <span className="w-full mr-2 text-xs line-clamp-1">
                                <SelectValue placeholder={lang("common.choose_camera")} />
                            </span>
                        </SelectTrigger>
                        <SelectContent side="bottom" className="border-border">
                            {camera.devices.map((item: any) => {
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
                    {camera.error !== "" ? (
                        <div className="w-full flex h-[179px] md:h-[207px] items-center justify-center border border-border rounded-md uppercase">{camera.error}</div>
                    ) : (
                        <div className="w-full flex h-[179px] md:h-[207px] items-center justify-center border border-border rounded-md">
                            {camera.active_device_track && !camera.loading ? (
                                <div className="w-full h-full">
                                    <DeviceCameraVisualizer />
                                </div>
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
