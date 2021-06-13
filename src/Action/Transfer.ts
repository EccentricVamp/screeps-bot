import { Invest } from "./Invest";

export type Transferable = Creep | Structure;

export class Transfer extends Invest<Transferable> {
  protected resource: ResourceConstant;

  public constructor(target: Transferable, resource: ResourceConstant) {
    super(target);
    this.resource = resource;
  }

  public execute(creep: Creep): ScreepsReturnCode {
    return creep.transfer(this.target, this.resource);
  }
}
