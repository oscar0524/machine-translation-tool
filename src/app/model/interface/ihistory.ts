import { Data } from "electron";

export interface IHistory {
    id: number;
    chapter_id: number;
    sentence_id: number;
    created: Data;
}