import { BaseAct, DEFAULT_PARTS } from "./BaseAct";

export type BuildReturnCode = CreepActionReturnCode | ERR_NOT_ENOUGH_ENERGY | ERR_RCL_NOT_ENOUGH;

export class BuildAct extends BaseAct<ConstructionSite> {
  public parts = DEFAULT_PARTS.concat([CARRY, WORK]);
  public resources = [RESOURCE_ENERGY];

  public constructor(target: ConstructionSite) {
    super(target);
  }

  public execute(creep: Creep): BuildReturnCode {
    return creep.build(this.target);
  }
}
