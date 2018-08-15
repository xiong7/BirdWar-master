(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/common/script/uiRoomList.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'b8d92GHTWtF9b8nT+A88ZLS', 'uiRoomList', __filename);
// common/script/uiRoomList.js

"use strict";

var uiPanel = require("uiPanel");
var mvs = require("Matchvs");
var GLB = require("Glb");
cc.Class({
    extends: uiPanel,

    properties: {},

    start: function start() {
        this.roomPrefab = this.nodeDict["roomPrefab"];
        this.editBox = this.nodeDict["editBox"].getComponent(cc.EditBox);
        this.roomPrefab.active = false;
        this.nodeDict["search"].on("click", this.search, this);
        this.nodeDict["quit"].on("click", this.quit, this);

        this.rooms = [];

        clientEvent.on(clientEvent.eventType.getRoomListResponse, this.getRoomListResponse, this);
        clientEvent.on(clientEvent.eventType.joinRoomResponse, this.joinRoomResponse, this);
        clientEvent.on(clientEvent.eventType.getRoomListExResponse, this.getRoomListExResponse, this);

        this.getRoomList();
        this.roomRqId = setInterval(function () {
            this.getRoomList();
        }.bind(this), 20000);
    },


    getRoomList: function getRoomList() {
        var filter = {
            maxPlayer: 0,
            mode: 0,
            canWatch: 0,
            roomProperty: "",
            full: 2,
            state: 1,
            sort: 1,
            order: 0,
            pageNo: 0,
            pageSize: 20
        };
        mvs.engine.getRoomListEx(filter);
    },

    getRoomListResponse: function getRoomListResponse(data) {
        for (var j = 0; j < this.rooms.length; j++) {
            this.rooms[j].destroy();
        }
        this.rooms = [];
        data.roomInfos.sort(function (a, b) {
            return a.roomID - b.roomID;
        });
        for (var i = 0; i < data.roomInfos.length; i++) {
            var room = cc.instantiate(this.roomPrefab);
            room.active = true;
            room.parent = this.roomPrefab.parent;
            var roomScript = room.getComponent('roomInfo');
            roomScript.setData(data.roomInfos[i]);

            this.rooms.push(room);
        }
    },

    getRoomListExResponse: function getRoomListExResponse(data) {
        for (var j = 0; j < this.rooms.length; j++) {
            this.rooms[j].destroy();
        }
        this.rooms = [];
        this.roomAttrs = data.rsp.roomAttrs;
        for (var i = 0; i < data.rsp.roomAttrs.length; i++) {
            var room = cc.instantiate(this.roomPrefab);
            room.active = true;
            room.parent = this.roomPrefab.parent;
            var roomScript = room.getComponent('roomInfo');
            roomScript.setData(data.rsp.roomAttrs[i]);

            this.rooms.push(room);
        }
    },

    quit: function quit() {
        clearInterval(this.roomRqId);
        uiFunc.closeUI(this.node.name);
        this.node.destroy();
    },

    search: function search() {
        if (this.editBox.string === '') {
            for (var i = 0; i < this.rooms.length; i++) {
                this.rooms[i].active = true;
            }
        } else {
            for (var j = 0; j < this.rooms.length; j++) {
                var roomScript = this.rooms[j].getComponent('roomInfo');
                if (roomScript.roomIdLb.string == this.editBox.string) {
                    this.rooms[j].active = true;
                } else {
                    this.rooms[j].active = false;
                }
            }
        }
    },

    joinRoomResponse: function joinRoomResponse(data) {
        if (data.status !== 200) {
            console.log('进入房间失败,异步回调错误码: ' + data.status);
        } else {
            console.log('进入房间成功');
            console.log('房间号: ' + data.roomInfo.roomID);
            if (!data.roomUserInfoList.some(function (x) {
                return x.userId === GLB.userInfo.id;
            })) {
                data.roomUserInfoList.push({
                    userId: GLB.userInfo.id,
                    userProfile: ""
                });
            }
            // 设置房间最大人数--
            for (var i = 0; i < this.roomAttrs.length; i++) {
                if (data.roomInfo.roomID === this.roomAttrs[i].roomID) {
                    GLB.MAX_PLAYER_COUNT = this.roomAttrs[i].maxPlayer;
                    break;
                }
            }

            if (cc.Canvas.instance.designResolution.height > cc.Canvas.instance.designResolution.width) {
                uiFunc.openUI("uiRoomVer", function (obj) {
                    var room = obj.getComponent('uiRoom');
                    room.joinRoomInit(data.roomUserInfoList, data.roomInfo);
                    uiFunc.closeUI(this.node.name);
                    this.node.destroy();
                }.bind(this));
            } else {
                uiFunc.openUI("uiRoom", function (obj) {
                    var room = obj.getComponent('uiRoom');
                    room.joinRoomInit(data.roomUserInfoList, data.roomInfo);
                    uiFunc.closeUI(this.node.name);
                    this.node.destroy();
                }.bind(this));
            }
        }
    },

    onDestroy: function onDestroy() {
        clientEvent.off(clientEvent.eventType.getRoomListResponse, this.getRoomListResponse, this);
        clientEvent.off(clientEvent.eventType.joinRoomResponse, this.joinRoomResponse, this);
        clientEvent.off(clientEvent.eventType.getRoomListExResponse, this.getRoomListExResponse, this);
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
        //# sourceMappingURL=uiRoomList.js.map
        