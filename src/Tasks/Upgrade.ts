import { Path, Message } from "Constants";
import { Task } from "Tasks/Task";
export class Upgrade implements Task {
  private store: StructureContainer | StructureStorage;
  private controller: StructureController;

  public constructor(store: StructureContainer | StructureStorage, controller: StructureController) {
    this.store = store;
    this.controller = controller;
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
    const BUILDING = 1;
    const WITHDRAW = 2;

    if (creep.memory.status === null || (creep.memory.status !== BUILDING && creep.store.getFreeCapacity() === 0)) {
      creep.memory.status = BUILDING;
      creep.say(Message.Upgrade);
    }

    if (creep.memory.status !== WITHDRAW && creep.store[RESOURCE_ENERGY] === 0) {
      creep.memory.status = WITHDRAW;
      creep.say(Message.Withdraw);
    }

    if (creep.memory.status === BUILDING) {
      if (creep.upgradeController(this.controller) === ERR_NOT_IN_RANGE) {
        creep.moveTo(this.controller, Path.Default);
      }
    } else if (creep.memory.status === WITHDRAW) {
      if (creep.withdraw(this.store, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        creep.moveTo(this.store, Path.Energy);
      }
    }

    return this.controller.progress === this.controller.progressTotal;
  }
}
