export type MoveToReturnCode = CreepMoveReturnCode | ERR_NO_PATH | ERR_INVALID_TARGET | ERR_NOT_FOUND;

export interface Act {
  parts: BodyPartConstant[];
  resources: ResourceConstant[];
  target: { pos: RoomPosition };

  execute(creep: Creep): ScreepsReturnCode;
  move(creep: Creep): MoveToReturnCode;
}

export const DEFAULT_PARTS: BodyPartConstant[] = [MOVE];

export abstract class BaseAct<T extends { pos: RoomPosition }> implements Act {
  public abstract parts: BodyPartConstant[];
  public abstract resources: ResourceConstant[];
  public target: T;

  protected constructor(target: T) {
    this.target = target;
  }

  public abstract execute(creep: Creep): ScreepsReturnCode;

  public move(creep: Creep): MoveToReturnCode {
    return creep.moveTo(this.target);
  }
}
