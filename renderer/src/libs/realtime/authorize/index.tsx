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
import { useRequest } from "@/libs/request";

// Class for managing signaling server connection
export class RealtimeAuthorize {
    // The base URL of the signaling server.
    public baseUrl: string = "https://authorize.geekros.com";

    // The base path of the signaling server.
    public basePath: string = "/handler/oauth/access_token";

    // Initialize the class
    constructor() {}

    // Get the access token from the signaling server.
    accesstoken(role: string, callback: (data: any) => void) {
        // If is_local is true, use the current origin as the base URL.
        if (IsLocalHost()) {
            this.baseUrl = ""; // or location.origin
        }

        // Use the request library to send a GET request to the signaling server.
        const { request } = useRequest();

        // Send the request and handle the response.
        request("GET", this.basePath, { role: role }, {}).then((response: any) => {
            if (response.status === 200) {
                if (typeof callback === "function") {
                    // Call the callback function with the response data.
                    callback(response.data);
                }
            } else {
                if (typeof callback === "function") {
                    // Call the callback function with false to indicate failure.
                    callback(false);
                }
            }
        });
    }
}
