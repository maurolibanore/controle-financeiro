package com.ifpr.backend.dto;

import com.ifpr.backend.model.enums.PapelCarteira;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AlterarPapelDTO {

    @NotNull(message = "Papel é obrigatório")
    private PapelCarteira papel;
}