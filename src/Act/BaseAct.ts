export type MoveToReturnCode = CreepMoveReturnCode | ERR_NO_PATH | ERR_INVALID_TARGET | ERR_NOT_FOUND;

export abstract class BaseAct<T extends { pos: RoomPosition }> {
  public parts: Set<BodyPartConstant>;
  public resources: Set<ResourceConstant>;
  public target: T;

  protected constructor(target: T) {
    this.parts = new Set();
    this.resources = new Set();
    this.target = target;
  }

  public abstract execute(creep: Creep): ScreepsReturnCode;

  public move(creep: Creep): MoveToReturnCode {
    return creep.moveTo(this.target);
  }
}
