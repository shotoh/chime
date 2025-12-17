package io.github.shotoh.chime.sounds;

import java.util.Set;

public record GetGroupDTO(String name, int order, boolean enabled, Set<GetSoundDTO> sounds, Set<GetGroupDTO> subGroups) {
}
