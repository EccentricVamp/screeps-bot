import { Path, Status } from "Constants";
import { Task } from "Tasks/Task";
export class Renew implements Task {
  private target: StructureSpawn;

  public static STATUS = 99;
  public static THRESHOLD = 500;

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
    if (creep.memory.status !== Renew.STATUS) {
      creep.memory.status = Renew.STATUS;
      creep.say(Status.Renew);
    }

    const result = this.target.renewCreep(creep);
    if (result === ERR_NOT_IN_RANGE) {
      creep.moveTo(this.target, Path.Renew);
    }

    return result === ERR_FULL;
  }
}
