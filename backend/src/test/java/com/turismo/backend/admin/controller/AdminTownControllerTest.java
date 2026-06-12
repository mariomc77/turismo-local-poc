package com.turismo.backend.admin.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.turismo.backend.admin.service.AdminTownService;
import com.turismo.backend.town.dto.TownCreateRequest;
import com.turismo.backend.town.dto.TownResponse;
import com.turismo.backend.town.dto.TownUpdateRequest;
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
class AdminTownControllerTest {

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    @Mock
    private AdminTownService adminTownService;

    @BeforeEach
    void setUp() {
        AdminTownController controller = new AdminTownController(adminTownService);
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
        objectMapper = new ObjectMapper();
    }

    @Test
    void getAllTownsReturnsOk() throws Exception {
        TownResponse response = TownResponse.builder()
                .id(1L)
                .slug("playas-del-coco")
                .name("Playas del Coco")
                .active(true)
                .build();

        when(adminTownService.getAllTowns()).thenReturn(List.of(response));

        mockMvc.perform(get("/api/admin/towns"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].slug").value("playas-del-coco"))
                .andExpect(jsonPath("$[0].name").value("Playas del Coco"));
    }

    @Test
    void getTownByIdReturnsOk() throws Exception {
        TownResponse response = TownResponse.builder()
                .id(1L)
                .slug("samara")
                .name("Sámara")
                .active(true)
                .build();

        when(adminTownService.getTownById(1L)).thenReturn(response);

        mockMvc.perform(get("/api/admin/towns/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.slug").value("samara"));
    }

    @Test
    void createTownReturnsCreated() throws Exception {
        TownCreateRequest request = new TownCreateRequest();
        request.setName("Tamarindo");
        request.setSlug("tamarindo");

        TownResponse response = TownResponse.builder()
                .id(1L)
                .slug("tamarindo")
                .name("Tamarindo")
                .active(true)
                .build();

        when(adminTownService.createTown(any(TownCreateRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/admin/towns")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.slug").value("tamarindo"));
    }

    @Test
    void updateTownReturnsOk() throws Exception {
        TownUpdateRequest request = new TownUpdateRequest();
        request.setName("Nuevo Tamarindo");
        request.setSlug("nuevo-tamarindo");

        TownResponse response = TownResponse.builder()
                .id(1L)
                .slug("nuevo-tamarindo")
                .name("Nuevo Tamarindo")
                .active(true)
                .build();

        when(adminTownService.updateTown(eq(1L), any(TownUpdateRequest.class))).thenReturn(response);

        mockMvc.perform(put("/api/admin/towns/1")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Nuevo Tamarindo"));
    }

    @Test
    void toggleActiveReturnsOk() throws Exception {
        TownResponse response = TownResponse.builder()
                .id(1L)
                .slug("samara")
                .name("Sámara")
                .active(false)
                .build();

        when(adminTownService.toggleActive(1L)).thenReturn(response);

        mockMvc.perform(patch("/api/admin/towns/1/toggle-active"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.active").value(false));
    }

    @Test
    void deleteTownReturnsNoContent() throws Exception {
        mockMvc.perform(delete("/api/admin/towns/1"))
                .andExpect(status().isNoContent());

        verify(adminTownService).deleteTown(1L);
    }
}