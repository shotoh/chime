package io.github.shotoh.chime.sounds;

import org.springframework.data.annotation.Id;

public record Sound(@Id long id, String soundId, int delay, float volume, float pitch, int order, boolean enabled) implements Ordered {
}
