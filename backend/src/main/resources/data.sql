INSERT INTO users (id, name, streak_count, last_check_date) VALUES
    (1, 'Farmer Demo', 0, NULL)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    streak_count = EXCLUDED.streak_count,
    last_check_date = EXCLUDED.last_check_date;

UPDATE regions
SET climate_type = 'templado-seco'
WHERE name = 'Altiplano Central';

UPDATE regions
SET climate_type = 'calido-humedo'
WHERE name = 'Golfo Humedo';

INSERT INTO regions (name, climate_type)
SELECT region_data.name, region_data.climate_type
FROM (
    VALUES
        ('Altiplano Central', 'templado-seco'),
        ('Golfo Humedo', 'calido-humedo')
) AS region_data(name, climate_type)
WHERE NOT EXISTS (
    SELECT 1
    FROM regions existing_regions
    WHERE existing_regions.name = region_data.name
);

INSERT INTO crops (code, name, type, description) VALUES
    ('CORN', 'Maiz', 'ANNUAL', 'Maiz de ciclo anual para manejo diario.'),
    ('BEANS', 'Frijol', 'ANNUAL', 'Frijol de ciclo corto con seguimiento por etapa.'),
    ('SQUASH', 'Calabaza', 'ANNUAL', 'Calabaza de desarrollo rastrero y fruto visible.'),
    ('JITOMATE', 'Jitomate', 'ANNUAL', 'Jitomate de mesa para seguimiento diario.')
ON CONFLICT (code) DO UPDATE SET
    name = EXCLUDED.name,
    type = EXCLUDED.type,
    description = EXCLUDED.description;

INSERT INTO crop_stages (id, crop_id, name, min_day, max_day, description) VALUES
    (1, (SELECT id FROM crops WHERE code = 'CORN'), 'Germinacion', 0, 7, 'La semilla debe brotar si el suelo conserva buena humedad.'),
    (2, (SELECT id FROM crops WHERE code = 'CORN'), 'Crecimiento inicial', 8, 25, 'Deben salir las primeras hojas y el tallo debe empezar a agarrar fuerza.'),
    (3, (SELECT id FROM crops WHERE code = 'CORN'), 'Vegetativo', 26, 50, 'La planta debe crecer pareja, con hojas verdes y buen vigor.'),
    (4, (SELECT id FROM crops WHERE code = 'CORN'), 'Floracion', 51, 70, 'Observa espiga y jilote. El cultivo necesita humedad pareja.'),
    (5, (SELECT id FROM crops WHERE code = 'CORN'), 'Formacion de mazorca', 71, 90, 'La mazorca debe empezar a llenarse. Revisa fuerza de la planta y color de hojas.'),
    (6, (SELECT id FROM crops WHERE code = 'CORN'), 'Maduracion', 91, 9999, 'La mazorca debe endurecerse y secarse poco a poco para la cosecha.'),
    (7, (SELECT id FROM crops WHERE code = 'BEANS'), 'Germinacion', 0, 5, 'La semilla debe salir pareja si la humedad del suelo es suficiente.'),
    (8, (SELECT id FROM crops WHERE code = 'BEANS'), 'Crecimiento inicial', 6, 20, 'Deben abrirse las primeras hojas y el tallo debe fortalecerse.'),
    (9, (SELECT id FROM crops WHERE code = 'BEANS'), 'Vegetativo', 21, 40, 'La planta debe ramificarse y mantener un verde sano.'),
    (10, (SELECT id FROM crops WHERE code = 'BEANS'), 'Floracion', 41, 55, 'Empiezan a salir flores. Evita estresar el cultivo.'),
    (11, (SELECT id FROM crops WHERE code = 'BEANS'), 'Formacion de vainas', 56, 75, 'Las vainas deben empezar a llenarse. Observa plagas y crecimiento disparejo.'),
    (12, (SELECT id FROM crops WHERE code = 'BEANS'), 'Maduracion', 76, 9999, 'Las vainas deben secarse y madurar para la cosecha.'),
    (13, (SELECT id FROM crops WHERE code = 'SQUASH'), 'Germinacion', 0, 7, 'La semilla debe emerger rapido si hay calor y humedad ligera.'),
    (14, (SELECT id FROM crops WHERE code = 'SQUASH'), 'Crecimiento inicial', 8, 20, 'Las primeras hojas deben abrirse y la base debe fortalecerse.'),
    (15, (SELECT id FROM crops WHERE code = 'SQUASH'), 'Desarrollo de guias', 21, 40, 'Las guias deben alargarse y cubrir mas espacio.'),
    (16, (SELECT id FROM crops WHERE code = 'SQUASH'), 'Floracion', 41, 60, 'Deben aparecer flores y la polinizacion se vuelve clave.'),
    (17, (SELECT id FROM crops WHERE code = 'SQUASH'), 'Desarrollo del fruto', 61, 90, 'El fruto debe empezar a engordar. Manten humedad constante.'),
    (18, (SELECT id FROM crops WHERE code = 'SQUASH'), 'Maduracion', 91, 9999, 'El fruto debe ponerse firme y tomar su color final.'),
    (19, (SELECT id FROM crops WHERE code = 'JITOMATE'), 'Germinacion', 0, 7, 'La semilla debe brotar si el suelo conserva buena humedad.'),
    (20, (SELECT id FROM crops WHERE code = 'JITOMATE'), 'Crecimiento inicial', 8, 25, 'Deben salir las primeras hojas y el tallo debe empezar a agarrar fuerza.'),
    (21, (SELECT id FROM crops WHERE code = 'JITOMATE'), 'Vegetativo', 26, 50, 'La planta debe crecer pareja, con hojas verdes y buen vigor.'),
    (22, (SELECT id FROM crops WHERE code = 'JITOMATE'), 'Floracion', 51, 70, 'Observa la salida de flores. El cultivo necesita humedad pareja.'),
    (23, (SELECT id FROM crops WHERE code = 'JITOMATE'), 'Formacion de fruto', 71, 90, 'Los frutos deben empezar a formarse. Revisa fuerza de la planta y color de hojas.'),
    (24, (SELECT id FROM crops WHERE code = 'JITOMATE'), 'Maduracion', 91, 9999, 'Los frutos deben madurar para la cosecha.')
ON CONFLICT (id) DO UPDATE SET
    crop_id = EXCLUDED.crop_id,
    name = EXCLUDED.name,
    min_day = EXCLUDED.min_day,
    max_day = EXCLUDED.max_day,
    description = EXCLUDED.description;

INSERT INTO recommendations (id, crop_id, stage_id, condition, type, message, priority, version, active, region_id) VALUES
    (1, (SELECT id FROM crops WHERE code = 'CORN'), 1, 'ANY', 'ACTION', 'Espera humedad pareja antes de mover la tierra.', 1, 1, true, NULL),
    (2, (SELECT id FROM crops WHERE code = 'CORN'), 1, 'ANY', 'OBSERVATION', 'Revisa si el brote sale parejo y si la tierra conserva humedad.', 2, 1, true, NULL),
    (3, (SELECT id FROM crops WHERE code = 'CORN'), 2, 'ANY', 'ACTION', 'Si la planta se ve floja, puedes dar un abono organico ligero.', 1, 1, true, NULL),
    (4, (SELECT id FROM crops WHERE code = 'CORN'), 2, 'ANY', 'OBSERVATION', 'Observa color de hojas nuevas y fuerza del tallo.', 2, 1, true, NULL),
    (5, (SELECT id FROM crops WHERE code = 'CORN'), 4, 'ANY', 'ACTION', 'Conserva humedad estable y evita trabajos bruscos alrededor de la planta.', 1, 1, true, NULL),
    (6, (SELECT id FROM crops WHERE code = 'CORN'), 6, 'ANY', 'ACTION', 'Prepara la cosecha y deja que la mazorca termine de secarse en la planta.', 1, 1, true, NULL),
    (7, (SELECT id FROM crops WHERE code = 'BEANS'), 7, 'ANY', 'ACTION', 'Revisa que la salida sea pareja y manten la tierra suelta.', 1, 1, true, NULL),
    (8, (SELECT id FROM crops WHERE code = 'BEANS'), 10, 'ANY', 'ACTION', 'Evita estresar el cultivo mientras van abriendo las flores.', 1, 1, true, NULL),
    (9, (SELECT id FROM crops WHERE code = 'BEANS'), 10, 'ANY', 'OBSERVATION', 'Mira si la flor abre bien y si hay presencia de insectos.', 2, 1, true, NULL),
    (10, (SELECT id FROM crops WHERE code = 'BEANS'), 12, 'ANY', 'ACTION', 'Prepara la recoleccion y deja que las vainas maduren bien.', 1, 1, true, NULL),
    (11, (SELECT id FROM crops WHERE code = 'SQUASH'), 13, 'ANY', 'ACTION', 'Manten humedad ligera y evita apretar la tierra.', 1, 1, true, NULL),
    (12, (SELECT id FROM crops WHERE code = 'SQUASH'), 15, 'ANY', 'ACTION', 'Acomoda las guias y deja espacio para que crezcan sanas.', 1, 1, true, NULL),
    (13, (SELECT id FROM crops WHERE code = 'SQUASH'), 17, 'ANY', 'ACTION', 'Manten humedad constante para que el fruto engorde bien.', 1, 1, true, NULL),
    (14, (SELECT id FROM crops WHERE code = 'SQUASH'), 18, 'ANY', 'ACTION', 'Revisa la firmeza del fruto y alista la cosecha.', 1, 1, true, NULL),
    (15, (SELECT id FROM crops WHERE code = 'JITOMATE'), 19, 'ANY', 'ACTION', 'Espera humedad pareja antes de mover la tierra.', 1, 1, true, NULL),
    (16, (SELECT id FROM crops WHERE code = 'JITOMATE'), 19, 'ANY', 'OBSERVATION', 'Revisa si el brote sale parejo y si la tierra conserva humedad.', 2, 1, true, NULL),
    (17, (SELECT id FROM crops WHERE code = 'JITOMATE'), 21, 'ANY', 'ACTION', 'Si la planta se ve floja, puedes dar un abono organico ligero.', 1, 1, true, NULL),
    (18, (SELECT id FROM crops WHERE code = 'JITOMATE'), 21, 'ANY', 'OBSERVATION', 'Observa color de hojas nuevas y fuerza del tallo.', 2, 1, true, NULL),
    (19, NULL, NULL, 'RAIN_HIGH', 'WARNING', 'Evita fumigar hoy, porque la lluvia puede reducir el efecto.', 1, 1, true, NULL),
    (20, NULL, NULL, 'RAIN_HIGH', 'WARNING', 'La lluvia fuerte puede lavar aplicaciones y subir el riesgo de enfermedad.', 2, 1, true, NULL),
    (21, NULL, NULL, 'DRY', 'WARNING', 'El terreno se siente seco. Revisa la humedad antes de hacer trabajo extra.', 1, 1, true, NULL),
    (22, NULL, NULL, 'LOW_WATER', 'WARNING', 'No hay suficiente agua disponible, prioriza riego.', 1, 1, true, NULL),
    (23, (SELECT id FROM crops WHERE code = 'CORN'), 4, 'RAIN_HIGH', 'WARNING', 'Con lluvia alta, evita aplicar productos foliares sobre el maiz.', 1, 1, true, NULL),
    (24, (SELECT id FROM crops WHERE code = 'BEANS'), 10, 'RAIN_HIGH', 'WARNING', 'Con humedad y lluvia, vigila hongos en floracion de frijol.', 1, 1, true, NULL),
    (25, (SELECT id FROM crops WHERE code = 'SQUASH'), 17, 'RAIN_HIGH', 'WARNING', 'Con lluvia alta, revisa hongos y manchas en hojas de calabaza.', 1, 1, true, NULL)
ON CONFLICT (id) DO UPDATE SET
    crop_id = EXCLUDED.crop_id,
    stage_id = EXCLUDED.stage_id,
    condition = EXCLUDED.condition,
    type = EXCLUDED.type,
    message = EXCLUDED.message,
    priority = EXCLUDED.priority,
    version = EXCLUDED.version,
    active = EXCLUDED.active,
    region_id = EXCLUDED.region_id;

INSERT INTO lunar_activities (id, phase, activity) VALUES
    (1, 'NEW_MOON', 'Preparar la tierra'),
    (2, 'NEW_MOON', 'Sembrar cultivos de raiz'),
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
ON CONFLICT (id) DO UPDATE SET
    phase = EXCLUDED.phase,
    activity = EXCLUDED.activity;

INSERT INTO planting_calendar (id, month, lunar_phase, crop_code) VALUES
    (1, 3, 'WAXING_CRESCENT', 'CORN'),
    (2, 3, 'WAXING_CRESCENT', 'BEANS'),
    (3, 3, 'FIRST_QUARTER', 'CORN'),
    (4, 3, 'FIRST_QUARTER', 'SQUASH'),
    (5, 4, 'NEW_MOON', 'BEANS'),
    (6, 4, 'NEW_MOON', 'SQUASH'),
    (7, 4, 'FIRST_QUARTER', 'CORN'),
    (8, 4, 'FIRST_QUARTER', 'BEANS'),
    (9, 5, 'FULL_MOON', 'CORN'),
    (10, 5, 'FULL_MOON', 'SQUASH'),
    (11, 6, 'WAXING_GIBBOUS', 'CORN'),
    (12, 6, 'WAXING_GIBBOUS', 'BEANS'),
    (13, 7, 'NEW_MOON', 'BEANS'),
    (14, 7, 'NEW_MOON', 'SQUASH'),
    (15, 8, 'FIRST_QUARTER', 'CORN'),
    (16, 8, 'FIRST_QUARTER', 'BEANS'),
    (17, 9, 'WAXING_CRESCENT', 'CORN'),
    (18, 9, 'WAXING_CRESCENT', 'SQUASH'),
    (19, 10, 'WANING_CRESCENT', 'BEANS'),
    (20, 10, 'WANING_CRESCENT', 'SQUASH')
ON CONFLICT (id) DO UPDATE SET
    month = EXCLUDED.month,
    lunar_phase = EXCLUDED.lunar_phase,
    crop_code = EXCLUDED.crop_code;

SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
SELECT setval('regions_id_seq', (SELECT MAX(id) FROM regions));
SELECT setval('crops_id_seq', (SELECT MAX(id) FROM crops));
SELECT setval('crop_stages_id_seq', (SELECT MAX(id) FROM crop_stages));
SELECT setval('recommendations_id_seq', (SELECT MAX(id) FROM recommendations));
SELECT setval('lunar_activities_id_seq', (SELECT MAX(id) FROM lunar_activities));
SELECT setval('planting_calendar_id_seq', (SELECT MAX(id) FROM planting_calendar));
