import { Act, getParts } from "Act/Act";
import { Claim as ActClaim } from "Act/Claim";
import { Task } from "./Task";
import { moveTo } from "Creep";

export const CLAIM = 0;

export class Claim implements Task {
  public acts: Act[];
  public parts: BodyPartConstant[];

  public constructor(claim: ActClaim) {
    this.acts = [claim];
    this.parts = getParts(this.acts);
  }

  public perform(creep: Creep): void {
    const act = this.acts[CLAIM];

    switch (act.execute(creep)) {
      case ERR_NOT_IN_RANGE:
        moveTo(creep, act.target);
        break;
      default:
        break;
    }
  }
}
