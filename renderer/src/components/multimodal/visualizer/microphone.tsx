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

import { useLibs } from "@/libs";
import { LocalAudioVisualizer } from "@/libs/visualizer";
import { useEffect, useRef, useState } from "react";

type AssistantMultimodalVisualizerMicrophoneProps = {
    className?: string;
    stream: MediaStream | null;
    bands?: number;
};

export function AssistantMultimodalVisualizerMicrophone({ className, stream, bands = 3 }: AssistantMultimodalVisualizerMicrophoneProps) {
    // State for frequency data
    const [frequencies, setFrequencies] = useState<Float32Array[]>([]);

    // Reference to the visualizer instance
    const visualizerRef = useRef<LocalAudioVisualizer | null>(null);

    // Reference to the interval for updating frequencies
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Sum frequencies for each band
    const summedFrequencies = frequencies.map((bandFrequencies: any) => {
        const sum = (bandFrequencies as number[]).reduce((a, b) => a + b, 0);
        return Math.sqrt(sum / bandFrequencies.length);
    });

    // If no stream or no frequencies, use placeholder values
    const placeholder = Array(bands).fill(0.1);

    // Determine bars to display
    const bars = stream && summedFrequencies.length ? summedFrequencies : placeholder;

    // Initialize and update visualizer on stream change
    useEffect(() => {
        // Cleanup previous visualizer and interval
        if (!stream) return;

        // Initialize visualizer
        const visualizer = useLibs.visualizer.LocalAudioVisualizer.onIntialize(stream);
        visualizerRef.current = visualizer;

        // Update frequencies at regular intervals
        const update = () => {
            const data = visualizer.getFrequencyBands(bands, 100, 600);
            setFrequencies(data);
        };

        // Start interval to update frequencies
        intervalRef.current = setInterval(update, 30);

        // Cleanup on unmount or stream change
        return () => {
            visualizer.destroy();
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [stream]);

    // Render visualizer bars
    return (
        <div className={"w-full flex flex-row gap-2 h-full items-center justify-center border-0 rounded-sm " + className}>
            <audio id="multimodal_audio_stream" className="hidden" muted></audio>
            <div className="h-1 flex flex-row items-center gap-1">
                {bars.map((frequency, index) => {
                    const width = 4;
                    const minHeight = 2;
                    const maxHeight = 20;
                    const height = Math.max(minHeight, Math.min(maxHeight, frequency * maxHeight));
                    return (
                        <div
                            key={"frequency-" + index}
                            className="bg-primary rounded-md"
                            style={{ height: height, width: width, transition: "background-color 0.35s ease-out, transform 0.25s ease-out", transform: "none" }}
                        ></div>
                    );
                })}
            </div>
        </div>
    );
}
