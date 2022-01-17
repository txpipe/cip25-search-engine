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
        throw new Error("couldn't find elasticsearch credentials in env variables");
    }

    return new Client({
        node: 'https://localhost:9200',
        ssl: {
            rejectUnauthorized: false,
        },
        auth: {
            username,
            password,
        }
    });
}

export async function fetchByTerm(params: { term: string | null }): Promise<OuraRecord[]> {
    const client = newESClient();

    const res = await client.search({
        index: "oura.sink.cip25assets",
        body: buildTermQuery(params.term),
        size: 40,
    });

    const hits = res.body.hits.hits as { _source: any }[];

    return hits
        .map(hit => hit._source)
        .filter(source => isValidRecord(source));
};
