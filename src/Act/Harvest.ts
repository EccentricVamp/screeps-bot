import { GenericAct } from "./Act";

export type Harvestable = Source | Mineral | Deposit;
export type HarvestReturnCode = CreepActionReturnCode | ERR_NOT_FOUND | ERR_NOT_ENOUGH_RESOURCES | ERR_FULL;

export class Harvest implements GenericAct<Harvestable> {
  public parts = [MOVE, CARRY, WORK];
  public resources = [];
  public target: Harvestable;

  public constructor(target: Harvestable) {
    this.target = target;
  }

  public execute(creep: Creep): HarvestReturnCode {
    const result = creep.harvest(this.target);
    if (creep.store.getFreeCapacity() === 0) return ERR_FULL;
    else return result;
  }
}
