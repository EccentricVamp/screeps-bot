import { Path } from "Constants";
import Task from "Tasks/Task";
export default class Idle implements Task {
  public interview(): number | null {
    return 1;
  }
  public perform(creep: Creep): boolean {
    creep.moveTo(Game.flags.Idle, Path.Idle);
    return true;
  }
}
