(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/common/script/uiCreateRoom.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'e15a0SellRL6YcLfubCYSrA', 'uiCreateRoom', __filename);
// common/script/uiCreateRoom.js

"use strict";

var uiPanel = require("uiPanel");
var mvs = require("Matchvs");
var GLB = require("Glb");
cc.Class({
    extends: uiPanel,
    properties: {},

    onLoad: function onLoad() {
        this._super();
        this.playerCntLb = this.nodeDict["playerCnt"].getComponent(cc.Label);
        this.playerCnt = GLB.PLAYER_COUNTS[0];
        this.playerCntLb.string = this.playerCnt;
        this.refreshBtnState();
        this.nodeDict["quit"].on("click", this.quit, this);
        this.nodeDict["addNode"].on("click", this.addPlayerCount, this);
        this.nodeDict["subNode"].on("click", this.subPlayerCount, this);
        this.nodeDict["create"].on("click", this.createRoom, this);

        clientEvent.on(clientEvent.eventType.createRoomResponse, this.createRoomResponse, this);
    },


    addPlayerCount: function addPlayerCount() {
        for (var i = 0; i < GLB.PLAYER_COUNTS.length; i++) {
            if (this.playerCnt === GLB.PLAYER_COUNTS[i]) {
                if (GLB.PLAYER_COUNTS.length > i + 1) {
                    this.playerCnt = GLB.PLAYER_COUNTS[i + 1];
                    break;
                }
            }
        }

        this.playerCntLb.string = this.playerCnt;
        this.refreshBtnState();
    },

    subPlayerCount: function subPlayerCount() {
        for (var i = 0; i < GLB.PLAYER_COUNTS.length; i++) {
            if (this.playerCnt === GLB.PLAYER_COUNTS[i]) {
                if (i > 0) {
                    this.playerCnt = GLB.PLAYER_COUNTS[i - 1];
                    break;
                }
            }
        }
        this.playerCntLb.string = this.playerCnt;
        this.refreshBtnState();
    },

    refreshBtnState: function refreshBtnState() {
        if (this.playerCnt === GLB.PLAYER_COUNTS[0]) {
            this.nodeDict["subNode"].getComponent(cc.Button).interactable = false;
        } else {
            this.nodeDict["subNode"].getComponent(cc.Button).interactable = true;
        }

        if (this.playerCnt === GLB.PLAYER_COUNTS[GLB.PLAYER_COUNTS.length - 1]) {
            this.nodeDict["addNode"].getComponent(cc.Button).interactable = false;
        } else {
            this.nodeDict["addNode"].getComponent(cc.Button).interactable = true;
        }
    },


    quit: function quit() {
        uiFunc.closeUI(this.node.name);
        this.node.destroy();
        GLB.MAX_PLAYER_COUNT = 4;
    },

    createRoom: function createRoom() {
        var create = new mvs.CreateRoomInfo();
        create.roomName = this.nodeDict["roomName"].getComponent(cc.EditBox).string;
        GLB.MAX_PLAYER_COUNT = this.playerCnt;
        create.maxPlayer = GLB.MAX_PLAYER_COUNT;
        create.mode = 0;
        create.canWatch = 0;
        create.visibility = 1;
        create.roomProperty = GLB.MAX_PLAYER_COUNT;
        var result = mvs.engine.createRoom(create, { maxPlayer: GLB.MAX_PLAYER_COUNT });
        if (result !== 0) {
            console.log('创建房间失败,错误码:' + result);
        }
    },

    createRoomResponse: function createRoomResponse(data) {
        var status = data.rsp.status;
        if (status !== 200) {
            console.log('创建房间失败,异步回调错误码: ' + status);
        } else {
            console.log('创建房间成功:' + JSON.stringify(data.rsp));
            console.log('房间号: ' + data.rsp.roomID);
            GLB.roomId = data.rsp.roomID;

            if (cc.Canvas.instance.designResolution.height > cc.Canvas.instance.designResolution.width) {
                uiFunc.openUI("uiRoomVer", function (obj) {
                    var room = obj.getComponent('uiRoom');
                    room.createRoomInit(data.rsp);
                    uiFunc.closeUI(this.node.name);
                    this.node.destroy();
                }.bind(this));
            } else {
                uiFunc.openUI("uiRoom", function (obj) {
                    var room = obj.getComponent('uiRoom');
                    room.createRoomInit(data.rsp);
                    uiFunc.closeUI(this.node.name);
                    this.node.destroy();
                }.bind(this));
            }
        }
    },

    onDestroy: function onDestroy() {
        clientEvent.off(clientEvent.eventType.createRoomResponse, this.createRoomResponse, this);
    }
});

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=uiCreateRoom.js.map
        