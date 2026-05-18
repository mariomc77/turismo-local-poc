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
        if (townRepository.existsBySlug("playas-del-coco")) {
            return;
        }

        Town town = Town.builder()
                .slug("playas-del-coco")
                .name("Playas del Coco")
                .description("Destino turístico costero ubicado en el cantón de Carrillo, reconocido por sus playas, gastronomía, tours marítimos y atardeceres.")
                .province("Guanacaste")
                .country("Costa Rica")
                .active(true)
                .build();

        Town savedTown = townRepository.save(town);

        placeRepository.save(Place.builder()
                .town(savedTown)
                .name("Playa del Coco")
                .description("Playa principal de la zona, ideal para caminar, disfrutar del atardecer y realizar actividades acuáticas.")
                .category(PlaceCategory.PLAYA)
                .address("Centro de Playas del Coco, Carrillo, Guanacaste")
                .imageUrl("https://images.unsplash.com/photo-1507525428034-b723cf961d3e")
                .latitude(10.5500)
                .longitude(-85.6970)
                .active(true)
                .build());

        placeRepository.save(Place.builder()
                .town(savedTown)
                .name("Playa Ocotal")
                .description("Playa tranquila cercana a Playas del Coco, reconocida por sus aguas claras y ambiente relajado.")
                .category(PlaceCategory.PLAYA)
                .address("Cerca de Playas del Coco, Carrillo, Guanacaste")
                .imageUrl("https://images.unsplash.com/photo-1500375592092-40eb2168fd21")
                .latitude(10.5410)
                .longitude(-85.7270)
                .active(true)
                .build());

        placeRepository.save(Place.builder()
                .town(savedTown)
                .name("Mirador Playas del Coco")
                .description("Punto panorámico para observar la bahía, el pueblo y los atardeceres del Pacífico.")
                .category(PlaceCategory.MIRADOR)
                .address("Zona alta de Playas del Coco, Guanacaste")
                .imageUrl("https://images.unsplash.com/photo-1500530855697-b586d89ba3ee")
                .latitude(10.5530)
                .longitude(-85.6900)
                .active(true)
                .build());

        placeRepository.save(Place.builder()
                .town(savedTown)
                .name("Boulevard Gastronómico")
                .description("Área con restaurantes, cafeterías y comercios locales para disfrutar comida costarricense e internacional.")
                .category(PlaceCategory.GASTRONOMIA)
                .address("Boulevard principal de Playas del Coco")
                .imageUrl("https://images.unsplash.com/photo-1517248135467-4c7edcad34c4")
                .latitude(10.5495)
                .longitude(-85.6978)
                .active(true)
                .build());

        placeRepository.save(Place.builder()
                .town(savedTown)
                .name("Tours en bote")
                .description("Experiencias de navegación, pesca, snorkel y recorridos por playas cercanas.")
                .category(PlaceCategory.PASEOS)
                .address("Muelle principal de Playas del Coco")
                .imageUrl("https://images.unsplash.com/photo-1500375592092-40eb2168fd21")
                .latitude(10.5480)
                .longitude(-85.7000)
                .active(true)
                .build());
    }
}