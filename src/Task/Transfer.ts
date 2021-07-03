import { Act, getParts } from "Act/Act";
import { getStatus, moveTo, setStatus } from "Creep";
import { Harvest as ActHarvest } from "Act/Harvest";
import { Pickup as ActPickup } from "Act/Pickup";
import { Transfer as ActTransfer } from "Act/Transfer";
import { Withdraw as ActWithdraw } from "Act/Withdraw";
import { Task } from "./Task";

export const TRANSFER = 0;
export const COLLECT = 1;

export class Transfer implements Task {
  public acts: Act[];
  public parts: BodyPartConstant[];

  public constructor(transfer: ActTransfer, collect: ActHarvest | ActPickup | ActWithdraw) {
    this.acts = [transfer, collect];
    this.parts = getParts(this.acts);
  }

  public perform(creep: Creep): void {
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
