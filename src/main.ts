import { hasCapacity, hasEnergy, needsEnergy, needsRepair } from "Filters";
import { Build } from "Tasks/Build";
import { Claim } from "Tasks/Claim";
import { Harvest } from "Tasks/Harvest";
import { Idle } from "Tasks/Idle";
import { Pioneer } from "Tasks/Pioneer";
import { Recycle } from "Tasks/Recycle";
import { Renew } from "Tasks/Renew";
import { Repair } from "Tasks/Repair";
import { Scout } from "Tasks/Scout";
import { Task } from "Tasks/Task";
import { Transport } from "Tasks/Transport";
import { Upgrade } from "Tasks/Upgrade";
import _ from "lodash";

declare global {
  interface CreepMemory {
    status: number | null;
  }

  interface Memory {
    claims: Id<StructureController>[];
  }
}

export const loop = (): void => {
  const pilgrim_1 = Game.creeps.pilgrim_1;

  for (const room of Object.values(Game.rooms)) {
    const tasks = new Array<Task>();
    const spawns = room.find(FIND_MY_SPAWNS);
    const spawn = spawns[0];
    const creeps = room.find(FIND_MY_CREEPS);
    const controller = room.controller;
    const structures = room.find(FIND_STRUCTURES);

    const energyNeeds = structures.filter(needsEnergy);
    const energyStores = structures.filter(hasEnergy);
    const energyCapacity = structures.filter(hasCapacity);
    const sites = room.find(FIND_CONSTRUCTION_SITES);
    const repairs = structures.filter(needsRepair);

    if (pilgrim_1 !== undefined) {
      var needsRenew = pilgrim_1.memory.status === Renew.STATUS || (pilgrim_1.ticksToLive !== undefined && pilgrim_1.ticksToLive < Renew.THRESHOLD);
      var hasSpawn = spawn !== undefined;
      var inRoom = pilgrim_1.room == room;

      if (needsRenew) {
        if (hasSpawn && !inRoom) creeps.push(pilgrim_1);
        if (!hasSpawn && inRoom) _.pull(creeps, pilgrim_1);
      } else {
        if (!hasSpawn && !inRoom) creeps.push(pilgrim_1);
        if (hasSpawn && inRoom) _.pull(creeps, pilgrim_1);
      }
    }

    const recycle = new Recycle(spawn);
    for (const creep of creeps) {
      if (creep.memory.status === Recycle.STATUS) {
        recycle.perform(creep);
        _.pull(creeps, creep);
      }
    }

    const renew = new Renew(spawn);
    for (const creep of creeps) {
      if (creep.ticksToLive === undefined) continue;
      if (creep.ticksToLive < Renew.THRESHOLD || creep.memory.status === Renew.STATUS) {
        const complete = renew.perform(creep);
        if (complete) creep.memory.status = null;
        else _.pull(creeps, creep);
      }
    }

    const store = energyStores[0];
    const need = energyNeeds.pop();
    if (store !== undefined && need !== undefined) {
      const transport = new Transport(RESOURCE_ENERGY, store, need);
      tasks.push(transport);
    }

    const capacity = energyCapacity.pop();
    if (capacity !== undefined) {
      const source = capacity.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
      if (source !== null) {
        const harvest = new Harvest(RESOURCE_ENERGY, source, capacity);
        tasks.push(harvest);
      }
    }

    if (store !== undefined && controller !== undefined) {
      const upgrade = new Upgrade(store, controller);
      tasks.push(upgrade);
    }

    const site = sites.pop();
    if (store !== undefined && site !== undefined) {
      const build = new Build(store, site);
      tasks.push(build);
    } else if (site !== undefined) {
      const source = site.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
      if (source !== null) {
        const pioneer = new Pioneer(source, site)
        tasks.push(pioneer);
      }
    }

    const repair = repairs.pop();
    if (store !== undefined && repair != undefined) {
      const repairTask = new Repair(store, repair);
      tasks.push(repairTask);
    }

    for (const task of tasks) {
      let complete = false;

      const eligibleCreeps = creeps.filter(creep => task.eligible(creep));
      const sortedCreeps = eligibleCreeps.sort((a, b) => task.interview(a) - task.interview(b));
      const bestCreep = sortedCreeps[sortedCreeps.length - 1];
      if (bestCreep === undefined) continue;

      _.pull(creeps, bestCreep);
      complete = task.perform(bestCreep);
      if (complete) bestCreep.memory.status = null;
    }

    const idle = new Idle();
    for (const creep of creeps) {
      idle.perform(creep);
    }

    for (const name in Memory.creeps) {
      if (!(name in Game.creeps)) {
        delete Memory.creeps[name];
      }
    }
  }
};
