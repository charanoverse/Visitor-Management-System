'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _request = require('./request');

var _request2 = _interopRequireDefault(_request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * AWS Lambda Proxy Router
 */
var Alpr = function () {
  /**
   * Adds all the AWS Lambda handler function parameters to the current instance for the router to
   * match with.
   *
   * @return {void}
   */
  function Alpr() {
    var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Alpr);

    this.routeMatched = false;
    this.event = data.event || {};
    this.context = data.context || {};
    this.callback = data.callback;
    this.logRequestIds();

    if (typeof this.callback !== 'function') {
      throw new Error('A callback must be specified.');
    }
  }

  /**
   * Logs the request ids from API Gateway and Lambda to make debugging requests from API Gateway
   * easier.
   *
   * @return {void}
   */


  _createClass(Alpr, [{
    key: 'logRequestIds',
    value: function logRequestIds() {
      var apiGatewayRequestId = void 0;
      var lambdaRequestId = void 0;

      if (this.event && this.event.requestContext && this.event.requestContext.requestId) {
        apiGatewayRequestId = this.event.requestContext.requestId;
      }

      if (this.context && this.context.awsRequestId) {
        lambdaRequestId = this.context.awsRequestId;
      }

      if (apiGatewayRequestId && lambdaRequestId) {
        console.log('Lambda request ID: ' + lambdaRequestId + '. API Gateway request ID: ' + apiGatewayRequestId); // eslint-disable-line
      }
    }

    /**
     * Router function. Should be called for each route you want to create.
     *
     * @param {Object} params
     * Parameters object containing the route information
     *
     * @param {string|Array} params.method
     * HTTP verb to create the route for.
     *
     * @param {string|Array} params.path
     * The path to match the route on.
     *
     * @param {Callback} params.handler
     * Function to be called when the route is matched. Should take two parameters, those being
     * request and response.
     *
     * @return {Callback|boolean}
     * Calls the handler method specified in the route information when a route matches, else returns
     * false.
     */

  }, {
    key: 'route',
    value: function route(params) {
      if (this.routeMatched || !this.routeMatcher(params)) {
        return false;
      }

      this.routeMatched = true;

      var request = new _request2.default({ event: this.event, context: this.context });
      var instancedClass = this;

      /**
       * Should be used to send a response back to the client, acting as a wrapper for Lambda's
       * callback function, except this only sends data as the second parameter.
       *
       * @param {mixed} data
       * The response to send back to the client. Should follow the structure for lambda proxy
       * responses outlined here: https://goo.gl/pI0ApC. If the response structure is not followed, a
       * default of no headers and a status code of 200 will be applied with the body being a json
       * stringified result of the whole data parameter.
       *
       * @param {number} data.statusCode
       * The HTTP status code that the response should be. By default this will be set to 200.
       *
       * @param {Object} data.headers
       * Any headers to return with the API result.
       *
       * @param {mixed} data.body
       * Payload to send back as the API response. This will be json stringified.
       *
       * @param {boolean} data.isBase64Encoded
       * Set this to true to return isBase64Encoded true on the response object.
       */
      var response = function response() {
        var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        var responseData = {};

        responseData.statusCode = Number.isInteger(data.statusCode) ? data.statusCode : 200;
        responseData.headers = _typeof(data.headers) === 'object' ? data.headers : {};
        if (data.isBase64Encoded) {
          responseData.body = data.body || '';
          responseData.isBase64Encoded = true;
        } else {
          responseData.body = JSON.stringify(data.body || data);
        }

        return instancedClass.callback(null, responseData);
      };

      return params.handler(request, response);
    }

    /**
     * Makes an attempt to match the route based on the parameters specified to the route method.
     *
     * @param {Object} params
     * Parameters object containing the route information
     *
     * @param {string|Array} params.method
     * HTTP verb to create the route for.
     *
     * @param {string|Array} params.path
     * The path to match the route on.
     *
     * @return {boolean}
     * Returns true or false depending on if the route was matched.
     */

  }, {
    key: 'routeMatcher',
    value: function routeMatcher(params) {
      var resourceMatched = false;
      var methodMatched = false;

      methodMatched = Alpr.inArrayOrIsString(this.event.httpMethod, params.method);
      resourceMatched = Alpr.inArrayOrIsString(this.event.resource, params.path);

      return methodMatched && resourceMatched;
    }

    /**
     * Return true when the needle is in the haystack Array or strictly when the needle is equal to
     * the haystack.
     *
     * @param {string} needle
     * Value to find in the array or to match on the string.
     *
     * @param {string|Array} haystack
     * If this is an array we check if the array contains the needle, if this is a string we check if
     * the values are strictly equal.
     *
     * @return {boolean}
     * Returns true when the haystack is not an array and it is strictly equal to the needle. Or when
     * the haystack is an array and the needle includes the value.
     */

  }], [{
    key: 'inArrayOrIsString',
    value: function inArrayOrIsString() {
      var needle = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      var haystack = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

      if (Array.isArray(haystack)) {
        return haystack.includes(needle);
      }

      return haystack === needle;
    }
  }]);

  return Alpr;
}();

exports.default = Alpr;