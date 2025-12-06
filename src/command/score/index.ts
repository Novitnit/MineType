import { ScoreCriteria } from "../Argument/score/Criteria";
import { selector } from "../Argument/selectors";
import { ScoreTarget } from "./children";
import { createScore } from "./create";
import fs from "fs";

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
        this[kName] = scoreOption.display ?? `score_${id}`

        const error = new Error()
        const stackLines = error.stack?.split("\n") || [];
        const callerLine = stackLines[2] || "";
        const match = callerLine.match(/file:\/\/\/(.*):(\d+):\d+/);
        if (match && scoreOption.display === undefined) {
            const filePath = match[1] as string;
            const lineNumber = match[2];
            const line = fs.readFileSync(filePath, "utf-8").split("\n")[Number(lineNumber)-1] as string;
            const matchName = line.match(/const (\w+) =/)
            const name = matchName ? matchName[1] as string : `score_${id}`;

            this[kName] = name;
        }

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