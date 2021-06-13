import { Path } from "Constants";
import { Task } from "./Task";
export class Scout implements Task {
  private position: RoomPosition;

  public constructor(position: RoomPosition) {
    this.position = position;
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
    creep.moveTo(this.position, Path.Default);
    return false;
  }
}
