'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _ = require('lodash');

/** Match useful energy resources. */
function isEnergy(resource) {
    return resource.resourceType === RESOURCE_ENERGY && resource.amount > 100;
}
/** Match structures containing energy. */
function hasEnergy(structure) {
    return ((structure.structureType === STRUCTURE_CONTAINER || structure.structureType === STRUCTURE_STORAGE) &&
        structure.store[RESOURCE_ENERGY] > 0);
}
/** Match structures with free capacity. */
function hasCapacity(structure) {
    return ((structure.structureType === STRUCTURE_CONTAINER || structure.structureType === STRUCTURE_STORAGE) &&
        structure.store.getFreeCapacity() > 0);
}
/** Match structures that need energy.  */
function needsEnergy(structure) {
    return ((structure.structureType === STRUCTURE_EXTENSION || structure.structureType === STRUCTURE_SPAWN) &&
        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0);
}
/** Match structures that need repairs. */
function needsRepair(structure) {
    return structure.hits < structure.hitsMax;
}

class Path {
}
Path.Claim = { visualizePathStyle: { stroke: "#aa00ff" /* Purple */ } };
Path.Default = { visualizePathStyle: { stroke: "#ffffff" /* White */ } };
Path.Energy = { visualizePathStyle: { stroke: "#ffaa00" /* Yellow */ } };
Path.Recycle = { visualizePathStyle: { stroke: "#ff0000" /* Red */ } };
Path.Renew = { visualizePathStyle: { stroke: "#00ffaa" /* Green */ } };
Path.Idle = { visualizePathStyle: { stroke: "#00aaff" /* Blue */ } };

class Build {
    constructor(store, site) {
        this.store = store;
        this.site = site;
    }
    eligible(creep) {
        const work = creep.getActiveBodyparts(WORK);
        const carry = creep.getActiveBodyparts(CARRY);
        const move = creep.getActiveBodyparts(MOVE);
        return work > 0 && carry > 0 && move > 0;
    }
    interview(creep) {
        const work = creep.getActiveBodyparts(WORK);
        const carry = creep.getActiveBodyparts(CARRY);
        const move = creep.getActiveBodyparts(MOVE);
        return work + carry + move;
    }
    perform(creep) {
        const BUILDING = 1;
        const WITHDRAW = 2;
        if (creep.memory.status === null || (creep.memory.status !== BUILDING && creep.store.getFreeCapacity() === 0)) {
            creep.memory.status = BUILDING;
            creep.say("\uD83C\uDFD7\uFE0F build" /* Build */);
        }
        if (creep.memory.status !== WITHDRAW && creep.store[RESOURCE_ENERGY] === 0) {
            creep.memory.status = WITHDRAW;
            creep.say("\u21E9 withdraw" /* Withdraw */);
        }
        if (creep.memory.status === BUILDING) {
            if (creep.build(this.site) === ERR_NOT_IN_RANGE) {
                creep.moveTo(this.site, Path.Default);
            }
        }
        else if (creep.memory.status === WITHDRAW) {
            if (creep.withdraw(this.store, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(this.store, Path.Energy);
            }
        }
        return this.site.progress === this.site.progressTotal;
    }
}

class Claim {
    constructor(controller) {
        this.controller = controller;
    }
    eligible(creep) {
        const claim = creep.getActiveBodyparts(CLAIM);
        const move = creep.getActiveBodyparts(MOVE);
        return claim > 0 && move > 0;
    }
    interview(creep) {
        const claim = creep.getActiveBodyparts(CLAIM);
        const move = creep.getActiveBodyparts(MOVE);
        return claim + move;
    }
    perform(creep) {
        const CLAIMING = 1;
        if (creep.memory.status !== CLAIMING) {
            creep.memory.status = CLAIMING;
            creep.say("\uD83D\uDEA9 claim" /* Claim */);
        }
        const result = creep.claimController(this.controller);
        if (result === ERR_NOT_IN_RANGE) {
            creep.moveTo(this.controller, Path.Claim);
        }
        return result === ERR_INVALID_TARGET;
    }
}

class PickUp {
    constructor(source, target) {
        this.resource = source;
        this.target = target;
    }
    eligible(creep) {
        const carry = creep.getActiveBodyparts(CARRY);
        const move = creep.getActiveBodyparts(MOVE);
        return carry > 0 && move > 0;
    }
    interview(creep) {
        const carry = creep.getActiveBodyparts(CARRY);
        const move = creep.getActiveBodyparts(MOVE);
        return carry + move;
    }
    perform(creep) {
        const TRANSFERING = 1;
        const PICKINGUP = 2;
        if (creep.memory.status === null || (creep.memory.status !== TRANSFERING && creep.store.getFreeCapacity() === 0)) {
            creep.memory.status = TRANSFERING;
            creep.say("\u21EA transfer" /* Transfer */);
        }
        if (creep.memory.status !== PICKINGUP && creep.store[this.resource.resourceType] === 0) {
            creep.memory.status = PICKINGUP;
            creep.say("\u2692\uFE0F harvest" /* Harvest */);
        }
        if (creep.memory.status === TRANSFERING) {
            if (creep.transfer(this.target, this.resource.resourceType) === ERR_NOT_IN_RANGE) {
                creep.moveTo(this.target, Path.Default);
            }
        }
        else if (creep.memory.status === PICKINGUP) {
            if (creep.pickup(this.resource) === ERR_NOT_IN_RANGE) {
                creep.moveTo(this.resource, Path.Energy);
            }
        }
        if (this.target.structureType === STRUCTURE_SPAWN || this.target.structureType === STRUCTURE_EXTENSION) {
            return this.target.store.getFreeCapacity(this.resource.resourceType) === 0;
        }
        else {
            return this.target.store.getFreeCapacity(this.resource.resourceType) === 0;
        }
    }
}

class Harvest {
    constructor(resource, source, target) {
        this.resource = resource;
        this.source = source;
        this.target = target;
    }
    eligible(creep) {
        const work = creep.getActiveBodyparts(WORK);
        const carry = creep.getActiveBodyparts(CARRY);
        const move = creep.getActiveBodyparts(MOVE);
        return work > 0 && carry > 0 && move > 0;
    }
    interview(creep) {
        return creep.getActiveBodyparts(WORK);
    }
    perform(creep) {
        const TRANSFERING = 1;
        const HARVESTING = 2;
        if (creep.memory.status === null || (creep.memory.status !== TRANSFERING && creep.store.getFreeCapacity() === 0)) {
            creep.memory.status = TRANSFERING;
            creep.say("\u21EA transfer" /* Transfer */);
        }
        if (creep.memory.status !== HARVESTING && creep.store[this.resource] === 0) {
            creep.memory.status = HARVESTING;
            creep.say("\u2692\uFE0F harvest" /* Harvest */);
        }
        if (creep.memory.status === TRANSFERING) {
            if (creep.transfer(this.target, this.resource) === ERR_NOT_IN_RANGE) {
                creep.moveTo(this.target, Path.Default);
            }
        }
        else if (creep.memory.status === HARVESTING) {
            if (creep.harvest(this.source) === ERR_NOT_IN_RANGE) {
                creep.moveTo(this.source, Path.Energy);
            }
        }
        if (this.target.structureType === STRUCTURE_SPAWN || this.target.structureType === STRUCTURE_EXTENSION) {
            return this.target.store.getFreeCapacity(this.resource) === 0;
        }
        else {
            return this.target.store.getFreeCapacity(this.resource) === 0;
        }
    }
}

class Idle {
    eligible() {
        return true;
    }
    interview() {
        return 1;
    }
    perform(creep) {
        creep.moveTo(Game.flags.Idle, Path.Idle);
        return true;
    }
}

class Recycle {
    constructor(spawn) {
        this.spawn = spawn;
    }
    eligible() {
        return true;
    }
    interview() {
        return 1;
    }
    perform(creep) {
        if (creep.memory.status !== Recycle.STATUS) {
            creep.memory.status = Recycle.STATUS;
            creep.say("\u267B\uFE0F recycle" /* Recycle */);
        }
        const result = this.spawn.recycleCreep(creep);
        if (result === ERR_NOT_IN_RANGE) {
            creep.moveTo(this.spawn, Path.Recycle);
        }
        if (result === ERR_INVALID_TARGET) {
            creep.memory.status = null;
            return true;
        }
        else
            return false;
    }
}
Recycle.STATUS = 98;

class Renew {
    constructor(spawn) {
        this.spawn = spawn;
    }
    eligible() {
        return true;
    }
    interview() {
        return 1;
    }
    perform(creep) {
        if (creep.memory.status !== Renew.STATUS) {
            creep.memory.status = Renew.STATUS;
            creep.say("\u21BB renew" /* Renew */);
        }
        const result = this.spawn.renewCreep(creep);
        if (result === ERR_NOT_IN_RANGE) {
            creep.moveTo(this.spawn, Path.Renew);
        }
        if (result === ERR_FULL) {
            creep.memory.status = null;
            return true;
        }
        else
            return false;
    }
}
Renew.STATUS = 99;
Renew.THRESHOLD = 500;

class Repair {
    constructor(store, structure) {
        this.store = store;
        this.structure = structure;
    }
    eligible(creep) {
        const work = creep.getActiveBodyparts(WORK);
        const carry = creep.getActiveBodyparts(CARRY);
        const move = creep.getActiveBodyparts(MOVE);
        return work > 0 && carry > 0 && move > 0;
    }
    interview(creep) {
        const work = creep.getActiveBodyparts(WORK);
        const carry = creep.getActiveBodyparts(CARRY);
        const move = creep.getActiveBodyparts(MOVE);
        return work + carry + move;
    }
    perform(creep) {
        const REPAIRING = 1;
        const WITHDRAW = 2;
        if (creep.memory.status === null || (creep.memory.status !== REPAIRING && creep.store.getFreeCapacity() === 0)) {
            creep.memory.status = REPAIRING;
            creep.say("\uD83D\uDEE0\uFE0F repair" /* Repair */);
        }
        if (creep.memory.status !== WITHDRAW && creep.store[RESOURCE_ENERGY] === 0) {
            creep.memory.status = WITHDRAW;
            creep.say("\u21E9 withdraw" /* Withdraw */);
        }
        if (creep.memory.status === REPAIRING) {
            if (creep.repair(this.structure) === ERR_NOT_IN_RANGE) {
                creep.moveTo(this.structure, Path.Default);
            }
        }
        else if (creep.memory.status === WITHDRAW) {
            if (creep.withdraw(this.store, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(this.store, Path.Energy);
            }
        }
        return this.structure.hits === this.structure.hitsMax;
    }
}

class Transfer {
    constructor(resource, source, target) {
        this.resource = resource;
        this.source = source;
        this.target = target;
    }
    eligible(creep) {
        const carry = creep.getActiveBodyparts(CARRY);
        const move = creep.getActiveBodyparts(MOVE);
        return carry > 0 && move > 0;
    }
    interview(creep) {
        const carry = creep.getActiveBodyparts(CARRY);
        const move = creep.getActiveBodyparts(MOVE);
        return carry + move;
    }
    perform(creep) {
        const TRANSFER = 2;
        const WITHDRAW = 1;
        if (creep.memory.status === null || (creep.memory.status !== TRANSFER && creep.store.getFreeCapacity() === 0)) {
            creep.memory.status = TRANSFER;
            creep.say("\u21EA transfer" /* Transfer */);
        }
        if (creep.memory.status !== WITHDRAW && creep.store[this.resource] === 0) {
            creep.memory.status = WITHDRAW;
            creep.say("\u21E9 withdraw" /* Withdraw */);
        }
        if (creep.memory.status === TRANSFER) {
            if (creep.transfer(this.target, this.resource) === ERR_NOT_IN_RANGE) {
                creep.moveTo(this.target, Path.Default);
            }
        }
        else if (creep.memory.status === WITHDRAW) {
            if (creep.withdraw(this.source, this.resource) === ERR_NOT_IN_RANGE) {
                creep.moveTo(this.source, Path.Energy);
            }
        }
        if (this.target.structureType === STRUCTURE_SPAWN || this.target.structureType === STRUCTURE_EXTENSION) {
            return this.target.store.getFreeCapacity() === 0 || this.source.store[this.resource] === 0;
        }
        else {
            return this.target.store.getFreeCapacity() === 0 || this.source.store[this.resource] === 0;
        }
    }
}

class Upgrade {
    constructor(store, controller) {
        this.store = store;
        this.controller = controller;
    }
    eligible(creep) {
        const work = creep.getActiveBodyparts(WORK);
        const carry = creep.getActiveBodyparts(CARRY);
        const move = creep.getActiveBodyparts(MOVE);
        return work > 0 && carry > 0 && move > 0;
    }
    interview(creep) {
        const work = creep.getActiveBodyparts(WORK);
        const carry = creep.getActiveBodyparts(CARRY);
        const move = creep.getActiveBodyparts(MOVE);
        return work + carry + move;
    }
    perform(creep) {
        const BUILDING = 1;
        const WITHDRAW = 2;
        if (creep.memory.status === null || (creep.memory.status !== BUILDING && creep.store.getFreeCapacity() === 0)) {
            creep.memory.status = BUILDING;
            creep.say("\uD83C\uDFD7\uFE0F upgrade" /* Upgrade */);
        }
        if (creep.memory.status !== WITHDRAW && creep.store[RESOURCE_ENERGY] === 0) {
            creep.memory.status = WITHDRAW;
            creep.say("\u21E9 withdraw" /* Withdraw */);
        }
        if (creep.memory.status === BUILDING) {
            if (creep.upgradeController(this.controller) === ERR_NOT_IN_RANGE) {
                creep.moveTo(this.controller, Path.Default);
            }
        }
        else if (creep.memory.status === WITHDRAW) {
            if (creep.withdraw(this.store, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(this.store, Path.Energy);
            }
        }
        return this.controller.progress === this.controller.progressTotal;
    }
}

class Maintainer {
    static maintain(room) {
        var _a, _b, _c, _d, _e;
        const spawns = room.find(FIND_MY_SPAWNS);
        const creeps = room.find(FIND_MY_CREEPS);
        const structures = room.find(FIND_STRUCTURES);
        const resources = room.find(FIND_DROPPED_RESOURCES);
        const controller = room.controller;
        if (spawns.length > 0) {
            const spawn = spawns[0];
            Maintainer.recycle(creeps, spawn);
            Maintainer.renew(creeps, spawn);
        }
        const tasks = new Array();
        if (controller !== undefined && !controller.my) {
            const claim = new Claim(controller);
            tasks.push(claim);
        }
        const energyNeeds = structures.filter(needsEnergy);
        const energyStores = structures.filter(hasEnergy);
        const energyResources = resources.filter(isEnergy);
        if (energyNeeds.length > 0) {
            const need = energyNeeds[0];
            if (energyResources.length > 0) {
                const resource = (_a = energyResources.pop()) !== null && _a !== void 0 ? _a : energyResources[0];
                const collect = new PickUp(resource, need);
                tasks.push(collect);
            }
            else if (energyStores.length > 0) {
                const store = (_b = energyStores.pop()) !== null && _b !== void 0 ? _b : energyStores[0];
                const transport = new Transfer(RESOURCE_ENERGY, store, need);
                tasks.push(transport);
            }
        }
        const energyCapacity = structures.filter(hasCapacity);
        if (energyCapacity.length > 0) {
            const capacity = energyCapacity[0];
            const source = capacity.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
            if (source !== null) {
                const harvest = new Harvest(RESOURCE_ENERGY, source, capacity);
                tasks.push(harvest);
            }
        }
        if (energyStores.length > 0) {
            const store = (_c = energyStores.pop()) !== null && _c !== void 0 ? _c : energyStores[0];
            if (controller !== undefined) {
                const upgrade = new Upgrade(store, controller);
                tasks.push(upgrade);
            }
            const sites = room.find(FIND_CONSTRUCTION_SITES);
            if (sites.length > 0) {
                const site = (_d = sites.pop()) !== null && _d !== void 0 ? _d : sites[0];
                const build = new Build(store, site);
                tasks.push(build);
            }
            const repairs = structures.filter(needsRepair);
            if (repairs.length > 0) {
                const repair = (_e = repairs.pop()) !== null && _e !== void 0 ? _e : repairs[0];
                const repairTask = new Repair(store, repair);
                tasks.push(repairTask);
            }
        }
        for (const task of tasks) {
            if (creeps.length === 0)
                break;
            const creep = Maintainer.evaluate(creeps, task);
            if (creep === undefined)
                continue;
            _['default'].pull(creeps, creep);
            task.perform(creep);
        }
        Maintainer.idle(creeps);
    }
    /** Get the best creep for a given task. */
    static evaluate(creeps, task) {
        const eligibles = creeps.filter(creep => task.eligible(creep));
        const interviews = eligibles.sort((a, b) => task.interview(a) - task.interview(b));
        return interviews[interviews.length - 1];
    }
    /** Perform an idle task for each creep. */
    static idle(creeps) {
        const idle = new Idle();
        for (const creep of creeps) {
            idle.perform(creep);
        }
    }
    static push(count, task, tasks) {
        for (let i = 0; i < count; i++) {
            tasks.push(task);
        }
    }
    /** Recyle creeps who have been flagged for recycling. */
    static recycle(creeps, spawn) {
        const recycle = new Recycle(spawn);
        for (const creep of creeps) {
            if (creep.memory.status === Recycle.STATUS) {
                recycle.perform(creep);
                _['default'].pull(creeps, creep);
            }
        }
    }
    /** Renew creeps who need renewal. */
    static renew(creeps, spawn) {
        const renew = new Renew(spawn);
        for (const creep of creeps) {
            // Ignore creeps with CLAIM parts
            if (creep.body.some(part => part.type === CLAIM))
                continue;
            // Ignore spawning creeps
            if (creep.ticksToLive === undefined)
                continue;
            if (creep.ticksToLive < Renew.THRESHOLD || creep.memory.status === Renew.STATUS) {
                const complete = renew.perform(creep);
                if (complete)
                    creep.memory.status = null;
                else
                    _['default'].pull(creeps, creep);
            }
        }
    }
}

const loop = () => {
    for (const room of Object.values(Game.rooms)) {
        Maintainer.maintain(room);
    }
    for (const name in Memory.creeps) {
        if (!(name in Game.creeps)) {
            delete Memory.creeps[name];
        }
    }
};

exports.loop = loop;
