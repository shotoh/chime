package io.github.shotoh.chime.profiles;

import io.github.shotoh.chime.profiles.objects.Profile;
import java.util.UUID;
import org.springframework.data.relational.core.mapping.event.BeforeConvertCallback;
import org.springframework.stereotype.Component;

@Component
public class ProfileCallback implements BeforeConvertCallback<Profile> {
	@Override
	public Profile onBeforeConvert(Profile profile) {
		if (profile.getId() == null) {
			profile.setId(UUID.randomUUID());
		}
		return profile;
	}
}
