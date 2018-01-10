
class Util {
    
    public constructor() {
    }

    /**
     *删除数组指定下标或指定对象
     *removeObjFromArray( 数组，元素 )
     */
    public static removeObjFromArray(arr, obj) {
        var hadDelete = false;
        for (var i = 0; i < arr.length; i++) {
            var temp = arr[i];
            if (!isNaN(obj)) {
                temp = i;
            }
            if (temp == obj) {
                for (var j = i; j < arr.length; j++) {
                    arr[j] = arr[j + 1];
                }
                arr.length = arr.length - 1;
                hadDelete = true;
            }
        }
        return hadDelete;
    }

    /**
     * 添加一个只执行一次的事件
     * @param target    事件目标
     * @param type    事件类型
     * @param handler    事件响应函数，可以是一个带有事件参数的函数，也可以是一个自定义参数的函数（useParam = true时）
     * @param useParam    事件响应函数是否传入自定义参数
     * @param param    参数列表
     * @return 内部实际监听的响应函数，假如需要手动移除，直接用target移除return的函数对象
     *
     */
    public static addEventListenerOnce(target:any, type:string, handler:Function, thisArg?:any, useParam:boolean = false, param:Array<any> = null):Function {
        var eventHandler = function (e:egret.Event) {
            target.removeEventListener(type, eventHandler, thisArg);
            if (useParam) {
                handler.apply(thisArg, param);
            } else {
                handler.apply(thisArg, [e]);
            }
            handler = null;
            target = null;
            type = null;
            eventHandler = null;
            thisArg = null;
        }
        target.addEventListener(type, eventHandler, thisArg);

        return eventHandler;
    }

    public static random(n:number):number {
        return Math.floor(Math.random() * n);
    }

    public static randomInRange(start:number, end:number):number {
        return start + (Math.random() * (end - start));
    }

    public static seed = 7;
    public static seededRandom(max?, min?) {
        Util.seed = (Util.seed * 9301 + 49297) % 233280;
        var rnd = Util.seed / 233280.0;
        if (max != undefined || min != undefined) {
            max = max || 1;
            min = min || 0;
            if (max < min) {
                var temp = max;
                max = min;
                min = temp;
            }
            return min + rnd * (max - min);
        } else {
            return rnd;
        } 
    }

    public static proxy(callback, context, args?) {
        return function () {
            return callback.apply(context, args||arguments);
        }
    }

    public static deepExtend(o0, o1) {
        for (var i in o0) {
            if (typeof o0[i] == "object" && (o1[i] && typeof o1[i] == "object")) {
                o0[i] = Util.deepExtend(o0[i], o1[i]);
            } else if (o1[i] !== undefined) {
                o0[i] = o1[i];
                //o0[i] = _.extend(o0[i], o1[i]);
            }
        }
        for (var i in o1) {
            if (o0[i] === undefined) {
                o0[i] = o1[i];
            }
        }
        return o0;
    }

    /**动态创建组
     * 当传入组名相同时，都重新建组
     * */
    private static loadingItemArray = [];
    private static waittingGroupArrays = [];
    private static canLoad(group) {
        if (_.intersection(Util.loadingItemArray, group).length == 0) {
            return true;
        } else {
            return false;
        }
    }
    private static loadGroupX(gwd) {
        if (this.canLoad(gwd.group)) {
            if (Util.waittingGroupArrays.indexOf(gwd) >= 0) {
                Util.waittingGroupArrays.splice(Util.waittingGroupArrays.indexOf(gwd), 1);
            }
            Util.loadingItemArray = _.extend(Util.loadingItemArray, gwd.group);
            //唯一组名，不传入
            var groupName = _.uniqueId("groupname");
            var sourceDone = function (e:RES.ResourceEvent) {
                if(e.groupName !=  groupName){
                    return;
                }
                RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, sourceDone, this);
                RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, sourceLoadError, this);
                RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, sourceProgress, this);
                gwd.deferred.resolve();
            }

            var sourceLoadError = function (e:RES.ResourceEvent) {
                if (e.groupName != groupName) {return;}
                console.log("sourceLoadError", e, groupName, gwd.group);
                gwd.deferred.reject("");
                RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, sourceDone, this);
                RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, sourceLoadError, this);
                RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, sourceProgress, this);
            }

            var sourceProgress = function (e:RES.ResourceEvent) {
                if (Util.loadingItemArray.indexOf((<any>e.resItem).name)>=0) {
                    Util.loadingItemArray = _.without(Util.loadingItemArray, (<any>e.resItem).name);
                    // 触发等待的
                    var array = _.clone(Util.waittingGroupArrays);
                    _.each(array, function (aGwd) {
                        Util.loadGroupX(aGwd);
                    });
                }
            }

            RES.createGroup(groupName, gwd.group);
            RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, sourceDone, this);
            RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, sourceLoadError, this);
            RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, sourceProgress, this);
            RES.loadGroup(groupName);
        } else {
            if (Util.waittingGroupArrays.indexOf(gwd) == -1) {
                Util.waittingGroupArrays.push(gwd);
            }
        }
    }
    public static dynamicLoadGroupX(group) {
        var deferred = when.defer();
        if (!group) {
            //deferred.reject("[error]:groupSourceArray为空");
            deferred.resolve();
            return deferred.promise;
        }
        Util.loadGroupX({group: group, deferred: deferred});
        return deferred.promise;
    }


    public static loadingCountTotal = 0;
    public static loadingCountLoaded = 0;
    public static loadingGroups = [];
    private static resourceRequestTag = 1;
    private static resourceRequestTags = [];
    public static itemHistory = [];
    public static newItemHistory = [];
    public static dynamicLoadGroup(groupSourceArray, timeoutFlag=true, time=15000) {
        var deferred = when.defer();
        if (!groupSourceArray) {
            deferred.reject("[error]:groupSourceArray为空");
            return deferred.promise;
        }
        if (groupSourceArray.length == 0) {
            deferred.resolve();
            return deferred.promise;
        }
        
        // 不重复加载
        var itemHistoryLength = Util.itemHistory.length;
        var newItemHistory = _.union(Util.itemHistory, groupSourceArray);
        if (newItemHistory.length == itemHistoryLength) { 
            deferred.resolve();
            return deferred.promise; 
        }
        groupSourceArray = _.difference(groupSourceArray, Util.itemHistory);
        
        //随机组名，不传入
        var groupName = _.uniqueId("groupname");
        RES.createGroup(groupName, groupSourceArray);
        
        return this.doLoadGroup(groupName, timeoutFlag, time, deferred, newItemHistory);
    }

    public static loadGroup(groupName:string, timeoutFlag=true, time=15000) {
        //newItemHistory?
        var deferred = when.defer();
        var group = RES.getGroupByName(groupName);
        var newItemHistory = _.union(Util.itemHistory, _.map(group, (resourceItem:any) => {
            return resourceItem.name;
        }));
        return this.doLoadGroup(groupName, timeoutFlag, time, deferred, newItemHistory);
    }
    
    private static doLoadGroup(groupName, timeoutFlag, time, deferred, newItemHistory) {
        if (!deferred) {
            deferred = when.defer();
        }
        var requestTag = this.resourceRequestTag++;
        this.resourceRequestTags.push(requestTag);

        this.newItemHistory = _.union(Util.newItemHistory, newItemHistory);
        //this.loadingCountTotal += groupSourceArray.length;
        var reset = function () {
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, sourceDone, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, sourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, sourceProgress, this);

            var groupIndex = _.findIndex(Util.loadingGroups, {groupName: groupName});
            if (groupIndex >= 0) {
                var loadingGroup = Util.loadingGroups.splice(groupIndex, 1)[0];
                Util.loadingCountLoaded -= loadingGroup.itemsLoaded;
                Util.loadingCountTotal -= loadingGroup.itemsTotal;
            }
        }

        var timeout;
        if (timeoutFlag) {
            timeout = setTimeout(function () {
                reset();
                deferred.reject("timeout");
            }, this, time);
        } else {
            timeout = 0;
        }

        var sourceDone = function (e:RES.ResourceEvent) {
            if(e.groupName !=  groupName){
                return;
            }
            (reset && reset());
            if (!(this.resourceRequestTags.indexOf(requestTag) >= 0)) { return; }
            deferred.resolve();
            (timeout && clearTimeout(timeout));
            reset = null;
            Util.itemHistory = _.union(Util.itemHistory, newItemHistory);
        };
        var sourceProgress = function (e:RES.ResourceEvent) {
            var loadingGroup = _.findWhere(Util.loadingGroups, {groupName: e.groupName});
            if (!loadingGroup) {
                Util.loadingGroups.push({
                    groupName: e.groupName,
                    itemsLoaded: e.itemsLoaded,
                    itemsTotal: e.itemsTotal
                });
            } else {
                Util.loadingCountLoaded -= loadingGroup.itemsLoaded;
                Util.loadingCountTotal -= loadingGroup.itemsTotal;
                loadingGroup.itemsLoaded = e.itemsLoaded;
                loadingGroup.itemsTotal = e.itemsTotal;
            }
            Util.loadingCountLoaded += e.itemsLoaded;
            Util.loadingCountTotal += e.itemsTotal;
            if (e.resItem && e.resItem["name"]) {
                if (Util.itemHistory.indexOf(e.resItem["name"]) == -1) {
                    Util.itemHistory.push(e.resItem["name"]);
                }
            }
        };
        var sourceLoadError = function (e:RES.ResourceEvent) {
            if (e.groupName != groupName) {return;}
            (reset && reset());
            console.log("sourceLoadError", e, groupName);
            //gwd.deferred.reject("");
            if (!(this.resourceRequestTags.indexOf(requestTag) >= 0)) { return; }
            deferred.reject("timeout");
            (timeout && clearTimeout(timeout));
            reset = null;
        };

        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, sourceDone, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, sourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, sourceLoadError, this);
        RES.loadGroup(groupName);
        return deferred.promise;
    }
    
    public static loadExmls(files:Array<string>) {
        var deferred = when.defer();
        var step = 0;
        for (var i = 0; i < files.length; i++) {
            EXML.load(files[i], () => {
                step++;
                if (step == files.length) {
                    deferred.resolve();
                }
            }, this);
        }
        return deferred.promise.timeout(7000);
    }
    
    public static toFixed(num:number, fixedNum:number) {
        return parseFloat(num.toFixed(fixedNum));
    }

    public static formatNumberDot(number) {
        var s = number.toString();
        var l = s.length;
        if (number < 1000) { return s; }
        var dotPos = s.indexOf(".");
        if (dotPos < 0) { dotPos = l; }
        var step = 0;
        for (var i = dotPos-3; i >= 1; i-=3) {
            s = s.substr(0,i)+","+s.substr(i);
        }
        return s;
    }

    public static getDecimal(number) {
        if (number >= 0) {
            return number-Math.floor(number);
        } else {
            return (-number+Math.ceil(number));
        }
    }
    
    public static formatDate(date, pattern, toUTC=false, isDetal=false) {
        if (!isDetal && toUTC) {
            date = new Date(date.getTime()+date.getTimezoneOffset()*60000);
        }
        var o;
        if (!isDetal) {
            o = {
                "M+" : date.getMonth()+1, //month 
                "d+" : date.getDate(), //day 
                "h+" : date.getHours(), //hour 
                "m+" : date.getMinutes(), //minute 
                "s+" : date.getSeconds(), //second 
                "q+" : Math.floor((date.getMonth()+3)/3), //quarter 
                "S" : date.getMilliseconds() //millisecond 
            }
        } else {
            o = {
                "M+" : date.getUTCMonth()+1, //month 
                "d+" : date.getUTCDate(), //day 
                "h+" : date.getUTCHours(), //hour 
                "m+" : date.getUTCMinutes(), //minute 
                "s+" : date.getUTCSeconds(), //second 
                "q+" : Math.floor((date.getUTCMonth()+3)/3), //quarter 
                "S" : date.getUTCMilliseconds() //millisecond 
            }
        }
        
        if (isDetal) {
            var t = date.getTime();
            var units = {
                "d+" : Math.floor(t/(24*60*60*1000)), //day 
                "h+" : Math.floor(t/(60*60*1000)), //hour 
                "m+" : Math.floor(t/(60*1000)), //minute 
                "s+" : Math.floor(t/(1000)), //second 
                "S" : t //millisecond 
            };
        }
    
        var firstFlag = true;
        if(/(y+)/.test(pattern)) {
            pattern = pattern.replace(RegExp.$1, ((date.getFullYear()-(isDetal?1970:0))+"").substr(4 - RegExp.$1.length));
            firstFlag = false;
        }

        var replace = function (a) {
            pattern = pattern.replace(RegExp.$1, (RegExp.$1.length==1||((""+a[k]).length>2)) ? a[k] : ("00"+ a[k]).substr((""+ a[k]).length));
        };
        
        for(var k in o) {
            if(new RegExp("("+ k +")").test(pattern)) {
                if (isDetal && firstFlag) {
                    if (units[k] != undefined) {
                        replace(units);
                    } else {
                        replace(o);
                    }
                    firstFlag = false;
                } else {
                    replace(o);
                }
            }
        }
        return pattern;
    }
    
    public static retryPromise(f:Function, times:number, interval:number=3000, tips:string="", failCallback?:Function) {
        var deferred = when.defer();
        var t = 0;
        var a = function () {
            f().then(function (data) {
                deferred.resolve(data);
            }).catch(function (reason:any) {
                console.error(reason);
                t++;
                if (typeof reason == "object" && reason.needStopRetry) {
                    deferred.reject(reason.reason);
                } else if (t < times || times==-1) {
                    (failCallback && failCallback());
                    setTimeout(function () {
                        a();
                    }, this, interval);
                } else {
                    deferred.reject(reason);
                }


                //if (self.loginTimes < 3) {
                //    LoadingIcon.show('登录失败，正在尝试重新登录', null, 1000);
                //    setTimeout(function () {
                //        self.loginServer();
                //    }, self, 3000);
                //} else {
                //    LoadingIcon.show('登录失败，请刷新页面重新登录', null, 1000);
                //}
            });
        };
        a();
        return deferred.promise;
    }
    
    // private static httpRequestTag = 1;
    // private static httpRequestTags = [];
    // public static httpGetJson(url:string, reqData?:any, needJsonParse=true) {
    //     var self = this;
    //     var requestTag = this.httpRequestTag++;
    //     this.httpRequestTags.push(requestTag);
    //     return Util.retryPromise(function () {
    //         var deferred = when.defer();
    //         var loader:egret.URLLoader = new egret.URLLoader();
    //         var onLoadComplete = function (event:egret.Event) {
    //             loader.removeEventListener(egret.Event.COMPLETE, onLoadComplete, self);
    //             loader.removeEventListener(egret.IOErrorEvent.COMPLETE, onLoadError, this);
    //             var l:egret.URLLoader = <egret.URLLoader>event.target;
    //             var data:any = needJsonParse?JSON.parse(l.data):l.data;
    //             if (!(self.httpRequestTags.indexOf(requestTag) >= 0)) {
    //                 return;
    //             }
    //             deferred.resolve(data);
    //         };
    //         var onLoadError = function () {
    //             loader.removeEventListener(egret.Event.COMPLETE, onLoadComplete, self);
    //             loader.removeEventListener(egret.IOErrorEvent.COMPLETE, onLoadError, this);
    //             if (!(self.httpRequestTags.indexOf(requestTag) >= 0)) {
    //                 return;
    //             }
    //             deferred.reject("[http request fail]");
    //         };
    //         loader.dataFormat = egret.URLLoaderDataFormat.TEXT;
    //         loader.addEventListener(egret.Event.COMPLETE, onLoadComplete, self);
    //         loader.addEventListener(egret.IOErrorEvent.IO_ERROR, onLoadError, self);
    //         var request:egret.URLRequest = new egret.URLRequest(url);
    //         //request.data = Util.changeToUrlParam(reqData);
    //         request.data = new egret.URLVariables(Util.changeToUrlParam(reqData));
    //         request.method = egret.URLRequestMethod.GET;
    //         loader.load(request);
    //         return deferred.promise;
    //     }, 3);
    // }

    // public static clearHttpRequest() {
    //     this.httpRequestTags = [];
    // }
    
    public static getBLen(str) {
        if (str == null) return 0;
        if (typeof str != "string"){
            str += "";
        }
        return str.replace(/[^x00-xff]/g,"01").length;
    }

    public static dayNumOfMonth(year, month) {
        var d = new Date(year, month, 0);
        return d.getDate();
    }
    
    public static getValue(obj:any, ...keys) {
        var cur = obj;
        var flag = false;
        var result = undefined;
        for (var i = 0; i < keys.length-1; i++) {
            if (!(typeof cur[keys[i]] == "object" && cur[keys[i]] != null)) {
                flag = true;
                break;
            } else {
                cur = cur[keys[i]];
            }
        }
        if (!flag) {
            result = cur[keys[keys.length-1]];
        }
        return result;
    }
    
    public static setValue(obj:{any}, value, ...keys) {
        var cur = obj;
        for (var i = 0; i < keys.length-1; i++) {
            if (!(typeof cur[keys[i]] == "object" && cur[keys[i]] != null)) {
                cur[keys[i]] = {};
            }
            cur = cur[keys[i]];
        }
        cur[keys[keys.length-1]] = value;
        return obj;
    }
    
    // copy from undersocre, add function comparison
    private static eq(a, b, aStack?, bStack?) {
        if (a === b) return a !== 0 || 1 / a === 1 / b;
        if (a == null || b == null) return a === b;
        if (a instanceof _) a = a._wrapped;
        if (b instanceof _) b = b._wrapped;
        var className = toString.call(a);
        if (className !== toString.call(b)) return false;
        switch (className) {
            case '[object RegExp]':
            case '[object String]':
                return '' + a === '' + b;
            case '[object Number]':
                if (+a !== +a) return +b !== +b;
                return +a === 0 ? 1 / +a === 1 / b : +a === +b;
            case '[object Date]':
            case '[object Boolean]':
                return +a === +b;
        }

        var areArrays = className === '[object Array]';
        if (!areArrays) {
            if (typeof a == 'function' && typeof b == 'function') {
                return (a.toString() === b.toString());
            }
            if (typeof a != 'object' || typeof b != 'object') return false;
            var aCtor = a.constructor, bCtor = b.constructor;
            if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
                _.isFunction(bCtor) && bCtor instanceof bCtor)
                && ('constructor' in a && 'constructor' in b)) {
                return false;
            }
        }
        aStack = aStack || [];
        bStack = bStack || [];
        var length = aStack.length;
        while (length--) {
            if (aStack[length] === a) return bStack[length] === b;
        }

        aStack.push(a);
        bStack.push(b);

        if (areArrays) {
            length = a.length;
            if (length !== b.length) return false;
            while (length--) {
                if (!Util.eq(a[length], b[length], aStack, bStack)) return false;
            }
        } else {
            var keys = _.keys(a), key;
            length = keys.length;
            if (_.keys(b).length !== length) return false;
            while (length--) {
                key = keys[length];
                if (!(_.has(b, key) && Util.eq(a[key], b[key], aStack, bStack))) return false;
            }
        }
        aStack.pop();
        bStack.pop();
        return true;
    }
    
    public static isEqualWithFunctionS(a, b) {
        return Util.eq(a, b);
    }

    // public static loadSingleScript = function (src, callback) {
    //     var s = document.createElement('script');
    //     if (s.hasOwnProperty("async")) {
    //         s.async = false;
    //     }
    //     s.src = src;
    //     s.addEventListener('load', function () {
    //         s.parentNode.removeChild(s);
    //         this.removeEventListener('load', arguments.callee, false);
    //         callback();
    //     }, false);
    //     document.body.appendChild(s);
    // };


    public static getUrlKeyVal(name) {
        if (window && window.location) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null)return decodeURI(r[2]);
        }
        return null;
    }
    
    public static changeToUrlParam(a) {
        var result = "";
        if (a) {
            var p = [];
            for (var key in a) {
                if (a.hasOwnProperty(key)) {
                    if (a[key] !== "" && a[key] !== undefined) {
                        p.push(key+"="+a[key]);
                    } else {
                        p.push(key);
                    }
                }
            }
            result = p.join("&");
        }
        return result;
    }
    
    public static getClassName(clazz) {
        return clazz.prototype.__class__;
    }
    
    public static basename(path) {
        var names = path.split('/');
        return names[names.length-1];
    }
    
    public static basenamehead(path) {
        var a = Util.basename(path);
        return a.slice(0, path.indexOf('.'));
    }
    
    public static extname(path) {
        if (path) {
            return path.slice(path.indexOf('.'));
        } else {
            return "";
        }
    }
    
    public static removeHashExt(path) {
        return path.replace(/(?:\-)\w{8,10}(?!:\.)/, '');
    }
    
    public static timestamp():number{
        return Math.floor(new Date().getTime()/1000);
    }
    
    
    private static timeDelay=0;
    private static stopStartTime;
    public static now() {
        // 修改移动速度
        // 修改移动速度
        // 修改骨骼动画播放速度
        return Date.now()-this.timeDelay;
    }
    
    public static stopTime() {
        this.stopStartTime = Date.now();
    }
    
    public static resumeTime() {
        if (this.stopStartTime) {
            this.timeDelay += Date.now()-this.stopStartTime;
        }
    }

    public static applyMixins(derivedCtor: any, baseCtors: any[]) {
        baseCtors.forEach(function (baseCtor) {
            Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
                derivedCtor.prototype[name] = baseCtor.prototype[name];
            })
        });
    } 
    
    public static registerGlobal(object, name) {
        if (window) {
            window[name] = object;
        }
    }
    
    private static _resolvedDeferred;
    public static resolvedDeferredPromise():when.Promise<any> {
        if (!this._resolvedDeferred) {
            var deferred = when.defer();
            deferred.resolve();
            this._resolvedDeferred = deferred;
        }
        return this._resolvedDeferred.promise;
    }
    
    public static toChineseNum(num:number):string {
        var list = ["零","一","二","三","四","五","六","七","八","九"];
        return list[num];
    }
    
    public static formatDateInShort(time:number) {
        var format = "";
        if (time >= 24*60*60*1000) {
            format = "d天";
        } else if (time >= 60*1000) {
            format = "hh时mm分";
        } else {
            format = "ss秒";
        }
        return Util.formatDate(new Date(time), format, false, true);
    }
    
    public static formatDateInShort1(time:number) {
        var format = "";
        if (time >= 24*60*60*1000) {
            format = "d天";
        } else if (time >= 60*60*1000) {
            format = "hh时mm分";
        } else if (time >= 60*1000) {
            format = "mm分ss秒";
        } else {
            format = "ss秒";
        }
        return Util.formatDate(new Date(time), format, false, true);
    }
    
    public static formatDateInShort2(time:number) {
        var format = "";
        if (time >= 24*60*60*1000) {
            format = "d天";
        } else if (time >= 60*60*1000) {
            format = "hh小时";
        } else if (time >= 60*1000) {
            format = "mm分钟";
        } else {
            format = "";
        }
        return Util.formatDate(new Date(time), format, false, true);
    }
    
    public static splitWithLength(s:string, length:number) {
        var result = [];
        while (s) {
            result.push(s.substr(0, length));
            s = s.substr(length);
        }
        return result;
    }
    
    public static isDiffArray(a0:Array<any>, a1:Array<any>) {
        return (_.difference(a0, a1).length > 0 || _.difference(a1, a0).length > 0);
    }
    
    public static getDayRest(now:number) {
        return (24*60*60*1000-now%24*60*60*1000);
    }
    
    public static updateArrayCollection(arrayCollection:eui.ArrayCollection, list:Array<any>, shouldUpdate:boolean=false) {
        for (var i = 0; i < arrayCollection.length; i++) {
            var item = <any>arrayCollection.getItemAt(i);
            _.extend(item, list[i]);
            if (shouldUpdate) {
                arrayCollection.itemUpdated(item);
            }
        }
    }
    
    public static updateArrayCollectionAll(dataGroup:eui.DataGroup, list:Array<any>, shouldUpdate:boolean=false) {
        if (!dataGroup.dataProvider || dataGroup.dataProvider.length != list.length) {
            dataGroup.dataProvider = new eui.ArrayCollection(list);
            // 将同步生成改为异步生成
            // 返加promise
        } else {
            this.updateArrayCollection(<eui.ArrayCollection>dataGroup.dataProvider, list, shouldUpdate);
        }
    }
    
    public static updateArrayCollectionAllAsyn(dataGroup:eui.DataGroup, list:Array<any>, shouldUpdate:boolean=false) {
        var deferred = when.defer();
        this.doUpdateArrayCollectionAllAsyn(deferred, dataGroup, list, shouldUpdate);
        return deferred.promise;
    }
    
    private static doUpdateArrayCollectionAllAsyn(deferred, dataGroup:eui.DataGroup, list:Array<any>, shouldUpdate:boolean=false) {
        if (!dataGroup.dataProvider || dataGroup.dataProvider.length != list.length) {
            if (!dataGroup.dataProvider || dataGroup.dataProvider.length > list.length) dataGroup.dataProvider = new eui.ArrayCollection([]);
            if (dataGroup.dataProvider.length < list.length) {
                (<eui.ArrayCollection>dataGroup.dataProvider).addItem(list[dataGroup.dataProvider.length]);
                setTimeout(() => {
                    this.doUpdateArrayCollectionAllAsyn(deferred, dataGroup, list, shouldUpdate);
                }, this, 0);
            } else {
                deferred.resolve();
            }
            // 将同步生成改为异步生成
            // 返加promise
        } else {
            this.updateArrayCollection(<eui.ArrayCollection>dataGroup.dataProvider, list, shouldUpdate);
            deferred.resolve();
        }
    }

    // public static unzip(msg) {
    //     if (typeof msg == "object" && msg != null && !(msg instanceof Array)) {
    //         if (msg.hasOwnProperty("zip") && msg["zip"] == 1) {
    //             var result = App.TA.getAllTableObject(msg);
    //             for (var key in result) {
    //                 if (result.hasOwnProperty(key)) {
    //                     result[key] = this.unzip(result[key]);
    //                 }
    //             }
    //             return result;
    //         } else {
    //             for (var key in msg) {
    //                 var a = this.unzip(msg[key]);
    //                 if (a!=null) {
    //                     msg[key] = a;
    //                 }
    //             }
    //             return msg;
    //         }
    //     } else {
    //         return msg;
    //     }
    // }

    /*检测二进制数据上的位是否已开启*/
    public static bigit(bitStr:number, index:number){
        return (bitStr>>index)&1;
        //var isOpens = bitStr.toString(2).split("").reverse();
        //return index < isOpens.length && isOpens[index] && isOpens[index] == "1";
    }
    
    public static findIndexInDataProvider(dataProvider, predict:any) {
        var list = [];
        var l = dataProvider.length;
        for (var i = 0; i < l; i++) {
            list.push(dataProvider.getItemAt(i));
        }
        return _.findIndex(list, predict);
    }
    
    public static isSubClass(subClazz, baseClazz) {
        while (subClazz !== undefined) {
            if (subClazz instanceof baseClazz) {
                return true;
            }
            subClazz = subClazz.prototype;
        }
        return false;
    }
    
    public static template(s:string, o:any) {
        for (var key in o) {
            s = s.replace("{"+key+"}", o[key]);
        }
        return s;
    }
    
    public static getArrayBit(array:Array<any>, index):boolean {
        if (!array) return false;
        if (array[index>>5]) {
            return !!((array[index>>5]>>>(index%32))&1);
        } else {
            return false;
        }
    }
    
    public static hashArray(array:Array<any>):string {
        return array.join(' ');
    }
    
    public static toIntArray(array) {
        return _.map(array, (item:string) => {
            return parseInt(item);
        });
    }
    
    public static isValidWord(txt) {
        return /^([\u4E00-\u9FA5a-zA-Z\d])+$/.test(txt);
    }
    
    public static isValidSentence(txt) {
        return /^([\u4E00-\u9FA5a-zA-Z\d,\.;\:"'!，。、‘；【】：“”《》？—…￥#！!@#$%\^&*()_\-+=\[\]\\/<>?|{}（）])+$/.test(txt);
    }
}


