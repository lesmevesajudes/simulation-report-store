CREATE SCHEMA ajuts_barcelona_simulations;

\c ajuts_barcelona_simulations;

CREATE TABLE simulation_reports
(
  id                serial NOT NULL
    constraint simulation_reports_pk
    primary key,
  simulation_id     uuid   NOT NULL,
  application_state jsonb,
  expected_result   text,
  accepted_result   boolean,
  comments          text,
  reporter_email    varchar(50),
  test_group        varchar(70),
  created_at        timestamp DEFAULT CURRENT_TIMESTAMP
);

