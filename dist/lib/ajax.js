"use strict";
/*---------------------------------------------------------------------------*/
/* Copyright (c) ORDBOK contributors. All rights reserved.                   */
/* Licensed under the MIT License. See the LICENSE file in the project root. */
/*---------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
/* *
 *
 *  Classes
 *
 * */
/**
 * Manages AJAX communication with a server.
 */
var Ajax = /** @class */ (function () {
    /* *
     *
     *  Constructors
     *
     * */
    /**
     * Creates a new managed AJAX instance.
     *
     * @param baseUrl
     *        Base URL of the server
     *
     * @param cacheTimeout
     *        Use 0 milliseconds to turn off all cache systems
     *
     * @param responseTimeout
     *        Time in milliseconds to wait for a server response
     */
    function Ajax(baseUrl, cacheTimeout, responseTimeout) {
        this._cache = {};
        this.baseUrl = (baseUrl || '');
        this.cacheTimeout = (cacheTimeout || 3600000);
        this.responseTimeout = (responseTimeout || 60000);
    }
    /* *
     *
     *  Functions
     *
     * */
    /**
     * Requests a server resource
     *
     * @param urlPath
     *        Base relative path to the requested server resource
     */
    Ajax.prototype.request = function (urlPath) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var url = _this.baseUrl + urlPath;
            if (_this.cacheTimeout > 0) {
                var cachedResult = _this._cache[url];
                var cacheTimeout = (new Date()).getTime() + _this.cacheTimeout;
                if (cachedResult &&
                    cachedResult.timestamp > cacheTimeout) {
                    resolve(cachedResult);
                    return;
                }
                delete _this._cache[url];
            }
            var server = new XMLHttpRequest();
            try {
                if (_this.cacheTimeout === 0 && url.indexOf('?') === -1) {
                    server.open('GET', (url + '?' + (new Date()).getTime()), true);
                }
                else {
                    server.open('GET', url, true);
                }
                server.timeout = _this.responseTimeout;
                server.addEventListener('load', function (evt) { return resolve({
                    result: (server.response || '').toString(),
                    serverStatus: server.status,
                    timestamp: evt.timeStamp,
                    url: url
                }); });
                server.addEventListener('error', function (evt) {
                    var error = new Error('error');
                    error.result = server.response.toString();
                    error.serverStatus = server.status;
                    error.timestamp = evt.timeStamp;
                    error.url = url;
                    reject(error);
                });
                server.addEventListener('timeout', function (evt) {
                    var error = new Error('timeout');
                    error.result = server.response.toString();
                    error.serverStatus = server.status;
                    error.timestamp = evt.timeStamp;
                    error.url = url;
                    reject(error);
                });
                server.send();
            }
            catch (catchedError) {
                var error = catchedError;
                error.result = (server.response || '');
                error.timestamp = (new Date()).getTime();
                error.serverStatus = server.status;
                error.url = url;
                reject(error);
            }
        });
    };
    return Ajax;
}());
exports.Ajax = Ajax;
