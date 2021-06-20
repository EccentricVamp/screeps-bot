import * as Act from "Act/Act"
import { getStatus, moveTo, setStatus } from "Creep";
import { Task } from "./Task";

export const UPGRADING = 0;
export const ENERGIZING = 1;

export class Upgrade implements Task {
  public acts: Act.Act[];
  public parts: BodyPartConstant[];

  public constructor(upgrading: Act.Upgrade, energizing: Act.Harvest | Act.Pickup | Act.Withdraw) {
    this.acts = [upgrading, energizing];
    this.parts = Act.getParts(this.acts);
  }

  public perform(creep: Creep): boolean {
    const status = getStatus(creep, [UPGRADING, ENERGIZING]);
    const act = this.acts[status];

    switch (act.execute(creep)) {
      case ERR_NOT_IN_RANGE:
        moveTo(creep, act.target);
        break;
      case ERR_NOT_ENOUGH_ENERGY:
        setStatus(creep, ENERGIZING);
        break;
      case ERR_FULL:
        setStatus(creep, UPGRADING);
        break;
      default:
        break;
    }

    return false;
  }
}
