import { Message, Path } from "Constants";
import { Task } from "Tasks/Task";
export class Harvest implements Task {
  private resource: ResourceConstant;
  private source: Source | Mineral | Deposit;
  private target: StructureContainer | StructureExtension | StructureSpawn | StructureStorage;

  public constructor(
    resource: ResourceConstant,
    source: Source | Mineral | Deposit,
    target: StructureContainer | StructureExtension | StructureSpawn | StructureStorage
  ) {
    this.resource = resource;
    this.source = source;
    this.target = target;
  }

  public eligible(creep: Creep): boolean {
    const work = creep.getActiveBodyparts(WORK);
    const carry = creep.getActiveBodyparts(CARRY);
    const move = creep.getActiveBodyparts(MOVE);
    return work > 0 && carry > 0 && move > 0;
  }

  public interview(creep: Creep): number {
    return creep.getActiveBodyparts(WORK);
  }

  public perform(creep: Creep): boolean {
    const TRANSFERING = 1;
    const HARVESTING = 2;

    if (creep.memory.status === null || (creep.memory.status !== TRANSFERING && creep.store.getFreeCapacity() === 0)) {
      creep.memory.status = TRANSFERING;
      creep.say(Message.Transfer);
    }

    if (creep.memory.status !== HARVESTING && creep.store[this.resource] === 0) {
      creep.memory.status = HARVESTING;
      creep.say(Message.Harvest);
    }

    if (creep.memory.status === TRANSFERING) {
      if (creep.transfer(this.target, this.resource) === ERR_NOT_IN_RANGE) {
        creep.moveTo(this.target, Path.Default);
      }
    } else if (creep.memory.status === HARVESTING) {
      if (creep.harvest(this.source) === ERR_NOT_IN_RANGE) {
        creep.moveTo(this.source, Path.Energy);
      }
    }

    if (this.target.structureType === STRUCTURE_SPAWN || this.target.structureType === STRUCTURE_EXTENSION) {
      return this.target.store.getFreeCapacity(this.resource) === 0;
    } else {
      return this.target.store.getFreeCapacity(this.resource) === 0;
    }
  }
}
