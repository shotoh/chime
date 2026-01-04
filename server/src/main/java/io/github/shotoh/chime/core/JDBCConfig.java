package io.github.shotoh.chime.core;

import io.github.shotoh.chime.profiles.objects.Group;
import io.github.shotoh.chime.profiles.objects.GroupItem;
import io.github.shotoh.chime.profiles.objects.Sound;
import java.util.List;
import org.jspecify.annotations.NullMarked;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.data.jdbc.core.convert.JdbcCustomConversions;
import org.springframework.data.jdbc.repository.config.AbstractJdbcConfiguration;
import tools.jackson.databind.ObjectMapper;

@Configuration
@NullMarked
public class JDBCConfig extends AbstractJdbcConfiguration {
	private final ObjectMapper objectMapper;

	public JDBCConfig(ObjectMapper objectMapper) {
		this.objectMapper = objectMapper;
	}

	@Bean
	@Override
	public JdbcCustomConversions jdbcCustomConversions() {
		return new JdbcCustomConversions(List.of(
			new GroupWritingConverter(objectMapper),
			new GroupReadingConverter(objectMapper)
		));
	}

	private record GroupWritingConverter(ObjectMapper objectMapper) implements Converter<GroupItem, String> {
		@Override
		public String convert(GroupItem source) {
			return objectMapper.writeValueAsString(source);
		}
	}

	private record GroupReadingConverter(ObjectMapper objectMapper) implements Converter<String, Group> {
		@Override
		public Group convert(String source) {
			return objectMapper.readValue(source, Group.class);
		}
	}

	private record SoundReadingConverter(ObjectMapper objectMapper) implements Converter<String, Sound> {
		@Override
		public Sound convert(String source) {
			return objectMapper.readValue(source, Sound.class);
		}
	}
}
