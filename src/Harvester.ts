import lodash from "lodash";

export default class Harvester {
  public static run(creep: Creep): void {
    if (creep.memory.working && creep.store.getFreeCapacity() === 0) {
      creep.memory.working = false;
      creep.say("🏦 store");
    }

    if (!creep.memory.working && creep.store[RESOURCE_ENERGY] === 0) {
      creep.memory.working = true;
      creep.say("⛏ harvest");
    }

    if (creep.memory.working) {
      const sources = creep.room.find(FIND_SOURCES);
      const source = sources[0];
      if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
        creep.moveTo(source, { visualizePathStyle: { stroke: "#ffaa00" } });
      }
    } else {
      const targets = creep.room.find(FIND_STRUCTURES, { filter: Harvester.hasEnergyCapacity });
      if (targets.length > 0) {
        const target = lodash.sortBy(targets, target => target.structureType)[0];
        if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
          creep.moveTo(target, { visualizePathStyle: { stroke: "#ffffff" } });
        }
      }
    }
  }

  private static hasEnergyCapacity(structure: AnyStructure): boolean {
    if (
      structure.structureType === STRUCTURE_EXTENSION ||
      structure.structureType === STRUCTURE_SPAWN ||
      structure.structureType === STRUCTURE_TOWER
    )
      return structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
    else if (structure.structureType === STRUCTURE_CONTAINER) return structure.store.getFreeCapacity() > 0;
    else return false;
  }
}
