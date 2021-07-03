import { Harvest as ActHarvest, Harvestable } from "Act/Harvest";
import { Withdraw as ActWithdraw, Withdrawable } from "Act/Withdraw";
import { RENEW, THRESHOLD } from "Task/Renew";
import { hasCapacity, hasEnergy, isEnergy, needsEnergy } from "Filters";
import { Pickup as ActPickup } from "Act/Pickup";
import { Evaluation } from "Evaluation";
import { RECYCLE } from "Task/Recycle";
import { Task } from "Task/Task";
import { Factory as TaskFactory } from "Task/Factory";
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
      const recycle = TaskFactory.Recycle(spawn);
      const renew = TaskFactory.Renew(spawn);
      for (const creep of creeps) {
        const status = creep.memory.status;

        if (status === RECYCLE) {
          recycle.perform(creep);
          _.pull(creeps, creep);
          continue;
        }

        // Ignore creeps with CLAIM parts
        if (creep.body.some(part => part.type === CLAIM)) continue;
        // Ignore spawning creeps
        if (creep.ticksToLive === undefined) continue;

        if (creep.ticksToLive < THRESHOLD || status === RENEW) {
          renew.perform(creep);
          if (creep.memory.status !== null) _.pull(creeps, creep);
        }
      }
    }

    const tasks = new Array<Task>();

    if (controller !== undefined && !controller.my) {
      tasks.push(TaskFactory.Claim(controller));
    }

    const energyNeeds = structures.filter(needsEnergy);
    const energyStores = structures.filter(hasEnergy);
    const energyResources = resources.filter(isEnergy);
    const energySources = room.find(FIND_SOURCES_ACTIVE);
    if (energyNeeds.length > 0) {
      const need = energyNeeds[0];

      let collect;
      if (energyResources.length > 0) {
        const resource = energyResources.pop() as Resource;
        collect = new ActPickup(resource);
      } else if (energyStores.length > 0) {
        const store = energyStores.pop() as Withdrawable;
        collect = new ActWithdraw(store);
      } else if (energySources.length > 0) {
        const source = energySources.pop() as Harvestable;
        collect = new ActHarvest(source);
      }

      if (collect !== undefined) {
        tasks.push(TaskFactory.Transfer(need, collect));
      }
    }

    const energyCapacity = structures.filter(hasCapacity);
    if (energyCapacity.length > 0) {
      const capacity = energyCapacity[0];
      const source = _.first(_.sortBy(energySources, s => s.pos.getRangeTo(capacity)));
      if (source !== undefined) {
        _.pull(energySources, source);
        tasks.push(TaskFactory.Harvest(source, capacity));
      }
    }

    const sites = room.find(FIND_CONSTRUCTION_SITES);
    if (sites.length > 0) {
      const site = sites[0];

      let collect;
      if (energyResources.length > 0) {
        const resource = energyResources.pop() ?? energyResources[0];
        collect = new ActPickup(resource);
      } else if (energyStores.length > 0) {
        const store = energyStores.pop() ?? energyStores[0];
        collect = new ActWithdraw(store);
      } else if (energySources.length > 0) {
        const source = energySources.pop() ?? energySources[0];
        collect = new ActHarvest(source);
      }

      if (collect !== undefined) {
        tasks.push(TaskFactory.Build(site, collect));
      }
    }

    for (const task of tasks) {
      if (creeps.length === 0) break;

      const creep = Maintainer.evaluate(creeps, task);
      if (creep === undefined) continue;

      _.pull(creeps, creep);
      task.perform(creep);
    }

    const idle = TaskFactory.Idle(Game.flags.Idle);
    for (const creep of creeps) {
      idle.perform(creep);
    }
  }

  /** Get the best creep for a given task. */
  private static evaluate(creeps: Creep[], task: Task): Creep | undefined {
    const parts = task.parts;
    const evaluations = creeps
      .map(creep => new Evaluation(creep, parts))
      .filter(evaluation => evaluation.eligible)
      .sort((a, b) => a.score - b.score);
    return evaluations[evaluations.length - 1].creep;
  }
}
