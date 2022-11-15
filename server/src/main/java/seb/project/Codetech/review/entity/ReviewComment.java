package seb.project.Codetech.review.entity;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import seb.project.Codetech.global.auditing.BaseTime;
import seb.project.Codetech.user.entity.User;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class ReviewComment extends BaseTime {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false, columnDefinition = "MEDIUMTEXT")
	private String content;

	@OneToMany(mappedBy = "parent")
	private List<ReviewComment> child = new ArrayList<>();

	@ManyToOne
	@JoinColumn(name = "parent_id")
	private ReviewComment parent;

	@ManyToOne
	@JoinColumn(name = "review_id")
	private Review review;

	@ManyToOne
	@JoinColumn(name = "user_id")
	private User user;

	public void setReview(Review review) {
		this.review = review;

		if (!review.getReviewComments().contains(this)) {
			review.getReviewComments().add(this);
		}
	}

	public void setUser(User user) {
		this.user = user;

		if (!user.getReviewComments().contains(this)) {
			user.getReviewComments().add(this);
		}
	}

	public void setParent(ReviewComment parent) {
		this.parent = parent;

		if (!parent.getChild().contains(this)) {
			parent.getChild().add(this);
		}
	}
}