INSERT INTO users (id, name) VALUES
    (1, 'Farmer Demo')
ON CONFLICT (id) DO NOTHING;

INSERT INTO regions (id, name, climate_type) VALUES
    (1, 'Altiplano Central', 'templado-seco'),
    (2, 'Golfo Húmedo', 'cálido-húmedo')
ON CONFLICT (id) DO NOTHING;

INSERT INTO crops (id, code, name, type, description) VALUES
    (1, 'CORN', 'Maíz', 'ANNUAL', 'Maíz de ciclo anual para manejo diario.'),
    (2, 'BEANS', 'Frijol', 'ANNUAL', 'Frijol de ciclo corto con seguimiento por etapa.'),
    (3, 'SQUASH', 'Calabaza', 'ANNUAL', 'Calabaza de desarrollo rastrero y fruto visible.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO crop_stages (id, crop_id, name, min_day, max_day, description) VALUES
    (1, 1, 'Germinación', 0, 7, 'La semilla debe brotar si el suelo conserva buena humedad.'),
    (2, 1, 'Crecimiento inicial', 8, 25, 'Deben salir las primeras hojas y el tallo debe empezar a agarrar fuerza.'),
    (3, 1, 'Vegetativo', 26, 50, 'La planta debe crecer pareja, con hojas verdes y buen vigor.'),
    (4, 1, 'Floración', 51, 70, 'Observa espiga y jilote. El cultivo necesita humedad pareja.'),
    (5, 1, 'Formación de mazorca', 71, 90, 'La mazorca debe empezar a llenarse. Revisa fuerza de la planta y color de hojas.'),
    (6, 1, 'Maduración', 91, 9999, 'La mazorca debe endurecerse y secarse poco a poco para la cosecha.'),
    (7, 2, 'Germinación', 0, 5, 'La semilla debe salir pareja si la humedad del suelo es suficiente.'),
    (8, 2, 'Crecimiento inicial', 6, 20, 'Deben abrirse las primeras hojas y el tallo debe fortalecerse.'),
    (9, 2, 'Vegetativo', 21, 40, 'La planta debe ramificarse y mantener un verde sano.'),
    (10, 2, 'Floración', 41, 55, 'Empiezan a salir flores. Evita estresar el cultivo.'),
    (11, 2, 'Formación de vainas', 56, 75, 'Las vainas deben empezar a llenarse. Observa plagas y crecimiento disparejo.'),
    (12, 2, 'Maduración', 76, 9999, 'Las vainas deben secarse y madurar para la cosecha.'),
    (13, 3, 'Germinación', 0, 7, 'La semilla debe emerger rápido si hay calor y humedad ligera.'),
    (14, 3, 'Crecimiento inicial', 8, 20, 'Las primeras hojas deben abrirse y la base debe fortalecerse.'),
    (15, 3, 'Desarrollo de guías', 21, 40, 'Las guías deben alargarse y cubrir más espacio.'),
    (16, 3, 'Floración', 41, 60, 'Deben aparecer flores y la polinización se vuelve clave.'),
    (17, 3, 'Desarrollo del fruto', 61, 90, 'El fruto debe empezar a engordar. Mantén humedad constante.'),
    (18, 3, 'Maduración', 91, 9999, 'El fruto debe ponerse firme y tomar su color final.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO recommendations (id, crop_id, stage_id, condition, type, message, priority, version, active, region_id) VALUES
    (1, 1, 1, 'ANY', 'ACTION', 'Espera humedad pareja antes de mover la tierra.', 1, 1, true, NULL),
    (2, 1, 1, 'ANY', 'OBSERVATION', 'Revisa si el brote sale parejo y si la tierra conserva humedad.', 2, 1, true, NULL),
    (3, 1, 2, 'ANY', 'ACTION', 'Si la planta se ve floja, puedes dar un abono orgánico ligero.', 1, 1, true, NULL),
    (4, 1, 2, 'ANY', 'OBSERVATION', 'Observa color de hojas nuevas y fuerza del tallo.', 2, 1, true, NULL),
    (5, 1, 4, 'ANY', 'ACTION', 'Conserva humedad estable y evita trabajos bruscos alrededor de la planta.', 1, 1, true, NULL),
    (6, 1, 6, 'ANY', 'ACTION', 'Prepara la cosecha y deja que la mazorca termine de secarse en la planta.', 1, 1, true, NULL),
    (7, 2, 7, 'ANY', 'ACTION', 'Revisa que la salida sea pareja y mantén la tierra suelta.', 1, 1, true, NULL),
    (8, 2, 10, 'ANY', 'ACTION', 'Evita estresar el cultivo mientras van abriendo las flores.', 1, 1, true, NULL),
    (9, 2, 10, 'ANY', 'OBSERVATION', 'Mira si la flor abre bien y si hay presencia de insectos.', 2, 1, true, NULL),
    (10, 2, 12, 'ANY', 'ACTION', 'Prepara la recolección y deja que las vainas maduren bien.', 1, 1, true, NULL),
    (11, 3, 13, 'ANY', 'ACTION', 'Mantén humedad ligera y evita apretar la tierra.', 1, 1, true, NULL),
    (12, 3, 15, 'ANY', 'ACTION', 'Acomoda las guías y deja espacio para que crezcan sanas.', 1, 1, true, NULL),
    (13, 3, 17, 'ANY', 'ACTION', 'Mantén humedad constante para que el fruto engorde bien.', 1, 1, true, NULL),
    (14, 3, 18, 'ANY', 'ACTION', 'Revisa la firmeza del fruto y alista la cosecha.', 1, 1, true, NULL),
    (15, NULL, NULL, 'RAIN_HIGH', 'WARNING', 'Evita fumigar hoy, porque la lluvia puede reducir el efecto.', 1, 1, true, NULL),
    (16, NULL, NULL, 'RAIN_HIGH', 'WARNING', 'La lluvia fuerte puede lavar aplicaciones y subir el riesgo de enfermedad.', 2, 1, true, NULL),
    (17, NULL, NULL, 'DRY', 'WARNING', 'El terreno se siente seco. Revisa la humedad antes de hacer trabajo extra.', 1, 1, true, NULL),
    (18, NULL, NULL, 'LOW_WATER', 'WARNING', 'No hay suficiente agua disponible, prioriza riego.', 1, 1, true, NULL),
    (19, 1, 4, 'RAIN_HIGH', 'WARNING', 'Con lluvia alta, evita aplicar productos foliares sobre el maíz.', 1, 1, true, NULL),
    (20, 2, 10, 'RAIN_HIGH', 'WARNING', 'Con humedad y lluvia, vigila hongos en floración de frijol.', 1, 1, true, NULL),
    (21, 3, 17, 'RAIN_HIGH', 'WARNING', 'Con lluvia alta, revisa hongos y manchas en hojas de calabaza.', 1, 1, true, NULL)
ON CONFLICT (id) DO NOTHING;

INSERT INTO lunar_activities (id, phase, activity) VALUES
    (1, 'NEW_MOON', 'Preparar la tierra'),
    (2, 'NEW_MOON', 'Sembrar cultivos de raíz'),
    (3, 'WAXING_CRESCENT', 'Sembrar nuevas semillas'),
    (4, 'WAXING_CRESCENT', 'Aplicar abono ligero'),
    (5, 'FIRST_QUARTER', 'Sembrar cultivos de hoja'),
    (6, 'FIRST_QUARTER', 'Favorecer el crecimiento de hojas'),
    (7, 'WAXING_GIBBOUS', 'Trasplantar con cuidado'),
    (8, 'WAXING_GIBBOUS', 'Revisar humedad y riego'),
    (9, 'FULL_MOON', 'Fertilizar'),
    (10, 'FULL_MOON', 'Cosechar'),
    (11, 'WANING_GIBBOUS', 'Observar cultivos listos'),
    (12, 'WANING_GIBBOUS', 'Preparar herramientas y guardado'),
    (13, 'LAST_QUARTER', 'Podar y limpiar'),
    (14, 'LAST_QUARTER', 'Limpiar el terreno'),
    (15, 'WANING_CRESCENT', 'Dejar descansar la tierra'),
    (16, 'WANING_CRESCENT', 'Planear el siguiente ciclo')
ON CONFLICT (id) DO NOTHING;

SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
SELECT setval('regions_id_seq', (SELECT MAX(id) FROM regions));
SELECT setval('crops_id_seq', (SELECT MAX(id) FROM crops));
SELECT setval('crop_stages_id_seq', (SELECT MAX(id) FROM crop_stages));
SELECT setval('recommendations_id_seq', (SELECT MAX(id) FROM recommendations));
SELECT setval('lunar_activities_id_seq', (SELECT MAX(id) FROM lunar_activities));
