import { Path, Status } from "Constants";
import { Task } from "Tasks/Task";
export class Recycle implements Task {
  private target: StructureSpawn;

  public static STATUS = 98;

  public constructor(target: StructureSpawn) {
    this.target = target;
  }

  public eligible(): boolean {
    return true;
  }

  public interview(): number {
    return 1;
  }

  public perform(creep: Creep): boolean {
    if (creep.memory.status !== Recycle.STATUS) {
      creep.memory.status = Recycle.STATUS;
      creep.say(Status.Recycle);
    }

    const result = this.target.recycleCreep(creep);
    if (result === ERR_NOT_IN_RANGE) {
      creep.moveTo(this.target, Path.Recycle);
    }

    return result === ERR_INVALID_TARGET;
  }
}
