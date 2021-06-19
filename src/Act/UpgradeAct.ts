import { BaseAct } from "./BaseAct";

export class UpgradeAct extends BaseAct<StructureController> {
  public constructor(target: StructureController) {
    super(target);
    this.parts.add(CARRY).add(WORK);
    this.resources.add(RESOURCE_ENERGY);
  }

  public execute(creep: Creep): ScreepsReturnCode {
    return creep.upgradeController(this.target);
  }
}
