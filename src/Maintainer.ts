import { hasCapacity, hasEnergy, isEnergy, needsEnergy, needsRepair } from "Filters";
import { Build } from "Task/Build";
import { Claim } from "Task/Claim";
import { Collect } from "Task/Collect";
import { Harvest } from "Task/Harvest";
import { Idle } from "Task/Idle";
import { Recycle } from "Task/Recycle";
import { Renew } from "Task/Renew";
import { Repair } from "Task/Repair";
import { Task } from "Task/Task";
import { Transport } from "Task/Transport";
import { Upgrade } from "Task/Upgrade";
import _ from "lodash";

export class Maintainer {
  public static maintain(room: Room): void {
    const spawns = room.find(FIND_MY_SPAWNS);
    const creeps = room.find(FIND_MY_CREEPS);
    const structures = room.find(FIND_STRUCTURES);
    const resources = room.find(FIND_DROPPED_RESOURCES);
    const controller = room.controller;

    if (spawns.length > 0) {
      const spawn = spawns[0];
      Maintainer.recycle(creeps, spawn);
      Maintainer.renew(creeps, spawn);
    }

    const tasks = new Array<Task>();

    if (controller !== undefined && !controller.my) {
      const claim = new Claim(controller);
      tasks.push(claim);
    }

    const energyNeeds = structures.filter(needsEnergy);
    const energyStores = structures.filter(hasEnergy);
    const energyResources = resources.filter(isEnergy);
    if (energyNeeds.length > 0) {
      const need = energyNeeds[0];
      if (energyResources.length > 0) {
        const resource = energyResources.pop() ?? energyResources[0];
        const collect = new Collect(resource, need);
        tasks.push(collect);
      } else if (energyStores.length > 0) {
        const store = energyStores.pop() ?? energyStores[0];
        const transport = new Transport(RESOURCE_ENERGY, store, need);
        tasks.push(transport);
      }
    }

    const energyCapacity = structures.filter(hasCapacity);
    if (energyCapacity.length > 0) {
      const capacity = energyCapacity[0];
      const source = capacity.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
      if (source !== null) {
        const harvest = new Harvest(RESOURCE_ENERGY, source, capacity);
        tasks.push(harvest);
      }
    }

    if (energyStores.length > 0) {
      const store = energyStores.pop() ?? energyStores[0];

      if (controller !== undefined) {
        const upgrade = new Upgrade(store, controller);
        tasks.push(upgrade);
      }

      const sites = room.find(FIND_CONSTRUCTION_SITES);
      if (sites.length > 0) {
        const site = sites.pop() ?? sites[0];
        const build = new Build(store, site);
        tasks.push(build);
      }

      const repairs = structures.filter(needsRepair);
      if (repairs.length > 0) {
        const repair = repairs.pop() ?? repairs[0];
        const repairTask = new Repair(store, repair);
        tasks.push(repairTask);
      }
    }

    for (const task of tasks) {
      if (creeps.length === 0) break;

      const creep = Maintainer.evaluate(creeps, task);
      if (creep === undefined) continue;

      _.pull(creeps, creep);
      task.perform(creep);
    }

    Maintainer.idle(creeps);
  }

  /** Get the best creep for a given task. */
  private static evaluate(creeps: Creep[], task: Task): Creep | undefined {
    const eligibles = creeps.filter(creep => task.eligible(creep));
    const interviews = eligibles.sort((a, b) => task.interview(a) - task.interview(b));
    return interviews[interviews.length - 1];
  }

  /** Perform an idle task for each creep. */
  private static idle(creeps: Creep[]) {
    const idle = new Idle();
    for (const creep of creeps) {
      idle.perform(creep);
    }
  }

  private static push(count: number, task: Task, tasks: Task[]) {
    for (let i = 0; i < count; i++) {
      tasks.push(task);
    }
  }

  /** Recyle creeps who have been flagged for recycling. */
  private static recycle(creeps: Creep[], spawn: StructureSpawn) {
    const recycle = new Recycle(spawn);
    for (const creep of creeps) {
      if (creep.memory.status === Recycle.STATUS) {
        recycle.perform(creep);
        _.pull(creeps, creep);
      }
    }
  }

  /** Renew creeps who need renewal. */
  private static renew(creeps: Creep[], spawn: StructureSpawn) {
    const renew = new Renew(spawn);
    for (const creep of creeps) {
      // Ignore creeps with CLAIM parts
      if (creep.body.some(part => part.type === CLAIM)) continue;
      // Ignore spawning creeps
      if (creep.ticksToLive === undefined) continue;

      if (creep.ticksToLive < Renew.THRESHOLD || creep.memory.status === Renew.STATUS) {
        const complete = renew.perform(creep);
        if (complete) creep.memory.status = null;
        else _.pull(creeps, creep);
      }
    }
  }
}