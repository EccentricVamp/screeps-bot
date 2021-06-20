import { GenericAct } from "./Act";

export type ClaimReturnCode = CreepActionReturnCode | ERR_FULL | ERR_GCL_NOT_ENOUGH;

export class Claim implements GenericAct<StructureController> {
  public parts = [MOVE, CLAIM];
  public resources = [];
  public target: StructureController;

  public constructor(target: StructureController) {
    this.target = target;
  }

  public execute(creep: Creep): ClaimReturnCode {
    return creep.claimController(this.target);
  }
}
