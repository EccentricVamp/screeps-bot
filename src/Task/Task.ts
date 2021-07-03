import { Act } from "Act/Act";

export interface Task {
  acts: Act[];
  parts: BodyPartConstant[];
  perform(creep: Creep): void;
}
