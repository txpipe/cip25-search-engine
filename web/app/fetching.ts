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

function buildTermQuery(term?: string | null) {
    if (!term) {
        return { "query": { "match_all": {} } };
    }

    return {
        "query": {
            "multi_match": { "query": term, "fields": [] }
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

async function executeESQuery(body: object, size: number): Promise<ESResultHit[]> {
    const client = newESClient();

    const index = process.env.ELASTICSEARCH_CIP25_INDEX;

    if (!index) {
        throw new Error("Couldn't find Elasticsearch CIP-25 index name in env variables");
    }

    const res = await client.search({
        index,
        size,
        body,
    });

    return res.body.hits.hits as ESResultHit[];
}

export async function fetchByTerm(params: { term: string | null }): Promise<OuraRecord[]> {
    const hits = await executeESQuery(buildTermQuery(params.term), 40);

    return hits
        .map(hit => hit._source)
        .filter(source => isValidRecord(source));
};
