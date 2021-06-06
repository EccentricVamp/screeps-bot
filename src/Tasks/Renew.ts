import { Path, Status } from "Constants";
import Task from "Tasks/Task";
export default class Renew implements Task {
  private target: StructureSpawn;

  public constructor(target: StructureSpawn) {
    this.target = target;
  }

  public interview(): number | null {
    return null;
  }

  public perform(creep: Creep): boolean {
    const RENEWING = 99;

    if (creep.memory.status !== RENEWING) {
      creep.memory.status = RENEWING;
      creep.say(Status.Renew);
    }

    const result = this.target.renewCreep(creep);
    if (result === ERR_NOT_IN_RANGE) {
      creep.moveTo(this.target, Path.Default);
    }

    return result === ERR_FULL;
  }
}
