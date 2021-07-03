import * as Act from "act/act";
import { moveTo, setStatus } from "creep";
import { Task } from "./task";

export const RENEW = 99;
export const THRESHOLD = 500;

export class Renew implements Task {
  public acts: Act.Act[];
  public parts = [];

  public constructor(renew: Act.Renew) {
    this.acts = [renew];
  }

  public perform(creep: Creep): void {
    setStatus(creep, RENEW);
    const act = this.acts[0];

    switch (act.execute(creep)) {
      case ERR_NOT_IN_RANGE:
        moveTo(creep, act.target);
        break;
      case ERR_FULL:
        setStatus(creep, null);
        break;
      default:
        break;
    }
  }
}
