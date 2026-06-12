package com.turismo.backend.config;

import com.turismo.backend.place.entity.Place;
import com.turismo.backend.place.entity.PlaceCategory;
import com.turismo.backend.place.repository.PlaceRepository;
import com.turismo.backend.town.entity.Town;
import com.turismo.backend.town.repository.TownRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final TownRepository townRepository;
    private final PlaceRepository placeRepository;

    @Override
    public void run(String... args) {
        Town playasDelCoco = createTownIfNotExists(
                "playas-del-coco",
                "Playas del Coco",
                "Destino turístico costero ubicado en el cantón de Carrillo, reconocido por sus playas, gastronomía, tours marítimos y atardeceres.",
                "Guanacaste",
                "Costa Rica"
        );

        Town tamarindo = createTownIfNotExists(
                "tamarindo",
                "Tamarindo",
                "Pueblo turístico de Guanacaste famoso por el surf, la vida nocturna, restaurantes, hoteles y atardeceres frente al Pacífico.",
                "Guanacaste",
                "Costa Rica"
        );

        Town samara = createTownIfNotExists(
                "samara",
                "Sámara",
                "Destino costero tranquilo de Guanacaste, ideal para familias, actividades acuáticas, naturaleza y turismo local.",
                "Guanacaste",
                "Costa Rica"
        );

        seedPlayasDelCoco(playasDelCoco);
        seedTamarindo(tamarindo);
        seedSamara(samara);
    }

    private Town createTownIfNotExists(
            String slug,
            String name,
            String description,
            String province,
            String country
    ) {
        return townRepository.findBySlug(slug)
                .orElseGet(() -> townRepository.save(
                        Town.builder()
                                .slug(slug)
                                .name(name)
                                .description(description)
                                .province(province)
                                .country(country)
                                .active(true)
                                .build()
                ));
    }

    private void seedPlayasDelCoco(Town town) {
        if (placeRepository.countByTown(town) > 0) {
            return;
        }

        createPlace(
                town,
                "Playa del Coco",
                "Playa principal de la zona, ideal para caminar, disfrutar del atardecer y realizar actividades acuáticas.",
                PlaceCategory.PLAYA,
                "Centro de Playas del Coco, Carrillo, Guanacaste",
                "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
                10.5500,
                -85.6970
        );

        createPlace(
                town,
                "Playa Ocotal",
                "Playa tranquila cercana a Playas del Coco, reconocida por sus aguas claras y ambiente relajado.",
                PlaceCategory.PLAYA,
                "Cerca de Playas del Coco, Carrillo, Guanacaste",
                "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80",
                10.5410,
                -85.7270
        );

        createPlace(
                town,
                "Mirador Playas del Coco",
                "Punto panorámico para observar la bahía, el pueblo y los atardeceres del Pacífico.",
                PlaceCategory.MIRADOR,
                "Zona alta de Playas del Coco, Guanacaste",
                "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
                10.5530,
                -85.6900
        );

        createPlace(
                town,
                "Boulevard Gastronómico",
                "Área con restaurantes, cafeterías y comercios locales para disfrutar comida costarricense e internacional.",
                PlaceCategory.RESTAURANTE,
                "Boulevard principal de Playas del Coco",
                "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
                10.5495,
                -85.6978
        );

        createPlace(
                town,
                "Tours en bote",
                "Experiencias de navegación, pesca, snorkel y recorridos por playas cercanas.",
                PlaceCategory.ACTIVIDAD,
                "Muelle principal de Playas del Coco",
                "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
                10.5480,
                -85.7000
        );
    }

    private void seedTamarindo(Town town) {
        if (placeRepository.countByTown(town) > 0) {
            return;
        }

        createPlace(
                town,
                "Playa Tamarindo",
                "Playa reconocida internacionalmente por el surf, sus atardeceres y ambiente turístico.",
                PlaceCategory.PLAYA,
                "Centro de Tamarindo, Santa Cruz, Guanacaste",
                "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
                10.2993,
                -85.8371
        );

        createPlace(
                town,
                "Estero de Tamarindo",
                "Zona natural perfecta para recorridos en kayak, observación de aves y contacto con manglares.",
                PlaceCategory.ACTIVIDAD,
                "Estero de Tamarindo, Guanacaste",
                "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
                10.3050,
                -85.8380
        );

        createPlace(
                town,
                "Mercado Gastronómico Tamarindo",
                "Espacio con comida local e internacional, música y ambiente familiar.",
                PlaceCategory.RESTAURANTE,
                "Tamarindo centro, Guanacaste",
                "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
                10.3001,
                -85.8390
        );

        createPlace(
                town,
                "Mirador Tamarindo",
                "Punto recomendado para observar el océano Pacífico y el atardecer.",
                PlaceCategory.MIRADOR,
                "Zona alta de Tamarindo, Guanacaste",
                "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
                10.3020,
                -85.8310
        );

        createPlace(
                town,
                "Hotel Boutique Tamarindo",
                "Opción de hospedaje cercana a la playa y al centro turístico.",
                PlaceCategory.HOTEL,
                "Tamarindo, Guanacaste",
                "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
                10.2980,
                -85.8360
        );
    }

    private void seedSamara(Town town) {
        if (placeRepository.countByTown(town) > 0) {
            return;
        }

        createPlace(
                town,
                "Playa Sámara",
                "Playa tranquila de arena clara, ideal para nadar, caminar y disfrutar en familia.",
                PlaceCategory.PLAYA,
                "Centro de Sámara, Nicoya, Guanacaste",
                "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
                9.8816,
                -85.5280
        );

        createPlace(
                town,
                "Isla Chora",
                "Isla cercana a Playa Sámara, popular para kayak, snorkel y paseos turísticos.",
                PlaceCategory.ACTIVIDAD,
                "Frente a Playa Sámara, Guanacaste",
                "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80",
                9.8725,
                -85.5150
        );

        createPlace(
                town,
                "Centro Gastronómico Sámara",
                "Zona con restaurantes locales, cafeterías y comida típica costarricense.",
                PlaceCategory.RESTAURANTE,
                "Centro de Sámara, Guanacaste",
                "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
                9.8820,
                -85.5270
        );

        createPlace(
                town,
                "Mirador de Sámara",
                "Punto panorámico para observar la costa y el entorno natural de la zona.",
                PlaceCategory.MIRADOR,
                "Zona alta de Sámara, Guanacaste",
                "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
                9.8870,
                -85.5220
        );

        createPlace(
                town,
                "Hotel Familiar Sámara",
                "Hospedaje cercano a la playa, pensado para familias y turistas que buscan tranquilidad.",
                PlaceCategory.HOTEL,
                "Sámara, Guanacaste",
                "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
                9.8805,
                -85.5290
        );
    }

    private void createPlace(
            Town town,
            String name,
            String description,
            PlaceCategory category,
            String address,
            String imageUrl,
            Double latitude,
            Double longitude
    ) {
        placeRepository.save(
                Place.builder()
                        .town(town)
                        .name(name)
                        .description(description)
                        .category(category)
                        .address(address)
                        .imageUrl(imageUrl)
                        .latitude(latitude)
                        .longitude(longitude)
                        .active(true)
                        .build()
        );
    }
}