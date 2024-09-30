// Copyright 2024 Google LLC
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

// A module to define the types used in this library.

/**
 * Aggregates a number of individual votes.
 */
export class VoteTally {
  agreeCount: number;
  disagreeCount: number;
  passCount?: number;

  constructor(agreeCount: number, disagreeCount: number, passCount?: number){
    this.agreeCount = agreeCount;
    this.disagreeCount = disagreeCount;
    this.passCount = passCount;
  }

  get totalCount(): number {
    return this.agreeCount + this.disagreeCount + (this.passCount || 0);
  }
}

/**
 * A text that was voted on by different groups.
 */
export interface Comment {
  id: string;
  text: string;
  voteTalliesByGroup?: { [key: string]: VoteTally };
  topics?: Topic[];
}

/**
 * A series of comments that were voted on.
 */
export interface Conversation {
    comments: Comment[];
}

/**
 * What is being discussed.
 */
export interface Topic {
    name: string;
    subtopics?: Topic[];
}
