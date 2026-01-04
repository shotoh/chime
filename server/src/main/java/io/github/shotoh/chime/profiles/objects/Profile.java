package io.github.shotoh.chime.profiles.objects;

import java.util.UUID;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Getter
@Setter
@Table("profiles")
public class Profile {
	@Id
	private UUID id;
	private final String token;
	private String name;
	private long lastUpdated;
	private boolean isDeleted;
	private Group rootGroup;

	public Profile(String token, String name, long lastUpdated, Group rootGroup) {
		this.token = token;
		this.name = name;
		this.lastUpdated = lastUpdated;
		this.isDeleted = false;
		this.rootGroup = rootGroup;
	}
}
