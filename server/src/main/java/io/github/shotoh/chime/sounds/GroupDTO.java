package io.github.shotoh.chime.sounds;

import java.util.Set;

public record GroupDTO(String name, int order, boolean enabled, Set<SoundDTO> sounds, Set<GroupDTO> subGroups) {
}
