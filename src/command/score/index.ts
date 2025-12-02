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

export const kName = Symbol("Score.name");
export const kType = Symbol("Score.type");
export const kUsed = Symbol("Score.used");

export const ScoreTable: ScoreType[] = [];

export class Score {
    [kName]: string;
    [kType]: ScoreCriteria;
    [kUsed]: boolean = false;

    constructor(scoreOption: scoreOption) {
        const id = scoreId++;
        this[kType] = scoreOption.type ?? "dummy";
        this[kName] = scoreOption.display ?? `score_${id}`;

        createScore(this[kName], this[kType], this);
    }

    public target(selector: selector
    ): Omit<ScoreTarget, "target"> {
        return new ScoreTarget(this, selector) as Omit<ScoreTarget, "target">;
    }

    toJSON(){
        return this[kName];
    }

    toString(){
        return this[kName];
    }
}

export const ScoreInternal = {
    getName(score: Score) {
        return score[kName] as string;
    },
    getType(score: Score) {
        return score[kType] as ScoreCriteria;
    },
    isUsed(score: Score) {
        return !!score[kUsed];
    },
    setUsed(score: Score, used = true) {
        score[kUsed] = used;
    }
};