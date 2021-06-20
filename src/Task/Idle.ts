import { Task } from "./Task";

export class Idle implements Task {
  public acts = [];
  public parts = [MOVE];
  public target: RoomPosition;

  public constructor(target: RoomPosition) {
    this.target = target;
  }

  public perform(creep: Creep): boolean {
    return creep.moveTo(this.target) === ERR_NO_PATH;
  }
}
