package io.github.shotoh.chime.profiles;

import io.github.shotoh.chime.exceptions.InvalidArgumentException;
import io.github.shotoh.chime.exceptions.ResourceNotFoundException;
import io.github.shotoh.chime.exceptions.UnauthorizedException;
import io.github.shotoh.chime.profiles.objects.Group;
import io.github.shotoh.chime.profiles.objects.GroupItem;
import io.github.shotoh.chime.profiles.objects.Profile;
import io.github.shotoh.chime.profiles.objects.ProfileDTO;
import io.github.shotoh.chime.profiles.objects.ProfileUpdateDTO;
import io.github.shotoh.chime.profiles.objects.ProfileWithTokenDTO;
import io.github.shotoh.chime.profiles.objects.Sound;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Base64;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProfileService {
	private final ProfileRepository repository;
	private final ProfileMapper mapper;
	private final SecureRandom random;
	private final Base64.Encoder encoder;

	@Autowired
	public ProfileService(ProfileRepository repository, ProfileMapper mapper) {
		this.repository = repository;
		this.mapper = mapper;
		this.random = new SecureRandom();
		this.encoder = Base64.getEncoder();
	}

	public ProfileDTO getProfile(UUID id) {
		Profile profile = findProfile(id);
		return mapper.toDTO(profile);
	}

	public ProfileWithTokenDTO createProfile() {
		String token = generateToken();
		String hashToken = hashToken(token);

		Profile profile = new Profile(hashToken, "New Profile", Instant.now().toEpochMilli(), createDefaultGroup());
		Profile saved = repository.save(profile);

		return new ProfileWithTokenDTO(mapper.toDTO(saved), token);
	}

	public ProfileWithTokenDTO cloneProfile(UUID id) {
		String token = generateToken();
		String hashToken = hashToken(token);

		Profile original = findProfile(id);
		Profile clone = new Profile(hashToken, original.getName(), Instant.now().toEpochMilli(), original.getRootGroup());
		Profile saved = repository.save(clone);

		return new ProfileWithTokenDTO(mapper.toDTO(saved), token);
	}

	public void deleteProfile(UUID id, String token) {
		Profile profile = findProfile(id);
		verifyToken(profile, token);

		profile.setDeleted(true);
		repository.save(profile);
	}

	public ProfileDTO updateProfile(UUID id, String token, ProfileUpdateDTO profileUpdateDTO) {
		Profile profile = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("id", "profile not found"));
		verifyToken(profile, token);
		verifyUpdate(profileUpdateDTO);

		profile.setName(profileUpdateDTO.name());
		profile.setLastUpdated(Instant.now().toEpochMilli());
		profile.setRootGroup(profileUpdateDTO.rootGroup());

		Profile saved = repository.save(profile);
		return mapper.toDTO(saved);
	}

	private Profile findProfile(UUID id) {
		Profile profile = repository.findById(id).orElse(null);
		if (profile == null || profile.isDeleted()) {
			throw new ResourceNotFoundException("id", "profile not found");
		}
		return profile;
	}

	private Group createDefaultGroup() {
		return new Group("Root Group", true, new ArrayList<>());
	}

	private String generateToken() {
		byte[] tokenBytes = new byte[32];
		random.nextBytes(tokenBytes);
		return encoder.encodeToString(tokenBytes);
	}

	private String hashToken(String token) {
		try {
			MessageDigest sha256 = MessageDigest.getInstance("SHA-256");
			byte[] hash = sha256.digest(token.getBytes());
			return encoder.encodeToString(hash);
		} catch (NoSuchAlgorithmException e) {
			throw new RuntimeException("SHA-256 algorithm not found");
		}
	}

	private void verifyToken(Profile profile, String token) {
		if (token.length() < 7) {
			throw new UnauthorizedException("token", "token mismatch");
		}
		String hashToken = hashToken(token.substring(7));
		if (!hashToken.equals(profile.getToken())) {
			throw new UnauthorizedException("token", "token mismatch");
		}
	}

	private void verifyUpdate(ProfileUpdateDTO profileUpdateDTO) {
		int nameLength = profileUpdateDTO.name().length();
		if (nameLength == 0 || nameLength > 63) {
			throw new UnauthorizedException("name", "invalid name length");
		}

		Group group = profileUpdateDTO.rootGroup();
		int maxDepth = countDepth(group, 1);
		if (maxDepth >= 3) {
			throw new InvalidArgumentException("rootGroup", "group depth cannot be more than 3");
		}
		int sounds = countSounds(group);
		if (sounds >= 200) {
			throw new InvalidArgumentException("rootGroup", "sounds cannot be more than 200");
		}

		validateFields(group);
	}

	private int countDepth(Group group, int currentDepth) {
		int maxDepth = currentDepth;
		for (GroupItem item : group.items()) {
			if (item instanceof Group subGroup) {
				int nestedDepth = countDepth(subGroup, currentDepth + 1);
				maxDepth = Math.max(maxDepth, nestedDepth);
			}
		}
		return maxDepth;
	}

	private int countSounds(Group group) {
		int count = 0;
		for (GroupItem item : group.items()) {
			if (item instanceof Sound) {
				count++;
			} else if (item instanceof Group subGroup) {
				count += countSounds(subGroup);
			}
		}
		return count;
	}

	private void validateFields(Group group) {
		int nameLength = group.name().length();
		if (nameLength == 0 || nameLength > 63) {
			throw new UnauthorizedException("rootGroup", "invalid name length");
		}
		for (GroupItem item : group.items()) {
			if (item instanceof Sound sound) {
				if (sound.delay() < 0) {
					throw new InvalidArgumentException("rootGroup", "sound delay must be >= 0");
				} else if (sound.volume() < 0 || sound.volume() > 2) {
					throw new InvalidArgumentException("rootGroup", "sound volume must be between 0 and 2");
				} else if (sound.pitch() < 0 || sound.pitch() > 2) {
					throw new InvalidArgumentException("rootGroup", "sound pitch must be between 0 and 2");
				} else if (sound.seed() < 0) {
					throw new InvalidArgumentException("rootGroup", "sound seed must be >= 0");
				}
			} else if (item instanceof Group subGroup) {
				validateFields(subGroup);
			}
		}
	}
}
