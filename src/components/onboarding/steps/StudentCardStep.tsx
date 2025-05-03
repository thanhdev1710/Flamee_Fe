import CropImage from "@/components/shared/CropImage";
import LayoutStep from "./LayoutStep";
import { confirmCard } from "@/actions/user.action";
import { useOnboardingStore } from "@/store/onboardingStore";

export default function StudentCardStep() {
  const { nextStep } = useOnboardingStore();
  return (
    <LayoutStep isPrev={false} isNext={false}>
      <div className="max-w-md mx-auto mb-4 text-center space-y-6 p-6 shadow rounded-xl">
        {/* Tiêu đề & mô tả */}
        <h2 className="text-2xl font-bold text-flamee-primary">
          Ảnh thẻ sinh viên
        </h2>
        <p className="text-sm text-gray-400 leading-relaxed text-left space-y-2">
          <span className="block">
            📸 Ảnh cần theo tỷ lệ <strong>4:3</strong>, thấy rõ khuôn mặt.
          </span>
          <span className="block">
            🚫 Không sử dụng ảnh mờ, bị che khuất hoặc chụp ngược sáng.
          </span>
          <span className="block">
            🔒 Ảnh <strong>chỉ dùng một lần</strong> để xác thực,{" "}
            <strong>không lưu trữ</strong>.
          </span>
        </p>
      </div>

      <CropImage
        action={async (file) => {
          await confirmCard(file);
          nextStep();
        }}
        aspect={8 / 5}
      />
    </LayoutStep>
  );
}
