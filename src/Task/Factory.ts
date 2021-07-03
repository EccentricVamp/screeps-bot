import { Harvest as ActHarvest, Harvestable } from "Act/Harvest";
import { Transfer as ActTransfer, Transferable } from "Act/Transfer";
import { Build as ActBuild } from "Act/Build";
import { Claim as ActClaim } from "Act/Claim";
import { Pickup as ActPickup } from "Act/Pickup";
import { Recycle as ActRecycle } from "Act/Recycle";
import { Renew as ActRenew } from "Act/Renew";
import { Withdraw as ActWithdraw } from "Act/Withdraw";
import { Build } from "./Build";
import { Claim } from "./Claim";
import { Harvest } from "./Harvest";
import { Idle } from "./Idle";
import { Recycle } from "./Recycle";
import { Renew } from "./Renew";
import { Transfer } from "./Transfer";

export type ActCollect = ActHarvest | ActPickup | ActWithdraw;

export class Factory {
  public static Build(site: ConstructionSite, collect: ActCollect): Build {
    return new Build(new ActBuild(site), collect);
  }

  public static Claim(controller: StructureController): Claim {
    return new Claim(new ActClaim(controller));
  }

  public static Harvest(target: Harvestable, store: Transferable): Harvest {
    return new Harvest(new ActHarvest(target), new ActTransfer(store));
  }

  public static Idle(target: { pos: RoomPosition }): Idle {
    return new Idle(target.pos);
  }

  public static Recycle(spawn: StructureSpawn): Recycle {
    return new Recycle(new ActRecycle(spawn));
  }

  public static Renew(spawn: StructureSpawn): Renew {
    return new Renew(new ActRenew(spawn));
  }

  public static Transfer(target: Transferable, collect: ActCollect): Transfer {
    return new Transfer(new ActTransfer(target), collect);
  }
}
