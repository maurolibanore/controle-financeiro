package com.ifpr.backend.model;

import java.time.LocalDateTime;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
@Entity
public class Carteira {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Dono é obrigatório")
    @ManyToOne
    @JoinColumn(name = "dono_id", nullable = false)
    private Usuario dono;

    @NotBlank(message = "Nome é obrigatório")
    @Size(max = 100, message = "Maximo de 100 caracteres")
    private String nome;

    private String descricao;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime criadoEm;
    
    @OneToMany(mappedBy = "carteira")
    private List<CarteiraMembro> membros;
}
