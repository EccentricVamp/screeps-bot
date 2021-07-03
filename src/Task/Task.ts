import * as Act from "Act/Act";
import { Build } from "./Build";
import { Claim } from "./Claim";
import { Harvest } from "./Harvest";
import { Idle } from "./Idle";
import { Recycle } from "./Recycle";
import { Renew } from "./Renew";
import { Transfer } from "./Transfer";

export interface Task {
  acts: Act.Act[];
  parts: BodyPartConstant[];
  perform(creep: Creep): void;
}

export class Factory {
  public static Build(site: ConstructionSite, collect: Act.Collect): Build {
    return new Build(new Act.Build(site), collect);
  }

  public static Claim(controller: StructureController): Claim {
    return new Claim(new Act.Claim(controller));
  }

  public static Harvest(target: Act.Harvestable, store: Act.Transferable): Harvest {
    return new Harvest(new Act.Harvest(target), new Act.Transfer(store));
  }

  public static Idle(target: { pos: RoomPosition }): Idle {
    return new Idle(target.pos);
  }

  public static Recycle(spawn: StructureSpawn): Recycle {
    return new Recycle(new Act.Recycle(spawn));
  }

  public static Renew(spawn: StructureSpawn): Renew {
    return new Renew(new Act.Renew(spawn));
  }

  public static Transfer(target: Act.Transferable, collect: Act.Collect): Transfer {
    return new Transfer(new Act.Transfer(target), collect);
  }
}

export { Build } from "./Build";
export { Claim } from "./Claim";
export { Harvest } from "./Harvest";
export { Idle } from "./Idle";
export { RECYCLE, Recycle } from "./Recycle";
export { RENEW, Renew, THRESHOLD } from "./Renew";
export { Repair } from "./Repair";
export { Transfer } from "./Transfer";
export { Upgrade } from "./Upgrade";
