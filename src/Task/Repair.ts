import * as Act from "Act/Act";
import { getStatus, moveTo, setStatus } from "Creep";
import { Task } from "./Task";

export class Repair implements Task {
  public acts: Act.Act[];
  public parts: BodyPartConstant[];

  public constructor(repair: Act.Repair, energize: Act.Collect) {
    this.acts = [repair, energize];
    this.parts = Act.getParts(this.acts);
  }

  public perform(creep: Creep): void {
    const REPAIR = 0;
    const ENERGIZE = 1;

    const status = getStatus(creep, [REPAIR, ENERGIZE]);
    const act = this.acts[status];

    switch (act.execute(creep)) {
      case ERR_NOT_IN_RANGE:
        moveTo(creep, act.target);
        break;
      case ERR_NOT_ENOUGH_ENERGY:
        setStatus(creep, ENERGIZE);
        break;
      case ERR_FULL:
        setStatus(creep, REPAIR);
        break;
      default:
        break;
    }
  }
}
