'use strict';

var _ = require('lodash');

function moveTo(creep, target) {
    return creep.moveTo(target);
}
function getParts(creep) {
    return creep.body.map(part => part.type);
}
function getStatus(creep, expected) {
    const status = creep.memory.status;
    if (status === undefined || status === null || !expected.includes(status)) {
        creep.memory.status = expected[0];
        return expected[0];
    }
    else
        return status;
}
function setStatus(creep, status) {
    creep.memory.status = status;
    return status;
}
class Evaluation {
    constructor(creep, parts) {
        this.eligible = true;
        this.score = 0;
        this.creep = creep;
        const partCounts = _['default'].countBy(getParts(creep));
        for (const part of parts) {
            const count = partCounts[part];
            if (count === 0) {
                this.eligible = false;
                break;
            }
            this.score += count;
        }
    }
}

exports.Evaluation = Evaluation;
exports.getParts = getParts;
exports.getStatus = getStatus;
exports.moveTo = moveTo;
exports.setStatus = setStatus;
