import { AcquireAct } from "./AcquireAct";

export type PickupReturnCode = CreepActionReturnCode | ERR_FULL;

export class PickupAct extends AcquireAct<Resource> {
  public execute(creep: Creep): PickupReturnCode {
    return creep.pickup(this.target);
  }
}
