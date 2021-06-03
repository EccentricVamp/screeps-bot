import Builder from "Builder";
import Harvester from "Harvester";
import Renewer from "Renewer";
import Roomer from "Roomer";
import Upgrader from "Upgrader";

declare global {

  const enum Role {
    Unassigned = "unassigned",
    Harvester = "harvester",
    Upgrader = "upgrader",
    Builder = "builder"
  }

  interface CreepMemory {
    role: Role;
    working: boolean;
    renewing: boolean;
  }
}

export const loop = (): void => {
  const RENEW_THRESHOLD = 200;
  const spawnRoom = Game.spawns.Spawn1.room;
  const home = new Roomer(spawnRoom);

  for (const name in Game.creeps) {
    const creep = Game.creeps[name];

    if (creep.spawning) {
      if (creep.memory.role === undefined) creep.memory.role = Role.Unassigned;
      if (creep.memory.working === undefined) creep.memory.working = false;
      if (creep.memory.renewing === undefined) creep.memory.renewing = false;
      continue;
    }

    if (creep.ticksToLive !== undefined && creep.ticksToLive < RENEW_THRESHOLD) {
      creep.say("⟳ renew");
      creep.memory.renewing = true;
    }

    if (creep.memory.renewing) Renewer.run(creep);
    else {
      switch (creep.memory.role) {
        case Role.Harvester:
          Harvester.run(creep);
          break;
        case Role.Upgrader:
          Upgrader.run(creep);
          break;
        case Role.Builder:
          Builder.run(creep, home);
          break;
      }
    }
  }

  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }
};
