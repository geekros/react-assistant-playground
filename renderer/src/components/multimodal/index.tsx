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

// Props type for the AssistantConnect component
type AssistantMultimodalProps = {
    className?: string;
};

// Assistant Connect Component
export function AssistantMultimodal({ className }: AssistantMultimodalProps) {
    return (
        <div className={"w-full h-[640px] " + className}>
            <div className="w-full h-full overflow-y-auto no-scrollbar">Assistant Multimodal</div>
        </div>
    );
}
