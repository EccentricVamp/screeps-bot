export function hasEnergy(structure: AnyStructure): structure is StructureContainer | StructureStorage {
  return (
    (structure.structureType === STRUCTURE_CONTAINER || structure.structureType === STRUCTURE_STORAGE) &&
    (structure as StructureContainer | StructureStorage).store[RESOURCE_ENERGY] > 0
  );
}

export function hasCapacity(structure: AnyStructure): structure is StructureContainer | StructureStorage {
  return (
    (structure.structureType === STRUCTURE_CONTAINER || structure.structureType === STRUCTURE_EXTENSION) &&
    (structure as StructureContainer | StructureStorage).store.getFreeCapacity(RESOURCE_ENERGY) > 0
  );
}

export function needsEnergy(structure: AnyStructure): structure is StructureExtension | StructureSpawn {
  return (
    (structure.structureType === STRUCTURE_EXTENSION || structure.structureType === STRUCTURE_SPAWN) &&
    (structure as StructureExtension | StructureSpawn).store.getFreeCapacity(RESOURCE_ENERGY) > 0
  );
}

export function needsRepair(structure: AnyStructure): boolean {
  return structure.hits < structure.hitsMax;
}
