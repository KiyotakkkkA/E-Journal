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

const getGroupHistory = async () => {
    const history = await graphqlFetch("group_history", {
        id: true,
        group_id: true,
        created_at: true,
        status: true,
    });
    return { data: { history } };
};

const getInstitutes = async () => {
    const institutes = await graphqlFetch("institutes", {
        id: true,
        name: true,
        count_cafedras: true,
    });
    return { data: { institutes } };
};

const getCafedras = async (instituteId = null) => {
    const cafedras = await graphqlFetch(
        "cafedras",
        {
            id: true,
            name: true,
            count_teachers: true,
        },
        instituteId ? { institute_id: instituteId } : null
    );
    return { data: { cafedras } };
};

const getDisciplines = async () => {
    const disciplines = await graphqlFetch("disciplines", {
        id: true,
        name: true,
    });
    return { data: { disciplines } };
};

export {
    getGroups,
    getGroupHistory,
    getInstitutes,
    getCafedras,
    getDisciplines,
};
