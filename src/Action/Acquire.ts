import { Action } from "./Action";
import { Harvestable } from "./Harvest";
import { Withdrawable } from "./Withdraw";

export type Acquireable = Harvestable | Resource | Withdrawable;

export abstract class Acquire<Acquisition extends Acquireable> extends Action<Acquisition> {
  protected constructor(target: Acquisition) {
    super(target);
    this.parts.add(CARRY).add(MOVE);
  }

  public abstract execute(creep: Creep): ScreepsReturnCode;
}
