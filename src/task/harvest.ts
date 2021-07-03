import * as Act from "act/act";
import { getStatus, moveTo, setStatus } from "creep";
import { Task } from "./task";

export class Harvest implements Task {
  public acts: Act.Act[];
  public parts = [WORK, WORK, WORK, CARRY, MOVE];

  public constructor(harvest: Act.Harvest, transfer: Act.Transfer) {
    this.acts = [harvest, transfer];
  }

  public perform(creep: Creep): void {
    const HARVEST = 0;
    const TRANSFER = 1;

    const status = getStatus(creep, [HARVEST, TRANSFER]);
    const act = this.acts[status];

    switch (act.execute(creep)) {
      case ERR_NOT_IN_RANGE:
        moveTo(creep, act.target);
        break;
      case ERR_NOT_ENOUGH_RESOURCES:
        setStatus(creep, HARVEST);
        break;
      case ERR_FULL:
        setStatus(creep, TRANSFER);
        break;
      default:
        break;
    }
  }
}
