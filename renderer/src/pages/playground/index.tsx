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
import { Separator } from "@/components/base/separator";
import { GithubLink } from "@/components/github";
import { Language } from "@/components/language";
import { ThemeMode } from "@/components/theme/mode";
import { useLanguage } from "@/hooks/context/language";
import { useMediaDevice } from "@/hooks/context/media";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { LoaderCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AssistantMultimodalModuleInput } from "@/components/multimodal/module/input";
import { AssistantMultimodalToolsMicrophone } from "@/components/multimodal/tools/microphone";
import { AssistantMultimodalToolsCamera } from "@/components/multimodal/tools/camera";
import { AssistantMultimodalToolsDraw } from "@/components/multimodal/tools/draw";
import { AssistantMultimodalToolsScreenshare } from "@/components/multimodal/tools/screenshare";
import { AssistantMultimodalToolsMessage } from "@/components/multimodal/tools/message";
import { AssistantMultimodalModuleChat } from "@/components/multimodal/module/chat";
import { AssistantMultimodalModuleDraw } from "@/components/multimodal/module/draw";
import { AssistantMultimodalModuleAssistant } from "@/components/multimodal/module/assistant";
import { AssistantMultimodalVisualizerCamera } from "@/components/multimodal/visualizer/camera";
import { AssistantMultimodalVisualizerScreenshare } from "@/components/multimodal/visualizer/screenshare";
import { RealtimeContext, useRealtime } from "@/hooks/context/realtime";
import { useLibs } from "@/libs";

// Playground properties
export type PlaygroundProps = {
    error: string;
    connected: boolean;
    connected_loading: boolean;
    draw: {
        hidden: boolean;
    };
    message: {
        hidden: boolean;
        input: string;
        send_loading: boolean;
    };
};

// Initial playground state
const playground_state: PlaygroundProps = {
    error: "",
    connected: false,
    connected_loading: false,
    draw: {
        hidden: true,
    },
    message: {
        hidden: true,
        input: "",
        send_loading: false,
    },
};

// Playground page component
export function PagePlaygroundIndex() {
    // Get language context
    const { lang } = useLanguage();

    // Get media context
    const { device, display, draw, microphone, camera, screenshare, update_microphone, update_camera, update_screenshare } = useMediaDevice();

    // Realtime context
    const { authorize, signaling, connection, update_authorize, update_signaling, update_connection } = useRealtime();

    // Microphone state
    const [playground, setplayground] = useState<PlaygroundProps>(playground_state);

    // Update playground state
    function update(value: PlaygroundProps) {
        setplayground((prev: any) => ({ ...prev, ...value }));
    }

    // Handle screenshare toggle
    function onDisplay() {
        // Only proceed if connected
        if (!playground.connected) return;

        // Toggle screenshare
        if (screenshare.initialization) {
            onDisplayClose();
            return;
        }

        // Start screenshare
        screenshare.loading = true;
        update_screenshare(screenshare);

        // Request display media
        display.GetDisplay(
            (media_stream: MediaStream, active_video_track: MediaStreamTrack) => {
                if (media_stream.getVideoTracks().length > 0) {
                    // Set up screenshare element
                    screenshare.stream = media_stream;
                    screenshare.active_device_track = active_video_track;
                    screenshare.enabled = !active_video_track.enabled;
                    screenshare.loading = false;
                    screenshare.initialization = true;
                    update_screenshare(screenshare);

                    // Play screenshare stream after a short delay
                    setTimeout(() => {
                        const video: any = document.getElementById("multimodal_screenshare_stream");
                        if (video) {
                            video.srcObject = media_stream;
                            video.onloadedmetadata = function (_e: any) {
                                video.play();
                            };
                        }
                    }, 500);
                } else {
                    // Indicate loading state
                    screenshare.loading = false;
                    update_screenshare(screenshare);
                }
            },
            (error: any) => {
                // Indicate loading state
                screenshare.loading = false;
                update_screenshare(screenshare);
                // Handle error
                playground.error = error.message;
                update(playground);
            }
        );
    }

    // Handle draw visibility toggle
    function onDrawHidden() {
        if (!playground.connected) return;
        if (playground.draw.hidden) {
            playground.message.hidden = true;
            update(playground);
        }
        playground.draw.hidden = !playground.draw.hidden;
        update(playground);
    }

    // Stop screenshare
    function onDisplayClose() {
        display.onClose();
        screenshare.enabled = true;
        screenshare.loading = false;
        screenshare.initialization = false;
        update_screenshare(screenshare);
    }

    // Handle message visibility toggle
    function onMessageHidden() {
        if (!playground.connected) return;
        if (playground.message.hidden) {
            playground.draw.hidden = true;
            update(playground);
        }
        playground.message.hidden = !playground.message.hidden;
        update(playground);
    }

    // Handle connection toggle
    function onConnection() {
        // Start connection
        playground.connected_loading = true;
        update(playground);

        // If already connected, close connection
        if (playground.connected) {
            onDisplayClose();
            onConnectionClose();
            return;
        }

        // Get access token and proceed with connection
        useLibs.realtime.authorize.accesstoken("human", (data: any) => {
            if (data.code === 0) {
                // Save token to context
                authorize.token = data.data.access_token;
                update_authorize(authorize);

                // Request media devices
                device.GetMedia(
                    (
                        media_stream: MediaStream,
                        audios: InputDeviceInfo[],
                        active_audio: InputDeviceInfo,
                        active_audio_track: MediaStreamTrack,
                        videos: InputDeviceInfo[],
                        active_video: InputDeviceInfo,
                        active_video_track: MediaStreamTrack
                    ) => {
                        useLibs.realtime.signaling.connection(
                            authorize.token,
                            (_event: any) => {
                                // Save WebSocket to context
                                signaling.socket = _event.currentTarget;
                                update_signaling(signaling);

                                // Set up audio element
                                microphone.stream = media_stream;
                                microphone.devices = audios;
                                microphone.active_device = active_audio;
                                microphone.active_device_track = active_audio_track;
                                microphone.enabled = !active_audio_track.enabled;
                                microphone.loading = false;
                                microphone.initialization = true;
                                update_microphone(microphone);

                                // Set up video element
                                camera.stream = media_stream;
                                camera.devices = videos;
                                camera.active_device = active_video;
                                camera.active_device_track = active_video_track;
                                camera.enabled = !active_video_track.enabled;
                                camera.loading = false;
                                camera.initialization = true;
                                update_camera(camera);

                                // Play audio stream after a short delay
                                setTimeout(() => {
                                    // Set up audio element
                                    const audio: any = document.getElementById("multimodal_audio_stream");
                                    if (audio) {
                                        audio.srcObject = media_stream;
                                        audio.onloadedmetadata = function (_e: any) {
                                            audio.play();
                                        };
                                    }
                                }, 500);

                                // Update playground state
                                playground.error = "";
                                playground.connected_loading = false;
                                playground.connected = true;
                                update(playground);
                            },
                            (message: any) => {
                                const message_json = JSON.parse(message.data);
                                console.log("Received message:", message_json);
                            },
                            (event: any) => {
                                console.error("WebSocket error occurred:", event);
                            },
                            (event: any) => {
                                console.log("WebSocket connection closed:", event);
                                onConnectionClose();
                            }
                        );
                    },
                    (error: any) => {
                        // Handle error
                        playground.error = error.message;
                        playground.connected_loading = false;
                        update(playground);
                    }
                );
            } else {
                // Handle error
                playground.connected_loading = false;
                update(playground);
            }
        });
    }

    // Handle connection close
    function onConnectionClose() {
        playground.message.input = "";
        playground.message.send_loading = false;
        playground.message.hidden = true;
        playground.draw.hidden = true;
        playground.connected = !playground.connected;
        playground.connected_loading = false;
        draw.onClear(true);
        device.onClose();
        update(playground);
    }

    // Set document title on mount
    useEffect(() => {
        document.title = "GEEKROS TEST PLAYGROUND";
        return () => {};
    }, []);

    // Render the playground UI
    return (
        <RealtimeContext>
            <div className="w-full h-full flex items-center justify-center">
                <div className="w-full h-full bg-secondary/50">
                    <header className="w-full h-[48px] fixed top-0 left-0 right-0 px-4 z-60000">
                        <div className="w-full h-full flex items-center justify-between">
                            <div className="w-auto h-[24px]">
                                <img className="h-full" src="/images/logo.png" />
                            </div>
                            <div className="w-auto flex items-center space-x-3">
                                <ThemeMode className="hover:cursor-pointer" />
                                <Language className="hover:cursor-pointer" />
                                <GithubLink className="hover:cursor-pointer" />
                            </div>
                        </div>
                    </header>
                    <main className="w-full h-[calc(100%-32px)]">
                        <div className="w-full h-full">
                            <div className="w-full h-full">
                                <div className="w-full h-full relative z-10000">
                                    <div
                                        data-message={playground.message.hidden && playground.draw.hidden}
                                        className="w-full h-full transition-all duration-300 data-[message=false]:py-[10px] data-[message=false]:h-[143px] absolute top-0 left-0 right-0 max-w-2xl mx-auto flex items-center justify-center space-x-2"
                                    >
                                        <div className="w-full h-auto">
                                            <AssistantMultimodalModuleAssistant playground={playground} />
                                        </div>
                                        {!camera.enabled && camera.initialization && playground.connected && (
                                            <div data-message={playground.message.hidden && playground.draw.hidden} className="w-full data-[message=false]:h-[123px]">
                                                <AssistantMultimodalVisualizerCamera />
                                            </div>
                                        )}
                                        {!screenshare.enabled && screenshare.initialization && playground.connected && (
                                            <div data-message={playground.message.hidden && playground.draw.hidden} className="w-full data-[message=false]:h-[123px]">
                                                <AssistantMultimodalVisualizerScreenshare />
                                            </div>
                                        )}
                                    </div>
                                    {!playground.message.hidden && <AssistantMultimodalModuleChat />}
                                </div>
                                <div className="w-full h-auto mx-auto max-w-2xl border rounded-[25px] bg-background drop-shadow-md/3 fixed bottom-[35px] left-0 right-0 z-50000">
                                    {!playground.message.hidden && (
                                        <div className="w-full h-auto">
                                            <AssistantMultimodalModuleInput playground={playground} playground_update={update} />
                                            <Separator className="opacity-30" />
                                        </div>
                                    )}
                                    {!playground.draw.hidden && (
                                        <div className="w-full">
                                            <AssistantMultimodalModuleDraw />
                                            <Separator className="opacity-30" />
                                        </div>
                                    )}
                                    <div className="w-full px-[8px] py-[7px] flex items-center justify-between rounded-[25px]">
                                        <div className="w-auto flex items-center space-x-2">
                                            <div className="w-auto">
                                                <AssistantMultimodalToolsMicrophone playground={playground} />
                                            </div>
                                            <div className="w-auto">
                                                <AssistantMultimodalToolsCamera playground={playground} />
                                            </div>
                                            <div onClick={onDrawHidden} className="w-auto">
                                                <AssistantMultimodalToolsDraw playground={playground} />
                                            </div>
                                            <div onClick={onDisplay} className="w-auto">
                                                <AssistantMultimodalToolsScreenshare playground={playground} />
                                            </div>
                                            <div onClick={onMessageHidden} className="w-auto">
                                                <AssistantMultimodalToolsMessage playground={playground} />
                                            </div>
                                        </div>
                                        <div className="w-auto flex items-center justify-center">
                                            {playground.connected ? (
                                                <Button
                                                    onClick={onConnection}
                                                    disabled={playground.connected_loading}
                                                    className="h-9 uppercase rounded-[25px] hover:cursor-pointer"
                                                    variant="destructive"
                                                >
                                                    {playground.connected_loading ? <LoaderCircleIcon className="w-4 h-4 animate-spin" /> : null}
                                                    <span className="text-xs">{lang("common.end_call")}</span>
                                                </Button>
                                            ) : (
                                                <Button onClick={onConnection} disabled={playground.connected_loading} className="h-9 uppercase rounded-[25px] hover:cursor-pointer" size="sm">
                                                    {playground.connected_loading ? <LoaderCircleIcon className="w-4 h-4 animate-spin" /> : null}
                                                    <span className="text-xs">{lang("common.start_call")}</span>
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                    <footer className="w-full h-[32px] flex items-center justify-end leading-[32px] px-4 uppercase text-xs space-x-2 text-muted-foreground">
                        <span>Built with ON</span>
                        <Link to="https://github.com/geekros/agents" target="_blank">
                            <span className="text-primary">GEEKROS Agents</span>
                        </Link>
                        <span>•</span>
                        <GitHubLogoIcon className="w-4 h-4" />
                        <Link to="https://github.com/geekros/react-assistant-playground" target="_blank">
                            <span className="text-primary">View source on GitHub</span>
                        </Link>
                        <span>•</span>
                        <span>© 2025</span>
                        <Link to="https://geekros.com" target="_blank">
                            <span className="text-primary">GEEKROS</span>
                        </Link>
                    </footer>
                </div>
            </div>
        </RealtimeContext>
    );
}
