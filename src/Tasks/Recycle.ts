import { Path, Message } from "Constants";
import { Task } from "Tasks/Task";
export class Recycle implements Task {
  private spawn: StructureSpawn;

  public static STATUS = 98;

  public constructor(spawn: StructureSpawn) {
    this.spawn = spawn;
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
      creep.say(Message.Recycle);
    }

    const result = this.spawn.recycleCreep(creep);
    if (result === ERR_NOT_IN_RANGE) {
      creep.moveTo(this.spawn, Path.Recycle);
    }

    if (result === ERR_INVALID_TARGET) {
      creep.memory.status = null;
      return true;
    } else return false;
  }
}
