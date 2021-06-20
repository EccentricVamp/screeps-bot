import _ from "lodash";

export interface Act {
  parts: BodyPartConstant[];
  resources: ResourceConstant[];
  target: { pos: RoomPosition };

  execute(creep: Creep): ScreepsReturnCode;
}

export interface GenericAct<Target extends { pos: RoomPosition }> extends Act {
  target: Target;
}

export function getParts(acts: Act[]) {
  const actParts = acts.map(a => a.parts);
  return _.union(...actParts);
}
