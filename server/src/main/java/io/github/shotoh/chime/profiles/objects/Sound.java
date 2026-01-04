package io.github.shotoh.chime.profiles.objects;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

public record Sound(String soundId, @Min(0) int delay, @Min(0) @Max(2) float volume, @Min(0) @Max(2) float pitch,
                    @Min(0) int seed, boolean enabled) implements GroupItem {
}
