import Task from "Tasks/Task";
export default class Idle implements Task {
    interview(): number | null {
        return 1;
    }
    perform(creep: Creep): boolean {
        creep.moveTo(Game.flags.Idle);
        return true;
    }
}
