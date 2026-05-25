# Hướng dẫn thiết lập Backend

Để hệ thống hoạt động, bạn cần thực hiện 2 bước sau:

### 1. Cấu hình biến môi trường (.env.local)
Tạo file `.env.local` trong thư mục `tierlist-app/` và điền thông tin sau:

```env
# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
```

### 2. Thiết lập Supabase Database
Truy cập vào [Supabase SQL Editor](https://app.supabase.com/) và chạy các lệnh SQL sau để tạo bảng:

```sql
-- 1. Bảng tin nhắn chat
CREATE TABLE community_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  user_avatar TEXT,
  text TEXT NOT NULL,
  role TEXT DEFAULT 'member',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bật Realtime cho bảng chat
ALTER PUBLICATION supabase_realtime ADD TABLE community_messages;

-- 2. Bảng lịch thi đấu
CREATE TABLE match_events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  format TEXT NOT NULL, -- e.g. '5v5', '1v1'
  room_code TEXT,
  match_time TIMESTAMP WITH TIME ZONE NOT NULL,
  created_by TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Mock dữ liệu mẫu cho Lịch
INSERT INTO match_events (title, format, room_code, match_time)
VALUES 
('Giao hữu nội bộ CLB', '5v5', 'LQM-9988', NOW() + interval '2 hours'),
('Solo Yasuo... nhầm, Solo Flo', '1v1', 'SOLO-77', NOW() + interval '1 day');
```

### 3. Phân quyền Admin (Announcer) trong Clerk
Để một người có quyền "Thêm lịch", bạn hãy:
1. Vào **Clerk Dashboard** -> **Users**.
2. Chọn User bạn muốn cấp quyền.
3. Tìm phần **Metadata** -> **Public Metadata**.
4. Sửa thành:
```json
{
  "role": "announcer"
}
```
5. Khi User đó login lại, họ sẽ thấy nút "THÊM LỊCH".
