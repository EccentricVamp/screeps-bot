export function isEnergy(resource: Resource): resource is Resource<RESOURCE_ENERGY> {
  return resource.resourceType === RESOURCE_ENERGY && resource.amount > 100;
}

export function hasEnergy(structure: AnyStructure): structure is StructureContainer | StructureStorage {
  return (
    (structure.structureType === STRUCTURE_CONTAINER || structure.structureType === STRUCTURE_STORAGE) &&
    structure.store[RESOURCE_ENERGY] > 0
  );
}

export function hasCapacity(structure: AnyStructure): structure is StructureContainer | StructureStorage {
  return (
    (structure.structureType === STRUCTURE_CONTAINER || structure.structureType === STRUCTURE_STORAGE) &&
    structure.store.getFreeCapacity() > 0
  );
}

export function needsEnergy(structure: AnyStructure): structure is StructureExtension | StructureSpawn {
  return (
    (structure.structureType === STRUCTURE_EXTENSION || structure.structureType === STRUCTURE_SPAWN) &&
    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
  );
}

export function needsRepair(structure: AnyStructure): boolean {
  return structure.hits < structure.hitsMax;
}
