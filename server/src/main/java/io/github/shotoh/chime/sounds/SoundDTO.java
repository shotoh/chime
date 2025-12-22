package io.github.shotoh.chime.sounds;

public record SoundDTO(String soundId, int delay, float volume, float pitch, int order, boolean enabled) {
}
