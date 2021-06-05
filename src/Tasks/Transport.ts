import Task from "Tasks/Task";
export default class Transport implements Task {
  private resource: ResourceConstant;
  private source: StructureContainer | StructureStorage;
  private target: StructureSpawn | StructureContainer | StructureStorage;

  public constructor(
    resource: ResourceConstant,
    source: StructureContainer | StructureStorage,
    target: StructureSpawn | StructureContainer | StructureStorage
  ) {
    this.resource = resource;
    this.source = source;
    this.target = target;
  }

  public interview(creep: Creep): number | null {
    const carry = creep.getActiveBodyparts(CARRY);
    if (carry > 0) {
      return carry + creep.getActiveBodyparts(MOVE);
    } else return null;
  }

  public perform(creep: Creep): boolean {
    const TRANSFER = 2;
    const WITHDRAW = 1;

    if (creep.memory.status === null || (creep.memory.status !== TRANSFER && creep.store.getFreeCapacity() === 0)) {
      creep.memory.status = TRANSFER;
      creep.say("⇪ transfer");
    }

    if (creep.memory.status !== WITHDRAW && creep.store[this.resource] === 0) {
      creep.memory.status = WITHDRAW;
      creep.say("⇩ withdraw");
    }

    if (creep.memory.status === TRANSFER) {
      if (creep.transfer(this.target, this.resource) === ERR_NOT_IN_RANGE) {
        creep.moveTo(this.target, { visualizePathStyle: { stroke: "#ffffff" } });
      }
    } else if (creep.memory.status === WITHDRAW) {
      if (creep.withdraw(this.source, this.resource) === ERR_NOT_IN_RANGE) {
        creep.moveTo(this.source, { visualizePathStyle: { stroke: "#ffaa00" } });
      }
    }

    if (this.target.structureType === STRUCTURE_SPAWN) {
      return this.target.store.getFreeCapacity() === 0 || this.source.store[this.resource] === 0;
    } else {
      return this.target.store.getFreeCapacity() === 0 || this.source.store[this.resource] === 0;
    }
  }
}
