import { Path, Status } from "Constants";
import { Task } from "Tasks/Task";
export class Collect implements Task {
  private source: Resource<ResourceConstant>;
  private target: StructureContainer | StructureExtension | StructureSpawn | StructureStorage;

  public constructor(
    source: Resource<ResourceConstant>,
    target: StructureContainer | StructureExtension | StructureSpawn | StructureStorage
  ) {
    this.source = source;
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
      creep.say(Status.Transfer);
    }

    if (creep.memory.status !== PICKINGUP && creep.store[this.source.resourceType] === 0) {
      creep.memory.status = PICKINGUP;
      creep.say(Status.Harvest);
    }

    if (creep.memory.status === TRANSFERING) {
      if (creep.transfer(this.target, this.source.resourceType) === ERR_NOT_IN_RANGE) {
        creep.moveTo(this.target, Path.Default);
      }
    } else if (creep.memory.status === PICKINGUP) {
      if (creep.pickup(this.source) === ERR_NOT_IN_RANGE) {
        creep.moveTo(this.source, Path.Energy);
      }
    }

    if (this.target.structureType === STRUCTURE_SPAWN || this.target.structureType === STRUCTURE_EXTENSION) {
      return this.target.store.getFreeCapacity(this.source.resourceType) === 0;
    } else {
      return this.target.store.getFreeCapacity(this.source.resourceType) === 0;
    }
  }
}
