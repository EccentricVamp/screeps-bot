import { Acquire } from "./Acquire";

export default class Harvest extends Acquire<Source | Mineral | Deposit> {
  public constructor(acquisition: Source | Mineral | Deposit) {
    super(acquisition);
    this.parts.add(WORK);
  }

  public execute(creep: Creep): CreepActionReturnCode | ERR_NOT_FOUND | ERR_NOT_ENOUGH_RESOURCES | ERR_FULL {
    const result = creep.harvest(this.acquisition);
    if (creep.store.getFreeCapacity() === 0) return ERR_FULL;
    else return result;
  }
}
