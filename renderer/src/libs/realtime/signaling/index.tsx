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

import { IsLocalHost } from "@/libs/network";

export interface SignalingMessage {
    event: string;
    data: {
        channel: string;
        from: string;
        target: string;
        content: string;
    };
    Error?: string;
    Time: number;
}

export class RealtimeSignaling {
    // The base URL of the signaling server.
    public baseUrl: string = "https://signaling.geekros.com";

    // The base path of the signaling server.
    public basePath: string = "/handler/signaling/connection";

    // The WebSocket path of the signaling server.
    public socket: WebSocket | null = null;

    // The WebSocket path of the signaling server.
    private socket_heartbeat: any;

    // The WebSocket path of the signaling server.
    constructor() {}

    // Get the access token from the signaling server.
    connection(token: string, onopen: any, onmessage: any, onerror: any, onclose: any) {
        // If is_local is true, use the current origin as the base URL.
        if (IsLocalHost()) {
            this.baseUrl = ""; // or location.origin
        }

        // Use the request library to send a GET request to the signaling server.
        this.socket = new WebSocket(`${window.location.origin}${this.basePath}?token=${token}`);

        // WebSocket event handlers
        this.socket.onopen = (event: Event) => {
            this.heartbeat();
            onopen(event);
        };

        // Bind other event handlers
        this.socket.onmessage = (event: MessageEvent) => {
            onmessage(event);
        };

        // Error handling
        this.socket.onerror = (event: Event) => {
            onerror(event);
        };

        // Connection closed handling
        this.socket.onclose = (event: Event) => {
            onclose(event);
        };
    }

    // Start the heartbeat to keep the connection alive
    heartbeat(): void {
        this.socket_heartbeat = window.setInterval(() => {
            if (this.socket) {
                this.send(JSON.stringify({ event: "human:heartbeat" }));
            }
        }, 42125);
    }

    // Send a message through the WebSocket
    send(message: any): void {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(message);
        }
    }

    // Disconnect the WebSocket connection
    close(): void {
        if (this.socket) {
            clearInterval(this.socket_heartbeat);
            this.socket.close();
        }
    }
}
