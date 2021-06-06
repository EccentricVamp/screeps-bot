import { Path, Status } from "Constants";
import Task from "Tasks/Task";
export default class Recycle implements Task {
  private target: StructureSpawn;

  public constructor(target: StructureSpawn) {
    this.target = target;
  }

  public interview(): number | null {
    return null;
  }

  public perform(creep: Creep): boolean {
    const RECYCLING = 98;

    if (creep.memory.status !== RECYCLING) {
      creep.memory.status = RECYCLING;
      creep.say(Status.Recycle);
    }

    const result = this.target.recycleCreep(creep);
    if (result === ERR_NOT_IN_RANGE) {
      creep.moveTo(this.target, Path.Recycle);
    }

    return result === ERR_INVALID_TARGET;
  }
}
