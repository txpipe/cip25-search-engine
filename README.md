# CIP-25 Search Engine (WIP)

A reference app that uses Oura + Elasticsearch + React to buid a Cardano CIP-25 search engine

![Screenshot](assets/screenshot.png)

## Introduction

This is a reference app to show how _Oura_ can be leveradged to build a search engine for CIP-25 tokens.

The frontend is built using React and Remix.

The backend is a combination of a Cardano node, Oura and Elasticsearch.

Everthing is deployed together using Kubernetes

If I missed any buzzwords, let me know :)

## Deployment

Prerequisites

- K8s Cluster
- Skaffold

Install operator

```
kubectl create -f https://download.elastic.co/downloads/eck/1.9.1/crds.yaml
kubectl apply -f https://download.elastic.co/downloads/eck/1.9.1/operator.yaml
```

Build & Deploy

```
skaffold dev
```

Setup Index Template

```
export ELASTIC_AUTH=user:pass
cd scripts && ./setup-index.sh
```

## Dev

```
skaffold dev --default-repo ghcr.io/txpipe --namespace cip25 --module web --cleanup=false
```