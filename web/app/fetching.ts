import { Client } from '@elastic/elasticsearch';

export interface OuraRecord {
    '@timestamp': number,
    "context": {
        "block_hash": string,
        "block_number": number,
        "slot": number,
        "timestamp": number,
        "tx_hash": string,
        "tx_idx": number
    },
    "fingerprint": string | null,
    "cip25_asset": {
        "policy": string,
        "asset": string,
        "name": string,
        "mediatType"?: string,
        "raw_json": Record<string, unknown>,
        "image"?: string,
        "description"?: string,
    },
    "variant": 'CIP25Asset'
}

function buildTermQuery(term: string, after?: number) {
    after = after === NaN || after === 0 ? undefined : after;

    return {
        "query": {
            "function_score": {
                "random_score": {},
                "query": { "multi_match": { "query": term, "fields": [] } },
            }
        },
        "search_after": !!after ? [after] : undefined,
    };
}

function buildShuffleQuery() {
    return {
        "query": {
            "function_score": {
                "random_score": {},
                "query": { "match_all": {} },
            }
        }
    };
}

function isValidRecord(source: any): source is OuraRecord {
    return source["variant"] === "CIP25Asset" &&
        !!source["fingerprint"] &&
        !!source["@timestamp"] &&
        !!source["context"]["block_hash"] &&
        !!source["context"]["block_number"] &&
        !!source["context"]["slot"] &&
        !!source["context"]["tx_hash"] &&
        !!source["cip25_asset"]["policy"] &&
        !!source["cip25_asset"]["asset"] &&
        !!source["cip25_asset"]["name"] &&
        !!source["cip25_asset"]["raw_json"];
}

function newESClient() {
    const username = process.env.ELASTICSEARCH_USERNAME;
    const password = process.env.ELASTICSEARCH_PASSWORD;

    if (!username || !password) {
        throw new Error("Couldn't find Elasticsearch credentials in env vars");
    }

    const url = process.env.ELASTICSEARCH_URL;

    if (!url) {
        throw new Error("Coulnd't find Elasticsearch URL in env vars");
    }

    return new Client({
        node: url,
        ssl: {
            rejectUnauthorized: false,
        },
        auth: {
            username,
            password,
        }
    });
}

interface ESResultHit {
    _id: string,
    _source: any,
}

async function executeESQuery(body: object, size: number, sort?: string[]): Promise<{ total: number, hits: ESResultHit[] }> {
    const client = newESClient();

    const index = process.env.ELASTICSEARCH_CIP25_INDEX;

    if (!index) {
        throw new Error("Couldn't find Elasticsearch CIP-25 index name in env variables");
    }

    const res = await client.search({
        index,
        size,
        body,
        sort,
        rest_total_hits_as_int: true,
    });

    return res.body.hits;
}

export type OuraRecordPage = {
    items: OuraRecord[],
    total: number,
}

export async function fetchShuffle(params: {}): Promise<OuraRecordPage> {
    const query = buildShuffleQuery();
    const result = await executeESQuery(query, 40, []);

    const items = result.hits
        .map(hit => hit._source)
        .filter(source => isValidRecord(source));

    return { items, total: result.total };
};

export async function fetchByTerm(params: { term: string, after?: number }): Promise<OuraRecordPage> {
    const query = buildTermQuery(params.term, params.after);
    const result = await executeESQuery(query, 40, ["@timestamp"]);

    const items = result.hits
        .map(hit => hit._source)
        .filter(source => isValidRecord(source));

    return { items, total: result.total };
};
