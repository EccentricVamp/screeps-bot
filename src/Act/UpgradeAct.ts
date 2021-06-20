import { BaseAct, DEFAULT_PARTS } from "./BaseAct";

export class UpgradeAct extends BaseAct<StructureController> {
  public parts = DEFAULT_PARTS.concat([CARRY, WORK]);
  public resources = [RESOURCE_ENERGY];

  public constructor(target: StructureController) {
    super(target);
  }

  public execute(creep: Creep): ScreepsReturnCode {
    return creep.upgradeController(this.target);
  }
}
