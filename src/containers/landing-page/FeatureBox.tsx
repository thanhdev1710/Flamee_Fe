type FeatureBoxProps = {
  name: string;
  image: string;
  description: string;
};

function FeatureBox({ name, image, description }: FeatureBoxProps) {
  const displayName = {
    Image: "Create Image",
    Follower: "Control Followers",
    Post: "Edit Post",
    Activities: "Activities Control",
    Social: "Add Social",
    Comment: "Save Your Comments",
  }[name] || name;

  return (
    <div className="bg-white rounded-xl shadow-md p-6 text-center flex flex-col items-center justify-start h-[250px]">
      <div className="bg-indigo-100 p-3 rounded-full mb-4">
        <img src={image} alt={displayName} className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-indigo-900 mb-1">{displayName}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  );
}

export default FeatureBox;
