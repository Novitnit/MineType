import { If_StemType } from ".";
import { IF_base } from "./base";
import { command, commandSym, FUNCTION, functionStackType, Score } from "../..";
import { dimension, selector } from "../../Argument";
import { Parent, ScoreTarget, sel } from "../../score/children";

export type ScoreCondition = {
    not?: boolean;
    scoreTarget: Omit<ScoreTarget, "target">;
    condition: "<" | "<=" | "=" | ">" | ">=";
    number: number | Omit<ScoreTarget, "target">;
};

export type ScoreConditionType = {
    type: "score";
    not: boolean;
    condition: "<" | "<=" | "=" | ">" | ">=";
    number: number | {
        score1: Score;
        selector1: selector;
    };
    score: Score;
    target: selector;
};

export class If_score extends IF_base {
    constructor(stackTrack: functionStackType, As: selector | null, At: selector | null, In: dimension | null) {
        super(stackTrack, As, At, In)
    }

    if(condition: ScoreCondition, fn: () => void) {
        FUNCTION.functionStack.push(this);
        fn();
        FUNCTION.functionStack.pop();
        this.stackTrack[commandSym].push({
            type: "If_StemType",
            As: this.As || undefined,
            At: this.At || undefined,
            In: this.In || undefined,
            If_type: "score",
            if: {
                condition: {
                    type: "score",
                    not: condition.not || false,
                    condition: condition.condition,
                    score: (condition.scoreTarget as any)[Parent],
                    target: (condition.scoreTarget as any)[sel],
                    number: typeof condition.number === "number"
                        ? condition.number
                        : {
                            score1: (condition.number as any)[Parent],
                            selector1: (condition.number as any)[sel],
                        },
                },
                commands: this[commandSym]
            },
            elseIf: null,
            else: null
        })

        return new ElseIf_Score(this.stackTrack, this.As, this.At, this.In);
    }
}

export class ElseIf_Score extends IF_base {
    constructor(stackTrack: functionStackType, As: selector | null, At: selector | null, In: dimension | null) {
        super(stackTrack, As, At, In)
    }
    elseIf(condition: ScoreCondition, fn: () => void) {
        FUNCTION.functionStack.push(this);
        fn();
        FUNCTION.functionStack.pop();

        const ifstem = this.stackTrack[commandSym][this.stackTrack[commandSym].length - 1] as If_StemType;

        ifstem.elseIf ||= [];
        ifstem.elseIf.push({
            commands: this[commandSym],
            condition: {
                type: "score",
                condition: condition.condition,
                not: condition.not || false,
                score: (condition.scoreTarget as any)[Parent],
                target: (condition.scoreTarget as any)[sel],
                number: typeof condition.number === "number"
                    ? condition.number
                    : {
                        score1: (condition.number as any)[Parent],
                        selector1: (condition.number as any)[sel],
                    }
            }
        })

        return this;
    }

    else(fn: () => void) {
        FUNCTION.functionStack.push(this);
        fn();
        FUNCTION.functionStack.pop();

        const ifstem = this.stackTrack[commandSym][this.stackTrack[commandSym].length - 1] as If_StemType;
        ifstem.else = this[commandSym];
    }
}