"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.parseBody = parseBody;

var _zlib = _interopRequireDefault(require("zlib"));

var _rawBody = _interopRequireDefault(require("raw-body"));

var _httpErrors = _interopRequireDefault(require("../http-errors"));

var _contentType = _interopRequireDefault(require("content-type"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Provided a "Request" provided by express or connect (typically a node style
 * HTTPClientRequest), Promise the body data contained.
 */
async function parseBody(req) {
    let body;

    if (req.headers['content-type'] === undefined) {
        return {};
    }

    const typeInfo = _contentType.default.parse(req); // If express has already parsed a body as a string, and the content-type
    // was application/graphql, parse the string body.


    if (typeof body === 'string' && typeInfo.type === 'application/graphql') {
        return {
            query: body
        };
    }

    const rawBody = await readBody(req, typeInfo); // Use the correct body parser based on Content-Type header.

    switch (typeInfo.type) {
        case 'application/graphql':
            return {
                query: rawBody
            };

        case 'application/json':
            if (jsonObjRegex.test(rawBody)) {
                try {
                    return JSON.parse(rawBody);
                } catch (error) { } // Do nothing
            }

            throw (0, _httpErrors.default)(400, 'POST body sent invalid JSON.');
    } // If no Content-Type header matches, parse nothing.

    return {};
}
/**
 * RegExp to match an Object-opening brace "{" as the first non-space
 * in a string. Allowed whitespace is defined in RFC 7159:
 *
 *     ' '   Space
 *     '\t'  Horizontal tab
 *     '\n'  Line feed or New line
 *     '\r'  Carriage return
 */


const jsonObjRegex = /^[ \t\n\r]*\{/; // Read and parse a request body.

async function readBody(req, typeInfo) {
    const charset = (typeInfo.parameters.charset || 'utf-8').toLowerCase(); // Assert charset encoding per JSON RFC 7159 sec 8.1

    if (charset.slice(0, 4) !== 'utf-') {
        throw (0, _httpErrors.default)(415, `Unsupported charset "${charset.toUpperCase()}".`);
    } // Get content-encoding (e.g. gzip)


    const contentEncoding = req.headers['content-encoding'];
    const encoding = typeof contentEncoding === 'string' ? contentEncoding.toLowerCase() : 'identity';
    const length = encoding === 'identity' ? req.headers['content-length'] : null;
    const limit = 100 * 1024; // 100kb

    const stream = decompressed(req, encoding); // Read body from stream.

    try {
        return await (0, _rawBody.default)(stream, {
            encoding: charset,
            length,
            limit
        });
    } catch (err) {
        throw err.type === 'encoding.unsupported' ? (0, _httpErrors.default)(415, `Unsupported charset "${charset.toUpperCase()}".`) : (0, _httpErrors.default)(400, `Invalid body: ${err.message}.`);
    }
} // Return a decompressed stream, given an encoding.


function decompressed(req, encoding) {
    switch (encoding) {
        case 'identity':
            return req;

        case 'deflate':
            return req.pipe(_zlib.default.createInflate());

        case 'gzip':
            return req.pipe(_zlib.default.createGunzip());
    }

    throw (0, _httpErrors.default)(415, `Unsupported content-encoding "${encoding}".`);
}
