package io.github.shotoh.chime.sounds;

import java.util.UUID;
import org.springframework.data.annotation.Id;

public record Sound(@Id UUID id, String soundId, int delay, float volume, float pitch, int order, boolean enabled) {
}
