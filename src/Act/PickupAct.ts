import { BaseAct } from "./BaseAct";

export type PickupReturnCode = CreepActionReturnCode | ERR_FULL;

export class PickupAct extends BaseAct<Resource> {
  public constructor(target: Resource) {
    super(target);
    this.parts.add(CARRY);
  }

  public execute(creep: Creep): PickupReturnCode {
    return creep.pickup(this.target);
  }
}
