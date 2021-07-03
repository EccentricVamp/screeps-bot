import { countBy } from "lodash";

export type MoveToReturnCode =
  | CreepMoveReturnCode
  | ERR_NO_PATH
  | ERR_INVALID_TARGET
  | ERR_NOT_FOUND;

export function moveTo(creep: Creep, target: { pos: RoomPosition }): MoveToReturnCode {
  return creep.moveTo(target);
}

export function getParts(creep: Creep): BodyPartConstant[] {
  return creep.body.map(part => part.type);
}

export function getStatus(creep: Creep, expected: number[]): number {
  const status = creep.memory.status;
  if (status === undefined || status === null || !expected.includes(status)) {
    creep.memory.status = expected[0];
    return expected[0];
  } else return status;
}

export function setStatus<T extends number | null>(creep: Creep, status: T): T {
  creep.memory.status = status;
  return status;
}

export class Evaluation {
  public creep: Creep;
  public eligible = true;
  public score = 0;

  public constructor(creep: Creep, parts: BodyPartConstant[]) {
    this.creep = creep;

    const partCounts = countBy(getParts(creep));
    for (const part of parts) {
      const count = partCounts[part];
      if (count === 0) {
        this.eligible = false;
        break;
      }
      this.score += count;
    }
  }
}
