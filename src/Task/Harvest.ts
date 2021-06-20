import * as Act from "Act/Act";
import { getStatus, moveTo, setStatus } from "Creep";
import { Task } from "./Task";

export const HARVESTING = 0;
export const TRANSFERING = 1;

export class Harvest implements Task {
  public acts: Act.Act[];
  public parts = [WORK, WORK, WORK, CARRY, MOVE];

  public constructor(harvesting: Act.Harvest, transfering: Act.Transfer) {
    this.acts = [harvesting, transfering];
  }

  public perform(creep: Creep): boolean {
    const status = getStatus(creep, [HARVESTING, TRANSFERING]);
    const act = this.acts[status];

    switch (act.execute(creep)) {
      case ERR_NOT_IN_RANGE:
        moveTo(creep, act.target);
        break;
      case ERR_NOT_ENOUGH_RESOURCES:
        setStatus(creep, HARVESTING);
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
