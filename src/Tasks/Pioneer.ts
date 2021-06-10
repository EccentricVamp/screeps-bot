import { Path, Status } from "Constants";
import { Task } from "Tasks/Task";
export class Pioneer implements Task {
  private source: Source;
  private site: ConstructionSite;

  public constructor(source: Source, site: ConstructionSite) {
    this.source = source;
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
    const HARVESTING = 2;

    if (creep.memory.status === null || (creep.memory.status !== BUILDING && creep.store.getFreeCapacity() === 0)) {
      creep.memory.status = BUILDING;
      creep.say(Status.Build);
    }

    if (creep.memory.status !== HARVESTING && creep.store[RESOURCE_ENERGY] === 0) {
      creep.memory.status = HARVESTING;
      creep.say(Status.Harvest);
    }

    if (creep.memory.status === BUILDING) {
      if (creep.build(this.site) === ERR_NOT_IN_RANGE) {
        creep.moveTo(this.site, Path.Default);
      }
    } else if (creep.memory.status === HARVESTING) {
      if (creep.harvest(this.source) === ERR_NOT_IN_RANGE) {
        creep.moveTo(this.source, Path.Energy);
      }
    }

    return this.site.progress === this.site.progressTotal;
  }
}
