import Task from "Tasks/Task";
export default class Build extends Task {
  private source: Source;
  private target: ConstructionSite;

  public constructor(priority: number, source: Source, target: ConstructionSite) {
    super(priority);
    this.source = source;
    this.target = target;
  }

  public perform(creep: Creep): boolean {
    const HARVESTING = 2;
    const BUILDING = 1;

    if (creep.memory.status !== BUILDING && creep.store.getFreeCapacity() === 0) {
      creep.memory.status = BUILDING;
      creep.say("🏗️ build");
    }

    if (creep.memory.status !== HARVESTING && creep.store[RESOURCE_ENERGY] === 0) {
      creep.memory.status = HARVESTING;
      creep.say("⛏ harvest");
    }

    if (creep.memory.status === BUILDING) {
      if (creep.build(this.target) === ERR_NOT_IN_RANGE) {
        creep.moveTo(this.target, { visualizePathStyle: { stroke: "#ffffff" } });
      }
    } else if (creep.memory.status === HARVESTING) {
      if (creep.harvest(this.source) === ERR_NOT_IN_RANGE) {
        creep.moveTo(this.source, { visualizePathStyle: { stroke: "#ffaa00" } });
      }
    }

    return this.target.progress === this.target.progressTotal;
  }
}
