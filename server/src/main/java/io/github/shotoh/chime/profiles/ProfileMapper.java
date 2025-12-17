package io.github.shotoh.chime.profiles;

import org.mapstruct.Mapper;

@Mapper
public interface ProfileMapper {
	GetProfileDTO toDTO(Profile profile);
}
