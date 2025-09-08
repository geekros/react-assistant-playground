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

import { MediaDevice, MediaDisplay, MediaDraw } from "./media";
import { LocalAudioVisualizer, RemoteAudioVisualizer } from "./visualizer";
import { RealtimeSignaling, RealtimeConnection, RealtimeAuthorize } from "./realtime";

// This file is used to export all libraries in the renderer
export const useLibs = {
    media: {
        MediaDevice: new MediaDevice(),
        MediaDisplay: new MediaDisplay(),
        MediaDraw: new MediaDraw(),
    },
    visualizer: {
        LocalAudioVisualizer: new LocalAudioVisualizer(),
        RemoteAudioVisualizer: new RemoteAudioVisualizer(),
    },
    realtime: {
        signaling: new RealtimeSignaling(),
        connection: new RealtimeConnection(),
        authorize: new RealtimeAuthorize(),
    },
};

// Export types
export type { MediaDevice, MediaDisplay, MediaDraw } from "./media";
