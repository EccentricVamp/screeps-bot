import Action from "./Action";

export type ResourceAcquisition = Structure | Tombstone | Ruin | Source | Mineral | Deposit | Resource;

export abstract class Acquire<Acquisition extends ResourceAcquisition> implements Action {
  protected acquisition: Acquisition;

  public parts: Set<BodyPartConstant>;
  public resources: Set<ResourceConstant>;

  public constructor(acquisition: Acquisition) {
    this.acquisition = acquisition;
    this.parts = new Set([CARRY, MOVE]);
    this.resources = new Set();
  }

  public abstract execute(creep: Creep): ScreepsReturnCode;
  public move(creep: Creep): CreepMoveReturnCode | ERR_NO_PATH | ERR_INVALID_TARGET | ERR_NOT_FOUND  {
    return creep.moveTo(this.acquisition);
  }
}
