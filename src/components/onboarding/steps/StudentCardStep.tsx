import CropImage from "@/components/shared/CropImage";
import LayoutStep from "./LayoutStep";
import { confirmCard } from "@/actions/user.action";
import { useOnboardingStore } from "@/store/onboardingStore";
import { toast } from "sonner";
import { createUserSchema } from "@/types/user.type";

export default function StudentCardStep() {
  const {
    nextStep,
    setLastName,
    setFirstName,
    setDob,
    setCourse,
    setMSSV,
    setMajor,
  } = useOnboardingStore();
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
          try {
            const data = await confirmCard(file);

            // Tách schema chỉ chứa các trường cần validate
            const cardSchema = createUserSchema.pick({
              course: true,
              dob: true,
              mssv: true,
              major: true,
              lastName: true,
              firstName: true,
            });

            // Tách thông tin từ dữ liệu trả về
            const [lastName, ...rest] = data.name.trim().split(" ");
            const firstName = rest.join(" ");
            const [day, month, year] = data.dob.split("/").map(Number);
            const dob = new Date(year, month - 1, day);

            const card = {
              lastName,
              firstName,
              major: data.major,
              mssv: data.mssv,
              course: data.course,
              dob,
            };

            const result = cardSchema.safeParse(card);

            if (!result.success) {
              toast.error(result.error.errors[0].message, { richColors: true });
              return;
            }

            // Cập nhật dữ liệu
            setLastName(lastName);
            setFirstName(firstName);
            setDob(dob);
            setMSSV(data.mssv);
            setMajor(data.major);
            setCourse(data.course);

            nextStep();
          } catch (error) {
            const message =
              error instanceof Error ? error.message : "Lỗi từ server";
            toast.error(message, { richColors: true });
          }
        }}
        aspect={8 / 5}
      />
    </LayoutStep>
  );
}
