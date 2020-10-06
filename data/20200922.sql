ALTER TABLE simulations ADD "result" varchar NULL;
ALTER TABLE simulations ADD id_parent varchar NULL;
ALTER TABLE simulations ALTER COLUMN id TYPE varchar USING id::varchar;
