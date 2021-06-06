import { Path, Status } from "Constants";
import { Task } from "Tasks/Task";
export class Build implements Task {
  private source: StructureContainer | StructureStorage;
  private target: ConstructionSite;

  public constructor(source: StructureContainer | StructureStorage, target: ConstructionSite) {
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
      creep.say(Status.Build);
    }

    if (creep.memory.status !== WITHDRAW && creep.store[RESOURCE_ENERGY] === 0) {
      creep.memory.status = WITHDRAW;
      creep.say(Status.Withdraw);
    }

    if (creep.memory.status === BUILDING) {
      if (creep.pos.inRangeTo(this.target.pos, 3)) {
        creep.build(this.target);
      } else {
        creep.moveTo(this.target, Path.Default);
      }
    } else if (creep.memory.status === WITHDRAW) {
      if (creep.withdraw(this.source, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        creep.moveTo(this.source, Path.Energy);
      }
    }

    return this.target.progress === this.target.progressTotal;
  }
}
