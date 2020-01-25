"use strict";

const _url = require("url");

const _httpErrors = require("../http-errors");

const { graphql, formatError, validateSchema } = require('graphql')

const _parseBody = require("./parseBody");


/**
 * Middleware for express; takes an options object or function as input to
 * configure behavior, and returns an express middleware.
 */
module.exports = graphqlHTTP;

function graphqlHTTP(options) {
    if (!options) {
        throw new Error('GraphQL middleware requires options.');
    }

    return function graphqlMiddleware(request, response) {
        // the asynchronous process below.
        // Parse the Request to get GraphQL request parameters.

        return getGraphQLParams(request)
            .then((graphQLParams) => {
                const query = graphQLParams.query;
                const variables = graphQLParams.variables;

                // Assert that schema is required.
                if (!options.schema) {
                    throw new Error('GraphQL middleware options must contain a schema.');
                } // Collect information from the options data object.


                const schema = options.schema;

                // GpraphQL allow to us use only POST method
                if (request.method !== 'POST') {
                    response.setHeader('Allow', 'POST');
                    throw (0, _httpErrors)(405, 'GraphQL only supports GET and POST requests.');
                } // Get GraphQL params from the request and POST body data.

                if (!query) {
                    throw (0, _httpErrors)(400, 'Must provide query string.');
                } // Validate Schema


                const schemaValidationErrors = (0, validateSchema)(schema);

                if (schemaValidationErrors.length > 0) {
                    // Return 500: Internal Server Error if invalid schema.
                    response.statusCode = 500;
                    return {
                        errors: schemaValidationErrors
                    };
                } //  GraphQL source.

                try {
                    /* 
                    The graphql function lexes,
                    parses, validates and executes a GraphQL request.
                    It requires a schema and a requestString.
                    Optional arguments include a rootValue,
                    which will get passed as the root value to the executor,
                    a contextValue, which will get passed to
                    all resolve functions, variableValues,
                    which will get passed to the executor
                    to provide values for any variables in requestString,
                    and operationName, which allows the caller
                    to specify which operation in requestString will be run,
                    in cases where requestString contains
                    multiple top-level operations.
                    */
                    return graphql(
                        schema,
                        query,
                        null,
                        request,
                        variables
                    );
                } catch (contextError) {
                    // Return 400: Bad Request if any execution context errors exist.
                    response.statusCode = 400;
                    return {
                        errors: [contextError]
                    };
                }
            }).catch(error => {
                // If an error was caught, report the httpError status, or 500.
                response.statusCode = error.status || 500;
                return {
                    errors: [error]
                };
            }).then(result => {
                // If no data was included in the result, that indicates a runtime query
                // error, indicate as such with a generic status code.
                // Note: Information about the error itself will still be contained in
                // the resulting JSON payload.
                // https://graphql.github.io/graphql-spec/#sec-Data
                if (response.statusCode === 200 && result && !result.data) {
                    response.statusCode = 500;
                } // Format any encountered errors.


                if (result && result.errors) {
                    result.errors = result.errors.map(formatError);
                } // If allowed to show GraphiQL, present it instead of JSON.


                if (!result) {
                    throw (0, _httpErrors)(500, 'Internal Error');
                }

                const payload = JSON.stringify(result);
                sendResponse(response, 'application/json', payload);
            });
    };
}

/**
 * Provided a "Request" provided by express or connect (typically a node style
 * HTTPClientRequest), Promise the GraphQL request parameters.
 */
module.exports.getGraphQLParams = getGraphQLParams;

async function getGraphQLParams(request) {
    const bodyData = await (0, _parseBody.parseBody)(request);
    const urlData = request.url && _url.parse(request.url, true).query || {};
    return parseGraphQLParams(urlData, bodyData);
}
/**
 * Helper function to get the GraphQL params from the request.
 */


function parseGraphQLParams(urlData, bodyData) {
    // GraphQL Query string.
    let query = urlData.query || bodyData.query;

    if (typeof query !== 'string') {
        query = null;
    } // Parse the variables if needed.


    let variables = urlData.variables || bodyData.variables;

    if (variables && typeof variables === 'string') {
        try {
            variables = JSON.parse(variables);
        } catch (error) {
            throw (0, _httpErrors)(400, 'Variables are invalid JSON.');
        }
    } else if (typeof variables !== 'object') {
        variables = null;
    } // Name of GraphQL operation to execute.


    let operationName = urlData.operationName || bodyData.operationName;

    if (typeof operationName !== 'string') {
        operationName = null;
    }

    const raw = urlData.raw !== undefined || bodyData.raw !== undefined;
    return {
        query,
        variables,
        operationName,
        raw
    };
}


/**
 * Helper function for sending a response using only the core Node server APIs.
 */
function sendResponse(response, type, data) {
    const chunk = Buffer.from(data, 'utf8');
    response.setHeader('Content-Type', type + '; charset=utf-8');
    response.setHeader('Content-Length', String(chunk.length));
    response.end(chunk);
}
