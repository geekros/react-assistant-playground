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

// Class for managing media devices
export class MediaDevice {
    // Singleton instance
    public stream: MediaStream | null = null;

    // Audio and Video streams
    public audios: InputDeviceInfo[] = [];
    public videos: InputDeviceInfo[] = [];
    public screens: InputDeviceInfo[] = [];

    // Active audio and video streams
    public active_audio: InputDeviceInfo | null = null;
    public active_video: InputDeviceInfo | null = null;
    public active_screen: InputDeviceInfo | null = null;

    // Active audio and video tracks
    public active_audio_track: MediaStreamTrack | null = null;
    public active_video_track: MediaStreamTrack | null = null;
    public active_screen_track: MediaStreamTrack | null = null;

    // Event handler for device changes
    public onDevicechange: any = null;

    // Constructor initializes the MediaStream if available
    constructor() {}

    // Method to get both audio and video streams
    GetMedia(success?: any, error?: any) {
        if (typeof window !== "undefined" && typeof MediaStream !== "undefined") {
            this.stream = new MediaStream();
            if (navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === "function") {
                navigator.mediaDevices
                    .getUserMedia({
                        audio: {
                            echoCancellation: true,
                            noiseSuppression: true,
                            autoGainControl: true,
                        },
                        video: {
                            width: 1280,
                            height: 720,
                        },
                    })
                    .then((media_stream: MediaStream) => {
                        navigator.mediaDevices.addEventListener("devicechange", (event: Event) => {
                            if (this.onDevicechange) this.onDevicechange(event);
                        });
                        navigator.mediaDevices.enumerateDevices().then((devices: any) => {
                            devices.forEach((device: any) => {
                                if (device.kind === "audioinput" && device.label !== "") {
                                    this.audios.push(device);
                                    if (!this.active_audio) this.active_audio = device;
                                }
                                if (device.kind === "videoinput" && device.label !== "") {
                                    this.videos.push(device);
                                    if (!this.active_video) this.active_video = device;
                                }
                            });
                            if (media_stream) {
                                media_stream.getTracks().forEach((track: MediaStreamTrack) => {
                                    if (track.kind === "audio") {
                                        this.active_audio_track = track;
                                    }
                                    if (track.kind === "video") {
                                        track.enabled = false;
                                        this.active_video_track = track;
                                    }
                                    this.stream!.addTrack(track);
                                });
                            }
                            if (success) success(this.stream, this.audios, this.active_audio, this.active_audio_track, this.videos, this.active_video, this.active_video_track);
                        });
                    })
                    .catch((err: any) => {
                        error(err);
                    });
            } else {
                error({ message: "not supported in this browser" });
            }
        } else {
            error({ message: "not supported in this browser" });
        }
    }

    // Method to get audio streams
    GetAudio(success?: any, error?: any) {
        if (navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === "function") {
            navigator.mediaDevices
                .getUserMedia({
                    audio: {
                        echoCancellation: true,
                        noiseSuppression: true,
                        autoGainControl: true,
                    },
                })
                .then((audio_stream: MediaStream) => {
                    navigator.mediaDevices.enumerateDevices().then((devices: any) => {
                        this.audios = devices.filter((device: any) => device.kind === "audioinput" && device.label !== "") as InputDeviceInfo[];
                        this.active_audio = this.audios[0] || null;
                        if (audio_stream) {
                            audio_stream.getAudioTracks().forEach((track: any) => {
                                this.active_audio_track = track;
                                this.stream!.addTrack(this.active_audio_track!);
                            });
                        }
                        if (success) success(this.stream, this.audios, this.active_audio, this.active_audio_track);
                    });
                })
                .catch((err: any) => {
                    error(err);
                });
        } else {
            error({ message: "not supported in this browser" });
        }
    }

    // Method to switch audio devices
    SwitchAudio(device_id: string, success?: any, error?: any) {
        if (this.stream && this.active_audio_track) {
            this.stream.removeTrack(this.active_audio_track);
            this.active_audio_track.stop();
            this.active_audio_track = null;
        }
        if (this.active_audio) {
            navigator.mediaDevices
                .getUserMedia({
                    audio: {
                        deviceId: { exact: device_id },
                        echoCancellation: true,
                        noiseSuppression: true,
                        autoGainControl: true,
                    },
                })
                .then((audio_stream: MediaStream) => {
                    if (audio_stream) {
                        this.active_audio = this.audios.find((item) => item.deviceId === device_id) || this.active_audio;
                        audio_stream.getAudioTracks().forEach((track: any) => {
                            this.active_audio_track = track;
                            this.stream = new MediaStream();
                            this.stream?.addTrack(this.active_audio_track!);
                        });
                        console.log("SwitchAudio", this.stream);
                    }
                    if (success) success(this.stream, this.audios, this.active_audio, this.active_audio_track);
                })
                .catch((err: any) => {
                    error(err);
                });
        } else {
            error({ message: "no active audio device" });
        }
    }

    // Method to get video streams
    GetVideo(success?: any, error?: any) {
        if (navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === "function") {
            navigator.mediaDevices
                .getUserMedia({
                    video: {
                        width: 1280,
                        height: 720,
                    },
                })
                .then((video_stream: MediaStream) => {
                    navigator.mediaDevices.enumerateDevices().then((devices: any) => {
                        this.videos = devices.filter((device: any) => device.kind === "videoinput" && device.label !== "") as InputDeviceInfo[];
                        this.active_video = this.videos[0] || null;
                        if (video_stream) {
                            video_stream.getVideoTracks().forEach((track: any) => {
                                this.active_video_track = track;
                                this.stream!.addTrack(this.active_video_track!);
                            });
                        }
                        if (success) success(this.stream, this.videos, this.active_video, this.active_video_track);
                    });
                })
                .catch((err: any) => {
                    error(err);
                });
        } else {
            error({ message: "not supported in this browser" });
        }
    }

    // Method to switch video devices
    SwitchVideo(success?: any, error?: any) {
        if (this.stream && this.active_video_track) {
            this.stream.removeTrack(this.active_video_track);
            this.active_video_track.stop();
            this.active_video_track = null;
        }
        if (this.active_video) {
            navigator.mediaDevices
                .getUserMedia({
                    video: {
                        deviceId: { exact: this.active_video.deviceId },
                        width: 1280,
                        height: 720,
                    },
                })
                .then((video_stream: MediaStream) => {
                    if (video_stream) {
                        this.active_video = this.videos.find((item) => item.deviceId === this.active_video?.deviceId) || this.active_video;
                        video_stream.getVideoTracks().forEach((track: any) => {
                            this.active_video_track = track;
                            this.stream = new MediaStream();
                            this.stream!.addTrack(this.active_video_track!);
                        });
                    }
                    if (success) success(this.stream, this.videos, this.active_video, this.active_video_track);
                })
                .catch((err: any) => {
                    error(err);
                });
        } else {
            error({ message: "no active video device" });
        }
    }

    // Method to close the MediaStream and release resources
    onClose() {
        if (this.stream) {
            if (this.onDevicechange) navigator.mediaDevices.removeEventListener("devicechange", this.onDevicechange.bind(this));
            this.stream.getTracks().forEach((track) => track.stop());
            this.audios = [];
            this.videos = [];
            this.active_audio = null;
            this.active_video = null;
            this.active_audio_track = null;
            this.active_video_track = null;
            this.stream = new MediaStream();
        }
    }
}
