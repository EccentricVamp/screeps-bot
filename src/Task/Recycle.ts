import { moveTo, setStatus } from "Creep";
import { Act } from "Act/Act";
import { Recycle as ActRecycle } from "Act/Recycle";
import { Task } from "./Task";

export const RECYCLE = 98;

export class Recycle implements Task {
  public acts: Act[];
  public parts = [];

  public constructor(recycle: ActRecycle) {
    this.acts = [recycle];
  }

  public perform(creep: Creep): void {
    setStatus(creep, RECYCLE);
    const act = this.acts[0];

    switch (act.execute(creep)) {
      case ERR_NOT_IN_RANGE:
        moveTo(creep, act.target);
        break;
      default:
        break;
    }
  }
}
