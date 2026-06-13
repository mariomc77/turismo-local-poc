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

    private static final String COSTA_RICA = "Costa Rica";
    private static final String GUANACASTE = "Guanacaste";
    private static final String PUNTARENAS = "Puntarenas";

    private static final String PLAYAS_DEL_COCO_SLUG = "playas-del-coco";
    private static final String TAMARINDO_SLUG = "tamarindo";
    private static final String SAMARA_SLUG = "samara";

    private static final String BEACH_IMAGE_URL = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e";
    private static final String OCEAN_IMAGE_URL = "https://images.unsplash.com/photo-1500375592092-40eb2168fd21";
    private static final String NATURE_IMAGE_URL = "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee";
    private static final String FOOD_IMAGE_URL = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4";

    private final TownRepository townRepository;
    private final PlaceRepository placeRepository;

    @Override
    public void run(String... args) {
        seedPlayasDelCoco();
        seedTamarindo();
        seedSamara();
    }

    private void seedPlayasDelCoco() {
        if (townRepository.existsBySlug(PLAYAS_DEL_COCO_SLUG)) {
            return;
        }

        Town town = Town.builder()
                .slug(PLAYAS_DEL_COCO_SLUG)
                .name("Playas del Coco")
                .description("Destino turístico costero ubicado en el cantón de Carrillo, reconocido por sus playas, gastronomía, tours marítimos y atardeceres.")
                .province(GUANACASTE)
                .country(COSTA_RICA)
                .active(true)
                .build();

        Town savedTown = townRepository.save(town);

        savePlace(
                savedTown,
                "Playa del Coco",
                "Playa principal de la zona, ideal para caminar, disfrutar del atardecer y realizar actividades acuáticas.",
                PlaceCategory.PLAYA,
                "Centro de Playas del Coco, Carrillo, Guanacaste",
                BEACH_IMAGE_URL,
                10.5500,
                -85.6970
        );

        savePlace(
                savedTown,
                "Playa Ocotal",
                "Playa tranquila cercana a Playas del Coco, reconocida por sus aguas claras y ambiente relajado.",
                PlaceCategory.PLAYA,
                "Cerca de Playas del Coco, Carrillo, Guanacaste",
                OCEAN_IMAGE_URL,
                10.5410,
                -85.7270
        );

        savePlace(
                savedTown,
                "Mirador Playas del Coco",
                "Punto panorámico para observar la bahía, el pueblo y los atardeceres del Pacífico.",
                PlaceCategory.MIRADOR,
                "Zona alta de Playas del Coco, Guanacaste",
                NATURE_IMAGE_URL,
                10.5530,
                -85.6900
        );

        savePlace(
                savedTown,
                "Boulevard Gastronómico",
                "Área con restaurantes, cafeterías y comercios locales para disfrutar comida costarricense e internacional.",
                PlaceCategory.GASTRONOMIA,
                "Boulevard principal de Playas del Coco",
                FOOD_IMAGE_URL,
                10.5495,
                -85.6978
        );

        savePlace(
                savedTown,
                "Tours en bote",
                "Experiencias de navegación, pesca, snorkel y recorridos por playas cercanas.",
                PlaceCategory.PASEOS,
                "Muelle principal de Playas del Coco",
                OCEAN_IMAGE_URL,
                10.5480,
                -85.7000
        );
    }

    private void seedTamarindo() {
        if (townRepository.existsBySlug(TAMARINDO_SLUG)) {
            return;
        }

        Town town = Town.builder()
                .slug(TAMARINDO_SLUG)
                .name("Tamarindo")
                .description("Pueblo costero de Guanacaste reconocido por el surf, la vida nocturna, la gastronomía y sus atardeceres.")
                .province(GUANACASTE)
                .country(COSTA_RICA)
                .active(true)
                .build();

        Town savedTown = townRepository.save(town);

        savePlace(
                savedTown,
                "Playa Tamarindo",
                "Playa amplia y popular para surf, caminatas y atardeceres frente al Pacífico.",
                PlaceCategory.PLAYA,
                "Centro de Tamarindo, Santa Cruz, Guanacaste",
                BEACH_IMAGE_URL,
                10.2993,
                -85.8371
        );

        savePlace(
                savedTown,
                "Estero de Tamarindo",
                "Zona natural ideal para observar manglares, aves y realizar paseos en bote.",
                PlaceCategory.PASEOS,
                "Entrada norte de Tamarindo",
                NATURE_IMAGE_URL,
                10.3090,
                -85.8378
        );

        savePlace(
                savedTown,
                "Zona Gastronómica de Tamarindo",
                "Sector con restaurantes, cafeterías y opciones de comida internacional y local.",
                PlaceCategory.GASTRONOMIA,
                "Centro de Tamarindo",
                FOOD_IMAGE_URL,
                10.3000,
                -85.8380
        );
    }

    private void seedSamara() {
        if (townRepository.existsBySlug(SAMARA_SLUG)) {
            return;
        }

        Town town = Town.builder()
                .slug(SAMARA_SLUG)
                .name("Sámara")
                .description("Destino familiar de playa ubicado en Nicoya, conocido por su ambiente tranquilo, bahía protegida y actividades acuáticas.")
                .province(GUANACASTE)
                .country(COSTA_RICA)
                .active(true)
                .build();

        Town savedTown = townRepository.save(town);

        savePlace(
                savedTown,
                "Playa Sámara",
                "Bahía tranquila ideal para nadar, caminar, practicar kayak y disfrutar en familia.",
                PlaceCategory.PLAYA,
                "Centro de Sámara, Nicoya, Guanacaste",
                BEACH_IMAGE_URL,
                9.8816,
                -85.5286
        );

        savePlace(
                savedTown,
                "Isla Chora",
                "Pequeña isla frente a Sámara, popular para kayak, snorkel y fotografía.",
                PlaceCategory.PASEOS,
                "Frente a Playa Sámara",
                OCEAN_IMAGE_URL,
                9.8705,
                -85.5220
        );

        savePlace(
                savedTown,
                "Mirador de Sámara",
                "Punto panorámico para observar la bahía y los paisajes costeros de la zona.",
                PlaceCategory.MIRADOR,
                "Zona alta de Sámara",
                NATURE_IMAGE_URL,
                9.8890,
                -85.5340
        );
    }

    private void savePlace(
            Town town,
            String name,
            String description,
            PlaceCategory category,
            String address,
            String imageUrl,
            Double latitude,
            Double longitude
    ) {
        placeRepository.save(Place.builder()
                .town(town)
                .name(name)
                .description(description)
                .category(category)
                .address(address)
                .imageUrl(imageUrl)
                .latitude(latitude)
                .longitude(longitude)
                .active(true)
                .build());
    }
}