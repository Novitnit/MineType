import { ScoreCriteria } from "../Argument/score/Criteria";
import { selector } from "../Argument/selectors";
import { ScoreTarget } from "./children";
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
    public name: string;
    public type: ScoreCriteria;
    public used: boolean = false;

    constructor(scoreOption: scoreOption) {
        const id = scoreId++;
        this.type = scoreOption.type ?? "dummy";
        this.name = scoreOption.display ?? `score_${id}`;

        createScore(this.name, this.type, this);
    }

    public taget(selector: selector
    ): Omit<ScoreTarget, "taget"> {
        return new ScoreTarget(this, selector) as Omit<ScoreTarget, "taget">;
    }
}