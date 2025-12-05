import { allFunctions, command, commandSym, FUNCTION, Score } from "../..";
import { dimension, selector } from "../../Argument";
import { Parent, ScoreTarget, sel } from "../../score/children";
import { baceExcute } from "../class";

type Condition = {
    scoreTaget: Omit<ScoreTarget, "target">;
    condition: "<" | "<=" | "=" | ">" | ">=";
    number: number | Omit<ScoreTarget, "target">;
};

type ConditionType = {
    type: "score";
    condition: "<" | "<=" | "=" | ">" | ">=";
    number: number | {
        score1: Score;
        selector1: selector;
    };
    score: Score
    target: selector
}

export interface If_StemType {
    type: "If_StemType";
    As: selector | undefined
    At: selector | undefined
    In: dimension | undefined
    id: number;
    If_type: "score";
    if: {
        condition: ConditionType;
        commands: command;
    };
    elseIf: {
        condition: ConditionType;
        commands: command;
    }[] | null;
    else: command | null;
}

export class If_Stem extends baceExcute {
    [commandSym]: command = [];
    static Id = 0;
    protected stackTrack: FUNCTION | If_Stem | ElseIf;

    constructor() {
        super();

        this.stackTrack = FUNCTION.functionStack[FUNCTION.functionStack.length - 1] as FUNCTION | If_Stem | ElseIf;
    }

    if(Condition: Condition, fn: () => void) {
        FUNCTION.functionStack.push(this);
        fn();
        FUNCTION.functionStack.pop();

        (this.stackTrack as any)[commandSym].push({
            type: "If_StemType",
            If_type: "score",
            As: this.As ?? undefined,
            At: this.At ?? undefined,
            In: this.In ?? undefined,
            if: {
                condition: {
                    type: "score",
                    condition: Condition.condition,
                    number: (typeof Condition.number === "number") ? Condition.number : {
                        score1: ((Condition.number as Omit<ScoreTarget, "target">) as any)[Parent],
                        selector1: ((Condition.number as Omit<ScoreTarget, "target">) as any)[sel]
                    },
                    score: (Condition.scoreTaget as any)[Parent],
                    target: (Condition.scoreTaget as any)[sel]
                },
                commands: (this as any)[commandSym]
            },
            elseIf: null,
            else: null
        })
        return new ElseIf();
    }

}

export class ElseIf {
    [commandSym]: command = [];
    protected stackTrack: FUNCTION | If_Stem | ElseIf;
    constructor() {
        this.stackTrack = FUNCTION.functionStack[FUNCTION.functionStack.length - 1] as FUNCTION | If_Stem | ElseIf;
    }

    elseIf(Condition: Condition, fn: () => void) {
        FUNCTION.functionStack.push(this);
        fn();
        FUNCTION.functionStack.pop();
        (this.stackTrack as any)[commandSym][(this.stackTrack as any)[commandSym].length - 1].elseIf ||= [];
        (this.stackTrack as any)[commandSym][(this.stackTrack as any)[commandSym].length - 1].elseIf?.push({
            condition: {
                type: "score",
                condition: Condition.condition,
                number: (typeof Condition.number === "number") ? Condition.number : {
                    score1: ((Condition.number as Omit<ScoreTarget, "target">) as any)[Parent],
                    selector1: ((Condition.number as Omit<ScoreTarget, "target">) as any)[sel]
                },
                target: (Condition.scoreTaget as any)[sel],
                score: (Condition.scoreTaget as any)[Parent],
            },
            commands: (this as any)[commandSym]
        });
        (this as any)[commandSym] = [];

        return this;
    }

    else(fn: () => void) {
        FUNCTION.functionStack.push(this);
        fn();
        FUNCTION.functionStack.pop();
        (this.stackTrack as any)[commandSym][(this.stackTrack as any)[commandSym].length - 1].else = (this as any)[commandSym];
    }
}