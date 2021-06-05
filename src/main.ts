import Harvest from "Tasks/Harvest";
import _ from "lodash";

declare global {
  interface CreepMemory {
    status: number;
  }
}

export const loop = (): void => {
  // Get first value from room dictionary.
  const room = Object.values(Game.rooms)[0];

  const spawn = room.find(FIND_MY_SPAWNS)[0];

  if (spawn.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
    const source = room.find(FIND_SOURCES_ACTIVE)[0];
    const creeps = room.find(FIND_MY_CREEPS, {
      filter: creep => {
        const parts = _.map(creep.body, part => part.type);
        return _.difference([WORK, CARRY, MOVE], parts).length === 0 && creep.memory.status === undefined;
      }
    });
    const storing = new Harvest(1, RESOURCE_ENERGY, source, spawn);

    for (const creep of creeps) {
      storing.perform(creep);
    }
  }

  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }
};
