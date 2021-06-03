export class Builder {
  public static run(creep: Creep): void {
    if (creep.memory.working && creep.store[RESOURCE_ENERGY] === 0) {
      creep.memory.working = false;
      creep.say("⛏ harvest");
    }

    if (!creep.memory.working && creep.store.getFreeCapacity() === 0) {
      creep.memory.working = true;
      creep.say("🚧 build");
    }

    if (creep.memory.working) {
      const sites = creep.room.find(FIND_CONSTRUCTION_SITES);
      const repairs = creep.room.find(FIND_STRUCTURES, { filter: Builder.needsRepair });
      if (sites.length > 0) {
        const site = sites[0];
        if (creep.build(site) === ERR_NOT_IN_RANGE) {
          creep.moveTo(site, { visualizePathStyle: { stroke: "#ffffff" } });
        }
      } else if (repairs.length > 0) {
        const repair = repairs[0];
        if (creep.repair(repair) === ERR_NOT_IN_RANGE) {
          creep.moveTo(repair, { visualizePathStyle: { stroke: "#ffffff" } });
        }
      }
    } else {
      const sources = creep.room.find(FIND_SOURCES);
      const source = sources[0];
      if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
        creep.moveTo(source, { visualizePathStyle: { stroke: "#ffaa00" } });
      }
    }
  }

  private static needsRepair(structure: AnyStructure): boolean {
    const REPAIR_THRESHOLD = 0.75;
    return structure.hits < structure.hitsMax * REPAIR_THRESHOLD;
  }
}
