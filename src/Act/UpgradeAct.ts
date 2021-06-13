import { InvestAct } from "./InvestAct";

export default class UpgradeAct extends InvestAct<StructureController> {
  public constructor(target: StructureController) {
    super(target);
    this.parts.add(WORK);
    this.resources.add(RESOURCE_ENERGY);
  }

  public execute(creep: Creep): ScreepsReturnCode {
    return creep.upgradeController(this.target);
  }
}
