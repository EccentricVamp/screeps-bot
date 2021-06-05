import Task from "Tasks/Task";
export default class Upgrade implements Task {
  private source: StructureContainer | StructureStorage;
  private target: StructureController;

  public constructor(source: StructureContainer | StructureStorage, target: StructureController) {
    this.source = source;
    this.target = target;
  }

  public interview(creep: Creep): number | null {
    if (creep.getActiveBodyparts(CARRY) > 0) {
      return creep.getActiveBodyparts(CARRY) + creep.getActiveBodyparts(WORK) + creep.getActiveBodyparts(MOVE);
    } else return null;
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
      if (creep.upgradeController(this.target) === ERR_NOT_IN_RANGE) {
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
