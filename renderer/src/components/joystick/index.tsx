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

import { useEffect, useState } from "react";

type JoystickProps = {
    className?: string;
    size?: number;
    callback?: (data: { x: number; y: number }) => void;
};

interface state {
    rocker: any;
    data: {
        centre: {
            x: number;
            y: number;
        };
        target: {
            x: number;
            y: number;
        };
    };
}

const default_state: state = {
    rocker: null,
    data: {
        centre: {
            x: 0,
            y: 0,
        },
        target: {
            x: 0,
            y: 0,
        },
    },
};

export function Joystick({ className, size = 120, callback }: JoystickProps) {
    const [joystick, setJoystick] = useState<state>(default_state);

    const update = (value: state) => {
        setJoystick((prev: any) => ({ ...prev, ...value }));
    };

    useEffect(() => {
        if (callback && typeof callback === "function") {
            callback(joystick.data.target);
        }
    }, [joystick.data.target.x, joystick.data.target.y]);

    useEffect(() => {
        joystick.rocker = new (window as any).geekros_joystick.create({
            zone: document.getElementById("joystick"),
            mode: "static",
            position: { left: "50%", top: "50%" },
            color: "var(--primary)",
            size: size,
        });

        joystick.data.centre.x = joystick.rocker[0].position.x;
        joystick.data.centre.y = joystick.rocker[0].position.y;

        joystick.rocker.on("move", function (_event: any, _data: any) {
            if (_data.position.x > joystick.data.centre.x) {
                joystick.data.target.x = -(_data.position.x - (joystick.data.centre.x - 60) - 60).toFixed(3);
            }
            if (_data.position.x < joystick.data.centre.x) {
                joystick.data.target.x = -(_data.position.x - (joystick.data.centre.x + 60) + 60).toFixed(2);
            }
            if (_data.position.y < joystick.data.centre.y) {
                joystick.data.target.y = -(_data.position.y - (joystick.data.centre.y + 60) + 60).toFixed(2);
            }
            if (_data.position.y > joystick.data.centre.y) {
                joystick.data.target.y = -(_data.position.y - (joystick.data.centre.y - 60) - 60).toFixed(2);
            }
            update(joystick);
        });

        joystick.rocker.on("end", function (_event: any, _data: any) {
            joystick.data.target.x = 0;
            joystick.data.target.y = 0;
            update(joystick);
        });

        update(joystick);

        window.addEventListener("resize", function () {});

        return () => {
            window.removeEventListener("resize", function () {});
            joystick.rocker?.destroy();
        };
    }, []);

    return (
        <div className={"w-full h-[380px] " + className}>
            <div className="w-full h-full flex items-center justify-center">
                <div className="w-full h-auto space-y-[40px]">
                    <div id="joystick" className="w-[120px] h-[120px] relative mx-auto"></div>
                    <div className="w-[50%] h-9 px-2 leading-9 text-xs text-center mx-auto rounded-md bg-secondary/50">{JSON.stringify(joystick.data.target)}</div>
                </div>
            </div>
        </div>
    );
}
