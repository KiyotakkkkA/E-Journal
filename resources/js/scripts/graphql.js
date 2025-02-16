import { jsonToGraphQLQuery } from "json-to-graphql-query";
import request from "graphql-request";

const GRAPHQL_ENDPOINT = `${window.location.origin}/graphql`;

const graphqlFetch = async (table, columns, where) => {
    let query = { query: {} };
    query.query[table] = {};
    if (where) {
        query.query[table]["__args"] = where;
    }
    query.query[table] = {
        ...query.query[table],
        ...columns,
    };
    query = jsonToGraphQLQuery(query);
    try {
        const data = await request(GRAPHQL_ENDPOINT, query);
        return data[table] || [];
    } catch (e) {
        console.error(e);
        return [];
    }
};

const getGroups = async () => {
    const groups = await graphqlFetch("groups", {
        id: true,
        name: true,
        max_students: true,
        students_count: true,
    });
    return { data: { groups } };
};

export { getGroups };
