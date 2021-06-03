import lodash from "lodash";

export default class Roomer {
  public room: Room;

  public constructor(room: Room) {
    this.room = room;
  }

  public EnergyContainers(): StructureContainer[] {
    var rooms = this.room.find(FIND_STRUCTURES, {
      filter: structure => structure.structureType === STRUCTURE_CONTAINER
    });
    return lodash.filter(rooms, this.containsEnergy);
  }

  private containsEnergy(structure: AnyStructure): structure is StructureContainer {
    return (structure as StructureContainer).store.getUsedCapacity(RESOURCE_ENERGY) !== undefined;
  }
}
