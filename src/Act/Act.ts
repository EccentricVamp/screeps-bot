import { Harvest } from "./Harvest";
import { Pickup } from "./Pickup";
import { Withdraw } from "./Withdraw";
import _ from "lodash";

/** Represents an abstraction of some "action" a creep can do. */
export interface Act {
  parts: BodyPartConstant[];
  resources: ResourceConstant[];
  target: { pos: RoomPosition };

  execute(creep: Creep): ScreepsReturnCode;
}

/** Generic extension of {@link Act} for supporting strongly typed {@link Act.target}s */
export interface GenericAct<Target extends { pos: RoomPosition }> extends Act {
  target: Target;
}

/** Returns the union of the parts required for each act */
export function getParts(acts: Act[]): BodyPartConstant[] {
  const actParts = acts.map(a => a.parts);
  return _.union(...actParts);
}

export type Collect = Harvest | Pickup | Withdraw;

export { Build } from "./Build";
export { Claim } from "./Claim";
export { Harvest, Harvestable } from "./Harvest";
export { Pickup } from "./Pickup";
export { Recycle } from "./Recycle";
export { Renew } from "./Renew";
export { Repair } from "./Repair";
export { Transfer, Transferable } from "./Transfer";
export { Upgrade } from "./Upgrade";
export { Withdraw, Withdrawable } from "./Withdraw";
