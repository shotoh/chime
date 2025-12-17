package io.github.shotoh.chime.profiles;

import io.github.shotoh.chime.sounds.Group;
import org.springframework.data.annotation.Id;

public record Profile(@Id String id, String token, String name, long timestamp, Group rootGroup) {
}
