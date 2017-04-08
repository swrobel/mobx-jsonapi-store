"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Response_1 = require("./Response");
var utils_1 = require("./utils");
exports.config = {
    /** Base URL for all API calls */
    baseUrl: '/',
    /** Default headers that will be sent to the server */
    defaultHeaders: {
        'content-type': 'application/vnd.api+json',
    },
    /** Reference of the fetch method that should be used */
    fetchReference: utils_1.isBrowser && window.fetch,
    /**
     * Base implementation of the fetch function (can be overriden)
     *
     * @param {string} method API call method
     * @param {string} url API call URL
     * @param {Object} [body] API call body
     * @param {IHeaders} [requestHeaders] Headers that will be sent
     * @returns {Promise<IRawResponse>} Resolves with a raw response object
     */
    baseFetch: function (method, url, body, requestHeaders) {
        var _this = this;
        var data;
        var status;
        var headers;
        var request = Promise.resolve();
        return request
            .then(function () {
            var reqHeaders = utils_1.assign({}, exports.config.defaultHeaders, requestHeaders);
            return _this.fetchReference(url, {
                body: JSON.stringify(body),
                headers: reqHeaders,
                method: method,
            });
        })
            .then(function (response) {
            status = response.status;
            headers = response.headers;
            return response.json();
        })
            .then(function (responseData) {
            data = responseData;
            if (status >= 400) {
                throw {
                    status: status,
                    message: "Invalid HTTP status: " + status,
                };
            }
            return { data: data, headers: headers, requestHeaders: requestHeaders, status: status };
        })
            .catch(function (error) {
            return { data: data, error: error, headers: headers, requestHeaders: requestHeaders, status: status };
        });
    },
};
/**
 * API call used to get data from the server
 *
 * @export
 * @param {Store} store Related Store
 * @param {string} url API call URL
 * @param {IHeaders} [headers] Headers to be sent
 * @param {IRequestOptions} [options] Server options
 * @returns {Promise<Response>} Resolves with a Response object
 */
function read(store, url, headers, options) {
    return exports.config.baseFetch('GET', url, null, headers)
        .then(function (response) { return new Response_1.Response(response, store, options); });
}
exports.read = read;
/**
 * API call used to create data on the server
 *
 * @export
 * @param {Store} store Related Store
 * @param {string} url API call URL
 * @param {Object} [data] Request body
 * @param {IHeaders} [headers] Headers to be sent
 * @param {IRequestOptions} [options] Server options
 * @returns {Promise<Response>} Resolves with a Response object
 */
function create(store, url, data, headers, options) {
    return exports.config.baseFetch('POST', url, data, headers)
        .then(function (response) { return new Response_1.Response(response, store, options); });
}
exports.create = create;
/**
 * API call used to update data on the server
 *
 * @export
 * @param {Store} store Related Store
 * @param {string} url API call URL
 * @param {Object} [data] Request body
 * @param {IHeaders} [headers] Headers to be sent
 * @param {IRequestOptions} [options] Server options
 * @returns {Promise<Response>} Resolves with a Response object
 */
function update(store, url, data, headers, options) {
    return exports.config.baseFetch('PATCH', url, data, headers)
        .then(function (response) { return new Response_1.Response(response, store, options); });
}
exports.update = update;
/**
 * API call used to remove data from the server
 *
 * @export
 * @param {Store} store Related Store
 * @param {string} url API call URL
 * @param {IHeaders} [headers] Headers to be sent
 * @param {IRequestOptions} [options] Server options
 * @returns {Promise<Response>} Resolves with a Response object
 */
function remove(store, url, headers, options) {
    return exports.config.baseFetch('DELETE', url, null, headers)
        .then(function (response) { return new Response_1.Response(response, store, options); });
}
exports.remove = remove;
/**
 * Fetch a link from the server
 *
 * @export
 * @param {JsonApi.ILink} link Link URL or a link object
 * @param {Store} store Store that will be used to save the response
 * @param {IDictionary<string>} [requestHeaders] Request headers
 * @param {IRequestOptions} [options] Server options
 * @returns {Promise<LibResponse>} Response promise
 */
function fetchLink(link, store, requestHeaders, options) {
    var href = typeof link === 'object' ? link.href : link;
    return link
        ? read(store, href, requestHeaders, options)
        : Promise.resolve(new Response_1.Response({ data: null }, store));
}
exports.fetchLink = fetchLink;