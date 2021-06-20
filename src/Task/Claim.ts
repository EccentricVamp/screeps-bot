import * as Act from "Act/Act";
import { Task } from "./Task";
import { moveTo } from "Creep";

export const CLAIMING = 0;

export class Claim implements Task {
  public acts: Act.Act[];
  public parts: BodyPartConstant[];

  public constructor(claiming: Act.Claim) {
    this.acts = [claiming];
    this.parts = Act.getParts(this.acts);
  }

  public perform(creep: Creep): boolean {
    const act = this.acts[CLAIMING];

    switch (act.execute(creep)) {
      case ERR_NOT_IN_RANGE:
        moveTo(creep, act.target);
        break;
      case ERR_INVALID_TARGET:
        return true;
      default:
        break;
    }

    return false;
  }
}
