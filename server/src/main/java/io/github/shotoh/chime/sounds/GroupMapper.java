package io.github.shotoh.chime.sounds;

import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = SoundMapper.class)
public interface GroupMapper {
	GroupDTO toDTO(Group group);
}
