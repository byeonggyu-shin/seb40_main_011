package seb.project.Codetech.snackreview.service;

import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import seb.project.Codetech.snackreview.dto.SnackReviewServiceDto;
import seb.project.Codetech.snackreview.entity.SnackReview;
import seb.project.Codetech.snackreview.mapper.SnackReviewServiceMapper;
import seb.project.Codetech.snackreview.repository.SnackReviewSimpleRepository;

@Service
@Transactional
@RequiredArgsConstructor
public class SnackReviewService {
	private final SnackReviewSimpleRepository simpleRepository;
	private final SnackReviewServiceMapper dtoMapper;

	public Long createSnackReview(SnackReviewServiceDto.Create dto) {
		SnackReview snackReview = dtoMapper.createDtoToEntity(dto);

		return simpleRepository.save(snackReview).getId();
	}

	public Long updateSnackReview(SnackReviewServiceDto.Update dto) {
		SnackReview snackReview = findVerifiedOne(dto.getId());
		snackReview.updateContent(dto.getContent());
		snackReview.setScore(dto.getScore());

		return snackReview.getId();
	}

	public void deleteSnackReview(Long id) {
		SnackReview snackReview = findVerifiedOne(id);
		simpleRepository.delete(snackReview);
	}

	@Transactional(readOnly = true)
	public SnackReview findVerifiedOne(Long id) {
		Optional<SnackReview> found = simpleRepository.findById(id);

		return found.orElseThrow(
			() -> new RuntimeException("SNACK_REVIEW_NOT_FOUND")
		);
	}
}