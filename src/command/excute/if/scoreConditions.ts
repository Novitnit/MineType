import { Score } from "../..";
import { selector } from "../../Argument";
import { Parent, ScoreTarget, sel } from "../../score/children";

export interface ScoreConditionType {
    type: "score";
    score: Score;
    target: selector;
    condition: ">" | "<" | "=" | ">=" | "<=" | "!=";
    value: number | {
        score: Score;
        target: selector;
    };
    not: boolean;
}

export function score(score: Omit<ScoreTarget,"target">,condition:">" | "<" | "=" | ">=" | "<=" | "!=" ,value:number | Omit<ScoreTarget,"target">): ScoreConditionType {
    return {
        type: "score",
        score: (score as any)[Parent],
        target: (score as any)[sel],
        condition,
        value: typeof value === "number" ? value : {
            score: (value as any)[Parent],
            target: (value as any)[sel],
        },
        not: false,
    }
}

export function nscore(score: Omit<ScoreTarget,"target">,condition:">" | "<" | "=" | ">=" | "<=" | "!=" ,value:number | Omit<ScoreTarget,"target">): ScoreConditionType {
    return {
        type: "score",
        score: (score as any)[Parent],
        target: (score as any)[sel],
        condition,
        value: typeof value === "number" ? value : {
            score: (value as any)[Parent],
            target: (value as any)[sel],
        },
        not: true,
    }
}