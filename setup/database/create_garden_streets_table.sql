CREATE TABLE "cutler"."garden_streets"
(
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    status text NOT NULL,
    type text,
    eligible_type_1 boolean,
    eligible_type_2 boolean,
    eligible_type_3 boolean,
    benefits_type_1 real,
    benefits_type_2 real,
    benefits_type_3 real,
    costs_type_1 real,
    costs_type_2 real,
    costs_type_3 real,
    profits_type_1 real,
    profits_type_2 real,
    profits_type_3 real,
    evaluation text,
    remarks text,
    area real NOT NULL,
    geometry geometry NOT NULL
);