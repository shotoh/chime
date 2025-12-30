package io.github.shotoh.chime.profiles;

import io.github.shotoh.chime.sounds.Group;

public record ProfileUpdateDTO(String name, Group rootGroup) {
}
