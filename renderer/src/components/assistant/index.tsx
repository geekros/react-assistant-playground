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

type AssistantProps = {
    className?: string;
};

export function Assistant({ className }: AssistantProps) {
    const [scale, setScale] = useState(1);

    useEffect(() => {
        const interval = setInterval(() => {
            const fakeVolume = 1 + Math.random() * 0.2;
            setScale(fakeVolume);
        }, 150);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className={"w-full h-[380px] " + className}>
            <div className="w-full h-full flex items-center justify-center">
                <div className="w-[100px] h-auto">
                    <div className="w-[100px] h-[100px] relative">
                        <div
                            className="w-full h-full shadow-xs"
                            style={{
                                borderRadius: "50px",
                                backgroundColor: "rgb(255, 255, 255)",
                                backgroundImage: "radial-gradient(at 76% 31%, rgb(0, 208, 250) 0px, transparent 50%), radial-gradient(at 20% 81%, rgb(0, 216, 255) 0px, transparent 50%)",
                                backgroundSize: "300% 300%",
                                filter: "drop-shadow(rgba(255, 255, 255, 0.5) 0px 0px 45px)",
                                transform: "translateX(0px) scale(" + scale + ")",
                                transition: "transform 1.25s cubic-bezier(0.09, 1.04, 0.245, 1.055)",
                                position: "absolute",
                                animation: "20s ease 0s infinite normal none running gradient-animation, 2s ease-out 0s infinite alternate none running rotate-animation",
                            }}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
