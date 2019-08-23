p = n(1)
r = n(2);
/**
 * 获取数据类型
 */
function v(e) {
    // new Object().toString() : "[object Object]"
    // 下面返回"Object"
    return Object.prototype.toString.call(e).split(" ")[1].split("]")[0]
}
/**
 * 打印错误日志
 */
function E(e, t) {
    console.group(new Date + " " + e),
    console.error(t),
    console.groupEnd()
}
/**
 * 解析属性名，返回相应的层级数组
 */
function N(e) {
    // 如果属性名不是String字符串就抛出异常
    if ("String" !== v(e))
        throw E("数据路径错误", "Path must be a string"),
        new M("Path must be a string");
    for (var t = e.length, n = [], r = "", o = 0, i = !1, a = !1, s = 0; s < t; s++) {
        var c = e[s];
        if ("\\" === c)
            // 如果属性名中包含\\. \\[  \\] 三个转义属性字符就将. [ ]三个字符单独拼接到字符串r中保存，否则就拼接\\
            s + 1 < t && ("." === e[s + 1] || "[" === e[s + 1] || "]" === e[s + 1]) ? (r += e[s + 1],
            s++) : r += "\\";
        else if ("." === c)
            // 遇到.字符并且r字符串非空时，就将r保存到n数组中并清空r; 目的是将{ a.b.c.d: 1 }中的链式属性名分开,保存到数组n中，如[a,b,c,]
            r && (n.push(r),
            r = "");
        else if ("[" === c) {
            // 遇到[字符并且r字符串非空时，就将r保存到n数组中并清空r；目的是将{ array[11]: 1 }中的数组属性名保存到数组n中，如[array,]
            // 如果此时[为属性名的第一个字符就报错,也就是说属性名不能直接为访问器, 如{ [11]: 1}
            if (r && (n.push(r),
            r = ""),
            0 === n.length)
                throw E("数据路径错误", "Path can not start with []: " + e),
                new M("Path can not start with []: " + e);
            // a赋值为true, i赋值为false
            i = !(a = !0)
        } else if ("]" === c) {
            if (!i)
                throw E("数据路径错误", "Must have number in []: " + e),
                new M("Must have number in []: " + e);
            // 遍历到{ array[11]: 1 }中的']'的时候，就将a赋值为false, 并将o保存到数组n中，如[array,11,]
            a = !1,
            n.push(o),
            o = 0
        } else if (a) {
            if (c < "0" || "9" < c)
                throw E("数据路径错误", "Only number 0-9 could inside []: " + e),
                new M("Only number 0-9 could inside []: " + e);
            // 遍历到{ array[11]: 1 }中的'11'的时候，就将i赋值为true, 并将string类型的数字计算成Number类型保存到o中
            i = !0,
            o = 10 * o + c.charCodeAt(0) - 48
        } else
            r += c  // 普通类型的字符就直接拼接到r中
    }
    // 将普通的字符串属性名，.和]后面剩余的字符串保存到数组n中,如{abc: 1} => [abc], {a.b.c: 1} => [a,b,c], {array[0].text: 1} => [array, 0, text]
    if (r && n.push(r),
    0 === n.length)
        throw E("数据路径错误", "Path can not be empty"),
        new M("Path can not be empty");
    return n
}
var x = Object.prototype.toString;
function _(e) {
    return "[object Object]" === x.call(e)
}
/**
 * 解析出属性最终对应的子对象的属性名，以及对应的子对象
 */
function j(e, t) {
    // e: page.data的深拷贝副本, t为包含子对象属性名的属性数组
    /*
        - 遍历属性数组[a,b], e={a: {b: 1}}
        1. i=0, 此时o为Object类型时, n = a, r = {a: {b: 1}}, o = {b: 1};
        2. i=1, 此时o为Object类型时, n = b, r = {b: 1}, o = 1;
        retrun { obj: {b: 1}, key: b}

        - 遍历属性数组[a,0,b], e={a: [{b: 1}]}
        1. i=0, 此时t[i]=a, o为Object类型时, n = a, r = {a: [{b: 1}]}, o = [{b: 1}];
        2. i=1, 此时t[i]=0, o为Array类型时, n = 0, r = [{b: 1}], o = {b: 1};
        3. i=2, 此时t[i]=b, o为Object类型时, n = b, r = {b: 1}, o = 1;
        retrun { obj: {b: 1}, key: b}
    */
    for (var n, r = {}, o = e, i = 0; i < t.length; i++)
        Number(t[i]) === t[i] && t[i] % 1 == 0 ? // t[i]是否为有效的Number
        Array.isArray(o) || (r[n] = [], o = r[n]) :
        _(o) || (r[n] = {}, o = r[n]), 
        n = t[i], o = (r = o)[t[i]]; //注意由于逗号分隔符的优先级是最低的，所以这一行会在前面的三元选择符执行完，再执行
    return {
        obj: r,
        key: n
    }
}
function m(e, t) {
    if ("function" != typeof t)
        throw new TypeError("customizer is must be a Function");
    if ("function" == typeof e)
        return e;
    var n = a.call(e);
    if ("[object Array]" === n)
        return [];
    if ("[object Object]" === n && e.constructor === Object)
        return {};
    if ("[object Date]" === n)
        return new Date(e.getTime());
    if ("[object RegExp]" === n) {
        var r = String(e)
          , o = r.lastIndexOf("/");
        return new RegExp(r.slice(1, o),r.slice(o + 1))
    }
    var i = t(e);
    return void 0 !== i ? i : null
}
function w(e) {
    var t = Object(b.default)(e);
    return null !== e && "object" !== t && "function" !== t ? e : null
}
var y = function(e) {
    var t = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : s;
    if (null === e)
        return null;
    var n = w(e);
    if (null !== n)
        return n;
    var r = m(e, t)
      , o = null !== r ? r : e;
    return function e(t, n, r, o, i) {
        if (null === t)
            return null;
        var a = w(t);
        if (null !== a)
            return a;
        var s = S(t).concat(O(t));
        var c, u;
        var l, d, f, p, h, g;
        for (c = 0,
        u = s.length; c < u; ++c)
            l = s[c],
            d = t[l],
            f = T(o, d),
            g = h = p = void 0,
            -1 === f ? (_ = n,
            void 0,
            y = w(v = d),
            p = null !== y ? y : m(v, _),
            h = null !== p ? p : d,
            null !== d && /^(?:function|object)$/.test(Object(b.default)(d)) && (o.push(d),
            i.push(h))) : g = i[f],
            r[l] = g || e(d, n, h, o, i);
        var v, _, y;
        return r
    }(e, t, o, [e], [o])
}
var L = Object.assign
              , F = n(3)
              , U = ["onLoad", "onReady", "onShow", "onRouteEnd", "onHide", "onUnload", "onResize"]
              , W = ["__wxWebviewId__", "__route__"]
              , G = ["route"]
              , V = __appServiceSDK__.getLogManager()
              , z = function() {
                function l() {
                    var t = this
                      , c = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : {}
                      , d = 1 < arguments.length ? arguments[1] : void 0
                      , e = 2 < arguments.length ? arguments[2] : void 0;
                    Object(p.default)(this, l);
                    var n = {
                        __wxWebviewId__: d,
                        __route__: e
                    };
                    W.forEach(function(e) {
                        Object.defineProperty(t, e, {
                            set: function() {
                                C("关键字保护", "should not change the protected attribute " + e)
                            },
                            get: function() {
                                return n[e]
                            }
                        })
                    });
                    var r = __virtualDOM__.addView(d, e)
                      , o = exparser.Element.getMethodCaller(r);
                    this.__wxExparserNode__ = r,
                    this.__wxComponentInst__ = o,
                    exparser.Element.setMethodCaller(r, this),
                    c.data = c.data || {},
                    _(c.data) || E("Page data error", "Page.data must be an object");
                    var i = JSON.stringify(c.data);
                    this.data = JSON.parse(i),
                    this.__viewData__ = JSON.parse(i),
                    this.__displayReporter = new F.DisplayReporter(e,1);
                    var f = __appServiceSDK__.getSystemInfoSync().deviceOrientation;
                    this.__callPageLifeTime__ = function(e) {
                        var t, n = (this[e] || g).bind(this);
                        Reporter.__route__ = this.__route__,
                        Reporter.__method__ = e;
                        for (var r = arguments.length, o = new Array(1 < r ? r - 1 : 0), i = 1; i < r; i++)
                            o[i - 1] = arguments[i];
                        "onLoad" === e && (t = this.__displayReporter).setQuery.apply(t, o);
                        if ("onShow" === e)
                            this.__displayReporter.reportShowPage(),
                            Object(F.checkWebviewAlive)(d);
                        else if ("onReady" === e)
                            this.__displayReporter.setReadyTime(Date.now());
                        else if ("onHide" === e || "onUnload" === e) {
                            var a = this.__toRoute__
                              , s = this.__isBack__
                              , c = this.__notReportHide__;
                            delete this.__toRoute__,
                            delete this.__isBack__,
                            delete this.__notReportHide__,
                            c || this.__displayReporter.reportHidePage(a, s),
                            Object(F.stopCheckWebviewAlive)(d)
                        } else if ("onResize" === e) {
                            var u = o[0] || {};
                            f !== u.deviceOrientation && (f = u.deviceOrientation,
                            this.__displayReporter.addOrientationChangeCount())
                        }
                        I(this.__route__ + ": " + e + " have been invoked"),
                        __appServiceSDK__.traceBeginEvent("LifeCycle", "Page." + e);
                        var l = n.apply(this, o);
                        return __appServiceSDK__.traceEndEvent(),
                        Reporter.__route__ = Reporter.__method__ = "",
                        l
                    }
                    ,
                    U.forEach(function(s) {
                        t[s] = function() {
                            var e, t = (c[s] || g).bind(this);
                            try {
                                for (var n = Date.now(), r = arguments.length, o = new Array(r), i = 0; i < r; i++)
                                    o[i] = arguments[i];
                                e = t.apply(this, o);
                                var a = Date.now() - n;
                                1e3 < a && Reporter.slowReport({
                                    key: "pageInvoke",
                                    cost: a,
                                    extend: "at " + this.__route__ + " page lifeCycleMethod " + s + " function"
                                }),
                                V && V.logApiInvoke && V.log("page " + this.__route__ + " " + s + " have been invoked"),
                                __appServiceSDK__.nativeConsole.info("page " + this.__route__ + " " + s + " have been invoked")
                            } catch (e) {
                                Reporter.thirdErrorReport({
                                    error: e,
                                    extend: "at " + this.__route__ + " page lifeCycleMethod " + s + " function"
                                })
                            }
                            return e
                        }
                        .bind(t)
                    });
                    function a(a) {
                        !function(e) {
                            return -1 !== W.indexOf(e)
                        }(a) ? function(e) {
                            for (var t = 0; t < U.length; ++t)
                                if (U[t] === e)
                                    return !0;
                            return "data" === e
                        }(a) || ("Function" === v(c[a]) ? t[a] = function() {
                            var e;
                            Reporter.__route__ = this.__route__,
                            Reporter.__method__ = a,
                            __appServiceSDK__.traceBeginEvent("User Script", "Page." + a);
                            try {
                                for (var t = Date.now(), n = arguments.length, r = new Array(n), o = 0; o < n; o++)
                                    r[o] = arguments[o];
                                e = c[a].apply(this, r);
                                var i = Date.now() - t;
                                1e3 < i && Reporter.slowReport({
                                    key: "pageInvoke",
                                    cost: i,
                                    extend: "at " + this.__route__ + " page " + a + " function"
                                })
                            } catch (e) {
                                Reporter.thirdErrorReport({
                                    error: e,
                                    extend: "at " + this.__route__ + " page " + a + " function"
                                })
                            }
                            return __appServiceSDK__.traceEndEvent(),
                            Reporter.__route__ = Reporter.__method__ = "",
                            e
                        }
                        .bind(t) : t[a] = y(c[a])) : C("关键字保护", "Page's " + a + " is write-protected")
                    }
                    for (var s in c)
                        a(s);
                    var u = {
                        route: e
                    };
                    G.forEach(function(e) {
                        Object.prototype.hasOwnProperty.call(t, e) || (t[e] = u[e])
                    }),
                    "function" == typeof c.onShareAppMessage && __appServiceSDK__.showShareMenu()
                }
                return Object(r.default)(l, null, [{
                    key: "create",
                    value: function(e, t, n) {
                        var r = new l(n,e,t)
                          , o = r.__wxExparserNode__;
                        return delete r.__wxExparserNode__,
                        {
                            page: r,
                            node: o
                        }
                    }
                }, {
                    key: "destroy",
                    value: function(e) {
                        __virtualDOM__.removeView(e.__wxWebviewId__)
                    }
                }]),
                Object(r.default)(l, [{
                    key: "setData",
                    value: function(c, e) {
                        // 保存闭包内的this对象，即常用的that
                        var u = this;
                        // 官网定义 Page.prototype.setData(Object data, Function callback),
                        // 即 c: Object对象，e: Function界面更新渲染完毕后的回调函数
                        try {
                            // 返回 [object Object] 中的Object
                            var t = v(c);
                            if ("Object" !== t)
                                return void E("类型错误", "setData accepts an Object rather than some " + t);
                            Object.keys(c).forEach(function(e) {
                                // e: 可枚举属性的键值, void 0 表示undefined (https://github.com/lessfish/underscore-analysis/issues/1)
                                void 0 === c[e] && E("Page setData warning", 'Setting data field "' + e + '" to undefined is invalid.');
                                // t为包含子对象属性名的属性数组, u.data和u.__viewData__都是page.data的深拷贝副本
                                var t = N(e)
                                  , n = j(u.data, t)
                                  , r = n.obj
                                  , o = n.key;
                                if (r && (r[o] = y(c[e])),
                                void 0 !== c[e]) {
                                    var i = j(u.__viewData__, t)
                                      , a = i.obj
                                      , s = i.key;
                                    a && (a[s] = y(c[e]))
                                }
                            }),
                            __appServiceSDK__.traceBeginEvent("Framework", "DataEmitter::emit"),
                            this.__wxComponentInst__.setData(JSON.parse(JSON.stringify(c)), e),
                            __appServiceSDK__.traceEndEvent()
                        } catch (e) {
                            k(e)
                        }
                    }
                }, {
                    key: "pageScrollTo",
                    value: function(e) {
                        __appServiceSDK__.publishPageScrollTo(e, [this.__wxWebviewId__])
                    }
                }]),
                l
            }()