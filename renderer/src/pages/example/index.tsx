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

import { ThemeMode } from "@/components/theme/mode";
import { GithubLink } from "@/components/github";
import { Language } from "@/components/language";
import { useLanguage } from "@/hooks/context/language";
import { Theme } from "@/components/theme";
import { Link } from "react-router-dom";
import { ThemeRadius } from "@/components/theme/radius";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/base/card";
import { Loading } from "@/components/base/loading";
import { Empty } from "@/components/base/empty";
import { Button } from "@/components/base/button";
import { DeviceCamera } from "@/components/media/camera";
import { DeviceMicrophone } from "@/components/media/microphone";
import { Chat } from "@/components/chat";
import { Assistant } from "@/components/assistant";
import { AssistantConnect } from "@/components/assistant/connect";
import { Joystick } from "@/components/joystick";
import { useEffect } from "react";

// The example page showing various components.
export function PageExampleIndex() {
    // Get language context
    const { lang } = useLanguage();

    // Set document title on mount
    useEffect(() => {
        document.title = "GEEKROS MODULE EXAMPLE";
        return () => {};
    }, []);

    // Render the example page
    return (
        <div className="w-full h-full flex justify-center pt-[50px]">
            <div className="w-full md:w-[850px] space-y-3 p-[10px] md:p-0">
                <span className="text-4xl">🥳</span>
                <h1 className="text-xl font-bold md:text-2xl">
                    <span>React</span>
                    <sup className="text-xs font-medium px-1 text-muted-foreground">19.1.0+</sup>
                    <span>+</span>
                    <span>Vite</span>
                    <sup className="text-xs font-medium px-1 text-muted-foreground">7.0.4+</sup>
                    <span>+</span>
                    <span>Typescript</span>
                    <sup className="text-xs font-medium px-1 text-muted-foreground">5.8.3+</sup>
                </h1>
                <div className="text-muted-foreground">
                    <p>{lang("example.subtitle")}</p>
                </div>
                <div className="w-full">
                    <div className="w-full flex flex-wrap items-center justify-start gap-2 md:flex-nowrap md:space-x-2">
                        <GithubLink />
                        <ThemeMode />
                        <Language />
                        <Theme />
                        <ThemeRadius />
                    </div>
                </div>
                <div className="text-muted-foreground">
                    <p className="text-sm">{lang("example.description")}</p>
                </div>
                <div className="text-muted-foreground/50">
                    <p className="text-xs space-x-1">
                        <span>Powered by</span>
                        <Link className="text-primary/50" to="https://ui.shadcn.com" target="_blank">
                            <span>Shadcn/UI</span>
                        </Link>
                        <span>and</span>
                        <Link className="text-primary/50" to="https://tailwindcss.com" target="_blank">
                            <span>Tailwind CSS</span>
                        </Link>
                        <span>.</span>
                    </p>
                </div>
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
                    <Card className="w-full shadow-none">
                        <CardHeader>
                            <CardTitle>Local Camera</CardTitle>
                            <CardAction>
                                <Button size="sm" variant="secondary">
                                    <span className="text-xs">{lang("example.code")}</span>
                                </Button>
                            </CardAction>
                        </CardHeader>
                        <CardContent>
                            <div className="w-full flex items-center justify-center">
                                <DeviceCamera auto={true} />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="w-full shadow-none">
                        <CardHeader>
                            <CardTitle>Local Microphone</CardTitle>
                            <CardAction>
                                <Button size="sm" variant="secondary">
                                    <span className="text-xs">{lang("example.code")}</span>
                                </Button>
                            </CardAction>
                        </CardHeader>
                        <CardContent>
                            <div className="w-full flex items-center justify-center">
                                <DeviceMicrophone auto={true} />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="w-full shadow-none">
                        <CardHeader>
                            <CardTitle>Assistant</CardTitle>
                            <CardAction>
                                <Button size="sm" variant="secondary">
                                    <span className="text-xs">{lang("example.code")}</span>
                                </Button>
                            </CardAction>
                        </CardHeader>
                        <CardContent>
                            <Assistant />
                        </CardContent>
                    </Card>
                    <Card className="w-full shadow-none">
                        <CardHeader>
                            <CardTitle>Assistant Connect</CardTitle>
                            <CardAction>
                                <Button size="sm" variant="secondary">
                                    <span className="text-xs">{lang("example.code")}</span>
                                </Button>
                            </CardAction>
                        </CardHeader>
                        <CardContent>
                            <AssistantConnect />
                        </CardContent>
                    </Card>
                    <Card className="w-full shadow-none">
                        <CardHeader>
                            <CardTitle>Chat</CardTitle>
                            <CardAction>
                                <Button size="sm" variant="secondary">
                                    <span className="text-xs">{lang("example.code")}</span>
                                </Button>
                            </CardAction>
                        </CardHeader>
                        <CardContent>
                            <Chat />
                        </CardContent>
                    </Card>
                    <Card className="w-full shadow-none">
                        <CardHeader>
                            <CardTitle>Joystick</CardTitle>
                            <CardAction>
                                <Button size="sm" variant="secondary">
                                    <span className="text-xs">{lang("example.code")}</span>
                                </Button>
                            </CardAction>
                        </CardHeader>
                        <CardContent>
                            <Joystick />
                        </CardContent>
                    </Card>
                    <Card className="w-full shadow-none">
                        <CardHeader>
                            <CardTitle>Loading</CardTitle>
                            <CardAction>
                                <Button size="sm" variant="secondary">
                                    <span className="text-xs">{lang("example.code")}</span>
                                </Button>
                            </CardAction>
                        </CardHeader>
                        <CardContent>
                            <Loading className="h-[100px]" />
                        </CardContent>
                    </Card>
                    <Card className="w-full shadow-none">
                        <CardHeader>
                            <CardTitle>Empty</CardTitle>
                            <CardAction>
                                <Button size="sm" variant="secondary">
                                    <span className="text-xs">{lang("example.code")}</span>
                                </Button>
                            </CardAction>
                        </CardHeader>
                        <CardContent>
                            <Empty className="h-[100px]" />
                        </CardContent>
                    </Card>
                    <Card className="w-full shadow-none">
                        <CardHeader>
                            <CardTitle>Theme</CardTitle>
                            <CardAction>
                                <Button size="sm" variant="secondary">
                                    <span className="text-xs">{lang("example.code")}</span>
                                </Button>
                            </CardAction>
                        </CardHeader>
                        <CardContent>
                            <div className="w-full h-[100px] flex items-center justify-center">
                                <Theme />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="w-full shadow-none">
                        <CardHeader>
                            <CardTitle>ThemeMode</CardTitle>
                            <CardAction>
                                <Button size="sm" variant="secondary">
                                    <span className="text-xs">{lang("example.code")}</span>
                                </Button>
                            </CardAction>
                        </CardHeader>
                        <CardContent>
                            <div className="w-full h-[100px] flex items-center justify-center">
                                <ThemeMode />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="w-full shadow-none">
                        <CardHeader>
                            <CardTitle>ThemeRadius</CardTitle>
                            <CardAction>
                                <Button size="sm" variant="secondary">
                                    <span className="text-xs">{lang("example.code")}</span>
                                </Button>
                            </CardAction>
                        </CardHeader>
                        <CardContent>
                            <div className="w-full h-[100px] flex items-center justify-center">
                                <ThemeRadius />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="w-full shadow-none">
                        <CardHeader>
                            <CardTitle>Language</CardTitle>
                            <CardAction>
                                <Button size="sm" variant="secondary">
                                    <span className="text-xs">{lang("example.code")}</span>
                                </Button>
                            </CardAction>
                        </CardHeader>
                        <CardContent>
                            <div className="w-full h-[100px] flex items-center justify-center">
                                <Language />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="w-full shadow-none">
                        <CardHeader>
                            <CardTitle>GitHub</CardTitle>
                            <CardAction>
                                <Button size="sm" variant="secondary">
                                    <span className="text-xs">{lang("example.code")}</span>
                                </Button>
                            </CardAction>
                        </CardHeader>
                        <CardContent>
                            <div className="w-full h-[100px] flex items-center justify-center">
                                <GithubLink />
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="w-full h-[200px]"></div>
            </div>
        </div>
    );
}
