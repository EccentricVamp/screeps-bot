import { Message, Path } from "Constants";
import { Task } from "Tasks/Task";
export class Collect implements Task {
  private resource: Resource<ResourceConstant>;
  private target: StructureContainer | StructureExtension | StructureSpawn | StructureStorage;

  public constructor(
    source: Resource<ResourceConstant>,
    target: StructureContainer | StructureExtension | StructureSpawn | StructureStorage
  ) {
    this.resource = source;
    this.target = target;
  }

  public eligible(creep: Creep): boolean {
    const carry = creep.getActiveBodyparts(CARRY);
    const move = creep.getActiveBodyparts(MOVE);
    return carry > 0 && move > 0;
  }

  public interview(creep: Creep): number {
    const carry = creep.getActiveBodyparts(CARRY);
    const move = creep.getActiveBodyparts(MOVE);
    return carry + move;
  }

  public perform(creep: Creep): boolean {
    const TRANSFERING = 1;
    const PICKINGUP = 2;

    if (creep.memory.status === null || (creep.memory.status !== TRANSFERING && creep.store.getFreeCapacity() === 0)) {
      creep.memory.status = TRANSFERING;
      creep.say(Message.Transfer);
    }

    if (creep.memory.status !== PICKINGUP && creep.store[this.resource.resourceType] === 0) {
      creep.memory.status = PICKINGUP;
      creep.say(Message.Harvest);
    }

    if (creep.memory.status === TRANSFERING) {
      if (creep.transfer(this.target, this.resource.resourceType) === ERR_NOT_IN_RANGE) {
        creep.moveTo(this.target, Path.Default);
      }
    } else if (creep.memory.status === PICKINGUP) {
      if (creep.pickup(this.resource) === ERR_NOT_IN_RANGE) {
        creep.moveTo(this.resource, Path.Energy);
      }
    }

    if (this.target.structureType === STRUCTURE_SPAWN || this.target.structureType === STRUCTURE_EXTENSION) {
      return this.target.store.getFreeCapacity(this.resource.resourceType) === 0;
    } else {
      return this.target.store.getFreeCapacity(this.resource.resourceType) === 0;
    }
  }
}
