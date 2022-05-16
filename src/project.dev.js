window.__require = function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var b = o.split("/");
        b = b[b.length - 1];
        if (!t[b]) {
          var a = "function" == typeof __require && __require;
          if (!u && a) return a(b, !0);
          if (i) return i(b, !0);
          throw new Error("Cannot find module '" + o + "'");
        }
      }
      var f = n[o] = {
        exports: {}
      };
      t[o][0].call(f.exports, function(e) {
        var n = t[o][1][e];
        return s(n || e);
      }, f, f.exports, e, t, n, r);
    }
    return n[o].exports;
  }
  var i = "function" == typeof __require && __require;
  for (var o = 0; o < r.length; o++) s(r[o]);
  return s;
}({
  1: [ function(require, module, exports) {
    function EventEmitter() {
      this._events = this._events || {};
      this._maxListeners = this._maxListeners || void 0;
    }
    module.exports = EventEmitter;
    EventEmitter.EventEmitter = EventEmitter;
    EventEmitter.prototype._events = void 0;
    EventEmitter.prototype._maxListeners = void 0;
    EventEmitter.defaultMaxListeners = 10;
    EventEmitter.prototype.setMaxListeners = function(n) {
      if (!isNumber(n) || n < 0 || isNaN(n)) throw TypeError("n must be a positive number");
      this._maxListeners = n;
      return this;
    };
    EventEmitter.prototype.emit = function(type) {
      var er, handler, len, args, i, listeners;
      this._events || (this._events = {});
      if ("error" === type && (!this._events.error || isObject(this._events.error) && !this._events.error.length)) {
        er = arguments[1];
        if (er instanceof Error) throw er;
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ")");
        err.context = er;
        throw err;
      }
      handler = this._events[type];
      if (isUndefined(handler)) return false;
      if (isFunction(handler)) switch (arguments.length) {
       case 1:
        handler.call(this);
        break;

       case 2:
        handler.call(this, arguments[1]);
        break;

       case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;

       default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
      } else if (isObject(handler)) {
        args = Array.prototype.slice.call(arguments, 1);
        listeners = handler.slice();
        len = listeners.length;
        for (i = 0; i < len; i++) listeners[i].apply(this, args);
      }
      return true;
    };
    EventEmitter.prototype.addListener = function(type, listener) {
      var m;
      if (!isFunction(listener)) throw TypeError("listener must be a function");
      this._events || (this._events = {});
      this._events.newListener && this.emit("newListener", type, isFunction(listener.listener) ? listener.listener : listener);
      this._events[type] ? isObject(this._events[type]) ? this._events[type].push(listener) : this._events[type] = [ this._events[type], listener ] : this._events[type] = listener;
      if (isObject(this._events[type]) && !this._events[type].warned) {
        m = isUndefined(this._maxListeners) ? EventEmitter.defaultMaxListeners : this._maxListeners;
        if (m && m > 0 && this._events[type].length > m) {
          this._events[type].warned = true;
          console.error("(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.", this._events[type].length);
          "function" === typeof console.trace && console.trace();
        }
      }
      return this;
    };
    EventEmitter.prototype.on = EventEmitter.prototype.addListener;
    EventEmitter.prototype.once = function(type, listener) {
      if (!isFunction(listener)) throw TypeError("listener must be a function");
      var fired = false;
      function g() {
        this.removeListener(type, g);
        if (!fired) {
          fired = true;
          listener.apply(this, arguments);
        }
      }
      g.listener = listener;
      this.on(type, g);
      return this;
    };
    EventEmitter.prototype.removeListener = function(type, listener) {
      var list, position, length, i;
      if (!isFunction(listener)) throw TypeError("listener must be a function");
      if (!this._events || !this._events[type]) return this;
      list = this._events[type];
      length = list.length;
      position = -1;
      if (list === listener || isFunction(list.listener) && list.listener === listener) {
        delete this._events[type];
        this._events.removeListener && this.emit("removeListener", type, listener);
      } else if (isObject(list)) {
        for (i = length; i-- > 0; ) if (list[i] === listener || list[i].listener && list[i].listener === listener) {
          position = i;
          break;
        }
        if (position < 0) return this;
        if (1 === list.length) {
          list.length = 0;
          delete this._events[type];
        } else list.splice(position, 1);
        this._events.removeListener && this.emit("removeListener", type, listener);
      }
      return this;
    };
    EventEmitter.prototype.removeAllListeners = function(type) {
      var key, listeners;
      if (!this._events) return this;
      if (!this._events.removeListener) {
        0 === arguments.length ? this._events = {} : this._events[type] && delete this._events[type];
        return this;
      }
      if (0 === arguments.length) {
        for (key in this._events) {
          if ("removeListener" === key) continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners("removeListener");
        this._events = {};
        return this;
      }
      listeners = this._events[type];
      if (isFunction(listeners)) this.removeListener(type, listeners); else if (listeners) while (listeners.length) this.removeListener(type, listeners[listeners.length - 1]);
      delete this._events[type];
      return this;
    };
    EventEmitter.prototype.listeners = function(type) {
      var ret;
      ret = this._events && this._events[type] ? isFunction(this._events[type]) ? [ this._events[type] ] : this._events[type].slice() : [];
      return ret;
    };
    EventEmitter.prototype.listenerCount = function(type) {
      if (this._events) {
        var evlistener = this._events[type];
        if (isFunction(evlistener)) return 1;
        if (evlistener) return evlistener.length;
      }
      return 0;
    };
    EventEmitter.listenerCount = function(emitter, type) {
      return emitter.listenerCount(type);
    };
    function isFunction(arg) {
      return "function" === typeof arg;
    }
    function isNumber(arg) {
      return "number" === typeof arg;
    }
    function isObject(arg) {
      return "object" === typeof arg && null !== arg;
    }
    function isUndefined(arg) {
      return void 0 === arg;
    }
  }, {} ],
  Audio: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "663abaTZitBqowhdSN/juso", "Audio");
    "use strict";
    var Emitter = require("mEmitter");
    var Variables = require("Variables");
    cc.Class({
      extends: cc.Component,
      properties: {
        audioBackground: {
          default: null,
          type: cc.AudioClip
        },
        audioBoom: {
          default: null,
          type: cc.AudioClip
        },
        audioShoot: {
          default: null,
          type: cc.AudioClip
        },
        audioJump: {
          default: null,
          type: cc.AudioClip
        },
        audioRun: {
          default: null,
          type: cc.AudioClip
        },
        audioDeath: {
          default: null,
          type: cc.AudioClip
        },
        audioBoss: {
          default: null,
          type: cc.AudioClip
        },
        audioPrincess: {
          default: null,
          type: cc.AudioClip
        },
        audioLose: {
          default: null,
          type: cc.AudioClip
        },
        audioWin: {
          default: null,
          type: cc.AudioClip
        }
      },
      onLoad: function onLoad() {
        Emitter.instance.emit(Variables.transAudio, this);
      },
      start: function start() {},
      playAudioBoom: function playAudioBoom() {
        this.pauseAll();
        cc.audioEngine.play(this.audioBoom, false);
      },
      playAudioBackground: function playAudioBackground() {
        this.pauseAll();
        cc.audioEngine.play(this.audioBackground, false);
      },
      playAudioJump: function playAudioJump() {
        this.pauseAll();
        cc.audioEngine.play(this.audioJump, false);
      },
      playAudioShoot: function playAudioShoot() {
        this.pauseAll();
        cc.audioEngine.play(this.audioShoot, false);
      },
      playAudioRun: function playAudioRun() {
        this.pauseAll();
        cc.audioEngine.play(this.audioRun, false);
      },
      playAudioDeath: function playAudioDeath() {
        this.pauseAll();
        cc.audioEngine.play(this.audioDeath, false);
      },
      playAudioBoss: function playAudioBoss() {
        this.pauseAll();
        cc.audioEngine.play(this.audioBoss, false);
      },
      playAudioPrincess: function playAudioPrincess() {
        this.pauseAll();
        cc.audioEngine.play(this.audioPrincess, false);
      },
      playAudioLose: function playAudioLose() {
        this.pauseAll();
        cc.audioEngine.play(this.audioLose, false);
      },
      playAudioWin: function playAudioWin() {
        this.pauseAll();
        cc.audioEngine.play(this.audioWin, false);
      },
      pauseAll: function pauseAll() {
        cc.audioEngine.pauseAll();
      },
      onDestroy: function onDestroy() {}
    });
    cc._RF.pop();
  }, {
    Variables: "Variables",
    mEmitter: "mEmitter"
  } ],
  Bird: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "429d0zMLsZKZqWGYno+LRYS", "Bird");
    "use strict";
    var Emitter = require("mEmitter");
    var Variables = require("Variables");
    cc.Class({
      extends: cc.Component,
      properties: {},
      onLoad: function onLoad() {
        Emitter.instance.emit(Variables.transBird, this);
      },
      stopAllAnim: function stopAllAnim() {
        var anim = this.node.getComponent(cc.Animation);
        anim.enabled = false;
        this.node.stopAllActions();
      },
      fly: function fly() {
        var actions = [ cc.moveBy(10, 1500, 0), cc.moveTo(0, -100, 650) ];
        this.node.runAction(cc.repeatForever(cc.sequence(actions)));
      },
      start: function start() {}
    });
    cc._RF.pop();
  }, {
    Variables: "Variables",
    mEmitter: "mEmitter"
  } ],
  Controller: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "757b48IZlNCx4Y880mzwNp8", "Controller");
    "use strict";
    var Emitter = require("mEmitter");
    var Variables = require("Variables");
    cc.Class({
      extends: cc.Component,
      properties: {
        boom: cc.Node,
        resultBoard: require("ResultBoard")
      },
      onLoad: function onLoad() {
        Emitter.instance = new Emitter();
        Emitter.instance.registerEvent(Variables.transBoss, this.transBoss, this);
        Emitter.instance.registerEvent(Variables.transPlayer, this.transPlayer, this);
        Emitter.instance.registerEvent(Variables.transAudio, this.transAudio, this);
        Emitter.instance.registerEvent(Variables.transScore, this.transScore, this);
        Emitter.instance.registerEvent(Variables.transPrincess, this.transPrincess, this);
        Emitter.instance.registerEvent(Variables.transBird, this.transBird, this);
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        manager.enabledDebugDraw = true;
        manager.enabledDrawBoundingBox = true;
      },
      transBird: function transBird(data) {
        Variables.bird = data;
      },
      transPrincess: function transPrincess(data) {
        Variables.princess = data;
      },
      transScore: function transScore(data) {
        Variables.score = data;
      },
      transBoss: function transBoss(data) {
        Variables.boss = data;
      },
      transPlayer: function transPlayer(data) {
        Variables.player = data;
      },
      transAudio: function transAudio(data) {
        Variables.audio = data;
      },
      transBullet: function transBullet(data) {
        Variables.bullet = data;
      },
      loadAnimBackground: function loadAnimBackground() {
        Variables.audio.playAudioBackground();
        Variables.boss.anim();
        Variables.princess.anim();
        Variables.bird.fly();
        Variables.score.updateScore();
      },
      stopAllAnimBackground: function stopAllAnimBackground() {
        cc.log("Stop All");
        Variables.bird.stopAllAnim();
        Variables.score.node.stopAllActions();
        Variables.boss.stopAllAnim();
        Variables.princess.stopAllAnim();
      },
      init: function init() {},
      start: function start() {
        this.resultBoard.node.active = false;
        Emitter.instance.emit(Variables.transBackGround, this);
        this.loadAnimBackground();
        Variables.player.portal(Variables.portal, false);
        Emitter.instance.registerEvent(Variables.transBullet, this.transBullet, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
      },
      onDestroy: function onDestroy() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
      },
      onKeyDown: function onKeyDown(event) {
        if (false == Variables.isCompleted) {
          cc.log("Not complete");
          return;
        }
        switch (event.keyCode) {
         case cc.macro.KEY.left:
          if (false == Variables.isPressedLeft) {
            Variables.audio.playAudioRun();
            Variables.isPressedRight = false;
            Variables.isPressedLeft = true;
            Variables.player.back(Variables.run, true);
          }
          break;

         case cc.macro.KEY.right:
          if (false == Variables.isPressedRight) {
            Variables.audio.playAudioRun();
            Variables.isPressedRight = true;
            Variables.isPressedLeft = false;
            Variables.player.run(Variables.run, true);
          }
          break;

         case cc.macro.KEY.up:
          if (true == Variables.isCompleted) {
            Variables.audio.playAudioJump();
            Variables.player.jump(Variables.jump, false);
            Variables.isPressedRight = false;
            Variables.isPressedLeft = false;
            Variables.isCompleted = false;
          }
          break;

         case cc.macro.KEY.space:
          if (false == Variables.isPressedSpace && true == Variables.isStart) {
            Variables.audio.playAudioShoot();
            Variables.isPressedRight = false;
            Variables.isPressedLeft = false;
            Variables.player.shoot(Variables.shoot, false);
          }
          break;

         case cc.macro.KEY.down:
          if (true == Variables.isCompleted) {
            Variables.audio.pauseAll();
            Variables.isPressedRight = false;
            Variables.isPressedLeft = false;
            Variables.isCompleted = false;
            Variables.player.down(Variables.idle, false);
          }
        }
      },
      onKeyUp: function onKeyUp(event) {
        switch (event.keyCode) {
         case cc.macro.KEY.left:
         case cc.macro.KEY.right:
          break;

         case cc.macro.KEY.up:
          Variables.isPressedUp = false;
          break;

         case cc.macro.KEY.space:
        }
      },
      showResult: function showResult() {
        var _this = this;
        var win = !(arguments.length > 0 && void 0 !== arguments[0]) || arguments[0];
        Variables.isCompleted = false;
        Variables.isStart = false;
        Variables.player.spineBoy.clearTracks();
        this.stopAllAnimBackground();
        this.score = Variables.score.score + 1;
        if (win) {
          Variables.player.spineBoy.setAnimation(0, Variables.hoverboard, false);
          Variables.player.spineBoy.setCompleteListener(function() {
            _this.resultBoard.node.active = true;
            _this.node.opacity = 100;
            _this.resultBoard.win(_this.score);
            Variables.audio.playAudioWin();
          });
        } else {
          Variables.player.spineBoy.setAnimation(0, Variables.death, false);
          Variables.audio.playAudioDeath();
          Variables.player.spineBoy.setCompleteListener(function() {
            _this.resultBoard.node.active = true;
            _this.node.opacity = 100;
            _this.resultBoard.lose(_this.score);
            Variables.audio.playAudioLose();
          });
        }
      },
      update: function update(dt) {}
    });
    cc._RF.pop();
  }, {
    ResultBoard: "ResultBoard",
    Variables: "Variables",
    mEmitter: "mEmitter"
  } ],
  PlayAgain: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "938b2uf5y9MuYL17U7eXkyG", "PlayAgain");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {},
      playAgain: function playAgain() {
        cc.director.loadScene("SpineBoy");
      },
      start: function start() {}
    });
    cc._RF.pop();
  }, {} ],
  Player: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "68a91jCVg1E1IwXpoSNb/j7", "Player");
    "use strict";
    var Emitter = require("mEmitter");
    var Variables = require("Variables");
    cc.Class({
      extends: cc.Component,
      properties: {
        spineBoy: sp.Skeleton,
        bullet: cc.Prefab
      },
      onLoad: function onLoad() {
        Emitter.instance.emit(Variables.transPlayer, this);
        Emitter.instance.registerEvent(Variables.transBackGround, this.transBackGround, this);
        this.spineBoy.setMix(Variables.jump, Variables.idle, .2);
        this.spineBoy.setMix(Variables.run, Variables.idle, .2);
        this.spineBoy.setMix(Variables.run, Variables.run, .2);
      },
      onEnable: function onEnable() {},
      onCollisionEnter: function onCollisionEnter(collisionObj) {
        if ("boom" == collisionObj.node.name || "boss" == collisionObj.node.name || "Stone" == collisionObj.node.name || "Canvas" == collisionObj.node.name) {
          this.node.stopAllActions();
          this.node.getComponent(cc.BoxCollider).enabled = false;
          Variables.background.showResult(false);
        }
        if ("Princess" == collisionObj.node.name) {
          Variables.audio.playAudioPrincess();
          Variables.background.showResult();
        }
      },
      start: function start() {},
      transBackGround: function transBackGround(data) {
        Variables.background = data;
      },
      createBullet: function createBullet() {
        var bullet = cc.instantiate(this.bullet);
        bullet.parent = Variables.background.node;
        var flip = this.spineBoy.node.scaleX > 0 ? cc.flipX(false) : cc.flipX(true);
        var move = this.spineBoy.node.scaleX > 0 ? cc.moveBy(1, 1500, 0) : cc.moveBy(1, -1500, 0);
        var action = [ flip, move, cc.callFunc(function() {
          bullet.destroy();
        }) ];
        bullet.x = this.spineBoy.node.scaleX > 0 ? this.spineBoy.node.x + 100 : this.spineBoy.node.x - 100;
        bullet.y = this.spineBoy.node.y + 50;
        bullet.runAction(cc.sequence(action));
        Emitter.instance.emit(Variables.transBullet, bullet);
      },
      shoot: function shoot(action) {
        var loop = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
        this.spineBoy.node.stopAllActions();
        this.spineBoy.setAnimation(0, action, loop);
        this.createBullet();
      },
      portal: function portal(action) {
        var loop = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
        this.spineBoy.setAnimation(0, action, loop);
        this.spineBoy.setCompleteListener(function() {
          Variables.isCompleted = true;
          Variables.isStart = true;
        });
      },
      back: function back(action) {
        var loop = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
        this.node.stopAllActions();
        this.spineBoy.clearTracks();
        this.spineBoy.setToSetupPose();
        this.spineBoy.setAnimation(0, action, loop);
        var actions = [ cc.flipX(true), cc.moveBy(1, -180, 0) ];
        this.spineBoy.node.runAction(cc.repeatForever(cc.sequence(actions)));
      },
      run: function run(action) {
        var loop = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
        this.spineBoy.node.stopAllActions();
        this.spineBoy.clearTracks();
        this.spineBoy.setToSetupPose();
        this.spineBoy.setAnimation(0, action, loop);
        var actions = [ cc.flipX(false), cc.moveBy(1, 180, 0) ];
        this.spineBoy.node.runAction(cc.repeatForever(cc.sequence(actions)));
      },
      jump: function jump(action) {
        var _this = this;
        var loop = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
        this.spineBoy.node.stopAllActions();
        this.spineBoy.clearTracks();
        this.spineBoy.setToSetupPose();
        var jump = this.spineBoy.node.scaleX > 0 ? cc.jumpBy(1, 250, 0, 200, 1) : cc.jumpBy(1, -250, 0, 200, 1);
        var actions = [ cc.callFunc(function() {
          _this.spineBoy.setAnimation(0, action, loop);
        }), jump, cc.callFunc(function() {
          _this.spineBoy.setAnimation(0, "idle", loop);
        }), cc.callFunc(function() {
          Variables.isCompleted = true;
        }) ];
        this.spineBoy.node.runAction(cc.sequence(actions));
        this.removeEffect();
      },
      down: function down(action) {
        var _this2 = this;
        var loop = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
        this.spineBoy.node.stopAllActions();
        var actions = [ cc.callFunc(function() {
          _this2.spineBoy.setAnimation(0, action, loop);
        }), cc.callFunc(function() {
          Variables.isCompleted = true;
        }) ];
        this.spineBoy.node.runAction(cc.sequence(actions));
      },
      stopAllActions: function stopAllActions() {},
      removeEffect: function removeEffect() {},
      update: function update(dt) {
        this.spineBoy.node.getComponent(cc.BoxCollider).offset = cc.v2(this.spineBoy.findBone("torso3").worldX, this.spineBoy.findBone("torso3").worldY);
      }
    });
    cc._RF.pop();
  }, {
    Variables: "Variables",
    mEmitter: "mEmitter"
  } ],
  Princess: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "a3de8NLZAJObJXjofmggO10", "Princess");
    "use strict";
    var Emitter = require("mEmitter");
    var Variables = require("Variables");
    cc.Class({
      extends: cc.Component,
      properties: {},
      onLoad: function onLoad() {
        Emitter.instance.emit(Variables.transPrincess, this);
      },
      stopAllAnim: function stopAllAnim() {
        this.node.stopAllActions();
      },
      anim: function anim() {
        this.node.runAction(cc.repeatForever(cc.jumpBy(1, 0, 0, 50, 1)));
      },
      start: function start() {}
    });
    cc._RF.pop();
  }, {
    Variables: "Variables",
    mEmitter: "mEmitter"
  } ],
  ResultBoard: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "a1718N1+npKi4+G3ioxDp8D", "ResultBoard");
    "use strict";
    var Emitter = require("mEmitter");
    cc.Class({
      extends: cc.Component,
      properties: {
        textResult: cc.RichText,
        animLose: cc.Node,
        animWin: cc.Node,
        rePlayBtn: cc.Node,
        particleWin: cc.ParticleSystem
      },
      lose: function lose(score) {
        var _this = this;
        this.animLose.active = true;
        this.animWin.active = false;
        var actions = [ cc.callFunc(function() {
          _this.hideScore();
        }), cc.scaleTo(2, 1.5), cc.scaleTo(1, 1), cc.blink(1, 8), cc.callFunc(function() {
          _this.showScore();
        }), cc.callFunc(function() {
          _this.updateScore(score);
        }) ];
        this.animLose.runAction(cc.sequence(actions));
      },
      win: function win(score) {
        var _this2 = this;
        this.particleWin.node.active = true;
        this.animLose.active = false;
        this.animWin.active = true;
        var actions = [ cc.callFunc(function() {
          _this2.hideScore();
        }), cc.scaleTo(2, 1.5), cc.scaleTo(1, 1), cc.blink(1, 8), cc.callFunc(function() {
          _this2.showScore();
        }), cc.callFunc(function() {
          _this2.updateScore(score);
        }) ];
        this.animWin.runAction(cc.sequence(actions));
      },
      hideScore: function hideScore() {
        this.textResult.node.active = false;
        this.rePlayBtn.active = false;
      },
      showScore: function showScore() {
        this.textResult.node.active = true;
      },
      rePlay: function rePlay() {
        cc.director.loadScene("SpineBoy");
      },
      updateScore: function updateScore(score) {
        var _this3 = this;
        var countScore = 0;
        var actions = [ cc.callFunc(function() {
          countScore += 1;
        }), cc.delayTime(.05), cc.callFunc(function() {
          _this3.textResult.string = " <color=#CD5555>SCORE: </c><color=#FFCC33>" + countScore + "</color>";
        }) ];
        this.textResult.node.runAction(cc.sequence(cc.repeat(cc.sequence(actions), score), cc.callFunc(function() {
          _this3.rePlayBtn.active = true;
        })));
      },
      onLoad: function onLoad() {
        this.rePlayBtn.on("mousedown", this.rePlay, this);
        this.particleWin.node.active = false;
      },
      start: function start() {}
    });
    cc._RF.pop();
  }, {
    mEmitter: "mEmitter"
  } ],
  Score: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "73413Ix2fdI1IsnCQiHc4pb", "Score");
    "use strict";
    var Emitter = require("mEmitter");
    var Variables = require("Variables");
    cc.Class({
      extends: cc.Component,
      properties: {
        scoreGame: cc.RichText,
        score: 100
      },
      onLoad: function onLoad() {
        Emitter.instance.emit(Variables.transScore, this);
      },
      updateScore: function updateScore() {
        var _this = this;
        var actions = [ cc.callFunc(function() {
          _this.checkScore();
        }), cc.delayTime(1), cc.callFunc(function() {
          _this.scoreGame.string = "<color=#CD5555>SCORE:</c> <color=#FFCC33> " + _this.score + "</color>";
        }) ];
        this.scoreGame.node.runAction(cc.repeat(cc.sequence(actions), this.score));
      },
      checkScore: function checkScore() {
        this.score -= 1;
        this.score <= 0 && Variables.background.showResult(false);
      },
      start: function start() {}
    });
    cc._RF.pop();
  }, {
    Variables: "Variables",
    mEmitter: "mEmitter"
  } ],
  Variables: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "6b4feAA1LhN7ZYirlnM3k20", "Variables");
    "use strict";
    var Variables = {
      run: "run",
      idle: "idle",
      jump: "jump",
      death: "death",
      hoverboard: "hoverboard",
      portal: "portal",
      shoot: "idle",
      boss: null,
      bullet: null,
      background: null,
      resultBoard: null,
      player: null,
      princess: null,
      audio: null,
      isCompleted: false,
      isStart: false,
      isCollided: false,
      isPressedRight: false,
      isPressedLeft: false,
      isPressedUp: false,
      isPressedSpace: false,
      score: null,
      cloud: null,
      bird: null,
      transBoss: "transBoss",
      transPlayer: "transPlayer",
      transAudio: "transAudio",
      transScore: "transScore",
      transBackGround: "transBackGround",
      transBullet: "transBullet",
      transStone: "transStone",
      transPrincess: "transPrincess",
      transCloud: "transCloud",
      transBird: "transBird"
    };
    module.exports = Variables;
    cc.Class({
      extends: cc.Component,
      properties: {},
      start: function start() {}
    });
    cc._RF.pop();
  }, {} ],
  boss: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "705dauV/xJGSqmJrOEFMPJ+", "boss");
    "use strict";
    var Emitter = require("mEmitter");
    var Variables = require("Variables");
    cc.Class({
      extends: cc.Component,
      properties: {
        stone: cc.Prefab,
        hp: cc.ProgressBar
      },
      onLoad: function onLoad() {
        Emitter.instance.emit(Variables.transBoss, this);
        this.hp.node.y += 50;
        this.hp.progress = 1;
      },
      onCollisionEnter: function onCollisionEnter(collisionObj) {
        if (this.hp.progress <= .1) return;
        if ("Bullet" == collisionObj.node.name) {
          Variables.audio.playAudioBoss();
          this.hp.progress -= .1;
          collisionObj.node.destroy();
          this.hp.progress <= .1 && this.death();
        }
      },
      anim: function anim() {
        var _this = this;
        var actions = [ cc.jumpBy(2, cc.v2(150, 0), 50, 4), cc.flipX(true), cc.jumpBy(2, cc.v2(-150, 0), 50, 4), cc.callFunc(function() {
          _this.createStone();
        }), cc.flipX(false) ];
        this.node.runAction(cc.repeatForever(cc.sequence(actions)));
      },
      stopAllAnim: function stopAllAnim() {
        this.node.stopAllActions();
      },
      createStone: function createStone() {
        var stone = cc.instantiate(this.stone);
        stone.parent = Variables.background.node;
        var move = cc.moveTo(1.5, Variables.player.node.x, Variables.player.node.y).easing(cc.easeCubicActionIn());
        var action = [ move, cc.blink(.3, 3), cc.callFunc(function() {
          stone.destroy();
        }) ];
        stone.x = this.node.x - 80;
        stone.y = this.node.y + 80;
        stone.runAction(cc.sequence(action));
        Emitter.instance.emit(Variables.transStone, stone);
      },
      death: function death() {
        var _this2 = this;
        this.node.stopAllActions();
        var actions = [ cc.rotateBy(1, 90), cc.blink(.5, 3), cc.fadeOut(.3), cc.callFunc(function() {
          _this2.node.active = false;
        }) ];
        this.node.runAction(cc.sequence(actions));
      },
      start: function start() {}
    });
    cc._RF.pop();
  }, {
    Variables: "Variables",
    mEmitter: "mEmitter"
  } ],
  mEmitter: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "04535Q4GFlF4bHC1mRNe+rC", "mEmitter");
    "use strict";
    var _createClass = function() {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          "value" in descriptor && (descriptor.writable = true);
          Object.defineProperty(target, descriptor.key, descriptor);
        }
      }
      return function(Constructor, protoProps, staticProps) {
        protoProps && defineProperties(Constructor.prototype, protoProps);
        staticProps && defineProperties(Constructor, staticProps);
        return Constructor;
      };
    }();
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }
    var EventEmitter = require("events");
    var mEmitter = function() {
      function mEmitter() {
        _classCallCheck(this, mEmitter);
        this._emiter = new EventEmitter();
        this._emiter.setMaxListeners(100);
      }
      _createClass(mEmitter, [ {
        key: "emit",
        value: function emit() {
          var _emiter;
          (_emiter = this._emiter).emit.apply(_emiter, arguments);
        }
      }, {
        key: "registerEvent",
        value: function registerEvent(event, listener) {
          this._emiter.on(event, listener);
        }
      }, {
        key: "registerOnce",
        value: function registerOnce(event, listener) {
          this._emiter.once(event, listener);
        }
      }, {
        key: "removeEvent",
        value: function removeEvent(event, listener) {
          this._emiter.removeListener(event, listener);
        }
      }, {
        key: "destroy",
        value: function destroy() {
          this._emiter.removeAllListeners();
          this._emiter = null;
          mEmitter.instance = null;
        }
      } ]);
      return mEmitter;
    }();
    mEmitter.instance = null;
    module.exports = mEmitter;
    cc.Class({
      extends: cc.Component,
      properties: {},
      start: function start() {}
    });
    cc._RF.pop();
  }, {
    events: 1
  } ]
}, {}, [ "Audio", "Bird", "Controller", "PlayAgain", "Player", "Princess", "ResultBoard", "Score", "Variables", "boss", "mEmitter" ]);