import _ from "lodash";
import { getParts } from "Creep";

export class Evaluation {
  public creep: Creep;
  public eligible = true;
  public score = 0;

  public constructor(creep: Creep, parts: BodyPartConstant[]) {
    this.creep = creep;

    const partCounts = _.countBy(getParts(creep));
    for (const part of parts) {
      const count = partCounts[part];
      if (count === 0) {
        this.eligible = false;
        break;
      }
      this.score += count;
    }
  }
}
