import { GenericAct } from "./Act";

export class Upgrade implements GenericAct<StructureController> {
  public parts = [MOVE, CARRY, WORK];
  public resources = [RESOURCE_ENERGY];
  public target: StructureController;

  public constructor(target: StructureController) {
    this.target = target;
  }

  public execute(creep: Creep): ScreepsReturnCode {
    return creep.upgradeController(this.target);
  }
}
