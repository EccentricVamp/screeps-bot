export default interface Action {
  parts: Set<BodyPartConstant>;
  resources: Set<ResourceConstant>;
  execute(creep: Creep): ScreepsReturnCode;
}
