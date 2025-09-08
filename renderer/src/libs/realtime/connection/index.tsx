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

export class RealtimeConnection {
    // The RTCPeerConnection instance.
    public peer: RTCPeerConnection | null = null;

    // The RTCDataChannel instance.
    constructor() {}

    // Create a new RTCPeerConnection.
    createConnection(): RealtimeConnection {
        // Use Google's public STUN server for ICE candidates.
        this.peer = new RTCPeerConnection({
            iceServers: [{ urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"] }],
        });

        // Handle incoming tracks.
        this.peer.ontrack = this.onTrack.bind(this);

        // Handle ICE candidates.
        this.peer.onicecandidate = this.onIcecandidate.bind(this);

        // Handle incoming data channels.
        this.peer.ondatachannel = this.onChannel.bind(this);

        // Log connection state changes.
        this.peer.onconnectionstatechange = this.onConnectionStateChange.bind(this);

        // Log signaling state changes.
        return this;
    }

    // Handle incoming tracks.
    onTrack(event: RTCTrackEvent) {
        console.log("Track event:", event);
    }

    // Handle ICE candidates.
    onIcecandidate(event: RTCPeerConnectionIceEvent) {
        console.log("ICE candidate event:", event);
    }

    // Handle incoming data channels.
    onChannel(event: RTCDataChannelEvent) {
        // Ensure the event and channel exist.
        if (!event || !event.channel) return;

        const channel = event.channel;
    }

    // Handle connection state changes.
    onConnectionStateChange(event: Event) {
        console.log("Connection state change event:", event);
    }

    // Create an offer and set it as the local description.
    createOffer() {
        this.peer?.createOffer().then((offer: RTCSessionDescriptionInit) => {
            this.peer?.setLocalDescription(offer);
        });
    }

    // Create an answer and set it as the remote description.
    createAnswer() {
        this.peer?.createAnswer().then((answer: RTCSessionDescriptionInit) => {
            this.peer?.setRemoteDescription(answer);
        });
    }

    // Set the remote description.
    addIceCandidate(candidate: RTCIceCandidateInit) {
        this.peer?.addIceCandidate(new RTCIceCandidate(candidate));
    }

    // Add a track to the RTCPeerConnection.
    addTrack(track: MediaStreamTrack, stream: MediaStream) {
        this.peer?.addTrack(track, stream);
    }

    // Create a data channel.
    addChannel(label: string, open: (event: any) => void, message: (event: any) => void, failed: (event: any) => void, close: (event: any) => void): RTCDataChannel | undefined {
        // Ensure the peer connection exists.
        if (!this.peer) return;

        // Create the data channel with the specified label.
        const channel = this.peer.createDataChannel(label, { ordered: true });

        // Set up event handlers for the data channel.
        channel.onopen = (event) => {
            open(event);
        };

        // Handle incoming messages.
        channel.onmessage = (event) => {
            message(event);
        };

        // Handle errors.
        channel.onerror = (error) => {
            failed(error);
        };

        // Handle the closing of the data channel.
        channel.onclose = (error) => {
            close(error);
        };

        // Return the created data channel.
        return channel;
    }

    // Close the RTCPeerConnection.
    close() {
        if (this.peer) {
            this.peer.close();
            this.peer = null;
        }
    }
}
