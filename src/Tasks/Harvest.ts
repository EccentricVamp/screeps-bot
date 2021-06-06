import Task from "Tasks/Task";
export default class Harvest implements Task {
  private resource: ResourceConstant;
  private source: Source | Mineral | Deposit;
  private target: StructureSpawn | StructureContainer | StructureStorage;

  public constructor(
    resource: ResourceConstant,
    source: Source | Mineral | Deposit,
    target: StructureSpawn | StructureContainer | StructureStorage
  ) {
    this.resource = resource;
    this.source = source;
    this.target = target;
  }

  public interview(creep: Creep): number | null {
    if (creep.getActiveBodyparts(CARRY) > 0) {
      return creep.getActiveBodyparts(WORK);
    } else return null;
  }

  public perform(creep: Creep): boolean {
    const HARVESTING = 2;
    const TRANSFERING = 1;

    if (creep.memory.status === null || (creep.memory.status !== TRANSFERING && creep.store.getFreeCapacity() === 0)) {
      creep.memory.status = TRANSFERING;
      creep.say("🚚 transfer");
    }

    if (creep.memory.status !== HARVESTING && creep.store[this.resource] === 0) {
      creep.memory.status = HARVESTING;
      creep.say("⚒️ harvest");
    }

    if (creep.memory.status === TRANSFERING) {
      if (creep.transfer(this.target, this.resource) === ERR_NOT_IN_RANGE) {
        creep.moveTo(this.target, { visualizePathStyle: { stroke: "#ffffff" } });
      }
    } else if (creep.memory.status === HARVESTING) {
      if (creep.harvest(this.source) === ERR_NOT_IN_RANGE) {
        creep.moveTo(this.source, { visualizePathStyle: { stroke: "#ffaa00" } });
      }
    }

    if (this.target.structureType === STRUCTURE_SPAWN) {
      return this.target.store.getFreeCapacity() === 0;
    } else {
      return this.target.store.getFreeCapacity() === 0;
    }
  }
}
