"use strict";
// import * as persistState from 'redux-localstorage';
const createLogger = require("redux-logger");
const store_1 = require("./store");
exports.rootReducer = store_1.rootReducer;
exports.middleware = [
    createLogger({
        level: 'info',
        collapsed: true,
        stateTransformer: store_1.deimmutify
    })
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsc0RBQXNEO0FBQ3RELDZDQUE2QztBQUM3QyxtQ0FBNkQ7QUFVM0QsMENBQVc7QUFrQkEsUUFBQSxVQUFVLEdBQUc7SUFDeEIsWUFBWSxDQUFDO1FBQ1gsS0FBSyxFQUFFLE1BQU07UUFDYixTQUFTLEVBQUUsSUFBSTtRQUNmLGdCQUFnQixFQUFFLGtCQUFVO0tBQzdCLENBQUM7Q0FDSCxDQUFDIn0=