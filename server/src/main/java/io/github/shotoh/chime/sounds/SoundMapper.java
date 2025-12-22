package io.github.shotoh.chime.sounds;

import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface SoundMapper {
	SoundDTO toDTO(Sound sound);
}
