package io.github.shotoh.chime.profiles.objects;

import jakarta.validation.constraints.Size;
import java.util.List;

public record Group(@Size(min = 1, max = 63) String name, boolean enabled, List<GroupItem> items) implements GroupItem {
}
