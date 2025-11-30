import { MinecraftEntityId } from "../../minecraft-entity-types";

type range = number | `${number}..` | `..${number}` | `${number}..${number}`;

export interface SelectorArguments {
    x?: number;
    y?: number;
    z?: number;
    dx?: number;
    dy?: number;
    dz?: number;

    distance?: range;
    //score
    tags?: string[];
    //nbt
    type: MinecraftEntityId
    //team
    limit?: number;
    gamemode?: "survival" | "creative" | "adventure" | "spectator";
    name?: string;
    level?: range;

    XRotation?: range;
    YRotation?: range;
    sort?: "nearest" | "furthest" | "random" | "arbitrary";
}