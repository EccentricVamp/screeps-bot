import { Path, Status } from "Constants";
import { Task } from "Tasks/Task";
export class Claim implements Task {
  private target: StructureController;

  public constructor(target: StructureController) {
    this.target = target;
  }

  public eligible(creep: Creep): boolean {
    const claim = creep.getActiveBodyparts(CLAIM);
    const move = creep.getActiveBodyparts(MOVE);
    return claim > 0 && move > 0;
  }

  public interview(creep: Creep): number {
    const claim = creep.getActiveBodyparts(CLAIM);
    const move = creep.getActiveBodyparts(MOVE);
    return claim + move;
  }

  public perform(creep: Creep): boolean {
    const CLAIMING = 1;

    if (creep.memory.status !== CLAIMING) {
      creep.memory.status = CLAIMING;
      creep.say(Status.Claim);
    }

    const result = creep.claimController(this.target);
    if (result === ERR_NOT_IN_RANGE) {
      creep.moveTo(this.target, Path.Recycle);
    }

    return result === ERR_INVALID_TARGET;
  }
}
