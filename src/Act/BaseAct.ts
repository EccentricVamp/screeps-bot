export interface Act {
  parts: BodyPartConstant[];
  resources: ResourceConstant[];
  target: { pos: RoomPosition };

  execute(creep: Creep): ScreepsReturnCode;
}

export interface GenericAct<Target extends { pos: RoomPosition }> extends Act {
  parts: BodyPartConstant[];
  resources: ResourceConstant[];
  target: Target;

  execute(creep: Creep): ScreepsReturnCode;
}
