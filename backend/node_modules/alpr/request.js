"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Used as the first parameter in route handler methods.
 */
var Request = function () {
  /**
   * Adds the event and context to the instance.
   *
   * @param {Object} params
   * Parameters containing request information
   *
   * @param {Object} params.event
   * The lambda event object.
   *
   * @param {Object} params.context
   * The lambda context object.
   */
  function Request() {
    var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Request);

    this.event = params.event || {};
    this.context = params.context || {};
  }

  /**
   * Gets the whole lambda context object.
   *
   * @return {Object}
   * The lambda context object
   */


  _createClass(Request, [{
    key: "contextObject",
    get: function get() {
      return this.context;
    }

    /**
     * Gets the whole lambda event object.
     *
     * @return {Object}
     * The lambda event object
     */

  }, {
    key: "eventObject",
    get: function get() {
      return this.event;
    }

    /**
     * Gets the stage variables from the event object.
     *
     * @return {Object}
     * Returns the stage variables if they are available. Will return an empty object if not.
     */

  }, {
    key: "stageVariables",
    get: function get() {
      return this.event.stageVariables || {};
    }

    /**
     * Gets the query string parameters from the event.
     *
     * @return {Object}
     * An object containing all the query string parameters.
     */

  }, {
    key: "queryStringParameters",
    get: function get() {
      return this.event.queryStringParameters || {};
    }

    /**
     * Gets the JSON parsed body from the request. If the body is not parseable an empty object is
     * returned.
     *
     * @return {Object}
     * JSON parsed body input.
     */

  }, {
    key: "body",
    get: function get() {
      var body = void 0;

      try {
        body = JSON.parse(this.event.body);
      } catch (error) {
        body = {};
      }

      return body;
    }

    /**
     * Returns the raw body sent in the request without it being JSON parsed.
     *
     * @return {string}
     * The raw body from the request.
     */

  }, {
    key: "rawBody",
    get: function get() {
      return this.event.body;
    }

    /**
     * Returns the inputted pathParameters from the event object.
     *
     * @return {Object}
     * The path parameters object.
     */

  }, {
    key: "pathParameters",
    get: function get() {
      return this.event.pathParameters || {};
    }

    /**
     * Return the headers object or an empty object from the event.
     *
     * @return {Object}
     * The headers from the request
     */

  }, {
    key: "headers",
    get: function get() {
      return this.event.headers || {};
    }

    /**
     * Gets all of the input parameters combined. Note if variables have identical names,
     * queryStringParameters will overwrite pathParameters and pathParameters will overwrite body.
     *
     * @return {Object}
     * An object containing all of the request parameters.
     */

  }, {
    key: "allParams",
    get: function get() {
      return Object.assign({}, this.body, this.pathParameters, this.queryStringParameters);
    }
  }]);

  return Request;
}();

exports.default = Request;