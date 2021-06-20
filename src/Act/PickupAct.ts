import { BaseAct, DEFAULT_PARTS } from "./BaseAct";

export type PickupReturnCode = CreepActionReturnCode | ERR_FULL;

export class PickupAct extends BaseAct<Resource> {
  public parts = DEFAULT_PARTS.concat([CARRY]);
  public resources = [];

  public constructor(target: Resource) {
    super(target);
  }

  public execute(creep: Creep): PickupReturnCode {
    return creep.pickup(this.target);
  }
}
