import { Review } from '../../types/mainPageTypes';
import React, { useEffect, useState } from 'react';
import { getReview } from '../../util/apiCollection';
import { useNavigate } from 'react-router-dom';
import { FaChevronRight } from 'react-icons/fa';

const BestReviewList = () => {
  const navigate = useNavigate();
  const [sortedReviews, setSortedReviews] = useState<Review[]>([]);
  const [selectedIdx, setSelectedIdx] = useState(0);

  // 리뷰 데이터 불어오기
  useEffect(() => {
    const getReviewData = async () => {
      const { data } = await getReview();
      setSortedReviews(
        data.sort((a: Review, b: Review) => b.likes - a.likes).slice(0, 3)
      );
    };
    getReviewData();
  }, []);

  const onClick = () => {
    let nextIdx = selectedIdx;
    setSelectedIdx(nextIdx + 1);
    if (nextIdx === 2) {
      nextIdx = 0;
      setSelectedIdx(nextIdx);
    }
  };

  const onContentClick = (e: React.MouseEvent<HTMLElement>) => {
    navigate(`/review/${e.currentTarget.id}`);
  };

  return (
    <div className="flex justify-center my-16">
      {sortedReviews[selectedIdx] === undefined ? (
        <div>loading ... </div>
      ) : (
        <div className="w-3/5 h-48 flex p-4 justify-evenly rounded-lg bg-white drop-shadow-bestReviews">
          <div className="flex flex-col w-4/5">
            {/* <img
              className="w-2/5 h-full mx-2"
              src={sortedReviews[selectedIdx]?.thumbnail}
            ></img> */}
            <div className="font-bold mb-4">
              {sortedReviews[selectedIdx]?.title}
            </div>
            <div
              className="my-2 line-clamp-2 hover:bg-slate-300 hover:rounded-md p-1 text-slate-600 hover:text-cyan-900"
              role="button"
              onClick={onContentClick}
              id={sortedReviews[selectedIdx].id.toString()}
            >
              {sortedReviews[selectedIdx]?.content}
            </div>
            <div className="flex justify-between items-center">
              <div className="text-sm">{sortedReviews[selectedIdx]?.type}</div>
              <div className=" flex flex-row items-center justify-around">
                <div>{sortedReviews[selectedIdx]?.createdAt}</div>
                <div className="font-bold ml-4 ">
                  {sortedReviews[selectedIdx]?.nickname}
                </div>
                <img
                  className="rounded-full w-10 h-10 m-2"
                  src={sortedReviews[selectedIdx]?.profileImg}
                ></img>
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <button
              className="flex items-center justify-center h-12 w-12 rounded-full hover:bg-slate-300"
              onClick={onClick}
            >
              <FaChevronRight />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BestReviewList;
