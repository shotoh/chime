package io.github.shotoh.chime.profiles.objects;

import java.util.UUID;
import org.springframework.data.annotation.Id;

public record Profile(@Id UUID id, String token, String name, long timestamp, Group rootGroup) {
}
