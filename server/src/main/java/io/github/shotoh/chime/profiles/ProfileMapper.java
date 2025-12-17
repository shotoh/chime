package io.github.shotoh.chime.profiles;

import io.github.shotoh.chime.sounds.GroupMapper;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = GroupMapper.class)
public interface ProfileMapper {
	GetProfileDTO toDTO(Profile profile);
}
