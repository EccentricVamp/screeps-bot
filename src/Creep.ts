export type MoveToReturnCode = CreepMoveReturnCode | ERR_NO_PATH | ERR_INVALID_TARGET | ERR_NOT_FOUND;

export function moveTo(creep: Creep, target: {pos: RoomPosition}): MoveToReturnCode {
  return creep.moveTo(target);
}

export function getParts(creep: Creep): BodyPartConstant[] {
  return creep.body.map(part => part.type);
}

export function getStatus(creep: Creep, defaultStatus: number | null = null): number | null {
  const status = creep.memory.status;
  if (status === undefined || status === null) {
    creep.memory.status = defaultStatus;
    return defaultStatus;
  } else return status;
}

export function setStatus<T extends number | null>(creep: Creep, status: T): T {
  creep.memory.status = status;
  return status;
}
