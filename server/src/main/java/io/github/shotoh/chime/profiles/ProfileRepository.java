package io.github.shotoh.chime.profiles;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProfileRepository extends CrudRepository<Profile, String> {
	// Optional<Profile> findById(long id);
}
