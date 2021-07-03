'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Maintainer = require('./Maintainer.js');
require('lodash');
require('./Act.js');
require('./Task.js');
require('./Creep.js');
require('./Filters.js');
require('./Evaluation.js');

const loop = () => {
    for (const room of Object.values(Game.rooms)) {
        Maintainer.Maintainer.maintain(room);
    }
    for (const name in Memory.creeps) {
        if (!(name in Game.creeps)) {
            delete Memory.creeps[name];
        }
    }
};

exports.loop = loop;
