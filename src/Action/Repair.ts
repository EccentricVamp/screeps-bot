import { Invest } from "./Invest";

export default class Repair extends Invest<Structure> {
  public constructor(target: Structure) {
    super(target);
    this.parts.add(WORK);
    this.resources.add(RESOURCE_ENERGY);
  }

  public execute(creep: Creep): CreepActionReturnCode | ERR_NOT_ENOUGH_ENERGY {
    return creep.repair(this.target);
  }
}
