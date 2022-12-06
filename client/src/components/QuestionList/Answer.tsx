import BodyTop from './BodyTop';
import { PatchAnswerProps } from '../../types/mainPageTypes';
import Avatar from '../Avatar/Avatar';
import { RiChatDeleteFill } from 'react-icons/ri';
import { useState } from 'react';
import UndoAdopt from '../Modal/UndoAdopt';
import { useIsLogin } from '../../store/login';

export default function Answer({
  createdAt,
  nickname,
  content,
  writerId,
  id,
  adoptedId,
  image,
  questionId,
}: PatchAnswerProps) {
  const [showModal, setShowModal] = useState(false);
  const { loginId } = useIsLogin();
  const hanldeUndo = () => {
    setShowModal(!showModal);
  };

  console.log(loginId);

  return (
    <>
      {showModal && (
        <UndoAdopt
          setShowModal={setShowModal}
          msg="채택을 취소하시겠습니까?"
          id={questionId}
        />
      )}
      <div className="w-full flex mt-3 mb-1">
        <div className="flex-none ml-10 mt-3">
          <Avatar image={image} />
        </div>
        <div className="w-full pl-2">
          <BodyTop
            createdAt={createdAt}
            nickname={nickname}
            adoptedId={adoptedId}
          />
          <div className="flex relative">
            <div
              className={`grow px-4 pt-2 pb-3 rounded bg-white text-gray-600 font-medium mr-2 ${
                id === adoptedId && `ring ring-green-400`
              }`}
            >
              {content}
            </div>
            <div
              className={`tracking-tight absolute ${
                Number(loginId) !== writerId ? 'right-6' : 'right-16'
              } text-sm font-medium bg-green-500 text-white px-3 rounded-full pt-1 pb-1.5 -top-4`}
            >
              채택된 답변
            </div>
            {id === adoptedId && Number(loginId) === writerId && (
              <>
                <div className="flex-none w-16 mx-2 flex justify-center items-start">
                  <button
                    onClick={hanldeUndo}
                    className="group w-full h-11 text-2xl bg-red-100 rounded duration-300 hover:ring hover:ring-red-300 "
                  >
                    <RiChatDeleteFill className="text-red-500 mx-auto" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
