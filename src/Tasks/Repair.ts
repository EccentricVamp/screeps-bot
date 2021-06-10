import { Path, Message } from "Constants";
import { Task } from "Tasks/Task";
export class Repair implements Task {
  private store: StructureContainer | StructureStorage;
  private structure: Structure;

  public constructor(store: StructureContainer | StructureStorage, structure: Structure) {
    this.store = store;
    this.structure = structure;
  }

  public eligible(creep: Creep): boolean {
    const work = creep.getActiveBodyparts(WORK);
    const carry = creep.getActiveBodyparts(CARRY);
    const move = creep.getActiveBodyparts(MOVE);
    return work > 0 && carry > 0 && move > 0;
  }

  public interview(creep: Creep): number {
    const work = creep.getActiveBodyparts(WORK);
    const carry = creep.getActiveBodyparts(CARRY);
    const move = creep.getActiveBodyparts(MOVE);
    return work + carry + move;
  }

  public perform(creep: Creep): boolean {
    const REPAIRING = 1;
    const WITHDRAW = 2;

    if (creep.memory.status === null || (creep.memory.status !== REPAIRING && creep.store.getFreeCapacity() === 0)) {
      creep.memory.status = REPAIRING;
      creep.say(Message.Repair);
    }

    if (creep.memory.status !== WITHDRAW && creep.store[RESOURCE_ENERGY] === 0) {
      creep.memory.status = WITHDRAW;
      creep.say(Message.Withdraw);
    }

    if (creep.memory.status === REPAIRING) {
      if (creep.repair(this.structure) === ERR_NOT_IN_RANGE) {
        creep.moveTo(this.structure, Path.Default);
      }
    } else if (creep.memory.status === WITHDRAW) {
      if (creep.withdraw(this.store, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        creep.moveTo(this.store, Path.Energy);
      }
    }

    return this.structure.hits === this.structure.hitsMax;
  }
}
