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

import { MediaDrawStructure } from "@/hooks/context/media";

export class MediaDraw {
    // Canvas rendering context
    public ctx: CanvasRenderingContext2D | null = null;
    public canvas: HTMLCanvasElement | null = null;

    // Drawing data
    public data: MediaDrawStructure;
    public update_data: (data: MediaDrawStructure) => void = () => {};

    // Initialize the draw module
    constructor() {
        this.data = {} as MediaDrawStructure;
    }

    // Called when the canvas is initialized
    onInit() {
        this.ctx = this.canvas?.getContext("2d") ?? null;
        this.canvas?.addEventListener("pointerdown", this.onPointerdown.bind(this), { passive: false });
        this.canvas?.addEventListener("pointermove", this.moveDraw.bind(this), { passive: false });
        this.canvas?.addEventListener("pointerup", this.endDraw.bind(this));
        this.canvas?.addEventListener("pointercancel", this.endDraw.bind(this));
        window.addEventListener("resize", this.onResizeCanvas.bind(this));
        this.onResizeCanvas();
    }

    // Called when a pointer down event occurs on the canvas
    onPointerdown(_enevt: PointerEvent) {
        this.canvas?.setPointerCapture(_enevt.pointerId);
        this.startDraw(_enevt);
    }

    // Called to start a new drawing stroke
    startDraw(_enevt: PointerEvent) {
        _enevt.preventDefault();
        this.data.drawing = true;
        this.data.redoStack = []; // Clear redo stack
        const pos = this.getPointerPos(_enevt);
        this.data.current = {
            color: this.data.color,
            size: this.data.size,
            points: [pos],
        };
        this.update_data(this.data);
    }

    // Called to continue drawing as the pointer moves
    moveDraw(_enevt: PointerEvent) {
        if (!this.data.drawing || !this.data.current) return;
        _enevt.preventDefault();
        const pos = this.getPointerPos(_enevt);
        const pts = this.data.current.points;
        const last = pts[pts.length - 1];
        pts.push(pos);
        this.onLineSegment(last, pos, this.data.current.color, this.data.current.size);
    }

    endDraw(_enevt: PointerEvent) {
        if (!this.data.drawing) return;
        this.data.drawing = false;
        if (this.data.current && this.data.current.points.length > 1) {
            this.data.strokes.push(this.data.current);
            this.data.history.push({ type: "stroke", stroke: this.data.current });
        }
        this.data.current = null;
        this.update_data(this.data);
    }

    // Called to redraw the canvas with the given strokes
    onRedraw() {
        if (this.canvas && this.ctx) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.clearRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);
            for (const s of this.data.strokes) {
                if (!s.points || s.points.length < 2) continue;
                for (let i = 1; i < s.points.length; i++) {
                    this.onLineSegment(s.points[i - 1], s.points[i], s.color, s.size);
                }
            }
        }
    }

    // Called to undo the last action
    onUndo() {
        const action = this.data.history.pop();
        if (!action) return;
        this.data.redoStack.push(action);
        if (action.type === "stroke") {
            this.data.strokes.pop();
        }
        if (action.type === "clear") {
            this.data.strokes = action.prev.map((s: any) => ({
                color: s.color,
                size: s.size,
                points: s.points.map((p: any) => ({ x: p.x, y: p.y })),
            }));
        }
        this.update_data(this.data);
        this.onRedraw();
    }

    // Called to redo the last undone action
    onRedo() {
        const action = this.data.redoStack.pop();
        if (!action) return;
        this.data.history.push(action);
        if (action.type === "stroke") {
            this.data.strokes.push(action.stroke);
        }
        if (action.type === "clear") {
            this.data.strokes.length = 0;
        }
        this.update_data(this.data);
        this.onRedraw();
    }

    // Called to clear the drawing board
    onClear(force: boolean = false) {
        if (this.data.strokes.length === 0) return;
        const snapshot = this.data.strokes.map((s: any) => ({
            color: s.color,
            size: s.size,
            points: s.points.map((p: any) => ({ x: p.x, y: p.y })),
        }));
        if (force) {
            this.data.history = [];
        }
        if (!force) {
            this.data.history.push({ type: "clear", prev: snapshot });
        }
        this.data.redoStack = [];
        this.data.strokes = [];
        this.update_data(this.data);
        this.onRedraw();
    }

    // Called to draw a line segment from point a to point b
    onLineSegment(a: any, b: any, color: any, size: any) {
        if (this.canvas && this.ctx) {
            this.ctx.strokeStyle = color;
            this.ctx.lineWidth = size;
            this.ctx.lineCap = "round";
            this.ctx.lineJoin = "round";
            this.ctx.beginPath();
            this.ctx.moveTo(a.x, a.y);
            this.ctx.lineTo(b.x, b.y);
            this.ctx.stroke();
        }
    }

    // Called when the window is resized
    onResizeCanvas() {
        if (this.canvas && this.ctx) {
            // Adjust for device pixel ratio
            const dpr = Math.max(1, window.devicePixelRatio || 1);
            const rect = this.canvas.getBoundingClientRect();

            // Get the CSS width and height
            const wCss = this.canvas.clientWidth;
            const hCss = this.canvas.clientHeight;

            // Resize the canvas and scale the context
            this.ctx.setTransform(1, 0, 0, 1, 0, 0);
            this.canvas.width = Math.floor(wCss * dpr);
            this.canvas.height = Math.floor(hCss * dpr);
            this.canvas.style.width = wCss + "px";
            this.canvas.style.height = hCss + "px";
            this.ctx.scale(dpr, dpr);

            // Redraw the canvas content
            this.onRedraw();
        }
    }

    // Get the pointer position relative to the canvas
    getPointerPos(_enevt: PointerEvent) {
        const rect: any = this.canvas?.getBoundingClientRect();
        return {
            x: _enevt.clientX - rect.left,
            y: _enevt.clientY - rect.top,
        };
    }

    // Called when the canvas is destroyed
    onClose() {
        if (this.ctx && this.canvas) {
            this.canvas?.removeEventListener("pointerdown", this.onPointerdown.bind(this));
            this.canvas?.removeEventListener("pointermove", this.moveDraw.bind(this));
            this.canvas?.removeEventListener("pointerup", this.endDraw.bind(this));
            this.canvas?.removeEventListener("pointercancel", this.endDraw.bind(this));
            window.removeEventListener("resize", this.onResizeCanvas.bind(this));
            this.ctx = null;
            this.canvas = null;
            this.data = {} as MediaDrawStructure;
            this.update_data = null as any;
        }
    }
}
