import { Path } from "Constants";
import { Task } from "./Task";
export class Idle implements Task {
  public eligible(): boolean {
    return true;
  }
  public interview(): number {
    return 1;
  }
  public perform(creep: Creep): boolean {
    creep.moveTo(Game.flags.Idle, Path.Idle);
    return true;
  }
}
