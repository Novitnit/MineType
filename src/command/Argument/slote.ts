// สร้างตัวเลขช่วงที่ต้องการให้ TypeScript บังคับจริง ๆ
type Range<
  N extends number,
  Result extends number[] = []
> =
  Result['length'] extends N
    ? Result[number]
    : Range<N, [...Result, Result['length']]>

// ช่วงตัวเลข
type ContainerIndex = Range<54>      // 0–53
type HotbarIndex = Range<9>          // 0–8
type InventoryIndex = Range<27>      // 0–26
type EnderChestIndex = Range<27>     // 0–26
type VillagerInventoryIndex = Range<8> // 0–7
type horseIndex = Range<15>        // 0–14
type playerCrafting = Range<4>    // 0–3

// Template literal ที่ผูกกับ literal number union 
export type SlotType =
    | "contents"
    | `container.${ContainerIndex}`
    | `hotbar.${HotbarIndex}`
    | `inventory.${InventoryIndex}`
    | `enderchest.${EnderChestIndex}`
    | `villager.${VillagerInventoryIndex}`
    | `horse.${horseIndex}`
    | `horse.${"saddle" | "chest"}`
    | `weapon`
    | `weapon.mainhand`
    | `weapon.offhand`
    | `armor.${"head" | "chest" | "legs" | "feet" | "body"}`
    | `player.cursor`
    | `player.crafting.${playerCrafting}`;
