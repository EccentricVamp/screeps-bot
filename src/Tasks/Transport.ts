import { Path, Status } from "Constants";
import Task from "Tasks/Task";
export default class Transport implements Task {
  private resource: ResourceConstant;
  private source: StructureContainer | StructureStorage;
  private target: StructureContainer | StructureExtension | StructureSpawn | StructureStorage;

  public constructor(
    resource: ResourceConstant,
    source: StructureContainer | StructureStorage,
    target: StructureContainer | StructureExtension | StructureSpawn | StructureStorage
  ) {
    this.resource = resource;
    this.source = source;
    this.target = target;
  }

  public interview(creep: Creep): number | null {
    const carry = creep.getActiveBodyparts(CARRY);
    if (carry === 0) return null;

    const move = creep.getActiveBodyparts(MOVE);
    if (move === 0) return null;

    return carry + move;
  }

  public perform(creep: Creep): boolean {
    const TRANSFER = 2;
    const WITHDRAW = 1;

    if (creep.memory.status === null || (creep.memory.status !== TRANSFER && creep.store.getFreeCapacity() === 0)) {
      creep.memory.status = TRANSFER;
      creep.say(Status.Transfer);
    }

    if (creep.memory.status !== WITHDRAW && creep.store[this.resource] === 0) {
      creep.memory.status = WITHDRAW;
      creep.say(Status.Withdraw);
    }

    if (creep.memory.status === TRANSFER) {
      if (creep.transfer(this.target, this.resource) === ERR_NOT_IN_RANGE) {
        creep.moveTo(this.target, Path.Default);
      }
    } else if (creep.memory.status === WITHDRAW) {
      if (creep.withdraw(this.source, this.resource) === ERR_NOT_IN_RANGE) {
        creep.moveTo(this.source, Path.Energy);
      }
    }

    if (this.target.structureType === STRUCTURE_SPAWN || this.target.structureType === STRUCTURE_EXTENSION) {
      return this.target.store.getFreeCapacity() === 0 || this.source.store[this.resource] === 0;
    } else {
      return this.target.store.getFreeCapacity() === 0 || this.source.store[this.resource] === 0;
    }
  }
}
