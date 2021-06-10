import { Path, Message } from "Constants";
import { Task } from "Tasks/Task";
export class Renew implements Task {
  private spawn: StructureSpawn;

  public static STATUS = 99;
  public static THRESHOLD = 500;

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
    if (creep.memory.status !== Renew.STATUS) {
      creep.memory.status = Renew.STATUS;
      creep.say(Message.Renew);
    }

    const result = this.spawn.renewCreep(creep);
    if (result === ERR_NOT_IN_RANGE) {
      creep.moveTo(this.spawn, Path.Renew);
    }

    if (result === ERR_FULL) {
      creep.memory.status = null;
      return true;
    } else return false;
  }
}
