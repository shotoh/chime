package io.github.shotoh.chime.sounds;

public record Sound(String soundId, int delay, float volume, float pitch, boolean enabled) implements GroupItem {
}
