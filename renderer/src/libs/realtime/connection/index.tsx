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

// Interface for data channel messages
export interface DataChannelMessage {
    event: string;
    data: string;
    Time: number;
}

// Class for managing WebRTC connection
export class RealtimeConnection {
    // The RTCPeerConnection instance.
    public peerConnection: RTCPeerConnection | null = null;

    // The STUN server URLs.
    public stun_urls: string[] = [];

    // The remote audio track.
    public remote_audio_track: MediaStreamTrack | null = null;

    // The RTCDataChannel instance.
    public chat_data_channel: RTCDataChannel | null = null;

    // The RTCDataChannel instance.
    public media_data_channel: RTCDataChannel | null = null;

    // The callback function to handle events.
    public callback: any = null;

    // Initialize the class
    constructor() {}

    // Create a new RTCPeerConnection.
    createConnection(stun_urls: string[], callback: any): RealtimeConnection {
        // Store the callback function.
        this.callback = callback;

        // Use Google's public STUN server for ICE candidates.
        this.peerConnection = new RTCPeerConnection({
            iceServers: [{ urls: stun_urls }],
        });

        // Handle incoming tracks.
        this.peerConnection.ontrack = (event: RTCTrackEvent) => {
            // If the track is audio, store it.
            if (event.track.kind === "audio") {
                // Store the remote audio track.
                this.remote_audio_track = event.track;
            }
        };

        // Handle incoming data channels.
        this.peerConnection.ondatachannel = (event: RTCDataChannelEvent) => {
            console.log("Data channel received:", event);
        };

        // Handle new ICE candidates.
        this.peerConnection.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
            // If the peer connection exists and there's a new candidate, handle it.
            if (event.candidate) {
                // Send the new ICE candidate to the remote peer via signaling server.
                this.callback({
                    type: "realtime:connection:candidate",
                    candidate: event.candidate,
                });
            }
        };

        // Handle connection state changes.
        this.chat_data_channel = this.createDataChannel("chat");

        // Create a data channel for drawing data.
        this.media_data_channel = this.createDataChannel("media");

        // Notify that the connection has been created.
        this.callback({
            type: "realtime:connection:created",
        });

        // Return the instance for chaining.
        return this;
    }

    // Create an offer to initiate the connection.
    createOffer() {
        // If the peer connection doesn't exist, return early.
        if (!this.peerConnection) return;

        // Create an offer to initiate the connection.
        this.peerConnection
            .createOffer({
                offerToReceiveAudio: true,
                offerToReceiveVideo: true,
            })
            .then((offer: RTCSessionDescriptionInit) => {
                // Set the local description with the created offer.
                this.peerConnection?.setLocalDescription(offer);
                this.callback({
                    type: "realtime:connection:offer",
                    sdp: JSON.stringify(offer),
                });
            });
    }

    // Create DataChannel for protocol messages
    createDataChannel(label: string): RTCDataChannel | null {
        // If the peer connection doesn't exist, return early.
        if (!this.peerConnection) return null;

        // Create a data channel for protocol messages.
        const dataChannel = this.peerConnection.createDataChannel(label);

        // handle data channel opening.
        dataChannel.onopen = (event: Event) => {
            console.log("Event data channel opened:", label, event);
            this.callback({
                type: "realtime:connection:" + label + ":datachannel:open",
            });
        };

        // Handle incoming messages on the data channel.
        dataChannel.onmessage = (event: MessageEvent) => {
            // Parse the incoming message.
            const message = JSON.parse(event.data);
            // Send the message event to the callback.
            this.callback({
                type: "realtime:connection:" + label + ":datachannel:message",
                message: message,
            });
        };

        // handle errors on the data channel.
        dataChannel.onerror = (event: Event) => {
            console.log("Event data channel error:", label, event);
            // Send the error event to the callback.
            this.callback({
                type: "realtime:connection:" + label + ":datachannel:error",
                error: event,
            });
        };

        // handle data channel closure.
        dataChannel.onclose = (event: Event) => {
            console.log("Event data channel closed:", label, event);
            // Send the close event to the callback.
            this.callback({
                type: "realtime:connection:" + label + ":datachannel:close",
            });
        };

        // Retun the created data channel.
        return dataChannel;
    }

    // Add tracks to the peer connection.
    addTracks(type: string, media: MediaStream) {
        // Add audio tracks to the peer connection.
        media.getTracks().forEach((track: MediaStreamTrack) => {
            // Add the track if it matches the specified type.
            if (track.kind === type) {
                this.peerConnection?.addTrack(track, media);
                this.callback({
                    type: "realtime:connection:track:added",
                    track_id: track.id,
                    track_type: type,
                });
            }
            // Add screen share video tracks to the peer connection.
            if (type === "screenshare" && track.kind === "video") {
                this.peerConnection?.addTrack(track, media);
                this.callback({
                    type: "realtime:connection:track:added",
                    track_id: track.id,
                    track_type: type,
                });
            }
        });
    }

    // Remove tracks from the peer connection.
    removeTrack(track: MediaStreamTrack) {
        // If the peer connection doesn't exist, return early.
        if (!this.peerConnection) return;
        // Remove the specified track from the peer connection.
        this.peerConnection.getSenders().forEach((sender: RTCRtpSender) => {
            if (sender.track === track) {
                this.peerConnection?.removeTrack(sender);
            }
        });
        // Update a new offer after removing the track.
        this.createOffer();
    }

    // Send a message via the data channel.
    sendDataChannelMessage(label: string, message: DataChannelMessage) {
        // Select the appropriate data channel based on the label.
        let dataChannel: RTCDataChannel | null = null;

        // If the label is "chat", use the chat data channel.
        if (label === "chat") {
            dataChannel = this.chat_data_channel;
        }
        // If the label is "media", use the media data channel.
        if (label === "media") {
            dataChannel = this.media_data_channel;
        }
        // If the data channel exists and is open, send the message.
        if (dataChannel && dataChannel.readyState === "open") {
            dataChannel.send(JSON.stringify(message));
        }
    }

    // Close the RTCPeerConnection.
    close() {
        // If the peer connection exists, close it and clean up.
        if (this.peerConnection) {
            // Remove all senders.
            this.peerConnection.getSenders().forEach((sender: RTCRtpSender) => {
                this.peerConnection?.removeTrack(sender);
            });

            // Clear the remote audio track.
            this.remote_audio_track = null;

            // Clear the data channels.
            this.chat_data_channel?.close();
            this.chat_data_channel = null;
            this.media_data_channel?.close();
            this.media_data_channel = null;

            // Close the peer connection.
            this.peerConnection.close();

            // Clean up.
            this.peerConnection = null;
        }
    }
}
