import { Act } from "Act/BaseAct";

export interface Task {
  acts: Act[];
  parts: BodyPartConstant[];
  perform(creep: Creep): boolean;
}
