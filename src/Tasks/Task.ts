export default interface Task {
  interview(creep: Creep): number | null;
  perform(creep: Creep): boolean;
}
