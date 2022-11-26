package seb.project.Codetech.review.controller;

import java.io.IOException;
import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.Positive;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import lombok.extern.log4j.Log4j2;
import seb.project.Codetech.event.dto.ReviewUpdateEvent;
import seb.project.Codetech.file.entity.FileEntity;
import seb.project.Codetech.file.service.FileService;
import seb.project.Codetech.product.entity.Type;
import seb.project.Codetech.recommend.service.RecommendService;
import seb.project.Codetech.review.dto.ReviewRequestDto;
import seb.project.Codetech.review.dto.ReviewResponseDto;
import seb.project.Codetech.review.entity.Review;
import seb.project.Codetech.review.mapper.ReviewMapper;
import seb.project.Codetech.review.service.ReviewService;

@RestController
@RequestMapping("/api/reviews")
@Log4j2
public class ReviewController {

	private final ReviewService reviewService;
	private final FileService fileService;
	private final ApplicationEventPublisher applicationEventPublisher;
	private final ReviewMapper mapper;

	public ReviewController(ReviewService reviewService, FileService fileService,
		ReviewMapper mapper, ApplicationEventPublisher applicationEventPublisher) {
		this.reviewService = reviewService;
		this.fileService = fileService;
		this.applicationEventPublisher = applicationEventPublisher;
		this.mapper = mapper;
	}

	@PostMapping
	public ResponseEntity<List<ReviewResponseDto.Post>> postReview(@AuthenticationPrincipal String email,
		@RequestPart @Valid ReviewRequestDto.Post request,
		@RequestPart List<MultipartFile> file) throws IOException {

		Review postReview = mapper.reviewRequestDtoToPostReview(request);
		Review serviceReview = reviewService.createReview(email, request.getProductId(), postReview);
		List<FileEntity> fileEntities = fileService.insertFiles(file);
		fileService.setUploadReview(serviceReview, fileEntities);
		List<ReviewResponseDto.Post> reviewPost = reviewService.responseReviewPost(serviceReview);

		applicationEventPublisher.publishEvent(
			new ReviewUpdateEvent(request.getProductId()));

		return ResponseEntity.status(HttpStatus.CREATED).body(reviewPost);
	}

	@PatchMapping
	public ResponseEntity<Review> patchReview(@AuthenticationPrincipal String email,
		@RequestPart @Valid ReviewRequestDto.Patch request,
		@RequestPart List<MultipartFile> file) throws IOException {

		Review patchReview = mapper.reviewRequestDtoToPatchReview(request);
		Review serviceReview = reviewService.modifyReview(email, request.getProductId(), patchReview);
		List<FileEntity> fileEntities = fileService.insertFiles(file);
		fileService.setUploadReview(serviceReview, fileEntities);

		applicationEventPublisher.publishEvent(
			new ReviewUpdateEvent(request.getProductId()));

		return ResponseEntity.ok(serviceReview);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Review> deleteReview(@AuthenticationPrincipal String email,
		@PathVariable @Positive Long id) {

		Long productId = reviewService.removeReview(email, id);
		applicationEventPublisher.publishEvent(new ReviewUpdateEvent(productId));

		return ResponseEntity.ok().build();
	}

	@GetMapping("/{id}")
	public ResponseEntity<Review> getReview(@PathVariable Long id) {
		Review loadReview = reviewService.loadReview(id);

		return ResponseEntity.ok(loadReview);
	}

	@GetMapping("/category")
	public ResponseEntity<Review> getTypeSearch(@RequestParam Type type) {
		reviewService.searchTypeReview(type);
		return null;
	}
}
