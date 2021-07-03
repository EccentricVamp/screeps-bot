import { GenericAct } from "./act";

export class Recycle implements GenericAct<StructureSpawn> {
  public parts = [];
  public resources = [];
  public target: StructureSpawn;

  public constructor(target: StructureSpawn) {
    this.target = target;
  }

  public execute(creep: Creep): ScreepsReturnCode {
    return this.target.recycleCreep(creep);
  }
}
