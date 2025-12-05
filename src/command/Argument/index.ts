export * from "./selectors";
export * from "./score/Criteria";
export * from "./minecraft-block-types";
export * from "./minecraft-entity-types";
export * from "./minecraft-item-types";
export * from "./teamColor"
export * from "./title"
export * from './slote'

export type dimension = |"overworld" | "the_nether" | "the_end";

export type pos = number | "~" | "^" | `~${number}` | `^${number}`

export type tpos = {
    x: pos;
    y: pos;
    z: pos;
}