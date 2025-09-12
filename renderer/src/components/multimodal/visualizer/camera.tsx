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

// Multimodal visualizer camera component
type AssistantMultimodalVisualizerCameraProps = {
    className?: string;
};

// Multimodal visualizer camera component
export function AssistantMultimodalVisualizerCamera({ className }: AssistantMultimodalVisualizerCameraProps) {
    // Render the camera video element
    return (
        <div className={"w-auto h-full transition-all duration-300 ease-in-out " + className}>
            <video id="multimodal_video_stream" className="w-auto h-full rounded-md m-0 p-0" autoPlay playsInline muted></video>
            <canvas id="multimodal_video_canvas" className="hidden w-auto h-full"></canvas>
        </div>
    );
}
