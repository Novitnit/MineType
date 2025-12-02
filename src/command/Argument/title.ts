import { commandReturnType, Score } from "..";
import { MinecraftEntityId } from "./minecraft-entity-types";
import { MinecraftItemId } from "./minecraft-item-types";
import { selector } from "./selectors";

type hex = `#${string}`;

type color =
    | hex
    | "black"
    | "dark_blue"
    | "dark_green"
    | "dark_aqua"
    | "dark_red"
    | "dark_purple"
    | "gold"
    | "gray"
    | "dark_gray"
    | "blue"
    | "green"
    | "aqua"
    | "red"
    | "light_purple"
    | "yellow"
    | "white"

type clickEvent =
    | {
        action: "open_url"
        url: string
    }
    | {
        action: "run_command"
        command: commandReturnType
    }
    | {
        action: "suggest_command"
        command: commandReturnType | string
    }
    | {
        action: "copy_to_clipboard"
        value: string
    };

type hoverEvent =
    | {
        action: "show_text"
        value: TitleComponent | string
    }
    | {
        action: "show_item"
        value: { id: MinecraftItemId; count?: number;}
    }
    | {
        action: "show_entity"
        value: { id: MinecraftEntityId, uuid?: string }
    };

export interface TitleTextComponent {
    text: string | selector;
    color?: color;
    bold?: boolean;
    italic?: boolean;
    underlined?: boolean;
    strikethrough?: boolean;
    obfuscated?: boolean;
    clickEvent?: clickEvent;
    hoverEvent?: hoverEvent;
}

export interface TitleScoreComponent {
    score: {selector: selector, score: Score}
    color?: color;
    bold?: boolean;
    italic?: boolean;
    underlined?: boolean;
    strikethrough?: boolean;
    obfuscated?: boolean;
    clickEvent?: clickEvent;
    hoverEvent?: hoverEvent;
}

export type TitleComponent = TitleTextComponent | TitleScoreComponent | (TitleTextComponent | TitleScoreComponent)[];