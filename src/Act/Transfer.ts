import { GenericAct } from "./Act";

export type Transferable = Creep | Structure;

export class Transfer implements GenericAct<Transferable> {
  public parts = [MOVE, CARRY];
  public resources: ResourceConstant[];
  public target: Transferable;

  public constructor(target: Transferable, resource: ResourceConstant) {
    this.resources = [resource];
    this.target = target;
  }

  public execute(creep: Creep): ScreepsReturnCode {
    return creep.transfer(this.target, this.resources[0]);
  }
}
