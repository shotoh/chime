package io.github.shotoh.chime.sounds;

import java.util.Set;
import org.springframework.data.annotation.Id;

public record Group(@Id long id, String name, int order, boolean enabled, Set<Sound> sounds, Set<Group> subGroups) implements Ordered {
}
