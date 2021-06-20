import { getParts } from "Creep";
import _ from "lodash";

export class Evaluation {
  public eligible: boolean = true;
  public score: number = 0;

  constructor(creep: Creep, parts: BodyPartConstant[]) {
    const partCounts = _.countBy(getParts(creep));
    for (const part in parts) {
      const count = partCounts[part];
      this.eligible &&= count !== 0;
      this.score += count;
    }
  }
}
