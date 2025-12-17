package io.github.shotoh.chime.sounds;

public record GetSoundDTO(String soundId, int delay, float volume, float pitch, int order, boolean enabled) {
}
