import { CommentData } from "./Comment";

interface Props {
  data: CommentData;
}

const CommentBox: React.FC<Props> = ({ data }) => {
  return (
    <div className="relative bg-white shadow-lg rounded-xl px-6 pt-6 pb-14 text-center">
      {/* Stars */}
      <div className="flex justify-center mb-4">
        {[...Array(5)].map((_, i) => (
          <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
            <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.564-.955L10 0l2.948 5.955 6.564.955-4.756 4.635 1.122 6.545z" />
          </svg>
        ))}
      </div>

      {/* Comment Text */}
      <p className="text-gray-600 text-sm mb-4 px-2">{data.rate}</p>

      {/* User Info */}
      <h3 className="font-semibold text-lg text-gray-800">{data.username}</h3>
      <span className="text-sm text-orange-400 font-medium">{data.auth}</span>

      {/* Avatar */}
      <div className="absolute left-1/2 transform -translate-x-1/2 translate-y-1/2 bottom-0 w-12 h-12 rounded-full border-4 border-white shadow-lg overflow-hidden">
        <img src={data.image} alt={data.username} className="w-full h-full object-cover" />
      </div>
    </div>
  );
};

export default CommentBox;
