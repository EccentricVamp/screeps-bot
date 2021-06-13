import { BaseAct } from "./BaseAct";

export type Transferable = Creep | Structure;

export class TransferAct extends BaseAct<Transferable> {
  protected resource: ResourceConstant;

  public constructor(target: Transferable, resource: ResourceConstant) {
    super(target);
    this.parts.add(CARRY);
    this.resource = resource;
  }

  public execute(creep: Creep): ScreepsReturnCode {
    return creep.transfer(this.target, this.resource);
  }
}
