import { jsonToGraphQLQuery } from "json-to-graphql-query";
import axios from "../axios";

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
    const queryString = jsonToGraphQLQuery(query);

    const { data } = await axios.post(GRAPHQL_ENDPOINT, {
        query: queryString,
    });
    return data.data[table] || [];
};

const getGroups = async () => {
    const groups = await graphqlFetch("groups", {
        id: true,
        name: true,
        max_students: true,
        students_count: true,
        students: {
            id: true,
            name: true,
            email: true,
        },
    });
    return { data: { groups } };
};

export { getGroups };
