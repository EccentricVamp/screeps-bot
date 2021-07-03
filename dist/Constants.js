'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const Path = {
    Claim: { visualizePathStyle: { stroke: "#aa00ff" /* Purple */ } },
    Default: { visualizePathStyle: { stroke: "#ffffff" /* White */ } },
    Energy: { visualizePathStyle: { stroke: "#ffaa00" /* Yellow */ } },
    Recycle: { visualizePathStyle: { stroke: "#ff0000" /* Red */ } },
    Renew: { visualizePathStyle: { stroke: "#00ffaa" /* Green */ } },
    Idle: { visualizePathStyle: { stroke: "#00aaff" /* Blue */ } }
};
const Message = {
    Build: "🏗️ build",
    Claim: "🚩 claim",
    Harvest: "⚒️ harvest",
    PickUp: "🧲 pick up",
    Recycle: "♻️ recycle",
    Renew: "↻ renew",
    Repair: "🛠️ repair",
    Transfer: "⇪ transfer",
    Upgrade: "🏗️ upgrade",
    Withdraw: "⇩ withdraw"
};

exports.Message = Message;
exports.Path = Path;
