package com.ifpr.backend.model;


import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import com.ifpr.backend.model.enums.PapelCarteira;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
@Entity
@Table(uniqueConstraints = {
    @UniqueConstraint(columnNames = {"carteira_id", "usuario_id"})
})
public class CarteiraMembro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "carteira_id", nullable = false)
    private Carteira carteira;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @NotNull(message = "Papel obrigatório")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PapelCarteira papel;
    
    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime entradoEm;
}
