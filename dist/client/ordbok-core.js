/* Copyright (c) ORDBOK contributors. All rights reserved.                   */


define("@ordbok/core/ajax",["require","exports"],function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=function(){function e(e,t,r){void 0===e&&(e=""),void 0===t&&(t=36e5),void 0===r&&(r=6e4),this._cache={},this._requests=0,this.baseUrl=e,this.cacheTimeout=t<0?0:t,this.responseTimeout=r<0?0:r}return e.prototype.onError=function(e){var t=this.context;if(t){var r=new Error("error");r.result=this.response.toString(),r.serverStatus=this.status,r.timestamp=e.timeStamp,r.url=t.url,t.isCountingRequest&&(t.isCountingRequest=!1,t.ajax._requests--),t.reject(r)}},e.prototype.onLoad=function(e){var t=this.context;t&&(t.isCountingRequest&&(t.isCountingRequest=!1,t.ajax._requests--),t.resolve({result:(this.response||"").toString(),serverStatus:this.status,timestamp:e.timeStamp,url:t.url}))},e.prototype.onTimeout=function(e){var t=this.context;if(t){var r=new Error("timeout");r.result=this.response.toString(),r.serverStatus=this.status,r.timestamp=e.timeStamp,r.url=t.url,t.isCountingRequest&&(t.isCountingRequest=!1,t.ajax._requests--),t.reject(r)}},e.prototype.hasOpenRequest=function(){return this._requests<0&&(this._requests=0),this._requests>0},e.prototype.request=function(e){var t=this;return new Promise(function(r,n){var o=t.baseUrl+e,i={ajax:t,resolve:r,reject:n,url:o};if(t.cacheTimeout>0){var s=t._cache[o],u=(new Date).getTime()+t.cacheTimeout;if(s&&s.timestamp>u)return void r(s);delete t._cache[o]}var a=new XMLHttpRequest;a.context=i,i.isCountingRequest=!1;try{t.cacheTimeout<=0&&-1===o.indexOf("?")?a.open("GET",o+"?"+(new Date).getTime(),!0):a.open("GET",o,!0),t._requests++,i.isCountingRequest=!0,a.timeout=t.responseTimeout,a.addEventListener("load",t.onLoad),a.addEventListener("error",t.onError),a.addEventListener("timeout",t.onTimeout),a.send()}catch(e){var c=e;c.result=a.response||"",c.timestamp=(new Date).getTime(),c.serverStatus=a.status,c.url=i.url,i.isCountingRequest&&(i.isCountingRequest=!1,i.ajax._requests--),n(c)}})},e}();t.Ajax=r}),define("@ordbok/core/utilities",["require","exports"],function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=/[^0-9A-Za-z\u0080-\uFFFF -]/g,n=/^(.*?)([^\.\/]*)([^\/]*)$/,o=/\s+/g;!function(e){function t(e){var t=n.exec(e);return t&&t[3]||""}function i(e){var t=n.exec(e);return t&&t[2]||""}function s(e){return e.replace(r," ").trim().replace(o,"-").toLowerCase()}function u(e){return e.replace(r," ").trim().replace(o," ").toLowerCase()}function a(e){var t=n.exec(e);return t&&t[1]||""}function c(e){if(0===e.indexOf("base64,"))e=atob(e);else{for(var t=[],r=0,n=0,o=e.length;n<o;++n)r=e.charCodeAt(n),r+=r<128?128:-128,t.push(String.fromCharCode(r));btoa(t.join(""))}return e}e.getExtension=t,e.getBaseName=i,e.getKey=s,e.getNorm=u,e.getParentPath=a,e.rotate=c}(t.Utilities||(t.Utilities={}))});var __extends=this&&this.__extends||function(){var e=function(t,r){return(e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])})(t,r)};return function(t,r){function n(){this.constructor=t}e(t,r),t.prototype=null===r?Object.create(r):(n.prototype=r.prototype,new n)}}();define("@ordbok/core/dictionary",["require","exports","./ajax","./utilities"],function(e,t,r,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=function(e){function t(){return null!==e&&e.apply(this,arguments)||this}return __extends(t,e),t.parse=function(e){var r,n,o={};return e.split(t.LINE_SEPARATOR).forEach(function(e){if(-1===e.indexOf(t.PAIR_SEPARATOR))return void(o[e]=n={});n&&(r=e.split(t.PAIR_SEPARATOR,2),n[r[0]]=r[1].split(t.VALUE_SEPARATOR))}),o},t.stringify=function(e){var r,o=[];return Object.keys(e).forEach(function(i){o.push(n.Utilities.getKey(i)),r=e[i],Object.keys(r).forEach(function(e){return o.push(n.Utilities.getKey(e)+t.PAIR_SEPARATOR+r[e].join(t.VALUE_SEPARATOR))})}),o.join(t.LINE_SEPARATOR)},t.prototype.loadEntry=function(e,r){return void 0===r&&(r=0),this.request(n.Utilities.getKey(e)+t.FILE_SEPARATOR+r+t.FILE_EXTENSION).then(function(e){if(!(e instanceof Error||e.serverStatus>=400))return t.parse(e.result)}).catch(function(e){console.error(e)})},t.FILE_EXTENSION=".txt",t.FILE_SEPARATOR="-",t.LINE_SEPARATOR="\n",t.PAIR_SEPARATOR=":",t.VALUE_SEPARATOR=";",t}(r.Ajax);t.Dictionary=o});var __extends=this&&this.__extends||function(){var e=function(t,r){return(e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])})(t,r)};return function(t,r){function n(){this.constructor=t}e(t,r),t.prototype=null===r?Object.create(r):(n.prototype=r.prototype,new n)}}();define("@ordbok/core/text",["require","exports"],function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=/\([^\)]*\)|\[[^\]]*\]|\{[^\}]*\}/g,n=/\s+/g,o=function(e){function t(t){return e.call(this,t)||this}return __extends(t,e),t.endsWith=function(e,t){if(e===t)return!0;var r=e.length,n=t.length;return n<=r&&e.lastIndexOf(t)===r-n},t.removeBrackets=function(e){return e.replace(r,"").replace(n," ").trim()},t.trimSpaces=function(e){return e.replace(n," ").trim()},t.prototype.endsWith=function(e){return t.endsWith(this.toString(),e)},t.prototype.removeBrackets=function(){return new t(t.removeBrackets(this.toString()))},t.prototype.trimSpaces=function(){return new t(t.trimSpaces(this.toString()))},t}(String);t.Text=o}),define("@ordbok/core/markdown",["require","exports","./text"],function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=/^(?:#+([\s\S]*)|([\s\S]*?)\n(?:={3,}|-{3,}))$/,o=/^([^\:\n\r\t\v]+):([\s\S]*)$/,i=/(?:^\n?|\n\n)-{3,}(?:\n\n|\n?$)/,s=/\n{2,}/,u=function(){function e(e){this._pages=[],this._raw=e,this.parse(e)}return e.parsePage=function(e){var t,i,u={};return e.split(s).forEach(function(e){t=n.exec(e),t&&(u[r.Text.trimSpaces(t[1]||t[2])]=i={}),i&&(t=o.exec(e))&&(i[t[1]]=t[2].split(";").map(r.Text.trimSpaces))}),u},Object.defineProperty(e.prototype,"pages",{get:function(){return this._pages},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"raw",{get:function(){return this._raw},enumerable:!0,configurable:!0}),e.prototype.parse=function(t){var r=this._pages;t.split(i).forEach(function(t){return r.push(e.parsePage(t))})},e}();t.Markdown=u}),define("@ordbok/core/index",["require","exports","./ajax","./dictionary","./markdown","./text","./utilities"],function(e,t,r,n,o,i,s){"use strict";function u(e){for(var r in e)t.hasOwnProperty(r)||(t[r]=e[r])}Object.defineProperty(t,"__esModule",{value:!0}),u(r),u(n),u(o),u(i),u(s)}),define("@ordbok/core",["@ordbok/core/index"],function(e){return e});
//# sourceMappingURL=ordbok-core.js.map