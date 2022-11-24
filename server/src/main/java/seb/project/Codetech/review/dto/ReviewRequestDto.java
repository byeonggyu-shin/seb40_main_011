package seb.project.Codetech.review.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

public class ReviewRequestDto {

	@Getter
	@NoArgsConstructor
	public static class Post {
		private Long productId;
		private String title;
		private String content;
	}

	@Getter
	@NoArgsConstructor
	public static class Patch {
		private Long productId;
		private String title;
		private String content;
	}
}