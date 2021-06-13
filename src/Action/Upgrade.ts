import { Invest } from "./Invest";

export default class Upgrade extends Invest<StructureController> {
  public constructor(target: StructureController) {
    super(target);
    this.parts.add(WORK);
    this.resources.add(RESOURCE_ENERGY);
  }

  public execute(creep: Creep): ScreepsReturnCode {
    return creep.upgradeController(this.target);
  }
}
