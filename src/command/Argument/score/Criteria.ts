import { MinecraftBlockId } from "../minecraft-block-types";
import { MinecraftEntityId } from "../minecraft-entity-types";
import { MinecraftItemId } from "../minecraft-item-types";
import { TeamColor } from "../teamColor";

type StandardCriteria =
  | "dummy"
  | "deathCount"
  | "playerKillCount"
  | "totalKillCount"
  | "health"
  | "food"
  | "air"
  | "armor"
  | "xp"
  | "level"

type StatCriteria =
  | { broken: MinecraftItemId }
  | { crafted: MinecraftItemId }
  | { used: MinecraftItemId }
  | { mined: MinecraftBlockId }
  | { picked_up: MinecraftItemId }
  | { dropped: MinecraftItemId }
  | { killed: MinecraftEntityId }
  | { killed_by: MinecraftEntityId }

export type ScoreCriteria =
  | StandardCriteria
  |{
        teamKill: TeamColor;
  }
  |{
        killedByTeam: TeamColor;
  }
  | StatCriteria;