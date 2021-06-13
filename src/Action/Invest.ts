import { Action } from "./Action";

export type Investable = ConstructionSite | Creep | Structure;

export abstract class Invest<Investment extends Investable> extends Action<Investment> {
  protected constructor(target: Investment) {
    super(target);
    this.parts.add(CARRY).add(MOVE);
  }

  public abstract execute(creep: Creep): ScreepsReturnCode;
}
