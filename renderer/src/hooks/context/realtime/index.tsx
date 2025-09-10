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

import { RealtimeAuthorize, RealtimeConnection, RealtimeSignaling } from "@/libs/realtime";
import { createContext, useContext, useEffect, useState } from "react";

// Define the props for the MediaContext provider
export type RealtimeProps = {
    children: React.ReactNode;
};

// Define the context type
export type RealtimeType = {
    authorize: RealtimeAuthorizeStructure;
    update_authorize: (value: RealtimeAuthorizeStructure) => void;
    signaling: RealtimeSignalingStructure;
    update_signaling: (value: RealtimeSignalingStructure) => void;
    connection: RealtimeConnectionStructure;
    update_connection: (value: RealtimeConnectionStructure) => void;
};

// Define the structure of the context state
export interface RealtimeAuthorizeStructure {
    api: RealtimeAuthorize;
    token: string;
    role: string;
    channel: string;
}

// Define the structure for signaling state
export interface RealtimeSignalingStructure {
    api: RealtimeSignaling;
    socket: WebSocket | null;
}

// Define the structure for the connection state
export interface RealtimeConnectionStructure {
    api: RealtimeConnection;
}

// Initial state for the context
const realtime_state: RealtimeType = {
    authorize: {} as RealtimeAuthorizeStructure,
    update_authorize: (_value: RealtimeAuthorizeStructure) => {},
    signaling: {} as RealtimeSignalingStructure,
    update_signaling: (_value: RealtimeSignalingStructure) => {},
    connection: {} as RealtimeConnectionStructure,
    update_connection: (_value: RealtimeConnectionStructure) => {},
};

// Create the context
const Context = createContext<RealtimeType>(realtime_state);

// Custom hook to use the Realtime context
export const useRealtime = () => useContext<RealtimeType>(Context);

// Realtime context provider component
export const RealtimeContext = ({ children, ...props }: RealtimeProps) => {
    // State to hold the context value
    const [authorize, setAuthorize] = useState<RealtimeAuthorizeStructure>(realtime_state.authorize);

    // Signaling state
    const [signaling, setSignaling] = useState<RealtimeSignalingStructure>(realtime_state.signaling);

    // Connection state
    const [connection, setConnection] = useState<RealtimeConnectionStructure>(realtime_state.connection);

    // Function to update the context state
    const update_authorize = (value: RealtimeAuthorizeStructure) => {
        setAuthorize((prev: any) => ({ ...prev, ...value }));
    };

    // Function to update the context state
    const update_signaling = (value: RealtimeSignalingStructure) => {
        setSignaling((prev: any) => ({ ...prev, ...value }));
    };

    // Function to update the context state
    const update_connection = (value: RealtimeConnectionStructure) => {
        setConnection((prev: any) => ({ ...prev, ...value }));
    };

    // Define the value to be provided by the context
    const value = {
        authorize: authorize,
        update_authorize: update_authorize,
        signaling: signaling,
        update_signaling: update_signaling,
        connection: connection,
        update_connection: update_connection,
    };

    // Side effect to run on component mount
    useEffect(() => {}, []);

    // Render the context provider with the given children
    return (
        <Context {...props} value={value}>
            {children}
        </Context>
    );
};
