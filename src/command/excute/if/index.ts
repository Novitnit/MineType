import { command, commandSym, FUNCTION, functionStackType, Score } from "../..";
import { dimension, MinecraftItemId, selector, tpos } from "../../Argument";
import { SlotType } from "../../Argument/slote";
import { baceExcute } from "../class";
import { If_score, ScoreCondition, ScoreConditionType } from "./ifscore";

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
    protected stackTrack: functionStackType;

    constructor() {
        super();
        const stack = FUNCTION.functionStack[FUNCTION.functionStack.length - 1] as functionStackType;
        if(!stack) throw new Error("If_Stem must be inside a FUNCTION");
        this.stackTrack = stack;
    }

    create(type: "score" | "item") {
        if(type==="score") return new If_score(this.stackTrack, this.As, this.At, this.In);
        throw new Error("Not Implemented");
    }
}