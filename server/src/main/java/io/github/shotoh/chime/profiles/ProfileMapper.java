package io.github.shotoh.chime.profiles;

import io.github.shotoh.chime.profiles.objects.Profile;
import io.github.shotoh.chime.profiles.objects.ProfileDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ProfileMapper {
	ProfileDTO toDTO(Profile profile);
}
