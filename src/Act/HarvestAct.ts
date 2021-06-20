import { BaseAct, DEFAULT_PARTS } from "./BaseAct";

export type Harvestable = Source | Mineral | Deposit;
export type HarvestReturnCode = CreepActionReturnCode | ERR_NOT_FOUND | ERR_NOT_ENOUGH_RESOURCES | ERR_FULL;

export class HarvestAct extends BaseAct<Harvestable> {
  public parts = DEFAULT_PARTS.concat([CARRY, WORK]);
  public resources = [];

  public constructor(target: Harvestable) {
    super(target);
  }

  public execute(creep: Creep): HarvestReturnCode {
    const result = creep.harvest(this.target);
    if (creep.store.getFreeCapacity() === 0) return ERR_FULL;
    else return result;
  }
}
