package io.github.shotoh.chime.profiles;

import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ProfileMapper {
	ProfileNoTokenDTO toDTO(Profile profile);
}
