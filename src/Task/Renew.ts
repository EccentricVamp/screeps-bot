import * as Act from "Act/Act";
import { moveTo, setStatus } from "Creep";
import { Task } from "./Task";

export const RENEWING = 99;
export const THRESHOLD = 500;

export class Renew implements Task {
  public acts: Act.Act[];
  public parts = [];

  public constructor(renewing: Act.Renew) {
    this.acts = [renewing];
  }

  public perform(creep: Creep): boolean {
    setStatus(creep, RENEWING);
    const act = this.acts[0];

    switch (act.execute(creep)) {
      case ERR_NOT_IN_RANGE:
        moveTo(creep, act.target);
        break;
      case ERR_FULL:
        return true;
      default:
        break;
    }

    return false;
  }
}
