import * as Act from "act/act";
import { Task } from "./task";
import { moveTo } from "creep";

export class Claim implements Task {
  public acts: Act.Act[];
  public parts: BodyPartConstant[];

  public constructor(claim: Act.Claim) {
    this.acts = [claim];
    this.parts = Act.getParts(this.acts);
  }

  public perform(creep: Creep): void {
    const CLAIM = 0;

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
