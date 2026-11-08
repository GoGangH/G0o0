# 블로그 관리자

블로그 안에 숨겨진 입구로 로그인 창을 엽니다. 아이디·비밀번호가 맞으면 rhrkdgus1020@naver.com으로 6자리 코드를 보내고, 코드까지 입력해야 로그인됩니다(5분 유효, 코드 하나당 3번까지 틀릴 수 있음). 로그인은 7일간 유지됩니다. `/admin`은 검색과 공개 메뉴에 포함하지 않습니다.

## 최초 설정

1. `bun run admin:hash '<긴 비밀번호>'`를 실행합니다. 출력된 `scrypt$…$…` 한 줄을 복사합니다. 실제 비밀번호를 명령에 입력하면 셸 기록에 남을 수 있으니 비밀번호 관리에 유의하세요.
2. GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token으로 이동합니다. Resource owner를 `GoGangH`, Repository access를 **Only select repositories → G0o0**, Repository permissions → **Contents: Read and write**로 설정합니다. 토큰 만료일을 정하고 생성한 값을 복사합니다. Metadata 읽기 권한은 자동으로 포함됩니다. 브랜치 보호 규칙이 직접 커밋을 막는다면 해당 브랜치에 쓸 수 있는 권한이 필요합니다.
3. `openssl rand -hex 32`로 세션 비밀키를 생성합니다.
4. Vercel 프로젝트 → Settings → Environment Variables에 다음을 추가한 뒤 재배포합니다. Production에 설정하고, Preview에서도 사용할 경우 해당 환경에도 설정합니다.

| 변수 | 값 |
| --- | --- |
| `ADMIN_ID` | 관리자 아이디 |
| `ADMIN_PASSWORD_HASH` | 1단계의 출력 전체 (Vercel에는 추가 따옴표 없이 입력) |
| `ADMIN_SESSION_SECRET` | 32자 이상 비밀키 |
| `GITHUB_TOKEN` | 2단계의 fine-grained PAT |
| `RESEND_API_KEY` | Resend API 키 (아래 "메일 인증 설정") |
| `GITHUB_REPO` | `GoGangH/G0o0` (기본값) |
| `GITHUB_BRANCH` | `main` (기본값, Vercel 배포 브랜치와 일치) |

로컬에서는 `.env.example`을 `.env.local`로 복사해 값을 입력합니다. dotenv에서 `$`가 보존되도록 `ADMIN_PASSWORD_HASH='scrypt$…$…'`처럼 작은따옴표로 감싸세요. 비밀값을 `NEXT_PUBLIC_` 변수로 만들거나 저장소에 커밋하지 마세요. 설정하지 않아도 공개 블로그 빌드는 가능합니다.

## 메일 인증 설정

1. https://resend.com 에 **rhrkdgus1020@naver.com**으로 가입합니다. 도메인을 인증하지 않은 계정은 가입한 이메일로만 보낼 수 있으므로 반드시 이 주소로 가입해야 합니다.
2. API Keys → Create API Key (권한: Sending access)로 키를 만들어 Vercel의 `RESEND_API_KEY`에 넣습니다.
3. 발신 주소는 기본값 `onboarding@resend.dev`입니다. 나중에 g0o0.com 도메인을 Resend에 인증하면 `ADMIN_MAIL_FROM="G0O0 <login@g0o0.com>"`처럼 바꿀 수 있습니다.
4. 네이버 메일에서 코드 메일이 스팸함으로 갈 수 있으니 처음 한 번 확인해 주세요.

로컬 개발(`next dev`)에서 `RESEND_API_KEY`가 없으면 코드는 메일 대신 서버 콘솔에 찍힙니다.

## 사용

목록은 GitHub에서 직접 읽으므로 아직 배포되지 않은 초안도 보입니다. 새 글에서 제목·슬러그·날짜·앨범·요약을 입력하고 작성합니다. 한글 제목의 기본 주소는 `post-YYYYMMDD-1` 형식입니다. 기존 글 주소는 고정됩니다.

편집기는 CodeMirror 6 기반이며 도구 막대와 ⌘/Ctrl+B(굵게), I(기울임), E(인라인 코드), K(링크), Z/⇧Z(실행 취소/다시 실행)를 사용할 수 있고 ⌘/Ctrl+S는 초안을 GitHub에 커밋합니다. **초안 저장**은 `draft: true`, **게시**는 `draft: false`로 저장합니다. 자동 저장은 현재 브라우저의 localStorage에만 보관하며, GitHub 커밋은 두 버튼으로 실행합니다. 공유 기기에서는 임시 저장 데이터도 지워 주세요. 같은 글을 다른 곳에서 수정했다면 SHA 충돌 오류가 나므로 로컬 내용을 복사한 뒤 목록에서 다시 여세요.

이미지는 붙여넣기·파일 드롭·이미지 버튼으로 업로드합니다. PNG/JPG/GIF/WebP/AVIF, 최대 5MB입니다. 업로드마다 `public/blog/<slug>/…`에 독립 커밋을 만듭니다. 편집 중에는 메모리의 이미지 URL로 바로 보이고, 공개 사이트에는 다음 Vercel 배포 후 제공됩니다. 게시하지 않고 닫아도 이미 커밋된 이미지는 남습니다. Vercel 함수의 요청 본문 한도에 따라 약 4.5MB 이상 파일은 플랫폼에서 먼저 거절될 수 있습니다.

커밋 후 일반적으로 1~2분 뒤 반영되며 Vercel 배포가 실패하면 이전 공개 버전이 유지됩니다. PAT 만료 시 새 토큰으로 환경변수를 갱신하고 재배포하세요. `ADMIN_SESSION_SECRET`을 바꾸면 기존 세션을 모두 무효화할 수 있습니다. 로그인 실패 제한은 인스턴스 메모리 기반의 보조 장치입니다.

## 개발 확인

`bun test src/lib/admin`, `bun run lint`, `bun run build`. 관리자 환경변수가 없어도 공개 블로그 빌드는 통과합니다.
