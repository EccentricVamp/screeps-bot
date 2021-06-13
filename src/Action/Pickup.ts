import { Acquire } from "./Acquire";

export default class Pickup extends Acquire<Resource> {
  public execute(creep: Creep): CreepActionReturnCode | ERR_FULL {
    return creep.pickup(this.acquisition);
  }
}
