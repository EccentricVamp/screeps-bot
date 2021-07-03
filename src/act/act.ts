import { Harvest } from "./harvest";
import { Pickup } from "./pickup";
import { Withdraw } from "./withdraw";
import { union } from "lodash";

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
  return union(...actParts);
}

export type Collect = Harvest | Pickup | Withdraw;

export { Build } from "./build";
export { Claim } from "./claim";
export { Harvest, Harvestable } from "./harvest";
export { Pickup } from "./pickup";
export { Recycle } from "./recycle";
export { Renew } from "./renew";
export { Repair } from "./repair";
export { Transfer, Transferable } from "./transfer";
export { Upgrade } from "./upgrade";
export { Withdraw, Withdrawable } from "./withdraw";
