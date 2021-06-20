import * as Act from "Act/Act"
import { getStatus, moveTo, setStatus } from "Creep";
import { Task } from "./Task";

export const RECYCLING = 98;

export class Recycle implements Task {
  public acts: Act.Act[];
  public parts = [];

  public constructor(recycling: Act.Recycle) {
    this.acts = [recycling];
  }

  public perform(creep: Creep): boolean {
    setStatus(creep, RECYCLING);
    const act = this.acts[0];

    switch (act.execute(creep)) {
      case ERR_NOT_IN_RANGE:
        moveTo(creep, act.target);
        break;
      case ERR_INVALID_TARGET:
        return true;
      default:
        break;
    }

    return false;
  }
}
