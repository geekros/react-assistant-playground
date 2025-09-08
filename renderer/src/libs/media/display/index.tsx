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

export class MediaDisplay {
    // Singleton instance
    public stream: MediaStream | null = null;

    // Active video track
    public active_video_track: MediaStreamTrack | null = null;

    // Event handler for device changes
    public onDevicechange: any = null;

    // Event handler for display changes
    constructor() {
        if (typeof window !== "undefined" && typeof MediaStream !== "undefined") {
            this.stream = new MediaStream();
        }
    }

    // Method to get display stream
    GetDisplay(success?: any, error?: any) {
        if (navigator.mediaDevices && typeof navigator.mediaDevices.getDisplayMedia === "function") {
            navigator.mediaDevices
                .getDisplayMedia({
                    video: {
                        frameRate: { ideal: 30, max: 60 },
                        width: { ideal: 1920 },
                        height: { ideal: 1080 },
                    },
                    audio: false,
                })
                .then((media_stream: MediaStream) => {
                    // Handle stream inactive event
                    this.stream?.addEventListener("inactive", (event: Event) => {
                        this.onDevicechange(event);
                    });
                    media_stream.getTracks().forEach((track: MediaStreamTrack) => {
                        this.active_video_track = track;
                        if (this.stream) this.stream.addTrack(track);
                    });
                    if (success) success(media_stream, this.active_video_track);
                })
                .catch((err: any) => {
                    error(err);
                });
        } else {
            error({ message: "not supported in this browser" });
        }
    }

    // Method to stop display stream
    onClose() {
        if (this.stream) {
            // Remove event listener and stop all tracks
            this.stream.removeEventListener("inactive", (event: Event) => {
                this.onDevicechange(event);
            });
            this.stream.getTracks().forEach((track) => track.stop());
            this.active_video_track = null;
            this.stream = new MediaStream();
        }
    }
}
