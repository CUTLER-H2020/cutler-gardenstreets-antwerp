# requires PGPASSWORD env var

INPUT_SHAPEFILE=$1
DATABASE=$2
TABLE_NAME=$3

if [ -z "$INPUT_SHAPEFILE" ] || [ -z "$DATABASE" ] || [ -z "$TABLE_NAME" ]
then
    echo "Usage:"
    echo "./load.sh <input_shapefile> <database> <table_name>"
    exit 1
fi

if [ -z "$PGPASSWORD" ]
then
    echo "Please set the PGPASSWORD env var"
    exit 1
fi

shp2pgsql \
    -d \
    -s 4326 \
    $INPUT_SHAPEFILE \
    $TABLE_NAME \
| psql \
    -h cutler-db.postgres.database.azure.com \
    -p 5432 \
    -d $DATABASE \
    -U cutler_admin@cutler-db \
    -e