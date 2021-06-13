import { BaseAct } from "./BaseAct";

export default class RepairAct extends BaseAct<Structure> {
  public constructor(target: Structure) {
    super(target);
    this.parts.add(CARRY).add(WORK);
    this.resources.add(RESOURCE_ENERGY);
  }

  public execute(creep: Creep): CreepActionReturnCode | ERR_NOT_ENOUGH_ENERGY {
    return creep.repair(this.target);
  }
}
