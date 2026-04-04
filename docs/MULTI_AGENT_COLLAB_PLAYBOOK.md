# Multi-Agent Git Playbook (Codex + Manus)

## Vấn đề gốc

Khi 2 AI Agents (Codex và Manus) cùng làm việc với nhiều tài khoản khác nhau, lỗi nghiêm trọng thường xảy ra theo chuỗi sau:

1. Agent B làm việc trên bản clone cũ.
2. Agent A đã đẩy commit mới lên remote.
3. Agent B commit và push trực tiếp từ nền cũ.
4. Kết quả là lịch sử bị lệch, và dễ gây mất/thất lạc thay đổi mới của Agent A (đặc biệt khi rebase sai hoặc force push).

Đây là lỗi **quy trình đồng bộ** hơn là lỗi coding.

---

## Mục tiêu “triệt để”

Thiết lập quy trình sao cho:

- Không ai được commit/push khi chưa đồng bộ với remote mới nhất.
- Mọi thay đổi đều đi qua nhánh riêng + Pull Request.
- Có bước kiểm tra tự động để chặn push nguy hiểm.
- Có cơ chế handoff rõ ràng khi một agent hết phiên/hết tín dụng.

---

## Quy trình bắt buộc (SOP)

### 1) Luôn làm việc trên nhánh task riêng

- Cấm làm việc trực tiếp trên `main`.
- Mỗi phiên tạo nhánh mới:
  - `agent/codex/<ticket-or-date>`
  - `agent/manus/<ticket-or-date>`

### 2) Trước khi code phải “fresh sync”

Chạy bắt buộc:

```bash
git fetch --all --prune
git switch main
git pull --ff-only
git switch -c agent/<name>/<task>
```

Nếu `git pull --ff-only` không thành công, phải xử lý divergence trước khi code.

### 3) Trước khi commit phải re-check độ mới

```bash
git fetch origin
git status -sb
git log --oneline --decorate --graph -20
```

Nếu `main` ở remote đã đổi, rebase/merge nhánh task lên nền mới nhất:

```bash
git rebase origin/main
# hoặc git merge origin/main
```

### 4) Chỉ tích hợp qua Pull Request

- Cấm push trực tiếp `main`.
- Bật branch protection cho `main`:
  - Require PR
  - Require up-to-date branch trước khi merge
  - Require status checks
  - Restrict force pushes (tắt hoàn toàn)

### 5) Quy tắc handoff khi đổi agent/đổi tài khoản

Mỗi lần bàn giao phải có file handoff (ví dụ `docs/handoffs/YYYY-MM-DD-<agent>.md`) gồm:

- Base commit SHA đã dùng để làm việc.
- Danh sách file đã sửa.
- Lệnh đã chạy để test.
- Trạng thái chưa hoàn tất.
- Link nhánh/PR hiện tại.

Agent tiếp theo **không được** tiếp tục từ local cũ; phải clone/fetch mới và checkout đúng nhánh PR.

### 6) Cấm force push trừ tình huống khẩn cấp có duyệt tay

- Mặc định: `git config --global push.default simple`
- Khuyến nghị alias an toàn:

```bash
git config --global alias.safe-push 'push --force-with-lease'
```

- Không dùng `--force` thuần.

---

## Guardrails tự động nên bật ngay

### A. Pre-push hook chặn nhánh cũ

Thêm `.git/hooks/pre-push` (hoặc dùng Husky) để chặn khi local không chứa commit mới nhất của `origin/main`.

Logic:

1. `git fetch origin main`
2. `git merge-base --is-ancestor origin/main HEAD`
3. Nếu false => chặn push + báo “Bạn đang push từ nền cũ, hãy rebase/merge trước”.

### B. CI check cho PR

Trong CI, fail nếu nhánh PR chưa update với `origin/main` tại thời điểm chạy.

### C. CODEOWNERS cho vùng nhạy cảm

Bắt review bắt buộc với file trọng yếu (`index.html`, `scripts/`, `sw.js`, manifest, deployment config).

---

## Mẫu quy trình thao tác ngắn gọn cho mỗi phiên

1. `git fetch --all --prune`
2. `git switch main && git pull --ff-only`
3. Tạo nhánh task mới.
4. Code + test.
5. `git fetch origin && git rebase origin/main`
6. Push nhánh task.
7. Mở PR, chờ checks xanh, merge qua PR.
8. Ghi handoff note (nếu bàn giao).

---

## Playbook xử lý khi đã lỡ mất thay đổi

Nếu Manus đã vô tình ghi đè thay đổi Codex:

1. Tìm commit mất bằng:

```bash
git reflog --all
git log --all --graph --decorate --oneline
```

2. Tạo nhánh cứu hộ từ commit chứa thay đổi Codex:

```bash
git switch -c recovery/codex-restore <sha>
```

3. Cherry-pick hoặc merge commit cần khôi phục vào nhánh hiện tại.
4. Tạo PR “restore lost changes” để review rõ ràng.

---

## Checklist bắt buộc trước khi merge

- [ ] Nhánh đã update với `origin/main` mới nhất.
- [ ] Không có force push nguy hiểm.
- [ ] CI pass.
- [ ] Có ít nhất 1 review độc lập (agent/account còn lại).
- [ ] Có handoff note nếu nhiệm vụ chưa hoàn tất.

Nếu tuân thủ đủ checklist này, nguy cơ mất thay đổi giữa Codex và Manus giảm về mức rất thấp và hầu như loại bỏ được lỗi “commit từ clone cũ”.
