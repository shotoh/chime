package io.github.shotoh.chime.core;

import org.jspecify.annotations.NullMarked;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class SoundConfig implements WebMvcConfigurer {
	@Value("${SOUNDS_DIRECTORY:}")
	private String soundDirectory;

	private final Logger logger = LoggerFactory.getLogger(SoundConfig.class);

	@Override
	@NullMarked
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		String directory = soundDirectory;
		if (directory.isEmpty()) return;
		if (!directory.endsWith("/")) {
			directory += "/";
		}

		logger.info("Loaded sounds in {}", directory);

		registry.addResourceHandler("/sounds/**")
			.addResourceLocations("file:///" + directory)
			.setCachePeriod(3600);
	}
}
