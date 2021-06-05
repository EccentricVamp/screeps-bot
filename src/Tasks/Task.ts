export default abstract class Task {
  public priority: number;

  public constructor(priority: number) {
    this.priority = priority;
  }

  public abstract perform(creep: Creep): boolean;
}
