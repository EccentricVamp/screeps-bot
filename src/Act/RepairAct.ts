import { BaseAct, DEFAULT_PARTS } from "./BaseAct";

export class RepairAct extends BaseAct<Structure> {
  public parts = DEFAULT_PARTS.concat([CARRY, WORK]);
  public resources = [RESOURCE_ENERGY];

  public constructor(target: Structure) {
    super(target);
  }

  public execute(creep: Creep): CreepActionReturnCode | ERR_NOT_ENOUGH_ENERGY {
    return creep.repair(this.target);
  }
}
