import { GenericAct } from "./BaseAct";

export type PickupReturnCode = CreepActionReturnCode | ERR_FULL;

export class PickupAct implements GenericAct<Resource> {
  public parts = [MOVE, CARRY];
  public resources = [];
  public target: Resource;

  public constructor(target: Resource) {
    this.target = target;
  }

  public execute(creep: Creep): PickupReturnCode {
    return creep.pickup(this.target);
  }
}
