package io.github.shotoh.chime.sounds;

import java.util.List;

public record Group(String name, boolean enabled, List<GroupItem> items) implements GroupItem {
}
