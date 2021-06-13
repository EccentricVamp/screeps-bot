export interface Task {
  eligible(creep: Creep): boolean;
  interview(creep: Creep): number;
  perform(creep: Creep): boolean;
}
