-- Query para generar los json necesarios para la importación en mongo:

-- original simulations
select '{"id":"'||s.id||'","result":'||to_json(s."result"::json)||',"simulation":'|| to_json(s."simulation"::json)||',"created_at":'|| to_json(s."created_at"::text)||'}' from simulations s where id_parent is null;

-- child simulations
select '{"id":"'||s.id||'","result":'||to_json(s."result"::json)||',"simulation":'|| to_json(s."simulation"::json)||',"id_parent":"'||s.id_parent||'"}' from simulations s where id_parent is not null and result not in ('','error');

-- Exportar el resultado de las queries a csv, y después de quitar la cabecera 'column' del documento llevarlo al volumen mapeado del contenedor de mongo para ejecutar la importación:

  mongoimport --uri "mongodb://jamgo:jamgo@localhost:27017/les-meves-ajudes" --collection simulations /docker-entrypoint-initdb.d