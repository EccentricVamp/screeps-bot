import * as Act from "Act/Act"
import { getStatus, moveTo, setStatus } from "Creep";
import { Task } from "./Task";

export const BUILDING = 0;
export const ENERGIZING = 1;

export class Build implements Task {
  private site: ConstructionSite;

  public acts: Act.Act[];
  public parts: BodyPartConstant[];

  public constructor(building: Act.Build, energizing: Act.Harvest | Act.Pickup | Act.Withdraw) {
    this.site = building.target;
    this.acts = [building, energizing];
    this.parts = Act.getParts(this.acts);
  }

  public perform(creep: Creep): boolean {
    let status = getStatus(creep);
    if (status === null) status = setStatus(creep, BUILDING);
    const act = this.acts[status];

    switch (act.execute(creep)) {
      case ERR_NOT_IN_RANGE:
        moveTo(creep, act.target);
        break;
      case ERR_NOT_ENOUGH_ENERGY:
        setStatus(creep, ENERGIZING);
        break;
      case ERR_FULL:
        setStatus(creep, BUILDING);
        break;
      default:
        break;
    }

    return this.site.progress === this.site.progressTotal;
  }
}
