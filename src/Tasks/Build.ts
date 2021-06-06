import Task from "Tasks/Task";
export default class Build implements Task {
  private source: StructureContainer | StructureStorage;
  private target: ConstructionSite;

  public constructor(source: StructureContainer | StructureStorage, target: ConstructionSite) {
    this.source = source;
    this.target = target;
  }

  public interview(creep: Creep): number | null {
    const work = creep.getActiveBodyparts(WORK);
    if (work === 0) return null;

    const carry = creep.getActiveBodyparts(CARRY);
    if (carry === 0) return null;

    const move = creep.getActiveBodyparts(MOVE);
    if (move === 0) return null;

    return work + carry + move;
  }

  public perform(creep: Creep): boolean {
    const BUILDING = 1;
    const WITHDRAW = 2;

    if (creep.memory.status === null || (creep.memory.status !== BUILDING && creep.store.getFreeCapacity() === 0)) {
      creep.memory.status = BUILDING;
      creep.say("🏗️ build");
    }

    if (creep.memory.status !== WITHDRAW && creep.store[RESOURCE_ENERGY] === 0) {
      creep.memory.status = WITHDRAW;
      creep.say("⇩ withdraw");
    }

    if (creep.memory.status === BUILDING) {
      if (creep.pos.inRangeTo(this.target.pos, 3)) {
        creep.build(this.target);
      } else {
        creep.moveTo(this.target, { visualizePathStyle: { stroke: "#ffffff" } });
      }
    } else if (creep.memory.status === WITHDRAW) {
      if (creep.withdraw(this.source, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        creep.moveTo(this.source, { visualizePathStyle: { stroke: "#ffaa00" } });
      }
    }

    return this.target.progress === this.target.progressTotal;
  }
}
