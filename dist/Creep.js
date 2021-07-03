'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

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

exports.getParts = getParts;
exports.getStatus = getStatus;
exports.moveTo = moveTo;
exports.setStatus = setStatus;
