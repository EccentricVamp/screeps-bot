import { GenericAct } from "./act";

export type Withdrawable = Structure | Tombstone | Ruin;

export class Withdraw implements GenericAct<Withdrawable> {
  public parts = [MOVE, CARRY];
  public resources: ResourceConstant[];
  public target: Withdrawable;

  public constructor(target: Withdrawable, resource: ResourceConstant = RESOURCE_ENERGY) {
    this.resources = [resource];
    this.target = target;
  }

  public execute(creep: Creep): ScreepsReturnCode {
    return creep.withdraw(this.target, this.resources[0]);
  }
}
