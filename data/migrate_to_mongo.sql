-- original simulations
select '{"id":"'||s.id||'","result":'||to_json(s."result"::json)||',"simulation":'|| to_json(s."simulation"::json)||',"created_at":'|| to_json(s."created_at"::text)||'}' from simulations s where id_parent is null;
-- child simulations
select '{"id":"'||s.id||'","id_parent":"'||s.id_parent||'","result":'||to_json(s."result"::json)||',"simulation"'|| to_json(s."simulation"::json) from simulations s where id_parent is not null and result not in ('','error');
