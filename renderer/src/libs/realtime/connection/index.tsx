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
    public peerConnection: RTCPeerConnection | null = null;

    // The STUN server URLs.
    public stun_urls: string[] = [];

    // The remote audio track.
    public remote_audio_track: MediaStreamTrack | null = null;

    // The RTCDataChannel instance.
    public chat_data_channel: RTCDataChannel | null = null;

    // The RTCDataChannel instance.
    public draw_data_channel: RTCDataChannel | null = null;

    // The callback function to handle events.
    public callback: any = null;

    // The RTCDataChannel instance.
    constructor() {}

    // Create a new RTCPeerConnection.
    createConnection(stun_urls: string[], audio: MediaStream, video: MediaStream, callback: any): RealtimeConnection {
        // Store the callback function.
        this.callback = callback;

        // Use Google's public STUN server for ICE candidates.
        this.peerConnection = new RTCPeerConnection({
            iceServers: [{ urls: stun_urls }],
        });

        // Add audio tracks to the peer connection.
        audio.getTracks().forEach((track: MediaStreamTrack) => {
            if (track.kind === "audio") {
                this.peerConnection?.addTrack(track, audio);
            }
        });

        // Add video tracks to the peer connection.
        video.getTracks().forEach((track: MediaStreamTrack) => {
            if (track.kind === "video") {
                this.peerConnection?.addTrack(track, video);
            }
        });

        // Handle incoming tracks.
        this.peerConnection.ontrack = (event: RTCTrackEvent) => {
            // If the track is audio, store it.
            if (event.track.kind === "audio") {
                // Store the remote audio track.
                this.remote_audio_track = event.track;
            }
        };

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
        this.chat_data_channel = this.peerConnection.createDataChannel("chat");

        // Create a data channel for drawing data.
        this.draw_data_channel = this.peerConnection.createDataChannel("draw");

        // Create an offer to initiate the connection.
        this.createOffer();

        // Log signaling state changes.
        return this;
    }

    // Create an offer to initiate the connection.
    createOffer() {
        // If the peer connection doesn't exist, return early.
        if (!this.peerConnection) return;

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

    // Add tracks to the peer connection.
    addTracks(media: MediaStream) {
        console.log("Adding tracks to the peer connection:", media);
        // Add audio tracks to the peer connection.
        media.getTracks().forEach((track: MediaStreamTrack) => {
            console.log("Adding audio track:", track);
            this.peerConnection?.addTrack(track, media);
        });
        // Update a new offer after adding tracks.
        this.createOffer();
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
            this.chat_data_channel = null;
            this.draw_data_channel = null;
            // Close the peer connection.
            this.peerConnection.close();
            // Clear the Callback.
            this.callback = null;
            // Clean up.
            this.peerConnection = null;
        }
    }
}
