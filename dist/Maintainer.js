'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _ = require('lodash');
var Act = require('./Act.js');
var Task = require('./Task.js');
var Filters = require('./Filters.js');
var Evaluation = require('./Evaluation.js');
require('./Creep.js');

class Maintainer {
    static maintain(room) {
        const spawns = room.find(FIND_MY_SPAWNS);
        const creeps = room.find(FIND_MY_CREEPS);
        const structures = room.find(FIND_STRUCTURES);
        const resources = room.find(FIND_DROPPED_RESOURCES);
        const controller = room.controller;
        if (spawns.length > 0) {
            const spawn = spawns[0];
            const recycle = Task.Factory.Recycle(spawn);
            const renew = Task.Factory.Renew(spawn);
            for (const creep of creeps) {
                const status = creep.memory.status;
                if (status === Task.RECYCLE) {
                    recycle.perform(creep);
                    _['default'].pull(creeps, creep);
                    continue;
                }
                // Ignore creeps with CLAIM parts
                if (creep.body.some(part => part.type === CLAIM))
                    continue;
                // Ignore spawning creeps
                if (creep.ticksToLive === undefined)
                    continue;
                if (creep.ticksToLive < Task.THRESHOLD || status === Task.RENEW) {
                    renew.perform(creep);
                    if (creep.memory.status !== null)
                        _['default'].pull(creeps, creep);
                }
            }
        }
        const tasks = new Array();
        if (controller !== undefined && !controller.my) {
            tasks.push(Task.Factory.Claim(controller));
        }
        const energyNeeds = structures.filter(Filters.needsEnergy);
        const energyStores = structures.filter(Filters.hasEnergy);
        const energyResources = resources.filter(Filters.isEnergy);
        const energySources = room.find(FIND_SOURCES_ACTIVE);
        if (energyNeeds.length > 0) {
            const need = energyNeeds[0];
            const collect = Maintainer.findEnergy(energyResources, energyStores, energySources);
            if (collect !== null) {
                tasks.push(Task.Factory.Transfer(need, collect));
            }
        }
        const energyCapacity = structures.filter(Filters.hasCapacity);
        if (energyCapacity.length > 0) {
            const capacity = energyCapacity[0];
            const source = _['default'].first(_['default'].sortBy(energySources, s => s.pos.getRangeTo(capacity)));
            if (source !== undefined) {
                _['default'].pull(energySources, source);
                tasks.push(Task.Factory.Harvest(source, capacity));
            }
        }
        const sites = room.find(FIND_CONSTRUCTION_SITES);
        if (sites.length > 0) {
            const site = sites[0];
            const collect = Maintainer.findEnergy(energyResources, energyStores, energySources);
            if (collect !== null) {
                tasks.push(Task.Factory.Build(site, collect));
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
        const idle = Task.Factory.Idle(Game.flags.Idle);
        for (const creep of creeps) {
            idle.perform(creep);
        }
    }
    /** Get the best creep for a given task. */
    static evaluate(creeps, task) {
        const parts = task.parts;
        const evaluations = creeps
            .map(creep => new Evaluation.Evaluation(creep, parts))
            .filter(evaluation => evaluation.eligible)
            .sort((a, b) => a.score - b.score);
        return evaluations[evaluations.length - 1].creep;
    }
    static findEnergy(resources, stores, sources) {
        if (resources.length > 0) {
            const resource = resources.pop();
            return new Act.Pickup(resource);
        }
        else if (stores.length > 0) {
            const store = stores.pop();
            return new Act.Withdraw(store);
        }
        else if (sources.length > 0) {
            const source = sources.pop();
            return new Act.Harvest(source);
        }
        else
            return null;
    }
}

exports.Maintainer = Maintainer;
