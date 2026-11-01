---
title: "외부 API에 기대지 않고 테스트 59개를 돌리기"
date: "2026-11-02"
category: "testing"
tags: ["pytest", "fastapi", "mock"]
summary: "Logit에서 테스트 DB 의존성 주입과 외부 API mock을 구성해 4개 모듈에 59개 자동화 테스트를 만든 방식입니다."
draft: false
---

## 테스트가 어려운 서비스

Logit은 FastAPI 서버가 PostgreSQL, Redis, Qdrant, OpenAI API와 함께 동작합니다. 이런 구조를 그대로 테스트하면 문제가 생깁니다.

- 테스트가 실제 데이터를 건드릴 수 있습니다.
- 외부 API 응답에 따라 결과가 달라집니다.
- 호출할 때마다 비용과 시간이 듭니다.

그래서 경계를 두 군데로 나눴습니다. **DB는 테스트용으로 바꿔 끼우고, 외부 API는 mock으로 대체**했습니다.

## 의존성 주입으로 DB 바꾸기

FastAPI는 `Depends`로 받은 의존성을 테스트에서 덮어쓸 수 있습니다.

```python
# 구조를 설명하기 위한 예시 코드입니다.
@pytest.fixture
def client(test_session):
    app.dependency_overrides[get_session] = lambda: test_session
    yield TestClient(app)
    app.dependency_overrides.clear()
```

애플리케이션 코드는 그대로 두고 연결만 바꾸므로, 실제 요청과 같은 경로를 탑니다.

## 외부 API는 응답을 고정한다

AI 응답을 실제로 받으면 같은 입력에도 결과가 달라집니다. 여기서 확인할 것은 모델의 품질이 아니라 **우리 코드가 응답을 올바르게 처리하는가**입니다.

```python
# 구조를 설명하기 위한 예시 코드입니다.
def test_chat(client, monkeypatch):
    monkeypatch.setattr("app.ai.complete", fake_complete)
    assert client.post("/chat", json={"message": "안녕"}).status_code == 200
```

## 무엇을 얻었나

이렇게 4개 모듈에 59개 자동화 테스트를 구성해, 주요 사용자 흐름의 회귀를 배포 전에 확인할 수 있게 했습니다.

## 정리

좋은 테스트 환경의 기준은 개수가 아니라 **언제 돌려도 같은 결과가 나오는가**입니다. 그러려면 내가 통제할 수 없는 것을 먼저 찾아 경계 밖으로 밀어내야 합니다.
