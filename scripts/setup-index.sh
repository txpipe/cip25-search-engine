curl -k -X PUT https://localhost:9200/_index_template/oura.sink.cip25 \
   -u ${ELASTIC_AUTH} \
   -H 'Content-Type: application/json' \
   -d @index-template.json
