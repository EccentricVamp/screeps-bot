import { GenericAct } from "./BaseAct";

export class RepairAct implements GenericAct<Structure> {
  public parts = [MOVE, CARRY, WORK];
  public resources = [RESOURCE_ENERGY];
  public target: Structure;

  public constructor(target: Structure) {
    this.target = target;
  }

  public execute(creep: Creep): CreepActionReturnCode | ERR_NOT_ENOUGH_ENERGY {
    return creep.repair(this.target);
  }
}
