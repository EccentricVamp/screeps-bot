import { Task } from "./task";

export class Idle implements Task {
  public acts = [];
  public parts = [MOVE];
  public target: RoomPosition;

  public constructor(target: RoomPosition) {
    this.target = target;
  }

  public perform(creep: Creep): void {
    creep.moveTo(this.target);
  }
}
