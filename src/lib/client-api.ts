export async function clientApi<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(path, { ...options, cache: "no-store" });
  const result = await response.json();
  if (!response.ok) {
    const messages: Record<string, string> = {
      UNAUTHENTICATED: "Vui lòng đăng nhập.", FORBIDDEN: "Bạn không có quyền thực hiện thao tác này.",
      NOT_FOUND: "Không tìm thấy dữ liệu.", ATTENDANCE_NOT_ALLOWED: "Chỉ đăng ký đã duyệt mới được điểm danh. Hãy tải lại danh sách.",
      INVALID_VOLUNTEER_HOURS: "Số giờ không được vượt quá thời lượng hoạt động.",
      VALIDATION_ERROR: "Dữ liệu chưa hợp lệ. Hãy kiểm tra trạng thái và số giờ.",
    };
    throw new Error(messages[result.error?.code] ?? "Không thể hoàn tất yêu cầu. Vui lòng thử lại.");
  }
  return result.data as T;
}
