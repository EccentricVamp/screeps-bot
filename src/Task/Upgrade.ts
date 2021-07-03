import * as Act from "Act/Act";
import { getStatus, moveTo, setStatus } from "Creep";
import { Task } from "./Task";

export const UPGRADE = 0;
export const ENERGIZE = 1;

export class Upgrade implements Task {
  public acts: Act.Act[];
  public parts: BodyPartConstant[];

  public constructor(upgrade: Act.Upgrade, energize: Act.Collect) {
    this.acts = [upgrade, energize];
    this.parts = Act.getParts(this.acts);
  }

  public perform(creep: Creep): boolean {
    const status = getStatus(creep, [UPGRADE, ENERGIZE]);
    const act = this.acts[status];

    switch (act.execute(creep)) {
      case ERR_NOT_IN_RANGE:
        moveTo(creep, act.target);
        break;
      case ERR_NOT_ENOUGH_ENERGY:
        setStatus(creep, ENERGIZE);
        break;
      case ERR_FULL:
        setStatus(creep, UPGRADE);
        break;
      default:
        break;
    }

    return false;
  }
}
