package io.github.shotoh.chime.profiles.objects;

import jakarta.validation.constraints.Size;

public record ProfileUpdateDTO(@Size(min = 1, max = 63) String name, Group rootGroup) {
}
