'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _ = require('lodash');
var Creep = require('./Creep.js');

class Evaluation {
    constructor(creep, parts) {
        this.eligible = true;
        this.score = 0;
        this.creep = creep;
        const partCounts = _['default'].countBy(Creep.getParts(creep));
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
