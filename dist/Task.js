'use strict';

require('lodash');
var Act = require('./Act.js');
var Creep = require('./Creep.js');

const BUILD = 0;
const ENERGIZE$2 = 1;
class Build {
    constructor(build, energize) {
        this.acts = [build, energize];
        this.parts = Act.getParts(this.acts);
    }
    perform(creep) {
        const status = Creep.getStatus(creep, [BUILD, ENERGIZE$2]);
        const act = this.acts[status];
        switch (act.execute(creep)) {
            case ERR_NOT_IN_RANGE:
                Creep.moveTo(creep, act.target);
                break;
            case ERR_NOT_ENOUGH_ENERGY:
                Creep.setStatus(creep, ENERGIZE$2);
                break;
            case ERR_FULL:
                Creep.setStatus(creep, BUILD);
                break;
        }
    }
}

const CLAIM = 0;
class Claim {
    constructor(claim) {
        this.acts = [claim];
        this.parts = Act.getParts(this.acts);
    }
    perform(creep) {
        const act = this.acts[CLAIM];
        switch (act.execute(creep)) {
            case ERR_NOT_IN_RANGE:
                Creep.moveTo(creep, act.target);
                break;
        }
    }
}

const HARVEST = 0;
const TRANSFER$1 = 1;
class Harvest {
    constructor(harvest, transfer) {
        this.parts = [WORK, WORK, WORK, CARRY, MOVE];
        this.acts = [harvest, transfer];
    }
    perform(creep) {
        const status = Creep.getStatus(creep, [HARVEST, TRANSFER$1]);
        const act = this.acts[status];
        switch (act.execute(creep)) {
            case ERR_NOT_IN_RANGE:
                Creep.moveTo(creep, act.target);
                break;
            case ERR_NOT_ENOUGH_RESOURCES:
                Creep.setStatus(creep, HARVEST);
                break;
            case ERR_FULL:
                Creep.setStatus(creep, TRANSFER$1);
                break;
        }
    }
}

class Idle {
    constructor(target) {
        this.acts = [];
        this.parts = [MOVE];
        this.target = target;
    }
    perform(creep) {
        creep.moveTo(this.target);
    }
}

const RECYCLE = 98;
class Recycle {
    constructor(recycle) {
        this.parts = [];
        this.acts = [recycle];
    }
    perform(creep) {
        Creep.setStatus(creep, RECYCLE);
        const act = this.acts[0];
        switch (act.execute(creep)) {
            case ERR_NOT_IN_RANGE:
                Creep.moveTo(creep, act.target);
                break;
        }
    }
}

const RENEW = 99;
const THRESHOLD = 500;
class Renew {
    constructor(renew) {
        this.parts = [];
        this.acts = [renew];
    }
    perform(creep) {
        Creep.setStatus(creep, RENEW);
        const act = this.acts[0];
        switch (act.execute(creep)) {
            case ERR_NOT_IN_RANGE:
                Creep.moveTo(creep, act.target);
                break;
            case ERR_FULL:
                Creep.setStatus(creep, null);
                break;
        }
    }
}

const TRANSFER = 0;
const COLLECT = 1;
class Transfer {
    constructor(transfer, collect) {
        this.acts = [transfer, collect];
        this.parts = Act.getParts(this.acts);
    }
    perform(creep) {
        const status = Creep.getStatus(creep, [TRANSFER, COLLECT]);
        const act = this.acts[status];
        switch (act.execute(creep)) {
            case ERR_NOT_IN_RANGE:
                Creep.moveTo(creep, act.target);
                break;
            case ERR_NOT_ENOUGH_RESOURCES:
                Creep.setStatus(creep, COLLECT);
                break;
            case ERR_FULL:
                Creep.setStatus(creep, TRANSFER);
                break;
        }
    }
}

const REPAIR = 0;
const ENERGIZE$1 = 1;
class Repair {
    constructor(repair, energize) {
        this.acts = [repair, energize];
        this.parts = Act.getParts(this.acts);
    }
    perform(creep) {
        const status = Creep.getStatus(creep, [REPAIR, ENERGIZE$1]);
        const act = this.acts[status];
        switch (act.execute(creep)) {
            case ERR_NOT_IN_RANGE:
                Creep.moveTo(creep, act.target);
                break;
            case ERR_NOT_ENOUGH_ENERGY:
                Creep.setStatus(creep, ENERGIZE$1);
                break;
            case ERR_FULL:
                Creep.setStatus(creep, REPAIR);
                break;
        }
    }
}

const UPGRADE = 0;
const ENERGIZE = 1;
class Upgrade {
    constructor(upgrade, energize) {
        this.acts = [upgrade, energize];
        this.parts = Act.getParts(this.acts);
    }
    perform(creep) {
        const status = Creep.getStatus(creep, [UPGRADE, ENERGIZE]);
        const act = this.acts[status];
        switch (act.execute(creep)) {
            case ERR_NOT_IN_RANGE:
                Creep.moveTo(creep, act.target);
                break;
            case ERR_NOT_ENOUGH_ENERGY:
                Creep.setStatus(creep, ENERGIZE);
                break;
            case ERR_FULL:
                Creep.setStatus(creep, UPGRADE);
                break;
        }
        return false;
    }
}

class Factory {
    static Build(site, collect) {
        return new Build(new Act.Build(site), collect);
    }
    static Claim(controller) {
        return new Claim(new Act.Claim(controller));
    }
    static Harvest(target, store) {
        return new Harvest(new Act.Harvest(target), new Act.Transfer(store));
    }
    static Idle(target) {
        return new Idle(target.pos);
    }
    static Recycle(spawn) {
        return new Recycle(new Act.Recycle(spawn));
    }
    static Renew(spawn) {
        return new Renew(new Act.Renew(spawn));
    }
    static Transfer(target, collect) {
        return new Transfer(new Act.Transfer(target), collect);
    }
}

exports.Build = Build;
exports.Claim = Claim;
exports.Factory = Factory;
exports.Harvest = Harvest;
exports.Idle = Idle;
exports.RECYCLE = RECYCLE;
exports.RENEW = RENEW;
exports.Recycle = Recycle;
exports.Renew = Renew;
exports.Repair = Repair;
exports.THRESHOLD = THRESHOLD;
exports.Transfer = Transfer;
exports.Upgrade = Upgrade;
