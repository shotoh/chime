package io.github.shotoh.chime.profiles.objects;

import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;

@AllArgsConstructor
@Getter
@Setter
public class Profile {
	@Id
	private final UUID id;
	private final String token;
	private String name;
	private long lastUpdated;
	private Group rootGroup;
}
