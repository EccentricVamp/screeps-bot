import { BaseAct, DEFAULT_PARTS } from "./BaseAct";

export type Transferable = Creep | Structure;

export class TransferAct extends BaseAct<Transferable> {
  public parts = DEFAULT_PARTS.concat(CARRY);
  public resources: ResourceConstant[];
  protected resource: ResourceConstant;

  public constructor(target: Transferable, resource: ResourceConstant) {
    super(target);
    this.resources = [resource];
    this.resource = resource;
  }

  public execute(creep: Creep): ScreepsReturnCode {
    return creep.transfer(this.target, this.resource);
  }
}
