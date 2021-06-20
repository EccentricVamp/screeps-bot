import { BaseAct, DEFAULT_PARTS } from "./BaseAct";

export type Withdrawable = Structure | Tombstone | Ruin;

export class WithdrawAct extends BaseAct<Withdrawable> {
  public parts = DEFAULT_PARTS.concat(CARRY);
  public resources: ResourceConstant[]
  protected resource: ResourceConstant;

  public constructor(target: Withdrawable, resource: ResourceConstant) {
    super(target);
    this.resources = [resource];
    this.resource = resource;
  }

  public execute(creep: Creep): ScreepsReturnCode {
    return creep.withdraw(this.target, this.resource);
  }
}
