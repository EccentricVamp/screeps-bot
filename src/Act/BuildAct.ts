import { GenericAct } from "./BaseAct";

export type BuildReturnCode = CreepActionReturnCode | ERR_NOT_ENOUGH_ENERGY | ERR_RCL_NOT_ENOUGH;

export class BuildAct implements GenericAct<ConstructionSite> {
  public parts = [MOVE, CARRY, WORK];
  public resources = [RESOURCE_ENERGY];
  public target: ConstructionSite;

  public constructor(target: ConstructionSite) {
    this.target = target;
  }

  public execute(creep: Creep): BuildReturnCode {
    return creep.build(this.target);
  }
}
