webpackJsonp([1],{"+6BH":function(n,r,e){"use strict";e.d(r,"a",(function(){return t}));var o=e("7Rau"),t=[{path:"",children:[{path:"",component:o.a},{path:"child-barrel",loadChildren:function(){return e.e(4).then(e.bind(null,"aOJU")).then((function(n){return n.ChildBarrelModule}))}}]}]},"7Rau":function(n,r,e){"use strict";e.d(r,"a",(function(){return a}));var o=e("TToO"),t=e("3j3K");console.log("`Barrel` component loaded asynchronously");var a=(function(){function n(){}return n.prototype.ngOnInit=function(){console.log("hello `Barrel` component")},n})();a=o.a([e.i(t.Component)({selector:"barrel",template:"\n    <h1>Hello from Barrel</h1>\n    <span>\n      <a [routerLink]=\" ['./child-barrel'] \">\n        Child Barrel\n      </a>\n    </span>\n    <router-outlet></router-outlet>\n  "})],a)},a7Eh:function(n,r,e){"use strict";Object.defineProperty(r,"__esModule",{value:!0});var o=e("spIJ");e.d(r,"BarrelModule",(function(){return o.a}))},spIJ:function(n,r,e){"use strict";e.d(r,"a",(function(){return s}));var o=e("TToO"),t=e("2Je8"),a=e("NVOs"),l=e("3j3K"),u=e("5oXY"),c=e("+6BH"),i=e("7Rau");console.log("`Barrel` bundle loaded asynchronously");var s=(function(){function n(){}return n})();s.routes=c.a,s=o.a([e.i(l.NgModule)({declarations:[i.a],imports:[t.c,a.a,u.a.forChild(c.a)]})],s)}});