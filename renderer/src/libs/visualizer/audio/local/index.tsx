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

export class LocalAudioVisualizer {
    private ctx: AudioContext | null = null;
    private analyser: AnalyserNode | null = null;
    private source: MediaStreamAudioSourceNode | null = null;
    private dataArray: Float32Array<ArrayBuffer> | null = null;

    constructor() {}

    onIntialize(mediaStream: MediaStream) {
        this.ctx = new AudioContext();
        this.source = this.ctx.createMediaStreamSource(mediaStream);
        this.analyser = this.ctx.createAnalyser();
        this.analyser.minDecibels = -100;
        this.analyser.maxDecibels = -10;
        this.analyser.fftSize = 2048;
        this.analyser.smoothingTimeConstant = 0.8;
        this.source.connect(this.analyser);

        const bufferLength = this.analyser.frequencyBinCount;
        this.dataArray = new Float32Array(bufferLength);

        return this;
    }

    getFrequencyData(): Float32Array {
        this.analyser?.getFloatFrequencyData(this.dataArray!);
        return new Float32Array(this.dataArray!);
    }

    getFrequencyBands(bands: number = 5, lowPass: number = 100, highPass: number = 600): Float32Array[] {
        const fullData = this.getFrequencyData().slice(lowPass, highPass);
        const normalized = this.normalize(fullData);

        const chunkSize = Math.ceil(normalized.length / bands);
        const chunks: Float32Array[] = [];

        for (let i = 0; i < bands; i++) {
            chunks.push(normalized.slice(i * chunkSize, (i + 1) * chunkSize));
        }

        return chunks;
    }

    normalize(frequencies: Float32Array): Float32Array {
        const minDb = -100;
        const maxDb = -10;

        return frequencies.map((value) => {
            if (value === -Infinity) return 0;
            let db = 1 - (Math.max(minDb, Math.min(maxDb, value)) * -1) / 100;
            db = Math.sqrt(db);
            return db;
        });
    }

    destroy() {
        this.source?.disconnect();
        this.analyser?.disconnect();
        this.ctx?.close();
    }
}
