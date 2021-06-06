import { Build } from "Tasks/Build";
import { Idle } from "Tasks/Idle";
import { Harvest } from "Tasks/Harvest";
import { Recycle } from "Tasks/Recycle";
import { Renew } from "Tasks/Renew";
import { Repair } from "Tasks/Repair";
import { Task } from "Tasks/Task";
import { Transport } from "Tasks/Transport";
import { Upgrade } from "Tasks/Upgrade";
import { hasCapacity, hasEnergy, needsEnergy, needsRepair } from "Filters";
import _ from "lodash";

declare global {
  interface CreepMemory {
    status: number | null;
  }
}

export const loop = (): void => {
  const tasks = new Array<Task>();
  const room = Object.values(Game.rooms)[0];
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

  const recycle = new Recycle(spawn);
  for (const creep of creeps) {
    if (creep.memory.status === Recycle.STATUS) {
      recycle.perform(creep);
      _.remove(creeps, creep);
    }
  }

  const renew = new Renew(spawn);
  for (const creep of creeps) {
    if (creep.ticksToLive === undefined) continue;
    if (creep.ticksToLive < Renew.THRESHOLD || creep.memory.status === Renew.STATUS) {
      const complete = renew.perform(creep);
      if (complete) creep.memory.status = null;
      else _.remove(creeps, creep);
    }
  }

  if (energyStores.length > 0 && energyNeeds.length > 0) {
    const need = energyNeeds[0];
    const store = energyStores[0];
    const transport = new Transport(RESOURCE_ENERGY, store, need);
    tasks.push(transport);
  }

  if (energyCapacity.length > 0) {
    const target = energyCapacity[0];
    const source = target.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
    if (source !== null) {
      const harvest = new Harvest(RESOURCE_ENERGY, source, target);
      tasks.push(harvest);
    }
  }

  if (energyStores.length > 0 && controller !== undefined) {
    const store = energyStores[0];
    const upgrade = new Upgrade(store, controller);
    tasks.push(upgrade);
    tasks.push(upgrade);
  }

  if (energyStores.length > 0 && sites.length > 0) {
    const site = sites[0];
    const store = energyStores[0];
    const build = new Build(store, site);
    tasks.push(build);
  }

  if (energyStores.length > 0 && repairs.length > 0) {
    const target = repairs[0];
    const store = energyStores[0];
    const repair = new Repair(store, target);
    tasks.push(repair);
  }

  for (const task of tasks) {
    let complete = false;

    const eligibleCreeps = creeps.filter(creep => task.eligible(creep));
    const sortedCreeps = eligibleCreeps.sort((a, b) => task.interview(a) - task.interview(b));
    const bestCreep = _.last(sortedCreeps);
    if (bestCreep === undefined) continue;

    _.pull(creeps, bestCreep);
    complete = task.perform(bestCreep);
    if (complete) {
      bestCreep.memory.status = null;
    }
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
};
