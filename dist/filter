'use strict';

/** Match useful energy resources. */
function isEnergy(resource) {
    return resource.resourceType === RESOURCE_ENERGY && resource.amount > 100;
}
/** Match structures containing energy. */
function hasEnergy(structure) {
    return ((structure.structureType === STRUCTURE_CONTAINER ||
        structure.structureType === STRUCTURE_STORAGE) &&
        structure.store[RESOURCE_ENERGY] > 0);
}
/** Match structures with free capacity. */
function hasCapacity(structure) {
    return ((structure.structureType === STRUCTURE_CONTAINER ||
        structure.structureType === STRUCTURE_STORAGE) &&
        structure.store.getFreeCapacity() > 0);
}
/** Match structures that need energy.  */
function needsEnergy(structure) {
    return ((structure.structureType === STRUCTURE_EXTENSION ||
        structure.structureType === STRUCTURE_SPAWN) &&
        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0);
}
/** Match structures that need repairs. */
function needsRepair(structure) {
    return structure.hits < structure.hitsMax;
}

exports.hasCapacity = hasCapacity;
exports.hasEnergy = hasEnergy;
exports.isEnergy = isEnergy;
exports.needsEnergy = needsEnergy;
exports.needsRepair = needsRepair;
