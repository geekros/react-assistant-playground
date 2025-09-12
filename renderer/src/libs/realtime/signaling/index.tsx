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

// Interface for signaling messages
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

// Class for managing signaling server connection
export class RealtimeSignaling {
    // The base URL of the signaling server.
    public baseUrl: string = "https://signaling.geekros.com";

    // The base path of the signaling server.
    public basePath: string = "/handler/signaling/connection";

    // The WebSocket path of the signaling server.
    public socket: WebSocket | null = null;

    // The WebSocket path of the signaling server.
    private socket_heartbeat: any;

    // Initialize the class
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
            // Start the heartbeat interval
            this.heartbeat();
            // Call the onopen callback
            onopen(event);
        };

        // Bind other event handlers
        this.socket.onmessage = (event: MessageEvent) => {
            // Reset the heartbeat interval
            onmessage(event);
        };

        // Error handling
        this.socket.onerror = (event: Event) => {
            // Clear the heartbeat interval
            onerror(event);
        };

        // Connection closed handling
        this.socket.onclose = (event: Event) => {
            // Clear the heartbeat interval
            onclose(event);
        };
    }

    // Start the heartbeat to keep the connection alive
    heartbeat(): void {
        // Clear any existing heartbeat interval
        this.socket_heartbeat = window.setInterval(() => {
            // If the socket exists, send a heartbeat message
            if (this.socket) {
                // Send a heartbeat message
                this.send(JSON.stringify({ event: "client:heartbeat" }));
            }
        }, 42125);
    }

    // Send a message through the WebSocket
    send(message: any): void {
        // Send the message if the socket is open
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            // Send the message
            this.socket.send(message);
        }
    }

    // Disconnect the WebSocket connection
    close(): void {
        // Close the socket if it exists
        if (this.socket) {
            // Clear the heartbeat interval and close the socket
            clearInterval(this.socket_heartbeat);
            // Close the socket
            this.socket.close();
        }
    }
}
