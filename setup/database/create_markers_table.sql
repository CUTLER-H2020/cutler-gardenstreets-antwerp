CREATE TABLE "cutler"."markers"
(
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  geometry geometry NOT NULL
);