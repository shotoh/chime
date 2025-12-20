package io.github.shotoh.chime.profiles;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.github.shotoh.chime.sounds.Group;
import java.util.UUID;
import org.springframework.data.annotation.Id;

public record Profile(@Id UUID id, @JsonIgnore String token, String name, long timestamp, Group rootGroup) {
}
