package io.github.shotoh.chime.core;

import io.github.shotoh.chime.profiles.objects.Group;
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
	@Bean
	@Override
	public JdbcCustomConversions jdbcCustomConversions() {
		return new JdbcCustomConversions(List.of(
			new GroupWritingConverter(),
			new GroupReadingConverter()
		));
	}

	private static class GroupWritingConverter implements Converter<Group, String> {
		private final ObjectMapper objectMapper = new ObjectMapper();

		@Override
		public String convert(Group source) {
			return objectMapper.writeValueAsString(source);
		}
	}

	private static class GroupReadingConverter implements Converter<String, Group> {
		private final ObjectMapper objectMapper = new ObjectMapper();

		@Override
		public Group convert(String source) {
			return objectMapper.readValue(source, Group.class);
		}
	}
}
