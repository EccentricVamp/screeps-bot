import * as Act from "act/act";
import { Build } from "./build";
import { Claim } from "./claim";
import { Harvest } from "./harvest";
import { Idle } from "./idle";
import { Recycle } from "./recycle";
import { Renew } from "./renew";
import { Transfer } from "./transfer";

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

export { Build } from "./build";
export { Claim } from "./claim";
export { Harvest } from "./harvest";
export { Idle } from "./idle";
export { RECYCLE, Recycle } from "./recycle";
export { RENEW, Renew, THRESHOLD } from "./renew";
export { Repair } from "./repair";
export { Transfer } from "./transfer";
export { Upgrade } from "./upgrade";
