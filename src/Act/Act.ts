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

export * from "./Build";
export * from "./Claim";
export * from "./Harvest";
export * from "./Pickup";
export * from "./Recycle";
export * from "./Renew";
export * from "./Repair";
export * from "./Transfer";
export * from "./Upgrade";
export * from "./Withdraw";
