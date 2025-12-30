package io.github.shotoh.chime.profiles.objects;

import java.util.UUID;

public record ProfileDTO(UUID id, String name, Group rootGroup) {
}
