import { BaseAct } from "./BaseAct";

export type Withdrawable = Structure | Tombstone | Ruin;

export class WithdrawAct extends BaseAct<Withdrawable> {
  protected resource: ResourceConstant;

  public constructor(target: Withdrawable, resource: ResourceConstant) {
    super(target);
    this.parts.add(CARRY);
    this.resource = resource;
  }

  public execute(creep: Creep): ScreepsReturnCode {
    return creep.withdraw(this.target, this.resource);
  }
}
