export interface IComparison {
    id: number;
    original: string;
    translation?: string;
    novel_id: number;
    created: Date;
    updated: Date;
}