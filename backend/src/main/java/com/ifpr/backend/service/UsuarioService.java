package com.ifpr.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;

import com.ifpr.backend.exception.NaoEncontradoExcecao;
import com.ifpr.backend.model.Usuario;
import com.ifpr.backend.repository.UsuarioRepository;

@Service
public class UsuarioService implements UserDetailsService {

    @Autowired
    private UsuarioRepository repository;

    @Autowired
    private EnvioEmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Usuario inserir(Usuario usuario) {
        usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));
        Usuario usuarioBanco = repository.save(usuario);
        //emailService.enviarEmail(usuario.getEmail(),"Sucesso", "Cadastro realizado com sucesso!");
        Context context = new Context();
        context.setVariable("nome", usuario.getNome());
        //context.setVariable("email", usuario.getEmail());
        
        emailService.enviaEmailTemplate(usuario.getEmail(), "Sucesso", "novoCadastro", context);
        return usuarioBanco;
    }

    public Usuario atualizar(Usuario usuario) {
        
        Usuario usuarioEncontrado = buscarPorId(usuario.getId());
        usuarioEncontrado.setNome(usuario.getNome());
        usuarioEncontrado.setEmail(usuario.getEmail());
        

        return repository.save(usuarioEncontrado);
    }

    public void deletarPorId(Long id) {
        repository.deleteById(id);
    }

    public List<Usuario> buscarTodos() {
        return repository.findAll();
    }

    public Usuario buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new NaoEncontradoExcecao("Usuário não encontrado"));
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return repository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado: " + username));
    }
}