import { Acquire } from "./Acquire";

export default class Withdraw extends Acquire<Structure | Tombstone | Ruin> {
  protected resource: ResourceConstant;

  public constructor(acquisition: Structure | Tombstone | Ruin, resource: ResourceConstant) {
    super(acquisition);
    this.resource = resource;
  }

  public execute(creep: Creep): ScreepsReturnCode  {
    return creep.withdraw(this.acquisition, this.resource);
  }
}
