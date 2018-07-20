CREATE SCHEMA ajuts_barcelona_simulations;

\c ajuts_barcelona_simulations;

CREATE TABLE simulations (
  ID SERIAL PRIMARY KEY,
  application_state jsonb,
  expected_result text,
  valid_result boolean,
  comments text,
  created_at timestamp default current_timestamp
);


