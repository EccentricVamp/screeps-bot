import { BaseAct } from "./BaseAct";

export type Investable = ConstructionSite | Creep | Structure;

export abstract class InvestAct<Investment extends Investable> extends BaseAct<Investment> {
  protected constructor(target: Investment) {
    super(target);
    this.parts.add(CARRY).add(MOVE);
  }

  public abstract execute(creep: Creep): ScreepsReturnCode;
}
