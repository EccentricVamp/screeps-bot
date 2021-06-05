import Build from "Tasks/Build";
import Harvest from "Tasks/Harvest";
import Renew from "Tasks/Renew";
import Task from "Tasks/Task";
//import Upgrade from "Tasks/Upgrade";
import _ from "lodash";

declare global {
  interface CreepMemory {
    status: number | null;
  }
}

export const loop = (): void => {
  const RENEWING = 99;
  const RENEW_THRESHOLD = 500;

  const tasks = new Array<Task>();
  const room = Object.values(Game.rooms)[0];
  const spawn = room.find(FIND_MY_SPAWNS)[0];
  const creeps = room.find(FIND_MY_CREEPS);
  const sites = room.find(FIND_CONSTRUCTION_SITES);

  const renew = new Renew(spawn);
  for(const creep of creeps) {
    if (creep.ticksToLive !== undefined && creep.ticksToLive < RENEW_THRESHOLD || creep.memory.status === RENEWING) {
      const complete = renew.perform(creep);
      if (complete) creep.memory.status = null;
      else _.remove(creeps, creep);
    }
  }

  if (spawn.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
    const source = spawn.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
    if (source !== null) {
      const harvest = new Harvest(RESOURCE_ENERGY, source, spawn);
      tasks.push(harvest);
    }
  }

  if (sites.length > 0) {
    const site = sites[0];
    const source = site.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
    if (source !== null) {
      const build = new Build(source, site);
      tasks.push(build);
    }
  }

  for(const task of tasks) {
    let complete = false;

    const creep = creeps.pop();
    if(creep === undefined) break;

    complete = task.perform(creep);
    if (complete) {
      creep.memory.status = null;
      creeps.push(creep);
    }
  }

  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }
};
