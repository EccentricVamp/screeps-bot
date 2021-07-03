import * as Act from "act/act";
import * as Creep from "creep";
import * as Filter from "filter";
import * as Task from "task/task";
import { first, pull, sortBy } from "lodash";

declare global {
  interface CreepMemory {
    status: number | null | undefined;
  }

  interface Memory {
    claims: Id<StructureController>[];
  }
}

function maintain(room: Room): void {
  const spawns = room.find(FIND_MY_SPAWNS);
  const creeps = room.find(FIND_MY_CREEPS);
  const structures = room.find(FIND_STRUCTURES);
  const resources = room.find(FIND_DROPPED_RESOURCES);
  const controller = room.controller;

  if (spawns.length > 0) {
    const spawn = spawns[0];
    const recycle = Task.Factory.Recycle(spawn);
    const renew = Task.Factory.Renew(spawn);
    for (const creep of creeps) {
      const status = creep.memory.status;

      if (status === Task.RECYCLE) {
        recycle.perform(creep);
        pull(creeps, creep);
        continue;
      }

      // Ignore creeps with CLAIM parts
      if (creep.body.some(part => part.type === CLAIM)) continue;
      // Ignore spawning creeps
      if (creep.ticksToLive === undefined) continue;

      if (creep.ticksToLive < Task.THRESHOLD || status === Task.RENEW) {
        renew.perform(creep);
        if (creep.memory.status !== null) pull(creeps, creep);
      }
    }
  }

  const tasks = new Array<Task.Task>();

  if (controller !== undefined && !controller.my) {
    tasks.push(Task.Factory.Claim(controller));
  }

  const energyNeeds = structures.filter(Filter.needsEnergy);
  const energyStores = structures.filter(Filter.hasEnergy);
  const energyResources = resources.filter(Filter.isEnergy);
  const energySources = room.find(FIND_SOURCES_ACTIVE);
  if (energyNeeds.length > 0) {
    const need = energyNeeds[0];
    const collect = findEnergy(energyResources, energyStores, energySources);

    if (collect !== null) {
      tasks.push(Task.Factory.Transfer(need, collect));
    }
  }

  const energyCapacity = structures.filter(Filter.hasCapacity);
  if (energyCapacity.length > 0) {
    const capacity = energyCapacity[0];
    const source = first(sortBy(energySources, s => s.pos.getRangeTo(capacity)));
    if (source !== undefined) {
      pull(energySources, source);
      tasks.push(Task.Factory.Harvest(source, capacity));
    }
  }

  const sites = room.find(FIND_CONSTRUCTION_SITES);
  if (sites.length > 0) {
    const site = sites[0];
    const collect = findEnergy(energyResources, energyStores, energySources);

    if (collect !== null) {
      tasks.push(Task.Factory.Build(site, collect));
    }
  }

  for (const task of tasks) {
    if (creeps.length === 0) break;

    const creep = evaluate(creeps, task);
    if (creep === undefined) continue;

    pull(creeps, creep);
    task.perform(creep);
  }

  const idle = Task.Factory.Idle(Game.flags.Idle);
  for (const creep of creeps) {
    idle.perform(creep);
  }
}

/** Get the best creep for a given task. */
function evaluate(creeps: Creep[], task: Task.Task): Creep | undefined {
  const parts = task.parts;
  const evaluations = creeps
    .map(creep => new Creep.Evaluation(creep, parts))
    .filter(evaluation => evaluation.eligible)
    .sort((a, b) => a.score - b.score);
  return evaluations[evaluations.length - 1].creep;
}

function findEnergy(
  resources: Resource<RESOURCE_ENERGY>[],
  stores: (StructureContainer | StructureStorage)[],
  sources: Source[]
): Act.Collect | null {
  if (resources.length > 0) {
    const resource = resources.pop() as Resource;
    return new Act.Pickup(resource);
  } else if (stores.length > 0) {
    const store = stores.pop() as Act.Withdrawable;
    return new Act.Withdraw(store);
  } else if (sources.length > 0) {
    const source = sources.pop() as Act.Harvestable;
    return new Act.Harvest(source);
  } else return null;
}

export const loop = (): void => {
  for (const room of Object.values(Game.rooms)) {
    maintain(room);
  }

  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }
};
