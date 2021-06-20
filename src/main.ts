/* eslint-disable @typescript-eslint/no-unused-vars */
import { Maintainer } from "Maintainer";

declare global {
  interface CreepMemory {
    status: number | null | undefined;
  }

  interface Memory {
    claims: Id<StructureController>[];
  }
}

export const loop = (): void => {
  for (const room of Object.values(Game.rooms)) {
    Maintainer.maintain(room);
  }

  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }
};
