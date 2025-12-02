import { ScoreInternal } from "../../score";
import { SelectorArguments } from "./argument-types";

export type SelectorKind = "@p" | "@r" | "@a" | "@e" | "@s";

export interface SelectorArgumentsMap {
  "@p": SelectorArguments;
  "@r": SelectorArguments;
  "@a": SelectorArguments;
  "@e": SelectorArguments;
  "@s": {};
}

export type Selector<K extends SelectorKind> = {
  kind: K;
  arguments: SelectorArgumentsMap[K] | undefined;
  toString(): string;
};

export const PlayerName: string[] = [];

function createSelector<K extends keyof SelectorArgumentsMap>(kind: K, args: SelectorArgumentsMap[K] | undefined): Selector<K> {
  
  if(args && 'score' in args && args.score instanceof Object && 'score' in args.score) {
    if(ScoreInternal.isUsed(args.score) === false){
      console.error("\u001b[33mWarning: The Score used is not changed before. Did you forget to use it?\u001b[0m");
      ScoreInternal.setUsed(args.score, true);
    }  
  }
  
  return {
    kind,
    arguments: args,
    toString() {
      if (!this.arguments) return this.kind;

      const entries = Object.entries(this.arguments)
        .map(([k, v]) => {
          if (Array.isArray(v)) {
            return `${k}=${v.join(",")}`;
          }
          return `${k}=${v}`;
        })
        .join(",");

      return `${this.kind}[${entries}]`;
    }
  };
}

export function self(): Selector<"@s"> {
  return createSelector("@s", undefined);
}

export function nearestPlayer(args?: SelectorArgumentsMap["@p"]): Selector<"@p"> {
  return createSelector("@p", args);
}

export function randomPlayer(args?: SelectorArgumentsMap["@r"]): Selector<"@r"> {
  return createSelector("@r", args)
}

export function allPlayers(args?: SelectorArgumentsMap["@a"]): Selector<"@a"> {
  return createSelector("@a", args)
}

export function allEntities(args?: SelectorArgumentsMap["@e"]): Selector<"@e"> {
  return createSelector("@e", args)
}

export function regPlayer(name: string): string & {__registeredPlayer: true} {
  PlayerName.push(name);
  return name as string & {__registeredPlayer: true};
}

export type selector = | ReturnType<typeof self>
  | ReturnType<typeof nearestPlayer>
  | ReturnType<typeof randomPlayer>
  | ReturnType<typeof allPlayers>
  | ReturnType<typeof allEntities>
  | ReturnType<typeof regPlayer>;