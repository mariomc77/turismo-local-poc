package com.turismo.backend.admin.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.turismo.backend.admin.service.AdminPlaceService;
import com.turismo.backend.place.dto.PlaceCreateRequest;
import com.turismo.backend.place.dto.PlaceResponse;
import com.turismo.backend.place.dto.PlaceUpdateRequest;
import com.turismo.backend.place.entity.PlaceCategory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class AdminPlaceControllerTest {

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    @Mock
    private AdminPlaceService adminPlaceService;

    @BeforeEach
    void setUp() {
        AdminPlaceController controller = new AdminPlaceController(adminPlaceService);
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
        objectMapper = new ObjectMapper();
    }

    @Test
    void getAllPlacesReturnsOk() throws Exception {
        PlaceResponse response = PlaceResponse.builder()
                .id(1L)
                .townId(1L)
                .townSlug("playas-del-coco")
                .townName("Playas del Coco")
                .name("Playa principal")
                .category(PlaceCategory.PLAYA)
                .active(true)
                .build();

        when(adminPlaceService.getAllPlaces()).thenReturn(List.of(response));

        mockMvc.perform(get("/api/admin/places"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Playa principal"))
                .andExpect(jsonPath("$[0].category").value("PLAYA"));
    }

    @Test
    void getPlaceByIdReturnsOk() throws Exception {
        PlaceResponse response = PlaceResponse.builder()
                .id(1L)
                .townId(1L)
                .townSlug("playas-del-coco")
                .townName("Playas del Coco")
                .name("Playa principal")
                .category(PlaceCategory.PLAYA)
                .active(true)
                .build();

        when(adminPlaceService.getPlaceById(1L)).thenReturn(response);

        mockMvc.perform(get("/api/admin/places/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Playa principal"));
    }

    @Test
    void createPlaceReturnsCreated() throws Exception {
        PlaceCreateRequest request = new PlaceCreateRequest();
        request.setTownId(1L);
        request.setName("Mirador");
        request.setCategory(PlaceCategory.MIRADOR);

        PlaceResponse response = PlaceResponse.builder()
                .id(1L)
                .townId(1L)
                .townSlug("playas-del-coco")
                .townName("Playas del Coco")
                .name("Mirador")
                .category(PlaceCategory.MIRADOR)
                .active(true)
                .build();

        when(adminPlaceService.createPlace(any(PlaceCreateRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/admin/places")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Mirador"))
                .andExpect(jsonPath("$.category").value("MIRADOR"));
    }

    @Test
    void updatePlaceReturnsOk() throws Exception {
        PlaceUpdateRequest request = new PlaceUpdateRequest();
        request.setTownId(1L);
        request.setName("Restaurante Nuevo");
        request.setCategory(PlaceCategory.RESTAURANTE);

        PlaceResponse response = PlaceResponse.builder()
                .id(1L)
                .townId(1L)
                .townSlug("playas-del-coco")
                .townName("Playas del Coco")
                .name("Restaurante Nuevo")
                .category(PlaceCategory.RESTAURANTE)
                .active(true)
                .build();

        when(adminPlaceService.updatePlace(eq(1L), any(PlaceUpdateRequest.class))).thenReturn(response);

        mockMvc.perform(put("/api/admin/places/1")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Restaurante Nuevo"))
                .andExpect(jsonPath("$.category").value("RESTAURANTE"));
    }

    @Test
    void toggleActiveReturnsOk() throws Exception {
        PlaceResponse response = PlaceResponse.builder()
                .id(1L)
                .townId(1L)
                .townSlug("playas-del-coco")
                .townName("Playas del Coco")
                .name("Playa principal")
                .category(PlaceCategory.PLAYA)
                .active(false)
                .build();

        when(adminPlaceService.toggleActive(1L)).thenReturn(response);

        mockMvc.perform(patch("/api/admin/places/1/toggle-active"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.active").value(false));
    }

    @Test
    void deletePlaceReturnsNoContent() throws Exception {
        mockMvc.perform(delete("/api/admin/places/1"))
                .andExpect(status().isNoContent());

        verify(adminPlaceService).deletePlace(1L);
    }
}