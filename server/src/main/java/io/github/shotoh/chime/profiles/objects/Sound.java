package io.github.shotoh.chime.profiles.objects;

public record Sound(String soundId, int delay, float volume, float pitch, int seed,
                    boolean enabled) implements GroupItem {
}
