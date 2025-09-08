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

import { MediaDevice, MediaDisplay, MediaDraw, useLibs } from "@/libs";
import { createContext, useContext, useEffect, useState } from "react";

// Define the props for the MediaContext provider
export type MediaProps = {
    children: React.ReactNode;
};

// Define the context type
export type MediaDeviceType = {
    // MediaDevice instance and its updater
    device: MediaDevice;
    update_device: (value: MediaDevice) => void;
    // MediaDisplay instance and its updater
    display: MediaDisplay;
    update_display: (value: MediaDisplay) => void;
    // MediaDraw instance and its updater
    draw: MediaDraw;
    update_draw: (value: MediaDraw) => void;
    // Camera state and its updater
    camera: MediaDeviceStructure;
    update_camera: (value: MediaDeviceStructure) => void;
    // Microphone state and its updater
    microphone: MediaDeviceStructure;
    update_microphone: (value: MediaDeviceStructure) => void;
    // Screenshare state and its updater
    screenshare: MediaDisplayStructure;
    update_screenshare: (value: MediaDisplayStructure) => void;
    // Drawboard state and its updater
    drawboard: MediaDrawStructure;
    update_drawboard: (value: MediaDrawStructure) => void;
};

// Define the structure for camera and microphone state
export interface MediaDeviceStructure {
    error: string;
    stream: MediaStream;
    devices: InputDeviceInfo[];
    active_device: InputDeviceInfo;
    active_device_track: MediaStreamTrack;
    enabled: boolean;
    loading: boolean;
    initialization: boolean;
}

// Define the structure for screenshare state
export interface MediaDisplayStructure {
    error: string;
    stream: MediaStream;
    active_device_track: MediaStreamTrack;
    enabled: boolean;
    loading: boolean;
    initialization: boolean;
}

// Define the structure for drawing state
export interface MediaDrawStructure {
    color: string;
    colors: Array<string>;
    size: number;
    strokes: Array<any>;
    history: Array<any>;
    redoStack: Array<any>;
    drawing: boolean;
    current: any;
}

// Default state for camera
const camera_state: MediaDeviceStructure = {
    error: "",
    stream: new MediaStream(),
    devices: [],
    active_device: {} as InputDeviceInfo,
    active_device_track: {} as MediaStreamTrack,
    enabled: true,
    loading: true,
    initialization: false,
};

// Default state for camera
const microphone_state: MediaDeviceStructure = {
    error: "",
    stream: new MediaStream(),
    devices: [],
    active_device: {} as InputDeviceInfo,
    active_device_track: {} as MediaStreamTrack,
    enabled: true,
    loading: true,
    initialization: false,
};

// Default state for screenshare
const screenshare_state: MediaDisplayStructure = {
    error: "",
    stream: new MediaStream(),
    active_device_track: {} as MediaStreamTrack,
    enabled: true,
    loading: false,
    initialization: false,
};

const draw_state: MediaDrawStructure = {
    color: "#85cc23",
    colors: ["#85cc23", "#20c45f", "#3a81f6", "#8d5df8", "#f83d60", "#f14445", "#ebb517"],
    size: 5,
    strokes: [],
    history: [],
    redoStack: [],
    drawing: false,
    current: null,
};

// Create the context with default values
const Context = createContext<MediaDeviceType>({
    device: {} as MediaDevice,
    update_device: (_value: MediaDevice) => {},
    display: {} as MediaDisplay,
    update_display: (_value: MediaDisplay) => {},
    draw: {} as MediaDraw,
    update_draw: (_value: MediaDraw) => {},
    camera: camera_state,
    update_camera: (_value: MediaDeviceStructure) => {},
    microphone: microphone_state,
    update_microphone: (_value: MediaDeviceStructure) => {},
    screenshare: screenshare_state,
    update_screenshare: (_value: MediaDisplayStructure) => {},
    drawboard: draw_state,
    update_drawboard: (_value: MediaDrawStructure) => {},
});

// Custom hook to use the MediaContext
export const useMediaDevice = () => useContext<MediaDeviceType>(Context);

// MediaContext provider component
export const MediaDeviceContext = ({ children, ...props }: MediaProps) => {
    // Initialize MediaDevice state
    const [device, setDevice] = useState<MediaDevice>(useLibs.media.MediaDevice);

    // Display state management
    const [display, setDisplay] = useState<MediaDisplay>(useLibs.media.MediaDisplay);

    // Draw state management
    const [draw, setDraw] = useState<MediaDraw>(useLibs.media.MediaDraw);

    // Camera state management
    const [camera, setCamera] = useState<MediaDeviceStructure>(camera_state);

    // Microphone state management
    const [microphone, setMicrophone] = useState<MediaDeviceStructure>(microphone_state);

    // Screenshare state management
    const [screenshare, setScreenshare] = useState<MediaDisplayStructure>(screenshare_state);

    // Drawboard state management
    const [drawboard, setDrawboard] = useState<MediaDrawStructure>(draw_state);

    // update device
    const update_device = (value: MediaDevice) => {
        setDevice(value);
    };

    // Update display state
    const update_display = (value: MediaDisplay) => {
        setDisplay(value);
    };

    // Update draw state
    const update_draw = (value: MediaDraw) => {
        setDraw(value);
    };

    // Update camera state
    const update_camera = (value: MediaDeviceStructure) => {
        setCamera((prev: any) => ({ ...prev, ...value }));
    };

    // Update microphone state
    const update_microphone = (value: MediaDeviceStructure) => {
        setMicrophone((prev: any) => ({ ...prev, ...value }));
    };

    // Update screenshare state
    const update_screenshare = (value: MediaDisplayStructure) => {
        setScreenshare((prev: any) => ({ ...prev, ...value }));
    };

    // Update drawboard state
    const update_drawboard = (value: MediaDrawStructure) => {
        draw.data = value;
        setDrawboard((prev: any) => ({ ...prev, ...value }));
    };

    // Define the context value
    const value = {
        device: device,
        update_device: update_device,
        display: display,
        update_display: update_display,
        draw: draw,
        update_draw: update_draw,
        camera: camera,
        update_camera: update_camera,
        microphone: microphone,
        update_microphone: update_microphone,
        screenshare: screenshare,
        update_screenshare: update_screenshare,
        drawboard: drawboard,
        update_drawboard: update_drawboard,
    };

    // Log changes in microphone state
    useEffect(() => {}, [microphone]);

    // Log changes in camera state
    useEffect(() => {}, [camera]);

    // Log changes in screenshare state
    useEffect(() => {}, [screenshare]);

    // Side effect to log when the context is initialized
    useEffect(() => {
        // Initialize MediaDevice, MediaDisplay, and MediaDraw instances
        const device_temp = useLibs.media.MediaDevice;
        const display_temp = useLibs.media.MediaDisplay;
        const draw_temp = useLibs.media.MediaDraw;

        // Set up device change listeners
        device_temp.onDevicechange = (_event: Event) => {
            navigator.mediaDevices.enumerateDevices().then((devices: any) => {
                const audio_inputs: InputDeviceInfo[] = [];
                const video_inputs: InputDeviceInfo[] = [];
                devices.forEach((device: any) => {
                    if (device.kind === "audioinput" && device.label !== "") {
                        audio_inputs.push(device);
                    }
                    if (device.kind === "videoinput" && device.label !== "") {
                        video_inputs.push(device);
                    }
                });
                camera.devices = video_inputs;
                microphone.devices = audio_inputs;
                update_camera(camera);
                update_microphone(microphone);
            });
        };

        // Set up display close listener
        display_temp.onDevicechange = (_event: Event) => {
            display_temp.onClose();
            screenshare.enabled = true;
            screenshare.loading = false;
            screenshare.initialization = false;
            update_screenshare(screenshare);
        };

        // Set draw data
        draw_temp.data = drawboard;
        draw_temp.update_data = update_drawboard;

        // Update state with initialized device and display
        update_device(device_temp);
        update_display(display_temp);
        update_draw(draw_temp);
    }, []);

    // Render the context provider with the defined value
    return (
        <Context {...props} value={value}>
            {children}
        </Context>
    );
};
