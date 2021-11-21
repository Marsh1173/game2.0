/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/client/game.ts":
/*!****************************!*\
  !*** ./src/client/game.ts ***!
  \****************************/
/*! flagged exports */
/*! export Game [provided] [no usage info] [missing usage info prevents renaming] */
/*! export __esModule [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__, __webpack_require__ */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


exports.__esModule = true;
exports.Game = void 0;
var util_1 = __webpack_require__(/*! ./util */ "./src/client/util.ts");
var gameRenderer_1 = __webpack_require__(/*! ./gameRender/gameRenderer */ "./src/client/gameRender/gameRenderer.ts");
var messageHandler_1 = __webpack_require__(/*! ./messageHandler */ "./src/client/messageHandler.ts");
var clientSword_1 = __webpack_require__(/*! ../objects/newActors/clientActors/clientPlayer/clientClasses/clientSword */ "./src/objects/newActors/clientActors/clientPlayer/clientClasses/clientSword.ts");
var clientFloor_1 = __webpack_require__(/*! ../objects/terrain/floor/clientFloor */ "./src/objects/terrain/floor/clientFloor.ts");
var inputReader_1 = __webpack_require__(/*! ../objects/clientControllers/inputReader */ "./src/objects/clientControllers/inputReader.ts");
var clientDoodad_1 = __webpack_require__(/*! ../objects/terrain/doodads/clientDoodad */ "./src/objects/terrain/doodads/clientDoodad.ts");
var clientHammer_1 = __webpack_require__(/*! ../objects/newActors/clientActors/clientPlayer/clientClasses/clientHammer */ "./src/objects/newActors/clientActors/clientPlayer/clientClasses/clientHammer.ts");
var clientDaggers_1 = __webpack_require__(/*! ../objects/newActors/clientActors/clientPlayer/clientClasses/clientDaggers */ "./src/objects/newActors/clientActors/clientPlayer/clientClasses/clientDaggers.ts");
var particleSystem_1 = __webpack_require__(/*! ./particles/particleSystem */ "./src/client/particles/particleSystem.ts");
var Game = /** @class */ (function () {
    function Game(info, config, id, serverTalker, particleAmount) {
        var _this = this;
        this.config = config;
        this.id = id;
        this.serverTalker = serverTalker;
        this.globalClientActors = {
            actors: [],
            players: [],
            daggerPlayers: [],
            hammerPlayers: [],
            swordPlayers: [],
        };
        this.going = false;
        //public screenPos: Vector = { x: 0, y: 0 };
        this.mousePos = { x: 0, y: 0 };
        this.handleMessage = messageHandler_1.handleMessage;
        this.findActor = messageHandler_1.findActor;
        Game.particleAmount = particleAmount / 100;
        // CONSTRUCT GAME
        var actorCanvas = util_1.safeGetElementById("actorCanvas");
        var actorCtx = actorCanvas.getContext("2d");
        this.particleSystem = new particleSystem_1.ParticleSystem(actorCtx, this);
        this.globalClientObjects = {
            floor: new clientFloor_1.ClientFloor(this, info.floor.pointsAndAngles, info.floor.pointCount, info.floor.resultWidth, actorCtx),
            doodads: [],
        };
        info.doodads.forEach(function (doodad) {
            _this.globalClientObjects.doodads.push(new clientDoodad_1.ClientDoodad(doodad.position, doodad.rotation, doodad.type, actorCtx));
        });
        info.players.forEach(function (playerInfo) {
            if (playerInfo.id !== _this.id) {
                _this.newClientPlayer(playerInfo);
            }
        });
        var gamePlayerInfo = info.players.find(function (player) { return player.id === _this.id; });
        this.gamePlayer = this.makeGamePlayer(gamePlayerInfo);
        this.gamePlayerInputReader = new inputReader_1.InputReader(this.gamePlayer, this);
        this.gameRenderer = new gameRenderer_1.GameRenderer(this.config, this, this.gamePlayer);
        this.serverTalker.messageHandler = function (msg) { return _this.handleMessage(msg); };
    }
    Game.prototype.constructGame = function (info) {
        /*this.groundPlatform = new ClientGroundPlatform(info.groundPlatform);
        this.platforms = info.platforms.map((platformInfo) => new ClientPlatform(this.config, platformInfo));
        this.playerActors = info.playerActors.map(
            (playerInfo) => new ClientPlayerActor(this.config, playerInfo, this.id === playerInfo.id ? true : false, this.serverTalker),
        );*/
    };
    Game.prototype.start = function () {
        var _this = this;
        this.going = true;
        // use onkeydown and onkeyup instead of addEventListener because it's possible to add multiple event listeners per event
        // This would cause a bug where each time you press a key it creates multiple blasts or jumps
        window.onmousedown = function (e) {
            /*let globalMouse: Vector = this.getGlobalMousePos();
            let playerPos: Vector = this.gamePlayer.position;
            console.log("{x: " + (playerPos.x - globalMouse.x) + ", y: " + (playerPos.y - globalMouse.y) + "},");*/
            _this.gamePlayerInputReader.registerMouseDown(e, _this.getGlobalMousePos());
        };
        window.onmouseup = function (e) { return _this.gamePlayerInputReader.registerMouseUp(e, _this.getGlobalMousePos()); };
        window.onkeydown = function (e) { return _this.gamePlayerInputReader.registerKeyDown(e, _this.getGlobalMousePos()); };
        window.onkeyup = function (e) { return _this.gamePlayerInputReader.registerKeyUp(e, _this.getGlobalMousePos()); };
        window.onmousemove = function (e) {
            _this.mousePos.x = e.clientX;
            _this.mousePos.y = e.clientY;
        };
        window.requestAnimationFrame(function (timestamp) { return _this.loop(timestamp); });
    };
    Game.prototype.end = function () {
        this.going = false;
        this.serverTalker.leave();
        window.onmousedown = function () { };
        window.onmouseup = function () { };
        window.onkeydown = function () { };
        window.onkeyup = function () { };
        window.onmousemove = function () { };
    };
    Game.prototype.loop = function (timestamp) {
        var _this = this;
        if (!this.lastFrame) {
            this.lastFrame = timestamp;
        }
        var elapsedTime = (timestamp - this.lastFrame) / 1000;
        this.lastFrame = timestamp;
        this.update(elapsedTime * this.config.gameSpeed);
        if (this.going) {
            window.requestAnimationFrame(function (timestamp) { return _this.loop(timestamp); });
        }
    };
    Game.prototype.update = function (elapsedTime) {
        this.gamePlayerInputReader.update(elapsedTime);
        this.updateObjects(elapsedTime);
        this.gameRenderer.updateAndRender(elapsedTime);
    };
    Game.prototype.updateObjects = function (elapsedTime) {
        this.globalClientActors.players.forEach(function (player) { return player.update(elapsedTime); });
    };
    Game.prototype.newClientPlayer = function (playerInfo) {
        var newPlayer;
        switch (playerInfo["class"]) {
            case "daggers":
                newPlayer = new clientDaggers_1.ClientDaggers(this, playerInfo);
                this.globalClientActors.daggerPlayers.push(newPlayer);
                break;
            case "hammer":
                newPlayer = new clientHammer_1.ClientHammer(this, playerInfo);
                this.globalClientActors.hammerPlayers.push(newPlayer);
                break;
            case "sword":
                newPlayer = new clientSword_1.ClientSword(this, playerInfo);
                this.globalClientActors.swordPlayers.push(newPlayer);
                break;
            default:
                throw new Error("unknown class type " + playerInfo["class"]);
        }
        this.globalClientActors.players.push(newPlayer);
        this.globalClientActors.actors.push(newPlayer);
    };
    Game.prototype.makeGamePlayer = function (playerInfo) {
        var newGamePlayer;
        switch (playerInfo["class"]) {
            case "daggers":
                newGamePlayer = new clientDaggers_1.ClientDaggers(this, playerInfo);
                this.globalClientActors.daggerPlayers.push(newGamePlayer);
                break;
            case "hammer":
                newGamePlayer = new clientHammer_1.ClientHammer(this, playerInfo);
                this.globalClientActors.hammerPlayers.push(newGamePlayer);
                break;
            case "sword":
                newGamePlayer = new clientSword_1.ClientSword(this, playerInfo);
                this.globalClientActors.swordPlayers.push(newGamePlayer);
                break;
            default:
                throw new Error("unknown class type " + playerInfo["class"]);
        }
        this.globalClientActors.players.push(newGamePlayer);
        this.globalClientActors.actors.push(newGamePlayer);
        return newGamePlayer;
    };
    Game.prototype.playerLeave = function (id) {
        var player = this.globalClientActors.players.find(function (player) { return player.getActorId() === id; });
        switch (player.getClassType()) {
            case "daggers":
                this.globalClientActors.daggerPlayers = this.globalClientActors.daggerPlayers.filter(function (player) { return player.getActorId() !== id; });
                break;
            case "sword":
                this.globalClientActors.swordPlayers = this.globalClientActors.swordPlayers.filter(function (player) { return player.getActorId() !== id; });
                break;
            case "hammer":
                this.globalClientActors.hammerPlayers = this.globalClientActors.hammerPlayers.filter(function (player) { return player.getActorId() !== id; });
                break;
            default:
                throw new Error("unknown class type in playerLeave");
        }
        this.globalClientActors.players = this.globalClientActors.players.filter(function (player) { return player.getActorId() !== id; });
        this.globalClientActors.actors = this.globalClientActors.actors.filter(function (actor) { return actor.getActorId() !== id; });
    };
    Game.prototype.getMouseShape = function () {
        /*
        let p1: Vector = { x: this.mousePos.x + this.screenPos.x, y: this.mousePos.y - 40 + this.screenPos.y };
        let p2: Vector = { x: this.mousePos.x - 30 + this.screenPos.x, y: this.mousePos.y + 20 + this.screenPos.y };
        let p3: Vector = { x: this.mousePos.x + 30 + this.screenPos.x, y: this.mousePos.y + 20 + this.screenPos.y };
        return {
            center: { x: this.mousePos.x + this.screenPos.x, y: this.mousePos.y + this.screenPos.y },
            points: [p1, p2, p3],
            edges: [
                { p1, p2 },
                { p1: p2, p2: p3 },
                { p1: p3, p2: p1 },
            ],
        };*/
        throw new Error("getMouseShape currently not adjusted for screen center");
    };
    Game.prototype.getGlobalMousePos = function () {
        return this.gameRenderer.getCanvasPosFromScreen(this.mousePos);
    };
    Game.prototype.getGlobalObjects = function () {
        return this.globalClientObjects;
    };
    Game.prototype.getGlobalActors = function () {
        return this.globalClientActors;
    };
    Game.prototype.getActorCtx = function () {
        return util_1.safeGetElementById("actorCanvas").getContext("2d");
    };
    Game.prototype.getActorSide = function (team) {
        if (team === this.id)
            return "self";
        else
            return "enemy";
    };
    Game.prototype.getId = function () {
        return this.id;
    };
    Game.menuDiv = util_1.safeGetElementById("menuDiv");
    Game.gameDiv = util_1.safeGetElementById("gameDiv");
    return Game;
}());
exports.Game = Game;


/***/ }),

/***/ "./src/client/gameRender/assetmanager.ts":
/*!***********************************************!*\
  !*** ./src/client/gameRender/assetmanager.ts ***!
  \***********************************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: top-level-this-exports, __webpack_exports__, __webpack_require__ */
/*! CommonJS bailout: this is used directly at 2:17-21 */
/*! CommonJS bailout: this is used directly at 11:19-23 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.assetManager = exports.imageInformation = void 0;
var servertalker_1 = __webpack_require__(/*! ../servertalker */ "./src/client/servertalker.ts");
//let img: HTMLImageElement = assetManager.images["lavafly"];
exports.imageInformation = {
    rockLarge: "https://" + servertalker_1.ServerTalker.hostName + "/images/rockDoodad.png",
    slashIcon: "https://" + servertalker_1.ServerTalker.hostName + "/images/abilityIcons/slashIcon.png",
    emptyIcon: "https://" + servertalker_1.ServerTalker.hostName + "/images/abilityIcons/emptyIcon.png",
    whirlwindIcon: "https://" + servertalker_1.ServerTalker.hostName + "/images/abilityIcons/whirlwindIcon.png",
    lvl10: "https://" + servertalker_1.ServerTalker.hostName + "/images/abilityIcons/lvl10.png",
    lvl6: "https://" + servertalker_1.ServerTalker.hostName + "/images/abilityIcons/lvl6.png",
    stabIcon: "https://" + servertalker_1.ServerTalker.hostName + "/images/abilityIcons/stabIcon.png",
    lungeIcon: "https://" + servertalker_1.ServerTalker.hostName + "/images/abilityIcons/lungeIcon.png",
    swingIcon: "https://" + servertalker_1.ServerTalker.hostName + "/images/abilityIcons/swingIcon.png",
    poundIcon: "https://" + servertalker_1.ServerTalker.hostName + "/images/abilityIcons/poundIcon.png",
    sword11: "https://" + servertalker_1.ServerTalker.hostName + "/images/weaponImages/sword11.png",
    sword21: "https://" + servertalker_1.ServerTalker.hostName + "/images/weaponImages/sword21.png",
    sword31: "https://" + servertalker_1.ServerTalker.hostName + "/images/weaponImages/sword31.png",
    hammer11: "https://" + servertalker_1.ServerTalker.hostName + "/images/weaponImages/hammer11.png",
    hammer21: "https://" + servertalker_1.ServerTalker.hostName + "/images/weaponImages/hammer21.png",
    dagger11: "https://" + servertalker_1.ServerTalker.hostName + "/images/weaponImages/dagger11.png",
    dagger21: "https://" + servertalker_1.ServerTalker.hostName + "/images/weaponImages/dagger21.png",
    slashEffectTest2: "https://" + servertalker_1.ServerTalker.hostName + "/images/effectImages/slashEffectTest2.png",
    whirlwindEffectBase: "https://" + servertalker_1.ServerTalker.hostName + "/images/effectImages/whirlwindEffectBase.png",
    whirlwindEffectTop: "https://" + servertalker_1.ServerTalker.hostName + "/images/effectImages/whirlwindEffectTop.png",
};
var AssetManager = /** @class */ (function () {
    // public sounds: Record<string, HTMLImageElement>;
    function AssetManager() {
        this.images = {};
    }
    AssetManager.prototype.loadAllNecessaryImages = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.all(Object.keys(exports.imageInformation).map(function (imageName) { return _this.addImage(imageName, exports.imageInformation[imageName]); }))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AssetManager.prototype.addImage = function (name, source) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var xhr = new XMLHttpRequest();
                        xhr.open("GET", source, true);
                        xhr.responseType = "blob";
                        xhr.onload = function () {
                            if (xhr.status === 200) {
                                var asset_1 = new Image();
                                asset_1.onload = function () {
                                    window.URL.revokeObjectURL(asset_1.src);
                                };
                                asset_1.src = window.URL.createObjectURL(xhr.response);
                                _this.images[name] = asset_1;
                                resolve();
                            }
                            else {
                                reject("Asset " + name + " rejected with error code " + xhr.status);
                            }
                        };
                        xhr.onerror = function (error) {
                            reject(error);
                        };
                        xhr.send();
                    })];
            });
        });
    };
    return AssetManager;
}());
exports.assetManager = new AssetManager();


/***/ }),

/***/ "./src/client/gameRender/gameRenderer.ts":
/*!***********************************************!*\
  !*** ./src/client/gameRender/gameRenderer.ts ***!
  \***********************************************/
/*! flagged exports */
/*! export GameRenderer [provided] [no usage info] [missing usage info prevents renaming] */
/*! export __esModule [provided] [no usage info] [missing usage info prevents renaming] */
/*! export roundRect [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__, __webpack_require__ */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


exports.__esModule = true;
exports.roundRect = exports.GameRenderer = void 0;
var util_1 = __webpack_require__(/*! ../util */ "./src/client/util.ts");
var GameRenderer = /** @class */ (function () {
    function GameRenderer(config, game, gamePlayer) {
        this.config = config;
        this.game = game;
        this.gamePlayer = gamePlayer;
        this.canvasDiv = util_1.safeGetElementById("canvasDiv");
        //private readonly moon = safeGetElementById("moon");
        this.actorCanvas = util_1.safeGetElementById("actorCanvas");
        this.actorCtx = this.actorCanvas.getContext("2d");
        //protected screenPos: Vector;
        this.previousWindowSize = { width: 0, height: 0 };
        this.targetZoom = 1;
        this.currentZoom = 1;
        this.zoomDelay = 5;
        this.currentScreenPos = { x: 0, y: 0 };
        this.currentScreenSize = { width: 0, height: 0 };
        this.currentScreenRatio = 1;
        this.attemptUpdateCanvasSizes();
        this.targetScreenCenter = this.gamePlayer.position;
        this.currentScreenCenter = { x: this.targetScreenCenter.x + 0, y: this.targetScreenCenter.y + 0 };
        this.globalClientActors = this.game.getGlobalActors();
        this.globalClientObjects = this.game.getGlobalObjects();
        this.id = this.game.getId();
    }
    GameRenderer.prototype.updateAndRender = function (elapsedTime) {
        this.updateZoom(elapsedTime);
        this.attemptUpdateCanvasSizes();
        this.updateSliderX();
        this.updateSliderY();
        this.setCanvasTransform(true);
        this.clipXPan();
        this.renderActors(elapsedTime);
    };
    GameRenderer.prototype.updateZoom = function (elapsedTime) {
        if (this.targetZoom !== 1) {
            if (this.targetZoom > 1) {
                this.targetZoom /= 1 + elapsedTime;
                if (this.targetZoom < 1) {
                    this.targetZoom = 1;
                }
            }
            else if (this.targetZoom < 1) {
                this.targetZoom *= 1 + elapsedTime;
                if (this.targetZoom > 1) {
                    this.targetZoom = 1;
                }
            }
        }
        if (this.currentZoom != this.targetZoom) {
            this.currentZoom = (this.currentZoom * (this.zoomDelay - 1) + this.targetZoom) / this.zoomDelay;
            if (this.currentZoom + 0.0001 > this.targetZoom && this.currentZoom - 0.0001 < this.targetZoom) {
                this.currentZoom = this.targetZoom + 0;
                this.zoomDelay = 5;
            }
        }
    };
    GameRenderer.prototype.setCanvasTransform = function (erase) {
        this.actorCtx.setTransform(this.currentZoom, 0, 0, this.currentZoom, (-this.currentScreenCenter.x + this.previousWindowSize.width / this.currentZoom / 2) * this.currentZoom, (-this.currentScreenCenter.y + this.previousWindowSize.height / this.currentZoom / 2) * this.currentZoom);
        if (erase) {
            this.actorCtx.clearRect(this.currentScreenCenter.x - this.previousWindowSize.width / this.currentZoom / 2, this.currentScreenCenter.y - this.previousWindowSize.height / this.currentZoom / 2, this.previousWindowSize.width / this.currentZoom, this.previousWindowSize.height / this.currentZoom);
        }
        this.currentScreenSize = { width: this.previousWindowSize.width / this.currentZoom, height: this.previousWindowSize.height / this.currentZoom };
        this.currentScreenPos = {
            x: this.currentScreenCenter.x - this.currentScreenSize.width / 2,
            y: this.currentScreenCenter.y - this.currentScreenSize.height / 2,
        };
    };
    GameRenderer.prototype.renderActors = function (elapsedTime) {
        var _this = this;
        this.globalClientObjects.doodads.forEach(function (doodad) {
            if (doodad.ifShouldRender(_this.currentScreenSize, _this.currentScreenPos)) {
                doodad.render();
            }
        });
        this.globalClientObjects.floor.render(this.currentScreenPos, this.currentScreenSize);
        this.globalClientActors.players.forEach(function (player) {
            if (player.getActorId() !== _this.id)
                player.render();
        });
        this.gamePlayer.render();
        this.globalClientActors.players.forEach(function (player) {
            if (player.getActorId() !== _this.id)
                player.renderHealth();
        });
        this.gamePlayer.renderHealth();
        this.game.particleSystem.updateAndRender(elapsedTime);
    };
    GameRenderer.prototype.updateSliderX = function () {
        this.currentScreenCenter.x = (this.currentScreenCenter.x * 4 + this.targetScreenCenter.x) / 5;
    };
    GameRenderer.prototype.clipXPan = function () {
        if (this.currentScreenPos.x + this.currentScreenSize.width > this.config.xSize) {
            this.currentScreenCenter.x += this.config.xSize - this.currentScreenPos.x - this.currentScreenSize.width;
            this.setCanvasTransform(false);
        }
        if (this.currentScreenPos.x < 0) {
            this.currentScreenCenter.x -= this.currentScreenPos.x;
            this.setCanvasTransform(false);
        }
    };
    GameRenderer.prototype.updateSliderY = function () {
        this.currentScreenCenter.y = (this.currentScreenCenter.y * 4 + (this.targetScreenCenter.y - this.previousWindowSize.height / 10)) / 5;
    };
    GameRenderer.prototype.attemptUpdateCanvasSizes = function () {
        if (Math.min(window.innerWidth, 1920) !== this.previousWindowSize.width) {
            this.previousWindowSize.width = Math.min(window.innerWidth, 1920);
            this.updateCanvasWidth(this.actorCanvas);
        }
        if (window.innerHeight !== this.previousWindowSize.height) {
            var ratio = window.innerWidth / 1920;
            if (ratio >= 1) {
                this.currentScreenRatio = ratio;
                this.previousWindowSize.height = window.innerHeight / ratio;
            }
            else {
                this.currentScreenRatio = 1;
                this.previousWindowSize.height = window.innerHeight;
            }
            this.updateCanvasHeight(this.actorCanvas);
        }
    };
    GameRenderer.prototype.updateCanvasWidth = function (canvas) {
        canvas.style.width = "100vw";
        canvas.width = this.previousWindowSize.width;
    };
    GameRenderer.prototype.updateCanvasHeight = function (canvas) {
        canvas.style.height = "100vh";
        canvas.height = this.previousWindowSize.height;
    };
    GameRenderer.prototype.screenNudge = function (force) {
        this.currentScreenCenter.x -= force.x;
        this.currentScreenCenter.y -= force.y;
    };
    GameRenderer.prototype.screenZoom = function (multiplier, speed) {
        if (speed === void 0) { speed = 4; }
        this.targetZoom *= multiplier;
        this.zoomDelay = speed;
    };
    GameRenderer.prototype.getCanvasPosFromScreen = function (position) {
        if (this.currentScreenRatio === 1) {
            return {
                x: position.x / this.currentZoom + this.currentScreenPos.x,
                y: position.y / this.currentZoom + this.currentScreenPos.y,
            };
        }
        else {
            return {
                x: position.x / (this.currentZoom * this.currentScreenRatio) + this.currentScreenPos.x,
                y: position.y / (this.currentZoom * this.currentScreenRatio) + this.currentScreenPos.y,
            };
        }
    };
    return GameRenderer;
}());
exports.GameRenderer = GameRenderer;
function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    if (fill) {
        ctx.fill();
    }
    if (stroke) {
        ctx.stroke();
    }
}
exports.roundRect = roundRect;


/***/ }),

/***/ "./src/client/index.ts":
/*!*****************************!*\
  !*** ./src/client/index.ts ***!
  \*****************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: top-level-this-exports, __webpack_exports__, __webpack_require__ */
/*! CommonJS bailout: this is used directly at 2:17-21 */
/*! CommonJS bailout: this is used directly at 11:19-23 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var game_1 = __webpack_require__(/*! ./game */ "./src/client/game.ts");
var comments_1 = __webpack_require__(/*! ./mainMenu/comments */ "./src/client/mainMenu/comments.ts");
var settings_1 = __webpack_require__(/*! ./mainMenu/settings */ "./src/client/mainMenu/settings.ts");
var servertalker_1 = __webpack_require__(/*! ./servertalker */ "./src/client/servertalker.ts");
var util_1 = __webpack_require__(/*! ./util */ "./src/client/util.ts");
/*const particleSlider = safeGetElementById("particles");
const particleAmount = safeGetElementById("particleAmount");

particleSlider.oninput = function () {
    particleAmount.innerHTML = (particleSlider as HTMLInputElement).value + "%";
};*/
var classInfo = {
    sword: { level: 1, spec: 0 },
    daggers: { level: 1, spec: 0 },
    hammer: { level: 1, spec: 0 },
};
var classType = "sword";
var team = 1;
util_1.safeGetElementById("teamMenu").onclick = function () { return toggleTeam(); };
var value = localStorage.getItem("name");
if (value)
    util_1.safeGetElementById("name").value = value;
var value = localStorage.getItem("color");
if (value)
    util_1.safeGetElementById("color").value = value;
var value = localStorage.getItem("team");
if (value && parseInt(value) === 2)
    toggleTeam();
var value = localStorage.getItem("classType");
if (value) {
    if (value === "daggers")
        changeClass("daggers");
    else if (value === "hammer")
        changeClass("hammer");
    else
        changeClass("sword");
}
updateClassLevels();
function updateClassLevels() {
    value = localStorage.getItem("swordLevel");
    if (value)
        classInfo.sword.level = parseInt(value);
    value = localStorage.getItem("swordSpec");
    if (value)
        classInfo.sword.spec = parseInt(value);
    value = localStorage.getItem("daggersLevel");
    if (value)
        classInfo.daggers.level = parseInt(value);
    value = localStorage.getItem("daggersSpec");
    if (value)
        classInfo.daggers.spec = parseInt(value);
    value = localStorage.getItem("hammerLevel");
    if (value)
        classInfo.hammer.level = parseInt(value);
    value = localStorage.getItem("hammerSpec");
    if (value)
        classInfo.hammer.spec = parseInt(value);
    util_1.safeGetElementById("swordClassLevel").innerHTML = String(classInfo.sword.level);
    util_1.safeGetElementById("daggersClassLevel").innerHTML = String(classInfo.daggers.level);
    util_1.safeGetElementById("hammerClassLevel").innerHTML = String(classInfo.hammer.level);
}
var ifImagesHaveBeenLoaded = false;
util_1.safeGetElementById("startGame").onmouseup = function () { return __awaiter(void 0, void 0, void 0, function () {
    var name, level, spec, serverTalker, _a, id, info, config, game;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                hideMenuElements();
                saveLocalData();
                name = util_1.safeGetElementById("name").value;
                if (name === "" || name.split(" ").join("") === "")
                    name = "Player";
                switch (classType) {
                    case "daggers":
                        level = classInfo.daggers.level;
                        spec = classInfo.daggers.spec;
                        break;
                    case "hammer":
                        level = classInfo.hammer.level;
                        spec = classInfo.hammer.spec;
                        break;
                    default:
                        level = classInfo.sword.level;
                        spec = classInfo.sword.spec;
                }
                serverTalker = new servertalker_1.ServerTalker({
                    name: name,
                    color: util_1.safeGetElementById("color").value,
                    team: team,
                    "class": classType,
                    classLevel: level,
                    classSpec: spec,
                });
                return [4 /*yield*/, serverTalker.serverTalkerReady];
            case 1:
                _a = _b.sent(), id = _a.id, info = _a.info, config = _a.config;
                game = new game_1.Game(info, config, id, serverTalker, 50);
                game.start();
                //document.documentElement.requestFullscreen();
                gameDiv.style.display = "block";
                util_1.safeGetElementById("end").onclick = function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        game.end();
                        gameDiv.style.display = "none";
                        updateClassLevels();
                        //document.exitFullscreen();
                        showMenuElements();
                        return [2 /*return*/];
                    });
                }); };
                return [2 /*return*/];
        }
    });
}); };
var menuDiv = util_1.safeGetElementById("menuDiv");
var optionsDiv = util_1.safeGetElementById("optionsDiv");
var gameDiv = util_1.safeGetElementById("gameDiv");
gameDiv.style.display = "none";
function hideMenuElements() {
    menuDiv.style.display = "none";
    optionsDiv.style.display = "none";
    //gameDiv.style.display = "block"; included in startgame button
}
function showMenuElements() {
    //gameDiv.style.display = "none"; included in startgame button
    menuDiv.style.display = "flex";
    optionsDiv.style.display = "flex";
}
function toggleTeam() {
    if (team === 1) {
        util_1.safeGetElementById("team1").classList.remove("selectedTeam");
        util_1.safeGetElementById("team2").classList.add("selectedTeam");
        team = 2;
    }
    else if (team === 2) {
        util_1.safeGetElementById("team1").classList.add("selectedTeam");
        util_1.safeGetElementById("team2").classList.remove("selectedTeam");
        team = 1;
    }
}
util_1.safeGetElementById("sword").onclick = function () { return changeClass("sword"); };
util_1.safeGetElementById("daggers").onclick = function () { return changeClass("daggers"); };
util_1.safeGetElementById("hammer").onclick = function () { return changeClass("hammer"); };
function changeClass(classArg) {
    util_1.safeGetElementById("sword").classList.remove("selected");
    util_1.safeGetElementById("daggers").classList.remove("selected");
    util_1.safeGetElementById("hammer").classList.remove("selected");
    util_1.safeGetElementById(classArg).classList.add("selected");
    classType = classArg;
}
function saveLocalData() {
    var locallyStoredName = util_1.safeGetElementById("name").value;
    localStorage.setItem("name", locallyStoredName);
    var locallyStoredTeam = team;
    localStorage.setItem("team", String(locallyStoredTeam));
    var locallyStoredColor = util_1.safeGetElementById("color").value;
    localStorage.setItem("color", locallyStoredColor);
    /*let locallyStoredParticles: string = (safeGetElementById("id") as HTMLInputElement).value;
                        localStorage.setItem("particles", field.value);*/
    var locallyStoredClass;
    if (classType === "sword")
        locallyStoredClass = "sword";
    else if (classType === "daggers")
        locallyStoredClass = "daggers";
    else if (classType === "hammer")
        locallyStoredClass = "hammer";
    else
        throw new Error("unknown class type input ${classType}");
    localStorage.setItem("classType", locallyStoredClass);
}
/*clearStorageButton.onclick = () => {
    localStorage.clear();
};*/
var screenCover = util_1.safeGetElementById("screenCover");
settings_1.initSettingsButton(screenCover);
comments_1.initComments(screenCover);
var informationDiv = util_1.safeGetElementById("informationDiv");
var infoOption = util_1.safeGetElementById("infoOption");
util_1.safeGetElementById("informationButton").onclick = function () {
    infoOption.classList.add("selected");
    informationDiv.style.display = "flex";
    screenCover.style.display = "block";
    screenCover.addEventListener("click", closeInfoDiv);
    function closeInfoDiv() {
        screenCover.removeEventListener("click", closeInfoDiv);
        informationDiv.style.display = "none";
        screenCover.style.display = "none";
        infoOption.classList.remove("selected");
    }
};
var patchNotesDiv = util_1.safeGetElementById("patchNotesDiv");
var patchNotesOption = util_1.safeGetElementById("patchNotesOption");
util_1.fillPatchNotesDiv(patchNotesDiv);
util_1.safeGetElementById("patchNotesButton").onclick = function () {
    patchNotesOption.classList.add("selected");
    patchNotesDiv.style.display = "flex";
    screenCover.style.display = "block";
    screenCover.addEventListener("click", closePatchNotesDiv);
    function closePatchNotesDiv() {
        screenCover.removeEventListener("click", closePatchNotesDiv);
        patchNotesDiv.style.display = "none";
        screenCover.style.display = "none";
        patchNotesOption.classList.remove("selected");
    }
};
var tipsButtonToggled = false;
util_1.safeGetElementById("toggleTipsButton").onclick = function () { };


/***/ }),

/***/ "./src/client/mainMenu/comments.ts":
/*!*****************************************!*\
  !*** ./src/client/mainMenu/comments.ts ***!
  \*****************************************/
/*! flagged exports */
/*! export __esModule [provided] [no usage info] [missing usage info prevents renaming] */
/*! export initComments [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__, __webpack_require__ */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


exports.__esModule = true;
exports.initComments = void 0;
var util_1 = __webpack_require__(/*! ../util */ "./src/client/util.ts");
function initComments(screenCover) {
    var commentDiv = util_1.safeGetElementById("commentDiv");
    var emailOption = util_1.safeGetElementById("emailOption");
    util_1.safeGetElementById("commentButton").onclick = function () {
        emailOption.classList.add("selected");
        commentDiv.style.display = "flex";
        screenCover.style.display = "block";
        screenCover.addEventListener("click", closeCommentDiv);
        function closeCommentDiv() {
            screenCover.removeEventListener("click", closeCommentDiv);
            commentDiv.style.display = "none";
            screenCover.style.display = "none";
            emailOption.classList.remove("selected");
        }
    };
}
exports.initComments = initComments;


/***/ }),

/***/ "./src/client/mainMenu/settings.ts":
/*!*****************************************!*\
  !*** ./src/client/mainMenu/settings.ts ***!
  \*****************************************/
/*! flagged exports */
/*! export __esModule [provided] [no usage info] [missing usage info prevents renaming] */
/*! export getSettingsConfig [provided] [no usage info] [missing usage info prevents renaming] */
/*! export initSettingsButton [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__, __webpack_require__ */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


exports.__esModule = true;
exports.getSettingsConfig = exports.initSettingsButton = void 0;
var util_1 = __webpack_require__(/*! ../util */ "./src/client/util.ts");
function initSettingsButton(screenCover) {
    var settingsDiv = util_1.safeGetElementById("settingsDiv");
    var settingsOption = util_1.safeGetElementById("settingsOption");
    util_1.safeGetElementById("settingsButton").onclick = function () {
        settingsOption.classList.add("selected");
        settingsDiv.style.display = "flex";
        screenCover.style.display = "block";
        screenCover.addEventListener("click", closeOptionsDiv);
        function closeOptionsDiv() {
            screenCover.removeEventListener("click", closeOptionsDiv);
            settingsDiv.style.display = "none";
            screenCover.style.display = "none";
            settingsOption.classList.remove("selected");
        }
    };
}
exports.initSettingsButton = initSettingsButton;
function getSettingsConfig() {
    var particlePercent = Math.min(100, Math.max(0, util_1.safeGetElementById("particleSlider").valueAsNumber));
    var followPercent = Math.min(100, Math.max(0, util_1.safeGetElementById("screenDelay").valueAsNumber));
    var renderEffects = util_1.safeGetElementById("effectsToggle").checked;
    var cameraShake = util_1.safeGetElementById("cameraEffectsToggle").checked;
    return {
        renderEffects: renderEffects,
        cameraShake: cameraShake,
        particlePercent: particlePercent,
        followPercent: followPercent,
    };
}
exports.getSettingsConfig = getSettingsConfig;


/***/ }),

/***/ "./src/client/messageHandler.ts":
/*!**************************************!*\
  !*** ./src/client/messageHandler.ts ***!
  \**************************************/
/*! flagged exports */
/*! export __esModule [provided] [no usage info] [missing usage info prevents renaming] */
/*! export findActor [provided] [no usage info] [missing usage info prevents renaming] */
/*! export handleMessage [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__ */
/***/ ((__unused_webpack_module, exports) => {


exports.__esModule = true;
exports.findActor = exports.handleMessage = void 0;
function handleMessage(msg) {
    var player;
    switch (msg.type) {
        case "serverDebugMessage":
            break;
        case "serverPlayerAction":
            if (msg.playerId === this.id)
                return;
            player = this.globalClientActors.players.find(function (player) { return player.getActorId() === msg.playerId; });
            if (player) {
                player.updatePositionAndMomentumFromServer(msg.position, msg.momentum);
                player.moveActionsNextFrame[msg.actionType] = msg.starting;
            }
            break;
        case "info":
            this.constructGame(msg.info);
            break;
        case "playerLeave":
            this.playerLeave(msg.id);
            break;
        case "playerJoin":
            this.newClientPlayer(msg.playerInfo);
            break;
        case "playerAllowChooseSpec":
        //open window
        case "playerChangeSpec":
            //player set level
            //
            break;
        case "playerLevelSet":
            //players set level
            //particles
            //this.controller.setRequiredXP
            break;
        case "playerSetXP":
            //this.controller.setXP
            break;
        case "serverHealMessage":
            var healedActor = this.findActor(msg.actorId, msg.actorType);
            this.particleSystem.addSparks(healedActor.position);
            healedActor.registerHeal(msg.newHealth);
            break;
        case "serverDamageMessage":
            var damagedActor = this.findActor(msg.actorId, msg.actorType);
            var damageOriginActor = this.findActor(msg.originId, msg.originType);
            damagedActor.registerDamage(damageOriginActor, msg.newHealth, msg.knockback, msg.translationData);
            damagedActor.updatePositionAndMomentumFromServer(msg.position, msg.momentum);
            break;
        case "playerChangeFacing":
            if (msg.id === this.id)
                return;
            player = this.globalClientActors.players.find(function (player) { return player.getActorId() === msg.id; });
            if (player) {
                player.updateFacingFromServer(msg.facingRight);
            }
            break;
        case "serverStartTranslation":
            var actor = this.globalClientActors.actors.find(function (actor) { return actor.getActorId() === msg.actorId; });
            if (actor) {
                actor.updatePositionAndMomentumFromServer(msg.position, msg.momentum);
                actor.startTranslation(msg.angle, msg.translationName);
            }
            break;
        case "serverSwordMessage":
            if (msg.originId === this.id)
                return;
            var swordPlayer = this.globalClientActors.swordPlayers.find(function (player) { return player.getActorId() === msg.originId; });
            if (swordPlayer) {
                swordPlayer.updatePositionAndMomentumFromServer(msg.position, msg.momentum);
                if (msg.msg.starting)
                    swordPlayer.performClientAbility[msg.msg.ability](msg.msg.mousePos);
                else
                    swordPlayer.releaseClientAbility[msg.msg.ability]();
            }
            break;
        case "serverDaggersMessage":
            if (msg.originId === this.id)
                return;
            var daggersPlayer = this.globalClientActors.daggerPlayers.find(function (player) { return player.getActorId() === msg.originId; });
            if (daggersPlayer) {
                daggersPlayer.updatePositionAndMomentumFromServer(msg.position, msg.momentum);
                if (msg.msg.starting)
                    daggersPlayer.performClientAbility[msg.msg.ability](msg.msg.mousePos);
                else
                    daggersPlayer.releaseClientAbility[msg.msg.ability]();
            }
            break;
        case "serverHammerMessage":
            if (msg.originId === this.id)
                return;
            var hammerPlayer = this.globalClientActors.hammerPlayers.find(function (player) { return player.getActorId() === msg.originId; });
            if (hammerPlayer) {
                hammerPlayer.updatePositionAndMomentumFromServer(msg.position, msg.momentum);
                if (msg.msg.starting)
                    hammerPlayer.performClientAbility[msg.msg.ability](msg.msg.mousePos);
                else
                    hammerPlayer.releaseClientAbility[msg.msg.ability]();
            }
            break;
        default:
            throw new Error("Unrecognized message from server");
    }
}
exports.handleMessage = handleMessage;
function findActor(actorId, actorType) {
    switch (actorType) {
        case "daggersPlayer":
            var daggerPlayer = this.globalClientActors.daggerPlayers.find(function (player) { return player.getActorId() === actorId; });
            if (daggerPlayer)
                return daggerPlayer;
            break;
        case "swordPlayer":
            var swordPlayer = this.globalClientActors.swordPlayers.find(function (player) { return player.getActorId() === actorId; });
            if (swordPlayer)
                return swordPlayer;
            break;
        case "hammerPlayer":
            var hammerPlayer = this.globalClientActors.hammerPlayers.find(function (player) { return player.getActorId() === actorId; });
            if (hammerPlayer)
                return hammerPlayer;
            break;
        default:
            throw new Error("Unknown actor type in messageHandler's findActor");
    }
    throw new Error("Actor " + actorId + " " + actorType + " not found in messageHandler's findActor");
}
exports.findActor = findActor;


/***/ }),

/***/ "./src/client/particles/particleClasses/dummySlashEffect2.ts":
/*!*******************************************************************!*\
  !*** ./src/client/particles/particleClasses/dummySlashEffect2.ts ***!
  \*******************************************************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: top-level-this-exports, __webpack_exports__, __webpack_require__ */
/*! CommonJS bailout: this is used directly at 2:17-21 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.DummySlashEffect2 = void 0;
var assetmanager_1 = __webpack_require__(/*! ../../gameRender/assetmanager */ "./src/client/gameRender/assetmanager.ts");
var particleBaseClass_1 = __webpack_require__(/*! ./particleBaseClass */ "./src/client/particles/particleClasses/particleBaseClass.ts");
var DummySlashEffect2 = /** @class */ (function (_super) {
    __extends(DummySlashEffect2, _super);
    function DummySlashEffect2(ctx, position, angle, flipX) {
        var _this = _super.call(this, ctx, position, 0.04) || this;
        _this.angle = angle;
        _this.flipX = flipX;
        _this.scale = 0.5;
        _this.slashImage = assetmanager_1.assetManager.images["slashEffectTest2"];
        return _this;
    }
    DummySlashEffect2.prototype.render = function () {
        this.ctx.globalAlpha = this.currentLife / 0.04;
        this.ctx.translate(this.position.x, this.position.y);
        if (this.flipX)
            this.ctx.scale(this.scale, this.scale);
        else
            this.ctx.scale(-this.scale, this.scale);
        this.ctx.rotate(this.angle);
        this.ctx.translate(-120, -190);
        this.ctx.drawImage(this.slashImage, 0, 0);
        this.ctx.translate(120, +190);
        this.ctx.rotate(-this.angle);
        if (this.flipX)
            this.ctx.scale(1 / this.scale, 1 / this.scale);
        else
            this.ctx.scale(-1 / this.scale, 1 / this.scale);
        this.ctx.translate(-this.position.x, -this.position.y);
        this.ctx.globalAlpha = 1;
    };
    return DummySlashEffect2;
}(particleBaseClass_1.ParticleBase));
exports.DummySlashEffect2 = DummySlashEffect2;


/***/ }),

/***/ "./src/client/particles/particleClasses/dummyWhirlwindEffect.ts":
/*!**********************************************************************!*\
  !*** ./src/client/particles/particleClasses/dummyWhirlwindEffect.ts ***!
  \**********************************************************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: top-level-this-exports, __webpack_exports__, __webpack_require__ */
/*! CommonJS bailout: this is used directly at 2:17-21 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.DummyWhirlwindEffect = void 0;
var assetmanager_1 = __webpack_require__(/*! ../../gameRender/assetmanager */ "./src/client/gameRender/assetmanager.ts");
var particleBaseClass_1 = __webpack_require__(/*! ./particleBaseClass */ "./src/client/particles/particleClasses/particleBaseClass.ts");
var DummyWhirlwindEffect = /** @class */ (function (_super) {
    __extends(DummyWhirlwindEffect, _super);
    function DummyWhirlwindEffect(ctx, position, flipX) {
        var _this = _super.call(this, ctx, position, 5) || this;
        _this.flipX = flipX;
        _this.scale = 0.7;
        _this.baseImage = assetmanager_1.assetManager.images["whirlwindEffectBase"];
        _this.topImage = assetmanager_1.assetManager.images["whirlwindEffectTop"];
        _this.topRotation = 0;
        _this.baseRotation = 0;
        _this.alpha = 0;
        _this.ending = false;
        return _this;
    }
    DummyWhirlwindEffect.prototype.updateAndRender = function (elapsedTime) {
        this.topRotation += elapsedTime * 45;
        this.baseRotation += elapsedTime * 10;
        if (this.ending) {
            this.alpha -= elapsedTime * 10;
            if (this.alpha <= 0) {
                this.ifDead = true;
                this.alpha = 0;
            }
        }
        else {
            if (this.alpha < 1) {
                this.alpha += elapsedTime * 5;
            }
        }
        _super.prototype.updateAndRender.call(this, elapsedTime);
    };
    DummyWhirlwindEffect.prototype.render = function () {
        this.ctx.globalAlpha = this.alpha;
        this.ctx.translate(this.position.x, this.position.y);
        if (this.flipX)
            this.ctx.scale(this.scale, this.scale);
        else
            this.ctx.scale(-this.scale, this.scale);
        this.ctx.rotate(this.baseRotation);
        this.ctx.translate(-300, -300);
        this.ctx.drawImage(this.baseImage, 0, 0);
        this.ctx.translate(300, +300);
        this.ctx.rotate(-this.baseRotation);
        this.ctx.rotate(this.topRotation);
        this.ctx.translate(-300, -300);
        this.ctx.drawImage(this.topImage, 0, 0);
        this.ctx.translate(300, +300);
        this.ctx.rotate(-this.topRotation);
        if (this.flipX)
            this.ctx.scale(1 / this.scale, 1 / this.scale);
        else
            this.ctx.scale(-1 / this.scale, 1 / this.scale);
        this.ctx.translate(-this.position.x, -this.position.y);
        this.ctx.globalAlpha = 1;
    };
    DummyWhirlwindEffect.prototype.prematureEnd = function () {
        this.ending = true;
    };
    return DummyWhirlwindEffect;
}(particleBaseClass_1.ParticleBase));
exports.DummyWhirlwindEffect = DummyWhirlwindEffect;


/***/ }),

/***/ "./src/client/particles/particleClasses/lungeEffect.ts":
/*!*************************************************************!*\
  !*** ./src/client/particles/particleClasses/lungeEffect.ts ***!
  \*************************************************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: top-level-this-exports, __webpack_exports__, __webpack_require__ */
/*! CommonJS bailout: this is used directly at 2:17-21 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.LungeEffect = void 0;
var vector_1 = __webpack_require__(/*! ../../../vector */ "./src/vector.ts");
var particleBaseClass_1 = __webpack_require__(/*! ./particleBaseClass */ "./src/client/particles/particleClasses/particleBaseClass.ts");
var trailDelay = 7;
var trailWidth = 27;
var LungeEffect = /** @class */ (function (_super) {
    __extends(LungeEffect, _super);
    function LungeEffect(ctx, position, color) {
        var _this = _super.call(this, ctx, position, 0.4) || this;
        _this.color = color;
        _this.trailingPoint = { x: position.x + 0, y: position.y + 0 };
        return _this;
    }
    LungeEffect.prototype.updateAndRender = function (elapsedTime) {
        _super.prototype.updateAndRender.call(this, elapsedTime);
        this.trailingPoint.x = (this.position.x + this.trailingPoint.x * (trailDelay - 1)) / trailDelay;
        this.trailingPoint.y = (this.position.y + this.trailingPoint.y * (trailDelay - 1)) / trailDelay;
    };
    LungeEffect.prototype.render = function () {
        this.ctx.globalAlpha = this.currentLife / 0.2;
        this.ctx.fillStyle = this.color;
        var normal = vector_1.findOrthonormalVector(this.trailingPoint, this.position);
        var pt1 = { x: normal.x * trailWidth, y: normal.y * trailWidth };
        var pt2 = { x: normal.x * -trailWidth, y: normal.y * -trailWidth };
        this.ctx.beginPath();
        this.ctx.moveTo(this.trailingPoint.x, this.trailingPoint.y);
        this.ctx.lineTo(this.position.x + pt1.x, this.position.y + pt1.y);
        this.ctx.lineTo(this.position.x + pt2.x, this.position.y + pt2.y);
        this.ctx.fill();
        this.ctx.globalAlpha = 1;
    };
    return LungeEffect;
}(particleBaseClass_1.ParticleBase));
exports.LungeEffect = LungeEffect;


/***/ }),

/***/ "./src/client/particles/particleClasses/particleBaseClass.ts":
/*!*******************************************************************!*\
  !*** ./src/client/particles/particleClasses/particleBaseClass.ts ***!
  \*******************************************************************/
/*! flagged exports */
/*! export ParticleBase [provided] [no usage info] [missing usage info prevents renaming] */
/*! export __esModule [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__ */
/***/ ((__unused_webpack_module, exports) => {


exports.__esModule = true;
exports.ParticleBase = void 0;
var ParticleBase = /** @class */ (function () {
    function ParticleBase(ctx, position, lifeTime) {
        this.ctx = ctx;
        this.position = position;
        this.lifeTime = lifeTime;
        this.ifDead = false;
        this.currentLife = this.lifeTime + 0;
    }
    ParticleBase.prototype.updateAndRender = function (elapsedTime) {
        if (this.currentLife > 0) {
            this.currentLife -= elapsedTime;
            if (this.currentLife < 0) {
                this.currentLife = 0;
                this.ifDead = true;
            }
            else {
                this.render();
            }
        }
    };
    return ParticleBase;
}());
exports.ParticleBase = ParticleBase;


/***/ }),

/***/ "./src/client/particles/particleClasses/spark.ts":
/*!*******************************************************!*\
  !*** ./src/client/particles/particleClasses/spark.ts ***!
  \*******************************************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: top-level-this-exports, __webpack_exports__, __webpack_require__ */
/*! CommonJS bailout: this is used directly at 2:17-21 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.Spark = void 0;
var particleBaseClass_1 = __webpack_require__(/*! ./particleBaseClass */ "./src/client/particles/particleClasses/particleBaseClass.ts");
var Spark = /** @class */ (function (_super) {
    __extends(Spark, _super);
    function Spark(ctx, position, lifeTime) {
        return _super.call(this, ctx, position, lifeTime) || this;
    }
    Spark.prototype.render = function () {
        this.ctx.globalAlpha = this.currentLife / this.lifeTime;
        this.ctx.fillRect(this.position.x - 3, this.position.y - 3, 6, 6);
    };
    return Spark;
}(particleBaseClass_1.ParticleBase));
exports.Spark = Spark;


/***/ }),

/***/ "./src/client/particles/particleGroups/particleGroup.ts":
/*!**************************************************************!*\
  !*** ./src/client/particles/particleGroups/particleGroup.ts ***!
  \**************************************************************/
/*! flagged exports */
/*! export ParticleGroup [provided] [no usage info] [missing usage info prevents renaming] */
/*! export __esModule [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__ */
/***/ ((__unused_webpack_module, exports) => {


exports.__esModule = true;
exports.ParticleGroup = void 0;
var ParticleGroup = /** @class */ (function () {
    function ParticleGroup(ctx, position) {
        this.ctx = ctx;
        this.position = position;
        this.particles = [];
        this.ifDead = false;
    }
    return ParticleGroup;
}());
exports.ParticleGroup = ParticleGroup;


/***/ }),

/***/ "./src/client/particles/particleGroups/sparks.ts":
/*!*******************************************************!*\
  !*** ./src/client/particles/particleGroups/sparks.ts ***!
  \*******************************************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: top-level-this-exports, __webpack_exports__, __webpack_require__ */
/*! CommonJS bailout: this is used directly at 2:17-21 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.Sparks = void 0;
var random_1 = __webpack_require__(/*! ../../../random */ "./src/random.ts");
var spark_1 = __webpack_require__(/*! ../particleClasses/spark */ "./src/client/particles/particleClasses/spark.ts");
var particleGroup_1 = __webpack_require__(/*! ./particleGroup */ "./src/client/particles/particleGroups/particleGroup.ts");
var Sparks = /** @class */ (function (_super) {
    __extends(Sparks, _super);
    function Sparks(ctx, position) {
        var _this = _super.call(this, ctx, position) || this;
        _this.particles = [];
        for (var i = 0; i < 10; i++) {
            var angle = random_1.Random.range(-Math.PI, Math.PI);
            var distance = random_1.Random.range(0, 30);
            var life = random_1.Random.range(0.6, 1);
            _this.particles.push(new spark_1.Spark(ctx, { x: position.x + distance * Math.cos(angle), y: position.y + distance * Math.sin(angle) }, life));
        }
        return _this;
    }
    Sparks.prototype.updateAndRender = function (elapsedTime) {
        var ifExistsParticle = false;
        this.ctx.fillStyle = "green";
        this.particles.forEach(function (particle) {
            particle.updateAndRender(elapsedTime);
            if (!particle.ifDead)
                ifExistsParticle = true;
        });
        if (!ifExistsParticle)
            this.ifDead = true;
        this.ctx.globalAlpha = 1;
    };
    return Sparks;
}(particleGroup_1.ParticleGroup));
exports.Sparks = Sparks;


/***/ }),

/***/ "./src/client/particles/particleSystem.ts":
/*!************************************************!*\
  !*** ./src/client/particles/particleSystem.ts ***!
  \************************************************/
/*! flagged exports */
/*! export ParticleSystem [provided] [no usage info] [missing usage info prevents renaming] */
/*! export __esModule [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__, __webpack_require__ */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


exports.__esModule = true;
exports.ParticleSystem = void 0;
var linkedList_1 = __webpack_require__(/*! ../../linkedList */ "./src/linkedList.ts");
var dummySlashEffect2_1 = __webpack_require__(/*! ./particleClasses/dummySlashEffect2 */ "./src/client/particles/particleClasses/dummySlashEffect2.ts");
var dummyWhirlwindEffect_1 = __webpack_require__(/*! ./particleClasses/dummyWhirlwindEffect */ "./src/client/particles/particleClasses/dummyWhirlwindEffect.ts");
var lungeEffect_1 = __webpack_require__(/*! ./particleClasses/lungeEffect */ "./src/client/particles/particleClasses/lungeEffect.ts");
var sparks_1 = __webpack_require__(/*! ./particleGroups/sparks */ "./src/client/particles/particleGroups/sparks.ts");
var ParticleSystem = /** @class */ (function () {
    function ParticleSystem(particleCtx, game) {
        this.particleCtx = particleCtx;
        this.game = game;
        //protected particleGroups: ParticleGroup[] = [];
        //protected particles: ParticleBase[] = [];
        this.particleGroups = new linkedList_1.LinkedList();
        this.particles = new linkedList_1.LinkedList();
    }
    ParticleSystem.prototype.updateAndRender = function (elapsedTime) {
        if (!this.particleGroups.ifEmpty()) {
            var group = this.particleGroups.head;
            var lastGroup = null;
            while (group !== null) {
                group.data.updateAndRender(elapsedTime);
                if (group.data.ifDead) {
                    if (lastGroup) {
                        lastGroup.next = group.next;
                    }
                    else {
                        this.particleGroups.head = group.next;
                    }
                    group = group.next;
                }
                else {
                    lastGroup = group;
                    group = group.next;
                }
            }
        }
        if (!this.particles.ifEmpty()) {
            var particle = this.particles.head;
            var lastParticle = null;
            while (particle !== null) {
                particle.data.updateAndRender(elapsedTime);
                if (particle.data.ifDead) {
                    if (lastParticle) {
                        lastParticle.next = particle.next;
                    }
                    else {
                        this.particles.head = particle.next;
                    }
                    particle = particle.next;
                }
                else {
                    lastParticle = particle;
                    particle = particle.next;
                }
            }
        }
    };
    ParticleSystem.prototype.addSparks = function (position) {
        this.particleGroups.insertAtBegin(new sparks_1.Sparks(this.particleCtx, position));
    };
    ParticleSystem.prototype.addDummySlashEffect2 = function (position, angle, flipX) {
        this.particles.insertAtBegin(new dummySlashEffect2_1.DummySlashEffect2(this.particleCtx, position, angle, flipX));
    };
    ParticleSystem.prototype.addDummyWhirlwindEffect = function (position, flipX) {
        var tempPtr = new dummyWhirlwindEffect_1.DummyWhirlwindEffect(this.particleCtx, position, flipX);
        this.particles.insertAtBegin(tempPtr);
        return tempPtr;
    };
    ParticleSystem.prototype.addLungeEffect = function (position, color) {
        this.particles.insertAtBegin(new lungeEffect_1.LungeEffect(this.particleCtx, position, color));
    };
    return ParticleSystem;
}());
exports.ParticleSystem = ParticleSystem;


/***/ }),

/***/ "./src/client/servertalker.ts":
/*!************************************!*\
  !*** ./src/client/servertalker.ts ***!
  \************************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: top-level-this-exports, __webpack_exports__ */
/*! CommonJS bailout: this is used directly at 2:17-21 */
/*! CommonJS bailout: this is used directly at 11:19-23 */
/***/ (function(__unused_webpack_module, exports) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.ServerTalker = void 0;
var ServerTalker = /** @class */ (function () {
    function ServerTalker(joinRequest, messageHandler) {
        var _this = this;
        if (messageHandler === void 0) { messageHandler = function () { }; }
        this.messageHandler = messageHandler;
        this.serverTalkerReady = new Promise(function (resolve, reject) {
            _this.join(joinRequest).then(function (response) {
                _this.websocket = new WebSocket("ws://" + ServerTalker.hostName + "/" + response.id.toString());
                _this.websocket.onmessage = function (ev) {
                    var data = JSON.parse(ev.data);
                    _this.messageHandler(data);
                };
                _this.websocket.onopen = function () {
                    resolve(response);
                };
            });
        });
    }
    ServerTalker.prototype.sendMessage = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.websocket) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.serverTalkerReady];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        this.websocket.send(JSON.stringify(data));
                        return [2 /*return*/];
                }
            });
        });
    };
    ServerTalker.prototype.join = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.postHelper("join", request)];
            });
        });
    };
    ServerTalker.prototype.postHelper = function (url, data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, fetch("https://" + ServerTalker.hostName + "/" + url, {
                        method: "POST",
                        body: JSON.stringify(data),
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }).then(function (response) { return response.json(); })];
            });
        });
    };
    ServerTalker.prototype.getHelper = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, fetch("https://" + ServerTalker.hostName + "/" + url).then(function (response) { return response.json(); })];
            });
        });
    };
    ServerTalker.prototype.leave = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.websocket) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.serverTalkerReady];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        this.websocket.close();
                        return [2 /*return*/];
                }
            });
        });
    };
    ServerTalker.hostName = window.location.host;
    return ServerTalker;
}());
exports.ServerTalker = ServerTalker;


/***/ }),

/***/ "./src/client/util.ts":
/*!****************************!*\
  !*** ./src/client/util.ts ***!
  \****************************/
/*! flagged exports */
/*! export __esModule [provided] [no usage info] [missing usage info prevents renaming] */
/*! export fillPatchNotesDiv [provided] [no usage info] [missing usage info prevents renaming] */
/*! export safeGetElementById [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__ */
/***/ ((__unused_webpack_module, exports) => {


exports.__esModule = true;
exports.fillPatchNotesDiv = exports.safeGetElementById = void 0;
function safeGetElementById(id) {
    var element = document.getElementById(id);
    if (element) {
        return element;
    }
    else {
        throw new Error("Element with id " + id + " could not be gotten");
    }
}
exports.safeGetElementById = safeGetElementById;
function fillPatchNotesDiv(div) {
    var _loop_1 = function (i1) {
        div.appendChild(document.createElement("hr"));
        var date = document.createElement("p");
        date.classList.add("patchDate");
        date.innerText = patchNotes[i1].dateTitle;
        if (patchNotes[i1].ifNew) {
            date.classList.add("newPatch");
            date.innerText += " - NEW";
        }
        div.appendChild(date);
        patchNotes[i1].additions.forEach(function (additionText) {
            var additionElement = document.createElement("p");
            additionElement.innerText = additionText;
            if (patchNotes[i1].ifNew)
                additionElement.classList.add("newPatch");
            div.appendChild(additionElement);
        });
    };
    for (var i1 = 0; i1 < patchNotes.length; i1++) {
        _loop_1(i1);
    }
}
exports.fillPatchNotesDiv = fillPatchNotesDiv;
var patchNotes = [
    {
        dateTitle: "TBD",
        additions: ["Fixed a bug where large screens didn't correctly detect the mouse position."],
        ifNew: true,
    },
    {
        dateTitle: "5-20-21 - Cooler Abilities / Polishing",
        additions: [
            "Redid Sword weapon and animations, hopefully for the better. Any feedback on how the abilities feel would be awesome.",
            "Added a website icon! Love it and cherish it!!",
            "The comment system had malfunctions, and I didn't receive any comments. Sorry! If you would resend any that you sent, I would be very grateful. I'll be watching closely to make sure there are no more errors. Shoutout to Jens who helped me find it.",
            "Added small visual treats to abilities with more to come.",
            "Even faster performance (time between pressing a button and the action happenning reduced by 50%) and a more player-centered viewpoint with better zooming/scaling with your screen.",
            "Fixed a small momentum bug to hopefully eliminate small discrepancies in players' positions between clients.",
            "Player boxes are slightly bigger (10%) with outlines for better visibility.",
        ],
        ifNew: false,
    },
    {
        dateTitle: "5-15-21 - Basic Ability Functionality",
        additions: [
            "ADDED PATCH NOTES.",
            "Added a basic weapon and animations!! More to come with the next patch!",
            "Vastly improved user interface and removed levels and experience for now.",
            "Added basic abilities for the sword class including Slash and Whirlwind, and more will come next patch for the remaining classes.",
            "MASSIVE rendering performance improvements, with up to 50% increased game engine speeds.",
            "New support for larger screens, removed 4k screen floor clipping (this one's for you, Mark and Kassi).",
            "Added small red player flashes for better hit visibility.",
            "Added basic particle functionality that's displayed when a player is healed.",
        ],
        ifNew: false,
    },
    {
        dateTitle: "5-5-21 - Hotfixes",
        additions: ["Small bug fixes for player health. Player's health was not updating correctly and sometimes overshooting their max health."],
        ifNew: false,
    },
    {
        dateTitle: "5-5-21 - User Interface and Healthbars",
        additions: [
            "Huge updates to user interface, and added a few early ability icons. Added a heal animation to the healthbars, and testing with left/right clicks.",
            "Improved the main actor canvas to reduce clipping and improve performance.",
        ],
        ifNew: false,
    },
    {
        dateTitle: "5-3-21 - Rough UI",
        additions: [
            "Added basic user interface with more to come. Adjusted controls to be more responsive, and added options to the main menu.",
            "Finishing touches on doodad collision detection and response forcing.",
        ],
        ifNew: false,
    },
    {
        dateTitle: "4-29-21 - Rock Doodads",
        additions: ["Added basic rock doodads, with more to come as the game progresses.", "Added and improved class icons."],
        ifNew: false,
    },
    {
        dateTitle: "4-27-21 - Game Makeover! New Main Menu",
        additions: [
            "Overhauled the object hierarchy in the code, resulting in faster processing and more potential to the game.",
            "Redid the main menu, with clearer buttons and a more appealing visual style.",
            "New and improved terrain system, featuring hills and realistic-er ground.",
            "Improved graphics and faster rendering for background and players.",
        ],
        ifNew: false,
    },
];


/***/ }),

/***/ "./src/config.ts":
/*!***********************!*\
  !*** ./src/config.ts ***!
  \***********************/
/*! flagged exports */
/*! export __esModule [provided] [no usage info] [missing usage info prevents renaming] */
/*! export defaultConfig [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__ */
/***/ ((__unused_webpack_module, exports) => {


exports.__esModule = true;
exports.defaultConfig = void 0;
var xSize = 5000;
var ySize = 1000;
exports.defaultConfig = {
    playerSize: { width: 96, height: 100 },
    playerStart: {
        x: 300,
        y: 650,
    },
    playerJumpHeight: 1200,
    xSize: xSize,
    ySize: ySize,
    playerKeys: {
        up: "KeyW",
        down: "KeyS",
        left: "KeyA",
        right: "KeyD",
        basicAttack: "leftMouseDown",
        secondAttack: "rightMouseDown",
        firstAbility: "Space",
        secondAbility: "ShiftLeft",
        thirdAbility: "KeyQ",
        fourthAbility: "KeyE",
    },
    platformColor: "grey",
    fallingAcceleration: 3500,
    standingSidewaysAcceleration: 10000,
    nonStandingSidewaysAcceleration: 4000,
    maxSidewaysMomentum: 600,
    gameSpeed: 1,
    updatePlayerFocusSpeed: 0.05,
};


/***/ }),

/***/ "./src/findAngle.ts":
/*!**************************!*\
  !*** ./src/findAngle.ts ***!
  \**************************/
/*! flagged exports */
/*! export __esModule [provided] [no usage info] [missing usage info prevents renaming] */
/*! export findAngle [provided] [no usage info] [missing usage info prevents renaming] */
/*! export rotateShape [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__, __webpack_require__ */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


exports.__esModule = true;
exports.rotateShape = exports.findAngle = void 0;
var vector_1 = __webpack_require__(/*! ./vector */ "./src/vector.ts");
function findAngle(pos1, pos2) {
    return Math.atan2(pos2.y - pos1.y, pos2.x - pos1.x);
}
exports.findAngle = findAngle;
function rotateShape(shape, angle, positionOffset, flipOverY /*, flipOverX: boolean = false*/) {
    if (flipOverY === void 0) { flipOverY = false; }
    var newVectorArray = [];
    for (var i = 0; i < shape.length; i++) {
        newVectorArray.push({ x: shape[i].x + 0, y: shape[i].y + 0 });
    }
    for (var i = 0; i < shape.length; i++) {
        if ((flipOverY && angle > Math.PI / 2) || angle < -Math.PI / 2) {
            // flip it around if they're facing left
            newVectorArray[i].y *= -1;
        }
        var tan = findAngle({ x: 0, y: 0 }, { x: newVectorArray[i].x, y: newVectorArray[i].y }); // find original angle
        var distance = vector_1.findDistance({ x: 0, y: 0 }, { x: newVectorArray[i].x, y: newVectorArray[i].y }); // find original distance
        newVectorArray[i].x = distance * Math.cos(tan + angle) + positionOffset.x;
        newVectorArray[i].y = distance * Math.sin(tan + angle) + positionOffset.y;
    }
    return newVectorArray;
}
exports.rotateShape = rotateShape;


/***/ }),

/***/ "./src/ifInside.ts":
/*!*************************!*\
  !*** ./src/ifInside.ts ***!
  \*************************/
/*! flagged exports */
/*! export __esModule [provided] [no usage info] [missing usage info prevents renaming] */
/*! export ifInside [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__ */
/***/ ((__unused_webpack_module, exports) => {


exports.__esModule = true;
exports.ifInside = void 0;
//returns true if point is inside the shape. Doesn't work reliably if the point lies on an edge or corner, but those are rare cases.
function ifInside(point, shape) {
    // ray-casting algorithm based on
    // https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html/pnpoly.html
    var x = point.x + 0, y = point.y + 0;
    var inside = false;
    for (var i = 0, j = shape.length - 1; i < shape.length; j = i++) {
        var xi = shape[i].x + 0, yi = shape[i].y + 0;
        var xj = shape[j].x + 0, yj = shape[j].y + 0;
        var intersect = yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
        if (intersect)
            inside = !inside;
    }
    return inside;
}
exports.ifInside = ifInside;


/***/ }),

/***/ "./src/ifIntersect.ts":
/*!****************************!*\
  !*** ./src/ifIntersect.ts ***!
  \****************************/
/*! flagged exports */
/*! export __esModule [provided] [no usage info] [missing usage info prevents renaming] */
/*! export findIntersection [provided] [no usage info] [missing usage info prevents renaming] */
/*! export ifIntersect [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__ */
/***/ ((__unused_webpack_module, exports) => {


exports.__esModule = true;
exports.findIntersection = exports.ifIntersect = void 0;
// returns true if line1 intersects with line2
function ifIntersect(line1Start, line1End, line2Start, line2End) {
    var det, gamma, lambda;
    det = (line1End.x - line1Start.x) * (line2End.y - line2Start.y) - (line2End.x - line2Start.x) * (line1End.y - line1Start.y);
    if (det === 0) {
        return false;
    }
    else {
        lambda = ((line2End.y - line2Start.y) * (line2End.x - line1Start.x) + (line2Start.x - line2End.x) * (line2End.y - line1Start.y)) / det;
        gamma = ((line1Start.y - line1End.y) * (line2End.x - line1Start.x) + (line1End.x - line1Start.x) * (line2End.y - line1Start.y)) / det;
        return 0 < lambda && lambda < 1 && 0 < gamma && gamma < 1;
    }
}
exports.ifIntersect = ifIntersect;
// line intercept math by Paul Bourke http://paulbourke.net/geometry/pointlineplane/
// Determine the intersection point of two line segments
// Return FALSE if the lines don't intersect
function findIntersection(edge1, edge2) {
    // Check if none of the lines are of length 0
    if ((edge1.p1.x === edge1.p2.x && edge1.p1.y === edge1.p2.y) || (edge2.p1.x === edge2.p2.x && edge2.p1.y === edge2.p2.y)) {
        return undefined;
    }
    var denominator = (edge2.p2.y - edge2.p1.y) * (edge1.p2.x - edge1.p1.x) - (edge2.p2.x - edge2.p1.x) * (edge1.p2.y - edge1.p1.y);
    // Lines are parallel
    if (denominator === 0) {
        return undefined;
    }
    var ua = ((edge2.p2.x - edge2.p1.x) * (edge1.p1.y - edge2.p1.y) - (edge2.p2.y - edge2.p1.y) * (edge1.p1.x - edge2.p1.x)) / denominator;
    var ub = ((edge1.p2.x - edge1.p1.x) * (edge1.p1.y - edge2.p1.y) - (edge1.p2.y - edge1.p1.y) * (edge1.p1.x - edge2.p1.x)) / denominator;
    // is the intersection along the segments
    if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
        return undefined;
    }
    // Return a object with the x and y coordinates of the intersection
    var x = edge1.p1.x + ua * (edge1.p2.x - edge1.p1.x);
    var y = edge1.p1.y + ua * (edge1.p2.y - edge1.p1.y);
    return { x: x, y: y };
}
exports.findIntersection = findIntersection;


/***/ }),

/***/ "./src/linkedList.ts":
/*!***************************!*\
  !*** ./src/linkedList.ts ***!
  \***************************/
/*! flagged exports */
/*! export LinkedList [provided] [no usage info] [missing usage info prevents renaming] */
/*! export Node [provided] [no usage info] [missing usage info prevents renaming] */
/*! export __esModule [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__ */
/***/ ((__unused_webpack_module, exports) => {


exports.__esModule = true;
exports.Node = exports.LinkedList = void 0;
var LinkedList = /** @class */ (function () {
    function LinkedList() {
        this.head = null;
    }
    LinkedList.prototype.ifEmpty = function () {
        return !this.head ? true : false;
    };
    LinkedList.prototype.insertAtEnd = function (data) {
        var node = new Node(data);
        if (!this.head) {
            this.head = node;
        }
        else {
            var getLast_1 = function (node) {
                return node.next ? getLast_1(node.next) : node;
            };
            var lastNode = getLast_1(this.head);
            lastNode.next = node;
        }
        return node;
    };
    LinkedList.prototype.insertAtBegin = function (data) {
        var node = new Node(data);
        if (!this.head) {
            this.head = node;
        }
        else {
            node.next = this.head;
            this.head = node;
        }
        return node;
    };
    LinkedList.prototype.deleteFirst = function () {
        if (this.head) {
            this.head = this.head.next;
        }
    };
    LinkedList.prototype.deleteLast = function () {
        if (this.head) {
            var node = this.head;
            while (node.next !== null && node.next.next !== null) {
                node = node.next;
            }
            node.next = null;
        }
    };
    LinkedList.prototype.search = function (comparator) {
        var checkNext = function (node) {
            if (comparator(node.data)) {
                return node;
            }
            return node.next ? checkNext(node.next) : null;
        };
        return this.head ? checkNext(this.head) : null;
    };
    LinkedList.prototype.traverse = function () {
        var array = [];
        if (!this.head) {
            return array;
        }
        var addToArray = function (node) {
            array.push(node.data);
            return node.next ? addToArray(node.next) : array;
        };
        return addToArray(this.head);
    };
    LinkedList.prototype.size = function () {
        return this.traverse().length;
    };
    return LinkedList;
}());
exports.LinkedList = LinkedList;
var Node = /** @class */ (function () {
    function Node(data) {
        this.data = data;
        this.next = null;
    }
    return Node;
}());
exports.Node = Node;


/***/ }),

/***/ "./src/objects/clientControllers/controllers/abilities/daggersAbilities/daggersLungeAbility.ts":
/*!*****************************************************************************************************!*\
  !*** ./src/objects/clientControllers/controllers/abilities/daggersAbilities/daggersLungeAbility.ts ***!
  \*****************************************************************************************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: top-level-this-exports, __webpack_exports__, __webpack_require__ */
/*! CommonJS bailout: this is used directly at 2:17-21 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.DaggersLungeAbility = void 0;
var assetmanager_1 = __webpack_require__(/*! ../../../../../client/gameRender/assetmanager */ "./src/client/gameRender/assetmanager.ts");
var findAngle_1 = __webpack_require__(/*! ../../../../../findAngle */ "./src/findAngle.ts");
var playerPressAbility_1 = __webpack_require__(/*! ../playerPressAbility */ "./src/objects/clientControllers/controllers/abilities/playerPressAbility.ts");
var DaggersLungeAbility = /** @class */ (function (_super) {
    __extends(DaggersLungeAbility, _super);
    function DaggersLungeAbility(game, player, controller, abilityArrayIndex) {
        var _this = _super.call(this, game, player, controller, DaggersLungeAbilityData.cooldown + 0, assetmanager_1.assetManager.images["lungeIcon"], DaggersLungeAbilityData.totalCastTime + 0, abilityArrayIndex) || this;
        _this.player = player;
        _this.controller = controller;
        return _this;
    }
    DaggersLungeAbility.prototype.attemptFunc = function () {
        if (this.cooldown === 0)
            return true;
        return false;
    };
    DaggersLungeAbility.prototype.pressFunc = function (globalMousePos) {
        this.controller.setCurrentCastingAbility(this.abilityArrayIndex);
        this.cooldown = this.totalCooldown + 0;
        this.angle = findAngle_1.findAngle(this.player.position, globalMousePos);
        this.casting = true;
        //no super call because it doesn't set the global cooldown
        this.player.performClientAbility["lunge"](globalMousePos);
        this.controller.sendServerDaggersAbility("lunge", true, globalMousePos);
    };
    DaggersLungeAbility.prototype.castUpdateFunc = function (elapsedTime) {
        _super.prototype.castUpdateFunc.call(this, elapsedTime);
    };
    DaggersLungeAbility.prototype.getIconCooldownPercent = function () {
        if (this.cooldown !== 0) {
            return this.cooldown / this.totalCooldown;
        }
        else {
            return 0;
        }
    };
    return DaggersLungeAbility;
}(playerPressAbility_1.PlayerPressAbility));
exports.DaggersLungeAbility = DaggersLungeAbility;
var DaggersLungeAbilityData = {
    cooldown: 3,
    totalCastTime: 0.2,
};


/***/ }),

/***/ "./src/objects/clientControllers/controllers/abilities/daggersAbilities/daggersStabAbility.ts":
/*!****************************************************************************************************!*\
  !*** ./src/objects/clientControllers/controllers/abilities/daggersAbilities/daggersStabAbility.ts ***!
  \****************************************************************************************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: top-level-this-exports, __webpack_exports__, __webpack_require__ */
/*! CommonJS bailout: this is used directly at 2:17-21 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.DaggersStabHitShape = exports.DaggersStabAbility = void 0;
var assetmanager_1 = __webpack_require__(/*! ../../../../../client/gameRender/assetmanager */ "./src/client/gameRender/assetmanager.ts");
var findAngle_1 = __webpack_require__(/*! ../../../../../findAngle */ "./src/findAngle.ts");
var playerPressAbility_1 = __webpack_require__(/*! ../playerPressAbility */ "./src/objects/clientControllers/controllers/abilities/playerPressAbility.ts");
var DaggersStabAbility = /** @class */ (function (_super) {
    __extends(DaggersStabAbility, _super);
    function DaggersStabAbility(game, player, controller, abilityArrayIndex) {
        var _this = _super.call(this, game, player, controller, DaggersStabAbilityData.cooldown + 0, assetmanager_1.assetManager.images["stabIcon"], DaggersStabAbilityData.totalCastTime + 0, abilityArrayIndex) || this;
        _this.player = player;
        _this.controller = controller;
        return _this;
    }
    DaggersStabAbility.prototype.pressFunc = function (globalMousePos) {
        _super.prototype.pressFunc.call(this, globalMousePos);
        this.player.performClientAbility["stab"](globalMousePos);
        this.controller.sendServerDaggersAbility("stab", true, globalMousePos);
    };
    DaggersStabAbility.prototype.castUpdateFunc = function (elapsedTime) {
        var _this = this;
        _super.prototype.castUpdateFunc.call(this, elapsedTime);
        if (this.castStage > DaggersStabAbilityData.hitDetectFrame && this.castStage - elapsedTime < DaggersStabAbilityData.hitDetectFrame) {
            var actors_1 = [];
            var shape_1 = findAngle_1.rotateShape(exports.DaggersStabHitShape, this.angle, this.player.position, false);
            this.globalActors.actors.forEach(function (actor) {
                if (actor.getActorId() !== _this.player.getActorId() && actor.ifInsideLargerShape(shape_1)) {
                    actors_1.push({
                        actorType: actor.getActorType(),
                        actorId: actor.getActorId(),
                        angle: _this.angle,
                    });
                }
            });
            if (actors_1.length > 0) {
                this.game.gameRenderer.screenZoom(1.06);
                this.game.serverTalker.sendMessage({
                    type: "clientDaggersMessage",
                    originId: this.player.getActorId(),
                    position: this.player.position,
                    momentum: this.player.momentum,
                    msg: {
                        type: "clientDaggersStabHit",
                        actors: actors_1,
                    },
                });
            }
        }
    };
    return DaggersStabAbility;
}(playerPressAbility_1.PlayerPressAbility));
exports.DaggersStabAbility = DaggersStabAbility;
exports.DaggersStabHitShape = [
    { x: -10, y: -40 },
    { x: 130, y: -30 },
    { x: 130, y: 30 },
    { x: -10, y: 40 },
];
var DaggersStabAbilityData = {
    cooldown: 0.3,
    totalCastTime: 0.5,
    hitDetectFrame: 0.1,
};


/***/ }),

/***/ "./src/objects/clientControllers/controllers/abilities/emptyAbility.ts":
/*!*****************************************************************************!*\
  !*** ./src/objects/clientControllers/controllers/abilities/emptyAbility.ts ***!
  \*****************************************************************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: top-level-this-exports, __webpack_exports__, __webpack_require__ */
/*! CommonJS bailout: this is used directly at 2:17-21 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.EmptyAbility = void 0;
var assetmanager_1 = __webpack_require__(/*! ../../../../client/gameRender/assetmanager */ "./src/client/gameRender/assetmanager.ts");
var playerPressAbility_1 = __webpack_require__(/*! ./playerPressAbility */ "./src/objects/clientControllers/controllers/abilities/playerPressAbility.ts");
function getEmptyAbilityIcon(index) {
    if (index === 2) {
        return assetmanager_1.assetManager.images["lvl6"];
    }
    else if (index === 3) {
        return assetmanager_1.assetManager.images["lvl10"];
    }
    else {
        return assetmanager_1.assetManager.images["emptyIcon"];
    }
}
var EmptyAbility = /** @class */ (function (_super) {
    __extends(EmptyAbility, _super);
    function EmptyAbility(game, player, controller, abilityArrayIndex) {
        return _super.call(this, game, player, controller, 0, getEmptyAbilityIcon(abilityArrayIndex), 0, abilityArrayIndex) || this;
    }
    EmptyAbility.prototype.pressFunc = function (globalMousePos) { };
    EmptyAbility.prototype.castUpdateFunc = function (elapsedTime) { };
    EmptyAbility.prototype.stopFunc = function () { };
    return EmptyAbility;
}(playerPressAbility_1.PlayerPressAbility));
exports.EmptyAbility = EmptyAbility;


/***/ }),

/***/ "./src/objects/clientControllers/controllers/abilities/hammerAbilities/hammerPoundAbility.ts":
/*!***************************************************************************************************!*\
  !*** ./src/objects/clientControllers/controllers/abilities/hammerAbilities/hammerPoundAbility.ts ***!
  \***************************************************************************************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: top-level-this-exports, __webpack_exports__, __webpack_require__ */
/*! CommonJS bailout: this is used directly at 2:17-21 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.HammerPoundAbility = void 0;
var assetmanager_1 = __webpack_require__(/*! ../../../../../client/gameRender/assetmanager */ "./src/client/gameRender/assetmanager.ts");
var playerPressAbility_1 = __webpack_require__(/*! ../playerPressAbility */ "./src/objects/clientControllers/controllers/abilities/playerPressAbility.ts");
var HammerPoundAbility = /** @class */ (function (_super) {
    __extends(HammerPoundAbility, _super);
    function HammerPoundAbility(game, player, controller, abilityArrayIndex) {
        var _this = _super.call(this, game, player, controller, HammerPoundAbilityData.cooldown + 0, assetmanager_1.assetManager.images["poundIcon"], 0, abilityArrayIndex) || this;
        _this.player = player;
        _this.controller = controller;
        return _this;
    }
    HammerPoundAbility.prototype.updateFunc = function (elapsedTime) {
        if (this.castStage !== 0)
            return;
        _super.prototype.updateFunc.call(this, elapsedTime);
    };
    HammerPoundAbility.prototype.pressFunc = function () {
        this.controller.setCurrentCastingAbility(this.abilityArrayIndex);
        this.controller.setNegativeGlobalCooldown();
        this.cooldown = this.totalCooldown + 0;
        this.casting = true;
    };
    HammerPoundAbility.prototype.castUpdateFunc = function (elapsedTime) {
        if (this.player.actorObject.standing) {
            this.stopFunc();
        }
    };
    HammerPoundAbility.prototype.stopFunc = function () {
        if (this.casting) {
            this.game.gameRenderer.screenZoom(1.2, 10);
            this.controller.setGlobalCooldown(this.globalCooldownTime * 2);
        }
        _super.prototype.stopFunc.call(this);
    };
    return HammerPoundAbility;
}(playerPressAbility_1.PlayerPressAbility));
exports.HammerPoundAbility = HammerPoundAbility;
var HammerPoundAbilityData = {
    cooldown: 4,
    totalPoundingTime: 2,
};


/***/ }),

/***/ "./src/objects/clientControllers/controllers/abilities/hammerAbilities/hammerSwingAbility.ts":
/*!***************************************************************************************************!*\
  !*** ./src/objects/clientControllers/controllers/abilities/hammerAbilities/hammerSwingAbility.ts ***!
  \***************************************************************************************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: top-level-this-exports, __webpack_exports__, __webpack_require__ */
/*! CommonJS bailout: this is used directly at 2:17-21 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.HammerSwingHitShape = exports.HammerSwingAbility = void 0;
var assetmanager_1 = __webpack_require__(/*! ../../../../../client/gameRender/assetmanager */ "./src/client/gameRender/assetmanager.ts");
var vector_1 = __webpack_require__(/*! ../../../../../vector */ "./src/vector.ts");
var playerPressAbility_1 = __webpack_require__(/*! ../playerPressAbility */ "./src/objects/clientControllers/controllers/abilities/playerPressAbility.ts");
var HammerSwingAbility = /** @class */ (function (_super) {
    __extends(HammerSwingAbility, _super);
    function HammerSwingAbility(game, player, controller, abilityArrayIndex) {
        var _this = _super.call(this, game, player, controller, HammerSwingAbilityData.cooldown + 0, assetmanager_1.assetManager.images["swingIcon"], HammerSwingAbilityData.totalCastTime + 0, abilityArrayIndex) || this;
        _this.player = player;
        _this.controller = controller;
        return _this;
    }
    HammerSwingAbility.prototype.pressFunc = function (globalMousePos) {
        _super.prototype.pressFunc.call(this, globalMousePos);
        this.player.performClientAbility["swing"](globalMousePos);
        this.controller.sendServerHammerAbility("swing", true, globalMousePos);
    };
    HammerSwingAbility.prototype.castUpdateFunc = function (elapsedTime) {
        var _this = this;
        _super.prototype.castUpdateFunc.call(this, elapsedTime);
        if (this.castStage > HammerSwingAbilityData.hitDetectFrame && this.castStage - elapsedTime < HammerSwingAbilityData.hitDetectFrame) {
            var actors_1 = [];
            var shape_1 = vector_1.rotateShape(exports.HammerSwingHitShape, this.angle, this.player.position, false);
            this.globalActors.actors.forEach(function (actor) {
                if (actor.getActorId() !== _this.player.getActorId() && actor.ifInsideLargerShape(shape_1)) {
                    actors_1.push({
                        actorType: actor.getActorType(),
                        actorId: actor.getActorId(),
                        angle: _this.angle,
                    });
                }
            });
            if (actors_1.length > 0) {
                this.game.gameRenderer.screenZoom(1.1, 7);
                this.game.serverTalker.sendMessage({
                    type: "clientHammerMessage",
                    originId: this.player.getActorId(),
                    position: this.player.position,
                    momentum: this.player.momentum,
                    msg: {
                        type: "clientHammerSwingHit",
                        actors: actors_1,
                    },
                });
            }
        }
    };
    return HammerSwingAbility;
}(playerPressAbility_1.PlayerPressAbility));
exports.HammerSwingAbility = HammerSwingAbility;
exports.HammerSwingHitShape = [
    { x: -10, y: -30 },
    { x: 7, y: -80 },
    { x: 100, y: -55 },
    { x: 110, y: 20 },
    { x: 75, y: 55 },
    { x: 10, y: 70 },
];
var HammerSwingAbilityData = {
    cooldown: 0.5,
    totalCastTime: 0.8,
    hitDetectFrame: 0.2,
};


/***/ }),

/***/ "./src/objects/clientControllers/controllers/abilities/playerAbility.ts":
/*!******************************************************************************!*\
  !*** ./src/objects/clientControllers/controllers/abilities/playerAbility.ts ***!
  \******************************************************************************/
/*! flagged exports */
/*! export PlayerAbility [provided] [no usage info] [missing usage info prevents renaming] */
/*! export __esModule [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__, __webpack_require__ */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


exports.__esModule = true;
exports.PlayerAbility = void 0;
var actorConfig_1 = __webpack_require__(/*! ../../../newActors/actorConfig */ "./src/objects/newActors/actorConfig.ts");
var PlayerAbility = /** @class */ (function () {
    /**
     * @param totalCastTime is referenced by the ability to know when to call stopFunc or releaseFunc
     */
    function PlayerAbility(game, player, controller, totalCooldown, img, totalCastTime, abilityArrayIndex) {
        this.game = game;
        this.player = player;
        this.controller = controller;
        this.totalCooldown = totalCooldown;
        this.img = img;
        this.totalCastTime = totalCastTime;
        this.abilityArrayIndex = abilityArrayIndex;
        this.cooldown = 0;
        this.castStage = 0;
        this.casting = false;
        this.angle = 0;
        this.globalActors = this.game.getGlobalActors();
        this.globalCooldownTime = actorConfig_1.defaultActorConfig.globalCooldown;
    }
    PlayerAbility.prototype.attemptFunc = function () {
        if (this.controller.globalCooldown === 0 && this.cooldown === 0)
            return true;
        return false;
    };
    PlayerAbility.prototype.updateFunc = function (elapsedTime) {
        if (this.cooldown > 0) {
            if (this.cooldown > this.totalCooldown) {
                this.cooldown = this.totalCooldown + 0;
            }
            this.cooldown -= elapsedTime;
            if (this.cooldown < 0) {
                this.cooldown = 0;
            }
        }
    };
    PlayerAbility.prototype.resetAbility = function () {
        this.castStage = 0;
    };
    PlayerAbility.prototype.getIconCooldownPercent = function () {
        if (this.controller.globalCooldown < 0) {
            return 1;
        }
        else if (this.cooldown !== 0 || this.controller.globalCooldown !== 0) {
            if (this.controller.globalCooldown > this.cooldown) {
                return this.controller.globalCooldown / actorConfig_1.defaultActorConfig.globalCooldown;
            }
            else {
                return this.cooldown / this.totalCooldown;
            }
        }
        else {
            return 0;
        }
    };
    return PlayerAbility;
}());
exports.PlayerAbility = PlayerAbility;


/***/ }),

/***/ "./src/objects/clientControllers/controllers/abilities/playerHoldAbility.ts":
/*!**********************************************************************************!*\
  !*** ./src/objects/clientControllers/controllers/abilities/playerHoldAbility.ts ***!
  \**********************************************************************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: top-level-this-exports, __webpack_exports__, __webpack_require__ */
/*! CommonJS bailout: this is used directly at 2:17-21 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.PlayerHoldAbility = void 0;
var playerAbility_1 = __webpack_require__(/*! ./playerAbility */ "./src/objects/clientControllers/controllers/abilities/playerAbility.ts");
var PlayerHoldAbility = /** @class */ (function (_super) {
    __extends(PlayerHoldAbility, _super);
    function PlayerHoldAbility(game, player, controller, totalCooldown, img, totalCastTime, abilityArrayIndex) {
        var _this = _super.call(this, game, player, controller, totalCooldown, img, totalCastTime, abilityArrayIndex) || this;
        _this.type = "hold";
        return _this;
    }
    PlayerHoldAbility.prototype.updateFunc = function (elapsedTime) {
        if (this.castStage !== 0)
            return;
        _super.prototype.updateFunc.call(this, elapsedTime);
    };
    return PlayerHoldAbility;
}(playerAbility_1.PlayerAbility));
exports.PlayerHoldAbility = PlayerHoldAbility;


/***/ }),

/***/ "./src/objects/clientControllers/controllers/abilities/playerPressAbility.ts":
/*!***********************************************************************************!*\
  !*** ./src/objects/clientControllers/controllers/abilities/playerPressAbility.ts ***!
  \***********************************************************************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: top-level-this-exports, __webpack_exports__, __webpack_require__ */
/*! CommonJS bailout: this is used directly at 2:17-21 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.PlayerPressAbility = void 0;
var findAngle_1 = __webpack_require__(/*! ../../../../findAngle */ "./src/findAngle.ts");
var playerAbility_1 = __webpack_require__(/*! ./playerAbility */ "./src/objects/clientControllers/controllers/abilities/playerAbility.ts");
var PlayerPressAbility = /** @class */ (function (_super) {
    __extends(PlayerPressAbility, _super);
    function PlayerPressAbility(game, player, controller, totalCooldown, img, totalCastTime, abilityArrayIndex) {
        var _this = _super.call(this, game, player, controller, totalCooldown, img, totalCastTime, abilityArrayIndex) || this;
        _this.type = "press";
        return _this;
    }
    PlayerPressAbility.prototype.pressFunc = function (globalMousePos) {
        this.controller.setCurrentCastingAbility(this.abilityArrayIndex);
        this.controller.setGlobalCooldown(this.globalCooldownTime);
        this.cooldown = this.totalCooldown + 0;
        this.angle = findAngle_1.findAngle(this.player.position, globalMousePos);
        this.casting = true;
    };
    PlayerPressAbility.prototype.castUpdateFunc = function (elapsedTime) {
        this.castStage += elapsedTime;
        if (this.castStage >= this.totalCastTime) {
            this.stopFunc();
        }
    };
    PlayerPressAbility.prototype.stopFunc = function () {
        if (this.casting) {
            this.controller.resetCurrentCastingAbility();
            this.resetAbility();
            this.casting = false;
            this.angle = 0;
        }
    };
    return PlayerPressAbility;
}(playerAbility_1.PlayerAbility));
exports.PlayerPressAbility = PlayerPressAbility;


/***/ }),

/***/ "./src/objects/clientControllers/controllers/abilities/swordAbilities/swordSlashAbility.ts":
/*!*************************************************************************************************!*\
  !*** ./src/objects/clientControllers/controllers/abilities/swordAbilities/swordSlashAbility.ts ***!
  \*************************************************************************************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: top-level-this-exports, __webpack_exports__, __webpack_require__ */
/*! CommonJS bailout: this is used directly at 2:17-21 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.SwordSlashHitShape = exports.SwordSlashAbility = void 0;
var assetmanager_1 = __webpack_require__(/*! ../../../../../client/gameRender/assetmanager */ "./src/client/gameRender/assetmanager.ts");
var vector_1 = __webpack_require__(/*! ../../../../../vector */ "./src/vector.ts");
var playerPressAbility_1 = __webpack_require__(/*! ../playerPressAbility */ "./src/objects/clientControllers/controllers/abilities/playerPressAbility.ts");
var swordWhirlwindAbility_1 = __webpack_require__(/*! ./swordWhirlwindAbility */ "./src/objects/clientControllers/controllers/abilities/swordAbilities/swordWhirlwindAbility.ts");
var SwordSlashAbility = /** @class */ (function (_super) {
    __extends(SwordSlashAbility, _super);
    function SwordSlashAbility(game, player, controller, abilityArrayIndex) {
        var _this = _super.call(this, game, player, controller, SwordSlashAbilityData.cooldown + 0, assetmanager_1.assetManager.images["slashIcon"], SwordSlashAbilityData.totalCastTime + 0, abilityArrayIndex) || this;
        _this.player = player;
        _this.controller = controller;
        return _this;
    }
    SwordSlashAbility.prototype.pressFunc = function (globalMousePos) {
        _super.prototype.pressFunc.call(this, globalMousePos);
        this.player.performClientAbility["slash"](globalMousePos);
        this.controller.sendServerSwordAbility("slash", true, globalMousePos);
    };
    SwordSlashAbility.prototype.castUpdateFunc = function (elapsedTime) {
        var _this = this;
        _super.prototype.castUpdateFunc.call(this, elapsedTime);
        if (this.castStage > SwordSlashAbilityData.hitDetectFrame && this.castStage - elapsedTime < SwordSlashAbilityData.hitDetectFrame) {
            var actors_1 = [];
            var shape_1 = vector_1.rotateShape(exports.SwordSlashHitShape, this.angle, this.player.position, false);
            this.globalActors.actors.forEach(function (actor) {
                if (actor.getActorId() !== _this.player.getActorId() && actor.ifInsideLargerShape(shape_1)) {
                    actors_1.push({
                        actorType: actor.getActorType(),
                        actorId: actor.getActorId(),
                        angle: _this.angle,
                    });
                }
            });
            if (actors_1.length > 0) {
                this.game.gameRenderer.screenZoom(1.06);
                this.game.serverTalker.sendMessage({
                    type: "clientSwordMessage",
                    originId: this.player.getActorId(),
                    position: this.player.position,
                    momentum: this.player.momentum,
                    msg: {
                        type: "clientSwordSlashHit",
                        actors: actors_1,
                    },
                });
                if (this.controller.abilityData[1] instanceof swordWhirlwindAbility_1.SwordWhirlWindAbility) {
                    this.controller.abilityData[1].cooldown--;
                }
            }
        }
    };
    return SwordSlashAbility;
}(playerPressAbility_1.PlayerPressAbility));
exports.SwordSlashAbility = SwordSlashAbility;
exports.SwordSlashHitShape = [
    { x: -10, y: -30 },
    { x: 7, y: -80 },
    { x: 100, y: -55 },
    { x: 110, y: 20 },
    { x: 75, y: 55 },
    { x: 10, y: 70 },
];
var SwordSlashAbilityData = {
    cooldown: 0.3,
    totalCastTime: 0.5,
    hitDetectFrame: 0.05,
};


/***/ }),

/***/ "./src/objects/clientControllers/controllers/abilities/swordAbilities/swordWhirlwindAbility.ts":
/*!*****************************************************************************************************!*\
  !*** ./src/objects/clientControllers/controllers/abilities/swordAbilities/swordWhirlwindAbility.ts ***!
  \*****************************************************************************************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: top-level-this-exports, __webpack_exports__, __webpack_require__ */
/*! CommonJS bailout: this is used directly at 2:17-21 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.SwordWhirlWindAbilityData = exports.SwordWhirlWindAbility = void 0;
var assetmanager_1 = __webpack_require__(/*! ../../../../../client/gameRender/assetmanager */ "./src/client/gameRender/assetmanager.ts");
var findAngle_1 = __webpack_require__(/*! ../../../../../findAngle */ "./src/findAngle.ts");
var vector_1 = __webpack_require__(/*! ../../../../../vector */ "./src/vector.ts");
var actorConfig_1 = __webpack_require__(/*! ../../../../newActors/actorConfig */ "./src/objects/newActors/actorConfig.ts");
var playerHoldAbility_1 = __webpack_require__(/*! ../playerHoldAbility */ "./src/objects/clientControllers/controllers/abilities/playerHoldAbility.ts");
var SwordWhirlWindAbility = /** @class */ (function (_super) {
    __extends(SwordWhirlWindAbility, _super);
    function SwordWhirlWindAbility(game, player, controller, abilityArrayIndex) {
        var _this = _super.call(this, game, player, controller, exports.SwordWhirlWindAbilityData.cooldown, assetmanager_1.assetManager.images["whirlwindIcon"], exports.SwordWhirlWindAbilityData.totalCastTime, abilityArrayIndex) || this;
        _this.player = player;
        _this.controller = controller;
        return _this;
    }
    SwordWhirlWindAbility.prototype.pressFunc = function (globalMousePos) {
        this.controller.setNegativeGlobalCooldown();
        this.controller.setCurrentCastingAbility(this.abilityArrayIndex);
        this.player.performClientAbility["whirlwind"](globalMousePos);
        this.casting = true;
        this.cooldown = 3;
        this.controller.sendServerSwordAbility("whirlwind", true, { x: 0, y: 0 });
        //broadcast starting
    };
    SwordWhirlWindAbility.prototype.castUpdateFunc = function (elapsedTime) {
        var _this = this;
        this.castStage += elapsedTime;
        if (this.castStage % exports.SwordWhirlWindAbilityData.hitDetectTimer >= 0.1 &&
            (this.castStage - elapsedTime) % exports.SwordWhirlWindAbilityData.hitDetectTimer < 0.1) {
            this.cooldown++;
            var actors_1 = [];
            this.globalActors.actors.forEach(function (actor) {
                var posDifference = vector_1.findDistance(_this.player.position, actor.position);
                if (actor.getActorId() !== _this.player.getActorId() && posDifference < actor.getCollisionRange() + exports.SwordWhirlWindAbilityData.hitRange) {
                    actors_1.push({ actorType: actor.getActorType(), actorId: actor.getActorId(), angle: findAngle_1.findAngle(_this.player.position, actor.position) });
                }
            });
            if (actors_1.length !== 0) {
                this.game.gameRenderer.screenZoom(1.06, 3);
                this.game.serverTalker.sendMessage({
                    type: "clientSwordMessage",
                    originId: this.player.getActorId(),
                    position: this.player.position,
                    momentum: this.player.momentum,
                    msg: {
                        type: "clientSwordWhirlwindHit",
                        actors: actors_1,
                    },
                });
            }
        }
        if (this.castStage >= exports.SwordWhirlWindAbilityData.totalCastTime) {
            this.stopFunc();
        }
    };
    SwordWhirlWindAbility.prototype.releaseFunc = function () {
        this.stopFunc();
    };
    SwordWhirlWindAbility.prototype.stopFunc = function () {
        if (this.casting) {
            this.player.releaseClientAbility["whirlwind"]();
            this.controller.resetGlobalCooldown();
            this.controller.resetCurrentCastingAbility();
            this.resetAbility();
            this.casting = false;
            this.controller.sendServerSwordAbility("whirlwind", false, { x: 0, y: 0 });
            //boradcast ending
        }
    };
    SwordWhirlWindAbility.prototype.updateFunc = function (elapsedTime) {
        if (this.cooldown > exports.SwordWhirlWindAbilityData.cooldown) {
            this.cooldown = exports.SwordWhirlWindAbilityData.cooldown + 0;
        }
        if (this.cooldown < 0) {
            this.cooldown = 0;
        }
    };
    SwordWhirlWindAbility.prototype.getIconCooldownPercent = function () {
        if (this.cooldown === 0)
            return this.controller.globalCooldown / actorConfig_1.defaultActorConfig.globalCooldown;
        else
            return this.cooldown / exports.SwordWhirlWindAbilityData.cooldown;
    };
    return SwordWhirlWindAbility;
}(playerHoldAbility_1.PlayerHoldAbility));
exports.SwordWhirlWindAbility = SwordWhirlWindAbility;
exports.SwordWhirlWindAbilityData = {
    cooldown: 5,
    totalCastTime: 1,
    hitDetectTimer: 0.2,
    hitRange: 140,
};


/***/ }),

/***/ "./src/objects/clientControllers/controllers/controller.ts":
/*!*****************************************************************!*\
  !*** ./src/objects/clientControllers/controllers/controller.ts ***!
  \*****************************************************************/
/*! flagged exports */
/*! export Controller [provided] [no usage info] [missing usage info prevents renaming] */
/*! export __esModule [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__, __webpack_require__ */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


exports.__esModule = true;
exports.Controller = void 0;
var emptyAbility_1 = __webpack_require__(/*! ./abilities/emptyAbility */ "./src/objects/clientControllers/controllers/abilities/emptyAbility.ts");
var actorConfig_1 = __webpack_require__(/*! ../../newActors/actorConfig */ "./src/objects/newActors/actorConfig.ts");
var Controller = /** @class */ (function () {
    function Controller(game, player) {
        this.game = game;
        this.player = player;
        this.level = 0; // set in setLevel()
        this.currentXp = 0;
        this.xpToNextLevel = 20; // set in setLevel()
        this.globalCooldown = 0;
        this.currentCastingAbility = undefined;
        this.stateStage = 0;
        this.abilityData = [];
        for (var i = 0; i < 4; i++) {
            this.abilityData.push(new emptyAbility_1.EmptyAbility(game, this.player, this, i));
        }
        this.setLevel(this.player.getLevel());
    }
    Controller.prototype.setXp = function (xp) {
        this.currentXp = xp + 0;
        //this.UserInterface.updateXP(xp):
    };
    Controller.prototype.setLevel = function (level) {
        this.level = level + 0;
        this.xpToNextLevel = actorConfig_1.defaultActorConfig.XPPerLevel * Math.pow(actorConfig_1.defaultActorConfig.LevelXPMultiplier, level - 1) + 0;
        this.setXp(0);
        this.setAbilities();
        //this.UserInterface.updateLevel(level):
    };
    Controller.prototype.setCurrentCastingAbility = function (abilityIndex) {
        if (this.currentCastingAbility !== undefined)
            this.abilityData[this.currentCastingAbility].stopFunc();
        this.currentCastingAbility = abilityIndex;
    };
    Controller.prototype.resetCurrentCastingAbility = function () {
        this.currentCastingAbility = undefined;
    };
    Controller.prototype.pressAbility = function (abilityIndex) {
        if (this.abilityData[abilityIndex].attemptFunc()) {
            this.updateFacing();
            this.abilityData[abilityIndex].pressFunc(this.game.getGlobalMousePos());
            return true;
        }
        return false;
    };
    Controller.prototype.releaseAbility = function (abilityIndex) {
        if (this.abilityData[abilityIndex].type === "hold") {
            this.abilityData[abilityIndex].releaseFunc();
        }
    };
    Controller.prototype.getAbilityStatus = function () {
        return this.abilityData;
    };
    Controller.prototype.setGlobalCooldown = function (time) {
        this.globalCooldown = time + 0;
    };
    Controller.prototype.resetGlobalCooldown = function () {
        this.globalCooldown = 0;
    };
    Controller.prototype.setNegativeGlobalCooldown = function () {
        this.globalCooldown = -0.1;
    };
    Controller.prototype.updateGlobalCooldown = function (elapsedTime) {
        if (this.globalCooldown === 0) {
            return;
        }
        else if (this.globalCooldown > 0) {
            this.globalCooldown -= elapsedTime;
            if (this.globalCooldown < 0) {
                this.globalCooldown = 0;
            }
        }
    };
    Controller.prototype.updateAbilities = function (elapsedTime) {
        for (var i = 0; i < 4; i++) {
            this.abilityData[i].updateFunc(elapsedTime);
        }
    };
    Controller.prototype.updateFacing = function () {
        var mousePos = this.game.getGlobalMousePos();
        if (mousePos.x > this.player.position.x) {
            if (!this.player.facingRight) {
                this.player.facingRight = true;
                this.player.updateFacingFromServer(true);
                this.game.serverTalker.sendMessage({
                    type: "clientPlayerFacingUpdate",
                    playerid: this.player.getActorId(),
                    facingRight: this.player.facingRight,
                });
                //broadcast
            }
        }
        else {
            if (this.player.facingRight) {
                this.player.facingRight = false;
                this.player.updateFacingFromServer(false);
                this.game.serverTalker.sendMessage({
                    type: "clientPlayerFacingUpdate",
                    playerid: this.player.getActorId(),
                    facingRight: this.player.facingRight,
                });
                //broadcast
            }
        }
    };
    Controller.prototype.update = function (elapsedTime) {
        this.updateGlobalCooldown(elapsedTime);
        if (this.currentCastingAbility !== undefined) {
            this.abilityData[this.currentCastingAbility].castUpdateFunc(elapsedTime);
        }
        else {
            this.updateFacing();
        }
        this.updateAbilities(elapsedTime);
    };
    return Controller;
}());
exports.Controller = Controller;


/***/ }),

/***/ "./src/objects/clientControllers/controllers/daggersController.ts":
/*!************************************************************************!*\
  !*** ./src/objects/clientControllers/controllers/daggersController.ts ***!
  \************************************************************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: top-level-this-exports, __webpack_exports__, __webpack_require__ */
/*! CommonJS bailout: this is used directly at 2:17-21 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.DaggersController = void 0;
var daggersLungeAbility_1 = __webpack_require__(/*! ./abilities/daggersAbilities/daggersLungeAbility */ "./src/objects/clientControllers/controllers/abilities/daggersAbilities/daggersLungeAbility.ts");
var daggersStabAbility_1 = __webpack_require__(/*! ./abilities/daggersAbilities/daggersStabAbility */ "./src/objects/clientControllers/controllers/abilities/daggersAbilities/daggersStabAbility.ts");
var controller_1 = __webpack_require__(/*! ./controller */ "./src/objects/clientControllers/controllers/controller.ts");
var DaggersController = /** @class */ (function (_super) {
    __extends(DaggersController, _super);
    function DaggersController(game, player) {
        var _this = _super.call(this, game, player) || this;
        _this.game = game;
        _this.player = player;
        return _this;
    }
    DaggersController.prototype.setAbilities = function () {
        switch (this.player.getSpec()) {
            default:
                this.abilityData[0] = new daggersStabAbility_1.DaggersStabAbility(this.game, this.player, this, 0);
                this.abilityData[1] = new daggersLungeAbility_1.DaggersLungeAbility(this.game, this.player, this, 1);
        }
    };
    DaggersController.prototype.sendServerDaggersAbility = function (ability, starting, mousePos) {
        this.game.serverTalker.sendMessage({
            type: "clientDaggersMessage",
            originId: this.player.getActorId(),
            position: this.player.position,
            momentum: this.player.momentum,
            msg: {
                type: "clientDaggersAbility",
                abilityType: ability,
                mousePos: mousePos,
                starting: starting,
            },
        });
    };
    return DaggersController;
}(controller_1.Controller));
exports.DaggersController = DaggersController;


/***/ }),

/***/ "./src/objects/clientControllers/controllers/hammerController.ts":
/*!***********************************************************************!*\
  !*** ./src/objects/clientControllers/controllers/hammerController.ts ***!
  \***********************************************************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: top-level-this-exports, __webpack_exports__, __webpack_require__ */
/*! CommonJS bailout: this is used directly at 2:17-21 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.HammerController = void 0;
var hammerPoundAbility_1 = __webpack_require__(/*! ./abilities/hammerAbilities/hammerPoundAbility */ "./src/objects/clientControllers/controllers/abilities/hammerAbilities/hammerPoundAbility.ts");
var hammerSwingAbility_1 = __webpack_require__(/*! ./abilities/hammerAbilities/hammerSwingAbility */ "./src/objects/clientControllers/controllers/abilities/hammerAbilities/hammerSwingAbility.ts");
var controller_1 = __webpack_require__(/*! ./controller */ "./src/objects/clientControllers/controllers/controller.ts");
var HammerController = /** @class */ (function (_super) {
    __extends(HammerController, _super);
    function HammerController(game, player) {
        var _this = _super.call(this, game, player) || this;
        _this.game = game;
        _this.player = player;
        return _this;
    }
    HammerController.prototype.setAbilities = function () {
        switch (this.player.getSpec()) {
            default:
                this.abilityData[0] = new hammerSwingAbility_1.HammerSwingAbility(this.game, this.player, this, 0);
                this.abilityData[1] = new hammerPoundAbility_1.HammerPoundAbility(this.game, this.player, this, 1);
        }
    };
    HammerController.prototype.sendServerHammerAbility = function (ability, starting, mousePos) {
        this.game.serverTalker.sendMessage({
            type: "clientHammerMessage",
            originId: this.player.getActorId(),
            position: this.player.position,
            momentum: this.player.momentum,
            msg: {
                type: "clientHammerAbility",
                abilityType: ability,
                mousePos: mousePos,
                starting: starting,
            },
        });
    };
    return HammerController;
}(controller_1.Controller));
exports.HammerController = HammerController;


/***/ }),

/***/ "./src/objects/clientControllers/controllers/swordController.ts":
/*!**********************************************************************!*\
  !*** ./src/objects/clientControllers/controllers/swordController.ts ***!
  \**********************************************************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: top-level-this-exports, __webpack_exports__, __webpack_require__ */
/*! CommonJS bailout: this is used directly at 2:17-21 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.SwordController = void 0;
var swordSlashAbility_1 = __webpack_require__(/*! ./abilities/swordAbilities/swordSlashAbility */ "./src/objects/clientControllers/controllers/abilities/swordAbilities/swordSlashAbility.ts");
var swordWhirlwindAbility_1 = __webpack_require__(/*! ./abilities/swordAbilities/swordWhirlwindAbility */ "./src/objects/clientControllers/controllers/abilities/swordAbilities/swordWhirlwindAbility.ts");
var controller_1 = __webpack_require__(/*! ./controller */ "./src/objects/clientControllers/controllers/controller.ts");
var SwordController = /** @class */ (function (_super) {
    __extends(SwordController, _super);
    function SwordController(game, player) {
        var _this = _super.call(this, game, player) || this;
        _this.game = game;
        _this.player = player;
        return _this;
    }
    SwordController.prototype.setAbilities = function () {
        switch (this.player.getSpec()) {
            default:
                this.abilityData[0] = new swordSlashAbility_1.SwordSlashAbility(this.game, this.player, this, 0);
                this.abilityData[1] = new swordWhirlwindAbility_1.SwordWhirlWindAbility(this.game, this.player, this, 1);
        }
    };
    SwordController.prototype.sendServerSwordAbility = function (ability, starting, mousePos) {
        this.game.serverTalker.sendMessage({
            type: "clientSwordMessage",
            originId: this.player.getActorId(),
            position: this.player.position,
            momentum: this.player.momentum,
            msg: {
                type: "clientSwordAbility",
                abilityType: ability,
                mousePos: mousePos,
                starting: starting,
            },
        });
    };
    return SwordController;
}(controller_1.Controller));
exports.SwordController = SwordController;


/***/ }),

/***/ "./src/objects/clientControllers/inputReader.ts":
/*!******************************************************!*\
  !*** ./src/objects/clientControllers/inputReader.ts ***!
  \******************************************************/
/*! flagged exports */
/*! export InputReader [provided] [no usage info] [missing usage info prevents renaming] */
/*! export __esModule [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__, __webpack_require__ */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


exports.__esModule = true;
exports.InputReader = void 0;
var config_1 = __webpack_require__(/*! ../../config */ "./src/config.ts");
var userInterface_1 = __webpack_require__(/*! ./userInterface */ "./src/objects/clientControllers/userInterface.ts");
var daggersController_1 = __webpack_require__(/*! ./controllers/daggersController */ "./src/objects/clientControllers/controllers/daggersController.ts");
var hammerController_1 = __webpack_require__(/*! ./controllers/hammerController */ "./src/objects/clientControllers/controllers/hammerController.ts");
var swordController_1 = __webpack_require__(/*! ./controllers/swordController */ "./src/objects/clientControllers/controllers/swordController.ts");
var InputReader = /** @class */ (function () {
    function InputReader(player, game) {
        this.player = player;
        this.game = game;
        this.keyState = {};
        this.pressAbilitiesNextFrame = [false, false, false, false];
        this.releaseAbilitiesNextFrame = [false, false, false, false];
        this.config = config_1.defaultConfig;
        this.jumpCount = 0;
        this.wasMovingRight = false;
        this.wasMovingLeft = false;
        this.wasCrouching = false;
        switch (this.player.getClassType()) {
            case "daggers":
                this.controller = new daggersController_1.DaggersController(this.game, this.player);
                break;
            case "hammer":
                this.controller = new hammerController_1.HammerController(this.game, this.player);
                break;
            case "sword":
                this.controller = new swordController_1.SwordController(this.game, this.player);
                break;
            default:
                throw new Error("unknown class type in input reader constructor");
        }
        this.userInterface = new userInterface_1.UserInterface(this.controller, this.player);
    }
    InputReader.prototype.registerMouseDown = function (e, globalMousePos) {
        if (e.button === 0) {
            this.pressAbilitiesNextFrame[0] = true;
        }
        else if (e.button === 2) {
            this.pressAbilitiesNextFrame[1] = true;
        }
    };
    InputReader.prototype.registerMouseUp = function (e, globalMousePos) {
        if (e.button === 0) {
            this.releaseAbilitiesNextFrame[0] = true;
        }
        else if (e.button === 2) {
            this.releaseAbilitiesNextFrame[1] = true;
        }
    };
    InputReader.prototype.registerKeyDown = function (e, globalMousePos) {
        if (e.code === this.config.playerKeys.firstAbility) {
            this.pressAbilitiesNextFrame[2] = true;
        }
        else if (e.code === this.config.playerKeys.secondAbility) {
            this.pressAbilitiesNextFrame[3] = true;
        }
        this.keyState[e.code] = true;
    };
    InputReader.prototype.registerKeyUp = function (e, globalMousePos) {
        if (e.code === this.config.playerKeys.firstAbility) {
            this.releaseAbilitiesNextFrame[2] = true;
        }
        else if (e.code === this.config.playerKeys.secondAbility) {
            this.releaseAbilitiesNextFrame[3] = true;
        }
        this.keyState[e.code] = false;
    };
    InputReader.prototype.updateGamePlayerMoveActions = function () {
        var tempWasMovingLeft = false;
        this.player.moveActionsNextFrame.moveLeft = false;
        if (this.keyState[this.config.playerKeys.left]) {
            if (this.player.attemptMoveLeftAction())
                tempWasMovingLeft = true;
        }
        if (tempWasMovingLeft !== this.wasMovingLeft) {
            this.game.serverTalker.sendMessage({
                type: "clientPlayerAction",
                playerId: this.player.getActorId(),
                actionType: "moveLeft",
                starting: tempWasMovingLeft,
                position: this.player.position,
                momentum: this.player.momentum,
            });
            this.wasMovingLeft = tempWasMovingLeft;
        }
        var tempWasMovingRight = false;
        this.player.moveActionsNextFrame.moveRight = false;
        if (this.keyState[this.config.playerKeys.right]) {
            if (this.player.attemptMoveRightAction())
                tempWasMovingRight = true;
        }
        if (tempWasMovingRight !== this.wasMovingRight) {
            this.game.serverTalker.sendMessage({
                type: "clientPlayerAction",
                playerId: this.player.getActorId(),
                actionType: "moveRight",
                starting: tempWasMovingRight,
                position: this.player.position,
                momentum: this.player.momentum,
            });
            this.wasMovingRight = tempWasMovingRight;
        }
        var tempWasCrouching = false;
        this.player.moveActionsNextFrame.crouch = false;
        if (this.keyState[this.config.playerKeys.down]) {
            if (this.player.attemptCrouchAction())
                tempWasCrouching = true;
        }
        if (tempWasCrouching !== this.wasCrouching) {
            this.game.serverTalker.sendMessage({
                type: "clientPlayerAction",
                playerId: this.player.getActorId(),
                actionType: "crouch",
                starting: tempWasCrouching,
                position: this.player.position,
                momentum: this.player.momentum,
            });
            this.wasCrouching = tempWasCrouching;
        }
        if (this.player.actorObject.standing) {
            this.jumpCount = 0;
        }
        if (this.keyState[this.config.playerKeys.up]) {
            if (this.jumpCount < 2 && this.player.attemptJumpAction()) {
                this.game.serverTalker.sendMessage({
                    type: "clientPlayerAction",
                    playerId: this.player.getActorId(),
                    actionType: "jump",
                    starting: true,
                    position: this.player.position,
                    momentum: this.player.momentum,
                });
                this.jumpCount++;
            }
            this.keyState[this.config.playerKeys.up] = false;
        }
    };
    InputReader.prototype.updateGamePlayerAbilities = function () {
        for (var i = 0; i < 4; i++) {
            if (this.pressAbilitiesNextFrame[i] === true) {
                this.controller.pressAbility(i);
                if (i !== 0)
                    this.pressAbilitiesNextFrame[i] = false;
            }
        }
        for (var i = 0; i < 4; i++) {
            if (this.releaseAbilitiesNextFrame[i] === true) {
                this.controller.releaseAbility(i);
                this.releaseAbilitiesNextFrame[i] = false;
                if (i === 0)
                    this.pressAbilitiesNextFrame[i] = false;
            }
        }
    };
    InputReader.prototype.update = function (elapsedTime) {
        this.updateGamePlayerMoveActions();
        this.updateGamePlayerAbilities();
        this.controller.update(elapsedTime);
        this.userInterface.updateAndRender();
    };
    return InputReader;
}());
exports.InputReader = InputReader;


/***/ }),

/***/ "./src/objects/clientControllers/userInterface.ts":
/*!********************************************************!*\
  !*** ./src/objects/clientControllers/userInterface.ts ***!
  \********************************************************/
/*! flagged exports */
/*! export UserInterface [provided] [no usage info] [missing usage info prevents renaming] */
/*! export __esModule [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__, __webpack_require__ */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


exports.__esModule = true;
exports.UserInterface = void 0;
var assetmanager_1 = __webpack_require__(/*! ../../client/gameRender/assetmanager */ "./src/client/gameRender/assetmanager.ts");
var util_1 = __webpack_require__(/*! ../../client/util */ "./src/client/util.ts");
var actorConfig_1 = __webpack_require__(/*! ../newActors/actorConfig */ "./src/objects/newActors/actorConfig.ts");
var gameRenderer_1 = __webpack_require__(/*! ../../client/gameRender/gameRenderer */ "./src/client/gameRender/gameRenderer.ts");
var UserInterface = /** @class */ (function () {
    function UserInterface(controller, player) {
        var _this = this;
        this.controller = controller;
        this.player = player;
        this.currentXP = 0;
        //protected readonly portraitElement: HTMLCanvasElement = safeGetElementById("portraitCanvas") as HTMLCanvasElement;
        //protected readonly portraitCanvas: CanvasRenderingContext2D = this.portraitElement.getContext("2d")!;
        this.healthChanged = true;
        this.healthElement = util_1.safeGetElementById("healthCanvas");
        this.healthCanvas = this.healthElement.getContext("2d");
        this.abilityElement = util_1.safeGetElementById("abilityCanvas");
        this.abilityCanvas = this.abilityElement.getContext("2d");
        this.abilityChanged = [true, true, true, true];
        this.iconCooldownLastFrame = [-1, -1, -1, -1];
        this.globalCooldownLastFrame = -1;
        this.renderAbilityIconFunctions = [
            function () {
                _this.renderAbilityIcon({ x: 5, y: 30 }, 70, 0);
            },
            function () {
                _this.renderAbilityIcon({ x: 90, y: 30 }, 70, 1);
            },
            function () {
                _this.renderAbilityIcon({ x: 180, y: 30 }, 60, 2);
            },
            function () {
                _this.renderAbilityIcon({ x: 255, y: 30 }, 60, 3);
            },
        ];
        this.playerAbilityStatus = this.controller.getAbilityStatus();
        //this.portraitElement.width = 50;
        //this.portraitElement.height = 50;
        this.healthElement.width = 250;
        this.healthElement.height = 75;
        this.abilityElement.width = 400;
        this.abilityElement.height = 120;
        this.healthInfo = player.getHealthInfo();
        this.displayHealth = this.healthInfo.health + 0;
        this.currentLevel = this.player.getLevel();
        this.XPtoNextLevel = actorConfig_1.defaultActorConfig.XPPerLevel * Math.pow(actorConfig_1.defaultActorConfig.LevelXPMultiplier, this.currentLevel);
        //this.levelCountElement.innerText = String(this.currentLevel);
        this.updateXPbar(0);
        this.abilityImages = getAbilityImages(this.player.getClassType(), this.currentLevel, this.player.getSpec());
        this.updatePassiveAbility(this.abilityImages[4]);
        //this.updateAbilityImages(this.player.getClassType(), this.currentLevel, this.player.getSpec());
    }
    UserInterface.prototype.updateXPbar = function (quantity) {
        this.currentXP = quantity;
        this.renderPortrait();
    };
    UserInterface.prototype.levelUp = function (level) {
        this.currentLevel = level;
        this.XPtoNextLevel = actorConfig_1.defaultActorConfig.XPPerLevel * Math.pow(actorConfig_1.defaultActorConfig.LevelXPMultiplier, this.currentLevel);
        this.updateXPbar(0);
    };
    UserInterface.prototype.registerKeyOrMouseChange = function (index) {
        this.abilityChanged[index] = true;
    };
    /*public updateAbilityImages(classType: ClassType, level: number, spec: number) {
        this.abilityImages = getAbilityImages(classType, level, spec);
        this.abilitiesChanged = true;
        for (let i: number = 0; i < 5; i++) {
            this.abilityChanged[i] = true;
        }
    }*/
    UserInterface.prototype.updateAndRender = function () {
        if (this.displayHealth + 5 < this.healthInfo.health) {
            this.displayHealth += 5;
            this.healthChanged = true;
        }
        else if (this.displayHealth - 5 > this.healthInfo.health) {
            this.displayHealth -= 5;
            this.healthChanged = true;
        }
        else if (this.displayHealth !== this.healthInfo.health) {
            this.displayHealth = this.healthInfo.health + 0;
            this.healthChanged = true;
        }
        if (this.healthChanged) {
            this.renderHealth();
            this.healthChanged = false;
        }
        this.renderAbilities();
    };
    UserInterface.prototype.renderHealth = function () {
        //this.healthCanvas.clearRect(0, 0, this.healthElement.width, 20);
        this.healthCanvas.fillStyle = "rgb(230, 230, 230)";
        var segments = Math.ceil(this.healthInfo.maxHealth / 20);
        var width = this.healthElement.width / segments;
        for (var i = 0; i < segments; i++) {
            gameRenderer_1.roundRect(this.healthCanvas, i * width + 1, 10, width - 2, 40, 4, true, false);
        }
        this.healthCanvas.clearRect(this.healthElement.width, 0, this.healthElement.width * (this.displayHealth / this.healthInfo.maxHealth - 1), this.healthElement.height);
        this.healthCanvas.fillStyle = "rgba(230, 230, 230, 0.2)";
        for (var i = 0; i < segments; i++) {
            gameRenderer_1.roundRect(this.healthCanvas, i * width + 1, 10, width - 2, 40, 4, true, false);
        }
    };
    UserInterface.prototype.renderPortrait = function () {
        /*this.portraitCanvas.clearRect(0, 0, this.portraitElement.width, this.portraitElement.height);

        //XP render
        this.portraitCanvas.strokeStyle = "yellow";
        roundHex(this.portraitCanvas, 0, 0, this.portraitElement.width, this.portraitElement.height, 10, 5, true);
        this.portraitCanvas.clearRect(0, 0, this.portraitElement.width, 1 + this.portraitElement.height * (1 - this.currentXP) * 0.95);

        this.portraitCanvas.strokeStyle = "rgb(230, 230, 230)";
        roundHex(this.portraitCanvas, 4, 4, this.portraitElement.width - 8, this.portraitElement.height - 8, 5, 4, true);*/
    };
    UserInterface.prototype.renderLevel = function () { };
    UserInterface.prototype.updatePassiveAbility = function (img) {
        this.abilityCanvas.lineWidth = 1;
        this.abilityCanvas.strokeStyle = "rgb(230, 230, 230)";
        this.abilityCanvas.clearRect(330, 30, 55, 55);
        gameRenderer_1.roundRect(this.abilityCanvas, 333, 32, 50, 50, 10, false, true);
        this.abilityCanvas.drawImage(img, 333, 32, 50, 50);
    };
    UserInterface.prototype.renderAbilities = function () {
        for (var i = 0; i < this.renderAbilityIconFunctions.length; i++) {
            if (this.globalCooldownLastFrame !== this.controller.globalCooldown || this.iconCooldownLastFrame[i] !== this.playerAbilityStatus[i].cooldown) {
                this.abilityCanvas.fillStyle = "rgb(255, 255, 255)";
                this.renderAbilityIconFunctions[i]();
                this.abilityChanged[i] = false;
                this.iconCooldownLastFrame[i] = this.playerAbilityStatus[i].cooldown + 0;
            }
        }
        this.globalCooldownLastFrame = this.controller.globalCooldown;
    };
    UserInterface.prototype.renderAbilityIcon = function (pos, sideLength, abilityIndex) {
        this.abilityCanvas.clearRect(pos.x - 2, pos.y - 2, sideLength + 4, sideLength + 4);
        var percentCooldown = this.playerAbilityStatus[abilityIndex].getIconCooldownPercent();
        if (percentCooldown === 0) {
            gameRenderer_1.roundRect(this.abilityCanvas, pos.x, pos.y, sideLength, sideLength, 5, true, false);
        }
        else {
            if (percentCooldown !== 1) {
                this.abilityCanvas.fillStyle = "rgba(200, 200, 200, 0.4)";
                gameRenderer_1.roundRect(this.abilityCanvas, pos.x, pos.y, sideLength, sideLength, 5, true, false);
                this.abilityCanvas.clearRect(pos.x - 2, pos.y, sideLength + 4, sideLength * percentCooldown + 2);
            }
            this.abilityCanvas.fillStyle = "rgba(200, 200, 200, 0.2)";
            gameRenderer_1.roundRect(this.abilityCanvas, pos.x, pos.y, sideLength, sideLength, 5, true, false);
        }
        this.abilityCanvas.globalCompositeOperation = "destination-out";
        this.abilityCanvas.drawImage(this.playerAbilityStatus[abilityIndex].img, pos.x, pos.y, sideLength, sideLength);
        this.abilityCanvas.globalCompositeOperation = "source-over";
    };
    return UserInterface;
}());
exports.UserInterface = UserInterface;
function roundHex(ctx, x, y, width, height, radius, strokeWidth, flat) {
    ctx.lineWidth = radius * 2;
    ctx.lineJoin = "round";
    var renderFlat = function () {
        var widthDif = (width + radius) / 4;
        var heightDif = height / 2 - ((height - radius * 2) * Math.pow(3, 0.5)) / 4;
        ctx.beginPath();
        ctx.moveTo(x + widthDif, y + heightDif);
        ctx.lineTo(x + radius, y + height / 2);
        ctx.lineTo(x + widthDif, y + height - heightDif);
        ctx.lineTo(x + width - widthDif, y + height - heightDif);
        ctx.lineTo(x + width - radius, y + height / 2);
        ctx.lineTo(x + width - widthDif, y + heightDif);
        ctx.closePath();
    };
    var renderTall = function () {
        var heightDif = (height + radius) / 4;
        var widthDif = width / 2 - ((width - radius * 2) * Math.pow(3, 0.5)) / 4;
        ctx.beginPath();
        ctx.moveTo(x + widthDif, y + heightDif);
        ctx.lineTo(x + width / 2, y + radius);
        ctx.lineTo(x + width - widthDif, y + heightDif);
        ctx.lineTo(x + width - widthDif, y + height - heightDif);
        ctx.lineTo(x + width / 2, y + height - radius);
        ctx.lineTo(x + widthDif, y + height - heightDif);
        ctx.closePath();
    };
    if (flat)
        renderFlat();
    else
        renderTall();
    ctx.stroke();
    x += strokeWidth;
    y += strokeWidth;
    width -= strokeWidth * 2;
    height -= strokeWidth * 2;
    radius -= strokeWidth / 3;
    ctx.globalCompositeOperation = "destination-out";
    if (flat)
        renderFlat();
    else
        renderTall();
    ctx.stroke();
    ctx.globalCompositeOperation = "source-over";
}
function getAbilityImages(classType, level, spec) {
    var abilityImages = [
        assetmanager_1.assetManager.images["emptyIcon"],
        assetmanager_1.assetManager.images["emptyIcon"],
        assetmanager_1.assetManager.images["lvl6"],
        assetmanager_1.assetManager.images["lvl10"],
        assetmanager_1.assetManager.images["lvl6"],
    ];
    switch (classType) {
        case "daggers":
            if (spec === 0) {
                abilityImages[0] = assetmanager_1.assetManager.images["stabIcon"];
                abilityImages[1] = assetmanager_1.assetManager.images["lungeIcon"];
            }
            else if (spec === 1) {
                // Monk
            }
            else if (spec === 2) {
                // Assassin
            }
            break;
        case "sword":
            if (spec === 0) {
                abilityImages[0] = assetmanager_1.assetManager.images["slashIcon"];
                abilityImages[1] = assetmanager_1.assetManager.images["whirlwindIcon"];
            }
            else if (spec === 1) {
                // Berserker
            }
            else if (spec === 2) {
                // Blademaster
            }
            break;
        case "hammer":
            if (spec === 0) {
                abilityImages[0] = assetmanager_1.assetManager.images["swingIcon"];
                abilityImages[1] = assetmanager_1.assetManager.images["poundIcon"];
            }
            else if (spec === 1) {
                // Paladin
            }
            else if (spec === 2) {
                // Warden
            }
            break;
        default:
            throw new Error("Unknown class type in UserInterface's getAbilityImages");
    }
    return abilityImages;
}
var playerInfo;


/***/ }),

/***/ "./src/objects/newActors/actor.ts":
/*!****************************************!*\
  !*** ./src/objects/newActors/actor.ts ***!
  \****************************************/
/*! flagged exports */
/*! export Actor [provided] [no usage info] [missing usage info prevents renaming] */
/*! export __esModule [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__ */
/***/ ((__unused_webpack_module, exports) => {


exports.__esModule = true;
exports.Actor = void 0;
var Actor = /** @class */ (function () {
    function Actor(actorType, id, position, momentum, healthInfo) {
        this.actorType = actorType;
        this.id = id;
        this.position = position;
        this.momentum = momentum;
        this.healthInfo = healthInfo;
    }
    Actor.prototype.getCollisionRange = function () {
        return this.actorObject.getCollisionRange();
    };
    Actor.prototype.getActorType = function () {
        return this.actorType;
    };
    Actor.prototype.getActorId = function () {
        return this.id;
    };
    Actor.prototype.getMaxHealth = function () {
        return this.healthInfo.maxHealth;
    };
    Actor.prototype.getHealth = function () {
        return this.healthInfo.health;
    };
    Actor.prototype.getHealthInfo = function () {
        return this.healthInfo;
    };
    Actor.prototype.startTranslation = function (angle, translationName) {
        this.actorObject.startTranslation(angle, translationName);
    };
    Actor.prototype.updatePositionAndMomentum = function (momentum, position) {
        this.position.x = position.x + 0;
        this.position.y = position.y + 0;
        this.momentum.x = momentum.x + 0;
        this.momentum.y = momentum.y + 0;
    };
    //protected abstract registerDeath(): void;
    Actor.prototype.registerDamageDone = function (quantity) { };
    Actor.prototype.registerKillDone = function () { };
    Actor.prototype.registerKnockback = function (force) {
        this.actorObject.registerKnockback(force);
    };
    /**
     * @param p1 start point of the line.
     * @param p2 end point of the line.
     * @returns returns true if the line intersects with the shape.
     */
    Actor.prototype.checkIfCollidesWithLine = function (p1, p2) {
        return this.actorObject.checkIfCollidesWithLine(p1, p2);
    };
    /**
     * @param largeShape Shape of the object in question.
     * @returns true if any point of this actorObject falls inside the object in question.
     */
    Actor.prototype.ifInsideLargerShape = function (largeShape) {
        if (this.actorObject.ifInsideLargerShape(largeShape)) {
            return true;
        }
        return false;
    };
    /**
     * @param smallShape Shape of the object in question.
     * @returns true if any point of the object in question falls inside this actorObject.
     */
    Actor.prototype.ifInsideSmallerShape = function (smallShape) {
        return this.actorObject.ifInsideSmallerShape(smallShape);
    };
    return Actor;
}());
exports.Actor = Actor;


/***/ }),

/***/ "./src/objects/newActors/actorConfig.ts":
/*!**********************************************!*\
  !*** ./src/objects/newActors/actorConfig.ts ***!
  \**********************************************/
/*! flagged exports */
/*! export __esModule [provided] [no usage info] [missing usage info prevents renaming] */
/*! export defaultActorConfig [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__, __webpack_require__ */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


exports.__esModule = true;
exports.defaultActorConfig = void 0;
var playerModel_1 = __webpack_require__(/*! ./clientActors/model/playerModels/playerModel */ "./src/objects/newActors/clientActors/model/playerModels/playerModel.ts");
exports.defaultActorConfig = {
    gameSpeed: 1,
    dirtColorNight: "#1c262c",
    dirtColorDay: "#402f17",
    playerStart: {
        x: 300,
        y: 650,
    },
    playerSize: {
        width: 53,
        height: 55,
    },
    playerCrouchSize: {
        width: 57,
        height: 36,
    },
    playerMass: 10,
    playerMaxHealth: 100,
    playerJumpHeight: 1000,
    maxSidewaysMomentum: 500,
    standingSidewaysAcceleration: 6000,
    nonStandingSidewaysAcceleration: 1500,
    fallingAcceleration: 300,
    XPPerLevel: 20,
    LevelXPMultiplier: 1.1,
    globalCooldown: 0.2,
    playerModelConfig: playerModel_1.playerModelConfig,
};


/***/ }),

/***/ "./src/objects/newActors/actorObjects/actorObject.ts":
/*!***********************************************************!*\
  !*** ./src/objects/newActors/actorObjects/actorObject.ts ***!
  \***********************************************************/
/*! flagged exports */
/*! export ActorObject [provided] [no usage info] [missing usage info prevents renaming] */
/*! export __esModule [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__, __webpack_require__ */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


exports.__esModule = true;
exports.ActorObject = void 0;
var config_1 = __webpack_require__(/*! ../../../config */ "./src/config.ts");
var ifInside_1 = __webpack_require__(/*! ../../../ifInside */ "./src/ifInside.ts");
var ifIntersect_1 = __webpack_require__(/*! ../../../ifIntersect */ "./src/ifIntersect.ts");
var actorConfig_1 = __webpack_require__(/*! ../actorConfig */ "./src/objects/newActors/actorConfig.ts");
var translations_1 = __webpack_require__(/*! ./translations */ "./src/objects/newActors/actorObjects/translations.ts");
var ActorObject = /** @class */ (function () {
    function ActorObject(globalObjects, baseActor, position, momentum, size, mass) {
        this.globalObjects = globalObjects;
        this.baseActor = baseActor;
        this.position = position;
        this.momentum = momentum;
        this.size = size;
        this.mass = mass;
        this.xSize = config_1.defaultConfig.xSize;
        this.ySize = config_1.defaultConfig.ySize;
        //rectangle vector
        //platform vector
        //floor pointer
        this.translationData = {
            translateInfo: undefined,
            keyIndex: 0,
            originalPosition: { x: 0, y: 0 },
            counter: 0,
            keyTimeLength: 0,
            angle: 0,
        };
        //position solver
        this.previousMomentum = { x: 0, y: 0 };
        this.previousPosition = { x: 0, y: 0 };
        this.previousMomentum.x = this.momentum.x;
        this.previousMomentum.y = this.momentum.y;
        this.previousPosition.x = this.position.x;
        this.previousPosition.y = this.position.y;
    }
    ActorObject.prototype.checkIfCollidesWithLine = function (p1, p2) {
        var personalShape = this.getGlobalShape();
        for (var i = 0; i < personalShape.edges.length; i++) {
            if (ifIntersect_1.ifIntersect(personalShape.edges[i].p1, personalShape.edges[i].p2, p1, p2)) {
                return true;
            }
        }
        //last check in case the line is inside object
        if (ifInside_1.ifInside(p1, personalShape.points))
            return true;
        return false;
    };
    ActorObject.prototype.ifInsideLargerShape = function (largeShape) {
        var personalShape = this.getGlobalShape();
        for (var i = 0; i < personalShape.points.length; i++) {
            if (ifInside_1.ifInside(personalShape.points[i], largeShape)) {
                return true;
            }
        }
        return false;
    };
    ActorObject.prototype.ifInsideSmallerShape = function (smallShape) {
        var personalShape = this.getGlobalShape();
        for (var i = 0; i < smallShape.length; i++) {
            if (ifInside_1.ifInside(smallShape[i], personalShape.points)) {
                return true;
            }
        }
        return false;
    };
    ActorObject.prototype.registerGravity = function (elapsedTime) {
        this.momentum.y += actorConfig_1.defaultActorConfig.fallingAcceleration * elapsedTime * this.mass;
    };
    ActorObject.prototype.registerGroundFriction = function (elapsedTime) {
        //if (Math.abs(this.momentum.x) <= 10) this.momentum.x = 0;
        //else this.momentum.x -= elapsedTime * this.mass * (this.momentum.x <= 0 ? -1 : 1) * 600;
        if (this.momentum.x > 0) {
            this.momentum.x -= elapsedTime * this.mass * 600;
            if (this.momentum.x < 0)
                this.momentum.x = 0;
        }
        else if (this.momentum.x < 0) {
            this.momentum.x += elapsedTime * this.mass * 600;
            if (this.momentum.x > 0)
                this.momentum.x = 0;
        }
    };
    ActorObject.prototype.registerAirResistance = function (elapsedTime) {
        return;
        if (Math.abs(this.momentum.x) <= 3)
            this.momentum.x = 0;
        else
            this.momentum.x -= elapsedTime * this.mass * (this.momentum.x <= 0 ? -1 : 1) * 30;
        if (Math.abs(this.momentum.y) <= 3)
            this.momentum.y = 0;
        else
            this.momentum.y -= elapsedTime * this.mass * (this.momentum.y <= 0 ? -1 : 1) * 30;
    };
    ActorObject.prototype.registerKnockback = function (force) {
        this.momentum.x = (force.x * 3 + this.momentum.x) / 4;
        this.momentum.y = (force.y * 3 + this.momentum.y) / 4;
    };
    ActorObject.prototype.checkXBoundaryCollision = function () {
        if (this.position.x - this.size.width / 2 < 0) {
            this.position.x = this.size.width / 2;
            this.momentum.x = Math.max(this.momentum.x, 0);
        }
        else if (this.position.x + this.size.width / 2 > this.xSize) {
            this.position.x = this.xSize - this.size.width / 2;
            this.momentum.x = Math.min(this.momentum.x, 0);
        }
    };
    ActorObject.prototype.checkYBoundaryCollision = function () {
        if (this.position.y - this.size.height / 2 < 1) {
            this.position.y = this.size.height / 2 + 1;
            this.momentum.y = Math.max(this.momentum.y, 0);
        }
        else if (this.position.y + this.size.height / 2 > this.ySize) {
            this.position.y = this.ySize - this.size.height / 2;
            this.momentum.y = Math.min(this.momentum.y, 0);
            return true;
        }
        return false;
    };
    ActorObject.prototype.checkRectangles = function (elapsedTime) {
        //for each rectangle, check rectangle collision IF no translation or translation allows it
    };
    ActorObject.prototype.checkRectangleCollision = function (elapsedTime) { };
    ActorObject.prototype.checkPlatforms = function (elapsedTime) {
        //for each platform, check platform collision IF no translation or translation allows it
    };
    ActorObject.prototype.checkPlatformCollision = function (elapsedTime) { };
    ActorObject.prototype.checkGroundCollision = function (elapsedTime) {
        var data = this.globalObjects.floor.getYCoordAndAngle(this.position.x);
        var feetPos = this.position.y + this.size.height / 2;
        var ifHit = false;
        if (data.yCoord < feetPos) {
            this.position.y = data.yCoord - this.size.height / 2;
            this.momentum.y = Math.min(this.momentum.y, 0);
            ifHit = true;
        }
        return { hit: ifHit, angle: data.angle };
    };
    ActorObject.prototype.checkDoodads = function () {
        var _this = this;
        var actorShape = this.getGlobalShape();
        this.globalObjects.doodads.forEach(function (doodad) {
            _this.checkDoodadCollision(actorShape, doodad);
        });
    };
    ActorObject.prototype.checkDoodadCollision = function (actorShape, doodad) {
        if (doodad.checkCollisionRange(this.position, this.getCollisionRange())) {
            if (doodad.checkObjectIntersection(actorShape)) {
                var results = doodad.registerCollisionWithClosestSolution(actorShape, this.momentum);
                this.registerDoodadCollision(results.positionChange, results.momentumChange, results.angle);
            }
        }
    };
    ActorObject.prototype.registerDoodadCollision = function (positionChange, momentumChange, angle) {
        this.position.x += positionChange.x;
        this.position.y += positionChange.y;
        if (momentumChange) {
            this.momentum.x = momentumChange.x + 0;
            this.momentum.y = momentumChange.y + 0;
        }
        if (angle) {
            this.registerGroundAngle(angle, true);
        }
    };
    ActorObject.prototype.startTranslation = function (angle, translationName) {
        var _this = this;
        this.translationData.originalPosition.x = this.position.x + 0;
        this.translationData.originalPosition.y = this.position.y + 0;
        var newTranslation = translations_1.translations[translationName];
        this.translationData.translateInfo = {
            keys: newTranslation.keys.map(function (x) { return translations_1.rotateKey(x, angle, newTranslation.flipAcrossY); }),
            flipAcrossY: newTranslation.flipAcrossY,
            ignoreCollision: newTranslation.ignoreCollision,
            ignoreGravity: newTranslation.ignoreGravity,
        };
        this.translationData.keyIndex = 0;
        this.translationData.counter = 0;
        this.translationData.keyTimeLength = 0;
        this.translationData.translateInfo.keys.forEach(function (key) {
            _this.translationData.keyTimeLength += key.time;
        });
    };
    ActorObject.prototype.updateTranslation = function (elapsedTime) {
        if (this.translationData.translateInfo !== undefined) {
            this.translationData.counter += elapsedTime;
            if (this.translationData.counter >= this.translationData.translateInfo.keys[this.translationData.keyIndex].time) {
                //this.position.x = this.translationData.originalPosition.x + this.translationData.translateInfo.keys[this.translationData.keyIndex].pos.x;
                //this.position.y = this.translationData.originalPosition.y + this.translationData.translateInfo.keys[this.translationData.keyIndex].pos.y;
                this.translationData.keyIndex++;
                this.translationData.counter = 0;
                this.translationData.originalPosition.x = this.position.x + 0;
                this.translationData.originalPosition.y = this.position.y + 0;
                if (this.translationData.keyIndex === this.translationData.translateInfo.keys.length) {
                    this.endTranslation();
                    return;
                }
            }
            var runPercentage = this.translationData.counter / this.translationData.translateInfo.keys[this.translationData.keyIndex].time;
            var newPosition = {
                x: this.translationData.originalPosition.x + this.translationData.translateInfo.keys[this.translationData.keyIndex].pos.x * runPercentage,
                y: this.translationData.originalPosition.y + this.translationData.translateInfo.keys[this.translationData.keyIndex].pos.y * runPercentage,
            };
            this.momentum.x = (newPosition.x - this.position.x) / elapsedTime;
            if (this.translationData.translateInfo.ignoreGravity) {
                this.momentum.y = (newPosition.y - this.position.y) / elapsedTime;
            }
            else {
                this.momentum.y = ((newPosition.y - this.position.y) / elapsedTime + this.momentum.y) / 2;
            }
        }
    };
    ActorObject.prototype.endTranslation = function () {
        this.translationData.translateInfo = undefined;
    };
    ActorObject.prototype.positionUpdate = function (elapsedTime) {
        this.position.x += ((this.momentum.x + this.previousMomentum.x) * elapsedTime) / 2;
        this.position.y += ((this.momentum.y + this.previousMomentum.y) * elapsedTime) / 2;
        this.previousMomentum.x = this.momentum.x;
        this.previousMomentum.y = this.momentum.y;
    };
    ActorObject.prototype.previousPositionUpdate = function () {
        this.previousPosition.x = this.position.x;
        this.previousPosition.y = this.position.y;
    };
    return ActorObject;
}());
exports.ActorObject = ActorObject;


/***/ }),

/***/ "./src/objects/newActors/actorObjects/playerObject.ts":
/*!************************************************************!*\
  !*** ./src/objects/newActors/actorObjects/playerObject.ts ***!
  \************************************************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: top-level-this-exports, __webpack_exports__, __webpack_require__ */
/*! CommonJS bailout: this is used directly at 2:17-21 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.playerCrouchingShape = exports.playerStandingShape = exports.PlayerObject = void 0;
var actorConfig_1 = __webpack_require__(/*! ../actorConfig */ "./src/objects/newActors/actorConfig.ts");
var actorObject_1 = __webpack_require__(/*! ./actorObject */ "./src/objects/newActors/actorObjects/actorObject.ts");
var PlayerObject = /** @class */ (function (_super) {
    __extends(PlayerObject, _super);
    function PlayerObject(globalObjects, baseActor, position, momentum, size) {
        var _this = _super.call(this, globalObjects, baseActor, position, momentum, size, actorConfig_1.defaultActorConfig.playerMass + 0) || this;
        _this.size = size;
        _this.jumpHeight = actorConfig_1.defaultActorConfig.playerJumpHeight + 0;
        _this.maxSidewaysSpeed = actorConfig_1.defaultActorConfig.maxSidewaysMomentum + 0;
        _this.sidewaysStandingAcceleration = actorConfig_1.defaultActorConfig.standingSidewaysAcceleration + 0;
        _this.sidewaysFallingAcceleration = actorConfig_1.defaultActorConfig.nonStandingSidewaysAcceleration + 0;
        _this.objectAngle = 0;
        _this.crouching = false;
        _this.standing = false;
        return _this;
    }
    PlayerObject.prototype.getCollisionRange = function () {
        if (this.crouching) {
            return Math.sqrt(Math.pow((actorConfig_1.defaultActorConfig.playerCrouchSize.width / 2), 2) + Math.pow((actorConfig_1.defaultActorConfig.playerCrouchSize.height / 2), 2));
        }
        else {
            return Math.sqrt(Math.pow((actorConfig_1.defaultActorConfig.playerSize.width / 2), 2) + Math.pow((actorConfig_1.defaultActorConfig.playerSize.height / 2), 2));
        }
    };
    PlayerObject.prototype.getGlobalShape = function (elapsedTime) {
        if (elapsedTime === void 0) { elapsedTime = 0; }
        var position = { x: this.position.x + 0, y: this.position.y + 0 };
        if (elapsedTime !== 0) {
            position.x = this.position.x + this.momentum.x * elapsedTime;
            position.y = this.position.y + this.momentum.y * elapsedTime;
        }
        if (this.crouching) {
            return {
                center: { x: this.position.x + 0, y: this.position.y + 0 },
                points: exports.playerCrouchingShape.points.map(function (point) {
                    return { x: point.x + position.x, y: point.y + position.y };
                }),
                edges: exports.playerCrouchingShape.edges.map(function (edge) {
                    return {
                        p1: { x: edge.p1.x + position.x, y: edge.p1.y + position.y },
                        p2: { x: edge.p2.x + position.x, y: edge.p2.y + position.y },
                    };
                }),
            };
        }
        else {
            return {
                center: { x: this.position.x + 0, y: this.position.y + 0 },
                points: exports.playerStandingShape.points.map(function (point) {
                    return { x: point.x + position.x, y: point.y + position.y };
                }),
                edges: exports.playerStandingShape.edges.map(function (edge) {
                    return {
                        p1: { x: edge.p1.x + position.x, y: edge.p1.y + position.y },
                        p2: { x: edge.p2.x + position.x, y: edge.p2.y + position.y },
                    };
                }),
            };
        }
    };
    PlayerObject.prototype.registerGroundAngle = function (angle, standing) {
        this.objectAngle = (angle + this.objectAngle) / 2;
        if (standing)
            this.standing = true;
    };
    PlayerObject.prototype.jump = function () {
        this.momentum.y = -this.jumpHeight;
    };
    PlayerObject.prototype.accelerateRight = function (elapsedTime) {
        if (this.momentum.x < this.maxSidewaysSpeed) {
            if (this.standing) {
                var force = this.sidewaysStandingAcceleration * elapsedTime;
                this.momentum.x += force * Math.cos(this.objectAngle);
                if (this.objectAngle > 0)
                    this.momentum.y += force * Math.sin(this.objectAngle) * 5;
            }
            else {
                this.momentum.x += this.sidewaysFallingAcceleration * elapsedTime;
            }
            if (this.momentum.x > this.maxSidewaysSpeed)
                this.momentum.x = this.maxSidewaysSpeed - 1;
        }
    };
    PlayerObject.prototype.accelerateLeft = function (elapsedTime) {
        if (this.momentum.x > -this.maxSidewaysSpeed) {
            if (this.standing) {
                var force = this.sidewaysStandingAcceleration * elapsedTime;
                this.momentum.x -= force * Math.cos(this.objectAngle);
                if (this.objectAngle < 0)
                    this.momentum.y -= force * Math.sin(this.objectAngle) * 5;
            }
            else {
                this.momentum.x -= this.sidewaysFallingAcceleration * elapsedTime;
            }
            if (this.momentum.x < -this.maxSidewaysSpeed)
                this.momentum.x = -this.maxSidewaysSpeed + 1;
        }
    };
    PlayerObject.prototype.crouch = function () {
        if (!this.crouching) {
            this.size.height = actorConfig_1.defaultActorConfig.playerCrouchSize.height;
            this.position.y += (actorConfig_1.defaultActorConfig.playerSize.height - this.size.height) / 2;
            this.maxSidewaysSpeed /= 3;
            this.crouching = true;
        }
    };
    PlayerObject.prototype.unCrouch = function () {
        if (this.crouching) {
            this.position.y -= (actorConfig_1.defaultActorConfig.playerSize.height - this.size.height) / 2;
            this.size.height = actorConfig_1.defaultActorConfig.playerSize.height + 0;
            this.maxSidewaysSpeed *= 3;
            this.crouching = false;
        }
    };
    PlayerObject.prototype.update = function (elapsedTime, isTravelling) {
        if (!isTravelling && this.standing)
            this.registerGroundFriction(elapsedTime);
        this.registerAirResistance(elapsedTime);
        this.registerGravity(elapsedTime);
        this.updateTranslation(elapsedTime);
        this.positionUpdate(elapsedTime);
        this.standing = false;
        this.checkXBoundaryCollision();
        //if (this.checkYBoundaryCollision()) this.standing = true;
        this.checkDoodads();
        var groundHitDetection = this.checkGroundCollision(elapsedTime);
        if (groundHitDetection.hit) {
            this.registerGroundAngle(groundHitDetection.angle, true);
        }
        else {
            if (Math.abs(this.objectAngle) < 0.02) {
                this.objectAngle = 0;
            }
            else {
                this.objectAngle *= 0.9;
            }
        }
        this.previousPositionUpdate();
    };
    return PlayerObject;
}(actorObject_1.ActorObject));
exports.PlayerObject = PlayerObject;
var standingP1 = { x: actorConfig_1.defaultActorConfig.playerSize.width / -2, y: actorConfig_1.defaultActorConfig.playerSize.height / -2 };
var standingP2 = { x: actorConfig_1.defaultActorConfig.playerSize.width / 2, y: actorConfig_1.defaultActorConfig.playerSize.height / -2 };
var standingP3 = { x: actorConfig_1.defaultActorConfig.playerSize.width / 2, y: actorConfig_1.defaultActorConfig.playerSize.height / 2 };
var standingP4 = { x: actorConfig_1.defaultActorConfig.playerSize.width / -2, y: actorConfig_1.defaultActorConfig.playerSize.height / 2 };
exports.playerStandingShape = {
    center: { x: 0, y: 0 },
    points: [standingP1, standingP2, standingP3, standingP4],
    edges: [
        { p1: standingP1, p2: standingP2 },
        { p1: standingP2, p2: standingP3 },
        { p1: standingP3, p2: standingP4 },
        { p1: standingP4, p2: standingP1 },
    ],
};
var crouchingP1 = { x: actorConfig_1.defaultActorConfig.playerCrouchSize.width / -2, y: actorConfig_1.defaultActorConfig.playerCrouchSize.height / -2 };
var crouchingP2 = { x: actorConfig_1.defaultActorConfig.playerCrouchSize.width / 2, y: actorConfig_1.defaultActorConfig.playerCrouchSize.height / -2 };
var crouchingP3 = { x: actorConfig_1.defaultActorConfig.playerCrouchSize.width / 2, y: actorConfig_1.defaultActorConfig.playerCrouchSize.height / 2 };
var crouchingP4 = { x: actorConfig_1.defaultActorConfig.playerCrouchSize.width / -2, y: actorConfig_1.defaultActorConfig.playerCrouchSize.height / 2 };
exports.playerCrouchingShape = {
    center: { x: 0, y: 0 },
    points: [crouchingP1, crouchingP2, crouchingP3, crouchingP4],
    edges: [
        { p1: crouchingP1, p2: crouchingP2 },
        { p1: crouchingP2, p2: crouchingP3 },
        { p1: crouchingP3, p2: crouchingP4 },
        { p1: crouchingP4, p2: crouchingP1 },
    ],
};


/***/ }),

/***/ "./src/objects/newActors/actorObjects/translations.ts":
/*!************************************************************!*\
  !*** ./src/objects/newActors/actorObjects/translations.ts ***!
  \************************************************************/
/*! flagged exports */
/*! export __esModule [provided] [no usage info] [missing usage info prevents renaming] */
/*! export rotateKey [provided] [no usage info] [missing usage info prevents renaming] */
/*! export translations [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__, __webpack_require__ */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


exports.__esModule = true;
exports.rotateKey = exports.translations = void 0;
var vector_1 = __webpack_require__(/*! ../../../vector */ "./src/vector.ts");
exports.translations = {
    testTranslation: {
        keys: [
            { pos: { x: 20, y: 20 }, time: 0.1 },
            { pos: { x: 30, y: 40 }, time: 0.1 },
            { pos: { x: 100, y: -120 }, time: 0.2 },
            { pos: { x: 30, y: 40 }, time: 0.1 },
            { pos: { x: 20, y: 20 }, time: 0.1 },
        ],
        flipAcrossY: true,
        ignoreCollision: true,
        ignoreGravity: false,
    },
    lungeTranslation: {
        keys: [
            { pos: { x: 300, y: 0 }, time: 0.1 },
            { pos: { x: 10, y: 0 }, time: 0.02 },
        ],
        flipAcrossY: false,
        ignoreCollision: false,
        ignoreGravity: true,
    },
};
function rotateKey(key, angle, flipY) {
    return {
        pos: vector_1.rotateVector(angle, {
            x: key.pos.x,
            y: key.pos.y * (flipY && (angle >= Math.PI / 2 || angle <= Math.PI / -2) ? -1 : 1),
        }),
        time: key.time,
    };
}
exports.rotateKey = rotateKey;


/***/ }),

/***/ "./src/objects/newActors/clientActors/clientActor.ts":
/*!***********************************************************!*\
  !*** ./src/objects/newActors/clientActors/clientActor.ts ***!
  \***********************************************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: top-level-this-exports, __webpack_exports__, __webpack_require__ */
/*! CommonJS bailout: this is used directly at 2:17-21 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.renderShape = exports.ClientActor = void 0;
var actor_1 = __webpack_require__(/*! ../actor */ "./src/objects/newActors/actor.ts");
var ClientActor = /** @class */ (function (_super) {
    __extends(ClientActor, _super);
    function ClientActor(game, actorType, id, position, momentum, healthInfo) {
        var _this = _super.call(this, actorType, id, position, momentum, healthInfo) || this;
        _this.game = game;
        _this.globalActors = _this.game.getGlobalActors();
        _this.lastHitByActor = _this;
        return _this;
    }
    ClientActor.prototype.render = function () {
        this.model.render();
    };
    ClientActor.prototype.renderHealth = function () {
        this.model.renderHealth();
    };
    ClientActor.prototype.updatePositionAndMomentumFromServer = function (position, momentum) {
        //this.model.processPositionUpdateDifference({ x: position.x - this.position.x, y: position.y - this.position.y });
        this.position.x = position.x + 0;
        this.position.y = position.y + 0;
        this.momentum.x = momentum.x + 0;
        this.momentum.y = momentum.y + 0;
    };
    ClientActor.prototype.registerDamage = function (originActor, newHealth, knockback, translationData) {
        this.model.registerDamage(newHealth - this.healthInfo.health);
        originActor.registerDamageDone(newHealth - this.healthInfo.health);
        if (translationData)
            this.actorObject.startTranslation(translationData.angle, translationData.name);
        if (knockback)
            this.actorObject.registerKnockback(knockback);
        this.healthInfo.health = newHealth + 0;
        return { ifKilled: false, damageDealt: 0 };
    };
    ClientActor.prototype.registerHeal = function (newHealth) {
        this.model.registerHeal(newHealth - this.healthInfo.health);
        this.healthInfo.health = newHealth + 0;
    };
    return ClientActor;
}(actor_1.Actor));
exports.ClientActor = ClientActor;
function renderShape(ctx, points) {
    ctx.globalAlpha = 0.4;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (var i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.fill();
    ctx.globalAlpha = 1;
}
exports.renderShape = renderShape;


/***/ }),

/***/ "./src/objects/newActors/clientActors/clientPlayer/clientClasses/clientDaggers.ts":
/*!****************************************************************************************!*\
  !*** ./src/objects/newActors/clientActors/clientPlayer/clientClasses/clientDaggers.ts ***!
  \****************************************************************************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: top-level-this-exports, __webpack_exports__, __webpack_require__ */
/*! CommonJS bailout: this is used directly at 2:17-21 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.ClientDaggers = void 0;
var findAngle_1 = __webpack_require__(/*! ../../../../../findAngle */ "./src/findAngle.ts");
var daggersPlayerModel_1 = __webpack_require__(/*! ../../model/playerModels/daggersPlayerModel */ "./src/objects/newActors/clientActors/model/playerModels/daggersPlayerModel.ts");
var clientPlayer_1 = __webpack_require__(/*! ../clientPlayer */ "./src/objects/newActors/clientActors/clientPlayer/clientPlayer.ts");
var ClientDaggers = /** @class */ (function (_super) {
    __extends(ClientDaggers, _super);
    function ClientDaggers(game, playerInfo) {
        var _this = _super.call(this, game, playerInfo, "daggersPlayer") || this;
        _this.classType = "daggers";
        _this.performClientAbility = {
            stab: function (mousePos) {
                _this.model.setAnimation("stab", findAngle_1.findAngle(_this.position, mousePos));
                //this.game.particleSystem.addDummySlashEffect2(this.position, findMirroredAngle(findAngle(this.position, mousePos)), this.facingRight);
            },
            lunge: function (mousePos) {
                _this.model.setAnimation("lunge", 0);
                _this.game.particleSystem.addLungeEffect(_this.position, _this.model.getColor());
            },
            unavailable: function () { },
        };
        _this.releaseClientAbility = {
            stab: function () { },
            lunge: function () { },
            unavailable: function () { },
        };
        _this.model = new daggersPlayerModel_1.DaggersPlayerModel(game, _this, game.getActorCtx(), playerInfo.position, game.getActorSide(_this.id), _this.color, _this.actorObject.size);
        return _this;
    }
    return ClientDaggers;
}(clientPlayer_1.ClientPlayer));
exports.ClientDaggers = ClientDaggers;


/***/ }),

/***/ "./src/objects/newActors/clientActors/clientPlayer/clientClasses/clientHammer.ts":
/*!***************************************************************************************!*\
  !*** ./src/objects/newActors/clientActors/clientPlayer/clientClasses/clientHammer.ts ***!
  \***************************************************************************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: top-level-this-exports, __webpack_exports__, __webpack_require__ */
/*! CommonJS bailout: this is used directly at 2:17-21 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.ClientHammer = void 0;
var findAngle_1 = __webpack_require__(/*! ../../../../../findAngle */ "./src/findAngle.ts");
var hammerPlayerModel_1 = __webpack_require__(/*! ../../model/playerModels/hammerPlayerModel */ "./src/objects/newActors/clientActors/model/playerModels/hammerPlayerModel.ts");
var clientPlayer_1 = __webpack_require__(/*! ../clientPlayer */ "./src/objects/newActors/clientActors/clientPlayer/clientPlayer.ts");
var ClientHammer = /** @class */ (function (_super) {
    __extends(ClientHammer, _super);
    function ClientHammer(game, playerInfo) {
        var _this = _super.call(this, game, playerInfo, "hammerPlayer") || this;
        _this.classType = "hammer";
        _this.performClientAbility = {
            swing: function (mousePos) {
                _this.model.setAnimation("swing1", findAngle_1.findAngle(_this.position, mousePos));
            },
            pound: function () {
                _this.model.setAnimation("pound", 0);
            },
            unavailable: function () { },
        };
        _this.releaseClientAbility = {
            swing: function () { },
            pound: function () { },
            unavailable: function () { },
        };
        _this.model = new hammerPlayerModel_1.HammerPlayerModel(game, _this, game.getActorCtx(), playerInfo.position, game.getActorSide(_this.id), _this.color, _this.actorObject.size);
        return _this;
    }
    return ClientHammer;
}(clientPlayer_1.ClientPlayer));
exports.ClientHammer = ClientHammer;


/***/ }),

/***/ "./src/objects/newActors/clientActors/clientPlayer/clientClasses/clientSword.ts":
/*!**************************************************************************************!*\
  !*** ./src/objects/newActors/clientActors/clientPlayer/clientClasses/clientSword.ts ***!
  \**************************************************************************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: top-level-this-exports, __webpack_exports__, __webpack_require__ */
/*! CommonJS bailout: this is used directly at 2:17-21 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.ClientSword = void 0;
var findAngle_1 = __webpack_require__(/*! ../../../../../findAngle */ "./src/findAngle.ts");
var vector_1 = __webpack_require__(/*! ../../../../../vector */ "./src/vector.ts");
var swordPlayerModel_1 = __webpack_require__(/*! ../../model/playerModels/swordPlayerModel */ "./src/objects/newActors/clientActors/model/playerModels/swordPlayerModel.ts");
var clientPlayer_1 = __webpack_require__(/*! ../clientPlayer */ "./src/objects/newActors/clientActors/clientPlayer/clientPlayer.ts");
var ClientSword = /** @class */ (function (_super) {
    __extends(ClientSword, _super);
    function ClientSword(game, playerInfo) {
        var _this = _super.call(this, game, playerInfo, "swordPlayer") || this;
        _this.classType = "sword";
        _this.whirlwindEffectparticle = undefined;
        _this.performClientAbility = {
            slash: function (mousePos) {
                _this.model.setAnimation("slash1", findAngle_1.findAngle(_this.position, mousePos));
                _this.game.particleSystem.addDummySlashEffect2(_this.position, vector_1.findMirroredAngle(findAngle_1.findAngle(_this.position, mousePos)), _this.facingRight);
            },
            whirlwind: function () {
                _this.model.setAnimation("whirlwind", 0);
                _this.whirlwindEffectparticle = _this.game.particleSystem.addDummyWhirlwindEffect(_this.position, _this.facingRight);
            },
            unavailable: function () { },
        };
        _this.releaseClientAbility = {
            slash: function () { },
            whirlwind: function () {
                _this.model.setAnimation("stand", 0);
                if (_this.whirlwindEffectparticle !== undefined) {
                    _this.whirlwindEffectparticle.prematureEnd();
                    _this.whirlwindEffectparticle = undefined;
                }
            },
            unavailable: function () { },
        };
        _this.model = new swordPlayerModel_1.SwordPlayerModel(game, _this, game.getActorCtx(), playerInfo.position, game.getActorSide(_this.id), _this.color, _this.actorObject.size);
        return _this;
    }
    return ClientSword;
}(clientPlayer_1.ClientPlayer));
exports.ClientSword = ClientSword;


/***/ }),

/***/ "./src/objects/newActors/clientActors/clientPlayer/clientPlayer.ts":
/*!*************************************************************************!*\
  !*** ./src/objects/newActors/clientActors/clientPlayer/clientPlayer.ts ***!
  \*************************************************************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: top-level-this-exports, __webpack_exports__, __webpack_require__ */
/*! CommonJS bailout: this is used directly at 2:17-21 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.ClientPlayer = void 0;
var actorConfig_1 = __webpack_require__(/*! ../../actorConfig */ "./src/objects/newActors/actorConfig.ts");
var playerObject_1 = __webpack_require__(/*! ../../actorObjects/playerObject */ "./src/objects/newActors/actorObjects/playerObject.ts");
var clientActor_1 = __webpack_require__(/*! ../clientActor */ "./src/objects/newActors/clientActors/clientActor.ts");
var ClientPlayer = /** @class */ (function (_super) {
    __extends(ClientPlayer, _super);
    function ClientPlayer(game, playerInfo, actorType) {
        var _this = _super.call(this, game, actorType, playerInfo.id, playerInfo.position, playerInfo.momentum, playerInfo.healthInfo) || this;
        _this.moveActionsNextFrame = {
            jump: false,
            moveRight: false,
            moveLeft: false,
            crouch: false,
        };
        _this.facingRight = true;
        _this.color = playerInfo.color;
        _this.name = playerInfo.name;
        _this.level = playerInfo.classLevel;
        _this.spec = playerInfo.classSpec;
        _this.facingRight = playerInfo.facingRight;
        var playerSizePointer = { width: actorConfig_1.defaultActorConfig.playerSize.width + 0, height: actorConfig_1.defaultActorConfig.playerSize.height + 0 };
        _this.actorObject = new playerObject_1.PlayerObject(game.getGlobalObjects(), _this, _this.position, _this.momentum, playerSizePointer);
        return _this;
    }
    ClientPlayer.prototype.getLevel = function () {
        return this.level;
    };
    ClientPlayer.prototype.getSpec = function () {
        return this.spec;
    };
    ClientPlayer.prototype.changeSpec = function (spec) {
        this.spec = spec;
    };
    ClientPlayer.prototype.getClassType = function () {
        return this.classType;
    };
    ClientPlayer.prototype.attemptJumpAction = function () {
        if (!this.actorObject.crouching) {
            this.moveActionsNextFrame.jump = true;
            return true;
        }
        return false;
    };
    ClientPlayer.prototype.attemptCrouchAction = function () {
        if (true) {
            this.moveActionsNextFrame.crouch = true;
            return true;
        }
        return false;
    };
    ClientPlayer.prototype.crouch = function () {
        this.actorObject.crouch();
    };
    ClientPlayer.prototype.unCrouch = function () {
        this.actorObject.unCrouch();
    };
    ClientPlayer.prototype.jump = function () {
        this.moveActionsNextFrame.jump = false;
        this.actorObject.jump();
    };
    ClientPlayer.prototype.attemptMoveRightAction = function () {
        if (true) {
            this.moveActionsNextFrame.moveRight = true;
            return true;
        }
        return false;
    };
    ClientPlayer.prototype.moveRight = function (elapsedTime) {
        this.actorObject.accelerateRight(elapsedTime);
    };
    ClientPlayer.prototype.attemptMoveLeftAction = function () {
        if (true) {
            this.moveActionsNextFrame.moveLeft = true;
            return true;
        }
        return false;
    };
    ClientPlayer.prototype.moveLeft = function (elapsedTime) {
        this.actorObject.accelerateLeft(elapsedTime);
    };
    ClientPlayer.prototype.updateActions = function (elapsedTime) {
        this.model.update(elapsedTime);
        if (this.moveActionsNextFrame.jump) {
            this.jump();
        }
        if (this.moveActionsNextFrame.moveRight) {
            this.moveRight(elapsedTime);
        }
        if (this.moveActionsNextFrame.moveLeft) {
            this.moveLeft(elapsedTime);
        }
        if (this.moveActionsNextFrame.crouch !== this.actorObject.crouching) {
            if (this.moveActionsNextFrame.crouch) {
                this.crouch();
            }
            else {
                this.unCrouch();
            }
            this.actorObject.crouching = this.moveActionsNextFrame.crouch;
        }
    };
    ClientPlayer.prototype.render = function () {
        this.model.render();
    };
    ClientPlayer.prototype.updateFacingFromServer = function (facingRight) {
        this.facingRight = facingRight;
        this.model.changeFacing(facingRight);
    };
    ClientPlayer.prototype.update = function (elapsedTime) {
        this.updateActions(elapsedTime);
        this.actorObject.update(elapsedTime, this.moveActionsNextFrame.moveLeft || this.moveActionsNextFrame.moveRight);
    };
    return ClientPlayer;
}(clientActor_1.ClientActor));
exports.ClientPlayer = ClientPlayer;


/***/ }),

/***/ "./src/objects/newActors/clientActors/model/healthBar.ts":
/*!***************************************************************!*\
  !*** ./src/objects/newActors/clientActors/model/healthBar.ts ***!
  \***************************************************************/
/*! flagged exports */
/*! export HealthBarModel [provided] [no usage info] [missing usage info prevents renaming] */
/*! export __esModule [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__, __webpack_require__ */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


exports.__esModule = true;
exports.HealthBarModel = void 0;
var linkedList_1 = __webpack_require__(/*! ../../../../linkedList */ "./src/linkedList.ts");
var healthDividerWidth = 20;
var healthBarDuration = 0.15;
var HealthBarModel = /** @class */ (function () {
    function HealthBarModel(ctx, position, healthInfo, healthBarSize, healthBarType) {
        this.ctx = ctx;
        this.position = position;
        this.healthInfo = healthInfo;
        this.healthBarSize = healthBarSize;
        this.healthHeight = 50;
        this.damageEffectBars = new linkedList_1.LinkedList();
        this.healEffectBars = new linkedList_1.LinkedList();
        switch (healthBarType) {
            case "enemy":
                this.healthColor = "red";
                this.damageEffectColor = "white";
                this.healEffectColor = "red";
                break;
            case "ally":
                this.healthColor = "white";
                this.damageEffectColor = "red";
                this.healEffectColor = "green";
                break;
            case "self":
                this.healthColor = "#00c746";
                this.damageEffectColor = "white";
                this.healEffectColor = "#00c746";
                break;
            default:
                throw new Error("unknown health bar type in model constructor");
        }
    }
    HealthBarModel.prototype.renderHealth = function () {
        this.ctx.transform(1, 0, -0.15, 1, this.position.x + 1, this.position.y - this.healthHeight);
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.562)";
        this.ctx.fillRect(this.healthBarSize.width / -2 - 1, 0, this.healthBarSize.width + 2, this.healthBarSize.height + 2);
        this.ctx.fillStyle = this.healthColor;
        this.ctx.fillRect(this.healthBarSize.width / -2, 1, this.healthBarSize.width * (this.healthInfo.health / this.healthInfo.maxHealth), 6);
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.562)";
        for (var i = 1; i < this.healthInfo.health / healthDividerWidth; i += 1) {
            this.ctx.fillRect(-25 + (48 * healthDividerWidth * i) / this.healthInfo.maxHealth, 1, 2, 6);
        }
        if (!this.damageEffectBars.ifEmpty()) {
            this.ctx.fillStyle = this.damageEffectColor;
            var node = this.damageEffectBars.head;
            while (node !== null) {
                this.ctx.globalAlpha = 1 - (healthBarDuration - node.data.timer) * 3;
                this.ctx.fillRect(-25 + node.data.position, 4 - node.data.height / 2, node.data.width, node.data.height);
                node = node.next;
            }
            this.ctx.globalAlpha = 1;
        }
        if (!this.healEffectBars.ifEmpty()) {
            this.ctx.fillStyle = this.healEffectColor;
            var node = this.healEffectBars.head;
            while (node !== null) {
                this.ctx.globalAlpha = 0.5 + (healthBarDuration - node.data.timer) * 4;
                this.ctx.fillRect(-25 + node.data.position, 4 - node.data.height / 2, node.data.width, node.data.height);
                node = node.next;
            }
            this.ctx.globalAlpha = 1;
        }
        this.ctx.transform(1, 0, 0.15, 1, 0, 0); // the skew had to be de-transformed procedurally or else the main canvas bugged
        this.ctx.transform(1, 0, 0, 1, -this.position.x - 1, -this.position.y + this.healthHeight);
    };
    HealthBarModel.prototype.registerDamage = function (quantity) {
        this.damageEffectBars.insertAtEnd({
            timer: healthBarDuration,
            position: (this.healthInfo.health / this.healthInfo.maxHealth) * 48,
            width: (quantity / this.healthInfo.maxHealth) * 48 + 1,
            height: 8,
        });
    };
    HealthBarModel.prototype.registerHeal = function (quantity) {
        this.healEffectBars.insertAtEnd({
            timer: healthBarDuration,
            position: (this.healthInfo.health / this.healthInfo.maxHealth) * 48,
            width: (quantity / this.healthInfo.maxHealth) * 48 + 1,
            height: 30,
        });
    };
    HealthBarModel.prototype.update = function (elapsedTime) {
        if (!this.damageEffectBars.ifEmpty()) {
            var node = this.damageEffectBars.head;
            while (node !== null) {
                node.data.timer -= elapsedTime;
                node.data.height += elapsedTime * 100;
                if (node.data.timer <= 0) {
                    this.damageEffectBars.deleteFirst();
                    node = this.damageEffectBars.head;
                }
                else {
                    node = node.next;
                }
            }
        }
        if (!this.healEffectBars.ifEmpty()) {
            var node = this.healEffectBars.head;
            while (node !== null) {
                node.data.timer -= elapsedTime;
                node.data.height -= elapsedTime * 100;
                if (node.data.timer <= 0) {
                    this.healEffectBars.deleteFirst();
                    node = this.healEffectBars.head;
                }
                else {
                    node = node.next;
                }
            }
        }
    };
    return HealthBarModel;
}());
exports.HealthBarModel = HealthBarModel;


/***/ }),

/***/ "./src/objects/newActors/clientActors/model/joint.ts":
/*!***********************************************************!*\
  !*** ./src/objects/newActors/clientActors/model/joint.ts ***!
  \***********************************************************/
/*! flagged exports */
/*! export Joint [provided] [no usage info] [missing usage info prevents renaming] */
/*! export __esModule [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__ */
/***/ ((__unused_webpack_module, exports) => {


exports.__esModule = true;
exports.Joint = void 0;
var Joint = /** @class */ (function () {
    function Joint(ctx, img, imgPos, imgScale, imgRotation, localPos, angleFrom, angleTo) {
        this.ctx = ctx;
        this.img = img;
        this.imgPos = imgPos;
        this.imgScale = imgScale;
        this.imgRotation = imgRotation;
        this.localPos = localPos;
        this.angleFrom = angleFrom;
        this.angleTo = angleTo;
        this.imgRotationTemp = 0;
        this.localPosXTemp = 0;
        this.localPosYTemp = 0;
        this.angleFromTemp = 0;
        this.angleToTemp = 0;
    }
    Joint.prototype.render = function (timePercent, animationInfo) {
        if (animationInfo.angleFromEquation)
            this.angleFromTemp = readArrayForY(animationInfo.angleFromEquation, timePercent);
        this.ctx.rotate(this.angleFrom + this.angleFromTemp);
        if (animationInfo.localPosXEquation)
            this.localPosXTemp = readArrayForY(animationInfo.localPosXEquation, timePercent);
        if (animationInfo.localPosYEquation)
            this.localPosYTemp = readArrayForY(animationInfo.localPosYEquation, timePercent);
        this.ctx.translate(this.localPos.x + this.localPosXTemp, this.localPos.y + this.localPosYTemp);
        if (animationInfo.angleToEquation)
            this.angleToTemp = readArrayForY(animationInfo.angleToEquation, timePercent);
        this.ctx.rotate(this.angleTo + this.angleToTemp);
        if (animationInfo.imgRotationEquation)
            this.imgRotationTemp = readArrayForY(animationInfo.imgRotationEquation, timePercent);
        this.ctx.rotate(this.imgRotation + this.imgRotationTemp);
        this.ctx.scale(this.imgScale, this.imgScale);
        this.ctx.drawImage(this.img, this.imgPos.x, this.imgPos.y);
        this.ctx.scale(1 / this.imgScale, 1 / this.imgScale);
        this.ctx.rotate(-this.imgRotation - this.imgRotationTemp);
        this.ctx.rotate(-this.angleTo - this.angleToTemp);
        this.ctx.translate(-this.localPos.x - this.localPosXTemp, -this.localPos.y - this.localPosYTemp);
        this.ctx.rotate(-this.angleFrom - this.angleFromTemp);
    };
    Joint.prototype.update = function (elapsedTime) {
        this.imgRotationTemp *= 1 - elapsedTime * 5;
        this.localPosXTemp *= 1 - elapsedTime * 5;
        this.localPosYTemp *= 1 - elapsedTime * 5;
        this.angleFromTemp *= 1 - elapsedTime * 5;
        this.angleToTemp *= 1 - elapsedTime * 5;
    };
    return Joint;
}());
exports.Joint = Joint;
function readArrayForY(data, timePercent) {
    if (data === undefined)
        return 0;
    var index = 0;
    var arrayLength = data.length - 1;
    while (true) {
        if (index === arrayLength)
            return data[index][1];
        else if (data[index + 1][0] >= timePercent)
            break;
        index++;
    }
    var percent = (timePercent - data[index][0]) / (data[index + 1][0] - data[index][0]);
    var keyDifference = data[index + 1][1] - data[index][1];
    return data[index][1] + percent * keyDifference;
}


/***/ }),

/***/ "./src/objects/newActors/clientActors/model/model.ts":
/*!***********************************************************!*\
  !*** ./src/objects/newActors/clientActors/model/model.ts ***!
  \***********************************************************/
/*! flagged exports */
/*! export Model [provided] [no usage info] [missing usage info prevents renaming] */
/*! export __esModule [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__, __webpack_require__ */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


exports.__esModule = true;
exports.Model = void 0;
var healthBar_1 = __webpack_require__(/*! ./healthBar */ "./src/objects/newActors/clientActors/model/healthBar.ts");
var Model = /** @class */ (function () {
    function Model(game, player, ctx, position, healthBarType) {
        this.game = game;
        this.player = player;
        this.ctx = ctx;
        this.position = position;
        this.healthBar = new healthBar_1.HealthBarModel(this.ctx, this.position, this.player.getHealthInfo(), { width: 50, height: 6 }, healthBarType);
    }
    Model.prototype.registerDamage = function (quantity) {
        this.healthBar.registerDamage(quantity);
    };
    Model.prototype.registerHeal = function (quantity) {
        this.healthBar.registerHeal(quantity);
    };
    Model.prototype.renderHealth = function () {
        this.healthBar.renderHealth();
    };
    Model.prototype.update = function (elapsedTime) {
        this.healthBar.update(elapsedTime);
    };
    return Model;
}());
exports.Model = Model;


/***/ }),

/***/ "./src/objects/newActors/clientActors/model/playerModels/daggersPlayerModel.ts":
/*!*************************************************************************************!*\
  !*** ./src/objects/newActors/clientActors/model/playerModels/daggersPlayerModel.ts ***!
  \*************************************************************************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: top-level-this-exports, __webpack_exports__, __webpack_require__ */
/*! CommonJS bailout: this is used directly at 2:17-21 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.DaggersPlayerModel = void 0;
var assetmanager_1 = __webpack_require__(/*! ../../../../../client/gameRender/assetmanager */ "./src/client/gameRender/assetmanager.ts");
var joint_1 = __webpack_require__(/*! ../joint */ "./src/objects/newActors/clientActors/model/joint.ts");
var playerModel_1 = __webpack_require__(/*! ./playerModel */ "./src/objects/newActors/clientActors/model/playerModels/playerModel.ts");
var DaggersPlayerModel = /** @class */ (function (_super) {
    __extends(DaggersPlayerModel, _super);
    function DaggersPlayerModel(game, player, ctx, position, healthBarType, playerColor, size) {
        var _this = _super.call(this, game, player, ctx, position, healthBarType, playerColor, size) || this;
        _this.animationStateAnimation = DaggersPlayerAnimationData["stand"];
        _this.animationState = "stand";
        _this.daggerJoint = new joint_1.Joint(_this.ctx, assetmanager_1.assetManager.images["dagger21"], { x: -200, y: -700 }, 0.09, 0, { x: -20, y: 20 }, 0, -0.5);
        return _this;
    }
    DaggersPlayerModel.prototype.renderWeapon = function () {
        this.daggerJoint.render(this.animationTime / this.animationStateAnimation.totalTime, this.animationStateAnimation.jointAnimationInfo["playerDagger"]);
        this.ctx.scale(-1, 1);
        //renderShape(this.ctx, DaggersStabHitShape);
        this.ctx.scale(-1, 1);
    };
    DaggersPlayerModel.prototype.update = function (elapsedTime) {
        this.animationTime += elapsedTime;
        if (this.animationTime >= this.animationStateAnimation.totalTime) {
            if (this.animationStateAnimation.loop) {
                this.animationTime = 0;
            }
            else {
                this.setAnimation("stand", 0);
            }
        }
        this.daggerJoint.update(elapsedTime);
        _super.prototype.update.call(this, elapsedTime);
    };
    DaggersPlayerModel.prototype.setAnimation = function (animation, angle) {
        this.animationTime = 0;
        this.changeFacingAngle(angle);
        this.animationState = animation;
        this.animationStateAnimation = DaggersPlayerAnimationData[animation];
    };
    return DaggersPlayerModel;
}(playerModel_1.PlayerModel));
exports.DaggersPlayerModel = DaggersPlayerModel;
var DaggersPlayerAnimationData = {
    stand: {
        loop: true,
        totalTime: 1,
        jointAnimationInfo: {
            playerDagger: {
                imgRotationEquation: undefined,
                localPosXEquation: undefined,
                localPosYEquation: undefined,
                angleFromEquation: undefined,
                angleToEquation: undefined,
            },
        },
    },
    stab: {
        loop: false,
        totalTime: 0.6,
        jointAnimationInfo: {
            playerDagger: {
                imgRotationEquation: undefined,
                localPosYEquation: undefined,
                angleFromEquation: [
                    [0, -2],
                    [0.1, 0.3],
                    [0.2, 1.3],
                    [0.6, 1.7],
                    [1, 2],
                ],
                angleToEquation: [
                    [0, -2],
                    [0.1, -3],
                    [0.2, -0.8],
                    [0.6, -0.6],
                    [1, -0.5],
                ],
                localPosXEquation: [
                    [0, 0],
                    [0.1, -10],
                    [0.15, -30],
                    [0.2, 0],
                    [1, 15],
                ],
            },
        },
    },
    lunge: {
        loop: false,
        totalTime: 0.3,
        jointAnimationInfo: {
            playerDagger: {
                imgRotationEquation: undefined,
                localPosYEquation: undefined,
                angleFromEquation: undefined,
                angleToEquation: undefined,
                localPosXEquation: undefined,
            },
        },
    },
};


/***/ }),

/***/ "./src/objects/newActors/clientActors/model/playerModels/hammerPlayerModel.ts":
/*!************************************************************************************!*\
  !*** ./src/objects/newActors/clientActors/model/playerModels/hammerPlayerModel.ts ***!
  \************************************************************************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: top-level-this-exports, __webpack_exports__, __webpack_require__ */
/*! CommonJS bailout: this is used directly at 2:17-21 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.HammerPlayerModel = void 0;
var assetmanager_1 = __webpack_require__(/*! ../../../../../client/gameRender/assetmanager */ "./src/client/gameRender/assetmanager.ts");
var joint_1 = __webpack_require__(/*! ../joint */ "./src/objects/newActors/clientActors/model/joint.ts");
var playerModel_1 = __webpack_require__(/*! ./playerModel */ "./src/objects/newActors/clientActors/model/playerModels/playerModel.ts");
var HammerPlayerModel = /** @class */ (function (_super) {
    __extends(HammerPlayerModel, _super);
    function HammerPlayerModel(game, player, ctx, position, healthBarType, playerColor, size) {
        var _this = _super.call(this, game, player, ctx, position, healthBarType, playerColor, size) || this;
        _this.animationStateAnimation = HammerPlayerAnimationData["stand"];
        _this.animationState = "stand";
        _this.hammerJoint = new joint_1.Joint(_this.ctx, assetmanager_1.assetManager.images["hammer21"], { x: -200, y: -700 }, 0.12, 0, { x: -25, y: 20 }, 0, -0.4);
        return _this;
    }
    HammerPlayerModel.prototype.renderWeapon = function () {
        this.hammerJoint.render(this.animationTime / this.animationStateAnimation.totalTime, this.animationStateAnimation.jointAnimationInfo["playerHammer"]);
        /*this.ctx.scale(-1, 1);
        renderShape(this.ctx, hammerSlashHitShape);
        this.ctx.scale(-1, 1);*/
    };
    HammerPlayerModel.prototype.update = function (elapsedTime) {
        this.animationTime += elapsedTime;
        if (this.animationTime >= this.animationStateAnimation.totalTime) {
            if (this.animationStateAnimation.loop) {
                this.animationTime = 0;
            }
            else {
                this.setAnimation("stand", 0);
            }
        }
        this.hammerJoint.update(elapsedTime);
        _super.prototype.update.call(this, elapsedTime);
    };
    HammerPlayerModel.prototype.setAnimation = function (animation, angle) {
        this.animationTime = 0;
        this.changeFacingAngle(angle);
        if (animation === "swing1" && this.animationState === "swing1") {
            this.animationState = "swing2";
            this.animationStateAnimation = HammerPlayerAnimationData["swing2"];
        }
        else {
            this.animationState = animation;
            this.animationStateAnimation = HammerPlayerAnimationData[animation];
        }
    };
    return HammerPlayerModel;
}(playerModel_1.PlayerModel));
exports.HammerPlayerModel = HammerPlayerModel;
var HammerPlayerAnimationData = {
    stand: {
        loop: true,
        totalTime: 1,
        jointAnimationInfo: {
            playerHammer: {
                imgRotationEquation: undefined,
                localPosXEquation: undefined,
                localPosYEquation: undefined,
                angleFromEquation: undefined,
                angleToEquation: undefined,
            },
        },
    },
    swing2: {
        loop: false,
        totalTime: 0.8,
        jointAnimationInfo: {
            playerHammer: {
                imgRotationEquation: undefined,
                localPosYEquation: undefined,
                angleFromEquation: [
                    [0, -2],
                    [0.1, 0.3],
                    [0.2, 1.3],
                    [0.6, 1.7],
                    [1, 2],
                ],
                angleToEquation: [
                    [0, -2],
                    [0.1, -3],
                    [0.2, -0.8],
                    [0.6, -0.6],
                    [1, -0.5],
                ],
                localPosXEquation: [
                    [0, 0],
                    [0.1, -10],
                    [0.15, -30],
                    [0.2, 0],
                    [1, 15],
                ],
            },
        },
    },
    swing1: {
        loop: false,
        totalTime: 0.8,
        jointAnimationInfo: {
            playerHammer: {
                imgRotationEquation: undefined,
                localPosYEquation: undefined,
                angleFromEquation: [
                    [0.0, 1.6],
                    [0.3, -1.7],
                    [0.4, -1.8],
                    [1, -1.6],
                ],
                angleToEquation: [
                    [0.0, 0.5],
                    [0.15, -0.1],
                    [0.3, -0.6],
                    [0.5, -0.9],
                    [1, -0.8],
                ],
                localPosXEquation: [
                    [0, 0],
                    [0.2, -30],
                    [0.6, 7],
                    [1, 12],
                ],
            },
        },
    },
    pound: {
        loop: false,
        totalTime: 1,
        jointAnimationInfo: {
            playerHammer: {
                imgRotationEquation: undefined,
                localPosYEquation: undefined,
                angleFromEquation: [
                    [0, 0],
                    [0.3, Math.PI * -1],
                    [0.3, Math.PI],
                    [0.6, Math.PI * -1],
                    [0.6, Math.PI],
                    [0.9, Math.PI * -1],
                    [0.9, Math.PI],
                    [1, 0],
                ],
                angleToEquation: [
                    [0, 0],
                    [0.13, 0.3],
                    [0.2, -1],
                    [1, -0],
                ],
                localPosXEquation: [
                    [0, 0],
                    [0.13, 10],
                    [0.2, -5],
                    [1, 0],
                ],
            },
        },
    },
};


/***/ }),

/***/ "./src/objects/newActors/clientActors/model/playerModels/playerModel.ts":
/*!******************************************************************************!*\
  !*** ./src/objects/newActors/clientActors/model/playerModels/playerModel.ts ***!
  \******************************************************************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: top-level-this-exports, __webpack_exports__, __webpack_require__ */
/*! CommonJS bailout: this is used directly at 2:17-21 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.playerModelConfig = exports.PlayerModel = void 0;
var gameRenderer_1 = __webpack_require__(/*! ../../../../../client/gameRender/gameRenderer */ "./src/client/gameRender/gameRenderer.ts");
var vector_1 = __webpack_require__(/*! ../../../../../vector */ "./src/vector.ts");
var model_1 = __webpack_require__(/*! ../model */ "./src/objects/newActors/clientActors/model/model.ts");
var PlayerModel = /** @class */ (function (_super) {
    __extends(PlayerModel, _super);
    function PlayerModel(game, player, ctx, position, healthBarType, playerColor, size) {
        var _this = _super.call(this, game, player, ctx, position, healthBarType) || this;
        _this.playerColor = playerColor;
        _this.size = size;
        _this.animationTime = 0;
        _this.facingAngleAnimation = { frame: 1, angle: 0, targetAngle: 0 };
        _this.hitAnimation = { frame: 0, renderColor: _this.playerColor };
        _this.facingAnimation = { frame: 1, facingRight: _this.player.facingRight };
        return _this;
    }
    PlayerModel.prototype.renderBlock = function () {
        this.ctx.fillStyle = this.hitAnimation.renderColor;
        this.ctx.fillRect(this.size.width / -2, this.size.height / -2, this.size.width, this.size.height);
        this.ctx.strokeStyle = "#222222";
        this.ctx.lineWidth = 2;
        gameRenderer_1.roundRect(this.ctx, this.size.width / -2 - 1, this.size.height / -2 - 1, this.size.width + 2, this.size.height + 2, 3, false, true);
        //();
        /*this.ctx.strokeStyle = "green";
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(Math.cos(this.facingAngleAnimation.angle) * 50, Math.sin(this.facingAngleAnimation.angle) * 50);
        this.ctx.stroke();*/
    };
    PlayerModel.prototype.registerDamage = function (quantity) {
        this.hitAnimation.frame = 0.07;
        this.hitAnimation.renderColor = "red";
        _super.prototype.registerDamage.call(this, quantity);
    };
    PlayerModel.prototype.updateHitAnimation = function (elapsedTime) {
        if (this.hitAnimation.frame > 0) {
            this.hitAnimation.frame -= elapsedTime;
            if (this.hitAnimation.frame <= 0) {
                this.hitAnimation.frame = 0;
                this.hitAnimation.renderColor = this.playerColor;
            }
        }
    };
    PlayerModel.prototype.render = function () {
        this.ctx.translate(this.position.x, this.position.y);
        this.ctx.rotate(this.player.actorObject.objectAngle);
        this.renderBlock();
        this.ctx.rotate(-this.player.actorObject.objectAngle);
        var facing = this.getFacingScale();
        var angle = this.getFacingAngle();
        this.ctx.scale(facing, 1);
        this.ctx.rotate(angle);
        this.renderWeapon();
        this.ctx.rotate(-angle);
        this.ctx.scale(1 / facing, 1);
        this.ctx.translate(-this.position.x, -this.position.y);
        this.healthBar.renderHealth();
    };
    PlayerModel.prototype.updateFacing = function (elapsedTime) {
        if (this.facingAnimation.frame < 1) {
            this.facingAnimation.frame += elapsedTime * (1 / exports.playerModelConfig.turnTime);
        }
    };
    PlayerModel.prototype.getFacingScale = function () {
        if (this.facingAnimation.facingRight) {
            if (this.facingAnimation.frame < 1) {
                return 1 - this.facingAnimation.frame * 2;
            }
            else {
                return -1;
            }
        }
        else {
            if (this.facingAnimation.frame < 1) {
                return -1 + this.facingAnimation.frame * 2;
            }
            else {
                return 1;
            }
        }
    };
    PlayerModel.prototype.changeFacing = function (facingRight) {
        this.facingAnimation.facingRight = facingRight;
        this.facingAnimation.frame = 0;
    };
    PlayerModel.prototype.updateFacingAngle = function (elapsedTime) {
        this.facingAngleAnimation.angle =
            (this.facingAngleAnimation.targetAngle - this.facingAngleAnimation.angle) * (elapsedTime * 5) + this.facingAngleAnimation.angle;
    };
    PlayerModel.prototype.getFacingAngle = function () {
        return -this.facingAngleAnimation.angle;
    };
    PlayerModel.prototype.changeFacingAngle = function (angle) {
        this.facingAngleAnimation.frame = 0;
        this.facingAngleAnimation.targetAngle = vector_1.findMirroredAngle(angle);
    };
    PlayerModel.prototype.getColor = function () {
        return this.playerColor;
    };
    PlayerModel.prototype.update = function (elapsedTime) {
        this.updateFacing(elapsedTime);
        this.updateFacingAngle(elapsedTime);
        this.updateHitAnimation(elapsedTime);
        _super.prototype.update.call(this, elapsedTime);
    };
    return PlayerModel;
}(model_1.Model));
exports.PlayerModel = PlayerModel;
exports.playerModelConfig = {
    turnTime: 0.06,
};


/***/ }),

/***/ "./src/objects/newActors/clientActors/model/playerModels/swordPlayerModel.ts":
/*!***********************************************************************************!*\
  !*** ./src/objects/newActors/clientActors/model/playerModels/swordPlayerModel.ts ***!
  \***********************************************************************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: top-level-this-exports, __webpack_exports__, __webpack_require__ */
/*! CommonJS bailout: this is used directly at 2:17-21 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.SwordPlayerModel = void 0;
var assetmanager_1 = __webpack_require__(/*! ../../../../../client/gameRender/assetmanager */ "./src/client/gameRender/assetmanager.ts");
var joint_1 = __webpack_require__(/*! ../joint */ "./src/objects/newActors/clientActors/model/joint.ts");
var playerModel_1 = __webpack_require__(/*! ./playerModel */ "./src/objects/newActors/clientActors/model/playerModels/playerModel.ts");
var SwordPlayerModel = /** @class */ (function (_super) {
    __extends(SwordPlayerModel, _super);
    function SwordPlayerModel(game, player, ctx, position, healthBarType, playerColor, size) {
        var _this = _super.call(this, game, player, ctx, position, healthBarType, playerColor, size) || this;
        _this.animationStateAnimation = SwordPlayerAnimationData["stand"];
        _this.animationState = "stand";
        _this.swordJoint = new joint_1.Joint(_this.ctx, assetmanager_1.assetManager.images["sword31"], { x: -200, y: -700 }, 0.1, 0, { x: -25, y: 20 }, 0, -0.4);
        return _this;
    }
    SwordPlayerModel.prototype.renderWeapon = function () {
        this.swordJoint.render(this.animationTime / this.animationStateAnimation.totalTime, this.animationStateAnimation.jointAnimationInfo["playerSword"]);
        /*this.ctx.scale(-1, 1);
        renderShape(this.ctx, SwordSlashHitShape);
        this.ctx.scale(-1, 1);*/
    };
    SwordPlayerModel.prototype.update = function (elapsedTime) {
        this.animationTime += elapsedTime;
        if (this.animationTime >= this.animationStateAnimation.totalTime) {
            if (this.animationStateAnimation.loop) {
                this.animationTime = 0;
            }
            else {
                this.setAnimation("stand", 0);
            }
        }
        this.swordJoint.update(elapsedTime);
        _super.prototype.update.call(this, elapsedTime);
    };
    SwordPlayerModel.prototype.setAnimation = function (animation, angle) {
        this.animationTime = 0;
        this.changeFacingAngle(angle);
        if (animation === "slash1" && this.animationState === "slash1") {
            this.animationState = "slash2";
            this.animationStateAnimation = SwordPlayerAnimationData["slash2"];
        }
        else {
            this.animationState = animation;
            this.animationStateAnimation = SwordPlayerAnimationData[animation];
        }
    };
    return SwordPlayerModel;
}(playerModel_1.PlayerModel));
exports.SwordPlayerModel = SwordPlayerModel;
var SwordPlayerAnimationData = {
    stand: {
        loop: true,
        totalTime: 1,
        jointAnimationInfo: {
            playerSword: {
                imgRotationEquation: undefined,
                localPosXEquation: undefined,
                localPosYEquation: undefined,
                angleFromEquation: undefined,
                angleToEquation: undefined,
            },
        },
    },
    slash1: {
        loop: false,
        totalTime: 0.6,
        jointAnimationInfo: {
            playerSword: {
                imgRotationEquation: undefined,
                localPosYEquation: undefined,
                angleFromEquation: [
                    [0, -2],
                    [0.1, 0.3],
                    [0.2, 1.3],
                    [0.6, 1.7],
                    [1, 2],
                ],
                angleToEquation: [
                    [0, -2],
                    [0.1, -3],
                    [0.2, -0.8],
                    [0.6, -0.6],
                    [1, -0.5],
                ],
                localPosXEquation: [
                    [0, 0],
                    [0.1, -10],
                    [0.15, -30],
                    [0.2, 0],
                    [1, 15],
                ],
            },
        },
    },
    slash2: {
        loop: false,
        totalTime: 0.4,
        jointAnimationInfo: {
            playerSword: {
                imgRotationEquation: undefined,
                localPosYEquation: undefined,
                angleFromEquation: [
                    [0.0, 1.6],
                    [0.3, -1.7],
                    [0.4, -1.8],
                    [1, -1.6],
                ],
                angleToEquation: [
                    [0.0, 0.5],
                    [0.15, -0.1],
                    [0.3, -0.6],
                    [0.5, -0.9],
                    [1, -0.8],
                ],
                localPosXEquation: [
                    [0, 0],
                    [0.2, -30],
                    [0.6, 7],
                    [1, 12],
                ],
            },
        },
    },
    whirlwind: {
        loop: false,
        totalTime: 1,
        jointAnimationInfo: {
            playerSword: {
                imgRotationEquation: undefined,
                localPosYEquation: undefined,
                angleFromEquation: [
                    [0, 0],
                    [0.3, Math.PI * -1],
                    [0.3, Math.PI],
                    [0.6, Math.PI * -1],
                    [0.6, Math.PI],
                    [0.9, Math.PI * -1],
                    [0.9, Math.PI],
                    [1, 0],
                ],
                angleToEquation: [
                    [0, 0],
                    [0.13, 0.3],
                    [0.2, -1],
                    [1, -0],
                ],
                localPosXEquation: [
                    [0, 0],
                    [0.13, 10],
                    [0.2, -5],
                    [1, 0],
                ],
            },
        },
    },
};


/***/ }),

/***/ "./src/objects/terrain/doodads/clientDoodad.ts":
/*!*****************************************************!*\
  !*** ./src/objects/terrain/doodads/clientDoodad.ts ***!
  \*****************************************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: top-level-this-exports, __webpack_exports__, __webpack_require__ */
/*! CommonJS bailout: this is used directly at 2:17-21 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.ClientDoodad = void 0;
var assetmanager_1 = __webpack_require__(/*! ../../../client/gameRender/assetmanager */ "./src/client/gameRender/assetmanager.ts");
var doodad_1 = __webpack_require__(/*! ./doodad */ "./src/objects/terrain/doodads/doodad.ts");
var ClientDoodad = /** @class */ (function (_super) {
    __extends(ClientDoodad, _super);
    function ClientDoodad(position, rotation, doodadType, ctx) {
        var _this = _super.call(this, position, rotation, doodadType) || this;
        _this.ctx = ctx;
        _this.img = assetmanager_1.assetManager.images[_this.doodadType];
        return _this;
    }
    ClientDoodad.prototype.ifShouldRender = function (screenSize, screenPos) {
        if (this.position.x + this.collisionRange >= screenPos.x && this.position.x - this.collisionRange <= screenPos.x + screenSize.width) {
            return true;
            /*if (this.position.y + this.collisionRange >= screenPos.y && this.position.y - this.collisionRange <= screenPos.y + screenSize.height) {
            }*/ //only necessary if we add a y-dimension to the game.
        }
        return false;
    };
    ClientDoodad.prototype.render = function () {
        this.ctx.translate(Math.floor(this.position.x), Math.floor(this.position.y));
        this.ctx.rotate(this.rotation);
        this.ctx.drawImage(this.img, -200, -140);
        this.ctx.rotate(-this.rotation);
        this.ctx.translate(-this.position.x, -this.position.y);
        //this.renderPoints();
        //this.renderEdges(false);
        //this.renderOrthonormals();
    };
    ClientDoodad.prototype.renderPoints = function () {
        var _this = this;
        this.ctx.fillStyle = "red";
        this.points.forEach(function (point) {
            _this.ctx.fillRect(point.x - 5, point.y - 5, 10, 10);
        });
    };
    ClientDoodad.prototype.renderOrthonormals = function () {
        var _this = this;
        this.ctx.strokeStyle = "red";
        this.ctx.lineWidth = 2;
        this.edges.forEach(function (edge) {
            _this.ctx.beginPath();
            _this.ctx.moveTo((edge.p1.x + edge.p2.x) / 2, (edge.p1.y + edge.p2.y) / 2);
            _this.ctx.lineTo((edge.p1.x + edge.p2.x) / 2 + edge.orthogonalVector.x * 10, (edge.p1.y + edge.p2.y) / 2 + edge.orthogonalVector.y * 10);
            _this.ctx.stroke();
        });
    };
    ClientDoodad.prototype.renderEdges = function (activate) {
        var _this = this;
        this.ctx.lineWidth = 2;
        this.edges.forEach(function (edge) {
            if (activate) {
                _this.ctx.strokeStyle = "red";
            }
            else if (edge.isGround) {
                _this.ctx.strokeStyle = "blue";
            }
            else {
                _this.ctx.strokeStyle = "red";
            }
            _this.ctx.beginPath();
            _this.ctx.moveTo(edge.p1.x, edge.p1.y);
            _this.ctx.lineTo(edge.p2.x, edge.p2.y);
            _this.ctx.stroke();
        });
    };
    return ClientDoodad;
}(doodad_1.Doodad));
exports.ClientDoodad = ClientDoodad;


/***/ }),

/***/ "./src/objects/terrain/doodads/doodad.ts":
/*!***********************************************!*\
  !*** ./src/objects/terrain/doodads/doodad.ts ***!
  \***********************************************/
/*! flagged exports */
/*! export Doodad [provided] [no usage info] [missing usage info prevents renaming] */
/*! export __esModule [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__, __webpack_require__ */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


exports.__esModule = true;
exports.Doodad = void 0;
var findAngle_1 = __webpack_require__(/*! ../../../findAngle */ "./src/findAngle.ts");
var ifIntersect_1 = __webpack_require__(/*! ../../../ifIntersect */ "./src/ifIntersect.ts");
var vector_1 = __webpack_require__(/*! ../../../vector */ "./src/vector.ts");
var doodadPointInformation = {
    rockLarge: [
        { x: -182, y: 12 },
        { x: -200, y: -38 },
        { x: -128, y: -105 },
        { x: -10, y: -134 },
        { x: 20, y: -133 },
        { x: 121, y: -80 },
        { x: 193, y: -22 },
        { x: 197, y: 23 },
    ],
};
var Doodad = /** @class */ (function () {
    function Doodad(position, rotation, doodadType) {
        var _this = this;
        this.position = position;
        this.rotation = rotation;
        this.doodadType = doodadType;
        this.points = [];
        this.edges = [];
        this.collisionRange = 0;
        var doodadPoints = doodadPointInformation[doodadType];
        //rotate base shape and store it in this.points
        doodadPoints.forEach(function (point) {
            var localPoint = vector_1.rotateVector(_this.rotation, point);
            _this.points.push({ x: localPoint.x + _this.position.x, y: localPoint.y + _this.position.y });
        });
        //find largest distance between a point and the center
        this.points.forEach(function (point) {
            var distance = vector_1.findDistance(_this.position, point);
            if (distance > _this.collisionRange)
                _this.collisionRange = distance;
        });
        //find all the edges based on the points
        var pointCount = this.points.length;
        for (var i = 0; i < pointCount; i++) {
            var point1 = this.points[i];
            var point2 = this.points[(i + 1) % pointCount];
            var angle = findAngle_1.findAngle(point1, point2);
            this.edges.push({
                p1: point1,
                p2: point2,
                angle: angle,
                slope: vector_1.findDifference(point1, point2),
                isGround: Math.PI / -5 < angle && angle < Math.PI / 5,
                orthogonalVector: vector_1.findOrthonormalVector(point1, point2),
            });
        }
    }
    Doodad.prototype.getCollisionRange = function () {
        return this.collisionRange;
    };
    /**
     * Very cheap check if two objects are close enough to touch.
     * @param position Position of the object in question.
     * @param objectCollisionRange Highest possible radius of the object in question.
     * @returns True if the objects are close enough to possibly collide.
     */
    Doodad.prototype.checkCollisionRange = function (position, objectCollisionRange) {
        //if objects' collision bounds are too close
        return vector_1.findDistance(this.position, position) <= this.collisionRange + objectCollisionRange;
    };
    Doodad.prototype.checkObjectIntersection = function (objectShape) {
        //if objects intersect (line intersect -> or ifPointIsBehindEdge method)
        /*This method checks all of this shape's edges to see if any of the object's points fall behind that edge.
        If an edge exists with no points behind it, we can assume the shapes do not collide.
        Otherwise, we know that somewhere the shapes collide.
        This method will not work for concave doodads.*/
        for (var i1 = 0; i1 < this.edges.length; i1++) {
            var ifPointExistsBehind = false;
            for (var i2 = 0; i2 < objectShape.points.length; i2++) {
                if (vector_1.dotProduct({ x: objectShape.points[i2].x - this.edges[i1].p1.x, y: objectShape.points[i2].y - this.edges[i1].p1.y }, this.edges[i1].orthogonalVector) <= 0)
                    ifPointExistsBehind = true;
            }
            if (!ifPointExistsBehind)
                return false;
        }
        return true;
        /*for (let i1: number = 0; i1 < this.edges.length; i1++) {
            for (let i2: number = 0; i2 < objectShape.edges.length; i2++) {
                if (ifIntersect(this.edges[i1].p1, this.edges[i1].p2, objectShape.edges[i2].p1, objectShape.edges[i2].p2)) {
                    return true;
                }
            }
        }
        return false;*/
    };
    Doodad.prototype.registerCollisionWithMostCorrectSolution = function (dynamShape, prevPositionDifference, ctx) {
        /**
         * This algorithm takes the dynamic object's shape and the difference between its current position and its position last frame.
         * We assume the point difference is the "previous momentum."
         * We check if any of the dynamObj's points collided with this object's shape due to it's previous momentum.
         * If so, we find the closest intersection point to the dynamObj's previous position and return it.
         */
        var furthestIntersectionPoint = undefined;
        var furthestIntersectionLength = 0;
        for (var i = 0; i < dynamShape.points.length; i++) {
            for (var j = 0; j < this.edges.length; j++) {
                var pointMomentumLineSegment = {
                    p1: dynamShape.points[i],
                    p2: { x: dynamShape.points[i].x + prevPositionDifference.x, y: dynamShape.points[i].y + prevPositionDifference.y },
                };
                var intersectionPoint = ifIntersect_1.findIntersection(this.edges[j], pointMomentumLineSegment);
                if (intersectionPoint) {
                    var intersectionDistanceFromOriginalPoint = vector_1.findLength(intersectionPoint);
                    if (intersectionDistanceFromOriginalPoint > furthestIntersectionLength) {
                        furthestIntersectionLength = intersectionDistanceFromOriginalPoint;
                        furthestIntersectionPoint = intersectionPoint;
                    }
                }
            }
        }
        if (furthestIntersectionPoint) {
            ctx.fillStyle = "red";
            ctx.fillRect(furthestIntersectionPoint.x - 4, furthestIntersectionPoint.y - 4, 8, 8);
        }
        return undefined;
    };
    Doodad.prototype.registerCollisionWithClosestSolution = function (objectShape, momentum) {
        var lowestEdge = this.edges[0];
        var lowestDistance = 10000;
        this.edges.forEach(function (doodadEdge) {
            //for each static object edge,
            var minProjectedDistance = 0;
            objectShape.points.forEach(function (point) {
                var pointDifference = vector_1.findDifference(doodadEdge.p1, point);
                var projection = vector_1.vectorProject(pointDifference, doodadEdge.orthogonalVector);
                //calculate the distance to move the object's point with the lowest projection onto the orthogonal line
                if (projection.y * doodadEdge.orthogonalVector.y < 0) {
                    var distance = vector_1.findLength(projection);
                    if (distance > minProjectedDistance) {
                        minProjectedDistance = distance;
                    }
                }
                //save the edge and the biggest distance of the points
            });
            if (minProjectedDistance < lowestDistance) {
                //find the edge with the lowest distance
                lowestDistance = minProjectedDistance;
                lowestEdge = doodadEdge;
            }
        });
        //find the positionChange based on the distance * orthanormal vector
        var positionChange = {
            x: lowestEdge.orthogonalVector.x * lowestDistance,
            y: lowestEdge.orthogonalVector.y * lowestDistance,
        };
        //find momentum change only if the current momentum has a negative projection onto the orthanormal vector
        var momentumChange = vector_1.vectorProject(momentum, lowestEdge.slope);
        //return angle if the edge is a "standing" edge
        var angle = undefined;
        if (lowestEdge.isGround) {
            angle = lowestEdge.angle;
            //and make the positionchange vertical
            positionChange = vector_1.rotateVector(-lowestEdge.angle, positionChange);
        }
        return { positionChange: positionChange, momentumChange: momentumChange, angle: angle };
    };
    return Doodad;
}());
exports.Doodad = Doodad;


/***/ }),

/***/ "./src/objects/terrain/floor/clientFloor.ts":
/*!**************************************************!*\
  !*** ./src/objects/terrain/floor/clientFloor.ts ***!
  \**************************************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: top-level-this-exports, __webpack_exports__, __webpack_require__ */
/*! CommonJS bailout: this is used directly at 2:17-21 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.ClientFloor = void 0;
var config_1 = __webpack_require__(/*! ../../../config */ "./src/config.ts");
var actorConfig_1 = __webpack_require__(/*! ../../newActors/actorConfig */ "./src/objects/newActors/actorConfig.ts");
var floor_1 = __webpack_require__(/*! ./floor */ "./src/objects/terrain/floor/floor.ts");
var ClientFloor = /** @class */ (function (_super) {
    __extends(ClientFloor, _super);
    function ClientFloor(game, pointsAndAngles, pointCount, resultWidth, ctx) {
        var _this = _super.call(this, pointCount, resultWidth, pointsAndAngles) || this;
        _this.game = game;
        _this.ctx = ctx;
        _this.gameHeight = config_1.defaultConfig.ySize;
        _this.gameWidth = config_1.defaultConfig.xSize;
        return _this;
    }
    ClientFloor.prototype.render = function (screenPos, screenSize) {
        this.ctx.fillStyle = "#1b4a20"; //"white";
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.pointsAndAngles[0].point);
        for (var i = 1; i < this.pointCount; i++) {
            this.ctx.lineTo(i * this.resultWidth, this.pointsAndAngles[i].point);
        }
        for (var i = this.pointCount - 1; i >= 0; i--) {
            this.ctx.lineTo(i * this.resultWidth, this.pointsAndAngles[i].point + 15);
        }
        this.ctx.fill();
        this.ctx.fillStyle = actorConfig_1.defaultActorConfig.dirtColorNight;
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.gameHeight + 10);
        for (var i = 0; i < this.pointCount; i++) {
            this.ctx.lineTo(i * this.resultWidth, this.pointsAndAngles[i].point + 14);
        }
        this.ctx.lineTo((this.pointCount - 1) * this.resultWidth, this.gameHeight + 10);
        this.ctx.fill();
        this.ctx.fillRect(Math.max(screenPos.x, 0), this.gameHeight + 5, Math.min(screenSize.width, this.gameWidth - screenPos.x), screenSize.height + screenPos.y);
    };
    return ClientFloor;
}(floor_1.Floor));
exports.ClientFloor = ClientFloor;


/***/ }),

/***/ "./src/objects/terrain/floor/floor.ts":
/*!********************************************!*\
  !*** ./src/objects/terrain/floor/floor.ts ***!
  \********************************************/
/*! flagged exports */
/*! export Floor [provided] [no usage info] [missing usage info prevents renaming] */
/*! export __esModule [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__ */
/***/ ((__unused_webpack_module, exports) => {


exports.__esModule = true;
exports.Floor = void 0;
var Floor = /** @class */ (function () {
    function Floor(pointCount, resultWidth, pointsAndAngles) {
        this.pointCount = pointCount;
        this.resultWidth = resultWidth;
        this.pointsAndAngles = pointsAndAngles;
    }
    Floor.prototype.getYCoordAndAngle = function (xPos) {
        var i = Math.floor(xPos / this.resultWidth);
        if (i < 0) {
            return { yCoord: this.pointsAndAngles[0].point, angle: this.pointsAndAngles[0].angle };
        }
        else if (i >= this.pointCount - 1) {
            return {
                yCoord: this.pointsAndAngles[this.pointCount - 1].point,
                angle: this.pointsAndAngles[this.pointCount - 1].angle,
            };
        }
        else {
            var percentage = xPos / this.resultWidth - i;
            return {
                yCoord: this.pointsAndAngles[i].point + this.pointsAndAngles[i].slope * percentage,
                angle: this.pointsAndAngles[i].angle,
            };
        }
    };
    return Floor;
}());
exports.Floor = Floor;


/***/ }),

/***/ "./src/random.ts":
/*!***********************!*\
  !*** ./src/random.ts ***!
  \***********************/
/*! flagged exports */
/*! export Random [provided] [no usage info] [missing usage info prevents renaming] */
/*! export __esModule [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__ */
/***/ ((__unused_webpack_module, exports) => {


exports.__esModule = true;
exports.Random = void 0;
var Random = /** @class */ (function () {
    function Random() {
    }
    Random.nextDouble = function () {
        return Math.random();
    };
    Random.range = function (min, max) {
        var range = max - min;
        return Math.random() * range + min;
    };
    Random.rangeFloor = function (min, max) {
        var range = max - min;
        return Math.floor(Math.random() * range + min);
    };
    Random.nextCircleVector = function () {
        var angle = Math.random() * 2 * Math.PI;
        return {
            x: Math.cos(angle),
            y: Math.sin(angle),
        };
    };
    Random.nextGaussian = function (mean, stdDev) {
        var x1 = 0;
        var x2 = 0;
        var y1 = 0;
        var z = 0;
        if (Random.usePrevious) {
            Random.usePrevious = false;
            return mean + Random.y2 * stdDev;
        }
        do {
            x1 = 2 * Math.random() - 1;
            x2 = 2 * Math.random() - 1;
            z = x1 * x1 + x2 * x2;
        } while (z >= 1);
        z = Math.sqrt((-2 * Math.log(z)) / z);
        y1 = x1 * z;
        Random.y2 = x2 * z;
        return mean + y1 * stdDev;
    };
    Random.usePrevious = false;
    Random.y2 = 0;
    return Random;
}());
exports.Random = Random;


/***/ }),

/***/ "./src/vector.ts":
/*!***********************!*\
  !*** ./src/vector.ts ***!
  \***********************/
/*! flagged exports */
/*! export __esModule [provided] [no usage info] [missing usage info prevents renaming] */
/*! export dotProduct [provided] [no usage info] [missing usage info prevents renaming] */
/*! export findDifference [provided] [no usage info] [missing usage info prevents renaming] */
/*! export findDistance [provided] [no usage info] [missing usage info prevents renaming] */
/*! export findLength [provided] [no usage info] [missing usage info prevents renaming] */
/*! export findMinDistancePointToEdge [provided] [no usage info] [missing usage info prevents renaming] */
/*! export findMirroredAngle [provided] [no usage info] [missing usage info prevents renaming] */
/*! export findOrthonormalVector [provided] [no usage info] [missing usage info prevents renaming] */
/*! export findVectorFromAngle [provided] [no usage info] [missing usage info prevents renaming] */
/*! export rootKeepSign [provided] [no usage info] [missing usage info prevents renaming] */
/*! export rotateShape [provided] [no usage info] [missing usage info prevents renaming] */
/*! export rotateVector [provided] [no usage info] [missing usage info prevents renaming] */
/*! export vectorProject [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__, __webpack_require__ */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


exports.__esModule = true;
exports.findOrthonormalVector = exports.rootKeepSign = exports.findMinDistancePointToEdge = exports.vectorProject = exports.dotProduct = exports.rotateShape = exports.findMirroredAngle = exports.rotateVector = exports.findLength = exports.findDifference = exports.findDistance = exports.findVectorFromAngle = void 0;
var findAngle_1 = __webpack_require__(/*! ./findAngle */ "./src/findAngle.ts");
function findVectorFromAngle(angle, magnitude) {
    if (magnitude === void 0) { magnitude = 1; }
    return { x: Math.cos(angle) * magnitude, y: Math.sin(angle) * magnitude };
}
exports.findVectorFromAngle = findVectorFromAngle;
function findDistance(a, b) {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}
exports.findDistance = findDistance;
function findDifference(a, b) {
    return { x: b.x - a.x, y: b.y - a.y };
}
exports.findDifference = findDifference;
function findLength(vector) {
    return Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2));
}
exports.findLength = findLength;
function rotateVector(angle, vector) {
    return {
        x: vector.x * Math.cos(angle) - vector.y * Math.sin(angle),
        y: vector.x * Math.sin(angle) + vector.y * Math.cos(angle),
    };
}
exports.rotateVector = rotateVector;
function findMirroredAngle(angle) {
    if (angle < Math.PI / -2) {
        return -Math.PI - angle;
    }
    else if (angle > Math.PI / 2) {
        return Math.PI - angle;
    }
    else {
        return angle;
    }
}
exports.findMirroredAngle = findMirroredAngle;
function rotateShape(shape, angle, positionOffset, flipOverY) {
    if (flipOverY === void 0) { flipOverY = false; }
    var newVectorArray = [];
    for (var i = 0; i < shape.length; i++) {
        newVectorArray.push({ x: shape[i].x + 0, y: shape[i].y + 0 });
        var tan = findAngle_1.findAngle({ x: 0, y: 0 }, { x: newVectorArray[i].x, y: newVectorArray[i].y });
        var mag = findLength(newVectorArray[i]);
        newVectorArray[i].x = mag * Math.cos(tan + angle);
        newVectorArray[i].y = mag * Math.sin(tan + angle) + positionOffset.y;
        if (flipOverY) {
            // flip it around if they're facing left
            newVectorArray[i].x *= -1;
        }
        newVectorArray[i].x += positionOffset.x;
    }
    return newVectorArray;
}
exports.rotateShape = rotateShape;
function dotProduct(v1, v2) {
    return v1.x * v2.x + v1.y * v2.y;
}
exports.dotProduct = dotProduct;
function vectorProject(v1, v2) {
    var norm = findDistance({ x: 0, y: 0 }, v2);
    var scalar = dotProduct(v1, v2) / Math.pow(norm, 2);
    return { x: v2.x * scalar, y: v2.y * scalar };
}
exports.vectorProject = vectorProject;
function dist2(v, w) {
    return Math.pow(v.x - w.x, 2) + Math.pow(v.y - w.y, 2);
}
function findMinDistancePointToEdge(point, edge) {
    var l2 = dist2(edge.p1, edge.p2);
    if (l2 === 0)
        return { x: edge.p1.x - point.x, y: edge.p1.y - point.y };
    var t = ((point.x - edge.p1.x) * (edge.p2.x - edge.p1.x) + (point.y - edge.p1.y) * (edge.p2.y - edge.p1.y)) / l2;
    t = Math.max(0, Math.min(1, t));
    var closestPoint = { x: edge.p1.x + t * (edge.p2.x - edge.p1.x), y: edge.p1.y + t * (edge.p2.y - edge.p1.y) };
    return { x: closestPoint.x - point.x, y: closestPoint.y - point.y };
}
exports.findMinDistancePointToEdge = findMinDistancePointToEdge;
function rootKeepSign(number, root) {
    if (number >= 0)
        return Math.pow(number, 1 / root);
    else
        return Math.pow(Math.abs(number), 1 / root) * -1;
}
exports.rootKeepSign = rootKeepSign;
function findOrthonormalVector(vector1, vector2) {
    var magnitude = findDistance(vector1, vector2);
    return { x: (vector2.y - vector1.y) / magnitude, y: (vector1.x - vector2.x) / magnitude };
}
exports.findOrthonormalVector = findOrthonormalVector;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	// startup
/******/ 	// Load entry module
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	__webpack_require__("./src/client/index.ts");
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvY2xpZW50L2dhbWUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NsaWVudC9nYW1lUmVuZGVyL2Fzc2V0bWFuYWdlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY2xpZW50L2dhbWVSZW5kZXIvZ2FtZVJlbmRlcmVyLnRzIiwid2VicGFjazovLy8uL3NyYy9jbGllbnQvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NsaWVudC9tYWluTWVudS9jb21tZW50cy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY2xpZW50L21haW5NZW51L3NldHRpbmdzLnRzIiwid2VicGFjazovLy8uL3NyYy9jbGllbnQvbWVzc2FnZUhhbmRsZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NsaWVudC9wYXJ0aWNsZXMvcGFydGljbGVDbGFzc2VzL2R1bW15U2xhc2hFZmZlY3QyLnRzIiwid2VicGFjazovLy8uL3NyYy9jbGllbnQvcGFydGljbGVzL3BhcnRpY2xlQ2xhc3Nlcy9kdW1teVdoaXJsd2luZEVmZmVjdC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY2xpZW50L3BhcnRpY2xlcy9wYXJ0aWNsZUNsYXNzZXMvbHVuZ2VFZmZlY3QudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NsaWVudC9wYXJ0aWNsZXMvcGFydGljbGVDbGFzc2VzL3BhcnRpY2xlQmFzZUNsYXNzLnRzIiwid2VicGFjazovLy8uL3NyYy9jbGllbnQvcGFydGljbGVzL3BhcnRpY2xlQ2xhc3Nlcy9zcGFyay50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY2xpZW50L3BhcnRpY2xlcy9wYXJ0aWNsZUdyb3Vwcy9wYXJ0aWNsZUdyb3VwLnRzIiwid2VicGFjazovLy8uL3NyYy9jbGllbnQvcGFydGljbGVzL3BhcnRpY2xlR3JvdXBzL3NwYXJrcy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY2xpZW50L3BhcnRpY2xlcy9wYXJ0aWNsZVN5c3RlbS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY2xpZW50L3NlcnZlcnRhbGtlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY2xpZW50L3V0aWwudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbmZpZy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZmluZEFuZ2xlLnRzIiwid2VicGFjazovLy8uL3NyYy9pZkluc2lkZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvaWZJbnRlcnNlY3QudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2xpbmtlZExpc3QudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL29iamVjdHMvY2xpZW50Q29udHJvbGxlcnMvY29udHJvbGxlcnMvYWJpbGl0aWVzL2RhZ2dlcnNBYmlsaXRpZXMvZGFnZ2Vyc0x1bmdlQWJpbGl0eS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvb2JqZWN0cy9jbGllbnRDb250cm9sbGVycy9jb250cm9sbGVycy9hYmlsaXRpZXMvZGFnZ2Vyc0FiaWxpdGllcy9kYWdnZXJzU3RhYkFiaWxpdHkudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL29iamVjdHMvY2xpZW50Q29udHJvbGxlcnMvY29udHJvbGxlcnMvYWJpbGl0aWVzL2VtcHR5QWJpbGl0eS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvb2JqZWN0cy9jbGllbnRDb250cm9sbGVycy9jb250cm9sbGVycy9hYmlsaXRpZXMvaGFtbWVyQWJpbGl0aWVzL2hhbW1lclBvdW5kQWJpbGl0eS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvb2JqZWN0cy9jbGllbnRDb250cm9sbGVycy9jb250cm9sbGVycy9hYmlsaXRpZXMvaGFtbWVyQWJpbGl0aWVzL2hhbW1lclN3aW5nQWJpbGl0eS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvb2JqZWN0cy9jbGllbnRDb250cm9sbGVycy9jb250cm9sbGVycy9hYmlsaXRpZXMvcGxheWVyQWJpbGl0eS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvb2JqZWN0cy9jbGllbnRDb250cm9sbGVycy9jb250cm9sbGVycy9hYmlsaXRpZXMvcGxheWVySG9sZEFiaWxpdHkudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL29iamVjdHMvY2xpZW50Q29udHJvbGxlcnMvY29udHJvbGxlcnMvYWJpbGl0aWVzL3BsYXllclByZXNzQWJpbGl0eS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvb2JqZWN0cy9jbGllbnRDb250cm9sbGVycy9jb250cm9sbGVycy9hYmlsaXRpZXMvc3dvcmRBYmlsaXRpZXMvc3dvcmRTbGFzaEFiaWxpdHkudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL29iamVjdHMvY2xpZW50Q29udHJvbGxlcnMvY29udHJvbGxlcnMvYWJpbGl0aWVzL3N3b3JkQWJpbGl0aWVzL3N3b3JkV2hpcmx3aW5kQWJpbGl0eS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvb2JqZWN0cy9jbGllbnRDb250cm9sbGVycy9jb250cm9sbGVycy9jb250cm9sbGVyLnRzIiwid2VicGFjazovLy8uL3NyYy9vYmplY3RzL2NsaWVudENvbnRyb2xsZXJzL2NvbnRyb2xsZXJzL2RhZ2dlcnNDb250cm9sbGVyLnRzIiwid2VicGFjazovLy8uL3NyYy9vYmplY3RzL2NsaWVudENvbnRyb2xsZXJzL2NvbnRyb2xsZXJzL2hhbW1lckNvbnRyb2xsZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL29iamVjdHMvY2xpZW50Q29udHJvbGxlcnMvY29udHJvbGxlcnMvc3dvcmRDb250cm9sbGVyLnRzIiwid2VicGFjazovLy8uL3NyYy9vYmplY3RzL2NsaWVudENvbnRyb2xsZXJzL2lucHV0UmVhZGVyLnRzIiwid2VicGFjazovLy8uL3NyYy9vYmplY3RzL2NsaWVudENvbnRyb2xsZXJzL3VzZXJJbnRlcmZhY2UudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL29iamVjdHMvbmV3QWN0b3JzL2FjdG9yLnRzIiwid2VicGFjazovLy8uL3NyYy9vYmplY3RzL25ld0FjdG9ycy9hY3RvckNvbmZpZy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvb2JqZWN0cy9uZXdBY3RvcnMvYWN0b3JPYmplY3RzL2FjdG9yT2JqZWN0LnRzIiwid2VicGFjazovLy8uL3NyYy9vYmplY3RzL25ld0FjdG9ycy9hY3Rvck9iamVjdHMvcGxheWVyT2JqZWN0LnRzIiwid2VicGFjazovLy8uL3NyYy9vYmplY3RzL25ld0FjdG9ycy9hY3Rvck9iamVjdHMvdHJhbnNsYXRpb25zLnRzIiwid2VicGFjazovLy8uL3NyYy9vYmplY3RzL25ld0FjdG9ycy9jbGllbnRBY3RvcnMvY2xpZW50QWN0b3IudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL29iamVjdHMvbmV3QWN0b3JzL2NsaWVudEFjdG9ycy9jbGllbnRQbGF5ZXIvY2xpZW50Q2xhc3Nlcy9jbGllbnREYWdnZXJzLnRzIiwid2VicGFjazovLy8uL3NyYy9vYmplY3RzL25ld0FjdG9ycy9jbGllbnRBY3RvcnMvY2xpZW50UGxheWVyL2NsaWVudENsYXNzZXMvY2xpZW50SGFtbWVyLnRzIiwid2VicGFjazovLy8uL3NyYy9vYmplY3RzL25ld0FjdG9ycy9jbGllbnRBY3RvcnMvY2xpZW50UGxheWVyL2NsaWVudENsYXNzZXMvY2xpZW50U3dvcmQudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL29iamVjdHMvbmV3QWN0b3JzL2NsaWVudEFjdG9ycy9jbGllbnRQbGF5ZXIvY2xpZW50UGxheWVyLnRzIiwid2VicGFjazovLy8uL3NyYy9vYmplY3RzL25ld0FjdG9ycy9jbGllbnRBY3RvcnMvbW9kZWwvaGVhbHRoQmFyLnRzIiwid2VicGFjazovLy8uL3NyYy9vYmplY3RzL25ld0FjdG9ycy9jbGllbnRBY3RvcnMvbW9kZWwvam9pbnQudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL29iamVjdHMvbmV3QWN0b3JzL2NsaWVudEFjdG9ycy9tb2RlbC9tb2RlbC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvb2JqZWN0cy9uZXdBY3RvcnMvY2xpZW50QWN0b3JzL21vZGVsL3BsYXllck1vZGVscy9kYWdnZXJzUGxheWVyTW9kZWwudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL29iamVjdHMvbmV3QWN0b3JzL2NsaWVudEFjdG9ycy9tb2RlbC9wbGF5ZXJNb2RlbHMvaGFtbWVyUGxheWVyTW9kZWwudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL29iamVjdHMvbmV3QWN0b3JzL2NsaWVudEFjdG9ycy9tb2RlbC9wbGF5ZXJNb2RlbHMvcGxheWVyTW9kZWwudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL29iamVjdHMvbmV3QWN0b3JzL2NsaWVudEFjdG9ycy9tb2RlbC9wbGF5ZXJNb2RlbHMvc3dvcmRQbGF5ZXJNb2RlbC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvb2JqZWN0cy90ZXJyYWluL2Rvb2RhZHMvY2xpZW50RG9vZGFkLnRzIiwid2VicGFjazovLy8uL3NyYy9vYmplY3RzL3RlcnJhaW4vZG9vZGFkcy9kb29kYWQudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL29iamVjdHMvdGVycmFpbi9mbG9vci9jbGllbnRGbG9vci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvb2JqZWN0cy90ZXJyYWluL2Zsb29yL2Zsb29yLnRzIiwid2VicGFjazovLy8uL3NyYy9yYW5kb20udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3ZlY3Rvci50cyIsIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svc3RhcnR1cCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFLQSx1RUFBNEM7QUFDNUMscUhBQXlEO0FBRXpELHFHQUE0RDtBQUU1RCwwTUFBdUc7QUFDdkcsa0lBQW1FO0FBRW5FLDBJQUF1RTtBQUV2RSx5SUFBdUU7QUFFdkUsNk1BQXlHO0FBQ3pHLGdOQUEyRztBQU8zRyx5SEFBNEQ7QUFHNUQ7SUFvQ0ksY0FDSSxJQUFhLEVBQ00sTUFBYyxFQUNkLEVBQVUsRUFDYixZQUEwQixFQUMxQyxjQUFzQjtRQUwxQixpQkFxQ0M7UUFuQ3NCLFdBQU0sR0FBTixNQUFNLENBQVE7UUFDZCxPQUFFLEdBQUYsRUFBRSxDQUFRO1FBQ2IsaUJBQVksR0FBWixZQUFZLENBQWM7UUFoQzNCLHVCQUFrQixHQUF1QjtZQUN4RCxNQUFNLEVBQUUsRUFBRTtZQUNWLE9BQU8sRUFBRSxFQUFF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RyxVQUFVLENBQUM7SUFDcEcsQ0FBQztJQUVELDRCQUFNLEdBQU47UUFDSSxJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsV0FBVyxHQUFHLEdBQUcsQ0FBQztRQUM5QyxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBRWhDLElBQUksTUFBTSxHQUFXLDhCQUFxQixDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzlFLElBQUksR0FBRyxHQUFXLEVBQUUsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLEdBQUcsVUFBVSxFQUFFLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxHQUFHLFVBQVUsRUFBRSxDQUFDO1FBQ3pFLElBQUksR0FBRyxHQUFXLEVBQUUsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUUzRSxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDNUQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbEUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbEUs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QUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFO1FBQ3RILE9BQU8sU0FBUyxDQUFDO0tBQ3BCO0lBRUQsSUFBSSxXQUFXLEdBQVcsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRXhJLHFCQUFxQjtJQUNyQixJQUFJLFdBQVcsS0FBSyxDQUFDLEVBQUU7UUFDbkIsT0FBTyxTQUFTLENBQUM7S0FDcEI7SUFFRCxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFD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Q0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7UUFFdkYsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztZQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQzs7WUFDbkQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksV0FBVyxHQUFHLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7SUFDM0YsQ0FBQztJQUVNLHVDQUFpQixHQUF4QixVQUF5QixLQUFhO1FBQ2xDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDdEQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUMxRCxDQUFDO0lBRVMsNkNBQXVCLEdBQWpDO1FBQ0ksSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQzNDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztZQUN0QyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1NBQ2xEO2FBQU0sSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssRUFBRTtZQUMzRCxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztZQUNuRCxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1NBQ2xEO0lBQ0wsQ0FBQztJQUVTLDZDQUF1QixHQUFqQztRQUNJLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUM1QyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzNDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7U0FDbEQ7YUFBTSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQzVELElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1lBQ3BELElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENB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QUM5RixDQUFDO0FBSEQsc0RBR0M7Ozs7Ozs7VUM3R0Q7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7OztVQ3JCQTtVQUNBO1VBQ0E7VUFDQSIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBbGxJbmZvIH0gZnJvbSBcIi4uL2FwaS9hbGxpbmZvXCI7XHJcbmltcG9ydCB7IFNlcnZlck1lc3NhZ2UgfSBmcm9tIFwiLi4vYXBpL21lc3NhZ2VcIjtcclxuaW1wb3J0IHsgQ29uZmlnIH0gZnJvbSBcIi4uL2NvbmZpZ1wiO1xyXG5pbXBvcnQgeyBTaGFwZSwgVmVjdG9yIH0gZnJvbSBcIi4uL3ZlY3RvclwiO1xyXG5pbXBvcnQgeyBTZXJ2ZXJUYWxrZXIgfSBmcm9tIFwiLi9zZXJ2ZXJ0YWxrZXJcIjtcclxuaW1wb3J0IHsgc2FmZUdldEVsZW1lbnRCeUlkIH0gZnJvbSBcIi4vdXRpbFwiO1xyXG5pbXBvcnQgeyBHYW1lUmVuZGVyZXIgfSBmcm9tIFwiLi9nYW1lUmVuZGVyL2dhbWVSZW5kZXJlclwiO1xyXG5pbXBvcnQgeyBmaW5kQW5nbGUsIHJvdGF0ZVNoYXBlIH0gZnJvbSBcIi4uL2ZpbmRBbmdsZVwiO1xyXG5pbXBvcnQgeyBoYW5kbGVNZXNzYWdlLCBmaW5kQWN0b3IgfSBmcm9tIFwiLi9tZXNzYWdlSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBDbGllbnRQbGF5ZXIgfSBmcm9tIFwiLi4vb2JqZWN0cy9uZXdBY3RvcnMvY2xpZW50QWN0b3JzL2NsaWVudFBsYXllci9jbGllbnRQbGF5ZXJcIjtcclxuaW1wb3J0IHsgQ2xpZW50U3dvcmQgfSBmcm9tIFwiLi4vb2JqZWN0cy9uZXdBY3RvcnMvY2xpZW50QWN0b3JzL2NsaWVudFBsYXllci9jbGllbnRDbGFzc2VzL2NsaWVudFN3b3JkXCI7XHJcbmltcG9ydCB7IENsaWVudEZsb29yIH0gZnJvbSBcIi4uL29iamVjdHMvdGVycmFpbi9mbG9vci9jbGllbnRGbG9vclwiO1xyXG5pbXBvcnQgeyBTZXJpYWxpemVkUGxheWVyIH0gZnJvbSBcIi4uL29iamVjdHMvbmV3QWN0b3JzL3NlcnZlckFjdG9ycy9zZXJ2ZXJQbGF5ZXIvc2VydmVyUGxheWVyXCI7XHJcbmltcG9ydCB7IElucHV0UmVhZGVyIH0gZnJvbSBcIi4uL29iamVjdHMvY2xpZW50Q29udHJvbGxlcnMvaW5wdXRSZWFkZXJcIjtcclxuaW1wb3J0IHsgaWZJbnNpZGUgfSBmcm9tIFwiLi4vaWZJbnNpZGVcIjtcclxuaW1wb3J0IHsgQ2xpZW50RG9vZGFkIH0gZnJvbSBcIi4uL29iamVjdHMvdGVycmFpbi9kb29kYWRzL2NsaWVudERvb2RhZFwiO1xyXG5pbXBvcnQgeyBEb29kYWQgfSBmcm9tIFwiLi4vb2JqZWN0cy90ZXJyYWluL2Rvb2RhZHMvZG9vZGFkXCI7XHJcbmltcG9ydCB7IENsaWVudEhhbW1lciB9IGZyb20gXCIuLi9vYmplY3RzL25ld0FjdG9ycy9jbGllbnRBY3RvcnMvY2xpZW50UGxheWVyL2NsaWVudENsYXNzZXMvY2xpZW50SGFtbWVyXCI7XHJcbmltcG9ydCB7IENsaWVudERhZ2dlcnMgfSBmcm9tIFwiLi4vb2JqZWN0cy9uZXdBY3RvcnMvY2xpZW50QWN0b3JzL2NsaWVudFBsYXllci9jbGllbnRDbGFzc2VzL2NsaWVudERhZ2dlcnNcIjtcclxuaW1wb3J0IHsgRmxvb3IgfSBmcm9tIFwiLi4vb2JqZWN0cy90ZXJyYWluL2Zsb29yL2Zsb29yXCI7XHJcbmltcG9ydCB7IENsaWVudEFjdG9yLCByZW5kZXJTaGFwZSB9IGZyb20gXCIuLi9vYmplY3RzL25ld0FjdG9ycy9jbGllbnRBY3RvcnMvY2xpZW50QWN0b3JcIjtcclxuaW1wb3J0IHsgU3dvcmRDb250cm9sbGVyIH0gZnJvbSBcIi4uL29iamVjdHMvY2xpZW50Q29udHJvbGxlcnMvY29udHJvbGxlcnMvc3dvcmRDb250cm9sbGVyXCI7XHJcbmltcG9ydCB7IERhZ2dlcnNDb250cm9sbGVyIH0gZnJvbSBcIi4uL29iamVjdHMvY2xpZW50Q29udHJvbGxlcnMvY29udHJvbGxlcnMvZGFnZ2Vyc0NvbnRyb2xsZXJcIjtcclxuaW1wb3J0IHsgSGFtbWVyQ29udHJvbGxlciB9IGZyb20gXCIuLi9vYmplY3RzL2NsaWVudENvbnRyb2xsZXJzL2NvbnRyb2xsZXJzL2hhbW1lckNvbnRyb2xsZXJcIjtcclxuaW1wb3J0IHsgU2lkZVR5cGUgfSBmcm9tIFwiLi4vb2JqZWN0cy9uZXdBY3RvcnMvY2xpZW50QWN0b3JzL21vZGVsL2hlYWx0aEJhclwiO1xyXG5pbXBvcnQgeyBQYXJ0aWNsZVN5c3RlbSB9IGZyb20gXCIuL3BhcnRpY2xlcy9wYXJ0aWNsZVN5c3RlbVwiO1xyXG5pbXBvcnQgeyBTaXplIH0gZnJvbSBcIi4uL3NpemVcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBHYW1lIHtcclxuICAgIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IG1lbnVEaXYgPSBzYWZlR2V0RWxlbWVudEJ5SWQoXCJtZW51RGl2XCIpO1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgZ2FtZURpdiA9IHNhZmVHZXRFbGVtZW50QnlJZChcImdhbWVEaXZcIik7XHJcblxyXG4gICAgcHVibGljIGdhbWVSZW5kZXJlcjogR2FtZVJlbmRlcmVyO1xyXG4gICAgcHJvdGVjdGVkIGdhbWVQbGF5ZXI6IENsaWVudFBsYXllcjtcclxuICAgIHByb3RlY3RlZCBnYW1lUGxheWVySW5wdXRSZWFkZXI6IElucHV0UmVhZGVyO1xyXG5cclxuICAgIHByb3RlY3RlZCByZWFkb25seSBnbG9iYWxDbGllbnRBY3RvcnM6IEdsb2JhbENsaWVudEFjdG9ycyA9IHtcclxuICAgICAgICBhY3RvcnM6IFtdLFxyXG4gICAgICAgIHBsYXllcnM6IFtdLFxyXG4gICAgICAgIGRhZ2dlclBsYXllcnM6IFtdLFxyXG4gICAgICAgIGhhbW1lclBsYXllcnM6IFtdLFxyXG4gICAgICAgIHN3b3JkUGxheWVyczogW10sXHJcbiAgICB9O1xyXG4gICAgcHJvdGVjdGVkIHJlYWRvbmx5IGdsb2JhbENsaWVudE9iamVjdHM6IEdsb2JhbENsaWVudE9iamVjdHM7XHJcblxyXG4gICAgcHVibGljIHJlYWRvbmx5IHBhcnRpY2xlU3lzdGVtOiBQYXJ0aWNsZVN5c3RlbTtcclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIHBhcnRpY2xlQW1vdW50OiBudW1iZXI7XHJcbiAgICBwcml2YXRlIGdvaW5nOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgLy9wdWJsaWMgc2NyZWVuUG9zOiBWZWN0b3IgPSB7IHg6IDAsIHk6IDAgfTtcclxuICAgIHB1YmxpYyBtb3VzZVBvczogVmVjdG9yID0geyB4OiAwLCB5OiAwIH07XHJcblxyXG4gICAgcHJpdmF0ZSBoYW5kbGVNZXNzYWdlID0gaGFuZGxlTWVzc2FnZTtcclxuICAgIHByb3RlY3RlZCBmaW5kQWN0b3IgPSBmaW5kQWN0b3I7XHJcblxyXG4gICAgcHJvdGVjdGVkIGNvbnN0cnVjdEdhbWUoaW5mbzogQWxsSW5mbykge1xyXG4gICAgICAgIC8qdGhpcy5ncm91bmRQbGF0Zm9ybSA9IG5ldyBDbGllbnRHcm91bmRQbGF0Zm9ybShpbmZvLmdyb3VuZFBsYXRmb3JtKTtcclxuICAgICAgICB0aGlzLnBsYXRmb3JtcyA9IGluZm8ucGxhdGZvcm1zLm1hcCgocGxhdGZvcm1JbmZvKSA9PiBuZXcgQ2xpZW50UGxhdGZvcm0odGhpcy5jb25maWcsIHBsYXRmb3JtSW5mbykpO1xyXG4gICAgICAgIHRoaXMucGxheWVyQWN0b3JzID0gaW5mby5wbGF5ZXJBY3RvcnMubWFwKFxyXG4gICAgICAgICAgICAocGxheWVySW5mbykgPT4gbmV3IENsaWVudFBsYXllckFjdG9yKHRoaXMuY29uZmlnLCBwbGF5ZXJJbmZvLCB0aGlzLmlkID09PSBwbGF5ZXJJbmZvLmlkID8gdHJ1ZSA6IGZhbHNlLCB0aGlzLnNlcnZlclRhbGtlciksXHJcbiAgICAgICAgKTsqL1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIGluZm86IEFsbEluZm8sXHJcbiAgICAgICAgcHJvdGVjdGVkIHJlYWRvbmx5IGNvbmZpZzogQ29uZmlnLFxyXG4gICAgICAgIHByb3RlY3RlZCByZWFkb25seSBpZDogbnVtYmVyLFxyXG4gICAgICAgIHB1YmxpYyByZWFkb25seSBzZXJ2ZXJUYWxrZXI6IFNlcnZlclRhbGtlcixcclxuICAgICAgICBwYXJ0aWNsZUFtb3VudDogbnVtYmVyLFxyXG4gICAgKSB7XHJcbiAgICAgICAgR2FtZS5wYXJ0aWNsZUFtb3VudCA9IHBhcnRpY2xlQW1vdW50IC8gMTAwO1xyXG5cclxuICAgICAgICAvLyBDT05TVFJVQ1QgR0FNRVxyXG4gICAgICAgIGxldCBhY3RvckNhbnZhcyA9IHNhZmVHZXRFbGVtZW50QnlJZChcImFjdG9yQ2FudmFzXCIpIGFzIEhUTUxDYW52YXNFbGVtZW50O1xyXG4gICAgICAgIGxldCBhY3RvckN0eCA9IGFjdG9yQ2FudmFzLmdldENvbnRleHQoXCIyZFwiKSE7XHJcblxyXG4gICAgICAgIHRoaXMucGFydGljbGVTeXN0ZW0gPSBuZXcgUGFydGljbGVTeXN0ZW0oYWN0b3JDdHgsIHRoaXMpO1xyXG5cclxuICAgICAgICB0aGlzLmdsb2JhbENsaWVudE9iamVjdHMgPSB7XHJcbiAgICAgICAgICAgIGZsb29yOiBuZXcgQ2xpZW50Rmxvb3IodGhpcywgaW5mby5mbG9vci5wb2ludHNBbmRBbmdsZXMsIGluZm8uZmxvb3IucG9pbnRDb3VudCwgaW5mby5mbG9vci5yZXN1bHRXaWR0aCwgYWN0b3JDdHgpLFxyXG4gICAgICAgICAgICBkb29kYWRzOiBbXSxcclxuICAgICAgICB9O1xyXG4gICAgICAgIGluZm8uZG9vZGFkcy5mb3JFYWNoKChkb29kYWQpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5nbG9iYWxDbGllbnRPYmplY3RzLmRvb2RhZHMucHVzaChuZXcgQ2xpZW50RG9vZGFkKGRvb2RhZC5wb3NpdGlvbiwgZG9vZGFkLnJvdGF0aW9uLCBkb29kYWQudHlwZSwgYWN0b3JDdHgpKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaW5mby5wbGF5ZXJzLmZvckVhY2goKHBsYXllckluZm8pID0+IHtcclxuICAgICAgICAgICAgaWYgKHBsYXllckluZm8uaWQgIT09IHRoaXMuaWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubmV3Q2xpZW50UGxheWVyKHBsYXllckluZm8pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGxldCBnYW1lUGxheWVySW5mbzogU2VyaWFsaXplZFBsYXllciA9IGluZm8ucGxheWVycy5maW5kKChwbGF5ZXIpID0+IHBsYXllci5pZCA9PT0gdGhpcy5pZCkhO1xyXG4gICAgICAgIHRoaXMuZ2FtZVBsYXllciA9IHRoaXMubWFrZUdhbWVQbGF5ZXIoZ2FtZVBsYXllckluZm8pO1xyXG5cclxuICAgICAgICB0aGlzLmdhbWVQbGF5ZXJJbnB1dFJlYWRlciA9IG5ldyBJbnB1dFJlYWRlcih0aGlzLmdhbWVQbGF5ZXIsIHRoaXMpO1xyXG5cclxuICAgICAgICB0aGlzLmdhbWVSZW5kZXJlciA9IG5ldyBHYW1lUmVuZGVyZXIodGhpcy5jb25maWcsIHRoaXMsIHRoaXMuZ2FtZVBsYXllcik7XHJcblxyXG4gICAgICAgIHRoaXMuc2VydmVyVGFsa2VyLm1lc3NhZ2VIYW5kbGVyID0gKG1zZzogU2VydmVyTWVzc2FnZSkgPT4gdGhpcy5oYW5kbGVNZXNzYWdlKG1zZyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXJ0KCkge1xyXG4gICAgICAgIHRoaXMuZ29pbmcgPSB0cnVlO1xyXG5cclxuICAgICAgICAvLyB1c2Ugb25rZXlkb3duIGFuZCBvbmtleXVwIGluc3RlYWQgb2YgYWRkRXZlbnRMaXN0ZW5lciBiZWNhdXNlIGl0J3MgcG9zc2libGUgdG8gYWRkIG11bHRpcGxlIGV2ZW50IGxpc3RlbmVycyBwZXIgZXZlbnRcclxuICAgICAgICAvLyBUaGlzIHdvdWxkIGNhdXNlIGEgYnVnIHdoZXJlIGVhY2ggdGltZSB5b3UgcHJlc3MgYSBrZXkgaXQgY3JlYXRlcyBtdWx0aXBsZSBibGFzdHMgb3IganVtcHNcclxuXHJcbiAgICAgICAgd2luZG93Lm9ubW91c2Vkb3duID0gKGU6IE1vdXNlRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgLypsZXQgZ2xvYmFsTW91c2U6IFZlY3RvciA9IHRoaXMuZ2V0R2xvYmFsTW91c2VQb3MoKTtcclxuICAgICAgICAgICAgbGV0IHBsYXllclBvczogVmVjdG9yID0gdGhpcy5nYW1lUGxheWVyLnBvc2l0aW9uO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInt4OiBcIiArIChwbGF5ZXJQb3MueCAtIGdsb2JhbE1vdXNlLngpICsgXCIsIHk6IFwiICsgKHBsYXllclBvcy55IC0gZ2xvYmFsTW91c2UueSkgKyBcIn0sXCIpOyovXHJcbiAgICAgICAgICAgIHRoaXMuZ2FtZVBsYXllcklucHV0UmVhZGVyLnJlZ2lzdGVyTW91c2VEb3duKGUsIHRoaXMuZ2V0R2xvYmFsTW91c2VQb3MoKSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB3aW5kb3cub25tb3VzZXVwID0gKGU6IE1vdXNlRXZlbnQpID0+IHRoaXMuZ2FtZVBsYXllcklucHV0UmVhZGVyLnJlZ2lzdGVyTW91c2VVcChlLCB0aGlzLmdldEdsb2JhbE1vdXNlUG9zKCkpO1xyXG4gICAgICAgIHdpbmRvdy5vbmtleWRvd24gPSAoZTogS2V5Ym9hcmRFdmVudCkgPT4gdGhpcy5nYW1lUGxheWVySW5wdXRSZWFkZXIucmVnaXN0ZXJLZXlEb3duKGUsIHRoaXMuZ2V0R2xvYmFsTW91c2VQb3MoKSk7XHJcbiAgICAgICAgd2luZG93Lm9ua2V5dXAgPSAoZTogS2V5Ym9hcmRFdmVudCkgPT4gdGhpcy5nYW1lUGxheWVySW5wdXRSZWFkZXIucmVnaXN0ZXJLZXlVcChlLCB0aGlzLmdldEdsb2JhbE1vdXNlUG9zKCkpO1xyXG5cclxuICAgICAgICB3aW5kb3cub25tb3VzZW1vdmUgPSAoZTogTW91c2VFdmVudCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLm1vdXNlUG9zLnggPSBlLmNsaWVudFg7XHJcbiAgICAgICAgICAgIHRoaXMubW91c2VQb3MueSA9IGUuY2xpZW50WTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCh0aW1lc3RhbXApID0+IHRoaXMubG9vcCh0aW1lc3RhbXApKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZW5kKCkge1xyXG4gICAgICAgIHRoaXMuZ29pbmcgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLnNlcnZlclRhbGtlci5sZWF2ZSgpO1xyXG5cclxuICAgICAgICB3aW5kb3cub25tb3VzZWRvd24gPSAoKSA9PiB7fTtcclxuICAgICAgICB3aW5kb3cub25tb3VzZXVwID0gKCkgPT4ge307XHJcbiAgICAgICAgd2luZG93Lm9ua2V5ZG93biA9ICgpID0+IHt9O1xyXG4gICAgICAgIHdpbmRvdy5vbmtleXVwID0gKCkgPT4ge307XHJcbiAgICAgICAgd2luZG93Lm9ubW91c2Vtb3ZlID0gKCkgPT4ge307XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBsYXN0RnJhbWU/OiBudW1iZXI7XHJcbiAgICBwdWJsaWMgbG9vcCh0aW1lc3RhbXA6IG51bWJlcikge1xyXG4gICAgICAgIGlmICghdGhpcy5sYXN0RnJhbWUpIHtcclxuICAgICAgICAgICAgdGhpcy5sYXN0RnJhbWUgPSB0aW1lc3RhbXA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IGVsYXBzZWRUaW1lID0gKHRpbWVzdGFtcCAtIHRoaXMubGFzdEZyYW1lKSAvIDEwMDA7XHJcbiAgICAgICAgdGhpcy5sYXN0RnJhbWUgPSB0aW1lc3RhbXA7XHJcbiAgICAgICAgdGhpcy51cGRhdGUoZWxhcHNlZFRpbWUgKiB0aGlzLmNvbmZpZy5nYW1lU3BlZWQpO1xyXG4gICAgICAgIGlmICh0aGlzLmdvaW5nKSB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKHRpbWVzdGFtcCkgPT4gdGhpcy5sb29wKHRpbWVzdGFtcCkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHVwZGF0ZShlbGFwc2VkVGltZTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5nYW1lUGxheWVySW5wdXRSZWFkZXIudXBkYXRlKGVsYXBzZWRUaW1lKTtcclxuXHJcbiAgICAgICAgdGhpcy51cGRhdGVPYmplY3RzKGVsYXBzZWRUaW1lKTtcclxuXHJcbiAgICAgICAgdGhpcy5nYW1lUmVuZGVyZXIudXBkYXRlQW5kUmVuZGVyKGVsYXBzZWRUaW1lKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHVwZGF0ZU9iamVjdHMoZWxhcHNlZFRpbWU6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuZ2xvYmFsQ2xpZW50QWN0b3JzLnBsYXllcnMuZm9yRWFjaCgocGxheWVyKSA9PiBwbGF5ZXIudXBkYXRlKGVsYXBzZWRUaW1lKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIG5ld0NsaWVudFBsYXllcihwbGF5ZXJJbmZvOiBTZXJpYWxpemVkUGxheWVyKSB7XHJcbiAgICAgICAgdmFyIG5ld1BsYXllcjogQ2xpZW50UGxheWVyO1xyXG4gICAgICAgIHN3aXRjaCAocGxheWVySW5mby5jbGFzcykge1xyXG4gICAgICAgICAgICBjYXNlIFwiZGFnZ2Vyc1wiOlxyXG4gICAgICAgICAgICAgICAgbmV3UGxheWVyID0gbmV3IENsaWVudERhZ2dlcnModGhpcywgcGxheWVySW5mbyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdsb2JhbENsaWVudEFjdG9ycy5kYWdnZXJQbGF5ZXJzLnB1c2gobmV3UGxheWVyIGFzIENsaWVudERhZ2dlcnMpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJoYW1tZXJcIjpcclxuICAgICAgICAgICAgICAgIG5ld1BsYXllciA9IG5ldyBDbGllbnRIYW1tZXIodGhpcywgcGxheWVySW5mbyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdsb2JhbENsaWVudEFjdG9ycy5oYW1tZXJQbGF5ZXJzLnB1c2gobmV3UGxheWVyIGFzIENsaWVudEhhbW1lcik7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcInN3b3JkXCI6XHJcbiAgICAgICAgICAgICAgICBuZXdQbGF5ZXIgPSBuZXcgQ2xpZW50U3dvcmQodGhpcywgcGxheWVySW5mbyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdsb2JhbENsaWVudEFjdG9ycy5zd29yZFBsYXllcnMucHVzaChuZXdQbGF5ZXIgYXMgQ2xpZW50U3dvcmQpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ1bmtub3duIGNsYXNzIHR5cGUgXCIgKyBwbGF5ZXJJbmZvLmNsYXNzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5nbG9iYWxDbGllbnRBY3RvcnMucGxheWVycy5wdXNoKG5ld1BsYXllcik7XHJcbiAgICAgICAgdGhpcy5nbG9iYWxDbGllbnRBY3RvcnMuYWN0b3JzLnB1c2gobmV3UGxheWVyKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgbWFrZUdhbWVQbGF5ZXIocGxheWVySW5mbzogU2VyaWFsaXplZFBsYXllcik6IENsaWVudFBsYXllciB7XHJcbiAgICAgICAgdmFyIG5ld0dhbWVQbGF5ZXI6IENsaWVudFBsYXllcjtcclxuICAgICAgICBzd2l0Y2ggKHBsYXllckluZm8uY2xhc3MpIHtcclxuICAgICAgICAgICAgY2FzZSBcImRhZ2dlcnNcIjpcclxuICAgICAgICAgICAgICAgIG5ld0dhbWVQbGF5ZXIgPSBuZXcgQ2xpZW50RGFnZ2Vycyh0aGlzLCBwbGF5ZXJJbmZvKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2xvYmFsQ2xpZW50QWN0b3JzLmRhZ2dlclBsYXllcnMucHVzaChuZXdHYW1lUGxheWVyIGFzIENsaWVudERhZ2dlcnMpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJoYW1tZXJcIjpcclxuICAgICAgICAgICAgICAgIG5ld0dhbWVQbGF5ZXIgPSBuZXcgQ2xpZW50SGFtbWVyKHRoaXMsIHBsYXllckluZm8pO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5nbG9iYWxDbGllbnRBY3RvcnMuaGFtbWVyUGxheWVycy5wdXNoKG5ld0dhbWVQbGF5ZXIgYXMgQ2xpZW50SGFtbWVyKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwic3dvcmRcIjpcclxuICAgICAgICAgICAgICAgIG5ld0dhbWVQbGF5ZXIgPSBuZXcgQ2xpZW50U3dvcmQodGhpcywgcGxheWVySW5mbyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdsb2JhbENsaWVudEFjdG9ycy5zd29yZFBsYXllcnMucHVzaChuZXdHYW1lUGxheWVyIGFzIENsaWVudFN3b3JkKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwidW5rbm93biBjbGFzcyB0eXBlIFwiICsgcGxheWVySW5mby5jbGFzcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZ2xvYmFsQ2xpZW50QWN0b3JzLnBsYXllcnMucHVzaChuZXdHYW1lUGxheWVyKTtcclxuICAgICAgICB0aGlzLmdsb2JhbENsaWVudEFjdG9ycy5hY3RvcnMucHVzaChuZXdHYW1lUGxheWVyKTtcclxuICAgICAgICByZXR1cm4gbmV3R2FtZVBsYXllcjtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgcGxheWVyTGVhdmUoaWQ6IG51bWJlcikge1xyXG4gICAgICAgIGxldCBwbGF5ZXI6IENsaWVudFBsYXllciA9IHRoaXMuZ2xvYmFsQ2xpZW50QWN0b3JzLnBsYXllcnMuZmluZCgocGxheWVyKSA9PiBwbGF5ZXIuZ2V0QWN0b3JJZCgpID09PSBpZCkhO1xyXG4gICAgICAgIHN3aXRjaCAocGxheWVyLmdldENsYXNzVHlwZSgpKSB7XHJcbiAgICAgICAgICAgIGNhc2UgXCJkYWdnZXJzXCI6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdsb2JhbENsaWVudEFjdG9ycy5kYWdnZXJQbGF5ZXJzID0gdGhpcy5nbG9iYWxDbGllbnRBY3RvcnMuZGFnZ2VyUGxheWVycy5maWx0ZXIoKHBsYXllcikgPT4gcGxheWVyLmdldEFjdG9ySWQoKSAhPT0gaWQpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJzd29yZFwiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5nbG9iYWxDbGllbnRBY3RvcnMuc3dvcmRQbGF5ZXJzID0gdGhpcy5nbG9iYWxDbGllbnRBY3RvcnMuc3dvcmRQbGF5ZXJzLmZpbHRlcigocGxheWVyKSA9PiBwbGF5ZXIuZ2V0QWN0b3JJZCgpICE9PSBpZCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcImhhbW1lclwiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5nbG9iYWxDbGllbnRBY3RvcnMuaGFtbWVyUGxheWVycyA9IHRoaXMuZ2xvYmFsQ2xpZW50QWN0b3JzLmhhbW1lclBsYXllcnMuZmlsdGVyKChwbGF5ZXIpID0+IHBsYXllci5nZXRBY3RvcklkKCkgIT09IGlkKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwidW5rbm93biBjbGFzcyB0eXBlIGluIHBsYXllckxlYXZlXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmdsb2JhbENsaWVudEFjdG9ycy5wbGF5ZXJzID0gdGhpcy5nbG9iYWxDbGllbnRBY3RvcnMucGxheWVycy5maWx0ZXIoKHBsYXllcikgPT4gcGxheWVyLmdldEFjdG9ySWQoKSAhPT0gaWQpO1xyXG4gICAgICAgIHRoaXMuZ2xvYmFsQ2xpZW50QWN0b3JzLmFjdG9ycyA9IHRoaXMuZ2xvYmFsQ2xpZW50QWN0b3JzLmFjdG9ycy5maWx0ZXIoKGFjdG9yKSA9PiBhY3Rvci5nZXRBY3RvcklkKCkgIT09IGlkKTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBnZXRNb3VzZVNoYXBlKCk6IFNoYXBlIHtcclxuICAgICAgICAvKlxyXG4gICAgICAgIGxldCBwMTogVmVjdG9yID0geyB4OiB0aGlzLm1vdXNlUG9zLnggKyB0aGlzLnNjcmVlblBvcy54LCB5OiB0aGlzLm1vdXNlUG9zLnkgLSA0MCArIHRoaXMuc2NyZWVuUG9zLnkgfTtcclxuICAgICAgICBsZXQgcDI6IFZlY3RvciA9IHsgeDogdGhpcy5tb3VzZVBvcy54IC0gMzAgKyB0aGlzLnNjcmVlblBvcy54LCB5OiB0aGlzLm1vdXNlUG9zLnkgKyAyMCArIHRoaXMuc2NyZWVuUG9zLnkgfTtcclxuICAgICAgICBsZXQgcDM6IFZlY3RvciA9IHsgeDogdGhpcy5tb3VzZVBvcy54ICsgMzAgKyB0aGlzLnNjcmVlblBvcy54LCB5OiB0aGlzLm1vdXNlUG9zLnkgKyAyMCArIHRoaXMuc2NyZWVuUG9zLnkgfTtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBjZW50ZXI6IHsgeDogdGhpcy5tb3VzZVBvcy54ICsgdGhpcy5zY3JlZW5Qb3MueCwgeTogdGhpcy5tb3VzZVBvcy55ICsgdGhpcy5zY3JlZW5Qb3MueSB9LFxyXG4gICAgICAgICAgICBwb2ludHM6IFtwMSwgcDIsIHAzXSxcclxuICAgICAgICAgICAgZWRnZXM6IFtcclxuICAgICAgICAgICAgICAgIHsgcDEsIHAyIH0sXHJcbiAgICAgICAgICAgICAgICB7IHAxOiBwMiwgcDI6IHAzIH0sXHJcbiAgICAgICAgICAgICAgICB7IHAxOiBwMywgcDI6IHAxIH0sXHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgfTsqL1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcImdldE1vdXNlU2hhcGUgY3VycmVudGx5IG5vdCBhZGp1c3RlZCBmb3Igc2NyZWVuIGNlbnRlclwiKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXRHbG9iYWxNb3VzZVBvcygpOiBWZWN0b3Ige1xyXG4gICAgICAgIHJldHVybiB0aGlzLmdhbWVSZW5kZXJlci5nZXRDYW52YXNQb3NGcm9tU2NyZWVuKHRoaXMubW91c2VQb3MpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRHbG9iYWxPYmplY3RzKCk6IEdsb2JhbENsaWVudE9iamVjdHMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmdsb2JhbENsaWVudE9iamVjdHM7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0R2xvYmFsQWN0b3JzKCk6IEdsb2JhbENsaWVudEFjdG9ycyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2xvYmFsQ2xpZW50QWN0b3JzO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldEFjdG9yQ3R4KCk6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCB7XHJcbiAgICAgICAgcmV0dXJuIChzYWZlR2V0RWxlbWVudEJ5SWQoXCJhY3RvckNhbnZhc1wiKSBhcyBIVE1MQ2FudmFzRWxlbWVudCkuZ2V0Q29udGV4dChcIjJkXCIpITtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXRBY3RvclNpZGUodGVhbTogbnVtYmVyKTogU2lkZVR5cGUge1xyXG4gICAgICAgIGlmICh0ZWFtID09PSB0aGlzLmlkKSByZXR1cm4gXCJzZWxmXCI7XHJcbiAgICAgICAgZWxzZSByZXR1cm4gXCJlbmVteVwiO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldElkKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaWQ7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgR2xvYmFsT2JqZWN0cyB7XHJcbiAgICBmbG9vcjogRmxvb3I7XHJcbiAgICBkb29kYWRzOiBEb29kYWRbXTtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBHbG9iYWxDbGllbnRBY3RvcnMge1xyXG4gICAgYWN0b3JzOiBDbGllbnRBY3RvcltdO1xyXG4gICAgcGxheWVyczogQ2xpZW50UGxheWVyW107XHJcbiAgICBkYWdnZXJQbGF5ZXJzOiBDbGllbnREYWdnZXJzW107XHJcbiAgICBoYW1tZXJQbGF5ZXJzOiBDbGllbnRIYW1tZXJbXTtcclxuICAgIHN3b3JkUGxheWVyczogQ2xpZW50U3dvcmRbXTtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBHbG9iYWxDbGllbnRPYmplY3RzIGV4dGVuZHMgR2xvYmFsT2JqZWN0cyB7XHJcbiAgICBmbG9vcjogQ2xpZW50Rmxvb3I7XHJcbiAgICBkb29kYWRzOiBDbGllbnREb29kYWRbXTtcclxufVxyXG4iLCJpbXBvcnQgeyBEb29kYWRUeXBlIH0gZnJvbSBcIi4uLy4uL29iamVjdHMvdGVycmFpbi9kb29kYWRzL2Rvb2RhZFwiO1xyXG5pbXBvcnQgeyBTZXJ2ZXJUYWxrZXIgfSBmcm9tIFwiLi4vc2VydmVydGFsa2VyXCI7XHJcblxyXG5leHBvcnQgdHlwZSBBYmlsaXR5SW1hZ2VOYW1lID0gXCJzbGFzaEljb25cIiB8IFwid2hpcmx3aW5kSWNvblwiIHwgXCJlbXB0eUljb25cIiB8IFwibHZsMTBcIiB8IFwibHZsNlwiIHwgXCJzdGFiSWNvblwiIHwgXCJsdW5nZUljb25cIiB8IFwic3dpbmdJY29uXCIgfCBcInBvdW5kSWNvblwiO1xyXG5leHBvcnQgdHlwZSBXZWFwb25JbWFnZU5hbWUgPSBcInN3b3JkMzFcIiB8IFwic3dvcmQyMVwiIHwgXCJzd29yZDExXCIgfCBcImRhZ2dlcjExXCIgfCBcImhhbW1lcjExXCIgfCBcImhhbW1lcjIxXCIgfCBcImRhZ2dlcjIxXCI7XHJcbmV4cG9ydCB0eXBlIEdpZkltYWdlTmFtZSA9IFwic2xhc2hFZmZlY3RUZXN0MlwiIHwgXCJ3aGlybHdpbmRFZmZlY3RCYXNlXCIgfCBcIndoaXJsd2luZEVmZmVjdFRvcFwiO1xyXG5cclxuZXhwb3J0IHR5cGUgSW1hZ2VOYW1lID0gRG9vZGFkVHlwZSB8IEFiaWxpdHlJbWFnZU5hbWUgfCBXZWFwb25JbWFnZU5hbWUgfCBHaWZJbWFnZU5hbWU7XHJcblxyXG4vL2xldCBpbWc6IEhUTUxJbWFnZUVsZW1lbnQgPSBhc3NldE1hbmFnZXIuaW1hZ2VzW1wibGF2YWZseVwiXTtcclxuXHJcbmV4cG9ydCBjb25zdCBpbWFnZUluZm9ybWF0aW9uOiBSZWNvcmQ8SW1hZ2VOYW1lLCBzdHJpbmc+ID0ge1xyXG4gICAgcm9ja0xhcmdlOiBgaHR0cHM6Ly8ke1NlcnZlclRhbGtlci5ob3N0TmFtZX0vaW1hZ2VzL3JvY2tEb29kYWQucG5nYCxcclxuICAgIHNsYXNoSWNvbjogYGh0dHBzOi8vJHtTZXJ2ZXJUYWxrZXIuaG9zdE5hbWV9L2ltYWdlcy9hYmlsaXR5SWNvbnMvc2xhc2hJY29uLnBuZ2AsXHJcbiAgICBlbXB0eUljb246IGBodHRwczovLyR7U2VydmVyVGFsa2VyLmhvc3ROYW1lfS9pbWFnZXMvYWJpbGl0eUljb25zL2VtcHR5SWNvbi5wbmdgLFxyXG4gICAgd2hpcmx3aW5kSWNvbjogYGh0dHBzOi8vJHtTZXJ2ZXJUYWxrZXIuaG9zdE5hbWV9L2ltYWdlcy9hYmlsaXR5SWNvbnMvd2hpcmx3aW5kSWNvbi5wbmdgLFxyXG4gICAgbHZsMTA6IGBodHRwczovLyR7U2VydmVyVGFsa2VyLmhvc3ROYW1lfS9pbWFnZXMvYWJpbGl0eUljb25zL2x2bDEwLnBuZ2AsXHJcbiAgICBsdmw2OiBgaHR0cHM6Ly8ke1NlcnZlclRhbGtlci5ob3N0TmFtZX0vaW1hZ2VzL2FiaWxpdHlJY29ucy9sdmw2LnBuZ2AsXHJcbiAgICBzdGFiSWNvbjogYGh0dHBzOi8vJHtTZXJ2ZXJUYWxrZXIuaG9zdE5hbWV9L2ltYWdlcy9hYmlsaXR5SWNvbnMvc3RhYkljb24ucG5nYCxcclxuICAgIGx1bmdlSWNvbjogYGh0dHBzOi8vJHtTZXJ2ZXJUYWxrZXIuaG9zdE5hbWV9L2ltYWdlcy9hYmlsaXR5SWNvbnMvbHVuZ2VJY29uLnBuZ2AsXHJcbiAgICBzd2luZ0ljb246IGBodHRwczovLyR7U2VydmVyVGFsa2VyLmhvc3ROYW1lfS9pbWFnZXMvYWJpbGl0eUljb25zL3N3aW5nSWNvbi5wbmdgLFxyXG4gICAgcG91bmRJY29uOiBgaHR0cHM6Ly8ke1NlcnZlclRhbGtlci5ob3N0TmFtZX0vaW1hZ2VzL2FiaWxpdHlJY29ucy9wb3VuZEljb24ucG5nYCxcclxuICAgIHN3b3JkMTE6IGBodHRwczovLyR7U2VydmVyVGFsa2VyLmhvc3ROYW1lfS9pbWFnZXMvd2VhcG9uSW1hZ2VzL3N3b3JkMTEucG5nYCxcclxuICAgIHN3b3JkMjE6IGBodHRwczovLyR7U2VydmVyVGFsa2VyLmhvc3ROYW1lfS9pbWFnZXMvd2VhcG9uSW1hZ2VzL3N3b3JkMjEucG5nYCxcclxuICAgIHN3b3JkMzE6IGBodHRwczovLyR7U2VydmVyVGFsa2VyLmhvc3ROYW1lfS9pbWFnZXMvd2VhcG9uSW1hZ2VzL3N3b3JkMzEucG5nYCxcclxuICAgIGhhbW1lcjExOiBgaHR0cHM6Ly8ke1NlcnZlclRhbGtlci5ob3N0TmFtZX0vaW1hZ2VzL3dlYXBvbkltYWdlcy9oYW1tZXIxMS5wbmdgLFxyXG4gICAgaGFtbWVyMjE6IGBodHRwczovLyR7U2VydmVyVGFsa2VyLmhvc3ROYW1lfS9pbWFnZXMvd2VhcG9uSW1hZ2VzL2hhbW1lcjIxLnBuZ2AsXHJcbiAgICBkYWdnZXIxMTogYGh0dHBzOi8vJHtTZXJ2ZXJUYWxrZXIuaG9zdE5hbWV9L2ltYWdlcy93ZWFwb25JbWFnZXMvZGFnZ2VyMTEucG5nYCxcclxuICAgIGRhZ2dlcjIxOiBgaHR0cHM6Ly8ke1NlcnZlclRhbGtlci5ob3N0TmFtZX0vaW1hZ2VzL3dlYXBvbkltYWdlcy9kYWdnZXIyMS5wbmdgLFxyXG4gICAgc2xhc2hFZmZlY3RUZXN0MjogYGh0dHBzOi8vJHtTZXJ2ZXJUYWxrZXIuaG9zdE5hbWV9L2ltYWdlcy9lZmZlY3RJbWFnZXMvc2xhc2hFZmZlY3RUZXN0Mi5wbmdgLFxyXG4gICAgd2hpcmx3aW5kRWZmZWN0QmFzZTogYGh0dHBzOi8vJHtTZXJ2ZXJUYWxrZXIuaG9zdE5hbWV9L2ltYWdlcy9lZmZlY3RJbWFnZXMvd2hpcmx3aW5kRWZmZWN0QmFzZS5wbmdgLFxyXG4gICAgd2hpcmx3aW5kRWZmZWN0VG9wOiBgaHR0cHM6Ly8ke1NlcnZlclRhbGtlci5ob3N0TmFtZX0vaW1hZ2VzL2VmZmVjdEltYWdlcy93aGlybHdpbmRFZmZlY3RUb3AucG5nYCxcclxufTtcclxuY2xhc3MgQXNzZXRNYW5hZ2VyIHtcclxuICAgIHB1YmxpYyBpbWFnZXM6IFJlY29yZDxJbWFnZU5hbWUsIEhUTUxJbWFnZUVsZW1lbnQ+O1xyXG4gICAgLy8gcHVibGljIHNvdW5kczogUmVjb3JkPHN0cmluZywgSFRNTEltYWdlRWxlbWVudD47XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5pbWFnZXMgPSB7fSBhcyBSZWNvcmQ8SW1hZ2VOYW1lLCBIVE1MSW1hZ2VFbGVtZW50PjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYXN5bmMgbG9hZEFsbE5lY2Vzc2FyeUltYWdlcygpIHtcclxuICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChPYmplY3Qua2V5cyhpbWFnZUluZm9ybWF0aW9uKS5tYXAoKGltYWdlTmFtZSkgPT4gdGhpcy5hZGRJbWFnZShpbWFnZU5hbWUgYXMgSW1hZ2VOYW1lLCBpbWFnZUluZm9ybWF0aW9uW2ltYWdlTmFtZSBhcyBJbWFnZU5hbWVdKSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhc3luYyBhZGRJbWFnZShuYW1lOiBJbWFnZU5hbWUsIHNvdXJjZTogc3RyaW5nKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPHZvaWQ+KChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgbGV0IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgICAgICAgICB4aHIub3BlbihcIkdFVFwiLCBzb3VyY2UsIHRydWUpO1xyXG4gICAgICAgICAgICB4aHIucmVzcG9uc2VUeXBlID0gXCJibG9iXCI7XHJcbiAgICAgICAgICAgIHhoci5vbmxvYWQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoeGhyLnN0YXR1cyA9PT0gMjAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGFzc2V0ID0gbmV3IEltYWdlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYXNzZXQub25sb2FkID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cuVVJMLnJldm9rZU9iamVjdFVSTChhc3NldC5zcmMpO1xyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgYXNzZXQuc3JjID0gd2luZG93LlVSTC5jcmVhdGVPYmplY3RVUkwoeGhyLnJlc3BvbnNlKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmltYWdlc1tuYW1lXSA9IGFzc2V0O1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGBBc3NldCAke25hbWV9IHJlamVjdGVkIHdpdGggZXJyb3IgY29kZSAke3hoci5zdGF0dXN9YCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHhoci5vbmVycm9yID0gKGVycm9yKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB4aHIuc2VuZCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgYXNzZXRNYW5hZ2VyID0gbmV3IEFzc2V0TWFuYWdlcigpO1xyXG4iLCJpbXBvcnQgeyBNb2R1bGVGaWxlbmFtZUhlbHBlcnMgfSBmcm9tIFwid2VicGFja1wiO1xyXG5pbXBvcnQgeyBDb25maWcsIGRlZmF1bHRDb25maWcgfSBmcm9tIFwiLi4vLi4vY29uZmlnXCI7XHJcbmltcG9ydCB7IFZlY3RvciB9IGZyb20gXCIuLi8uLi92ZWN0b3JcIjtcclxuaW1wb3J0IHsgYXNzZXRNYW5hZ2VyIH0gZnJvbSBcIi4vYXNzZXRtYW5hZ2VyXCI7XHJcbmltcG9ydCB7IEdhbWUsIEdsb2JhbENsaWVudEFjdG9ycywgR2xvYmFsQ2xpZW50T2JqZWN0cyB9IGZyb20gXCIuLi9nYW1lXCI7XHJcbmltcG9ydCB7IHNhZmVHZXRFbGVtZW50QnlJZCB9IGZyb20gXCIuLi91dGlsXCI7XHJcbmltcG9ydCB7IENsaWVudFBsYXllciB9IGZyb20gXCIuLi8uLi9vYmplY3RzL25ld0FjdG9ycy9jbGllbnRBY3RvcnMvY2xpZW50UGxheWVyL2NsaWVudFBsYXllclwiO1xyXG5pbXBvcnQgeyBjb252ZXJ0Q29tcGlsZXJPcHRpb25zRnJvbUpzb24gfSBmcm9tIFwidHlwZXNjcmlwdFwiO1xyXG5pbXBvcnQgeyBTaXplIH0gZnJvbSBcIi4uLy4uL3NpemVcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBHYW1lUmVuZGVyZXIge1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBjYW52YXNEaXYgPSBzYWZlR2V0RWxlbWVudEJ5SWQoXCJjYW52YXNEaXZcIik7XHJcbiAgICAvL3ByaXZhdGUgcmVhZG9ubHkgbW9vbiA9IHNhZmVHZXRFbGVtZW50QnlJZChcIm1vb25cIik7XHJcblxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBhY3RvckNhbnZhcyA9IHNhZmVHZXRFbGVtZW50QnlJZChcImFjdG9yQ2FudmFzXCIpIGFzIEhUTUxDYW52YXNFbGVtZW50O1xyXG4gICAgcHVibGljIHJlYWRvbmx5IGFjdG9yQ3R4ID0gdGhpcy5hY3RvckNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIikhO1xyXG5cclxuICAgIHByaXZhdGUgdGFyZ2V0U2NyZWVuQ2VudGVyOiBWZWN0b3I7XHJcbiAgICBwcm90ZWN0ZWQgY3VycmVudFNjcmVlbkNlbnRlcjogVmVjdG9yO1xyXG4gICAgLy9wcm90ZWN0ZWQgc2NyZWVuUG9zOiBWZWN0b3I7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgcHJldmlvdXNXaW5kb3dTaXplOiBTaXplID0geyB3aWR0aDogMCwgaGVpZ2h0OiAwIH07XHJcblxyXG4gICAgcHJpdmF0ZSB0YXJnZXRab29tOiBudW1iZXIgPSAxO1xyXG4gICAgcHVibGljIGN1cnJlbnRab29tOiBudW1iZXIgPSAxO1xyXG4gICAgcHJpdmF0ZSB6b29tRGVsYXk6IG51bWJlciA9IDU7XHJcblxyXG4gICAgcHVibGljIGN1cnJlbnRTY3JlZW5Qb3M6IFZlY3RvciA9IHsgeDogMCwgeTogMCB9O1xyXG4gICAgcHVibGljIGN1cnJlbnRTY3JlZW5TaXplOiBTaXplID0geyB3aWR0aDogMCwgaGVpZ2h0OiAwIH07XHJcbiAgICBwdWJsaWMgY3VycmVudFNjcmVlblJhdGlvOiBudW1iZXIgPSAxO1xyXG5cclxuICAgIHByb3RlY3RlZCBnbG9iYWxDbGllbnRBY3RvcnM6IEdsb2JhbENsaWVudEFjdG9ycztcclxuICAgIHByb3RlY3RlZCBnbG9iYWxDbGllbnRPYmplY3RzOiBHbG9iYWxDbGllbnRPYmplY3RzO1xyXG4gICAgcHJvdGVjdGVkIGlkOiBudW1iZXI7XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJvdGVjdGVkIHJlYWRvbmx5IGNvbmZpZzogQ29uZmlnLCBwcm90ZWN0ZWQgZ2FtZTogR2FtZSwgcHJvdGVjdGVkIGdhbWVQbGF5ZXI6IENsaWVudFBsYXllcikge1xyXG4gICAgICAgIHRoaXMuYXR0ZW1wdFVwZGF0ZUNhbnZhc1NpemVzKCk7XHJcbiAgICAgICAgdGhpcy50YXJnZXRTY3JlZW5DZW50ZXIgPSB0aGlzLmdhbWVQbGF5ZXIucG9zaXRpb247XHJcbiAgICAgICAgdGhpcy5jdXJyZW50U2NyZWVuQ2VudGVyID0geyB4OiB0aGlzLnRhcmdldFNjcmVlbkNlbnRlci54ICsgMCwgeTogdGhpcy50YXJnZXRTY3JlZW5DZW50ZXIueSArIDAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5nbG9iYWxDbGllbnRBY3RvcnMgPSB0aGlzLmdhbWUuZ2V0R2xvYmFsQWN0b3JzKCk7XHJcbiAgICAgICAgdGhpcy5nbG9iYWxDbGllbnRPYmplY3RzID0gdGhpcy5nYW1lLmdldEdsb2JhbE9iamVjdHMoKTtcclxuICAgICAgICB0aGlzLmlkID0gdGhpcy5nYW1lLmdldElkKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHVwZGF0ZUFuZFJlbmRlcihlbGFwc2VkVGltZTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy51cGRhdGVab29tKGVsYXBzZWRUaW1lKTtcclxuICAgICAgICB0aGlzLmF0dGVtcHRVcGRhdGVDYW52YXNTaXplcygpO1xyXG5cclxuICAgICAgICB0aGlzLnVwZGF0ZVNsaWRlclgoKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZVNsaWRlclkoKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRDYW52YXNUcmFuc2Zvcm0odHJ1ZSk7XHJcbiAgICAgICAgdGhpcy5jbGlwWFBhbigpO1xyXG5cclxuICAgICAgICB0aGlzLnJlbmRlckFjdG9ycyhlbGFwc2VkVGltZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB1cGRhdGVab29tKGVsYXBzZWRUaW1lOiBudW1iZXIpIHtcclxuICAgICAgICBpZiAodGhpcy50YXJnZXRab29tICE9PSAxKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnRhcmdldFpvb20gPiAxKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRhcmdldFpvb20gLz0gMSArIGVsYXBzZWRUaW1lO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudGFyZ2V0Wm9vbSA8IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnRhcmdldFpvb20gPSAxO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMudGFyZ2V0Wm9vbSA8IDEpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudGFyZ2V0Wm9vbSAqPSAxICsgZWxhcHNlZFRpbWU7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy50YXJnZXRab29tID4gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudGFyZ2V0Wm9vbSA9IDE7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFpvb20gIT0gdGhpcy50YXJnZXRab29tKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFpvb20gPSAodGhpcy5jdXJyZW50Wm9vbSAqICh0aGlzLnpvb21EZWxheSAtIDEpICsgdGhpcy50YXJnZXRab29tKSAvIHRoaXMuem9vbURlbGF5O1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50Wm9vbSArIDAuMDAwMSA+IHRoaXMudGFyZ2V0Wm9vbSAmJiB0aGlzLmN1cnJlbnRab29tIC0gMC4wMDAxIDwgdGhpcy50YXJnZXRab29tKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRab29tID0gdGhpcy50YXJnZXRab29tICsgMDtcclxuICAgICAgICAgICAgICAgIHRoaXMuem9vbURlbGF5ID0gNTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNldENhbnZhc1RyYW5zZm9ybShlcmFzZTogYm9vbGVhbikge1xyXG4gICAgICAgIHRoaXMuYWN0b3JDdHguc2V0VHJhbnNmb3JtKFxyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRab29tLFxyXG4gICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRab29tLFxyXG4gICAgICAgICAgICAoLXRoaXMuY3VycmVudFNjcmVlbkNlbnRlci54ICsgdGhpcy5wcmV2aW91c1dpbmRvd1NpemUud2lkdGggLyB0aGlzLmN1cnJlbnRab29tIC8gMikgKiB0aGlzLmN1cnJlbnRab29tLFxyXG4gICAgICAgICAgICAoLXRoaXMuY3VycmVudFNjcmVlbkNlbnRlci55ICsgdGhpcy5wcmV2aW91c1dpbmRvd1NpemUuaGVpZ2h0IC8gdGhpcy5jdXJyZW50Wm9vbSAvIDIpICogdGhpcy5jdXJyZW50Wm9vbSxcclxuICAgICAgICApO1xyXG4gICAgICAgIGlmIChlcmFzZSkge1xyXG4gICAgICAgICAgICB0aGlzLmFjdG9yQ3R4LmNsZWFyUmVjdChcclxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFNjcmVlbkNlbnRlci54IC0gdGhpcy5wcmV2aW91c1dpbmRvd1NpemUud2lkdGggLyB0aGlzLmN1cnJlbnRab29tIC8gMixcclxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFNjcmVlbkNlbnRlci55IC0gdGhpcy5wcmV2aW91c1dpbmRvd1NpemUuaGVpZ2h0IC8gdGhpcy5jdXJyZW50Wm9vbSAvIDIsXHJcbiAgICAgICAgICAgICAgICB0aGlzLnByZXZpb3VzV2luZG93U2l6ZS53aWR0aCAvIHRoaXMuY3VycmVudFpvb20sXHJcbiAgICAgICAgICAgICAgICB0aGlzLnByZXZpb3VzV2luZG93U2l6ZS5oZWlnaHQgLyB0aGlzLmN1cnJlbnRab29tLFxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5jdXJyZW50U2NyZWVuU2l6ZSA9IHsgd2lkdGg6IHRoaXMucHJldmlvdXNXaW5kb3dTaXplLndpZHRoIC8gdGhpcy5jdXJyZW50Wm9vbSwgaGVpZ2h0OiB0aGlzLnByZXZpb3VzV2luZG93U2l6ZS5oZWlnaHQgLyB0aGlzLmN1cnJlbnRab29tIH07XHJcbiAgICAgICAgdGhpcy5jdXJyZW50U2NyZWVuUG9zID0ge1xyXG4gICAgICAgICAgICB4OiB0aGlzLmN1cnJlbnRTY3JlZW5DZW50ZXIueCAtIHRoaXMuY3VycmVudFNjcmVlblNpemUud2lkdGggLyAyLFxyXG4gICAgICAgICAgICB5OiB0aGlzLmN1cnJlbnRTY3JlZW5DZW50ZXIueSAtIHRoaXMuY3VycmVudFNjcmVlblNpemUuaGVpZ2h0IC8gMixcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcmVuZGVyQWN0b3JzKGVsYXBzZWRUaW1lOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLmdsb2JhbENsaWVudE9iamVjdHMuZG9vZGFkcy5mb3JFYWNoKChkb29kYWQpID0+IHtcclxuICAgICAgICAgICAgaWYgKGRvb2RhZC5pZlNob3VsZFJlbmRlcih0aGlzLmN1cnJlbnRTY3JlZW5TaXplLCB0aGlzLmN1cnJlbnRTY3JlZW5Qb3MpKSB7XHJcbiAgICAgICAgICAgICAgICBkb29kYWQucmVuZGVyKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmdsb2JhbENsaWVudE9iamVjdHMuZmxvb3IucmVuZGVyKHRoaXMuY3VycmVudFNjcmVlblBvcywgdGhpcy5jdXJyZW50U2NyZWVuU2l6ZSk7XHJcbiAgICAgICAgdGhpcy5nbG9iYWxDbGllbnRBY3RvcnMucGxheWVycy5mb3JFYWNoKChwbGF5ZXIpID0+IHtcclxuICAgICAgICAgICAgaWYgKHBsYXllci5nZXRBY3RvcklkKCkgIT09IHRoaXMuaWQpIHBsYXllci5yZW5kZXIoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmdhbWVQbGF5ZXIucmVuZGVyKCk7XHJcbiAgICAgICAgdGhpcy5nbG9iYWxDbGllbnRBY3RvcnMucGxheWVycy5mb3JFYWNoKChwbGF5ZXIpID0+IHtcclxuICAgICAgICAgICAgaWYgKHBsYXllci5nZXRBY3RvcklkKCkgIT09IHRoaXMuaWQpIHBsYXllci5yZW5kZXJIZWFsdGgoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmdhbWVQbGF5ZXIucmVuZGVySGVhbHRoKCk7XHJcblxyXG4gICAgICAgIHRoaXMuZ2FtZS5wYXJ0aWNsZVN5c3RlbS51cGRhdGVBbmRSZW5kZXIoZWxhcHNlZFRpbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdXBkYXRlU2xpZGVyWCgpIHtcclxuICAgICAgICB0aGlzLmN1cnJlbnRTY3JlZW5DZW50ZXIueCA9ICh0aGlzLmN1cnJlbnRTY3JlZW5DZW50ZXIueCAqIDQgKyB0aGlzLnRhcmdldFNjcmVlbkNlbnRlci54KSAvIDU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjbGlwWFBhbigpIHtcclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50U2NyZWVuUG9zLnggKyB0aGlzLmN1cnJlbnRTY3JlZW5TaXplLndpZHRoID4gdGhpcy5jb25maWcueFNpemUpIHtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50U2NyZWVuQ2VudGVyLnggKz0gdGhpcy5jb25maWcueFNpemUgLSB0aGlzLmN1cnJlbnRTY3JlZW5Qb3MueCAtIHRoaXMuY3VycmVudFNjcmVlblNpemUud2lkdGg7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0Q2FudmFzVHJhbnNmb3JtKGZhbHNlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFNjcmVlblBvcy54IDwgMCkge1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRTY3JlZW5DZW50ZXIueCAtPSB0aGlzLmN1cnJlbnRTY3JlZW5Qb3MueDtcclxuICAgICAgICAgICAgdGhpcy5zZXRDYW52YXNUcmFuc2Zvcm0oZmFsc2UpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHVwZGF0ZVNsaWRlclkoKSB7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50U2NyZWVuQ2VudGVyLnkgPSAodGhpcy5jdXJyZW50U2NyZWVuQ2VudGVyLnkgKiA0ICsgKHRoaXMudGFyZ2V0U2NyZWVuQ2VudGVyLnkgLSB0aGlzLnByZXZpb3VzV2luZG93U2l6ZS5oZWlnaHQgLyAxMCkpIC8gNTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGF0dGVtcHRVcGRhdGVDYW52YXNTaXplcygpIHtcclxuICAgICAgICBpZiAoTWF0aC5taW4od2luZG93LmlubmVyV2lkdGgsIDE5MjApICE9PSB0aGlzLnByZXZpb3VzV2luZG93U2l6ZS53aWR0aCkge1xyXG4gICAgICAgICAgICB0aGlzLnByZXZpb3VzV2luZG93U2l6ZS53aWR0aCA9IE1hdGgubWluKHdpbmRvdy5pbm5lcldpZHRoLCAxOTIwKTtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVDYW52YXNXaWR0aCh0aGlzLmFjdG9yQ2FudmFzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh3aW5kb3cuaW5uZXJIZWlnaHQgIT09IHRoaXMucHJldmlvdXNXaW5kb3dTaXplLmhlaWdodCkge1xyXG4gICAgICAgICAgICBsZXQgcmF0aW86IG51bWJlciA9IHdpbmRvdy5pbm5lcldpZHRoIC8gMTkyMDtcclxuICAgICAgICAgICAgaWYgKHJhdGlvID49IDEpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFNjcmVlblJhdGlvID0gcmF0aW87XHJcbiAgICAgICAgICAgICAgICB0aGlzLnByZXZpb3VzV2luZG93U2l6ZS5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQgLyByYXRpbztcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFNjcmVlblJhdGlvID0gMTtcclxuICAgICAgICAgICAgICAgIHRoaXMucHJldmlvdXNXaW5kb3dTaXplLmhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUNhbnZhc0hlaWdodCh0aGlzLmFjdG9yQ2FudmFzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB1cGRhdGVDYW52YXNXaWR0aChjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50KSB7XHJcbiAgICAgICAgY2FudmFzLnN0eWxlLndpZHRoID0gXCIxMDB2d1wiO1xyXG4gICAgICAgIGNhbnZhcy53aWR0aCA9IHRoaXMucHJldmlvdXNXaW5kb3dTaXplLndpZHRoO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSB1cGRhdGVDYW52YXNIZWlnaHQoY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCkge1xyXG4gICAgICAgIGNhbnZhcy5zdHlsZS5oZWlnaHQgPSBcIjEwMHZoXCI7XHJcbiAgICAgICAgY2FudmFzLmhlaWdodCA9IHRoaXMucHJldmlvdXNXaW5kb3dTaXplLmhlaWdodDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2NyZWVuTnVkZ2UoZm9yY2U6IFZlY3Rvcikge1xyXG4gICAgICAgIHRoaXMuY3VycmVudFNjcmVlbkNlbnRlci54IC09IGZvcmNlLng7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50U2NyZWVuQ2VudGVyLnkgLT0gZm9yY2UueTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2NyZWVuWm9vbShtdWx0aXBsaWVyOiBudW1iZXIsIHNwZWVkOiBudW1iZXIgPSA0KSB7XHJcbiAgICAgICAgdGhpcy50YXJnZXRab29tICo9IG11bHRpcGxpZXI7XHJcbiAgICAgICAgdGhpcy56b29tRGVsYXkgPSBzcGVlZDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0Q2FudmFzUG9zRnJvbVNjcmVlbihwb3NpdGlvbjogVmVjdG9yKTogVmVjdG9yIHtcclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50U2NyZWVuUmF0aW8gPT09IDEpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIHg6IHBvc2l0aW9uLnggLyB0aGlzLmN1cnJlbnRab29tICsgdGhpcy5jdXJyZW50U2NyZWVuUG9zLngsXHJcbiAgICAgICAgICAgICAgICB5OiBwb3NpdGlvbi55IC8gdGhpcy5jdXJyZW50Wm9vbSArIHRoaXMuY3VycmVudFNjcmVlblBvcy55LFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICB4OiBwb3NpdGlvbi54IC8gKHRoaXMuY3VycmVudFpvb20gKiB0aGlzLmN1cnJlbnRTY3JlZW5SYXRpbykgKyB0aGlzLmN1cnJlbnRTY3JlZW5Qb3MueCxcclxuICAgICAgICAgICAgICAgIHk6IHBvc2l0aW9uLnkgLyAodGhpcy5jdXJyZW50Wm9vbSAqIHRoaXMuY3VycmVudFNjcmVlblJhdGlvKSArIHRoaXMuY3VycmVudFNjcmVlblBvcy55LFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJvdW5kUmVjdChjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCwgeDogbnVtYmVyLCB5OiBudW1iZXIsIHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyLCByYWRpdXM6IG51bWJlciwgZmlsbDogYm9vbGVhbiwgc3Ryb2tlOiBib29sZWFuKSB7XHJcbiAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICBjdHgubW92ZVRvKHggKyByYWRpdXMsIHkpO1xyXG5cclxuICAgIGN0eC5saW5lVG8oeCArIHdpZHRoIC0gcmFkaXVzLCB5KTtcclxuICAgIGN0eC5xdWFkcmF0aWNDdXJ2ZVRvKHggKyB3aWR0aCwgeSwgeCArIHdpZHRoLCB5ICsgcmFkaXVzKTtcclxuXHJcbiAgICBjdHgubGluZVRvKHggKyB3aWR0aCwgeSArIGhlaWdodCAtIHJhZGl1cyk7XHJcbiAgICBjdHgucXVhZHJhdGljQ3VydmVUbyh4ICsgd2lkdGgsIHkgKyBoZWlnaHQsIHggKyB3aWR0aCAtIHJhZGl1cywgeSArIGhlaWdodCk7XHJcblxyXG4gICAgY3R4LmxpbmVUbyh4ICsgcmFkaXVzLCB5ICsgaGVpZ2h0KTtcclxuICAgIGN0eC5xdWFkcmF0aWNDdXJ2ZVRvKHgsIHkgKyBoZWlnaHQsIHgsIHkgKyBoZWlnaHQgLSByYWRpdXMpO1xyXG5cclxuICAgIGN0eC5saW5lVG8oeCwgeSArIHJhZGl1cyk7XHJcbiAgICBjdHgucXVhZHJhdGljQ3VydmVUbyh4LCB5LCB4ICsgcmFkaXVzLCB5KTtcclxuXHJcbiAgICBjdHguY2xvc2VQYXRoKCk7XHJcbiAgICBpZiAoZmlsbCkge1xyXG4gICAgICAgIGN0eC5maWxsKCk7XHJcbiAgICB9XHJcbiAgICBpZiAoc3Ryb2tlKSB7XHJcbiAgICAgICAgY3R4LnN0cm9rZSgpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IGdldFJhbmRvbUNvbG9yIH0gZnJvbSBcIi4uL2dldHJhbmRvbWNvbG9yXCI7XHJcbmltcG9ydCB7IERhZ2dlcnNTcGVjLCBIYW1tZXJTcGVjLCBTd29yZFNwZWMgfSBmcm9tIFwiLi4vb2JqZWN0cy9uZXdBY3RvcnMvYWN0b3JcIjtcclxuaW1wb3J0IHsgQ2xhc3NUeXBlIH0gZnJvbSBcIi4uL29iamVjdHMvbmV3QWN0b3JzL3NlcnZlckFjdG9ycy9zZXJ2ZXJQbGF5ZXIvc2VydmVyUGxheWVyXCI7XHJcbmltcG9ydCB7IEdhbWUgfSBmcm9tIFwiLi9nYW1lXCI7XHJcbmltcG9ydCB7IGFzc2V0TWFuYWdlciB9IGZyb20gXCIuL2dhbWVSZW5kZXIvYXNzZXRtYW5hZ2VyXCI7XHJcbmltcG9ydCB7IGluaXRDb21tZW50cyB9IGZyb20gXCIuL21haW5NZW51L2NvbW1lbnRzXCI7XHJcbmltcG9ydCB7IGluaXRTZXR0aW5nc0J1dHRvbiB9IGZyb20gXCIuL21haW5NZW51L3NldHRpbmdzXCI7XHJcbmltcG9ydCB7IFNlcnZlclRhbGtlciB9IGZyb20gXCIuL3NlcnZlcnRhbGtlclwiO1xyXG5pbXBvcnQgeyBmaWxsUGF0Y2hOb3Rlc0Rpdiwgc2FmZUdldEVsZW1lbnRCeUlkIH0gZnJvbSBcIi4vdXRpbFwiO1xyXG4vKmNvbnN0IHBhcnRpY2xlU2xpZGVyID0gc2FmZUdldEVsZW1lbnRCeUlkKFwicGFydGljbGVzXCIpO1xyXG5jb25zdCBwYXJ0aWNsZUFtb3VudCA9IHNhZmVHZXRFbGVtZW50QnlJZChcInBhcnRpY2xlQW1vdW50XCIpO1xyXG5cclxucGFydGljbGVTbGlkZXIub25pbnB1dCA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHBhcnRpY2xlQW1vdW50LmlubmVySFRNTCA9IChwYXJ0aWNsZVNsaWRlciBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZSArIFwiJVwiO1xyXG59OyovXHJcblxyXG52YXIgY2xhc3NJbmZvID0ge1xyXG4gICAgc3dvcmQ6IHsgbGV2ZWw6IDEsIHNwZWM6IDAgfSxcclxuICAgIGRhZ2dlcnM6IHsgbGV2ZWw6IDEsIHNwZWM6IDAgfSxcclxuICAgIGhhbW1lcjogeyBsZXZlbDogMSwgc3BlYzogMCB9LFxyXG59O1xyXG5cclxudmFyIGNsYXNzVHlwZTogQ2xhc3NUeXBlID0gXCJzd29yZFwiO1xyXG52YXIgdGVhbTogbnVtYmVyID0gMTtcclxuc2FmZUdldEVsZW1lbnRCeUlkKFwidGVhbU1lbnVcIikub25jbGljayA9ICgpID0+IHRvZ2dsZVRlYW0oKTtcclxuXHJcbnZhciB2YWx1ZTogc3RyaW5nIHwgbnVsbCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwibmFtZVwiKTtcclxuaWYgKHZhbHVlKSAoc2FmZUdldEVsZW1lbnRCeUlkKFwibmFtZVwiKSBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZSA9IHZhbHVlO1xyXG52YXIgdmFsdWU6IHN0cmluZyB8IG51bGwgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImNvbG9yXCIpO1xyXG5pZiAodmFsdWUpIChzYWZlR2V0RWxlbWVudEJ5SWQoXCJjb2xvclwiKSBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZSA9IHZhbHVlO1xyXG52YXIgdmFsdWU6IHN0cmluZyB8IG51bGwgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInRlYW1cIik7XHJcbmlmICh2YWx1ZSAmJiBwYXJzZUludCh2YWx1ZSkgPT09IDIpIHRvZ2dsZVRlYW0oKTtcclxudmFyIHZhbHVlOiBzdHJpbmcgfCBudWxsID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJjbGFzc1R5cGVcIik7XHJcbmlmICh2YWx1ZSkge1xyXG4gICAgaWYgKHZhbHVlID09PSBcImRhZ2dlcnNcIikgY2hhbmdlQ2xhc3MoXCJkYWdnZXJzXCIpO1xyXG4gICAgZWxzZSBpZiAodmFsdWUgPT09IFwiaGFtbWVyXCIpIGNoYW5nZUNsYXNzKFwiaGFtbWVyXCIpO1xyXG4gICAgZWxzZSBjaGFuZ2VDbGFzcyhcInN3b3JkXCIpO1xyXG59XHJcbnVwZGF0ZUNsYXNzTGV2ZWxzKCk7XHJcblxyXG5mdW5jdGlvbiB1cGRhdGVDbGFzc0xldmVscygpIHtcclxuICAgIHZhbHVlID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJzd29yZExldmVsXCIpO1xyXG4gICAgaWYgKHZhbHVlKSBjbGFzc0luZm8uc3dvcmQubGV2ZWwgPSBwYXJzZUludCh2YWx1ZSk7XHJcbiAgICB2YWx1ZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwic3dvcmRTcGVjXCIpO1xyXG4gICAgaWYgKHZhbHVlKSBjbGFzc0luZm8uc3dvcmQuc3BlYyA9IHBhcnNlSW50KHZhbHVlKTtcclxuICAgIHZhbHVlID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJkYWdnZXJzTGV2ZWxcIik7XHJcbiAgICBpZiAodmFsdWUpIGNsYXNzSW5mby5kYWdnZXJzLmxldmVsID0gcGFyc2VJbnQodmFsdWUpO1xyXG4gICAgdmFsdWUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImRhZ2dlcnNTcGVjXCIpO1xyXG4gICAgaWYgKHZhbHVlKSBjbGFzc0luZm8uZGFnZ2Vycy5zcGVjID0gcGFyc2VJbnQodmFsdWUpO1xyXG4gICAgdmFsdWUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImhhbW1lckxldmVsXCIpO1xyXG4gICAgaWYgKHZhbHVlKSBjbGFzc0luZm8uaGFtbWVyLmxldmVsID0gcGFyc2VJbnQodmFsdWUpO1xyXG4gICAgdmFsdWUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImhhbW1lclNwZWNcIik7XHJcbiAgICBpZiAodmFsdWUpIGNsYXNzSW5mby5oYW1tZXIuc3BlYyA9IHBhcnNlSW50KHZhbHVlKTtcclxuXHJcbiAgICBzYWZlR2V0RWxlbWVudEJ5SWQoXCJzd29yZENsYXNzTGV2ZWxcIikuaW5uZXJIVE1MID0gU3RyaW5nKGNsYXNzSW5mby5zd29yZC5sZXZlbCk7XHJcbiAgICBzYWZlR2V0RWxlbWVudEJ5SWQoXCJkYWdnZXJzQ2xhc3NMZXZlbFwiKS5pbm5lckhUTUwgPSBTdHJpbmcoY2xhc3NJbmZvLmRhZ2dlcnMubGV2ZWwpO1xyXG4gICAgc2FmZUdldEVsZW1lbnRCeUlkKFwiaGFtbWVyQ2xhc3NMZXZlbFwiKS5pbm5lckhUTUwgPSBTdHJpbmcoY2xhc3NJbmZvLmhhbW1lci5sZXZlbCk7XHJcbn1cclxuXHJcbnZhciBpZkltYWdlc0hhdmVCZWVuTG9hZGVkOiBib29sZWFuID0gZmFsc2U7XHJcbnNhZmVHZXRFbGVtZW50QnlJZChcInN0YXJ0R2FtZVwiKS5vbm1vdXNldXAgPSBhc3luYyAoKSA9PiB7XHJcbiAgICBoaWRlTWVudUVsZW1lbnRzKCk7XHJcbiAgICBzYXZlTG9jYWxEYXRhKCk7XHJcblxyXG4gICAgdmFyIG5hbWU6IHN0cmluZyA9IChzYWZlR2V0RWxlbWVudEJ5SWQoXCJuYW1lXCIpIGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlO1xyXG4gICAgaWYgKG5hbWUgPT09IFwiXCIgfHwgbmFtZS5zcGxpdChcIiBcIikuam9pbihcIlwiKSA9PT0gXCJcIikgbmFtZSA9IFwiUGxheWVyXCI7XHJcblxyXG4gICAgbGV0IGxldmVsOiBudW1iZXIsIHNwZWM6IG51bWJlcjtcclxuICAgIHN3aXRjaCAoY2xhc3NUeXBlKSB7XHJcbiAgICAgICAgY2FzZSBcImRhZ2dlcnNcIjpcclxuICAgICAgICAgICAgbGV2ZWwgPSBjbGFzc0luZm8uZGFnZ2Vycy5sZXZlbDtcclxuICAgICAgICAgICAgc3BlYyA9IGNsYXNzSW5mby5kYWdnZXJzLnNwZWM7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgXCJoYW1tZXJcIjpcclxuICAgICAgICAgICAgbGV2ZWwgPSBjbGFzc0luZm8uaGFtbWVyLmxldmVsO1xyXG4gICAgICAgICAgICBzcGVjID0gY2xhc3NJbmZvLmhhbW1lci5zcGVjO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICBsZXZlbCA9IGNsYXNzSW5mby5zd29yZC5sZXZlbDtcclxuICAgICAgICAgICAgc3BlYyA9IGNsYXNzSW5mby5zd29yZC5zcGVjO1xyXG4gICAgfVxyXG5cclxuICAgIC8vYXdhaXQgYXNzZXRNYW5hZ2VyLmxvYWRBbGxOZWNlc3NhcnlJbWFnZXMoKTtcclxuICAgIGNvbnN0IHNlcnZlclRhbGtlciA9IG5ldyBTZXJ2ZXJUYWxrZXIoe1xyXG4gICAgICAgIG5hbWUsXHJcbiAgICAgICAgY29sb3I6IChzYWZlR2V0RWxlbWVudEJ5SWQoXCJjb2xvclwiKSBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZSxcclxuICAgICAgICB0ZWFtLFxyXG4gICAgICAgIGNsYXNzOiBjbGFzc1R5cGUsXHJcbiAgICAgICAgY2xhc3NMZXZlbDogbGV2ZWwsXHJcbiAgICAgICAgY2xhc3NTcGVjOiBzcGVjLFxyXG4gICAgfSk7XHJcbiAgICBjb25zdCB7IGlkLCBpbmZvLCBjb25maWcgfSA9IGF3YWl0IHNlcnZlclRhbGtlci5zZXJ2ZXJUYWxrZXJSZWFkeTtcclxuICAgIGNvbnN0IGdhbWUgPSBuZXcgR2FtZShpbmZvLCBjb25maWcsIGlkLCBzZXJ2ZXJUYWxrZXIsIDUwKTtcclxuICAgIGdhbWUuc3RhcnQoKTtcclxuICAgIC8vZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnJlcXVlc3RGdWxsc2NyZWVuKCk7XHJcbiAgICBnYW1lRGl2LnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XHJcbiAgICBzYWZlR2V0RWxlbWVudEJ5SWQoXCJlbmRcIikub25jbGljayA9IGFzeW5jICgpID0+IHtcclxuICAgICAgICBnYW1lLmVuZCgpO1xyXG4gICAgICAgIGdhbWVEaXYuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgICAgIHVwZGF0ZUNsYXNzTGV2ZWxzKCk7XHJcbiAgICAgICAgLy9kb2N1bWVudC5leGl0RnVsbHNjcmVlbigpO1xyXG4gICAgICAgIHNob3dNZW51RWxlbWVudHMoKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9O1xyXG59O1xyXG5cclxudmFyIG1lbnVEaXY6IEhUTUxFbGVtZW50ID0gc2FmZUdldEVsZW1lbnRCeUlkKFwibWVudURpdlwiKTtcclxudmFyIG9wdGlvbnNEaXY6IEhUTUxFbGVtZW50ID0gc2FmZUdldEVsZW1lbnRCeUlkKFwib3B0aW9uc0RpdlwiKTtcclxudmFyIGdhbWVEaXY6IEhUTUxFbGVtZW50ID0gc2FmZUdldEVsZW1lbnRCeUlkKFwiZ2FtZURpdlwiKTtcclxuZ2FtZURpdi5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcblxyXG5mdW5jdGlvbiBoaWRlTWVudUVsZW1lbnRzKCkge1xyXG4gICAgbWVudURpdi5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICBvcHRpb25zRGl2LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgIC8vZ2FtZURpdi5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiOyBpbmNsdWRlZCBpbiBzdGFydGdhbWUgYnV0dG9uXHJcbn1cclxuZnVuY3Rpb24gc2hvd01lbnVFbGVtZW50cygpIHtcclxuICAgIC8vZ2FtZURpdi5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7IGluY2x1ZGVkIGluIHN0YXJ0Z2FtZSBidXR0b25cclxuICAgIG1lbnVEaXYuc3R5bGUuZGlzcGxheSA9IFwiZmxleFwiO1xyXG4gICAgb3B0aW9uc0Rpdi5zdHlsZS5kaXNwbGF5ID0gXCJmbGV4XCI7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHRvZ2dsZVRlYW0oKSB7XHJcbiAgICBpZiAodGVhbSA9PT0gMSkge1xyXG4gICAgICAgIHNhZmVHZXRFbGVtZW50QnlJZChcInRlYW0xXCIpLmNsYXNzTGlzdC5yZW1vdmUoXCJzZWxlY3RlZFRlYW1cIik7XHJcbiAgICAgICAgc2FmZUdldEVsZW1lbnRCeUlkKFwidGVhbTJcIikuY2xhc3NMaXN0LmFkZChcInNlbGVjdGVkVGVhbVwiKTtcclxuICAgICAgICB0ZWFtID0gMjtcclxuICAgIH0gZWxzZSBpZiAodGVhbSA9PT0gMikge1xyXG4gICAgICAgIHNhZmVHZXRFbGVtZW50QnlJZChcInRlYW0xXCIpLmNsYXNzTGlzdC5hZGQoXCJzZWxlY3RlZFRlYW1cIik7XHJcbiAgICAgICAgc2FmZUdldEVsZW1lbnRCeUlkKFwidGVhbTJcIikuY2xhc3NMaXN0LnJlbW92ZShcInNlbGVjdGVkVGVhbVwiKTtcclxuICAgICAgICB0ZWFtID0gMTtcclxuICAgIH1cclxufVxyXG5cclxuc2FmZUdldEVsZW1lbnRCeUlkKFwic3dvcmRcIikub25jbGljayA9ICgpID0+IGNoYW5nZUNsYXNzKFwic3dvcmRcIik7XHJcbnNhZmVHZXRFbGVtZW50QnlJZChcImRhZ2dlcnNcIikub25jbGljayA9ICgpID0+IGNoYW5nZUNsYXNzKFwiZGFnZ2Vyc1wiKTtcclxuc2FmZUdldEVsZW1lbnRCeUlkKFwiaGFtbWVyXCIpLm9uY2xpY2sgPSAoKSA9PiBjaGFuZ2VDbGFzcyhcImhhbW1lclwiKTtcclxuZnVuY3Rpb24gY2hhbmdlQ2xhc3MoY2xhc3NBcmc6IENsYXNzVHlwZSkge1xyXG4gICAgc2FmZUdldEVsZW1lbnRCeUlkKFwic3dvcmRcIikuY2xhc3NMaXN0LnJlbW92ZShcInNlbGVjdGVkXCIpO1xyXG4gICAgc2FmZUdldEVsZW1lbnRCeUlkKFwiZGFnZ2Vyc1wiKS5jbGFzc0xpc3QucmVtb3ZlKFwic2VsZWN0ZWRcIik7XHJcbiAgICBzYWZlR2V0RWxlbWVudEJ5SWQoXCJoYW1tZXJcIikuY2xhc3NMaXN0LnJlbW92ZShcInNlbGVjdGVkXCIpO1xyXG5cclxuICAgIHNhZmVHZXRFbGVtZW50QnlJZChjbGFzc0FyZykuY2xhc3NMaXN0LmFkZChcInNlbGVjdGVkXCIpO1xyXG5cclxuICAgIGNsYXNzVHlwZSA9IGNsYXNzQXJnO1xyXG59XHJcblxyXG5mdW5jdGlvbiBzYXZlTG9jYWxEYXRhKCkge1xyXG4gICAgbGV0IGxvY2FsbHlTdG9yZWROYW1lOiBzdHJpbmcgPSAoc2FmZUdldEVsZW1lbnRCeUlkKFwibmFtZVwiKSBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZTtcclxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwibmFtZVwiLCBsb2NhbGx5U3RvcmVkTmFtZSk7XHJcblxyXG4gICAgbGV0IGxvY2FsbHlTdG9yZWRUZWFtOiBudW1iZXIgPSB0ZWFtO1xyXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJ0ZWFtXCIsIFN0cmluZyhsb2NhbGx5U3RvcmVkVGVhbSkpO1xyXG5cclxuICAgIGxldCBsb2NhbGx5U3RvcmVkQ29sb3I6IHN0cmluZyA9IChzYWZlR2V0RWxlbWVudEJ5SWQoXCJjb2xvclwiKSBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZTtcclxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiY29sb3JcIiwgbG9jYWxseVN0b3JlZENvbG9yKTtcclxuXHJcbiAgICAvKmxldCBsb2NhbGx5U3RvcmVkUGFydGljbGVzOiBzdHJpbmcgPSAoc2FmZUdldEVsZW1lbnRCeUlkKFwiaWRcIikgYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwicGFydGljbGVzXCIsIGZpZWxkLnZhbHVlKTsqL1xyXG5cclxuICAgIGxldCBsb2NhbGx5U3RvcmVkQ2xhc3M6IHN0cmluZztcclxuICAgIGlmIChjbGFzc1R5cGUgPT09IFwic3dvcmRcIikgbG9jYWxseVN0b3JlZENsYXNzID0gXCJzd29yZFwiO1xyXG4gICAgZWxzZSBpZiAoY2xhc3NUeXBlID09PSBcImRhZ2dlcnNcIikgbG9jYWxseVN0b3JlZENsYXNzID0gXCJkYWdnZXJzXCI7XHJcbiAgICBlbHNlIGlmIChjbGFzc1R5cGUgPT09IFwiaGFtbWVyXCIpIGxvY2FsbHlTdG9yZWRDbGFzcyA9IFwiaGFtbWVyXCI7XHJcbiAgICBlbHNlIHRocm93IG5ldyBFcnJvcihcInVua25vd24gY2xhc3MgdHlwZSBpbnB1dCAke2NsYXNzVHlwZX1cIik7XHJcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImNsYXNzVHlwZVwiLCBsb2NhbGx5U3RvcmVkQ2xhc3MpO1xyXG59XHJcblxyXG4vKmNsZWFyU3RvcmFnZUJ1dHRvbi5vbmNsaWNrID0gKCkgPT4ge1xyXG4gICAgbG9jYWxTdG9yYWdlLmNsZWFyKCk7XHJcbn07Ki9cclxuXHJcbnZhciBzY3JlZW5Db3ZlcjogSFRNTEVsZW1lbnQgPSBzYWZlR2V0RWxlbWVudEJ5SWQoXCJzY3JlZW5Db3ZlclwiKTtcclxuXHJcbmluaXRTZXR0aW5nc0J1dHRvbihzY3JlZW5Db3Zlcik7XHJcbmluaXRDb21tZW50cyhzY3JlZW5Db3Zlcik7XHJcblxyXG52YXIgaW5mb3JtYXRpb25EaXY6IEhUTUxFbGVtZW50ID0gc2FmZUdldEVsZW1lbnRCeUlkKFwiaW5mb3JtYXRpb25EaXZcIik7XHJcbnZhciBpbmZvT3B0aW9uOiBIVE1MRWxlbWVudCA9IHNhZmVHZXRFbGVtZW50QnlJZChcImluZm9PcHRpb25cIik7XHJcbnNhZmVHZXRFbGVtZW50QnlJZChcImluZm9ybWF0aW9uQnV0dG9uXCIpLm9uY2xpY2sgPSAoKSA9PiB7XHJcbiAgICBpbmZvT3B0aW9uLmNsYXNzTGlzdC5hZGQoXCJzZWxlY3RlZFwiKTtcclxuICAgIGluZm9ybWF0aW9uRGl2LnN0eWxlLmRpc3BsYXkgPSBcImZsZXhcIjtcclxuICAgIHNjcmVlbkNvdmVyLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XHJcblxyXG4gICAgc2NyZWVuQ292ZXIuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGNsb3NlSW5mb0Rpdik7XHJcblxyXG4gICAgZnVuY3Rpb24gY2xvc2VJbmZvRGl2KCkge1xyXG4gICAgICAgIHNjcmVlbkNvdmVyLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBjbG9zZUluZm9EaXYpO1xyXG5cclxuICAgICAgICBpbmZvcm1hdGlvbkRpdi5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICAgICAgc2NyZWVuQ292ZXIuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgICAgIGluZm9PcHRpb24uY2xhc3NMaXN0LnJlbW92ZShcInNlbGVjdGVkXCIpO1xyXG4gICAgfVxyXG59O1xyXG5cclxudmFyIHBhdGNoTm90ZXNEaXY6IEhUTUxFbGVtZW50ID0gc2FmZUdldEVsZW1lbnRCeUlkKFwicGF0Y2hOb3Rlc0RpdlwiKTtcclxudmFyIHBhdGNoTm90ZXNPcHRpb246IEhUTUxFbGVtZW50ID0gc2FmZUdldEVsZW1lbnRCeUlkKFwicGF0Y2hOb3Rlc09wdGlvblwiKTtcclxuZmlsbFBhdGNoTm90ZXNEaXYocGF0Y2hOb3Rlc0Rpdik7XHJcbnNhZmVHZXRFbGVtZW50QnlJZChcInBhdGNoTm90ZXNCdXR0b25cIikub25jbGljayA9ICgpID0+IHtcclxuICAgIHBhdGNoTm90ZXNPcHRpb24uY2xhc3NMaXN0LmFkZChcInNlbGVjdGVkXCIpO1xyXG4gICAgcGF0Y2hOb3Rlc0Rpdi5zdHlsZS5kaXNwbGF5ID0gXCJmbGV4XCI7XHJcbiAgICBzY3JlZW5Db3Zlci5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xyXG5cclxuICAgIHNjcmVlbkNvdmVyLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBjbG9zZVBhdGNoTm90ZXNEaXYpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGNsb3NlUGF0Y2hOb3Rlc0RpdigpIHtcclxuICAgICAgICBzY3JlZW5Db3Zlci5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgY2xvc2VQYXRjaE5vdGVzRGl2KTtcclxuXHJcbiAgICAgICAgcGF0Y2hOb3Rlc0Rpdi5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICAgICAgc2NyZWVuQ292ZXIuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgICAgIHBhdGNoTm90ZXNPcHRpb24uY2xhc3NMaXN0LnJlbW92ZShcInNlbGVjdGVkXCIpO1xyXG4gICAgfVxyXG59O1xyXG52YXIgdGlwc0J1dHRvblRvZ2dsZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuc2FmZUdldEVsZW1lbnRCeUlkKFwidG9nZ2xlVGlwc0J1dHRvblwiKS5vbmNsaWNrID0gKCkgPT4ge307XHJcbiIsImltcG9ydCB7IHNhZmVHZXRFbGVtZW50QnlJZCB9IGZyb20gXCIuLi91dGlsXCI7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaW5pdENvbW1lbnRzKHNjcmVlbkNvdmVyOiBIVE1MRWxlbWVudCkge1xyXG4gICAgdmFyIGNvbW1lbnREaXY6IEhUTUxFbGVtZW50ID0gc2FmZUdldEVsZW1lbnRCeUlkKFwiY29tbWVudERpdlwiKTtcclxuICAgIHZhciBlbWFpbE9wdGlvbjogSFRNTEVsZW1lbnQgPSBzYWZlR2V0RWxlbWVudEJ5SWQoXCJlbWFpbE9wdGlvblwiKTtcclxuXHJcbiAgICBzYWZlR2V0RWxlbWVudEJ5SWQoXCJjb21tZW50QnV0dG9uXCIpLm9uY2xpY2sgPSAoKSA9PiB7XHJcbiAgICAgICAgZW1haWxPcHRpb24uY2xhc3NMaXN0LmFkZChcInNlbGVjdGVkXCIpO1xyXG4gICAgICAgIGNvbW1lbnREaXYuc3R5bGUuZGlzcGxheSA9IFwiZmxleFwiO1xyXG4gICAgICAgIHNjcmVlbkNvdmVyLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XHJcblxyXG4gICAgICAgIHNjcmVlbkNvdmVyLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBjbG9zZUNvbW1lbnREaXYpO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBjbG9zZUNvbW1lbnREaXYoKSB7XHJcbiAgICAgICAgICAgIHNjcmVlbkNvdmVyLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBjbG9zZUNvbW1lbnREaXYpO1xyXG5cclxuICAgICAgICAgICAgY29tbWVudERpdi5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICAgICAgICAgIHNjcmVlbkNvdmVyLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgICAgICAgICAgZW1haWxPcHRpb24uY2xhc3NMaXN0LnJlbW92ZShcInNlbGVjdGVkXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn1cclxuIiwiaW1wb3J0IHsgc2FmZUdldEVsZW1lbnRCeUlkIH0gZnJvbSBcIi4uL3V0aWxcIjtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpbml0U2V0dGluZ3NCdXR0b24oc2NyZWVuQ292ZXI6IEhUTUxFbGVtZW50KSB7XHJcbiAgICB2YXIgc2V0dGluZ3NEaXY6IEhUTUxFbGVtZW50ID0gc2FmZUdldEVsZW1lbnRCeUlkKFwic2V0dGluZ3NEaXZcIik7XHJcbiAgICB2YXIgc2V0dGluZ3NPcHRpb246IEhUTUxFbGVtZW50ID0gc2FmZUdldEVsZW1lbnRCeUlkKFwic2V0dGluZ3NPcHRpb25cIik7XHJcbiAgICBzYWZlR2V0RWxlbWVudEJ5SWQoXCJzZXR0aW5nc0J1dHRvblwiKS5vbmNsaWNrID0gKCkgPT4ge1xyXG4gICAgICAgIHNldHRpbmdzT3B0aW9uLmNsYXNzTGlzdC5hZGQoXCJzZWxlY3RlZFwiKTtcclxuICAgICAgICBzZXR0aW5nc0Rpdi5zdHlsZS5kaXNwbGF5ID0gXCJmbGV4XCI7XHJcbiAgICAgICAgc2NyZWVuQ292ZXIuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcclxuXHJcbiAgICAgICAgc2NyZWVuQ292ZXIuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGNsb3NlT3B0aW9uc0Rpdik7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGNsb3NlT3B0aW9uc0RpdigpIHtcclxuICAgICAgICAgICAgc2NyZWVuQ292ZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGNsb3NlT3B0aW9uc0Rpdik7XHJcblxyXG4gICAgICAgICAgICBzZXR0aW5nc0Rpdi5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICAgICAgICAgIHNjcmVlbkNvdmVyLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgICAgICAgICAgc2V0dGluZ3NPcHRpb24uY2xhc3NMaXN0LnJlbW92ZShcInNlbGVjdGVkXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRTZXR0aW5nc0NvbmZpZygpOiBTZXR0aW5nc0NvbmZpZyB7XHJcbiAgICBsZXQgcGFydGljbGVQZXJjZW50OiBudW1iZXIgPSBNYXRoLm1pbigxMDAsIE1hdGgubWF4KDAsIChzYWZlR2V0RWxlbWVudEJ5SWQoXCJwYXJ0aWNsZVNsaWRlclwiKSBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZUFzTnVtYmVyKSk7XHJcbiAgICBsZXQgZm9sbG93UGVyY2VudDogbnVtYmVyID0gTWF0aC5taW4oMTAwLCBNYXRoLm1heCgwLCAoc2FmZUdldEVsZW1lbnRCeUlkKFwic2NyZWVuRGVsYXlcIikgYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWVBc051bWJlcikpO1xyXG4gICAgbGV0IHJlbmRlckVmZmVjdHM6IGJvb2xlYW4gPSAoc2FmZUdldEVsZW1lbnRCeUlkKFwiZWZmZWN0c1RvZ2dsZVwiKSBhcyBIVE1MSW5wdXRFbGVtZW50KS5jaGVja2VkO1xyXG4gICAgbGV0IGNhbWVyYVNoYWtlOiBib29sZWFuID0gKHNhZmVHZXRFbGVtZW50QnlJZChcImNhbWVyYUVmZmVjdHNUb2dnbGVcIikgYXMgSFRNTElucHV0RWxlbWVudCkuY2hlY2tlZDtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHJlbmRlckVmZmVjdHMsXHJcbiAgICAgICAgY2FtZXJhU2hha2UsXHJcbiAgICAgICAgcGFydGljbGVQZXJjZW50LFxyXG4gICAgICAgIGZvbGxvd1BlcmNlbnQsXHJcbiAgICB9O1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFNldHRpbmdzQ29uZmlnIHtcclxuICAgIHJlbmRlckVmZmVjdHM6IGJvb2xlYW47XHJcbiAgICBjYW1lcmFTaGFrZTogYm9vbGVhbjtcclxuICAgIHBhcnRpY2xlUGVyY2VudDogbnVtYmVyO1xyXG4gICAgZm9sbG93UGVyY2VudDogbnVtYmVyO1xyXG59XHJcbiIsImltcG9ydCB7IFNlcnZlck1lc3NhZ2UgfSBmcm9tIFwiLi4vYXBpL21lc3NhZ2VcIjtcclxuaW1wb3J0IHsgQWN0b3JUeXBlIH0gZnJvbSBcIi4uL29iamVjdHMvbmV3QWN0b3JzL2FjdG9yXCI7XHJcbmltcG9ydCB7IENsaWVudEFjdG9yIH0gZnJvbSBcIi4uL29iamVjdHMvbmV3QWN0b3JzL2NsaWVudEFjdG9ycy9jbGllbnRBY3RvclwiO1xyXG5pbXBvcnQgeyBHYW1lIH0gZnJvbSBcIi4vZ2FtZVwiO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGhhbmRsZU1lc3NhZ2UodGhpczogR2FtZSwgbXNnOiBTZXJ2ZXJNZXNzYWdlKSB7XHJcbiAgICBsZXQgcGxheWVyO1xyXG5cclxuICAgIHN3aXRjaCAobXNnLnR5cGUpIHtcclxuICAgICAgICBjYXNlIFwic2VydmVyRGVidWdNZXNzYWdlXCI6XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgXCJzZXJ2ZXJQbGF5ZXJBY3Rpb25cIjpcclxuICAgICAgICAgICAgaWYgKG1zZy5wbGF5ZXJJZCA9PT0gdGhpcy5pZCkgcmV0dXJuO1xyXG4gICAgICAgICAgICBwbGF5ZXIgPSB0aGlzLmdsb2JhbENsaWVudEFjdG9ycy5wbGF5ZXJzLmZpbmQoKHBsYXllcikgPT4gcGxheWVyLmdldEFjdG9ySWQoKSA9PT0gbXNnLnBsYXllcklkKTtcclxuICAgICAgICAgICAgaWYgKHBsYXllcikge1xyXG4gICAgICAgICAgICAgICAgcGxheWVyLnVwZGF0ZVBvc2l0aW9uQW5kTW9tZW50dW1Gcm9tU2VydmVyKG1zZy5wb3NpdGlvbiwgbXNnLm1vbWVudHVtKTtcclxuICAgICAgICAgICAgICAgIHBsYXllci5tb3ZlQWN0aW9uc05leHRGcmFtZVttc2cuYWN0aW9uVHlwZV0gPSBtc2cuc3RhcnRpbmc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBcImluZm9cIjpcclxuICAgICAgICAgICAgdGhpcy5jb25zdHJ1Y3RHYW1lKG1zZy5pbmZvKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBcInBsYXllckxlYXZlXCI6XHJcbiAgICAgICAgICAgIHRoaXMucGxheWVyTGVhdmUobXNnLmlkKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBcInBsYXllckpvaW5cIjpcclxuICAgICAgICAgICAgdGhpcy5uZXdDbGllbnRQbGF5ZXIobXNnLnBsYXllckluZm8pO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIFwicGxheWVyQWxsb3dDaG9vc2VTcGVjXCI6XHJcbiAgICAgICAgLy9vcGVuIHdpbmRvd1xyXG5cclxuICAgICAgICBjYXNlIFwicGxheWVyQ2hhbmdlU3BlY1wiOlxyXG4gICAgICAgICAgICAvL3BsYXllciBzZXQgbGV2ZWxcclxuICAgICAgICAgICAgLy9cclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBcInBsYXllckxldmVsU2V0XCI6XHJcbiAgICAgICAgICAgIC8vcGxheWVycyBzZXQgbGV2ZWxcclxuICAgICAgICAgICAgLy9wYXJ0aWNsZXNcclxuICAgICAgICAgICAgLy90aGlzLmNvbnRyb2xsZXIuc2V0UmVxdWlyZWRYUFxyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIFwicGxheWVyU2V0WFBcIjpcclxuICAgICAgICAgICAgLy90aGlzLmNvbnRyb2xsZXIuc2V0WFBcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBcInNlcnZlckhlYWxNZXNzYWdlXCI6XHJcbiAgICAgICAgICAgIGxldCBoZWFsZWRBY3RvcjogQ2xpZW50QWN0b3IgPSB0aGlzLmZpbmRBY3Rvcihtc2cuYWN0b3JJZCwgbXNnLmFjdG9yVHlwZSk7XHJcbiAgICAgICAgICAgIHRoaXMucGFydGljbGVTeXN0ZW0uYWRkU3BhcmtzKGhlYWxlZEFjdG9yLnBvc2l0aW9uKTtcclxuICAgICAgICAgICAgaGVhbGVkQWN0b3IucmVnaXN0ZXJIZWFsKG1zZy5uZXdIZWFsdGgpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIFwic2VydmVyRGFtYWdlTWVzc2FnZVwiOlxyXG4gICAgICAgICAgICBsZXQgZGFtYWdlZEFjdG9yOiBDbGllbnRBY3RvciA9IHRoaXMuZmluZEFjdG9yKG1zZy5hY3RvcklkLCBtc2cuYWN0b3JUeXBlKTtcclxuICAgICAgICAgICAgbGV0IGRhbWFnZU9yaWdpbkFjdG9yOiBDbGllbnRBY3RvciA9IHRoaXMuZmluZEFjdG9yKG1zZy5vcmlnaW5JZCwgbXNnLm9yaWdpblR5cGUpO1xyXG4gICAgICAgICAgICBkYW1hZ2VkQWN0b3IucmVnaXN0ZXJEYW1hZ2UoZGFtYWdlT3JpZ2luQWN0b3IsIG1zZy5uZXdIZWFsdGgsIG1zZy5rbm9ja2JhY2ssIG1zZy50cmFuc2xhdGlvbkRhdGEpO1xyXG4gICAgICAgICAgICBkYW1hZ2VkQWN0b3IudXBkYXRlUG9zaXRpb25BbmRNb21lbnR1bUZyb21TZXJ2ZXIobXNnLnBvc2l0aW9uLCBtc2cubW9tZW50dW0pO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIFwicGxheWVyQ2hhbmdlRmFjaW5nXCI6XHJcbiAgICAgICAgICAgIGlmIChtc2cuaWQgPT09IHRoaXMuaWQpIHJldHVybjtcclxuICAgICAgICAgICAgcGxheWVyID0gdGhpcy5nbG9iYWxDbGllbnRBY3RvcnMucGxheWVycy5maW5kKChwbGF5ZXIpID0+IHBsYXllci5nZXRBY3RvcklkKCkgPT09IG1zZy5pZCk7XHJcbiAgICAgICAgICAgIGlmIChwbGF5ZXIpIHtcclxuICAgICAgICAgICAgICAgIHBsYXllci51cGRhdGVGYWNpbmdGcm9tU2VydmVyKG1zZy5mYWNpbmdSaWdodCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBcInNlcnZlclN0YXJ0VHJhbnNsYXRpb25cIjpcclxuICAgICAgICAgICAgbGV0IGFjdG9yID0gdGhpcy5nbG9iYWxDbGllbnRBY3RvcnMuYWN0b3JzLmZpbmQoKGFjdG9yKSA9PiBhY3Rvci5nZXRBY3RvcklkKCkgPT09IG1zZy5hY3RvcklkKTtcclxuICAgICAgICAgICAgaWYgKGFjdG9yKSB7XHJcbiAgICAgICAgICAgICAgICBhY3Rvci51cGRhdGVQb3NpdGlvbkFuZE1vbWVudHVtRnJvbVNlcnZlcihtc2cucG9zaXRpb24sIG1zZy5tb21lbnR1bSk7XHJcbiAgICAgICAgICAgICAgICBhY3Rvci5zdGFydFRyYW5zbGF0aW9uKG1zZy5hbmdsZSwgbXNnLnRyYW5zbGF0aW9uTmFtZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBcInNlcnZlclN3b3JkTWVzc2FnZVwiOlxyXG4gICAgICAgICAgICBpZiAobXNnLm9yaWdpbklkID09PSB0aGlzLmlkKSByZXR1cm47XHJcbiAgICAgICAgICAgIGxldCBzd29yZFBsYXllciA9IHRoaXMuZ2xvYmFsQ2xpZW50QWN0b3JzLnN3b3JkUGxheWVycy5maW5kKChwbGF5ZXIpID0+IHBsYXllci5nZXRBY3RvcklkKCkgPT09IG1zZy5vcmlnaW5JZCk7XHJcbiAgICAgICAgICAgIGlmIChzd29yZFBsYXllcikge1xyXG4gICAgICAgICAgICAgICAgc3dvcmRQbGF5ZXIudXBkYXRlUG9zaXRpb25BbmRNb21lbnR1bUZyb21TZXJ2ZXIobXNnLnBvc2l0aW9uLCBtc2cubW9tZW50dW0pO1xyXG4gICAgICAgICAgICAgICAgaWYgKG1zZy5tc2cuc3RhcnRpbmcpIHN3b3JkUGxheWVyLnBlcmZvcm1DbGllbnRBYmlsaXR5W21zZy5tc2cuYWJpbGl0eV0obXNnLm1zZy5tb3VzZVBvcyk7XHJcbiAgICAgICAgICAgICAgICBlbHNlIHN3b3JkUGxheWVyLnJlbGVhc2VDbGllbnRBYmlsaXR5W21zZy5tc2cuYWJpbGl0eV0oKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBcInNlcnZlckRhZ2dlcnNNZXNzYWdlXCI6XHJcbiAgICAgICAgICAgIGlmIChtc2cub3JpZ2luSWQgPT09IHRoaXMuaWQpIHJldHVybjtcclxuICAgICAgICAgICAgbGV0IGRhZ2dlcnNQbGF5ZXIgPSB0aGlzLmdsb2JhbENsaWVudEFjdG9ycy5kYWdnZXJQbGF5ZXJzLmZpbmQoKHBsYXllcikgPT4gcGxheWVyLmdldEFjdG9ySWQoKSA9PT0gbXNnLm9yaWdpbklkKTtcclxuICAgICAgICAgICAgaWYgKGRhZ2dlcnNQbGF5ZXIpIHtcclxuICAgICAgICAgICAgICAgIGRhZ2dlcnNQbGF5ZXIudXBkYXRlUG9zaXRpb25BbmRNb21lbnR1bUZyb21TZXJ2ZXIobXNnLnBvc2l0aW9uLCBtc2cubW9tZW50dW0pO1xyXG4gICAgICAgICAgICAgICAgaWYgKG1zZy5tc2cuc3RhcnRpbmcpIGRhZ2dlcnNQbGF5ZXIucGVyZm9ybUNsaWVudEFiaWxpdHlbbXNnLm1zZy5hYmlsaXR5XShtc2cubXNnLm1vdXNlUG9zKTtcclxuICAgICAgICAgICAgICAgIGVsc2UgZGFnZ2Vyc1BsYXllci5yZWxlYXNlQ2xpZW50QWJpbGl0eVttc2cubXNnLmFiaWxpdHldKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgXCJzZXJ2ZXJIYW1tZXJNZXNzYWdlXCI6XHJcbiAgICAgICAgICAgIGlmIChtc2cub3JpZ2luSWQgPT09IHRoaXMuaWQpIHJldHVybjtcclxuICAgICAgICAgICAgbGV0IGhhbW1lclBsYXllciA9IHRoaXMuZ2xvYmFsQ2xpZW50QWN0b3JzLmhhbW1lclBsYXllcnMuZmluZCgocGxheWVyKSA9PiBwbGF5ZXIuZ2V0QWN0b3JJZCgpID09PSBtc2cub3JpZ2luSWQpO1xyXG4gICAgICAgICAgICBpZiAoaGFtbWVyUGxheWVyKSB7XHJcbiAgICAgICAgICAgICAgICBoYW1tZXJQbGF5ZXIudXBkYXRlUG9zaXRpb25BbmRNb21lbnR1bUZyb21TZXJ2ZXIobXNnLnBvc2l0aW9uLCBtc2cubW9tZW50dW0pO1xyXG4gICAgICAgICAgICAgICAgaWYgKG1zZy5tc2cuc3RhcnRpbmcpIGhhbW1lclBsYXllci5wZXJmb3JtQ2xpZW50QWJpbGl0eVttc2cubXNnLmFiaWxpdHldKG1zZy5tc2cubW91c2VQb3MpO1xyXG4gICAgICAgICAgICAgICAgZWxzZSBoYW1tZXJQbGF5ZXIucmVsZWFzZUNsaWVudEFiaWxpdHlbbXNnLm1zZy5hYmlsaXR5XSgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbnJlY29nbml6ZWQgbWVzc2FnZSBmcm9tIHNlcnZlclwiKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGZpbmRBY3Rvcih0aGlzOiBHYW1lLCBhY3RvcklkOiBudW1iZXIsIGFjdG9yVHlwZTogQWN0b3JUeXBlKTogQ2xpZW50QWN0b3Ige1xyXG4gICAgc3dpdGNoIChhY3RvclR5cGUpIHtcclxuICAgICAgICBjYXNlIFwiZGFnZ2Vyc1BsYXllclwiOlxyXG4gICAgICAgICAgICBsZXQgZGFnZ2VyUGxheWVyID0gdGhpcy5nbG9iYWxDbGllbnRBY3RvcnMuZGFnZ2VyUGxheWVycy5maW5kKChwbGF5ZXIpID0+IHBsYXllci5nZXRBY3RvcklkKCkgPT09IGFjdG9ySWQpO1xyXG4gICAgICAgICAgICBpZiAoZGFnZ2VyUGxheWVyKSByZXR1cm4gZGFnZ2VyUGxheWVyO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIFwic3dvcmRQbGF5ZXJcIjpcclxuICAgICAgICAgICAgbGV0IHN3b3JkUGxheWVyID0gdGhpcy5nbG9iYWxDbGllbnRBY3RvcnMuc3dvcmRQbGF5ZXJzLmZpbmQoKHBsYXllcikgPT4gcGxheWVyLmdldEFjdG9ySWQoKSA9PT0gYWN0b3JJZCk7XHJcbiAgICAgICAgICAgIGlmIChzd29yZFBsYXllcikgcmV0dXJuIHN3b3JkUGxheWVyO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIFwiaGFtbWVyUGxheWVyXCI6XHJcbiAgICAgICAgICAgIGxldCBoYW1tZXJQbGF5ZXIgPSB0aGlzLmdsb2JhbENsaWVudEFjdG9ycy5oYW1tZXJQbGF5ZXJzLmZpbmQoKHBsYXllcikgPT4gcGxheWVyLmdldEFjdG9ySWQoKSA9PT0gYWN0b3JJZCk7XHJcbiAgICAgICAgICAgIGlmIChoYW1tZXJQbGF5ZXIpIHJldHVybiBoYW1tZXJQbGF5ZXI7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlVua25vd24gYWN0b3IgdHlwZSBpbiBtZXNzYWdlSGFuZGxlcidzIGZpbmRBY3RvclwiKTtcclxuICAgIH1cclxuICAgIHRocm93IG5ldyBFcnJvcihcIkFjdG9yIFwiICsgYWN0b3JJZCArIFwiIFwiICsgYWN0b3JUeXBlICsgXCIgbm90IGZvdW5kIGluIG1lc3NhZ2VIYW5kbGVyJ3MgZmluZEFjdG9yXCIpO1xyXG59XHJcbiIsImltcG9ydCB7IFZlY3RvciB9IGZyb20gXCIuLi8uLi8uLi92ZWN0b3JcIjtcclxuaW1wb3J0IHsgYXNzZXRNYW5hZ2VyIH0gZnJvbSBcIi4uLy4uL2dhbWVSZW5kZXIvYXNzZXRtYW5hZ2VyXCI7XHJcbmltcG9ydCB7IFBhcnRpY2xlQmFzZSB9IGZyb20gXCIuL3BhcnRpY2xlQmFzZUNsYXNzXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgRHVtbXlTbGFzaEVmZmVjdDIgZXh0ZW5kcyBQYXJ0aWNsZUJhc2Uge1xyXG4gICAgcHJvdGVjdGVkIHJlYWRvbmx5IHNjYWxlOiBudW1iZXIgPSAwLjU7XHJcbiAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgc2xhc2hJbWFnZTogSFRNTEltYWdlRWxlbWVudCA9IGFzc2V0TWFuYWdlci5pbWFnZXNbXCJzbGFzaEVmZmVjdFRlc3QyXCJdO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELCBwb3NpdGlvbjogVmVjdG9yLCBwcm90ZWN0ZWQgYW5nbGU6IG51bWJlciwgcHJvdGVjdGVkIHJlYWRvbmx5IGZsaXBYOiBib29sZWFuKSB7XHJcbiAgICAgICAgc3VwZXIoY3R4LCBwb3NpdGlvbiwgMC4wNCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIHRoaXMuY3R4Lmdsb2JhbEFscGhhID0gdGhpcy5jdXJyZW50TGlmZSAvIDAuMDQ7XHJcbiAgICAgICAgdGhpcy5jdHgudHJhbnNsYXRlKHRoaXMucG9zaXRpb24ueCwgdGhpcy5wb3NpdGlvbi55KTtcclxuICAgICAgICBpZiAodGhpcy5mbGlwWCkgdGhpcy5jdHguc2NhbGUodGhpcy5zY2FsZSwgdGhpcy5zY2FsZSk7XHJcbiAgICAgICAgZWxzZSB0aGlzLmN0eC5zY2FsZSgtdGhpcy5zY2FsZSwgdGhpcy5zY2FsZSk7XHJcbiAgICAgICAgdGhpcy5jdHgucm90YXRlKHRoaXMuYW5nbGUpO1xyXG4gICAgICAgIHRoaXMuY3R4LnRyYW5zbGF0ZSgtMTIwLCAtMTkwKTtcclxuXHJcbiAgICAgICAgdGhpcy5jdHguZHJhd0ltYWdlKHRoaXMuc2xhc2hJbWFnZSwgMCwgMCk7XHJcblxyXG4gICAgICAgIHRoaXMuY3R4LnRyYW5zbGF0ZSgxMjAsICsxOTApO1xyXG4gICAgICAgIHRoaXMuY3R4LnJvdGF0ZSgtdGhpcy5hbmdsZSk7XHJcbiAgICAgICAgaWYgKHRoaXMuZmxpcFgpIHRoaXMuY3R4LnNjYWxlKDEgLyB0aGlzLnNjYWxlLCAxIC8gdGhpcy5zY2FsZSk7XHJcbiAgICAgICAgZWxzZSB0aGlzLmN0eC5zY2FsZSgtMSAvIHRoaXMuc2NhbGUsIDEgLyB0aGlzLnNjYWxlKTtcclxuICAgICAgICB0aGlzLmN0eC50cmFuc2xhdGUoLXRoaXMucG9zaXRpb24ueCwgLXRoaXMucG9zaXRpb24ueSk7XHJcbiAgICAgICAgdGhpcy5jdHguZ2xvYmFsQWxwaGEgPSAxO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCBlID0gcmVxdWlyZShcImV4cHJlc3NcIik7XHJcbmltcG9ydCB7IFZlY3RvciB9IGZyb20gXCIuLi8uLi8uLi92ZWN0b3JcIjtcclxuaW1wb3J0IHsgYXNzZXRNYW5hZ2VyIH0gZnJvbSBcIi4uLy4uL2dhbWVSZW5kZXIvYXNzZXRtYW5hZ2VyXCI7XHJcbmltcG9ydCB7IFBhcnRpY2xlQmFzZSB9IGZyb20gXCIuL3BhcnRpY2xlQmFzZUNsYXNzXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgRHVtbXlXaGlybHdpbmRFZmZlY3QgZXh0ZW5kcyBQYXJ0aWNsZUJhc2Uge1xyXG4gICAgcHJvdGVjdGVkIHJlYWRvbmx5IHNjYWxlOiBudW1iZXIgPSAwLjc7XHJcbiAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgYmFzZUltYWdlOiBIVE1MSW1hZ2VFbGVtZW50ID0gYXNzZXRNYW5hZ2VyLmltYWdlc1tcIndoaXJsd2luZEVmZmVjdEJhc2VcIl07XHJcbiAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgdG9wSW1hZ2U6IEhUTUxJbWFnZUVsZW1lbnQgPSBhc3NldE1hbmFnZXIuaW1hZ2VzW1wid2hpcmx3aW5kRWZmZWN0VG9wXCJdO1xyXG5cclxuICAgIHByb3RlY3RlZCB0b3BSb3RhdGlvbjogbnVtYmVyID0gMDtcclxuICAgIHByb3RlY3RlZCBiYXNlUm90YXRpb246IG51bWJlciA9IDA7XHJcbiAgICBwcm90ZWN0ZWQgYWxwaGE6IG51bWJlciA9IDA7XHJcblxyXG4gICAgcHJvdGVjdGVkIGVuZGluZzogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELCBwb3NpdGlvbjogVmVjdG9yLCBwcm90ZWN0ZWQgcmVhZG9ubHkgZmxpcFg6IGJvb2xlYW4pIHtcclxuICAgICAgICBzdXBlcihjdHgsIHBvc2l0aW9uLCA1KTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVBbmRSZW5kZXIoZWxhcHNlZFRpbWU6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMudG9wUm90YXRpb24gKz0gZWxhcHNlZFRpbWUgKiA0NTtcclxuICAgICAgICB0aGlzLmJhc2VSb3RhdGlvbiArPSBlbGFwc2VkVGltZSAqIDEwO1xyXG4gICAgICAgIGlmICh0aGlzLmVuZGluZykge1xyXG4gICAgICAgICAgICB0aGlzLmFscGhhIC09IGVsYXBzZWRUaW1lICogMTA7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmFscGhhIDw9IDApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaWZEZWFkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYWxwaGEgPSAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuYWxwaGEgPCAxKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFscGhhICs9IGVsYXBzZWRUaW1lICogNTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBzdXBlci51cGRhdGVBbmRSZW5kZXIoZWxhcHNlZFRpbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICB0aGlzLmN0eC5nbG9iYWxBbHBoYSA9IHRoaXMuYWxwaGE7XHJcbiAgICAgICAgdGhpcy5jdHgudHJhbnNsYXRlKHRoaXMucG9zaXRpb24ueCwgdGhpcy5wb3NpdGlvbi55KTtcclxuICAgICAgICBpZiAodGhpcy5mbGlwWCkgdGhpcy5jdHguc2NhbGUodGhpcy5zY2FsZSwgdGhpcy5zY2FsZSk7XHJcbiAgICAgICAgZWxzZSB0aGlzLmN0eC5zY2FsZSgtdGhpcy5zY2FsZSwgdGhpcy5zY2FsZSk7XHJcblxyXG4gICAgICAgIHRoaXMuY3R4LnJvdGF0ZSh0aGlzLmJhc2VSb3RhdGlvbik7XHJcbiAgICAgICAgdGhpcy5jdHgudHJhbnNsYXRlKC0zMDAsIC0zMDApO1xyXG5cclxuICAgICAgICB0aGlzLmN0eC5kcmF3SW1hZ2UodGhpcy5iYXNlSW1hZ2UsIDAsIDApO1xyXG5cclxuICAgICAgICB0aGlzLmN0eC50cmFuc2xhdGUoMzAwLCArMzAwKTtcclxuICAgICAgICB0aGlzLmN0eC5yb3RhdGUoLXRoaXMuYmFzZVJvdGF0aW9uKTtcclxuXHJcbiAgICAgICAgdGhpcy5jdHgucm90YXRlKHRoaXMudG9wUm90YXRpb24pO1xyXG4gICAgICAgIHRoaXMuY3R4LnRyYW5zbGF0ZSgtMzAwLCAtMzAwKTtcclxuXHJcbiAgICAgICAgdGhpcy5jdHguZHJhd0ltYWdlKHRoaXMudG9wSW1hZ2UsIDAsIDApO1xyXG5cclxuICAgICAgICB0aGlzLmN0eC50cmFuc2xhdGUoMzAwLCArMzAwKTtcclxuICAgICAgICB0aGlzLmN0eC5yb3RhdGUoLXRoaXMudG9wUm90YXRpb24pO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5mbGlwWCkgdGhpcy5jdHguc2NhbGUoMSAvIHRoaXMuc2NhbGUsIDEgLyB0aGlzLnNjYWxlKTtcclxuICAgICAgICBlbHNlIHRoaXMuY3R4LnNjYWxlKC0xIC8gdGhpcy5zY2FsZSwgMSAvIHRoaXMuc2NhbGUpO1xyXG4gICAgICAgIHRoaXMuY3R4LnRyYW5zbGF0ZSgtdGhpcy5wb3NpdGlvbi54LCAtdGhpcy5wb3NpdGlvbi55KTtcclxuICAgICAgICB0aGlzLmN0eC5nbG9iYWxBbHBoYSA9IDE7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHByZW1hdHVyZUVuZCgpIHtcclxuICAgICAgICB0aGlzLmVuZGluZyA9IHRydWU7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgZmluZE9ydGhvbm9ybWFsVmVjdG9yLCBWZWN0b3IgfSBmcm9tIFwiLi4vLi4vLi4vdmVjdG9yXCI7XHJcbmltcG9ydCB7IFBhcnRpY2xlQmFzZSB9IGZyb20gXCIuL3BhcnRpY2xlQmFzZUNsYXNzXCI7XHJcblxyXG5jb25zdCB0cmFpbERlbGF5OiBudW1iZXIgPSA3O1xyXG5jb25zdCB0cmFpbFdpZHRoOiBudW1iZXIgPSAyNztcclxuXHJcbmV4cG9ydCBjbGFzcyBMdW5nZUVmZmVjdCBleHRlbmRzIFBhcnRpY2xlQmFzZSB7XHJcbiAgICBwcm90ZWN0ZWQgdHJhaWxpbmdQb2ludDogVmVjdG9yO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELCBwb3NpdGlvbjogVmVjdG9yLCBwcm90ZWN0ZWQgcmVhZG9ubHkgY29sb3I6IHN0cmluZykge1xyXG4gICAgICAgIHN1cGVyKGN0eCwgcG9zaXRpb24sIDAuNCk7XHJcbiAgICAgICAgdGhpcy50cmFpbGluZ1BvaW50ID0geyB4OiBwb3NpdGlvbi54ICsgMCwgeTogcG9zaXRpb24ueSArIDAgfTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdXBkYXRlQW5kUmVuZGVyKGVsYXBzZWRUaW1lOiBudW1iZXIpIHtcclxuICAgICAgICBzdXBlci51cGRhdGVBbmRSZW5kZXIoZWxhcHNlZFRpbWUpO1xyXG4gICAgICAgIHRoaXMudHJhaWxpbmdQb2ludC54ID0gKHRoaXMucG9zaXRpb24ueCArIHRoaXMudHJhaWxpbmdQb2ludC54ICogKHRyYWlsRGVsYXkgLSAxKSkgLyB0cmFpbERlbGF5O1xyXG4gICAgICAgIHRoaXMudHJhaWxpbmdQb2ludC55ID0gKHRoaXMucG9zaXRpb24ueSArIHRoaXMudHJhaWxpbmdQb2ludC55ICogKHRyYWlsRGVsYXkgLSAxKSkgLyB0cmFpbERlbGF5O1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICB0aGlzLmN0eC5nbG9iYWxBbHBoYSA9IHRoaXMuY3VycmVudExpZmUgLyAwLjI7XHJcbiAgICAgICAgdGhpcy5jdHguZmlsbFN0eWxlID0gdGhpcy5jb2xvcjtcclxuXHJcbiAgICAgICAgbGV0IG5vcm1hbDogVmVjdG9yID0gZmluZE9ydGhvbm9ybWFsVmVjdG9yKHRoaXMudHJhaWxpbmdQb2ludCwgdGhpcy5wb3NpdGlvbik7XHJcbiAgICAgICAgbGV0IHB0MTogVmVjdG9yID0geyB4OiBub3JtYWwueCAqIHRyYWlsV2lkdGgsIHk6IG5vcm1hbC55ICogdHJhaWxXaWR0aCB9O1xyXG4gICAgICAgIGxldCBwdDI6IFZlY3RvciA9IHsgeDogbm9ybWFsLnggKiAtdHJhaWxXaWR0aCwgeTogbm9ybWFsLnkgKiAtdHJhaWxXaWR0aCB9O1xyXG5cclxuICAgICAgICB0aGlzLmN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICB0aGlzLmN0eC5tb3ZlVG8odGhpcy50cmFpbGluZ1BvaW50LngsIHRoaXMudHJhaWxpbmdQb2ludC55KTtcclxuICAgICAgICB0aGlzLmN0eC5saW5lVG8odGhpcy5wb3NpdGlvbi54ICsgcHQxLngsIHRoaXMucG9zaXRpb24ueSArIHB0MS55KTtcclxuICAgICAgICB0aGlzLmN0eC5saW5lVG8odGhpcy5wb3NpdGlvbi54ICsgcHQyLngsIHRoaXMucG9zaXRpb24ueSArIHB0Mi55KTtcclxuICAgICAgICB0aGlzLmN0eC5maWxsKCk7XHJcblxyXG4gICAgICAgIHRoaXMuY3R4Lmdsb2JhbEFscGhhID0gMTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBWZWN0b3IgfSBmcm9tIFwiLi4vLi4vLi4vdmVjdG9yXCI7XHJcblxyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgUGFydGljbGVCYXNlIHtcclxuICAgIHB1YmxpYyBpZkRlYWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHByb3RlY3RlZCBjdXJyZW50TGlmZTogbnVtYmVyO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByb3RlY3RlZCByZWFkb25seSBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCwgcHJvdGVjdGVkIHBvc2l0aW9uOiBWZWN0b3IsIHByb3RlY3RlZCBsaWZlVGltZTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50TGlmZSA9IHRoaXMubGlmZVRpbWUgKyAwO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB1cGRhdGVBbmRSZW5kZXIoZWxhcHNlZFRpbWU6IG51bWJlcikge1xyXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRMaWZlID4gMCkge1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRMaWZlIC09IGVsYXBzZWRUaW1lO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50TGlmZSA8IDApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudExpZmUgPSAwO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pZkRlYWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgYWJzdHJhY3QgcmVuZGVyKCk6IHZvaWQ7XHJcbn1cclxuIiwiaW1wb3J0IHsgVmVjdG9yIH0gZnJvbSBcIi4uLy4uLy4uL3ZlY3RvclwiO1xyXG5pbXBvcnQgeyBQYXJ0aWNsZUJhc2UgfSBmcm9tIFwiLi9wYXJ0aWNsZUJhc2VDbGFzc1wiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFNwYXJrIGV4dGVuZHMgUGFydGljbGVCYXNlIHtcclxuICAgIGNvbnN0cnVjdG9yKGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELCBwb3NpdGlvbjogVmVjdG9yLCBsaWZlVGltZTogbnVtYmVyKSB7XHJcbiAgICAgICAgc3VwZXIoY3R4LCBwb3NpdGlvbiwgbGlmZVRpbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICB0aGlzLmN0eC5nbG9iYWxBbHBoYSA9IHRoaXMuY3VycmVudExpZmUgLyB0aGlzLmxpZmVUaW1lO1xyXG4gICAgICAgIHRoaXMuY3R4LmZpbGxSZWN0KHRoaXMucG9zaXRpb24ueCAtIDMsIHRoaXMucG9zaXRpb24ueSAtIDMsIDYsIDYpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IFZlY3RvciB9IGZyb20gXCIuLi8uLi8uLi92ZWN0b3JcIjtcclxuaW1wb3J0IHsgUGFydGljbGVCYXNlIH0gZnJvbSBcIi4uL3BhcnRpY2xlQ2xhc3Nlcy9wYXJ0aWNsZUJhc2VDbGFzc1wiO1xyXG5cclxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFBhcnRpY2xlR3JvdXAge1xyXG4gICAgcHJvdGVjdGVkIHBhcnRpY2xlczogUGFydGljbGVCYXNlW10gPSBbXTtcclxuXHJcbiAgICBwdWJsaWMgaWZEZWFkOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJvdGVjdGVkIHJlYWRvbmx5IGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELCBwcm90ZWN0ZWQgcG9zaXRpb246IFZlY3Rvcikge31cclxuXHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgdXBkYXRlQW5kUmVuZGVyKGVsYXBzZWRUaW1lOiBudW1iZXIpOiB2b2lkO1xyXG59XHJcbiIsImltcG9ydCB7IFJhbmRvbSB9IGZyb20gXCIuLi8uLi8uLi9yYW5kb21cIjtcclxuaW1wb3J0IHsgVmVjdG9yIH0gZnJvbSBcIi4uLy4uLy4uL3ZlY3RvclwiO1xyXG5pbXBvcnQgeyBTcGFyayB9IGZyb20gXCIuLi9wYXJ0aWNsZUNsYXNzZXMvc3BhcmtcIjtcclxuaW1wb3J0IHsgUGFydGljbGVHcm91cCB9IGZyb20gXCIuL3BhcnRpY2xlR3JvdXBcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBTcGFya3MgZXh0ZW5kcyBQYXJ0aWNsZUdyb3VwIHtcclxuICAgIHBhcnRpY2xlczogU3BhcmtbXSA9IFtdO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELCBwb3NpdGlvbjogVmVjdG9yKSB7XHJcbiAgICAgICAgc3VwZXIoY3R4LCBwb3NpdGlvbik7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGk6IG51bWJlciA9IDA7IGkgPCAxMDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCBhbmdsZTogbnVtYmVyID0gUmFuZG9tLnJhbmdlKC1NYXRoLlBJLCBNYXRoLlBJKTtcclxuICAgICAgICAgICAgbGV0IGRpc3RhbmNlOiBudW1iZXIgPSBSYW5kb20ucmFuZ2UoMCwgMzApO1xyXG4gICAgICAgICAgICBsZXQgbGlmZTogbnVtYmVyID0gUmFuZG9tLnJhbmdlKDAuNiwgMSk7XHJcbiAgICAgICAgICAgIHRoaXMucGFydGljbGVzLnB1c2gobmV3IFNwYXJrKGN0eCwgeyB4OiBwb3NpdGlvbi54ICsgZGlzdGFuY2UgKiBNYXRoLmNvcyhhbmdsZSksIHk6IHBvc2l0aW9uLnkgKyBkaXN0YW5jZSAqIE1hdGguc2luKGFuZ2xlKSB9LCBsaWZlKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZUFuZFJlbmRlcihlbGFwc2VkVGltZTogbnVtYmVyKSB7XHJcbiAgICAgICAgbGV0IGlmRXhpc3RzUGFydGljbGU6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmN0eC5maWxsU3R5bGUgPSBcImdyZWVuXCI7XHJcbiAgICAgICAgdGhpcy5wYXJ0aWNsZXMuZm9yRWFjaCgocGFydGljbGUpID0+IHtcclxuICAgICAgICAgICAgcGFydGljbGUudXBkYXRlQW5kUmVuZGVyKGVsYXBzZWRUaW1lKTtcclxuICAgICAgICAgICAgaWYgKCFwYXJ0aWNsZS5pZkRlYWQpIGlmRXhpc3RzUGFydGljbGUgPSB0cnVlO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGlmICghaWZFeGlzdHNQYXJ0aWNsZSkgdGhpcy5pZkRlYWQgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuY3R4Lmdsb2JhbEFscGhhID0gMTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBMaW5rZWRMaXN0LCBOb2RlIH0gZnJvbSBcIi4uLy4uL2xpbmtlZExpc3RcIjtcclxuaW1wb3J0IHsgVmVjdG9yIH0gZnJvbSBcIi4uLy4uL3ZlY3RvclwiO1xyXG5pbXBvcnQgeyBHYW1lIH0gZnJvbSBcIi4uL2dhbWVcIjtcclxuaW1wb3J0IHsgc2FmZUdldEVsZW1lbnRCeUlkIH0gZnJvbSBcIi4uL3V0aWxcIjtcclxuaW1wb3J0IHsgRHVtbXlTbGFzaEVmZmVjdDIgfSBmcm9tIFwiLi9wYXJ0aWNsZUNsYXNzZXMvZHVtbXlTbGFzaEVmZmVjdDJcIjtcclxuaW1wb3J0IHsgRHVtbXlXaGlybHdpbmRFZmZlY3QgfSBmcm9tIFwiLi9wYXJ0aWNsZUNsYXNzZXMvZHVtbXlXaGlybHdpbmRFZmZlY3RcIjtcclxuaW1wb3J0IHsgTHVuZ2VFZmZlY3QgfSBmcm9tIFwiLi9wYXJ0aWNsZUNsYXNzZXMvbHVuZ2VFZmZlY3RcIjtcclxuaW1wb3J0IHsgUGFydGljbGVCYXNlIH0gZnJvbSBcIi4vcGFydGljbGVDbGFzc2VzL3BhcnRpY2xlQmFzZUNsYXNzXCI7XHJcbmltcG9ydCB7IFBhcnRpY2xlR3JvdXAgfSBmcm9tIFwiLi9wYXJ0aWNsZUdyb3Vwcy9wYXJ0aWNsZUdyb3VwXCI7XHJcbmltcG9ydCB7IFNwYXJrcyB9IGZyb20gXCIuL3BhcnRpY2xlR3JvdXBzL3NwYXJrc1wiO1xyXG5cclxuZXhwb3J0IHR5cGUgcGFydGljbGVUeXBlID0gXCJzbGFzaFwiO1xyXG5leHBvcnQgdHlwZSBwYXJ0aWNsZUdyb3VwVHlwZSA9IFwic3BhcmtcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBQYXJ0aWNsZVN5c3RlbSB7XHJcbiAgICAvL3Byb3RlY3RlZCBwYXJ0aWNsZUdyb3VwczogUGFydGljbGVHcm91cFtdID0gW107XHJcbiAgICAvL3Byb3RlY3RlZCBwYXJ0aWNsZXM6IFBhcnRpY2xlQmFzZVtdID0gW107XHJcbiAgICBwcm90ZWN0ZWQgcGFydGljbGVHcm91cHM6IExpbmtlZExpc3Q8UGFydGljbGVHcm91cD4gPSBuZXcgTGlua2VkTGlzdCgpO1xyXG4gICAgcHJvdGVjdGVkIHBhcnRpY2xlczogTGlua2VkTGlzdDxQYXJ0aWNsZUJhc2U+ID0gbmV3IExpbmtlZExpc3QoKTtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgcmVhZG9ubHkgcGFydGljbGVDdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCwgcHJvdGVjdGVkIHJlYWRvbmx5IGdhbWU6IEdhbWUpIHt9XHJcblxyXG4gICAgcHVibGljIHVwZGF0ZUFuZFJlbmRlcihlbGFwc2VkVGltZTogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLnBhcnRpY2xlR3JvdXBzLmlmRW1wdHkoKSkge1xyXG4gICAgICAgICAgICBsZXQgZ3JvdXA6IE5vZGU8UGFydGljbGVHcm91cD4gfCBudWxsID0gdGhpcy5wYXJ0aWNsZUdyb3Vwcy5oZWFkO1xyXG4gICAgICAgICAgICBsZXQgbGFzdEdyb3VwOiBOb2RlPFBhcnRpY2xlR3JvdXA+IHwgbnVsbCA9IG51bGw7XHJcbiAgICAgICAgICAgIHdoaWxlIChncm91cCAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgZ3JvdXAuZGF0YS51cGRhdGVBbmRSZW5kZXIoZWxhcHNlZFRpbWUpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChncm91cC5kYXRhLmlmRGVhZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChsYXN0R3JvdXApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGFzdEdyb3VwLm5leHQgPSBncm91cC5uZXh0O1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGFydGljbGVHcm91cHMuaGVhZCA9IGdyb3VwLm5leHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGdyb3VwID0gZ3JvdXAubmV4dDtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGFzdEdyb3VwID0gZ3JvdXA7XHJcbiAgICAgICAgICAgICAgICAgICAgZ3JvdXAgPSBncm91cC5uZXh0O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIXRoaXMucGFydGljbGVzLmlmRW1wdHkoKSkge1xyXG4gICAgICAgICAgICBsZXQgcGFydGljbGU6IE5vZGU8UGFydGljbGVCYXNlPiB8IG51bGwgPSB0aGlzLnBhcnRpY2xlcy5oZWFkO1xyXG4gICAgICAgICAgICBsZXQgbGFzdFBhcnRpY2xlOiBOb2RlPFBhcnRpY2xlQmFzZT4gfCBudWxsID0gbnVsbDtcclxuICAgICAgICAgICAgd2hpbGUgKHBhcnRpY2xlICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBwYXJ0aWNsZS5kYXRhLnVwZGF0ZUFuZFJlbmRlcihlbGFwc2VkVGltZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHBhcnRpY2xlLmRhdGEuaWZEZWFkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxhc3RQYXJ0aWNsZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsYXN0UGFydGljbGUubmV4dCA9IHBhcnRpY2xlLm5leHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXJ0aWNsZXMuaGVhZCA9IHBhcnRpY2xlLm5leHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHBhcnRpY2xlID0gcGFydGljbGUubmV4dDtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGFzdFBhcnRpY2xlID0gcGFydGljbGU7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFydGljbGUgPSBwYXJ0aWNsZS5uZXh0O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhZGRTcGFya3MocG9zaXRpb246IFZlY3Rvcikge1xyXG4gICAgICAgIHRoaXMucGFydGljbGVHcm91cHMuaW5zZXJ0QXRCZWdpbihuZXcgU3BhcmtzKHRoaXMucGFydGljbGVDdHgsIHBvc2l0aW9uKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFkZER1bW15U2xhc2hFZmZlY3QyKHBvc2l0aW9uOiBWZWN0b3IsIGFuZ2xlOiBudW1iZXIsIGZsaXBYOiBib29sZWFuKSB7XHJcbiAgICAgICAgdGhpcy5wYXJ0aWNsZXMuaW5zZXJ0QXRCZWdpbihuZXcgRHVtbXlTbGFzaEVmZmVjdDIodGhpcy5wYXJ0aWNsZUN0eCwgcG9zaXRpb24sIGFuZ2xlLCBmbGlwWCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhZGREdW1teVdoaXJsd2luZEVmZmVjdChwb3NpdGlvbjogVmVjdG9yLCBmbGlwWDogYm9vbGVhbik6IER1bW15V2hpcmx3aW5kRWZmZWN0IHtcclxuICAgICAgICBsZXQgdGVtcFB0cjogRHVtbXlXaGlybHdpbmRFZmZlY3QgPSBuZXcgRHVtbXlXaGlybHdpbmRFZmZlY3QodGhpcy5wYXJ0aWNsZUN0eCwgcG9zaXRpb24sIGZsaXBYKTtcclxuICAgICAgICB0aGlzLnBhcnRpY2xlcy5pbnNlcnRBdEJlZ2luKHRlbXBQdHIpO1xyXG4gICAgICAgIHJldHVybiB0ZW1wUHRyO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhZGRMdW5nZUVmZmVjdChwb3NpdGlvbjogVmVjdG9yLCBjb2xvcjogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5wYXJ0aWNsZXMuaW5zZXJ0QXRCZWdpbihuZXcgTHVuZ2VFZmZlY3QodGhpcy5wYXJ0aWNsZUN0eCwgcG9zaXRpb24sIGNvbG9yKSk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgSm9pblJlcXVlc3QsIEpvaW5SZXNwb25zZSB9IGZyb20gXCIuLi9hcGkvam9pblwiO1xyXG5pbXBvcnQgeyBDbGllbnRNZXNzYWdlLCBTZXJ2ZXJNZXNzYWdlIH0gZnJvbSBcIi4uL2FwaS9tZXNzYWdlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgU2VydmVyVGFsa2VyIHtcclxuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgaG9zdE5hbWUgPSB3aW5kb3cubG9jYXRpb24uaG9zdDtcclxuICAgIHB1YmxpYyByZWFkb25seSBzZXJ2ZXJUYWxrZXJSZWFkeTogUHJvbWlzZTxKb2luUmVzcG9uc2U+O1xyXG4gICAgcHJpdmF0ZSB3ZWJzb2NrZXQ/OiBXZWJTb2NrZXQ7XHJcbiAgICBjb25zdHJ1Y3Rvcihqb2luUmVxdWVzdDogSm9pblJlcXVlc3QsIHB1YmxpYyBtZXNzYWdlSGFuZGxlcjogKGRhdGE6IFNlcnZlck1lc3NhZ2UpID0+IHZvaWQgPSAoKSA9PiB7fSkge1xyXG4gICAgICAgIHRoaXMuc2VydmVyVGFsa2VyUmVhZHkgPSBuZXcgUHJvbWlzZTxKb2luUmVzcG9uc2U+KChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5qb2luKGpvaW5SZXF1ZXN0KS50aGVuKChyZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy53ZWJzb2NrZXQgPSBuZXcgV2ViU29ja2V0KFwid3M6Ly9cIiArIFNlcnZlclRhbGtlci5ob3N0TmFtZSArIFwiL1wiICsgcmVzcG9uc2UuaWQudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLndlYnNvY2tldC5vbm1lc3NhZ2UgPSAoZXYpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBkYXRhID0gSlNPTi5wYXJzZShldi5kYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1lc3NhZ2VIYW5kbGVyKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIHRoaXMud2Vic29ja2V0Lm9ub3BlbiA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhc3luYyBzZW5kTWVzc2FnZShkYXRhOiBDbGllbnRNZXNzYWdlKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLndlYnNvY2tldCkge1xyXG4gICAgICAgICAgICBhd2FpdCB0aGlzLnNlcnZlclRhbGtlclJlYWR5O1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLndlYnNvY2tldCEuc2VuZChKU09OLnN0cmluZ2lmeShkYXRhKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFzeW5jIGpvaW4ocmVxdWVzdDogSm9pblJlcXVlc3QpOiBQcm9taXNlPEpvaW5SZXNwb25zZT4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnBvc3RIZWxwZXIoXCJqb2luXCIsIHJlcXVlc3QpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgYXN5bmMgcG9zdEhlbHBlcih1cmw6IHN0cmluZywgZGF0YTogYW55KTogUHJvbWlzZTxhbnk+IHtcclxuICAgICAgICByZXR1cm4gZmV0Y2goXCJodHRwczovL1wiICsgU2VydmVyVGFsa2VyLmhvc3ROYW1lICsgXCIvXCIgKyB1cmwsIHtcclxuICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcclxuICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoZGF0YSksXHJcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH0pLnRoZW4oKHJlc3BvbnNlKSA9PiByZXNwb25zZS5qc29uKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgYXN5bmMgZ2V0SGVscGVyKHVybDogc3RyaW5nKTogUHJvbWlzZTxhbnk+IHtcclxuICAgICAgICByZXR1cm4gZmV0Y2goXCJodHRwczovL1wiICsgU2VydmVyVGFsa2VyLmhvc3ROYW1lICsgXCIvXCIgKyB1cmwpLnRoZW4oKHJlc3BvbnNlKSA9PiByZXNwb25zZS5qc29uKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhc3luYyBsZWF2ZSgpIHtcclxuICAgICAgICBpZiAoIXRoaXMud2Vic29ja2V0KSB7XHJcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuc2VydmVyVGFsa2VyUmVhZHk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMud2Vic29ja2V0IS5jbG9zZSgpO1xyXG4gICAgfVxyXG59XHJcbiIsImV4cG9ydCBmdW5jdGlvbiBzYWZlR2V0RWxlbWVudEJ5SWQoaWQ6IHN0cmluZyk6IEhUTUxFbGVtZW50IHtcclxuICAgIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XHJcbiAgICBpZiAoZWxlbWVudCkge1xyXG4gICAgICAgIHJldHVybiBlbGVtZW50O1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEVsZW1lbnQgd2l0aCBpZCAke2lkfSBjb3VsZCBub3QgYmUgZ290dGVuYCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBmaWxsUGF0Y2hOb3Rlc0RpdihkaXY6IEhUTUxFbGVtZW50KTogdm9pZCB7XHJcbiAgICBmb3IgKGxldCBpMTogbnVtYmVyID0gMDsgaTEgPCBwYXRjaE5vdGVzLmxlbmd0aDsgaTErKykge1xyXG4gICAgICAgIGRpdi5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaHJcIikpO1xyXG5cclxuICAgICAgICBsZXQgZGF0ZTogSFRNTEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKTtcclxuICAgICAgICBkYXRlLmNsYXNzTGlzdC5hZGQoXCJwYXRjaERhdGVcIik7XHJcbiAgICAgICAgZGF0ZS5pbm5lclRleHQgPSBwYXRjaE5vdGVzW2kxXS5kYXRlVGl0bGU7XHJcbiAgICAgICAgaWYgKHBhdGNoTm90ZXNbaTFdLmlmTmV3KSB7XHJcbiAgICAgICAgICAgIGRhdGUuY2xhc3NMaXN0LmFkZChcIm5ld1BhdGNoXCIpO1xyXG4gICAgICAgICAgICBkYXRlLmlubmVyVGV4dCArPSBcIiAtIE5FV1wiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBkaXYuYXBwZW5kQ2hpbGQoZGF0ZSk7XHJcblxyXG4gICAgICAgIHBhdGNoTm90ZXNbaTFdLmFkZGl0aW9ucy5mb3JFYWNoKChhZGRpdGlvblRleHQpID0+IHtcclxuICAgICAgICAgICAgbGV0IGFkZGl0aW9uRWxlbWVudDogSFRNTEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKTtcclxuICAgICAgICAgICAgYWRkaXRpb25FbGVtZW50LmlubmVyVGV4dCA9IGFkZGl0aW9uVGV4dDtcclxuICAgICAgICAgICAgaWYgKHBhdGNoTm90ZXNbaTFdLmlmTmV3KSBhZGRpdGlvbkVsZW1lbnQuY2xhc3NMaXN0LmFkZChcIm5ld1BhdGNoXCIpO1xyXG4gICAgICAgICAgICBkaXYuYXBwZW5kQ2hpbGQoYWRkaXRpb25FbGVtZW50KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgcGF0Y2hOb3RlczogeyBkYXRlVGl0bGU6IHN0cmluZzsgYWRkaXRpb25zOiBzdHJpbmdbXTsgaWZOZXc6IGJvb2xlYW4gfVtdID0gW1xyXG4gICAge1xyXG4gICAgICAgIGRhdGVUaXRsZTogXCJUQkRcIixcclxuICAgICAgICBhZGRpdGlvbnM6IFtcIkZpeGVkIGEgYnVnIHdoZXJlIGxhcmdlIHNjcmVlbnMgZGlkbid0IGNvcnJlY3RseSBkZXRlY3QgdGhlIG1vdXNlIHBvc2l0aW9uLlwiXSxcclxuICAgICAgICBpZk5ldzogdHJ1ZSxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgZGF0ZVRpdGxlOiBcIjUtMjAtMjEgLSBDb29sZXIgQWJpbGl0aWVzIC8gUG9saXNoaW5nXCIsXHJcbiAgICAgICAgYWRkaXRpb25zOiBbXHJcbiAgICAgICAgICAgIFwiUmVkaWQgU3dvcmQgd2VhcG9uIGFuZCBhbmltYXRpb25zLCBob3BlZnVsbHkgZm9yIHRoZSBiZXR0ZXIuIEFueSBmZWVkYmFjayBvbiBob3cgdGhlIGFiaWxpdGllcyBmZWVsIHdvdWxkIGJlIGF3ZXNvbWUuXCIsXHJcbiAgICAgICAgICAgIFwiQWRkZWQgYSB3ZWJzaXRlIGljb24hIExvdmUgaXQgYW5kIGNoZXJpc2ggaXQhIVwiLFxyXG4gICAgICAgICAgICBcIlRoZSBjb21tZW50IHN5c3RlbSBoYWQgbWFsZnVuY3Rpb25zLCBhbmQgSSBkaWRuJ3QgcmVjZWl2ZSBhbnkgY29tbWVudHMuIFNvcnJ5ISBJZiB5b3Ugd291bGQgcmVzZW5kIGFueSB0aGF0IHlvdSBzZW50LCBJIHdvdWxkIGJlIHZlcnkgZ3JhdGVmdWwuIEknbGwgYmUgd2F0Y2hpbmcgY2xvc2VseSB0byBtYWtlIHN1cmUgdGhlcmUgYXJlIG5vIG1vcmUgZXJyb3JzLiBTaG91dG91dCB0byBKZW5zIHdobyBoZWxwZWQgbWUgZmluZCBpdC5cIixcclxuICAgICAgICAgICAgXCJBZGRlZCBzbWFsbCB2aXN1YWwgdHJlYXRzIHRvIGFiaWxpdGllcyB3aXRoIG1vcmUgdG8gY29tZS5cIixcclxuICAgICAgICAgICAgXCJFdmVuIGZhc3RlciBwZXJmb3JtYW5jZSAodGltZSBiZXR3ZWVuIHByZXNzaW5nIGEgYnV0dG9uIGFuZCB0aGUgYWN0aW9uIGhhcHBlbm5pbmcgcmVkdWNlZCBieSA1MCUpIGFuZCBhIG1vcmUgcGxheWVyLWNlbnRlcmVkIHZpZXdwb2ludCB3aXRoIGJldHRlciB6b29taW5nL3NjYWxpbmcgd2l0aCB5b3VyIHNjcmVlbi5cIixcclxuICAgICAgICAgICAgXCJGaXhlZCBhIHNtYWxsIG1vbWVudHVtIGJ1ZyB0byBob3BlZnVsbHkgZWxpbWluYXRlIHNtYWxsIGRpc2NyZXBhbmNpZXMgaW4gcGxheWVycycgcG9zaXRpb25zIGJldHdlZW4gY2xpZW50cy5cIixcclxuICAgICAgICAgICAgXCJQbGF5ZXIgYm94ZXMgYXJlIHNsaWdodGx5IGJpZ2dlciAoMTAlKSB3aXRoIG91dGxpbmVzIGZvciBiZXR0ZXIgdmlzaWJpbGl0eS5cIixcclxuICAgICAgICBdLFxyXG4gICAgICAgIGlmTmV3OiBmYWxzZSxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgZGF0ZVRpdGxlOiBcIjUtMTUtMjEgLSBCYXNpYyBBYmlsaXR5IEZ1bmN0aW9uYWxpdHlcIixcclxuICAgICAgICBhZGRpdGlvbnM6IFtcclxuICAgICAgICAgICAgXCJBRERFRCBQQVRDSCBOT1RFUy5cIixcclxuICAgICAgICAgICAgXCJBZGRlZCBhIGJhc2ljIHdlYXBvbiBhbmQgYW5pbWF0aW9ucyEhIE1vcmUgdG8gY29tZSB3aXRoIHRoZSBuZXh0IHBhdGNoIVwiLFxyXG4gICAgICAgICAgICBcIlZhc3RseSBpbXByb3ZlZCB1c2VyIGludGVyZmFjZSBhbmQgcmVtb3ZlZCBsZXZlbHMgYW5kIGV4cGVyaWVuY2UgZm9yIG5vdy5cIixcclxuICAgICAgICAgICAgXCJBZGRlZCBiYXNpYyBhYmlsaXRpZXMgZm9yIHRoZSBzd29yZCBjbGFzcyBpbmNsdWRpbmcgU2xhc2ggYW5kIFdoaXJsd2luZCwgYW5kIG1vcmUgd2lsbCBjb21lIG5leHQgcGF0Y2ggZm9yIHRoZSByZW1haW5pbmcgY2xhc3Nlcy5cIixcclxuICAgICAgICAgICAgXCJNQVNTSVZFIHJlbmRlcmluZyBwZXJmb3JtYW5jZSBpbXByb3ZlbWVudHMsIHdpdGggdXAgdG8gNTAlIGluY3JlYXNlZCBnYW1lIGVuZ2luZSBzcGVlZHMuXCIsXHJcbiAgICAgICAgICAgIFwiTmV3IHN1cHBvcnQgZm9yIGxhcmdlciBzY3JlZW5zLCByZW1vdmVkIDRrIHNjcmVlbiBmbG9vciBjbGlwcGluZyAodGhpcyBvbmUncyBmb3IgeW91LCBNYXJrIGFuZCBLYXNzaSkuXCIsXHJcbiAgICAgICAgICAgIFwiQWRkZWQgc21hbGwgcmVkIHBsYXllciBmbGFzaGVzIGZvciBiZXR0ZXIgaGl0IHZpc2liaWxpdHkuXCIsXHJcbiAgICAgICAgICAgIFwiQWRkZWQgYmFzaWMgcGFydGljbGUgZnVuY3Rpb25hbGl0eSB0aGF0J3MgZGlzcGxheWVkIHdoZW4gYSBwbGF5ZXIgaXMgaGVhbGVkLlwiLFxyXG4gICAgICAgIF0sXHJcbiAgICAgICAgaWZOZXc6IGZhbHNlLFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICBkYXRlVGl0bGU6IFwiNS01LTIxIC0gSG90Zml4ZXNcIixcclxuICAgICAgICBhZGRpdGlvbnM6IFtcIlNtYWxsIGJ1ZyBmaXhlcyBmb3IgcGxheWVyIGhlYWx0aC4gUGxheWVyJ3MgaGVhbHRoIHdhcyBub3QgdXBkYXRpbmcgY29ycmVjdGx5IGFuZCBzb21ldGltZXMgb3ZlcnNob290aW5nIHRoZWlyIG1heCBoZWFsdGguXCJdLFxyXG4gICAgICAgIGlmTmV3OiBmYWxzZSxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgZGF0ZVRpdGxlOiBcIjUtNS0yMSAtIFVzZXIgSW50ZXJmYWNlIGFuZCBIZWFsdGhiYXJzXCIsXHJcbiAgICAgICAgYWRkaXRpb25zOiBbXHJcbiAgICAgICAgICAgIFwiSHVnZSB1cGRhdGVzIHRvIHVzZXIgaW50ZXJmYWNlLCBhbmQgYWRkZWQgYSBmZXcgZWFybHkgYWJpbGl0eSBpY29ucy4gQWRkZWQgYSBoZWFsIGFuaW1hdGlvbiB0byB0aGUgaGVhbHRoYmFycywgYW5kIHRlc3Rpbmcgd2l0aCBsZWZ0L3JpZ2h0IGNsaWNrcy5cIixcclxuICAgICAgICAgICAgXCJJbXByb3ZlZCB0aGUgbWFpbiBhY3RvciBjYW52YXMgdG8gcmVkdWNlIGNsaXBwaW5nIGFuZCBpbXByb3ZlIHBlcmZvcm1hbmNlLlwiLFxyXG4gICAgICAgIF0sXHJcbiAgICAgICAgaWZOZXc6IGZhbHNlLFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICBkYXRlVGl0bGU6IFwiNS0zLTIxIC0gUm91Z2ggVUlcIixcclxuICAgICAgICBhZGRpdGlvbnM6IFtcclxuICAgICAgICAgICAgXCJBZGRlZCBiYXNpYyB1c2VyIGludGVyZmFjZSB3aXRoIG1vcmUgdG8gY29tZS4gQWRqdXN0ZWQgY29udHJvbHMgdG8gYmUgbW9yZSByZXNwb25zaXZlLCBhbmQgYWRkZWQgb3B0aW9ucyB0byB0aGUgbWFpbiBtZW51LlwiLFxyXG4gICAgICAgICAgICBcIkZpbmlzaGluZyB0b3VjaGVzIG9uIGRvb2RhZCBjb2xsaXNpb24gZGV0ZWN0aW9uIGFuZCByZXNwb25zZSBmb3JjaW5nLlwiLFxyXG4gICAgICAgIF0sXHJcbiAgICAgICAgaWZOZXc6IGZhbHNlLFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICBkYXRlVGl0bGU6IFwiNC0yOS0yMSAtIFJvY2sgRG9vZGFkc1wiLFxyXG4gICAgICAgIGFkZGl0aW9uczogW1wiQWRkZWQgYmFzaWMgcm9jayBkb29kYWRzLCB3aXRoIG1vcmUgdG8gY29tZSBhcyB0aGUgZ2FtZSBwcm9ncmVzc2VzLlwiLCBcIkFkZGVkIGFuZCBpbXByb3ZlZCBjbGFzcyBpY29ucy5cIl0sXHJcbiAgICAgICAgaWZOZXc6IGZhbHNlLFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICBkYXRlVGl0bGU6IFwiNC0yNy0yMSAtIEdhbWUgTWFrZW92ZXIhIE5ldyBNYWluIE1lbnVcIixcclxuICAgICAgICBhZGRpdGlvbnM6IFtcclxuICAgICAgICAgICAgXCJPdmVyaGF1bGVkIHRoZSBvYmplY3QgaGllcmFyY2h5IGluIHRoZSBjb2RlLCByZXN1bHRpbmcgaW4gZmFzdGVyIHByb2Nlc3NpbmcgYW5kIG1vcmUgcG90ZW50aWFsIHRvIHRoZSBnYW1lLlwiLFxyXG4gICAgICAgICAgICBcIlJlZGlkIHRoZSBtYWluIG1lbnUsIHdpdGggY2xlYXJlciBidXR0b25zIGFuZCBhIG1vcmUgYXBwZWFsaW5nIHZpc3VhbCBzdHlsZS5cIixcclxuICAgICAgICAgICAgXCJOZXcgYW5kIGltcHJvdmVkIHRlcnJhaW4gc3lzdGVtLCBmZWF0dXJpbmcgaGlsbHMgYW5kIHJlYWxpc3RpYy1lciBncm91bmQuXCIsXHJcbiAgICAgICAgICAgIFwiSW1wcm92ZWQgZ3JhcGhpY3MgYW5kIGZhc3RlciByZW5kZXJpbmcgZm9yIGJhY2tncm91bmQgYW5kIHBsYXllcnMuXCIsXHJcbiAgICAgICAgXSxcclxuICAgICAgICBpZk5ldzogZmFsc2UsXHJcbiAgICB9LFxyXG5dO1xyXG4iLCJpbXBvcnQgeyBTaXplIH0gZnJvbSBcIi4vc2l6ZVwiO1xyXG5pbXBvcnQgeyBWZWN0b3IgfSBmcm9tIFwiLi92ZWN0b3JcIjtcclxuXHJcbmNvbnN0IHhTaXplOiBudW1iZXIgPSA1MDAwO1xyXG5jb25zdCB5U2l6ZTogbnVtYmVyID0gMTAwMDtcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgQ29uZmlnIHtcclxuICAgIC8qKlxyXG4gICAgICogRGVjaWRlcyBwbGF5ZXIgaGVpZ2h0IGFuZCB3aWR0aFxyXG4gICAgICovXHJcbiAgICBwbGF5ZXJTaXplOiBTaXplO1xyXG4gICAgcGxheWVyU3RhcnQ6IFZlY3RvcjtcclxuICAgIHBsYXllckp1bXBIZWlnaHQ6IG51bWJlcjtcclxuICAgIHhTaXplOiBudW1iZXI7XHJcbiAgICB5U2l6ZTogbnVtYmVyO1xyXG4gICAgcGxheWVyS2V5czoge1xyXG4gICAgICAgIHVwOiBzdHJpbmc7XHJcbiAgICAgICAgZG93bjogc3RyaW5nO1xyXG4gICAgICAgIGxlZnQ6IHN0cmluZztcclxuICAgICAgICByaWdodDogc3RyaW5nO1xyXG4gICAgICAgIGJhc2ljQXR0YWNrOiBzdHJpbmc7XHJcbiAgICAgICAgc2Vjb25kQXR0YWNrOiBzdHJpbmc7XHJcbiAgICAgICAgZmlyc3RBYmlsaXR5OiBzdHJpbmc7XHJcbiAgICAgICAgc2Vjb25kQWJpbGl0eTogc3RyaW5nO1xyXG4gICAgICAgIHRoaXJkQWJpbGl0eTogc3RyaW5nO1xyXG4gICAgICAgIGZvdXJ0aEFiaWxpdHk6IHN0cmluZztcclxuICAgIH07XHJcbiAgICBwbGF0Zm9ybUNvbG9yOiBzdHJpbmc7XHJcbiAgICBmYWxsaW5nQWNjZWxlcmF0aW9uOiBudW1iZXI7XHJcbiAgICBzdGFuZGluZ1NpZGV3YXlzQWNjZWxlcmF0aW9uOiBudW1iZXI7XHJcbiAgICBub25TdGFuZGluZ1NpZGV3YXlzQWNjZWxlcmF0aW9uOiBudW1iZXI7XHJcbiAgICBtYXhTaWRld2F5c01vbWVudHVtOiBudW1iZXI7XHJcbiAgICBnYW1lU3BlZWQ6IG51bWJlcjtcclxuICAgIHVwZGF0ZVBsYXllckZvY3VzU3BlZWQ6IG51bWJlcjtcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGRlZmF1bHRDb25maWc6IENvbmZpZyA9IHtcclxuICAgIHBsYXllclNpemU6IHsgd2lkdGg6IDk2LCBoZWlnaHQ6IDEwMCB9LFxyXG4gICAgcGxheWVyU3RhcnQ6IHtcclxuICAgICAgICB4OiAzMDAsXHJcbiAgICAgICAgeTogNjUwLFxyXG4gICAgfSxcclxuICAgIHBsYXllckp1bXBIZWlnaHQ6IDEyMDAsXHJcbiAgICB4U2l6ZSxcclxuICAgIHlTaXplLFxyXG4gICAgcGxheWVyS2V5czoge1xyXG4gICAgICAgIHVwOiBcIktleVdcIixcclxuICAgICAgICBkb3duOiBcIktleVNcIixcclxuICAgICAgICBsZWZ0OiBcIktleUFcIixcclxuICAgICAgICByaWdodDogXCJLZXlEXCIsXHJcbiAgICAgICAgYmFzaWNBdHRhY2s6IFwibGVmdE1vdXNlRG93blwiLFxyXG4gICAgICAgIHNlY29uZEF0dGFjazogXCJyaWdodE1vdXNlRG93blwiLFxyXG4gICAgICAgIGZpcnN0QWJpbGl0eTogXCJTcGFjZVwiLFxyXG4gICAgICAgIHNlY29uZEFiaWxpdHk6IFwiU2hpZnRMZWZ0XCIsXHJcbiAgICAgICAgdGhpcmRBYmlsaXR5OiBcIktleVFcIixcclxuICAgICAgICBmb3VydGhBYmlsaXR5OiBcIktleUVcIixcclxuICAgIH0sXHJcbiAgICBwbGF0Zm9ybUNvbG9yOiBcImdyZXlcIixcclxuICAgIGZhbGxpbmdBY2NlbGVyYXRpb246IDM1MDAsXHJcbiAgICBzdGFuZGluZ1NpZGV3YXlzQWNjZWxlcmF0aW9uOiAxMDAwMCxcclxuICAgIG5vblN0YW5kaW5nU2lkZXdheXNBY2NlbGVyYXRpb246IDQwMDAsXHJcbiAgICBtYXhTaWRld2F5c01vbWVudHVtOiA2MDAsXHJcbiAgICBnYW1lU3BlZWQ6IDEsXHJcbiAgICB1cGRhdGVQbGF5ZXJGb2N1c1NwZWVkOiAwLjA1LFxyXG59O1xyXG4iLCJpbXBvcnQgeyBmaW5kRGlzdGFuY2UsIFZlY3RvciB9IGZyb20gXCIuL3ZlY3RvclwiO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGZpbmRBbmdsZShwb3MxOiBWZWN0b3IsIHBvczI6IFZlY3Rvcik6IG51bWJlciB7XHJcbiAgICByZXR1cm4gTWF0aC5hdGFuMihwb3MyLnkgLSBwb3MxLnksIHBvczIueCAtIHBvczEueCk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByb3RhdGVTaGFwZShzaGFwZTogVmVjdG9yW10sIGFuZ2xlOiBudW1iZXIsIHBvc2l0aW9uT2Zmc2V0OiBWZWN0b3IsIGZsaXBPdmVyWTogYm9vbGVhbiA9IGZhbHNlIC8qLCBmbGlwT3Zlclg6IGJvb2xlYW4gPSBmYWxzZSovKTogVmVjdG9yW10ge1xyXG4gICAgbGV0IG5ld1ZlY3RvckFycmF5OiBWZWN0b3JbXSA9IFtdO1xyXG4gICAgZm9yICh2YXIgaTogbnVtYmVyID0gMDsgaSA8IHNoYXBlLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgbmV3VmVjdG9yQXJyYXkucHVzaCh7IHg6IHNoYXBlW2ldLnggKyAwLCB5OiBzaGFwZVtpXS55ICsgMCB9KTtcclxuICAgIH1cclxuICAgIGZvciAodmFyIGk6IG51bWJlciA9IDA7IGkgPCBzaGFwZS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGlmICgoZmxpcE92ZXJZICYmIGFuZ2xlID4gTWF0aC5QSSAvIDIpIHx8IGFuZ2xlIDwgLU1hdGguUEkgLyAyKSB7XHJcbiAgICAgICAgICAgIC8vIGZsaXAgaXQgYXJvdW5kIGlmIHRoZXkncmUgZmFjaW5nIGxlZnRcclxuICAgICAgICAgICAgbmV3VmVjdG9yQXJyYXlbaV0ueSAqPSAtMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IHRhbjogbnVtYmVyID0gZmluZEFuZ2xlKHsgeDogMCwgeTogMCB9LCB7IHg6IG5ld1ZlY3RvckFycmF5W2ldLngsIHk6IG5ld1ZlY3RvckFycmF5W2ldLnkgfSk7IC8vIGZpbmQgb3JpZ2luYWwgYW5nbGVcclxuICAgICAgICBsZXQgZGlzdGFuY2U6IG51bWJlciA9IGZpbmREaXN0YW5jZSh7IHg6IDAsIHk6IDAgfSwgeyB4OiBuZXdWZWN0b3JBcnJheVtpXS54LCB5OiBuZXdWZWN0b3JBcnJheVtpXS55IH0pOyAvLyBmaW5kIG9yaWdpbmFsIGRpc3RhbmNlXHJcbiAgICAgICAgbmV3VmVjdG9yQXJyYXlbaV0ueCA9IGRpc3RhbmNlICogTWF0aC5jb3ModGFuICsgYW5nbGUpICsgcG9zaXRpb25PZmZzZXQueDtcclxuICAgICAgICBuZXdWZWN0b3JBcnJheVtpXS55ID0gZGlzdGFuY2UgKiBNYXRoLnNpbih0YW4gKyBhbmdsZSkgKyBwb3NpdGlvbk9mZnNldC55O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG5ld1ZlY3RvckFycmF5O1xyXG59XHJcbiIsImltcG9ydCB7IFZlY3RvciB9IGZyb20gXCIuL3ZlY3RvclwiO1xyXG5cclxuLy9yZXR1cm5zIHRydWUgaWYgcG9pbnQgaXMgaW5zaWRlIHRoZSBzaGFwZS4gRG9lc24ndCB3b3JrIHJlbGlhYmx5IGlmIHRoZSBwb2ludCBsaWVzIG9uIGFuIGVkZ2Ugb3IgY29ybmVyLCBidXQgdGhvc2UgYXJlIHJhcmUgY2FzZXMuXHJcbmV4cG9ydCBmdW5jdGlvbiBpZkluc2lkZShwb2ludDogVmVjdG9yLCBzaGFwZTogVmVjdG9yW10pOiBib29sZWFuIHtcclxuICAgIC8vIHJheS1jYXN0aW5nIGFsZ29yaXRobSBiYXNlZCBvblxyXG4gICAgLy8gaHR0cHM6Ly93cmYuZWNzZS5ycGkuZWR1L1Jlc2VhcmNoL1Nob3J0X05vdGVzL3BucG9seS5odG1sL3BucG9seS5odG1sXHJcblxyXG4gICAgdmFyIHggPSBwb2ludC54ICsgMCxcclxuICAgICAgICB5ID0gcG9pbnQueSArIDA7XHJcblxyXG4gICAgdmFyIGluc2lkZSA9IGZhbHNlO1xyXG4gICAgZm9yICh2YXIgaSA9IDAsIGogPSBzaGFwZS5sZW5ndGggLSAxOyBpIDwgc2hhcGUubGVuZ3RoOyBqID0gaSsrKSB7XHJcbiAgICAgICAgdmFyIHhpID0gc2hhcGVbaV0ueCArIDAsXHJcbiAgICAgICAgICAgIHlpID0gc2hhcGVbaV0ueSArIDA7XHJcbiAgICAgICAgdmFyIHhqID0gc2hhcGVbal0ueCArIDAsXHJcbiAgICAgICAgICAgIHlqID0gc2hhcGVbal0ueSArIDA7XHJcblxyXG4gICAgICAgIHZhciBpbnRlcnNlY3QgPSB5aSA+IHkgIT0geWogPiB5ICYmIHggPCAoKHhqIC0geGkpICogKHkgLSB5aSkpIC8gKHlqIC0geWkpICsgeGk7XHJcbiAgICAgICAgaWYgKGludGVyc2VjdCkgaW5zaWRlID0gIWluc2lkZTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gaW5zaWRlO1xyXG59XHJcbiIsImltcG9ydCB7IEVkZ2UsIFZlY3RvciB9IGZyb20gXCIuL3ZlY3RvclwiO1xyXG5cclxuLy8gcmV0dXJucyB0cnVlIGlmIGxpbmUxIGludGVyc2VjdHMgd2l0aCBsaW5lMlxyXG5leHBvcnQgZnVuY3Rpb24gaWZJbnRlcnNlY3QobGluZTFTdGFydDogVmVjdG9yLCBsaW5lMUVuZDogVmVjdG9yLCBsaW5lMlN0YXJ0OiBWZWN0b3IsIGxpbmUyRW5kOiBWZWN0b3IpOiBib29sZWFuIHtcclxuICAgIHZhciBkZXQsIGdhbW1hLCBsYW1iZGE7XHJcbiAgICBkZXQgPSAobGluZTFFbmQueCAtIGxpbmUxU3RhcnQueCkgKiAobGluZTJFbmQueSAtIGxpbmUyU3RhcnQueSkgLSAobGluZTJFbmQueCAtIGxpbmUyU3RhcnQueCkgKiAobGluZTFFbmQueSAtIGxpbmUxU3RhcnQueSk7XHJcbiAgICBpZiAoZGV0ID09PSAwKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBsYW1iZGEgPSAoKGxpbmUyRW5kLnkgLSBsaW5lMlN0YXJ0LnkpICogKGxpbmUyRW5kLnggLSBsaW5lMVN0YXJ0LngpICsgKGxpbmUyU3RhcnQueCAtIGxpbmUyRW5kLngpICogKGxpbmUyRW5kLnkgLSBsaW5lMVN0YXJ0LnkpKSAvIGRldDtcclxuICAgICAgICBnYW1tYSA9ICgobGluZTFTdGFydC55IC0gbGluZTFFbmQueSkgKiAobGluZTJFbmQueCAtIGxpbmUxU3RhcnQueCkgKyAobGluZTFFbmQueCAtIGxpbmUxU3RhcnQueCkgKiAobGluZTJFbmQueSAtIGxpbmUxU3RhcnQueSkpIC8gZGV0O1xyXG4gICAgICAgIHJldHVybiAwIDwgbGFtYmRhICYmIGxhbWJkYSA8IDEgJiYgMCA8IGdhbW1hICYmIGdhbW1hIDwgMTtcclxuICAgIH1cclxufVxyXG5cclxuLy8gbGluZSBpbnRlcmNlcHQgbWF0aCBieSBQYXVsIEJvdXJrZSBodHRwOi8vcGF1bGJvdXJrZS5uZXQvZ2VvbWV0cnkvcG9pbnRsaW5lcGxhbmUvXHJcbi8vIERldGVybWluZSB0aGUgaW50ZXJzZWN0aW9uIHBvaW50IG9mIHR3byBsaW5lIHNlZ21lbnRzXHJcbi8vIFJldHVybiBGQUxTRSBpZiB0aGUgbGluZXMgZG9uJ3QgaW50ZXJzZWN0XHJcbmV4cG9ydCBmdW5jdGlvbiBmaW5kSW50ZXJzZWN0aW9uKGVkZ2UxOiBFZGdlLCBlZGdlMjogRWRnZSk6IHVuZGVmaW5lZCB8IFZlY3RvciB7XHJcbiAgICAvLyBDaGVjayBpZiBub25lIG9mIHRoZSBsaW5lcyBhcmUgb2YgbGVuZ3RoIDBcclxuICAgIGlmICgoZWRnZTEucDEueCA9PT0gZWRnZTEucDIueCAmJiBlZGdlMS5wMS55ID09PSBlZGdlMS5wMi55KSB8fCAoZWRnZTIucDEueCA9PT0gZWRnZTIucDIueCAmJiBlZGdlMi5wMS55ID09PSBlZGdlMi5wMi55KSkge1xyXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IGRlbm9taW5hdG9yOiBudW1iZXIgPSAoZWRnZTIucDIueSAtIGVkZ2UyLnAxLnkpICogKGVkZ2UxLnAyLnggLSBlZGdlMS5wMS54KSAtIChlZGdlMi5wMi54IC0gZWRnZTIucDEueCkgKiAoZWRnZTEucDIueSAtIGVkZ2UxLnAxLnkpO1xyXG5cclxuICAgIC8vIExpbmVzIGFyZSBwYXJhbGxlbFxyXG4gICAgaWYgKGRlbm9taW5hdG9yID09PSAwKSB7XHJcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgdWEgPSAoKGVkZ2UyLnAyLnggLSBlZGdlMi5wMS54KSAqIChlZGdlMS5wMS55IC0gZWRnZTIucDEueSkgLSAoZWRnZTIucDIueSAtIGVkZ2UyLnAxLnkpICogKGVkZ2UxLnAxLnggLSBlZGdlMi5wMS54KSkgLyBkZW5vbWluYXRvcjtcclxuICAgIGxldCB1YiA9ICgoZWRnZTEucDIueCAtIGVkZ2UxLnAxLngpICogKGVkZ2UxLnAxLnkgLSBlZGdlMi5wMS55KSAtIChlZGdlMS5wMi55IC0gZWRnZTEucDEueSkgKiAoZWRnZTEucDEueCAtIGVkZ2UyLnAxLngpKSAvIGRlbm9taW5hdG9yO1xyXG5cclxuICAgIC8vIGlzIHRoZSBpbnRlcnNlY3Rpb24gYWxvbmcgdGhlIHNlZ21lbnRzXHJcbiAgICBpZiAodWEgPCAwIHx8IHVhID4gMSB8fCB1YiA8IDAgfHwgdWIgPiAxKSB7XHJcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBSZXR1cm4gYSBvYmplY3Qgd2l0aCB0aGUgeCBhbmQgeSBjb29yZGluYXRlcyBvZiB0aGUgaW50ZXJzZWN0aW9uXHJcbiAgICBsZXQgeCA9IGVkZ2UxLnAxLnggKyB1YSAqIChlZGdlMS5wMi54IC0gZWRnZTEucDEueCk7XHJcbiAgICBsZXQgeSA9IGVkZ2UxLnAxLnkgKyB1YSAqIChlZGdlMS5wMi55IC0gZWRnZTEucDEueSk7XHJcblxyXG4gICAgcmV0dXJuIHsgeCwgeSB9O1xyXG59XHJcbiIsImludGVyZmFjZSBJTGlua2VkTGlzdDxUPiB7XHJcbiAgICBpbnNlcnRBdEJlZ2luKGRhdGE6IFQpOiBOb2RlPFQ+O1xyXG4gICAgaW5zZXJ0QXRFbmQoZGF0YTogVCk6IE5vZGU8VD47XHJcbiAgICBkZWxldGVGaXJzdCgpOiB2b2lkO1xyXG4gICAgZGVsZXRlTGFzdCgpOiB2b2lkO1xyXG4gICAgdHJhdmVyc2UoKTogVFtdO1xyXG4gICAgc2l6ZSgpOiBudW1iZXI7XHJcbiAgICBzZWFyY2goY29tcGFyYXRvcjogKGRhdGE6IFQpID0+IGJvb2xlYW4pOiBOb2RlPFQ+IHwgbnVsbDtcclxufVxyXG5leHBvcnQgY2xhc3MgTGlua2VkTGlzdDxUPiBpbXBsZW1lbnRzIElMaW5rZWRMaXN0PFQ+IHtcclxuICAgIHB1YmxpYyBoZWFkOiBOb2RlPFQ+IHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgcHVibGljIGlmRW1wdHkoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuICF0aGlzLmhlYWQgPyB0cnVlIDogZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGluc2VydEF0RW5kKGRhdGE6IFQpOiBOb2RlPFQ+IHtcclxuICAgICAgICBjb25zdCBub2RlID0gbmV3IE5vZGUoZGF0YSk7XHJcbiAgICAgICAgaWYgKCF0aGlzLmhlYWQpIHtcclxuICAgICAgICAgICAgdGhpcy5oZWFkID0gbm9kZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCBnZXRMYXN0ID0gKG5vZGU6IE5vZGU8VD4pOiBOb2RlPFQ+ID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBub2RlLm5leHQgPyBnZXRMYXN0KG5vZGUubmV4dCkgOiBub2RlO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgY29uc3QgbGFzdE5vZGUgPSBnZXRMYXN0KHRoaXMuaGVhZCk7XHJcbiAgICAgICAgICAgIGxhc3ROb2RlLm5leHQgPSBub2RlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbm9kZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgaW5zZXJ0QXRCZWdpbihkYXRhOiBUKTogTm9kZTxUPiB7XHJcbiAgICAgICAgY29uc3Qgbm9kZSA9IG5ldyBOb2RlKGRhdGEpO1xyXG4gICAgICAgIGlmICghdGhpcy5oZWFkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaGVhZCA9IG5vZGU7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbm9kZS5uZXh0ID0gdGhpcy5oZWFkO1xyXG4gICAgICAgICAgICB0aGlzLmhlYWQgPSBub2RlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbm9kZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZGVsZXRlRmlyc3QoKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHRoaXMuaGVhZCkge1xyXG4gICAgICAgICAgICB0aGlzLmhlYWQgPSB0aGlzLmhlYWQubmV4dDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRlbGV0ZUxhc3QoKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHRoaXMuaGVhZCkge1xyXG4gICAgICAgICAgICB2YXIgbm9kZTogTm9kZTxUPiA9IHRoaXMuaGVhZDtcclxuICAgICAgICAgICAgd2hpbGUgKG5vZGUubmV4dCAhPT0gbnVsbCAmJiBub2RlLm5leHQubmV4dCAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgbm9kZSA9IG5vZGUubmV4dDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBub2RlLm5leHQgPSBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2VhcmNoKGNvbXBhcmF0b3I6IChkYXRhOiBUKSA9PiBib29sZWFuKTogTm9kZTxUPiB8IG51bGwge1xyXG4gICAgICAgIGNvbnN0IGNoZWNrTmV4dCA9IChub2RlOiBOb2RlPFQ+KTogTm9kZTxUPiB8IG51bGwgPT4ge1xyXG4gICAgICAgICAgICBpZiAoY29tcGFyYXRvcihub2RlLmRhdGEpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbm9kZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbm9kZS5uZXh0ID8gY2hlY2tOZXh0KG5vZGUubmV4dCkgOiBudWxsO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmhlYWQgPyBjaGVja05leHQodGhpcy5oZWFkKSA6IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHRyYXZlcnNlKCk6IFRbXSB7XHJcbiAgICAgICAgY29uc3QgYXJyYXk6IFRbXSA9IFtdO1xyXG4gICAgICAgIGlmICghdGhpcy5oZWFkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBhcnJheTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGFkZFRvQXJyYXkgPSAobm9kZTogTm9kZTxUPik6IFRbXSA9PiB7XHJcbiAgICAgICAgICAgIGFycmF5LnB1c2gobm9kZS5kYXRhKTtcclxuICAgICAgICAgICAgcmV0dXJuIG5vZGUubmV4dCA/IGFkZFRvQXJyYXkobm9kZS5uZXh0KSA6IGFycmF5O1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIGFkZFRvQXJyYXkodGhpcy5oZWFkKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2l6ZSgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnRyYXZlcnNlKCkubGVuZ3RoO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydCBjbGFzcyBOb2RlPFQ+IHtcclxuICAgIHB1YmxpYyBuZXh0OiBOb2RlPFQ+IHwgbnVsbCA9IG51bGw7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgZGF0YTogVCkge31cclxufVxyXG4iLCJpbXBvcnQgeyBHYW1lIH0gZnJvbSBcIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9nYW1lXCI7XHJcbmltcG9ydCB7IGFzc2V0TWFuYWdlciB9IGZyb20gXCIuLi8uLi8uLi8uLi8uLi9jbGllbnQvZ2FtZVJlbmRlci9hc3NldG1hbmFnZXJcIjtcclxuaW1wb3J0IHsgZmluZEFuZ2xlLCByb3RhdGVTaGFwZSB9IGZyb20gXCIuLi8uLi8uLi8uLi8uLi9maW5kQW5nbGVcIjtcclxuaW1wb3J0IHsgVmVjdG9yIH0gZnJvbSBcIi4uLy4uLy4uLy4uLy4uL3ZlY3RvclwiO1xyXG5pbXBvcnQgeyBBY3RvclR5cGUgfSBmcm9tIFwiLi4vLi4vLi4vLi4vbmV3QWN0b3JzL2FjdG9yXCI7XHJcbmltcG9ydCB7IENsaWVudERhZ2dlcnMgfSBmcm9tIFwiLi4vLi4vLi4vLi4vbmV3QWN0b3JzL2NsaWVudEFjdG9ycy9jbGllbnRQbGF5ZXIvY2xpZW50Q2xhc3Nlcy9jbGllbnREYWdnZXJzXCI7XHJcbmltcG9ydCB7IERhZ2dlcnNDb250cm9sbGVyIH0gZnJvbSBcIi4uLy4uL2RhZ2dlcnNDb250cm9sbGVyXCI7XHJcbmltcG9ydCB7IFBsYXllclByZXNzQWJpbGl0eSB9IGZyb20gXCIuLi9wbGF5ZXJQcmVzc0FiaWxpdHlcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBEYWdnZXJzTHVuZ2VBYmlsaXR5IGV4dGVuZHMgUGxheWVyUHJlc3NBYmlsaXR5IHtcclxuICAgIGNvbnN0cnVjdG9yKGdhbWU6IEdhbWUsIHByb3RlY3RlZCByZWFkb25seSBwbGF5ZXI6IENsaWVudERhZ2dlcnMsIHByb3RlY3RlZCByZWFkb25seSBjb250cm9sbGVyOiBEYWdnZXJzQ29udHJvbGxlciwgYWJpbGl0eUFycmF5SW5kZXg6IG51bWJlcikge1xyXG4gICAgICAgIHN1cGVyKFxyXG4gICAgICAgICAgICBnYW1lLFxyXG4gICAgICAgICAgICBwbGF5ZXIsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXIsXHJcbiAgICAgICAgICAgIERhZ2dlcnNMdW5nZUFiaWxpdHlEYXRhLmNvb2xkb3duICsgMCxcclxuICAgICAgICAgICAgYXNzZXRNYW5hZ2VyLmltYWdlc1tcImx1bmdlSWNvblwiXSxcclxuICAgICAgICAgICAgRGFnZ2Vyc0x1bmdlQWJpbGl0eURhdGEudG90YWxDYXN0VGltZSArIDAsXHJcbiAgICAgICAgICAgIGFiaWxpdHlBcnJheUluZGV4LFxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgYXR0ZW1wdEZ1bmMoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKHRoaXMuY29vbGRvd24gPT09IDApIHJldHVybiB0cnVlO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBwcmVzc0Z1bmMoZ2xvYmFsTW91c2VQb3M6IFZlY3Rvcikge1xyXG4gICAgICAgIHRoaXMuY29udHJvbGxlci5zZXRDdXJyZW50Q2FzdGluZ0FiaWxpdHkodGhpcy5hYmlsaXR5QXJyYXlJbmRleCk7XHJcbiAgICAgICAgdGhpcy5jb29sZG93biA9IHRoaXMudG90YWxDb29sZG93biArIDA7XHJcbiAgICAgICAgdGhpcy5hbmdsZSA9IGZpbmRBbmdsZSh0aGlzLnBsYXllci5wb3NpdGlvbiwgZ2xvYmFsTW91c2VQb3MpO1xyXG4gICAgICAgIHRoaXMuY2FzdGluZyA9IHRydWU7XHJcbiAgICAgICAgLy9ubyBzdXBlciBjYWxsIGJlY2F1c2UgaXQgZG9lc24ndCBzZXQgdGhlIGdsb2JhbCBjb29sZG93blxyXG5cclxuICAgICAgICB0aGlzLnBsYXllci5wZXJmb3JtQ2xpZW50QWJpbGl0eVtcImx1bmdlXCJdKGdsb2JhbE1vdXNlUG9zKTtcclxuICAgICAgICB0aGlzLmNvbnRyb2xsZXIuc2VuZFNlcnZlckRhZ2dlcnNBYmlsaXR5KFwibHVuZ2VcIiwgdHJ1ZSwgZ2xvYmFsTW91c2VQb3MpO1xyXG4gICAgfVxyXG5cclxuICAgIGNhc3RVcGRhdGVGdW5jKGVsYXBzZWRUaW1lOiBudW1iZXIpIHtcclxuICAgICAgICBzdXBlci5jYXN0VXBkYXRlRnVuYyhlbGFwc2VkVGltZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldEljb25Db29sZG93blBlcmNlbnQoKTogbnVtYmVyIHtcclxuICAgICAgICBpZiAodGhpcy5jb29sZG93biAhPT0gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jb29sZG93biAvIHRoaXMudG90YWxDb29sZG93bjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IERhZ2dlcnNMdW5nZUFiaWxpdHlEYXRhID0ge1xyXG4gICAgY29vbGRvd246IDMsXHJcbiAgICB0b3RhbENhc3RUaW1lOiAwLjIsXHJcbn07XHJcbiIsImltcG9ydCB7IEdhbWUgfSBmcm9tIFwiLi4vLi4vLi4vLi4vLi4vY2xpZW50L2dhbWVcIjtcclxuaW1wb3J0IHsgYXNzZXRNYW5hZ2VyIH0gZnJvbSBcIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9nYW1lUmVuZGVyL2Fzc2V0bWFuYWdlclwiO1xyXG5pbXBvcnQgeyBmaW5kQW5nbGUsIHJvdGF0ZVNoYXBlIH0gZnJvbSBcIi4uLy4uLy4uLy4uLy4uL2ZpbmRBbmdsZVwiO1xyXG5pbXBvcnQgeyBWZWN0b3IgfSBmcm9tIFwiLi4vLi4vLi4vLi4vLi4vdmVjdG9yXCI7XHJcbmltcG9ydCB7IEFjdG9yVHlwZSB9IGZyb20gXCIuLi8uLi8uLi8uLi9uZXdBY3RvcnMvYWN0b3JcIjtcclxuaW1wb3J0IHsgQ2xpZW50RGFnZ2VycyB9IGZyb20gXCIuLi8uLi8uLi8uLi9uZXdBY3RvcnMvY2xpZW50QWN0b3JzL2NsaWVudFBsYXllci9jbGllbnRDbGFzc2VzL2NsaWVudERhZ2dlcnNcIjtcclxuaW1wb3J0IHsgRGFnZ2Vyc0NvbnRyb2xsZXIgfSBmcm9tIFwiLi4vLi4vZGFnZ2Vyc0NvbnRyb2xsZXJcIjtcclxuaW1wb3J0IHsgUGxheWVyUHJlc3NBYmlsaXR5IH0gZnJvbSBcIi4uL3BsYXllclByZXNzQWJpbGl0eVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIERhZ2dlcnNTdGFiQWJpbGl0eSBleHRlbmRzIFBsYXllclByZXNzQWJpbGl0eSB7XHJcbiAgICBjb25zdHJ1Y3RvcihnYW1lOiBHYW1lLCBwcm90ZWN0ZWQgcmVhZG9ubHkgcGxheWVyOiBDbGllbnREYWdnZXJzLCBwcm90ZWN0ZWQgcmVhZG9ubHkgY29udHJvbGxlcjogRGFnZ2Vyc0NvbnRyb2xsZXIsIGFiaWxpdHlBcnJheUluZGV4OiBudW1iZXIpIHtcclxuICAgICAgICBzdXBlcihcclxuICAgICAgICAgICAgZ2FtZSxcclxuICAgICAgICAgICAgcGxheWVyLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyLFxyXG4gICAgICAgICAgICBEYWdnZXJzU3RhYkFiaWxpdHlEYXRhLmNvb2xkb3duICsgMCxcclxuICAgICAgICAgICAgYXNzZXRNYW5hZ2VyLmltYWdlc1tcInN0YWJJY29uXCJdLFxyXG4gICAgICAgICAgICBEYWdnZXJzU3RhYkFiaWxpdHlEYXRhLnRvdGFsQ2FzdFRpbWUgKyAwLFxyXG4gICAgICAgICAgICBhYmlsaXR5QXJyYXlJbmRleCxcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIHByZXNzRnVuYyhnbG9iYWxNb3VzZVBvczogVmVjdG9yKSB7XHJcbiAgICAgICAgc3VwZXIucHJlc3NGdW5jKGdsb2JhbE1vdXNlUG9zKTtcclxuICAgICAgICB0aGlzLnBsYXllci5wZXJmb3JtQ2xpZW50QWJpbGl0eVtcInN0YWJcIl0oZ2xvYmFsTW91c2VQb3MpO1xyXG5cclxuICAgICAgICB0aGlzLmNvbnRyb2xsZXIuc2VuZFNlcnZlckRhZ2dlcnNBYmlsaXR5KFwic3RhYlwiLCB0cnVlLCBnbG9iYWxNb3VzZVBvcyk7XHJcbiAgICB9XHJcblxyXG4gICAgY2FzdFVwZGF0ZUZ1bmMoZWxhcHNlZFRpbWU6IG51bWJlcikge1xyXG4gICAgICAgIHN1cGVyLmNhc3RVcGRhdGVGdW5jKGVsYXBzZWRUaW1lKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuY2FzdFN0YWdlID4gRGFnZ2Vyc1N0YWJBYmlsaXR5RGF0YS5oaXREZXRlY3RGcmFtZSAmJiB0aGlzLmNhc3RTdGFnZSAtIGVsYXBzZWRUaW1lIDwgRGFnZ2Vyc1N0YWJBYmlsaXR5RGF0YS5oaXREZXRlY3RGcmFtZSkge1xyXG4gICAgICAgICAgICBsZXQgYWN0b3JzOiB7XHJcbiAgICAgICAgICAgICAgICBhY3RvclR5cGU6IEFjdG9yVHlwZTtcclxuICAgICAgICAgICAgICAgIGFjdG9ySWQ6IG51bWJlcjtcclxuICAgICAgICAgICAgICAgIGFuZ2xlOiBudW1iZXI7XHJcbiAgICAgICAgICAgIH1bXSA9IFtdO1xyXG5cclxuICAgICAgICAgICAgbGV0IHNoYXBlOiBWZWN0b3JbXSA9IHJvdGF0ZVNoYXBlKERhZ2dlcnNTdGFiSGl0U2hhcGUsIHRoaXMuYW5nbGUsIHRoaXMucGxheWVyLnBvc2l0aW9uLCBmYWxzZSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmdsb2JhbEFjdG9ycy5hY3RvcnMuZm9yRWFjaCgoYWN0b3IpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChhY3Rvci5nZXRBY3RvcklkKCkgIT09IHRoaXMucGxheWVyLmdldEFjdG9ySWQoKSAmJiBhY3Rvci5pZkluc2lkZUxhcmdlclNoYXBlKHNoYXBlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGFjdG9ycy5wdXNoKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWN0b3JUeXBlOiBhY3Rvci5nZXRBY3RvclR5cGUoKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWN0b3JJZDogYWN0b3IuZ2V0QWN0b3JJZCgpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhbmdsZTogdGhpcy5hbmdsZSxcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoYWN0b3JzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5nYW1lUmVuZGVyZXIuc2NyZWVuWm9vbSgxLjA2KTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5zZXJ2ZXJUYWxrZXIuc2VuZE1lc3NhZ2Uoe1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiY2xpZW50RGFnZ2Vyc01lc3NhZ2VcIixcclxuICAgICAgICAgICAgICAgICAgICBvcmlnaW5JZDogdGhpcy5wbGF5ZXIuZ2V0QWN0b3JJZCgpLFxyXG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiB0aGlzLnBsYXllci5wb3NpdGlvbixcclxuICAgICAgICAgICAgICAgICAgICBtb21lbnR1bTogdGhpcy5wbGF5ZXIubW9tZW50dW0sXHJcbiAgICAgICAgICAgICAgICAgICAgbXNnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiY2xpZW50RGFnZ2Vyc1N0YWJIaXRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWN0b3JzLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBDbGllbnREYWdnZXJzU3RhYkhpdCB7XHJcbiAgICB0eXBlOiBcImNsaWVudERhZ2dlcnNTdGFiSGl0XCI7XHJcbiAgICBhY3RvcnM6IHtcclxuICAgICAgICBhY3RvclR5cGU6IEFjdG9yVHlwZTtcclxuICAgICAgICBhY3RvcklkOiBudW1iZXI7XHJcbiAgICAgICAgYW5nbGU6IG51bWJlcjtcclxuICAgIH1bXTtcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IERhZ2dlcnNTdGFiSGl0U2hhcGU6IFZlY3RvcltdID0gW1xyXG4gICAgeyB4OiAtMTAsIHk6IC00MCB9LFxyXG4gICAgeyB4OiAxMzAsIHk6IC0zMCB9LFxyXG4gICAgeyB4OiAxMzAsIHk6IDMwIH0sXHJcbiAgICB7IHg6IC0xMCwgeTogNDAgfSxcclxuXTtcclxuXHJcbmNvbnN0IERhZ2dlcnNTdGFiQWJpbGl0eURhdGEgPSB7XHJcbiAgICBjb29sZG93bjogMC4zLFxyXG4gICAgdG90YWxDYXN0VGltZTogMC41LFxyXG4gICAgaGl0RGV0ZWN0RnJhbWU6IDAuMSxcclxufTtcclxuIiwiaW1wb3J0IHsgR2FtZSB9IGZyb20gXCIuLi8uLi8uLi8uLi9jbGllbnQvZ2FtZVwiO1xyXG5pbXBvcnQgeyBhc3NldE1hbmFnZXIgfSBmcm9tIFwiLi4vLi4vLi4vLi4vY2xpZW50L2dhbWVSZW5kZXIvYXNzZXRtYW5hZ2VyXCI7XHJcbmltcG9ydCB7IFZlY3RvciB9IGZyb20gXCIuLi8uLi8uLi8uLi92ZWN0b3JcIjtcclxuaW1wb3J0IHsgQ2xpZW50UGxheWVyIH0gZnJvbSBcIi4uLy4uLy4uL25ld0FjdG9ycy9jbGllbnRBY3RvcnMvY2xpZW50UGxheWVyL2NsaWVudFBsYXllclwiO1xyXG5pbXBvcnQgeyBDb250cm9sbGVyIH0gZnJvbSBcIi4uL2NvbnRyb2xsZXJcIjtcclxuaW1wb3J0IHsgUGxheWVyUHJlc3NBYmlsaXR5IH0gZnJvbSBcIi4vcGxheWVyUHJlc3NBYmlsaXR5XCI7XHJcblxyXG5mdW5jdGlvbiBnZXRFbXB0eUFiaWxpdHlJY29uKGluZGV4OiBudW1iZXIpOiBIVE1MSW1hZ2VFbGVtZW50IHtcclxuICAgIGlmIChpbmRleCA9PT0gMikge1xyXG4gICAgICAgIHJldHVybiBhc3NldE1hbmFnZXIuaW1hZ2VzW1wibHZsNlwiXTtcclxuICAgIH0gZWxzZSBpZiAoaW5kZXggPT09IDMpIHtcclxuICAgICAgICByZXR1cm4gYXNzZXRNYW5hZ2VyLmltYWdlc1tcImx2bDEwXCJdO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gYXNzZXRNYW5hZ2VyLmltYWdlc1tcImVtcHR5SWNvblwiXTtcclxuICAgIH1cclxufVxyXG5leHBvcnQgY2xhc3MgRW1wdHlBYmlsaXR5IGV4dGVuZHMgUGxheWVyUHJlc3NBYmlsaXR5IHtcclxuICAgIGNvbnN0cnVjdG9yKGdhbWU6IEdhbWUsIHBsYXllcjogQ2xpZW50UGxheWVyLCBjb250cm9sbGVyOiBDb250cm9sbGVyLCBhYmlsaXR5QXJyYXlJbmRleDogbnVtYmVyKSB7XHJcbiAgICAgICAgc3VwZXIoZ2FtZSwgcGxheWVyLCBjb250cm9sbGVyLCAwLCBnZXRFbXB0eUFiaWxpdHlJY29uKGFiaWxpdHlBcnJheUluZGV4KSwgMCwgYWJpbGl0eUFycmF5SW5kZXgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByZXNzRnVuYyhnbG9iYWxNb3VzZVBvczogVmVjdG9yKSB7fVxyXG4gICAgY2FzdFVwZGF0ZUZ1bmMoZWxhcHNlZFRpbWU6IG51bWJlcikge31cclxuICAgIHN0b3BGdW5jKCkge31cclxufVxyXG4iLCJpbXBvcnQgeyBHYW1lIH0gZnJvbSBcIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9nYW1lXCI7XHJcbmltcG9ydCB7IGFzc2V0TWFuYWdlciB9IGZyb20gXCIuLi8uLi8uLi8uLi8uLi9jbGllbnQvZ2FtZVJlbmRlci9hc3NldG1hbmFnZXJcIjtcclxuaW1wb3J0IHsgZmluZEFuZ2xlIH0gZnJvbSBcIi4uLy4uLy4uLy4uLy4uL2ZpbmRBbmdsZVwiO1xyXG5pbXBvcnQgeyBWZWN0b3IgfSBmcm9tIFwiLi4vLi4vLi4vLi4vLi4vdmVjdG9yXCI7XHJcbmltcG9ydCB7IENsaWVudEhhbW1lciB9IGZyb20gXCIuLi8uLi8uLi8uLi9uZXdBY3RvcnMvY2xpZW50QWN0b3JzL2NsaWVudFBsYXllci9jbGllbnRDbGFzc2VzL2NsaWVudEhhbW1lclwiO1xyXG5pbXBvcnQgeyBIYW1tZXJDb250cm9sbGVyIH0gZnJvbSBcIi4uLy4uL2hhbW1lckNvbnRyb2xsZXJcIjtcclxuaW1wb3J0IHsgUGxheWVyUHJlc3NBYmlsaXR5IH0gZnJvbSBcIi4uL3BsYXllclByZXNzQWJpbGl0eVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEhhbW1lclBvdW5kQWJpbGl0eSBleHRlbmRzIFBsYXllclByZXNzQWJpbGl0eSB7XHJcbiAgICBjb25zdHJ1Y3RvcihnYW1lOiBHYW1lLCBwcm90ZWN0ZWQgcmVhZG9ubHkgcGxheWVyOiBDbGllbnRIYW1tZXIsIHByb3RlY3RlZCByZWFkb25seSBjb250cm9sbGVyOiBIYW1tZXJDb250cm9sbGVyLCBhYmlsaXR5QXJyYXlJbmRleDogbnVtYmVyKSB7XHJcbiAgICAgICAgc3VwZXIoZ2FtZSwgcGxheWVyLCBjb250cm9sbGVyLCBIYW1tZXJQb3VuZEFiaWxpdHlEYXRhLmNvb2xkb3duICsgMCwgYXNzZXRNYW5hZ2VyLmltYWdlc1tcInBvdW5kSWNvblwiXSwgMCwgYWJpbGl0eUFycmF5SW5kZXgpO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZUZ1bmMoZWxhcHNlZFRpbWU6IG51bWJlcikge1xyXG4gICAgICAgIGlmICh0aGlzLmNhc3RTdGFnZSAhPT0gMCkgcmV0dXJuO1xyXG4gICAgICAgIHN1cGVyLnVwZGF0ZUZ1bmMoZWxhcHNlZFRpbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHByZXNzRnVuYygpIHtcclxuICAgICAgICB0aGlzLmNvbnRyb2xsZXIuc2V0Q3VycmVudENhc3RpbmdBYmlsaXR5KHRoaXMuYWJpbGl0eUFycmF5SW5kZXgpO1xyXG4gICAgICAgIHRoaXMuY29udHJvbGxlci5zZXROZWdhdGl2ZUdsb2JhbENvb2xkb3duKCk7XHJcbiAgICAgICAgdGhpcy5jb29sZG93biA9IHRoaXMudG90YWxDb29sZG93biArIDA7XHJcbiAgICAgICAgdGhpcy5jYXN0aW5nID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBjYXN0VXBkYXRlRnVuYyhlbGFwc2VkVGltZTogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucGxheWVyLmFjdG9yT2JqZWN0LnN0YW5kaW5nKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RvcEZ1bmMoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3RvcEZ1bmMoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY2FzdGluZykge1xyXG4gICAgICAgICAgICB0aGlzLmdhbWUuZ2FtZVJlbmRlcmVyLnNjcmVlblpvb20oMS4yLCAxMCk7XHJcbiAgICAgICAgICAgIHRoaXMuY29udHJvbGxlci5zZXRHbG9iYWxDb29sZG93bih0aGlzLmdsb2JhbENvb2xkb3duVGltZSAqIDIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBzdXBlci5zdG9wRnVuYygpO1xyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBIYW1tZXJQb3VuZEFiaWxpdHlEYXRhID0ge1xyXG4gICAgY29vbGRvd246IDQsXHJcbiAgICB0b3RhbFBvdW5kaW5nVGltZTogMixcclxufTtcclxuIiwiaW1wb3J0IHsgR2FtZSB9IGZyb20gXCIuLi8uLi8uLi8uLi8uLi9jbGllbnQvZ2FtZVwiO1xyXG5pbXBvcnQgeyBhc3NldE1hbmFnZXIgfSBmcm9tIFwiLi4vLi4vLi4vLi4vLi4vY2xpZW50L2dhbWVSZW5kZXIvYXNzZXRtYW5hZ2VyXCI7XHJcbmltcG9ydCB7IGZpbmRBbmdsZSB9IGZyb20gXCIuLi8uLi8uLi8uLi8uLi9maW5kQW5nbGVcIjtcclxuaW1wb3J0IHsgcm90YXRlU2hhcGUsIFZlY3RvciB9IGZyb20gXCIuLi8uLi8uLi8uLi8uLi92ZWN0b3JcIjtcclxuaW1wb3J0IHsgQWN0b3JUeXBlIH0gZnJvbSBcIi4uLy4uLy4uLy4uL25ld0FjdG9ycy9hY3RvclwiO1xyXG5pbXBvcnQgeyBDbGllbnRBY3RvciwgcmVuZGVyU2hhcGUgfSBmcm9tIFwiLi4vLi4vLi4vLi4vbmV3QWN0b3JzL2NsaWVudEFjdG9ycy9jbGllbnRBY3RvclwiO1xyXG5pbXBvcnQgeyBDbGllbnRIYW1tZXIgfSBmcm9tIFwiLi4vLi4vLi4vLi4vbmV3QWN0b3JzL2NsaWVudEFjdG9ycy9jbGllbnRQbGF5ZXIvY2xpZW50Q2xhc3Nlcy9jbGllbnRIYW1tZXJcIjtcclxuaW1wb3J0IHsgQ29udHJvbGxlciB9IGZyb20gXCIuLi8uLi9jb250cm9sbGVyXCI7XHJcbmltcG9ydCB7IEhhbW1lckNvbnRyb2xsZXIgfSBmcm9tIFwiLi4vLi4vaGFtbWVyQ29udHJvbGxlclwiO1xyXG5pbXBvcnQgeyBQbGF5ZXJQcmVzc0FiaWxpdHkgfSBmcm9tIFwiLi4vcGxheWVyUHJlc3NBYmlsaXR5XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgSGFtbWVyU3dpbmdBYmlsaXR5IGV4dGVuZHMgUGxheWVyUHJlc3NBYmlsaXR5IHtcclxuICAgIGNvbnN0cnVjdG9yKGdhbWU6IEdhbWUsIHByb3RlY3RlZCByZWFkb25seSBwbGF5ZXI6IENsaWVudEhhbW1lciwgcHJvdGVjdGVkIHJlYWRvbmx5IGNvbnRyb2xsZXI6IEhhbW1lckNvbnRyb2xsZXIsIGFiaWxpdHlBcnJheUluZGV4OiBudW1iZXIpIHtcclxuICAgICAgICBzdXBlcihcclxuICAgICAgICAgICAgZ2FtZSxcclxuICAgICAgICAgICAgcGxheWVyLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyLFxyXG4gICAgICAgICAgICBIYW1tZXJTd2luZ0FiaWxpdHlEYXRhLmNvb2xkb3duICsgMCxcclxuICAgICAgICAgICAgYXNzZXRNYW5hZ2VyLmltYWdlc1tcInN3aW5nSWNvblwiXSxcclxuICAgICAgICAgICAgSGFtbWVyU3dpbmdBYmlsaXR5RGF0YS50b3RhbENhc3RUaW1lICsgMCxcclxuICAgICAgICAgICAgYWJpbGl0eUFycmF5SW5kZXgsXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBwcmVzc0Z1bmMoZ2xvYmFsTW91c2VQb3M6IFZlY3Rvcikge1xyXG4gICAgICAgIHN1cGVyLnByZXNzRnVuYyhnbG9iYWxNb3VzZVBvcyk7XHJcbiAgICAgICAgdGhpcy5wbGF5ZXIucGVyZm9ybUNsaWVudEFiaWxpdHlbXCJzd2luZ1wiXShnbG9iYWxNb3VzZVBvcyk7XHJcblxyXG4gICAgICAgIHRoaXMuY29udHJvbGxlci5zZW5kU2VydmVySGFtbWVyQWJpbGl0eShcInN3aW5nXCIsIHRydWUsIGdsb2JhbE1vdXNlUG9zKTtcclxuICAgIH1cclxuICAgIGNhc3RVcGRhdGVGdW5jKGVsYXBzZWRUaW1lOiBudW1iZXIpIHtcclxuICAgICAgICBzdXBlci5jYXN0VXBkYXRlRnVuYyhlbGFwc2VkVGltZSk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmNhc3RTdGFnZSA+IEhhbW1lclN3aW5nQWJpbGl0eURhdGEuaGl0RGV0ZWN0RnJhbWUgJiYgdGhpcy5jYXN0U3RhZ2UgLSBlbGFwc2VkVGltZSA8IEhhbW1lclN3aW5nQWJpbGl0eURhdGEuaGl0RGV0ZWN0RnJhbWUpIHtcclxuICAgICAgICAgICAgbGV0IGFjdG9yczoge1xyXG4gICAgICAgICAgICAgICAgYWN0b3JUeXBlOiBBY3RvclR5cGU7XHJcbiAgICAgICAgICAgICAgICBhY3RvcklkOiBudW1iZXI7XHJcbiAgICAgICAgICAgICAgICBhbmdsZTogbnVtYmVyO1xyXG4gICAgICAgICAgICB9W10gPSBbXTtcclxuXHJcbiAgICAgICAgICAgIGxldCBzaGFwZTogVmVjdG9yW10gPSByb3RhdGVTaGFwZShIYW1tZXJTd2luZ0hpdFNoYXBlLCB0aGlzLmFuZ2xlLCB0aGlzLnBsYXllci5wb3NpdGlvbiwgZmFsc2UpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5nbG9iYWxBY3RvcnMuYWN0b3JzLmZvckVhY2goKGFjdG9yKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYWN0b3IuZ2V0QWN0b3JJZCgpICE9PSB0aGlzLnBsYXllci5nZXRBY3RvcklkKCkgJiYgYWN0b3IuaWZJbnNpZGVMYXJnZXJTaGFwZShzaGFwZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBhY3RvcnMucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjdG9yVHlwZTogYWN0b3IuZ2V0QWN0b3JUeXBlKCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjdG9ySWQ6IGFjdG9yLmdldEFjdG9ySWQoKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYW5nbGU6IHRoaXMuYW5nbGUsXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaWYgKGFjdG9ycy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWUuZ2FtZVJlbmRlcmVyLnNjcmVlblpvb20oMS4xLCA3KTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5zZXJ2ZXJUYWxrZXIuc2VuZE1lc3NhZ2Uoe1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiY2xpZW50SGFtbWVyTWVzc2FnZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIG9yaWdpbklkOiB0aGlzLnBsYXllci5nZXRBY3RvcklkKCksXHJcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IHRoaXMucGxheWVyLnBvc2l0aW9uLFxyXG4gICAgICAgICAgICAgICAgICAgIG1vbWVudHVtOiB0aGlzLnBsYXllci5tb21lbnR1bSxcclxuICAgICAgICAgICAgICAgICAgICBtc2c6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJjbGllbnRIYW1tZXJTd2luZ0hpdFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhY3RvcnMsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIENsaWVudEhhbW1lclN3aW5nSGl0IHtcclxuICAgIHR5cGU6IFwiY2xpZW50SGFtbWVyU3dpbmdIaXRcIjtcclxuICAgIGFjdG9yczoge1xyXG4gICAgICAgIGFjdG9yVHlwZTogQWN0b3JUeXBlO1xyXG4gICAgICAgIGFjdG9ySWQ6IG51bWJlcjtcclxuICAgICAgICBhbmdsZTogbnVtYmVyO1xyXG4gICAgfVtdO1xyXG59XHJcblxyXG5leHBvcnQgY29uc3QgSGFtbWVyU3dpbmdIaXRTaGFwZTogVmVjdG9yW10gPSBbXHJcbiAgICB7IHg6IC0xMCwgeTogLTMwIH0sXHJcbiAgICB7IHg6IDcsIHk6IC04MCB9LFxyXG4gICAgeyB4OiAxMDAsIHk6IC01NSB9LFxyXG4gICAgeyB4OiAxMTAsIHk6IDIwIH0sXHJcbiAgICB7IHg6IDc1LCB5OiA1NSB9LFxyXG4gICAgeyB4OiAxMCwgeTogNzAgfSxcclxuXTtcclxuXHJcbmNvbnN0IEhhbW1lclN3aW5nQWJpbGl0eURhdGEgPSB7XHJcbiAgICBjb29sZG93bjogMC41LFxyXG4gICAgdG90YWxDYXN0VGltZTogMC44LFxyXG4gICAgaGl0RGV0ZWN0RnJhbWU6IDAuMixcclxufTtcclxuIiwiaW1wb3J0IHsgR2FtZSwgR2xvYmFsQ2xpZW50QWN0b3JzIH0gZnJvbSBcIi4uLy4uLy4uLy4uL2NsaWVudC9nYW1lXCI7XHJcbmltcG9ydCB7IFZlY3RvciB9IGZyb20gXCIuLi8uLi8uLi8uLi92ZWN0b3JcIjtcclxuaW1wb3J0IHsgZGVmYXVsdEFjdG9yQ29uZmlnIH0gZnJvbSBcIi4uLy4uLy4uL25ld0FjdG9ycy9hY3RvckNvbmZpZ1wiO1xyXG5pbXBvcnQgeyBDbGllbnRQbGF5ZXIgfSBmcm9tIFwiLi4vLi4vLi4vbmV3QWN0b3JzL2NsaWVudEFjdG9ycy9jbGllbnRQbGF5ZXIvY2xpZW50UGxheWVyXCI7XHJcbmltcG9ydCB7IENvbnRyb2xsZXIgfSBmcm9tIFwiLi4vY29udHJvbGxlclwiO1xyXG5cclxuZXhwb3J0IHR5cGUgUGxheWVyQWJpbGl0eVR5cGUgPSBcInByZXNzXCIgfCBcImhvbGRcIjtcclxuXHJcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBQbGF5ZXJBYmlsaXR5IHtcclxuICAgIHB1YmxpYyBhYnN0cmFjdCB0eXBlOiBQbGF5ZXJBYmlsaXR5VHlwZTtcclxuXHJcbiAgICBwdWJsaWMgY29vbGRvd246IG51bWJlciA9IDA7XHJcbiAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgZ2xvYmFsQ29vbGRvd25UaW1lOiBudW1iZXI7XHJcblxyXG4gICAgcHJvdGVjdGVkIGNhc3RTdGFnZTogbnVtYmVyID0gMDtcclxuICAgIHByb3RlY3RlZCBjYXN0aW5nOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgcHJvdGVjdGVkIGdsb2JhbEFjdG9yczogR2xvYmFsQ2xpZW50QWN0b3JzO1xyXG5cclxuICAgIHByb3RlY3RlZCBhbmdsZTogbnVtYmVyID0gMDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSB0b3RhbENhc3RUaW1lIGlzIHJlZmVyZW5jZWQgYnkgdGhlIGFiaWxpdHkgdG8ga25vdyB3aGVuIHRvIGNhbGwgc3RvcEZ1bmMgb3IgcmVsZWFzZUZ1bmNcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgcHJvdGVjdGVkIHJlYWRvbmx5IGdhbWU6IEdhbWUsXHJcbiAgICAgICAgcHJvdGVjdGVkIHJlYWRvbmx5IHBsYXllcjogQ2xpZW50UGxheWVyLFxyXG4gICAgICAgIHByb3RlY3RlZCByZWFkb25seSBjb250cm9sbGVyOiBDb250cm9sbGVyLFxyXG4gICAgICAgIHB1YmxpYyByZWFkb25seSB0b3RhbENvb2xkb3duOiBudW1iZXIsXHJcbiAgICAgICAgcHVibGljIGltZzogSFRNTEltYWdlRWxlbWVudCxcclxuICAgICAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgdG90YWxDYXN0VGltZTogbnVtYmVyLFxyXG4gICAgICAgIHByb3RlY3RlZCByZWFkb25seSBhYmlsaXR5QXJyYXlJbmRleDogbnVtYmVyLFxyXG4gICAgKSB7XHJcbiAgICAgICAgdGhpcy5nbG9iYWxBY3RvcnMgPSB0aGlzLmdhbWUuZ2V0R2xvYmFsQWN0b3JzKCk7XHJcblxyXG4gICAgICAgIHRoaXMuZ2xvYmFsQ29vbGRvd25UaW1lID0gZGVmYXVsdEFjdG9yQ29uZmlnLmdsb2JhbENvb2xkb3duO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhdHRlbXB0RnVuYygpOiBib29sZWFuIHtcclxuICAgICAgICBpZiAodGhpcy5jb250cm9sbGVyLmdsb2JhbENvb2xkb3duID09PSAwICYmIHRoaXMuY29vbGRvd24gPT09IDApIHJldHVybiB0cnVlO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIHB1YmxpYyB1cGRhdGVGdW5jKGVsYXBzZWRUaW1lOiBudW1iZXIpIHtcclxuICAgICAgICBpZiAodGhpcy5jb29sZG93biA+IDApIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY29vbGRvd24gPiB0aGlzLnRvdGFsQ29vbGRvd24pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29vbGRvd24gPSB0aGlzLnRvdGFsQ29vbGRvd24gKyAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuY29vbGRvd24gLT0gZWxhcHNlZFRpbWU7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNvb2xkb3duIDwgMCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb29sZG93biA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgcHJlc3NGdW5jKGdsb2JhbE1vdXNlUG9zOiBWZWN0b3IpOiB2b2lkO1xyXG4gICAgcHVibGljIGFic3RyYWN0IGNhc3RVcGRhdGVGdW5jKGVsYXBzZWRUaW1lOiBudW1iZXIpOiB2b2lkO1xyXG4gICAgcHVibGljIGFic3RyYWN0IHN0b3BGdW5jKCk6IHZvaWQ7XHJcblxyXG4gICAgcHJvdGVjdGVkIHJlc2V0QWJpbGl0eSgpIHtcclxuICAgICAgICB0aGlzLmNhc3RTdGFnZSA9IDA7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldEljb25Db29sZG93blBlcmNlbnQoKTogbnVtYmVyIHtcclxuICAgICAgICBpZiAodGhpcy5jb250cm9sbGVyLmdsb2JhbENvb2xkb3duIDwgMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gMTtcclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuY29vbGRvd24gIT09IDAgfHwgdGhpcy5jb250cm9sbGVyLmdsb2JhbENvb2xkb3duICE9PSAwKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNvbnRyb2xsZXIuZ2xvYmFsQ29vbGRvd24gPiB0aGlzLmNvb2xkb3duKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jb250cm9sbGVyLmdsb2JhbENvb2xkb3duIC8gZGVmYXVsdEFjdG9yQ29uZmlnLmdsb2JhbENvb2xkb3duO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29vbGRvd24gLyB0aGlzLnRvdGFsQ29vbGRvd247XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgR2FtZSB9IGZyb20gXCIuLi8uLi8uLi8uLi9jbGllbnQvZ2FtZVwiO1xyXG5pbXBvcnQgeyBWZWN0b3IgfSBmcm9tIFwiLi4vLi4vLi4vLi4vdmVjdG9yXCI7XHJcbmltcG9ydCB7IENsaWVudFBsYXllciB9IGZyb20gXCIuLi8uLi8uLi9uZXdBY3RvcnMvY2xpZW50QWN0b3JzL2NsaWVudFBsYXllci9jbGllbnRQbGF5ZXJcIjtcclxuaW1wb3J0IHsgQ29udHJvbGxlciB9IGZyb20gXCIuLi9jb250cm9sbGVyXCI7XHJcbmltcG9ydCB7IFBsYXllckFiaWxpdHksIFBsYXllckFiaWxpdHlUeXBlIH0gZnJvbSBcIi4vcGxheWVyQWJpbGl0eVwiO1xyXG5cclxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFBsYXllckhvbGRBYmlsaXR5IGV4dGVuZHMgUGxheWVyQWJpbGl0eSB7XHJcbiAgICB0eXBlOiBQbGF5ZXJBYmlsaXR5VHlwZSA9IFwiaG9sZFwiO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIGdhbWU6IEdhbWUsXHJcbiAgICAgICAgcGxheWVyOiBDbGllbnRQbGF5ZXIsXHJcbiAgICAgICAgY29udHJvbGxlcjogQ29udHJvbGxlcixcclxuICAgICAgICB0b3RhbENvb2xkb3duOiBudW1iZXIsXHJcbiAgICAgICAgaW1nOiBIVE1MSW1hZ2VFbGVtZW50LFxyXG4gICAgICAgIHRvdGFsQ2FzdFRpbWU6IG51bWJlcixcclxuICAgICAgICBhYmlsaXR5QXJyYXlJbmRleDogbnVtYmVyLFxyXG4gICAgKSB7XHJcbiAgICAgICAgc3VwZXIoZ2FtZSwgcGxheWVyLCBjb250cm9sbGVyLCB0b3RhbENvb2xkb3duLCBpbWcsIHRvdGFsQ2FzdFRpbWUsIGFiaWxpdHlBcnJheUluZGV4KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgcmVsZWFzZUZ1bmMoKTogdm9pZDtcclxuICAgIHB1YmxpYyB1cGRhdGVGdW5jKGVsYXBzZWRUaW1lOiBudW1iZXIpIHtcclxuICAgICAgICBpZiAodGhpcy5jYXN0U3RhZ2UgIT09IDApIHJldHVybjtcclxuICAgICAgICBzdXBlci51cGRhdGVGdW5jKGVsYXBzZWRUaW1lKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBHYW1lIH0gZnJvbSBcIi4uLy4uLy4uLy4uL2NsaWVudC9nYW1lXCI7XHJcbmltcG9ydCB7IGZpbmRBbmdsZSB9IGZyb20gXCIuLi8uLi8uLi8uLi9maW5kQW5nbGVcIjtcclxuaW1wb3J0IHsgVmVjdG9yIH0gZnJvbSBcIi4uLy4uLy4uLy4uL3ZlY3RvclwiO1xyXG5pbXBvcnQgeyBDbGllbnRQbGF5ZXIgfSBmcm9tIFwiLi4vLi4vLi4vbmV3QWN0b3JzL2NsaWVudEFjdG9ycy9jbGllbnRQbGF5ZXIvY2xpZW50UGxheWVyXCI7XHJcbmltcG9ydCB7IENvbnRyb2xsZXIgfSBmcm9tIFwiLi4vY29udHJvbGxlclwiO1xyXG5pbXBvcnQgeyBQbGF5ZXJBYmlsaXR5LCBQbGF5ZXJBYmlsaXR5VHlwZSB9IGZyb20gXCIuL3BsYXllckFiaWxpdHlcIjtcclxuXHJcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBQbGF5ZXJQcmVzc0FiaWxpdHkgZXh0ZW5kcyBQbGF5ZXJBYmlsaXR5IHtcclxuICAgIHR5cGU6IFBsYXllckFiaWxpdHlUeXBlID0gXCJwcmVzc1wiO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIGdhbWU6IEdhbWUsXHJcbiAgICAgICAgcGxheWVyOiBDbGllbnRQbGF5ZXIsXHJcbiAgICAgICAgY29udHJvbGxlcjogQ29udHJvbGxlcixcclxuICAgICAgICB0b3RhbENvb2xkb3duOiBudW1iZXIsXHJcbiAgICAgICAgaW1nOiBIVE1MSW1hZ2VFbGVtZW50LFxyXG4gICAgICAgIHRvdGFsQ2FzdFRpbWU6IG51bWJlcixcclxuICAgICAgICBhYmlsaXR5QXJyYXlJbmRleDogbnVtYmVyLFxyXG4gICAgKSB7XHJcbiAgICAgICAgc3VwZXIoZ2FtZSwgcGxheWVyLCBjb250cm9sbGVyLCB0b3RhbENvb2xkb3duLCBpbWcsIHRvdGFsQ2FzdFRpbWUsIGFiaWxpdHlBcnJheUluZGV4KTtcclxuICAgIH1cclxuICAgIHByZXNzRnVuYyhnbG9iYWxNb3VzZVBvczogVmVjdG9yKSB7XHJcbiAgICAgICAgdGhpcy5jb250cm9sbGVyLnNldEN1cnJlbnRDYXN0aW5nQWJpbGl0eSh0aGlzLmFiaWxpdHlBcnJheUluZGV4KTtcclxuICAgICAgICB0aGlzLmNvbnRyb2xsZXIuc2V0R2xvYmFsQ29vbGRvd24odGhpcy5nbG9iYWxDb29sZG93blRpbWUpO1xyXG4gICAgICAgIHRoaXMuY29vbGRvd24gPSB0aGlzLnRvdGFsQ29vbGRvd24gKyAwO1xyXG4gICAgICAgIHRoaXMuYW5nbGUgPSBmaW5kQW5nbGUodGhpcy5wbGF5ZXIucG9zaXRpb24sIGdsb2JhbE1vdXNlUG9zKTtcclxuICAgICAgICB0aGlzLmNhc3RpbmcgPSB0cnVlO1xyXG4gICAgfVxyXG4gICAgY2FzdFVwZGF0ZUZ1bmMoZWxhcHNlZFRpbWU6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuY2FzdFN0YWdlICs9IGVsYXBzZWRUaW1lO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5jYXN0U3RhZ2UgPj0gdGhpcy50b3RhbENhc3RUaW1lKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RvcEZ1bmMoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBzdG9wRnVuYygpIHtcclxuICAgICAgICBpZiAodGhpcy5jYXN0aW5nKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29udHJvbGxlci5yZXNldEN1cnJlbnRDYXN0aW5nQWJpbGl0eSgpO1xyXG4gICAgICAgICAgICB0aGlzLnJlc2V0QWJpbGl0eSgpO1xyXG4gICAgICAgICAgICB0aGlzLmNhc3RpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5hbmdsZSA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IEdhbWUgfSBmcm9tIFwiLi4vLi4vLi4vLi4vLi4vY2xpZW50L2dhbWVcIjtcclxuaW1wb3J0IHsgYXNzZXRNYW5hZ2VyIH0gZnJvbSBcIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9nYW1lUmVuZGVyL2Fzc2V0bWFuYWdlclwiO1xyXG5pbXBvcnQgeyBmaW5kQW5nbGUgfSBmcm9tIFwiLi4vLi4vLi4vLi4vLi4vZmluZEFuZ2xlXCI7XHJcbmltcG9ydCB7IHJvdGF0ZVNoYXBlLCBWZWN0b3IgfSBmcm9tIFwiLi4vLi4vLi4vLi4vLi4vdmVjdG9yXCI7XHJcbmltcG9ydCB7IEFjdG9yVHlwZSB9IGZyb20gXCIuLi8uLi8uLi8uLi9uZXdBY3RvcnMvYWN0b3JcIjtcclxuaW1wb3J0IHsgQ2xpZW50QWN0b3IsIHJlbmRlclNoYXBlIH0gZnJvbSBcIi4uLy4uLy4uLy4uL25ld0FjdG9ycy9jbGllbnRBY3RvcnMvY2xpZW50QWN0b3JcIjtcclxuaW1wb3J0IHsgQ2xpZW50U3dvcmQgfSBmcm9tIFwiLi4vLi4vLi4vLi4vbmV3QWN0b3JzL2NsaWVudEFjdG9ycy9jbGllbnRQbGF5ZXIvY2xpZW50Q2xhc3Nlcy9jbGllbnRTd29yZFwiO1xyXG5pbXBvcnQgeyBDb250cm9sbGVyIH0gZnJvbSBcIi4uLy4uL2NvbnRyb2xsZXJcIjtcclxuaW1wb3J0IHsgU3dvcmRDb250cm9sbGVyIH0gZnJvbSBcIi4uLy4uL3N3b3JkQ29udHJvbGxlclwiO1xyXG5pbXBvcnQgeyBQbGF5ZXJQcmVzc0FiaWxpdHkgfSBmcm9tIFwiLi4vcGxheWVyUHJlc3NBYmlsaXR5XCI7XHJcbmltcG9ydCB7IFN3b3JkV2hpcmxXaW5kQWJpbGl0eSB9IGZyb20gXCIuL3N3b3JkV2hpcmx3aW5kQWJpbGl0eVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFN3b3JkU2xhc2hBYmlsaXR5IGV4dGVuZHMgUGxheWVyUHJlc3NBYmlsaXR5IHtcclxuICAgIGNvbnN0cnVjdG9yKGdhbWU6IEdhbWUsIHByb3RlY3RlZCByZWFkb25seSBwbGF5ZXI6IENsaWVudFN3b3JkLCBwcm90ZWN0ZWQgcmVhZG9ubHkgY29udHJvbGxlcjogU3dvcmRDb250cm9sbGVyLCBhYmlsaXR5QXJyYXlJbmRleDogbnVtYmVyKSB7XHJcbiAgICAgICAgc3VwZXIoXHJcbiAgICAgICAgICAgIGdhbWUsXHJcbiAgICAgICAgICAgIHBsYXllcixcclxuICAgICAgICAgICAgY29udHJvbGxlcixcclxuICAgICAgICAgICAgU3dvcmRTbGFzaEFiaWxpdHlEYXRhLmNvb2xkb3duICsgMCxcclxuICAgICAgICAgICAgYXNzZXRNYW5hZ2VyLmltYWdlc1tcInNsYXNoSWNvblwiXSxcclxuICAgICAgICAgICAgU3dvcmRTbGFzaEFiaWxpdHlEYXRhLnRvdGFsQ2FzdFRpbWUgKyAwLFxyXG4gICAgICAgICAgICBhYmlsaXR5QXJyYXlJbmRleCxcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIHByZXNzRnVuYyhnbG9iYWxNb3VzZVBvczogVmVjdG9yKSB7XHJcbiAgICAgICAgc3VwZXIucHJlc3NGdW5jKGdsb2JhbE1vdXNlUG9zKTtcclxuICAgICAgICB0aGlzLnBsYXllci5wZXJmb3JtQ2xpZW50QWJpbGl0eVtcInNsYXNoXCJdKGdsb2JhbE1vdXNlUG9zKTtcclxuXHJcbiAgICAgICAgdGhpcy5jb250cm9sbGVyLnNlbmRTZXJ2ZXJTd29yZEFiaWxpdHkoXCJzbGFzaFwiLCB0cnVlLCBnbG9iYWxNb3VzZVBvcyk7XHJcbiAgICB9XHJcbiAgICBjYXN0VXBkYXRlRnVuYyhlbGFwc2VkVGltZTogbnVtYmVyKSB7XHJcbiAgICAgICAgc3VwZXIuY2FzdFVwZGF0ZUZ1bmMoZWxhcHNlZFRpbWUpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5jYXN0U3RhZ2UgPiBTd29yZFNsYXNoQWJpbGl0eURhdGEuaGl0RGV0ZWN0RnJhbWUgJiYgdGhpcy5jYXN0U3RhZ2UgLSBlbGFwc2VkVGltZSA8IFN3b3JkU2xhc2hBYmlsaXR5RGF0YS5oaXREZXRlY3RGcmFtZSkge1xyXG4gICAgICAgICAgICBsZXQgYWN0b3JzOiB7XHJcbiAgICAgICAgICAgICAgICBhY3RvclR5cGU6IEFjdG9yVHlwZTtcclxuICAgICAgICAgICAgICAgIGFjdG9ySWQ6IG51bWJlcjtcclxuICAgICAgICAgICAgICAgIGFuZ2xlOiBudW1iZXI7XHJcbiAgICAgICAgICAgIH1bXSA9IFtdO1xyXG5cclxuICAgICAgICAgICAgbGV0IHNoYXBlOiBWZWN0b3JbXSA9IHJvdGF0ZVNoYXBlKFN3b3JkU2xhc2hIaXRTaGFwZSwgdGhpcy5hbmdsZSwgdGhpcy5wbGF5ZXIucG9zaXRpb24sIGZhbHNlKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuZ2xvYmFsQWN0b3JzLmFjdG9ycy5mb3JFYWNoKChhY3RvcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGFjdG9yLmdldEFjdG9ySWQoKSAhPT0gdGhpcy5wbGF5ZXIuZ2V0QWN0b3JJZCgpICYmIGFjdG9yLmlmSW5zaWRlTGFyZ2VyU2hhcGUoc2hhcGUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWN0b3JzLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhY3RvclR5cGU6IGFjdG9yLmdldEFjdG9yVHlwZSgpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhY3RvcklkOiBhY3Rvci5nZXRBY3RvcklkKCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFuZ2xlOiB0aGlzLmFuZ2xlLFxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGlmIChhY3RvcnMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lLmdhbWVSZW5kZXJlci5zY3JlZW5ab29tKDEuMDYpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lLnNlcnZlclRhbGtlci5zZW5kTWVzc2FnZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJjbGllbnRTd29yZE1lc3NhZ2VcIixcclxuICAgICAgICAgICAgICAgICAgICBvcmlnaW5JZDogdGhpcy5wbGF5ZXIuZ2V0QWN0b3JJZCgpLFxyXG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiB0aGlzLnBsYXllci5wb3NpdGlvbixcclxuICAgICAgICAgICAgICAgICAgICBtb21lbnR1bTogdGhpcy5wbGF5ZXIubW9tZW50dW0sXHJcbiAgICAgICAgICAgICAgICAgICAgbXNnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiY2xpZW50U3dvcmRTbGFzaEhpdFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhY3RvcnMsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY29udHJvbGxlci5hYmlsaXR5RGF0YVsxXSBpbnN0YW5jZW9mIFN3b3JkV2hpcmxXaW5kQWJpbGl0eSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29udHJvbGxlci5hYmlsaXR5RGF0YVsxXS5jb29sZG93bi0tO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIENsaWVudFN3b3JkU2xhc2hIaXQge1xyXG4gICAgdHlwZTogXCJjbGllbnRTd29yZFNsYXNoSGl0XCI7XHJcbiAgICBhY3RvcnM6IHtcclxuICAgICAgICBhY3RvclR5cGU6IEFjdG9yVHlwZTtcclxuICAgICAgICBhY3RvcklkOiBudW1iZXI7XHJcbiAgICAgICAgYW5nbGU6IG51bWJlcjtcclxuICAgIH1bXTtcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IFN3b3JkU2xhc2hIaXRTaGFwZTogVmVjdG9yW10gPSBbXHJcbiAgICB7IHg6IC0xMCwgeTogLTMwIH0sXHJcbiAgICB7IHg6IDcsIHk6IC04MCB9LFxyXG4gICAgeyB4OiAxMDAsIHk6IC01NSB9LFxyXG4gICAgeyB4OiAxMTAsIHk6IDIwIH0sXHJcbiAgICB7IHg6IDc1LCB5OiA1NSB9LFxyXG4gICAgeyB4OiAxMCwgeTogNzAgfSxcclxuXTtcclxuXHJcbmNvbnN0IFN3b3JkU2xhc2hBYmlsaXR5RGF0YSA9IHtcclxuICAgIGNvb2xkb3duOiAwLjMsXHJcbiAgICB0b3RhbENhc3RUaW1lOiAwLjUsXHJcbiAgICBoaXREZXRlY3RGcmFtZTogMC4wNSxcclxufTtcclxuIiwiaW1wb3J0IHsgR2FtZSB9IGZyb20gXCIuLi8uLi8uLi8uLi8uLi9jbGllbnQvZ2FtZVwiO1xyXG5pbXBvcnQgeyBhc3NldE1hbmFnZXIgfSBmcm9tIFwiLi4vLi4vLi4vLi4vLi4vY2xpZW50L2dhbWVSZW5kZXIvYXNzZXRtYW5hZ2VyXCI7XHJcbmltcG9ydCB7IGZpbmRBbmdsZSB9IGZyb20gXCIuLi8uLi8uLi8uLi8uLi9maW5kQW5nbGVcIjtcclxuaW1wb3J0IHsgZmluZERpc3RhbmNlLCBWZWN0b3IgfSBmcm9tIFwiLi4vLi4vLi4vLi4vLi4vdmVjdG9yXCI7XHJcbmltcG9ydCB7IEFjdG9yVHlwZSB9IGZyb20gXCIuLi8uLi8uLi8uLi9uZXdBY3RvcnMvYWN0b3JcIjtcclxuaW1wb3J0IHsgZGVmYXVsdEFjdG9yQ29uZmlnIH0gZnJvbSBcIi4uLy4uLy4uLy4uL25ld0FjdG9ycy9hY3RvckNvbmZpZ1wiO1xyXG5pbXBvcnQgeyBDbGllbnRBY3RvciB9IGZyb20gXCIuLi8uLi8uLi8uLi9uZXdBY3RvcnMvY2xpZW50QWN0b3JzL2NsaWVudEFjdG9yXCI7XHJcbmltcG9ydCB7IENsaWVudFN3b3JkIH0gZnJvbSBcIi4uLy4uLy4uLy4uL25ld0FjdG9ycy9jbGllbnRBY3RvcnMvY2xpZW50UGxheWVyL2NsaWVudENsYXNzZXMvY2xpZW50U3dvcmRcIjtcclxuaW1wb3J0IHsgQ29udHJvbGxlciB9IGZyb20gXCIuLi8uLi9jb250cm9sbGVyXCI7XHJcbmltcG9ydCB7IFN3b3JkQ29udHJvbGxlciB9IGZyb20gXCIuLi8uLi9zd29yZENvbnRyb2xsZXJcIjtcclxuaW1wb3J0IHsgUGxheWVySG9sZEFiaWxpdHkgfSBmcm9tIFwiLi4vcGxheWVySG9sZEFiaWxpdHlcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBTd29yZFdoaXJsV2luZEFiaWxpdHkgZXh0ZW5kcyBQbGF5ZXJIb2xkQWJpbGl0eSB7XHJcbiAgICBjb25zdHJ1Y3RvcihnYW1lOiBHYW1lLCBwcm90ZWN0ZWQgcmVhZG9ubHkgcGxheWVyOiBDbGllbnRTd29yZCwgcHJvdGVjdGVkIHJlYWRvbmx5IGNvbnRyb2xsZXI6IFN3b3JkQ29udHJvbGxlciwgYWJpbGl0eUFycmF5SW5kZXg6IG51bWJlcikge1xyXG4gICAgICAgIHN1cGVyKFxyXG4gICAgICAgICAgICBnYW1lLFxyXG4gICAgICAgICAgICBwbGF5ZXIsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXIsXHJcbiAgICAgICAgICAgIFN3b3JkV2hpcmxXaW5kQWJpbGl0eURhdGEuY29vbGRvd24sXHJcbiAgICAgICAgICAgIGFzc2V0TWFuYWdlci5pbWFnZXNbXCJ3aGlybHdpbmRJY29uXCJdLFxyXG4gICAgICAgICAgICBTd29yZFdoaXJsV2luZEFiaWxpdHlEYXRhLnRvdGFsQ2FzdFRpbWUsXHJcbiAgICAgICAgICAgIGFiaWxpdHlBcnJheUluZGV4LFxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJlc3NGdW5jKGdsb2JhbE1vdXNlUG9zOiBWZWN0b3IpIHtcclxuICAgICAgICB0aGlzLmNvbnRyb2xsZXIuc2V0TmVnYXRpdmVHbG9iYWxDb29sZG93bigpO1xyXG4gICAgICAgIHRoaXMuY29udHJvbGxlci5zZXRDdXJyZW50Q2FzdGluZ0FiaWxpdHkodGhpcy5hYmlsaXR5QXJyYXlJbmRleCk7XHJcbiAgICAgICAgdGhpcy5wbGF5ZXIucGVyZm9ybUNsaWVudEFiaWxpdHlbXCJ3aGlybHdpbmRcIl0oZ2xvYmFsTW91c2VQb3MpO1xyXG4gICAgICAgIHRoaXMuY2FzdGluZyA9IHRydWU7XHJcblxyXG4gICAgICAgIHRoaXMuY29vbGRvd24gPSAzO1xyXG5cclxuICAgICAgICB0aGlzLmNvbnRyb2xsZXIuc2VuZFNlcnZlclN3b3JkQWJpbGl0eShcIndoaXJsd2luZFwiLCB0cnVlLCB7IHg6IDAsIHk6IDAgfSk7XHJcbiAgICAgICAgLy9icm9hZGNhc3Qgc3RhcnRpbmdcclxuICAgIH1cclxuICAgIGNhc3RVcGRhdGVGdW5jKGVsYXBzZWRUaW1lOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLmNhc3RTdGFnZSArPSBlbGFwc2VkVGltZTtcclxuXHJcbiAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICB0aGlzLmNhc3RTdGFnZSAlIFN3b3JkV2hpcmxXaW5kQWJpbGl0eURhdGEuaGl0RGV0ZWN0VGltZXIgPj0gMC4xICYmXHJcbiAgICAgICAgICAgICh0aGlzLmNhc3RTdGFnZSAtIGVsYXBzZWRUaW1lKSAlIFN3b3JkV2hpcmxXaW5kQWJpbGl0eURhdGEuaGl0RGV0ZWN0VGltZXIgPCAwLjFcclxuICAgICAgICApIHtcclxuICAgICAgICAgICAgdGhpcy5jb29sZG93bisrO1xyXG4gICAgICAgICAgICBsZXQgYWN0b3JzOiB7XHJcbiAgICAgICAgICAgICAgICBhY3RvclR5cGU6IEFjdG9yVHlwZTtcclxuICAgICAgICAgICAgICAgIGFjdG9ySWQ6IG51bWJlcjtcclxuICAgICAgICAgICAgICAgIGFuZ2xlOiBudW1iZXI7XHJcbiAgICAgICAgICAgIH1bXSA9IFtdO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5nbG9iYWxBY3RvcnMuYWN0b3JzLmZvckVhY2goKGFjdG9yKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcG9zRGlmZmVyZW5jZSA9IGZpbmREaXN0YW5jZSh0aGlzLnBsYXllci5wb3NpdGlvbiwgYWN0b3IucG9zaXRpb24pO1xyXG4gICAgICAgICAgICAgICAgaWYgKGFjdG9yLmdldEFjdG9ySWQoKSAhPT0gdGhpcy5wbGF5ZXIuZ2V0QWN0b3JJZCgpICYmIHBvc0RpZmZlcmVuY2UgPCBhY3Rvci5nZXRDb2xsaXNpb25SYW5nZSgpICsgU3dvcmRXaGlybFdpbmRBYmlsaXR5RGF0YS5oaXRSYW5nZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGFjdG9ycy5wdXNoKHsgYWN0b3JUeXBlOiBhY3Rvci5nZXRBY3RvclR5cGUoKSwgYWN0b3JJZDogYWN0b3IuZ2V0QWN0b3JJZCgpLCBhbmdsZTogZmluZEFuZ2xlKHRoaXMucGxheWVyLnBvc2l0aW9uLCBhY3Rvci5wb3NpdGlvbikgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaWYgKGFjdG9ycy5sZW5ndGggIT09IDApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5nYW1lUmVuZGVyZXIuc2NyZWVuWm9vbSgxLjA2LCAzKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5zZXJ2ZXJUYWxrZXIuc2VuZE1lc3NhZ2Uoe1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiY2xpZW50U3dvcmRNZXNzYWdlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgb3JpZ2luSWQ6IHRoaXMucGxheWVyLmdldEFjdG9ySWQoKSxcclxuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogdGhpcy5wbGF5ZXIucG9zaXRpb24sXHJcbiAgICAgICAgICAgICAgICAgICAgbW9tZW50dW06IHRoaXMucGxheWVyLm1vbWVudHVtLFxyXG4gICAgICAgICAgICAgICAgICAgIG1zZzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcImNsaWVudFN3b3JkV2hpcmx3aW5kSGl0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjdG9ycyxcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmNhc3RTdGFnZSA+PSBTd29yZFdoaXJsV2luZEFiaWxpdHlEYXRhLnRvdGFsQ2FzdFRpbWUpIHtcclxuICAgICAgICAgICAgdGhpcy5zdG9wRnVuYygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJlbGVhc2VGdW5jKCkge1xyXG4gICAgICAgIHRoaXMuc3RvcEZ1bmMoKTtcclxuICAgIH1cclxuICAgIHN0b3BGdW5jKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmNhc3RpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5wbGF5ZXIucmVsZWFzZUNsaWVudEFiaWxpdHlbXCJ3aGlybHdpbmRcIl0oKTtcclxuICAgICAgICAgICAgdGhpcy5jb250cm9sbGVyLnJlc2V0R2xvYmFsQ29vbGRvd24oKTtcclxuICAgICAgICAgICAgdGhpcy5jb250cm9sbGVyLnJlc2V0Q3VycmVudENhc3RpbmdBYmlsaXR5KCk7XHJcbiAgICAgICAgICAgIHRoaXMucmVzZXRBYmlsaXR5KCk7XHJcbiAgICAgICAgICAgIHRoaXMuY2FzdGluZyA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5jb250cm9sbGVyLnNlbmRTZXJ2ZXJTd29yZEFiaWxpdHkoXCJ3aGlybHdpbmRcIiwgZmFsc2UsIHsgeDogMCwgeTogMCB9KTtcclxuICAgICAgICAgICAgLy9ib3JhZGNhc3QgZW5kaW5nXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZUZ1bmMoZWxhcHNlZFRpbWU6IG51bWJlcikge1xyXG4gICAgICAgIGlmICh0aGlzLmNvb2xkb3duID4gU3dvcmRXaGlybFdpbmRBYmlsaXR5RGF0YS5jb29sZG93bikge1xyXG4gICAgICAgICAgICB0aGlzLmNvb2xkb3duID0gU3dvcmRXaGlybFdpbmRBYmlsaXR5RGF0YS5jb29sZG93biArIDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5jb29sZG93biA8IDApIHtcclxuICAgICAgICAgICAgdGhpcy5jb29sZG93biA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGdldEljb25Db29sZG93blBlcmNlbnQoKTogbnVtYmVyIHtcclxuICAgICAgICBpZiAodGhpcy5jb29sZG93biA9PT0gMCkgcmV0dXJuIHRoaXMuY29udHJvbGxlci5nbG9iYWxDb29sZG93biAvIGRlZmF1bHRBY3RvckNvbmZpZy5nbG9iYWxDb29sZG93bjtcclxuICAgICAgICBlbHNlIHJldHVybiB0aGlzLmNvb2xkb3duIC8gU3dvcmRXaGlybFdpbmRBYmlsaXR5RGF0YS5jb29sZG93bjtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IFN3b3JkV2hpcmxXaW5kQWJpbGl0eURhdGEgPSB7XHJcbiAgICBjb29sZG93bjogNSxcclxuICAgIHRvdGFsQ2FzdFRpbWU6IDEsXHJcbiAgICBoaXREZXRlY3RUaW1lcjogMC4yLFxyXG4gICAgaGl0UmFuZ2U6IDE0MCxcclxufTtcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgQ2xpZW50U3dvcmRXaGlybHdpbmRIaXQge1xyXG4gICAgdHlwZTogXCJjbGllbnRTd29yZFdoaXJsd2luZEhpdFwiO1xyXG4gICAgYWN0b3JzOiB7XHJcbiAgICAgICAgYWN0b3JUeXBlOiBBY3RvclR5cGU7XHJcbiAgICAgICAgYWN0b3JJZDogbnVtYmVyO1xyXG4gICAgICAgIGFuZ2xlOiBudW1iZXI7XHJcbiAgICB9W107XHJcbn1cclxuIiwiaW1wb3J0IHsgR2FtZSB9IGZyb20gXCIuLi8uLi8uLi9jbGllbnQvZ2FtZVwiO1xyXG5pbXBvcnQgeyBQbGF5ZXJBYmlsaXR5IH0gZnJvbSBcIi4vYWJpbGl0aWVzL3BsYXllckFiaWxpdHlcIjtcclxuaW1wb3J0IHsgU2VyaWFsaXplZFBsYXllciB9IGZyb20gXCIuLi8uLi9uZXdBY3RvcnMvc2VydmVyQWN0b3JzL3NlcnZlclBsYXllci9zZXJ2ZXJQbGF5ZXJcIjtcclxuaW1wb3J0IHsgRW1wdHlBYmlsaXR5IH0gZnJvbSBcIi4vYWJpbGl0aWVzL2VtcHR5QWJpbGl0eVwiO1xyXG5pbXBvcnQgeyBkZWZhdWx0QWN0b3JDb25maWcgfSBmcm9tIFwiLi4vLi4vbmV3QWN0b3JzL2FjdG9yQ29uZmlnXCI7XHJcbmltcG9ydCB7IFN3b3JkU2xhc2hBYmlsaXR5IH0gZnJvbSBcIi4vYWJpbGl0aWVzL3N3b3JkQWJpbGl0aWVzL3N3b3JkU2xhc2hBYmlsaXR5XCI7XHJcbmltcG9ydCB7IENsaWVudFN3b3JkV2hpcmx3aW5kSGl0LCBTd29yZFdoaXJsV2luZEFiaWxpdHkgfSBmcm9tIFwiLi9hYmlsaXRpZXMvc3dvcmRBYmlsaXRpZXMvc3dvcmRXaGlybHdpbmRBYmlsaXR5XCI7XHJcbmltcG9ydCB7IFZlY3RvciB9IGZyb20gXCIuLi8uLi8uLi92ZWN0b3JcIjtcclxuaW1wb3J0IHsgUGxheWVySG9sZEFiaWxpdHkgfSBmcm9tIFwiLi9hYmlsaXRpZXMvcGxheWVySG9sZEFiaWxpdHlcIjtcclxuaW1wb3J0IHsgQWN0b3JUeXBlIH0gZnJvbSBcIi4uLy4uL25ld0FjdG9ycy9hY3RvclwiO1xyXG5pbXBvcnQgeyBDbGllbnRTd29yZCB9IGZyb20gXCIuLi8uLi9uZXdBY3RvcnMvY2xpZW50QWN0b3JzL2NsaWVudFBsYXllci9jbGllbnRDbGFzc2VzL2NsaWVudFN3b3JkXCI7XHJcbmltcG9ydCB7IENsaWVudFBsYXllciB9IGZyb20gXCIuLi8uLi9uZXdBY3RvcnMvY2xpZW50QWN0b3JzL2NsaWVudFBsYXllci9jbGllbnRQbGF5ZXJcIjtcclxuXHJcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBDb250cm9sbGVyIHtcclxuICAgIHByb3RlY3RlZCBsZXZlbCA9IDA7IC8vIHNldCBpbiBzZXRMZXZlbCgpXHJcbiAgICBwcm90ZWN0ZWQgY3VycmVudFhwID0gMDtcclxuICAgIHByb3RlY3RlZCB4cFRvTmV4dExldmVsID0gMjA7IC8vIHNldCBpbiBzZXRMZXZlbCgpXHJcbiAgICBwdWJsaWMgZ2xvYmFsQ29vbGRvd246IG51bWJlciA9IDA7XHJcblxyXG4gICAgcHJvdGVjdGVkIGN1cnJlbnRDYXN0aW5nQWJpbGl0eTogbnVtYmVyIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xyXG4gICAgcHJvdGVjdGVkIHN0YXRlU3RhZ2U6IG51bWJlciA9IDA7XHJcblxyXG4gICAgcmVhZG9ubHkgYWJpbGl0eURhdGE6IFBsYXllckFiaWxpdHlbXTtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgcmVhZG9ubHkgZ2FtZTogR2FtZSwgcHJvdGVjdGVkIHJlYWRvbmx5IHBsYXllcjogQ2xpZW50UGxheWVyKSB7XHJcbiAgICAgICAgdGhpcy5hYmlsaXR5RGF0YSA9IFtdO1xyXG4gICAgICAgIGZvciAobGV0IGk6IG51bWJlciA9IDA7IGkgPCA0OyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5hYmlsaXR5RGF0YS5wdXNoKG5ldyBFbXB0eUFiaWxpdHkoZ2FtZSwgdGhpcy5wbGF5ZXIsIHRoaXMsIGkpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuc2V0TGV2ZWwodGhpcy5wbGF5ZXIuZ2V0TGV2ZWwoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldFhwKHhwOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLmN1cnJlbnRYcCA9IHhwICsgMDtcclxuICAgICAgICAvL3RoaXMuVXNlckludGVyZmFjZS51cGRhdGVYUCh4cCk6XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc2V0TGV2ZWwobGV2ZWw6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMubGV2ZWwgPSBsZXZlbCArIDA7XHJcbiAgICAgICAgdGhpcy54cFRvTmV4dExldmVsID0gZGVmYXVsdEFjdG9yQ29uZmlnLlhQUGVyTGV2ZWwgKiBNYXRoLnBvdyhkZWZhdWx0QWN0b3JDb25maWcuTGV2ZWxYUE11bHRpcGxpZXIsIGxldmVsIC0gMSkgKyAwO1xyXG4gICAgICAgIHRoaXMuc2V0WHAoMCk7XHJcbiAgICAgICAgdGhpcy5zZXRBYmlsaXRpZXMoKTtcclxuICAgICAgICAvL3RoaXMuVXNlckludGVyZmFjZS51cGRhdGVMZXZlbChsZXZlbCk6XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGFic3RyYWN0IHNldEFiaWxpdGllcygpOiB2b2lkO1xyXG5cclxuICAgIHB1YmxpYyBzZXRDdXJyZW50Q2FzdGluZ0FiaWxpdHkoYWJpbGl0eUluZGV4OiBudW1iZXIpIHtcclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50Q2FzdGluZ0FiaWxpdHkgIT09IHVuZGVmaW5lZCkgdGhpcy5hYmlsaXR5RGF0YVt0aGlzLmN1cnJlbnRDYXN0aW5nQWJpbGl0eV0uc3RvcEZ1bmMoKTtcclxuICAgICAgICB0aGlzLmN1cnJlbnRDYXN0aW5nQWJpbGl0eSA9IGFiaWxpdHlJbmRleDtcclxuICAgIH1cclxuICAgIHB1YmxpYyByZXNldEN1cnJlbnRDYXN0aW5nQWJpbGl0eSgpIHtcclxuICAgICAgICB0aGlzLmN1cnJlbnRDYXN0aW5nQWJpbGl0eSA9IHVuZGVmaW5lZDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcHJlc3NBYmlsaXR5KGFiaWxpdHlJbmRleDogMCB8IDEgfCAyIHwgMyk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICh0aGlzLmFiaWxpdHlEYXRhW2FiaWxpdHlJbmRleF0uYXR0ZW1wdEZ1bmMoKSkge1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUZhY2luZygpO1xyXG4gICAgICAgICAgICB0aGlzLmFiaWxpdHlEYXRhW2FiaWxpdHlJbmRleF0ucHJlc3NGdW5jKHRoaXMuZ2FtZS5nZXRHbG9iYWxNb3VzZVBvcygpKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVsZWFzZUFiaWxpdHkoYWJpbGl0eUluZGV4OiAwIHwgMSB8IDIgfCAzKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuYWJpbGl0eURhdGFbYWJpbGl0eUluZGV4XS50eXBlID09PSBcImhvbGRcIikge1xyXG4gICAgICAgICAgICAodGhpcy5hYmlsaXR5RGF0YVthYmlsaXR5SW5kZXhdIGFzIFBsYXllckhvbGRBYmlsaXR5KS5yZWxlYXNlRnVuYygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0QWJpbGl0eVN0YXR1cygpOiBQbGF5ZXJBYmlsaXR5W10ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmFiaWxpdHlEYXRhO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRHbG9iYWxDb29sZG93bih0aW1lOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLmdsb2JhbENvb2xkb3duID0gdGltZSArIDA7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgcmVzZXRHbG9iYWxDb29sZG93bigpIHtcclxuICAgICAgICB0aGlzLmdsb2JhbENvb2xkb3duID0gMDtcclxuICAgIH1cclxuICAgIHB1YmxpYyBzZXROZWdhdGl2ZUdsb2JhbENvb2xkb3duKCkge1xyXG4gICAgICAgIHRoaXMuZ2xvYmFsQ29vbGRvd24gPSAtMC4xO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIHVwZGF0ZUdsb2JhbENvb2xkb3duKGVsYXBzZWRUaW1lOiBudW1iZXIpIHtcclxuICAgICAgICBpZiAodGhpcy5nbG9iYWxDb29sZG93biA9PT0gMCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmdsb2JhbENvb2xkb3duID4gMCkge1xyXG4gICAgICAgICAgICB0aGlzLmdsb2JhbENvb2xkb3duIC09IGVsYXBzZWRUaW1lO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5nbG9iYWxDb29sZG93biA8IDApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2xvYmFsQ29vbGRvd24gPSAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIHVwZGF0ZUFiaWxpdGllcyhlbGFwc2VkVGltZTogbnVtYmVyKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaTogbnVtYmVyID0gMDsgaSA8IDQ7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLmFiaWxpdHlEYXRhW2ldLnVwZGF0ZUZ1bmMoZWxhcHNlZFRpbWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgdXBkYXRlRmFjaW5nKCkge1xyXG4gICAgICAgIGxldCBtb3VzZVBvczogVmVjdG9yID0gdGhpcy5nYW1lLmdldEdsb2JhbE1vdXNlUG9zKCk7XHJcbiAgICAgICAgaWYgKG1vdXNlUG9zLnggPiB0aGlzLnBsYXllci5wb3NpdGlvbi54KSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5wbGF5ZXIuZmFjaW5nUmlnaHQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucGxheWVyLmZhY2luZ1JpZ2h0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHRoaXMucGxheWVyLnVwZGF0ZUZhY2luZ0Zyb21TZXJ2ZXIodHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWUuc2VydmVyVGFsa2VyLnNlbmRNZXNzYWdlKHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcImNsaWVudFBsYXllckZhY2luZ1VwZGF0ZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHBsYXllcmlkOiB0aGlzLnBsYXllci5nZXRBY3RvcklkKCksXHJcbiAgICAgICAgICAgICAgICAgICAgZmFjaW5nUmlnaHQ6IHRoaXMucGxheWVyLmZhY2luZ1JpZ2h0LFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAvL2Jyb2FkY2FzdFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMucGxheWVyLmZhY2luZ1JpZ2h0KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBsYXllci5mYWNpbmdSaWdodCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wbGF5ZXIudXBkYXRlRmFjaW5nRnJvbVNlcnZlcihmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWUuc2VydmVyVGFsa2VyLnNlbmRNZXNzYWdlKHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcImNsaWVudFBsYXllckZhY2luZ1VwZGF0ZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHBsYXllcmlkOiB0aGlzLnBsYXllci5nZXRBY3RvcklkKCksXHJcbiAgICAgICAgICAgICAgICAgICAgZmFjaW5nUmlnaHQ6IHRoaXMucGxheWVyLmZhY2luZ1JpZ2h0LFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAvL2Jyb2FkY2FzdFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB1cGRhdGUoZWxhcHNlZFRpbWU6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMudXBkYXRlR2xvYmFsQ29vbGRvd24oZWxhcHNlZFRpbWUpO1xyXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRDYXN0aW5nQWJpbGl0eSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYWJpbGl0eURhdGFbdGhpcy5jdXJyZW50Q2FzdGluZ0FiaWxpdHldLmNhc3RVcGRhdGVGdW5jKGVsYXBzZWRUaW1lKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUZhY2luZygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnVwZGF0ZUFiaWxpdGllcyhlbGFwc2VkVGltZSk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgR2FtZSB9IGZyb20gXCIuLi8uLi8uLi9jbGllbnQvZ2FtZVwiO1xyXG5pbXBvcnQgeyBWZWN0b3IgfSBmcm9tIFwiLi4vLi4vLi4vdmVjdG9yXCI7XHJcbmltcG9ydCB7IENsaWVudERhZ2dlcnMsIERhZ2dlcnNQbGF5ZXJBYmlsaXR5IH0gZnJvbSBcIi4uLy4uL25ld0FjdG9ycy9jbGllbnRBY3RvcnMvY2xpZW50UGxheWVyL2NsaWVudENsYXNzZXMvY2xpZW50RGFnZ2Vyc1wiO1xyXG5pbXBvcnQgeyBDbGllbnRQbGF5ZXIgfSBmcm9tIFwiLi4vLi4vbmV3QWN0b3JzL2NsaWVudEFjdG9ycy9jbGllbnRQbGF5ZXIvY2xpZW50UGxheWVyXCI7XHJcbmltcG9ydCB7IERhZ2dlcnNMdW5nZUFiaWxpdHkgfSBmcm9tIFwiLi9hYmlsaXRpZXMvZGFnZ2Vyc0FiaWxpdGllcy9kYWdnZXJzTHVuZ2VBYmlsaXR5XCI7XHJcbmltcG9ydCB7IENsaWVudERhZ2dlcnNTdGFiSGl0LCBEYWdnZXJzU3RhYkFiaWxpdHkgfSBmcm9tIFwiLi9hYmlsaXRpZXMvZGFnZ2Vyc0FiaWxpdGllcy9kYWdnZXJzU3RhYkFiaWxpdHlcIjtcclxuaW1wb3J0IHsgU3dvcmRTbGFzaEFiaWxpdHkgfSBmcm9tIFwiLi9hYmlsaXRpZXMvc3dvcmRBYmlsaXRpZXMvc3dvcmRTbGFzaEFiaWxpdHlcIjtcclxuaW1wb3J0IHsgU3dvcmRXaGlybFdpbmRBYmlsaXR5IH0gZnJvbSBcIi4vYWJpbGl0aWVzL3N3b3JkQWJpbGl0aWVzL3N3b3JkV2hpcmx3aW5kQWJpbGl0eVwiO1xyXG5pbXBvcnQgeyBDb250cm9sbGVyIH0gZnJvbSBcIi4vY29udHJvbGxlclwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIERhZ2dlcnNDb250cm9sbGVyIGV4dGVuZHMgQ29udHJvbGxlciB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgZ2FtZTogR2FtZSwgcHJvdGVjdGVkIHBsYXllcjogQ2xpZW50RGFnZ2Vycykge1xyXG4gICAgICAgIHN1cGVyKGdhbWUsIHBsYXllcik7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIHNldEFiaWxpdGllcygpIHtcclxuICAgICAgICBzd2l0Y2ggKHRoaXMucGxheWVyLmdldFNwZWMoKSkge1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgdGhpcy5hYmlsaXR5RGF0YVswXSA9IG5ldyBEYWdnZXJzU3RhYkFiaWxpdHkodGhpcy5nYW1lLCB0aGlzLnBsYXllciwgdGhpcywgMCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFiaWxpdHlEYXRhWzFdID0gbmV3IERhZ2dlcnNMdW5nZUFiaWxpdHkodGhpcy5nYW1lLCB0aGlzLnBsYXllciwgdGhpcywgMSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZW5kU2VydmVyRGFnZ2Vyc0FiaWxpdHkoYWJpbGl0eTogRGFnZ2Vyc1BsYXllckFiaWxpdHksIHN0YXJ0aW5nOiBib29sZWFuLCBtb3VzZVBvczogVmVjdG9yKSB7XHJcbiAgICAgICAgdGhpcy5nYW1lLnNlcnZlclRhbGtlci5zZW5kTWVzc2FnZSh7XHJcbiAgICAgICAgICAgIHR5cGU6IFwiY2xpZW50RGFnZ2Vyc01lc3NhZ2VcIixcclxuICAgICAgICAgICAgb3JpZ2luSWQ6IHRoaXMucGxheWVyLmdldEFjdG9ySWQoKSxcclxuICAgICAgICAgICAgcG9zaXRpb246IHRoaXMucGxheWVyLnBvc2l0aW9uLFxyXG4gICAgICAgICAgICBtb21lbnR1bTogdGhpcy5wbGF5ZXIubW9tZW50dW0sXHJcbiAgICAgICAgICAgIG1zZzoge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJjbGllbnREYWdnZXJzQWJpbGl0eVwiLFxyXG4gICAgICAgICAgICAgICAgYWJpbGl0eVR5cGU6IGFiaWxpdHksXHJcbiAgICAgICAgICAgICAgICBtb3VzZVBvcyxcclxuICAgICAgICAgICAgICAgIHN0YXJ0aW5nLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIENsaWVudERhZ2dlcnNNZXNzYWdlIHtcclxuICAgIHR5cGU6IFwiY2xpZW50RGFnZ2Vyc01lc3NhZ2VcIjtcclxuICAgIG9yaWdpbklkOiBudW1iZXI7XHJcbiAgICBwb3NpdGlvbjogVmVjdG9yO1xyXG4gICAgbW9tZW50dW06IFZlY3RvcjtcclxuICAgIG1zZzogQ2xpZW50RGFnZ2Vyc0FiaWxpdHkgfCBDbGllbnREYWdnZXJzU3RhYkhpdDtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBDbGllbnREYWdnZXJzQWJpbGl0eSB7XHJcbiAgICB0eXBlOiBcImNsaWVudERhZ2dlcnNBYmlsaXR5XCI7XHJcbiAgICBhYmlsaXR5VHlwZTogRGFnZ2Vyc1BsYXllckFiaWxpdHk7XHJcbiAgICBtb3VzZVBvczogVmVjdG9yO1xyXG4gICAgc3RhcnRpbmc6IGJvb2xlYW47XHJcbn1cclxuIiwiaW1wb3J0IHsgR2FtZSB9IGZyb20gXCIuLi8uLi8uLi9jbGllbnQvZ2FtZVwiO1xyXG5pbXBvcnQgeyBWZWN0b3IgfSBmcm9tIFwiLi4vLi4vLi4vdmVjdG9yXCI7XHJcbmltcG9ydCB7IENsaWVudEhhbW1lciwgSGFtbWVyUGxheWVyQWJpbGl0eSB9IGZyb20gXCIuLi8uLi9uZXdBY3RvcnMvY2xpZW50QWN0b3JzL2NsaWVudFBsYXllci9jbGllbnRDbGFzc2VzL2NsaWVudEhhbW1lclwiO1xyXG5pbXBvcnQgeyBDbGllbnRQbGF5ZXIgfSBmcm9tIFwiLi4vLi4vbmV3QWN0b3JzL2NsaWVudEFjdG9ycy9jbGllbnRQbGF5ZXIvY2xpZW50UGxheWVyXCI7XHJcbmltcG9ydCB7IEhhbW1lclBvdW5kQWJpbGl0eSB9IGZyb20gXCIuL2FiaWxpdGllcy9oYW1tZXJBYmlsaXRpZXMvaGFtbWVyUG91bmRBYmlsaXR5XCI7XHJcbmltcG9ydCB7IENsaWVudEhhbW1lclN3aW5nSGl0LCBIYW1tZXJTd2luZ0FiaWxpdHkgfSBmcm9tIFwiLi9hYmlsaXRpZXMvaGFtbWVyQWJpbGl0aWVzL2hhbW1lclN3aW5nQWJpbGl0eVwiO1xyXG5pbXBvcnQgeyBDb250cm9sbGVyIH0gZnJvbSBcIi4vY29udHJvbGxlclwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEhhbW1lckNvbnRyb2xsZXIgZXh0ZW5kcyBDb250cm9sbGVyIHtcclxuICAgIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBnYW1lOiBHYW1lLCBwcm90ZWN0ZWQgcGxheWVyOiBDbGllbnRIYW1tZXIpIHtcclxuICAgICAgICBzdXBlcihnYW1lLCBwbGF5ZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBzZXRBYmlsaXRpZXMoKSB7XHJcbiAgICAgICAgc3dpdGNoICh0aGlzLnBsYXllci5nZXRTcGVjKCkpIHtcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIHRoaXMuYWJpbGl0eURhdGFbMF0gPSBuZXcgSGFtbWVyU3dpbmdBYmlsaXR5KHRoaXMuZ2FtZSwgdGhpcy5wbGF5ZXIsIHRoaXMsIDApO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hYmlsaXR5RGF0YVsxXSA9IG5ldyBIYW1tZXJQb3VuZEFiaWxpdHkodGhpcy5nYW1lLCB0aGlzLnBsYXllciwgdGhpcywgMSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZW5kU2VydmVySGFtbWVyQWJpbGl0eShhYmlsaXR5OiBIYW1tZXJQbGF5ZXJBYmlsaXR5LCBzdGFydGluZzogYm9vbGVhbiwgbW91c2VQb3M6IFZlY3Rvcikge1xyXG4gICAgICAgIHRoaXMuZ2FtZS5zZXJ2ZXJUYWxrZXIuc2VuZE1lc3NhZ2Uoe1xyXG4gICAgICAgICAgICB0eXBlOiBcImNsaWVudEhhbW1lck1lc3NhZ2VcIixcclxuICAgICAgICAgICAgb3JpZ2luSWQ6IHRoaXMucGxheWVyLmdldEFjdG9ySWQoKSxcclxuICAgICAgICAgICAgcG9zaXRpb246IHRoaXMucGxheWVyLnBvc2l0aW9uLFxyXG4gICAgICAgICAgICBtb21lbnR1bTogdGhpcy5wbGF5ZXIubW9tZW50dW0sXHJcbiAgICAgICAgICAgIG1zZzoge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJjbGllbnRIYW1tZXJBYmlsaXR5XCIsXHJcbiAgICAgICAgICAgICAgICBhYmlsaXR5VHlwZTogYWJpbGl0eSxcclxuICAgICAgICAgICAgICAgIG1vdXNlUG9zLFxyXG4gICAgICAgICAgICAgICAgc3RhcnRpbmcsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgQ2xpZW50SGFtbWVyTWVzc2FnZSB7XHJcbiAgICB0eXBlOiBcImNsaWVudEhhbW1lck1lc3NhZ2VcIjtcclxuICAgIG9yaWdpbklkOiBudW1iZXI7XHJcbiAgICBwb3NpdGlvbjogVmVjdG9yO1xyXG4gICAgbW9tZW50dW06IFZlY3RvcjtcclxuICAgIG1zZzogQ2xpZW50SGFtbWVyQWJpbGl0eSB8IENsaWVudEhhbW1lclN3aW5nSGl0O1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIENsaWVudEhhbW1lckFiaWxpdHkge1xyXG4gICAgdHlwZTogXCJjbGllbnRIYW1tZXJBYmlsaXR5XCI7XHJcbiAgICBhYmlsaXR5VHlwZTogSGFtbWVyUGxheWVyQWJpbGl0eTtcclxuICAgIG1vdXNlUG9zOiBWZWN0b3I7XHJcbiAgICBzdGFydGluZzogYm9vbGVhbjtcclxufVxyXG4iLCJpbXBvcnQgeyBHYW1lIH0gZnJvbSBcIi4uLy4uLy4uL2NsaWVudC9nYW1lXCI7XHJcbmltcG9ydCB7IFZlY3RvciB9IGZyb20gXCIuLi8uLi8uLi92ZWN0b3JcIjtcclxuaW1wb3J0IHsgQ2xpZW50RGFnZ2VycyB9IGZyb20gXCIuLi8uLi9uZXdBY3RvcnMvY2xpZW50QWN0b3JzL2NsaWVudFBsYXllci9jbGllbnRDbGFzc2VzL2NsaWVudERhZ2dlcnNcIjtcclxuaW1wb3J0IHsgQ2xpZW50U3dvcmQsIFN3b3JkUGxheWVyQWJpbGl0eSB9IGZyb20gXCIuLi8uLi9uZXdBY3RvcnMvY2xpZW50QWN0b3JzL2NsaWVudFBsYXllci9jbGllbnRDbGFzc2VzL2NsaWVudFN3b3JkXCI7XHJcbmltcG9ydCB7IENsaWVudFBsYXllciB9IGZyb20gXCIuLi8uLi9uZXdBY3RvcnMvY2xpZW50QWN0b3JzL2NsaWVudFBsYXllci9jbGllbnRQbGF5ZXJcIjtcclxuaW1wb3J0IHsgQ2xpZW50U3dvcmRTbGFzaEhpdCwgU3dvcmRTbGFzaEFiaWxpdHkgfSBmcm9tIFwiLi9hYmlsaXRpZXMvc3dvcmRBYmlsaXRpZXMvc3dvcmRTbGFzaEFiaWxpdHlcIjtcclxuaW1wb3J0IHsgQ2xpZW50U3dvcmRXaGlybHdpbmRIaXQsIFN3b3JkV2hpcmxXaW5kQWJpbGl0eSB9IGZyb20gXCIuL2FiaWxpdGllcy9zd29yZEFiaWxpdGllcy9zd29yZFdoaXJsd2luZEFiaWxpdHlcIjtcclxuaW1wb3J0IHsgQ29udHJvbGxlciB9IGZyb20gXCIuL2NvbnRyb2xsZXJcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBTd29yZENvbnRyb2xsZXIgZXh0ZW5kcyBDb250cm9sbGVyIHtcclxuICAgIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBnYW1lOiBHYW1lLCBwcm90ZWN0ZWQgcGxheWVyOiBDbGllbnRTd29yZCkge1xyXG4gICAgICAgIHN1cGVyKGdhbWUsIHBsYXllcik7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIHNldEFiaWxpdGllcygpIHtcclxuICAgICAgICBzd2l0Y2ggKHRoaXMucGxheWVyLmdldFNwZWMoKSkge1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgdGhpcy5hYmlsaXR5RGF0YVswXSA9IG5ldyBTd29yZFNsYXNoQWJpbGl0eSh0aGlzLmdhbWUsIHRoaXMucGxheWVyLCB0aGlzLCAwKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYWJpbGl0eURhdGFbMV0gPSBuZXcgU3dvcmRXaGlybFdpbmRBYmlsaXR5KHRoaXMuZ2FtZSwgdGhpcy5wbGF5ZXIsIHRoaXMsIDEpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2VuZFNlcnZlclN3b3JkQWJpbGl0eShhYmlsaXR5OiBTd29yZFBsYXllckFiaWxpdHksIHN0YXJ0aW5nOiBib29sZWFuLCBtb3VzZVBvczogVmVjdG9yKSB7XHJcbiAgICAgICAgdGhpcy5nYW1lLnNlcnZlclRhbGtlci5zZW5kTWVzc2FnZSh7XHJcbiAgICAgICAgICAgIHR5cGU6IFwiY2xpZW50U3dvcmRNZXNzYWdlXCIsXHJcbiAgICAgICAgICAgIG9yaWdpbklkOiB0aGlzLnBsYXllci5nZXRBY3RvcklkKCksXHJcbiAgICAgICAgICAgIHBvc2l0aW9uOiB0aGlzLnBsYXllci5wb3NpdGlvbixcclxuICAgICAgICAgICAgbW9tZW50dW06IHRoaXMucGxheWVyLm1vbWVudHVtLFxyXG4gICAgICAgICAgICBtc2c6IHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IFwiY2xpZW50U3dvcmRBYmlsaXR5XCIsXHJcbiAgICAgICAgICAgICAgICBhYmlsaXR5VHlwZTogYWJpbGl0eSxcclxuICAgICAgICAgICAgICAgIG1vdXNlUG9zLFxyXG4gICAgICAgICAgICAgICAgc3RhcnRpbmcsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgQ2xpZW50U3dvcmRNZXNzYWdlIHtcclxuICAgIHR5cGU6IFwiY2xpZW50U3dvcmRNZXNzYWdlXCI7XHJcbiAgICBvcmlnaW5JZDogbnVtYmVyO1xyXG4gICAgcG9zaXRpb246IFZlY3RvcjtcclxuICAgIG1vbWVudHVtOiBWZWN0b3I7XHJcbiAgICBtc2c6IENsaWVudFN3b3JkV2hpcmx3aW5kSGl0IHwgQ2xpZW50U3dvcmRTbGFzaEhpdCB8IENsaWVudFN3b3JkQWJpbGl0eTtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBDbGllbnRTd29yZEFiaWxpdHkge1xyXG4gICAgdHlwZTogXCJjbGllbnRTd29yZEFiaWxpdHlcIjtcclxuICAgIGFiaWxpdHlUeXBlOiBTd29yZFBsYXllckFiaWxpdHk7XHJcbiAgICBtb3VzZVBvczogVmVjdG9yO1xyXG4gICAgc3RhcnRpbmc6IGJvb2xlYW47XHJcbn1cclxuIiwiaW1wb3J0IHsgR2FtZSB9IGZyb20gXCIuLi8uLi9jbGllbnQvZ2FtZVwiO1xyXG5pbXBvcnQgeyBBYmlsaXR5SW1hZ2VOYW1lLCBhc3NldE1hbmFnZXIsIGltYWdlSW5mb3JtYXRpb24sIEltYWdlTmFtZSB9IGZyb20gXCIuLi8uLi9jbGllbnQvZ2FtZVJlbmRlci9hc3NldG1hbmFnZXJcIjtcclxuaW1wb3J0IHsgc2FmZUdldEVsZW1lbnRCeUlkIH0gZnJvbSBcIi4uLy4uL2NsaWVudC91dGlsXCI7XHJcbmltcG9ydCB7IGRlZmF1bHRDb25maWcgfSBmcm9tIFwiLi4vLi4vY29uZmlnXCI7XHJcbmltcG9ydCB7IGRlZmF1bHRBY3RvckNvbmZpZyB9IGZyb20gXCIuLi9uZXdBY3RvcnMvYWN0b3JDb25maWdcIjtcclxuaW1wb3J0IHsgQ2xhc3NUeXBlIH0gZnJvbSBcIi4uL25ld0FjdG9ycy9zZXJ2ZXJBY3RvcnMvc2VydmVyUGxheWVyL3NlcnZlclBsYXllclwiO1xyXG5pbXBvcnQgeyBDbGllbnRQbGF5ZXIgfSBmcm9tIFwiLi4vbmV3QWN0b3JzL2NsaWVudEFjdG9ycy9jbGllbnRQbGF5ZXIvY2xpZW50UGxheWVyXCI7XHJcbmltcG9ydCB7IFVzZXJJbnRlcmZhY2UgfSBmcm9tIFwiLi91c2VySW50ZXJmYWNlXCI7XHJcbmltcG9ydCB7IFZlY3RvciB9IGZyb20gXCIuLi8uLi92ZWN0b3JcIjtcclxuaW1wb3J0IHsgQ29udHJvbGxlciB9IGZyb20gXCIuL2NvbnRyb2xsZXJzL2NvbnRyb2xsZXJcIjtcclxuaW1wb3J0IHsgRGFnZ2Vyc0NvbnRyb2xsZXIgfSBmcm9tIFwiLi9jb250cm9sbGVycy9kYWdnZXJzQ29udHJvbGxlclwiO1xyXG5pbXBvcnQgeyBDbGllbnREYWdnZXJzIH0gZnJvbSBcIi4uL25ld0FjdG9ycy9jbGllbnRBY3RvcnMvY2xpZW50UGxheWVyL2NsaWVudENsYXNzZXMvY2xpZW50RGFnZ2Vyc1wiO1xyXG5pbXBvcnQgeyBIYW1tZXJDb250cm9sbGVyIH0gZnJvbSBcIi4vY29udHJvbGxlcnMvaGFtbWVyQ29udHJvbGxlclwiO1xyXG5pbXBvcnQgeyBDbGllbnRIYW1tZXIgfSBmcm9tIFwiLi4vbmV3QWN0b3JzL2NsaWVudEFjdG9ycy9jbGllbnRQbGF5ZXIvY2xpZW50Q2xhc3Nlcy9jbGllbnRIYW1tZXJcIjtcclxuaW1wb3J0IHsgQ2xpZW50U3dvcmQgfSBmcm9tIFwiLi4vbmV3QWN0b3JzL2NsaWVudEFjdG9ycy9jbGllbnRQbGF5ZXIvY2xpZW50Q2xhc3Nlcy9jbGllbnRTd29yZFwiO1xyXG5pbXBvcnQgeyBTd29yZENvbnRyb2xsZXIgfSBmcm9tIFwiLi9jb250cm9sbGVycy9zd29yZENvbnRyb2xsZXJcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBJbnB1dFJlYWRlciB7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkga2V5U3RhdGU6IFJlY29yZDxzdHJpbmcsIGJvb2xlYW4+ID0ge307XHJcbiAgICBwcm90ZWN0ZWQgcHJlc3NBYmlsaXRpZXNOZXh0RnJhbWU6IGJvb2xlYW5bXSA9IFtmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZV07XHJcbiAgICBwcm90ZWN0ZWQgcmVsZWFzZUFiaWxpdGllc05leHRGcmFtZTogYm9vbGVhbltdID0gW2ZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlXTtcclxuXHJcbiAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgY29uZmlnID0gZGVmYXVsdENvbmZpZztcclxuXHJcbiAgICBwcm90ZWN0ZWQganVtcENvdW50OiBudW1iZXIgPSAwO1xyXG4gICAgcHJvdGVjdGVkIHdhc01vdmluZ1JpZ2h0OiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwcm90ZWN0ZWQgd2FzTW92aW5nTGVmdDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHJvdGVjdGVkIHdhc0Nyb3VjaGluZzogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgIHB1YmxpYyByZWFkb25seSB1c2VySW50ZXJmYWNlOiBVc2VySW50ZXJmYWNlO1xyXG4gICAgcHVibGljIHJlYWRvbmx5IGNvbnRyb2xsZXI6IENvbnRyb2xsZXI7XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJvdGVjdGVkIHBsYXllcjogQ2xpZW50UGxheWVyLCBwcm90ZWN0ZWQgZ2FtZTogR2FtZSkge1xyXG4gICAgICAgIHN3aXRjaCAodGhpcy5wbGF5ZXIuZ2V0Q2xhc3NUeXBlKCkpIHtcclxuICAgICAgICAgICAgY2FzZSBcImRhZ2dlcnNcIjpcclxuICAgICAgICAgICAgICAgIHRoaXMuY29udHJvbGxlciA9IG5ldyBEYWdnZXJzQ29udHJvbGxlcih0aGlzLmdhbWUsIHRoaXMucGxheWVyIGFzIENsaWVudERhZ2dlcnMpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJoYW1tZXJcIjpcclxuICAgICAgICAgICAgICAgIHRoaXMuY29udHJvbGxlciA9IG5ldyBIYW1tZXJDb250cm9sbGVyKHRoaXMuZ2FtZSwgdGhpcy5wbGF5ZXIgYXMgQ2xpZW50SGFtbWVyKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwic3dvcmRcIjpcclxuICAgICAgICAgICAgICAgIHRoaXMuY29udHJvbGxlciA9IG5ldyBTd29yZENvbnRyb2xsZXIodGhpcy5nYW1lLCB0aGlzLnBsYXllciBhcyBDbGllbnRTd29yZCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcInVua25vd24gY2xhc3MgdHlwZSBpbiBpbnB1dCByZWFkZXIgY29uc3RydWN0b3JcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMudXNlckludGVyZmFjZSA9IG5ldyBVc2VySW50ZXJmYWNlKHRoaXMuY29udHJvbGxlciwgdGhpcy5wbGF5ZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZWdpc3Rlck1vdXNlRG93bihlOiBNb3VzZUV2ZW50LCBnbG9iYWxNb3VzZVBvczogVmVjdG9yKSB7XHJcbiAgICAgICAgaWYgKGUuYnV0dG9uID09PSAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMucHJlc3NBYmlsaXRpZXNOZXh0RnJhbWVbMF0gPSB0cnVlO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoZS5idXR0b24gPT09IDIpIHtcclxuICAgICAgICAgICAgdGhpcy5wcmVzc0FiaWxpdGllc05leHRGcmFtZVsxXSA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHVibGljIHJlZ2lzdGVyTW91c2VVcChlOiBNb3VzZUV2ZW50LCBnbG9iYWxNb3VzZVBvczogVmVjdG9yKSB7XHJcbiAgICAgICAgaWYgKGUuYnV0dG9uID09PSAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVsZWFzZUFiaWxpdGllc05leHRGcmFtZVswXSA9IHRydWU7XHJcbiAgICAgICAgfSBlbHNlIGlmIChlLmJ1dHRvbiA9PT0gMikge1xyXG4gICAgICAgICAgICB0aGlzLnJlbGVhc2VBYmlsaXRpZXNOZXh0RnJhbWVbMV0gPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHB1YmxpYyByZWdpc3RlcktleURvd24oZTogS2V5Ym9hcmRFdmVudCwgZ2xvYmFsTW91c2VQb3M6IFZlY3Rvcikge1xyXG4gICAgICAgIGlmIChlLmNvZGUgPT09IHRoaXMuY29uZmlnLnBsYXllcktleXMuZmlyc3RBYmlsaXR5KSB7XHJcbiAgICAgICAgICAgIHRoaXMucHJlc3NBYmlsaXRpZXNOZXh0RnJhbWVbMl0gPSB0cnVlO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoZS5jb2RlID09PSB0aGlzLmNvbmZpZy5wbGF5ZXJLZXlzLnNlY29uZEFiaWxpdHkpIHtcclxuICAgICAgICAgICAgdGhpcy5wcmVzc0FiaWxpdGllc05leHRGcmFtZVszXSA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMua2V5U3RhdGVbZS5jb2RlXSA9IHRydWU7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgcmVnaXN0ZXJLZXlVcChlOiBLZXlib2FyZEV2ZW50LCBnbG9iYWxNb3VzZVBvczogVmVjdG9yKSB7XHJcbiAgICAgICAgaWYgKGUuY29kZSA9PT0gdGhpcy5jb25maWcucGxheWVyS2V5cy5maXJzdEFiaWxpdHkpIHtcclxuICAgICAgICAgICAgdGhpcy5yZWxlYXNlQWJpbGl0aWVzTmV4dEZyYW1lWzJdID0gdHJ1ZTtcclxuICAgICAgICB9IGVsc2UgaWYgKGUuY29kZSA9PT0gdGhpcy5jb25maWcucGxheWVyS2V5cy5zZWNvbmRBYmlsaXR5KSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVsZWFzZUFiaWxpdGllc05leHRGcmFtZVszXSA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMua2V5U3RhdGVbZS5jb2RlXSA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCB1cGRhdGVHYW1lUGxheWVyTW92ZUFjdGlvbnMoKSB7XHJcbiAgICAgICAgbGV0IHRlbXBXYXNNb3ZpbmdMZWZ0OiBib29sZWFuID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5wbGF5ZXIubW92ZUFjdGlvbnNOZXh0RnJhbWUubW92ZUxlZnQgPSBmYWxzZTtcclxuICAgICAgICBpZiAodGhpcy5rZXlTdGF0ZVt0aGlzLmNvbmZpZy5wbGF5ZXJLZXlzLmxlZnRdKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnBsYXllci5hdHRlbXB0TW92ZUxlZnRBY3Rpb24oKSkgdGVtcFdhc01vdmluZ0xlZnQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGVtcFdhc01vdmluZ0xlZnQgIT09IHRoaXMud2FzTW92aW5nTGVmdCkge1xyXG4gICAgICAgICAgICB0aGlzLmdhbWUuc2VydmVyVGFsa2VyLnNlbmRNZXNzYWdlKHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IFwiY2xpZW50UGxheWVyQWN0aW9uXCIsXHJcbiAgICAgICAgICAgICAgICBwbGF5ZXJJZDogdGhpcy5wbGF5ZXIuZ2V0QWN0b3JJZCgpLFxyXG4gICAgICAgICAgICAgICAgYWN0aW9uVHlwZTogXCJtb3ZlTGVmdFwiLFxyXG4gICAgICAgICAgICAgICAgc3RhcnRpbmc6IHRlbXBXYXNNb3ZpbmdMZWZ0LFxyXG4gICAgICAgICAgICAgICAgcG9zaXRpb246IHRoaXMucGxheWVyLnBvc2l0aW9uLFxyXG4gICAgICAgICAgICAgICAgbW9tZW50dW06IHRoaXMucGxheWVyLm1vbWVudHVtLFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGhpcy53YXNNb3ZpbmdMZWZ0ID0gdGVtcFdhc01vdmluZ0xlZnQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgdGVtcFdhc01vdmluZ1JpZ2h0OiBib29sZWFuID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5wbGF5ZXIubW92ZUFjdGlvbnNOZXh0RnJhbWUubW92ZVJpZ2h0ID0gZmFsc2U7XHJcbiAgICAgICAgaWYgKHRoaXMua2V5U3RhdGVbdGhpcy5jb25maWcucGxheWVyS2V5cy5yaWdodF0pIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMucGxheWVyLmF0dGVtcHRNb3ZlUmlnaHRBY3Rpb24oKSkgdGVtcFdhc01vdmluZ1JpZ2h0ID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRlbXBXYXNNb3ZpbmdSaWdodCAhPT0gdGhpcy53YXNNb3ZpbmdSaWdodCkge1xyXG4gICAgICAgICAgICB0aGlzLmdhbWUuc2VydmVyVGFsa2VyLnNlbmRNZXNzYWdlKHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IFwiY2xpZW50UGxheWVyQWN0aW9uXCIsXHJcbiAgICAgICAgICAgICAgICBwbGF5ZXJJZDogdGhpcy5wbGF5ZXIuZ2V0QWN0b3JJZCgpLFxyXG4gICAgICAgICAgICAgICAgYWN0aW9uVHlwZTogXCJtb3ZlUmlnaHRcIixcclxuICAgICAgICAgICAgICAgIHN0YXJ0aW5nOiB0ZW1wV2FzTW92aW5nUmlnaHQsXHJcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogdGhpcy5wbGF5ZXIucG9zaXRpb24sXHJcbiAgICAgICAgICAgICAgICBtb21lbnR1bTogdGhpcy5wbGF5ZXIubW9tZW50dW0sXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0aGlzLndhc01vdmluZ1JpZ2h0ID0gdGVtcFdhc01vdmluZ1JpZ2h0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHRlbXBXYXNDcm91Y2hpbmc6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgICAgICB0aGlzLnBsYXllci5tb3ZlQWN0aW9uc05leHRGcmFtZS5jcm91Y2ggPSBmYWxzZTtcclxuICAgICAgICBpZiAodGhpcy5rZXlTdGF0ZVt0aGlzLmNvbmZpZy5wbGF5ZXJLZXlzLmRvd25dKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnBsYXllci5hdHRlbXB0Q3JvdWNoQWN0aW9uKCkpIHRlbXBXYXNDcm91Y2hpbmcgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGVtcFdhc0Nyb3VjaGluZyAhPT0gdGhpcy53YXNDcm91Y2hpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5nYW1lLnNlcnZlclRhbGtlci5zZW5kTWVzc2FnZSh7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiBcImNsaWVudFBsYXllckFjdGlvblwiLFxyXG4gICAgICAgICAgICAgICAgcGxheWVySWQ6IHRoaXMucGxheWVyLmdldEFjdG9ySWQoKSxcclxuICAgICAgICAgICAgICAgIGFjdGlvblR5cGU6IFwiY3JvdWNoXCIsXHJcbiAgICAgICAgICAgICAgICBzdGFydGluZzogdGVtcFdhc0Nyb3VjaGluZyxcclxuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiB0aGlzLnBsYXllci5wb3NpdGlvbixcclxuICAgICAgICAgICAgICAgIG1vbWVudHVtOiB0aGlzLnBsYXllci5tb21lbnR1bSxcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHRoaXMud2FzQ3JvdWNoaW5nID0gdGVtcFdhc0Nyb3VjaGluZztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnBsYXllci5hY3Rvck9iamVjdC5zdGFuZGluZykge1xyXG4gICAgICAgICAgICB0aGlzLmp1bXBDb3VudCA9IDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5rZXlTdGF0ZVt0aGlzLmNvbmZpZy5wbGF5ZXJLZXlzLnVwXSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5qdW1wQ291bnQgPCAyICYmIHRoaXMucGxheWVyLmF0dGVtcHRKdW1wQWN0aW9uKCkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5zZXJ2ZXJUYWxrZXIuc2VuZE1lc3NhZ2Uoe1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiY2xpZW50UGxheWVyQWN0aW9uXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgcGxheWVySWQ6IHRoaXMucGxheWVyLmdldEFjdG9ySWQoKSxcclxuICAgICAgICAgICAgICAgICAgICBhY3Rpb25UeXBlOiBcImp1bXBcIixcclxuICAgICAgICAgICAgICAgICAgICBzdGFydGluZzogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogdGhpcy5wbGF5ZXIucG9zaXRpb24sXHJcbiAgICAgICAgICAgICAgICAgICAgbW9tZW50dW06IHRoaXMucGxheWVyLm1vbWVudHVtLFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmp1bXBDb3VudCsrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMua2V5U3RhdGVbdGhpcy5jb25maWcucGxheWVyS2V5cy51cF0gPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIHVwZGF0ZUdhbWVQbGF5ZXJBYmlsaXRpZXMoKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaTogbnVtYmVyID0gMDsgaSA8IDQ7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5wcmVzc0FiaWxpdGllc05leHRGcmFtZVtpXSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb250cm9sbGVyLnByZXNzQWJpbGl0eShpIGFzIDAgfCAxIHwgMiB8IDMpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGkgIT09IDApIHRoaXMucHJlc3NBYmlsaXRpZXNOZXh0RnJhbWVbaV0gPSBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKGxldCBpOiBudW1iZXIgPSAwOyBpIDwgNDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnJlbGVhc2VBYmlsaXRpZXNOZXh0RnJhbWVbaV0gPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29udHJvbGxlci5yZWxlYXNlQWJpbGl0eShpIGFzIDAgfCAxIHwgMiB8IDMpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZWxlYXNlQWJpbGl0aWVzTmV4dEZyYW1lW2ldID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBpZiAoaSA9PT0gMCkgdGhpcy5wcmVzc0FiaWxpdGllc05leHRGcmFtZVtpXSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB1cGRhdGUoZWxhcHNlZFRpbWU6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMudXBkYXRlR2FtZVBsYXllck1vdmVBY3Rpb25zKCk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVHYW1lUGxheWVyQWJpbGl0aWVzKCk7XHJcblxyXG4gICAgICAgIHRoaXMuY29udHJvbGxlci51cGRhdGUoZWxhcHNlZFRpbWUpO1xyXG4gICAgICAgIHRoaXMudXNlckludGVyZmFjZS51cGRhdGVBbmRSZW5kZXIoKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBhc3NldE1hbmFnZXIgfSBmcm9tIFwiLi4vLi4vY2xpZW50L2dhbWVSZW5kZXIvYXNzZXRtYW5hZ2VyXCI7XHJcbmltcG9ydCB7IHNhZmVHZXRFbGVtZW50QnlJZCB9IGZyb20gXCIuLi8uLi9jbGllbnQvdXRpbFwiO1xyXG5pbXBvcnQgeyBkZWZhdWx0QWN0b3JDb25maWcgfSBmcm9tIFwiLi4vbmV3QWN0b3JzL2FjdG9yQ29uZmlnXCI7XHJcbmltcG9ydCB7IENsYXNzVHlwZSB9IGZyb20gXCIuLi9uZXdBY3RvcnMvc2VydmVyQWN0b3JzL3NlcnZlclBsYXllci9zZXJ2ZXJQbGF5ZXJcIjtcclxuaW1wb3J0IHsgQ2xpZW50UGxheWVyIH0gZnJvbSBcIi4uL25ld0FjdG9ycy9jbGllbnRBY3RvcnMvY2xpZW50UGxheWVyL2NsaWVudFBsYXllclwiO1xyXG5pbXBvcnQgeyBWZWN0b3IgfSBmcm9tIFwiLi4vLi4vdmVjdG9yXCI7XHJcbmltcG9ydCB7IFBsYXllckFiaWxpdHkgfSBmcm9tIFwiLi9jb250cm9sbGVycy9hYmlsaXRpZXMvcGxheWVyQWJpbGl0eVwiO1xyXG5pbXBvcnQgeyBDb250cm9sbGVyIH0gZnJvbSBcIi4vY29udHJvbGxlcnMvY29udHJvbGxlclwiO1xyXG5pbXBvcnQgeyByb3VuZFJlY3QgfSBmcm9tIFwiLi4vLi4vY2xpZW50L2dhbWVSZW5kZXIvZ2FtZVJlbmRlcmVyXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgVXNlckludGVyZmFjZSB7XHJcbiAgICBwcm90ZWN0ZWQgWFB0b05leHRMZXZlbDogbnVtYmVyO1xyXG4gICAgcHJvdGVjdGVkIGN1cnJlbnRYUDogbnVtYmVyID0gMDtcclxuICAgIHByb3RlY3RlZCBjdXJyZW50TGV2ZWw6IG51bWJlcjtcclxuICAgIHByb3RlY3RlZCBoZWFsdGhJbmZvOiB7IGhlYWx0aDogbnVtYmVyOyBtYXhIZWFsdGg6IG51bWJlciB9O1xyXG4gICAgcHJvdGVjdGVkIGRpc3BsYXlIZWFsdGg6IG51bWJlcjtcclxuXHJcbiAgICAvL3Byb3RlY3RlZCByZWFkb25seSBwb3J0cmFpdEVsZW1lbnQ6IEhUTUxDYW52YXNFbGVtZW50ID0gc2FmZUdldEVsZW1lbnRCeUlkKFwicG9ydHJhaXRDYW52YXNcIikgYXMgSFRNTENhbnZhc0VsZW1lbnQ7XHJcbiAgICAvL3Byb3RlY3RlZCByZWFkb25seSBwb3J0cmFpdENhbnZhczogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEID0gdGhpcy5wb3J0cmFpdEVsZW1lbnQuZ2V0Q29udGV4dChcIjJkXCIpITtcclxuXHJcbiAgICBwcm90ZWN0ZWQgaGVhbHRoQ2hhbmdlZDogYm9vbGVhbiA9IHRydWU7XHJcbiAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgaGVhbHRoRWxlbWVudDogSFRNTENhbnZhc0VsZW1lbnQgPSBzYWZlR2V0RWxlbWVudEJ5SWQoXCJoZWFsdGhDYW52YXNcIikgYXMgSFRNTENhbnZhc0VsZW1lbnQ7XHJcbiAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgaGVhbHRoQ2FudmFzOiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgPSB0aGlzLmhlYWx0aEVsZW1lbnQuZ2V0Q29udGV4dChcIjJkXCIpITtcclxuXHJcbiAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgYWJpbGl0eUVsZW1lbnQ6IEhUTUxDYW52YXNFbGVtZW50ID0gc2FmZUdldEVsZW1lbnRCeUlkKFwiYWJpbGl0eUNhbnZhc1wiKSBhcyBIVE1MQ2FudmFzRWxlbWVudDtcclxuICAgIHByb3RlY3RlZCByZWFkb25seSBhYmlsaXR5Q2FudmFzOiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgPSB0aGlzLmFiaWxpdHlFbGVtZW50LmdldENvbnRleHQoXCIyZFwiKSE7XHJcblxyXG4gICAgcHJvdGVjdGVkIHJlYWRvbmx5IGFiaWxpdHlJbWFnZXM6IEhUTUxJbWFnZUVsZW1lbnRbXTtcclxuICAgIHByb3RlY3RlZCBhYmlsaXR5Q2hhbmdlZDogYm9vbGVhbltdID0gW3RydWUsIHRydWUsIHRydWUsIHRydWVdO1xyXG5cclxuICAgIHByb3RlY3RlZCByZWFkb25seSBwbGF5ZXJBYmlsaXR5U3RhdHVzOiBQbGF5ZXJBYmlsaXR5W107XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJvdGVjdGVkIHJlYWRvbmx5IGNvbnRyb2xsZXI6IENvbnRyb2xsZXIsIHByb3RlY3RlZCByZWFkb25seSBwbGF5ZXI6IENsaWVudFBsYXllcikge1xyXG4gICAgICAgIHRoaXMucGxheWVyQWJpbGl0eVN0YXR1cyA9IHRoaXMuY29udHJvbGxlci5nZXRBYmlsaXR5U3RhdHVzKCk7XHJcblxyXG4gICAgICAgIC8vdGhpcy5wb3J0cmFpdEVsZW1lbnQud2lkdGggPSA1MDtcclxuICAgICAgICAvL3RoaXMucG9ydHJhaXRFbGVtZW50LmhlaWdodCA9IDUwO1xyXG5cclxuICAgICAgICB0aGlzLmhlYWx0aEVsZW1lbnQud2lkdGggPSAyNTA7XHJcbiAgICAgICAgdGhpcy5oZWFsdGhFbGVtZW50LmhlaWdodCA9IDc1O1xyXG5cclxuICAgICAgICB0aGlzLmFiaWxpdHlFbGVtZW50LndpZHRoID0gNDAwO1xyXG4gICAgICAgIHRoaXMuYWJpbGl0eUVsZW1lbnQuaGVpZ2h0ID0gMTIwO1xyXG5cclxuICAgICAgICB0aGlzLmhlYWx0aEluZm8gPSBwbGF5ZXIuZ2V0SGVhbHRoSW5mbygpO1xyXG4gICAgICAgIHRoaXMuZGlzcGxheUhlYWx0aCA9IHRoaXMuaGVhbHRoSW5mby5oZWFsdGggKyAwO1xyXG5cclxuICAgICAgICB0aGlzLmN1cnJlbnRMZXZlbCA9IHRoaXMucGxheWVyLmdldExldmVsKCk7XHJcbiAgICAgICAgdGhpcy5YUHRvTmV4dExldmVsID0gZGVmYXVsdEFjdG9yQ29uZmlnLlhQUGVyTGV2ZWwgKiBNYXRoLnBvdyhkZWZhdWx0QWN0b3JDb25maWcuTGV2ZWxYUE11bHRpcGxpZXIsIHRoaXMuY3VycmVudExldmVsKTtcclxuICAgICAgICAvL3RoaXMubGV2ZWxDb3VudEVsZW1lbnQuaW5uZXJUZXh0ID0gU3RyaW5nKHRoaXMuY3VycmVudExldmVsKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZVhQYmFyKDApO1xyXG4gICAgICAgIHRoaXMuYWJpbGl0eUltYWdlcyA9IGdldEFiaWxpdHlJbWFnZXModGhpcy5wbGF5ZXIuZ2V0Q2xhc3NUeXBlKCksIHRoaXMuY3VycmVudExldmVsLCB0aGlzLnBsYXllci5nZXRTcGVjKCkpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlUGFzc2l2ZUFiaWxpdHkodGhpcy5hYmlsaXR5SW1hZ2VzWzRdKTtcclxuICAgICAgICAvL3RoaXMudXBkYXRlQWJpbGl0eUltYWdlcyh0aGlzLnBsYXllci5nZXRDbGFzc1R5cGUoKSwgdGhpcy5jdXJyZW50TGV2ZWwsIHRoaXMucGxheWVyLmdldFNwZWMoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHVwZGF0ZVhQYmFyKHF1YW50aXR5OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLmN1cnJlbnRYUCA9IHF1YW50aXR5O1xyXG4gICAgICAgIHRoaXMucmVuZGVyUG9ydHJhaXQoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgbGV2ZWxVcChsZXZlbDogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50TGV2ZWwgPSBsZXZlbDtcclxuICAgICAgICB0aGlzLlhQdG9OZXh0TGV2ZWwgPSBkZWZhdWx0QWN0b3JDb25maWcuWFBQZXJMZXZlbCAqIE1hdGgucG93KGRlZmF1bHRBY3RvckNvbmZpZy5MZXZlbFhQTXVsdGlwbGllciwgdGhpcy5jdXJyZW50TGV2ZWwpO1xyXG5cclxuICAgICAgICB0aGlzLnVwZGF0ZVhQYmFyKDApO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZWdpc3RlcktleU9yTW91c2VDaGFuZ2UoaW5kZXg6IDAgfCAxIHwgMiB8IDMpIHtcclxuICAgICAgICB0aGlzLmFiaWxpdHlDaGFuZ2VkW2luZGV4XSA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLypwdWJsaWMgdXBkYXRlQWJpbGl0eUltYWdlcyhjbGFzc1R5cGU6IENsYXNzVHlwZSwgbGV2ZWw6IG51bWJlciwgc3BlYzogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5hYmlsaXR5SW1hZ2VzID0gZ2V0QWJpbGl0eUltYWdlcyhjbGFzc1R5cGUsIGxldmVsLCBzcGVjKTtcclxuICAgICAgICB0aGlzLmFiaWxpdGllc0NoYW5nZWQgPSB0cnVlO1xyXG4gICAgICAgIGZvciAobGV0IGk6IG51bWJlciA9IDA7IGkgPCA1OyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5hYmlsaXR5Q2hhbmdlZFtpXSA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgfSovXHJcblxyXG4gICAgcHVibGljIHVwZGF0ZUFuZFJlbmRlcigpIHtcclxuICAgICAgICBpZiAodGhpcy5kaXNwbGF5SGVhbHRoICsgNSA8IHRoaXMuaGVhbHRoSW5mby5oZWFsdGgpIHtcclxuICAgICAgICAgICAgdGhpcy5kaXNwbGF5SGVhbHRoICs9IDU7XHJcbiAgICAgICAgICAgIHRoaXMuaGVhbHRoQ2hhbmdlZCA9IHRydWU7XHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmRpc3BsYXlIZWFsdGggLSA1ID4gdGhpcy5oZWFsdGhJbmZvLmhlYWx0aCkge1xyXG4gICAgICAgICAgICB0aGlzLmRpc3BsYXlIZWFsdGggLT0gNTtcclxuICAgICAgICAgICAgdGhpcy5oZWFsdGhDaGFuZ2VkID0gdHJ1ZTtcclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuZGlzcGxheUhlYWx0aCAhPT0gdGhpcy5oZWFsdGhJbmZvLmhlYWx0aCkge1xyXG4gICAgICAgICAgICB0aGlzLmRpc3BsYXlIZWFsdGggPSB0aGlzLmhlYWx0aEluZm8uaGVhbHRoICsgMDtcclxuICAgICAgICAgICAgdGhpcy5oZWFsdGhDaGFuZ2VkID0gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmhlYWx0aENoYW5nZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5yZW5kZXJIZWFsdGgoKTtcclxuICAgICAgICAgICAgdGhpcy5oZWFsdGhDaGFuZ2VkID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnJlbmRlckFiaWxpdGllcygpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCByZW5kZXJIZWFsdGgoKSB7XHJcbiAgICAgICAgLy90aGlzLmhlYWx0aENhbnZhcy5jbGVhclJlY3QoMCwgMCwgdGhpcy5oZWFsdGhFbGVtZW50LndpZHRoLCAyMCk7XHJcblxyXG4gICAgICAgIHRoaXMuaGVhbHRoQ2FudmFzLmZpbGxTdHlsZSA9IFwicmdiKDIzMCwgMjMwLCAyMzApXCI7XHJcblxyXG4gICAgICAgIGxldCBzZWdtZW50czogbnVtYmVyID0gTWF0aC5jZWlsKHRoaXMuaGVhbHRoSW5mby5tYXhIZWFsdGggLyAyMCk7XHJcbiAgICAgICAgbGV0IHdpZHRoOiBudW1iZXIgPSB0aGlzLmhlYWx0aEVsZW1lbnQud2lkdGggLyBzZWdtZW50cztcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaTogbnVtYmVyID0gMDsgaSA8IHNlZ21lbnRzOyBpKyspIHtcclxuICAgICAgICAgICAgcm91bmRSZWN0KHRoaXMuaGVhbHRoQ2FudmFzLCBpICogd2lkdGggKyAxLCAxMCwgd2lkdGggLSAyLCA0MCwgNCwgdHJ1ZSwgZmFsc2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5oZWFsdGhDYW52YXMuY2xlYXJSZWN0KFxyXG4gICAgICAgICAgICB0aGlzLmhlYWx0aEVsZW1lbnQud2lkdGgsXHJcbiAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgIHRoaXMuaGVhbHRoRWxlbWVudC53aWR0aCAqICh0aGlzLmRpc3BsYXlIZWFsdGggLyB0aGlzLmhlYWx0aEluZm8ubWF4SGVhbHRoIC0gMSksXHJcbiAgICAgICAgICAgIHRoaXMuaGVhbHRoRWxlbWVudC5oZWlnaHQsXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgdGhpcy5oZWFsdGhDYW52YXMuZmlsbFN0eWxlID0gXCJyZ2JhKDIzMCwgMjMwLCAyMzAsIDAuMilcIjtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaTogbnVtYmVyID0gMDsgaSA8IHNlZ21lbnRzOyBpKyspIHtcclxuICAgICAgICAgICAgcm91bmRSZWN0KHRoaXMuaGVhbHRoQ2FudmFzLCBpICogd2lkdGggKyAxLCAxMCwgd2lkdGggLSAyLCA0MCwgNCwgdHJ1ZSwgZmFsc2UpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgcmVuZGVyUG9ydHJhaXQoKSB7XHJcbiAgICAgICAgLyp0aGlzLnBvcnRyYWl0Q2FudmFzLmNsZWFyUmVjdCgwLCAwLCB0aGlzLnBvcnRyYWl0RWxlbWVudC53aWR0aCwgdGhpcy5wb3J0cmFpdEVsZW1lbnQuaGVpZ2h0KTtcclxuXHJcbiAgICAgICAgLy9YUCByZW5kZXJcclxuICAgICAgICB0aGlzLnBvcnRyYWl0Q2FudmFzLnN0cm9rZVN0eWxlID0gXCJ5ZWxsb3dcIjtcclxuICAgICAgICByb3VuZEhleCh0aGlzLnBvcnRyYWl0Q2FudmFzLCAwLCAwLCB0aGlzLnBvcnRyYWl0RWxlbWVudC53aWR0aCwgdGhpcy5wb3J0cmFpdEVsZW1lbnQuaGVpZ2h0LCAxMCwgNSwgdHJ1ZSk7XHJcbiAgICAgICAgdGhpcy5wb3J0cmFpdENhbnZhcy5jbGVhclJlY3QoMCwgMCwgdGhpcy5wb3J0cmFpdEVsZW1lbnQud2lkdGgsIDEgKyB0aGlzLnBvcnRyYWl0RWxlbWVudC5oZWlnaHQgKiAoMSAtIHRoaXMuY3VycmVudFhQKSAqIDAuOTUpO1xyXG5cclxuICAgICAgICB0aGlzLnBvcnRyYWl0Q2FudmFzLnN0cm9rZVN0eWxlID0gXCJyZ2IoMjMwLCAyMzAsIDIzMClcIjtcclxuICAgICAgICByb3VuZEhleCh0aGlzLnBvcnRyYWl0Q2FudmFzLCA0LCA0LCB0aGlzLnBvcnRyYWl0RWxlbWVudC53aWR0aCAtIDgsIHRoaXMucG9ydHJhaXRFbGVtZW50LmhlaWdodCAtIDgsIDUsIDQsIHRydWUpOyovXHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIHJlbmRlckxldmVsKCkge31cclxuICAgIHB1YmxpYyB1cGRhdGVQYXNzaXZlQWJpbGl0eShpbWc6IEhUTUxJbWFnZUVsZW1lbnQpIHtcclxuICAgICAgICB0aGlzLmFiaWxpdHlDYW52YXMubGluZVdpZHRoID0gMTtcclxuICAgICAgICB0aGlzLmFiaWxpdHlDYW52YXMuc3Ryb2tlU3R5bGUgPSBcInJnYigyMzAsIDIzMCwgMjMwKVwiO1xyXG4gICAgICAgIHRoaXMuYWJpbGl0eUNhbnZhcy5jbGVhclJlY3QoMzMwLCAzMCwgNTUsIDU1KTtcclxuICAgICAgICByb3VuZFJlY3QodGhpcy5hYmlsaXR5Q2FudmFzLCAzMzMsIDMyLCA1MCwgNTAsIDEwLCBmYWxzZSwgdHJ1ZSk7XHJcbiAgICAgICAgdGhpcy5hYmlsaXR5Q2FudmFzLmRyYXdJbWFnZShpbWcsIDMzMywgMzIsIDUwLCA1MCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGljb25Db29sZG93bkxhc3RGcmFtZTogbnVtYmVyW10gPSBbLTEsIC0xLCAtMSwgLTFdO1xyXG4gICAgcHJvdGVjdGVkIGdsb2JhbENvb2xkb3duTGFzdEZyYW1lOiBudW1iZXIgPSAtMTtcclxuICAgIHByb3RlY3RlZCByZW5kZXJBYmlsaXRpZXMoKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaTogbnVtYmVyID0gMDsgaSA8IHRoaXMucmVuZGVyQWJpbGl0eUljb25GdW5jdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZ2xvYmFsQ29vbGRvd25MYXN0RnJhbWUgIT09IHRoaXMuY29udHJvbGxlci5nbG9iYWxDb29sZG93biB8fCB0aGlzLmljb25Db29sZG93bkxhc3RGcmFtZVtpXSAhPT0gdGhpcy5wbGF5ZXJBYmlsaXR5U3RhdHVzW2ldLmNvb2xkb3duKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFiaWxpdHlDYW52YXMuZmlsbFN0eWxlID0gXCJyZ2IoMjU1LCAyNTUsIDI1NSlcIjtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyQWJpbGl0eUljb25GdW5jdGlvbnNbaV0oKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYWJpbGl0eUNoYW5nZWRbaV0gPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuaWNvbkNvb2xkb3duTGFzdEZyYW1lW2ldID0gdGhpcy5wbGF5ZXJBYmlsaXR5U3RhdHVzW2ldLmNvb2xkb3duICsgMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmdsb2JhbENvb2xkb3duTGFzdEZyYW1lID0gdGhpcy5jb250cm9sbGVyLmdsb2JhbENvb2xkb3duO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIHJlbmRlckFiaWxpdHlJY29uRnVuY3Rpb25zOiAoKCkgPT4gdm9pZClbXSA9IFtcclxuICAgICAgICAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMucmVuZGVyQWJpbGl0eUljb24oeyB4OiA1LCB5OiAzMCB9LCA3MCwgMCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMucmVuZGVyQWJpbGl0eUljb24oeyB4OiA5MCwgeTogMzAgfSwgNzAsIDEpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnJlbmRlckFiaWxpdHlJY29uKHsgeDogMTgwLCB5OiAzMCB9LCA2MCwgMik7XHJcbiAgICAgICAgfSxcclxuICAgICAgICAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMucmVuZGVyQWJpbGl0eUljb24oeyB4OiAyNTUsIHk6IDMwIH0sIDYwLCAzKTtcclxuICAgICAgICB9LFxyXG4gICAgXTtcclxuXHJcbiAgICBwcm90ZWN0ZWQgcmVuZGVyQWJpbGl0eUljb24ocG9zOiBWZWN0b3IsIHNpZGVMZW5ndGg6IG51bWJlciwgYWJpbGl0eUluZGV4OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLmFiaWxpdHlDYW52YXMuY2xlYXJSZWN0KHBvcy54IC0gMiwgcG9zLnkgLSAyLCBzaWRlTGVuZ3RoICsgNCwgc2lkZUxlbmd0aCArIDQpO1xyXG5cclxuICAgICAgICBsZXQgcGVyY2VudENvb2xkb3duOiBudW1iZXIgPSB0aGlzLnBsYXllckFiaWxpdHlTdGF0dXNbYWJpbGl0eUluZGV4XS5nZXRJY29uQ29vbGRvd25QZXJjZW50KCk7XHJcbiAgICAgICAgaWYgKHBlcmNlbnRDb29sZG93biA9PT0gMCkge1xyXG4gICAgICAgICAgICByb3VuZFJlY3QodGhpcy5hYmlsaXR5Q2FudmFzLCBwb3MueCwgcG9zLnksIHNpZGVMZW5ndGgsIHNpZGVMZW5ndGgsIDUsIHRydWUsIGZhbHNlKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAocGVyY2VudENvb2xkb3duICE9PSAxKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFiaWxpdHlDYW52YXMuZmlsbFN0eWxlID0gXCJyZ2JhKDIwMCwgMjAwLCAyMDAsIDAuNClcIjtcclxuICAgICAgICAgICAgICAgIHJvdW5kUmVjdCh0aGlzLmFiaWxpdHlDYW52YXMsIHBvcy54LCBwb3MueSwgc2lkZUxlbmd0aCwgc2lkZUxlbmd0aCwgNSwgdHJ1ZSwgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hYmlsaXR5Q2FudmFzLmNsZWFyUmVjdChwb3MueCAtIDIsIHBvcy55LCBzaWRlTGVuZ3RoICsgNCwgc2lkZUxlbmd0aCAqIHBlcmNlbnRDb29sZG93biArIDIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuYWJpbGl0eUNhbnZhcy5maWxsU3R5bGUgPSBcInJnYmEoMjAwLCAyMDAsIDIwMCwgMC4yKVwiO1xyXG4gICAgICAgICAgICByb3VuZFJlY3QodGhpcy5hYmlsaXR5Q2FudmFzLCBwb3MueCwgcG9zLnksIHNpZGVMZW5ndGgsIHNpZGVMZW5ndGgsIDUsIHRydWUsIGZhbHNlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuYWJpbGl0eUNhbnZhcy5nbG9iYWxDb21wb3NpdGVPcGVyYXRpb24gPSBcImRlc3RpbmF0aW9uLW91dFwiO1xyXG4gICAgICAgIHRoaXMuYWJpbGl0eUNhbnZhcy5kcmF3SW1hZ2UodGhpcy5wbGF5ZXJBYmlsaXR5U3RhdHVzW2FiaWxpdHlJbmRleF0uaW1nLCBwb3MueCwgcG9zLnksIHNpZGVMZW5ndGgsIHNpZGVMZW5ndGgpO1xyXG4gICAgICAgIHRoaXMuYWJpbGl0eUNhbnZhcy5nbG9iYWxDb21wb3NpdGVPcGVyYXRpb24gPSBcInNvdXJjZS1vdmVyXCI7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJvdW5kSGV4KGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELCB4OiBudW1iZXIsIHk6IG51bWJlciwgd2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIsIHJhZGl1czogbnVtYmVyLCBzdHJva2VXaWR0aDogbnVtYmVyLCBmbGF0OiBib29sZWFuKSB7XHJcbiAgICBjdHgubGluZVdpZHRoID0gcmFkaXVzICogMjtcclxuICAgIGN0eC5saW5lSm9pbiA9IFwicm91bmRcIjtcclxuXHJcbiAgICBjb25zdCByZW5kZXJGbGF0ID0gKCk6IHZvaWQgPT4ge1xyXG4gICAgICAgIGNvbnN0IHdpZHRoRGlmOiBudW1iZXIgPSAod2lkdGggKyByYWRpdXMpIC8gNDtcclxuICAgICAgICBjb25zdCBoZWlnaHREaWY6IG51bWJlciA9IGhlaWdodCAvIDIgLSAoKGhlaWdodCAtIHJhZGl1cyAqIDIpICogTWF0aC5wb3coMywgMC41KSkgLyA0O1xyXG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICBjdHgubW92ZVRvKHggKyB3aWR0aERpZiwgeSArIGhlaWdodERpZik7XHJcbiAgICAgICAgY3R4LmxpbmVUbyh4ICsgcmFkaXVzLCB5ICsgaGVpZ2h0IC8gMik7XHJcbiAgICAgICAgY3R4LmxpbmVUbyh4ICsgd2lkdGhEaWYsIHkgKyBoZWlnaHQgLSBoZWlnaHREaWYpO1xyXG4gICAgICAgIGN0eC5saW5lVG8oeCArIHdpZHRoIC0gd2lkdGhEaWYsIHkgKyBoZWlnaHQgLSBoZWlnaHREaWYpO1xyXG4gICAgICAgIGN0eC5saW5lVG8oeCArIHdpZHRoIC0gcmFkaXVzLCB5ICsgaGVpZ2h0IC8gMik7XHJcbiAgICAgICAgY3R4LmxpbmVUbyh4ICsgd2lkdGggLSB3aWR0aERpZiwgeSArIGhlaWdodERpZik7XHJcbiAgICAgICAgY3R4LmNsb3NlUGF0aCgpO1xyXG4gICAgfTtcclxuICAgIGNvbnN0IHJlbmRlclRhbGwgPSAoKTogdm9pZCA9PiB7XHJcbiAgICAgICAgY29uc3QgaGVpZ2h0RGlmOiBudW1iZXIgPSAoaGVpZ2h0ICsgcmFkaXVzKSAvIDQ7XHJcbiAgICAgICAgY29uc3Qgd2lkdGhEaWY6IG51bWJlciA9IHdpZHRoIC8gMiAtICgod2lkdGggLSByYWRpdXMgKiAyKSAqIE1hdGgucG93KDMsIDAuNSkpIC8gNDtcclxuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgY3R4Lm1vdmVUbyh4ICsgd2lkdGhEaWYsIHkgKyBoZWlnaHREaWYpO1xyXG4gICAgICAgIGN0eC5saW5lVG8oeCArIHdpZHRoIC8gMiwgeSArIHJhZGl1cyk7XHJcbiAgICAgICAgY3R4LmxpbmVUbyh4ICsgd2lkdGggLSB3aWR0aERpZiwgeSArIGhlaWdodERpZik7XHJcbiAgICAgICAgY3R4LmxpbmVUbyh4ICsgd2lkdGggLSB3aWR0aERpZiwgeSArIGhlaWdodCAtIGhlaWdodERpZik7XHJcbiAgICAgICAgY3R4LmxpbmVUbyh4ICsgd2lkdGggLyAyLCB5ICsgaGVpZ2h0IC0gcmFkaXVzKTtcclxuICAgICAgICBjdHgubGluZVRvKHggKyB3aWR0aERpZiwgeSArIGhlaWdodCAtIGhlaWdodERpZik7XHJcbiAgICAgICAgY3R4LmNsb3NlUGF0aCgpO1xyXG4gICAgfTtcclxuXHJcbiAgICBpZiAoZmxhdCkgcmVuZGVyRmxhdCgpO1xyXG4gICAgZWxzZSByZW5kZXJUYWxsKCk7XHJcbiAgICBjdHguc3Ryb2tlKCk7XHJcbiAgICB4ICs9IHN0cm9rZVdpZHRoO1xyXG4gICAgeSArPSBzdHJva2VXaWR0aDtcclxuICAgIHdpZHRoIC09IHN0cm9rZVdpZHRoICogMjtcclxuICAgIGhlaWdodCAtPSBzdHJva2VXaWR0aCAqIDI7XHJcbiAgICByYWRpdXMgLT0gc3Ryb2tlV2lkdGggLyAzO1xyXG4gICAgY3R4Lmdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbiA9IFwiZGVzdGluYXRpb24tb3V0XCI7XHJcbiAgICBpZiAoZmxhdCkgcmVuZGVyRmxhdCgpO1xyXG4gICAgZWxzZSByZW5kZXJUYWxsKCk7XHJcbiAgICBjdHguc3Ryb2tlKCk7XHJcbiAgICBjdHguZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uID0gXCJzb3VyY2Utb3ZlclwiO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRBYmlsaXR5SW1hZ2VzKGNsYXNzVHlwZTogQ2xhc3NUeXBlLCBsZXZlbDogbnVtYmVyLCBzcGVjOiBudW1iZXIpOiBIVE1MSW1hZ2VFbGVtZW50W10ge1xyXG4gICAgbGV0IGFiaWxpdHlJbWFnZXM6IEhUTUxJbWFnZUVsZW1lbnRbXSA9IFtcclxuICAgICAgICBhc3NldE1hbmFnZXIuaW1hZ2VzW1wiZW1wdHlJY29uXCJdLFxyXG4gICAgICAgIGFzc2V0TWFuYWdlci5pbWFnZXNbXCJlbXB0eUljb25cIl0sXHJcbiAgICAgICAgYXNzZXRNYW5hZ2VyLmltYWdlc1tcImx2bDZcIl0sXHJcbiAgICAgICAgYXNzZXRNYW5hZ2VyLmltYWdlc1tcImx2bDEwXCJdLFxyXG4gICAgICAgIGFzc2V0TWFuYWdlci5pbWFnZXNbXCJsdmw2XCJdLFxyXG4gICAgXTtcclxuXHJcbiAgICBzd2l0Y2ggKGNsYXNzVHlwZSkge1xyXG4gICAgICAgIGNhc2UgXCJkYWdnZXJzXCI6XHJcbiAgICAgICAgICAgIGlmIChzcGVjID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBhYmlsaXR5SW1hZ2VzWzBdID0gYXNzZXRNYW5hZ2VyLmltYWdlc1tcInN0YWJJY29uXCJdO1xyXG4gICAgICAgICAgICAgICAgYWJpbGl0eUltYWdlc1sxXSA9IGFzc2V0TWFuYWdlci5pbWFnZXNbXCJsdW5nZUljb25cIl07XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc3BlYyA9PT0gMSkge1xyXG4gICAgICAgICAgICAgICAgLy8gTW9ua1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHNwZWMgPT09IDIpIHtcclxuICAgICAgICAgICAgICAgIC8vIEFzc2Fzc2luXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBcInN3b3JkXCI6XHJcbiAgICAgICAgICAgIGlmIChzcGVjID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBhYmlsaXR5SW1hZ2VzWzBdID0gYXNzZXRNYW5hZ2VyLmltYWdlc1tcInNsYXNoSWNvblwiXTtcclxuICAgICAgICAgICAgICAgIGFiaWxpdHlJbWFnZXNbMV0gPSBhc3NldE1hbmFnZXIuaW1hZ2VzW1wid2hpcmx3aW5kSWNvblwiXTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChzcGVjID09PSAxKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBCZXJzZXJrZXJcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChzcGVjID09PSAyKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBCbGFkZW1hc3RlclxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgXCJoYW1tZXJcIjpcclxuICAgICAgICAgICAgaWYgKHNwZWMgPT09IDApIHtcclxuICAgICAgICAgICAgICAgIGFiaWxpdHlJbWFnZXNbMF0gPSBhc3NldE1hbmFnZXIuaW1hZ2VzW1wic3dpbmdJY29uXCJdO1xyXG4gICAgICAgICAgICAgICAgYWJpbGl0eUltYWdlc1sxXSA9IGFzc2V0TWFuYWdlci5pbWFnZXNbXCJwb3VuZEljb25cIl07XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc3BlYyA9PT0gMSkge1xyXG4gICAgICAgICAgICAgICAgLy8gUGFsYWRpblxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHNwZWMgPT09IDIpIHtcclxuICAgICAgICAgICAgICAgIC8vIFdhcmRlblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlVua25vd24gY2xhc3MgdHlwZSBpbiBVc2VySW50ZXJmYWNlJ3MgZ2V0QWJpbGl0eUltYWdlc1wiKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gYWJpbGl0eUltYWdlcztcclxufVxyXG5cclxuZXhwb3J0IHR5cGUgU3dvcmRDbGFzcyA9IHtcclxuICAgIHR5cGU6IFwic3dvcmRcIjtcclxuICAgIHNwZWM6IFN3b3JkQ2xhc3M7XHJcbn07XHJcbmV4cG9ydCB0eXBlIFN3b3JkU3BlYyA9IFwiYmVyc2Vya2VyXCIgfCBcImJsYWRlc21hblwiO1xyXG5cclxuZXhwb3J0IHR5cGUgRGFnZ2Vyc0NsYXNzID0ge1xyXG4gICAgdHlwZTogXCJkYWdnZXJzXCI7XHJcbiAgICBzcGVjOiBEYWdnZXJzU3BlYztcclxufTtcclxuZXhwb3J0IHR5cGUgRGFnZ2Vyc1NwZWMgPSBcIm1vbmtcIiB8IFwiYXNzYXNzaW5cIjtcclxuXHJcbmV4cG9ydCB0eXBlIEhhbW1lckNsYXNzID0ge1xyXG4gICAgdHlwZTogXCJoYW1tZXJcIjtcclxuICAgIHNwZWM6IEhhbW1lclNwZWM7XHJcbn07XHJcbmV4cG9ydCB0eXBlIEhhbW1lclNwZWMgPSBcInBhbGFkaW5cIiB8IFwid2FyZGVuXCI7XHJcblxyXG52YXIgcGxheWVySW5mbzogSGFtbWVyQ2xhc3MgfCBEYWdnZXJzQ2xhc3MgfCBTd29yZENsYXNzO1xyXG4iLCJpbXBvcnQgeyBWZWN0b3IgfSBmcm9tIFwiLi4vLi4vdmVjdG9yXCI7XHJcbmltcG9ydCB7IEZsb29yIH0gZnJvbSBcIi4uL3RlcnJhaW4vZmxvb3IvZmxvb3JcIjtcclxuaW1wb3J0IHsgQWN0b3JPYmplY3QgfSBmcm9tIFwiLi9hY3Rvck9iamVjdHMvYWN0b3JPYmplY3RcIjtcclxuaW1wb3J0IHsgVHJhbnNsYXRpb25OYW1lIH0gZnJvbSBcIi4vYWN0b3JPYmplY3RzL3RyYW5zbGF0aW9uc1wiO1xyXG5pbXBvcnQgeyBTZXJ2ZXJBY3RvciB9IGZyb20gXCIuL3NlcnZlckFjdG9ycy9zZXJ2ZXJBY3RvclwiO1xyXG5cclxuZXhwb3J0IHR5cGUgQWN0b3JUeXBlID0gXCJ0ZXN0TW9iXCIgfCBcImRhZ2dlcnNQbGF5ZXJcIiB8IFwic3dvcmRQbGF5ZXJcIiB8IFwiaGFtbWVyUGxheWVyXCI7XHJcbmV4cG9ydCB0eXBlIFN3b3JkU3BlYyA9IFwiaGVhdnlcIiB8IFwibGlnaHRcIjtcclxuZXhwb3J0IHR5cGUgRGFnZ2Vyc1NwZWMgPSBcIm91dGxhd1wiIHwgXCJhc3Nhc3NpbmF0aW9uXCI7XHJcbmV4cG9ydCB0eXBlIEhhbW1lclNwZWMgPSBcIndhcmRlblwiIHwgXCJwYWxhZGluXCI7XHJcblxyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgQWN0b3Ige1xyXG4gICAgcHJvdGVjdGVkIGFic3RyYWN0IGFjdG9yT2JqZWN0OiBBY3Rvck9iamVjdDtcclxuICAgIHByb3RlY3RlZCBhYnN0cmFjdCBsYXN0SGl0QnlBY3RvcjogQWN0b3I7XHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgcHJvdGVjdGVkIGFjdG9yVHlwZTogQWN0b3JUeXBlLFxyXG4gICAgICAgIHByb3RlY3RlZCBpZDogbnVtYmVyLFxyXG4gICAgICAgIHB1YmxpYyByZWFkb25seSBwb3NpdGlvbjogVmVjdG9yLFxyXG4gICAgICAgIHB1YmxpYyByZWFkb25seSBtb21lbnR1bTogVmVjdG9yLFxyXG4gICAgICAgIHByb3RlY3RlZCBoZWFsdGhJbmZvOiB7IGhlYWx0aDogbnVtYmVyOyBtYXhIZWFsdGg6IG51bWJlciB9LFxyXG4gICAgKSB7fVxyXG5cclxuICAgIHB1YmxpYyBnZXRDb2xsaXNpb25SYW5nZSgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmFjdG9yT2JqZWN0LmdldENvbGxpc2lvblJhbmdlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldEFjdG9yVHlwZSgpOiBBY3RvclR5cGUge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmFjdG9yVHlwZTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXRBY3RvcklkKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaWQ7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0TWF4SGVhbHRoKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaGVhbHRoSW5mby5tYXhIZWFsdGg7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0SGVhbHRoKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaGVhbHRoSW5mby5oZWFsdGg7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0SGVhbHRoSW5mbygpOiB7IGhlYWx0aDogbnVtYmVyOyBtYXhIZWFsdGg6IG51bWJlciB9IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5oZWFsdGhJbmZvO1xyXG4gICAgfVxyXG4gICAgcHVibGljIHN0YXJ0VHJhbnNsYXRpb24oYW5nbGU6IG51bWJlciwgdHJhbnNsYXRpb25OYW1lOiBUcmFuc2xhdGlvbk5hbWUpIHtcclxuICAgICAgICB0aGlzLmFjdG9yT2JqZWN0LnN0YXJ0VHJhbnNsYXRpb24oYW5nbGUsIHRyYW5zbGF0aW9uTmFtZSk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgdXBkYXRlUG9zaXRpb25BbmRNb21lbnR1bShtb21lbnR1bTogVmVjdG9yLCBwb3NpdGlvbjogVmVjdG9yKSB7XHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbi54ID0gcG9zaXRpb24ueCArIDA7XHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbi55ID0gcG9zaXRpb24ueSArIDA7XHJcbiAgICAgICAgdGhpcy5tb21lbnR1bS54ID0gbW9tZW50dW0ueCArIDA7XHJcbiAgICAgICAgdGhpcy5tb21lbnR1bS55ID0gbW9tZW50dW0ueSArIDA7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFic3RyYWN0IHVwZGF0ZShlbGFwc2VkVGltZTogbnVtYmVyKTogdm9pZDtcclxuXHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgcmVnaXN0ZXJEYW1hZ2UoXHJcbiAgICAgICAgb3JpZ2luQWN0b3I6IEFjdG9yLFxyXG4gICAgICAgIHF1YW50aXR5OiBudW1iZXIsXHJcbiAgICAgICAga25vY2tiYWNrOiBWZWN0b3IgfCB1bmRlZmluZWQsXHJcbiAgICAgICAgdHJhbnNsYXRpb25EYXRhOiB7IG5hbWU6IFRyYW5zbGF0aW9uTmFtZTsgYW5nbGU6IG51bWJlciB9IHwgdW5kZWZpbmVkLFxyXG4gICAgKTogeyBpZktpbGxlZDogYm9vbGVhbjsgZGFtYWdlRGVhbHQ6IG51bWJlciB9O1xyXG5cclxuICAgIHB1YmxpYyBhYnN0cmFjdCByZWdpc3RlckhlYWwocXVhbnRpdHk6IG51bWJlcik6IHZvaWQ7XHJcblxyXG4gICAgLy9wcm90ZWN0ZWQgYWJzdHJhY3QgcmVnaXN0ZXJEZWF0aCgpOiB2b2lkO1xyXG5cclxuICAgIHB1YmxpYyByZWdpc3RlckRhbWFnZURvbmUocXVhbnRpdHk6IG51bWJlcik6IHZvaWQge31cclxuICAgIHB1YmxpYyByZWdpc3RlcktpbGxEb25lKCk6IHZvaWQge31cclxuXHJcbiAgICBwdWJsaWMgcmVnaXN0ZXJLbm9ja2JhY2soZm9yY2U6IFZlY3Rvcikge1xyXG4gICAgICAgIHRoaXMuYWN0b3JPYmplY3QucmVnaXN0ZXJLbm9ja2JhY2soZm9yY2UpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIHAxIHN0YXJ0IHBvaW50IG9mIHRoZSBsaW5lLlxyXG4gICAgICogQHBhcmFtIHAyIGVuZCBwb2ludCBvZiB0aGUgbGluZS5cclxuICAgICAqIEByZXR1cm5zIHJldHVybnMgdHJ1ZSBpZiB0aGUgbGluZSBpbnRlcnNlY3RzIHdpdGggdGhlIHNoYXBlLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgY2hlY2tJZkNvbGxpZGVzV2l0aExpbmUocDE6IFZlY3RvciwgcDI6IFZlY3Rvcik6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmFjdG9yT2JqZWN0LmNoZWNrSWZDb2xsaWRlc1dpdGhMaW5lKHAxLCBwMik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0gbGFyZ2VTaGFwZSBTaGFwZSBvZiB0aGUgb2JqZWN0IGluIHF1ZXN0aW9uLlxyXG4gICAgICogQHJldHVybnMgdHJ1ZSBpZiBhbnkgcG9pbnQgb2YgdGhpcyBhY3Rvck9iamVjdCBmYWxscyBpbnNpZGUgdGhlIG9iamVjdCBpbiBxdWVzdGlvbi5cclxuICAgICAqL1xyXG4gICAgcHVibGljIGlmSW5zaWRlTGFyZ2VyU2hhcGUobGFyZ2VTaGFwZTogVmVjdG9yW10pOiBib29sZWFuIHtcclxuICAgICAgICBpZiAodGhpcy5hY3Rvck9iamVjdC5pZkluc2lkZUxhcmdlclNoYXBlKGxhcmdlU2hhcGUpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSBzbWFsbFNoYXBlIFNoYXBlIG9mIHRoZSBvYmplY3QgaW4gcXVlc3Rpb24uXHJcbiAgICAgKiBAcmV0dXJucyB0cnVlIGlmIGFueSBwb2ludCBvZiB0aGUgb2JqZWN0IGluIHF1ZXN0aW9uIGZhbGxzIGluc2lkZSB0aGlzIGFjdG9yT2JqZWN0LlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgaWZJbnNpZGVTbWFsbGVyU2hhcGUoc21hbGxTaGFwZTogVmVjdG9yW10pOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5hY3Rvck9iamVjdC5pZkluc2lkZVNtYWxsZXJTaGFwZShzbWFsbFNoYXBlKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBTaXplIH0gZnJvbSBcIi4uLy4uL3NpemVcIjtcclxuaW1wb3J0IHsgVmVjdG9yIH0gZnJvbSBcIi4uLy4uL3ZlY3RvclwiO1xyXG5pbXBvcnQgeyBQbGF5ZXJNb2RlbENvbmZpZywgcGxheWVyTW9kZWxDb25maWcgfSBmcm9tIFwiLi9jbGllbnRBY3RvcnMvbW9kZWwvcGxheWVyTW9kZWxzL3BsYXllck1vZGVsXCI7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEFjdG9yQ29uZmlnIHtcclxuICAgIGdhbWVTcGVlZDogbnVtYmVyO1xyXG4gICAgZGlydENvbG9yTmlnaHQ6IHN0cmluZztcclxuICAgIGRpcnRDb2xvckRheTogc3RyaW5nO1xyXG4gICAgcGxheWVyU3RhcnQ6IFZlY3RvcjtcclxuICAgIHBsYXllclNpemU6IFNpemU7XHJcbiAgICBwbGF5ZXJDcm91Y2hTaXplOiBTaXplO1xyXG4gICAgcGxheWVyTWFzczogbnVtYmVyO1xyXG4gICAgcGxheWVyTWF4SGVhbHRoOiBudW1iZXI7XHJcbiAgICBwbGF5ZXJKdW1wSGVpZ2h0OiBudW1iZXI7XHJcbiAgICBtYXhTaWRld2F5c01vbWVudHVtOiBudW1iZXI7XHJcbiAgICBzdGFuZGluZ1NpZGV3YXlzQWNjZWxlcmF0aW9uOiBudW1iZXI7XHJcbiAgICBub25TdGFuZGluZ1NpZGV3YXlzQWNjZWxlcmF0aW9uOiBudW1iZXI7XHJcbiAgICBmYWxsaW5nQWNjZWxlcmF0aW9uOiBudW1iZXI7XHJcbiAgICBYUFBlckxldmVsOiBudW1iZXI7XHJcbiAgICBMZXZlbFhQTXVsdGlwbGllcjogbnVtYmVyO1xyXG4gICAgZ2xvYmFsQ29vbGRvd246IG51bWJlcjtcclxuICAgIHBsYXllck1vZGVsQ29uZmlnOiBQbGF5ZXJNb2RlbENvbmZpZztcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGRlZmF1bHRBY3RvckNvbmZpZzogQWN0b3JDb25maWcgPSB7XHJcbiAgICBnYW1lU3BlZWQ6IDEsXHJcbiAgICBkaXJ0Q29sb3JOaWdodDogXCIjMWMyNjJjXCIsXHJcbiAgICBkaXJ0Q29sb3JEYXk6IFwiIzQwMmYxN1wiLFxyXG4gICAgcGxheWVyU3RhcnQ6IHtcclxuICAgICAgICB4OiAzMDAsXHJcbiAgICAgICAgeTogNjUwLFxyXG4gICAgfSxcclxuICAgIHBsYXllclNpemU6IHtcclxuICAgICAgICB3aWR0aDogNTMsXHJcbiAgICAgICAgaGVpZ2h0OiA1NSxcclxuICAgIH0sXHJcbiAgICBwbGF5ZXJDcm91Y2hTaXplOiB7XHJcbiAgICAgICAgd2lkdGg6IDU3LFxyXG4gICAgICAgIGhlaWdodDogMzYsXHJcbiAgICB9LFxyXG4gICAgcGxheWVyTWFzczogMTAsXHJcbiAgICBwbGF5ZXJNYXhIZWFsdGg6IDEwMCxcclxuICAgIHBsYXllckp1bXBIZWlnaHQ6IDEwMDAsXHJcbiAgICBtYXhTaWRld2F5c01vbWVudHVtOiA1MDAsIC8vNDAwXHJcbiAgICBzdGFuZGluZ1NpZGV3YXlzQWNjZWxlcmF0aW9uOiA2MDAwLCAvLzgwMDBcclxuICAgIG5vblN0YW5kaW5nU2lkZXdheXNBY2NlbGVyYXRpb246IDE1MDAsIC8vMTUwMFxyXG4gICAgZmFsbGluZ0FjY2VsZXJhdGlvbjogMzAwLFxyXG4gICAgWFBQZXJMZXZlbDogMjAsXHJcbiAgICBMZXZlbFhQTXVsdGlwbGllcjogMS4xLFxyXG4gICAgZ2xvYmFsQ29vbGRvd246IDAuMixcclxuICAgIHBsYXllck1vZGVsQ29uZmlnLFxyXG59O1xyXG4iLCJpbXBvcnQgeyBHbG9iYWxPYmplY3RzIH0gZnJvbSBcIi4uLy4uLy4uL2NsaWVudC9nYW1lXCI7XHJcbmltcG9ydCB7IGRlZmF1bHRDb25maWcgfSBmcm9tIFwiLi4vLi4vLi4vY29uZmlnXCI7XHJcbmltcG9ydCB7IGlmSW5zaWRlIH0gZnJvbSBcIi4uLy4uLy4uL2lmSW5zaWRlXCI7XHJcbmltcG9ydCB7IGlmSW50ZXJzZWN0IH0gZnJvbSBcIi4uLy4uLy4uL2lmSW50ZXJzZWN0XCI7XHJcbmltcG9ydCB7IFNpemUgfSBmcm9tIFwiLi4vLi4vLi4vc2l6ZVwiO1xyXG5pbXBvcnQgeyByb3RhdGVWZWN0b3IsIFNoYXBlLCBWZWN0b3IgfSBmcm9tIFwiLi4vLi4vLi4vdmVjdG9yXCI7XHJcbmltcG9ydCB7IERvb2RhZCB9IGZyb20gXCIuLi8uLi90ZXJyYWluL2Rvb2RhZHMvZG9vZGFkXCI7XHJcbmltcG9ydCB7IEZsb29yIH0gZnJvbSBcIi4uLy4uL3RlcnJhaW4vZmxvb3IvZmxvb3JcIjtcclxuaW1wb3J0IHsgQWN0b3IgfSBmcm9tIFwiLi4vYWN0b3JcIjtcclxuaW1wb3J0IHsgZGVmYXVsdEFjdG9yQ29uZmlnIH0gZnJvbSBcIi4uL2FjdG9yQ29uZmlnXCI7XHJcbmltcG9ydCB7IFRyYW5zbGF0aW9uRGF0YSwgVHJhbnNsYXRpb25OYW1lLCBUcmFuc2xhdGlvbiwgdHJhbnNsYXRpb25zLCByb3RhdGVLZXkgfSBmcm9tIFwiLi90cmFuc2xhdGlvbnNcIjtcclxuXHJcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBBY3Rvck9iamVjdCB7XHJcbiAgICBwcm90ZWN0ZWQgeFNpemU6IG51bWJlciA9IGRlZmF1bHRDb25maWcueFNpemU7XHJcbiAgICBwcm90ZWN0ZWQgeVNpemU6IG51bWJlciA9IGRlZmF1bHRDb25maWcueVNpemU7XHJcblxyXG4gICAgLy9yZWN0YW5nbGUgdmVjdG9yXHJcbiAgICAvL3BsYXRmb3JtIHZlY3RvclxyXG4gICAgLy9mbG9vciBwb2ludGVyXHJcblxyXG4gICAgcHJpdmF0ZSB0cmFuc2xhdGlvbkRhdGE6IFRyYW5zbGF0aW9uRGF0YSA9IHtcclxuICAgICAgICB0cmFuc2xhdGVJbmZvOiB1bmRlZmluZWQsXHJcbiAgICAgICAga2V5SW5kZXg6IDAsXHJcbiAgICAgICAgb3JpZ2luYWxQb3NpdGlvbjogeyB4OiAwLCB5OiAwIH0sXHJcbiAgICAgICAgY291bnRlcjogMCxcclxuICAgICAgICBrZXlUaW1lTGVuZ3RoOiAwLFxyXG4gICAgICAgIGFuZ2xlOiAwLFxyXG4gICAgfTtcclxuXHJcbiAgICAvL3Bvc2l0aW9uIHNvbHZlclxyXG4gICAgcHJvdGVjdGVkIHJlYWRvbmx5IHByZXZpb3VzTW9tZW50dW06IFZlY3RvciA9IHsgeDogMCwgeTogMCB9O1xyXG4gICAgcHJvdGVjdGVkIHJlYWRvbmx5IHByZXZpb3VzUG9zaXRpb246IFZlY3RvciA9IHsgeDogMCwgeTogMCB9O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHByb3RlY3RlZCBnbG9iYWxPYmplY3RzOiBHbG9iYWxPYmplY3RzLFxyXG4gICAgICAgIHByb3RlY3RlZCByZWFkb25seSBiYXNlQWN0b3I6IEFjdG9yLFxyXG4gICAgICAgIHByb3RlY3RlZCByZWFkb25seSBwb3NpdGlvbjogVmVjdG9yLFxyXG4gICAgICAgIHByb3RlY3RlZCByZWFkb25seSBtb21lbnR1bTogVmVjdG9yLFxyXG4gICAgICAgIHByb3RlY3RlZCBzaXplOiBTaXplLFxyXG4gICAgICAgIHByb3RlY3RlZCBtYXNzOiBudW1iZXIsXHJcbiAgICApIHtcclxuICAgICAgICB0aGlzLnByZXZpb3VzTW9tZW50dW0ueCA9IHRoaXMubW9tZW50dW0ueDtcclxuICAgICAgICB0aGlzLnByZXZpb3VzTW9tZW50dW0ueSA9IHRoaXMubW9tZW50dW0ueTtcclxuICAgICAgICB0aGlzLnByZXZpb3VzUG9zaXRpb24ueCA9IHRoaXMucG9zaXRpb24ueDtcclxuICAgICAgICB0aGlzLnByZXZpb3VzUG9zaXRpb24ueSA9IHRoaXMucG9zaXRpb24ueTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgZ2V0R2xvYmFsU2hhcGUoKTogU2hhcGU7XHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgZ2V0Q29sbGlzaW9uUmFuZ2UoKTogbnVtYmVyO1xyXG4gICAgcHVibGljIGFic3RyYWN0IHJlZ2lzdGVyR3JvdW5kQW5nbGUoYW5nbGU6IG51bWJlciwgc3RhbmRpbmc6IGJvb2xlYW4pOiB2b2lkO1xyXG5cclxuICAgIHB1YmxpYyBjaGVja0lmQ29sbGlkZXNXaXRoTGluZShwMTogVmVjdG9yLCBwMjogVmVjdG9yKTogYm9vbGVhbiB7XHJcbiAgICAgICAgbGV0IHBlcnNvbmFsU2hhcGU6IFNoYXBlID0gdGhpcy5nZXRHbG9iYWxTaGFwZSgpO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpOiBudW1iZXIgPSAwOyBpIDwgcGVyc29uYWxTaGFwZS5lZGdlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoaWZJbnRlcnNlY3QocGVyc29uYWxTaGFwZS5lZGdlc1tpXS5wMSwgcGVyc29uYWxTaGFwZS5lZGdlc1tpXS5wMiwgcDEsIHAyKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy9sYXN0IGNoZWNrIGluIGNhc2UgdGhlIGxpbmUgaXMgaW5zaWRlIG9iamVjdFxyXG4gICAgICAgIGlmIChpZkluc2lkZShwMSwgcGVyc29uYWxTaGFwZS5wb2ludHMpKSByZXR1cm4gdHJ1ZTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgaWZJbnNpZGVMYXJnZXJTaGFwZShsYXJnZVNoYXBlOiBWZWN0b3JbXSk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGxldCBwZXJzb25hbFNoYXBlOiBTaGFwZSA9IHRoaXMuZ2V0R2xvYmFsU2hhcGUoKTtcclxuICAgICAgICBmb3IgKGxldCBpOiBudW1iZXIgPSAwOyBpIDwgcGVyc29uYWxTaGFwZS5wb2ludHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKGlmSW5zaWRlKHBlcnNvbmFsU2hhcGUucG9pbnRzW2ldLCBsYXJnZVNoYXBlKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGlmSW5zaWRlU21hbGxlclNoYXBlKHNtYWxsU2hhcGU6IFZlY3RvcltdKTogYm9vbGVhbiB7XHJcbiAgICAgICAgbGV0IHBlcnNvbmFsU2hhcGU6IFNoYXBlID0gdGhpcy5nZXRHbG9iYWxTaGFwZSgpO1xyXG4gICAgICAgIGZvciAobGV0IGk6IG51bWJlciA9IDA7IGkgPCBzbWFsbFNoYXBlLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChpZkluc2lkZShzbWFsbFNoYXBlW2ldLCBwZXJzb25hbFNoYXBlLnBvaW50cykpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgcmVnaXN0ZXJHcmF2aXR5KGVsYXBzZWRUaW1lOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLm1vbWVudHVtLnkgKz0gZGVmYXVsdEFjdG9yQ29uZmlnLmZhbGxpbmdBY2NlbGVyYXRpb24gKiBlbGFwc2VkVGltZSAqIHRoaXMubWFzcztcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgcmVnaXN0ZXJHcm91bmRGcmljdGlvbihlbGFwc2VkVGltZTogbnVtYmVyKSB7XHJcbiAgICAgICAgLy9pZiAoTWF0aC5hYnModGhpcy5tb21lbnR1bS54KSA8PSAxMCkgdGhpcy5tb21lbnR1bS54ID0gMDtcclxuICAgICAgICAvL2Vsc2UgdGhpcy5tb21lbnR1bS54IC09IGVsYXBzZWRUaW1lICogdGhpcy5tYXNzICogKHRoaXMubW9tZW50dW0ueCA8PSAwID8gLTEgOiAxKSAqIDYwMDtcclxuICAgICAgICBpZiAodGhpcy5tb21lbnR1bS54ID4gMCkge1xyXG4gICAgICAgICAgICB0aGlzLm1vbWVudHVtLnggLT0gZWxhcHNlZFRpbWUgKiB0aGlzLm1hc3MgKiA2MDA7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm1vbWVudHVtLnggPCAwKSB0aGlzLm1vbWVudHVtLnggPSAwO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5tb21lbnR1bS54IDwgMCkge1xyXG4gICAgICAgICAgICB0aGlzLm1vbWVudHVtLnggKz0gZWxhcHNlZFRpbWUgKiB0aGlzLm1hc3MgKiA2MDA7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm1vbWVudHVtLnggPiAwKSB0aGlzLm1vbWVudHVtLnggPSAwO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgcmVnaXN0ZXJBaXJSZXNpc3RhbmNlKGVsYXBzZWRUaW1lOiBudW1iZXIpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgICAgaWYgKE1hdGguYWJzKHRoaXMubW9tZW50dW0ueCkgPD0gMykgdGhpcy5tb21lbnR1bS54ID0gMDtcclxuICAgICAgICBlbHNlIHRoaXMubW9tZW50dW0ueCAtPSBlbGFwc2VkVGltZSAqIHRoaXMubWFzcyAqICh0aGlzLm1vbWVudHVtLnggPD0gMCA/IC0xIDogMSkgKiAzMDtcclxuXHJcbiAgICAgICAgaWYgKE1hdGguYWJzKHRoaXMubW9tZW50dW0ueSkgPD0gMykgdGhpcy5tb21lbnR1bS55ID0gMDtcclxuICAgICAgICBlbHNlIHRoaXMubW9tZW50dW0ueSAtPSBlbGFwc2VkVGltZSAqIHRoaXMubWFzcyAqICh0aGlzLm1vbWVudHVtLnkgPD0gMCA/IC0xIDogMSkgKiAzMDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVnaXN0ZXJLbm9ja2JhY2soZm9yY2U6IFZlY3Rvcikge1xyXG4gICAgICAgIHRoaXMubW9tZW50dW0ueCA9IChmb3JjZS54ICogMyArIHRoaXMubW9tZW50dW0ueCkgLyA0O1xyXG4gICAgICAgIHRoaXMubW9tZW50dW0ueSA9IChmb3JjZS55ICogMyArIHRoaXMubW9tZW50dW0ueSkgLyA0O1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBjaGVja1hCb3VuZGFyeUNvbGxpc2lvbigpIHtcclxuICAgICAgICBpZiAodGhpcy5wb3NpdGlvbi54IC0gdGhpcy5zaXplLndpZHRoIC8gMiA8IDApIHtcclxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbi54ID0gdGhpcy5zaXplLndpZHRoIC8gMjtcclxuICAgICAgICAgICAgdGhpcy5tb21lbnR1bS54ID0gTWF0aC5tYXgodGhpcy5tb21lbnR1bS54LCAwKTtcclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMucG9zaXRpb24ueCArIHRoaXMuc2l6ZS53aWR0aCAvIDIgPiB0aGlzLnhTaXplKSB7XHJcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb24ueCA9IHRoaXMueFNpemUgLSB0aGlzLnNpemUud2lkdGggLyAyO1xyXG4gICAgICAgICAgICB0aGlzLm1vbWVudHVtLnggPSBNYXRoLm1pbih0aGlzLm1vbWVudHVtLngsIDApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgY2hlY2tZQm91bmRhcnlDb2xsaXNpb24oKTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKHRoaXMucG9zaXRpb24ueSAtIHRoaXMuc2l6ZS5oZWlnaHQgLyAyIDwgMSkge1xyXG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uLnkgPSB0aGlzLnNpemUuaGVpZ2h0IC8gMiArIDE7XHJcbiAgICAgICAgICAgIHRoaXMubW9tZW50dW0ueSA9IE1hdGgubWF4KHRoaXMubW9tZW50dW0ueSwgMCk7XHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLnBvc2l0aW9uLnkgKyB0aGlzLnNpemUuaGVpZ2h0IC8gMiA+IHRoaXMueVNpemUpIHtcclxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbi55ID0gdGhpcy55U2l6ZSAtIHRoaXMuc2l6ZS5oZWlnaHQgLyAyO1xyXG4gICAgICAgICAgICB0aGlzLm1vbWVudHVtLnkgPSBNYXRoLm1pbih0aGlzLm1vbWVudHVtLnksIDApO1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBjaGVja1JlY3RhbmdsZXMoZWxhcHNlZFRpbWU6IG51bWJlcikge1xyXG4gICAgICAgIC8vZm9yIGVhY2ggcmVjdGFuZ2xlLCBjaGVjayByZWN0YW5nbGUgY29sbGlzaW9uIElGIG5vIHRyYW5zbGF0aW9uIG9yIHRyYW5zbGF0aW9uIGFsbG93cyBpdFxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY2hlY2tSZWN0YW5nbGVDb2xsaXNpb24oZWxhcHNlZFRpbWU6IG51bWJlcikge31cclxuXHJcbiAgICBwcm90ZWN0ZWQgY2hlY2tQbGF0Zm9ybXMoZWxhcHNlZFRpbWU6IG51bWJlcikge1xyXG4gICAgICAgIC8vZm9yIGVhY2ggcGxhdGZvcm0sIGNoZWNrIHBsYXRmb3JtIGNvbGxpc2lvbiBJRiBubyB0cmFuc2xhdGlvbiBvciB0cmFuc2xhdGlvbiBhbGxvd3MgaXRcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNoZWNrUGxhdGZvcm1Db2xsaXNpb24oZWxhcHNlZFRpbWU6IG51bWJlcikge31cclxuXHJcbiAgICBwcm90ZWN0ZWQgY2hlY2tHcm91bmRDb2xsaXNpb24oZWxhcHNlZFRpbWU6IG51bWJlcik6IHsgaGl0OiBib29sZWFuOyBhbmdsZTogbnVtYmVyIH0ge1xyXG4gICAgICAgIGxldCBkYXRhOiB7IHlDb29yZDogbnVtYmVyOyBhbmdsZTogbnVtYmVyIH0gPSB0aGlzLmdsb2JhbE9iamVjdHMuZmxvb3IuZ2V0WUNvb3JkQW5kQW5nbGUodGhpcy5wb3NpdGlvbi54KTtcclxuICAgICAgICBsZXQgZmVldFBvczogbnVtYmVyID0gdGhpcy5wb3NpdGlvbi55ICsgdGhpcy5zaXplLmhlaWdodCAvIDI7XHJcbiAgICAgICAgbGV0IGlmSGl0OiBib29sZWFuID0gZmFsc2U7XHJcbiAgICAgICAgaWYgKGRhdGEueUNvb3JkIDwgZmVldFBvcykge1xyXG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uLnkgPSBkYXRhLnlDb29yZCAtIHRoaXMuc2l6ZS5oZWlnaHQgLyAyO1xyXG4gICAgICAgICAgICB0aGlzLm1vbWVudHVtLnkgPSBNYXRoLm1pbih0aGlzLm1vbWVudHVtLnksIDApO1xyXG4gICAgICAgICAgICBpZkhpdCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB7IGhpdDogaWZIaXQsIGFuZ2xlOiBkYXRhLmFuZ2xlIH07XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGNoZWNrRG9vZGFkcygpIHtcclxuICAgICAgICBsZXQgYWN0b3JTaGFwZTogU2hhcGUgPSB0aGlzLmdldEdsb2JhbFNoYXBlKCk7XHJcbiAgICAgICAgdGhpcy5nbG9iYWxPYmplY3RzLmRvb2RhZHMuZm9yRWFjaCgoZG9vZGFkKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuY2hlY2tEb29kYWRDb2xsaXNpb24oYWN0b3JTaGFwZSwgZG9vZGFkKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgY2hlY2tEb29kYWRDb2xsaXNpb24oYWN0b3JTaGFwZTogU2hhcGUsIGRvb2RhZDogRG9vZGFkKSB7XHJcbiAgICAgICAgaWYgKGRvb2RhZC5jaGVja0NvbGxpc2lvblJhbmdlKHRoaXMucG9zaXRpb24sIHRoaXMuZ2V0Q29sbGlzaW9uUmFuZ2UoKSkpIHtcclxuICAgICAgICAgICAgaWYgKGRvb2RhZC5jaGVja09iamVjdEludGVyc2VjdGlvbihhY3RvclNoYXBlKSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHJlc3VsdHM6IHsgcG9zaXRpb25DaGFuZ2U6IFZlY3RvcjsgbW9tZW50dW1DaGFuZ2U6IFZlY3RvciB8IHVuZGVmaW5lZDsgYW5nbGU6IG51bWJlciB8IHVuZGVmaW5lZCB9ID1cclxuICAgICAgICAgICAgICAgICAgICBkb29kYWQucmVnaXN0ZXJDb2xsaXNpb25XaXRoQ2xvc2VzdFNvbHV0aW9uKGFjdG9yU2hhcGUsIHRoaXMubW9tZW50dW0pO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZWdpc3RlckRvb2RhZENvbGxpc2lvbihyZXN1bHRzLnBvc2l0aW9uQ2hhbmdlLCByZXN1bHRzLm1vbWVudHVtQ2hhbmdlLCByZXN1bHRzLmFuZ2xlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHJlZ2lzdGVyRG9vZGFkQ29sbGlzaW9uKHBvc2l0aW9uQ2hhbmdlOiBWZWN0b3IsIG1vbWVudHVtQ2hhbmdlOiBWZWN0b3IgfCB1bmRlZmluZWQsIGFuZ2xlOiBudW1iZXIgfCB1bmRlZmluZWQpIHtcclxuICAgICAgICB0aGlzLnBvc2l0aW9uLnggKz0gcG9zaXRpb25DaGFuZ2UueDtcclxuICAgICAgICB0aGlzLnBvc2l0aW9uLnkgKz0gcG9zaXRpb25DaGFuZ2UueTtcclxuICAgICAgICBpZiAobW9tZW50dW1DaGFuZ2UpIHtcclxuICAgICAgICAgICAgdGhpcy5tb21lbnR1bS54ID0gbW9tZW50dW1DaGFuZ2UueCArIDA7XHJcbiAgICAgICAgICAgIHRoaXMubW9tZW50dW0ueSA9IG1vbWVudHVtQ2hhbmdlLnkgKyAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoYW5nbGUpIHtcclxuICAgICAgICAgICAgdGhpcy5yZWdpc3Rlckdyb3VuZEFuZ2xlKGFuZ2xlLCB0cnVlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXJ0VHJhbnNsYXRpb24oYW5nbGU6IG51bWJlciwgdHJhbnNsYXRpb25OYW1lOiBUcmFuc2xhdGlvbk5hbWUpIHtcclxuICAgICAgICB0aGlzLnRyYW5zbGF0aW9uRGF0YS5vcmlnaW5hbFBvc2l0aW9uLnggPSB0aGlzLnBvc2l0aW9uLnggKyAwO1xyXG4gICAgICAgIHRoaXMudHJhbnNsYXRpb25EYXRhLm9yaWdpbmFsUG9zaXRpb24ueSA9IHRoaXMucG9zaXRpb24ueSArIDA7XHJcblxyXG4gICAgICAgIGxldCBuZXdUcmFuc2xhdGlvbjogVHJhbnNsYXRpb24gPSB0cmFuc2xhdGlvbnNbdHJhbnNsYXRpb25OYW1lXTtcclxuXHJcbiAgICAgICAgdGhpcy50cmFuc2xhdGlvbkRhdGEudHJhbnNsYXRlSW5mbyA9IHtcclxuICAgICAgICAgICAga2V5czogbmV3VHJhbnNsYXRpb24ua2V5cy5tYXAoKHgpID0+IHJvdGF0ZUtleSh4LCBhbmdsZSwgbmV3VHJhbnNsYXRpb24uZmxpcEFjcm9zc1kpKSxcclxuICAgICAgICAgICAgZmxpcEFjcm9zc1k6IG5ld1RyYW5zbGF0aW9uLmZsaXBBY3Jvc3NZLFxyXG4gICAgICAgICAgICBpZ25vcmVDb2xsaXNpb246IG5ld1RyYW5zbGF0aW9uLmlnbm9yZUNvbGxpc2lvbixcclxuICAgICAgICAgICAgaWdub3JlR3Jhdml0eTogbmV3VHJhbnNsYXRpb24uaWdub3JlR3Jhdml0eSxcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLnRyYW5zbGF0aW9uRGF0YS5rZXlJbmRleCA9IDA7XHJcbiAgICAgICAgdGhpcy50cmFuc2xhdGlvbkRhdGEuY291bnRlciA9IDA7XHJcblxyXG4gICAgICAgIHRoaXMudHJhbnNsYXRpb25EYXRhLmtleVRpbWVMZW5ndGggPSAwO1xyXG4gICAgICAgIHRoaXMudHJhbnNsYXRpb25EYXRhLnRyYW5zbGF0ZUluZm8ua2V5cy5mb3JFYWNoKChrZXkpID0+IHtcclxuICAgICAgICAgICAgdGhpcy50cmFuc2xhdGlvbkRhdGEua2V5VGltZUxlbmd0aCArPSBrZXkudGltZTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgdXBkYXRlVHJhbnNsYXRpb24oZWxhcHNlZFRpbWU6IG51bWJlcikge1xyXG4gICAgICAgIGlmICh0aGlzLnRyYW5zbGF0aW9uRGF0YS50cmFuc2xhdGVJbmZvICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhpcy50cmFuc2xhdGlvbkRhdGEuY291bnRlciArPSBlbGFwc2VkVGltZTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLnRyYW5zbGF0aW9uRGF0YS5jb3VudGVyID49IHRoaXMudHJhbnNsYXRpb25EYXRhLnRyYW5zbGF0ZUluZm8ua2V5c1t0aGlzLnRyYW5zbGF0aW9uRGF0YS5rZXlJbmRleF0udGltZSkge1xyXG4gICAgICAgICAgICAgICAgLy90aGlzLnBvc2l0aW9uLnggPSB0aGlzLnRyYW5zbGF0aW9uRGF0YS5vcmlnaW5hbFBvc2l0aW9uLnggKyB0aGlzLnRyYW5zbGF0aW9uRGF0YS50cmFuc2xhdGVJbmZvLmtleXNbdGhpcy50cmFuc2xhdGlvbkRhdGEua2V5SW5kZXhdLnBvcy54O1xyXG4gICAgICAgICAgICAgICAgLy90aGlzLnBvc2l0aW9uLnkgPSB0aGlzLnRyYW5zbGF0aW9uRGF0YS5vcmlnaW5hbFBvc2l0aW9uLnkgKyB0aGlzLnRyYW5zbGF0aW9uRGF0YS50cmFuc2xhdGVJbmZvLmtleXNbdGhpcy50cmFuc2xhdGlvbkRhdGEua2V5SW5kZXhdLnBvcy55O1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMudHJhbnNsYXRpb25EYXRhLmtleUluZGV4Kys7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRyYW5zbGF0aW9uRGF0YS5jb3VudGVyID0gMDtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLnRyYW5zbGF0aW9uRGF0YS5vcmlnaW5hbFBvc2l0aW9uLnggPSB0aGlzLnBvc2l0aW9uLnggKyAwO1xyXG4gICAgICAgICAgICAgICAgdGhpcy50cmFuc2xhdGlvbkRhdGEub3JpZ2luYWxQb3NpdGlvbi55ID0gdGhpcy5wb3NpdGlvbi55ICsgMDtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy50cmFuc2xhdGlvbkRhdGEua2V5SW5kZXggPT09IHRoaXMudHJhbnNsYXRpb25EYXRhLnRyYW5zbGF0ZUluZm8ua2V5cy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmVuZFRyYW5zbGF0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgcnVuUGVyY2VudGFnZTogbnVtYmVyID0gdGhpcy50cmFuc2xhdGlvbkRhdGEuY291bnRlciAvIHRoaXMudHJhbnNsYXRpb25EYXRhLnRyYW5zbGF0ZUluZm8ua2V5c1t0aGlzLnRyYW5zbGF0aW9uRGF0YS5rZXlJbmRleF0udGltZTtcclxuXHJcbiAgICAgICAgICAgIGxldCBuZXdQb3NpdGlvbjogVmVjdG9yID0ge1xyXG4gICAgICAgICAgICAgICAgeDogdGhpcy50cmFuc2xhdGlvbkRhdGEub3JpZ2luYWxQb3NpdGlvbi54ICsgdGhpcy50cmFuc2xhdGlvbkRhdGEudHJhbnNsYXRlSW5mby5rZXlzW3RoaXMudHJhbnNsYXRpb25EYXRhLmtleUluZGV4XS5wb3MueCAqIHJ1blBlcmNlbnRhZ2UsXHJcbiAgICAgICAgICAgICAgICB5OiB0aGlzLnRyYW5zbGF0aW9uRGF0YS5vcmlnaW5hbFBvc2l0aW9uLnkgKyB0aGlzLnRyYW5zbGF0aW9uRGF0YS50cmFuc2xhdGVJbmZvLmtleXNbdGhpcy50cmFuc2xhdGlvbkRhdGEua2V5SW5kZXhdLnBvcy55ICogcnVuUGVyY2VudGFnZSxcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMubW9tZW50dW0ueCA9IChuZXdQb3NpdGlvbi54IC0gdGhpcy5wb3NpdGlvbi54KSAvIGVsYXBzZWRUaW1lO1xyXG4gICAgICAgICAgICBpZiAodGhpcy50cmFuc2xhdGlvbkRhdGEudHJhbnNsYXRlSW5mby5pZ25vcmVHcmF2aXR5KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1vbWVudHVtLnkgPSAobmV3UG9zaXRpb24ueSAtIHRoaXMucG9zaXRpb24ueSkgLyBlbGFwc2VkVGltZTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubW9tZW50dW0ueSA9ICgobmV3UG9zaXRpb24ueSAtIHRoaXMucG9zaXRpb24ueSkgLyBlbGFwc2VkVGltZSArIHRoaXMubW9tZW50dW0ueSkgLyAyO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBlbmRUcmFuc2xhdGlvbigpIHtcclxuICAgICAgICB0aGlzLnRyYW5zbGF0aW9uRGF0YS50cmFuc2xhdGVJbmZvID0gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBwb3NpdGlvblVwZGF0ZShlbGFwc2VkVGltZTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbi54ICs9ICgodGhpcy5tb21lbnR1bS54ICsgdGhpcy5wcmV2aW91c01vbWVudHVtLngpICogZWxhcHNlZFRpbWUpIC8gMjtcclxuICAgICAgICB0aGlzLnBvc2l0aW9uLnkgKz0gKCh0aGlzLm1vbWVudHVtLnkgKyB0aGlzLnByZXZpb3VzTW9tZW50dW0ueSkgKiBlbGFwc2VkVGltZSkgLyAyO1xyXG5cclxuICAgICAgICB0aGlzLnByZXZpb3VzTW9tZW50dW0ueCA9IHRoaXMubW9tZW50dW0ueDtcclxuICAgICAgICB0aGlzLnByZXZpb3VzTW9tZW50dW0ueSA9IHRoaXMubW9tZW50dW0ueTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgcHJldmlvdXNQb3NpdGlvblVwZGF0ZSgpIHtcclxuICAgICAgICB0aGlzLnByZXZpb3VzUG9zaXRpb24ueCA9IHRoaXMucG9zaXRpb24ueDtcclxuICAgICAgICB0aGlzLnByZXZpb3VzUG9zaXRpb24ueSA9IHRoaXMucG9zaXRpb24ueTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgZSA9IHJlcXVpcmUoXCJleHByZXNzXCIpO1xyXG5pbXBvcnQgeyBHbG9iYWxPYmplY3RzIH0gZnJvbSBcIi4uLy4uLy4uL2NsaWVudC9nYW1lXCI7XHJcbmltcG9ydCB7IGRlZmF1bHRDb25maWcgfSBmcm9tIFwiLi4vLi4vLi4vY29uZmlnXCI7XHJcbmltcG9ydCB7IFNpemUgfSBmcm9tIFwiLi4vLi4vLi4vc2l6ZVwiO1xyXG5pbXBvcnQgeyByb3RhdGVWZWN0b3IsIFNoYXBlLCBWZWN0b3IgfSBmcm9tIFwiLi4vLi4vLi4vdmVjdG9yXCI7XHJcbmltcG9ydCB7IERvb2RhZCB9IGZyb20gXCIuLi8uLi90ZXJyYWluL2Rvb2RhZHMvZG9vZGFkXCI7XHJcbmltcG9ydCB7IEZsb29yIH0gZnJvbSBcIi4uLy4uL3RlcnJhaW4vZmxvb3IvZmxvb3JcIjtcclxuaW1wb3J0IHsgQWN0b3IgfSBmcm9tIFwiLi4vYWN0b3JcIjtcclxuaW1wb3J0IHsgZGVmYXVsdEFjdG9yQ29uZmlnIH0gZnJvbSBcIi4uL2FjdG9yQ29uZmlnXCI7XHJcbmltcG9ydCB7IENsaWVudFBsYXllciB9IGZyb20gXCIuLi9jbGllbnRBY3RvcnMvY2xpZW50UGxheWVyL2NsaWVudFBsYXllclwiO1xyXG5pbXBvcnQgeyBTZXJ2ZXJQbGF5ZXIgfSBmcm9tIFwiLi4vc2VydmVyQWN0b3JzL3NlcnZlclBsYXllci9zZXJ2ZXJQbGF5ZXJcIjtcclxuaW1wb3J0IHsgQWN0b3JPYmplY3QgfSBmcm9tIFwiLi9hY3Rvck9iamVjdFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFBsYXllck9iamVjdCBleHRlbmRzIEFjdG9yT2JqZWN0IHtcclxuICAgIHByb3RlY3RlZCBqdW1wSGVpZ2h0OiBudW1iZXIgPSBkZWZhdWx0QWN0b3JDb25maWcucGxheWVySnVtcEhlaWdodCArIDA7XHJcbiAgICBwcm90ZWN0ZWQgbWF4U2lkZXdheXNTcGVlZDogbnVtYmVyID0gZGVmYXVsdEFjdG9yQ29uZmlnLm1heFNpZGV3YXlzTW9tZW50dW0gKyAwO1xyXG4gICAgcHJvdGVjdGVkIHNpZGV3YXlzU3RhbmRpbmdBY2NlbGVyYXRpb246IG51bWJlciA9IGRlZmF1bHRBY3RvckNvbmZpZy5zdGFuZGluZ1NpZGV3YXlzQWNjZWxlcmF0aW9uICsgMDtcclxuICAgIHByb3RlY3RlZCBzaWRld2F5c0ZhbGxpbmdBY2NlbGVyYXRpb246IG51bWJlciA9IGRlZmF1bHRBY3RvckNvbmZpZy5ub25TdGFuZGluZ1NpZGV3YXlzQWNjZWxlcmF0aW9uICsgMDtcclxuXHJcbiAgICBwdWJsaWMgb2JqZWN0QW5nbGU6IG51bWJlciA9IDA7XHJcblxyXG4gICAgcHVibGljIGNyb3VjaGluZzogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHVibGljIHN0YW5kaW5nOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZ2xvYmFsT2JqZWN0czogR2xvYmFsT2JqZWN0cywgYmFzZUFjdG9yOiBDbGllbnRQbGF5ZXIgfCBTZXJ2ZXJQbGF5ZXIsIHBvc2l0aW9uOiBWZWN0b3IsIG1vbWVudHVtOiBWZWN0b3IsIHB1YmxpYyBzaXplOiBTaXplKSB7XHJcbiAgICAgICAgc3VwZXIoZ2xvYmFsT2JqZWN0cywgYmFzZUFjdG9yLCBwb3NpdGlvbiwgbW9tZW50dW0sIHNpemUsIGRlZmF1bHRBY3RvckNvbmZpZy5wbGF5ZXJNYXNzICsgMCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldENvbGxpc2lvblJhbmdlKCk6IG51bWJlciB7XHJcbiAgICAgICAgaWYgKHRoaXMuY3JvdWNoaW5nKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBNYXRoLnNxcnQoKGRlZmF1bHRBY3RvckNvbmZpZy5wbGF5ZXJDcm91Y2hTaXplLndpZHRoIC8gMikgKiogMiArIChkZWZhdWx0QWN0b3JDb25maWcucGxheWVyQ3JvdWNoU2l6ZS5oZWlnaHQgLyAyKSAqKiAyKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KChkZWZhdWx0QWN0b3JDb25maWcucGxheWVyU2l6ZS53aWR0aCAvIDIpICoqIDIgKyAoZGVmYXVsdEFjdG9yQ29uZmlnLnBsYXllclNpemUuaGVpZ2h0IC8gMikgKiogMik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRHbG9iYWxTaGFwZShlbGFwc2VkVGltZTogbnVtYmVyID0gMCk6IFNoYXBlIHtcclxuICAgICAgICBsZXQgcG9zaXRpb246IFZlY3RvciA9IHsgeDogdGhpcy5wb3NpdGlvbi54ICsgMCwgeTogdGhpcy5wb3NpdGlvbi55ICsgMCB9O1xyXG4gICAgICAgIGlmIChlbGFwc2VkVGltZSAhPT0gMCkge1xyXG4gICAgICAgICAgICBwb3NpdGlvbi54ID0gdGhpcy5wb3NpdGlvbi54ICsgdGhpcy5tb21lbnR1bS54ICogZWxhcHNlZFRpbWU7XHJcbiAgICAgICAgICAgIHBvc2l0aW9uLnkgPSB0aGlzLnBvc2l0aW9uLnkgKyB0aGlzLm1vbWVudHVtLnkgKiBlbGFwc2VkVGltZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuY3JvdWNoaW5nKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBjZW50ZXI6IHsgeDogdGhpcy5wb3NpdGlvbi54ICsgMCwgeTogdGhpcy5wb3NpdGlvbi55ICsgMCB9LFxyXG4gICAgICAgICAgICAgICAgcG9pbnRzOiBwbGF5ZXJDcm91Y2hpbmdTaGFwZS5wb2ludHMubWFwKChwb2ludCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IHg6IHBvaW50LnggKyBwb3NpdGlvbi54LCB5OiBwb2ludC55ICsgcG9zaXRpb24ueSB9O1xyXG4gICAgICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgICAgICBlZGdlczogcGxheWVyQ3JvdWNoaW5nU2hhcGUuZWRnZXMubWFwKChlZGdlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcDE6IHsgeDogZWRnZS5wMS54ICsgcG9zaXRpb24ueCwgeTogZWRnZS5wMS55ICsgcG9zaXRpb24ueSB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwMjogeyB4OiBlZGdlLnAyLnggKyBwb3NpdGlvbi54LCB5OiBlZGdlLnAyLnkgKyBwb3NpdGlvbi55IH0sXHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBjZW50ZXI6IHsgeDogdGhpcy5wb3NpdGlvbi54ICsgMCwgeTogdGhpcy5wb3NpdGlvbi55ICsgMCB9LFxyXG4gICAgICAgICAgICAgICAgcG9pbnRzOiBwbGF5ZXJTdGFuZGluZ1NoYXBlLnBvaW50cy5tYXAoKHBvaW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgeDogcG9pbnQueCArIHBvc2l0aW9uLngsIHk6IHBvaW50LnkgKyBwb3NpdGlvbi55IH07XHJcbiAgICAgICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgICAgIGVkZ2VzOiBwbGF5ZXJTdGFuZGluZ1NoYXBlLmVkZ2VzLm1hcCgoZWRnZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHAxOiB7IHg6IGVkZ2UucDEueCArIHBvc2l0aW9uLngsIHk6IGVkZ2UucDEueSArIHBvc2l0aW9uLnkgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcDI6IHsgeDogZWRnZS5wMi54ICsgcG9zaXRpb24ueCwgeTogZWRnZS5wMi55ICsgcG9zaXRpb24ueSB9LFxyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlZ2lzdGVyR3JvdW5kQW5nbGUoYW5nbGU6IG51bWJlciwgc3RhbmRpbmc6IGJvb2xlYW4pIHtcclxuICAgICAgICB0aGlzLm9iamVjdEFuZ2xlID0gKGFuZ2xlICsgdGhpcy5vYmplY3RBbmdsZSkgLyAyO1xyXG4gICAgICAgIGlmIChzdGFuZGluZykgdGhpcy5zdGFuZGluZyA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGp1bXAoKSB7XHJcbiAgICAgICAgdGhpcy5tb21lbnR1bS55ID0gLXRoaXMuanVtcEhlaWdodDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWNjZWxlcmF0ZVJpZ2h0KGVsYXBzZWRUaW1lOiBudW1iZXIpIHtcclxuICAgICAgICBpZiAodGhpcy5tb21lbnR1bS54IDwgdGhpcy5tYXhTaWRld2F5c1NwZWVkKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnN0YW5kaW5nKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgZm9yY2UgPSB0aGlzLnNpZGV3YXlzU3RhbmRpbmdBY2NlbGVyYXRpb24gKiBlbGFwc2VkVGltZTtcclxuICAgICAgICAgICAgICAgIHRoaXMubW9tZW50dW0ueCArPSBmb3JjZSAqIE1hdGguY29zKHRoaXMub2JqZWN0QW5nbGUpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMub2JqZWN0QW5nbGUgPiAwKSB0aGlzLm1vbWVudHVtLnkgKz0gZm9yY2UgKiBNYXRoLnNpbih0aGlzLm9iamVjdEFuZ2xlKSAqIDU7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1vbWVudHVtLnggKz0gdGhpcy5zaWRld2F5c0ZhbGxpbmdBY2NlbGVyYXRpb24gKiBlbGFwc2VkVGltZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5tb21lbnR1bS54ID4gdGhpcy5tYXhTaWRld2F5c1NwZWVkKSB0aGlzLm1vbWVudHVtLnggPSB0aGlzLm1heFNpZGV3YXlzU3BlZWQgLSAxO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWNjZWxlcmF0ZUxlZnQoZWxhcHNlZFRpbWU6IG51bWJlcikge1xyXG4gICAgICAgIGlmICh0aGlzLm1vbWVudHVtLnggPiAtdGhpcy5tYXhTaWRld2F5c1NwZWVkKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnN0YW5kaW5nKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgZm9yY2UgPSB0aGlzLnNpZGV3YXlzU3RhbmRpbmdBY2NlbGVyYXRpb24gKiBlbGFwc2VkVGltZTtcclxuICAgICAgICAgICAgICAgIHRoaXMubW9tZW50dW0ueCAtPSBmb3JjZSAqIE1hdGguY29zKHRoaXMub2JqZWN0QW5nbGUpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMub2JqZWN0QW5nbGUgPCAwKSB0aGlzLm1vbWVudHVtLnkgLT0gZm9yY2UgKiBNYXRoLnNpbih0aGlzLm9iamVjdEFuZ2xlKSAqIDU7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1vbWVudHVtLnggLT0gdGhpcy5zaWRld2F5c0ZhbGxpbmdBY2NlbGVyYXRpb24gKiBlbGFwc2VkVGltZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5tb21lbnR1bS54IDwgLXRoaXMubWF4U2lkZXdheXNTcGVlZCkgdGhpcy5tb21lbnR1bS54ID0gLXRoaXMubWF4U2lkZXdheXNTcGVlZCArIDE7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjcm91Y2goKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmNyb3VjaGluZykge1xyXG4gICAgICAgICAgICB0aGlzLnNpemUuaGVpZ2h0ID0gZGVmYXVsdEFjdG9yQ29uZmlnLnBsYXllckNyb3VjaFNpemUuaGVpZ2h0O1xyXG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uLnkgKz0gKGRlZmF1bHRBY3RvckNvbmZpZy5wbGF5ZXJTaXplLmhlaWdodCAtIHRoaXMuc2l6ZS5oZWlnaHQpIC8gMjtcclxuXHJcbiAgICAgICAgICAgIHRoaXMubWF4U2lkZXdheXNTcGVlZCAvPSAzO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5jcm91Y2hpbmcgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHB1YmxpYyB1bkNyb3VjaCgpIHtcclxuICAgICAgICBpZiAodGhpcy5jcm91Y2hpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbi55IC09IChkZWZhdWx0QWN0b3JDb25maWcucGxheWVyU2l6ZS5oZWlnaHQgLSB0aGlzLnNpemUuaGVpZ2h0KSAvIDI7XHJcbiAgICAgICAgICAgIHRoaXMuc2l6ZS5oZWlnaHQgPSBkZWZhdWx0QWN0b3JDb25maWcucGxheWVyU2l6ZS5oZWlnaHQgKyAwO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5tYXhTaWRld2F5c1NwZWVkICo9IDM7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmNyb3VjaGluZyA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdXBkYXRlKGVsYXBzZWRUaW1lOiBudW1iZXIsIGlzVHJhdmVsbGluZzogYm9vbGVhbikge1xyXG4gICAgICAgIGlmICghaXNUcmF2ZWxsaW5nICYmIHRoaXMuc3RhbmRpbmcpIHRoaXMucmVnaXN0ZXJHcm91bmRGcmljdGlvbihlbGFwc2VkVGltZSk7XHJcbiAgICAgICAgdGhpcy5yZWdpc3RlckFpclJlc2lzdGFuY2UoZWxhcHNlZFRpbWUpO1xyXG5cclxuICAgICAgICB0aGlzLnJlZ2lzdGVyR3Jhdml0eShlbGFwc2VkVGltZSk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVUcmFuc2xhdGlvbihlbGFwc2VkVGltZSk7XHJcblxyXG4gICAgICAgIHRoaXMucG9zaXRpb25VcGRhdGUoZWxhcHNlZFRpbWUpO1xyXG5cclxuICAgICAgICB0aGlzLnN0YW5kaW5nID0gZmFsc2U7XHJcblxyXG4gICAgICAgIHRoaXMuY2hlY2tYQm91bmRhcnlDb2xsaXNpb24oKTtcclxuICAgICAgICAvL2lmICh0aGlzLmNoZWNrWUJvdW5kYXJ5Q29sbGlzaW9uKCkpIHRoaXMuc3RhbmRpbmcgPSB0cnVlO1xyXG5cclxuICAgICAgICB0aGlzLmNoZWNrRG9vZGFkcygpO1xyXG5cclxuICAgICAgICBsZXQgZ3JvdW5kSGl0RGV0ZWN0aW9uOiB7IGhpdDogYm9vbGVhbjsgYW5nbGU6IG51bWJlciB9ID0gdGhpcy5jaGVja0dyb3VuZENvbGxpc2lvbihlbGFwc2VkVGltZSk7XHJcbiAgICAgICAgaWYgKGdyb3VuZEhpdERldGVjdGlvbi5oaXQpIHtcclxuICAgICAgICAgICAgdGhpcy5yZWdpc3Rlckdyb3VuZEFuZ2xlKGdyb3VuZEhpdERldGVjdGlvbi5hbmdsZSwgdHJ1ZSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKE1hdGguYWJzKHRoaXMub2JqZWN0QW5nbGUpIDwgMC4wMikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vYmplY3RBbmdsZSA9IDA7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9iamVjdEFuZ2xlICo9IDAuOTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5wcmV2aW91c1Bvc2l0aW9uVXBkYXRlKCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IHN0YW5kaW5nUDE6IFZlY3RvciA9IHsgeDogZGVmYXVsdEFjdG9yQ29uZmlnLnBsYXllclNpemUud2lkdGggLyAtMiwgeTogZGVmYXVsdEFjdG9yQ29uZmlnLnBsYXllclNpemUuaGVpZ2h0IC8gLTIgfTtcclxuY29uc3Qgc3RhbmRpbmdQMjogVmVjdG9yID0geyB4OiBkZWZhdWx0QWN0b3JDb25maWcucGxheWVyU2l6ZS53aWR0aCAvIDIsIHk6IGRlZmF1bHRBY3RvckNvbmZpZy5wbGF5ZXJTaXplLmhlaWdodCAvIC0yIH07XHJcbmNvbnN0IHN0YW5kaW5nUDM6IFZlY3RvciA9IHsgeDogZGVmYXVsdEFjdG9yQ29uZmlnLnBsYXllclNpemUud2lkdGggLyAyLCB5OiBkZWZhdWx0QWN0b3JDb25maWcucGxheWVyU2l6ZS5oZWlnaHQgLyAyIH07XHJcbmNvbnN0IHN0YW5kaW5nUDQ6IFZlY3RvciA9IHsgeDogZGVmYXVsdEFjdG9yQ29uZmlnLnBsYXllclNpemUud2lkdGggLyAtMiwgeTogZGVmYXVsdEFjdG9yQ29uZmlnLnBsYXllclNpemUuaGVpZ2h0IC8gMiB9O1xyXG5leHBvcnQgY29uc3QgcGxheWVyU3RhbmRpbmdTaGFwZTogU2hhcGUgPSB7XHJcbiAgICBjZW50ZXI6IHsgeDogMCwgeTogMCB9LFxyXG4gICAgcG9pbnRzOiBbc3RhbmRpbmdQMSwgc3RhbmRpbmdQMiwgc3RhbmRpbmdQMywgc3RhbmRpbmdQNF0sXHJcbiAgICBlZGdlczogW1xyXG4gICAgICAgIHsgcDE6IHN0YW5kaW5nUDEsIHAyOiBzdGFuZGluZ1AyIH0sXHJcbiAgICAgICAgeyBwMTogc3RhbmRpbmdQMiwgcDI6IHN0YW5kaW5nUDMgfSxcclxuICAgICAgICB7IHAxOiBzdGFuZGluZ1AzLCBwMjogc3RhbmRpbmdQNCB9LFxyXG4gICAgICAgIHsgcDE6IHN0YW5kaW5nUDQsIHAyOiBzdGFuZGluZ1AxIH0sXHJcbiAgICBdLFxyXG59O1xyXG5jb25zdCBjcm91Y2hpbmdQMTogVmVjdG9yID0geyB4OiBkZWZhdWx0QWN0b3JDb25maWcucGxheWVyQ3JvdWNoU2l6ZS53aWR0aCAvIC0yLCB5OiBkZWZhdWx0QWN0b3JDb25maWcucGxheWVyQ3JvdWNoU2l6ZS5oZWlnaHQgLyAtMiB9O1xyXG5jb25zdCBjcm91Y2hpbmdQMjogVmVjdG9yID0geyB4OiBkZWZhdWx0QWN0b3JDb25maWcucGxheWVyQ3JvdWNoU2l6ZS53aWR0aCAvIDIsIHk6IGRlZmF1bHRBY3RvckNvbmZpZy5wbGF5ZXJDcm91Y2hTaXplLmhlaWdodCAvIC0yIH07XHJcbmNvbnN0IGNyb3VjaGluZ1AzOiBWZWN0b3IgPSB7IHg6IGRlZmF1bHRBY3RvckNvbmZpZy5wbGF5ZXJDcm91Y2hTaXplLndpZHRoIC8gMiwgeTogZGVmYXVsdEFjdG9yQ29uZmlnLnBsYXllckNyb3VjaFNpemUuaGVpZ2h0IC8gMiB9O1xyXG5jb25zdCBjcm91Y2hpbmdQNDogVmVjdG9yID0geyB4OiBkZWZhdWx0QWN0b3JDb25maWcucGxheWVyQ3JvdWNoU2l6ZS53aWR0aCAvIC0yLCB5OiBkZWZhdWx0QWN0b3JDb25maWcucGxheWVyQ3JvdWNoU2l6ZS5oZWlnaHQgLyAyIH07XHJcbmV4cG9ydCBjb25zdCBwbGF5ZXJDcm91Y2hpbmdTaGFwZTogU2hhcGUgPSB7XHJcbiAgICBjZW50ZXI6IHsgeDogMCwgeTogMCB9LFxyXG4gICAgcG9pbnRzOiBbY3JvdWNoaW5nUDEsIGNyb3VjaGluZ1AyLCBjcm91Y2hpbmdQMywgY3JvdWNoaW5nUDRdLFxyXG4gICAgZWRnZXM6IFtcclxuICAgICAgICB7IHAxOiBjcm91Y2hpbmdQMSwgcDI6IGNyb3VjaGluZ1AyIH0sXHJcbiAgICAgICAgeyBwMTogY3JvdWNoaW5nUDIsIHAyOiBjcm91Y2hpbmdQMyB9LFxyXG4gICAgICAgIHsgcDE6IGNyb3VjaGluZ1AzLCBwMjogY3JvdWNoaW5nUDQgfSxcclxuICAgICAgICB7IHAxOiBjcm91Y2hpbmdQNCwgcDI6IGNyb3VjaGluZ1AxIH0sXHJcbiAgICBdLFxyXG59O1xyXG4iLCJpbXBvcnQgeyByb3RhdGVWZWN0b3IsIFZlY3RvciB9IGZyb20gXCIuLi8uLi8uLi92ZWN0b3JcIjtcclxuXHJcbmV4cG9ydCB0eXBlIFRyYW5zbGF0aW9uTmFtZSA9IFwidGVzdFRyYW5zbGF0aW9uXCIgfCBcImx1bmdlVHJhbnNsYXRpb25cIjtcclxuXHJcbmV4cG9ydCBjb25zdCB0cmFuc2xhdGlvbnM6IFJlY29yZDxUcmFuc2xhdGlvbk5hbWUsIFRyYW5zbGF0aW9uPiA9IHtcclxuICAgIHRlc3RUcmFuc2xhdGlvbjoge1xyXG4gICAgICAgIGtleXM6IFtcclxuICAgICAgICAgICAgeyBwb3M6IHsgeDogMjAsIHk6IDIwIH0sIHRpbWU6IDAuMSB9LFxyXG4gICAgICAgICAgICB7IHBvczogeyB4OiAzMCwgeTogNDAgfSwgdGltZTogMC4xIH0sXHJcbiAgICAgICAgICAgIHsgcG9zOiB7IHg6IDEwMCwgeTogLTEyMCB9LCB0aW1lOiAwLjIgfSxcclxuICAgICAgICAgICAgeyBwb3M6IHsgeDogMzAsIHk6IDQwIH0sIHRpbWU6IDAuMSB9LFxyXG4gICAgICAgICAgICB7IHBvczogeyB4OiAyMCwgeTogMjAgfSwgdGltZTogMC4xIH0sXHJcbiAgICAgICAgXSxcclxuICAgICAgICBmbGlwQWNyb3NzWTogdHJ1ZSxcclxuICAgICAgICBpZ25vcmVDb2xsaXNpb246IHRydWUsXHJcbiAgICAgICAgaWdub3JlR3Jhdml0eTogZmFsc2UsXHJcbiAgICB9LFxyXG4gICAgbHVuZ2VUcmFuc2xhdGlvbjoge1xyXG4gICAgICAgIGtleXM6IFtcclxuICAgICAgICAgICAgeyBwb3M6IHsgeDogMzAwLCB5OiAwIH0sIHRpbWU6IDAuMSB9LFxyXG4gICAgICAgICAgICB7IHBvczogeyB4OiAxMCwgeTogMCB9LCB0aW1lOiAwLjAyIH0sXHJcbiAgICAgICAgXSxcclxuICAgICAgICBmbGlwQWNyb3NzWTogZmFsc2UsXHJcbiAgICAgICAgaWdub3JlQ29sbGlzaW9uOiBmYWxzZSxcclxuICAgICAgICBpZ25vcmVHcmF2aXR5OiB0cnVlLFxyXG4gICAgfSxcclxufTtcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgVHJhbnNsYXRpb24ge1xyXG4gICAga2V5czogUG9zaXRpb25LZXlbXTtcclxuICAgIGZsaXBBY3Jvc3NZOiBib29sZWFuO1xyXG4gICAgaWdub3JlQ29sbGlzaW9uOiBib29sZWFuO1xyXG4gICAgaWdub3JlR3Jhdml0eTogYm9vbGVhbjtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBQb3NpdGlvbktleSB7XHJcbiAgICBwb3M6IFZlY3RvcjtcclxuICAgIHRpbWU6IG51bWJlcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJvdGF0ZUtleShrZXk6IFBvc2l0aW9uS2V5LCBhbmdsZTogbnVtYmVyLCBmbGlwWTogYm9vbGVhbik6IFBvc2l0aW9uS2V5IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgcG9zOiByb3RhdGVWZWN0b3IoYW5nbGUsIHtcclxuICAgICAgICAgICAgeDoga2V5LnBvcy54LFxyXG4gICAgICAgICAgICB5OiBrZXkucG9zLnkgKiAoZmxpcFkgJiYgKGFuZ2xlID49IE1hdGguUEkgLyAyIHx8IGFuZ2xlIDw9IE1hdGguUEkgLyAtMikgPyAtMSA6IDEpLFxyXG4gICAgICAgIH0pLFxyXG4gICAgICAgIHRpbWU6IGtleS50aW1lLFxyXG4gICAgfTtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBUcmFuc2xhdGlvbkRhdGEge1xyXG4gICAgdHJhbnNsYXRlSW5mbzogVHJhbnNsYXRpb24gfCB1bmRlZmluZWQ7XHJcbiAgICBrZXlJbmRleDogbnVtYmVyO1xyXG4gICAgb3JpZ2luYWxQb3NpdGlvbjogVmVjdG9yO1xyXG4gICAgY291bnRlcjogbnVtYmVyO1xyXG4gICAga2V5VGltZUxlbmd0aDogbnVtYmVyO1xyXG4gICAgYW5nbGU6IG51bWJlcjtcclxufVxyXG4iLCJpbXBvcnQgeyBHYW1lLCBHbG9iYWxDbGllbnRBY3RvcnMgfSBmcm9tIFwiLi4vLi4vLi4vY2xpZW50L2dhbWVcIjtcclxuaW1wb3J0IHsgVmVjdG9yIH0gZnJvbSBcIi4uLy4uLy4uL3ZlY3RvclwiO1xyXG5pbXBvcnQgeyBDbGllbnRGbG9vciB9IGZyb20gXCIuLi8uLi90ZXJyYWluL2Zsb29yL2NsaWVudEZsb29yXCI7XHJcbmltcG9ydCB7IEFjdG9yLCBBY3RvclR5cGUgfSBmcm9tIFwiLi4vYWN0b3JcIjtcclxuaW1wb3J0IHsgVHJhbnNsYXRpb25OYW1lIH0gZnJvbSBcIi4uL2FjdG9yT2JqZWN0cy90cmFuc2xhdGlvbnNcIjtcclxuaW1wb3J0IHsgTW9kZWwgfSBmcm9tIFwiLi9tb2RlbC9tb2RlbFwiO1xyXG5cclxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIENsaWVudEFjdG9yIGV4dGVuZHMgQWN0b3Ige1xyXG4gICAgcHJvdGVjdGVkIGFic3RyYWN0IHJlYWRvbmx5IG1vZGVsOiBNb2RlbDtcclxuICAgIHByb3RlY3RlZCByZWFkb25seSBnbG9iYWxBY3RvcnM6IEdsb2JhbENsaWVudEFjdG9ycztcclxuICAgIHByb3RlY3RlZCBsYXN0SGl0QnlBY3RvcjogQ2xpZW50QWN0b3I7XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJvdGVjdGVkIGdhbWU6IEdhbWUsIGFjdG9yVHlwZTogQWN0b3JUeXBlLCBpZDogbnVtYmVyLCBwb3NpdGlvbjogVmVjdG9yLCBtb21lbnR1bTogVmVjdG9yLCBoZWFsdGhJbmZvOiB7IGhlYWx0aDogbnVtYmVyOyBtYXhIZWFsdGg6IG51bWJlciB9KSB7XHJcbiAgICAgICAgc3VwZXIoYWN0b3JUeXBlLCBpZCwgcG9zaXRpb24sIG1vbWVudHVtLCBoZWFsdGhJbmZvKTtcclxuICAgICAgICB0aGlzLmdsb2JhbEFjdG9ycyA9IHRoaXMuZ2FtZS5nZXRHbG9iYWxBY3RvcnMoKTtcclxuICAgICAgICB0aGlzLmxhc3RIaXRCeUFjdG9yID0gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVuZGVyKCkge1xyXG4gICAgICAgIHRoaXMubW9kZWwucmVuZGVyKCk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgcmVuZGVySGVhbHRoKCkge1xyXG4gICAgICAgIHRoaXMubW9kZWwucmVuZGVySGVhbHRoKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHVwZGF0ZVBvc2l0aW9uQW5kTW9tZW50dW1Gcm9tU2VydmVyKHBvc2l0aW9uOiBWZWN0b3IsIG1vbWVudHVtOiBWZWN0b3IpIHtcclxuICAgICAgICAvL3RoaXMubW9kZWwucHJvY2Vzc1Bvc2l0aW9uVXBkYXRlRGlmZmVyZW5jZSh7IHg6IHBvc2l0aW9uLnggLSB0aGlzLnBvc2l0aW9uLngsIHk6IHBvc2l0aW9uLnkgLSB0aGlzLnBvc2l0aW9uLnkgfSk7XHJcblxyXG4gICAgICAgIHRoaXMucG9zaXRpb24ueCA9IHBvc2l0aW9uLnggKyAwO1xyXG4gICAgICAgIHRoaXMucG9zaXRpb24ueSA9IHBvc2l0aW9uLnkgKyAwO1xyXG4gICAgICAgIHRoaXMubW9tZW50dW0ueCA9IG1vbWVudHVtLnggKyAwO1xyXG4gICAgICAgIHRoaXMubW9tZW50dW0ueSA9IG1vbWVudHVtLnkgKyAwO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZWdpc3RlckRhbWFnZShcclxuICAgICAgICBvcmlnaW5BY3RvcjogQWN0b3IsXHJcbiAgICAgICAgbmV3SGVhbHRoOiBudW1iZXIsXHJcbiAgICAgICAga25vY2tiYWNrOiBWZWN0b3IgfCB1bmRlZmluZWQsXHJcbiAgICAgICAgdHJhbnNsYXRpb25EYXRhOiB7IG5hbWU6IFRyYW5zbGF0aW9uTmFtZTsgYW5nbGU6IG51bWJlciB9IHwgdW5kZWZpbmVkLFxyXG4gICAgKTogeyBpZktpbGxlZDogYm9vbGVhbjsgZGFtYWdlRGVhbHQ6IG51bWJlciB9IHtcclxuICAgICAgICB0aGlzLm1vZGVsLnJlZ2lzdGVyRGFtYWdlKG5ld0hlYWx0aCAtIHRoaXMuaGVhbHRoSW5mby5oZWFsdGgpO1xyXG4gICAgICAgIG9yaWdpbkFjdG9yLnJlZ2lzdGVyRGFtYWdlRG9uZShuZXdIZWFsdGggLSB0aGlzLmhlYWx0aEluZm8uaGVhbHRoKTtcclxuXHJcbiAgICAgICAgaWYgKHRyYW5zbGF0aW9uRGF0YSkgdGhpcy5hY3Rvck9iamVjdC5zdGFydFRyYW5zbGF0aW9uKHRyYW5zbGF0aW9uRGF0YS5hbmdsZSwgdHJhbnNsYXRpb25EYXRhLm5hbWUpO1xyXG4gICAgICAgIGlmIChrbm9ja2JhY2spIHRoaXMuYWN0b3JPYmplY3QucmVnaXN0ZXJLbm9ja2JhY2soa25vY2tiYWNrKTtcclxuXHJcbiAgICAgICAgdGhpcy5oZWFsdGhJbmZvLmhlYWx0aCA9IG5ld0hlYWx0aCArIDA7XHJcbiAgICAgICAgcmV0dXJuIHsgaWZLaWxsZWQ6IGZhbHNlLCBkYW1hZ2VEZWFsdDogMCB9O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZWdpc3RlckhlYWwobmV3SGVhbHRoOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLm1vZGVsLnJlZ2lzdGVySGVhbChuZXdIZWFsdGggLSB0aGlzLmhlYWx0aEluZm8uaGVhbHRoKTtcclxuICAgICAgICB0aGlzLmhlYWx0aEluZm8uaGVhbHRoID0gbmV3SGVhbHRoICsgMDtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJlbmRlclNoYXBlKGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELCBwb2ludHM6IFZlY3RvcltdKSB7XHJcbiAgICBjdHguZ2xvYmFsQWxwaGEgPSAwLjQ7XHJcbiAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICBjdHgubW92ZVRvKHBvaW50c1swXS54LCBwb2ludHNbMF0ueSk7XHJcbiAgICBmb3IgKGxldCBpOiBudW1iZXIgPSAxOyBpIDwgcG9pbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgY3R4LmxpbmVUbyhwb2ludHNbaV0ueCwgcG9pbnRzW2ldLnkpO1xyXG4gICAgfVxyXG4gICAgY3R4LmZpbGwoKTtcclxuICAgIGN0eC5nbG9iYWxBbHBoYSA9IDE7XHJcbn1cclxuIiwiaW1wb3J0IHsgR2FtZSB9IGZyb20gXCIuLi8uLi8uLi8uLi8uLi9jbGllbnQvZ2FtZVwiO1xyXG5pbXBvcnQgeyBmaW5kQW5nbGUgfSBmcm9tIFwiLi4vLi4vLi4vLi4vLi4vZmluZEFuZ2xlXCI7XHJcbmltcG9ydCB7IFZlY3RvciB9IGZyb20gXCIuLi8uLi8uLi8uLi8uLi92ZWN0b3JcIjtcclxuaW1wb3J0IHsgQ2xpZW50RG9vZGFkIH0gZnJvbSBcIi4uLy4uLy4uLy4uL3RlcnJhaW4vZG9vZGFkcy9jbGllbnREb29kYWRcIjtcclxuaW1wb3J0IHsgQ2xpZW50Rmxvb3IgfSBmcm9tIFwiLi4vLi4vLi4vLi4vdGVycmFpbi9mbG9vci9jbGllbnRGbG9vclwiO1xyXG5pbXBvcnQgeyB0cmFuc2xhdGlvbnMgfSBmcm9tIFwiLi4vLi4vLi4vYWN0b3JPYmplY3RzL3RyYW5zbGF0aW9uc1wiO1xyXG5pbXBvcnQgeyBDbGFzc1R5cGUsIFNlcmlhbGl6ZWRQbGF5ZXIgfSBmcm9tIFwiLi4vLi4vLi4vc2VydmVyQWN0b3JzL3NlcnZlclBsYXllci9zZXJ2ZXJQbGF5ZXJcIjtcclxuaW1wb3J0IHsgRGFnZ2Vyc1BsYXllck1vZGVsIH0gZnJvbSBcIi4uLy4uL21vZGVsL3BsYXllck1vZGVscy9kYWdnZXJzUGxheWVyTW9kZWxcIjtcclxuaW1wb3J0IHsgQ2xpZW50UGxheWVyIH0gZnJvbSBcIi4uL2NsaWVudFBsYXllclwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIENsaWVudERhZ2dlcnMgZXh0ZW5kcyBDbGllbnRQbGF5ZXIge1xyXG4gICAgY2xhc3NUeXBlOiBDbGFzc1R5cGUgPSBcImRhZ2dlcnNcIjtcclxuICAgIG1vZGVsOiBEYWdnZXJzUGxheWVyTW9kZWw7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZ2FtZTogR2FtZSwgcGxheWVySW5mbzogU2VyaWFsaXplZFBsYXllcikge1xyXG4gICAgICAgIHN1cGVyKGdhbWUsIHBsYXllckluZm8sIFwiZGFnZ2Vyc1BsYXllclwiKTtcclxuXHJcbiAgICAgICAgdGhpcy5tb2RlbCA9IG5ldyBEYWdnZXJzUGxheWVyTW9kZWwoZ2FtZSwgdGhpcywgZ2FtZS5nZXRBY3RvckN0eCgpLCBwbGF5ZXJJbmZvLnBvc2l0aW9uLCBnYW1lLmdldEFjdG9yU2lkZSh0aGlzLmlkKSwgdGhpcy5jb2xvciwgdGhpcy5hY3Rvck9iamVjdC5zaXplKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcGVyZm9ybUNsaWVudEFiaWxpdHk6IFJlY29yZDxEYWdnZXJzUGxheWVyQWJpbGl0eSwgKG1vdXNlUG9zOiBWZWN0b3IpID0+IHZvaWQ+ID0ge1xyXG4gICAgICAgIHN0YWI6IChtb3VzZVBvcykgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLm1vZGVsLnNldEFuaW1hdGlvbihcInN0YWJcIiwgZmluZEFuZ2xlKHRoaXMucG9zaXRpb24sIG1vdXNlUG9zKSk7XHJcbiAgICAgICAgICAgIC8vdGhpcy5nYW1lLnBhcnRpY2xlU3lzdGVtLmFkZER1bW15U2xhc2hFZmZlY3QyKHRoaXMucG9zaXRpb24sIGZpbmRNaXJyb3JlZEFuZ2xlKGZpbmRBbmdsZSh0aGlzLnBvc2l0aW9uLCBtb3VzZVBvcykpLCB0aGlzLmZhY2luZ1JpZ2h0KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGx1bmdlOiAobW91c2VQb3MpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5tb2RlbC5zZXRBbmltYXRpb24oXCJsdW5nZVwiLCAwKTtcclxuICAgICAgICAgICAgdGhpcy5nYW1lLnBhcnRpY2xlU3lzdGVtLmFkZEx1bmdlRWZmZWN0KHRoaXMucG9zaXRpb24sIHRoaXMubW9kZWwuZ2V0Q29sb3IoKSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICB1bmF2YWlsYWJsZTogKCkgPT4ge30sXHJcbiAgICB9O1xyXG4gICAgcHVibGljIHJlbGVhc2VDbGllbnRBYmlsaXR5OiBSZWNvcmQ8RGFnZ2Vyc1BsYXllckFiaWxpdHksICgpID0+IHZvaWQ+ID0ge1xyXG4gICAgICAgIHN0YWI6ICgpID0+IHt9LFxyXG4gICAgICAgIGx1bmdlOiAoKSA9PiB7fSxcclxuICAgICAgICB1bmF2YWlsYWJsZTogKCkgPT4ge30sXHJcbiAgICB9O1xyXG59XHJcblxyXG5leHBvcnQgdHlwZSBEYWdnZXJzUGxheWVyQWJpbGl0eSA9IFwic3RhYlwiIHwgXCJsdW5nZVwiIHwgXCJ1bmF2YWlsYWJsZVwiO1xyXG4iLCJpbXBvcnQgeyBHYW1lIH0gZnJvbSBcIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9nYW1lXCI7XHJcbmltcG9ydCB7IGZpbmRBbmdsZSB9IGZyb20gXCIuLi8uLi8uLi8uLi8uLi9maW5kQW5nbGVcIjtcclxuaW1wb3J0IHsgVmVjdG9yIH0gZnJvbSBcIi4uLy4uLy4uLy4uLy4uL3ZlY3RvclwiO1xyXG5pbXBvcnQgeyBDbGllbnREb29kYWQgfSBmcm9tIFwiLi4vLi4vLi4vLi4vdGVycmFpbi9kb29kYWRzL2NsaWVudERvb2RhZFwiO1xyXG5pbXBvcnQgeyBDbGllbnRGbG9vciB9IGZyb20gXCIuLi8uLi8uLi8uLi90ZXJyYWluL2Zsb29yL2NsaWVudEZsb29yXCI7XHJcbmltcG9ydCB7IENsYXNzVHlwZSwgU2VyaWFsaXplZFBsYXllciB9IGZyb20gXCIuLi8uLi8uLi9zZXJ2ZXJBY3RvcnMvc2VydmVyUGxheWVyL3NlcnZlclBsYXllclwiO1xyXG5pbXBvcnQgeyBIYW1tZXJQbGF5ZXJNb2RlbCB9IGZyb20gXCIuLi8uLi9tb2RlbC9wbGF5ZXJNb2RlbHMvaGFtbWVyUGxheWVyTW9kZWxcIjtcclxuaW1wb3J0IHsgQ2xpZW50UGxheWVyIH0gZnJvbSBcIi4uL2NsaWVudFBsYXllclwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIENsaWVudEhhbW1lciBleHRlbmRzIENsaWVudFBsYXllciB7XHJcbiAgICBjbGFzc1R5cGU6IENsYXNzVHlwZSA9IFwiaGFtbWVyXCI7XHJcbiAgICBtb2RlbDogSGFtbWVyUGxheWVyTW9kZWw7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZ2FtZTogR2FtZSwgcGxheWVySW5mbzogU2VyaWFsaXplZFBsYXllcikge1xyXG4gICAgICAgIHN1cGVyKGdhbWUsIHBsYXllckluZm8sIFwiaGFtbWVyUGxheWVyXCIpO1xyXG4gICAgICAgIHRoaXMubW9kZWwgPSBuZXcgSGFtbWVyUGxheWVyTW9kZWwoZ2FtZSwgdGhpcywgZ2FtZS5nZXRBY3RvckN0eCgpLCBwbGF5ZXJJbmZvLnBvc2l0aW9uLCBnYW1lLmdldEFjdG9yU2lkZSh0aGlzLmlkKSwgdGhpcy5jb2xvciwgdGhpcy5hY3Rvck9iamVjdC5zaXplKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcGVyZm9ybUNsaWVudEFiaWxpdHk6IFJlY29yZDxIYW1tZXJQbGF5ZXJBYmlsaXR5LCAobW91c2VQb3M6IFZlY3RvcikgPT4gdm9pZD4gPSB7XHJcbiAgICAgICAgc3dpbmc6IChtb3VzZVBvcykgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLm1vZGVsLnNldEFuaW1hdGlvbihcInN3aW5nMVwiLCBmaW5kQW5nbGUodGhpcy5wb3NpdGlvbiwgbW91c2VQb3MpKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHBvdW5kOiAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMubW9kZWwuc2V0QW5pbWF0aW9uKFwicG91bmRcIiwgMCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICB1bmF2YWlsYWJsZTogKCkgPT4ge30sXHJcbiAgICB9O1xyXG5cclxuICAgIHB1YmxpYyByZWxlYXNlQ2xpZW50QWJpbGl0eTogUmVjb3JkPEhhbW1lclBsYXllckFiaWxpdHksICgpID0+IHZvaWQ+ID0ge1xyXG4gICAgICAgIHN3aW5nOiAoKSA9PiB7fSxcclxuICAgICAgICBwb3VuZDogKCkgPT4ge30sXHJcbiAgICAgICAgdW5hdmFpbGFibGU6ICgpID0+IHt9LFxyXG4gICAgfTtcclxufVxyXG5cclxuZXhwb3J0IHR5cGUgSGFtbWVyUGxheWVyQWJpbGl0eSA9IFwic3dpbmdcIiB8IFwicG91bmRcIiB8IFwidW5hdmFpbGFibGVcIjsgLy8gfCBcImV4b25lcmF0ZVwiIHwgXCJyZWNrb25pbmdcIiB8IFwianVkZ2VtZW50XCIgfCBcImNoYWluc1wiIHwgXCJ3cmF0aFwiIHwgXCJsaWdodG5pbmdcIiB8IFwiYmxpenphcmRcIjtcclxuIiwiaW1wb3J0IHsgR2FtZSB9IGZyb20gXCIuLi8uLi8uLi8uLi8uLi9jbGllbnQvZ2FtZVwiO1xyXG5pbXBvcnQgeyBEdW1teVdoaXJsd2luZEVmZmVjdCB9IGZyb20gXCIuLi8uLi8uLi8uLi8uLi9jbGllbnQvcGFydGljbGVzL3BhcnRpY2xlQ2xhc3Nlcy9kdW1teVdoaXJsd2luZEVmZmVjdFwiO1xyXG5pbXBvcnQgeyBmaW5kQW5nbGUgfSBmcm9tIFwiLi4vLi4vLi4vLi4vLi4vZmluZEFuZ2xlXCI7XHJcbmltcG9ydCB7IGZpbmRNaXJyb3JlZEFuZ2xlLCBWZWN0b3IgfSBmcm9tIFwiLi4vLi4vLi4vLi4vLi4vdmVjdG9yXCI7XHJcbmltcG9ydCB7IENsaWVudERvb2RhZCB9IGZyb20gXCIuLi8uLi8uLi8uLi90ZXJyYWluL2Rvb2RhZHMvY2xpZW50RG9vZGFkXCI7XHJcbmltcG9ydCB7IENsaWVudEZsb29yIH0gZnJvbSBcIi4uLy4uLy4uLy4uL3RlcnJhaW4vZmxvb3IvY2xpZW50Rmxvb3JcIjtcclxuaW1wb3J0IHsgQ2xhc3NUeXBlLCBTZXJpYWxpemVkUGxheWVyIH0gZnJvbSBcIi4uLy4uLy4uL3NlcnZlckFjdG9ycy9zZXJ2ZXJQbGF5ZXIvc2VydmVyUGxheWVyXCI7XHJcbmltcG9ydCB7IFN3b3JkUGxheWVyTW9kZWwgfSBmcm9tIFwiLi4vLi4vbW9kZWwvcGxheWVyTW9kZWxzL3N3b3JkUGxheWVyTW9kZWxcIjtcclxuaW1wb3J0IHsgQ2xpZW50UGxheWVyIH0gZnJvbSBcIi4uL2NsaWVudFBsYXllclwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIENsaWVudFN3b3JkIGV4dGVuZHMgQ2xpZW50UGxheWVyIHtcclxuICAgIGNsYXNzVHlwZTogQ2xhc3NUeXBlID0gXCJzd29yZFwiO1xyXG4gICAgbW9kZWw6IFN3b3JkUGxheWVyTW9kZWw7XHJcblxyXG4gICAgcHJvdGVjdGVkIHdoaXJsd2luZEVmZmVjdHBhcnRpY2xlOiBEdW1teVdoaXJsd2luZEVmZmVjdCB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihnYW1lOiBHYW1lLCBwbGF5ZXJJbmZvOiBTZXJpYWxpemVkUGxheWVyKSB7XHJcbiAgICAgICAgc3VwZXIoZ2FtZSwgcGxheWVySW5mbywgXCJzd29yZFBsYXllclwiKTtcclxuXHJcbiAgICAgICAgdGhpcy5tb2RlbCA9IG5ldyBTd29yZFBsYXllck1vZGVsKGdhbWUsIHRoaXMsIGdhbWUuZ2V0QWN0b3JDdHgoKSwgcGxheWVySW5mby5wb3NpdGlvbiwgZ2FtZS5nZXRBY3RvclNpZGUodGhpcy5pZCksIHRoaXMuY29sb3IsIHRoaXMuYWN0b3JPYmplY3Quc2l6ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHBlcmZvcm1DbGllbnRBYmlsaXR5OiBSZWNvcmQ8U3dvcmRQbGF5ZXJBYmlsaXR5LCAobW91c2VQb3M6IFZlY3RvcikgPT4gdm9pZD4gPSB7XHJcbiAgICAgICAgc2xhc2g6IChtb3VzZVBvcykgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLm1vZGVsLnNldEFuaW1hdGlvbihcInNsYXNoMVwiLCBmaW5kQW5nbGUodGhpcy5wb3NpdGlvbiwgbW91c2VQb3MpKTtcclxuICAgICAgICAgICAgdGhpcy5nYW1lLnBhcnRpY2xlU3lzdGVtLmFkZER1bW15U2xhc2hFZmZlY3QyKHRoaXMucG9zaXRpb24sIGZpbmRNaXJyb3JlZEFuZ2xlKGZpbmRBbmdsZSh0aGlzLnBvc2l0aW9uLCBtb3VzZVBvcykpLCB0aGlzLmZhY2luZ1JpZ2h0KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHdoaXJsd2luZDogKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLm1vZGVsLnNldEFuaW1hdGlvbihcIndoaXJsd2luZFwiLCAwKTtcclxuICAgICAgICAgICAgdGhpcy53aGlybHdpbmRFZmZlY3RwYXJ0aWNsZSA9IHRoaXMuZ2FtZS5wYXJ0aWNsZVN5c3RlbS5hZGREdW1teVdoaXJsd2luZEVmZmVjdCh0aGlzLnBvc2l0aW9uLCB0aGlzLmZhY2luZ1JpZ2h0KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHVuYXZhaWxhYmxlOiAoKSA9PiB7fSxcclxuICAgIH07XHJcbiAgICBwdWJsaWMgcmVsZWFzZUNsaWVudEFiaWxpdHk6IFJlY29yZDxTd29yZFBsYXllckFiaWxpdHksICgpID0+IHZvaWQ+ID0ge1xyXG4gICAgICAgIHNsYXNoOiAoKSA9PiB7fSxcclxuICAgICAgICB3aGlybHdpbmQ6ICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5tb2RlbC5zZXRBbmltYXRpb24oXCJzdGFuZFwiLCAwKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMud2hpcmx3aW5kRWZmZWN0cGFydGljbGUgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy53aGlybHdpbmRFZmZlY3RwYXJ0aWNsZS5wcmVtYXR1cmVFbmQoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMud2hpcmx3aW5kRWZmZWN0cGFydGljbGUgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHVuYXZhaWxhYmxlOiAoKSA9PiB7fSxcclxuICAgIH07XHJcbn1cclxuXHJcbmV4cG9ydCB0eXBlIFN3b3JkUGxheWVyQWJpbGl0eSA9IFwic2xhc2hcIiB8IFwid2hpcmx3aW5kXCIgfCBcInVuYXZhaWxhYmxlXCI7IC8vIHwgXCJsZWVjaFN0cmlrZVwiIHwgXCJmaW5lc3NlXCIgfCBcImJsb29kU2hpZWxkXCIgfCBcInBhcnJ5XCIgfCBcImNoYXJnZVwiIHwgXCJtYXN0ZXJwaWVjZVwiO1xyXG4iLCJpbXBvcnQgeyBHYW1lIH0gZnJvbSBcIi4uLy4uLy4uLy4uL2NsaWVudC9nYW1lXCI7XHJcbmltcG9ydCB7IFNpemUgfSBmcm9tIFwiLi4vLi4vLi4vLi4vc2l6ZVwiO1xyXG5pbXBvcnQgeyBWZWN0b3IgfSBmcm9tIFwiLi4vLi4vLi4vLi4vdmVjdG9yXCI7XHJcbmltcG9ydCB7IENsaWVudERvb2RhZCB9IGZyb20gXCIuLi8uLi8uLi90ZXJyYWluL2Rvb2RhZHMvY2xpZW50RG9vZGFkXCI7XHJcbmltcG9ydCB7IENsaWVudEZsb29yIH0gZnJvbSBcIi4uLy4uLy4uL3RlcnJhaW4vZmxvb3IvY2xpZW50Rmxvb3JcIjtcclxuaW1wb3J0IHsgQWN0b3JUeXBlIH0gZnJvbSBcIi4uLy4uL2FjdG9yXCI7XHJcbmltcG9ydCB7IGRlZmF1bHRBY3RvckNvbmZpZyB9IGZyb20gXCIuLi8uLi9hY3RvckNvbmZpZ1wiO1xyXG5pbXBvcnQgeyBQbGF5ZXJPYmplY3QgfSBmcm9tIFwiLi4vLi4vYWN0b3JPYmplY3RzL3BsYXllck9iamVjdFwiO1xyXG5pbXBvcnQgeyBDbGFzc1R5cGUsIFBsYXllckFjdGlvblR5cGUsIFNlcmlhbGl6ZWRQbGF5ZXIgfSBmcm9tIFwiLi4vLi4vc2VydmVyQWN0b3JzL3NlcnZlclBsYXllci9zZXJ2ZXJQbGF5ZXJcIjtcclxuaW1wb3J0IHsgQ2xpZW50QWN0b3IgfSBmcm9tIFwiLi4vY2xpZW50QWN0b3JcIjtcclxuaW1wb3J0IHsgUGxheWVyTW9kZWwgfSBmcm9tIFwiLi4vbW9kZWwvcGxheWVyTW9kZWxzL3BsYXllck1vZGVsXCI7XHJcbmltcG9ydCB7IFN3b3JkUGxheWVyTW9kZWwgfSBmcm9tIFwiLi4vbW9kZWwvcGxheWVyTW9kZWxzL3N3b3JkUGxheWVyTW9kZWxcIjtcclxuaW1wb3J0IHsgQ2xpZW50U3dvcmQgfSBmcm9tIFwiLi9jbGllbnRDbGFzc2VzL2NsaWVudFN3b3JkXCI7XHJcblxyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgQ2xpZW50UGxheWVyIGV4dGVuZHMgQ2xpZW50QWN0b3Ige1xyXG4gICAgYWN0b3JPYmplY3Q6IFBsYXllck9iamVjdDtcclxuXHJcbiAgICBwcm90ZWN0ZWQgYWJzdHJhY3QgcmVhZG9ubHkgbW9kZWw6IFBsYXllck1vZGVsO1xyXG5cclxuICAgIHB1YmxpYyBhYnN0cmFjdCBjbGFzc1R5cGU6IENsYXNzVHlwZTtcclxuICAgIHByb3RlY3RlZCByZWFkb25seSBjb2xvcjogc3RyaW5nO1xyXG4gICAgcHJvdGVjdGVkIHJlYWRvbmx5IG5hbWU6IHN0cmluZztcclxuICAgIHByb3RlY3RlZCBsZXZlbDogbnVtYmVyO1xyXG4gICAgcHJvdGVjdGVkIHNwZWM6IG51bWJlcjtcclxuICAgIHB1YmxpYyBtb3ZlQWN0aW9uc05leHRGcmFtZTogUmVjb3JkPFBsYXllckFjdGlvblR5cGUsIGJvb2xlYW4+ID0ge1xyXG4gICAgICAgIGp1bXA6IGZhbHNlLFxyXG4gICAgICAgIG1vdmVSaWdodDogZmFsc2UsXHJcbiAgICAgICAgbW92ZUxlZnQ6IGZhbHNlLFxyXG4gICAgICAgIGNyb3VjaDogZmFsc2UsXHJcbiAgICB9O1xyXG5cclxuICAgIHB1YmxpYyBmYWNpbmdSaWdodDogYm9vbGVhbiA9IHRydWU7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZ2FtZTogR2FtZSwgcGxheWVySW5mbzogU2VyaWFsaXplZFBsYXllciwgYWN0b3JUeXBlOiBBY3RvclR5cGUpIHtcclxuICAgICAgICBzdXBlcihnYW1lLCBhY3RvclR5cGUsIHBsYXllckluZm8uaWQsIHBsYXllckluZm8ucG9zaXRpb24sIHBsYXllckluZm8ubW9tZW50dW0sIHBsYXllckluZm8uaGVhbHRoSW5mbyk7XHJcblxyXG4gICAgICAgIHRoaXMuY29sb3IgPSBwbGF5ZXJJbmZvLmNvbG9yO1xyXG4gICAgICAgIHRoaXMubmFtZSA9IHBsYXllckluZm8ubmFtZTtcclxuICAgICAgICB0aGlzLmxldmVsID0gcGxheWVySW5mby5jbGFzc0xldmVsO1xyXG4gICAgICAgIHRoaXMuc3BlYyA9IHBsYXllckluZm8uY2xhc3NTcGVjO1xyXG4gICAgICAgIHRoaXMuZmFjaW5nUmlnaHQgPSBwbGF5ZXJJbmZvLmZhY2luZ1JpZ2h0O1xyXG5cclxuICAgICAgICBsZXQgcGxheWVyU2l6ZVBvaW50ZXI6IFNpemUgPSB7IHdpZHRoOiBkZWZhdWx0QWN0b3JDb25maWcucGxheWVyU2l6ZS53aWR0aCArIDAsIGhlaWdodDogZGVmYXVsdEFjdG9yQ29uZmlnLnBsYXllclNpemUuaGVpZ2h0ICsgMCB9O1xyXG5cclxuICAgICAgICB0aGlzLmFjdG9yT2JqZWN0ID0gbmV3IFBsYXllck9iamVjdChnYW1lLmdldEdsb2JhbE9iamVjdHMoKSwgdGhpcywgdGhpcy5wb3NpdGlvbiwgdGhpcy5tb21lbnR1bSwgcGxheWVyU2l6ZVBvaW50ZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRMZXZlbCgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmxldmVsO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRTcGVjKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc3BlYztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY2hhbmdlU3BlYyhzcGVjOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLnNwZWMgPSBzcGVjO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRDbGFzc1R5cGUoKTogQ2xhc3NUeXBlIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jbGFzc1R5cGU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGF0dGVtcHRKdW1wQWN0aW9uKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICghdGhpcy5hY3Rvck9iamVjdC5jcm91Y2hpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5tb3ZlQWN0aW9uc05leHRGcmFtZS5qdW1wID0gdHJ1ZTtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBhdHRlbXB0Q3JvdWNoQWN0aW9uKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICh0cnVlKSB7XHJcbiAgICAgICAgICAgIHRoaXMubW92ZUFjdGlvbnNOZXh0RnJhbWUuY3JvdWNoID0gdHJ1ZTtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBjcm91Y2goKSB7XHJcbiAgICAgICAgdGhpcy5hY3Rvck9iamVjdC5jcm91Y2goKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyB1bkNyb3VjaCgpIHtcclxuICAgICAgICB0aGlzLmFjdG9yT2JqZWN0LnVuQ3JvdWNoKCk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQganVtcCgpIHtcclxuICAgICAgICB0aGlzLm1vdmVBY3Rpb25zTmV4dEZyYW1lLmp1bXAgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmFjdG9yT2JqZWN0Lmp1bXAoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYXR0ZW1wdE1vdmVSaWdodEFjdGlvbigpOiBib29sZWFuIHtcclxuICAgICAgICBpZiAodHJ1ZSkge1xyXG4gICAgICAgICAgICB0aGlzLm1vdmVBY3Rpb25zTmV4dEZyYW1lLm1vdmVSaWdodCA9IHRydWU7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgbW92ZVJpZ2h0KGVsYXBzZWRUaW1lOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLmFjdG9yT2JqZWN0LmFjY2VsZXJhdGVSaWdodChlbGFwc2VkVGltZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGF0dGVtcHRNb3ZlTGVmdEFjdGlvbigpOiBib29sZWFuIHtcclxuICAgICAgICBpZiAodHJ1ZSkge1xyXG4gICAgICAgICAgICB0aGlzLm1vdmVBY3Rpb25zTmV4dEZyYW1lLm1vdmVMZWZ0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBtb3ZlTGVmdChlbGFwc2VkVGltZTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5hY3Rvck9iamVjdC5hY2NlbGVyYXRlTGVmdChlbGFwc2VkVGltZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIHVwZGF0ZUFjdGlvbnMoZWxhcHNlZFRpbWU6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMubW9kZWwudXBkYXRlKGVsYXBzZWRUaW1lKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMubW92ZUFjdGlvbnNOZXh0RnJhbWUuanVtcCkge1xyXG4gICAgICAgICAgICB0aGlzLmp1bXAoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMubW92ZUFjdGlvbnNOZXh0RnJhbWUubW92ZVJpZ2h0KSB7XHJcbiAgICAgICAgICAgIHRoaXMubW92ZVJpZ2h0KGVsYXBzZWRUaW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMubW92ZUFjdGlvbnNOZXh0RnJhbWUubW92ZUxlZnQpIHtcclxuICAgICAgICAgICAgdGhpcy5tb3ZlTGVmdChlbGFwc2VkVGltZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLm1vdmVBY3Rpb25zTmV4dEZyYW1lLmNyb3VjaCAhPT0gdGhpcy5hY3Rvck9iamVjdC5jcm91Y2hpbmcpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMubW92ZUFjdGlvbnNOZXh0RnJhbWUuY3JvdWNoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNyb3VjaCgpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy51bkNyb3VjaCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuYWN0b3JPYmplY3QuY3JvdWNoaW5nID0gdGhpcy5tb3ZlQWN0aW9uc05leHRGcmFtZS5jcm91Y2g7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZW5kZXIoKSB7XHJcbiAgICAgICAgdGhpcy5tb2RlbC5yZW5kZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdXBkYXRlRmFjaW5nRnJvbVNlcnZlcihmYWNpbmdSaWdodDogYm9vbGVhbikge1xyXG4gICAgICAgIHRoaXMuZmFjaW5nUmlnaHQgPSBmYWNpbmdSaWdodDtcclxuICAgICAgICB0aGlzLm1vZGVsLmNoYW5nZUZhY2luZyhmYWNpbmdSaWdodCk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlKGVsYXBzZWRUaW1lOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZUFjdGlvbnMoZWxhcHNlZFRpbWUpO1xyXG4gICAgICAgIHRoaXMuYWN0b3JPYmplY3QudXBkYXRlKGVsYXBzZWRUaW1lLCB0aGlzLm1vdmVBY3Rpb25zTmV4dEZyYW1lLm1vdmVMZWZ0IHx8IHRoaXMubW92ZUFjdGlvbnNOZXh0RnJhbWUubW92ZVJpZ2h0KTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBDbGllbnRQbGF5ZXJBY3Rpb24ge1xyXG4gICAgdHlwZTogXCJjbGllbnRQbGF5ZXJBY3Rpb25cIjtcclxuICAgIHBsYXllcklkOiBudW1iZXI7XHJcbiAgICBhY3Rpb25UeXBlOiBQbGF5ZXJBY3Rpb25UeXBlO1xyXG4gICAgc3RhcnRpbmc6IGJvb2xlYW47XHJcbiAgICBwb3NpdGlvbjogVmVjdG9yO1xyXG4gICAgbW9tZW50dW06IFZlY3RvcjtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBDbGllbnRQbGF5ZXJDbGljayB7XHJcbiAgICB0eXBlOiBcImNsaWVudFBsYXllckNsaWNrXCI7XHJcbiAgICBwbGF5ZXJJZDogbnVtYmVyO1xyXG4gICAgbGVmdENsaWNrOiBib29sZWFuO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIENsaWVudFBsYXllckZhY2luZ1VwZGF0ZSB7XHJcbiAgICB0eXBlOiBcImNsaWVudFBsYXllckZhY2luZ1VwZGF0ZVwiO1xyXG4gICAgcGxheWVyaWQ6IG51bWJlcjtcclxuICAgIGZhY2luZ1JpZ2h0OiBib29sZWFuO1xyXG59XHJcbiIsImltcG9ydCB7IExpbmtlZExpc3QsIE5vZGUgfSBmcm9tIFwiLi4vLi4vLi4vLi4vbGlua2VkTGlzdFwiO1xyXG5pbXBvcnQgeyBTaXplIH0gZnJvbSBcIi4uLy4uLy4uLy4uL3NpemVcIjtcclxuaW1wb3J0IHsgVmVjdG9yIH0gZnJvbSBcIi4uLy4uLy4uLy4uL3ZlY3RvclwiO1xyXG5cclxuZXhwb3J0IHR5cGUgU2lkZVR5cGUgPSBcImVuZW15XCIgfCBcInNlbGZcIiB8IFwiYWxseVwiO1xyXG5jb25zdCBoZWFsdGhEaXZpZGVyV2lkdGg6IG51bWJlciA9IDIwO1xyXG5jb25zdCBoZWFsdGhCYXJEdXJhdGlvbjogbnVtYmVyID0gMC4xNTtcclxuXHJcbmV4cG9ydCBjbGFzcyBIZWFsdGhCYXJNb2RlbCB7XHJcbiAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgaGVhbHRoSGVpZ2h0OiBudW1iZXIgPSA1MDtcclxuICAgIHByb3RlY3RlZCByZWFkb25seSBoZWFsdGhDb2xvcjogc3RyaW5nO1xyXG4gICAgcHJvdGVjdGVkIHJlYWRvbmx5IGRhbWFnZUVmZmVjdENvbG9yOiBzdHJpbmc7XHJcbiAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgaGVhbEVmZmVjdENvbG9yOiBzdHJpbmc7XHJcblxyXG4gICAgcHJvdGVjdGVkIGRhbWFnZUVmZmVjdEJhcnM6IExpbmtlZExpc3Q8eyB0aW1lcjogbnVtYmVyOyBwb3NpdGlvbjogbnVtYmVyOyB3aWR0aDogbnVtYmVyOyBoZWlnaHQ6IG51bWJlciB9PiA9IG5ldyBMaW5rZWRMaXN0KCk7XHJcbiAgICBwcm90ZWN0ZWQgaGVhbEVmZmVjdEJhcnM6IExpbmtlZExpc3Q8eyB0aW1lcjogbnVtYmVyOyBwb3NpdGlvbjogbnVtYmVyOyB3aWR0aDogbnVtYmVyOyBoZWlnaHQ6IG51bWJlciB9PiA9IG5ldyBMaW5rZWRMaXN0KCk7XHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgcHJvdGVjdGVkIGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELFxyXG4gICAgICAgIHByb3RlY3RlZCByZWFkb25seSBwb3NpdGlvbjogVmVjdG9yLFxyXG4gICAgICAgIHByb3RlY3RlZCByZWFkb25seSBoZWFsdGhJbmZvOiB7IGhlYWx0aDogbnVtYmVyOyBtYXhIZWFsdGg6IG51bWJlciB9LFxyXG4gICAgICAgIHByb3RlY3RlZCByZWFkb25seSBoZWFsdGhCYXJTaXplOiBTaXplLFxyXG4gICAgICAgIGhlYWx0aEJhclR5cGU6IFNpZGVUeXBlLFxyXG4gICAgKSB7XHJcbiAgICAgICAgc3dpdGNoIChoZWFsdGhCYXJUeXBlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgXCJlbmVteVwiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5oZWFsdGhDb2xvciA9IFwicmVkXCI7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRhbWFnZUVmZmVjdENvbG9yID0gXCJ3aGl0ZVwiO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5oZWFsRWZmZWN0Q29sb3IgPSBcInJlZFwiO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJhbGx5XCI6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmhlYWx0aENvbG9yID0gXCJ3aGl0ZVwiO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kYW1hZ2VFZmZlY3RDb2xvciA9IFwicmVkXCI7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmhlYWxFZmZlY3RDb2xvciA9IFwiZ3JlZW5cIjtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwic2VsZlwiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5oZWFsdGhDb2xvciA9IFwiIzAwYzc0NlwiO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kYW1hZ2VFZmZlY3RDb2xvciA9IFwid2hpdGVcIjtcclxuICAgICAgICAgICAgICAgIHRoaXMuaGVhbEVmZmVjdENvbG9yID0gXCIjMDBjNzQ2XCI7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcInVua25vd24gaGVhbHRoIGJhciB0eXBlIGluIG1vZGVsIGNvbnN0cnVjdG9yXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVuZGVySGVhbHRoKCkge1xyXG4gICAgICAgIHRoaXMuY3R4LnRyYW5zZm9ybSgxLCAwLCAtMC4xNSwgMSwgdGhpcy5wb3NpdGlvbi54ICsgMSwgdGhpcy5wb3NpdGlvbi55IC0gdGhpcy5oZWFsdGhIZWlnaHQpO1xyXG4gICAgICAgIHRoaXMuY3R4LmZpbGxTdHlsZSA9IFwicmdiYSgwLCAwLCAwLCAwLjU2MilcIjtcclxuICAgICAgICB0aGlzLmN0eC5maWxsUmVjdCh0aGlzLmhlYWx0aEJhclNpemUud2lkdGggLyAtMiAtIDEsIDAsIHRoaXMuaGVhbHRoQmFyU2l6ZS53aWR0aCArIDIsIHRoaXMuaGVhbHRoQmFyU2l6ZS5oZWlnaHQgKyAyKTtcclxuXHJcbiAgICAgICAgdGhpcy5jdHguZmlsbFN0eWxlID0gdGhpcy5oZWFsdGhDb2xvcjtcclxuICAgICAgICB0aGlzLmN0eC5maWxsUmVjdCh0aGlzLmhlYWx0aEJhclNpemUud2lkdGggLyAtMiwgMSwgdGhpcy5oZWFsdGhCYXJTaXplLndpZHRoICogKHRoaXMuaGVhbHRoSW5mby5oZWFsdGggLyB0aGlzLmhlYWx0aEluZm8ubWF4SGVhbHRoKSwgNik7XHJcblxyXG4gICAgICAgIHRoaXMuY3R4LmZpbGxTdHlsZSA9IFwicmdiYSgwLCAwLCAwLCAwLjU2MilcIjtcclxuICAgICAgICBmb3IgKGxldCBpOiBudW1iZXIgPSAxOyBpIDwgdGhpcy5oZWFsdGhJbmZvLmhlYWx0aCAvIGhlYWx0aERpdmlkZXJXaWR0aDsgaSArPSAxKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY3R4LmZpbGxSZWN0KC0yNSArICg0OCAqIGhlYWx0aERpdmlkZXJXaWR0aCAqIGkpIC8gdGhpcy5oZWFsdGhJbmZvLm1heEhlYWx0aCwgMSwgMiwgNik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIXRoaXMuZGFtYWdlRWZmZWN0QmFycy5pZkVtcHR5KCkpIHtcclxuICAgICAgICAgICAgdGhpcy5jdHguZmlsbFN0eWxlID0gdGhpcy5kYW1hZ2VFZmZlY3RDb2xvcjtcclxuICAgICAgICAgICAgdmFyIG5vZGU6IE5vZGU8eyB0aW1lcjogbnVtYmVyOyBwb3NpdGlvbjogbnVtYmVyOyB3aWR0aDogbnVtYmVyOyBoZWlnaHQ6IG51bWJlciB9PiB8IG51bGwgPSB0aGlzLmRhbWFnZUVmZmVjdEJhcnMuaGVhZDtcclxuICAgICAgICAgICAgd2hpbGUgKG5vZGUgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3R4Lmdsb2JhbEFscGhhID0gMSAtIChoZWFsdGhCYXJEdXJhdGlvbiAtIG5vZGUuZGF0YS50aW1lcikgKiAzO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jdHguZmlsbFJlY3QoLTI1ICsgbm9kZS5kYXRhLnBvc2l0aW9uLCA0IC0gbm9kZS5kYXRhLmhlaWdodCAvIDIsIG5vZGUuZGF0YS53aWR0aCwgbm9kZS5kYXRhLmhlaWdodCk7XHJcbiAgICAgICAgICAgICAgICBub2RlID0gbm9kZS5uZXh0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuY3R4Lmdsb2JhbEFscGhhID0gMTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5oZWFsRWZmZWN0QmFycy5pZkVtcHR5KCkpIHtcclxuICAgICAgICAgICAgdGhpcy5jdHguZmlsbFN0eWxlID0gdGhpcy5oZWFsRWZmZWN0Q29sb3I7XHJcbiAgICAgICAgICAgIHZhciBub2RlOiBOb2RlPHsgdGltZXI6IG51bWJlcjsgcG9zaXRpb246IG51bWJlcjsgd2lkdGg6IG51bWJlcjsgaGVpZ2h0OiBudW1iZXIgfT4gfCBudWxsID0gdGhpcy5oZWFsRWZmZWN0QmFycy5oZWFkO1xyXG4gICAgICAgICAgICB3aGlsZSAobm9kZSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jdHguZ2xvYmFsQWxwaGEgPSAwLjUgKyAoaGVhbHRoQmFyRHVyYXRpb24gLSBub2RlLmRhdGEudGltZXIpICogNDtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3R4LmZpbGxSZWN0KC0yNSArIG5vZGUuZGF0YS5wb3NpdGlvbiwgNCAtIG5vZGUuZGF0YS5oZWlnaHQgLyAyLCBub2RlLmRhdGEud2lkdGgsIG5vZGUuZGF0YS5oZWlnaHQpO1xyXG4gICAgICAgICAgICAgICAgbm9kZSA9IG5vZGUubmV4dDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmN0eC5nbG9iYWxBbHBoYSA9IDE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmN0eC50cmFuc2Zvcm0oMSwgMCwgMC4xNSwgMSwgMCwgMCk7IC8vIHRoZSBza2V3IGhhZCB0byBiZSBkZS10cmFuc2Zvcm1lZCBwcm9jZWR1cmFsbHkgb3IgZWxzZSB0aGUgbWFpbiBjYW52YXMgYnVnZ2VkXHJcbiAgICAgICAgdGhpcy5jdHgudHJhbnNmb3JtKDEsIDAsIDAsIDEsIC10aGlzLnBvc2l0aW9uLnggLSAxLCAtdGhpcy5wb3NpdGlvbi55ICsgdGhpcy5oZWFsdGhIZWlnaHQpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZWdpc3RlckRhbWFnZShxdWFudGl0eTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5kYW1hZ2VFZmZlY3RCYXJzLmluc2VydEF0RW5kKHtcclxuICAgICAgICAgICAgdGltZXI6IGhlYWx0aEJhckR1cmF0aW9uLFxyXG4gICAgICAgICAgICBwb3NpdGlvbjogKHRoaXMuaGVhbHRoSW5mby5oZWFsdGggLyB0aGlzLmhlYWx0aEluZm8ubWF4SGVhbHRoKSAqIDQ4LFxyXG4gICAgICAgICAgICB3aWR0aDogKHF1YW50aXR5IC8gdGhpcy5oZWFsdGhJbmZvLm1heEhlYWx0aCkgKiA0OCArIDEsXHJcbiAgICAgICAgICAgIGhlaWdodDogOCxcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVnaXN0ZXJIZWFsKHF1YW50aXR5OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLmhlYWxFZmZlY3RCYXJzLmluc2VydEF0RW5kKHtcclxuICAgICAgICAgICAgdGltZXI6IGhlYWx0aEJhckR1cmF0aW9uLFxyXG4gICAgICAgICAgICBwb3NpdGlvbjogKHRoaXMuaGVhbHRoSW5mby5oZWFsdGggLyB0aGlzLmhlYWx0aEluZm8ubWF4SGVhbHRoKSAqIDQ4LFxyXG4gICAgICAgICAgICB3aWR0aDogKHF1YW50aXR5IC8gdGhpcy5oZWFsdGhJbmZvLm1heEhlYWx0aCkgKiA0OCArIDEsXHJcbiAgICAgICAgICAgIGhlaWdodDogMzAsXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHVwZGF0ZShlbGFwc2VkVGltZTogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmRhbWFnZUVmZmVjdEJhcnMuaWZFbXB0eSgpKSB7XHJcbiAgICAgICAgICAgIHZhciBub2RlOiBOb2RlPHsgdGltZXI6IG51bWJlcjsgcG9zaXRpb246IG51bWJlcjsgd2lkdGg6IG51bWJlcjsgaGVpZ2h0OiBudW1iZXIgfT4gfCBudWxsID0gdGhpcy5kYW1hZ2VFZmZlY3RCYXJzLmhlYWQ7XHJcbiAgICAgICAgICAgIHdoaWxlIChub2RlICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBub2RlLmRhdGEudGltZXIgLT0gZWxhcHNlZFRpbWU7XHJcbiAgICAgICAgICAgICAgICBub2RlLmRhdGEuaGVpZ2h0ICs9IGVsYXBzZWRUaW1lICogMTAwO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChub2RlLmRhdGEudGltZXIgPD0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGFtYWdlRWZmZWN0QmFycy5kZWxldGVGaXJzdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIG5vZGUgPSB0aGlzLmRhbWFnZUVmZmVjdEJhcnMuaGVhZDtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbm9kZSA9IG5vZGUubmV4dDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLmhlYWxFZmZlY3RCYXJzLmlmRW1wdHkoKSkge1xyXG4gICAgICAgICAgICB2YXIgbm9kZTogTm9kZTx7IHRpbWVyOiBudW1iZXI7IHBvc2l0aW9uOiBudW1iZXI7IHdpZHRoOiBudW1iZXI7IGhlaWdodDogbnVtYmVyIH0+IHwgbnVsbCA9IHRoaXMuaGVhbEVmZmVjdEJhcnMuaGVhZDtcclxuICAgICAgICAgICAgd2hpbGUgKG5vZGUgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIG5vZGUuZGF0YS50aW1lciAtPSBlbGFwc2VkVGltZTtcclxuICAgICAgICAgICAgICAgIG5vZGUuZGF0YS5oZWlnaHQgLT0gZWxhcHNlZFRpbWUgKiAxMDA7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKG5vZGUuZGF0YS50aW1lciA8PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5oZWFsRWZmZWN0QmFycy5kZWxldGVGaXJzdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIG5vZGUgPSB0aGlzLmhlYWxFZmZlY3RCYXJzLmhlYWQ7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIG5vZGUgPSBub2RlLm5leHQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgVmVjdG9yIH0gZnJvbSBcIi4uLy4uLy4uLy4uL3ZlY3RvclwiO1xyXG5pbXBvcnQgeyBBbmltYXRpb25JbmZvIH0gZnJvbSBcIi4vbW9kZWxcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBKb2ludCB7XHJcbiAgICBwcm90ZWN0ZWQgaW1nUm90YXRpb25UZW1wOiBudW1iZXIgPSAwO1xyXG4gICAgcHJvdGVjdGVkIGxvY2FsUG9zWFRlbXA6IG51bWJlciA9IDA7XHJcbiAgICBwcm90ZWN0ZWQgbG9jYWxQb3NZVGVtcDogbnVtYmVyID0gMDtcclxuICAgIHByb3RlY3RlZCBhbmdsZUZyb21UZW1wOiBudW1iZXIgPSAwO1xyXG4gICAgcHJvdGVjdGVkIGFuZ2xlVG9UZW1wOiBudW1iZXIgPSAwO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHByb3RlY3RlZCBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCxcclxuICAgICAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgaW1nOiBIVE1MSW1hZ2VFbGVtZW50LFxyXG4gICAgICAgIHByb3RlY3RlZCByZWFkb25seSBpbWdQb3M6IFZlY3RvcixcclxuICAgICAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgaW1nU2NhbGU6IG51bWJlcixcclxuICAgICAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgaW1nUm90YXRpb246IG51bWJlcixcclxuICAgICAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgbG9jYWxQb3M6IFZlY3RvcixcclxuICAgICAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgYW5nbGVGcm9tOiBudW1iZXIsXHJcbiAgICAgICAgcHJvdGVjdGVkIHJlYWRvbmx5IGFuZ2xlVG86IG51bWJlcixcclxuICAgICkge31cclxuXHJcbiAgICBwdWJsaWMgcmVuZGVyKHRpbWVQZXJjZW50OiBudW1iZXIsIGFuaW1hdGlvbkluZm86IEFuaW1hdGlvbkluZm8pIHtcclxuICAgICAgICBpZiAoYW5pbWF0aW9uSW5mby5hbmdsZUZyb21FcXVhdGlvbikgdGhpcy5hbmdsZUZyb21UZW1wID0gcmVhZEFycmF5Rm9yWShhbmltYXRpb25JbmZvLmFuZ2xlRnJvbUVxdWF0aW9uLCB0aW1lUGVyY2VudCk7XHJcbiAgICAgICAgdGhpcy5jdHgucm90YXRlKHRoaXMuYW5nbGVGcm9tICsgdGhpcy5hbmdsZUZyb21UZW1wKTtcclxuXHJcbiAgICAgICAgaWYgKGFuaW1hdGlvbkluZm8ubG9jYWxQb3NYRXF1YXRpb24pIHRoaXMubG9jYWxQb3NYVGVtcCA9IHJlYWRBcnJheUZvclkoYW5pbWF0aW9uSW5mby5sb2NhbFBvc1hFcXVhdGlvbiwgdGltZVBlcmNlbnQpO1xyXG4gICAgICAgIGlmIChhbmltYXRpb25JbmZvLmxvY2FsUG9zWUVxdWF0aW9uKSB0aGlzLmxvY2FsUG9zWVRlbXAgPSByZWFkQXJyYXlGb3JZKGFuaW1hdGlvbkluZm8ubG9jYWxQb3NZRXF1YXRpb24sIHRpbWVQZXJjZW50KTtcclxuICAgICAgICB0aGlzLmN0eC50cmFuc2xhdGUodGhpcy5sb2NhbFBvcy54ICsgdGhpcy5sb2NhbFBvc1hUZW1wLCB0aGlzLmxvY2FsUG9zLnkgKyB0aGlzLmxvY2FsUG9zWVRlbXApO1xyXG5cclxuICAgICAgICBpZiAoYW5pbWF0aW9uSW5mby5hbmdsZVRvRXF1YXRpb24pIHRoaXMuYW5nbGVUb1RlbXAgPSByZWFkQXJyYXlGb3JZKGFuaW1hdGlvbkluZm8uYW5nbGVUb0VxdWF0aW9uLCB0aW1lUGVyY2VudCk7XHJcbiAgICAgICAgdGhpcy5jdHgucm90YXRlKHRoaXMuYW5nbGVUbyArIHRoaXMuYW5nbGVUb1RlbXApO1xyXG5cclxuICAgICAgICBpZiAoYW5pbWF0aW9uSW5mby5pbWdSb3RhdGlvbkVxdWF0aW9uKSB0aGlzLmltZ1JvdGF0aW9uVGVtcCA9IHJlYWRBcnJheUZvclkoYW5pbWF0aW9uSW5mby5pbWdSb3RhdGlvbkVxdWF0aW9uLCB0aW1lUGVyY2VudCk7XHJcbiAgICAgICAgdGhpcy5jdHgucm90YXRlKHRoaXMuaW1nUm90YXRpb24gKyB0aGlzLmltZ1JvdGF0aW9uVGVtcCk7XHJcblxyXG4gICAgICAgIHRoaXMuY3R4LnNjYWxlKHRoaXMuaW1nU2NhbGUsIHRoaXMuaW1nU2NhbGUpO1xyXG4gICAgICAgIHRoaXMuY3R4LmRyYXdJbWFnZSh0aGlzLmltZywgdGhpcy5pbWdQb3MueCwgdGhpcy5pbWdQb3MueSk7XHJcbiAgICAgICAgdGhpcy5jdHguc2NhbGUoMSAvIHRoaXMuaW1nU2NhbGUsIDEgLyB0aGlzLmltZ1NjYWxlKTtcclxuXHJcbiAgICAgICAgdGhpcy5jdHgucm90YXRlKC10aGlzLmltZ1JvdGF0aW9uIC0gdGhpcy5pbWdSb3RhdGlvblRlbXApO1xyXG5cclxuICAgICAgICB0aGlzLmN0eC5yb3RhdGUoLXRoaXMuYW5nbGVUbyAtIHRoaXMuYW5nbGVUb1RlbXApO1xyXG5cclxuICAgICAgICB0aGlzLmN0eC50cmFuc2xhdGUoLXRoaXMubG9jYWxQb3MueCAtIHRoaXMubG9jYWxQb3NYVGVtcCwgLXRoaXMubG9jYWxQb3MueSAtIHRoaXMubG9jYWxQb3NZVGVtcCk7XHJcblxyXG4gICAgICAgIHRoaXMuY3R4LnJvdGF0ZSgtdGhpcy5hbmdsZUZyb20gLSB0aGlzLmFuZ2xlRnJvbVRlbXApO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB1cGRhdGUoZWxhcHNlZFRpbWU6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuaW1nUm90YXRpb25UZW1wICo9IDEgLSBlbGFwc2VkVGltZSAqIDU7XHJcbiAgICAgICAgdGhpcy5sb2NhbFBvc1hUZW1wICo9IDEgLSBlbGFwc2VkVGltZSAqIDU7XHJcbiAgICAgICAgdGhpcy5sb2NhbFBvc1lUZW1wICo9IDEgLSBlbGFwc2VkVGltZSAqIDU7XHJcbiAgICAgICAgdGhpcy5hbmdsZUZyb21UZW1wICo9IDEgLSBlbGFwc2VkVGltZSAqIDU7XHJcbiAgICAgICAgdGhpcy5hbmdsZVRvVGVtcCAqPSAxIC0gZWxhcHNlZFRpbWUgKiA1O1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiByZWFkQXJyYXlGb3JZKGRhdGE6IG51bWJlcltdW10gfCB1bmRlZmluZWQsIHRpbWVQZXJjZW50OiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgaWYgKGRhdGEgPT09IHVuZGVmaW5lZCkgcmV0dXJuIDA7XHJcbiAgICBsZXQgaW5kZXg6IG51bWJlciA9IDA7XHJcbiAgICBsZXQgYXJyYXlMZW5ndGg6IG51bWJlciA9IGRhdGEubGVuZ3RoIC0gMTtcclxuICAgIHdoaWxlICh0cnVlKSB7XHJcbiAgICAgICAgaWYgKGluZGV4ID09PSBhcnJheUxlbmd0aCkgcmV0dXJuIGRhdGFbaW5kZXhdWzFdO1xyXG4gICAgICAgIGVsc2UgaWYgKGRhdGFbaW5kZXggKyAxXVswXSA+PSB0aW1lUGVyY2VudCkgYnJlYWs7XHJcbiAgICAgICAgaW5kZXgrKztcclxuICAgIH1cclxuICAgIGxldCBwZXJjZW50OiBudW1iZXIgPSAodGltZVBlcmNlbnQgLSBkYXRhW2luZGV4XVswXSkgLyAoZGF0YVtpbmRleCArIDFdWzBdIC0gZGF0YVtpbmRleF1bMF0pO1xyXG4gICAgbGV0IGtleURpZmZlcmVuY2U6IG51bWJlciA9IGRhdGFbaW5kZXggKyAxXVsxXSAtIGRhdGFbaW5kZXhdWzFdO1xyXG4gICAgcmV0dXJuIGRhdGFbaW5kZXhdWzFdICsgcGVyY2VudCAqIGtleURpZmZlcmVuY2U7XHJcbn1cclxuIiwiaW1wb3J0IHsgR2FtZSB9IGZyb20gXCIuLi8uLi8uLi8uLi9jbGllbnQvZ2FtZVwiO1xyXG5pbXBvcnQgeyBWZWN0b3IgfSBmcm9tIFwiLi4vLi4vLi4vLi4vdmVjdG9yXCI7XHJcbmltcG9ydCB7IENsaWVudFBsYXllciB9IGZyb20gXCIuLi9jbGllbnRQbGF5ZXIvY2xpZW50UGxheWVyXCI7XHJcbmltcG9ydCB7IEhlYWx0aEJhck1vZGVsLCBTaWRlVHlwZSB9IGZyb20gXCIuL2hlYWx0aEJhclwiO1xyXG5pbXBvcnQgeyBKb2ludCB9IGZyb20gXCIuL2pvaW50XCI7XHJcblxyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgTW9kZWwge1xyXG4gICAgcHJvdGVjdGVkIHJlYWRvbmx5IGhlYWx0aEJhcjogSGVhbHRoQmFyTW9kZWw7XHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgcHJvdGVjdGVkIHJlYWRvbmx5IGdhbWU6IEdhbWUsXHJcbiAgICAgICAgcHJvdGVjdGVkIHJlYWRvbmx5IHBsYXllcjogQ2xpZW50UGxheWVyLFxyXG4gICAgICAgIHByb3RlY3RlZCBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCxcclxuICAgICAgICBwcm90ZWN0ZWQgcG9zaXRpb246IFZlY3RvcixcclxuICAgICAgICBoZWFsdGhCYXJUeXBlOiBTaWRlVHlwZSxcclxuICAgICkge1xyXG4gICAgICAgIHRoaXMuaGVhbHRoQmFyID0gbmV3IEhlYWx0aEJhck1vZGVsKHRoaXMuY3R4LCB0aGlzLnBvc2l0aW9uLCB0aGlzLnBsYXllci5nZXRIZWFsdGhJbmZvKCksIHsgd2lkdGg6IDUwLCBoZWlnaHQ6IDYgfSwgaGVhbHRoQmFyVHlwZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlZ2lzdGVyRGFtYWdlKHF1YW50aXR5OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLmhlYWx0aEJhci5yZWdpc3RlckRhbWFnZShxdWFudGl0eSk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgcmVnaXN0ZXJIZWFsKHF1YW50aXR5OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLmhlYWx0aEJhci5yZWdpc3RlckhlYWwocXVhbnRpdHkpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhYnN0cmFjdCByZW5kZXIoKTogdm9pZDtcclxuICAgIHB1YmxpYyByZW5kZXJIZWFsdGgoKSB7XHJcbiAgICAgICAgdGhpcy5oZWFsdGhCYXIucmVuZGVySGVhbHRoKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHVwZGF0ZShlbGFwc2VkVGltZTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5oZWFsdGhCYXIudXBkYXRlKGVsYXBzZWRUaW1lKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBNb2RlbEFuaW1hdGlvbiB7XHJcbiAgICB0b3RhbFRpbWU6IG51bWJlcjtcclxuICAgIGxvb3A6IGJvb2xlYW47XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgQW5pbWF0aW9uSW5mbyB7XHJcbiAgICBpbWdSb3RhdGlvbkVxdWF0aW9uOiBudW1iZXJbXVtdIHwgdW5kZWZpbmVkO1xyXG4gICAgbG9jYWxQb3NYRXF1YXRpb246IG51bWJlcltdW10gfCB1bmRlZmluZWQ7XHJcbiAgICBsb2NhbFBvc1lFcXVhdGlvbjogbnVtYmVyW11bXSB8IHVuZGVmaW5lZDtcclxuICAgIGFuZ2xlRnJvbUVxdWF0aW9uOiBudW1iZXJbXVtdIHwgdW5kZWZpbmVkO1xyXG4gICAgYW5nbGVUb0VxdWF0aW9uOiBudW1iZXJbXVtdIHwgdW5kZWZpbmVkO1xyXG59XHJcbiIsImltcG9ydCB7IEdhbWUgfSBmcm9tIFwiLi4vLi4vLi4vLi4vLi4vY2xpZW50L2dhbWVcIjtcclxuaW1wb3J0IHsgYXNzZXRNYW5hZ2VyIH0gZnJvbSBcIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9nYW1lUmVuZGVyL2Fzc2V0bWFuYWdlclwiO1xyXG5pbXBvcnQgeyBmaW5kQW5nbGUgfSBmcm9tIFwiLi4vLi4vLi4vLi4vLi4vZmluZEFuZ2xlXCI7XHJcbmltcG9ydCB7IFNpemUgfSBmcm9tIFwiLi4vLi4vLi4vLi4vLi4vc2l6ZVwiO1xyXG5pbXBvcnQgeyBWZWN0b3IgfSBmcm9tIFwiLi4vLi4vLi4vLi4vLi4vdmVjdG9yXCI7XHJcbmltcG9ydCB7IERhZ2dlcnNTdGFiSGl0U2hhcGUgfSBmcm9tIFwiLi4vLi4vLi4vLi4vY2xpZW50Q29udHJvbGxlcnMvY29udHJvbGxlcnMvYWJpbGl0aWVzL2RhZ2dlcnNBYmlsaXRpZXMvZGFnZ2Vyc1N0YWJBYmlsaXR5XCI7XHJcbmltcG9ydCB7IFN3b3JkU2xhc2hIaXRTaGFwZSB9IGZyb20gXCIuLi8uLi8uLi8uLi9jbGllbnRDb250cm9sbGVycy9jb250cm9sbGVycy9hYmlsaXRpZXMvc3dvcmRBYmlsaXRpZXMvc3dvcmRTbGFzaEFiaWxpdHlcIjtcclxuaW1wb3J0IHsgcmVuZGVyU2hhcGUgfSBmcm9tIFwiLi4vLi4vY2xpZW50QWN0b3JcIjtcclxuaW1wb3J0IHsgQ2xpZW50RGFnZ2VycyB9IGZyb20gXCIuLi8uLi9jbGllbnRQbGF5ZXIvY2xpZW50Q2xhc3Nlcy9jbGllbnREYWdnZXJzXCI7XHJcbmltcG9ydCB7IENsaWVudFBsYXllciB9IGZyb20gXCIuLi8uLi9jbGllbnRQbGF5ZXIvY2xpZW50UGxheWVyXCI7XHJcbmltcG9ydCB7IFNpZGVUeXBlIH0gZnJvbSBcIi4uL2hlYWx0aEJhclwiO1xyXG5pbXBvcnQgeyBKb2ludCB9IGZyb20gXCIuLi9qb2ludFwiO1xyXG5pbXBvcnQgeyBBbmltYXRpb25JbmZvLCBNb2RlbEFuaW1hdGlvbiB9IGZyb20gXCIuLi9tb2RlbFwiO1xyXG5pbXBvcnQgeyBQbGF5ZXJNb2RlbCB9IGZyb20gXCIuL3BsYXllck1vZGVsXCI7XHJcblxyXG50eXBlIERhZ2dlcnNQbGF5ZXJNb2RlbEpvaW50ID0gXCJwbGF5ZXJEYWdnZXJcIjtcclxuZXhwb3J0IHR5cGUgRGFnZ2Vyc1BsYXllckFuaW1hdGlvbk5hbWUgPSBcInN0YW5kXCIgfCBcInN0YWJcIiB8IFwibHVuZ2VcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBEYWdnZXJzUGxheWVyTW9kZWwgZXh0ZW5kcyBQbGF5ZXJNb2RlbCB7XHJcbiAgICBwcm90ZWN0ZWQgYW5pbWF0aW9uU3RhdGVBbmltYXRpb246IERhZ2dlcnNNb2RlbEFuaW1hdGlvbiA9IERhZ2dlcnNQbGF5ZXJBbmltYXRpb25EYXRhW1wic3RhbmRcIl07XHJcbiAgICBwcm90ZWN0ZWQgYW5pbWF0aW9uU3RhdGU6IERhZ2dlcnNQbGF5ZXJBbmltYXRpb25OYW1lID0gXCJzdGFuZFwiO1xyXG4gICAgcHJvdGVjdGVkIGRhZ2dlckpvaW50OiBKb2ludDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihnYW1lOiBHYW1lLCBwbGF5ZXI6IENsaWVudERhZ2dlcnMsIGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELCBwb3NpdGlvbjogVmVjdG9yLCBoZWFsdGhCYXJUeXBlOiBTaWRlVHlwZSwgcGxheWVyQ29sb3I6IHN0cmluZywgc2l6ZTogU2l6ZSkge1xyXG4gICAgICAgIHN1cGVyKGdhbWUsIHBsYXllciwgY3R4LCBwb3NpdGlvbiwgaGVhbHRoQmFyVHlwZSwgcGxheWVyQ29sb3IsIHNpemUpO1xyXG4gICAgICAgIHRoaXMuZGFnZ2VySm9pbnQgPSBuZXcgSm9pbnQodGhpcy5jdHgsIGFzc2V0TWFuYWdlci5pbWFnZXNbXCJkYWdnZXIyMVwiXSwgeyB4OiAtMjAwLCB5OiAtNzAwIH0sIDAuMDksIDAsIHsgeDogLTIwLCB5OiAyMCB9LCAwLCAtMC41KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVuZGVyV2VhcG9uKCkge1xyXG4gICAgICAgIHRoaXMuZGFnZ2VySm9pbnQucmVuZGVyKHRoaXMuYW5pbWF0aW9uVGltZSAvIHRoaXMuYW5pbWF0aW9uU3RhdGVBbmltYXRpb24udG90YWxUaW1lLCB0aGlzLmFuaW1hdGlvblN0YXRlQW5pbWF0aW9uLmpvaW50QW5pbWF0aW9uSW5mb1tcInBsYXllckRhZ2dlclwiXSk7XHJcblxyXG4gICAgICAgIHRoaXMuY3R4LnNjYWxlKC0xLCAxKTtcclxuICAgICAgICAvL3JlbmRlclNoYXBlKHRoaXMuY3R4LCBEYWdnZXJzU3RhYkhpdFNoYXBlKTtcclxuICAgICAgICB0aGlzLmN0eC5zY2FsZSgtMSwgMSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHVwZGF0ZShlbGFwc2VkVGltZTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5hbmltYXRpb25UaW1lICs9IGVsYXBzZWRUaW1lO1xyXG4gICAgICAgIGlmICh0aGlzLmFuaW1hdGlvblRpbWUgPj0gdGhpcy5hbmltYXRpb25TdGF0ZUFuaW1hdGlvbi50b3RhbFRpbWUpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuYW5pbWF0aW9uU3RhdGVBbmltYXRpb24ubG9vcCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hbmltYXRpb25UaW1lID0gMDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0QW5pbWF0aW9uKFwic3RhbmRcIiwgMCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZGFnZ2VySm9pbnQudXBkYXRlKGVsYXBzZWRUaW1lKTtcclxuICAgICAgICBzdXBlci51cGRhdGUoZWxhcHNlZFRpbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRBbmltYXRpb24oYW5pbWF0aW9uOiBEYWdnZXJzUGxheWVyQW5pbWF0aW9uTmFtZSwgYW5nbGU6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuYW5pbWF0aW9uVGltZSA9IDA7XHJcbiAgICAgICAgdGhpcy5jaGFuZ2VGYWNpbmdBbmdsZShhbmdsZSk7XHJcblxyXG4gICAgICAgIHRoaXMuYW5pbWF0aW9uU3RhdGUgPSBhbmltYXRpb247XHJcbiAgICAgICAgdGhpcy5hbmltYXRpb25TdGF0ZUFuaW1hdGlvbiA9IERhZ2dlcnNQbGF5ZXJBbmltYXRpb25EYXRhW2FuaW1hdGlvbl07XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgRGFnZ2Vyc01vZGVsQW5pbWF0aW9uIGV4dGVuZHMgTW9kZWxBbmltYXRpb24ge1xyXG4gICAgdG90YWxUaW1lOiBudW1iZXI7XHJcbiAgICBsb29wOiBib29sZWFuO1xyXG4gICAgam9pbnRBbmltYXRpb25JbmZvOiBSZWNvcmQ8RGFnZ2Vyc1BsYXllck1vZGVsSm9pbnQsIEFuaW1hdGlvbkluZm8+O1xyXG59XHJcblxyXG5jb25zdCBEYWdnZXJzUGxheWVyQW5pbWF0aW9uRGF0YTogUmVjb3JkPERhZ2dlcnNQbGF5ZXJBbmltYXRpb25OYW1lLCBEYWdnZXJzTW9kZWxBbmltYXRpb24+ID0ge1xyXG4gICAgc3RhbmQ6IHtcclxuICAgICAgICBsb29wOiB0cnVlLFxyXG4gICAgICAgIHRvdGFsVGltZTogMSxcclxuICAgICAgICBqb2ludEFuaW1hdGlvbkluZm86IHtcclxuICAgICAgICAgICAgcGxheWVyRGFnZ2VyOiB7XHJcbiAgICAgICAgICAgICAgICBpbWdSb3RhdGlvbkVxdWF0aW9uOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgICAgICBsb2NhbFBvc1hFcXVhdGlvbjogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICAgICAgbG9jYWxQb3NZRXF1YXRpb246IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgICAgIGFuZ2xlRnJvbUVxdWF0aW9uOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgICAgICBhbmdsZVRvRXF1YXRpb246IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgfSxcclxuICAgIHN0YWI6IHtcclxuICAgICAgICBsb29wOiBmYWxzZSxcclxuICAgICAgICB0b3RhbFRpbWU6IDAuNixcclxuICAgICAgICBqb2ludEFuaW1hdGlvbkluZm86IHtcclxuICAgICAgICAgICAgcGxheWVyRGFnZ2VyOiB7XHJcbiAgICAgICAgICAgICAgICBpbWdSb3RhdGlvbkVxdWF0aW9uOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgICAgICBsb2NhbFBvc1lFcXVhdGlvbjogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICAgICAgYW5nbGVGcm9tRXF1YXRpb246IFtcclxuICAgICAgICAgICAgICAgICAgICBbMCwgLTJdLFxyXG4gICAgICAgICAgICAgICAgICAgIFswLjEsIDAuM10sXHJcbiAgICAgICAgICAgICAgICAgICAgWzAuMiwgMS4zXSxcclxuICAgICAgICAgICAgICAgICAgICBbMC42LCAxLjddLFxyXG4gICAgICAgICAgICAgICAgICAgIFsxLCAyXSxcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICBhbmdsZVRvRXF1YXRpb246IFtcclxuICAgICAgICAgICAgICAgICAgICBbMCwgLTJdLFxyXG4gICAgICAgICAgICAgICAgICAgIFswLjEsIC0zXSxcclxuICAgICAgICAgICAgICAgICAgICBbMC4yLCAtMC44XSxcclxuICAgICAgICAgICAgICAgICAgICBbMC42LCAtMC42XSxcclxuICAgICAgICAgICAgICAgICAgICBbMSwgLTAuNV0sXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgbG9jYWxQb3NYRXF1YXRpb246IFtcclxuICAgICAgICAgICAgICAgICAgICBbMCwgMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgWzAuMSwgLTEwXSxcclxuICAgICAgICAgICAgICAgICAgICBbMC4xNSwgLTMwXSxcclxuICAgICAgICAgICAgICAgICAgICBbMC4yLCAwXSxcclxuICAgICAgICAgICAgICAgICAgICBbMSwgMTVdLFxyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgfSxcclxuICAgIGx1bmdlOiB7XHJcbiAgICAgICAgbG9vcDogZmFsc2UsXHJcbiAgICAgICAgdG90YWxUaW1lOiAwLjMsXHJcbiAgICAgICAgam9pbnRBbmltYXRpb25JbmZvOiB7XHJcbiAgICAgICAgICAgIHBsYXllckRhZ2dlcjoge1xyXG4gICAgICAgICAgICAgICAgaW1nUm90YXRpb25FcXVhdGlvbjogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICAgICAgbG9jYWxQb3NZRXF1YXRpb246IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgICAgIGFuZ2xlRnJvbUVxdWF0aW9uOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgICAgICBhbmdsZVRvRXF1YXRpb246IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgICAgIGxvY2FsUG9zWEVxdWF0aW9uOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgIH0sXHJcbn07XHJcbiIsImltcG9ydCB7IEdhbWUgfSBmcm9tIFwiLi4vLi4vLi4vLi4vLi4vY2xpZW50L2dhbWVcIjtcclxuaW1wb3J0IHsgYXNzZXRNYW5hZ2VyIH0gZnJvbSBcIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9nYW1lUmVuZGVyL2Fzc2V0bWFuYWdlclwiO1xyXG5pbXBvcnQgeyBmaW5kQW5nbGUgfSBmcm9tIFwiLi4vLi4vLi4vLi4vLi4vZmluZEFuZ2xlXCI7XHJcbmltcG9ydCB7IFNpemUgfSBmcm9tIFwiLi4vLi4vLi4vLi4vLi4vc2l6ZVwiO1xyXG5pbXBvcnQgeyBWZWN0b3IgfSBmcm9tIFwiLi4vLi4vLi4vLi4vLi4vdmVjdG9yXCI7XHJcbmltcG9ydCB7IHJlbmRlclNoYXBlIH0gZnJvbSBcIi4uLy4uL2NsaWVudEFjdG9yXCI7XHJcbmltcG9ydCB7IENsaWVudEhhbW1lciB9IGZyb20gXCIuLi8uLi9jbGllbnRQbGF5ZXIvY2xpZW50Q2xhc3Nlcy9jbGllbnRIYW1tZXJcIjtcclxuaW1wb3J0IHsgQ2xpZW50UGxheWVyIH0gZnJvbSBcIi4uLy4uL2NsaWVudFBsYXllci9jbGllbnRQbGF5ZXJcIjtcclxuaW1wb3J0IHsgU2lkZVR5cGUgfSBmcm9tIFwiLi4vaGVhbHRoQmFyXCI7XHJcbmltcG9ydCB7IEpvaW50IH0gZnJvbSBcIi4uL2pvaW50XCI7XHJcbmltcG9ydCB7IEFuaW1hdGlvbkluZm8sIE1vZGVsQW5pbWF0aW9uIH0gZnJvbSBcIi4uL21vZGVsXCI7XHJcbmltcG9ydCB7IFBsYXllck1vZGVsIH0gZnJvbSBcIi4vcGxheWVyTW9kZWxcIjtcclxuXHJcbnR5cGUgSGFtbWVyUGxheWVyTW9kZWxKb2ludCA9IFwicGxheWVySGFtbWVyXCI7XHJcbmV4cG9ydCB0eXBlIEhhbW1lclBsYXllckFuaW1hdGlvbk5hbWUgPSBcInN0YW5kXCIgfCBcInN3aW5nMVwiIHwgXCJzd2luZzJcIiB8IFwicG91bmRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBIYW1tZXJQbGF5ZXJNb2RlbCBleHRlbmRzIFBsYXllck1vZGVsIHtcclxuICAgIHByb3RlY3RlZCBhbmltYXRpb25TdGF0ZUFuaW1hdGlvbjogSGFtbWVyTW9kZWxBbmltYXRpb24gPSBIYW1tZXJQbGF5ZXJBbmltYXRpb25EYXRhW1wic3RhbmRcIl07XHJcbiAgICBwcm90ZWN0ZWQgYW5pbWF0aW9uU3RhdGU6IEhhbW1lclBsYXllckFuaW1hdGlvbk5hbWUgPSBcInN0YW5kXCI7XHJcbiAgICBwcm90ZWN0ZWQgaGFtbWVySm9pbnQ6IEpvaW50O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGdhbWU6IEdhbWUsIHBsYXllcjogQ2xpZW50SGFtbWVyLCBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCwgcG9zaXRpb246IFZlY3RvciwgaGVhbHRoQmFyVHlwZTogU2lkZVR5cGUsIHBsYXllckNvbG9yOiBzdHJpbmcsIHNpemU6IFNpemUpIHtcclxuICAgICAgICBzdXBlcihnYW1lLCBwbGF5ZXIsIGN0eCwgcG9zaXRpb24sIGhlYWx0aEJhclR5cGUsIHBsYXllckNvbG9yLCBzaXplKTtcclxuICAgICAgICB0aGlzLmhhbW1lckpvaW50ID0gbmV3IEpvaW50KHRoaXMuY3R4LCBhc3NldE1hbmFnZXIuaW1hZ2VzW1wiaGFtbWVyMjFcIl0sIHsgeDogLTIwMCwgeTogLTcwMCB9LCAwLjEyLCAwLCB7IHg6IC0yNSwgeTogMjAgfSwgMCwgLTAuNCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlbmRlcldlYXBvbigpIHtcclxuICAgICAgICB0aGlzLmhhbW1lckpvaW50LnJlbmRlcih0aGlzLmFuaW1hdGlvblRpbWUgLyB0aGlzLmFuaW1hdGlvblN0YXRlQW5pbWF0aW9uLnRvdGFsVGltZSwgdGhpcy5hbmltYXRpb25TdGF0ZUFuaW1hdGlvbi5qb2ludEFuaW1hdGlvbkluZm9bXCJwbGF5ZXJIYW1tZXJcIl0pO1xyXG5cclxuICAgICAgICAvKnRoaXMuY3R4LnNjYWxlKC0xLCAxKTtcclxuICAgICAgICByZW5kZXJTaGFwZSh0aGlzLmN0eCwgaGFtbWVyU2xhc2hIaXRTaGFwZSk7XHJcbiAgICAgICAgdGhpcy5jdHguc2NhbGUoLTEsIDEpOyovXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHVwZGF0ZShlbGFwc2VkVGltZTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5hbmltYXRpb25UaW1lICs9IGVsYXBzZWRUaW1lO1xyXG4gICAgICAgIGlmICh0aGlzLmFuaW1hdGlvblRpbWUgPj0gdGhpcy5hbmltYXRpb25TdGF0ZUFuaW1hdGlvbi50b3RhbFRpbWUpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuYW5pbWF0aW9uU3RhdGVBbmltYXRpb24ubG9vcCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hbmltYXRpb25UaW1lID0gMDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0QW5pbWF0aW9uKFwic3RhbmRcIiwgMCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuaGFtbWVySm9pbnQudXBkYXRlKGVsYXBzZWRUaW1lKTtcclxuICAgICAgICBzdXBlci51cGRhdGUoZWxhcHNlZFRpbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRBbmltYXRpb24oYW5pbWF0aW9uOiBIYW1tZXJQbGF5ZXJBbmltYXRpb25OYW1lLCBhbmdsZTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5hbmltYXRpb25UaW1lID0gMDtcclxuICAgICAgICB0aGlzLmNoYW5nZUZhY2luZ0FuZ2xlKGFuZ2xlKTtcclxuICAgICAgICBpZiAoYW5pbWF0aW9uID09PSBcInN3aW5nMVwiICYmIHRoaXMuYW5pbWF0aW9uU3RhdGUgPT09IFwic3dpbmcxXCIpIHtcclxuICAgICAgICAgICAgdGhpcy5hbmltYXRpb25TdGF0ZSA9IFwic3dpbmcyXCI7XHJcbiAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9uU3RhdGVBbmltYXRpb24gPSBIYW1tZXJQbGF5ZXJBbmltYXRpb25EYXRhW1wic3dpbmcyXCJdO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9uU3RhdGUgPSBhbmltYXRpb247XHJcbiAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9uU3RhdGVBbmltYXRpb24gPSBIYW1tZXJQbGF5ZXJBbmltYXRpb25EYXRhW2FuaW1hdGlvbl07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEhhbW1lck1vZGVsQW5pbWF0aW9uIGV4dGVuZHMgTW9kZWxBbmltYXRpb24ge1xyXG4gICAgdG90YWxUaW1lOiBudW1iZXI7XHJcbiAgICBsb29wOiBib29sZWFuO1xyXG4gICAgam9pbnRBbmltYXRpb25JbmZvOiBSZWNvcmQ8SGFtbWVyUGxheWVyTW9kZWxKb2ludCwgQW5pbWF0aW9uSW5mbz47XHJcbn1cclxuXHJcbmNvbnN0IEhhbW1lclBsYXllckFuaW1hdGlvbkRhdGE6IFJlY29yZDxIYW1tZXJQbGF5ZXJBbmltYXRpb25OYW1lLCBIYW1tZXJNb2RlbEFuaW1hdGlvbj4gPSB7XHJcbiAgICBzdGFuZDoge1xyXG4gICAgICAgIGxvb3A6IHRydWUsXHJcbiAgICAgICAgdG90YWxUaW1lOiAxLFxyXG4gICAgICAgIGpvaW50QW5pbWF0aW9uSW5mbzoge1xyXG4gICAgICAgICAgICBwbGF5ZXJIYW1tZXI6IHtcclxuICAgICAgICAgICAgICAgIGltZ1JvdGF0aW9uRXF1YXRpb246IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgICAgIGxvY2FsUG9zWEVxdWF0aW9uOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgICAgICBsb2NhbFBvc1lFcXVhdGlvbjogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICAgICAgYW5nbGVGcm9tRXF1YXRpb246IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgICAgIGFuZ2xlVG9FcXVhdGlvbjogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAgc3dpbmcyOiB7XHJcbiAgICAgICAgbG9vcDogZmFsc2UsXHJcbiAgICAgICAgdG90YWxUaW1lOiAwLjgsXHJcbiAgICAgICAgam9pbnRBbmltYXRpb25JbmZvOiB7XHJcbiAgICAgICAgICAgIHBsYXllckhhbW1lcjoge1xyXG4gICAgICAgICAgICAgICAgaW1nUm90YXRpb25FcXVhdGlvbjogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICAgICAgbG9jYWxQb3NZRXF1YXRpb246IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgICAgIGFuZ2xlRnJvbUVxdWF0aW9uOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgWzAsIC0yXSxcclxuICAgICAgICAgICAgICAgICAgICBbMC4xLCAwLjNdLFxyXG4gICAgICAgICAgICAgICAgICAgIFswLjIsIDEuM10sXHJcbiAgICAgICAgICAgICAgICAgICAgWzAuNiwgMS43XSxcclxuICAgICAgICAgICAgICAgICAgICBbMSwgMl0sXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgYW5nbGVUb0VxdWF0aW9uOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgWzAsIC0yXSxcclxuICAgICAgICAgICAgICAgICAgICBbMC4xLCAtM10sXHJcbiAgICAgICAgICAgICAgICAgICAgWzAuMiwgLTAuOF0sXHJcbiAgICAgICAgICAgICAgICAgICAgWzAuNiwgLTAuNl0sXHJcbiAgICAgICAgICAgICAgICAgICAgWzEsIC0wLjVdLFxyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIGxvY2FsUG9zWEVxdWF0aW9uOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgWzAsIDBdLFxyXG4gICAgICAgICAgICAgICAgICAgIFswLjEsIC0xMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgWzAuMTUsIC0zMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgWzAuMiwgMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgWzEsIDE1XSxcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgIH0sXHJcbiAgICBzd2luZzE6IHtcclxuICAgICAgICBsb29wOiBmYWxzZSxcclxuICAgICAgICB0b3RhbFRpbWU6IDAuOCxcclxuICAgICAgICBqb2ludEFuaW1hdGlvbkluZm86IHtcclxuICAgICAgICAgICAgcGxheWVySGFtbWVyOiB7XHJcbiAgICAgICAgICAgICAgICBpbWdSb3RhdGlvbkVxdWF0aW9uOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgICAgICBsb2NhbFBvc1lFcXVhdGlvbjogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICAgICAgYW5nbGVGcm9tRXF1YXRpb246IFtcclxuICAgICAgICAgICAgICAgICAgICBbMC4wLCAxLjZdLFxyXG4gICAgICAgICAgICAgICAgICAgIFswLjMsIC0xLjddLFxyXG4gICAgICAgICAgICAgICAgICAgIFswLjQsIC0xLjhdLFxyXG4gICAgICAgICAgICAgICAgICAgIFsxLCAtMS42XSxcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICBhbmdsZVRvRXF1YXRpb246IFtcclxuICAgICAgICAgICAgICAgICAgICBbMC4wLCAwLjVdLFxyXG4gICAgICAgICAgICAgICAgICAgIFswLjE1LCAtMC4xXSxcclxuICAgICAgICAgICAgICAgICAgICBbMC4zLCAtMC42XSxcclxuICAgICAgICAgICAgICAgICAgICBbMC41LCAtMC45XSxcclxuICAgICAgICAgICAgICAgICAgICBbMSwgLTAuOF0sXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgbG9jYWxQb3NYRXF1YXRpb246IFtcclxuICAgICAgICAgICAgICAgICAgICBbMCwgMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgWzAuMiwgLTMwXSxcclxuICAgICAgICAgICAgICAgICAgICBbMC42LCA3XSxcclxuICAgICAgICAgICAgICAgICAgICBbMSwgMTJdLFxyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgfSxcclxuICAgIHBvdW5kOiB7XHJcbiAgICAgICAgbG9vcDogZmFsc2UsXHJcbiAgICAgICAgdG90YWxUaW1lOiAxLFxyXG4gICAgICAgIGpvaW50QW5pbWF0aW9uSW5mbzoge1xyXG4gICAgICAgICAgICBwbGF5ZXJIYW1tZXI6IHtcclxuICAgICAgICAgICAgICAgIGltZ1JvdGF0aW9uRXF1YXRpb246IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgICAgIGxvY2FsUG9zWUVxdWF0aW9uOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgICAgICBhbmdsZUZyb21FcXVhdGlvbjogW1xyXG4gICAgICAgICAgICAgICAgICAgIFswLCAwXSxcclxuICAgICAgICAgICAgICAgICAgICBbMC4zLCBNYXRoLlBJICogLTFdLFxyXG4gICAgICAgICAgICAgICAgICAgIFswLjMsIE1hdGguUEldLFxyXG4gICAgICAgICAgICAgICAgICAgIFswLjYsIE1hdGguUEkgKiAtMV0sXHJcbiAgICAgICAgICAgICAgICAgICAgWzAuNiwgTWF0aC5QSV0sXHJcbiAgICAgICAgICAgICAgICAgICAgWzAuOSwgTWF0aC5QSSAqIC0xXSxcclxuICAgICAgICAgICAgICAgICAgICBbMC45LCBNYXRoLlBJXSxcclxuICAgICAgICAgICAgICAgICAgICBbMSwgMF0sXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgYW5nbGVUb0VxdWF0aW9uOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgWzAsIDBdLFxyXG4gICAgICAgICAgICAgICAgICAgIFswLjEzLCAwLjNdLFxyXG4gICAgICAgICAgICAgICAgICAgIFswLjIsIC0xXSxcclxuICAgICAgICAgICAgICAgICAgICBbMSwgLTBdLFxyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIGxvY2FsUG9zWEVxdWF0aW9uOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgWzAsIDBdLFxyXG4gICAgICAgICAgICAgICAgICAgIFswLjEzLCAxMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgWzAuMiwgLTVdLFxyXG4gICAgICAgICAgICAgICAgICAgIFsxLCAwXSxcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgIH0sXHJcbn07XHJcbiIsImltcG9ydCB7IEdhbWUgfSBmcm9tIFwiLi4vLi4vLi4vLi4vLi4vY2xpZW50L2dhbWVcIjtcclxuaW1wb3J0IHsgcm91bmRSZWN0IH0gZnJvbSBcIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9nYW1lUmVuZGVyL2dhbWVSZW5kZXJlclwiO1xyXG5pbXBvcnQgeyBTaXplIH0gZnJvbSBcIi4uLy4uLy4uLy4uLy4uL3NpemVcIjtcclxuaW1wb3J0IHsgZmluZE1pcnJvcmVkQW5nbGUsIHJvdGF0ZVNoYXBlLCBWZWN0b3IgfSBmcm9tIFwiLi4vLi4vLi4vLi4vLi4vdmVjdG9yXCI7XHJcbmltcG9ydCB7IGRlZmF1bHRBY3RvckNvbmZpZyB9IGZyb20gXCIuLi8uLi8uLi9hY3RvckNvbmZpZ1wiO1xyXG5pbXBvcnQgeyByZW5kZXJTaGFwZSB9IGZyb20gXCIuLi8uLi9jbGllbnRBY3RvclwiO1xyXG5pbXBvcnQgeyBDbGllbnRQbGF5ZXIgfSBmcm9tIFwiLi4vLi4vY2xpZW50UGxheWVyL2NsaWVudFBsYXllclwiO1xyXG5pbXBvcnQgeyBTaWRlVHlwZSB9IGZyb20gXCIuLi9oZWFsdGhCYXJcIjtcclxuaW1wb3J0IHsgTW9kZWwgfSBmcm9tIFwiLi4vbW9kZWxcIjtcclxuXHJcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBQbGF5ZXJNb2RlbCBleHRlbmRzIE1vZGVsIHtcclxuICAgIHByb3RlY3RlZCBhbmltYXRpb25UaW1lOiBudW1iZXIgPSAwO1xyXG5cclxuICAgIHByb3RlY3RlZCBmYWNpbmdBbmltYXRpb246IHsgZnJhbWU6IG51bWJlcjsgZmFjaW5nUmlnaHQ6IGJvb2xlYW4gfTtcclxuICAgIHByb3RlY3RlZCBmYWNpbmdBbmdsZUFuaW1hdGlvbjogeyBmcmFtZTogbnVtYmVyOyBhbmdsZTogbnVtYmVyOyB0YXJnZXRBbmdsZTogbnVtYmVyIH0gPSB7IGZyYW1lOiAxLCBhbmdsZTogMCwgdGFyZ2V0QW5nbGU6IDAgfTtcclxuXHJcbiAgICBwcm90ZWN0ZWQgaGl0QW5pbWF0aW9uOiB7IGZyYW1lOiBudW1iZXI7IHJlbmRlckNvbG9yOiBzdHJpbmcgfTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBnYW1lOiBHYW1lLFxyXG4gICAgICAgIHBsYXllcjogQ2xpZW50UGxheWVyLFxyXG4gICAgICAgIGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELFxyXG4gICAgICAgIHBvc2l0aW9uOiBWZWN0b3IsXHJcbiAgICAgICAgaGVhbHRoQmFyVHlwZTogU2lkZVR5cGUsXHJcbiAgICAgICAgcHJvdGVjdGVkIHJlYWRvbmx5IHBsYXllckNvbG9yOiBzdHJpbmcsXHJcbiAgICAgICAgcHJvdGVjdGVkIHJlYWRvbmx5IHNpemU6IFNpemUsXHJcbiAgICApIHtcclxuICAgICAgICBzdXBlcihnYW1lLCBwbGF5ZXIsIGN0eCwgcG9zaXRpb24sIGhlYWx0aEJhclR5cGUpO1xyXG4gICAgICAgIHRoaXMuaGl0QW5pbWF0aW9uID0geyBmcmFtZTogMCwgcmVuZGVyQ29sb3I6IHRoaXMucGxheWVyQ29sb3IgfTtcclxuXHJcbiAgICAgICAgdGhpcy5mYWNpbmdBbmltYXRpb24gPSB7IGZyYW1lOiAxLCBmYWNpbmdSaWdodDogdGhpcy5wbGF5ZXIuZmFjaW5nUmlnaHQgfTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgcmVuZGVyQmxvY2soKSB7XHJcbiAgICAgICAgdGhpcy5jdHguZmlsbFN0eWxlID0gdGhpcy5oaXRBbmltYXRpb24ucmVuZGVyQ29sb3I7XHJcbiAgICAgICAgdGhpcy5jdHguZmlsbFJlY3QodGhpcy5zaXplLndpZHRoIC8gLTIsIHRoaXMuc2l6ZS5oZWlnaHQgLyAtMiwgdGhpcy5zaXplLndpZHRoLCB0aGlzLnNpemUuaGVpZ2h0KTtcclxuXHJcbiAgICAgICAgdGhpcy5jdHguc3Ryb2tlU3R5bGUgPSBcIiMyMjIyMjJcIjtcclxuICAgICAgICB0aGlzLmN0eC5saW5lV2lkdGggPSAyO1xyXG4gICAgICAgIHJvdW5kUmVjdCh0aGlzLmN0eCwgdGhpcy5zaXplLndpZHRoIC8gLTIgLSAxLCB0aGlzLnNpemUuaGVpZ2h0IC8gLTIgLSAxLCB0aGlzLnNpemUud2lkdGggKyAyLCB0aGlzLnNpemUuaGVpZ2h0ICsgMiwgMywgZmFsc2UsIHRydWUpO1xyXG4gICAgICAgIC8vKCk7XHJcblxyXG4gICAgICAgIC8qdGhpcy5jdHguc3Ryb2tlU3R5bGUgPSBcImdyZWVuXCI7XHJcbiAgICAgICAgdGhpcy5jdHgubGluZVdpZHRoID0gMztcclxuICAgICAgICB0aGlzLmN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICB0aGlzLmN0eC5tb3ZlVG8oMCwgMCk7XHJcbiAgICAgICAgdGhpcy5jdHgubGluZVRvKE1hdGguY29zKHRoaXMuZmFjaW5nQW5nbGVBbmltYXRpb24uYW5nbGUpICogNTAsIE1hdGguc2luKHRoaXMuZmFjaW5nQW5nbGVBbmltYXRpb24uYW5nbGUpICogNTApO1xyXG4gICAgICAgIHRoaXMuY3R4LnN0cm9rZSgpOyovXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlZ2lzdGVyRGFtYWdlKHF1YW50aXR5OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLmhpdEFuaW1hdGlvbi5mcmFtZSA9IDAuMDc7XHJcbiAgICAgICAgdGhpcy5oaXRBbmltYXRpb24ucmVuZGVyQ29sb3IgPSBcInJlZFwiO1xyXG4gICAgICAgIHN1cGVyLnJlZ2lzdGVyRGFtYWdlKHF1YW50aXR5KTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgdXBkYXRlSGl0QW5pbWF0aW9uKGVsYXBzZWRUaW1lOiBudW1iZXIpIHtcclxuICAgICAgICBpZiAodGhpcy5oaXRBbmltYXRpb24uZnJhbWUgPiAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaGl0QW5pbWF0aW9uLmZyYW1lIC09IGVsYXBzZWRUaW1lO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5oaXRBbmltYXRpb24uZnJhbWUgPD0gMCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5oaXRBbmltYXRpb24uZnJhbWUgPSAwO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5oaXRBbmltYXRpb24ucmVuZGVyQ29sb3IgPSB0aGlzLnBsYXllckNvbG9yO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZW5kZXIoKSB7XHJcbiAgICAgICAgdGhpcy5jdHgudHJhbnNsYXRlKHRoaXMucG9zaXRpb24ueCwgdGhpcy5wb3NpdGlvbi55KTtcclxuICAgICAgICB0aGlzLmN0eC5yb3RhdGUodGhpcy5wbGF5ZXIuYWN0b3JPYmplY3Qub2JqZWN0QW5nbGUpO1xyXG4gICAgICAgIHRoaXMucmVuZGVyQmxvY2soKTtcclxuICAgICAgICB0aGlzLmN0eC5yb3RhdGUoLXRoaXMucGxheWVyLmFjdG9yT2JqZWN0Lm9iamVjdEFuZ2xlKTtcclxuXHJcbiAgICAgICAgbGV0IGZhY2luZzogbnVtYmVyID0gdGhpcy5nZXRGYWNpbmdTY2FsZSgpO1xyXG4gICAgICAgIGxldCBhbmdsZTogbnVtYmVyID0gdGhpcy5nZXRGYWNpbmdBbmdsZSgpO1xyXG5cclxuICAgICAgICB0aGlzLmN0eC5zY2FsZShmYWNpbmcsIDEpO1xyXG4gICAgICAgIHRoaXMuY3R4LnJvdGF0ZShhbmdsZSk7XHJcbiAgICAgICAgdGhpcy5yZW5kZXJXZWFwb24oKTtcclxuICAgICAgICB0aGlzLmN0eC5yb3RhdGUoLWFuZ2xlKTtcclxuICAgICAgICB0aGlzLmN0eC5zY2FsZSgxIC8gZmFjaW5nLCAxKTtcclxuXHJcbiAgICAgICAgdGhpcy5jdHgudHJhbnNsYXRlKC10aGlzLnBvc2l0aW9uLngsIC10aGlzLnBvc2l0aW9uLnkpO1xyXG4gICAgICAgIHRoaXMuaGVhbHRoQmFyLnJlbmRlckhlYWx0aCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBhYnN0cmFjdCByZW5kZXJXZWFwb24oKTogdm9pZDtcclxuXHJcbiAgICBwcm90ZWN0ZWQgdXBkYXRlRmFjaW5nKGVsYXBzZWRUaW1lOiBudW1iZXIpIHtcclxuICAgICAgICBpZiAodGhpcy5mYWNpbmdBbmltYXRpb24uZnJhbWUgPCAxKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZmFjaW5nQW5pbWF0aW9uLmZyYW1lICs9IGVsYXBzZWRUaW1lICogKDEgLyBwbGF5ZXJNb2RlbENvbmZpZy50dXJuVGltZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGdldEZhY2luZ1NjYWxlKCk6IG51bWJlciB7XHJcbiAgICAgICAgaWYgKHRoaXMuZmFjaW5nQW5pbWF0aW9uLmZhY2luZ1JpZ2h0KSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmZhY2luZ0FuaW1hdGlvbi5mcmFtZSA8IDEpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAxIC0gdGhpcy5mYWNpbmdBbmltYXRpb24uZnJhbWUgKiAyO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZmFjaW5nQW5pbWF0aW9uLmZyYW1lIDwgMSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIC0xICsgdGhpcy5mYWNpbmdBbmltYXRpb24uZnJhbWUgKiAyO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNoYW5nZUZhY2luZyhmYWNpbmdSaWdodDogYm9vbGVhbikge1xyXG4gICAgICAgIHRoaXMuZmFjaW5nQW5pbWF0aW9uLmZhY2luZ1JpZ2h0ID0gZmFjaW5nUmlnaHQ7XHJcbiAgICAgICAgdGhpcy5mYWNpbmdBbmltYXRpb24uZnJhbWUgPSAwO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCB1cGRhdGVGYWNpbmdBbmdsZShlbGFwc2VkVGltZTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5mYWNpbmdBbmdsZUFuaW1hdGlvbi5hbmdsZSA9XHJcbiAgICAgICAgICAgICh0aGlzLmZhY2luZ0FuZ2xlQW5pbWF0aW9uLnRhcmdldEFuZ2xlIC0gdGhpcy5mYWNpbmdBbmdsZUFuaW1hdGlvbi5hbmdsZSkgKiAoZWxhcHNlZFRpbWUgKiA1KSArIHRoaXMuZmFjaW5nQW5nbGVBbmltYXRpb24uYW5nbGU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGdldEZhY2luZ0FuZ2xlKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIC10aGlzLmZhY2luZ0FuZ2xlQW5pbWF0aW9uLmFuZ2xlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjaGFuZ2VGYWNpbmdBbmdsZShhbmdsZTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5mYWNpbmdBbmdsZUFuaW1hdGlvbi5mcmFtZSA9IDA7XHJcbiAgICAgICAgdGhpcy5mYWNpbmdBbmdsZUFuaW1hdGlvbi50YXJnZXRBbmdsZSA9IGZpbmRNaXJyb3JlZEFuZ2xlKGFuZ2xlKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0Q29sb3IoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5wbGF5ZXJDb2xvcjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdXBkYXRlKGVsYXBzZWRUaW1lOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZUZhY2luZyhlbGFwc2VkVGltZSk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVGYWNpbmdBbmdsZShlbGFwc2VkVGltZSk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVIaXRBbmltYXRpb24oZWxhcHNlZFRpbWUpO1xyXG4gICAgICAgIHN1cGVyLnVwZGF0ZShlbGFwc2VkVGltZSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgUGxheWVyTW9kZWxDb25maWcge1xyXG4gICAgdHVyblRpbWU6IG51bWJlcjtcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IHBsYXllck1vZGVsQ29uZmlnOiBQbGF5ZXJNb2RlbENvbmZpZyA9IHtcclxuICAgIHR1cm5UaW1lOiAwLjA2LFxyXG59O1xyXG4iLCJpbXBvcnQgeyBHYW1lIH0gZnJvbSBcIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9nYW1lXCI7XHJcbmltcG9ydCB7IGFzc2V0TWFuYWdlciB9IGZyb20gXCIuLi8uLi8uLi8uLi8uLi9jbGllbnQvZ2FtZVJlbmRlci9hc3NldG1hbmFnZXJcIjtcclxuaW1wb3J0IHsgZmluZEFuZ2xlIH0gZnJvbSBcIi4uLy4uLy4uLy4uLy4uL2ZpbmRBbmdsZVwiO1xyXG5pbXBvcnQgeyBTaXplIH0gZnJvbSBcIi4uLy4uLy4uLy4uLy4uL3NpemVcIjtcclxuaW1wb3J0IHsgVmVjdG9yIH0gZnJvbSBcIi4uLy4uLy4uLy4uLy4uL3ZlY3RvclwiO1xyXG5pbXBvcnQgeyBTd29yZFNsYXNoSGl0U2hhcGUgfSBmcm9tIFwiLi4vLi4vLi4vLi4vY2xpZW50Q29udHJvbGxlcnMvY29udHJvbGxlcnMvYWJpbGl0aWVzL3N3b3JkQWJpbGl0aWVzL3N3b3JkU2xhc2hBYmlsaXR5XCI7XHJcbmltcG9ydCB7IHJlbmRlclNoYXBlIH0gZnJvbSBcIi4uLy4uL2NsaWVudEFjdG9yXCI7XHJcbmltcG9ydCB7IENsaWVudFN3b3JkIH0gZnJvbSBcIi4uLy4uL2NsaWVudFBsYXllci9jbGllbnRDbGFzc2VzL2NsaWVudFN3b3JkXCI7XHJcbmltcG9ydCB7IENsaWVudFBsYXllciB9IGZyb20gXCIuLi8uLi9jbGllbnRQbGF5ZXIvY2xpZW50UGxheWVyXCI7XHJcbmltcG9ydCB7IFNpZGVUeXBlIH0gZnJvbSBcIi4uL2hlYWx0aEJhclwiO1xyXG5pbXBvcnQgeyBKb2ludCB9IGZyb20gXCIuLi9qb2ludFwiO1xyXG5pbXBvcnQgeyBBbmltYXRpb25JbmZvLCBNb2RlbEFuaW1hdGlvbiB9IGZyb20gXCIuLi9tb2RlbFwiO1xyXG5pbXBvcnQgeyBQbGF5ZXJNb2RlbCB9IGZyb20gXCIuL3BsYXllck1vZGVsXCI7XHJcblxyXG50eXBlIFN3b3JkUGxheWVyTW9kZWxKb2ludCA9IFwicGxheWVyU3dvcmRcIjtcclxuZXhwb3J0IHR5cGUgU3dvcmRQbGF5ZXJBbmltYXRpb25OYW1lID0gXCJzdGFuZFwiIHwgXCJzbGFzaDFcIiB8IFwic2xhc2gyXCIgfCBcIndoaXJsd2luZFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFN3b3JkUGxheWVyTW9kZWwgZXh0ZW5kcyBQbGF5ZXJNb2RlbCB7XHJcbiAgICBwcm90ZWN0ZWQgYW5pbWF0aW9uU3RhdGVBbmltYXRpb246IFN3b3JkTW9kZWxBbmltYXRpb24gPSBTd29yZFBsYXllckFuaW1hdGlvbkRhdGFbXCJzdGFuZFwiXTtcclxuICAgIHByb3RlY3RlZCBhbmltYXRpb25TdGF0ZTogU3dvcmRQbGF5ZXJBbmltYXRpb25OYW1lID0gXCJzdGFuZFwiO1xyXG4gICAgcHJvdGVjdGVkIHN3b3JkSm9pbnQ6IEpvaW50O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGdhbWU6IEdhbWUsIHBsYXllcjogQ2xpZW50U3dvcmQsIGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELCBwb3NpdGlvbjogVmVjdG9yLCBoZWFsdGhCYXJUeXBlOiBTaWRlVHlwZSwgcGxheWVyQ29sb3I6IHN0cmluZywgc2l6ZTogU2l6ZSkge1xyXG4gICAgICAgIHN1cGVyKGdhbWUsIHBsYXllciwgY3R4LCBwb3NpdGlvbiwgaGVhbHRoQmFyVHlwZSwgcGxheWVyQ29sb3IsIHNpemUpO1xyXG4gICAgICAgIHRoaXMuc3dvcmRKb2ludCA9IG5ldyBKb2ludCh0aGlzLmN0eCwgYXNzZXRNYW5hZ2VyLmltYWdlc1tcInN3b3JkMzFcIl0sIHsgeDogLTIwMCwgeTogLTcwMCB9LCAwLjEsIDAsIHsgeDogLTI1LCB5OiAyMCB9LCAwLCAtMC40KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVuZGVyV2VhcG9uKCkge1xyXG4gICAgICAgIHRoaXMuc3dvcmRKb2ludC5yZW5kZXIodGhpcy5hbmltYXRpb25UaW1lIC8gdGhpcy5hbmltYXRpb25TdGF0ZUFuaW1hdGlvbi50b3RhbFRpbWUsIHRoaXMuYW5pbWF0aW9uU3RhdGVBbmltYXRpb24uam9pbnRBbmltYXRpb25JbmZvW1wicGxheWVyU3dvcmRcIl0pO1xyXG5cclxuICAgICAgICAvKnRoaXMuY3R4LnNjYWxlKC0xLCAxKTtcclxuICAgICAgICByZW5kZXJTaGFwZSh0aGlzLmN0eCwgU3dvcmRTbGFzaEhpdFNoYXBlKTtcclxuICAgICAgICB0aGlzLmN0eC5zY2FsZSgtMSwgMSk7Ki9cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdXBkYXRlKGVsYXBzZWRUaW1lOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLmFuaW1hdGlvblRpbWUgKz0gZWxhcHNlZFRpbWU7XHJcbiAgICAgICAgaWYgKHRoaXMuYW5pbWF0aW9uVGltZSA+PSB0aGlzLmFuaW1hdGlvblN0YXRlQW5pbWF0aW9uLnRvdGFsVGltZSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5hbmltYXRpb25TdGF0ZUFuaW1hdGlvbi5sb29wKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFuaW1hdGlvblRpbWUgPSAwO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRBbmltYXRpb24oXCJzdGFuZFwiLCAwKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5zd29yZEpvaW50LnVwZGF0ZShlbGFwc2VkVGltZSk7XHJcbiAgICAgICAgc3VwZXIudXBkYXRlKGVsYXBzZWRUaW1lKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0QW5pbWF0aW9uKGFuaW1hdGlvbjogU3dvcmRQbGF5ZXJBbmltYXRpb25OYW1lLCBhbmdsZTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5hbmltYXRpb25UaW1lID0gMDtcclxuICAgICAgICB0aGlzLmNoYW5nZUZhY2luZ0FuZ2xlKGFuZ2xlKTtcclxuICAgICAgICBpZiAoYW5pbWF0aW9uID09PSBcInNsYXNoMVwiICYmIHRoaXMuYW5pbWF0aW9uU3RhdGUgPT09IFwic2xhc2gxXCIpIHtcclxuICAgICAgICAgICAgdGhpcy5hbmltYXRpb25TdGF0ZSA9IFwic2xhc2gyXCI7XHJcbiAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9uU3RhdGVBbmltYXRpb24gPSBTd29yZFBsYXllckFuaW1hdGlvbkRhdGFbXCJzbGFzaDJcIl07XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5hbmltYXRpb25TdGF0ZSA9IGFuaW1hdGlvbjtcclxuICAgICAgICAgICAgdGhpcy5hbmltYXRpb25TdGF0ZUFuaW1hdGlvbiA9IFN3b3JkUGxheWVyQW5pbWF0aW9uRGF0YVthbmltYXRpb25dO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBTd29yZE1vZGVsQW5pbWF0aW9uIGV4dGVuZHMgTW9kZWxBbmltYXRpb24ge1xyXG4gICAgdG90YWxUaW1lOiBudW1iZXI7XHJcbiAgICBsb29wOiBib29sZWFuO1xyXG4gICAgam9pbnRBbmltYXRpb25JbmZvOiBSZWNvcmQ8U3dvcmRQbGF5ZXJNb2RlbEpvaW50LCBBbmltYXRpb25JbmZvPjtcclxufVxyXG5cclxuY29uc3QgU3dvcmRQbGF5ZXJBbmltYXRpb25EYXRhOiBSZWNvcmQ8U3dvcmRQbGF5ZXJBbmltYXRpb25OYW1lLCBTd29yZE1vZGVsQW5pbWF0aW9uPiA9IHtcclxuICAgIHN0YW5kOiB7XHJcbiAgICAgICAgbG9vcDogdHJ1ZSxcclxuICAgICAgICB0b3RhbFRpbWU6IDEsXHJcbiAgICAgICAgam9pbnRBbmltYXRpb25JbmZvOiB7XHJcbiAgICAgICAgICAgIHBsYXllclN3b3JkOiB7XHJcbiAgICAgICAgICAgICAgICBpbWdSb3RhdGlvbkVxdWF0aW9uOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgICAgICBsb2NhbFBvc1hFcXVhdGlvbjogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICAgICAgbG9jYWxQb3NZRXF1YXRpb246IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgICAgIGFuZ2xlRnJvbUVxdWF0aW9uOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgICAgICBhbmdsZVRvRXF1YXRpb246IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgfSxcclxuICAgIHNsYXNoMToge1xyXG4gICAgICAgIGxvb3A6IGZhbHNlLFxyXG4gICAgICAgIHRvdGFsVGltZTogMC42LFxyXG4gICAgICAgIGpvaW50QW5pbWF0aW9uSW5mbzoge1xyXG4gICAgICAgICAgICBwbGF5ZXJTd29yZDoge1xyXG4gICAgICAgICAgICAgICAgaW1nUm90YXRpb25FcXVhdGlvbjogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICAgICAgbG9jYWxQb3NZRXF1YXRpb246IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgICAgIGFuZ2xlRnJvbUVxdWF0aW9uOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgWzAsIC0yXSxcclxuICAgICAgICAgICAgICAgICAgICBbMC4xLCAwLjNdLFxyXG4gICAgICAgICAgICAgICAgICAgIFswLjIsIDEuM10sXHJcbiAgICAgICAgICAgICAgICAgICAgWzAuNiwgMS43XSxcclxuICAgICAgICAgICAgICAgICAgICBbMSwgMl0sXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgYW5nbGVUb0VxdWF0aW9uOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgWzAsIC0yXSxcclxuICAgICAgICAgICAgICAgICAgICBbMC4xLCAtM10sXHJcbiAgICAgICAgICAgICAgICAgICAgWzAuMiwgLTAuOF0sXHJcbiAgICAgICAgICAgICAgICAgICAgWzAuNiwgLTAuNl0sXHJcbiAgICAgICAgICAgICAgICAgICAgWzEsIC0wLjVdLFxyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIGxvY2FsUG9zWEVxdWF0aW9uOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgWzAsIDBdLFxyXG4gICAgICAgICAgICAgICAgICAgIFswLjEsIC0xMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgWzAuMTUsIC0zMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgWzAuMiwgMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgWzEsIDE1XSxcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgIH0sXHJcbiAgICBzbGFzaDI6IHtcclxuICAgICAgICBsb29wOiBmYWxzZSxcclxuICAgICAgICB0b3RhbFRpbWU6IDAuNCxcclxuICAgICAgICBqb2ludEFuaW1hdGlvbkluZm86IHtcclxuICAgICAgICAgICAgcGxheWVyU3dvcmQ6IHtcclxuICAgICAgICAgICAgICAgIGltZ1JvdGF0aW9uRXF1YXRpb246IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgICAgIGxvY2FsUG9zWUVxdWF0aW9uOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgICAgICBhbmdsZUZyb21FcXVhdGlvbjogW1xyXG4gICAgICAgICAgICAgICAgICAgIFswLjAsIDEuNl0sXHJcbiAgICAgICAgICAgICAgICAgICAgWzAuMywgLTEuN10sXHJcbiAgICAgICAgICAgICAgICAgICAgWzAuNCwgLTEuOF0sXHJcbiAgICAgICAgICAgICAgICAgICAgWzEsIC0xLjZdLFxyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIGFuZ2xlVG9FcXVhdGlvbjogW1xyXG4gICAgICAgICAgICAgICAgICAgIFswLjAsIDAuNV0sXHJcbiAgICAgICAgICAgICAgICAgICAgWzAuMTUsIC0wLjFdLFxyXG4gICAgICAgICAgICAgICAgICAgIFswLjMsIC0wLjZdLFxyXG4gICAgICAgICAgICAgICAgICAgIFswLjUsIC0wLjldLFxyXG4gICAgICAgICAgICAgICAgICAgIFsxLCAtMC44XSxcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICBsb2NhbFBvc1hFcXVhdGlvbjogW1xyXG4gICAgICAgICAgICAgICAgICAgIFswLCAwXSxcclxuICAgICAgICAgICAgICAgICAgICBbMC4yLCAtMzBdLFxyXG4gICAgICAgICAgICAgICAgICAgIFswLjYsIDddLFxyXG4gICAgICAgICAgICAgICAgICAgIFsxLCAxMl0sXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAgd2hpcmx3aW5kOiB7XHJcbiAgICAgICAgbG9vcDogZmFsc2UsXHJcbiAgICAgICAgdG90YWxUaW1lOiAxLFxyXG4gICAgICAgIGpvaW50QW5pbWF0aW9uSW5mbzoge1xyXG4gICAgICAgICAgICBwbGF5ZXJTd29yZDoge1xyXG4gICAgICAgICAgICAgICAgaW1nUm90YXRpb25FcXVhdGlvbjogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICAgICAgbG9jYWxQb3NZRXF1YXRpb246IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgICAgIGFuZ2xlRnJvbUVxdWF0aW9uOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgWzAsIDBdLFxyXG4gICAgICAgICAgICAgICAgICAgIFswLjMsIE1hdGguUEkgKiAtMV0sXHJcbiAgICAgICAgICAgICAgICAgICAgWzAuMywgTWF0aC5QSV0sXHJcbiAgICAgICAgICAgICAgICAgICAgWzAuNiwgTWF0aC5QSSAqIC0xXSxcclxuICAgICAgICAgICAgICAgICAgICBbMC42LCBNYXRoLlBJXSxcclxuICAgICAgICAgICAgICAgICAgICBbMC45LCBNYXRoLlBJICogLTFdLFxyXG4gICAgICAgICAgICAgICAgICAgIFswLjksIE1hdGguUEldLFxyXG4gICAgICAgICAgICAgICAgICAgIFsxLCAwXSxcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICBhbmdsZVRvRXF1YXRpb246IFtcclxuICAgICAgICAgICAgICAgICAgICBbMCwgMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgWzAuMTMsIDAuM10sXHJcbiAgICAgICAgICAgICAgICAgICAgWzAuMiwgLTFdLFxyXG4gICAgICAgICAgICAgICAgICAgIFsxLCAtMF0sXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgbG9jYWxQb3NYRXF1YXRpb246IFtcclxuICAgICAgICAgICAgICAgICAgICBbMCwgMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgWzAuMTMsIDEwXSxcclxuICAgICAgICAgICAgICAgICAgICBbMC4yLCAtNV0sXHJcbiAgICAgICAgICAgICAgICAgICAgWzEsIDBdLFxyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgfSxcclxufTtcclxuIiwiaW1wb3J0IHsgYXNzZXRNYW5hZ2VyIH0gZnJvbSBcIi4uLy4uLy4uL2NsaWVudC9nYW1lUmVuZGVyL2Fzc2V0bWFuYWdlclwiO1xyXG5pbXBvcnQgeyBTaXplIH0gZnJvbSBcIi4uLy4uLy4uL3NpemVcIjtcclxuaW1wb3J0IHsgVmVjdG9yIH0gZnJvbSBcIi4uLy4uLy4uL3ZlY3RvclwiO1xyXG5pbXBvcnQgeyBEb29kYWQsIERvb2RhZFR5cGUgfSBmcm9tIFwiLi9kb29kYWRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBDbGllbnREb29kYWQgZXh0ZW5kcyBEb29kYWQge1xyXG4gICAgcHJvdGVjdGVkIHJlYWRvbmx5IGltZzogSFRNTEltYWdlRWxlbWVudCA9IGFzc2V0TWFuYWdlci5pbWFnZXNbdGhpcy5kb29kYWRUeXBlXTtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwb3NpdGlvbjogVmVjdG9yLCByb3RhdGlvbjogbnVtYmVyLCBkb29kYWRUeXBlOiBEb29kYWRUeXBlLCBwcm90ZWN0ZWQgcmVhZG9ubHkgY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpIHtcclxuICAgICAgICBzdXBlcihwb3NpdGlvbiwgcm90YXRpb24sIGRvb2RhZFR5cGUpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBpZlNob3VsZFJlbmRlcihzY3JlZW5TaXplOiBTaXplLCBzY3JlZW5Qb3M6IFZlY3Rvcik6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICh0aGlzLnBvc2l0aW9uLnggKyB0aGlzLmNvbGxpc2lvblJhbmdlID49IHNjcmVlblBvcy54ICYmIHRoaXMucG9zaXRpb24ueCAtIHRoaXMuY29sbGlzaW9uUmFuZ2UgPD0gc2NyZWVuUG9zLnggKyBzY3JlZW5TaXplLndpZHRoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAvKmlmICh0aGlzLnBvc2l0aW9uLnkgKyB0aGlzLmNvbGxpc2lvblJhbmdlID49IHNjcmVlblBvcy55ICYmIHRoaXMucG9zaXRpb24ueSAtIHRoaXMuY29sbGlzaW9uUmFuZ2UgPD0gc2NyZWVuUG9zLnkgKyBzY3JlZW5TaXplLmhlaWdodCkge1xyXG4gICAgICAgICAgICB9Ki8gLy9vbmx5IG5lY2Vzc2FyeSBpZiB3ZSBhZGQgYSB5LWRpbWVuc2lvbiB0byB0aGUgZ2FtZS5cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZW5kZXIoKSB7XHJcbiAgICAgICAgdGhpcy5jdHgudHJhbnNsYXRlKE1hdGguZmxvb3IodGhpcy5wb3NpdGlvbi54KSwgTWF0aC5mbG9vcih0aGlzLnBvc2l0aW9uLnkpKTtcclxuICAgICAgICB0aGlzLmN0eC5yb3RhdGUodGhpcy5yb3RhdGlvbik7XHJcbiAgICAgICAgdGhpcy5jdHguZHJhd0ltYWdlKHRoaXMuaW1nLCAtMjAwLCAtMTQwKTtcclxuICAgICAgICB0aGlzLmN0eC5yb3RhdGUoLXRoaXMucm90YXRpb24pO1xyXG4gICAgICAgIHRoaXMuY3R4LnRyYW5zbGF0ZSgtdGhpcy5wb3NpdGlvbi54LCAtdGhpcy5wb3NpdGlvbi55KTtcclxuXHJcbiAgICAgICAgLy90aGlzLnJlbmRlclBvaW50cygpO1xyXG4gICAgICAgIC8vdGhpcy5yZW5kZXJFZGdlcyhmYWxzZSk7XHJcbiAgICAgICAgLy90aGlzLnJlbmRlck9ydGhvbm9ybWFscygpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZW5kZXJQb2ludHMoKSB7XHJcbiAgICAgICAgdGhpcy5jdHguZmlsbFN0eWxlID0gXCJyZWRcIjtcclxuICAgICAgICB0aGlzLnBvaW50cy5mb3JFYWNoKChwb2ludCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmN0eC5maWxsUmVjdChwb2ludC54IC0gNSwgcG9pbnQueSAtIDUsIDEwLCAxMCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlbmRlck9ydGhvbm9ybWFscygpIHtcclxuICAgICAgICB0aGlzLmN0eC5zdHJva2VTdHlsZSA9IFwicmVkXCI7XHJcbiAgICAgICAgdGhpcy5jdHgubGluZVdpZHRoID0gMjtcclxuICAgICAgICB0aGlzLmVkZ2VzLmZvckVhY2goKGVkZ2UpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5jdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgICAgIHRoaXMuY3R4Lm1vdmVUbygoZWRnZS5wMS54ICsgZWRnZS5wMi54KSAvIDIsIChlZGdlLnAxLnkgKyBlZGdlLnAyLnkpIC8gMik7XHJcbiAgICAgICAgICAgIHRoaXMuY3R4LmxpbmVUbygoZWRnZS5wMS54ICsgZWRnZS5wMi54KSAvIDIgKyBlZGdlLm9ydGhvZ29uYWxWZWN0b3IueCAqIDEwLCAoZWRnZS5wMS55ICsgZWRnZS5wMi55KSAvIDIgKyBlZGdlLm9ydGhvZ29uYWxWZWN0b3IueSAqIDEwKTtcclxuICAgICAgICAgICAgdGhpcy5jdHguc3Ryb2tlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgcmVuZGVyRWRnZXMoYWN0aXZhdGU6IGJvb2xlYW4pIHtcclxuICAgICAgICB0aGlzLmN0eC5saW5lV2lkdGggPSAyO1xyXG4gICAgICAgIHRoaXMuZWRnZXMuZm9yRWFjaCgoZWRnZSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoYWN0aXZhdGUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3R4LnN0cm9rZVN0eWxlID0gXCJyZWRcIjtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChlZGdlLmlzR3JvdW5kKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmN0eC5zdHJva2VTdHlsZSA9IFwiYmx1ZVwiO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jdHguc3Ryb2tlU3R5bGUgPSBcInJlZFwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgICB0aGlzLmN0eC5tb3ZlVG8oZWRnZS5wMS54LCBlZGdlLnAxLnkpO1xyXG4gICAgICAgICAgICB0aGlzLmN0eC5saW5lVG8oZWRnZS5wMi54LCBlZGdlLnAyLnkpO1xyXG4gICAgICAgICAgICB0aGlzLmN0eC5zdHJva2UoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBmaW5kQW5nbGUgfSBmcm9tIFwiLi4vLi4vLi4vZmluZEFuZ2xlXCI7XHJcbmltcG9ydCB7IGZpbmRJbnRlcnNlY3Rpb24sIGlmSW50ZXJzZWN0IH0gZnJvbSBcIi4uLy4uLy4uL2lmSW50ZXJzZWN0XCI7XHJcbmltcG9ydCB7XHJcbiAgICBEb29kYWRFZGdlLFxyXG4gICAgZG90UHJvZHVjdCxcclxuICAgIEVkZ2UsXHJcbiAgICBmaW5kRGlmZmVyZW5jZSxcclxuICAgIGZpbmREaXN0YW5jZSxcclxuICAgIGZpbmRMZW5ndGgsXHJcbiAgICBmaW5kT3J0aG9ub3JtYWxWZWN0b3IsXHJcbiAgICByb3RhdGVWZWN0b3IsXHJcbiAgICBTaGFwZSxcclxuICAgIFZlY3RvcixcclxuICAgIHZlY3RvclByb2plY3QsXHJcbn0gZnJvbSBcIi4uLy4uLy4uL3ZlY3RvclwiO1xyXG5cclxuY29uc3QgZG9vZGFkUG9pbnRJbmZvcm1hdGlvbjogUmVjb3JkPERvb2RhZFR5cGUsIFZlY3RvcltdPiA9IHtcclxuICAgIHJvY2tMYXJnZTogW1xyXG4gICAgICAgIHsgeDogLTE4MiwgeTogMTIgfSxcclxuICAgICAgICB7IHg6IC0yMDAsIHk6IC0zOCB9LFxyXG4gICAgICAgIHsgeDogLTEyOCwgeTogLTEwNSB9LFxyXG4gICAgICAgIHsgeDogLTEwLCB5OiAtMTM0IH0sXHJcbiAgICAgICAgeyB4OiAyMCwgeTogLTEzMyB9LFxyXG4gICAgICAgIHsgeDogMTIxLCB5OiAtODAgfSxcclxuICAgICAgICB7IHg6IDE5MywgeTogLTIyIH0sXHJcbiAgICAgICAgeyB4OiAxOTcsIHk6IDIzIH0sXHJcbiAgICBdLFxyXG59O1xyXG5cclxuZXhwb3J0IHR5cGUgRG9vZGFkVHlwZSA9IFwicm9ja0xhcmdlXCI7XHJcblxyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgRG9vZGFkIHtcclxuICAgIHByb3RlY3RlZCByZWFkb25seSBwb2ludHM6IFZlY3RvcltdID0gW107XHJcbiAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgZWRnZXM6IERvb2RhZEVkZ2VbXSA9IFtdO1xyXG4gICAgcHJvdGVjdGVkIGNvbGxpc2lvblJhbmdlOiBudW1iZXIgPSAwO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByb3RlY3RlZCByZWFkb25seSBwb3NpdGlvbjogVmVjdG9yLCBwcm90ZWN0ZWQgcmVhZG9ubHkgcm90YXRpb246IG51bWJlciwgcHJvdGVjdGVkIHJlYWRvbmx5IGRvb2RhZFR5cGU6IERvb2RhZFR5cGUpIHtcclxuICAgICAgICBsZXQgZG9vZGFkUG9pbnRzOiBWZWN0b3JbXSA9IGRvb2RhZFBvaW50SW5mb3JtYXRpb25bZG9vZGFkVHlwZV07XHJcbiAgICAgICAgLy9yb3RhdGUgYmFzZSBzaGFwZSBhbmQgc3RvcmUgaXQgaW4gdGhpcy5wb2ludHNcclxuICAgICAgICBkb29kYWRQb2ludHMuZm9yRWFjaCgocG9pbnQpID0+IHtcclxuICAgICAgICAgICAgbGV0IGxvY2FsUG9pbnQ6IFZlY3RvciA9IHJvdGF0ZVZlY3Rvcih0aGlzLnJvdGF0aW9uLCBwb2ludCk7XHJcbiAgICAgICAgICAgIHRoaXMucG9pbnRzLnB1c2goeyB4OiBsb2NhbFBvaW50LnggKyB0aGlzLnBvc2l0aW9uLngsIHk6IGxvY2FsUG9pbnQueSArIHRoaXMucG9zaXRpb24ueSB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy9maW5kIGxhcmdlc3QgZGlzdGFuY2UgYmV0d2VlbiBhIHBvaW50IGFuZCB0aGUgY2VudGVyXHJcbiAgICAgICAgdGhpcy5wb2ludHMuZm9yRWFjaCgocG9pbnQpID0+IHtcclxuICAgICAgICAgICAgbGV0IGRpc3RhbmNlOiBudW1iZXIgPSBmaW5kRGlzdGFuY2UodGhpcy5wb3NpdGlvbiwgcG9pbnQpO1xyXG4gICAgICAgICAgICBpZiAoZGlzdGFuY2UgPiB0aGlzLmNvbGxpc2lvblJhbmdlKSB0aGlzLmNvbGxpc2lvblJhbmdlID0gZGlzdGFuY2U7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vZmluZCBhbGwgdGhlIGVkZ2VzIGJhc2VkIG9uIHRoZSBwb2ludHNcclxuICAgICAgICBsZXQgcG9pbnRDb3VudDogbnVtYmVyID0gdGhpcy5wb2ludHMubGVuZ3RoO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpOiBudW1iZXIgPSAwOyBpIDwgcG9pbnRDb3VudDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCBwb2ludDE6IFZlY3RvciA9IHRoaXMucG9pbnRzW2ldO1xyXG4gICAgICAgICAgICBsZXQgcG9pbnQyOiBWZWN0b3IgPSB0aGlzLnBvaW50c1soaSArIDEpICUgcG9pbnRDb3VudF07XHJcbiAgICAgICAgICAgIGxldCBhbmdsZTogbnVtYmVyID0gZmluZEFuZ2xlKHBvaW50MSwgcG9pbnQyKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuZWRnZXMucHVzaCh7XHJcbiAgICAgICAgICAgICAgICBwMTogcG9pbnQxLFxyXG4gICAgICAgICAgICAgICAgcDI6IHBvaW50MixcclxuICAgICAgICAgICAgICAgIGFuZ2xlLFxyXG4gICAgICAgICAgICAgICAgc2xvcGU6IGZpbmREaWZmZXJlbmNlKHBvaW50MSwgcG9pbnQyKSxcclxuICAgICAgICAgICAgICAgIGlzR3JvdW5kOiBNYXRoLlBJIC8gLTUgPCBhbmdsZSAmJiBhbmdsZSA8IE1hdGguUEkgLyA1LFxyXG4gICAgICAgICAgICAgICAgb3J0aG9nb25hbFZlY3RvcjogZmluZE9ydGhvbm9ybWFsVmVjdG9yKHBvaW50MSwgcG9pbnQyKSxcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRDb2xsaXNpb25SYW5nZSgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbGxpc2lvblJhbmdlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogVmVyeSBjaGVhcCBjaGVjayBpZiB0d28gb2JqZWN0cyBhcmUgY2xvc2UgZW5vdWdoIHRvIHRvdWNoLlxyXG4gICAgICogQHBhcmFtIHBvc2l0aW9uIFBvc2l0aW9uIG9mIHRoZSBvYmplY3QgaW4gcXVlc3Rpb24uXHJcbiAgICAgKiBAcGFyYW0gb2JqZWN0Q29sbGlzaW9uUmFuZ2UgSGlnaGVzdCBwb3NzaWJsZSByYWRpdXMgb2YgdGhlIG9iamVjdCBpbiBxdWVzdGlvbi5cclxuICAgICAqIEByZXR1cm5zIFRydWUgaWYgdGhlIG9iamVjdHMgYXJlIGNsb3NlIGVub3VnaCB0byBwb3NzaWJseSBjb2xsaWRlLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgY2hlY2tDb2xsaXNpb25SYW5nZShwb3NpdGlvbjogVmVjdG9yLCBvYmplY3RDb2xsaXNpb25SYW5nZTogbnVtYmVyKTogYm9vbGVhbiB7XHJcbiAgICAgICAgLy9pZiBvYmplY3RzJyBjb2xsaXNpb24gYm91bmRzIGFyZSB0b28gY2xvc2VcclxuICAgICAgICByZXR1cm4gZmluZERpc3RhbmNlKHRoaXMucG9zaXRpb24sIHBvc2l0aW9uKSA8PSB0aGlzLmNvbGxpc2lvblJhbmdlICsgb2JqZWN0Q29sbGlzaW9uUmFuZ2U7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgY2hlY2tPYmplY3RJbnRlcnNlY3Rpb24ob2JqZWN0U2hhcGU6IFNoYXBlKTogYm9vbGVhbiB7XHJcbiAgICAgICAgLy9pZiBvYmplY3RzIGludGVyc2VjdCAobGluZSBpbnRlcnNlY3QgLT4gb3IgaWZQb2ludElzQmVoaW5kRWRnZSBtZXRob2QpXHJcblxyXG4gICAgICAgIC8qVGhpcyBtZXRob2QgY2hlY2tzIGFsbCBvZiB0aGlzIHNoYXBlJ3MgZWRnZXMgdG8gc2VlIGlmIGFueSBvZiB0aGUgb2JqZWN0J3MgcG9pbnRzIGZhbGwgYmVoaW5kIHRoYXQgZWRnZS5cclxuICAgICAgICBJZiBhbiBlZGdlIGV4aXN0cyB3aXRoIG5vIHBvaW50cyBiZWhpbmQgaXQsIHdlIGNhbiBhc3N1bWUgdGhlIHNoYXBlcyBkbyBub3QgY29sbGlkZS5cclxuICAgICAgICBPdGhlcndpc2UsIHdlIGtub3cgdGhhdCBzb21ld2hlcmUgdGhlIHNoYXBlcyBjb2xsaWRlLlxyXG4gICAgICAgIFRoaXMgbWV0aG9kIHdpbGwgbm90IHdvcmsgZm9yIGNvbmNhdmUgZG9vZGFkcy4qL1xyXG4gICAgICAgIGZvciAobGV0IGkxOiBudW1iZXIgPSAwOyBpMSA8IHRoaXMuZWRnZXMubGVuZ3RoOyBpMSsrKSB7XHJcbiAgICAgICAgICAgIGxldCBpZlBvaW50RXhpc3RzQmVoaW5kOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkyOiBudW1iZXIgPSAwOyBpMiA8IG9iamVjdFNoYXBlLnBvaW50cy5sZW5ndGg7IGkyKyspIHtcclxuICAgICAgICAgICAgICAgIGlmIChcclxuICAgICAgICAgICAgICAgICAgICBkb3RQcm9kdWN0KFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7IHg6IG9iamVjdFNoYXBlLnBvaW50c1tpMl0ueCAtIHRoaXMuZWRnZXNbaTFdLnAxLngsIHk6IG9iamVjdFNoYXBlLnBvaW50c1tpMl0ueSAtIHRoaXMuZWRnZXNbaTFdLnAxLnkgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lZGdlc1tpMV0ub3J0aG9nb25hbFZlY3RvcixcclxuICAgICAgICAgICAgICAgICAgICApIDw9IDBcclxuICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICAgICAgICBpZlBvaW50RXhpc3RzQmVoaW5kID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoIWlmUG9pbnRFeGlzdHNCZWhpbmQpIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcblxyXG4gICAgICAgIC8qZm9yIChsZXQgaTE6IG51bWJlciA9IDA7IGkxIDwgdGhpcy5lZGdlcy5sZW5ndGg7IGkxKyspIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaTI6IG51bWJlciA9IDA7IGkyIDwgb2JqZWN0U2hhcGUuZWRnZXMubGVuZ3RoOyBpMisrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaWZJbnRlcnNlY3QodGhpcy5lZGdlc1tpMV0ucDEsIHRoaXMuZWRnZXNbaTFdLnAyLCBvYmplY3RTaGFwZS5lZGdlc1tpMl0ucDEsIG9iamVjdFNoYXBlLmVkZ2VzW2kyXS5wMikpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7Ki9cclxuICAgIH1cclxuICAgIHB1YmxpYyByZWdpc3RlckNvbGxpc2lvbldpdGhNb3N0Q29ycmVjdFNvbHV0aW9uKFxyXG4gICAgICAgIGR5bmFtU2hhcGU6IFNoYXBlLFxyXG4gICAgICAgIHByZXZQb3NpdGlvbkRpZmZlcmVuY2U6IFZlY3RvcixcclxuICAgICAgICBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCxcclxuICAgICk6IHsgcG9zaXRpb25DaGFuZ2U6IFZlY3RvcjsgbW9tZW50dW1DaGFuZ2U6IFZlY3RvciB8IHVuZGVmaW5lZDsgYW5nbGU6IG51bWJlciB8IHVuZGVmaW5lZCB9IHwgdW5kZWZpbmVkIHtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBUaGlzIGFsZ29yaXRobSB0YWtlcyB0aGUgZHluYW1pYyBvYmplY3QncyBzaGFwZSBhbmQgdGhlIGRpZmZlcmVuY2UgYmV0d2VlbiBpdHMgY3VycmVudCBwb3NpdGlvbiBhbmQgaXRzIHBvc2l0aW9uIGxhc3QgZnJhbWUuXHJcbiAgICAgICAgICogV2UgYXNzdW1lIHRoZSBwb2ludCBkaWZmZXJlbmNlIGlzIHRoZSBcInByZXZpb3VzIG1vbWVudHVtLlwiXHJcbiAgICAgICAgICogV2UgY2hlY2sgaWYgYW55IG9mIHRoZSBkeW5hbU9iaidzIHBvaW50cyBjb2xsaWRlZCB3aXRoIHRoaXMgb2JqZWN0J3Mgc2hhcGUgZHVlIHRvIGl0J3MgcHJldmlvdXMgbW9tZW50dW0uXHJcbiAgICAgICAgICogSWYgc28sIHdlIGZpbmQgdGhlIGNsb3Nlc3QgaW50ZXJzZWN0aW9uIHBvaW50IHRvIHRoZSBkeW5hbU9iaidzIHByZXZpb3VzIHBvc2l0aW9uIGFuZCByZXR1cm4gaXQuXHJcbiAgICAgICAgICovXHJcblxyXG4gICAgICAgIGxldCBmdXJ0aGVzdEludGVyc2VjdGlvblBvaW50OiBWZWN0b3IgfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgbGV0IGZ1cnRoZXN0SW50ZXJzZWN0aW9uTGVuZ3RoOiBudW1iZXIgPSAwO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpOiBudW1iZXIgPSAwOyBpIDwgZHluYW1TaGFwZS5wb2ludHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgajogbnVtYmVyID0gMDsgaiA8IHRoaXMuZWRnZXMubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIGxldCBwb2ludE1vbWVudHVtTGluZVNlZ21lbnQ6IEVkZ2UgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcDE6IGR5bmFtU2hhcGUucG9pbnRzW2ldLFxyXG4gICAgICAgICAgICAgICAgICAgIHAyOiB7IHg6IGR5bmFtU2hhcGUucG9pbnRzW2ldLnggKyBwcmV2UG9zaXRpb25EaWZmZXJlbmNlLngsIHk6IGR5bmFtU2hhcGUucG9pbnRzW2ldLnkgKyBwcmV2UG9zaXRpb25EaWZmZXJlbmNlLnkgfSxcclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGludGVyc2VjdGlvblBvaW50OiB1bmRlZmluZWQgfCBWZWN0b3IgPSBmaW5kSW50ZXJzZWN0aW9uKHRoaXMuZWRnZXNbal0sIHBvaW50TW9tZW50dW1MaW5lU2VnbWVudCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGludGVyc2VjdGlvblBvaW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGludGVyc2VjdGlvbkRpc3RhbmNlRnJvbU9yaWdpbmFsUG9pbnQ6IG51bWJlciA9IGZpbmRMZW5ndGgoaW50ZXJzZWN0aW9uUG9pbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpbnRlcnNlY3Rpb25EaXN0YW5jZUZyb21PcmlnaW5hbFBvaW50ID4gZnVydGhlc3RJbnRlcnNlY3Rpb25MZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZnVydGhlc3RJbnRlcnNlY3Rpb25MZW5ndGggPSBpbnRlcnNlY3Rpb25EaXN0YW5jZUZyb21PcmlnaW5hbFBvaW50O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmdXJ0aGVzdEludGVyc2VjdGlvblBvaW50ID0gaW50ZXJzZWN0aW9uUG9pbnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZnVydGhlc3RJbnRlcnNlY3Rpb25Qb2ludCkge1xyXG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gXCJyZWRcIjtcclxuICAgICAgICAgICAgY3R4LmZpbGxSZWN0KGZ1cnRoZXN0SW50ZXJzZWN0aW9uUG9pbnQueCAtIDQsIGZ1cnRoZXN0SW50ZXJzZWN0aW9uUG9pbnQueSAtIDQsIDgsIDgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVnaXN0ZXJDb2xsaXNpb25XaXRoQ2xvc2VzdFNvbHV0aW9uKFxyXG4gICAgICAgIG9iamVjdFNoYXBlOiBTaGFwZSxcclxuICAgICAgICBtb21lbnR1bTogVmVjdG9yLFxyXG4gICAgKTogeyBwb3NpdGlvbkNoYW5nZTogVmVjdG9yOyBtb21lbnR1bUNoYW5nZTogVmVjdG9yIHwgdW5kZWZpbmVkOyBhbmdsZTogbnVtYmVyIHwgdW5kZWZpbmVkIH0ge1xyXG4gICAgICAgIGxldCBsb3dlc3RFZGdlOiBEb29kYWRFZGdlID0gdGhpcy5lZGdlc1swXTtcclxuICAgICAgICBsZXQgbG93ZXN0RGlzdGFuY2U6IG51bWJlciA9IDEwMDAwO1xyXG5cclxuICAgICAgICB0aGlzLmVkZ2VzLmZvckVhY2goKGRvb2RhZEVkZ2UpID0+IHtcclxuICAgICAgICAgICAgLy9mb3IgZWFjaCBzdGF0aWMgb2JqZWN0IGVkZ2UsXHJcbiAgICAgICAgICAgIGxldCBtaW5Qcm9qZWN0ZWREaXN0YW5jZTogbnVtYmVyID0gMDtcclxuXHJcbiAgICAgICAgICAgIG9iamVjdFNoYXBlLnBvaW50cy5mb3JFYWNoKChwb2ludCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IHBvaW50RGlmZmVyZW5jZTogVmVjdG9yID0gZmluZERpZmZlcmVuY2UoZG9vZGFkRWRnZS5wMSwgcG9pbnQpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHByb2plY3Rpb246IFZlY3RvciA9IHZlY3RvclByb2plY3QocG9pbnREaWZmZXJlbmNlLCBkb29kYWRFZGdlLm9ydGhvZ29uYWxWZWN0b3IpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vY2FsY3VsYXRlIHRoZSBkaXN0YW5jZSB0byBtb3ZlIHRoZSBvYmplY3QncyBwb2ludCB3aXRoIHRoZSBsb3dlc3QgcHJvamVjdGlvbiBvbnRvIHRoZSBvcnRob2dvbmFsIGxpbmVcclxuICAgICAgICAgICAgICAgIGlmIChwcm9qZWN0aW9uLnkgKiBkb29kYWRFZGdlLm9ydGhvZ29uYWxWZWN0b3IueSA8IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgZGlzdGFuY2U6IG51bWJlciA9IGZpbmRMZW5ndGgocHJvamVjdGlvbik7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRpc3RhbmNlID4gbWluUHJvamVjdGVkRGlzdGFuY2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWluUHJvamVjdGVkRGlzdGFuY2UgPSBkaXN0YW5jZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvL3NhdmUgdGhlIGVkZ2UgYW5kIHRoZSBiaWdnZXN0IGRpc3RhbmNlIG9mIHRoZSBwb2ludHNcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpZiAobWluUHJvamVjdGVkRGlzdGFuY2UgPCBsb3dlc3REaXN0YW5jZSkge1xyXG4gICAgICAgICAgICAgICAgLy9maW5kIHRoZSBlZGdlIHdpdGggdGhlIGxvd2VzdCBkaXN0YW5jZVxyXG4gICAgICAgICAgICAgICAgbG93ZXN0RGlzdGFuY2UgPSBtaW5Qcm9qZWN0ZWREaXN0YW5jZTtcclxuICAgICAgICAgICAgICAgIGxvd2VzdEVkZ2UgPSBkb29kYWRFZGdlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vZmluZCB0aGUgcG9zaXRpb25DaGFuZ2UgYmFzZWQgb24gdGhlIGRpc3RhbmNlICogb3J0aGFub3JtYWwgdmVjdG9yXHJcbiAgICAgICAgbGV0IHBvc2l0aW9uQ2hhbmdlOiBWZWN0b3IgPSB7XHJcbiAgICAgICAgICAgIHg6IGxvd2VzdEVkZ2Uub3J0aG9nb25hbFZlY3Rvci54ICogbG93ZXN0RGlzdGFuY2UsXHJcbiAgICAgICAgICAgIHk6IGxvd2VzdEVkZ2Uub3J0aG9nb25hbFZlY3Rvci55ICogbG93ZXN0RGlzdGFuY2UsXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy9maW5kIG1vbWVudHVtIGNoYW5nZSBvbmx5IGlmIHRoZSBjdXJyZW50IG1vbWVudHVtIGhhcyBhIG5lZ2F0aXZlIHByb2plY3Rpb24gb250byB0aGUgb3J0aGFub3JtYWwgdmVjdG9yXHJcbiAgICAgICAgbGV0IG1vbWVudHVtQ2hhbmdlOiBWZWN0b3IgPSB2ZWN0b3JQcm9qZWN0KG1vbWVudHVtLCBsb3dlc3RFZGdlLnNsb3BlKTtcclxuXHJcbiAgICAgICAgLy9yZXR1cm4gYW5nbGUgaWYgdGhlIGVkZ2UgaXMgYSBcInN0YW5kaW5nXCIgZWRnZVxyXG4gICAgICAgIGxldCBhbmdsZTogbnVtYmVyIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIGlmIChsb3dlc3RFZGdlLmlzR3JvdW5kKSB7XHJcbiAgICAgICAgICAgIGFuZ2xlID0gbG93ZXN0RWRnZS5hbmdsZTtcclxuICAgICAgICAgICAgLy9hbmQgbWFrZSB0aGUgcG9zaXRpb25jaGFuZ2UgdmVydGljYWxcclxuICAgICAgICAgICAgcG9zaXRpb25DaGFuZ2UgPSByb3RhdGVWZWN0b3IoLWxvd2VzdEVkZ2UuYW5nbGUsIHBvc2l0aW9uQ2hhbmdlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB7IHBvc2l0aW9uQ2hhbmdlLCBtb21lbnR1bUNoYW5nZSwgYW5nbGUgfTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBHYW1lIH0gZnJvbSBcIi4uLy4uLy4uL2NsaWVudC9nYW1lXCI7XHJcbmltcG9ydCB7IGRlZmF1bHRDb25maWcgfSBmcm9tIFwiLi4vLi4vLi4vY29uZmlnXCI7XHJcbmltcG9ydCB7IGZpbmRBbmdsZSB9IGZyb20gXCIuLi8uLi8uLi9maW5kQW5nbGVcIjtcclxuaW1wb3J0IHsgU2l6ZSB9IGZyb20gXCIuLi8uLi8uLi9zaXplXCI7XHJcbmltcG9ydCB7IHJvb3RLZWVwU2lnbiwgVmVjdG9yIH0gZnJvbSBcIi4uLy4uLy4uL3ZlY3RvclwiO1xyXG5pbXBvcnQgeyBkZWZhdWx0QWN0b3JDb25maWcgfSBmcm9tIFwiLi4vLi4vbmV3QWN0b3JzL2FjdG9yQ29uZmlnXCI7XHJcbmltcG9ydCB7IEZsb29yIH0gZnJvbSBcIi4vZmxvb3JcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBDbGllbnRGbG9vciBleHRlbmRzIEZsb29yIHtcclxuICAgIHByaXZhdGUgZ2FtZUhlaWdodDogbnVtYmVyID0gZGVmYXVsdENvbmZpZy55U2l6ZTtcclxuICAgIHByaXZhdGUgZ2FtZVdpZHRoOiBudW1iZXIgPSBkZWZhdWx0Q29uZmlnLnhTaXplO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHByb3RlY3RlZCBnYW1lOiBHYW1lLFxyXG4gICAgICAgIHBvaW50c0FuZEFuZ2xlczogeyBwb2ludDogbnVtYmVyOyBhbmdsZTogbnVtYmVyOyBzbG9wZTogbnVtYmVyIH1bXSxcclxuICAgICAgICBwb2ludENvdW50OiBudW1iZXIsXHJcbiAgICAgICAgcmVzdWx0V2lkdGg6IG51bWJlcixcclxuICAgICAgICBwdWJsaWMgY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsXHJcbiAgICApIHtcclxuICAgICAgICBzdXBlcihwb2ludENvdW50LCByZXN1bHRXaWR0aCwgcG9pbnRzQW5kQW5nbGVzKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVuZGVyKHNjcmVlblBvczogVmVjdG9yLCBzY3JlZW5TaXplOiBTaXplKSB7XHJcbiAgICAgICAgdGhpcy5jdHguZmlsbFN0eWxlID0gXCIjMWI0YTIwXCI7IC8vXCJ3aGl0ZVwiO1xyXG5cclxuICAgICAgICB0aGlzLmN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICB0aGlzLmN0eC5tb3ZlVG8oMCwgdGhpcy5wb2ludHNBbmRBbmdsZXNbMF0ucG9pbnQpO1xyXG4gICAgICAgIGZvciAobGV0IGk6IG51bWJlciA9IDE7IGkgPCB0aGlzLnBvaW50Q291bnQ7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLmN0eC5saW5lVG8oaSAqIHRoaXMucmVzdWx0V2lkdGgsIHRoaXMucG9pbnRzQW5kQW5nbGVzW2ldLnBvaW50KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yIChsZXQgaTogbnVtYmVyID0gdGhpcy5wb2ludENvdW50IC0gMTsgaSA+PSAwOyBpLS0pIHtcclxuICAgICAgICAgICAgdGhpcy5jdHgubGluZVRvKGkgKiB0aGlzLnJlc3VsdFdpZHRoLCB0aGlzLnBvaW50c0FuZEFuZ2xlc1tpXS5wb2ludCArIDE1KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5jdHguZmlsbCgpO1xyXG5cclxuICAgICAgICB0aGlzLmN0eC5maWxsU3R5bGUgPSBkZWZhdWx0QWN0b3JDb25maWcuZGlydENvbG9yTmlnaHQ7XHJcblxyXG4gICAgICAgIHRoaXMuY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIHRoaXMuY3R4Lm1vdmVUbygwLCB0aGlzLmdhbWVIZWlnaHQgKyAxMCk7XHJcbiAgICAgICAgZm9yIChsZXQgaTogbnVtYmVyID0gMDsgaSA8IHRoaXMucG9pbnRDb3VudDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY3R4LmxpbmVUbyhpICogdGhpcy5yZXN1bHRXaWR0aCwgdGhpcy5wb2ludHNBbmRBbmdsZXNbaV0ucG9pbnQgKyAxNCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuY3R4LmxpbmVUbygodGhpcy5wb2ludENvdW50IC0gMSkgKiB0aGlzLnJlc3VsdFdpZHRoLCB0aGlzLmdhbWVIZWlnaHQgKyAxMCk7XHJcbiAgICAgICAgdGhpcy5jdHguZmlsbCgpO1xyXG5cclxuICAgICAgICB0aGlzLmN0eC5maWxsUmVjdChcclxuICAgICAgICAgICAgTWF0aC5tYXgoc2NyZWVuUG9zLngsIDApLFxyXG4gICAgICAgICAgICB0aGlzLmdhbWVIZWlnaHQgKyA1LFxyXG4gICAgICAgICAgICBNYXRoLm1pbihzY3JlZW5TaXplLndpZHRoLCB0aGlzLmdhbWVXaWR0aCAtIHNjcmVlblBvcy54KSxcclxuICAgICAgICAgICAgc2NyZWVuU2l6ZS5oZWlnaHQgKyBzY3JlZW5Qb3MueSxcclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcbiIsImV4cG9ydCBhYnN0cmFjdCBjbGFzcyBGbG9vciB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgcG9pbnRDb3VudDogbnVtYmVyLCBwcm90ZWN0ZWQgcmVzdWx0V2lkdGg6IG51bWJlciwgcHJvdGVjdGVkIHBvaW50c0FuZEFuZ2xlczogeyBwb2ludDogbnVtYmVyOyBhbmdsZTogbnVtYmVyOyBzbG9wZTogbnVtYmVyIH1bXSkge31cclxuXHJcbiAgICBwdWJsaWMgZ2V0WUNvb3JkQW5kQW5nbGUoeFBvczogbnVtYmVyKTogeyB5Q29vcmQ6IG51bWJlcjsgYW5nbGU6IG51bWJlciB9IHtcclxuICAgICAgICBsZXQgaTogbnVtYmVyID0gTWF0aC5mbG9vcih4UG9zIC8gdGhpcy5yZXN1bHRXaWR0aCk7XHJcbiAgICAgICAgaWYgKGkgPCAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7IHlDb29yZDogdGhpcy5wb2ludHNBbmRBbmdsZXNbMF0ucG9pbnQsIGFuZ2xlOiB0aGlzLnBvaW50c0FuZEFuZ2xlc1swXS5hbmdsZSB9O1xyXG4gICAgICAgIH0gZWxzZSBpZiAoaSA+PSB0aGlzLnBvaW50Q291bnQgLSAxKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICB5Q29vcmQ6IHRoaXMucG9pbnRzQW5kQW5nbGVzW3RoaXMucG9pbnRDb3VudCAtIDFdLnBvaW50LFxyXG4gICAgICAgICAgICAgICAgYW5nbGU6IHRoaXMucG9pbnRzQW5kQW5nbGVzW3RoaXMucG9pbnRDb3VudCAtIDFdLmFuZ2xlLFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxldCBwZXJjZW50YWdlOiBudW1iZXIgPSB4UG9zIC8gdGhpcy5yZXN1bHRXaWR0aCAtIGk7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICB5Q29vcmQ6IHRoaXMucG9pbnRzQW5kQW5nbGVzW2ldLnBvaW50ICsgdGhpcy5wb2ludHNBbmRBbmdsZXNbaV0uc2xvcGUgKiBwZXJjZW50YWdlLFxyXG4gICAgICAgICAgICAgICAgYW5nbGU6IHRoaXMucG9pbnRzQW5kQW5nbGVzW2ldLmFuZ2xlLFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBWZWN0b3IgfSBmcm9tIFwiLi92ZWN0b3JcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBSYW5kb20ge1xyXG4gICAgcHVibGljIHN0YXRpYyBuZXh0RG91YmxlKCkge1xyXG4gICAgICAgIHJldHVybiBNYXRoLnJhbmRvbSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgcmFuZ2UobWluOiBudW1iZXIsIG1heDogbnVtYmVyKTogbnVtYmVyIHtcclxuICAgICAgICBsZXQgcmFuZ2UgPSBtYXggLSBtaW47XHJcbiAgICAgICAgcmV0dXJuIE1hdGgucmFuZG9tKCkgKiByYW5nZSArIG1pbjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIHJhbmdlRmxvb3IobWluOiBudW1iZXIsIG1heDogbnVtYmVyKTogbnVtYmVyIHtcclxuICAgICAgICBsZXQgcmFuZ2UgPSBtYXggLSBtaW47XHJcbiAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHJhbmdlICsgbWluKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIG5leHRDaXJjbGVWZWN0b3IoKTogVmVjdG9yIHtcclxuICAgICAgICBsZXQgYW5nbGUgPSBNYXRoLnJhbmRvbSgpICogMiAqIE1hdGguUEk7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgeDogTWF0aC5jb3MoYW5nbGUpLFxyXG4gICAgICAgICAgICB5OiBNYXRoLnNpbihhbmdsZSksXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyB1c2VQcmV2aW91cyA9IGZhbHNlO1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgeTIgPSAwO1xyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgbmV4dEdhdXNzaWFuKG1lYW46IG51bWJlciwgc3RkRGV2OiBudW1iZXIpIHtcclxuICAgICAgICBsZXQgeDEgPSAwO1xyXG4gICAgICAgIGxldCB4MiA9IDA7XHJcbiAgICAgICAgbGV0IHkxID0gMDtcclxuICAgICAgICBsZXQgeiA9IDA7XHJcblxyXG4gICAgICAgIGlmIChSYW5kb20udXNlUHJldmlvdXMpIHtcclxuICAgICAgICAgICAgUmFuZG9tLnVzZVByZXZpb3VzID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHJldHVybiBtZWFuICsgUmFuZG9tLnkyICogc3RkRGV2O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZG8ge1xyXG4gICAgICAgICAgICB4MSA9IDIgKiBNYXRoLnJhbmRvbSgpIC0gMTtcclxuICAgICAgICAgICAgeDIgPSAyICogTWF0aC5yYW5kb20oKSAtIDE7XHJcbiAgICAgICAgICAgIHogPSB4MSAqIHgxICsgeDIgKiB4MjtcclxuICAgICAgICB9IHdoaWxlICh6ID49IDEpO1xyXG5cclxuICAgICAgICB6ID0gTWF0aC5zcXJ0KCgtMiAqIE1hdGgubG9nKHopKSAvIHopO1xyXG4gICAgICAgIHkxID0geDEgKiB6O1xyXG4gICAgICAgIFJhbmRvbS55MiA9IHgyICogejtcclxuXHJcbiAgICAgICAgcmV0dXJuIG1lYW4gKyB5MSAqIHN0ZERldjtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBmaW5kQW5nbGUgfSBmcm9tIFwiLi9maW5kQW5nbGVcIjtcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgVmVjdG9yIHtcclxuICAgIHg6IG51bWJlcjtcclxuICAgIHk6IG51bWJlcjtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBFZGdlIHtcclxuICAgIHAxOiBWZWN0b3I7XHJcbiAgICBwMjogVmVjdG9yO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIERvb2RhZEVkZ2Uge1xyXG4gICAgcDE6IFZlY3RvcjtcclxuICAgIHAyOiBWZWN0b3I7XHJcbiAgICBhbmdsZTogbnVtYmVyO1xyXG4gICAgc2xvcGU6IFZlY3RvcjtcclxuICAgIGlzR3JvdW5kOiBib29sZWFuO1xyXG4gICAgb3J0aG9nb25hbFZlY3RvcjogVmVjdG9yO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFNoYXBlIHtcclxuICAgIGNlbnRlcjogVmVjdG9yO1xyXG4gICAgcG9pbnRzOiBWZWN0b3JbXTtcclxuICAgIGVkZ2VzOiBFZGdlW107XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBmaW5kVmVjdG9yRnJvbUFuZ2xlKGFuZ2xlOiBudW1iZXIsIG1hZ25pdHVkZTogbnVtYmVyID0gMSk6IFZlY3RvciB7XHJcbiAgICByZXR1cm4geyB4OiBNYXRoLmNvcyhhbmdsZSkgKiBtYWduaXR1ZGUsIHk6IE1hdGguc2luKGFuZ2xlKSAqIG1hZ25pdHVkZSB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZmluZERpc3RhbmNlKGE6IFZlY3RvciwgYjogVmVjdG9yKTogbnVtYmVyIHtcclxuICAgIHJldHVybiBNYXRoLnNxcnQoTWF0aC5wb3coYS54IC0gYi54LCAyKSArIE1hdGgucG93KGEueSAtIGIueSwgMikpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZmluZERpZmZlcmVuY2UoYTogVmVjdG9yLCBiOiBWZWN0b3IpOiBWZWN0b3Ige1xyXG4gICAgcmV0dXJuIHsgeDogYi54IC0gYS54LCB5OiBiLnkgLSBhLnkgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGZpbmRMZW5ndGgodmVjdG9yOiBWZWN0b3IpOiBudW1iZXIge1xyXG4gICAgcmV0dXJuIE1hdGguc3FydChNYXRoLnBvdyh2ZWN0b3IueCwgMikgKyBNYXRoLnBvdyh2ZWN0b3IueSwgMikpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcm90YXRlVmVjdG9yKGFuZ2xlOiBudW1iZXIsIHZlY3RvcjogVmVjdG9yKTogVmVjdG9yIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgeDogdmVjdG9yLnggKiBNYXRoLmNvcyhhbmdsZSkgLSB2ZWN0b3IueSAqIE1hdGguc2luKGFuZ2xlKSxcclxuICAgICAgICB5OiB2ZWN0b3IueCAqIE1hdGguc2luKGFuZ2xlKSArIHZlY3Rvci55ICogTWF0aC5jb3MoYW5nbGUpLFxyXG4gICAgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGZpbmRNaXJyb3JlZEFuZ2xlKGFuZ2xlOiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgaWYgKGFuZ2xlIDwgTWF0aC5QSSAvIC0yKSB7XHJcbiAgICAgICAgcmV0dXJuIC1NYXRoLlBJIC0gYW5nbGU7XHJcbiAgICB9IGVsc2UgaWYgKGFuZ2xlID4gTWF0aC5QSSAvIDIpIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5QSSAtIGFuZ2xlO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gYW5nbGU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByb3RhdGVTaGFwZShzaGFwZTogVmVjdG9yW10sIGFuZ2xlOiBudW1iZXIsIHBvc2l0aW9uT2Zmc2V0OiBWZWN0b3IsIGZsaXBPdmVyWTogYm9vbGVhbiA9IGZhbHNlKTogVmVjdG9yW10ge1xyXG4gICAgbGV0IG5ld1ZlY3RvckFycmF5OiBWZWN0b3JbXSA9IFtdO1xyXG5cclxuICAgIGZvciAodmFyIGk6IG51bWJlciA9IDA7IGkgPCBzaGFwZS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIG5ld1ZlY3RvckFycmF5LnB1c2goeyB4OiBzaGFwZVtpXS54ICsgMCwgeTogc2hhcGVbaV0ueSArIDAgfSk7XHJcblxyXG4gICAgICAgIGxldCB0YW46IG51bWJlciA9IGZpbmRBbmdsZSh7IHg6IDAsIHk6IDAgfSwgeyB4OiBuZXdWZWN0b3JBcnJheVtpXS54LCB5OiBuZXdWZWN0b3JBcnJheVtpXS55IH0pO1xyXG4gICAgICAgIGxldCBtYWc6IG51bWJlciA9IGZpbmRMZW5ndGgobmV3VmVjdG9yQXJyYXlbaV0pO1xyXG4gICAgICAgIG5ld1ZlY3RvckFycmF5W2ldLnggPSBtYWcgKiBNYXRoLmNvcyh0YW4gKyBhbmdsZSk7XHJcbiAgICAgICAgbmV3VmVjdG9yQXJyYXlbaV0ueSA9IG1hZyAqIE1hdGguc2luKHRhbiArIGFuZ2xlKSArIHBvc2l0aW9uT2Zmc2V0Lnk7XHJcblxyXG4gICAgICAgIGlmIChmbGlwT3ZlclkpIHtcclxuICAgICAgICAgICAgLy8gZmxpcCBpdCBhcm91bmQgaWYgdGhleSdyZSBmYWNpbmcgbGVmdFxyXG4gICAgICAgICAgICBuZXdWZWN0b3JBcnJheVtpXS54ICo9IC0xO1xyXG4gICAgICAgIH1cclxuICAgICAgICBuZXdWZWN0b3JBcnJheVtpXS54ICs9IHBvc2l0aW9uT2Zmc2V0Lng7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbmV3VmVjdG9yQXJyYXk7XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIGRvdFByb2R1Y3QodjE6IFZlY3RvciwgdjI6IFZlY3Rvcik6IG51bWJlciB7XHJcbiAgICByZXR1cm4gdjEueCAqIHYyLnggKyB2MS55ICogdjIueTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHZlY3RvclByb2plY3QodjE6IFZlY3RvciwgdjI6IFZlY3Rvcik6IFZlY3RvciB7XHJcbiAgICB2YXIgbm9ybTogbnVtYmVyID0gZmluZERpc3RhbmNlKHsgeDogMCwgeTogMCB9LCB2Mik7XHJcbiAgICB2YXIgc2NhbGFyOiBudW1iZXIgPSBkb3RQcm9kdWN0KHYxLCB2MikgLyBNYXRoLnBvdyhub3JtLCAyKTtcclxuICAgIHJldHVybiB7IHg6IHYyLnggKiBzY2FsYXIsIHk6IHYyLnkgKiBzY2FsYXIgfTtcclxufVxyXG5mdW5jdGlvbiBkaXN0Mih2OiBWZWN0b3IsIHc6IFZlY3Rvcik6IG51bWJlciB7XHJcbiAgICByZXR1cm4gTWF0aC5wb3codi54IC0gdy54LCAyKSArIE1hdGgucG93KHYueSAtIHcueSwgMik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBmaW5kTWluRGlzdGFuY2VQb2ludFRvRWRnZShwb2ludDogVmVjdG9yLCBlZGdlOiBFZGdlKTogVmVjdG9yIHtcclxuICAgIHZhciBsMiA9IGRpc3QyKGVkZ2UucDEsIGVkZ2UucDIpO1xyXG4gICAgaWYgKGwyID09PSAwKSByZXR1cm4geyB4OiBlZGdlLnAxLnggLSBwb2ludC54LCB5OiBlZGdlLnAxLnkgLSBwb2ludC55IH07XHJcbiAgICB2YXIgdCA9ICgocG9pbnQueCAtIGVkZ2UucDEueCkgKiAoZWRnZS5wMi54IC0gZWRnZS5wMS54KSArIChwb2ludC55IC0gZWRnZS5wMS55KSAqIChlZGdlLnAyLnkgLSBlZGdlLnAxLnkpKSAvIGwyO1xyXG4gICAgdCA9IE1hdGgubWF4KDAsIE1hdGgubWluKDEsIHQpKTtcclxuICAgIGxldCBjbG9zZXN0UG9pbnQ6IFZlY3RvciA9IHsgeDogZWRnZS5wMS54ICsgdCAqIChlZGdlLnAyLnggLSBlZGdlLnAxLngpLCB5OiBlZGdlLnAxLnkgKyB0ICogKGVkZ2UucDIueSAtIGVkZ2UucDEueSkgfTtcclxuICAgIHJldHVybiB7IHg6IGNsb3Nlc3RQb2ludC54IC0gcG9pbnQueCwgeTogY2xvc2VzdFBvaW50LnkgLSBwb2ludC55IH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByb290S2VlcFNpZ24obnVtYmVyOiBudW1iZXIsIHJvb3Q6IG51bWJlcik6IG51bWJlciB7XHJcbiAgICBpZiAobnVtYmVyID49IDApIHJldHVybiBNYXRoLnBvdyhudW1iZXIsIDEgLyByb290KTtcclxuICAgIGVsc2UgcmV0dXJuIE1hdGgucG93KE1hdGguYWJzKG51bWJlciksIDEgLyByb290KSAqIC0xO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZmluZE9ydGhvbm9ybWFsVmVjdG9yKHZlY3RvcjE6IFZlY3RvciwgdmVjdG9yMjogVmVjdG9yKTogVmVjdG9yIHtcclxuICAgIGxldCBtYWduaXR1ZGU6IG51bWJlciA9IGZpbmREaXN0YW5jZSh2ZWN0b3IxLCB2ZWN0b3IyKTtcclxuICAgIHJldHVybiB7IHg6ICh2ZWN0b3IyLnkgLSB2ZWN0b3IxLnkpIC8gbWFnbml0dWRlLCB5OiAodmVjdG9yMS54IC0gdmVjdG9yMi54KSAvIG1hZ25pdHVkZSB9O1xyXG59XHJcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdGlmKF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0pIHtcblx0XHRyZXR1cm4gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGVcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG5fX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvY2xpZW50L2luZGV4LnRzXCIpO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==