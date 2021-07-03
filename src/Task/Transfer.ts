import * as Act from "Act/Act";
import { getStatus, moveTo, setStatus } from "Creep";
import { Task } from "./Task";

export class Transfer implements Task {
  public acts: Act.Act[];
  public parts: BodyPartConstant[];

  public constructor(transfer: Act.Transfer, collect: Act.Collect) {
    this.acts = [transfer, collect];
    this.parts = Act.getParts(this.acts);
  }

  public perform(creep: Creep): void {
    const TRANSFER = 0;
    const COLLECT = 1;

    const status = getStatus(creep, [TRANSFER, COLLECT]);
    const act = this.acts[status];

    switch (act.execute(creep)) {
      case ERR_NOT_IN_RANGE:
        moveTo(creep, act.target);
        break;
      case ERR_NOT_ENOUGH_RESOURCES:
        setStatus(creep, COLLECT);
        break;
      case ERR_FULL:
        setStatus(creep, TRANSFER);
        break;
      default:
        break;
    }
  }
}
