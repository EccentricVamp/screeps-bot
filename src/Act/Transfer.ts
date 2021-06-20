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
    const resource = this.resources[0];
    const result = creep.transfer(this.target, resource);
    if (creep.store[resource] === 0) return ERR_NOT_ENOUGH_RESOURCES;
    else return result;
  }
}
