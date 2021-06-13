import { BaseAct } from "./BaseAct";

export type Harvestable = Source | Mineral | Deposit;
export type HarvestReturnCode = CreepActionReturnCode | ERR_NOT_FOUND | ERR_NOT_ENOUGH_RESOURCES | ERR_FULL;

export class HarvestAct extends BaseAct<Harvestable> {
  public constructor(target: Harvestable) {
    super(target);
    this.parts.add(CARRY).add(WORK);
  }

  public execute(creep: Creep): HarvestReturnCode {
    const result = creep.harvest(this.target);
    if (creep.store.getFreeCapacity() === 0) return ERR_FULL;
    else return result;
  }
}
