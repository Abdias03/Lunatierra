DELETE FROM recommendations;
DELETE FROM crop_stages;
DELETE FROM user_crops;
DELETE FROM planting_calendar;
DELETE FROM crops;

INSERT INTO crops (code, name, type, description) VALUES
    ('CORN', 'Maiz', 'ANNUAL', 'Cultivo anual de maiz para seguimiento diario.'),
    ('BEANS', 'Frijol', 'ANNUAL', 'Cultivo de frijol con etapas cortas y manejo simple.'),
    ('SQUASH', 'Calabaza', 'ANNUAL', 'Cultivo rastrero con crecimiento visible y fruto amplio.'),
    ('TOMATO', 'Jitomate', 'ANNUAL', 'Cultivo de jitomate para riego constante y observacion frecuente.');

INSERT INTO crop_stages (crop_id, name, min_day, max_day, description) VALUES
    ((SELECT id FROM crops WHERE code = 'CORN'), 'Germinacion', 0, 7, 'La semilla brota si la tierra mantiene humedad pareja.'),
    ((SELECT id FROM crops WHERE code = 'CORN'), 'Crecimiento inicial', 8, 30, 'La planta abre hojas nuevas y toma fuerza.'),
    ((SELECT id FROM crops WHERE code = 'CORN'), 'Floracion', 31, 60, 'Empiezan espiga y jilote. Conviene revisar humedad.'),
    ((SELECT id FROM crops WHERE code = 'CORN'), 'Cosecha', 61, 120, 'El grano madura y la planta se acerca a la cosecha.'),

    ((SELECT id FROM crops WHERE code = 'BEANS'), 'Germinacion', 0, 6, 'El frijol sale rapido si la humedad es suficiente.'),
    ((SELECT id FROM crops WHERE code = 'BEANS'), 'Crecimiento', 7, 25, 'La planta desarrolla hojas y tallos sanos.'),
    ((SELECT id FROM crops WHERE code = 'BEANS'), 'Floracion', 26, 45, 'Empiezan las flores y hay que evitar estres.'),
    ((SELECT id FROM crops WHERE code = 'BEANS'), 'Cosecha', 46, 90, 'Las vainas se forman y empiezan a madurar.'),

    ((SELECT id FROM crops WHERE code = 'SQUASH'), 'Germinacion', 0, 6, 'La calabaza brota rapido con calor y humedad ligera.'),
    ((SELECT id FROM crops WHERE code = 'SQUASH'), 'Crecimiento', 7, 30, 'Las hojas y guias empiezan a expandirse.'),
    ((SELECT id FROM crops WHERE code = 'SQUASH'), 'Floracion', 31, 50, 'Aparecen flores y la polinizacion es importante.'),
    ((SELECT id FROM crops WHERE code = 'SQUASH'), 'Cosecha', 51, 90, 'El fruto gana tamaño y firmeza hasta cosecha.'),

    ((SELECT id FROM crops WHERE code = 'TOMATO'), 'Germinacion', 0, 7, 'El brote aparece si la humedad y el calor son estables.'),
    ((SELECT id FROM crops WHERE code = 'TOMATO'), 'Crecimiento', 8, 35, 'El jitomate entra en desarrollo vegetativo.'),
    ((SELECT id FROM crops WHERE code = 'TOMATO'), 'Floracion', 36, 60, 'Las flores abren y empieza la cuaja.'),
    ((SELECT id FROM crops WHERE code = 'TOMATO'), 'Cosecha', 61, 120, 'Los frutos toman color y se acercan al corte.');

INSERT INTO recommendations (crop_id, stage_id, condition, type, message, priority, version, active, region_id) VALUES
    ((SELECT id FROM crops WHERE code = 'CORN'), (SELECT id FROM crop_stages WHERE crop_id = (SELECT id FROM crops WHERE code = 'CORN') AND name = 'Germinacion' LIMIT 1), 'NORMAL', 'ACTION', 'Manten la tierra humeda sin encharcar.', 1, 1, true, NULL),
    ((SELECT id FROM crops WHERE code = 'CORN'), (SELECT id FROM crop_stages WHERE crop_id = (SELECT id FROM crops WHERE code = 'CORN') AND name = 'Germinacion' LIMIT 1), 'NORMAL', 'OBSERVATION', 'Revisa si el brote sale parejo.', 2, 1, true, NULL),
    ((SELECT id FROM crops WHERE code = 'CORN'), (SELECT id FROM crop_stages WHERE crop_id = (SELECT id FROM crops WHERE code = 'CORN') AND name = 'Germinacion' LIMIT 1), 'RAIN_HIGH', 'WARNING', 'Evita fertilizar hoy porque la lluvia puede lavar el producto.', 1, 1, true, NULL),
    ((SELECT id FROM crops WHERE code = 'CORN'), (SELECT id FROM crop_stages WHERE crop_id = (SELECT id FROM crops WHERE code = 'CORN') AND name = 'Crecimiento inicial' LIMIT 1), 'NORMAL', 'ACTION', 'Controla la maleza cercana y deja espacio para crecer.', 1, 1, true, NULL),
    ((SELECT id FROM crops WHERE code = 'CORN'), (SELECT id FROM crop_stages WHERE crop_id = (SELECT id FROM crops WHERE code = 'CORN') AND name = 'Crecimiento inicial' LIMIT 1), 'NORMAL', 'OBSERVATION', 'Mira el color de las hojas nuevas y la fuerza del tallo.', 2, 1, true, NULL),
    ((SELECT id FROM crops WHERE code = 'CORN'), (SELECT id FROM crop_stages WHERE crop_id = (SELECT id FROM crops WHERE code = 'CORN') AND name = 'Crecimiento inicial' LIMIT 1), 'HEAT_HIGH', 'WARNING', 'Riega temprano para evitar estres por calor.', 1, 1, true, NULL),
    ((SELECT id FROM crops WHERE code = 'CORN'), (SELECT id FROM crop_stages WHERE crop_id = (SELECT id FROM crops WHERE code = 'CORN') AND name = 'Floracion' LIMIT 1), 'NORMAL', 'ACTION', 'Cuida humedad pareja y evita trabajos bruscos.', 1, 1, true, NULL),
    ((SELECT id FROM crops WHERE code = 'CORN'), (SELECT id FROM crop_stages WHERE crop_id = (SELECT id FROM crops WHERE code = 'CORN') AND name = 'Floracion' LIMIT 1), 'NORMAL', 'OBSERVATION', 'Observa espiga, jilote y hojas superiores.', 2, 1, true, NULL),
    ((SELECT id FROM crops WHERE code = 'CORN'), (SELECT id FROM crop_stages WHERE crop_id = (SELECT id FROM crops WHERE code = 'CORN') AND name = 'Cosecha' LIMIT 1), 'NORMAL', 'ACTION', 'Reduce riego para ayudar a la maduracion final.', 1, 1, true, NULL),

    ((SELECT id FROM crops WHERE code = 'BEANS'), (SELECT id FROM crop_stages WHERE crop_id = (SELECT id FROM crops WHERE code = 'BEANS') AND name = 'Germinacion' LIMIT 1), 'NORMAL', 'ACTION', 'Manten humedad ligera y tierra suelta.', 1, 1, true, NULL),
    ((SELECT id FROM crops WHERE code = 'BEANS'), (SELECT id FROM crop_stages WHERE crop_id = (SELECT id FROM crops WHERE code = 'BEANS') AND name = 'Germinacion' LIMIT 1), 'NORMAL', 'OBSERVATION', 'Revisa si la salida es pareja en toda la linea.', 2, 1, true, NULL),
    ((SELECT id FROM crops WHERE code = 'BEANS'), (SELECT id FROM crop_stages WHERE crop_id = (SELECT id FROM crops WHERE code = 'BEANS') AND name = 'Crecimiento' LIMIT 1), 'NORMAL', 'ACTION', 'Revisa plagas en hojas y tallos tiernos.', 1, 1, true, NULL),
    ((SELECT id FROM crops WHERE code = 'BEANS'), (SELECT id FROM crop_stages WHERE crop_id = (SELECT id FROM crops WHERE code = 'BEANS') AND name = 'Crecimiento' LIMIT 1), 'NORMAL', 'OBSERVATION', 'Busca hojas mordidas o manchas tempranas.', 2, 1, true, NULL),
    ((SELECT id FROM crops WHERE code = 'BEANS'), (SELECT id FROM crop_stages WHERE crop_id = (SELECT id FROM crops WHERE code = 'BEANS') AND name = 'Crecimiento' LIMIT 1), 'LOW_WATER', 'WARNING', 'Sin agua suficiente, el crecimiento puede frenarse.', 1, 1, true, NULL),
    ((SELECT id FROM crops WHERE code = 'BEANS'), (SELECT id FROM crop_stages WHERE crop_id = (SELECT id FROM crops WHERE code = 'BEANS') AND name = 'Floracion' LIMIT 1), 'NORMAL', 'ACTION', 'Manten riego moderado y evita mover mucho la planta.', 1, 1, true, NULL),
    ((SELECT id FROM crops WHERE code = 'BEANS'), (SELECT id FROM crop_stages WHERE crop_id = (SELECT id FROM crops WHERE code = 'BEANS') AND name = 'Floracion' LIMIT 1), 'NORMAL', 'OBSERVATION', 'Mira si la flor abre bien y si hay insectos.', 2, 1, true, NULL),
    ((SELECT id FROM crops WHERE code = 'BEANS'), (SELECT id FROM crop_stages WHERE crop_id = (SELECT id FROM crops WHERE code = 'BEANS') AND name = 'Cosecha' LIMIT 1), 'NORMAL', 'ACTION', 'Reduce riego para ayudar al secado de vainas.', 1, 1, true, NULL),

    ((SELECT id FROM crops WHERE code = 'SQUASH'), (SELECT id FROM crop_stages WHERE crop_id = (SELECT id FROM crops WHERE code = 'SQUASH') AND name = 'Germinacion' LIMIT 1), 'NORMAL', 'ACTION', 'Asegura humedad constante y evita apretar la tierra.', 1, 1, true, NULL),
    ((SELECT id FROM crops WHERE code = 'SQUASH'), (SELECT id FROM crop_stages WHERE crop_id = (SELECT id FROM crops WHERE code = 'SQUASH') AND name = 'Germinacion' LIMIT 1), 'NORMAL', 'OBSERVATION', 'Observa si el brote sale limpio y firme.', 2, 1, true, NULL),
    ((SELECT id FROM crops WHERE code = 'SQUASH'), (SELECT id FROM crop_stages WHERE crop_id = (SELECT id FROM crops WHERE code = 'SQUASH') AND name = 'Crecimiento' LIMIT 1), 'NORMAL', 'ACTION', 'Deja espacio para que las guias se expandan.', 1, 1, true, NULL),
    ((SELECT id FROM crops WHERE code = 'SQUASH'), (SELECT id FROM crop_stages WHERE crop_id = (SELECT id FROM crops WHERE code = 'SQUASH') AND name = 'Crecimiento' LIMIT 1), 'RAIN_HIGH', 'WARNING', 'Evita humedad prolongada en hojas para prevenir hongos.', 1, 1, true, NULL),
    ((SELECT id FROM crops WHERE code = 'SQUASH'), (SELECT id FROM crop_stages WHERE crop_id = (SELECT id FROM crops WHERE code = 'SQUASH') AND name = 'Floracion' LIMIT 1), 'NORMAL', 'ACTION', 'Revisa flores y mantente atento a la polinizacion.', 1, 1, true, NULL),
    ((SELECT id FROM crops WHERE code = 'SQUASH'), (SELECT id FROM crop_stages WHERE crop_id = (SELECT id FROM crops WHERE code = 'SQUASH') AND name = 'Cosecha' LIMIT 1), 'NORMAL', 'ACTION', 'Cosecha cuando el fruto ya se sienta firme.', 1, 1, true, NULL),

    ((SELECT id FROM crops WHERE code = 'TOMATO'), (SELECT id FROM crop_stages WHERE crop_id = (SELECT id FROM crops WHERE code = 'TOMATO') AND name = 'Germinacion' LIMIT 1), 'NORMAL', 'ACTION', 'Manten suelo humedo y evita corrientes fuertes.', 1, 1, true, NULL),
    ((SELECT id FROM crops WHERE code = 'TOMATO'), (SELECT id FROM crop_stages WHERE crop_id = (SELECT id FROM crops WHERE code = 'TOMATO') AND name = 'Crecimiento' LIMIT 1), 'NORMAL', 'ACTION', 'Coloca soporte o tutor si el tallo se alarga.', 1, 1, true, NULL),
    ((SELECT id FROM crops WHERE code = 'TOMATO'), (SELECT id FROM crop_stages WHERE crop_id = (SELECT id FROM crops WHERE code = 'TOMATO') AND name = 'Crecimiento' LIMIT 1), 'RAIN_HIGH', 'WARNING', 'Evita mojar hojas por mucho tiempo para no favorecer hongos.', 1, 1, true, NULL),
    ((SELECT id FROM crops WHERE code = 'TOMATO'), (SELECT id FROM crop_stages WHERE crop_id = (SELECT id FROM crops WHERE code = 'TOMATO') AND name = 'Floracion' LIMIT 1), 'NORMAL', 'ACTION', 'Manten riego constante y revisa floracion pareja.', 1, 1, true, NULL),
    ((SELECT id FROM crops WHERE code = 'TOMATO'), (SELECT id FROM crop_stages WHERE crop_id = (SELECT id FROM crops WHERE code = 'TOMATO') AND name = 'Cosecha' LIMIT 1), 'NORMAL', 'ACTION', 'Cosecha frutos maduros de forma regular.', 1, 1, true, NULL),

    (NULL, NULL, 'RAIN_HIGH', 'WARNING', 'Hoy hay alta probabilidad de lluvia. Evita aplicar productos foliares.', 1, 1, true, NULL),
    (NULL, NULL, 'HEAT_HIGH', 'WARNING', 'Hace mucho calor. Revisa humedad y prioriza riego temprano.', 1, 1, true, NULL),
    (NULL, NULL, 'LOW_WATER', 'WARNING', 'No hay suficiente agua disponible, prioriza riego.', 1, 1, true, NULL),
    (NULL, NULL, 'DRY', 'WARNING', 'La tierra puede secarse rapido hoy. Revisa humedad antes de intervenir.', 1, 1, true, NULL),
    (NULL, NULL, 'NORMAL', 'OBSERVATION', 'Haz una revision tranquila del cultivo y observa hojas y suelo.', 99, 1, true, NULL);
