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
var assetmanager_1 = __webpack_require__(/*! ./gameRender/assetmanager */ "./src/client/gameRender/assetmanager.ts");
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
                return [4 /*yield*/, assetmanager_1.assetManager.loadAllNecessaryImages()];
            case 1:
                _b.sent();
                serverTalker = new servertalker_1.ServerTalker({
                    name: name,
                    color: util_1.safeGetElementById("color").value,
                    team: team,
                    "class": classType,
                    classLevel: level,
                    classSpec: spec,
                });
                return [4 /*yield*/, serverTalker.serverTalkerReady];
            case 2:
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvY2xpZW50L2dhbWUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NsaWVudC9nYW1lUmVuZGVyL2Fzc2V0bWFuYWdlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY2xpZW50L2dhbWVSZW5kZXIvZ2FtZVJlbmRlcmVyLnRzIiwid2VicGFjazovLy8uL3NyYy9jbGllbnQvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NsaWVudC9tYWluTWVudS9jb21tZW50cy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY2xpZW50L21haW5NZW51L3NldHRpbmdzLnRzIiwid2VicGFjazovLy8uL3NyYy9jbGllbnQvbWVzc2FnZUhhbmRsZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NsaWVudC9wYXJ0aWNsZXMvcGFydGljbGVDbGFzc2VzL2R1bW15U2xhc2hFZmZlY3QyLnRzIiwid2VicGFjazovLy8uL3NyYy9jbGllbnQvcGFydGljbGVzL3BhcnRpY2xlQ2xhc3Nlcy9kdW1teVdoaXJsd2luZEVmZmVjdC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY2xpZW50L3BhcnRpY2xlcy9wYXJ0aWNsZUNsYXNzZXMvbHVuZ2VFZmZlY3QudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NsaWVudC9wYXJ0aWNsZXMvcGFydGljbGVDbGFzc2VzL3BhcnRpY2xlQmFzZUNsYXNzLnRzIiwid2VicGFjazovLy8uL3NyYy9jbGllbnQvcGFydGljbGVzL3BhcnRpY2xlQ2xhc3Nlcy9zcGFyay50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY2xpZW50L3BhcnRpY2xlcy9wYXJ0aWNsZUdyb3Vwcy9wYXJ0aWNsZUdyb3VwLnRzIiwid2VicGFjazovLy8uL3NyYy9jbGllbnQvcGFydGljbGVzL3BhcnRpY2xlR3JvdXBzL3NwYXJrcy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY2xpZW50L3BhcnRpY2xlcy9wYXJ0aWNsZVN5c3RlbS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY2xpZW50L3NlcnZlcnRhbGtlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY2xpZW50L3V0aWwudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbmZpZy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZmluZEFuZ2xlLnRzIiwid2VicGFjazovLy8uL3NyYy9pZkluc2lkZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvaWZJbnRlcnNlY3QudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2xpbmtlZExpc3QudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL29iamVjdHMvY2xpZW50Q29udHJvbGxlcnMvY29udHJvbGxlcnMvYWJpbGl0aWVzL2RhZ2dlcnNBYmlsaXRpZXMvZGFnZ2Vyc0x1bmdlQWJpbGl0eS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvb2JqZWN0cy9jbGllbnRDb250cm9sbGVycy9jb250cm9sbGVycy9hYmlsaXRpZXMvZGFnZ2Vyc0FiaWxpdGllcy9kYWdnZXJzU3RhYkFiaWxpdHkudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL29iamVjdHMvY2xpZW50Q29udHJvbGxlcnMvY29udHJvbGxlcnMvYWJpbGl0aWVzL2VtcHR5QWJpbGl0eS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvb2JqZWN0cy9jbGllbnRDb250cm9sbGVycy9jb250cm9sbGVycy9hYmlsaXRpZXMvaGFtbWVyQWJpbGl0aWVzL2hhbW1lclBvdW5kQWJpbGl0eS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvb2JqZWN0cy9jbGllbnRDb250cm9sbGVycy9jb250cm9sbGVycy9hYmlsaXRpZXMvaGFtbWVyQWJpbGl0aWVzL2hhbW1lclN3aW5nQWJpbGl0eS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvb2JqZWN0cy9jbGllbnRDb250cm9sbGVycy9jb250cm9sbGVycy9hYmlsaXRpZXMvcGxheWVyQWJpbGl0eS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvb2JqZWN0cy9jbGllbnRDb250cm9sbGVycy9jb250cm9sbGVycy9hYmlsaXRpZXMvcGxheWVySG9sZEFiaWxpdHkudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL29iamVjdHMvY2xpZW50Q29udHJvbGxlcnMvY29udHJvbGxlcnMvYWJpbGl0aWVzL3BsYXllclByZXNzQWJpbGl0eS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvb2JqZWN0cy9jbGllbnRDb250cm9sbGVycy9jb250cm9sbGVycy9hYmlsaXRpZXMvc3dvcmRBYmlsaXRpZXMvc3dvcmRTbGFzaEFiaWxpdHkudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL29iamVjdHMvY2xpZW50Q29udHJvbGxlcnMvY29udHJvbGxlcnMvYWJpbGl0aWVzL3N3b3JkQWJpbGl0aWVzL3N3b3JkV2hpcmx3aW5kQWJpbGl0eS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvb2JqZWN0cy9jbGllbnRDb250cm9sbGVycy9jb250cm9sbGVycy9jb250cm9sbGVyLnRzIiwid2VicGFjazovLy8uL3NyYy9vYmplY3RzL2NsaWVudENvbnRyb2xsZXJzL2NvbnRyb2xsZXJzL2RhZ2dlcnNDb250cm9sbGVyLnRzIiwid2VicGFjazovLy8uL3NyYy9vYmplY3RzL2NsaWVudENvbnRyb2xsZXJzL2NvbnRyb2xsZXJzL2hhbW1lckNvbnRyb2xsZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL29iamVjdHMvY2xpZW50Q29udHJvbGxlcnMvY29udHJvbGxlcnMvc3dvcmRDb250cm9sbGVyLnRzIiwid2VicGFjazovLy8uL3NyYy9vYmplY3RzL2NsaWVudENvbnRyb2xsZXJzL2lucHV0UmVhZGVyLnRzIiwid2VicGFjazovLy8uL3NyYy9vYmplY3RzL2NsaWVudENvbnRyb2xsZXJzL3VzZXJJbnRlcmZhY2UudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL29iamVjdHMvbmV3QWN0b3JzL2FjdG9yLnRzIiwid2VicGFjazovLy8uL3NyYy9vYmplY3RzL25ld0FjdG9ycy9hY3RvckNvbmZpZy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvb2JqZWN0cy9uZXdBY3RvcnMvYWN0b3JPYmplY3RzL2FjdG9yT2JqZWN0LnRzIiwid2VicGFjazovLy8uL3NyYy9vYmplY3RzL25ld0FjdG9ycy9hY3Rvck9iamVjdHMvcGxheWVyT2JqZWN0LnRzIiwid2VicGFjazovLy8uL3NyYy9vYmplY3RzL25ld0FjdG9ycy9hY3Rvck9iamVjdHMvdHJhbnNsYXRpb25zLnRzIiwid2VicGFjazovLy8uL3NyYy9vYmplY3RzL25ld0FjdG9ycy9jbGllbnRBY3RvcnMvY2xpZW50QWN0b3IudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL29iamVjdHMvbmV3QWN0b3JzL2NsaWVudEFjdG9ycy9jbGllbnRQbGF5ZXIvY2xpZW50Q2xhc3Nlcy9jbGllbnREYWdnZXJzLnRzIiwid2VicGFjazovLy8uL3NyYy9vYmplY3RzL25ld0FjdG9ycy9jbGllbnRBY3RvcnMvY2xpZW50UGxheWVyL2NsaWVudENsYXNzZXMvY2xpZW50SGFtbWVyLnRzIiwid2VicGFjazovLy8uL3NyYy9vYmplY3RzL25ld0FjdG9ycy9jbGllbnRBY3RvcnMvY2xpZW50UGxheWVyL2NsaWVudENsYXNzZXMvY2xpZW50U3dvcmQudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL29iamVjdHMvbmV3QWN0b3JzL2NsaWVudEFjdG9ycy9jbGllbnRQbGF5ZXIvY2xpZW50UGxheWVyLnRzIiwid2VicGFjazovLy8uL3NyYy9vYmplY3RzL25ld0FjdG9ycy9jbGllbnRBY3RvcnMvbW9kZWwvaGVhbHRoQmFyLnRzIiwid2VicGFjazovLy8uL3NyYy9vYmplY3RzL25ld0FjdG9ycy9jbGllbnRBY3RvcnMvbW9kZWwvam9pbnQudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL29iamVjdHMvbmV3QWN0b3JzL2NsaWVudEFjdG9ycy9tb2RlbC9tb2RlbC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvb2JqZWN0cy9uZXdBY3RvcnMvY2xpZW50QWN0b3JzL21vZGVsL3BsYXllck1vZGVscy9kYWdnZXJzUGxheWVyTW9kZWwudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL29iamVjdHMvbmV3QWN0b3JzL2NsaWVudEFjdG9ycy9tb2RlbC9wbGF5ZXJNb2RlbHMvaGFtbWVyUGxheWVyTW9kZWwudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL29iamVjdHMvbmV3QWN0b3JzL2NsaWVudEFjdG9ycy9tb2RlbC9wbGF5ZXJNb2RlbHMvcGxheWVyTW9kZWwudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL29iamVjdHMvbmV3QWN0b3JzL2NsaWVudEFjdG9ycy9tb2RlbC9wbGF5ZXJNb2RlbHMvc3dvcmRQbGF5ZXJNb2RlbC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvb2JqZWN0cy90ZXJyYWluL2Rvb2RhZHMvY2xpZW50RG9vZGFkLnRzIiwid2VicGFjazovLy8uL3NyYy9vYmplY3RzL3RlcnJhaW4vZG9vZGFkcy9kb29kYWQudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL29iamVjdHMvdGVycmFpbi9mbG9vci9jbGllbnRGbG9vci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvb2JqZWN0cy90ZXJyYWluL2Zsb29yL2Zsb29yLnRzIiwid2VicGFjazovLy8uL3NyYy9yYW5kb20udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3ZlY3Rvci50cyIsIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svc3RhcnR1cCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFLQSx1RUFBNEM7QUFDNUMscUhBQXlEO0FBRXpELHFHQUE0RDtBQUU1RCwwTUFBdUc7QUFDdkcsa0lBQW1FO0FBRW5FLDBJQUF1RTtBQUV2RSx5SUFBdUU7QUFFdkUsNk1BQXlHO0FBQ3pHLGdOQUEyRztBQU8zRyx5SEFBNEQ7QUFHNUQ7SUFvQ0ksY0FDSSxJQUFhLEVBQ00sTUFBYyxFQUNkLEVBQVUsRUFDYixZQUEwQixFQUMxQyxjQUFzQjtRQUwxQixpQkFxQ0M7UUFuQ3NCLFdBQU0sR0FBTixNQUFNLENBQVE7UUFDZCxPQUFFLEdBQUYsRUFBRSxDQUFRO1FBQ2IsaUJBQVksR0FBWixZQUFZLENBQWM7UUFoQzNCLHVCQUFrQixHQUF1QjtZQUN4RCxNQUFNLEVBQUUsRUFBRTtZQUNWLE9BQU8sRUFBRSxFQUFF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QUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRS9CLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBRXpDLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzlCLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBRXBDLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUNsQyxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRS9CLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBRXhDLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzlCLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBRW5DLElBQUksSUFBSSxDQUFDLEtBQUs7WUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDOztZQUMxRCxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDckQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFFTSwyQ0FBWSxHQUFuQjtRQUNJLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO0lBQ3ZCLENBQUM7SUFDTCwyQkFBQztBQUFELENBQUMsQ0EvRHlDLGdDQUFZLEdBK0RyRDtBQS9EWSxvREFBb0I7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0xqQyw2RUFBZ0U7QUFDaEUsd0lBQW1EO0FBRW5ELElBQU0sVUFBVSxHQUFXLENBQUMsQ0FBQztBQUM3QixJQUFNLFVBQVUsR0FBVyxFQUFFLENBQUM7QUFFOUI7SUFBaUMsK0JBQVk7SUFHekMscUJBQVksR0FBNkIsRUFBRSxRQUFnQixFQUFxQixLQUFhO1FBQTdGLFlBQ0ksa0JBQU0sR0FBRyxFQUFFLFFBQVEsRUFBRSxHQUFHLENBQUMsU0FFNUI7UUFIK0UsV0FBSyxHQUFMLEtBQUssQ0FBUTtRQUV6RixLQUFJLENBQUMsYUFBYSxHQUFHLEVBQUUsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDOztJQUNsRSxDQUFDO0lBRU0scUNBQWUsR0FBdEIsVUFBdUIsV0FBbUI7UUFDdEMsaUJBQU0sZUFBZSxZQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ25DLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxVQUFVLENBQUM7UUFDaEcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLFVBQVUsQ0FBQztJQUNwRyxDQUFDO0lBRUQsNEJBQU0sR0FBTjtRQUNJLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFXLEdBQUcsR0FBRyxDQUFDO1FBQzlDLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7UUFFaEMsSUFBSSxNQUFNLEdBQVcsOEJBQXFCLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDOUUsSUFBSSxHQUFHLEdBQVcsRUFBRSxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsR0FBRyxVQUFVLEVBQUUsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLEdBQUcsVUFBVSxFQUFFLENBQUM7UUFDekUsSUFBSSxHQUFHLEdBQVcsRUFBRSxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBRTNFLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDckIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM1RCxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNsRSxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FB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QUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsV0FBVyxDQUFDO0lBQ3ZJLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsV0FBVyxDQUFDO0lBRXZJLHlDQUF5QztJQUN6QyxJQUFJLEVBQUUsR0FBRyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLEVBQUU7UUFDdEMsT0FBTyxTQUFTLENBQUM7S0FDcEI7SUFFRCxtRUFBbUU7SUFDbkUsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNwRCxJQUFJLENBQUMsR0FBRyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRXBELE9BQU8sRUFBRSxDQUFDLEtBQUUsQ0FBQyxLQUFFLENBQUM7QUFDcEIsQ0FBQztBQTFCRCw0Q0EwQkM7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QUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7U0FDbEQ7YUFBTSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQzNELElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO1lBQ25ELElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7U0FDbEQ7SUFDTCxDQUFDO0lBRVMsNkNBQXVCLEdBQWpDO1FBQ0ksSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQzVDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDM0MsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztTQUNsRDthQUFNLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDNUQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7WUFDcEQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFD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LEVBQUUsQ0FBQyxDQUFDLEdBQUcsTUFBTSxFQUFFLENBQUM7QUFDbEQsQ0FBQztBQUpELHNDQUlDO0FBQ0QsU0FBUyxLQUFLLENBQUMsQ0FBUyxFQUFFLENBQVM7SUFDL0IsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUMzRCxDQUFDO0FBRUQsU0FBZ0IsMEJBQTBCLENBQUMsS0FBYSxFQUFFLElBQVU7SUFDaEUsSUFBSSxFQUFFLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ2pDLElBQUksRUFBRSxLQUFLLENBQUM7UUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQztJQUN4RSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7SUFDakgsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDaEMsSUFBSSxZQUFZLEdBQVcsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0lBQ3RILE9BQU8sRUFBRSxDQUFDLEVBQUUsWUFBWSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxZQUFZLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQztBQUN4RSxDQUFDO0FBUEQsZ0VBT0M7QUFFRCxTQUFnQixZQUFZLENBQUMsTUFBYyxFQUFFLElBQVk7SUFDckQsSUFBSSxNQUFNLElBQUksQ0FBQztRQUFFLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDOztRQUM5QyxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDMUQsQ0FBQztBQUhELG9DQUdDO0FBRUQsU0FBZ0IscUJBQXFCLENBQUMsT0FBZSxFQUFFLE9BQWU7SUFDbEUsSUFBSSxTQUFTLEdBQVcsWUFBWSxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztJQUN2RCxPQUFPLEVBQUUsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsU0FBUyxFQUFFLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLFNBQVMsRUFBRSxDQUFDO0FBQzlGLENBQUM7QUFIRCxzREFHQzs7Ozs7OztVQzdHRDtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7O1VDckJBO1VBQ0E7VUFDQTtVQUNBIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFsbEluZm8gfSBmcm9tIFwiLi4vYXBpL2FsbGluZm9cIjtcclxuaW1wb3J0IHsgU2VydmVyTWVzc2FnZSB9IGZyb20gXCIuLi9hcGkvbWVzc2FnZVwiO1xyXG5pbXBvcnQgeyBDb25maWcgfSBmcm9tIFwiLi4vY29uZmlnXCI7XHJcbmltcG9ydCB7IFNoYXBlLCBWZWN0b3IgfSBmcm9tIFwiLi4vdmVjdG9yXCI7XHJcbmltcG9ydCB7IFNlcnZlclRhbGtlciB9IGZyb20gXCIuL3NlcnZlcnRhbGtlclwiO1xyXG5pbXBvcnQgeyBzYWZlR2V0RWxlbWVudEJ5SWQgfSBmcm9tIFwiLi91dGlsXCI7XHJcbmltcG9ydCB7IEdhbWVSZW5kZXJlciB9IGZyb20gXCIuL2dhbWVSZW5kZXIvZ2FtZVJlbmRlcmVyXCI7XHJcbmltcG9ydCB7IGZpbmRBbmdsZSwgcm90YXRlU2hhcGUgfSBmcm9tIFwiLi4vZmluZEFuZ2xlXCI7XHJcbmltcG9ydCB7IGhhbmRsZU1lc3NhZ2UsIGZpbmRBY3RvciB9IGZyb20gXCIuL21lc3NhZ2VIYW5kbGVyXCI7XHJcbmltcG9ydCB7IENsaWVudFBsYXllciB9IGZyb20gXCIuLi9vYmplY3RzL25ld0FjdG9ycy9jbGllbnRBY3RvcnMvY2xpZW50UGxheWVyL2NsaWVudFBsYXllclwiO1xyXG5pbXBvcnQgeyBDbGllbnRTd29yZCB9IGZyb20gXCIuLi9vYmplY3RzL25ld0FjdG9ycy9jbGllbnRBY3RvcnMvY2xpZW50UGxheWVyL2NsaWVudENsYXNzZXMvY2xpZW50U3dvcmRcIjtcclxuaW1wb3J0IHsgQ2xpZW50Rmxvb3IgfSBmcm9tIFwiLi4vb2JqZWN0cy90ZXJyYWluL2Zsb29yL2NsaWVudEZsb29yXCI7XHJcbmltcG9ydCB7IFNlcmlhbGl6ZWRQbGF5ZXIgfSBmcm9tIFwiLi4vb2JqZWN0cy9uZXdBY3RvcnMvc2VydmVyQWN0b3JzL3NlcnZlclBsYXllci9zZXJ2ZXJQbGF5ZXJcIjtcclxuaW1wb3J0IHsgSW5wdXRSZWFkZXIgfSBmcm9tIFwiLi4vb2JqZWN0cy9jbGllbnRDb250cm9sbGVycy9pbnB1dFJlYWRlclwiO1xyXG5pbXBvcnQgeyBpZkluc2lkZSB9IGZyb20gXCIuLi9pZkluc2lkZVwiO1xyXG5pbXBvcnQgeyBDbGllbnREb29kYWQgfSBmcm9tIFwiLi4vb2JqZWN0cy90ZXJyYWluL2Rvb2RhZHMvY2xpZW50RG9vZGFkXCI7XHJcbmltcG9ydCB7IERvb2RhZCB9IGZyb20gXCIuLi9vYmplY3RzL3RlcnJhaW4vZG9vZGFkcy9kb29kYWRcIjtcclxuaW1wb3J0IHsgQ2xpZW50SGFtbWVyIH0gZnJvbSBcIi4uL29iamVjdHMvbmV3QWN0b3JzL2NsaWVudEFjdG9ycy9jbGllbnRQbGF5ZXIvY2xpZW50Q2xhc3Nlcy9jbGllbnRIYW1tZXJcIjtcclxuaW1wb3J0IHsgQ2xpZW50RGFnZ2VycyB9IGZyb20gXCIuLi9vYmplY3RzL25ld0FjdG9ycy9jbGllbnRBY3RvcnMvY2xpZW50UGxheWVyL2NsaWVudENsYXNzZXMvY2xpZW50RGFnZ2Vyc1wiO1xyXG5pbXBvcnQgeyBGbG9vciB9IGZyb20gXCIuLi9vYmplY3RzL3RlcnJhaW4vZmxvb3IvZmxvb3JcIjtcclxuaW1wb3J0IHsgQ2xpZW50QWN0b3IsIHJlbmRlclNoYXBlIH0gZnJvbSBcIi4uL29iamVjdHMvbmV3QWN0b3JzL2NsaWVudEFjdG9ycy9jbGllbnRBY3RvclwiO1xyXG5pbXBvcnQgeyBTd29yZENvbnRyb2xsZXIgfSBmcm9tIFwiLi4vb2JqZWN0cy9jbGllbnRDb250cm9sbGVycy9jb250cm9sbGVycy9zd29yZENvbnRyb2xsZXJcIjtcclxuaW1wb3J0IHsgRGFnZ2Vyc0NvbnRyb2xsZXIgfSBmcm9tIFwiLi4vb2JqZWN0cy9jbGllbnRDb250cm9sbGVycy9jb250cm9sbGVycy9kYWdnZXJzQ29udHJvbGxlclwiO1xyXG5pbXBvcnQgeyBIYW1tZXJDb250cm9sbGVyIH0gZnJvbSBcIi4uL29iamVjdHMvY2xpZW50Q29udHJvbGxlcnMvY29udHJvbGxlcnMvaGFtbWVyQ29udHJvbGxlclwiO1xyXG5pbXBvcnQgeyBTaWRlVHlwZSB9IGZyb20gXCIuLi9vYmplY3RzL25ld0FjdG9ycy9jbGllbnRBY3RvcnMvbW9kZWwvaGVhbHRoQmFyXCI7XHJcbmltcG9ydCB7IFBhcnRpY2xlU3lzdGVtIH0gZnJvbSBcIi4vcGFydGljbGVzL3BhcnRpY2xlU3lzdGVtXCI7XHJcbmltcG9ydCB7IFNpemUgfSBmcm9tIFwiLi4vc2l6ZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEdhbWUge1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgbWVudURpdiA9IHNhZmVHZXRFbGVtZW50QnlJZChcIm1lbnVEaXZcIik7XHJcbiAgICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBnYW1lRGl2ID0gc2FmZUdldEVsZW1lbnRCeUlkKFwiZ2FtZURpdlwiKTtcclxuXHJcbiAgICBwdWJsaWMgZ2FtZVJlbmRlcmVyOiBHYW1lUmVuZGVyZXI7XHJcbiAgICBwcm90ZWN0ZWQgZ2FtZVBsYXllcjogQ2xpZW50UGxheWVyO1xyXG4gICAgcHJvdGVjdGVkIGdhbWVQbGF5ZXJJbnB1dFJlYWRlcjogSW5wdXRSZWFkZXI7XHJcblxyXG4gICAgcHJvdGVjdGVkIHJlYWRvbmx5IGdsb2JhbENsaWVudEFjdG9yczogR2xvYmFsQ2xpZW50QWN0b3JzID0ge1xyXG4gICAgICAgIGFjdG9yczogW10sXHJcbiAgICAgICAgcGxheWVyczogW10sXHJcbiAgICAgICAgZGFnZ2VyUGxheWVyczogW10sXHJcbiAgICAgICAgaGFtbWVyUGxheWVyczogW10sXHJcbiAgICAgICAgc3dvcmRQbGF5ZXJzOiBbXSxcclxuICAgIH07XHJcbiAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgZ2xvYmFsQ2xpZW50T2JqZWN0czogR2xvYmFsQ2xpZW50T2JqZWN0cztcclxuXHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgcGFydGljbGVTeXN0ZW06IFBhcnRpY2xlU3lzdGVtO1xyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgcGFydGljbGVBbW91bnQ6IG51bWJlcjtcclxuICAgIHByaXZhdGUgZ29pbmc6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICAvL3B1YmxpYyBzY3JlZW5Qb3M6IFZlY3RvciA9IHsgeDogMCwgeTogMCB9O1xyXG4gICAgcHVibGljIG1vdXNlUG9zOiBWZWN0b3IgPSB7IHg6IDAsIHk6IDAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhhbmRsZU1lc3NhZ2UgPSBoYW5kbGVNZXNzYWdlO1xyXG4gICAgcHJvdGVjdGVkIGZpbmRBY3RvciA9IGZpbmRBY3RvcjtcclxuXHJcbiAgICBwcm90ZWN0ZWQgY29uc3RydWN0R2FtZShpbmZvOiBBbGxJbmZvKSB7XHJcbiAgICAgICAgLyp0aGlzLmdyb3VuZFBsYXRmb3JtID0gbmV3IENsaWVudEdyb3VuZFBsYXRmb3JtKGluZm8uZ3JvdW5kUGxhdGZvcm0pO1xyXG4gICAgICAgIHRoaXMucGxhdGZvcm1zID0gaW5mby5wbGF0Zm9ybXMubWFwKChwbGF0Zm9ybUluZm8pID0+IG5ldyBDbGllbnRQbGF0Zm9ybSh0aGlzLmNvbmZpZywgcGxhdGZvcm1JbmZvKSk7XHJcbiAgICAgICAgdGhpcy5wbGF5ZXJBY3RvcnMgPSBpbmZvLnBsYXllckFjdG9ycy5tYXAoXHJcbiAgICAgICAgICAgIChwbGF5ZXJJbmZvKSA9PiBuZXcgQ2xpZW50UGxheWVyQWN0b3IodGhpcy5jb25maWcsIHBsYXllckluZm8sIHRoaXMuaWQgPT09IHBsYXllckluZm8uaWQgPyB0cnVlIDogZmFsc2UsIHRoaXMuc2VydmVyVGFsa2VyKSxcclxuICAgICAgICApOyovXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgaW5mbzogQWxsSW5mbyxcclxuICAgICAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgY29uZmlnOiBDb25maWcsXHJcbiAgICAgICAgcHJvdGVjdGVkIHJlYWRvbmx5IGlkOiBudW1iZXIsXHJcbiAgICAgICAgcHVibGljIHJlYWRvbmx5IHNlcnZlclRhbGtlcjogU2VydmVyVGFsa2VyLFxyXG4gICAgICAgIHBhcnRpY2xlQW1vdW50OiBudW1iZXIsXHJcbiAgICApIHtcclxuICAgICAgICBHYW1lLnBhcnRpY2xlQW1vdW50ID0gcGFydGljbGVBbW91bnQgLyAxMDA7XHJcblxyXG4gICAgICAgIC8vIENPTlNUUlVDVCBHQU1FXHJcbiAgICAgICAgbGV0IGFjdG9yQ2FudmFzID0gc2FmZUdldEVsZW1lbnRCeUlkKFwiYWN0b3JDYW52YXNcIikgYXMgSFRNTENhbnZhc0VsZW1lbnQ7XHJcbiAgICAgICAgbGV0IGFjdG9yQ3R4ID0gYWN0b3JDYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpITtcclxuXHJcbiAgICAgICAgdGhpcy5wYXJ0aWNsZVN5c3RlbSA9IG5ldyBQYXJ0aWNsZVN5c3RlbShhY3RvckN0eCwgdGhpcyk7XHJcblxyXG4gICAgICAgIHRoaXMuZ2xvYmFsQ2xpZW50T2JqZWN0cyA9IHtcclxuICAgICAgICAgICAgZmxvb3I6IG5ldyBDbGllbnRGbG9vcih0aGlzLCBpbmZvLmZsb29yLnBvaW50c0FuZEFuZ2xlcywgaW5mby5mbG9vci5wb2ludENvdW50LCBpbmZvLmZsb29yLnJlc3VsdFdpZHRoLCBhY3RvckN0eCksXHJcbiAgICAgICAgICAgIGRvb2RhZHM6IFtdLFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgaW5mby5kb29kYWRzLmZvckVhY2goKGRvb2RhZCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmdsb2JhbENsaWVudE9iamVjdHMuZG9vZGFkcy5wdXNoKG5ldyBDbGllbnREb29kYWQoZG9vZGFkLnBvc2l0aW9uLCBkb29kYWQucm90YXRpb24sIGRvb2RhZC50eXBlLCBhY3RvckN0eCkpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpbmZvLnBsYXllcnMuZm9yRWFjaCgocGxheWVySW5mbykgPT4ge1xyXG4gICAgICAgICAgICBpZiAocGxheWVySW5mby5pZCAhPT0gdGhpcy5pZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5uZXdDbGllbnRQbGF5ZXIocGxheWVySW5mbyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgbGV0IGdhbWVQbGF5ZXJJbmZvOiBTZXJpYWxpemVkUGxheWVyID0gaW5mby5wbGF5ZXJzLmZpbmQoKHBsYXllcikgPT4gcGxheWVyLmlkID09PSB0aGlzLmlkKSE7XHJcbiAgICAgICAgdGhpcy5nYW1lUGxheWVyID0gdGhpcy5tYWtlR2FtZVBsYXllcihnYW1lUGxheWVySW5mbyk7XHJcblxyXG4gICAgICAgIHRoaXMuZ2FtZVBsYXllcklucHV0UmVhZGVyID0gbmV3IElucHV0UmVhZGVyKHRoaXMuZ2FtZVBsYXllciwgdGhpcyk7XHJcblxyXG4gICAgICAgIHRoaXMuZ2FtZVJlbmRlcmVyID0gbmV3IEdhbWVSZW5kZXJlcih0aGlzLmNvbmZpZywgdGhpcywgdGhpcy5nYW1lUGxheWVyKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXJ2ZXJUYWxrZXIubWVzc2FnZUhhbmRsZXIgPSAobXNnOiBTZXJ2ZXJNZXNzYWdlKSA9PiB0aGlzLmhhbmRsZU1lc3NhZ2UobXNnKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhcnQoKSB7XHJcbiAgICAgICAgdGhpcy5nb2luZyA9IHRydWU7XHJcblxyXG4gICAgICAgIC8vIHVzZSBvbmtleWRvd24gYW5kIG9ua2V5dXAgaW5zdGVhZCBvZiBhZGRFdmVudExpc3RlbmVyIGJlY2F1c2UgaXQncyBwb3NzaWJsZSB0byBhZGQgbXVsdGlwbGUgZXZlbnQgbGlzdGVuZXJzIHBlciBldmVudFxyXG4gICAgICAgIC8vIFRoaXMgd291bGQgY2F1c2UgYSBidWcgd2hlcmUgZWFjaCB0aW1lIHlvdSBwcmVzcyBhIGtleSBpdCBjcmVhdGVzIG11bHRpcGxlIGJsYXN0cyBvciBqdW1wc1xyXG5cclxuICAgICAgICB3aW5kb3cub25tb3VzZWRvd24gPSAoZTogTW91c2VFdmVudCkgPT4ge1xyXG4gICAgICAgICAgICAvKmxldCBnbG9iYWxNb3VzZTogVmVjdG9yID0gdGhpcy5nZXRHbG9iYWxNb3VzZVBvcygpO1xyXG4gICAgICAgICAgICBsZXQgcGxheWVyUG9zOiBWZWN0b3IgPSB0aGlzLmdhbWVQbGF5ZXIucG9zaXRpb247XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwie3g6IFwiICsgKHBsYXllclBvcy54IC0gZ2xvYmFsTW91c2UueCkgKyBcIiwgeTogXCIgKyAocGxheWVyUG9zLnkgLSBnbG9iYWxNb3VzZS55KSArIFwifSxcIik7Ki9cclxuICAgICAgICAgICAgdGhpcy5nYW1lUGxheWVySW5wdXRSZWFkZXIucmVnaXN0ZXJNb3VzZURvd24oZSwgdGhpcy5nZXRHbG9iYWxNb3VzZVBvcygpKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHdpbmRvdy5vbm1vdXNldXAgPSAoZTogTW91c2VFdmVudCkgPT4gdGhpcy5nYW1lUGxheWVySW5wdXRSZWFkZXIucmVnaXN0ZXJNb3VzZVVwKGUsIHRoaXMuZ2V0R2xvYmFsTW91c2VQb3MoKSk7XHJcbiAgICAgICAgd2luZG93Lm9ua2V5ZG93biA9IChlOiBLZXlib2FyZEV2ZW50KSA9PiB0aGlzLmdhbWVQbGF5ZXJJbnB1dFJlYWRlci5yZWdpc3RlcktleURvd24oZSwgdGhpcy5nZXRHbG9iYWxNb3VzZVBvcygpKTtcclxuICAgICAgICB3aW5kb3cub25rZXl1cCA9IChlOiBLZXlib2FyZEV2ZW50KSA9PiB0aGlzLmdhbWVQbGF5ZXJJbnB1dFJlYWRlci5yZWdpc3RlcktleVVwKGUsIHRoaXMuZ2V0R2xvYmFsTW91c2VQb3MoKSk7XHJcblxyXG4gICAgICAgIHdpbmRvdy5vbm1vdXNlbW92ZSA9IChlOiBNb3VzZUV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMubW91c2VQb3MueCA9IGUuY2xpZW50WDtcclxuICAgICAgICAgICAgdGhpcy5tb3VzZVBvcy55ID0gZS5jbGllbnRZO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKHRpbWVzdGFtcCkgPT4gdGhpcy5sb29wKHRpbWVzdGFtcCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBlbmQoKSB7XHJcbiAgICAgICAgdGhpcy5nb2luZyA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuc2VydmVyVGFsa2VyLmxlYXZlKCk7XHJcblxyXG4gICAgICAgIHdpbmRvdy5vbm1vdXNlZG93biA9ICgpID0+IHt9O1xyXG4gICAgICAgIHdpbmRvdy5vbm1vdXNldXAgPSAoKSA9PiB7fTtcclxuICAgICAgICB3aW5kb3cub25rZXlkb3duID0gKCkgPT4ge307XHJcbiAgICAgICAgd2luZG93Lm9ua2V5dXAgPSAoKSA9PiB7fTtcclxuICAgICAgICB3aW5kb3cub25tb3VzZW1vdmUgPSAoKSA9PiB7fTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGxhc3RGcmFtZT86IG51bWJlcjtcclxuICAgIHB1YmxpYyBsb29wKHRpbWVzdGFtcDogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmxhc3RGcmFtZSkge1xyXG4gICAgICAgICAgICB0aGlzLmxhc3RGcmFtZSA9IHRpbWVzdGFtcDtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgZWxhcHNlZFRpbWUgPSAodGltZXN0YW1wIC0gdGhpcy5sYXN0RnJhbWUpIC8gMTAwMDtcclxuICAgICAgICB0aGlzLmxhc3RGcmFtZSA9IHRpbWVzdGFtcDtcclxuICAgICAgICB0aGlzLnVwZGF0ZShlbGFwc2VkVGltZSAqIHRoaXMuY29uZmlnLmdhbWVTcGVlZCk7XHJcbiAgICAgICAgaWYgKHRoaXMuZ29pbmcpIHtcclxuICAgICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgodGltZXN0YW1wKSA9PiB0aGlzLmxvb3AodGltZXN0YW1wKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdXBkYXRlKGVsYXBzZWRUaW1lOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLmdhbWVQbGF5ZXJJbnB1dFJlYWRlci51cGRhdGUoZWxhcHNlZFRpbWUpO1xyXG5cclxuICAgICAgICB0aGlzLnVwZGF0ZU9iamVjdHMoZWxhcHNlZFRpbWUpO1xyXG5cclxuICAgICAgICB0aGlzLmdhbWVSZW5kZXJlci51cGRhdGVBbmRSZW5kZXIoZWxhcHNlZFRpbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdXBkYXRlT2JqZWN0cyhlbGFwc2VkVGltZTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5nbG9iYWxDbGllbnRBY3RvcnMucGxheWVycy5mb3JFYWNoKChwbGF5ZXIpID0+IHBsYXllci51cGRhdGUoZWxhcHNlZFRpbWUpKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgbmV3Q2xpZW50UGxheWVyKHBsYXllckluZm86IFNlcmlhbGl6ZWRQbGF5ZXIpIHtcclxuICAgICAgICB2YXIgbmV3UGxheWVyOiBDbGllbnRQbGF5ZXI7XHJcbiAgICAgICAgc3dpdGNoIChwbGF5ZXJJbmZvLmNsYXNzKSB7XHJcbiAgICAgICAgICAgIGNhc2UgXCJkYWdnZXJzXCI6XHJcbiAgICAgICAgICAgICAgICBuZXdQbGF5ZXIgPSBuZXcgQ2xpZW50RGFnZ2Vycyh0aGlzLCBwbGF5ZXJJbmZvKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2xvYmFsQ2xpZW50QWN0b3JzLmRhZ2dlclBsYXllcnMucHVzaChuZXdQbGF5ZXIgYXMgQ2xpZW50RGFnZ2Vycyk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcImhhbW1lclwiOlxyXG4gICAgICAgICAgICAgICAgbmV3UGxheWVyID0gbmV3IENsaWVudEhhbW1lcih0aGlzLCBwbGF5ZXJJbmZvKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2xvYmFsQ2xpZW50QWN0b3JzLmhhbW1lclBsYXllcnMucHVzaChuZXdQbGF5ZXIgYXMgQ2xpZW50SGFtbWVyKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwic3dvcmRcIjpcclxuICAgICAgICAgICAgICAgIG5ld1BsYXllciA9IG5ldyBDbGllbnRTd29yZCh0aGlzLCBwbGF5ZXJJbmZvKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2xvYmFsQ2xpZW50QWN0b3JzLnN3b3JkUGxheWVycy5wdXNoKG5ld1BsYXllciBhcyBDbGllbnRTd29yZCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcInVua25vd24gY2xhc3MgdHlwZSBcIiArIHBsYXllckluZm8uY2xhc3MpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmdsb2JhbENsaWVudEFjdG9ycy5wbGF5ZXJzLnB1c2gobmV3UGxheWVyKTtcclxuICAgICAgICB0aGlzLmdsb2JhbENsaWVudEFjdG9ycy5hY3RvcnMucHVzaChuZXdQbGF5ZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBtYWtlR2FtZVBsYXllcihwbGF5ZXJJbmZvOiBTZXJpYWxpemVkUGxheWVyKTogQ2xpZW50UGxheWVyIHtcclxuICAgICAgICB2YXIgbmV3R2FtZVBsYXllcjogQ2xpZW50UGxheWVyO1xyXG4gICAgICAgIHN3aXRjaCAocGxheWVySW5mby5jbGFzcykge1xyXG4gICAgICAgICAgICBjYXNlIFwiZGFnZ2Vyc1wiOlxyXG4gICAgICAgICAgICAgICAgbmV3R2FtZVBsYXllciA9IG5ldyBDbGllbnREYWdnZXJzKHRoaXMsIHBsYXllckluZm8pO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5nbG9iYWxDbGllbnRBY3RvcnMuZGFnZ2VyUGxheWVycy5wdXNoKG5ld0dhbWVQbGF5ZXIgYXMgQ2xpZW50RGFnZ2Vycyk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcImhhbW1lclwiOlxyXG4gICAgICAgICAgICAgICAgbmV3R2FtZVBsYXllciA9IG5ldyBDbGllbnRIYW1tZXIodGhpcywgcGxheWVySW5mbyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdsb2JhbENsaWVudEFjdG9ycy5oYW1tZXJQbGF5ZXJzLnB1c2gobmV3R2FtZVBsYXllciBhcyBDbGllbnRIYW1tZXIpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJzd29yZFwiOlxyXG4gICAgICAgICAgICAgICAgbmV3R2FtZVBsYXllciA9IG5ldyBDbGllbnRTd29yZCh0aGlzLCBwbGF5ZXJJbmZvKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2xvYmFsQ2xpZW50QWN0b3JzLnN3b3JkUGxheWVycy5wdXNoKG5ld0dhbWVQbGF5ZXIgYXMgQ2xpZW50U3dvcmQpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ1bmtub3duIGNsYXNzIHR5cGUgXCIgKyBwbGF5ZXJJbmZvLmNsYXNzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5nbG9iYWxDbGllbnRBY3RvcnMucGxheWVycy5wdXNoKG5ld0dhbWVQbGF5ZXIpO1xyXG4gICAgICAgIHRoaXMuZ2xvYmFsQ2xpZW50QWN0b3JzLmFjdG9ycy5wdXNoKG5ld0dhbWVQbGF5ZXIpO1xyXG4gICAgICAgIHJldHVybiBuZXdHYW1lUGxheWVyO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBwbGF5ZXJMZWF2ZShpZDogbnVtYmVyKSB7XHJcbiAgICAgICAgbGV0IHBsYXllcjogQ2xpZW50UGxheWVyID0gdGhpcy5nbG9iYWxDbGllbnRBY3RvcnMucGxheWVycy5maW5kKChwbGF5ZXIpID0+IHBsYXllci5nZXRBY3RvcklkKCkgPT09IGlkKSE7XHJcbiAgICAgICAgc3dpdGNoIChwbGF5ZXIuZ2V0Q2xhc3NUeXBlKCkpIHtcclxuICAgICAgICAgICAgY2FzZSBcImRhZ2dlcnNcIjpcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2xvYmFsQ2xpZW50QWN0b3JzLmRhZ2dlclBsYXllcnMgPSB0aGlzLmdsb2JhbENsaWVudEFjdG9ycy5kYWdnZXJQbGF5ZXJzLmZpbHRlcigocGxheWVyKSA9PiBwbGF5ZXIuZ2V0QWN0b3JJZCgpICE9PSBpZCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcInN3b3JkXCI6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdsb2JhbENsaWVudEFjdG9ycy5zd29yZFBsYXllcnMgPSB0aGlzLmdsb2JhbENsaWVudEFjdG9ycy5zd29yZFBsYXllcnMuZmlsdGVyKChwbGF5ZXIpID0+IHBsYXllci5nZXRBY3RvcklkKCkgIT09IGlkKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiaGFtbWVyXCI6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdsb2JhbENsaWVudEFjdG9ycy5oYW1tZXJQbGF5ZXJzID0gdGhpcy5nbG9iYWxDbGllbnRBY3RvcnMuaGFtbWVyUGxheWVycy5maWx0ZXIoKHBsYXllcikgPT4gcGxheWVyLmdldEFjdG9ySWQoKSAhPT0gaWQpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ1bmtub3duIGNsYXNzIHR5cGUgaW4gcGxheWVyTGVhdmVcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZ2xvYmFsQ2xpZW50QWN0b3JzLnBsYXllcnMgPSB0aGlzLmdsb2JhbENsaWVudEFjdG9ycy5wbGF5ZXJzLmZpbHRlcigocGxheWVyKSA9PiBwbGF5ZXIuZ2V0QWN0b3JJZCgpICE9PSBpZCk7XHJcbiAgICAgICAgdGhpcy5nbG9iYWxDbGllbnRBY3RvcnMuYWN0b3JzID0gdGhpcy5nbG9iYWxDbGllbnRBY3RvcnMuYWN0b3JzLmZpbHRlcigoYWN0b3IpID0+IGFjdG9yLmdldEFjdG9ySWQoKSAhPT0gaWQpO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGdldE1vdXNlU2hhcGUoKTogU2hhcGUge1xyXG4gICAgICAgIC8qXHJcbiAgICAgICAgbGV0IHAxOiBWZWN0b3IgPSB7IHg6IHRoaXMubW91c2VQb3MueCArIHRoaXMuc2NyZWVuUG9zLngsIHk6IHRoaXMubW91c2VQb3MueSAtIDQwICsgdGhpcy5zY3JlZW5Qb3MueSB9O1xyXG4gICAgICAgIGxldCBwMjogVmVjdG9yID0geyB4OiB0aGlzLm1vdXNlUG9zLnggLSAzMCArIHRoaXMuc2NyZWVuUG9zLngsIHk6IHRoaXMubW91c2VQb3MueSArIDIwICsgdGhpcy5zY3JlZW5Qb3MueSB9O1xyXG4gICAgICAgIGxldCBwMzogVmVjdG9yID0geyB4OiB0aGlzLm1vdXNlUG9zLnggKyAzMCArIHRoaXMuc2NyZWVuUG9zLngsIHk6IHRoaXMubW91c2VQb3MueSArIDIwICsgdGhpcy5zY3JlZW5Qb3MueSB9O1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGNlbnRlcjogeyB4OiB0aGlzLm1vdXNlUG9zLnggKyB0aGlzLnNjcmVlblBvcy54LCB5OiB0aGlzLm1vdXNlUG9zLnkgKyB0aGlzLnNjcmVlblBvcy55IH0sXHJcbiAgICAgICAgICAgIHBvaW50czogW3AxLCBwMiwgcDNdLFxyXG4gICAgICAgICAgICBlZGdlczogW1xyXG4gICAgICAgICAgICAgICAgeyBwMSwgcDIgfSxcclxuICAgICAgICAgICAgICAgIHsgcDE6IHAyLCBwMjogcDMgfSxcclxuICAgICAgICAgICAgICAgIHsgcDE6IHAzLCBwMjogcDEgfSxcclxuICAgICAgICAgICAgXSxcclxuICAgICAgICB9OyovXHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiZ2V0TW91c2VTaGFwZSBjdXJyZW50bHkgbm90IGFkanVzdGVkIGZvciBzY3JlZW4gY2VudGVyXCIpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldEdsb2JhbE1vdXNlUG9zKCk6IFZlY3RvciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2FtZVJlbmRlcmVyLmdldENhbnZhc1Bvc0Zyb21TY3JlZW4odGhpcy5tb3VzZVBvcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldEdsb2JhbE9iamVjdHMoKTogR2xvYmFsQ2xpZW50T2JqZWN0cyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2xvYmFsQ2xpZW50T2JqZWN0cztcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXRHbG9iYWxBY3RvcnMoKTogR2xvYmFsQ2xpZW50QWN0b3JzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5nbG9iYWxDbGllbnRBY3RvcnM7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0QWN0b3JDdHgoKTogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIHtcclxuICAgICAgICByZXR1cm4gKHNhZmVHZXRFbGVtZW50QnlJZChcImFjdG9yQ2FudmFzXCIpIGFzIEhUTUxDYW52YXNFbGVtZW50KS5nZXRDb250ZXh0KFwiMmRcIikhO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldEFjdG9yU2lkZSh0ZWFtOiBudW1iZXIpOiBTaWRlVHlwZSB7XHJcbiAgICAgICAgaWYgKHRlYW0gPT09IHRoaXMuaWQpIHJldHVybiBcInNlbGZcIjtcclxuICAgICAgICBlbHNlIHJldHVybiBcImVuZW15XCI7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0SWQoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5pZDtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBHbG9iYWxPYmplY3RzIHtcclxuICAgIGZsb29yOiBGbG9vcjtcclxuICAgIGRvb2RhZHM6IERvb2RhZFtdO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEdsb2JhbENsaWVudEFjdG9ycyB7XHJcbiAgICBhY3RvcnM6IENsaWVudEFjdG9yW107XHJcbiAgICBwbGF5ZXJzOiBDbGllbnRQbGF5ZXJbXTtcclxuICAgIGRhZ2dlclBsYXllcnM6IENsaWVudERhZ2dlcnNbXTtcclxuICAgIGhhbW1lclBsYXllcnM6IENsaWVudEhhbW1lcltdO1xyXG4gICAgc3dvcmRQbGF5ZXJzOiBDbGllbnRTd29yZFtdO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEdsb2JhbENsaWVudE9iamVjdHMgZXh0ZW5kcyBHbG9iYWxPYmplY3RzIHtcclxuICAgIGZsb29yOiBDbGllbnRGbG9vcjtcclxuICAgIGRvb2RhZHM6IENsaWVudERvb2RhZFtdO1xyXG59XHJcbiIsImltcG9ydCB7IERvb2RhZFR5cGUgfSBmcm9tIFwiLi4vLi4vb2JqZWN0cy90ZXJyYWluL2Rvb2RhZHMvZG9vZGFkXCI7XHJcbmltcG9ydCB7IFNlcnZlclRhbGtlciB9IGZyb20gXCIuLi9zZXJ2ZXJ0YWxrZXJcIjtcclxuXHJcbmV4cG9ydCB0eXBlIEFiaWxpdHlJbWFnZU5hbWUgPSBcInNsYXNoSWNvblwiIHwgXCJ3aGlybHdpbmRJY29uXCIgfCBcImVtcHR5SWNvblwiIHwgXCJsdmwxMFwiIHwgXCJsdmw2XCIgfCBcInN0YWJJY29uXCIgfCBcImx1bmdlSWNvblwiIHwgXCJzd2luZ0ljb25cIiB8IFwicG91bmRJY29uXCI7XHJcbmV4cG9ydCB0eXBlIFdlYXBvbkltYWdlTmFtZSA9IFwic3dvcmQzMVwiIHwgXCJzd29yZDIxXCIgfCBcInN3b3JkMTFcIiB8IFwiZGFnZ2VyMTFcIiB8IFwiaGFtbWVyMTFcIiB8IFwiaGFtbWVyMjFcIiB8IFwiZGFnZ2VyMjFcIjtcclxuZXhwb3J0IHR5cGUgR2lmSW1hZ2VOYW1lID0gXCJzbGFzaEVmZmVjdFRlc3QyXCIgfCBcIndoaXJsd2luZEVmZmVjdEJhc2VcIiB8IFwid2hpcmx3aW5kRWZmZWN0VG9wXCI7XHJcblxyXG5leHBvcnQgdHlwZSBJbWFnZU5hbWUgPSBEb29kYWRUeXBlIHwgQWJpbGl0eUltYWdlTmFtZSB8IFdlYXBvbkltYWdlTmFtZSB8IEdpZkltYWdlTmFtZTtcclxuXHJcbi8vbGV0IGltZzogSFRNTEltYWdlRWxlbWVudCA9IGFzc2V0TWFuYWdlci5pbWFnZXNbXCJsYXZhZmx5XCJdO1xyXG5cclxuZXhwb3J0IGNvbnN0IGltYWdlSW5mb3JtYXRpb246IFJlY29yZDxJbWFnZU5hbWUsIHN0cmluZz4gPSB7XHJcbiAgICByb2NrTGFyZ2U6IGBodHRwczovLyR7U2VydmVyVGFsa2VyLmhvc3ROYW1lfS9pbWFnZXMvcm9ja0Rvb2RhZC5wbmdgLFxyXG4gICAgc2xhc2hJY29uOiBgaHR0cHM6Ly8ke1NlcnZlclRhbGtlci5ob3N0TmFtZX0vaW1hZ2VzL2FiaWxpdHlJY29ucy9zbGFzaEljb24ucG5nYCxcclxuICAgIGVtcHR5SWNvbjogYGh0dHBzOi8vJHtTZXJ2ZXJUYWxrZXIuaG9zdE5hbWV9L2ltYWdlcy9hYmlsaXR5SWNvbnMvZW1wdHlJY29uLnBuZ2AsXHJcbiAgICB3aGlybHdpbmRJY29uOiBgaHR0cHM6Ly8ke1NlcnZlclRhbGtlci5ob3N0TmFtZX0vaW1hZ2VzL2FiaWxpdHlJY29ucy93aGlybHdpbmRJY29uLnBuZ2AsXHJcbiAgICBsdmwxMDogYGh0dHBzOi8vJHtTZXJ2ZXJUYWxrZXIuaG9zdE5hbWV9L2ltYWdlcy9hYmlsaXR5SWNvbnMvbHZsMTAucG5nYCxcclxuICAgIGx2bDY6IGBodHRwczovLyR7U2VydmVyVGFsa2VyLmhvc3ROYW1lfS9pbWFnZXMvYWJpbGl0eUljb25zL2x2bDYucG5nYCxcclxuICAgIHN0YWJJY29uOiBgaHR0cHM6Ly8ke1NlcnZlclRhbGtlci5ob3N0TmFtZX0vaW1hZ2VzL2FiaWxpdHlJY29ucy9zdGFiSWNvbi5wbmdgLFxyXG4gICAgbHVuZ2VJY29uOiBgaHR0cHM6Ly8ke1NlcnZlclRhbGtlci5ob3N0TmFtZX0vaW1hZ2VzL2FiaWxpdHlJY29ucy9sdW5nZUljb24ucG5nYCxcclxuICAgIHN3aW5nSWNvbjogYGh0dHBzOi8vJHtTZXJ2ZXJUYWxrZXIuaG9zdE5hbWV9L2ltYWdlcy9hYmlsaXR5SWNvbnMvc3dpbmdJY29uLnBuZ2AsXHJcbiAgICBwb3VuZEljb246IGBodHRwczovLyR7U2VydmVyVGFsa2VyLmhvc3ROYW1lfS9pbWFnZXMvYWJpbGl0eUljb25zL3BvdW5kSWNvbi5wbmdgLFxyXG4gICAgc3dvcmQxMTogYGh0dHBzOi8vJHtTZXJ2ZXJUYWxrZXIuaG9zdE5hbWV9L2ltYWdlcy93ZWFwb25JbWFnZXMvc3dvcmQxMS5wbmdgLFxyXG4gICAgc3dvcmQyMTogYGh0dHBzOi8vJHtTZXJ2ZXJUYWxrZXIuaG9zdE5hbWV9L2ltYWdlcy93ZWFwb25JbWFnZXMvc3dvcmQyMS5wbmdgLFxyXG4gICAgc3dvcmQzMTogYGh0dHBzOi8vJHtTZXJ2ZXJUYWxrZXIuaG9zdE5hbWV9L2ltYWdlcy93ZWFwb25JbWFnZXMvc3dvcmQzMS5wbmdgLFxyXG4gICAgaGFtbWVyMTE6IGBodHRwczovLyR7U2VydmVyVGFsa2VyLmhvc3ROYW1lfS9pbWFnZXMvd2VhcG9uSW1hZ2VzL2hhbW1lcjExLnBuZ2AsXHJcbiAgICBoYW1tZXIyMTogYGh0dHBzOi8vJHtTZXJ2ZXJUYWxrZXIuaG9zdE5hbWV9L2ltYWdlcy93ZWFwb25JbWFnZXMvaGFtbWVyMjEucG5nYCxcclxuICAgIGRhZ2dlcjExOiBgaHR0cHM6Ly8ke1NlcnZlclRhbGtlci5ob3N0TmFtZX0vaW1hZ2VzL3dlYXBvbkltYWdlcy9kYWdnZXIxMS5wbmdgLFxyXG4gICAgZGFnZ2VyMjE6IGBodHRwczovLyR7U2VydmVyVGFsa2VyLmhvc3ROYW1lfS9pbWFnZXMvd2VhcG9uSW1hZ2VzL2RhZ2dlcjIxLnBuZ2AsXHJcbiAgICBzbGFzaEVmZmVjdFRlc3QyOiBgaHR0cHM6Ly8ke1NlcnZlclRhbGtlci5ob3N0TmFtZX0vaW1hZ2VzL2VmZmVjdEltYWdlcy9zbGFzaEVmZmVjdFRlc3QyLnBuZ2AsXHJcbiAgICB3aGlybHdpbmRFZmZlY3RCYXNlOiBgaHR0cHM6Ly8ke1NlcnZlclRhbGtlci5ob3N0TmFtZX0vaW1hZ2VzL2VmZmVjdEltYWdlcy93aGlybHdpbmRFZmZlY3RCYXNlLnBuZ2AsXHJcbiAgICB3aGlybHdpbmRFZmZlY3RUb3A6IGBodHRwczovLyR7U2VydmVyVGFsa2VyLmhvc3ROYW1lfS9pbWFnZXMvZWZmZWN0SW1hZ2VzL3doaXJsd2luZEVmZmVjdFRvcC5wbmdgLFxyXG59O1xyXG5jbGFzcyBBc3NldE1hbmFnZXIge1xyXG4gICAgcHVibGljIGltYWdlczogUmVjb3JkPEltYWdlTmFtZSwgSFRNTEltYWdlRWxlbWVudD47XHJcbiAgICAvLyBwdWJsaWMgc291bmRzOiBSZWNvcmQ8c3RyaW5nLCBIVE1MSW1hZ2VFbGVtZW50PjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmltYWdlcyA9IHt9IGFzIFJlY29yZDxJbWFnZU5hbWUsIEhUTUxJbWFnZUVsZW1lbnQ+O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhc3luYyBsb2FkQWxsTmVjZXNzYXJ5SW1hZ2VzKCkge1xyXG4gICAgICAgIGF3YWl0IFByb21pc2UuYWxsKE9iamVjdC5rZXlzKGltYWdlSW5mb3JtYXRpb24pLm1hcCgoaW1hZ2VOYW1lKSA9PiB0aGlzLmFkZEltYWdlKGltYWdlTmFtZSBhcyBJbWFnZU5hbWUsIGltYWdlSW5mb3JtYXRpb25baW1hZ2VOYW1lIGFzIEltYWdlTmFtZV0pKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFzeW5jIGFkZEltYWdlKG5hbWU6IEltYWdlTmFtZSwgc291cmNlOiBzdHJpbmcpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8dm9pZD4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgICAgICAgICAgIHhoci5vcGVuKFwiR0VUXCIsIHNvdXJjZSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIHhoci5yZXNwb25zZVR5cGUgPSBcImJsb2JcIjtcclxuICAgICAgICAgICAgeGhyLm9ubG9hZCA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICh4aHIuc3RhdHVzID09PSAyMDApIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgYXNzZXQgPSBuZXcgSW1hZ2UoKTtcclxuICAgICAgICAgICAgICAgICAgICBhc3NldC5vbmxvYWQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5VUkwucmV2b2tlT2JqZWN0VVJMKGFzc2V0LnNyYyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICBhc3NldC5zcmMgPSB3aW5kb3cuVVJMLmNyZWF0ZU9iamVjdFVSTCh4aHIucmVzcG9uc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW1hZ2VzW25hbWVdID0gYXNzZXQ7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByZWplY3QoYEFzc2V0ICR7bmFtZX0gcmVqZWN0ZWQgd2l0aCBlcnJvciBjb2RlICR7eGhyLnN0YXR1c31gKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgeGhyLm9uZXJyb3IgPSAoZXJyb3IpID0+IHtcclxuICAgICAgICAgICAgICAgIHJlamVjdChlcnJvcik7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHhoci5zZW5kKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBhc3NldE1hbmFnZXIgPSBuZXcgQXNzZXRNYW5hZ2VyKCk7XHJcbiIsImltcG9ydCB7IE1vZHVsZUZpbGVuYW1lSGVscGVycyB9IGZyb20gXCJ3ZWJwYWNrXCI7XHJcbmltcG9ydCB7IENvbmZpZywgZGVmYXVsdENvbmZpZyB9IGZyb20gXCIuLi8uLi9jb25maWdcIjtcclxuaW1wb3J0IHsgVmVjdG9yIH0gZnJvbSBcIi4uLy4uL3ZlY3RvclwiO1xyXG5pbXBvcnQgeyBhc3NldE1hbmFnZXIgfSBmcm9tIFwiLi9hc3NldG1hbmFnZXJcIjtcclxuaW1wb3J0IHsgR2FtZSwgR2xvYmFsQ2xpZW50QWN0b3JzLCBHbG9iYWxDbGllbnRPYmplY3RzIH0gZnJvbSBcIi4uL2dhbWVcIjtcclxuaW1wb3J0IHsgc2FmZUdldEVsZW1lbnRCeUlkIH0gZnJvbSBcIi4uL3V0aWxcIjtcclxuaW1wb3J0IHsgQ2xpZW50UGxheWVyIH0gZnJvbSBcIi4uLy4uL29iamVjdHMvbmV3QWN0b3JzL2NsaWVudEFjdG9ycy9jbGllbnRQbGF5ZXIvY2xpZW50UGxheWVyXCI7XHJcbmltcG9ydCB7IGNvbnZlcnRDb21waWxlck9wdGlvbnNGcm9tSnNvbiB9IGZyb20gXCJ0eXBlc2NyaXB0XCI7XHJcbmltcG9ydCB7IFNpemUgfSBmcm9tIFwiLi4vLi4vc2l6ZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEdhbWVSZW5kZXJlciB7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGNhbnZhc0RpdiA9IHNhZmVHZXRFbGVtZW50QnlJZChcImNhbnZhc0RpdlwiKTtcclxuICAgIC8vcHJpdmF0ZSByZWFkb25seSBtb29uID0gc2FmZUdldEVsZW1lbnRCeUlkKFwibW9vblwiKTtcclxuXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGFjdG9yQ2FudmFzID0gc2FmZUdldEVsZW1lbnRCeUlkKFwiYWN0b3JDYW52YXNcIikgYXMgSFRNTENhbnZhc0VsZW1lbnQ7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgYWN0b3JDdHggPSB0aGlzLmFjdG9yQ2FudmFzLmdldENvbnRleHQoXCIyZFwiKSE7XHJcblxyXG4gICAgcHJpdmF0ZSB0YXJnZXRTY3JlZW5DZW50ZXI6IFZlY3RvcjtcclxuICAgIHByb3RlY3RlZCBjdXJyZW50U2NyZWVuQ2VudGVyOiBWZWN0b3I7XHJcbiAgICAvL3Byb3RlY3RlZCBzY3JlZW5Qb3M6IFZlY3RvcjtcclxuICAgIHB1YmxpYyByZWFkb25seSBwcmV2aW91c1dpbmRvd1NpemU6IFNpemUgPSB7IHdpZHRoOiAwLCBoZWlnaHQ6IDAgfTtcclxuXHJcbiAgICBwcml2YXRlIHRhcmdldFpvb206IG51bWJlciA9IDE7XHJcbiAgICBwdWJsaWMgY3VycmVudFpvb206IG51bWJlciA9IDE7XHJcbiAgICBwcml2YXRlIHpvb21EZWxheTogbnVtYmVyID0gNTtcclxuXHJcbiAgICBwdWJsaWMgY3VycmVudFNjcmVlblBvczogVmVjdG9yID0geyB4OiAwLCB5OiAwIH07XHJcbiAgICBwdWJsaWMgY3VycmVudFNjcmVlblNpemU6IFNpemUgPSB7IHdpZHRoOiAwLCBoZWlnaHQ6IDAgfTtcclxuICAgIHB1YmxpYyBjdXJyZW50U2NyZWVuUmF0aW86IG51bWJlciA9IDE7XHJcblxyXG4gICAgcHJvdGVjdGVkIGdsb2JhbENsaWVudEFjdG9yczogR2xvYmFsQ2xpZW50QWN0b3JzO1xyXG4gICAgcHJvdGVjdGVkIGdsb2JhbENsaWVudE9iamVjdHM6IEdsb2JhbENsaWVudE9iamVjdHM7XHJcbiAgICBwcm90ZWN0ZWQgaWQ6IG51bWJlcjtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgcmVhZG9ubHkgY29uZmlnOiBDb25maWcsIHByb3RlY3RlZCBnYW1lOiBHYW1lLCBwcm90ZWN0ZWQgZ2FtZVBsYXllcjogQ2xpZW50UGxheWVyKSB7XHJcbiAgICAgICAgdGhpcy5hdHRlbXB0VXBkYXRlQ2FudmFzU2l6ZXMoKTtcclxuICAgICAgICB0aGlzLnRhcmdldFNjcmVlbkNlbnRlciA9IHRoaXMuZ2FtZVBsYXllci5wb3NpdGlvbjtcclxuICAgICAgICB0aGlzLmN1cnJlbnRTY3JlZW5DZW50ZXIgPSB7IHg6IHRoaXMudGFyZ2V0U2NyZWVuQ2VudGVyLnggKyAwLCB5OiB0aGlzLnRhcmdldFNjcmVlbkNlbnRlci55ICsgMCB9O1xyXG5cclxuICAgICAgICB0aGlzLmdsb2JhbENsaWVudEFjdG9ycyA9IHRoaXMuZ2FtZS5nZXRHbG9iYWxBY3RvcnMoKTtcclxuICAgICAgICB0aGlzLmdsb2JhbENsaWVudE9iamVjdHMgPSB0aGlzLmdhbWUuZ2V0R2xvYmFsT2JqZWN0cygpO1xyXG4gICAgICAgIHRoaXMuaWQgPSB0aGlzLmdhbWUuZ2V0SWQoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdXBkYXRlQW5kUmVuZGVyKGVsYXBzZWRUaW1lOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZVpvb20oZWxhcHNlZFRpbWUpO1xyXG4gICAgICAgIHRoaXMuYXR0ZW1wdFVwZGF0ZUNhbnZhc1NpemVzKCk7XHJcblxyXG4gICAgICAgIHRoaXMudXBkYXRlU2xpZGVyWCgpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlU2xpZGVyWSgpO1xyXG5cclxuICAgICAgICB0aGlzLnNldENhbnZhc1RyYW5zZm9ybSh0cnVlKTtcclxuICAgICAgICB0aGlzLmNsaXBYUGFuKCk7XHJcblxyXG4gICAgICAgIHRoaXMucmVuZGVyQWN0b3JzKGVsYXBzZWRUaW1lKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHVwZGF0ZVpvb20oZWxhcHNlZFRpbWU6IG51bWJlcikge1xyXG4gICAgICAgIGlmICh0aGlzLnRhcmdldFpvb20gIT09IDEpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMudGFyZ2V0Wm9vbSA+IDEpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudGFyZ2V0Wm9vbSAvPSAxICsgZWxhcHNlZFRpbWU7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy50YXJnZXRab29tIDwgMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudGFyZ2V0Wm9vbSA9IDE7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy50YXJnZXRab29tIDwgMSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy50YXJnZXRab29tICo9IDEgKyBlbGFwc2VkVGltZTtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnRhcmdldFpvb20gPiAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50YXJnZXRab29tID0gMTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50Wm9vbSAhPSB0aGlzLnRhcmdldFpvb20pIHtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50Wm9vbSA9ICh0aGlzLmN1cnJlbnRab29tICogKHRoaXMuem9vbURlbGF5IC0gMSkgKyB0aGlzLnRhcmdldFpvb20pIC8gdGhpcy56b29tRGVsYXk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRab29tICsgMC4wMDAxID4gdGhpcy50YXJnZXRab29tICYmIHRoaXMuY3VycmVudFpvb20gLSAwLjAwMDEgPCB0aGlzLnRhcmdldFpvb20pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFpvb20gPSB0aGlzLnRhcmdldFpvb20gKyAwO1xyXG4gICAgICAgICAgICAgICAgdGhpcy56b29tRGVsYXkgPSA1O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2V0Q2FudmFzVHJhbnNmb3JtKGVyYXNlOiBib29sZWFuKSB7XHJcbiAgICAgICAgdGhpcy5hY3RvckN0eC5zZXRUcmFuc2Zvcm0oXHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFpvb20sXHJcbiAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFpvb20sXHJcbiAgICAgICAgICAgICgtdGhpcy5jdXJyZW50U2NyZWVuQ2VudGVyLnggKyB0aGlzLnByZXZpb3VzV2luZG93U2l6ZS53aWR0aCAvIHRoaXMuY3VycmVudFpvb20gLyAyKSAqIHRoaXMuY3VycmVudFpvb20sXHJcbiAgICAgICAgICAgICgtdGhpcy5jdXJyZW50U2NyZWVuQ2VudGVyLnkgKyB0aGlzLnByZXZpb3VzV2luZG93U2l6ZS5oZWlnaHQgLyB0aGlzLmN1cnJlbnRab29tIC8gMikgKiB0aGlzLmN1cnJlbnRab29tLFxyXG4gICAgICAgICk7XHJcbiAgICAgICAgaWYgKGVyYXNlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYWN0b3JDdHguY2xlYXJSZWN0KFxyXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50U2NyZWVuQ2VudGVyLnggLSB0aGlzLnByZXZpb3VzV2luZG93U2l6ZS53aWR0aCAvIHRoaXMuY3VycmVudFpvb20gLyAyLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50U2NyZWVuQ2VudGVyLnkgLSB0aGlzLnByZXZpb3VzV2luZG93U2l6ZS5oZWlnaHQgLyB0aGlzLmN1cnJlbnRab29tIC8gMixcclxuICAgICAgICAgICAgICAgIHRoaXMucHJldmlvdXNXaW5kb3dTaXplLndpZHRoIC8gdGhpcy5jdXJyZW50Wm9vbSxcclxuICAgICAgICAgICAgICAgIHRoaXMucHJldmlvdXNXaW5kb3dTaXplLmhlaWdodCAvIHRoaXMuY3VycmVudFpvb20sXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmN1cnJlbnRTY3JlZW5TaXplID0geyB3aWR0aDogdGhpcy5wcmV2aW91c1dpbmRvd1NpemUud2lkdGggLyB0aGlzLmN1cnJlbnRab29tLCBoZWlnaHQ6IHRoaXMucHJldmlvdXNXaW5kb3dTaXplLmhlaWdodCAvIHRoaXMuY3VycmVudFpvb20gfTtcclxuICAgICAgICB0aGlzLmN1cnJlbnRTY3JlZW5Qb3MgPSB7XHJcbiAgICAgICAgICAgIHg6IHRoaXMuY3VycmVudFNjcmVlbkNlbnRlci54IC0gdGhpcy5jdXJyZW50U2NyZWVuU2l6ZS53aWR0aCAvIDIsXHJcbiAgICAgICAgICAgIHk6IHRoaXMuY3VycmVudFNjcmVlbkNlbnRlci55IC0gdGhpcy5jdXJyZW50U2NyZWVuU2l6ZS5oZWlnaHQgLyAyLFxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSByZW5kZXJBY3RvcnMoZWxhcHNlZFRpbWU6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuZ2xvYmFsQ2xpZW50T2JqZWN0cy5kb29kYWRzLmZvckVhY2goKGRvb2RhZCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZG9vZGFkLmlmU2hvdWxkUmVuZGVyKHRoaXMuY3VycmVudFNjcmVlblNpemUsIHRoaXMuY3VycmVudFNjcmVlblBvcykpIHtcclxuICAgICAgICAgICAgICAgIGRvb2RhZC5yZW5kZXIoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuZ2xvYmFsQ2xpZW50T2JqZWN0cy5mbG9vci5yZW5kZXIodGhpcy5jdXJyZW50U2NyZWVuUG9zLCB0aGlzLmN1cnJlbnRTY3JlZW5TaXplKTtcclxuICAgICAgICB0aGlzLmdsb2JhbENsaWVudEFjdG9ycy5wbGF5ZXJzLmZvckVhY2goKHBsYXllcikgPT4ge1xyXG4gICAgICAgICAgICBpZiAocGxheWVyLmdldEFjdG9ySWQoKSAhPT0gdGhpcy5pZCkgcGxheWVyLnJlbmRlcigpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuZ2FtZVBsYXllci5yZW5kZXIoKTtcclxuICAgICAgICB0aGlzLmdsb2JhbENsaWVudEFjdG9ycy5wbGF5ZXJzLmZvckVhY2goKHBsYXllcikgPT4ge1xyXG4gICAgICAgICAgICBpZiAocGxheWVyLmdldEFjdG9ySWQoKSAhPT0gdGhpcy5pZCkgcGxheWVyLnJlbmRlckhlYWx0aCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuZ2FtZVBsYXllci5yZW5kZXJIZWFsdGgoKTtcclxuXHJcbiAgICAgICAgdGhpcy5nYW1lLnBhcnRpY2xlU3lzdGVtLnVwZGF0ZUFuZFJlbmRlcihlbGFwc2VkVGltZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB1cGRhdGVTbGlkZXJYKCkge1xyXG4gICAgICAgIHRoaXMuY3VycmVudFNjcmVlbkNlbnRlci54ID0gKHRoaXMuY3VycmVudFNjcmVlbkNlbnRlci54ICogNCArIHRoaXMudGFyZ2V0U2NyZWVuQ2VudGVyLngpIC8gNTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNsaXBYUGFuKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRTY3JlZW5Qb3MueCArIHRoaXMuY3VycmVudFNjcmVlblNpemUud2lkdGggPiB0aGlzLmNvbmZpZy54U2l6ZSkge1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRTY3JlZW5DZW50ZXIueCArPSB0aGlzLmNvbmZpZy54U2l6ZSAtIHRoaXMuY3VycmVudFNjcmVlblBvcy54IC0gdGhpcy5jdXJyZW50U2NyZWVuU2l6ZS53aWR0aDtcclxuICAgICAgICAgICAgdGhpcy5zZXRDYW52YXNUcmFuc2Zvcm0oZmFsc2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50U2NyZWVuUG9zLnggPCAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFNjcmVlbkNlbnRlci54IC09IHRoaXMuY3VycmVudFNjcmVlblBvcy54O1xyXG4gICAgICAgICAgICB0aGlzLnNldENhbnZhc1RyYW5zZm9ybShmYWxzZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdXBkYXRlU2xpZGVyWSgpIHtcclxuICAgICAgICB0aGlzLmN1cnJlbnRTY3JlZW5DZW50ZXIueSA9ICh0aGlzLmN1cnJlbnRTY3JlZW5DZW50ZXIueSAqIDQgKyAodGhpcy50YXJnZXRTY3JlZW5DZW50ZXIueSAtIHRoaXMucHJldmlvdXNXaW5kb3dTaXplLmhlaWdodCAvIDEwKSkgLyA1O1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgYXR0ZW1wdFVwZGF0ZUNhbnZhc1NpemVzKCkge1xyXG4gICAgICAgIGlmIChNYXRoLm1pbih3aW5kb3cuaW5uZXJXaWR0aCwgMTkyMCkgIT09IHRoaXMucHJldmlvdXNXaW5kb3dTaXplLndpZHRoKSB7XHJcbiAgICAgICAgICAgIHRoaXMucHJldmlvdXNXaW5kb3dTaXplLndpZHRoID0gTWF0aC5taW4od2luZG93LmlubmVyV2lkdGgsIDE5MjApO1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUNhbnZhc1dpZHRoKHRoaXMuYWN0b3JDYW52YXMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHdpbmRvdy5pbm5lckhlaWdodCAhPT0gdGhpcy5wcmV2aW91c1dpbmRvd1NpemUuaGVpZ2h0KSB7XHJcbiAgICAgICAgICAgIGxldCByYXRpbzogbnVtYmVyID0gd2luZG93LmlubmVyV2lkdGggLyAxOTIwO1xyXG4gICAgICAgICAgICBpZiAocmF0aW8gPj0gMSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50U2NyZWVuUmF0aW8gPSByYXRpbztcclxuICAgICAgICAgICAgICAgIHRoaXMucHJldmlvdXNXaW5kb3dTaXplLmhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodCAvIHJhdGlvO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50U2NyZWVuUmF0aW8gPSAxO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wcmV2aW91c1dpbmRvd1NpemUuaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlQ2FudmFzSGVpZ2h0KHRoaXMuYWN0b3JDYW52YXMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHVwZGF0ZUNhbnZhc1dpZHRoKGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQpIHtcclxuICAgICAgICBjYW52YXMuc3R5bGUud2lkdGggPSBcIjEwMHZ3XCI7XHJcbiAgICAgICAgY2FudmFzLndpZHRoID0gdGhpcy5wcmV2aW91c1dpbmRvd1NpemUud2lkdGg7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHVwZGF0ZUNhbnZhc0hlaWdodChjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50KSB7XHJcbiAgICAgICAgY2FudmFzLnN0eWxlLmhlaWdodCA9IFwiMTAwdmhcIjtcclxuICAgICAgICBjYW52YXMuaGVpZ2h0ID0gdGhpcy5wcmV2aW91c1dpbmRvd1NpemUuaGVpZ2h0O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzY3JlZW5OdWRnZShmb3JjZTogVmVjdG9yKSB7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50U2NyZWVuQ2VudGVyLnggLT0gZm9yY2UueDtcclxuICAgICAgICB0aGlzLmN1cnJlbnRTY3JlZW5DZW50ZXIueSAtPSBmb3JjZS55O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzY3JlZW5ab29tKG11bHRpcGxpZXI6IG51bWJlciwgc3BlZWQ6IG51bWJlciA9IDQpIHtcclxuICAgICAgICB0aGlzLnRhcmdldFpvb20gKj0gbXVsdGlwbGllcjtcclxuICAgICAgICB0aGlzLnpvb21EZWxheSA9IHNwZWVkO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRDYW52YXNQb3NGcm9tU2NyZWVuKHBvc2l0aW9uOiBWZWN0b3IpOiBWZWN0b3Ige1xyXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRTY3JlZW5SYXRpbyA9PT0gMSkge1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgeDogcG9zaXRpb24ueCAvIHRoaXMuY3VycmVudFpvb20gKyB0aGlzLmN1cnJlbnRTY3JlZW5Qb3MueCxcclxuICAgICAgICAgICAgICAgIHk6IHBvc2l0aW9uLnkgLyB0aGlzLmN1cnJlbnRab29tICsgdGhpcy5jdXJyZW50U2NyZWVuUG9zLnksXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIHg6IHBvc2l0aW9uLnggLyAodGhpcy5jdXJyZW50Wm9vbSAqIHRoaXMuY3VycmVudFNjcmVlblJhdGlvKSArIHRoaXMuY3VycmVudFNjcmVlblBvcy54LFxyXG4gICAgICAgICAgICAgICAgeTogcG9zaXRpb24ueSAvICh0aGlzLmN1cnJlbnRab29tICogdGhpcy5jdXJyZW50U2NyZWVuUmF0aW8pICsgdGhpcy5jdXJyZW50U2NyZWVuUG9zLnksXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcm91bmRSZWN0KGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELCB4OiBudW1iZXIsIHk6IG51bWJlciwgd2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIsIHJhZGl1czogbnVtYmVyLCBmaWxsOiBib29sZWFuLCBzdHJva2U6IGJvb2xlYW4pIHtcclxuICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgIGN0eC5tb3ZlVG8oeCArIHJhZGl1cywgeSk7XHJcblxyXG4gICAgY3R4LmxpbmVUbyh4ICsgd2lkdGggLSByYWRpdXMsIHkpO1xyXG4gICAgY3R4LnF1YWRyYXRpY0N1cnZlVG8oeCArIHdpZHRoLCB5LCB4ICsgd2lkdGgsIHkgKyByYWRpdXMpO1xyXG5cclxuICAgIGN0eC5saW5lVG8oeCArIHdpZHRoLCB5ICsgaGVpZ2h0IC0gcmFkaXVzKTtcclxuICAgIGN0eC5xdWFkcmF0aWNDdXJ2ZVRvKHggKyB3aWR0aCwgeSArIGhlaWdodCwgeCArIHdpZHRoIC0gcmFkaXVzLCB5ICsgaGVpZ2h0KTtcclxuXHJcbiAgICBjdHgubGluZVRvKHggKyByYWRpdXMsIHkgKyBoZWlnaHQpO1xyXG4gICAgY3R4LnF1YWRyYXRpY0N1cnZlVG8oeCwgeSArIGhlaWdodCwgeCwgeSArIGhlaWdodCAtIHJhZGl1cyk7XHJcblxyXG4gICAgY3R4LmxpbmVUbyh4LCB5ICsgcmFkaXVzKTtcclxuICAgIGN0eC5xdWFkcmF0aWNDdXJ2ZVRvKHgsIHksIHggKyByYWRpdXMsIHkpO1xyXG5cclxuICAgIGN0eC5jbG9zZVBhdGgoKTtcclxuICAgIGlmIChmaWxsKSB7XHJcbiAgICAgICAgY3R4LmZpbGwoKTtcclxuICAgIH1cclxuICAgIGlmIChzdHJva2UpIHtcclxuICAgICAgICBjdHguc3Ryb2tlKCk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgZ2V0UmFuZG9tQ29sb3IgfSBmcm9tIFwiLi4vZ2V0cmFuZG9tY29sb3JcIjtcclxuaW1wb3J0IHsgRGFnZ2Vyc1NwZWMsIEhhbW1lclNwZWMsIFN3b3JkU3BlYyB9IGZyb20gXCIuLi9vYmplY3RzL25ld0FjdG9ycy9hY3RvclwiO1xyXG5pbXBvcnQgeyBDbGFzc1R5cGUgfSBmcm9tIFwiLi4vb2JqZWN0cy9uZXdBY3RvcnMvc2VydmVyQWN0b3JzL3NlcnZlclBsYXllci9zZXJ2ZXJQbGF5ZXJcIjtcclxuaW1wb3J0IHsgR2FtZSB9IGZyb20gXCIuL2dhbWVcIjtcclxuaW1wb3J0IHsgYXNzZXRNYW5hZ2VyIH0gZnJvbSBcIi4vZ2FtZVJlbmRlci9hc3NldG1hbmFnZXJcIjtcclxuaW1wb3J0IHsgaW5pdENvbW1lbnRzIH0gZnJvbSBcIi4vbWFpbk1lbnUvY29tbWVudHNcIjtcclxuaW1wb3J0IHsgaW5pdFNldHRpbmdzQnV0dG9uIH0gZnJvbSBcIi4vbWFpbk1lbnUvc2V0dGluZ3NcIjtcclxuaW1wb3J0IHsgU2VydmVyVGFsa2VyIH0gZnJvbSBcIi4vc2VydmVydGFsa2VyXCI7XHJcbmltcG9ydCB7IGZpbGxQYXRjaE5vdGVzRGl2LCBzYWZlR2V0RWxlbWVudEJ5SWQgfSBmcm9tIFwiLi91dGlsXCI7XHJcbi8qY29uc3QgcGFydGljbGVTbGlkZXIgPSBzYWZlR2V0RWxlbWVudEJ5SWQoXCJwYXJ0aWNsZXNcIik7XHJcbmNvbnN0IHBhcnRpY2xlQW1vdW50ID0gc2FmZUdldEVsZW1lbnRCeUlkKFwicGFydGljbGVBbW91bnRcIik7XHJcblxyXG5wYXJ0aWNsZVNsaWRlci5vbmlucHV0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgcGFydGljbGVBbW91bnQuaW5uZXJIVE1MID0gKHBhcnRpY2xlU2xpZGVyIGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlICsgXCIlXCI7XHJcbn07Ki9cclxuXHJcbnZhciBjbGFzc0luZm8gPSB7XHJcbiAgICBzd29yZDogeyBsZXZlbDogMSwgc3BlYzogMCB9LFxyXG4gICAgZGFnZ2VyczogeyBsZXZlbDogMSwgc3BlYzogMCB9LFxyXG4gICAgaGFtbWVyOiB7IGxldmVsOiAxLCBzcGVjOiAwIH0sXHJcbn07XHJcblxyXG52YXIgY2xhc3NUeXBlOiBDbGFzc1R5cGUgPSBcInN3b3JkXCI7XHJcbnZhciB0ZWFtOiBudW1iZXIgPSAxO1xyXG5zYWZlR2V0RWxlbWVudEJ5SWQoXCJ0ZWFtTWVudVwiKS5vbmNsaWNrID0gKCkgPT4gdG9nZ2xlVGVhbSgpO1xyXG5cclxudmFyIHZhbHVlOiBzdHJpbmcgfCBudWxsID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJuYW1lXCIpO1xyXG5pZiAodmFsdWUpIChzYWZlR2V0RWxlbWVudEJ5SWQoXCJuYW1lXCIpIGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlID0gdmFsdWU7XHJcbnZhciB2YWx1ZTogc3RyaW5nIHwgbnVsbCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiY29sb3JcIik7XHJcbmlmICh2YWx1ZSkgKHNhZmVHZXRFbGVtZW50QnlJZChcImNvbG9yXCIpIGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlID0gdmFsdWU7XHJcbnZhciB2YWx1ZTogc3RyaW5nIHwgbnVsbCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwidGVhbVwiKTtcclxuaWYgKHZhbHVlICYmIHBhcnNlSW50KHZhbHVlKSA9PT0gMikgdG9nZ2xlVGVhbSgpO1xyXG52YXIgdmFsdWU6IHN0cmluZyB8IG51bGwgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImNsYXNzVHlwZVwiKTtcclxuaWYgKHZhbHVlKSB7XHJcbiAgICBpZiAodmFsdWUgPT09IFwiZGFnZ2Vyc1wiKSBjaGFuZ2VDbGFzcyhcImRhZ2dlcnNcIik7XHJcbiAgICBlbHNlIGlmICh2YWx1ZSA9PT0gXCJoYW1tZXJcIikgY2hhbmdlQ2xhc3MoXCJoYW1tZXJcIik7XHJcbiAgICBlbHNlIGNoYW5nZUNsYXNzKFwic3dvcmRcIik7XHJcbn1cclxudXBkYXRlQ2xhc3NMZXZlbHMoKTtcclxuXHJcbmZ1bmN0aW9uIHVwZGF0ZUNsYXNzTGV2ZWxzKCkge1xyXG4gICAgdmFsdWUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInN3b3JkTGV2ZWxcIik7XHJcbiAgICBpZiAodmFsdWUpIGNsYXNzSW5mby5zd29yZC5sZXZlbCA9IHBhcnNlSW50KHZhbHVlKTtcclxuICAgIHZhbHVlID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJzd29yZFNwZWNcIik7XHJcbiAgICBpZiAodmFsdWUpIGNsYXNzSW5mby5zd29yZC5zcGVjID0gcGFyc2VJbnQodmFsdWUpO1xyXG4gICAgdmFsdWUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImRhZ2dlcnNMZXZlbFwiKTtcclxuICAgIGlmICh2YWx1ZSkgY2xhc3NJbmZvLmRhZ2dlcnMubGV2ZWwgPSBwYXJzZUludCh2YWx1ZSk7XHJcbiAgICB2YWx1ZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiZGFnZ2Vyc1NwZWNcIik7XHJcbiAgICBpZiAodmFsdWUpIGNsYXNzSW5mby5kYWdnZXJzLnNwZWMgPSBwYXJzZUludCh2YWx1ZSk7XHJcbiAgICB2YWx1ZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiaGFtbWVyTGV2ZWxcIik7XHJcbiAgICBpZiAodmFsdWUpIGNsYXNzSW5mby5oYW1tZXIubGV2ZWwgPSBwYXJzZUludCh2YWx1ZSk7XHJcbiAgICB2YWx1ZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiaGFtbWVyU3BlY1wiKTtcclxuICAgIGlmICh2YWx1ZSkgY2xhc3NJbmZvLmhhbW1lci5zcGVjID0gcGFyc2VJbnQodmFsdWUpO1xyXG5cclxuICAgIHNhZmVHZXRFbGVtZW50QnlJZChcInN3b3JkQ2xhc3NMZXZlbFwiKS5pbm5lckhUTUwgPSBTdHJpbmcoY2xhc3NJbmZvLnN3b3JkLmxldmVsKTtcclxuICAgIHNhZmVHZXRFbGVtZW50QnlJZChcImRhZ2dlcnNDbGFzc0xldmVsXCIpLmlubmVySFRNTCA9IFN0cmluZyhjbGFzc0luZm8uZGFnZ2Vycy5sZXZlbCk7XHJcbiAgICBzYWZlR2V0RWxlbWVudEJ5SWQoXCJoYW1tZXJDbGFzc0xldmVsXCIpLmlubmVySFRNTCA9IFN0cmluZyhjbGFzc0luZm8uaGFtbWVyLmxldmVsKTtcclxufVxyXG5cclxudmFyIGlmSW1hZ2VzSGF2ZUJlZW5Mb2FkZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuc2FmZUdldEVsZW1lbnRCeUlkKFwic3RhcnRHYW1lXCIpLm9ubW91c2V1cCA9IGFzeW5jICgpID0+IHtcclxuICAgIGhpZGVNZW51RWxlbWVudHMoKTtcclxuICAgIHNhdmVMb2NhbERhdGEoKTtcclxuXHJcbiAgICB2YXIgbmFtZTogc3RyaW5nID0gKHNhZmVHZXRFbGVtZW50QnlJZChcIm5hbWVcIikgYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWU7XHJcbiAgICBpZiAobmFtZSA9PT0gXCJcIiB8fCBuYW1lLnNwbGl0KFwiIFwiKS5qb2luKFwiXCIpID09PSBcIlwiKSBuYW1lID0gXCJQbGF5ZXJcIjtcclxuXHJcbiAgICBsZXQgbGV2ZWw6IG51bWJlciwgc3BlYzogbnVtYmVyO1xyXG4gICAgc3dpdGNoIChjbGFzc1R5cGUpIHtcclxuICAgICAgICBjYXNlIFwiZGFnZ2Vyc1wiOlxyXG4gICAgICAgICAgICBsZXZlbCA9IGNsYXNzSW5mby5kYWdnZXJzLmxldmVsO1xyXG4gICAgICAgICAgICBzcGVjID0gY2xhc3NJbmZvLmRhZ2dlcnMuc3BlYztcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBcImhhbW1lclwiOlxyXG4gICAgICAgICAgICBsZXZlbCA9IGNsYXNzSW5mby5oYW1tZXIubGV2ZWw7XHJcbiAgICAgICAgICAgIHNwZWMgPSBjbGFzc0luZm8uaGFtbWVyLnNwZWM7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIGxldmVsID0gY2xhc3NJbmZvLnN3b3JkLmxldmVsO1xyXG4gICAgICAgICAgICBzcGVjID0gY2xhc3NJbmZvLnN3b3JkLnNwZWM7XHJcbiAgICB9XHJcblxyXG4gICAgYXdhaXQgYXNzZXRNYW5hZ2VyLmxvYWRBbGxOZWNlc3NhcnlJbWFnZXMoKTtcclxuICAgIGNvbnN0IHNlcnZlclRhbGtlciA9IG5ldyBTZXJ2ZXJUYWxrZXIoe1xyXG4gICAgICAgIG5hbWUsXHJcbiAgICAgICAgY29sb3I6IChzYWZlR2V0RWxlbWVudEJ5SWQoXCJjb2xvclwiKSBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZSxcclxuICAgICAgICB0ZWFtLFxyXG4gICAgICAgIGNsYXNzOiBjbGFzc1R5cGUsXHJcbiAgICAgICAgY2xhc3NMZXZlbDogbGV2ZWwsXHJcbiAgICAgICAgY2xhc3NTcGVjOiBzcGVjLFxyXG4gICAgfSk7XHJcbiAgICBjb25zdCB7IGlkLCBpbmZvLCBjb25maWcgfSA9IGF3YWl0IHNlcnZlclRhbGtlci5zZXJ2ZXJUYWxrZXJSZWFkeTtcclxuICAgIGNvbnN0IGdhbWUgPSBuZXcgR2FtZShpbmZvLCBjb25maWcsIGlkLCBzZXJ2ZXJUYWxrZXIsIDUwKTtcclxuICAgIGdhbWUuc3RhcnQoKTtcclxuICAgIC8vZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnJlcXVlc3RGdWxsc2NyZWVuKCk7XHJcbiAgICBnYW1lRGl2LnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XHJcbiAgICBzYWZlR2V0RWxlbWVudEJ5SWQoXCJlbmRcIikub25jbGljayA9IGFzeW5jICgpID0+IHtcclxuICAgICAgICBnYW1lLmVuZCgpO1xyXG4gICAgICAgIGdhbWVEaXYuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgICAgIHVwZGF0ZUNsYXNzTGV2ZWxzKCk7XHJcbiAgICAgICAgLy9kb2N1bWVudC5leGl0RnVsbHNjcmVlbigpO1xyXG4gICAgICAgIHNob3dNZW51RWxlbWVudHMoKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9O1xyXG59O1xyXG5cclxudmFyIG1lbnVEaXY6IEhUTUxFbGVtZW50ID0gc2FmZUdldEVsZW1lbnRCeUlkKFwibWVudURpdlwiKTtcclxudmFyIG9wdGlvbnNEaXY6IEhUTUxFbGVtZW50ID0gc2FmZUdldEVsZW1lbnRCeUlkKFwib3B0aW9uc0RpdlwiKTtcclxudmFyIGdhbWVEaXY6IEhUTUxFbGVtZW50ID0gc2FmZUdldEVsZW1lbnRCeUlkKFwiZ2FtZURpdlwiKTtcclxuZ2FtZURpdi5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcblxyXG5mdW5jdGlvbiBoaWRlTWVudUVsZW1lbnRzKCkge1xyXG4gICAgbWVudURpdi5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICBvcHRpb25zRGl2LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgIC8vZ2FtZURpdi5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiOyBpbmNsdWRlZCBpbiBzdGFydGdhbWUgYnV0dG9uXHJcbn1cclxuZnVuY3Rpb24gc2hvd01lbnVFbGVtZW50cygpIHtcclxuICAgIC8vZ2FtZURpdi5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7IGluY2x1ZGVkIGluIHN0YXJ0Z2FtZSBidXR0b25cclxuICAgIG1lbnVEaXYuc3R5bGUuZGlzcGxheSA9IFwiZmxleFwiO1xyXG4gICAgb3B0aW9uc0Rpdi5zdHlsZS5kaXNwbGF5ID0gXCJmbGV4XCI7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHRvZ2dsZVRlYW0oKSB7XHJcbiAgICBpZiAodGVhbSA9PT0gMSkge1xyXG4gICAgICAgIHNhZmVHZXRFbGVtZW50QnlJZChcInRlYW0xXCIpLmNsYXNzTGlzdC5yZW1vdmUoXCJzZWxlY3RlZFRlYW1cIik7XHJcbiAgICAgICAgc2FmZUdldEVsZW1lbnRCeUlkKFwidGVhbTJcIikuY2xhc3NMaXN0LmFkZChcInNlbGVjdGVkVGVhbVwiKTtcclxuICAgICAgICB0ZWFtID0gMjtcclxuICAgIH0gZWxzZSBpZiAodGVhbSA9PT0gMikge1xyXG4gICAgICAgIHNhZmVHZXRFbGVtZW50QnlJZChcInRlYW0xXCIpLmNsYXNzTGlzdC5hZGQoXCJzZWxlY3RlZFRlYW1cIik7XHJcbiAgICAgICAgc2FmZUdldEVsZW1lbnRCeUlkKFwidGVhbTJcIikuY2xhc3NMaXN0LnJlbW92ZShcInNlbGVjdGVkVGVhbVwiKTtcclxuICAgICAgICB0ZWFtID0gMTtcclxuICAgIH1cclxufVxyXG5cclxuc2FmZUdldEVsZW1lbnRCeUlkKFwic3dvcmRcIikub25jbGljayA9ICgpID0+IGNoYW5nZUNsYXNzKFwic3dvcmRcIik7XHJcbnNhZmVHZXRFbGVtZW50QnlJZChcImRhZ2dlcnNcIikub25jbGljayA9ICgpID0+IGNoYW5nZUNsYXNzKFwiZGFnZ2Vyc1wiKTtcclxuc2FmZUdldEVsZW1lbnRCeUlkKFwiaGFtbWVyXCIpLm9uY2xpY2sgPSAoKSA9PiBjaGFuZ2VDbGFzcyhcImhhbW1lclwiKTtcclxuZnVuY3Rpb24gY2hhbmdlQ2xhc3MoY2xhc3NBcmc6IENsYXNzVHlwZSkge1xyXG4gICAgc2FmZUdldEVsZW1lbnRCeUlkKFwic3dvcmRcIikuY2xhc3NMaXN0LnJlbW92ZShcInNlbGVjdGVkXCIpO1xyXG4gICAgc2FmZUdldEVsZW1lbnRCeUlkKFwiZGFnZ2Vyc1wiKS5jbGFzc0xpc3QucmVtb3ZlKFwic2VsZWN0ZWRcIik7XHJcbiAgICBzYWZlR2V0RWxlbWVudEJ5SWQoXCJoYW1tZXJcIikuY2xhc3NMaXN0LnJlbW92ZShcInNlbGVjdGVkXCIpO1xyXG5cclxuICAgIHNhZmVHZXRFbGVtZW50QnlJZChjbGFzc0FyZykuY2xhc3NMaXN0LmFkZChcInNlbGVjdGVkXCIpO1xyXG5cclxuICAgIGNsYXNzVHlwZSA9IGNsYXNzQXJnO1xyXG59XHJcblxyXG5mdW5jdGlvbiBzYXZlTG9jYWxEYXRhKCkge1xyXG4gICAgbGV0IGxvY2FsbHlTdG9yZWROYW1lOiBzdHJpbmcgPSAoc2FmZUdldEVsZW1lbnRCeUlkKFwibmFtZVwiKSBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZTtcclxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwibmFtZVwiLCBsb2NhbGx5U3RvcmVkTmFtZSk7XHJcblxyXG4gICAgbGV0IGxvY2FsbHlTdG9yZWRUZWFtOiBudW1iZXIgPSB0ZWFtO1xyXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJ0ZWFtXCIsIFN0cmluZyhsb2NhbGx5U3RvcmVkVGVhbSkpO1xyXG5cclxuICAgIGxldCBsb2NhbGx5U3RvcmVkQ29sb3I6IHN0cmluZyA9IChzYWZlR2V0RWxlbWVudEJ5SWQoXCJjb2xvclwiKSBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZTtcclxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiY29sb3JcIiwgbG9jYWxseVN0b3JlZENvbG9yKTtcclxuXHJcbiAgICAvKmxldCBsb2NhbGx5U3RvcmVkUGFydGljbGVzOiBzdHJpbmcgPSAoc2FmZUdldEVsZW1lbnRCeUlkKFwiaWRcIikgYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwicGFydGljbGVzXCIsIGZpZWxkLnZhbHVlKTsqL1xyXG5cclxuICAgIGxldCBsb2NhbGx5U3RvcmVkQ2xhc3M6IHN0cmluZztcclxuICAgIGlmIChjbGFzc1R5cGUgPT09IFwic3dvcmRcIikgbG9jYWxseVN0b3JlZENsYXNzID0gXCJzd29yZFwiO1xyXG4gICAgZWxzZSBpZiAoY2xhc3NUeXBlID09PSBcImRhZ2dlcnNcIikgbG9jYWxseVN0b3JlZENsYXNzID0gXCJkYWdnZXJzXCI7XHJcbiAgICBlbHNlIGlmIChjbGFzc1R5cGUgPT09IFwiaGFtbWVyXCIpIGxvY2FsbHlTdG9yZWRDbGFzcyA9IFwiaGFtbWVyXCI7XHJcbiAgICBlbHNlIHRocm93IG5ldyBFcnJvcihcInVua25vd24gY2xhc3MgdHlwZSBpbnB1dCAke2NsYXNzVHlwZX1cIik7XHJcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImNsYXNzVHlwZVwiLCBsb2NhbGx5U3RvcmVkQ2xhc3MpO1xyXG59XHJcblxyXG4vKmNsZWFyU3RvcmFnZUJ1dHRvbi5vbmNsaWNrID0gKCkgPT4ge1xyXG4gICAgbG9jYWxTdG9yYWdlLmNsZWFyKCk7XHJcbn07Ki9cclxuXHJcbnZhciBzY3JlZW5Db3ZlcjogSFRNTEVsZW1lbnQgPSBzYWZlR2V0RWxlbWVudEJ5SWQoXCJzY3JlZW5Db3ZlclwiKTtcclxuXHJcbmluaXRTZXR0aW5nc0J1dHRvbihzY3JlZW5Db3Zlcik7XHJcbmluaXRDb21tZW50cyhzY3JlZW5Db3Zlcik7XHJcblxyXG52YXIgaW5mb3JtYXRpb25EaXY6IEhUTUxFbGVtZW50ID0gc2FmZUdldEVsZW1lbnRCeUlkKFwiaW5mb3JtYXRpb25EaXZcIik7XHJcbnZhciBpbmZvT3B0aW9uOiBIVE1MRWxlbWVudCA9IHNhZmVHZXRFbGVtZW50QnlJZChcImluZm9PcHRpb25cIik7XHJcbnNhZmVHZXRFbGVtZW50QnlJZChcImluZm9ybWF0aW9uQnV0dG9uXCIpLm9uY2xpY2sgPSAoKSA9PiB7XHJcbiAgICBpbmZvT3B0aW9uLmNsYXNzTGlzdC5hZGQoXCJzZWxlY3RlZFwiKTtcclxuICAgIGluZm9ybWF0aW9uRGl2LnN0eWxlLmRpc3BsYXkgPSBcImZsZXhcIjtcclxuICAgIHNjcmVlbkNvdmVyLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XHJcblxyXG4gICAgc2NyZWVuQ292ZXIuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGNsb3NlSW5mb0Rpdik7XHJcblxyXG4gICAgZnVuY3Rpb24gY2xvc2VJbmZvRGl2KCkge1xyXG4gICAgICAgIHNjcmVlbkNvdmVyLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBjbG9zZUluZm9EaXYpO1xyXG5cclxuICAgICAgICBpbmZvcm1hdGlvbkRpdi5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICAgICAgc2NyZWVuQ292ZXIuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgICAgIGluZm9PcHRpb24uY2xhc3NMaXN0LnJlbW92ZShcInNlbGVjdGVkXCIpO1xyXG4gICAgfVxyXG59O1xyXG5cclxudmFyIHBhdGNoTm90ZXNEaXY6IEhUTUxFbGVtZW50ID0gc2FmZUdldEVsZW1lbnRCeUlkKFwicGF0Y2hOb3Rlc0RpdlwiKTtcclxudmFyIHBhdGNoTm90ZXNPcHRpb246IEhUTUxFbGVtZW50ID0gc2FmZUdldEVsZW1lbnRCeUlkKFwicGF0Y2hOb3Rlc09wdGlvblwiKTtcclxuZmlsbFBhdGNoTm90ZXNEaXYocGF0Y2hOb3Rlc0Rpdik7XHJcbnNhZmVHZXRFbGVtZW50QnlJZChcInBhdGNoTm90ZXNCdXR0b25cIikub25jbGljayA9ICgpID0+IHtcclxuICAgIHBhdGNoTm90ZXNPcHRpb24uY2xhc3NMaXN0LmFkZChcInNlbGVjdGVkXCIpO1xyXG4gICAgcGF0Y2hOb3Rlc0Rpdi5zdHlsZS5kaXNwbGF5ID0gXCJmbGV4XCI7XHJcbiAgICBzY3JlZW5Db3Zlci5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xyXG5cclxuICAgIHNjcmVlbkNvdmVyLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBjbG9zZVBhdGNoTm90ZXNEaXYpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGNsb3NlUGF0Y2hOb3Rlc0RpdigpIHtcclxuICAgICAgICBzY3JlZW5Db3Zlci5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgY2xvc2VQYXRjaE5vdGVzRGl2KTtcclxuXHJcbiAgICAgICAgcGF0Y2hOb3Rlc0Rpdi5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICAgICAgc2NyZWVuQ292ZXIuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgICAgIHBhdGNoTm90ZXNPcHRpb24uY2xhc3NMaXN0LnJlbW92ZShcInNlbGVjdGVkXCIpO1xyXG4gICAgfVxyXG59O1xyXG52YXIgdGlwc0J1dHRvblRvZ2dsZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuc2FmZUdldEVsZW1lbnRCeUlkKFwidG9nZ2xlVGlwc0J1dHRvblwiKS5vbmNsaWNrID0gKCkgPT4ge307XHJcbiIsImltcG9ydCB7IHNhZmVHZXRFbGVtZW50QnlJZCB9IGZyb20gXCIuLi91dGlsXCI7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaW5pdENvbW1lbnRzKHNjcmVlbkNvdmVyOiBIVE1MRWxlbWVudCkge1xyXG4gICAgdmFyIGNvbW1lbnREaXY6IEhUTUxFbGVtZW50ID0gc2FmZUdldEVsZW1lbnRCeUlkKFwiY29tbWVudERpdlwiKTtcclxuICAgIHZhciBlbWFpbE9wdGlvbjogSFRNTEVsZW1lbnQgPSBzYWZlR2V0RWxlbWVudEJ5SWQoXCJlbWFpbE9wdGlvblwiKTtcclxuXHJcbiAgICBzYWZlR2V0RWxlbWVudEJ5SWQoXCJjb21tZW50QnV0dG9uXCIpLm9uY2xpY2sgPSAoKSA9PiB7XHJcbiAgICAgICAgZW1haWxPcHRpb24uY2xhc3NMaXN0LmFkZChcInNlbGVjdGVkXCIpO1xyXG4gICAgICAgIGNvbW1lbnREaXYuc3R5bGUuZGlzcGxheSA9IFwiZmxleFwiO1xyXG4gICAgICAgIHNjcmVlbkNvdmVyLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XHJcblxyXG4gICAgICAgIHNjcmVlbkNvdmVyLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBjbG9zZUNvbW1lbnREaXYpO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBjbG9zZUNvbW1lbnREaXYoKSB7XHJcbiAgICAgICAgICAgIHNjcmVlbkNvdmVyLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBjbG9zZUNvbW1lbnREaXYpO1xyXG5cclxuICAgICAgICAgICAgY29tbWVudERpdi5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICAgICAgICAgIHNjcmVlbkNvdmVyLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgICAgICAgICAgZW1haWxPcHRpb24uY2xhc3NMaXN0LnJlbW92ZShcInNlbGVjdGVkXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn1cclxuIiwiaW1wb3J0IHsgc2FmZUdldEVsZW1lbnRCeUlkIH0gZnJvbSBcIi4uL3V0aWxcIjtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpbml0U2V0dGluZ3NCdXR0b24oc2NyZWVuQ292ZXI6IEhUTUxFbGVtZW50KSB7XHJcbiAgICB2YXIgc2V0dGluZ3NEaXY6IEhUTUxFbGVtZW50ID0gc2FmZUdldEVsZW1lbnRCeUlkKFwic2V0dGluZ3NEaXZcIik7XHJcbiAgICB2YXIgc2V0dGluZ3NPcHRpb246IEhUTUxFbGVtZW50ID0gc2FmZUdldEVsZW1lbnRCeUlkKFwic2V0dGluZ3NPcHRpb25cIik7XHJcbiAgICBzYWZlR2V0RWxlbWVudEJ5SWQoXCJzZXR0aW5nc0J1dHRvblwiKS5vbmNsaWNrID0gKCkgPT4ge1xyXG4gICAgICAgIHNldHRpbmdzT3B0aW9uLmNsYXNzTGlzdC5hZGQoXCJzZWxlY3RlZFwiKTtcclxuICAgICAgICBzZXR0aW5nc0Rpdi5zdHlsZS5kaXNwbGF5ID0gXCJmbGV4XCI7XHJcbiAgICAgICAgc2NyZWVuQ292ZXIuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcclxuXHJcbiAgICAgICAgc2NyZWVuQ292ZXIuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGNsb3NlT3B0aW9uc0Rpdik7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGNsb3NlT3B0aW9uc0RpdigpIHtcclxuICAgICAgICAgICAgc2NyZWVuQ292ZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGNsb3NlT3B0aW9uc0Rpdik7XHJcblxyXG4gICAgICAgICAgICBzZXR0aW5nc0Rpdi5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICAgICAgICAgIHNjcmVlbkNvdmVyLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgICAgICAgICAgc2V0dGluZ3NPcHRpb24uY2xhc3NMaXN0LnJlbW92ZShcInNlbGVjdGVkXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRTZXR0aW5nc0NvbmZpZygpOiBTZXR0aW5nc0NvbmZpZyB7XHJcbiAgICBsZXQgcGFydGljbGVQZXJjZW50OiBudW1iZXIgPSBNYXRoLm1pbigxMDAsIE1hdGgubWF4KDAsIChzYWZlR2V0RWxlbWVudEJ5SWQoXCJwYXJ0aWNsZVNsaWRlclwiKSBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZUFzTnVtYmVyKSk7XHJcbiAgICBsZXQgZm9sbG93UGVyY2VudDogbnVtYmVyID0gTWF0aC5taW4oMTAwLCBNYXRoLm1heCgwLCAoc2FmZUdldEVsZW1lbnRCeUlkKFwic2NyZWVuRGVsYXlcIikgYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWVBc051bWJlcikpO1xyXG4gICAgbGV0IHJlbmRlckVmZmVjdHM6IGJvb2xlYW4gPSAoc2FmZUdldEVsZW1lbnRCeUlkKFwiZWZmZWN0c1RvZ2dsZVwiKSBhcyBIVE1MSW5wdXRFbGVtZW50KS5jaGVja2VkO1xyXG4gICAgbGV0IGNhbWVyYVNoYWtlOiBib29sZWFuID0gKHNhZmVHZXRFbGVtZW50QnlJZChcImNhbWVyYUVmZmVjdHNUb2dnbGVcIikgYXMgSFRNTElucHV0RWxlbWVudCkuY2hlY2tlZDtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHJlbmRlckVmZmVjdHMsXHJcbiAgICAgICAgY2FtZXJhU2hha2UsXHJcbiAgICAgICAgcGFydGljbGVQZXJjZW50LFxyXG4gICAgICAgIGZvbGxvd1BlcmNlbnQsXHJcbiAgICB9O1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFNldHRpbmdzQ29uZmlnIHtcclxuICAgIHJlbmRlckVmZmVjdHM6IGJvb2xlYW47XHJcbiAgICBjYW1lcmFTaGFrZTogYm9vbGVhbjtcclxuICAgIHBhcnRpY2xlUGVyY2VudDogbnVtYmVyO1xyXG4gICAgZm9sbG93UGVyY2VudDogbnVtYmVyO1xyXG59XHJcbiIsImltcG9ydCB7IFNlcnZlck1lc3NhZ2UgfSBmcm9tIFwiLi4vYXBpL21lc3NhZ2VcIjtcclxuaW1wb3J0IHsgQWN0b3JUeXBlIH0gZnJvbSBcIi4uL29iamVjdHMvbmV3QWN0b3JzL2FjdG9yXCI7XHJcbmltcG9ydCB7IENsaWVudEFjdG9yIH0gZnJvbSBcIi4uL29iamVjdHMvbmV3QWN0b3JzL2NsaWVudEFjdG9ycy9jbGllbnRBY3RvclwiO1xyXG5pbXBvcnQgeyBHYW1lIH0gZnJvbSBcIi4vZ2FtZVwiO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGhhbmRsZU1lc3NhZ2UodGhpczogR2FtZSwgbXNnOiBTZXJ2ZXJNZXNzYWdlKSB7XHJcbiAgICBsZXQgcGxheWVyO1xyXG5cclxuICAgIHN3aXRjaCAobXNnLnR5cGUpIHtcclxuICAgICAgICBjYXNlIFwic2VydmVyRGVidWdNZXNzYWdlXCI6XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgXCJzZXJ2ZXJQbGF5ZXJBY3Rpb25cIjpcclxuICAgICAgICAgICAgaWYgKG1zZy5wbGF5ZXJJZCA9PT0gdGhpcy5pZCkgcmV0dXJuO1xyXG4gICAgICAgICAgICBwbGF5ZXIgPSB0aGlzLmdsb2JhbENsaWVudEFjdG9ycy5wbGF5ZXJzLmZpbmQoKHBsYXllcikgPT4gcGxheWVyLmdldEFjdG9ySWQoKSA9PT0gbXNnLnBsYXllcklkKTtcclxuICAgICAgICAgICAgaWYgKHBsYXllcikge1xyXG4gICAgICAgICAgICAgICAgcGxheWVyLnVwZGF0ZVBvc2l0aW9uQW5kTW9tZW50dW1Gcm9tU2VydmVyKG1zZy5wb3NpdGlvbiwgbXNnLm1vbWVudHVtKTtcclxuICAgICAgICAgICAgICAgIHBsYXllci5tb3ZlQWN0aW9uc05leHRGcmFtZVttc2cuYWN0aW9uVHlwZV0gPSBtc2cuc3RhcnRpbmc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBcImluZm9cIjpcclxuICAgICAgICAgICAgdGhpcy5jb25zdHJ1Y3RHYW1lKG1zZy5pbmZvKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBcInBsYXllckxlYXZlXCI6XHJcbiAgICAgICAgICAgIHRoaXMucGxheWVyTGVhdmUobXNnLmlkKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBcInBsYXllckpvaW5cIjpcclxuICAgICAgICAgICAgdGhpcy5uZXdDbGllbnRQbGF5ZXIobXNnLnBsYXllckluZm8pO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIFwicGxheWVyQWxsb3dDaG9vc2VTcGVjXCI6XHJcbiAgICAgICAgLy9vcGVuIHdpbmRvd1xyXG5cclxuICAgICAgICBjYXNlIFwicGxheWVyQ2hhbmdlU3BlY1wiOlxyXG4gICAgICAgICAgICAvL3BsYXllciBzZXQgbGV2ZWxcclxuICAgICAgICAgICAgLy9cclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBcInBsYXllckxldmVsU2V0XCI6XHJcbiAgICAgICAgICAgIC8vcGxheWVycyBzZXQgbGV2ZWxcclxuICAgICAgICAgICAgLy9wYXJ0aWNsZXNcclxuICAgICAgICAgICAgLy90aGlzLmNvbnRyb2xsZXIuc2V0UmVxdWlyZWRYUFxyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIFwicGxheWVyU2V0WFBcIjpcclxuICAgICAgICAgICAgLy90aGlzLmNvbnRyb2xsZXIuc2V0WFBcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBcInNlcnZlckhlYWxNZXNzYWdlXCI6XHJcbiAgICAgICAgICAgIGxldCBoZWFsZWRBY3RvcjogQ2xpZW50QWN0b3IgPSB0aGlzLmZpbmRBY3Rvcihtc2cuYWN0b3JJZCwgbXNnLmFjdG9yVHlwZSk7XHJcbiAgICAgICAgICAgIHRoaXMucGFydGljbGVTeXN0ZW0uYWRkU3BhcmtzKGhlYWxlZEFjdG9yLnBvc2l0aW9uKTtcclxuICAgICAgICAgICAgaGVhbGVkQWN0b3IucmVnaXN0ZXJIZWFsKG1zZy5uZXdIZWFsdGgpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIFwic2VydmVyRGFtYWdlTWVzc2FnZVwiOlxyXG4gICAgICAgICAgICBsZXQgZGFtYWdlZEFjdG9yOiBDbGllbnRBY3RvciA9IHRoaXMuZmluZEFjdG9yKG1zZy5hY3RvcklkLCBtc2cuYWN0b3JUeXBlKTtcclxuICAgICAgICAgICAgbGV0IGRhbWFnZU9yaWdpbkFjdG9yOiBDbGllbnRBY3RvciA9IHRoaXMuZmluZEFjdG9yKG1zZy5vcmlnaW5JZCwgbXNnLm9yaWdpblR5cGUpO1xyXG4gICAgICAgICAgICBkYW1hZ2VkQWN0b3IucmVnaXN0ZXJEYW1hZ2UoZGFtYWdlT3JpZ2luQWN0b3IsIG1zZy5uZXdIZWFsdGgsIG1zZy5rbm9ja2JhY2ssIG1zZy50cmFuc2xhdGlvbkRhdGEpO1xyXG4gICAgICAgICAgICBkYW1hZ2VkQWN0b3IudXBkYXRlUG9zaXRpb25BbmRNb21lbnR1bUZyb21TZXJ2ZXIobXNnLnBvc2l0aW9uLCBtc2cubW9tZW50dW0pO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIFwicGxheWVyQ2hhbmdlRmFjaW5nXCI6XHJcbiAgICAgICAgICAgIGlmIChtc2cuaWQgPT09IHRoaXMuaWQpIHJldHVybjtcclxuICAgICAgICAgICAgcGxheWVyID0gdGhpcy5nbG9iYWxDbGllbnRBY3RvcnMucGxheWVycy5maW5kKChwbGF5ZXIpID0+IHBsYXllci5nZXRBY3RvcklkKCkgPT09IG1zZy5pZCk7XHJcbiAgICAgICAgICAgIGlmIChwbGF5ZXIpIHtcclxuICAgICAgICAgICAgICAgIHBsYXllci51cGRhdGVGYWNpbmdGcm9tU2VydmVyKG1zZy5mYWNpbmdSaWdodCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBcInNlcnZlclN0YXJ0VHJhbnNsYXRpb25cIjpcclxuICAgICAgICAgICAgbGV0IGFjdG9yID0gdGhpcy5nbG9iYWxDbGllbnRBY3RvcnMuYWN0b3JzLmZpbmQoKGFjdG9yKSA9PiBhY3Rvci5nZXRBY3RvcklkKCkgPT09IG1zZy5hY3RvcklkKTtcclxuICAgICAgICAgICAgaWYgKGFjdG9yKSB7XHJcbiAgICAgICAgICAgICAgICBhY3Rvci51cGRhdGVQb3NpdGlvbkFuZE1vbWVudHVtRnJvbVNlcnZlcihtc2cucG9zaXRpb24sIG1zZy5tb21lbnR1bSk7XHJcbiAgICAgICAgICAgICAgICBhY3Rvci5zdGFydFRyYW5zbGF0aW9uKG1zZy5hbmdsZSwgbXNnLnRyYW5zbGF0aW9uTmFtZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBcInNlcnZlclN3b3JkTWVzc2FnZVwiOlxyXG4gICAgICAgICAgICBpZiAobXNnLm9yaWdpbklkID09PSB0aGlzLmlkKSByZXR1cm47XHJcbiAgICAgICAgICAgIGxldCBzd29yZFBsYXllciA9IHRoaXMuZ2xvYmFsQ2xpZW50QWN0b3JzLnN3b3JkUGxheWVycy5maW5kKChwbGF5ZXIpID0+IHBsYXllci5nZXRBY3RvcklkKCkgPT09IG1zZy5vcmlnaW5JZCk7XHJcbiAgICAgICAgICAgIGlmIChzd29yZFBsYXllcikge1xyXG4gICAgICAgICAgICAgICAgc3dvcmRQbGF5ZXIudXBkYXRlUG9zaXRpb25BbmRNb21lbnR1bUZyb21TZXJ2ZXIobXNnLnBvc2l0aW9uLCBtc2cubW9tZW50dW0pO1xyXG4gICAgICAgICAgICAgICAgaWYgKG1zZy5tc2cuc3RhcnRpbmcpIHN3b3JkUGxheWVyLnBlcmZvcm1DbGllbnRBYmlsaXR5W21zZy5tc2cuYWJpbGl0eV0obXNnLm1zZy5tb3VzZVBvcyk7XHJcbiAgICAgICAgICAgICAgICBlbHNlIHN3b3JkUGxheWVyLnJlbGVhc2VDbGllbnRBYmlsaXR5W21zZy5tc2cuYWJpbGl0eV0oKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBcInNlcnZlckRhZ2dlcnNNZXNzYWdlXCI6XHJcbiAgICAgICAgICAgIGlmIChtc2cub3JpZ2luSWQgPT09IHRoaXMuaWQpIHJldHVybjtcclxuICAgICAgICAgICAgbGV0IGRhZ2dlcnNQbGF5ZXIgPSB0aGlzLmdsb2JhbENsaWVudEFjdG9ycy5kYWdnZXJQbGF5ZXJzLmZpbmQoKHBsYXllcikgPT4gcGxheWVyLmdldEFjdG9ySWQoKSA9PT0gbXNnLm9yaWdpbklkKTtcclxuICAgICAgICAgICAgaWYgKGRhZ2dlcnNQbGF5ZXIpIHtcclxuICAgICAgICAgICAgICAgIGRhZ2dlcnNQbGF5ZXIudXBkYXRlUG9zaXRpb25BbmRNb21lbnR1bUZyb21TZXJ2ZXIobXNnLnBvc2l0aW9uLCBtc2cubW9tZW50dW0pO1xyXG4gICAgICAgICAgICAgICAgaWYgKG1zZy5tc2cuc3RhcnRpbmcpIGRhZ2dlcnNQbGF5ZXIucGVyZm9ybUNsaWVudEFiaWxpdHlbbXNnLm1zZy5hYmlsaXR5XShtc2cubXNnLm1vdXNlUG9zKTtcclxuICAgICAgICAgICAgICAgIGVsc2UgZGFnZ2Vyc1BsYXllci5yZWxlYXNlQ2xpZW50QWJpbGl0eVttc2cubXNnLmFiaWxpdHldKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgXCJzZXJ2ZXJIYW1tZXJNZXNzYWdlXCI6XHJcbiAgICAgICAgICAgIGlmIChtc2cub3JpZ2luSWQgPT09IHRoaXMuaWQpIHJldHVybjtcclxuICAgICAgICAgICAgbGV0IGhhbW1lclBsYXllciA9IHRoaXMuZ2xvYmFsQ2xpZW50QWN0b3JzLmhhbW1lclBsYXllcnMuZmluZCgocGxheWVyKSA9PiBwbGF5ZXIuZ2V0QWN0b3JJZCgpID09PSBtc2cub3JpZ2luSWQpO1xyXG4gICAgICAgICAgICBpZiAoaGFtbWVyUGxheWVyKSB7XHJcbiAgICAgICAgICAgICAgICBoYW1tZXJQbGF5ZXIudXBkYXRlUG9zaXRpb25BbmRNb21lbnR1bUZyb21TZXJ2ZXIobXNnLnBvc2l0aW9uLCBtc2cubW9tZW50dW0pO1xyXG4gICAgICAgICAgICAgICAgaWYgKG1zZy5tc2cuc3RhcnRpbmcpIGhhbW1lclBsYXllci5wZXJmb3JtQ2xpZW50QWJpbGl0eVttc2cubXNnLmFiaWxpdHldKG1zZy5tc2cubW91c2VQb3MpO1xyXG4gICAgICAgICAgICAgICAgZWxzZSBoYW1tZXJQbGF5ZXIucmVsZWFzZUNsaWVudEFiaWxpdHlbbXNnLm1zZy5hYmlsaXR5XSgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbnJlY29nbml6ZWQgbWVzc2FnZSBmcm9tIHNlcnZlclwiKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGZpbmRBY3Rvcih0aGlzOiBHYW1lLCBhY3RvcklkOiBudW1iZXIsIGFjdG9yVHlwZTogQWN0b3JUeXBlKTogQ2xpZW50QWN0b3Ige1xyXG4gICAgc3dpdGNoIChhY3RvclR5cGUpIHtcclxuICAgICAgICBjYXNlIFwiZGFnZ2Vyc1BsYXllclwiOlxyXG4gICAgICAgICAgICBsZXQgZGFnZ2VyUGxheWVyID0gdGhpcy5nbG9iYWxDbGllbnRBY3RvcnMuZGFnZ2VyUGxheWVycy5maW5kKChwbGF5ZXIpID0+IHBsYXllci5nZXRBY3RvcklkKCkgPT09IGFjdG9ySWQpO1xyXG4gICAgICAgICAgICBpZiAoZGFnZ2VyUGxheWVyKSByZXR1cm4gZGFnZ2VyUGxheWVyO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIFwic3dvcmRQbGF5ZXJcIjpcclxuICAgICAgICAgICAgbGV0IHN3b3JkUGxheWVyID0gdGhpcy5nbG9iYWxDbGllbnRBY3RvcnMuc3dvcmRQbGF5ZXJzLmZpbmQoKHBsYXllcikgPT4gcGxheWVyLmdldEFjdG9ySWQoKSA9PT0gYWN0b3JJZCk7XHJcbiAgICAgICAgICAgIGlmIChzd29yZFBsYXllcikgcmV0dXJuIHN3b3JkUGxheWVyO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIFwiaGFtbWVyUGxheWVyXCI6XHJcbiAgICAgICAgICAgIGxldCBoYW1tZXJQbGF5ZXIgPSB0aGlzLmdsb2JhbENsaWVudEFjdG9ycy5oYW1tZXJQbGF5ZXJzLmZpbmQoKHBsYXllcikgPT4gcGxheWVyLmdldEFjdG9ySWQoKSA9PT0gYWN0b3JJZCk7XHJcbiAgICAgICAgICAgIGlmIChoYW1tZXJQbGF5ZXIpIHJldHVybiBoYW1tZXJQbGF5ZXI7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlVua25vd24gYWN0b3IgdHlwZSBpbiBtZXNzYWdlSGFuZGxlcidzIGZpbmRBY3RvclwiKTtcclxuICAgIH1cclxuICAgIHRocm93IG5ldyBFcnJvcihcIkFjdG9yIFwiICsgYWN0b3JJZCArIFwiIFwiICsgYWN0b3JUeXBlICsgXCIgbm90IGZvdW5kIGluIG1lc3NhZ2VIYW5kbGVyJ3MgZmluZEFjdG9yXCIpO1xyXG59XHJcbiIsImltcG9ydCB7IFZlY3RvciB9IGZyb20gXCIuLi8uLi8uLi92ZWN0b3JcIjtcclxuaW1wb3J0IHsgYXNzZXRNYW5hZ2VyIH0gZnJvbSBcIi4uLy4uL2dhbWVSZW5kZXIvYXNzZXRtYW5hZ2VyXCI7XHJcbmltcG9ydCB7IFBhcnRpY2xlQmFzZSB9IGZyb20gXCIuL3BhcnRpY2xlQmFzZUNsYXNzXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgRHVtbXlTbGFzaEVmZmVjdDIgZXh0ZW5kcyBQYXJ0aWNsZUJhc2Uge1xyXG4gICAgcHJvdGVjdGVkIHJlYWRvbmx5IHNjYWxlOiBudW1iZXIgPSAwLjU7XHJcbiAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgc2xhc2hJbWFnZTogSFRNTEltYWdlRWxlbWVudCA9IGFzc2V0TWFuYWdlci5pbWFnZXNbXCJzbGFzaEVmZmVjdFRlc3QyXCJdO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELCBwb3NpdGlvbjogVmVjdG9yLCBwcm90ZWN0ZWQgYW5nbGU6IG51bWJlciwgcHJvdGVjdGVkIHJlYWRvbmx5IGZsaXBYOiBib29sZWFuKSB7XHJcbiAgICAgICAgc3VwZXIoY3R4LCBwb3NpdGlvbiwgMC4wNCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIHRoaXMuY3R4Lmdsb2JhbEFscGhhID0gdGhpcy5jdXJyZW50TGlmZSAvIDAuMDQ7XHJcbiAgICAgICAgdGhpcy5jdHgudHJhbnNsYXRlKHRoaXMucG9zaXRpb24ueCwgdGhpcy5wb3NpdGlvbi55KTtcclxuICAgICAgICBpZiAodGhpcy5mbGlwWCkgdGhpcy5jdHguc2NhbGUodGhpcy5zY2FsZSwgdGhpcy5zY2FsZSk7XHJcbiAgICAgICAgZWxzZSB0aGlzLmN0eC5zY2FsZSgtdGhpcy5zY2FsZSwgdGhpcy5zY2FsZSk7XHJcbiAgICAgICAgdGhpcy5jdHgucm90YXRlKHRoaXMuYW5nbGUpO1xyXG4gICAgICAgIHRoaXMuY3R4LnRyYW5zbGF0ZSgtMTIwLCAtMTkwKTtcclxuXHJcbiAgICAgICAgdGhpcy5jdHguZHJhd0ltYWdlKHRoaXMuc2xhc2hJbWFnZSwgMCwgMCk7XHJcblxyXG4gICAgICAgIHRoaXMuY3R4LnRyYW5zbGF0ZSgxMjAsICsxOTApO1xyXG4gICAgICAgIHRoaXMuY3R4LnJvdGF0ZSgtdGhpcy5hbmdsZSk7XHJcbiAgICAgICAgaWYgKHRoaXMuZmxpcFgpIHRoaXMuY3R4LnNjYWxlKDEgLyB0aGlzLnNjYWxlLCAxIC8gdGhpcy5zY2FsZSk7XHJcbiAgICAgICAgZWxzZSB0aGlzLmN0eC5zY2FsZSgtMSAvIHRoaXMuc2NhbGUsIDEgLyB0aGlzLnNjYWxlKTtcclxuICAgICAgICB0aGlzLmN0eC50cmFuc2xhdGUoLXRoaXMucG9zaXRpb24ueCwgLXRoaXMucG9zaXRpb24ueSk7XHJcbiAgICAgICAgdGhpcy5jdHguZ2xvYmFsQWxwaGEgPSAxO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCBlID0gcmVxdWlyZShcImV4cHJlc3NcIik7XHJcbmltcG9ydCB7IFZlY3RvciB9IGZyb20gXCIuLi8uLi8uLi92ZWN0b3JcIjtcclxuaW1wb3J0IHsgYXNzZXRNYW5hZ2VyIH0gZnJvbSBcIi4uLy4uL2dhbWVSZW5kZXIvYXNzZXRtYW5hZ2VyXCI7XHJcbmltcG9ydCB7IFBhcnRpY2xlQmFzZSB9IGZyb20gXCIuL3BhcnRpY2xlQmFzZUNsYXNzXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgRHVtbXlXaGlybHdpbmRFZmZlY3QgZXh0ZW5kcyBQYXJ0aWNsZUJhc2Uge1xyXG4gICAgcHJvdGVjdGVkIHJlYWRvbmx5IHNjYWxlOiBudW1iZXIgPSAwLjc7XHJcbiAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgYmFzZUltYWdlOiBIVE1MSW1hZ2VFbGVtZW50ID0gYXNzZXRNYW5hZ2VyLmltYWdlc1tcIndoaXJsd2luZEVmZmVjdEJhc2VcIl07XHJcbiAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgdG9wSW1hZ2U6IEhUTUxJbWFnZUVsZW1lbnQgPSBhc3NldE1hbmFnZXIuaW1hZ2VzW1wid2hpcmx3aW5kRWZmZWN0VG9wXCJdO1xyXG5cclxuICAgIHByb3RlY3RlZCB0b3BSb3RhdGlvbjogbnVtYmVyID0gMDtcclxuICAgIHByb3RlY3RlZCBiYXNlUm90YXRpb246IG51bWJlciA9IDA7XHJcbiAgICBwcm90ZWN0ZWQgYWxwaGE6IG51bWJlciA9IDA7XHJcblxyXG4gICAgcHJvdGVjdGVkIGVuZGluZzogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELCBwb3NpdGlvbjogVmVjdG9yLCBwcm90ZWN0ZWQgcmVhZG9ubHkgZmxpcFg6IGJvb2xlYW4pIHtcclxuICAgICAgICBzdXBlcihjdHgsIHBvc2l0aW9uLCA1KTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVBbmRSZW5kZXIoZWxhcHNlZFRpbWU6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMudG9wUm90YXRpb24gKz0gZWxhcHNlZFRpbWUgKiA0NTtcclxuICAgICAgICB0aGlzLmJhc2VSb3RhdGlvbiArPSBlbGFwc2VkVGltZSAqIDEwO1xyXG4gICAgICAgIGlmICh0aGlzLmVuZGluZykge1xyXG4gICAgICAgICAgICB0aGlzLmFscGhhIC09IGVsYXBzZWRUaW1lICogMTA7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmFscGhhIDw9IDApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaWZEZWFkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYWxwaGEgPSAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuYWxwaGEgPCAxKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFscGhhICs9IGVsYXBzZWRUaW1lICogNTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBzdXBlci51cGRhdGVBbmRSZW5kZXIoZWxhcHNlZFRpbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICB0aGlzLmN0eC5nbG9iYWxBbHBoYSA9IHRoaXMuYWxwaGE7XHJcbiAgICAgICAgdGhpcy5jdHgudHJhbnNsYXRlKHRoaXMucG9zaXRpb24ueCwgdGhpcy5wb3NpdGlvbi55KTtcclxuICAgICAgICBpZiAodGhpcy5mbGlwWCkgdGhpcy5jdHguc2NhbGUodGhpcy5zY2FsZSwgdGhpcy5zY2FsZSk7XHJcbiAgICAgICAgZWxzZSB0aGlzLmN0eC5zY2FsZSgtdGhpcy5zY2FsZSwgdGhpcy5zY2FsZSk7XHJcblxyXG4gICAgICAgIHRoaXMuY3R4LnJvdGF0ZSh0aGlzLmJhc2VSb3RhdGlvbik7XHJcbiAgICAgICAgdGhpcy5jdHgudHJhbnNsYXRlKC0zMDAsIC0zMDApO1xyXG5cclxuICAgICAgICB0aGlzLmN0eC5kcmF3SW1hZ2UodGhpcy5iYXNlSW1hZ2UsIDAsIDApO1xyXG5cclxuICAgICAgICB0aGlzLmN0eC50cmFuc2xhdGUoMzAwLCArMzAwKTtcclxuICAgICAgICB0aGlzLmN0eC5yb3RhdGUoLXRoaXMuYmFzZVJvdGF0aW9uKTtcclxuXHJcbiAgICAgICAgdGhpcy5jdHgucm90YXRlKHRoaXMudG9wUm90YXRpb24pO1xyXG4gICAgICAgIHRoaXMuY3R4LnRyYW5zbGF0ZSgtMzAwLCAtMzAwKTtcclxuXHJcbiAgICAgICAgdGhpcy5jdHguZHJhd0ltYWdlKHRoaXMudG9wSW1hZ2UsIDAsIDApO1xyXG5cclxuICAgICAgICB0aGlzLmN0eC50cmFuc2xhdGUoMzAwLCArMzAwKTtcclxuICAgICAgICB0aGlzLmN0eC5yb3RhdGUoLXRoaXMudG9wUm90YXRpb24pO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5mbGlwWCkgdGhpcy5jdHguc2NhbGUoMSAvIHRoaXMuc2NhbGUsIDEgLyB0aGlzLnNjYWxlKTtcclxuICAgICAgICBlbHNlIHRoaXMuY3R4LnNjYWxlKC0xIC8gdGhpcy5zY2FsZSwgMSAvIHRoaXMuc2NhbGUpO1xyXG4gICAgICAgIHRoaXMuY3R4LnRyYW5zbGF0ZSgtdGhpcy5wb3NpdGlvbi54LCAtdGhpcy5wb3NpdGlvbi55KTtcclxuICAgICAgICB0aGlzLmN0eC5nbG9iYWxBbHBoYSA9IDE7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHByZW1hdHVyZUVuZCgpIHtcclxuICAgICAgICB0aGlzLmVuZGluZyA9IHRydWU7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgZmluZE9ydGhvbm9ybWFsVmVjdG9yLCBWZWN0b3IgfSBmcm9tIFwiLi4vLi4vLi4vdmVjdG9yXCI7XHJcbmltcG9ydCB7IFBhcnRpY2xlQmFzZSB9IGZyb20gXCIuL3BhcnRpY2xlQmFzZUNsYXNzXCI7XHJcblxyXG5jb25zdCB0cmFpbERlbGF5OiBudW1iZXIgPSA3O1xyXG5jb25zdCB0cmFpbFdpZHRoOiBudW1iZXIgPSAyNztcclxuXHJcbmV4cG9ydCBjbGFzcyBMdW5nZUVmZmVjdCBleHRlbmRzIFBhcnRpY2xlQmFzZSB7XHJcbiAgICBwcm90ZWN0ZWQgdHJhaWxpbmdQb2ludDogVmVjdG9yO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELCBwb3NpdGlvbjogVmVjdG9yLCBwcm90ZWN0ZWQgcmVhZG9ubHkgY29sb3I6IHN0cmluZykge1xyXG4gICAgICAgIHN1cGVyKGN0eCwgcG9zaXRpb24sIDAuNCk7XHJcbiAgICAgICAgdGhpcy50cmFpbGluZ1BvaW50ID0geyB4OiBwb3NpdGlvbi54ICsgMCwgeTogcG9zaXRpb24ueSArIDAgfTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdXBkYXRlQW5kUmVuZGVyKGVsYXBzZWRUaW1lOiBudW1iZXIpIHtcclxuICAgICAgICBzdXBlci51cGRhdGVBbmRSZW5kZXIoZWxhcHNlZFRpbWUpO1xyXG4gICAgICAgIHRoaXMudHJhaWxpbmdQb2ludC54ID0gKHRoaXMucG9zaXRpb24ueCArIHRoaXMudHJhaWxpbmdQb2ludC54ICogKHRyYWlsRGVsYXkgLSAxKSkgLyB0cmFpbERlbGF5O1xyXG4gICAgICAgIHRoaXMudHJhaWxpbmdQb2ludC55ID0gKHRoaXMucG9zaXRpb24ueSArIHRoaXMudHJhaWxpbmdQb2ludC55ICogKHRyYWlsRGVsYXkgLSAxKSkgLyB0cmFpbERlbGF5O1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICB0aGlzLmN0eC5nbG9iYWxBbHBoYSA9IHRoaXMuY3VycmVudExpZmUgLyAwLjI7XHJcbiAgICAgICAgdGhpcy5jdHguZmlsbFN0eWxlID0gdGhpcy5jb2xvcjtcclxuXHJcbiAgICAgICAgbGV0IG5vcm1hbDogVmVjdG9yID0gZmluZE9ydGhvbm9ybWFsVmVjdG9yKHRoaXMudHJhaWxpbmdQb2ludCwgdGhpcy5wb3NpdGlvbik7XHJcbiAgICAgICAgbGV0IHB0MTogVmVjdG9yID0geyB4OiBub3JtYWwueCAqIHRyYWlsV2lkdGgsIHk6IG5vcm1hbC55ICogdHJhaWxXaWR0aCB9O1xyXG4gICAgICAgIGxldCBwdDI6IFZlY3RvciA9IHsgeDogbm9ybWFsLnggKiAtdHJhaWxXaWR0aCwgeTogbm9ybWFsLnkgKiAtdHJhaWxXaWR0aCB9O1xyXG5cclxuICAgICAgICB0aGlzLmN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICB0aGlzLmN0eC5tb3ZlVG8odGhpcy50cmFpbGluZ1BvaW50LngsIHRoaXMudHJhaWxpbmdQb2ludC55KTtcclxuICAgICAgICB0aGlzLmN0eC5saW5lVG8odGhpcy5wb3NpdGlvbi54ICsgcHQxLngsIHRoaXMucG9zaXRpb24ueSArIHB0MS55KTtcclxuICAgICAgICB0aGlzLmN0eC5saW5lVG8odGhpcy5wb3NpdGlvbi54ICsgcHQyLngsIHRoaXMucG9zaXRpb24ueSArIHB0Mi55KTtcclxuICAgICAgICB0aGlzLmN0eC5maWxsKCk7XHJcblxyXG4gICAgICAgIHRoaXMuY3R4Lmdsb2JhbEFscGhhID0gMTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBWZWN0b3IgfSBmcm9tIFwiLi4vLi4vLi4vdmVjdG9yXCI7XHJcblxyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgUGFydGljbGVCYXNlIHtcclxuICAgIHB1YmxpYyBpZkRlYWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHByb3RlY3RlZCBjdXJyZW50TGlmZTogbnVtYmVyO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByb3RlY3RlZCByZWFkb25seSBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCwgcHJvdGVjdGVkIHBvc2l0aW9uOiBWZWN0b3IsIHByb3RlY3RlZCBsaWZlVGltZTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50TGlmZSA9IHRoaXMubGlmZVRpbWUgKyAwO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB1cGRhdGVBbmRSZW5kZXIoZWxhcHNlZFRpbWU6IG51bWJlcikge1xyXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRMaWZlID4gMCkge1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRMaWZlIC09IGVsYXBzZWRUaW1lO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50TGlmZSA8IDApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudExpZmUgPSAwO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pZkRlYWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgYWJzdHJhY3QgcmVuZGVyKCk6IHZvaWQ7XHJcbn1cclxuIiwiaW1wb3J0IHsgVmVjdG9yIH0gZnJvbSBcIi4uLy4uLy4uL3ZlY3RvclwiO1xyXG5pbXBvcnQgeyBQYXJ0aWNsZUJhc2UgfSBmcm9tIFwiLi9wYXJ0aWNsZUJhc2VDbGFzc1wiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFNwYXJrIGV4dGVuZHMgUGFydGljbGVCYXNlIHtcclxuICAgIGNvbnN0cnVjdG9yKGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELCBwb3NpdGlvbjogVmVjdG9yLCBsaWZlVGltZTogbnVtYmVyKSB7XHJcbiAgICAgICAgc3VwZXIoY3R4LCBwb3NpdGlvbiwgbGlmZVRpbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICB0aGlzLmN0eC5nbG9iYWxBbHBoYSA9IHRoaXMuY3VycmVudExpZmUgLyB0aGlzLmxpZmVUaW1lO1xyXG4gICAgICAgIHRoaXMuY3R4LmZpbGxSZWN0KHRoaXMucG9zaXRpb24ueCAtIDMsIHRoaXMucG9zaXRpb24ueSAtIDMsIDYsIDYpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IFZlY3RvciB9IGZyb20gXCIuLi8uLi8uLi92ZWN0b3JcIjtcclxuaW1wb3J0IHsgUGFydGljbGVCYXNlIH0gZnJvbSBcIi4uL3BhcnRpY2xlQ2xhc3Nlcy9wYXJ0aWNsZUJhc2VDbGFzc1wiO1xyXG5cclxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFBhcnRpY2xlR3JvdXAge1xyXG4gICAgcHJvdGVjdGVkIHBhcnRpY2xlczogUGFydGljbGVCYXNlW10gPSBbXTtcclxuXHJcbiAgICBwdWJsaWMgaWZEZWFkOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJvdGVjdGVkIHJlYWRvbmx5IGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELCBwcm90ZWN0ZWQgcG9zaXRpb246IFZlY3Rvcikge31cclxuXHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgdXBkYXRlQW5kUmVuZGVyKGVsYXBzZWRUaW1lOiBudW1iZXIpOiB2b2lkO1xyXG59XHJcbiIsImltcG9ydCB7IFJhbmRvbSB9IGZyb20gXCIuLi8uLi8uLi9yYW5kb21cIjtcclxuaW1wb3J0IHsgVmVjdG9yIH0gZnJvbSBcIi4uLy4uLy4uL3ZlY3RvclwiO1xyXG5pbXBvcnQgeyBTcGFyayB9IGZyb20gXCIuLi9wYXJ0aWNsZUNsYXNzZXMvc3BhcmtcIjtcclxuaW1wb3J0IHsgUGFydGljbGVHcm91cCB9IGZyb20gXCIuL3BhcnRpY2xlR3JvdXBcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBTcGFya3MgZXh0ZW5kcyBQYXJ0aWNsZUdyb3VwIHtcclxuICAgIHBhcnRpY2xlczogU3BhcmtbXSA9IFtdO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELCBwb3NpdGlvbjogVmVjdG9yKSB7XHJcbiAgICAgICAgc3VwZXIoY3R4LCBwb3NpdGlvbik7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGk6IG51bWJlciA9IDA7IGkgPCAxMDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCBhbmdsZTogbnVtYmVyID0gUmFuZG9tLnJhbmdlKC1NYXRoLlBJLCBNYXRoLlBJKTtcclxuICAgICAgICAgICAgbGV0IGRpc3RhbmNlOiBudW1iZXIgPSBSYW5kb20ucmFuZ2UoMCwgMzApO1xyXG4gICAgICAgICAgICBsZXQgbGlmZTogbnVtYmVyID0gUmFuZG9tLnJhbmdlKDAuNiwgMSk7XHJcbiAgICAgICAgICAgIHRoaXMucGFydGljbGVzLnB1c2gobmV3IFNwYXJrKGN0eCwgeyB4OiBwb3NpdGlvbi54ICsgZGlzdGFuY2UgKiBNYXRoLmNvcyhhbmdsZSksIHk6IHBvc2l0aW9uLnkgKyBkaXN0YW5jZSAqIE1hdGguc2luKGFuZ2xlKSB9LCBsaWZlKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZUFuZFJlbmRlcihlbGFwc2VkVGltZTogbnVtYmVyKSB7XHJcbiAgICAgICAgbGV0IGlmRXhpc3RzUGFydGljbGU6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmN0eC5maWxsU3R5bGUgPSBcImdyZWVuXCI7XHJcbiAgICAgICAgdGhpcy5wYXJ0aWNsZXMuZm9yRWFjaCgocGFydGljbGUpID0+IHtcclxuICAgICAgICAgICAgcGFydGljbGUudXBkYXRlQW5kUmVuZGVyKGVsYXBzZWRUaW1lKTtcclxuICAgICAgICAgICAgaWYgKCFwYXJ0aWNsZS5pZkRlYWQpIGlmRXhpc3RzUGFydGljbGUgPSB0cnVlO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGlmICghaWZFeGlzdHNQYXJ0aWNsZSkgdGhpcy5pZkRlYWQgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuY3R4Lmdsb2JhbEFscGhhID0gMTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBMaW5rZWRMaXN0LCBOb2RlIH0gZnJvbSBcIi4uLy4uL2xpbmtlZExpc3RcIjtcclxuaW1wb3J0IHsgVmVjdG9yIH0gZnJvbSBcIi4uLy4uL3ZlY3RvclwiO1xyXG5pbXBvcnQgeyBHYW1lIH0gZnJvbSBcIi4uL2dhbWVcIjtcclxuaW1wb3J0IHsgc2FmZUdldEVsZW1lbnRCeUlkIH0gZnJvbSBcIi4uL3V0aWxcIjtcclxuaW1wb3J0IHsgRHVtbXlTbGFzaEVmZmVjdDIgfSBmcm9tIFwiLi9wYXJ0aWNsZUNsYXNzZXMvZHVtbXlTbGFzaEVmZmVjdDJcIjtcclxuaW1wb3J0IHsgRHVtbXlXaGlybHdpbmRFZmZlY3QgfSBmcm9tIFwiLi9wYXJ0aWNsZUNsYXNzZXMvZHVtbXlXaGlybHdpbmRFZmZlY3RcIjtcclxuaW1wb3J0IHsgTHVuZ2VFZmZlY3QgfSBmcm9tIFwiLi9wYXJ0aWNsZUNsYXNzZXMvbHVuZ2VFZmZlY3RcIjtcclxuaW1wb3J0IHsgUGFydGljbGVCYXNlIH0gZnJvbSBcIi4vcGFydGljbGVDbGFzc2VzL3BhcnRpY2xlQmFzZUNsYXNzXCI7XHJcbmltcG9ydCB7IFBhcnRpY2xlR3JvdXAgfSBmcm9tIFwiLi9wYXJ0aWNsZUdyb3Vwcy9wYXJ0aWNsZUdyb3VwXCI7XHJcbmltcG9ydCB7IFNwYXJrcyB9IGZyb20gXCIuL3BhcnRpY2xlR3JvdXBzL3NwYXJrc1wiO1xyXG5cclxuZXhwb3J0IHR5cGUgcGFydGljbGVUeXBlID0gXCJzbGFzaFwiO1xyXG5leHBvcnQgdHlwZSBwYXJ0aWNsZUdyb3VwVHlwZSA9IFwic3BhcmtcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBQYXJ0aWNsZVN5c3RlbSB7XHJcbiAgICAvL3Byb3RlY3RlZCBwYXJ0aWNsZUdyb3VwczogUGFydGljbGVHcm91cFtdID0gW107XHJcbiAgICAvL3Byb3RlY3RlZCBwYXJ0aWNsZXM6IFBhcnRpY2xlQmFzZVtdID0gW107XHJcbiAgICBwcm90ZWN0ZWQgcGFydGljbGVHcm91cHM6IExpbmtlZExpc3Q8UGFydGljbGVHcm91cD4gPSBuZXcgTGlua2VkTGlzdCgpO1xyXG4gICAgcHJvdGVjdGVkIHBhcnRpY2xlczogTGlua2VkTGlzdDxQYXJ0aWNsZUJhc2U+ID0gbmV3IExpbmtlZExpc3QoKTtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgcmVhZG9ubHkgcGFydGljbGVDdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCwgcHJvdGVjdGVkIHJlYWRvbmx5IGdhbWU6IEdhbWUpIHt9XHJcblxyXG4gICAgcHVibGljIHVwZGF0ZUFuZFJlbmRlcihlbGFwc2VkVGltZTogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLnBhcnRpY2xlR3JvdXBzLmlmRW1wdHkoKSkge1xyXG4gICAgICAgICAgICBsZXQgZ3JvdXA6IE5vZGU8UGFydGljbGVHcm91cD4gfCBudWxsID0gdGhpcy5wYXJ0aWNsZUdyb3Vwcy5oZWFkO1xyXG4gICAgICAgICAgICBsZXQgbGFzdEdyb3VwOiBOb2RlPFBhcnRpY2xlR3JvdXA+IHwgbnVsbCA9IG51bGw7XHJcbiAgICAgICAgICAgIHdoaWxlIChncm91cCAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgZ3JvdXAuZGF0YS51cGRhdGVBbmRSZW5kZXIoZWxhcHNlZFRpbWUpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChncm91cC5kYXRhLmlmRGVhZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChsYXN0R3JvdXApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGFzdEdyb3VwLm5leHQgPSBncm91cC5uZXh0O1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGFydGljbGVHcm91cHMuaGVhZCA9IGdyb3VwLm5leHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGdyb3VwID0gZ3JvdXAubmV4dDtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGFzdEdyb3VwID0gZ3JvdXA7XHJcbiAgICAgICAgICAgICAgICAgICAgZ3JvdXAgPSBncm91cC5uZXh0O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIXRoaXMucGFydGljbGVzLmlmRW1wdHkoKSkge1xyXG4gICAgICAgICAgICBsZXQgcGFydGljbGU6IE5vZGU8UGFydGljbGVCYXNlPiB8IG51bGwgPSB0aGlzLnBhcnRpY2xlcy5oZWFkO1xyXG4gICAgICAgICAgICBsZXQgbGFzdFBhcnRpY2xlOiBOb2RlPFBhcnRpY2xlQmFzZT4gfCBudWxsID0gbnVsbDtcclxuICAgICAgICAgICAgd2hpbGUgKHBhcnRpY2xlICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBwYXJ0aWNsZS5kYXRhLnVwZGF0ZUFuZFJlbmRlcihlbGFwc2VkVGltZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHBhcnRpY2xlLmRhdGEuaWZEZWFkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxhc3RQYXJ0aWNsZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsYXN0UGFydGljbGUubmV4dCA9IHBhcnRpY2xlLm5leHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXJ0aWNsZXMuaGVhZCA9IHBhcnRpY2xlLm5leHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHBhcnRpY2xlID0gcGFydGljbGUubmV4dDtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGFzdFBhcnRpY2xlID0gcGFydGljbGU7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFydGljbGUgPSBwYXJ0aWNsZS5uZXh0O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhZGRTcGFya3MocG9zaXRpb246IFZlY3Rvcikge1xyXG4gICAgICAgIHRoaXMucGFydGljbGVHcm91cHMuaW5zZXJ0QXRCZWdpbihuZXcgU3BhcmtzKHRoaXMucGFydGljbGVDdHgsIHBvc2l0aW9uKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFkZER1bW15U2xhc2hFZmZlY3QyKHBvc2l0aW9uOiBWZWN0b3IsIGFuZ2xlOiBudW1iZXIsIGZsaXBYOiBib29sZWFuKSB7XHJcbiAgICAgICAgdGhpcy5wYXJ0aWNsZXMuaW5zZXJ0QXRCZWdpbihuZXcgRHVtbXlTbGFzaEVmZmVjdDIodGhpcy5wYXJ0aWNsZUN0eCwgcG9zaXRpb24sIGFuZ2xlLCBmbGlwWCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhZGREdW1teVdoaXJsd2luZEVmZmVjdChwb3NpdGlvbjogVmVjdG9yLCBmbGlwWDogYm9vbGVhbik6IER1bW15V2hpcmx3aW5kRWZmZWN0IHtcclxuICAgICAgICBsZXQgdGVtcFB0cjogRHVtbXlXaGlybHdpbmRFZmZlY3QgPSBuZXcgRHVtbXlXaGlybHdpbmRFZmZlY3QodGhpcy5wYXJ0aWNsZUN0eCwgcG9zaXRpb24sIGZsaXBYKTtcclxuICAgICAgICB0aGlzLnBhcnRpY2xlcy5pbnNlcnRBdEJlZ2luKHRlbXBQdHIpO1xyXG4gICAgICAgIHJldHVybiB0ZW1wUHRyO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhZGRMdW5nZUVmZmVjdChwb3NpdGlvbjogVmVjdG9yLCBjb2xvcjogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5wYXJ0aWNsZXMuaW5zZXJ0QXRCZWdpbihuZXcgTHVuZ2VFZmZlY3QodGhpcy5wYXJ0aWNsZUN0eCwgcG9zaXRpb24sIGNvbG9yKSk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgSm9pblJlcXVlc3QsIEpvaW5SZXNwb25zZSB9IGZyb20gXCIuLi9hcGkvam9pblwiO1xyXG5pbXBvcnQgeyBDbGllbnRNZXNzYWdlLCBTZXJ2ZXJNZXNzYWdlIH0gZnJvbSBcIi4uL2FwaS9tZXNzYWdlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgU2VydmVyVGFsa2VyIHtcclxuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgaG9zdE5hbWUgPSB3aW5kb3cubG9jYXRpb24uaG9zdDtcclxuICAgIHB1YmxpYyByZWFkb25seSBzZXJ2ZXJUYWxrZXJSZWFkeTogUHJvbWlzZTxKb2luUmVzcG9uc2U+O1xyXG4gICAgcHJpdmF0ZSB3ZWJzb2NrZXQ/OiBXZWJTb2NrZXQ7XHJcbiAgICBjb25zdHJ1Y3Rvcihqb2luUmVxdWVzdDogSm9pblJlcXVlc3QsIHB1YmxpYyBtZXNzYWdlSGFuZGxlcjogKGRhdGE6IFNlcnZlck1lc3NhZ2UpID0+IHZvaWQgPSAoKSA9PiB7fSkge1xyXG4gICAgICAgIHRoaXMuc2VydmVyVGFsa2VyUmVhZHkgPSBuZXcgUHJvbWlzZTxKb2luUmVzcG9uc2U+KChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5qb2luKGpvaW5SZXF1ZXN0KS50aGVuKChyZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy53ZWJzb2NrZXQgPSBuZXcgV2ViU29ja2V0KFwid3M6Ly9cIiArIFNlcnZlclRhbGtlci5ob3N0TmFtZSArIFwiL1wiICsgcmVzcG9uc2UuaWQudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLndlYnNvY2tldC5vbm1lc3NhZ2UgPSAoZXYpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBkYXRhID0gSlNPTi5wYXJzZShldi5kYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1lc3NhZ2VIYW5kbGVyKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIHRoaXMud2Vic29ja2V0Lm9ub3BlbiA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhc3luYyBzZW5kTWVzc2FnZShkYXRhOiBDbGllbnRNZXNzYWdlKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLndlYnNvY2tldCkge1xyXG4gICAgICAgICAgICBhd2FpdCB0aGlzLnNlcnZlclRhbGtlclJlYWR5O1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLndlYnNvY2tldCEuc2VuZChKU09OLnN0cmluZ2lmeShkYXRhKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFzeW5jIGpvaW4ocmVxdWVzdDogSm9pblJlcXVlc3QpOiBQcm9taXNlPEpvaW5SZXNwb25zZT4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnBvc3RIZWxwZXIoXCJqb2luXCIsIHJlcXVlc3QpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgYXN5bmMgcG9zdEhlbHBlcih1cmw6IHN0cmluZywgZGF0YTogYW55KTogUHJvbWlzZTxhbnk+IHtcclxuICAgICAgICByZXR1cm4gZmV0Y2goXCJodHRwczovL1wiICsgU2VydmVyVGFsa2VyLmhvc3ROYW1lICsgXCIvXCIgKyB1cmwsIHtcclxuICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcclxuICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoZGF0YSksXHJcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH0pLnRoZW4oKHJlc3BvbnNlKSA9PiByZXNwb25zZS5qc29uKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgYXN5bmMgZ2V0SGVscGVyKHVybDogc3RyaW5nKTogUHJvbWlzZTxhbnk+IHtcclxuICAgICAgICByZXR1cm4gZmV0Y2goXCJodHRwczovL1wiICsgU2VydmVyVGFsa2VyLmhvc3ROYW1lICsgXCIvXCIgKyB1cmwpLnRoZW4oKHJlc3BvbnNlKSA9PiByZXNwb25zZS5qc29uKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhc3luYyBsZWF2ZSgpIHtcclxuICAgICAgICBpZiAoIXRoaXMud2Vic29ja2V0KSB7XHJcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuc2VydmVyVGFsa2VyUmVhZHk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMud2Vic29ja2V0IS5jbG9zZSgpO1xyXG4gICAgfVxyXG59XHJcbiIsImV4cG9ydCBmdW5jdGlvbiBzYWZlR2V0RWxlbWVudEJ5SWQoaWQ6IHN0cmluZyk6IEhUTUxFbGVtZW50IHtcclxuICAgIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XHJcbiAgICBpZiAoZWxlbWVudCkge1xyXG4gICAgICAgIHJldHVybiBlbGVtZW50O1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEVsZW1lbnQgd2l0aCBpZCAke2lkfSBjb3VsZCBub3QgYmUgZ290dGVuYCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBmaWxsUGF0Y2hOb3Rlc0RpdihkaXY6IEhUTUxFbGVtZW50KTogdm9pZCB7XHJcbiAgICBmb3IgKGxldCBpMTogbnVtYmVyID0gMDsgaTEgPCBwYXRjaE5vdGVzLmxlbmd0aDsgaTErKykge1xyXG4gICAgICAgIGRpdi5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaHJcIikpO1xyXG5cclxuICAgICAgICBsZXQgZGF0ZTogSFRNTEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKTtcclxuICAgICAgICBkYXRlLmNsYXNzTGlzdC5hZGQoXCJwYXRjaERhdGVcIik7XHJcbiAgICAgICAgZGF0ZS5pbm5lclRleHQgPSBwYXRjaE5vdGVzW2kxXS5kYXRlVGl0bGU7XHJcbiAgICAgICAgaWYgKHBhdGNoTm90ZXNbaTFdLmlmTmV3KSB7XHJcbiAgICAgICAgICAgIGRhdGUuY2xhc3NMaXN0LmFkZChcIm5ld1BhdGNoXCIpO1xyXG4gICAgICAgICAgICBkYXRlLmlubmVyVGV4dCArPSBcIiAtIE5FV1wiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBkaXYuYXBwZW5kQ2hpbGQoZGF0ZSk7XHJcblxyXG4gICAgICAgIHBhdGNoTm90ZXNbaTFdLmFkZGl0aW9ucy5mb3JFYWNoKChhZGRpdGlvblRleHQpID0+IHtcclxuICAgICAgICAgICAgbGV0IGFkZGl0aW9uRWxlbWVudDogSFRNTEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKTtcclxuICAgICAgICAgICAgYWRkaXRpb25FbGVtZW50LmlubmVyVGV4dCA9IGFkZGl0aW9uVGV4dDtcclxuICAgICAgICAgICAgaWYgKHBhdGNoTm90ZXNbaTFdLmlmTmV3KSBhZGRpdGlvbkVsZW1lbnQuY2xhc3NMaXN0LmFkZChcIm5ld1BhdGNoXCIpO1xyXG4gICAgICAgICAgICBkaXYuYXBwZW5kQ2hpbGQoYWRkaXRpb25FbGVtZW50KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgcGF0Y2hOb3RlczogeyBkYXRlVGl0bGU6IHN0cmluZzsgYWRkaXRpb25zOiBzdHJpbmdbXTsgaWZOZXc6IGJvb2xlYW4gfVtdID0gW1xyXG4gICAge1xyXG4gICAgICAgIGRhdGVUaXRsZTogXCJUQkRcIixcclxuICAgICAgICBhZGRpdGlvbnM6IFtcIkZpeGVkIGEgYnVnIHdoZXJlIGxhcmdlIHNjcmVlbnMgZGlkbid0IGNvcnJlY3RseSBkZXRlY3QgdGhlIG1vdXNlIHBvc2l0aW9uLlwiXSxcclxuICAgICAgICBpZk5ldzogdHJ1ZSxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgZGF0ZVRpdGxlOiBcIjUtMjAtMjEgLSBDb29sZXIgQWJpbGl0aWVzIC8gUG9saXNoaW5nXCIsXHJcbiAgICAgICAgYWRkaXRpb25zOiBbXHJcbiAgICAgICAgICAgIFwiUmVkaWQgU3dvcmQgd2VhcG9uIGFuZCBhbmltYXRpb25zLCBob3BlZnVsbHkgZm9yIHRoZSBiZXR0ZXIuIEFueSBmZWVkYmFjayBvbiBob3cgdGhlIGFiaWxpdGllcyBmZWVsIHdvdWxkIGJlIGF3ZXNvbWUuXCIsXHJcbiAgICAgICAgICAgIFwiQWRkZWQgYSB3ZWJzaXRlIGljb24hIExvdmUgaXQgYW5kIGNoZXJpc2ggaXQhIVwiLFxyXG4gICAgICAgICAgICBcIlRoZSBjb21tZW50IHN5c3RlbSBoYWQgbWFsZnVuY3Rpb25zLCBhbmQgSSBkaWRuJ3QgcmVjZWl2ZSBhbnkgY29tbWVudHMuIFNvcnJ5ISBJZiB5b3Ugd291bGQgcmVzZW5kIGFueSB0aGF0IHlvdSBzZW50LCBJIHdvdWxkIGJlIHZlcnkgZ3JhdGVmdWwuIEknbGwgYmUgd2F0Y2hpbmcgY2xvc2VseSB0byBtYWtlIHN1cmUgdGhlcmUgYXJlIG5vIG1vcmUgZXJyb3JzLiBTaG91dG91dCB0byBKZW5zIHdobyBoZWxwZWQgbWUgZmluZCBpdC5cIixcclxuICAgICAgICAgICAgXCJBZGRlZCBzbWFsbCB2aXN1YWwgdHJlYXRzIHRvIGFiaWxpdGllcyB3aXRoIG1vcmUgdG8gY29tZS5cIixcclxuICAgICAgICAgICAgXCJFdmVuIGZhc3RlciBwZXJmb3JtYW5jZSAodGltZSBiZXR3ZWVuIHByZXNzaW5nIGEgYnV0dG9uIGFuZCB0aGUgYWN0aW9uIGhhcHBlbm5pbmcgcmVkdWNlZCBieSA1MCUpIGFuZCBhIG1vcmUgcGxheWVyLWNlbnRlcmVkIHZpZXdwb2ludCB3aXRoIGJldHRlciB6b29taW5nL3NjYWxpbmcgd2l0aCB5b3VyIHNjcmVlbi5cIixcclxuICAgICAgICAgICAgXCJGaXhlZCBhIHNtYWxsIG1vbWVudHVtIGJ1ZyB0byBob3BlZnVsbHkgZWxpbWluYXRlIHNtYWxsIGRpc2NyZXBhbmNpZXMgaW4gcGxheWVycycgcG9zaXRpb25zIGJldHdlZW4gY2xpZW50cy5cIixcclxuICAgICAgICAgICAgXCJQbGF5ZXIgYm94ZXMgYXJlIHNsaWdodGx5IGJpZ2dlciAoMTAlKSB3aXRoIG91dGxpbmVzIGZvciBiZXR0ZXIgdmlzaWJpbGl0eS5cIixcclxuICAgICAgICBdLFxyXG4gICAgICAgIGlmTmV3OiBmYWxzZSxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgZGF0ZVRpdGxlOiBcIjUtMTUtMjEgLSBCYXNpYyBBYmlsaXR5IEZ1bmN0aW9uYWxpdHlcIixcclxuICAgICAgICBhZGRpdGlvbnM6IFtcclxuICAgICAgICAgICAgXCJBRERFRCBQQVRDSCBOT1RFUy5cIixcclxuICAgICAgICAgICAgXCJBZGRlZCBhIGJhc2ljIHdlYXBvbiBhbmQgYW5pbWF0aW9ucyEhIE1vcmUgdG8gY29tZSB3aXRoIHRoZSBuZXh0IHBhdGNoIVwiLFxyXG4gICAgICAgICAgICBcIlZhc3RseSBpbXByb3ZlZCB1c2VyIGludGVyZmFjZSBhbmQgcmVtb3ZlZCBsZXZlbHMgYW5kIGV4cGVyaWVuY2UgZm9yIG5vdy5cIixcclxuICAgICAgICAgICAgXCJBZGRlZCBiYXNpYyBhYmlsaXRpZXMgZm9yIHRoZSBzd29yZCBjbGFzcyBpbmNsdWRpbmcgU2xhc2ggYW5kIFdoaXJsd2luZCwgYW5kIG1vcmUgd2lsbCBjb21lIG5leHQgcGF0Y2ggZm9yIHRoZSByZW1haW5pbmcgY2xhc3Nlcy5cIixcclxuICAgICAgICAgICAgXCJNQVNTSVZFIHJlbmRlcmluZyBwZXJmb3JtYW5jZSBpbXByb3ZlbWVudHMsIHdpdGggdXAgdG8gNTAlIGluY3JlYXNlZCBnYW1lIGVuZ2luZSBzcGVlZHMuXCIsXHJcbiAgICAgICAgICAgIFwiTmV3IHN1cHBvcnQgZm9yIGxhcmdlciBzY3JlZW5zLCByZW1vdmVkIDRrIHNjcmVlbiBmbG9vciBjbGlwcGluZyAodGhpcyBvbmUncyBmb3IgeW91LCBNYXJrIGFuZCBLYXNzaSkuXCIsXHJcbiAgICAgICAgICAgIFwiQWRkZWQgc21hbGwgcmVkIHBsYXllciBmbGFzaGVzIGZvciBiZXR0ZXIgaGl0IHZpc2liaWxpdHkuXCIsXHJcbiAgICAgICAgICAgIFwiQWRkZWQgYmFzaWMgcGFydGljbGUgZnVuY3Rpb25hbGl0eSB0aGF0J3MgZGlzcGxheWVkIHdoZW4gYSBwbGF5ZXIgaXMgaGVhbGVkLlwiLFxyXG4gICAgICAgIF0sXHJcbiAgICAgICAgaWZOZXc6IGZhbHNlLFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICBkYXRlVGl0bGU6IFwiNS01LTIxIC0gSG90Zml4ZXNcIixcclxuICAgICAgICBhZGRpdGlvbnM6IFtcIlNtYWxsIGJ1ZyBmaXhlcyBmb3IgcGxheWVyIGhlYWx0aC4gUGxheWVyJ3MgaGVhbHRoIHdhcyBub3QgdXBkYXRpbmcgY29ycmVjdGx5IGFuZCBzb21ldGltZXMgb3ZlcnNob290aW5nIHRoZWlyIG1heCBoZWFsdGguXCJdLFxyXG4gICAgICAgIGlmTmV3OiBmYWxzZSxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgZGF0ZVRpdGxlOiBcIjUtNS0yMSAtIFVzZXIgSW50ZXJmYWNlIGFuZCBIZWFsdGhiYXJzXCIsXHJcbiAgICAgICAgYWRkaXRpb25zOiBbXHJcbiAgICAgICAgICAgIFwiSHVnZSB1cGRhdGVzIHRvIHVzZXIgaW50ZXJmYWNlLCBhbmQgYWRkZWQgYSBmZXcgZWFybHkgYWJpbGl0eSBpY29ucy4gQWRkZWQgYSBoZWFsIGFuaW1hdGlvbiB0byB0aGUgaGVhbHRoYmFycywgYW5kIHRlc3Rpbmcgd2l0aCBsZWZ0L3JpZ2h0IGNsaWNrcy5cIixcclxuICAgICAgICAgICAgXCJJbXByb3ZlZCB0aGUgbWFpbiBhY3RvciBjYW52YXMgdG8gcmVkdWNlIGNsaXBwaW5nIGFuZCBpbXByb3ZlIHBlcmZvcm1hbmNlLlwiLFxyXG4gICAgICAgIF0sXHJcbiAgICAgICAgaWZOZXc6IGZhbHNlLFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICBkYXRlVGl0bGU6IFwiNS0zLTIxIC0gUm91Z2ggVUlcIixcclxuICAgICAgICBhZGRpdGlvbnM6IFtcclxuICAgICAgICAgICAgXCJBZGRlZCBiYXNpYyB1c2VyIGludGVyZmFjZSB3aXRoIG1vcmUgdG8gY29tZS4gQWRqdXN0ZWQgY29udHJvbHMgdG8gYmUgbW9yZSByZXNwb25zaXZlLCBhbmQgYWRkZWQgb3B0aW9ucyB0byB0aGUgbWFpbiBtZW51LlwiLFxyXG4gICAgICAgICAgICBcIkZpbmlzaGluZyB0b3VjaGVzIG9uIGRvb2RhZCBjb2xsaXNpb24gZGV0ZWN0aW9uIGFuZCByZXNwb25zZSBmb3JjaW5nLlwiLFxyXG4gICAgICAgIF0sXHJcbiAgICAgICAgaWZOZXc6IGZhbHNlLFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICBkYXRlVGl0bGU6IFwiNC0yOS0yMSAtIFJvY2sgRG9vZGFkc1wiLFxyXG4gICAgICAgIGFkZGl0aW9uczogW1wiQWRkZWQgYmFzaWMgcm9jayBkb29kYWRzLCB3aXRoIG1vcmUgdG8gY29tZSBhcyB0aGUgZ2FtZSBwcm9ncmVzc2VzLlwiLCBcIkFkZGVkIGFuZCBpbXByb3ZlZCBjbGFzcyBpY29ucy5cIl0sXHJcbiAgICAgICAgaWZOZXc6IGZhbHNlLFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICBkYXRlVGl0bGU6IFwiNC0yNy0yMSAtIEdhbWUgTWFrZW92ZXIhIE5ldyBNYWluIE1lbnVcIixcclxuICAgICAgICBhZGRpdGlvbnM6IFtcclxuICAgICAgICAgICAgXCJPdmVyaGF1bGVkIHRoZSBvYmplY3QgaGllcmFyY2h5IGluIHRoZSBjb2RlLCByZXN1bHRpbmcgaW4gZmFzdGVyIHByb2Nlc3NpbmcgYW5kIG1vcmUgcG90ZW50aWFsIHRvIHRoZSBnYW1lLlwiLFxyXG4gICAgICAgICAgICBcIlJlZGlkIHRoZSBtYWluIG1lbnUsIHdpdGggY2xlYXJlciBidXR0b25zIGFuZCBhIG1vcmUgYXBwZWFsaW5nIHZpc3VhbCBzdHlsZS5cIixcclxuICAgICAgICAgICAgXCJOZXcgYW5kIGltcHJvdmVkIHRlcnJhaW4gc3lzdGVtLCBmZWF0dXJpbmcgaGlsbHMgYW5kIHJlYWxpc3RpYy1lciBncm91bmQuXCIsXHJcbiAgICAgICAgICAgIFwiSW1wcm92ZWQgZ3JhcGhpY3MgYW5kIGZhc3RlciByZW5kZXJpbmcgZm9yIGJhY2tncm91bmQgYW5kIHBsYXllcnMuXCIsXHJcbiAgICAgICAgXSxcclxuICAgICAgICBpZk5ldzogZmFsc2UsXHJcbiAgICB9LFxyXG5dO1xyXG4iLCJpbXBvcnQgeyBTaXplIH0gZnJvbSBcIi4vc2l6ZVwiO1xyXG5pbXBvcnQgeyBWZWN0b3IgfSBmcm9tIFwiLi92ZWN0b3JcIjtcclxuXHJcbmNvbnN0IHhTaXplOiBudW1iZXIgPSA1MDAwO1xyXG5jb25zdCB5U2l6ZTogbnVtYmVyID0gMTAwMDtcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgQ29uZmlnIHtcclxuICAgIC8qKlxyXG4gICAgICogRGVjaWRlcyBwbGF5ZXIgaGVpZ2h0IGFuZCB3aWR0aFxyXG4gICAgICovXHJcbiAgICBwbGF5ZXJTaXplOiBTaXplO1xyXG4gICAgcGxheWVyU3RhcnQ6IFZlY3RvcjtcclxuICAgIHBsYXllckp1bXBIZWlnaHQ6IG51bWJlcjtcclxuICAgIHhTaXplOiBudW1iZXI7XHJcbiAgICB5U2l6ZTogbnVtYmVyO1xyXG4gICAgcGxheWVyS2V5czoge1xyXG4gICAgICAgIHVwOiBzdHJpbmc7XHJcbiAgICAgICAgZG93bjogc3RyaW5nO1xyXG4gICAgICAgIGxlZnQ6IHN0cmluZztcclxuICAgICAgICByaWdodDogc3RyaW5nO1xyXG4gICAgICAgIGJhc2ljQXR0YWNrOiBzdHJpbmc7XHJcbiAgICAgICAgc2Vjb25kQXR0YWNrOiBzdHJpbmc7XHJcbiAgICAgICAgZmlyc3RBYmlsaXR5OiBzdHJpbmc7XHJcbiAgICAgICAgc2Vjb25kQWJpbGl0eTogc3RyaW5nO1xyXG4gICAgICAgIHRoaXJkQWJpbGl0eTogc3RyaW5nO1xyXG4gICAgICAgIGZvdXJ0aEFiaWxpdHk6IHN0cmluZztcclxuICAgIH07XHJcbiAgICBwbGF0Zm9ybUNvbG9yOiBzdHJpbmc7XHJcbiAgICBmYWxsaW5nQWNjZWxlcmF0aW9uOiBudW1iZXI7XHJcbiAgICBzdGFuZGluZ1NpZGV3YXlzQWNjZWxlcmF0aW9uOiBudW1iZXI7XHJcbiAgICBub25TdGFuZGluZ1NpZGV3YXlzQWNjZWxlcmF0aW9uOiBudW1iZXI7XHJcbiAgICBtYXhTaWRld2F5c01vbWVudHVtOiBudW1iZXI7XHJcbiAgICBnYW1lU3BlZWQ6IG51bWJlcjtcclxuICAgIHVwZGF0ZVBsYXllckZvY3VzU3BlZWQ6IG51bWJlcjtcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGRlZmF1bHRDb25maWc6IENvbmZpZyA9IHtcclxuICAgIHBsYXllclNpemU6IHsgd2lkdGg6IDk2LCBoZWlnaHQ6IDEwMCB9LFxyXG4gICAgcGxheWVyU3RhcnQ6IHtcclxuICAgICAgICB4OiAzMDAsXHJcbiAgICAgICAgeTogNjUwLFxyXG4gICAgfSxcclxuICAgIHBsYXllckp1bXBIZWlnaHQ6IDEyMDAsXHJcbiAgICB4U2l6ZSxcclxuICAgIHlTaXplLFxyXG4gICAgcGxheWVyS2V5czoge1xyXG4gICAgICAgIHVwOiBcIktleVdcIixcclxuICAgICAgICBkb3duOiBcIktleVNcIixcclxuICAgICAgICBsZWZ0OiBcIktleUFcIixcclxuICAgICAgICByaWdodDogXCJLZXlEXCIsXHJcbiAgICAgICAgYmFzaWNBdHRhY2s6IFwibGVmdE1vdXNlRG93blwiLFxyXG4gICAgICAgIHNlY29uZEF0dGFjazogXCJyaWdodE1vdXNlRG93blwiLFxyXG4gICAgICAgIGZpcnN0QWJpbGl0eTogXCJTcGFjZVwiLFxyXG4gICAgICAgIHNlY29uZEFiaWxpdHk6IFwiU2hpZnRMZWZ0XCIsXHJcbiAgICAgICAgdGhpcmRBYmlsaXR5OiBcIktleVFcIixcclxuICAgICAgICBmb3VydGhBYmlsaXR5OiBcIktleUVcIixcclxuICAgIH0sXHJcbiAgICBwbGF0Zm9ybUNvbG9yOiBcImdyZXlcIixcclxuICAgIGZhbGxpbmdBY2NlbGVyYXRpb246IDM1MDAsXHJcbiAgICBzdGFuZGluZ1NpZGV3YXlzQWNjZWxlcmF0aW9uOiAxMDAwMCxcclxuICAgIG5vblN0YW5kaW5nU2lkZXdheXNBY2NlbGVyYXRpb246IDQwMDAsXHJcbiAgICBtYXhTaWRld2F5c01vbWVudHVtOiA2MDAsXHJcbiAgICBnYW1lU3BlZWQ6IDEsXHJcbiAgICB1cGRhdGVQbGF5ZXJGb2N1c1NwZWVkOiAwLjA1LFxyXG59O1xyXG4iLCJpbXBvcnQgeyBmaW5kRGlzdGFuY2UsIFZlY3RvciB9IGZyb20gXCIuL3ZlY3RvclwiO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGZpbmRBbmdsZShwb3MxOiBWZWN0b3IsIHBvczI6IFZlY3Rvcik6IG51bWJlciB7XHJcbiAgICByZXR1cm4gTWF0aC5hdGFuMihwb3MyLnkgLSBwb3MxLnksIHBvczIueCAtIHBvczEueCk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByb3RhdGVTaGFwZShzaGFwZTogVmVjdG9yW10sIGFuZ2xlOiBudW1iZXIsIHBvc2l0aW9uT2Zmc2V0OiBWZWN0b3IsIGZsaXBPdmVyWTogYm9vbGVhbiA9IGZhbHNlIC8qLCBmbGlwT3Zlclg6IGJvb2xlYW4gPSBmYWxzZSovKTogVmVjdG9yW10ge1xyXG4gICAgbGV0IG5ld1ZlY3RvckFycmF5OiBWZWN0b3JbXSA9IFtdO1xyXG4gICAgZm9yICh2YXIgaTogbnVtYmVyID0gMDsgaSA8IHNoYXBlLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgbmV3VmVjdG9yQXJyYXkucHVzaCh7IHg6IHNoYXBlW2ldLnggKyAwLCB5OiBzaGFwZVtpXS55ICsgMCB9KTtcclxuICAgIH1cclxuICAgIGZvciAodmFyIGk6IG51bWJlciA9IDA7IGkgPCBzaGFwZS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGlmICgoZmxpcE92ZXJZICYmIGFuZ2xlID4gTWF0aC5QSSAvIDIpIHx8IGFuZ2xlIDwgLU1hdGguUEkgLyAyKSB7XHJcbiAgICAgICAgICAgIC8vIGZsaXAgaXQgYXJvdW5kIGlmIHRoZXkncmUgZmFjaW5nIGxlZnRcclxuICAgICAgICAgICAgbmV3VmVjdG9yQXJyYXlbaV0ueSAqPSAtMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IHRhbjogbnVtYmVyID0gZmluZEFuZ2xlKHsgeDogMCwgeTogMCB9LCB7IHg6IG5ld1ZlY3RvckFycmF5W2ldLngsIHk6IG5ld1ZlY3RvckFycmF5W2ldLnkgfSk7IC8vIGZpbmQgb3JpZ2luYWwgYW5nbGVcclxuICAgICAgICBsZXQgZGlzdGFuY2U6IG51bWJlciA9IGZpbmREaXN0YW5jZSh7IHg6IDAsIHk6IDAgfSwgeyB4OiBuZXdWZWN0b3JBcnJheVtpXS54LCB5OiBuZXdWZWN0b3JBcnJheVtpXS55IH0pOyAvLyBmaW5kIG9yaWdpbmFsIGRpc3RhbmNlXHJcbiAgICAgICAgbmV3VmVjdG9yQXJyYXlbaV0ueCA9IGRpc3RhbmNlICogTWF0aC5jb3ModGFuICsgYW5nbGUpICsgcG9zaXRpb25PZmZzZXQueDtcclxuICAgICAgICBuZXdWZWN0b3JBcnJheVtpXS55ID0gZGlzdGFuY2UgKiBNYXRoLnNpbih0YW4gKyBhbmdsZSkgKyBwb3NpdGlvbk9mZnNldC55O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG5ld1ZlY3RvckFycmF5O1xyXG59XHJcbiIsImltcG9ydCB7IFZlY3RvciB9IGZyb20gXCIuL3ZlY3RvclwiO1xyXG5cclxuLy9yZXR1cm5zIHRydWUgaWYgcG9pbnQgaXMgaW5zaWRlIHRoZSBzaGFwZS4gRG9lc24ndCB3b3JrIHJlbGlhYmx5IGlmIHRoZSBwb2ludCBsaWVzIG9uIGFuIGVkZ2Ugb3IgY29ybmVyLCBidXQgdGhvc2UgYXJlIHJhcmUgY2FzZXMuXHJcbmV4cG9ydCBmdW5jdGlvbiBpZkluc2lkZShwb2ludDogVmVjdG9yLCBzaGFwZTogVmVjdG9yW10pOiBib29sZWFuIHtcclxuICAgIC8vIHJheS1jYXN0aW5nIGFsZ29yaXRobSBiYXNlZCBvblxyXG4gICAgLy8gaHR0cHM6Ly93cmYuZWNzZS5ycGkuZWR1L1Jlc2VhcmNoL1Nob3J0X05vdGVzL3BucG9seS5odG1sL3BucG9seS5odG1sXHJcblxyXG4gICAgdmFyIHggPSBwb2ludC54ICsgMCxcclxuICAgICAgICB5ID0gcG9pbnQueSArIDA7XHJcblxyXG4gICAgdmFyIGluc2lkZSA9IGZhbHNlO1xyXG4gICAgZm9yICh2YXIgaSA9IDAsIGogPSBzaGFwZS5sZW5ndGggLSAxOyBpIDwgc2hhcGUubGVuZ3RoOyBqID0gaSsrKSB7XHJcbiAgICAgICAgdmFyIHhpID0gc2hhcGVbaV0ueCArIDAsXHJcbiAgICAgICAgICAgIHlpID0gc2hhcGVbaV0ueSArIDA7XHJcbiAgICAgICAgdmFyIHhqID0gc2hhcGVbal0ueCArIDAsXHJcbiAgICAgICAgICAgIHlqID0gc2hhcGVbal0ueSArIDA7XHJcblxyXG4gICAgICAgIHZhciBpbnRlcnNlY3QgPSB5aSA+IHkgIT0geWogPiB5ICYmIHggPCAoKHhqIC0geGkpICogKHkgLSB5aSkpIC8gKHlqIC0geWkpICsgeGk7XHJcbiAgICAgICAgaWYgKGludGVyc2VjdCkgaW5zaWRlID0gIWluc2lkZTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gaW5zaWRlO1xyXG59XHJcbiIsImltcG9ydCB7IEVkZ2UsIFZlY3RvciB9IGZyb20gXCIuL3ZlY3RvclwiO1xyXG5cclxuLy8gcmV0dXJucyB0cnVlIGlmIGxpbmUxIGludGVyc2VjdHMgd2l0aCBsaW5lMlxyXG5leHBvcnQgZnVuY3Rpb24gaWZJbnRlcnNlY3QobGluZTFTdGFydDogVmVjdG9yLCBsaW5lMUVuZDogVmVjdG9yLCBsaW5lMlN0YXJ0OiBWZWN0b3IsIGxpbmUyRW5kOiBWZWN0b3IpOiBib29sZWFuIHtcclxuICAgIHZhciBkZXQsIGdhbW1hLCBsYW1iZGE7XHJcbiAgICBkZXQgPSAobGluZTFFbmQueCAtIGxpbmUxU3RhcnQueCkgKiAobGluZTJFbmQueSAtIGxpbmUyU3RhcnQueSkgLSAobGluZTJFbmQueCAtIGxpbmUyU3RhcnQueCkgKiAobGluZTFFbmQueSAtIGxpbmUxU3RhcnQueSk7XHJcbiAgICBpZiAoZGV0ID09PSAwKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBsYW1iZGEgPSAoKGxpbmUyRW5kLnkgLSBsaW5lMlN0YXJ0LnkpICogKGxpbmUyRW5kLnggLSBsaW5lMVN0YXJ0LngpICsgKGxpbmUyU3RhcnQueCAtIGxpbmUyRW5kLngpICogKGxpbmUyRW5kLnkgLSBsaW5lMVN0YXJ0LnkpKSAvIGRldDtcclxuICAgICAgICBnYW1tYSA9ICgobGluZTFTdGFydC55IC0gbGluZTFFbmQueSkgKiAobGluZTJFbmQueCAtIGxpbmUxU3RhcnQueCkgKyAobGluZTFFbmQueCAtIGxpbmUxU3RhcnQueCkgKiAobGluZTJFbmQueSAtIGxpbmUxU3RhcnQueSkpIC8gZGV0O1xyXG4gICAgICAgIHJldHVybiAwIDwgbGFtYmRhICYmIGxhbWJkYSA8IDEgJiYgMCA8IGdhbW1hICYmIGdhbW1hIDwgMTtcclxuICAgIH1cclxufVxyXG5cclxuLy8gbGluZSBpbnRlcmNlcHQgbWF0aCBieSBQYXVsIEJvdXJrZSBodHRwOi8vcGF1bGJvdXJrZS5uZXQvZ2VvbWV0cnkvcG9pbnRsaW5lcGxhbmUvXHJcbi8vIERldGVybWluZSB0aGUgaW50ZXJzZWN0aW9uIHBvaW50IG9mIHR3byBsaW5lIHNlZ21lbnRzXHJcbi8vIFJldHVybiBGQUxTRSBpZiB0aGUgbGluZXMgZG9uJ3QgaW50ZXJzZWN0XHJcbmV4cG9ydCBmdW5jdGlvbiBmaW5kSW50ZXJzZWN0aW9uKGVkZ2UxOiBFZGdlLCBlZGdlMjogRWRnZSk6IHVuZGVmaW5lZCB8IFZlY3RvciB7XHJcbiAgICAvLyBDaGVjayBpZiBub25lIG9mIHRoZSBsaW5lcyBhcmUgb2YgbGVuZ3RoIDBcclxuICAgIGlmICgoZWRnZTEucDEueCA9PT0gZWRnZTEucDIueCAmJiBlZGdlMS5wMS55ID09PSBlZGdlMS5wMi55KSB8fCAoZWRnZTIucDEueCA9PT0gZWRnZTIucDIueCAmJiBlZGdlMi5wMS55ID09PSBlZGdlMi5wMi55KSkge1xyXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IGRlbm9taW5hdG9yOiBudW1iZXIgPSAoZWRnZTIucDIueSAtIGVkZ2UyLnAxLnkpICogKGVkZ2UxLnAyLnggLSBlZGdlMS5wMS54KSAtIChlZGdlMi5wMi54IC0gZWRnZTIucDEueCkgKiAoZWRnZTEucDIueSAtIGVkZ2UxLnAxLnkpO1xyXG5cclxuICAgIC8vIExpbmVzIGFyZSBwYXJhbGxlbFxyXG4gICAgaWYgKGRlbm9taW5hdG9yID09PSAwKSB7XHJcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgdWEgPSAoKGVkZ2UyLnAyLnggLSBlZGdlMi5wMS54KSAqIChlZGdlMS5wMS55IC0gZWRnZTIucDEueSkgLSAoZWRnZTIucDIueSAtIGVkZ2UyLnAxLnkpICogKGVkZ2UxLnAxLnggLSBlZGdlMi5wMS54KSkgLyBkZW5vbWluYXRvcjtcclxuICAgIGxldCB1YiA9ICgoZWRnZTEucDIueCAtIGVkZ2UxLnAxLngpICogKGVkZ2UxLnAxLnkgLSBlZGdlMi5wMS55KSAtIChlZGdlMS5wMi55IC0gZWRnZTEucDEueSkgKiAoZWRnZTEucDEueCAtIGVkZ2UyLnAxLngpKSAvIGRlbm9taW5hdG9yO1xyXG5cclxuICAgIC8vIGlzIHRoZSBpbnRlcnNlY3Rpb24gYWxvbmcgdGhlIHNlZ21lbnRzXHJcbiAgICBpZiAodWEgPCAwIHx8IHVhID4gMSB8fCB1YiA8IDAgfHwgdWIgPiAxKSB7XHJcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBSZXR1cm4gYSBvYmplY3Qgd2l0aCB0aGUgeCBhbmQgeSBjb29yZGluYXRlcyBvZiB0aGUgaW50ZXJzZWN0aW9uXHJcbiAgICBsZXQgeCA9IGVkZ2UxLnAxLnggKyB1YSAqIChlZGdlMS5wMi54IC0gZWRnZTEucDEueCk7XHJcbiAgICBsZXQgeSA9IGVkZ2UxLnAxLnkgKyB1YSAqIChlZGdlMS5wMi55IC0gZWRnZTEucDEueSk7XHJcblxyXG4gICAgcmV0dXJuIHsgeCwgeSB9O1xyXG59XHJcbiIsImludGVyZmFjZSBJTGlua2VkTGlzdDxUPiB7XHJcbiAgICBpbnNlcnRBdEJlZ2luKGRhdGE6IFQpOiBOb2RlPFQ+O1xyXG4gICAgaW5zZXJ0QXRFbmQoZGF0YTogVCk6IE5vZGU8VD47XHJcbiAgICBkZWxldGVGaXJzdCgpOiB2b2lkO1xyXG4gICAgZGVsZXRlTGFzdCgpOiB2b2lkO1xyXG4gICAgdHJhdmVyc2UoKTogVFtdO1xyXG4gICAgc2l6ZSgpOiBudW1iZXI7XHJcbiAgICBzZWFyY2goY29tcGFyYXRvcjogKGRhdGE6IFQpID0+IGJvb2xlYW4pOiBOb2RlPFQ+IHwgbnVsbDtcclxufVxyXG5leHBvcnQgY2xhc3MgTGlua2VkTGlzdDxUPiBpbXBsZW1lbnRzIElMaW5rZWRMaXN0PFQ+IHtcclxuICAgIHB1YmxpYyBoZWFkOiBOb2RlPFQ+IHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgcHVibGljIGlmRW1wdHkoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuICF0aGlzLmhlYWQgPyB0cnVlIDogZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGluc2VydEF0RW5kKGRhdGE6IFQpOiBOb2RlPFQ+IHtcclxuICAgICAgICBjb25zdCBub2RlID0gbmV3IE5vZGUoZGF0YSk7XHJcbiAgICAgICAgaWYgKCF0aGlzLmhlYWQpIHtcclxuICAgICAgICAgICAgdGhpcy5oZWFkID0gbm9kZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCBnZXRMYXN0ID0gKG5vZGU6IE5vZGU8VD4pOiBOb2RlPFQ+ID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBub2RlLm5leHQgPyBnZXRMYXN0KG5vZGUubmV4dCkgOiBub2RlO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgY29uc3QgbGFzdE5vZGUgPSBnZXRMYXN0KHRoaXMuaGVhZCk7XHJcbiAgICAgICAgICAgIGxhc3ROb2RlLm5leHQgPSBub2RlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbm9kZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgaW5zZXJ0QXRCZWdpbihkYXRhOiBUKTogTm9kZTxUPiB7XHJcbiAgICAgICAgY29uc3Qgbm9kZSA9IG5ldyBOb2RlKGRhdGEpO1xyXG4gICAgICAgIGlmICghdGhpcy5oZWFkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaGVhZCA9IG5vZGU7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbm9kZS5uZXh0ID0gdGhpcy5oZWFkO1xyXG4gICAgICAgICAgICB0aGlzLmhlYWQgPSBub2RlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbm9kZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZGVsZXRlRmlyc3QoKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHRoaXMuaGVhZCkge1xyXG4gICAgICAgICAgICB0aGlzLmhlYWQgPSB0aGlzLmhlYWQubmV4dDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRlbGV0ZUxhc3QoKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHRoaXMuaGVhZCkge1xyXG4gICAgICAgICAgICB2YXIgbm9kZTogTm9kZTxUPiA9IHRoaXMuaGVhZDtcclxuICAgICAgICAgICAgd2hpbGUgKG5vZGUubmV4dCAhPT0gbnVsbCAmJiBub2RlLm5leHQubmV4dCAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgbm9kZSA9IG5vZGUubmV4dDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBub2RlLm5leHQgPSBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2VhcmNoKGNvbXBhcmF0b3I6IChkYXRhOiBUKSA9PiBib29sZWFuKTogTm9kZTxUPiB8IG51bGwge1xyXG4gICAgICAgIGNvbnN0IGNoZWNrTmV4dCA9IChub2RlOiBOb2RlPFQ+KTogTm9kZTxUPiB8IG51bGwgPT4ge1xyXG4gICAgICAgICAgICBpZiAoY29tcGFyYXRvcihub2RlLmRhdGEpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbm9kZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbm9kZS5uZXh0ID8gY2hlY2tOZXh0KG5vZGUubmV4dCkgOiBudWxsO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmhlYWQgPyBjaGVja05leHQodGhpcy5oZWFkKSA6IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHRyYXZlcnNlKCk6IFRbXSB7XHJcbiAgICAgICAgY29uc3QgYXJyYXk6IFRbXSA9IFtdO1xyXG4gICAgICAgIGlmICghdGhpcy5oZWFkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBhcnJheTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGFkZFRvQXJyYXkgPSAobm9kZTogTm9kZTxUPik6IFRbXSA9PiB7XHJcbiAgICAgICAgICAgIGFycmF5LnB1c2gobm9kZS5kYXRhKTtcclxuICAgICAgICAgICAgcmV0dXJuIG5vZGUubmV4dCA/IGFkZFRvQXJyYXkobm9kZS5uZXh0KSA6IGFycmF5O1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIGFkZFRvQXJyYXkodGhpcy5oZWFkKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2l6ZSgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnRyYXZlcnNlKCkubGVuZ3RoO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydCBjbGFzcyBOb2RlPFQ+IHtcclxuICAgIHB1YmxpYyBuZXh0OiBOb2RlPFQ+IHwgbnVsbCA9IG51bGw7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgZGF0YTogVCkge31cclxufVxyXG4iLCJpbXBvcnQgeyBHYW1lIH0gZnJvbSBcIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9nYW1lXCI7XHJcbmltcG9ydCB7IGFzc2V0TWFuYWdlciB9IGZyb20gXCIuLi8uLi8uLi8uLi8uLi9jbGllbnQvZ2FtZVJlbmRlci9hc3NldG1hbmFnZXJcIjtcclxuaW1wb3J0IHsgZmluZEFuZ2xlLCByb3RhdGVTaGFwZSB9IGZyb20gXCIuLi8uLi8uLi8uLi8uLi9maW5kQW5nbGVcIjtcclxuaW1wb3J0IHsgVmVjdG9yIH0gZnJvbSBcIi4uLy4uLy4uLy4uLy4uL3ZlY3RvclwiO1xyXG5pbXBvcnQgeyBBY3RvclR5cGUgfSBmcm9tIFwiLi4vLi4vLi4vLi4vbmV3QWN0b3JzL2FjdG9yXCI7XHJcbmltcG9ydCB7IENsaWVudERhZ2dlcnMgfSBmcm9tIFwiLi4vLi4vLi4vLi4vbmV3QWN0b3JzL2NsaWVudEFjdG9ycy9jbGllbnRQbGF5ZXIvY2xpZW50Q2xhc3Nlcy9jbGllbnREYWdnZXJzXCI7XHJcbmltcG9ydCB7IERhZ2dlcnNDb250cm9sbGVyIH0gZnJvbSBcIi4uLy4uL2RhZ2dlcnNDb250cm9sbGVyXCI7XHJcbmltcG9ydCB7IFBsYXllclByZXNzQWJpbGl0eSB9IGZyb20gXCIuLi9wbGF5ZXJQcmVzc0FiaWxpdHlcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBEYWdnZXJzTHVuZ2VBYmlsaXR5IGV4dGVuZHMgUGxheWVyUHJlc3NBYmlsaXR5IHtcclxuICAgIGNvbnN0cnVjdG9yKGdhbWU6IEdhbWUsIHByb3RlY3RlZCByZWFkb25seSBwbGF5ZXI6IENsaWVudERhZ2dlcnMsIHByb3RlY3RlZCByZWFkb25seSBjb250cm9sbGVyOiBEYWdnZXJzQ29udHJvbGxlciwgYWJpbGl0eUFycmF5SW5kZXg6IG51bWJlcikge1xyXG4gICAgICAgIHN1cGVyKFxyXG4gICAgICAgICAgICBnYW1lLFxyXG4gICAgICAgICAgICBwbGF5ZXIsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXIsXHJcbiAgICAgICAgICAgIERhZ2dlcnNMdW5nZUFiaWxpdHlEYXRhLmNvb2xkb3duICsgMCxcclxuICAgICAgICAgICAgYXNzZXRNYW5hZ2VyLmltYWdlc1tcImx1bmdlSWNvblwiXSxcclxuICAgICAgICAgICAgRGFnZ2Vyc0x1bmdlQWJpbGl0eURhdGEudG90YWxDYXN0VGltZSArIDAsXHJcbiAgICAgICAgICAgIGFiaWxpdHlBcnJheUluZGV4LFxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgYXR0ZW1wdEZ1bmMoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKHRoaXMuY29vbGRvd24gPT09IDApIHJldHVybiB0cnVlO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBwcmVzc0Z1bmMoZ2xvYmFsTW91c2VQb3M6IFZlY3Rvcikge1xyXG4gICAgICAgIHRoaXMuY29udHJvbGxlci5zZXRDdXJyZW50Q2FzdGluZ0FiaWxpdHkodGhpcy5hYmlsaXR5QXJyYXlJbmRleCk7XHJcbiAgICAgICAgdGhpcy5jb29sZG93biA9IHRoaXMudG90YWxDb29sZG93biArIDA7XHJcbiAgICAgICAgdGhpcy5hbmdsZSA9IGZpbmRBbmdsZSh0aGlzLnBsYXllci5wb3NpdGlvbiwgZ2xvYmFsTW91c2VQb3MpO1xyXG4gICAgICAgIHRoaXMuY2FzdGluZyA9IHRydWU7XHJcbiAgICAgICAgLy9ubyBzdXBlciBjYWxsIGJlY2F1c2UgaXQgZG9lc24ndCBzZXQgdGhlIGdsb2JhbCBjb29sZG93blxyXG5cclxuICAgICAgICB0aGlzLnBsYXllci5wZXJmb3JtQ2xpZW50QWJpbGl0eVtcImx1bmdlXCJdKGdsb2JhbE1vdXNlUG9zKTtcclxuICAgICAgICB0aGlzLmNvbnRyb2xsZXIuc2VuZFNlcnZlckRhZ2dlcnNBYmlsaXR5KFwibHVuZ2VcIiwgdHJ1ZSwgZ2xvYmFsTW91c2VQb3MpO1xyXG4gICAgfVxyXG5cclxuICAgIGNhc3RVcGRhdGVGdW5jKGVsYXBzZWRUaW1lOiBudW1iZXIpIHtcclxuICAgICAgICBzdXBlci5jYXN0VXBkYXRlRnVuYyhlbGFwc2VkVGltZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldEljb25Db29sZG93blBlcmNlbnQoKTogbnVtYmVyIHtcclxuICAgICAgICBpZiAodGhpcy5jb29sZG93biAhPT0gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jb29sZG93biAvIHRoaXMudG90YWxDb29sZG93bjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IERhZ2dlcnNMdW5nZUFiaWxpdHlEYXRhID0ge1xyXG4gICAgY29vbGRvd246IDMsXHJcbiAgICB0b3RhbENhc3RUaW1lOiAwLjIsXHJcbn07XHJcbiIsImltcG9ydCB7IEdhbWUgfSBmcm9tIFwiLi4vLi4vLi4vLi4vLi4vY2xpZW50L2dhbWVcIjtcclxuaW1wb3J0IHsgYXNzZXRNYW5hZ2VyIH0gZnJvbSBcIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9nYW1lUmVuZGVyL2Fzc2V0bWFuYWdlclwiO1xyXG5pbXBvcnQgeyBmaW5kQW5nbGUsIHJvdGF0ZVNoYXBlIH0gZnJvbSBcIi4uLy4uLy4uLy4uLy4uL2ZpbmRBbmdsZVwiO1xyXG5pbXBvcnQgeyBWZWN0b3IgfSBmcm9tIFwiLi4vLi4vLi4vLi4vLi4vdmVjdG9yXCI7XHJcbmltcG9ydCB7IEFjdG9yVHlwZSB9IGZyb20gXCIuLi8uLi8uLi8uLi9uZXdBY3RvcnMvYWN0b3JcIjtcclxuaW1wb3J0IHsgQ2xpZW50RGFnZ2VycyB9IGZyb20gXCIuLi8uLi8uLi8uLi9uZXdBY3RvcnMvY2xpZW50QWN0b3JzL2NsaWVudFBsYXllci9jbGllbnRDbGFzc2VzL2NsaWVudERhZ2dlcnNcIjtcclxuaW1wb3J0IHsgRGFnZ2Vyc0NvbnRyb2xsZXIgfSBmcm9tIFwiLi4vLi4vZGFnZ2Vyc0NvbnRyb2xsZXJcIjtcclxuaW1wb3J0IHsgUGxheWVyUHJlc3NBYmlsaXR5IH0gZnJvbSBcIi4uL3BsYXllclByZXNzQWJpbGl0eVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIERhZ2dlcnNTdGFiQWJpbGl0eSBleHRlbmRzIFBsYXllclByZXNzQWJpbGl0eSB7XHJcbiAgICBjb25zdHJ1Y3RvcihnYW1lOiBHYW1lLCBwcm90ZWN0ZWQgcmVhZG9ubHkgcGxheWVyOiBDbGllbnREYWdnZXJzLCBwcm90ZWN0ZWQgcmVhZG9ubHkgY29udHJvbGxlcjogRGFnZ2Vyc0NvbnRyb2xsZXIsIGFiaWxpdHlBcnJheUluZGV4OiBudW1iZXIpIHtcclxuICAgICAgICBzdXBlcihcclxuICAgICAgICAgICAgZ2FtZSxcclxuICAgICAgICAgICAgcGxheWVyLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyLFxyXG4gICAgICAgICAgICBEYWdnZXJzU3RhYkFiaWxpdHlEYXRhLmNvb2xkb3duICsgMCxcclxuICAgICAgICAgICAgYXNzZXRNYW5hZ2VyLmltYWdlc1tcInN0YWJJY29uXCJdLFxyXG4gICAgICAgICAgICBEYWdnZXJzU3RhYkFiaWxpdHlEYXRhLnRvdGFsQ2FzdFRpbWUgKyAwLFxyXG4gICAgICAgICAgICBhYmlsaXR5QXJyYXlJbmRleCxcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIHByZXNzRnVuYyhnbG9iYWxNb3VzZVBvczogVmVjdG9yKSB7XHJcbiAgICAgICAgc3VwZXIucHJlc3NGdW5jKGdsb2JhbE1vdXNlUG9zKTtcclxuICAgICAgICB0aGlzLnBsYXllci5wZXJmb3JtQ2xpZW50QWJpbGl0eVtcInN0YWJcIl0oZ2xvYmFsTW91c2VQb3MpO1xyXG5cclxuICAgICAgICB0aGlzLmNvbnRyb2xsZXIuc2VuZFNlcnZlckRhZ2dlcnNBYmlsaXR5KFwic3RhYlwiLCB0cnVlLCBnbG9iYWxNb3VzZVBvcyk7XHJcbiAgICB9XHJcblxyXG4gICAgY2FzdFVwZGF0ZUZ1bmMoZWxhcHNlZFRpbWU6IG51bWJlcikge1xyXG4gICAgICAgIHN1cGVyLmNhc3RVcGRhdGVGdW5jKGVsYXBzZWRUaW1lKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuY2FzdFN0YWdlID4gRGFnZ2Vyc1N0YWJBYmlsaXR5RGF0YS5oaXREZXRlY3RGcmFtZSAmJiB0aGlzLmNhc3RTdGFnZSAtIGVsYXBzZWRUaW1lIDwgRGFnZ2Vyc1N0YWJBYmlsaXR5RGF0YS5oaXREZXRlY3RGcmFtZSkge1xyXG4gICAgICAgICAgICBsZXQgYWN0b3JzOiB7XHJcbiAgICAgICAgICAgICAgICBhY3RvclR5cGU6IEFjdG9yVHlwZTtcclxuICAgICAgICAgICAgICAgIGFjdG9ySWQ6IG51bWJlcjtcclxuICAgICAgICAgICAgICAgIGFuZ2xlOiBudW1iZXI7XHJcbiAgICAgICAgICAgIH1bXSA9IFtdO1xyXG5cclxuICAgICAgICAgICAgbGV0IHNoYXBlOiBWZWN0b3JbXSA9IHJvdGF0ZVNoYXBlKERhZ2dlcnNTdGFiSGl0U2hhcGUsIHRoaXMuYW5nbGUsIHRoaXMucGxheWVyLnBvc2l0aW9uLCBmYWxzZSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmdsb2JhbEFjdG9ycy5hY3RvcnMuZm9yRWFjaCgoYWN0b3IpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChhY3Rvci5nZXRBY3RvcklkKCkgIT09IHRoaXMucGxheWVyLmdldEFjdG9ySWQoKSAmJiBhY3Rvci5pZkluc2lkZUxhcmdlclNoYXBlKHNoYXBlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGFjdG9ycy5wdXNoKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWN0b3JUeXBlOiBhY3Rvci5nZXRBY3RvclR5cGUoKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWN0b3JJZDogYWN0b3IuZ2V0QWN0b3JJZCgpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhbmdsZTogdGhpcy5hbmdsZSxcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoYWN0b3JzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5nYW1lUmVuZGVyZXIuc2NyZWVuWm9vbSgxLjA2KTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5zZXJ2ZXJUYWxrZXIuc2VuZE1lc3NhZ2Uoe1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiY2xpZW50RGFnZ2Vyc01lc3NhZ2VcIixcclxuICAgICAgICAgICAgICAgICAgICBvcmlnaW5JZDogdGhpcy5wbGF5ZXIuZ2V0QWN0b3JJZCgpLFxyXG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiB0aGlzLnBsYXllci5wb3NpdGlvbixcclxuICAgICAgICAgICAgICAgICAgICBtb21lbnR1bTogdGhpcy5wbGF5ZXIubW9tZW50dW0sXHJcbiAgICAgICAgICAgICAgICAgICAgbXNnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiY2xpZW50RGFnZ2Vyc1N0YWJIaXRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWN0b3JzLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBDbGllbnREYWdnZXJzU3RhYkhpdCB7XHJcbiAgICB0eXBlOiBcImNsaWVudERhZ2dlcnNTdGFiSGl0XCI7XHJcbiAgICBhY3RvcnM6IHtcclxuICAgICAgICBhY3RvclR5cGU6IEFjdG9yVHlwZTtcclxuICAgICAgICBhY3RvcklkOiBudW1iZXI7XHJcbiAgICAgICAgYW5nbGU6IG51bWJlcjtcclxuICAgIH1bXTtcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IERhZ2dlcnNTdGFiSGl0U2hhcGU6IFZlY3RvcltdID0gW1xyXG4gICAgeyB4OiAtMTAsIHk6IC00MCB9LFxyXG4gICAgeyB4OiAxMzAsIHk6IC0zMCB9LFxyXG4gICAgeyB4OiAxMzAsIHk6IDMwIH0sXHJcbiAgICB7IHg6IC0xMCwgeTogNDAgfSxcclxuXTtcclxuXHJcbmNvbnN0IERhZ2dlcnNTdGFiQWJpbGl0eURhdGEgPSB7XHJcbiAgICBjb29sZG93bjogMC4zLFxyXG4gICAgdG90YWxDYXN0VGltZTogMC41LFxyXG4gICAgaGl0RGV0ZWN0RnJhbWU6IDAuMSxcclxufTtcclxuIiwiaW1wb3J0IHsgR2FtZSB9IGZyb20gXCIuLi8uLi8uLi8uLi9jbGllbnQvZ2FtZVwiO1xyXG5pbXBvcnQgeyBhc3NldE1hbmFnZXIgfSBmcm9tIFwiLi4vLi4vLi4vLi4vY2xpZW50L2dhbWVSZW5kZXIvYXNzZXRtYW5hZ2VyXCI7XHJcbmltcG9ydCB7IFZlY3RvciB9IGZyb20gXCIuLi8uLi8uLi8uLi92ZWN0b3JcIjtcclxuaW1wb3J0IHsgQ2xpZW50UGxheWVyIH0gZnJvbSBcIi4uLy4uLy4uL25ld0FjdG9ycy9jbGllbnRBY3RvcnMvY2xpZW50UGxheWVyL2NsaWVudFBsYXllclwiO1xyXG5pbXBvcnQgeyBDb250cm9sbGVyIH0gZnJvbSBcIi4uL2NvbnRyb2xsZXJcIjtcclxuaW1wb3J0IHsgUGxheWVyUHJlc3NBYmlsaXR5IH0gZnJvbSBcIi4vcGxheWVyUHJlc3NBYmlsaXR5XCI7XHJcblxyXG5mdW5jdGlvbiBnZXRFbXB0eUFiaWxpdHlJY29uKGluZGV4OiBudW1iZXIpOiBIVE1MSW1hZ2VFbGVtZW50IHtcclxuICAgIGlmIChpbmRleCA9PT0gMikge1xyXG4gICAgICAgIHJldHVybiBhc3NldE1hbmFnZXIuaW1hZ2VzW1wibHZsNlwiXTtcclxuICAgIH0gZWxzZSBpZiAoaW5kZXggPT09IDMpIHtcclxuICAgICAgICByZXR1cm4gYXNzZXRNYW5hZ2VyLmltYWdlc1tcImx2bDEwXCJdO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gYXNzZXRNYW5hZ2VyLmltYWdlc1tcImVtcHR5SWNvblwiXTtcclxuICAgIH1cclxufVxyXG5leHBvcnQgY2xhc3MgRW1wdHlBYmlsaXR5IGV4dGVuZHMgUGxheWVyUHJlc3NBYmlsaXR5IHtcclxuICAgIGNvbnN0cnVjdG9yKGdhbWU6IEdhbWUsIHBsYXllcjogQ2xpZW50UGxheWVyLCBjb250cm9sbGVyOiBDb250cm9sbGVyLCBhYmlsaXR5QXJyYXlJbmRleDogbnVtYmVyKSB7XHJcbiAgICAgICAgc3VwZXIoZ2FtZSwgcGxheWVyLCBjb250cm9sbGVyLCAwLCBnZXRFbXB0eUFiaWxpdHlJY29uKGFiaWxpdHlBcnJheUluZGV4KSwgMCwgYWJpbGl0eUFycmF5SW5kZXgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByZXNzRnVuYyhnbG9iYWxNb3VzZVBvczogVmVjdG9yKSB7fVxyXG4gICAgY2FzdFVwZGF0ZUZ1bmMoZWxhcHNlZFRpbWU6IG51bWJlcikge31cclxuICAgIHN0b3BGdW5jKCkge31cclxufVxyXG4iLCJpbXBvcnQgeyBHYW1lIH0gZnJvbSBcIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9nYW1lXCI7XHJcbmltcG9ydCB7IGFzc2V0TWFuYWdlciB9IGZyb20gXCIuLi8uLi8uLi8uLi8uLi9jbGllbnQvZ2FtZVJlbmRlci9hc3NldG1hbmFnZXJcIjtcclxuaW1wb3J0IHsgZmluZEFuZ2xlIH0gZnJvbSBcIi4uLy4uLy4uLy4uLy4uL2ZpbmRBbmdsZVwiO1xyXG5pbXBvcnQgeyBWZWN0b3IgfSBmcm9tIFwiLi4vLi4vLi4vLi4vLi4vdmVjdG9yXCI7XHJcbmltcG9ydCB7IENsaWVudEhhbW1lciB9IGZyb20gXCIuLi8uLi8uLi8uLi9uZXdBY3RvcnMvY2xpZW50QWN0b3JzL2NsaWVudFBsYXllci9jbGllbnRDbGFzc2VzL2NsaWVudEhhbW1lclwiO1xyXG5pbXBvcnQgeyBIYW1tZXJDb250cm9sbGVyIH0gZnJvbSBcIi4uLy4uL2hhbW1lckNvbnRyb2xsZXJcIjtcclxuaW1wb3J0IHsgUGxheWVyUHJlc3NBYmlsaXR5IH0gZnJvbSBcIi4uL3BsYXllclByZXNzQWJpbGl0eVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEhhbW1lclBvdW5kQWJpbGl0eSBleHRlbmRzIFBsYXllclByZXNzQWJpbGl0eSB7XHJcbiAgICBjb25zdHJ1Y3RvcihnYW1lOiBHYW1lLCBwcm90ZWN0ZWQgcmVhZG9ubHkgcGxheWVyOiBDbGllbnRIYW1tZXIsIHByb3RlY3RlZCByZWFkb25seSBjb250cm9sbGVyOiBIYW1tZXJDb250cm9sbGVyLCBhYmlsaXR5QXJyYXlJbmRleDogbnVtYmVyKSB7XHJcbiAgICAgICAgc3VwZXIoZ2FtZSwgcGxheWVyLCBjb250cm9sbGVyLCBIYW1tZXJQb3VuZEFiaWxpdHlEYXRhLmNvb2xkb3duICsgMCwgYXNzZXRNYW5hZ2VyLmltYWdlc1tcInBvdW5kSWNvblwiXSwgMCwgYWJpbGl0eUFycmF5SW5kZXgpO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZUZ1bmMoZWxhcHNlZFRpbWU6IG51bWJlcikge1xyXG4gICAgICAgIGlmICh0aGlzLmNhc3RTdGFnZSAhPT0gMCkgcmV0dXJuO1xyXG4gICAgICAgIHN1cGVyLnVwZGF0ZUZ1bmMoZWxhcHNlZFRpbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHByZXNzRnVuYygpIHtcclxuICAgICAgICB0aGlzLmNvbnRyb2xsZXIuc2V0Q3VycmVudENhc3RpbmdBYmlsaXR5KHRoaXMuYWJpbGl0eUFycmF5SW5kZXgpO1xyXG4gICAgICAgIHRoaXMuY29udHJvbGxlci5zZXROZWdhdGl2ZUdsb2JhbENvb2xkb3duKCk7XHJcbiAgICAgICAgdGhpcy5jb29sZG93biA9IHRoaXMudG90YWxDb29sZG93biArIDA7XHJcbiAgICAgICAgdGhpcy5jYXN0aW5nID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBjYXN0VXBkYXRlRnVuYyhlbGFwc2VkVGltZTogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucGxheWVyLmFjdG9yT2JqZWN0LnN0YW5kaW5nKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RvcEZ1bmMoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3RvcEZ1bmMoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY2FzdGluZykge1xyXG4gICAgICAgICAgICB0aGlzLmdhbWUuZ2FtZVJlbmRlcmVyLnNjcmVlblpvb20oMS4yLCAxMCk7XHJcbiAgICAgICAgICAgIHRoaXMuY29udHJvbGxlci5zZXRHbG9iYWxDb29sZG93bih0aGlzLmdsb2JhbENvb2xkb3duVGltZSAqIDIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBzdXBlci5zdG9wRnVuYygpO1xyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBIYW1tZXJQb3VuZEFiaWxpdHlEYXRhID0ge1xyXG4gICAgY29vbGRvd246IDQsXHJcbiAgICB0b3RhbFBvdW5kaW5nVGltZTogMixcclxufTtcclxuIiwiaW1wb3J0IHsgR2FtZSB9IGZyb20gXCIuLi8uLi8uLi8uLi8uLi9jbGllbnQvZ2FtZVwiO1xyXG5pbXBvcnQgeyBhc3NldE1hbmFnZXIgfSBmcm9tIFwiLi4vLi4vLi4vLi4vLi4vY2xpZW50L2dhbWVSZW5kZXIvYXNzZXRtYW5hZ2VyXCI7XHJcbmltcG9ydCB7IGZpbmRBbmdsZSB9IGZyb20gXCIuLi8uLi8uLi8uLi8uLi9maW5kQW5nbGVcIjtcclxuaW1wb3J0IHsgcm90YXRlU2hhcGUsIFZlY3RvciB9IGZyb20gXCIuLi8uLi8uLi8uLi8uLi92ZWN0b3JcIjtcclxuaW1wb3J0IHsgQWN0b3JUeXBlIH0gZnJvbSBcIi4uLy4uLy4uLy4uL25ld0FjdG9ycy9hY3RvclwiO1xyXG5pbXBvcnQgeyBDbGllbnRBY3RvciwgcmVuZGVyU2hhcGUgfSBmcm9tIFwiLi4vLi4vLi4vLi4vbmV3QWN0b3JzL2NsaWVudEFjdG9ycy9jbGllbnRBY3RvclwiO1xyXG5pbXBvcnQgeyBDbGllbnRIYW1tZXIgfSBmcm9tIFwiLi4vLi4vLi4vLi4vbmV3QWN0b3JzL2NsaWVudEFjdG9ycy9jbGllbnRQbGF5ZXIvY2xpZW50Q2xhc3Nlcy9jbGllbnRIYW1tZXJcIjtcclxuaW1wb3J0IHsgQ29udHJvbGxlciB9IGZyb20gXCIuLi8uLi9jb250cm9sbGVyXCI7XHJcbmltcG9ydCB7IEhhbW1lckNvbnRyb2xsZXIgfSBmcm9tIFwiLi4vLi4vaGFtbWVyQ29udHJvbGxlclwiO1xyXG5pbXBvcnQgeyBQbGF5ZXJQcmVzc0FiaWxpdHkgfSBmcm9tIFwiLi4vcGxheWVyUHJlc3NBYmlsaXR5XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgSGFtbWVyU3dpbmdBYmlsaXR5IGV4dGVuZHMgUGxheWVyUHJlc3NBYmlsaXR5IHtcclxuICAgIGNvbnN0cnVjdG9yKGdhbWU6IEdhbWUsIHByb3RlY3RlZCByZWFkb25seSBwbGF5ZXI6IENsaWVudEhhbW1lciwgcHJvdGVjdGVkIHJlYWRvbmx5IGNvbnRyb2xsZXI6IEhhbW1lckNvbnRyb2xsZXIsIGFiaWxpdHlBcnJheUluZGV4OiBudW1iZXIpIHtcclxuICAgICAgICBzdXBlcihcclxuICAgICAgICAgICAgZ2FtZSxcclxuICAgICAgICAgICAgcGxheWVyLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyLFxyXG4gICAgICAgICAgICBIYW1tZXJTd2luZ0FiaWxpdHlEYXRhLmNvb2xkb3duICsgMCxcclxuICAgICAgICAgICAgYXNzZXRNYW5hZ2VyLmltYWdlc1tcInN3aW5nSWNvblwiXSxcclxuICAgICAgICAgICAgSGFtbWVyU3dpbmdBYmlsaXR5RGF0YS50b3RhbENhc3RUaW1lICsgMCxcclxuICAgICAgICAgICAgYWJpbGl0eUFycmF5SW5kZXgsXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBwcmVzc0Z1bmMoZ2xvYmFsTW91c2VQb3M6IFZlY3Rvcikge1xyXG4gICAgICAgIHN1cGVyLnByZXNzRnVuYyhnbG9iYWxNb3VzZVBvcyk7XHJcbiAgICAgICAgdGhpcy5wbGF5ZXIucGVyZm9ybUNsaWVudEFiaWxpdHlbXCJzd2luZ1wiXShnbG9iYWxNb3VzZVBvcyk7XHJcblxyXG4gICAgICAgIHRoaXMuY29udHJvbGxlci5zZW5kU2VydmVySGFtbWVyQWJpbGl0eShcInN3aW5nXCIsIHRydWUsIGdsb2JhbE1vdXNlUG9zKTtcclxuICAgIH1cclxuICAgIGNhc3RVcGRhdGVGdW5jKGVsYXBzZWRUaW1lOiBudW1iZXIpIHtcclxuICAgICAgICBzdXBlci5jYXN0VXBkYXRlRnVuYyhlbGFwc2VkVGltZSk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmNhc3RTdGFnZSA+IEhhbW1lclN3aW5nQWJpbGl0eURhdGEuaGl0RGV0ZWN0RnJhbWUgJiYgdGhpcy5jYXN0U3RhZ2UgLSBlbGFwc2VkVGltZSA8IEhhbW1lclN3aW5nQWJpbGl0eURhdGEuaGl0RGV0ZWN0RnJhbWUpIHtcclxuICAgICAgICAgICAgbGV0IGFjdG9yczoge1xyXG4gICAgICAgICAgICAgICAgYWN0b3JUeXBlOiBBY3RvclR5cGU7XHJcbiAgICAgICAgICAgICAgICBhY3RvcklkOiBudW1iZXI7XHJcbiAgICAgICAgICAgICAgICBhbmdsZTogbnVtYmVyO1xyXG4gICAgICAgICAgICB9W10gPSBbXTtcclxuXHJcbiAgICAgICAgICAgIGxldCBzaGFwZTogVmVjdG9yW10gPSByb3RhdGVTaGFwZShIYW1tZXJTd2luZ0hpdFNoYXBlLCB0aGlzLmFuZ2xlLCB0aGlzLnBsYXllci5wb3NpdGlvbiwgZmFsc2UpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5nbG9iYWxBY3RvcnMuYWN0b3JzLmZvckVhY2goKGFjdG9yKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYWN0b3IuZ2V0QWN0b3JJZCgpICE9PSB0aGlzLnBsYXllci5nZXRBY3RvcklkKCkgJiYgYWN0b3IuaWZJbnNpZGVMYXJnZXJTaGFwZShzaGFwZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBhY3RvcnMucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjdG9yVHlwZTogYWN0b3IuZ2V0QWN0b3JUeXBlKCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjdG9ySWQ6IGFjdG9yLmdldEFjdG9ySWQoKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYW5nbGU6IHRoaXMuYW5nbGUsXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaWYgKGFjdG9ycy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWUuZ2FtZVJlbmRlcmVyLnNjcmVlblpvb20oMS4xLCA3KTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5zZXJ2ZXJUYWxrZXIuc2VuZE1lc3NhZ2Uoe1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiY2xpZW50SGFtbWVyTWVzc2FnZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIG9yaWdpbklkOiB0aGlzLnBsYXllci5nZXRBY3RvcklkKCksXHJcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IHRoaXMucGxheWVyLnBvc2l0aW9uLFxyXG4gICAgICAgICAgICAgICAgICAgIG1vbWVudHVtOiB0aGlzLnBsYXllci5tb21lbnR1bSxcclxuICAgICAgICAgICAgICAgICAgICBtc2c6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJjbGllbnRIYW1tZXJTd2luZ0hpdFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhY3RvcnMsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIENsaWVudEhhbW1lclN3aW5nSGl0IHtcclxuICAgIHR5cGU6IFwiY2xpZW50SGFtbWVyU3dpbmdIaXRcIjtcclxuICAgIGFjdG9yczoge1xyXG4gICAgICAgIGFjdG9yVHlwZTogQWN0b3JUeXBlO1xyXG4gICAgICAgIGFjdG9ySWQ6IG51bWJlcjtcclxuICAgICAgICBhbmdsZTogbnVtYmVyO1xyXG4gICAgfVtdO1xyXG59XHJcblxyXG5leHBvcnQgY29uc3QgSGFtbWVyU3dpbmdIaXRTaGFwZTogVmVjdG9yW10gPSBbXHJcbiAgICB7IHg6IC0xMCwgeTogLTMwIH0sXHJcbiAgICB7IHg6IDcsIHk6IC04MCB9LFxyXG4gICAgeyB4OiAxMDAsIHk6IC01NSB9LFxyXG4gICAgeyB4OiAxMTAsIHk6IDIwIH0sXHJcbiAgICB7IHg6IDc1LCB5OiA1NSB9LFxyXG4gICAgeyB4OiAxMCwgeTogNzAgfSxcclxuXTtcclxuXHJcbmNvbnN0IEhhbW1lclN3aW5nQWJpbGl0eURhdGEgPSB7XHJcbiAgICBjb29sZG93bjogMC41LFxyXG4gICAgdG90YWxDYXN0VGltZTogMC44LFxyXG4gICAgaGl0RGV0ZWN0RnJhbWU6IDAuMixcclxufTtcclxuIiwiaW1wb3J0IHsgR2FtZSwgR2xvYmFsQ2xpZW50QWN0b3JzIH0gZnJvbSBcIi4uLy4uLy4uLy4uL2NsaWVudC9nYW1lXCI7XHJcbmltcG9ydCB7IFZlY3RvciB9IGZyb20gXCIuLi8uLi8uLi8uLi92ZWN0b3JcIjtcclxuaW1wb3J0IHsgZGVmYXVsdEFjdG9yQ29uZmlnIH0gZnJvbSBcIi4uLy4uLy4uL25ld0FjdG9ycy9hY3RvckNvbmZpZ1wiO1xyXG5pbXBvcnQgeyBDbGllbnRQbGF5ZXIgfSBmcm9tIFwiLi4vLi4vLi4vbmV3QWN0b3JzL2NsaWVudEFjdG9ycy9jbGllbnRQbGF5ZXIvY2xpZW50UGxheWVyXCI7XHJcbmltcG9ydCB7IENvbnRyb2xsZXIgfSBmcm9tIFwiLi4vY29udHJvbGxlclwiO1xyXG5cclxuZXhwb3J0IHR5cGUgUGxheWVyQWJpbGl0eVR5cGUgPSBcInByZXNzXCIgfCBcImhvbGRcIjtcclxuXHJcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBQbGF5ZXJBYmlsaXR5IHtcclxuICAgIHB1YmxpYyBhYnN0cmFjdCB0eXBlOiBQbGF5ZXJBYmlsaXR5VHlwZTtcclxuXHJcbiAgICBwdWJsaWMgY29vbGRvd246IG51bWJlciA9IDA7XHJcbiAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgZ2xvYmFsQ29vbGRvd25UaW1lOiBudW1iZXI7XHJcblxyXG4gICAgcHJvdGVjdGVkIGNhc3RTdGFnZTogbnVtYmVyID0gMDtcclxuICAgIHByb3RlY3RlZCBjYXN0aW5nOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgcHJvdGVjdGVkIGdsb2JhbEFjdG9yczogR2xvYmFsQ2xpZW50QWN0b3JzO1xyXG5cclxuICAgIHByb3RlY3RlZCBhbmdsZTogbnVtYmVyID0gMDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSB0b3RhbENhc3RUaW1lIGlzIHJlZmVyZW5jZWQgYnkgdGhlIGFiaWxpdHkgdG8ga25vdyB3aGVuIHRvIGNhbGwgc3RvcEZ1bmMgb3IgcmVsZWFzZUZ1bmNcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgcHJvdGVjdGVkIHJlYWRvbmx5IGdhbWU6IEdhbWUsXHJcbiAgICAgICAgcHJvdGVjdGVkIHJlYWRvbmx5IHBsYXllcjogQ2xpZW50UGxheWVyLFxyXG4gICAgICAgIHByb3RlY3RlZCByZWFkb25seSBjb250cm9sbGVyOiBDb250cm9sbGVyLFxyXG4gICAgICAgIHB1YmxpYyByZWFkb25seSB0b3RhbENvb2xkb3duOiBudW1iZXIsXHJcbiAgICAgICAgcHVibGljIGltZzogSFRNTEltYWdlRWxlbWVudCxcclxuICAgICAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgdG90YWxDYXN0VGltZTogbnVtYmVyLFxyXG4gICAgICAgIHByb3RlY3RlZCByZWFkb25seSBhYmlsaXR5QXJyYXlJbmRleDogbnVtYmVyLFxyXG4gICAgKSB7XHJcbiAgICAgICAgdGhpcy5nbG9iYWxBY3RvcnMgPSB0aGlzLmdhbWUuZ2V0R2xvYmFsQWN0b3JzKCk7XHJcblxyXG4gICAgICAgIHRoaXMuZ2xvYmFsQ29vbGRvd25UaW1lID0gZGVmYXVsdEFjdG9yQ29uZmlnLmdsb2JhbENvb2xkb3duO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhdHRlbXB0RnVuYygpOiBib29sZWFuIHtcclxuICAgICAgICBpZiAodGhpcy5jb250cm9sbGVyLmdsb2JhbENvb2xkb3duID09PSAwICYmIHRoaXMuY29vbGRvd24gPT09IDApIHJldHVybiB0cnVlO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIHB1YmxpYyB1cGRhdGVGdW5jKGVsYXBzZWRUaW1lOiBudW1iZXIpIHtcclxuICAgICAgICBpZiAodGhpcy5jb29sZG93biA+IDApIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY29vbGRvd24gPiB0aGlzLnRvdGFsQ29vbGRvd24pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29vbGRvd24gPSB0aGlzLnRvdGFsQ29vbGRvd24gKyAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuY29vbGRvd24gLT0gZWxhcHNlZFRpbWU7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNvb2xkb3duIDwgMCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb29sZG93biA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgcHJlc3NGdW5jKGdsb2JhbE1vdXNlUG9zOiBWZWN0b3IpOiB2b2lkO1xyXG4gICAgcHVibGljIGFic3RyYWN0IGNhc3RVcGRhdGVGdW5jKGVsYXBzZWRUaW1lOiBudW1iZXIpOiB2b2lkO1xyXG4gICAgcHVibGljIGFic3RyYWN0IHN0b3BGdW5jKCk6IHZvaWQ7XHJcblxyXG4gICAgcHJvdGVjdGVkIHJlc2V0QWJpbGl0eSgpIHtcclxuICAgICAgICB0aGlzLmNhc3RTdGFnZSA9IDA7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldEljb25Db29sZG93blBlcmNlbnQoKTogbnVtYmVyIHtcclxuICAgICAgICBpZiAodGhpcy5jb250cm9sbGVyLmdsb2JhbENvb2xkb3duIDwgMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gMTtcclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuY29vbGRvd24gIT09IDAgfHwgdGhpcy5jb250cm9sbGVyLmdsb2JhbENvb2xkb3duICE9PSAwKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNvbnRyb2xsZXIuZ2xvYmFsQ29vbGRvd24gPiB0aGlzLmNvb2xkb3duKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jb250cm9sbGVyLmdsb2JhbENvb2xkb3duIC8gZGVmYXVsdEFjdG9yQ29uZmlnLmdsb2JhbENvb2xkb3duO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29vbGRvd24gLyB0aGlzLnRvdGFsQ29vbGRvd247XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgR2FtZSB9IGZyb20gXCIuLi8uLi8uLi8uLi9jbGllbnQvZ2FtZVwiO1xyXG5pbXBvcnQgeyBWZWN0b3IgfSBmcm9tIFwiLi4vLi4vLi4vLi4vdmVjdG9yXCI7XHJcbmltcG9ydCB7IENsaWVudFBsYXllciB9IGZyb20gXCIuLi8uLi8uLi9uZXdBY3RvcnMvY2xpZW50QWN0b3JzL2NsaWVudFBsYXllci9jbGllbnRQbGF5ZXJcIjtcclxuaW1wb3J0IHsgQ29udHJvbGxlciB9IGZyb20gXCIuLi9jb250cm9sbGVyXCI7XHJcbmltcG9ydCB7IFBsYXllckFiaWxpdHksIFBsYXllckFiaWxpdHlUeXBlIH0gZnJvbSBcIi4vcGxheWVyQWJpbGl0eVwiO1xyXG5cclxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFBsYXllckhvbGRBYmlsaXR5IGV4dGVuZHMgUGxheWVyQWJpbGl0eSB7XHJcbiAgICB0eXBlOiBQbGF5ZXJBYmlsaXR5VHlwZSA9IFwiaG9sZFwiO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIGdhbWU6IEdhbWUsXHJcbiAgICAgICAgcGxheWVyOiBDbGllbnRQbGF5ZXIsXHJcbiAgICAgICAgY29udHJvbGxlcjogQ29udHJvbGxlcixcclxuICAgICAgICB0b3RhbENvb2xkb3duOiBudW1iZXIsXHJcbiAgICAgICAgaW1nOiBIVE1MSW1hZ2VFbGVtZW50LFxyXG4gICAgICAgIHRvdGFsQ2FzdFRpbWU6IG51bWJlcixcclxuICAgICAgICBhYmlsaXR5QXJyYXlJbmRleDogbnVtYmVyLFxyXG4gICAgKSB7XHJcbiAgICAgICAgc3VwZXIoZ2FtZSwgcGxheWVyLCBjb250cm9sbGVyLCB0b3RhbENvb2xkb3duLCBpbWcsIHRvdGFsQ2FzdFRpbWUsIGFiaWxpdHlBcnJheUluZGV4KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgcmVsZWFzZUZ1bmMoKTogdm9pZDtcclxuICAgIHB1YmxpYyB1cGRhdGVGdW5jKGVsYXBzZWRUaW1lOiBudW1iZXIpIHtcclxuICAgICAgICBpZiAodGhpcy5jYXN0U3RhZ2UgIT09IDApIHJldHVybjtcclxuICAgICAgICBzdXBlci51cGRhdGVGdW5jKGVsYXBzZWRUaW1lKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBHYW1lIH0gZnJvbSBcIi4uLy4uLy4uLy4uL2NsaWVudC9nYW1lXCI7XHJcbmltcG9ydCB7IGZpbmRBbmdsZSB9IGZyb20gXCIuLi8uLi8uLi8uLi9maW5kQW5nbGVcIjtcclxuaW1wb3J0IHsgVmVjdG9yIH0gZnJvbSBcIi4uLy4uLy4uLy4uL3ZlY3RvclwiO1xyXG5pbXBvcnQgeyBDbGllbnRQbGF5ZXIgfSBmcm9tIFwiLi4vLi4vLi4vbmV3QWN0b3JzL2NsaWVudEFjdG9ycy9jbGllbnRQbGF5ZXIvY2xpZW50UGxheWVyXCI7XHJcbmltcG9ydCB7IENvbnRyb2xsZXIgfSBmcm9tIFwiLi4vY29udHJvbGxlclwiO1xyXG5pbXBvcnQgeyBQbGF5ZXJBYmlsaXR5LCBQbGF5ZXJBYmlsaXR5VHlwZSB9IGZyb20gXCIuL3BsYXllckFiaWxpdHlcIjtcclxuXHJcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBQbGF5ZXJQcmVzc0FiaWxpdHkgZXh0ZW5kcyBQbGF5ZXJBYmlsaXR5IHtcclxuICAgIHR5cGU6IFBsYXllckFiaWxpdHlUeXBlID0gXCJwcmVzc1wiO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIGdhbWU6IEdhbWUsXHJcbiAgICAgICAgcGxheWVyOiBDbGllbnRQbGF5ZXIsXHJcbiAgICAgICAgY29udHJvbGxlcjogQ29udHJvbGxlcixcclxuICAgICAgICB0b3RhbENvb2xkb3duOiBudW1iZXIsXHJcbiAgICAgICAgaW1nOiBIVE1MSW1hZ2VFbGVtZW50LFxyXG4gICAgICAgIHRvdGFsQ2FzdFRpbWU6IG51bWJlcixcclxuICAgICAgICBhYmlsaXR5QXJyYXlJbmRleDogbnVtYmVyLFxyXG4gICAgKSB7XHJcbiAgICAgICAgc3VwZXIoZ2FtZSwgcGxheWVyLCBjb250cm9sbGVyLCB0b3RhbENvb2xkb3duLCBpbWcsIHRvdGFsQ2FzdFRpbWUsIGFiaWxpdHlBcnJheUluZGV4KTtcclxuICAgIH1cclxuICAgIHByZXNzRnVuYyhnbG9iYWxNb3VzZVBvczogVmVjdG9yKSB7XHJcbiAgICAgICAgdGhpcy5jb250cm9sbGVyLnNldEN1cnJlbnRDYXN0aW5nQWJpbGl0eSh0aGlzLmFiaWxpdHlBcnJheUluZGV4KTtcclxuICAgICAgICB0aGlzLmNvbnRyb2xsZXIuc2V0R2xvYmFsQ29vbGRvd24odGhpcy5nbG9iYWxDb29sZG93blRpbWUpO1xyXG4gICAgICAgIHRoaXMuY29vbGRvd24gPSB0aGlzLnRvdGFsQ29vbGRvd24gKyAwO1xyXG4gICAgICAgIHRoaXMuYW5nbGUgPSBmaW5kQW5nbGUodGhpcy5wbGF5ZXIucG9zaXRpb24sIGdsb2JhbE1vdXNlUG9zKTtcclxuICAgICAgICB0aGlzLmNhc3RpbmcgPSB0cnVlO1xyXG4gICAgfVxyXG4gICAgY2FzdFVwZGF0ZUZ1bmMoZWxhcHNlZFRpbWU6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuY2FzdFN0YWdlICs9IGVsYXBzZWRUaW1lO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5jYXN0U3RhZ2UgPj0gdGhpcy50b3RhbENhc3RUaW1lKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RvcEZ1bmMoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBzdG9wRnVuYygpIHtcclxuICAgICAgICBpZiAodGhpcy5jYXN0aW5nKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29udHJvbGxlci5yZXNldEN1cnJlbnRDYXN0aW5nQWJpbGl0eSgpO1xyXG4gICAgICAgICAgICB0aGlzLnJlc2V0QWJpbGl0eSgpO1xyXG4gICAgICAgICAgICB0aGlzLmNhc3RpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5hbmdsZSA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IEdhbWUgfSBmcm9tIFwiLi4vLi4vLi4vLi4vLi4vY2xpZW50L2dhbWVcIjtcclxuaW1wb3J0IHsgYXNzZXRNYW5hZ2VyIH0gZnJvbSBcIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9nYW1lUmVuZGVyL2Fzc2V0bWFuYWdlclwiO1xyXG5pbXBvcnQgeyBmaW5kQW5nbGUgfSBmcm9tIFwiLi4vLi4vLi4vLi4vLi4vZmluZEFuZ2xlXCI7XHJcbmltcG9ydCB7IHJvdGF0ZVNoYXBlLCBWZWN0b3IgfSBmcm9tIFwiLi4vLi4vLi4vLi4vLi4vdmVjdG9yXCI7XHJcbmltcG9ydCB7IEFjdG9yVHlwZSB9IGZyb20gXCIuLi8uLi8uLi8uLi9uZXdBY3RvcnMvYWN0b3JcIjtcclxuaW1wb3J0IHsgQ2xpZW50QWN0b3IsIHJlbmRlclNoYXBlIH0gZnJvbSBcIi4uLy4uLy4uLy4uL25ld0FjdG9ycy9jbGllbnRBY3RvcnMvY2xpZW50QWN0b3JcIjtcclxuaW1wb3J0IHsgQ2xpZW50U3dvcmQgfSBmcm9tIFwiLi4vLi4vLi4vLi4vbmV3QWN0b3JzL2NsaWVudEFjdG9ycy9jbGllbnRQbGF5ZXIvY2xpZW50Q2xhc3Nlcy9jbGllbnRTd29yZFwiO1xyXG5pbXBvcnQgeyBDb250cm9sbGVyIH0gZnJvbSBcIi4uLy4uL2NvbnRyb2xsZXJcIjtcclxuaW1wb3J0IHsgU3dvcmRDb250cm9sbGVyIH0gZnJvbSBcIi4uLy4uL3N3b3JkQ29udHJvbGxlclwiO1xyXG5pbXBvcnQgeyBQbGF5ZXJQcmVzc0FiaWxpdHkgfSBmcm9tIFwiLi4vcGxheWVyUHJlc3NBYmlsaXR5XCI7XHJcbmltcG9ydCB7IFN3b3JkV2hpcmxXaW5kQWJpbGl0eSB9IGZyb20gXCIuL3N3b3JkV2hpcmx3aW5kQWJpbGl0eVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFN3b3JkU2xhc2hBYmlsaXR5IGV4dGVuZHMgUGxheWVyUHJlc3NBYmlsaXR5IHtcclxuICAgIGNvbnN0cnVjdG9yKGdhbWU6IEdhbWUsIHByb3RlY3RlZCByZWFkb25seSBwbGF5ZXI6IENsaWVudFN3b3JkLCBwcm90ZWN0ZWQgcmVhZG9ubHkgY29udHJvbGxlcjogU3dvcmRDb250cm9sbGVyLCBhYmlsaXR5QXJyYXlJbmRleDogbnVtYmVyKSB7XHJcbiAgICAgICAgc3VwZXIoXHJcbiAgICAgICAgICAgIGdhbWUsXHJcbiAgICAgICAgICAgIHBsYXllcixcclxuICAgICAgICAgICAgY29udHJvbGxlcixcclxuICAgICAgICAgICAgU3dvcmRTbGFzaEFiaWxpdHlEYXRhLmNvb2xkb3duICsgMCxcclxuICAgICAgICAgICAgYXNzZXRNYW5hZ2VyLmltYWdlc1tcInNsYXNoSWNvblwiXSxcclxuICAgICAgICAgICAgU3dvcmRTbGFzaEFiaWxpdHlEYXRhLnRvdGFsQ2FzdFRpbWUgKyAwLFxyXG4gICAgICAgICAgICBhYmlsaXR5QXJyYXlJbmRleCxcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIHByZXNzRnVuYyhnbG9iYWxNb3VzZVBvczogVmVjdG9yKSB7XHJcbiAgICAgICAgc3VwZXIucHJlc3NGdW5jKGdsb2JhbE1vdXNlUG9zKTtcclxuICAgICAgICB0aGlzLnBsYXllci5wZXJmb3JtQ2xpZW50QWJpbGl0eVtcInNsYXNoXCJdKGdsb2JhbE1vdXNlUG9zKTtcclxuXHJcbiAgICAgICAgdGhpcy5jb250cm9sbGVyLnNlbmRTZXJ2ZXJTd29yZEFiaWxpdHkoXCJzbGFzaFwiLCB0cnVlLCBnbG9iYWxNb3VzZVBvcyk7XHJcbiAgICB9XHJcbiAgICBjYXN0VXBkYXRlRnVuYyhlbGFwc2VkVGltZTogbnVtYmVyKSB7XHJcbiAgICAgICAgc3VwZXIuY2FzdFVwZGF0ZUZ1bmMoZWxhcHNlZFRpbWUpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5jYXN0U3RhZ2UgPiBTd29yZFNsYXNoQWJpbGl0eURhdGEuaGl0RGV0ZWN0RnJhbWUgJiYgdGhpcy5jYXN0U3RhZ2UgLSBlbGFwc2VkVGltZSA8IFN3b3JkU2xhc2hBYmlsaXR5RGF0YS5oaXREZXRlY3RGcmFtZSkge1xyXG4gICAgICAgICAgICBsZXQgYWN0b3JzOiB7XHJcbiAgICAgICAgICAgICAgICBhY3RvclR5cGU6IEFjdG9yVHlwZTtcclxuICAgICAgICAgICAgICAgIGFjdG9ySWQ6IG51bWJlcjtcclxuICAgICAgICAgICAgICAgIGFuZ2xlOiBudW1iZXI7XHJcbiAgICAgICAgICAgIH1bXSA9IFtdO1xyXG5cclxuICAgICAgICAgICAgbGV0IHNoYXBlOiBWZWN0b3JbXSA9IHJvdGF0ZVNoYXBlKFN3b3JkU2xhc2hIaXRTaGFwZSwgdGhpcy5hbmdsZSwgdGhpcy5wbGF5ZXIucG9zaXRpb24sIGZhbHNlKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuZ2xvYmFsQWN0b3JzLmFjdG9ycy5mb3JFYWNoKChhY3RvcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGFjdG9yLmdldEFjdG9ySWQoKSAhPT0gdGhpcy5wbGF5ZXIuZ2V0QWN0b3JJZCgpICYmIGFjdG9yLmlmSW5zaWRlTGFyZ2VyU2hhcGUoc2hhcGUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWN0b3JzLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhY3RvclR5cGU6IGFjdG9yLmdldEFjdG9yVHlwZSgpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhY3RvcklkOiBhY3Rvci5nZXRBY3RvcklkKCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFuZ2xlOiB0aGlzLmFuZ2xlLFxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGlmIChhY3RvcnMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lLmdhbWVSZW5kZXJlci5zY3JlZW5ab29tKDEuMDYpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lLnNlcnZlclRhbGtlci5zZW5kTWVzc2FnZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJjbGllbnRTd29yZE1lc3NhZ2VcIixcclxuICAgICAgICAgICAgICAgICAgICBvcmlnaW5JZDogdGhpcy5wbGF5ZXIuZ2V0QWN0b3JJZCgpLFxyXG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiB0aGlzLnBsYXllci5wb3NpdGlvbixcclxuICAgICAgICAgICAgICAgICAgICBtb21lbnR1bTogdGhpcy5wbGF5ZXIubW9tZW50dW0sXHJcbiAgICAgICAgICAgICAgICAgICAgbXNnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiY2xpZW50U3dvcmRTbGFzaEhpdFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhY3RvcnMsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY29udHJvbGxlci5hYmlsaXR5RGF0YVsxXSBpbnN0YW5jZW9mIFN3b3JkV2hpcmxXaW5kQWJpbGl0eSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29udHJvbGxlci5hYmlsaXR5RGF0YVsxXS5jb29sZG93bi0tO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIENsaWVudFN3b3JkU2xhc2hIaXQge1xyXG4gICAgdHlwZTogXCJjbGllbnRTd29yZFNsYXNoSGl0XCI7XHJcbiAgICBhY3RvcnM6IHtcclxuICAgICAgICBhY3RvclR5cGU6IEFjdG9yVHlwZTtcclxuICAgICAgICBhY3RvcklkOiBudW1iZXI7XHJcbiAgICAgICAgYW5nbGU6IG51bWJlcjtcclxuICAgIH1bXTtcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IFN3b3JkU2xhc2hIaXRTaGFwZTogVmVjdG9yW10gPSBbXHJcbiAgICB7IHg6IC0xMCwgeTogLTMwIH0sXHJcbiAgICB7IHg6IDcsIHk6IC04MCB9LFxyXG4gICAgeyB4OiAxMDAsIHk6IC01NSB9LFxyXG4gICAgeyB4OiAxMTAsIHk6IDIwIH0sXHJcbiAgICB7IHg6IDc1LCB5OiA1NSB9LFxyXG4gICAgeyB4OiAxMCwgeTogNzAgfSxcclxuXTtcclxuXHJcbmNvbnN0IFN3b3JkU2xhc2hBYmlsaXR5RGF0YSA9IHtcclxuICAgIGNvb2xkb3duOiAwLjMsXHJcbiAgICB0b3RhbENhc3RUaW1lOiAwLjUsXHJcbiAgICBoaXREZXRlY3RGcmFtZTogMC4wNSxcclxufTtcclxuIiwiaW1wb3J0IHsgR2FtZSB9IGZyb20gXCIuLi8uLi8uLi8uLi8uLi9jbGllbnQvZ2FtZVwiO1xyXG5pbXBvcnQgeyBhc3NldE1hbmFnZXIgfSBmcm9tIFwiLi4vLi4vLi4vLi4vLi4vY2xpZW50L2dhbWVSZW5kZXIvYXNzZXRtYW5hZ2VyXCI7XHJcbmltcG9ydCB7IGZpbmRBbmdsZSB9IGZyb20gXCIuLi8uLi8uLi8uLi8uLi9maW5kQW5nbGVcIjtcclxuaW1wb3J0IHsgZmluZERpc3RhbmNlLCBWZWN0b3IgfSBmcm9tIFwiLi4vLi4vLi4vLi4vLi4vdmVjdG9yXCI7XHJcbmltcG9ydCB7IEFjdG9yVHlwZSB9IGZyb20gXCIuLi8uLi8uLi8uLi9uZXdBY3RvcnMvYWN0b3JcIjtcclxuaW1wb3J0IHsgZGVmYXVsdEFjdG9yQ29uZmlnIH0gZnJvbSBcIi4uLy4uLy4uLy4uL25ld0FjdG9ycy9hY3RvckNvbmZpZ1wiO1xyXG5pbXBvcnQgeyBDbGllbnRBY3RvciB9IGZyb20gXCIuLi8uLi8uLi8uLi9uZXdBY3RvcnMvY2xpZW50QWN0b3JzL2NsaWVudEFjdG9yXCI7XHJcbmltcG9ydCB7IENsaWVudFN3b3JkIH0gZnJvbSBcIi4uLy4uLy4uLy4uL25ld0FjdG9ycy9jbGllbnRBY3RvcnMvY2xpZW50UGxheWVyL2NsaWVudENsYXNzZXMvY2xpZW50U3dvcmRcIjtcclxuaW1wb3J0IHsgQ29udHJvbGxlciB9IGZyb20gXCIuLi8uLi9jb250cm9sbGVyXCI7XHJcbmltcG9ydCB7IFN3b3JkQ29udHJvbGxlciB9IGZyb20gXCIuLi8uLi9zd29yZENvbnRyb2xsZXJcIjtcclxuaW1wb3J0IHsgUGxheWVySG9sZEFiaWxpdHkgfSBmcm9tIFwiLi4vcGxheWVySG9sZEFiaWxpdHlcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBTd29yZFdoaXJsV2luZEFiaWxpdHkgZXh0ZW5kcyBQbGF5ZXJIb2xkQWJpbGl0eSB7XHJcbiAgICBjb25zdHJ1Y3RvcihnYW1lOiBHYW1lLCBwcm90ZWN0ZWQgcmVhZG9ubHkgcGxheWVyOiBDbGllbnRTd29yZCwgcHJvdGVjdGVkIHJlYWRvbmx5IGNvbnRyb2xsZXI6IFN3b3JkQ29udHJvbGxlciwgYWJpbGl0eUFycmF5SW5kZXg6IG51bWJlcikge1xyXG4gICAgICAgIHN1cGVyKFxyXG4gICAgICAgICAgICBnYW1lLFxyXG4gICAgICAgICAgICBwbGF5ZXIsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXIsXHJcbiAgICAgICAgICAgIFN3b3JkV2hpcmxXaW5kQWJpbGl0eURhdGEuY29vbGRvd24sXHJcbiAgICAgICAgICAgIGFzc2V0TWFuYWdlci5pbWFnZXNbXCJ3aGlybHdpbmRJY29uXCJdLFxyXG4gICAgICAgICAgICBTd29yZFdoaXJsV2luZEFiaWxpdHlEYXRhLnRvdGFsQ2FzdFRpbWUsXHJcbiAgICAgICAgICAgIGFiaWxpdHlBcnJheUluZGV4LFxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJlc3NGdW5jKGdsb2JhbE1vdXNlUG9zOiBWZWN0b3IpIHtcclxuICAgICAgICB0aGlzLmNvbnRyb2xsZXIuc2V0TmVnYXRpdmVHbG9iYWxDb29sZG93bigpO1xyXG4gICAgICAgIHRoaXMuY29udHJvbGxlci5zZXRDdXJyZW50Q2FzdGluZ0FiaWxpdHkodGhpcy5hYmlsaXR5QXJyYXlJbmRleCk7XHJcbiAgICAgICAgdGhpcy5wbGF5ZXIucGVyZm9ybUNsaWVudEFiaWxpdHlbXCJ3aGlybHdpbmRcIl0oZ2xvYmFsTW91c2VQb3MpO1xyXG4gICAgICAgIHRoaXMuY2FzdGluZyA9IHRydWU7XHJcblxyXG4gICAgICAgIHRoaXMuY29vbGRvd24gPSAzO1xyXG5cclxuICAgICAgICB0aGlzLmNvbnRyb2xsZXIuc2VuZFNlcnZlclN3b3JkQWJpbGl0eShcIndoaXJsd2luZFwiLCB0cnVlLCB7IHg6IDAsIHk6IDAgfSk7XHJcbiAgICAgICAgLy9icm9hZGNhc3Qgc3RhcnRpbmdcclxuICAgIH1cclxuICAgIGNhc3RVcGRhdGVGdW5jKGVsYXBzZWRUaW1lOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLmNhc3RTdGFnZSArPSBlbGFwc2VkVGltZTtcclxuXHJcbiAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICB0aGlzLmNhc3RTdGFnZSAlIFN3b3JkV2hpcmxXaW5kQWJpbGl0eURhdGEuaGl0RGV0ZWN0VGltZXIgPj0gMC4xICYmXHJcbiAgICAgICAgICAgICh0aGlzLmNhc3RTdGFnZSAtIGVsYXBzZWRUaW1lKSAlIFN3b3JkV2hpcmxXaW5kQWJpbGl0eURhdGEuaGl0RGV0ZWN0VGltZXIgPCAwLjFcclxuICAgICAgICApIHtcclxuICAgICAgICAgICAgdGhpcy5jb29sZG93bisrO1xyXG4gICAgICAgICAgICBsZXQgYWN0b3JzOiB7XHJcbiAgICAgICAgICAgICAgICBhY3RvclR5cGU6IEFjdG9yVHlwZTtcclxuICAgICAgICAgICAgICAgIGFjdG9ySWQ6IG51bWJlcjtcclxuICAgICAgICAgICAgICAgIGFuZ2xlOiBudW1iZXI7XHJcbiAgICAgICAgICAgIH1bXSA9IFtdO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5nbG9iYWxBY3RvcnMuYWN0b3JzLmZvckVhY2goKGFjdG9yKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcG9zRGlmZmVyZW5jZSA9IGZpbmREaXN0YW5jZSh0aGlzLnBsYXllci5wb3NpdGlvbiwgYWN0b3IucG9zaXRpb24pO1xyXG4gICAgICAgICAgICAgICAgaWYgKGFjdG9yLmdldEFjdG9ySWQoKSAhPT0gdGhpcy5wbGF5ZXIuZ2V0QWN0b3JJZCgpICYmIHBvc0RpZmZlcmVuY2UgPCBhY3Rvci5nZXRDb2xsaXNpb25SYW5nZSgpICsgU3dvcmRXaGlybFdpbmRBYmlsaXR5RGF0YS5oaXRSYW5nZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGFjdG9ycy5wdXNoKHsgYWN0b3JUeXBlOiBhY3Rvci5nZXRBY3RvclR5cGUoKSwgYWN0b3JJZDogYWN0b3IuZ2V0QWN0b3JJZCgpLCBhbmdsZTogZmluZEFuZ2xlKHRoaXMucGxheWVyLnBvc2l0aW9uLCBhY3Rvci5wb3NpdGlvbikgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaWYgKGFjdG9ycy5sZW5ndGggIT09IDApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5nYW1lUmVuZGVyZXIuc2NyZWVuWm9vbSgxLjA2LCAzKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5zZXJ2ZXJUYWxrZXIuc2VuZE1lc3NhZ2Uoe1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiY2xpZW50U3dvcmRNZXNzYWdlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgb3JpZ2luSWQ6IHRoaXMucGxheWVyLmdldEFjdG9ySWQoKSxcclxuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogdGhpcy5wbGF5ZXIucG9zaXRpb24sXHJcbiAgICAgICAgICAgICAgICAgICAgbW9tZW50dW06IHRoaXMucGxheWVyLm1vbWVudHVtLFxyXG4gICAgICAgICAgICAgICAgICAgIG1zZzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcImNsaWVudFN3b3JkV2hpcmx3aW5kSGl0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjdG9ycyxcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmNhc3RTdGFnZSA+PSBTd29yZFdoaXJsV2luZEFiaWxpdHlEYXRhLnRvdGFsQ2FzdFRpbWUpIHtcclxuICAgICAgICAgICAgdGhpcy5zdG9wRnVuYygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJlbGVhc2VGdW5jKCkge1xyXG4gICAgICAgIHRoaXMuc3RvcEZ1bmMoKTtcclxuICAgIH1cclxuICAgIHN0b3BGdW5jKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmNhc3RpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5wbGF5ZXIucmVsZWFzZUNsaWVudEFiaWxpdHlbXCJ3aGlybHdpbmRcIl0oKTtcclxuICAgICAgICAgICAgdGhpcy5jb250cm9sbGVyLnJlc2V0R2xvYmFsQ29vbGRvd24oKTtcclxuICAgICAgICAgICAgdGhpcy5jb250cm9sbGVyLnJlc2V0Q3VycmVudENhc3RpbmdBYmlsaXR5KCk7XHJcbiAgICAgICAgICAgIHRoaXMucmVzZXRBYmlsaXR5KCk7XHJcbiAgICAgICAgICAgIHRoaXMuY2FzdGluZyA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5jb250cm9sbGVyLnNlbmRTZXJ2ZXJTd29yZEFiaWxpdHkoXCJ3aGlybHdpbmRcIiwgZmFsc2UsIHsgeDogMCwgeTogMCB9KTtcclxuICAgICAgICAgICAgLy9ib3JhZGNhc3QgZW5kaW5nXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZUZ1bmMoZWxhcHNlZFRpbWU6IG51bWJlcikge1xyXG4gICAgICAgIGlmICh0aGlzLmNvb2xkb3duID4gU3dvcmRXaGlybFdpbmRBYmlsaXR5RGF0YS5jb29sZG93bikge1xyXG4gICAgICAgICAgICB0aGlzLmNvb2xkb3duID0gU3dvcmRXaGlybFdpbmRBYmlsaXR5RGF0YS5jb29sZG93biArIDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5jb29sZG93biA8IDApIHtcclxuICAgICAgICAgICAgdGhpcy5jb29sZG93biA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGdldEljb25Db29sZG93blBlcmNlbnQoKTogbnVtYmVyIHtcclxuICAgICAgICBpZiAodGhpcy5jb29sZG93biA9PT0gMCkgcmV0dXJuIHRoaXMuY29udHJvbGxlci5nbG9iYWxDb29sZG93biAvIGRlZmF1bHRBY3RvckNvbmZpZy5nbG9iYWxDb29sZG93bjtcclxuICAgICAgICBlbHNlIHJldHVybiB0aGlzLmNvb2xkb3duIC8gU3dvcmRXaGlybFdpbmRBYmlsaXR5RGF0YS5jb29sZG93bjtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IFN3b3JkV2hpcmxXaW5kQWJpbGl0eURhdGEgPSB7XHJcbiAgICBjb29sZG93bjogNSxcclxuICAgIHRvdGFsQ2FzdFRpbWU6IDEsXHJcbiAgICBoaXREZXRlY3RUaW1lcjogMC4yLFxyXG4gICAgaGl0UmFuZ2U6IDE0MCxcclxufTtcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgQ2xpZW50U3dvcmRXaGlybHdpbmRIaXQge1xyXG4gICAgdHlwZTogXCJjbGllbnRTd29yZFdoaXJsd2luZEhpdFwiO1xyXG4gICAgYWN0b3JzOiB7XHJcbiAgICAgICAgYWN0b3JUeXBlOiBBY3RvclR5cGU7XHJcbiAgICAgICAgYWN0b3JJZDogbnVtYmVyO1xyXG4gICAgICAgIGFuZ2xlOiBudW1iZXI7XHJcbiAgICB9W107XHJcbn1cclxuIiwiaW1wb3J0IHsgR2FtZSB9IGZyb20gXCIuLi8uLi8uLi9jbGllbnQvZ2FtZVwiO1xyXG5pbXBvcnQgeyBQbGF5ZXJBYmlsaXR5IH0gZnJvbSBcIi4vYWJpbGl0aWVzL3BsYXllckFiaWxpdHlcIjtcclxuaW1wb3J0IHsgU2VyaWFsaXplZFBsYXllciB9IGZyb20gXCIuLi8uLi9uZXdBY3RvcnMvc2VydmVyQWN0b3JzL3NlcnZlclBsYXllci9zZXJ2ZXJQbGF5ZXJcIjtcclxuaW1wb3J0IHsgRW1wdHlBYmlsaXR5IH0gZnJvbSBcIi4vYWJpbGl0aWVzL2VtcHR5QWJpbGl0eVwiO1xyXG5pbXBvcnQgeyBkZWZhdWx0QWN0b3JDb25maWcgfSBmcm9tIFwiLi4vLi4vbmV3QWN0b3JzL2FjdG9yQ29uZmlnXCI7XHJcbmltcG9ydCB7IFN3b3JkU2xhc2hBYmlsaXR5IH0gZnJvbSBcIi4vYWJpbGl0aWVzL3N3b3JkQWJpbGl0aWVzL3N3b3JkU2xhc2hBYmlsaXR5XCI7XHJcbmltcG9ydCB7IENsaWVudFN3b3JkV2hpcmx3aW5kSGl0LCBTd29yZFdoaXJsV2luZEFiaWxpdHkgfSBmcm9tIFwiLi9hYmlsaXRpZXMvc3dvcmRBYmlsaXRpZXMvc3dvcmRXaGlybHdpbmRBYmlsaXR5XCI7XHJcbmltcG9ydCB7IFZlY3RvciB9IGZyb20gXCIuLi8uLi8uLi92ZWN0b3JcIjtcclxuaW1wb3J0IHsgUGxheWVySG9sZEFiaWxpdHkgfSBmcm9tIFwiLi9hYmlsaXRpZXMvcGxheWVySG9sZEFiaWxpdHlcIjtcclxuaW1wb3J0IHsgQWN0b3JUeXBlIH0gZnJvbSBcIi4uLy4uL25ld0FjdG9ycy9hY3RvclwiO1xyXG5pbXBvcnQgeyBDbGllbnRTd29yZCB9IGZyb20gXCIuLi8uLi9uZXdBY3RvcnMvY2xpZW50QWN0b3JzL2NsaWVudFBsYXllci9jbGllbnRDbGFzc2VzL2NsaWVudFN3b3JkXCI7XHJcbmltcG9ydCB7IENsaWVudFBsYXllciB9IGZyb20gXCIuLi8uLi9uZXdBY3RvcnMvY2xpZW50QWN0b3JzL2NsaWVudFBsYXllci9jbGllbnRQbGF5ZXJcIjtcclxuXHJcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBDb250cm9sbGVyIHtcclxuICAgIHByb3RlY3RlZCBsZXZlbCA9IDA7IC8vIHNldCBpbiBzZXRMZXZlbCgpXHJcbiAgICBwcm90ZWN0ZWQgY3VycmVudFhwID0gMDtcclxuICAgIHByb3RlY3RlZCB4cFRvTmV4dExldmVsID0gMjA7IC8vIHNldCBpbiBzZXRMZXZlbCgpXHJcbiAgICBwdWJsaWMgZ2xvYmFsQ29vbGRvd246IG51bWJlciA9IDA7XHJcblxyXG4gICAgcHJvdGVjdGVkIGN1cnJlbnRDYXN0aW5nQWJpbGl0eTogbnVtYmVyIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xyXG4gICAgcHJvdGVjdGVkIHN0YXRlU3RhZ2U6IG51bWJlciA9IDA7XHJcblxyXG4gICAgcmVhZG9ubHkgYWJpbGl0eURhdGE6IFBsYXllckFiaWxpdHlbXTtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgcmVhZG9ubHkgZ2FtZTogR2FtZSwgcHJvdGVjdGVkIHJlYWRvbmx5IHBsYXllcjogQ2xpZW50UGxheWVyKSB7XHJcbiAgICAgICAgdGhpcy5hYmlsaXR5RGF0YSA9IFtdO1xyXG4gICAgICAgIGZvciAobGV0IGk6IG51bWJlciA9IDA7IGkgPCA0OyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5hYmlsaXR5RGF0YS5wdXNoKG5ldyBFbXB0eUFiaWxpdHkoZ2FtZSwgdGhpcy5wbGF5ZXIsIHRoaXMsIGkpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuc2V0TGV2ZWwodGhpcy5wbGF5ZXIuZ2V0TGV2ZWwoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldFhwKHhwOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLmN1cnJlbnRYcCA9IHhwICsgMDtcclxuICAgICAgICAvL3RoaXMuVXNlckludGVyZmFjZS51cGRhdGVYUCh4cCk6XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc2V0TGV2ZWwobGV2ZWw6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMubGV2ZWwgPSBsZXZlbCArIDA7XHJcbiAgICAgICAgdGhpcy54cFRvTmV4dExldmVsID0gZGVmYXVsdEFjdG9yQ29uZmlnLlhQUGVyTGV2ZWwgKiBNYXRoLnBvdyhkZWZhdWx0QWN0b3JDb25maWcuTGV2ZWxYUE11bHRpcGxpZXIsIGxldmVsIC0gMSkgKyAwO1xyXG4gICAgICAgIHRoaXMuc2V0WHAoMCk7XHJcbiAgICAgICAgdGhpcy5zZXRBYmlsaXRpZXMoKTtcclxuICAgICAgICAvL3RoaXMuVXNlckludGVyZmFjZS51cGRhdGVMZXZlbChsZXZlbCk6XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGFic3RyYWN0IHNldEFiaWxpdGllcygpOiB2b2lkO1xyXG5cclxuICAgIHB1YmxpYyBzZXRDdXJyZW50Q2FzdGluZ0FiaWxpdHkoYWJpbGl0eUluZGV4OiBudW1iZXIpIHtcclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50Q2FzdGluZ0FiaWxpdHkgIT09IHVuZGVmaW5lZCkgdGhpcy5hYmlsaXR5RGF0YVt0aGlzLmN1cnJlbnRDYXN0aW5nQWJpbGl0eV0uc3RvcEZ1bmMoKTtcclxuICAgICAgICB0aGlzLmN1cnJlbnRDYXN0aW5nQWJpbGl0eSA9IGFiaWxpdHlJbmRleDtcclxuICAgIH1cclxuICAgIHB1YmxpYyByZXNldEN1cnJlbnRDYXN0aW5nQWJpbGl0eSgpIHtcclxuICAgICAgICB0aGlzLmN1cnJlbnRDYXN0aW5nQWJpbGl0eSA9IHVuZGVmaW5lZDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcHJlc3NBYmlsaXR5KGFiaWxpdHlJbmRleDogMCB8IDEgfCAyIHwgMyk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICh0aGlzLmFiaWxpdHlEYXRhW2FiaWxpdHlJbmRleF0uYXR0ZW1wdEZ1bmMoKSkge1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUZhY2luZygpO1xyXG4gICAgICAgICAgICB0aGlzLmFiaWxpdHlEYXRhW2FiaWxpdHlJbmRleF0ucHJlc3NGdW5jKHRoaXMuZ2FtZS5nZXRHbG9iYWxNb3VzZVBvcygpKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVsZWFzZUFiaWxpdHkoYWJpbGl0eUluZGV4OiAwIHwgMSB8IDIgfCAzKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuYWJpbGl0eURhdGFbYWJpbGl0eUluZGV4XS50eXBlID09PSBcImhvbGRcIikge1xyXG4gICAgICAgICAgICAodGhpcy5hYmlsaXR5RGF0YVthYmlsaXR5SW5kZXhdIGFzIFBsYXllckhvbGRBYmlsaXR5KS5yZWxlYXNlRnVuYygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0QWJpbGl0eVN0YXR1cygpOiBQbGF5ZXJBYmlsaXR5W10ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmFiaWxpdHlEYXRhO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRHbG9iYWxDb29sZG93bih0aW1lOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLmdsb2JhbENvb2xkb3duID0gdGltZSArIDA7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgcmVzZXRHbG9iYWxDb29sZG93bigpIHtcclxuICAgICAgICB0aGlzLmdsb2JhbENvb2xkb3duID0gMDtcclxuICAgIH1cclxuICAgIHB1YmxpYyBzZXROZWdhdGl2ZUdsb2JhbENvb2xkb3duKCkge1xyXG4gICAgICAgIHRoaXMuZ2xvYmFsQ29vbGRvd24gPSAtMC4xO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIHVwZGF0ZUdsb2JhbENvb2xkb3duKGVsYXBzZWRUaW1lOiBudW1iZXIpIHtcclxuICAgICAgICBpZiAodGhpcy5nbG9iYWxDb29sZG93biA9PT0gMCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmdsb2JhbENvb2xkb3duID4gMCkge1xyXG4gICAgICAgICAgICB0aGlzLmdsb2JhbENvb2xkb3duIC09IGVsYXBzZWRUaW1lO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5nbG9iYWxDb29sZG93biA8IDApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2xvYmFsQ29vbGRvd24gPSAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIHVwZGF0ZUFiaWxpdGllcyhlbGFwc2VkVGltZTogbnVtYmVyKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaTogbnVtYmVyID0gMDsgaSA8IDQ7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLmFiaWxpdHlEYXRhW2ldLnVwZGF0ZUZ1bmMoZWxhcHNlZFRpbWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgdXBkYXRlRmFjaW5nKCkge1xyXG4gICAgICAgIGxldCBtb3VzZVBvczogVmVjdG9yID0gdGhpcy5nYW1lLmdldEdsb2JhbE1vdXNlUG9zKCk7XHJcbiAgICAgICAgaWYgKG1vdXNlUG9zLnggPiB0aGlzLnBsYXllci5wb3NpdGlvbi54KSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5wbGF5ZXIuZmFjaW5nUmlnaHQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucGxheWVyLmZhY2luZ1JpZ2h0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHRoaXMucGxheWVyLnVwZGF0ZUZhY2luZ0Zyb21TZXJ2ZXIodHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWUuc2VydmVyVGFsa2VyLnNlbmRNZXNzYWdlKHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcImNsaWVudFBsYXllckZhY2luZ1VwZGF0ZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHBsYXllcmlkOiB0aGlzLnBsYXllci5nZXRBY3RvcklkKCksXHJcbiAgICAgICAgICAgICAgICAgICAgZmFjaW5nUmlnaHQ6IHRoaXMucGxheWVyLmZhY2luZ1JpZ2h0LFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAvL2Jyb2FkY2FzdFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMucGxheWVyLmZhY2luZ1JpZ2h0KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBsYXllci5mYWNpbmdSaWdodCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wbGF5ZXIudXBkYXRlRmFjaW5nRnJvbVNlcnZlcihmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWUuc2VydmVyVGFsa2VyLnNlbmRNZXNzYWdlKHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcImNsaWVudFBsYXllckZhY2luZ1VwZGF0ZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHBsYXllcmlkOiB0aGlzLnBsYXllci5nZXRBY3RvcklkKCksXHJcbiAgICAgICAgICAgICAgICAgICAgZmFjaW5nUmlnaHQ6IHRoaXMucGxheWVyLmZhY2luZ1JpZ2h0LFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAvL2Jyb2FkY2FzdFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB1cGRhdGUoZWxhcHNlZFRpbWU6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMudXBkYXRlR2xvYmFsQ29vbGRvd24oZWxhcHNlZFRpbWUpO1xyXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRDYXN0aW5nQWJpbGl0eSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYWJpbGl0eURhdGFbdGhpcy5jdXJyZW50Q2FzdGluZ0FiaWxpdHldLmNhc3RVcGRhdGVGdW5jKGVsYXBzZWRUaW1lKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUZhY2luZygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnVwZGF0ZUFiaWxpdGllcyhlbGFwc2VkVGltZSk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgR2FtZSB9IGZyb20gXCIuLi8uLi8uLi9jbGllbnQvZ2FtZVwiO1xyXG5pbXBvcnQgeyBWZWN0b3IgfSBmcm9tIFwiLi4vLi4vLi4vdmVjdG9yXCI7XHJcbmltcG9ydCB7IENsaWVudERhZ2dlcnMsIERhZ2dlcnNQbGF5ZXJBYmlsaXR5IH0gZnJvbSBcIi4uLy4uL25ld0FjdG9ycy9jbGllbnRBY3RvcnMvY2xpZW50UGxheWVyL2NsaWVudENsYXNzZXMvY2xpZW50RGFnZ2Vyc1wiO1xyXG5pbXBvcnQgeyBDbGllbnRQbGF5ZXIgfSBmcm9tIFwiLi4vLi4vbmV3QWN0b3JzL2NsaWVudEFjdG9ycy9jbGllbnRQbGF5ZXIvY2xpZW50UGxheWVyXCI7XHJcbmltcG9ydCB7IERhZ2dlcnNMdW5nZUFiaWxpdHkgfSBmcm9tIFwiLi9hYmlsaXRpZXMvZGFnZ2Vyc0FiaWxpdGllcy9kYWdnZXJzTHVuZ2VBYmlsaXR5XCI7XHJcbmltcG9ydCB7IENsaWVudERhZ2dlcnNTdGFiSGl0LCBEYWdnZXJzU3RhYkFiaWxpdHkgfSBmcm9tIFwiLi9hYmlsaXRpZXMvZGFnZ2Vyc0FiaWxpdGllcy9kYWdnZXJzU3RhYkFiaWxpdHlcIjtcclxuaW1wb3J0IHsgU3dvcmRTbGFzaEFiaWxpdHkgfSBmcm9tIFwiLi9hYmlsaXRpZXMvc3dvcmRBYmlsaXRpZXMvc3dvcmRTbGFzaEFiaWxpdHlcIjtcclxuaW1wb3J0IHsgU3dvcmRXaGlybFdpbmRBYmlsaXR5IH0gZnJvbSBcIi4vYWJpbGl0aWVzL3N3b3JkQWJpbGl0aWVzL3N3b3JkV2hpcmx3aW5kQWJpbGl0eVwiO1xyXG5pbXBvcnQgeyBDb250cm9sbGVyIH0gZnJvbSBcIi4vY29udHJvbGxlclwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIERhZ2dlcnNDb250cm9sbGVyIGV4dGVuZHMgQ29udHJvbGxlciB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgZ2FtZTogR2FtZSwgcHJvdGVjdGVkIHBsYXllcjogQ2xpZW50RGFnZ2Vycykge1xyXG4gICAgICAgIHN1cGVyKGdhbWUsIHBsYXllcik7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIHNldEFiaWxpdGllcygpIHtcclxuICAgICAgICBzd2l0Y2ggKHRoaXMucGxheWVyLmdldFNwZWMoKSkge1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgdGhpcy5hYmlsaXR5RGF0YVswXSA9IG5ldyBEYWdnZXJzU3RhYkFiaWxpdHkodGhpcy5nYW1lLCB0aGlzLnBsYXllciwgdGhpcywgMCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFiaWxpdHlEYXRhWzFdID0gbmV3IERhZ2dlcnNMdW5nZUFiaWxpdHkodGhpcy5nYW1lLCB0aGlzLnBsYXllciwgdGhpcywgMSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZW5kU2VydmVyRGFnZ2Vyc0FiaWxpdHkoYWJpbGl0eTogRGFnZ2Vyc1BsYXllckFiaWxpdHksIHN0YXJ0aW5nOiBib29sZWFuLCBtb3VzZVBvczogVmVjdG9yKSB7XHJcbiAgICAgICAgdGhpcy5nYW1lLnNlcnZlclRhbGtlci5zZW5kTWVzc2FnZSh7XHJcbiAgICAgICAgICAgIHR5cGU6IFwiY2xpZW50RGFnZ2Vyc01lc3NhZ2VcIixcclxuICAgICAgICAgICAgb3JpZ2luSWQ6IHRoaXMucGxheWVyLmdldEFjdG9ySWQoKSxcclxuICAgICAgICAgICAgcG9zaXRpb246IHRoaXMucGxheWVyLnBvc2l0aW9uLFxyXG4gICAgICAgICAgICBtb21lbnR1bTogdGhpcy5wbGF5ZXIubW9tZW50dW0sXHJcbiAgICAgICAgICAgIG1zZzoge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJjbGllbnREYWdnZXJzQWJpbGl0eVwiLFxyXG4gICAgICAgICAgICAgICAgYWJpbGl0eVR5cGU6IGFiaWxpdHksXHJcbiAgICAgICAgICAgICAgICBtb3VzZVBvcyxcclxuICAgICAgICAgICAgICAgIHN0YXJ0aW5nLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIENsaWVudERhZ2dlcnNNZXNzYWdlIHtcclxuICAgIHR5cGU6IFwiY2xpZW50RGFnZ2Vyc01lc3NhZ2VcIjtcclxuICAgIG9yaWdpbklkOiBudW1iZXI7XHJcbiAgICBwb3NpdGlvbjogVmVjdG9yO1xyXG4gICAgbW9tZW50dW06IFZlY3RvcjtcclxuICAgIG1zZzogQ2xpZW50RGFnZ2Vyc0FiaWxpdHkgfCBDbGllbnREYWdnZXJzU3RhYkhpdDtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBDbGllbnREYWdnZXJzQWJpbGl0eSB7XHJcbiAgICB0eXBlOiBcImNsaWVudERhZ2dlcnNBYmlsaXR5XCI7XHJcbiAgICBhYmlsaXR5VHlwZTogRGFnZ2Vyc1BsYXllckFiaWxpdHk7XHJcbiAgICBtb3VzZVBvczogVmVjdG9yO1xyXG4gICAgc3RhcnRpbmc6IGJvb2xlYW47XHJcbn1cclxuIiwiaW1wb3J0IHsgR2FtZSB9IGZyb20gXCIuLi8uLi8uLi9jbGllbnQvZ2FtZVwiO1xyXG5pbXBvcnQgeyBWZWN0b3IgfSBmcm9tIFwiLi4vLi4vLi4vdmVjdG9yXCI7XHJcbmltcG9ydCB7IENsaWVudEhhbW1lciwgSGFtbWVyUGxheWVyQWJpbGl0eSB9IGZyb20gXCIuLi8uLi9uZXdBY3RvcnMvY2xpZW50QWN0b3JzL2NsaWVudFBsYXllci9jbGllbnRDbGFzc2VzL2NsaWVudEhhbW1lclwiO1xyXG5pbXBvcnQgeyBDbGllbnRQbGF5ZXIgfSBmcm9tIFwiLi4vLi4vbmV3QWN0b3JzL2NsaWVudEFjdG9ycy9jbGllbnRQbGF5ZXIvY2xpZW50UGxheWVyXCI7XHJcbmltcG9ydCB7IEhhbW1lclBvdW5kQWJpbGl0eSB9IGZyb20gXCIuL2FiaWxpdGllcy9oYW1tZXJBYmlsaXRpZXMvaGFtbWVyUG91bmRBYmlsaXR5XCI7XHJcbmltcG9ydCB7IENsaWVudEhhbW1lclN3aW5nSGl0LCBIYW1tZXJTd2luZ0FiaWxpdHkgfSBmcm9tIFwiLi9hYmlsaXRpZXMvaGFtbWVyQWJpbGl0aWVzL2hhbW1lclN3aW5nQWJpbGl0eVwiO1xyXG5pbXBvcnQgeyBDb250cm9sbGVyIH0gZnJvbSBcIi4vY29udHJvbGxlclwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEhhbW1lckNvbnRyb2xsZXIgZXh0ZW5kcyBDb250cm9sbGVyIHtcclxuICAgIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBnYW1lOiBHYW1lLCBwcm90ZWN0ZWQgcGxheWVyOiBDbGllbnRIYW1tZXIpIHtcclxuICAgICAgICBzdXBlcihnYW1lLCBwbGF5ZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBzZXRBYmlsaXRpZXMoKSB7XHJcbiAgICAgICAgc3dpdGNoICh0aGlzLnBsYXllci5nZXRTcGVjKCkpIHtcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIHRoaXMuYWJpbGl0eURhdGFbMF0gPSBuZXcgSGFtbWVyU3dpbmdBYmlsaXR5KHRoaXMuZ2FtZSwgdGhpcy5wbGF5ZXIsIHRoaXMsIDApO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hYmlsaXR5RGF0YVsxXSA9IG5ldyBIYW1tZXJQb3VuZEFiaWxpdHkodGhpcy5nYW1lLCB0aGlzLnBsYXllciwgdGhpcywgMSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZW5kU2VydmVySGFtbWVyQWJpbGl0eShhYmlsaXR5OiBIYW1tZXJQbGF5ZXJBYmlsaXR5LCBzdGFydGluZzogYm9vbGVhbiwgbW91c2VQb3M6IFZlY3Rvcikge1xyXG4gICAgICAgIHRoaXMuZ2FtZS5zZXJ2ZXJUYWxrZXIuc2VuZE1lc3NhZ2Uoe1xyXG4gICAgICAgICAgICB0eXBlOiBcImNsaWVudEhhbW1lck1lc3NhZ2VcIixcclxuICAgICAgICAgICAgb3JpZ2luSWQ6IHRoaXMucGxheWVyLmdldEFjdG9ySWQoKSxcclxuICAgICAgICAgICAgcG9zaXRpb246IHRoaXMucGxheWVyLnBvc2l0aW9uLFxyXG4gICAgICAgICAgICBtb21lbnR1bTogdGhpcy5wbGF5ZXIubW9tZW50dW0sXHJcbiAgICAgICAgICAgIG1zZzoge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJjbGllbnRIYW1tZXJBYmlsaXR5XCIsXHJcbiAgICAgICAgICAgICAgICBhYmlsaXR5VHlwZTogYWJpbGl0eSxcclxuICAgICAgICAgICAgICAgIG1vdXNlUG9zLFxyXG4gICAgICAgICAgICAgICAgc3RhcnRpbmcsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgQ2xpZW50SGFtbWVyTWVzc2FnZSB7XHJcbiAgICB0eXBlOiBcImNsaWVudEhhbW1lck1lc3NhZ2VcIjtcclxuICAgIG9yaWdpbklkOiBudW1iZXI7XHJcbiAgICBwb3NpdGlvbjogVmVjdG9yO1xyXG4gICAgbW9tZW50dW06IFZlY3RvcjtcclxuICAgIG1zZzogQ2xpZW50SGFtbWVyQWJpbGl0eSB8IENsaWVudEhhbW1lclN3aW5nSGl0O1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIENsaWVudEhhbW1lckFiaWxpdHkge1xyXG4gICAgdHlwZTogXCJjbGllbnRIYW1tZXJBYmlsaXR5XCI7XHJcbiAgICBhYmlsaXR5VHlwZTogSGFtbWVyUGxheWVyQWJpbGl0eTtcclxuICAgIG1vdXNlUG9zOiBWZWN0b3I7XHJcbiAgICBzdGFydGluZzogYm9vbGVhbjtcclxufVxyXG4iLCJpbXBvcnQgeyBHYW1lIH0gZnJvbSBcIi4uLy4uLy4uL2NsaWVudC9nYW1lXCI7XHJcbmltcG9ydCB7IFZlY3RvciB9IGZyb20gXCIuLi8uLi8uLi92ZWN0b3JcIjtcclxuaW1wb3J0IHsgQ2xpZW50RGFnZ2VycyB9IGZyb20gXCIuLi8uLi9uZXdBY3RvcnMvY2xpZW50QWN0b3JzL2NsaWVudFBsYXllci9jbGllbnRDbGFzc2VzL2NsaWVudERhZ2dlcnNcIjtcclxuaW1wb3J0IHsgQ2xpZW50U3dvcmQsIFN3b3JkUGxheWVyQWJpbGl0eSB9IGZyb20gXCIuLi8uLi9uZXdBY3RvcnMvY2xpZW50QWN0b3JzL2NsaWVudFBsYXllci9jbGllbnRDbGFzc2VzL2NsaWVudFN3b3JkXCI7XHJcbmltcG9ydCB7IENsaWVudFBsYXllciB9IGZyb20gXCIuLi8uLi9uZXdBY3RvcnMvY2xpZW50QWN0b3JzL2NsaWVudFBsYXllci9jbGllbnRQbGF5ZXJcIjtcclxuaW1wb3J0IHsgQ2xpZW50U3dvcmRTbGFzaEhpdCwgU3dvcmRTbGFzaEFiaWxpdHkgfSBmcm9tIFwiLi9hYmlsaXRpZXMvc3dvcmRBYmlsaXRpZXMvc3dvcmRTbGFzaEFiaWxpdHlcIjtcclxuaW1wb3J0IHsgQ2xpZW50U3dvcmRXaGlybHdpbmRIaXQsIFN3b3JkV2hpcmxXaW5kQWJpbGl0eSB9IGZyb20gXCIuL2FiaWxpdGllcy9zd29yZEFiaWxpdGllcy9zd29yZFdoaXJsd2luZEFiaWxpdHlcIjtcclxuaW1wb3J0IHsgQ29udHJvbGxlciB9IGZyb20gXCIuL2NvbnRyb2xsZXJcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBTd29yZENvbnRyb2xsZXIgZXh0ZW5kcyBDb250cm9sbGVyIHtcclxuICAgIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBnYW1lOiBHYW1lLCBwcm90ZWN0ZWQgcGxheWVyOiBDbGllbnRTd29yZCkge1xyXG4gICAgICAgIHN1cGVyKGdhbWUsIHBsYXllcik7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIHNldEFiaWxpdGllcygpIHtcclxuICAgICAgICBzd2l0Y2ggKHRoaXMucGxheWVyLmdldFNwZWMoKSkge1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgdGhpcy5hYmlsaXR5RGF0YVswXSA9IG5ldyBTd29yZFNsYXNoQWJpbGl0eSh0aGlzLmdhbWUsIHRoaXMucGxheWVyLCB0aGlzLCAwKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYWJpbGl0eURhdGFbMV0gPSBuZXcgU3dvcmRXaGlybFdpbmRBYmlsaXR5KHRoaXMuZ2FtZSwgdGhpcy5wbGF5ZXIsIHRoaXMsIDEpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2VuZFNlcnZlclN3b3JkQWJpbGl0eShhYmlsaXR5OiBTd29yZFBsYXllckFiaWxpdHksIHN0YXJ0aW5nOiBib29sZWFuLCBtb3VzZVBvczogVmVjdG9yKSB7XHJcbiAgICAgICAgdGhpcy5nYW1lLnNlcnZlclRhbGtlci5zZW5kTWVzc2FnZSh7XHJcbiAgICAgICAgICAgIHR5cGU6IFwiY2xpZW50U3dvcmRNZXNzYWdlXCIsXHJcbiAgICAgICAgICAgIG9yaWdpbklkOiB0aGlzLnBsYXllci5nZXRBY3RvcklkKCksXHJcbiAgICAgICAgICAgIHBvc2l0aW9uOiB0aGlzLnBsYXllci5wb3NpdGlvbixcclxuICAgICAgICAgICAgbW9tZW50dW06IHRoaXMucGxheWVyLm1vbWVudHVtLFxyXG4gICAgICAgICAgICBtc2c6IHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IFwiY2xpZW50U3dvcmRBYmlsaXR5XCIsXHJcbiAgICAgICAgICAgICAgICBhYmlsaXR5VHlwZTogYWJpbGl0eSxcclxuICAgICAgICAgICAgICAgIG1vdXNlUG9zLFxyXG4gICAgICAgICAgICAgICAgc3RhcnRpbmcsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgQ2xpZW50U3dvcmRNZXNzYWdlIHtcclxuICAgIHR5cGU6IFwiY2xpZW50U3dvcmRNZXNzYWdlXCI7XHJcbiAgICBvcmlnaW5JZDogbnVtYmVyO1xyXG4gICAgcG9zaXRpb246IFZlY3RvcjtcclxuICAgIG1vbWVudHVtOiBWZWN0b3I7XHJcbiAgICBtc2c6IENsaWVudFN3b3JkV2hpcmx3aW5kSGl0IHwgQ2xpZW50U3dvcmRTbGFzaEhpdCB8IENsaWVudFN3b3JkQWJpbGl0eTtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBDbGllbnRTd29yZEFiaWxpdHkge1xyXG4gICAgdHlwZTogXCJjbGllbnRTd29yZEFiaWxpdHlcIjtcclxuICAgIGFiaWxpdHlUeXBlOiBTd29yZFBsYXllckFiaWxpdHk7XHJcbiAgICBtb3VzZVBvczogVmVjdG9yO1xyXG4gICAgc3RhcnRpbmc6IGJvb2xlYW47XHJcbn1cclxuIiwiaW1wb3J0IHsgR2FtZSB9IGZyb20gXCIuLi8uLi9jbGllbnQvZ2FtZVwiO1xyXG5pbXBvcnQgeyBBYmlsaXR5SW1hZ2VOYW1lLCBhc3NldE1hbmFnZXIsIGltYWdlSW5mb3JtYXRpb24sIEltYWdlTmFtZSB9IGZyb20gXCIuLi8uLi9jbGllbnQvZ2FtZVJlbmRlci9hc3NldG1hbmFnZXJcIjtcclxuaW1wb3J0IHsgc2FmZUdldEVsZW1lbnRCeUlkIH0gZnJvbSBcIi4uLy4uL2NsaWVudC91dGlsXCI7XHJcbmltcG9ydCB7IGRlZmF1bHRDb25maWcgfSBmcm9tIFwiLi4vLi4vY29uZmlnXCI7XHJcbmltcG9ydCB7IGRlZmF1bHRBY3RvckNvbmZpZyB9IGZyb20gXCIuLi9uZXdBY3RvcnMvYWN0b3JDb25maWdcIjtcclxuaW1wb3J0IHsgQ2xhc3NUeXBlIH0gZnJvbSBcIi4uL25ld0FjdG9ycy9zZXJ2ZXJBY3RvcnMvc2VydmVyUGxheWVyL3NlcnZlclBsYXllclwiO1xyXG5pbXBvcnQgeyBDbGllbnRQbGF5ZXIgfSBmcm9tIFwiLi4vbmV3QWN0b3JzL2NsaWVudEFjdG9ycy9jbGllbnRQbGF5ZXIvY2xpZW50UGxheWVyXCI7XHJcbmltcG9ydCB7IFVzZXJJbnRlcmZhY2UgfSBmcm9tIFwiLi91c2VySW50ZXJmYWNlXCI7XHJcbmltcG9ydCB7IFZlY3RvciB9IGZyb20gXCIuLi8uLi92ZWN0b3JcIjtcclxuaW1wb3J0IHsgQ29udHJvbGxlciB9IGZyb20gXCIuL2NvbnRyb2xsZXJzL2NvbnRyb2xsZXJcIjtcclxuaW1wb3J0IHsgRGFnZ2Vyc0NvbnRyb2xsZXIgfSBmcm9tIFwiLi9jb250cm9sbGVycy9kYWdnZXJzQ29udHJvbGxlclwiO1xyXG5pbXBvcnQgeyBDbGllbnREYWdnZXJzIH0gZnJvbSBcIi4uL25ld0FjdG9ycy9jbGllbnRBY3RvcnMvY2xpZW50UGxheWVyL2NsaWVudENsYXNzZXMvY2xpZW50RGFnZ2Vyc1wiO1xyXG5pbXBvcnQgeyBIYW1tZXJDb250cm9sbGVyIH0gZnJvbSBcIi4vY29udHJvbGxlcnMvaGFtbWVyQ29udHJvbGxlclwiO1xyXG5pbXBvcnQgeyBDbGllbnRIYW1tZXIgfSBmcm9tIFwiLi4vbmV3QWN0b3JzL2NsaWVudEFjdG9ycy9jbGllbnRQbGF5ZXIvY2xpZW50Q2xhc3Nlcy9jbGllbnRIYW1tZXJcIjtcclxuaW1wb3J0IHsgQ2xpZW50U3dvcmQgfSBmcm9tIFwiLi4vbmV3QWN0b3JzL2NsaWVudEFjdG9ycy9jbGllbnRQbGF5ZXIvY2xpZW50Q2xhc3Nlcy9jbGllbnRTd29yZFwiO1xyXG5pbXBvcnQgeyBTd29yZENvbnRyb2xsZXIgfSBmcm9tIFwiLi9jb250cm9sbGVycy9zd29yZENvbnRyb2xsZXJcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBJbnB1dFJlYWRlciB7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkga2V5U3RhdGU6IFJlY29yZDxzdHJpbmcsIGJvb2xlYW4+ID0ge307XHJcbiAgICBwcm90ZWN0ZWQgcHJlc3NBYmlsaXRpZXNOZXh0RnJhbWU6IGJvb2xlYW5bXSA9IFtmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZV07XHJcbiAgICBwcm90ZWN0ZWQgcmVsZWFzZUFiaWxpdGllc05leHRGcmFtZTogYm9vbGVhbltdID0gW2ZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlXTtcclxuXHJcbiAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgY29uZmlnID0gZGVmYXVsdENvbmZpZztcclxuXHJcbiAgICBwcm90ZWN0ZWQganVtcENvdW50OiBudW1iZXIgPSAwO1xyXG4gICAgcHJvdGVjdGVkIHdhc01vdmluZ1JpZ2h0OiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwcm90ZWN0ZWQgd2FzTW92aW5nTGVmdDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHJvdGVjdGVkIHdhc0Nyb3VjaGluZzogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgIHB1YmxpYyByZWFkb25seSB1c2VySW50ZXJmYWNlOiBVc2VySW50ZXJmYWNlO1xyXG4gICAgcHVibGljIHJlYWRvbmx5IGNvbnRyb2xsZXI6IENvbnRyb2xsZXI7XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJvdGVjdGVkIHBsYXllcjogQ2xpZW50UGxheWVyLCBwcm90ZWN0ZWQgZ2FtZTogR2FtZSkge1xyXG4gICAgICAgIHN3aXRjaCAodGhpcy5wbGF5ZXIuZ2V0Q2xhc3NUeXBlKCkpIHtcclxuICAgICAgICAgICAgY2FzZSBcImRhZ2dlcnNcIjpcclxuICAgICAgICAgICAgICAgIHRoaXMuY29udHJvbGxlciA9IG5ldyBEYWdnZXJzQ29udHJvbGxlcih0aGlzLmdhbWUsIHRoaXMucGxheWVyIGFzIENsaWVudERhZ2dlcnMpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJoYW1tZXJcIjpcclxuICAgICAgICAgICAgICAgIHRoaXMuY29udHJvbGxlciA9IG5ldyBIYW1tZXJDb250cm9sbGVyKHRoaXMuZ2FtZSwgdGhpcy5wbGF5ZXIgYXMgQ2xpZW50SGFtbWVyKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwic3dvcmRcIjpcclxuICAgICAgICAgICAgICAgIHRoaXMuY29udHJvbGxlciA9IG5ldyBTd29yZENvbnRyb2xsZXIodGhpcy5nYW1lLCB0aGlzLnBsYXllciBhcyBDbGllbnRTd29yZCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcInVua25vd24gY2xhc3MgdHlwZSBpbiBpbnB1dCByZWFkZXIgY29uc3RydWN0b3JcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMudXNlckludGVyZmFjZSA9IG5ldyBVc2VySW50ZXJmYWNlKHRoaXMuY29udHJvbGxlciwgdGhpcy5wbGF5ZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZWdpc3Rlck1vdXNlRG93bihlOiBNb3VzZUV2ZW50LCBnbG9iYWxNb3VzZVBvczogVmVjdG9yKSB7XHJcbiAgICAgICAgaWYgKGUuYnV0dG9uID09PSAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMucHJlc3NBYmlsaXRpZXNOZXh0RnJhbWVbMF0gPSB0cnVlO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoZS5idXR0b24gPT09IDIpIHtcclxuICAgICAgICAgICAgdGhpcy5wcmVzc0FiaWxpdGllc05leHRGcmFtZVsxXSA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHVibGljIHJlZ2lzdGVyTW91c2VVcChlOiBNb3VzZUV2ZW50LCBnbG9iYWxNb3VzZVBvczogVmVjdG9yKSB7XHJcbiAgICAgICAgaWYgKGUuYnV0dG9uID09PSAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVsZWFzZUFiaWxpdGllc05leHRGcmFtZVswXSA9IHRydWU7XHJcbiAgICAgICAgfSBlbHNlIGlmIChlLmJ1dHRvbiA9PT0gMikge1xyXG4gICAgICAgICAgICB0aGlzLnJlbGVhc2VBYmlsaXRpZXNOZXh0RnJhbWVbMV0gPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHB1YmxpYyByZWdpc3RlcktleURvd24oZTogS2V5Ym9hcmRFdmVudCwgZ2xvYmFsTW91c2VQb3M6IFZlY3Rvcikge1xyXG4gICAgICAgIGlmIChlLmNvZGUgPT09IHRoaXMuY29uZmlnLnBsYXllcktleXMuZmlyc3RBYmlsaXR5KSB7XHJcbiAgICAgICAgICAgIHRoaXMucHJlc3NBYmlsaXRpZXNOZXh0RnJhbWVbMl0gPSB0cnVlO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoZS5jb2RlID09PSB0aGlzLmNvbmZpZy5wbGF5ZXJLZXlzLnNlY29uZEFiaWxpdHkpIHtcclxuICAgICAgICAgICAgdGhpcy5wcmVzc0FiaWxpdGllc05leHRGcmFtZVszXSA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMua2V5U3RhdGVbZS5jb2RlXSA9IHRydWU7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgcmVnaXN0ZXJLZXlVcChlOiBLZXlib2FyZEV2ZW50LCBnbG9iYWxNb3VzZVBvczogVmVjdG9yKSB7XHJcbiAgICAgICAgaWYgKGUuY29kZSA9PT0gdGhpcy5jb25maWcucGxheWVyS2V5cy5maXJzdEFiaWxpdHkpIHtcclxuICAgICAgICAgICAgdGhpcy5yZWxlYXNlQWJpbGl0aWVzTmV4dEZyYW1lWzJdID0gdHJ1ZTtcclxuICAgICAgICB9IGVsc2UgaWYgKGUuY29kZSA9PT0gdGhpcy5jb25maWcucGxheWVyS2V5cy5zZWNvbmRBYmlsaXR5KSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVsZWFzZUFiaWxpdGllc05leHRGcmFtZVszXSA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMua2V5U3RhdGVbZS5jb2RlXSA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCB1cGRhdGVHYW1lUGxheWVyTW92ZUFjdGlvbnMoKSB7XHJcbiAgICAgICAgbGV0IHRlbXBXYXNNb3ZpbmdMZWZ0OiBib29sZWFuID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5wbGF5ZXIubW92ZUFjdGlvbnNOZXh0RnJhbWUubW92ZUxlZnQgPSBmYWxzZTtcclxuICAgICAgICBpZiAodGhpcy5rZXlTdGF0ZVt0aGlzLmNvbmZpZy5wbGF5ZXJLZXlzLmxlZnRdKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnBsYXllci5hdHRlbXB0TW92ZUxlZnRBY3Rpb24oKSkgdGVtcFdhc01vdmluZ0xlZnQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGVtcFdhc01vdmluZ0xlZnQgIT09IHRoaXMud2FzTW92aW5nTGVmdCkge1xyXG4gICAgICAgICAgICB0aGlzLmdhbWUuc2VydmVyVGFsa2VyLnNlbmRNZXNzYWdlKHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IFwiY2xpZW50UGxheWVyQWN0aW9uXCIsXHJcbiAgICAgICAgICAgICAgICBwbGF5ZXJJZDogdGhpcy5wbGF5ZXIuZ2V0QWN0b3JJZCgpLFxyXG4gICAgICAgICAgICAgICAgYWN0aW9uVHlwZTogXCJtb3ZlTGVmdFwiLFxyXG4gICAgICAgICAgICAgICAgc3RhcnRpbmc6IHRlbXBXYXNNb3ZpbmdMZWZ0LFxyXG4gICAgICAgICAgICAgICAgcG9zaXRpb246IHRoaXMucGxheWVyLnBvc2l0aW9uLFxyXG4gICAgICAgICAgICAgICAgbW9tZW50dW06IHRoaXMucGxheWVyLm1vbWVudHVtLFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGhpcy53YXNNb3ZpbmdMZWZ0ID0gdGVtcFdhc01vdmluZ0xlZnQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgdGVtcFdhc01vdmluZ1JpZ2h0OiBib29sZWFuID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5wbGF5ZXIubW92ZUFjdGlvbnNOZXh0RnJhbWUubW92ZVJpZ2h0ID0gZmFsc2U7XHJcbiAgICAgICAgaWYgKHRoaXMua2V5U3RhdGVbdGhpcy5jb25maWcucGxheWVyS2V5cy5yaWdodF0pIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMucGxheWVyLmF0dGVtcHRNb3ZlUmlnaHRBY3Rpb24oKSkgdGVtcFdhc01vdmluZ1JpZ2h0ID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRlbXBXYXNNb3ZpbmdSaWdodCAhPT0gdGhpcy53YXNNb3ZpbmdSaWdodCkge1xyXG4gICAgICAgICAgICB0aGlzLmdhbWUuc2VydmVyVGFsa2VyLnNlbmRNZXNzYWdlKHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IFwiY2xpZW50UGxheWVyQWN0aW9uXCIsXHJcbiAgICAgICAgICAgICAgICBwbGF5ZXJJZDogdGhpcy5wbGF5ZXIuZ2V0QWN0b3JJZCgpLFxyXG4gICAgICAgICAgICAgICAgYWN0aW9uVHlwZTogXCJtb3ZlUmlnaHRcIixcclxuICAgICAgICAgICAgICAgIHN0YXJ0aW5nOiB0ZW1wV2FzTW92aW5nUmlnaHQsXHJcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogdGhpcy5wbGF5ZXIucG9zaXRpb24sXHJcbiAgICAgICAgICAgICAgICBtb21lbnR1bTogdGhpcy5wbGF5ZXIubW9tZW50dW0sXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0aGlzLndhc01vdmluZ1JpZ2h0ID0gdGVtcFdhc01vdmluZ1JpZ2h0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHRlbXBXYXNDcm91Y2hpbmc6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgICAgICB0aGlzLnBsYXllci5tb3ZlQWN0aW9uc05leHRGcmFtZS5jcm91Y2ggPSBmYWxzZTtcclxuICAgICAgICBpZiAodGhpcy5rZXlTdGF0ZVt0aGlzLmNvbmZpZy5wbGF5ZXJLZXlzLmRvd25dKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnBsYXllci5hdHRlbXB0Q3JvdWNoQWN0aW9uKCkpIHRlbXBXYXNDcm91Y2hpbmcgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGVtcFdhc0Nyb3VjaGluZyAhPT0gdGhpcy53YXNDcm91Y2hpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5nYW1lLnNlcnZlclRhbGtlci5zZW5kTWVzc2FnZSh7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiBcImNsaWVudFBsYXllckFjdGlvblwiLFxyXG4gICAgICAgICAgICAgICAgcGxheWVySWQ6IHRoaXMucGxheWVyLmdldEFjdG9ySWQoKSxcclxuICAgICAgICAgICAgICAgIGFjdGlvblR5cGU6IFwiY3JvdWNoXCIsXHJcbiAgICAgICAgICAgICAgICBzdGFydGluZzogdGVtcFdhc0Nyb3VjaGluZyxcclxuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiB0aGlzLnBsYXllci5wb3NpdGlvbixcclxuICAgICAgICAgICAgICAgIG1vbWVudHVtOiB0aGlzLnBsYXllci5tb21lbnR1bSxcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHRoaXMud2FzQ3JvdWNoaW5nID0gdGVtcFdhc0Nyb3VjaGluZztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnBsYXllci5hY3Rvck9iamVjdC5zdGFuZGluZykge1xyXG4gICAgICAgICAgICB0aGlzLmp1bXBDb3VudCA9IDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5rZXlTdGF0ZVt0aGlzLmNvbmZpZy5wbGF5ZXJLZXlzLnVwXSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5qdW1wQ291bnQgPCAyICYmIHRoaXMucGxheWVyLmF0dGVtcHRKdW1wQWN0aW9uKCkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5zZXJ2ZXJUYWxrZXIuc2VuZE1lc3NhZ2Uoe1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiY2xpZW50UGxheWVyQWN0aW9uXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgcGxheWVySWQ6IHRoaXMucGxheWVyLmdldEFjdG9ySWQoKSxcclxuICAgICAgICAgICAgICAgICAgICBhY3Rpb25UeXBlOiBcImp1bXBcIixcclxuICAgICAgICAgICAgICAgICAgICBzdGFydGluZzogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogdGhpcy5wbGF5ZXIucG9zaXRpb24sXHJcbiAgICAgICAgICAgICAgICAgICAgbW9tZW50dW06IHRoaXMucGxheWVyLm1vbWVudHVtLFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmp1bXBDb3VudCsrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMua2V5U3RhdGVbdGhpcy5jb25maWcucGxheWVyS2V5cy51cF0gPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIHVwZGF0ZUdhbWVQbGF5ZXJBYmlsaXRpZXMoKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaTogbnVtYmVyID0gMDsgaSA8IDQ7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5wcmVzc0FiaWxpdGllc05leHRGcmFtZVtpXSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb250cm9sbGVyLnByZXNzQWJpbGl0eShpIGFzIDAgfCAxIHwgMiB8IDMpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGkgIT09IDApIHRoaXMucHJlc3NBYmlsaXRpZXNOZXh0RnJhbWVbaV0gPSBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKGxldCBpOiBudW1iZXIgPSAwOyBpIDwgNDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnJlbGVhc2VBYmlsaXRpZXNOZXh0RnJhbWVbaV0gPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29udHJvbGxlci5yZWxlYXNlQWJpbGl0eShpIGFzIDAgfCAxIHwgMiB8IDMpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZWxlYXNlQWJpbGl0aWVzTmV4dEZyYW1lW2ldID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBpZiAoaSA9PT0gMCkgdGhpcy5wcmVzc0FiaWxpdGllc05leHRGcmFtZVtpXSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB1cGRhdGUoZWxhcHNlZFRpbWU6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMudXBkYXRlR2FtZVBsYXllck1vdmVBY3Rpb25zKCk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVHYW1lUGxheWVyQWJpbGl0aWVzKCk7XHJcblxyXG4gICAgICAgIHRoaXMuY29udHJvbGxlci51cGRhdGUoZWxhcHNlZFRpbWUpO1xyXG4gICAgICAgIHRoaXMudXNlckludGVyZmFjZS51cGRhdGVBbmRSZW5kZXIoKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBhc3NldE1hbmFnZXIgfSBmcm9tIFwiLi4vLi4vY2xpZW50L2dhbWVSZW5kZXIvYXNzZXRtYW5hZ2VyXCI7XHJcbmltcG9ydCB7IHNhZmVHZXRFbGVtZW50QnlJZCB9IGZyb20gXCIuLi8uLi9jbGllbnQvdXRpbFwiO1xyXG5pbXBvcnQgeyBkZWZhdWx0QWN0b3JDb25maWcgfSBmcm9tIFwiLi4vbmV3QWN0b3JzL2FjdG9yQ29uZmlnXCI7XHJcbmltcG9ydCB7IENsYXNzVHlwZSB9IGZyb20gXCIuLi9uZXdBY3RvcnMvc2VydmVyQWN0b3JzL3NlcnZlclBsYXllci9zZXJ2ZXJQbGF5ZXJcIjtcclxuaW1wb3J0IHsgQ2xpZW50UGxheWVyIH0gZnJvbSBcIi4uL25ld0FjdG9ycy9jbGllbnRBY3RvcnMvY2xpZW50UGxheWVyL2NsaWVudFBsYXllclwiO1xyXG5pbXBvcnQgeyBWZWN0b3IgfSBmcm9tIFwiLi4vLi4vdmVjdG9yXCI7XHJcbmltcG9ydCB7IFBsYXllckFiaWxpdHkgfSBmcm9tIFwiLi9jb250cm9sbGVycy9hYmlsaXRpZXMvcGxheWVyQWJpbGl0eVwiO1xyXG5pbXBvcnQgeyBDb250cm9sbGVyIH0gZnJvbSBcIi4vY29udHJvbGxlcnMvY29udHJvbGxlclwiO1xyXG5pbXBvcnQgeyByb3VuZFJlY3QgfSBmcm9tIFwiLi4vLi4vY2xpZW50L2dhbWVSZW5kZXIvZ2FtZVJlbmRlcmVyXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgVXNlckludGVyZmFjZSB7XHJcbiAgICBwcm90ZWN0ZWQgWFB0b05leHRMZXZlbDogbnVtYmVyO1xyXG4gICAgcHJvdGVjdGVkIGN1cnJlbnRYUDogbnVtYmVyID0gMDtcclxuICAgIHByb3RlY3RlZCBjdXJyZW50TGV2ZWw6IG51bWJlcjtcclxuICAgIHByb3RlY3RlZCBoZWFsdGhJbmZvOiB7IGhlYWx0aDogbnVtYmVyOyBtYXhIZWFsdGg6IG51bWJlciB9O1xyXG4gICAgcHJvdGVjdGVkIGRpc3BsYXlIZWFsdGg6IG51bWJlcjtcclxuXHJcbiAgICAvL3Byb3RlY3RlZCByZWFkb25seSBwb3J0cmFpdEVsZW1lbnQ6IEhUTUxDYW52YXNFbGVtZW50ID0gc2FmZUdldEVsZW1lbnRCeUlkKFwicG9ydHJhaXRDYW52YXNcIikgYXMgSFRNTENhbnZhc0VsZW1lbnQ7XHJcbiAgICAvL3Byb3RlY3RlZCByZWFkb25seSBwb3J0cmFpdENhbnZhczogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEID0gdGhpcy5wb3J0cmFpdEVsZW1lbnQuZ2V0Q29udGV4dChcIjJkXCIpITtcclxuXHJcbiAgICBwcm90ZWN0ZWQgaGVhbHRoQ2hhbmdlZDogYm9vbGVhbiA9IHRydWU7XHJcbiAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgaGVhbHRoRWxlbWVudDogSFRNTENhbnZhc0VsZW1lbnQgPSBzYWZlR2V0RWxlbWVudEJ5SWQoXCJoZWFsdGhDYW52YXNcIikgYXMgSFRNTENhbnZhc0VsZW1lbnQ7XHJcbiAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgaGVhbHRoQ2FudmFzOiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgPSB0aGlzLmhlYWx0aEVsZW1lbnQuZ2V0Q29udGV4dChcIjJkXCIpITtcclxuXHJcbiAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgYWJpbGl0eUVsZW1lbnQ6IEhUTUxDYW52YXNFbGVtZW50ID0gc2FmZUdldEVsZW1lbnRCeUlkKFwiYWJpbGl0eUNhbnZhc1wiKSBhcyBIVE1MQ2FudmFzRWxlbWVudDtcclxuICAgIHByb3RlY3RlZCByZWFkb25seSBhYmlsaXR5Q2FudmFzOiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgPSB0aGlzLmFiaWxpdHlFbGVtZW50LmdldENvbnRleHQoXCIyZFwiKSE7XHJcblxyXG4gICAgcHJvdGVjdGVkIHJlYWRvbmx5IGFiaWxpdHlJbWFnZXM6IEhUTUxJbWFnZUVsZW1lbnRbXTtcclxuICAgIHByb3RlY3RlZCBhYmlsaXR5Q2hhbmdlZDogYm9vbGVhbltdID0gW3RydWUsIHRydWUsIHRydWUsIHRydWVdO1xyXG5cclxuICAgIHByb3RlY3RlZCByZWFkb25seSBwbGF5ZXJBYmlsaXR5U3RhdHVzOiBQbGF5ZXJBYmlsaXR5W107XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJvdGVjdGVkIHJlYWRvbmx5IGNvbnRyb2xsZXI6IENvbnRyb2xsZXIsIHByb3RlY3RlZCByZWFkb25seSBwbGF5ZXI6IENsaWVudFBsYXllcikge1xyXG4gICAgICAgIHRoaXMucGxheWVyQWJpbGl0eVN0YXR1cyA9IHRoaXMuY29udHJvbGxlci5nZXRBYmlsaXR5U3RhdHVzKCk7XHJcblxyXG4gICAgICAgIC8vdGhpcy5wb3J0cmFpdEVsZW1lbnQud2lkdGggPSA1MDtcclxuICAgICAgICAvL3RoaXMucG9ydHJhaXRFbGVtZW50LmhlaWdodCA9IDUwO1xyXG5cclxuICAgICAgICB0aGlzLmhlYWx0aEVsZW1lbnQud2lkdGggPSAyNTA7XHJcbiAgICAgICAgdGhpcy5oZWFsdGhFbGVtZW50LmhlaWdodCA9IDc1O1xyXG5cclxuICAgICAgICB0aGlzLmFiaWxpdHlFbGVtZW50LndpZHRoID0gNDAwO1xyXG4gICAgICAgIHRoaXMuYWJpbGl0eUVsZW1lbnQuaGVpZ2h0ID0gMTIwO1xyXG5cclxuICAgICAgICB0aGlzLmhlYWx0aEluZm8gPSBwbGF5ZXIuZ2V0SGVhbHRoSW5mbygpO1xyXG4gICAgICAgIHRoaXMuZGlzcGxheUhlYWx0aCA9IHRoaXMuaGVhbHRoSW5mby5oZWFsdGggKyAwO1xyXG5cclxuICAgICAgICB0aGlzLmN1cnJlbnRMZXZlbCA9IHRoaXMucGxheWVyLmdldExldmVsKCk7XHJcbiAgICAgICAgdGhpcy5YUHRvTmV4dExldmVsID0gZGVmYXVsdEFjdG9yQ29uZmlnLlhQUGVyTGV2ZWwgKiBNYXRoLnBvdyhkZWZhdWx0QWN0b3JDb25maWcuTGV2ZWxYUE11bHRpcGxpZXIsIHRoaXMuY3VycmVudExldmVsKTtcclxuICAgICAgICAvL3RoaXMubGV2ZWxDb3VudEVsZW1lbnQuaW5uZXJUZXh0ID0gU3RyaW5nKHRoaXMuY3VycmVudExldmVsKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZVhQYmFyKDApO1xyXG4gICAgICAgIHRoaXMuYWJpbGl0eUltYWdlcyA9IGdldEFiaWxpdHlJbWFnZXModGhpcy5wbGF5ZXIuZ2V0Q2xhc3NUeXBlKCksIHRoaXMuY3VycmVudExldmVsLCB0aGlzLnBsYXllci5nZXRTcGVjKCkpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlUGFzc2l2ZUFiaWxpdHkodGhpcy5hYmlsaXR5SW1hZ2VzWzRdKTtcclxuICAgICAgICAvL3RoaXMudXBkYXRlQWJpbGl0eUltYWdlcyh0aGlzLnBsYXllci5nZXRDbGFzc1R5cGUoKSwgdGhpcy5jdXJyZW50TGV2ZWwsIHRoaXMucGxheWVyLmdldFNwZWMoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHVwZGF0ZVhQYmFyKHF1YW50aXR5OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLmN1cnJlbnRYUCA9IHF1YW50aXR5O1xyXG4gICAgICAgIHRoaXMucmVuZGVyUG9ydHJhaXQoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgbGV2ZWxVcChsZXZlbDogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50TGV2ZWwgPSBsZXZlbDtcclxuICAgICAgICB0aGlzLlhQdG9OZXh0TGV2ZWwgPSBkZWZhdWx0QWN0b3JDb25maWcuWFBQZXJMZXZlbCAqIE1hdGgucG93KGRlZmF1bHRBY3RvckNvbmZpZy5MZXZlbFhQTXVsdGlwbGllciwgdGhpcy5jdXJyZW50TGV2ZWwpO1xyXG5cclxuICAgICAgICB0aGlzLnVwZGF0ZVhQYmFyKDApO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZWdpc3RlcktleU9yTW91c2VDaGFuZ2UoaW5kZXg6IDAgfCAxIHwgMiB8IDMpIHtcclxuICAgICAgICB0aGlzLmFiaWxpdHlDaGFuZ2VkW2luZGV4XSA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLypwdWJsaWMgdXBkYXRlQWJpbGl0eUltYWdlcyhjbGFzc1R5cGU6IENsYXNzVHlwZSwgbGV2ZWw6IG51bWJlciwgc3BlYzogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5hYmlsaXR5SW1hZ2VzID0gZ2V0QWJpbGl0eUltYWdlcyhjbGFzc1R5cGUsIGxldmVsLCBzcGVjKTtcclxuICAgICAgICB0aGlzLmFiaWxpdGllc0NoYW5nZWQgPSB0cnVlO1xyXG4gICAgICAgIGZvciAobGV0IGk6IG51bWJlciA9IDA7IGkgPCA1OyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5hYmlsaXR5Q2hhbmdlZFtpXSA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgfSovXHJcblxyXG4gICAgcHVibGljIHVwZGF0ZUFuZFJlbmRlcigpIHtcclxuICAgICAgICBpZiAodGhpcy5kaXNwbGF5SGVhbHRoICsgNSA8IHRoaXMuaGVhbHRoSW5mby5oZWFsdGgpIHtcclxuICAgICAgICAgICAgdGhpcy5kaXNwbGF5SGVhbHRoICs9IDU7XHJcbiAgICAgICAgICAgIHRoaXMuaGVhbHRoQ2hhbmdlZCA9IHRydWU7XHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmRpc3BsYXlIZWFsdGggLSA1ID4gdGhpcy5oZWFsdGhJbmZvLmhlYWx0aCkge1xyXG4gICAgICAgICAgICB0aGlzLmRpc3BsYXlIZWFsdGggLT0gNTtcclxuICAgICAgICAgICAgdGhpcy5oZWFsdGhDaGFuZ2VkID0gdHJ1ZTtcclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuZGlzcGxheUhlYWx0aCAhPT0gdGhpcy5oZWFsdGhJbmZvLmhlYWx0aCkge1xyXG4gICAgICAgICAgICB0aGlzLmRpc3BsYXlIZWFsdGggPSB0aGlzLmhlYWx0aEluZm8uaGVhbHRoICsgMDtcclxuICAgICAgICAgICAgdGhpcy5oZWFsdGhDaGFuZ2VkID0gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmhlYWx0aENoYW5nZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5yZW5kZXJIZWFsdGgoKTtcclxuICAgICAgICAgICAgdGhpcy5oZWFsdGhDaGFuZ2VkID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnJlbmRlckFiaWxpdGllcygpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCByZW5kZXJIZWFsdGgoKSB7XHJcbiAgICAgICAgLy90aGlzLmhlYWx0aENhbnZhcy5jbGVhclJlY3QoMCwgMCwgdGhpcy5oZWFsdGhFbGVtZW50LndpZHRoLCAyMCk7XHJcblxyXG4gICAgICAgIHRoaXMuaGVhbHRoQ2FudmFzLmZpbGxTdHlsZSA9IFwicmdiKDIzMCwgMjMwLCAyMzApXCI7XHJcblxyXG4gICAgICAgIGxldCBzZWdtZW50czogbnVtYmVyID0gTWF0aC5jZWlsKHRoaXMuaGVhbHRoSW5mby5tYXhIZWFsdGggLyAyMCk7XHJcbiAgICAgICAgbGV0IHdpZHRoOiBudW1iZXIgPSB0aGlzLmhlYWx0aEVsZW1lbnQud2lkdGggLyBzZWdtZW50cztcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaTogbnVtYmVyID0gMDsgaSA8IHNlZ21lbnRzOyBpKyspIHtcclxuICAgICAgICAgICAgcm91bmRSZWN0KHRoaXMuaGVhbHRoQ2FudmFzLCBpICogd2lkdGggKyAxLCAxMCwgd2lkdGggLSAyLCA0MCwgNCwgdHJ1ZSwgZmFsc2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5oZWFsdGhDYW52YXMuY2xlYXJSZWN0KFxyXG4gICAgICAgICAgICB0aGlzLmhlYWx0aEVsZW1lbnQud2lkdGgsXHJcbiAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgIHRoaXMuaGVhbHRoRWxlbWVudC53aWR0aCAqICh0aGlzLmRpc3BsYXlIZWFsdGggLyB0aGlzLmhlYWx0aEluZm8ubWF4SGVhbHRoIC0gMSksXHJcbiAgICAgICAgICAgIHRoaXMuaGVhbHRoRWxlbWVudC5oZWlnaHQsXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgdGhpcy5oZWFsdGhDYW52YXMuZmlsbFN0eWxlID0gXCJyZ2JhKDIzMCwgMjMwLCAyMzAsIDAuMilcIjtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaTogbnVtYmVyID0gMDsgaSA8IHNlZ21lbnRzOyBpKyspIHtcclxuICAgICAgICAgICAgcm91bmRSZWN0KHRoaXMuaGVhbHRoQ2FudmFzLCBpICogd2lkdGggKyAxLCAxMCwgd2lkdGggLSAyLCA0MCwgNCwgdHJ1ZSwgZmFsc2UpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgcmVuZGVyUG9ydHJhaXQoKSB7XHJcbiAgICAgICAgLyp0aGlzLnBvcnRyYWl0Q2FudmFzLmNsZWFyUmVjdCgwLCAwLCB0aGlzLnBvcnRyYWl0RWxlbWVudC53aWR0aCwgdGhpcy5wb3J0cmFpdEVsZW1lbnQuaGVpZ2h0KTtcclxuXHJcbiAgICAgICAgLy9YUCByZW5kZXJcclxuICAgICAgICB0aGlzLnBvcnRyYWl0Q2FudmFzLnN0cm9rZVN0eWxlID0gXCJ5ZWxsb3dcIjtcclxuICAgICAgICByb3VuZEhleCh0aGlzLnBvcnRyYWl0Q2FudmFzLCAwLCAwLCB0aGlzLnBvcnRyYWl0RWxlbWVudC53aWR0aCwgdGhpcy5wb3J0cmFpdEVsZW1lbnQuaGVpZ2h0LCAxMCwgNSwgdHJ1ZSk7XHJcbiAgICAgICAgdGhpcy5wb3J0cmFpdENhbnZhcy5jbGVhclJlY3QoMCwgMCwgdGhpcy5wb3J0cmFpdEVsZW1lbnQud2lkdGgsIDEgKyB0aGlzLnBvcnRyYWl0RWxlbWVudC5oZWlnaHQgKiAoMSAtIHRoaXMuY3VycmVudFhQKSAqIDAuOTUpO1xyXG5cclxuICAgICAgICB0aGlzLnBvcnRyYWl0Q2FudmFzLnN0cm9rZVN0eWxlID0gXCJyZ2IoMjMwLCAyMzAsIDIzMClcIjtcclxuICAgICAgICByb3VuZEhleCh0aGlzLnBvcnRyYWl0Q2FudmFzLCA0LCA0LCB0aGlzLnBvcnRyYWl0RWxlbWVudC53aWR0aCAtIDgsIHRoaXMucG9ydHJhaXRFbGVtZW50LmhlaWdodCAtIDgsIDUsIDQsIHRydWUpOyovXHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIHJlbmRlckxldmVsKCkge31cclxuICAgIHB1YmxpYyB1cGRhdGVQYXNzaXZlQWJpbGl0eShpbWc6IEhUTUxJbWFnZUVsZW1lbnQpIHtcclxuICAgICAgICB0aGlzLmFiaWxpdHlDYW52YXMubGluZVdpZHRoID0gMTtcclxuICAgICAgICB0aGlzLmFiaWxpdHlDYW52YXMuc3Ryb2tlU3R5bGUgPSBcInJnYigyMzAsIDIzMCwgMjMwKVwiO1xyXG4gICAgICAgIHRoaXMuYWJpbGl0eUNhbnZhcy5jbGVhclJlY3QoMzMwLCAzMCwgNTUsIDU1KTtcclxuICAgICAgICByb3VuZFJlY3QodGhpcy5hYmlsaXR5Q2FudmFzLCAzMzMsIDMyLCA1MCwgNTAsIDEwLCBmYWxzZSwgdHJ1ZSk7XHJcbiAgICAgICAgdGhpcy5hYmlsaXR5Q2FudmFzLmRyYXdJbWFnZShpbWcsIDMzMywgMzIsIDUwLCA1MCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGljb25Db29sZG93bkxhc3RGcmFtZTogbnVtYmVyW10gPSBbLTEsIC0xLCAtMSwgLTFdO1xyXG4gICAgcHJvdGVjdGVkIGdsb2JhbENvb2xkb3duTGFzdEZyYW1lOiBudW1iZXIgPSAtMTtcclxuICAgIHByb3RlY3RlZCByZW5kZXJBYmlsaXRpZXMoKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaTogbnVtYmVyID0gMDsgaSA8IHRoaXMucmVuZGVyQWJpbGl0eUljb25GdW5jdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZ2xvYmFsQ29vbGRvd25MYXN0RnJhbWUgIT09IHRoaXMuY29udHJvbGxlci5nbG9iYWxDb29sZG93biB8fCB0aGlzLmljb25Db29sZG93bkxhc3RGcmFtZVtpXSAhPT0gdGhpcy5wbGF5ZXJBYmlsaXR5U3RhdHVzW2ldLmNvb2xkb3duKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFiaWxpdHlDYW52YXMuZmlsbFN0eWxlID0gXCJyZ2IoMjU1LCAyNTUsIDI1NSlcIjtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyQWJpbGl0eUljb25GdW5jdGlvbnNbaV0oKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYWJpbGl0eUNoYW5nZWRbaV0gPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuaWNvbkNvb2xkb3duTGFzdEZyYW1lW2ldID0gdGhpcy5wbGF5ZXJBYmlsaXR5U3RhdHVzW2ldLmNvb2xkb3duICsgMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmdsb2JhbENvb2xkb3duTGFzdEZyYW1lID0gdGhpcy5jb250cm9sbGVyLmdsb2JhbENvb2xkb3duO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIHJlbmRlckFiaWxpdHlJY29uRnVuY3Rpb25zOiAoKCkgPT4gdm9pZClbXSA9IFtcclxuICAgICAgICAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMucmVuZGVyQWJpbGl0eUljb24oeyB4OiA1LCB5OiAzMCB9LCA3MCwgMCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMucmVuZGVyQWJpbGl0eUljb24oeyB4OiA5MCwgeTogMzAgfSwgNzAsIDEpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnJlbmRlckFiaWxpdHlJY29uKHsgeDogMTgwLCB5OiAzMCB9LCA2MCwgMik7XHJcbiAgICAgICAgfSxcclxuICAgICAgICAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMucmVuZGVyQWJpbGl0eUljb24oeyB4OiAyNTUsIHk6IDMwIH0sIDYwLCAzKTtcclxuICAgICAgICB9LFxyXG4gICAgXTtcclxuXHJcbiAgICBwcm90ZWN0ZWQgcmVuZGVyQWJpbGl0eUljb24ocG9zOiBWZWN0b3IsIHNpZGVMZW5ndGg6IG51bWJlciwgYWJpbGl0eUluZGV4OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLmFiaWxpdHlDYW52YXMuY2xlYXJSZWN0KHBvcy54IC0gMiwgcG9zLnkgLSAyLCBzaWRlTGVuZ3RoICsgNCwgc2lkZUxlbmd0aCArIDQpO1xyXG5cclxuICAgICAgICBsZXQgcGVyY2VudENvb2xkb3duOiBudW1iZXIgPSB0aGlzLnBsYXllckFiaWxpdHlTdGF0dXNbYWJpbGl0eUluZGV4XS5nZXRJY29uQ29vbGRvd25QZXJjZW50KCk7XHJcbiAgICAgICAgaWYgKHBlcmNlbnRDb29sZG93biA9PT0gMCkge1xyXG4gICAgICAgICAgICByb3VuZFJlY3QodGhpcy5hYmlsaXR5Q2FudmFzLCBwb3MueCwgcG9zLnksIHNpZGVMZW5ndGgsIHNpZGVMZW5ndGgsIDUsIHRydWUsIGZhbHNlKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAocGVyY2VudENvb2xkb3duICE9PSAxKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFiaWxpdHlDYW52YXMuZmlsbFN0eWxlID0gXCJyZ2JhKDIwMCwgMjAwLCAyMDAsIDAuNClcIjtcclxuICAgICAgICAgICAgICAgIHJvdW5kUmVjdCh0aGlzLmFiaWxpdHlDYW52YXMsIHBvcy54LCBwb3MueSwgc2lkZUxlbmd0aCwgc2lkZUxlbmd0aCwgNSwgdHJ1ZSwgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hYmlsaXR5Q2FudmFzLmNsZWFyUmVjdChwb3MueCAtIDIsIHBvcy55LCBzaWRlTGVuZ3RoICsgNCwgc2lkZUxlbmd0aCAqIHBlcmNlbnRDb29sZG93biArIDIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuYWJpbGl0eUNhbnZhcy5maWxsU3R5bGUgPSBcInJnYmEoMjAwLCAyMDAsIDIwMCwgMC4yKVwiO1xyXG4gICAgICAgICAgICByb3VuZFJlY3QodGhpcy5hYmlsaXR5Q2FudmFzLCBwb3MueCwgcG9zLnksIHNpZGVMZW5ndGgsIHNpZGVMZW5ndGgsIDUsIHRydWUsIGZhbHNlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuYWJpbGl0eUNhbnZhcy5nbG9iYWxDb21wb3NpdGVPcGVyYXRpb24gPSBcImRlc3RpbmF0aW9uLW91dFwiO1xyXG4gICAgICAgIHRoaXMuYWJpbGl0eUNhbnZhcy5kcmF3SW1hZ2UodGhpcy5wbGF5ZXJBYmlsaXR5U3RhdHVzW2FiaWxpdHlJbmRleF0uaW1nLCBwb3MueCwgcG9zLnksIHNpZGVMZW5ndGgsIHNpZGVMZW5ndGgpO1xyXG4gICAgICAgIHRoaXMuYWJpbGl0eUNhbnZhcy5nbG9iYWxDb21wb3NpdGVPcGVyYXRpb24gPSBcInNvdXJjZS1vdmVyXCI7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJvdW5kSGV4KGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELCB4OiBudW1iZXIsIHk6IG51bWJlciwgd2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIsIHJhZGl1czogbnVtYmVyLCBzdHJva2VXaWR0aDogbnVtYmVyLCBmbGF0OiBib29sZWFuKSB7XHJcbiAgICBjdHgubGluZVdpZHRoID0gcmFkaXVzICogMjtcclxuICAgIGN0eC5saW5lSm9pbiA9IFwicm91bmRcIjtcclxuXHJcbiAgICBjb25zdCByZW5kZXJGbGF0ID0gKCk6IHZvaWQgPT4ge1xyXG4gICAgICAgIGNvbnN0IHdpZHRoRGlmOiBudW1iZXIgPSAod2lkdGggKyByYWRpdXMpIC8gNDtcclxuICAgICAgICBjb25zdCBoZWlnaHREaWY6IG51bWJlciA9IGhlaWdodCAvIDIgLSAoKGhlaWdodCAtIHJhZGl1cyAqIDIpICogTWF0aC5wb3coMywgMC41KSkgLyA0O1xyXG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICBjdHgubW92ZVRvKHggKyB3aWR0aERpZiwgeSArIGhlaWdodERpZik7XHJcbiAgICAgICAgY3R4LmxpbmVUbyh4ICsgcmFkaXVzLCB5ICsgaGVpZ2h0IC8gMik7XHJcbiAgICAgICAgY3R4LmxpbmVUbyh4ICsgd2lkdGhEaWYsIHkgKyBoZWlnaHQgLSBoZWlnaHREaWYpO1xyXG4gICAgICAgIGN0eC5saW5lVG8oeCArIHdpZHRoIC0gd2lkdGhEaWYsIHkgKyBoZWlnaHQgLSBoZWlnaHREaWYpO1xyXG4gICAgICAgIGN0eC5saW5lVG8oeCArIHdpZHRoIC0gcmFkaXVzLCB5ICsgaGVpZ2h0IC8gMik7XHJcbiAgICAgICAgY3R4LmxpbmVUbyh4ICsgd2lkdGggLSB3aWR0aERpZiwgeSArIGhlaWdodERpZik7XHJcbiAgICAgICAgY3R4LmNsb3NlUGF0aCgpO1xyXG4gICAgfTtcclxuICAgIGNvbnN0IHJlbmRlclRhbGwgPSAoKTogdm9pZCA9PiB7XHJcbiAgICAgICAgY29uc3QgaGVpZ2h0RGlmOiBudW1iZXIgPSAoaGVpZ2h0ICsgcmFkaXVzKSAvIDQ7XHJcbiAgICAgICAgY29uc3Qgd2lkdGhEaWY6IG51bWJlciA9IHdpZHRoIC8gMiAtICgod2lkdGggLSByYWRpdXMgKiAyKSAqIE1hdGgucG93KDMsIDAuNSkpIC8gNDtcclxuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgY3R4Lm1vdmVUbyh4ICsgd2lkdGhEaWYsIHkgKyBoZWlnaHREaWYpO1xyXG4gICAgICAgIGN0eC5saW5lVG8oeCArIHdpZHRoIC8gMiwgeSArIHJhZGl1cyk7XHJcbiAgICAgICAgY3R4LmxpbmVUbyh4ICsgd2lkdGggLSB3aWR0aERpZiwgeSArIGhlaWdodERpZik7XHJcbiAgICAgICAgY3R4LmxpbmVUbyh4ICsgd2lkdGggLSB3aWR0aERpZiwgeSArIGhlaWdodCAtIGhlaWdodERpZik7XHJcbiAgICAgICAgY3R4LmxpbmVUbyh4ICsgd2lkdGggLyAyLCB5ICsgaGVpZ2h0IC0gcmFkaXVzKTtcclxuICAgICAgICBjdHgubGluZVRvKHggKyB3aWR0aERpZiwgeSArIGhlaWdodCAtIGhlaWdodERpZik7XHJcbiAgICAgICAgY3R4LmNsb3NlUGF0aCgpO1xyXG4gICAgfTtcclxuXHJcbiAgICBpZiAoZmxhdCkgcmVuZGVyRmxhdCgpO1xyXG4gICAgZWxzZSByZW5kZXJUYWxsKCk7XHJcbiAgICBjdHguc3Ryb2tlKCk7XHJcbiAgICB4ICs9IHN0cm9rZVdpZHRoO1xyXG4gICAgeSArPSBzdHJva2VXaWR0aDtcclxuICAgIHdpZHRoIC09IHN0cm9rZVdpZHRoICogMjtcclxuICAgIGhlaWdodCAtPSBzdHJva2VXaWR0aCAqIDI7XHJcbiAgICByYWRpdXMgLT0gc3Ryb2tlV2lkdGggLyAzO1xyXG4gICAgY3R4Lmdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbiA9IFwiZGVzdGluYXRpb24tb3V0XCI7XHJcbiAgICBpZiAoZmxhdCkgcmVuZGVyRmxhdCgpO1xyXG4gICAgZWxzZSByZW5kZXJUYWxsKCk7XHJcbiAgICBjdHguc3Ryb2tlKCk7XHJcbiAgICBjdHguZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uID0gXCJzb3VyY2Utb3ZlclwiO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRBYmlsaXR5SW1hZ2VzKGNsYXNzVHlwZTogQ2xhc3NUeXBlLCBsZXZlbDogbnVtYmVyLCBzcGVjOiBudW1iZXIpOiBIVE1MSW1hZ2VFbGVtZW50W10ge1xyXG4gICAgbGV0IGFiaWxpdHlJbWFnZXM6IEhUTUxJbWFnZUVsZW1lbnRbXSA9IFtcclxuICAgICAgICBhc3NldE1hbmFnZXIuaW1hZ2VzW1wiZW1wdHlJY29uXCJdLFxyXG4gICAgICAgIGFzc2V0TWFuYWdlci5pbWFnZXNbXCJlbXB0eUljb25cIl0sXHJcbiAgICAgICAgYXNzZXRNYW5hZ2VyLmltYWdlc1tcImx2bDZcIl0sXHJcbiAgICAgICAgYXNzZXRNYW5hZ2VyLmltYWdlc1tcImx2bDEwXCJdLFxyXG4gICAgICAgIGFzc2V0TWFuYWdlci5pbWFnZXNbXCJsdmw2XCJdLFxyXG4gICAgXTtcclxuXHJcbiAgICBzd2l0Y2ggKGNsYXNzVHlwZSkge1xyXG4gICAgICAgIGNhc2UgXCJkYWdnZXJzXCI6XHJcbiAgICAgICAgICAgIGlmIChzcGVjID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBhYmlsaXR5SW1hZ2VzWzBdID0gYXNzZXRNYW5hZ2VyLmltYWdlc1tcInN0YWJJY29uXCJdO1xyXG4gICAgICAgICAgICAgICAgYWJpbGl0eUltYWdlc1sxXSA9IGFzc2V0TWFuYWdlci5pbWFnZXNbXCJsdW5nZUljb25cIl07XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc3BlYyA9PT0gMSkge1xyXG4gICAgICAgICAgICAgICAgLy8gTW9ua1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHNwZWMgPT09IDIpIHtcclxuICAgICAgICAgICAgICAgIC8vIEFzc2Fzc2luXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBcInN3b3JkXCI6XHJcbiAgICAgICAgICAgIGlmIChzcGVjID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBhYmlsaXR5SW1hZ2VzWzBdID0gYXNzZXRNYW5hZ2VyLmltYWdlc1tcInNsYXNoSWNvblwiXTtcclxuICAgICAgICAgICAgICAgIGFiaWxpdHlJbWFnZXNbMV0gPSBhc3NldE1hbmFnZXIuaW1hZ2VzW1wid2hpcmx3aW5kSWNvblwiXTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChzcGVjID09PSAxKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBCZXJzZXJrZXJcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChzcGVjID09PSAyKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBCbGFkZW1hc3RlclxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgXCJoYW1tZXJcIjpcclxuICAgICAgICAgICAgaWYgKHNwZWMgPT09IDApIHtcclxuICAgICAgICAgICAgICAgIGFiaWxpdHlJbWFnZXNbMF0gPSBhc3NldE1hbmFnZXIuaW1hZ2VzW1wic3dpbmdJY29uXCJdO1xyXG4gICAgICAgICAgICAgICAgYWJpbGl0eUltYWdlc1sxXSA9IGFzc2V0TWFuYWdlci5pbWFnZXNbXCJwb3VuZEljb25cIl07XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc3BlYyA9PT0gMSkge1xyXG4gICAgICAgICAgICAgICAgLy8gUGFsYWRpblxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHNwZWMgPT09IDIpIHtcclxuICAgICAgICAgICAgICAgIC8vIFdhcmRlblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlVua25vd24gY2xhc3MgdHlwZSBpbiBVc2VySW50ZXJmYWNlJ3MgZ2V0QWJpbGl0eUltYWdlc1wiKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gYWJpbGl0eUltYWdlcztcclxufVxyXG5cclxuZXhwb3J0IHR5cGUgU3dvcmRDbGFzcyA9IHtcclxuICAgIHR5cGU6IFwic3dvcmRcIjtcclxuICAgIHNwZWM6IFN3b3JkQ2xhc3M7XHJcbn07XHJcbmV4cG9ydCB0eXBlIFN3b3JkU3BlYyA9IFwiYmVyc2Vya2VyXCIgfCBcImJsYWRlc21hblwiO1xyXG5cclxuZXhwb3J0IHR5cGUgRGFnZ2Vyc0NsYXNzID0ge1xyXG4gICAgdHlwZTogXCJkYWdnZXJzXCI7XHJcbiAgICBzcGVjOiBEYWdnZXJzU3BlYztcclxufTtcclxuZXhwb3J0IHR5cGUgRGFnZ2Vyc1NwZWMgPSBcIm1vbmtcIiB8IFwiYXNzYXNzaW5cIjtcclxuXHJcbmV4cG9ydCB0eXBlIEhhbW1lckNsYXNzID0ge1xyXG4gICAgdHlwZTogXCJoYW1tZXJcIjtcclxuICAgIHNwZWM6IEhhbW1lclNwZWM7XHJcbn07XHJcbmV4cG9ydCB0eXBlIEhhbW1lclNwZWMgPSBcInBhbGFkaW5cIiB8IFwid2FyZGVuXCI7XHJcblxyXG52YXIgcGxheWVySW5mbzogSGFtbWVyQ2xhc3MgfCBEYWdnZXJzQ2xhc3MgfCBTd29yZENsYXNzO1xyXG4iLCJpbXBvcnQgeyBWZWN0b3IgfSBmcm9tIFwiLi4vLi4vdmVjdG9yXCI7XHJcbmltcG9ydCB7IEZsb29yIH0gZnJvbSBcIi4uL3RlcnJhaW4vZmxvb3IvZmxvb3JcIjtcclxuaW1wb3J0IHsgQWN0b3JPYmplY3QgfSBmcm9tIFwiLi9hY3Rvck9iamVjdHMvYWN0b3JPYmplY3RcIjtcclxuaW1wb3J0IHsgVHJhbnNsYXRpb25OYW1lIH0gZnJvbSBcIi4vYWN0b3JPYmplY3RzL3RyYW5zbGF0aW9uc1wiO1xyXG5pbXBvcnQgeyBTZXJ2ZXJBY3RvciB9IGZyb20gXCIuL3NlcnZlckFjdG9ycy9zZXJ2ZXJBY3RvclwiO1xyXG5cclxuZXhwb3J0IHR5cGUgQWN0b3JUeXBlID0gXCJ0ZXN0TW9iXCIgfCBcImRhZ2dlcnNQbGF5ZXJcIiB8IFwic3dvcmRQbGF5ZXJcIiB8IFwiaGFtbWVyUGxheWVyXCI7XHJcbmV4cG9ydCB0eXBlIFN3b3JkU3BlYyA9IFwiaGVhdnlcIiB8IFwibGlnaHRcIjtcclxuZXhwb3J0IHR5cGUgRGFnZ2Vyc1NwZWMgPSBcIm91dGxhd1wiIHwgXCJhc3Nhc3NpbmF0aW9uXCI7XHJcbmV4cG9ydCB0eXBlIEhhbW1lclNwZWMgPSBcIndhcmRlblwiIHwgXCJwYWxhZGluXCI7XHJcblxyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgQWN0b3Ige1xyXG4gICAgcHJvdGVjdGVkIGFic3RyYWN0IGFjdG9yT2JqZWN0OiBBY3Rvck9iamVjdDtcclxuICAgIHByb3RlY3RlZCBhYnN0cmFjdCBsYXN0SGl0QnlBY3RvcjogQWN0b3I7XHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgcHJvdGVjdGVkIGFjdG9yVHlwZTogQWN0b3JUeXBlLFxyXG4gICAgICAgIHByb3RlY3RlZCBpZDogbnVtYmVyLFxyXG4gICAgICAgIHB1YmxpYyByZWFkb25seSBwb3NpdGlvbjogVmVjdG9yLFxyXG4gICAgICAgIHB1YmxpYyByZWFkb25seSBtb21lbnR1bTogVmVjdG9yLFxyXG4gICAgICAgIHByb3RlY3RlZCBoZWFsdGhJbmZvOiB7IGhlYWx0aDogbnVtYmVyOyBtYXhIZWFsdGg6IG51bWJlciB9LFxyXG4gICAgKSB7fVxyXG5cclxuICAgIHB1YmxpYyBnZXRDb2xsaXNpb25SYW5nZSgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmFjdG9yT2JqZWN0LmdldENvbGxpc2lvblJhbmdlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldEFjdG9yVHlwZSgpOiBBY3RvclR5cGUge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmFjdG9yVHlwZTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXRBY3RvcklkKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaWQ7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0TWF4SGVhbHRoKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaGVhbHRoSW5mby5tYXhIZWFsdGg7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0SGVhbHRoKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaGVhbHRoSW5mby5oZWFsdGg7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0SGVhbHRoSW5mbygpOiB7IGhlYWx0aDogbnVtYmVyOyBtYXhIZWFsdGg6IG51bWJlciB9IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5oZWFsdGhJbmZvO1xyXG4gICAgfVxyXG4gICAgcHVibGljIHN0YXJ0VHJhbnNsYXRpb24oYW5nbGU6IG51bWJlciwgdHJhbnNsYXRpb25OYW1lOiBUcmFuc2xhdGlvbk5hbWUpIHtcclxuICAgICAgICB0aGlzLmFjdG9yT2JqZWN0LnN0YXJ0VHJhbnNsYXRpb24oYW5nbGUsIHRyYW5zbGF0aW9uTmFtZSk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgdXBkYXRlUG9zaXRpb25BbmRNb21lbnR1bShtb21lbnR1bTogVmVjdG9yLCBwb3NpdGlvbjogVmVjdG9yKSB7XHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbi54ID0gcG9zaXRpb24ueCArIDA7XHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbi55ID0gcG9zaXRpb24ueSArIDA7XHJcbiAgICAgICAgdGhpcy5tb21lbnR1bS54ID0gbW9tZW50dW0ueCArIDA7XHJcbiAgICAgICAgdGhpcy5tb21lbnR1bS55ID0gbW9tZW50dW0ueSArIDA7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFic3RyYWN0IHVwZGF0ZShlbGFwc2VkVGltZTogbnVtYmVyKTogdm9pZDtcclxuXHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgcmVnaXN0ZXJEYW1hZ2UoXHJcbiAgICAgICAgb3JpZ2luQWN0b3I6IEFjdG9yLFxyXG4gICAgICAgIHF1YW50aXR5OiBudW1iZXIsXHJcbiAgICAgICAga25vY2tiYWNrOiBWZWN0b3IgfCB1bmRlZmluZWQsXHJcbiAgICAgICAgdHJhbnNsYXRpb25EYXRhOiB7IG5hbWU6IFRyYW5zbGF0aW9uTmFtZTsgYW5nbGU6IG51bWJlciB9IHwgdW5kZWZpbmVkLFxyXG4gICAgKTogeyBpZktpbGxlZDogYm9vbGVhbjsgZGFtYWdlRGVhbHQ6IG51bWJlciB9O1xyXG5cclxuICAgIHB1YmxpYyBhYnN0cmFjdCByZWdpc3RlckhlYWwocXVhbnRpdHk6IG51bWJlcik6IHZvaWQ7XHJcblxyXG4gICAgLy9wcm90ZWN0ZWQgYWJzdHJhY3QgcmVnaXN0ZXJEZWF0aCgpOiB2b2lkO1xyXG5cclxuICAgIHB1YmxpYyByZWdpc3RlckRhbWFnZURvbmUocXVhbnRpdHk6IG51bWJlcik6IHZvaWQge31cclxuICAgIHB1YmxpYyByZWdpc3RlcktpbGxEb25lKCk6IHZvaWQge31cclxuXHJcbiAgICBwdWJsaWMgcmVnaXN0ZXJLbm9ja2JhY2soZm9yY2U6IFZlY3Rvcikge1xyXG4gICAgICAgIHRoaXMuYWN0b3JPYmplY3QucmVnaXN0ZXJLbm9ja2JhY2soZm9yY2UpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIHAxIHN0YXJ0IHBvaW50IG9mIHRoZSBsaW5lLlxyXG4gICAgICogQHBhcmFtIHAyIGVuZCBwb2ludCBvZiB0aGUgbGluZS5cclxuICAgICAqIEByZXR1cm5zIHJldHVybnMgdHJ1ZSBpZiB0aGUgbGluZSBpbnRlcnNlY3RzIHdpdGggdGhlIHNoYXBlLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgY2hlY2tJZkNvbGxpZGVzV2l0aExpbmUocDE6IFZlY3RvciwgcDI6IFZlY3Rvcik6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmFjdG9yT2JqZWN0LmNoZWNrSWZDb2xsaWRlc1dpdGhMaW5lKHAxLCBwMik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0gbGFyZ2VTaGFwZSBTaGFwZSBvZiB0aGUgb2JqZWN0IGluIHF1ZXN0aW9uLlxyXG4gICAgICogQHJldHVybnMgdHJ1ZSBpZiBhbnkgcG9pbnQgb2YgdGhpcyBhY3Rvck9iamVjdCBmYWxscyBpbnNpZGUgdGhlIG9iamVjdCBpbiBxdWVzdGlvbi5cclxuICAgICAqL1xyXG4gICAgcHVibGljIGlmSW5zaWRlTGFyZ2VyU2hhcGUobGFyZ2VTaGFwZTogVmVjdG9yW10pOiBib29sZWFuIHtcclxuICAgICAgICBpZiAodGhpcy5hY3Rvck9iamVjdC5pZkluc2lkZUxhcmdlclNoYXBlKGxhcmdlU2hhcGUpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSBzbWFsbFNoYXBlIFNoYXBlIG9mIHRoZSBvYmplY3QgaW4gcXVlc3Rpb24uXHJcbiAgICAgKiBAcmV0dXJucyB0cnVlIGlmIGFueSBwb2ludCBvZiB0aGUgb2JqZWN0IGluIHF1ZXN0aW9uIGZhbGxzIGluc2lkZSB0aGlzIGFjdG9yT2JqZWN0LlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgaWZJbnNpZGVTbWFsbGVyU2hhcGUoc21hbGxTaGFwZTogVmVjdG9yW10pOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5hY3Rvck9iamVjdC5pZkluc2lkZVNtYWxsZXJTaGFwZShzbWFsbFNoYXBlKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBTaXplIH0gZnJvbSBcIi4uLy4uL3NpemVcIjtcclxuaW1wb3J0IHsgVmVjdG9yIH0gZnJvbSBcIi4uLy4uL3ZlY3RvclwiO1xyXG5pbXBvcnQgeyBQbGF5ZXJNb2RlbENvbmZpZywgcGxheWVyTW9kZWxDb25maWcgfSBmcm9tIFwiLi9jbGllbnRBY3RvcnMvbW9kZWwvcGxheWVyTW9kZWxzL3BsYXllck1vZGVsXCI7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEFjdG9yQ29uZmlnIHtcclxuICAgIGdhbWVTcGVlZDogbnVtYmVyO1xyXG4gICAgZGlydENvbG9yTmlnaHQ6IHN0cmluZztcclxuICAgIGRpcnRDb2xvckRheTogc3RyaW5nO1xyXG4gICAgcGxheWVyU3RhcnQ6IFZlY3RvcjtcclxuICAgIHBsYXllclNpemU6IFNpemU7XHJcbiAgICBwbGF5ZXJDcm91Y2hTaXplOiBTaXplO1xyXG4gICAgcGxheWVyTWFzczogbnVtYmVyO1xyXG4gICAgcGxheWVyTWF4SGVhbHRoOiBudW1iZXI7XHJcbiAgICBwbGF5ZXJKdW1wSGVpZ2h0OiBudW1iZXI7XHJcbiAgICBtYXhTaWRld2F5c01vbWVudHVtOiBudW1iZXI7XHJcbiAgICBzdGFuZGluZ1NpZGV3YXlzQWNjZWxlcmF0aW9uOiBudW1iZXI7XHJcbiAgICBub25TdGFuZGluZ1NpZGV3YXlzQWNjZWxlcmF0aW9uOiBudW1iZXI7XHJcbiAgICBmYWxsaW5nQWNjZWxlcmF0aW9uOiBudW1iZXI7XHJcbiAgICBYUFBlckxldmVsOiBudW1iZXI7XHJcbiAgICBMZXZlbFhQTXVsdGlwbGllcjogbnVtYmVyO1xyXG4gICAgZ2xvYmFsQ29vbGRvd246IG51bWJlcjtcclxuICAgIHBsYXllck1vZGVsQ29uZmlnOiBQbGF5ZXJNb2RlbENvbmZpZztcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGRlZmF1bHRBY3RvckNvbmZpZzogQWN0b3JDb25maWcgPSB7XHJcbiAgICBnYW1lU3BlZWQ6IDEsXHJcbiAgICBkaXJ0Q29sb3JOaWdodDogXCIjMWMyNjJjXCIsXHJcbiAgICBkaXJ0Q29sb3JEYXk6IFwiIzQwMmYxN1wiLFxyXG4gICAgcGxheWVyU3RhcnQ6IHtcclxuICAgICAgICB4OiAzMDAsXHJcbiAgICAgICAgeTogNjUwLFxyXG4gICAgfSxcclxuICAgIHBsYXllclNpemU6IHtcclxuICAgICAgICB3aWR0aDogNTMsXHJcbiAgICAgICAgaGVpZ2h0OiA1NSxcclxuICAgIH0sXHJcbiAgICBwbGF5ZXJDcm91Y2hTaXplOiB7XHJcbiAgICAgICAgd2lkdGg6IDU3LFxyXG4gICAgICAgIGhlaWdodDogMzYsXHJcbiAgICB9LFxyXG4gICAgcGxheWVyTWFzczogMTAsXHJcbiAgICBwbGF5ZXJNYXhIZWFsdGg6IDEwMCxcclxuICAgIHBsYXllckp1bXBIZWlnaHQ6IDEwMDAsXHJcbiAgICBtYXhTaWRld2F5c01vbWVudHVtOiA1MDAsIC8vNDAwXHJcbiAgICBzdGFuZGluZ1NpZGV3YXlzQWNjZWxlcmF0aW9uOiA2MDAwLCAvLzgwMDBcclxuICAgIG5vblN0YW5kaW5nU2lkZXdheXNBY2NlbGVyYXRpb246IDE1MDAsIC8vMTUwMFxyXG4gICAgZmFsbGluZ0FjY2VsZXJhdGlvbjogMzAwLFxyXG4gICAgWFBQZXJMZXZlbDogMjAsXHJcbiAgICBMZXZlbFhQTXVsdGlwbGllcjogMS4xLFxyXG4gICAgZ2xvYmFsQ29vbGRvd246IDAuMixcclxuICAgIHBsYXllck1vZGVsQ29uZmlnLFxyXG59O1xyXG4iLCJpbXBvcnQgeyBHbG9iYWxPYmplY3RzIH0gZnJvbSBcIi4uLy4uLy4uL2NsaWVudC9nYW1lXCI7XHJcbmltcG9ydCB7IGRlZmF1bHRDb25maWcgfSBmcm9tIFwiLi4vLi4vLi4vY29uZmlnXCI7XHJcbmltcG9ydCB7IGlmSW5zaWRlIH0gZnJvbSBcIi4uLy4uLy4uL2lmSW5zaWRlXCI7XHJcbmltcG9ydCB7IGlmSW50ZXJzZWN0IH0gZnJvbSBcIi4uLy4uLy4uL2lmSW50ZXJzZWN0XCI7XHJcbmltcG9ydCB7IFNpemUgfSBmcm9tIFwiLi4vLi4vLi4vc2l6ZVwiO1xyXG5pbXBvcnQgeyByb3RhdGVWZWN0b3IsIFNoYXBlLCBWZWN0b3IgfSBmcm9tIFwiLi4vLi4vLi4vdmVjdG9yXCI7XHJcbmltcG9ydCB7IERvb2RhZCB9IGZyb20gXCIuLi8uLi90ZXJyYWluL2Rvb2RhZHMvZG9vZGFkXCI7XHJcbmltcG9ydCB7IEZsb29yIH0gZnJvbSBcIi4uLy4uL3RlcnJhaW4vZmxvb3IvZmxvb3JcIjtcclxuaW1wb3J0IHsgQWN0b3IgfSBmcm9tIFwiLi4vYWN0b3JcIjtcclxuaW1wb3J0IHsgZGVmYXVsdEFjdG9yQ29uZmlnIH0gZnJvbSBcIi4uL2FjdG9yQ29uZmlnXCI7XHJcbmltcG9ydCB7IFRyYW5zbGF0aW9uRGF0YSwgVHJhbnNsYXRpb25OYW1lLCBUcmFuc2xhdGlvbiwgdHJhbnNsYXRpb25zLCByb3RhdGVLZXkgfSBmcm9tIFwiLi90cmFuc2xhdGlvbnNcIjtcclxuXHJcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBBY3Rvck9iamVjdCB7XHJcbiAgICBwcm90ZWN0ZWQgeFNpemU6IG51bWJlciA9IGRlZmF1bHRDb25maWcueFNpemU7XHJcbiAgICBwcm90ZWN0ZWQgeVNpemU6IG51bWJlciA9IGRlZmF1bHRDb25maWcueVNpemU7XHJcblxyXG4gICAgLy9yZWN0YW5nbGUgdmVjdG9yXHJcbiAgICAvL3BsYXRmb3JtIHZlY3RvclxyXG4gICAgLy9mbG9vciBwb2ludGVyXHJcblxyXG4gICAgcHJpdmF0ZSB0cmFuc2xhdGlvbkRhdGE6IFRyYW5zbGF0aW9uRGF0YSA9IHtcclxuICAgICAgICB0cmFuc2xhdGVJbmZvOiB1bmRlZmluZWQsXHJcbiAgICAgICAga2V5SW5kZXg6IDAsXHJcbiAgICAgICAgb3JpZ2luYWxQb3NpdGlvbjogeyB4OiAwLCB5OiAwIH0sXHJcbiAgICAgICAgY291bnRlcjogMCxcclxuICAgICAgICBrZXlUaW1lTGVuZ3RoOiAwLFxyXG4gICAgICAgIGFuZ2xlOiAwLFxyXG4gICAgfTtcclxuXHJcbiAgICAvL3Bvc2l0aW9uIHNvbHZlclxyXG4gICAgcHJvdGVjdGVkIHJlYWRvbmx5IHByZXZpb3VzTW9tZW50dW06IFZlY3RvciA9IHsgeDogMCwgeTogMCB9O1xyXG4gICAgcHJvdGVjdGVkIHJlYWRvbmx5IHByZXZpb3VzUG9zaXRpb246IFZlY3RvciA9IHsgeDogMCwgeTogMCB9O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHByb3RlY3RlZCBnbG9iYWxPYmplY3RzOiBHbG9iYWxPYmplY3RzLFxyXG4gICAgICAgIHByb3RlY3RlZCByZWFkb25seSBiYXNlQWN0b3I6IEFjdG9yLFxyXG4gICAgICAgIHByb3RlY3RlZCByZWFkb25seSBwb3NpdGlvbjogVmVjdG9yLFxyXG4gICAgICAgIHByb3RlY3RlZCByZWFkb25seSBtb21lbnR1bTogVmVjdG9yLFxyXG4gICAgICAgIHByb3RlY3RlZCBzaXplOiBTaXplLFxyXG4gICAgICAgIHByb3RlY3RlZCBtYXNzOiBudW1iZXIsXHJcbiAgICApIHtcclxuICAgICAgICB0aGlzLnByZXZpb3VzTW9tZW50dW0ueCA9IHRoaXMubW9tZW50dW0ueDtcclxuICAgICAgICB0aGlzLnByZXZpb3VzTW9tZW50dW0ueSA9IHRoaXMubW9tZW50dW0ueTtcclxuICAgICAgICB0aGlzLnByZXZpb3VzUG9zaXRpb24ueCA9IHRoaXMucG9zaXRpb24ueDtcclxuICAgICAgICB0aGlzLnByZXZpb3VzUG9zaXRpb24ueSA9IHRoaXMucG9zaXRpb24ueTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgZ2V0R2xvYmFsU2hhcGUoKTogU2hhcGU7XHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgZ2V0Q29sbGlzaW9uUmFuZ2UoKTogbnVtYmVyO1xyXG4gICAgcHVibGljIGFic3RyYWN0IHJlZ2lzdGVyR3JvdW5kQW5nbGUoYW5nbGU6IG51bWJlciwgc3RhbmRpbmc6IGJvb2xlYW4pOiB2b2lkO1xyXG5cclxuICAgIHB1YmxpYyBjaGVja0lmQ29sbGlkZXNXaXRoTGluZShwMTogVmVjdG9yLCBwMjogVmVjdG9yKTogYm9vbGVhbiB7XHJcbiAgICAgICAgbGV0IHBlcnNvbmFsU2hhcGU6IFNoYXBlID0gdGhpcy5nZXRHbG9iYWxTaGFwZSgpO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpOiBudW1iZXIgPSAwOyBpIDwgcGVyc29uYWxTaGFwZS5lZGdlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoaWZJbnRlcnNlY3QocGVyc29uYWxTaGFwZS5lZGdlc1tpXS5wMSwgcGVyc29uYWxTaGFwZS5lZGdlc1tpXS5wMiwgcDEsIHAyKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy9sYXN0IGNoZWNrIGluIGNhc2UgdGhlIGxpbmUgaXMgaW5zaWRlIG9iamVjdFxyXG4gICAgICAgIGlmIChpZkluc2lkZShwMSwgcGVyc29uYWxTaGFwZS5wb2ludHMpKSByZXR1cm4gdHJ1ZTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgaWZJbnNpZGVMYXJnZXJTaGFwZShsYXJnZVNoYXBlOiBWZWN0b3JbXSk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGxldCBwZXJzb25hbFNoYXBlOiBTaGFwZSA9IHRoaXMuZ2V0R2xvYmFsU2hhcGUoKTtcclxuICAgICAgICBmb3IgKGxldCBpOiBudW1iZXIgPSAwOyBpIDwgcGVyc29uYWxTaGFwZS5wb2ludHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKGlmSW5zaWRlKHBlcnNvbmFsU2hhcGUucG9pbnRzW2ldLCBsYXJnZVNoYXBlKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGlmSW5zaWRlU21hbGxlclNoYXBlKHNtYWxsU2hhcGU6IFZlY3RvcltdKTogYm9vbGVhbiB7XHJcbiAgICAgICAgbGV0IHBlcnNvbmFsU2hhcGU6IFNoYXBlID0gdGhpcy5nZXRHbG9iYWxTaGFwZSgpO1xyXG4gICAgICAgIGZvciAobGV0IGk6IG51bWJlciA9IDA7IGkgPCBzbWFsbFNoYXBlLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChpZkluc2lkZShzbWFsbFNoYXBlW2ldLCBwZXJzb25hbFNoYXBlLnBvaW50cykpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgcmVnaXN0ZXJHcmF2aXR5KGVsYXBzZWRUaW1lOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLm1vbWVudHVtLnkgKz0gZGVmYXVsdEFjdG9yQ29uZmlnLmZhbGxpbmdBY2NlbGVyYXRpb24gKiBlbGFwc2VkVGltZSAqIHRoaXMubWFzcztcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgcmVnaXN0ZXJHcm91bmRGcmljdGlvbihlbGFwc2VkVGltZTogbnVtYmVyKSB7XHJcbiAgICAgICAgLy9pZiAoTWF0aC5hYnModGhpcy5tb21lbnR1bS54KSA8PSAxMCkgdGhpcy5tb21lbnR1bS54ID0gMDtcclxuICAgICAgICAvL2Vsc2UgdGhpcy5tb21lbnR1bS54IC09IGVsYXBzZWRUaW1lICogdGhpcy5tYXNzICogKHRoaXMubW9tZW50dW0ueCA8PSAwID8gLTEgOiAxKSAqIDYwMDtcclxuICAgICAgICBpZiAodGhpcy5tb21lbnR1bS54ID4gMCkge1xyXG4gICAgICAgICAgICB0aGlzLm1vbWVudHVtLnggLT0gZWxhcHNlZFRpbWUgKiB0aGlzLm1hc3MgKiA2MDA7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm1vbWVudHVtLnggPCAwKSB0aGlzLm1vbWVudHVtLnggPSAwO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5tb21lbnR1bS54IDwgMCkge1xyXG4gICAgICAgICAgICB0aGlzLm1vbWVudHVtLnggKz0gZWxhcHNlZFRpbWUgKiB0aGlzLm1hc3MgKiA2MDA7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm1vbWVudHVtLnggPiAwKSB0aGlzLm1vbWVudHVtLnggPSAwO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgcmVnaXN0ZXJBaXJSZXNpc3RhbmNlKGVsYXBzZWRUaW1lOiBudW1iZXIpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgICAgaWYgKE1hdGguYWJzKHRoaXMubW9tZW50dW0ueCkgPD0gMykgdGhpcy5tb21lbnR1bS54ID0gMDtcclxuICAgICAgICBlbHNlIHRoaXMubW9tZW50dW0ueCAtPSBlbGFwc2VkVGltZSAqIHRoaXMubWFzcyAqICh0aGlzLm1vbWVudHVtLnggPD0gMCA/IC0xIDogMSkgKiAzMDtcclxuXHJcbiAgICAgICAgaWYgKE1hdGguYWJzKHRoaXMubW9tZW50dW0ueSkgPD0gMykgdGhpcy5tb21lbnR1bS55ID0gMDtcclxuICAgICAgICBlbHNlIHRoaXMubW9tZW50dW0ueSAtPSBlbGFwc2VkVGltZSAqIHRoaXMubWFzcyAqICh0aGlzLm1vbWVudHVtLnkgPD0gMCA/IC0xIDogMSkgKiAzMDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVnaXN0ZXJLbm9ja2JhY2soZm9yY2U6IFZlY3Rvcikge1xyXG4gICAgICAgIHRoaXMubW9tZW50dW0ueCA9IChmb3JjZS54ICogMyArIHRoaXMubW9tZW50dW0ueCkgLyA0O1xyXG4gICAgICAgIHRoaXMubW9tZW50dW0ueSA9IChmb3JjZS55ICogMyArIHRoaXMubW9tZW50dW0ueSkgLyA0O1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBjaGVja1hCb3VuZGFyeUNvbGxpc2lvbigpIHtcclxuICAgICAgICBpZiAodGhpcy5wb3NpdGlvbi54IC0gdGhpcy5zaXplLndpZHRoIC8gMiA8IDApIHtcclxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbi54ID0gdGhpcy5zaXplLndpZHRoIC8gMjtcclxuICAgICAgICAgICAgdGhpcy5tb21lbnR1bS54ID0gTWF0aC5tYXgodGhpcy5tb21lbnR1bS54LCAwKTtcclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMucG9zaXRpb24ueCArIHRoaXMuc2l6ZS53aWR0aCAvIDIgPiB0aGlzLnhTaXplKSB7XHJcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb24ueCA9IHRoaXMueFNpemUgLSB0aGlzLnNpemUud2lkdGggLyAyO1xyXG4gICAgICAgICAgICB0aGlzLm1vbWVudHVtLnggPSBNYXRoLm1pbih0aGlzLm1vbWVudHVtLngsIDApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgY2hlY2tZQm91bmRhcnlDb2xsaXNpb24oKTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKHRoaXMucG9zaXRpb24ueSAtIHRoaXMuc2l6ZS5oZWlnaHQgLyAyIDwgMSkge1xyXG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uLnkgPSB0aGlzLnNpemUuaGVpZ2h0IC8gMiArIDE7XHJcbiAgICAgICAgICAgIHRoaXMubW9tZW50dW0ueSA9IE1hdGgubWF4KHRoaXMubW9tZW50dW0ueSwgMCk7XHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLnBvc2l0aW9uLnkgKyB0aGlzLnNpemUuaGVpZ2h0IC8gMiA+IHRoaXMueVNpemUpIHtcclxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbi55ID0gdGhpcy55U2l6ZSAtIHRoaXMuc2l6ZS5oZWlnaHQgLyAyO1xyXG4gICAgICAgICAgICB0aGlzLm1vbWVudHVtLnkgPSBNYXRoLm1pbih0aGlzLm1vbWVudHVtLnksIDApO1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBjaGVja1JlY3RhbmdsZXMoZWxhcHNlZFRpbWU6IG51bWJlcikge1xyXG4gICAgICAgIC8vZm9yIGVhY2ggcmVjdGFuZ2xlLCBjaGVjayByZWN0YW5nbGUgY29sbGlzaW9uIElGIG5vIHRyYW5zbGF0aW9uIG9yIHRyYW5zbGF0aW9uIGFsbG93cyBpdFxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY2hlY2tSZWN0YW5nbGVDb2xsaXNpb24oZWxhcHNlZFRpbWU6IG51bWJlcikge31cclxuXHJcbiAgICBwcm90ZWN0ZWQgY2hlY2tQbGF0Zm9ybXMoZWxhcHNlZFRpbWU6IG51bWJlcikge1xyXG4gICAgICAgIC8vZm9yIGVhY2ggcGxhdGZvcm0sIGNoZWNrIHBsYXRmb3JtIGNvbGxpc2lvbiBJRiBubyB0cmFuc2xhdGlvbiBvciB0cmFuc2xhdGlvbiBhbGxvd3MgaXRcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNoZWNrUGxhdGZvcm1Db2xsaXNpb24oZWxhcHNlZFRpbWU6IG51bWJlcikge31cclxuXHJcbiAgICBwcm90ZWN0ZWQgY2hlY2tHcm91bmRDb2xsaXNpb24oZWxhcHNlZFRpbWU6IG51bWJlcik6IHsgaGl0OiBib29sZWFuOyBhbmdsZTogbnVtYmVyIH0ge1xyXG4gICAgICAgIGxldCBkYXRhOiB7IHlDb29yZDogbnVtYmVyOyBhbmdsZTogbnVtYmVyIH0gPSB0aGlzLmdsb2JhbE9iamVjdHMuZmxvb3IuZ2V0WUNvb3JkQW5kQW5nbGUodGhpcy5wb3NpdGlvbi54KTtcclxuICAgICAgICBsZXQgZmVldFBvczogbnVtYmVyID0gdGhpcy5wb3NpdGlvbi55ICsgdGhpcy5zaXplLmhlaWdodCAvIDI7XHJcbiAgICAgICAgbGV0IGlmSGl0OiBib29sZWFuID0gZmFsc2U7XHJcbiAgICAgICAgaWYgKGRhdGEueUNvb3JkIDwgZmVldFBvcykge1xyXG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uLnkgPSBkYXRhLnlDb29yZCAtIHRoaXMuc2l6ZS5oZWlnaHQgLyAyO1xyXG4gICAgICAgICAgICB0aGlzLm1vbWVudHVtLnkgPSBNYXRoLm1pbih0aGlzLm1vbWVudHVtLnksIDApO1xyXG4gICAgICAgICAgICBpZkhpdCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB7IGhpdDogaWZIaXQsIGFuZ2xlOiBkYXRhLmFuZ2xlIH07XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGNoZWNrRG9vZGFkcygpIHtcclxuICAgICAgICBsZXQgYWN0b3JTaGFwZTogU2hhcGUgPSB0aGlzLmdldEdsb2JhbFNoYXBlKCk7XHJcbiAgICAgICAgdGhpcy5nbG9iYWxPYmplY3RzLmRvb2RhZHMuZm9yRWFjaCgoZG9vZGFkKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuY2hlY2tEb29kYWRDb2xsaXNpb24oYWN0b3JTaGFwZSwgZG9vZGFkKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgY2hlY2tEb29kYWRDb2xsaXNpb24oYWN0b3JTaGFwZTogU2hhcGUsIGRvb2RhZDogRG9vZGFkKSB7XHJcbiAgICAgICAgaWYgKGRvb2RhZC5jaGVja0NvbGxpc2lvblJhbmdlKHRoaXMucG9zaXRpb24sIHRoaXMuZ2V0Q29sbGlzaW9uUmFuZ2UoKSkpIHtcclxuICAgICAgICAgICAgaWYgKGRvb2RhZC5jaGVja09iamVjdEludGVyc2VjdGlvbihhY3RvclNoYXBlKSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHJlc3VsdHM6IHsgcG9zaXRpb25DaGFuZ2U6IFZlY3RvcjsgbW9tZW50dW1DaGFuZ2U6IFZlY3RvciB8IHVuZGVmaW5lZDsgYW5nbGU6IG51bWJlciB8IHVuZGVmaW5lZCB9ID1cclxuICAgICAgICAgICAgICAgICAgICBkb29kYWQucmVnaXN0ZXJDb2xsaXNpb25XaXRoQ2xvc2VzdFNvbHV0aW9uKGFjdG9yU2hhcGUsIHRoaXMubW9tZW50dW0pO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZWdpc3RlckRvb2RhZENvbGxpc2lvbihyZXN1bHRzLnBvc2l0aW9uQ2hhbmdlLCByZXN1bHRzLm1vbWVudHVtQ2hhbmdlLCByZXN1bHRzLmFuZ2xlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHJlZ2lzdGVyRG9vZGFkQ29sbGlzaW9uKHBvc2l0aW9uQ2hhbmdlOiBWZWN0b3IsIG1vbWVudHVtQ2hhbmdlOiBWZWN0b3IgfCB1bmRlZmluZWQsIGFuZ2xlOiBudW1iZXIgfCB1bmRlZmluZWQpIHtcclxuICAgICAgICB0aGlzLnBvc2l0aW9uLnggKz0gcG9zaXRpb25DaGFuZ2UueDtcclxuICAgICAgICB0aGlzLnBvc2l0aW9uLnkgKz0gcG9zaXRpb25DaGFuZ2UueTtcclxuICAgICAgICBpZiAobW9tZW50dW1DaGFuZ2UpIHtcclxuICAgICAgICAgICAgdGhpcy5tb21lbnR1bS54ID0gbW9tZW50dW1DaGFuZ2UueCArIDA7XHJcbiAgICAgICAgICAgIHRoaXMubW9tZW50dW0ueSA9IG1vbWVudHVtQ2hhbmdlLnkgKyAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoYW5nbGUpIHtcclxuICAgICAgICAgICAgdGhpcy5yZWdpc3Rlckdyb3VuZEFuZ2xlKGFuZ2xlLCB0cnVlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXJ0VHJhbnNsYXRpb24oYW5nbGU6IG51bWJlciwgdHJhbnNsYXRpb25OYW1lOiBUcmFuc2xhdGlvbk5hbWUpIHtcclxuICAgICAgICB0aGlzLnRyYW5zbGF0aW9uRGF0YS5vcmlnaW5hbFBvc2l0aW9uLnggPSB0aGlzLnBvc2l0aW9uLnggKyAwO1xyXG4gICAgICAgIHRoaXMudHJhbnNsYXRpb25EYXRhLm9yaWdpbmFsUG9zaXRpb24ueSA9IHRoaXMucG9zaXRpb24ueSArIDA7XHJcblxyXG4gICAgICAgIGxldCBuZXdUcmFuc2xhdGlvbjogVHJhbnNsYXRpb24gPSB0cmFuc2xhdGlvbnNbdHJhbnNsYXRpb25OYW1lXTtcclxuXHJcbiAgICAgICAgdGhpcy50cmFuc2xhdGlvbkRhdGEudHJhbnNsYXRlSW5mbyA9IHtcclxuICAgICAgICAgICAga2V5czogbmV3VHJhbnNsYXRpb24ua2V5cy5tYXAoKHgpID0+IHJvdGF0ZUtleSh4LCBhbmdsZSwgbmV3VHJhbnNsYXRpb24uZmxpcEFjcm9zc1kpKSxcclxuICAgICAgICAgICAgZmxpcEFjcm9zc1k6IG5ld1RyYW5zbGF0aW9uLmZsaXBBY3Jvc3NZLFxyXG4gICAgICAgICAgICBpZ25vcmVDb2xsaXNpb246IG5ld1RyYW5zbGF0aW9uLmlnbm9yZUNvbGxpc2lvbixcclxuICAgICAgICAgICAgaWdub3JlR3Jhdml0eTogbmV3VHJhbnNsYXRpb24uaWdub3JlR3Jhdml0eSxcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLnRyYW5zbGF0aW9uRGF0YS5rZXlJbmRleCA9IDA7XHJcbiAgICAgICAgdGhpcy50cmFuc2xhdGlvbkRhdGEuY291bnRlciA9IDA7XHJcblxyXG4gICAgICAgIHRoaXMudHJhbnNsYXRpb25EYXRhLmtleVRpbWVMZW5ndGggPSAwO1xyXG4gICAgICAgIHRoaXMudHJhbnNsYXRpb25EYXRhLnRyYW5zbGF0ZUluZm8ua2V5cy5mb3JFYWNoKChrZXkpID0+IHtcclxuICAgICAgICAgICAgdGhpcy50cmFuc2xhdGlvbkRhdGEua2V5VGltZUxlbmd0aCArPSBrZXkudGltZTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgdXBkYXRlVHJhbnNsYXRpb24oZWxhcHNlZFRpbWU6IG51bWJlcikge1xyXG4gICAgICAgIGlmICh0aGlzLnRyYW5zbGF0aW9uRGF0YS50cmFuc2xhdGVJbmZvICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhpcy50cmFuc2xhdGlvbkRhdGEuY291bnRlciArPSBlbGFwc2VkVGltZTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLnRyYW5zbGF0aW9uRGF0YS5jb3VudGVyID49IHRoaXMudHJhbnNsYXRpb25EYXRhLnRyYW5zbGF0ZUluZm8ua2V5c1t0aGlzLnRyYW5zbGF0aW9uRGF0YS5rZXlJbmRleF0udGltZSkge1xyXG4gICAgICAgICAgICAgICAgLy90aGlzLnBvc2l0aW9uLnggPSB0aGlzLnRyYW5zbGF0aW9uRGF0YS5vcmlnaW5hbFBvc2l0aW9uLnggKyB0aGlzLnRyYW5zbGF0aW9uRGF0YS50cmFuc2xhdGVJbmZvLmtleXNbdGhpcy50cmFuc2xhdGlvbkRhdGEua2V5SW5kZXhdLnBvcy54O1xyXG4gICAgICAgICAgICAgICAgLy90aGlzLnBvc2l0aW9uLnkgPSB0aGlzLnRyYW5zbGF0aW9uRGF0YS5vcmlnaW5hbFBvc2l0aW9uLnkgKyB0aGlzLnRyYW5zbGF0aW9uRGF0YS50cmFuc2xhdGVJbmZvLmtleXNbdGhpcy50cmFuc2xhdGlvbkRhdGEua2V5SW5kZXhdLnBvcy55O1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMudHJhbnNsYXRpb25EYXRhLmtleUluZGV4Kys7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRyYW5zbGF0aW9uRGF0YS5jb3VudGVyID0gMDtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLnRyYW5zbGF0aW9uRGF0YS5vcmlnaW5hbFBvc2l0aW9uLnggPSB0aGlzLnBvc2l0aW9uLnggKyAwO1xyXG4gICAgICAgICAgICAgICAgdGhpcy50cmFuc2xhdGlvbkRhdGEub3JpZ2luYWxQb3NpdGlvbi55ID0gdGhpcy5wb3NpdGlvbi55ICsgMDtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy50cmFuc2xhdGlvbkRhdGEua2V5SW5kZXggPT09IHRoaXMudHJhbnNsYXRpb25EYXRhLnRyYW5zbGF0ZUluZm8ua2V5cy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmVuZFRyYW5zbGF0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgcnVuUGVyY2VudGFnZTogbnVtYmVyID0gdGhpcy50cmFuc2xhdGlvbkRhdGEuY291bnRlciAvIHRoaXMudHJhbnNsYXRpb25EYXRhLnRyYW5zbGF0ZUluZm8ua2V5c1t0aGlzLnRyYW5zbGF0aW9uRGF0YS5rZXlJbmRleF0udGltZTtcclxuXHJcbiAgICAgICAgICAgIGxldCBuZXdQb3NpdGlvbjogVmVjdG9yID0ge1xyXG4gICAgICAgICAgICAgICAgeDogdGhpcy50cmFuc2xhdGlvbkRhdGEub3JpZ2luYWxQb3NpdGlvbi54ICsgdGhpcy50cmFuc2xhdGlvbkRhdGEudHJhbnNsYXRlSW5mby5rZXlzW3RoaXMudHJhbnNsYXRpb25EYXRhLmtleUluZGV4XS5wb3MueCAqIHJ1blBlcmNlbnRhZ2UsXHJcbiAgICAgICAgICAgICAgICB5OiB0aGlzLnRyYW5zbGF0aW9uRGF0YS5vcmlnaW5hbFBvc2l0aW9uLnkgKyB0aGlzLnRyYW5zbGF0aW9uRGF0YS50cmFuc2xhdGVJbmZvLmtleXNbdGhpcy50cmFuc2xhdGlvbkRhdGEua2V5SW5kZXhdLnBvcy55ICogcnVuUGVyY2VudGFnZSxcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMubW9tZW50dW0ueCA9IChuZXdQb3NpdGlvbi54IC0gdGhpcy5wb3NpdGlvbi54KSAvIGVsYXBzZWRUaW1lO1xyXG4gICAgICAgICAgICBpZiAodGhpcy50cmFuc2xhdGlvbkRhdGEudHJhbnNsYXRlSW5mby5pZ25vcmVHcmF2aXR5KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1vbWVudHVtLnkgPSAobmV3UG9zaXRpb24ueSAtIHRoaXMucG9zaXRpb24ueSkgLyBlbGFwc2VkVGltZTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubW9tZW50dW0ueSA9ICgobmV3UG9zaXRpb24ueSAtIHRoaXMucG9zaXRpb24ueSkgLyBlbGFwc2VkVGltZSArIHRoaXMubW9tZW50dW0ueSkgLyAyO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBlbmRUcmFuc2xhdGlvbigpIHtcclxuICAgICAgICB0aGlzLnRyYW5zbGF0aW9uRGF0YS50cmFuc2xhdGVJbmZvID0gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBwb3NpdGlvblVwZGF0ZShlbGFwc2VkVGltZTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbi54ICs9ICgodGhpcy5tb21lbnR1bS54ICsgdGhpcy5wcmV2aW91c01vbWVudHVtLngpICogZWxhcHNlZFRpbWUpIC8gMjtcclxuICAgICAgICB0aGlzLnBvc2l0aW9uLnkgKz0gKCh0aGlzLm1vbWVudHVtLnkgKyB0aGlzLnByZXZpb3VzTW9tZW50dW0ueSkgKiBlbGFwc2VkVGltZSkgLyAyO1xyXG5cclxuICAgICAgICB0aGlzLnByZXZpb3VzTW9tZW50dW0ueCA9IHRoaXMubW9tZW50dW0ueDtcclxuICAgICAgICB0aGlzLnByZXZpb3VzTW9tZW50dW0ueSA9IHRoaXMubW9tZW50dW0ueTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgcHJldmlvdXNQb3NpdGlvblVwZGF0ZSgpIHtcclxuICAgICAgICB0aGlzLnByZXZpb3VzUG9zaXRpb24ueCA9IHRoaXMucG9zaXRpb24ueDtcclxuICAgICAgICB0aGlzLnByZXZpb3VzUG9zaXRpb24ueSA9IHRoaXMucG9zaXRpb24ueTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgZSA9IHJlcXVpcmUoXCJleHByZXNzXCIpO1xyXG5pbXBvcnQgeyBHbG9iYWxPYmplY3RzIH0gZnJvbSBcIi4uLy4uLy4uL2NsaWVudC9nYW1lXCI7XHJcbmltcG9ydCB7IGRlZmF1bHRDb25maWcgfSBmcm9tIFwiLi4vLi4vLi4vY29uZmlnXCI7XHJcbmltcG9ydCB7IFNpemUgfSBmcm9tIFwiLi4vLi4vLi4vc2l6ZVwiO1xyXG5pbXBvcnQgeyByb3RhdGVWZWN0b3IsIFNoYXBlLCBWZWN0b3IgfSBmcm9tIFwiLi4vLi4vLi4vdmVjdG9yXCI7XHJcbmltcG9ydCB7IERvb2RhZCB9IGZyb20gXCIuLi8uLi90ZXJyYWluL2Rvb2RhZHMvZG9vZGFkXCI7XHJcbmltcG9ydCB7IEZsb29yIH0gZnJvbSBcIi4uLy4uL3RlcnJhaW4vZmxvb3IvZmxvb3JcIjtcclxuaW1wb3J0IHsgQWN0b3IgfSBmcm9tIFwiLi4vYWN0b3JcIjtcclxuaW1wb3J0IHsgZGVmYXVsdEFjdG9yQ29uZmlnIH0gZnJvbSBcIi4uL2FjdG9yQ29uZmlnXCI7XHJcbmltcG9ydCB7IENsaWVudFBsYXllciB9IGZyb20gXCIuLi9jbGllbnRBY3RvcnMvY2xpZW50UGxheWVyL2NsaWVudFBsYXllclwiO1xyXG5pbXBvcnQgeyBTZXJ2ZXJQbGF5ZXIgfSBmcm9tIFwiLi4vc2VydmVyQWN0b3JzL3NlcnZlclBsYXllci9zZXJ2ZXJQbGF5ZXJcIjtcclxuaW1wb3J0IHsgQWN0b3JPYmplY3QgfSBmcm9tIFwiLi9hY3Rvck9iamVjdFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFBsYXllck9iamVjdCBleHRlbmRzIEFjdG9yT2JqZWN0IHtcclxuICAgIHByb3RlY3RlZCBqdW1wSGVpZ2h0OiBudW1iZXIgPSBkZWZhdWx0QWN0b3JDb25maWcucGxheWVySnVtcEhlaWdodCArIDA7XHJcbiAgICBwcm90ZWN0ZWQgbWF4U2lkZXdheXNTcGVlZDogbnVtYmVyID0gZGVmYXVsdEFjdG9yQ29uZmlnLm1heFNpZGV3YXlzTW9tZW50dW0gKyAwO1xyXG4gICAgcHJvdGVjdGVkIHNpZGV3YXlzU3RhbmRpbmdBY2NlbGVyYXRpb246IG51bWJlciA9IGRlZmF1bHRBY3RvckNvbmZpZy5zdGFuZGluZ1NpZGV3YXlzQWNjZWxlcmF0aW9uICsgMDtcclxuICAgIHByb3RlY3RlZCBzaWRld2F5c0ZhbGxpbmdBY2NlbGVyYXRpb246IG51bWJlciA9IGRlZmF1bHRBY3RvckNvbmZpZy5ub25TdGFuZGluZ1NpZGV3YXlzQWNjZWxlcmF0aW9uICsgMDtcclxuXHJcbiAgICBwdWJsaWMgb2JqZWN0QW5nbGU6IG51bWJlciA9IDA7XHJcblxyXG4gICAgcHVibGljIGNyb3VjaGluZzogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHVibGljIHN0YW5kaW5nOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZ2xvYmFsT2JqZWN0czogR2xvYmFsT2JqZWN0cywgYmFzZUFjdG9yOiBDbGllbnRQbGF5ZXIgfCBTZXJ2ZXJQbGF5ZXIsIHBvc2l0aW9uOiBWZWN0b3IsIG1vbWVudHVtOiBWZWN0b3IsIHB1YmxpYyBzaXplOiBTaXplKSB7XHJcbiAgICAgICAgc3VwZXIoZ2xvYmFsT2JqZWN0cywgYmFzZUFjdG9yLCBwb3NpdGlvbiwgbW9tZW50dW0sIHNpemUsIGRlZmF1bHRBY3RvckNvbmZpZy5wbGF5ZXJNYXNzICsgMCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldENvbGxpc2lvblJhbmdlKCk6IG51bWJlciB7XHJcbiAgICAgICAgaWYgKHRoaXMuY3JvdWNoaW5nKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBNYXRoLnNxcnQoKGRlZmF1bHRBY3RvckNvbmZpZy5wbGF5ZXJDcm91Y2hTaXplLndpZHRoIC8gMikgKiogMiArIChkZWZhdWx0QWN0b3JDb25maWcucGxheWVyQ3JvdWNoU2l6ZS5oZWlnaHQgLyAyKSAqKiAyKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KChkZWZhdWx0QWN0b3JDb25maWcucGxheWVyU2l6ZS53aWR0aCAvIDIpICoqIDIgKyAoZGVmYXVsdEFjdG9yQ29uZmlnLnBsYXllclNpemUuaGVpZ2h0IC8gMikgKiogMik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRHbG9iYWxTaGFwZShlbGFwc2VkVGltZTogbnVtYmVyID0gMCk6IFNoYXBlIHtcclxuICAgICAgICBsZXQgcG9zaXRpb246IFZlY3RvciA9IHsgeDogdGhpcy5wb3NpdGlvbi54ICsgMCwgeTogdGhpcy5wb3NpdGlvbi55ICsgMCB9O1xyXG4gICAgICAgIGlmIChlbGFwc2VkVGltZSAhPT0gMCkge1xyXG4gICAgICAgICAgICBwb3NpdGlvbi54ID0gdGhpcy5wb3NpdGlvbi54ICsgdGhpcy5tb21lbnR1bS54ICogZWxhcHNlZFRpbWU7XHJcbiAgICAgICAgICAgIHBvc2l0aW9uLnkgPSB0aGlzLnBvc2l0aW9uLnkgKyB0aGlzLm1vbWVudHVtLnkgKiBlbGFwc2VkVGltZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuY3JvdWNoaW5nKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBjZW50ZXI6IHsgeDogdGhpcy5wb3NpdGlvbi54ICsgMCwgeTogdGhpcy5wb3NpdGlvbi55ICsgMCB9LFxyXG4gICAgICAgICAgICAgICAgcG9pbnRzOiBwbGF5ZXJDcm91Y2hpbmdTaGFwZS5wb2ludHMubWFwKChwb2ludCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IHg6IHBvaW50LnggKyBwb3NpdGlvbi54LCB5OiBwb2ludC55ICsgcG9zaXRpb24ueSB9O1xyXG4gICAgICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgICAgICBlZGdlczogcGxheWVyQ3JvdWNoaW5nU2hhcGUuZWRnZXMubWFwKChlZGdlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcDE6IHsgeDogZWRnZS5wMS54ICsgcG9zaXRpb24ueCwgeTogZWRnZS5wMS55ICsgcG9zaXRpb24ueSB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwMjogeyB4OiBlZGdlLnAyLnggKyBwb3NpdGlvbi54LCB5OiBlZGdlLnAyLnkgKyBwb3NpdGlvbi55IH0sXHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBjZW50ZXI6IHsgeDogdGhpcy5wb3NpdGlvbi54ICsgMCwgeTogdGhpcy5wb3NpdGlvbi55ICsgMCB9LFxyXG4gICAgICAgICAgICAgICAgcG9pbnRzOiBwbGF5ZXJTdGFuZGluZ1NoYXBlLnBvaW50cy5tYXAoKHBvaW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgeDogcG9pbnQueCArIHBvc2l0aW9uLngsIHk6IHBvaW50LnkgKyBwb3NpdGlvbi55IH07XHJcbiAgICAgICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgICAgIGVkZ2VzOiBwbGF5ZXJTdGFuZGluZ1NoYXBlLmVkZ2VzLm1hcCgoZWRnZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHAxOiB7IHg6IGVkZ2UucDEueCArIHBvc2l0aW9uLngsIHk6IGVkZ2UucDEueSArIHBvc2l0aW9uLnkgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcDI6IHsgeDogZWRnZS5wMi54ICsgcG9zaXRpb24ueCwgeTogZWRnZS5wMi55ICsgcG9zaXRpb24ueSB9LFxyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlZ2lzdGVyR3JvdW5kQW5nbGUoYW5nbGU6IG51bWJlciwgc3RhbmRpbmc6IGJvb2xlYW4pIHtcclxuICAgICAgICB0aGlzLm9iamVjdEFuZ2xlID0gKGFuZ2xlICsgdGhpcy5vYmplY3RBbmdsZSkgLyAyO1xyXG4gICAgICAgIGlmIChzdGFuZGluZykgdGhpcy5zdGFuZGluZyA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGp1bXAoKSB7XHJcbiAgICAgICAgdGhpcy5tb21lbnR1bS55ID0gLXRoaXMuanVtcEhlaWdodDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWNjZWxlcmF0ZVJpZ2h0KGVsYXBzZWRUaW1lOiBudW1iZXIpIHtcclxuICAgICAgICBpZiAodGhpcy5tb21lbnR1bS54IDwgdGhpcy5tYXhTaWRld2F5c1NwZWVkKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnN0YW5kaW5nKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgZm9yY2UgPSB0aGlzLnNpZGV3YXlzU3RhbmRpbmdBY2NlbGVyYXRpb24gKiBlbGFwc2VkVGltZTtcclxuICAgICAgICAgICAgICAgIHRoaXMubW9tZW50dW0ueCArPSBmb3JjZSAqIE1hdGguY29zKHRoaXMub2JqZWN0QW5nbGUpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMub2JqZWN0QW5nbGUgPiAwKSB0aGlzLm1vbWVudHVtLnkgKz0gZm9yY2UgKiBNYXRoLnNpbih0aGlzLm9iamVjdEFuZ2xlKSAqIDU7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1vbWVudHVtLnggKz0gdGhpcy5zaWRld2F5c0ZhbGxpbmdBY2NlbGVyYXRpb24gKiBlbGFwc2VkVGltZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5tb21lbnR1bS54ID4gdGhpcy5tYXhTaWRld2F5c1NwZWVkKSB0aGlzLm1vbWVudHVtLnggPSB0aGlzLm1heFNpZGV3YXlzU3BlZWQgLSAxO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWNjZWxlcmF0ZUxlZnQoZWxhcHNlZFRpbWU6IG51bWJlcikge1xyXG4gICAgICAgIGlmICh0aGlzLm1vbWVudHVtLnggPiAtdGhpcy5tYXhTaWRld2F5c1NwZWVkKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnN0YW5kaW5nKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgZm9yY2UgPSB0aGlzLnNpZGV3YXlzU3RhbmRpbmdBY2NlbGVyYXRpb24gKiBlbGFwc2VkVGltZTtcclxuICAgICAgICAgICAgICAgIHRoaXMubW9tZW50dW0ueCAtPSBmb3JjZSAqIE1hdGguY29zKHRoaXMub2JqZWN0QW5nbGUpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMub2JqZWN0QW5nbGUgPCAwKSB0aGlzLm1vbWVudHVtLnkgLT0gZm9yY2UgKiBNYXRoLnNpbih0aGlzLm9iamVjdEFuZ2xlKSAqIDU7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1vbWVudHVtLnggLT0gdGhpcy5zaWRld2F5c0ZhbGxpbmdBY2NlbGVyYXRpb24gKiBlbGFwc2VkVGltZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5tb21lbnR1bS54IDwgLXRoaXMubWF4U2lkZXdheXNTcGVlZCkgdGhpcy5tb21lbnR1bS54ID0gLXRoaXMubWF4U2lkZXdheXNTcGVlZCArIDE7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjcm91Y2goKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmNyb3VjaGluZykge1xyXG4gICAgICAgICAgICB0aGlzLnNpemUuaGVpZ2h0ID0gZGVmYXVsdEFjdG9yQ29uZmlnLnBsYXllckNyb3VjaFNpemUuaGVpZ2h0O1xyXG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uLnkgKz0gKGRlZmF1bHRBY3RvckNvbmZpZy5wbGF5ZXJTaXplLmhlaWdodCAtIHRoaXMuc2l6ZS5oZWlnaHQpIC8gMjtcclxuXHJcbiAgICAgICAgICAgIHRoaXMubWF4U2lkZXdheXNTcGVlZCAvPSAzO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5jcm91Y2hpbmcgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHB1YmxpYyB1bkNyb3VjaCgpIHtcclxuICAgICAgICBpZiAodGhpcy5jcm91Y2hpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbi55IC09IChkZWZhdWx0QWN0b3JDb25maWcucGxheWVyU2l6ZS5oZWlnaHQgLSB0aGlzLnNpemUuaGVpZ2h0KSAvIDI7XHJcbiAgICAgICAgICAgIHRoaXMuc2l6ZS5oZWlnaHQgPSBkZWZhdWx0QWN0b3JDb25maWcucGxheWVyU2l6ZS5oZWlnaHQgKyAwO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5tYXhTaWRld2F5c1NwZWVkICo9IDM7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmNyb3VjaGluZyA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdXBkYXRlKGVsYXBzZWRUaW1lOiBudW1iZXIsIGlzVHJhdmVsbGluZzogYm9vbGVhbikge1xyXG4gICAgICAgIGlmICghaXNUcmF2ZWxsaW5nICYmIHRoaXMuc3RhbmRpbmcpIHRoaXMucmVnaXN0ZXJHcm91bmRGcmljdGlvbihlbGFwc2VkVGltZSk7XHJcbiAgICAgICAgdGhpcy5yZWdpc3RlckFpclJlc2lzdGFuY2UoZWxhcHNlZFRpbWUpO1xyXG5cclxuICAgICAgICB0aGlzLnJlZ2lzdGVyR3Jhdml0eShlbGFwc2VkVGltZSk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVUcmFuc2xhdGlvbihlbGFwc2VkVGltZSk7XHJcblxyXG4gICAgICAgIHRoaXMucG9zaXRpb25VcGRhdGUoZWxhcHNlZFRpbWUpO1xyXG5cclxuICAgICAgICB0aGlzLnN0YW5kaW5nID0gZmFsc2U7XHJcblxyXG4gICAgICAgIHRoaXMuY2hlY2tYQm91bmRhcnlDb2xsaXNpb24oKTtcclxuICAgICAgICAvL2lmICh0aGlzLmNoZWNrWUJvdW5kYXJ5Q29sbGlzaW9uKCkpIHRoaXMuc3RhbmRpbmcgPSB0cnVlO1xyXG5cclxuICAgICAgICB0aGlzLmNoZWNrRG9vZGFkcygpO1xyXG5cclxuICAgICAgICBsZXQgZ3JvdW5kSGl0RGV0ZWN0aW9uOiB7IGhpdDogYm9vbGVhbjsgYW5nbGU6IG51bWJlciB9ID0gdGhpcy5jaGVja0dyb3VuZENvbGxpc2lvbihlbGFwc2VkVGltZSk7XHJcbiAgICAgICAgaWYgKGdyb3VuZEhpdERldGVjdGlvbi5oaXQpIHtcclxuICAgICAgICAgICAgdGhpcy5yZWdpc3Rlckdyb3VuZEFuZ2xlKGdyb3VuZEhpdERldGVjdGlvbi5hbmdsZSwgdHJ1ZSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKE1hdGguYWJzKHRoaXMub2JqZWN0QW5nbGUpIDwgMC4wMikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vYmplY3RBbmdsZSA9IDA7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9iamVjdEFuZ2xlICo9IDAuOTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5wcmV2aW91c1Bvc2l0aW9uVXBkYXRlKCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IHN0YW5kaW5nUDE6IFZlY3RvciA9IHsgeDogZGVmYXVsdEFjdG9yQ29uZmlnLnBsYXllclNpemUud2lkdGggLyAtMiwgeTogZGVmYXVsdEFjdG9yQ29uZmlnLnBsYXllclNpemUuaGVpZ2h0IC8gLTIgfTtcclxuY29uc3Qgc3RhbmRpbmdQMjogVmVjdG9yID0geyB4OiBkZWZhdWx0QWN0b3JDb25maWcucGxheWVyU2l6ZS53aWR0aCAvIDIsIHk6IGRlZmF1bHRBY3RvckNvbmZpZy5wbGF5ZXJTaXplLmhlaWdodCAvIC0yIH07XHJcbmNvbnN0IHN0YW5kaW5nUDM6IFZlY3RvciA9IHsgeDogZGVmYXVsdEFjdG9yQ29uZmlnLnBsYXllclNpemUud2lkdGggLyAyLCB5OiBkZWZhdWx0QWN0b3JDb25maWcucGxheWVyU2l6ZS5oZWlnaHQgLyAyIH07XHJcbmNvbnN0IHN0YW5kaW5nUDQ6IFZlY3RvciA9IHsgeDogZGVmYXVsdEFjdG9yQ29uZmlnLnBsYXllclNpemUud2lkdGggLyAtMiwgeTogZGVmYXVsdEFjdG9yQ29uZmlnLnBsYXllclNpemUuaGVpZ2h0IC8gMiB9O1xyXG5leHBvcnQgY29uc3QgcGxheWVyU3RhbmRpbmdTaGFwZTogU2hhcGUgPSB7XHJcbiAgICBjZW50ZXI6IHsgeDogMCwgeTogMCB9LFxyXG4gICAgcG9pbnRzOiBbc3RhbmRpbmdQMSwgc3RhbmRpbmdQMiwgc3RhbmRpbmdQMywgc3RhbmRpbmdQNF0sXHJcbiAgICBlZGdlczogW1xyXG4gICAgICAgIHsgcDE6IHN0YW5kaW5nUDEsIHAyOiBzdGFuZGluZ1AyIH0sXHJcbiAgICAgICAgeyBwMTogc3RhbmRpbmdQMiwgcDI6IHN0YW5kaW5nUDMgfSxcclxuICAgICAgICB7IHAxOiBzdGFuZGluZ1AzLCBwMjogc3RhbmRpbmdQNCB9LFxyXG4gICAgICAgIHsgcDE6IHN0YW5kaW5nUDQsIHAyOiBzdGFuZGluZ1AxIH0sXHJcbiAgICBdLFxyXG59O1xyXG5jb25zdCBjcm91Y2hpbmdQMTogVmVjdG9yID0geyB4OiBkZWZhdWx0QWN0b3JDb25maWcucGxheWVyQ3JvdWNoU2l6ZS53aWR0aCAvIC0yLCB5OiBkZWZhdWx0QWN0b3JDb25maWcucGxheWVyQ3JvdWNoU2l6ZS5oZWlnaHQgLyAtMiB9O1xyXG5jb25zdCBjcm91Y2hpbmdQMjogVmVjdG9yID0geyB4OiBkZWZhdWx0QWN0b3JDb25maWcucGxheWVyQ3JvdWNoU2l6ZS53aWR0aCAvIDIsIHk6IGRlZmF1bHRBY3RvckNvbmZpZy5wbGF5ZXJDcm91Y2hTaXplLmhlaWdodCAvIC0yIH07XHJcbmNvbnN0IGNyb3VjaGluZ1AzOiBWZWN0b3IgPSB7IHg6IGRlZmF1bHRBY3RvckNvbmZpZy5wbGF5ZXJDcm91Y2hTaXplLndpZHRoIC8gMiwgeTogZGVmYXVsdEFjdG9yQ29uZmlnLnBsYXllckNyb3VjaFNpemUuaGVpZ2h0IC8gMiB9O1xyXG5jb25zdCBjcm91Y2hpbmdQNDogVmVjdG9yID0geyB4OiBkZWZhdWx0QWN0b3JDb25maWcucGxheWVyQ3JvdWNoU2l6ZS53aWR0aCAvIC0yLCB5OiBkZWZhdWx0QWN0b3JDb25maWcucGxheWVyQ3JvdWNoU2l6ZS5oZWlnaHQgLyAyIH07XHJcbmV4cG9ydCBjb25zdCBwbGF5ZXJDcm91Y2hpbmdTaGFwZTogU2hhcGUgPSB7XHJcbiAgICBjZW50ZXI6IHsgeDogMCwgeTogMCB9LFxyXG4gICAgcG9pbnRzOiBbY3JvdWNoaW5nUDEsIGNyb3VjaGluZ1AyLCBjcm91Y2hpbmdQMywgY3JvdWNoaW5nUDRdLFxyXG4gICAgZWRnZXM6IFtcclxuICAgICAgICB7IHAxOiBjcm91Y2hpbmdQMSwgcDI6IGNyb3VjaGluZ1AyIH0sXHJcbiAgICAgICAgeyBwMTogY3JvdWNoaW5nUDIsIHAyOiBjcm91Y2hpbmdQMyB9LFxyXG4gICAgICAgIHsgcDE6IGNyb3VjaGluZ1AzLCBwMjogY3JvdWNoaW5nUDQgfSxcclxuICAgICAgICB7IHAxOiBjcm91Y2hpbmdQNCwgcDI6IGNyb3VjaGluZ1AxIH0sXHJcbiAgICBdLFxyXG59O1xyXG4iLCJpbXBvcnQgeyByb3RhdGVWZWN0b3IsIFZlY3RvciB9IGZyb20gXCIuLi8uLi8uLi92ZWN0b3JcIjtcclxuXHJcbmV4cG9ydCB0eXBlIFRyYW5zbGF0aW9uTmFtZSA9IFwidGVzdFRyYW5zbGF0aW9uXCIgfCBcImx1bmdlVHJhbnNsYXRpb25cIjtcclxuXHJcbmV4cG9ydCBjb25zdCB0cmFuc2xhdGlvbnM6IFJlY29yZDxUcmFuc2xhdGlvbk5hbWUsIFRyYW5zbGF0aW9uPiA9IHtcclxuICAgIHRlc3RUcmFuc2xhdGlvbjoge1xyXG4gICAgICAgIGtleXM6IFtcclxuICAgICAgICAgICAgeyBwb3M6IHsgeDogMjAsIHk6IDIwIH0sIHRpbWU6IDAuMSB9LFxyXG4gICAgICAgICAgICB7IHBvczogeyB4OiAzMCwgeTogNDAgfSwgdGltZTogMC4xIH0sXHJcbiAgICAgICAgICAgIHsgcG9zOiB7IHg6IDEwMCwgeTogLTEyMCB9LCB0aW1lOiAwLjIgfSxcclxuICAgICAgICAgICAgeyBwb3M6IHsgeDogMzAsIHk6IDQwIH0sIHRpbWU6IDAuMSB9LFxyXG4gICAgICAgICAgICB7IHBvczogeyB4OiAyMCwgeTogMjAgfSwgdGltZTogMC4xIH0sXHJcbiAgICAgICAgXSxcclxuICAgICAgICBmbGlwQWNyb3NzWTogdHJ1ZSxcclxuICAgICAgICBpZ25vcmVDb2xsaXNpb246IHRydWUsXHJcbiAgICAgICAgaWdub3JlR3Jhdml0eTogZmFsc2UsXHJcbiAgICB9LFxyXG4gICAgbHVuZ2VUcmFuc2xhdGlvbjoge1xyXG4gICAgICAgIGtleXM6IFtcclxuICAgICAgICAgICAgeyBwb3M6IHsgeDogMzAwLCB5OiAwIH0sIHRpbWU6IDAuMSB9LFxyXG4gICAgICAgICAgICB7IHBvczogeyB4OiAxMCwgeTogMCB9LCB0aW1lOiAwLjAyIH0sXHJcbiAgICAgICAgXSxcclxuICAgICAgICBmbGlwQWNyb3NzWTogZmFsc2UsXHJcbiAgICAgICAgaWdub3JlQ29sbGlzaW9uOiBmYWxzZSxcclxuICAgICAgICBpZ25vcmVHcmF2aXR5OiB0cnVlLFxyXG4gICAgfSxcclxufTtcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgVHJhbnNsYXRpb24ge1xyXG4gICAga2V5czogUG9zaXRpb25LZXlbXTtcclxuICAgIGZsaXBBY3Jvc3NZOiBib29sZWFuO1xyXG4gICAgaWdub3JlQ29sbGlzaW9uOiBib29sZWFuO1xyXG4gICAgaWdub3JlR3Jhdml0eTogYm9vbGVhbjtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBQb3NpdGlvbktleSB7XHJcbiAgICBwb3M6IFZlY3RvcjtcclxuICAgIHRpbWU6IG51bWJlcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJvdGF0ZUtleShrZXk6IFBvc2l0aW9uS2V5LCBhbmdsZTogbnVtYmVyLCBmbGlwWTogYm9vbGVhbik6IFBvc2l0aW9uS2V5IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgcG9zOiByb3RhdGVWZWN0b3IoYW5nbGUsIHtcclxuICAgICAgICAgICAgeDoga2V5LnBvcy54LFxyXG4gICAgICAgICAgICB5OiBrZXkucG9zLnkgKiAoZmxpcFkgJiYgKGFuZ2xlID49IE1hdGguUEkgLyAyIHx8IGFuZ2xlIDw9IE1hdGguUEkgLyAtMikgPyAtMSA6IDEpLFxyXG4gICAgICAgIH0pLFxyXG4gICAgICAgIHRpbWU6IGtleS50aW1lLFxyXG4gICAgfTtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBUcmFuc2xhdGlvbkRhdGEge1xyXG4gICAgdHJhbnNsYXRlSW5mbzogVHJhbnNsYXRpb24gfCB1bmRlZmluZWQ7XHJcbiAgICBrZXlJbmRleDogbnVtYmVyO1xyXG4gICAgb3JpZ2luYWxQb3NpdGlvbjogVmVjdG9yO1xyXG4gICAgY291bnRlcjogbnVtYmVyO1xyXG4gICAga2V5VGltZUxlbmd0aDogbnVtYmVyO1xyXG4gICAgYW5nbGU6IG51bWJlcjtcclxufVxyXG4iLCJpbXBvcnQgeyBHYW1lLCBHbG9iYWxDbGllbnRBY3RvcnMgfSBmcm9tIFwiLi4vLi4vLi4vY2xpZW50L2dhbWVcIjtcclxuaW1wb3J0IHsgVmVjdG9yIH0gZnJvbSBcIi4uLy4uLy4uL3ZlY3RvclwiO1xyXG5pbXBvcnQgeyBDbGllbnRGbG9vciB9IGZyb20gXCIuLi8uLi90ZXJyYWluL2Zsb29yL2NsaWVudEZsb29yXCI7XHJcbmltcG9ydCB7IEFjdG9yLCBBY3RvclR5cGUgfSBmcm9tIFwiLi4vYWN0b3JcIjtcclxuaW1wb3J0IHsgVHJhbnNsYXRpb25OYW1lIH0gZnJvbSBcIi4uL2FjdG9yT2JqZWN0cy90cmFuc2xhdGlvbnNcIjtcclxuaW1wb3J0IHsgTW9kZWwgfSBmcm9tIFwiLi9tb2RlbC9tb2RlbFwiO1xyXG5cclxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIENsaWVudEFjdG9yIGV4dGVuZHMgQWN0b3Ige1xyXG4gICAgcHJvdGVjdGVkIGFic3RyYWN0IHJlYWRvbmx5IG1vZGVsOiBNb2RlbDtcclxuICAgIHByb3RlY3RlZCByZWFkb25seSBnbG9iYWxBY3RvcnM6IEdsb2JhbENsaWVudEFjdG9ycztcclxuICAgIHByb3RlY3RlZCBsYXN0SGl0QnlBY3RvcjogQ2xpZW50QWN0b3I7XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJvdGVjdGVkIGdhbWU6IEdhbWUsIGFjdG9yVHlwZTogQWN0b3JUeXBlLCBpZDogbnVtYmVyLCBwb3NpdGlvbjogVmVjdG9yLCBtb21lbnR1bTogVmVjdG9yLCBoZWFsdGhJbmZvOiB7IGhlYWx0aDogbnVtYmVyOyBtYXhIZWFsdGg6IG51bWJlciB9KSB7XHJcbiAgICAgICAgc3VwZXIoYWN0b3JUeXBlLCBpZCwgcG9zaXRpb24sIG1vbWVudHVtLCBoZWFsdGhJbmZvKTtcclxuICAgICAgICB0aGlzLmdsb2JhbEFjdG9ycyA9IHRoaXMuZ2FtZS5nZXRHbG9iYWxBY3RvcnMoKTtcclxuICAgICAgICB0aGlzLmxhc3RIaXRCeUFjdG9yID0gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVuZGVyKCkge1xyXG4gICAgICAgIHRoaXMubW9kZWwucmVuZGVyKCk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgcmVuZGVySGVhbHRoKCkge1xyXG4gICAgICAgIHRoaXMubW9kZWwucmVuZGVySGVhbHRoKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHVwZGF0ZVBvc2l0aW9uQW5kTW9tZW50dW1Gcm9tU2VydmVyKHBvc2l0aW9uOiBWZWN0b3IsIG1vbWVudHVtOiBWZWN0b3IpIHtcclxuICAgICAgICAvL3RoaXMubW9kZWwucHJvY2Vzc1Bvc2l0aW9uVXBkYXRlRGlmZmVyZW5jZSh7IHg6IHBvc2l0aW9uLnggLSB0aGlzLnBvc2l0aW9uLngsIHk6IHBvc2l0aW9uLnkgLSB0aGlzLnBvc2l0aW9uLnkgfSk7XHJcblxyXG4gICAgICAgIHRoaXMucG9zaXRpb24ueCA9IHBvc2l0aW9uLnggKyAwO1xyXG4gICAgICAgIHRoaXMucG9zaXRpb24ueSA9IHBvc2l0aW9uLnkgKyAwO1xyXG4gICAgICAgIHRoaXMubW9tZW50dW0ueCA9IG1vbWVudHVtLnggKyAwO1xyXG4gICAgICAgIHRoaXMubW9tZW50dW0ueSA9IG1vbWVudHVtLnkgKyAwO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZWdpc3RlckRhbWFnZShcclxuICAgICAgICBvcmlnaW5BY3RvcjogQWN0b3IsXHJcbiAgICAgICAgbmV3SGVhbHRoOiBudW1iZXIsXHJcbiAgICAgICAga25vY2tiYWNrOiBWZWN0b3IgfCB1bmRlZmluZWQsXHJcbiAgICAgICAgdHJhbnNsYXRpb25EYXRhOiB7IG5hbWU6IFRyYW5zbGF0aW9uTmFtZTsgYW5nbGU6IG51bWJlciB9IHwgdW5kZWZpbmVkLFxyXG4gICAgKTogeyBpZktpbGxlZDogYm9vbGVhbjsgZGFtYWdlRGVhbHQ6IG51bWJlciB9IHtcclxuICAgICAgICB0aGlzLm1vZGVsLnJlZ2lzdGVyRGFtYWdlKG5ld0hlYWx0aCAtIHRoaXMuaGVhbHRoSW5mby5oZWFsdGgpO1xyXG4gICAgICAgIG9yaWdpbkFjdG9yLnJlZ2lzdGVyRGFtYWdlRG9uZShuZXdIZWFsdGggLSB0aGlzLmhlYWx0aEluZm8uaGVhbHRoKTtcclxuXHJcbiAgICAgICAgaWYgKHRyYW5zbGF0aW9uRGF0YSkgdGhpcy5hY3Rvck9iamVjdC5zdGFydFRyYW5zbGF0aW9uKHRyYW5zbGF0aW9uRGF0YS5hbmdsZSwgdHJhbnNsYXRpb25EYXRhLm5hbWUpO1xyXG4gICAgICAgIGlmIChrbm9ja2JhY2spIHRoaXMuYWN0b3JPYmplY3QucmVnaXN0ZXJLbm9ja2JhY2soa25vY2tiYWNrKTtcclxuXHJcbiAgICAgICAgdGhpcy5oZWFsdGhJbmZvLmhlYWx0aCA9IG5ld0hlYWx0aCArIDA7XHJcbiAgICAgICAgcmV0dXJuIHsgaWZLaWxsZWQ6IGZhbHNlLCBkYW1hZ2VEZWFsdDogMCB9O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZWdpc3RlckhlYWwobmV3SGVhbHRoOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLm1vZGVsLnJlZ2lzdGVySGVhbChuZXdIZWFsdGggLSB0aGlzLmhlYWx0aEluZm8uaGVhbHRoKTtcclxuICAgICAgICB0aGlzLmhlYWx0aEluZm8uaGVhbHRoID0gbmV3SGVhbHRoICsgMDtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJlbmRlclNoYXBlKGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELCBwb2ludHM6IFZlY3RvcltdKSB7XHJcbiAgICBjdHguZ2xvYmFsQWxwaGEgPSAwLjQ7XHJcbiAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICBjdHgubW92ZVRvKHBvaW50c1swXS54LCBwb2ludHNbMF0ueSk7XHJcbiAgICBmb3IgKGxldCBpOiBudW1iZXIgPSAxOyBpIDwgcG9pbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgY3R4LmxpbmVUbyhwb2ludHNbaV0ueCwgcG9pbnRzW2ldLnkpO1xyXG4gICAgfVxyXG4gICAgY3R4LmZpbGwoKTtcclxuICAgIGN0eC5nbG9iYWxBbHBoYSA9IDE7XHJcbn1cclxuIiwiaW1wb3J0IHsgR2FtZSB9IGZyb20gXCIuLi8uLi8uLi8uLi8uLi9jbGllbnQvZ2FtZVwiO1xyXG5pbXBvcnQgeyBmaW5kQW5nbGUgfSBmcm9tIFwiLi4vLi4vLi4vLi4vLi4vZmluZEFuZ2xlXCI7XHJcbmltcG9ydCB7IFZlY3RvciB9IGZyb20gXCIuLi8uLi8uLi8uLi8uLi92ZWN0b3JcIjtcclxuaW1wb3J0IHsgQ2xpZW50RG9vZGFkIH0gZnJvbSBcIi4uLy4uLy4uLy4uL3RlcnJhaW4vZG9vZGFkcy9jbGllbnREb29kYWRcIjtcclxuaW1wb3J0IHsgQ2xpZW50Rmxvb3IgfSBmcm9tIFwiLi4vLi4vLi4vLi4vdGVycmFpbi9mbG9vci9jbGllbnRGbG9vclwiO1xyXG5pbXBvcnQgeyB0cmFuc2xhdGlvbnMgfSBmcm9tIFwiLi4vLi4vLi4vYWN0b3JPYmplY3RzL3RyYW5zbGF0aW9uc1wiO1xyXG5pbXBvcnQgeyBDbGFzc1R5cGUsIFNlcmlhbGl6ZWRQbGF5ZXIgfSBmcm9tIFwiLi4vLi4vLi4vc2VydmVyQWN0b3JzL3NlcnZlclBsYXllci9zZXJ2ZXJQbGF5ZXJcIjtcclxuaW1wb3J0IHsgRGFnZ2Vyc1BsYXllck1vZGVsIH0gZnJvbSBcIi4uLy4uL21vZGVsL3BsYXllck1vZGVscy9kYWdnZXJzUGxheWVyTW9kZWxcIjtcclxuaW1wb3J0IHsgQ2xpZW50UGxheWVyIH0gZnJvbSBcIi4uL2NsaWVudFBsYXllclwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIENsaWVudERhZ2dlcnMgZXh0ZW5kcyBDbGllbnRQbGF5ZXIge1xyXG4gICAgY2xhc3NUeXBlOiBDbGFzc1R5cGUgPSBcImRhZ2dlcnNcIjtcclxuICAgIG1vZGVsOiBEYWdnZXJzUGxheWVyTW9kZWw7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZ2FtZTogR2FtZSwgcGxheWVySW5mbzogU2VyaWFsaXplZFBsYXllcikge1xyXG4gICAgICAgIHN1cGVyKGdhbWUsIHBsYXllckluZm8sIFwiZGFnZ2Vyc1BsYXllclwiKTtcclxuXHJcbiAgICAgICAgdGhpcy5tb2RlbCA9IG5ldyBEYWdnZXJzUGxheWVyTW9kZWwoZ2FtZSwgdGhpcywgZ2FtZS5nZXRBY3RvckN0eCgpLCBwbGF5ZXJJbmZvLnBvc2l0aW9uLCBnYW1lLmdldEFjdG9yU2lkZSh0aGlzLmlkKSwgdGhpcy5jb2xvciwgdGhpcy5hY3Rvck9iamVjdC5zaXplKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcGVyZm9ybUNsaWVudEFiaWxpdHk6IFJlY29yZDxEYWdnZXJzUGxheWVyQWJpbGl0eSwgKG1vdXNlUG9zOiBWZWN0b3IpID0+IHZvaWQ+ID0ge1xyXG4gICAgICAgIHN0YWI6IChtb3VzZVBvcykgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLm1vZGVsLnNldEFuaW1hdGlvbihcInN0YWJcIiwgZmluZEFuZ2xlKHRoaXMucG9zaXRpb24sIG1vdXNlUG9zKSk7XHJcbiAgICAgICAgICAgIC8vdGhpcy5nYW1lLnBhcnRpY2xlU3lzdGVtLmFkZER1bW15U2xhc2hFZmZlY3QyKHRoaXMucG9zaXRpb24sIGZpbmRNaXJyb3JlZEFuZ2xlKGZpbmRBbmdsZSh0aGlzLnBvc2l0aW9uLCBtb3VzZVBvcykpLCB0aGlzLmZhY2luZ1JpZ2h0KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGx1bmdlOiAobW91c2VQb3MpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5tb2RlbC5zZXRBbmltYXRpb24oXCJsdW5nZVwiLCAwKTtcclxuICAgICAgICAgICAgdGhpcy5nYW1lLnBhcnRpY2xlU3lzdGVtLmFkZEx1bmdlRWZmZWN0KHRoaXMucG9zaXRpb24sIHRoaXMubW9kZWwuZ2V0Q29sb3IoKSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICB1bmF2YWlsYWJsZTogKCkgPT4ge30sXHJcbiAgICB9O1xyXG4gICAgcHVibGljIHJlbGVhc2VDbGllbnRBYmlsaXR5OiBSZWNvcmQ8RGFnZ2Vyc1BsYXllckFiaWxpdHksICgpID0+IHZvaWQ+ID0ge1xyXG4gICAgICAgIHN0YWI6ICgpID0+IHt9LFxyXG4gICAgICAgIGx1bmdlOiAoKSA9PiB7fSxcclxuICAgICAgICB1bmF2YWlsYWJsZTogKCkgPT4ge30sXHJcbiAgICB9O1xyXG59XHJcblxyXG5leHBvcnQgdHlwZSBEYWdnZXJzUGxheWVyQWJpbGl0eSA9IFwic3RhYlwiIHwgXCJsdW5nZVwiIHwgXCJ1bmF2YWlsYWJsZVwiO1xyXG4iLCJpbXBvcnQgeyBHYW1lIH0gZnJvbSBcIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9nYW1lXCI7XHJcbmltcG9ydCB7IGZpbmRBbmdsZSB9IGZyb20gXCIuLi8uLi8uLi8uLi8uLi9maW5kQW5nbGVcIjtcclxuaW1wb3J0IHsgVmVjdG9yIH0gZnJvbSBcIi4uLy4uLy4uLy4uLy4uL3ZlY3RvclwiO1xyXG5pbXBvcnQgeyBDbGllbnREb29kYWQgfSBmcm9tIFwiLi4vLi4vLi4vLi4vdGVycmFpbi9kb29kYWRzL2NsaWVudERvb2RhZFwiO1xyXG5pbXBvcnQgeyBDbGllbnRGbG9vciB9IGZyb20gXCIuLi8uLi8uLi8uLi90ZXJyYWluL2Zsb29yL2NsaWVudEZsb29yXCI7XHJcbmltcG9ydCB7IENsYXNzVHlwZSwgU2VyaWFsaXplZFBsYXllciB9IGZyb20gXCIuLi8uLi8uLi9zZXJ2ZXJBY3RvcnMvc2VydmVyUGxheWVyL3NlcnZlclBsYXllclwiO1xyXG5pbXBvcnQgeyBIYW1tZXJQbGF5ZXJNb2RlbCB9IGZyb20gXCIuLi8uLi9tb2RlbC9wbGF5ZXJNb2RlbHMvaGFtbWVyUGxheWVyTW9kZWxcIjtcclxuaW1wb3J0IHsgQ2xpZW50UGxheWVyIH0gZnJvbSBcIi4uL2NsaWVudFBsYXllclwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIENsaWVudEhhbW1lciBleHRlbmRzIENsaWVudFBsYXllciB7XHJcbiAgICBjbGFzc1R5cGU6IENsYXNzVHlwZSA9IFwiaGFtbWVyXCI7XHJcbiAgICBtb2RlbDogSGFtbWVyUGxheWVyTW9kZWw7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZ2FtZTogR2FtZSwgcGxheWVySW5mbzogU2VyaWFsaXplZFBsYXllcikge1xyXG4gICAgICAgIHN1cGVyKGdhbWUsIHBsYXllckluZm8sIFwiaGFtbWVyUGxheWVyXCIpO1xyXG4gICAgICAgIHRoaXMubW9kZWwgPSBuZXcgSGFtbWVyUGxheWVyTW9kZWwoZ2FtZSwgdGhpcywgZ2FtZS5nZXRBY3RvckN0eCgpLCBwbGF5ZXJJbmZvLnBvc2l0aW9uLCBnYW1lLmdldEFjdG9yU2lkZSh0aGlzLmlkKSwgdGhpcy5jb2xvciwgdGhpcy5hY3Rvck9iamVjdC5zaXplKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcGVyZm9ybUNsaWVudEFiaWxpdHk6IFJlY29yZDxIYW1tZXJQbGF5ZXJBYmlsaXR5LCAobW91c2VQb3M6IFZlY3RvcikgPT4gdm9pZD4gPSB7XHJcbiAgICAgICAgc3dpbmc6IChtb3VzZVBvcykgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLm1vZGVsLnNldEFuaW1hdGlvbihcInN3aW5nMVwiLCBmaW5kQW5nbGUodGhpcy5wb3NpdGlvbiwgbW91c2VQb3MpKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHBvdW5kOiAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMubW9kZWwuc2V0QW5pbWF0aW9uKFwicG91bmRcIiwgMCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICB1bmF2YWlsYWJsZTogKCkgPT4ge30sXHJcbiAgICB9O1xyXG5cclxuICAgIHB1YmxpYyByZWxlYXNlQ2xpZW50QWJpbGl0eTogUmVjb3JkPEhhbW1lclBsYXllckFiaWxpdHksICgpID0+IHZvaWQ+ID0ge1xyXG4gICAgICAgIHN3aW5nOiAoKSA9PiB7fSxcclxuICAgICAgICBwb3VuZDogKCkgPT4ge30sXHJcbiAgICAgICAgdW5hdmFpbGFibGU6ICgpID0+IHt9LFxyXG4gICAgfTtcclxufVxyXG5cclxuZXhwb3J0IHR5cGUgSGFtbWVyUGxheWVyQWJpbGl0eSA9IFwic3dpbmdcIiB8IFwicG91bmRcIiB8IFwidW5hdmFpbGFibGVcIjsgLy8gfCBcImV4b25lcmF0ZVwiIHwgXCJyZWNrb25pbmdcIiB8IFwianVkZ2VtZW50XCIgfCBcImNoYWluc1wiIHwgXCJ3cmF0aFwiIHwgXCJsaWdodG5pbmdcIiB8IFwiYmxpenphcmRcIjtcclxuIiwiaW1wb3J0IHsgR2FtZSB9IGZyb20gXCIuLi8uLi8uLi8uLi8uLi9jbGllbnQvZ2FtZVwiO1xyXG5pbXBvcnQgeyBEdW1teVdoaXJsd2luZEVmZmVjdCB9IGZyb20gXCIuLi8uLi8uLi8uLi8uLi9jbGllbnQvcGFydGljbGVzL3BhcnRpY2xlQ2xhc3Nlcy9kdW1teVdoaXJsd2luZEVmZmVjdFwiO1xyXG5pbXBvcnQgeyBmaW5kQW5nbGUgfSBmcm9tIFwiLi4vLi4vLi4vLi4vLi4vZmluZEFuZ2xlXCI7XHJcbmltcG9ydCB7IGZpbmRNaXJyb3JlZEFuZ2xlLCBWZWN0b3IgfSBmcm9tIFwiLi4vLi4vLi4vLi4vLi4vdmVjdG9yXCI7XHJcbmltcG9ydCB7IENsaWVudERvb2RhZCB9IGZyb20gXCIuLi8uLi8uLi8uLi90ZXJyYWluL2Rvb2RhZHMvY2xpZW50RG9vZGFkXCI7XHJcbmltcG9ydCB7IENsaWVudEZsb29yIH0gZnJvbSBcIi4uLy4uLy4uLy4uL3RlcnJhaW4vZmxvb3IvY2xpZW50Rmxvb3JcIjtcclxuaW1wb3J0IHsgQ2xhc3NUeXBlLCBTZXJpYWxpemVkUGxheWVyIH0gZnJvbSBcIi4uLy4uLy4uL3NlcnZlckFjdG9ycy9zZXJ2ZXJQbGF5ZXIvc2VydmVyUGxheWVyXCI7XHJcbmltcG9ydCB7IFN3b3JkUGxheWVyTW9kZWwgfSBmcm9tIFwiLi4vLi4vbW9kZWwvcGxheWVyTW9kZWxzL3N3b3JkUGxheWVyTW9kZWxcIjtcclxuaW1wb3J0IHsgQ2xpZW50UGxheWVyIH0gZnJvbSBcIi4uL2NsaWVudFBsYXllclwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIENsaWVudFN3b3JkIGV4dGVuZHMgQ2xpZW50UGxheWVyIHtcclxuICAgIGNsYXNzVHlwZTogQ2xhc3NUeXBlID0gXCJzd29yZFwiO1xyXG4gICAgbW9kZWw6IFN3b3JkUGxheWVyTW9kZWw7XHJcblxyXG4gICAgcHJvdGVjdGVkIHdoaXJsd2luZEVmZmVjdHBhcnRpY2xlOiBEdW1teVdoaXJsd2luZEVmZmVjdCB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihnYW1lOiBHYW1lLCBwbGF5ZXJJbmZvOiBTZXJpYWxpemVkUGxheWVyKSB7XHJcbiAgICAgICAgc3VwZXIoZ2FtZSwgcGxheWVySW5mbywgXCJzd29yZFBsYXllclwiKTtcclxuXHJcbiAgICAgICAgdGhpcy5tb2RlbCA9IG5ldyBTd29yZFBsYXllck1vZGVsKGdhbWUsIHRoaXMsIGdhbWUuZ2V0QWN0b3JDdHgoKSwgcGxheWVySW5mby5wb3NpdGlvbiwgZ2FtZS5nZXRBY3RvclNpZGUodGhpcy5pZCksIHRoaXMuY29sb3IsIHRoaXMuYWN0b3JPYmplY3Quc2l6ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHBlcmZvcm1DbGllbnRBYmlsaXR5OiBSZWNvcmQ8U3dvcmRQbGF5ZXJBYmlsaXR5LCAobW91c2VQb3M6IFZlY3RvcikgPT4gdm9pZD4gPSB7XHJcbiAgICAgICAgc2xhc2g6IChtb3VzZVBvcykgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLm1vZGVsLnNldEFuaW1hdGlvbihcInNsYXNoMVwiLCBmaW5kQW5nbGUodGhpcy5wb3NpdGlvbiwgbW91c2VQb3MpKTtcclxuICAgICAgICAgICAgdGhpcy5nYW1lLnBhcnRpY2xlU3lzdGVtLmFkZER1bW15U2xhc2hFZmZlY3QyKHRoaXMucG9zaXRpb24sIGZpbmRNaXJyb3JlZEFuZ2xlKGZpbmRBbmdsZSh0aGlzLnBvc2l0aW9uLCBtb3VzZVBvcykpLCB0aGlzLmZhY2luZ1JpZ2h0KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHdoaXJsd2luZDogKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLm1vZGVsLnNldEFuaW1hdGlvbihcIndoaXJsd2luZFwiLCAwKTtcclxuICAgICAgICAgICAgdGhpcy53aGlybHdpbmRFZmZlY3RwYXJ0aWNsZSA9IHRoaXMuZ2FtZS5wYXJ0aWNsZVN5c3RlbS5hZGREdW1teVdoaXJsd2luZEVmZmVjdCh0aGlzLnBvc2l0aW9uLCB0aGlzLmZhY2luZ1JpZ2h0KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHVuYXZhaWxhYmxlOiAoKSA9PiB7fSxcclxuICAgIH07XHJcbiAgICBwdWJsaWMgcmVsZWFzZUNsaWVudEFiaWxpdHk6IFJlY29yZDxTd29yZFBsYXllckFiaWxpdHksICgpID0+IHZvaWQ+ID0ge1xyXG4gICAgICAgIHNsYXNoOiAoKSA9PiB7fSxcclxuICAgICAgICB3aGlybHdpbmQ6ICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5tb2RlbC5zZXRBbmltYXRpb24oXCJzdGFuZFwiLCAwKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMud2hpcmx3aW5kRWZmZWN0cGFydGljbGUgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy53aGlybHdpbmRFZmZlY3RwYXJ0aWNsZS5wcmVtYXR1cmVFbmQoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMud2hpcmx3aW5kRWZmZWN0cGFydGljbGUgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHVuYXZhaWxhYmxlOiAoKSA9PiB7fSxcclxuICAgIH07XHJcbn1cclxuXHJcbmV4cG9ydCB0eXBlIFN3b3JkUGxheWVyQWJpbGl0eSA9IFwic2xhc2hcIiB8IFwid2hpcmx3aW5kXCIgfCBcInVuYXZhaWxhYmxlXCI7IC8vIHwgXCJsZWVjaFN0cmlrZVwiIHwgXCJmaW5lc3NlXCIgfCBcImJsb29kU2hpZWxkXCIgfCBcInBhcnJ5XCIgfCBcImNoYXJnZVwiIHwgXCJtYXN0ZXJwaWVjZVwiO1xyXG4iLCJpbXBvcnQgeyBHYW1lIH0gZnJvbSBcIi4uLy4uLy4uLy4uL2NsaWVudC9nYW1lXCI7XHJcbmltcG9ydCB7IFNpemUgfSBmcm9tIFwiLi4vLi4vLi4vLi4vc2l6ZVwiO1xyXG5pbXBvcnQgeyBWZWN0b3IgfSBmcm9tIFwiLi4vLi4vLi4vLi4vdmVjdG9yXCI7XHJcbmltcG9ydCB7IENsaWVudERvb2RhZCB9IGZyb20gXCIuLi8uLi8uLi90ZXJyYWluL2Rvb2RhZHMvY2xpZW50RG9vZGFkXCI7XHJcbmltcG9ydCB7IENsaWVudEZsb29yIH0gZnJvbSBcIi4uLy4uLy4uL3RlcnJhaW4vZmxvb3IvY2xpZW50Rmxvb3JcIjtcclxuaW1wb3J0IHsgQWN0b3JUeXBlIH0gZnJvbSBcIi4uLy4uL2FjdG9yXCI7XHJcbmltcG9ydCB7IGRlZmF1bHRBY3RvckNvbmZpZyB9IGZyb20gXCIuLi8uLi9hY3RvckNvbmZpZ1wiO1xyXG5pbXBvcnQgeyBQbGF5ZXJPYmplY3QgfSBmcm9tIFwiLi4vLi4vYWN0b3JPYmplY3RzL3BsYXllck9iamVjdFwiO1xyXG5pbXBvcnQgeyBDbGFzc1R5cGUsIFBsYXllckFjdGlvblR5cGUsIFNlcmlhbGl6ZWRQbGF5ZXIgfSBmcm9tIFwiLi4vLi4vc2VydmVyQWN0b3JzL3NlcnZlclBsYXllci9zZXJ2ZXJQbGF5ZXJcIjtcclxuaW1wb3J0IHsgQ2xpZW50QWN0b3IgfSBmcm9tIFwiLi4vY2xpZW50QWN0b3JcIjtcclxuaW1wb3J0IHsgUGxheWVyTW9kZWwgfSBmcm9tIFwiLi4vbW9kZWwvcGxheWVyTW9kZWxzL3BsYXllck1vZGVsXCI7XHJcbmltcG9ydCB7IFN3b3JkUGxheWVyTW9kZWwgfSBmcm9tIFwiLi4vbW9kZWwvcGxheWVyTW9kZWxzL3N3b3JkUGxheWVyTW9kZWxcIjtcclxuaW1wb3J0IHsgQ2xpZW50U3dvcmQgfSBmcm9tIFwiLi9jbGllbnRDbGFzc2VzL2NsaWVudFN3b3JkXCI7XHJcblxyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgQ2xpZW50UGxheWVyIGV4dGVuZHMgQ2xpZW50QWN0b3Ige1xyXG4gICAgYWN0b3JPYmplY3Q6IFBsYXllck9iamVjdDtcclxuXHJcbiAgICBwcm90ZWN0ZWQgYWJzdHJhY3QgcmVhZG9ubHkgbW9kZWw6IFBsYXllck1vZGVsO1xyXG5cclxuICAgIHB1YmxpYyBhYnN0cmFjdCBjbGFzc1R5cGU6IENsYXNzVHlwZTtcclxuICAgIHByb3RlY3RlZCByZWFkb25seSBjb2xvcjogc3RyaW5nO1xyXG4gICAgcHJvdGVjdGVkIHJlYWRvbmx5IG5hbWU6IHN0cmluZztcclxuICAgIHByb3RlY3RlZCBsZXZlbDogbnVtYmVyO1xyXG4gICAgcHJvdGVjdGVkIHNwZWM6IG51bWJlcjtcclxuICAgIHB1YmxpYyBtb3ZlQWN0aW9uc05leHRGcmFtZTogUmVjb3JkPFBsYXllckFjdGlvblR5cGUsIGJvb2xlYW4+ID0ge1xyXG4gICAgICAgIGp1bXA6IGZhbHNlLFxyXG4gICAgICAgIG1vdmVSaWdodDogZmFsc2UsXHJcbiAgICAgICAgbW92ZUxlZnQ6IGZhbHNlLFxyXG4gICAgICAgIGNyb3VjaDogZmFsc2UsXHJcbiAgICB9O1xyXG5cclxuICAgIHB1YmxpYyBmYWNpbmdSaWdodDogYm9vbGVhbiA9IHRydWU7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZ2FtZTogR2FtZSwgcGxheWVySW5mbzogU2VyaWFsaXplZFBsYXllciwgYWN0b3JUeXBlOiBBY3RvclR5cGUpIHtcclxuICAgICAgICBzdXBlcihnYW1lLCBhY3RvclR5cGUsIHBsYXllckluZm8uaWQsIHBsYXllckluZm8ucG9zaXRpb24sIHBsYXllckluZm8ubW9tZW50dW0sIHBsYXllckluZm8uaGVhbHRoSW5mbyk7XHJcblxyXG4gICAgICAgIHRoaXMuY29sb3IgPSBwbGF5ZXJJbmZvLmNvbG9yO1xyXG4gICAgICAgIHRoaXMubmFtZSA9IHBsYXllckluZm8ubmFtZTtcclxuICAgICAgICB0aGlzLmxldmVsID0gcGxheWVySW5mby5jbGFzc0xldmVsO1xyXG4gICAgICAgIHRoaXMuc3BlYyA9IHBsYXllckluZm8uY2xhc3NTcGVjO1xyXG4gICAgICAgIHRoaXMuZmFjaW5nUmlnaHQgPSBwbGF5ZXJJbmZvLmZhY2luZ1JpZ2h0O1xyXG5cclxuICAgICAgICBsZXQgcGxheWVyU2l6ZVBvaW50ZXI6IFNpemUgPSB7IHdpZHRoOiBkZWZhdWx0QWN0b3JDb25maWcucGxheWVyU2l6ZS53aWR0aCArIDAsIGhlaWdodDogZGVmYXVsdEFjdG9yQ29uZmlnLnBsYXllclNpemUuaGVpZ2h0ICsgMCB9O1xyXG5cclxuICAgICAgICB0aGlzLmFjdG9yT2JqZWN0ID0gbmV3IFBsYXllck9iamVjdChnYW1lLmdldEdsb2JhbE9iamVjdHMoKSwgdGhpcywgdGhpcy5wb3NpdGlvbiwgdGhpcy5tb21lbnR1bSwgcGxheWVyU2l6ZVBvaW50ZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRMZXZlbCgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmxldmVsO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRTcGVjKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc3BlYztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY2hhbmdlU3BlYyhzcGVjOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLnNwZWMgPSBzcGVjO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRDbGFzc1R5cGUoKTogQ2xhc3NUeXBlIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jbGFzc1R5cGU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGF0dGVtcHRKdW1wQWN0aW9uKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICghdGhpcy5hY3Rvck9iamVjdC5jcm91Y2hpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5tb3ZlQWN0aW9uc05leHRGcmFtZS5qdW1wID0gdHJ1ZTtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBhdHRlbXB0Q3JvdWNoQWN0aW9uKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICh0cnVlKSB7XHJcbiAgICAgICAgICAgIHRoaXMubW92ZUFjdGlvbnNOZXh0RnJhbWUuY3JvdWNoID0gdHJ1ZTtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBjcm91Y2goKSB7XHJcbiAgICAgICAgdGhpcy5hY3Rvck9iamVjdC5jcm91Y2goKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyB1bkNyb3VjaCgpIHtcclxuICAgICAgICB0aGlzLmFjdG9yT2JqZWN0LnVuQ3JvdWNoKCk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQganVtcCgpIHtcclxuICAgICAgICB0aGlzLm1vdmVBY3Rpb25zTmV4dEZyYW1lLmp1bXAgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmFjdG9yT2JqZWN0Lmp1bXAoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYXR0ZW1wdE1vdmVSaWdodEFjdGlvbigpOiBib29sZWFuIHtcclxuICAgICAgICBpZiAodHJ1ZSkge1xyXG4gICAgICAgICAgICB0aGlzLm1vdmVBY3Rpb25zTmV4dEZyYW1lLm1vdmVSaWdodCA9IHRydWU7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgbW92ZVJpZ2h0KGVsYXBzZWRUaW1lOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLmFjdG9yT2JqZWN0LmFjY2VsZXJhdGVSaWdodChlbGFwc2VkVGltZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGF0dGVtcHRNb3ZlTGVmdEFjdGlvbigpOiBib29sZWFuIHtcclxuICAgICAgICBpZiAodHJ1ZSkge1xyXG4gICAgICAgICAgICB0aGlzLm1vdmVBY3Rpb25zTmV4dEZyYW1lLm1vdmVMZWZ0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBtb3ZlTGVmdChlbGFwc2VkVGltZTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5hY3Rvck9iamVjdC5hY2NlbGVyYXRlTGVmdChlbGFwc2VkVGltZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIHVwZGF0ZUFjdGlvbnMoZWxhcHNlZFRpbWU6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMubW9kZWwudXBkYXRlKGVsYXBzZWRUaW1lKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMubW92ZUFjdGlvbnNOZXh0RnJhbWUuanVtcCkge1xyXG4gICAgICAgICAgICB0aGlzLmp1bXAoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMubW92ZUFjdGlvbnNOZXh0RnJhbWUubW92ZVJpZ2h0KSB7XHJcbiAgICAgICAgICAgIHRoaXMubW92ZVJpZ2h0KGVsYXBzZWRUaW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMubW92ZUFjdGlvbnNOZXh0RnJhbWUubW92ZUxlZnQpIHtcclxuICAgICAgICAgICAgdGhpcy5tb3ZlTGVmdChlbGFwc2VkVGltZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLm1vdmVBY3Rpb25zTmV4dEZyYW1lLmNyb3VjaCAhPT0gdGhpcy5hY3Rvck9iamVjdC5jcm91Y2hpbmcpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMubW92ZUFjdGlvbnNOZXh0RnJhbWUuY3JvdWNoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNyb3VjaCgpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy51bkNyb3VjaCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuYWN0b3JPYmplY3QuY3JvdWNoaW5nID0gdGhpcy5tb3ZlQWN0aW9uc05leHRGcmFtZS5jcm91Y2g7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZW5kZXIoKSB7XHJcbiAgICAgICAgdGhpcy5tb2RlbC5yZW5kZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdXBkYXRlRmFjaW5nRnJvbVNlcnZlcihmYWNpbmdSaWdodDogYm9vbGVhbikge1xyXG4gICAgICAgIHRoaXMuZmFjaW5nUmlnaHQgPSBmYWNpbmdSaWdodDtcclxuICAgICAgICB0aGlzLm1vZGVsLmNoYW5nZUZhY2luZyhmYWNpbmdSaWdodCk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlKGVsYXBzZWRUaW1lOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZUFjdGlvbnMoZWxhcHNlZFRpbWUpO1xyXG4gICAgICAgIHRoaXMuYWN0b3JPYmplY3QudXBkYXRlKGVsYXBzZWRUaW1lLCB0aGlzLm1vdmVBY3Rpb25zTmV4dEZyYW1lLm1vdmVMZWZ0IHx8IHRoaXMubW92ZUFjdGlvbnNOZXh0RnJhbWUubW92ZVJpZ2h0KTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBDbGllbnRQbGF5ZXJBY3Rpb24ge1xyXG4gICAgdHlwZTogXCJjbGllbnRQbGF5ZXJBY3Rpb25cIjtcclxuICAgIHBsYXllcklkOiBudW1iZXI7XHJcbiAgICBhY3Rpb25UeXBlOiBQbGF5ZXJBY3Rpb25UeXBlO1xyXG4gICAgc3RhcnRpbmc6IGJvb2xlYW47XHJcbiAgICBwb3NpdGlvbjogVmVjdG9yO1xyXG4gICAgbW9tZW50dW06IFZlY3RvcjtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBDbGllbnRQbGF5ZXJDbGljayB7XHJcbiAgICB0eXBlOiBcImNsaWVudFBsYXllckNsaWNrXCI7XHJcbiAgICBwbGF5ZXJJZDogbnVtYmVyO1xyXG4gICAgbGVmdENsaWNrOiBib29sZWFuO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIENsaWVudFBsYXllckZhY2luZ1VwZGF0ZSB7XHJcbiAgICB0eXBlOiBcImNsaWVudFBsYXllckZhY2luZ1VwZGF0ZVwiO1xyXG4gICAgcGxheWVyaWQ6IG51bWJlcjtcclxuICAgIGZhY2luZ1JpZ2h0OiBib29sZWFuO1xyXG59XHJcbiIsImltcG9ydCB7IExpbmtlZExpc3QsIE5vZGUgfSBmcm9tIFwiLi4vLi4vLi4vLi4vbGlua2VkTGlzdFwiO1xyXG5pbXBvcnQgeyBTaXplIH0gZnJvbSBcIi4uLy4uLy4uLy4uL3NpemVcIjtcclxuaW1wb3J0IHsgVmVjdG9yIH0gZnJvbSBcIi4uLy4uLy4uLy4uL3ZlY3RvclwiO1xyXG5cclxuZXhwb3J0IHR5cGUgU2lkZVR5cGUgPSBcImVuZW15XCIgfCBcInNlbGZcIiB8IFwiYWxseVwiO1xyXG5jb25zdCBoZWFsdGhEaXZpZGVyV2lkdGg6IG51bWJlciA9IDIwO1xyXG5jb25zdCBoZWFsdGhCYXJEdXJhdGlvbjogbnVtYmVyID0gMC4xNTtcclxuXHJcbmV4cG9ydCBjbGFzcyBIZWFsdGhCYXJNb2RlbCB7XHJcbiAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgaGVhbHRoSGVpZ2h0OiBudW1iZXIgPSA1MDtcclxuICAgIHByb3RlY3RlZCByZWFkb25seSBoZWFsdGhDb2xvcjogc3RyaW5nO1xyXG4gICAgcHJvdGVjdGVkIHJlYWRvbmx5IGRhbWFnZUVmZmVjdENvbG9yOiBzdHJpbmc7XHJcbiAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgaGVhbEVmZmVjdENvbG9yOiBzdHJpbmc7XHJcblxyXG4gICAgcHJvdGVjdGVkIGRhbWFnZUVmZmVjdEJhcnM6IExpbmtlZExpc3Q8eyB0aW1lcjogbnVtYmVyOyBwb3NpdGlvbjogbnVtYmVyOyB3aWR0aDogbnVtYmVyOyBoZWlnaHQ6IG51bWJlciB9PiA9IG5ldyBMaW5rZWRMaXN0KCk7XHJcbiAgICBwcm90ZWN0ZWQgaGVhbEVmZmVjdEJhcnM6IExpbmtlZExpc3Q8eyB0aW1lcjogbnVtYmVyOyBwb3NpdGlvbjogbnVtYmVyOyB3aWR0aDogbnVtYmVyOyBoZWlnaHQ6IG51bWJlciB9PiA9IG5ldyBMaW5rZWRMaXN0KCk7XHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgcHJvdGVjdGVkIGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELFxyXG4gICAgICAgIHByb3RlY3RlZCByZWFkb25seSBwb3NpdGlvbjogVmVjdG9yLFxyXG4gICAgICAgIHByb3RlY3RlZCByZWFkb25seSBoZWFsdGhJbmZvOiB7IGhlYWx0aDogbnVtYmVyOyBtYXhIZWFsdGg6IG51bWJlciB9LFxyXG4gICAgICAgIHByb3RlY3RlZCByZWFkb25seSBoZWFsdGhCYXJTaXplOiBTaXplLFxyXG4gICAgICAgIGhlYWx0aEJhclR5cGU6IFNpZGVUeXBlLFxyXG4gICAgKSB7XHJcbiAgICAgICAgc3dpdGNoIChoZWFsdGhCYXJUeXBlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgXCJlbmVteVwiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5oZWFsdGhDb2xvciA9IFwicmVkXCI7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRhbWFnZUVmZmVjdENvbG9yID0gXCJ3aGl0ZVwiO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5oZWFsRWZmZWN0Q29sb3IgPSBcInJlZFwiO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJhbGx5XCI6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmhlYWx0aENvbG9yID0gXCJ3aGl0ZVwiO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kYW1hZ2VFZmZlY3RDb2xvciA9IFwicmVkXCI7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmhlYWxFZmZlY3RDb2xvciA9IFwiZ3JlZW5cIjtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwic2VsZlwiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5oZWFsdGhDb2xvciA9IFwiIzAwYzc0NlwiO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kYW1hZ2VFZmZlY3RDb2xvciA9IFwid2hpdGVcIjtcclxuICAgICAgICAgICAgICAgIHRoaXMuaGVhbEVmZmVjdENvbG9yID0gXCIjMDBjNzQ2XCI7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcInVua25vd24gaGVhbHRoIGJhciB0eXBlIGluIG1vZGVsIGNvbnN0cnVjdG9yXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVuZGVySGVhbHRoKCkge1xyXG4gICAgICAgIHRoaXMuY3R4LnRyYW5zZm9ybSgxLCAwLCAtMC4xNSwgMSwgdGhpcy5wb3NpdGlvbi54ICsgMSwgdGhpcy5wb3NpdGlvbi55IC0gdGhpcy5oZWFsdGhIZWlnaHQpO1xyXG4gICAgICAgIHRoaXMuY3R4LmZpbGxTdHlsZSA9IFwicmdiYSgwLCAwLCAwLCAwLjU2MilcIjtcclxuICAgICAgICB0aGlzLmN0eC5maWxsUmVjdCh0aGlzLmhlYWx0aEJhclNpemUud2lkdGggLyAtMiAtIDEsIDAsIHRoaXMuaGVhbHRoQmFyU2l6ZS53aWR0aCArIDIsIHRoaXMuaGVhbHRoQmFyU2l6ZS5oZWlnaHQgKyAyKTtcclxuXHJcbiAgICAgICAgdGhpcy5jdHguZmlsbFN0eWxlID0gdGhpcy5oZWFsdGhDb2xvcjtcclxuICAgICAgICB0aGlzLmN0eC5maWxsUmVjdCh0aGlzLmhlYWx0aEJhclNpemUud2lkdGggLyAtMiwgMSwgdGhpcy5oZWFsdGhCYXJTaXplLndpZHRoICogKHRoaXMuaGVhbHRoSW5mby5oZWFsdGggLyB0aGlzLmhlYWx0aEluZm8ubWF4SGVhbHRoKSwgNik7XHJcblxyXG4gICAgICAgIHRoaXMuY3R4LmZpbGxTdHlsZSA9IFwicmdiYSgwLCAwLCAwLCAwLjU2MilcIjtcclxuICAgICAgICBmb3IgKGxldCBpOiBudW1iZXIgPSAxOyBpIDwgdGhpcy5oZWFsdGhJbmZvLmhlYWx0aCAvIGhlYWx0aERpdmlkZXJXaWR0aDsgaSArPSAxKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY3R4LmZpbGxSZWN0KC0yNSArICg0OCAqIGhlYWx0aERpdmlkZXJXaWR0aCAqIGkpIC8gdGhpcy5oZWFsdGhJbmZvLm1heEhlYWx0aCwgMSwgMiwgNik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIXRoaXMuZGFtYWdlRWZmZWN0QmFycy5pZkVtcHR5KCkpIHtcclxuICAgICAgICAgICAgdGhpcy5jdHguZmlsbFN0eWxlID0gdGhpcy5kYW1hZ2VFZmZlY3RDb2xvcjtcclxuICAgICAgICAgICAgdmFyIG5vZGU6IE5vZGU8eyB0aW1lcjogbnVtYmVyOyBwb3NpdGlvbjogbnVtYmVyOyB3aWR0aDogbnVtYmVyOyBoZWlnaHQ6IG51bWJlciB9PiB8IG51bGwgPSB0aGlzLmRhbWFnZUVmZmVjdEJhcnMuaGVhZDtcclxuICAgICAgICAgICAgd2hpbGUgKG5vZGUgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3R4Lmdsb2JhbEFscGhhID0gMSAtIChoZWFsdGhCYXJEdXJhdGlvbiAtIG5vZGUuZGF0YS50aW1lcikgKiAzO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jdHguZmlsbFJlY3QoLTI1ICsgbm9kZS5kYXRhLnBvc2l0aW9uLCA0IC0gbm9kZS5kYXRhLmhlaWdodCAvIDIsIG5vZGUuZGF0YS53aWR0aCwgbm9kZS5kYXRhLmhlaWdodCk7XHJcbiAgICAgICAgICAgICAgICBub2RlID0gbm9kZS5uZXh0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuY3R4Lmdsb2JhbEFscGhhID0gMTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5oZWFsRWZmZWN0QmFycy5pZkVtcHR5KCkpIHtcclxuICAgICAgICAgICAgdGhpcy5jdHguZmlsbFN0eWxlID0gdGhpcy5oZWFsRWZmZWN0Q29sb3I7XHJcbiAgICAgICAgICAgIHZhciBub2RlOiBOb2RlPHsgdGltZXI6IG51bWJlcjsgcG9zaXRpb246IG51bWJlcjsgd2lkdGg6IG51bWJlcjsgaGVpZ2h0OiBudW1iZXIgfT4gfCBudWxsID0gdGhpcy5oZWFsRWZmZWN0QmFycy5oZWFkO1xyXG4gICAgICAgICAgICB3aGlsZSAobm9kZSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jdHguZ2xvYmFsQWxwaGEgPSAwLjUgKyAoaGVhbHRoQmFyRHVyYXRpb24gLSBub2RlLmRhdGEudGltZXIpICogNDtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3R4LmZpbGxSZWN0KC0yNSArIG5vZGUuZGF0YS5wb3NpdGlvbiwgNCAtIG5vZGUuZGF0YS5oZWlnaHQgLyAyLCBub2RlLmRhdGEud2lkdGgsIG5vZGUuZGF0YS5oZWlnaHQpO1xyXG4gICAgICAgICAgICAgICAgbm9kZSA9IG5vZGUubmV4dDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmN0eC5nbG9iYWxBbHBoYSA9IDE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmN0eC50cmFuc2Zvcm0oMSwgMCwgMC4xNSwgMSwgMCwgMCk7IC8vIHRoZSBza2V3IGhhZCB0byBiZSBkZS10cmFuc2Zvcm1lZCBwcm9jZWR1cmFsbHkgb3IgZWxzZSB0aGUgbWFpbiBjYW52YXMgYnVnZ2VkXHJcbiAgICAgICAgdGhpcy5jdHgudHJhbnNmb3JtKDEsIDAsIDAsIDEsIC10aGlzLnBvc2l0aW9uLnggLSAxLCAtdGhpcy5wb3NpdGlvbi55ICsgdGhpcy5oZWFsdGhIZWlnaHQpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZWdpc3RlckRhbWFnZShxdWFudGl0eTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5kYW1hZ2VFZmZlY3RCYXJzLmluc2VydEF0RW5kKHtcclxuICAgICAgICAgICAgdGltZXI6IGhlYWx0aEJhckR1cmF0aW9uLFxyXG4gICAgICAgICAgICBwb3NpdGlvbjogKHRoaXMuaGVhbHRoSW5mby5oZWFsdGggLyB0aGlzLmhlYWx0aEluZm8ubWF4SGVhbHRoKSAqIDQ4LFxyXG4gICAgICAgICAgICB3aWR0aDogKHF1YW50aXR5IC8gdGhpcy5oZWFsdGhJbmZvLm1heEhlYWx0aCkgKiA0OCArIDEsXHJcbiAgICAgICAgICAgIGhlaWdodDogOCxcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVnaXN0ZXJIZWFsKHF1YW50aXR5OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLmhlYWxFZmZlY3RCYXJzLmluc2VydEF0RW5kKHtcclxuICAgICAgICAgICAgdGltZXI6IGhlYWx0aEJhckR1cmF0aW9uLFxyXG4gICAgICAgICAgICBwb3NpdGlvbjogKHRoaXMuaGVhbHRoSW5mby5oZWFsdGggLyB0aGlzLmhlYWx0aEluZm8ubWF4SGVhbHRoKSAqIDQ4LFxyXG4gICAgICAgICAgICB3aWR0aDogKHF1YW50aXR5IC8gdGhpcy5oZWFsdGhJbmZvLm1heEhlYWx0aCkgKiA0OCArIDEsXHJcbiAgICAgICAgICAgIGhlaWdodDogMzAsXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHVwZGF0ZShlbGFwc2VkVGltZTogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmRhbWFnZUVmZmVjdEJhcnMuaWZFbXB0eSgpKSB7XHJcbiAgICAgICAgICAgIHZhciBub2RlOiBOb2RlPHsgdGltZXI6IG51bWJlcjsgcG9zaXRpb246IG51bWJlcjsgd2lkdGg6IG51bWJlcjsgaGVpZ2h0OiBudW1iZXIgfT4gfCBudWxsID0gdGhpcy5kYW1hZ2VFZmZlY3RCYXJzLmhlYWQ7XHJcbiAgICAgICAgICAgIHdoaWxlIChub2RlICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBub2RlLmRhdGEudGltZXIgLT0gZWxhcHNlZFRpbWU7XHJcbiAgICAgICAgICAgICAgICBub2RlLmRhdGEuaGVpZ2h0ICs9IGVsYXBzZWRUaW1lICogMTAwO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChub2RlLmRhdGEudGltZXIgPD0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGFtYWdlRWZmZWN0QmFycy5kZWxldGVGaXJzdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIG5vZGUgPSB0aGlzLmRhbWFnZUVmZmVjdEJhcnMuaGVhZDtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbm9kZSA9IG5vZGUubmV4dDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLmhlYWxFZmZlY3RCYXJzLmlmRW1wdHkoKSkge1xyXG4gICAgICAgICAgICB2YXIgbm9kZTogTm9kZTx7IHRpbWVyOiBudW1iZXI7IHBvc2l0aW9uOiBudW1iZXI7IHdpZHRoOiBudW1iZXI7IGhlaWdodDogbnVtYmVyIH0+IHwgbnVsbCA9IHRoaXMuaGVhbEVmZmVjdEJhcnMuaGVhZDtcclxuICAgICAgICAgICAgd2hpbGUgKG5vZGUgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIG5vZGUuZGF0YS50aW1lciAtPSBlbGFwc2VkVGltZTtcclxuICAgICAgICAgICAgICAgIG5vZGUuZGF0YS5oZWlnaHQgLT0gZWxhcHNlZFRpbWUgKiAxMDA7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKG5vZGUuZGF0YS50aW1lciA8PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5oZWFsRWZmZWN0QmFycy5kZWxldGVGaXJzdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIG5vZGUgPSB0aGlzLmhlYWxFZmZlY3RCYXJzLmhlYWQ7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIG5vZGUgPSBub2RlLm5leHQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgVmVjdG9yIH0gZnJvbSBcIi4uLy4uLy4uLy4uL3ZlY3RvclwiO1xyXG5pbXBvcnQgeyBBbmltYXRpb25JbmZvIH0gZnJvbSBcIi4vbW9kZWxcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBKb2ludCB7XHJcbiAgICBwcm90ZWN0ZWQgaW1nUm90YXRpb25UZW1wOiBudW1iZXIgPSAwO1xyXG4gICAgcHJvdGVjdGVkIGxvY2FsUG9zWFRlbXA6IG51bWJlciA9IDA7XHJcbiAgICBwcm90ZWN0ZWQgbG9jYWxQb3NZVGVtcDogbnVtYmVyID0gMDtcclxuICAgIHByb3RlY3RlZCBhbmdsZUZyb21UZW1wOiBudW1iZXIgPSAwO1xyXG4gICAgcHJvdGVjdGVkIGFuZ2xlVG9UZW1wOiBudW1iZXIgPSAwO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHByb3RlY3RlZCBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCxcclxuICAgICAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgaW1nOiBIVE1MSW1hZ2VFbGVtZW50LFxyXG4gICAgICAgIHByb3RlY3RlZCByZWFkb25seSBpbWdQb3M6IFZlY3RvcixcclxuICAgICAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgaW1nU2NhbGU6IG51bWJlcixcclxuICAgICAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgaW1nUm90YXRpb246IG51bWJlcixcclxuICAgICAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgbG9jYWxQb3M6IFZlY3RvcixcclxuICAgICAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgYW5nbGVGcm9tOiBudW1iZXIsXHJcbiAgICAgICAgcHJvdGVjdGVkIHJlYWRvbmx5IGFuZ2xlVG86IG51bWJlcixcclxuICAgICkge31cclxuXHJcbiAgICBwdWJsaWMgcmVuZGVyKHRpbWVQZXJjZW50OiBudW1iZXIsIGFuaW1hdGlvbkluZm86IEFuaW1hdGlvbkluZm8pIHtcclxuICAgICAgICBpZiAoYW5pbWF0aW9uSW5mby5hbmdsZUZyb21FcXVhdGlvbikgdGhpcy5hbmdsZUZyb21UZW1wID0gcmVhZEFycmF5Rm9yWShhbmltYXRpb25JbmZvLmFuZ2xlRnJvbUVxdWF0aW9uLCB0aW1lUGVyY2VudCk7XHJcbiAgICAgICAgdGhpcy5jdHgucm90YXRlKHRoaXMuYW5nbGVGcm9tICsgdGhpcy5hbmdsZUZyb21UZW1wKTtcclxuXHJcbiAgICAgICAgaWYgKGFuaW1hdGlvbkluZm8ubG9jYWxQb3NYRXF1YXRpb24pIHRoaXMubG9jYWxQb3NYVGVtcCA9IHJlYWRBcnJheUZvclkoYW5pbWF0aW9uSW5mby5sb2NhbFBvc1hFcXVhdGlvbiwgdGltZVBlcmNlbnQpO1xyXG4gICAgICAgIGlmIChhbmltYXRpb25JbmZvLmxvY2FsUG9zWUVxdWF0aW9uKSB0aGlzLmxvY2FsUG9zWVRlbXAgPSByZWFkQXJyYXlGb3JZKGFuaW1hdGlvbkluZm8ubG9jYWxQb3NZRXF1YXRpb24sIHRpbWVQZXJjZW50KTtcclxuICAgICAgICB0aGlzLmN0eC50cmFuc2xhdGUodGhpcy5sb2NhbFBvcy54ICsgdGhpcy5sb2NhbFBvc1hUZW1wLCB0aGlzLmxvY2FsUG9zLnkgKyB0aGlzLmxvY2FsUG9zWVRlbXApO1xyXG5cclxuICAgICAgICBpZiAoYW5pbWF0aW9uSW5mby5hbmdsZVRvRXF1YXRpb24pIHRoaXMuYW5nbGVUb1RlbXAgPSByZWFkQXJyYXlGb3JZKGFuaW1hdGlvbkluZm8uYW5nbGVUb0VxdWF0aW9uLCB0aW1lUGVyY2VudCk7XHJcbiAgICAgICAgdGhpcy5jdHgucm90YXRlKHRoaXMuYW5nbGVUbyArIHRoaXMuYW5nbGVUb1RlbXApO1xyXG5cclxuICAgICAgICBpZiAoYW5pbWF0aW9uSW5mby5pbWdSb3RhdGlvbkVxdWF0aW9uKSB0aGlzLmltZ1JvdGF0aW9uVGVtcCA9IHJlYWRBcnJheUZvclkoYW5pbWF0aW9uSW5mby5pbWdSb3RhdGlvbkVxdWF0aW9uLCB0aW1lUGVyY2VudCk7XHJcbiAgICAgICAgdGhpcy5jdHgucm90YXRlKHRoaXMuaW1nUm90YXRpb24gKyB0aGlzLmltZ1JvdGF0aW9uVGVtcCk7XHJcblxyXG4gICAgICAgIHRoaXMuY3R4LnNjYWxlKHRoaXMuaW1nU2NhbGUsIHRoaXMuaW1nU2NhbGUpO1xyXG4gICAgICAgIHRoaXMuY3R4LmRyYXdJbWFnZSh0aGlzLmltZywgdGhpcy5pbWdQb3MueCwgdGhpcy5pbWdQb3MueSk7XHJcbiAgICAgICAgdGhpcy5jdHguc2NhbGUoMSAvIHRoaXMuaW1nU2NhbGUsIDEgLyB0aGlzLmltZ1NjYWxlKTtcclxuXHJcbiAgICAgICAgdGhpcy5jdHgucm90YXRlKC10aGlzLmltZ1JvdGF0aW9uIC0gdGhpcy5pbWdSb3RhdGlvblRlbXApO1xyXG5cclxuICAgICAgICB0aGlzLmN0eC5yb3RhdGUoLXRoaXMuYW5nbGVUbyAtIHRoaXMuYW5nbGVUb1RlbXApO1xyXG5cclxuICAgICAgICB0aGlzLmN0eC50cmFuc2xhdGUoLXRoaXMubG9jYWxQb3MueCAtIHRoaXMubG9jYWxQb3NYVGVtcCwgLXRoaXMubG9jYWxQb3MueSAtIHRoaXMubG9jYWxQb3NZVGVtcCk7XHJcblxyXG4gICAgICAgIHRoaXMuY3R4LnJvdGF0ZSgtdGhpcy5hbmdsZUZyb20gLSB0aGlzLmFuZ2xlRnJvbVRlbXApO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB1cGRhdGUoZWxhcHNlZFRpbWU6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuaW1nUm90YXRpb25UZW1wICo9IDEgLSBlbGFwc2VkVGltZSAqIDU7XHJcbiAgICAgICAgdGhpcy5sb2NhbFBvc1hUZW1wICo9IDEgLSBlbGFwc2VkVGltZSAqIDU7XHJcbiAgICAgICAgdGhpcy5sb2NhbFBvc1lUZW1wICo9IDEgLSBlbGFwc2VkVGltZSAqIDU7XHJcbiAgICAgICAgdGhpcy5hbmdsZUZyb21UZW1wICo9IDEgLSBlbGFwc2VkVGltZSAqIDU7XHJcbiAgICAgICAgdGhpcy5hbmdsZVRvVGVtcCAqPSAxIC0gZWxhcHNlZFRpbWUgKiA1O1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiByZWFkQXJyYXlGb3JZKGRhdGE6IG51bWJlcltdW10gfCB1bmRlZmluZWQsIHRpbWVQZXJjZW50OiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgaWYgKGRhdGEgPT09IHVuZGVmaW5lZCkgcmV0dXJuIDA7XHJcbiAgICBsZXQgaW5kZXg6IG51bWJlciA9IDA7XHJcbiAgICBsZXQgYXJyYXlMZW5ndGg6IG51bWJlciA9IGRhdGEubGVuZ3RoIC0gMTtcclxuICAgIHdoaWxlICh0cnVlKSB7XHJcbiAgICAgICAgaWYgKGluZGV4ID09PSBhcnJheUxlbmd0aCkgcmV0dXJuIGRhdGFbaW5kZXhdWzFdO1xyXG4gICAgICAgIGVsc2UgaWYgKGRhdGFbaW5kZXggKyAxXVswXSA+PSB0aW1lUGVyY2VudCkgYnJlYWs7XHJcbiAgICAgICAgaW5kZXgrKztcclxuICAgIH1cclxuICAgIGxldCBwZXJjZW50OiBudW1iZXIgPSAodGltZVBlcmNlbnQgLSBkYXRhW2luZGV4XVswXSkgLyAoZGF0YVtpbmRleCArIDFdWzBdIC0gZGF0YVtpbmRleF1bMF0pO1xyXG4gICAgbGV0IGtleURpZmZlcmVuY2U6IG51bWJlciA9IGRhdGFbaW5kZXggKyAxXVsxXSAtIGRhdGFbaW5kZXhdWzFdO1xyXG4gICAgcmV0dXJuIGRhdGFbaW5kZXhdWzFdICsgcGVyY2VudCAqIGtleURpZmZlcmVuY2U7XHJcbn1cclxuIiwiaW1wb3J0IHsgR2FtZSB9IGZyb20gXCIuLi8uLi8uLi8uLi9jbGllbnQvZ2FtZVwiO1xyXG5pbXBvcnQgeyBWZWN0b3IgfSBmcm9tIFwiLi4vLi4vLi4vLi4vdmVjdG9yXCI7XHJcbmltcG9ydCB7IENsaWVudFBsYXllciB9IGZyb20gXCIuLi9jbGllbnRQbGF5ZXIvY2xpZW50UGxheWVyXCI7XHJcbmltcG9ydCB7IEhlYWx0aEJhck1vZGVsLCBTaWRlVHlwZSB9IGZyb20gXCIuL2hlYWx0aEJhclwiO1xyXG5pbXBvcnQgeyBKb2ludCB9IGZyb20gXCIuL2pvaW50XCI7XHJcblxyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgTW9kZWwge1xyXG4gICAgcHJvdGVjdGVkIHJlYWRvbmx5IGhlYWx0aEJhcjogSGVhbHRoQmFyTW9kZWw7XHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgcHJvdGVjdGVkIHJlYWRvbmx5IGdhbWU6IEdhbWUsXHJcbiAgICAgICAgcHJvdGVjdGVkIHJlYWRvbmx5IHBsYXllcjogQ2xpZW50UGxheWVyLFxyXG4gICAgICAgIHByb3RlY3RlZCBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCxcclxuICAgICAgICBwcm90ZWN0ZWQgcG9zaXRpb246IFZlY3RvcixcclxuICAgICAgICBoZWFsdGhCYXJUeXBlOiBTaWRlVHlwZSxcclxuICAgICkge1xyXG4gICAgICAgIHRoaXMuaGVhbHRoQmFyID0gbmV3IEhlYWx0aEJhck1vZGVsKHRoaXMuY3R4LCB0aGlzLnBvc2l0aW9uLCB0aGlzLnBsYXllci5nZXRIZWFsdGhJbmZvKCksIHsgd2lkdGg6IDUwLCBoZWlnaHQ6IDYgfSwgaGVhbHRoQmFyVHlwZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlZ2lzdGVyRGFtYWdlKHF1YW50aXR5OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLmhlYWx0aEJhci5yZWdpc3RlckRhbWFnZShxdWFudGl0eSk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgcmVnaXN0ZXJIZWFsKHF1YW50aXR5OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLmhlYWx0aEJhci5yZWdpc3RlckhlYWwocXVhbnRpdHkpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhYnN0cmFjdCByZW5kZXIoKTogdm9pZDtcclxuICAgIHB1YmxpYyByZW5kZXJIZWFsdGgoKSB7XHJcbiAgICAgICAgdGhpcy5oZWFsdGhCYXIucmVuZGVySGVhbHRoKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHVwZGF0ZShlbGFwc2VkVGltZTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5oZWFsdGhCYXIudXBkYXRlKGVsYXBzZWRUaW1lKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBNb2RlbEFuaW1hdGlvbiB7XHJcbiAgICB0b3RhbFRpbWU6IG51bWJlcjtcclxuICAgIGxvb3A6IGJvb2xlYW47XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgQW5pbWF0aW9uSW5mbyB7XHJcbiAgICBpbWdSb3RhdGlvbkVxdWF0aW9uOiBudW1iZXJbXVtdIHwgdW5kZWZpbmVkO1xyXG4gICAgbG9jYWxQb3NYRXF1YXRpb246IG51bWJlcltdW10gfCB1bmRlZmluZWQ7XHJcbiAgICBsb2NhbFBvc1lFcXVhdGlvbjogbnVtYmVyW11bXSB8IHVuZGVmaW5lZDtcclxuICAgIGFuZ2xlRnJvbUVxdWF0aW9uOiBudW1iZXJbXVtdIHwgdW5kZWZpbmVkO1xyXG4gICAgYW5nbGVUb0VxdWF0aW9uOiBudW1iZXJbXVtdIHwgdW5kZWZpbmVkO1xyXG59XHJcbiIsImltcG9ydCB7IEdhbWUgfSBmcm9tIFwiLi4vLi4vLi4vLi4vLi4vY2xpZW50L2dhbWVcIjtcclxuaW1wb3J0IHsgYXNzZXRNYW5hZ2VyIH0gZnJvbSBcIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9nYW1lUmVuZGVyL2Fzc2V0bWFuYWdlclwiO1xyXG5pbXBvcnQgeyBmaW5kQW5nbGUgfSBmcm9tIFwiLi4vLi4vLi4vLi4vLi4vZmluZEFuZ2xlXCI7XHJcbmltcG9ydCB7IFNpemUgfSBmcm9tIFwiLi4vLi4vLi4vLi4vLi4vc2l6ZVwiO1xyXG5pbXBvcnQgeyBWZWN0b3IgfSBmcm9tIFwiLi4vLi4vLi4vLi4vLi4vdmVjdG9yXCI7XHJcbmltcG9ydCB7IERhZ2dlcnNTdGFiSGl0U2hhcGUgfSBmcm9tIFwiLi4vLi4vLi4vLi4vY2xpZW50Q29udHJvbGxlcnMvY29udHJvbGxlcnMvYWJpbGl0aWVzL2RhZ2dlcnNBYmlsaXRpZXMvZGFnZ2Vyc1N0YWJBYmlsaXR5XCI7XHJcbmltcG9ydCB7IFN3b3JkU2xhc2hIaXRTaGFwZSB9IGZyb20gXCIuLi8uLi8uLi8uLi9jbGllbnRDb250cm9sbGVycy9jb250cm9sbGVycy9hYmlsaXRpZXMvc3dvcmRBYmlsaXRpZXMvc3dvcmRTbGFzaEFiaWxpdHlcIjtcclxuaW1wb3J0IHsgcmVuZGVyU2hhcGUgfSBmcm9tIFwiLi4vLi4vY2xpZW50QWN0b3JcIjtcclxuaW1wb3J0IHsgQ2xpZW50RGFnZ2VycyB9IGZyb20gXCIuLi8uLi9jbGllbnRQbGF5ZXIvY2xpZW50Q2xhc3Nlcy9jbGllbnREYWdnZXJzXCI7XHJcbmltcG9ydCB7IENsaWVudFBsYXllciB9IGZyb20gXCIuLi8uLi9jbGllbnRQbGF5ZXIvY2xpZW50UGxheWVyXCI7XHJcbmltcG9ydCB7IFNpZGVUeXBlIH0gZnJvbSBcIi4uL2hlYWx0aEJhclwiO1xyXG5pbXBvcnQgeyBKb2ludCB9IGZyb20gXCIuLi9qb2ludFwiO1xyXG5pbXBvcnQgeyBBbmltYXRpb25JbmZvLCBNb2RlbEFuaW1hdGlvbiB9IGZyb20gXCIuLi9tb2RlbFwiO1xyXG5pbXBvcnQgeyBQbGF5ZXJNb2RlbCB9IGZyb20gXCIuL3BsYXllck1vZGVsXCI7XHJcblxyXG50eXBlIERhZ2dlcnNQbGF5ZXJNb2RlbEpvaW50ID0gXCJwbGF5ZXJEYWdnZXJcIjtcclxuZXhwb3J0IHR5cGUgRGFnZ2Vyc1BsYXllckFuaW1hdGlvbk5hbWUgPSBcInN0YW5kXCIgfCBcInN0YWJcIiB8IFwibHVuZ2VcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBEYWdnZXJzUGxheWVyTW9kZWwgZXh0ZW5kcyBQbGF5ZXJNb2RlbCB7XHJcbiAgICBwcm90ZWN0ZWQgYW5pbWF0aW9uU3RhdGVBbmltYXRpb246IERhZ2dlcnNNb2RlbEFuaW1hdGlvbiA9IERhZ2dlcnNQbGF5ZXJBbmltYXRpb25EYXRhW1wic3RhbmRcIl07XHJcbiAgICBwcm90ZWN0ZWQgYW5pbWF0aW9uU3RhdGU6IERhZ2dlcnNQbGF5ZXJBbmltYXRpb25OYW1lID0gXCJzdGFuZFwiO1xyXG4gICAgcHJvdGVjdGVkIGRhZ2dlckpvaW50OiBKb2ludDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihnYW1lOiBHYW1lLCBwbGF5ZXI6IENsaWVudERhZ2dlcnMsIGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELCBwb3NpdGlvbjogVmVjdG9yLCBoZWFsdGhCYXJUeXBlOiBTaWRlVHlwZSwgcGxheWVyQ29sb3I6IHN0cmluZywgc2l6ZTogU2l6ZSkge1xyXG4gICAgICAgIHN1cGVyKGdhbWUsIHBsYXllciwgY3R4LCBwb3NpdGlvbiwgaGVhbHRoQmFyVHlwZSwgcGxheWVyQ29sb3IsIHNpemUpO1xyXG4gICAgICAgIHRoaXMuZGFnZ2VySm9pbnQgPSBuZXcgSm9pbnQodGhpcy5jdHgsIGFzc2V0TWFuYWdlci5pbWFnZXNbXCJkYWdnZXIyMVwiXSwgeyB4OiAtMjAwLCB5OiAtNzAwIH0sIDAuMDksIDAsIHsgeDogLTIwLCB5OiAyMCB9LCAwLCAtMC41KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVuZGVyV2VhcG9uKCkge1xyXG4gICAgICAgIHRoaXMuZGFnZ2VySm9pbnQucmVuZGVyKHRoaXMuYW5pbWF0aW9uVGltZSAvIHRoaXMuYW5pbWF0aW9uU3RhdGVBbmltYXRpb24udG90YWxUaW1lLCB0aGlzLmFuaW1hdGlvblN0YXRlQW5pbWF0aW9uLmpvaW50QW5pbWF0aW9uSW5mb1tcInBsYXllckRhZ2dlclwiXSk7XHJcblxyXG4gICAgICAgIHRoaXMuY3R4LnNjYWxlKC0xLCAxKTtcclxuICAgICAgICAvL3JlbmRlclNoYXBlKHRoaXMuY3R4LCBEYWdnZXJzU3RhYkhpdFNoYXBlKTtcclxuICAgICAgICB0aGlzLmN0eC5zY2FsZSgtMSwgMSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHVwZGF0ZShlbGFwc2VkVGltZTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5hbmltYXRpb25UaW1lICs9IGVsYXBzZWRUaW1lO1xyXG4gICAgICAgIGlmICh0aGlzLmFuaW1hdGlvblRpbWUgPj0gdGhpcy5hbmltYXRpb25TdGF0ZUFuaW1hdGlvbi50b3RhbFRpbWUpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuYW5pbWF0aW9uU3RhdGVBbmltYXRpb24ubG9vcCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hbmltYXRpb25UaW1lID0gMDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0QW5pbWF0aW9uKFwic3RhbmRcIiwgMCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZGFnZ2VySm9pbnQudXBkYXRlKGVsYXBzZWRUaW1lKTtcclxuICAgICAgICBzdXBlci51cGRhdGUoZWxhcHNlZFRpbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRBbmltYXRpb24oYW5pbWF0aW9uOiBEYWdnZXJzUGxheWVyQW5pbWF0aW9uTmFtZSwgYW5nbGU6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuYW5pbWF0aW9uVGltZSA9IDA7XHJcbiAgICAgICAgdGhpcy5jaGFuZ2VGYWNpbmdBbmdsZShhbmdsZSk7XHJcblxyXG4gICAgICAgIHRoaXMuYW5pbWF0aW9uU3RhdGUgPSBhbmltYXRpb247XHJcbiAgICAgICAgdGhpcy5hbmltYXRpb25TdGF0ZUFuaW1hdGlvbiA9IERhZ2dlcnNQbGF5ZXJBbmltYXRpb25EYXRhW2FuaW1hdGlvbl07XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgRGFnZ2Vyc01vZGVsQW5pbWF0aW9uIGV4dGVuZHMgTW9kZWxBbmltYXRpb24ge1xyXG4gICAgdG90YWxUaW1lOiBudW1iZXI7XHJcbiAgICBsb29wOiBib29sZWFuO1xyXG4gICAgam9pbnRBbmltYXRpb25JbmZvOiBSZWNvcmQ8RGFnZ2Vyc1BsYXllck1vZGVsSm9pbnQsIEFuaW1hdGlvbkluZm8+O1xyXG59XHJcblxyXG5jb25zdCBEYWdnZXJzUGxheWVyQW5pbWF0aW9uRGF0YTogUmVjb3JkPERhZ2dlcnNQbGF5ZXJBbmltYXRpb25OYW1lLCBEYWdnZXJzTW9kZWxBbmltYXRpb24+ID0ge1xyXG4gICAgc3RhbmQ6IHtcclxuICAgICAgICBsb29wOiB0cnVlLFxyXG4gICAgICAgIHRvdGFsVGltZTogMSxcclxuICAgICAgICBqb2ludEFuaW1hdGlvbkluZm86IHtcclxuICAgICAgICAgICAgcGxheWVyRGFnZ2VyOiB7XHJcbiAgICAgICAgICAgICAgICBpbWdSb3RhdGlvbkVxdWF0aW9uOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgICAgICBsb2NhbFBvc1hFcXVhdGlvbjogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICAgICAgbG9jYWxQb3NZRXF1YXRpb246IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgICAgIGFuZ2xlRnJvbUVxdWF0aW9uOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgICAgICBhbmdsZVRvRXF1YXRpb246IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgfSxcclxuICAgIHN0YWI6IHtcclxuICAgICAgICBsb29wOiBmYWxzZSxcclxuICAgICAgICB0b3RhbFRpbWU6IDAuNixcclxuICAgICAgICBqb2ludEFuaW1hdGlvbkluZm86IHtcclxuICAgICAgICAgICAgcGxheWVyRGFnZ2VyOiB7XHJcbiAgICAgICAgICAgICAgICBpbWdSb3RhdGlvbkVxdWF0aW9uOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgICAgICBsb2NhbFBvc1lFcXVhdGlvbjogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICAgICAgYW5nbGVGcm9tRXF1YXRpb246IFtcclxuICAgICAgICAgICAgICAgICAgICBbMCwgLTJdLFxyXG4gICAgICAgICAgICAgICAgICAgIFswLjEsIDAuM10sXHJcbiAgICAgICAgICAgICAgICAgICAgWzAuMiwgMS4zXSxcclxuICAgICAgICAgICAgICAgICAgICBbMC42LCAxLjddLFxyXG4gICAgICAgICAgICAgICAgICAgIFsxLCAyXSxcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICBhbmdsZVRvRXF1YXRpb246IFtcclxuICAgICAgICAgICAgICAgICAgICBbMCwgLTJdLFxyXG4gICAgICAgICAgICAgICAgICAgIFswLjEsIC0zXSxcclxuICAgICAgICAgICAgICAgICAgICBbMC4yLCAtMC44XSxcclxuICAgICAgICAgICAgICAgICAgICBbMC42LCAtMC42XSxcclxuICAgICAgICAgICAgICAgICAgICBbMSwgLTAuNV0sXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgbG9jYWxQb3NYRXF1YXRpb246IFtcclxuICAgICAgICAgICAgICAgICAgICBbMCwgMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgWzAuMSwgLTEwXSxcclxuICAgICAgICAgICAgICAgICAgICBbMC4xNSwgLTMwXSxcclxuICAgICAgICAgICAgICAgICAgICBbMC4yLCAwXSxcclxuICAgICAgICAgICAgICAgICAgICBbMSwgMTVdLFxyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgfSxcclxuICAgIGx1bmdlOiB7XHJcbiAgICAgICAgbG9vcDogZmFsc2UsXHJcbiAgICAgICAgdG90YWxUaW1lOiAwLjMsXHJcbiAgICAgICAgam9pbnRBbmltYXRpb25JbmZvOiB7XHJcbiAgICAgICAgICAgIHBsYXllckRhZ2dlcjoge1xyXG4gICAgICAgICAgICAgICAgaW1nUm90YXRpb25FcXVhdGlvbjogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICAgICAgbG9jYWxQb3NZRXF1YXRpb246IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgICAgIGFuZ2xlRnJvbUVxdWF0aW9uOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgICAgICBhbmdsZVRvRXF1YXRpb246IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgICAgIGxvY2FsUG9zWEVxdWF0aW9uOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgIH0sXHJcbn07XHJcbiIsImltcG9ydCB7IEdhbWUgfSBmcm9tIFwiLi4vLi4vLi4vLi4vLi4vY2xpZW50L2dhbWVcIjtcclxuaW1wb3J0IHsgYXNzZXRNYW5hZ2VyIH0gZnJvbSBcIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9nYW1lUmVuZGVyL2Fzc2V0bWFuYWdlclwiO1xyXG5pbXBvcnQgeyBmaW5kQW5nbGUgfSBmcm9tIFwiLi4vLi4vLi4vLi4vLi4vZmluZEFuZ2xlXCI7XHJcbmltcG9ydCB7IFNpemUgfSBmcm9tIFwiLi4vLi4vLi4vLi4vLi4vc2l6ZVwiO1xyXG5pbXBvcnQgeyBWZWN0b3IgfSBmcm9tIFwiLi4vLi4vLi4vLi4vLi4vdmVjdG9yXCI7XHJcbmltcG9ydCB7IHJlbmRlclNoYXBlIH0gZnJvbSBcIi4uLy4uL2NsaWVudEFjdG9yXCI7XHJcbmltcG9ydCB7IENsaWVudEhhbW1lciB9IGZyb20gXCIuLi8uLi9jbGllbnRQbGF5ZXIvY2xpZW50Q2xhc3Nlcy9jbGllbnRIYW1tZXJcIjtcclxuaW1wb3J0IHsgQ2xpZW50UGxheWVyIH0gZnJvbSBcIi4uLy4uL2NsaWVudFBsYXllci9jbGllbnRQbGF5ZXJcIjtcclxuaW1wb3J0IHsgU2lkZVR5cGUgfSBmcm9tIFwiLi4vaGVhbHRoQmFyXCI7XHJcbmltcG9ydCB7IEpvaW50IH0gZnJvbSBcIi4uL2pvaW50XCI7XHJcbmltcG9ydCB7IEFuaW1hdGlvbkluZm8sIE1vZGVsQW5pbWF0aW9uIH0gZnJvbSBcIi4uL21vZGVsXCI7XHJcbmltcG9ydCB7IFBsYXllck1vZGVsIH0gZnJvbSBcIi4vcGxheWVyTW9kZWxcIjtcclxuXHJcbnR5cGUgSGFtbWVyUGxheWVyTW9kZWxKb2ludCA9IFwicGxheWVySGFtbWVyXCI7XHJcbmV4cG9ydCB0eXBlIEhhbW1lclBsYXllckFuaW1hdGlvbk5hbWUgPSBcInN0YW5kXCIgfCBcInN3aW5nMVwiIHwgXCJzd2luZzJcIiB8IFwicG91bmRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBIYW1tZXJQbGF5ZXJNb2RlbCBleHRlbmRzIFBsYXllck1vZGVsIHtcclxuICAgIHByb3RlY3RlZCBhbmltYXRpb25TdGF0ZUFuaW1hdGlvbjogSGFtbWVyTW9kZWxBbmltYXRpb24gPSBIYW1tZXJQbGF5ZXJBbmltYXRpb25EYXRhW1wic3RhbmRcIl07XHJcbiAgICBwcm90ZWN0ZWQgYW5pbWF0aW9uU3RhdGU6IEhhbW1lclBsYXllckFuaW1hdGlvbk5hbWUgPSBcInN0YW5kXCI7XHJcbiAgICBwcm90ZWN0ZWQgaGFtbWVySm9pbnQ6IEpvaW50O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGdhbWU6IEdhbWUsIHBsYXllcjogQ2xpZW50SGFtbWVyLCBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCwgcG9zaXRpb246IFZlY3RvciwgaGVhbHRoQmFyVHlwZTogU2lkZVR5cGUsIHBsYXllckNvbG9yOiBzdHJpbmcsIHNpemU6IFNpemUpIHtcclxuICAgICAgICBzdXBlcihnYW1lLCBwbGF5ZXIsIGN0eCwgcG9zaXRpb24sIGhlYWx0aEJhclR5cGUsIHBsYXllckNvbG9yLCBzaXplKTtcclxuICAgICAgICB0aGlzLmhhbW1lckpvaW50ID0gbmV3IEpvaW50KHRoaXMuY3R4LCBhc3NldE1hbmFnZXIuaW1hZ2VzW1wiaGFtbWVyMjFcIl0sIHsgeDogLTIwMCwgeTogLTcwMCB9LCAwLjEyLCAwLCB7IHg6IC0yNSwgeTogMjAgfSwgMCwgLTAuNCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlbmRlcldlYXBvbigpIHtcclxuICAgICAgICB0aGlzLmhhbW1lckpvaW50LnJlbmRlcih0aGlzLmFuaW1hdGlvblRpbWUgLyB0aGlzLmFuaW1hdGlvblN0YXRlQW5pbWF0aW9uLnRvdGFsVGltZSwgdGhpcy5hbmltYXRpb25TdGF0ZUFuaW1hdGlvbi5qb2ludEFuaW1hdGlvbkluZm9bXCJwbGF5ZXJIYW1tZXJcIl0pO1xyXG5cclxuICAgICAgICAvKnRoaXMuY3R4LnNjYWxlKC0xLCAxKTtcclxuICAgICAgICByZW5kZXJTaGFwZSh0aGlzLmN0eCwgaGFtbWVyU2xhc2hIaXRTaGFwZSk7XHJcbiAgICAgICAgdGhpcy5jdHguc2NhbGUoLTEsIDEpOyovXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHVwZGF0ZShlbGFwc2VkVGltZTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5hbmltYXRpb25UaW1lICs9IGVsYXBzZWRUaW1lO1xyXG4gICAgICAgIGlmICh0aGlzLmFuaW1hdGlvblRpbWUgPj0gdGhpcy5hbmltYXRpb25TdGF0ZUFuaW1hdGlvbi50b3RhbFRpbWUpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuYW5pbWF0aW9uU3RhdGVBbmltYXRpb24ubG9vcCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hbmltYXRpb25UaW1lID0gMDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0QW5pbWF0aW9uKFwic3RhbmRcIiwgMCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuaGFtbWVySm9pbnQudXBkYXRlKGVsYXBzZWRUaW1lKTtcclxuICAgICAgICBzdXBlci51cGRhdGUoZWxhcHNlZFRpbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRBbmltYXRpb24oYW5pbWF0aW9uOiBIYW1tZXJQbGF5ZXJBbmltYXRpb25OYW1lLCBhbmdsZTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5hbmltYXRpb25UaW1lID0gMDtcclxuICAgICAgICB0aGlzLmNoYW5nZUZhY2luZ0FuZ2xlKGFuZ2xlKTtcclxuICAgICAgICBpZiAoYW5pbWF0aW9uID09PSBcInN3aW5nMVwiICYmIHRoaXMuYW5pbWF0aW9uU3RhdGUgPT09IFwic3dpbmcxXCIpIHtcclxuICAgICAgICAgICAgdGhpcy5hbmltYXRpb25TdGF0ZSA9IFwic3dpbmcyXCI7XHJcbiAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9uU3RhdGVBbmltYXRpb24gPSBIYW1tZXJQbGF5ZXJBbmltYXRpb25EYXRhW1wic3dpbmcyXCJdO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9uU3RhdGUgPSBhbmltYXRpb247XHJcbiAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9uU3RhdGVBbmltYXRpb24gPSBIYW1tZXJQbGF5ZXJBbmltYXRpb25EYXRhW2FuaW1hdGlvbl07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEhhbW1lck1vZGVsQW5pbWF0aW9uIGV4dGVuZHMgTW9kZWxBbmltYXRpb24ge1xyXG4gICAgdG90YWxUaW1lOiBudW1iZXI7XHJcbiAgICBsb29wOiBib29sZWFuO1xyXG4gICAgam9pbnRBbmltYXRpb25JbmZvOiBSZWNvcmQ8SGFtbWVyUGxheWVyTW9kZWxKb2ludCwgQW5pbWF0aW9uSW5mbz47XHJcbn1cclxuXHJcbmNvbnN0IEhhbW1lclBsYXllckFuaW1hdGlvbkRhdGE6IFJlY29yZDxIYW1tZXJQbGF5ZXJBbmltYXRpb25OYW1lLCBIYW1tZXJNb2RlbEFuaW1hdGlvbj4gPSB7XHJcbiAgICBzdGFuZDoge1xyXG4gICAgICAgIGxvb3A6IHRydWUsXHJcbiAgICAgICAgdG90YWxUaW1lOiAxLFxyXG4gICAgICAgIGpvaW50QW5pbWF0aW9uSW5mbzoge1xyXG4gICAgICAgICAgICBwbGF5ZXJIYW1tZXI6IHtcclxuICAgICAgICAgICAgICAgIGltZ1JvdGF0aW9uRXF1YXRpb246IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgICAgIGxvY2FsUG9zWEVxdWF0aW9uOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgICAgICBsb2NhbFBvc1lFcXVhdGlvbjogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICAgICAgYW5nbGVGcm9tRXF1YXRpb246IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgICAgIGFuZ2xlVG9FcXVhdGlvbjogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAgc3dpbmcyOiB7XHJcbiAgICAgICAgbG9vcDogZmFsc2UsXHJcbiAgICAgICAgdG90YWxUaW1lOiAwLjgsXHJcbiAgICAgICAgam9pbnRBbmltYXRpb25JbmZvOiB7XHJcbiAgICAgICAgICAgIHBsYXllckhhbW1lcjoge1xyXG4gICAgICAgICAgICAgICAgaW1nUm90YXRpb25FcXVhdGlvbjogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICAgICAgbG9jYWxQb3NZRXF1YXRpb246IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgICAgIGFuZ2xlRnJvbUVxdWF0aW9uOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgWzAsIC0yXSxcclxuICAgICAgICAgICAgICAgICAgICBbMC4xLCAwLjNdLFxyXG4gICAgICAgICAgICAgICAgICAgIFswLjIsIDEuM10sXHJcbiAgICAgICAgICAgICAgICAgICAgWzAuNiwgMS43XSxcclxuICAgICAgICAgICAgICAgICAgICBbMSwgMl0sXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgYW5nbGVUb0VxdWF0aW9uOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgWzAsIC0yXSxcclxuICAgICAgICAgICAgICAgICAgICBbMC4xLCAtM10sXHJcbiAgICAgICAgICAgICAgICAgICAgWzAuMiwgLTAuOF0sXHJcbiAgICAgICAgICAgICAgICAgICAgWzAuNiwgLTAuNl0sXHJcbiAgICAgICAgICAgICAgICAgICAgWzEsIC0wLjVdLFxyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIGxvY2FsUG9zWEVxdWF0aW9uOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgWzAsIDBdLFxyXG4gICAgICAgICAgICAgICAgICAgIFswLjEsIC0xMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgWzAuMTUsIC0zMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgWzAuMiwgMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgWzEsIDE1XSxcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgIH0sXHJcbiAgICBzd2luZzE6IHtcclxuICAgICAgICBsb29wOiBmYWxzZSxcclxuICAgICAgICB0b3RhbFRpbWU6IDAuOCxcclxuICAgICAgICBqb2ludEFuaW1hdGlvbkluZm86IHtcclxuICAgICAgICAgICAgcGxheWVySGFtbWVyOiB7XHJcbiAgICAgICAgICAgICAgICBpbWdSb3RhdGlvbkVxdWF0aW9uOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgICAgICBsb2NhbFBvc1lFcXVhdGlvbjogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICAgICAgYW5nbGVGcm9tRXF1YXRpb246IFtcclxuICAgICAgICAgICAgICAgICAgICBbMC4wLCAxLjZdLFxyXG4gICAgICAgICAgICAgICAgICAgIFswLjMsIC0xLjddLFxyXG4gICAgICAgICAgICAgICAgICAgIFswLjQsIC0xLjhdLFxyXG4gICAgICAgICAgICAgICAgICAgIFsxLCAtMS42XSxcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICBhbmdsZVRvRXF1YXRpb246IFtcclxuICAgICAgICAgICAgICAgICAgICBbMC4wLCAwLjVdLFxyXG4gICAgICAgICAgICAgICAgICAgIFswLjE1LCAtMC4xXSxcclxuICAgICAgICAgICAgICAgICAgICBbMC4zLCAtMC42XSxcclxuICAgICAgICAgICAgICAgICAgICBbMC41LCAtMC45XSxcclxuICAgICAgICAgICAgICAgICAgICBbMSwgLTAuOF0sXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgbG9jYWxQb3NYRXF1YXRpb246IFtcclxuICAgICAgICAgICAgICAgICAgICBbMCwgMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgWzAuMiwgLTMwXSxcclxuICAgICAgICAgICAgICAgICAgICBbMC42LCA3XSxcclxuICAgICAgICAgICAgICAgICAgICBbMSwgMTJdLFxyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgfSxcclxuICAgIHBvdW5kOiB7XHJcbiAgICAgICAgbG9vcDogZmFsc2UsXHJcbiAgICAgICAgdG90YWxUaW1lOiAxLFxyXG4gICAgICAgIGpvaW50QW5pbWF0aW9uSW5mbzoge1xyXG4gICAgICAgICAgICBwbGF5ZXJIYW1tZXI6IHtcclxuICAgICAgICAgICAgICAgIGltZ1JvdGF0aW9uRXF1YXRpb246IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgICAgIGxvY2FsUG9zWUVxdWF0aW9uOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgICAgICBhbmdsZUZyb21FcXVhdGlvbjogW1xyXG4gICAgICAgICAgICAgICAgICAgIFswLCAwXSxcclxuICAgICAgICAgICAgICAgICAgICBbMC4zLCBNYXRoLlBJICogLTFdLFxyXG4gICAgICAgICAgICAgICAgICAgIFswLjMsIE1hdGguUEldLFxyXG4gICAgICAgICAgICAgICAgICAgIFswLjYsIE1hdGguUEkgKiAtMV0sXHJcbiAgICAgICAgICAgICAgICAgICAgWzAuNiwgTWF0aC5QSV0sXHJcbiAgICAgICAgICAgICAgICAgICAgWzAuOSwgTWF0aC5QSSAqIC0xXSxcclxuICAgICAgICAgICAgICAgICAgICBbMC45LCBNYXRoLlBJXSxcclxuICAgICAgICAgICAgICAgICAgICBbMSwgMF0sXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgYW5nbGVUb0VxdWF0aW9uOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgWzAsIDBdLFxyXG4gICAgICAgICAgICAgICAgICAgIFswLjEzLCAwLjNdLFxyXG4gICAgICAgICAgICAgICAgICAgIFswLjIsIC0xXSxcclxuICAgICAgICAgICAgICAgICAgICBbMSwgLTBdLFxyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIGxvY2FsUG9zWEVxdWF0aW9uOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgWzAsIDBdLFxyXG4gICAgICAgICAgICAgICAgICAgIFswLjEzLCAxMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgWzAuMiwgLTVdLFxyXG4gICAgICAgICAgICAgICAgICAgIFsxLCAwXSxcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgIH0sXHJcbn07XHJcbiIsImltcG9ydCB7IEdhbWUgfSBmcm9tIFwiLi4vLi4vLi4vLi4vLi4vY2xpZW50L2dhbWVcIjtcclxuaW1wb3J0IHsgcm91bmRSZWN0IH0gZnJvbSBcIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9nYW1lUmVuZGVyL2dhbWVSZW5kZXJlclwiO1xyXG5pbXBvcnQgeyBTaXplIH0gZnJvbSBcIi4uLy4uLy4uLy4uLy4uL3NpemVcIjtcclxuaW1wb3J0IHsgZmluZE1pcnJvcmVkQW5nbGUsIHJvdGF0ZVNoYXBlLCBWZWN0b3IgfSBmcm9tIFwiLi4vLi4vLi4vLi4vLi4vdmVjdG9yXCI7XHJcbmltcG9ydCB7IGRlZmF1bHRBY3RvckNvbmZpZyB9IGZyb20gXCIuLi8uLi8uLi9hY3RvckNvbmZpZ1wiO1xyXG5pbXBvcnQgeyByZW5kZXJTaGFwZSB9IGZyb20gXCIuLi8uLi9jbGllbnRBY3RvclwiO1xyXG5pbXBvcnQgeyBDbGllbnRQbGF5ZXIgfSBmcm9tIFwiLi4vLi4vY2xpZW50UGxheWVyL2NsaWVudFBsYXllclwiO1xyXG5pbXBvcnQgeyBTaWRlVHlwZSB9IGZyb20gXCIuLi9oZWFsdGhCYXJcIjtcclxuaW1wb3J0IHsgTW9kZWwgfSBmcm9tIFwiLi4vbW9kZWxcIjtcclxuXHJcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBQbGF5ZXJNb2RlbCBleHRlbmRzIE1vZGVsIHtcclxuICAgIHByb3RlY3RlZCBhbmltYXRpb25UaW1lOiBudW1iZXIgPSAwO1xyXG5cclxuICAgIHByb3RlY3RlZCBmYWNpbmdBbmltYXRpb246IHsgZnJhbWU6IG51bWJlcjsgZmFjaW5nUmlnaHQ6IGJvb2xlYW4gfTtcclxuICAgIHByb3RlY3RlZCBmYWNpbmdBbmdsZUFuaW1hdGlvbjogeyBmcmFtZTogbnVtYmVyOyBhbmdsZTogbnVtYmVyOyB0YXJnZXRBbmdsZTogbnVtYmVyIH0gPSB7IGZyYW1lOiAxLCBhbmdsZTogMCwgdGFyZ2V0QW5nbGU6IDAgfTtcclxuXHJcbiAgICBwcm90ZWN0ZWQgaGl0QW5pbWF0aW9uOiB7IGZyYW1lOiBudW1iZXI7IHJlbmRlckNvbG9yOiBzdHJpbmcgfTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBnYW1lOiBHYW1lLFxyXG4gICAgICAgIHBsYXllcjogQ2xpZW50UGxheWVyLFxyXG4gICAgICAgIGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELFxyXG4gICAgICAgIHBvc2l0aW9uOiBWZWN0b3IsXHJcbiAgICAgICAgaGVhbHRoQmFyVHlwZTogU2lkZVR5cGUsXHJcbiAgICAgICAgcHJvdGVjdGVkIHJlYWRvbmx5IHBsYXllckNvbG9yOiBzdHJpbmcsXHJcbiAgICAgICAgcHJvdGVjdGVkIHJlYWRvbmx5IHNpemU6IFNpemUsXHJcbiAgICApIHtcclxuICAgICAgICBzdXBlcihnYW1lLCBwbGF5ZXIsIGN0eCwgcG9zaXRpb24sIGhlYWx0aEJhclR5cGUpO1xyXG4gICAgICAgIHRoaXMuaGl0QW5pbWF0aW9uID0geyBmcmFtZTogMCwgcmVuZGVyQ29sb3I6IHRoaXMucGxheWVyQ29sb3IgfTtcclxuXHJcbiAgICAgICAgdGhpcy5mYWNpbmdBbmltYXRpb24gPSB7IGZyYW1lOiAxLCBmYWNpbmdSaWdodDogdGhpcy5wbGF5ZXIuZmFjaW5nUmlnaHQgfTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgcmVuZGVyQmxvY2soKSB7XHJcbiAgICAgICAgdGhpcy5jdHguZmlsbFN0eWxlID0gdGhpcy5oaXRBbmltYXRpb24ucmVuZGVyQ29sb3I7XHJcbiAgICAgICAgdGhpcy5jdHguZmlsbFJlY3QodGhpcy5zaXplLndpZHRoIC8gLTIsIHRoaXMuc2l6ZS5oZWlnaHQgLyAtMiwgdGhpcy5zaXplLndpZHRoLCB0aGlzLnNpemUuaGVpZ2h0KTtcclxuXHJcbiAgICAgICAgdGhpcy5jdHguc3Ryb2tlU3R5bGUgPSBcIiMyMjIyMjJcIjtcclxuICAgICAgICB0aGlzLmN0eC5saW5lV2lkdGggPSAyO1xyXG4gICAgICAgIHJvdW5kUmVjdCh0aGlzLmN0eCwgdGhpcy5zaXplLndpZHRoIC8gLTIgLSAxLCB0aGlzLnNpemUuaGVpZ2h0IC8gLTIgLSAxLCB0aGlzLnNpemUud2lkdGggKyAyLCB0aGlzLnNpemUuaGVpZ2h0ICsgMiwgMywgZmFsc2UsIHRydWUpO1xyXG4gICAgICAgIC8vKCk7XHJcblxyXG4gICAgICAgIC8qdGhpcy5jdHguc3Ryb2tlU3R5bGUgPSBcImdyZWVuXCI7XHJcbiAgICAgICAgdGhpcy5jdHgubGluZVdpZHRoID0gMztcclxuICAgICAgICB0aGlzLmN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICB0aGlzLmN0eC5tb3ZlVG8oMCwgMCk7XHJcbiAgICAgICAgdGhpcy5jdHgubGluZVRvKE1hdGguY29zKHRoaXMuZmFjaW5nQW5nbGVBbmltYXRpb24uYW5nbGUpICogNTAsIE1hdGguc2luKHRoaXMuZmFjaW5nQW5nbGVBbmltYXRpb24uYW5nbGUpICogNTApO1xyXG4gICAgICAgIHRoaXMuY3R4LnN0cm9rZSgpOyovXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlZ2lzdGVyRGFtYWdlKHF1YW50aXR5OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLmhpdEFuaW1hdGlvbi5mcmFtZSA9IDAuMDc7XHJcbiAgICAgICAgdGhpcy5oaXRBbmltYXRpb24ucmVuZGVyQ29sb3IgPSBcInJlZFwiO1xyXG4gICAgICAgIHN1cGVyLnJlZ2lzdGVyRGFtYWdlKHF1YW50aXR5KTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgdXBkYXRlSGl0QW5pbWF0aW9uKGVsYXBzZWRUaW1lOiBudW1iZXIpIHtcclxuICAgICAgICBpZiAodGhpcy5oaXRBbmltYXRpb24uZnJhbWUgPiAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaGl0QW5pbWF0aW9uLmZyYW1lIC09IGVsYXBzZWRUaW1lO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5oaXRBbmltYXRpb24uZnJhbWUgPD0gMCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5oaXRBbmltYXRpb24uZnJhbWUgPSAwO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5oaXRBbmltYXRpb24ucmVuZGVyQ29sb3IgPSB0aGlzLnBsYXllckNvbG9yO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZW5kZXIoKSB7XHJcbiAgICAgICAgdGhpcy5jdHgudHJhbnNsYXRlKHRoaXMucG9zaXRpb24ueCwgdGhpcy5wb3NpdGlvbi55KTtcclxuICAgICAgICB0aGlzLmN0eC5yb3RhdGUodGhpcy5wbGF5ZXIuYWN0b3JPYmplY3Qub2JqZWN0QW5nbGUpO1xyXG4gICAgICAgIHRoaXMucmVuZGVyQmxvY2soKTtcclxuICAgICAgICB0aGlzLmN0eC5yb3RhdGUoLXRoaXMucGxheWVyLmFjdG9yT2JqZWN0Lm9iamVjdEFuZ2xlKTtcclxuXHJcbiAgICAgICAgbGV0IGZhY2luZzogbnVtYmVyID0gdGhpcy5nZXRGYWNpbmdTY2FsZSgpO1xyXG4gICAgICAgIGxldCBhbmdsZTogbnVtYmVyID0gdGhpcy5nZXRGYWNpbmdBbmdsZSgpO1xyXG5cclxuICAgICAgICB0aGlzLmN0eC5zY2FsZShmYWNpbmcsIDEpO1xyXG4gICAgICAgIHRoaXMuY3R4LnJvdGF0ZShhbmdsZSk7XHJcbiAgICAgICAgdGhpcy5yZW5kZXJXZWFwb24oKTtcclxuICAgICAgICB0aGlzLmN0eC5yb3RhdGUoLWFuZ2xlKTtcclxuICAgICAgICB0aGlzLmN0eC5zY2FsZSgxIC8gZmFjaW5nLCAxKTtcclxuXHJcbiAgICAgICAgdGhpcy5jdHgudHJhbnNsYXRlKC10aGlzLnBvc2l0aW9uLngsIC10aGlzLnBvc2l0aW9uLnkpO1xyXG4gICAgICAgIHRoaXMuaGVhbHRoQmFyLnJlbmRlckhlYWx0aCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBhYnN0cmFjdCByZW5kZXJXZWFwb24oKTogdm9pZDtcclxuXHJcbiAgICBwcm90ZWN0ZWQgdXBkYXRlRmFjaW5nKGVsYXBzZWRUaW1lOiBudW1iZXIpIHtcclxuICAgICAgICBpZiAodGhpcy5mYWNpbmdBbmltYXRpb24uZnJhbWUgPCAxKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZmFjaW5nQW5pbWF0aW9uLmZyYW1lICs9IGVsYXBzZWRUaW1lICogKDEgLyBwbGF5ZXJNb2RlbENvbmZpZy50dXJuVGltZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGdldEZhY2luZ1NjYWxlKCk6IG51bWJlciB7XHJcbiAgICAgICAgaWYgKHRoaXMuZmFjaW5nQW5pbWF0aW9uLmZhY2luZ1JpZ2h0KSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmZhY2luZ0FuaW1hdGlvbi5mcmFtZSA8IDEpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAxIC0gdGhpcy5mYWNpbmdBbmltYXRpb24uZnJhbWUgKiAyO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZmFjaW5nQW5pbWF0aW9uLmZyYW1lIDwgMSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIC0xICsgdGhpcy5mYWNpbmdBbmltYXRpb24uZnJhbWUgKiAyO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNoYW5nZUZhY2luZyhmYWNpbmdSaWdodDogYm9vbGVhbikge1xyXG4gICAgICAgIHRoaXMuZmFjaW5nQW5pbWF0aW9uLmZhY2luZ1JpZ2h0ID0gZmFjaW5nUmlnaHQ7XHJcbiAgICAgICAgdGhpcy5mYWNpbmdBbmltYXRpb24uZnJhbWUgPSAwO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCB1cGRhdGVGYWNpbmdBbmdsZShlbGFwc2VkVGltZTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5mYWNpbmdBbmdsZUFuaW1hdGlvbi5hbmdsZSA9XHJcbiAgICAgICAgICAgICh0aGlzLmZhY2luZ0FuZ2xlQW5pbWF0aW9uLnRhcmdldEFuZ2xlIC0gdGhpcy5mYWNpbmdBbmdsZUFuaW1hdGlvbi5hbmdsZSkgKiAoZWxhcHNlZFRpbWUgKiA1KSArIHRoaXMuZmFjaW5nQW5nbGVBbmltYXRpb24uYW5nbGU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGdldEZhY2luZ0FuZ2xlKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIC10aGlzLmZhY2luZ0FuZ2xlQW5pbWF0aW9uLmFuZ2xlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjaGFuZ2VGYWNpbmdBbmdsZShhbmdsZTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5mYWNpbmdBbmdsZUFuaW1hdGlvbi5mcmFtZSA9IDA7XHJcbiAgICAgICAgdGhpcy5mYWNpbmdBbmdsZUFuaW1hdGlvbi50YXJnZXRBbmdsZSA9IGZpbmRNaXJyb3JlZEFuZ2xlKGFuZ2xlKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0Q29sb3IoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5wbGF5ZXJDb2xvcjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdXBkYXRlKGVsYXBzZWRUaW1lOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZUZhY2luZyhlbGFwc2VkVGltZSk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVGYWNpbmdBbmdsZShlbGFwc2VkVGltZSk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVIaXRBbmltYXRpb24oZWxhcHNlZFRpbWUpO1xyXG4gICAgICAgIHN1cGVyLnVwZGF0ZShlbGFwc2VkVGltZSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgUGxheWVyTW9kZWxDb25maWcge1xyXG4gICAgdHVyblRpbWU6IG51bWJlcjtcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IHBsYXllck1vZGVsQ29uZmlnOiBQbGF5ZXJNb2RlbENvbmZpZyA9IHtcclxuICAgIHR1cm5UaW1lOiAwLjA2LFxyXG59O1xyXG4iLCJpbXBvcnQgeyBHYW1lIH0gZnJvbSBcIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9nYW1lXCI7XHJcbmltcG9ydCB7IGFzc2V0TWFuYWdlciB9IGZyb20gXCIuLi8uLi8uLi8uLi8uLi9jbGllbnQvZ2FtZVJlbmRlci9hc3NldG1hbmFnZXJcIjtcclxuaW1wb3J0IHsgZmluZEFuZ2xlIH0gZnJvbSBcIi4uLy4uLy4uLy4uLy4uL2ZpbmRBbmdsZVwiO1xyXG5pbXBvcnQgeyBTaXplIH0gZnJvbSBcIi4uLy4uLy4uLy4uLy4uL3NpemVcIjtcclxuaW1wb3J0IHsgVmVjdG9yIH0gZnJvbSBcIi4uLy4uLy4uLy4uLy4uL3ZlY3RvclwiO1xyXG5pbXBvcnQgeyBTd29yZFNsYXNoSGl0U2hhcGUgfSBmcm9tIFwiLi4vLi4vLi4vLi4vY2xpZW50Q29udHJvbGxlcnMvY29udHJvbGxlcnMvYWJpbGl0aWVzL3N3b3JkQWJpbGl0aWVzL3N3b3JkU2xhc2hBYmlsaXR5XCI7XHJcbmltcG9ydCB7IHJlbmRlclNoYXBlIH0gZnJvbSBcIi4uLy4uL2NsaWVudEFjdG9yXCI7XHJcbmltcG9ydCB7IENsaWVudFN3b3JkIH0gZnJvbSBcIi4uLy4uL2NsaWVudFBsYXllci9jbGllbnRDbGFzc2VzL2NsaWVudFN3b3JkXCI7XHJcbmltcG9ydCB7IENsaWVudFBsYXllciB9IGZyb20gXCIuLi8uLi9jbGllbnRQbGF5ZXIvY2xpZW50UGxheWVyXCI7XHJcbmltcG9ydCB7IFNpZGVUeXBlIH0gZnJvbSBcIi4uL2hlYWx0aEJhclwiO1xyXG5pbXBvcnQgeyBKb2ludCB9IGZyb20gXCIuLi9qb2ludFwiO1xyXG5pbXBvcnQgeyBBbmltYXRpb25JbmZvLCBNb2RlbEFuaW1hdGlvbiB9IGZyb20gXCIuLi9tb2RlbFwiO1xyXG5pbXBvcnQgeyBQbGF5ZXJNb2RlbCB9IGZyb20gXCIuL3BsYXllck1vZGVsXCI7XHJcblxyXG50eXBlIFN3b3JkUGxheWVyTW9kZWxKb2ludCA9IFwicGxheWVyU3dvcmRcIjtcclxuZXhwb3J0IHR5cGUgU3dvcmRQbGF5ZXJBbmltYXRpb25OYW1lID0gXCJzdGFuZFwiIHwgXCJzbGFzaDFcIiB8IFwic2xhc2gyXCIgfCBcIndoaXJsd2luZFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFN3b3JkUGxheWVyTW9kZWwgZXh0ZW5kcyBQbGF5ZXJNb2RlbCB7XHJcbiAgICBwcm90ZWN0ZWQgYW5pbWF0aW9uU3RhdGVBbmltYXRpb246IFN3b3JkTW9kZWxBbmltYXRpb24gPSBTd29yZFBsYXllckFuaW1hdGlvbkRhdGFbXCJzdGFuZFwiXTtcclxuICAgIHByb3RlY3RlZCBhbmltYXRpb25TdGF0ZTogU3dvcmRQbGF5ZXJBbmltYXRpb25OYW1lID0gXCJzdGFuZFwiO1xyXG4gICAgcHJvdGVjdGVkIHN3b3JkSm9pbnQ6IEpvaW50O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGdhbWU6IEdhbWUsIHBsYXllcjogQ2xpZW50U3dvcmQsIGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELCBwb3NpdGlvbjogVmVjdG9yLCBoZWFsdGhCYXJUeXBlOiBTaWRlVHlwZSwgcGxheWVyQ29sb3I6IHN0cmluZywgc2l6ZTogU2l6ZSkge1xyXG4gICAgICAgIHN1cGVyKGdhbWUsIHBsYXllciwgY3R4LCBwb3NpdGlvbiwgaGVhbHRoQmFyVHlwZSwgcGxheWVyQ29sb3IsIHNpemUpO1xyXG4gICAgICAgIHRoaXMuc3dvcmRKb2ludCA9IG5ldyBKb2ludCh0aGlzLmN0eCwgYXNzZXRNYW5hZ2VyLmltYWdlc1tcInN3b3JkMzFcIl0sIHsgeDogLTIwMCwgeTogLTcwMCB9LCAwLjEsIDAsIHsgeDogLTI1LCB5OiAyMCB9LCAwLCAtMC40KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVuZGVyV2VhcG9uKCkge1xyXG4gICAgICAgIHRoaXMuc3dvcmRKb2ludC5yZW5kZXIodGhpcy5hbmltYXRpb25UaW1lIC8gdGhpcy5hbmltYXRpb25TdGF0ZUFuaW1hdGlvbi50b3RhbFRpbWUsIHRoaXMuYW5pbWF0aW9uU3RhdGVBbmltYXRpb24uam9pbnRBbmltYXRpb25JbmZvW1wicGxheWVyU3dvcmRcIl0pO1xyXG5cclxuICAgICAgICAvKnRoaXMuY3R4LnNjYWxlKC0xLCAxKTtcclxuICAgICAgICByZW5kZXJTaGFwZSh0aGlzLmN0eCwgU3dvcmRTbGFzaEhpdFNoYXBlKTtcclxuICAgICAgICB0aGlzLmN0eC5zY2FsZSgtMSwgMSk7Ki9cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdXBkYXRlKGVsYXBzZWRUaW1lOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLmFuaW1hdGlvblRpbWUgKz0gZWxhcHNlZFRpbWU7XHJcbiAgICAgICAgaWYgKHRoaXMuYW5pbWF0aW9uVGltZSA+PSB0aGlzLmFuaW1hdGlvblN0YXRlQW5pbWF0aW9uLnRvdGFsVGltZSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5hbmltYXRpb25TdGF0ZUFuaW1hdGlvbi5sb29wKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFuaW1hdGlvblRpbWUgPSAwO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRBbmltYXRpb24oXCJzdGFuZFwiLCAwKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5zd29yZEpvaW50LnVwZGF0ZShlbGFwc2VkVGltZSk7XHJcbiAgICAgICAgc3VwZXIudXBkYXRlKGVsYXBzZWRUaW1lKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0QW5pbWF0aW9uKGFuaW1hdGlvbjogU3dvcmRQbGF5ZXJBbmltYXRpb25OYW1lLCBhbmdsZTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5hbmltYXRpb25UaW1lID0gMDtcclxuICAgICAgICB0aGlzLmNoYW5nZUZhY2luZ0FuZ2xlKGFuZ2xlKTtcclxuICAgICAgICBpZiAoYW5pbWF0aW9uID09PSBcInNsYXNoMVwiICYmIHRoaXMuYW5pbWF0aW9uU3RhdGUgPT09IFwic2xhc2gxXCIpIHtcclxuICAgICAgICAgICAgdGhpcy5hbmltYXRpb25TdGF0ZSA9IFwic2xhc2gyXCI7XHJcbiAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9uU3RhdGVBbmltYXRpb24gPSBTd29yZFBsYXllckFuaW1hdGlvbkRhdGFbXCJzbGFzaDJcIl07XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5hbmltYXRpb25TdGF0ZSA9IGFuaW1hdGlvbjtcclxuICAgICAgICAgICAgdGhpcy5hbmltYXRpb25TdGF0ZUFuaW1hdGlvbiA9IFN3b3JkUGxheWVyQW5pbWF0aW9uRGF0YVthbmltYXRpb25dO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBTd29yZE1vZGVsQW5pbWF0aW9uIGV4dGVuZHMgTW9kZWxBbmltYXRpb24ge1xyXG4gICAgdG90YWxUaW1lOiBudW1iZXI7XHJcbiAgICBsb29wOiBib29sZWFuO1xyXG4gICAgam9pbnRBbmltYXRpb25JbmZvOiBSZWNvcmQ8U3dvcmRQbGF5ZXJNb2RlbEpvaW50LCBBbmltYXRpb25JbmZvPjtcclxufVxyXG5cclxuY29uc3QgU3dvcmRQbGF5ZXJBbmltYXRpb25EYXRhOiBSZWNvcmQ8U3dvcmRQbGF5ZXJBbmltYXRpb25OYW1lLCBTd29yZE1vZGVsQW5pbWF0aW9uPiA9IHtcclxuICAgIHN0YW5kOiB7XHJcbiAgICAgICAgbG9vcDogdHJ1ZSxcclxuICAgICAgICB0b3RhbFRpbWU6IDEsXHJcbiAgICAgICAgam9pbnRBbmltYXRpb25JbmZvOiB7XHJcbiAgICAgICAgICAgIHBsYXllclN3b3JkOiB7XHJcbiAgICAgICAgICAgICAgICBpbWdSb3RhdGlvbkVxdWF0aW9uOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgICAgICBsb2NhbFBvc1hFcXVhdGlvbjogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICAgICAgbG9jYWxQb3NZRXF1YXRpb246IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgICAgIGFuZ2xlRnJvbUVxdWF0aW9uOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgICAgICBhbmdsZVRvRXF1YXRpb246IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgfSxcclxuICAgIHNsYXNoMToge1xyXG4gICAgICAgIGxvb3A6IGZhbHNlLFxyXG4gICAgICAgIHRvdGFsVGltZTogMC42LFxyXG4gICAgICAgIGpvaW50QW5pbWF0aW9uSW5mbzoge1xyXG4gICAgICAgICAgICBwbGF5ZXJTd29yZDoge1xyXG4gICAgICAgICAgICAgICAgaW1nUm90YXRpb25FcXVhdGlvbjogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICAgICAgbG9jYWxQb3NZRXF1YXRpb246IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgICAgIGFuZ2xlRnJvbUVxdWF0aW9uOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgWzAsIC0yXSxcclxuICAgICAgICAgICAgICAgICAgICBbMC4xLCAwLjNdLFxyXG4gICAgICAgICAgICAgICAgICAgIFswLjIsIDEuM10sXHJcbiAgICAgICAgICAgICAgICAgICAgWzAuNiwgMS43XSxcclxuICAgICAgICAgICAgICAgICAgICBbMSwgMl0sXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgYW5nbGVUb0VxdWF0aW9uOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgWzAsIC0yXSxcclxuICAgICAgICAgICAgICAgICAgICBbMC4xLCAtM10sXHJcbiAgICAgICAgICAgICAgICAgICAgWzAuMiwgLTAuOF0sXHJcbiAgICAgICAgICAgICAgICAgICAgWzAuNiwgLTAuNl0sXHJcbiAgICAgICAgICAgICAgICAgICAgWzEsIC0wLjVdLFxyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIGxvY2FsUG9zWEVxdWF0aW9uOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgWzAsIDBdLFxyXG4gICAgICAgICAgICAgICAgICAgIFswLjEsIC0xMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgWzAuMTUsIC0zMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgWzAuMiwgMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgWzEsIDE1XSxcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgIH0sXHJcbiAgICBzbGFzaDI6IHtcclxuICAgICAgICBsb29wOiBmYWxzZSxcclxuICAgICAgICB0b3RhbFRpbWU6IDAuNCxcclxuICAgICAgICBqb2ludEFuaW1hdGlvbkluZm86IHtcclxuICAgICAgICAgICAgcGxheWVyU3dvcmQ6IHtcclxuICAgICAgICAgICAgICAgIGltZ1JvdGF0aW9uRXF1YXRpb246IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgICAgIGxvY2FsUG9zWUVxdWF0aW9uOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgICAgICBhbmdsZUZyb21FcXVhdGlvbjogW1xyXG4gICAgICAgICAgICAgICAgICAgIFswLjAsIDEuNl0sXHJcbiAgICAgICAgICAgICAgICAgICAgWzAuMywgLTEuN10sXHJcbiAgICAgICAgICAgICAgICAgICAgWzAuNCwgLTEuOF0sXHJcbiAgICAgICAgICAgICAgICAgICAgWzEsIC0xLjZdLFxyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIGFuZ2xlVG9FcXVhdGlvbjogW1xyXG4gICAgICAgICAgICAgICAgICAgIFswLjAsIDAuNV0sXHJcbiAgICAgICAgICAgICAgICAgICAgWzAuMTUsIC0wLjFdLFxyXG4gICAgICAgICAgICAgICAgICAgIFswLjMsIC0wLjZdLFxyXG4gICAgICAgICAgICAgICAgICAgIFswLjUsIC0wLjldLFxyXG4gICAgICAgICAgICAgICAgICAgIFsxLCAtMC44XSxcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICBsb2NhbFBvc1hFcXVhdGlvbjogW1xyXG4gICAgICAgICAgICAgICAgICAgIFswLCAwXSxcclxuICAgICAgICAgICAgICAgICAgICBbMC4yLCAtMzBdLFxyXG4gICAgICAgICAgICAgICAgICAgIFswLjYsIDddLFxyXG4gICAgICAgICAgICAgICAgICAgIFsxLCAxMl0sXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAgd2hpcmx3aW5kOiB7XHJcbiAgICAgICAgbG9vcDogZmFsc2UsXHJcbiAgICAgICAgdG90YWxUaW1lOiAxLFxyXG4gICAgICAgIGpvaW50QW5pbWF0aW9uSW5mbzoge1xyXG4gICAgICAgICAgICBwbGF5ZXJTd29yZDoge1xyXG4gICAgICAgICAgICAgICAgaW1nUm90YXRpb25FcXVhdGlvbjogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICAgICAgbG9jYWxQb3NZRXF1YXRpb246IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgICAgIGFuZ2xlRnJvbUVxdWF0aW9uOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgWzAsIDBdLFxyXG4gICAgICAgICAgICAgICAgICAgIFswLjMsIE1hdGguUEkgKiAtMV0sXHJcbiAgICAgICAgICAgICAgICAgICAgWzAuMywgTWF0aC5QSV0sXHJcbiAgICAgICAgICAgICAgICAgICAgWzAuNiwgTWF0aC5QSSAqIC0xXSxcclxuICAgICAgICAgICAgICAgICAgICBbMC42LCBNYXRoLlBJXSxcclxuICAgICAgICAgICAgICAgICAgICBbMC45LCBNYXRoLlBJICogLTFdLFxyXG4gICAgICAgICAgICAgICAgICAgIFswLjksIE1hdGguUEldLFxyXG4gICAgICAgICAgICAgICAgICAgIFsxLCAwXSxcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICBhbmdsZVRvRXF1YXRpb246IFtcclxuICAgICAgICAgICAgICAgICAgICBbMCwgMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgWzAuMTMsIDAuM10sXHJcbiAgICAgICAgICAgICAgICAgICAgWzAuMiwgLTFdLFxyXG4gICAgICAgICAgICAgICAgICAgIFsxLCAtMF0sXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgbG9jYWxQb3NYRXF1YXRpb246IFtcclxuICAgICAgICAgICAgICAgICAgICBbMCwgMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgWzAuMTMsIDEwXSxcclxuICAgICAgICAgICAgICAgICAgICBbMC4yLCAtNV0sXHJcbiAgICAgICAgICAgICAgICAgICAgWzEsIDBdLFxyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgfSxcclxufTtcclxuIiwiaW1wb3J0IHsgYXNzZXRNYW5hZ2VyIH0gZnJvbSBcIi4uLy4uLy4uL2NsaWVudC9nYW1lUmVuZGVyL2Fzc2V0bWFuYWdlclwiO1xyXG5pbXBvcnQgeyBTaXplIH0gZnJvbSBcIi4uLy4uLy4uL3NpemVcIjtcclxuaW1wb3J0IHsgVmVjdG9yIH0gZnJvbSBcIi4uLy4uLy4uL3ZlY3RvclwiO1xyXG5pbXBvcnQgeyBEb29kYWQsIERvb2RhZFR5cGUgfSBmcm9tIFwiLi9kb29kYWRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBDbGllbnREb29kYWQgZXh0ZW5kcyBEb29kYWQge1xyXG4gICAgcHJvdGVjdGVkIHJlYWRvbmx5IGltZzogSFRNTEltYWdlRWxlbWVudCA9IGFzc2V0TWFuYWdlci5pbWFnZXNbdGhpcy5kb29kYWRUeXBlXTtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwb3NpdGlvbjogVmVjdG9yLCByb3RhdGlvbjogbnVtYmVyLCBkb29kYWRUeXBlOiBEb29kYWRUeXBlLCBwcm90ZWN0ZWQgcmVhZG9ubHkgY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpIHtcclxuICAgICAgICBzdXBlcihwb3NpdGlvbiwgcm90YXRpb24sIGRvb2RhZFR5cGUpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBpZlNob3VsZFJlbmRlcihzY3JlZW5TaXplOiBTaXplLCBzY3JlZW5Qb3M6IFZlY3Rvcik6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICh0aGlzLnBvc2l0aW9uLnggKyB0aGlzLmNvbGxpc2lvblJhbmdlID49IHNjcmVlblBvcy54ICYmIHRoaXMucG9zaXRpb24ueCAtIHRoaXMuY29sbGlzaW9uUmFuZ2UgPD0gc2NyZWVuUG9zLnggKyBzY3JlZW5TaXplLndpZHRoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAvKmlmICh0aGlzLnBvc2l0aW9uLnkgKyB0aGlzLmNvbGxpc2lvblJhbmdlID49IHNjcmVlblBvcy55ICYmIHRoaXMucG9zaXRpb24ueSAtIHRoaXMuY29sbGlzaW9uUmFuZ2UgPD0gc2NyZWVuUG9zLnkgKyBzY3JlZW5TaXplLmhlaWdodCkge1xyXG4gICAgICAgICAgICB9Ki8gLy9vbmx5IG5lY2Vzc2FyeSBpZiB3ZSBhZGQgYSB5LWRpbWVuc2lvbiB0byB0aGUgZ2FtZS5cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZW5kZXIoKSB7XHJcbiAgICAgICAgdGhpcy5jdHgudHJhbnNsYXRlKE1hdGguZmxvb3IodGhpcy5wb3NpdGlvbi54KSwgTWF0aC5mbG9vcih0aGlzLnBvc2l0aW9uLnkpKTtcclxuICAgICAgICB0aGlzLmN0eC5yb3RhdGUodGhpcy5yb3RhdGlvbik7XHJcbiAgICAgICAgdGhpcy5jdHguZHJhd0ltYWdlKHRoaXMuaW1nLCAtMjAwLCAtMTQwKTtcclxuICAgICAgICB0aGlzLmN0eC5yb3RhdGUoLXRoaXMucm90YXRpb24pO1xyXG4gICAgICAgIHRoaXMuY3R4LnRyYW5zbGF0ZSgtdGhpcy5wb3NpdGlvbi54LCAtdGhpcy5wb3NpdGlvbi55KTtcclxuXHJcbiAgICAgICAgLy90aGlzLnJlbmRlclBvaW50cygpO1xyXG4gICAgICAgIC8vdGhpcy5yZW5kZXJFZGdlcyhmYWxzZSk7XHJcbiAgICAgICAgLy90aGlzLnJlbmRlck9ydGhvbm9ybWFscygpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZW5kZXJQb2ludHMoKSB7XHJcbiAgICAgICAgdGhpcy5jdHguZmlsbFN0eWxlID0gXCJyZWRcIjtcclxuICAgICAgICB0aGlzLnBvaW50cy5mb3JFYWNoKChwb2ludCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmN0eC5maWxsUmVjdChwb2ludC54IC0gNSwgcG9pbnQueSAtIDUsIDEwLCAxMCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlbmRlck9ydGhvbm9ybWFscygpIHtcclxuICAgICAgICB0aGlzLmN0eC5zdHJva2VTdHlsZSA9IFwicmVkXCI7XHJcbiAgICAgICAgdGhpcy5jdHgubGluZVdpZHRoID0gMjtcclxuICAgICAgICB0aGlzLmVkZ2VzLmZvckVhY2goKGVkZ2UpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5jdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgICAgIHRoaXMuY3R4Lm1vdmVUbygoZWRnZS5wMS54ICsgZWRnZS5wMi54KSAvIDIsIChlZGdlLnAxLnkgKyBlZGdlLnAyLnkpIC8gMik7XHJcbiAgICAgICAgICAgIHRoaXMuY3R4LmxpbmVUbygoZWRnZS5wMS54ICsgZWRnZS5wMi54KSAvIDIgKyBlZGdlLm9ydGhvZ29uYWxWZWN0b3IueCAqIDEwLCAoZWRnZS5wMS55ICsgZWRnZS5wMi55KSAvIDIgKyBlZGdlLm9ydGhvZ29uYWxWZWN0b3IueSAqIDEwKTtcclxuICAgICAgICAgICAgdGhpcy5jdHguc3Ryb2tlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgcmVuZGVyRWRnZXMoYWN0aXZhdGU6IGJvb2xlYW4pIHtcclxuICAgICAgICB0aGlzLmN0eC5saW5lV2lkdGggPSAyO1xyXG4gICAgICAgIHRoaXMuZWRnZXMuZm9yRWFjaCgoZWRnZSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoYWN0aXZhdGUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3R4LnN0cm9rZVN0eWxlID0gXCJyZWRcIjtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChlZGdlLmlzR3JvdW5kKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmN0eC5zdHJva2VTdHlsZSA9IFwiYmx1ZVwiO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jdHguc3Ryb2tlU3R5bGUgPSBcInJlZFwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgICB0aGlzLmN0eC5tb3ZlVG8oZWRnZS5wMS54LCBlZGdlLnAxLnkpO1xyXG4gICAgICAgICAgICB0aGlzLmN0eC5saW5lVG8oZWRnZS5wMi54LCBlZGdlLnAyLnkpO1xyXG4gICAgICAgICAgICB0aGlzLmN0eC5zdHJva2UoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBmaW5kQW5nbGUgfSBmcm9tIFwiLi4vLi4vLi4vZmluZEFuZ2xlXCI7XHJcbmltcG9ydCB7IGZpbmRJbnRlcnNlY3Rpb24sIGlmSW50ZXJzZWN0IH0gZnJvbSBcIi4uLy4uLy4uL2lmSW50ZXJzZWN0XCI7XHJcbmltcG9ydCB7XHJcbiAgICBEb29kYWRFZGdlLFxyXG4gICAgZG90UHJvZHVjdCxcclxuICAgIEVkZ2UsXHJcbiAgICBmaW5kRGlmZmVyZW5jZSxcclxuICAgIGZpbmREaXN0YW5jZSxcclxuICAgIGZpbmRMZW5ndGgsXHJcbiAgICBmaW5kT3J0aG9ub3JtYWxWZWN0b3IsXHJcbiAgICByb3RhdGVWZWN0b3IsXHJcbiAgICBTaGFwZSxcclxuICAgIFZlY3RvcixcclxuICAgIHZlY3RvclByb2plY3QsXHJcbn0gZnJvbSBcIi4uLy4uLy4uL3ZlY3RvclwiO1xyXG5cclxuY29uc3QgZG9vZGFkUG9pbnRJbmZvcm1hdGlvbjogUmVjb3JkPERvb2RhZFR5cGUsIFZlY3RvcltdPiA9IHtcclxuICAgIHJvY2tMYXJnZTogW1xyXG4gICAgICAgIHsgeDogLTE4MiwgeTogMTIgfSxcclxuICAgICAgICB7IHg6IC0yMDAsIHk6IC0zOCB9LFxyXG4gICAgICAgIHsgeDogLTEyOCwgeTogLTEwNSB9LFxyXG4gICAgICAgIHsgeDogLTEwLCB5OiAtMTM0IH0sXHJcbiAgICAgICAgeyB4OiAyMCwgeTogLTEzMyB9LFxyXG4gICAgICAgIHsgeDogMTIxLCB5OiAtODAgfSxcclxuICAgICAgICB7IHg6IDE5MywgeTogLTIyIH0sXHJcbiAgICAgICAgeyB4OiAxOTcsIHk6IDIzIH0sXHJcbiAgICBdLFxyXG59O1xyXG5cclxuZXhwb3J0IHR5cGUgRG9vZGFkVHlwZSA9IFwicm9ja0xhcmdlXCI7XHJcblxyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgRG9vZGFkIHtcclxuICAgIHByb3RlY3RlZCByZWFkb25seSBwb2ludHM6IFZlY3RvcltdID0gW107XHJcbiAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgZWRnZXM6IERvb2RhZEVkZ2VbXSA9IFtdO1xyXG4gICAgcHJvdGVjdGVkIGNvbGxpc2lvblJhbmdlOiBudW1iZXIgPSAwO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByb3RlY3RlZCByZWFkb25seSBwb3NpdGlvbjogVmVjdG9yLCBwcm90ZWN0ZWQgcmVhZG9ubHkgcm90YXRpb246IG51bWJlciwgcHJvdGVjdGVkIHJlYWRvbmx5IGRvb2RhZFR5cGU6IERvb2RhZFR5cGUpIHtcclxuICAgICAgICBsZXQgZG9vZGFkUG9pbnRzOiBWZWN0b3JbXSA9IGRvb2RhZFBvaW50SW5mb3JtYXRpb25bZG9vZGFkVHlwZV07XHJcbiAgICAgICAgLy9yb3RhdGUgYmFzZSBzaGFwZSBhbmQgc3RvcmUgaXQgaW4gdGhpcy5wb2ludHNcclxuICAgICAgICBkb29kYWRQb2ludHMuZm9yRWFjaCgocG9pbnQpID0+IHtcclxuICAgICAgICAgICAgbGV0IGxvY2FsUG9pbnQ6IFZlY3RvciA9IHJvdGF0ZVZlY3Rvcih0aGlzLnJvdGF0aW9uLCBwb2ludCk7XHJcbiAgICAgICAgICAgIHRoaXMucG9pbnRzLnB1c2goeyB4OiBsb2NhbFBvaW50LnggKyB0aGlzLnBvc2l0aW9uLngsIHk6IGxvY2FsUG9pbnQueSArIHRoaXMucG9zaXRpb24ueSB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy9maW5kIGxhcmdlc3QgZGlzdGFuY2UgYmV0d2VlbiBhIHBvaW50IGFuZCB0aGUgY2VudGVyXHJcbiAgICAgICAgdGhpcy5wb2ludHMuZm9yRWFjaCgocG9pbnQpID0+IHtcclxuICAgICAgICAgICAgbGV0IGRpc3RhbmNlOiBudW1iZXIgPSBmaW5kRGlzdGFuY2UodGhpcy5wb3NpdGlvbiwgcG9pbnQpO1xyXG4gICAgICAgICAgICBpZiAoZGlzdGFuY2UgPiB0aGlzLmNvbGxpc2lvblJhbmdlKSB0aGlzLmNvbGxpc2lvblJhbmdlID0gZGlzdGFuY2U7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vZmluZCBhbGwgdGhlIGVkZ2VzIGJhc2VkIG9uIHRoZSBwb2ludHNcclxuICAgICAgICBsZXQgcG9pbnRDb3VudDogbnVtYmVyID0gdGhpcy5wb2ludHMubGVuZ3RoO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpOiBudW1iZXIgPSAwOyBpIDwgcG9pbnRDb3VudDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCBwb2ludDE6IFZlY3RvciA9IHRoaXMucG9pbnRzW2ldO1xyXG4gICAgICAgICAgICBsZXQgcG9pbnQyOiBWZWN0b3IgPSB0aGlzLnBvaW50c1soaSArIDEpICUgcG9pbnRDb3VudF07XHJcbiAgICAgICAgICAgIGxldCBhbmdsZTogbnVtYmVyID0gZmluZEFuZ2xlKHBvaW50MSwgcG9pbnQyKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuZWRnZXMucHVzaCh7XHJcbiAgICAgICAgICAgICAgICBwMTogcG9pbnQxLFxyXG4gICAgICAgICAgICAgICAgcDI6IHBvaW50MixcclxuICAgICAgICAgICAgICAgIGFuZ2xlLFxyXG4gICAgICAgICAgICAgICAgc2xvcGU6IGZpbmREaWZmZXJlbmNlKHBvaW50MSwgcG9pbnQyKSxcclxuICAgICAgICAgICAgICAgIGlzR3JvdW5kOiBNYXRoLlBJIC8gLTUgPCBhbmdsZSAmJiBhbmdsZSA8IE1hdGguUEkgLyA1LFxyXG4gICAgICAgICAgICAgICAgb3J0aG9nb25hbFZlY3RvcjogZmluZE9ydGhvbm9ybWFsVmVjdG9yKHBvaW50MSwgcG9pbnQyKSxcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRDb2xsaXNpb25SYW5nZSgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbGxpc2lvblJhbmdlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogVmVyeSBjaGVhcCBjaGVjayBpZiB0d28gb2JqZWN0cyBhcmUgY2xvc2UgZW5vdWdoIHRvIHRvdWNoLlxyXG4gICAgICogQHBhcmFtIHBvc2l0aW9uIFBvc2l0aW9uIG9mIHRoZSBvYmplY3QgaW4gcXVlc3Rpb24uXHJcbiAgICAgKiBAcGFyYW0gb2JqZWN0Q29sbGlzaW9uUmFuZ2UgSGlnaGVzdCBwb3NzaWJsZSByYWRpdXMgb2YgdGhlIG9iamVjdCBpbiBxdWVzdGlvbi5cclxuICAgICAqIEByZXR1cm5zIFRydWUgaWYgdGhlIG9iamVjdHMgYXJlIGNsb3NlIGVub3VnaCB0byBwb3NzaWJseSBjb2xsaWRlLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgY2hlY2tDb2xsaXNpb25SYW5nZShwb3NpdGlvbjogVmVjdG9yLCBvYmplY3RDb2xsaXNpb25SYW5nZTogbnVtYmVyKTogYm9vbGVhbiB7XHJcbiAgICAgICAgLy9pZiBvYmplY3RzJyBjb2xsaXNpb24gYm91bmRzIGFyZSB0b28gY2xvc2VcclxuICAgICAgICByZXR1cm4gZmluZERpc3RhbmNlKHRoaXMucG9zaXRpb24sIHBvc2l0aW9uKSA8PSB0aGlzLmNvbGxpc2lvblJhbmdlICsgb2JqZWN0Q29sbGlzaW9uUmFuZ2U7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgY2hlY2tPYmplY3RJbnRlcnNlY3Rpb24ob2JqZWN0U2hhcGU6IFNoYXBlKTogYm9vbGVhbiB7XHJcbiAgICAgICAgLy9pZiBvYmplY3RzIGludGVyc2VjdCAobGluZSBpbnRlcnNlY3QgLT4gb3IgaWZQb2ludElzQmVoaW5kRWRnZSBtZXRob2QpXHJcblxyXG4gICAgICAgIC8qVGhpcyBtZXRob2QgY2hlY2tzIGFsbCBvZiB0aGlzIHNoYXBlJ3MgZWRnZXMgdG8gc2VlIGlmIGFueSBvZiB0aGUgb2JqZWN0J3MgcG9pbnRzIGZhbGwgYmVoaW5kIHRoYXQgZWRnZS5cclxuICAgICAgICBJZiBhbiBlZGdlIGV4aXN0cyB3aXRoIG5vIHBvaW50cyBiZWhpbmQgaXQsIHdlIGNhbiBhc3N1bWUgdGhlIHNoYXBlcyBkbyBub3QgY29sbGlkZS5cclxuICAgICAgICBPdGhlcndpc2UsIHdlIGtub3cgdGhhdCBzb21ld2hlcmUgdGhlIHNoYXBlcyBjb2xsaWRlLlxyXG4gICAgICAgIFRoaXMgbWV0aG9kIHdpbGwgbm90IHdvcmsgZm9yIGNvbmNhdmUgZG9vZGFkcy4qL1xyXG4gICAgICAgIGZvciAobGV0IGkxOiBudW1iZXIgPSAwOyBpMSA8IHRoaXMuZWRnZXMubGVuZ3RoOyBpMSsrKSB7XHJcbiAgICAgICAgICAgIGxldCBpZlBvaW50RXhpc3RzQmVoaW5kOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkyOiBudW1iZXIgPSAwOyBpMiA8IG9iamVjdFNoYXBlLnBvaW50cy5sZW5ndGg7IGkyKyspIHtcclxuICAgICAgICAgICAgICAgIGlmIChcclxuICAgICAgICAgICAgICAgICAgICBkb3RQcm9kdWN0KFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7IHg6IG9iamVjdFNoYXBlLnBvaW50c1tpMl0ueCAtIHRoaXMuZWRnZXNbaTFdLnAxLngsIHk6IG9iamVjdFNoYXBlLnBvaW50c1tpMl0ueSAtIHRoaXMuZWRnZXNbaTFdLnAxLnkgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lZGdlc1tpMV0ub3J0aG9nb25hbFZlY3RvcixcclxuICAgICAgICAgICAgICAgICAgICApIDw9IDBcclxuICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICAgICAgICBpZlBvaW50RXhpc3RzQmVoaW5kID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoIWlmUG9pbnRFeGlzdHNCZWhpbmQpIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcblxyXG4gICAgICAgIC8qZm9yIChsZXQgaTE6IG51bWJlciA9IDA7IGkxIDwgdGhpcy5lZGdlcy5sZW5ndGg7IGkxKyspIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaTI6IG51bWJlciA9IDA7IGkyIDwgb2JqZWN0U2hhcGUuZWRnZXMubGVuZ3RoOyBpMisrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaWZJbnRlcnNlY3QodGhpcy5lZGdlc1tpMV0ucDEsIHRoaXMuZWRnZXNbaTFdLnAyLCBvYmplY3RTaGFwZS5lZGdlc1tpMl0ucDEsIG9iamVjdFNoYXBlLmVkZ2VzW2kyXS5wMikpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7Ki9cclxuICAgIH1cclxuICAgIHB1YmxpYyByZWdpc3RlckNvbGxpc2lvbldpdGhNb3N0Q29ycmVjdFNvbHV0aW9uKFxyXG4gICAgICAgIGR5bmFtU2hhcGU6IFNoYXBlLFxyXG4gICAgICAgIHByZXZQb3NpdGlvbkRpZmZlcmVuY2U6IFZlY3RvcixcclxuICAgICAgICBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCxcclxuICAgICk6IHsgcG9zaXRpb25DaGFuZ2U6IFZlY3RvcjsgbW9tZW50dW1DaGFuZ2U6IFZlY3RvciB8IHVuZGVmaW5lZDsgYW5nbGU6IG51bWJlciB8IHVuZGVmaW5lZCB9IHwgdW5kZWZpbmVkIHtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBUaGlzIGFsZ29yaXRobSB0YWtlcyB0aGUgZHluYW1pYyBvYmplY3QncyBzaGFwZSBhbmQgdGhlIGRpZmZlcmVuY2UgYmV0d2VlbiBpdHMgY3VycmVudCBwb3NpdGlvbiBhbmQgaXRzIHBvc2l0aW9uIGxhc3QgZnJhbWUuXHJcbiAgICAgICAgICogV2UgYXNzdW1lIHRoZSBwb2ludCBkaWZmZXJlbmNlIGlzIHRoZSBcInByZXZpb3VzIG1vbWVudHVtLlwiXHJcbiAgICAgICAgICogV2UgY2hlY2sgaWYgYW55IG9mIHRoZSBkeW5hbU9iaidzIHBvaW50cyBjb2xsaWRlZCB3aXRoIHRoaXMgb2JqZWN0J3Mgc2hhcGUgZHVlIHRvIGl0J3MgcHJldmlvdXMgbW9tZW50dW0uXHJcbiAgICAgICAgICogSWYgc28sIHdlIGZpbmQgdGhlIGNsb3Nlc3QgaW50ZXJzZWN0aW9uIHBvaW50IHRvIHRoZSBkeW5hbU9iaidzIHByZXZpb3VzIHBvc2l0aW9uIGFuZCByZXR1cm4gaXQuXHJcbiAgICAgICAgICovXHJcblxyXG4gICAgICAgIGxldCBmdXJ0aGVzdEludGVyc2VjdGlvblBvaW50OiBWZWN0b3IgfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgbGV0IGZ1cnRoZXN0SW50ZXJzZWN0aW9uTGVuZ3RoOiBudW1iZXIgPSAwO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpOiBudW1iZXIgPSAwOyBpIDwgZHluYW1TaGFwZS5wb2ludHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgajogbnVtYmVyID0gMDsgaiA8IHRoaXMuZWRnZXMubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIGxldCBwb2ludE1vbWVudHVtTGluZVNlZ21lbnQ6IEVkZ2UgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcDE6IGR5bmFtU2hhcGUucG9pbnRzW2ldLFxyXG4gICAgICAgICAgICAgICAgICAgIHAyOiB7IHg6IGR5bmFtU2hhcGUucG9pbnRzW2ldLnggKyBwcmV2UG9zaXRpb25EaWZmZXJlbmNlLngsIHk6IGR5bmFtU2hhcGUucG9pbnRzW2ldLnkgKyBwcmV2UG9zaXRpb25EaWZmZXJlbmNlLnkgfSxcclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGludGVyc2VjdGlvblBvaW50OiB1bmRlZmluZWQgfCBWZWN0b3IgPSBmaW5kSW50ZXJzZWN0aW9uKHRoaXMuZWRnZXNbal0sIHBvaW50TW9tZW50dW1MaW5lU2VnbWVudCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGludGVyc2VjdGlvblBvaW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGludGVyc2VjdGlvbkRpc3RhbmNlRnJvbU9yaWdpbmFsUG9pbnQ6IG51bWJlciA9IGZpbmRMZW5ndGgoaW50ZXJzZWN0aW9uUG9pbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpbnRlcnNlY3Rpb25EaXN0YW5jZUZyb21PcmlnaW5hbFBvaW50ID4gZnVydGhlc3RJbnRlcnNlY3Rpb25MZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZnVydGhlc3RJbnRlcnNlY3Rpb25MZW5ndGggPSBpbnRlcnNlY3Rpb25EaXN0YW5jZUZyb21PcmlnaW5hbFBvaW50O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmdXJ0aGVzdEludGVyc2VjdGlvblBvaW50ID0gaW50ZXJzZWN0aW9uUG9pbnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZnVydGhlc3RJbnRlcnNlY3Rpb25Qb2ludCkge1xyXG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gXCJyZWRcIjtcclxuICAgICAgICAgICAgY3R4LmZpbGxSZWN0KGZ1cnRoZXN0SW50ZXJzZWN0aW9uUG9pbnQueCAtIDQsIGZ1cnRoZXN0SW50ZXJzZWN0aW9uUG9pbnQueSAtIDQsIDgsIDgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVnaXN0ZXJDb2xsaXNpb25XaXRoQ2xvc2VzdFNvbHV0aW9uKFxyXG4gICAgICAgIG9iamVjdFNoYXBlOiBTaGFwZSxcclxuICAgICAgICBtb21lbnR1bTogVmVjdG9yLFxyXG4gICAgKTogeyBwb3NpdGlvbkNoYW5nZTogVmVjdG9yOyBtb21lbnR1bUNoYW5nZTogVmVjdG9yIHwgdW5kZWZpbmVkOyBhbmdsZTogbnVtYmVyIHwgdW5kZWZpbmVkIH0ge1xyXG4gICAgICAgIGxldCBsb3dlc3RFZGdlOiBEb29kYWRFZGdlID0gdGhpcy5lZGdlc1swXTtcclxuICAgICAgICBsZXQgbG93ZXN0RGlzdGFuY2U6IG51bWJlciA9IDEwMDAwO1xyXG5cclxuICAgICAgICB0aGlzLmVkZ2VzLmZvckVhY2goKGRvb2RhZEVkZ2UpID0+IHtcclxuICAgICAgICAgICAgLy9mb3IgZWFjaCBzdGF0aWMgb2JqZWN0IGVkZ2UsXHJcbiAgICAgICAgICAgIGxldCBtaW5Qcm9qZWN0ZWREaXN0YW5jZTogbnVtYmVyID0gMDtcclxuXHJcbiAgICAgICAgICAgIG9iamVjdFNoYXBlLnBvaW50cy5mb3JFYWNoKChwb2ludCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IHBvaW50RGlmZmVyZW5jZTogVmVjdG9yID0gZmluZERpZmZlcmVuY2UoZG9vZGFkRWRnZS5wMSwgcG9pbnQpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHByb2plY3Rpb246IFZlY3RvciA9IHZlY3RvclByb2plY3QocG9pbnREaWZmZXJlbmNlLCBkb29kYWRFZGdlLm9ydGhvZ29uYWxWZWN0b3IpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vY2FsY3VsYXRlIHRoZSBkaXN0YW5jZSB0byBtb3ZlIHRoZSBvYmplY3QncyBwb2ludCB3aXRoIHRoZSBsb3dlc3QgcHJvamVjdGlvbiBvbnRvIHRoZSBvcnRob2dvbmFsIGxpbmVcclxuICAgICAgICAgICAgICAgIGlmIChwcm9qZWN0aW9uLnkgKiBkb29kYWRFZGdlLm9ydGhvZ29uYWxWZWN0b3IueSA8IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgZGlzdGFuY2U6IG51bWJlciA9IGZpbmRMZW5ndGgocHJvamVjdGlvbik7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRpc3RhbmNlID4gbWluUHJvamVjdGVkRGlzdGFuY2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWluUHJvamVjdGVkRGlzdGFuY2UgPSBkaXN0YW5jZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvL3NhdmUgdGhlIGVkZ2UgYW5kIHRoZSBiaWdnZXN0IGRpc3RhbmNlIG9mIHRoZSBwb2ludHNcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpZiAobWluUHJvamVjdGVkRGlzdGFuY2UgPCBsb3dlc3REaXN0YW5jZSkge1xyXG4gICAgICAgICAgICAgICAgLy9maW5kIHRoZSBlZGdlIHdpdGggdGhlIGxvd2VzdCBkaXN0YW5jZVxyXG4gICAgICAgICAgICAgICAgbG93ZXN0RGlzdGFuY2UgPSBtaW5Qcm9qZWN0ZWREaXN0YW5jZTtcclxuICAgICAgICAgICAgICAgIGxvd2VzdEVkZ2UgPSBkb29kYWRFZGdlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vZmluZCB0aGUgcG9zaXRpb25DaGFuZ2UgYmFzZWQgb24gdGhlIGRpc3RhbmNlICogb3J0aGFub3JtYWwgdmVjdG9yXHJcbiAgICAgICAgbGV0IHBvc2l0aW9uQ2hhbmdlOiBWZWN0b3IgPSB7XHJcbiAgICAgICAgICAgIHg6IGxvd2VzdEVkZ2Uub3J0aG9nb25hbFZlY3Rvci54ICogbG93ZXN0RGlzdGFuY2UsXHJcbiAgICAgICAgICAgIHk6IGxvd2VzdEVkZ2Uub3J0aG9nb25hbFZlY3Rvci55ICogbG93ZXN0RGlzdGFuY2UsXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy9maW5kIG1vbWVudHVtIGNoYW5nZSBvbmx5IGlmIHRoZSBjdXJyZW50IG1vbWVudHVtIGhhcyBhIG5lZ2F0aXZlIHByb2plY3Rpb24gb250byB0aGUgb3J0aGFub3JtYWwgdmVjdG9yXHJcbiAgICAgICAgbGV0IG1vbWVudHVtQ2hhbmdlOiBWZWN0b3IgPSB2ZWN0b3JQcm9qZWN0KG1vbWVudHVtLCBsb3dlc3RFZGdlLnNsb3BlKTtcclxuXHJcbiAgICAgICAgLy9yZXR1cm4gYW5nbGUgaWYgdGhlIGVkZ2UgaXMgYSBcInN0YW5kaW5nXCIgZWRnZVxyXG4gICAgICAgIGxldCBhbmdsZTogbnVtYmVyIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIGlmIChsb3dlc3RFZGdlLmlzR3JvdW5kKSB7XHJcbiAgICAgICAgICAgIGFuZ2xlID0gbG93ZXN0RWRnZS5hbmdsZTtcclxuICAgICAgICAgICAgLy9hbmQgbWFrZSB0aGUgcG9zaXRpb25jaGFuZ2UgdmVydGljYWxcclxuICAgICAgICAgICAgcG9zaXRpb25DaGFuZ2UgPSByb3RhdGVWZWN0b3IoLWxvd2VzdEVkZ2UuYW5nbGUsIHBvc2l0aW9uQ2hhbmdlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB7IHBvc2l0aW9uQ2hhbmdlLCBtb21lbnR1bUNoYW5nZSwgYW5nbGUgfTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBHYW1lIH0gZnJvbSBcIi4uLy4uLy4uL2NsaWVudC9nYW1lXCI7XHJcbmltcG9ydCB7IGRlZmF1bHRDb25maWcgfSBmcm9tIFwiLi4vLi4vLi4vY29uZmlnXCI7XHJcbmltcG9ydCB7IGZpbmRBbmdsZSB9IGZyb20gXCIuLi8uLi8uLi9maW5kQW5nbGVcIjtcclxuaW1wb3J0IHsgU2l6ZSB9IGZyb20gXCIuLi8uLi8uLi9zaXplXCI7XHJcbmltcG9ydCB7IHJvb3RLZWVwU2lnbiwgVmVjdG9yIH0gZnJvbSBcIi4uLy4uLy4uL3ZlY3RvclwiO1xyXG5pbXBvcnQgeyBkZWZhdWx0QWN0b3JDb25maWcgfSBmcm9tIFwiLi4vLi4vbmV3QWN0b3JzL2FjdG9yQ29uZmlnXCI7XHJcbmltcG9ydCB7IEZsb29yIH0gZnJvbSBcIi4vZmxvb3JcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBDbGllbnRGbG9vciBleHRlbmRzIEZsb29yIHtcclxuICAgIHByaXZhdGUgZ2FtZUhlaWdodDogbnVtYmVyID0gZGVmYXVsdENvbmZpZy55U2l6ZTtcclxuICAgIHByaXZhdGUgZ2FtZVdpZHRoOiBudW1iZXIgPSBkZWZhdWx0Q29uZmlnLnhTaXplO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHByb3RlY3RlZCBnYW1lOiBHYW1lLFxyXG4gICAgICAgIHBvaW50c0FuZEFuZ2xlczogeyBwb2ludDogbnVtYmVyOyBhbmdsZTogbnVtYmVyOyBzbG9wZTogbnVtYmVyIH1bXSxcclxuICAgICAgICBwb2ludENvdW50OiBudW1iZXIsXHJcbiAgICAgICAgcmVzdWx0V2lkdGg6IG51bWJlcixcclxuICAgICAgICBwdWJsaWMgY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsXHJcbiAgICApIHtcclxuICAgICAgICBzdXBlcihwb2ludENvdW50LCByZXN1bHRXaWR0aCwgcG9pbnRzQW5kQW5nbGVzKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVuZGVyKHNjcmVlblBvczogVmVjdG9yLCBzY3JlZW5TaXplOiBTaXplKSB7XHJcbiAgICAgICAgdGhpcy5jdHguZmlsbFN0eWxlID0gXCIjMWI0YTIwXCI7IC8vXCJ3aGl0ZVwiO1xyXG5cclxuICAgICAgICB0aGlzLmN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICB0aGlzLmN0eC5tb3ZlVG8oMCwgdGhpcy5wb2ludHNBbmRBbmdsZXNbMF0ucG9pbnQpO1xyXG4gICAgICAgIGZvciAobGV0IGk6IG51bWJlciA9IDE7IGkgPCB0aGlzLnBvaW50Q291bnQ7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLmN0eC5saW5lVG8oaSAqIHRoaXMucmVzdWx0V2lkdGgsIHRoaXMucG9pbnRzQW5kQW5nbGVzW2ldLnBvaW50KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yIChsZXQgaTogbnVtYmVyID0gdGhpcy5wb2ludENvdW50IC0gMTsgaSA+PSAwOyBpLS0pIHtcclxuICAgICAgICAgICAgdGhpcy5jdHgubGluZVRvKGkgKiB0aGlzLnJlc3VsdFdpZHRoLCB0aGlzLnBvaW50c0FuZEFuZ2xlc1tpXS5wb2ludCArIDE1KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5jdHguZmlsbCgpO1xyXG5cclxuICAgICAgICB0aGlzLmN0eC5maWxsU3R5bGUgPSBkZWZhdWx0QWN0b3JDb25maWcuZGlydENvbG9yTmlnaHQ7XHJcblxyXG4gICAgICAgIHRoaXMuY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIHRoaXMuY3R4Lm1vdmVUbygwLCB0aGlzLmdhbWVIZWlnaHQgKyAxMCk7XHJcbiAgICAgICAgZm9yIChsZXQgaTogbnVtYmVyID0gMDsgaSA8IHRoaXMucG9pbnRDb3VudDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY3R4LmxpbmVUbyhpICogdGhpcy5yZXN1bHRXaWR0aCwgdGhpcy5wb2ludHNBbmRBbmdsZXNbaV0ucG9pbnQgKyAxNCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuY3R4LmxpbmVUbygodGhpcy5wb2ludENvdW50IC0gMSkgKiB0aGlzLnJlc3VsdFdpZHRoLCB0aGlzLmdhbWVIZWlnaHQgKyAxMCk7XHJcbiAgICAgICAgdGhpcy5jdHguZmlsbCgpO1xyXG5cclxuICAgICAgICB0aGlzLmN0eC5maWxsUmVjdChcclxuICAgICAgICAgICAgTWF0aC5tYXgoc2NyZWVuUG9zLngsIDApLFxyXG4gICAgICAgICAgICB0aGlzLmdhbWVIZWlnaHQgKyA1LFxyXG4gICAgICAgICAgICBNYXRoLm1pbihzY3JlZW5TaXplLndpZHRoLCB0aGlzLmdhbWVXaWR0aCAtIHNjcmVlblBvcy54KSxcclxuICAgICAgICAgICAgc2NyZWVuU2l6ZS5oZWlnaHQgKyBzY3JlZW5Qb3MueSxcclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcbiIsImV4cG9ydCBhYnN0cmFjdCBjbGFzcyBGbG9vciB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgcG9pbnRDb3VudDogbnVtYmVyLCBwcm90ZWN0ZWQgcmVzdWx0V2lkdGg6IG51bWJlciwgcHJvdGVjdGVkIHBvaW50c0FuZEFuZ2xlczogeyBwb2ludDogbnVtYmVyOyBhbmdsZTogbnVtYmVyOyBzbG9wZTogbnVtYmVyIH1bXSkge31cclxuXHJcbiAgICBwdWJsaWMgZ2V0WUNvb3JkQW5kQW5nbGUoeFBvczogbnVtYmVyKTogeyB5Q29vcmQ6IG51bWJlcjsgYW5nbGU6IG51bWJlciB9IHtcclxuICAgICAgICBsZXQgaTogbnVtYmVyID0gTWF0aC5mbG9vcih4UG9zIC8gdGhpcy5yZXN1bHRXaWR0aCk7XHJcbiAgICAgICAgaWYgKGkgPCAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7IHlDb29yZDogdGhpcy5wb2ludHNBbmRBbmdsZXNbMF0ucG9pbnQsIGFuZ2xlOiB0aGlzLnBvaW50c0FuZEFuZ2xlc1swXS5hbmdsZSB9O1xyXG4gICAgICAgIH0gZWxzZSBpZiAoaSA+PSB0aGlzLnBvaW50Q291bnQgLSAxKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICB5Q29vcmQ6IHRoaXMucG9pbnRzQW5kQW5nbGVzW3RoaXMucG9pbnRDb3VudCAtIDFdLnBvaW50LFxyXG4gICAgICAgICAgICAgICAgYW5nbGU6IHRoaXMucG9pbnRzQW5kQW5nbGVzW3RoaXMucG9pbnRDb3VudCAtIDFdLmFuZ2xlLFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxldCBwZXJjZW50YWdlOiBudW1iZXIgPSB4UG9zIC8gdGhpcy5yZXN1bHRXaWR0aCAtIGk7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICB5Q29vcmQ6IHRoaXMucG9pbnRzQW5kQW5nbGVzW2ldLnBvaW50ICsgdGhpcy5wb2ludHNBbmRBbmdsZXNbaV0uc2xvcGUgKiBwZXJjZW50YWdlLFxyXG4gICAgICAgICAgICAgICAgYW5nbGU6IHRoaXMucG9pbnRzQW5kQW5nbGVzW2ldLmFuZ2xlLFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBWZWN0b3IgfSBmcm9tIFwiLi92ZWN0b3JcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBSYW5kb20ge1xyXG4gICAgcHVibGljIHN0YXRpYyBuZXh0RG91YmxlKCkge1xyXG4gICAgICAgIHJldHVybiBNYXRoLnJhbmRvbSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgcmFuZ2UobWluOiBudW1iZXIsIG1heDogbnVtYmVyKTogbnVtYmVyIHtcclxuICAgICAgICBsZXQgcmFuZ2UgPSBtYXggLSBtaW47XHJcbiAgICAgICAgcmV0dXJuIE1hdGgucmFuZG9tKCkgKiByYW5nZSArIG1pbjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIHJhbmdlRmxvb3IobWluOiBudW1iZXIsIG1heDogbnVtYmVyKTogbnVtYmVyIHtcclxuICAgICAgICBsZXQgcmFuZ2UgPSBtYXggLSBtaW47XHJcbiAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHJhbmdlICsgbWluKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIG5leHRDaXJjbGVWZWN0b3IoKTogVmVjdG9yIHtcclxuICAgICAgICBsZXQgYW5nbGUgPSBNYXRoLnJhbmRvbSgpICogMiAqIE1hdGguUEk7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgeDogTWF0aC5jb3MoYW5nbGUpLFxyXG4gICAgICAgICAgICB5OiBNYXRoLnNpbihhbmdsZSksXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyB1c2VQcmV2aW91cyA9IGZhbHNlO1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgeTIgPSAwO1xyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgbmV4dEdhdXNzaWFuKG1lYW46IG51bWJlciwgc3RkRGV2OiBudW1iZXIpIHtcclxuICAgICAgICBsZXQgeDEgPSAwO1xyXG4gICAgICAgIGxldCB4MiA9IDA7XHJcbiAgICAgICAgbGV0IHkxID0gMDtcclxuICAgICAgICBsZXQgeiA9IDA7XHJcblxyXG4gICAgICAgIGlmIChSYW5kb20udXNlUHJldmlvdXMpIHtcclxuICAgICAgICAgICAgUmFuZG9tLnVzZVByZXZpb3VzID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHJldHVybiBtZWFuICsgUmFuZG9tLnkyICogc3RkRGV2O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZG8ge1xyXG4gICAgICAgICAgICB4MSA9IDIgKiBNYXRoLnJhbmRvbSgpIC0gMTtcclxuICAgICAgICAgICAgeDIgPSAyICogTWF0aC5yYW5kb20oKSAtIDE7XHJcbiAgICAgICAgICAgIHogPSB4MSAqIHgxICsgeDIgKiB4MjtcclxuICAgICAgICB9IHdoaWxlICh6ID49IDEpO1xyXG5cclxuICAgICAgICB6ID0gTWF0aC5zcXJ0KCgtMiAqIE1hdGgubG9nKHopKSAvIHopO1xyXG4gICAgICAgIHkxID0geDEgKiB6O1xyXG4gICAgICAgIFJhbmRvbS55MiA9IHgyICogejtcclxuXHJcbiAgICAgICAgcmV0dXJuIG1lYW4gKyB5MSAqIHN0ZERldjtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBmaW5kQW5nbGUgfSBmcm9tIFwiLi9maW5kQW5nbGVcIjtcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgVmVjdG9yIHtcclxuICAgIHg6IG51bWJlcjtcclxuICAgIHk6IG51bWJlcjtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBFZGdlIHtcclxuICAgIHAxOiBWZWN0b3I7XHJcbiAgICBwMjogVmVjdG9yO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIERvb2RhZEVkZ2Uge1xyXG4gICAgcDE6IFZlY3RvcjtcclxuICAgIHAyOiBWZWN0b3I7XHJcbiAgICBhbmdsZTogbnVtYmVyO1xyXG4gICAgc2xvcGU6IFZlY3RvcjtcclxuICAgIGlzR3JvdW5kOiBib29sZWFuO1xyXG4gICAgb3J0aG9nb25hbFZlY3RvcjogVmVjdG9yO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFNoYXBlIHtcclxuICAgIGNlbnRlcjogVmVjdG9yO1xyXG4gICAgcG9pbnRzOiBWZWN0b3JbXTtcclxuICAgIGVkZ2VzOiBFZGdlW107XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBmaW5kVmVjdG9yRnJvbUFuZ2xlKGFuZ2xlOiBudW1iZXIsIG1hZ25pdHVkZTogbnVtYmVyID0gMSk6IFZlY3RvciB7XHJcbiAgICByZXR1cm4geyB4OiBNYXRoLmNvcyhhbmdsZSkgKiBtYWduaXR1ZGUsIHk6IE1hdGguc2luKGFuZ2xlKSAqIG1hZ25pdHVkZSB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZmluZERpc3RhbmNlKGE6IFZlY3RvciwgYjogVmVjdG9yKTogbnVtYmVyIHtcclxuICAgIHJldHVybiBNYXRoLnNxcnQoTWF0aC5wb3coYS54IC0gYi54LCAyKSArIE1hdGgucG93KGEueSAtIGIueSwgMikpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZmluZERpZmZlcmVuY2UoYTogVmVjdG9yLCBiOiBWZWN0b3IpOiBWZWN0b3Ige1xyXG4gICAgcmV0dXJuIHsgeDogYi54IC0gYS54LCB5OiBiLnkgLSBhLnkgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGZpbmRMZW5ndGgodmVjdG9yOiBWZWN0b3IpOiBudW1iZXIge1xyXG4gICAgcmV0dXJuIE1hdGguc3FydChNYXRoLnBvdyh2ZWN0b3IueCwgMikgKyBNYXRoLnBvdyh2ZWN0b3IueSwgMikpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcm90YXRlVmVjdG9yKGFuZ2xlOiBudW1iZXIsIHZlY3RvcjogVmVjdG9yKTogVmVjdG9yIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgeDogdmVjdG9yLnggKiBNYXRoLmNvcyhhbmdsZSkgLSB2ZWN0b3IueSAqIE1hdGguc2luKGFuZ2xlKSxcclxuICAgICAgICB5OiB2ZWN0b3IueCAqIE1hdGguc2luKGFuZ2xlKSArIHZlY3Rvci55ICogTWF0aC5jb3MoYW5nbGUpLFxyXG4gICAgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGZpbmRNaXJyb3JlZEFuZ2xlKGFuZ2xlOiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgaWYgKGFuZ2xlIDwgTWF0aC5QSSAvIC0yKSB7XHJcbiAgICAgICAgcmV0dXJuIC1NYXRoLlBJIC0gYW5nbGU7XHJcbiAgICB9IGVsc2UgaWYgKGFuZ2xlID4gTWF0aC5QSSAvIDIpIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5QSSAtIGFuZ2xlO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gYW5nbGU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByb3RhdGVTaGFwZShzaGFwZTogVmVjdG9yW10sIGFuZ2xlOiBudW1iZXIsIHBvc2l0aW9uT2Zmc2V0OiBWZWN0b3IsIGZsaXBPdmVyWTogYm9vbGVhbiA9IGZhbHNlKTogVmVjdG9yW10ge1xyXG4gICAgbGV0IG5ld1ZlY3RvckFycmF5OiBWZWN0b3JbXSA9IFtdO1xyXG5cclxuICAgIGZvciAodmFyIGk6IG51bWJlciA9IDA7IGkgPCBzaGFwZS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIG5ld1ZlY3RvckFycmF5LnB1c2goeyB4OiBzaGFwZVtpXS54ICsgMCwgeTogc2hhcGVbaV0ueSArIDAgfSk7XHJcblxyXG4gICAgICAgIGxldCB0YW46IG51bWJlciA9IGZpbmRBbmdsZSh7IHg6IDAsIHk6IDAgfSwgeyB4OiBuZXdWZWN0b3JBcnJheVtpXS54LCB5OiBuZXdWZWN0b3JBcnJheVtpXS55IH0pO1xyXG4gICAgICAgIGxldCBtYWc6IG51bWJlciA9IGZpbmRMZW5ndGgobmV3VmVjdG9yQXJyYXlbaV0pO1xyXG4gICAgICAgIG5ld1ZlY3RvckFycmF5W2ldLnggPSBtYWcgKiBNYXRoLmNvcyh0YW4gKyBhbmdsZSk7XHJcbiAgICAgICAgbmV3VmVjdG9yQXJyYXlbaV0ueSA9IG1hZyAqIE1hdGguc2luKHRhbiArIGFuZ2xlKSArIHBvc2l0aW9uT2Zmc2V0Lnk7XHJcblxyXG4gICAgICAgIGlmIChmbGlwT3ZlclkpIHtcclxuICAgICAgICAgICAgLy8gZmxpcCBpdCBhcm91bmQgaWYgdGhleSdyZSBmYWNpbmcgbGVmdFxyXG4gICAgICAgICAgICBuZXdWZWN0b3JBcnJheVtpXS54ICo9IC0xO1xyXG4gICAgICAgIH1cclxuICAgICAgICBuZXdWZWN0b3JBcnJheVtpXS54ICs9IHBvc2l0aW9uT2Zmc2V0Lng7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbmV3VmVjdG9yQXJyYXk7XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIGRvdFByb2R1Y3QodjE6IFZlY3RvciwgdjI6IFZlY3Rvcik6IG51bWJlciB7XHJcbiAgICByZXR1cm4gdjEueCAqIHYyLnggKyB2MS55ICogdjIueTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHZlY3RvclByb2plY3QodjE6IFZlY3RvciwgdjI6IFZlY3Rvcik6IFZlY3RvciB7XHJcbiAgICB2YXIgbm9ybTogbnVtYmVyID0gZmluZERpc3RhbmNlKHsgeDogMCwgeTogMCB9LCB2Mik7XHJcbiAgICB2YXIgc2NhbGFyOiBudW1iZXIgPSBkb3RQcm9kdWN0KHYxLCB2MikgLyBNYXRoLnBvdyhub3JtLCAyKTtcclxuICAgIHJldHVybiB7IHg6IHYyLnggKiBzY2FsYXIsIHk6IHYyLnkgKiBzY2FsYXIgfTtcclxufVxyXG5mdW5jdGlvbiBkaXN0Mih2OiBWZWN0b3IsIHc6IFZlY3Rvcik6IG51bWJlciB7XHJcbiAgICByZXR1cm4gTWF0aC5wb3codi54IC0gdy54LCAyKSArIE1hdGgucG93KHYueSAtIHcueSwgMik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBmaW5kTWluRGlzdGFuY2VQb2ludFRvRWRnZShwb2ludDogVmVjdG9yLCBlZGdlOiBFZGdlKTogVmVjdG9yIHtcclxuICAgIHZhciBsMiA9IGRpc3QyKGVkZ2UucDEsIGVkZ2UucDIpO1xyXG4gICAgaWYgKGwyID09PSAwKSByZXR1cm4geyB4OiBlZGdlLnAxLnggLSBwb2ludC54LCB5OiBlZGdlLnAxLnkgLSBwb2ludC55IH07XHJcbiAgICB2YXIgdCA9ICgocG9pbnQueCAtIGVkZ2UucDEueCkgKiAoZWRnZS5wMi54IC0gZWRnZS5wMS54KSArIChwb2ludC55IC0gZWRnZS5wMS55KSAqIChlZGdlLnAyLnkgLSBlZGdlLnAxLnkpKSAvIGwyO1xyXG4gICAgdCA9IE1hdGgubWF4KDAsIE1hdGgubWluKDEsIHQpKTtcclxuICAgIGxldCBjbG9zZXN0UG9pbnQ6IFZlY3RvciA9IHsgeDogZWRnZS5wMS54ICsgdCAqIChlZGdlLnAyLnggLSBlZGdlLnAxLngpLCB5OiBlZGdlLnAxLnkgKyB0ICogKGVkZ2UucDIueSAtIGVkZ2UucDEueSkgfTtcclxuICAgIHJldHVybiB7IHg6IGNsb3Nlc3RQb2ludC54IC0gcG9pbnQueCwgeTogY2xvc2VzdFBvaW50LnkgLSBwb2ludC55IH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByb290S2VlcFNpZ24obnVtYmVyOiBudW1iZXIsIHJvb3Q6IG51bWJlcik6IG51bWJlciB7XHJcbiAgICBpZiAobnVtYmVyID49IDApIHJldHVybiBNYXRoLnBvdyhudW1iZXIsIDEgLyByb290KTtcclxuICAgIGVsc2UgcmV0dXJuIE1hdGgucG93KE1hdGguYWJzKG51bWJlciksIDEgLyByb290KSAqIC0xO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZmluZE9ydGhvbm9ybWFsVmVjdG9yKHZlY3RvcjE6IFZlY3RvciwgdmVjdG9yMjogVmVjdG9yKTogVmVjdG9yIHtcclxuICAgIGxldCBtYWduaXR1ZGU6IG51bWJlciA9IGZpbmREaXN0YW5jZSh2ZWN0b3IxLCB2ZWN0b3IyKTtcclxuICAgIHJldHVybiB7IHg6ICh2ZWN0b3IyLnkgLSB2ZWN0b3IxLnkpIC8gbWFnbml0dWRlLCB5OiAodmVjdG9yMS54IC0gdmVjdG9yMi54KSAvIG1hZ25pdHVkZSB9O1xyXG59XHJcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdGlmKF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0pIHtcblx0XHRyZXR1cm4gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGVcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG5fX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvY2xpZW50L2luZGV4LnRzXCIpO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==