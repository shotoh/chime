package io.github.shotoh.chime.profiles.objects;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

@JsonTypeInfo(
	use = JsonTypeInfo.Id.NAME,
	property = "type"
)
@JsonSubTypes({
	@JsonSubTypes.Type(value = Sound.class, name = "sound"),
	@JsonSubTypes.Type(value = Group.class, name = "group")
})
public sealed interface GroupItem permits Sound, Group {
}
