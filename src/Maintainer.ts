import * as Act from "Act/Act";
import { RECYCLING, Recycle } from "Task/Recycle";
import { RENEWING, Renew, THRESHOLD } from "Task/Renew";
import { hasCapacity, hasEnergy, isEnergy, needsEnergy } from "Filters";
import { Build } from "Task/Build";
import { Claim } from "Task/Claim";
import { Evaluation } from "Evaluation";
import { Harvest } from "Task/Harvest";
import { Idle } from "Task/Idle";
import { Task } from "Task/Task";
import { Transfer } from "Task/Transfer";
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
      const recycle = new Recycle(new Act.Recycle(spawn));
      const renew = new Renew(new Act.Renew(spawn));
      for (const creep of creeps) {
        const status = creep.memory.status;

        if (status === RECYCLING) {
          recycle.perform(creep);
          _.pull(creeps, creep);
          continue;
        }

        // Ignore creeps with CLAIM parts
        if (creep.body.some(part => part.type === CLAIM)) continue;
        // Ignore spawning creeps
        if (creep.ticksToLive === undefined) continue;

        if (creep.ticksToLive < THRESHOLD || status === RENEWING) {
          if (renew.perform(creep)) creep.memory.status = null;
          else _.pull(creeps, creep);
        }
      }
    }

    const tasks = new Array<Task>();

    if (controller !== undefined && !controller.my) {
      const act = new Act.Claim(controller);
      tasks.push(new Claim(act));
    }

    const energyNeeds = structures.filter(needsEnergy);
    const energyStores = structures.filter(hasEnergy);
    const energyResources = resources.filter(isEnergy);
    const energySources = room.find(FIND_SOURCES_ACTIVE);
    if (energyNeeds.length > 0) {
      const need = energyNeeds[0];

      let collect;
      if (energyResources.length > 0) {
        const resource = energyResources.pop() ?? energyResources[0];
        collect = new Act.Pickup(resource);
      } else if (energyStores.length > 0) {
        const store = energyStores.pop() ?? energyStores[0];
        collect = new Act.Withdraw(store);
      } else if (energySources.length > 0) {
        const source = energySources.pop() ?? energySources[0];
        collect = new Act.Harvest(source);
      }

      if (collect !== undefined) {
        const transfer = new Act.Transfer(need);
        tasks.push(new Transfer(transfer, collect));
      }
    }

    const energyCapacity = structures.filter(hasCapacity);
    if (energyCapacity.length > 0) {
      const capacity = energyCapacity[0];
      const source = _.first(_.sortBy(energySources, s => s.pos.getRangeTo(capacity)));
      if (source !== undefined) {
        _.pull(energySources, source);
        const harvest = new Act.Harvest(source);
        const transfer = new Act.Transfer(capacity);
        tasks.push(new Harvest(harvest, transfer));
      }
    }

    const sites = room.find(FIND_CONSTRUCTION_SITES);
    if (sites.length > 0) {
      const site = sites[0];

      let collect;
      if (energyResources.length > 0) {
        const resource = energyResources.pop() ?? energyResources[0];
        collect = new Act.Pickup(resource);
      } else if (energyStores.length > 0) {
        const store = energyStores.pop() ?? energyStores[0];
        collect = new Act.Withdraw(store);
      } else if (energySources.length > 0) {
        const source = energySources.pop() ?? energySources[0];
        collect = new Act.Harvest(source);
      }

      if (collect !== undefined) {
        const build = new Act.Build(site);
        tasks.push(new Build(build, collect));
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
    const parts = Act.getParts(task.acts);
    const evaluations = creeps
      .map(creep => new Evaluation(creep, parts))
      .filter(evaluation => evaluation.eligible)
      .sort((a, b) => a.score - b.score);
    return evaluations[evaluations.length - 1].creep;
  }

  /** Perform an idle task for each creep. */
  private static idle(creeps: Creep[]) {
    const idle = new Idle(Game.flags.Idle.pos);
    for (const creep of creeps) {
      idle.perform(creep);
    }
  }
}
