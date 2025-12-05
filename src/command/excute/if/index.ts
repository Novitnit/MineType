import { allFunctions, com, command, commandSym, FUNCTION, Score } from "../..";
import { dimension, MinecraftItemId, selector, tpos } from "../../Argument";
import { SlotType } from "../../Argument/slote";
import { Parent, ScoreTarget, sel } from "../../score/children";
import { baceExcute } from "../class";

type ScoreCondition = {
    type: "score";
    not?: boolean;
    scoreTarget: Omit<ScoreTarget, "target">;
    condition: "<" | "<=" | "=" | ">" | ">=";
    number: number | Omit<ScoreTarget, "target">;
};

type ItemCondition =
    | {
        type: "item";
        itemType: "block";
        not?: boolean;
        Pos: tpos;
        slot: SlotType;
        item: MinecraftItemId;
    }
    | {
        type: "item";
        itemType: "entity";
        not?: boolean;
        selector: selector;
        slot: SlotType;
        item: MinecraftItemId;
    };

type Condition = ScoreCondition | ItemCondition;

type ScoreConditionType = {
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

type BlockConditionType = {
    type: "item";
    itemType: "block";
    not: boolean;
    Pos: tpos;
    slot: SlotType;
    item: MinecraftItemId;
};

type EntityItemConditionType = {
    type: "item";
    itemType: "entity";
    not: boolean;
    selector: selector;
    slot: SlotType;
    item: MinecraftItemId;
};

type ConditionType =
    | ScoreConditionType
    | BlockConditionType
    | EntityItemConditionType;

export interface If_StemType {
    type: "If_StemType";
    As: selector | undefined;
    At: selector | undefined;
    In: dimension | undefined;
    If_type: "score" | "item";
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

        (this.stackTrack as any)[commandSym] ||= [];

        const condObj = this.convertCondition(Condition);

        (this.stackTrack as any)[commandSym].push({
            type: "If_StemType",
            If_type: condObj.type,
            As: this.As ?? undefined,
            At: this.At ?? undefined,
            In: this.In ?? undefined,
            if: {
                condition: condObj,
                commands: (this as any)[commandSym]
            },
            elseIf: null,
            else: null
        });

        return new ElseIf(this.stackTrack);
    }

    private convertCondition(Condition: Condition): ConditionType {
        const not = Condition.not ?? false;

        if (Condition.type === "score") {
            return {
                type: "score",
                not,
                condition: Condition.condition,
                number:
                    typeof Condition.number === "number"
                        ? Condition.number
                        : {
                            score1: (Condition.number as any)[Parent],
                            selector1: (Condition.number as any)[sel]
                        },
                score: (Condition.scoreTarget as any)[Parent],
                target: (Condition.scoreTarget as any)[sel]
            };
        }

        if (Condition.itemType === "block") {
            return {
                type: "item",
                itemType: "block",
                not,
                Pos: Condition.Pos,
                slot: Condition.slot,
                item: Condition.item
            };
        }

        return {
            type: "item",
            itemType: "entity",
            not,
            selector: (Condition as any).selector,
            slot: Condition.slot,
            item: Condition.item
        };
    }
}

export class ElseIf {
    [commandSym]: command = [];
    protected stackTrack: FUNCTION | If_Stem | ElseIf;

    constructor(stack: any) {
        this.stackTrack = stack;
    }

    elseIf(Condition: Condition, fn: () => void) {
        FUNCTION.functionStack.push(this);
        fn();
        FUNCTION.functionStack.pop();

        const arr = (this.stackTrack as any)[commandSym] as command;
        const else_if =(arr[arr.length - 1] as If_StemType)
        else_if.elseIf ||= [];

        const condObj = (new If_Stem() as any).convertCondition(Condition);
        
        if(condObj.type !== else_if.If_type) throw new Error("ElseIf condition type must be same as If condition type");
        
        else_if.elseIf.push({
            condition: condObj,
            commands: (this as any)[commandSym]
        });
        (this as any)[commandSym] = [];

        return this;
    }

    else(fn: () => void) {
        FUNCTION.functionStack.push(this);
        fn();
        FUNCTION.functionStack.pop();

        const arr = (this.stackTrack as any)[commandSym];
        arr[arr.length - 1].else = (this as any)[commandSym];
    }
}