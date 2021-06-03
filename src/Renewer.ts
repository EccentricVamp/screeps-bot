export class Renewer {
  public static run(creep: Creep): void {
    const spawns = creep.room.find(FIND_MY_SPAWNS);
    if (spawns.length > 0) {
      const spawn = spawns[0];
      const renewResult = spawn.renewCreep(creep);
      if (renewResult === ERR_NOT_IN_RANGE) {
        creep.moveTo(spawn, { visualizePathStyle: { stroke: "#ffffff" } });
      } else if (renewResult === ERR_FULL) {
        creep.memory.renewing = false;
      }
    }
  }
}
