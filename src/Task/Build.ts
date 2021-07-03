import { Act, getParts } from "Act/Act";
import { getStatus, moveTo, setStatus } from "Creep";
import { Build as ActBuild } from "Act/Build";
import { Harvest as ActHarvest } from "Act/Harvest";
import { Pickup as ActPickup } from "Act/Pickup";
import { Withdraw as ActWithdraw } from "Act/Withdraw";
import { Task } from "./Task";

export const BUILD = 0;
export const ENERGIZE = 1;

export class Build implements Task {
  public acts: Act[];
  public parts: BodyPartConstant[];

  public constructor(build: ActBuild, energize: ActHarvest | ActPickup | ActWithdraw) {
    this.acts = [build, energize];
    this.parts = getParts(this.acts);
  }

  public perform(creep: Creep): void {
    const status = getStatus(creep, [BUILD, ENERGIZE]);
    const act = this.acts[status];

    switch (act.execute(creep)) {
      case ERR_NOT_IN_RANGE:
        moveTo(creep, act.target);
        break;
      case ERR_NOT_ENOUGH_ENERGY:
        setStatus(creep, ENERGIZE);
        break;
      case ERR_FULL:
        setStatus(creep, BUILD);
        break;
      default:
        break;
    }
  }
}
