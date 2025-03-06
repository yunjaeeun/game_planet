package com.meeple.meeple_back.config;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.repository.configuration.EnableRedisRepositories;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

@Configuration
@EnableRedisRepositories
public class RedisConfig {

	@Value("${spring.data.redis.host}")
	private String redisHost;
	@Value("${spring.data.redis.port}")
	private int redisPort;

	@Bean(name = "userRedisTemplate")
	public RedisTemplate<String, String> userRedisTemplate(
			RedisConnectionFactory connectionFactory) {
		RedisTemplate<String, String> template = new RedisTemplate<>();
		template.setConnectionFactory(connectionFactory);

		// Key serializer
		template.setKeySerializer(new StringRedisSerializer());

		// Value serializer with custom ObjectMapper
		template.setValueSerializer(new GenericJackson2JsonRedisSerializer(customObjectMapper()));
		template.setHashKeySerializer(new StringRedisSerializer());
		template.setHashValueSerializer(
				new GenericJackson2JsonRedisSerializer(customObjectMapper()));

		return template;
	}

	@Bean(name = "redisTemplate")
	public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory connectionFactory) {
		RedisTemplate<String, Object> template = new RedisTemplate<>();
		template.setConnectionFactory(connectionFactory);

		// Key serializer
		template.setKeySerializer(new StringRedisSerializer());

		// Value serializer with custom ObjectMapper
		template.setValueSerializer(new GenericJackson2JsonRedisSerializer(customObjectMapper()));
		template.setHashKeySerializer(new StringRedisSerializer());
		template.setHashValueSerializer(
				new GenericJackson2JsonRedisSerializer(customObjectMapper()));

		return template;
	}


	@Bean
	public RedisConnectionFactory redisConnectionFactory() {
		return new LettuceConnectionFactory(redisHost, redisPort);
	}

	@Bean
	public ObjectMapper customObjectMapper() {
		ObjectMapper objectMapper = new ObjectMapper();
		// JavaTimeModule for date and time handling
		objectMapper.registerModule(new JavaTimeModule());
		// Avoid writing dates as timestamps
		objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
		// Exclude null fields
		objectMapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
		return objectMapper;
	}
}
