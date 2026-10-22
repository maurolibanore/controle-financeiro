package com.ifpr.backend.security;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;

@Service
public class RateLimitService {

    private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();

    public Bucket getBucket(String chave) {
        return buckets.computeIfAbsent(chave, k -> criarBucket());
    }

    private Bucket criarBucket() {
        Bandwidth limite = Bandwidth.simple(5, Duration.ofMinutes(1));
        return Bucket.builder().addLimit(limite).build();
    }
}