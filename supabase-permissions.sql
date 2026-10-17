-- Supabase SQL Editor에서 한 번 실행하세요. 방문자는 접수만 가능하며 조회/수정/삭제할 수 없습니다.
begin;
alter table public.inquiries enable row level security;
revoke all on table public.inquiries from anon, authenticated;
grant insert (customer_name, email, phone, service, message)
  on table public.inquiries to anon;
drop policy if exists "website_inquiry_insert" on public.inquiries;
create policy "website_inquiry_insert"
on public.inquiries for insert to anon
with check (
  char_length(trim(customer_name)) between 1 and 80
  and char_length(email) between 3 and 254
  and email ~ '^[^[:space:]@]+@[^[:space:]@]+[.][^[:space:]@]+$'
  and (phone is null or char_length(phone) <= 30)
  and service in ('일반 상담', '맞춤 PC 견적', '조립PC', 'PC 수리', '업그레이드', '네트워크·CCTV', '데일리 오피스', '플레이 게이밍', '스튜디오 워크')
  and char_length(trim(message)) between 1 and 2000
  and status = '접수'
);
commit;
