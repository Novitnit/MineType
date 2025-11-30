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
  arguments?: SelectorArgumentsMap[K];
};

export type AnySelector = Selector<SelectorKind>;

export function self(): Selector<"@s"> {
  return { kind: "@s" };
}

export function nearestPlayer(args?: SelectorArgumentsMap["@p"]): Selector<"@p"> {
  return args
    ? { kind: "@p", arguments: args }
    : { kind: "@p" };
}

export function randomPlayer(args?: SelectorArgumentsMap["@r"]): Selector<"@r"> {
  return args
    ? { kind: "@r", arguments: args }
    : { kind: "@r" };
}

export function allPlayers(args?: SelectorArgumentsMap["@a"]): Selector<"@a"> {
  return args
    ? { kind: "@a", arguments: args }
    : { kind: "@a" };
}

export function allEntities(args?: SelectorArgumentsMap["@e"]): Selector<"@e"> {
  return args
    ? { kind: "@e", arguments: args }
    : { kind: "@e" };
}