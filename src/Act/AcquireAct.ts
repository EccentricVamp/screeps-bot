import { BaseAct } from "./BaseAct";
import { Harvestable } from "./HarvestAct";
import { Withdrawable } from "./WithdrawAct";

export type Acquireable = Harvestable | Resource | Withdrawable;

export abstract class AcquireAct<Acquisition extends Acquireable> extends BaseAct<Acquisition> {
  protected constructor(target: Acquisition) {
    super(target);
    this.parts.add(CARRY).add(MOVE);
  }

  public abstract execute(creep: Creep): ScreepsReturnCode;
}
