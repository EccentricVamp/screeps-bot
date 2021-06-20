import { GenericAct } from "./Act";

export class Renew implements GenericAct<StructureSpawn> {
  public parts = [];
  public resources = [RESOURCE_ENERGY];
  public target: StructureSpawn;

  public constructor(target: StructureSpawn) {
    this.target = target;
  }

  public execute(creep: Creep): ScreepsReturnCode {
    return this.target.renewCreep(creep);
  }
}
