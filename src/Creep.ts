export type MoveToReturnCode = CreepMoveReturnCode | ERR_NO_PATH | ERR_INVALID_TARGET | ERR_NOT_FOUND;

export function moveTo(creep: Creep, target: {pos: RoomPosition}): MoveToReturnCode {
  return creep.moveTo(target);
}

export function getParts(creep: Creep): BodyPartConstant[] {
  return creep.body.map(part => part.type);
}

export function getStatus(creep: Creep): number | null {
  if (creep.memory.status === undefined) creep.memory.status = null;
  return creep.memory.status;
}

export function setStatus(creep: Creep, status: number | null): number | null {
  return creep.memory.status = status;
}
