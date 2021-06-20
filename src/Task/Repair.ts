import * as Act from "Act/Act"
import { getStatus, moveTo, setStatus } from "Creep";
import { Task } from "./Task";

export const REPAIRING = 0;
export const ENERGIZING = 1;

export class Repair implements Task {
  private structure: Structure;

  public acts: Act.Act[];
  public parts: BodyPartConstant[];

  public constructor(repairing: Act.Repair, energizing: Act.Harvest | Act.Pickup | Act.Withdraw) {
    this.structure = repairing.target;
    this.acts = [repairing, energizing];
    this.parts = Act.getParts(this.acts);
  }

  public perform(creep: Creep): boolean {
    let status = getStatus(creep);
    if (status === null) status = setStatus(creep, REPAIRING);
    const act = this.acts[status];

    switch (act.execute(creep)) {
      case ERR_NOT_IN_RANGE:
        moveTo(creep, act.target);
        break;
      case ERR_NOT_ENOUGH_ENERGY:
        setStatus(creep, ENERGIZING);
        break;
      case ERR_FULL:
        setStatus(creep, REPAIRING);
        break;
      default:
        break;
    }

    return this.structure.hits === this.structure.hitsMax;
  }
}
