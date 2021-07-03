import { getStatus, moveTo, setStatus } from "Creep";
import { Act } from "Act/Act";
import { Harvest as ActHarvest } from "Act/Harvest";
import { Transfer as ActTransfer } from "Act/Transfer";
import { Task } from "./Task";

export const HARVEST = 0;
export const TRANSFER = 1;

export class Harvest implements Task {
  public acts: Act[];
  public parts = [WORK, WORK, WORK, CARRY, MOVE];

  public constructor(harvest: ActHarvest, transfer: ActTransfer) {
    this.acts = [harvest, transfer];
  }

  public perform(creep: Creep): void {
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
