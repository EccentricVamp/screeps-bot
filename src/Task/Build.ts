import { Message, Path } from "Constants";
import { Task } from "./Task";
export class Build implements Task {
  private store: StructureContainer | StructureStorage;
  private site: ConstructionSite;

  public constructor(store: StructureContainer | StructureStorage, site: ConstructionSite) {
    this.store = store;
    this.site = site;
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
      creep.say(Message.Build);
    }

    if (creep.memory.status !== WITHDRAW && creep.store[RESOURCE_ENERGY] === 0) {
      creep.memory.status = WITHDRAW;
      creep.say(Message.Withdraw);
    }

    if (creep.memory.status === BUILDING) {
      if (creep.build(this.site) === ERR_NOT_IN_RANGE) {
        creep.moveTo(this.site, Path.Default);
      }
    } else if (creep.memory.status === WITHDRAW) {
      if (creep.withdraw(this.store, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        creep.moveTo(this.store, Path.Energy);
      }
    }

    return this.site.progress === this.site.progressTotal;
  }
}
