const HARVESTING = 2;
const TRANSFERING = 1;

import Task from "Tasks/Task";
export default class Harvest extends Task {
  private resource: ResourceConstant;
  private source: Source | Mineral | Deposit;
  private target: Structure;

  public constructor(
    priority: number,
    resource: ResourceConstant,
    source: Source | Mineral | Deposit,
    target: Structure
  ) {
    super(priority);
    this.resource = resource;
    this.source = source;
    this.target = target;
  }

  public perform(creep: Creep): void {
    if (creep.memory.status !== TRANSFERING && creep.store.getFreeCapacity() === 0) {
      creep.memory.status = TRANSFERING;
      creep.say("🏦 transfer");
    }

    if (creep.memory.status !== HARVESTING && creep.store[this.resource] === 0) {
      creep.memory.status = HARVESTING;
      creep.say("⛏ harvest");
    }

    if (creep.memory.status === TRANSFERING) {
      if (creep.transfer(this.target, this.resource) === ERR_NOT_IN_RANGE) {
        creep.moveTo(this.target, { visualizePathStyle: { stroke: "#ffffff" } });
      }
    } else if (creep.memory.status === HARVESTING) {
      if (creep.harvest(this.source) === ERR_NOT_IN_RANGE) {
        creep.moveTo(this.source, { visualizePathStyle: { stroke: "#ffaa00" } });
      }
    }
  }
}
