import * as Act from "Act/Act";
import { getStatus, moveTo, setStatus } from "Creep";
import { Task } from "./Task";

export const TRANSFERING = 0;
export const COLLECTING = 1;

export class Transfer implements Task {
  public acts: Act.Act[];
  public parts: BodyPartConstant[];

  public constructor(
    transfering: Act.Transfer,
    collecting: Act.Harvest | Act.Pickup | Act.Withdraw
  ) {
    this.acts = [transfering, collecting];
    this.parts = Act.getParts(this.acts);
  }

  public perform(creep: Creep): boolean {
    const status = getStatus(creep, [TRANSFERING, COLLECTING]);
    const act = this.acts[status];

    switch (act.execute(creep)) {
      case ERR_NOT_IN_RANGE:
        moveTo(creep, act.target);
        break;
      case ERR_NOT_ENOUGH_RESOURCES:
        setStatus(creep, COLLECTING);
        break;
      case ERR_FULL:
        if (status === TRANSFERING) return true;
        else setStatus(creep, TRANSFERING);
        break;
      default:
        break;
    }

    return false;
  }
}
