import { ScoreCriteria } from "../Argument/score/Criteria";
import { createScore } from "./create";

let scoreId = 0;

export interface ScoreType {
    name: string;
    type: ScoreCriteria;
    score: Score;
}

interface scoreOption {
    display?: string;
    type?: ScoreCriteria
}

export const ScoreTable: ScoreType[] = [];

export class Score {
    private name: string;
    private type: ScoreCriteria;
    public used: boolean = false;

    constructor(scoreOption: scoreOption) {
        const id = scoreId++;
        this.type = scoreOption.type ?? "dummy";
        this.name = scoreOption.display ?? `score_${id}`;

        createScore(this.name, this.type, this);
    }
}