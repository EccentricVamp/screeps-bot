import { Acquire } from "./Acquire";

export type PickupReturnCode = CreepActionReturnCode | ERR_FULL;

export class Pickup extends Acquire<Resource> {
  public execute(creep: Creep): PickupReturnCode {
    return creep.pickup(this.target);
  }
}
