import { InvestAct } from "./InvestAct";

export type BuildReturnCode = CreepActionReturnCode | ERR_NOT_ENOUGH_ENERGY | ERR_RCL_NOT_ENOUGH;

export default class BuildAct extends InvestAct<ConstructionSite> {
  public constructor(target: ConstructionSite) {
    super(target);
    this.parts.add(WORK);
    this.resources.add(RESOURCE_ENERGY);
  }

  public execute(creep: Creep): BuildReturnCode {
    return creep.build(this.target);
  }
}
