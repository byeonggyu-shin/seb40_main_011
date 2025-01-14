// Review List fetching & boxing comp
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useIsLogin } from '../../store/login';
import { getReviewDetail } from '../../util/apiCollection';
import { Review, ReviewComments } from '../../types/mainPageTypes';
import { AiOutlineHeart } from 'react-icons/ai';
import { Viewer } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor-viewer.css';
import CommentInput from './CommentInput';
import HandleLike from './Like';
import Comment from './Comment';
import useReview from '../../store/review';
import CheckModal from './DeleteModal';
import Spinner from '../../util/Spinner';
import ScrollToTop from '../../util/ScrollToTop';
import { BsArrowLeft } from 'react-icons/bs';
import { AiOutlineEye } from '../../icons';
import '@toast-ui/editor/dist/theme/toastui-editor-dark.css';
import { useDarkMode } from '../../store/darkMode';
interface markdownProps {
  markdown: string | undefined;
}

const RvDetail = () => {
  const { darkMode } = useDarkMode();
  const { setContent } = useReview();
  const navigate = useNavigate();
  const params = useParams();
  const reviewId = Number(params.id);
  const [review, setReview] = useState<Review>({
    content: '',
    createdAt: '',
    productDetail: '',
    productName: '',
    recommendNumber: 0,
    reviewComments: [],
    title: '',
    type: '',
    userId: 0,
    userImage: '',
    view: 0,
    writer: '',
    productId: 0,
    thumbnail: '',
    recommends: [],
  });

  const { loginId } = useIsLogin();
  const [showModal, setShowModal] = useState(false);

  ScrollToTop();

  useEffect(() => {
    const getReviewData = async () => {
      const { data } = await getReviewDetail(reviewId);
      setReview(data);
      setContent(data.content);
    };
    getReviewData();
  }, []);

  const HandleSpinner = () => {
    if (review.content === '') {
      return <Spinner />;
    }
    return null;
  };

  const getParsedDate = (createdAt: string) => {
    return new Date(createdAt).toLocaleDateString('ko-KR');
  };

  const onTypeClick = () => {
    navigate(`/categories/review/${review.productId}`);
  };

  const ConvertedContent = ({ markdown = review?.content }: markdownProps) => {
    return (
      <>
        {markdown && (
          <div id="viewer">
            <Viewer
              initialValue={markdown}
              theme={darkMode === true ? `dark` : `light`}
            />
          </div>
        )}
      </>
    );
  };

  const CommentView = () => {
    if (review !== undefined && review?.reviewComments?.length > 0) {
      return (
        <div className="flex flex-col w-full h-full ">
          {review.reviewComments.map((el: ReviewComments, idx: number) => (
            <Comment key={idx} reviewComments={el} />
          ))}
        </div>
      );
    } else return null;
  };

  const onEditClick = () => {
    navigate(`/review/edit/${params.id}`);
  };

  const ReviewInfo = () => {
    const handleDeleteReview = () => {
      setShowModal(!showModal);
    };

    return (
      <div className="flex items-center justify-between w-full px-5 md:px-12 ">
        <div className="flex items-center">
          <img
            className="w-12 h-12 rounded-2xl"
            src={`https://codetech.nworld.dev${review?.userImage}`}
          />
          <div className="flex flex-col pl-3 pb-1">
            <span className="pt-0.5 font-medium text-black/70 text-lg dark:text-white">
              {review?.writer}
            </span>
            <span className="font-medium tracking-tight text-black/40 before:text-gray-300 dark:text-white/40">
              {getParsedDate(review?.createdAt)}
            </span>
          </div>
        </div>
        <div className="flex flex-col font-medium tracking-tight text-gray-500/60 before:text-gray-300 text-md">
          {review.userId === Number(loginId) && (
            <div>
              <button
                onClick={handleDeleteReview}
                className="text-md border border-gray-300 font-medium px-3 bg-white rounded-full mx-1 pb-1 pt-0.5 text-gray-400 hover:text-gray-500 hover:font-bold hover:bg-gray-200"
              >
                삭제
              </button>
              <button
                onClick={onEditClick}
                className="text-md border border-gray-300 font-medium px-3 bg-white rounded-full mx-1 pb-1 pt-0.5 text-gray-400 hover:text-gray-500 hover:font-bold hover:bg-gray-200"
              >
                수정
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {showModal && (
        <CheckModal
          setShowModal={setShowModal}
          msg="정말 삭제하시겠습니까?"
          productId={review.productId}
        />
      )}
      <HandleSpinner />
      <div className="bg-zinc-100 py-8 dark:bg-DMMainColor dark:text-white transition-all ease-in">
        <div className="flex flex-col justify-center mx-auto w-full lg:w-[64rem] px-4 ">
          <div className="w-full flex justify-between mb-4">
            <div
              className=" dark:bg-DMSubColor dark:hover:bg-black/60 dark:text-white grow-0 shrink-1 w-fit flex items-center h-12 pl-4 pr-5 md:pr-8 font-bold text-black/40 hover:text-black/70 duration-150 ease-in-out bg-white rounded-full hover:bg-slate-300 hover:text-slate-700"
              role="button"
              onClick={onTypeClick}
            >
              <BsArrowLeft
                className="flex-none mr-3 dark:text-white/40"
                size="24"
              />
              <span className="pb-1 break-all dark:text-white line-clamp-1">
                {review.productName}
              </span>
            </div>
            <div className="text-black/20 flex-none h-12 rounded-full flex items-center pr-5 ml-5 ">
              <AiOutlineEye size="28" className="dark:text-white/40" />
              <div className="font-medium ml-1 pb-0.5 text-lg mr-2 text-black/60 dark:text-white/90">
                {review.view}
              </div>
              <span className="border-l border-zinc-300 dark:border-white/20 mr-3 ml-2 h-4" />
              <AiOutlineHeart size="24" className="dark:text-white/40" />
              <div className="font-medium ml-1 pb-0.5 text-lg text-black/60 dark:text-white/90">
                {review.recommendNumber}
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-DMSubColor rounded-t-3xl py-4 md:py-8">
            <ReviewInfo />
            <div className="flex justify-center px-5 md:px-12 pt-6 md:pt-12 pb-6 text-5xl leading-tight tracking-tight font-bold max-md:text-[2rem] break-keep text-center">
              {review?.title}
            </div>
          </div>
          <div className={`flex justify-center items-center`}>
            {review.thumbnail.length === 0 ? null : (
              <div
                className={`bg-white w-full flex justify-center items-center dark:bg-DMSubColor`}
              >
                <img src={`https://codetech.nworld.dev${review?.thumbnail}`} />
              </div>
            )}
          </div>
          <section className="bg-white rounded-b-3xl flex flex-col items-center px-5 md:px-12 dark:bg-DMSubColor ">
            <div className="w-full md:px-12 my-6 md:my-12 whitespace-pre-wrap flex flex-col justify-center">
              <ConvertedContent markdown={review.content} />
              <HandleLike
                userId={review.userId}
                recommends={review.recommends}
              />
            </div>
          </section>
        </div>
        <div className="flex flex-col justify-center mx-auto w-full lg:w-[64rem] px-4 mt-4 ">
          <div className="flex flex-col items-center bg-white rounded-3xl px-5 md:px-12 dark:bg-DMSubColor">
            <div className="flex justify-start w-full text-2xl font-bold mb-4 mt-6 md:mt-8 dark:text-white">
              Comment
            </div>
            <CommentView />
            <CommentInput />
          </div>
        </div>
      </div>
    </>
  );
};

export default RvDetail;
