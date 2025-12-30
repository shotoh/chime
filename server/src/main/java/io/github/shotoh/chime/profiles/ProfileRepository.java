package io.github.shotoh.chime.profiles;

import io.github.shotoh.chime.profiles.objects.Profile;
import java.util.UUID;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProfileRepository extends CrudRepository<Profile, UUID> {
}
