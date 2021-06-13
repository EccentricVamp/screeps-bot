import { Acquire } from "./Acquire";

export type Withdrawable = Structure | Tombstone | Ruin;

export class Withdraw extends Acquire<Withdrawable> {
  protected resource: ResourceConstant;

  public constructor(target: Withdrawable, resource: ResourceConstant) {
    super(target);
    this.resource = resource;
  }

  public execute(creep: Creep): ScreepsReturnCode {
    return creep.withdraw(this.target, this.resource);
  }
}
