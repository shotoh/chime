package io.github.shotoh.chime.profiles;

import io.github.shotoh.chime.exceptions.ResourceNotFoundException;
import io.github.shotoh.chime.exceptions.UnauthorizedException;
import io.github.shotoh.chime.sounds.Group;
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
		Profile profile = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("id", "profile not found"));
		return mapper.toDTO(profile);
	}

	public ProfileWithTokenDTO createProfile() {
		String token = generateToken();
		String hashToken = hashToken(token);
		Profile profile = new Profile(UUID.randomUUID(), hashToken, "New Profile", Instant.now().toEpochMilli(), createDefaultGroup());
		repository.save(profile);
		return new ProfileWithTokenDTO(mapper.toDTO(profile), hashToken);
	}

	public ProfileWithTokenDTO cloneProfile(UUID id) {
		String token = generateToken();
		String hashToken = hashToken(token);
		Profile original = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("id", "profile not found"));
		Profile clone = new Profile(UUID.randomUUID(), hashToken, original.name(), Instant.now().toEpochMilli(), original.rootGroup());
		repository.save(clone);
		return new ProfileWithTokenDTO(mapper.toDTO(clone), hashToken);
	}

	public void deleteProfile(UUID id, String token) {
		Profile profile = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("id", "profile not found"));
		String hashToken = hashToken(token);
		if (!hashToken.equals(profile.token())) {
			throw new UnauthorizedException("id", "token mismatch");
		}
		repository.delete(profile);
	}

	public ProfileDTO updateProfile(UUID id, String token) {
		return null;
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
}
