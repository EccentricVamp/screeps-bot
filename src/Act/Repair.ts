import { GenericAct } from "./Act";

export type RepairReturnCode =  CreepActionReturnCode | ERR_NOT_ENOUGH_ENERGY;

export class Repair implements GenericAct<Structure> {
  public parts = [MOVE, CARRY, WORK];
  public resources = [RESOURCE_ENERGY];
  public target: Structure;

  public constructor(target: Structure) {
    this.target = target;
  }

  public execute(creep: Creep): RepairReturnCode {
    return creep.repair(this.target);
  }
}
