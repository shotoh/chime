package io.github.shotoh.chime.profiles;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

@Controller
public class ProfileController {
	private final ProfileService service;

	@Autowired
	public ProfileController(ProfileService service) {
		this.service = service;
	}
}
